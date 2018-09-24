---
title: Azure Batch APIs and tools for developers | Microsoft Docs
description: Learn about the APIs and tools available for developing solutions with the Azure Batch service.
services: batch
author: dlepow
manager: jeconnoc

ms.service: batch
ms.topic: get-started-article
ms.date: 06/18/2018
ms.author: danlep
---


# Overview of Batch APIs and tools

Processing parallel workloads with Azure Batch is typically done programmatically by using one of the [Batch APIs](#batch-development-apis). Your client application or service can use the Batch APIs to communicate with the Batch service. With the Batch APIs, you can create and manage pools of compute nodes, either virtual machines or cloud services. You can then schedule jobs and tasks to run on those nodes. 

You can efficiently process large-scale workloads for your organization, or provide a service front end to your customers so that they can run jobs and tasks--on demand, or on a schedule--on one, hundreds, or even thousands of nodes. You can also use Azure Batch as part of a larger workflow, managed by tools such as [Azure Data Factory](../data-factory/transform-data-using-dotnet-custom-activity.md?toc=%2fazure%2fbatch%2ftoc.json).

> [!TIP]
> When you're ready to dig in to the Batch API for a more in-depth understanding of the features it provides, check out the [Batch feature overview for developers](batch-api-basics.md).
> 
> 

## Azure accounts for Batch development
When you develop Batch solutions, you use the following accounts in your Azure subscription:

* **Batch account** - Azure Batch resources, including pools, compute nodes, jobs, and tasks, are associated with an Azure [Batch account](batch-api-basics.md#account). When your application makes a request against the Batch service, it authenticates the request using the Azure Batch account name, the URL of the account, and either an access key or an Azure Active Directory token. You can [create a Batch account](batch-account-create-portal.md) in the Azure portal, or programmatically.
* **Storage account** - Batch includes built-in support for working with files in [Azure Storage][azure_storage]. Nearly every Batch scenario uses Azure Blob storage for staging the programs that your tasks run and the data that they process, and for the storage of output data that they generate. For storage account options in Batch, see the [Batch feature overview](batch-api-basics.md#azure-storage-account).

## Batch service APIs

Your applications and services can issue direct REST API calls or use one or more of the following client libraries to run and manage your Azure Batch workloads.

| API | API reference | Download | Tutorial | Code samples | More Info |
| --- | --- | --- | --- | --- | --- |
| **Batch REST** |[docs.microsoft.com][batch_rest] |N/A |- |- | [Supported Versions](/rest/api/batchservice/batch-service-rest-api-versioning) |
| **Batch .NET** |[docs.microsoft.com][api_net] |[NuGet ][api_net_nuget] |[Tutorial](tutorial-parallel-dotnet.md) |[GitHub][api_sample_net] | [Release Notes](http://aka.ms/batch-net-dataplane-changelog) |
| **Batch Python** |[docs.microsoft.com][api_python] |[PyPI][api_python_pypi] |[Tutorial](tutorial-parallel-python.md)|[GitHub][api_sample_python] | [Readme](https://github.com/Azure/azure-sdk-for-python/blob/master/doc/batch.rst) |
| **Batch Node.js** |[docs.microsoft.com][api_nodejs] |[npm][api_nodejs_npm] |[Tutorial](batch-nodejs-get-started.md) |- | [Readme](https://github.com/Azure/azure-sdk-for-node/tree/master/lib/services/batch) |
| **Batch Java** |[docs.microsoft.com][api_java] |[Maven][api_java_jar] |- |[Readme][api_sample_java] | [Readme](https://github.com/Azure/azure-batch-sdk-for-java)|

## Batch Management APIs

The Azure Resource Manager APIs for Batch provide programmatic access to Batch accounts. Using these APIs, you can programmatically manage Batch accounts, quotas, application packages, and other resources through the Microsoft.Batch provider.  

| API | API reference | Download | Tutorial | Code samples |
| --- | --- | --- | --- | --- |
| **Batch Management REST** |[docs.microsoft.com][api_rest_mgmt] |N/A |- |[GitHub](https://github.com/Azure-Samples/batch-dotnet-manage-batch-accounts) |
| **Batch Management .NET** |[docs.microsoft.com][api_net_mgmt] |[NuGet ][api_net_mgmt_nuget] | [Tutorial](batch-management-dotnet.md) |[GitHub][api_sample_net] |
| **Batch Management Python** |[docs.microsoft.com][api_python_mgmt] |[PyPI][api_python_mgmt_pypi] |- |- |
| **Batch Management Node.js** |[docs.microsoft.com][api_nodejs_mgmt] |[npm][api_nodejs_mgmt_npm] |- |- | 
| **Batch Management Java** |- |[Maven][api_java_mgmt_jar] |- |- |
## Batch command-line tools

These command-line tools provide the same functionality as the Batch service and Batch Management APIs: 

* [Batch PowerShell cmdlets][batch_ps]: The Azure Batch cmdlets in the [Azure PowerShell](/powershell/azure/overview) module enable you to manage Batch resources with PowerShell.
* [Azure CLI](/cli/azure): The Azure CLI is a cross-platform toolset that provides shell commands for interacting with many Azure services, including the Batch service and Batch Management service. See [Manage Batch resources with Azure CLI](batch-cli-get-started.md) for more information about using the Azure CLI with Batch.

## Other tools for application development

Here are some additional tools that may be helpful for building and debugging your Batch applications and services:

* [Azure portal][portal]: You can create, monitor, and delete Batch pools, jobs, and tasks in the Azure portal. You can view the status information for these and other resources while you run your jobs, and even download files from the compute nodes in your pools. For example, you can download a failed task's `stderr.txt` while troubleshooting. You can also download Remote Desktop (RDP) files that you can use to log in to compute nodes.
* [Azure Batch Explorer][batch_labs]: Batch Explorer (formerly called BatchLabs) is a free, rich-featured, standalone client tool to help create, debug, and monitor Azure Batch applications. Download an [installation package](https://azure.github.io/BatchExplorer/) for Mac, Linux, or Windows.
* [Microsoft Azure Storage Explorer][storage_explorer]: While not strictly an Azure Batch tool, the Storage Explorer is another valuable tool to have while you are developing and debugging your Batch solutions.

## Additional resources

- To learn about logging events from your Batch application, see [Log events for diagnostic evaluation and monitoring of Batch solutions](batch-diagnostics.md). For a reference on events raised by the Batch service, see [Batch Analytics](batch-analytics.md).
- For information about environment variables for compute nodes, see [Azure Batch compute node environment variables](batch-compute-node-environment-variables.md).

## Next steps

* Read the [Batch feature overview for developers](batch-api-basics.md), essential information for anyone preparing to use Batch. The article contains more detailed information about Batch service resources like pools, nodes, jobs, and tasks, and the many API features that you can use while building your Batch application.
* [Get started with the Azure Batch library for .NET](tutorial-parallel-dotnet.md) to learn how to use C# and the Batch .NET library to execute a simple workload using a common Batch workflow. A [Python version](tutorial-parallel-python.md) and a [Node.js tutorial](batch-nodejs-get-started.md) are also available.
* Download the [code samples on GitHub][github_samples] to see how both C# and Python can interface with Batch to schedule and process sample workloads.


[azure_storage]: https://azure.microsoft.com/services/storage/
[api_java]: /java/api/overview/azure/batch
[api_java_mgmt]: /java/api/overview/azure/batch/managementapi
[api_java_jar]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-batch%22
[api_java_mgmt_jar]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-mgmt-batch%22
[api_net]: /dotnet/api/overview/azure/batch/
[api_net_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Batch/
[api_rest_mgmt]: /rest/api/batchmanagement/
[api_net_mgmt]: /dotnet/api/overview/azure/batch/management
[api_net_mgmt_nuget]: https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/
[api_nodejs]: /javascript/api/overview/azure/batch/client
[api_nodejs_mgmt]: /javascript/api/overview/azure/batch/management
[api_nodejs_npm]: https://www.npmjs.com/package/azure-batch
[api_nodejs_mgmt_npm]: https://www.npmjs.com/package/azure-arm-batch
[api_python]: /python/api/overview/azure/batch/client
[api_python_mgmt]: /python/api/overview/azure/batch/management
[api_python_pypi]: https://pypi.python.org/pypi/azure-batch
[api_python_mgmt_pypi]: https://pypi.python.org/pypi/azure-mgmt-batch
[api_sample_net]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp
[api_sample_python]: https://github.com/Azure/azure-batch-samples/tree/master/Python/Batch
[api_sample_java]: https://github.com/Azure/azure-batch-samples/tree/master/Java/
[batch_ps]: /powershell/module/azurerm.batch/
[batch_rest]: /rest/api/batchservice/
[free_account]: https://azure.microsoft.com/free/
[github_samples]: https://github.com/Azure/azure-batch-samples
[msdn_benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[batch_labs]: https://azure.github.io/BatchExplorer/
[storage_explorer]: http://storageexplorer.com/
[portal]: https://portal.azure.com
