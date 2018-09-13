---
title: OpenShift in Azure overview | Microsoft Docs
description: An overview of OpenShift in Azure.
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

# OpenShift in Azure

OpenShift is an open and extensible container application platform that brings Docker and Kubernetes to the enterprise.  

OpenShift includes Kubernetes for container orchestration and management. It adds developer- and operations-centric tools that enable:

- Rapid application development.
- Easy deployment and scaling.
- Long-term lifecycle maintenance for teams and applications.

There are multiple versions of OpenShift available:

- OKD (Formerly OpenShift Origin)
- OpenShift Container Platform
- OpenShift Online
- OpenShift Dedicated

Of the four versions covered in this article, only two are available for customers to deploy in Azure: OpenShift Origin and OpenShift Container Platform.

## OKD (Formerly OpenShift Origin)

OKD is an [open-source](https://www.okd.io/) upstream project of OpenShift that's community supported. OKD can be installed on CentOS or Red Hat Enterprise Linux (RHEL).

## OpenShift Container Platform

Container Platform is an enterprise-ready [commercial version](https://www.openshift.com) from and supported by Red Hat. With this version, customers purchase the necessary entitlements for OpenShift Container Platform and are responsible for installation and management of the entire infrastructure.

Because customers "own" the entire platform, they can install it in their on-premises datacenter, or in a public cloud (such as Azure, AWS, or Google).

## OpenShift Online

Online is a Red Hat-managed *multi-tenant* OpenShift that uses Container Platform. Red Hat manages all of the underlying infrastructure (such as VMs, OpenShift cluster, networking, and storage). 

With this version, the customer deploys containers but has no control over which hosts the containers run. Because Online is multi-tenant, containers may be located on the same VM hosts as containers from other customers. Cost is per container.

## OpenShift Dedicated

Dedicated is a Red Hat-managed *single-tenant* OpenShift that uses Container Platform. Red Hat manages all of the underlying infrastructure (VMs, OpenShift cluster, networking, storage, etc.). The cluster is specific to one customer and runs in a public cloud (such as AWS or Google, with Azure coming in early 2018). A starting cluster includes four application nodes for $48,000 per year (paid up front).

## Next steps

- [Configure common prerequisites for OpenShift in Azure](./openshift-prerequisites.md)
- [Deploy OpenShift Origin in Azure](./openshift-origin.md)
- [Deploy OpenShift Container Platform in Azure](./openshift-container-platform.md)
- [Post-deployment tasks](./openshift-post-deployment.md)
- [Troubleshoot OpenShift deployment](./openshift-troubleshooting.md)
