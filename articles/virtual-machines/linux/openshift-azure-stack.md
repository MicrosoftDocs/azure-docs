---
title: Deploy OpenShift in Azure Stack | Microsoft Docs
description: Deploy OpenShift in Azure Stack.
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

# Deploy OpenShift Container Platform or OKD in Azure Stack

OpenShift can be deployed in Azure Stack. There are some key differences between Azure and Azure Stack so deployment will differ slightly and capabilities will also differ slightly.

Currently, the Azure Cloud Provider does not work in Azure Stack. This means you will not be able to use disk attach for persistent storage in Azure Stack. You can always configure other storage options such as NFS, iSCSI, Gluster, etc. that can be used for persistent storage. As an alternative, you can choose to enable CNS and use Gluster for persistent storage. If CNS is enabled, three additional nodes will be deployed with additional storage for Gluster usage.

You can use one of several methods to deploy OpenShift Container Platform or OKD in Azure Stack:

- You can manually deploy the necessary Azure infrastructure components and then follow the OpenShift Container Platform [documentation](https://docs.openshift.com/container-platform) or OKD [documentation](https://docs.okd.io).
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-container-platform/) that simplifies the deployment of the OpenShift Container Platform cluster.
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-origin) that simplifies the deployment of the OKD cluster.

If using the Resource Manager template, select the proper branch (azurestack-release-3.x). The templates for Azure will not work as the API versions are different between Azure and Azure stack. The RHEL image reference is currently hard coded as a variable in the azuredeploy.json file and will need to be changed to match your image.

```json
"imageReference": {
    "publisher": "Redhat",
    "offer": "RHEL-OCP",
    "sku": "7-4",
    "version": "latest"
}
```

For all options, a Red Hat subscription is required. During the deployment, the Red Hat Enterprise Linux instance is registered to the Red Hat subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.
Ensure that you have a valid Red Hat Subscription Manager (RHSM) username, password, and Pool ID. Alternatively, you can use an Activation Key, Org ID and Pool ID.  You can verify this information by signing in to https://access.redhat.com.

## Azure Stack prerequisites

A RHEL image (OpenShift Container Platform) or CentOS image (OKD) is required to be added to your Azure Stack environment in order to deploy an OpenShift cluster. Contact your Azure Stack administrator to add these images. Instructions can be found here:
https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-add-vm-image 
https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-marketplace-azure-items
https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-redhat-create-upload-vhd

## Deploy by using the OpenShift Container Platform or OKD Resource Manager template

To deploy by using the Resource Manager template, you use a parameters file to supply the input parameters. To customize any of the deployment items that are not covered by using input parameters, fork the GitHub repo and change the appropriate items.

Some common customization options include, but are not limited to:

- Bastion VM size (variable in azuredeploy.json)
- Naming conventions (variables in azuredeploy.json)
- OpenShift cluster specifics, modified via hosts file (deployOpenShift.sh)
- RHEL image reference (variable in azuredeploy.json)

For the steps to deploy using the Azure CLI, follow the appropriate section in the [OpenShift Container Platform](./openshift-container-platform.md) section or the [OKD](./openshift-okd.md) section.

## Next steps

- [Post-deployment tasks](./openshift-post-deployment.md)
- [Troubleshoot OpenShift deployment in Azure](./openshift-troubleshooting.md)