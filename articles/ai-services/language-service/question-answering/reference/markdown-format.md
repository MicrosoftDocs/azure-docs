---
title: Markdown format - question answering
description: Following is the list of markdown formats that you can use your answer text.
ms.service: azure-ai-language
ms.author: jboback
author: jboback
ms.topic: reference
ms.date: 01/21/2022
---

# Markdown format supported in answer text

Question answering stores answer text as markdown. There are many flavors of markdown. In order to make sure the answer text is returned and displayed correctly, use this reference.

Use the **[CommonMark](https://commonmark.org/help/tutorial/index.html)** tutorial to validate your markdown. The tutorial has a **Try it** feature for quick copy/paste validation.

## When to use rich-text editing versus markdown

Rich-text editing of answers allows you, as the author, to use a formatting toolbar to quickly select and format text.

Markdown is a better tool when you need to autogenerate content to create projects to be imported as part of a CI/CD pipeline or for batch testing.

## Supported markdown format

Following is the list of markdown formats that you can use in your answer text.

|Purpose|Format|Example markdown|
|--|--|--|
A new line between 2 sentences.|`\n\n`|`How can I create a bot with \n\n question answering?`|
|Headers from h1 to h6, the number of `#` denotes which header. 1 `#` is the h1.|`\n# text \n## text \n### text \n####text \n#####text` |`## Creating a bot \n ...text.... \n### Important news\n ...text... \n### Related Information\n ....text...`<br><br>`\n# my h1 \n## my h2\n### my h3 \n#### my h4 \n##### my h5`|
|Italics |`*text*`|`How do I create a bot with *question answering*?`|
|Strong (bold)|`**text**`|`How do I create a bot with **question answering***?`|
|URL for link|`[text](https://www.my.com)`|`How do I create a bot with [question answering](https://language.cognitive.azure.com/)?`|
|*URL for public image|`![text](https://www.my.com/image.png)`|`How can I create a bot with ![question answering](path-to-your-image.png)`|
|Strikethrough|`~~text~~`|`some ~~questions~~ questions need to be asked`|
|Bold and italics|`***text***`|`How can I create a ***question answering**** bot?`|
|Bold URL for link|`[**text**](https://www.my.com)`|`How do I create a bot with [**question answering**](https://language.cognitive.azure.com/)?`|
|Italics URL for link|`[*text*](https://www.my.com)`|`How do I create a bot with [*question answering*](https://language.cognitive.azure.com/)?`|
|Escape markdown symbols|`\*text\*`|`How do I create a bot with \*question answering*\*?`|
|Ordered list|`\n 1. item1 \n 1. item2`|`This is an ordered list: \n 1. List item 1 \n 1. List item 2`<br>The preceding example uses automatic numbering built into markdown.<br>`This is an ordered list: \n 1. List item 1 \n 2. List item 2`<br>The preceding example uses explicit numbering.|
|Unordered list|`\n * item1 \n * item2`<br>or<br>`\n - item1 \n - item2`|`This is an unordered list: \n * List item 1 \n * List item 2`|
|Nested lists|`\n * Parent1 \n\t * Child1 \n\t * Child2 \n * Parent2`<br><br>`\n * Parent1 \n\t 1. Child1 \n\t * Child2 \n 1. Parent2`<br><br>You can nest ordered and unordered lists together. The tab, `\t`, indicates the indentation level of the child element.|`This is an unordered list: \n * List item 1 \n\t * Child1 \n\t * Child2 \n * List item 2`<br><br>`This is an ordered nested list: \n 1. Parent1 \n\t 1. Child1 \n\t 1. Child2 \n 1. Parent2`|

* Question answering doesn't process the image in any way. It is the client application's role to render the image.

If you want to add content using update/replace project APIs and the content/file contains html tags, you can preserve the HTML in your file by ensuring that opening and closing of the tags are converted in the encoded format.

| Preserve HTML  | Representation in the API request  | Representation in KB |
|-----------|---------|-------------------------|
| Yes | \&lt;br\&gt; | &lt;br&gt; |
| Yes | \&lt;h3\&gt;header\&lt;/h3\&gt; | &lt;h3&gt;header&lt;/h3&gt; |

Additionally, `CR LF(\r\n)` are converted to `\n` in the KB. `LF(\n)` is kept as is. If you want to escape any escape sequence like a \t or \n you can use backslash, for example: '\\\\r\\\\n' and '\\\\t'

## Next steps

* [Import a project](../how-to/migrate-knowledge-base.md)
