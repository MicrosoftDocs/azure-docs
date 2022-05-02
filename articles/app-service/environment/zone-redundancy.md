---
title: Availability Zone support for App Service Environment v2
description: Learn how to deploy your App Service Environments so that your apps are zone redundant.
author: madsd
ms.topic: article
ms.date: 03/29/2022
ms.author: madsd
---
# Availability Zone support for App Service Environment v2

> [!IMPORTANT]
> This article is about App Service Environment v2 which is used with Isolated App Service plans. [App Service Environment v2 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). There's a new version of App Service Environment that is easier to use and runs on more powerful infrastructure. To learn more about the new version, start with the [Introduction to the App Service Environment](overview.md). If you're currently using App Service Environment v2, please follow the steps in [this article](migration-alternatives.md) to migrate to the new version.
>

App Service Environment v2 (ASE) can be deployed into Availability Zones (AZ).  Customers can deploy an internal load balancer (ILB) ASEs into a specific AZ within an Azure region. If you pin your ILB ASE to a specific AZ, the resources used by a ILB ASE will either be pinned to the specified AZ, or deployed in a zone redundant manner.  

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

## How to Deploy an App Service Environment in an Availability Zone

Zonal ILB ASEs must be created using ARM templates. Once a zonal ILB ASE is created via an ARM template, it can be viewed and interacted with via the Azure portal and CLI.  An ARM template is only needed for the initial creation of a zonal ILB ASE.

The only change needed in an ARM template to specify a zonal ILB ASE is the new ***zones*** property. The ***zones*** property should be set to a value of "1", "2" or "3" depending on the logical availability zone that the ILB ASE should be pinned to.

The example ARM template snippet below shows the new ***zones*** property specifying that the ILB ASE should be pinned to zone 2.

```json
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

## In-region data residency

ILB ASEs deployed in an availability zone will only store customer data within the region where the zonal ILB ASE has been deployed. Both website file content as well as customer supplied settings and secrets stored in App Service remain within the region where the zonal ILB ASE is deployed.

Customers ensure single region data residency by following the steps outlined earlier in the section "How to Deploy an App Service Environment in an Availability Zone". By configuring an App Service Environment according to these steps, an App Service Environment deployed in an availability zone satisfies in region data residency requirements including those specified in the [Azure Trust Center](https://azuredatacentermap.azurewebsites.net/).

Customers can validate that an App Service Environment is properly configured to store data in a single region by following these steps: 

1. Using [Resource Explorer](https://resources.azure.com), navigate to the ARM resource for the App Service Environment.  ASEs are listed under *providers/Microsoft.Web/hostingEnvironments*.
2. If a *zones* property exists in the view of the ARM JSON syntax, and it contains a single valued JSON array with a value of "1", "2", or "3", then the ASE is zonally deployed and customer data remains in the same region.
2. If a *zones* property does not exist, or the property does not have valid zone value as specified earlier, then the ASE is not zonally deployed, and customer data is not exclusively stored in the same region.
