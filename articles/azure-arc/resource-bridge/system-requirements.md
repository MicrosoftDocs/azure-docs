---
title: Azure Arc resource bridge (preview) system requirements
description: Learn about system requirements for Azure Arc resource bridge (preview) including URLs that must be allowlisted.
ms.topic: conceptual
ms.date: 02/15/2023
---

# Azure Arc resource bridge (preview) network requirements

This article describes the system requirements for deploying Azure Arc resource bridge (preview).

Arc resource bridge is used with other partner products, such as [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-overview), [Arc-enabled VMware vSphere](../vmware-vsphere/index.yml), and [Arc-enabled System Center Virtual Machine Manager (SCVMM)](../system-center-virtual-machine-manager/index.yml). These products may have additional requirements.  

## Minimum resource requirements

Arc resource bridge has the following minimum resource requirements:

- 50 GB disk space
- 4 vCPUs
- 8 GB memory

These minimum requirements enable most scenarios. However, a partner product may support a higher resource connection count to Arc resource bridge, which requires the bridge to have higher resource requirements. Failure to provide sufficient resources may result in a number of errors during deployment, such as disk copy errors. Review the partner product's documentation for specific resource requirements.

> [!NOTE]
> To use Arc resource bridge with Azure Kubernetes Service (AKS) on Azure Stack HCI, the AKS clusters must be deployed prior to deploying Arc resource bridge. If Arc resource bridge has already been deployed, AKS clusters can't be installed unless you delete Arc resource bridge first. Once your AKS clusters are deployed to Azure Stack HCI, you can deploy Arc resource bridge again.

## Management machine requirements

The machine used to run the commands to deploy Arc resource bridge, and maintain it, is called the *management machine*. The management machine should be considered part of the Arc resource bridge ecosystem, as it has specific requirements and is necessary to manage the appliance VM.

Because the management machine needs these specific requirements to manage Arc resource bridge, once the machine is setup, it should continue to be the primary machine used to maintain Arc resource bridge.  

The management machine should have the following:

- [Azure CLI x64](/cli/azure/install-azure-cli-windows?tabs=azure-cli) installed
- Open communication to Control Plane IP (`controlplaneendpoint` parameter in `createconfig` command)
- Open communication to Appliance VM IP (`k8snodeippoolstart` parameter in `createconfig` command)
- Open communication to the reserved Appliance VM IP for upgrade (`k8snodeippoolend` parameter in `createconfig` command)
- Internal and external DNS resolution. The DNS server must resolve internal names, such as the vCenter endpoint for vSphere or cloud agent service endpoint for Azure Stack HCI. The DNS server must also be able to resolve external addresses that are [required URLs](network-requirements.md#outbound-connectivity) for deployment.
- If using a proxy, the proxy server configuration on the management machine must allow the machine to have internet access and to connect to [required URLs](network-requirements.md#outbound-connectivity) needed for deployment, such as the URL to download OS images.  

## Appliance VM requirements



## Next steps

- Review the [Azure Arc resource bridge (preview) overview](overview.md) to understand more about requirements and technical details.
- Learn about [security configuration and considerations for Azure Arc resource bridge (preview)](security-overview.md).
