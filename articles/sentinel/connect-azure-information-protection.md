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
ms.date: 08/19/2019
ms.author: rkarlin

---
# Connect data from Azure Information Protection

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logs from [Azure Information Protection](https://azure.microsoft.com/en-us/services/information-protection/) into Azure Sentinel by configuring the Azure Information Protection data connector. Azure Information Protection helps you control and secure your sensitive data, whether it’s stored in the cloud or on-premises. When you connect Azure Sentinel to Azure Information Protection, you stream all the [central reporting information from Azure Information Protection](https://docs.microsoft.com/azure/information-protection/reports-aip) into Azure Sentinel.

## Prerequisites

- User with one of the following Azure AD roles:
    - Azure Information Protection administrator
    - Security administrator
    - Compliance administrator
    - Compliance data administrator
    - Global administrator
    
    > [!NOTE]
    > You cannot use the Azure Information Protection administrator role if your tenant is on the unified labeling platform to support unified sensitivity labels.
    > 
    > If Azure Information Protection is already configured for [central reporting](https://docs.microsoft.com/azure//information-protection/reports-aip), you can also use the **Security reader** role to connect to the existing Log Analytics workspace that's been configured for Azure Information Protection analytics.

- Permissions to read the Log Analytics workspace that is configured for Azure Information Protection. For example, a user with the Log Analytics Reader role or Azure role of Reader.
    
    If a workspace isn't yet configured for Azure Information Protection analytics, you'll need write permissions for the workspace that will store this reporting information. For example, a user with the Log Analytics Contributor role, or the Azure role of Owner.
    
    For information about read and write permissions to workspaces, see [Manage log data and workspaces in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/manage-access).

- Azure Information Protection has been added to the Azure portal. If you need help with this step, see [Add Azure Information Protection to the Azure portal](https://docs.microsoft.com/en-us/azure/information-protection/quickstart-viewpolicy#add-azure-information-protection-to-the-azure-portal)

## Connect to Azure Information Protection

Azure Information Protection uses a Log Analytics workspace to centrally collect logging information. If this workspace has already been [configured for Azure Information Protection analytics](https://docs.microsoft.com/azure//information-protection/reports-aip#configure-a-log-analytics-workspace-for-the-reports), select that workspace when you configure the data connector. If you select a different workspace, Sentinel won't be able to get the logging information from Azure Information Protection.

If a workspace isn't yet configured for Azure Information Protection analytics, you can configure it when you configure the data connector.

1. In Azure Sentinel, select **Data connectors**, and then **Azure Information Protection**.

2. On the **Azure Information Protection** blade, you see the **STATUS** displays **Not connected**. Select **Open connector page**.

3. On the next blade, in the **Configuration** section, select **Azure Information Protection** to go to Azure Information Protection analytics.

4. If a workspace is already configured for Azure Information Protection analytics, select it.
    
    If a workspace isn't yet configured for Azure Information Protection analytics, you can configure it now by selecting an existing workspace, or by creating a new one and then selecting it.
    
    If you need help with creating a new workspace, see the information for [Create a workspace](/azure/azure-monitor/learn/quick-create-workspace) from the Azure Monitor documentation.

5. When you have selected a workspace, select **OK** and the connector **STATUS** should now change to **Connected**.

6. The reporting data from Azure Information Protection is stored in the **InformationProtectionLogs_CL** table within the selected workspace. To use the relevant schema in Azure Monitor for this reporting data, use the **InformationProtectionEvents** functions. For information about these event functions, see the [Friendly schema reference for event functions](https://docs.microsoft.com/azure/information-protection/reports-aip#friendly-schema-reference-for-event-functions) section from the Azure Information Protection documentation.

## Next steps
In this document, you learned how to connect Azure Information Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
