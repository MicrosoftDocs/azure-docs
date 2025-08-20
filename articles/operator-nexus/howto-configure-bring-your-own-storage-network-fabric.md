---
title: "Azure Operator Nexus: Configure Bring-Your-Own (BYO) Storage for Network Fabric"
description: Learn how to configure a customer-managed storage account and user-assigned managed identity (UAMI) for Network Fabric in Azure Operator Nexus.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/26/2025
ms.custom: template-how-to, devx-track-azurecli
---

# How to configure NNF with Bring Your Own (BYO) Storage

This guide provides step-by-step instructions for configuring Network Fabric (NNF) with a customer-managed storage account and User-Assigned Managed Identities (UAMI). Follow the steps below to ensure proper setup and integration.

## Prerequisites

Before proceeding, ensure you have:

- Azure CLI Installed - Install or update the Azure CLI version  Version 2.69 or higher.

- CLI Extension: Install the `managednetworkfabric` extension, version 8.0.0 or higher.

- Necessary Permissions - Ensure you have Contributor or Owner role on the storage account and permissions to assign RBAC roles.

- User-Assigned Managed Identity (UAMI) - Created in the same subscription where NNF is deployed.

- Storage Account - Created with the appropriate permissions for NNF operations.

- NNF Resource Provider Registration - Ensure Microsoft.ManagedNetworkFabric is registered in your subscription.

## Step 1: Create user-assigned managed identity (UAMI)

Create the UAMI(s) required for accessing the necessary resources.

For more information on creating managed identities, refer to [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)

>[!Note]
> When creating a User-Assigned Managed Identity (UAMI) to be used with Network Fabric, ensure that the total length of the fabric name + UAMI name does not exceed 48 characters. This is due to an internal platform constraint on the naming length used during resource configuration.<br>
For example, if your fabric name is nf-westus-prod-01 (18 characters), the UAMI name should be 30 characters or fewer.


## Step 2: Configure the storage account

### 2.1 Create or identify a storage account

Create a new storage account or use an existing one. Refer to [Create an Azure storage account](../storage/common/storage-account-create.md).

### 2.2 Assign the required role

Assign the **Storage Blob Data Contributor** role to the users and UAMI needing access to the **runRO** and **cable validation command output**.

For role assignment details, see [Assign an Azure role for access to blob data](../storage/blobs/assign-azure-role-data-access.md).

### 2.3 Restrict storage account access (Optional)

To limit access, configure Storage Firewalls and Virtual Networks:

- Add all required users' IP addresses to the **Virtual Networks** and/or **Firewall** lists.

- Follow instructions from [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

### 2.4 Enable Trusted Services

Ensure the option **Allow Azure services on the trusted services list to access this storage account** under **Exceptions** is selected.

## Step3: Assign permissions to UAMI for Nexus Network Fabric Resource Provider

When using UAMI to access a storage account, the NNF platform requires provisioning access. Specifically, the permission **Microsoft.ManagedIdentity/userAssignedIdentities/assign/action** must be granted to the UAMI for the **Managed Network Fabric RP** in Microsoft Entra ID.

### 3.1 Assign the Managed Identity Operator Role

1. Open the **Azure Portal** and locate the **User-Assigned Identity**.

2. Navigate to **Access control (IAM)** > **Add role assignment**.

3. Select **Role: Managed Identity Operator**.

4. Under **Assign access to**, select **User, group, or service principal**.

5. Choose **Member: Managed Network Fabric RP** application.

6. Click **Review and assign**.

> [!Note]
> UAMI name length limitation no longer applies starting with Network Fabric release 8.2.<br> Previously, the combined length of the Network Fabric name and the User-Assigned Managed Identity (UAMI) name was limited to 48 characters. This restriction was removed in release 8.2. <br> However, in release 8.2, a known limitation affected fabrics that already had a UAMI assigned. Attempting to patch such fabrics with a new UAMI—regardless of its length—would result in an error. <br> This limitation has been removed in release 8.3, and fabrics can now be successfully patched with any UAMI, regardless of previous assignments or name length.

## Step 4: Update Network Fabric with UAMI and Storage Account configuration

When creating or updating an NNF instance, both the User-Assigned Managed Identity and Storage Account must be supplied together.

### 4.1 Storage account configuration format

Use the `--storage-account-configuration` parameter to define the storage location for command outputs:

```json
{
  "storageAccountId": "<storage_account_id>",
  "storageAccountIdentity": {
    "identityType": "UserAssignedIdentity",
    "userAssignedIdentityResourceId": "<uami_resource_id>"
  }
}
```

## Step 5: Attaching your own storage account Fabric instance

### 5.1 Attaching storage account during the creation of Fabric instance

Use the following command to create a new Fabric instance with BYO storage:

```azurecli
az networkfabric fabric create --resource-name <fabricname> \
    -g <fabricresourcegroup> \
    <other_params_for_create> \
    --storage-account-config "{storageAccountId:'/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupname>/providers/Microsoft.Storage/storageAccounts/<storageaccountname>',storageAccountIdentity:{identityType:'UserAssignedIdentity',userAssignedIdentityResourceId:'/subscriptions/<uamisubscription>/resourceGroups/<uamiresourcegroupname>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<uaminame>'}}" \
    --mi-user-assigned "/subscriptions/<uamisubscriptionid>/resourceGroups/<uamiresourcegroupname>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<uaminame>"
```

### 5.2 Updating storage account to an existing Fabric instance

For existing deployments, update the Fabric with the required parameters:

```azurecli
az networkfabric fabric update --resource-name <fabricname> \
    -g <fabricresourcegroup> \
    --storage-account-config "{storageAccountId:'/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupname>/providers/Microsoft.Storage/storageAccounts/<storageaccountname>',storageAccountIdentity:{identityType:'UserAssignedIdentity',userAssignedIdentityResourceId:'/subscriptions/<uamisubscription>/resourceGroups/<uamiresourcegroupname>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<uaminame>'}}" \
    --mi-user-assigned "/subscriptions/<uamisubscriptionid>/resourceGroups/<uamiresourcegroupname>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<uaminame>"
```

### Commit configuration changes

Once updated, commit the changes:

```azurecli
az networkfabric fabric commit-configuration --resource-group <rgname> --resource-name <nfname>
```

### 5.3 Updating UAMI assignments on an existing Fabric instance

To update the list of User-Assigned Managed Identities (UAMIs) on a Network Fabric resource, use the --mi-user-assigned flag with a dictionary syntax. This allows you to add or remove identities.

> [!NOTE]
> To remove a UAMI, it must be explicitly set to null. Omitting it from the dictionary will not remove it.

Example: Add one UAMI and remove another

```azurecli
az networkfabric fabric update \
  --resource-name "<nfname>" \
  --resource-group "<rg>" \
  --mi-user-assigned "{
    /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<new-uami>: {},
    /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<old-uami>: null
  }"
```

### Commit configuration changes

After making changes, ensure you run the following to apply configuration:

Lock fabric configuration

```Azure CLI
az networkfabric fabric lock-fabric \
    --action Lock \
    --lock-type Configuration \
    --network-fabric-name "example-fabric" \
    --resource-group "example-rg"
```

Commit configuration

```azurecli
az networkfabric fabric commit-configuration \
  --resource-group <rgname> \
  --resource-name <nfname>
```