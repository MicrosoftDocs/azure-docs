---
title: Common key vault errors in Application Gateway
titleSuffix: Azure Application Gateway
description: This article identifies key vault-related problems, and helps you resolve them for smooth operations of Application Gateway.
author: jaesoni
ms.service: application-gateway
ms.topic: reference
ms.date: 07/12/2021
ms.author: jaysoni

---

# Common key vault errors in Azure Application Gateway

Application Gateway enables customers to securely store TLS certificates in Azure Key Vault. When using a Key Vault resource, it is important that the gateway always has access to the linked key vault. If your Application Gateway is unable to fetch the certificate, the associated HTTPS listeners will be placed in a disabled state. [Learn more](../application-gateway/disabled-listeners.md).

This article helps you understand the details of key vault error codes you might encounter, including what is causing these errors. This article also contains steps to resolve such misconfigurations.

> [!TIP]
> Use a secret identifier that doesn't specify a version. This way, Azure Application Gateway will automatically rotate the certificate, if a newer version is available in Azure Key Vault. An example of a secret URI without a version is: `https://myvault.vault.azure.net/secrets/mysecret/`.

## List of error codes and their details

The following sections cover various errors you might encounter. You can find the details in Azure Advisor, and use this troubleshooting article to fix the problems. For more information, see [Create Azure Advisor alerts on new recommendations by using the Azure portal](../advisor/advisor-alerts-portal.md).

> [!NOTE]
> Azure Application Gateway generates logs for key vault diagnostics every four hours. If the diagnostic continues to show the error after you have fixed the configuration, you might have to wait for the logs to be refreshed.

[comment]: # (Error Code 1)
### Error code: UserAssignedIdentityDoesNotHaveGetPermissionOnKeyVault 

**Description:** The associated user-assigned managed identity doesn't have the "Get" permission. 

**Resolution:** Configure the access policy of Key Vault to grant the user-assigned managed identity this permission on secrets. 
1. Go to the linked key vault in the Azure portal.
1. Open the **Access policies** pane.
1. For **Permission model**, select **Vault access policy**.
1. Under **Secret Management Operations**, select the **Get** permission.
1. Select **Save**.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/no-get-permssion-for-managed-identity.png " alt-text=" Screenshot that shows how to resolve the Get permission error.":::

For more information, see [Assign a Key Vault access policy by using the Azure portal](../key-vault/general/assign-access-policy-portal.md).

[comment]: # (Error Code 2)
### Error code: SecretDisabled 

**Description:** The associated certificate has been disabled in Key Vault. 

**Resolution:** Re-enable the certificate version that is currently in use for Application Gateway.
1. Go to the linked key vault in the Azure portal.
1. Open the **Certificates** pane.
1. Select the required certificate name, and then select the disabled version.
1. On the management page, use the toggle to enable that certificate version.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/secret-disabled.png" alt-text="Screenshot that shows how to re-enable a secret.":::

[comment]: # (Error Code 3)
### Error code: SecretDeletedFromKeyVault 

**Description:** The associated certificate has been deleted from Key Vault. 

**Resolution:** To recover a deleted certificate: 
1. Go to the linked key vault in the Azure portal.
1. Open the **Certificates** pane.
1. Use the **Managed deleted certificates** tab to recover a deleted certificate.

On the other hand, if a certificate object is permanently deleted, you will need to create a new certificate and update Application Gateway with the new certificate details. When you're configuring through the Azure CLI or Azure PowerShell, use a secret identifier URI without a version. This choice allows instances to retrieve a renewed version of the certificate, if it exists.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/secret-deleted.png " alt-text="Screenshot that shows how to recover a deleted certificate in Key Vault.":::

[comment]: # (Error Code 4)
### Error code: UserAssignedManagedIdentityNotFound 

**Description:** The associated user-assigned managed identity has been deleted. 

**Resolution:** To use the identity again:
1. Re-create a managed identity with the same name that was used previously, and under the same resource group. Resource activity logs contain more details. 
1. After you create the identity, go to **Application Gateway - Access Control (IAM)**. Assign the identity the **Reader** role, at a minimum.
1. Finally, go to the desired Key Vault resource, and set its access policies to grant **Get** secret permissions for this new managed identity. 

For more information, see [How integration works](./key-vault-certs.md#how-integration-works).

[comment]: # (Error Code 5)
### Error code: KeyVaultHasRestrictedAccess

**Description:** There's a restricted network setting for Key Vault. 

**Resolution:** You will encounter this error when you enable the Key Vault firewall for restricted access. You can still configure Application Gateway in a restricted network of Key Vault, by following these steps:
1. In Key Vault, open the **Networking** pane.
1. Select the **Firewalls and virtual networks** tab, and select **Private endpoint and selected networks**.
1. Then, using Virtual Networks, add your Application Gateway's virtual network and subnet. During the process, also configure 'Microsoft.KeyVault' service endpoint by selecting its checkbox.
1. Finally, select **Yes** to allow Trusted Services to bypass Key Vault's firewall.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/key-vault-restricted-access.png" alt-text="Screenshot that shows how to work around the restricted network error.":::

[comment]: # (Error Code 6)
### Error code: KeyVaultSoftDeleted 

**Description:** The associated key vault is in soft-delete state. 

**Resolution:** In the Azure portal, search for *key vault*. Under **Services**, select **Key vaults**.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/key-vault-soft-deleted-1.png" alt-text="Screenshot that shows how to search for the Key Vault service.":::

Select **Managed deleted vaults**. From here, you can find the deleted Key Vault resource and recover it.
:::image type="content" source="./media/application-gateway-key-vault-common-errors/key-vault-soft-deleted-2.png" alt-text="Screenshot that shows how to recover a deleted key vault.":::

[comment]: # (Error Code 7)
### Error code: CustomerKeyVaultSubscriptionDisabled 

**Description:** The subscription for Key Vault is disabled. 

**Resolution:** Your Azure subscription can get disabled for various reasons. To take the necessary action to resolve, see [Reactivating a disabled Azure subscription](../cost-management-billing/manage/subscription-disabled.md).

## Next steps

These troubleshooting articles might be helpful as you continue to use Application Gateway:

- [Azure Application Gateway Resource Health overview](resource-health-overview.md)
- [Troubleshoot Azure Application Gateway session affinity issues](how-to-troubleshoot-application-gateway-session-affinity-issues.md)
