---
title: Trigger a Batch job using Azure Functions
description: Tutorial - Apply OCR to scanned documents as they're added to a storage blob
services: batch
author: ju-shim
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

In this tutorial, you'll learn how to trigger a Batch job using Azure Functions. We'll walk through an example in which documents added to an Azure Storage blob container have optical character recognition (OCR) applied to them via Azure Batch. To streamline the OCR processing, we will configure an Azure function that runs a Batch OCR job each time a file is added to the blob container.

## Prerequisites

* An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/) before you begin.
* An Azure Batch account and a linked Azure Storage account. See [Create a Batch account](quick-create-portal.md#create-a-batch-account) for more information on how to create and link accounts.
* [Batch Explorer](https://azure.github.io/BatchExplorer/)
* [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/)

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a Batch pool and Batch job using Batch Explorer

In this section, you'll use Batch Explorer to create the Batch pool and Batch job that will run OCR tasks. 

### Create a pool

1. Sign in to Batch Explorer using your Azure credentials.
1. Create a pool by selecting **Pools** on the left side bar, then the **Add** button above the search form. 
	1. Choose an ID and display name. We'll use `ocr-pool` for this example.
	1. Set the scale type to **Fixed size**, and set the dedicated node count to 3.
	1. Select **Ubuntu 18.04-LTS** as the operating system.
	1. Choose `Standard_f2s_v2` as the virtual machine size.
	1. Enable the start task and add the command `/bin/bash -c "sudo update-locale LC_ALL=C.UTF-8 LANG=C.UTF-8; sudo apt-get update; sudo apt-get -y install ocrmypdf"`. Be sure to set the user identity as **Task default user (Admin)**, which allows start tasks to include commands with `sudo`.
	1. Select **OK**.
### Create a job

1. Create a job on the pool by selecting **Jobs** on the left side bar, then the **Add** button above the search form. 
	1. Choose an ID and display name. We'll use `ocr-job` for this example.
	1. Set the pool to `ocr-pool`, or whatever name you chose for your pool.
	1. Select **OK**.


## Create blob containers

Here you'll create blob containers that will store your input and output files for the OCR Batch job.

1. Sign in to Storage Explorer using your Azure credentials.
1. Using the storage account linked to your Batch account, create two blob containers (one for input files, one for output files) by following the steps at [Create a blob container](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-blobs#create-a-blob-container).

In this example, the input container is named `input` and is where all documents without OCR are initially uploaded for processing. The output container is named `output` and is where the Batch job writes processed documents with OCR.  
	* In this example, we'll call our input container `input`, and our output container `output`.  
	* The input container is where all documents without OCR are initially uploaded.  
	* The output container is where the Batch job writes documents with OCR.  

Create a shared access signature for your output container in Storage Explorer. Do this by right-clicking on the output container and selecting **Get Shared Access Signature...**. Under **Permissions**, check **Write**. No other permissions are necessary.  

## Create an Azure Function

In this section you'll create the Azure Function that triggers the OCR Batch job whenever a file is uploaded to your input container.

1. Follow the steps in [Create a function triggered by Azure Blob storage](https://docs.microsoft.com/azure/azure-functions/functions-create-storage-blob-triggered-function) to create a function.
	1. When prompted for a storage account, use the same storage account that you linked to your Batch account.
	1. For **runtime stack**, choose .NET. We'll write our function in C# to leverage the Batch .NET SDK.
1. Once the blob-triggered function is created, use the [`run.csx`](https://github.com/Azure-Samples/batch-functions-tutorial/blob/master/run.csx) and [`function.proj`](https://github.com/Azure-Samples/batch-functions-tutorial/blob/master/function.proj) from GitHub in the Function.
	* `run.csx` is run when a new blob is added to your input blob container.
	* `function.proj` lists the external libraries in your Function code, for example, the Batch .NET SDK.
1. Change the placeholder values of the variables in the `Run()` function of the `run.csx` file to reflect your Batch and storage credentials. You can find your Batch and storage account credentials in the Azure portal in the **Keys** section of your Batch account.
	* Retrieve your Batch and storage account credentials in the Azure portal in the **Keys** section of your Batch account. 

## Trigger the function and retrieve results

Upload any or all of the scanned files from the [`input_files`](https://github.com/Azure-Samples/batch-functions-tutorial/tree/master/input_files) directory on GitHub to your input container. Monitor Batch Explorer to confirm that a task gets added to `ocr-pool` for each file. After a few seconds, the file with OCR applied is added to the output container. The file is then visible and retrievable on Storage Explorer.

Additionally, you can watch the logs file at the bottom of the Azure Functions web editor window, where you'll see messages like this for every file you upload to your input container:

```
2019-05-29T19:45:25.846 [Information] Creating job...
2019-05-29T19:45:25.847 [Information] Accessing input container <inputContainer>...
2019-05-29T19:45:25.847 [Information] Adding <fileName> as a resource file...
2019-05-29T19:45:25.848 [Information] Name of output text file: <outputTxtFile>
2019-05-29T19:45:25.848 [Information] Name of output PDF file: <outputPdfFile>
2019-05-29T19:45:26.200 [Information] Adding OCR task <taskID> for <fileName> <size of fileName>...
```

To download the output files from Storage Explorer to your local machine, first select the files you want and then select the **Download** on the top ribbon. 

> [!TIP]
> The downloaded files are searchable if opened in a PDF reader.

## Next steps

In this tutorial you learned how to: 

> [!div class="checklist"]
> * Use Batch Explorer to create pools and jobs
> * Use Storage Explorer to create blob containers and a shared access signature (SAS)
> * Create a blob-triggered Azure Function
> * Upload input files to Storage
> * Monitor task execution
> * Retrieve output files

* For more examples of using the .NET API to schedule and process Batch workloads, see [the samples on GitHub](https://github.com/Azure-Samples/azure-batch-samples/tree/master/CSharp). 

* To see more Azure Functions triggers that you can use to run Batch workloads, see [the Azure Functions documentation](https://docs.microsoft.com/azure/azure-functions/functions-triggers-bindings).
