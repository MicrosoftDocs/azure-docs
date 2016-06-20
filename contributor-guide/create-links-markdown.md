<properties
   pageTitle="Create links in markdown articles" description="Explains how to code crosslinks in markdown." metaKeywords="" services="" solutions="" documentationCenter="" authors="tysonn" videoId="" scriptId="" manager="carolz" />

<tags ms.service="contributor-guide" ms.devlang="" ms.topic="article" ms.tgt_pltfrm="" ms.workload="" ms.date="02/03/2015" ms.author="tysonn" />

# Linking guidance for Azure technical content

### Links from one ACOM article to another

To create an inline link from an ACOM technical article to another ACOM technical article, use the following link syntax:  

- An article in a service directory links to another article in the same service directory:

  `[link text](article-name.md)`

- An article links from a service subdirectory to an article in the root directory:

  `[link text](../article-name.md)`

- An article in the root directory links to an article in a service subdirectory: 

  `[link text](./service-directory/article-name.md)`

- An article in a service subdirectory links to an article in another service subdirectory:

  `[link text](../service-directory/article-name.md)`
 

## Links to anchors

You do not have to create anchors - they are automatically generated at publishing time for all H2 headings. The only thing you have to do is create links to the H2 sections.

- To link to a heading within the same article:

  `[link](#the-text-of-the-H2-section-separated-by-hyphens)`  
  `[Create cache](#create-cache)`

- To link to an anchor in another article in the same subdirectory:

  `[link text](article-name.md#anchor-name)`
  `[Configure your profile](media-services-create-account.md#configure-your-profile)`

- To link to an anchor in another service subdirectory:

  `[link text](../service-directory/article-name.md#anchor-name)`
  `[Configure your profile](../service-directory/media-services-create-account.md#configure-your-profile)`

One way to automate the process of creating links in your articles to auto-generated anchor links is [MarkdownAnchorLinkGenerator - a tool to generate anchor links for ACOM in the proper format](https://github.com/Azure/Azure-CSI-Content-Tools/tree/master/Tools/ACOMMarkdownAnchorLinkGenerator).

## Links from includes

Since include files are located in another directory, you will need to use longer relative paths as shown below. To link to an article from an include file, use this format:

    [link text](../articles/service-folder/article-name.md)
    
Learn more about how to use an include file in the [Custom markdown extensions guidelines](custom-markdown-extensions.md#includes).

## Links in selectors

If you have selectors that are embedded in an include, you would use this sort of linking: 

    > [AZURE.SELECTOR-LIST (Dropdown1 | Dropdown2 )]
    - [(Text1 | Example1 )](../articles/service-folder/article-name1.md)
    - [(Text1 | Example2 )](../articles/service-folder/article-name2.md)
    - [(Text2 | Example3 )](../articles/service-folder/article-name3.md)
    - [(Text2 | Example4 )](../articles/service-folder/article-name4.md)


## Reference-style links

You can use reference style links to make your source content easier to read. The reference style links replace the inline link syntax with simplified syntax that allows you to move the long URLs to the end of the article. Here's Daring Fireball's example:

Inline text:

    I get 10 times more traffic from [Google][1] than from [Yahoo][2] or [MSN][3].

Link references at the end of the article:

    <!--Reference links in article-->
    [1]: http://google.com/
    [2]: http://search.yahoo.com/  
    [3]: http://search.msn.com/

Make sure you include the space after the colon, before the link. When you link to other technical articles, if you forget to include the space, the link will be broken in the published article. 

## Link to ACOM pages that are not part of the technical documentation set

To link to a page on ACOM (such as a pricing page, SLA page or anything else that is not a documentation article), use an absolute URL, but omit the locale. The goal here is that links work in GitHub and on the rendered site:

    [link text](http://azure.microsoft.com/pricing/details/virtual-machines/)


## Link to MSDN or TechNet

When you need to link to MSDN or TechNet, use the full link to the topic, and remove the en-us language locale from the link. 

### Use friendly link text for all links

The words you include in a link should be friendly - in other words, they should be normal English words or the title of the page you are linking to. Do not use "click here". It's bad for SEO and doesn't adequately describe the target.

**Correct:**

- `For more information, see the [contributor guide index](https://github.com/Azure/azure-content/blob/master/contributor-guide/contributor-guide-index.md).`

- `For more details, see the [SET TRANSACTION ISOLATION LEVEL](https://msdn.microsoft.com/library/ms173763.aspx) reference.`

**Incorrect:**

- `For more details, see [https://msdn.microsoft.com/library/ms173763.aspx](https://msdn.microsoft.com/library/ms173763.aspx).`

- `For more information, click [here](https://github.com/Azure/azure-content/blob/master/contributor-guide/contributor-guide-index.md).`


## FWLinks

Avoid FWLinks (our redirection system) in azure.microsoft.com content. They should be used only as a last resort when you need to create a link for a page whose URL you don't yet know. They are almost never actually needed. For ACOM, you define the file name, so you can know what it will be ahead of time. For a library topic that is not yet published, you can create a link that uses the topic GUID so that you don't have to use an FWLink.

If you must use an FWLink on a web page, include the P parameter to make it a permanent redirect:

    http://go.microsoft.com/fwlink/p/?LinkId=389595

When you paste the target URL into the FWLink tool, remember to remove the locale if your target link is ACOM, or the MSDN or TechNet library.

## Remember the Azure library chrome!
If you want to link to an Azure library topic that lives under [this node](https://msdn.microsoft.com/library/azure), remember to specify the Azure chrome in the link (/azure/). The Azure chrome shares the ACOM navigation options and displays only the Azure content of the MSDN library. A properly scoped link looks like this:

    http://msdn.microsoft.com/library/azure/dd163896.aspx

Otherwise, the page will be rendered in the standard MSDN view, with the entire MSDN tree displayed.

### Contributors' Guide Links

- [Overview article](./../README.md)
- [Index of guidance articles](./contributor-guide-index.md)

<!--image references-->
[1]: ./media/create-tables-markdown/table-markdown.png
[2]: ./media/create-tables-markdown/break-tables.png
