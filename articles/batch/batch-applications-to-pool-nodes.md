---
title: Copy applications and data to pool nodes
description: Learn how to copy applications and data to pool nodes.
ms.topic: how-to
ms.date: 02/18/2021
---

# Copy applications and data to pool nodes

Azure Batch supports several ways for getting data and applications onto compute nodes so that they're available for use by tasks.

The method you choose may depend on the scope of your file or application. Data and applications may be required to run the entire job, and so need to be installed on every node. Some files or applications may be required only for a specific task. Others may need to be installed for the job, but don't need to be on every node. Batch has tools for each of these scenarios.

## Determine the scope required of a file

You need to determine the scope of a file - is the file required for a pool, a job, or a task. Files that are scoped to the pool should use pool application packages, or a start task. Files scoped to the job should use a job preparation task. A good example of files scoped at the pool or job level are applications. Files scoped to the task should use task resource files.

## Pool start task resource files

For applications or data that need to be installed on every node in the pool, use pool start task resource files. Use this method along with either an [application package](batch-application-packages.md) or the start task's resource file collection in order to perform an install command.  

For example, you can use the start task command line to move or install applications. You can also specify a list of files or containers in an Azure storage account. For more information, see [Add#ResourceFile in REST documentation](/rest/api/batchservice/pool/add#resourcefile).

If every job that runs on the pool runs an application (.exe) that must first be installed with a .msi file, you'll need to set the start task's **wait for success** property to **true**. For more information, see [Add#StartTask in REST documentation](/rest/api/batchservice/pool/add#starttask).

## Application package references

For applications or data that need to be installed on every node in the pool, consider using [application packages](batch-application-packages.md). There is no install command associated with an application package, but you can use a start task to run any install command. If your application doesn't require installation, or consists of a large number of files, you can use this method.

Application packages are useful when you have a large number of files, because they can combine many file references into a small payload. If you try to include more than 100 separate resource files into one task, the Batch service might come up against internal system limitations for a single task. Application packages are also useful when you have many different versions of the same application and need to choose between them.

## Extensions

[Extensions](create-pool-extensions.md) are small applications that facilitate post-provisioning configuration and setup on Batch compute nodes. When you create a pool, you can select a supported extension to be installed on the compute nodes as they are provisioned. After that, the extension can perform its intended operation.

## Job preparation task resource files

For applications or data that must be installed for the job to run, but don't need to be installed on the entire pool, consider using [job preparation task resource files](./batch-job-prep-release.md).

For example, if your pool has many different types of jobs, and only one job type needs an .msi file in order to run, it makes sense to put the installation step into a job preparation task.

## Task resource files

Task resource files are appropriate when your application or data is relevant only to an individual task.

For example, you might have five tasks, each processing a different file and then writing the output to blob storage  In this case, the input file should be specified on the task resource files collection, because each task has its own input file.

## Additional ways to get data onto nodes

Because you have control over Azure Batch nodes, and can run custom executables, you can pull data from any number of custom sources. Make sure the Batch node has connectivity to the target and that you have credentials to that source on the node.

A few examples of ways to transfer data to Batch nodes are:

- Downloading data from SQL
- Downloading data from other web services/custom locations
- Mapping a network share

## Azure storage

Keep in mind that blob storage has download scalability targets. Azure storage file share scalability targets are the same as for a single blob. The size will impact the number of nodes and pools you need.

## Next steps

- Learn about using [application packages with Batch](batch-application-packages.md).
- Learn more about [working with nodes and pools](nodes-and-pools.md).
