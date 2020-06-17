---
title: Copy applications and data to pool nodes
description: Learn how to copy applications and data to pool nodes.
ms.topic: how-to
ms.date: 02/17/2020
---

# Copy applications and data to pool nodes

Azure Batch supports several ways for getting data and applications onto compute nodes so that the data and applications are available for use by tasks. Data and applications may be required to run the entire job and so need to be installed on every node. Some may be required only for a specific task, or need to be installed for the job but don't need to be on every node. Batch has tools for each of these scenarios.

- **Pool start task resource files**: For applications or data that need to be installed on every node in the pool. Use this method along with either an application package or the start task's resource file collection in order to perform an install command.  

Examples: 
- Use the start task command line to move or install applications

- Specify a list of specific files or containers in an Azure storage account. For more information see [add#resourcefile in REST documentation](https://docs.microsoft.com/rest/api/batchservice/pool/add#resourcefile)

- Every job that runs on the pool runs MyApplication.exe that must first be installed with MyApplication.msi. If you use this mechanism, you need to set the start task's **wait for success** property to **true**. For more information, see the [add#starttask in REST documentation](https://docs.microsoft.com/rest/api/batchservice/pool/add#starttask).

- **Application package references** on the pool: For applications or data that need to be installed on every node in the pool. There is no install command associated with an application package, but you can use a start task to run any install command. If your application doesn't require installation, or consists of a large number of files, you can use this method. Application packages are well suited for large numbers of files because they combine a large number of file references into a small payload. If you try to include more than 100 separate resource files into one task, the Batch service might come up against internal system limitations for a single task. Also, use application packages if you have rigorous versioning requirements where you might have many different versions of the same application and need to choose between them. For more information, read [Deploy applications to compute nodes with Batch application packages](https://docs.microsoft.com/azure/batch/batch-application-packages).

- **Job preparation task resource files**: For applications or data that must be installed for the job to run, but don't need to be installed on the entire pool. For example: if your pool has many different types of jobs, and only one job type needs MyApplication.msi to run, it makes sense to put the installation step into a job preparation task. For more information about job preparation tasks see [Run job preparation and job release tasks on Batch compute nodes](https://azure.microsoft.com/documentation/articles/batch-job-prep-release/).

- **Task resource files**: For when an application or data is relevant only to an individual task. For example: You have five tasks, each processes a different file and then writes the output to blob storage.  In this case, the input file should be specified on the **tasks resource files** collection because each task has its own input file.

## Determine the scope required of a file

You need to determine the scope of a file - is the file required for a pool, a job, or a task. Files that are scoped to the pool should use pool application packages, or a start task. Files scoped to the job should use a job preparation task. A good example of files scoped at the pool or job level are applications. Files scoped to the task should use task resource files.

### Other ways to get data onto Batch compute nodes

There are other ways to get data onto Batch compute nodes that are not officially integrated into the Batch REST API. Because you have control over Azure Batch nodes, and can run custom executables, you are able to pull data from any number of custom sources as long as the Batch node has connectivity to the target and you have the credentials to that source onto the Azure Batch node. A few common examples are:

- Downloading data from SQL
- Downloading data from other web services/custom locations
- Mapping a network share

### Azure storage

Blob storage has download scalability targets. Azure storage file share scalability targets are the same as for a single blob. Size will impact the number of nodes and pools you need.

