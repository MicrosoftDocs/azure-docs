---
title: Deploy Geospatial Consumption Zone on top of Azure Data Manager for Energy using Azure portal
description: Learn how to deploy Geospatial Consumption Zone on top of your Azure Data Manager for Energy instance using the Azure portal.
ms.service: energy-data-services
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.author: eihaugho
author: EirikHaughom
ms.date: 05/30/2024
---

## Deploy Geospatial Consumption Zone (GCZ) on a Windows Virtual Machine

Learn how to deploy Geospatial Consumption Zone (GCZ) on Windows. This deployment option is recommended for development and testing environments, as it's easier to set up and configure, and requires less maintenance.

### Prerequisites

- An Azure Data Manager for Energy instance. If you don't have an Azure Data Manager for Energy instance, see [Create an Azure Data Manager for Energy instance](../../../quickstart-create-microsoft-energy-data-services-instance.md).
- A Windows Virtual Machine. If you don't have a Windows Virtual Machine, see [Create a Windows Virtual Machine in Azure](/azure/virtual-machines/windows/quick-create-portal). It's also possible to use your local machine.
- Java JDK 17 installed on the Windows Virtual Machine. If you don't have Java installed, see [Install Java on Windows](https://adoptium.net/temurin/releases/?version=17).
- Node 18.19.1 (LTS) installed on the Windows Virtual Machine. If you don't have Node installed, see [Install Node.js and npm on Windows](https://nodejs.org/en/blog/release/v18.19.1).
- Python 3.11.4 or newer installed on the Windows Virtual Machine. If you don't have Python installed, see [Install Python on Windows](https://www.python.org/downloads/).
    - Ensure you add `pip` during the installation process. If you forget to add `pip`, you can [install it manually](https://pip.pypa.io/en/stable/installation/).

### Deploy GCZ on Windows

1. Connect to your Windows Virtual Machine.
1. Download the following files from the OSDU GitLab repository:
    1. [GCZ Provider](https://community.opengroup.org/api/v4/projects/528/jobs/artifacts/master/download?job=build-provider)
    1. [GCZ Transformer](https://community.opengroup.org/api/v4/projects/528/jobs/artifacts/master/download?job=build-transformer)
    1. [Python dependencies](https://community.opengroup.org/api/v4/projects/528/jobs/artifacts/master/download?job=build-python-dependencies)
1. Open PowerShell as an administrator and navigate to the folder where you downloaded the files.
1. Run the following commands to extract the files:

    ```powershell
    Expand-Archive -Path .\GCZ_PROVIDER.zip -DestinationPath C:\gcz\
    Expand-Archive -Path .\GCZ_TRANSFORMER.zip -DestinationPath C:\gcz\
    Expand-Archive -Path .\GCZ_PYTHON_DEPENDENCIES.zip -DestinationPath C:\gcz\
    ```

1. Configure the environment variables:

    ```powershell
    $ADME_HOSTNAME = "<adme-hostname>" # ADME Hostname, e.g. "https://contoso.energy.azure.com"
    $GCZ_DATA_PARTITION_ID = "<data-partition-id>" # ADME Data Partition ID, e.g. "opendes"
    $GCZ_QUERY_URL = "$ADME_HOSTNAME/api/search/v2/query" # ADME Query Endpoint
    $GCZ_QUERY_CURSOR_URL = "$ADME_HOSTNAME/api/search/v2/query_with_cursor" # ADME Query with Cursor Endpoint
    $GCZ_SCHEMA_URL = "$ADME_HOSTNAME/api/schema-service/v1/schema" # ADME Schema Endpoint
    $GCZ_ENTITLEMENT_SERVICE_URL = "$ADME_HOSTNAME/api/entitlements/v2" # ADME Entitlement Service Endpoint
    $GCZ_FILE_RETRIEVAL_URL = "$ADME_HOSTNAME/api/dataset/v1/retrievalInstructions" # ADME File Retrieval Endpoint
    $GCZ_CONVERT_TRAJECTORY_URL = "$ADME_HOSTNAME/api/crs/converter/v3/convertTrajectory" # ADME Convert Trajectory Endpoint
    $GCZ_STORAGE_URL = "$ADME_HOSTNAME/api/storage/v2/records/" # ADME Storage Endpoint
    ```

    For more environment variables, see the [OSDU GitLab documentation](https://community.opengroup.org/osdu/platform/consumption/geospatial/-/blob/master/docs/deployment/environment_variables.md).

1. Validate the configuration files for the GCZ Provider and Transformer by opening the configuration files in a text editor and updating the values if needed.
    - Provider: `C:\gcz\gcz-provider\gcz-provider-core\config\koop-config.json`
    - Transformer: `C:\gcz\gcz-transformer-core\config\application.yml`

    > [!IMPORTANT]
    > If you make changes to the schemas in the configuration files, you have to make sure that those schemas are represented in both of the configuration files.

1. (optional) Install Python Dependencies (only required for Well Log Interpolation).

    ```powershell
    pip install -r C:\gcz\gcz-transformer-core\src\main\resources\script\requirements.txt --no-index --find-links python-dependencies
    ```

1. Start the GCZ Transformer.

    ```powershell
    C:\gcz\transformer\transformer.bat local
    ```

1. Build the GCZ Provider.

    ```powershell
    cd C:\gcz\gcz-provider\gcz-provider-core
    npm install
    npm start
    ```

By default the Provider is listening on `http://localhost:8083` and the Transformer is listening on `http://localhost:8080`.