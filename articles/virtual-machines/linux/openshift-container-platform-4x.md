---
title: Deploy OpenShift Container Platform 4.x in Azure | Microsoft Docs
description: Deploy OpenShift Container Platform 4.x in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: mdotson
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/14/2019
ms.author: haroldw
---

# Deploy OpenShift Container Platform 4.x in Azure

To install OpenShift Container Platform (OCP) 4.x in Azure, visit [try.openshift.com](https://try.openshift.com/). If you already have a Red Hat Subscription, visit the [Red Hat OpenShift Cluster Manager](https://cloud.redhat.com/openshift/install/azure/installer-provisioned).


## Notes

 - Be aware that the Azure AD App Registration needed to install and run OCP 4.x in Azure requires admin level permissions and consent.
 - The installation model for OCP 4.x is different than 3.x and there are no Azure Resource Manager templates available for deploying OCP 4.x in Azure.

## Next steps

- [Post-deployment tasks](./openshift-post-deployment.md)
- [Getting started with OpenShift Container Platform](https://docs.openshift.com)
