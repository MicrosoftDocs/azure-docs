---
title: Availability zone support for Azure API Management
description: Learn how to deploy your Azure API Management service instance so that it is zone redundant.
author: dlepow
ms.topic: how-to
ms.date: 03/26/2021
ms.author: apimpm

---

# Availability zone support for Azure API Management 

Azure API Management supports optional *zone redundancy*. [Zone redundancy](../availability-zones/az-overview.md#availability-zones) provides resiliency and high availability to a service instance in a specific region. Configuring API Management for zone redundancy is an option in all [Azure regions with availability zones](../availability-zones/az-region#azure-regions-with-availability-zones).

This article shows how to enable zone redundancy for your API Management instance using the Azure portal or Azure CLI. You can also enable zone redundancy using an [Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-api-management-simple-zones).

API Management also supports [multi-region deployments](api-management-howto-deploy-multi-region.md), which helps reduce request latency perceived by geographically distributed API consumers and improves service availability if one region goes offline. The combination of availability zones for redundancy within a region, and multi-region deployments to improve service availability in case of a regional outage, helps enhance both the reliability and performance of your API Managment instance.

[!INCLUDE [premium.md](../../includes/api-management-availability-premium.md)]

## Prerequisites

* If you have not yet created an API Management service instance, see [Create an API Management service instance](get-started-create-service-instance.md)
* If your API Management is deployed in a [virtual network](api-management-using-with-vnet.md), ensure that the virtual network is configured with a public IP address resource.

## Deploy in an availability zone 



1. In the Azure portal, navigate to your API Management service and click on the **Locations** entry in the menu.
2. Click **+ Add** in the top bar.

> [!NOTE]
> 

## Next steps

* [How to deploy an Azure API Management service instance to multiple Azure regions](api-management-howto-deploy-multi-region.md)
* Learn more about [regions that support availability zones](../availability-zones/az-region.md).
* Learn more about building for [reliability](/azure/architecture/framework/resiliency/overview) in Azure.
* 
========

App Service Environments (ASE) can be deployed into Availability Zones (AZ).  Customers can deploy an internal load balancer (ILB) ASEs into a specific AZ within an Azure region. If you pin your ILB ASE to a specific AZ, the resources used by a ILB ASE will either be pinned to the specified AZ, or deployed in a zone redundant manner.  

An ILB ASE that is explicitly deployed into an AZ is considered a zonal resource because the ILB ASE is pinned to a specific zone. The following ILB ASE dependencies will be pinned to the specified zone:

- the internal load balancer IP address of the ASE
- the compute resources used by the ASE to manage and run web applications

The remote file storage for web applications deployed on a zonal ILB ASE uses Zone Redundant Storage (ZRS).

Unless the steps described in this article are followed, ILB ASEs are not automatically deployed in a zonal manner. You cannot pin an External ASE with a public IP address to a specific availability zone. 

Zonal ILB ASEs can be created in any of the following regions:

- Australia East
- Canada Central
- Central US
- East US
- East US 2
- East US 2 (EUAP)
- France Central 
- Japan East
- North Europe
- West Europe
- Southeast Asia
- UK South
- West US 2

Applications deployed on a zonal ILB ASE will continue to run and serve traffic on that ASE even if other zones in the same region suffer an outage.  It is possible that non-runtime behaviors, including; application service plan scaling, application creation, application configuration, and application publishing may still be impacted from an outage in other availability zones. The zone-pinned deployment of a zonal ILB ASE only ensures continued uptime for already deployed applications.

Zonal ILB ASEs must be created using ARM templates. Once a zonal ILB ASE is created via an ARM template, it can be viewed and interacted with via the Azure portal and CLI.  An ARM template is only needed for the initial creation of a zonal ILB ASE.

The only change needed in an ARM template to specify a zonal ILB ASE is the new ***zones*** property. The ***zones*** property should be set to a value of "1", "2" or "3" depending on the logical availability zone that the ILB ASE should be pinned to.

The example ARM template snippet below shows the new ***zones*** property specifying that the ILB ASE should be pinned to zone 2.

```
   "resources": [
      {
         "type": "Microsoft.Web/hostingEnvironments",
         "kind": "ASEV2",
         "name": "yourASENameHere",
         "apiVersion": "2015-08-01",
         "location": "your location here",
         "zones": [
            "2"
         ],
         "properties": {
         "name": "yourASENameHere",
         "location": "your location here",
         "ipSslAddressCount": 0,
         "internalLoadBalancingMode": "3",
         "dnsSuffix": "contoso-internal.com",
         "virtualNetwork": {
             "Id": "/subscriptions/your-subscription-id-here/resourceGroups/your-resource-group-here/providers/Microsoft.Network/virtualNetworks/your-vnet-name-here",
             "Subnet": "yourSubnetNameHere"
          }
         }
      }
    ]
```

To make your apps zone redundant, you need to deploy two zonal ILB ASEs. The two zonal ILB ASEs must be in separate availability zones. You then need to deploy your apps into each of the ILB ASEs. After your apps are created, you need to configure a load balancing solution. The recommended solution is to deploy a [zone redundant Application Gateway](../../application-gateway/application-gateway-autoscaling-zone-redundant.md) upstream of the zonal ILB ASEs. 
