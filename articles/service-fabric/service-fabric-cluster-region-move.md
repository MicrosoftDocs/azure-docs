---
title: Azure Service Fabric Region Move 
description: Learn how to migrate an Azure Service Fabric cluster and applications to another Region.
ms.topic: conceptual
ms.date: 07/20/2021
ms.author: micraft
---

# Azure Service Fabric clusters and Regions

Service Fabric Cluster Resources are inherently scoped to a region. This means that today “Region Move” is accomplished by first creating a new cluster in the destination region, and then migrating existing workloads and then traffic to that new destination region. In this document we outline the steps necessary to accomplish this. Note that there are several decision points which can make the migration more or less complex depending on exactly how you have set up and configured your cluster and applications, how communication works in your cluster, and whether your workloads are stateless, stateful, or a mix of the two.  


## Steps to follow for a region migration

Before engaging in any true regional migration, please establish a testbed and practice these steps to verify that they work for your workload. 

1. [Set up a cluster in the new region](./service-fabric-cluster-creation-via-arm.md#use-your-own-custom-template) by repurposing your existing ARM template for your cluster and infrastructure topology. If you do not currently have an ARM template that describes your cluster, then the recommendation is to utilize [Azure Resource Explorer](https://resources.azure.com/) to discover your current deployed resources and their configuration, and use this information to craft one or more ARM templates that allow you to repeatably deploy clones of your existing environment. Please test and confirm this stage before continuing. 

2. [Deploy existing applications and services via ARM](service-fabric-application-arm-resource.md). Note that you must take care to preserve any application parameter or configuration customizations you have performed. For example, if your application has a parameter “count” with a default value of 5, but in your source environment you have upgraded that parameter’s value to be 7, you will want to ensure that the application deployment in the new region has the value set to 7. If you do not use ARM to manage your application and service instances, you are responsible for identifying the current set of applications and services running in the current region and their configuration, and duplicating those applications and services in the new region/cluster. 

3. Migrate your services  
   -  For stateful workloads: 
      * <p>In order to ensure that your stateful services have reached a stable point, first ensure that you have stopped incoming traffic to those services. How you do this will depend on how traffic is delivered to your services. For example, you might have to cut the service off from Event Hubs or prevent a service like APIM or the Azure Network Load Balancer from routing traffic to the service by removing appropriate routing or forwarding rules. Once traffic has ceased and the services have completed any background work related to those requests, then you can continue. 
      * [Take a backup from any stateful services](service-fabric-reliable-services-backup-restore.md) (after the traffic has ceased and any background processing work is complete), and then restore the data into the stateful services in the new region and cluster.</p>
   -  For stateless services: 
      * <p>There should be no additional work beyond deploying the services into the new cluster, ideally as a part of the ARM application deployment accomplished in step 2, and ensuring that they are configured the same as in the source cluster.</p>
   -  For all services:  
      * Ensure that any communication stages between clients and the services are configured similarly to the source cluster. For example, this may include ensuring that intermediaries like Event Hubs, Network Load Balancers, Network Security Groups, App Gateways, or APIM are setup with corresponding rules necessary to allow traffic to flow to the cluster.  

4. Redirect traffic from the old region to the new region. How exactly this works will depend on whether you desire to keep the existing region or deprecate it, and will also depend on how traffic flows within your application. You may need to investigate whether private/public IPs or DNS names can be moved between different Azure resources in different regions. Service Fabric is generally not aware of this part of your system, so please investigate and if necessary involve the Azure teams involved in your traffic flow, particularly if it is more complex or if your workload is latency-critical. Documents such as [Configure Custom Domain](../api-management/configure-custom-domain.md), [Public IP Addresses](../virtual-network/public-ip-addresses.md) and [DNS Zones and Records](../dns/dns-zones-records.md) may be useful, and are examples of the information you will need depending on your traffic flows and protocols. Two scenarios demonstrating redirection:  
   * If you do not plan to keep the existing source region and you have a DNS/CNAME associated with the public IP of a Network Load Balancer that is delivering calls to your original source cluster. That DNS/CNAME would have to be updated to be associated with a new public IP of the new network load balancer in the new region. Completing that transfer would cause clients using the existing cluster to switch to using the new cluster. 
  
   * If you do plan to keep the existing source region and you have a DNS/CNAME associated with the public IP of a Network Load Balancer that was delivering calls to your original source cluster. You could set up an instance of Azure Traffic Manager and then associate the DNS name with that Azure Traffic Manager Instance. The Azure Traffic Manager could be configured to then route to the individual Network Load Balancers within each region. 

5. If you do plan to keep both regions, then you will usually have some sort of “backsync”, where the source of truth is kept in some remote store, such as SQL, CosmosDB, or Blob or File Storage, which is then synced between the regions. If this is the case for your workload, then it is recommended to confirm that data is flowing between the regions as expected.  

6. As a final validation, verify that traffic is flowing as expected and that the services in the new region (and potentially the old region) are operating as expected. 

7. If you do not plan to keep the original source region, then at this point the resources in that region can be removed. We recommend waiting for some time before deleting resources, in case some issue is discovered that requires a rollback to the original source region.  


