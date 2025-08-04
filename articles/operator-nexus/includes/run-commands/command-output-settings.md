---
author: eak13
ms.author: ekarandjeff
ms.date: 07/09/2025
ms.topic: include
ms.service: azure-operator-nexus
---

## Send command output to a user specified storage account

See [Azure Operator Nexus Cluster support for managed identities and user provided resources](../../howto-cluster-managed-identity-user-provided-resources.md)

To access the output, users need the appropriate access to the storage blob. For information on assigning roles to storage accounts, see [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal).

### Clear the cluster's CommandOutputSettings

To change the cluster from a user-assigned identity to a system-assigned identity, the CommandOutputSettings must first be cleared using the command in the next section, then set using this command.

The CommandOutputSettings can be cleared, directing command output back to the cluster manager's storage. However, it isn't recommended since it's less secure, and the option will be removed in a future release.

However, the CommandOutputSettings do need to be cleared if switching from a user-assigned identity to a system-assigned identity.

Use this command to clear the CommandOutputSettings:

```azurecli-interactive
az rest --method patch \
  --url  "https://management.azure.com/subscriptions/<subscription>/resourceGroups/<cluster-resource-group>/providers/Microsoft.NetworkCloud/clusters/<cluster-name>?api-version=2024-08-01-preview" \
  --body '{"properties": {"commandOutputSettings":null}}'
```

## DEPRECATED METHOD: Verify access to the Cluster Manager storage account

> [!IMPORTANT]
> The Cluster Manager storage account is targeted for removal in April 2025 at the latest. If you're using this method today for command output, consider converting to using a user provided storage account.

If using the Cluster Manager storage method, verify you have access to the Cluster Manager's storage account:

1. From Azure portal, navigate to Cluster Manager's Storage account.
1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.
1. In the Storage browser details, select on **Blob containers**.
1. If you encounter a `403 This request is not authorized to perform this operation.` while accessing the storage account, storage account’s firewall settings need to be updated to include the public IP address.
1. Request access by creating a support ticket via Portal on the Cluster Manager resource. Provide the public IP address that requires access.
