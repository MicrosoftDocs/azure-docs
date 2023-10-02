---
title: Self-serve minimum tls version enforcement in Azure Cosmos DB
titleSuffix: Azure Cosmos DB
description: Learn how to self-serve minimum TLS version enforcement for your Azure Cosmos DB account to improve your security posture.
author: dileepraotv-github
ms.author: turao
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 01/18/2023
---

# Self-serve minimum TLS version enforcement in Azure Cosmos DB

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

This article discusses how to enforce a minimum version of the TLS protocol for your Cosmos DB account, using a self-service API.

## How minimum TLS version enforcement works in Azure Cosmos DB

Because of the multi-tenant nature of Cosmos DB, the service is required to meet the access and security needs of every user. To achieve this, **Cosmos DB enforces minimum TLS protocols at the application layer**, and not lower layers in the network stack where TLS operates. This enforcement occurs on any authenticated request to a specific database account, according to the settings set on that account by the customer.

The **minimum service-wide accepted version is TLS 1.0**. This selection can be changed on a per account basis, as discussed in the following section. 

## How to set the minimum TLS version for my Cosmos DB database account

Starting with the [2022-11-15 API version of the Azure Cosmos DB Resource Provider API](), a new property is exposed for every Cosmos DB database account, called `minimalTlsVersion`. It accepts one of the following values:
- `Tls` for setting the minimum version to TLS 1.0.
- `Tls11` for setting the minimum version to TLS 1.1.
- `Tls12` for setting the minimum version to TLS 1.2.

The **default value for new and existing accounts is `Tls`**.

> [!IMPORTANT]
> Staring on April 1st, 2023, the **default value for new accounts will be switched to `Tls12`**.

### Set Minimal TLS Protocol in Azure Cosmos DB using the Portal 

This self-serve feature is available in the Portal while creating and editing an account. Azure Cosmos DB Accounts enforce the TLS 1.2 protocol. However, Azure Cosmos DB also supports the following TLS protocols depending on the API kind selected.

- **MongoDB:** TLS 1.2

- **Cassandra:** TLS 1.2

- **Table, SQL and Graph:** TLS 1.0, TLS 1.1 and TLS 1.2

  

### Steps to set Minimal TLS Protocol while creating an account

If you're using an API Kind that only supports TLS 1.2, you'll notice in the Networking tab at the bottom the TLS protocol disabled.

:::image type="content" source="media/self-serve-minimum-tls-enforcement/tls-create-account.png" alt-text="Screenshot of API Kind that only supports TLS 1.2.":::



If you're using an API Kind that accepts multiple TLS protocols, then you can navigate to the Networking tab and the Minimum Transport Layer Security Protocol option is available. You can change the selected protocol by just clicking on the dropdown and selecting the desired protocol.

:::image type="content" source="media/self-serve-minimum-tls-enforcement/tls-select-account.png" alt-text="Screenshot of API Kind that accepts multiple TLS protocols.":::


After setting up your account, you can review in the Review + create tab, at the bottom inside the Networking section, that the selected TLS Protocol is set as you specified.

:::image type="content" source="media/self-serve-minimum-tls-enforcement/summary.png" alt-text="Screenshot of selected TLS Protocol is set as you specified.":::


### Steps to set the Minimal TLS Protocol while editing an account

1. Navigate to your Azure Cosmos DB account on the Azure portal.

2. Select Networking from the left menu, then select the Connectivity tab.

3. You'll find the Minimum Transport Layer Security Protocol option. If you're using an API Kind that only supports TLS 1.2, you'll notice this option disabled. Otherwise, you'll be able to select the desired TLS Protocol by just clicking on it.


  :::image type="content" source="media/self-serve-minimum-tls-enforcement/edit.png" alt-text="Screenshot of minimum transport layer security protocol option.":::

 
4. Click Save once you changed the TLS protocol.

  :::image type="content" source="media/self-serve-minimum-tls-enforcement/save.png" alt-text="Screenshot of save after change.":::

 
5. Once it is saved, you'll receive a success notification. Still, this change can take up to 15 minutes to take effect after the configuration update is completed.

  :::image type="content" source="media/self-serve-minimum-tls-enforcement/notification-success.png" alt-text="Screenshot of success notification.":::

 

### Set via Azure CLI

To set using Azure CLI, use the command:

```azurecli-interactive
subId=$(az account show --query id -o tsv)
rg="myresourcegroup"
dbName="mycosmosdbaccount"
minimalTlsVersion="Tls12"
az rest --uri "/subscriptions/$subId/resourceGroups/$rg/providers/Microsoft.DocumentDB/databaseAccounts/$dbName?api-version=2022-11-15" --method PATCH  --body "{ 'properties': { 'minimalTlsVersion': '$minimalTlsVersion' } }" --headers "Content-Type=application/json"
```

### Set via Azure PowerShell

To set using Azure PowerShell, use the command:

```azurepowershell-interactive
$minimalTlsVersion = 'Tls12'
$patchParameters = @{
  ResourceGroupName = 'myresourcegroup'
  Name = 'mycosmosdbaccount'
  ResourceProviderName = 'Microsoft.DocumentDB'
  ResourceType = 'databaseaccounts'
  ApiVersion = '2022-11-15'
  Payload = "{ 'properties': {
      'minimalTlsVersion': '$minimalTlsVersion'
  } }"
  Method = 'PATCH'
}
Invoke-AzRestMethod @patchParameters
```

### Set via ARM template

To set this property using an ARM template, update your existing template or export a new template for your current deployment, then add `"minimalTlsVersion"` to the properties for the `databaseAccounts` resources, with the desired minimum TLS version value. Provided here is a basic example of an Azure Resource Manager template with this property setting, using a parameter.

```json
{
    {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "name": "mycosmosdbaccount",
      "apiVersion": "2022-11-15",
      "location": "[parameters('location')]",
      "kind": "GlobalDocumentDB",
      "properties": {
        "consistencyPolicy": {
          "defaultConsistencyLevel": "[parameters('defaultConsistencyLevel')]",
          "maxStalenessPrefix": 1,
          "maxIntervalInSeconds": 5
        },
        "locations": [
          {
            "locationName": "[parameters('location')]",
            "failoverPriority": 0
          }
        ],
        "locations": "[variable('locations')]",
        "databaseAccountOfferType": "Standard",
        "minimalTlsVersion": "[parameters('minimalTlsVersion')]",
      }
    }
}
```

> [!IMPORTANT]
> Make sure you include the other properties for your account and child resources when redeploying with this property. Do not deploy this template as is or it will reset all of your account properties.

### For new accounts

You can create accounts with the `minimalTlsVersion` property set by using the ARM template above, or by changing the PATCH method to a PUT on either Azure CLI or Azure PowerShell. Make sure to include the other properties for your account.

> [!IMPORTANT]
> If the account exists and the `minimalTlsVersion` property is ommited in a PUT request, then the property will reset to its default value, starting with the 2022-11-15 API version.

## How to verify minimum TLS version enforcement

Because Cosmos DB enforces the minimum TLS version at the application layer, conventional TLS scanners that check whether handshakes are accepted by the service for a specific TLS version are unreliable to test enforcement in Cosmos DB. To verify enforcement, refer to the [official open-source cosmos-tls-scanner tool](https://github.com/Azure/cosmos-tls-scanner/).

You can also get the current value of the `minimalTlsVersion` property by using Azure CLI or Azure PowerShell.

### Get current value via Azure CLI

To get the current value of the property using Azure CLI, run the command:

```azurecli-interactive
subId=$(az account show --query id -o tsv)
rg="myresourcegroup"
dbName="mycosmosdbaccount"
az rest --uri "/subscriptions/$subId/resourceGroups/$rg/providers/Microsoft.DocumentDB/databaseAccounts/$dbName?api-version=2022-11-15" --method GET
```

### Get current value via Azure PowerShell

To get the current value of the property using Azure PowerShell, run the command:

```azurepowershell-interactive
$getParameters = @{
  ResourceGroupName = 'myresourcegroup'
  Name = 'mycosmosdbaccount'
  ResourceProviderName = 'Microsoft.DocumentDB'
  ResourceType = 'databaseaccounts'
  ApiVersion = '2022-11-15'
  Method = 'GET'
}
Invoke-AzRestMethod @getParameters
```

## Next steps

For more information about security in Azure Cosmos DB, see [Overview of database security in Azure Cosmos DB
](./database-security.md).
