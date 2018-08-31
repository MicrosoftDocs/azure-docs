---
title: Create a VM cluster with Terraform and HCL
description: Use Terraform and HashiCorp Configuration Language (HCL) to create a Linux virtual machine cluster with a load balancer in Azure
services: terraform
ms.service: terraform
keywords: terraform, devops, virtual machine, network, modules
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 11/13/2017
---

# Create a VM cluster with Terraform and HCL

This tutorial demonstrates creating a small compute cluster using the [HashiCorp Configuration Language](https://www.terraform.io/docs/configuration/syntax.html) (HCL). The configuration creates a load balancer, two Linux VMs in an [availability set](/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy), and all necessary networking resources.

In this tutorial, you:

> [!div class="checklist"]
> * Set up Azure authentication
> * Create a Terraform configuration file
> * Initialize Terraform
> * Create a Terraform execution plan
> * Apply the Terraform execution plan

## 1. Set up Azure authentication

> [!NOTE]
> If you [use Terraform environment variables](/azure/virtual-machines/linux/terraform-install-configure#set-environment-variables), or run this tutorial in the [Azure Cloud Shell](terraform-cloud-shell.md), skip this section.

In this section, you generate an Azure service principal, and two Terraform configuration files containing the credentials from the security principal.

1. [Set up an Azure AD service principal](/azure/virtual-machines/linux/terraform-install-configure#set-up-terraform-access-to-azure) to enable Terraform to provision resources into Azure. While creating the principal, Make note of the values for the subscription ID, tenant, appId, and password.

2. Open a command prompt.

3. Create an empty directory in which to store your Terraform files.

4. Create a new file that holds your variables declarations. You can name this file anything you like with a `.tf` extension.

5. Copy the following code into your variable declaration file:

  ```tf
  variable subscription_id {}
  variable tenant_id {}
  variable client_id {}
  variable client_secret {}
  
  provider "azurerm" {
      subscription_id = "${var.subscription_id}"
      tenant_id = "${var.tenant_id}"
      client_id = "${var.client_id}"
      client_secret = "${var.client_secret}"
  }
  ```

6. Create a new file that contains the values for your Terraform variables. It is common to name your Terraform variable file `terraform.tfvars` as Terraform automatically loads any file named `terraform.tfvars` (or following a pattern of `*.auto.tfvars`) if present in the current directory. 

7. Copy the following code into your variables file. Make sure to replace the placeholders as follows: For `subscription_id`, use the Azure subscription ID you specified when running `az account set`. For `tenant_id`, use the `tenant` value returned from `az ad sp create-for-rbac`. For `client_id`, use the `appId` value returned from `az ad sp create-for-rbac`. For `client_secret`, use the `password` value returned from `az ad sp create-for-rbac`.

  ```tf
  subscription_id = "<azure-subscription-id>"
  tenant_id = "<tenant-returned-from-creating-a-service-principal>"
  client_id = "<appId-returned-from-creating-a-service-principal>"
  client_secret = "<password-returned-from-creating-a-service-principal>"
  ```

## 2. Create a Terraform configuration file

In this section, you create a file that contains resource definitions for your infrastructure.

1. Create a new file named `main.tf`. 

2. Copy following sample resource definitions into the newly created `main.tf` file: 

  ```tf
  resource "azurerm_resource_group" "test" {
    name     = "acctestrg"
    location = "West US 2"
  }

  resource "azurerm_virtual_network" "test" {
    name                = "acctvn"
    address_space       = ["10.0.0.0/16"]
    location            = "${azurerm_resource_group.test.location}"
    resource_group_name = "${azurerm_resource_group.test.name}"
  }

  resource "azurerm_subnet" "test" {
    name                 = "acctsub"
    resource_group_name  = "${azurerm_resource_group.test.name}"
    virtual_network_name = "${azurerm_virtual_network.test.name}"
    address_prefix       = "10.0.2.0/24"
  }

  resource "azurerm_public_ip" "test" {
    name                         = "publicIPForLB"
    location                     = "${azurerm_resource_group.test.location}"
    resource_group_name          = "${azurerm_resource_group.test.name}"
    public_ip_address_allocation = "static"
  }

  resource "azurerm_lb" "test" {
    name                = "loadBalancer"
    location            = "${azurerm_resource_group.test.location}"
    resource_group_name = "${azurerm_resource_group.test.name}"

    frontend_ip_configuration {
      name                 = "publicIPAddress"
      public_ip_address_id = "${azurerm_public_ip.test.id}"
    }
  }

  resource "azurerm_lb_backend_address_pool" "test" {
    resource_group_name = "${azurerm_resource_group.test.name}"
    loadbalancer_id     = "${azurerm_lb.test.id}"
    name                = "BackEndAddressPool"
  }

  resource "azurerm_network_interface" "test" {
    count               = 2
    name                = "acctni${count.index}"
    location            = "${azurerm_resource_group.test.location}"
    resource_group_name = "${azurerm_resource_group.test.name}"

    ip_configuration {
      name                          = "testConfiguration"
      subnet_id                     = "${azurerm_subnet.test.id}"
      private_ip_address_allocation = "dynamic"
      load_balancer_backend_address_pools_ids = ["${azurerm_lb_backend_address_pool.test.id}"]
    }
  }

  resource "azurerm_managed_disk" "test" {
    count                = 2
    name                 = "datadisk_existing_${count.index}"
    location             = "${azurerm_resource_group.test.location}"
    resource_group_name  = "${azurerm_resource_group.test.name}"
    storage_account_type = "Standard_LRS"
    create_option        = "Empty"
    disk_size_gb         = "1023"
  }

  resource "azurerm_availability_set" "avset" {
    name                         = "avset"
    location                     = "${azurerm_resource_group.test.location}"
    resource_group_name          = "${azurerm_resource_group.test.name}"
    platform_fault_domain_count  = 2
    platform_update_domain_count = 2
    managed                      = true
  }

  resource "azurerm_virtual_machine" "test" {
    count                 = 2
    name                  = "acctvm${count.index}"
    location              = "${azurerm_resource_group.test.location}"
    availability_set_id   = "${azurerm_availability_set.avset.id}"
    resource_group_name   = "${azurerm_resource_group.test.name}"
    network_interface_ids = ["${element(azurerm_network_interface.test.*.id, count.index)}"]
    vm_size               = "Standard_DS1_v2"

    # Uncomment this line to delete the OS disk automatically when deleting the VM
    # delete_os_disk_on_termination = true

    # Uncomment this line to delete the data disks automatically when deleting the VM
    # delete_data_disks_on_termination = true

    storage_image_reference {
      publisher = "Canonical"
      offer     = "UbuntuServer"
      sku       = "16.04-LTS"
      version   = "latest"
    }

    storage_os_disk {
      name              = "myosdisk${count.index}"
      caching           = "ReadWrite"
      create_option     = "FromImage"
      managed_disk_type = "Standard_LRS"
    }

    # Optional data disks
    storage_data_disk {
      name              = "datadisk_new_${count.index}"
      managed_disk_type = "Standard_LRS"
      create_option     = "Empty"
      lun               = 0
      disk_size_gb      = "1023"
    }

    storage_data_disk {
      name            = "${element(azurerm_managed_disk.test.*.name, count.index)}"
      managed_disk_id = "${element(azurerm_managed_disk.test.*.id, count.index)}"
      create_option   = "Attach"
      lun             = 1
      disk_size_gb    = "${element(azurerm_managed_disk.test.*.disk_size_gb, count.index)}"
    }

    os_profile {
      computer_name  = "hostname"
      admin_username = "testadmin"
      admin_password = "Password1234!"
    }

    os_profile_linux_config {
      disable_password_authentication = false
    }

    tags {
      environment = "staging"
    }
  }
  ```

## 3. Initialize Terraform 

The [terraform init command](https://www.terraform.io/docs/commands/init.html) is used to initialize a directory that contains the Terraform configuration files - the files you created with the previous sections. It is a good practice to always run the `terraform init` command after writing a new Terraform configuration. 

> [!TIP]
> The `terraform init` command is idempotent meaning that it can be called repeatedly while producing the same result. Therefore, if you're working in a collaborative environment, and you think the configuration files might have been changed, it's always a good idea to call the `terraform init` command before executing or applying a plan.

To initialize Terraform, run the following command:

  ```cmd
  terraform init
  ```

  ![Initializing Terraform](media/terraform-create-vm-cluster-with-infrastructure/terraform-init.png)

## 4. Create a Terraform execution plan

The [terraform plan command](https://www.terraform.io/docs/commands/plan.html) is used to create an execution plan. To generate an execution plan, Terraform aggregates all the `.tf` files in the current directory. 

If you are working in a collaborative environment where the configuration might change between the time you create the execution plan and the time you apply the execution plan, you should use the [terraform plan command's -out parameter](https://www.terraform.io/docs/commands/plan.html#out-path) to save the execution plan to a file. Otherwise, if you are working in a single-person environment, you can omit the `-out` parameter.

If the name of your Terraform variables file is not `terraform.tfvars` and it doesn't follow the `*.auto.tfvars` pattern, you need to specify the file name using the [terraform plan command's -var-file parameter](https://www.terraform.io/docs/commands/plan.html#var-file-foo) when running the `terraform plan` command.

When processing the `terraform plan` command, Terraform performs a refresh and determines what actions are necessary to achieve the desired state specified in your configuration files.

If you do not need to save your execution plan, run the following command:

  ```cmd
  terraform plan
  ```

If you need to save your execution plan, run the following command (replacing the &lt;path> placeholder with the desired output path):

  ```cmd
  terraform plan -out=<path>
  ```

![Creating a Terraform execution plan](media/terraform-create-vm-cluster-with-infrastructure/terraform-plan.png)

## 5. Apply the Terraform execution plan

The final step of this tutorial is to use the [terraform apply command](https://www.terraform.io/docs/commands/apply.html) to apply the set of actions generated by the `terraform plan` command.

If you want to apply the latest execution plan, run the following command:

  ```cmd
  terraform apply
  ```

If you want to apply a previously saved execution plan, run the following command (replacing the &lt;path> placeholder with the path that contains the saved execution plan):

  ```cmd
  terraform apply <path>
  ```

![Applying a Terraform execution plan](media/terraform-create-vm-cluster-with-infrastructure/terraform-apply.png)

## Next steps

- Browse the list of [Azure Terraform modules](https://registry.terraform.io/modules/Azure)
- Create a [virtual machine scale set with Terraform](terraform-create-vm-scaleset-network-disks-hcl.md)