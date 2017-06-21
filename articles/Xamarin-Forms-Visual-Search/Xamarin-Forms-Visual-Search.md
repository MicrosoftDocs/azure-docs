# Bing Web Search And Computer Vision API Tutorial

This tutorial explores a Xamarin Forms application which utilizes the Microsoft Cognitive Services Computer Vision APIs to perform OCR on both handwritten and printed text.  The application feeds the text extracted by these APIs into the Bing Web Search API, allowing a user to easily query strings of text contained in images.  This is an open source application which you can use for building your own applications utilizing the Microsoft Computer Vision and Web Search APIs.

## Prerequisites
### Platform Requirements
This example was developed in Xamarin.Forms using <a href="https://www.visualstudio.com/downloads/">Visual Studio 2017 Enterprise Edition</a>.  For more information about setting up Xamarin for Visual Studio, you can either consult <a href="https://developer.xamarin.com/guides/cross-platform/getting_started/">this guide</a>, or continue reading below.

### Required Azure Services
This application utilizes resources from the <a href="https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/">Bing Web Search API</a> and the Cognitive Services <a href="https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/">Computer Vision API</a>.  For subscription and key management details, see <a href="https://azure.microsoft.com/en-us/try/cognitive-services/"> Subscriptions</a>.

## Environment Setup

### Installing Xamarin
With Visual Studio 2017 installed, open the Visual Studio Installer, open the hamburger menu associated with your visual studio installation, and select "Modify".

![Visual Studio Installer Modify Screen Example](./media/VisualStudioInstallerPhoto.PNG)

Now, scroll down to Mobile & Gaming, and make sure that you've enabled "Mobile Development with .NET"

![Mobile Development with .Net Selected Example](./media/XamarinFormsIsEnabled.PNG)

Now, click "Modify" in the bottom right corner of the window, and wait for Xamarin to install.


## Building and running the sample app
### Step 0: Download the sample
The sample can be found at <a href="https://github.com/Azure-Samples/XamFormsVisualSearch">XamFormsVisualSearch</a>. Download it using Visual Studio or GitHub.

### Step 1: Install the sample
In Visual Studio, open **XamFormsVisualSearch\VisualSearchApp.sln**.  It may take a few moments to initialize all of the required components. 

### Step 2: Build the sample
Press Ctrl+Shift+B, or click Build on the ribbon menu, then select Build Solution.  This should build the solution for all available platforms.  If you're trying to compile and test code for iOS while using a windows machine, you can reference <a href="https://developer.xamarin.com/guides/ios/getting_started/installation/windows/"> this guide</a> for help.

### Step 3: Configure your deployment
Before running the application, you will need to select a target Configuration, Platform and Project.  These settings should be available in the toolbar below the top ribbon menu.  For this guide I'll be compiling the application in a Debug build for Android, and testing it on my Nexus 6P.  

![Build Settings Toolbar Example](./media/ConfigurationSelection.PNG) 

### Step 4: Run the app


### Required Libraries:

* Xamarin Media Plugin
* Newtonsoft JSON
* Additionally, the app makes use of the ImageResizer class.
    * Found @ <https://github.com/xamarin/xamarin-forms-samples/tree/master/XamFormsImageResize>


### OcrSelectPage:

![OcrSelectPage Example](./media/OcrSelectPage.png)

**Description of the OcrSelectPage**
* Is a Xamarin Forms TabbedPage where users can import or take photos for processing, and can decide what form of OCR to perform.
* (Maybe or not?) discuss how objects set to the buttons so that you can track the calling button.
* Explain the Xamarin Media Plugin, & link to docs.
    * Found @ <https://components.xamarin.com/view/mediaplugin> 


### OcrResultsPage

![OcrResultsPage Example](./media/OcrResultsPage.png)

**Description of OcrResultsPage**
* Is a Xamarin Forms ContentPage, which contains a listview presenting all of the words extracted from a given image
* Walk through the use of each of the two different APIs, highlighting how one gives a direct response where the other returns an endpoint that must be queried later.  
    * General Description: <https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/>
    * Api Reference <https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa>
    * QuickStarts for API use: <https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/quickstarts/csharp>
* Comment on the use of SelectTokens to find content, and link to the NewtonSoft Docs.  
    * Found @ <http://www.newtonsoft.com/json/help/html/SelectToken.htm>
    * Note that later, an alternative object deserializing method will be used to obtain a richer set of data per object


### WebResultsPage

![WebResultsPage Example](./media/WebResultsPage.png)

**Description of WebResultsPage**
* Is a Xamarin Forms ContentPage, which contains a listview presenting all of the words extracted from a given image
* Uses the Web Search API:
    * General descripton: <https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/>
    * API Reference: <https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v5-reference>
    * Page ranking tutorial: <https://docs.microsoft.com/en-us/azure/cognitive-services/bing-web-search/csharp-ranking-tutorial> 

### Opening a Webview

**Example of opening a webview**

![WebViewPage Example](./media/WebViewPage.png)

**Commentary on other things that could be done with the same content**
* Comment that you could swap out standard for Bing Custom Search
* Highlight that the same structure could be applied to the Bing Image Search "Image Insights" section for reverse image lookup and simple object recognition
