---
title: How to use Hive metastore in Spark
description: Learn how to use Hive metastore in Spark
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# How to use Hive metastore in Spark

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

It's essential to share the data and metastore across multiple services. One of the commonly used metastore in HIVE metastore. HDInsight on AKS allows users to connect to external metastore. This step enables the HDInsight users to seamlessly connect to other services in the ecosystem.

Azure HDInsight on AKS supports custom meta stores, which are recommended for production clusters. The key steps involved are

1. Create Azure SQL database
1. Create a key vault for storing the credentials
1. Configure Metastore while you create a HDInsight Spark cluster 
1. Operate on External Metastore (Shows databases and do a select limit 1).

While you create the cluster, HDInsight service needs to connect to the external metastore and verify your credentials.

## Create Azure SQL database

1. Create or have an existing Azure SQL Database before setting up a custom Hive metastore for an HDInsight cluster. 

   > [!NOTE]
   > Currently, we support only Azure SQL Database for HIVE metastore.
   > Due to Hive limitation, "-" (hyphen) character in metastore database name is not supported.
    
## Create a key vault for storing the credentials

1. Create an Azure Key Vault.

    The purpose of the Key Vault is to allow you to store the SQL Server admin password set during SQL database creation. HDInsight on AKS platform doesn’t deal with the credential directly. Hence, it's necessary to store your important credentials in Azure Key Vault. 
    Learn the steps to create an [Azure Key Vault](../../key-vault/general/quick-create-portal.md).
1. Post the creation of Azure Key Vault assign the following roles

    |Object	|Role|Remarks|
    |-|-|-|
    |User Assigned Managed Identity(the same UAMI as used by the HDInsight cluster) |Key Vault Secrets User | Learn how to [Assign role to UAMI](../../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md)|
    |User(who creates secret in Azure Key Vault) | Key Vault Administrator| Learn how to [Assign role to user](../../role-based-access-control/role-assignments-portal.md#step-2-open-the-add-role-assignment-page). |

    > [!NOTE]
    > Without this role, user can't create a secret.

1. [Create a secret](../../key-vault/secrets/quick-create-portal.md#add-a-secret-to-key-vault)

    This step allows you to keep your SQL server admin password as a secret in Azure Key Vault. Add your password(same password as provided in the SQL DB for admin) in the “Value” field while adding a secret.

    :::image type="content" source="./media/use-hive-metastore/key-vault.png" alt-text="Screenshot showing how to create a key vault." lightbox="./media/use-hive-metastore/key-vault.png":::

    :::image type="content" source="./media/use-hive-metastore/create-secret.png" alt-text="Screenshot showing how to create a secret." lightbox="./media/use-hive-metastore/create-secret.png":::


    > [!NOTE]
    > Make sure to note the secret name, as you'll need this during cluster creation.
    

## Configure Metastore while you create a HDInsight Spark cluster

1. Navigate to HDInsight on AKS Cluster pool to create clusters. 

   :::image type="content" source="./media/use-hive-metastore/create-new-cluster.png" alt-text="Screenshot showing how to create new cluster." lightbox="./media/use-hive-metastore/create-new-cluster.png":::

1. Enable the toggle button to add external hive metastore and fill in the following details.

    :::image type="content" source="./media/use-hive-metastore/basic-tab.png" alt-text="Screenshot showing the basic tab." lightbox="./media/use-hive-metastore/basic-tab.png":::

1. The rest of the details are to be filled in as per the cluster creation rules for [HDInsight on AKS Spark cluster](./create-spark-cluster.md).

1. Click on **Review and Create.**

    :::image type="content" source="./media/use-hive-metastore/review-create-tab.png" alt-text="Screenshot showing the review and create tab." lightbox="./media/use-hive-metastore/review-create-tab.png":::

    > [!NOTE]
    > * The lifecycle of the metastore isn't tied to a clusters lifecycle, so you can create and delete clusters without losing metadata. Metadata such as your Hive schemas persist even after you delete and re-create the HDInsight cluster.
    > * A custom metastore lets you attach multiple clusters and cluster types to that metastore.

## Operate on External Metastore

1. Create a table

    `>> spark.sql("CREATE TABLE sampleTable (number Int, word String)")`

    :::image type="content" source="./media/use-hive-metastore/create-table.png" alt-text="Screenshot showing how to create table." lightbox="./media/use-hive-metastore/create-table.png":::

1. Add data on the table

    `>> spark.sql("INSERT INTO sampleTable VALUES (123, \"HDIonAKS\")");\`
    
    :::image type="content" source="./media/use-hive-metastore/insert-statement.png" alt-text="Screenshot showing insert statement." lightbox="./media/use-hive-metastore/insert-statement.png":::

1. Read the table

    `>> spark.sql("select * from sampleTable").show()`

    :::image type="content" source="./media/use-hive-metastore/read-table.png" alt-text="Screenshot showing how to read table." lightbox="./media/use-hive-metastore/read-table.png":::


