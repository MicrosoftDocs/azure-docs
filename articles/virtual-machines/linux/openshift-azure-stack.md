---
title: Deploy OpenShift in Azure Stack Hub 
description: Deploy OpenShift in Azure Stack Hub.
author: haroldwongms
manager: joraio
ms.service: virtual-machines
ms.subservice: openshift
ms.collection: linux
ms.topic: how-to
ms.workload: infrastructure
ms.date: 10/14/2019
ms.author: haroldw
---

# Deploy OpenShift Container Platform or OKD in Azure Stack Hub

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

[OpenShift](openshift-get-started.md) can be deployed in Azure Stack Hub. There are some key differences between Azure and Azure Stack Hub so deployment will differ slightly and capabilities will also differ slightly.

Currently, the Azure Cloud Provider doesn't work in Azure Stack Hub. For this reason, you won't be able to use disk attach for persistent storage in Azure Stack Hub. Instead, you can configure other storage options such as NFS, iSCSI, and GlusterFS. As an alternative, you can enable CNS and use GlusterFS for persistent storage. If CNS is enabled, three more nodes will be deployed with storage for GlusterFS usage.

You can use one of several methods to deploy OpenShift Container Platform or OKD in Azure Stack Hub:

- You can manually deploy the necessary Azure infrastructure components and then follow the [OpenShift Container Platform documentation](https://docs.openshift.com/container-platform) or [OKD documentation](https://docs.okd.io).
- You can also use an existing [Azure Resource Manager template](https://github.com/Microsoft/openshift-container-platform/) that simplifies the deployment of the OpenShift Container Platform cluster.

If using the Azure Resource Manager template, select the proper branch (`azurestack-release-3.x`). The templates for Azure won't work. The API versions are different between Azure and Azure Stack Hub. The RHEL (Red Hat Enterprise Linux) image reference is currently hard-coded as a variable in the `azuredeploy.json` file and you will need to update to match your image.

```json
"imageReference": {
    "publisher": "Redhat",
    "offer": "RHEL-OCP",
    "sku": "7-4",
    "version": "latest"
}
```

## Prerequisites

You or your cloud operator will need to have the following things to deploy OpenShift on Azure Stack Hub.

### A Red Hat subscription

A Red Hat subscription is required. During the deployment, the RHEL instance is registered to the Red Hat subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.

Make sure you have a valid Red Hat Subscription Manager (RHSM) username, password, and Pool ID. Alternatively, you can use an Activation Key, Org ID, and Pool ID.  You can verify this information by at https://access.redhat.com.

### Red Hat Enterprise Linux CoreOS (RHCOS) 4.9 available in Azure Stack Hub

Red Hat Enterprise Linux CoreOS (RHCOS) 4.9 is not available in the Azure Stack Hub Marketplace. Your cloud operator doesn't need to create an marketplace offering for the RHEL CoreOS 4.9, but the image does not need to be available.

The cloud operator for your Azure Stack Hub instance will need to get the .VHD from Red Hat and load it into a storage container in the Azure Stack Hub environment. Then, the operator can reference the VHD location in the Azure Resource Manager template used to deploy OpenShift. The image is used for deployment and will be used for all control plane. The image can also be used for worker nodes in the cluster. You can also the image or Red Hat Enterprise Linux (RHEL) 7.9 or 8.4 images for worker nodes.

The operator can follow the steps in the Open Shift documentation at:
1. [Uploading the RHCOS cluster image and bootstrap Ignition config file](https://docs.openshift.com/container-platform/4.9/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html#installation-azure-user-infra-uploading-rhcos_installing-azure-stack-hub-user-infra)
2. [Deploying the RHCOS cluster image for the Azure Stack Hub infrastructure](https://docs.openshift.com/container-platform/4.9/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html#installation-azure-user-infra-deploying-rhcos_installing-azure-stack-hub-user-infra)

Contact your Azure Stack Hub cloud operator to add this image using these instructions.
## Deploy by using the OpenShift Container Platform or OKD Resource Manager template

To deploy by using the Azure Resource Manager template, you use a parameters file to supply the input parameters. To further customize the deployment, fork the GitHub repo and change the appropriate items.

Some common customization options include, but aren't limited to:

- Bastion VM size (variable in azuredeploy.json)
- Naming conventions (variables in azuredeploy.json)
- OpenShift cluster specifics, modified via hosts file (deployOpenShift.sh)
- RHEL image reference (variable in azuredeploy.json)

For the steps to deploy using the Azure CLI, follow the appropriate section in the [OpenShift Container Platform](./openshift-container-platform-3x.md) section or the [OKD](./openshift-okd.md) section.

## Next steps

- [Post-deployment tasks](./openshift-container-platform-3x-post-deployment.md)
- [Troubleshoot OpenShift deployment in Azure](./openshift-container-platform-3x-troubleshooting.md)