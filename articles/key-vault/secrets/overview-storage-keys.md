---
title: Manage storage account keys with Azure Key Vault and the Azure CLI
description: Storage account keys provide seamless integration between Azure Key Vault and key-based access to an Azure storage account.
ms.topic: tutorial
services: key-vault
ms.service: key-vault
ms.subservice: secrets
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/18/2019 
ms.custom: devx-track-azurecli
# Customer intent: As a developer, I want to use Azure Key Vault and Azure CLI for secure management of my storage credentials and shared access signature tokens.
---

# Manage storage account keys with Key Vault and the Azure CLI
> [!IMPORTANT]
> We recommend using Azure Storage integration with Azure Active Directory (Azure AD), Microsoft's cloud-based identity and access management service. Azure AD integration is available for [Azure blobs and queues](../../storage/common/storage-auth-aad.md), and provides OAuth2 token-based access to Azure Storage (just like Azure Key Vault). 
> Azure AD allows you to authenticate your client application by using an application or user identity, instead of storage account credentials. You can use an [Azure AD managed identity](../../active-directory/managed-identities-azure-resources/index.yml) when you run on Azure. Managed identities remove the need for client authentication and storing credentials in or with your application. Use below solution only when Azure AD authentication is not possible.

An Azure storage account uses credentials comprising an account name and a key. The key is auto-generated and serves as a password, rather than an as a cryptographic key. Key Vault manages storage account keys by periodically regenerating them in storage account and provides shared access signature tokens for delegated access to resources in your storage account.

You can use the Key Vault managed storage account key feature to list (sync) keys with an Azure storage account, and regenerate (rotate) the keys periodically. You can manage keys for both storage accounts and Classic storage accounts.

When you use the managed storage account key feature, consider the following points:

- Key values are never returned in response to a caller.
- Only Key Vault should manage your storage account keys. Don't manage the keys yourself and avoid interfering with Key Vault processes.
- Only a single Key Vault object should manage storage account keys. Don't allow key management from multiple objects.
- Regenerate keys by using Key Vault only. Don't manually regenerate your storage account keys.

## Service principal application ID

An Azure AD tenant provides each registered application with a [service principal](../../active-directory/develop/developer-glossary.md#service-principal-object). The service principal serves as the Application ID, which is used during authorization setup for access to other Azure resources via Azure RBAC.

Key Vault is a Microsoft application that's pre-registered in all Azure AD tenants. Key Vault is registered under the same Application ID in each Azure cloud.

| Tenants | Cloud | Application ID |
| --- | --- | --- |
| Azure AD | Azure Government | `7e7c393b-45d0-48b1-a35e-2905ddf8183c` |
| Azure AD | Azure public | `cfa8b339-82a2-471a-a3c9-0fc0be7a4093` |
| Other  | Any | `cfa8b339-82a2-471a-a3c9-0fc0be7a4093` |

## Prerequisites

To complete this guide, you must first do the following:

- [Install the Azure CLI](/cli/azure/install-azure-cli).
- [Create a key vault](quick-create-cli.md)
- [Create an Azure storage account](../../storage/common/storage-account-create.md?tabs=azure-cli). The storage account name must use only lowercase letters and numbers. The length of the name must be between 3 and 24 characters.
      
## Manage storage account keys

### Connect to your Azure account

Authenticate your Azure CLI session using the [az login](/powershell/module/az.accounts/connect-azaccount) commands.

```azurecli-interactive
az login
``` 

### Give Key Vault access to your storage account

Use the Azure CLI [az role assignment create](/cli/azure/role/assignment) command to give Key Vault access your storage account. Provide the command the following parameter values:

- `--role`: Pass the "Storage Account Key Operator Service Role" Azure role. This role limits the access scope to your storage account. For a classic storage account, pass "Classic Storage Account Key Operator Service Role" instead.
- `--assignee`: Pass the value "https://vault.azure.net", which is the url for Key Vault in the Azure public cloud. (For Azure Goverment cloud use '--asingee-object-id' instead, see [Service principal application ID](#service-principal-application-id).)
- `--scope`: Pass your storage account resource ID, which is in the form `/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>`. To find your subscription ID, use the Azure CLI [az account list](/cli/azure/account?#az_account_list) command; to find your storage account name and storage account resource group, use the Azure CLI [az storage account list](/cli/azure/storage/account?#az_storage_account_list) command.

```azurecli-interactive
az role assignment create --role "Storage Account Key Operator Service Role" --assignee 'https://vault.azure.net' --scope "/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>"
 ```
### Give your user account permission to managed storage accounts

Use the Azure CLI [az keyvault-set-policy](/cli/azure/keyvault?#az_keyvault_set_policy) cmdlet to update the Key Vault access policy and grant storage account permissions to your user account.

```azurecli-interactive
# Give your user principal access to all storage account permissions, on your Key Vault instance

az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --storage-permissions get list delete set update regeneratekey getsas listsas deletesas setsas recover backup restore purge
```

Note that permissions for storage accounts aren't available on the storage account "Access policies" page in the Azure portal.
### Create a Key Vault Managed storage account

 Create a Key Vault managed storage account using the Azure CLI [az keyvault storage](/cli/azure/keyvault/storage?#az_keyvault_storage_add) command. Set a regeneration period of 90 days. When it is time to rotate, KeyVault regenerates the key that is not active, and then sets the newly created key as active. Only one of the keys are used to issue SAS tokens at any one time, this is the active key. Provide the command the following parameter values:

- `--vault-name`: Pass the name of your key vault. To find the name of your key vault, use the Azure CLI [az keyvault list](/cli/azure/keyvault?#az_keyvault_list) command.
- `-n`: Pass the name of your storage account. To find the name of your storage account, use the Azure CLI [az storage account list](/cli/azure/storage/account?#az_storage_account_list) command.
- `--resource-id`: Pass your storage account resource ID, which is in the form `/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>`. To find your subscription ID, use the Azure CLI [az account list](/cli/azure/account?#az_account_list) command; to find your storage account name and storage account resource group, use the Azure CLI [az storage account list](/cli/azure/storage/account?#az_storage_account_list) command.
   
 ```azurecli-interactive
az keyvault storage add --vault-name <YourKeyVaultName> -n <YourStorageAccountName> --active-key-name key1 --auto-regenerate-key --regeneration-period P90D --resource-id "/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>"
 ```

## Shared access signature tokens

You can also ask Key Vault to generate shared access signature tokens. A shared access signature provides delegated access to resources in your storage account. You can grant clients access to resources in your storage account without sharing your account keys. A shared access signature provides you with a secure way to share your storage resources without compromising your account keys.

The commands in this section complete the following actions:

- Set an account shared access signature definition `<YourSASDefinitionName>`. The definition is set on a Key Vault managed storage account `<YourStorageAccountName>` in your key vault `<YourKeyVaultName>`.
- Create an account shared access signature token for Blob, File, Table, and Queue services. The token is created for resource types Service, Container, and Object. The token is created with all permissions, over https, and with the specified start and end dates.
- Set a Key Vault managed storage shared access signature definition in the vault. The definition has the template URI of the shared access signature token that was created. The definition has the shared access signature type `account` and is valid for N days.
- Verify that the shared access signature was saved in your key vault as a secret.

### Create a shared access signature token

Create a shared access signature definition using the Azure CLI [az storage account generate-sas](/cli/azure/storage/account?#az_storage_account_generate_sas) command. This operation requires the `storage` and `setsas` permissions.


```azurecli-interactive
az storage account generate-sas --expiry 2020-01-01 --permissions rw --resource-types sco --services bfqt --https-only --account-name <YourStorageAccountName> --account-key 00000000
```
After the operation runs successfully, copy the output.

```console
"se=2020-01-01&sp=***"
```

This output will be the passed to the `--template-uri` parameter in the next step.

### Generate a shared access signature definition

Use the the Azure CLI [az keyvault storage sas-definition create](/cli/azure/keyvault/storage/sas-definition?#az_keyvault_storage_sas_definition_create) command, passing the output from the previous step to the `--template-uri` parameter, to create a shared access signature definition.  You can provide the name of your choice to the `-n` parameter.

```azurecli-interactive
az keyvault storage sas-definition create --vault-name <YourKeyVaultName> --account-name <YourStorageAccountName> -n <YourSASDefinitionName> --validity-period P2D --sas-type account --template-uri <OutputOfSasTokenCreationStep>
```

### Verify the shared access signature definition

You can verify that the shared access signature definition has been stored in your key vault using the Azure CLI [az keyvault storage sas-definition show](/cli/azure/keyvault/storage/sas-definition?#az_keyvault_storage_sas_definition_show) command.

You can now use the [az keyvault storage sas-definition show](/cli/azure/keyvault/storage/sas-definition?#az_keyvault_storage_sas_definition_show) command and the `id` property to view the content of that secret.

```azurecli-interactive
az keyvault storage sas-definition show --id https://<YourKeyVaultName>.vault.azure.net/storage/<YourStorageAccountName>/sas/<YourSASDefinitionName>
```

## Next steps

- Learn more about [keys, secrets, and certificates](/rest/api/keyvault/).
- Review articles on the [Azure Key Vault team blog](/archive/blogs/kv/).
- See the [az keyvault storage](/cli/azure/keyvault/storage) reference documentation.
