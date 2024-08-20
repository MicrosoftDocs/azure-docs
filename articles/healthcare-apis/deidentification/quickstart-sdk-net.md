---
title: "Quickstart: Azure Health de-identification client library for .NET"
description: A quickstart guide to de-identify health data with the .NET client library
author: GrahamMThomas
ms.author: gthomas
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart-sdk
ms.date: 08/05/2024
---


# Quickstart: Azure Health Deidentification client library for .NET

Get started with the Azure Health De-identification client library for .NET to de-identify your health data. Follow these steps to install the package and try out example code for basic tasks.

[API reference documentation](/dotnet/api/azure.health.deidentification) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/healthdataaiservices) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Health.Deidentification) | [More Samples on GitHub](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/samples/README.md)


## Prerequisites
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Storage Account (only for job workflow).

## Setting up

### Create a Deidentification service (preview)

A de-identification service (preview) provides you with an endpoint URL. This endpoint url can be utilized as a Rest API or with an SDK.

1. Install [Azure CLI](/cli/azure/install-azure-cli)
2. Create a de-identification service resource

    ```bash
    REGION="<Region>"
    RESOURCE_GROUP_NAME="<ResourceGroupName>"
    DEID_SERVICE_NAME="<NewDeidServiceName>"
    az resource create -g $RESOURCE_GROUP_NAME -n $DEID_SERVICE_NAME --resource-type microsoft.healthdataaiservices/deidservices --is-full-object -p "{\"identity\":{\"type\":\"SystemAssigned\"},\"properties\":{},\"location\":\"$REGION\"}"
    ```
    
### Create an Azure Storage Account

1. Install [Azure CLI](/cli/azure/install-azure-cli)
1. Create an Azure Storage Account

    ```bash
    STORAGE_ACCOUNT_NAME="<NewStorageAccountName>"
    az storage account create --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --location $REGION
    ```

### Authorize deidentification service (preview) on Storage Account

-  Give the de-identification service (preview) access to your storage account
   
   ```bash
    STORAGE_ACCOUNT_ID=$(az storage account show --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --query id --output tsv)
    DEID_SERVICE_PRINCIPAL_ID=$(az resource show -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices --query identity.principalId --output tsv)
    az role assignment create --assignee $DEID_SERVICE_PRINCIPAL_ID --role "Storage Blob Data Contributor" --scope $STORAGE_ACCOUNT_ID
    ```

### Install the package
The client library is available through NuGet, as the `Azure.Health.Deidentification` package.

1. Install package
  
    ```bash
    dotnet add package Azure.Health.Deidentification
    ```

1. Also, install the Azure Identity package if not already installed.

    ```bash
    dotnet add package Azure.Identity
    ```


## Object model

- [DeidentificationClient](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationClient.cs) is responsible for the communication between the SDK and our De-identification Service Endpoint.
- [DeidentificationContent](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationContent.cs) is used for string de-identification.
- [DeidentificationJob](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationJob.cs) is used to create jobs to de-identify documents in an Azure Storage Account.
- [PhiEntity](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/PhiEntity.cs) is the span and category of a single PHI entity detected via a Tag OperationType.


## Code examples
- [Create a Deidentification Client](#create-a-deidentification-client)
- [De-identify a string](#de-identify-a-string)
- [Tag a string](#tag-a-string)
- [Create a Deidentification Job](#create-a-deidentification-job)
- [Get the status of a Deidentification Job](#get-the-status-of-a-deidentification-job)

### Create a deidentification client

Before you can create the client, you need to find your **de-identification service (preview) endpoint URL**.

You can find the endpoint URL with the Azure CLI:

```bash
az resource show -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices --query properties.serviceUrl --output tsv
```
Then you can create the client using that value.

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

This function allows you to de-identify any string you have in memory.

```csharp
DeidentificationContent content = new("SSN: 123-04-5678");
DeidentificationResult result = await client.DeidentifyAsync(content);
```

### Tag a string

Tagging can be done the same way and de-identifying by changing the `OperationType`.

```csharp
DeidentificationContent content = new("SSN: 123-04-5678");
content.Operation = OperationType.Tag;

DeidentificationResult result = await client.DeidentifyAsync(content);
```

### Create a deidentification job

This function allows you to de-identify all files, filtered via prefix, within an Azure Blob Storage Account.

To create the job, we need the URL to the blob endpoint of the Azure Storage Account.

```bash
az resource show -n $STORAGE_ACCOUNT_NAME -g $RESOURCE_GROUP_NAME  --resource-type Microsoft.Storage/storageAccounts --query properties.primaryEndpoints.blob --output tsv
```

Now we can create the job. This example uses `folder1/` as the prefix. The job will de-identify any document that matches this prefix and write the de-identified version with the `output_files/` prefix.

```csharp
using Azure;

Uri storageAccountUri = new("");

DeidentificationJob job = new(
    new SourceStorageLocation(new Uri(storageAccountUrl), "folder1/"),
    new TargetStorageLocation(new Uri(storageAccountUrl), "output_files/")
);

job = client.CreateJob(WaitUntil.Started, "my-job-1", job).Value;
```

### Get the status of a deidentification job

Once a job is created, you can view the status and other details of the job.

```csharp
DeidentificationJob job = client.GetJob("my-job-1").Value;
```


## Run the code

Once your code is updated in your project, you can run it using:

```bash
dotnet run
```

## Clean up resources

### Delete deidentification service

```bash
az resource delete -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices
```

### Delete Azure Storage Account

```bash
az resource show -n $STORAGE_ACCOUNT_NAME -g $RESOURCE_GROUP_NAME  --resource-type Microsoft.Storage/storageAccounts
```

### Delete role assignment

```bash
az role assignment delete --assignee $DEID_SERVICE_PRINCIPAL_ID --role "Storage Blob Data Contributor" --scope $STORAGE_ACCOUNT_ID
```


## Troubleshooting

### Unable to access source or target storage

Ensure the permissions are given, and the Managed Identity for the de-identification service (preview) is set up properly.

See [Authorize deidentification service on Storage Account](#authorize-deidentification-service-preview-on-storage-account)

### Job failed with status PartialFailed

You can utilize the `GetJobDocuments` function on the `DeidentificationClient` to view per file error messages.

See [Sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/tests/samples/Sample4_ListCompletedFiles.cs)


## Next steps

In this quickstart, you learned:
- How to create a de-identification service (preview) and assign a role on a storage account.
- How to create a deidentification client
- How to de-identify strings and create jobs on documents within a storage account.

> [!div class="nextstepaction"]
> [View source code and .NET Client Library README](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/healthdataaiservices/Azure.Health.Deidentification)
