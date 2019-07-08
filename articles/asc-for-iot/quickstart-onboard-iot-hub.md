---

title: Enable Azure Security Center for IoT service in IoT Hub Preview| Microsoft Docs
description: Learn how to enable Azure Security Center for IoT service in your IoT Hub.
services: asc-for-iot
ms.service: asc-for-iot
documentationcenter: na
author: mlottner
manager: rkarlin
editor: ''

ms.assetid: 670e6d2b-e168-4b14-a9bf-51a33c2a9aad
ms.subservice: asc-for-iot
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/16/2019
ms.author: mlottner

---

# Quickstart: Enable service in IoT Hub

> [!IMPORTANT]
> Azure Security Center for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to enable the Azure Security Center (ASC) for IoT preview service on your IoT Hub.  

> [!NOTE]
> Azure Security Center for IoT currently only supports standard tier IoT Hubs.
> Azure Security Center for IoT is a single hub solution. If you require multiple hubs, multiple solutions are required. 

## Prerequisites for enabling the service

- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workspace by ASC for IoT; **security alerts** and **recommendations**. 
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs. 
- IoT Hub (standard tier)
- Meet all [service prerequisites](service-prerequisites.md) 
- Supported service regions
  - Central US
  - Northern Europe
  - Southeast Asia

## Enable ASC for IoT on your IoT Hub 

To enable security on your IoT Hub, do the following: 

1. Open your **IoT Hub** in Azure portal. 
2. Under the **Security** menu, click **Overview**, then click **Start preview**. 
3. Choose **Enable IoT Security**. 
4. Provide your Log Analytics Workspace details. 
   - Elect to store **raw events** in addition to the default information types of storage by leaving the **raw event** toggle **On**. 
   - Elect to enable **twin collection** by leaving the **twin collection** toggle **On**. 
5. Click **Save**. 

Congratulations! You've completed enabling ASC for IoT on your IoT Hub. 

## Next steps

Advance to the next article to learn how to configure your solution...

> [!div class="nextstepaction"]
> [Configure your solution](quickstart-configure-your-solution.md)
