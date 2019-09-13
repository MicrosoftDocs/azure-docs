---
title: Connect Cloud App Security data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Cloud App Security data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: cd9e5e27-fdd4-4717-8924-be4c1c430f23
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/10/2019
ms.author: rkarlin

---
# Connect data from Microsoft Cloud App Security 

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from [Cloud App Security](https://docs.microsoft.com/cloud-app-security/what-is-cloud-app-security) into Azure Sentinel with a single click. This connection enables you to stream the alerts from Cloud App Security into Azure Sentinel. 

## Prerequisites

- User with global administrator or security administrator permissions

## Connect to Cloud App Security

If you already have Cloud App Security, make sure it is [enabled on your network](https://docs.microsoft.com/cloud-app-security/getting-started-with-cloud-app-security).
If Cloud App Security is deployed and ingesting your data, the alert data can easily be streamed into Azure Sentinel.


1. In Azure Sentinel, select **Data connectors** and then click the **Cloud App Security** tile.

2. Click **Connect**.

3. To use the relevant schema in Log Analytics for the Cloud App Security alerts, search for **SecurityAlert**.


## Next steps
In this document, you learned how to connect Microsoft Cloud App Security to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
