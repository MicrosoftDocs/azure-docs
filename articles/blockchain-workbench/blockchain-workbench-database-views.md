# Database views in Azure Blockchain Workbench

Azure Blockchain Workbench delivers data from distributed ledgers to an
"off chain" SQL DB database. This makes it possible to use SQL and
existing tools, such as [SQL Server Management
Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017),
to interact with blockchain data.

Azure Blockchain Workbench provides a set of database views that provide
access to data that will be helpful when performing your queries. These
views are heavily denormalized to make it easy to quickly get started
building reports, analytics, and otherwise consume blockchain data with
existing tools and without having to retrain database staff.

This section includes an overview of the database views and the data
they contain.

**Note** -- Any direct usage of database tables found in the database
outside of these views, while possible, is not supported.

## vwApplication

This view provides details on Applications that have been uploaded to
Azure Blockchain Workbench.


| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | int             | No              | A unique identifier for the application.    |
| ApplicationName | nvarchar(50)    | No              | The name of the application. |
| ApplicationDescription | nvarchar(255)   | Yes             | A description of the application     |
| ApplicationDisplayName | nvarchar(255)   | Yes             | The name to be displayed in a user interface. |
| ApplicationEnabled | Bit             | No              | This field identifies if the application is currently enabled.</br></br> **Note:** Even though an application can be reflected as disabled in the database, associated contracts remain on the blockchain and data about those contracts remain in the database. |
| UploadedDtTm    | datetime2(7)    | No              | The date and time a contract was uploaded. |
| UploadedByUserId | int             | No              | The id of the   |
| d               |                 |                 | user who        |
|                 |                 |                 | uploaded the    |
|                 |                 |                 | application.    |
| UploadedByUserExternalId | nvarchar(255)   | No              | The external    |
| xternalId       |                 |                 | identifier for  |
|                 |                 |                 | the user who    |
|                 |                 |                 | uploaded the    |
|                 |                 |                 | application. By |
|                 |                 |                 | default, this   |
|                 |                 |                 | is the id for   |
|                 |                 |                 | the user from   |
|                 |                 |                 | the Azure       |
|                 |                 |                 | Active          |
|                 |                 |                 | Directory for   |
|                 |                 |                 | the consortium. |
| UploadedByUserP | int             | No              | Identifies the  |
| rovisioningStat |                 |                 | current status  |
| us              |                 |                 | of provisioning |
|                 |                 |                 | process for the |
|                 |                 |                 | user.           |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- User has   |
|                 |                 |                 | been created by |
|                 |                 |                 | the API         |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- A key has  |
|                 |                 |                 | been associated |
|                 |                 |                 | with the User   |
|                 |                 |                 | in the database |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The User   |
|                 |                 |                 | is fully        |
|                 |                 |                 | provisioned     |
| UploadedByUserF | nvarchar(50)    | Yes             | The first name  |
| irstName        |                 |                 | of the user who |
|                 |                 |                 | uploaded the    |
|                 |                 |                 | contract.       |
| UploadedByUserL | nvarchar(50)    | Yes             | The last name   |
| astName         |                 |                 | of the user who |
|                 |                 |                 | uploaded the    |
|                 |                 |                 | contract.       |
| UploadedByUserE | nvarchar(255)   | Yes             | The email       |
| mailAddress     |                 |                 | address of the  |
|                 |                 |                 | user who        |
|                 |                 |                 | uploaded the    |
|                 |                 |                 | contract.       |

## vwApplicationRole

This view provides details on the roles that have been defined in Azure
Blockchain Workbench Applications.

In an "Asset Transfer" application, for example, roles such as "Buyer"
and "Seller" roles may be defined.

  Name                     Type               Can Be Null   Description
  ------------------------ ------------------ ------------- ---------------------------------------------------
  ApplicationId            Int                No            A unique identifier for the application
  ApplicationName          nvarchar(50)       No            The name of the application
  ApplicationDescription   nvarchar(255)      Yes           A description of the application
  ApplicationDisplayName   nvarchar(255)      Yes           The name to be displayed in a user interface
  RoleId                   Int                No            A unique identifier for a role in the application
  RoleName                 nvarchar50)        No            The name of the role
  RoleDescription          description(255)   Yes           A description of the role

vwApplicationRoleUser
---------------======

This view provides details on the roles that have been defined in Azure
Blockchain Workbench Applications and the users associated with them.

In an "Asset Transfer" application, for example, "John Smith" may be
associated with the "Buyer" role.

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the application |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | application     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDesc | nvarchar(255)   | Yes             | A description   |
| ription         |                 |                 | of the          |
|                 |                 |                 | application     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar(255)   | Yes             | The name to be  |
| layName         |                 |                 | displayed in a  |
|                 |                 |                 | user interface  |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationRole | int             | No              | A unique        |
| Id              |                 |                 | identifier for  |
|                 |                 |                 | a role in the   |
|                 |                 |                 | application     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationRole | nvarchar50)     | No              | The name of the |
| Name            |                 |                 | role            |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationRole | nvarchar(255)   | Yes             | A description   |
| Description     |                 |                 | of the role     |
|-----------------|-----------------|-----------------|-----------------|
| UserId          | int             | No              | The id of the   |
|                 |                 |                 | user associated |
|                 |                 |                 | with the role.  |
|-----------------|-----------------|-----------------|-----------------|
| UserExternalId  | nvarchar(255)   | No              | The external    |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the user who is |
|                 |                 |                 | associated with |
|                 |                 |                 | the role. By    |
|                 |                 |                 | default, this   |
|                 |                 |                 | is the id for   |
|                 |                 |                 | the user from   |
|                 |                 |                 | the Azure       |
|                 |                 |                 | Active          |
|                 |                 |                 | Directory for   |
|                 |                 |                 | the consortium. |
|-----------------|-----------------|-----------------|-----------------|
| UserProvisionin | int             | No              | Identifies the  |
| gStatus         |                 |                 | current status  |
|                 |                 |                 | of provisioning |
|                 |                 |                 | process for the |
|                 |                 |                 | user.           |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- User has   |
|                 |                 |                 | been created by |
|                 |                 |                 | the API         |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- A key has  |
|                 |                 |                 | been associated |
|                 |                 |                 | with the User   |
|                 |                 |                 | in the database |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The User   |
|                 |                 |                 | is fully        |
|                 |                 |                 | provisioned     |
|-----------------|-----------------|-----------------|-----------------|
| UserFirstName   | nvarchar(50)    | Yes             | The first name  |
|                 |                 |                 | of the user who |
|                 |                 |                 | is associated   |
|                 |                 |                 | with the role.  |
|-----------------|-----------------|-----------------|-----------------|
| UserLastName    | nvarchar(255)   | Yes             | The last name   |
|                 |                 |                 | of the user who |
|                 |                 |                 | is associated   |
|                 |                 |                 | with the role.  |
|-----------------|-----------------|-----------------|-----------------|
| UserEmailAddres | nvarchar(255)   | Yes             | The email       |
| s               |                 |                 | address of the  |
|                 |                 |                 | user who is     |
|                 |                 |                 | associated with |
|                 |                 |                 | the role.       |
|-----------------|-----------------|-----------------|-----------------|

vwConnectionUser
---------------=

This view provides details on the connections defined in Azure
Blockchain Workbench and the users associated with them.

For each connection, this view contains the following data -

-   Associated ledger details

-   Associated user information

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionId    | Int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a connection in |
|                 |                 |                 | Azure           |
|                 |                 |                 | Blockchain      |
|                 |                 |                 | Workbench.      |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionEndpo | nvarchar(50)    | No              | The endpoint    |
| intUrl          |                 |                 | url for a       |
|                 |                 |                 | connection.     |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionFundi | nvarchar(255)   | Yes             | The funding     |
| ngAccount       |                 |                 | account         |
|                 |                 |                 | associated with |
|                 |                 |                 | a connection,   |
|                 |                 |                 | if applicable.  |
|-----------------|-----------------|-----------------|-----------------|
| LedgerId        | Int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a ledger.       |
|-----------------|-----------------|-----------------|-----------------|
| LedgerName      | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | ledger.         |
|-----------------|-----------------|-----------------|-----------------|
| LedgerDisplayNa | nvarchar(255)   | Yes             | The name of the |
| me              |                 |                 | ledger to       |
|                 |                 |                 | display in the  |
|                 |                 |                 | UI.             |
|-----------------|-----------------|-----------------|-----------------|
| UserId          | Int             | No              | The id of the   |
|                 |                 |                 | user associated |
|                 |                 |                 | with the        |
|                 |                 |                 | connection.     |
|-----------------|-----------------|-----------------|-----------------|
| UserExternalId  | nvarchar(255)   | No              | The external    |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the user who is |
|                 |                 |                 | associated with |
|                 |                 |                 | the connection. |
|                 |                 |                 | By default,     |
|                 |                 |                 | this is the id  |
|                 |                 |                 | for the user    |
|                 |                 |                 | from the Azure  |
|                 |                 |                 | Active          |
|                 |                 |                 | Directory for   |
|                 |                 |                 | the consortium. |
|-----------------|-----------------|-----------------|-----------------|
| UserProvisionin | Int             | No              | Identifies the  |
| gStatus         |                 |                 | current status  |
|                 |                 |                 | of provisioning |
|                 |                 |                 | process for the |
|                 |                 |                 | user.           |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- User has   |
|                 |                 |                 | been created by |
|                 |                 |                 | the API         |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- A key has  |
|                 |                 |                 | been associated |
|                 |                 |                 | with the User   |
|                 |                 |                 | in the database |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The User   |
|                 |                 |                 | is fully        |
|                 |                 |                 | provisioned     |
|-----------------|-----------------|-----------------|-----------------|
| UserFirstName   | nvarchar(50)    | Yes             | The first name  |
|                 |                 |                 | of the user who |
|                 |                 |                 | is associated   |
|                 |                 |                 | with the        |
|                 |                 |                 | connection.     |
|-----------------|-----------------|-----------------|-----------------|
| UserLastName    | nvarchar(255)   | Yes             | The last name   |
|                 |                 |                 | of the user who |
|                 |                 |                 | is associated   |
|                 |                 |                 | with the        |
|                 |                 |                 | connection.     |
|-----------------|-----------------|-----------------|-----------------|
| UserEmailAddres | nvarchar(255)   | Yes             | The email       |
| s               |                 |                 | address of the  |
|                 |                 |                 | user who is     |
|                 |                 |                 | associated with |
|                 |                 |                 | the connection. |
|-----------------|-----------------|-----------------|-----------------|

vwContract
==========

This view provides details about deployed contracts.

For each contract, this view contains the following data -

-   Associated application definition

-   Associated workflow definition

-   Associated ledger implementation for the function

-   Details for the user who initiated the action

-   Details related to the blockchain block and transaction

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionId    | Int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a connection in |
|                 |                 |                 | Azure           |
|                 |                 |                 | Blockchain      |
|                 |                 |                 | Workbench.      |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionEndpo | nvarchar(50)    | No              | The endpoint    |
| intUrl          |                 |                 | url for a       |
|                 |                 |                 | connection.     |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionFundi | nvarchar(255)   | Yes             | The funding     |
| ngAccount       |                 |                 | account         |
|                 |                 |                 | associated with |
|                 |                 |                 | a connection,   |
|                 |                 |                 | if applicable.  |
|-----------------|-----------------|-----------------|-----------------|
| LedgerId        | Int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a ledger.       |
|-----------------|-----------------|-----------------|-----------------|
| LedgerName      | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | ledger.         |
|-----------------|-----------------|-----------------|-----------------|
| LedgerDisplayNa | nvarchar(255)   | Yes             | The name of the |
| me              |                 |                 | ledger to       |
|                 |                 |                 | display in the  |
|                 |                 |                 | UI.             |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | Int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar (50)   | No              | The name of the |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar (255)  | Yes             | The name to be  |
| layName         |                 |                 | displayed in a  |
|                 |                 |                 | user interface. |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationEnab | Bit             | No              | This field      |
| led             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowId      | Int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the workflow    |
|                 |                 |                 | associated with |
|                 |                 |                 | a contract.     |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowName    | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | workflow        |
|                 |                 |                 | associated with |
|                 |                 |                 | a contract.     |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDisplay | nvarchar(255)   | Yes             | The name of the |
| Name            |                 |                 | workflow        |
|                 |                 |                 | associated with |
|                 |                 |                 | the contract to |
|                 |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDescrip | nvarchar(255)   | Yes             | The description |
| tion            |                 |                 | of the workflow |
|                 |                 |                 | associated with |
|                 |                 |                 | a contract.     |
|-----------------|-----------------|-----------------|-----------------|
| ContractCodeId  | Int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the contract    |
|                 |                 |                 | code associated |
|                 |                 |                 | with the        |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractFileNam | Int             | No              | The name of the |
| e               |                 |                 | file containing |
|                 |                 |                 | the smart       |
|                 |                 |                 | contract code   |
|                 |                 |                 | for this        |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractUploade | Int             | No              | The date and    |
| dDtTm           |                 |                 | time the        |
|                 |                 |                 | contract code   |
|                 |                 |                 | was uploaded.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractId      | Int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the contract.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractProvisi | Int             | No              | The last name   |
| oningStatus     |                 |                 | of the user who |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractLedgerI | nvarchar (255)  |                 | The email       |
| dentifier       |                 |                 | address of the  |
|                 |                 |                 | user who        |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Int             | No              | An external     |
| dByUserId       |                 |                 | identifier for  |
|                 |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract. By    |
|                 |                 |                 | default, this   |
|                 |                 |                 | is the guid     |
|                 |                 |                 | representing    |
|                 |                 |                 | the Azure       |
|                 |                 |                 | Active          |
|                 |                 |                 | Directory id    |
|                 |                 |                 | for the user.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | No              | An external     |
| dByUserExternal |                 |                 | identifier for  |
| Id              |                 |                 | the user that   |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract. By    |
|                 |                 |                 | default, this   |
|                 |                 |                 | is the guid     |
|                 |                 |                 | representing    |
|                 |                 |                 | the Azure       |
|                 |                 |                 | Active          |
|                 |                 |                 | Directory id    |
|                 |                 |                 | for the user.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Int             | No              | Identifies the  |
| dByUserProvisio |                 |                 | current status  |
| ningStatus      |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | user.           |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- User has   |
|                 |                 |                 | been created by |
|                 |                 |                 | the API         |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- A key has  |
|                 |                 |                 | been associated |
|                 |                 |                 | with the User   |
|                 |                 |                 | in the database |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The User   |
|                 |                 |                 | is fully        |
|                 |                 |                 | provisioned     |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(50)    | Yes             | The first name  |
| dByUserFirstNam |                 |                 | of the user who |
| e               |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | Yes             | The last name   |
| dByUserLastName |                 |                 | of the user who |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | Yes             | The email       |
| dByUserEmailAdd |                 |                 | address of the  |
| ress            |                 |                 | user who        |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|

 vwContractAction
---------------==

This view represents the majority of information related to actions
taken on contracts and is designed to readily facilitate common
reporting scenarios.

For each action taken, this view contains the following data -

-   Associated application definition

-   Associated workflow definition

-   Associated smart contract function and parameter definition

-   Associated ledger implementation for the function

-   Specific instance values provided for parameters

-   Details for the user who initiated the action

-   Details related to the blockchain block and transaction

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar(255)   | Yes             | The name to be  |
| layName         |                 |                 | displayed in a  |
|                 |                 |                 | user interface. |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationEnab | BIT             | No              | This field      |
| led             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowId      | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a workflow.     |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowName    | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDisplay | nvarchar(255)   | Yes             | The name of the |
| Name            |                 |                 | workflow to     |
|                 |                 |                 | display in a    |
|                 |                 |                 | user interface. |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDescrip | nvarchar(255)   | Yes             | The description |
| tion            |                 |                 | of the          |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractId      | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the contract.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractProvisi | int             | No              | Identifies the  |
| oningStatus     |                 |                 | current status  |
|                 |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | contract.       |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been created by |
|                 |                 |                 | the API in the  |
|                 |                 |                 | database        |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been sent to    |
|                 |                 |                 | the ledger      |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been            |
|                 |                 |                 | successfully    |
|                 |                 |                 | deployed to the |
|                 |                 |                 | ledger          |
|-----------------|-----------------|-----------------|-----------------|
| ContractCodeId  | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the code        |
|                 |                 |                 | implementation  |
|                 |                 |                 | of the          |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractLedgerI | nvarchar(255)   | Yes             | A unique        |
| dentifier       |                 |                 | identifier      |
|                 |                 |                 | associated with |
|                 |                 |                 | the deployed    |
|                 |                 |                 | version of a    |
|                 |                 |                 | smart contract  |
|                 |                 |                 | for a specific  |
|                 |                 |                 | distributed     |
|                 |                 |                 | ledger, e.g.    |
|                 |                 |                 | Ethereum.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | int             | No              | The unique      |
| dByUserId       |                 |                 | identifier of   |
|                 |                 |                 | the user that   |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(50)    | Yes             | First name of   |
| dByUserFirstNam |                 |                 | the user who    |
| e               |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | Yes             | Last name of    |
| dByUserLastName |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | No              | External        |
| dByUserExternal |                 |                 | identifier of   |
| Id              |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract. By    |
|                 |                 |                 | default this is |
|                 |                 |                 | the guid that   |
|                 |                 |                 | represents      |
|                 |                 |                 | their identity  |
|                 |                 |                 | in the          |
|                 |                 |                 | consortium      |
|                 |                 |                 | Azure Active    |
|                 |                 |                 | Directory.      |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | Yes             | The email       |
| dByUserEmailAdd |                 |                 | address of the  |
| ress            |                 |                 | user who        |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | int             | No              | A unique        |
| nId             |                 |                 | identifier for  |
|                 |                 |                 | a workflow      |
|                 |                 |                 | function.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | nvarchar(50)    | No              | The name of the |
| nName           |                 |                 | function.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | nvarchar(255)   | No              | The name of a   |
| nDisplayName    |                 |                 | function to be  |
|                 |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | nvarchar(255)   | No              | The description |
| nDescription    |                 |                 | of a the        |
|                 |                 |                 | function.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionI | int             | No              | The unique      |
| d               |                 |                 | identifier for  |
|                 |                 |                 | a contract      |
|                 |                 |                 | action.         |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionP | int             | No              | Identifies the  |
| rovisioningStat |                 |                 | current status  |
| us              |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | contract        |
|                 |                 |                 | action.         |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- The        |
|                 |                 |                 | contract action |
|                 |                 |                 | has been        |
|                 |                 |                 | created by the  |
|                 |                 |                 | API in the      |
|                 |                 |                 | database        |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- The        |
|                 |                 |                 | contract action |
|                 |                 |                 | has been sent   |
|                 |                 |                 | to the ledger   |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The        |
|                 |                 |                 | contract action |
|                 |                 |                 | has been        |
|                 |                 |                 | successfully    |
|                 |                 |                 | deployed to the |
|                 |                 |                 | ledger          |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionT | datetime(2,7)   | No              | The timestamp   |
| imestamp        |                 |                 | of the contract |
|                 |                 |                 | action.         |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionE | int             | No              | Unique          |
| xecutedByUserId |                 |                 | identifier of   |
|                 |                 |                 | the user that   |
|                 |                 |                 | executed the    |
|                 |                 |                 | contract        |
|                 |                 |                 | action.         |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionE | int             | Yes             | First name of   |
| xecutedByUserFi |                 |                 | the user who    |
| rstName         |                 |                 | executed the    |
|                 |                 |                 | contract        |
|                 |                 |                 | action.         |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionE | nvarchar(50)    | Yes             | Last name of    |
| xecutedByUserLa |                 |                 | the user who    |
| stName          |                 |                 | executed the    |
|                 |                 |                 | contract        |
|                 |                 |                 | action.         |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionE | nvarchar(255)   | Yes             | External        |
| xecutedByUserEx |                 |                 | identifier of   |
| ternalId        |                 |                 | the user who    |
|                 |                 |                 | executed the    |
|                 |                 |                 | contract        |
|                 |                 |                 | action.\        |
|                 |                 |                 | \               |
|                 |                 |                 | By default this |
|                 |                 |                 | is the guid     |
|                 |                 |                 | that represents |
|                 |                 |                 | their identity  |
|                 |                 |                 | in the          |
|                 |                 |                 | consortium      |
|                 |                 |                 | Azure Active    |
|                 |                 |                 | Directory       |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionE | nvarchar(255)   | Yes             | The email       |
| xecutedByUserEm |                 |                 | address of the  |
| ailAddress      |                 |                 | user who        |
|                 |                 |                 | executed the    |
|                 |                 |                 | contract        |
|                 |                 |                 | action.         |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | Int             | No              | A unique        |
| nParameterId    |                 |                 | identifier for  |
|                 |                 |                 | a parameter of  |
|                 |                 |                 | the function.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | nvarchar(50)    | No              | The name of a   |
| nParameterName  |                 |                 | parameter of    |
|                 |                 |                 | the function.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | nvarchar(255)   | Yes             | The name of a   |
| nParameterDispl |                 |                 | function        |
| ayName          |                 |                 | parameter to be |
|                 |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowFunctio | Int             | No              | The unique      |
| nParameterDataT |                 |                 | identifier for  |
| ypeId           |                 |                 | the data type   |
|                 |                 |                 | associated with |
|                 |                 |                 | a workflow      |
|                 |                 |                 | function        |
|                 |                 |                 | parameter.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowParamet | nvarchar(50)    | No              | The name of a   |
| erDataTypeName  |                 |                 | data type       |
|                 |                 |                 | associated with |
|                 |                 |                 | a workflow      |
|                 |                 |                 | function        |
|                 |                 |                 | parameter.      |
|-----------------|-----------------|-----------------|-----------------|
| ContractActionP | nvarchar(255)   | No              | The value for   |
| arameterValue   |                 |                 | the parameter   |
|                 |                 |                 | stored in the   |
|                 |                 |                 | smart contract. |
|-----------------|-----------------|-----------------|-----------------|
| BlockHash       | nvarchar(255)   | Yes             | The hash of the |
|                 |                 |                 | block.          |
|-----------------|-----------------|-----------------|-----------------|
| BlockNumber     | int             | Yes             | The number of   |
|                 |                 |                 | the block on    |
|                 |                 |                 | the ledger.     |
|-----------------|-----------------|-----------------|-----------------|
| BlockTimestamp  | datetime(2,7)   | Yes             | The time stamp  |
|                 |                 |                 | of the block.   |
|-----------------|-----------------|-----------------|-----------------|
| TransactionId   | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | transaction.    |
|-----------------|-----------------|-----------------|-----------------|
| TransactionFrom | nvarchar(255)   | Yes             | The party that  |
|                 |                 |                 | originated the  |
|                 |                 |                 | transaction.    |
|-----------------|-----------------|-----------------|-----------------|
| TransactionTo   | nvarchar(255)   | Yes             | The party that  |
|                 |                 |                 | was transacted  |
|                 |                 |                 | with.           |
|-----------------|-----------------|-----------------|-----------------|
| TransactionHash | nvarchar(255)   | Yes             | The hash of a   |
|                 |                 |                 | transaction.    |
|-----------------|-----------------|-----------------|-----------------|
| TransactionIsWo | bit             | Yes             | A bit that      |
| rkbenchTransact |                 |                 | identifies if   |
| ion             |                 |                 | the transaction |
|                 |                 |                 | is a Azure      |
|                 |                 |                 | Blockchain      |
|                 |                 |                 | Workbench       |
|                 |                 |                 | transaction.    |
|-----------------|-----------------|-----------------|-----------------|
| TransactionProv | int             | Yes             | Identifies the  |
| isioningStatus  |                 |                 | current status  |
|                 |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | transaction.    |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- The        |
|                 |                 |                 | transaction has |
|                 |                 |                 | been created by |
|                 |                 |                 | the API in the  |
|                 |                 |                 | database        |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- The        |
|                 |                 |                 | transaction has |
|                 |                 |                 | been sent to    |
|                 |                 |                 | the ledger      |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The        |
|                 |                 |                 | transaction has |
|                 |                 |                 | been            |
|                 |                 |                 | successfully    |
|                 |                 |                 | deployed to the |
|                 |                 |                 | ledger          |
|-----------------|-----------------|-----------------|-----------------|
| TransactionValu | decimal(32,2)   | Yes             | The value of    |
| e               |                 |                 | the             |
|                 |                 |                 | transaction.    |
|-----------------|-----------------|-----------------|-----------------|

vwContractProperty
---------------===

This view represents the majority of information related to properties
associated with a contract and is designed to readily facilitate common
reporting scenarios.

For each property taken, this view contains the following data --

-   Associated application definition

-   Associated workflow definition

-   Details for the user who deployed the workflow

-   Associated smart contract property definition

-   Specific instance values for properties

-   Details for the state property of the contract

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar(255)   | Yes             | The name to be  |
| layName         |                 |                 | displayed in a  |
|                 |                 |                 | user interface. |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationEnab | BIT             | No              | This field      |
| led             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowId      | int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the workflow.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowName    | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDisplay | nvarchar(255)   | Yes             | The name of the |
| Name            |                 |                 | workflow to     |
|                 |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDescrip | nvarchar(255)   | Yes             | The description |
| tion            |                 |                 | of the          |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractId      | int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the contract.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractProvisi | int             | No              | Identifies the  |
| oningStatus     |                 |                 | current status  |
|                 |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | contract.       |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been created by |
|                 |                 |                 | the API in the  |
|                 |                 |                 | database        |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been sent to    |
|                 |                 |                 | the ledger      |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been            |
|                 |                 |                 | successfully    |
|                 |                 |                 | deployed to the |
|                 |                 |                 | ledger          |
|-----------------|-----------------|-----------------|-----------------|
| ContractCodeId  | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the code        |
|                 |                 |                 | implementation  |
|                 |                 |                 | of the          |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractLedgerI | nvarchar(255)   | Yes             | A unique        |
| dentifier       |                 |                 | identifier      |
|                 |                 |                 | associated with |
|                 |                 |                 | the deployed    |
|                 |                 |                 | version of a    |
|                 |                 |                 | smart contract  |
|                 |                 |                 | for a specific  |
|                 |                 |                 | distributed     |
|                 |                 |                 | ledger, e.g.    |
|                 |                 |                 | Ethereum.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | int             | No              | The unique      |
| dByUserId       |                 |                 | identifier of   |
|                 |                 |                 | the user that   |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(50)    | Yes             | First name of   |
| dByUserFirstNam |                 |                 | the user who    |
| e               |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | Yes             | Last name of    |
| dByUserLastName |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | No              | External        |
| dByUserExternal |                 |                 | identifier of   |
| Id              |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|                 |                 |                 |                 |
|                 |                 |                 | By default this |
|                 |                 |                 | is the guid     |
|                 |                 |                 | that represents |
|                 |                 |                 | their identity  |
|                 |                 |                 | in the          |
|                 |                 |                 | consortium      |
|                 |                 |                 | Azure Active    |
|                 |                 |                 | Directory       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | nvarchar(255)   | Yes             | The email       |
| dByUserEmailAdd |                 |                 | address of the  |
| ress            |                 |                 | user who        |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             |                 | A unique        |
| yId             |                 |                 | identifier for  |
|                 |                 |                 | a property of a |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             | No              | The id of the   |
| yDataTypeId     |                 |                 | data type of    |
|                 |                 |                 | the property.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(50)    | No              | The name of the |
| yDataTypeName   |                 |                 | data type of    |
|                 |                 |                 | the property.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(50)    | No              | The name of the |
| yName           |                 |                 | workflow        |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(255)   | Yes             | The display     |
| yDisplayName    |                 |                 | name of the     |
|                 |                 |                 | workflow        |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(255)   | Yes             | A description   |
| yDescription    |                 |                 | of the          |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractPropert | nvarchar(255)   | No              | The value for a |
| yValue          |                 |                 | property on the |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| StateName       | nvarchar(50)    | Yes             | If this         |
|                 |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state of the    |
|                 |                 |                 | contract, this  |
|                 |                 |                 | is the display  |
|                 |                 |                 | name for the    |
|                 |                 |                 | state.\         |
|                 |                 |                 | \               |
|                 |                 |                 | If it is not    |
|                 |                 |                 | associated with |
|                 |                 |                 | the state, the  |
|                 |                 |                 | value will be   |
|                 |                 |                 | null.           |
|-----------------|-----------------|-----------------|-----------------|
| StateDisplayNam | nvarchar(255)   | Yes             | If this         |
| e               |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state, this is  |
|                 |                 |                 | the display     |
|                 |                 |                 | name for the    |
|                 |                 |                 | state.\         |
|                 |                 |                 | \               |
|                 |                 |                 | If it is not    |
|                 |                 |                 | associated with |
|                 |                 |                 | the state, the  |
|                 |                 |                 | value will be   |
|                 |                 |                 | null.           |
|-----------------|-----------------|-----------------|-----------------|
| StateValue      | nvarchar(255)   | Yes             | If this         |
|                 |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state, this is  |
|                 |                 |                 | the state       |
|                 |                 |                 | value.\         |
|                 |                 |                 | \               |
|                 |                 |                 | If it is not    |
|                 |                 |                 | associated with |
|                 |                 |                 | the state, the  |
|                 |                 |                 | value will be   |
|                 |                 |                 | null.           |
|-----------------|-----------------|-----------------|-----------------|

vwContractState
---------------

This view represents the majority of information related to the state of
a specific contract and is designed to readily facilitate common
reporting scenarios.

Each record in this view contains the following data --

-   Associated application definition

-   Associated workflow definition

-   Details for the user who deployed the workflow

-   Associated smart contract property definition

-   Details for the state property of the contract

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar(255)   | Yes             | The name to be  |
| layName         |                 |                 | displayed in a  |
|                 |                 |                 | user interface. |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationEnab | BIT             | No              | This field      |
| led             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowId      | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the workflow.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowName    | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDisplay | nvarchar(255)   | Yes             | The name to     |
| Name            |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDescrip | nvarchar(255)   | Yes             | The description |
| tion            |                 |                 | of the          |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractLedgerI | Nvarchar(255)   | Yes             | A unique        |
| mplementationId |                 |                 | identifier      |
|                 |                 |                 | associated with |
|                 |                 |                 | the deployed    |
|                 |                 |                 | version of a    |
|                 |                 |                 | smart contract  |
|                 |                 |                 | for a specific  |
|                 |                 |                 | distributed     |
|                 |                 |                 | ledger, e.g.    |
|                 |                 |                 | Ethereum.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractId      | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the contract.   |
|-----------------|-----------------|-----------------|-----------------|
| ContractProvisi | Int             | No              | Identifies the  |
| oningStatus     |                 |                 | current status  |
|                 |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | contract.       |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been created by |
|                 |                 |                 | the API in the  |
|                 |                 |                 | database        |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been sent to    |
|                 |                 |                 | the ledger      |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The        |
|                 |                 |                 | contract has    |
|                 |                 |                 | been            |
|                 |                 |                 | successfully    |
|                 |                 |                 | deployed to the |
|                 |                 |                 | ledger          |
|-----------------|-----------------|-----------------|-----------------|
| ConnectionId    | Int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the blockchain  |
|                 |                 |                 | instance the    |
|                 |                 |                 | workflow is     |
|                 |                 |                 | deployed to     |
|-----------------|-----------------|-----------------|-----------------|
| ContractCodeId  | Int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the code        |
|                 |                 |                 | implementation  |
|                 |                 |                 | of the          |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Int             | No              | Unique          |
| dByUserId       |                 |                 | identifier of   |
|                 |                 |                 | the user that   |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Nvarchar(255)   | No              | External        |
| dByUserExternal |                 |                 | identifier of   |
| Id              |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|                 |                 |                 |                 |
|                 |                 |                 | By default this |
|                 |                 |                 | is the guid     |
|                 |                 |                 | that represents |
|                 |                 |                 | their identity  |
|                 |                 |                 | in the          |
|                 |                 |                 | consortium      |
|                 |                 |                 | Azure Active    |
|                 |                 |                 | Directory.      |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Nvarchar(50)    | Yes             | First name of   |
| dByUserFirstNam |                 |                 | the user who    |
| e               |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Nvarchar(255)   | Yes             | Last name of    |
| dByUserLastName |                 |                 | the user who    |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractDeploye | Nvarchar(255)   | Yes             | The email       |
| dByUserEmailAdd |                 |                 | address of the  |
| ress            |                 |                 | user who        |
|                 |                 |                 | deployed the    |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             | No              | A unique        |
| yId             |                 |                 | identifier for  |
|                 |                 |                 | a workflow      |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             | No              | The id of the   |
| yDataTypeId     |                 |                 | data type of    |
|                 |                 |                 | the workflow    |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(50)    | No              | The name of the |
| yDataTypeName   |                 |                 | data type of    |
|                 |                 |                 | the workflow    |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(50)    | No              | The name of the |
| yName           |                 |                 | workflow        |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(255)   | Yes             | The display     |
| yDisplayName    |                 |                 | name of the     |
|                 |                 |                 | property to     |
|                 |                 |                 | show in a UI.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(255)   | Yes             | The description |
| yDescription    |                 |                 | of the          |
|                 |                 |                 | property.       |
|-----------------|-----------------|-----------------|-----------------|
| ContractPropert | nvarchar(255)   | No              | The value for a |
| yValue          |                 |                 | property stored |
|                 |                 |                 | in the          |
|                 |                 |                 | contract.       |
|-----------------|-----------------|-----------------|-----------------|
| StateName       | nvarchar(50)    | Yes             | If this         |
|                 |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state, this is  |
|                 |                 |                 | the display     |
|                 |                 |                 | name for the    |
|                 |                 |                 | state.          |
|                 |                 |                 |                 |
|                 |                 |                 | If it is not    |
|                 |                 |                 | associated with |
|                 |                 |                 | the state, the  |
|                 |                 |                 | value will be   |
|                 |                 |                 | null.           |
|-----------------|-----------------|-----------------|-----------------|
| StateDisplayNam | nvarchar(255)   | Yes             | If this         |
| e               |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state, this is  |
|                 |                 |                 | the display     |
|                 |                 |                 | name for the    |
|                 |                 |                 | state.          |
|                 |                 |                 |                 |
|                 |                 |                 | If it is not    |
|                 |                 |                 | associated with |
|                 |                 |                 | the state, the  |
|                 |                 |                 | value will be   |
|                 |                 |                 | null.           |
|-----------------|-----------------|-----------------|-----------------|
| StateValue      | nvarchar(255)   | Yes             | If this         |
|                 |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state, this is  |
|                 |                 |                 | the state       |
|                 |                 |                 | value. If it is |
|                 |                 |                 | not associated  |
|                 |                 |                 | with the state, |
|                 |                 |                 | the value will  |
|                 |                 |                 | be null.        |
|-----------------|-----------------|-----------------|-----------------|

vwUser
======

This view provides details on the consortium members that are
provisioned to use Azure Blockchain Workbench. By default, data is
populated through the initial provisioning of the user.

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ID              | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a user.         |
|-----------------|-----------------|-----------------|-----------------|
| ExternalID      | nvarchar(255)   | No              | An external     |
|                 |                 |                 | identifier for  |
|                 |                 |                 | a user.         |
|                 |                 |                 |                 |
|                 |                 |                 | By default,     |
|                 |                 |                 | this is the     |
|                 |                 |                 | guid            |
|                 |                 |                 | representing    |
|                 |                 |                 | the Azure       |
|                 |                 |                 | Active          |
|                 |                 |                 | Directory id    |
|                 |                 |                 | for the user.   |
|-----------------|-----------------|-----------------|-----------------|
| ProvisioningSta | int             | No              | Identifies the  |
| tus             |                 |                 | current status  |
|                 |                 |                 | of the          |
|                 |                 |                 | provisioning    |
|                 |                 |                 | process for the |
|                 |                 |                 | user.           |
|                 |                 |                 |                 |
|                 |                 |                 | The possible    |
|                 |                 |                 | values here are |
|                 |                 |                 | --              |
|                 |                 |                 |                 |
|                 |                 |                 | 0 -- User has   |
|                 |                 |                 | been created by |
|                 |                 |                 | the API         |
|                 |                 |                 |                 |
|                 |                 |                 | 1 -- A key has  |
|                 |                 |                 | been associated |
|                 |                 |                 | with the User   |
|                 |                 |                 | in the database |
|                 |                 |                 |                 |
|                 |                 |                 | 2 -- The User   |
|                 |                 |                 | is fully        |
|                 |                 |                 | provisioned     |
|-----------------|-----------------|-----------------|-----------------|
| FirstName       | nvarchar(50)    | Yes             | The first name  |
|                 |                 |                 | of the user.    |
|-----------------|-----------------|-----------------|-----------------|
| LastName        | nvarchar(50)    | Yes             | The last name   |
|                 |                 |                 | of the user.    |
|-----------------|-----------------|-----------------|-----------------|
| EmailAddress    | nvarchar(255)   | Yes             | The email       |
|                 |                 |                 | address of the  |
|                 |                 |                 | user.           |
|-----------------|-----------------|-----------------|-----------------|

vwWorkflow
==========

This view represents the details core workflow metadata as well as the
workflow's functions and parameters. Designed for reporting, this also
contains metadata about the application associated with the workflow.

This view contains data from multiple underlying tables to facilitate
reporting on workflows.

For each workflow, this view contains the following data -

-   Associated application definition

-   Associated workflow definition

-   Associated workflow start state information

  Name                                Type            Can Be Null   Description
  ----------------------------------- --------------- ------------- --------------------------------------------------------------------------------------------------------------------------------------------
  ApplicationId                       int             No            A unique identifier for the Application
  ApplicationName                     nvarchar(50)    No            The name of the Application
  ApplicationDisplayName              nvarchar(255)   Yes           The name to be displayed in a user interface
  ApplicationEnabled                  BIT             No            Identifies if the application is enabled
  WorkflowId                          int             Yes           A unique identifier for a workflow
  WorkflowName                        nvarchar(50)                  The name of the workflow
  WorkflowDisplayName                 nvarchar(255)                 The name to displayed in the user interface
  WorkflowDescription                 nvarchar(255)                 The description of the workflow.
  WorkflowConstructorFunctionId       Int             No            The identifier of the workflow function that serves as the constructor for the workflow.
  WorkflowStartStateId                Int             No            A unique identifier for the state.
  WorkflowStartStateName              Nvarchar(50)    No            The name of the state.
  WorkflowStartStateDisplayName       Nvarchar(255)   Yes           The name to be displayed in the user interface for the state.
  WorkflowStartStateDescription       Nvarchar(255)   Yes           A description of the workflow state.
  WorkflowStartStateStyle             Nvarchar(50)    Yes           This value identifies the percentage complete that the workflow is when in this state.
  WorkflowStartStateValue             Int             No            This is the value of the state.
  WorkflowStartStatePercentComplete   Int             No            A text description that provides a hint to clients on how to render this state in the UI. Supported states include "Success" and "Failure"

vwWorkflowFunction
---------------===

This view represents the details core workflow metadata as well as the
workflow's functions and parameters. Designed for reporting, this also
contains metadata about the application associated with the workflow.

This view contains data from multiple underlying tables to facilitate
reporting on workflows.

For each workflow function, this view contains the following data -

-   Associated application definition

-   Associated workflow definition

-   Workflow function details

  Name                                   Type            Can Be Null   Description
  -------------------------------------- --------------- ------------- --------------------------------------------------------------------------------------
  ApplicationId                          int             No            A unique identifier for the Application
  ApplicationName                        nvarchar(50)    No            The name of the Application
  ApplicationDisplayName                 nvarchar(255)   Yes           The name to be displayed in a user interface
  ApplicationEnabled                     bit             No            Identifies if the application is enabled
  WorkflowId                             int             No            A unique identifier for a workflow.
  WorkflowName                           nvarchar(50)    No            The name of the workflow.
  WorkflowDisplayName                    nvarchar(255)   Yes           The name of the workflow to displayed in the user interface.
  WorkflowDescription                    nvarchar(255)   Yes           The description of the workflow.
  WorkflowFunctionId                     int             No            A unique identifier for a function.
  WorkflowFunctionName                   nvarchar(50)    Yes           The name of the function.
  WorkflowFunctionDisplayName            nvarchar(255)   Yes           The name of a function to be displayed in the user interface
  WorkflowFunctionDescription            nvarchar(255)   Yes           The description of the workflow function.
  WorkflowFunctionIsConstructor          Bit             No            This identifies if the workflow function is the constructor for the workflow.
  WorkflowFunctionParameterId            int             No            A unique identifier for a parameter of a function.
  WorkflowFunctionParameterName          nvarchar(50)    No            The name of a parameter of the function.
  WorkflowFunctionParameterDisplayName   nvarchar(255)   Yes           The name of a function parameter to be displayed in the user interface
  WorkflowFunctionParameterDataTypeId    int             No            A unique identifier for the data type associated with a workflow function parameter.
  WorkflowParameterDataTypeName          nvarchar(50)    No            The name of a data type associated with a workflow function parameter.

vwWorkflowProperty
---------------===

This view represents the properties defined for a workflow.

For each property, this view contains the following data -

-   Associated application definition

-   Associated workflow definition

-   Workflow property details

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar(255)   | Yes             | The name to be  |
| layName         |                 |                 | displayed in a  |
|                 |                 |                 | user interface. |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationEnab | bit             | No              | This field      |
| led             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowId      | int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the workflow.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowName    | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDisplay | nvarchar(255)   | Yes             | The name to be  |
| Name            |                 |                 | displayed for   |
|                 |                 |                 | the workflow in |
|                 |                 |                 | a user          |
|                 |                 |                 | interface.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDescrip | nvarchar(255)   | Yes             | A description   |
| tion            |                 |                 | of the          |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             | No              | This field      |
| yID             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(50)    | No              | The name of the |
| yName           |                 |                 | Property        |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(255)   | Yes             | A description   |
| yDescription    |                 |                 | of the Property |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(255)   | Yes             | The name to be  |
| yDisplayName    |                 |                 | displayed in a  |
|                 |                 |                 | user interface  |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             | No              | The id of the   |
| yWorkflowId     |                 |                 | Workflow that   |
|                 |                 |                 | this property   |
|                 |                 |                 | is associated   |
|                 |                 |                 | with            |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | int             | No              | The id of the   |
| yDataTypeId     |                 |                 | data type       |
|                 |                 |                 | defined for the |
|                 |                 |                 | property        |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | nvarchar(50)    | No              | The name of the |
| yDataTypeName   |                 |                 | data type       |
|                 |                 |                 | defined for the |
|                 |                 |                 | property        |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowPropert | Bit             | No              | This field      |
| yIsState        |                 |                 | identifies if   |
|                 |                 |                 | this workflow   |
|                 |                 |                 | property        |
|                 |                 |                 | contains the    |
|                 |                 |                 | state of the    |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|

vwWorkflowState
---------------

This view represents the properties associated with a workflow.

For each contract, this view contains the following data -

-   Associated application definition

-   Associated workflow definition

-   Workflow state information

|-----------------|-----------------|-----------------|-----------------|
| Name            | Type            | Can Be Null     | Description     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationId   | Int             | No              | A unique        |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the             |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationName | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | application.    |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationDisp | nvarchar(255)   | Yes             | A description   |
| layName         |                 |                 | of the          |
|                 |                 |                 | application     |
|-----------------|-----------------|-----------------|-----------------|
| ApplicationEnab | Bit             | No              | This field      |
| led             |                 |                 | identifies if   |
|                 |                 |                 | the application |
|                 |                 |                 | is currently    |
|                 |                 |                 | enabled.        |
|                 |                 |                 |                 |
|                 |                 |                 | Note -- Even    |
|                 |                 |                 | though an       |
|                 |                 |                 | application can |
|                 |                 |                 | be reflected as |
|                 |                 |                 | disabled in the |
|                 |                 |                 | database,       |
|                 |                 |                 | associated      |
|                 |                 |                 | contracts will  |
|                 |                 |                 | remain on the   |
|                 |                 |                 | blockchain and  |
|                 |                 |                 | data about      |
|                 |                 |                 | those contracts |
|                 |                 |                 | will remain in  |
|                 |                 |                 | the database.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowId      | int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the workflow.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowName    | nvarchar(50)    | No              | The name of the |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDisplay | nvarchar(255)   | Yes             | The name to     |
| Name            |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface for   |
|                 |                 |                 | the workflow.   |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowDescrip | nvarchar(255)   | Yes             | The description |
| tion            |                 |                 | of the          |
|                 |                 |                 | workflow.       |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStateID | int             | No              | The unique      |
|                 |                 |                 | identifier for  |
|                 |                 |                 | the state.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStateNa | nvarchar(50)    | No              | The name of the |
| me              |                 |                 | state.          |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStateDi | nvarchar(255)   | Yes             | The name to be  |
| splayName       |                 |                 | displayed in    |
|                 |                 |                 | the user        |
|                 |                 |                 | interface for   |
|                 |                 |                 | the state.      |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStateDe | nvarchar(255)   | Yes             | A description   |
| scription       |                 |                 | of the workflow |
|                 |                 |                 | state.          |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStatePe | int             | No              | This value      |
| rcentComplete   |                 |                 | identifies the  |
|                 |                 |                 | percentage      |
|                 |                 |                 | complete that   |
|                 |                 |                 | the workflow is |
|                 |                 |                 | when in this    |
|                 |                 |                 | state.          |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStateVa | nvarchar(50)    | No              | This is the     |
| lue             |                 |                 | value of the    |
|                 |                 |                 | state.          |
|-----------------|-----------------|-----------------|-----------------|
| WorkflowStateSt | Nvarchar(50)    | No              | A text          |
| yle             |                 |                 | description     |
|                 |                 |                 | that provides a |
|                 |                 |                 | hint to clients |
|                 |                 |                 | on how to       |
|                 |                 |                 | render this     |
|                 |                 |                 | state in the    |
|                 |                 |                 | UI. Supported   |
|                 |                 |                 | states include  |
|                 |                 |                 | "Success" and   |
|                 |                 |                 | "Failure"       |
|-----------------|-----------------|-----------------|-----------------|
