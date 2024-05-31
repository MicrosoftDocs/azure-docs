---
title: Use a service principal with Spark
titleSuffix: Azure Cosmos DB for NoSQL
description: Learn how to use a Microsoft Entra service principal to authenticate to Azure Cosmos DB for NoSQL from Spark.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 04/01/2024
zone_pivot_groups: programming-languages-spark-all-minus-sql-r-csharp
#CustomerIntent: As a data scientist, I want to connect to Azure Cosmos DB for NoSQL by using Spark and a service principal so that I can avoid using connection strings.
---

# Use a service principal with the Spark 3 connector for Azure Cosmos DB for NoSQL

In this article, you learn how to create a Microsoft Entra application and service principal that can be used with role-based access control. You can then use this service principal to connect to an Azure Cosmos DB for NoSQL account from Spark 3.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- An existing Azure Databricks workspace.
- Registered Microsoft Entra application and service principal.
  - If you don't have a service principal and application, [register an application by using the Azure portal](/entra/identity-platform/howto-create-service-principal-portal).

## Create a secret and record credentials

In this section, you create a client secret and record the value for use later.

1. Open the [Azure portal](<https://portal.azure.com>).

1. Go to your existing Microsoft Entra application.

1. Go to the **Certificates & secrets** page. Then, create a new secret. Save the **Client Secret** value to use later in this article.

1. Go to the **Overview** page. Locate and record the values for **Application (client) ID**, **Object ID**, and **Directory (tenant) ID**. You also use these values later in this article.

1. Go to your existing Azure Cosmos DB for NoSQL account.

1. Record the **URI** value on the **Overview** page. Also record the **Subscription ID** and **Resource Group** values. You use these values later in this article.

## Create a definition and an assignment

In this section, you create a Microsoft Entra ID role definition. Then you assign that role with permissions to read and write items in the containers.

1. Create a role by using the `az role definition create` command. Pass in the Azure Cosmos DB for NoSQL account name and resource group, followed by a body of JSON that defines the custom role. The role is also scoped to the account level by using `/`. Ensure that you provide a unique name for your role by using the `RoleName` property of the request body.

    ```azurecli
    az cosmosdb sql role definition create \
        --resource-group "<resource-group-name>" \
        --account-name "<account-name>" \
        --body '{
            "RoleName": "<role-definition-name>",
            "Type": "CustomRole",
            "AssignableScopes": ["/"],
            "Permissions": [{
                "DataActions": [
                    "Microsoft.DocumentDB/databaseAccounts/readMetadata",
                    "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
                    "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
                ]
            }]
        }'
    ```

1. List the role definition you created to fetch its unique identifier in the JSON output. Record the `id` value of the JSON output.

    ```azurecli
    az cosmosdb sql role definition list \
        --resource-group "<resource-group-name>" \
        --account-name "<account-name>"
    ```

    ```json
    [
      {
        ...,
        "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-grou-name>/providers/Microsoft.DocumentDB/databaseAccounts/<account-name>/sqlRoleDefinitions/<role-definition-id>",
        ...
        "permissions": [
          {
            "dataActions": [
              "Microsoft.DocumentDB/databaseAccounts/readMetadata",
              "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
              "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
            ],
            "notDataActions": []
          }
        ],
        ...
      }
    ]
    ```

1. Use `az cosmosdb sql role assignment create` to create a role assignment. Replace `<aad-principal-id>` with the **Object ID** you recorded earlier in this article. Also, replace `<role-definition-id>` with the `id` value fetched from running the `az cosmosdb sql role definition list` command in a previous step.

    ```azurecli
    az cosmosdb sql role assignment create \
        --resource-group "<resource-group-name>" \
        --account-name "<account-name>" \
        --scope "/" \
        --principal-id "<account-name>" \
        --role-definition-id "<role-definition-id>"
    ```

## Use a service principal

Now that you've created a Microsoft Entra application and service principal, created a custom role, and assigned that role permissions to your Azure Cosmos DB for NoSQL account, you should be able to run a notebook.

1. Open your Azure Databricks workspace.

1. In the workspace interface, create a new **cluster**. Configure the cluster with these settings, at a minimum:

    | Version | Value |
    | --- | --- |
    | Runtime version | `13.3 LTS (Scala 2.12, Spark 3.4.1)` |

1. Use the workspace interface to search for **Maven** packages from **Maven Central** with a **Group ID** of `com.azure.cosmos.spark`. Install the package specifically for Spark 3.4 with an **Artifact ID** prefixed with `azure-cosmos-spark_3-4` to the cluster.

1. Finally, create a new **notebook**.

    > [!TIP]
    > By default, the notebook is attached to the recently created cluster.

1. Within the notebook, set Azure Cosmos DB Spark connector configuration settings for the NoSQL account endpoint, database name, and container name. Use the **Subscription ID**, **Resource Group**, **Application (client) ID**, **Directory (tenant) ID**, and **Client Secret** values recorded earlier in this article.

    ::: zone pivot="programming-language-python"

    ```python
    # Set configuration settings
    config = {
      "spark.cosmos.accountEndpoint": "<nosql-account-endpoint>",
      "spark.cosmos.auth.type": "ServicePrincipal",
      "spark.cosmos.account.subscriptionId": "<subscription-id>",
      "spark.cosmos.account.resourceGroupName": "<resource-group-name>",
      "spark.cosmos.account.tenantId": "<entra-tenant-id>",
      "spark.cosmos.auth.aad.clientId": "<entra-app-client-id>",
      "spark.cosmos.auth.aad.clientSecret": "<entra-app-client-secret>",
      "spark.cosmos.database": "<database-name>",
      "spark.cosmos.container": "<container-name>"        
    }    
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Set configuration settings
    val config = Map(
      "spark.cosmos.accountEndpoint" -> "<nosql-account-endpoint>",
      "spark.cosmos.auth.type" -> "ServicePrincipal",
      "spark.cosmos.account.subscriptionId" -> "<subscription-id>",
      "spark.cosmos.account.resourceGroupName" -> "<resource-group-name>",
      "spark.cosmos.account.tenantId" -> "<entra-tenant-id>",
      "spark.cosmos.auth.aad.clientId" -> "<entra-app-client-id>",
      "spark.cosmos.auth.aad.clientSecret" -> "<entra-app-client-secret>",
      "spark.cosmos.database" -> "<database-name>",
      "spark.cosmos.container" -> "<container-name>" 
    )
    ```

    ::: zone-end

1. Configure the Catalog API to manage API for NoSQL resources by using Spark.

    ::: zone pivot="programming-language-python"

    ```python
    # Configure Catalog Api
    spark.conf.set("spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", "<nosql-account-endpoint>")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.type", "ServicePrincipal")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.account.subscriptionId", "<subscription-id>")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.account.resourceGroupName", "<resource-group-name>")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.account.tenantId", "<entra-tenant-id>")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientId", "<entra-app-client-id>")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientSecret", "<entra-app-client-secret>")
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Configure Catalog Api
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", "<nosql-account-endpoint>")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.type", "ServicePrincipal")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.account.subscriptionId", "<subscription-id>")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.account.resourceGroupName", "<resource-group-name>")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.account.tenantId", "<entra-tenant-id>")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientId", "<entra-app-client-id>")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.auth.aad.clientSecret", "<entra-app-client-secret>")
    ```

    ::: zone-end

1. Create a new database by using `CREATE DATABASE IF NOT EXISTS`. Ensure that you provide your database name.

    ::: zone pivot="programming-language-python"

    ```python
    # Create a database using the Catalog API
    spark.sql("CREATE DATABASE IF NOT EXISTS cosmosCatalog.{};".format("<database-name>"))
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create a database using the Catalog API
    spark.sql(s"CREATE DATABASE IF NOT EXISTS cosmosCatalog.<database-name>;")
    ```

    ::: zone-end

1. Create a new container by using the database name, container name, partition key path, and throughput values that you specify.

    ::: zone pivot="programming-language-python"

    ```python
    # Create a products container using the Catalog API
    spark.sql("CREATE TABLE IF NOT EXISTS cosmosCatalog.{}.{} USING cosmos.oltp TBLPROPERTIES(partitionKeyPath = '{}', manualThroughput = '{}')".format("<database-name>", "<container-name>", "<partition-key-path>", "<throughput>"))
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create a products container using the Catalog API
    spark.sql(s"CREATE TABLE IF NOT EXISTS cosmosCatalog.<database-name>.<container-name> using cosmos.oltp TBLPROPERTIES(partitionKeyPath = '<partition-key-path>', manualThroughput = '<throughput>')")
    ```

    ::: zone-end

1. Create a sample dataset.

    ::: zone pivot="programming-language-python"

    ```python
    # Create sample data    
    products = (
      ("68719518391", "gear-surf-surfboards", "Yamba Surfboard", 12, 850.00, False),
      ("68719518371", "gear-surf-surfboards", "Kiama Classic Surfboard", 25, 790.00, True)
    )
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create sample data
    val products = Seq(
      ("68719518391", "gear-surf-surfboards", "Yamba Surfboard", 12, 850.00, false),
      ("68719518371", "gear-surf-surfboards", "Kiama Classic Surfboard", 25, 790.00, true)
    )
    ```

    ::: zone-end

1. Use `spark.createDataFrame` and the previously saved online transaction processing (OLTP) configuration to add sample data to the target container.

    ::: zone pivot="programming-language-python"

    ```python
    # Ingest sample data    
    spark.createDataFrame(products) \
      .toDF("id", "category", "name", "quantity", "price", "clearance") \
      .write \
      .format("cosmos.oltp") \
      .options(config) \
      .mode("APPEND") \
      .save()
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Ingest sample data
    spark.createDataFrame(products)
      .toDF("id", "category", "name", "quantity", "price", "clearance")
      .write
      .format("cosmos.oltp")
      .options(config)
      .mode("APPEND")
      .save()
    ```

    ::: zone-end

    > [!TIP]
    > In this quickstart example, credentials are assigned to variables in clear text. For security, we recommend that you use secrets. For more information on how to configure secrets, see [Add secrets to your Spark configuration](/azure/databricks/security/secrets/secrets#read-a-secret).

## Related content

- [Tutorial: Connect using Spark 3](tutorial-spark-connector.md)
- [Quickstart: Java](quickstart-java.md)