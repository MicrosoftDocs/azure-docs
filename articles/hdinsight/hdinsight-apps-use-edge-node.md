<properties
	pageTitle="Use empty edge nodes in HDInsight | Microsoft Azure"
	description="How to add an ampty edge node to HDInsight cluster that can be used as a client, and to test/host your HDInsight applications."
	services="hdinsight"
	editor="cgronlun"
	manager="jhubbard"
	authors="mumian"
	tags="azure-portal"
	documentationCenter=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/13/2016"
	ms.author="jgao"/>

# Use empty edge nodes in HDInsight

Learn how to add an empty edge node to a Linux-based HDInsight cluster. An empty edge node is a Linux virtual machine with the same client tools installed and configured as in the headnodes. You can use the edge node for accessing the cluster, testing your client applications, and hosting your client applications. 

You can add an empty edge node to an existing HDInsight cluster, to a new cluster when you create the cluster. Adding an empty edge node is done using Azure Resource Manager template.  The following sample demonstrates how it is done using a template:

    "resources": [
		{
			"name": "[concat(parameters('clusterName'),'/', variables('applicationName'))]",
			"type": "Microsoft.HDInsight/clusters/applications",
			"apiVersion": "[variables('clusterApiVersion')]",
			"properties": {
				"marketPlaceIdentifier": "EmptyNode",
				"computeProfile": {
					"roles": [{
						"name": "edgenode",
						"targetInstanceCount": 1,
						"hardwareProfile": {
							"vmSize": "[parameters('edgeNodeSize')]"
						}
					}]
				},
				"installScriptActions": [{
					"name": "[concat('emptynode','-' ,uniquestring(variables('applicationName')))]",
					"uri": "https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/EmptyNode/scripts/EmptyNodeSetup.sh",
					"roles": ["edgenode"]
				}],
				"uninstallScriptActions": [],
				"httpsEndpoints": [],
				"applicationType": "CustomApplication"
			}
		}
	],

As shown in the sample, you can optionally call a [script action](hdinsight-hadoop-customize-cluster-linux.md) to perform additional configuration, such as installing [Apache Hue](hdinsight-hadoop-hue-linux.md) in the edge node.

After you have created an edge node, you can connect to the edge node using SSH, and run client tools to access the Hadoop cluster in HDInsight.

## Add an edge node to an existing cluster

In this section, you use a Resource Manager template to add an edge node to an existing HDInsight cluster.  The Resource Manager template can be found in [GitHub](https://github.com/hdinsight/Iaas-Applications/tree/master/EmptyNode). The Resource Manager template calls a script action script located at https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/EmptyNode/scripts/EmptyNodeSetup.sh. The script doesn't perform any actions.  This is to demonstrate calling script action from a Resource Manager template.

**To add an empty edge node to an existing cluster**

1. Create an HDInsight cluster if you don't have one yet.  See [Hadoop tutorial: Get started using Linux-based Hadoop in HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).
2. Click the following image to sign in to Azure and open the Azure Resource Manager template in the Azure portal. 

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fhdinsight%2FIaas-Applications%2Fmaster%2FEmptyNode%2Fazuredeploy.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

3. Configure the following properties:

	- CLUSTERNAME: Enter the name of an existing HDInsight cluster.
	- EDGENODESIZE: Select one of the VM sizes.
	- EDGENODEPREFIX: The default value is **new**.  Using the default value, the edge node name is **new-edgenode**.  You can customize the prefix from the portal. You can also customize the full name from the template.


4. Click **OK** to save the changes.
5. In **Resource group**, select a Resource Group.
6. Click **Review legal terms**, and then click **Purchase**.
7. Select **Pin to dashboard**, and then click **Create**.

## Add an edge node when creating a cluster

In this section, you use a Resource Manager template to create HDInsight cluster with an edge node.  The Resource Manager template can be found in a public [Azure Blob storage container](http://hditutorialdata.blob.core.windows.net/armtemplates/create-linux-based-hadoop-cluster-in-hdinsight-with-edge-node.json). The Resource Manager template calls a script action script located at https://raw.githubusercontent.com/hdinsight/Iaas-Applications/master/EmptyNode/scripts/EmptyNodeSetup.sh. The script doesn't perform any actions.  This is to demonstrate calling script action from a Resource Manager template.

**To add an empty edge node to an existing cluster**

1. Create an HDInsight cluster if you don't have one yet.  See [Hadoop tutorial: Get started using Linux-based Hadoop in HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).
2. Click the following image to sign in to Azure and open the Azure Resource Manager template in the Azure portal. 

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fhditutorialdata.blob.core.windows.net%2Farmtemplates%2Fcreate-linux-based-hadoop-cluster-in-hdinsight-with-edge-node.json" target="_blank"><img src="https://acom.azurecomcdn.net/80C57D/cdn/mediahandler/docarticles/dpsmedia-prod/azure.microsoft.com/en-us/documentation/articles/hdinsight-hbase-tutorial-get-started-linux/20160201111850/deploy-to-azure.png" alt="Deploy to Azure"></a>

3. Configure the following properties:
		
	- CLUSTERNAME: Enter a name for the new cluster to create.
	- CLUSTERLOGINUSERNAME: Enter the Hadoop HTTP user name.  The default name is **admin**.
	- CLUSTERLOGINPASSWORD: Enter the Hadoop HTTP user password.
	- SSHUSERNAME: Enter the SSH user name. The default name is **sshuser**.
	- SSHPASSWORD: Enter the SSH user password.
	- LOCATION: Enter the location of the Resource Group name, the cluster, and the default storage account.
	- CLUSTERTYPE: The default value is **hadoop**.
	- CLUSTERWORKERNODECOUNT: The default value is 2.
	- EDGENODESIZE: Select one of the VM sizes.
	- EDGENODEPREFIX: The default value is **new**.  Using the default value, the edge node name is **new-edgenode**.  You can customize the prefix from the portal. You can also customize the full name from the template.

4. Click **OK** to save the changes.
5. In **Resource group**, enter a new Resource Group name.
6. Click **Review legal terms**, and then click **Purchase**.
7. Select **Pin to dashboard**, and then click **Create**. 


## Access an edge node

The edge node ssh endpoint is <EdgeNodeName>.<ClusterName>-ssh.azurehdinsight.net:22.  For example, new-edgenode.myedgenode0914-ssh.azurehdinsight.net:22.

The edge node appears as an application on the Azure portal.  The portal gives you the information to access the edge node using SSH.

**To verify the edge node SSH endpoint**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the HDInsight cluster with an edge node.
3. Click **Applications** from the cluster blade. You shall see the edge node.  The default name is **new-edgenode**.
4. Click the edge node. You shall see the SSH endpoint.

**To use Hive on the edge node**

5. Use SSH to connect to the edge node.  See [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md) or [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md).
6. After you have connected to the edge node using SSH, use the following command to open the Hive console:

		hive
7. Run the following command to show Hive tables in the cluster:

		show tables;

## Delete an edge node

You can delete an edge node from the Azure portal.

**To access an edge node**

1. Sign on to the [Azure portal](https://portal.azure.com).
2. Open the HDInsight cluster with an edge node.
3. Click **Applications** from the cluster blade. You shall see a list of edge nodes.  
4. Right-click the edge node you want to delete, and then click **Delete**.
5. Click **Yes** to confirm.

## Next steps

In this article, you have learned how to add an edge node and how to access the edge node. To learn more, see the following articles:

- [Install HDInsight applications](hdinsight-apps-install-applications.md): Learn how to install an HDInsight application to your clusters.
- [Install custom HDInsight applications](hdinsight-apps-install-custom-applications.md): learn how to deploy an unpublished HDInsight application to HDInsight.
- [Publish HDInsight applications](hdinsight-apps-publish-applications.md): Learn how to publish your custom HDInsight applications to Azure Marketplace.
- [MSDN: Install an HDInsight application](https://msdn.microsoft.com/library/mt706515.aspx): Learn how to define HDInsight applications.
- [Customize Linux-based HDInsight clusters using Script Action](hdinsight-hadoop-customize-cluster-linux.md): learn how to use Script Action to install additional applications.
- [Create Linux-based Hadoop clusters in HDInsight using Resource Manager templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md): learn how to call Resource Manager templates to create HDInsight clusters.

