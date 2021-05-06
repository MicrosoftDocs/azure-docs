---
title: Connect Microsoft Defender for Identity (formerly Azure ATP) data to Azure Sentinel| Microsoft Docs
description: Learn how to stream logs from Microsoft Defender for Identity (formerly Azure Advanced Threat Protection) (ATP) into Azure Sentinel with a single click.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect data from Microsoft Defender for Identity (formerly Azure Advanced Threat Protection)

> [!IMPORTANT]
> The Microsoft Defender for Identity data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes how to stream security alerts from [Microsoft Defender for Identity](/azure-advanced-threat-protection/what-is-atp) into Azure Sentinel. 

To forward health alerts in addition to security alerts, integrate Microsoft Defender for Identity with a Syslog server. For more information, see the [Microsoft Defender for Identity documentation](/defender-for-identity/setting-syslog). 

## Prerequisites

- User with global administrator or security administrator permissions
- You must be a preview customer of Microsoft Defender for Identity and enable integration between Microsoft Defender for Identity and Microsoft Cloud App Security. For more information, see [Microsoft Defender for Identity Integration](/cloud-app-security/mdi-integration).

## Connect to Microsoft Defender for Identity

Make sure the Microsoft Defender for Identity preview version is [enabled on your network](/azure-advanced-threat-protection/install-atp-step1).
If Microsoft Defender for Identity is deployed and ingesting your data, the suspicious alerts can easily be streamed into Azure Sentinel. It may take up to 24 hours for the alerts to start streaming into Azure Sentinel.


1. To connect Microsoft Defender for Identity to Azure Sentinel, you must first enable integration between Microsoft Defender for Identity and Microsoft Cloud App Security. For information on how to do this, see [Microsoft Defender for Identity integration](/cloud-app-security/mdi-integration).

1. In Azure Sentinel, select **Data connectors** and then click the **Microsoft Defender for Identity (Preview)** tile.

1. You can select whether you want the alerts from Microsoft Defender for Identity to automatically generate incidents in Azure Sentinel automatically. Under **Create incidents** select **Enable** to enable the default analytic rule that creates incidents automatically from alerts generated in the connected security service. You can then edit this rule under **Analytics** and then **Active rules**.

1. Click **Connect**.

1. To use the relevant schema in Log Analytics for the Microsoft Defender for Identity alerts, search for **SecurityAlert**.

> [!NOTE]
> If the alerts are larger than 30 KB, Azure Sentinel stops displaying the Entities field in the alerts.

## Next steps
In this document, you learned how to connect Microsoft Defender for Identity to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
