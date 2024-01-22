---
title: What is Custom Vision?
titleSuffix: Azure AI services
description: Learn how to use the Azure AI Custom Vision service to build custom AI models to detect objects or classify images.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-custom-vision
ms.topic: overview
ms.date: 07/04/2023
ms.author: pafarley
ms.custom: cog-serv-seo-aug-2020
keywords: image recognition, image identifier, image recognition app, custom vision
#Customer intent: As a data scientist/developer, I want to understand what the Custom Vision service does so that I can determine if it's suitable for my project.
---

# What is Custom Vision?

Azure AI Custom Vision is an image recognition service that lets you build, deploy, and improve your own image identifier models. An image identifier applies labels to images, according to their visual characteristics. Each label represents a classification or object. Unlike the [Azure AI Vision](../computer-vision/overview.md) service, Custom Vision allows you to specify your own labels and train custom models to detect them.

> [!TIP]
> The Azure AI vision Image Analysis API, based on Florence foundational model, now supports custom models with few-shot learning capability. [Use Image Analysis 4.0](../computer-vision/how-to/model-customization.md) to create custom image identifier models using the latest technology from Azure. To migrate a Custom Vision project to the new Image Analysis 4.0 system, see the [Migration guide](../computer-vision/how-to/migrate-from-custom-vision.md). To compare the two services, see the [Comparison page](./concepts/compare-alternatives.md).


You can use Custom Vision through a client library SDK, REST API, or through the [Custom Vision web portal](https://customvision.ai/). Follow a quickstart to get started.

> [!div class="nextstepaction"]
> [Quickstart (web portal)](getting-started-build-a-classifier.md)

:::image type="content" source="media/overview/image-example.png" alt-text="Screenshot of an image on the Custom Vision website with predicted tags." :::

This documentation contains the following types of articles:
* The [quickstarts](./getting-started-build-a-classifier.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time.
* The [how-to guides](./test-your-model.md) contain instructions for using the service in more specific or customized ways.
* The [tutorials](./iot-visual-alerts-tutorial.md) are longer guides that show you how to use this service as a component in broader business solutions.
<!--* The [conceptual articles](Vision-API-How-to-Topics/call-read-api.md) provide in-depth explanations of the service's functionality and features.-->

For a more structured approach, follow a Training module for Custom Vision:
* [Classify images with the Custom Vision service](/training/modules/classify-images-custom-vision/)
* [Classify endangered bird species with Custom Vision](/training/modules/cv-classify-bird-species/)

## How it works

The Custom Vision service uses a machine learning algorithm to analyze images. You submit sets of images that have and don't have the visual characteristics you're looking for. Then you label the images with your own custom labels (tags) at the time of submission. The algorithm trains to this data and calculates its own accuracy by testing itself on the same images. Once you've trained your model, you can test, retrain, and eventually use it in your image recognition app to [classify images](getting-started-build-a-classifier.md) or [detect objects](get-started-build-detector.md). You can also [export the model](export-your-model.md) for offline use.

### Classification and object detection

Custom Vision functionality can be divided into two features. **[Image classification](getting-started-build-a-classifier.md)** applies one or more labels to an entire image. **[Object detection](get-started-build-detector.md)** is similar, but it returns the coordinates in the image where the applied label(s) can be found.

### Optimization

The Custom Vision service is optimized to quickly recognize major differences between images, so you can start prototyping your model with a small amount of data. It's generally a good start to use 50 images per label. However, the service isn't optimal for detecting subtle differences in images (for example, detecting minor cracks or dents in quality assurance scenarios).

Additionally, you can choose from several variations of the Custom Vision algorithm that are optimized for images with certain subject material&mdash;for example, landmarks or retail items. For more information, see [Select a domain](select-domain.md).

## How to use it

The Custom Vision Service is available as a set of native SDKs and through a web-based interface on the [Custom Vision portal](https://customvision.ai/). You can create, test, and train a model through either interface or use both together.

### Supported browsers for Custom Vision web portal

The Custom Vision portal can be used by the following web browsers:
-	Microsoft Edge (latest version)
-	Google Chrome (latest version)

![Custom Vision website in a Chrome browser window](media/browser-home.png)

## Backup and disaster recovery

As a part of Azure, Custom Vision Service has components that are maintained across multiple regions. Service zones and regions are used by all of our services to provide continued service to our customers. For more information on zones and regions, see [Azure regions](../../availability-zones/az-overview.md). If you need additional information or have any issues, [contact support](/answers/topics/azure-custom-vision.html).


## Data privacy and security

As with all of the Azure AI services, developers using the Custom Vision service should be aware of Microsoft's policies on customer data. See the [Azure AI services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Data residency

Custom Vision primarily doesn't replicate data out of the specified region, except for one region, `NorthCentralUS`, where there is no local Azure Support.

## Next steps

* Follow the [Build a classifier](getting-started-build-a-classifier.md) quickstart to get started using Custom Vision on the web portal.
* Or, complete an [SDK quickstart](quickstarts/image-classification.md) to implement the basic scenarios with code.
