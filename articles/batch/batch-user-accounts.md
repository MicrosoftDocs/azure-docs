---
title: Run tasks under user accounts
description: Learn the types of user accounts and how to configure them.
ms.topic: how-to
ms.date: 11/18/2019
ms.custom: seodec18
---
# Run tasks under user accounts in Batch

> [!NOTE] 
> The user accounts discussed in this article are different from users accounts used for Remote Desktop Protocol (RDP) or Secure Shell (SSH), for security reasons. 
>
> To connect to a node running the Linux virtual machine configuration via SSH, see [Use Remote Desktop to a Linux VM in Azure](../virtual-machines/virtual-machines-linux-use-remote-desktop.md). To connect to nodes running Windows via RDP, see [Connect to a Windows Server VM](../virtual-machines/windows/connect-logon.md).<br /><br />
> To connect to a node running the cloud service configuration via RDP, see [Enable Remote Desktop Connection for a Role in Azure Cloud Services](../cloud-services/cloud-services-role-enable-remote-desktop-new-portal.md).

A task in Azure Batch always runs under a user account. By default, tasks run under standard user accounts, without administrator permissions. These default user account settings are typically sufficient. For certain scenarios, however, it's useful to be able to configure the user account under which you want a task to run. This article discusses the types of user accounts and how you can configure them for your scenario.

## Types of user accounts

Azure Batch provides two types of user accounts for running tasks:

- **Auto-user accounts.** Auto-user accounts are built-in user accounts that are created automatically by the Batch service. By default, tasks run under an auto-user account. You can configure the auto-user specification for a task to indicate under which auto-user account a task should run. The auto-user specification allows you to specify the elevation level and scope of the auto-user account that will run the task. 

- **A named user account.** You can specify one or more named user accounts for a pool when you create the pool. Each user account is created on each node of the pool. In addition to the account name, you specify the user account password, elevation level, and, for Linux pools, the SSH private key. When you add a task, you can specify the named user account under which that task should run.

> [!IMPORTANT] 
> The Batch service version 2017-01-01.4.0 introduces a breaking change that requires that you update your code to call that version. If you are migrating code from an older version of Batch, note that the **runElevated** property is no longer supported in the REST API or Batch client libraries. Use the new **userIdentity** property of a task to specify elevation level. See the section titled [Update your code to the latest Batch client library](#update-your-code-to-the-latest-batch-client-library) for quick guidelines for updating your Batch code if you are using one of the client libraries.
>
>

## User account access to files and directories

Both an auto-user account and a named user account have read/write access to the task’s working directory, shared directory, and multi-instance tasks directory. Both types of accounts have read access to the startup and job preparation directories.

If a task runs under the same account that was used for running a start task, the task has read-write access to the start task directory. Similarly, if a task runs under the same account that was used for running a job preparation task, the task has read-write access to the job preparation task directory. If a task runs under a different account than the start task or job preparation task, then the task has only read access to the respective directory.

For more information on accessing files and directories from a task, see [Files and directories](files-and-directories.md).

## Elevated access for tasks 

The user account's elevation level indicates whether a task runs with elevated access. Both an auto-user account and a named user account can run with elevated access. The two options for elevation level are:

- **NonAdmin:** The task runs as a standard user without elevated access. The default elevation level for a Batch user account is always **NonAdmin**.
- **Admin:** The task runs as a user with elevated access and operates with full Administrator permissions. 

## Auto-user accounts

By default, tasks run in Batch under an auto-user account, as a standard user without elevated access, and with task scope. When the auto-user specification is configured for task scope, the Batch service creates an auto-user account for that task only.

The alternative to task scope is pool scope. When the auto-user specification for a task is configured for pool scope, the task runs under an auto-user account that is available to any task in the pool. For more information about pool scope, see the section titled Run a task as the auto-user with pool scope.   

The default scope is different on Windows and Linux nodes:

- On Windows nodes, tasks run under task scope by default.
- Linux nodes always run under pool scope.

There are four possible configurations for the auto-user specification, each of which corresponds to a unique auto-user account:

- Non-admin access with task scope (the default auto-user specification)
- Admin (elevated) access with task scope
- Non-admin access with pool scope
- Admin access with pool scope

> [!IMPORTANT] 
> Tasks running under task scope do not have de facto access to other tasks on a node. However, a malicious user with access to the account could work around this restriction by submitting a task that runs with administrator privileges and accesses other task directories. A malicious user could also use RDP or SSH to connect to a node. It's important to protect access to your Batch account keys to prevent such a scenario. If you suspect your account may have been compromised, be sure to regenerate your keys.
>
>

### Run a task as an auto-user with elevated access

You can configure the auto-user specification for administrator privileges when you need to run a task with elevated access. For example, a start task may need elevated access to install software on the node.

> [!NOTE] 
> In general, it's best to use elevated access only when necessary. Best practices recommend granting the minimum privilege necessary to achieve the desired outcome. For example, if a start task installs software for the current user, instead of for all users, you may be able to avoid granting elevated access to tasks. You can configure the auto-user specification for pool scope and non-admin access for all tasks that need to run under the same account, including the start task. 
>
>

The following code snippets show how to configure the auto-user specification. The examples set the elevation level to `Admin` and the scope to `Task`. Task scope is the default setting, but is included here for the sake of example.

#### Batch .NET

```csharp
task.UserIdentity = new UserIdentity(new AutoUserSpecification(elevationLevel: ElevationLevel.Admin, scope: AutoUserScope.Task));
```
#### Batch Java

```java
taskToAdd.withId(taskId)
        .withUserIdentity(new UserIdentity()
            .withAutoUser(new AutoUserSpecification()
                .withElevationLevel(ElevationLevel.ADMIN))
                .withScope(AutoUserScope.TASK));
        .withCommandLine("cmd /c echo hello");                        
```

#### Batch Python

```python
user = batchmodels.UserIdentity(
    auto_user=batchmodels.AutoUserSpecification(
        elevation_level=batchmodels.ElevationLevel.admin,
        scope=batchmodels.AutoUserScope.task))
task = batchmodels.TaskAddParameter(
    id='task_1',
    command_line='cmd /c "echo hello world"',
    user_identity=user)
batch_client.task.add(job_id=jobid, task=task)
```

### Run a task as an auto-user with pool scope

When a node is provisioned, two pool-wide auto-user accounts are created on each node in the pool, one with elevated access, and one without elevated access. Setting the auto-user's scope to pool scope for a given task runs the task under one of these two pool-wide auto-user accounts. 

When you specify pool scope for the auto-user, all tasks that run with administrator access run under the same pool-wide auto-user account. Similarly, tasks that run without administrator permissions also run under a single pool-wide auto-user account. 

> [!NOTE] 
> The two pool-wide auto-user accounts are separate accounts. Tasks running under the pool-wide administrative account cannot share data with tasks running under the standard account, and vice versa. 
>
>

The advantage to running under the same auto-user account is that tasks are able to share data with other tasks running on the same node.

Sharing secrets between tasks is one scenario where running tasks under one of the two pool-wide auto-user accounts is useful. For example, suppose a start task needs to provision a secret onto the node that other tasks can use. You could use the Windows Data Protection API (DPAPI), but it requires administrator privileges. Instead, you can protect the secret at the user level. Tasks running under the same user account can access the secret without elevated access.

Another scenario where you may want to run tasks under an auto-user account with pool scope is a Message Passing Interface (MPI) file share. An MPI file share is useful when the nodes in the MPI task need to work on the same file data. The head node creates a file share that the child nodes can access if they are running under the same auto-user account. 

The following code snippet sets the auto-user's scope to pool scope for a task in Batch .NET. The elevation level is omitted, so the task runs under the standard pool-wide auto-user account.

```csharp
task.UserIdentity = new UserIdentity(new AutoUserSpecification(scope: AutoUserScope.Pool));
```

## Named user accounts

You can define named user accounts when you create a pool. A named user account has a name and password that you provide. You can specify the elevation level for a named user account. For Linux nodes, you can also provide an SSH private key.

A named user account exists on all nodes in the pool and is available to all tasks running on those nodes. You may define any number of named users for a pool. When you add a task or task collection, you can specify that the task runs under one of the named user accounts defined on the pool.

A named user account is useful when you want to run all tasks in a job under the same user account, but isolate them from tasks running in other jobs at the same time. For example, you can create a named user for each job, and run each job's tasks under that named user account. Each job can then share a secret with its own tasks, but not with tasks running in other jobs.

You can also use a named user account to run a task that sets permissions on external resources such as file shares. With a named user account, you control the user identity and can use that user identity to set permissions.  

Named user accounts enable password-less SSH between Linux nodes. You can use a named user account with Linux nodes that need to run multi-instance tasks. Each node in the pool can run tasks under a user account defined on the whole pool. For more information about multi-instance tasks, see [Use multi\-instance tasks to run MPI applications](batch-mpi.md).

### Create named user accounts

To create named user accounts in Batch, add a collection of user accounts to the pool. The following code snippets show how to create named user accounts in .NET, Java, and Python. These code snippets show how to create both admin and non-admin named accounts on a pool. The examples create pools using the cloud service configuration, but you use the same approach when creating a Windows or Linux pool using the virtual machine configuration.

#### Batch .NET example (Windows)

```csharp
CloudPool pool = null;
Console.WriteLine("Creating pool [{0}]...", poolId);

// Create a pool using the cloud service configuration.
pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 3,
    virtualMachineSize: "standard_d1_v2",
    cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "5"));   

// Add named user accounts.
pool.UserAccounts = new List<UserAccount>
{
    new UserAccount("adminUser", "xyz123", ElevationLevel.Admin),
    new UserAccount("nonAdminUser", "123xyz", ElevationLevel.NonAdmin),
};

// Commit the pool.
await pool.CommitAsync();
```

#### Batch .NET example (Linux)

```csharp
CloudPool pool = null;

// Obtain a collection of all available node agent SKUs.
List<NodeAgentSku> nodeAgentSkus =
    batchClient.PoolOperations.ListNodeAgentSkus().ToList();

// Define a delegate specifying properties of the VM image to use.
Func<ImageReference, bool> isUbuntu1404 = imageRef =>
    imageRef.Publisher == "Canonical" &&
    imageRef.Offer == "UbuntuServer" &&
    imageRef.Sku.Contains("14.04");

// Obtain the first node agent SKU in the collection that matches
// Ubuntu Server 14.04. 
NodeAgentSku ubuntuAgentSku = nodeAgentSkus.First(sku =>
    sku.VerifiedImageReferences.Any(isUbuntu1404));

// Select an ImageReference from those available for node agent.
ImageReference imageReference =
    ubuntuAgentSku.VerifiedImageReferences.First(isUbuntu1404);

// Create the virtual machine configuration to use to create the pool.
VirtualMachineConfiguration virtualMachineConfiguration =
    new VirtualMachineConfiguration(imageReference, ubuntuAgentSku.Id);

Console.WriteLine("Creating pool [{0}]...", poolId);

// Create the unbound pool.
pool = batchClient.PoolOperations.CreatePool(
    poolId: poolId,
    targetDedicatedComputeNodes: 3,                                             
    virtualMachineSize: "Standard_A1",                                      
    virtualMachineConfiguration: virtualMachineConfiguration);                  

// Add named user accounts.
pool.UserAccounts = new List<UserAccount>
{
    new UserAccount(
        name: "adminUser",
        password: "xyz123",
        elevationLevel: ElevationLevel.Admin,
        linuxUserConfiguration: new LinuxUserConfiguration(
            uid: 12345,
            gid: 98765,
            sshPrivateKey: new Guid().ToString()
            )),
    new UserAccount(
        name: "nonAdminUser",
        password: "123xyz",
        elevationLevel: ElevationLevel.NonAdmin,
        linuxUserConfiguration: new LinuxUserConfiguration(
            uid: 45678,
            gid: 98765,
            sshPrivateKey: new Guid().ToString()
            )),
};

// Commit the pool.
await pool.CommitAsync();
```


#### Batch Java example

```java
List<UserAccount> userList = new ArrayList<>();
userList.add(new UserAccount().withName(adminUserAccountName).withPassword(adminPassword).withElevationLevel(ElevationLevel.ADMIN));
userList.add(new UserAccount().withName(nonAdminUserAccountName).withPassword(nonAdminPassword).withElevationLevel(ElevationLevel.NONADMIN));
PoolAddParameter addParameter = new PoolAddParameter()
        .withId(poolId)
        .withTargetDedicatedNodes(POOL_VM_COUNT)
        .withVmSize(POOL_VM_SIZE)
        .withCloudServiceConfiguration(configuration)
        .withUserAccounts(userList);
batchClient.poolOperations().createPool(addParameter);
```

#### Batch Python example

```python
users = [
    batchmodels.UserAccount(
        name='pool-admin',
        password='******',
        elevation_level=batchmodels.ElevationLevel.admin)
    batchmodels.UserAccount(
        name='pool-nonadmin',
        password='******',
        elevation_level=batchmodels.ElevationLevel.non_admin)
]
pool = batchmodels.PoolAddParameter(
    id=pool_id,
    user_accounts=users,
    virtual_machine_configuration=batchmodels.VirtualMachineConfiguration(
        image_reference=image_ref_to_use,
        node_agent_sku_id=sku_to_use),
    vm_size=vm_size,
    target_dedicated=vm_count)
batch_client.pool.add(pool)
```

### Run a task under a named user account with elevated access

To run a task as an elevated user, set the task's **UserIdentity** property to a named user account that was created with its **ElevationLevel** property set to `Admin`.

This code snippet specifies that the task should run under a named user account. This named user account was defined on the pool when the pool was created. In this case, the named user account was created with admin permissions:

```csharp
CloudTask task = new CloudTask("1", "cmd.exe /c echo 1");
task.UserIdentity = new UserIdentity(AdminUserAccountName);
```

## Update your code to the latest Batch client library

The Batch service version 2017-01-01.4.0 introduces a breaking change, replacing the **runElevated** property available in earlier versions with the **userIdentity** property. The following tables provide a simple mapping that you can use to update your code from earlier versions of the client libraries.

### Batch .NET

| If your code uses...                  | Update it to....                                                                                                 |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------|
| `CloudTask.RunElevated = true;`       | `CloudTask.UserIdentity = new UserIdentity(new AutoUserSpecification(elevationLevel: ElevationLevel.Admin));`    |
| `CloudTask.RunElevated = false;`      | `CloudTask.UserIdentity = new UserIdentity(new AutoUserSpecification(elevationLevel: ElevationLevel.NonAdmin));` |
| `CloudTask.RunElevated` not specified | No update required                                                                                               |

### Batch Java

| If your code uses...                      | Update it to....                                                                                                                       |
|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `CloudTask.withRunElevated(true);`        | `CloudTask.withUserIdentity(new UserIdentity().withAutoUser(new AutoUserSpecification().withElevationLevel(ElevationLevel.ADMIN));`    |
| `CloudTask.withRunElevated(false);`       | `CloudTask.withUserIdentity(new UserIdentity().withAutoUser(new AutoUserSpecification().withElevationLevel(ElevationLevel.NONADMIN));` |
| `CloudTask.withRunElevated` not specified | No update required                                                                                                                     |

### Batch Python

| If your code uses...                      | Update it to....                                                                                                                       |
|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `run_elevated=True`                       | `user_identity=user`, where <br />`user = batchmodels.UserIdentity(`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`auto_user=batchmodels.AutoUserSpecification(`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`elevation_level=batchmodels.ElevationLevel.admin))`                |
| `run_elevated=False`                      | `user_identity=user`, where <br />`user = batchmodels.UserIdentity(`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`auto_user=batchmodels.AutoUserSpecification(`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`elevation_level=batchmodels.ElevationLevel.non_admin))`             |
| `run_elevated` not specified | No update required                                                                                                                                  |


## Next steps

* Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
* Learn about [files and directories](files-and-directories.md) in Azure Batch.
