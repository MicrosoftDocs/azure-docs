---
title: Configure customer-managed-keys using C#
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer.
author: saguiitay
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 01/06/2020
---

# Configure customer-managed-keys using C#

> [!div class="op_single_selector"]
> * [C#](create-cluster-database-csharp.md)
> * [ARM template](create-cluster-database-resource-manager.md)

Azure Data Explorer encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys to use for encryption of data.

Customer-managed keys must be stored in an Azure Key Vault. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The Azure Data Explorer cluster and the key vault must be in the same region, but they can be in different subscriptions. 

This article shows how to configure an Azure Key Vault with customer-managed keys using Azure Data Explorer C# client.

> [!Important]
> Using customer-managed keys with Azure Data Explorer requires that two properties be set on the key vault, **Soft Delete** and **Do Not Purge**. These properties are not enabled by default. To enable these properties, use either PowerShell or Azure CLI. Only RSA keys and key size 2048 are supported.

## Assign an identity to the cluster

To enable customer-managed keys for your cluster, first assign a system-assigned managed identity to the cluster. You'll use this managed identity to grant the cluster permissions to access the key vault.

For information about configuring system-assigned managed identities see [Managed Identities](managed-identities.md).

## Create a new key vault

To create a new key vault using PowerShell, call [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault.md). The key vault that you use to store customer-managed keys for Azure Data Explorer encryption must have two key protection settings enabled, **Soft Delete** and **Do Not Purge**.

Remember to replace the placeholder values in brackets with your own values.

```azurepowershell-interactive
$keyVault = New-AzKeyVault -Name <key-vault> `
    -ResourceGroupName <resource_group> `
    -Location <location> `
    -EnableSoftDelete `
    -EnablePurgeProtection
```

## Configure the key vault access policy

Next, configure the access policy for the key vault so that the cluster has permissions to access it. In this step, you'll use the managed identity that you previously assigned to the cluster.

To set the access policy for the key vault, call [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy.md). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy `
    -VaultName $keyVault.VaultName `
    -ObjectId $cluster.Identity.PrincipalId `
    -PermissionsToKeys wrapkey,unwrapkey,get,recover
```

## Create a new key

Next, create a new key in the key vault. To create a new key, call [Add-AzKeyVaultKey](/powershell/module/az.keyvault/add-azkeyvaultkey.md). Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples.

```azurepowershell-interactive
$key = Add-AzKeyVaultKey -VaultName $keyVault.VaultName -Name <key> -Destination 'Software'
```

## Configure encryption with customer-managed keys

### Prerequisites

* If you don't have Visual Studio 2019 installed, you can download and use the **free** [Visual Studio 2019 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

### Install C# Nuget

* Install the [Azure Data Explorer (Kusto) nuget package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).

* Install the [Microsoft.IdentityModel.Clients.ActiveDirectory nuget package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.

### Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](https://docs.microsoft.com/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

### Configure cluster

By default, Azure Data Explorer encryption uses Microsoft-managed keys. In this step, configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

1. Update your cluster by using the following code:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "xxxxxxxxxxxxxx";//Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
    var credential = new ClientCredential(clientId, clientSecret);
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };

    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var keyName = "myKey";
    var keyVersion = "5b52b20e8d8a42e6bd7527211ae32654";
    var keyVaultUri = "https://mykeyvault.vault.azure.net/";
    var keyVaultProperties = new KeyVaultProperties (keyName, keyVersion, keyVaultUri);
    var clusterUpdate = new ClusterUpdate(keyVaultProperties: keyVaultProperties);
    await kustoManagementClient.Clusters.UpdateAsync(resourceGroupName, clusterName, clusterUpdate);
    ```

1. Run the following command to check whether your cluster was successfully updated:

    ```csharp
    kustoManagementClient.Clusters.Get(resourceGroupName, clusterName);
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then the cluster was successfully updated.

## Update the key version

When you create a new version of a key, you'll need to update the cluster to use the new version. First, call Get-AzKeyVaultKey to get the latest version of the key. Then update the cluster's key vault properties  to use the new version of the key, as shown in the previous section.

## Common customer-managed keys errors

This section lists the common error messages you may encounter when enabling customer-managed keys:

| Error Code                                       |  Error Message
|--------------------------------------------------|-----------------
| InvalidKeyVaultProperties                        | The provided KeyVaultProperties are invalid.
| CannotProvideKeyVaultPropertiesDuringCreation    | Cannot provide KeyVaultProperties during cluster creation.
| KeyVaultPropertiesOnlyForSystemAssignedResources | KeyVaultProperties can be provided only for resources with SystemAssigned Identity.
| KeyVaultNotFound                                 |  KeyVault '_\<KeyVaultUrl\>_' was not found
| KeyNotFound                                      |  Key '_\<KeyName\>_' was not found in KeyVault '_\<KeyVaultUrl\>_'
| IdentityDoesNotHaveAccessToKeyVault              |  Cluster identity does not have access to KeyVault '_\<KeyVaultUrl\>_'
| KeyVaultNotPurgeProtected                        |  KeyVault '_\<KeyVaultUrl\>_' is not Purge Protected
| KeyVaultNotSoftDeleteEnabled                     |  KeyVault '_\<KeyVaultUrl\>_' is not Soft-Delete enabled

## Next steps

 * [What is Azure Key Vault?](../key-vault/key-vault-overview.md)
 * [Manage cluster security](manage-cluster-security.md)

