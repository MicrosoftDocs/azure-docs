---
title: Enable Private Link on an HDInsight Kafka Rest Proxy cluster
description: Learn how to Enable Private Link on an HDInsight Kafka Rest Proxy cluster. 
ms.service: hdinsight
ms.topic: conceptual
ms.date: 08/30/2022
---

# Enable Private Link on an HDInsight Kafka Rest Proxy cluster

These are the additional steps  to enable private link for Kafka Rest Proxy HDI clusters.


## Step 1: Create private endpoints

Azure automatically creates a Private link service for the Ambari and SSH load balancers during the Private Link cluster deployment. After the cluster is deployed, you have to create two Private endpoints on the client VNET(s), one for Ambari and one for SSH access. Then, link them to the Private link services, which were created as part of the cluster deployment.

To create the private endpoints:
1. Open the Azure portal and search for 'Private link'.
2. In the results, click the Private link icon.
3. Click 'Create private endpoint' and use the following configurations to set up the Ambari private endpoint:
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-privlink-cluster |
    | Resource type | Microsoft.Network/privateLinkServices |
    | Resource | gateway-* (This value should match the HDI deployment ID of your cluster, for example gateway-4eafe3a2a67e4cd88762c22a55fe4654) |
    | Virtual network | hdi-privlink-client-vnet |
    | Subnet | default |

4. Click 'Create private endpoint' and use the following configurations to set up another Ambari private endpoint:
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-privlink-cluster-1 |
    | Resource type | Microsoft.Network/privatelinkServices |
    | Resource | kafkamanagementnode-* (This value should match the HDI deployment ID of your cluster, for example kafkamanagementnode 4eafe3a2a67e4cd88762c22a55fe4654) |
    | Virtual network | hdi-privlink-client-vnet |
    | Subnet | default |

5. Repeat the process to create another private endpoint for SSH access using the following configurations:
    
    | Config | Value |
    | ------ | ----- |
    | Name | hdi-privlink-cluster-ssh |
    | Resource type | Microsoft.Network/privateLinkServices |
    | Resource | headnode-* (This value should match the HDI deployment ID of your cluster, for example headnode-4eafe3a2a67e4cd88762c22a55fe4654) |
    | Virtual network | hdi-privlink-client-vnet |
    | Subnet | default |
    
Once the private endpoints are created, you’re done with this phase of the setup. If you didn’t make a note of the private IP addresses assigned to the endpoints, follow the steps below:

1. Open the client VNET in the Azure portal. 
2. Click the 'Overview' tab.
3. You should see both the Ambari and ssh Network interfaces listed and their private IP Addresses. 
4. Make a note of these IP addresses because they're required to connect to the cluster and properly configure DNS.

## Step 2: Configure DNS to connect over private endpoints

To access private clusters, you can configure DNS resolution through private DNS zones. The Private Link entries created in the Azure-managed public DNS zone `azurehdinsight.net` are as follows:

```dns
<clustername>        CNAME    <clustername>.privatelink
<clustername>-int    CNAME    <clustername>-int.privatelink
<clustername>-ssh    CNAME    <clustername>-ssh.privatelink
```
The following image shows an example of the private DNS entries configured to enable access to a cluster from a virtual network that isn't peered or doesn't have a direct line of sight to the cluster. You can use an Azure DNS private zone to override `*.privatelink.azurehdinsight.net` fully qualified domain names (FQDNs) and resolve private endpoints' IP addresses in the client's network. The configuration is only for `<clustername>.azurehdinsight.net` in the example, but it also extends to other cluster endpoints.

:::image type="content" source="media/hdinsight-private-link/access-private-clusters.png" alt-text="Diagram of the Private Link architecture.":::

To configure DNS resolution through a Private DNS zone:
    
1. Create an Azure Private DNS zone. (We aren't including all configs here, all other configs are left at default values)
    
    | Config | Value |
    | ------ | ----- |
    | Name | privatelink.azurehdinsight.net |
    
2. Add a Record set to the Private DNS zone for Ambari.
    
    | Config | Value |
    | ------ | ----- |
    | Name | YourPrivateLinkClusterName |
    | Type | A - Alias record to IPv4 address |
    | TTL | 1 |
    | TTL unit | Hours |
    | IP Address | Private IP of private endpoint for Ambari access |
    
3. Add another record set to the Private DNS for Ambari.
    
    | Config | Value |
    | ------ | ----- |
    | Name | YourPrivatelinkClusterName-1 |
    | Type | A - Alias record to 1Pv4 address |
    | TTL | 1 |
    | TTL unit | Hours |
    | IP Address | Private IP of private endpoint for Ambari access |
    
4. Add a Record set to the Private DNS zone for SSH.
    
    | Config | Value |
    | ------ | ----- |
    | Name | YourPrivateLinkClusterName-ssh |
    | Type | A - Alias record to IPv4 address |
    | TTL | 1 |
    | TTL unit | Hours |
    | IP Address | Private IP of private endpoint for SSH access |
    
5. Associate the private DNS zone with the client VNET by adding a Virtual Network Link.
    1. Open the private DNS zone in the Azure portal.
    1. Click the 'Virtual network links' tab.
    1. Click the 'Add' button.
    1. Fill in the details: Link name, Subscription, and Virtual Network
    1. Click **Save**.

## Next steps

* [Enterprise Security Package for Azure HDInsight](enterprise-security-package.md)
* [Enterprise security general information and guidelines in Azure HDInsight](./domain-joined/general-guidelines.md)
