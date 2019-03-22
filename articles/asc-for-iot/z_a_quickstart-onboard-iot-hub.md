---
title: Onboard Azure IoT Security service to IoT Hub Preview| Microsoft Docs
description: Learn how to onboard Azure IoT Security service to your IoT Hub.
services: azureiotsecurity
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 670e6d2b-e168-4b14-a9bf-51a33c2a9aad
ms.service: azureiotsecurity
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/19/2019
ms.author: mlottner

---
# Quickstart: Onboard an IoT Hub

> [!IMPORTANT]
> Azure IoT Security is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to onboard the Azure IoT Security preview service into your IoT Hub.  

> [!NOTE]
> Azure IoT Security currently only supports standard tier and higher IoT Hubs.
>Azure IoT Security is a single hub solution. If you require multiple hubs, multiple solutions are required. 

## Prerequisites for onboarding
- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workpace by by Azure IoT Security; **security alerts** and **recommendations**. 
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs. 
- IoT Hub (standard tier or higher)

## Enable security on your IoT Hub 

To enable security on your IoT Hub, do the following: 

1. Open your **IoT Hub** in Azure portal. 
2. Select and open **Security** from the left menu. 
3. Choose **Enable IoT Security**. 
4. Provide your Log Analytics Workspace details. 
   - Elect to store **raw events** in addition to the default information types of storage by moving the **raw event** toggle **On**. 
5. Click **OK**. 
6. Click **Save**. 

Congratulations! You've completed onboarding Azure IoT Security to your IoT Hub. 

## Next steps
After onboarding Azure Iot Security to IoT Hub, continue configuring your solution by [adding devices to your IoT Hub](quickstart-add-a-device.md). 


## See Also
- [Azure IoT Security preview](overview.md)
- [Authentication](authentication-methods.md)
- [Azure IoT Security alerts](concepts-security-alerts.md)
- [Data access](data-access.md)
- - [Azure IoT Security FAQ](resources-frequently-asked-questions.md)