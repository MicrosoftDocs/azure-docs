---
title: Monitor and manage Hadoop with Ambari REST API - Azure HDInsight 
description: Learn how to use Ambari to monitor and manage Hadoop clusters in Azure HDInsight. In this document, you will learn how to use the Ambari REST API included with HDInsight clusters.
author: hrasheed-msft
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 06/07/2019
ms.author: hrasheed
---

# Manage HDInsight clusters by using the Apache Ambari REST API

[!INCLUDE [ambari-selector](../../includes/hdinsight-ambari-selector.md)]

Learn how to use the Apache Ambari REST API to manage and monitor Apache Hadoop clusters in Azure HDInsight.

## <a id="whatis"></a>What is Apache Ambari

[Apache Ambari](https://ambari.apache.org) simplifies the management and monitoring of Hadoop clusters by providing an easy to use web UI backed by its [REST APIs](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md).  Ambari is provided by default with Linux-based HDInsight clusters.

## Prerequisites

* **A Hadoop cluster on HDInsight**. See [Get Started with HDInsight on Linux](hadoop/apache-hadoop-linux-tutorial-get-started.md).

* **Bash on Ubuntu on Windows 10**.  The examples in this article use the Bash shell on Windows 10. See [Windows Subsystem for Linux Installation Guide for Windows 10](https://docs.microsoft.com/windows/wsl/install-win10) for installation steps.  Other [Unix shells](https://www.gnu.org/software/bash/) will work as well.  The examples, with some slight modifications, can work on a Windows Command prompt.  Alternatively, you can use Windows PowerShell.

* **jq**, a command-line JSON processor.  See [https://stedolan.github.io/jq/](https://stedolan.github.io/jq/).

* **Windows PowerShell**.  Alternatively, you can use [Bash](https://www.gnu.org/software/bash/).

## Base URI for Ambari Rest API

 The base Uniform Resource Identifier (URI) for the Ambari REST API on HDInsight is `https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME`, where `CLUSTERNAME` is the name of your cluster.  Cluster names in URIs are **case-sensitive**.  While the cluster name in the fully qualified domain name (FQDN) part of the URI (`CLUSTERNAME.azurehdinsight.net`) is case-insensitive, other occurrences in the URI are case-sensitive.

## Authentication

Connecting to Ambari on HDInsight requires HTTPS. Use the admin account name (the default is **admin**) and password you provided during cluster creation.

## Examples

### Setup (Preserve credentials)
Preserve your credentials to avoid reentering them for each example.  The cluster name will be preserved in a separate step.

**A. Bash**  
Edit the script below by replacing `PASSWORD` with your actual password.  Then enter the command.

```bash
export password='PASSWORD'
```  

**B. PowerShell**  

```powershell
$creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
```

### Identify correctly cased cluster name
The actual casing of the cluster name may be different than you expect, depending on how the cluster was created.  The steps here will show the actual casing, and then store it in a variable for all subsequent examples.

Edit the scripts below to replace `CLUSTERNAME` with your cluster name. Then enter the command. (The cluster name for the FQDN is not case-sensitive.)

```bash
export clusterName=$(curl -u admin:$password -sS -G "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters" | jq -r '.items[].Clusters.cluster_name')
echo $clusterName
```  

```powershell
# Identify properly cased cluster name
$resp = Invoke-WebRequest -Uri "https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters" `
    -Credential $creds -UseBasicParsing
$clusterName = (ConvertFrom-Json $resp.Content).items.Clusters.cluster_name;

# Show cluster name
$clusterName
```

### Parsing JSON data

The following example uses [jq](https://stedolan.github.io/jq/) or [ConvertFrom-Json](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/convertfrom-json) to parse the JSON response document and display only the `health_report` information from the results.

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName" \
| jq '.Clusters.health_report'
```  

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.Clusters.health_report
```

### <a name="example-get-the-fqdn-of-cluster-nodes"></a> Get the FQDN of cluster nodes

When working with HDInsight, you may need to know the fully qualified domain name (FQDN) of a cluster node. You can easily retrieve the FQDN for the various nodes in the cluster using the following examples:

**All nodes**  

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/hosts" \
| jq -r '.items[].Hosts.host_name'
```  

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/hosts" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.items.Hosts.host_name
```

**Head nodes**  

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/HDFS/components/NAMENODE" \
| jq -r '.host_components[].HostRoles.host_name'
```

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/HDFS/components/NAMENODE" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.host_components.HostRoles.host_name
```

**Worker nodes**  

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/HDFS/components/DATANODE" \
| jq -r '.host_components[].HostRoles.host_name'
```

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/HDFS/components/DATANODE" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.host_components.HostRoles.host_name
```

**Zookeeper nodes**

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" \
| jq -r ".host_components[].HostRoles.host_name"
```

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.host_components.HostRoles.host_name
```

### <a name="example-get-the-internal-ip-address-of-cluster-nodes"></a> Get the internal IP address of cluster nodes

The IP addresses returned by the examples in this section are not directly accessible over the internet. They are only accessible within the Azure Virtual Network that contains the HDInsight cluster.

For more information on working with HDInsight and virtual networks, see [Extend HDInsight capabilities by using a custom Azure Virtual Network](hdinsight-extend-hadoop-virtual-network.md).

To find the IP address, you must know the internal fully qualified domain name (FQDN) of the cluster nodes. Once you have the FQDN, you can then get the IP address of the host. The following examples first query Ambari for the FQDN of all the host nodes, then query Ambari for the IP address of each host.

```bash
for HOSTNAME in $(curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/hosts" | jq -r '.items[].Hosts.host_name')
do
    IP=$(curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/hosts/$HOSTNAME" | jq -r '.Hosts.ip')
  echo "$HOSTNAME <--> $IP"
done
```  

```powershell
$uri = "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/hosts" 
$resp = Invoke-WebRequest -Uri $uri -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
foreach($item in $respObj.items) {
    $hostName = [string]$item.Hosts.host_name
    $hostInfoResp = Invoke-WebRequest -Uri "$uri/$hostName" `
        -Credential $creds -UseBasicParsing
    $hostInfoObj = ConvertFrom-Json $hostInfoResp 
    $hostIp = $hostInfoObj.Hosts.ip
    "$hostName <--> $hostIp"
}
```

### Get the default storage

When you create an HDInsight cluster, you must use an Azure Storage Account or Data Lake Storage as the default storage for the cluster. You can use Ambari to retrieve this information after the cluster has been created. For example, if you want to read/write data to the container outside HDInsight.

The following examples retrieve the default storage configuration from the cluster:

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" \
| jq -r '.items[].configurations[].properties["fs.defaultFS"] | select(. != null)'
```

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.items.configurations.properties.'fs.defaultFS'
```

> [!IMPORTANT]  
> These examples return the first configuration applied to the server (`service_config_version=1`) which contains this information. If you retrieve a value that has been modified after cluster creation, you may need to list the configuration versions and retrieve the latest one.

The return value is similar to one of the following examples:

* `wasbs://CONTAINER@ACCOUNTNAME.blob.core.windows.net` - This value indicates that the cluster is using an Azure Storage account for default storage. The `ACCOUNTNAME` value is the name of the storage account. The `CONTAINER` portion is the name of the blob container in the storage account. The container is the root of the HDFS compatible storage for the cluster.

* `abfs://CONTAINER@ACCOUNTNAME.dfs.core.windows.net` - This value indicates that the cluster is using Azure Data Lake Storage Gen2 for default storage. The `ACCOUNTNAME` and `CONTAINER` values have the same meanings as for Azure Storage mentioned previously.

* `adl://home` - This value indicates that the cluster is using Azure Data Lake Storage Gen1 for default storage.

    To find the Data Lake Storage account name, use the following examples:

    ```bash
    curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" \
    | jq -r '.items[].configurations[].properties["dfs.adls.home.hostname"] | select(. != null)'
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" `
        -Credential $creds -UseBasicParsing
    $respObj = ConvertFrom-Json $resp.Content
    $respObj.items.configurations.properties.'dfs.adls.home.hostname'
    ```

    The return value is similar to `ACCOUNTNAME.azuredatalakestore.net`, where `ACCOUNTNAME` is the name of the Data Lake Storage account.

    To find the directory within Data Lake Storage that contains the storage for the cluster, use the following examples:

    ```bash
    curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" \
    | jq -r '.items[].configurations[].properties["dfs.adls.home.mountpoint"] | select(. != null)'
    ```  

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations/service_config_versions?service_name=HDFS&service_config_version=1" `
        -Credential $creds -UseBasicParsing
    $respObj = ConvertFrom-Json $resp.Content
    $respObj.items.configurations.properties.'dfs.adls.home.mountpoint'
    ```

    The return value is similar to `/clusters/CLUSTERNAME/`. This value is a path within the Data Lake Storage account. This path is the root of the HDFS compatible file system for the cluster.  

> [!NOTE]  
> The [Get-AzHDInsightCluster](https://docs.microsoft.com/powershell/module/az.hdinsight/get-azhdinsightcluster) cmdlet provided by [Azure PowerShell](/powershell/azure/overview) also returns the storage information for the cluster.

### <a name="get-all-configurations"></a> Get all configurations

Get the configurations that are available for your cluster.

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName?fields=Clusters/desired_configs"
```

```powershell
$respObj = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName`?fields=Clusters/desired_configs" `
    -Credential $creds -UseBasicParsing
$respObj.Content
```

This example returns a JSON document containing the current configuration (identified by the *tag* value) for the components installed on the cluster. The following example is an excerpt from the data returned from a Spark cluster type.

```json
"jupyter-site" : {
  "tag" : "INITIAL",
  "version" : 1
},
"livy2-client-conf" : {
  "tag" : "INITIAL",
  "version" : 1
},
"livy2-conf" : {
  "tag" : "INITIAL",
  "version" : 1
},
```

### Get configuration for specific component

Get the configuration for the component that you are interested in. In the following example, replace `INITIAL` with the tag value returned from the previous request.

```bash
curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations?type=livy2-conf&tag=INITIAL"
```

```powershell
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations?type=livy2-conf&tag=INITIAL" `
    -Credential $creds -UseBasicParsing
$resp.Content
```

This example returns a JSON document containing the current configuration for the `livy2-conf` component.

### Update configuration

1. Create `newconfig.json`.  
   Modify, and then enter the commands below:

   * Replace `livy2-conf` with the desired component.
   * Replace `INITIAL` with actual value retrieved for `tag` from [Get all configurations](#get-all-configurations).

     **A. Bash**  
     ```bash
     curl -u admin:$password -sS -G "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations?type=livy2-conf&tag=INITIAL" \
     | jq --arg newtag $(echo version$(date +%s%N)) '.items[] | del(.href, .version, .Config) | .tag |= $newtag | {"Clusters": {"desired_config": .}}' > newconfig.json
     ```

     **B. PowerShell**  
     The PowerShell script uses [jq](https://stedolan.github.io/jq/).  Edit `C:\HD\jq\jq-win64` below to reflect your actual path and version of [jq](https://stedolan.github.io/jq/).

     ```powershell
     $epoch = Get-Date -Year 1970 -Month 1 -Day 1 -Hour 0 -Minute 0 -Second 0
     $now = Get-Date
     $unixTimeStamp = [math]::truncate($now.ToUniversalTime().Subtract($epoch).TotalMilliSeconds)
     $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/configurations?type=livy2-conf&tag=INITIAL" `
       -Credential $creds -UseBasicParsing
     $resp.Content | C:\HD\jq\jq-win64 --arg newtag "version$unixTimeStamp" '.items[] | del(.href, .version, .Config) | .tag |= $newtag | {"Clusters": {"desired_config": .}}' > newconfig.json
     ```

     Jq is used to turn the data retrieved from HDInsight into a new configuration template. Specifically, these examples perform the following actions:

   * Creates a unique value containing the string "version" and the date, which is stored in `newtag`.

   * Creates a root document for the new desired configuration.

   * Gets the contents of the `.items[]` array and adds it under the **desired_config** element.

   * Deletes the `href`, `version`, and `Config` elements, as these elements aren't needed to submit a new configuration.

   * Adds a `tag` element with a value of `version#################`. The numeric portion is based on the current date. Each configuration must have a unique tag.

     Finally, the data is saved to the `newconfig.json` document. The document structure should appear similar to the following example:

     ```json
     {
       "Clusters": {
         "desired_config": {
           "tag": "version1552064778014",
           "type": "livy2-conf",
           "properties": {
             "livy.environment": "production",
             "livy.impersonation.enabled": "true",
             "livy.repl.enableHiveContext": "true",
             "livy.server.csrf_protection.enabled": "true",
               ....
           },
         },
       }
     }
     ```

2. Edit `newconfig.json`.  
   Open the `newconfig.json` document and modify/add values in the `properties` object. The following example changes the value of `"livy.server.csrf_protection.enabled"` from `"true"` to `"false"`.

        "livy.server.csrf_protection.enabled": "false",

    Save the file once you are done making modifications.

3. Submit `newconfig.json`.  
   Use the following commands to submit the updated configuration to Ambari.

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" -X PUT -d @newconfig.json "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName"
    ```

    ```powershell
    $newConfig = Get-Content .\newconfig.json
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName" `
        -Credential $creds -UseBasicParsing `
        -Method PUT `
        -Headers @{"X-Requested-By" = "ambari"} `
        -Body $newConfig
    $resp.Content
    ```  

    These commands submit the contents of the **newconfig.json** file to the cluster as the new desired configuration. The request returns a JSON document. The **versionTag** element in this document should match the version you submitted, and the **configs** object contains the configuration changes you requested.

### Restart a service component

At this point, if you look at the Ambari web UI, the Spark service indicates that it needs to be restarted before the new configuration can take effect. Use the following steps to restart the service.

1. Use the following to enable maintenance mode for the Spark2 service:

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" \
    -X PUT -d '{"RequestInfo": {"context": "turning on maintenance mode for SPARK2"},"Body": {"ServiceInfo": {"maintenance_state":"ON"}}}' \
    "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2"
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2" `
        -Credential $creds -UseBasicParsing `
        -Method PUT `
        -Headers @{"X-Requested-By" = "ambari"} `
        -Body '{"RequestInfo": {"context": "turning on maintenance mode for SPARK2"},"Body": {"ServiceInfo": {"maintenance_state":"ON"}}}'
    ```

2. Verify maintenance mode  

    These commands send a JSON document to the server that turns on maintenance mode. You can verify that the service is now in maintenance mode using the following request:

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" \
    "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2" \
    | jq .ServiceInfo.maintenance_state
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2" `
        -Credential $creds -UseBasicParsing
    $respObj = ConvertFrom-Json $resp.Content
    $respObj.ServiceInfo.maintenance_state
    ```

    The return value is `ON`.

3. Next, use the following to turn off the Spark2 service:

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" \
    -X PUT -d '{"RequestInfo":{"context":"_PARSE_.STOP.SPARK2","operation_level":{"level":"SERVICE","cluster_name":"CLUSTERNAME","service_name":"SPARK"}},"Body":{"ServiceInfo":{"state":"INSTALLED"}}}' \
    "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2"
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2" `
        -Credential $creds -UseBasicParsing `
        -Method PUT `
        -Headers @{"X-Requested-By" = "ambari"} `
        -Body '{"RequestInfo":{"context":"_PARSE_.STOP.SPARK2","operation_level":{"level":"SERVICE","cluster_name":"CLUSTERNAME","service_name":"SPARK"}},"Body":{"ServiceInfo":{"state":"INSTALLED"}}}'
    $resp.Content
    ```

    The response is similar to the following example:

    ```json
    {
        "href" : "http://10.0.0.18:8080/api/v1/clusters/CLUSTERNAME/requests/29",
        "Requests" : {
            "id" : 29,
            "status" : "Accepted"
        }
    }
    ```

    > [!IMPORTANT]  
    > The `href` value returned by this URI is using the internal IP address of the cluster node. To use it from outside the cluster, replace the `10.0.0.18:8080` portion with the FQDN of the cluster.  

4. Verify request.  
    Edit the command below by replacing `29` with the actual value for `id` returned from the  prior step.  The following commands retrieve the status of the request:

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" \
    "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/requests/29" \
    | jq .Requests.request_status
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/requests/29" `
        -Credential $creds -UseBasicParsing
    $respObj = ConvertFrom-Json $resp.Content
    $respObj.Requests.request_status
    ```

    A response of `COMPLETED` indicates that the request has finished.

5. Once the previous request completes, use the following to start the Spark2 service.

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" \
    -X PUT -d '{"RequestInfo":{"context":"_PARSE_.START.SPARK2","operation_level":{"level":"SERVICE","cluster_name":"CLUSTERNAME","service_name":"SPARK"}},"Body":{"ServiceInfo":{"state":"STARTED"}}}' \
    "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2"
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2" `
        -Credential $creds -UseBasicParsing `
        -Method PUT `
        -Headers @{"X-Requested-By" = "ambari"} `
        -Body '{"RequestInfo":{"context":"_PARSE_.START.SPARK2","operation_level":{"level":"SERVICE","cluster_name":"CLUSTERNAME","service_name":"SPARK"}},"Body":{"ServiceInfo":{"state":"STARTED"}}}'
    $resp.Content
    ```

    The service is now using the new configuration.

6. Finally, use the following to turn off maintenance mode.

    ```bash
    curl -u admin:$password -sS -H "X-Requested-By: ambari" \
    -X PUT -d '{"RequestInfo": {"context": "turning off maintenance mode for SPARK2"},"Body": {"ServiceInfo": {"maintenance_state":"OFF"}}}' \
    "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2"
    ```

    ```powershell
    $resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/services/SPARK2" `
        -Credential $creds -UseBasicParsing `
        -Method PUT `
        -Headers @{"X-Requested-By" = "ambari"} `
        -Body '{"RequestInfo": {"context": "turning off maintenance mode for SPARK2"},"Body": {"ServiceInfo": {"maintenance_state":"OFF"}}}'
    ```

## Next steps

For a complete reference of the REST API, see [Apache Ambari API Reference V1](https://github.com/apache/ambari/blob/trunk/ambari-server/docs/api/v1/index.md).