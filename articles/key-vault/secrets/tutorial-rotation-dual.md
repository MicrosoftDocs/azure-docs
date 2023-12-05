---
title: Rotation tutorial for resources with two sets of credentials
description: Use this tutorial to learn how to automate the rotation of a secret for resources that use two sets of authentication credentials.
services: key-vault
author: msmbaldwin
tags: 'rotation'
ms.service: key-vault
ms.subservice: secrets
ms.topic: tutorial
ms.date: 01/20/2023
ms.author: mbaldwin
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2022
---
# Automate the rotation of a secret for resources that have two sets of authentication credentials

The best way to authenticate to Azure services is by using a [managed identity](../general/authentication.md), but there are some scenarios where that isn't an option. In those cases, access keys or passwords are used. You should rotate access keys and passwords frequently.

This tutorial shows how to automate the periodic rotation of secrets for databases and services that use two sets of authentication credentials. Specifically, this tutorial shows how to rotate Azure Storage account keys stored in Azure Key Vault as secrets. You'll use a function triggered by Azure Event Grid notification. 

> [!NOTE]
> For Storage account services, using Microsoft Entra ID to authorize requests is recommended. For more information, see [Authorize access to blobs using Microsoft Entra ID](../../storage/blobs/authorize-access-azure-active-directory.md). There are services that require storage account connection strings with access keys. For that scenario, we recommend this solution.

Here's the rotation solution described in this tutorial: 

![Diagram that shows the rotation solution.](../media/secrets/rotation-dual/rotation-diagram.png)

In this solution, Azure Key Vault stores storage account individual access keys as versions of the same secret, alternating between the primary and secondary key in subsequent versions. When one access key is stored in the latest version of the secret, the alternate key is regenerated and added to Key Vault as the new latest version of the secret. The solution provides the application's entire rotation cycle to refresh to the newest regenerated key. 

1. Thirty days before the expiration date of a secret, Key Vault publishes the near expiry event to Event Grid.
1. Event Grid checks the event subscriptions and uses HTTP POST to call the function app endpoint that's subscribed to the event.
1. The function app identifies the alternate key (not the latest one) and calls the storage account to regenerate it.
1. The function app adds the new regenerated key to Azure Key Vault as the new version of the secret.

## Prerequisites
* An Azure subscription. [Create one for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Azure [Cloud Shell](https://shell.azure.com/). This tutorial is using portal Cloud Shell with PowerShell env
* Azure Key Vault.
* Two Azure storage accounts.

> [!NOTE]
>  Rotation of shared storage account key revokes account level shared access signature (SAS) generated based on that key. After storage account key rotation, you must regenerate account-level SAS tokens to avoid disruptions to applications.

You can use this deployment link if you don't have an existing key vault and existing storage accounts:

[![Link that's labelled Deploy to Azure.](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FKeyVault-Rotation-StorageAccountKey-PowerShell%2Fmaster%2FARM-Templates%2FInitial-Setup%2Fazuredeploy.json)

1. Under **Resource group**, select **Create new**. Name the group **vault rotation** and then select **OK**.
1. Select **Review + create**.
1. Select **Create**.

    ![Screenshot that shows how to create a resource group.](../media/secrets/rotation-dual/dual-rotation-1.png)

You'll now have a key vault and two storage accounts. You can verify this setup in the Azure CLI or Azure PowerShell by running this command:
# [Azure CLI](#tab/azure-cli)
```azurecli
az resource list -o table -g vaultrotation
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzResource -Name 'vaultrotation*' | Format-Table
```
---

The result will look something like this output:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
vaultrotation-kv         vaultrotation      westus      Microsoft.KeyVault/vaults
vaultrotationstorage     vaultrotation      westus      Microsoft.Storage/storageAccounts
vaultrotationstorage2    vaultrotation      westus      Microsoft.Storage/storageAccounts
```

## Create and deploy the key rotation function

Next, you'll create a function app with a system-managed identity, in addition to other required components. You'll also deploy the rotation function for the storage account keys.

The function app rotation function requires the following components and configuration:
- An Azure App Service plan
- A storage account to manage function app triggers
- An access policy to access secrets in Key Vault
- The Storage Account Key Operator Service role assigned to the function app so it can access storage account access keys
- A key rotation function with an event trigger and an HTTP trigger (on-demand rotation)
- An Event Grid event subscription for the **SecretNearExpiry** event

1. Select the Azure template deployment link:

   [![Azure template deployment link.](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FKeyVault-Rotation-StorageAccountKey-PowerShell%2Fmaster%2FARM-Templates%2FFunction%2Fazuredeploy.json)

1. In the **Resource group** list, select **vaultrotation**.
1. In the **Storage Account RG** box, enter the name of the resource group in which your storage account is located. Keep the default value **[resourceGroup().name]** if your storage account is already located in the same resource group where you'll deploy the key rotation function.
1. In the **Storage Account Name** box, enter the name of the storage account that contains the access keys to rotate. Keep the default value **[concat(resourceGroup().name, 'storage')]** if you use storage account created in [Prerequisites](#prerequisites).
1. In the **Key Vault RG** box, enter the name of resource group in which your key vault is located. Keep the default value **[resourceGroup().name]** if your key vault already exists in the same resource group where you'll deploy the key rotation function.
1. In the **Key Vault Name** box, enter the name of the key vault. Keep the default value **[concat(resourceGroup().name, '-kv')]** if you use key vault created in [Prerequisites](#prerequisites).
1. In the **App Service Plan Type** box, select hosting plan. **Premium Plan** is needed only when your key vault is behind firewall.
1. In the **Function App Name** box, enter the name of the function app.
1. In the **Secret Name** box, enter the name of the secret where you'll store access keys.
1. In the **Repo URL** box, enter the GitHub location of the function code. In this tutorial, you can use **https://github.com/Azure-Samples/KeyVault-Rotation-StorageAccountKey-PowerShell.git** .
1. Select **Review + create**.
1. Select **Create**.

   ![Screenshot that shows how to create and deploy function.](../media/secrets/rotation-dual/dual-rotation-2.png)

After you complete the preceding steps, you'll have a storage account, a server farm, a function app, and Application Insights. When the deployment is complete, you'll see this page:

   ![Screenshot that shows the Your deployment is complete page.](../media/secrets/rotation-dual/dual-rotation-3.png)
> [!NOTE]
> If you encounter a failure, you can select **Redeploy** to finish the deployment of the components.

You can find deployment templates and code for the rotation function in [Azure Samples](https://github.com/Azure-Samples/KeyVault-Rotation-StorageAccountKey-PowerShell).

### Add the storage account access keys to Key Vault secrets

First, set your access policy to grant **manage secrets** permissions to your user principal:
# [Azure CLI](#tab/azure-cli)
```azurecli
az keyvault set-policy --upn <email-address-of-user> --name vaultrotation-kv --secret-permissions set delete get list
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Set-AzKeyVaultAccessPolicy -UserPrincipalName <email-address-of-user> --name vaultrotation-kv -PermissionsToSecrets set,delete,get,list
```
---

You can now create a new secret with a storage account access key as its value. You'll also need the storage account resource ID, secret validity period, and key ID to add to the secret so the rotation function can regenerate the key in the storage account.

Determine the storage account resource ID. You can find this value in the `id` property.

# [Azure CLI](#tab/azure-cli)
```azurecli
az storage account show -n vaultrotationstorage
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzStorageAccount -Name vaultrotationstorage -ResourceGroupName vaultrotation | Select-Object -Property *
```
---

List the storage account access keys so you can get the key values:
# [Azure CLI](#tab/azure-cli)
```azurecli
az storage account keys list -n vaultrotationstorage
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzStorageAccountKey -Name vaultrotationstorage -ResourceGroupName vaultrotation
```
---

Add secret to key vault with validity period for 60 days, storage account resource ID, and for demonstration purpose to trigger rotation immediately set expiration date to tomorrow. Run this command, using your retrieved values for `key1Value` and `storageAccountResourceId`:

# [Azure CLI](#tab/azure-cli)
```azurecli
$tomorrowDate = (get-date).AddDays(+1).ToString("yyyy-MM-ddTHH:mm:ssZ")
az keyvault secret set --name storageKey --vault-name vaultrotation-kv --value <key1Value> --tags "CredentialId=key1" "ProviderAddress=<storageAccountResourceId>" "ValidityPeriodDays=60" --expires $tomorrowDate
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
$tomorrowDate = (Get-Date).AddDays(+1).ToString('yyy-MM-ddTHH:mm:ssZ')
$secretValue = ConvertTo-SecureString -String '<key1Value>' -AsPlainText -Force
$tags = @{
    CredentialId='key1'
    ProviderAddress='<storageAccountResourceId>'
    ValidityPeriodDays='60'
}
Set-AzKeyVaultSecret -Name storageKey -VaultName vaultrotation-kv -SecretValue $secretValue -Tag $tags -Expires $tomorrowDate
```
---

This secret will trigger `SecretNearExpiry` event within several minutes. This event will in turn trigger the function to rotate the secret with expiration set to 60 days. In that configuration, 'SecretNearExpiry' event would be triggered every 30 days (30 days before expiry) and rotation function will alternate rotation between key1 and key2.

You can verify that access keys have regenerated by retrieving the storage account key and the Key Vault secret and compare them.

Use this command to get the secret information:
# [Azure CLI](#tab/azure-cli)
```azurecli
az keyvault secret show --vault-name vaultrotation-kv --name storageKey
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzKeyVaultSecret -VaultName vaultrotation-kv -Name storageKey -AsPlainText
```
---

Notice that `CredentialId` is updated to the alternate `keyName` and that `value` is regenerated:

![Screenshot that shows the output of the A Z keyvault secret show command for the first storage account.](../media/secrets/rotation-dual/dual-rotation-4.png)

Retrieve the access keys to compare the values:
# [Azure CLI](#tab/azure-cli)
```azurecli
az storage account keys list -n vaultrotationstorage 
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzStorageAccountKey -Name vaultrotationstorage -ResourceGroupName vaultrotation
```
---

Notice that `value` of the key is same as secret in key vault:

![Screenshot that shows the output of the A Z storage account keys list command for the first storage account.](../media/secrets/rotation-dual/dual-rotation-5.png)

## Use existing rotation function for multiple storage accounts

You can reuse the same function app to rotate keys for multiple storage accounts. 

To add storage account keys to an existing function for rotation, you need:
- The Storage Account Key Operator Service role assigned to function app so it can access storage account access keys.
- An Event Grid event subscription for the **SecretNearExpiry** event.

1. Select the Azure template deployment link: 

   [![Azure template deployment link.](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2FKeyVault-Rotation-StorageAccountKey-PowerShell%2Fmaster%2FARM-Templates%2FAdd-Event-Subscriptions%2Fazuredeploy.json)

1. In the **Resource group** list, select **vaultrotation**.
1. In the **Storage Account RG** box, enter the name of the resource group in which your storage account is located. Keep the default value **[resourceGroup().name]** if your storage account is already located in the same resource group where you'll deploy the key rotation function.
1. In the **Storage Account Name** box, enter the name of the storage account that contains the access keys to rotate.
1. In the **Key Vault RG** box, enter the name of resource group in which your key vault is located. Keep the default value **[resourceGroup().name]** if your key vault already exists in the same resource group where you'll deploy the key rotation function.
1. In the **Key Vault Name** box, enter the name of the key vault.
1. In the **Function App Name** box, enter the name of the function app.
1. In the **Secret Name** box, enter the name of the secret where you'll store access keys.
1. Select **Review + create**.
1. Select **Create**.

   ![Screenshot that shows how to create an additional storage account.](../media/secrets/rotation-dual/dual-rotation-7.png)

### Add storage account access key to Key Vault secrets

Determine the storage account resource ID. You can find this value in the `id` property.
# [Azure CLI](#tab/azure-cli)
```azurecli
az storage account show -n vaultrotationstorage2
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzStorageAccount -Name vaultrotationstorage -ResourceGroupName vaultrotation | Select-Object -Property *
```
---

List the storage account access keys so you can get the key2 value:
# [Azure CLI](#tab/azure-cli)
```azurecli
az storage account keys list -n vaultrotationstorage2
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzStorageAccountKey -Name vaultrotationstorage2 -ResourceGroupName vaultrotation
```
---

Add secret to key vault with validity period for 60 days, storage account resource ID, and for demonstration purpose to trigger rotation immediately set expiration date to tomorrow. Run this command, using your retrieved values for `key2Value` and `storageAccountResourceId`:

# [Azure CLI](#tab/azure-cli)
```azurecli
$tomorrowDate = (Get-Date).AddDays(+1).ToString('yyyy-MM-ddTHH:mm:ssZ')
az keyvault secret set --name storageKey2 --vault-name vaultrotation-kv --value <key2Value> --tags "CredentialId=key2" "ProviderAddress=<storageAccountResourceId>" "ValidityPeriodDays=60" --expires $tomorrowDate
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
$tomorrowDate = (get-date).AddDays(+1).ToString("yyyy-MM-ddTHH:mm:ssZ")
$secretValue = ConvertTo-SecureString -String '<key1Value>' -AsPlainText -Force
$tags = @{
    CredentialId='key2';
    ProviderAddress='<storageAccountResourceId>';
    ValidityPeriodDays='60'
}
Set-AzKeyVaultSecret -Name storageKey2 -VaultName vaultrotation-kv -SecretValue $secretValue -Tag $tags -Expires $tomorrowDate
```
---

Use this command to get the secret information:
# [Azure CLI](#tab/azure-cli)
```azurecli
az keyvault secret show --vault-name vaultrotation-kv --name storageKey2
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzKeyVaultSecret -VaultName vaultrotation-kv -Name storageKey2 -AsPlainText
```
---

Notice that `CredentialId` is updated to the alternate `keyName` and that `value` is regenerated:

![Screenshot that shows the output of the A Z keyvault secret show command for the second storage account.](../media/secrets/rotation-dual/dual-rotation-8.png)

Retrieve the access keys to compare the values:
# [Azure CLI](#tab/azure-cli)
```azurecli
az storage account keys list -n vaultrotationstorage 
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Get-AzStorageAccountKey -Name vaultrotationstorage -ResourceGroupName vaultrotation
```
---

Notice that `value` of the key is same as secret in key vault:

![Screenshot that shows the output of the A Z storage account keys list command for the second storage account.](../media/secrets/rotation-dual/dual-rotation-9.png)

## Disable rotation for secret

You can disable rotation of a secret simply by deleting the Event Grid subscription for that secret. Use the Azure PowerShell [Remove-AzEventGridSubscription](/powershell/module/az.eventgrid/remove-azeventgridsubscription) cmdlet or Azure CLI [az event grid event--subscription delete](/cli/azure/eventgrid/event-subscription?#az-eventgrid-event-subscription-delete) command.


## Key Vault rotation functions for two sets of credentials

Rotation functions template for two sets of credentials and several ready to use functions:

- [Project template](https://serverlesslibrary.net/sample/bc72c6c3-bd8f-4b08-89fb-c5720c1f997f)
- [Redis Cache](https://serverlesslibrary.net/sample/0d42ac45-3db2-4383-86d7-3b92d09bc978)
- [Storage Account](https://serverlesslibrary.net/sample/0e4e6618-a96e-4026-9e3a-74b8412213a4)
- [Azure Cosmos DB](https://serverlesslibrary.net/sample/bcfaee79-4ced-4a5c-969b-0cc3997f47cc)

> [!NOTE]
> These rotation functions are created by a member of the community and not by Microsoft. Community functions are not supported under any Microsoft support program or service, and are made available AS IS without warranty of any kind.

## Next steps

- Tutorial: [Secrets rotation for one set of credentials](./tutorial-rotation.md)
- Overview: [Monitoring Key Vault with Azure Event Grid](../general/event-grid-overview.md)
- How to: [Create your first function in the Azure portal](../../azure-functions/functions-get-started.md)
- How to: [Receive email when a Key Vault secret changes](../general/event-grid-logicapps.md)
- Reference: [Azure Event Grid event schema for Azure Key Vault](../../event-grid/event-schema-key-vault.md)
