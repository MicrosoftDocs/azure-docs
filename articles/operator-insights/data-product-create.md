---
title: Create an Azure Operator Insights Data Product
description: In this article, learn how to create an Azure Operator Insights Data Product resource. 
author: bettylew
ms.author: bettylew
ms.service: operator-insights
ms.topic: quickstart
ms.date: 10/16/2023
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Create an Azure Operator Insights Data Product

In this article, you learn how to create an Azure Operator Insights Data Product instance.

> [!NOTE]
> Access is currently only available by request. More information is included in the application form. We appreciate your patience as we work to enable broader access to Azure Operator Insights Data Product. Apply for access by [filling out this form](https://aka.ms/AAn1mi6).

## Prerequisites

- An Azure subscription for which the user account must be assigned the Contributor role. If needed, create a [free subscription](https://azure.microsoft.com/free/) before you begin.
- Access granted to Azure Operator Insights for the subscription. Apply for access by [completing this form](https://aka.ms/AAn1mi6).
- If you're using Microsoft Purview, you must have an active Purview account. Make note of the Purview collection ID when you [set up Microsoft Purview with a Data Product](purview-setup.md).

### For CMK-based data encryption or Microsoft Purview

If you're using CMK-based data encryption or Microsoft Purview, you must set up Azure Key Vault and user-assigned managed identity (UAMI) as prerequisites.

#### Set up Azure Key Vault

You must be a subscription Owner to set up the Azure Key Vault resource.
1. [Create an Azure Key Vault resource](../key-vault/general/quick-create-portal.md) in the same subscription and resource group where you intend to deploy the Data Product resource.
1. Provide your user account with the Key Vault Administrator role on the Azure Key Vault resource.
1. Navigate to the object and select **Keys**. Select **Generate/Import**.
1. Enter a name for the key and leave the defaults for the remaining settings. Select **Create**.
1. Select the newly created key and select the current version of the key.
1. Copy the Key Identifier to your clipboard to use when creating the Data Product.

#### Set up user-assigned managed identity

1. [Create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity) using Microsoft Entra ID for CMK-based encryption. The Data Product also uses the UAMI to interact with the Microsoft Purview account.
1. Assign the appropriate Azure roles (RBAC) on the Key Vault by navigating to the Azure Key Vault resource that you created and assign the UAMI resource the Key Vault Administrator role.

## Create an Azure Operator Insights Data Product resource in the Azure portal

You'll create the Azure Operator Insights Data Product resource.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search bar, search for Operator Insights and select **Azure Operator Insights - Data Products**.
1. On the Azure Operator Insights - Data Products page, select **Create**.
1. In the Basics tab of the **Create a Data Product** page:
    1. Select your subscription.
    1. Select your resource group or select **Create new** to enter a new name.
        If you create a new resource group, fill in these fields:
        - Name - Enter the name for your Data Product instance. The name must start with a lowercase letter and can contain only lowercase letters and numbers.
        - Publisher - Select Microsoft.
        - Product - Select MCC.
        - Version - Select the version.

        Select **Next**.
    1. Select your region.
1. In the Advanced tab of the **Create a Data Product** page:
    1. Enable Purview if you're integrating with Microsoft Purview.

        Select the subscription for your Purview account, select your Purview account, and enter the Purview collection ID.
    1. Enable Customer managed key if you're using CMK for data encryption.
    1. Select the user-assigned managed identity that you set up as a prerequisite.
    1. Carefully paste the Key Identifier URI that was created when you set up Azure Key Vault as a prerequisite.
    1. If you're integrating with Purview, owners are mandatory. Select **Add owner**, enter the email address, and select **Add owners**.
1. In the Tags tab of the **Create a Data Product** page, select or enter the name/value pair used to categorize your data product resource.
1. Select **Review + create**.
1. Select **Create**. Your Data Product instance is created in about 20-25 minutes.

## Explore sample data

Once the data is uploaded and processed, you can access the consumption URL to query the data.

1. Navigate to your Data Product resource on the Azure portal and select the Permissions tab on the Security pane.
1. Select **Add Reader**. Add user accounts for the identities that will be provided reader access.
1. On the Overview page, copy the consumption URL and paste it in a new browser tab to see the database and list of tables.
1. Use the ADX query plane to write Kusto queries. For example:

    `session | take 10`

    ```
    enriched_flow_session_http
    | summarize count() by flowRecord_dpiStringInfo_application
    | order by count_ desc
    | take 10
    ```

    ```
    enriched_flow_session_http
    | summarize sum(flowRecord_dataStats_downLinkOctets) by bin(eventTimeFlow, 1h)
    | render columnchart
    ```

## Delete Azure resources

When you have finished exploring Azure Operator Insights Data Product, you should delete the resources you've created to avoid unnecessary Azure costs.

1. On the **Home** page of the Azure portal, select **Resource groups**.
1. Select the resource group for your Azure Operator Insights Data Product (not the managed resource group), and verify that it contains the Azure Operator Insights Data Product instance.
1. At the top of the Overview page for your resource group, select **Delete resource group**.
1. Enter the resource group name to confirm the deletion, and select **Delete**.
