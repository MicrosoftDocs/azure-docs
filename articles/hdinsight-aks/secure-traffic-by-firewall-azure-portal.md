---
title: Use firewall to restrict outbound traffic on HDInsight on AKS, using Azure portal
description: Learn how to secure traffic using firewall on HDInsight on AKS using Azure portal
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/3/2023
---

# Use firewall to restrict outbound traffic using Azure portal

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

When an enterprise wants to use their own virtual network for the cluster deployments, securing the traffic of the virtual network becomes important.
This article provides the steps to secure outbound traffic from your HDInsight on AKS cluster via Azure Firewall using Azure portal.

The following diagram illustrates the example used in this article to simulate an enterprise scenario:

:::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/network-flow.png" alt-text="Diagram showing the network flow." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/network-flow.png":::


## Create a virtual network and subnets
    
  1.  Create a virtual network and two subnets.
    
      In this step, set up a virtual network and two subnets for configuring the egress specifically.
    
       :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-virtual-network-step-2.png" alt-text="Diagram showing creating a virtual network in the resource group using Azure portal step number 2." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-virtual-network-step-2.png":::
  
       :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-virtual-network-step-3.png" alt-text="Diagram showing creating a virtual network and setting IP address using Azure portal step 3." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-virtual-network-step-3.png":::
    
      :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-virtual-network-step-4.png" alt-text="Diagram showing creating a virtual network and setting IP address using Azure portal in step number four." border= "true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-virtual-network-step-4.png":::
     
      > [!IMPORTANT]
      > * If you add NSG in subnet , you need to add certain outbound and inbound rules manually. Follow [use NSG to restrict the traffic](./secure-traffic-by-nsg.md).
      > * Don't associate subnet `hdiaks-egress-subnet` with a route table because HDInsight on AKS creates cluster pool with default outbound type and can't create the cluster pool in a subnet already associated with a route table.

## Create HDInsight on AKS cluster pool using Azure portal

  1. Create a cluster pool.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-step-5.png" alt-text="Diagram showing creating a HDInsight on AKS cluster pool using Azure portal in step number five." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-step-5.png":::
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-step-6.png" alt-text="Diagram showing creating a HDInsight on AKS cluster pool networking using Azure portal step 6." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-step-6.png":::
    
  2. When HDInsight on AKS cluster pool is created, you can find a route table in subnet `hdiaks-egress-subnet`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-step-7.png" alt-text="Diagram showing creating a HDInsight on AKS cluster pool networking using Azure portal step 7." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-step-7.png":::

### Get AKS cluster details created behind the cluster pool

You can search your cluster pool name in portal, and go to AKS cluster. For example,

:::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-step-8.png" alt-text="Diagram showing creating a HDInsight on AKS cluster pool kubernetes networking using Azure portal step 8." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-step-8.png":::

Get AKS API Server details.

:::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-aks-step-9.png" alt-text="Diagram showing creating a HDInsight on AKS cluster pool kubernetes networking using Azure portal  step 9." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-pool-networking-aks-step-9.png":::

## Create firewall

  1. Create firewall using Azure portal.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-step-10.png" alt-text="Diagram showing creating a firewall using Azure portal  step 10." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-step-10.png":::
    
  3. Enable DNS proxy server of firewall.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-dns-proxy-step-11.png" alt-text="Diagram showing creating a firewall and DNS proxy using Azure portal step 11." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-dns-proxy-step-11.png":::
    
  5. Once the firewall is created, find the firewall internal IP and public IP.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-dns-proxy-step-12.png" alt-text="Diagram showing creating a firewall and DNS proxy internal and public IP using Azure portal step 12." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-dns-proxy-step-12.png":::

### Add network and application rules to the firewall

  1. Create the network rule collection with following rules.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-step-13.png" alt-text="Diagram showing adding firewall rules using Azure portal step 13." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-step-13.png":::
    
  2. Create the application rule collection with following rules.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-step-14.png" alt-text="Diagram showing adding firewall rules using Azure portal step 14." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-step-14.png":::

### Create route in the route table to redirect the traffic to firewall

Add new routes to route table to redirect the traffic to the firewall.

:::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-route-table-step-15.png" alt-text="Diagram showing adding route table entries using Azure portal step 15." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-route-table-step-15.png":::

:::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-route-table-entry-step-15.png" alt-text="Diagram showing how to add route table entries using Azure portal step 15." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-firewall-rules-route-table-entry-step-15.png":::

## Create cluster

In the previous steps, we have routed the traffic to firewall. 

The following steps provide details about the specific network and application rules needed by each cluster type. You can refer to the cluster creation pages for creating [Apache Flink](./flink/flink-create-cluster-portal.md), [Trino](./trino/trino-create-cluster.md), and [Apache Spark](./spark/hdinsight-on-aks-spark-overview.md) clusters based on your need.

> [!IMPORTANT]
> Before creating the cluster, make sure to add the following cluster specific rules to allow the traffic.

### Trino

  1. Add the following rules to application rule collection `aksfwar`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-trino-step-16.png" alt-text="Diagram showing adding application rules for Trino Cluster using Azure portal step 16." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-trino-step-16.png":::
    
  2. Add the following rule to network rule collection `aksfwnr`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-trino-1-step-16.png" alt-text="Diagram showing how to add application rules to network rule collection for Trino Cluster using Azure portal step 16." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-trino-1-step-16.png":::
    
     > [!NOTE]
     > Change the `Sql.<Region>` to your region as per your requirement. For example: `Sql.WestEurope`

### Apache Flink

  1. Add the following rule to application rule collection `aksfwar`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-flink-step-17.png" alt-text="Diagram showing adding application rules for Apache Flink Cluster using Azure portal step 17." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-flink-step-17.png":::

### Apache Spark

  1. Add the following rules to application rule collection `aksfwar`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-spark-step-18.png" alt-text="Diagram showing adding application rules for Apache Flink Cluster using Azure portal step 18."  border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/create-cluster-spark-1-step-18.png":::
    
  2. Add the following rules to network rule collection `aksfwnr`.
    
     :::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/create-cluster-spark-1-step-18.png" alt-text="Diagram showing how to add application rules for Apache Flink Cluster using Azure portal step 18." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal//create-cluster-spark-1-step-18.png":::
    
     > [!NOTE]
     > 1. Change the `Sql.<Region>` to your region as per your requirement. For example: `Sql.WestEurope`
     > 2. Change the `Storage.<Region>` to your region as per your requirement. For example: `Storage.WestEurope`


## Solving symmetric routing issue

The following steps allow us to request cluster by cluster load balancer ingress service and ensure the network response traffic doesn't flow to firewall.

Add a route to the route table to redirect the response traffic to your client IP to Internet and then, you can reach the cluster directly.

:::image type="content" source="./media/secure-traffic-by-firewall-azure-portal/solve-symmetric-routing-step-19.png" alt-text="Diagram showing how to solve symmetric routing issue with adding a route table entry in step number 19." border="true" lightbox="./media/secure-traffic-by-firewall-azure-portal/solve-symmetric-routing-step-19.png":::

 If you can't reach the cluster and have configured NSG, follow [use NSG to restrict the traffic](./secure-traffic-by-nsg.md) to allow the traffic.

> [!TIP]
> If you want to permit more traffic, you can configure it over the firewall.

## How to Debug
If you find the cluster works unexpectedly, you can check the firewall logs to find which traffic is blocked.
