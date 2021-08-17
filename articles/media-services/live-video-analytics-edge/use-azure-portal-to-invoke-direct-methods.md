---
title: How to use Azure portal to invoke Live Video Analytics direct methods
description: This article is an overview using the Azure portal to invoke Live Video Analytics direct methods.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.subservice:  
ms.workload: 
ms.topic: how-to
ms.custom: 
ms.date: 07/24/2020
ms.author: inhenkel
---

# How to use Azure portal to invoke Live Video Analytics direct methods

[!INCLUDE [redirect to Azure Video Analyzer](./includes/redirect-video-analyzer.md)]

IoT Hub gives you the ability to invoke [direct methods](../../iot-hub/iot-hub-devguide-direct-methods.md#method-invocation-for-iot-edge-modules) on edge devices from the cloud. The Live Video Analytics on IoT Edge (LVA) module exposes several [direct methods](./direct-methods.md) that can be used to define, deploy, and instantiate different workflows for analyzing live video.

In this article, you will learn how to invoke direct method calls on Live Video Analytics for an IoT Edge module via the Azure portal.

## Prerequisites

* You have the Live Video Analytics on IoT Edge module running on your edge device, using either the methods described in [Quickstart: Live Video Analytics on IoT Edge](./get-started-detect-motion-emit-events-quickstart.md) or using the [portal.](./deploy-iot-edge-device.md)

* You understand [Live Video Analytics](./overview.md) and [the media graph concept](./media-graph-concept.md).

## Invoking direct methods via Azure portal

Each of the [direct methods](./direct-methods.md) exposed by the LVA module can be invoked via Azure portal. The steps below provide the details for one direct method. You can invoke other direct methods using similar steps. However, each direct method requires a specific JSON body.

Use the `GraphTopologyList` method call to retrieve a list of all the graph topologies currently deployed on the Live Video Analytics on IoT Edge module. Use the following steps to invoke this direct method:

1. Log into Azure portal
1. Find the relevant resource group from your portal homepage to locate your IoT Hub, or if you know you IoT Hub, select it.
    ![resource group in portal home page](media/use-azure-portal-to-invoke-directs-methods/portal-rg-home.png)
1. Once on the IoT Hub page, select IoT Edge under Automatic Device Management to list the various device IDs. Select the relevant device ID to list the modules running on the device.
    ![iot hub page](media/use-azure-portal-to-invoke-directs-methods/iot-hub-page.png)
1. Select the Live Video Analytics on IoT Edge module to bring up its configuration page.<br><br>
    ![Select the Live Video Analytics on IoT Edge module to bring up its configuration page](media/use-azure-portal-to-invoke-directs-methods/modules.png)
1. Select on the Direct method menu option. <br><br>
    ![Click on the Direct method menu option](media/use-azure-portal-to-invoke-directs-methods/module-details.png)
    > [!NOTE]
    > You might need to add a value in the Connection string sections as you can see on the current page. You do not need to hide or change anything in the Setting name section. It is ok to let it be public.

1. Type *GraphTopologyList* in the **Method Name** field.
1. Copy and paste the JSON below in the **Payload** field.
    ```json
    {
    "@apiVersion": "2.0"
    }
    ```
1. Select the **Invoke Method** button at the top of the page.<br><br>
    ![invoke method button](media/use-azure-portal-to-invoke-directs-methods/direct-method.png)
1. You should see a status 200 message in the **Result** area.<br><br>
    ![connection timeout](media/use-azure-portal-to-invoke-directs-methods/connection-timeout.png)

## Responses

| Condition             | Status Code | Detailed Error Code |
|-----------------------|-------------|---------------------|
| Success               | 200         | N/A                 |
| General user errors   | 400 range   |                     |
| General server errors | 500 range   |                     |

## Next steps

More direct methods can be found on the [direct methods](./direct-methods.md) page.

> [!NOTE]
> A graph instance instantiates a specific topology, so please ensure you have the right topology set before creating a graph instance.

[Quickstart: Detect motion emit events](./get-started-detect-motion-emit-events-quickstart.md) is a good reference for understanding the exact sequence of direct method calls to be made.
