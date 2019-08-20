---
title: Connecting Azure Information Protection data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Azure Information Protection data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect data from Azure Information Protection

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from [Azure Information Protection](https://docs.microsoft.com/azure/information-protection/reports-aip) into Azure Sentinel with a single click. Azure Information Protection helps protect your data whether it’s stored in the cloud or in on-premises infrastructures and control and help secure email, documents, and sensitive data that you share outside your company. From easy classification to embedded labels and permissions, enhance data protection at all times with Azure Information Protection. When you connect Azure Information Protection to Azure Sentinel, you stream all the alerts from Azure Information Protection into Azure Sentinel.


## Prerequisites

- User with global administrator, security administrator, or information protection permissions


## Connect to Azure Information Protection

If you already have Azure Information Protection, make sure it is [enabled on your network](https://docs.microsoft.com/azure/information-protection/activate-service).
If Azure Information Protection is deployed and getting data, the alert data can easily be streamed into Azure Sentinel.


1. In Azure Sentinel, select **Data connectors** and then click the **Azure Information Protection** tile.

2. Go to the [Azure Information Protection portal](https://portal.azure.com/?ScannerConfiguration=true&EndpointDiscovery=true#blade/Microsoft_Azure_InformationProtection/DataClassGroupEditBlade/quickstartBlade) 

3. Under **Connection**, set up streaming of logs from Azure Information Protection to Azure Sentinel by clicking [Configure analytics](https://portal.azure.com/#blade/Microsoft_Azure_InformationProtection/DataClassGroupEditBlade/analyticsOnboardBlade)

4. Select the workspace into which you deployed Azure Sentinel. 

5. Click **OK**.

6. To use the relevant schema in Log Analytics for the Azure Information Protection alerts, search for **InformationProtectionLogs_CL**.




## Next steps
In this document, you learned how to connect Azure Information Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
