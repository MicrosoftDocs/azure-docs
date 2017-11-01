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
1.	Sign in to Custom Search [portal](https://customsearch.ai)
2.	Click the custom search instance you want to configure a custom hosted UI for
3.	Click the Hosted UI tab
4.	Choose a layout
    - Search bar and results (default) &mdash; Display a search box and search results
    - Results only &mdash; Don't display a search box, show only results
    - Pop-over &mdash; Don't display a search box, show only results in a sliding overlay
    
   > [!IMPORTANT]
   > Be sure to include the query parameter when selecting the **Results only** layout.

5.	Under **Additional Configurations**, provide values as appropriate for your app. These settings are optional. To see the effect of applying or removing them, click Save All Changes.  Available configuration options are:
    - Page title &mdash;  The title text
    - Title link url &mdash;  The target for the title link
    - Logo url &mdash; The image displayed next to the title 
    - Favicon url &mdash; The icon displayed in the browser title bar
    - Toolbar theme &mdash; Use a background color for the title area
    - Image caption &mdash; Display images with search results
    - Highlight words &mdash; Display results with search terms in bold
    - Search box text placeholder &mdash; Text displayed in the search box prior to input
    - Results per page &mdash; The number of results to display at a time
6.  **Required**: Specify your subscription key.

> [!NOTE]
> As you make changes to the custom hosted UI configuration, the pane on the right provides a visual reference for the changes made. The displayed search results are not actual results for your instance

## Consume custom UI
To consume the hosted UI, either: 

- Include the script in your web page
    ``` html
    <html>
        <body>
            
                <script type="text/javascript">
                        var customConfigId = '<YOUR-CUSTOM-CONFIG-ID>';
                        var javasriptResourceUrl = 'https://ui.customsearch.ai/api/ux/render?customConfig=' + customConfigId;                
                        var s = document.createElement('script');                
                        s.setAttribute('type', 'text/javascript');                
                        s.id = 'bcs_js_snippet';                
                        s.src = javasriptResourceUrl;                
                        var scripts = document.getElementsByTagName("script"),                
                            currentScript = scripts[scripts.length-1];                
                        currentScript.parentElement.appendChild(s);                
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