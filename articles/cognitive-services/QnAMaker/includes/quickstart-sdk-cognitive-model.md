## Knowledge base as cognitive model

The knowledge base created and updated in this quickstart is a cognitive model with several items you should understand:
* Front-load knowledgebase - the knowledge base is specifically create with 2 editorial QnA pairs. These will be referenced in the Update call as prompts, identified by the question Id.
* Types of QnA pair - there are 2 types of QnA pairs in this knowledge base, after the update: chitchat and domain-specific information. This is typical if you knowledgebase is tied to a conversation application such as a chatbot.
* While the knowledgebase answers could be filtered by metadata or use followup prompts, this quickstart doesn't show that. Look for those language-agnostic generateAnswer examples [here](../get-answer-from-knowledge-base-using-url-tool.md).
* Answer test is markdown and can contain a wide variety of markdown such as images (publicly available internet-based images), links (to publicly available URLs), and bullet points, this quickstart doesn't use that variety.
