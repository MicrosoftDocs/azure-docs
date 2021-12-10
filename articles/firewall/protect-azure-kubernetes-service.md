---
title: Use Azure Firewall to protect Azure Kubernetes Service (AKS) Deployments
description: Learn how to use Azure Firewall to protect Azure Kubernetes Service (AKS) Deployments
author: vhorne
ms.service: firewall
services: firewall
ms.topic: how-to
ms.date: 08/03/2021
ms.author: victorh
---

# Use Azure Firewall to protect Azure Kubernetes Service (AKS) Deployments

Azure Kubernetes Service (AKS) offers a managed Kubernetes cluster on Azure. It reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure. AKS handles critical tasks, such as health monitoring and maintenance for you and delivers an enterprise-grade and secure cluster with facilitated governance.

Kubernetes orchestrates clusters of virtual machines and schedules containers to run on those virtual machines based on their available compute resources and the resource requirements of each container. Containers are grouped into pods, the basic operational unit for Kubernetes, and those pods scale to the state that you want.

For management and operational purposes, nodes in an AKS cluster need to access certain ports and fully qualified domain names (FQDNs). These actions could be to communicate with the API server, or to download and then install core Kubernetes cluster components and node security updates. Azure Firewall can help you lock down your environment and filter outbound traffic.

See the following video by Jorge Cortes for an overview:

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RWIcAo]

Follow the guidelines in this article to provide additional protection for your Azure Kubernetes cluster using Azure Firewall.

## Prerequisites

- A deployed Azure Kubernetes cluster with running application.

   For more information, see [Tutorial: Deploy an Azure Kubernetes Service (AKS) cluster](../aks/tutorial-kubernetes-deploy-cluster.md) and [Tutorial: Run applications in Azure Kubernetes Service (AKS)](../aks/tutorial-kubernetes-deploy-application.md).


## Securing AKS

Azure Firewall provides an AKS FQDN Tag to simplify the configuration. Use the following steps to allow outbound AKS platform traffic:

- When you use Azure Firewall to restrict outbound traffic and create a user-defined route (UDR) to direct all outbound traffic, make sure you create an appropriate DNAT rule in Firewall to correctly allow inbound traffic. 

   Using Azure Firewall with a UDR breaks the inbound setup because of asymmetric routing. The issue occurs if the AKS subnet has a default route that goes to the firewall's private IP address, but you're using a public load balancer. For example, inbound or Kubernetes service of type *LoadBalancer*.

   In this case, the incoming load balancer traffic is received via its public IP address, but the return path goes through the firewall's private IP address. Because the firewall is stateful, it drops the returning packet because the firewall isn't aware of an established session. To learn how to integrate Azure Firewall with your ingress or service load balancer, see [Integrate Azure Firewall with Azure Standard Load Balancer](integrate-lb.md).
- Create an application rule collection and add a rule to enable the *AzureKubernetesService* FQDN tag. The source IP address range is the host pool virtual network, the protocol is https, and the destination is AzureKubernetesService.
- The following outbound ports / network rules are required for an AKS cluster:

   - TCP port 443
   - TCP [*IPAddrOfYourAPIServer*]:443 is required if you have an app that needs to talk to the API server. This change can be set after the cluster is created.
   - TCP port 9000,  and UDP port 1194 for the tunnel front pod to communicate with the tunnel end on the API server.

      To be more specific, see the addresses in the following table:

   | Destination Endpoint                                                             | Protocol | Port    | Use  |
   |----------------------------------------------------------------------------------|----------|---------|------|
   | **`*:1194`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:1194`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:1194`** <br/> *Or* <br/> **`APIServerIP:1194`** `(only known after cluster creation)`  | UDP           | 1194      | For tunneled secure communication between the nodes and the control plane. |
   | **`*:9000`** <br/> *Or* <br/> [ServiceTag](../virtual-network/service-tags-overview.md#available-service-tags) - **`AzureCloud.<Region>:9000`** <br/> *Or* <br/> [Regional CIDRs](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) - **`RegionCIDRs:9000`** <br/> *Or* <br/> **`APIServerIP:9000`** `(only known after cluster creation)`  | TCP           | 9000      | For tunneled secure communication between the nodes and the control plane. |

   - UDP port 123 for Network Time Protocol (NTP) time synchronization (Linux nodes).
   - UDP port 53 for DNS is also required if you have pods directly accessing the API server.

   For more information, see [Control egress traffic for cluster nodes in Azure Kubernetes Service (AKS)](../aks/limit-egress-traffic.md).
- Configure AzureMonitor and Storage service tags. Azure Monitor receives log analytics data.

   You can also allow your workspace URL individually: `<worksapceguid>.ods.opinsights.azure.com`, and `<worksapceguid>.oms.opinsights.azure.com`. You can address this in one of the following ways:

    - Allow https access from your host pool subnet to `*. ods.opinsights.azure.com`, and `*.oms. opinsights.azure.com`. These wildcard FQDNs enable the required access but are less restrictive.
    - Use the following log analytics query to list the exact required FQDNs, and then allow them explicitly in your firewall application rules:
   ```
   AzureDiagnostics 
   | where Category == "AzureFirewallApplicationRule" 
   | search "Allow" 
   | search "*. ods.opinsights.azure.com" or "*.oms. opinsights.azure.com"
   | parse msg_s with Protocol " request from " SourceIP ":" SourcePort:int " to " FQDN ":" * 
   | project TimeGenerated,Protocol,FQDN 
   ```


## Next steps

- Learn more about Azure Kubernetes Service, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)](../aks/concepts-clusters-workloads.md).
