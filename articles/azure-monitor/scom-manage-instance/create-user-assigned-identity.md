---
ms.assetid: 
title: Create a user-assigned identity for SCOM Managed Instance
description: This article describes how to create a user-assigned identity, provide admin access to Azure SQL Managed Instance, and grant get and list access on a key vault.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Create a user-assigned identity for Azure Monitor SCOM Managed Instance

This article describes how to create a user-assigned identity, provide admin access to Azure SQL Managed Instance, and grant **Get** and **List** access on a key vault.

>[!NOTE]
> To learn about the Azure Monitor SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

## Create a managed service identity

The managed service identity (MSI) provides an identity for applications to use when they're connecting to resources that support Microsoft Entra ID authentication. For SCOM Managed Instance, a managed identity replaces the traditional four System Center Operations Manager service accounts. It's used to access the Azure SQL Managed Instance database. It's also used to access the key vault.

> [!NOTE]
> - Ensure that you're a contributor in the subscription where you create the MSI.
> - The MSI must have admin permission on SQL Managed Instance and read permission on the key vault that you use to store the domain account credentials.

1. Sign in to the [Azure portal](https://portal.azure.com). Search for and select **Managed Identities**.

   :::image type="Managed Identity in Azure portal" source="media/create-user-assigned-identity/azure-portal-managed-identity.png" alt-text="Screenshot that shows the icon for managed identities in the Azure portal.":::
1. On the **Managed Identities** page, select **Create**.

   :::image type="Managed Identity" source="media/create-user-assigned-identity/managed-identities.png" alt-text="Screenshot that shows Managed Identity.":::

   The **Create User Assigned Managed Identity** pane opens.
1. Under **Basics**, do the following:
    - **Project details**:
        - **Subscription**: Select the Azure subscription in which you want to create the SCOM Managed Instance.
        - **Resource group**: Select the resource group in which you want to create the SCOM Managed Instance.
    - **Instance details**:
        - **Region**: Select the region in which you want to create the SCOM Managed Instance.
        - **Name**: Enter a name for the instance.

    :::image type="Create user assigned managed identity" source="media/create-user-assigned-identity/create-user-assigned-managed-identity.png" alt-text="Screenshot that shows project and instance details for a user-assigned managed identity.":::
1. Select **Next: Tags**.
1. On the **Tags** tab, enter the **Name** value and select the resource.

   Tags help you categorize resources and view consolidated billing by applying the same tags to multiple resources and resource groups. For more information, see [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources?wt.mc_id=azuremachinelearning_inproduct_portal_utilities-tags-tab&tabs=json).
1. Select **Next: Review + create**.
1. On the **Review + create** tab, review all the information that you provided and select **Create**.

   :::image type="Managed identity review" source="media/create-user-assigned-identity/managed-identity-review.png" alt-text="Screenshot that shows the tab for reviewing a managed identity before creation.":::

Your deployment is now created on Azure. You can access the resource and view its details.

### Set the Microsoft Entra admin value in the SQL managed instance

To set the Microsoft Entra admin value in the SQL managed instance that you created in [step 3](create-sql-managed-instance.md), follow these steps:

>[!NOTE]
>You must have Global Administrator or Privileged Role Administrator permissions for the subscription to perform the following operations.

>[!Important]
>Using Groups as Microsoft Entra admin is currently not supported.

1. Open the SQL managed instance. Under **Settings**, select **Microsoft Entra admin**.

   :::image type="Microsoft Entra admin" source="media/create-user-assigned-identity/microsoft-entra-admin.png" alt-text="Screenshot of the pane for Microsoft Entra admin information.":::

1. Select the error-box message to provide **Read** permissions to the SQL managed instance on Microsoft Entra ID. **Grant permissions** pane opens to grant the permissions.

   :::image type="Grant permissions" source="media/create-user-assigned-identity/grant-permissions.png" alt-text="Screenshot of grant permissions.":::

1. Select **Grant Permissions** to initiate the operation and once it is completed, you can find a notification for successfully updating the Microsoft Entra read permissions.

   :::image type="read permissions" source="media/create-user-assigned-identity/read-permissions.png" alt-text="Screenshot of read permissions.":::

1. Select **Set admin**, and search for your MSI. This MSI is the same one that you provided during the SCOM Managed Instance creation flow. You find the admin added to the SQL managed instance.

   :::image type="Microsoft Entra admin" source="media/create-user-assigned-identity/microsoft-entra-inline.png" alt-text="Screenshot of MSI information for Microsoft Entra." lightbox="media/create-user-assigned-identity/microsoft-entra-expanded.png":::

1. If you get an error after you add a managed identity account, it indicates that read permissions aren't yet provided to your identity. Be sure to provide the necessary permissions before you create your SCOM Managed Instance or else your SCOM Managed Instance creation fails.

   :::image type="SQL Microsoft Entra admin" source="media/create-user-assigned-identity/sql-microsoft-entra-inline.png" alt-text="Screenshot that shows successful  Microsoft Entra authentication." lightbox="media/create-user-assigned-identity/sql-microsoft-entra-expanded.png":::

For more information about permissions, see [Directory Readers role in Microsoft Entra ID for Azure SQL](/azure/azure-sql/database/authentication-aad-directory-readers-role?view=azuresql&preserve-view=true).

## Grant permission on the key vault

To grant permission on the key vault that you created in [step 4](create-key-vault.md), follow these steps:

1. Go to the key vault resource that you created in [step 4](create-key-vault.md) and select **Access policies**.

1. On the **Access policies** page, select **Create**.

    :::image type="Access Policies" source="media/create-user-assigned-identity/access-policies.png" alt-text="Screenshot that shows the Access policies page.":::

1. On the **Permissions** tab, select the **Get** and **List** options.

    :::image type="Create Access policy" source="media/create-user-assigned-identity/create-access-policy.png" alt-text="Screenshot that shows the Create access policy page.":::

1. Select **Next**.

1. On the **Principal** tab, enter the name of the MSI you created.

1. Select **Next**. Select the same MSI that you used in the SQL Managed Instance admin configuration.

    :::image type="Principal tab" source="media/create-user-assigned-identity/principal.png" alt-text="Screenshot that shows the Principal tab.":::

1. Select **Next** > **Create**.

## Next steps

- [Create a gMSA account](create-group-managed-service-account.md)