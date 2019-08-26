---
title: Connecting Azure Information Protection data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Azure Information Protection data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: cabailey
manager: rkarlin

ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/26/2019
ms.author: cabailey

---
# Connect data from Azure Information Protection

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logging information from [Azure Information Protection](https://azure.microsoft.com/services/information-protection/) into Azure Sentinel by configuring the Azure Information Protection data connector. Azure Information Protection helps you control and secure your sensitive data, whether it’s stored in the cloud or on-premises. When you connect Azure Sentinel to Azure Information Protection, you stream logging information from Azure Information Protection into Azure Sentinel.

If central reporting for Azure Information Protection is already configured to use the same Log Analytics workspace as you've currently selected for Azure Sentinel, you don't need to configure this data connector. Configure this data connector only if central reporting for Azure Information Protection is not already configured, or it's configured but currently using a different workspace to the one you're using for Azure Sentinel.

To learn more about the logging information that's available from Azure Information Protection, and the configuration from Azure Information Protection, see [Central reporting for Azure Information Protection](https://docs.microsoft.com/azure/information-protection/reports-aip). 

## Prerequisites

- You must be an Azure Information Protection administrator, Security administrator, or Global administrator for your tenant.
    
    > [!NOTE]
    > You cannot use the Azure Information Protection administrator role if your tenant is on the [unified labeling platform](https://docs.microsoft.com/azure/information-protection/faqs#how-can-i-determine-if-my-tenant-is-on-the-unified-labeling-platform).

- Permissions to read and write to the Log Analytics workspace you're using for Sentinel and Azure Information Protection. For example, a user with the Log Analytics Contributor role, or the Azure role of Owner.
    
    For information about read and write permissions to workspaces, see [Manage log data and workspaces in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/manage-access).

- Azure Information Protection has been added to the Azure portal. If you need help with this step, see [Add Azure Information Protection to the Azure portal](https://docs.microsoft.com/en-us/azure/information-protection/quickstart-viewpolicy#add-azure-information-protection-to-the-azure-portal).

## Connect to Azure Information Protection

Like Azure Sentinel, Azure Information Protection uses a Log Analytics workspace to centrally collect logging information. When you connect Sentinel to Azure Information Protection, you're prompted to select a workspace and you must select the same workspace that you've currently selected to use for Azure Sentinel.

If a different workspace has already been [configured for Azure Information Protection analytics](https://docs.microsoft.com/azure//information-protection/reports-aip#configure-a-log-analytics-workspace-for-the-reports), the following procedure changes the existing configuration for Azure Information Protection analytics. New reporting data for Azure Information Protection will now be stored in the workspace you're using for Sentinel, and any custom queries created for the previously configured workspace will need to be recreated for the Azure Sentinel workspace.

1. In Azure Sentinel, select **Data connectors**, and then **Azure Information Protection**.

2. On the **Azure Information Protection** blade, you see the **STATUS** displays **Not connected**. Select **Open connector page**.

3. On the next blade, in the **Configuration** section, select **Azure Information Protection** to go to **Azure Information Protection analytics**.

4. From the list of available workspaces, select the workspace that you're currently using for Azure Sentinel. If you select a different workspace, or create a new workspace that you then select, the reporting data from Azure Information Protection won't be available to Azure Sentinel.

5. When you have selected a workspace, select **OK** and the connector **STATUS** should now change to **Connected**.

6. The reporting data from Azure Information Protection is stored in the **InformationProtectionLogs_CL** table within the selected workspace. To use the relevant schema in Azure Monitor for this reporting data, search for **InformationProtectionEvents**. For information about these event functions, see the [Friendly schema reference for event functions](https://docs.microsoft.com/azure/information-protection/reports-aip#friendly-schema-reference-for-event-functions) section from the Azure Information Protection documentation.

## Next steps
In this document, you learned how to connect Azure Information Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
