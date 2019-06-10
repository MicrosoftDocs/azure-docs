---
title: Trigger a Batch job using Azure Functions
description: Tutorial - Apply OCR to scanned documents as they're added to a storage blob
services: batch
author: laurenhughes
manager: jeconnoc

ms.assetid: 
ms.service: batch
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 05/30/2019
ms.author: peshultz
ms.custom: mvc
---

# Tutorial: Trigger a Batch job using Azure Functions

In this tutorial, you'll learn how to trigger a Batch job using Azure Functions. We'll walk through an example in which documents added to an Azure Storage blob container have optical character recognition (OCR) applied to them via Azure Batch.

## Prerequisites

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/) before you begin.
* An Azure Batch account and a linked Azure Storage account. To create these accounts, see the Batch quickstarts using the Azure portal or Azure CLI.
* Batch Explorer, which you can download and install [here](https://azure.github.io/BatchExplorer/).
* Storage Explorer, which you can download and install [here](https://azure.microsoft.com/en-us/features/storage-explorer/).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Batch pool and Batch job using Batch Explorer

In this section, you'll use Batch Explorer to create the Batch pool and Batch job that will run OCR tasks. 

1. Log in to Batch Explorer using your Azure credentials.
2. Create a pool by clicking "Pools" on the left side bar, then the "+" button above the search form. 
	1. Choose an ID and display name. We'll use `ocr-pool` for this example.
	2. Set the scale type to be "Fixed size", and set the dedicated node count to 3.
	3. Select Debian as the operating system.
	4. Choose `Standard_f2s_v2` as the virtual machine size.
	5. Add a start task with the command `/bin/bash -c "sudo update-locale LC_ALL=C.UTF-8 LANG=C.UTF-8; sudo apt-get update; sudo apt-get -y install ocrmypdf"`. Be sure to set the user identity as "Task default user (Admin)", which allows start tasks to include commands with `sudo`.
	6. Click the "Save and close" button.
3. Create a job by clicking "Jobs" on the left side bar, then the "+" button above the search form. 
	1. Choose an ID and display name. We'll use `ocr-job` for this example.
	2. Set the pool to `ocr-pool`, or whatever you chose as your pool name in step (2).
	3. Click the "Save and close" button.


## Create blob containers

Here you'll create blob containers that will store your input and output files for the OCR Batch job.

1. Log in to Storage Explorer using your Azure credentials.
2. Using the storage account linked to your Batch account, create two blob containers (one for input files, one for output files) by following the steps [here](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-explorer-blobs#create-a-blob-container).
	* In this example, we'll call our input container `input`, and our output container `output`.
	* The input container will be where all non-OCRed documents are initially uploaded.
	* The output container will be where the Batch job writes the OCRed documents to.
3. Create a shared access signature for your output container in Storage Explorer. Do this by right-clicking on the output container and then selecting "Get Shared Access Signature...". Under "Permissions", check "Write". No other permissions are necessary. 

## Create an Azure Function

In this section you'll create the Azure Function that triggers the OCR Batch job whenever a file is uploaded to your input container.

1. Follow the steps to create a blob-triggered function with the Azure Functions documentation [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-storage-blob-triggered-function).
	1. When prompted for a storage account, use the same storage account that you've linked to your Batch account.
	2. For runtime stack, choose .NET. We'll write our function in C# to leverage the Batch .NET SDK.
2. Once the blob-triggered function is created, use the [`run.csx`](https://github.com/Azure-Samples/batch-functions-tutorial/blob/master/run.csx) and [`function.proj`](https://github.com/Azure-Samples/batch-functions-tutorial/blob/master/function.proj) posted on GitHub.
	* `run.csx` is the code that gets run when a new blob is added to your input blob container.
	* `function.proj` lists the external libraries in your Function code, like the Batch .NET SDK.
3.  Change the values of the variables in the `Run()` function of the `run.csx` file to reflect your Batch and storage credentials. 
	* Retrieve your Batch credentials in the Azure portal under the "Keys" blade of your Batch account. 
	* Retrieve your storage account key in the Azure portal under the "Access keys" blade of your storage account.

## Trigger the function and retrieve results

Upload any or all of the scanned files from the [`input_files`](https://github.com/Azure-Samples/batch-functions-tutorial/tree/master/input_files) directory on GitHub to your input container. Monitor Batch Explorer to confirm that a task gets added to `ocr-pool` for each file. A few seconds afterwards, the OCRed file will be added to the output container, visible through Storage Explorer.

Additionally, you can watch the logs file at the bottom of the Azure Functions web editor window, where you'll see messages like this for every file you upload to your input container:
```
2019-05-29T19:45:25.846 [Information] Creating job...
2019-05-29T19:45:25.847 [Information] Accessing input container <inputContainer>...
2019-05-29T19:45:25.847 [Information] Adding <fileName> as a resource file...
2019-05-29T19:45:26.200 [Information] Adding OCR task <taskID> for <fileName> <size of fileName>...
```

You can download the output files from Storage Explorer to your local machine by first selecting the ones you want and then clicking the "Download" button on the top ribbon. Open them in your favorite PDF reader. They're now searchable.

## Next Steps

In this tutorial you learned how to: 

> [!div class="checklist"]
> * Use Batch Explorer to create pools and jobs
> * Use Storage Explorer to create blob containers and a shared access signature (SAS)
> * Create a blob-triggered Azure Function
> * Upload input files to Storage
> * Monitor task execution
> * Retrieve output files

For more examples of using the .NET API to schedule and process Batch workloads, see [the samples on GitHub](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp). To see more Azure Functions triggers that you can use to run Batch workloads, see [the Azure Functions documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings).
