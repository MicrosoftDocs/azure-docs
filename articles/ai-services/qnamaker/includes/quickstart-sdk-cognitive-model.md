
## Using this example knowledge base

The knowledge base in this quickstart starts with 2 conversational QnA pairs, this is done on purpose to simplify the example and to have highly predictable Ids to use in the Update method, associating follow-up prompts with questions to new pairs. This was planned and implemented in a specific order for this quickstart.

If you plan to develop your knowledge base over time with follow-up prompts that are dependent on existing QnA pairs, you may choose:
* For larger knowledgebases, manage the knowledge base in a text editor or TSV tool that supports automation, then completely replace the knowledge base at once with an update.
* For smaller knowledgebases, manage the follow-up prompts entirely in the QnA Maker portal.

Details about the QnA pairs used in this quickstart:
* Types of QnA pair - there are 2 types of QnA pairs in this knowledge base, after the update: chitchat and domain-specific information. This is typical if your knowledgebase is tied to a conversation application such as a chatbot.
* While the knowledgebase answers could be filtered by metadata or use followup prompts, this quickstart doesn't show that. Look for those language-agnostic generateAnswer examples [here](../quickstarts/get-answer-from-knowledge-base-using-url-tool.md).
* Answer text is markdown and can contain a [wide variety of markdown](../reference-markdown-format.md) such as images (publicly available internet-based images), links (to publicly available URLs), and bullet points, this quickstart doesn't use that variety.
