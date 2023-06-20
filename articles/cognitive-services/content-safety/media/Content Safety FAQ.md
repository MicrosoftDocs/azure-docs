# Azure AI Content Safety FAQ 

 ### Q: What is the difference between Azure Content Moderator and Azure AI Content Safety services?
A: Azure Content Moderator is an AI service that checks text and images for material that is offensive, risky, or otherwise undesirable. Azure AI Content Safety is a content moderation platform that uses AI to keep your content safe by detecting offensive or inappropriate content in text and images quickly and efficiently.


The main differences between the two services are:

* Azure Content Moderator uses the binary classification for each content type (such as profanity or adult), while Azure AI Content Safety uses multiple classes with different severity levels (such as sexual, violent, hate, and self-harm).

* Azure Content Safety supports multilingual content moderation in English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese with AI classifiers while Azure Content Moderator’s AI classifiers only support English.

* Azure Content Moderator has a built-in term list and a custom term list feature, while Azure AI Content Safety does not have a built-in term list feature but relies on advanced language and vision models to detect harmful content and provides a custom term list feature for incident response and customization.

* Azure AI Content Safety has an interactive studio for exploring and testing the service capabilities, whereas Azure Content Moderator does not.

### Q: Why should I migrate from Azure Content Moderator to Azure AI Content Safety?
A: Microsoft recommends that customers who are using Azure Content Moderator migrate to Azure AI Content Safety because:

* Azure AI Content Safety offers more accurate and granular detection of harmful content in text and images using state-of-the-art AI models.

* Azure AI Content Safety supports multilingual content moderation in English, Japanese, German, Spanish, French, Portuguese, Italian, and Chinese.

* Azure AI Content Safety enables responsible AI practices by monitoring both user-generated and generative AI content.
