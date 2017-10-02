---
title: Computer Vision API C# tutorial | Microsoft Docs
description: Explore a basic Windows app that uses the Computer Vision API in Microsoft Cognitive Services. Perform OCR, create thumbnails, and work with visual features in an image.
services: cognitive-services
author: JuliaNik
manager: ytkuo

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 05/22/2017
ms.author: juliakuz
---

# Computer Vision API C&#35; Tutorial

Explore a basic Windows application that uses Computer Vision API to perform optical character recognition (OCR), create smart-cropped thumbnails, plus detect, categorize, tag and describe visual features, including faces, in an image. The below example lets you submit an image URL or a locally stored file. You can use this open source example as a template for building your own app for Windows using the Vision API and WPF (Windows Presentation Foundation), a part of .NET Framework.

### <a name="Prerequisites">Prerequisites</a>

#### Platform requirements

The below example has been developed for the .NET Framework using [Visual Studio 2015, Community Edition](https://www.visualstudio.com/products/visual-studio-community-vs). 

#### Subscribe to Computer Vision API and get a subscription key 

Before creating the example, you must subscribe to Computer Vision API which is part of the Microsoft Cognitive Services (formerly Project Oxford). For subscription and key management details, see [Subscriptions](https://azure.microsoft.com/en-us/try/cognitive-services/). Both the primary and secondary key can be used in this tutorial. 

> [!NOTE]
> The tutorial is designed to use subscription keys in the **westcentralus** region. The subscription keys generated in the Computer Vision free trail use the **westcentralus** region, so they work correctly. If you generated your subscription keys using your Azure account through [https://azure.microsoft.com/](https://azure.microsoft.com/en-us/), you must specify the **westcentralus** region. Keys generated outside the **westcentralus** region will not work.

#### Get the client library and example

You may clone the Computer Vision API client library and example application to your computer via [SDK](https://www.github.com/microsoft/cognitive-vision-windows). Don't download it as a ZIP.

### <a name="Step1">Step 1: Install the example</a>

In your GitHub Desktop, open Sample-WPF\VisionAPI-WPF-Samples.sln.

### <a name="Step2">Step 2: Build the example</a>

* Press Ctrl+Shift+B, or click Build on the ribbon menu, then select Build Solution.

### <a name="Step3">Step 3: Run the example</a>

1. After the build is complete, press **F5** or click **Start** on the ribbon menu to run the example.
2. Locate the Computer Vision API user interface window with the text edit box reading "Paste your subscription key here to start".
You can choose to persist your subscription key on your PC or laptop by clicking the "Save Key" button. When you want to delete the subscription key from the system, click "Delete Key" to remove it from your PC or laptop.

	![Vision Subscription Key](../Images/Vision_UI_Subscription.PNG)

3. Under "Select Scenario" click to use one of the six scenarios, then follow the instructions on the screen. Microsoft receives the images you upload and may use them to improve Computer Vision API and related services. By submitting an image, you confirm that you have followed our [Developer Code of Conduct](https://azure.microsoft.com/en-us/support/legal/developer-code-of-conduct/).

	![Analyze Image Interface](../Images/Analyze_Image_Example.PNG)

4. There are example images to be used with this example application. You can find these images on the Face API Windows Github repo, in the [Data folder](https://github.com/Microsoft/Cognitive-Face-Windows/tree/master/Data). Please note the use of these images is licensed under agreement [LICENSE-IMAGE](https://github.com/Microsoft/Cognitive-Face-Windows/blob/master/LICENSE-IMAGE.md).

### <a name="Review">Review and Learn</a>

Now that you have a running application, let us review how this example app integrates with Cognitive Services technology. This will make it easier to either continue building onto this app or develop your own app using Microsoft Computer Vision API.

This example app makes use of the Computer Vision API Client Library, a thin C# client wrapper for the Microsoft Computer Vision API. When you built the example app as described above, you got the Client Library from a NuGet package. You can review the Client Library source code in the folder titled “**Client Library**” under **Vision**, **Windows**, **Client Library**, which is part of the downloaded file repository mentioned above in Prerequisites.

You can also find out how to use the Client Library code in Solution Explorer: Under **VisionAPI-WPF_Samples**, expand **AnalyzePage.xaml** to locate **AnalyzePage.xaml.cs**, which is used for submitting an image to the image analysis endpoint. Double-click the .xaml.cs files to have them open in new windows in Visual Studio.

Reviewing how the Vision Client Library gets used in our example app, let's look at two code snippets from **AnalyzePage.xaml.cs**. The file contains code comments indicating “KEY SAMPLE CODE STARTS HERE” and “KEY SAMPLE CODE ENDS HERE” to help you locate the code snippets reproduced below.

The analyze endpoint is able to work with either an image URL or binary image data (in form of an octet stream) as input. First, you find a using directive, which lets you use the Vision Client Library.

```
	            // ----------------------------------------------------------------------
	            // KEY SAMPLE CODE STARTS HERE
	            // Use the following namespace for VisionServiceClient 
	            // ---------------------------------------------------------------------- 
	            using Microsoft.ProjectOxford.Vision; 
	            using Microsoft.ProjectOxford.Vision.Contract; 
	            // ----------------------------------------------------------------------
	            // KEY SAMPLE CODE ENDS HERE 
	            // ----------------------------------------------------------------------

```
**UploadAndAnalyzeImage(…)**
This code snippet shows how to use the Client Library to submit your subscription key and a locally stored image to the analyze endpoint of the Computer Vision API service.

```
	private async Task<AnalysisResult> UploadAndAnalyzeImage(string imageFilePath)
	{
	    // -----------------------------------------------------------------------
	    // KEY SAMPLE CODE STARTS HERE
	    // -----------------------------------------------------------------------	
	    //
	    // Create Project Oxford Computer Vision API Service client
	    //
	    VisionServiceClient VisionServiceClient = new VisionServiceClient(SubscriptionKey);
	    Log("VisionServiceClient is created");
	
	    using (Stream imageFileStream = File.OpenRead(imageFilePath))
	    {
	        //
	        // Analyze the image for all visual features
	        //
	        Log("Calling VisionServiceClient.AnalyzeImageAsync()...");
         VisualFeature[] visualFeatures = new VisualFeature[] { VisualFeature.Adult, VisualFeature.Categories, VisualFeature.Color, VisualFeature.Description, VisualFeature.Faces, VisualFeature.ImageType, VisualFeature.Tags };
	        AnalysisResult analysisResult = await VisionServiceClient.AnalyzeImageAsync(imageFileStream, visualFeatures);
	        return analysisResult;
	    }
	
	    // -----------------------------------------------------------------------
	    // KEY SAMPLE CODE ENDS HERE
	    // -----------------------------------------------------------------------
    	}
```
**AnalyzeUrl(…)**
This code snippet shows how to use the Client Library to submit your subscription key and a photo URL to the analyze endpoint of the Computer Vision API service.

```
	private async Task<AnalysisResult> AnalyzeUrl(string imageUrl)
	{
	    // -----------------------------------------------------------------------
	    // KEY SAMPLE CODE STARTS HERE
	    // -----------------------------------------------------------------------
	
	    //
	    // Create Project Oxford Computer Vision API Service client
	    //
     VisionServiceClient VisionServiceClient = new VisionServiceClient(SubscriptionKey);
	    Log("VisionServiceClient is created");
	
	    //
	    // Analyze the url for all visual features
	    //
	    Log("Calling VisionServiceClient.AnalyzeImageAsync()...");
	    VisualFeature[] visualFeatures = new VisualFeature[] { VisualFeature.Adult, VisualFeature.Categories, VisualFeature.Color, VisualFeature.Description, VisualFeature.Faces, VisualFeature.ImageType, VisualFeature.Tags };
	    AnalysisResult analysisResult = await VisionServiceClient.AnalyzeImageAsync(imageUrl, visualFeatures);
     return analysisResult;
	}
	    // -----------------------------------------------------------------------
	    // KEY SAMPLE CODE ENDS HERE
	    // -----------------------------------------------------------------------
```
**Other pages and endpoints**
How to interact with the other endpoints exposed by the Computer Vision API service can be seen by looking at the other pages in the sample; for instance, the OCR endpoint is shown as part of the code contained in OCRPage.xaml.cs 

### <a name="Related">Related Topics</a>
 * [Get started with Face API](../../Face/Tutorials/FaceAPIinCSharpTutorial.md)
 
 


