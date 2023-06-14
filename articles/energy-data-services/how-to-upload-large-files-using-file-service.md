---
title: How to upload large files using File service API in Microsoft Azure Data Manager for Energy Preview
description: This article describes how to to upload large files in ADME using File service API in Microsoft Azure Data Manager for Energy Preview
author: harshit283
ms.author: haaggarw
ms.service: energy-data-services
ms.topic: how-to
ms.date: 06/13/2023
ms.custom: template-how-to
---

# How to upload files in Azure Data Manager for Energy preview using File service
In this article, you know how to upload large files using File service API in Microsoft Azure Data Manager for Energy Preview. The upload process involves fetching a signed URL from [File API](https://community.opengroup.org/osdu/platform/system/file/-/tree/master/) and then using the signed URL to store the file into Azure Blob Storage

## Generate a signed URL
Run the below curl command in Azure Cloud Bash to get a signed URL from file service for a given data partition of your Azure Data Manager for Energy Preview instance.

```bash
    curl --location 'https://<URI>/api/file/v2/files/uploadURL' \
    --header 'data-partition-id: <data-partition-id>' \
    --header 'Authorization: Bearer <access_token>' \
    --header 'Content-Type: text/plain'
```

### Sample request
Consider an Azure Data Manager for Energy Preview instance named "medstest" with a data partition named "dp1"

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

## Upload files with size less than 5000 MiB
In order to upload file sizes less than 5000 MiB one can directly use [PUT blob API](https://learn.microsoft.com/en-us/rest/api/storageservices/put-blob?tabs=azure-ad) call to upload their files into Azure Blob Storage

### Sample Curl Request
```bash
    curl --location --request PUT '<SIGNED_URL>' \
    --header 'x-ms-blob-type: BlockBlob' \
    --header 'Content-Type: <file_type>' \ # for instance application/zip or application/csv or application/json depending on file type
    --data '@/<path_to_file>'
```
If the upload is successful, we get a 201 Created status code in response

## Upload files with size greater or equal to 5000 MiB
In order to upload files with sizes >= 5000 MiB, we would need [azcopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-ref-azcopy)utility as a single PUT blob call can't be greater than 5000 MiB [doc link](https://learn.microsoft.com/en-us/azure/storage/blobs/scalability-targets#scale-targets-for-blob-storage)

### Steps
1. Download azcopy using this [link](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10#download-azcopy)

2. Run this command to upload your file

```bash
    azcopy copy "<path_to_file>" "signed_url"
```

3. Sample response 

:::image type="content" source="media/how-to-upload-large-files-using-file-service/1-azcopy-sample-response.png" alt-text="Screenshot of azcopy copy command response":::

## Next steps
Begin your journey by ingesting data into your Azure Data Manager for Energy Preview resource.
> [!div class="nextstepaction"]
> [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
> [!div class="nextstepaction"]
> [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
