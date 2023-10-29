---
title: Add external Hive metastore database
description: Connecting to the HIVE metastore for Trino clusters in HDInsight on AKS
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 10/19/2023
---

# Use external Hive metastore database

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Hive metastore is used as a central repository for storing metadata about the data. This article describes how you can add a Hive metastore database to your Trino cluster with HDInsight on AKS. There are two ways:

* You can add a Hive catalog and link it to an external Hive metastore database during [Trino cluster creation](./trino-create-cluster.md).

* You can add a Hive catalog and attach an external Hive metastore database to your cluster using ARM template update.

The following example covers the addition of Hive catalog and metastore database to your cluster using ARM template.

## Prerequisites
* An operational Trino cluster with HDInsight on AKS.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).


> [!NOTE]
>
> * Currently, we support Azure SQL Database as in-built metastore.
> * Due to Hive limitation, "-" (hyphen) character in the metastore database name is not supported.
> * Only single metastore database connection is supported, all catalogs listed in `clusterProfile.trinoProfile.catalogOptions.hive` section will be configured to use one and the same database parameters which are specified first.

## Add external Hive metastore database

**There are few important sections you need to add to your cluster ARM template to configure the Hive catalog and Hive metastore database:**

-	`secretsProfile` – It specifies Azure Key Vault and list of secrets to be used in Trino cluster, required to connect to external Hive metastore.
-	`serviceConfigsProfiles` - It includes configuration for Trino catalogs. For more information, see [Add catalogs to existing cluster](trino-add-catalogs.md).
-	`trinoProfile.catalogOptions.hive` – List of Hive or iceberg or delta catalogs with parameters of external Hive metastore database for each catalog. To use external metastore database, catalog must be present in this list.


| Property| Description| Example|
|---|---|---|
|secretsProfile.keyVaultResourceId|Azure resource ID string to Azure Key Vault where secrets for Hive metastore are stored.|/subscriptions/0000000-0000-0000-0000-000000000000/resourceGroups/trino-rg/providers/Microsoft.KeyVault/vaults/trinoakv|
|secretsProfile.secrets[*].referenceName|Unique reference name of the secret to use later in clusterProfile.|Secret1_ref|
|secretsProfile.secrets[*].type|Type of object in Azure Key Vault, only “secret” is supported.|secret|
|secretsProfile.secrets[*].keyVaultObjectName|Name of secret object in Azure Key Vault containing actual secret value.|secret1|
|trinoProfile.catalogOptions.hive|List of Hive or iceberg or delta catalogs with parameters of external Hive metastore database, require parameters for each. To use external metastore database, catalog must be present in this list.
|trinoProfile.catalogOptions.hive[*].catalogName|Name of Trino catalog configured in `serviceConfigsProfiles`, which configured to use external Hive metastore database.|hive1|
|trinoProfile.catalogOptions.hive[*].metastoreDbConnectionURL|JDBC connection string to database.|jdbc:sqlserver://mysqlserver1.database.windows.net;database=myhmsdb1;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=30|
|trinoProfile.catalogOptions.hive[*].metastoreDbConnectionUserName|SQL user name to connect to database.|trinoadmin|
|trinoProfile.catalogOptions.hive[*].metastoreDbConnectionPasswordSecret|Secret referenceName configured in secretsProfile with password.|hms-db-pwd|
|trinoProfile.catalogOptions.hive[*].metastoreWarehouseDir|ABFS URI to location in storage where data is stored.|`abfs://container1@myadlsgen2account1.dfs.core.windows.net/hive/warehouse`|

To configure external Hive metastore to an existing Trino cluster, add the required sections in your cluster ARM template by referring to the following example:


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
            "type": "microsoft.hdinsight/clusterpools/clusters",
            "apiVersion": "<api-version>",
            "name": "<cluster-pool-name>/<cluster-name>",
            "location": "<region, e.g. westeurope>",
            "tags": {},
            "properties": {
                "clusterType": "Trino",

                "clusterProfile": {
                    "secretsProfile": {
                        "keyVaultResourceId": "/subscriptions/{USER_SUBSCRIPTION_ID}/resourceGroups/{USER_RESOURCE_GROUP}/providers/Microsoft.KeyVault/vaults/{USER_KEYVAULT_NAME}",
                        "secrets": [
                            {
                                "referenceName": "hms-db-pwd",
                                "type": "secret",
                                "keyVaultObjectName": "hms-db-pwd"
                            }                        ]
                    },
                    "serviceConfigsProfiles": [
                        {
                            "serviceName": "trino",
                            "configs": [
                                {
                                    "component": "catalogs",
                                    "files": [
                                        {
                                            "fileName": "hive1.properties",
                                            "values": {
                                                "connector.name": "hive"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "trinoProfile": {
                        "catalogOptions": {
                            "hive": [
                                {
                                    "catalogName": "hive1",
                                    "metastoreDbConnectionURL": "jdbc:sqlserver://mysqlserver1.database.windows.net;database=myhmsdb1;encrypt=true;trustServerCertificate=true;create=false;loginTimeout=30",
                                    "metastoreDbConnectionUserName": "trinoadmin",
                                    "metastoreDbConnectionPasswordSecret": "hms-db-pwd",
                                    "metastoreWarehouseDir": "abfs://container1@myadlsgen2account1.dfs.core.windows.net/hive/warehouse"
                                }
                            ]
                        }
                    }
                }
            }
        }
    ]
}
```

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
Once successfully deployed, you can see the "hive1" catalog in your Trino cluster.

**You can run a few simple queries to try the Hive catalog.**

Check if Hive catalog is created successfully.

```
show catalogs;
```
Query a table (In this example, "hive1" is the name of hive catalog specified).
```
create schema hive1.schema1;
create table hive1.schema1.tpchorders as select * from tpch.tiny.orders;
select * from hive1.schema1.tpchorders limit 100;
```
