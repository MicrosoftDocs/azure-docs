---
title: Troubleshoot SNAT Port exhaustion issues in a Service Fabric managed cluster 
description: This article describes how to troubleshoot SNAT Port exhaustion issues in a Service Fabric managed cluster. 
ms.topic: how-to
ms.author: ankurjain
author: ankurjain
ms.service: service-fabric
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
services: service-fabric
ms.date: 09/05/2023
---

# Troubleshoot SNAT Port exhaustion issues in a Service Fabric managed cluster

This article provides more information on, and troubleshooting methodologies for, exhaustion of source network address translation (SNAT) ports in Service Fabric managed cluster. To learn more about SNAT ports, see [Source Network Address Translation for outbound connections](../load-balancer/load-balancer-outbound-connections).

## How to troubleshoot exhaustion of source network address translation (SNAT) ports

There are a few solutions that let you avoid SNAT port limitations with Service Fabric managed cluster. They include:

1. If your destination is an external endpoint outside of Azure, using Azure NAT Gateway gives you 64k outbound SNAT ports that are usable by the resources sending traffic through it. Azure NAT gateway is a highly resilient and scalable Azure service that provides outbound connectivity to the internet from your virtual network. NAT gateway also gives you a dedicated outbound address that you don't share with anybody. A NAT gateway’s unique method of consuming SNAT ports helps resolve common SNAT exhaustion and connection issues. A NAT gateway is highly recommended if your service is initiating repeated TCP or UDP outbound connections to the same destination. Here is how you can configure a Service Fabric managed cluster to use a NAT gateway. 

2. If your destination is an Azure service that supports service endpoints, you can avoid SNAT port exhaustion issues by using service endpoints (supported on all node types). To configure service endpoints, you need to add the following to the ARM template for the cluster resource and deploy:

#### ARM Template:

```json
        "serviceEndpoints": [ 
          { 
            "service": "Microsoft.Storage", 
            "locations": [ "southcentralus", "westus" ] 
          }, 
          { 
            "service": "Microsoft.ServiceBus" 
          } 
        ]
```

3. With Bring your own load balancer, you can define your own outbound rules or attach multiple outgoing public IP addresses to provide more SNAT ports (supported on secondary node types). 

4. For smaller scale deployments, you can consider assigning a public IP to a node (supported on secondary node types). If a public IP is assigned to a node, all ports provided by the public IP are available to the node. Unlike with a load balancer or a NAT gateway, the ports are only accessible to the single node associated with the IP address. 

5. Design your applications to use connections efficiently. Connection efficiency can reduce or eliminate SNAT port exhaustion in your deployed applications. 

General strategies for mitigating SNAT port exhaustion are discussed in the Problem-solving section of the Outbound connections of Azure documentation. If you require more help at any point in this article, contact the Azure experts at the MSDN Azure and the Stack Overflow forums. Alternatively, file an Azure support incident. Go to the Azure Support site and select Get Support. 
