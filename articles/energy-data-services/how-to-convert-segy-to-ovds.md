---
title: Microsoft Azure Data Manager for Energy Preview - How to convert a segy to ovds file
description: This article explains how to convert a SEG-Y file to oVDS file format
author: suzafar
ms.author: suzafar
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 09/13/2023
ms.custom: template-concept
---

# How to convert a SEG-Y file to oVDS

In this article, you learn how to convert SEG-Y formatted data to the Open VDS (oVDS) format. Seismic data stored in the industry standard SEG-Y format can be converted to oVDS format for use in applications via the Seismic DDMS. See here for  OSDU&reg; community reference: [SEG-Y to oVDS conversation](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-vds-conversion/-/tree/master). This tutorial is a step by step guideline on how to perform the conversion. Note the actual production workflow may differ and use it as a guide for the required set of steps to achieve the conversion.

## Prerequisites
* An Azure subscription
* An instance of [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) created in your Azure subscription
* cURL command-line tool installed on your machine
* Service principal access_token to call the Seismic APIs. See [How to generate auth token](how-to-generate-auth-token.md).
- A SEG-Y File
  - You may use any of the following files from the Volve dataset as a test. The Volve data set itself is available from [Equinor](https://www.equinor.com/energy/volve-data-sharing).
    - [Medium < 250 MB](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/blob/azure/m16-master/source/ddms-smoke-tests/ST0202R08_PS_PSDM_RAW_DEPTH.MIG_RAW.POST_STACK.3D.JS-017534.segy)
    - [Large ~ 1 GB](https://community.opengroup.org/osdu/platform/deployment-and-operations/infra-azure-provisioning/-/blob/283ba58aff7c40e62c2ac649e48a33643571f449/source/ddms-smoke-tests/sample-ST10010ZC11_PZ_PSDM_KIRCH_FULL_T.MIG_FIN.POST_STACK.3D.JS-017536.segy)

### Get details for the Azure Data Manager for Energy instance

* For this tutorial, you need the following parameters:

| Parameter | Value to use | Example | Where to find this value |
|----|----|----|----|
| `DNS` | URI | `<instance>.energy.azure.com` | Find this value on the overview page of the Azure Data Manager for Energy instance. |
| `data-partition-id` | Data partition | `<data-partition-id>` | Find this value on the Data Partition section within the Azure Data Manager for Energy instance. |
| `access_token`       | access_token value       | `0.ATcA01-XWHdJ0ES-qDevC6r...........`| Follow [How to generate auth token](how-to-generate-auth-token.md) to create an access_token and save it.|

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user who's running this tutorial.

### Set up your environment

Ensure you have `cURL` installed on your system. You use it to make API calls.

## Step by Step Process to convert SEG-Y file to oVDS 

### Create a legal tag

Create a legal tag for data compliance.

 **Create Legal Tag for SDMS**

```bash
cURL --request POST \
  --url https://{DNS}/api/legal/v1/legaltags \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'Data-Partition-Id:  {data_partition_id}' \
  --data '{
    "name": "<vds_legal_tag_id>",
    "description": "Legal Tag added for Seismic",
    "properties": {
        "countryOfOrigin": [
            "US"
        ],
        "contractId": "No Contract Related",
        "expirationDate": "2099-01-01",
        "dataType": "Public Domain Data",
        "originator": "OSDU",
        "securityClassification": "Public",
        "exportClassification": "EAR99",
        "personalData": "No Personal Data"
    }
}'
```
**Sample Response:** 
```json
{
	"name": "<vds_legal_tag_id>",
	"description": "Legal Tag added for Seismic",
	"properties": {
		"countryOfOrigin": [
			"US"
		],
		"contractId": "No Contract Related",
		"expirationDate": "2099-01-01",
		"originator": "OSDU",
		"dataType": "Public Domain Data",
		"securityClassification": "Public",
		"personalData": "No Personal Data",
		"exportClassification": "EAR99"
	}
}
```




For more information, see [Manage legal tags](how-to-manage-legal-tags.md).

### Prepare dataset files

This file contains the sample [Vector Header Mapping](https://github.com/microsoft/adme-samples/blob/main/postman/CreateVectorHeaderMappingKeys_SEGYtoVDS.json) and this file contains the sample [Storage Records](https://github.com/microsoft/adme-samples/blob/main/postman/StorageRecord_SEGYtoVDS.json) for the VDS conversion.

### Validate User Access

Use the following `cURL` command to get user groups:

```bash
cURL -X GET "https://<DNS>/api/entitlements/v2/groups" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data_partition_id>"
```

**Sample Response:**
```json
{
  "groups": [
    "data.default.owners@<data_partition_id>.<domain>",
    "data.default.viewers@<data_partition_id>.<domain>",
    "users.datalake.admins@<data_partition_id>.<domain>"
  ]
}
```

### Add User to Admin Group

Use the following `cURL` command to add a user to the admin group:

```bash
cURL -X POST "https://<DNS>/api/entitlements/v2/groups/users.datalake.admins@<data_partition_id>.<domain>/members" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data_partition_id>"
     -d '{
           "email": "<client_id>",
           "role": "OWNER"
       }'
```

**Sample Response:**
```json
{
  "status": "Success",
  "message": "User added to admin group successfully."
}
```

If you didn't create entitlements groups, follow the directions as outlined in [How to manage users](how-to-manage-users.md). If you would like to see what groups you have, use [Get entitlements groups for a given user](how-to-manage-users.md#get-osdu-groups-for-a-given-user-in-a-data-partition). Data access isolation is achieved with this dedicated ACL (access control list) per object within a given data partition. 

Follow this [tutorial](tutorial-seismic-ddms.md) to Prepare subproject that involves following steps:

1. Register Data Partition to Seismic - Create a tenant
2. Create a Subproject
3. Register a Dataset

### Upload the File

There are two ways to upload a SEGY file. One option is to use the SAS url through cURL call. You need to set up cURL on your OS. 
The second method is to use [SDUTIL](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil/-/tags/azure-stable). To log in to your instance for ADME via the tool, you need to generate a refresh token for the instance. See [How to generate auth token](how-to-generate-auth-token.md). Alternatively, you can modify the code of SDUTIL to use client credentials instead to log in. If you haven't already, you need to set up SDUTIL. Check the [guide](tutorial-seismic-ddms-sdutil.md) for setting up SDUTIL. Download the codebase and edit the `config.yaml` at the root. Replace the contents of this config file with the following yaml. 

```yaml
seistore:
    service: '{"azure": {"azureEnv":{"url": "https://<DNS>/seistore-svc/api/v3", "appkey": "">}'
    url: 'https://<DNS>/seistore-svc/api/v3'
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

#### Method 1: Using cURL to upload file

##### Get gcs url:

```bash
cURL -X GET \
    -H "content-type: application/json" \
    -H "Authorization: Bearer <access_token>" \
    "https://<DNS>/seistore-svc/api/v3/dataset/tenant/<data-partition-id>/subproject/<vdssubprojectname>/dataset/<datasetname>"
```

**Sample Response:**
Should be a string. We call it gcsstring.


##### Get the SAS url:

Use the following `cURL` command to get a SAS upload URL:

```bash
cURL -X 'GET' \
  'https://<DNS>/seistore-svc/api/v3/utility/upload-connection-string?sdpath=sd://<tenant>/<vdssubprojectname>' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <access_token>'
```

**Sample Response:**
```json
{
  "access_token": "<SAS token>",
  "expires_in": <duration>,
  "token_type": "SAS Url"
}
```
#### Modify SAS url. Replace container name in SAS url with filepath, that is, gcsstring

```bash
filepath="<gcsstring>"
container=$(echo "$filepath" | cut -d'/' -f1)
SASurl=$(echo "<SAS token>" | sed "s|$container|$filepath|")
```

##### Upload the SEG-Y file:

Use the following `cURL` command:

```bash
cURL -X PUT -T "<local_file_path>" "<SAS_url>" \
     -H "x-ms-blob-type: BlockBlob"
```

**Sample Response:**
```json
{
  "status": "Success",
  "message": "File uploaded successfully."
}
```

##### Verify upload

Use the following `cURL` command to verify file upload:

```bash
cURL -X 'GET' \
  'https://<DNS>/seistore-svc/api/v3/utility/ls?sdpath=sd://<tenant>/<vdssubprojectname>' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <access_token>'
```

**Sample Response:**
```json
[
  list of files.
]
```

#### Method 2: SDUTIL

**sdutil** is an OSDU desktop utility to access seismic service. We use it to upload/download files. Use the azure-stable tag from [SDUTIL](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil/-/tags/azure-stable).

> [!NOTE]
> When running `python sdutil config init`, you don't need to enter anything when prompted with `Insert the azure (azureGlabEnv) application key:`.

```bash
python sdutil config init
python sdutil auth login
python sdutil ls sd://<data-partition-id>/<vdssubprojectname>/
```

Upload your seismic file to your Seismic Store. Here's an example with a SEGY-format file called `source.segy`:

```bash
python sdutil cp <local folder>/source.segy sd://<data-partition-id>/<vdssubprojectname>/destination.segy
```
For example:

```bash
python sdutil cp ST10010ZC11_PZ_PSDM_KIRCH_FULL_T.MIG_FIN.POST_STACK.3D.JS-017536.segy sd://<data-partition-id>/<vdssubprojectname>/destination.segy
```

### Create Header Vector Mapping 

This file contains the sample [Vector Header Mapping](https://github.com/microsoft/adme-samples/blob/main/postman/CreateVectorHeaderMappingKeys_SEGYtoVDS.json). You can get the request payload from sample. 

Use the following `cURL` command:

```bash
cURL -X PUT "https://<DNS>/api/storage/v2/records" \
     -H "Authorization: Bearer <access_token>" \
     -H "Content-Type: application/json" \
     -H "data-partition-id: <data_partition_id>" \
     -d '{
           "id": "<header_key_cmpx>",
           "kind": "<authority>:<schemaSource>:reference-data--HeaderKeyName:1.0.0",
           "acl": {
               "owners": ["data.default.owners@<data_partition_id>.<domain>"],
               "viewers": ["data.default.viewers@<data_partition_id>.<domain>"]
           },
           "legal": {
               "legaltags": ["<vds_legal_tag_id>"],
               "otherRelevantDataCountries": ["US"]
           },
           "data": {
               "Name": "CMPX",
               "Description": "X coordinate of bin center",
               "Code": "CMPX",
               "Source": "Workbook Published/HeaderKeyName.1.0.0.xlsx; commit SHA 38615b34.",
               "CommitDate": "2021-02-25T09:18:48-05:00"
           }
       }'
```

**Sample Response:**
```json
{
  "status": "Created"
}
```

### Create Storage Records

This file contains the sample [Storage Records](https://github.com/microsoft/adme-samples/blob/main/postman/StorageRecord_SEGYtoVDS.json) for the VDS conversion. 

Use the following `cURL` command to create storage records:

```bash
cURL --request PUT \
  --url 'https://<DNS>/api/storage/v2/records' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
    {
        "data": {
            --put your data here
        },
        "meta": [],
        "kind": "osdu:wks:work-product--WorkProduct:1.0.0",
        "id": "{{work-product-id}}",
        "acl": {
            "owners": [
                "data.default.owners@{{DATA_PARTITION_ID}}{{domain}}"
            ],
            "viewers": [
                "data.default.viewers@{{DATA_PARTITION_ID}}{{domain}}"
            ]
        },
        "legal": {
            "legaltags": [
                "{{vds_legal_tag_id}}"
            ],
            "otherRelevantDataCountries": [
                "NO"
            ],
            "status": "compliant"
        }
    },
    
    
]'
       
```

**Sample Response:**
```json
{
  "status": "Created"
}
```

### Run Converter

1. Trigger the VDS Conversion DAG to convert your data using the execution context values you saved in previous step.

    Fetch the ID token from sdutil for the uploaded file or use an access/bearer token from cURL.

    ```Markdown
    python sdutil auth idtoken
    ```

    Use the following `cURL` command to trigger workflow:

    ```Bash
    cURL -X POST "https://<DNS>/api/workflow/v1/workflow/<segy-to-vds-conversion dag id>" \
        -H "Authorization: Bearer <access_token>" \
        -H "Content-Type: application/json" \
        -d '{
            "executionContext": {
                "Payload": {
                    "AppKey": "test-app",
                    "data-partition-id": "<data_partition_id>"
                },
                "vds_url": "sd://<data_partition_id>/<vdssubprojectname>",
                "work_product_id": "<work-product-id>",
                "file_record_id": "<file-record-id>",
                "persistent_id": "<persistent_id>",
                "id_token": "<access_token>"
            }
        }'
    ```

    **Sample Response:**
    ```json
    {
    "runId": "workflow-12345",
    "status": "Running",
    "message": "Workflow triggered successfully."
    }
    ```

2. Let the DAG run to the `succeeded` state. You can check the status using the workflow status call. The run ID is in the response of the previous step.

    Use the following `cURL` command:

    ```Bash
    cURL -X GET "https://<DNS>/api/workflow/v1/workflow/segy-to-vds-conversion/<vds_run_id>" \
        -H "Authorization: Bearer <access_token>" \
        -H "Content-Type: application/json"
    ```

    **Sample Response:**
    ```json
    {
    "runId": "workflow-12345",
    "status": "Completed",
    "message": "Workflow completed successfully."
    }
    ```

### Verify File Conversion

1. Use the following `cURL` command to verify file conversion:

    ```Bash
        cURL --request GET \
        --url 'http://{{seismic_ddms_host}}/utility/ls?sdpath=sd://{{tenant}}/{{vdsTestSubprojectName}}' \
        --header 'Authorization: Bearer {{access_token}}'
    ```
        
    **Sample Response:**
    ```json
        {
        List of datasets
        }
    ```

2. You can see if the converted file is present using the following command in sdutil

    ```bash
    python sdutil ls sd://<data-partition-id>/vdssubprojectname
    ```

3. Verify the converted files are present on the specified location in DAG Trigger or not

    ```Markdown
    python sdutil ls sd://<data-partition-id>/vdssubprojectname/
    ```

4. If you would like to download and inspect your VDS files, don't use the `cp` command as it doesn't work. The VDS conversion results in multiple files, therefore the `cp` command won't download all of them in one command. Use either the [SEGYExport](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/SEGYExport/README.html) or [VDSCopy](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/tools/VDSCopy/README.html) tool instead. These tools use a series of REST calls accessing a [naming scheme](https://osdu.pages.opengroup.org/platform/domain-data-mgmt-services/seismic/open-vds/connection.html) to retrieve information about all the resulting VDS files.

OSDU&reg; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to convert a segy to zgy file](./how-to-convert-segy-to-zgy.md)

