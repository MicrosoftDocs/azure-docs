---
title: Common key vault errors in Application Gateway
titleSuffix: Azure Application Gateway
description: This article identifies key vault-related problems, and helps you resolve them for smooth operations of Application Gateway.
author: greg-lindsay
ms.service: application-gateway
ms.topic: reference
ms.date: 07/26/2022
ms.author: greglin

---

# Common key vault errors in Azure Application Gateway

Application Gateway enables customers to securely store TLS certificates in Azure Key Vault. When using a key vault resource, it's important that the gateway always has access to the linked key vault. If your Application Gateway is unable to fetch the certificate, the associated HTTPS listeners will be placed in a disabled state. [Learn more](../application-gateway/disabled-listeners.md).

This article helps you understand the details of the error codes and the steps to resolve such key vault misconfigurations.

> [!TIP]
> Use a secret identifier that doesn't specify a version. This way, Azure Application Gateway will automatically rotate the certificate, if a newer version is available in Azure Key Vault. An example of a secret URI without a version is: `https://myvault.vault.azure.net/secrets/mysecret/`.

## Azure Advisor error codes

The following sections describe the various errors you might encounter. You can verify if your gateway has any such problem by visiting [**Azure Advisor**](./key-vault-certs.md#investigating-and-resolving-key-vault-errors) for your account, and use this troubleshooting article to fix the problem. We recommend configuring Azure Advisor alerts to stay informed when a key vault problem is detected for your gateway.

> [!NOTE]
> Azure Application Gateway generates logs for key vault diagnostics every four hours. If the diagnostic continues to show the error after you have fixed the configuration, you might have to wait for the logs to be refreshed.

[comment]: # (Error Code 1)
### Error code: UserAssignedIdentityDoesNotHaveGetPermissionOnKeyVault 

**Description:** The associated user-assigned managed identity doesn't have the required permission. 

**Resolution:** Configure the access policies of your key vault to grant the user-assigned managed identity permission on secrets. You may do so in any of the following ways:

  **Vault access policy**
  1. Go to the linked key vault in the Azure portal.
  1. Open the **Access policies** blade.
  1. For **Permission model**, select **Vault access policy**.
  1. Under **Secret Management Operations**, select the **Get** permission.
  1. Select **Save**.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/no-get-permission-for-managed-identity.png" alt-text=" Screenshot that shows how to resolve the Get permission error.":::

For more information, see [Assign a Key Vault access policy by using the Azure portal](../key-vault/general/assign-access-policy-portal.md).

  **Azure role-based access control**
  1. Go to the linked key vault in the Azure portal.
  1. Open the **Access policies** blade.
  1. For **Permission model**, select **Azure role-based access control**.
  1. Navigate to **Access Control (IAM)** blade to configure permissions.
  1. **Add role assignment** for your managed identity by choosing the following<br>
    a. **Role**: Key Vault Secrets User<br>
    b. **Assign access to**: Managed identity<br>
    c. **Members**: select the user-assigned managed identity that you've associated with your application gateway.<br>
  1. Select **Review + assign**.

For more information, see [Azure role-based access control in Key Vault](../key-vault/general/rbac-guide.md).

> [!NOTE]
> Portal support for adding a new key vault-based certificate is currently not available when using **Azure role-based access control**. You can accomplish it by using ARM template, CLI, or PowerShell. Visit [this page](./key-vault-certs.md#key-vault-azure-role-based-access-control-permission-model) for guidance.

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

On the other hand, if a certificate object is permanently deleted, you'll need to create a new certificate and update Application Gateway with the new certificate details. When you're configuring through the Azure CLI or Azure PowerShell, use a secret identifier URI without a version. This choice allows instances to retrieve a renewed version of the certificate, if it exists.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/secret-deleted.png" alt-text="Screenshot that shows how to recover a deleted certificate in Key Vault.":::

[comment]: # (Error Code 4)
### Error code: UserAssignedManagedIdentityNotFound 

**Description:** The associated user-assigned managed identity has been deleted. 

**Resolution:** Create a new managed identity and use it with the key vault.
1. Re-create a managed identity with the same name that was previously used, and under the same resource group. (**TIP**: Refer to resource Activity Logs for naming details). 
1. Go to the desired key vault resource, and set its access policies to grant this new managed identity the required permission. You can follow the same steps as mentioned under [UserAssignedIdentityDoesNotHaveGetPermissionOnKeyVault](./application-gateway-key-vault-common-errors.md#error-code-userassignedidentitydoesnothavegetpermissiononkeyvault). 

[comment]: # (Error Code 5)
### Error code: KeyVaultHasRestrictedAccess

**Description:** There's a restricted network setting for Key Vault. 

**Resolution:** You'll encounter this error when you enable the Key Vault firewall for restricted access. You can still configure Application Gateway in a restricted network of Key Vault, by following these steps:
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

## Application Gateway Error Codes
### Error code: ApplicationGatewayCertificateDataOrKeyVaultSecretIdMustBeSpecified / ApplicationGatewaySslCertificateDataMustBeSpecified  

**Description:** You may encounter this error when trying to update a listener certificate. When this error occurs, the change to update the certificate will be discarded, and the listener will continue to handle traffic with the previously defined configuration.

**Resolution:** To resolve this issue, please try uploading the certificate again.  For example, the following PowerShell commands may be used to update certificates uploaded to Application Gateway or referenced via Azure Key Vault.

Update certificate uploaded directly to Application Gateway:
```
$appgw = Get-AzApplicationGateway -ResourceGroupName "<ResourceGroup>" -Name "<AppGatewayName>"

$password = ConvertTo-SecureString -String "<password>" -Force -AsPlainText

Set-AzApplicationGatewaySSLCertificate -Name "<oldcertname>" -ApplicationGateway $appgw -CertificateFile "<newcertPath>" -Password $password

Set-AzApplicationGateway -ApplicationGateway $appgw 
```

Update certificate referenced from Azure Key Vault: 
```
$appgw = Get-AzApplicationGateway -ResourceGroupName "<ResourceGroup>" -Name "<AppGatewayName>"

$secret = Get-AzKeyVaultSecret -VaultName "<KeyVaultName>" -Name "<CertificateName>" 
$secretId = $secret.Id.Replace($secret.Version, "") 
$cert = Set-AzApplicationGatewaySslCertificate -ApplicationGateway $AppGW -Name "<CertificateName>" -KeyVaultSecretId $secretId 

Set-AzApplicationGateway -ApplicationGateway $appgw 
```

## Next steps

These troubleshooting articles might be helpful as you continue to use Application Gateway:

- [Understanding and fixing disabled listeners](disabled-listeners.md)
- [Azure Application Gateway Resource Health overview](resource-health-overview.md)

