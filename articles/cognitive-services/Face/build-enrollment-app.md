---
title: Build an enrollment app for Android with React
titleSuffix: Azure Cognitive Services
description: Learn how to set up your development environment and deploy a Face enrollment app to get consent from customers.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 11/17/2020
ms.author: pafarley
---

# Build an enrollment app for Android with React

This guide will show you how to get started with the sample Face enrollment application. The app demonstrates best practices for obtaining meaningful consent to enroll users into a face recognition service and acquire high-accuracy face data. An integrated system could use an enrollment app like this to provide touchless access control, identity verification, attendance tracking, personalization kiosk, or identity verification, based on their face data.

When launched, the application shows users a detailed consent screen. If the user gives consent, the app prompts for a username and password and then captures a high-quality face image using the device's camera.

The sample enrollment app is written using JavaScript and the React Native framework. It can currently be deployed on Android devices; more deployment options are coming in the future.

## Prerequisites 

* An Azure subscription – [Create one for free](https://azure.microsoft.com/free/cognitive-services/).  
* Once you have your Azure subscription, [create a Face resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace) in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.  
  * You'll need the key and endpoint from the resource you created to connect your application to Face API.  
  * For local development and testing, you can paste the API key and endpoint into the configuration file. For final deployment, store the API key in a secure location and never in the code.  

> [!IMPORTANT]
> These subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.

## Set up the development environment

1. Clone the git repository for the [sample enrollment app](https://github.com/azure-samples/cognitive-services-FaceAPIEnrollmentSample).
1. To set up your development environment, follow the <a href="https://reactnative.dev/docs/environment-setup"  title="React Native documentation"  target="_blank">React Native documentation </a>. Select **React Native CLI Quickstart** as your development OS and select **Android** as the target OS. Complete the sections **Installing dependencies** and **Android development environment**.
1. Open the env.json file in your preferred text editor, such as [Visual Studio Code](https://code.visualstudio.com/), and add your endpoint and key. You can get your endpoint and key in the Azure portal under the **Overview** tab of your resource. This step is only for local testing purposes&mdash;don't check in your Face API key to your remote repository.
1. Run the app using either the Android Virtual Device emulator from Android Studio, or your own Android device. To test your app on a physical device, follow the relevant <a href="https://reactnative.dev/docs/running-on-device"  title="React Native documentation"  target="_blank">React Native documentation </a>.  


## Create an enrollment experience  

Now that you have set up the sample enrollment app, you can tailor it to your own enrollment experience needs.

For example, you may want to add situation-specific information on your consent page:

> [!div class="mx-imgBorder"]
> ![app consent page](./media/enrollment-app/1-consent-1.jpg)

The service provides image quality checks to help you make the choice of whether the image is of sufficient quality to enroll the customer or attempt face recognition. This app demonstrates how to access frames from the device's camera, select the highest-quality frames, and enroll the detected face into the Face API service. 

Many face recognition issues are caused by low-quality reference images. Some factors that can degrade model performance are:
* Face size (faces that are distant from the camera)
* Face orientation (faces turned or tilted away from camera)
* Poor lighting conditions (either low light or backlighting) where the image may be poorly exposed or have too much noise
* Occlusion (partially hidden or obstructed faces) including accessories like hats or thick-rimmed glasses)
* Blur (such as by rapid face movement when the photograph was taken). 

> [!div class="mx-imgBorder"]
> ![app image capture instruction page](./media/enrollment-app/4-instruction.jpg)

Notice the app also offers functionality for deleting the user's enrollment and the option to re-enroll.

> [!div class="mx-imgBorder"]
> ![profile management page](./media/enrollment-app/10-manage-2.jpg)

To extend the app's functionality to cover the full enrollment experience, read the [overview](enrollment-overview.md) for additional features to implement and best practices.

## Deploy the enrollment app

### Android

First, make sure that your app is ready for production deployment: remove any keys or secrets from the app code and make sure you have followed the [security best practices](../cognitive-services-security.md?tabs=command-line%2ccsharp).

When you're ready to release your app for production, you'll generate a release-ready APK file, which is the package file format for Android apps. This APK file must be signed with a private key. With this release build, you can begin distributing the app to your devices directly. 

Follow the <a href="https://developer.android.com/studio/publish/preparing#publishing-build"  title="Prepare for release"  target="_blank">Prepare for release </a> documentation to learn how to generate a private key, sign your application, and generate a release APK.  

Once you've created a signed APK, see the <a href="https://developer.android.com/studio/publish"  title="Publish your app"  target="_blank">Publish your app </a> documentation to learn more about how to release your app.

## Next steps  

In this guide, you learned how to set up your development environment and get started with the sample enrollment app. If you're new to React Native, you can read their [getting started docs](https://reactnative.dev/docs/getting-started) to learn more background information. It also may be helpful to familiarize yourself with [Face API](Overview.md). Read the other sections on enrollment app documentation before you begin development.