---
title: Use Azure Portal to invoke direct methods
description: This article is an overview using the Azure portal to invoke direct methods.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.subservice:  
ms.workload: 
ms.topic: tutorial
ms.custom: 
ms.date: 07/16/2020
ms.author: inhenkel
---

# Tutorial: Use Azure portal to invoke direct methods

IoT Hub gives you the ability to invoke [direct methods](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-direct-methods#method-invocation-for-iot-edge-modules) on edge devices from the cloud. The Live Video Analytics on IoT Edge (LVA) module exposes several [direct methods](https://docs.microsoft.com/azure/media-services/live-video-analytics-edge/direct-methods) which can be used to define, deploy, and instantiate different workflows for analyzing live video. In this tutorial, you will learn how to invoke direct methods calls on Live Video Analytics on IoT Edge module via the Azure Portal.

## Prerequisites

This tutorial assumes that you have the Live Video Analytics on IoT Edge module running on your edge device, either via one of the [quickstarts](https://docs.microsoft.com/azure/media-services/live-video-analytics-edge/get-started-detect-motion-emit-events-quickstart) or via the [portal.](https://docs.microsoft.com/azure/media-services/live-video-analytics-edge/deploy-iot-edge-device)
Also, please read about [product overview](https://docs.microsoft.com/azure/media-services/live-video-analytics-edge/overview) and [media graph](https://docs.microsoft.com/azure/media-services/live-video-analytics-edge/media-graph-concept) concept if you have not already.

## Invoking direct methods via Azure Portal

Each of the [direct methods](https://docs.microsoft.com/en-us/azure/media-services/live-video-analytics-edge/direct-methods) exposed by the LVA module can be invoked via Azure Portal. The steps below provide the details for one direct method. You can invoke other direct methods using similar steps. However, each direct method requires a specific JSON body. See **link to quickstart1** for examples.

`GraphTopologyList` - As the name suggests, the method call is used to retrieve a list of all the graph topologies currently deployed on the Live Video Analytics on IoT Edge module. Use the following steps to invoke this direct method:

1. Log into Azure Portal
1. **<TODO steps to get to the edge module?**
1. Select the Live Video Analytics on IoT Edge module to bring up its configuration page.
    ![Select the Live Video Analytics on IoT Edge module to bring up its configuration page](media/image1.png)
1. Click on the Direct method menu option.
    ![Click on the Direct method menu option](media/image2.png)
    > [!NOTE]
    > You might need to add a value in the Connection string sections as you can see on the current page. You do not need to hide or change anything in the Setting name section. It is ok to let it be public.

1. Next, type *GraphTopologyList* in the **Method Name** field.
1. Next, copy and paste the JSON below in the **Payload** field.
    ```json
    {
    "@apiVersion":
    }
    ```
1. Click on the **Invoke Method** button at the top of the page.
    ![](media/image4.png)
1. You should see a status 200 message in the **Result** area.
    ![](media/image5.png)

## Responses

| Condition             | Status Code | Detailed Error Code |
|-----------------------|-------------|---------------------|
| Success               | 200         | N/A                 |
| General user errors   | 400 range   |                     |
| General server errors |   range     |                     |

## Next steps

You can find additional [direct methods](https://docs.microsoft.com/en-us/azure/media-services/live-video-analytics-edge/direct-methods)
that can be called on the LVA module and use the above steps to invoke them.

> [!Note]
> A graph instance instantiates a specific topology, so please ensure you have the right topology set before creating a graph instance.

The following [QuickStart](https://docs.microsoft.com/en-us/azure/media-services/live-video-analytics-edge/get-started-detect-motion-emit-events-quickstart) is a good reference to understand the exact sequence of direct method calls to be made
