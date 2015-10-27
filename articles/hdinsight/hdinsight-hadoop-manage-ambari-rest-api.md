<properties
   pageTitle="Monitor and manage HDInsight clusters using the Apache Ambari REST API | Microsoft Azure"
   description="Learn how to use Ambari to monitor and manage Linux-based HDInsight clusters. In this document, you will learn how to use the Ambari REST API included with HDInsight clusters."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
	tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="10/27/2015"
   ms.author="larryfr"/>

#Manage HDInsight clusters by using the Ambari REST API

[AZURE.INCLUDE [ambari-selector](../../includes/hdinsight-ambari-selector.md)]

Apache Ambari simplifies the management and monitoring of a Hadoop cluster by providing an easy to use web UI and REST API. Ambari is included on Linux-based HDInsight clusters, and is used to monitor the cluster and make configuration changes. In this document, you will learn the basics of working with the Ambari REST API by performing common tasks such as finding the fully qualified domain name of the cluster nodes or finding the default storage account used by the cluster.

> [AZURE.NOTE] The information in this article applies only to Linux-based HDInsight clusters. For Windows-based HDInsight clusters, only a sub-set of monitoring functionality is available through the Ambari REST API. See [Monitor Windows-based Hadoop on HDInsight using the Ambari API](hdinsight-monitor-use-ambari-api.md).

##Prerequisites

* [cURL](http://curl.haxx.se/): cURL is a cross-platform utility that can be used to work with REST APIs from the command-line. In this document, it is used to communicate with the Ambari REST API.
* [jq](https://stedolan.github.io/jq/): jq is a cross-platform command-line utility for working with JSON documents. In this document, it is used to parse the JSON documents returned from the Ambari REST API.

##<a id="whatis"></a>What is Ambari?

<a href="http://ambari.apache.org" target="_blank">Apache Ambari</a> makes Hadoop management simpler by providing an easy-to-use web UI that can be used to provision, manage, and monitor Hadoop clusters. Developers can integrate these capabilities into their applications by using the <a href="https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md" target="_blank">Ambari REST APIs</a>.

Ambari is provided by default with Linux-based HDInsight clusters.

##REST API

The base URI for the Ambari REST API on HDInsight is https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME, where __CLUSTERNAME__ is the name of your cluster. 

> [AZURE.IMPORTANT] Connecting to Ambari on HDInsight requires HTTPS. You must also authenticate to Ambari using the admin account name (the default is __admin__,) and password you provided when the cluster was created.

The following is an example of using cURL to perform a GET request against the REST API:

    curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME"
    
If you run this, replacing __PASSWORD__ with the admin password for your cluster, and __CLUSTERNAME__ with the cluster name, you will receive a JSON document that begins with information similar to the following:

    {
    "href" : "http://10.0.0.10:8080/api/v1/clusters/CLUSTERNAME",
    "Clusters" : {
        "cluster_id" : 2,
        "cluster_name" : "CLUSTERNAME",
        "health_report" : {
        "Host/stale_config" : 0,
        "Host/maintenance_state" : 0,
        "Host/host_state/HEALTHY" : 7,
        "Host/host_state/UNHEALTHY" : 0,
        "Host/host_state/HEARTBEAT_LOST" : 0,
        "Host/host_state/INIT" : 0,
        "Host/host_status/HEALTHY" : 7,
        "Host/host_status/UNHEALTHY" : 0,
        "Host/host_status/UNKNOWN" : 0,
        "Host/host_status/ALERT" : 0

Since this is JSON, it is usually easier to use a JSON parser to retrieve data. For example, if you want to retrieve a count of alerts (contained in the __"Host/host_status/ALERT"__ element,) you can use the following to directly access the value:

    curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME" | jq '.Clusters.health_report."Host/host_status/ALERT"'
    
This retrieves the JSON document, then pipes the output to jq. `'.Clusters.health_report."Host/host_status/ALERT"'` indicates the element within the JSON document that you want to retrieve.

> [AZURE.NOTE] The __Host/host_status/ALERT__ element is enclosed in quotes to indicate that '/' is part of the element name. For more information on using jq, see the [jq website](https://stedolan.github.io/jq/).

##Example: Get the FQDN of cluster nodes

When working with HDInsight, you may need to know the fully qualified domain name (FQDN) of a cluster node. You can easily retrieve the FQDN for the various nodes in the cluster using the following:

| To get the FQDN for the ... | Use this... |
| =========================== | =========== |
| Head nodes                  | `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/HDFS/components/NAMENODE" | jq '.host_components[].HostRoles.host_name'` |
| Worker nodes                | `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/HDFS/components/DATANODE" | jq '.host_components[].HostRoles.host_name'` |
| Zookeeper nodes             | `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq '.host_components[].HostRoles.host_name'` |

Note that each of these follow the same pattern of querying a component that we know runs on those nodes, then retrieving the `host_name` elements, which contain the FQDN for these nodes.

The `host_components` element of the return document contains multiple items. Using `.host_components[]`, and then specifying a path within the element will loop through each item and pull out the value from the specific path. If you only want one value, such as the first FQDN entry, you can return the items as a collection and then select a specific entry:

    jq '[.host_components[].HostRoles.host_name][0]'

This will return the first FQDN from the collection.

##Example: Get the default storage account and container

When you create an HDInsight cluster, you must use an Azure Storage Account and a blob container as the default storage for the cluster. You can use Ambari to retrieve this information after the cluster has been created. For example, if you want to programmatically write data directly to the container.

The following will retrieve the WASB URI of the clusters default storage:

    curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations/service_config_versions?service_name=HDFS&service_config_version=1" | jq '.items[].configurations[].properties["fs.defaultFS"] | select(. != null)'
    
> [AZURE.NOTE] This will return the first configuration applied to the server (`service_config_version=1`,) which will contain this information. If you are retrieving a value that has been modified after cluster creation, you may need to list the configuration versions and retrieve the latest one.

This will return a value similar to the following, where __CONTAINER__ is the default container and __ACCOUNTNAME__ is the Azure Storage Account name:

    wasb://CONTAINER@ACCOUNTNAME.blob.core.windows.net

You can then use this information with the [Azure CLI](../xplat-cli-install.md) to upload or download data from the container. For example:

1. Get the resource group for the Storage Account. Replace __ACCOUNTNAME__ with the Storage Account name retrieved from Ambari:

        azure storage account list --json | jq '.[] | select(.name=="ACCOUNTNAME").resourceGroup'
    
    This will return the resource group name for the account.
    
2. Get the key for the Storage account. Replace __GROUPNAME__ with the Resource Group from the previous step. Replace __ACCOUNTNAME__ with the Storage Account name:

        azure storage account keys list -g GROUPNAME ACCOUNTNAME --json | jq '.storageAccountKeys.key1'

    This will return the primary key for the account.
    
3. Use the upload command to store a file in the container:

        azure storage blob upload -a ACCOUNTNAME -k ACCOUNTKEY -f FILEPATH --container __CONTAINER__ -b BLOBPATH
        
    Replace __ACCOUNTNAME__ with the Storage Account name. Replace __ACCOUNTKEY__ with the key retrieved previously. __FILEPATH__ is the path to the file you want to upload, while __BLOBPATH__ is the path in the container.

    For example, if you want the file to appear in HDInsight at wasb://example/data/filename.txt, then __BLOBPATH__ would be `example/data/filename.txt`.

##Next steps

For a complete reference of the REST API, see [Ambari API Reference V1](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md).

> [AZURE.NOTE] Some Ambari functionality is disabled, as it is managed by the HDInsight cloud service; for example, adding or removing hosts from the cluster or adding new services.