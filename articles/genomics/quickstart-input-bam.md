---
title: Submit a workflow using BAM file input
titleSuffix: Microsoft Genomics
description: This article demonstrates how to submit a workflow to the Microsoft Genomics service if your input file is  a single BAM file.  
services: genomics
author: vigunase
manager: cgronlun
ms.author: vigunase
ms.service: genomics
ms.topic: conceptual
ms.date: 12/07/2017

---

# Submit a workflow using a BAM file input

This article demonstrates how to submit a workflow to the Microsoft Genomics service if your input file is  a single BAM file. This topic assumes you have already installed and run the `msgen` client, and are familiar with how to use Azure Storage. If you have successfully submitted a workflow using the provided sample data, you are ready to proceed with this article. 

## Set up: Upload your BAM file to Azure storage
Let’s assume you have a single BAM file, *reads.bam*, and you have uploaded it to your storage account *myaccount* in Azure as **https://<span></span>myaccount.blob.core<span></span>.windows<span></span>.net<span></span>/inputs/reads<span></span>.bam<span></span>**. You have the API URL and your access key. You want to have outputs in **https://<span></span>myaccount.blob.core<span></span>.windows<span></span>.net<span></span>/outputs<span></span>**.



## Submit your job to the `msgen` client 


Here is the minimal set of arguments that you will need to provide to the `msgen` client; line breaks are added for clarity:

For Windows:

```
msgen submit ^
  --api-url-base <Genomics API URL> ^
  --access-key <Genomics access key> ^
  --process-args R=b37m1 ^
  --input-storage-account-name myaccount ^
  --input-storage-account-key <storage access key to "myaccount"> ^
  --input-storage-account-container inputs ^
  --input-blob-name-1 reads.bam ^
  --output-storage-account-name myaccount ^
  --output-storage-account-key <storage access key to "myaccount"> ^
  --output-storage-account-container outputs
```


For Unix

```
msgen submit \
  --api-url-base <Genomics API URL> \
  --access-key <Genomics access key> \
  --process-args R=b37m1 \
  --input-storage-account-name myaccount \
  --input-storage-account-key <storage access key to "myaccount"> \
  --input-storage-account-container inputs \
  --input-blob-name-1 reads.bam \
  --output-storage-account-name myaccount \
  --output-storage-account-key <storage access key to "myaccount"> \
  --output-storage-account-container outputs
```


If you prefer using a configuration file, here is what it would contain:

``` config.txt
api_url_base:                     <Genomics API URL>
access_key:                       <Genomics access key>
process_args:                     R=b37m1
input_storage_account_name:       myaccount
input_storage_account_key:        <storage access key to "myaccount">
input_storage_account_container:  inputs
input_blob_name_1:                reads.bam
output_storage_account_name:      myaccount
output_storage_account_key:       <storage access key to "myaccount">
output_storage_account_container: outputs
```

Submit the `config.txt` file with this invocation: `msgen submit -f config.txt`

## Next steps
In this article, you uploaded a BAM file into Azure Storage and submitted a workflow to the Microsoft Genomics service through the `msgen` Python client. For additional information regarding workflow submission and other commands you can use with the Microsoft Genomics service, see our [FAQ](frequently-asked-questions-genomics.yml). 
