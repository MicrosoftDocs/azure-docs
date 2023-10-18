---
title: Use NSG to restrict traffic on HDInsight on AKS
description: Learn how to secure traffic by NSGs on HDInsight on AKS 
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/3/2023
---

# Use NSG to restrict traffic to HDInsight on AKS

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS relies on AKS outbound dependencies and they're entirely defined with FQDNs, which don't have static addresses behind them. The lack of static IP addresses means one can't use Network Security Groups (NSGs) to lock down the outbound traffic from the cluster using IPs. 

If you still prefer to use NSG to secure your traffic, then you need to configure the following rules in the NSG to do a coarse-grained control. 

Learn [how to create a security rule in NSG](/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#create-a-security-rule). 

## Outbound security rules (Egress traffic)
### Common traffic

|Destination| Destination Endpoint| Protocol | Port |
|----|--------------------|----------|------|
| Service Tag | AzureCloud.`<Region>` | UDP      | 1194 |
| Service Tag | AzureCloud.`<Region>` | TCP      | 9000 |
| Any | * | TCP | 443, 80|

### Cluster specific traffic

This section outlines cluster specific traffic that an enterprise can apply.

#### Trino

|Destination| Destination Endpoint| Protocol  | Port|
|-----------|-------------------------|------|------|
| Any | * | TCP | 1433|
| Service Tag | Sql.`<Region>` | TCP      | 11000-11999 |

#### Spark

|Destination| Destination Endpoint | Protocol |Port|
|----|--------------------|----------|------|
| Any | * | TCP | 1433|
| Service Tag | Sql.`<Region>` | TCP      | 11000-11999 |
| Service Tag | Storage.`<Region>` | TCP      | 445 |

#### Apache Flink
None

## Inbound security rules (Ingress traffic) 

When clusters are created, then certain ingress public IPs also get created. To allow requests to be sent to the cluster, you need to allowlist the traffic to these public IPs with port 80 and 443. 

The following Azure CLI command can help you get the ingress public IP:

``` 
aksManagedResourceGroup=`az rest --uri https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusterpools/{clusterPoolName}\?api-version\=2023-06-01-preview --query properties.managedResourceGroupName -o tsv --query properties.aksManagedResourceGroupName -o tsv`

az network public-ip list --resource-group $aksManagedResourceGroup --query "[?starts_with(name, 'kubernetes')].{Name:name, IngressPublicIP:ipAddress}" --output table
```

|	Source 	|	Source IP addresses/CIDR ranges 	|	Protocol 	|	Port 	|
|	-	|-		|-		|	-	|
|	IP Addresses 	|	`<Public IP retrieved from above command>` 	|	TCP 	|	80 	|
|	IP Addresses 	|	`<Public IP retrieved from above command>` 	|	TCP 	|	443 	|


