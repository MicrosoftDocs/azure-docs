---
title: "Quickstart: Azure Health De-identification .NET Library"
description: Learn how to de-identify health data with the Azure Health De-identification client library for .NET. Install the package, run sample code, and get started today.
author: LeaKass
ms.author: leakassab
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart-sdk
ms.date: 10/01/2026
---


# Quickstart: Azure Health De-identification client library for .NET

Get started with the Azure Health De-identification client library for .NET to de-identify your health data. Follow these steps to install the package and try out example code for basic tasks.

[API reference documentation](/dotnet/api/azure.health.deidentification) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/healthdataaiservices) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Health.Deidentification) | [More Samples on GitHub](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/samples/README.md)

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* An Azure Storage Account (only for job workflow).

## Set up the de-identification environment

### Create a de-identification service

A de-identification service provides you with an endpoint URL. You can use this endpoint URL as a REST API or with an SDK.

1. Install [Azure CLI](/cli/azure/install-azure-cli).
1. Create a de-identification service resource.

    ```bash
    REGION="<Region>"
    RESOURCE_GROUP_NAME="<ResourceGroupName>"
    DEID_SERVICE_NAME="<NewDeidServiceName>"
    az resource create -g $RESOURCE_GROUP_NAME -n $DEID_SERVICE_NAME --resource-type microsoft.healthdataaiservices/deidservices --is-full-object -p "{\"identity\":{\"type\":\"SystemAssigned\"},\"properties\":{},\"location\":\"$REGION\"}"
    ```

### Assign RBAC roles to the de-identification service

Assign a role to your de-identification service so you have permissions to perform the actions in this quickstart.

Because you're using real-time and job endpoints, assign the `DeID Data Owner` roles.

To learn how to assign this role to your de-identification service, see [Manage access to the de-identification service with Azure role-based access control (RBAC) in Azure Health Data Services](manage-access-rbac.md).

### Create an Azure Storage account

1. Install [Azure CLI](/cli/azure/install-azure-cli).
1. Create an Azure Storage Account

    ```bash
    STORAGE_ACCOUNT_NAME="<NewStorageAccountName>"
    az storage account create --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --location $REGION
    ```

### Authorize de-identification service on the Azure Storage account

Give the de-identification service access to your storage account.

```bash
STORAGE_ACCOUNT_ID=$(az storage account show --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --query id --output tsv)
DEID_SERVICE_PRINCIPAL_ID=$(az resource show -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices --query identity.principalId --output tsv)
az role assignment create --assignee $DEID_SERVICE_PRINCIPAL_ID --role "Storage Blob Data Contributor" --scope $STORAGE_ACCOUNT_ID
```

### Install the package

You can get the client library through NuGet as the `Azure.Health.Deidentification` package.

1. Install the package.
  
    ```bash
    dotnet add package Azure.Health.Deidentification
    ```

1. Also, install the Azure Identity package if you didn't already install it.

    ```bash
    dotnet add package Azure.Identity
    ```

## Object model

* [DeidentificationClient](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationClient.cs) handles communication between the SDK and the de-identification service endpoint.
* [DeidentificationContent](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/Models/DeidentificationContent.cs) is for string de-identification.
* [DeidentificationJob](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/Models/DeidentificationJob.cs) creates jobs to de-identify documents in an Azure Storage Account.
* [PhiEntity](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/Models/PhiEntity.cs) is the span and category of a single PHI entity detected through a tag operation.

## Code examples

* [Create a de-identification client](#create-a-de-identification-client)
* [De-identify a string](#de-identify-a-string)
* [Tag a string](#tag-a-string)
* [Create a de-identification job](#create-a-de-identification-job)
* [Get the status of a de-identification job](#get-the-status-of-a-de-identification-job)

### Create a de-identification client

Before you can create the client, you need to find your **de-identification service endpoint URL**.

Use the Azure CLI to find the endpoint URL.

```bash
az resource show -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices --query properties.serviceUrl --output tsv
```

Then, create the client by using that value.

```csharp
using Azure.Identity;
using Azure.Health.Deidentification;

string serviceEndpoint = "https://example123.api.deid.azure.com";

DeidentificationClient client = new(
    new Uri(serviceEndpoint),
    new DefaultAzureCredential()
);
```

### De-identify a string

Use this function to de-identify any string you have in memory.

```csharp
DeidentificationContent content = new("SSN: 123-04-5678");
DeidentificationResult result = await client.DeidentifyAsync(content);
```

### Tag a string

You can tag a string the same way you de-identify a string. Change the `OperationType` to tag a string.

```csharp
DeidentificationContent content = new("SSN: 123-04-5678");
content.Operation = OperationType.Tag;

DeidentificationResult result = await client.DeidentifyAsync(content);
```

### Create a de-identification job

This function de-identifies all files that have a specific prefix within an Azure Blob Storage Account.

To create the job, you need the URL to the blob endpoint of the Azure Storage Account.

```bash
az resource show -n $STORAGE_ACCOUNT_NAME -g $RESOURCE_GROUP_NAME  --resource-type Microsoft.Storage/storageAccounts --query properties.primaryEndpoints.blob --output tsv
```

Now you can create the job. This example uses `folder1/` as the prefix. The job de-identifies any document that matches this prefix and writes the de-identified version with the `output_files/` prefix.

```csharp
using Azure;

Uri storageAccountContainerUri = new("https://exampleStorageAccount.blob.core.windows.net/containerName");

DeidentificationJob job = new(
    new SourceStorageLocation(storageAccountContainerUri, "folder1/"),
    new TargetStorageLocation(storageAccountContainerUri, "output_files/")
);

job = client.CreateJob(WaitUntil.Started, "my-job-1", job).Value;
```

### Get the status of a de-identification job

After you create a job, you can view the status and other details of the job.

```csharp
DeidentificationJob job = client.GetJob("my-job-1").Value;
```


## Run the code

After you update your code in your project, run it by using:

```bash
dotnet run
```

## Clean up resources

### Delete de-identification service

```bash
az resource delete -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices
```

### Delete Azure Storage account

```bash
az resource show -n $STORAGE_ACCOUNT_NAME -g $RESOURCE_GROUP_NAME  --resource-type Microsoft.Storage/storageAccounts
```

### Delete role assignment

```bash
az role assignment delete --assignee $DEID_SERVICE_PRINCIPAL_ID --role "Storage Blob Data Contributor" --scope $STORAGE_ACCOUNT_ID
```


## Troubleshooting

### Unable to access source or target storage

Ensure you have the necessary permissions, and that the Managed Identity for the de-identification service is set up properly.

See [Authorize de-identification service on the Azure Storage account](#authorize-de-identification-service-on-the-azure-storage-account).

### Job failed with status PartialFailed

Use the `GetJobDocuments` function on the `DeidentificationClient` to view per file error messages.

See [Sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/tests/samples/Sample4_ListCompletedFiles.cs).


## Next steps

In this quickstart, you learned:

* How to create a de-identification service and assign a role on a storage account.
* How to create a de-identification client.
* How to de-identify strings and create jobs on documents within a storage account.

> [!div class="nextstepaction"]
> [View source code and .NET Client Library README](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/healthdataaiservices/Azure.Health.Deidentification)
