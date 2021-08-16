---
title: Connect Squadra Technologies secRMM data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Squadra Technologies secRMM data to Azure Sentinel.
services: sentinel
author: yelevin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/20/2021
ms.author: yelevin
---

# Connect your Squadra Technologies secRMM data to Azure Sentinel 

The Squadra Technologies secRMM connector allows you to easily connect your Squadra Technologies secRMM security solution logs with Azure Sentinel. It lets you view dashboards, create custom alerts, and improve investigation. This connector gives you  insights into USB removable storage events. Integration between Squadra Technologies secRMM and Azure Sentinel makes use of REST API.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Squadra Technologies secRMM 

Squadra Technologies secRMM can integrate and export logs directly to Azure Sentinel.
1. In the Azure Sentinel portal, click Data connectors and select Squadra Technologies secRMM and then Open connector page.

2. Follow the steps outlined in the [Squadra Technologies onboarding guide for Azure Sentinel](http://www.squadratechnologies.com/StaticContent/ProductDownload/secRMM/9.9.0.0/secRMMAzureSentinelAdministratorGuide.pdf) to get Squadra secRMM data in Azure Sentinel.   

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **CustomLogs** section, in the `secRMM_CL` table.

To query the Squadra Technologies secRMM logs, enter the table name at the top of the query window.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Squadra Technologies secRMM to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](/azure/sentinel/articles/sentinel/monitor-your-data.md) to monitor your data.