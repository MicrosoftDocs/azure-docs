---
title: Change the key vault tenant ID after a subscription move - Azure Key Vault | Microsoft Docs
description: Learn how to switch the tenant ID for a key vault after a subscription is moved to a different tenant
services: key-vault
author: amitbapat
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/12/2019
ms.author: ambapat

---
# Change a key vault tenant ID after a subscription move

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]


When you create a new key vault in a subscription, it is automatically tied to the default Azure Active Directory tenant ID for that subscription. All access policy entries are also tied to this tenant ID. 

If you move your Azure subscription from tenant A to tenant B, your existing key vaults are inaccessible by the principals (users and applications) in tenant B. To fix this issue, you need to:

* Change the tenant ID associated with all existing key vaults in the subscription to tenant B.
* Remove all existing access policy entries.
* Add new access policy entries associated with tenant B.

For example, if you have key vault 'myvault' in a subscription that has been moved from tenant A to tenant B, you can use Azure PowerShell to to change the tenant ID and remove old access policies.

```azurepowershell
Select-AzSubscription -SubscriptionId <your-subscriptionId>                # Select your Azure Subscription
$vaultResourceId = (Get-AzKeyVault -VaultName myvault).ResourceId          # Get your key vault's Resource ID 
$vault = Get-AzResource –ResourceId $vaultResourceId -ExpandProperties     # Get the properties for your key vault
$vault.Properties.TenantId = (Get-AzContext).Tenant.TenantId               # Change the Tenant that your key vault resides in
$vault.Properties.AccessPolicies = @()                                     # Access policies can be updated with real
                                                                           # applications/users/rights so that it does not need to be                             # done after this whole activity. Here we are not setting 
                                                                           # any access policies. 
Set-AzResource -ResourceId $vaultResourceId -Properties $vault.Properties  # Modifies the key vault's properties.
````

Or you can use the Azure CLI.

```azurecli
az account set -s <your-subscriptionId>                                    # Select your Azure Subscription
$tenantId=$(az account show --query tenantId)                               # Get your tenantId
az keyvault update -n myvault --remove Properties.accessPolicies           # Remove the access policies
az keyvault update -n myvault --set Properties.tenantId=$tenantId          # Update the key vault tenantId
```

Now that your vault is associated with the correct tenant ID and old access policy entries are removed, set new access policy entries with the Azure PowerShell [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/Set-azKeyVaultAccessPolicy) cmdlet or the Azure CLI [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command.

If you are using a managed identity for Azure resources, you will need to update it to the new Azure AD tenant as well. For more information on managed identities, see [Provide Key Vault authentication with a managed identity](managed-identity.md).


If you are using MSI, you'll also have to update the MSI identity since the old identity will no longer be in the correct AAD tenant.

## Next steps

If you have questions about Azure Key Vault, visit the [Microsoft Q&A question page for Azure Key Vault](https://docs.microsoft.com/answers/topics/azure-key-vault.html).
