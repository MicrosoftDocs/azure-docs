---
title: "Quickstart: Azure Health Deidentification client library for .NET"
description: A Quickstart guide to deidentify health data with the .NET client library
author: GrahamMThomas
ms.author: gthomas
ms.service: healthcare-apis
ms.topic: quickstart-sdk
ms.date: 08/05/2024
---


# Quickstart: Azure Health Deidentification client library for .NET

Get started with the Azure Health Deidentification client library for .NET to deidentify your health data. Follow these steps to install the package and try out example code for basic tasks.

[API reference documentation](/dotnet/api/azure.health.deidentification) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/healthdataaiservices) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Health.Deidentification) | [More Samples on GitHub](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/samples/README.md)


## Prerequisites
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Storage Account (Only for job workflow)


## Setting up

### Create an Azure Deidentification Service

An Azure Deidentification Service provides you with an endpoint URL. This endpoint url can be utilized as a Rest API or with an SDK.

1. Install [Azure CLI](/cli/azure/install-azure-cli)
2. Create Deidentification Service Resource

    ```bash
    REGION="<Region>"
    RESOURCE_GROUP_NAME="<ResourceGroupName>"
    DEID_SERVICE_NAME="<NewDeidServiceName>"
    az resource create -g $RESOURCE_GROUP_NAME -n $DEID_SERVICE_NAME --resource-type microsoft.healthdataaiservices/deidservices --is-full-object -p "{\"identity\":{\"type\":\"SystemAssigned\"},\"properties\":{},\"location\":\"$REGION\"}"
    ```
    
### Create an Azure Storage Account

1. Install [Azure CLI](/cli/azure/install-azure-cli)
2. Create an Azure Storage Account

    ```bash
    STORAGE_ACCOUNT_NAME="<NewStorageAccountName>"
    az storage account create --name $STORAGE_ACCOUNT_NAME --resource-group $RESOURCE_GROUP_NAME --location $REGION
    ```

### Authorize Deidentification Service on Storage Account.

3. Give Deidentification Service access to your storage account
   
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

- [DeidentificationClient](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationClient.cs) is responsible for the communication between the SDK and our Deidentification Service Endpoint.
- [DeidentificationContent](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationContent.cs) is used for string deidentification.
- [DeidentificationJob](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/DeidentificationJob.cs) is used to create jobs to deidentify documents in an Azure Storage Account.
- [PhiEntity](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/src/Generated/PhiEntity.cs) is the span and category of a single PHI entity detected via a Tag OperationType.


## Code examples
- [Create a DeidentificationClient](#create-a-deidentificationclient)
- [Deidentify a string](#deidentify-a-string)
- [Tag a string](#tag-a-string)
- [Create a Deidentification Job](#create-a-deidentification-job)
- [Get the status of a Deidentification Job](#get-the-status-of-a-deidentification-job)

### Create a DeidentificationClient

Before you can create the client, you need to find your **Deidentification Service Endpoint Url**.

You can do find the endpoint url with the Azure CLI

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

### Deidentify a string

This function allows you to deidentify any string you have in memory.

```csharp
DeidentificationContent content = new("SSN: 859-98-0987");
DeidentificationResult result = await client.DeidentifyAsync(content);
```

### Tag a string

Tagging can be done the same way and deidentifying by changing the `OperationType`.

```csharp
DeidentificationContent content = new("SSN: 859-98-0987");
content.Operation = OperationType.Tag;

DeidentificationResult result = await client.DeidentifyAsync(content);
```

### Create a Deidentification Job

This function allows you to deidentify all files, filtered via prefix, within an Azure Blob Storage Account.

To create the job, we need the url to the blob endpoint of the Azure Storage Account.

```bash
az resource show -n $STORAGE_ACCOUNT_NAME -g $RESOURCE_GROUP_NAME  --resource-type Microsoft.Storage/storageAccounts --query properties.primaryEndpoints.blob --output tsv
```

Now we can create the job. Here I used `folder1/` as the prefix. Any files that match this prefix are deidentified and output with the `output_files/` prefix.

```csharp
using Azure;

Uri storageAccountUri = new("");

DeidentificationJob job = new(
    new SourceStorageLocation(new Uri(storageAccountUrl), "folder1/"),
    new TargetStorageLocation(new Uri(storageAccountUrl), "output_files/")
);

job = client.CreateJob(WaitUntil.Started, "my-job-1", job).Value;
```

### Get the status of a Deidentification Job

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

### Delete Deidentification Service

```bash
az resource delete -n $DEID_SERVICE_NAME -g $RESOURCE_GROUP_NAME  --resource-type microsoft.healthdataaiservices/deidservices
```

### Delete Azure Storage Account

```bash
az resource show -n $STORAGE_ACCOUNT_NAME -g $RESOURCE_GROUP_NAME  --resource-type Microsoft.Storage/storageAccounts
```


## Troubleshooting

### Unable to access source or target storage

Ensure the permissions are given and the Managed Identity for the Deidentification Service is set up properly.

See [Authorize Deidentification Service on Storage Account](#authorize-deidentification-service-on-storage-account)

### Job failed with status PartialFailed

You can utilize the `GetJobDocuments` function on the `DeidentificationClient` to view per file error messages.

See [Sample](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/healthdataaiservices/Azure.Health.Deidentification/tests/samples/Sample4_ListCompletedFiles.cs)


## Next steps

We learned:
- How to create a Deidentification Service and assign a role on a storage account.
- How to create a Deidentification Client
- How to deidentify strings and create jobs on documents within a storage account.

> [!div class="nextstepaction"]
> [View source code and .NET Client Library README](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/healthdataaiservices/Azure.Health.Deidentification)
