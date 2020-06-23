---
title: Dual credential rotation tutorial
description: Use this tutorial to learn how to automate the rotation of a secret for resources that use dual credential authentication.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: 'rotation'

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 06/22/2020
ms.author: jalichwa

---
# Automate the rotation of a secret for resources that use dual credential authentication

The best way to authenticate to Azure services is by using a [managed identity](../general/managed-identity.md), but there are some scenarios where that isn't an option. In those cases, access keys or passwords are used. You should periodically rotate access keys or passwords.

This tutorial shows how to automate the periodic rotation of secrets for databases and services that use dual credential authentication. Specifically, this tutorial rotates Azure Storage account keys  in Azure Key Vault by using a function triggered by Azure Event Grid notification:

![Diagram of rotation solution](../media/secrets/rotation-dual/rotationdiagram.png)
In above solution, Azure Key Vault stores Storage Account individual access key as version of the secret alternating between primary and secondary key in subsequent versions in each rotation cycle. As one access key is stored in latest version of the secret, alternate key gets regenerated and added to Key Vault as new and latest version of the secret. That provides applications time to refresh to new regenerated key by being able to continue use older alternate key till another rotation cycle, which potentially eliminates any downtime.

1. Thirty days before the expiration date of a secret, Key Vault publishes the "near expiry" event to Event Grid.
1. Event Grid checks the event subscriptions and uses HTTP POST to call the function app endpoint subscribed to the event.
1. The function app receives near expiry event, identifies alternate key to the latest secret version access key, and calls Storage Account to regenerate an alternate access key
1. The function app adds new regenerated key to Azure Key Vault as new version of the secret.

## Prerequisites

* Azure Key Vault
* Azure Storage Account

Below deployment link can be used, if you don't have existing key vault and storage account:
<br><a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2FKeyVault-Rotation-StorageAccountKey-PowerShell%2Fmaster%2Farm-templates%2FInitial-Setup%2Fazuredeploy.json" target="_blank">
    <img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/>
</a>

1. Under **Resource group**, select **Create new**. Name the group **akvrotation** and click **Ok**.
1. Select **Review+Create**.
1. Select **Create**

    ![Create a resource group](../media/secrets/rotation-dual/dualrotation1.png)

You'll now have a key vault, and two storage accounts. You can verify this setup in the Azure CLI by running the following command:

```azurecli
az resource list -o table -g akvrotation
```

The result will look something the following output:

```console
Name                     ResourceGroup         Location    Type                               Status
-----------------------  --------------------  ----------  ---------------------------------  --------
akvrotation-kv         akvrotation      eastus      Microsoft.KeyVault/vaults
akvrotationstorage     akvrotation      eastus      Microsoft.Storage/storageAccounts
```

## Create and deploy storage account key rotation function

Next, create a function app with a system-managed identity, in addition to the other required components, and deploy storage account key rotation functions

The function app rotation functions require these components and configuration:
- An Azure App Service plan
- A storage account requried for function app trigger management
- An access policy to access secrets in Key Vault
- An role assignment to access Storage Account access keys
- Storage Account key rotation functions with event trigger and http trigger (on-demand rotation)
- EventGrid event subscription for **SecretNearExpiry** event

1. Select the Azure template deployment link: 
<br><a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fjlichwa%2FKeyVault-Rotation-StorageAccountKey-PowerShell%2Fmaster%2Farm-templates%2FFunction%2Fazuredeploy.json" target="_blank">
    <img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png"/>
</a>

1. In the **Resource group** list, select **akvrotation**.
1. In the **Storage Account Name**, type the storage account name with access keys to rotate
1. In the **Key Vault Name**,  type the key vault name
1. In the **Function App Name**,  type the function app name
1. In the **Secret Name**,  type secret name where access keys would be stored
1. In the **Repo Url**, type function code GitHub location (**https://github.com/jlichwa/KeyVault-Rotation-StorageAccountKey-PowerShell.git**)
1. Select **Review+Create**.
1. Select **Create**

   ![Review+Create](../media/secrets/rotation-dual/dualrotation2.png)

After you complete the preceding steps, you'll have a storage account, a server farm, a function app, application insights. You should see below screen once deployment completed:
   ![Deployment complete](../media/secrets/rotation-dual/dualrotation3.png)
> [!NOTE]
> In case of any failures you can click **Redeploy** to finish deployment of remaining components.


Deployment templates and rotation functions code can be found on [GitHub](https://github.com/jlichwa/KeyVault-Rotation-StorageAccountKey-PowerShell).

## Add Storage Account access key to Key Vault

First, set your access policy to grant *manage secrets* permissions to users:

```azurecli
az keyvault set-policy --upn <email-address-of-user> --name akvrotation-kv --secret-permissions set delete get list
```

Then, you can create a new secret with a Storage Account access key as value. You will also need the Storage Account resource id, secret validity period and the key ID to add to secret, so rotation function can regenerate key in Storage Account.

Retrieve Storage Account resource id. Value can be found under `id` property
```azurecli
az storage account show -n akvrotationstorage
```

List the Storage Account access keys to retrieve key values

```azurecli
az storage account keys list -n akvrotationstorage 
```

Populate retrieved values for **keyName**, **keyValue** and **storageAccountResourceId**

```azurecli
$tomorrowDate = (get-date).AddDays(+1).ToString("yyy-MM-ddThh:mm:ssZ")
az keyvault secret set --name storageKey --vault-name akvrotation-kv --value <keyValue> --tags "CredentialId=<keyName>" "ProviderAddress=<storageAccountResourceId>" "ValidityPeriodDays=60" --expires $tomorrowDate
```

Creating a secret with a short expiration date will publish a `SecretNearExpiry` event within several minutes, which will in turn trigger the function to rotate the secret.

## Test and verify

You can verify that access keys are regenerated by retrieving and comparing Storage Account keys and Key Vault secret.

You can show secret information using below command:
```azurecli
az keyvault secret show --vault-name akvrotation-kv --name storageKey
```
Notice that `CredentialId` is updated to alternate `keyName` and `value` is regenerated
![Secret Show](../media/secrets/rotation-dual/dualrotation4.png)

Retrieve access keys to validate value
```azurecli
az storage account keys list -n akvrotationstorage 
```
![Access Key List](../media/secrets/rotation-dual/dualrotation5.png)

## Add additional Storage Accounts for rotation

Same function app can be reused to rotate multiple Storage Accounts keys simply by adding event subscription. 

Copy the function app's `eventgrid_extension` key:

   ![Select function app keys](../media/secrets/rotation-dual/dualrotation6.png)

Use the copied `eventgrid_extension` key and your subscription ID in the following command to create an Event Grid subscription for `SecretNearExpiry` events:

```azurecli
az eventgrid event-subscription create --name akvrotation-kv-storageKey2-akvrotation-fnapp --source-resource-id "/subscriptions/<subscription-id>/resourceGroups/akvrotation/providers/Microsoft.KeyVault/vaults/akvrotation-kv" --resource-id "https://akvrotation-fnapp.azurewebsites.net/runtime/webhooks/EventGrid?functionName=AKVStorageRotation&code=<extension-key>" --endpoint-type WebHook --included-event-types "Microsoft.KeyVault.SecretNearExpiry"
--subject-begins-with "storageKey2" --subject-ends-with "storageKey2"
```
## Available Key Vault dual credential rotation functions

- [Storage Account](https://github.com/jlichwa/KeyVault-Rotation-StorageAccountKey-PowerShell)

## Learn more

- Overview: [Monitoring Key Vault with Azure Event Grid (preview)](../general/event-grid-overview.md)
- How to: [Receive email when a key vault secret changes](../general/event-grid-logicapps.md)
- [Azure Event Grid event schema for Azure Key Vault (preview)](../../event-grid/event-schema-key-vault.md)
