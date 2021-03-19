---
title: How to get the host names of Azure HDInsight cluster nodes
description: Learn about how to get host names and FQDN name of Azure HDInsight cluster nodes.
ms.service: hdinsight
ms.topic: how-to
author: yanancai
ms.author: yanacai
ms.date: 02/08/2021
---

# Find the Host names of Cluster Nodes

HDInsight cluster is created with public DNS clustername.azurehdinsight.net. When you SSH to individual nodes or set connection to cluster nodes with in the same custom virtual network, you need to use host name, or fully qualified domain names (FQDN) of cluster nodes.

In this article, you learn how to get the host names of cluster nodes. You can get it manually through Ambari UI or automated through Ambari REST API.

[!WARNING]
> Please use the following recommended approaches to fetch host names of cluster nodes. The numbers in the host name is not guaranteed in sequence and HDInsight may change the host name format to align with VMs with release refresh. Don’t take the dependency on any certain naming convention that exists today. 
>

## Get the host names of cluster nodes
You can get the host names through Ambari UI or Ambari REST API. 

### Get the host names from Ambari UI
You can use Ambari UI to get the host names when you SSH to the node. 

![Get-Host-Names-In-Ambari-UI](.\media\find-host-name\find-host-name-in-ambari-ui.png)

### Get the host names from Ambari REST API
When building automation scripts,  you can use the Ambari REST API to get the host names before you make connections to hosts. The numbers in the host name are not guaranteed in sequence and HDInsight may change the host name format to align with VMs with release refresh. Don’t take the dependency on any certain naming convention that exists today. 

Here are some examples of how to retrieve the FQDN for the various nodes in the cluster. For more information about Ambari REST API, see [Manage HDInsight clusters by using the Apache Ambari REST API](.\hdinsight-hadoop-manage-ambari-rest-api.md)

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

