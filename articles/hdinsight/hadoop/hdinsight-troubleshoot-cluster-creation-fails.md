---
title: Troubleshoot cluster creation failures with Azure HDInsight
description: Learn how to troubleshoot Apache cluster creation issues for Azure HDInsight.
ms.service: azure-hdinsight
ms.custom: hdinsightactive
ms.topic: troubleshooting
author: hareshg
ms.author: hgowrisankar
ms.reviewer: nijelsf
ms.date: 07/23/2024
#Customer intent: As an HDInsight user, I would like to understand how to resolve common cluster creation failures.
---

# Troubleshoot cluster creation failures with Azure HDInsight

The following issues are most common root causes for cluster creation failures:

- Permission issues
- Resource policy restrictions
- Firewalls
- Resource locks
- Unsupported component versions
- Storage account name restrictions
- Service outages

## Permissions issues

If you're using Azure Data Lake Storage Gen2, and receive the error `AmbariClusterCreationFailedErrorCode`: ":::no-loc text="Internal server error occurred while processing the request. Please retry the request or contact support.":::", open the Azure portal, go to your Storage account, and under Access Control (IAM), ensure that the **Storage Blob Data Contributor** or the **Storage Blob Data Owner** role has Assigned access to the **User assigned managed identity** for the subscription. See [Set up permissions for the managed identity on the Data Lake Storage Gen2](../hdinsight-hadoop-use-data-lake-storage-gen2-portal.md#set-up-permissions-for-the-managed-identity-on-the-data-lake-storage-gen2) for detailed instructions.

If using Azure Storage, ensure that storage account name is valid during the cluster creation.

## Resource policy restrictions

Subscription-based Azure policies can deny the creation of public IP addresses. HDInsight cluster creation requires two public IPs.  

In general, the following policies can impact cluster creation:

* Policies preventing creation of IP Address & Load balancers within the subscription.
* Policy preventing creation of storage account.
* Policy preventing deletion of networking resources (IP Address /Load Balancers).

## Firewalls

Firewalls on your virtual network or storage account can deny communication with HDInsight management IP addresses.

Allow traffic from the IP addresses in the table.

| Source IP address | Destination | Direction |
|---|---|---|
| 168.61.49.99 | *:443 | Inbound |
| 23.99.5.239 | *:443 | Inbound |
| 168.61.48.131 | *:443 | Inbound |
| 138.91.141.162 | *:443 | Inbound |

Also add the IP addresses specific to the region where the cluster is created. See [HDInsight management IP addresses](../hdinsight-management-ip-addresses.md) for a listing of the addresses for each Azure region.

If you're using an express route or your own custom DNS server, see [Plan a virtual network for Azure HDInsight - connecting multiple networks](../hdinsight-plan-virtual-network-deployment.md#multinet).

## Resources lock  

Ensure that there are no [locks on your virtual network and resource group](../../azure-resource-manager/management/lock-resources.md). Clusters can't be created or deleted if the resource group is locked. 

## Unsupported component versions

Ensure that you're using a [supported version of Azure HDInsight and Apache Hadoop component](../hdinsight-component-versioning.md) in your solution.  

## Storage account name restrictions

Storage account names can't be more than 24 characters and can't contain a special character. These restrictions also apply to the default container name in the storage account.

Other naming restrictions also apply for cluster creation. See [Cluster name restrictions](../hdinsight-hadoop-provision-linux-clusters.md#cluster-name), for more information.

## Service outages

Check [Azure status](https://azure.status.microsoft) for any potential outages or service issues.

## Next steps

* [Extend Azure HDInsight using an Azure Virtual Network](../hdinsight-plan-virtual-network-deployment.md)
* [Use Azure Data Lake Storage Gen2 with Azure HDInsight clusters](../hdinsight-hadoop-use-data-lake-storage-gen2.md)  
* [Use Azure storage with Azure HDInsight clusters](../hdinsight-hadoop-use-blob-storage.md)
* [Set up clusters in HDInsight with Apache Hadoop, Apache Spark, Apache Kafka, and more](../hdinsight-hadoop-provision-linux-clusters.md)
