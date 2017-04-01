---
title: Run tasks under user accounts in Batch .NET | Microsoft Docs
description: Run tasks under user accounts in Batch .NET
services: batch
documentationcenter: .net
author: tamram
manager: timlt
editor: ''
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: big-compute
ms.date: 03/28/2017
ms.author: tamram
---

# Run tasks under user accounts in Batch

When a job runs a task in Azure Batch, the task runs under a user account. You can optionally specify the user account under which you want the task to run. Azure Batch provides two options for the user accounts under which tasks run:

- **The AutoUser account.** The AutoUser is a built-in user account that's created automatically by the Batch service. You can specify the elevation level for the AutoUser, as well as its scope. For a Windows node, the scope indicates whether the Batch service creates a new AutoUser for each task (task scope) or whether the task runs under the common AutoUser account that is created on each node in a pool (pool scope). Linux nodes always run under the common AutoUser account created on each node in a pool.

??? Is the advantage to task scope just that you can have different elevation levels for each task?

- **A named user account.** You can specify one or more named user accounts for a pool when you create the pool. In addition to the account name, you can specify the account password, elevation level, and, for Linux pools, the SSH private key. When you add a task, you can specify the named user account under which that task should run.

By default, tasks on Windows nodes run under the AutoUser account as a standard user without elevated access and with task scope. By default, tasks on Linux nodes run under the AutoUser account as a standard user without elevated access and with pool scope.

Both the AutoUser account and a named user account have read/write access to the task’s working directory and shared directory, and read access to the startup and job prep directories (???what is the job prep directory - we don't appear to doc this?). (???Question from Ivan - What about the multi-instance tasks common directory path?)

> [!IMPORTANT] 
> Batch .NET version 6.x replaces the **RunElevated** property with the new **UserIdentity** property of a task. This is a breaking change that requires that you update your code to use the new version. 
>
> The **UserIdentity** property specifies either the AutoUser account or a named user account as the account under which a task will run. See the section titled [Update your code for version 6.x](#update-your-code-for-version-6-x) for quick guidelines for updating your Batch .NET code for 6.x.
>
> 

## Create named user accounts

To create named user accounts, specify a list of user accounts for the [CloudPool](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudpool).[UserAccounts](https://docs.microsoft.com/dotnet/api/microsoft.azure.batch.cloudpool.useraccounts) property.

This code snippet shows how to create both admin and non-admin named accounts on a pool:

```csharp
CloudServiceConfiguration configuration = new CloudServiceConfiguration(OSFamily);
 
CloudPool currentPool = this.client.PoolOperations.CreatePool(
    poolId,
    VMSize,
    configuration,
    targetDedicated: 1);
    currentPool.UserAccounts = new List<UserAccount>()
    {
        new UserAccount(AdminUserAccountName, password, ElevationLevel.Admin),
        new UserAccount(NonAdminUserAccountName, password, ElevationLevel.NonAdmin),
    };
 
currentPool.Commit();
```

## Run a task as an elevated user

To run a task as an elevated user, set the task's UserIdentity property to either:

- The AutoUser specification, with its ElevationLevel property set to Admin.
- A named user account with its ElevationLevel property set to Admin.

### Run a task under the elevated AutoUser account

This code snippet creates a new instance of the AutoUserSpecification class and sets its ElevationLevel property to Admin, then assigns it to the task's UserIdentity property:

```csharp
UserIdentity = new UserIdentity(new AutoUserSpecification(elevationLevel: ElevationLevel.Admin))
```

### Run a task under an elevated named user account

This code snippet sets the UserIdentity property to the admin named user account created in the [Create named user accounts](#Create-named-user-accounts) section:

```csharp
\\\
```

## Run tasks under the same user account 




## Running tasks as the AutoUser

When you run a task under the AutoUser account, you can control the elevation level and the scope of access granted to the AutoUser.

### Elevation level

The AutoUser's elevation level indicates whether the AutoUser runs the task with elevated access. The two options for elevation level are:

- **NonAdmin (Default):** The AutoUser is a standard user without elevated access. 
- **Admin:** The AutoUser is a user with elevated access and operates with full Administrator permissions. 

To set the AutoUser's elevation level in Batch .NET, use the task's **UserIdentity** property. The **AutoUserSpecification** class configures the AutoUser account under which to run the task.



### Scope

The AutoUser's scope specifies whether the AutoUser's configuration applies to a single task (task scope), or applies to all tasks running on all nodes in a pool (pool scope). The default scope is different on Windows and Linux nodes:

- On Windows nodes, tasks run under task scope by default. With task scope, each task running on the same node runs under a different AutoUser account. The behavior is the same for nodes running the cloud service configuration or the virtual machine configuration.
- Linux nodes always run under pool scope. With pool scope, all tasks running on a given node run under the same AutoUser account.

## Running a task as a named user



## User accounts on Windows nodes




> [!NOTE] 
> The user accounts discussed in this article do not support Remote Desktop Protocol (RDP) or Secure Shell (SSH), for security reasons. 
>
> To connect to a node running the Linux virtual machine configuration via SSH, see [Use Remote Desktop to a Linux VM in Azure](../virtual-machines/virtual-machines-linux-use-remote-desktop.md). To connect to nodes running Windows via RDP, see [Connect to a Windows Server VM](../virtual-machines/windows/connect-logon.md). 
> 
> To connect to a node running the cloud service configuration via RDP, see [Enable Remote Desktop Connection for a Role in Azure Cloud Services](../cloud-services/cloud-services-role-enable-remote-desktop-new-portal.md).
>
>


## Update your code for version 6.x



