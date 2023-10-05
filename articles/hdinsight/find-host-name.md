---
title: How to get the host names of Azure HDInsight cluster nodes
description: Learn about how to get host names and FQDN name of Azure HDInsight cluster nodes.
ms.service: hdinsight
ms.topic: how-to
author: reachnijel
ms.author: nijelsf
ms.date: 09/19/2023
---

# Find the host names of cluster nodes

HDInsight cluster is created with public DNS `clustername.azurehdinsight.net`. When you SSH to individual nodes or set up a connection to cluster nodes within the same custom virtual network, you need to use the host name or fully qualified domain names (FQDN) of cluster nodes.

In this article, you learn how to get the host names of cluster nodes. You can get it manually through Ambari Web UI or automatically through Ambari REST API.

> [!WARNING]
> Please use the following recommended approaches to fetch host names of cluster nodes. The numbers in the host name is not guaranteed in sequence and HDInsight may change the host name format to align with VMs with release refresh. Don’t take the dependency on any certain naming convention that exists today.
>

You can get the host names through Ambari UI or Ambari REST API.

## Get the host names from Ambari Web UI
You can use Ambari Web UI to get the host names when you SSH to the node. The Ambari Web UI hosts view is available on your HDInsight cluster at `https://CLUSTERNAME.azurehdinsight.net/#/main/hosts`, where `CLUSTERNAME` is the name of your cluster.

![Get-Host-Names-In-Ambari-UI](.\media\find-host-name\find-host-name-in-ambari-ui.png)

## Get the host names from Ambari REST API
When building automation scripts,  you can use the Ambari REST API to get the host names before you make connections to hosts. The numbers in the host name are not guaranteed in sequence and HDInsight may change the host name format to align with VMs with release refresh. Don’t take the dependency on any certain naming convention that exists today. 

Here are some examples of how to retrieve the FQDN for the nodes in the cluster. For more information about Ambari REST API, see [Manage HDInsight clusters by using the Apache Ambari REST API](.\hdinsight-hadoop-manage-ambari-rest-api.md)

The following example uses [jq](https://stedolan.github.io/jq/) or [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json) to parse the JSON response document and display only the host names.

```bash
export PASSWORD=''
export CLUSTER_NAME=''
curl -u admin:$PASSWORD -sS -G "https://$CLUSTERNAME.azurehdinsight.net/api/v1/clusters/$CLUSTERNAME/hosts" \
| jq -r '.items[].Hosts.host_name'
```  

```powershell
$clusterName=''
$creds = Get-Credential -UserName "admin" -Message "Enter the HDInsight login"
$resp = Invoke-WebRequest -Uri "https://$clusterName.azurehdinsight.net/api/v1/clusters/$clusterName/hosts" `
    -Credential $creds -UseBasicParsing
$respObj = ConvertFrom-Json $resp.Content
$respObj.items.Hosts.host_name
```
