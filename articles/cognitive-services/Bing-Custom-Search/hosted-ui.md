---
title: Site search, use the hosted UI Bing Custom Search
titlesuffix: Azure Cognitive Services
description: Describes how to configure the Bing Custom Search hosted UI.
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: conceptual
ms.date: 09/28/2017
ms.author: v-brapel
---

# Configure your hosted UI experience

After configuring your custom search instance, you can call the Custom Search API to get the search results and display them in your app. Or, if your app is a web app, you can use the hosted UI that Custom Search provides.   

## Configure custom hosted UI

To configure a hosted UI for your web app, follow these steps:

1. Sign in to Custom Search [portal](https://customsearch.ai).  
  
2. Click a Custom Search instance. To create an instance, see [Create your first Bing Custom Search instance](quick-start.md).  

3. Click the **Hosted UI** tab.  
  
4. Select a layout.
  
  - Search bar and results (default) &mdash; This layout is your traditional search page with search box and search results.
  - Results only &mdash; This layout displays search results only. This layout doesn't display a search box. You must provide the search query by adding the query parameter (&q=\<query string>) to the request URL in the JavaScript snippet or HTML endpoint link.
  - Pop-over &mdash; This layout provides a search box and displays the search results in a sliding overlay.
      
5. Select a color theme. The possible themes are: 
  
  - Classic
  - Dark
  - Skyline Blue

  Click each of the themes to see which theme works best with your web app. If you need to fine-tune the color theme to better integrate with your web app, click **Customize theme**. Not all color configurations apply to all layout themes. To change a color, enter the color's RGB HEX value (for example, #366eb8) in the corresponding text box. Or, click the  color button and then click the shade that works for you. 
  
  After changing a color, check out how the change affects the preview example on the right. You can always click **Reset to default** to get back to the default colors for the selected theme.

  > [!NOTE]
  > When you change the color theme, consider accessibility when choosing colors.

5. Under **Additional Configurations**, provide values as appropriate for your app. These settings are optional. To see the effect of applying or removing them, see the preview pane on the right. Available configuration options are:  
  
  - Web search configurations:
    - Web results enabled &mdash; Determines if web search is enabled (you will see a Web tab at the top of the page).
    - Enable autosuggest &mdash; Determines if custom autosuggest is enabled (see [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/) for additional cost).
    - Web results per page &mdash; Number of web search results to display at a time (the maximum is 50 results per page).
    - Image caption &mdash; Determines if images are displayed with search results.
  
    The following configurations are shown if you click **Show advanced configurations**.  
  
    - Highlight words &mdash; Determines if results are displayed with search terms in bold. 
    - Link target &mdash; Determines if the webpage opens in a new browser tab (Blank) or the same browser tab (self) when the user clicks a search result. 

  - Image search configurations:
    - Image results enabled &mdash; Determines if image search is enabled (you will see an Images tab at the top of the page).   
    - Image results per page &mdash; Number of image search results to display at a time (the maximum is 150 results per page).  
  
    The following configuration is shown if you click **Show advanced configurations**.  
  
    - Enable filters &mdash; Adds filters that the user can use to filter the images that Bing returns. For example, the user can filter the results for only animated GIFs.

  - Video search configurations:
    - Video results enabled &mdash; Determines if video search is enabled (you will see a Videos tab at the top of the page).  
    - Video results per page &mdash; Number of video search results to display at a time (the maximum is 150 results per page).
  
    The following configuration is shown if you click **Show advanced configurations**.  
  
    - Enable filters &mdash; Adds filters that the user can use to filter the videos that Bing returns. For example, the user can filter the results for videos with a specific resolution or videos discovered in the last 24 hours.

  - Miscellaneous configurations:
    - Page title &mdash; Text displayed in the title area of the search results page (not for pop-over layout).
    - Toolbar theme &mdash; Determines the background color of the title area of the search results page.  
  
    The following configurations are shown if you click **Show advanced configurations**.  
  
    - Search box text placeholder &mdash; Text displayed in the search box prior to input.
    - Title link url &mdash;  Target for the title link.
    - Logo url &mdash; Image displayed next to the title. 
    - Favicon url &mdash; Icon displayed in the browser's title bar.  

    The following configurations apply only if you consume the Hosted UI through the HTML endpoint (they don't apply if you use the JavaScript snippet).
    
    - Page title
    - Toolbar theme
    - Title link URL
    - Logo URL
    - Faviicon URL  
  
6. Enter the search subscription key or choose one from the dropdown list. The dropdown list is populated with keys from your Azure account's subscriptions. See [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).  

7. If you enabled autosuggest, enter the autosuggest subscription key or choose one from the dropdown list. The dropdown list is populated with keys from your Azure account's subscriptions. Custom Autosuggest requires a specific subscription tier, see the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/).

> [!NOTE]
> As you make changes to the custom hosted UI configuration, the pane on the right provides a visual reference for the changes made. The displayed search results are not actual results for your instance.

[!INCLUDE[publish or revert](./includes/publish-revert.md)]

## Consume custom UI

To consume the hosted UI, either: 

- Include the script in your web page  
  
  ```html
  <html>
      <body>
          <script type="text/javascript" 
              id="bcs_js_snippet"
              src="https://ui.customsearch.ai /api/ux/rendering-js?customConfig=<YOUR-CUSTOM-CONFIG-ID>&market=en-US&safeSearch=Moderate&version=latest&q=">
          </script>
      </body>    
  </html>
  ```

- Or, use the following URL in a Web browser.   
  
  `https://ui.customsearch.ai/hosted?customConfig=YOUR-CUSTOM-CONFIG-ID`  
  
  > [!NOTE]
  > Add the following query parameters to the URL as needed. For information about these parameters, see [Custom Search API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-custom-search-api-v7-reference#query-parameters) reference.
  >
  > - q
  > - mkt
  > - safesearch
  > - setlang

  > [!IMPORTANT]
  > The page cannot display your privacy statement or other notices and terms. Suitability for your use may vary.  

For additional information, including your Custom Configuration ID, go to **Endpoints** under the **Production** tab.

## Next steps

- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)