---
title: Connect Microsoft Defender ATP data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Microsoft Defender Advanced Threat Protection data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/13/2019
ms.author: rkarlin

---
# Connect alerts from Microsoft Defender Advanced Threat Protection 


> [!IMPORTANT]
> Ingestion of Microsoft Defender Advanced Threat Protection logs is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 

You can stream alerts from [Microsoft Defender Advanced Threat Protection](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) into Azure Sentinel with a single click. This connection enables you to stream the alerts from Microsoft Defender Advanced Threat Protection into Azure Sentinel. 

## Prerequisites

- Valid license for Microsoft Defender Advanced Threat Protection that is enabled as described in [Validate licensing provisioning and complete set up for Microsoft Defender Advanced Threat Protection](https://docs.microsoft.com/windows/security/threat-protection/microsoft-defender-atp/licensing). 
- You must be an administrator or a security administrator on the Azure Sentinel tenant.


## Connect to Microsoft Defender Advanced Threat Protection

If Microsoft Defender Advanced Threat Protection is deployed and ingesting your data, the alerts can easily be streamed into Azure Sentinel.


1. In Azure Sentinel, select **Data connectors**, click the **Microsoft Defender Advanced Threat Protection** tile and select **Open connector page**.
1. Click **Connect**. 
1. To use the relevant schema in Log Analytics for the Defender ATP alerts, search for **SecurityAlert** and the **Provider name** is **MDATP**.




## Next steps
In this document, you learned how to connect Microsoft Defender ATP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
