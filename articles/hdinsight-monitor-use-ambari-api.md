<properties 
	pageTitle="Monitor Hadoop clusters in HDInsight using the Ambari API | Azure" 
	description="Use the Apache Ambari APIs for provisioning, managing, and monitoring Hadoop clusters. Ambari's intuitive operator tools and APIs hide the complexity of Hadoop." 
	services="hdinsight" 
	documentationCenter="" 
	authors="mumian" 
	editor="cgronlun" 
	manager="paulettm"/>

<tags 
	ms.service="hdinsight" 
	ms.workload="big-data" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/31/2015" 
	ms.author="jgao"/>

# Monitor Hadoop clusters in HDInsight using the Ambari API
 
Learn how to monitor HDInsight clusters versions 3.1 and 2.1 by using Ambari APIs.



## <a id="whatisambari"></a> What is Ambari?

[Apache Ambari][ambari-home] is used for provisioning, managing, and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. For more information about the APIs, see [Ambari API Reference][ambari-api-reference].


HDInsight currently supports only the Ambari monitoring feature. Ambari API 1.0 is supported by HDInsight version 3.0 and 2.1 clusters. This article covers accessing Ambari APIs on HDInsight version 3.1 and 2.1 clusters. The key difference between the two is that some of the components have changed with the introduction of new capabilities (such as the Job History Server).


##<a id="prerequisites"></a>Prerequisites

Before you begin this tutorial, you must have the following:

- **A workstation** with Azure PowerShell installed and configured. For instructions, see [Install and configure Azure PowerShell][powershell-install]. To execute Azure PowerShell scripts, you must run Azure PowerShell as an administrator and set the execution policy to *RemoteSigned*. For more information, see [Run Windows PowerShell scripts][powershell-script].

- (Optional) [cURL][curl]. To install it, see [cURL Releases and Downloads][curl-download].

	>[AZURE.NOTE] When use the cURL command in Windows, use double-quotation marks instead of single-quotation marks for the option values.

- **An Azure HDInsight cluster**. For instructions about cluster provisioning, see [Get started using HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision]. You will need the following data to go through the tutorial:

	<table border="1">
	<tr><th>Cluster property</th><th>Azure PowerShell variable name</th><th>Value</th><th>Description</th></tr>
	<tr><td>HDInsight cluster name</td><td>$clusterName</td><td></td><td>The name of your HDInsight cluster.</td></tr>
	<tr><td>Cluster username</td><td>$clusterUsername</td><td></td><td>Cluster user name specified at provisioning.</td></tr>
	<tr><td>Cluster password</td><td>$clusterPassword</td><td></td><td>Cluster user password.</td></tr>
	</table>

	> [AZURE.NOTE] Fill-in the values in the table. This will be helpful for going through this tutorial.



##<a id="jumpstart"></a>Jump start

There are several ways to use Ambari to monitor HDInsight clusters.

**Use Azure PowerShell**

The following is an Azure PowerShell script to get the MapReduce job tracker information *in an HDInsight 3.1 cluster.*  The key difference is that we pull these details from the YARN service (rather than MapReduce).

	$clusterName = "<HDInsightClusterName>"
	$clusterUsername = "<HDInsightClusterUsername>"
	$clusterPassword = "<HDInsightClusterPassword>"
	
	$ambariUri = "https://$clusterName.azurehdinsight.net:443/ambari"
	$uriJobTracker = "$ambariUri/api/v1/clusters/$clusterName.azurehdinsight.net/services/yarn/components/resourcemanager"
	
	$passwd = ConvertTo-SecureString $clusterPassword -AsPlainText -Force
	$creds = New-Object System.Management.Automation.PSCredential ($clusterUsername, $passwd)
	
	$response = Invoke-RestMethod -Method Get -Uri $uriJobTracker -Credential $creds -OutVariable $OozieServerStatus 
	
	$response.metrics.'yarn.queueMetrics'

The following is an Azure PowerShell script for getting the MapReduce job tracker information *in an HDInsight 2.1 cluster*:

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

**Use cURL**

The following is an example of getting cluster information by using cURL:

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
	             "host_name":"headnode0.{ClusterDNS}.azurehdinsight.net"}}]}

**For the 10/8/2014 release**:

When using the Ambari endpoint, "https://{clusterDns}.azurehdinsight.net/ambari/api/v1/clusters/{clusterDns}.azurehdinsight.net/services/{servicename}/components/{componentname}", the *host_name* field returns the fully qualified domain name (FQDN) of the node instead of the host name. Before the 10/8/2014 release, this example returned simply "**headnode0**". After the 10/8/2014 release, you get the FQDN "**headnode0.{ClusterDNS}.azurehdinsight.net**", as shown in the previous example. This change was required to facilitate scenarios where multiple cluster types (such as HBase and Hadoop) can be deployed in one virtual network (VNET). This happens, for example, when using HBase as a back-end platform for Hadoop.

##<a id="monitor"></a>Ambari monitoring APIs

The following table lists some of the most common Ambari monitoring API calls. For more information about the API, see [Ambari API Reference][ambari-api-reference].

<table border="1">
<tr><th>Monitor API call</th><th>URI</th><th>Description</th></tr>
<tr><td>Get clusters</td><td><tt>/api/v1/clusters</tt></td><td></td></tr>
<tr><td>Get cluster info.</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net</tt></td><td>clusters, services, hosts</td></tr>
<tr><td>Get services</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services</tt></td><td>Services include: hdfs, mapreduce</td></tr>
<tr><td>Get services info.</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services/&lt;ServiceName&gt;</tt></td><td></td></tr>
<tr><td>Get service components</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services/&lt;ServiceName&gt;/components</tt></td><td>HDFS: namenode, datanode<br/>MapReduce: jobtracker; tasktracker</td></tr>
<tr><td>Get component info.</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/services/&lt;ServiceName&gt;/components/&lt;ComponentName&gt;</tt></td><td>ServiceComponentInfo, host-components, metrics</td></tr>
<tr><td>Get hosts</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts</tt></td><td>headnode0, workernode0</td></tr>
<tr><td>Get host info.</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts/&lt;HostName&gt; 
</td><td></td></tr>
<tr><td>Get host components</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts/&lt;HostName&gt;/host_components
</tt></td><td>namenode, resourcemanager</td></tr>
<tr><td>Get host component info.</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/hosts/&lt;HostName&gt;/host_components/&lt;ComponentName&gt;
</tt></td><td>HostRoles, component, host, metrics</td></tr>
<tr><td>Get configurations</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/configurations 
</tt></td><td>Config types: core-site, hdfs-site, mapred-site, hive-site</td></tr>
<tr><td>Get configuration info.</td><td><tt>/api/v1/clusters/&lt;ClusterName&gt;.azurehdinsight.net/configurations?type=&lt;ConfigType&gt;&tag=&lt;VersionName&gt; 
</tt></td><td>Config types: core-site, hdfs-site, mapred-site, hive-site</td></tr>
</table>


##<a id="nextsteps"></a>Next Steps 

Now you have learned how to use Ambari monitoring API calls. To learn more, see:

- [Manage HDInsight clusters using the Management portal][hdinsight-admin-portal]
- [Manage HDInsight clusters using Azure PowerShell][hdinsight-admin-powershell]
- [Manage HDInsight clusters using command-line interface][hdinsight-admin-cli]
- [HDInsight documentation][hdinsight-documentation]
- [Get started with HDInsight][hdinsight-get-started]



[ambari-home]: http://ambari.apache.org/
[ambari-api-reference]: https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md

[curl]: http://curl.haxx.se
[curl-download]: http://curl.haxx.se/download.html

[microsoft-hadoop-SDK]: http://hadoopsdk.codeplex.com/wikipage?title=Ambari%20Monitoring%20Client

[Powershell-install]: install-configure-powershell.md
[Powershell-script]: http://technet.microsoft.com/library/ee176949.aspx 

[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-documentation]: /documentation/services/hdinsight/
[hdinsight-get-started]: hdinsight-get-started.md
[hdinsight-provision]: hdinsight-provision-clusters.md

[img-jobtracker-output]: ./media/hdinsight-monitor-use-ambari-api/hdi.ambari.monitor.jobtracker.output.png

