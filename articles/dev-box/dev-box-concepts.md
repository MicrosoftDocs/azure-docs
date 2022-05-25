---
title: Microsoft Dev Box key concepts?
titleSuffix: Microsoft dev box
description: Learn key concepts and terminology for Microsoft Dev Box.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 04/15/2022
ms.custom: template-concept 
---

<!-- 
  Customer intent:
	As a developer I want to understand Dev Box concepts and terminology so that I can set up Dev Box environment.
 -->
# Microsoft Dev Box key concepts
Dev Box uses a hierarchical structure to enable tasks management at the appropriate level and provide access to resources where required. 

![A diagram showing the hierarchical structure of Dev Box and management roles at each level.](./media/dev-box-concepts/dev-box-structure.png  "Dev Box hierarchical structure and management roles.")

The key objects in this structure are as follows:

## DevCenter

A DevCenter is a top-level resource that serves as an organizational construct, reflecting the units of organization within an enterprise. 

## Projects

A Project is a resource associated with a DevCenter. Projects serve as an organizational construct, reflecting the workgroups within an organizational unit in an enterprise. 

## Dev Box Definition

A Dev Box Definition is a resource associated with a DevCenter. Dev Box Definitions detail the configuration of the source image and VM size, including compute size and storage size. DevCenter Owners can use Dev Box Definitions across Projects in a DevCenter. 

## Network connection 
A Network Connection is a top-level resource that provides Dev Box Pools with required information to connect to network-based resources. Network Connections attached to a DevCenter can be used within it. The information required in a Network Connection includes:

- **Network details**: The virtual network and subnet that the dev box will be associated with. Dev boxes are created in the Microsoft hosted Azure subscription. To connect to a customers on-premises network, a virtual network interface card (vNic) is injected into a customer-provided Azure virtual network (vNet).
- **Active Directory domain**: The Active Directory domain to join, an Organizational Unit (OU) destination for the computer object, and Active Directory user credentials with sufficient permissions to perform the domain join. When a dev box is created, it is joined to this Active Directory domain.

During provisioning, the dev box is connected to the Azure subnet and joined to a domain (either Windows Server Active Directory or Azure Active Directory (Azure AD)). This process results in a dev box that is:

- On your network.
- In the region of the vNet.
- Registered to Azure AD.
- Enrolled into Microsoft Endpoint Manager.
- Ready to accept user sign-in requests.

The Network Connection settings are applied to the dev box only at the time of provisioning.

## Dev Box Pool 
A Dev Box Pool is a resource associated with a Project. It consists of the configuration and network information for a given group of dev boxes. It is defined as the 'Type' of the dev box as well as the container for managing dev boxes. A user given access to a Pool can create dev boxes from it, adhering to the Pool's settings. 

## Dev Box 
A dev box is an instance of a virtual machine configured for developer use. It is built on [Windows 365 Cloud PC](/windows-365/enterprise/overview) and managed by Microsoft Intune.
