---
title: Configure a hosted UI for Bing Custom Search | Microsoft Docs
titleSuffix: Azure AI services
description: Use this article to configure and integrate a hosted UI for Bing Custom Search.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: conceptual
ms.date: 02/12/2019
ms.author: aahi
ms.devlang: javascript
ms.custom:
---

# Configure your hosted UI experience

[!INCLUDE [Bing move notice](../bing-web-search/includes/bing-move-notice.md)]

Bing Custom Search provides a hosted UI that you can easily integrate into your webpages and web applications as a JavaScript code snippet. Using the Bing Custom Search portal, you can configure the layout, color, and search options of the UI.



## Configure the custom hosted UI

To configure a hosted UI for your web applications, follow these steps. As you make changes, the pane on the right will give you a preview of your UI. The displayed search results are not actual results for your instance.

1. Sign in to Bing Custom Search [portal](https://customsearch.ai).  
  
2. Select your Bing Custom Search instance.

3. Click the **Hosted UI** tab.  
  
4. Select a layout.

    - Search bar and results (default): Displays a search box with search results below it.
    - Results only: Displays search results only, without a search box. When using this layout, you must provide the search query (`&q=<query string>`). Add the query parameter to the request URL in the JavaScript snippet, or the HTML endpoint link.
    - Pop-over: Provides a search box and displays the search results in a sliding overlay.

5. Select a color theme. You can customize the colors to fit your application by clicking **Customize theme**. To change a color, either enter the color's RGB HEX value (for example, `#366eb8`), or click on the color preview.

   You can preview your changes on the right side of the portal. Clicking **Reset to default** will revert your changes to the default colors for the selected theme.

   > [!NOTE]
   > Consider accessibility when choosing colors.

6. Under **Additional Configurations**, provide values as appropriate for your app. These settings are optional. To see the effect of applying or removing them, see the preview pane on the right. Available configuration options are:  

7. Enter the search subscription key or choose one from the dropdown list. The dropdown list is populated with keys from your Azure account's subscriptions. See [Azure AI services API account](../cognitive-services-apis-create-account.md).  

8. If you enabled autosuggest, enter the autosuggest subscription key or choose one from the dropdown list. The dropdown list is populated with keys from your Azure account's subscriptions. Custom Autosuggest requires a specific subscription tier, see the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/).

[!INCLUDE [publish or revert](./includes/publish-revert.md)]

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
  > Add the following query parameters to the URL as needed. For information about these parameters, see [Custom Search API](/rest/api/cognitiveservices-bingsearch/bing-custom-search-api-v7-reference#query-parameters) reference.
  >
  > - q
  > - mkt
  > - safesearch
  > - setlang

  > [!IMPORTANT]
  > The page cannot display your privacy statement or other notices and terms. Suitability for your use may vary.  

For additional information, including your Custom Configuration ID, go to **Endpoints** under the **Production** tab.

## Configuration options

You can configure the behavior of your hosted UI by clicking **Additional Configurations**, and providing values. These settings are optional. To see the effect of applying or removing them, see the preview pane on the right. 

### Web search configurations

- Web results enabled: Determines if web search is enabled (you will see a Web tab at the top of the page)
- Enable autosuggest: Determines if custom autosuggest is enabled (see [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/) for additional cost).
- Web results per page: Number of web search results to display at a time (the maximum is 50 results per page).
- Image caption: Determines if images are displayed with search results.

The following configurations are shown if you click **Show advanced configurations**:

- Highlight words: Determines if results are displayed with search terms in bold.
- Link target: Determines if the webpage opens in a new browser tab (Blank) or the same browser tab (self) when the user clicks a search result.

### Image search configurations

- Image results enabled: Determines if image search is enabled (you will see an Images tab at the top of the page).
- Image results per page: Number of image search results to display at a time (the maximum is 150 results per page).

The following configuration is shown if you click **Show advanced configurations**.  
  
- Enable filters: Adds filters that the user can use to filter the images that Bing returns. For example, the user can filter the results for only animated GIFs.

### Video search configurations

- Video results enabled: Determines if video search is enabled (you will see a Videos tab at the top of the page).
- Video results per page: Number of video search results to display at a time (the maximum is 150 results per page).

The following configuration is shown if you click **Show advanced configurations**.  
  
- Enable filters: Adds filters that the user can use to filter the videos that Bing returns. For example, the user can filter the results for videos with a specific resolution or videos discovered in the last 24 hours.

### Miscellaneous configurations

- Page title: Text displayed in the title area of the search results page (not for pop-over layout).
- Toolbar theme: Determines the background color of the title area of the search results page.

The following configurations are shown if you click **Show advanced configurations**.  

|Column1  |Column2  |
|---------|---------|
|Search box text placeholder   | Text displayed in the search box prior to input.        |
|Title link url    |Target for the title link.         |
|Logo URL     | Image displayed next to the title.         |
|Favicon    | Icon displayed in the browser's title bar.          |

The following configurations apply only if you consume the Hosted UI through the HTML endpoint (they don't apply if you use the JavaScript snippet).

- Page title
- Toolbar theme
- Title link URL
- Logo URL
- Faviicon URL  

## Next steps

- [Use decoration markers to highlight text](../bing-web-search/hit-highlighting.md)
- [Page webpages](../bing-web-search/paging-search-results.md)
