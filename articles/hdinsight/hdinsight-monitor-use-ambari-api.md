<properties
	pageTitle="Monitor Hadoop clusters in HDInsight using the Ambari API | Microsoft Azure"
	description="Use the Apache Ambari APIs for creating, managing, and monitoring Hadoop clusters. Intuitive operator tools and APIs hide the complexity of Hadoop."
	services="hdinsight"
	documentationCenter=""
	tags="azure-portal"
	authors="mumian"
	editor="cgronlun"
	manager="paulettm"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="jgao"/>

# Monitor Hadoop clusters in HDInsight using the Ambari API

Learn how to monitor HDInsight clusters by using Ambari APIs.

> [AZURE.NOTE] The information in this article is primarily for Windows-based HDInsight clusters, which provide a read-only version of the Ambari REST API. For Linux-based clusters, see [Manage Hadoop clusters using Ambari](hdinsight-hadoop-manage-ambari.md).

## What is Ambari?

[Apache Ambari][ambari-home] is used for creating, managing, and monitoring Apache Hadoop clusters. It includes an intuitive collection of operator tools and a robust set of APIs that hide the complexity of Hadoop, simplifying the operation of clusters. For more information about the APIs, see [Ambari API Reference][ambari-api-reference]. HDInsight currently supports only the Ambari monitoring and managing features. 

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **A workstation with Azure PowerShell**.

    [AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

- (Optional) [cURL][curl]. To install it, see [cURL Releases and Downloads][curl-download].

	>[AZURE.NOTE] When use the cURL command in Windows, use double-quotation marks instead of single-quotation marks for the option values.

- **An Azure HDInsight cluster**. For instructions about cluster provisioning, see [Get started using HDInsight][hdinsight-get-started] or [Provision HDInsight clusters][hdinsight-provision]. You will need the following data to go through the tutorial:

    Cluster property|Azure PowerShell variable name|Value|Description
    ---|---|---|---
    HDInsight cluster name|$clusterName||The name of your HDInsight cluster.
    Cluster username|$clusterUsername||Cluster user name specified when the cluster was created.
    Cluster password|$clusterPassword||Cluster user password.

    >[AZURE.NOTE] Fill-in the values in the table. This will be helpful for going through this tutorial.

## Jump start

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

## Ambari monitoring APIs

The following table lists some of the most common Ambari monitoring API calls. For more information about the API, see [Ambari API Reference][ambari-api-reference].

Monitor API call|URI|Description
---|---|---
Get clusters|`/api/v1/clusters`|
Get cluster info.|`/api/v1/clusters/<ClusterName>.azurehdinsight.net`|clusters, services, hosts
Get services|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/services`|Services include: hdfs, mapreduce
Get services info.|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/services/<ServiceName>`|
Get service components|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/services/<ServiceName>/components`|HDFS: namenode, datanode<br/>MapReduce: jobtracker; tasktracker
Get component info.|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/services/<ServiceName>/components/<ComponentName>`|ServiceComponentInfo, host-components, metrics
Get hosts|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/hosts`|headnode0, workernode0
Get host info.|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/hosts/<HostName>`|
Get host components|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/hosts/<HostName>/host_components`|namenode, resourcemanager
Get host component info.|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/hosts/<HostName>/host_components/<ComponentName>`|HostRoles, component, host, metrics
Get configurations|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/configurations`|Config types: core-site, hdfs-site, mapred-site, hive-site
Get configuration info.|`/api/v1/clusters/<ClusterName>.azurehdinsight.net/configurations?type=<ConfigType>&tag=<VersionName>`|Config types: core-site, hdfs-site, mapred-site, hive-site


##Next Steps

Now you have learned how to use Ambari monitoring API calls. To learn more, see:

- [Manage HDInsight clusters using the Azure Portal][hdinsight-admin-portal]
- [Manage HDInsight clusters using Azure PowerShell][hdinsight-admin-powershell]
- [Manage HDInsight clusters using command-line interface][hdinsight-admin-cli]
- [HDInsight documentation][hdinsight-documentation]
- [Get started with HDInsight][hdinsight-get-started]



[ambari-home]: http://ambari.apache.org/
[ambari-api-reference]: https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md

[curl]: http://curl.haxx.se
[curl-download]: http://curl.haxx.se/download.html

[microsoft-hadoop-SDK]: http://hadoopsdk.codeplex.com/wikipage?title=Ambari%20Monitoring%20Client

[powershell-install]: powershell-install-configure.md
[powershell-script]: http://technet.microsoft.com/library/ee176949.aspx

[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md
[hdinsight-admin-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-documentation]: /documentation/services/hdinsight/
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-provision]: hdinsight-provision-clusters.md

[img-jobtracker-output]: ./media/hdinsight-monitor-use-ambari-api/hdi.ambari.monitor.jobtracker.output.png
