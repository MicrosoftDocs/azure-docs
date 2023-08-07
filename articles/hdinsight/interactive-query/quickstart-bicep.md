---
title: 'Quickstart: Create Interactive Query cluster using Bicep - Azure HDInsight'
description: This quickstart shows how to use Bicep to create an Interactive Query cluster in Azure HDInsight.
author: reachnijel
ms.author: nijelsf
ms.service: hdinsight
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
ms.date: 07/19/2022
#Customer intent: As a developer new to Interactive Query on Azure, I need to see how to create an Interactive Query cluster.
---

# Quickstart: Create Interactive Query cluster in Azure HDInsight using Bicep

In this quickstart, you use a Bicep to create an [Interactive Query](./apache-interactive-query-get-started.md) cluster in Azure HDInsight. Interactive Query (also called Apache Hive LLAP, or [Low Latency Analytical Processing](https://cwiki.apache.org/confluence/display/Hive/LLAP)) is an Azure HDInsight [cluster type](../hdinsight-hadoop-provision-linux-clusters.md#cluster-type).

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/hdinsight-interactive-hive/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.hdinsight/hdinsight-interactive-hive/main.bicep":::

Two Azure resources are defined in the Bicep file:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts): create an Azure Storage Account.
* [Microsoft.HDInsight/cluster](/azure/templates/microsoft.hdinsight/clusters): create an HDInsight cluster.

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters clusterName=<cluster-name> clusterLoginUserName=<cluster-username> sshUserName=<ssh-username>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -clusterName "<cluster-name>" -clusterLoginUserName "<cluster-username>" -sshUserName "<ssh-username>"
    ```

    ---

    You need to provide values for the parameters:

    * Replace **\<cluster-name\>** with the name of the HDInsight cluster to create.
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

In this quickstart, you learned how to create an Interactive Query cluster in HDInsight using Bicep. In the next article, you learn how to use Apache Zeppelin to run Apache Hive queries.

> [!div class="nextstepaction"]
> [Execute Apache Hive queries in Azure HDInsight with Apache Zeppelin](./hdinsight-connect-hive-zeppelin.md)
