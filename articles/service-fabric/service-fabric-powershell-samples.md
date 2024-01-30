---
title: Azure PowerShell Samples - Service Fabric 
description: Learn about the creation and management of Azure Service Fabric clusters, apps, and services using PowerShell.
ms.topic: sample
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurepowershell
services: service-fabric
ms.date: 07/11/2022
---

# Azure Service Fabric PowerShell samples

The following table includes links to PowerShell scripts samples that create and manage Service Fabric clusters, applications, and services.

[!INCLUDE [links to azure CLI and service fabric CLI](../../includes/service-fabric-powershell.md)]

| Script | Description |
|-|-|
| **Create cluster** ||
| [Create a cluster (Azure)](./scripts/service-fabric-powershell-create-secure-cluster-cert.md)| Creates an Azure Service Fabric cluster. |
| **Manage cluster, nodes, and infrastructure** ||
| [Add an application certificate](./scripts/service-fabric-powershell-add-application-certificate.md)| Creates an X509 certificate to Key Vault and deploys it to a virtual machine scale set in your cluster. |
| [Update the RDP port range on cluster VMs](./scripts/service-fabric-powershell-change-rdp-port-range.md)|Changes the RDP port range on cluster node VMs in a deployed cluster.|
| [Update the admin user and password for cluster node VMs](./scripts/service-fabric-powershell-change-rdp-user-and-pw.md) | Updates the admin username and password for cluster node VMs. |
| [Open a port in the load balancer](./scripts/service-fabric-powershell-open-port-in-load-balancer.md) | Open an application port in the Azure load balancer to allow inbound traffic on a specific port. |
| [Create an inbound network security group rule](./scripts/service-fabric-powershell-add-nsg-rule.md) | Create an inbound network security group rule to allow inbound traffic to the cluster on a specific port. |
| **Manage applications** ||
| [Deploy an application](./scripts/service-fabric-powershell-deploy-application.md)| Deploy an application to a cluster.|
| [Upgrade an application](./scripts/service-fabric-powershell-upgrade-application.md)| Upgrade an application.|
| [Remove an application](./scripts/service-fabric-powershell-remove-application.md)| Remove an application from a cluster.|
