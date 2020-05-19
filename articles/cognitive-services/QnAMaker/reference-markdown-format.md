---
title: Markdown format - QnA Maker
description: Following is the list of markdown formats that you can use in QnA Maker's answer text.
ms.topic: reference
ms.date: 03/19/2020
---

# Markdown format supported in QnA Maker answer text

QnA Maker stores answer text as markdown. There are many flavors of markdown. In order to make sure the answer text is returned and displayed correctly, use this reference.

Use the **[CommonMark](https://commonmark.org/help/tutorial/index.html)** tutorial to validate your Markdown. The tutorial has a **Try it** feature for quick copy/paste validation.

## When to use rich-text editing versus markdown

[Rich-text editing](How-To/edit-knowledge-base.md#add-an-editorial-qna-set) of answers allows you, as the author, to use a formatting toolbar to quickly select and format text.

Markdown is a better tool when you need to autogenerate content to create knowledge bases to be imported as part of a CI/CD pipeline or for [batch testing](Quickstarts/batch-testing.md).

## Supported markdown format

Following is the list of markdown formats that you can use in QnA Maker's answer text.

|Purpose|Format|Example markdown|Rendering<br>as displayed in Chat bot|
|--|--|--|--|
A new line between 2 sentences.|`\n\n`|`How can I create a bot with \n\n QnA Maker?`|![format new line between two sentences](./media/qnamaker-concepts-datasources/format-newline.png)|
|Headers from h1 to h6, the number of `#` denotes which header. 1 `#` is the h1.|`\n# text \n## text \n### text \n####text \n#####text` |`## Creating a bot \n ...text.... \n### Important news\n ...text... \n### Related Information\n ....text...`<br><br>`\n# my h1 \n## my h2\n### my h3 \n#### my h4 \n##### my h5`|![format with markdown headers](./media/qnamaker-concepts-datasources/format-headers.png)<br>![format with markdown headers H1 to H5](./media/qnamaker-concepts-datasources/format-h1-h5.png)|
|Italics |`*text*`|`How do I create a bot with *QnA Maker*?`|![format with italics](./media/qnamaker-concepts-datasources/format-italics.png)|
|Strong (bold)|`**text**`|`How do I create a bot with **QnA Maker**?`|![format with strong marking for bold](./media/qnamaker-concepts-datasources/format-strong.png)|
|URL for link|`[text](https://www.my.com)`|`How do I create a bot with [QnA Maker](https://www.qnamaker.ai)?`|![format for URL (hyperlink)](./media/qnamaker-concepts-datasources/format-url.png)|
|*URL for public image|`![text](https://www.my.com/image.png)`|`How can I create a bot with ![QnAMaker](https://review.docs.microsoft.com/azure/cognitive-services/qnamaker/media/qnamaker-how-to-key-management/qnamaker-resource-list.png)`|![format for public image URL ](./media/qnamaker-concepts-datasources/format-image-url.png)|
|Strikethrough|`~~text~~`|`some ~~questoins~~ questions need to be asked`|![format for strikethrough](./media/qnamaker-concepts-datasources/format-strikethrough.png)|
|Bold and italics|`***text***`|`How can I create a ***QnA Maker*** bot?`|![format for bold and italics](./media/qnamaker-concepts-datasources/format-bold-italics.png)|
|Bold URL for link|`[**text**](https://www.my.com)`|`How do I create a bot with [**QnA Maker**](https://www.qnamaker.ai)?`|![format for bold URL](./media/qnamaker-concepts-datasources/format-bold-url.png)|
|Italics URL for link|`[*text*](https://www.my.com)`|`How do I create a bot with [*QnA Maker*](https://www.qnamaker.ai)?`|![format for italics URL](./media/qnamaker-concepts-datasources/format-url-italics.png)|
|Escape markdown symbols|`\*text\*`|`How do I create a bot with \*QnA Maker\*?`|![format for italics URL](./media/qnamaker-concepts-datasources/format-escape-markdown-symbols.png)|
|Ordered list|`\n 1. item1 \n 1. item2`|`This is an ordered list: \n 1. List item 1 \n 1. List item 2`<br>The preceding example uses automatic numbering built into markdown.<br>`This is an ordered list: \n 1. List item 1 \n 2. List item 2`<br>The preceding example uses explicit numbering.|![format for ordered list](./media/qnamaker-concepts-datasources/format-ordered-list.png)|
|Unordered list|`\n * item1 \n * item2`<br>or<br>`\n - item1 \n - item2`|`This is an unordered list: \n * List item 1 \n * List item 2`|![format for unordered list](./media/qnamaker-concepts-datasources/format-unordered-list.png)|
|Nested lists|`\n * Parent1 \n\t * Child1 \n\t * Child2 \n * Parent2`<br><br>`\n * Parent1 \n\t 1. Child1 \n\t * Child2 \n 1. Parent2`<br><br>You can nest ordered and unordered lists together. The tab, `\t`, indicates the indentation level of the child element.|`This is an unordered list: \n * List item 1 \n\t * Child1 \n\t * Child2 \n * List item 2`<br><br>`This is an ordered nested list: \n 1. Parent1 \n\t 1. Child1 \n\t 1. Child2 \n 1. Parent2`|![format for nested unordered list](./media/qnamaker-concepts-datasources/format-nested-unordered-list.png)<br>![format for nested ordered list](./media/qnamaker-concepts-datasources/format-nested-ordered-list.png)|

*QnA Maker doesn't process the image in any way. It is the client application's role to render the image.

If you want to add content using update/replace knowledge base APIs and the content/file contains html tags, you can preserve the HTML in your file by ensuring that opening and closing of the tags are converted in the encoded format.

| Preserve HTML  | Representation in the API request  | Representation in KB |
|-----------|---------|-------------------------|
| Yes | \&lt;br\&gt; | &lt;br&gt; |
| Yes | \&lt;h3\&gt;header\&lt;/h3\&gt; | &lt;h3&gt;header&lt;/h3&gt; |

Additionally, CR LF(\r\n) are converted to \n in the KB. LF(\n) is kept as is. If you want to escape any escape sequence like a \t or \n you can use backslash, for example: '\\\\r\\\\n' and '\\\\t'

## Next steps

Review batch testing [file formats](reference-tsv-format-batch-testing.md).
