---
title: Microsoft Azure Data Manager for Energy Preview - How to convert segy to zgy file
description: This article describes how to convert a SEG-Y file to a ZGY file
author: suzafar
ms.author: suzafar
ms.service: azure-data-manager-energy
ms.topic: how-to
ms.date: 09/13/2023
ms.custom: template-how-to
---

# How to convert a SEG-Y file to ZGY

In this article, you learn how to convert SEG-Y formatted data to the ZGY format. Seismic data stored in industry standard SEG-Y format can be converted to ZGY for use in applications such as Petrel via the Seismic DMS. See here for [ZGY Conversion FAQ's](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion#faq) and more background can be found in the OSDU&reg; community here: [SEG-Y to ZGY conversation](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion). This tutorial is a step by step guideline on how to perform the conversion. Note the actual production workflow may differ and use it as a guide for the required set of steps to achieve the conversion. 

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

## Step by Step Process to convert SEG-Y file to ZGY file

### Create a legal tag

Create a legal tag for data compliance.

**Create Legal Tag for SDMS**

```bash
cURL --request POST \
  --url https://<DNS>/api/legal/v1/legaltags \
  --header 'Authorization: Bearer {access_token}' \
  --header 'Content-Type: application/json' \
  --header 'Data-Partition-Id:  {data_partition_id}' \
  --data '{
    "name": "{legal_tag_name}",
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
	"name": "opendes-Seismic-Legal-Tag-Test999588567444",
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
Prepare the metadata / manifest file / records file for the dataset. The manifest file includes:  
  - WorkProduct
  - SeismicBinGrid
  - FileCollection
  - SeismicTraceData

Conversion uses a manifest file that you upload to your storage account later in order to run the conversion. This manifest file is created by using multiple JSON files and running a script. The JSON files for this process are stored [here](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion/-/tree/master/doc/sample-records/volve) for the Volve Dataset. For more information on Volve, such as where the dataset definitions come from, visit [their website](https://www.equinor.com/energy/volve-data-sharing). Complete the following steps in order to create the manifest file:

1. Clone the [repo](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion/-/tree/master/) and navigate to the folder `doc/sample-records/volve`
2. Edit the values in the `prepare-records.sh` bash script. Recall that the format of the legal tag is prefixed with the Azure Data Manager for Energy instance name and data partition name, so it looks like `<instancename>-<datapartitionname>-<legaltagname>`.
    ```bash
    DATA_PARTITION_ID=<data-partition-id>
    ACL_OWNER=data.default.owners@<data-partition-id>.<domain>
    ACL_VIEWER=data.default.viewers@<data-partition-id>.<domain>
    LEGAL_TAG=<legal_tag_name>
    ```
3. Run the `prepare-records.sh` script.
4. The output is a JSON array with all objects and is saved in the `all_records.json` file.
5. Save the `filecollection_segy_id` and the `work_product_id` values in that JSON file to use in the conversion step. That way the converter knows where to look for this contents of your `all_records.json`.

> [!NOTE]
> The `all_records.json` file must also contain appropriate data for each element.
>
> **Example**: The following parameters are used when calculating the ZGY coordinates for `SeismicBinGrid`:
> - `P6BinGridOriginEasting`
> - `P6BinGridOriginI`
> - `P6BinGridOriginJ`
> - `P6BinGridOriginNorthing`
> - `P6ScaleFactorOfBinGrid`
> - `P6BinNodeIncrementOnIaxis`
> - `P6BinNodeIncrementOnJaxis`
> - `P6BinWidthOnIaxis`
> - `P6BinWidthOnJaxis`
> - `P6MapGridBearingOfBinGridJaxis`
> - `P6TransformationMethod`
> - `persistableReferenceCrs` from the `asIngestedCoordinates` block
> If the `SeismicBinGrid` has the P6 parameters and the CRS specified under `AsIngestedCoordinates`, the conversion itself should be able to complete successfully, but Petrel doesn't understand the survey geometry of the file unless it also gets the five corner points under `SpatialArea`,`AsIngestedCoordinates`, `SpatialArea`, and `Wgs84Coordinates`.

### User Access

### Validate user access

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

Use the following `cURL` command to add a user to the admin group - users.datalake.admins:

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

### Prepare Subproject

Follow this [tutorial](tutorial-seismic-ddms.md) to Prepare subproject that involves following steps:

1. Register Data Partition to Seismic - Create a tenant
2. Create a Subproject
3. Register a Dataset

### Upload the File

There are two ways to upload a SEGY file. One option is to use the SAS url through cURL call. You need to set up cURL on your OS. 
The second method is to use [SDUTIL](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil/-/tags/azure-stable). To log in to your instance for ADME via the tool, you need to generate a refresh token for the instance. See [How to generate auth token](how-to-generate-auth-token.md). Alternatively, you can modify the code of SDUTIL to use client credentials instead to log in. If you haven't already, you need to set up SDUTIL. Check the [guide](tutorial-seismic-ddms-sdutil.md) for setting up SDUTIL. Download the codebase and edit the `config.yaml` at the root. Replace the contents of this config file with the following yaml. 

```yaml
seistore:
    service: '{"azure": {"azureEnv":{"url": "<instance url>/seistore-svc/api/v3", "appkey": "">}'
    url: '<instance url>/seistore-svc/api/v3'
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
    "https://<DNS>/seistore-svc/api/v3/dataset/tenant/<data-partition-id>/subproject/<subprojectname>/dataset/<datasetname>"
```

**Sample Response:**
Should be a string. We call it gcsstring.


##### Get the SAS url:

Use the following `cURL` command to get a SAS upload URL:

```bash
cURL -X 'GET' \
  'https://<DNS>/seistore-svc/api/v3/utility/upload-connection-string?sdpath=sd://<tenant>/<subprojectname>' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <access_token>'
```

**Sample Response:**
```json
{
  "access_token": "<SAS token>",
  "expires_in": <duration>,
  "token_type": "SASUrl"
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
  'https://<DNS>/seistore-svc/api/v3/utility/ls?sdpath=sd://<tenant>/<subprojectname>' \
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
python sdutil ls sd://<data-partition-id>/<subprojectname>/
```

Upload your seismic file to your Seismic Store. Here's an example with a SEGY-format file called `source.segy`:

```bash
python sdutil cp <local folder>/source.segy sd://<data-partition-id>/<subprojectname>/destination.segy
```
For example:

```bash
python sdutil cp ST10010ZC11_PZ_PSDM_KIRCH_FULL_T.MIG_FIN.POST_STACK.3D.JS-017536.segy sd://<data-partition-id>/<subprojectname>/destination.segy
```

### Create Storage Records

Insert the contents of your `all_records.json` file in storage for work-product, seismic trace data, seismic grid, and file collection. Copy and paste the contents of that file to the data section of the API call.

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

1. Trigger the ZGY Conversion DAG to convert your data using the execution context values you saved in previous step.

    Fetch the ID token from sdutil for the uploaded file or use an access/bearer token.

    ```Markdown
    python sdutil auth idtoken
    ```

    Use the following `cURL` command to trigger workflow:

    ```Bash
        cURL -X POST "https://<DNS>/api/workflow/v1/workflow/<segy-to-zgy-conversion dag id>" \
            -H "Authorization: Bearer <access_token>" \
            -H "Content-Type: application/json" \
            -d '{
                "executionContext": {
                    "data_partition_id": "{{DATA_PARTITION_ID}}",
                    "sd_svc_api_key": "no",
                    "storage_svc_api_key": "no",
                    "filecollection_segy_id": "{{DATA_PARTITION_ID}}:dataset--FileCollection.SEGY:e4a9fc6241610b3a0327f7ace99b9c6f",
                    "work_product_id":"{{DATA_PARTITION_ID}}:work-product--WorkProduct:819c76be31892652773f5dacd642b0e8",
                    "id_token": "{{access_token}}"
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


2. Let the DAG run to the `succeeded` state. You can check the status using the workflow status call. The run ID is in the response of the previous call

    Use the following `cURL` command:

    ```bash
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
3. Use the following `cURL` command to verify file conversion:

    ```bash
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

4. You can see if the converted file is present using the following command in sdutil

    ```bash
    python sdutil ls sd://<data-partition-id>/<subprojectname>
    ```



5. You can download and inspect the file using the [sdutil](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil/-/tags/azure-stable) `cp` command:

    ```bash
    python sdutil cp sd://<data-partition-id>/<subproject>/<filename.zgy> <local/destination/path>
    ```
OSDU&reg; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to convert SEGY to OVDS](./how-to-convert-segy-to-ovds.md)
