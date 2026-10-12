---
title: Troubleshoot Storage Mount Failures in Azure Container Apps
description: Learn to troubleshoot storage mount failures in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 10/12/2026
ms.author: cshoe
ms.custom:
---

# Troubleshoot storage mount failures in Azure Container Apps

Azure Container Apps supports persistent storage by mounting Azure Files shares over SMB or NFS. These file shares are mounted as volumes in the container's file system during container startup. For supported storage types and configuration instructions, see [Use storage mounts in Azure Container Apps](storage-mounts.md).

Storage mount failures occur when your app's container is unable to successfully mount or access required storage resources, such as volumes or file systems.

## Causes

- **Incorrect configuration of storage mounts**: This error occurs when the environment's storage definition or the container's volume mount configuration is incorrect.

- **Authentication or authorization failures**: An SMB mount can fail because a storage account key is invalid or the managed identity authentication settings or permissions are missing.

- **Misconfigured storage protocol or mount type**: The mount fails if the storage type in the environment or container app doesn't match the file share protocol. Use `AzureFile` for SMB and `NfsAzureFile` for NFS.

- **Storage resource deletion or modification**: This error occurs when the storage account or Azure Files share is deleted or modified while the container app is running.

- **Network connectivity failures**: The mount fails if the Container Apps environment can't reach the storage account because of network or storage firewall rules.

## Diagnostics

Container Apps features an intelligent and interactive diagnostics experience that helps you troubleshoot your app with no configuration required. Use the following steps to access Container Apps diagnostics.

1. Go to your container app in the Azure portal.

1. Select **Diagnose and solve problems** in the sidebar menu.

1. Under the troubleshooting categories, select the **Availability and Performance** category tile.

1. Select **Storage Mount Failures** to diagnose and troubleshoot the issue.

    This report provides details on the issue, possible causes, and recommended resolutions.

    By selecting the required revision from the dropdown, you can view storage mount failure events in the last 24 hours, and the storage mount configuration per revision for your container app.

    Additionally, you can find the number of storage mount failures per revision for your container app, by selecting **Click to show**.

## Troubleshoot SMB managed identity authentication

For new SMB Azure Files mounts, we recommend [managed identity authentication (preview)](storage-mounts.md#azure-files). This mode uses a managed identity assigned to the **Container Apps environment**, not the individual container app. If a mount using this mode fails, check the following:

1. **Azure CLI extension**: Use the latest Azure CLI and install the Container Apps extension with preview features enabled:

    ```azurecli
    az extension add --name containerapp --upgrade --allow-preview true
    ```

1. **Environment identity**: Enable the environment's system-assigned identity or assign the selected user-assigned identity to the environment. Set `--azure-file-identity` to `system` for the system-assigned identity, or to the full resource ID of the user-assigned identity. Don't use its client ID or principal ID. Assigning an identity only to the container app doesn't configure it for the mount.

1. **Storage account settings**: [Enable Managed Identity for SMB (`SMBOAuth`)](../storage/files/files-managed-identities.md?tabs=cli&pivots=linux#configure-the-managed-identitys-access-property-on-your-storage-account) on the storage account. Its [SMB security settings](../storage/files/files-smb-protocol.md#smb-security-settings) must also allow Kerberos authentication. Enabling `SMBOAuth` doesn't enable this separate Kerberos setting.

1. **Azure RBAC permissions**: Assign the **Storage File Data SMB MI Admin** role to the selected environment identity at the **storage account scope**. Verify that the role assignment uses the principal ID of the identity selected in the environment's storage definition. Allow time for a new role assignment to propagate before retrying the mount. See [Assign a built-in RBAC role to the managed identity](../storage/files/files-managed-identities.md?tabs=portal&pivots=linux#assign-a-built-in-rbac-role-to-the-managed-identity).

1. **Authentication mode**: Don't combine `--azure-file-identity` with `--azure-file-account-key` or `--azure-file-key-vault-secret-url`. In an ARM storage definition, set `properties.azureFile.identity` and omit `accountKey` and `accountKeyVaultProperties`. For an example using a storage API version that supports managed identity authentication, see [Use storage mounts in Azure Container Apps](storage-mounts.md?pivots=azure-resource-manager#azure-files).

1. **Volume configuration**: Use `storageType: AzureFile` for the SMB volume, and ensure `storageName` matches the environment's storage definition name. Managed identity authentication doesn't change the app-level volume configuration. Don't use SMB authentication settings with `NfsAzureFile` storage.

1. **Network access**: Verify that the storage account is reachable from the environment and that network rules allow SMB traffic on port 445. Managed identity authentication doesn't replace the storage account's network access requirements. See [Grant access from a virtual network](/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network).

After updating the extension, you can inspect the environment's identities and the identity selected for a storage definition without retrieving a storage account key:

```azurecli
az containerapp env identity show \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>

az containerapp env storage show \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --storage-name <STORAGE_NAME> \
  --query properties.azureFile.identity \
  --output tsv
```

Replace the placeholders with your environment, resource group, and storage definition names. The second command should return `system` or the full resource ID of a user-assigned identity assigned to the environment. An empty value means the storage definition isn't configured to use managed identity authentication for SMB.

For a complete setup example, see [Create an Azure Files volume mount in Azure Container Apps](storage-mounts-azure-files.md).
