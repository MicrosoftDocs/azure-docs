---
title: Configure customer-managed keys
titleSuffix: Azure Cosmos DB
description: Store customer-managed keys in Azure Key Vault to use for encryption in your Azure Cosmos DB account with access control.
author: seesharprun
ms.service: cosmos-db
ms.topic: how-to
ms.date: 01/05/2023
ms.author: sidandrews
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2022
ms.devlang: azurecli
---

# Configure customer-managed keys for your Azure Cosmos DB account with Azure Key Vault

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Data stored in your Azure Cosmos DB account is automatically and seamlessly encrypted with keys managed by Microsoft (**service-managed keys**). Optionally, you can choose to add a second layer of encryption with keys you manage (**customer-managed keys** or CMK).

:::image type="content" source="media/how-to-setup-customer-managed-keys/managed-key-encryption-conceptual.png" alt-text="Diagram of the layers of encryption around customer data.":::

You must store customer-managed keys in [Azure Key Vault](../key-vault/general/overview.md) and provide a key for each Azure Cosmos DB account that is enabled with customer-managed keys. This key is used to encrypt all the data stored in that account.

> [!NOTE]
> Currently, customer-managed keys are available only for new Azure Cosmos DB accounts. You should configure them during account creation.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Register the Azure Cosmos DB resource provider

If the **Microsoft.DocumentDB** resource provider isn't already registered, you should register this provider as a first step.

1. Sign in to the [Azure portal](https://portal.azure.com/), go to your Azure subscription, and select **Resource providers** under the **Settings** tab:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/navigation-resource-providers.png" alt-text="Screenshot of the Resource providers option in the resource navigation menu.":::

1. Search for the **Microsoft.DocumentDB** resource provider. Verify if the resource provider is already marked as registered. If not, choose the resource provider and select **Register**:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/resource-provider-registration.png" lightbox="media/how-to-setup-customer-managed-keys/resource-provider-registration.png" alt-text="Screenshot of the Register option for the Microsoft.DocumentDB resource provider.":::

## Configure your Azure Key Vault instance

> [!IMPORTANT]
> Your Azure Key Vault instance must be accessible through public network access or allow trusted Microsoft services to bypass its firewall. An instance that is exclusively accessible through [private endpoints](../key-vault/general/private-link-service.md) cannot be used to host your customer-managed keys.

Using customer-managed keys with Azure Cosmos DB requires you to set two properties on the Azure Key Vault instance that you plan to use to host your encryption keys: **Soft Delete** and **Purge Protection**.

1. If you create a new Azure Key Vault instance, enable these properties during creation:

    :::image type="content" source="media/how-to-setup-customer-managed-keys/key-vault-properties.png" lightbox="media/how-to-setup-customer-managed-keys/key-vault-properties.png" alt-text="Screenshot of Azure Key Vault options including soft delete and purge protection.":::

1. If you're using an existing Azure Key Vault instance, you can verify that these properties are enabled by looking at the **Properties** section on the Azure portal. If any of these properties isn't enabled, see the "Enabling soft-delete" and "Enabling Purge Protection" sections in one of the following articles:

    - [How to use soft-delete with PowerShell](../key-vault/general/key-vault-recovery.md)
    - [How to use soft-delete with Azure CLI](../key-vault/general/key-vault-recovery.md)


### Choosing the preferred security model 

Once purge protection and soft-delete have been enabled, on the access policy tab, you can choose your preferred permission model to use. Access policies are set by default, but Azure role-based access control is supported as well.

The necessary permissions must be given for allowing Cosmos DB to use your encryption key. This step varies depending on whether the Azure Key Vault is using either Access policies or role-based access control.

> [!NOTE]
> It is important to note that only one security model can be active at a time, so there is no need to seed the role based access control if the Azure Key Vault is set to use access policies and vice versa)

### Add an access policy

In this variation, use the Azure Cosmos DB principal to create an access policy with the appropriate permissions.

1. From the Azure portal, go to the Azure Key Vault instance that you plan to use to host your encryption keys. Select **Access Policies** from the left menu:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/navigation-access-policies.png" alt-text="Screenshot of the Access policies option in the resource navigation menu.":::

1. Select **+ Add Access Policy**.

1. Under the **Key permissions** drop-down menu, select **Get**, **Unwrap Key**, and **Wrap Key** permissions:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/add-access-policy-permissions.png" lightbox="media/how-to-setup-customer-managed-keys/add-access-policy-permissions.png" alt-text="Screenshot of access policy permissions including Get, Unwrap key, and Wrap key.":::

1. Under **Select principal**, select **None selected**.

1. Search for **Azure Cosmos DB** principal and select it (to make it easier to find, you can also search by application ID: `a232010e-820c-4083-83bb-3ace5fc29d0b` for any Azure region except Azure Government regions where the application ID is `57506a73-e302-42a9-b869-6f12d9ec29e9`).

    > [!TIP]
    > This registers the Azure Cosmos DB first-party-identity in your Azure Key Vault access policy. If the **Azure Cosmos DB** principal isn't in the list, you might need to re-register the **Microsoft.DocumentDB** resource provider.

1. Choose **Select** at the bottom.

   :::image type="content" source="media/how-to-setup-customer-managed-keys/add-access-policy-principal.png" lightbox="media/how-to-setup-customer-managed-keys/add-access-policy-principal.png" alt-text="Screenshot of the Select principal option on the Add access policy page.":::

1. Select **Add** to add the new access policy.

1. Select **Save** on the Key Vault instance to save all changes.

### Adding role-based access control roles

1. From the Azure portal, go to the Azure Key Vault instance that you plan to use to host your encryption keys. Select **Access control (IAM)** from the left menu and select **Grant access to this resource**.

   :::image type="content" source="media/how-to-setup-customer-managed-keys/navigation-access-control.png" alt-text="Screenshot of the Access control option in the resource navigation menu.":::

   :::image type="content" source="media/how-to-setup-customer-managed-keys/access-control-grant-access.png" lightbox="media/how-to-setup-customer-managed-keys/access-control-grant-access.png" alt-text="Screenshot of the Grant access to this resource option on the Access control page.":::

1. Search the **“Key Vault Administrator role”** and assign it to yourself. This assignment is done by first searching the role name from the list and then clicking on the **“Members”** tab. Once on the tab, select the “User, group or service principal” option from the radio and then look up your Azure account. Once the account has been selected, the role can be assigned.

   :::image type="content" source="media/how-to-setup-customer-managed-keys/search-key-vault-admin-role.png" lightbox="media/how-to-setup-customer-managed-keys/search-key-vault-admin-role.png" alt-text="Screenshot of the Key vault administrator role in the search results.":::

   :::image type="content" source="media/how-to-setup-customer-managed-keys/access-control-assign-role.png" lightbox="media/how-to-setup-customer-managed-keys/access-control-assign-role.png" alt-text="Screenshot of a role assignment on the Access control page.":::

1. Then, the necessary permissions must be assigned to Cosmos DB’s principal. So, like the last role assignment, go to the assignment page but this time look for the **“Key Vault Crypto Service Encryption User”** role and on the members tab look for Cosmos DB’s principal. To find the principal, search for **Azure Cosmos DB** principal and select it.

   :::image type="content" source="media/how-to-setup-customer-managed-keys/assign-permission-principal.png" lightbox="media/how-to-setup-customer-managed-keys/assign-permission-principal.png" alt-text="Screenshot of the Azure Cosmos DB principal being assigned to a permission.":::

    > [!IMPORTANT]
    > In the Azure Government region, the application ID is `57506a73-e302-42a9-b869-6f12d9ec29e9`.

1. Select Review + assign and the role will be assigned to Cosmos DB.

## Validate that the roles have been set correctly

Next, use the access control page to confirm that all roles have been configured correctly.

1. Once the roles have been assigned, select **“View access to this resource”** on the Access Control IAM page to verify that everything has been set correctly.

   :::image type="content" source="media/how-to-setup-customer-managed-keys/access-control-view-access-resource.png" lightbox="media/how-to-setup-customer-managed-keys/access-control-view-access-resource.png" alt-text="Screenshot of the View access to resource option on the Access control page.":::

1. On the page, set the scope to **“this resource”** and verify that you have the Key Vault Administrator role, and the Cosmos DB principal has the Key Vault Crypto Encryption User role.

   :::image type="content" source="media/how-to-setup-customer-managed-keys/role-assignment-set-scope.png" lightbox="media/how-to-setup-customer-managed-keys/role-assignment-set-scope.png" alt-text="Screenshot of the scope adjustment option for a role assignment query.":::

## Generate a key in Azure Key Vault

Here, create a new key using Azure Key Vault and retrieve the unique identifier.

1. From the Azure portal, go the Azure Key Vault instance that you plan to use to host your encryption keys. Then, select **Keys** from the left menu:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/navigation-keys.png" alt-text="Screenshot of the Keys option in the resource navigation menu.":::

1. Select **Generate/Import**, provide a name for the new key, and select an RSA key size. A minimum of 3072 is recommended for best security. Then select **Create**:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/new-customer-managed-key.png" lightbox="media/how-to-setup-customer-managed-keys/new-customer-managed-key.png" alt-text="Screenshot of the dialog to create a new key.":::

1. After the key is created, select the newly created key and then its current version.

1. Copy the key's **Key Identifier**, except the part after the last forward slash:

   :::image type="content" source="media/how-to-setup-customer-managed-keys/key-identifier.png" lightbox="media/how-to-setup-customer-managed-keys/key-identifier.png" alt-text="Screenshot of the key identifier field and the copy action.":::

## Create a new Azure Cosmos DB account

Create a new Azure Cosmos DB account using the Azure portal or Azure CLI.

### [Azure portal](#tab/azure-portal)

When you create a new Azure Cosmos DB account from the Azure portal, choose **Customer-managed key** in the **Encryption** step. In the **Key URI** field, paste the URI/key identifier of the Azure Key Vault key that you copied from the previous step:

:::image type="content" source="media/how-to-setup-customer-managed-keys/configure-custom-managed-key-uri.png" lightbox="media/how-to-setup-customer-managed-keys/configure-custom-managed-key-uri.png" alt-text="Screenshot of the Encryption page with a custom-managed key URI configured.":::

### [PowerShell](#tab/azure-powershell)

When you create a new Azure Cosmos DB account with PowerShell:

- Pass the URI of the Azure Key Vault key copied earlier under the **keyVaultKeyUri** property in **PropertyObject**.

- Use **2019-12-12** or later as the API version.

> [!IMPORTANT]
> You must set the `locations` property explicitly for the account to be successfully created with customer-managed keys.

```azurepowershell
# Variable for resource group name
$RESOURCE_GROUP_NAME = "<resource-group-name>"

# Variable for location
$LOCATION = "<azure-region>"

# Variable for account name
$ACCOUNT_NAME = "<globally-unique-account-name>"

# Variable for key URI in the key vault
$KEY_VAULT_KEY_URI="https://<key-vault-name>.vault.azure.net/keys/<key-name>"

$parameters = @{
    ResourceType = "Microsoft.DocumentDb/databaseAccounts"
    ApiVersion = "2019-12-12"
    ResourceGroupName = $RESOURCE_GROUP_NAME
    Location = $LOCATION 
    Name = $ACCOUNT_NAME 
    PropertyObject = @{
        databaseAccountOfferType = "Standard"
        locations = @(
            @{ 
                locationName = $LOCATION 
                failoverPriority = 0
            }
        )
        keyVaultKeyUri = $KEY_VAULT_KEY_URI
    }
}
New-AzResource @parameters  
```

After the account has been created, you can verify that customer-managed keys have been enabled by fetching the URI of the Azure Key Vault key:

```azurepowershell
$parameters = @{
    ResourceGroupName = $RESOURCE_GROUP_NAME
    Name = $ACCOUNT_NAME
    ResourceType = "Microsoft.DocumentDb/databaseAccounts"
}
Get-AzResource @parameters
    | Select-Object -ExpandProperty Properties
    | Select-Object -ExpandProperty keyVaultKeyUri
```

### [Azure Resource Manager template](#tab/arm-template)

When you create a new Azure Cosmos DB account through an Azure Resource Manager template:

- Pass the URI of the Azure Key Vault key that you copied earlier under the **keyVaultKeyUri** property in the **properties** object.

- Use **2019-12-12** or later as the API version.

> [!IMPORTANT]
> You must set the `locations` property explicitly for the account to be successfully created with customer-managed keys.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "accountName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "keyVaultKeyUri": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "name": "[parameters('accountName')]",
      "apiVersion": "2019-12-12",
      "kind": "GlobalDocumentDB",
      "location": "[parameters('location')]",
      "properties": {
        "locations": [
          {
            "locationName": "[parameters('location')]",
            "failoverPriority": 0,
            "isZoneRedundant": false
          }
        ],
        "databaseAccountOfferType": "Standard",
        "keyVaultKeyUri": "[parameters('keyVaultKeyUri')]"
      }
    }
  ]
}
```

Deploy the template with the following PowerShell script:

```azurepowershell
# Variable for resource group name
$RESOURCE_GROUP_NAME = "<resource-group-name>"

# Variable for location
$LOCATION = "<azure-region>"

# Variable for account name
$ACCOUNT_NAME = "<globally-unique-account-name>"

# Variable for key URI in the key vault
$KEY_VAULT_KEY_URI="https://<key-vault-name>.vault.azure.net/keys/<key-name>"

$parameters = @{
    ResourceGroupName = $RESOURCE_GROUP_NAME
    TemplateFile = "deploy.json"
    accountName = $ACCOUNT_NAME
    location = $LOCATION
    keyVaultKeyUri = $KEY_VAULT_KEY_URI
}
New-AzResourceGroupDeployment @parameters
```

### [Azure CLI](#tab/azure-cli)

When you create a new Azure Cosmos DB account through the Azure CLI, pass the URI of the Azure Key Vault key that you copied earlier under the `--key-uri` parameter.

```azurecli
# Variable for resource group name
resourceGroupName="<resource-group-name>"

# Variable for location
location="<azure-region>"

# Variable for account name
accountName="<globally-unique-account-name>"

# Variable for key URI in the key vault
keyVaultKeyUri="https://<key-vault-name>.vault.azure.net/keys/<key-name>"

az cosmosdb create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --locations regionName=$location \
    --key-uri $keyVaultKeyUri
```

After the account has been created, you can verify that customer-managed keys have been enabled by fetching the URI of the Azure Key Vault key:

```azurecli
az cosmosdb show \
    --resource-group $resourceGroupName \
    --name $accountName \
    --query "keyVaultKeyUri"
```

---

## Using a managed identity in the Azure Key Vault access policy

This access policy ensures that your encryption keys can be accessed by your Azure Cosmos DB account. The access policy is implemented by granting access to a specific Azure Active Directory (AD) identity. Two types of identities are supported:

- Azure Cosmos DB's first-party identity can be used to grant access to the Azure Cosmos DB service.
- Your Azure Cosmos DB account's [managed identity](how-to-setup-managed-identity.md) can be used to grant access to your account specifically.

### [Azure Resource Manager template](#tab/arm-template)

You can use ARM templates to assign a managed identity to an access policy.

Because a system-assigned managed identity can only be retrieved after the creation of your account, you still need to initially create your account using the first-party identity. Then:

1. If the system-assigned managed identity wasn't configured during account creation, [enable a system-assigned managed identity](./how-to-setup-managed-identity.md#add-a-system-assigned-identity) on your account and copy the `principalId` that got assigned.

1. Add the correspondent permissions to your Azure Key Vault account as described previously. Instead of using the Cosmos DB principal, use the `principalId` you copied at the previous step instead of Azure Cosmos DB's first-party identity.

1. Update your Azure Cosmos DB account to specify that you want to use the system-assigned managed identity when accessing your encryption keys in Azure Key Vault.

    ```json
    {
      "type": " Microsoft.DocumentDB/databaseAccounts",
      "properties": {
        "defaultIdentity": "SystemAssignedIdentity",
        // ...
      },
      // ...
    }
    ```
  
1. Optionally, you can then remove the Azure Cosmos DB first-party identity from your Azure Key Vault access policy.

You can also follow similar steps with a user-assigned managed identity.

1. When creating the new access policy or role assignment in your Azure Key Vault account, use the `Object ID` of the managed identity you wish to use instead of Azure Cosmos DB's first-party identity.

1. When creating your Azure Cosmos DB account, you must enable the user-assigned managed identity and specify that you want to use this identity when accessing your encryption keys in Azure Key Vault.

    ```json
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
          "<identity-resource-id>": {}
        }
      },
      // ...
      "properties": {
        "defaultIdentity": "UserAssignedIdentity=<identity-resource-id>""keyVaultKeyUri": "<key-vault-key-uri>"
        // ...
      }
    }
    ```

### [Azure CLI](#tab/azure-cli)

You can use the Azure CLI to assign a managed identity to an access policy.

Because a system-assigned managed identity can only be retrieved after the creation of your account, you still need to initially create your account using the first-party identity. Then:

1. If the system-assigned managed identity wasn't configured during account creation, [enable a system-assigned managed identity](./how-to-setup-managed-identity.md#add-a-system-assigned-identity) on your account and copy the `principalId` that got assigned.

1. Add the correspondent permissions to your Azure Key Vault account as described previously. Instead of using the Cosmos DB principal, use the `principalId` you copied at the previous step instead of Azure Cosmos DB's first-party identity.

1. Update your Azure Cosmos DB account to specify that you want to use the system-assigned managed identity when accessing your encryption keys in Azure Key Vault.

    ```azurecli
    # Variables for resource group and account names
    resourceGroupName="<resource-group-name>"
    accountName="<azure-cosmos-db-account-name>"

    az cosmosdb update \
        --resource-group $resourceGroupName \
        --name $accountName \
        --default-identity "SystemAssignedIdentity"
    ```
  
1. Optionally, you can then remove the Azure Cosmos DB first-party identity from your Azure Key Vault access policy.

You can also follow similar steps with a user-assigned managed identity.

1. When creating the new access policy or role assignment in your Azure Key Vault account, use the `Object ID` of the managed identity you wish to use instead of Azure Cosmos DB's first-party identity.

1. When creating your Azure Cosmos DB account, you must enable the user-assigned managed identity and specify that you want to use this identity when accessing your encryption keys in Azure Key Vault.

    ```azurecli
    # Variables for resource group and account name
    resourceGroupName="<resource-group-name>"
    accountName="<azure-cosmos-db-account-name>"

    # Variable for location
    location="<azure-region>"

    # Variable for key URI in the key vault
    keyVaultKeyUri="https://<key-vault-name>.vault.azure.net/keys/<key-name>"

    # Variables for identities
    identityId="<identity-resource-id>"

    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --locations regionName=$location \
        --key-uri $keyVaultKeyUri
        --assign-identity $identityId \
        --default-identity "UserAssignedIdentity=$identityId"
    ```

### [PowerShell / Azure portal](#tab/azure-powershell+azure-portal)

Not available

---

## Use customer-managed keys with continuous backup

You can create a continuous backup account by using the Azure CLI or an Azure Resource Manager template.

Currently, only user-assigned managed identity is supported for creating continuous backup accounts.

Once the account has been created, you can update the identity to system-assigned managed identity.

> [!NOTE]
> System-assigned identity and continuous backup mode is currently under Public Preview and may change in the future.

Alternatively, user can also create a system identity with periodic backup mode first, then migrate the account to Continuous backup mode using these instructions [Migrate an Azure Cosmos DB account from periodic to continuous backup mode](./migrate-continuous-backup.md)

### [Azure CLI](#tab/azure-cli)

```azurecli
# Variables for resource group and account name
resourceGroupName="<resource-group-name>"
accountName="<azure-cosmos-db-account-name>"

# Variable for location
location="<azure-region>"

# Variable for key URI in the key vault
keyVaultKeyUri="https://<key-vault-name>.vault.azure.net/keys/<key-name>"

# Variables for identities
identityId="<identity-resource-id>"

az cosmosdb create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --locations regionName=$location \
    --key-uri $keyVaultKeyUri
    --assign-identity $identityId \
    --default-identity "UserAssignedIdentity=$identityId" \
    --backup-policy-type "Continuous"
```

### [Azure Resource Manager template](#tab/arm-template)

When you create a new Azure Cosmos DB account through an Azure Resource Manager template:

- Pass the URI of the Azure Key Vault key that you copied earlier under the **keyVaultKeyUri** property in the **properties** object.
- Use **2021-11-15** or later as the API version.

> [!IMPORTANT]
> You must set the `locations` property explicitly for the account to be successfully created with customer-managed keys as shown in the preceding example.

```json
{
  "type": "Microsoft.DocumentDB/databaseAccounts",
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "<identity-resource-id>": {}
    }
  },
  // ...
  "properties": {
    "backupPolicy": {
      "type": "Continuous"
    },
    "defaultIdentity": "UserAssignedIdentity=<identity-resource-id>""keyVaultKeyUri": "<key-vault-key-uri>"
    // ...
  }
}
```

### [PowerShell / Azure portal](#tab/azure-powershell+azure-portal)

Not available

---

## Restore a continuous account that is configured with managed identity

A user-assigned identity is required in the restore request because the source account managed identity (User-assigned and System-assigned identities) cannot be carried over automatically to the target database account.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI to restore a continuous account that is already configured using a system-assigned or user-assigned managed identity.

> [!NOTE]
> This feature is currently under Public Preview and requires Cosmos DB CLI Extension version 0.20.0 or higher.


1. Create a new user-assigned identity (or use an existing one) for the restore process.

1. Create the new access policy in your Azure Key Vault account as described previously, use the Object ID of the managed identity from step 1.

1. Trigger the restore using Azure CLI:

    ```azurecli
    # Variables for resource group and account names
    resourceGroupName="<resource-group-name>"
    sourceAccountName="<source-azure-cosmos-db-account-name>"
    targetAccountName="<target-azure-cosmos-db-account-name>"

    # Variable for location
    location="<azure-region>"

    # Variable for key URI in the key vault
    keyVaultKeyUri="https://<key-vault-name>.vault.azure.net/keys/<key-name>"
    
    # Variables for identities
    identityId="<identity-resource-id>"
    
    # Variable for timestamp to restore to
    timestamp="<timestamp-in-utc>"

    az cosmosdb restore \ 
        --resource-group $resourceGroupName \
        --account-name $sourceAccountName \
        --target-database-account-name $targetAccountName \
        --locations regionName=$location \
        --restore-timestamp $timestamp \
        --assign-identity $identityId \
        --default-identity "UserAssignedIdentity=$identityId" \
    ```

1. Once the restore has completed, the target (restored) account will have the user-assigned identity.  If desired, user can update the account to use System-Assigned managed identity.



### [PowerShell / Azure Resource Manager template / Azure portal](#tab/azure-powershell+arm-template+azure-portal)

Not available

---

## Customer-managed keys and double encryption

The data you store in your Azure Cosmos DB account when using customer-managed keys ends up being encrypted twice:

- Once through the default encryption performed with Microsoft-managed keys.
- Once through the extra encryption performed with customer-managed keys.

Double encryption only applies to the main Azure Cosmos DB transactional storage. Some features involve internal replication of your data to a second tier of storage where double encryption isn't provided, even with customer-managed keys. These features include:

- [Azure Synapse Link](./synapse-link.md)
- [Continuous backups with point-in-time restore](./continuous-backup-restore-introduction.md)

## Key rotation

Rotating the customer-managed key used by your Azure Cosmos DB account can be done in two ways.

- Create a new version of the key currently used from Azure Key Vault:

  :::image type="content" source="media/how-to-setup-customer-managed-keys/new-version.png" lightbox="media/how-to-setup-customer-managed-keys/new-version.png" alt-text="Screenshot of the New Version option in the Versions page of the Azure portal.":::

- Swap the key currently used with a different one by updating the key URI on your account. From the Azure portal, go to your Azure Cosmos DB account and select **Data Encryption** from the left menu:

    :::image type="content" source="media/how-to-setup-customer-managed-keys/navigation-data-encryption.png" alt-text="Screenshot of the Data Encryption option on the resource navigation menu.":::

    Then, replace the **Key URI** with the new key you want to use and select **Save**:

    :::image type="content" source="media/how-to-setup-customer-managed-keys/save-key-change.png" lightbox="media/how-to-setup-customer-managed-keys/save-key-change.png" alt-text="Screenshot of the Save option on the Key page.":::

    Here's how to do achieve the same result in PowerShell:

    ```azurepowershell
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "<resource-group-name>"
        
    # Variable for account name
    $ACCOUNT_NAME = "<globally-unique-account-name>"
    
    # Variable for new key URI in the key vault
    $NEW_KEY_VAULT_KEY_URI="https://<key-vault-name>.vault.azure.net/keys/<new-key-name>"
    
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME 
        Name = $ACCOUNT_NAME
        ResourceType = "Microsoft.DocumentDb/databaseAccounts"
    }
    $ACCOUNT = Get-AzResource @parameters
    
    $ACCOUNT.Properties.keyVaultKeyUri = $NEW_KEY_VAULT_KEY_URI
    
    $ACCOUNT | Set-AzResource -Force
    ```

The previous key or key version can be disabled after the [Azure Key Vault audit logs](../key-vault/general/logging.md) don't show activity from Azure Cosmos DB on that key or key version anymore. No more activity should take place on the previous key or key version after 24 hours of key rotation.

## Error handling

If there are any errors with customer-managed keys in Azure Cosmos DB, Azure Cosmos DB returns the error details along with an HTTP substatus code in the response. You can use the HTTP substatus code to debug the root cause of the issue. See the [HTTP Status Codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) article to get the list of supported HTTP substatus codes.

## Frequently asked questions

Included here are frequently asked questions about setting up customer-managed keys in Azure Cosmos DB.

### Are there more charges to enable customer-managed keys?

No, there's no charge to enable this feature.

### How do customer-managed keys influence capacity planning?

[Request Units](./request-units.md) consumed by your database operations see an increase to reflect the extra processing required to perform encryption and decryption of your data when using customer-managed keys. The extra RU consumption may lead to slightly higher utilization of your provisioned capacity. Use this table for guidance:

| Operation type | Request Unit increase |
|---|---|
| Point-reads (fetching items by their ID) | + 5% per operation |
| Any write operation | + 6% per operation &vert; Approximately + 0.06 RU per indexed property |
| Queries, reading change feed, or conflict feed | + 15% per operation |

### What data gets encrypted with the customer-managed keys?

All the data stored in your Azure Cosmos DB account is encrypted with the customer-managed keys, except for the following metadata:

- The names of your Azure Cosmos DB [accounts, databases, and containers](./resource-model.md#elements-in-an-azure-cosmos-db-account)

- The names of your [stored procedures](./stored-procedures-triggers-udfs.md)

- The property paths declared in your [indexing policies](./index-policy.md)

- The values of your containers' [partition keys](./partitioning-overview.md)

### Are customer-managed keys supported for existing Azure Cosmos DB accounts?

This feature is currently available only for new accounts.

### Is it possible to use customer-managed keys with the Azure Cosmos DB [analytical store](analytical-store-introduction.md)?

Yes, Azure Synapse Link only supports configuring customer-managed keys using your Azure Cosmos DB account's managed identity. You must use your Azure Cosmos DB account's managed identity in your Azure Key Vault access policy before [enabling Azure Synapse Link](configure-synapse-link.md#enable-synapse-link) on your account. For a how-to guide on how to enable managed identity and use it in an access policy, see [access Azure Key Vault from Azure Cosmos DB using a managed identity](access-key-vault-managed-identity.md).

### Is there a plan to support finer granularity than account-level keys?

Not currently, but container-level keys are being considered.

### How can I tell if customer-managed keys are enabled on my Azure Cosmos DB account?

From the Azure portal, go to your Azure Cosmos DB account and watch for the **Data Encryption** entry in the left menu; if this entry exists, customer-managed keys are enabled on your account:

:::image type="content" source="media/how-to-setup-customer-managed-keys/navigation-data-encryption.png" alt-text="Screenshot of the Data encryption option in the resource navigation menu.":::

You can also programmatically fetch the details of your Azure Cosmos DB account and look for the presence of the `keyVaultKeyUri` property.

### How do customer-managed keys affect periodic backups?

Azure Cosmos DB takes [regular and automatic backups](./online-backup-and-restore.md) of the data stored in your account. This operation backs up the encrypted data.

The following conditions are necessary to successfully restore a periodic backup:

- The encryption key that you used at the time of the backup is required and must be available in Azure Key Vault. This condition requires that no revocation was made and the version of the key that was used at the time of the backup is still enabled.
- If you used a system-assigned managed identity in the access policy, temporarily grant access to the Azure Cosmos DB first-party identity before restoring your data. This requirement exists because a system-assigned managed identity is specific to an account and can't be reused in the target account. Once the data is fully restored to the target account, you can set your desired identity configuration and remove the first-party identity from the Key Vault access policy.

### How do customer-managed keys affect continuous backups?

Azure Cosmos DB gives you the option to configure [continuous backups](./continuous-backup-restore-introduction.md) on your account. With continuous backups, you can restore your data to any point in time within the past 30 days. To use continuous backups on an account where customer-managed keys are enabled, you must use a user-assigned managed identity in the Key Vault access policy. Azure Cosmos DB first-party identities or system-assigned managed identities aren't currently supported on accounts using continuous backups.

The following conditions are necessary to successfully perform a point-in-time restore:

- The encryption key that you used at the time of the backup is required and must be available in Azure Key Vault. This requirement means that no revocation was made and the version of the key that was used at the time of the backup is still enabled.
- You must ensure that the user-assigned managed identity originally used on the source account is still declared in the Key Vault access policy.

> [!IMPORTANT]
> If you revoke the encryption key before deleting your account, your account's backup may miss the data written up to 1 hour before the revocation was made.

### How do I revoke an encryption key?

Key revocation is done by disabling the latest version of the key:

:::image type="content" source="media/how-to-setup-customer-managed-keys/revoke-key.png" lightbox="media/how-to-setup-customer-managed-keys/revoke-key.png" alt-text="Screenshot of a disabled custom key version.":::

Alternatively, to revoke all keys from an Azure Key Vault instance, you can delete the access policy granted to the Azure Cosmos DB principal:

:::image type="content" source="media/how-to-setup-customer-managed-keys/remove-access-policy.png" lightbox="media/how-to-setup-customer-managed-keys/remove-access-policy.png" alt-text="Screenshot of the Delete option for an access policy.":::

### What operations are available after a customer-managed key is revoked?

The only operation possible when the encryption key has been revoked is account deletion.

### Assign a new managed-identity to the restored database account to continue accessing or recover access to the database account

Steps to assign a new managed-identity:
1. [Create a new user-assigned managed identity.](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md#create-a-user-assigned-managed-identity)
2. [Grant KeyVault key access to this identity.](#choosing-the-preferred-security-model)
3. [Assign this new identity to your restored database account.](/cli/azure/cosmosdb/identity#az-cosmosdb-identity-assign)

## Next steps

- Learn more about [data encryption in Azure Cosmos DB](database-encryption-at-rest.md).
