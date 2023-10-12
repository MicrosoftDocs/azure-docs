---
title: Use firewall to restrict outbound traffic on HDInsight on AKS using Azure CLI 
description: Learn how to secure traffic using firewall on HDInsight on AKS using Azure CLI
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/3/2023
---

# Use firewall to restrict outbound traffic using Azure CLI

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

When an enterprise wants to use their own virtual network for the cluster deployments, securing the traffic of the virtual network becomes important.
This article provides the steps to secure outbound traffic from your HDInsight on AKS cluster via Azure Firewall using [Azure CLI](/azure/cloud-shell/quickstart?tabs=azurecli).

The following diagram illustrates the example used in this article to simulate an enterprise scenario:

:::image type="content" source="./media/secure-traffic-by-firewall/network-flow.png" alt-text="Diagram showing the network flow." lightbox="./media/secure-traffic-by-firewall/network-flow.png":::

The example demonstrated in this article is using **Azure Could Shell**.

## Define the variables

**Copy and execute in the Azure Cloud Shell to set the values of these variables.**

```azurecli
PREFIX="hdiaks-egress"
RG="${PREFIX}-rg"
LOC="eastus"
HDIAKS_CLUSTER_POOL=${PREFIX}
VNET_NAME="${PREFIX}-vnet"
HDIAKS_SUBNET_NAME="${PREFIX}-subnet"
# DO NOT CHANGE FWSUBNET_NAME - This is currently a requirement for Azure Firewall.
FWSUBNET_NAME="AzureFirewallSubnet"
FWNAME="${PREFIX}-fw"
FWPUBLICIP_NAME="${PREFIX}-fwpublicip"
FWIPCONFIG_NAME="${PREFIX}-fwconfig"
FWROUTE_NAME="${PREFIX}-fwrn"
FWROUTE_NAME_INTERNET="${PREFIX}-fwinternet"
```
:::image type="content" source="./media/secure-traffic-by-firewall/cloud-shell-displays-variables.png" alt-text="Diagram showing the Cloud Shell variables." border="true" lightbox="./media/secure-traffic-by-firewall/cloud-shell-displays-variables.png":::

## Create a virtual network and subnets

1.	Create a resource group using the az group create command.

  	   ```azurecli
      az group create --name $RG --location $LOC
      ```

1. Create a virtual network and two subnets.
   
   1. Virtual network with subnet for HDInsight on AKS cluster pool

       ```azurecli
        az network vnet create \
             --resource-group $RG \
             --name $VNET_NAME \
             --location $LOC \
             --address-prefixes 10.0.0.0/8 \
             --subnet-name $HDIAKS_SUBNET_NAME \
             --subnet-prefix 10.1.0.0/16
         ```
        
   1. Subnet for Azure Firewall.
      ```azurecli
      az network vnet subnet create \
         --resource-group $RG \
         --vnet-name $VNET_NAME \
         --name $FWSUBNET_NAME \
         --address-prefix 10.2.0.0/16
      ```
      > [!Important]
      > 1. If you add NSG in subnet `HDIAKS_SUBNET_NAME`, you need to add certain outbound and inbound rules manually. Follow [use NSG to restrict the traffic](./secure-traffic-by-nsg.md).
      > 1. Don't associate subnet `HDIAKS_SUBNET_NAME` with a route table because HDInsight on AKS creates cluster pool with default outbound type and can't create the cluster pool in a subnet already associated with a route table.

## Create HDInsight on AKS cluster pool using Azure portal

  1. Create a cluster pool.
    
     :::image type="content" source="./media/secure-traffic-by-firewall/basic-tab.png" alt-text="Diagram showing the cluster pool basic tab." border="true" lightbox="./media/secure-traffic-by-firewall/basic-tab.png":::
    
     :::image type="content" source="./media/secure-traffic-by-firewall/security-tab.png" alt-text="Diagram showing the security tab." border="true" lightbox="./media/secure-traffic-by-firewall/security-tab.png":::
    
  1. When HDInsight on AKS cluster pool is created, you can find a route table in subnet `HDIAKS_SUBNET_NAME`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall/route-table.png" alt-text="Diagram showing the route table." border="true" lightbox="./media/secure-traffic-by-firewall/route-table.png":::

### Get AKS cluster details created behind the cluster pool

  Follow the steps to get the AKS cluster information, which is useful in the subsequent steps.
    
  ```azurecli
  AKS_MANAGED_RG=$(az network vnet subnet show --name $HDIAKS_SUBNET_NAME --vnet-name $VNET_NAME --resource-group $RG --query routeTable.resourceGroup -o tsv)

  AKS_ID=$(az group show --name $AKS_MANAGED_RG --query managedBy -o tsv)

  HDIAKS_MANAGED_RG=$(az resource show --ids $AKS_ID --query "resourceGroup" -o tsv)

  API_SERVER=$(az aks show --name $HDIAKS_CLUSTER_POOL --resource-group $HDIAKS_MANAGED_RG --query fqdn -o tsv)
  ```

## Create firewall

1. Create a Standard SKU public IP resource. This resource is used as the Azure Firewall frontend address.

    ```azurecli
    az network public-ip create -g $RG -n $FWPUBLICIP_NAME -l $LOC --sku "Standard"
    ```
   
1. Register the Azure Firewall preview CLI extension to create an Azure Firewall.

    ```azurecli
       az extension add --name azure-firewall
   ```
1. Create an Azure Firewall and enable DNS proxy.

    ```azurecli
       az network firewall create -g $RG -n $FWNAME -l $LOC --enable-dns-proxy true
    ```
   
1. Create an Azure Firewall IP configuration.

    ```azurecli
    az network firewall ip-config create -g $RG -f $FWNAME -n $FWIPCONFIG_NAME --public-ip-address $FWPUBLICIP_NAME --vnet-name $VNET_NAME
    ```

1.	Once the IP configuration command succeeds, save the firewall frontend IP address for configuration later.

    ```azurecli
    FWPUBLIC_IP=$(az network public-ip show -g $RG -n $FWPUBLICIP_NAME --query "ipAddress" -o tsv)
  	FWPRIVATE_IP=$(az network firewall show -g $RG -n $FWNAME --query "ipConfigurations[0].privateIPAddress" -o tsv)
    ```
### Add network and application rules to the firewall

1. Create the network rules.
   
    ```azurecli
    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'apiudp' --protocols 'UDP' --source-addresses '*' --destination-addresses "AzureCloud.$LOC" --destination-ports 1194 --action allow --priority 100

    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'apitcp' --protocols 'TCP' --source-addresses '*' --destination-addresses "AzureCloud.$LOC" --destination-ports 9000
    
    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'apiserver' --protocols 'TCP' --source-addresses '*' --destination-fqdns "$API_SERVER" --destination-ports 443
    
    #Add below step, in case you are integrating log analytics workspace
    
    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'azuremonitor' --protocols 'TCP' --source-addresses '*' --destination-addresses "AzureMonitor" --destination-ports 443
    ```

1. Create the application rules.
   
    ```azurecli
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'aks-fqdn' --source-addresses '*' --protocols 'http=80' 'https=443' --fqdn-tags "AzureKubernetesService" --action allow --priority 100 
    
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'acr' --source-addresses '*' --protocols 'https=443' --target-fqdns "hiloprodrpacr00.azurecr.io"
    
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'blob' --source-addresses '*' --protocols 'https=443' --target-fqdns "*.blob.core.windows.net"
    
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'servicebus' --source-addresses '*' --protocols 'https=443' --target-fqdns "*.servicebus.windows.net"
    
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'gsm' --source-addresses '*' --protocols 'https=443' --target-fqdns "*.table.core.windows.net"
    
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'gcsmonitoring' --source-addresses '*' --protocols 'https=443' --target-fqdns "gcs.prod.monitoring.core.windows.net"
    
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'graph' --source-addresses '*' --protocols 'https=443' --target-fqdns "graph.microsoft.com"
    ```

### Create route in the route table to redirect the traffic to firewall

1.	Get the route table associated with HDInsight on AKS cluster pool.
   
    ```azurecli
    ROUTE_TABLE_ID=$(az network vnet subnet show --name $HDIAKS_SUBNET_NAME --vnet-name $VNET_NAME --resource-group $RG --query routeTable.id -o tsv)
    
    ROUTE_TABLE_NAME=$(az network route-table show --ids $ROUTE_TABLE_ID --query 'name' -o tsv)
    ```
1. Create the route.
    ```azurecli
    az network route-table route create -g $AKS_MANAGED_RG --name $FWROUTE_NAME --route-table-name $ROUTE_TABLE_NAME --address-prefix 0.0.0.0/0 --next-hop-type VirtualAppliance --next-hop-ip-address $FWPRIVATE_IP
    
    az network route-table route create -g $AKS_MANAGED_RG --name $FWROUTE_NAME_INTERNET --route-table-name $ROUTE_TABLE_NAME --address-prefix $FWPUBLIC_IP/32 --next-hop-type Internet
   ```
## Create cluster
 
In the previous steps, we have routed the traffic to firewall.

The following steps provide details about the specific network and application rules needed by each cluster type. You can refer to the cluster creation pages for creating [Apache Flink](./flink/flink-create-cluster-portal.md), [Trino](./trino/trino-create-cluster.md), and [Apache Spark](./spark/hdinsight-on-aks-spark-overview.md) clusters based on your need.


> [!IMPORTANT]
> Before creating a cluster, make sure to run the following cluster specific rules to allow the traffic.

### Trino

1. Add the following network and application rules for a Trino cluster.

   ```azurecli
    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'dfs' --source-addresses '*' --protocols 'https=443' --target-fqdns "*.dfs.core.windows.net"

    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'mysql' --source-addresses '*' --protocols 'mssql=1433' --target-fqdns "*.database.windows.net"  
   ```

   **Change the `Sql.<Region>` in following syntax to your region as per your requirement. For example: `Sql.EastUS`**

   ```azurecli
    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'mysql' --protocols 'TCP' --source-addresses '*' --destination-addresses Sql.<Region> --destination-ports "11000-11999"
   ```

### Apache Flink

1. Add the following application rule for an Apache Flink cluster.

   ```azurecli
   az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'dfs' --source-addresses '*' --protocols 'https=443' --target-fqdns "*.dfs.core.windows.net"
   ```

### Apache Spark

1. Add the following network and application rules for a Spark cluster.
  
   **Change the `Storage.<Region>` in the following syntax to your region as per your requirement. For example: `Storage.EastUS`**

   ```azurecli
    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'smb' --protocols 'TCP' --source-addresses '*' --destination-addresses "Storage.<Region>" --destination-ports 445

    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'dfs' --source-addresses '*' --protocols 'https=443' --target-fqdns "*.dfs.core.windows.net"
    ```
  
   **Change the `Sql.<Region> `in the following syntax to your region as per your requirement. For example: `Sql.EastUS`**

   ```azurecli
    az network firewall network-rule create -g $RG -f $FWNAME --collection-name 'aksfwnr' -n 'mysql' --protocols 'TCP' --source-addresses '*' --destination-addresses "Sql.<Region>" --destination-ports '11000-11999'

    az network firewall application-rule create -g $RG -f $FWNAME --collection-name 'aksfwar' -n 'mysql' --source-addresses '*' --protocols 'mssql=1433' --target-fqdns "*.database.windows.net"
    ```

### Solve symmetric routing issue

  The following steps allow you to request cluster by cluster load balancer ingress service and ensure the network response traffic doesn't flow to firewall.
  Add a route to the route table to redirect the response traffic to your client IP to Internet and then, you can reach the cluster directly. 
  
    
  ```azurecli
  az network route-table route create -g $AKS_MANAGED_RG --name clientip --route-table-name $ROUTE_TABLE_NAME --address-prefix {Client_IPs} --next-hop-type Internet
  ```

  If you can't reach the cluster and have configured NSG, follow [use NSG to restrict the traffic](./secure-traffic-by-nsg.md) to allow the traffic.

> [!TIP]
> If you want to allow more traffic, you can configure it over the firewall.

## How to debug

If you find the cluster works unexpectedly, you can check the firewall logs to find which traffic is blocked.

