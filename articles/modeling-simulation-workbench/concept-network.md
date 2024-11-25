---
title: "Networking: Azure Modeling and Simulation Workbench"
description: About networking architecture in the Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: concept-article
ms.date: 10/13/2024

#CustomerIntent: As an administrator, I want to understand the networking architecture and capabilities in Azure Modeling and Simulation Workbench.
---

# Networking overview

The Modeling and Simulation Workbench is a managed, cloud-based platform-as-a-service (PaaS) with an isolated network infrastructure. [Chambers](./concept-chamber.md) are designed for confidentiality and each is a self-contained, private work environment. No connections to the internet or to other chambers are possible. The network allows only remote desktop connections to chamber virtual machines (VM). No file mounts, SSH, or custom connections are possible from or into a chamber.

This article provides an overview of the Modeling and Simulation Workbench network architecture and provides references to guides for managing those resources.

## Chamber networking

[Chambers](./concept-chamber.md) are isolated environments where users in the same enterprise or organization can collaborate. Every virtual machine in the same chamber is connected to the same subnet and can directly communicate to other VMs in the same chamber. Chamber VMs can't communicate with the internet, VMs in other chambers, or on-premises infrastructure. Chamber-to-chamber communication is only achieved using [shared storage](./concept-storage.md#workbench-tier-shared-storage). Virtual machines can only be connected to using a specially provisioned remote desktop client.

### Desktop service

A remote desktop client is required to communicate with chamber VMs. Users can't initiate SSH connections to VMs from outside a chamber, but can SSH between VMs after connecting to the desktop service. The desktop client prohibits file shares, printer, and removable storage access. Refer to the [Quickstart: Connect to desktop](quickstart-connect-desktop.md) article to learn how to connect to a VM.

### Chamber license service

Every chamber has its own [license service](./concept-license-service.md). License servers are automatically provisioned with each chamber for the four major Electronic Design Automation (EDA) vendors. The license servers are only accessible by VMs from within the chamber and can't integrate with  license servers in other chambers or on-premises license servers.

### Red Hat package repository

Azure maintains a private mirror of the official Red Hat Update Infrastructure (RHUI). Chamber VMs can access the Azure RHUI using the Red Hat's `yum` and `dnf` package managers to install packages distributed in the official mirrors. Learn more about Red Hat package management at [Linux package management with YUM and RPM](https://www.redhat.com/sysadmin/how-manage-packages) on the Red Hat site.

### Firewalls

The Modeling and Simulation Workbench provides the standard Azure Red Hat Enterprise Linux (RHEL) 8.8 image, with only a few modifications. The `firewalld` daemon, shipped and enabled by default on all RHEL 8.8 images, remains enabled in Modeling and Simulation Workbench chamber VMs.

> [!IMPORTANT]
> The `firewalld` service might block communications for applications and services not installed via a Red Hat package or package manager. Refer to the application's documentation and the guide to [configure firewalls](how-to-guide-configure-firewall-red-hat.md) on how to manage firewall rules. Modifying firewalls on individual VMs won't enable access to VMs located in the other chambers or on-premises infrastructure.

## Connectors

[Connectors](concept-connector.md) are connectivity resources associated with chambers and configure networking access to a chamber from outside a workbench. Connectors are created either as public IP or private network connector. [Public IP](./how-to-guide-public-network.md) connectors allow access to your chamber from the internet and control access via an IP address allowlist.  [Private network](./how-to-guide-private-network.md) connectors create network endpoints on virtual network in your subscription and require you to peer with another virtual network, such as virtual private network (VPN) gateway.

## Storage and data pipelines

There are several types and tiers of [storage](./concept-storage.md) in the Modeling and Simulation Workbench. Storage local to a VM, [chamber storage](./how-to-guide-manage-chamber-storage.md), and [shared storage](./how-to-guide-manage-shared-storage.md) are accessible outside of a chamber. Storage volumes can't be mounted or accessed from the internet or on-premises infrastructure.

The [data pipeline](./concept-data-pipeline.md) is the only means of [exporting](./how-to-guide-download-data.md) or [importing](./how-to-guide-upload-data.md) into a workbench. With public networking connectors, the connector defines what IP addresses can use the data pipeline.  

## Related content

* [Import data into Azure Modeling and Simulation Workbench](how-to-guide-upload-data.md)
* [Export data from Azure Modeling and Simulation Workbench](how-to-guide-download-data.md)
* [Configure firewalls in Red Hat](how-to-guide-configure-firewall-red-hat.md)
* [Set up a public IP network connector](how-to-guide-public-network.md)
* [Set up a private networking connector](how-to-guide-private-network.md)
