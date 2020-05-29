---
title: Configure Blockchain Data Manager using Azure CLI - Azure Blockchain Service
description: Create and manage a Blockchain Data Manager for Azure Blockchain Service using Azure CLI
ms.date: 03/30/2020
ms.topic: article
ms.reviewer: ravastra
#Customer intent: As a network operator, I want to use Azure CLI to configure Blockchain Data Manager.
---
# Configure Blockchain Data Manager using Azure CLI

Configure Blockchain Data Manager for Azure Blockchain Service to capture blockchain data send it to an Azure Event Grid Topic.

To configure a Blockchain Data Manager instance, you:

* Create a Blockchain Manager instance
* Create an input to an Azure Blockchain Service transaction node
* Create an output to an Azure Event Grid Topic
* Add a blockchain application
* Start an instance

## Prerequisites

* Install the latest [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) and signed in using `az login`.
* Complete [Quickstart: Use Visual Studio Code to connect to a Azure Blockchain Service consortium network](connect-vscode.md). Azure Blockchain Service *Standard* tier is recommended when using Blockchain Data Manager.
* Create an [Event Grid Topic](../../event-grid/custom-event-quickstart-portal.md#create-a-custom-topic)
* Learn about [Event handlers in Azure Event Grid](../../event-grid/event-handlers.md)

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you prefer to install and use the CLI locally, this quickstart requires Azure CLI version 2.0.51 or later. Run `az --version` to find the version. If you need to install or upgrade, see [install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](https://docs.microsoft.com/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myRG --location eastus
```

## Create instance

A Blockchain Data Manager instance monitors an Azure Blockchain Service transaction node. An instance captures all raw block and raw transaction data from the transaction node. Blockchain Data Manager publishes a **RawBlockAndTransactionMsg** message which is a superset of information returned from web3.eth [getBlock](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#getblock) and [getTransaction](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#gettransaction) queries.

``` azurecli
az resource create \
                   --resource-group <Resource group> \
                   --name <Blockchain Data Manager instance name> \
                   --resource-type Microsoft.blockchain/watchers \
                   --is-full-object \
                   --properties <watcher resource properties>
```

| Parameter | Description |
|-----------|-------------|
| resource-group | Resource group name where to create the Blockchain Data Manager instance. |
| name | Name of the Blockchain Data Manager instance. |
| resource-type | The resource type for a Blockchain Data Manager instance is **Microsoft.blockchain/watchers**. |
| is-full-object | Indicates properties contain options for the watcher resource. |
| properties | JSON-formatted string containing properties for the watcher resource. Can be passed as a string or a file.  |

### Create instance examples

JSON configuration example to create a Blockchain Manager instance in the **East US** region.

``` json
{
    "location": "eastus",
    "properties": {
    }
}
```

| Element | Description |
|---------|-------------|
| location | Region where to create the watcher resource |
| properties | Properties to set when creating the watcher resource |

Create a Blockchain Data Manager instance named *mywatcher* using a JSON string for configuration.

``` azurecli-interactive
az resource create \
                    --resource-group myRG \
                    --name mywatcher \
                    --resource-type Microsoft.blockchain/watchers \
                     --is-full-object \
                     --properties '{"location":"eastus"}'
```

Create a Blockchain Data Manager instance named *mywatcher* using a JSON configuration file.

``` azurecli
az resource create \
                    --resource-group myRG \
                    --name mywatcher \
                    --resource-type Microsoft.blockchain/watchers \
                    --is-full-object \
                    --properties @watcher.json
```

## Create input

An input connects Blockchain Data Manager to an Azure Blockchain Service transaction node. Only users with access to the transaction node can create a connection.

``` azurecli
az resource create \
                   --resource-group <Resource group> \
                   --name <Input name> \
                   --namespace Microsoft.Blockchain \
                   --resource-type inputs \
                   --parent watchers/<Watcher name> \
                   --is-full-object \
                   --properties <input resource properties>
```

| Parameter | Description |
|-----------|-------------|
| resource-group | Resource group name where to create the input resource. |
| name | Name of the input. |
| namespace | Use the **Microsoft.Blockchain** provider namespace. |
| resource-type | The resource type for a Blockchain Data Manager input is **inputs**. |
| parent | The path to the watcher to which the input is associated. For example, **watchers/mywatcher**. |
| is-full-object | Indicates properties contain options for the input resource. |
| properties | JSON-formatted string containing properties for the input resource. Can be passed as a string or a file. |

### Input examples

Configuration JSON example to create an input resource in the *East US* region that is connected to \<Blockchain member\>.

``` json
{
    "location": "eastus",
    "properties": {
        "inputType": "Ethereum",
        "dataSource": {
            "resourceId": "/subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Blockchain/blockchainMembers/<Blockchain member>/transactionNodes/transaction-node"
        }
    }
}
```

| Element | Description |
|---------|-------------|
| location | Region where to create the input resource. |
| inputType | Ledger type of the Azure Blockchain Service member. Currently, **Ethereum** is supported. |
| resourceId | Transaction node to which the input is connected. Replace \<Subscription ID\>, \<Resource group\>, and \<Blockchain member\> with the values for the transaction node resource. The input connects to the default transaction node for the Azure Blockchain Service member. |

Create an input named *myInput* for *mywatcher* using a JSON string for configuration.

``` azurecli-interactive
az resource create \
                   --resource-group myRG \
                   --name myInput \
                   --namespace Microsoft.Blockchain \
                   --resource-type inputs \
                   --parent watchers/mywatcher \
                   --is-full-object \
                   --properties '{"location":"eastus", "properties":{"inputType":"Ethereum","dataSource":{"resourceId":"/subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Blockchain/BlockchainMembers/<Blockchain member>/transactionNodes/transaction-node"}}}'
```

Create an input named *myInput* for *mywatcher* using a JSON configuration file.

``` azurecli
az resource create \
                   --resource-group myRG \
                   --name input \
                   --namespace Microsoft.Blockchain \ --resource-type inputs \
                   --parent watchers/mywatcher \
                   --is-full-object \
                   --properties @input.json
```

## Create output

An outbound connection sends blockchain data to Azure Event Grid. You can send blockchain data to a single destination or send blockchain data to multiple destinations. Blockchain Data Manager supports multiple Event Grid Topic outbound connections for any given Blockchain Data Manager instance.

``` azurecli
az resource create \
                   --resource-group <Resource group> \
                   --name <Output name> \
                   --namespace Microsoft.Blockchain \
                   --resource-type outputs \
                   --parent watchers/<Watcher name> \
                   --is-full-object \
                   --properties <output resource properties>
```

| Parameter | Description |
|-----------|-------------|
| resource-group | Resource group name where to create the output resource. |
| name | Name of the output. |
| namespace | Use the **Microsoft.Blockchain** provider namespace. |
| resource-type | The resource type for a Blockchain Data Manager output is **outputs**. |
| parent | The path to the watcher to which the output is associated. For example, **watchers/mywatcher**. |
| is-full-object | Indicates properties contain options for the output resource. |
| properties | JSON-formatted string containing properties for the output resource. Can be passed as a string or a file. |

### Output examples

Configuration JSON example to create an output resource in the *East US* region that is connected to an event grid topic named \<event grid topic\>.

``` json
{
    "location": "eastus",
    "properties": {
        "outputType": "EventGrid",
        "dataSource": {
            "resourceId": "/subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.EventGrid/topics/<event grid topic>"
        }
    }
}
```

| Element | Description |
|---------|-------------|
| location | Region where to create the output resource. |
| outputType | Type of output. Currently, **EventGrid** is supported. |
| resourceId | Resource to which the output is connected. Replace \<Subscription ID\>, \<Resource group\>, and \<Blockchain member\> with the values for the event grid resource. |

Create an output named *myoutput* for *mywatcher* that connects to an event grid topic using a JSON configuration string.

``` azurecli-interactive
az resource create \
                   --resource-group myRG \
                   --name myoutput \
                   --namespace Microsoft.Blockchain \
                   --resource-type outputs \
                   --parent watchers/mywatcher \
                   --is-full-object \
                   --properties '{"location":"eastus","properties":{"outputType":"EventGrid","dataSource":{"resourceId":"/subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.EventGrid/topics/<event grid topic>"}}}'
```

Create an output named *myoutput* for *mywatcher* that connects to an event grid topic using a JSON configuration file.

``` azurecli
az resource create \
                   --resource-group myRG \
                   --name myoutput \
                   --namespace Microsoft.Blockchain \
                   --resource-type outputs \
                   --parent watchers/mywatcher \
                   --is-full-object \
                   --properties @output.json
```

## Add blockchain application

If you add a blockchain application, Blockchain Data Manager decodes event and property state for the application. Otherwise, only raw block and raw transaction data is sent. Blockchain Data Manager also discovers contract addresses when the contract is deployed. You can add multiple blockchain applications to a Blockchain Data Manager instance.


> [!IMPORTANT]
> Currently, blockchain applications that declare Solidity [array types](https://solidity.readthedocs.io/en/v0.5.12/types.html#arrays) or [mapping types](https://solidity.readthedocs.io/en/v0.5.12/types.html#mapping-types) are not fully supported. Properties declared as array or mapping types will not be decoded in *ContractPropertiesMsg* or *DecodedContractEventsMsg* messages.

``` azurecli
az resource create \
                   --resource-group <Resource group> \
                   --name <Application name> \
                   --namespace Microsoft.Blockchain \
                   --resource-type artifacts \
                   --parent watchers/<Watcher name> \
                   --is-full-object \
                   --properties <Application resource properties>
```

| Parameter | Description |
|-----------|-------------|
| resource-group | Resource group name where to create the application resource. |
| name | Name of the application. |
| namespace | Use the **Microsoft.Blockchain** provider namespace. |
| resource-type | The resource type for a Blockchain Data Manager application is **artifacts**. |
| parent | The path to the watcher to which the application is associated. For example, **watchers/mywatcher**. |
| is-full-object | Indicates properties contain options for the application resource. |
| properties | JSON-formatted string containing properties for the application resource. Can be passed as a string or a file. |

### Blockchain application examples

Configuration JSON example to create an application resource in the *East US* region that monitors a smart contract defined by the contract ABI and bytecode.

``` json
{
    "location": "eastus",
    "properties": {
        "artifactType": "EthereumSmartContract",
        "content": {
            "abiFileUrl": "<ABI URL>",
            "bytecodeFileUrl": "<Bytecode URL>",
            "queryTargetTypes": [
                "ContractProperties",
                "ContractEvents"
            ]
        }
    }
}
```

| Element | Description |
|---------|-------------|
| location | Region where to create the application resource. |
| artifactType | Type of application. Currently, **EthereumSmartContract** is supported. |
| abiFileUrl | URL for smart contract ABI JSON file. For more information on obtaining contract ABI and creating a URL, see [Get Contract ABI and bytecode](data-manager-portal.md#get-contract-abi-and-bytecode) and [Create contract ABI and bytecode URL](data-manager-portal.md#create-contract-abi-and-bytecode-url). |
| bytecodeFileUrl | URL for smart contract deployed bytecode JSON file. For more information on obtaining the smart contract deployed bytecode and creating a URL, see [Get Contract ABI and bytecode](data-manager-portal.md#get-contract-abi-and-bytecode) and [Create contract ABI and bytecode URL](data-manager-portal.md#create-contract-abi-and-bytecode-url). Note: Blockchain Data Manager requires the **deployed bytecode**. |
| queryTargetTypes | Published message types. Specifying **ContractProperties** publishes *ContractPropertiesMsg* message type. Specifying **ContractEvents** publishes *DecodedContractEventsMsg* message type. Note: *RawBlockAndTransactionMsg* and *RawTransactionContractCreationMsg* message types are always published. |

Create an application named *myApplication* for *mywatcher* that monitors a smart contract defined by a JSON string.

``` azurecli-interactive
az resource create \
                   --resource-group myRG \
                   --name myApplication \
                   --namespace Microsoft.Blockchain \
                   --resource-type artifacts \
                   --parent watchers/mywatcher \
                   --is-full-object \
                   --properties '{"location":"eastus","properties":{"artifactType":"EthereumSmartContract","content":{"abiFileUrl":"<ABI URL>","bytecodeFileUrl":"<Bytecode URL>","queryTargetTypes":["ContractProperties","ContractEvents"]}}}'
```

Create an application named *myApplication* for *mywatcher* that watches a smart contract defined using a JSON configuration file.

``` azurecli
az resource create \
                   --resource-group myRG \
                   --name myApplication \
                   --namespace Microsoft.Blockchain \
                   --resource-type artifacts \
                   --parent watchers/mywatcher \
                   --is-full-object \
                   --properties @artifact.json
```

## Start instance

When running, a Blockchain Manager instance monitors blockchain events from the defined inputs and sends data to the defined outputs.

``` azurecli
az resource invoke-action \
                          --action start \
                          --ids /subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Blockchain/watchers/<Watcher name>
```

| Parameter | Description |
|-----------|-------------|
| action | Use **start** to run the watcher. |
| ids | Watcher resource ID. Replace \<Subscription ID\>, \<Resource group\>, and \<Watcher name\> with the values for the watcher resource.|

### Start instance example

Start a Blockchain Data Manager instance named *mywatcher*.

``` azurecli-interactive
az resource invoke-action \
                          --action start \
                          --ids /subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Blockchain/watchers/mywatcher
```

## Stop instance

Stop a Blockchain Data Manager instance.

``` azurecli
az resource invoke-action \
                          --action stop \
                          --ids /subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Blockchain/watchers/<Watcher name>
```

| Parameter | Description |
|-----------|-------------|
| action | Use **stop** to stop the watcher. |
| ids | Name of the watcher. Replace \<Subscription ID\>, \<Resource group\>, and \<Watcher name\> with the values for the watcher resource. |

### Stop watcher example

Stop an instance named *mywatcher*.

``` azurecli-interactive
az resource invoke-action \
                          --action stop \
                          --ids /subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Blockchain/watchers/mywatcher
```

## Delete instance

Delete a Blockchain Data Manager instance.

``` azurecli
az resource delete \
                   --resource-group <Resource group> \
                   --name <Watcher name> \
                   --resource-type Microsoft.Blockchain/watchers
```

| Parameter | Description |
|-----------|-------------|
| resource-group | Resource group name of the watcher to delete. |
| name | Name of the watcher to delete. |
| resource-type | The resource type for a Blockchain Data Manager watcher is **Microsoft.blockchain/watchers**. |

### Delete instance example

Delete an instance named *mywatcher* in the *myRG* resource group.

``` azurecli-interactive
az resource delete \
                   --resource-group myRG \
                   --name mywatcher \
                   --resource-type Microsoft.blockchain/watchers
```

## Next steps

Try the next tutorial creating a blockchain transaction message explorer using Blockchain Data Manager and Azure Cosmos DB.

> [!div class="nextstepaction"]
> [Use Blockchain Data Manager to send data to Azure Cosmos DB](data-manager-cosmosdb.md)
