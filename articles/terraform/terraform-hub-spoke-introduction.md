---
title: Create a hub and spoke hybrid network topology in Azure
description: Tutorial illustrating how to create an entire hybrid network reference architecture in Azure using Terraform
services: terraform
ms.service: terraform
keywords: terraform, hub and spoke, networks, hybrid networks, devops, virtual machine, azure,  vnet peering, network virtual appliance
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 2/28/2019
---

# Hub and spoke network topology

This tutorial shows how to implement one of the popular [Hybrid network topology](/azure/architecture/reference-architectures/hybrid-networking/). In this artilce, you learn how to connect an on-premises network to an Azure virtual network. A hub and spoke network topology is a way to isolate workloads while sharing common services like identity and security. The hub is a virtual network in Azure that acts as a central point of connectivity to on-premises network. The spokes are VNets that peer with the hub. Shared services are deployed in the hub, while individual workloads are deployed inside spoke networks.  

To learn about the recommendations and considerations for this topology, refer [hub and spoke reference architecture](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke).

![Hub and spoke topology architecture in Azure](./media/terraform-hub-spoke-introduction/hub-spoke-architecture.png)

## The benefits of hub and spoke topology

- **Cost savings** by centralizing services in a single location that can be shared by multiple workloads. These workloads include network virtual appliances and DNS servers.
- **Overcome subscriptions limits** by peering VNets from different subscriptions to the central hub.
- **Separation of concerns** between central IT (SecOps, InfraOps) and workloads (DevOps).

## Typical uses for this architecture

Some of the typical uses for a hub and spoke architecture include:

- Many customers have workloads that are deployed in different environments. These environments include development, testing, and production. Many times, these workloads need to share services such as DNS, IDS, NTP, or AD DS. These shared services can be placed in the hub VNet. That way, each environment is deployed to a spoke to maintain isolation.
- Workloads that do not require connectivity to each other, but require access to shared services.
- Enterprises that require central control over security aspects, such as a firewall in the hub as a DMZ, and segregated management for the workloads in each spoke.

In this tutorial, you learn how to do the following tasks in creating a [Hub and spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke):

> [!div class="checklist"]

> * Use HCL (HashiCorp Language) to lay out hub and spoke hybrid network reference architecture resources
> * Use Terraform to create hub network appliance resources
> * Use Terraform to create hub network in Azure to act as common point 
for all resources
> * Use Terraform to create individual workloads as spoke virtual networks in Azure
> * Use Terraform to establish gateways and connections between on premises and Azure networks
> * Use Terraform to create VNet peerings to spoke networks

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **Configure Terraform**: Follow the directions in the article, [Terraform and configure access to Azure](/azure/virtual-machines/linux/terraform-install-configure)

- **Azure service principal**: Follow the directions in the section of the **Create the service principal** section in the article, [Create an Azure service principal with Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest). Take note of the values for the appId, displayName, and password.
- Note the Object ID of the Service Principal by running the following command

    ```bash
        az ad sp list --display-name <displayName>
    ```

### Create the directory structure

The first step is to create the directory that holds your Terraform configuration files for the exercise.

1. Browse to the [Azure portal](http://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview). If you didn't select an environment previously, select **Bash** as your environment.

    ![Cloud Shell prompt](./media/common/azure-portal-cloud-shell-button-min.png)

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Create a directory named `hub-spoke`.

    ```bash
    mkdir hub-spoke
    ```

1. Change directories to the new directory:

    ```bash
    cd hub-spoke
    ```

### Declare the Azure provider

Create the Terraform configuration file that declares the Azure provider.

1. In Cloud Shell, create a file named `main.tf`.

    ```bash
    vi main.tf
    ```

1. Enter insert mode by selecting the I key.

1. Paste the following code into the editor:

    ```JSON
    provider "azurerm" {
        version = "~>1.18"
    }
    ```

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

### Declare the variables file

Create the Terraform configuration file for common variables that are used across different scripts.

1. In Cloud Shell, create a file named `variables.tf`.

    ```bash
    vi variables.tf
    ```

1. Enter insert mode by selecting the I key.

1. Paste the following code into the editor:

    ```JSON
    variable "location" {
      description = "Location of the network"
      default     = "centralus"
    }
    
    variable "username" {
      description = "Username for Virtual Machines"
      default     = "testadmin"
    }
    
    variable "password" {
      description = "Password for Virtual Machines"
      default     = "Password1234!"
    }
    
    variable "vmsize" {
      description = "Size of the VMs"
      default     = "Standard_DS1_v2"
    }
    ```

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

## Components

The architecture consists of the following components. Each one is implemented as a separate Terraform script and to complete this reference architecture all the scripts need to be deployed.

- **On-Premises network**. A private local-area network running with an Organization. For hub and spoke reference architecture, we will use a VNet in Azure to simulate On-premises network.

- **VPN Device**. A device or service that provides external connectivity to the on-premises network. The VPN device may be a hardware appliance or a software solution. An example is the Routing and Remote Access Service (RRAS) in Windows Server 2012. For more information about configuring selected VPN appliances for connecting to Azure, see [About VPN devices for Site-to-Site VPN Gateway connections](/azure/vpn-gateway/vpn-gateway-about-vpn-devices).

- **Hub Virtual Network**. Azure Virtual Network used as the hub in the hub and spoke topology. The hub is the central point of connectivity to your on-premises network and a place to host services. These services can be consumed by the different workloads hosted in the spoke VNets.

- **Gateway subnet**. The virtual network gateways are held in the same subnet.

- **Spoke Virtual Networks**. One or more Azure VNets that are used as spokes in the hub and spoke topology. Spokes can be used to isolate workloads in their own VNets, managed separately from other spokes. Each workload might include multiple tiers, with multiple subnets connected through Azure load balancers. For more information about the application infrastructure, see Running Windows VM workloads and Running Linux VM workloads.

- **VNet peering**. Two VNets can be connected using a peering connection. Peering connections are non-transitive, low latency connections between VNets. Once peered, the VNets exchange traffic by using the Azure backbone, without the need for a router. In a hub and spoke network topology, you use VNet peering to connect the hub to each spoke. You can peer virtual networks in the same region, or different regions.

This tutorial is implemented in multiple articles to cover all the details. Implement all the articles to complete the entire hub and spoke topology.

- [Complete the prerequisites and variables section in this tutorial](./terraform-hub-spoke-introduction.md)
- [On premises network](./terraform-hub-spoke-on-prem.md)
- [Hub virtual network](./terraform-hub-spoke-hub-network.md)
- [Hub network virtual appliance](./terraform-hub-spoke-hub-nva.md)
- [Spoke networks](./terraform-hub-spoke-spoke-network.md)
- [Validation of the topology](./terraform-hub-spoke-validation.md)

## Next steps

In this article, you learned the introduction to hub and spoke topology for Hybrid networks. To start implementing this architecture, continue to implement on premises network tutorial.

 > [!div class="nextstepaction"] 
 > [On-Premises network](./terraform-hub-spoke-on-prem.md)