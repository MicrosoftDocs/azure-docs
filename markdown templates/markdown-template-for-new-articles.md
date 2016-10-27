---
title: Page title that displays in the browser tab and search results | Microsoft Docs
description: Article description that will be displayed on landing pages and in most search results
services: service-name
documentationcenter: dev-center-name
author: GitHub-alias-of-only-one-author
manager: manager-alias


ms.service: required
ms.devlang: may be required
ms.topic: article
ms.tgt_pltfrm: may be required
ms.workload: required
ms.date: mm/dd/yyyy
ms.author: Your MSFT alias or your full email address;semicolon separates two or more aliases

---
# Markdown template for Azure on Microsoft Docs

Your article should have only on H1 heading, which you create with a single # sign. The the H1 heading should always be followed by a descriptive paragraph that helps the customer understand what the article is about. It should contain keywords you think customers would use to search for this piece of content. Do not start the article with a note or tip - always start with an introductory paragraph.

## Headings 

Two ## signs create an H2 heading - if your article needs to be structured with headings below the H1, you need to have at least TWO H2 headings.

H2 headings are rendered on the page as an automatic on-page TOC. Do not hand-code article navigation in an article. Use the H2 headings to do that.

Within an H2 section, you can use three ### signs to create H3 headings. In our content, try to avoid going deeper than 3 heading layers - the headings are often hard to distinguish on the rendered page. 

## Images
You can use images throughout a technical article. Make sure you include alt text for all your images. This helps accessibility and discoverability.

  ![Alt text; do not leave blank. Describe image.][8]

  ![Alt text; do not leave blank. Collector car in racing red.][5]

## Linking
Your article will most likely contain links. Here's a sample link to a target not on the docs.microsoft.com site:

    [Link text for link outside of azure.microsoft.com](http://weblogs.asp.net/scottgu). 

Here's a sample link to another technical article in the azure-docs-pr repository:

    [example link text for link to an article in a service folder](../expressroute/expressroute-bandwidth-upgrade.md).

You can also use so-called reference style links where you define the links at the bottom of the article, and reference them like this:

    I get 10 times more traffic from [Google][gog] than from [Yahoo][yah] or [MSN][msn].

For information about linking, see the [linking guidance](../contributor-guide/create-links-markdown.md)

## Notes and tips
You should use notes and tips judiciously. A little bit goes a long way.

> [!NOTE]
> Note text.

> [!TIP]
> Tip text.

> [!IMPORTANT]
> 
## Lists

A simple numbered list in markdown creates a numbered list on your published page.

1. First step.
2. Second step.
3. Third step.

Use hyphens to create unordered lists:

- Item
- Item
- Item


## Next steps
Every topic should end with 1 to 3 concrete, action oriented next steps and links to the next logical piece of content to keep the customer engaged. 

- See the [content quality guidelines](../contributor-guide/contributor-guide-pr-criteria.md#non-blocking-content-quality-items) for an example of what a good next steps section looks like. 

- Review the [custom markdown extensions](../contributor-guide/custom-markdown-extensions.md) we use for videos, reusable content, selectors, and other content features.

- Make sure your articles meet [the content quality guidelines](../contributor-guide/contributor-guide-pr-criteria.md) before you sign-off on a PR. 


<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    
