---

title: Onboard ATP for IoT service to IoT Hub Preview| Microsoft Docs
description: Learn how to onboard ATP for IoT service to your IoT Hub.
services: atpforiot
documentationcenter: na
author: mlottner
manager: barbkess
editor: ''

ms.assetid: 670e6d2b-e168-4b14-a9bf-51a33c2a9aad
ms.service: atpforiot
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/25/2019
ms.author: mlottner

---

# Quickstart: Onboard an IoT Hub

> [!IMPORTANT]
> ATP for IoT is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article provides an explanation of how to onboard the ATP for IoT preview service into your IoT Hub.  

> [!NOTE]
> ATP for IoT currently only supports standard tier and higher IoT Hubs.
>ATP for IoT is a single hub solution. If you require multiple hubs, multiple solutions are required. 

## Prerequisites for onboarding
- Log Analytics workspace
  - Two types of information are stored by default in your Log Analytics workpace by by ATP for IoT; **security alerts** and **recommendations**. 
  - You can choose to add storage of an additional information type, **raw events**. Note that storing **raw events** in Log Analytics carries additional storage costs. 
- IoT Hub (standard tier or higher)

## Enable ATP for IoT on your IoT Hub 

To enable security on your IoT Hub, do the following: 

1. Open your **IoT Hub** in Azure portal. 
2. Select and open **Security** from the left menu. 
3. Choose **Enable IoT Security**. 
4. Provide your Log Analytics Workspace details. 
   - Elect to store **raw events** in addition to the default information types of storage by leaving the **raw event** toggle **On**. 
   - Elect to enable **twin collection** by leaving the **twin collection** toggle **On**. 
5. Click **OK**. 
6. Click **Save**. 

Congratulations! You've completed onboarding ATP for IoT to your IoT Hub. 

## Next steps

1. Configure your [solution](quickstart-configure-your-solution.md).
1. [Create security modules](quickstart-create-security-twin.md).
1. Configure [custom alerts](quickstart-create-custom-alerts.md).
1. Deploy a security agent for [Windows](tutorial-deploy-windows-cs.md) or [Linux](tutorial-deploy-linux-cs.md), or [Send security messages using the SDK](tutorial-send-security-messages.md) directly.


## See Also
- [Overview](overview.md)
- [Configure authentication methods](how-to-configure-authentication-methods.md)
- [Understanding ATP for IoT alerts](concept-security-alerts.md)
- [Access your security-data](how-to-security-data-access.md)
- [ATP for IoT FAQ](resources-frequently-asked-questions.md)