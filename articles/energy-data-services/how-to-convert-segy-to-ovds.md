---
title: Microsoft Azure Data Manager for Energy Preview - How to convert a segy to ovds file
description: This article explains how to convert a SGY file to oVDS file format
author: elizabethhalper
ms.author: elhalper
ms.service: energy-data-services
ms.topic: how-to
ms.date: 08/18/2022
ms.custom: template-concept
---

# How to convert a SEG-Y file to oVDS

In this article, you will learn how to convert SEG-Y formatted data to the Open VDS (oVDS) format. Seismic data stored in the industry standard SEG-Y format can be converted to oVDS format for use in applications via the Seismic DMS.

[OSDU&trade; SEG-Y to oVDS conversation](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-vds-conversion/-/tree/release/0.15)

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Prerequisites

1. Download and install [Postman](https://www.postman.com/) desktop app.
2. Import the [oVDS Conversions.postman_collection](https://community.opengroup.org/osdu/platform/pre-shipping/-/blob/main/R3-M9/Azure-M9/Services/DDMS/oVDS_Conversions.postman_collection.json) into Postman. All curl commands used below are added to this collection. Update your Environment file accordingly
3. Ensure that an Azure Data Manager for Energy Preview instance is created already
4. Clone the **sdutil** repo as shown below:

  ```markdown
  git clone https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil.git

  git checkout azure/stable
  ```

## Convert SEG-Y file to oVDS file

1. Check if VDS is registered with the workflow service or not:

   ```markdown
    curl --location --request GET '<url>/api/workflow/v1/workflow/'
          --header 'Data-Partition-Id: <datapartition>'
          --header 'Content-Type: application/json'
          --header 'Authorization: Bearer {{TOKEN}}
   ```

   You should see VDS converter DAG in the list. IF NOT in the response list then REPORT the issue to Azure Team

2. Open **sdutil** and edit the `config.yaml` at the root to include the following yaml and fill in the three templatized values (two instances of `<meds-instance-url>` and one `<put refresh token here...>`). See [Generate a refresh token](how-to-generate-refresh-token.md) on how to generate a refresh token. If you continue to follow other "how-to" documentation, you'll use this refresh token again. Once you've generated the token, store it in a place where you'll be able to access it in the future.

    ```yaml
    seistore:
        service: '{"azure": {"azureEnv":{"url": "<url>/seistore-svc/api/v3", "appkey": ""}}}'
        url: '<url>/seistore-svc/api/v3'
        cloud_provider: azure
        env: glab
        auth-mode: JWT Token
        ssl_verify: false
    auth_provider:
        azure: '{ 
            "provider": "azure", 
            "authorize_url": "https://login.microsoftonline.com/", "oauth_token_host_end": "/oauth2/v2.0/token", 
            "scope_end":"/.default openid profile offline_access",
            "redirect_uri":"http://localhost:8080",
            "login_grant_type": "refresh_token",
            "refresh_token": "<RefreshToken acquired earlier>" 
            }'
    azure:
        empty: none
    ```

3. Run **sdutil** to see if it's working fine. Follow the directions in [Setup and Usage for Azure env](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil/-/tree/azure/stable#setup-and-usage-for-azure-env). Understand that depending on your OS and Python version, you may have to run `python3` command as opposed to `python`.

    > [!NOTE] 
    > when running `python sdutil config init`, you don't need to enter anything when prompted with `Insert the azure (azureGlabEnv) application key:`.

4. Upload the seismic file

    ```markdown
    python sdutil cp \source.segy sd://<datapartition>/<subproject>/destination.segy
    ```

5. Fetch the idtoken from sdutil for the uploaded file.

   ```markdown
    python sdutil auth idtoken
    ```

6. Trigger the DAG through `POSTMAN` or using the call below:

   ```bash
    curl --location --request POST '<url>/api/workflow/v1/workflow/<dag-name>/workflowRun' \
        --header 'data-partition-id: <datapartition>' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer {{TOKEN}}' \
        --data-raw '{
            "executionContext": {
               "vds_url": "sd://<datapartition>/<subproject>",
               "persistent_id": "<filename>",
               "id_token": "<token>",
               "segy_url": "sd://<datapartition>/<subproject>/<filename>.segy"

        }    
    }'
    ```

7. Let the DAG run to complete state. You can check the status using the workflow status call

8. Verify the converted files are present on the specified location in DAG Trigger or not

    ```markdown
    python sdutil ls sd://<datapartition>/<subproject>/
    ```

9. If you would like to download and inspect your VDS files, don't use the `cp` command as it will not work. The VDS conversion results in multiple files, therefore the `cp` command won't be able to download all of them in one command. Use either the [SEGYExport](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/SEGYExport/README.html) or [VDSCopy](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/VDSCopy/README.html) tool instead. These tools use a series of REST calls accessing a [naming scheme](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/connection.html) to retrieve information about all the resulting VDS files.

OSDU&trade; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to convert a segy to zgy file](./how-to-convert-segy-to-zgy.md)