---
title: "Tutorial: Use Reservoir DDMS websocket endpoints to work with reservoir data"
titleSuffix: Microsoft Azure Data Manager for Energy
description: "Learn to use OSDU Reservoir DDMS websocket APIs."
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: tutorial  #Don't change.
ms.date: 02/12/2025

#customer intent: As a Data Manager, I want to learn how to use OSDU Reservoir DDMS websocket APIs to read reservoir data.

---
# Tutorial: Use Reservoir DDMS websocket API endpoints

Use Reservoir Domain Data Management Services (DDMS) APIs in PowerShell to work with reservoir data in an Azure Data Manager for Energy resource.

In this tutorial, you learn how to use a Reservoir DDMS websocket endpoint to:

> [!div class="checklist"]
> * Create the data space.
> * Get the data space.
> * Ingest an EPC file.
> * Access the ingested data.
> * Delete the dataspace.


For more information about DDMS, see [DDMS concepts](concepts-ddms.md).

## Prerequisites

* [Azure Data Manager for Energy](quickstart-create-microsoft-energy-data-services-instance.md) resource created in your Azure subscription
* Docker desktop client should be running on your system

## Configuration
1. To connect to a remote server via WSS, you need an ETP SSL enabled client. Download a prebuild SSL client from the OSDU GitLab docker container registry.

    ```bash
    export SSLCLIENT_IMAGE=community.opengroup.org:5555/osdu/platform/domain-data-mgmt-services/reservoir/open-etp-server/open-etp-sslclient-main
    docker pull ${SSLCLIENT_IMAGE}
    docker tag ${SSLCLIENT_IMAGE} open-etp:ssl-client
    ```

1. Follow [How to generate auth token](how-to-generate-auth-token.md) to create a valid auth token. This token is used to authenticate the calls to server.

1. Set the following variables:
    ```bash
    $RDDMS_URL='<adme_dns>/api/reservoir-ddms-etp/v2/'
    $PARTITION='<data_partition_name>'
    $TOKEN='<access_token>'
    ```
    
## Using the websocket endpoints
1. Create the data space:

    ```bash
    docker run -it --rm open-etp:ssl-client openETPServer space -S wss://${RDDMS_URL} --new -s <data_space_name> --data-partition-id ${PARTITION} --auth bearer --jwt-token ${TOKEN}
    ```
1. Get the data space:

    ```bash
    docker run -it --rm open-etp:ssl-client openETPServer space -S wss://${RDDMS_URL} -l --data-partition-id ${PARTITION} --auth bearer --jwt-token ${TOKEN}
    ```
    
1. Ingest an EPC file:
    ```bash
    docker run -it --rm -v <path_to_directory_containing_epc_file>:/data open-etp:ssl-client openETPServer space -S wss://${RDDMS_URL} -s <dataspace_name> --import-epc ./data/<epc_file_name> --data-partition-id ${PARTITION} --auth bearer --jwt-token ${TOKEN}
    ```
    
1. Access the ingested data:
    ```bash
    docker run -it --rm open-etp:ssl-client openETPServer space -S wss://${RDDMS_URL} -s <dataspace_name> --stats --data-partition-id ${PARTITION} --auth bearer --jwt-token ${TOKEN}
    ```
1. Delete the dataspace:
    ```bash
    docker run -it --rm open-etp:ssl-client openETPServer space --delete -S wss://${RDDMS_URL} -s <dataspace_name> --data-partition-id ${PARTITION} --auth bearer --jwt-token ${TOKEN}
    ```

## Related content
* [How to use RDDMS web socket endpoints](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/reservoir/open-etp-server/-/blob/main/docs/testing.md?ref_type=heads)
* [Use Reservoir DDMS APIs](tutorial-reservoir-ddms-apis.md)