---
title: Connecting Azure Security Center data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Azure Security Center data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: d28c2264-2dce-42e1-b096-b5a234ff858a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Azure Security Center

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).



Azure Sentinel enables you to connect alerts from [Azure Security Center](../security-center/security-center-intro.md) and stream them into Azure Sentinel. 

## Prerequisites

- If you want to export alerts from Azure Security Center, you must be a contributor on the subscription whose logs you stream.

- You must have the [Azure Security Center Standard tier](../security-center/security-center-pricing.md) running on the subscription. If not, [upgrade your subscription to standard](https://azure.microsoft.com/pricing/details/security-center/).

- You must log in with a user that has global administrator or security administrator permissions on each subscription you want to connect.


## Connect to Azure Security Center

1. In Azure Sentinel, select **Data connectors** and then click the **Azure Security Center** tile.
1. In the right, click **Connect** next to each subscription whose alerts you want to stream into Azure Sentinel. Make sure to upgrade each subscription to Azure Security Center Standard tier to stream alerts to Azure Sentinel.

3. Click **Connect**.

4. To use the relevant schema in Log Analytics for the Azure Security Center alerts, search for **SecurityEvent**.

## Next steps
In this document, you learned how to connect Azure Security Center to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
