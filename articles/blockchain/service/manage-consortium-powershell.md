---
title: Azure Blockchain Service consortium management using PowerShell
description: How to manage Azure Blockchain Service consortium members using PowerShell
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 05/10/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#Customer intent: As a network operator, I want to manage members in the consortium so that I can control access to a private blockchain.
---

# Manage consortium members in Azure Blockchain Service using PowerShell

You can use PowerShell to manage blockchain consortium members for your Azure Blockchain Service. Members with an administrator privilege can invite, add, remove, and changes roles for all participants in the blockchain consortium. Members with user privilege can view all participants in the blockchain consortium and can change their member display name.

## Prerequisites

* [Create a blockchain member using the Azure portal](create-member.md)
* For more information about consortia, members, and nodes, see [Azure Blockchain Service consortium](consortium.md)

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Install PowerShell module

Install the Microsoft.AzureBlockchainService.ConsortiumManagement.PS package from the PowerShell Gallery.

```powershell-interactive
Install-Module -Name Microsoft.AzureBlockchainService.ConsortiumManagement.PS -Scope CurrentUser
Import-Module Microsoft.AzureBlockchainService.ConsortiumManagement.PS
```

## Set information preference

You can get more information when executing the cmdlets by setting information preference variable. By default, *$InformationPreference* is set to *SilentlyContinue*.

For more verbose information from cmdlets, set the preference in the PowerShell as follows:

```powershell-interactive
$InformationPreference = 'Continue'
```

## Establish a Web3 connection

To manage consortium members, you need to establish a Web3 connection to your Azure Blockchain Service member endpoint. You can use this script to set global variables that can be used when calling the consortium management cmdlets.

```powershell-interactive
$Connection = New-Web3Connection -RemoteRPCEndpoint '<Endpoint address>'
$MemberAccount = Import-Web3Account -ManagedAccountAddress '<Member account address>' -ManagedAccountPassword '<Member account password>'
$ContractConnection = Import-ConsortiumManagementContracts -RootContractAddress '<RootContract address>' -Web3Client $Connection
```

Replace \<Member account password\> with the member account password used when you created the member.

Find the other values in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your default Azure Blockchain Service member **Overview** page.

    ![Member overview](./media/manage-consortium-powershell/member-overview.png)

    Replace \<Member account\>, and \<RootContract address\> with the values from the portal.

1. For the endpoint address, select **Transaction nodes** and select the **default** transaction node. The default transaction node has the same name as the blockchain member.
1. Select **Connection strings**.

    ![Connection strings](./media/manage-consortium-powershell/connection-strings.png)

    Replace \<Endpoint address\> with the value from **HTTPS (Access key 1)** or **HTTPS (Access key 2)**.

## Network and smart contract management

Use the network and smart contract cmdlets to establish a connection to your blockchain endpoint smart contracts responsible for consortium management.

### Import-ConsortiumManagementContracts

Connects to the consortium management smart contracts, which are used to manage and enforce members within the consortium.

`Import-ConsortiumManagementContracts -RootContractAddress <String> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| RootContractAddress | The root contract address of the consortium management smart contracts | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
Import-ConsortiumManagementContracts -RootContractAddress '<RootContract address>'  -Web3Client $Connection
```

### Import-Web3Account

Use this cmdlet to create an object to hold the information remote node management account.

`Import-Web3Account -ManagedAccountAddress <String> -ManagedAccountPassword <String>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| ManagedAccountAddress | Blockchain member account address | Yes |
| ManagedAccountPassword | Account address password | Yes |

**Example**

```powershell-interactive
Import-Web3Account -ManagedAccountAddress '<Member account address>'  -ManagedAccountPassword '<Member account password>'
```

### New-Web3Connection

Establishes a connection to the RPC endpoint of a transaction node.

`New-Web3Connection [-RemoteRPCEndpoint <String>]`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| RemoteRPCEndpoint | Blockchain member endpoint address | Yes |

**Example**

```powershell-interactive
New-Web3Connection -RemoteRPCEndpoint '<Endpoint address>'
```

## Consortium member management

Use consortium member management cmdlets to manage members within the consortium. Available actions depend on your consortium role.

### Get-BlockchainMember

Gets member details or list members of the consortium.

`Get-BlockchainMember [[-Name] <String>] -Members <IContract> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| Name | The name of the Azure Blockchain Service member you want to retrieve details on. If you provide a member name, details of the member are returned. If name is omitted, a list of all consortium members is returned. | No |
| Members | Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
$ContractConnection | Get-BlockchainMember -Name <Member Name>
```

**Example output**

```
Name           : myblockchainmember
CorrelationId  : 0
DisplayName    : myCompany
SubscriptionId : <Azure subscription ID>
AccountAddress : 0x85b911c9e103d6405573151258d668479e9ebeef
Role           : ADMIN
```

### Remove-BlockchainMember

Removes a blockchain member.

`Remove-BlockchainMember -Name <String> -Members <IContract> -Web3Account <IAccount> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| Name | Member name to remove | Yes |
| Members | Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Account | Web3Account object obtained from Import-Web3Account | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
$ContractConnection | Remove-BlockchainMember -Name <Member Name> -Web3Account $MemberAccount
```

### Set-BlockchainMember

Sets blockchain member attributes including display name and consortium role.

Consortium administrators can set **DisplayName** and **Role** for all members. Consortium member with the user role can only change their own member's display name.

`Set-BlockchainMember -Name <String> [-DisplayName <String>] [-AccountAddress <String>] [-Role <String>]
 -Members <IContract> -Web3Account <IAccount> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| Name | Name of the blockchain member | Yes |
| DisplayName | New display name | No |
| AccountAddress | Account address | No |
| Members | Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Account | Web3Account object obtained from Import-Web3Account | Yes |
| Web3Client |  Web3Client object obtained from New-Web3Connection| Yes |

**Example**

```powershell-interactive
$ContractConnection | Set-BlockchainMember -Name <Member Name> -DisplayName <Display name> -Web3Account $MemberAccount
```

## Consortium member invitation management

Use consortium member invitation management cmdlets to manage consortium member invitations. Available actions depend on your consortium role.

### New-BlockchainMemberInvitation

Invite new members to the consortium.

`New-BlockchainMemberInvitation -SubscriptionId <String> -Role <String> -Members <IContract>
 -Web3Account <IAccount> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of invited member | Yes |
| Role | Consortium role. Values can be ADMIN or USER. ADMIN is the consortium administrator role. USER is the consortium member role. | Yes |
| Members | Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Account | Web3Account object obtained from Import-Web3Account | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
$ContractConnection | New-BlockchainMemberInvitation -SubscriptionId <Azure Subscription ID> -Role USER -Web3Account $MemberAccount
```

### Get-BlockchainMemberInvitation

Retrieves or lists consortium member invitation status.

`Get-BlockchainMemberInvitation [[-SubscriptionId] <String>] -Members <IContract> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of invited member. If SubscriptionID is provided, invitation details of the subscription ID are returned. If SubscriptionID is omitted, a list of all member invitations are returned. | No |
| Members | Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
$ContractConnection | Get-BlockchainMemberInvitation – SubscriptionId <Azure subscription ID>
```

**Example output**

```
SubscriptionId                       Role CorrelationId
--------------                       ---- -------------
<Azure subscription ID>              USER             2
```

### Remove-BlockchainMemberInvitation

Revokes a consortium member invite.

`Remove-BlockchainMemberInvitation -SubscriptionId <String> -Members <IContract> -Web3Account <IAccount>
 -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of member to revoke | Yes |
| Members | Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Account | Web3Account object obtained from Import-Web3Account | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
$ContractConnection | Remove-BlockchainMemberInvitation -SubscriptionId <Subscription ID> -Web3Account $MemberAccount
```

### Set-BlockchainMemberInvitation

Sets the **Role** for an existing invitation. Only consortium administrators can change invitations.

`Set-BlockchainMemberInvitation -SubscriptionId <String> -Role <String> -Members <IContract>
 -Web3Account <IAccount> -Web3Client <IClient>`

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of invited member | Yes |
| Role | New consortium role for invitation. Values can be **USER** or **ADMIN** | Yes |
| Members |  Members object obtained from Import-ConsortiumManagementContracts | Yes |
| Web3Account | Web3Account object obtained from Import-Web3Account | Yes |
| Web3Client | Web3Client object obtained from New-Web3Connection | Yes |

**Example**

```powershell-interactive
$ContractConnection | Set-BlockchainMemberInvitation -SubscriptionId <Azure subscription ID> -Role USER -Web3Account $MemberAccount
```

## Next steps

For more information about consortia, members, and nodes, see:

> [!div class="nextstepaction"]
> [Azure Blockchain Service consortium](consortium.md)