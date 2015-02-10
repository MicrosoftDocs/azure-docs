<properties 
	pageTitle="Script Action Development with HDInsight| Azure" 
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
	ms.date="12/19/2014" 
	ms.author="bradsev"/> 

# Script Action Development with HDInsight 

Script Actions provide Azure HDInsight functionality that is used to install additional software running on an Hadoop cluster or to change the configuration of applications installed on a cluster. Script Actions are scripts that run on the cluster nodes when HDInsight clusters are deployed and they are executed once nodes in the cluster complete HDInsight configuration. The script action is executed under system admin account privileges and provides full access rights to the cluster nodes. Each cluster can be provided with a list of script actions to be executed and that will be executed in the order in which they are specified.

Script Action can be deployed from Azure PowerShell or by using the HDInsight .NET SDK.  For more information, see [Customize HDInsight cluster using Script Actions][hdinsight-cluster-customize].


## In this article

- [Best practices for script development](#bestPracticeScripting)
- [Helper methods for custom scripts](#helpermethods)
- [Checklist for deploying a Script Action](#deployScript)
- [How to run a Script Action](#runScriptAction)
- [Custom script samples](#sampleScripts) 
- [How to test your custom script with the HDInsight Emulator](#testScript)
- [How to debug your custom script](#debugScript)
- [See also](#seeAlso)


## <a name="bestPracticeScripting"></a>Best practices for script development

When you develop a custom script for an HDInsight cluster, there are several best practices to keep in mind:

* [Check for the Hadoop version](#bPS1)
* [Provide stable links to script resources](#bPS2)
* [The cluster customization script must be idempotent](#bPS3)
* [The location where the custom components are installed ](#bPS4)
* [Cluster architecture: ensure high availability](#bPS5)
* [Configure the custom components to use WASB](#bPS6)

### <a name="bPS1"></a>Check for the Hadoop version
Only HDInsight version 3.1 (Hadoop 2.4) and above support using Script Action to install custom components on a cluster. In your custom script, you must use the **Get-HDIHadoopVersion** helper method to check the Hadoop version before proceeding with performing other tasks in the script.


### <a name="bPS2"></a>Provide stable links to script resources 
Users should make sure that all of the scripts and other artifacts used in the customization of a cluster remain available throughout the lifetime of the cluster and that the versions of these files do not change for the duration. These resources are required if the re-imaging of nodes in the cluster is required. The best practice is to download and archive everything in a storage account that the user controls. This can be the default storage account or any of the additional storage accounts specified at the time of deployment for a customized cluster.
In the Spark and R customized cluster samples provided in the documentation, for example, we have made a local copy of the resources in this storage account: https://hdiconfigactions.blob.core.windows.net/.


### <a name="bPS3"></a>The cluster customization script must be idempotent
You must expect that the nodes of an HDInsight cluster will be re-imaged during the cluster lifetime. The cluster customization script is run whenever a cluster is re-imaged. This script must be designed to be idempotent in the sense that upon re-imaging the script should ensure that the cluster is returned to the same customized state that it was in just after the script ran for the first time when the cluster was initially created. For example, if a custom script installed an application at D:\AppLocation on its first run, then on each subsequent run, when re-imaging, the script should check whether the application exists at the D:\AppLocation location before proceeding with other steps in the script.


### <a name="bPS4"></a>The location where the custom components are installed 
When cluster nodes are re-imaged, the C:\ resource drive and D:\ system drive can be re-formatted resulting in the loss of data and applications that had been installed on those drives. This could also happen if an Azure VM node which is part of the cluster goes down and is replaced by a new node. You can install components on the D:/ drive or in the C:\apps location on the cluster. All other locations on the C:\ drive are reserved. Specify the location where applications or libraries are to be installed in the cluster customization script. 


### <a name="bPS5"></a>Cluster architecture: ensure high availability

HDInsight has an active-passive architecture for high availability, in which one headnode is in active mode (where the HDInsight services are running) and the other headnode is in standby mode (in which HDInsight services are not running). The nodes switch active and passive modes if HDInsight services are interrupted. If a Script Action is used to install services on both head nodes for high availability, note that the HDInsight failover mechanism will not be able to automatically failover these user installed services. So user installed services on HDInsight head nodes that are expected to be highly available must either have their own failover mechanism if in active-passive mode or are required to be in active-active mode. 

An HDInsight Script Action command runs on both headnodes when the headnode role is specified as a value in the *ClusterRoleCollection* parameter (documented below in the section [How to run a Script Action](#runScriptAction)). So when you design a custom script, make sure that your script is aware of this setup. You should not run into problems where the same services are installed and started on both of the headnodes and they end up competing with each other. Also, be aware that data will be lost during re-images and so that software installed using Script Actions has to be resilient to such events. Applications should be designed to work with highly available data that is distributed across many nodes. Note that as many as 1/5 of the nodes in a cluster can be re-imaged at the same time.


### <a name="bPS6"></a>Configure the custom components to use WASB
The custom components that you install on the cluster nodes might have a default configuration to use HDFS storage. You should change the configuration to use Azure Storage Blob (WASB) instead. On a cluster re-image, the HDFS file system gets formatted and you would lose any data that is stored there. Using WASB instead ensures that your data will be retained.

## <a name="helpermethods"></a>Helper methods for custom scripts 

Script Action provides the following helper methods that you can use while writing custom scripts.

Helper method | Description
-------------- | -----------
**Save-HDIFile** | Download a file from the specified URI to a location on the local disk that is associated with the Azure VM node assigned to the cluster
**Expand-HDIZippedFile** | Unzip a zipped file
**Invoke-HDICmdScript** | Run a script from cmd.exe
**Write-HDILog** | Write output from the custom script used for script action
**Get-Services** | Get a list of services running on the machine where the script executes
**Get-Service** | With the specific service name as input, this returns detailed information for a specific service (service name, process ID, state, etc.) on the machine where the script executes
**Get-HDIServices** | Get a list of HDInsight services running on the computer where the script executes
**Get-HDIService** | With the specific HDInsight service name as input, this returns detailed information for a specific service (service name, process ID, state, etc.) on the machine where the script executes
**Get-ServicesRunning** | Get a list of services that are running on the computer where the script executes
**Get-ServiceRunning** | Check if a specific service (by name) is running on the computer where the script executes
**Get-HDIServicesRunning** | Get a list of HDInsight services running on the computer where the script executes
**Get-HDIServiceRunning** | Check if a specific HDInsight service (by name) is running on the computer where the script executes
**Get-HDIHadoopVersion** | Get the version of Hadoop installed on the computer where the script executes
**Test-IsHDIHeadNode** | Check if the computer where the script executes is a headnode
**Test-IsActiveHDIHeadNode** | Check if the computer where the script executes is an active headnode
**Test-IsHDIDataNode** | Check if the computer where the script executes is a datanode
**Edit-HDIConfigFile** | Edit the config files hive-site.xml, core-site.xml, hdfs-site.xml, mapred-site.xml, or yarn-site.xml
 

## <a name="deployScript"></a>Checklist for deploying a Script Action
Here are the steps we took when preparing to deploy these scripts:

1. Put the files that contain the custom scripts in a place that is accessible by the cluster nodes during deployment. This can be any of the default or additional storage accounts specified at the time of cluster deployment, or any other publicly accessible storage container.
2. Add checks into scripts to make sure that they execute idempotently, so that the script can be executed multiple times on the same node.
3. Use the **Write-Output** Powershell cmdlet to print to STDOUT as well as STDERR. Do not use **Write-Host**.
4. Use a temporary file folder, such as $env:TEMP to keep the downloaded file used by the scripts and then clean them up after scripts have executed.
5. Install custom software only at following locations: D:/ or C:/apps. Other locations on the C: drive should not be used as they are reserved. Note that installing files on the C: drive outside of C:/apps folder may result in setup failures during re-images of the node.
6. In the event that OS level settings or Hadoop service configuration files were changed, you may want to restart HDInsight services so that they can pick up any OS level settings, such as the environment variables set in the scripts.


## <a name="runScriptAction"></a>How to run a Script Action

You can use Script Actions to customize HDInsight clusters using the Azure Management Portal, PowerShell, or the HDInsight .NET SDK. For instructions, see [How to use Script Action](./hdinsight-hadoop-customize-cluster/#howto). 


## <a name="sampleScripts"></a>Custom script samples

Microsoft provides sample scripts to install components on an HDInsight cluster. The sample scripts and instructions on how to use them are available at the links below:

- [Install and use Spark 1.0 on HDInsight clusters][hdinsight-install-spark]
- [Install and use R on HDInsight Hadoop clusters][hdinsight-r-scripts]
- [Install and use Solr on HDInsight clusters](../hdinsight-hadoop-solr-install)
- [Install and use Giraph on HDInsight clusters](../hdinsight-hadoop-giraph-install)  

> [AZURE.NOTE] The sample script works only with HDInsight cluster version 3.1 or above. For more information on HDInsight cluster versions, see [HDInsight cluster versions](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/).

## <a name="testScript"></a>How to test your custom script with the HDInsight Emulator

A straight-forward way to test a custom script before using it in HDInsight Script Action command is to run on the HDInsight Emulator. the Emulator can be installed locally or on an Azure IaaS Windows Server 2012 R2 virtual machine or on a local machine and observe if the script behaves correctly. Note that the Windows Server 2012 R2 is the same VM that HDInsight uses for its nodes.

This section outlines the procedure for using the HDInsight Emulator locally for testing purposes, but the procedure for using a VM is similar.

**Install the HDInsight Emulator**: To run Script Actions locally, you must have the HDInsight Emulator installed. For instructions on how to install it, see [Get started with the HDInsight Emulator](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-get-started-emulator/)

**Set the execution policy for Azure PowerShell:** Open Microsoft Azure PowerShell and run (as administrator) following command to set the execution policy to the *LocalMachine* and to be *Unrestricted*.
 
	Set-ExecutionPolicy Unrestricted –Scope LocalMachine

We need this policy to be unrestricted as scripts are not signed.

**Download the Script Action** that you want to run to a local destination. The Spark and R scripts that can be run locally are available, for example, from the following locations:

* https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv02/spark-installer-v02.ps1
* https://hdiconfigactions.blob.core.windows.net/rconfigactionv02/r-installer-v02.ps1

**Run the Action Scripts**: Open a new Azure PowerShell in admin mode and run the Spark or R installation script from the local location where they were saved.

**Usage examples**
When using the Spark and R clusters, data files needed may not be present in the HDInsight Emulator and so you may need to upload relevant .txt files that contain data to some path in HDFS and then use that path to access the data. For example:

	val file = sc.textFile("/example/data/gutenberg/davinci.txt")


Note that in some cases a custom script may actually depend on HDInsight components, such as detecting whether certain Hadoop services are up. In this case, you will have to test your custom scripts by deploying them on an actual HDInsight cluster.


## <a name="debugScript"></a>How to debug your custom script

The script error logs are stored, along with other output, in the default storage account that you specified for the cluster at its creation. The logs are stored in a table with the name *u<\cluster-name-fragment><\time-stamp>setuplog*. These are aggregated logs that have records from all of the nodes (headnode and worker nodes) on which the script runs in the cluster.

You can also remote into the cluster nodes to see the both the STDOUT and STDERR of custom scripts. The logs on each node are specific only to that node and are logged into **C:\HDInsightLogs\DeploymentAgent.log**. These log files record all outputs from the custom script. An example log snippet for a Spark Script Action looks like this:

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

In the event that an execution failure occurs, the output describing it will also be contained in this log file. The information provided in these logs should be helpful when debugging script problems that may arise.


## <a name="seeAlso"></a>See also

[Customize HDInsight clusters using Script Action][hdinsight-cluster-customize] 


[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-cluster-customize]: ../hdinsight-hadoop-customize-cluster
[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-r-scripts]: ../hdinsight-hadoop-r-scripts/
[powershell-install-configure]: ../install-configure-powershell/