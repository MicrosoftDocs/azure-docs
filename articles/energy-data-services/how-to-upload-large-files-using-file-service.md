---
title: How to upload large files using file service API in Microsoft Azure Data Manager for Energy
description: This article describes how to upload large files using File service API in Microsoft Azure Data Manager for Energy
author: harshit283
ms.author: haaggarw
ms.service: energy-data-services
ms.topic: how-to
ms.date: 06/13/2023
ms.custom: template-how-to
---

# How to upload files in Azure Data Manager for Energy using File service
In this article, you know how to upload large files (~5GB) using File service API in Microsoft Azure Data Manager for Energy. The upload process involves fetching a signed URL from [File API](https://community.opengroup.org/osdu/platform/system/file/-/tree/master/) and then using the signed URL to store the file into Azure Blob Storage

## Generate a signed URL
Run the below curl command in Azure Cloud Bash to get a signed URL from file service for a given data partition of your Azure Data Manager for Energy resource.

```bash
    curl --location 'https://<URI>/api/file/v2/files/uploadURL' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: text/plain'
```

### Sample request
Consider an Azure Data Manager for Energy resource named "medstest" with a data partition named "dp1"

```bash
    curl --location --request POST 'https://medstest.energy.azure.com/api/file/v2/files/uploadURL' \
    --header 'data-partition-id: medstest-dp1' \
    --header 'Authorization: Bearer  eyxxxxxxx.........................' \
    --header 'Content-Type: text/plain'
```

### Sample response

```JSON
{
    "FileID": "2c5e7ac738a64eaeb7c0bc8bd47f90b6",
    "Location": {
        "SignedURL": "https://dummy.bloburl.com",
        "FileSource": "/osdu-user/1686647303778-2023-06-13-09-08-23-778/2c5e7ac738a64eaeb7c0bc8bd47f90b6"
    }
}
```

The SignedURL key in the response object can be then used to upload files into Azure Blob Storage

## Upload files with size less than 5 GB
In order to upload file sizes less than 5 GB one can directly use [PUT blob API](https://azure.github.io/Storage/docs/application-and-user-data/basics/azure-blob-storage-upload-apis/#put-blob) call to upload their files into Azure Blob Storage

### Sample Curl Request
```bash
    curl --location --request PUT '<SIGNED_URL>' \
    --header 'x-ms-blob-type: BlockBlob' \
    --header 'Content-Type: <file_type>' \ # for instance application/zip or application/csv or application/json depending on file type
    --data '@/<path_to_file>'
```
If the upload is successful, we get a `201 Created` status code in response

## Upload files with size greater or equal to 5 GB
To upload files with sizes >= 5 GB, we would need [azcopy](https://github.com/Azure/azure-storage-azcopy)utility as a single PUT blob call can't be greater than 5 GB [doc link](https://azure.github.io/Storage/docs/application-and-user-data/basics/azure-blob-storage-upload-apis/#put-blob)

### Steps
1. Download `azcopy` using this [link](https://github.com/Azure/azure-storage-azcopy#download-azcopy)

2. Run this command to upload your file

```bash
    azcopy copy "<path_to_file>" "signed_url"
```

3. Sample response 

```
    INFO: Could not read destination length. If the destination is write-only, use --check-length=false on the command line.
    100.0 %, 1 Done, 0 Failed, 0 Pending, 0 Skipped, 1 Total
    
    Job 624c59e8-9d5c-894a-582f-ef9d3fb3091d summary
    Elapsed Time (Minutes): 0.1002
    Number of File Transfers: 1
    Number of Folder Property Transfers: 0
    Number of Symlink Transfers: 0
    Total Number of Transfers: 1
    Number of File Transfers Completed: 1
    Number of Folder Transfers Completed: 0
    Number of File Transfers Failed: 0
    Number of Folder Transfers Failed: 0
    Number of File Transfers Skipped: 0
    Number of Folder Transfers Skipped: 0
    TotalBytesTransferred: 1367301
    Final Job Status: Completed
```

## Next steps
Begin your journey by ingesting data into your Azure Data Manager for Energy resource.
> [!div class="nextstepaction"]
> [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
> [!div class="nextstepaction"]
> [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
