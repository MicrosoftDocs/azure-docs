---
title: Azure Stack Development Kit Architecture | Microsoft Docs
description: Describes the Azure Stack Development Kit (ASDK) architecture.
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
ms.date: 01/21/2019
ms.author: jeffgilb
ms.reviewer: misainat
ms.lastreviewed: 10/15/2018



---
# Microsoft Azure Stack Development Kit architecture
The Azure Stack Development Kit (ASDK) is a single-node deployment of Azure Stack running on a single host computer. Edge routing components are installed on the host computer to provide NAT and VPN capabilities for Azure Stack. Azure Stack infrastructure roles run in the Hyper-V layer of the physical host computer.


## Virtual machine roles
The ASDK offers services using the following VMs hosted on the development kit host computer:

| Name | Description |
| ----- | ----- |
| **AzS-ACS01** | Azure Stack storage services.|
| **AzS-ADFS01** | Active Directory Federation Services (ADFS).  |
| **AzS-CA01** | Certificate authority services for Azure Stack role services.|
| **AzS-DC01** | Active Directory, DNS, and DHCP services for Microsoft Azure Stack.|
| **AzS-ERCS01** | Emergency Recovery Console VM. |
| **AzS-GWY01** | Edge gateway services such as VPN site-to-site connections for tenant networks.|
| **AzS-NC01** | Network Controller, which manages Azure Stack network services.  |
| **AzS-SLB01** | Load balancing multiplexer services in Azure Stack for both tenants and Azure Stack infrastructure services.  |
| **AzS-SQL01** | Internal data store for Azure Stack infrastructure roles.  |
| **AzS-WAS01** | Azure Stack administrative portal and Azure Resource Manager services.|
| **AzS-WASP01**| Azure Stack user (tenant) portal and Azure Resource Manager services.|
| **AzS-XRP01** | Infrastructure management controller for Microsoft Azure Stack, including the Compute, Network, and Storage resource providers.|


## Next steps
[Learn about basic ASDK administration tasks](asdk-admin-basics.md)
