---
title: Create on-premises virtual network in Azure using hub and spoke network topology
description: Tutorial illustrating how to implement an on-premises VNet on Azure that houses local resources
services: terraform
ms.service: terraform
keywords: terraform, hub and spoke, networks, hybrid networks, devops, virtual machine, azure, VNet peering, on-premises 
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 2/28/2019
---

# Implementing on-premises Virtual Network

In this tutorial, you learn how to implement a simulation of an on-premises network using an Azure Virtual network (VNet) for demo purposes. An Azure VNet could be replaced by your own private virtual network in a private data center. To do so, map the appropriate IP addresses in the subnets.

[!div class="checklist"]

> * Use HCL (HashiCorp Language) to implement an on-premises VNet in hub-spoke topology
> * Use Terraform to create hub network appliance resources
> * Use Terraform to create on-premises virtual machine
> * Use Terraform to create on-premises virtual private network gateway

## Prerequisites

To implement this tutorial, complete the [prerequisites in the Introduction to Hub and Spoke topology](./hub-spoke-introduction.md) article.

## Components

To simulate an on-premises network, we create an Azure virtual network for demo purpose. This demo VNet takes the place of an actual private on-premises network. To do the same with your existing on-premises network, map the appropriate IP addresses in the subnets.

1. Browse to the [Azure portal](http://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview). If you didn't select an environment previously, select **Bash** as your environment.

    ![Cloud Shell prompt](./media/common/azure-portal-cloud-shell-button-min.png)

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Change directories to the new directory:

    ```bash
    cd hub-spoke
    ```

## Declare the on-premises Terraform configuration files

Create the Terraform configuration file that declares an on-premises VNet.

1. In Cloud Shell, create a file named `on-prem.tf`.

    ```bash
    vi on-prem.tf
    ```

1. Enter insert mode by selecting the I key.

1. Paste the following code into the editor:

    ```JSON
    locals {
      onprem-location       = "SouthCentralUS"
      onprem-resource-group = "onprem-vnet-rg"
      prefix-onprem         = "onprem"
    }
    
    resource "azurerm_resource_group" "onprem-vnet-rg" {
      name     = "${local.onprem-resource-group}"
      location = "${local.onprem-location}"
    }
    
    resource "azurerm_virtual_network" "onprem-vnet" {
      name                = "onprem-vnet"
      location            = "${azurerm_resource_group.onprem-vnet-rg.location}"
      resource_group_name = "${azurerm_resource_group.onprem-vnet-rg.name}"
      address_space       = ["192.168.0.0/16"]
    
      tags {
        environment = "${local.prefix-onprem}"
      }
    }
    
    resource "azurerm_subnet" "onprem-gateway-subnet" {
      name                 = "GatewaySubnet"
      resource_group_name  = "${azurerm_resource_group.onprem-vnet-rg.name}"
      virtual_network_name = "${azurerm_virtual_network.onprem-vnet.name}"
      address_prefix       = "192.168.255.224/27"
    }
    
    resource "azurerm_subnet" "onprem-mgmt" {
      name                 = "mgmt"
      resource_group_name  = "${azurerm_resource_group.onprem-vnet-rg.name}"
      virtual_network_name = "${azurerm_virtual_network.onprem-vnet.name}"
      address_prefix       = "192.168.1.128/25"
    }
    
    resource "azurerm_public_ip" "onprem-pip" {
        name                         = "${local.prefix-onprem}-pip"
        location            = "${azurerm_resource_group.onprem-vnet-rg.location}"
        resource_group_name = "${azurerm_resource_group.onprem-vnet-rg.name}"
        public_ip_address_allocation = "dynamic"
    
        tags {
            environment = "${local.prefix-onprem}"
        }
    }
        
    resource "azurerm_network_interface" "onprem-nic" {
      name                 = "${local.prefix-onprem}-nic"
      location             = "${azurerm_resource_group.onprem-vnet-rg.location}"
      resource_group_name  = "${azurerm_resource_group.onprem-vnet-rg.name}"
      enable_ip_forwarding = true
    
      ip_configuration {
        name                          = "${local.prefix-onprem}"
        subnet_id                     = "${azurerm_subnet.onprem-mgmt.id}"
        private_ip_address_allocation = "Dynamic"
        public_ip_address_id          = "${azurerm_public_ip.onprem-pip.id}"
      }
    }
    
    # Create Network Security Group and rule
    resource "azurerm_network_security_group" "onprem-nsg" {
        name                = "${local.prefix-onprem}-nsg"
        location            = "${azurerm_resource_group.onprem-vnet-rg.location}"
        resource_group_name = "${azurerm_resource_group.onprem-vnet-rg.name}"
    
        security_rule {
            name                       = "SSH"
            priority                   = 1001
            direction                  = "Inbound"
            access                     = "Allow"
            protocol                   = "Tcp"
            source_port_range          = "*"
            destination_port_range     = "22"
           source_address_prefix      = "*"
            destination_address_prefix = "*"
        }
    
        tags {
            environment = "onprem"
        }
    }
    
    resource "azurerm_subnet_network_security_group_association" "mgmt-nsg-association" {
      subnet_id                 = "${azurerm_subnet.onprem-mgmt.id}"
      network_security_group_id = "${azurerm_network_security_group.onprem-nsg.id}"
    }
    
    resource "azurerm_virtual_machine" "onprem-vm" {
      name                  = "${local.prefix-onprem}-vm"
      location              = "${azurerm_resource_group.onprem-vnet-rg.location}"
      resource_group_name   = "${azurerm_resource_group.onprem-vnet-rg.name}"
      network_interface_ids = ["${azurerm_network_interface.onprem-nic.id}"]
      vm_size               = "${var.vmsize}"
    
      storage_image_reference {
        publisher = "Canonical"
        offer     = "UbuntuServer"
        sku       = "16.04-LTS"
        version   = "latest"
      }
    
      storage_os_disk {
        name              = "myosdisk1"
        caching           = "ReadWrite"
        create_option     = "FromImage"
        managed_disk_type = "Standard_LRS"
      }
    
      os_profile {
        computer_name  = "${local.prefix-onprem}-vm"
        admin_username = "${var.username}"
        admin_password = "${var.password}"
      }
    
      os_profile_linux_config {
        disable_password_authentication = false
      }
    
      tags {
        environment = "${local.prefix-onprem}"
      }
    }
    
    resource "azurerm_public_ip" "onprem-vpn-gateway1-pip" {
      name                = "${local.prefix-onprem}-vpn-gateway1-pip"
      location            = "${azurerm_resource_group.onprem-vnet-rg.location}"
      resource_group_name = "${azurerm_resource_group.onprem-vnet-rg.name}"
    
      allocation_method = "Dynamic"
    }
    
    resource "azurerm_virtual_network_gateway" "onprem-vpn-gateway" {
      name                = "onprem-vpn-gateway1"
      location            = "${azurerm_resource_group.onprem-vnet-rg.location}"
      resource_group_name = "${azurerm_resource_group.onprem-vnet-rg.name}"
    
      type     = "Vpn"
      vpn_type = "RouteBased"
    
      active_active = false
      enable_bgp    = false
    
     sku           = "VpnGw1"
    
      ip_configuration {
        name                          = "vnetGatewayConfig"
        public_ip_address_id          = "${azurerm_public_ip.onprem-vpn-gateway1-pip.id}"
        private_ip_address_allocation = "Dynamic"
        subnet_id                     = "${azurerm_subnet.onprem-gateway-subnet.id}"
      }
    }
    ```

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

## Next steps

In this article, we created a simulation of on-premises network on Azure using a virtual network. To continue with the entire hub-spoke topology tutorial, complete the remaining steps.

 > [!div class="nextstepaction"] 
 > [Hub network](./terraform-hub-spoke-hub-network.md)