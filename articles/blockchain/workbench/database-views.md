---
title: Database views in Azure Blockchain Workbench
description: Overview of Azure Blockchain Workbench SQL DB database views.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 05/28/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: mmercuri
manager: femila
---
# Database views in Azure Blockchain Workbench

Azure Blockchain Workbench delivers data from distributed ledgers to an *off-chain* SQL DB database. The off-chain database makes it possible to use SQL and existing tools, such as [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017), to interact with blockchain data.

Azure Blockchain Workbench provides a set of database views that provide access to data that will be helpful when performing your queries. These views are heavily denormalized to make it easy to quickly get started building reports, analytics, and otherwise consume blockchain data with existing tools and without having to retrain database staff.

This section includes an overview of the database views and the data they contain.

> [!NOTE]
> Any direct usage of database tables found in the database outside of these views, while possible, is not supported.
>

## vwApplication

This view provides details on **Applications** that have been uploaded to Azure Blockchain Workbench.

| Name                             | Type          | Can Be Null | Description                                                                                                                                                                                                                                                   |
|----------------------------------|---------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                    | int           | No          | A unique identifier for the application |
| ApplicationName                  | nvarchar(50)  | No          | The name of the application |
| ApplicationDescription           | nvarchar(255) | Yes         | A description of the application |
| ApplicationDisplayName           | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled               | bit           | No          | Identifies if the application is currently enabled<br /> **Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database. |
| UploadedDtTm                     | datetime2(7)  | No          | The date and time a contract was uploaded |
| UploadedByUserId                 | int           | No          | The ID of the user who uploaded the application |
| UploadedByUserExternalId         | nvarchar(255) | No          | The external identifier for the user who uploaded the application. By default, this ID is the user from the Azure Active Directory for the consortium.                                                                                                |
| UploadedByUserProvisioningStatus | int           | No          | Identifies the current status of provisioning process for the user. Possible values are: <br />0 – User has been created by the API<br />1 – A key has been associated with the user in the database<br />2 – The user is fully provisioned                         |
| UploadedByUserFirstName          | nvarchar(50)  | Yes         | The first name of the user who uploaded the contract |
| UploadedByUserLastName           | nvarchar(50)  | Yes         | The last name of the user who uploaded the contract |
| UploadedByUserEmailAddress       | nvarchar(255) | Yes         | The email address of the user who uploaded the contract |

## vwApplicationRole

This view provides details on the roles that have been defined in Azure Blockchain Workbench applications.

In an *Asset Transfer* application, for example, roles such as *Buyer* and *Seller* roles may be defined.

| Name                   | Type             | Can Be Null | Description                                       |
|------------------------|------------------|-------------|---------------------------------------------------|
| ApplicationId          | int              | No          | A unique identifier for the application           |
| ApplicationName        | nvarchar(50)     | No          | The name of the application                       |
| ApplicationDescription | nvarchar(255)    | Yes         | A description of the application                  |
| ApplicationDisplayName | nvarchar(255)    | No          | The name to be displayed in a user interface      |
| RoleId                 | int              | No          | A unique identifier for a role in the application |
| RoleName               | nvarchar50)      | No          | The name of the role                              |
| RoleDescription        | description(255) | Yes         | A description of the role                         |

## vwApplicationRoleUser

This view provides details on the roles that have been defined in Azure Blockchain Workbench applications and the users associated with them.

In an *Asset Transfer* application, for example, *John Smith* may be associated with the *Buyer* role.

| Name                       | Type          | Can Be Null | Description                                                                                                                                                                                                                           |
|----------------------------|---------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId              | int           | No          | A unique identifier for the application                                                                                                                                                                                               |
| ApplicationName            | nvarchar(50)  | No          | The name of the application                                                                                                                                                                                                           |
| ApplicationDescription     | nvarchar(255) | Yes         | A description of the application                                                                                                                                                                                                      |
| ApplicationDisplayName     | nvarchar(255) | No          | The name to be displayed in a user interface                                                                                                                                                                                          |
| ApplicationRoleId          | int           | No          | A unique identifier for a role in the application                                                                                                                                                                                     |
| ApplicationRoleName        | nvarchar50)   | No          | The name of the role                                                                                                                                                                                                                  |
| ApplicationRoleDescription | nvarchar(255) | Yes         | A description of the role                                                                                                                                                                                                             |
| UserId                     | int           | No          | The ID of the user associated with the role |
| UserExternalId             | nvarchar(255) | No          | The external identifier for the user who is associated with the role. By default, this ID is the user from the Azure Active Directory for the consortium.                                                                     |
| UserProvisioningStatus     | int           | No          | Identifies the current status of provisioning process for the user. Possible values are: <br />0 – User has been created by the API<br />1 – A key has been associated with the user in the database<br />2 – The user is fully provisioned |
| UserFirstName              | nvarchar(50)  | Yes         | The first name of the user who is associated with the role |
| UserLastName               | nvarchar(255) | Yes         | The last name of the user who is associated with the role |
| UserEmailAddress           | nvarchar(255) | Yes         | The email address of the user who is associated with the role |

## vwConnectionUser

This view provides details on the connections defined in Azure Blockchain Workbench and the users associated with them. For each connection, this view contains the following data:

-   Associated ledger details
-   Associated user information

| Name                     | Type          | Can Be Null | Description                                                                                                                                                                                                                           |
|--------------------------|---------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ConnectionId             | int           | No          | The unique identifier for a connection in Azure Blockchain Workbench |
| ConnectionEndpointUrl    | nvarchar(50)  | No          | The endpoint url for a connection |
| ConnectionFundingAccount | nvarchar(255) | Yes         | The funding account associated with a connection, if applicable |
| LedgerId                 | int           | No          | The unique identifier for a ledger |
| LedgerName               | nvarchar(50)  | No          | The name of the ledger |
| LedgerDisplayName        | nvarchar(255) | No          | The name of the ledger to display in the UI |
| UserId                   | int           | No          | The ID of the user associated with the connection |
| UserExternalId           | nvarchar(255) | No          | The external identifier for the user who is associated with the connection. By default, this ID is the user from the Azure Active Directory for the consortium. |
| UserProvisioningStatus   | int           | No          |Identifies the current status of provisioning process for the user. Possible values are: <br />0 – User has been created by the API<br />1 – A key has been associated with the user in the database<br />2 – The user is fully provisioned |
| UserFirstName            | nvarchar(50)  | Yes         | The first name of the user who is associated with the connection |
| UserLastName             | nvarchar(255) | Yes         | The last name of the user who is associated with the connection |
| UserEmailAddress         | nvarchar(255) | Yes         | The email address of the user who is associated with the connection |

## vwContract

This view provides details about deployed contracts. For each contract, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Associated ledger implementation for the function
-   Details for the user who initiated the action
-   Details related to the blockchain block and transaction

| Name                                     | Type           | Can Be Null | Description                                                                                                                                                                                                                                                   |
|------------------------------------------|----------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ConnectionId                             | int            | No          | The unique identifier for a connection in Azure Blockchain Workbench.                                                                                                                                                                                         |
| ConnectionEndpointUrl                    | nvarchar(50)   | No          | The endpoint url for a connection |
| ConnectionFundingAccount                 | nvarchar(255)  | Yes         | The funding account associated with a connection, if applicable |
| LedgerId                                 | int            | No          | The unique identifier for a ledger |
| LedgerName                               | nvarchar(50)   | No          | The name of the ledger |
| LedgerDisplayName                        | nvarchar(255)  | No          | The name of the ledger to display in the UI |
| ApplicationId                            | int            | No          | A unique identifier for the application |
| ApplicationName                          | nvarchar (50)  | No          | The name of the application |
| ApplicationDisplayName                   | nvarchar (255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled                       | bit            | No          | Identifies if the application is currently enabled.<br /> **Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database.  |
| WorkflowId                               | int            | No          | A unique identifier for the workflow associated with a contract |
| WorkflowName                             | nvarchar(50)   | No          | The name of the workflow associated with a contract |
| WorkflowDisplayName                      | nvarchar(255)  | No          | The name of the workflow associated with the contract displayed in the user interface |
| WorkflowDescription                      | nvarchar(255)  | Yes         | The description of the workflow associated with a contract |
| ContractCodeId                           | int            | No          | A unique identifier for the contract code associated with the contract |
| ContractFileName                         | int            | No          | The name of the file containing the smart contract code for this workflow. |
| ContractUploadedDtTm                     | int            | No          | The date and time the contract code was uploaded |
| ContractId                               | int            | No          | The unique identifier for the contract |
| ContractProvisioningStatus               | int            | No          | Identifies the current status of the provisioning process for the contract. Possible values are: <br />0 – The contract has been created by the API in the database<br />1 – The contract has been sent to the ledger<br />2 – The contract has been successfully deployed to the ledger<br />3 or 4 - The contract failed to be deployed to the ledger<br />5 - The contract was successfully deployed to the ledger <br /><br />Beginning with version 1.5, values 0 through 5 are supported. For backwards compatibility in the current release, view **vwContractV0** is available that only supports values 0 through 2. |
| ContractLedgerIdentifier                 | nvarchar (255) |             | The email address of the user who deployed the contract |
| ContractDeployedByUserId                 | int            | No          | An external identifier for the user who deployed the contract. By default, this ID is the guid representing the Azure Active Directory ID for the user.                                                                                                          |
| ContractDeployedByUserExternalId         | nvarchar(255)  | No          | An external identifier for the user that deployed the contract. By default, this ID is the guid representing the Azure Active Directory ID for the user.                                                                                                         |
| ContractDeployedByUserProvisioningStatus | int            | No          | Identifies the current status of the provisioning process for the user. Possible values are: <br />0 – user has been created by the API<br />1 – A key has been associated with the user in the database <br />2 – The user is fully provisioned                     |
| ContractDeployedByUserFirstName          | nvarchar(50)   | Yes         | The first name of the user who deployed the contract |
| ContractDeployedByUserLastName           | nvarchar(255)  | Yes         | The last name of the user who deployed the contract |
| ContractDeployedByUserEmailAddress       | nvarchar(255)  | Yes         | The email address of the user who deployed the contract |

## vwContractAction

This view represents the majority of information related to actions taken on contracts and is designed to readily facilitate common reporting scenarios. For each action taken, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Associated smart contract function and parameter definition
-   Associated ledger implementation for the function
-   Specific instance values provided for parameters
-   Details for the user who initiated the action
-   Details related to the blockchain block and transaction

| Name                                     | Type          | Can Be Null | Description                                                                                                                                                                                                                                                                                                    |
|------------------------------------------|---------------|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                            | int           | No          | A unique identifier for the application |
| ApplicationName                          | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName                   | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled                       | bit           | No          | This field identifies if the application is currently enabled. Note – Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database.                                                  |
| WorkflowId                               | int           | No          | A unique identifier for a workflow |
| WorkflowName                             | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName                      | nvarchar(255) | No          | The name of the workflow to display in a user interface |
| WorkflowDescription                      | nvarchar(255) | Yes         | The description of the workflow |
| ContractId                               | int           | No          | A unique identifier for the contract |
| ContractProvisioningStatus               | int           | No          | Identifies the current status of the provisioning process for the contract. Possible values are: <br />0 – The contract has been created by the API in the database<br />1 – The contract has been sent to the ledger<br />2 – The contract has been successfully deployed to the ledger<br />3 or 4 - The contract failed to be deployed to the ledger<br />5 - The contract was successfully deployed to the ledger <br /><br />Beginning with version 1.5, values 0 through 5 are supported. For backwards compatibility in the current release, view **vwContractActionV0** is available that only supports values 0 through 2. |
| ContractCodeId                           | int           | No          | A unique identifier for the code implementation of the contract |
| ContractLedgerIdentifier                 | nvarchar(255) | Yes         | A unique identifier associated with the deployed version of a smart contract for a specific distributed ledger. For example, Ethereum. |
| ContractDeployedByUserId                 | int           | No          | The unique identifier of the user that deployed the contract |
| ContractDeployedByUserFirstName          | nvarchar(50)  | Yes         | First name of the user who deployed the contract |
| ContractDeployedByUserLastName           | nvarchar(255) | Yes         | Last name of the user who deployed the contract |
| ContractDeployedByUserExternalId         | nvarchar(255) | No          | External identifier of the user who deployed the contract. By default, this ID is the guid that represents their identity in the consortium Azure Active Directory.                                                                                                                                                |
| ContractDeployedByUserEmailAddress       | nvarchar(255) | Yes         | The email address of the user who deployed the contract |
| WorkflowFunctionId                       | int           | No          | A unique identifier for a workflow function |
| WorkflowFunctionName                     | nvarchar(50)  | No          | The name of the function |
| WorkflowFunctionDisplayName              | nvarchar(255) | No          | The name of a function to be displayed in the user interface |
| WorkflowFunctionDescription              | nvarchar(255) | No          | The description of the function |
| ContractActionId                         | int           | No          | The unique identifier for a contract action |
| ContractActionProvisioningStatus         | int           | No          | Identifies the current status of the provisioning process for the contract action. Possible values are: <br />0 – The contract action has been created by the API in the database<br />1 – The contract action has been sent to the ledger<br />2 – The contract action has been successfully deployed to the ledger<br />3 or 4 - The contract failed to be deployed to the ledger<br />5 - The contract was successfully deployed to the ledger <br /><br />Beginning with version 1.5, values 0 through 5 are supported. For backwards compatibility in the current release, view **vwContractActionV0** is available that only supports values 0 through 2. |
| ContractActionTimestamp                  | datetime(2,7) | No          | The timestamp of the contract action |
| ContractActionExecutedByUserId           | int           | No          | Unique identifier of the user that executed the contract action |
| ContractActionExecutedByUserFirstName    | int           | Yes         | First name of the user who executed the contract action |
| ContractActionExecutedByUserLastName     | nvarchar(50)  | Yes         | Last name of the user who executed the contract action |
| ContractActionExecutedByUserExternalId   | nvarchar(255) | Yes         | External identifier of the user who executed the contract action. By default, this ID is the guid that represents their identity in the consortium Azure Active Directory. |
| ContractActionExecutedByUserEmailAddress | nvarchar(255) | Yes         | The email address of the user who executed the contract action |
| WorkflowFunctionParameterId              | int           | No          | A unique identifier for a parameter of the function |
| WorkflowFunctionParameterName            | nvarchar(50)  | No          | The name of a parameter of the function |
| WorkflowFunctionParameterDisplayName     | nvarchar(255) | No          | The name of a function parameter to be displayed in the user interface |
| WorkflowFunctionParameterDataTypeId      | int           | No          | The unique identifier for the data type associated with a workflow function parameter |
| WorkflowParameterDataTypeName            | nvarchar(50)  | No          | The name of a data type associated with a workflow function parameter |
| ContractActionParameterValue             | nvarchar(255) | No          | The value for the parameter stored in the smart contract |
| BlockHash                                | nvarchar(255) | Yes         | The hash of the block |
| BlockNumber                              | int           | Yes         | The number of the block on the ledger |
| BlockTimestamp                           | datetime(2,7) | Yes         | The time stamp of the block |
| TransactionId                            | int           | No          | A unique identifier for the transaction |
| TransactionFrom                          | nvarchar(255) | Yes         | The party that originated the transaction |
| TransactionTo                            | nvarchar(255) | Yes         | The party that was transacted with |
| TransactionHash                          | nvarchar(255) | Yes         | The hash of a transaction |
| TransactionIsWorkbenchTransaction        | bit           | Yes         | A bit that identifies if the transaction is an Azure Blockchain Workbench transaction |
| TransactionProvisioningStatus            | int           | Yes         | Identifies the current status of the provisioning process for the transaction. Possible values are: <br />0 – The transaction has been created by the API in the database<br />1 – The transaction has been sent to the ledger<br />2 – The transaction has been successfully deployed to the ledger                 |
| TransactionValue                         | decimal(32,2) | Yes         | The value of the transaction |

## vwContractProperty

This view represents the majority of information related to properties associated with a contract and is designed to readily facilitate common reporting scenarios. For each property taken, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Details for the user who deployed the workflow
-   Associated smart contract property definition
-   Specific instance values for properties
-   Details for the state property of the contract

| Name                               | Type          | Can Be Null | Description                                                                                                                                                                                                                                                                        |
|------------------------------------|---------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                      | int           | No          | A unique identifier for the application |
| ApplicationName                    | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName             | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled                 | bit           | No          | Identifies if the application is currently enabled.<br />**Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database.                      |
| WorkflowId                         | int           | No          | The unique identifier for the workflow |
| WorkflowName                       | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName                | nvarchar(255) | No          | The name of the workflow displayed in the user interface |
| WorkflowDescription                | nvarchar(255) | Yes         | The description of the workflow |
| ContractId                         | int           | No          | The unique identifier for the contract |
| ContractProvisioningStatus         | int           | No          | Identifies the current status of the provisioning process for the contract. Possible values are: <br />0 – The contract has been created by the API in the database<br />1 – The contract has been sent to the ledger<br />2 – The contract has been successfully deployed to the ledger<br />3 or 4 - The contract failed to be deployed to the ledger<br />5 - The contract was successfully deployed to the ledger <br /><br />Beginning with version 1.5, values 0 through 5 are supported. For backwards compatibility in the current release, view **vwContractPropertyV0** is available that only supports values 0 through 2. |
| ContractCodeId                     | int           | No          | A unique identifier for the code implementation of the contract |
| ContractLedgerIdentifier           | nvarchar(255) | Yes         | A unique identifier associated with the deployed version of a smart contract for a specific distributed ledger. For example, Ethereum. |
| ContractDeployedByUserId           | int           | No          | The unique identifier of the user that deployed the contract |
| ContractDeployedByUserFirstName    | nvarchar(50)  | Yes         | First name of the user who deployed the contract |
| ContractDeployedByUserLastName     | nvarchar(255) | Yes         | Last name of the user who deployed the contract |
| ContractDeployedByUserExternalId   | nvarchar(255) | No          | External identifier of the user who deployed the contract. By default, this ID is the guid that represents their identity in the consortium Azure Active Directory |
| ContractDeployedByUserEmailAddress | nvarchar(255) | Yes         | The email address of the user who deployed the contract |
| WorkflowPropertyId                 | int           |             | A unique identifier for a property of a workflow |
| WorkflowPropertyDataTypeId         | int           | No          | The ID of the data type of the property |
| WorkflowPropertyDataTypeName       | nvarchar(50)  | No          | The name of the data type of the property |
| WorkflowPropertyName               | nvarchar(50)  | No          | The name of the workflow property |
| WorkflowPropertyDisplayName        | nvarchar(255) | No          | The display name of the workflow property |
| WorkflowPropertyDescription        | nvarchar(255) | Yes         | A description of the property |
| ContractPropertyValue              | nvarchar(255) | No          | The value for a property on the contract |
| StateName                          | nvarchar(50)  | Yes         | If this property contains the state of the contract, it is the display name for the state. If it is not associated with the state, the value will be null. |
| StateDisplayName                   | nvarchar(255) | No          | If this property contains the state, it is the display name for the state. If it is not associated with the state, the value will be null. |
| StateValue                         | nvarchar(255) | Yes         | If this property contains the state, it is the state value. If it is not associated with the state, the value will be null. |

## vwContractState

This view represents the majority of information related to the state of a specific contract and is designed to readily facilitate common reporting scenarios. Each record in this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Details for the user who deployed the workflow
-   Associated smart contract property definition
-   Details for the state property of the contract

| Name                               | Type          | Can Be Null | Description                                                                                                                                                                                                                                                                        |
|------------------------------------|---------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                      | int           | No          | A unique identifier for the application |
| ApplicationName                    | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName             | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled                 | bit           | No          | Identifies if the application is currently enabled.<br />**Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database. |
| WorkflowId                         | int           | No          | A unique identifier for the workflow |
| WorkflowName                       | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName                | nvarchar(255) | No          | The name displayed in the user interface |
| WorkflowDescription                | nvarchar(255) | Yes         | The description of the workflow |
| ContractLedgerImplementationId     | nvarchar(255) | Yes         | A unique identifier associated with the deployed version of a smart contract for a specific distributed ledger. For example, Ethereum. |
| ContractId                         | int           | No          | A unique identifier for the contract |
| ContractProvisioningStatus         | int           | No          |Identifies the current status of the provisioning process for the contract. Possible values are: <br />0 – The contract has been created by the API in the database<br />1 – The contract has been sent to the ledger<br />2 – The contract has been successfully deployed to the ledger<br />3 or 4 - The contract failed to be deployed to the ledger<br />5 - The contract was successfully deployed to the ledger <br /><br />Beginning with version 1.5, values 0 through 5 are supported. For backwards compatibility in the current release, view **vwContractStateV0** is available that only supports values 0 through 2. |
| ConnectionId                       | int           | No          | A unique identifier for the blockchain instance the workflow is deployed to |
| ContractCodeId                     | int           | No          | A unique identifier for the code implementation of the contract |
| ContractDeployedByUserId           | int           | No          | Unique identifier of the user that deployed the contract |
| ContractDeployedByUserExternalId   | nvarchar(255) | No          | External identifier of the user who deployed the contract. By default, this ID is the guid that represents their identity in the consortium Azure Active Directory. |
| ContractDeployedByUserFirstName    | nvarchar(50)  | Yes         | First name of the user who deployed the contract |
| ContractDeployedByUserLastName     | nvarchar(255) | Yes         | Last name of the user who deployed the contract |
| ContractDeployedByUserEmailAddress | nvarchar(255) | Yes         | The email address of the user who deployed the contract |
| WorkflowPropertyId                 | int           | No          | A unique identifier for a workflow property |
| WorkflowPropertyDataTypeId         | int           | No          | The ID of the data type of the workflow property |
| WorkflowPropertyDataTypeName       | nvarchar(50)  | No          | The name of the data type of the workflow property |
| WorkflowPropertyName               | nvarchar(50)  | No          | The name of the workflow property |
| WorkflowPropertyDisplayName        | nvarchar(255) | No          | The display name of the property to show in a UI |
| WorkflowPropertyDescription        | nvarchar(255) | Yes         | The description of the property |
| ContractPropertyValue              | nvarchar(255) | No          | The value for a property stored in the contract |
| StateName                          | nvarchar(50)  | Yes         | If this property contains the state, it the display name for the state. If it is not associated with the state, the value will be null. |
| StateDisplayName                   | nvarchar(255) | No          | If this property contains the state, it is the display name for the state. If it is not associated with the state, the value will be null. |
| StateValue                         | nvarchar(255) | Yes         | If this property contains the state, it is the state value. If it is not associated with the state, the value will be null. |

## vwUser

This view provides details on the consortium members that are provisioned to use Azure Blockchain Workbench. By default, data is populated through the initial provisioning of the user.

| Name               | Type          | Can Be Null | Description                                                                                                                                                                                                                               |
|--------------------|---------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ID                 | int           | No          | A unique identifier for a user |
| ExternalID         | nvarchar(255) | No          | An external identifier for a user. By default, this ID is the guid representing the Azure Active Directory ID for the user. |
| ProvisioningStatus | int           | No          |Identifies the current status of provisioning process for the user. Possible values are: <br />0 – User has been created by the API<br />1 – A key has been associated with the user in the database<br />2 – The user is fully provisioned |
| FirstName          | nvarchar(50)  | Yes         | The first name of the user |
| LastName           | nvarchar(50)  | Yes         | The last name of the user |
| EmailAddress       | nvarchar(255) | Yes         | The email address of the user |

## vwWorkflow

This view represents the details core workflow metadata as well as the workflow’s functions and parameters. Designed for reporting, it also contains metadata about the application associated with the workflow. This view contains data from multiple underlying tables to facilitate reporting on workflows. For each workflow, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Associated workflow start state information

| Name                              | Type          | Can Be Null | Description                                                                                                                                |
|-----------------------------------|---------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                     | int           | No          | A unique identifier for the application |
| ApplicationName                   | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName            | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled                | bit           | No          | Identifies if the application is enabled |
| WorkflowId                        | int           | Yes         | A unique identifier for a workflow |
| WorkflowName                      | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName               | nvarchar(255) | No          | The name displayed in the user interface |
| WorkflowDescription               | nvarchar(255) | Yes         | The description of the workflow. |
| WorkflowConstructorFunctionId     | int           | No          | The identifier of the workflow function that serves as the constructor for the workflow |
| WorkflowStartStateId              | int           | No          | A unique identifier for the state |
| WorkflowStartStateName            | nvarchar(50)  | No          | The name of the state |
| WorkflowStartStateDisplayName     | nvarchar(255) | No          | The name to be displayed in the user interface for the state |
| WorkflowStartStateDescription     | nvarchar(255) | Yes         | A description of the workflow state |
| WorkflowStartStateStyle           | nvarchar(50)  | Yes         | This value identifies the percentage complete that the workflow is when in this state |
| WorkflowStartStateValue           | int           | No          | The value of the state |
| WorkflowStartStatePercentComplete | int           | No          | A text description that provides a hint to clients on how to render this state in the UI. Supported states include *Success* and *Failure* |

## vwWorkflowFunction

This view represents the details core workflow metadata as well as the workflow’s functions and parameters. Designed for reporting, it also contains metadata about the application associated with the workflow. This view contains data from multiple underlying tables to facilitate reporting on workflows. For each workflow function, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Workflow function details

| Name                                 | Type          | Can Be Null | Description                                                                          |
|--------------------------------------|---------------|-------------|--------------------------------------------------------------------------------------|
| ApplicationId                        | int           | No          | A unique identifier for the application |
| ApplicationName                      | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName               | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled                   | bit           | No          | Identifies if the application is enabled |
| WorkflowId                           | int           | No          | A unique identifier for a workflow |
| WorkflowName                         | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName                  | nvarchar(255) | No          | The name of the workflow displayed in the user interface |
| WorkflowDescription                  | nvarchar(255) | Yes         | The description of the workflow |
| WorkflowFunctionId                   | int           | No          | A unique identifier for a function |
| WorkflowFunctionName                 | nvarchar(50)  | Yes         | The name of the function |
| WorkflowFunctionDisplayName          | nvarchar(255) | No          | The name of a function to be displayed in the user interface |
| WorkflowFunctionDescription          | nvarchar(255) | Yes         | The description of the workflow function |
| WorkflowFunctionIsConstructor        | bit           | No          | Identifies if the workflow function is the constructor for the workflow |
| WorkflowFunctionParameterId          | int           | No          | A unique identifier for a parameter of a function |
| WorkflowFunctionParameterName        | nvarchar(50)  | No          | The name of a parameter of the function |
| WorkflowFunctionParameterDisplayName | nvarchar(255) | No          | The name of a function parameter to be displayed in the user interface |
| WorkflowFunctionParameterDataTypeId  | int           | No          | A unique identifier for the data type associated with a workflow function parameter |
| WorkflowParameterDataTypeName        | nvarchar(50)  | No          | The name of a data type associated with a workflow function parameter |

## vwWorkflowProperty

This view represents the properties defined for a workflow. For each property, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Workflow property details

| Name                         | Type          | Can Be Null | Description                                                                                                                                                                                                                                                   |
|------------------------------|---------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                | int           | No          | A unique identifier for the application |
| ApplicationName              | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName       | nvarchar(255) | No          | The name to be displayed in a user interface |
| ApplicationEnabled           | bit           | No          | Identifies if the application is currently enabled.<br />**Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database. |
| WorkflowId                   | int           | No          | A unique identifier for the workflow |
| WorkflowName                 | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName          | nvarchar(255) | No          | The name to be displayed for the workflow in a user interface |
| WorkflowDescription          | nvarchar(255) | Yes         | A description of the workflow |
| WorkflowPropertyID           | int           | No          | A unique identifier for a property of a workflow |
| WorkflowPropertyName         | nvarchar(50)  | No          | The name of the property |
| WorkflowPropertyDescription  | nvarchar(255) | Yes         | A description of the property |
| WorkflowPropertyDisplayName  | nvarchar(255) | No          | The name to be displayed in a user interface |
| WorkflowPropertyWorkflowId   | int           | No          | The ID of the workflow to which this property is associated |
| WorkflowPropertyDataTypeId   | int           | No          | The ID of the data type defined for the property |
| WorkflowPropertyDataTypeName | nvarchar(50)  | No          | The name of the data type defined for the property |
| WorkflowPropertyIsState      | bit           | No          | This field identifies if this workflow property contains the state of the workflow |

## vwWorkflowState

This view represents the properties associated with a workflow. For each contract, this view contains the following data:

-   Associated application definition
-   Associated workflow definition
-   Workflow state information

| Name                         | Type          | Can Be Null | Description                                                                                                                                                                                                                                                   |
|------------------------------|---------------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ApplicationId                | int           | No          | A unique identifier for the application |
| ApplicationName              | nvarchar(50)  | No          | The name of the application |
| ApplicationDisplayName       | nvarchar(255) | No          | A description of the application |
| ApplicationEnabled           | bit           | No          | Identifies if the application is currently enabled.<br />**Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database. |
| WorkflowId                   | int           | No          | The unique identifier for the workflow |
| WorkflowName                 | nvarchar(50)  | No          | The name of the workflow |
| WorkflowDisplayName          | nvarchar(255) | No          | The name displayed in the user interface for the workflow |
| WorkflowDescription          | nvarchar(255) | Yes         | The description of the workflow |
| WorkflowStateID              | int           | No          | The unique identifier for the state |
| WorkflowStateName            | nvarchar(50)  | No          | The name of the state |
| WorkflowStateDisplayName     | nvarchar(255) | No          | The name to be displayed in the user interface for the state |
| WorkflowStateDescription     | nvarchar(255) | Yes         | A description of the workflow state |
| WorkflowStatePercentComplete | int           | No          | This value identifies the percentage complete that the workflow is when in this state |
| WorkflowStateValue           | nvarchar(50)  | No          | Value of the state |
| WorkflowStateStyle           | nvarchar(50)  | No          | A text description that provides a hint to clients on how to render this state in the UI. Supported states include *Success* and *Failure* |
