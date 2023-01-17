---
title: Deploy OpenShift to Azure Stack Hub 
description: Deploy OpenShift to Azure Stack Hub.
author: mattbriggs
manager: femila
ms.author: mabrigg
ms.service: virtual-machines
ms.subservice: openshift
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure
ms.date: 11/29/2021

---

# Deploy OpenShift Container Platform or OKD to Azure Stack Hub

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

[OpenShift](openshift-get-started.md) can be deployed in Azure Stack Hub. There are some key differences between Azure and Azure Stack Hub so deployment will differ slightly and capabilities will also differ slightly.

Currently, the Azure Cloud Provider doesn't work in Azure Stack Hub. You won't be able to use disk attach for persistent storage in Azure Stack Hub. Instead, you can configure other storage options such as NFS, iSCSI, and GlusterFS. Or, you can enable CNS and use GlusterFS for persistent storage. If CNS is enabled, three more nodes will be deployed with storage for GlusterFS usage.

## Deploy OpenShift 3.x On Azure Stack Hub

You can use one of several methods to deploy OpenShift Container Platform or OKD in Azure Stack Hub:

- You can manually deploy the necessary Azure infrastructure components and then follow the [OpenShift Container Platform documentation](https://docs.openshift.com/container-platform) or [OKD documentation](https://docs.okd.io).
- You can also use an existing [Azure Resource Manager template](https://github.com/Microsoft/openshift-container-platform/) that simplifies the deployment of the OpenShift Container Platform cluster.
- You can also use an existing [Azure Resource Manager template](https://github.com/openshift/origin) that simplifies the deployment of the OKD cluster.

If using the Azure Resource Manager template, select the proper branch (azurestack-release-3.x). The templates for Azure won't work as the API versions are different between Azure and Azure Stack Hub. The RHEL image reference is currently hard-coded as a variable in the azuredeploy.json file and will need to be changed to match your image.

```json
"imageReference": {
    "publisher": "Redhat",
    "offer": "RHEL-OCP",
    "sku": "7-4",
    "version": "latest"
}
```

For all options, a Red Hat subscription is required. During the deployment, the Red Hat Enterprise Linux instance is registered to the Red Hat subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.
Make sure you have a valid Red Hat Subscription Manager (RHSM) username, password, and Pool ID. Alternatively, you can use an Activation Key, Org ID, and Pool ID.  You can verify this information at https://access.redhat.com.

### Azure Stack Hub prerequisites

An RHEL image (OpenShift Container Platform) or CentOS image (OKD) needs to be added to your Azure Stack Hub environment to deploy an OpenShift cluster. Contact your Azure Stack Hub cloud operator to add these images. Instructions can be found here:

- [Add and remove a custom VM image to Azure Stack Hub](/azure-stack/operator/azure-stack-add-vm-image)
- [Azure Marketplace items available for Azure Stack Hub](/azure-stack/operator/azure-stack-marketplace-azure-items)
- [Offer a Red Hat-based virtual machine for Azure Stack Hub](/azure-stack/operator/azure-stack-redhat-create-upload-vhd)

### Deploy by using the OpenShift Container Platform or OKD Azure Resource Manager template

To deploy by using the Azure Resource Manager template, you use a parameters file to supply the input parameters. To further customize the deployment, fork the GitHub repo and change the appropriate items.

Some common customization options include, but aren't limited to:

- Bastion VM size (variable in `azuredeploy.json`)
- Naming conventions (variables in` azuredeploy.json`)
- OpenShift cluster specifics, modified via hosts file (`deployOpenShift.sh`)
- RHEL image reference (variable in `azuredeploy.json`)

For the steps to deploy using the Azure CLI, follow the appropriate section in the [OpenShift Container Platform](./openshift-container-platform-3x.md) section or the [OKD](./openshift-okd.md) section.
## Deploy OpenShift 4.x On Azure Stack Hub

Red Hat manages the Red Hat Enterprise Linux CoreOS (RHCOS) image for OpenShift 4.x. The deployment process gets the image from a Red Hat endpoint. As a result, the user (tenant) doesn't need to get an image from the Azure Stack hub Marketplace.

You can follow the steps in the OpenShift documentation at [Installing a cluster on Azure Stack Hub using ARM templates](https://docs.openshift.com/container-platform/4.9/installing/installing_azure_stack_hub/installing-azure-stack-hub-user-infra.html).

> [!WARNING]
> If you have an issue with OpenShift, please contact Red Hat for support.
## Next steps

- [Post-deployment tasks](./openshift-container-platform-3x-post-deployment.md)
- [Troubleshoot OpenShift deployment in Azure](./openshift-container-platform-3x-troubleshooting.md)
