---
title: Configure customer-managed keys on existing accounts
titleSuffix: Azure Cosmos DB
description: Store customer-managed keys in Azure Key Vault to use for encryption in your existing Azure Cosmos DB account with access control.
author: dileepraotv-github
ms.service: cosmos-db
ms.topic: how-to
ms.date: 08/17/2023
ms.author: turao
ms.custom: ignite-2022
ms.devlang: azurecli
---

# Configure customer-managed keys for your existing Azure Cosmos DB account with Azure Key Vault (Preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Enabling a second layer of encryption for data at rest using [Customer Managed Keys](./how-to-setup-customer-managed-keys.md) while creating a new Azure Cosmos DB account has been Generally available for some time now. As a natural next step, we now have the capability to enable CMK on existing Azure Cosmos DB accounts.

This feature eliminates the need for data migration to a new account to enable CMK. It helps to improve customers’ security and compliance posture.

> [!NOTE]
> Currently, enabling customer-managed keys on existing Azure Cosmos DB accounts is in preview. This preview is provided without a service-level agreement. Certain features of this preview may not be supported or may have constrained capabilities. For more information, see [supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Enabling CMK kicks off a background, asynchronous process to encrypt all the existing data in the account, while new incoming data are encrypted before persisting. There's no need to wait for the asynchronous operation to succeed. The enablement process consumes unused/spare RUs so that it doesn't affect your read/write workloads. You can refer to this [link](./how-to-setup-customer-managed-keys.md?tabs=azure-powershell#how-do-customer-managed-keys-influence-capacity-planning) for capacity planning once your account is encrypted. 

## Get started by enabling CMK on your existing accounts

### Prerequisites

All the prerequisite steps needed while configuring Customer Managed Keys for new accounts is applicable to enable CMK on your existing account. Refer to the steps [here](./how-to-setup-customer-managed-keys.md?tabs=azure-portal#prerequisites)

### Steps to enable CMK on your existing account

To enable CMK on an existing account, update the account with an ARM template setting a Key Vault key identifier in the keyVaultKeyUri property – just like you would when enabling CMK on a new account. This step can be done by issuing a PATCH call with the following payload:

```
    {
        "properties": {
        "keyVaultKeyUri": "<key-vault-key-uri>"
        }
    }
```

The output of this CLI command for enabling CMK waits for the completion of encryption of data.

```azurecli
    az cosmosdb update --name "testaccount" --resource-group "testrg" --key-uri "https://keyvaultname.vault.azure.net/keys/key1"
```

### Steps to enable CMK on your existing Azure Cosmos DB account with Continuous backup or Analytical store account

For enabling CMK on existing account that has continuous backup and point in time restore enabled, we need to follow some extra steps. Follow step 1 to step 5 and then follow instructions to enable CMK on existing account.

> [!NOTE]
> System-assigned identity and continuous backup mode is currently under Public Preview and may change in the future. Currently, only user-assigned managed identity is supported for enabling CMK on continuous backup accounts.



1. Configure managed identity to your cosmos account [Configure managed identities with Microsoft Entra ID for your Azure Cosmos DB account](./how-to-setup-managed-identity.md)

1. Update cosmos account to set default identity to point to managed identity added in previous step

    **For System managed identity :**
    ```
    az cosmosdb update --resource-group $resourceGroupName  --name $accountName  --default-identity "SystemAssignedIdentity=subscriptions/00000000-0000-0000-0000-00000000/resourcegroups/MyRG/providers/Microsoft.ManagedIdentity/ systemAssignedIdentities/MyID"
    ```

    **For User managed identity  :**

    ```
    az cosmosdb update -n $sourceAccountName -g $resourceGroupName --default-identity "UserAssignedIdentity=subscriptions/00000000-0000-0000-0000-00000000/resourcegroups/MyRG/providers/Microsoft.ManagedIdentity/userAssignedIdentities/MyID"
    ```

1. Configure Keyvault as given in documentation [here](./how-to-setup-customer-managed-keys.md?tabs=azure-cli#configure-your-azure-key-vault-instance) 

1. Add [access policy](./how-to-setup-customer-managed-keys.md?tabs=azure-cli#using-a-managed-identity-in-the-azure-key-vault-access-policy) in the keyvault for the default identity that is set in previous step 

1. Update cosmos account to set keyvault uri, this update triggers enabling CMK on account   
    ```
    az cosmosdb update --name $accountName --resource-group $resourceGroupName --key-uri $keyVaultKeyURI  
    ```
## Known limitations

- Enabling CMK is available only at a Cosmos DB account level and not at collections.
- We don't support enabling CMK on existing Azure Cosmos DB for Apache Cassandra accounts.
- We don't support enabling CMK on existing accounts that are enabled for Materialized Views and Full Fidelity Change Feed (FFCF) as well.
- Ensure account must not have documents with large IDs greater than 990 bytes before enabling CMK. If not, you'll get an error due to max supported limit of 1024 bytes after encryption.
- During encryption of existing data, [control plane](./audit-control-plane-logs.md) actions such as "add region" is blocked. These actions are unblocked and can be used right after the encryption is complete.

## Monitor the progress of the resulting encryption

Enabling CMK on an existing account is an asynchronous operation that kicks off a background task that encrypts all existing data. As such, the REST API request to enable CMK provides in its response an "Azure-AsyncOperation" URL. Polling this URL with GET requests return the status of the overall operation, which eventually Succeed. This mechanism is fully described in [this](/azure/azure-resource-manager/management/async-operations) article.

The Cosmos DB account can continue to be used and data can continue to be written without waiting for the asynchronous operation to succeed. CLI command for enabling CMK waits for the completion of encryption of data.

If you have further questions, reach out to Microsoft Support.

## FAQs

**What are the factors on which the encryption time depends?**

Enabling CMK is an asynchronous operation and depends on sufficient unused RUs being available. We suggest enabling CMK during off-peak hours and if applicable you can increase RUs before hand, to speed up encryption. It's also a direct function of data size.

**Do we need to brace ourselves for downtime?**

Enabling CMK kicks off a background, asynchronous process to encrypt all the data. There's no need to wait for the asynchronous operation to succeed. The Azure Cosmos DB account is available for reads and writes and there's no need for a downtime.

**Can you bump up the RU’s once CMK has been triggered?**

It's suggested to bump up the RUs before you trigger CMK. Once CMK is triggered, then some control plane operations are blocked till the encryption is complete. This block may prevent the user from increasing the RU’s once CMK is triggered.

**Is there a way to reverse the encryption or disable encryption after triggering CMK?**

Once the data encryption process using CMK is triggered, it can't be reverted. 

**Will enabling encryption using CMK on existing account have an impact on data size and read/writes?**

As you would expect, by enabling CMK there's a slight increase in data size and RUs to accommodate extra encryption/decryption processing.

**Should you back up the data before enabling CMK?**

Enabling CMK doesn't pose any threat of data loss.

**Are old backups taken as a part of periodic backup encrypted?**

No. Old periodic backups aren't encrypted. Newly generated backups after CMK enabled is encrypted.

**What is the behavior on existing accounts that are enabled for Continuous backup?**

When CMK is turned on, the encryption is turned on for continuous backups as well. Once CMK is turned on, all restored accounts going forward will be CMK enabled.

**What is the behavior if CMK is enabled on PITR enabled account and we restore account to the time CMK was disabled?**

In this case CMK is explicitly enabled on the restored target account for the following reasons: 
- Once CMK is enabled on the account, there's no option to disable CMK. 
- This behavior is in line with the current design of restore of CMK enabled account with periodic backup

**What happens when user revokes the key while CMK migration is in-progress?**

The state of the key is checked when CMK encryption is triggered. If the key in Azure Key vault is in good standing, the encryption is started and the process completes without further check. Even if the key is revoked, or Azure key vault is deleted or unavailable, the encryption process succeeds. 

**Can we enable CMK encryption on our existing production account?**

Yes. Since the capability is currently in preview, we recommend testing all scenarios first on nonproduction accounts and once you're comfortable you can consider production accounts.

## Next steps

* Learn more about [data encryption in Azure Cosmos DB](database-encryption-at-rest.md).
* You can choose to add a second layer of encryption with your own keys, to learn more, see the [customer-managed keys](how-to-setup-cmk.md) article.
* For an overview of Azure Cosmos DB security and the latest improvements, see [Azure Cosmos DB database security](database-security.md).
* For more information about Microsoft certifications, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/).
