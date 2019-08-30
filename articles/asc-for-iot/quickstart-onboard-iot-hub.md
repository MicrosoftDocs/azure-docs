---

title: Enable Azure Security Center for IoT service in IoT Hub| Microsoft Docs
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

# Quickstart: Onboard Azure Security Center for IoT service in IoT Hub

This article provides an explanation of how to enable the Azure Security Center for IoT service on your existing IoT Hub. If you don't currently have an IoT Hub, see [Create an IoT Hub using the Azure portal](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-through-portal) to get started. 

> [!NOTE]
> Azure Security Center for IoT currently only supports standard tier IoT Hubs.
> Azure Security Center for IoT is a single hub solution. If you require multiple hubs, multiple Azure Security Center for IoT solutions are required. 

## Prerequisites for enabling the service

- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workspace by Azure Security Center for IoT; **security alerts** and **recommendations**. 
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs. 
- IoT Hub (standard tier)
- Meet all [service prerequisites](service-prerequisites.md) 

|Supported Azure service regions | ||
|---|---|---|
| Central US |East US |East US 2 |
| West Central US |West US |West US2 |
| Central US South|North Central US | Canada Central|
| Canada East| North Europe|Brazil South|
| France Central| UK West|UK South|
|West Europe|Northern Europe| Japan West|
|Japan East | Australia Southeast|Australia East|
|East Asia| Southeast Asia| Korea Central|
|Korea South| Central India| South India|
|

## Enable Azure Security Center for IoT on your IoT Hub 

To enable security on your IoT Hub, do the following: 

1. Open your **IoT Hub** in Azure portal. 
1. Under the **Security** menu, click **Secure your IoT solution**
1. Leave **Enable** selected as the default. 
1. Select your Log analytics workspace.
1. Provide your Log Analytics workspace details. 
   - Elect to enable **twin collection** by leaving the **twin collection** toggle **On**.
   - Elect to store **raw events** in addition to the default information types of storage by selecting the **Store raw device security events** in Log Analytics. Leave the **raw event** toggle **On**. 
    
1. Click **Save**. 

Congratulations! You've completed enabling Azure Security Center for IoT on your IoT Hub. 

## Next steps

Advance to the next article to configure your solution...

> [!div class="nextstepaction"]
> [Configure your solution](quickstart-configure-your-solution.md)


