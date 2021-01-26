---
title: Connect <PRODUCT NAME> data to Azure Sentinel | Microsoft Docs
description: Learn how to use the <PRODUCT NAME> connector to pull <PRODUCT NAME> logs into Azure Sentinel. View <PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/26/2021
ms.author: yelevin
---
# Connect your Onapsis Platform to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Onapsis Platform appliance to Azure Sentinel. The Onapsis Platform data connector allows you to easily connect your Onapsis Platform logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Once the data connector is configured, the SOC has access to a live feed of security incidents detected by OP in near real-time. Onapsis supplies Sentinel with the description and next steps for each incident, enabling InfoSec analysts to efficiently respond to and resolve any security threats affecting SAP Systems.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Onapsis Platform logs to the Syslog agent  

Configure the Onapsis Platform to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Go to the following page in the in-product help: Setup > Third-party integrations > Defend alarms. This guide gives you all the information you need to complete the configuration: creating an integration provider and an integration profile.

1. To use the relevant schema in Log Analytics for the Onapsis Platform, search for CommonSecurityLog.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).

## Next steps

In this document, you learned how to connect Onapsis Platform to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
