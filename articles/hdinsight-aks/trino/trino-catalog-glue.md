---
title: Query data from AWS S3 and with AWS Glue
description: How to configure Trino catalogs for HDInsight on AKS with AWS Glue as metastore
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 10/19/2023
---


# Query data from AWS S3 using AWS Glue

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article provides examples of how you can add catalogs to a Trino cluster with HDInsight on AKS where catalogs are using AWS Glue as metastore and AWS S3 as storage.

## Prerequisites

* [Understanding of Trino cluster configurations for HDInsight on AKS](./trino-service-configuration.md).
* [How to add catalogs to an existing cluster](./trino-add-catalogs.md).
* [AWS account with Glue and S3](./trino-catalog-glue.md#quickstart-with-aws-glue-and-s3).

## Trino catalogs with AWS S3 and AWS Glue as metastore
Several Trino connectors support AWS Glue. More details on catalogs Glue configuration properties can be found in [Trino documentation](https://trino.io/docs/410/connector/hive.html#aws-glue-catalog-configuration-properties).

Refer to [Quickstart with AWS Glue and S3](./trino-catalog-glue.md#quickstart-with-aws-glue-and-s3) for setting up AWS resources.


> [!NOTE]
>
> Securely store Glue and S3 access keys in Azure Key Vault, and [configure secretsProfile](./trino-add-catalogs.md) to use secrets in catalogs instead of specifying them in open text in ARM template.


### Add Hive catalog

You can add the following sample JSON in your Trino cluster under `clusterProfile` section in the ARM template. 
<br>Update the values as per your requirement.

```json
"serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "catalogs",
                "files": [
                    {
                        "fileName": "hiveglue.properties",
                        "values": {
                            "connector.name": "hive",
                            "hive.metastore": "glue",
                            "hive.metastore.glue.region": "us-west-2",
                            "hive.metastore.glue.endpoint-url": "glue.us-west-2.amazonaws.com",
                            "hive.metastore.glue.aws-access-key": "${SECRET_REF:aws-user-access-key-ref}",
                            "hive.metastore.glue.aws-secret-key": "{SECRET_REF:aws-user-access-secret-ref}",
                            "hive.metastore.glue.catalogid": "<AWS account ID>",
                            "hive.s3.aws-access-key": "{SECRET_REF:aws-user-access-key-ref}",
                            "hive.s3.aws-secret-key": "{SECRET_REF:aws-user-access-secret-ref}"
                            "hive.temporary-staging-directory-enabled": "false"
                        }
                    }
                ]
            }
        ]
    }
]
```

### Add Delta Lake catalog

You can add the following sample JSON in your Trino cluster under `clusterProfile` section in the ARM template. 
<br>Update the values as per your requirement.

```json
"serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "catalogs",
                "files": [
                    {
                        "fileName": "deltaglue.properties",
                        "values": {
                            "connector.name": "delta_lake",
                            "hive.metastore": "glue",
                            "hive.metastore.glue.region": "us-west-2",
                            "hive.metastore.glue.endpoint-url": "glue.us-west-2.amazonaws.com",
                            "hive.metastore.glue.aws-access-key": "${SECRET_REF:aws-user-access-key-ref}",
                            "hive.metastore.glue.aws-secret-key": "{SECRET_REF:aws-user-access-secret-ref}",
                            "hive.metastore.glue.catalogid": "<AWS account ID>",
                            "hive.s3.aws-access-key": "{SECRET_REF:aws-user-access-key-ref}",
                            "hive.s3.aws-secret-key": "{SECRET_REF:aws-user-access-secret-ref}"
                        }
                    }
                ]
            }
        ]
    }
]
```

### Add Iceberg catalog
You can add the following sample JSON in your Trino cluster under `clusterProfile` section in the ARM template. 
<br>Update the values as per your requirement.

```json
"serviceConfigsProfiles": [
    {
        "serviceName": "trino",
        "configs": [
            {
                "component": "catalogs",
                "files": [
                    {
                        "fileName": "iceglue.properties",
                        "values": {
                            "connector.name": "iceberg",
                            "iceberg.catalog.type": "glue",
                            "hive.metastore.glue.region": "us-west-2",
                            "hive.metastore.glue.endpoint-url": "glue.us-west-2.amazonaws.com",
                            "hive.metastore.glue.aws-access-key": "${SECRET_REF:aws-user-access-key-ref}",
                            "hive.metastore.glue.aws-secret-key": "{SECRET_REF:aws-user-access-secret-ref}",
                            "hive.metastore.glue.catalogid": "<AWS account ID>",
                            "hive.s3.aws-access-key": "{SECRET_REF:aws-user-access-key-ref}",
                            "hive.s3.aws-secret-key": "{SECRET_REF:aws-user-access-secret-ref}"
                        }
                    }
                ]
            }
        ]
    }
]
```

### AWS access keys from Azure Key Vault
Catalog examples in the previous code  refer to access keys stored as secrets in Azure Key Vault, here's how you can configure that.
```json
"secretsProfile": {
    "keyVaultResourceId": "/subscriptions/1234abcd-aaaa-0000-zzzz-000000000000/resourceGroups/trino-rp/providers/Microsoft.KeyVault/vaults/trinoakv",
    "secrets": [
        {
            "referenceName": "aws-user-access-key-ref",
            "keyVaultObjectName": "aws-user-access-key",
            "type": "secret"
        },
        {
            "referenceName": "aws-user-access-secret-ref",
            "keyVaultObjectName": "aws-user-access-secret",
            "type": "secret"
        }
    ]
},
```

<br>Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).

## Quickstart with AWS Glue and S3
### 1. Create AWS user and save access keys to Azure Key Vault.
Use existing or create new user in AWS IAM - this user is used by Trino connector to read data from Glue/S3. Create and retrieve access keys on Security Credentials tab and save them as secrets into [Azure Key Vault](/azure/key-vault/secrets/about-secrets) linked to your Trino cluster. Refer to [Add catalogs to existing cluster](./trino-add-catalogs.md) for details on how to link Key Vault to your Trino cluster.

### 2. Create AWS S3 bucket
Use existing or create new S3 bucket, it's used in Glue database as location to store data.

### 3. Setup AWS Glue Database
In AWS Glue, create new database, for example, "trinodb" and configure location, which points to your S3 bucket from previous step, for example, `s3://trinoglues3/`

### 4. Configure Trino catalog
Configure a Trino catalog using examples above [Trino catalogs with S3 and Glue as metastore](./trino-catalog-glue.md#trino-catalogs-with-aws-s3-and-aws-glue-as-metastore).

### 5. Create and query sample table
Here are few sample queries to test connectivity to AWS reading and writing data. Schema name is AWS Glue database name you created earlier.
```
create table iceglue.trinodb.tpch_orders_ice as select * from tpch.sf1.orders;
select * from iceglue.trinodb.tpch_orders_ice;
```
