---
title: Deploy application packages to compute nodes
description: Use the application packages feature of Azure Batch to easily manage multiple applications and versions for installation on Batch compute nodes.
ms.topic: how-to
ms.date: 03/24/2021
ms.custom: 
   - H1Hack27Feb2017
   - devx-track-csharp
   - contperf-fy21q1

---
# Deploy applications to compute nodes with Batch application packages

Application packages can simplify the code in your Azure Batch solution and make it easier to manage the applications that your tasks run. With application packages, you can upload and manage multiple versions of applications your tasks run, including their supporting files. You can then automatically deploy one or more of these applications to the compute nodes in your pool.

The APIs for creating and managing application packages are part of the [Batch Management .NET](/dotnet/api/overview/azure/batch/management) library. The APIs for installing application packages on a compute node are part of the [Batch .NET](/dotnet/api/overview/azure/batch/client) library. Comparable features are in the available Batch APIs for other languages.

This article explains how to upload and manage application packages in the Azure portal. It also shows how to install them on a pool's compute nodes with the [Batch .NET](/dotnet/api/overview/azure/batch/client) library.

## Application package requirements

To use application packages, you need to [link an Azure Storage account](#link-a-storage-account) to your Batch account.

There are restrictions on the number of applications and application packages within a Batch account and on the maximum application package size. For more information, see [Quotas and limits for the Azure Batch service](batch-quota-limit.md).

> [!NOTE]
> Batch pools created prior to July 5, 2017 do not support application packages (unless they were created after March 10, 2016 using Cloud Services Configuration). The application packages feature described here supersedes the Batch Apps feature available in previous versions of the service.

## Understand applications and application packages

Within Azure Batch, an *application* refers to a set of versioned binaries that can be automatically downloaded to the compute nodes in your pool. An application contains one or more *application packages*, which represent different versions of the application.

Each *application package* is a .zip file that contains the application binaries and any supporting files. Only the .zip format is supported.

:::image type="content" source="media/batch-application-packages/app_pkg_01.png" alt-text="Diagram showing a high-level view of applications and application packages.":::

You can specify application packages at the pool or task level.

- **Pool application packages** are deployed to every node in the pool. Applications are deployed when a node joins a pool, and when it is rebooted or reimaged.
  
    Pool application packages are appropriate when all nodes in a pool will execute a job's tasks. You can specify one or more application packages to deploy when you create a pool. You can also add or update an existing pool's packages. To install a new package to an existing pool, you must restart its nodes.

- **Task application packages** are deployed only to a compute node scheduled to run a task, just before running the task's command line. If the specified application package and version is already on the node, it is not redeployed and the existing package is used.
  
    Task application packages are useful in shared-pool environments, where different jobs run on one pool, and the pool isn't deleted when a job completes. If your job has fewer tasks than nodes in the pool, task application packages can minimize data transfer, since your application is deployed only to the nodes that run tasks.
  
    Other scenarios that can benefit from task application packages are jobs that run a large application, but for only a few tasks. For example, task applications may be useful for a heavyweight pre-processing stage or a merge task.

With application packages, your pool's start task doesn't have to specify a long list of individual resource files to install on the nodes. You don't have to manually manage multiple versions of your application files in Azure Storage, or on your nodes. And you don't need to worry about generating [SAS URLs](../storage/common/storage-sas-overview.md) to provide access to the files in your Storage account. Batch works in the background with Azure Storage to store application packages and deploy them to compute nodes.

> [!NOTE]
> The total size of a start task must be less than or equal to 32768 characters, including resource files and environment variables. If your start task exceeds this limit, using application packages is another option. You can also create a .zip file containing your resource files, upload it as a blob to Azure Storage, and then unzip it from the command line of your start task.

## Upload and manage applications

You can use the [Azure portal](https://portal.azure.com) or the Batch Management APIs to manage the application packages in your Batch account. The following sections explain how to link a storage account, and how to add and manage applications and application packages in the Azure portal.

### Link a storage account

To use application packages, you must link an [Azure Storage account](accounts.md#azure-storage-accounts) to your Batch account. The Batch service will use the associated storage account to store your application packages. We recommend that you create a storage account specifically for use with your Batch account.

If you have not yet configured a storage account, the Azure portal displays a warning the first time you select **Applications** in your Batch account. To link a storage account to your Batch account, select **Storage account** on the **Warning** window, and then select **Storage Account** again.

After you've linked the two accounts, Batch can automatically deploy the packages stored in the linked Storage account to your compute nodes.

> [!IMPORTANT]
> You can't use application packages with Azure Storage accounts configured with [firewall rules](../storage/common/storage-network-security.md), or with **Hierarchical namespace** set to **Enabled**.

The Batch service uses Azure Storage to store your application packages as block blobs. You are [charged as normal](https://azure.microsoft.com/pricing/details/storage/) for the block blob data, and the size of each package can't exceed the maximum block blob size. For more information, see [Azure Storage scalability and performance targets for storage accounts](../storage/blobs/scalability-targets.md). To minimize costs, be sure to consider the size and number of your application packages, and periodically remove deprecated packages.

### View current applications

To view the applications in your Batch account, select **Applications** in the left navigation menu.

:::image type="content" source="media/batch-application-packages/app_pkg_02.png" alt-text="Screenshot of the Applications menu item in the Azure portal.":::

Selecting this menu option opens the **Applications** window. This window displays the ID of each application in your account and the following properties:

- **Packages**: The number of versions associated with this application.
- **Default version**: If applicable, the application version that will be installed if no version is specified when deploying the application.
- **Allow updates**: Specifies whether package updates and deletions are allowed.

To see the [file structure](files-and-directories.md) of the application package on a compute node, navigate to your Batch account in the Azure portal. Select **Pools**. then select the pool that contains the compute node. Select the compute node on which the application package is installed and open the **applications** folder.

### View application details

To see the details for an application, select it in the **Applications** window. You can configure the following settings for your application.

- **Allow updates**: Indicates whether application packages can be [updated or deleted](#update-or-delete-an-application-package). The default is **Yes**. If set to **No**, existing application packages can't be updated or deleted, but new application package versions can still be added.
- **Default version**: The default application package to use when the application is deployed, if no version is specified.
- **Display name**: A friendly name that your Batch solution can use when it displays information about the application. For example, this name can be used in the UI of a service that you provide to your customers through Batch.

### Add a new application

To create a new application, you add an application package and specify a unique application ID.

In your Batch account, select **Applications** and then select **Add**.

:::image type="content" source="media/batch-application-packages/app_pkg_05.png" alt-text="Screenshot of the New application creation process in the Azure portal.":::

Enter the following information:

- **Application ID**: The ID of your new application.
- **Version**": The version for the application package you are uploading.
- **Application package**: The .zip file containing the application binaries and supporting files that are required to execute the application.

The **Application ID** and **Version** you enter must follow these requirements:

- On Windows nodes, the ID can contain any combination of alphanumeric characters, hyphens, and underscores. On Linux nodes, only alphanumeric characters and underscores are permitted.
- Can't contain more than 64 characters.
- Must be unique within the Batch account.
- IDs are case-preserving and case-insensitive.

When you're ready, select **Submit**. After the .zip file has been uploaded to your Azure Storage account, the portal displays a notification. Depending on the size of the file that you are uploading and the speed of your network connection, this may take some time.

### Add a new application package

To add an application package version for an existing application, select the application in the **Applications** section of your Batch account, then select **Add**.

As you did for the new application, specify the **Version** for your new package, upload your .zip file in the **Application package** field, and then select **Submit**.

### Update or delete an application package

To update or delete an existing application package, select the application in the **Applications** section of your Batch account. Select the ellipsis in the row of the application package that you want to modify, then select the action that you want to perform.

:::image type="content" source="media/batch-application-packages/app_pkg_07.png" alt-text="Screenshot showing the update and delete options for application packages in the Azure portal.":::

If you select **Update**, you'll be able to upload a new .zip file. This will replace the previous .zip file that you uploaded for that version.

If you select **Delete**, you'll be prompted to confirm the deletion of that version. Once you select **OK**, Batch will delete the .zip file from your Azure Storage account. If you delete the default version of an application, the **Default version** setting is removed for that application.

## Install applications on compute nodes

Now that you've learned how to manage application packages in the Azure portal, we can discuss how to deploy them to compute nodes and run them with Batch tasks.

### Install pool application packages

To install an application package on all compute nodes in a pool, specify one or more application package references for the pool. The application packages that you specify for a pool are installed on each compute node that joins the pool, and on any node that is rebooted or reimaged.

In Batch .NET, specify one or more [CloudPool.ApplicationPackageReferences](/dotnet/api/microsoft.azure.batch.cloudpool.applicationpackagereferences) when you create a new pool, or for an existing pool. The [ApplicationPackageReference](/dotnet/api/microsoft.azure.batch.applicationpackagereference) class specifies an application ID and version to install on a pool's compute nodes.

```csharp
// Create the unbound CloudPool
CloudPool myCloudPool =
    batchClient.PoolOperations.CreatePool(
        poolId: "myPool",
        targetDedicatedComputeNodes: 1,
        virtualMachineSize: "standard_d1_v2",
        cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "5"));

// Specify the application and version to install on the compute nodes
myCloudPool.ApplicationPackageReferences = new List<ApplicationPackageReference>
{
    new ApplicationPackageReference {
        ApplicationId = "litware",
        Version = "1.1001.2b" }
};

// Commit the pool so that it's created in the Batch service. As the nodes join
// the pool, the specified application package is installed on each.
await myCloudPool.CommitAsync();
```

> [!IMPORTANT]
> If an application package deployment fails, the Batch service marks the node [unusable](/dotnet/api/microsoft.azure.batch.computenode.state), and no tasks are scheduled for execution on that node. If this happens, restart the node to reinitiate the package deployment. Restarting the node also enables task scheduling again on the node.

### Install task application packages

Similar to a pool, you specify application package references for a task. When a task is scheduled to run on a node, the package is downloaded and extracted just before the task's command line is executed. If a specified package and version is already installed on the node, the package is not downloaded and the existing package is used.

To install a task application package, configure the task's [CloudTask.ApplicationPackageReferences](/dotnet/api/microsoft.azure.batch.cloudtask.applicationpackagereferences) property:

```csharp
CloudTask task =
    new CloudTask(
        "litwaretask001",
        "cmd /c %AZ_BATCH_APP_PACKAGE_LITWARE%\\litware.exe -args -here");

task.ApplicationPackageReferences = new List<ApplicationPackageReference>
{
    new ApplicationPackageReference
    {
        ApplicationId = "litware",
        Version = "1.1001.2b"
    }
};
```

## Execute the installed applications

The packages that you've specified for a pool or task are downloaded and extracted to a named directory within the `AZ_BATCH_ROOT_DIR` of the node. Batch also creates an environment variable that contains the path to the named directory. Your task command lines use this environment variable when referencing the application on the node.

On Windows nodes, the variable is in the following format:

```
Windows:
AZ_BATCH_APP_PACKAGE_APPLICATIONID#version
```

On Linux nodes, the format is slightly different. Periods (.), hyphens (-) and number signs (#) are flattened to underscores in the environment variable. Also, note that the case of the application ID is preserved. For example:

```
Linux:
AZ_BATCH_APP_PACKAGE_applicationid_version
```

`APPLICATIONID` and `version` are values that correspond to the application and package version you've specified for deployment. For example, if you specified that version 2.7 of application *blender* should be installed on Windows nodes, your task command lines would use this environment variable to access its files:

```
Windows:
AZ_BATCH_APP_PACKAGE_BLENDER#2.7
```

On Linux nodes, specify the environment variable in this format. Flatten the periods (.), hyphens (-) and number signs (#) to underscores, and preserve the case of the application ID:

```
Linux:
AZ_BATCH_APP_PACKAGE_blender_2_7
```

When you upload an application package, you can specify a default version to deploy to your compute nodes. If you have specified a default version for an application, you can omit the version suffix when you reference the application. You can specify the default application version in the Azure portal, in the **Applications** window, as shown in [Upload and manage applications](#upload-and-manage-applications).

For example, if you set "2.7" as the default version for application *blender*, and your tasks reference the following environment variable, then your Windows nodes will execute version 2.7:

`AZ_BATCH_APP_PACKAGE_BLENDER`

The following code snippet shows an example task command line that launches the default version of the *blender* application:

```csharp
string taskId = "blendertask01";
string commandLine =
    @"cmd /c %AZ_BATCH_APP_PACKAGE_BLENDER%\blender.exe -args -here";
CloudTask blenderTask = new CloudTask(taskId, commandLine);
```

> [!TIP]
> For more information about compute node environment settings, see [Environment settings for tasks](jobs-and-tasks.md#environment-settings-for-tasks).

## Update a pool's application packages

If an existing pool has already been configured with an application package, you can specify a new package for the pool. This means:

- The Batch service installs the newly specified package on all new nodes that join the pool and on any existing node that is rebooted or reimaged.
- Compute nodes that are already in the pool when you update the package references do not automatically install the new application package. These compute nodes must be rebooted or reimaged to receive the new package.
- When a new package is deployed, the created environment variables reflect the new application package references.

In this example, the existing pool has version 2.7 of the *blender* application configured as one of its [CloudPool.ApplicationPackageReferences](/dotnet/api/microsoft.azure.batch.cloudpool.applicationpackagereferences). To update the pool's nodes with version 2.76b, specify a new [ApplicationPackageReference](/dotnet/api/microsoft.azure.batch.applicationpackagereference) with the new version, and commit the change.

```csharp
string newVersion = "2.76b";
CloudPool boundPool = await batchClient.PoolOperations.GetPoolAsync("myPool");
boundPool.ApplicationPackageReferences = new List<ApplicationPackageReference>
{
    new ApplicationPackageReference {
        ApplicationId = "blender",
        Version = newVersion }
};
await boundPool.CommitAsync();
```

Now that the new version has been configured, the Batch service installs version 2.76b to any new node that joins the pool. To install 2.76b on the nodes that are already in the pool, reboot or reimage them. Note that rebooted nodes retain files from previous package deployments.

## List the applications in a Batch account

You can list the applications and their packages in a Batch account by using the [ApplicationOperations.ListApplicationSummaries](/dotnet/api/microsoft.azure.batch.applicationoperations.listapplicationsummaries) method.

```csharp
// List the applications and their application packages in the Batch account.
List<ApplicationSummary> applications = await batchClient.ApplicationOperations.ListApplicationSummaries().ToListAsync();
foreach (ApplicationSummary app in applications)
{
    Console.WriteLine("ID: {0} | Display Name: {1}", app.Id, app.DisplayName);

    foreach (string version in app.Versions)
    {
        Console.WriteLine("  {0}", version);
    }
}
```

## Next steps

- The [Batch REST API](/rest/api/batchservice) also provides support to work with application packages. For example, see the [applicationPackageReferences](/rest/api/batchservice/pool/add#applicationpackagereference) element for how to specify packages to install, and [Applications](/rest/api/batchservice/application) for how to obtain application information.
- Learn how to programmatically [manage Azure Batch accounts and quotas with Batch Management .NET](batch-management-dotnet.md). The [Batch Management .NET](/dotnet/api/overview/azure/batch/management) library can enable account creation and deletion features for your Batch application or service.
