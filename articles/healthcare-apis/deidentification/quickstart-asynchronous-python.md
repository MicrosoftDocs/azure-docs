---
title: De-identify multiple documents with the de-identification service in python
description: "Learn how to bulk de-identify documents with the asynchronous de-identification service in python."
author: kimiamavon-msft
ms.author: kimiamavon
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: tutorial
ms.date: 05/01/2025

#customer intent: As an IT admin, I want to de-identify multiple documents with the de-identification service in python

---

# De-identify multiple documents with the asynchronous de-identification service

The Azure Health Data Services de-identification service can de-identify documents in Azure Storage via an asynchronous job. If you have many documents that you would like
to de-identify, using a job is a good option. Jobs also provide consistent surrogation, meaning that surrogate values in the de-identified output will match across
all documents. For more information about de-identification, including consistent surrogation, see [What is the de-identification service?](overview.md)

When you choose to store documents in Azure Blob Storage, you're charged based on Azure Storage pricing. This cost isn't included in the 
 de-identification service pricing. [Explore Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs).

In this tutorial, you:


 * Create a storage account and container
 * Upload a sample document
 * Grant the de-identification service access
 * Configure network isolation

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A de-identification service with system-assigned managed identity. [Deploy the de-identification service](quickstart.md).

## Open Azure CLI

Install [Azure CLI](/cli/azure/install-azure-cli) and open your terminal of choice. In this tutorial, we're using PowerShell.

## Create a storage account and container
1. Set your context, substituting the subscription name containing your de-identification service for the `<subscription_name>` placeholder:
   ```powershell
   az account set --subscription "<subscription_name>"
   ```
1. Save a variable for the resource group, substituting the resource group containing your de-identification service for the `<resource_group>` placeholder:
   ```powershell
   $ResourceGroup = "<resource_group>"
   ```
1. Create a storage account, providing a value for the `<storage_account_name>` placeholder:
   ```powershell
   $StorageAccountName = "<storage_account_name>"
   $StorageAccountId = $(az storage account create --name $StorageAccountName --resource-group $ResourceGroup --sku Standard_LRS --kind StorageV2 --min-tls-version TLS1_2 --allow-blob-public-access false --query id --output tsv)
   ```
1. Assign yourself a role to perform data operations on the storage account:
   ```powershell
   $UserId = $(az ad signed-in-user show --query id -o tsv)
   az role assignment create --role "Storage Blob Data Contributor" --assignee $UserId --scope $StorageAccountId
   ```
1. Create a container to hold your sample document:
   ```powershell
   az storage container create --account-name $StorageAccountName --name deidtest --auth-mode login
   ```
## Upload a sample document
Next, you upload a document that contains synthetic PHI:
```powershell
$DocumentContent = "The patient came in for a visit on 10/12/2023 and was seen again November 4th at Contoso Hospital."
az storage blob upload --data $DocumentContent --account-name $StorageAccountName --container-name deidtest --name deidsample.txt --auth-mode login
```

## Grant the de-identification service access to the storage account

In this step, you grant the de-identification service's system-assigned managed identity role-based access to the container. You grant the **Storage Blob
Data Contributor** role because the de-identification service will both read the original document and write de-identified output documents. Substitute the name of
your de-identification service for the `<deid_service_name>` placeholder:
```powershell
$DeidServicePrincipalId=$(az resource show -n <deid_service_name> -g $ResourceGroup --resource-type microsoft.healthdataaiservices/deidservices --query identity.principalId --output tsv)
az role assignment create --assignee $DeidServicePrincipalId --role "Storage Blob Data Contributor" --scope $StorageAccountId
```
To verify that the de-identification service has access to the storage account, you can check on the Azure portal under <b>storage accounts</b>. Under the <b>Storage center</b> and <b>Resources<b/> tab, click your storage account name. Select <b>Access control (IAM)</b> and in the search bar, search for the name of your de-identification service ($ResourceGroup). 

## Configure network isolation on the storage account
Next, you update the storage account to disable public network access and only allow access from trusted Azure services such as the de-identification service.
After running this command, you won't be able to view the storage container contents without setting a network exception. 
Learn more at [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security).

```powershell
az storage account update --name $StorageAccountName --public-network-access Disabled --bypass AzureServices
```

## Use the python SDK
The code below contains a sample from the [Azure Health Deidentification SDK for Python](/python/api/overview/azure/health-deidentification?view=azure-python). 

```Bash

"""
FILE: deidentify_documents_async.py

DESCRIPTION:
    This sample demonstrates a basic scenario of de-identifying documents in Azure Storage. 
    Taking a container URI and an input prefix, the sample will create a job and wait for the job to complete.

USAGE:
    python deidentify_documents_async.py

    Set the environment variables with your own values before running the sample:
    1) endpoint - the service URL endpoint for a de-identification service.
    2) storage_location - an Azure Storage container endpoint, like "https://<storageaccount>.blob.core.windows.net/<container>".
    3) INPUT_PREFIX - the prefix of the input document name(s) in the container.
        For example, providing "folder1" would create a job that would process documents like "https://<storageaccount>.blob.core.windows.net/<container>/folder1/document1.txt".
"""


import asyncio
from azure.core.polling import AsyncLROPoller
from azure.health.deidentification.aio import DeidentificationClient
from azure.health.deidentification.models import (
    DeidentificationJob,
    SourceStorageLocation,
    TargetStorageLocation,
)
from azure.identity.aio import DefaultAzureCredential
import os
import uuid


async def deidentify_documents_async():
    endpoint = "<YOUR SERVICE URL HERE>" ### Replace 
    storage_location = "https://<CONTAINER NAME>.blob.core.windows.net/deidtest/" ### Replace <CONTAINER NAME>
    inputPrefix = "deidsample" 
    outputPrefix = "_output"

    credential = DefaultAzureCredential()
    client = DeidentificationClient(endpoint, credential)

    jobname = f"sample-job-{uuid.uuid4().hex[:8]}"

    job = DeidentificationJob(
        source_location=SourceStorageLocation(
            location=storage_location,
            prefix=inputPrefix,
        ),
        target_location=TargetStorageLocation(location=storage_location, prefix=outputPrefix, overwrite=True),
    )

    async with client:
        lro: AsyncLROPoller = await client.begin_deidentify_documents(jobname, job)
        finished_job: DeidentificationJob = await lro.result()

        await credential.close()

        print(f"Job Name:   {finished_job.job_name}")
        print(f"Job Status: {finished_job.status}")  # Succeeded
        print(f"File Count: {finished_job.summary.total_count if finished_job.summary is not None else 0}")


async def main():
    await deidentify_documents_async()


if __name__ == "__main__":
    asyncio.run(main())


```

## Clean up resources
Once you're done with the storage account, you can delete the storage account and role assignments: 
```powershell
az role assignment delete --assignee $DeidServicePrincipalId --role "Storage Blob Data Contributor" --scope $StorageAccountId
az role assignment delete --assignee $UserId --role "Storage Blob Data Contributor" --scope $StorageAccountId
az storage account delete --ids $StorageAccountId --yes
```

## Next step

> [!div class="nextstepaction"]
> [Quickstart: Azure Health De-identification client library for .NET](quickstart-sdk-net.md)
