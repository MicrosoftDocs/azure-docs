---
title: Deploy OpenShift Container Platform 4.x in Azure 
description: Deploy OpenShift Container Platform 4.x in Azure.
author: haroldwongms
manager: mdotson
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 10/14/2019
ms.author: haroldw
---

# Deploy OpenShift Container Platform 4.x in Azure

Deployment of OpenShift Container Platform (OCP) 4.2 is now supported in Azure via the Installer-Provisioned Infrastructure (IPI) model.  The landing page for trying OpenShift 4 is [try.openshift.com](https://try.openshift.com/). To install OCP 4.2 in Azure, visit the [Red Hat OpenShift Cluster Manager](https://cloud.redhat.com/openshift/install/azure/installer-provisioned) page.  Red Hat credentials are required to access this site.


## Notes 

 - An Azure Active Directory (AAD) Service Principal (SP) is required to install and run OCP 4.x in Azure
     - The SP must be granted the API permission of **Application.ReadWrite.OwnedBy** for Azure Active Directory Graph
     - An AAD Tenant Administrator must grant Admin Consent for this API permission to take effect
     - The SP must be granted **Contributor** and **User Access Administrator** roles to the subscription
 - The installation model for OCP 4.x is different than 3.x and there are no Azure Resource Manager templates available for deploying OCP 4.x in Azure
 - If issues are encountered during the installation process, contact the appropriate company (Microsoft or Red Hat)

| Issue Description | Contact Point |
|-------------------|---------------|
| Azure specific issues (AAD, SP, Azure Subscription, etc.)                              | Microsoft |
| OpenShift-specific issues (Installation failures / errors, Red Hat subscription, etc.) |  Red Hat  |




## Next steps

- [Getting started with OpenShift Container Platform](https://docs.openshift.com)
