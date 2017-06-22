---
title: Xamarin Forms Visual Search Sample App Tutorial
descriptopn: Open Source sample application providing the framework for a basic visual search application written in Xamarin Forms
services: Bing-web-search-API Cognitive-services-computer-vision-API
documentationcenter: dev-center-name (no idea what to put here)
author: Aristoddle (says GitHub-alias-of-only-one-author; not sure if I should have something else here)
manager: manager-alias


ms.service: required
ms.devlang: c#
ms.topic: article
ms.tgt_pltfrm: may be required
ms.workload: required
ms.date: 06/22/2017
ms.author: t-jolanz@microsoft.com
---

# Bing Web Search And Computer Vision API Tutorial: 
This tutorial explores how the Microsoft Computer Vision Optical Character Recognition and Bing Web Search API endpoints can be utilized to build an application implementing basic visual search.  This application is written in C# and utilizes Xamarin.Forms, a cross-platform solution for desktop and mobile development.  Over the course of this tutorial we will discuss the following: 
1) Setting up your system for Xamarin.Forms development
2) Using the Xamarin Media Plugin to capture and import image data in a Xamarin.Forms application
3) Formatting this data and processing it with the Microsoft Cognitive Services Computer Vision APIs
4) Structuring and sending requests to the Bing Web Search API
5) Parsing responses from each of these APIs utilizing the NewtonSoft JSON parser, and and then unpacking these responses utilizing LINQ and through deserialization onto model objects
6) Inegrating these APIs into cross compiling mobile applications
  
This is an open source application registered under the [MIT Open Source License](https://microsoft.mit-license.org/) which you can use as a reference or template when building own applications utilizing the Microsoft Computer Vision and Web Search APIs.

## Prerequisites
### Platform Requirements
This example was developed in Xamarin.Forms using [Visual Studio 2017 Enterprise Edition](https://www.visualstudio.com/downloads/)  For more information about setting up Xamarin for Visual Studio, you can either consult [this guide](https://developer.xamarin.com/guides/cross-platform/getting_started/), or continue reading below.

### Required Azure Services
This application utilizes resources from the [Bing Web Search API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/) and the Cognitive Services <a href="https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/">Computer Vision API</a>.  For subscription and key management details, see <a href="https://azure.microsoft.com/en-us/try/cognitive-services/"> Subscriptions</a>.

## Environment Setup

### Installing Xamarin
With Visual Studio 2017 installed, open the Visual Studio Installer, open the hamburger menu associated with your visual studio installation, and select "Modify".

<div align="center">
    <img src=./media/VisualStudioInstallerPhoto.PNG
         alt="A picture of the visual studio installer">
    </img>
</div>

Now, scroll down to Mobile & Gaming, and make sure that you've enabled "Mobile Development with .NET"

<div align="center">
    <img src=./media/XamarinFormsIsEnabled.PNG
         alt="A picture showing that Xamarin.Forms is installed">
    </img>
</div>

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

<div align="center">
    <img src=./media/ConfigurationSelection.PNG
         alt="An image showing Visual Studio configured to compile for an Android phone">
    </img>
</div> 

### Step 4: Run the app
1) After the build is complete and your target platform is selected, click the **Start** button in the toolbar or press **F5** to deploy the sample to your target platform.  
2) Once the application boots, you will be taken to the page shown below (defined in code as the AddKeysPage).  From here, you can input the API keys needed to access the Microsoft Cognitive Services endpoints used by the application.  If you would like to skip this page, you can manually add your keys in the App.xaml.cs page of the codebase. 
<div align="center">
    <img src=./media/AddKeysPage.png
         alt="A picture of the page where a user can add their Cognitive Services keys">
    </img>
</div>
3) Once you've added your keys, you will be taken to the main landing page of the application (defined in code as the OcrSelectPage).  From here, you can either import or capture a new photo, and pass that photo to either the Print or Handwritten OCR service.  
<div align="center">
    <img src=./media/OcrSelectPage.png
         alt="A picture of the page where users can select their preferred OCR type, and decide whether they would like to import or capture a new photo">
    </img>
</div> 
Please note that the Handwritten OCR endpoint is in preview, and although functional at the time of this guide's writing, its outputs and funtionality are subject to change.  Additionally, Microsoft receives the images that you upload and may use them to improve the Computer Vision API and related services.  By submitting an image, you confirm that you have followed our Developer Code of Conduct.  
 

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
* Is a Xamarin.Forms ContentPage, which contains a listview presenting all of the words extracted from a given image
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
