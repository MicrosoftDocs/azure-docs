---
title: Configure Delta Lake catalog
description: How to configure Delta Lake catalog in a Trino cluster.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Configure Delta Lake catalog

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides an overview of how to configure Delta Lake catalog in your HDInsight on AKS Trino cluster. You can add a new catalog by updating your cluster ARM template except the hive catalog, which you can add during [Trino cluster creation](./trino-create-cluster.md) in the Azure portal.

## Prerequisites

* [Understanding of Trino cluster configuration](./trino-service-configuration.md).
* [Add catalogs to existing cluster](./trino-add-catalogs.md).

## Steps to configure Delta Lake catalog

1. Update your cluster ARM template to add a new Delta Lake catalog config file. This configuration needs to be defined in `serviceConfigsProfiles` under `clusterProfile` property of the ARM template.

    |Property|Value|Description|
    |-|-|-|
    |fileName|delta.properties|Name of the catalog file. If the file is called delta.properties, `delta` becomes the catalog name.|
    |connector.name|delta-lake|The type of the catalog. For Delta Lake, catalog type must be `delta-lake`|
    |delta.register-table-procedure.enabled|true|Required to allow external tables to be registered.|

    See [Trino documentation](https://trino.io/docs/current/connector/delta-lake.html#general-configuration) for other delta lake configuration options.

    ```json
    "serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "catalogs",
                "files": [
                            {
                                "fileName": "delta.properties",
                                "values": {
                                    "connector.name": "delta-lake",
                                    "delta.register-table-procedure.enabled": "true"
                                }
                            }
       ]

    ...
    ```

1. Configure a Hive metastore for table definitions and locations if you don't have a metastore already configured.

    * Configure the Hive metastore for the Delta catalog.
        
        The `catalogOptions` section of the ARM template defines the Hive metastore connection details and it can set up
        * Metastore config.
        * Metastore instance.
        * Link from the catalog to the metastore (`catalogName`).
    
        Add this `catalogOptions` configuration under `trinoProfile` property to your cluster ARM template:
    
         > [!NOTE]
         > If Hive catalog options are already present, duplicate your Hive config and specify the delta catalog name.
    
         ```json
         "trinoProfile": {
            "catalogOptions": {
                "hive": [
                    {
                        "catalogName": "delta",
                        "metastoreDbConnectionURL": "jdbc:sqlserver://{{DATABASE_SERVER}}.database.windows.net:1433;database={DATABASE_NAME}};encrypt=true;trustServerCertificate=true;loginTimeout=30;",
                        "metastoreDbConnectionUserName": "{{DATABASE_USER_NAME}}",
                        "metastoreDbConnectionPasswordSecret": "hms-db-pwd-ref",
                        "metastoreWarehouseDir": "abfss://{{AZURE_STORAGE_CONTAINER}}@{{AZURE_STORAGE_ACCOUNT_NAME}}.dfs.core.windows.net/"
                    }  
                ]
            }
        } ...
        ```

1. Assign the `Storage Blob Data Owner` role to your cluster user-assigned MSI in the storage account containing the delta tables. Learn how to [assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).

   * User-assigned MSI name is listed in the `msiResourceId` property in the cluster's resource JSON.

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal). 
<br>Once successfully deployed, you can see the "delta" catalog in your Trino cluster.

## Next steps

[Read Delta Lakes tables (Synapse or External Location)](./trino-create-delta-lake-tables-synapse.md)
