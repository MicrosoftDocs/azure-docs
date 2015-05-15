<properties 
	pageTitle="Script Action Development with HDInsight | Microsoft Azure" 
	description="Learn how to customize Hadoop clusters with Script Action." 
	services="hdinsight" 
	documentationCenter="" 
	authors="bradsev" 
	manager="paulettm" 
	editor="cgronlun"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="bradsev"/> 

# Script Action development with HDInsight 

Script Action provides Azure HDInsight functionality that is used to install additional software running on a Hadoop cluster or to change the configuration of applications installed on a cluster. Script actions are scripts that run on the cluster nodes when HDInsight clusters are deployed, and they are executed once nodes in the cluster complete HDInsight configuration. A script action is executed under system admin account privileges and provides full access rights to the cluster nodes. Each cluster can be provided with a list of script actions to be executed in the order in which they are specified.

Script Action can be deployed from Azure PowerShell or by using the HDInsight .NET SDK.  For more information, see [Customize HDInsight clusters using Script Action][hdinsight-cluster-customize].



## <a name="bestPracticeScripting"></a>Best practices for script development

When you develop a custom script for an HDInsight cluster, there are several best practices to keep in mind:

* [Check for the Hadoop version](#bPS1)
* [Provide stable links to script resources](#bPS2)
* [Ensure that the cluster customization script is idempotent](#bPS3)
* [Install custom components in the optimal location ](#bPS4)
* [Ensure high availability of the cluster architecture](#bPS5)
* [Configure the custom components to use Azure Blob storage](#bPS6)

### <a name="bPS1"></a>Check for the Hadoop version
Only HDInsight version 3.1 (Hadoop 2.4) and above support using Script Action to install custom components on a cluster. In your custom script, you must use the **Get-HDIHadoopVersion** helper method to check the Hadoop version before proceeding with performing other tasks in the script.


### <a name="bPS2"></a>Provide stable links to script resources 
Users should make sure that all of the scripts and other artifacts used in the customization of a cluster remain available throughout the lifetime of the cluster and that the versions of these files do not change for the duration. These resources are required if the re-imaging of nodes in the cluster is required. The best practice is to download and archive everything in a Storage account that the user controls. This can be the default Storage account or any of the additional Storage accounts specified at the time of deployment for a customized cluster.
In the Spark and R customized cluster samples provided in the documentation, for example, we have made a local copy of the resources in this Storage account: https://hdiconfigactions.blob.core.windows.net/.


### <a name="bPS3"></a>Ensure that the cluster customization script is idempotent
You must expect that the nodes of an HDInsight cluster will be re-imaged during the cluster lifetime. The cluster customization script is run whenever a cluster is re-imaged. This script must be designed to be idempotent in the sense that upon re-imaging, the script should ensure that the cluster is returned to the same customized state that it was in just after the script ran for the first time when the cluster was initially created. For example, if a custom script installed an application at D:\AppLocation on its first run, then on each subsequent run, upon re-imaging, the script should check whether the application exists at the D:\AppLocation location before proceeding with other steps in the script.


### <a name="bPS4"></a>Install custom components in the optimal location 
When cluster nodes are re-imaged, the C:\ resource drive and D:\ system drive can be re-formatted, resulting in the loss of data and applications that had been installed on those drives. This could also happen if an Azure virtual machine (VM) node that is part of the cluster goes down and is replaced by a new node. You can install components on the D:\ drive or in the C:\apps location on the cluster. All other locations on the C:\ drive are reserved. Specify the location where applications or libraries are to be installed in the cluster customization script. 


### <a name="bPS5"></a>Ensure high availability of the cluster architecture

HDInsight has an active-passive architecture for high availability, in which one head node is in active mode (where the HDInsight services are running) and the other head node is in standby mode (in which HDInsight services are not running). The nodes switch active and passive modes if HDInsight services are interrupted. If a script action is used to install services on both head nodes for high availability, note that the HDInsight failover mechanism will not be able to automatically fail over these user-installed services. So user-installed services on HDInsight head nodes that are expected to be highly available must either have their own failover mechanism if in active-passive mode or be in active-active mode. 

An HDInsight Script Action command runs on both head nodes when the head-node role is specified as a value in the *ClusterRoleCollection* parameter (documented below in the section [How to run a script action](#runScriptAction)). So when you design a custom script, make sure that your script is aware of this setup. You should not run into problems where the same services are installed and started on both of the head nodes and they end up competing with each other. Also, be aware that data will be lost during re-imaging, so software installed via Script Action has to be resilient to such events. Applications should be designed to work with highly available data that is distributed across many nodes. Note that as many as 1/5 of the nodes in a cluster can be re-imaged at the same time.


### <a name="bPS6"></a>Configure the custom components to use Azure Blob storage
The custom components that you install on the cluster nodes might have a default configuration to use Hadoop Distributed File System (HDFS) storage. You should change the configuration to use Azure Blob storage instead. On a cluster re-image, the HDFS file system gets formatted and you would lose any data that is stored there. Using Azure Blob storage instead ensures that your data will be retained.

## <a name="helpermethods"></a>Helper methods for custom scripts 

Script Action provides the following helper methods that you can use while writing custom scripts.

Helper method | Description
-------------- | -----------
**Save-HDIFile** | Download a file from the specified Uniform Resource Identifier (URI) to a location on the local disk that is associated with the Azure VM node assigned to the cluster.
**Expand-HDIZippedFile** | Unzip a zipped file.
**Invoke-HDICmdScript** | Run a script from cmd.exe.
**Write-HDILog** | Write output from the custom script used for a script action.
**Get-Services** | Get a list of services running on the machine where the script executes.
**Get-Service** | With the specific service name as input, get detailed information for a specific service (service name, process ID, state, etc.) on the machine where the script executes.
**Get-HDIServices** | Get a list of HDInsight services running on the computer where the script executes.
**Get-HDIService** | With the specific HDInsight service name as input, get detailed information for a specific service (service name, process ID, state, etc.) on the machine where the script executes.
**Get-ServicesRunning** | Get a list of services that are running on the computer where the script executes.
**Get-ServiceRunning** | Check if a specific service (by name) is running on the computer where the script executes.
**Get-HDIServicesRunning** | Get a list of HDInsight services running on the computer where the script executes.
**Get-HDIServiceRunning** | Check if a specific HDInsight service (by name) is running on the computer where the script executes.
**Get-HDIHadoopVersion** | Get the version of Hadoop installed on the computer where the script executes.
**Test-IsHDIHeadNode** | Check if the computer where the script executes is a head node.
**Test-IsActiveHDIHeadNode** | Check if the computer where the script executes is an active head node.
**Test-IsHDIDataNode** | Check if the computer where the script executes is a data node.
**Edit-HDIConfigFile** | Edit the config files hive-site.xml, core-site.xml, hdfs-site.xml, mapred-site.xml, or yarn-site.xml.

## <a name="commonusage"></a>Common usage patterns

This section provides guidance on implementing some of the common usage patterns that you might run into while writing your own custom script.

### Setting environment variables

Often in script action development, you will feel the need to set environment variables. For instance, a most likely scenario is when you download a binary from an external site, install it on the cluster, and add the location of where it is installed to your ‘PATH’ environment variable. The following snippet shows you how to set environment variables in the custom script.

	Write-HDILog "Starting environment variable setting at: $(Get-Date)";
	[Environment]::SetEnvironmentVariable('MDS_RUNNER_CUSTOM_CLUSTER', 'true', 'Machine');

This statement sets the environment variable **MDS_RUNNER_CUSTOM_CLUSTER** to the value 'true' and also sets the scope of this variable to be machine-wide. At times it is important that environment variables are set at the appropriate scope – machine or user. Refer [here](https://msdn.microsoft.com/library/96xafkes(v=vs.110).aspx "here") for more information on setting environment variables.

### Access to locations where the custom scripts are stored

Scripts used to customize a cluster needs to either be in the default storage account for the cluster or in a public read-only container on any other storage account. If your script accesses resources located elsewhere these need to be in a publicly accessible (at least public read-only). For instance you might want to access a file and save it using the SaveFile-HDI command.

	Save-HDIFile -SrcUri 'https://somestorageaccount.blob.core.windows.net/somecontainer/some-file.jar' -DestFile 'C:\apps\dist\hadoop-2.4.0.2.1.9.0-2196\share\hadoop\mapreduce\some-file.jar'

### Throwing exception for failed cluster deployment

If you want to get accurately notified of the fact that cluster customization did not succeed as expected, it is important to throw an exception and fail the cluster provisioning. For instance, you might want to process a file if it exists and handle the error case where the file does not exist. This would ensure that the script exits gracefully and the state of the cluster is correctly known. The following snippet gives an example of how to achieve this:

	If(Test-Path($SomePath)) {
		#Process file in some way
	} else {
		# File does not exist; handle error case
		# Print error message
	exit
	}

## <a name="deployScript"></a>Checklist for deploying a script action
Here are the steps we took when preparing to deploy these scripts:

1. Put the files that contain the custom scripts in a place that is accessible by the cluster nodes during deployment. This can be any of the default or additional Storage accounts specified at the time of cluster deployment, or any other publicly accessible storage container.
2. Add checks into scripts to make sure that they execute idempotently, so that the script can be executed multiple times on the same node.
3. Use the **Write-Output** Azure PowerShell cmdlet to print to STDOUT as well as STDERR. Do not use **Write-Host**.
4. Use a temporary file folder, such as $env:TEMP, to keep the downloaded file used by the scripts and then clean them up after scripts have executed.
5. Install custom software only at D:\ or C:\apps. Other locations on the C: drive should not be used as they are reserved. Note that installing files on the C: drive outside of the C:\apps folder may result in setup failures during re-images of the node.
6. In the event that OS-level settings or Hadoop service configuration files were changed, you may want to restart HDInsight services so that they can pick up any OS-level settings, such as the environment variables set in the scripts.


## <a name="runScriptAction"></a>How to run a script action

You can use Script Actions to customize HDInsight clusters by using the Azure portal, Azure PowerShell, or the HDInsight .NET SDK. For instructions, see [How to use Script Action](../hdinsight-hadoop-customize-cluster/#howto). 


## <a name="sampleScripts"></a>Custom script samples

Microsoft provides sample scripts to install components on an HDInsight cluster. The sample scripts and instructions on how to use them are available at the links below:

- [Install and use Spark on HDInsight clusters][hdinsight-install-spark]
- [Install and use R on HDInsight Hadoop clusters][hdinsight-r-scripts]
- [Install and use Solr on HDInsight clusters](../hdinsight-hadoop-solr-install)
- [Install and use Giraph on HDInsight clusters](../hdinsight-hadoop-giraph-install)  

> [AZURE.NOTE] The sample scripts work only with HDInsight cluster version 3.1 or above. For more information on HDInsight cluster versions, see [HDInsight cluster versions](../hdinsight-component-versioning/).

## <a name="testScript"></a>How to test your custom script with the HDInsight Emulator

A straight-forward way to test a custom script before using it in the HDInsight Script Action command is to run it on the HDInsight Emulator. You can install the HDInsight Emulator locally or on an Azure infrastructure as a service (IaaS) Windows Server 2012 R2 VM or on a local machine and observe if the script behaves correctly. Note that the Windows Server 2012 R2 VM is the same VM that HDInsight uses for its nodes.

This section outlines the procedure for using the HDInsight Emulator locally for testing purposes, but the procedure for using a VM is similar.

**Install the HDInsight Emulator** - To run Script Action locally, you must have the HDInsight Emulator installed. For instructions on how to install it, see [Get started with the HDInsight Emulator](../hdinsight-get-started-emulator/).

**Set the execution policy for Azure PowerShell** - Open Azure PowerShell and run (as administrator) the following command to set the execution policy to *LocalMachine* and to be *Unrestricted*:
 
	Set-ExecutionPolicy Unrestricted –Scope LocalMachine

We need this policy to be unrestricted as scripts are not signed.

**Download the script action** that you want to run to a local destination. The following sample scripts are available to download from the following locations:

* **Spark**. https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1
* **R**. https://hdiconfigactions.blob.core.windows.net/rconfigactionv02/r-installer-v02.ps1
* **Solr**. https://hdiconfigactions.blob.core.windows.net/solrconfigactionv01/solr-installer-v01.ps1
* **Giraph**. https://hdiconfigactions.blob.core.windows.net/giraphconfigactionv01/giraph-installer-v01.ps1

**Run the script action** - Open a new Azure PowerShell window in admin mode and run the Spark or R installation script from the local location where they were saved.

**Usage examples**
When you're using the Spark and R clusters, data files needed may not be present in the HDInsight Emulator. So you may need to upload relevant .txt files that contain data to a path in HDFS and then use that path to access the data. For example:

	val file = sc.textFile("/example/data/gutenberg/davinci.txt")


Note that in some cases a custom script may actually depend on HDInsight components, such as detecting whether certain Hadoop services are up. In this case, you will have to test your custom scripts by deploying them on an actual HDInsight cluster.


## <a name="debugScript"></a>How to debug your custom script

The script error logs are stored, along with other output, in the default Storage account that you specified for the cluster at its creation. The logs are stored in a table with the name *u<\cluster-name-fragment><\time-stamp>setuplog*. These are aggregated logs that have records from all of the nodes (head node and worker nodes) on which the script runs in the cluster.

You can also remote into the cluster nodes to see the both STDOUT and STDERR for custom scripts. The logs on each node are specific only to that node and are logged into **C:\HDInsightLogs\DeploymentAgent.log**. These log files record all outputs from the custom script. An example log snippet for a Spark script action looks like this:

	Microsoft.Hadoop.Deployment.Engine.CustomPowershellScriptCommand; Details : BEGIN: Invoking powershell script https://configactions.blob.core.windows.net/sparkconfigactions/spark-installer.ps1.; 
	Version : 2.1.0.0; 
	ActivityId : 739e61f5-aa22-4254-aafc-9faf56fc2692; 
	AzureVMName : HEADNODE0; 
	IsException : False; 
	ExceptionType : ; 
	ExceptionMessage : ; 
	InnerExceptionType : ; 
	InnerExceptionMessage : ; 
	Exception : ;
	...

	Starting Spark installation at: 09/04/2014 21:46:02 Done with Spark installation at: 09/04/2014 21:46:38;
	
	Version : 2.1.0.0; 
	ActivityId : 739e61f5-aa22-4254-aafc-9faf56fc2692; 
	AzureVMName : HEADNODE0; 
	IsException : False; 
	ExceptionType : ; 
	ExceptionMessage : ; 
	InnerExceptionType : ; 
	InnerExceptionMessage : ; 
	Exception : ;
	...
	
	Microsoft.Hadoop.Deployment.Engine.CustomPowershellScriptCommand; 
	Details : END: Invoking powershell script https://configactions.blob.core.windows.net/sparkconfigactions/spark-installer.ps1.; 
	Version : 2.1.0.0; 
	ActivityId : 739e61f5-aa22-4254-aafc-9faf56fc2692; 
	AzureVMName : HEADNODE0; 
	IsException : False; 
	ExceptionType : ; 
	ExceptionMessage : ; 
	InnerExceptionType : ; 
	InnerExceptionMessage : ; 
	Exception : ;

 
In this log, it is clear that the Spark script action has been executed on the VM named HEADNODE0 and that no exceptions were thrown during the execution.

In the event that an execution failure occurs, the output describing it will also be contained in this log file. The information provided in these logs should be helpful in debugging script problems that may arise.


## <a name="seeAlso"></a>See also

[Customize HDInsight clusters using Script Action][hdinsight-cluster-customize] 


[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-cluster-customize]: ../hdinsight-hadoop-customize-cluster
[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-r-scripts]: ../hdinsight-hadoop-r-scripts/
[powershell-install-configure]: ../install-configure-powershell/
