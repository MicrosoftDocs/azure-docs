---
title: Bing Custom Search Define your slice | Microsoft Docs
description: Describes how to create a site and vertical search services
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 05/09/2017
ms.author: v-brapel
---

# Define your custom view of the web
There are different ways to define your custom view of the web using Bing Custom Search portal.  This article provides examples of defining a site search service and a vertical search service.

## Site search
In order to search your sites, they must be publicly available, and in Bing's web-index. 

If your site is not available in Bing's web-index, you can follow up with Bing directly. Consult the [Bing webmaster documentation](https://www.bing.com/webmaster/help/webmaster-guidelines-30fba23a).

Follow these instructions to define a Bing Custom Search instance as a site search service.

- Sign in to [Bing Custom Search](https://customsearch.ai) portal
- Click the button labeled **New custom search**, which brings up the **Create a new custom search instance** window
- In the textbox labeled **Custom search instance name**, enter a name for your new custom search instance
- Click **Ok**.  You are taken to the **Definition Editor** for your new custom search instance.
- Enter the domain name of the site to search
- Press enter or click the add button

> [!NOTE]
> You can omit the protocol (**http** or **https**) when adding entries to your Bing Custom Search instance.  When you omit the subdomain (**www**), Bing Custom Search includes results from all subdomains of the domain specified. For example, if you add contoso.org to your instance, results from blog.contoso.org and news.contoso.org are also returned.

## Vertical search
You can refine your Bing Custom Search instance in different ways to create a topical or vertical search service.  This section provides examples of how to refine your Bing Custom Search instance using Bing and site suggestions. 

### Use Bing
Follow these instructions to use Bing to add a site to your Bing Custom Search instance.

- Sign in to [Bing Custom Search](https://customsearch.ai) portal
- Select the instance to be modified.  You are taken to the **Definition Editor** tab for the selected instance.
- Ensure the **search preview** pane is displayed by using the **search preview** button
- Select **Bing** from the drop-down
- In the text box labeled **Enter a query...** enter a search term relevant to your vertical or topic
- Press enter or click the Bing icon 
- Click **Add site** next to a result you would like to include
- Select **Entire Site**, **Subsite**, or **Exact URL** from the window titled **What do you want to add?** 
- Click the **Ok** button

### Use site suggestions
After three or more entries are added, Bing Custom Search generates suggestions for additional sites based on your current entries.  Suggestions appear in the section titled **You might want to add**.  Click the add button next to the suggested site you would like to add.

## Next steps
- [Hosted UI](./hosted-ui.md)
- [Hit highlighting](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)