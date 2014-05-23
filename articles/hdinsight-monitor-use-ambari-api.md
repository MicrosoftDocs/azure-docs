<properties linkid="manage-services-hdinsight-use-Ambari" urlDisplayName="Monitor Hadoop clusters  in HDInsight using the Ambari API" pageTitle="Monitor Hadoop clusters in HDInsight using the Ambari API | Azure" metaKeywords="" description="Use the Apache Ambari APIs for provisioning, managing, and monitoring Hadoop clusters. Ambari's intuitive operator tools and APIs hide the complexity of Hadoop." services="hdinsight" documentationCenter="" title="Monitor Hadoop clusters in HDInsight using the Ambari API" umbracoNaviHide="0" disqusComments="1" authors="jgao" editor="cgronlun" manager="paulettm" />

# Monitor Hadoop clusters in HDInsight using the Ambari API
 
Learn how to monitor HDInsight clusters version 2.1 using Ambari APIs.

**Estimated time to complete:** 15 minutes


##In this article

- [What is Ambari?](#whatisambari)
- [Prerequisites](#prerequisites)
- [Jump start](#jumpstart)
- [Ambari monitoring APIs](#monitor)
- [Next steps](#nextsteps)


## <a id="whatisambari"></a> What is Ambari?

[Apache Ambari][ambari-home] is for provisioning, managing and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. For more information about the APIs, see [Ambari API reference][ambari-api-reference].


HDInsight currently only supports the Ambari monitoring feature. Ambari API v1.0 is supported by HDInsight cluster version 2.1 and 3.0.  This article only covers running Ambari APIs on HDInsight cluster version 2.1.


##<a id="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **A workstation** with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install]. To execute PowerShell scripts, you must run Azure PowerShell as administrator and set the execution policy to *RemoteSigned*. See [Run Windows PowerShell scripts][powershell-script].

	[Curl][curl] is optional. It can be installed from [here][curl-download].

	>[WACOM.NOTE] When use the curl command on Windows, use double-quotes instead of single-quotes for the option values.

- **An Azure HDInsight cluster**. For instructions on cluster provision, see [Get started using HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision]. You will need the following data to go through the tutorial:

	<table border="1">
	<tr><th>Cluster property</th><th>PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>HDInsight cluster name</td><td>$clusterName</td><td></td><td>The name of your HDInsight cluster.</td></tr>
	<tr><td>Cluster username</td><td>$clusterUsername</td><td></td><td>Cluster username specified at provision.</td></tr>
	<tr><td>Cluster password</td><td>$clusterPassword</td><td></td><td>Cluster user password.</td></tr>
	</table>

	> [WACOM.NOTE] Fill the values into the tables.  It will be helpful for going through this tutorial.



##<a id="jumpstart"></a>Jump start

There are several ways to use Ambari to monitor HDInsight clusters.

**Use Azure PowerShell**

The following is a PowerShell script for getting the MapReduce jobtracker information:

	$clusterName = "<HDInsightClusterName>"
	$clusterUsername = "<HDInsightClusterUsername>"
	$clusterPassword = "<HDInsightClusterPassword>"
	
	$ambariUri = "https://$clusterName.azurehdinsight.net:443/ambari"
	$uriJobTracker = "$ambariUri/api/v1/clusters/$clusterName.azurehdinsight.net/services/mapreduce/components/jobtracker"
	
	$passwd = ConvertTo-SecureString $clusterPassword -AsPlainText -Force
	$creds = New-Object System.Management.Automation.PSCredential ($clusterUsername, $passwd)
	
	$response = Invoke-RestMethod -Method Get -Uri $uriJobTracker -Credential $creds -OutVariable $OozieServerStatus 
	
	$response.metrics.'mapred.JobTracker'

The output is:

![Jobtracker Output][img-jobtracker-output]

**Use curl**

The following is an example of getting cluster information using Curl:

	curl -u <username>:<password> -k https://<ClusterName>.azurehdinsight.net:443/ambari/api/v1/clusters/<ClusterName>.azurehdinsight.net

The output is:
	
	{"href":"https://hdi0211v2.azurehdinsight.net/ambari/api/v1/clusters/hdi0211v2.azurehdinsight.net/",
	 "Clusters":{"cluster_name":"hdi0211v2.azurehdinsight.net","version":"2.1.3.0.432823"},
	 "services"[
	   {"href":"https://hdi0211v2.azurehdinsight.net/ambari/api/v1/clusters/hdi0211v2.azurehdinsight.net/services/hdfs",
	    "ServiceInfo":{"cluster_name":"hdi0211v2.azurehdinsight.net","service_name":"hdfs"}},
	   {"href":"https://hdi0211v2.azurehdinsight.net/ambari/api/v1/clusters/hdi0211v2.azurehdinsight.net/services/mapreduce",
	    "ServiceInfo":{"cluster_name":"hdi0211v2.azurehdinsight.net","service_name":"mapreduce"}}],
	 "hosts":[
	   {"href":"https://hdi0211v2.azurehdinsight.net/ambari/api/v1/clusters/hdi0211v2.azurehdinsight.net/hosts/headnode0",
	    "Hosts":{"cluster_name":"hdi0211v2.azurehdinsight.net",
	             "host_name":"headnode0"}},
	   {"href":"https://hdi0211v2.azurehdinsight.net/ambari/api/v1/clusters/hdi0211v2.azurehdinsight.net/hosts/workernode0",
	    "Hosts":{"cluster_name":"hdi0211v2.azurehdinsight.net",
	             "host_name":"workernode0"}}]}


##<a id="monitor"></a>Ambari monitoring APIs

The following table lists some of the most common Ambari monitoring API calls. For more information about the API, see [Ambari API reference][ambari-api-reference].

<table border="1">
<tr><th>Monitor API call</th><th>URI</th><th>Description</th></tr>
<tr><td>Get clusters</td><td>/api/v1/clusters</td><td></td></tr>
<tr><td>Get cluster info.</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net</td><td>clusters, services, hosts</td></tr>
<tr><td>Get services</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services</td><td>Services include: hdfs, mapreduce</td></tr>
<tr><td>Get services info.</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services/&lt;ServiceName&gt;</td><td></td></tr>
<tr><td>Get service components</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services/&lt;ServiceName&gt;/components</td><td>HDFS: namenode, datanode<br/>MapReduce: jobtracker; tasktracker</td></tr>
<tr><td>Get component info.</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services/&lt;ServiceName&gt;/components/&lt;ComponentName&gt;</td><td>ServiceComponentInfo, host-components, metrics</td></tr>
<tr><td>Get hosts</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts</td><td>headnode0, workernode0</td></tr>
<tr><td>Get host info.</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts/&lt;HostName&gt; 
</td><td></td></tr>
<tr><td>Get host components</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts/&lt;HostName&gt;/host_components
</td><td>namenode, resourcemanager</td></tr>
<tr><td>Get host component info.</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts/&lt;HostName&gt;/host_components/&lt;ComponentName&gt;
</td><td>HostRoles, component, host, metrics</td></tr>
<tr><td>Get configurations</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/configurations 
</td><td>Config types: core-site, hdfs-site, mapred-site, hive-site</td></tr>
<tr><td>Get configuration info.</td><td>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/configurations?type=&lt;ConfigType&gt;&tag=&lt;VersionName&gt; 
</td><td>Config types: core-site, hdfs-site, mapred-site, hive-site</td></tr>
</table>


##<a id="nextsteps"></a>Next Steps 

Now you have learned how to use Ambari monitoring API calls. To learn more, see:

- [Administer HDInsight clusters using the Management portal][hdinsight-admin-portal]
- [Administer HDInsight clusters using Azure PowerShell][hdinsight-admin-powershell]
- [Administer HDInsight clusters using command-line interface][hdinsight-admin-cli]
- [HDInsight documentation][hdinsight-documentation]
- [Get started with HDInsight][hdinsight-get-started]



[ambari-home]: http://ambari.apache.org/
[ambari-api-reference]: https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md

[curl]: http://curl.haxx.se
[curl-download]: http://curl.haxx.se/download.html

[microsoft-hadoop-SDK]: http://hadoopsdk.codeplex.com/wikipage?title=Ambari%20Monitoring%20Client

[Powershell-install]: ../install-configure-powershell/
[Powershell-script]: http://technet.microsoft.com/en-us/library/ee176949.aspx 

[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/
[hdinsight-admin-portal]: ../hdinsight-administer-use-management-portal/
[hdinsight-admin-cli]: ../hdinsight-administer-use-command-line/
[hdinsight-documentation]: /en-us/documentation/services/hdinsight/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-provision]: ../hdinsight-provision-clusters/

[img-jobtracker-output]: ./media/hdinsight-monitor-use-ambari-api/hdi.ambari.monitor.jobtracker.output.png

