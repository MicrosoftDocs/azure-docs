---
title:  Overview of the Azure Connected System Center Virtual Machine Manager (preview)
description: This article provides a detailed overview of the Azure Arc-enabled System Center Virtual Machine Manager (preview).
ms.date: 12/07/2022
ms.topic: conceptual
ms.services: azure-arc
author: jyothisuri
ms.author: jsuri
keywords: "VMM, Arc, Azure"
ms.custom: references_regions
---

# Overview of Arc-enabled System Center Virtual Machine Manager (preview)

Azure Arc-enabled System Center Virtual Machine Manager (SCVMM) empowers System Center customers to connect their VMM environment to Azure and perform VM self-service operations from Azure portal. With Azure Arc-enabled SCVMM, you get a consistent management experience across Azure.

Azure Arc-enabled System Center Virtual Machine Manager allows you to manage your Hybrid environment and perform self-service VM operations through Azure portal. For Microsoft Azure Pack customers, this solution is intended as an alternative to perform VM self-service operations.

Arc-enabled System Center VMM allows you to:

-	Perform various VM lifecycle operations such as start, stop, pause, delete VMs on VMM managed VMs directly from Azure.
-	Empower developers and application teams to self-serve VM operations on-demand using [Azure role-based access control (RBAC)](../../role-based-access-control/overview.md).
-	Browse your VMM resources (VMs, templates, VM networks, and storage) in Azure, providing you a single pane view for your infrastructure across both environments.
-	Discover and onboard existing SCVMM managed VMs to Azure.

## How does it work?

To Arc-enable a System Center VMM management server, deploy [Azure Arc resource bridge](../resource-bridge/overview.md) (preview) in the VMM environment. Arc resource bridge is a virtual appliance that connects VMM management server to Azure. Azure Arc resource bridge (preview) enables you to represent the SCVMM resources (clouds, VMs, templates etc.) in Azure and do various operations on them.

## Architecture

The following image shows the architecture for the Arc-enabled SCVMM:

:::image type="content" source="media/architecture/arc-scvmm-architecture.png" alt-text="Screenshot of Arc enabled SCVMM - architecture.":::

### Supported VMM versions

Azure Arc-enabled SCVMM works with VMM 2016, 2019 and 2022 versions and supports SCVMM management servers with a maximum of 3500 VMS.

### Supported scenarios

The following scenarios are supported in Azure Arc-enabled SCVMM (preview):

- SCVMM administrators can connect a VMM instance to Azure and browse the SCVMM virtual machine inventory in Azure.
- Administrators can use the Azure portal to browse SCVMM inventory and register SCVMM cloud, virtual machines, VM networks, and VM templates into Azure.
- Administrators can provide app teams/developers fine-grained permissions on those SCVMM resources through Azure RBAC.
- App teams can use Azure interfaces (portal, CLI, or REST API) to manage the lifecycle of on-premises VMs they use for deploying their applications (CRUD, Start/Stop/Restart).

### Supported regions

Azure Arc-enabled SCVMM (preview) is currently supported in the following regions:

- East US
- West Europe

### Resource bridge networking requirements

The following firewall URL exceptions are needed for the Azure Arc resource bridge VM:

| **Service** | **Port** | **URL** | **Direction** | **Notes**|
| --- | --- | --- | --- | --- |
| Microsoft container registry | 443 | `https://mcr.microsoft.com` | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images for installation. |
| Azure Arc Identity service | 443 | `https://*.his.arc.azure.com` | Appliance VM IP and control plane endpoint need outbound connection. | Manages identity and access control for Azure resources |
| Azure Arc configuration service | 443 | `https://*.dp.kubernetesconfiguration.azure.com` | Appliance VM IP and control plane endpoint need outbound connection. | Used for Kubernetes cluster configuration. |
| Cluster connect service | 443 | `https://*.servicebus.windows.net` | Appliance VM IP and control plane endpoint need outbound connection. | Provides cloud-enabled communication to connect on-premises resources with the cloud. |
| Guest Notification service | 443 | `https://guestnotificationservice.azure.com` | Appliance VM IP and control plane endpoint need outbound connection. | Used to connect on-premises resources to Azure. |
| SFS API endpoint | 443 | `msk8s.api.cdp.microsoft.com` | Host machine, Appliance VM IP and control plane endpoint need outbound connection. | Used when downloading product catalog, product bits, and OS images from SFS. |
| Resource bridge (appliance) Data plane service | 443 | `https://*.dp.prod.appliances.azure.com` | Appliance VM IP and control plane endpoint need outbound connection. | Communicate with resource provider in Azure. |
| Resource bridge (appliance) container image download | 443 | `*.blob.core.windows.net`, `https://ecpacr.azurecr.io` | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images. |
| Resource bridge (appliance) image download | 80 | `*.dl.delivery.mp.microsoft.com` | Host machine, Appliance VM IP and control plane endpoint need outbound connection. | Download the Arc resource bridge OS images. |
| Azure Arc for K8s container image download | 443 | `https://azurearcfork8sdev.azurecr.io` | Appliance VM IP and control plane endpoint need outbound connection. | Required to pull container images. |
| ADHS telemetry service | 443 | `adhs.events.data.microsoft.com`  | Appliance VM IP and control plane endpoint need outbound connection. Runs inside the appliance/mariner OS. | Used periodically to send Microsoft required diagnostic data from control plane nodes. Used when telemetry is coming off Mariner, which would mean any K8s control plane. |
| Microsoft events data service | 443 | `v20.events.data.microsoft.com`  | Appliance VM IP and control plane endpoint need outbound connection. | Used periodically to send Microsoft required diagnostic data from the Azure Stack HCI or Windows Server host. Used when telemetry is coming off Windows like Windows Server or HCI. |
| SCVMM management Server | 443 | URL of the SCVMM management server | Appliance VM IP and control plane endpoint need outbound connection. | Used by the SCVMM server to communicate with the Appliance VM and the control plane. |

## Next steps

[See how to create a Azure Arc VM](create-virtual-machine.md)