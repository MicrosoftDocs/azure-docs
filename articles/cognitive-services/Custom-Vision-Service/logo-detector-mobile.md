---
title: "Tutorial: Use a custom logo detector "
titlesuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: tutorial
ms.date: 12/14/2018
ms.author: pafarley
---
# Tutorial: Recognize Azure service logos and deploy services

In this tutorial, you will step through a sample app that uses Azure Custom Vision as part of a larger scenario. The AI Visual Provision app, a Xamarin.Forms app for mobile platforms, analyzes camera pictures of Azure service logos and then deploys the actual services to the user's Azure account. Here you will learn how it uses Custom Vision in coordination with other components to deliver a useful end-to-end application. 

You may wish to run the whole app for yourself, or you can simply complete the Custom Vision part of the setup and explore how the app uses it.

This tutorial show you how to:

> [!div class="checklist"]
> - Create a custom object detector to recognize Azure service logos
> - Connect your app to Azure Computer Vision and Custom Vision
> - Create an Azure Service Principal account to deploy Azure services

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. 

## Prerequisites

- [Visual Studio 2017](https://www.visualstudio.com/downloads/).
- Xamarin workload for Visual Studio (see [Installing Xamarin](https://docs.microsoft.com/xamarin/cross-platform/get-started/installation/windows)).
- [Azure command-line interface (CLI)](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest) (optional)
- 

## Get the source code

First, clone or download the app's source code from the [AI Visual Provision](https://github.com/Microsoft/AIVisualProvision) repository on GitHub. Open the *Source/VisualProvision.sln* file in Visual Studio.

## Create an object detector

Sign in to the [Custom Vision website](https://customvision.ai/) and create a new project. Specify an Object Detection project and use the Logo domain; this will cause the service to use an algorithm optimized for logo detection. 

![thing](media/azure-logo-tutorial/new-project.png)

## Train the object detector

Next, you will need to train the logo detection algorithm by uploading images of Azure service logos and tagging them manually. The sample app repository includes the training images. Select the **Add images** button under the **Training Images** tab, and then navigate to the **Documents/Images/Training_DataSet** folder of the repo. 

You will need to manually tag the logos in each image, so if
you are only testing out the project, you may wish to upload only a subset of the images. However, be sure to upload at least 15 instances of each tag you plan to use.

When you've uploaded the training images, select the first one on display. This will bring up the tagging window. Draw boxes and assign tags for each logo in each image. The app is configured to work with specific tag strings; see the definitions in the *Source\VisualProvision\AppSettings.cs* file:

[!code-csharp[tag definitions](~/AIVisualProvision/Source/VisualProvision/Services/Recognition/RecognitionService.cs?range=18-33)]

When you are finished tagging an image, navigate to the right to tag the next one. Exit out of the window when you are finished.

![image of logos with tags being applied on the Custom Vision website](media/azure-logo-tutorial/tag-logos.png)

In the left pane, set the **Tags** switch to **Tagged**, and you should see all of your images. Then click the green button at the top of the page to train the model. This will teach the algorithm to recognize the tags in new images. It will also test the model on some of your existing images to get accuracy scores.

Now your model is trained and you are ready to integrate it into the app. To do this, you'll need to get the endpoint URL (the address of your model, which the app will query) and the prediction key (to grant the app access for prediction requests). In the **Performance** tab, click the **Prediction URL** button at the top of the page.

![the Custom Vision website with a Prediction API screen, showing a URL address and api key](media/azure-logo-tutorial/cusvis-endpoint.png)

Copy these values to the appropriate fields in the *Source\VisualProvision\AppSettings.cs* file:

[!code-csharp[Custom Vision fields](~/AIVisualProvision/Source/VisualProvision/AppSettings.cs?range=22-25)]

## Examine Custom Vision usage

Open the *Source/VisualProvision/Services/Recognition/CustomVisionService.cs* file to see how your Custom Vision key and endpoint URL are used in the app. The **PredictImageContentsAsync** method takes a byte stream of an image file, along with a cancellation token for asynchronous task management, calls the Custom Vision prediction API, and returns the result of the prediction. 

[!code-csharp[Custom Vision fields](~/AIVisualProvision/Source/VisualProvision/Services/Recognition/CustomVisionService.cs?range=12-28)]

This result takes the form of a **PredictionResult** instance, which itself contains a list of **Prediction** instances. A **Prediction** contains a detected tag and its bounding box location in the image.

[!code-csharp[Custom Vision fields](~/AIVisualProvision/Source/VisualProvision/Services/Recognition/Prediction.cs?range=3-12)]

If you wish to learn more about how the app handles this data, start at the **GetResourcesAsync** method, defined in the *Source/VisualProvision/Services/Recognition/RecognitionService.cs* file. 

## Add Computer Vision

The Custom Vision portion of the tutorial is complete, but if you wish to run the app, you will need to integrate the Computer Vision service as well. The app uses Computer Vision's text recognition feature to help with logo detection; an Azure logo can be recognized by its visual look _or_ by the printed text near it. Unlike Custom Vision models, Computer Vision is pre-trained to perform certain operations on images or videos.

Simply subscribe to the Computer Vision service to get a key and endpoint API. See [How to obtain subscription keys](https://docs.microsoft.com/azure/cognitive-services/computer-vision/vision-api-how-to-topics/howtosubscribe) if you need help with this step.

Then, open the *Source\VisualProvision\AppSettings.cs* file and populate the `ComputerVisionEndpoint` and `ComputerVisionKey` variables with the correct values.

[!code-csharp[Computer Vision fields](~/AIVisualProvision/Source/VisualProvision/AppSettings.cs?range=27-30)]


## Create a Service Principal

The [Azure Fluent SDK] requires an [Azure Service Principal](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals) account to deploy the Azure services from the app itself .

You can create a Service Principal either using Azure Cloud Shell or by using the Azure CLI, as follows:

First log in and select the subscription you'd like to use.

```
az login
az account list
az account set --subscription "<subscription name or subscription id>"
```

Then create your Service Principal (note that it may take some time to complete).

```
az ad sp create-for-rbac --name <servicePrincipalName> --password <yourSPStrongPassword>
```

Upon successful completion, you should see the following JSON output containing the necessary credentials.

```json
{
  "clientId": "(...)",
  "clientSecret": "(...)",
  "subscriptionId": "(...)",
  "tenantId": "(...)",
  ...
}
```
Take note of the `clientId`, and `tenantId` values. Add them to the appropriate fields in the *Source\VisualProvision\AppSettings.cs* file.

[!code-csharp[Computer Vision fields](~/AIVisualProvision/Source/VisualProvision/AppSettings.cs?range=8-16)]

## Run the app

At this point, you have given the app a reference to a trained Custom Vision model, the Computer Vision service, and a Service Principal account. In Visual Studio, select either the VisualProvision.Android or VisualProvision.iOS project in the solution explorer, and choose a corresponding emulator or connected mobile device from the dropdown menu in the main toolbar. Then run the app.

## Clean up resources 

If you've followed the all of the steps and used the app to deploy Azure services to your account, be sure to go to the [Azure portal](https://ms.portal.azure.com/) when you're finished and cancel the services you don't wish to use.

Also, if you plan to create own object detection project with Custom Vision, you may want to delete the logo detection project from this tutorial. A free trial for Custom Vision allows for two projects.

On the [Custom Vision website](https://customvision.ai), navigate to **Projects** and select the trash can under My New Project.

![Screenshot of a panel labelled My New Project with a trash can icon](../media/csharp-tutorial/delete_od_project.png)

## Next steps

In this tutorial, you set up and explored a full-featured Xamarin.Forms app that utilizes the Custom Vision service to detect logos in mobile camera images. Next, learn best practices for building a Custom Vision model, so that when you create one for your own app, you can make it powerful and accurate.

> [!div class="nextstepaction"]
> [How to improve your classifier](getting-started-improving-your-classifier.md)