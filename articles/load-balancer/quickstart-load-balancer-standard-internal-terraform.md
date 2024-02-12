---
title: "Quickstart: Create an internal load balancer - Terraform"
titleSuffix: Azure Load Balancer
description: This quickstart shows how to create an internal load balancer by using Terraform.
services: load-balancer
author: hisriram96
manager: vikasbagde
ms.service: load-balancer
ms.topic: quickstart
ms.date: 01/02/2024
ms.author: sriramiyer
ms.custom: devx-track-terraform
#Customer intent: I want to create an internal load balancer by using Terraform so that I can load balance internal traffic to VMs.
---

# Quickstart: Create an internal load balancer to load balance internal traffic to VMs using Terraform

This quickstart shows you how to deploy a standard internal load balancer and two virtual machines using Terraform. Additional resources include Azure Bastion, NAT Gateway, a virtual network, and the required subnets.

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
> * Create an Azure NAT Gateway using [azurerm_nat_gateway](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/nat_gateway)
> * Create an Azure Bastion using [azurerm_bastion_host](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/bastion_host)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

   ```
   terraform {
     required_version = ">=0.12"
   
     required_providers {
       azapi = {
         source = "azure/azapi"
         version = "~>1.5"
       }
       azurerm = {
         source = "hashicorp/azurerm"
         version = "~>2.0"
       }
       random = {
         source = "hashicorp/random"
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
     length  = 8
     upper   = false
    special = false
   }
   
   # Create Resource Group
   resource "azurerm_resource_group" "my_resource_group" {
    name     = "${var.public_ip_name}-${random_string.my_resource_group.result}"
    location = var.resource_group_location
   }
   
   # Create Virtual Network
   resource "azurerm_virtual_network" "my_virtual_network" {
     name = var.virtual_network_name
     address_space = ["10.0.0.0/16"]
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
   }
   
   # Create a subnet in the Virtual Network
   resource "azurerm_subnet" "my_subnet" {
     name = var.subnet_name
     resource_group_name = azurerm_resource_group.my_resource_group.name
     virtual_network_name = azurerm_virtual_network.my_virtual_network.name
     address_prefixes = ["10.0.1.0/24"]
   }
   
   # Create a subnet named as "AzureBastionSubnet" in the Virtual Network for creating Azure Bastion
   resource "azurerm_subnet" "my_bastion_subnet" {
     name = "AzureBastionSubnet"
     resource_group_name = azurerm_resource_group.my_resource_group.name
     virtual_network_name = azurerm_virtual_network.my_virtual_network.name
     address_prefixes = ["10.0.2.0/24"]
   }
   
   # Create Network Security Group and rules
   resource "azurerm_network_security_group" "my_nsg" {
     name = var.network_security_group_name
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
   
     security_rule {
       name = "ssh"
       priority = 1022
       direction = "Inbound"
       access = "Allow"
       protocol = "Tcp"
       source_port_range = "*"
       destination_port_range = "22"
       source_address_prefix = "*"
       destination_address_prefix = "10.0.1.0/24"
     }
   
     security_rule {
       name = "web"
       priority = 1080
       direction = "Inbound"
       access = "Allow"
       protocol = "Tcp"
       source_port_range = "*"
       destination_port_range = "80"
       source_address_prefix = "*"
       destination_address_prefix = "10.0.1.0/24"
     }
   }
   
   # Associate the Network Security Group to the subnet
   resource "azurerm_subnet_network_security_group_association" "my_nsg_association" {
     subnet_id = azurerm_subnet.my_subnet.id
     network_security_group_id = azurerm_network_security_group.my_nsg.id
   }
   
   # Create Public IPs
   resource "azurerm_public_ip" "my_public_ip" {
     count = 2
     name = "${var.public_ip_name}-${count.index}"
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
     allocation_method = "Static"
     sku = "Standard"
   }
   
   # Create a NAT Gateway for outbound internet access of the Virtual Machines in the Backend Pool of the Load Balancer
   resource "azurerm_nat_gateway" "my_nat_gateway" {
     name = var.nat_gateway
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
     sku_name = "Standard"
   }
   
   # Associate one of the Public IPs to the NAT Gateway
   resource "azurerm_nat_gateway_public_ip_association" "my_nat_gateway_ip_association" {
     nat_gateway_id = azurerm_nat_gateway.my_nat_gateway.id
     public_ip_address_id = azurerm_public_ip.my_public_ip[0].id
   }
   
   # Associate the NAT Gateway to subnet
   resource "azurerm_subnet_nat_gateway_association" "my_nat_gateway_subnet_association" {
     subnet_id = azurerm_subnet.my_subnet.id
     nat_gateway_id = azurerm_nat_gateway.my_nat_gateway.id
   }
   
   # Create Network Interfaces
   resource "azurerm_network_interface" "my_nic" {
     count = 3
     name = "${var.network_interface_name}-${count.index}"
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
   
     ip_configuration {
       name = "ipconfig-${count.index}"
       subnet_id = azurerm_subnet.my_subnet.id
       private_ip_address_allocation = "Dynamic"
       primary = true
     }
   }
   
   # Create Azure Bastion for accessing the Virtual Machines
   resource "azurerm_bastion_host" "my_bastion" {
     name = var.bastion_name
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
     sku = "Standard"
   
     ip_configuration {
       name = "ipconfig"
       subnet_id = azurerm_subnet.my_bastion_subnet.id
       public_ip_address_id = azurerm_public_ip.my_public_ip[1].id
     }
   }
   
   # Associate Network Interface to the Backend Pool of the Load Balancer
   resource "azurerm_network_interface_backend_address_pool_association" "my_nic_lb_pool" {
     count = 2
     network_interface_id = azurerm_network_interface.my_nic[count.index].id
     ip_configuration_name = "ipconfig-${count.index}"
     backend_address_pool_id = azurerm_lb_backend_address_pool.my_lb_pool.id
   }
   
   # Create Virtual Machine
   resource "azurerm_linux_virtual_machine" "my_vm" {
     count = 3
     name = "${var.virtual_machine_name}-${count.index}"
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
     network_interface_ids = [azurerm_network_interface.my_nic[count.index].id]
     size = var.virtual_machine_size
   
     os_disk {
       name = "${var.disk_name}-${count.index}"
       caching = "ReadWrite"
       storage_account_type = var.redundancy_type
     }
   
     source_image_reference {
       publisher = "Canonical"
       offer = "0001-com-ubuntu-server-jammy"
       sku = "22_04-lts-gen2"
       version = "latest"
     }
   
     admin_username = var.username
     admin_password = var.password
     disable_password_authentication = false
   
   }
   
   # Enable virtual machine extension and install Nginx
   resource "azurerm_virtual_machine_extension" "my_vm_extension" {
     count = 2
     name = "Nginx"
     virtual_machine_id = azurerm_linux_virtual_machine.my_vm[count.index].id
     publisher = "Microsoft.Azure.Extensions"
     type = "CustomScript"
     type_handler_version = "2.0"
   
     settings = <<SETTINGS
    {
     "commandToExecute": "sudo apt-get update && sudo apt-get install nginx -y && echo \"Hello World from $(hostname)\" > /var/www/html/index.html && sudo systemctl restart nginx"
    }
   SETTINGS
   
   }
   
   # Create an Internal Load Balancer
   resource "azurerm_lb" "my_lb" {
     name = var.load_balancer_name
     location = azurerm_resource_group.my_resource_group.location
     resource_group_name = azurerm_resource_group.my_resource_group.name
     sku = "Standard"
   
     frontend_ip_configuration {
       name = "frontend-ip"
       subnet_id = azurerm_subnet.my_subnet.id
       private_ip_address_allocation = "Dynamic"
     }
   }
   
   resource "azurerm_lb_backend_address_pool" "my_lb_pool" {
     loadbalancer_id = azurerm_lb.my_lb.id
     name = "test-pool"
   }
   
   resource "azurerm_lb_probe" "my_lb_probe" {
     resource_group_name = azurerm_resource_group.my_resource_group.name
     loadbalancer_id = azurerm_lb.my_lb.id
     name = "test-probe"
     port = 80
   }
   
   resource "azurerm_lb_rule" "my_lb_rule" {
     resource_group_name = azurerm_resource_group.my_resource_group.name
     loadbalancer_id = azurerm_lb.my_lb.id
     name = "test-rule"
     protocol = "Tcp"
     frontend_port = 80
     backend_port = 80
     disable_outbound_snat = true
     frontend_ip_configuration_name = "frontend-ip"
     probe_id = azurerm_lb_probe.my_lb_probe.id
     backend_address_pool_ids = [azurerm_lb_backend_address_pool.my_lb_pool.id]
   }
   ```

1. Create a file named `variables.tf` and insert the following code:

    ```
   variable "resource_group_location" {
     type = string
     default = "eastus"
     description = "Location of the resource group."
   }
   
   variable "resource_group_name" {
     type = string
     default = "test-group"
     description = "Name of the resource group."
   }
   
   variable "username" {
     type = string
     default = "microsoft"
     description = "The username for the local account that will be created on the new VM."
   }
   
   variable "password" {
     type = string
     default = "Microsoft@123"
     description = "The passoword for the local account that will be created on the new VM."
   }
   
   variable "virtual_network_name" {
     type = string
     default = "test-vnet"
     description = "Name of the Virtual Network."
   }
   
   variable "subnet_name" {
     type = string
     default = "test-subnet"
     description = "Name of the subnet."
   }
   
   variable public_ip_name {
     type = string
     default = "test-public-ip"
     description = "Name of the Public IP for the NAT Gateway."
   }
   
   variable "nat_gateway" {
     type = string
     default = "test-nat"
     description = "Name of the NAT gateway."
   }
   
   variable "bastion_name" {
     type = string
     default = "test-bastion"
     description = "Name of the Bastion."
   }
   
   variable network_security_group_name {
     type = string
     default = "test-nsg"
     description = "Name of the Network Security Group."
   }
   
   variable "network_interface_name" {
     type = string
     default = "test-nic"
     description = "Name of the Network Interface."  
   }
   
   variable "virtual_machine_name" {
     type = string
     default = "test-vm"
     description = "Name of the Virtual Machine."
   }
   
   variable "virtual_machine_size" {
     type = string
     default = "Standard_B2s"
     description = "Size or SKU of the Virtual Machine."
   }
   
   variable "disk_name" {
     type = string
     default = "test-disk"
     description = "Name of the OS disk of the Virtual Machine."
   }
   
   variable "redundancy_type" {
     type = string
     default = "Standard_LRS"
     description = "Storage redundancy type of the OS disk."
   }
   
   variable "load_balancer_name" {
     type = string
     default = "test-lb"
     description = "Name of the Load Balancer."
   }
    ```

1. Create a file named `outputs.tf` and insert the following code:

    ```
    output "private_ip_address" {
      value = "http://${azurerm_lb.my_lb.private_ip_address}"
    }
   ```

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. When you apply the execution plan, Terraform displays the frontend private IP address. If you've cleared the screen, you can retrieve that value with the following Terraform command:

    ```console
    echo $(terraform output -raw private_ip_address)
    ```

1. Login to the VM which is not associated to the backend pool of load balancer using Bastion.

1. Run the curl command to access the custom web page of the Nginx web server using the frontend private IP address of the load balancer.

   ```
   curl http://<Frontend IP address>
   ```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

In this quickstart, you:

- Created an internal Azure Load Balancer

- Attached 2 VMs to the load balancer

- Configured the load balancer traffic rule, health probe, and then tested the load balancer

To learn more about Azure Load Balancer, continue to:
> [!div class="nextstepaction"]
> [What is Azure Load Balancer?](load-balancer-overview.md)
