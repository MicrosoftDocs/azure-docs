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
   ms.date="07/05/2016"
   ms.author="larryfr"/>

#Manage HDInsight clusters by using the Ambari REST API

[AZURE.INCLUDE [ambari-selector](../../includes/hdinsight-ambari-selector.md)]

Apache Ambari simplifies the management and monitoring of a Hadoop cluster by providing an easy to use web UI and REST API. Ambari is included on Linux-based HDInsight clusters, and is used to monitor the cluster and make configuration changes. In this document, you will learn the basics of working with the Ambari REST API by performing common tasks such as finding the fully qualified domain name of the cluster nodes or finding the default storage account used by the cluster.

> [AZURE.NOTE] The information in this article applies only to Linux-based HDInsight clusters. For Windows-based HDInsight clusters, only a sub-set of monitoring functionality is available through the Ambari REST API. See [Monitor Windows-based Hadoop on HDInsight using the Ambari API](hdinsight-monitor-use-ambari-api.md).

##Prerequisites

* [cURL](http://curl.haxx.se/): cURL is a cross-platform utility that can be used to work with REST APIs from the command-line. In this document, it is used to communicate with the Ambari REST API.
* [jq](https://stedolan.github.io/jq/): jq is a cross-platform command-line utility for working with JSON documents. In this document, it is used to parse the JSON documents returned from the Ambari REST API.
* [Azure CLI](../xplat-cli-install.md): a cross-platform command-line utility for working with Azure services.

    [AZURE.INCLUDE [use-latest-version](../../includes/hdinsight-use-latest-cli.md)] 

##<a id="whatis"></a>What is Ambari?

[Apache Ambari](http://ambari.apache.org) makes Hadoop management simpler by providing an easy-to-use web UI that can be used to provision, manage, and monitor Hadoop clusters. Developers can integrate these capabilities into their applications by using the [Ambari REST APIs](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md).

Ambari is provided by default with Linux-based HDInsight clusters.

##REST API

The base URI for the Ambari REST API on HDInsight is https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME, where __CLUSTERNAME__ is the name of your cluster.

> [AZURE.IMPORTANT] While the cluster name in the fully qualified domain name (FQDN) part of the URI (CLUSTERNAME.azurehdinsight.net,) is case-insensitive, other occurrences in the URI are case-sensitive. For example, if your cluster is named MyCluster, the following are valid URIs:
>
> `https://mycluster.azurehdinsight.net/api/v1/clusters/MyCluster`
> `https://MyCluster.azurehdinsight.net/api/v1/clusters/MyCluster`
>
> The following URIs will return an error because the second occurrence of the name is not the correct case.
>
> `https://mycluster.azurehdinsight.net/api/v1/clusters/mycluster`
> `https://MyCluster.azurehdinsight.net/api/v1/clusters/mycluster`

Connecting to Ambari on HDInsight requires HTTPS. You must also authenticate to Ambari using the admin account name (the default is __admin__,) and password you provided when the cluster was created.

The following is an example of using cURL to make a GET request against the REST API:

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

Since this is JSON, it is usually easier to use a JSON parser to retrieve data. For example, if you want to retrieve health status information for the cluster, you can use the following.

    curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME" | jq '.Clusters.health_report'
    
This retrieves the JSON document, then pipes the output to jq. `.Clusters.health_report` indicates the element within the JSON document that you want to retrieve.

##Example: Get the FQDN of cluster nodes

When working with HDInsight, you may need to know the fully qualified domain name (FQDN) of a cluster node. You can easily retrieve the FQDN for the various nodes in the cluster using the following:

* __Head nodes__: `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/HDFS/components/NAMENODE" | jq '.host_components[].HostRoles.host_name'`
* __Worker nodes__: `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/HDFS/components/DATANODE" | jq '.host_components[].HostRoles.host_name'`
* __Zookeeper nodes__: `curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" | jq '.host_components[].HostRoles.host_name'`

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

You can then use this information with the [Azure CLI](../xplat-cli-install.md) to upload or download data from the container.

1. Get the resource group for the Storage Account. Replace __ACCOUNTNAME__ with the Storage Account name retrieved from Ambari:

        azure storage account list --json | jq '.[] | select(.name=="ACCOUNTNAME").resourceGroup'
    
    This will return the resource group name for the account.
    
    > [AZURE.NOTE] If nothing is returned from this command, you may need to change the Azure CLI to Azure Resource Manager mode and run the command again. To switch to Azure Resource Manager mode, use the following command.
    >
    > `azure config mode arm`
    
2. Get the key for the Storage account. Replace __GROUPNAME__ with the Resource Group from the previous step. Replace __ACCOUNTNAME__ with the Storage Account name:

        azure storage account keys list -g GROUPNAME ACCOUNTNAME --json | jq '.storageAccountKeys.key1'

    This will return the primary key for the account.
    
3. Use the upload command to store a file in the container:

        azure storage blob upload -a ACCOUNTNAME -k ACCOUNTKEY -f FILEPATH --container __CONTAINER__ -b BLOBPATH
        
    Replace __ACCOUNTNAME__ with the Storage Account name. Replace __ACCOUNTKEY__ with the key retrieved previously. __FILEPATH__ is the path to the file you want to upload, while __BLOBPATH__ is the path in the container.

    For example, if you want the file to appear in HDInsight at wasb://example/data/filename.txt, then __BLOBPATH__ would be `example/data/filename.txt`.

##Example: Update Ambari configuration

1. Get the current configuration, which Ambari stores as the "desired configuration":

        curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME?fields=Clusters/desired_configs"
        
    This will return a JSON document containing the current configuration (identified by the _tag_ value,) for the components installed on the cluster. For example, the following is an excerpt from the data returned from a Spark cluster type.
    
        "spark-metrics-properties" : {
            "tag" : "INITIAL",
            "user" : "admin",
            "version" : 1
        },
        "spark-thrift-fairscheduler" : {
            "tag" : "INITIAL",
            "user" : "admin",
            "version" : 1
        },
        "spark-thrift-sparkconf" : {
            "tag" : "INITIAL",
            "user" : "admin",
            "version" : 1
        }

    From this list, you need to copy the name of the component (for example, __spark\_thrift\_sparkconf__ and the __tag__ value.
    
2. Retrieve the configuration for the component and tag by using the following command. Replace __spark-thrift-sparkconf__ and __INITIAL__ with the component and tag that you want to retrieve the configuration for.

        curl -u admin:PASSWORD -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/configurations?type=spark-thrift-sparkconf&tag=INITIAL" | jq --arg newtag $(echo version$(date +%s%N)) '.items[] | del(.href, .version, .Config) | .tag |= $newtag | {"Clusters": {"desired_config": .}}' > newconfig.json
    
    Curl retrieves the JSON document, then jq is used to make some modifications to create a template that we can use to add/modify configuration values. Specifically it does the following:
    
    * Creates a unique value containing the string "version" and the date, which is stored in __newtag__
    * Creates a root document for the new desired configuration
    * Gets the contents of the .items[] array and adds it under the __desired_config__ element.
    * Deletes the __href__, __version__, and __Config__ elements, as these aren't needed to submit a new configuration
    * Adds a new __tag__ element and sets it's value to __version#################__ where the numeric portion is based on the current date. Each configuration must have a unique tag.
    
    Finally, the data is saved to the __newconfig.json__ document. The document structure will appear similar to the following:
    
        {
            "Clusters": {
                "desired_config": {
                "tag": "version1459260185774265400",
                "type": "spark-thrift-sparkconf",
                "properties": {
                    ....
                 },
                 "properties_attributes": {
                     ....
                 }
            }
        }

3. Open the __newconfig.json__ document and modify/add values in the __properties__ object. For example, change the value of __"spark.yarn.am.memory"__ from __"1g"__ to __"3g"__ and add a new element for __"spark.kryoserializer.buffer.max"__ with a value of __"256m"__.

        "spark.yarn.am.memory": "3g",
        "spark.kyroserializer.buffer.max": "256m",

    Save the file once you are done making modifications.

4. Use the following to submit the updated configuration to Ambari.

        cat newconfig.json | curl -u admin:PASSWORD -H "X-Requested-By: ambari" -X PUT -d "@-" "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME"
        
    This command pipes the contents of the __newconfig.json__ file to the curl request, which submits it to the cluster as the new desired configuration. This will return a JSON document. The __versionTag__ element in this document should match the version you submitted, and the __configs__ object will contain the configuration changes you requested.

###Example: Restart a service component

At this point, if you look at the Ambari web UI, the Spark service will indicate that it needs to be restarted before the new configuration can take effect. Use the following steps to restart the service.

1. Use the following to enable maintenance mode for the Spark service.

        echo '{"RequestInfo": {"context": "turning on maintenance mode for SPARK"},"Body": {"ServiceInfo": {"maintenance_state":"ON"}}}' | curl -u admin:PASSWORD -H "X-Requested-By: ambari" -X PUT -d "@-" "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SPARK"

    This sends a JSON document to the server (contained in the `echo` statement,) that turns maintenance mode on.
    You can verify that the service is now in maintenance mode using the following request.
    
        curl -u admin:PASSWORD -H "X-Requested-By: ambari" "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SPARK" | jq .ServiceInfo.maintenance_state
        
    This will return a value of `"ON"`.

3. Next, use the following to turn the service off.

        echo '{"RequestInfo": {"context" :"Stopping the Spark service"}, "Body": {"ServiceInfo": {"state": "INSTALLED"}}}' | curl -u admin:PASSWORD -H "X-Requested-By: ambari" -X PUT -d "@-" "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SPARK"
        
    You will receive a response similar to the following.
    
        {
            "href" : "http://10.0.0.18:8080/api/v1/clusters/CLUSTERNAME/requests/29",
            "Requests" : {
                "id" : 29,
                "status" : "Accepted"
            }
        }
    
    The `href` value returned by this URI is using the internal IP address of the cluster node. To use it from outside the cluster, replace the `10.0.0.18:8080' portion with the FQDN of the cluster. For example, the following will retrieve the status of the request.
    
        curl -u admin:PASSWORD -H "X-Requested-By: ambari" "https://CLUSTERNAME/api/v1/clusters/CLUSTERNAME/requests/29" | jq .Requests.request_status
    
    If this value returns `"COMPLETED"` then the request has finished.

4. Once the previous request completes, use the following to start the service.

        echo '{"RequestInfo": {"context" :"Restarting the Spark service"}, "Body": {"ServiceInfo": {"state": "STARTED"}}}' | curl -u admin:PASSWORD -H "X-Requested-By: ambari" -X PUT -d "@-" "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SPARK"

    Once the service has restarted, it will be using the new configuration settings.

5. Finally, use the following to turn off maintenance mode.

        echo '{"RequestInfo": {"context": "turning off maintenance mode for SPARK"},"Body": {"ServiceInfo": {"maintenance_state":"OFF"}}}' | curl -u admin:PASSWORD -H "X-Requested-By: ambari" -X PUT -d "@-" "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/services/SPARK"

##Next steps

For a complete reference of the REST API, see [Ambari API Reference V1](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md).

> [AZURE.NOTE] Some Ambari functionality is disabled, as it is managed by the HDInsight cloud service; for example, adding or removing hosts from the cluster or adding new services.