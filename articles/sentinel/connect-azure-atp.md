---
title: Connect Azure ATP data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Azure ATP data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 5bf3cc44-ecda-4c78-8a63-31ab42f43605
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Azure Advanced Threat Protection (ATP)

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


You can stream logs from [Azure Advanced Threat Protection](https://docs.microsoft.com/azure-advanced-threat-protection/what-is-atp) into Azure Sentinel with a single click.

## Prerequisites

- User with global administrator or security administrator permissions
- You must be a private preview customer of Azure ATP

## Connect to Azure ATP

Make sure the Azure ATP private preview version is [enabled on your network](https://docs.microsoft.com/azure-advanced-threat-protection/install-atp-step1).
If Azure ATP is deployed and ingesting your data, the suspicious alerts can easily be streamed into Azure Sentinel. It may take up to 24 hours for the alerts to start streaming into Azure Sentinel.



1. In Azure Sentinel, select **Data connectors** and then click the **Azure ATP** tile.

2. Click **Connect**.

6. To use the relevant schema in Log Analytics for the Azure ATP alerts, search for **SecurityAlert**.

## Next steps
In this document, you learned how to connect Azure Advanced Threat Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

