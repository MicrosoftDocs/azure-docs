<properties 
	pageTitle="Customize HDInsight Clusters using Script Action| Azure" 
	description="Learn how to customize HDInsight clusters using Script Action." 
	services="hdinsight" 
	documentationCenter="" 
	authors="nitinme" 
	manager="paulettm" 
	editor="cgronlun"/> 

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/03/2015" 
	ms.author="nitinme"/> 

# Customize HDInsight clusters by using Script Action

You can customize an Azure HDInsight cluster to install additional software on a cluster, or to change the configuration of applications on the cluster. HDInsight provides a configuration option called **Script Action** that invokes custom scripts, which define the customization to be performed on the cluster. These scripts can be used to customize a cluster *as it is being deployed*.  

HDInsight clusters can be customized in a variety of other ways as well, such as including additional Azure Storage accounts, changing the Hadoop configuration files (core-site.xml, hive-site.xml, etc.), or adding shared libraries (e.g., Hive, Oozie) into common locations in the cluster. These customizations can be done through Azure PowerShell, the Azure HDInsight .NET SDK, or the Azure portal. For more information, see [Provision Hadoop clusters in HDInsight using custom options][hdinsight-provision-cluster].



> [AZURE.NOTE] Using Script Action to customize a cluster is supported only on HDInsight cluster version 3.1. For more information on HDInsight cluster versions, see [HDInsight cluster versions](hdinsight-component-versioning.md).


## <a name="lifecycle"></a>How the script is used during cluster creation

Using Script Action, you can customize an HDInsight cluster only while it is in the process of being created. As an HDInsight cluster is being created, it goes through the following stages:

![HDInsight cluster customization and stages during cluster provisioning][img-hdi-cluster-states] 

The script is invoked after the cluster creation completes the **HDInsightConfiguration** stage and before it begins the **ClusterOperational** stage. Each cluster can accept multiple script actions that are invoked in the order in which they are specified.

> [AZURE.NOTE] The option to customize HDInsight clusters is available as part of the standard Azure HDInsight subscriptions at no extra charge.

### How the script works

You have the option of running the script on either the head node, the worker nodes, or both. When the script is running, the cluster enters the **ClusterCustomization** stage. At this stage, the script is run under the system admin account, in parallel on all the specified nodes in the cluster, and provides full admin privileges on the nodes. 

> [AZURE.NOTE] Because you have admin privileges on the cluster nodes during the **ClusterCustomization** stage, you can use the script to perform operations like stopping and starting services, including Hadoop-related services. So, as part of the script, you must ensure that the Ambari services and other Hadoop-related services are up and running before the script finishes running. These services are required to successfully ascertain the health and state of the cluster while it is being created. If you change any configuration on the cluster that affects these services, you must use the helper functions that are provided. For more information about helper functions, see [Script Action development with HDInsight][hdinsight-write-script].

The output and the error logs for the script are stored in the default Storage account you specified for the cluster. The logs are stored in a table with the name **u<\cluster-name-fragment><\time-stamp>setuplog**. These are aggregate logs from the script run on all the nodes (head node and worker nodes) in the cluster.

## <a name="writescript"></a>How to write a script for cluster customization

For information on how to write a cluster customization script, see [Script Action development with HDInsight][hdinsight-write-script]. 

## <a name="howto"></a>How to use Script Action to customize a cluster

You can use Script Action from the Azure portal, Azure PowerShell cmdlets, or the HDInsight .NET SDK to customize a cluster. 

**Using the Azure portal**

1. Start provisioning a cluster by using the **CUSTOM CREATE** option, as described at [Provisioning a cluster using custom options](hdinsight-provision-clusters.md#portal). 
2. On the **Script Actions** page of the wizard, click **add script action** to provide details about the script action, as shown below:

	![Use Script Action to customize a cluster](./media/hdinsight-hadoop-customize-cluster/HDI.CustomProvision.Page6.png "Use Script Action to customize a cluster")
	
	<table border='1'>
		<tr><th>Property</th><th>Value</th></tr>
		<tr><td>Name</td>
			<td>Specify a name for the script action.</td></tr>
		<tr><td>Script URI</td>
			<td>Specify the URI to the script that is invoked to customize the cluster.</td></tr>
		<tr><td>Node Type</td>
			<td>Specify the nodes on which the customization script is run. You can choose <b>All Nodes</b>, <b>Head nodes only</b>, or <b>Worker nodes only</b>.
		<tr><td>Parameters</td>
			<td>Specify the parameters, if required by the script.</td></tr>
	</table>

	You can add more than one script action to install multiple components on the cluster. After you have added the scripts, click the checkmark to start provisioning the cluster. 
  
**Using Azure PowerShell cmdlets**

Use Azure PowerShell commands for HDInsight to run a single script action or multiple script actions. You can use the **<a href = "http://msdn.microsoft.com/library/dn858088.aspx" target="_blank">Add-AzureHDInsightScriptAction</a>** cmdlet to invoke custom scripts. To use these cmdlets, you must have Azure PowerShell installed and configured. For information on configuring a workstation to run Azure PowerShell cmdlets for HDInsight, see [Install and configure Azure PowerShell][powershell-install-configure].

Use the following Azure PowerShell commands to run a single script action when deploying an HDInsight cluster:

	$config = New-AzureHDInsightClusterConfig –ClusterSizeInNodes 4

	$config = Add-AzureHDInsightScriptAction -Config $config –Name MyScriptActionName –Uri http://uri.to/scriptaction.ps1 –Parameters MyScriptActionParameter -ClusterRoleCollection HeadNode,DataNode

	New-AzureHDInsightCluster -Config $config

Use the following Azure PowerShell commands to run multiple script actions when deploying an HDInsight cluster:

	$config = New-AzureHDInsightClusterConfig –ClusterSizeInNodes 4

	$config = Add-AzureHDInsightScriptAction -Config $config –Name MyScriptActionName1 –Uri http://uri.to/scriptaction1.ps1 –Parameters MyScriptAction1Parameters -ClusterRoleCollection HeadNode,DataNode | Add-AzureHDInsightScriptAction -Config $config –Name MyScriptActionName2 –Uri http://uri.to/scriptaction2.ps1 -Parameters MyScriptAction2Parameters -ClusterRoleCollection HeadNode

	New-AzureHDInsightCluster -Config $config

**Using the HDInsight .NET SDK**

The HDInsight .NET SDK provides a <a href="http://msdn.microsoft.com/library/microsoft.windowsazure.management.hdinsight.clusterprovisioning.data.scriptaction.aspx" target="_blank">ScriptAction</a> class to invoke custom scripts. To use the HDInsight .NET SDK:

1. Create a Visual Studio application, and then install the SDK from NuGet. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**. Run the following command in the console to install the package:

		Install-Package Microsoft.WindowsAzure.Management.HDInsight

2. Create a cluster by using the SDK. For instructions, see [Provision HDInsight cluster using .NET SDK](hdinsight-provision-clusters.md#sdk).

3. Use the **ScriptAction** class to invoke a custom script as shown below:

		
		var clusterInfo = new ClusterCreateParameters()
		{
			// Provide the cluster information, like
			// name, Storage account, credentials,
			// cluster size, and version		    
			...
			...
		};

		// Add the script action to install Spark
		clusterInfo.ConfigActions.Add(new ScriptAction(
	  		"MyScriptActionName", // Name of the config action
	  		new ClusterNodeType[] { ClusterNodeType.HeadNode }, // List of nodes to install the component on
	  		new Uri("http://uri.to/scriptaction.ps1"), // Location of the script to install the component
	  		"MyScriptActionParameter" //Parameters, if any, required by the script
		));


## <a name="example"></a>Cluster customization examples

To get you started, HDInsight provides sample scripts to install the following components on an HDInsight cluster:

- **Install Spark** - See [Install and use Spark on HDInsight clusters][hdinsight-install-spark].
- **Install R** - See [Install and use R on HDInsight clusters][hdinsight-install-r].
- **Install Solr** - See [Install and use Solr on HDInsight clusters](hdinsight-hadoop-solr-install.md).
- **Install Giraph** - See [Install and use Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install.md).

## <a name="support"></a>Support for open-source software used on HDInsight clusters
The Microsoft Azure HDInsight service is a flexible platform that enables you to build big-data applications in the cloud by using an ecosystem of open-source technologies formed around Hadoop. Microsoft Azure provides a general level of support for open-source technologies, as discussed in the **Support Scope** section of the <a href="http://azure.microsoft.com/support/faq/" target="_blank">Azure Support FAQ website</a>. The HDInsight service provides an additional level of support for some of the components, as described below.

There are two types of open-source components that are available in the HDInsight service:

- **Built-in components** - These components are pre-installed on HDInsight clusters and provide core functionality of the cluster. For example, YARN ResourceManager, the Hive query language (HiveQL), and the Mahout library belong to this category. A full list of cluster components is available in <a href="http://azure.microsoft.com/documentation/articles/hdinsight-component-versioning/" target="_blank">What's new in the Hadoop cluster versions provided by HDInsight?</a>.
- **Custom components** - You, as a user of the cluster, can install or use in your workload any component available in the community or created by you.

Built-in components are fully supported, and Microsoft Support will help to isolate and resolve issues related to these components.

Custom components receive commercially reasonable support to help you to further troubleshoot the issue. This might result in resolving the issue or asking you to engage available channels for the open-source technologies where deep expertise for that technology is found. For example, there are many community sites that can be used, like: <a href ="https://social.msdn.microsoft.com/Forums/azure/home?forum=hdinsight" target="_blank">MSDN forum for HDInsight</a> and <a href="http://stackoverflow.com" target="_blank">Stack Overflow</a>. Also, Apache projects have project sites on <a href="http://apache.org" target="_blank">Apache.org</a>; for example, <a href="http://hadoop.apache.org/" target="_blank">Hadoop</a> and <a href="http://spark.apache.org/" target="_blank">Spark</a>.

The HDInsight service provides several ways to use custom components. Regardless of how a component is used or installed on the cluster, the same level of support applies. Below is a list of the most common ways that custom components can be used on HDInsight clusters:

1. Job submission - Hadoop or other types of jobs that execute or use custom components can be submitted to the cluster.
2. Cluster customization - During cluster creation, you can specify additional settings and custom components that will be installed on the cluster nodes.
3. Samples - For popular custom components, Microsoft and others may provide samples of how these components can be used on the HDInsight clusters. These samples are provided without support.


## See also##
[Provision Hadoop clusters in HDInsight using custom options][hdinsight-provision-cluster] provides instructions on how to provision an HDInsight cluster by using other custom options.

[hdinsight-install-spark]: hdinsight-hadoop-spark-install.md
[hdinsight-install-r]: hdinsight-hadoop-r-scripts.md
[hdinsight-write-script]: hdinsight-hadoop-script-actions.md
[hdinsight-provision-cluster]: hdinsight-provision-clusters.md
[powershell-install-configure]: install-configure-powershell.md


[img-hdi-cluster-states]: ./media/hdinsight-hadoop-customize-cluster/HDI-Cluster-state.png "Stages during cluster provisioning"
