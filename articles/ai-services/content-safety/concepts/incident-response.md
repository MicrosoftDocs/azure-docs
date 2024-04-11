

Incident response in content moderation scenarios is the process of identifying, analyzing, containing, eradicating, and recovering from cyber incidents that involve inappropriate or harmful content on online platforms. An incident may involve a set of emerging content patterns (text, image, or other modalities) that violate Microsoft community guidelines or customers' policies and expectations. These incidents need to be mitigated quickly and accurately to avoid potential live site issues or harm to users and communities. 

Using [Blocklists](https://learn.microsoft.com/azure/ai-services/content-safety/how-to/use-blocklist) is one way to deal with emerging content incidents, but it only allows exact text matching, and no image matching. The Azure AI Content Safety incident response API offers the advanced capabilities of semantic text matching using embedding search with a lightweight classifier, and image matching with a lightweight object-tracking model and embedding search.



## Limitations
| Object     | Limitation                                                  |
| :------------ | :------------------ |
| Maximum length of an incident name | 100 characters | 
| Maximum number of samples per text/image incident | 1000 |
|Maximum size of each sample | Text less than 500 characters, Image less than 4M  |
| Maximum number of text or image incidents | 100 |  
| Supported Image format | BMP, GIF, JPEG, PNG, TIF, WEBP|
| Supported language for text incident response | All languages that supported by Azure AI Content Safety | 

