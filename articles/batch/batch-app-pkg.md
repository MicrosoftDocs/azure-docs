<properties
	pageTitle="Easy application management and installation in Azure Batch | Microsoft Azure"
	description="Use the Applications feature of Azure Batch to easily manage multiple applications and versions for installation on Batch compute nodes."
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
	ms.date="03/04/2016"
	ms.author="marsma" />

# Easy application installation and management with Azure Batch application packages

The application packages feature of Azure Batch provides an easy option for storing, retrieving, and managing the applications that your tasks execute in Batch. With application packages, you can easily upload and manage multiple versions of applications in Batch, including their binaries and other support files, then automatically install one or more of these applications on the compute nodes in your pool.

In this article, you will learn how to upload and manage application packages using the Azure Portal, then install them on a pool's compute nodes using the [Batch .NET][api_net] library.

> [AZURE.NOTE] The application package feature discussed in this article, introduced in Batch REST API 2015-12-01.2.2 and the corresponding Batch .NET 3.1.0 library, supersedes the "Batch Apps" feature available in previous versions of the service. We recommend that you always use the latest API version when working with Batch.

## Applications and application packages

Within Azure Batch, an **application** refers to a set of versioned binaries that can be automatically downloaded to the compute nodes in your pool. An **application package** refers to a *specific set* of those binaries, and represents a given *version* of the application.

![Application packages][1]

### Applications

An application in Batch contains one or more application packages, and also specifies configuration options for the application, such as the default application package to install on compute nodes when no version is specified.

### Application packages

An application packages is a ZIP file containing the application binaries and supporting files required for execution of the application by your tasks. When you create a pool in the Batch service, you can specify one of these applications and (optionally) a version, and that application package will be downloaded and extracted onto each node as it joins the pool. You can also specify more than one application package if you wish to install multiple applications.

Rather than specifying individual resource files in Azure Storage for a pool's start task, or using some other method to prepare your nodes for running tasks, you simply specify one or more application packages for the pool. As each node joins the pool, the specified application packages are automatically downloaded and extracted onto the nodes.

> [AZURE.IMPORTANT] There are restrictions on the number of applications and application packages within a Batch account, as well as the maximum application package size. See [Quotas and limits for the Azure Batch service](batch-quota-limit.md) for details on these limits.

## Upload and manage applications

At the time of this writing, application management is supported only in the Azure portal. Using the portal, you can add, update, and delete application packages, configure default application package versions for each application, and remove application packages you no longer need.

> [AZURE.WARNING] Because Batch stores your application packages in Azure Storage, you are charged as you would be for any other blob data in Storage. Be sure to consider the size and number of your application packages, and periodically remove deprecated packages to minimize cost.

### View current applications

To view the applications in your Batch account, click the **Applications** tile in the Batch account blade.

![List applications][2]

This opens the Applications blade:

![List applications][3]

The Applications blade displays the ID of each application in your account, as well as the following properties:

* **Packages** - The number of versions associated with this application.
* **Default Version** – If no version is specified for a pool's application, this version will be installed.
* **Allow Updates** – If this is set to *No*, package update and delete is disabled for that application--only new application packages can be added.

### Add a new application

To create a new application, you add an application package using a new, unique application ID. When you add an application with a unique application ID, the application is created within the portal, and that application package will appear in the application's details pane.



### Add a new application package

### Update an application package

### Delete an application package

> [AZURE.NOTE] The [Batch Management .NET](batch-management-dotnet.md) library will allow programmatic management of applications and their packages in the near future.

## Install applications on compute nodes

To install an application package on the compute nodes in a pool, you specify one or more application package *references* for a pool. In Batch .NET, you do so by adding one or more `ApplicationPackageReference` objects to the `CloudPool.ApplicationPackageReferences` property, either when you create the pool, or on an existing pool.

The `ApplicationPackageReference` class specifies an application ID and version for installation on a pool's compute nodes.

```csharp
// Create the unbound CloudPool
CloudPool myCloudPool =
    batchClient.PoolOperations.CreatePool(poolId: "myPool",
                                          osFamily: "4",
                                          virtualMachineSize: "small",
                                          targetDedicated: "1");

// Specify the application and version to install on the compute nodes
myCloudPool.ApplicationPackageReferences = new List<ApplicationPackageReference>
{
    new ApplicationPackageReference {
        ApplicationId = "litware",
        Version = "10.7" }
};

// Commit the pool so that it's created in the Batch service. As the nodes join
// the pool, the specified application package will be installed on each.
await myCloudPool.CommitAsync();
```

## Execute the installed applications

Applications are downloaded to each compute node as it joins a pool, is rebooted, or reimaged. Each package is placed in a `<PACKAGE LOCATION HERE>` directory on the node, and can be accessed by the tasks in your jobs.

```csharp
// Code sample here.
```

## Update a pool's application packages

If you've already specified an application package for a pool, you can specify a new package for the existing pool. All new nodes that join the pool will install the newly specified package, as will any existing node that is rebooted or reimaged. Compute nodes that are already in the pool when you update the package references do not automatically install the new application package.

```csharp
// Code sample here.
```

## List the applications in a Batch account

You can list the applications and their packages in a Batch account by using the `ApplicationOperations.ListApplicationSummaries` method.

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

- Next step one goes here
- Next step two goes here
- Maybe even a number three

[api_net]: http://msdn.microsoft.com/library/azure/mt348682.aspx
[api_rest]: http://msdn.microsoft.com/library/azure/dn820158.aspx
[batch_explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[cmd_start]: https://technet.microsoft.com/library/cc770297.aspx
[github_samples]: https://github.com/Azure/azure-batch-samples
[msmpi_msdn]: https://msdn.microsoft.com/library/bb524831.aspx
[msmpi_sdk]: http://go.microsoft.com/FWLink/p/?LinkID=389556
[msmpi_howto]: http://blogs.technet.com/b/windowshpc/archive/2015/02/02/how-to-compile-and-run-a-simple-ms-mpi-program.aspx

[net_jobprep]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.jobpreparationtask.aspx
[net_multiinstance_class]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.aspx
[net_multiinstance_prop]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.multiinstancesettings.aspx
[net_multiinsance_commonresfiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.commonresourcefiles.aspx
[net_multiinstance_coordcmdline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.coordinationcommandline.aspx
[net_multiinstance_numinstances]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.multiinstancesettings.numberofinstances.aspx
[net_pool]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.aspx
[net_pool_create]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.createpool.aspx
[net_pool_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudpool.starttask.aspx
[net_resourcefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.resourcefile.aspx
[net_starttask]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.starttask.aspx
[net_starttask_cmdline]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.starttask.commandline.aspx
[net_task]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.aspx
[net_taskconstraints]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.aspx
[net_taskconstraint_maxretry]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.maxtaskretrycount.aspx
[net_taskconstraint_maxwallclock]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.maxwallclocktime.aspx
[net_taskconstraint_retention]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.taskconstraints.retentiontime.aspx
[net_task_listsubtasks]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.listsubtasks.aspx
[net_task_listnodefiles]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.cloudtask.listnodefiles.aspx
[poolops_getnodefile]: https://msdn.microsoft.com/library/azure/microsoft.azure.batch.pooloperations.getnodefile.aspx

[rest_multiinstance]: https://msdn.microsoft.com/library/azure/mt637905.aspx

[1]: ./media/batch-app-pkg/app_pkg_01.png "Applications and application packages"
[2]: ./media/batch-app-pkg/app_pkg_02.png "List applications"
[3]: ./media/batch-app-pkg/app_pkg_03.png "List applications"
[4]: ./media/batch-app-pkg/app_pkg_04.png "List applications"
[5]: ./media/batch-app-pkg/app_pkg_05.png "List applications"
[6]: ./media/batch-app-pkg/app_pkg_06.png "List applications"