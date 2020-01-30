---
title: Install application packages on compute nodes - Azure Batch | Microsoft Docs
description: Use the application packages feature of Azure Batch to easily manage multiple applications and versions for installation on Batch compute nodes.
services: batch
documentationcenter: .net
author: ju-shim
manager: gwallace
editor: ''

ms.assetid: 3b6044b7-5f65-4a27-9d43-71e1863d16cf
ms.service: batch
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 04/26/2019
ms.author: jushiman
ms.custom: H1Hack27Feb2017

---
# Deploy applications to compute nodes with Batch application packages

The application packages feature of Azure Batch provides easy management of task applications and their deployment to the compute nodes in your pool. With application packages, you can upload and manage multiple versions of the applications your tasks run, including their supporting files. You can then automatically deploy one or more of these applications to the compute nodes in your pool.

In this article, you learn how to upload and manage application packages in the Azure portal. You then learn how to install them on a pool's compute nodes with the [Batch .NET][api_net] library.

> [!NOTE]
> Application packages are supported on all Batch pools created after 5 July 2017. They are supported on Batch pools created between 10 March 2016 and 5 July 2017 only if the pool was created using a Cloud Service configuration. Batch pools created prior to 10 March 2016 do not support application packages.
>
> The APIs for creating and managing application packages are part of the [Batch Management .NET][api_net_mgmt] library. The APIs for installing application packages on a compute node are part of the [Batch .NET][api_net] library. Comparable features are in the available Batch APIs for other languages. 
>
> The application packages feature described here supersedes the Batch Apps feature available in previous versions of the service.

## Application package requirements
To use application packages, you need to [link an Azure Storage account](#link-a-storage-account) to your Batch account.

## About applications and application packages
Within Azure Batch, an *application* refers to a set of versioned binaries that can be automatically downloaded to the compute nodes in your pool. An *application package* refers to a *specific set* of those binaries and represents a given *version* of the application.

![High-level diagram of applications and application packages][1]

### Applications
An application in Batch contains one or more application packages and specifies configuration options for the application. For example, an application can specify the default application package version to install on compute nodes and whether its packages can be updated or deleted.

### Application packages
An application package is a .zip file that contains the application binaries and supporting files that are required for your tasks to run the application. Each application package represents a specific version of the application.

You can specify application packages at the pool and task levels. You can specify one or more of these packages and (optionally) a version when you create a pool or task.

* **Pool application packages** are deployed to *every* node in the pool. Applications are deployed when a node joins a pool, and when it is rebooted or reimaged.
  
    Pool application packages are appropriate when all nodes in a pool execute a job's tasks. You can specify one or more application packages when you create a pool, and you can add or update an existing pool's packages. If you update an existing pool's application packages, you must restart its nodes to install the new package.
* **Task application packages** are deployed only to a compute node scheduled to run a task, just before running the task's command line. If the specified application package and version is already on the node, it is not redeployed and the existing package is used.
  
    Task application packages are useful in shared-pool environments, where different jobs are run on one pool, and the pool is not deleted when a job is completed. If your job has fewer tasks than nodes in the pool, task application packages can minimize data transfer since your application is deployed only to the nodes that run tasks.
  
    Other scenarios that can benefit from task application packages are jobs that run a large application, but for only a few tasks. For example, a pre-processing stage or a merge task, where the pre-processing or merge application is heavyweight, may benefit from using task application packages.

> [!IMPORTANT]
> There are restrictions on the number of applications and application packages within a Batch account and on the maximum application package size. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for details about these limits.
> 
> 

### Benefits of application packages
Application packages can simplify the code in your Batch solution and lower the overhead required to manage the applications that your tasks run.

With application packages, your pool's start task doesn't have to specify a long list of individual resource files to install on the nodes. You don't have to manually manage multiple versions of your application files in Azure Storage, or on your nodes. And, you don't need to worry about generating [SAS URLs](../storage/common/storage-dotnet-shared-access-signature-part-1.md) to provide access to the files in your Storage account. Batch works in the background with Azure Storage to store application packages and deploy them to compute nodes.

> [!NOTE] 
> The total size of a start task must be less than or equal to 32768 characters, including resource files and environment variables. If your start task exceeds this limit, then using application packages is another option. You can also create a zipped archive containing your resource files, upload it as a blob to Azure Storage, and then unzip it from the command line of your start task. 
>
>

## Upload and manage applications
You can use the [Azure portal][portal] or the Batch Management APIs to manage the application packages in your Batch account. In the next few sections, we first show how to link a Storage account, then discuss adding applications and packages and managing them with the portal.

### Link a Storage account
To use application packages, you must first link an [Azure Storage account](batch-api-basics.md#azure-storage-account) to your Batch account. If you have not yet configured a Storage account, the Azure portal displays a warning the first time you click **Applications** in your Batch account.



!['No storage account configured' warning in Azure portal][9]

The Batch service uses the associated Storage account to store your application packages. After you've linked the two accounts, Batch can automatically deploy the packages stored in the linked Storage account to your compute nodes. To link a Storage account to your Batch account, click **Storage account** on the **Warning** window, and then click **Storage Account** again.

![Choose storage account blade in Azure portal][10]

We recommend that you create a Storage account *specifically* for use with your Batch account, and select it here. After you've created a Storage account, you can then link it to your Batch account by using the **Storage Account** window.

> [!NOTE] 
> Currently you can't use application packages with an Azure Storage account that is configured with [firewall rules](../storage/common/storage-network-security.md).
> 

The Batch service uses Azure Storage to store your application packages as block blobs. You are [charged as normal][storage_pricing] for the block blob data, and the size of each package can't exceed the maximum block blob size. For more information, see [Azure Storage scalability and performance targets for storage accounts](../storage/blobs/scalability-targets.md). Be sure to consider the size and number of your application packages, and periodically remove deprecated packages to minimize costs.
> 
> 

### View current applications
To view the applications in your Batch account, click the **Applications** menu item in the left menu while viewing your **Batch account**.

![Applications tile][2]

Selecting this menu option opens the **Applications** window:

![List applications][3]

This window displays the ID of each application in your account and the following properties:

* **Packages**: The number of versions associated with this application.
* **Default version**: The application version installed if you do not indicate a version when you specify the application for a pool. This setting is optional.
* **Allow updates**: The value that specifies whether package updates, deletions, and additions are allowed. If this is set to **No**, package updates and deletions are disabled for the application. Only new application package versions can be added. The default is **Yes**.

If you'd like to see the file structure of the application package on your compute node, navigate to your Batch account in the portal. From your Batch account, navigate to **Pools**. Select the pool that contains the compute node(s) you're interested in.

![Nodes in pool][13]

Once you've selected your pool, navigate to the compute node that the application package is installed on. From there, the details of the application package are located in the **applications** folder. Additional folders on the compute node contain other files, such as start tasks, output files, error output, etc.

![Files on node][14]

### View application details
To see the details for an application, select the application in the **Applications** window.

![Application details][4]

In the application details, you can configure the following settings for your application.

* **Allow updates**: Specify whether its application packages can be updated or deleted. See "Update or Delete an application package" later in this article.
* **Default version**: Specify a default application package to deploy to compute nodes.
* **Display name**: Specify a friendly name that your Batch solution can use when it displays information about the application, for example, in the UI of a service that you provide to your customers through Batch.

### Add a new application
To create a new application, add an application package and specify a new, unique application ID. The first application package that you add with the new application ID also creates the new application.

Click **Applications** > **Add**.

![New application blade in Azure portal][5]

The **New application** window provides the following fields to specify the settings of your new application and application package.

**Application ID**

This field specifies the ID of your new application, which is subject to the standard Azure Batch ID validation rules. The rules for providing an application ID are as follows:

* On Windows nodes, the ID can contain any combination of alphanumeric characters, hyphens, and underscores. On Linux nodes, only alphanumeric characters and underscores are permitted.
* Cannot contain more than 64 characters.
* Must be unique within the Batch account.
* Is case-preserving and case-insensitive.

**Version**

This field specifies the version of the application package you are uploading. Version strings are subject to the following validation rules:

* On Windows nodes, the version string can contain any combination of alphanumeric characters, hyphens, underscores, and periods. On Linux nodes, the version string can contain only alphanumeric characters and underscores.
* Cannot contain more than 64 characters.
* Must be unique within the application.
* Are case-preserving and case-insensitive.

**Application package**

This field specifies the .zip file that contains the application binaries and supporting files that are required to execute the application. Click the **Select a file** box or the folder icon to browse to and select a .zip file that contains your application's files.

After you've selected a file, click **OK** to begin the upload to Azure Storage. When the upload operation is complete, the portal displays a notification. Depending on the size of the file that you are uploading and the speed of your network connection, this operation may take some time.

> [!WARNING]
> Do not close the **New application** window before the upload operation is complete. Doing so stops the upload process.
> 
> 

### Add a new application package
To add an application package version for an existing application, select an application in the **Applications** windows, and click **Packages** > **Add**.

![Add application package blade in Azure portal][8]

As you can see, the fields match those of the **New application** window, but the **Application ID** box is disabled. As you did for the new application, specify the **Version** for your new package, browse to your **Application package** .zip file, then click **OK** to upload the package.

### Update or delete an application package
To update or delete an existing application package, open the details for the application, click **Packages**, click the **ellipsis** in the row of the application package that you want to modify, and select the action that you want to perform.

![Update or delete package in Azure portal][7]

**Update**

When you click **Update**, the **Update package** windows is displayed. This window is similar to the **New application package** window, however only the package selection field is enabled, allowing you to specify a new ZIP file to upload.

![Update package blade in Azure portal][11]

**Delete**

When you click **Delete**, you are asked to confirm the deletion of the package version, and Batch deletes the package from Azure Storage. If you delete the default version of an application, the **Default version** setting is removed for the application.

![Delete application ][12]

## Install applications on compute nodes
Now that you've learned how to manage application packages with the Azure portal, we can discuss how to deploy them to compute nodes and run them with Batch tasks.

### Install pool application packages
To install an application package on all compute nodes in a pool, specify one or more application package *references* for the pool. The application packages that you specify for a pool are installed on each compute node when that node joins the pool, and when the node is rebooted or reimaged.

In Batch .NET, specify one or more [CloudPool][net_cloudpool].[ApplicationPackageReferences][net_cloudpool_pkgref] when you create a new pool, or for an existing pool. The [ApplicationPackageReference][net_pkgref] class specifies an application ID and version to install on a pool's compute nodes.

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
> If an application package deployment fails for any reason, the Batch service marks the node [unusable][net_nodestate], and no tasks are scheduled for execution on that node. In this case, you should **restart** the node to reinitiate the package deployment. Restarting the node also enables task scheduling again on the node.
> 
> 

### Install task application packages
Similar to a pool, you specify application package *references* for a task. When a task is scheduled to run on a node, the package is downloaded and extracted just before the task's command line is executed. If a specified package and version is already installed on the node, the package is not downloaded and the existing package is used.

To install a task application package, configure the task's [CloudTask][net_cloudtask].[ApplicationPackageReferences][net_cloudtask_pkgref] property:

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
> See [Environment settings for tasks](batch-api-basics.md#environment-settings-for-tasks) in the [Batch feature overview](batch-api-basics.md) for more information about compute node environment settings.
> 
> 

## Update a pool's application packages
If an existing pool has already been configured with an application package, you can specify a new package for the pool. If you specify a new package reference for a pool, the following apply:

* The Batch service installs the newly specified package on all new nodes that join the pool and on any existing node that is rebooted or reimaged.
* Compute nodes that are already in the pool when you update the package references do not automatically install the new application package. These compute nodes must be rebooted or reimaged to receive the new package.
* When a new package is deployed, the created environment variables reflect the new application package references.

In this example, the existing pool has version 2.7 of the *blender* application configured as one of its [CloudPool][net_cloudpool].[ApplicationPackageReferences][net_cloudpool_pkgref]. To update the pool's nodes with version 2.76b, specify a new [ApplicationPackageReference][net_pkgref] with the new version, and commit the change.

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

Now that the new version has been configured, the Batch service installs version 2.76b to any *new* node that joins the pool. To install 2.76b on the nodes that are *already* in the pool, reboot or reimage them. Note that rebooted nodes retain the files from previous package deployments.

## List the applications in a Batch account
You can list the applications and their packages in a Batch account by using the [ApplicationOperations][net_appops].[ListApplicationSummaries][net_appops_listappsummaries] method.

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

## Wrap up
With application packages, you can help your customers select the applications for their jobs and specify the exact version to use when processing jobs with your Batch-enabled service. You might also provide the ability for your customers to upload and track their own applications in your service.

## Next steps
* The [Batch REST API][api_rest] also provides support to work with application packages. For example, see the [applicationPackageReferences][rest_add_pool_with_packages] element in [Add a pool to an account][rest_add_pool] for information about how to specify packages to install by using the REST API. See [Applications][rest_applications] for details about how to obtain application information by using the Batch REST API.
* Learn how to programmatically [manage Azure Batch accounts and quotas with Batch Management .NET](batch-management-dotnet.md). The [Batch Management .NET][api_net_mgmt] library can enable account creation and deletion features for your Batch application or service.

[api_net]: https://docs.microsoft.com/dotnet/api/overview/azure/batch/client?view=azure-dotnet
[api_net_mgmt]: https://docs.microsoft.com/dotnet/api/overview/azure/batch/management?view=azure-dotnet
[api_rest]: https://docs.microsoft.com/rest/api/batchservice/
[batch_mgmt_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/
[github_samples]: https://github.com/Azure/azure-batch-samples
[storage_pricing]: https://azure.microsoft.com/pricing/details/storage/
[net_appops]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.applicationoperations.aspx
[net_appops_listappsummaries]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.applicationoperations.listapplicationsummaries.aspx
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_cloudpool_pkgref]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.applicationpackagereferences.aspx
[net_cloudtask]: https://msdn.microsoft.com/library/microsoft.azure.batch.cloudtask.aspx
[net_cloudtask_pkgref]: https://msdn.microsoft.com/library/microsoft.azure.batch.cloudtask.applicationpackagereferences.aspx
[net_nodestate]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.state.aspx
[net_pkgref]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.applicationpackagereference.aspx
[portal]: https://portal.azure.com
[rest_applications]: https://msdn.microsoft.com/library/azure/mt643945.aspx
[rest_add_pool]: https://msdn.microsoft.com/library/azure/dn820174.aspx
[rest_add_pool_with_packages]: https://msdn.microsoft.com/library/azure/dn820174.aspx#bk_apkgreference

[1]: ./media/batch-application-packages/app_pkg_01.png "Application packages high-level diagram"
[2]: ./media/batch-application-packages/app_pkg_02.png "Applications tile in Azure portal"
[3]: ./media/batch-application-packages/app_pkg_03.png "Applications blade in Azure portal"
[4]: ./media/batch-application-packages/app_pkg_04.png "Application details blade in Azure portal"
[5]: ./media/batch-application-packages/app_pkg_05.png "New application blade in Azure portal"
[7]: ./media/batch-application-packages/app_pkg_07.png "Update or delete packages drop-down in Azure portal"
[8]: ./media/batch-application-packages/app_pkg_08.png "New application package blade in Azure portal"
[9]: ./media/batch-application-packages/app_pkg_09.png "No linked Storage account alert"
[10]: ./media/batch-application-packages/app_pkg_10.png "Choose storage account blade in Azure portal"
[11]: ./media/batch-application-packages/app_pkg_11.png "Update package blade in Azure portal"
[12]: ./media/batch-application-packages/app_pkg_12.png "Delete package confirmation dialog in Azure portal"
[13]: ./media/batch-application-packages/package-file-structure.png "Compute node information in Azure portal"
[14]: ./media/batch-application-packages/package-file-structure-node.png "Files on the compute node displayed in Azure portal"
