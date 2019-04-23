---
title: Azure Blockchain Service Consortium Management using PowerShell
description: How to manage Azure Blockchain Service consortium members using PowerShell
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 04/22/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#Customer intent: As a network operator, I want to manage members in the consortium so that I can control access to a private blockchain.
---

# How to manage consortium members in Azure Blockchain Service using PowerShell

You can use PowerShell to manage blockchain consortium members for your Azure Blockchain Service.

As a consortium administrator, you can invite, add, remove, and change roles for all participants in the blockchain consortium.

## Prerequisites

* [Create a blockchain member using the Azure portal](create-member.md)
* For more information about consortia, members, and nodes, see [Azure Blockchain Service consortium](consortium.md)

## Install and Import PowerShell module

Install the Microsoft.AzureBlockchainService.ConsortiumManagement.PS package from the PowerShell Gallery.

```powershell
Install-Module -Name Microsoft.AzureBlockchainService.ConsortiumManagement.PS -Scope CurrentUser
Import-Module Microsoft.AzureBlockchainService.ConsortiumManagement.PS
```

## Establish a Web3 connection

To manage consortium members, you need to establish a Web3 connection to your Azure Blockchain Service member endpoint. You can use this script to set global variables that can be used when calling the consortium management cmdlets.

```powershell
$global:config = @{
    FromNode = @{
        Endpoint = "<Endpoint address>"
        AccountAddress = "<Member account>"
        AccountPassword = "<Member account password>"
    }
    Network = @{
        RootContractAddress = "<RootContract address>"
    }
}

$Connection=New-Web3Connection -RemoteRPCEndpoint $config.FromNode.Endpoint

$global:MemberAccount=Import-Web3Account -ManagedAccountAddress $config.FromNode.AccountAddress -ManagedAccountPassword $config.FromNode.AccountPassword
$global:ContractConnection=Import-ConsortiumManagementContracts -RootContractAddress $config.Network.RootContractAddress -Web3Client $Connection
```

Replace \<Member account password\> with the member account password used when you created the member.

Replace \<Endpoint address\>, \<Member account\>, and \<RootContract address\> using the following sections to find the values in the Azure portal.

### Get account and member details

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your default Azure Blockchain Service member overview page.

    [screenshot]

### Get endpoint address

1. Navigate to your default Azure Blockchain Service member transaction node.

    [screenshot]

1. Select **Connection security > Access keys**.
1. Copy the endpoint address from **Access key 1 > HTTPS**. You need the address for the next section.

    [screenshot]

## Get-BlockchainMember

List members of the consortium.

```powershell
Get-BlockchainMember [[-Name] <String>] -Members <IContract> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| Name |  | No |
| Members | | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | Get-BlockchainMember
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

## Get-BlockchainMemberInvitation

Lists consortium member invitation status.

```powershell
Get-BlockchainMemberInvitation [[-SubscriptionId] <String>] -Members <IContract> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of invited member | No |
| Members |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | Get-BlockchainMemberInvitation
```

**Example output**

```
SubscriptionId                       Role CorrelationId
--------------                       ---- -------------
<Azure subscription ID>              USER             2
```

## Import-ConsortiumManagementContracts

Imports consortium management contracts.

```powershell
Import-ConsortiumManagementContracts -RootContractAddress <String> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| RootContractAddress |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
Import-ConsortiumManagementContracts -RootContractAddress $config.Network.RootContractAddress -Web3Client $Connection
```

**Example output**

```
Web3Client                         RootContract                                      Members
----------                         ------------                                      -------
Nethereum.JsonRpc.Client.RpcClient Microsoft.Westlake.SolidityUtils.DeployedContract Microsoft.Westlake.SolidityUtil...
```

## Import-Web3Account

Imports Web3 account.

```powershell
Import-Web3Account -ManagedAccountAddress <String> -ManagedAccountPassword <String>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| ManagedAccountAddress |  | Yes |
| ManagedAccountPassword |  | Yes |

**Example**

```powershell
Import-Web3Account -ManagedAccountAddress $config.FromNode.AccountAddress -ManagedAccountPassword $config.FromNode.AccountPassword
```

**Example output**

```
Password      Address                                    TransactionManager
--------      -------                                    ------------------
<Password>    0x85b911c9e103d6405573151258d668479e9ebeef Nethereum.Web3.Accounts.Managed.ManagedAccountTransactionMa...
```

## New-BlockchainMemberInvitation

Invite new members to the consortium.

```powershell
New-BlockchainMemberInvitation -SubscriptionId <String> -Role <String> -Members <IContract>
 -Web3Account <IAccount> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of invited member | No |
| Role | Consortium role. Values can be ADMIN or USER. ADMIN is the consortium administrator role. USER is the consortium member role. | Yes |
| Members |  | Yes |
| Web3Account |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | New-BlockchainMemberInvitation -SubscriptionId <Azure Subscription ID> -Role USER -Web3Account $MemberAccount
```

## New-Web3Connection

```powershell
New-Web3Connection [-RemoteRPCEndpoint <String>]
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| RemoteRPCEndpoint |  | No |


**Example**

```powershell
New-Web3Connection -RemoteRPCEndpoint $config.FromNode.Endpoint
```

## Remove-BlockchainMember

Removes a blockchain member.

```powershell
Remove-BlockchainMember -Name <String> -Members <IContract> -Web3Account <IAccount> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| Name |  | Yes |
| Members | | Yes |
| Web3Account |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | Remove-BlockchainMember -Name myblockchainmember2  -Web3Account $MemberAccount
```

## Remove-BlockchainMemberInvitation

Revokes a consortium member invite.

```powershell
Remove-BlockchainMemberInvitation -SubscriptionId <String> -Members <IContract> -Web3Account <IAccount>
 -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId |  | Yes |
| Members | | Yes |
| Web3Account |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | Remove-BlockchainMemberInvitation -SubscriptionId <Subscription ID> -Web3Account $MemberAccount
```

## Set-BlockchainMember

Sets blockchain member attributes including display name and consortium role.

Consortium administrators can set **DisplayName** and **Role** for all members. Consortium members can only change their own member's display name.

```powershell
Set-BlockchainMember -Name <String> [-DisplayName <String>] [-AccountAddress <String>] [-Role <String>]
 -Members <IContract> -Web3Account <IAccount> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| Name |  | Yes |
| DisplayName |  | No |
| Members | | Yes |
| Web3Account |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | Set-BlockchainMember -Name myblockchainmember -DisplayName myCompany -Web3Account $MemberAccount
```

## Set-BlockchainMemberInvitation

Sets the **Role** for an existing invitation. Only consortium administrators can change invitations.

```powershell
Set-BlockchainMemberInvitation -SubscriptionId <String> -Role <String> -Members <IContract>
 -Web3Account <IAccount> -Web3Client <IClient>
```

| Parameter | Description | Required |
|-----------|-------------|:--------:|
| SubscriptionId | Azure subscription ID of invited member | Yes |
| Role |  | Yes |
| Members |  | Yes |
| Web3Account |  | Yes |
| Web3Client |  | Yes |

**Example**

```powershell
$ContractConnection | Set-BlockchainMemberInvitation -SubscriptionId <Azure subscription ID> -Role USER -Web3Account $MemberAccount
```

## Next steps

For more information about consortia, members, and nodes, see [Azure Blockchain Service consortium](consortium.md)