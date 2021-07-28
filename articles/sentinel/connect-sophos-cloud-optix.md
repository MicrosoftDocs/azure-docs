---
title: Connect Sophos Cloud Optix data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Sophos Cloud Optix connector to pull <PRODUCT NAME> logs into Azure Sentinel. View <PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
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
> The Sophos Cloud Optix connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Sophos Cloud Optix connector allows you to easily connect all your Sophos Cloud Optix security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation.  This capability gives you more insight into your organization's cloud security and compliance posture and improves your cloud security operation capabilities. Integration between Sophos Cloud Optix and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Sophos Cloud Optix

Sophos Cloud Optix can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **Sophos Cloud Optix (Preview)**.

1. Select **Open connector page**.

1. Copy and save the **Workspace ID** and **Primary Key** from the connector page.

1. Follow the instructions from Sophos to [integrate with Microsoft Azure Sentinel](https://docs.sophos.com/pcg/optix/help/en-us/pcg/optix/tasks/IntegrateAzureSentinel.html) (starting from the third step).

## Find your data

After a successful connection is established, the data appears in **Logs** under the **Custom Logs** section, in the *SophosCloudOptix_CL* table.

To query Sophos Cloud Optix data, enter `SophosCloudOptix_CL` in the query window. See the **Next steps** tab on the connector page, and the [Sophos documentation](https://docs.sophos.com/pcg/optix/help/en-us/pcg/optix/concepts/ExampleAzureSentinelQueries.html), for some useful query samples.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Sophos Cloud Optix to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
