---
title: Create a VM cluster with Terraform and HCL
description: Use Terraform and HashiCorp Configuration Language (HCL) to create a Linux virtual machine cluster with a load balancer in Azure
keywords: terraform, devops, virtual machine, network, modules
author: tomarcher
manager: routlaw
ms.service: virtual-machines-linux
ms.custom: devops
ms.topic: article
ms.date: 11/08/2017
ms.author: tarcher
---

# Create a VM cluster with Terraform and HCL

This tutorial demonstrates creating a small compute cluster using the [HashiCorp Configuration Language](https://www.terraform.io/docs/configuration/syntax.html) (HCL). The configuration creates a load balancer, two Linux VMs in an [availability set](/azure/virtual-machines/windows/manage-availability#configure-multiple-virtual-machines-in-an-availability-set-for-redundancy), and all necessary networking resources.

In this tutorial you will:

> [!div class="checklist"]
> * Set up Azure authentication
> * Create the Terraform template
> * Visualize the changes with plan
> * Apply the configuration to create the cluster

## 1. Set up Azure authentication

> [!NOTE]
> If you [use Terraform environment variables](/azure/virtual-machines/linux/terraform-install-configure#set-environment-variables), or run this tutorial in the [Azure Cloud Shell](terraform-cloud-shell.md), skip this step.

In this section, you will generate an Azure service principal, and a Terraform variables file containing the credentials from the security principal.

1. [Set up an Azure AD service principal](/azure/virtual-machines/linux/terraform-install-configure#set-up-terraform-access-to-azure) to enable Terraform to provision resources into Azure. While creating the principal, Make note of the values for the subscription ID, tenant ID, displayName, and password.

2. Open a command prompt.

3. Create an empty directory in which you are going to store your Terraform files.

4. Create a new file to define your Terraform variables. It is common to name your Terraform variable file `terraform.tfvars` as Terraform will automatically load any file named `terraform.tfvars` (or following a patern of `*.auto.tfvars`) if present in the current directory. 

5. Copy the following code into your newly created Terraform variables file. Make sure to replace the placeholders as follows: For `subscription_id`, use the Azure subscription ID you specified when running `az account set`. For `tenant_id`, use the `tenant` value returned from `az ad sp create-for-rbac`. For `client_id`, use the `appId` value returned from `az ad sp create-for-rbac`. For `client_secret`, use the `password` value returned from `az ad sp create-for-rbac`.

  ```tf
  subscription_id = "<azure-subscription-id>"
  tenant_id = "<tenant-returned-from-creating-a-service-principal>"
  client_id = "<appId-returned-from-creating-a-service-principal>"
  client_secret = "<password-returned-from-creating-a-service-principal>"
  ```

## 2. Create the Terraform template file

In this section, you will create a file that contains resource definitions for your infrastructure.

1. In the same directory where you created the Terraform variables file, create a new file named `main.tf`. 

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

The [terraform init](https://www.terraform.io/docs/commands/init.html) command is used to initialize a directory that contains the Terraform configuration files - the files you created with the previous steps. You should always run the `terraform init` command after writing a new Terraform configuration. 

> [!TIP]
> The `terraform init` command is idempotent meaning that it can be called repeatedly while producing the same result. Therefore, if you're working in a collaborative environment, and you think the confiruation files might have been changed, it's always a good idea to call the `terraform init` command before executing or applying a plan.

To initialize Terraform, run the following command:

  ```cmd
  terraform init
  ```

  ![Initializing Terraform](media/terraform-create-vm-cluster-with-infrastructure/terraform-plan-vms-with-modules.png)

## 4. Create a Terraform execution plan

The [terraform plan](https://www.terraform.io/docs/commands/plan.html) command is used to create an execution plan. To generate the execution plan, Terraform aggregates all of the `.tf` files in the current directory. 

If you are working in a collaborative environment where the configuration might change, you should use the `-out` parameter and output the execution plan to a file. Otherwise, if you are working in a single-person environment, you can ommit the `-out` parameter. For purposes of this tutorial, we'll assume a single-person environment. To see the syntax for using the `-out` parameter, refer to the [Terraform documentation for the `-out` parameter](https://www.terraform.io/docs/commands/plan.html#out-path).

If the name of your Terraform variables file is not `terraform.tfvars` and it doesn't follow the `*.auto.tfvars` pattern, you will need to specify the file name using the [terraform plan -var-file parameter](https://www.terraform.io/docs/commands/plan.html#var-file-foo) when running the `terraform plan` command.

When processing the `terraform plan` command, Terraform performs a refresh and determines what actions are necessary to achieve the desired state specified in your configuration files.

Run the following command to create the Terraform execution plan from your configuration files:

```cmd
terraform plan
```

![Creating a Terraform plan](media/terraform-create-vm-cluster-with-infrastructure/terraform-plan-vms-with-modules.png)

## 5. Create the virtual machines with apply

Run `terraform apply` to provision the VM cluster on Azure.

![Applying a Terraform execution plan](media/terraform-create-vm-cluster-with-infrastructure/terraform-apply-vms-with-modules.png)

## Next steps

- Browse the list of [Azure Terraform modules](https://registry.terraform.io/modules/Azure)
- Create a [virtual machine scale set with Terraform](terraform-create-vm-scaleset-network-disks-hcl.md)