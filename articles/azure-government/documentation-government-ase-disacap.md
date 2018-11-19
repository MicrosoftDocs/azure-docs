---
title: App Service Environment Reference for DoD customers using a DISA CAP Connection
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: 
manager: 

ms.assetid: 
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 
ms.author: 

---

# App Service Environment Reference for DoD customers using a DISA CAP Connection

## Purpose

The purpose of this document is to document the correct configuration for an App Service Environment (ASE) configured with an internal load balancer (ILB) for customers utilizing a DISA CAP connection to their Azure environment.

## Environment Configuration

### Assumptions

An ASE has been provisioned with an ILB and the customer has implemented an ExpressRoute connection as provisioned by the DISA Cloud Access Point (CAP) process.

### Route Table

By default, when provisioning the ASE via the portal, a route table with a default route of 0.0.0.0/0 with next hop “Internet” is created.  However, the DISA BGP routes will advertise for 0.0.0.0/0 and this route table should be removed from the ASE subnet.

### NSG

By default, the ASE will be provisioned with inbound and outbound security rules as shown below.  The inbound security rules MUST allow ports 454-455 with an ephemeral source port range (*).  Source IPs must include the following Azure Government ranges see [App Service Environment management addresses](../app-service/environment/management-addresses
)

* 23.97.29.209
* 23.97.0.17
* 23.97.16.184
* 13.72.180.105
* 13.72.53.37

#### Default NSG security rules

The images below describe the default NSG rules created during the ASE creation.  For more information see [Networking considerations for an App Service Environment](../app-service/environment/network-info#network-security-groups)

![Default inbound NSG security rules for an ILB ASE](media/documentation-government-ase-disacap-inbound-route-table.png)

![Default outbound NSG security rules for an ILB ASE](media/documentation-government-ase-disacap-outbound-route-table.png)

## FAQs

* Some configuration changes may take some time to take effect.  Allow for several hours to allow changes to routing, NSGs, ASE Health, etc. to propagate and take effect.

## ARM Template Sample
<a href="https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fmasonch%2Fazure-ilb-ase-azuregov%2Fmaster%2Fazuredeploy.json" target="_blank">
<img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazuregov.png"/>
</a>

This template deploys an **ILB ASE** into the Azure Government DoD regions.