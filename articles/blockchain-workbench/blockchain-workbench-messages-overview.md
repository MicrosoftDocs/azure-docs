---
title: Azure Blockchain Workbench messages overview
description: Overview of using messages in Azure Blockchain Workbench.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 4/16/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
---

# Azure Blockchain Workbench messages overview

You can use Azure Blockchain Workbench messaging API to integrate with other applications and systems. Developers can create Azure Message Bus applications to ingest data or perform actions in Blockchain Workbench. Service Bus is used for reliable message delivery. For example, ingesting messages from IoT devices into Service Bus.

Developers can register to be notified about events that happen in blockchain applications. Event notifications are available using Azure Service Bus or Azure Event Grid in your Workbench deployment. For example, you can use Event Grid to notify a logic app to perform a task based on a subscribed event.

For more information about the components of Azure Blockchain Workbench, see [Azure Blockchain Workbench architecture](blockchain-workbench-architecture.md).

## Ingestion

To ingest message data into Blockchain Workbench, you use Service Bus. In order to send messages to Service Bus, you need to create a Service Bus client. To get started developing a Service Bus client, see [Get started with Service Bus queues](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-dotnet-get-started-with-queues#3-send-messages-to-the-queue).

> [!IMPORTANT]
> Your Service Bus client requires an access key to the **activityhub** Service Bus in your Workbench deployment.

The following scenarios are examples of how you can use Service Bus in Blockchain Workbench.

## Create users

Use the `CreateUser` operation to create users. Send a message using the following values:

| Name | Type  | Description  |
|---------|---------|---------|
| OperationName | string | For creating users, set OperationName to `CreateUser` |
| RequestId | string | Request ID for tracking. Randomly generated unique ID (GUID) per request |
| UserId | string | The ID of the user. For example, the ObjectID of the user in Azure Active Directory |
| UserName | string | The name of the user. For example,  `DOMAIN\user` |

> [!NOTE]
> You can also use the [REST API to create users](https://review.docs.microsoft.com/en-us/rest/api/azure-blockchain-workbench/users/userspost?branch=master). 

## Create new contract instance

Use the `CreateWorkflowInstance` operation to create a new instance of a contract. Send a message using the following values:

| Name | Type  | Description  |
|---------|---------|---------|
| OperationName | string | For creating a new instance of a contract, set OperationName to `CreateWorkflowInstance`|
| RequestId | string | Request ID for tracking. Randomly generated unique ID (GUID) per request |
| WorkflowName | string | The name of the workflow to create a new instance of the contract. |
| LedgerImplementationBlobStorageURL | string | The URL to the ledger implementation. For example, a Solidity smart contract (.sol) file. |
| UserChainIdentifier | string | The identifier for the user on the chain. For example, an Ethereum address. |
| Parameters | object | A JSON list of key value pairs. |

> [!NOTE]
> You can also use the [REST API to create a contract instance](https://review.docs.microsoft.com/en-us/rest/api/azure-blockchain-workbench/workflowinstances/workflowinstancepost?branch=master).

## Take action on a contract 

Use the `CreateWorkflowInstanceAction` operation to take an action on a contract. Send a message using the following values:

| Name | Type  | Description  |
|---------|---------|---------|
| OperationName | string | For taking an action on a contract, set OperationName to `CreateWorkflowInstanceAction`|
| RequestId | string | Request ID for tracking. Randomly generated unique ID (GUID) per request |
| WorkflowInstanceActionId | int | The action ID defined in Blockchain Workbench database for the action to take. |
| ChainInstanceId | int | The chain instance ID from the Workbench database |
| LedgerImplementationBlobStorageURL | string | The URL to the ledger implementation. For example, a Solidity smart contract (.sol) file. |
| UserChainIdentifier | string | The identifier for the user on the chain. For example, an Ethereum address |
| WorkflowInstanceLedgerIdentifier | string | The identity of the contract on-chain For example, the smart contract address. |
| WorkflowFunctionName | string | The name of the function to call in the workflow |
| WorkflowName | string | The name of the workflow |
| WorkflowInstanceActionParameters | object | A JSON list of key value pairs. |

> [!NOTE]
> You can also use the [REST API to take an action on a contract](https://review.docs.microsoft.com/en-us/rest/api/azure-blockchain-workbench/workflowinstances/workflowinstanceactionpost?branch=master). 

## Events

Event notifications can be used to notify users of events that happen in Blockchain Workbench. Event notifications can also be used to trigger flow of data to downstream systems.

## Using Event grid for notifications

If a user wants to use Event Grid to be notified about events that happen in workbench, one example to consume events from Event Grid is by using Azure Functions. 

1. Create an **Azure Function App** in Azure portal.
2. Create a new function.
3. Locate the template for Event Grid. Basic template code for reading the message is shown. Modify the code as needed.
4. Save the Function. 
5. Select the Event Grid from Blockchain Workbench’s resource group.

See [Notification message reference](#notification-message-reference) for details of various messages that can be received.

## Using Service Bus for notifications

Service Bus Topics can be used to notify users about events that happen in Blockchain Workbench. 

1.	Browse to the Service Bus within the Workbench’s resource group.
2.	Select **Topics**.
3.	Select **workbench-external**.
4.	Create a new subscription to this topic. Obtain a key for it.
5.	Create a program, which subscribes to events from this subscription

See [Notification message reference](#notification-message-reference) for details of various messages that can be received.

## Notification message reference


###  Base Type for all messages

``` csharp
public class MessageModelBase
{
    public string OperationName { get; set; }
    public string RequestId { get; set; }
}
```
Depending on the OperationName, the notification messages have one of the following message types.
	
### AccountCreated

``` csharp
public class NewAccountRequest : MessageModelBase
{
    public int UserID { get; set; }
    public string ChainIdentifier { get; set; }
}
```

| Name    | Description  |
|----------|--------------|
| UserId  | ID of the user that was created |
| ChainIdentifier | Address of the user that was created on the blockchain network |

### ContractInsertedOrUpdated

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

### UpdateWorkflowInstanceAction

``` csharp
public class WorkflowInstanceActionRequest : MessageModelBase
{
    public int WorkflowInstanceActionId { get; set; }
    public int ChainInstanceId { get; set; }
    public string UserChainIdentifier { get; set; }
    public string WorkflowInstanceLedgerIdentifier { get; set; }
    public string WorkflowFunctionName { get; set; }
    public string WorkflowName { get; set; }
    public string WorkflowBlobStorageURL { get; set; }
    public IEnumerable<WorkflowInstanceActionParameter> WorkflowInstanceActionParameters { get; set; }
    public string TransactionHash { get; set; }
    public int ProvisioningStatus { get; set; }
}
```

### UpdateUserBalance

``` csharp
public class UpdateUserBalanceRequest : MessageModelBase
{
    public string Address { get; set; }
    public decimal Balance { get; set; }
    public int ChainID { get; set; }
}
```

### InsertBlock

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

### AssignWorkflowInstanceChainIdentifier

``` csharp
public class AssignWorkflowInstanceChainIdentifierRequest : MessageModelBase
{
    public int WorkflowInstanceId { get; set; }
    public string ChainIdentifier { get; set; }
}
```

## Next steps

* [Azure Blockchain Workbench architecture](blockchain-workbench-architecture.md)