--- 
title: Azure VMware Solution by CloudSimple 
description: Learn about Azure VMware Solutions by CloudSimple, including an overview, quickstarts, concepts, tutorials, and how-to guides.
author: Ajayan1008
ms.author: v-hborys
ms.date: 08/20/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
ms.custom: seo-azure-migrate
keywords: vms support, azure vmware solution by cloudsimple, cloudsimple azure, vms tools, vmware documentation 
---
# Azure VMware Solution by CloudSimple

Welcome to the one-stop portal for help with Azure VMware Solution by CloudSimple.
In the documentation site you can learn about the following topics:

## Overview

Learn more about Azure VMware Solution by CloudSimple

* Learn about the features, benefits, and usage scenarios at [What is Azure VMware Solution by CloudSimple](cloudsimple-vmware-solutions-overview.md)
* Review the [key concepts for administration](key-concepts.md)

## Quickstart

Learn how to get started with the solution

* Understand how to [initialize the service and purchase capacity](quickstart-create-cloudsimple-service.md)
* Learn how to create a new VMware environment at [Configure a Private Cloud Environment](quickstart-create-private-cloud.md)
* Learn how to unify management across VMware and Azure by reviewing the article [Consume VMware VMs on Azure](quickstart-create-vmware-virtual-machine.md)

## Concepts

Learn about the following concepts

* A [CloudSimple Service](cloudsimple-service.md) (also known as "Azure VMware Solution by CloudSimple - Service"). This resource must be created once per region.
* Purchase capacity for your environment by creating one or more [CloudSimple Node](cloudsimple-node.md) resources. These resources are also referred to as "Azure VMware Solution by CloudSimple - Node".
* Initialize and configure your VMware environment using the [Private Clouds](cloudsimple-private-cloud.md).
* Unify management using [CloudSimple Virtual Machines](cloudsimple-virtual-machines.md) (also known as "Azure VMware Solution by CloudSimple - Virtual machine").
* Design the underlay network using [VLANs/subnets](cloudsimple-vlans-subnets.md).
* Segment and secure your underlay network using the [Firewall Table](cloudsimple-firewall-tables.md) resource.
* Get secure access to your VMware environments over the WAN using [VPN Gateways](cloudsimple-vpn-gateways.md).
* Enable public access for workloads using [Public IP](cloudsimple-public-ip-address.md).
* Establish connectivity to Azure Virtual Networks and On-premises networks using [Azure Network Connection](cloudsimple-azure-network-connection.md).
* Configure alert email targets using [Account Management](cloudsimple-account.md).
* View logs of user and system activity using [Activity Management](cloudsimple-activity.md) screens.
* Understand the various [VMware components](vmware-components.md).

## Tutorials

Learn how to perform common tasks, such as:

* [Create a CloudSimple Service](create-cloudsimple-service.md), once per region where you want to deploy VMware environments.
* Manage core service functionality in the [CloudSimple portal](access-cloudsimple-portal.md).
* Enable capacity and optimize billing for your infrastructure by [Purchasing CloudSimple nodes](create-nodes.md).
* Manage VMware environment configurations using Private Clouds. You can [create](create-private-cloud.md), [manage](manage-private-cloud.md), [expand](expand-private-cloud.md), or [shrink](shrink-private-cloud.md) Private Clouds.
* Enable unified management by [mapping Azure Subscriptions](azure-subscription-mapping.md).
* Monitor user and system activity using the [Activity pages](monitor-activity.md).
* Configure networking for your environments by [creating and managing subnets](create-vlan-subnet.md).
* Segment and secure your environment using [Firewall tables and rules](firewall.md).
* Enable inbound internet access for workloads by [Allocating Public IPs](public-ips.md).
* Enable connectivity from your internal networks or client workstations by [setting-up VPN](vpn-gateway.md).
* Enable communications from your [on-premises environments](on-premises-connection.md) as well to [Azure Virtual networks](virtual-network-connection.md).
* Configure alert targets and view total purchased capacity in the [account summary](account.md)
* View [users](users.md) that have accessed the CloudSimple portal.
* Manage VMware virtual machines from the Azure portal:
    * [Create virtual machines](azure-create-vm.md) in the Azure portal.
    * [Manage virtual machines](azure-manage-vm.md) that you have created.

## How-to Guides

These guides describe solutions to goals such as:

* [Securing your environment](private-cloud-secure.md)
* Install third-party tools, enable additional users and external authentication source in vSphere using [privilege escalation](escalate-privileges.md).
* Configure access to various VMware services by [configuring on-premises DNS](on-premises-dns-setup.md).
* Enable name and address allocation for your workloads by [configuring workload DNS and DHCP](dns-dhcp-setup.md).
* Understand how the service ensures security and functionality in your platform through service [updates and upgrades](vmware-components.md#updates-and-upgrades).
* Save TCO on backup by creating a sample backup architecture with a [third-party backup software such as Veeam](backup-workloads-veeam.md).
* Create a secure environment by enabling encryption at rest with a [third-party KMS encryption software](vsan-encryption.md).
* Extend Azure Active Directory (Azure AD) management into VMware by configuring the [Azure AD identity source](azure-ad.md).
