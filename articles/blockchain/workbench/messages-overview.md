---
title: Azure Blockchain Workbench messages integration overview
description: Overview of using messages in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 10/1/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: mmercuri
manager: femila
---

# Azure Blockchain Workbench messaging integration

In addition to providing a REST API, Azure Blockchain Workbench also provides messaging-based integration. Workbench publishes ledger-centric events via Azure Event Grid, enabling downstream consumers to ingest data or take action based on these events. For those clients that require reliable messaging, Azure Blockchain Workbench delivers messages to an Azure Service Bus endpoint as well.

Developers have also expressed interest in the ability to have external systems communicate initiate transactions to create users, create contracts, and update contracts on a ledger. While this functionality is not currently exposed in public preview, a sample that delivers that capability can be found at [http://aka.ms/blockchain-workbench-integration-sample](http://aka.ms/blockchain-workbench-integration-sample).

## Event notifications

Event notifications can be used to notify users and downstream systems of events that happen in Blockchain Workbench and the blockchain network it is connected to. Event notifications can be consumed directly in code or used with tools such as Logic Apps and Flow to trigger flow of data to downstream systems.

See [Notification message reference](#notification-message-reference)
for details of various messages that can be received.

### Consuming Event Grid events with Azure Functions

If a user wants to use Event Grid to be notified about events that happen in Blockchain Workbench, you can consume events from Event Grid by using Azure Functions.

1. Create an **Azure Function App** in the Azure portal.
2. Create a new function.
3. Locate the template for Event Grid. Basic template code for reading the message is shown. Modify the code as needed.
4. Save the Function. 
5. Select the Event Grid from Blockchain Workbench’s resource group.

### Consuming Event Grid events with Logic Apps

1.  Create a new **Azure Logic App** in the Azure portal.
2.  When opening the Azure Logic App in the portal, you will be prompted to select a trigger. Select **Azure Event Grid -- When a resource event occurs**.
3. When the workflow designer is displayed, you will be prompted to sign in.
4. Select the Subscription. Resource as **Microsoft.EventGrid.Topics**. Select the **Resource Name** from the name of the resource from the Azure Blockchain Workbench resource group.
5. Select the Event Grid from Blockchain Workbench's resource group.

## Using Service Bus Topics for notifications

Service Bus Topics can be used to notify users about events that happen in Blockchain Workbench. 

1.	Browse to the Service Bus within the Workbench’s resource group.
2.	Select **Topics**.
3.	Select **workbench-external**.
4.	Create a new subscription to this topic. Obtain a key for it.
5.	Create a program, which subscribes to events from this subscription.

### Consuming Service Bus Messages with Logic Apps

1. Create a new **Azure Logic App** in the Azure portal.
2. When opening the Azure Logic App in the portal, you will be prompted to select a trigger. Type **Service Bus** into the search box and select the trigger appropriate for the type of interaction you want to have with the Service Bus. For example, **Service Bus -- When a message is received in a topic subscription (auto-complete)**.
3. When the workflow designer is displayed, specify the connection information for the Service Bus.
4. Select your subscription and specify the topic of **workbench-external**.
5. Develop the logic for your application that utilizes the message from
this trigger.

## Notification message reference

Depending on the **OperationName**, the notification messages have one of the following message types.

### AccountCreated

Indicates that a new account has been requested to be added to the specified chain.

| Name    | Description  |
|----------|--------------|
| UserId  | ID of the user that was created. |
| ChainIdentifier | Address of the user that was created on the blockchain network. In Ethereum, this would be the user's **on-chain** address. |

``` csharp
public class NewAccountRequest : MessageModelBase
{
  public int UserID { get; set; }
  public string ChainIdentifier { get; set; }
}
```

### ContractInsertedOrUpdated

Indicates that a request has been made to insert or update a contract on a distributed ledger.

| Name | Description |
|-----|--------------|
| ChainID | A unique identifier for the chain associated with the request.|
| BlockId | The unique identifier for a block on the ledger.|
| ContractId | A unique identifier for the contract.|
| ContractAddress |       The address of the contract on the ledger.|
| TransactionHash  |     The hash of the transaction on the ledger.|
| OriginatingAddress |   The address of the originator of the transaction.|
| ActionName       |     The name of the action.|
| IsUpdate        |      Identifies if this is an update.|
| Parameters       |     A list of objects that identify the name, value, and data type of parameters sent to an action.|
| TopLevelInputParams |  In scenarios where a contract is connected to one or more other contracts, these are the parameters from the top-level contract. |

``` csharp
public class ContractInsertOrUpdateRequest : MessageModelBase
{
    public int ChainId { get; set; }
    public int BlockId { get; set; }
    public int ContractId { get; set; }
    public string ContractAddress { get; set; }
    public string TransactionHash { get; set; }
    public string OriginatingAddress { get; set; }
    public string ActionName { get; set; }
    public bool IsUpdate { get; set; }
    public List<ContractProperty> Parameters { get; set; }
    public bool IsTopLevelUpdate { get; set; }
    public List<ContractInputParameter> TopLevelInputParams { get; set; }
}
```

#### UpdateContractAction

Indicates that a request has been made to execution an action on a specific contract on a distributed ledger.

| Name                     | Description                                                                                                                                                                   |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ContractActionId         | The unique identifier for this contract action                                                                                                                                |
| ChainIdentifier          | The unique identifier for the chain                                                                                                                                           |
| ConnectionId             | The unique identifier for the connection                                                                                                                                      |
| UserChainIdentifier      | Address of the user that was created on the blockchain network. In Ethereum, this would be the user’s “on chain” address.                                                     |
| ContractLedgerIdentifier | Address of the contract on the ledger.                                                                                                                                        |
| WorkflowFunctionName     | Name of the workflow function.                                                                                                                                                |
| WorkflowName             | Name of the workflow.                                                                                                                                                         |
| WorkflowBlobStorageURL   | The url of the contract in blob storage.                                                                                                                                      |
| ContractActionParameters | Parameters for the contract action.                                                                                                                                           |
| TransactionHash          | The hash of the transaction on the ledger.                                                                                                                                    |
| Provisioning Status      | The current provisioning status of the action.</br>0 – Created</br>1 – In Process</br>2 – Complete</br> Complete indicates a confirmation from the ledger that this as been successfully added.                                               |
|                          |                                                                                                                                                                               |

```csharp
public class ContractActionRequest : MessageModelBase
{
    public int ContractActionId { get; set; }
    public int ConnectionId { get; set; }
    public string UserChainIdentifier { get; set; }
    public string ContractLedgerIdentifier { get; set; }
    public string WorkflowFunctionName { get; set; }
    public string WorkflowName { get; set; }
    public string WorkflowBlobStorageURL { get; set; }
    public IEnumerable<ContractActionParameter> ContractActionParameters { get; set; }
    public string TransactionHash { get; set; }
    public int ProvisioningStatus { get; set; }
}
```

### UpdateUserBalance

Indicates that a request has been made to update the user balance on a specific distributed ledger.

> [!NOTE]
> This message is generated only for those ledgers that require the funding of accounts.
> 

| Name    | Description                              |
|---------|------------------------------------------|
| Address | The address of the user that was funded. |
| Balance | The balance of the user balance.         |
| ChainID | The unique identifier for the chain.     |


``` csharp
public class UpdateUserBalanceRequest : MessageModelBase
{
    public string Address { get; set; }
    public decimal Balance { get; set; }
    public int ChainID { get; set; }
}
```

### InsertBlock

Message indicates that a request has been made to add a block on a distributed ledger.

| Name           | Description                                                            |
|----------------|------------------------------------------------------------------------|
| ChainId        | The unique identifier of the chain to which the block was added.             |
| BlockId        | The unique identifier for the block inside Azure Blockchain Workbench. |
| BlockHash      | The hash of the block.                                                 |
| BlockTimeStamp | The timestamp of the block.                                            |

``` csharp
public class InsertBlockRequest : MessageModelBase
{
    public int ChainId { get; set; }
    public int BlockId { get; set; }
    public string BlockHash { get; set; }
    public int BlockTimestamp { get; set; }
}
```

### InsertTransaction

Message provides details on a request to add a transaction on a distributed ledger.

| Name            | Description                                                            |
|-----------------|------------------------------------------------------------------------|
| ChainId         | The unique identifier of the chain to which the block was added.             |
| BlockId         | The unique identifier for the block inside Azure Blockchain Workbench. |
| TransactionHash | The hash of the transaction.                                           |
| From            | The address of the originator of the transaction.                      |
| To              | The address of the intended recipient of the transaction.              |
| Value           | The value included in the transaction.                                 |
| IsAppBuilderTx  | Identifies if this is a Blockchain Workbench transaction.                         |

``` csharp
public class InsertTransactionRequest : MessageModelBase
{
    public int ChainId { get; set; }
    public int BlockId { get; set; }
    public string TransactionHash { get; set; }
    public string From { get; set; }
    public string To { get; set; }
    public decimal Value { get; set; }
    public bool IsAppBuilderTx { get; set; }
}
```

### AssignContractChainIdentifier

Provides details on the assignment of a chain identifier for a contract. For example, in Ethereum blockchain, the address of a contract on the ledger.

| Name            | Description                                                                       |
|-----------------|-----------------------------------------------------------------------------------|
| ContractId      | This is the unique identifier for the contract inside Azure Blockchain Workbench. |
| ChainIdentifier | This is the identifier for the contract on the chain.                             |

``` csharp
public class AssignContractChainIdentifierRequest : MessageModelBase
{
    public int ContractId { get; set; }
    public string ChainIdentifier { get; set; }
}
```

## Classes used by message types

### MessageModelBase

The base model for all messages.

| Name          | Description                          |
|---------------|--------------------------------------|
| OperationName | The name of the operation.           |
| RequestId     | A unique identifier for the request. |

``` csharp
public class MessageModelBase
{
    public string OperationName { get; set; }
    public string RequestId { get; set; }
}
```

### ContractInputParameter

Contains the name, value and type of a parameter.

| Name  | Description                 |
|-------|-----------------------------|
| Name  | The name of the parameter.  |
| Value | The value of the parameter. |
| Type  | The type of the parameter.  |

``` csharp
public class ContractInputParameter
{
    public string Name { get; set; }
    public string Value { get; set; }
    public string Type { get; set; }
}
```

#### ContractProperty

Contains the ID, name, value and type of a property.

| Name  | Description                |
|-------|----------------------------|
| Id    | The ID of the property.    |
| Name  | The name of the property.  |
| Value | The value of the property. |
| Type  | The type of the property.  |

``` csharp
public class ContractProperty
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public string DataType { get; set; }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Smart contract integration patterns](integration-patterns.md)