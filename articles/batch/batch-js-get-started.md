---
title: Use the Azure Batch client library for JavaScript
description: Learn the basic concepts of Azure Batch and build a simple solution using JavaScript.
ms.topic: how-to
ms.date: 05/15/2026
ms.devlang: javascript
ms.custom: devx-track-js, linux-related-content
# Customer intent: "As a JavaScript developer, I want to use the Azure Batch client library to create and manage a batch processing solution, so that I can efficiently run parallel tasks for data processing from Azure Blob storage."
---

# Get started with Batch SDK for JavaScript

Learn the basics of building a Batch client in JavaScript using [Azure Batch JavaScript SDK](https://github.com/Azure/azure-sdk-for-js/). We take a step by step approach of understanding a scenario for a batch application and then setting it up using JavaScript.

## Prerequisites

This article assumes that you have a working knowledge of JavaScript and familiarity with Linux. It also assumes that you have an Azure account setup with access rights to create Batch and Storage services.

We recommend reading [Azure Batch Technical Overview](batch-technical-overview.md) before you go through the steps outlined this article.

## Understand the scenario

Here, we have a simple script written in Python that downloads all csv files from an Azure Blob storage container and converts them to JSON. To process multiple storage account containers in parallel, we can deploy the script as an Azure Batch job.

## Azure Batch architecture

The following diagram depicts how we can scale the Python script using Azure Batch and a client.

![Diagram showing scenario architecture.](./media/batch-js-get-started/batch-scenario.png)

The JavaScript sample deploys a batch job with a preparation task (explained in detail later) and a set of tasks depending on the number of containers in the storage account. You can download the scripts from the GitHub repository.

- [Sample Code](https://github.com/Azure-Samples/azure-batch-samples/blob/master/JavaScript/Node.js/sample.js)
- [Preparation task shell scripts](https://github.com/Azure-Samples/azure-batch-samples/blob/master/JavaScript/Node.js/startup_prereq.sh)
- [Python csv to JSON processor](https://github.com/Azure-Samples/azure-batch-samples/blob/master/JavaScript/Node.js/processcsv.py)

> [!TIP]
> The JavaScript sample in the link specified does not contain specific code to be deployed as an Azure function app. You can refer to the following links for instructions to create one.
> - [Create function app](../azure-functions/functions-get-started.md)
> - [Create timer trigger function](../azure-functions/functions-bindings-timer.md)

## Build the application

Now, let us follow the process step by step into building the JavaScript client:

### Step 1: Install Azure Batch SDK

You can install Azure Batch SDK for JavaScript using the npm install command. You also need the `@azure/identity` package to authenticate with Microsoft Entra ID.

`npm install @azure/batch @azure/identity`

This command installs the latest version of the Azure Batch JavaScript SDK along with the Azure Identity library.

>[!Tip]
> In an Azure Function app, you can go to "Kudu Console" in the Azure function's Settings tab to run the npm install commands. In this case to install Azure Batch SDK for JavaScript.

### Step 2: Create an Azure Batch account

You can create it from the [Azure portal](batch-account-create-portal.md) or from command line ([PowerShell](batch-powershell-cmdlets-get-started.md) /[Azure CLI](/cli/azure)).

Following are the commands to create one through Azure CLI.

Create a Resource Group, skip this step if you already have one where you want to create the Batch Account:

`az group create -n "<resource-group-name>" -l "<location>"`

Next, create an Azure Batch account.

`az batch account create -l "<location>"  -g "<resource-group-name>" -n "<batch-account-name>"`

Instead of using account access keys, this sample authenticates with Microsoft Entra ID using `DefaultAzureCredential`. Make sure the identity running the code (your developer sign-in, a managed identity, or a service principal) has been assigned an appropriate Azure RBAC role on the Batch account, such as **Azure Batch Data Contributor** or **Azure Batch Data Reader**. For more information, see [Authenticate Batch service solutions with Microsoft Entra ID](batch-aad-auth.md).

When running locally, `DefaultAzureCredential` can pick up credentials from the Azure CLI (`az login`), Azure PowerShell, Visual Studio Code, or environment variables. In Azure-hosted environments such as Azure Functions or Azure VMs, it can use a managed identity.

### Step 3: Create an Azure Batch service client

The following code snippet imports the `@azure/batch` and `@azure/identity` modules and then creates a `BatchClient` using `DefaultAzureCredential`.

```javascript js_get_started_client
// Initializing Azure Batch variables

import { DefaultAzureCredential } from "@azure/identity";
import { BatchClient } from "@azure/batch";

// Replace value below with your Batch account URL
const batchEndpoint = '<batch-account-url>';

const credentials = new DefaultAzureCredential();
const batchClient = new BatchClient(batchEndpoint, credentials);

```

The Azure Batch URI can be found in the Overview tab of the Azure portal. It is of the format:

`https://accountname.location.batch.azure.com`

Refer to the screenshot:

![Azure batch uri](./media/batch-js-get-started/batch-uri.png)

### Step 4: Create an Azure Batch pool

An Azure Batch pool consists of multiple VMs (also known as Batch Nodes). Azure Batch service deploys the tasks on these nodes and manages them. You can define the following configuration parameters for your pool.

- Type of Virtual Machine image
- Size of Virtual Machine nodes
- Number of Virtual Machine nodes

> [!TIP]
> The size and number of Virtual Machine nodes largely depend on the number of tasks you want to run in parallel and also the task itself. We recommend testing to determine the ideal number and size.

The following code snippet creates the configuration parameter objects.

```javascript js_get_started_vm_config
// Creating Image reference configuration for Ubuntu Linux VM
const imgRef = {
    publisher: "Canonical",
    offer: "UbuntuServer",
    sku: "20.04-LTS",
    version: "latest"
}
// Creating the VM configuration object with the SKUID
const vmConfig = {
    imageReference: imgRef,
    nodeAgentSkuId: "batch.node.ubuntu 20.04"
};
// Number of VMs to create in a pool
const numVms = 4;

// Setting the VM size
const vmSize = "STANDARD_D1_V2";
```

> [!TIP]
> For the list of Linux VM images available for Azure Batch and their SKU IDs, see [List of virtual machine images](batch-linux-nodes.md#list-of-virtual-machine-images).

Once the pool configuration is defined, you can create the Azure Batch pool. The Batch pool command creates Azure Virtual Machine nodes and prepares them to be ready to receive tasks to execute. Each pool should have a unique ID for reference in subsequent steps.

The following code snippet creates an Azure Batch pool.

```javascript js_get_started_create_pool
// Create a unique Azure Batch pool ID
const now = new Date();
const poolId = `processcsv_${now.getFullYear()}${now.getMonth()}${now.getDay()}${now.getHours()}${now.getSeconds()}`;

const poolConfig = {
    id: poolId,
    displayName: "Processing csv files",
    vmSize: vmSize,
    virtualMachineConfiguration: vmConfig,
    targetDedicatedNodes: numVms,
    enableAutoScale: false
};

// Creating the Pool
try {
    await batchClient.createPool(poolConfig);
} catch (error) {
    console.log(error);
}
```

You can check the status of the pool created and ensure that the state is in "active" before going ahead with submission of a Job to that pool.

```javascript js_get_started_get_pool
try {
    const cloudPool = await batchClient.getPool(poolId);
    if (cloudPool.state === "active") {
        console.log("Pool is active");
    }
} catch (error) {
    if (error.statusCode === 404) {
        console.log("Pool not found yet returned 404...");
    } else {
        console.log("Error occurred while retrieving pool data");
    }
}
```

Following is a sample result object returned by the pool.get function.

```
{
  id: 'processcsv_2022002321',
  displayName: 'Processing csv files',
  url: 'https://<batch-account-name>.westus.batch.azure.com/pools/processcsv_2022002321',
  eTag: '0x8D9D4088BC56FA1',
  lastModified: 2022-01-10T07:12:21.943Z,
  creationTime: 2022-01-10T07:12:21.943Z,
  state: 'active',
  stateTransitionTime: 2022-01-10T07:12:21.943Z,
  allocationState: 'steady',
  allocationStateTransitionTime: 2022-01-10T07:13:35.103Z,
  vmSize: 'standard_d1_v2',
  virtualMachineConfiguration: {
    imageReference: {
      publisher: 'Canonical',
      offer: 'UbuntuServer',
      sku: '20.04-LTS',
      version: 'latest'
    },
    nodeAgentSKUId: 'batch.node.ubuntu 20.04'
  },
  resizeTimeout: 'PT15M',
  currentDedicatedNodes: 4,
  currentLowPriorityNodes: 0,
  targetDedicatedNodes: 4,
  targetLowPriorityNodes: 0,
  enableAutoScale: false,
  enableInterNodeCommunication: false,
  taskSlotsPerNode: 1,
  taskSchedulingPolicy: { nodeFillType: 'Spread' }}
```

### Step 4: Submit an Azure Batch job

An Azure Batch job is a logical group of similar tasks. In our scenario, it is "Process csv to JSON." Each task here could be processing csv files present in each Azure Storage container.

These tasks would run in parallel and deployed across multiple nodes, orchestrated by the Azure Batch service.

> [!TIP]
> You can use the [taskSlotsPerNode](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/batch/arm-batch/src/models/index.ts#L1190-L1191) property to specify maximum number of tasks that can run concurrently on a single node.

#### Preparation task

The VM nodes created are blank Ubuntu nodes. Often, you need to install a set of programs as prerequisites.
Typically, for Linux nodes you can have a shell script that installs the prerequisites before the actual tasks run. However it could be any programmable executable.

The [shell script](https://github.com/Azure-Samples/azure-batch-samples/blob/master/JavaScript/Node.js/startup_prereq.sh) in this example installs Python-pip and the Azure Storage Blob SDK for Python.

You can upload the script on an Azure Storage Account and generate a SAS URI to access the script. This process can also be automated using the Azure Storage JavaScript SDK.

> [!TIP]
> A preparation task for a job runs only on the VM nodes where the specific task needs to run. If you want prerequisites to be installed on all nodes irrespective of the tasks that run on it, you can use the [startTask](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/batch/batch/src/models/index.ts#L1432) property while adding a pool. You can use the following preparation task definition for reference.

A preparation task is specified during the submission of Azure Batch job. Following are some configurable preparation task parameters:

- **ID**: A unique identifier for the preparation task
- **commandLine**: Command line to execute the task executable
- **resourceFiles**: Array of objects that provide details of files needed to be downloaded for this task to run.  Following are its options
  - httpUrl: The URL of the file to download
  - filePath: Local path to download and save the file
  - fileMode: Only applicable for Linux nodes, fileMode is in octal format with a default value of 0770
- **waitForSuccess**: If set to true, the task does not run on preparation task failures
- **runElevated**: Set it to true if elevated privileges are needed to run the task.

Following code snippet shows the preparation task script configuration sample:

```javascript js_get_started_job_prep_task
const jobPrepTaskConfig = {
    id: "installprereq",
    commandLine: "sudo sh startup_prereq.sh > startup.log",
    resourceFiles: [{ httpUrl: 'Blob sh url', filePath: 'startup_prereq.sh' }],
    waitForSuccess: true,
    userIdentity: { autoUser: { elevationLevel: "admin", scope: "pool" } }
};
```

If there are no prerequisites to be installed for your tasks to run, you can skip the preparation tasks. Following code creates a job with display name "process csv files."

```javascript js_get_started_create_job
// Setting Batch Pool ID
const poolInfo = { poolId: poolId };
// Batch job configuration object
const jobId = "processcsvjob";
const jobConfig = {
    id: jobId,
    displayName: "process csv files",
    jobPreparationTask: jobPrepTaskConfig,
    poolInfo: poolInfo
};
// Adding Azure batch job to the pool
try {
    await batchClient.createJob(jobConfig);
} catch (error) {
    console.log("An error occurred while creating the job...");
    console.log(error);
}
```

### Step 5: Submit Azure Batch tasks for a job

Now that our process csv job is created, let us create tasks for that job. Assuming we have four containers, we have to create four tasks, one for each container.

If we look at the [Python script](https://github.com/Azure-Samples/azure-batch-samples/blob/master/JavaScript/Node.js/processcsv.py), it accepts two parameters:

- container name: The Storage container to download files from
- pattern: An optional parameter of file name pattern

Assuming we have four containers "con1", "con2", "con3","con4" following code shows submitting four tasks to the Azure batch job "process csv" we created earlier.

```javascript js_get_started_add_tasks
// storing container names in an array
const containerList = ["con1", "con2", "con3", "con4"];      //Replace with list of blob containers within storage account
for (const val of containerList) {
    console.log("Submitting task for container : " + val);
    const containerName = val;
    const taskID = containerName + "_process";
    // Task configuration object
    const taskConfig = {
        id: taskID,
        displayName: 'process csv in ' + containerName,
        commandLine: 'python processcsv.py --container ' + containerName,
        resourceFiles: [{ httpUrl: 'Blob script url', filePath: 'processcsv.py' }]
    };

    try {
        await batchClient.createTask(jobId, taskConfig);
        console.log("Task for container : " + containerName + " submitted successfully");
    } catch (error) {
        console.log("Error occurred while creating task for container " + containerName + ". Details : " + error);
    }
}
```

The code adds multiple tasks to the pool. And each of the tasks is executed on a node in the pool of VMs created. If the number of tasks exceeds the number of VMs in a pool or the taskSlotsPerNode property, the tasks wait until a node is made available. This orchestration is handled by Azure Batch automatically.

The portal has detailed views on the tasks and job statuses. You can also use the list and get functions in the Azure JavaScript SDK. Details are provided in the documentation [link](/javascript/api/@azure/batch/batchclient).

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- See the [Batch JavaScript reference](/javascript/api/overview/azure/batch) to explore the Batch API.
