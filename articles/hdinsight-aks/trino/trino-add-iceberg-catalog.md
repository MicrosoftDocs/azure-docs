---
title: Configure Iceberg catalog
description: How to configure iceberg catalog in a Trino cluster.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/19/2023
---

# Configure Iceberg catalog

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides an overview of how to configure Iceberg catalog in your Trino cluster with HDInsight on AKS. You can add a new catalog by updating your cluster ARM template except the hive catalog, which you can add during [Trino cluster creation](./trino-create-cluster.md) in the Azure portal.

## Prerequisites

* [Understanding of Trino cluster config](trino-service-configuration.md).
* [Add catalogs to existing cluster](trino-add-catalogs.md).

## Steps to configure Iceberg catalog

1. Update your cluster ARM template to add a new Iceberg catalog config file. This configuration needs to be defined in `serviceConfigsProfiles` under `clusterProfile` property of the ARM template.

    |Property|Value|Description|
    |-|-|-|
    |fileName|iceberg.properties|Name of the catalog file. If the file is called iceberg.properties, then `iceberg` becomes the catalog name.|
    |connector.name|iceberg|The type of the catalog. For Iceberg, catalog type must be `iceberg`|
    |iceberg.register-table-procedure.enabled|true|Required to allow external tables to be registered.|

    Refer to [Trino documentation](https://trino.io/docs/current/connector/iceberg.html#general-configuration) for other iceberg configuration options.

    ```json
    "serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "catalogs",
                "files": [
                            {
                                "fileName": "ice.properties",
                                "values": {
                                    "connector.name": "iceberg",
                                    "iceberg.register-table-procedure.enabled": "true"
                                }
                            }
       ]

    ...
    ```

1. Configure a Hive metastore for table definitions and locations if you don't have a metastore already configured.

    * Configure the Hive metastore for the Iceberg catalog.
        
        The `catalogOptions` section of the ARM template defines the Hive metastore connection details and it sets up
        * Metastore config.
        * Metastore instance.
        * Link from the catalog to the Metastore (`catalogName`).
    
        Add this `catalogOptions` configuration under `trinoProfile` property to your cluster ARM template:
    
        > [!NOTE]
        > If Hive catalog options are already present, duplicate your Hive config and specify the iceberg catalog name.
    
        ```json
         "trinoProfile": {
            "catalogOptions": {
                "hive": [
                    {
                        "catalogName": "ice",
                        "metastoreDbConnectionURL": "jdbc:sqlserver://{{DATABASE_SERVER}}.database.windows.net:1433;database={{DATABASE_NAME}};encrypt=true;trustServerCertificate=true;loginTimeout=30;",
                        "metastoreDbConnectionUserName": "{{DATABASE_USER_NAME}}",
                        "metastoreDbConnectionPasswordSecret": "hms-db-pwd-ref",
                        "metastoreWarehouseDir": "abfss://{{AZURE_STORAGE_CONTAINER}}@{{AZURE_STORAGE_ACCOUNT_NAME}}.dfs.core.windows.net/"
                    }  
                ]
            }
        }
        ```

1. Assign the `Storage Blob Data Owner` role to your cluster user-assigned MSI in the storage account containing the iceberg tables. Learn how to [assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).

   * User-assigned MSI name is listed in the `msiResourceId` property in the cluster's resource JSON.

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal). 
<br>Once successfully deployed, you can see the "ice" catalog in your Trino cluster.
