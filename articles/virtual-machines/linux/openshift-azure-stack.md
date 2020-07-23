---
title: Deploy OpenShift in Azure Stack 
description: Deploy OpenShift in Azure Stack.
author: haroldwongms
manager: joraio
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 10/14/2019
ms.author: haroldw
---

# Deploy OpenShift Container Platform or OKD in Azure Stack

OpenShift can be deployed in Azure Stack. There are some key differences between Azure and Azure Stack so deployment will differ slightly and capabilities will also differ slightly.

Currently, the Azure Cloud Provider doesn't work in Azure Stack. For this reason, you won't be able to use disk attach for persistent storage in Azure Stack. Instead, you can configure other storage options such as NFS, iSCSI, GlusterFS, etc. As an alternative, you can enable CNS and use GlusterFS for persistent storage. If CNS is enabled, three additional nodes will be deployed with additional storage for GlusterFS usage.

You can use one of several methods to deploy OpenShift Container Platform or OKD in Azure Stack:

- You can manually deploy the necessary Azure infrastructure components and then follow the [OpenShift Container Platform documentation](https://docs.openshift.com/container-platform) or [OKD documentation](https://docs.okd.io).
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-container-platform/) that simplifies the deployment of the OpenShift Container Platform cluster.
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-origin) that simplifies the deployment of the OKD cluster.

If using the Resource Manager template, select the proper branch (azurestack-release-3.x). The templates for Azure won't work as the API versions are different between Azure and Azure Stack. The RHEL image reference is currently hard-coded as a variable in the azuredeploy.json file and will need to be changed to match your image.

```json
"imageReference": {
    "publisher": "Redhat",
    "offer": "RHEL-OCP",
    "sku": "7-4",
    "version": "latest"
}
```

For all options, a Red Hat subscription is required. During the deployment, the Red Hat Enterprise Linux instance is registered to the Red Hat subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.
Make sure you have a valid Red Hat Subscription Manager (RHSM) username, password, and Pool ID. Alternatively, you can use an Activation Key, Org ID, and Pool ID.  You can verify this information by signing in to https://access.redhat.com.

## Azure Stack prerequisites

A RHEL image (OpenShift Container Platform) or CentOS image (OKD) needs to be added to your Azure Stack environment to deploy an OpenShift cluster. Contact your Azure Stack administrator to add these images. Instructions can be found here:

- https://docs.microsoft.com/azure/azure-stack/azure-stack-add-vm-image
- https://docs.microsoft.com/azure/azure-stack/azure-stack-marketplace-azure-items
- https://docs.microsoft.com/azure/azure-stack/azure-stack-redhat-create-upload-vhd

## Deploy by using the OpenShift Container Platform or OKD Resource Manager template

To deploy by using the Resource Manager template, you use a parameters file to supply the input parameters. To further customize the deployment, fork the GitHub repo and change the appropriate items.

Some common customization options include, but aren't limited to:

- Bastion VM size (variable in azuredeploy.json)
- Naming conventions (variables in azuredeploy.json)
- OpenShift cluster specifics, modified via hosts file (deployOpenShift.sh)
- RHEL image reference (variable in azuredeploy.json)

For the steps to deploy using the Azure CLI, follow the appropriate section in the [OpenShift Container Platform](./openshift-container-platform-3x.md) section or the [OKD](./openshift-okd.md) section.

## Next steps

- [Post-deployment tasks](./openshift-container-platform-3x-post-deployment.md)
- [Troubleshoot OpenShift deployment in Azure](./openshift-container-platform-3x-troubleshooting.md)