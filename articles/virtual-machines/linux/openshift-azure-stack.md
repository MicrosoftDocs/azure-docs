---
title: Deploy OpenShift to Azure Stack Hub 
description: Deploy OpenShift to Azure Stack Hub.
author: ronmiab
manager: femila
ms.author: robess
ms.service: azure-stack
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 02/13/2023

---

# Deploy OpenShift Container Platform or OKD to Azure Stack Hub

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

[OpenShift](openshift-get-started.md) can be deployed in Azure Stack Hub. There are some key differences between Azure and Azure Stack Hub so deployment will differ slightly and capabilities will also differ slightly.

Currently, the Azure Cloud Provider doesn't work in Azure Stack Hub. You won't be able to use disk attach for persistent storage in Azure Stack Hub. Instead, you can configure other storage options such as NFS, iSCSI, and GlusterFS. Or, you can enable CNS and use GlusterFS for persistent storage. If CNS is enabled, three more nodes will be deployed with storage for GlusterFS usage.

## Deploy OpenShift 4.x On Azure Stack Hub

Red Hat manages the Red Hat Enterprise Linux CoreOS (RHCOS) image for OpenShift 4.x. The deployment process gets the image from a Red Hat endpoint. As a result, the user (tenant) doesn't need to get an image from the Azure Stack hub Marketplace.

You can follow the steps in the OpenShift documentation at [Installing a cluster on Azure Stack Hub using ARM templates](https://docs.openshift.com/container-platform/4.9/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html).

> [!WARNING]
> If you have an issue with OpenShift, please contact Red Hat for support.
## Next steps

[Installing a cluster on Azure Stack Hub using ARM templates](https://docs.openshift.com/container-platform/4.9/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html).
