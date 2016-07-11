<properties
	pageTitle="Easy application installation and management in Azure Batch | Microsoft Azure"
	description="Use the application packages feature of Azure Batch to easily manage multiple applications and versions for installation on Batch compute nodes."
	services="batch"
	documentationCenter=".net"
	authors="mmacy"
	manager="timlt"
	editor="" />

<tags
	ms.service="batch"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows"
	ms.workload="big-compute"
	ms.date="06/30/2016"
	ms.author="marsma" />

# Application deployment with Azure Batch application packages

The application packages feature of Azure Batch provides easy management and deployment of applications to the compute nodes in your pool. With application packages, you can upload and manage multiple versions of the applications run by your tasks, including binaries and supporting files, then automatically deploy one or more of these applications to the compute nodes in your pool.

In this article, you will learn how to upload and manage application packages using the Azure portal, then install them on a pool's compute nodes using the [Batch .NET][api_net] library.

> [AZURE.NOTE] The application packages feature described here supersedes the "Batch Apps" feature available in previous versions of the service.

## Application packages requirements

The application packages feature discussed in this article is compatible *only* with Batch pools created after 10 March 2016. Application packages will not be deployed to compute nodes in pools created before this date.

This feature was introduced in [Batch REST API][api_rest] version 2015-12-01.2.2, and the corresponding [Batch .NET][api_net] library version 3.1.0. We recommend that you always use the latest API version when working with Batch.

> [AZURE.IMPORTANT] Application packages are currently only supported by pools created with **CloudServiceConfiguration**. You cannot use Application packages in pools created with VirtualMachineConfiguration images. See the [Virtual Machine Configuration](batch-linux-nodes.md#virtual-machine-configuration) section of [Provision Linux compute nodes in Azure Batch pools](batch-linux-nodes.md) for more information about the two different configurations.

## About applications and application packages

Within Azure Batch, an **application** refers to a set of versioned binaries that can be automatically downloaded to the compute nodes in your pool. An **application package** refers to a *specific set* of those binaries, and represents a given *version* of the application.

![High-level diagram of applications and application packages][1]

### Applications

An application in Batch contains one or more application packages. It specifies configuration options for the application such as the default application package version to install on compute nodes, and whether its packages may be updated or deleted.

### Application packages

An application package is a ZIP file containing the application binaries and supporting files required for execution by your tasks. Each application package represents a specific version of the application. When you create a pool in the Batch service, you can specify one or more of these applications and (optionally) a version, and those application packages will be downloaded automatically and extracted onto each node as it joins the pool.

> [AZURE.IMPORTANT] There are restrictions on the number of applications and application packages within a Batch account, as well as the maximum application package size. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for details on these limits.

### Benefits of application packages

Application packages can simplify the code in your Batch solution, as well as lower the overhead required in managing the applications your tasks run.

With application packages, your pool's start task doesn't have to specify a long list of individual resource files to install on the nodes. You don't have to manually manage multiple versions of these files in Azure Storage, or on your nodes. And, you don't need to worry about generating [SAS URLs](../storage/storage-dotnet-shared-access-signature-part-1.md) to provide access to the files in your Azure Storage account.

Batch handles the details of working with Azure Storage in the background to store and deploy application packages to compute nodes, so both your code and your management overhead can be simplified.

## Upload and manage applications

Using the Azure portal, you can add, update, and delete application packages, and configure default versions for each application.

In the next few sections, we'll first cover associating a Storage account with your Batch account, then review the package management features available in the Azure portal. After that, you'll learn how to deploy these packages to compute nodes using the [Batch .NET][api_net] library.

### Link a Storage account

In order to use application packages, you must first link an Azure Storage account to your Batch account. If you have not yet configured a Storage account for your Batch account, the Azure portal will display a warning the first time you click the *Applications* tile in the Batch account blade.

> [AZURE.IMPORTANT] Batch currently supports *only* the **General purpose** storage account type, as described in step #5 [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md). When you link an Azure Storage account to your Batch account, link *only* a **General purpose** storage account.

![No storage account configured warning in Azure portal][9]

The Batch service uses the associated Storage account for the storage and retrieval of application packages. Once you've linked the two accounts, Batch can automatically deploy the packages stored in the linked Storage account to your compute nodes. Click **Storage account settings** on the *Warning* blade, then **Storage Account** on the *Storage Account* blade to link a storage account to your Batch account.

![Choose storage account blade in Azure portal][10]

We recommend that you create a storage account *specifically* for use with your Batch account, and select it here. For details on creating a storage account, see "Create a storage account" in [About Azure storage accounts](../storage/storage-create-storage-account.md). Once you've created a Storage account, you may then link it to your Batch account using the *Storage Account* blade.

> [AZURE.WARNING] Because Batch stores your application packages using Azure Storage, you are [charged as normal][storage_pricing] for the block blob data. Be sure to consider the size and number of your application packages, and periodically remove deprecated packages to minimize cost.

### View current applications

To view the applications in your Batch account, click the **Applications** tile in the Batch account blade.

![Applications tile][2]

This opens the *Applications* blade:

![List applications][3]

The *Applications* blade displays the ID of each application in your account, as well as the following properties:

* **Packages** - The number of versions associated with this application.
* **Default version** – If you do not specify a version when setting the application for a pool, this version will be installed. This setting is optional.
* **Allow updates** – If this is set to *No*, package updates and deletions are disabled for the application--only new application package versions can be added. The default is *Yes*.

### View application details

Clicking on an application in the *Applications* blade displays the details blade for that application.

![Application details][4]

In the application details blade, you can configure the following settings for your application.

* **Allow updates** - Specify whether its application packages can be updated or deleted (see "Update or Delete an application package" below).
* **Default version** - Specify a default application package to deploy to compute nodes.
* **Display name** - This is a "friendly" name that your Batch solution can use when displaying information about the application, such as in the UI of a service you provide your customers through Batch.

### Add a new application

To create a new application, add an application package using a new, unique application id. The first application package that you add using the new application id will also create the new application.

Click **Add** on the *Applications* blade to open the *New application* blade.

![New application blade in Azure portal][5]

The *New application* blade provides the following fields for specifying the settings of your new application and application package.

**Application id**

This specifies the id of your new application, which is subject to the standard Azure Batch ID validation rules:

* Can contain any combination of alphanumeric characters, including hyphens and underscores.
* Cannot contain more than 64 characters.
* Must be unique within the Batch account.
* Case preserving, and case insensitive.

**Version**

Specifies the version of the application package you are uploading. Version strings are subject to the following validation rules:

* Can contain any combination of alphanumeric characters, including hyphens, underscores, and periods.
* Cannot contain more than 64 characters.
* Must be unique within the application.
* Case preserving, and case insensitive.

**Application package**

This specifies the ZIP file containing the application binaries and any supporting files required to execute the application. Click the **Select a file** text box or the folder icon to browse to and select a ZIP file containing your application's files.

Once you've selected a file, click **OK** to begin the upload to Azure Storage. When the upload operation completes, you will be notified and the blade will close. Note that depending on the size of the file that you are uploading and the speed of your network connection, this operation may take some time.

> [AZURE.WARNING] Do not close the *New application* blade before the upload operation is complete. Doing so will abort the upload process.

### Add a new application package

To add a new application package version for an existing application, select an application in the *Applications* blade, click **Packages**, then click **Add** to display the *Add package* blade.

![Add application package blade in Azure portal][8]

As you can see, the fields match those of the *New application* blade, except for the disabled "Application id" text box. As above, specify the **Version** for your new package, browse to your **Application package** ZIP file, then click **OK** to upload the package.

### Update or Delete an application package

To update or delete an existing application package, open the details blade for the application, click **Packages** to display the *Packages* blade, click the **ellipsis** in the row of the application package you wish to modify, and select the action you wish to perform.

![Update or delete package in Azure portal][7]

**Update**

When you click **Update**, the *Update package* blade is displayed. This blade is similar to the *New application package* blade, however only the package selection field is enabled, allowing you to specify a new ZIP file to upload.

![Update package blade in Azure portal][11]

**Delete**

When you click **Delete**, you are asked to confirm the deletion of the package version, and Batch deletes the package from Azure Storage. If you delete the default version of an application, the default version setting is removed for the application.

![Delete application ][12]

## Install applications on compute nodes

Now that we've covered uploading and managing application packages using the Azure portal, we are ready to discuss actually deploying them to compute nodes and running them with Batch tasks.

To install an application package on the compute nodes in a pool, you specify one or more application package *references* for the pool. In Batch .NET, you do so by adding one or more [CloudPool][net_cloudpool].[ApplicationPackageReferences][net_cloudpool_pkgref] when you create the pool, or to an existing pool.

The [ApplicationPackageReference][net_pkgref] class specifies an application ID and version to install on a pool's compute nodes.

```csharp
// Create the unbound CloudPool
CloudPool myCloudPool =
    batchClient.PoolOperations.CreatePool(
        poolId: "myPool",
        targetDedicated: "1",
        virtualMachineSize: "small",
        cloudServiceConfiguration: new CloudServiceConfiguration(osFamily: "4"));

// Specify the application and version to install on the compute nodes
myCloudPool.ApplicationPackageReferences = new List<ApplicationPackageReference>
{
    new ApplicationPackageReference {
        ApplicationId = "litware",
        Version = "1.1001.2b" }
};

// Commit the pool so that it's created in the Batch service. As the nodes join
// the pool, the specified application package will be installed on each.
await myCloudPool.CommitAsync();
```

The application packages that you specify for a pool are installed on each compute node when that node joins the pool, and when the node is rebooted or reimaged. If an application package deployment fails for any reason, the Batch service marks the node [unusable][net_nodestate] and no tasks will be scheduled for execution on that node. In this case, you should **restart** the node to reinitiate the package deployment (restarting the node will also re-enable task scheduling on the node).

## Execute the installed applications

As each compute node joins a pool (or is rebooted or reimaged) the packages you've specified are downloaded and extracted to a named directory within `AZ_BATCH_ROOT_DIR` on the node. Batch also creates an environment variable for your task command lines to use when calling the application binaries--this variable adheres to the following naming scheme:

`AZ_BATCH_APP_PACKAGE_appid#version`

For example, if you specify that version 2.7 of application *blender* be installed, your tasks can access its binaries by referencing the following environment variable in their command lines:

`AZ_BATCH_APP_PACKAGE_BLENDER#2.7`

If your application specifies a default version, you can reference the environment variable without the version string suffix. For example, if you had specified default version 2.7 for the *blender* application within the Azure portal, your tasks can reference the following environment variable:

`AZ_BATCH_APP_PACKAGE_BLENDER`

The following code snippet shows how a task might be configured when a default version has been specified for the *blender* application.

```csharp
string taskId = "blendertask01";
string commandLine = @"cmd /c %AZ_BATCH_APP_PACKAGE_BLENDER%\blender.exe -my -command -args";
CloudTask blenderTask = new CloudTask(taskId, commandLine);
```

> [AZURE.TIP] See "Environment settings for tasks" in the [Batch feature overview](batch-api-basics.md) for more information on compute node environment settings.

## Update a pool's application packages

If an existing pool has already been configured with an application package, you can specify a new package for the pool. If you specify a new a package reference for a pool, the following applies:

* All new nodes that join the pool will install the newly specified package, as will any existing node that is rebooted or reimaged.
* Compute nodes that are already in the pool when you update the package references do not automatically install the new application package--they must be rebooted or reimaged to receive the new package.
* When a new package is deployed, the environment variables created reflect the new application package references.

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

Now that the new version has been configured, any *new* node joining the pool will have version 2.76b deployed to it. To install 2.76b on the nodes that are *already* in the pool, reboot (or reimage) them. Note that rebooted nodes will retain the files from previous package deployments.

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

## Wrapping up

With application packages, you can more easily provide your customers with the ability to select the applications for their jobs, and specify the exact version to use, when processing jobs with your Batch-enabled service. You might also provide the ability for your customers to upload and track their own applications in your service.

## Next steps

* The [Batch REST API][api_rest] also provides support for working with application packages. For example, see the [applicationPackageReferences][rest_add_pool_with_packages] element in [Add a pool to an account][rest_add_pool] for specifying packages to install using the REST API. See [Applications][rest_applications] for details on obtaining application information using the Batch REST API.

* Learn how to programmatically [manage Azure Batch accounts and quotas with Batch Management .NET](batch-management-dotnet.md). The [Batch Management .NET][api_net_mgmt] library can enable account creation and deletion features for your Batch application or service.

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_mgmt_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/
[github_samples]: https://github.com/Azure/azure-batch-samples
[storage_pricing]: https://azure.microsoft.com/pricing/details/storage/
[net_appops]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.applicationoperations.aspx
[net_appops_listappsummaries]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.applicationoperations.listapplicationsummaries.aspx
[net_cloudpool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_cloudpool_pkgref]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.applicationpackagereferences.aspx
[net_nodestate]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.computenode.state.aspx
[net_pkgref]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.applicationpackagereference.aspx
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
