---
title: 'Common Key Vault errors in Application Gateway'
titleSuffix: Azure Application Gateway
description: This article helps identifying Key Vault-related issues and resolve them for smooth operations of Application Gateway.
services: application-gateway
author: jaesoni
ms.service: application-gateway
ms.topic: reference
ms.date: 07/12/2021
ms.author: jaysoni

---

# Common Key Vault errors in Application Gateway

This troubleshooting guide will help you to understand the details of the Key Vault error codes, their cause and the associated Key Vault resource which is causing the problem. It also includes step by step guide for the resolution of such misconfigurations.

> [!NOTE]
> The logs for Key Vault Diagnostics in Application Gateway are generated at every four-hour interval. Therefore, in some cases, you may have to wait for the logs to be refreshed, if the diagnostic continues to show the error after you have fixed the configuration.

> [!TIP]
> We recommend using a version-less Secret Identifier. This way, Application Gateway will automatically rotate the certificate, if a newer version is available in the Key Vault.  An example of Secret URI without version `https://myvault.vault.azure.net/secrets/mysecret/`.

### List of error codes and their details

[comment]: # (Error Code 1)
#### **1) Error Code:** UserAssignedIdentityDoesNotHaveGetPermissionOnKeyVault 

**Description:** The associated User-Assigned Managed Identity doesn't have GET permission. 

**Resolution:** Configure Key Vault's Access Policy to grant the associated User-Assigned Managed Identity GET permissions on Secrets. 
1. Navigate to the linked Key Vault in Azure portal
2. Open the Access Policies blade
3. Select "Vault Access policy" for Permission model
4. Select "Get" permission for Secret for the given User-Assigned Managed Identity
5. Save the configuration


:::image type="content" source="./media/application-gateway-key-vault-common-errors/no-get-permssion-for-managed-identity.png " alt-text=" User-Assigned Identity does not have Get permission on Key Vault.":::

For complete guide on Key Vault's Access policy, refer to this [article](../key-vault/general/assign-access-policy-portal.md)
</br></br>



[comment]: # (Error Code 2)
#### **2) Error Code:** SecretDisabled 

**Description:** The associated Certificate has been disabled in Key Vault. 

**Resolution:** Re-enable the certificate version that is currently in use for Application Gateway.
1. Navigate to the linked Key Vault in Azure portal
2. Open the Certificates blade
3. Click on the required certificate name, and then the disabled version
4. Use the toggle on the management page to enable that certificate version

:::image type="content" source="./media/application-gateway-key-vault-common-errors/secret-disabled.png" alt-text="Re-enable a Secret.":::
</br></br>


[comment]: # (Error Code 3)
#### **3) Error Code:** SecretDeletedFromKeyVault 

**Description:** The associated Certificate has been deleted from Key Vault. 

**Resolution:** The deleted certificate object within a Key Vault can be restored using its Soft-Delete recovery feature. To recovery a deleted certificate, 
1. Navigate to the linked Key Vault in Azure portal
2. Open the Certificates blade
3. Use "Managed Deleted Certificates" tab to recover a deleted certificate.

On the other hand, if a certificate object is permanently deleted, you will need to create a new certificate and update the Application Gateway with the new certificate details. When configuring through Azure CLI or Azure PowerShell, it is recommended to use a version-less secret identifier URI to allow instances to retrieve a renewed version of the certificate, if it exists.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/secret-deleted.png " alt-text="Recover a deleted certificate in Key Vault.":::
</br></br>


[comment]: # (Error Code 4)
#### **4) Error Code:** UserAssignedManagedIdentityNotFound 

**Description:** The associated User-Assigned Managed Identity has been deleted. 

**Resolution:** Follow the guidance below to resolve this issue.
1. Re-create a Managed Identity with the same name that was used earlier and under the same Resource Group. You can refer to resource Activity Logs for details. 
2. Once created, assign that new Managed Identity the Reader role, at a minimum, under Application Gateway - Access Control (IAM).
3. Finally, navigate to the desired Key Vault resource and set its Access Policies to grant GET Secret Permissions for this new Managed Identity. 

[More information](./key-vault-certs.md#how-integration-works)
</br></br>

[comment]: # (Error Code 5)
#### **5) Error Code:** KeyVaultHasRestrictedAccess

**Description:** Restricted Network setting for Key Vault. 

**Resolution:** You will encounter this issue upon enabling Key Vault Firewall for restricted access. You can still configure your Application Gateway in a restricted network of Key Vault in the following manner.
1. Under Key Vault’s Networking blade
2. Choose Private endpoint and selected networks in "Firewall and Virtual Networks" tab
3. Finally, select “Yes” to allow Trusted Services to bypass Key Vault’s firewall.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/key-vault-restricted-access.png" alt-text="Key Vault Has Restricted Access.":::
</br></br>


[comment]: # (Error Code 6)
#### **6) Error Code:** KeyVaultSoftDeleted 

**Description:** The associated Key Vault is in soft-delete state. 

**Resolution:** Recovering a soft-deleted Key Vault is quite easy. In Azure portal, go to Key Vaults service page.

:::image type="content" source="./media/application-gateway-key-vault-common-errors/key-vault-soft-deleted-1.png" alt-text="Search for Key Vault service.":::
</br></br>
Click on Managed Deleted Vaults tab. From here, you can find the deleted Key Vault resource and recover it.
:::image type="content" source="./media/application-gateway-key-vault-common-errors/key-vault-soft-deleted-2.png" alt-text="Recover a deleted Key Vault using Soft Delete.":::
</br></br>


[comment]: # (Error Code 7)
#### **7) Error Code:** CustomerKeyVaultSubscriptionDisabled 

**Description:** The Subscription for Key Vault is disabled. 

**Resolution:** Your Azure subscription can get disabled due to various reasons. Please refer to the guide for [Reactivating a disabled Azure subscription](../cost-management-billing/manage/subscription-disabled.md) and take the necessary action.
</br></br>



