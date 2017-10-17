---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Deploy Azure Stream Analytics with Azure IoT Edge | Microsoft Docs 
description: Deploy Azure Stream Analytics as a module to an edge device
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Deploy Azure Stream Analytics as an IoT Edge module

Assume Tutorial 1 
Create a storage account (Azure portal) 
Link storage account and ASA  (ASA portal) 
Create query  (ASA portal) 
Compile query to storage account (ASA portal) 
Update deployment with ASA module using the "deploy to device" wizard: 
Add existing module JSON, ASA module JSON, ASA module twin via service to service integration 
Add routes 
Push deploy 
Monitor container reporting status in Ibiza 
[Optional] see the telemetry flowing in with iothub explorer 
[Optional] see logs on device 