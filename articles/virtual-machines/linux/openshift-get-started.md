---
title: OpenShift in Azure overview | Microsoft Docs
description: An overview of OpenShift in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: mdotson
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/01/2019
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
- Azure Red Hat OpenShift (fully managed OpenShift on Azure coming in around early May 2019)
- OKD (Formerly OpenShift Origin)
- OpenShift Dedicated
- OpenShift Online

Of the five versions covered in this article, only two are available today for customers to deploy in Azure: OpenShift Container Platform and OKD.

## OpenShift Container Platform

Container Platform is an enterprise-ready [commercial version](https://www.openshift.com) from and supported by Red Hat. With this version, customers purchase the necessary entitlements for OpenShift Container Platform and are responsible for installation and management of the entire infrastructure.

Because customers "own" the entire platform, they can install it in their on-premises datacenter, or in a public cloud (such as Azure).

## Azure Red Hat OpenShift

Azure Red Hat OpenShift is a fully managed offering of OpenShift running in Azure. This service is jointly managed and supported by Microsoft and Red Hat. The cluster will deploy into the customer's Azure subscription. The service is scheduled to be GA around May 2019. Separate documentation for the managed service will be available once the service is GA.

## OKD (Formerly OpenShift Origin)

OKD is an [open-source](https://www.okd.io/) upstream project of OpenShift that's community supported. OKD can be installed on CentOS or Red Hat Enterprise Linux (RHEL).

## Next steps

- [Configure common prerequisites for OpenShift in Azure](./openshift-prerequisites.md)
- [Deploy OpenShift Container Platform in Azure](./openshift-container-platform.md)
- [Deploy OpenShift Container Platform Self-Managed Marketplace Offer](./openshift-marketplace-self-managed.md)
- [Deploy OpenShift in Azure Stack](./openshift-azure-stack.md)
- [Post-deployment tasks](./openshift-post-deployment.md)
- [Troubleshoot OpenShift deployment](./openshift-troubleshooting.md)
