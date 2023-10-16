---
title: 'Quickstart: Create Apache Hadoop cluster in Azure HDInsight using Bicep'
description: In this quickstart, you create Apache Hadoop cluster in Azure HDInsight using Bicep
author: reachnijel
ms.author: nijelsf 
ms.service: hdinsight
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.date: 11/17/2022
#Customer intent: As a data analyst, I need to create a Hadoop cluster in Azure HDInsight using Bicep
---

# Quickstart: Create Apache Hadoop cluster in Azure HDInsight using Bicep

In this quickstart, you use Bicep to create an [Apache Hadoop](./apache-hadoop-introduction.md) cluster in Azure HDInsight. Hadoop was the original open-source framework for distributed processing and analysis of big data sets on clusters. The Hadoop ecosystem includes related software and utilities, including Apache Hive, Apache HBase, Spark, Kafka, and many others.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]
  
Currently HDInsight comes with [seven different cluster types](../hdinsight-overview.md#cluster-types-in-hdinsight). Each cluster type supports a different set of components. All cluster types support Hive. For a list of supported components in HDInsight, see [What's new in the Hadoop cluster versions provided by HDInsight?](../hdinsight-component-versioning.md)  

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/hdinsight-linux-ssh-password/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.hdinsight/hdinsight-linux-ssh-password/main.bicep":::

Two Azure resources are defined in the Bicep file:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage Account.
* [Microsoft.HDInsight/cluster](/azure/templates/microsoft.hdinsight/clusters): create an HDInsight cluster.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters clusterName=<cluster-name> clusterType=<cluster-type> clusterLoginUserName=<cluster-username> sshUserName=<ssh-username>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -clusterName "<cluster-name>" -clusterType "<cluster-type>" -clusterLoginUserName "<cluster-username>" -sshUserName "<ssh-username>"
    ```

    ---

    You need to provide values for the parameters:

    * Replace **\<cluster-name\>** with the name of the HDInsight cluster to create.
    * Replace **\<cluster-type\>** with the type of the HDInsight cluster to create. Allowed strings include: `hadoop`, `interactivehive`, `hbase`, and `spark`.
    * Replace **\<cluster-username\>** with the credentials used to submit jobs to the cluster and to log in to cluster dashboards.
    * Replace **\<ssh-username\>** with the credentials used to remotely access the cluster. The username cannot be admin.

    You'll also be prompted to enter the following:

    * **clusterLoginPassword**, which must be at least 10 characters long and contain one digit, one uppercase letter, one lowercase letter, and one non-alphanumeric character except single-quote, double-quote, backslash, right-bracket, full-stop. It also must not contain three consecutive characters from the cluster username or SSH username.
    * **sshPassword**, which must be 6-72 characters long and must contain at least one digit, one uppercase letter, and one lowercase letter. It must not contain any three consecutive characters from the cluster login name.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you learned how to create an Apache Hadoop cluster in HDInsight using Bicep. In the next article, you learn how to perform an extract, transform, and load (ETL) operation using Hadoop on HDInsight.

> [!div class="nextstepaction"]
> [Extract, transform, and load data using Interactive Query on HDInsight](../interactive-query/interactive-query-tutorial-analyze-flight-data.md)
