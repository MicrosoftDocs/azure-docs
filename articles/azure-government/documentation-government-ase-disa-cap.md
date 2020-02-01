---
title: Use DISA CAP to connect to Azure Government
description: This document provides a comparison of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: jftl6y
manager: 

ms.assetid: 
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 11/29/2018
ms.author: joscot

---

# App Service Environment reference for DoD customers using a DISA CAP connection

This article explains the baseline configuration of an App Service Environment (ASE) with an internal load balancer (ILB) for customers who use the DISA CAP to connect to Azure Government.

## Environment configuration

### Assumptions

The customer has deployed an ASE with an ILB and has implemented an ExpressRoute connection via the DISA Cloud Access Point (CAP) process.

### Route table

When creating the ASE via the portal, a route table with a default route of 0.0.0.0/0 and next hop “Internet” is created.  However, the DISA BGP routes will advertise for 0.0.0.0/0 and this route table should be removed from the ASE subnet.

### Network security group (NSG)

The ASE will be created with inbound and outbound security rules as shown below.  The inbound security rules MUST allow ports 454-455 with an ephemeral source port range (*).  Source IPs must include the following Azure Government ranges see [App Service Environment management addresses](https://docs.microsoft.com/azure/app-service/environment/management-addresses
)

* 23.97.29.209
* 23.97.0.17
* 23.97.16.184
* 13.72.180.105
* 13.72.53.37

#### Default NSG security rules

The images below describe the default NSG rules created during the ASE creation.  For more information, see [Networking considerations for an App Service Environment](https://docs.microsoft.com/azure/app-service/environment/network-info#network-security-groups)

![Default inbound NSG security rules for an ILB ASE](media/documentation-government-ase-disacap-inbound-route-table.png)

![Default outbound NSG security rules for an ILB ASE](media/documentation-government-ase-disacap-outbound-route-table.png)

## FAQs

* Some configuration changes may take some time to take effect.  Allow for several hours for changes to routing, NSGs, ASE Health, etc. to propagate and take effect.

## Resource manager template sample

> [!NOTE]
   > The Azure Portal will not allow the ASE to be configured with non-RFC 1918 IP addresses.  If your solution requires non-RFC 1918 IP addresses, you must use a Resource Manager Template to deploy the ASE.
   
<a href="https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2FApp-Service-Environment-AzFirewall%2Fazuredeploy.json" target="_blank">
<img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazuregov.png"/>
</a>

This template deploys an **ILB ASE** into the Azure Government DoD regions.

## Next steps
[Azure Government overview](documentation-government-welcome.md)
