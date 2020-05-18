---
title: Connect Azure Information Protection to Azure Sentinel
description: Learn how to connect Azure Information Protection data in Azure Sentinel.
services: sentinel
author: yelevin
manager: rkarlin
ms.assetid: bfa2eca4-abdc-49ce-b11a-0ee229770cdd
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: yelevin
---

# Connect data from Azure Information Protection

> [!IMPORTANT]
> The Azure Information Protection data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can stream logging information from [Azure Information Protection](https://azure.microsoft.com/services/information-protection/) into Azure Sentinel by configuring the Azure Information Protection data connector. Azure Information Protection helps you control and secure your sensitive data, whether it’s stored in the cloud or on-premises.

If [central reporting for Azure Information Protection](https://docs.microsoft.com/azure/information-protection/reports-aip) is already configured so that logging information from this service is stored in the same Log Analytics workspace as you've currently selected for Azure Sentinel, you can skip the configuration of this data connector. The logging information from Azure Information Protection is already available to Azure Sentinel.

However, if logging information from Azure Information Protection is going to a different Log Analytics workspace than the one you've currently selected for Azure Sentinel, do one of the following:

- Change the workspace selected in Azure Sentinel.

- Change the workspace for Azure Information Protection, which you can do by configuring this data connector.
    
    If you change the workspace, new reporting data for Azure Information Protection will now be stored in the workspace you're using for Azure Sentinel, and historical data isn't available to Azure Sentinel. In addition, if the previous workspace is configured for custom queries, alerts, or REST APIs, these must be reconfigured for the Azure Sentinel workspace if you want to carry on using them for Azure Information Protection. No reconfiguration is needed for clients and services that use Azure Information Protection.

## Prerequisites

- One of the following Azure AD administrator roles for your tenant: 
    - Azure Information Protection administrator
    - Security administrator
    - Compliance administrator
    - Compliance data administrator
    - Global administrator
    
    > [!NOTE]
    > You cannot use the Azure Information Protection administrator role if your tenant is on the [unified labeling platform](/information-protection/faqs#how-can-i-determine-if-my-tenant-is-on-the-unified-labeling-platform).
    
    These administrator roles are required only for configuring the Azure Information Protection connector, and aren't required when Azure Sentinel is connected to Azure Information Protection.

- Permissions to read and write to the Log Analytics workspace you're using for Azure Sentinel and Azure Information Protection.

- Azure Information Protection has been added to the Azure portal. If you need help with this step, see [Add Azure Information Protection to the Azure portal](https://docs.microsoft.com/azure/information-protection/quickstart-viewpolicy#add-azure-information-protection-to-the-azure-portal).

## Connect to Azure Information Protection

Use the following instructions if you haven't configured a Log Analytics workspace for Azure Information Protection, or you need to change the workspace that stores the Azure Information Protection logging information.

1. In Azure Sentinel, select **Data connectors**, and then **Azure Information Protection (Preview)**.

2. Select **Open connector page**.

3. On the **Configure analytics (Preview)** blade, select the workspace that you're currently using for Azure Sentinel. If you select a different workspace, the reporting data from Azure Information Protection won't be available to Azure Sentinel.

4. When you have selected a workspace, select **OK** and the connector **STATUS** should now change to **Connected**.

5. The reporting data from Azure Information Protection is stored in the **InformationProtectionLogs_CL** table within the selected workspace. 
    
    To use the relevant schema in Azure Monitor for this reporting data, search for **InformationProtectionEvents**. For information about these event functions, see the [Friendly schema reference for event functions](https://docs.microsoft.com/azure/information-protection/reports-aip#friendly-schema-reference-for-event-functions) section from the Azure Information Protection documentation.

## Next steps

In this document, you learned how to connect Azure Information Protection to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
