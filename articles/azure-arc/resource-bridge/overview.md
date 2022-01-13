---
title: Azure Arc resource bridge (preview) overview
description: Learn how to use Azure Arc resource bridge (preview) to support VM self-servicing on Azure Stack HCI, VMware, and System Center Virtual Machine Manager.
ms.date: 11/08/2021
ms.topic: overview
ms.custom: references_regions 
---

# What is Azure Arc resource bridge (preview)?

Azure Arc resource bridge (preview) is part of the core Azure Arc platform, and is designed to host other Azure Arc services. In this release, the resource bridge supports VM self-servicing and management from Azure, for virtualized Windows and Linux virtual machines hosted in an on-premises environment on [Azure Stack HCI](/azure-stack/hci/overview) and VMware. The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster that requires no user management. This virtual appliance delivers the following benefits:

* Enables VM self-servicing from Azure without having to create and manage a Kubernetes cluster
* It is fully supported by Microsoft, including update of core components.
* Designed to recover from software failures.
* Supports deployment to any private cloud hosted on Hyper-V or VMware from the Azure portal or using the Azure Command-Line Interface (CLI).

All management operations are performed from Azure, no local configuration is required on the appliance.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Overview

Azure resource bridge (preview) hosts other components such as Custom Locations, cluster extensions, and other Azure Arc agents in order to deliver the level of functionality with the private cloud infrastructures it supports. This complex system is composed of three layers:

* The base layer that represents the resource bridge and the Arc agents
* The platform layer that includes the Custom Location and Cluster extension
* The solution layer for each service supported by Arc resource bridge (that is, the different type of VMs).

:::image type="content" source="media/overview/architecture-overview.png" alt-text="Azure Arc resource bridge architecture diagram." border="false":::

Azure Arc resource bridge (preview) can host other Azure services or solutions running on-premises. For this preview, there are two objects hosted on the Arc resource bridge (preview):

* Cluster extension: Is the Azure service deployed to run on-premises. For the preview release, it supports two services:

   - Azure Arc-enabled VMware

   - Azure Arc-enabled Azure Stack HCI

* Custom Locations: Is a deployment target, where you can create Azure resources. It maps to different resource for different Azure services. For example, for Arc-enabled VMware, the Custom Locations resource maps to an instance of vCenter, and for Arc-enabled Azure Stack HCI, it maps to an HCI cluster instance.

Custom Locations and cluster extension are both Azure resources, they are linked to the Azure Arc resource bridge (preview) resource in Azure Resource Manager. When you create an on-premises VM from Azure, you can select the custom location, and that routes that *create action* to the mapped vCenter or Azure Stack HCI cluster.

There is a set of resources unique to the infrastructure. For example, vCenter has a resource pool, network, and template resources. During VM creation, these resources need to be specified. With Azure Stack HCI, you just need to select the custom location, network and template to create a VM.

To summarize, the Azure resources are projections of the resources running in your on-premises private cloud. If the on-premises resource is not healthy, it can impact the health of the related resources. For example, if the Arc resource bridge (preview) has been deleted by accident, all the resources hosted in the Arc resource bridge (preview) are impacted. That is, the Custom Locations and cluster extensions are deleted as a result. The actual VMs are not impacted, as they are running on vCenter, but the management path to those VMs is interrupted. You won't be able to start/stop the VM from Azure. It is not recommended to manage or modify the Arc resource bridge (preview) using any on-premises applications directly.

## Benefits of Azure Arc resource bridge (preview)

Through the Azure Arc resource bridge (preview), you can accomplish the following for each private cloud infrastructure from Azure:

* VMware vSphere - By registering resource pools, networks, and VM templates in Azure you can represent a subset of your vCenter resources in Azure to enable self-service. Integration with Azure allows you to not only manage access to your vCenter resources in Azure to maintain a secure environment, but also to perform various operations on the VMware virtual machines that are enabled by Arc-enabled VMware vSphere:

- Start, stop, and restart a virtual machine
- Control access and add Azure tags
- Add, remove, and update network interfaces
- Add, remove, and update disks and update VM size (CPU cores and memory)
- Enable guest management
- Install extensions

* Azure Stack HCI - You can provision and manage on-premises Windows and Linux virtual machines (VMs) running on Azure Stack HCI clusters.

## Prerequisites

[Azure CLI](/cli/azure/install-azure-cli) is required to deploy the Azure Arc resource bridge on supported private cloud environments.

If you are deploying on VMware, a x64 Python environment is required. The [pip](https://pypi.org/project/pip/) package installer for Python is also required.

If you are deploying on Azure Stack HCI, the x32 Azure CLI installer can be used to install Azure CLI.

### Supported regions

Azure Arc resource bridge currently supports the following Azure regions:

- East US

- West Europe

### Regional resiliency

While Azure has a number of redundancy features at every level of failure, if a service impacting event occurs, this preview release of Azure Arc resource bridge does not support cross-region failover or other resiliency capabilities. In the event of the service becoming unavailable, the on-premises VMs continue to operate unaffected. Management from Azure is unavailable during that service outage.

### Private cloud environments

The following private cloud environments and their versions are officially supported for the Azure Arc resource bridge:

* VMware vSphere version 6.5
* Azure Stack HCI

### Required Azure permissions

* To onboard the Arc resource bridge, you are a member of the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role in the resource group.

* To read, modify, and delete the resource bridge, you are a member of the **Name of role** role in the resource group.

### Networking

The Arc resource bridge communicates outbound securely to Azure Arc over TCP port 443. If the appliance needs to connect through a firewall or proxy server to communicate over the internet, it communicates outbound using the HTTPS protocol.

If outbound connectivity is restricted by your firewall or proxy server, make sure the URLs listed below are not blocked.

URLS:

| Agent resource | Description |
|---------|---------|
|`https://mcr.microsoft.com`|Microsoft container registry|
|`https://*.his.arc.azure.com`|Azure Arc Identity service|
|`https://*.dp.kubernetesconfiguration.azure.com`|Azure Arc configuration service|
|`https://*.servicebus.windows.net`|Cluster connect|
|`https://guestnotificationservice.azure.com` |Guest notification service|
|`https://*.dp.prod.appliances.azure.com`|Resource bridge data plane service|
|`https://ecpacr.azurecr.io` |Resource bridge container image download |
|`.blob.core.windows.net`<br> `*.dl.delivery.mp.microsoft.com`<br> `*.do.dsp.mp.microsoft.com` |Resource bridge image download |

## Next steps

To learn more about how Azure Arc-enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure, see the following [Overview](/azure/azure-arc/vmware-vsphere/overview) article.
