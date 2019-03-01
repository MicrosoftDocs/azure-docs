---
title: Create a hub virtual network appliance with Terraform in Azure
description: Tutorial implements creation of Hub VNet that acts as a common connection point between all the other networks
services: terraform
ms.service: terraform
keywords: terraform, hub and spoke, networks, hybrid networks, devops, virtual machine, azure, VNet peering, hub-spoke, hub. 
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 2/28/2019
---

# Tutorial: Create a hub virtual network appliance with Terraform in Azure

A **VPN device** is a device that provides external connectivity to an on-premises network. The VPN device may be a hardware device or a software solution. One example of a software solution is Routing and Remote Access Service (RRAS) in Windows Server 2012. For more information about VPN appliances, see [About VPN devices for Site-to-Site VPN Gateway connections](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-about-vpn-devices).

Azure supports a broad variety of network virtual appliances from which to select. For this tutorial, an Ubuntu image is used. To learn more about the broad variety of device solutions supported in Azure, see the [Network Appliances home page](https://azure.microsoft.com/solutions/network-appliances/).

> [!div class="checklist"]
> * Use HCL (HashiCorp Language) to implement the Hub VNet in hub-spoke topology
> * Use Terraform to create Hub Network Virtual Machine which acts as appliance
> * Use Terraform to enable routes using CustomScript extensions
> * Use Terraform to create Hub and Spoke gateway route tables

## Prerequisites

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./terraform-hub-spoke-introduction.md).
- [Create on-premises virtual network with Terraform in Azure](./terraform-hub-spoke-on-prem.md).
- [Create a hub virtual network with Terraform in Azure](./terraform-hub-spoke-hub-network.md).

## Create the directory structure

1. Browse to the [Azure portal](http://portal.azure.com).

1. Open [Azure Cloud Shell](/azure/cloud-shell/overview). If you didn't select an environment previously, select **Bash** as your environment.

    ![Cloud Shell prompt](./media/terraform-common/azure-portal-cloud-shell-button-min.png)

1. Change directories to the `clouddrive` directory.

    ```bash
    cd clouddrive
    ```

1. Change directories to the new directory:

    ```bash
    cd hub-spoke
    ```

## Declare the hub network appliance Terraform configuration files

Create the Terraform configuration file that declares On-Premises Virtual network.

1. In Cloud Shell, create a file named `hub-nva.tf`.

    ```bash
    vi hub-nva.tf
    ```

1. Enter insert mode by selecting the I key.

1. Paste the following code into the editor:
    
    ```JSON
    locals {
      prefix-hub-nva         = "hub-nva"
      hub-nva-location       = "CentralUS"
      hub-nva-resource-group = "hub-nva-rg"
    }
    
    resource "azurerm_resource_group" "hub-nva-rg" {
      name     = "${local.prefix-hub-nva}-rg"
      location = "${local.hub-nva-location}"
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    
    resource "azurerm_network_interface" "hub-nva-nic" {
      name                 = "${local.prefix-hub-nva}-nic"
      location             = "${azurerm_resource_group.hub-nva-rg.location}"
      resource_group_name  = "${azurerm_resource_group.hub-nva-rg.name}"
      enable_ip_forwarding = true
    
      ip_configuration {
        name                          = "${local.prefix-hub-nva}"
        subnet_id                     = "${azurerm_subnet.hub-dmz.id}"
        private_ip_address_allocation = "Static"
        private_ip_address            = "10.0.0.37"
      }
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    
    resource "azurerm_virtual_machine" "hub-nva-vm" {
      name                  = "${local.prefix-hub-nva}-vm"
      location              = "${azurerm_resource_group.hub-nva-rg.location}"
      resource_group_name   = "${azurerm_resource_group.hub-nva-rg.name}"
      network_interface_ids = ["${azurerm_network_interface.hub-nva-nic.id}"]
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
        computer_name  = "${local.prefix-hub-nva}-vm"
        admin_username = "${var.username}"
        admin_password = "${var.password}"
      }
    
      os_profile_linux_config {
        disable_password_authentication = false
      }
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    
    resource "azurerm_virtual_machine_extension" "enable-routes" {
      name                 = "enable-iptables-routes"
      location             = "${azurerm_resource_group.hub-nva-rg.location}"
      resource_group_name  = "${azurerm_resource_group.hub-nva-rg.name}"
      virtual_machine_name = "${azurerm_virtual_machine.hub-nva-vm.name}"
      publisher            = "Microsoft.Azure.Extensions"
      type                 = "CustomScript"
      type_handler_version = "2.0"
    
      settings = <<SETTINGS
        {
            "fileUris": [
             "https://raw.githubusercontent.com/mspnp/reference-architectures/master/scripts/linux/enable-ip-forwarding.sh"
             ],
            "commandToExecute": "bash enable-ip-forwarding.sh"
        }
    SETTINGS
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    
    resource "azurerm_route_table" "hub-gateway-rt" {
      name                          = "hub-gateway-rt"
      location                      = "${azurerm_resource_group.hub-nva-rg.location}"
      resource_group_name           = "${azurerm_resource_group.hub-nva-rg.name}"
      disable_bgp_route_propagation = false
    
      route {
        name           = "toHub"
        address_prefix = "10.0.0.0/16"
        next_hop_type  = "VnetLocal"
      }
    
      route {
        name                   = "toSpoke1"
        address_prefix         = "10.1.0.0/16"
        next_hop_type          = "VirtualAppliance"
        next_hop_in_ip_address = "10.0.0.36"
      }
    
      route {
        name                   = "toSpoke2"
        address_prefix         = "10.2.0.0/16"
        next_hop_type          = "VirtualAppliance"
        next_hop_in_ip_address = "10.0.0.36"
      }
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    
    resource "azurerm_route_table" "spoke1-rt" {
      name                          = "spoke1-rt"
      location                      = "${azurerm_resource_group.hub-nva-rg.location}"
      resource_group_name           = "${azurerm_resource_group.hub-nva-rg.name}"
      disable_bgp_route_propagation = false
    
      route {
        name                   = "toSpoke2"
        address_prefix         = "10.2.0.0/16"
        next_hop_type          = "VirtualAppliance"
        next_hop_in_ip_address = "10.0.0.36"
      }
    
      route {
        name           = "default"
        address_prefix = "0.0.0.0/0"
        next_hop_type  = "vnetlocal"
      }
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    
    resource "azurerm_route_table" "spoke2-rt" {
      name                          = "spoke2-rt"
      location                      = "${azurerm_resource_group.hub-nva-rg.location}"
      resource_group_name           = "${azurerm_resource_group.hub-nva-rg.name}"
      disable_bgp_route_propagation = false
    
      route {
        name                   = "toSpoke1"
        address_prefix         = "10.1.0.0/16"
        next_hop_in_ip_address = "10.0.0.36"
        next_hop_type          = "VirtualAppliance"
      }
    
      route {
        name           = "default"
        address_prefix = "0.0.0.0/0"
        next_hop_type  = "vnetlocal"
      }
    
      tags {
        environment = "${local.prefix-hub-nva}"
      }
    }
    ```

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a spoke virtual networks with Terraform in Azure](./terraform-hub-spoke-spoke-network.md)