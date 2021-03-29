---
title: Connect Microsoft Defender for Endpoint data to Azure Sentinel | Microsoft Docs
description: Learn how to connect Microsoft Defender for Endpoint (formerly Microsoft Defender ATP) data to Azure Sentinel.
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
ms.date: 09/16/2020
ms.author: yelevin

---
# Connect alerts from Microsoft Defender for Endpoint (formerly Microsoft Defender ATP)

> [!IMPORTANT]
>
> - **Microsoft Defender for Endpoint** was formerly known as **Microsoft Defender Advanced Threat Protection** or **MDATP**.
>
>     You may see the old name still in use in the product (including its data connector in Azure Sentinel) for a period of time.

The [Microsoft Defender for Endpoint](/windows/security/threat-protection/microsoft-defender-atp/microsoft-defender-advanced-threat-protection) connector lets you stream alerts from Microsoft Defender for Endpoint into Azure Sentinel. This will enable you to more comprehensively analyze security events across your organization and build playbooks for effective and immediate response.

> [!NOTE]
>
> To ingest the new raw data logs from Microsoft Defender for Endpoint's [advanced hunting](/windows/security/threat-protection/microsoft-defender-atp/advanced-hunting-overview), use the new connector for Microsoft 365 Defender (formerly Microsoft Threat Protection, [see documentation](./connect-microsoft-365-defender.md)).

## Prerequisites

- You must have a valid license for Microsoft Defender for Endpoint, as described in [Set up Microsoft Defender for Endpoint deployment](/windows/security/threat-protection/microsoft-defender-atp/licensing). 

- You must be a Global Administrator or a Security Administrator on the Azure Sentinel tenant.

## Connect to Microsoft Defender for Endpoint

If Microsoft Defender for Endpoint is deployed and ingesting your data, the alerts can easily be streamed into Azure Sentinel.

1. In Azure Sentinel, select **Data connectors**, select **Microsoft Defender for Endpoint** (may still be called *Microsoft Defender Advanced Threat Protection*) from the gallery and select **Open connector page**.

1. Click **Connect**. 

1. To query Microsoft Defender for Endpoint alerts in **Logs**, enter **SecurityAlert** in the query window, and add a filter where **Provider name** is **MDATP**.

## Next steps
In this document, you learned how to connect Microsoft Defender for Endpoint to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](./tutorial-detect-threats-built-in.md).