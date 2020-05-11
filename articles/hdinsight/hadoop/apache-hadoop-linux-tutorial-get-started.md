---
title: 'Quickstart: Create Apache Hadoop cluster in Azure HDInsight using Resource Manager template'
description: In this quickstart, you create Apache Hadoop cluster in Azure HDInsight using Resource Manager template
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 03/13/2020
#Customer intent: As a data analyst, I need to create a Hadoop cluster in Azure HDInsight using Resource Manager template
---

# Quickstart: Create Apache Hadoop cluster in Azure HDInsight using Resource Manager template

In this quickstart, you use an Azure Resource Manager template to create an [Apache Hadoop](./apache-hadoop-introduction.md) cluster in Azure HDInsight. Hadoop was the original open-source framework for distributed processing and analysis of big data sets on clusters. The Hadoop ecosystem includes related software and utilities, including Apache Hive, Apache HBase, Spark, Kafka, and many others.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]
  
Currently HDInsight comes with [seven different cluster types](../hdinsight-overview.md#cluster-types-in-hdinsight). Each cluster type supports a different set of components. All cluster types support Hive. For a list of supported components in HDInsight, see [What's new in the Hadoop cluster versions provided by HDInsight?](../hdinsight-component-versioning.md)  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create an Apache Hadoop cluster

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-linux-ssh-password).

:::code language="json" source="~/quickstart-templates/101-hdinsight-linux-ssh-password/azuredeploy.json" range="1-148":::


Two Azure resources are defined in the template:

* [Microsoft.Storage/storageAccounts](https://docs.microsoft.com/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage Account.
* [Microsoft.HDInsight/cluster](https://docs.microsoft.com/azure/templates/microsoft.hdinsight/clusters): create an HDInsight cluster.

### Deploy the template

1. Select the **Deploy to Azure** button below to sign in to Azure and open the Resource Manager template.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-hdinsight-linux-ssh-password%2Fazuredeploy.json" target="_blank"><img src="./media/apache-hadoop-linux-tutorial-get-started/hdi-deploy-to-azure1.png" alt="Deploy to Azure button for new cluster"></a>

1. Enter or select the following values:

    |Property  |Description  |
    |---------|---------|
    |Subscription|From the drop-down list, select the Azure subscription that's used for the cluster.|
    |Resource group|From the drop-down list, select your existing resource group, or select **Create new**.|
    |Location|The value will autopopulate with the location used for the resource group.|
    |Cluster Name|Enter a globally unique name. For this template, use only lowercase letters, and numbers.|
    |Cluster Type | Select **hadoop**. |
    |Cluster Login User Name|Provide the username, default is **admin**.|
    |Cluster Login Password|Provide a password. The password must be at least 10 characters in length and must contain at least one digit, one uppercase, and one lower case letter, one non-alphanumeric character (except characters ' " ` ). |
    |Ssh User Name|Provide the username, default is **sshuser**|
    |Ssh Password|Provide the password.|

    Some properties have been hardcoded in the template.  You can configure these values from the template. For more explanation of these properties, see [Create Apache Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md).

    > [!NOTE]  
    > The values you provide must be unique and should follow the naming guidelines. The template does not perform validation checks. If the values you provide are already in use, or do not follow the guidelines, you get an error after you have submitted the template.  

    ![HDInsight Linux gets started Resource Manager template on portal](./media/apache-hadoop-linux-tutorial-get-started/hdinsight-linux-get-started-arm-template-on-portal.png "Deploy Hadoop cluster in HDInsight using the Azure portal and a resource group manager template")

1. Review the **TERMS AND CONDITIONS**. Then select **I agree to the terms and conditions stated above**, then **Purchase**. You'll receive a notification that your deployment is in progress. It takes about 20 minutes to create a cluster.

## Review deployed resources

Once the cluster is created, you'll receive a **Deployment succeeded** notification with a **Go to resource** link. Your Resource group page will list your new HDInsight cluster and the default storage associated with the cluster. Each cluster has an [Azure Storage](../hdinsight-hadoop-use-blob-storage.md) account or an [Azure Data Lake Storage account](../hdinsight-hadoop-use-data-lake-store.md) dependency. It's referred as the default storage account. The HDInsight cluster and its default storage account must be colocated in the same Azure region. Deleting clusters doesn't delete the storage account.

> [!NOTE]  
> For other cluster creation methods and understanding the properties used in this quickstart, see [Create HDInsight clusters](../hdinsight-hadoop-provision-linux-clusters.md).

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it isn't in use. You're also charged for an HDInsight cluster, even when it isn't in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they aren't in use.

> [!NOTE]  
> If you are *immediately* proceeding to the next tutorial to learn how to run ETL operations using Hadoop on HDInsight, you may want to keep the cluster running. This is because in the tutorial you have to create a Hadoop cluster again. However, if you are not going through the next tutorial right away, you must delete the cluster now.

From the Azure portal, navigate to your cluster, and select **Delete**.

![HDInsight delete cluster from portal](./media/apache-hadoop-linux-tutorial-get-started/hdinsight-delete-cluster.png "HDInsight delete cluster from portal")

You can also select the resource group name to open the resource group page, and then select **Delete resource group**. By deleting the resource group, you delete both the HDInsight cluster, and the default storage account.

## Next steps

In this quickstart, you learned how to create an Apache Hadoop cluster in HDInsight using a Resource Manager template. In the next article, you learn how to perform an extract, transform, and load (ETL) operation using Hadoop on HDInsight.

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Interactive Query on HDInsight](../interactive-query/interactive-query-tutorial-analyze-flight-data.md)
