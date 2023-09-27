---
title: Enable Private Link on an Azure HDInsight Kafka Rest Proxy cluster
description: Learn how to Enable Private Link on an Azure HDInsight Kafka Rest Proxy cluster. 
ms.service: hdinsight
ms.topic: conceptual
ms.author: piyushgupta
author: piyush-gupta1999
ms.date: 09/19/2023
---

# Enable Private Link on an HDInsight Kafka Rest Proxy cluster

Follow these extra steps to enable private link for Kafka Rest Proxy HDI clusters.

## Prerequisites 

As a prerequisite, complete the steps mentioned in [Enable Private Link on an Azure HDInsight cluster document](./hdinsight-private-link.md), then perform the below steps. 

## Create private endpoints

1. Click 'Create private endpoint' and use the following configurations to set up another Ambari private endpoint:
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-prilink-cluster-restproxy |
    | Resource type | Microsoft.Network/privatelinkServices |
    | Resource | kafkamanagementnode-* (This value should match the HDI deployment ID of your cluster, for example kafkamanagementnode 4eafe3a2a67e4cd88762c22a55fe4654) |
    | Virtual network | hdi-privlink-client-vnet |
    | Subnet | default |

## Configure DNS to connect over private endpoints
     
1. Add another record set to the Private DNS for Ambari.
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-prilink-cluster-restproxy |
    | Type | A - Alias record to 1Pv4 address |
    | TTL | 1 |
    | TTL unit | Hours |
    | IP Address | Private IP of private endpoint for Ambari access |
    
## Next steps

* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)
