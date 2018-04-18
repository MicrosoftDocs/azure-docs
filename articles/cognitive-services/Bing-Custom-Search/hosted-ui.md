---
title: "Bing Custom Search: Site search | Microsoft Docs"
description: Describes how to configure hosted UI
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Configure and consume custom hosted UI
After configuring your custom search instance, you can call the Custom Search API to get the search results and display them in your app. Or, if your app is a web app, you can use the hosted UI that Custom Search provides.   

## Configure custom hosted UI
Use the following instructions to configure a hosted UI to include in your web app.
1.	Sign in to Custom Search [portal](https://customsearch.ai).
2.	Click a Custom Search instance. To create an instance, see [Create your first Bing Custom Search instance](quick-start.md).
3.	Click the **Hosted UI** tab.
4.	Select a layout.
    - Search bar and results (default) &mdash; Display a search box and search results
    - Results only &mdash; Don't display a search box, show only results
    - Pop-over &mdash; Don't display a search box, show only results in a sliding overlay
    
   > [!IMPORTANT]
   > Be sure to include the query parameter when selecting the **Results only** layout.

5.	Under **Additional Configurations**, provide values as appropriate for your app. These settings are optional. To see the effect of applying or removing them, see the preview pane on the right.  Available configuration options are:
    - Search bar configurations:
        - Search box text placeholder &mdash; Text displayed in the search box prior to input
    - Web search configurations:
        - Web results enabled &mdash; Determines if web search results are returned
        - Web results per page &mdash; Number of web search results to display at a time
        - Image caption &mdash; Determines if images are displayed with search results
        - Highlight words &mdash; Determines if results are displayed with search terms in bold
        - Enable filters &mdash; Determines if a dropdown is displayed to filter web search results
        - Enable autosuggest &mdash; Determines if custom autosuggest is enabled
    - Image search configurations:
        - Image results enabled &mdash; Determines if image search results are returned
        - Image results per page &mdash; Number of image search results to display at a time
        - Enable filters &mdash; Determines if dropdowns are displayed to filter image search results
    - Html endpoint configurations:
        - Page title &mdash;  Text displayed in the page title area
        - Title link url &mdash;  Target for the title link
        - Logo url &mdash; Image displayed next to the title 
        - Favicon url &mdash; Icon displayed in the browser title bar
        - Toolbar theme &mdash; Determines the background color of the page title area

   > [!IMPORTANT]
   > At least one of Image search or Web search must be enabled.

6.  Select the search subscription key. See [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account).
7.  If you enabled autosuggest, select the autosuggest subscription key. Custom Autosuggest requires a specifiec subscription tier, see the [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/).

> [!NOTE]
> As you make changes to the custom hosted UI configuration, the pane on the right provides a visual reference for the changes made. The displayed search results are not actual results for your instance

## Consume custom UI
To consume the hosted UI, either: 

- Include the script in your web page
    ``` html
    <html>
        <body>
            <script type="text/javascript"
                id="bcs_js_snippet"            
                src="https://ui.customsearch.ai/api/ux/render?customConfig=<YOUR-CUSTOM-CONFIG-ID>&market=en-US&safeSearch=Moderate">            
            </script>
        </body>    
    </html>
    ```

- Use the URL provided 
  > [!IMPORTANT]
  > The page cannot display your privacy statement or other notices and terms. Suitability for your use may vary.

  `https://ui.customsearch.ai/hosted?customConfig=YOUR-CUSTOM-CONFIG-ID`

## Next steps
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)