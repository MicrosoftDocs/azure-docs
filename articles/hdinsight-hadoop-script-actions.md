<properties linkid="customize HDInsight cluster" urlDisplayName="Use Script Actions in HDInsight to customize Hadoop clusters" pageTitle="Script Action Development with HDInsight| Azure" metaKeywords="" description="Learn how to customize Hadoop clusters with Script Action." metaCanonical="" services="hdinsight" documentationCenter="" title="Script Action Development with HDInsight" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/14/2014" ms.author="bradsev" />

# Script Action (Preview) Development with HDInsight 

The Script Action preview provides Azure HDInsight functionality that is used to install additional software or to change the configuration of applications running on an Hadoop cluster using PowerShell scripts. Script Actions are scripts that run on the cluster nodes when HDInsight clusters are deployed and they are executed once nodes in the cluster complete HDInsight configuration. The script action is executed under system admin account privileges and provide full access rights to the cluster nodes. Each cluster can be provided with a list of script actions to execute that will be executed in the order in which they are specified.

Script Action can be deployed from Azure PowerShell or by using the HDInsight .NET SDK.  For more information, see [Customize HDInsight cluster using script action][hdinsight-cluster-customize].


## In this article

- [Best practices for script development](#bestPracticeScripting)
- [Checklist for deploying a Script Action](#deployScript)
- [How to test your custom script](#testScript)
- [How to run a Script Action](#runScriptAction)
- [How to debug your custom script](#debugScript)
- [Custom script samples](#sampleScripts) 
- [See also](#seeAlso)


## <a name="bestPracticeScripting"></a>Best practices for script development

When you develop a custom script for an HDInsight cluster, there are several best practices to keep in mind:

### Provide stable links to script resources 
Users should make sure that all of the scripts and other artifacts used in the customization of a cluster remain available throughout the lifetime of the cluster and that the versions of these files do not change for the duration. These resources are be required if re-imaging of nodes in the cluster is required. The best practice is to download and archive everything in a storage account that the user controls. This can be the default storage account or any of the additional storage accounts specified at the deployment of cluster.
In our Spark and cluster customization samples provided, for example, we have made a local copy of the resources in this storage account: https://hdiconfigactions.blob.core.windows.net/.

### The cluster customization script must be idempotent
You must expect that the nodes of an HDInsight cluster will be re-imaged during the cluster lifetime. The cluster customization script is run whenever a cluster is re-imaged. This script must be designed to be idempotent in the sense that upon re-imaging the script should ensure that the cluster is returned to the same customized state that it was in after the script ran for the first time when the cluster was created. For example, if a custom script installed an application at D:\AppLocation on its first run, then on each subsequent run, when re-imaging, the script should check whether the application exists at the D:\AppLocation location before proceeding with other steps in the script.

###The location where the custom components are installed 
When cluster nodes are re-imaged, the C:\ (resource drive) and D:\ (system drive) can be re-formatted resulting in the loss of data and applications that are installed on those drives. This could also happen if an Azure VM node which is part of the cluster goes down and is replaced by a new node. You can install components on the D:/ drive or in the C:\apps location on the cluster. All other locations on the C:\ drive are reserved for system files. The location where you want to install any applications or libraries is specified in the cluster customization script. 


###Cluster Architecture
To ensure high availability, HDInsight has, by default, two headnodes: one in active mode (in which HDInsight services  are running) and the other in standby mode (in which HDInsight services are not running). They will switch mode if HDInsight services are interrupted. HDInsight script action command runs on both headnodes when the headnode role is specified in the *ClusterRoleCollection* parameter (documented above). So when you design your custom scripts, make sure that your script is aware of this setup. For instance, you should not run into problems where same services are installed and started on both of the headnodes and they end up competing with each other. Also, data will be lost during re-images and so software installed using Script Actions has to be resilient such events. Applications should be designed to work with highly available data that is distributed across many nodes and so be able to recover all of the data. Note that as many as 1/5 of the nodes in a cluster can be re-imaged at the same time.

## <a name="deployScript"></a>Checklist for deploying a Script Action
Here are the steps we took when preparing to deploy these scripts:

1. Put files that contain the custom scripts in a place that is accessible by the cluster nodes during deployment.
2. Add checks into scripts to make sure that they execute idempotently, so that the script can be executed multiple times on the same node.
3. Use Write-Output Powershell function to print to STDOUT as well as STDERR.
4. Use a temporary file folder, such as $env:TEMP to keep the downloaded file used by the scripts and then clean them up after scripts have executed.
5. Install custom software only at following locations: D:, C:/apps. Other locations on the C: drive should not be used as they are reserved for system use. Note that installing files on the C: drive outside of C:/apps folder may result in setup failures during re-images of the node.
6. In case OS level settings or Hadoop service configuration files were changed, you may want to restart HDInsight services so they can pick up any OS level settings, such as the environment variables set in the scripts.

## <a name="testScript"></a>How to test your custom script

A straight-forward way to test a custom script before using it in HDInsight Script Action command is to run it manually on an Azure IaaS Windows Server 2012 R2 virtual machine or on a local machine and observe if it behaves correctly. Windows Server 2012 R2 is the same VM that HDInsight uses for its nodes. 

In some cases, a custom script may actually depend on HDInsight components, such as detecting whether certain Hadoop services are up. In this case, you will have to test your custom scripts by deploying them on an actual HDInsight cluster.

## <a name="runScriptAction"></a>How to run a Script Action

This section shows how to use HDInsight PowerShell commands to run a single Script Action and multiple Script Actions. To use these commands, you must have PowerShell installed and configured. For information on configuring a workstation to run HDInsight Powershell cmdlets, see [Install and configure Azure PowerShell][powershell-install-configure].

Use the following PowerShell command to run a single Script Action when deploying an HDInsight cluster:

	$config = New-AzureHDInsightClusterConfig –ClusterSizeInNodes 4

	$config = Add-AzureHDInsightScriptAction -Config $config –Name TestScriptAction –Uri http://test.com/test.ps1 –Parameters test -ClusterRoleCollection HeadNode,DataNode

	New-AzureHDInsightCluster -Config $config

Use the following PowerShell command to run multiple Script Actions when deploying an HDInsight cluster:

	$config = New-AzureHDInsightClusterConfig –ClusterSizeInNodes 4

	$config = Add-AzureHDInsightScriptAction -Config $config –Name TestScriptAction1 –Uri http://test.com/test1.ps1 –Parameters test1 -ClusterRoleCollection HeadNode,DataNode | Add-AzureHDInsightScriptAction -Config $config –Name TestScriptAction2 –Uri http://test.com/test2.ps1 -ClusterRoleCollection HeadNode

	New-AzureHDInsightCluster -Config $config


The inputs for HDInsight script action command **Add-AzureHDInsightScriptAction** are described in the following tables:


<table border="1">
<tr><th>-Config</th><td>The configuration object to which script action information is added.</td></tr>
<tr><td>Aliases</td><td>None</td></tr>
<tr><td>Required?</td><td>True</td></tr>
<tr><td>Position?</td><td>0</td></tr>
<tr><td>Default values</td><td>None</td></tr>
<tr><td>Accept Pipeline Input?</td><td>True (By Value)</td></tr>
<tr><td>Accept Wildcard Characters?</td><td>False</td></tr>
</table>


<table border="1">
<tr><th>-Name</th><td>The name of the script action.</td></tr>
<tr><td>Aliases</td><td>None</td></tr>
<tr><td>Required?</td><td>True</td></tr>
<tr><td>Position?</td><td>1</td></tr>
<tr><td>Default values</td><td>None</td></tr>
<tr><td>Accept Pipeline Input?</td><td>False</td></tr>
<tr><td>Accept Wildcard Characters?</td><td>False</td></tr>
</table>


<table border="1">
<tr><th>-ClusterRoleCollection</th><td>The list of cluster nodes on which the script will be executed.</td></tr>
<tr><td>Aliases</td><td>None</td></tr>
<tr><td>Required?</td><td>True</td></tr>
<tr><td>Position?</td><td>2</td></tr>
<tr><td>Default values</td><td>None</td></tr>
<tr><td>Accept Pipeline Input?</td><td>False</td></tr>
<tr><td>Accept Wildcard Characters?</td><td>False</td></tr>
</table>


<table border="1">
<tr><th>-Uri</th><td>The URI to the script that will be executed.</td></tr>
<tr><td>Aliases</td><td>None</td></tr>
<tr><td>Required?</td><td>True</td></tr>
<tr><td>Position?</td><td>3</td></tr>
<tr><td>Default values</td><td>None</td></tr>
<tr><td>Accept Pipeline Input?</td><td>False</td></tr>
<tr><td>Accept Wildcard Characters?</td><td>False</td></tr>
</table>


<table border="1">
<tr><th>-Parameters</th><td>The input parameters to the script that will be executed.</td></tr>
<tr><td>Aliases</td><td>None</td></tr>
<tr><td>Required?</td><td>False</td></tr>
<tr><td>Position?</td><td>4</td></tr>
<tr><td>Default values</td><td>None</td></tr>
<tr><td>Accept Pipeline Input?</td><td>False</td></tr>
<tr><td>Accept Wildcard Characters?</td><td>False</td></tr>
</table>


## <a name="debugScript"></a>How to debug your custom script

The script error logs are stored, along with other output, in the default storage account that you specified for the cluster at its creation. The logs are stored in a table with the name *u<\cluster-name-fragment><\time-stamp>setuplog*. These are aggregated logs that have records from all of the nodes (headnode and worker nodes) on which the script runs in the cluster.

Both the STDOUT and STDERR of custom scripts are logged into C:\HDInsightLogs\DeploymentAgent.log on the node where custom scripts were executed. An example log snippet for a Spark Script Action looks like this:

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

**Starting Spark installation at: 09/04/2014 21:46:02 Done with Spark installation at: 09/04/2014 21:46:38;**

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

 
In this log, it is clear that the Spark script action has been executed on the VM named HEADNODE0 and no exceptions were thrown during the execution. Moreover, the part in **bold** is the STDOUT for this script action. 

In the event that an execution failure occurs, the output describing it will also be contained in this log file. The information provided in these logs should be helpful when debugging script problems that may arise.

## <a name="sampleScripts"></a>Custom script samples

Microsoft provides sample scripts to install Spark and R on HDInsight. The sample scripts for Spark and R are located at:

* https://hdiconfigactions.blob.core.windows.net/sparkconfigactionv01/spark-installer-v01.ps1
* https://hdiconfigactions.blob.core.windows.net/rconfigactionv01/r-installer-v01.ps1

The topics describing how to used these scripts to install Spark and R on HDInsight clusters are provided here:

- [Install and use Spark 1.0 on HDInsight clusters][hdinsight-install-spark]
- [Install and use R on HDInsight Hadoop clusters][hdinsight-r-scripts]  

> [WACOM.NOTE] The sample script works only with HDInsight cluster version 3.1. For more information on HDInsight cluster versions, see [HDInsight cluster versions](http://azure.microsoft.com/en-us/documentation/articles/hdinsight-component-versioning/).

## <a name="seeAlso"></a>See also

[Customize HDInsight clusters using Script Action][hdinsight-cluster-customize] 


[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-cluster-customize]: ../hdinsight-hadoop-customize-cluster
[hdinsight-install-spark]: ../hdinsight-hadoop-spark-install/
[hdinsight-r-scripts]: ../hdinsight-hadoop-r-scripts/
[powershell-install-configure]: ../install-configure-powershell/