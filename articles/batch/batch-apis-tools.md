---
title: Use Azure Batch APIs and tools to develop large-scale parallel processing solutions | Microsoft Docs
description: Learn about the APIs and tools available for developing solutions with the Azure Batch service.
services: batch
documentationcenter: ''
author: tamram
manager: timlt
editor: ''

ms.assetid: 93e37d44-7585-495e-8491-312ed584ab79
ms.service: batch
ms.workload: big-compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 03/08/2017
ms.author: tamram
---


# Overview of Batch APIs and tools

Processing parallel workloads with Azure Batch is typically done programmatically by using one of the [Batch APIs](#batch-development-apis). Your client application or service can use the Batch APIs to communicate with the Batch service. With the Batch APIs, you can create and manage pools of compute nodes, either virtual machines or cloud services. You can then schedule jobs and tasks to run on those nodes. 

You can efficiently process large-scale workloads for your organization, or provide a service front end to your customers so that they can run jobs and tasks--on demand, or on a schedule--on one, hundreds, or even thousands of nodes. You can also use Azure Batch as part of a larger workflow, managed by tools such as [Azure Data Factory](../data-factory/data-factory-data-processing-using-batch.md?toc=%2fazure%2fbatch%2ftoc.json).

> [!TIP]
> When you're ready to dig in to the Batch API for a more in-depth understanding of the features it provides, check out the [Batch feature overview for developers](batch-api-basics.md).
> 
> 

## Azure accounts for Batch development
When you develop Batch solutions, you'll use the following accounts in Microsoft Azure.

* **Azure account and subscription** - If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefit][msdn_benefits], or sign up for a [free Azure account][free_account]. When you create an account, a default subscription is created for you.
* **Batch account** - Azure Batch resources, including pools, compute nodes, jobs, and tasks, are associated with an Azure Batch account. When your application makes a request against the Batch service, it authenticates the request using the Azure Batch account name, the URL of the account, and an access key. You can [create Batch account](batch-account-create-portal.md) in the Azure portal.
* **Storage account** - Batch includes built-in support for working with files in [Azure Storage][azure_storage]. Nearly every Batch scenario uses Azure Blob storage for staging the programs that your tasks run and the data that they process, and for the storage of output data that they generate. To create a Storage account, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

## Batch service APIs

Your applications and services can issue direct REST API calls or use one or more of the following client libraries to run and manage your Azure Batch workloads.

| API | API reference | Download | Tutorial | Code samples | More Info |
| --- | --- | --- | --- | --- | --- |
| **Batch REST** |[MSDN][batch_rest] |N/A |- |- | [Supported Versions](https://docs.microsoft.com/rest/api/batchservice/batch-service-rest-api-versioning) |
| **Batch .NET** |[docs.microsoft.com][api_net] |[NuGet ][api_net_nuget] |[Tutorial](batch-dotnet-get-started.md) |[GitHub][api_sample_net] | [Release Notes](https://github.com/Azure/azure-sdk-for-net/blob/AutoRest/src/Batch/Client/changelog.md) |
| **Batch Python** |[readthedocs.io][api_python] |[PyPI][api_python_pypi] |[Tutorial](batch-python-tutorial.md)|[GitHub][api_sample_python] | [Readme](https://github.com/Azure/azure-sdk-for-python/blob/master/doc/batch.rst) |
| **Batch Node.js** |[github.io][api_nodejs] |[npm][api_nodejs_npm] |- |- | [Readme](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/batch) |
| **Batch Java** |[github.io][api_java] |[Maven][api_java_jar] |- |[Readme][api_sample_java] | [Readme](https://github.com/Azure/azure-batch-sdk-for-java)|

## Batch Management APIs

The Azure Resource Manager APIs for Batch provide programmatic access to Batch accounts. Using these APIs, you can programmatically manage Batch accounts, quotas, and application packages.  

| API | API reference | Download | Tutorial | Code samples |
| --- | --- | --- | --- | --- |
| **Batch Resource Manager REST** |[docs.microsoft.com][api_rest_mgmt] |N/A |- |[GitHub](https://github.com/Azure-Samples/batch-dotnet-manage-batch-accounts) |
| **Batch Resource Manager .NET** |[docs.microsoft.com][api_net_mgmt] |[NuGet ][api_net_mgmt_nuget] | [Tutorial](batch-management-dotnet.md) |[GitHub][api_sample_net] |

## Batch command-line tools

These command-line tools provide the same functionality as the Batch service and Batch Management APIs: 

* [Batch PowerShell cmdlets][batch_ps]: The Azure Batch cmdlets in the [Azure PowerShell](/powershell/azure/overview) module enable you to manage Batch resources with PowerShell.
* [Azure CLI](/cli/azure/overview): The Azure Command-Line Interface (Azure CLI) is a cross-platform toolset that provides shell commands for interacting with many Azure services, including the Batch service and Batch Management service. See [Manage Batch resources with Azure CLI](batch-cli-get-started.md) for more information about using the Azure CLI with Batch.

## Other tools for application development

Here are some additional tools that may be helpful for building and debugging your Batch applications and services:

* [Azure portal][portal]: You can create, monitor, and delete Batch pools, jobs, and tasks in the Azure portal's Batch blades. You can view the status information for these and other resources while you run your jobs, and even download files from the compute nodes in your pools. For example, you can download a failed task's `stderr.txt` while troubleshooting. You can also download Remote Desktop (RDP) files that you can use to log in to compute nodes.
* [Azure Batch Explorer][batch_explorer]: Batch Explorer provides similar Batch resource management functionality as the Azure portal, but in a standalone Windows Presentation Foundation (WPF) client application. One of the Batch .NET sample applications available on [GitHub][github_samples], you can build it with Visual Studio 2015 or newer and use it to browse and manage the resources in your Batch account while you develop and debug your Batch solutions. View job, pool, and task details, download files from compute nodes, and connect to nodes remotely by using Remote Desktop (RDP) files you can download with Batch Explorer.
* [Microsoft Azure Storage Explorer][storage_explorer]: While not strictly an Azure Batch tool, the Storage Explorer is another valuable tool to have while you are developing and debugging your Batch solutions.

## Additional resources

- To learn about logging events from your Batch application, see [Log events for diagnostic evaluation and monitoring of Batch solutions](batch-diagnostics.md). For a reference on events raised by the Batch service, see [Batch Analytics](batch-analytics.md).
- For information about environment variables for compute nodes, see [Azure Batch compute node environment variables](batch-compute-node-environment-variables.md).

## Next steps

* Read the [Batch feature overview for developers](batch-api-basics.md), essential information for anyone preparing to use Batch. The article contains more detailed information about Batch service resources like pools, nodes, jobs, and tasks, and the many API features that you can use while building your Batch application.
* [Get started with the Azure Batch library for .NET](batch-dotnet-get-started.md) to learn how to use C# and the Batch .NET library to execute a simple workload using a common Batch workflow. This article should be one of your first stops while learning how to use the Batch service. There is also a [Python version](batch-python-tutorial.md) of the tutorial.
* Download the [code samples on GitHub][github_samples] to see how both C# and Python can interface with Batch to schedule and process sample workloads.
* Check out the [Batch Learning Path][learning_path] to get an idea of the resources available to you as you learn to work with Batch.


[azure_storage]: https://azure.microsoft.com/services/storage/
[api_java]: http://azure.github.io/azure-sdk-for-java/
[api_java_jar]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-batch%22
[api_net]: https://msdn.microsoft.com/library/azure/mt348682.aspx
[api_net_nuget]: https://www.nuget.org/packages/Azure.Batch/
[api_rest_mgmt]: https://docs.microsoft.com/\rest/api/batchmanagement/
[api_net_mgmt]: https://msdn.microsoft.com/library/azure/mt463120.aspx
[api_net_mgmt_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/
[api_nodejs]: http://azure.github.io/azure-sdk-for-node/azure-batch/latest/
[api_nodejs_npm]: https://www.npmjs.com/package/azure-batch
[api_python]: http://azure-sdk-for-python.readthedocs.io/en/latest/ref/azure.batch.html
[api_python_pypi]: https://pypi.python.org/pypi/azure-batch
[api_sample_net]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp
[api_sample_python]: https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch
[api_sample_java]: https://github.com/Azure/azure-batch-samples/tree/master/Java/
[batch_ps]: /powershell/resourcemanager/azurerm.batch/v2.7.0/azurerm.batch
[batch_rest]: https://msdn.microsoft.com/library/azure/Dn820158.aspx
[free_account]: https://azure.microsoft.com/free/
[github_samples]: https://github.com/Azure/azure-batch-samples
[learning_path]: https://azure.microsoft.com/documentation/learning-paths/batch/
[msdn_benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[batch_explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[storage_explorer]: http://storageexplorer.com/
[portal]: https://portal.azure.com
