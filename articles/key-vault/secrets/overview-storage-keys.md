---
title: Manage storage account keys with Azure Key Vault and the Azure CLI
description: Storage account keys provide seamless integration between Azure Key Vault and key-based access to an Azure storage account.
ms.topic: tutorial
services: key-vault
ms.service: key-vault
ms.subservice: secrets
author: msmbaldwin
ms.author: mbaldwin
ms.date: 01/24/2023
ms.custom: devx-track-azurecli
# Customer intent: As a developer, I want to use Azure Key Vault and Azure CLI for secure management of my storage credentials and shared access signature tokens.
---

# Manage storage account keys with Key Vault and the Azure CLI (legacy)

> [!IMPORTANT]
> Key Vault Managed Storage Account Keys (legacy) is supported as-is with no more updates planned. Only Account SAS are supported with SAS definitions signed storage service version no later than 2018-03-28.

> [!IMPORTANT]
> Support for Managed Storage Account Keys in **Azure CLI was removed in version 2.54**, you must use **Azure CLI version 2.53.1 or former** for commands in this tutorial.

> [!IMPORTANT]
> We recommend using Azure Storage integration with Microsoft Entra ID, Microsoft's cloud-based identity and access management service. Microsoft Entra integration is available for [Azure blobs, queues, and tables](../../storage/blobs/authorize-access-azure-active-directory.md), and provides OAuth2 token-based access to Azure Storage (just like Azure Key Vault). 
> Microsoft Entra ID allows you to authenticate your client application by using an application or user identity, instead of storage account credentials. You can use an [Microsoft Entra managed identity](../../active-directory/managed-identities-azure-resources/index.yml) when you run on Azure. Managed identities remove the need for client authentication and storing credentials in or with your application. Use below solution only when Microsoft Entra authentication is not possible.

An Azure storage account uses credentials comprising an account name and a key. The key is auto-generated and serves as a password, rather than an as a cryptographic key. Key Vault manages storage account keys by periodically regenerating them in storage account and provides shared access signature tokens for delegated access to resources in your storage account.

You can use the Key Vault managed storage account key feature to list (sync) keys with an Azure storage account, and regenerate (rotate) the keys periodically. You can manage keys for both storage accounts and Classic storage accounts.

When you use the managed storage account key feature, consider the following points:

- Key values are never returned in response to a caller.
- Only Key Vault should manage your storage account keys. Don't manage the keys yourself and avoid interfering with Key Vault processes.
- Only a single Key Vault object should manage storage account keys. Don't allow key management from multiple objects.
- Regenerate keys by using Key Vault only. Don't manually regenerate your storage account keys.

> [!IMPORTANT]
> Regenerating key directly in storage account breaks managed storage account setup and can invalidate SAS tokens in use and cause an outage.

## Service principal application ID

A Microsoft Entra tenant provides each registered application with a [service principal](../../active-directory/develop/developer-glossary.md#service-principal-object). The service principal serves as the Application ID, which is used during authorization setup for access to other Azure resources via Azure role-base access control (Azure RBAC).

Key Vault is a Microsoft application that's pre-registered in all Microsoft Entra tenants. Key Vault is registered under the same Application ID in each Azure cloud.

| Tenants | Cloud | Application ID |
| --- | --- | --- |
| Microsoft Entra ID | Azure Government | `7e7c393b-45d0-48b1-a35e-2905ddf8183c` |
| Microsoft Entra ID | Azure public | `cfa8b339-82a2-471a-a3c9-0fc0be7a4093` |
| Other  | Any | `cfa8b339-82a2-471a-a3c9-0fc0be7a4093` |

## Prerequisites

To complete this guide, you must first do the following steps:

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
- `--assignee`: Pass the value "https://vault.azure.net", which is the url for Key Vault in the Azure public cloud. (For Azure Government cloud use '--assignee-object-id' instead, see [Service principal application ID](#service-principal-application-id).)
- `--scope`: Pass your storage account resource ID, which is in the form `/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>`. Find your subscription ID, by using the Azure CLI [az account list](/cli/azure/account?#az-account-list) command. Find your storage account name and storage account resource group, by using the Azure CLI [az storage account list](/cli/azure/storage/account?#az-storage-account-list) command.

```azurecli-interactive
az role assignment create --role "Storage Account Key Operator Service Role" --assignee "https://vault.azure.net" --scope "/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>"
 ```
### Give your user account permission to managed storage accounts

Use the Azure CLI [az keyvault-set-policy](/cli/azure/keyvault?#az-keyvault-set-policy) cmdlet to update the Key Vault access policy and grant storage account permissions to your user account.

```azurecli-interactive
# Give your user principal access to all storage account permissions, on your Key Vault instance

az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --storage-permissions get list delete set update regeneratekey getsas listsas deletesas setsas recover backup restore purge
```

Permissions for storage accounts aren't available on the storage account "Access policies" page in the Azure portal.

### Create a Key Vault Managed storage account

Create a Key Vault managed storage account using the Azure CLI [az keyvault storage](/powershell/module/az.storage/new-azstorageaccount) command. Set a regeneration period of 30 days. When it's time to rotate, KeyVault regenerates the key that isn't active, and then sets the newly created key as active. Only one of the keys is used to issue SAS tokens at any one time, this is the active key. Provide the command the following parameter values:

- `--vault-name`: Pass the name of your key vault. To find the name of your key vault, use the Azure CLI [az keyvault list](/cli/azure/keyvault?#az-keyvault-list) command.
- `-n`: Pass the name of your storage account. To find the name of your storage account, use the Azure CLI [az storage account list](/cli/azure/storage/account?#az-storage-account-list) command.
- `--resource-id`: Pass your storage account resource ID, which is in the form `/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>`. Find your subscription ID, by using the Azure CLI [az account list](/cli/azure/account?#az-account-list) command. Find your storage account name and storage account resource group, by using the Azure CLI [az storage account list](/cli/azure/storage/account?#az-storage-account-list) command.
   
```azurecli-interactive
az keyvault storage add --vault-name <YourKeyVaultName> -n <YourStorageAccountName> --active-key-name key1 --auto-regenerate-key --regeneration-period P30D --resource-id "/subscriptions/<subscriptionID>/resourceGroups/<StorageAccountResourceGroupName>/providers/Microsoft.Storage/storageAccounts/<YourStorageAccountName>"
```

## Shared access signature tokens

You can also ask Key Vault to generate shared access signature tokens. A shared access signature provides delegated access to resources in your storage account. You can grant clients access to resources in your storage account without sharing your account keys. A shared access signature provides you with a secure way to share your storage resources without compromising your account keys.

The commands in this section complete the following actions:

- Set an account shared access signature definition `<YourSASDefinitionName>`. The definition is set on a Key Vault managed storage account `<YourStorageAccountName>` in your key vault `<YourKeyVaultName>`.
- Set a Key Vault managed storage shared access signature definition in the vault. The definition has the template URI of the shared access signature token that was created. The definition has the shared access signature type `account` and is valid for N days.
- Verify that the shared access signature was saved in your key vault as a secret.

### Define a shared access signature definition template

Key Vault uses SAS definition template to generate tokens for client applications. 

SAS definition template example:
```console
"sv=2018-03-28&ss=bfqt&srt=sco&sp=rw&spr=https"
```

SAS definition template will be the passed to the `--template-uri` parameter in the next step.

#### Account SAS parameters required in SAS definition template for Key Vault

|SAS Query Parameter|Description|  
|-------------------------|-----------------|  
|`SignedVersion (sv)`|Required. Specifies the signed storage service version to use to authorize requests made with this account SAS. Must be set to version 2015-04-05 or later. **Key Vault supports versions no later than 2018-03-28**|  
|`SignedServices (ss)`|Required. Specifies the signed services accessible with the account SAS. Possible values include:<br /><br /> - Blob (`b`)<br />- Queue (`q`)<br />- Table (`t`)<br />- File (`f`)<br /><br /> You can combine values to provide access to more than one service. For example, `ss=bf` specifies access to the Blob and File endpoints.|  
|`SignedResourceTypes (srt)`|Required. Specifies the signed resource types that are accessible with the account SAS.<br /><br /> - Service (`s`): Access to service-level APIs (*for example*, Get/Set Service Properties, Get Service Stats, List Containers/Queues/Tables/Shares)<br />- Container (`c`): Access to container-level APIs (*for example*, Create/Delete Container, Create/Delete Queue, Create/Delete Table, Create/Delete Share, List Blobs/Files and Directories)<br />- Object (`o`): Access to object-level APIs for  blobs, queue messages,  table entities, and files(*for example,* Put Blob, Query Entity, Get Messages, Create File, etc.)<br /><br /> You can combine values to provide access to more than one resource type. For example, `srt=sc` specifies access to service and container resources.|  
|`SignedPermission (sp)`|Required. Specifies the signed permissions for the account SAS. Permissions are only valid if they match the specified signed resource type; otherwise they're ignored.<br /><br /> - Read (`r`): Valid for all signed resources types (Service, Container, and Object). Permits read permissions to the specified resource type.<br />- Write (`w`): Valid for all signed resources types (Service, Container, and Object). Permits write permissions to the specified resource type.<br />- Delete (`d`): Valid for Container and Object resource types, except for queue messages.<br />- Permanent Delete (`y`): Valid for Object resource type of Blob only.<br />- List (`l`): Valid for Service and Container resource types only.<br />- Add (`a`): Valid for the following Object resource types only: queue messages, table entities, and append blobs.<br />- Create (`c`): Valid for the following Object resource types only: blobs and files. Users can create new blobs or files, but may not overwrite existing blobs or files.<br />- Update (`u`): Valid for the following Object resource types only: queue messages and table entities.<br />- Process (`p`): Valid for the following Object resource type only: queue messages.<br/>- Tag (`t`): Valid for the following Object resource type only: blobs. Permits blob tag operations.<br/>- Filter (`f`): Valid for the following Object resource type only: blob. Permits filtering by blob tag.<br/>- Set Immutability Policy (`i`): Valid for the following Object resource type only: blob. Permits set/delete immutability policy and legal hold on a blob.|
|`SignedProtocol (spr)`|Optional. Specifies the protocol permitted for a request made with the account SAS. Possible values are both HTTPS and HTTP (`https,http`) or HTTPS only (`https`).  The default value is `https,http`.<br /><br /> HTTP only isn't a permitted value. |    

For more information about account SAS, see:
[Create an account SAS](/rest/api/storageservices/create-account-sas)

> [!NOTE]
> Key Vault ignores lifetime parameters like 'Signed Expiry', 'Signed Start' and parameters introduced after 2018-03-28 version

### Set shared access signature definition in Key Vault

Use the Azure CLI [az keyvault storage sas-definition create](/powershell/module/az.keyvault/set-azkeyvaultmanagedstoragesasdefinition) command, passing the SAS definition template from the previous step to the `--template-uri` parameter, to create a shared access signature definition.  You can provide the name of your choice to the `-n` parameter.

```azurecli-interactive
az keyvault storage sas-definition create --vault-name <YourKeyVaultName> --account-name <YourStorageAccountName> -n <YourSASDefinitionName> --validity-period P2D --sas-type account --template-uri <sasDefinitionTemplate>
```

### Verify the shared access signature definition

You can verify that the shared access signature definition has been stored in your key vault using the Azure CLI [az keyvault storage sas-definition show](/azure/key-vault/secrets/overview-storage-keys) command.

You can now use the [az keyvault storage sas-definition show](/azure/key-vault/secrets/overview-storage-keys) command and the `id` property to view the content of that secret.

```azurecli-interactive
az keyvault storage sas-definition show --id https://<YourKeyVaultName>.vault.azure.net/storage/<YourStorageAccountName>/sas/<YourSASDefinitionName>
```

## Next steps

- Learn more about [keys, secrets, and certificates](/rest/api/keyvault/).
- Review articles on the [Azure Key Vault team blog](/archive/blogs/kv/).
- See the [az keyvault storage](/azure/key-vault/general/manage-with-cli2) reference documentation.
