---
title: APIs and tools for developers
description: Learn about the APIs and tools available for developing solutions with the Azure Batch service.
ms.topic: conceptual
ms.date: 03/20/2023
ms.custom: seodec18
---


# Overview of Batch APIs and tools

Processing parallel workloads with Azure Batch is typically done programmatically by using one of the Batch APIs. Your client application or service can use the Batch APIs to communicate with the Batch service. With the Batch APIs, you can create and manage pools of compute nodes, either virtual machines or cloud services. You can then schedule jobs and tasks to run on those nodes.

You can efficiently process large-scale workloads for your organization, or provide a service front end to your customers so that they can run jobs and tasks—on demand, or on a schedule—on one, hundreds, or even thousands of nodes. You can also use Azure Batch as part of a larger workflow, managed by tools such as [Azure Data Factory](../data-factory/transform-data-using-dotnet-custom-activity.md?toc=%2fazure%2fbatch%2ftoc.json).

> [!TIP]
> To learn more about the features and workflow used in Azure Batch, see [Batch service workflow and resources](batch-service-workflow-features.md).

## Azure accounts for Batch development

When you develop Batch solutions, you use the following accounts in your Azure subscription:

- **Batch account**: Azure Batch resources, including pools, compute nodes, jobs, and tasks, are associated with an Azure [Batch account](accounts.md). When your application makes a request against the Batch service, it authenticates the request using the Azure Batch account name, the URL of the account, and either an access key or a Microsoft Entra token. You can [create a Batch account](batch-account-create-portal.md) in the Azure portal or programmatically.
- **Storage account**: Batch includes built-in support for working with files in [Azure Storage](../storage/index.yml). Nearly every Batch scenario uses Azure Blob storage for staging the programs that your tasks run and the data that they process, and for the storage of output data that they generate. Each Batch account is usually associated with a corresponding storage account.

## Service-level and management-level APIs

Azure Batch has two sets of APIs, one for the service level and one for the management level. The naming is often similar, but they return different results.

Only actions from the management APIs are tracked in the activity log. Service level APIs bypass the Azure Resource Management layer (management.azure.com) and are not logged.

For example, the [Batch service API to delete a pool](/rest/api/batchservice/pool/delete) is targeted directly on the batch account: `DELETE {batchUrl}/pools/{poolId}`

Whereas the [Batch management API to delete a pool](/rest/api/batchmanagement/pool/delete)  is targeted at the management.azure.com layer: `DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Batch/batchAccounts/{accountName}/pools/{poolName}`

## Batch service APIs

Your applications and services can issue direct REST API calls or use one or more of the following client libraries to run and manage your Azure Batch workloads.

| API | API reference | Download | Tutorial | Code samples | More info |
| --- | --- | --- | --- | --- | --- |
| **Batch REST** |[Azure REST API - Docs](/rest/api/batchservice/) |N/A |- |- | [Supported versions](/rest/api/batchservice/batch-service-rest-api-versioning) |
| **Batch .NET** |[Azure SDK for .NET - Docs](/dotnet/api/overview/azure/batch) |[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Batch/) |[Tutorial](tutorial-parallel-dotnet.md) |[GitHub](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp) | [Release notes](https://aka.ms/batch-net-dataplane-changelog) |
| **Batch Python** |[Azure SDK for Python - Docs](/python/api/overview/azure/mgmt-datafactory-readme?view=azure-python&preserve-view=true) |[PyPI](https://pypi.org/project/azure-batch/) |[Tutorial](tutorial-parallel-python.md)|[GitHub](https://github.com/Azure-Samples/azure-batch-samples/tree/master/Python/Batch) | [Readme](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/batch/azure-batch/README.md) |
| **Batch JavaScript** |[Azure SDK for JavaScript - Docs](/javascript/api/overview/azure/batch) |[npm](https://www.npmjs.com/package/@azure/batch) |[Tutorial](batch-js-get-started.md) |- | [Readme](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/batch/batch) |
| **Batch Java** |[Azure SDK for Java - Docs](/java/api/overview/azure/batch) |[Maven](https://search.maven.org/search?q=a:azure-batch) |- |[GitHub](https://github.com/Azure-Samples/azure-batch-samples/tree/master/Java) | [Readme](https://github.com/Azure/azure-batch-sdk-for-java)|

## Batch Management APIs

The Azure Resource Manager APIs for Batch provide programmatic access to Batch accounts. Using these APIs, you can programmatically manage Batch accounts, quotas, application packages, and other resources through the Microsoft.Batch provider.

| API | API reference | Download | Tutorial | Code samples |
| --- | --- | --- | --- | --- |
| **Batch Management REST** |[Azure REST API - Docs](/rest/api/batchmanagement/) |- |- |[GitHub](https://github.com/Azure-Samples/batch-dotnet-manage-batch-accounts) |
| **Batch Management .NET** |[Azure SDK for .NET - Docs](/dotnet/api/overview/azure/batch/management/management-batch(deprecated)) |[NuGet](https://www.nuget.org/packages/Microsoft.Azure.Management.Batch/) | [Tutorial](batch-management-dotnet.md) |[GitHub](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp) |
| **Batch Management Python** |[Azure SDK for Python - Docs](/samples/azure-samples/azure-samples-python-management/batch/) |[PyPI](https://pypi.org/project/azure-mgmt-batch/) |- |- |
| **Batch Management JavaScript** |[Azure SDK for JavaScript - Docs](/javascript/api/overview/azure/arm-batch-readme) |[npm](https://www.npmjs.com/package/@azure/arm-batch) |- |- |
| **Batch Management Java** |[Azure SDK for Java - Docs](/java/api/overview/azure/batch/management) |[Maven](https://search.maven.org/search?q=a:azure-batch) |- |- |

## Batch command-line tools

These command-line tools provide the same functionality as the Batch service and Batch Management APIs:

- [Batch PowerShell cmdlets](/powershell/module/az.batch/): The Azure Batch cmdlets in the [Azure PowerShell](/powershell/azure/) module enable you to manage Batch resources with PowerShell.
- [Azure CLI](/cli/azure): The Azure CLI is a cross-platform toolset that provides shell commands for interacting with many Azure services, including the Batch service and Batch Management service. For more information, see [Manage Batch resources with Azure CLI](batch-cli-get-started.md).

## Other tools for application development

These additional tools may be helpful for building and debugging your Batch applications and services.

- [Azure portal](https://portal.azure.com/): You can create, monitor, and delete Batch pools, jobs, and tasks in the Azure portal. You can view status information for these and other resources while you run your jobs, and even download files from the compute nodes in your pools. For example, you can download a failed task's `stderr.txt` while troubleshooting. You can also download Remote Desktop (RDP) files that you can use to log in to compute nodes.
- [Azure Batch Explorer](https://azure.github.io/BatchExplorer/): Batch Explorer is a free, rich-featured, standalone client tool to help create, debug, and monitor Azure Batch applications. Download an [installation package](https://azure.github.io/BatchExplorer/) for Mac, Linux, or Windows.
- [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/): While not strictly an Azure Batch tool, the Storage Explorer can be helpful when developing and debugging your Batch solutions.

## Additional resources

- To learn about logging events from your Batch application, see [Batch metrics, alerts, and logs for diagnostic evaluation and monitoring](batch-diagnostics.md).
- For reference information on events raised by the Batch service, see [Batch Analytics](batch-analytics.md).
- For information about environment variables for compute nodes, see [Azure Batch runtime environment variables](batch-compute-node-environment-variables.md).

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- [Get started with the Azure Batch library for .NET](tutorial-parallel-dotnet.md) to learn how to use C# and the Batch .NET library to execute a simple workload using a common Batch workflow. A [Python version](tutorial-parallel-python.md) and a [JavaScript tutorial](batch-js-get-started.md) are also available.
- Download the [code samples on GitHub](https://github.com/Azure-Samples/azure-batch-samples) to see how both C# and Python can interface with Batch to schedule and process sample workloads.
