---
title: "Bing Custom Search: Create a custom search web page | Microsoft Docs"
description: Describes how to configure a custom search instance and integrate it into a web page
services: cognitive-services
author: brapel
manager: ehansen
ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: article
ms.date: 10/16/2017
ms.author: v-brapel
---

# Build a Custom Search web page

Bing Custom Search enables you to create tailored search experiences for topics that you care about. For example, if you own a martial arts website that provides a search experience, you can specify the domains, subsites, and webpages that Bing searches. Your users see search results tailored to the content they care about instead of paging through general search results that may contain irrelevant content. 

This tutorial demonstrates how to configure a custom search instance and integrate it into a new web page.

The tasks covered are:

> [!div class="checklist"]
> - Create a custom search instance
> - Add active entries
> - Add blocked entries
> - Add pinned entries
> - Integrate custom search into a web page

## Prerequisites

- To follow along with the tutorial, you need a subscription key for the Bing Custom Search API.  To get a key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search).
- If you don’t already have Visual Studio 2017 installed, you can download and use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/).

## Create a custom search instance

To create a Bing Custom Search instance:

1. Open an internet browser.  
  
2. Navigate to the custom search [portal](https://customsearch.ai).  
  
3. Sign in to the portal using a Microsoft account (MSA). If you don’t have an MSA, click **Create a Microsoft account**. If it’s your first time using the portal, it will ask for permissions to access your data. Click **Yes**.  
  
4. After signing in, click **New custom search**. In the **Create a new custom search instance** window, enter a name that’s meaningful and describes the type of content the search returns. You can change the name at any time.  
  
  ![Screen shot of the Create a new custom search instance box](../media/newCustomSrch.png)  
  
5. Click OK, specify a URL and whether to include subpages of the URL.  
  
  ![Screen shot of URL definition page](../media/newCustomSrch1-a.png)  


## Add active entries

To include results from specific websites or URLs, add them to the **Active** tab.

1.	In the **Definition Editor**, click the **Active** tab and enter the URL of one or more websites you want to include in your search.

    ![Screen shot of the Definition Editor active tab](../media/customSrchEditor.png)

2.	To confirm that your instance returns results, enter a query in the preview pane on the right. Bing returns only results for public websites that it has indexed.

## Add blocked entries

To exclude results from specific websites or URLs, add them to the **Blocked** tab.

1. In the **Definition Editor**, click the **Blocked** tab and enter the URL of one or more websites you want to exclude from your search.

    ![Screen shot of the Definition Editor blocked tab](../media/blockedCustomSrch.png)


2. To confirm that your instance doesn't return results from the blocked websites, enter a query in the preview pane on the right. 

## Add pinned entries

To pin a specific webpage to the top of the search results, add the webpage and query term to the **Pinned** tab. The **Pinned** tab contains a list of webpage and query term pairs that specify the webpage that appears as the top result for a specific query. The webpage is pinned only if the user’s query string matches the pin's query string based on pin's match condition. [Read more](../define-your-custom-view.md#pin-to-top).

1. In the **Definition Editor**, click the **Pinned** tab and enter the webpage and query term of the webpage that you want returned as the top result.  
  
2. By default, the user's query string must exactly match your pin's query string for Bing to return the webpage as the top result. To change the match condition, edit the pin (click the pencil icon), click Exact in the **Query match condition**, and select the appropriate match condition for your application.  
  
    ![Screen shot of the Definition Editor pinned tab](../media/pinnedCustomSrch.png)
  
3. To confirm that your instance returns the specified webpage as the top result, enter the query term you pinned in the preview pane on the right.

## Configure Hosted UI

Custom Search provides a hosted UI to render the JSON response of your custom search instance. To define your UI experience:

1. Click the **Hosted UI** tab.  
  
2. Select a layout.  
  
  ![Screen shot of the Hosted UI select layout step](./media/custom-search-hosted-ui-select-layout.png)  
  
3. Select a color theme.  
  
  ![Screen shot of the Hosted UI select layout step](./media/custom-search-hosted-ui-select-color-theme.png)  
  
4. Specify additional configuration options.  
  
  ![Screen shot of the Hosted UI additional configurations step](./media/custom-search-hosted-ui-additional-configurations.png)  
  
5. Paste your **Subscription key**. See [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).  
  
  ![Screen shot of the Hosted UI additional configurations step](./media/custom-search-hosted-ui-subscription-key.png)

[!INCLUDE[publish or revert](../includes/publish-revert.md)]

<a name="consuminghostedui"></a>
## Consuming Hosted UI

There are two ways to consume the hosted UI.  

- Option 1: Integrate the provided JavaScript snippet into your application.
- Option 2: Use the HTML Endpoint provided.

The remainder of this tutorial illustrates **Option 1: Javascript snippet**.  

## Set up your Visual Studio solution

1. Open **Visual Studio** on your computer.  
  
2. On the **File** menu, select **New**, and then choose **Project**.  
  
3. In the **New Project** window, select **Visual C# / Web / ASP.NET Core Web Application**, name your project, and then click **OK**.  
  
  ![Screen shot of new project window](./media/custom-search-new-project.png)  
  
4. In the **New ASP.NET Core Web Application** window, select **Web Application** and click **OK**.  
  
  ![Screen shot of new project window](./media/custom-search-new-webapp.png)  

## Edit index.cshtml

1. In the **Solution Explorer**, expand **Pages** and double-click **index.cshtml** to open the file.  
  
  ![Screen shot of solution explorer with pages expanded and index.cshtml selected](./media/custom-search-visual-studio-webapp-solution-explorer-index.png)  
  
2. In index.cshtml, delete everything starting from line 7 and below.  
  
  ```razor
  @page
  @model IndexModel
  @{
      ViewData["Title"] = "Home page";
  }    
  ```  
  
3. Add a line break element and a div to act as a container.  
  
  ```html
  @page
  @model IndexModel
  @{
      ViewData["Title"] = "Home page";
  }
  <br />
  <div id="customSearch"></div>
  ```  
  
4. From the **Hosted UI** tab, scroll down to the section titled **Consuming the UI**. Copy the JavaScript snippet.  
  
  ![Screen shot of the Hosted UI save button](./media/custom-search-hosted-ui-consuming-ui.png)  
  
5. Paste the script element into the container you added.  
  
  ``` html
  @page
  @model IndexModel
  @{
      ViewData["Title"] = "Home page";
  }
  <br />
  <div id="customSearch">
      <script type="text/javascript"
              id="bcs_js_snippet"
              src="https://ui.customsearch.ai/api/ux/render?customConfig=<YOUR-CUSTOM-CONFIG-ID>&market=en-US&safeSearch=Moderate">
      </script>
  </div>
  ```  
  
6. In the **Solution Explorer**, right click on **wwwroot** and click **View in Browser**.  
  
  ![Screen shot of solution explorer selecting View in Browser from the wwwroot context menu](./media/custom-search-webapp-view-in-browser.png)  

Your new custom search web page should look similar to this:

![Screen shot of custom search web page](./media/custom-search-webapp-browse-index.png)

Performing a search renders results like this:

![Screen shot of custom search results](./media/custom-search-webapp-results.png)

## Next steps

> [!div class="nextstepaction"]
> [Call Bing Custom Search endpoint (C#)](../call-endpoint-csharp.md)