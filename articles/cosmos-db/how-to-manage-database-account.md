---
title: Learn how to manage database accounts in Azure Cosmos DB
description: Learn how to manage database accounts in Azure Cosmos DB
services: cosmos-db
author: christopheranderson

ms.service: cosmos-db
ms.topic: sample
ms.date: 10/17/2018
ms.author: chrande
---

# Manage database accounts in Azure Cosmos DB

This article describes how to manage your Azure Cosmos DB account to set up multi-homing, add/remove a region, configure multiple write regions, and setup failover priorities. 

## Create a database account

### <a id="create-database-account-via-portal"></a>Azure portal

[!INCLUDE [cosmos-db-create-dbaccount](../../includes/cosmos-db-create-dbaccount.md)]

### <a id="create-database-account-via-cli"></a>Azure CLI

```bash
# Create an account
az cosmosdb create --name <Azure Cosmos account name> --resource-group <Resource Group Name>
```

## Configure clients for multi-homing

### <a id="configure-clients-multi-homing-dotnet"></a>.NET SDK

```csharp
// Create a new Connection Policy
ConnectionPolicy policy = new ConnectionPolicy
    {
        // Note: These aren't required settings for multi-homing,
        // just suggested defaults
        ConnectionMode = ConnectionMode.Direct,
        ConnectionProtocol = Protocol.Tcp,
        UseMultipleWriteLocations = true,
    };
// Add regions to Preferred locations
// The name of the location will match what you see in the portal/etc.
policy.PreferredLocations.Add("East US");
policy.PreferredLocations.Add("North Europe");

// Pass the Connection policy with the preferred locations on it to the client.
DocumentClient client = new DocumentClient(new Uri(this.accountEndpoint), this.accountKey, policy);
```

### <a id="configure-clients-multi-homing-java-async"></a>Java Async SDK

```java
ConnectionPolicy policy = new ConnectionPolicy();
policy.setPreferredLocations(Collections.singleton("West US"));
AsyncDocumentClient client =
        new AsyncDocumentClient.Builder()
                .withMasterKey(this.accountKey)
                .withServiceEndpoint(this.accountEndpoint)
                .withConnectionPolicy(policy).build();
```

### <a id="configure-clients-multi-homing-java-sync"></a>Java Sync SDK

```java
ConnectionPolicy connectionPolicy = new ConnectionPolicy();
Collection<String> preferredLocations = new ArrayList<String>();
preferredLocations.add("Australia East");
connectionPolicy.setPreferredLocations(preferredLocations);
DocumentClient client = new DocumentClient(accountEndpoint, accountKey, connectionPolicy);
```

### <a id="configure-clients-multi-homing-javascript"></a>Node.js/JavaScript/TypeScript SDK

```javascript
// Set up the connection policy with your preferred regions
const connectionPolicy: ConnectionPolicy = new ConnectionPolicy();
connectionPolicy.PreferredLocations = ["West US", "Australia East"];

// Pass that connection policy to the client
const client = new CosmosClient({
  endpoint: config.endpoint,
  auth: { masterKey: config.key },
  connectionPolicy
});
```

### <a id="configure-clients-multi-homing-python"></a>Python SDK

```python
connection_policy = documents.ConnectionPolicy()
connection_policy.PreferredLocations = ['West US', 'Japan West']
client = cosmos_client.CosmosClient(self.account_endpoint, {'masterKey': self.account_key}, connection_policy)

```

## Add/remove regions from your database account

### <a id="add-remove-regions-via-portal"></a>Azure portal

1. Navigate to your Azure Cosmos DB Account and open the **Replicate data globally** menu.

2. To add regions, select one or more regions from the map by clicking on the empty hexagons with the **"+"** label corresponding to your desired region. You can also add a region by selecting the **+ Add region** option and choose a region from the drop-down menu.

3. To remove regions, unselect one or more regions from the map by clicking on blue hexagons with a checkmark or select the "wastebasket" (🗑) icon next to the region on the right-hand side.

4. Click save to save your changes.

   ![Add/remove regions menu](./media/how-to-manage-database-account/add-region.png)

In single-region write mode, you cannot remove the write region. You must failover to a different region before deleting that current write region.

In multi-region write mode, you can add/remove any region as long as you have at least one region.

### <a id="add-remove-regions-via-cli"></a>Azure CLI

```bash
# Given an account created with 1 region like so
az cosmosdb create --name <Azure Cosmos account name> --resource-group <Resource Group name> --locations 'eastus=0'

# Add a new region by adding another region to the list
az cosmosdb update --name <Azure Cosmos account name> --resource-group <Resource Group name> --locations 'eastus=0 westus=1'

# Remove a region by removing a region from the list
az cosmosdb update --name <Azure Cosmos account name> --resource-group <Resource Group name> --locations 'westus=0'
```

## Configure multiple write-regions

### <a id="configure-multiple-write-regions-portal"></a>Azure portal

When you create a database account, make sure the **Multi-region Writes** setting is enabled.

![Azure Cosmos account creation screenshot](./media/how-to-manage-database-account/account-create.png)

### <a id="configure-multiple-write-regions-cli"></a>Azure CLI

```bash
az cosmosdb create --name <Azure Cosmos account name> --resource-group <Resource Group name> --enable-multiple-write-locations true
```

### <a id="configure-multiple-write-regions-arm"></a>Resource Manager template

The following JSON code is an example Resource Manager template. You can use it to deploy an Azure Cosmos account with a consistency policy as Bounded Staleness, a max staleness interval of 5 seconds, and maximum number of stale requests tolerated at 100. To learn about Resource Manager template format, and the syntax, see [Resource Manager](../azure-resource-manager/resource-group-authoring-templates.md) documentation.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "String"
        },
        "location": {
            "type": "String"
        },
        "locationName": {
            "type": "String"
        },
        "defaultExperience": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.DocumentDb/databaseAccounts",
            "kind": "GlobalDocumentDB",
            "name": "[parameters('name')]",
            "apiVersion": "2015-04-08",
            "location": "[parameters('location')]",
            "tags": {
                "defaultExperience": "[parameters('defaultExperience')]"
            },
            "properties": {
                "databaseAccountOfferType": "Standard",
                "consistencyPolicy": {
                    "defaultConsistencyLevel": "BoundedStaleness",
                    "maxIntervalInSeconds": 5,
                    "maxStalenessPrefix": 100
                },
                "locations": [
                    {
                        "id": "[concat(parameters('name'), '-', parameters('location'))]",
                        "failoverPriority": 0,
                        "locationName": "[parameters('locationName')]"
                    }
                ],
                "isVirtualNetworkFilterEnabled": false,
                "enableMultipleWriteLocations": true,
                "virtualNetworkRules": [],
                "dependsOn": []
            }
        }
    ]
}
```


## <a id="manual-failover"></a>Enable manual failover for your Azure Cosmos account

### <a id="enable-manual-failover-via-portal"></a>Azure portal

1. Navigate to your Azure Cosmos account and open the **"Replicate data globally"** menu.

2. Click the **"Manual Failover"** button at the top of the menu.

   ![Replicate data globally menu](./media/how-to-manage-database-account/replicate-data-globally.png)

3. On the **"Manual Failover"** menu, select your new write region, and select the box to mark that you understand this option will change your write region.

4. Click "Ok" to trigger the failover.

   ![Manual failover portal menu](./media/how-to-manage-database-account/manual-failover.png)

### <a id="enable-manual-failover-via-cli"></a>Azure CLI

```bash
# Given your account currently has regions with priority like so: 'eastus=0 westus=1'
# Change the priority order to trigger a failover of the write region
az cosmosdb update --name <Azure Cosmos account name> --resource-group <Resource Group name> --locations 'eastus=1 westus=0'
```

## <a id="automatic-failover"></a>Enable automatic failover for your Azure Cosmos account

### <a id="enable-automatic-failover-via-portal"></a>Azure portal

1. From your Azure Cosmos account, open the **"Replicate data globally"** pane. 

2. Click the **"Automatic Failover"** button at the top of the pane.

   ![Replicate data globally menu](./media/how-to-manage-database-account/replicate-data-globally.png)

3. On the **"Automatic Failover"** pane, make sure the **Enable Automatic Failover** is set to **ON**. 

4. Click save on the bottom of the menu.

   ![Automatic failover portal menu](./media/how-to-manage-database-account/automatic-failover.png)

You can also set your failover priorities on this menu.

### <a id="enable-automatic-failover-via-cli"></a>Azure CLI

```bash
# Enable automatic failover on account creation
az cosmosdb create --name <Azure Cosmos account name> --resource-group <Resource Group name> --enable-automatic-failover true

# Enable automatic failover on an existing account
az cosmosdb update --name <Azure Cosmos account name> --resource-group <Resource Group name> --enable-automatic-failover true

# Disable automatic failover on an existing account
az cosmosdb update --name <Azure Cosmos account name> --resource-group <Resource Group name> --enable-automatic-failover false
```

## Set failover priorities for your Azure Cosmos account

### <a id="set-failover-priorities-via-portal"></a>Azure portal

1. From your Azure Cosmos account, open the **"Replicate data globally"** pane. 

2. Click the **"Automatic Failover"** button at the top of the pane.

   ![Replicate data globally menu](./media/how-to-manage-database-account/replicate-data-globally.png)

3. On the **"Automatic Failover"** pane, make sure the **Enable Automatic Failover** is set to **ON**. 

4. You can modify the failover priority by clicking and dragging the read regions via the three dots on the left side of the row that appear when you hover over them. 

5. Click save on the bottom of the menu.

   ![Automatic failover portal menu](./media/how-to-manage-database-account/automatic-failover.png)

You cannot modify the write region on this menu. To change the write region manually, you must do a manual failover.

### <a id="set-failover-priorities-via-cli"></a>Azure CLI

```bash
az cosmosdb failover-priority-change --name <Azure Cosmos account name> --resource-group <Resource Group name> --failover-policies 'eastus=0 westus=2 southcentralus=1'
```

## Next steps

You can learn about managing consistency levels and data conflicts in Azure Cosmos DB using the following docs:

* [How to manage consistency](how-to-manage-consistency.md)
* [How to manage conflicts between regions](how-to-manage-conflicts.md)

