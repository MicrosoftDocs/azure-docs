---
title: Data protection in Azure Stream Analytics
description: This article explains how to encrypt your private data used by an Azure Stream Analytics job.
author: mamccrea
ms.author: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/05/2020
---

# Data protection in Azure Stream Analytics 

Azure Stream Analytics is a fully managed platform-as-a-service that allows you to build real-time analytics pipelines. All of the heavy lifting, such as cluster provisioning, scaling nodes to accommodate your usage, and managing internal checkpoints, is managed behind the scenes.

## Encrypt your data

Stream Analytics automatically employs best-in-class encryption standards across its infrastructure to encrypt and secure your data. You can simply trust Stream Analytics to securely store all your data so that you don't have to worry about managing the infrastructure.

If you want to use customer-managed keys (CMK) to encrypt your data, you can use your own storage account (general purpose V1 or V2) to store any private data assets that are required by the Stream Analytics runtime. Your storage account can be encrypted as needed. None of your private data assets are stored permanently by the Stream Analytics infrastructure. 

This setting must be configured at the time of Stream Analytics job creation, and it can't be modified throughout the job's life cycle. Modification or deletion of storage that is being used by your Stream Analytics is not recommended. If you delete your storage account, you will permanently delete all private data assets, which will cause your job to fail. 

Updating or rotating keys to your storage account is not possible using the Stream Analytics portal. You can update the keys using the REST APIs.


## Configure storage account for private data 

Use the following steps to configure your storage account for private data assets. This configuration is made from your Stream Analytics job, not from your storage account.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select **Create a resource** in the upper left-hand corner of the Azure portal. 

1. Select **Analytics** > **Stream Analytics job** from the results list. 

1. Fill out the Stream Analytics job page with necessary details such as name, region, and scale. 

1. Select the check box that says *Secure all private data assets needed by this job in my Storage account*.

1. Select a storage account from your subscription. Note that this setting cannot be modified throughout the life cycle of the job. 

   ![Private data storage account settings](./media/data-protection/storage-account-create.png)

## Private data assets that are stored

Any private data that is required to be persisted by Stream Analytics is stored in your storage account. Examples of private data assets include: 

* Queries that you have authored and their related configurations  

* User-defined functions 

* Checkpoints needed by the Stream Analytics runtime

* Snapshots of reference data 

Connection details of your resources, which are used by your Stream Analytics job, are also stored. Encrypt your storage account to secure all of your data. 

To help you meet your compliance obligations in any regulated industry or environment, you can read more about [Microsoft's compliance offerings](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942). 

## Known issues
There is a known issue where a job using customer managed key runs into failures when using managed identity to authenticate to any inputs or outputs. A fix for this issue is being worked on and will become available in the near future. 

## Next steps

* [Create an Azure Storage account](../storage/common/storage-account-create.md)
* [Understand inputs for Azure Stream Analytics](stream-analytics-add-inputs.md)
* [Checkpoint and replay concepts in Azure Stream Analytics jobs](stream-analytics-concepts-checkpoint-replay.md)
* [Using reference data for lookups in Stream Analytics](stream-analytics-use-reference-data.md)
