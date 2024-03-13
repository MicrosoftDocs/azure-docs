---
title: Configure catalogs in Azure HDInsight on AKS
description: Add catalogs to an existing Trino cluster in HDInsight on AKS
ms.service: hdinsight-aks
ms.custom: devx-track-arm-template
ms.topic: how-to 
ms.date: 10/19/2023
---

# Configure catalogs

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Every Trino cluster comes by default with few catalogs - system, tpcds, `tpch`. You can add your own catalogs same way you would do with OSS Trino. 
In addition, Trino with HDInsight on AKS allows storing secrets in Key Vault so you don’t have to specify them explicitly in ARM template. 

You can add a new catalog by updating your cluster ARM template except the hive catalog, which you can add during [Trino cluster creation](./trino-create-cluster.md) in the Azure portal.

This article demonstrates how you can add a new catalog to your cluster using ARM template. The example in this article describes the steps for adding SQL server and Memory catalogs.

## Prerequisites

* An operational Trino cluster with HDInsight on AKS.
* Azure SQL database.
* Azure SQL server login/password are stored in the Key Vault secrets and user-assigned MSI attached to your Trino cluster granted permissions to read them. Refer [store credentials in Key Vault and assign role to MSI](../prerequisites-resources.md#create-azure-key-vault).
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).
* Review complete cluster ARM template example [arm-trino-catalog-sample.json](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-catalog-sample.json).

## Steps to add catalog in ARM template

1. Attach Key Vault and add secrets to `secretsProfile` under `clusterProfile` property.
  
   In this step, you need to make sure Key Vault and secrets are configured for Trino cluster.
   In the following example, SQL server credentials are stored in these secrets: trinotest-admin-user, trinotest-admin-pwd.

    ```json
    "secretsProfile": {
        "keyVaultResourceId": "/subscriptions/{USER_SUBSCRIPTION_ID}/resourceGroups/{USER_RESOURCE_GROUP}/providers/Microsoft.KeyVault/vaults/{USER_KEYVAULT_NAME}",
        "secrets": [
            {
                "referenceName": "trinotest-admin-user",
                "keyVaultObjectName": "trinotest-admin-user",
                "type": "secret"
            },
            {
                "referenceName": "trinotest-admin-pwd",
                "keyVaultObjectName": "trinotest-admin-pwd",
                "type": "secret"
            }
        ]
    },
    ```

5. Add catalogs to `serviceConfigsProfiles` under `clusterProfile` property.
  
   In this step, you need to add Trino specific catalog configuration to the cluster.
   The following example configures two catalogs using Memory and SQL server connectors. Catalog configuration may be specified in two different ways:
   
     * Key-value pairs in values section.
     * Single string in content property.
   
   Memory catalog is defined using key-value pair and SQL server catalog is defined using single string option. 
       
   ```json
    "serviceConfigsProfiles": [
        {
            "serviceName": "trino",
            "configs": [
                {
                    "component": "catalogs",
                    "files": [
                            {
                            "fileName": "memory.properties",
                            "values": {
                                "connector.name": "memory",
                                "memory.max-data-per-node": "128MB"
                            }
                        },
                        {
                            "fileName": "trinotestdb1.properties",
                            "content":"connector.name=sqlserver\nconnection-url=jdbc:sqlserver://mysqlserver1.database.windows.net:1433;database=db1;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;\nconnection-user=${SECRET_REF:trinotest-admin-user}\nconnection-password=${SECRET_REF:trinotest-admin-pwd}\n"
                        },
                    ]
                }
            ]
        }
    ],
   ```

   **Properties**

   |Property|Description|
   |---|---|
   |serviceName|trino|
   |component|Identifies that section configures catalogs, must be “catalogs."|
   |files|List of Trino catalog files to be added to the cluster.|
   |filename|List of Trino catalog files to be added to the cluster.|
   |content|`json` escaped string to put into trino catalog file. This string should contain all trino-specific catalog properties, which depend on type of connector used. For more information, see OSS trino documentation.|
   |${SECRET_REF:\<referenceName\>}|Special tag to reference a secret from secretsProfile. Trino at runtime fetch the secret from Key Vault and substitute it in catalog configuration.|
   |values|It’s possible to specify catalog configuration using content property as single string, and using separate key-value pairs for each individual Trino catalog property as shown for memory catalog.|

 Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).
