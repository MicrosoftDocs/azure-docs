---
title: include file
description: include file
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: include
ms.date: 07/17/2019
ms.author: robinsh
ms.custom: include file
---
<!-- This contains intro text for the "Get an IoT hub connection string" section in the iot-hub-lang-lang-schedule-jobs.md files-->

In this article, you create a backend service that schedules a job to invoke a direct method on a device, schedules a job to update the device twin, and monitors the progress of each job. To perform these operations, your service needs the **service connect** and **registry read** permissions. There is no default shared access policy that contains only these two permissions, so you need to create one.
