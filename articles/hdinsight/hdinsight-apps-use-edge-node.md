---
title: Use empty edge nodes on Apache Hadoop clusters in Azure HDInsight
description: How to add an empty edge node to an HDInsight cluster. Used as a client, and then test, or host your HDInsight applications.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,hdiseo17may2017
ms.date: 05/26/2023
---

# Use empty edge nodes on Apache Hadoop clusters in HDInsight

Learn how to add an empty edge node to an HDInsight cluster. An empty edge node is a Linux virtual machine with the same client tools installed and configured as in the headnodes. But with no [Apache Hadoop](./hadoop/apache-hadoop-introduction.md) services running. You can use the edge node for accessing the cluster, testing your client applications, and hosting your client applications.

You can add an empty edge node to an existing HDInsight cluster, to a new cluster when you create the cluster. Adding an empty edge node is done using Azure Resource Manager template.  The following sample demonstrates how it's done using a template:

```json
"resources": [
    {
        "name": "[concat(parameters('clusterName'),'/', variables('applicationName'))]",
        "type": "Microsoft.HDInsight/clusters/applications",
        "apiVersion": "2015-03-01-preview",
        "dependsOn": [ "[concat('Microsoft.HDInsight/clusters/',parameters('clusterName'))]" ],
        "properties": {
            "marketPlaceIdentifier": "EmptyNode",
            "computeProfile": {
                "roles": [{
                    "name": "edgenode",
                    "targetInstanceCount": 1,
                    "hardwareProfile": {
                        "vmSize": "{}"
                    }
                }]
            },
            "installScriptActions": [{
                "name": "[concat('emptynode','-' ,uniquestring(variables('applicationName')))]",
                "uri": "[parameters('installScriptAction')]",
                "roles": ["edgenode"]
            }],
            "uninstallScriptActions": [],
            "httpsEndpoints": [],
            "applicationType": "CustomApplication"
        }
    }
],
```

As shown in the sample, you can optionally call a [script action](hdinsight-hadoop-customize-cluster-linux.md) to do additional configuration. Such as installing [Apache Hue](hdinsight-hadoop-hue-linux.md) in the edge node. The script action script must be publicly accessible on the web.  For example, if the script is stored in Azure Storage, use either public containers or public blobs.

The edge node virtual machine size must meet the HDInsight cluster worker node vm size requirements. For the recommended worker node vm sizes, see [Create Apache Hadoop clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md#cluster-type).

After you've created an edge node, you can connect to the edge node using SSH, and run client tools to access the Hadoop cluster in HDInsight.

> [!WARNING]
> Custom components that are installed on the edge node receive commercially reasonable support from Microsoft. This might result in resolving problems you encounter. Or, you may be referred to community resources for further assistance. The following are some of the most active sites for getting help from the community:
>
> * [Microsoft Q&A question page for HDInsight](/answers/topics/azure-hdinsight.html)
> * [https://stackoverflow.com](https://stackoverflow.com).
>
> If you are using an Apache technology, you may be able to find assistance through the Apache project sites on [https://apache.org](https://apache.org), such as the [Apache Hadoop](https://hadoop.apache.org/) site.

> [!IMPORTANT]
> Ubuntu images become available for new HDInsight cluster creation within 3 months of being published. As of January 2019, running clusters (including edge nodes) are **not** auto-patched. Customers must use script actions or other mechanisms to patch a running cluster.  For more information, see [OS patching for HDInsight](./hdinsight-os-patching.md).

## Add an edge node to an existing cluster

In this section, you use a Resource Manager template to add an edge node to an existing HDInsight cluster.  The Resource Manager template can be found in [GitHub](https://azure.microsoft.com/resources/templates/hdinsight-linux-add-edge-node/). The Resource Manager template calls a script action located at https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.hdinsight/hdinsight-linux-add-edge-node/scripts/EmptyNodeSetup.sh. The script doesn't do any actions.  It's to demonstrate calling script action from a Resource Manager template.

1. Select the following image to sign in to Azure and open the Azure Resource Manager template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-linux-add-edge-node%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-apps-use-edge-node/hdi-deploy-to-azure1.png" alt="Deploy to Azure button for new cluster"></a>

1. Configure the following properties:

    |Property |Description |
    |---|---|
    |Subscription|Select an Azure subscription used for creating the cluster.|
    |Resource group|Select the resource group used for the existing HDInsight cluster.|
    |Location|Select the location of the existing HDInsight cluster.|
    |Cluster Name|Enter the name of an existing HDInsight cluster.|

1. Check **I agree to the terms and conditions stated above**, and then select  **Purchase** to create the edge node.

> [!IMPORTANT]  
> Make sure to select the Azure resource group for the existing HDInsight cluster.  Otherwise, you get the error message "Can not perform requested operation on nested resource. Parent resource '&lt;ClusterName>' not found."

## Add an edge node when creating a cluster

In this section, you use a Resource Manager template to create HDInsight cluster with an edge node.  The Resource Manager template can be found in the [Azure quickstart templates gallery](https://azure.microsoft.com/resources/templates/hdinsight-linux-with-edge-node/). The Resource Manager template calls a script action located at https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.hdinsight/hdinsight-linux-with-edge-node/scripts/EmptyNodeSetup.sh. The script doesn't do any actions.  It's to demonstrate calling script action from a Resource Manager template.

1. Create an HDInsight cluster if you don't have one yet.  See [Get started using Hadoop in HDInsight](hadoop/apache-hadoop-linux-tutorial-get-started.md).

1. Select the following image to sign in to Azure and open the Azure Resource Manager template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-linux-with-edge-node%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-apps-use-edge-node/hdi-deploy-to-azure1.png" alt="Deploy to Azure button for new cluster"></a>

1. Configure the following properties:

    |Property |Description |
    |---|---|
    |Subscription|Select an Azure subscription used for creating the cluster.|
    |Resource group|Create a new resource group used for the cluster.|
    |Location|Select a location for the resource group.|
    |Cluster Name|Enter a name for the new cluster to create.|
    |Cluster Login User Name|Enter the Hadoop HTTP user name.  The default name is **admin**.|
    |Cluster Login Password|Enter the Hadoop HTTP user password.|
    |Ssh User Name|Enter the SSH user name. The default name is **sshuser**.|
    |Ssh Password|Enter the SSH user password.|
    |Install Script Action|Keep the default value for going through this article.|

    Some properties have been hardcoded in the template: Cluster type, Cluster worker node count, Edge node size, and Edge node name.

1. Check **I agree to the terms and conditions stated above**, and then select  **Purchase** to create the cluster with the edge node.

## Add multiple edge nodes

You can add multiple edge nodes to an HDInsight cluster.  The multiple edge nodes configuration can only be done using Azure Resource Manager Templates.  See the template sample at the beginning of this article.  Update the **targetInstanceCount** to reflect the number of edge nodes you would like to create.

## Access an edge node

The edge node ssh endpoint is &lt;EdgeNodeName>.&lt;ClusterName>-ssh.azurehdinsight.net:22.  For example, new-edgenode.myedgenode0914-ssh.azurehdinsight.net:22.

The edge node appears as an application on the Azure portal.  The portal gives you the information to access the edge node using SSH.

**To verify the edge node SSH endpoint**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the HDInsight cluster with an edge node.
3. Select **Applications**. You shall see the edge node.  The default name is **new-edgenode**.
4. Select the edge node. You shall see the SSH endpoint.

**To use Hive on the edge node**

1. Use SSH to connect to the edge node. For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. After you've connected to the edge node using SSH, use the following command to open the Hive console:

    ```console
    hive
    ```

3. Run the following command to show Hive tables in the cluster:

    ```hiveql
    show tables;
    ```

## Delete an edge node

You can delete an edge node from the Azure portal.

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the HDInsight cluster with an edge node.
3. Select **Applications**. You shall see a list of edge nodes.  
4. Right-click the edge node you want to delete, and then select **Delete**.
5. Select **Yes** to confirm.

## Next steps

In this article, you've learned how to add an edge node and how to access the edge node. To learn more, see the following articles:

* [Install HDInsight applications](hdinsight-apps-install-applications.md): Learn how to install an HDInsight application to your clusters.
* [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an unpublished HDInsight application to HDInsight.
* [Publish HDInsight applications](hdinsight-apps-publish-applications.md): Learn how to publish your custom HDInsight applications to Azure Marketplace.
* [MSDN: Install an HDInsight application](/rest/api/hdinsight/hdinsight-application): Learn how to define HDInsight applications.
* [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
* [Create Linux-based Apache Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call Resource Manager templates to create HDInsight clusters.
