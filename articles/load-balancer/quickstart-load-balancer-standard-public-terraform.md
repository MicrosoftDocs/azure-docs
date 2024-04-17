---
title: "Quickstart: Create a public load balancer - Terraform"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create a load balancer by using Terraform.
services: load-balancer
author: hisriram96
manager: vikasbagde
ms.service: load-balancer
ms.topic: quickstart
ms.date: 01/02/2024
ms.author: sriramiyer
ms.custom: devx-track-terraform
#Customer intent: I want to create a load balancer by using Terraform so that I can load balance internet traffic to VMs.
---

# Quickstart: Create a public load balancer to load balance VMs using Terraform

This quickstart shows you how to deploy a standard load balancer to load balance virtual machines using Terraform.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create an Azure Virtual Network using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network)
> * Create an Azure subnet using [azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)
> * Create an Azure public IP using [azurerm_public_ip](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/public_ip)
> * Create an Azure Load Balancer using [azurerm_lb](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/lb)
> * Create an Azure network interface using [azurerm_network_interface](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface)
> * Create an Azure network interface load balancer backend address pool association using [azurerm_network_interface_backend_address_pool_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_interface_backend_address_pool_association)
> * Create an Azure Linux Virtual Machine using [azurerm_linux_virtual_machine](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine)
> * Create an Azure Virtual Machine Extension using [azurerm_virtual_machine_extension](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine_extension)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    ```
    terraform {
      required_version = ">=0.12"
   
      required_providers {
        azapi = {
          source  = "azure/azapi"
          version = "~>1.5"
        }
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~>2.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~>3.0"
        }
      }
    }
   
    provider "azurerm" {
      features {}
    }
    ```

1. Create a file named `main.tf` and insert the following code:

    ```
    resource "random_string" "my_resource_group" {
      length  = 8
      upper   = false
     special = false
    }

    # Create Resource Group
    resource "azurerm_resource_group" "my_resource_group" {
     name     = "test-group-${random_string.my_resource_group.result}"
     location = var.resource_group_location
    }
    
    # Create Virtual Network
    resource "azurerm_virtual_network" "my_virtual_network" {
      name                = var.virtual_network_name
      address_space       = ["10.0.0.0/16"]
      location            = azurerm_resource_group.my_resource_group.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
    }
    
    # Create a subnet in the Virtual Network
    resource "azurerm_subnet" "my_subnet" {
      name                 = var.subnet_name
      resource_group_name  = azurerm_resource_group.my_resource_group.name
      virtual_network_name = azurerm_virtual_network.my_virtual_network.name
      address_prefixes     = ["10.0.1.0/24"]
    }
    
    # Create Network Security Group and rules
    resource "azurerm_network_security_group" "my_nsg" {
      name                = var.network_security_group_name
      location            = azurerm_resource_group.my_resource_group.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
    
      security_rule {
        name                       = "web"
        priority                   = 1008
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_range     = "80"
        source_address_prefix      = "*"
        destination_address_prefix = "10.0.1.0/24"
      }
    }
    
    # Associate the Network Security Group to the subnet
    resource "azurerm_subnet_network_security_group_association" "my_nsg_association" {
      subnet_id                 = azurerm_subnet.my_subnet.id
      network_security_group_id = azurerm_network_security_group.my_nsg.id
    }
    
    # Create Public IP
    resource "azurerm_public_ip" "my_public_ip" {
      name                = var.public_ip_name
      location            = azurerm_resource_group.my_resource_group.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
      allocation_method   = "Static"
      sku                 = "Standard"
    }
    
    # Create Network Interface
    resource "azurerm_network_interface" "my_nic" {
      count               = 2
      name                = "${var.network_interface_name}${count.index}"
      location            = azurerm_resource_group.my_resource_group.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
    
      ip_configuration {
        name                          = "ipconfig${count.index}"
        subnet_id                     = azurerm_subnet.my_subnet.id
        private_ip_address_allocation = "Dynamic"
        primary = true
      }
    }
    
    # Associate Network Interface to the Backend Pool of the Load Balancer
    resource "azurerm_network_interface_backend_address_pool_association" "my_nic_lb_pool" {
      count                   = 2
      network_interface_id    = azurerm_network_interface.my_nic[count.index].id
      ip_configuration_name   = "ipconfig${count.index}"
      backend_address_pool_id = azurerm_lb_backend_address_pool.my_lb_pool.id
    }
    
    # Create Virtual Machine
    resource "azurerm_linux_virtual_machine" "my_vm" {
      count                 = 2
      name                  = "${var.virtual_machine_name}${count.index}"
      location              = azurerm_resource_group.my_resource_group.location
      resource_group_name   = azurerm_resource_group.my_resource_group.name
      network_interface_ids = [azurerm_network_interface.my_nic[count.index].id]
      size                  = var.virtual_machine_size
    
      os_disk {
        name                 = "${var.disk_name}${count.index}"
        caching              = "ReadWrite"
        storage_account_type = var.redundancy_type
      }
    
      source_image_reference {
        publisher = "Canonical"
        offer     = "0001-com-ubuntu-server-jammy"
        sku       = "22_04-lts-gen2"
        version   = "latest"
      }
    
      admin_username                  = var.username
      admin_password                  = var.password
      disable_password_authentication = false
    
    }
    
    # Enable virtual machine extension and install Nginx
    resource "azurerm_virtual_machine_extension" "my_vm_extension" {
      count                = 2
      name                 = "Nginx"
      virtual_machine_id   = azurerm_linux_virtual_machine.my_vm[count.index].id
      publisher            = "Microsoft.Azure.Extensions"
      type                 = "CustomScript"
      type_handler_version = "2.0"
    
      settings = <<SETTINGS
     {
      "commandToExecute": "sudo apt-get update && sudo apt-get install nginx -y && echo \"Hello World from $(hostname)\" > /var/www/html/index.html && sudo systemctl restart nginx"
     }
    SETTINGS
    
    }
    
    # Create Public Load Balancer
    resource "azurerm_lb" "my_lb" {
      name                = var.load_balancer_name
      location            = azurerm_resource_group.my_resource_group.location
      resource_group_name = azurerm_resource_group.my_resource_group.name
      sku                 = "Standard"
    
      frontend_ip_configuration {
        name                 = var.public_ip_name
        public_ip_address_id = azurerm_public_ip.my_public_ip.id
      }
    }
    
    resource "azurerm_lb_backend_address_pool" "my_lb_pool" {
      loadbalancer_id      = azurerm_lb.my_lb.id
      name                 = "test-pool"
    }
    
    resource "azurerm_lb_probe" "my_lb_probe" {
      resource_group_name = azurerm_resource_group.my_resource_group.name
      loadbalancer_id     = azurerm_lb.my_lb.id
      name                = "test-probe"
      port                = 80
    }
    
    resource "azurerm_lb_rule" "my_lb_rule" {
      resource_group_name            = azurerm_resource_group.my_resource_group.name
      loadbalancer_id                = azurerm_lb.my_lb.id
      name                           = "test-rule"
      protocol                       = "Tcp"
      frontend_port                  = 80
      backend_port                   = 80
      disable_outbound_snat          = true
      frontend_ip_configuration_name = var.public_ip_name
      probe_id                       = azurerm_lb_probe.my_lb_probe.id
      backend_address_pool_ids       = [azurerm_lb_backend_address_pool.my_lb_pool.id]
    }
    
    resource "azurerm_lb_outbound_rule" "my_lboutbound_rule" {
      resource_group_name     = azurerm_resource_group.my_resource_group.name
      name                    = "test-outbound"
      loadbalancer_id         = azurerm_lb.my_lb.id
      protocol                = "Tcp"
      backend_address_pool_id = azurerm_lb_backend_address_pool.my_lb_pool.id
    
      frontend_ip_configuration {
        name = var.public_ip_name
      }
    }
    ```

1. Create a file named `variables.tf` and insert the following code:

    ```
    variable "resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }
    
    variable "username" {
      type        = string
      default     = "microsoft"
      description = "The username for the local account that will be created on the new VM."
    }
    
    variable "password" {
      type        = string
      default     = "Microsoft@123"
      description = "The passoword for the local account that will be created on the new VM."
    }
    
    variable "virtual_network_name" {
      type        = string
      default     = "test-vnet"
      description = "Name of the Virtual Network."
    }
    
    variable "subnet_name" {
      type        = string
      default     = "test-subnet"
      description = "Name of the subnet."
    }
    
    variable public_ip_name {
      type        = string
      default     = "test-public-ip"
      description = "Name of the Public IP."
    }
    
    variable network_security_group_name {
      type        = string
      default     = "test-nsg"
      description = "Name of the Network Security Group."
    }
    
    variable "network_interface_name" {
      type        = string
      default     = "test-nic"
      description = "Name of the Network Interface."  
    }
    
    variable "virtual_machine_name" {
      type        = string
      default     = "test-vm"
      description = "Name of the Virtual Machine."
    }
    
    variable "virtual_machine_size" {
      type        = string
      default     = "Standard_B2s"
      description = "Size or SKU of the Virtual Machine."
    }
    
    variable "disk_name" {
      type        = string
      default     = "test-disk"
      description = "Name of the OS disk of the Virtual Machine."
    }
    
    variable "redundancy_type" {
      type        = string
      default     = "Standard_LRS"
      description = "Storage redundancy type of the OS disk."
    }
    
    variable "load_balancer_name" {
      type        = string
      default     = "test-lb"
      description = "Name of the Load Balancer."
    }
    ```

1. Create a file named `outputs.tf` and insert the following code:

    ```
    output "public_ip_address" {
      value = "http://${azurerm_public_ip.my_public_ip.ip_address}"
    }
    ```

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. When you apply the execution plan, Terraform displays the frontend public IP address. If you've cleared the screen, you can retrieve that value with the following Terraform command:

    ```console
    echo $(terraform output -raw public_ip_address)
    ```

1. Paste the public IP address into the address bar of your web browser. The custom VM page of the Nginx web server is displayed in the browser.

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you:

* Created an Azure Load Balancer
* Attached 2 VMs to the load balancer
* Tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
