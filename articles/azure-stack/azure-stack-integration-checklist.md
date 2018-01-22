---
title: Datacenter integration checklist for Azure Stack integrated systems | Microsoft Docs
description: Checklist for datacenter integration with multi-node Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/26/2018
ms.author: jeffgilb
ms.reviewer: wamota
---

To ensure the deployment and integration of the Azure Stack solution is a success, it’s recommended to follow these three checklists.

## Pre-Onsite Checklist 
[  ] Prepare for deployment with all software required for the install, that includes: 
  - Azure Stack build 
  - Windows Server 2016 Evaluation ISO 
  - Partner Toolkit 
  - OEM Extensions 
  - Any software and tools to install on the HLH based on OEM 

[  ] Work with OEM to complete the deployment worksheet and send the exported JSON files. 

[  ] Review PKI certificate requirements and if possible validate the certificates. 

[  ] Review Azure AD Account requirements (install, registration and tenant test (Canary)). 

[  ] After reading and understanding the physical infrastructure, ensure that the border device supports Layer 3 configuration on the physical interfaces and that routing is configured for either BGP or Static routing. 

[  ] Ensure the datacenter network is configured, routing and firewall are ready, and these IPs have internet access: public VIPs, Azure Stack infrastructure and DVM IP (these last two may require NAT for outbound Internet access). 

[  ] Review datacenter requirements like power, location, measurements, and weight limits. 

## Pre-Deployment Checklist 
[  ] Ensure that the border device is ready with Layer 3 configuration on the physical interfaces and that routing is configured for either BGP or Static routing.

[  ] Verify the datacenter network is configured, routing and firewall are ready, and these IPs have internet access: public VIPs, Azure Stack infrastructure and DVM IP (these last two should require NAT for outbound Internet access). 

[  ] Prepare the switches, the HLH and the nodes for deployment. 

[  ] Validate network connectivity and external access to required resources. 

[  ] Perform PKI certificate validation. 

## Post-Deployment Checklist 
[  ] Install all current update packages. 

[  ] Run and pass Canary tests. 

[  ] Complete Azure Stack Registration 

[  ] Integrate DNS 

[  ] Remove DVM 
