Outline: XamFormsVisualSearch Docs
==================================

Intro
-----
Description of the app:
* What APIs are used
* Statement of intended audience
* Description of structure
    * Using this app as a case study, we will step through the codebase file by file and explore how each contributes to the function of the app as a whole 


Required Libraries:
------------------
* Xamarin Media Plugin
* Newtonsoft JSON
* Additionally, the app makes use of the ImageResizer class.
    * Found @ <https://github.com/xamarin/xamarin-forms-samples/tree/master/XamFormsImageResize>


OcrSelectPage:
--------------
![OcrSelectPage Example](./media/OcrSelectPage.png)

**Description of the OcrSelectPage**
* Is a Xamarin Forms TabbedPage where users can import or take photos for processing, and can decide what form of OCR to perform.
* (Maybe or not?) discuss how objects set to the buttons so that you can track the calling button.
* Explain the Xamarin Media Plugin, & link to docs.
    * Found @ <https://components.xamarin.com/view/mediaplugin> 


OcrResultsPage
--------------
![OcrResultsPage Example](./media/OcrResultsPage.png)

**Description of OcrResultsPage**
* Is a Xamarin Forms ContentPage, which contains a listview presenting all of the words extracted from a given image
* Walk through the use of each of the two different APIs, highlighting how one gives a direct response where the other returns an endpoint that must be queried later.  
    * Description of APIs: <https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/>
    * QuickStarts for API use: <https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/csharp>
* Comment on the use of SelectTokens to find content, and link to the NewtonSoft Docs.  
    * Found @ <http://www.newtonsoft.com/json/help/html/SelectToken.htm>
    * Note that later, an alternative object deserializing method will be used to obtain a richer set of data per object


WebResultsPage
-------------
![WebResultsPage Example](./media/WebResultsPage.png)

**Description of WebResultsPage**
* Is a Xamarin Forms ContentPage, which contains a listview presenting all of the words extracted from a given image
* Uses the Web Search API:
    * Found @ <https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/>
    * Page ranking tutorial found @ <https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/csharp-ranking-tutorial> 

Opening a Webview
-----------------
**Example of opening a webview**

![WebViewPage Example](./media/WebViewPage.png)

**Commentary on other things that could be done with the same content**
* Comment that you could swap out standard for Bing Custom Search
* Highlight that the same structure could be applied to the Bing Image Search "Image Insights" section for reverse image lookup and simple object recognition