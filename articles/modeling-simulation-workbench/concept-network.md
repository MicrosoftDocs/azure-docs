---
title: "Networking: Azure Modeling and Simulation Workbench"
description: About networking architecture in the Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: concept-article
ms.date: 10/13/2024

#CustomerIntent: As an administrator, I want to understand the networking architecture and capabilities in Azure Modeling and Simulation Workbench.
---

# Networking overview

The Azure Modeling and Simulation Workbench is a managed, cloud-based platform-as-a-service (PaaS) with an isolated network infrastructure. [Chambers](./concept-chamber.md) are designed for confidentiality and each is a self-contained, private work environment. No connections to the internet, to other chambers are possible. The network architecture allows only remote desktop connection to chamber virtual machines (VM). No file mounts, SSH, or custom connections are possible from outside a chamber.

This article provides an overview of the Modeling and Simulation Workbench network architecture and provides references to guides for managing those resources.

## Chamber networking

[Chambers](./concept-chamber.md) are isolated environments where users in the same enterprise or organization can freely collaborate. Every virtual machine in the same chamber is deployed to the same subnet as and can directly communicate to other VMs in the same chamber. Chamber VMs can't communicate with the internet or other chambers or any on-premises infrastructure. Chamber-to-chamber communication is only possible using [shared storage](./concept-storage.md#workbench-tier-shared-storage). Virtual machines (VM) can only be reached using a remote desktop connection by users who provisioned for the chamber.

### Desktop service

A remote desktop client is required to communicate with chamber VMs. Only the approved solution is able to make a connection to chamber VMs and must be started from the connector. Refer to the [Quickstart: Connect to desktop](quickstart-connect-desktop.md) article to learn how to connect to a VM. VMs aren't exposed outside of a chamber and therefore can't be accessed via SSH. You can SSH to another VM once in the desktop environment.

### Chamber license service

Every chamber has its own [license service](./concept-license-service.md). License servers for the major Electronic Design Automation (EDA) vendors are preinstalled and configured in each chamber. The license servers are only accessible to VMs in the same chamber and can't be accessed or integrated with other license servers in other chambers or on-premises infrastructure.

### Red Hat package repository

Azure maintains a private mirror of the official Red Hat Update Infrastructure (RHUI). Chamber VMs can access the Azure RHUI using the Red Hat's `yum` and `dnf` package managers.

### Firewalls

The Modeling and Simulation Workbench offers the standard Azure image of Red Hat Enterprise Linux (RHEL) 8.8, with only a few modifications. The `firewalld` daemon, shipped and enabled by default on all RHEL 8.8 images, is also enabled in Modeling and Simulation Workbench chamber VMs.

> [!IMPORTANT]
> The `firewalld` service might block communications for applications and services not installed via a Red Hat package or package manager. Refer to the application's documentation and the guide to [configure firewalls](how-to-guide-configure-firewall-red-hat.md) on how to manage firewall rules. Modifying firewalls on individual VMs won't enable access to VMs located in the other chambers or on-premises infrastructure.

## Connectors

[Connectors](concept-connector.md) are resources associated with chambers and configure networking access to a chamber from outside a workbench. Connectors are created either as public IP or private network connector. [Public IP](./how-to-guide-public-network.md) connectors are accessible from the internet and access is controlled with an allowlist.  [Private network](./how-to-guide-private-network.md) connectors are deployed to a private virtual network in your subscription.

## Storage and data pipelines

There are several types and tiers of [storage](./concept-storage.md) in the Modeling and Simulation Workbench. Storage local to a VM, [chamber storage](./how-to-guide-manage-chamber-storage.md), and [shared storage](./how-to-guide-manage-shared-storage.md) are accessible outside of a chamber. Storage volumes can't be mounted or accessed from the internet or on-premises infrastructure.

The [data pipeline](./concept-data-pipeline.md) is the only means of [exporting](./how-to-guide-download-data.md) or [importing](./how-to-guide-upload-data.md) into a workbench.

## Related content

- [Write concepts](article-concept.md)
