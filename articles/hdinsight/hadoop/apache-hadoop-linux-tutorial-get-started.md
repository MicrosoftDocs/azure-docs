---
title: 'Quickstart: Create Apache Hadoop clusters using Resource Manager - Azure HDInsight'
description: In this quickstart, you create Apache Hadoop cluster in Azure HDInsight using Resource Manager template
keywords: hadoop getting started,hadoop linux,hadoop quickstart,hive getting started,hive quickstart
ms.service: hdinsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.custom: hdinsightactive,hdiseo17may2017,mvc,seodec18
ms.topic: quickstart
ms.date: 06/12/2019
#Customer intent: As a data analyst, I need to create a Hadoop cluster in Azure HDInsight using Resource Manager template
---

# Quickstart: Create Apache Hadoop cluster in Azure HDInsight using Resource Manager template

In this quickstart, you learn how to create an Apache Hadoop cluster in Azure HDInsight using a Resource Manager template.

Similar templates can be viewed at [Azure quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Hdinsight&pageNumber=1&sort=Popular). The template reference can be found [here](https://docs.microsoft.com/azure/templates/microsoft.hdinsight/allversions).  You can also create a cluster using the [Azure portal](apache-hadoop-linux-create-cluster-get-started-portal.md).  

Currently HDInsight comes with [seven different cluster types](./apache-hadoop-introduction.md#cluster-types-in-hdinsight). Each cluster type supports a different set of components. All cluster types support Hive. For a list of supported components in HDInsight, see [What's new in the Hadoop cluster versions provided by HDInsight?](../hdinsight-component-versioning.md)  

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

<a name="create-cluster"></a>
## Create a Hadoop cluster

1. Select the **Deploy to Azure** button below to sign in to Azure and open the Resource Manager template in the Azure portal.
   
    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-hdinsight-linux-ssh-password%2Fazuredeploy.json" target="_blank"><img src="./media/apache-hadoop-linux-tutorial-get-started/deploy-to-azure.png" alt="Deploy to Azure"></a>

2. Enter or select the following values:

    |Property  |Description  |
    |---------|---------|
    |**Subscription**     |  Select your Azure subscription. |
    |**Resource group**     | Create a resource group or select an existing resource group.  A resource group is a container of Azure components.  In this case, the resource group contains the HDInsight cluster and the dependent Azure Storage account. |
    |**Location**     | Select an Azure location where you want to create your cluster.  Choose a location closer to you for better performance. |
    |**Cluster Name**     | Enter a name for the Hadoop cluster. Because all clusters in HDInsight share the same DNS namespace this name needs to be unique. The name may only contain lowercase letters, numbers, and hyphens, and must begin with a letter.  Each hyphen must be preceded and followed by a non-hyphen character.  The name must also be between 3 and 59 characters long. |
    |**Cluster Type**     | Select **hadoop**. |
    |**Cluster login name and password**     | The default login name is **admin**. The password must be at least 10 characters in length and must contain at least one digit, one uppercase, and one lower case letter, one non-alphanumeric character (except characters ' " ` \). Make sure you **do not provide** common passwords such as "Pass@word1".|
    |**SSH username and password**     | The default username is **sshuser**.  You can rename the SSH username.  The SSH user password has the same requirements as the cluster login password.|

    Some properties have been hardcoded in the template.  You can configure these values from the template. For more explanation of these properties, see [Create Apache Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md).

    > [!NOTE]  
    > The values you provide must be unique and should follow the naming guidelines. The template does not perform validation checks. If the values you provide are already in use, or do not follow the guidelines, you get an error after you have submitted the template.  

    ![HDInsight Linux gets started Resource Manager template on portal](./media/apache-hadoop-linux-tutorial-get-started/hdinsight-linux-get-started-arm-template-on-portal.png "Deploy Hadoop cluster in HDInsight using the Azure portal and a resource group manager template")

3. Select **I agree to the terms and conditions stated above**, and then select **Purchase**. You will receive a notification that your deployment is in progress.  It takes about 20 minutes to create a cluster.

4. Once the cluster is created, you will receive a **Deployment succeeded** notification with a **Go to resource group** link.  Your **Resource group** page will list your new HDInsight cluster and the default storage associated with the cluster. Each cluster has an [Azure Storage account](../hdinsight-hadoop-use-blob-storage.md) or an [Azure Data Lake Storage account](../hdinsight-hadoop-use-data-lake-store.md) dependency. It is referred as the default storage account. The HDInsight cluster and its default storage account must be colocated in the same Azure region. Deleting clusters does not delete the storage account.

> [!NOTE]  
> For other cluster creation methods and understanding the properties used in this quickstart, see [Create HDInsight clusters](../hdinsight-hadoop-provision-linux-clusters.md).

## Clean up resources

After you complete the quickstart, you may want to delete the cluster. With HDInsight, your data is stored in Azure Storage, so you can safely delete a cluster when it is not in use. You are also charged for an HDInsight cluster, even when it is not in use. Since the charges for the cluster are many times more than the charges for storage, it makes economic sense to delete clusters when they are not in use.

> [!NOTE]  
> If you are *immediately* proceeding to the next tutorial to learn how to run ETL operations using Hadoop on HDInsight, you may want to keep the cluster running. This is because in the tutorial you have to create a Hadoop cluster again. However, if you are not going through the next tutorial right away, you must delete the cluster now.

**To delete the cluster and/or the default storage account**

1. Go back to the browser tab where you have the Azure portal. You shall be on the cluster overview page. If you only want to delete the cluster but retain the default storage account, select **Delete**.

    ![HDInsight delete cluster](./media/apache-hadoop-linux-tutorial-get-started/hdinsight-delete-cluster.png "Delete HDInsight cluster")

2. If you want to delete the cluster as well as the default storage account, select the resource group name (highlighted in the previous screenshot) to open the resource group page.

3. Select **Delete resource group** to delete the resource group, which contains the cluster and the default storage account. Note deleting the resource group deletes the storage account. If you want to keep the storage account, choose to delete the cluster only.

## Next steps

In this quickstart, you learned how to create an Apache Hadoop cluster in HDInsight using a Resource Manager template. In the next article, you learn how to perform an extract, transform, and load (ETL) operation using Hadoop on HDInsight.

> [!div class="nextstepaction"]
>[Extract, transform, and load data using Interactive Query on HDInsight](../interactive-query/interactive-query-tutorial-analyze-flight-data.md)