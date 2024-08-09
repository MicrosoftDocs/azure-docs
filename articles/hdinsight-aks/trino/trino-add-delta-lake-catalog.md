---
title: Configure Delta Lake catalog
description: How to configure Delta Lake catalog in a Trino cluster.
ms.service: azure-hdinsight-aks
ms.topic: how-to
ms.date: 06/19/2024
---

# Configure Delta Lake catalog

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides an overview of how to configure Delta Lake catalog in your Trino cluster with HDInsight on AKS. You can add a new catalog by updating your cluster ARM template except the hive catalog, which you can add during [Trino cluster creation](./trino-create-cluster.md) in the Azure portal.

## Prerequisites

* [Understanding of Trino cluster configuration](./trino-service-configuration.md).
* [Add catalogs to existing cluster](./trino-add-catalogs.md).

## Steps to configure Delta Lake catalog

1. [Configure the Hive metastore](./trino-connect-to-metastore.md) for table definitions and locations if you don't have a metastore already configured.
           
    Configure external Hive metastore database and default storage directory in `config.properties` file (more information on [Trino configuration](./trino-service-configuration.md#cluster-management)):
    ```json
    "serviceConfigsProfiles": [
        {
            "serviceName": "trino",
            "configs": [
                {
                    "component": "common",
                    "files": [
                        {
                            "fileName": "config.properties",
                            "values": {
                                "hive.metastore.hdi.metastoreDbConnectionURL": "jdbc:sqlserver://{{DATABASE_SERVER}}.database.windows.net;database={{DATABASE_NAME}};encrypt=true;trustServerCertificate=true;create=false;loginTimeout=30",
                                "hive.metastore.hdi.metastoreDbConnectionUserName": "{{DATABASE_USER_NAME}}",
                                "hive.metastore.hdi.metastoreDbConnectionPasswordSecret": "{{SECRET_REFERENCE_NAME}}",
                                "hive.metastore.hdi.metastoreWarehouseDir": "abfs://{{AZURE_STORAGE_CONTAINER}}@{{AZURE_STORAGE_ACCOUNT_NAME}}.dfs.core.windows.net/hive/warehouse"
                            }
                        }
                    ]
                }
            ]
        }
    ]
    "secretsProfile": {
            "keyVaultResourceId": "/subscriptions/{USER_SUBSCRIPTION_ID}/resourceGroups/{USER_RESOURCE_GROUP}/providers/Microsoft.KeyVault/vaults/{USER_KEYVAULT_NAME}",
            "secrets": [
                {
                    "referenceName": "{{SECRET_REFERENCE_NAME}}",
                    "type": "Secret",
                    "keyVaultObjectName": "myCredSecret"
                }                        ]
        },
    ```

     
    > [!NOTE]
    > `referenceName` should match value provided in `hive.metastore.hdi.metastoreDbConnectionPasswordSecret`

1. Update your cluster ARM template to add a new Delta Lake catalog config file. This configuration needs to be defined in `serviceConfigsProfiles` under `clusterProfile` property of the ARM template.

    |Property|Value|Description|
    |-|-|-|
    |fileName|delta.properties|Name of the catalog file. If the file is called delta.properties, `delta` becomes the catalog name.|
    |connector.name|delta_lake|The type of the catalog. For Delta Lake, catalog type must be `delta_lake`|
    |hive.metastore|hdi|Type of hive metastore to use for this catalog. Type `hdi`, it instructs cluster to use in-cluster Hive Metastore service, configured above.|
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
                                    "connector.name": "delta_lake",
                                    "hive.metastore": "hdi",
                                    "delta.register-table-procedure.enabled": "true"
                                }
                            }
       ]

    ...
    ```

1. Assign the `Storage Blob Data Owner` role to your cluster user-assigned MSI in the storage account containing the delta tables. Learn how to [assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).

   * User-assigned MSI name is listed in the `msiResourceId` property in the cluster's resource JSON.

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal). 
<br>Once successfully deployed, you can see the "delta" catalog in your Trino cluster.

## Next steps

[Read Delta Lakes tables (Synapse or External Location)](./trino-create-delta-lake-tables-synapse.md)
