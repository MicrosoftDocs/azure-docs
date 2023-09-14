---
title: Microsoft Azure Data Manager for Energy Preview - How to convert a segy to ovds file
description: This article explains how to convert a SGY file to oVDS file format
author: suzafar
ms.author: suzafar
ms.service: energy-data-services
ms.topic: how-to
ms.date: 09/07/2023
ms.custom: template-concept
---

# How to convert a SEG-Y file to oVDS

In this article, you will learn how to convert SEG-Y formatted data to the Open VDS (oVDS) format. Seismic data stored in the industry standard SEG-Y format can be converted to oVDS format for use in applications via the Seismic DMS.

[OSDU&trade; SEG-Y to oVDS conversation](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-vds-conversion/)

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

Review the details on the [ZGY Conversion](https://review.learn.microsoft.com/en-us/azure/energy-data-services/how-to-convert-segy-to-zgy) for additional information on **SDUTIL** and samples information 

## Step by Step Process to convert SEG-Y file to oVDS 

1. Fetch the name of the converter. Note the name of the ZGY Converter from the list returned by the following call:

   ```markdown
    curl --location --request GET '<instance url>/api/workflow/v1/workflow/'
          --header 'Data-Partition-Id: <data-partition-id>'
          --header 'Content-Type: application/json'
          --header 'Authorization: Bearer <access_token>
   ```

   You should see VDS converter DAG 'segy-to-vds-conversion' in the list. IF NOT in the response list then REPORT the issue to Azure Team

2. Upload the seismic file e.g. via **SDUTIL**

    ```markdown
    python sdutil cp \source.segy sd://<data-partition-id>/<subproject>/destination.segy
    ```
3. Generate the Header Vector Mapping - use the sample postman call in the collection 
4. Generate the Storage records - use sample postman call in the collection for reference 
5. Fetch the idtoken from sdutil for the uploaded file.

   ```markdown
    python sdutil auth idtoken
    ```

6. Trigger the DAG through `POSTMAN` or using the call below:

   ```bash
    curl --location --request POST '<instance url>/api/workflow/v1/workflow/<dag-name>/workflowRun' \
        --header 'data-partition-id: <data-partition-id>' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer <access_token>' \
        --data-raw '{
            "executionContext": {
                "Payload": {
                "AppKey": "test-app",
                "data-partition-id": "<data-partition-id>"
            },
            "vds_url": "sd://<data-partition-id>/<subproject id>",
            "work_product_id": "<data-partition-id>:work-product--WorkProduct:<guid>",
            "file_record_id": "<data-partition-id>:dataset--FileCollection.SEGY:<guid>",
            "persistent_id": "<file name>",
            "id_token": "<idtoken from sdutil>"
            }    
    }'
    ```

7. Let the DAG run to complete state. You can check the status using the workflow status call

8. Verify the converted files are present on the specified location in DAG Trigger or not

    ```markdown
    python sdutil ls sd://<data-partition-id>/<subproject>/
    ```

9. If you would like to download and inspect your VDS files, don't use the `cp` command as it will not work. The VDS conversion results in multiple files, therefore the `cp` command won't be able to download all of them in one command. Use either the [SEGYExport](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/SEGYExport/README.html) or [VDSCopy](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/VDSCopy/README.html) tool instead. These tools use a series of REST calls accessing a [naming scheme](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/connection.html) to retrieve information about all the resulting VDS files.

OSDU&trade; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to convert a segy to zgy file](./how-to-convert-segy-to-zgy.md)