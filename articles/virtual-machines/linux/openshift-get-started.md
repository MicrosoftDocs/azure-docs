---
title: OpenShift in Azure overview | Microsoft Docs
description: An overview of OpenShift in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: joraio
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

OpenShift includes Kubernetes for container orchestration and management. It adds developer-centric and operations-centric tools that enable:

- Rapid application development.
- Easy deployment and scaling.
- Long-term lifecycle maintenance for teams and applications.

There are multiple versions of OpenShift available:

- OpenShift Container Platform
- OpenShift On Azure (fully managed OpenShift coming in early CY2019)
- OKD (Formerly OpenShift Origin)
- OpenShift Dedicated
- OpenShift Online

Of the five versions covered in this article, only two are available today for customers to deploy in Azure: OpenShift Container Platform and OKD.

## OpenShift Container Platform

Container Platform is an enterprise-ready [commercial version](https://www.openshift.com) from and supported by Red Hat. With this version, customers purchase the necessary entitlements for OpenShift Container Platform and are responsible for installation and management of the entire infrastructure.

Because customers "own" the entire platform, they can install it in their on-premises datacenter, or in a public cloud (such as Azure, AWS, or Google).

## OpenShift On Azure

OpenShift On Azure is a fully managed offering of OpenShift running in Azure. This service is jointly managed and supported by Microsoft and Red Hat. The cluster will deploy into the customer's Azure subscription. The service is currently in Private Preview and is scheduled to be GA in early CY 2019. More information will be provided as the offering gets closer to GA.

## OKD (Formerly OpenShift Origin)

OKD is an [open-source](https://www.okd.io/) upstream project of OpenShift that's community supported. OKD can be installed on CentOS or Red Hat Enterprise Linux (RHEL).

## OpenShift Dedicated

Dedicated is a Red Hat-managed *single-tenant* OpenShift that uses OpenShift Container Platform. Red Hat manages all of the underlying infrastructure (VMs, OpenShift cluster, networking, storage, etc.). The cluster is specific to one customer and runs in a public cloud (such as AWS or Google). A starting cluster includes four application nodes and all costs are annual and paid upfront.

## OpenShift Online

Online is a Red Hat-managed *multi-tenant* OpenShift that uses Container Platform. Red Hat manages all of the underlying infrastructure (such as VMs, OpenShift cluster, networking, and storage). 

With this version, the customer deploys containers but has no control over which hosts the containers run. Because Online is multi-tenant, containers may be located on the same VM hosts as containers from other customers. Cost is per container.

## Next steps

- [Configure common prerequisites for OpenShift in Azure](./openshift-prerequisites.md)
- [Deploy OpenShift Container Platform in Azure](./openshift-container-platform.md)
- [Deploy OKD in Azure](./openshift-okd.md)
- [Deploy OpenShift in Azure Stack](./openshift-azure-stack.md)
- [Post-deployment tasks](./openshift-post-deployment.md)
- [Troubleshoot OpenShift deployment](./openshift-troubleshooting.md)
