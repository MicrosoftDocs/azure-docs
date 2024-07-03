---
title: Upload files from devices to Azure IoT Hub (Node)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Node.js. Uploaded files are stored in an Azure storage blob container.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: mqtt, devx-track-js
---

## Overview

This article describes how to use Node.js to:

* Use device app code to upload a file to storage using a SAS URI provided by IoT Hub.
* Create a backend service to receive file upload notifications from IoT Hub.
