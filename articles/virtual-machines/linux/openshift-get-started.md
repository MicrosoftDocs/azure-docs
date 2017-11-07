---
title: OpenShift on Azure Overview | Microsoft Docs
description: OpenShift on Azure Overview.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldw
manager: najoshi
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 
ms.author: haroldw
---

# OpenShift Overview

OpenShift is an open and extensible container application platform that brings docker and Kubernetes to the enterprise.  

OpenShift includes Kubernetes for container orchestration and management. It adds developer and operations-centric tools that enable:

- Rapid application development
- Easy deployment and scaling
- Long-term life-cycle maintenance for teams and applications

There are multiple offerings of OpenShift of which two are available to run in Azure.

- OpenShift Origin
- OpenShift Container Platform
- OpenShift Online
- OpenShift Dedicated

Of the four offerings covered, two are available for customers to deploy into Azure on their own - OpenShift Origin and OpenShift Container Platform.

## OpenShift Origin

[Open source](https://www.openshift.org/) upstream project of OpenShift that is community supported. Origin can be installed on CentOS or RHEL.

## OpenShift Container Platform

Enterprise ready ([commercial offering](https://www.openshift.com)) version from Red Hat that is supported by Red Hat. Customer purchases the necessary entitlements for OpenShift Container Platform and is responsible for installation and management of entire infrastructure.

Since customer "owns" the entire platform, they can install in their on-premises datacenter, public cloud (Azure, AWS, Google, etc.), etc.

## OpenShift Online

Red Hat managed **multi-tenant** OpenShift (using Container Platform). Red Hat manages all the underlying infrastructure (VMs, OpenShift cluster, networking, storage, etc.). 

Customer deploys containers but has no control on which hosts the containers run. Since it is multi-tenant, containers may be co-located on same VM hosts as containers from other customers. Cost is per container.

## OpenShift Dedicated

Red Hat managed **single-tenant** OpenShift (using Container Platform). Red Hat manages all the underlying infrastructure (VMs, OpenShift cluster, networking, storage, etc.). The cluster is specific to one customer and runs in a public cloud (AWS, Google, Azure - coming in early 2018). Starting cluster includes four Application Nodes for $48K / year (upfront payment for an entire year).

## Next steps

- [Configure common prerequisites for OpenShift in Azure](./openshift-prerequisites.md)
- [Deploy OpenShift Origin](./openshift-origin.md)
- [Deploy OpenShift Container Platform](./openshift-container-platform.md)
- [Post deployment tasks](./openshift-post-deployment.md)
- [Troubleshooting OpenShift deployment](./openshift-troubleshooting.md)
