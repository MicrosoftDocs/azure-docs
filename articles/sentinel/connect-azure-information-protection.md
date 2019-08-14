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
ms.date: 08/14/2019
ms.author: rkarlin

---
# Connect data from Azure Information Protection

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from [Azure Information Protection](https://azure.microsoft.com/en-us/services/information-protection/) into Azure Sentinel with a single click. Azure Information Protection helps you control and secure your sensitive data, whether it’s stored in the cloud or on-premises. When you connect Azure Information Protection to Azure Sentinel, you stream all the [central reporting information from Azure Information Protection](https://docs.microsoft.com/azure/information-protection/reports-aip) into Azure Sentinel.


## Prerequisites

- User with global administrator, security administrator, or information protection permissions

- A Log Analytics workspace configured for Azure Information Protection. For instructions, see [Configure a Log Analytics workspace for the reports](/information-protection/reports-aip#configure-a-log-analytics-workspace-for-the-reports) from the Azure Information Protection documentation.

## Connect to Azure Information Protection

To get reporting information from Azure Information Protection, you need to identify the preconfigured Log Analytics workspace from the Azure Information Protection blade in the Azure portal. Then, the data from that workspace can be streamed into your Azure Sentinel workspace.

1. In Azure Sentinel, select **Data connectors**, and then **Azure Information Protection**.

2. Go to the [Azure Information Protection blade](https://portal.azure.com/?ScannerConfiguration=true&EndpointDiscovery=true#blade/Microsoft_Azure_InformationProtection/DataClassGroupEditBlade/quickstartBlade) 

3. Under **Connection**, set up streaming of logs from Azure Information Protection to Azure Sentinel by clicking [Configure analytics](https://portal.azure.com/#blade/Microsoft_Azure_InformationProtection/DataClassGroupEditBlade/analyticsOnboardBlade)

4. Select the workspace into which you deployed Azure Sentinel. 

5. Click **OK**.

6. To use the relevant schema in Log Analytics for the Azure Information Protection reporting data, search for **InformationProtectionLogs_CL**.


## Next steps
In this document, you learned how to connect Azure Information Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
