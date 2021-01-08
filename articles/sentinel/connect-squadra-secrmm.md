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
ms.date: 02/20/2020
ms.author: yelevin

---

# Connect your Squadra Technologies secRMM data to Azure Sentinel 

> [!IMPORTANT]
> The Squadra Technologies Security Removable Media Manager (secRMM) data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


The Squadra Technologies secRMM connector allows you to easily connect your Squadra Technologies secRMM security solution logs with Azure Sentinel. It lets you view dashboards, create custom alerts, and improve investigation. This connector gives you  insights into USB removable storage events. Integration between Squadra Technologies secRMM and Azure Sentinel makes use of REST API.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Squadra Technologies secRMM 

Squadra Technologies secRMM can integrate and export logs directly to Azure Sentinel.
1. In the Azure Sentinel portal, click Data connectors and select Squadra Technologies secRMM and then Open connector page.

2. Follow the steps outlined in the [Squadra Technologies onboarding guide for Azure Sentinel](http://www.squadratechnologies.com/StaticContent/ProductDownload/secRMM/9.9.0.0/secRMMAzureSentinelAdministratorGuide.pdf) to get Squadra secRMM data in Azure Sentinel.   


## Find your data

After a successful connection is established, the data appears in Log Analytics under CustomLogs secRMM_CL.
To use the relevant schema in Log Analytics for the Squadra Technologies secRMM, search for secRMM_CL.

## Validate connectivity
It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 


## Next steps
In this document, you learned how to connect Squadra Technologies secRMM to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

