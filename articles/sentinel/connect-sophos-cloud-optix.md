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
# Connect your Sophos Cloud Optix to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Sophos Cloud Optix connector allows you to easily connect all your Sophos Cloud Optix security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation.  This gives you more insight into your organization's cloud security and compliance posture and improves your cloud security operation capabilities. Integration between Sophos Cloud Optix and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Sophos Cloud Optix 

Sophos Cloud Optix can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click Data connectors and select Sophos Cloud Optix connector.

1. Select Open connector page.

1. Follow the instruction on the Sophos Cloud Optix page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under CustomLogs SophosCloudOptix_CL.
To use the relevant schema in Log Analytics for the Sophos Cloud Optix, search for SophosCloudOptix_CL.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Sophos Cloud Optix to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
