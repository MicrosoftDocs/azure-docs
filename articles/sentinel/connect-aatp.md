---
title: Collect Azure ATP data in Azure Sentinel | Microsoft Docs
description: Learn how to collect Azure ATP data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: MBaldwin
editor: ''

ms.assetid: 5bf3cc44-ecda-4c78-8a63-31ab42f43605
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 1/30/2019
ms.author: rkarlin

---
# Collect data from Azure Advanced Threat Protection (ATP)


You can stream logs from [Azure Advanced Threat Protection](https://docs.microsoft.com/azure-advanced-threat-protection/what-is-atp) into Azure Sentinel with a single click.

## Prerequisites

- User with global administrator or security administrator permissions

## Connect to Azure ATP

If you already have Azure ATP, make sure it is [enabled on your network](https://docs.microsoft.com/azure-advanced-threat-protection/install-atp-step1).
If Azure ATP is deployed and ingesting your data, the suspicious alerts can easily be streamed into Azure Sentinel.


1. In Azure Sentinel, select **Data collection** and then click the **Azure ATP** tile.

2. Click **Connect**.

## Next steps
In this document, you learned how to connect Azure Advanced Threat Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](qs-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

