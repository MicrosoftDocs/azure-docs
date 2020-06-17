---
title: Architecture IoT Central Digital Distribution Center | Microsoft Docs
description: An architecture of Digital Distribution Center application template for IoT Central
author: KishorIoT
ms.author: nandab
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: overview
ms.date: 10/20/2019
---

# Architecture of IoT Central digital distribution center application template



Partners and customers can use the app template & following guidance to develop end to end **digital distribution center** solutions.

> [!div class="mx-imgBorder"]
> ![digital distribution center](./media/concept-ddc-architecture/digital-distribution-center-architecture.png)

1. Set of IoT sensors sending telemetry data to a gateway device
2. Gateway devices sending telemetry and aggregated insights to IoT Central
3. Data is routed to the desired Azure service for manipulation
4. Azure services like ASA or Azure Functions can be used to reformat data streams and send to the desired storage accounts 
5. Processed data is stored in hot storage for near real-time actions or cold storage for additional insight enhancements that is based on ML or batch analysis. 
6. Logic Apps can be used to power various business workflows in end-user business applications

## Details
Following section outlines each part of the conceptual architecture

## Video cameras 
Video cameras are the primary sensors in this digitally connected enterprise-scale ecosystem. Advancements in machine learning and artificial intelligence that allow video to be turned into structured data and process it at edge before sending to cloud. We can use IP cameras to capture images, compress them on the camera, and then send the compressed data over edge compute for video analytics pipeline or use GigE vision cameras to capture images on the sensor and then send these images directly to the Azure IoT Edge, which then compresses before processing in video analytics pipeline. 

## Azure IoT Edge Gateway
The "cameras-as-sensors" and edge workloads are managed locally by Azure IoT Edge and the camera stream is processed by analytics pipeline. The video analytics processing pipeline at Azure IoT Edge brings many benefits, including decreased response time, low-bandwidth consumption, which results in low latency for rapid data processing. Only the most essential metadata, insights, or actions are sent to the cloud for further action or investigation. 

## Device Management with IoT Central 
Azure IoT Central is a solution development platform that simplifies IoT device & Azure IoT Edge gateway connectivity, configuration, and management. The platform significantly reduces the burden and costs of IoT device management, operations, and related developments. Customers & partners can build an end to end enterprise solutions to achieve a digital feedback loop in distribution centers.

## Business Insights and actions using data egress 
IoT Central platform provides rich extensibility options through Continuous Data Export (CDE) and APIs. Business insights that are based on telemetry data processing or raw telemetry are typically exported to a preferred line-of-business application. It can be achieved through webhook, Service Bus, event hub, or blob storage to build, train, and deploy machine learning models and further enrich insights.

## Next steps
* Learn how to deploy [digital distribution center template](./tutorial-iot-central-digital-distribution-center.md)
* Learn more about [IoT Central retail templates](./overview-iot-central-retail.md)
* Learn more about IoT Central refer to [IoT Central overview](../core/overview-iot-central.md)
