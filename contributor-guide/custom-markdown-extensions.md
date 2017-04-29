# Custom markdown extensions
For general markdown tips, see [Markdown Basics](https://help.github.com/articles/markdown-basics/) and our [markdown cheatsheet](./media/documents/markdown-cheatsheet.pdf?raw=true). If you need to create article crosslinks in markdown, see the [linking guidance](create-links-markdown.md#markdown-syntax-for-acom-relative-links.md/).

[Fenced code blocks](https://help.github.com/articles/github-flavored-markdown/#fenced-code-blocks) and [syntax highlighting](https://help.github.com/articles/github-flavored-markdown/#syntax-highlighting) are supported.

## Custom markdown extensions used in our technical articles
Our articles use GitHub flavored markdown for most article formatting - paragraphs, links, lists, headings, etc. But we use custom markdown extensions where we need richer formatting in the rendered pages on azure.microsoft.com. Here's the extensions we are currently using:

* [Notes and tips]
* [Includes]
* [Embedded videos]
* [Technology and platform selectors]

## Notes and tips
You can choose from 4 types of notes and tips:

* NOTE
* WARNING
* TIP
* IMPORTANT

In general, use notes and tips sparingly throughout your articles. When you do use them, choose the appropriate type of note or tip:

* Use [!NOTE] to highlight neutral or positive information that emphasizes or supplements key points of the main text. A note supplies information that applies only in special cases.
* Use [!WARNING] to alert the user to a condition that might cause a problem in the future. For example, selecting a certain option or making a certain choice might permanently lock you into a particular scenario.
* Use [!TIP] to help your users apply the techniques and procedures described in the text to their specific needs. A tip might also suggest alternative methods that may not be obvious. Tips, however, are not essential to the basic understanding of the text.
* Use [!IMPORTANT] to provide information that is essential to the completion of a task.

While these notes and tips support code blocks, images, lists, and links, try to keep your notes and tips simple and straightforward. If you find yourself creating complex notes with lots of formatting, that might be a sign you just need another section in the main text of the article. And, too many notes in an article can be distracting and hard to scan or read.

Here's sample markdown for a note with a single paragraph:

    > [!NOTE]
    > To complete this tutorial, you must have an active Microsoft Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes.

Multiparagraph:

    > [!NOTE]
    > To complete this tutorial, you must have an active Microsoft Azure account.
    >
    > If you don't have an account, you can [create a free trial account](http://www.windowsazure.com/pricing/free-trial/) in just a couple of minutes.

## Includes
Reusable text in our GitHub repository resides in files that we call "includes". When you have text that needs to be used in multiple articles, you include a reference to that file of reusable information. The include itself is a simple markdown (.md) file. It can contain any valid markdown, including text, links, and images. All include markdown files must be in [the /includes directory](../includes.md) in the root of the repository. When the article is published, the include text is seamlessly integrated into the published topic.

* Use includes wherever you need the same text to appear in multiple articles.
* Includes are meant to be used for significant amounts of content - a paragraph or two, a shared procedure, or a shared section. Do not use them for anything smaller than a sentence; **they are not for product names**.
* Includes won't render in the GitHub rendered view of your article. They render only after publication.
* Ensure all the text in an include is written in complete sentences or phrases that do not depend on preceding text or following text in the article that references the include. Ignoring this guidance creates an untranslatable string in the article that breaks the localized experience.
* Don't embed includes within other includes. They are not supported.
* Media files you put in an include must be created in a media folder specific to the include. Media folders for includes belong in [the azure-content/includes/media folder](../includes/media.md). The media directory should not contain any images in its root. If the include does not have images, then a corresponding media directory is not required.
* Don't share media between files. Use a separate file with a unique name for each include and article. Store the media file in the media folder associated with the include.
* Don't use an include as the only content of an article.  Includes are meant to be supplemental to the content in the rest of the article.
* Do NOT repeat a link or image filename reference in both the article and the include. Add "-include" to the link reference or media filename to avoid repeating the reference:
  
  **Link reference**
  
  Change: odata.org
  To: odata.org-include
  
  **Image reference**
  
  Change: table.png
  To: table-include.png

The syntax for adding an include to a documentation article is:

    [!INCLUDE [include-short-name](../../includes/include-file-name.md)]

Example

    [!INCLUDE [howto-blob-storage](../../includes/howto-blob-storage.md)]

The first part of the include is the include name without the path and without the .md extension. The second part is the relative path to the include in the /includes directory, with the .md extension.

## Embedded videos
Our technical articles support embedded videos in technical articles as long as the videos are on Microsoft's [Channel 9](http://channel9.msdn.com/) site. We currently do not support embedded YouTube videos; if you're a community contributor, you are welcome to link to YouTube if the video you want to feature is posted there. Microsoft contributors should use Channel 9 and the Video Center. The syntax is simple:

    >[!VIDEO url-of-channel-9-video]

## Technology and platform selectors
Use technology and platform switchers in technical articles when you author multiple flavors of the same article to address differences in implementation across technologies or platforms. This is typically most applicable to our mobile platform content for developers. There are currently two different types of selectors, [simple selectors](#simple-selectors) and [two-way selectors](#two-way-selectors).

Because the same selector markdown goes in each topic in the selection, we recommend placing the selector for your topic in an include, then referencing that include in all of your topics that use the same selector.

### <a id="simple-selectors"></a>Simple selectors
Simple (one-way) selectors render as a set of option buttons right below the title. Use these buttons when customers need to choose from topics in a single platform or technology set, such as .NET, Node.js, and Java.  Use the custom markdown extension for any selectors - do not use HTML for selectors.  

Syntax:

    > [!div class="op_single_selector"]
    > * [platform, language or method](article-file-name)
    > * [platform, language or method](article-file-name)
    > * [platform, language or method](article-file-name)

### <a id="two-way-selectors"></a>Two-way selectors
Two-way selectors let users select topics from a two way matrix. This is essential when an Azure technology supports multiple backend platforms as well as multiple clients.

Syntax:

    > [!div class="op_multi_selector" title1="OS" title2="Creation method"]
    > * [platform | dev language](article-file-name.md)
    > * [platform | dev language](article-file-name.md)
    > * [platform | dev language](article-file-name.md)
    > * [platform | dev language](article-file-name.md)



<!--Anchors-->
[Notes and tips]: #notes-and-tips
[Includes]: #includes
[Embedded videos]: #embedded-videos
[Technology and platform selectors]: #technology-and-platform-selectors

### Contributors' Guide Links
* [Overview article](../README.md)
* [Index of guidance articles](contributor-guide-index.md)

