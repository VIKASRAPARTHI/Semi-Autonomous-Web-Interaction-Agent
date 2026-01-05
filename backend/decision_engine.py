from bs4 import BeautifulSoup
import random
from urllib.parse import urlparse, urljoin

class DecisionEngine:
    def __init__(self):
        self.visited_urls = set()
        self.clicked_elements = set()
        self.current_url = None
        self.base_domain = None
    
    def set_current_url(self, url: str):
        """Track current URL and extract base domain"""
        self.current_url = url
        parsed = urlparse(url)
        self.base_domain = f"{parsed.scheme}://{parsed.netloc}"
    
    def is_internal_link(self, url: str) -> bool:
        """Check if URL is internal to the current domain"""
        if not url or not self.base_domain:
            return False
        
        # Handle relative URLs
        if url.startswith('/'):
            return True
        
        parsed = urlparse(url)
        current_parsed = urlparse(self.base_domain)
        return parsed.netloc == current_parsed.netloc or parsed.netloc == ''
    
    def analyze(self, html_content: str):
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Extract meaningful elements
        all_links = []
        for a in soup.find_all('a', href=True):
            href = a.get('href')
            text = a.get_text(strip=True)
            
            # Filter out navigation/footer links
            if text and len(text) > 2 and len(text) < 100:
                # Convert relative to absolute
                if href.startswith('/') and self.current_url:
                    href = urljoin(self.current_url, href)
                
                # Only include internal links
                if self.is_internal_link(href):
                    all_links.append({
                        'url': href,
                        'text': text,
                        'visited': href in self.visited_urls
                    })
        
        buttons = [b.get_text(strip=True) for b in soup.find_all('button')]
        inputs = [i.get('name') or i.get('id') for i in soup.find_all('input')]
        
        # Basic Heuristics
        title = soup.title.string if soup.title else "No Title"
        
        # Filter unvisited links
        unvisited_links = [l for l in all_links if not l['visited']]
        
        analysis = {
            "title": title,
            "link_count": len(all_links),
            "unvisited_link_count": len(unvisited_links),
            "button_count": len(buttons),
            "input_count": len(inputs),
            "links": all_links[:20],  # Top 20
            "unvisited_links": unvisited_links[:10],  # Top 10 unvisited
            "buttons": buttons[:5]
        }
        return analysis

    def decide_next_action(self, analysis: dict):
        """Intelligent decision making with state tracking"""
        
        # Priority 1: Explore unvisited internal links
        if analysis['unvisited_link_count'] > 0:
            # Pick a random unvisited link
            target_link = random.choice(analysis['unvisited_links'])
            target_url = target_link['url']
            
            # Mark as visited
            self.visited_urls.add(target_url)
            
            return {
                "type": "NAVIGATE",
                "target": target_url,
                "reason": f"Exploring unvisited link: {target_link['text'][:50]}"
            }
        
        # Priority 2: If all links visited, try a visited one (for deeper exploration)
        if analysis['link_count'] > 0:
            target_link = random.choice(analysis['links'])
            return {
                "type": "NAVIGATE",
                "target": target_link['url'],
                "reason": f"Re-exploring: {target_link['text'][:50]}"
            }
        
        # No actionable elements
        return {
            "type": "WAIT",
            "reason": "No more links to explore on this page"
        }
