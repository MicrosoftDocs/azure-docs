<properties linkid="customize HDInsight clusters using Script Action" urlDisplayName="Customize HDInsight clusters using Script Action" pageTitle="Customize HDInsight Clusters using Script Action| Azure" metaKeywords="" description="Learn how to customize HDInsight clusters using Script Action." metaCanonical="" services="hdinsight" documentationCenter="" title="Customize HDInsight clusters using Script Action" authors="nitinme" solutions="" manager="paulettm" editor="cgronlun" /> 

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/19/2014" ms.author="nitinme" /> 

# Customize HDInsight clusters using Script Action

You can customize an Azure HDInsight cluster to install additional software on a cluster, or to change the configuration of applications on the cluster. HDInsight provides a configuration option called **Script Action** that invokes custom scripts, which define the customization to be performed on the cluster. These scripts can be used to customize a cluster *as it is being deployed*.  

HDInsight clusters can be customized in a variety of other ways as well such as including additional storage accounts, changing the hadoop configuration files (core-site.xml, hive-site.xml, etc.), or by adding shared libraries (e.g. Hive, Oozie) into common locations in the cluster. These customization can be done using HDInsight PowerShell, .NET SDK, or the Azure Management Portal. For more information, see [Provision Hadoop clusters in HDInsight using custom options][hdinsight-provision-cluster].



> [WACOM.NOTE] Using Script Action to customize a cluster is supported only on HDInsight cluster version 3.1. For more information on HDInsight cluster versions, see [HDInsight cluster versions](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/).



## In this article

- [How is the script used while cluster creation?](#lifecycle)
- [How to write a script for cluster customization?](#writescript)
- [How to use Script action to customize cluster?](#howto)
- [Cluster customization examples](#example)


## <a name="lifecycle"></a>How is the script used while cluster creation?

Using Script Action, an HDInsight cluster can be customized only while it is in the process of being created. As an HDInsight cluster is being created, it goes through the following stages:

![HDInsight cluster customization and stages during cluster provisioning][img-hdi-cluster-states] 

The script is invoked after the cluster creation completes the *HDInsightConfiguration* stage and before the *ClusterOperational* stage. Each cluster can accept multiple script actions that are invoked in the order they are specified.

> [WACOM.NOTE] The option to customize HDInsight clusters is available as part of the standard Azure HDInsight subscriptions at no extra charge.

### How does the script work?

You have the option of running the script on either the headnode, the worker nodes, or both. When the script is running, the cluster enters the *ClusterCustomization* stage. At this stage, the script is run under the system admin account, in parallel on all the specified nodes in the cluster, and provides full admin privileges on the nodes. 

> [WACOM.NOTE] Because you have have admin privileges on the cluster nodes during the *Cluster customization* stage, you can use the script to perform operations like stopping and starting services, including Hadoop-related services. So, as part of the script, you must ensure that the Ambari services, and other Hadoop-related services are up and running before the script finishes running. These services are required to successfully ascertain the health and state of the cluster while it is being created. If you change any configuration on the cluster that affects these services, you must use the helper functions that are provided. For more information about helper functions, see [Script Action development with HDInsight][hdinsight-write-script].

The output as well as the error logs for the script are stored in the default storage account you specified for the cluster. The logs are stored in a table with the name *u<\cluster-name-fragment><\time-stamp>setuplog*. These are aggregate logs from the script run on all the nodes (headnode and worker nodes) in the cluster.

## <a name="writescript"></a>How to write a script for cluster customization?

For information on how to write a cluster customization script, see [Script Action development with HDInsight][hdinsight-write-script]. 

## <a name="howto"></a>How to use Script action to customize cluster?

You can use Script Action from the Azure Management Portal, PowerShell cmdlets, or HDInsight .NET SDK to customize a cluster. 

**From the Management Portal**

1. Start provisioning a cluster using the **CUSTOM CREATE** option, as described at [Provisioning a cluster using custom options](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-provision-clusters/#portal). 
2. On the Script Actions page of the wizard, click **add script action** to provide details about the Script Action, as shown below:

	![Use Script Action to customize a cluster](./media/hdinsight-hadoop-customize-cluster/HDI.CustomProvision.Page6.png "Use Script Action to customize a cluster")
	
	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Name</td>
			<td>Specify a name for the script action.</td></tr>
		<tr><td>Script URI</td>
			<td>Specify the URI to the script that is invoked to customize the cluster.</td></tr>
		<tr><td>Node Type</td>
			<td>Specifies the nodes on which the customization script is run. You can choose <b>All Nodes</b>, <b>Head nodes only</b>, or <b>Worker nodes</b> only.
		<tr><td>Parameters</td>
			<td>Specify the parameters, if required by the script.</td></tr>
	</table>

	You can add more than one script action to install multiple components on the cluster. After you have added the scripts, click the checkmark to start provisioning the cluster. 
  
**Using the PowerShell cmdlets**

Use HDInsight PowerShell commands to run a single Script Action or multiple Script Actions. You can use the **<a href = "http://msdn.microsoft.com/en-us/library/dn858088.aspx" target="_blank">Add-AzureHDInsightScriptAction</a>** cmdlet to invoke custom scripts. To use these cmdlets, you must have Azure PowerShell installed and configured. For information on configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell][powershell-install-configure].

Use the following PowerShell command to run a single Script Action when deploying an HDInsight cluster:

	$config = New-AzureHDInsightClusterConfig –ClusterSizeInNodes 4

	$config = Add-AzureHDInsightScriptAction -Config $config –Name MyScriptActionName –Uri http://uri.to/scriptaction.ps1 –Parameters MyScriptActionParameter -ClusterRoleCollection HeadNode,DataNode

	New-AzureHDInsightCluster -Config $config

Use the following PowerShell command to run multiple Script Actions when deploying an HDInsight cluster:

	$config = New-AzureHDInsightClusterConfig –ClusterSizeInNodes 4

	$config = Add-AzureHDInsightScriptAction -Config $config –Name MyScriptActionName1 –Uri http://uri.to/scriptaction1.ps1 –Parameters MyScriptAction1Parameters -ClusterRoleCollection HeadNode,DataNode | Add-AzureHDInsightScriptAction -Config $config –Name MyScriptActionName2 –Uri http://uri.to/scriptaction2.ps1 -Parameters MyScriptAction2Parameters -ClusterRoleCollection HeadNode

	New-AzureHDInsightCluster -Config $config

**Using the HDInsight .NET SDK**

HDInsight .NET SDK provides a <a href="http://msdn.microsoft.com/en-us/library/microsoft.windowsazure.management.hdinsight.clusterprovisioning.data.scriptaction.aspx" target="_blank">ScriptAction</a> class to invoke custom scripts. To use the HDInsight .NET SDK:

1. Create a Visual Studio application, and then install the SDK from Nuget. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**. Run the following commands in the console to install the package:

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

2. Create a cluster using the SDK. For instructions, see [Provision HDInsight cluster using .NET SDK](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-provision-clusters/#sdk).

3. Use the **ScriptAction** class to invoke a custom script as shown below:

		
		var clusterInfo = new ClusterCreateParameters()
		{
			// PROVIDE THE CLUSTER INFORMATION LIKE
			// NAME, STORAGE ACCOUNT, CREDENTIALS,
			// CLUSTER SIZE, and VERSION		    
			...
			...
		};

		// ADD THE SCRIPT ACTION TO INSTALL SPARK
		clusterInfo.ConfigActions.Add(new ScriptAction(
	  		"MyScriptActionName", // Name of the config action
	  		new ClusterNodeType[] { ClusterNodeType.HeadNode }, // List of nodes to install component on
	  		new Uri("http://uri.to/scriptaction.ps1"), // Location of the script to install the component
	  		"MyScriptActionParameter" //Parameters, if any, required by the script.
		));


## <a name="example"></a>Cluster customization examples

To get you started, HDInsight provides sample scripts to install the following components on an HDInsight cluster.

- **Install Spark**. See [Install Spark on HDInsight clusters][hdinsight-install-spark].
- **Install R**. See [Install R on HDInsight clusters][hdinsight-install-r].
- **Install Solr**. [Install and use Solr on HDInsight clusters](../hdinsight-hadoop-solr-install)
- **Install Giraph**. [Install and use Giraph on HDInsight clusters](../hdinsight-hadoop-giraph-install)


## See also##
[Provision Hadoop clusters in HDInsight using custom options][hdinsight-provision-cluster] provides instructions on how to provision an HDInsight cluster using other custom options.

[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-install-r]: ../hdinsight-hadoop-r-scripts/
[hdinsight-write-script]: ../hdinsight-hadoop-script-actions/
[hdinsight-provision-cluster]: ../hdinsight-provision-clusters/
[powershell-install-configure]: ../install-configure-powershell/


[img-hdi-cluster-states]: ./media/hdinsight-hadoop-customize-cluster/HDI-Cluster-state.png "Stages during cluster provisioning"
