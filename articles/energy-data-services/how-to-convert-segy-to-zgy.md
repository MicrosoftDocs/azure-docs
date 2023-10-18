---
title: Microsoft Azure Data Manager for Energy - How to convert segy to zgy file
description: This article describes how to convert a SEG-Y file to a ZGY file
author: marielgherz
ms.author: marielherzog
ms.service: energy-data-services
ms.topic: how-to
ms.date: 08/18/2022
ms.custom: template-how-to
---

# How to convert a SEG-Y file to ZGY

In this article, you will learn how to convert SEG-Y formatted data to the ZGY format. Seismic data stored in industry standard SEG-Y format can be converted to ZGY for use in applications such as Petrel via the Seismic DMS. See here for [ZGY Conversion FAQ's](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion#faq) and more background can be found in the OSDU&trade; community here: [SEG-Y to ZGY conversation](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion)


## Prerequisites

1. Download and install [Postman](https://www.postman.com/) desktop app.
2. Import the [oZGY Conversions.postman_collection](https://github.com/microsoft/meds-samples/blob/main/postman/SegyToZgyConversion%20Workflow%20using%20SeisStore%20R3%20CI-CD%20v1.0.postman_collection.json) into Postman. All curl commands used below are added to this collection. Update your Environment file accordingly
3. Ensure that your Azure Data Manager for Energy instance is created already
4. Clone the **sdutil** repo as shown below:
  ```markdown
  git clone https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil.git

  git checkout azure/stable
  ```
5. The [jq command](https://stedolan.github.io/jq/download/), using your favorite tool on your favorite OS.
  
## Convert SEG-Y file to ZGY file

1. The user needs to be part of the `users.datalake.admins` group and user needs to generate a valid refresh token. See [How to generate a refresh token](how-to-generate-refresh-token.md) for further instructions. If you continue to follow other "how-to" documentation, you'll use this refresh token again. Once you've generated the token, store it in a place where you'll be able to access it in the future. If it isn't present, add the group for the member ID. In this case, use the app ID you have been using for everything as the `user-email`. Additionally, the `data-partition-id` should be in the format `<instance-name>-<data-partition-name>` in both the header and the url, and will be for any following command that requires `data-partition-id`.

    ```bash
    curl --location --request POST "<url>/api/entitlements/v2/groups/users.datalake.admins@<data-partition>.<domain>.com/members" \
         --header 'Content-Type: application/json' \
         --header 'data-partition-id: <data-partition>' \
         --header 'Authorization: Bearer {{TOKEN}}' \
         --data-raw '{
                        "email" : "<user-email>",
                        "role" : "MEMBER"
                    }
    ```

    You can also add the user to this group by using the entitlements API and assigning the required group ID. In order to check the entitlements groups for a user, perform the command [Get entitlements groups for a given user](how-to-manage-users.md#get-entitlements-groups-for-a-given-user). In order to get all the groups available, do the following command:

    ```bash
    curl --location --request GET "<url>/api/entitlements/v2/groups/" \
         --header 'data-partition-id: <data-partition>' \
         --header 'Authorization: Bearer {{TOKEN}}'
    ```

2. Check if ZGY is registered with the workflow service or not:

    ```bash
    curl --location --request GET '<url>/api/workflow/v1/workflow/' \
        --header 'Data-Partition-Id: <data-partition>' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer {{TOKEN}}'
    ```

    You should see ZGY converter DAG in the list. IF NOT in the response list then REPORT the issue to Azure Team

3. Register Data partition to Seismic:

    ```bash
    curl --location --request POST '<url>/seistore-svc/api/v3/tenant/<data-partition>' \
    --header 'Authorization: Bearer {{TOKEN}}' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "esd": "{{data-partition}}.{{domain}}.com",
        "gcpid": "{{data-partition}}",
        "default_acl": "users.datalake.admins@{{data-partition}}.{{domain}}.com"}'
    ```

4. Create Legal tag

    ```bash
    curl --location --request POST '<url>/api/legal/v1/legaltags' \
    --header 'Content-Type: application/json' \
    --header 'data-partition-id: <data-partition>' \
    --header 'Authorization: Bearer {{TOKEN}}' \
    --data-raw '{
        "name": "<tag-name>",
        "description": "Legal Tag added for Seismic",
        "properties": {
            "contractId": "123456",
            "countryOfOrigin": [
                "US",
                "CA"
            ],
            "dataType": "Public Domain Data",
            "exportClassification": "EAR99",
            "originator": "Schlumberger",
            "personalData": "No Personal Data",
            "securityClassification": "Private",
            "expirationDate": "2025-12-25"
        }
    }'
    ```

5. Create Subproject. Use your previously created entitlements groups that you would like to add as ACLs (Access Control List) admins and viewers. If you haven't yet created entitlements groups, follow the directions as outlined in [How to manage users](how-to-manage-users.md). If you would like to see what groups you have, use [Get entitlements groups for a given user](how-to-manage-users.md#get-entitlements-groups-for-a-given-user). Data access isolation is achieved with this dedicated ACL (access control list) per object within a given data partition. You may have many subprojects within a data partition, so this command allows you to provide access to a specific subproject without providing access to an entire data partition. Data partition entitlements don't necessarily translate to the subprojects within it, so it's important to be explicit about the ACLs for each subproject, regardless of what data partition it is in.

    Later in this tutorial, you'll need at least one `owner` and at least one `viewer`. These user groups will look like `data.default.owners` and `data.default.viewers`. Make sure to include one of each in your list of `acls` in the request below.

    ```bash
    curl --location --request POST '<url>/seistore-svc/api/v3/subproject/tenant/<data-partition>/subproject/<subproject>' \
    --header 'Authorization: Bearer {{TOKEN}}' \
    --header 'Content-Type: text/plain' \
    --data-raw '{
    "admin": "test@email",
    "storage_class": "MULTI_REGIONAL",
    "storage_location": "US",
    "acls": {
        "admins": [
        "<user-group>@<data-partition>.<domain>.com",
        "<user-group>@<data-partition>.<domain>.com"
        ],
        "owners": [
        "<user-group>@<data-partition>.<domain>.com"
        ],
        "viewers": [
        "<user-group>@<data-partition>.<domain>.com"
        ]
    }
    }'
    ```

    The following request is an example of the create subproject request:

    ```bash
    curl --location --request POST 'https://<instance>.energy.azure.com/seistore-svc/api/v3/subproject/tenant/<instance>-<data-partition-name>/subproject/subproject1' \
    --header 'Authorization: Bearer eyJ...' \
    --header 'Content-Type: text/plain' \
    --data-raw '{
        "admin": "test@email",
        "storage_class": "MULTI_REGIONAL",
        "storage_location": "US",
        "acls": {
            "admins": [
            "service.seistore.p4d.tenant01.subproject01.admin@slb.p4d.cloud.slb-ds.com",
            "service.seistore.p4d.tenant01.subproject01.editor@slb.p4d.cloud.slb-ds.com"
            ],
            "owners": [
            "data.default.owners@slb.p4d.cloud.slb-ds.com"
            ],
            "viewers": [
            "service.seistore.p4d.tenant01.subproject01.viewer@slb.p4d.cloud.slb-ds.com"
            ]
        }
    }'
    ```

6. Patch Subproject with the legal tag you created above. Recall that the format of the legal tag will be prefixed with the Azure Data Manager for Energy instance name and data partition name, so it looks like `<instancename>`-`<datapartitionname>`-`<legaltagname>`.

    ```bash
    curl --location --request PATCH '<url>/seistore-svc/api/v3/subproject/tenant/<data-partition>/subproject/<subproject-name>' \
        --header 'ltag: <Tag-name-above>' \
        --header 'recursive: true' \
        --header 'Authorization: Bearer {{TOKEN}}' \
        --header 'Content-Type: text/plain' \
        --data-raw '{
        "admin": "test@email",
        "storage_class": "MULTI_REGIONAL",
        "storage_location": "US",
        "acls": {
            "admins": [
            "<user-group>@<data-partition>.<domain>.com",
            "<user-group>@<data-partition>.<domain>.com"
            ],
            "viewers": [
            "<user-group>@<data-partition>.<domain>.com"
            ]
        }
    }'
    ```

7. Open the [sdutil](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil) codebase and edit the `config.yaml` at the root. Replace the contents of this config file with the following yaml. See [How to generate a refresh token](how-to-generate-refresh-token.md) to generate the required refresh token. Once you've generated the token, store it in a place where you'll be able to access it in the future.

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

8. Run the following commands using **sdutil** to see its working fine.  Follow the directions in [Setup and Usage for Azure env](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil#setup-and-usage-for-azure-env). Understand that depending on your OS and Python version, you may have to run `python3` command as opposed to `python`. If you run into errors with these commands, refer to the [SDUTIL tutorial](./tutorial-seismic-ddms-sdutil.md). See [How to generate a refresh token](how-to-generate-refresh-token.md). Once you've generated the token, store it in a place where you'll be able to access it in the future.

    > [!NOTE]
    > when running `python sdutil config init`, you don't need to enter anything when prompted with `Insert the azure (azureGlabEnv) application key:`.

    ```bash
    python sdutil config init
    python sdutil auth login
    python sdutil ls sd://<data-partition>/<subproject>/
    ```

9. Upload your seismic file to your Seismic Store. Here's an example with a SEGY-format file called `source.segy`:

    ```bash
    python sdutil cp source.segy sd://<data-partition>/<subproject>/destination.segy
    ```

    If you would like to use a test file we supply instead, download [this file](https://community.opengroup.org/osdu/platform/testing/-/tree/master/Postman%20Collection/40_CICD_OpenVDS) to your local machine then run the following command:


    ```bash
    python sdutil cp ST10010ZC11_PZ_PSDM_KIRCH_FULL_T.MIG_FIN.POST_STACK.3D.JS-017536.segy sd://<data-partition>/<subproject>/destination.segy
    ```

    The sample records were meant to be similar to real-world data so a significant part of their content isn't directly related to conversion. This file is large and will take up about 1 GB of space.

10. Create the manifest file (otherwise known as the records file)

    ZGY conversion uses a manifest file that you'll upload to your storage account in order to run the conversion. This manifest file is created by using multiple JSON files and running a script. The JSON files for this process are stored [here](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion/-/tree/master/doc/sample-records/volve). For more information on Volve, such as where the dataset definitions come from, visit [their website](https://www.equinor.com/energy/volve-data-sharing). Complete the following steps in order to create the manifest file:

    * Clone the [repo](https://community.opengroup.org/osdu/platform/data-flow/ingestion/segy-to-zgy-conversion/-/tree/master/) and navigate to the folder doc/sample-records/volve
    * Edit the values in the `prepare-records.sh` bash script. Recall that the format of the legal tag will be prefixed with the Azure Data Manager for Energy instance name and data partition name, so it looks like `<instancename>`-`<datapartitionname>`-`<legaltagname>`.

      * `DATA_PARTITION_ID=<your-partition-id>`
      * `ACL_OWNER=data.default.owners@<your-partition-id>.<your-tenant>.com`
      * `ACL_VIEWER=data.default.viewers@<your-partition-id>.<your-tenant>.com`
      * `LEGAL_TAG=<legal-tag-created-above>`

    * Run the `prepare-records.sh` script.
    * The output will be a JSON array with all objects and will be saved in the `all_records.json` file.
    * Save the `filecollection_segy_id` and the `work_product_id` values in that JSON file to use in the conversion step. That way the converter knows where to look for this contents of your `all_records.json`.

11. Insert the contents of your `all_records.json` file in storage for work-product, seismic trace data, seismic grid, and file collection. In other words, copy and paste the contents of that file to the `--data-raw` field in the following command. If the above steps have produced two sets, you can run this command twice, using each set once.

    ```bash
        curl --location --request PUT '<url>/api/storage/v2/records' \
        --header 'Content-Type: application/json' \
        --header 'data-partition-id: <data-partition>' \
        --header 'Authorization: Bearer {{TOKEN}}' \
        --data-raw '[
            {
            ...
            "kind": "osdu:wks:work-product--WorkProduct:1.0.0",
            ...
            },
            {
            ...
            "kind": "osdu:wks:work-product-component--SeismicTraceData:1.0.0"
            ...
            },
            {
            ...
            "kind": "osdu:wks:work-product-component--SeismicBinGrid:1.0.0",
            ...
            },
            {
            ...
            "kind": "osdu:wks:dataset--FileCollection.SEGY:1.0.0",
            ...
            }
        ]
        '
    ```

12. Trigger the ZGY Conversion DAG to convert your data using the values you had saved above. Your call will look like this:

    ```bash
    curl --location --request POST '<url>/api/workflow/v1/workflow/<dag-name>/workflowRun' \
        --header 'data-partition-id: <data-partition>' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer {{TOKEN}}' \
        --data-raw '{
            "executionContext": {
            "data_partition_id": <data-partition>,
            "sd_svc_api_key": "test-sd-svc",
            "storage_svc_api_key": "test-storage-svc",
            "filecollection_segy_id": "<data-partition>:dataset--FileCollection.SEGY:<guid>",
            "work_product_id": "<data-partition>:work-product--WorkProduct:<guid>"
        }
        }'
    ```

13. Let the DAG run to the `succeeded` state. You can check the status using the workflow status call. You'll get run ID in the response of the above call

    ```bash
    curl --location --request GET '<url>/api/workflow/v1/workflow/<dag-name>/workflowRun/<run-id>' \
    --header 'Data-Partition-Id: <data-partition>' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer {{TOKEN}}'
    ```

14. You can see if the converted file is present using the following command:

    ```bash
    python sdutil ls sd://<data-partition>/<subproject>
    ```

15. You can download and inspect the file using the [sdutil](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/seismic/seismic-dms-suite/seismic-store-sdutil) `cp` command:

    ```bash
    python sdutil cp sd://<data-partition>/<subproject>/<filename.zgy> <local/destination/path>
    ```
OSDU&trade; is a trademark of The Open Group.

## Next steps
<!-- Add a context sentence for the following links -->
> [!div class="nextstepaction"]
> [How to convert segy to ovds](./how-to-convert-segy-to-ovds.md)
