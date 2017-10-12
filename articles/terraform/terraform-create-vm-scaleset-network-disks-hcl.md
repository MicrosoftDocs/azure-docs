---
title: Use Terraform to plan and create a networked Azure VM scale set with managed disks using the HCL.
description: Use Terraform to configure and version an Azure virtual machine scale set complete with a virtual network and managed attached disks.
keywords: terraform, devops, scale set, virtual machine, network, storage, modules
author: dcaro
ms.author: dcaro
ms.date: 10/04/2017
ms.topic: article
---

# Use Terraform to plan and create a networked Azure VM scale set with managed storage

In this article, you will use [Terraform](https://www.terraform.io/) to create and deploy an [Azure VM scaleset](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-overview) with managed disks using the [Hashicorp Configuration Language](https://www.terraform.io/docs/configuration/syntax.html) (HCL).  

In this tutorial, you will:

> [!div class="checklist"]
> * Set up your Terraform deployment
> * Use variables and outputs for Terraform deployment 
> * Create and deploy network infrastructure
> * Create and deploy a VM scaleset and attach it to the network
> * Create and deploy a Jumpbox 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

- [Install Terraform and configure access to Azure](/azure/virtual-machines/linux/terraform-install-configure)
- Login to Azure with az clid ( you can use  Terraform with Service principal to login)

We recommend using a Service Principal when running in a Shared Environment (such as within a CI server/automation) - and authenticating via the Azure CLI when you're running Terraform locally.


## Step 1 - Create a private/public RSA key 

We will need a private and public key pair for SSH access.  
If you don't have a key pair, create an RSA ssh key if you don't have one and put it in ~/.ssh folder (mac)

## Step 2 - Create the file structure

With Terraform, it is a good practice to separate the variables from the logic of the application. 

Create 3 new files in your directory with the following names:
- variables.tf
  This file will hold the definition of the variables that our template will use.
- output.tf
  This file will describe the settings that will be displayed after the deployment happens.
- vmss.tf
  This file has the code of the infrastructure that we are deploying.

## Step 3 - Create the variables 

In this step you will define the variables used by the Terraform template. We will use the location and the name of the resource group at several occasions in the rest of this tutorial. 

Edit the ```variables.tf``` file and copy the following content.

```hcl 

variable "location" {
  description = "The location where resources will be created"
  default     = "West US"
}

variable "resource_group_name" {
  description = "The name of the resource group in which the resources will be created"
  default     = ""
}

```

**Note:** The default value of the resource_group_name variable is unset, define your own value.

Save the file.

When we deploy our Terraform template, we want to get the FQDN that will be used to access the application. We will use the ```output``` resource type of Terraform and get the ```fqdn``` property of this resource. 

Edit the ```output.tf``` file and copy the following content

```hcl 
output "vmss_public_ip" {
    value = "${azurerm_public_ip.vmss.fqdn}"
}
```

## Step 3 - Create the network infrastructure. 

In this step we'll create the following network infrastructure: 
  - One VNET with the address space of 10.0.0.0/16 
  - One subnet with the addess space of 10.0.2.0/24
  - Two public IP addresses. One will be used by the VM scale set for the publication of the application, the other one will be used to connect to the jumpbox.

We also need a resource group where all the resources will be created. 

Edit and copy the following code in the ```vmss.tf``` file: 

```hcl 

resource "azurerm_resource_group" "vmss" {
  name     = "${var.resource_group_name}"
  location = "${var.location}"

  tags {
    environment = "codelab"
  }
}

resource "azurerm_virtual_network" "vmss" {
  name                = "vmss-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = "${var.location}"
  resource_group_name = "${azurerm_resource_group.vmss.name}"

  tags {
    environment = "codelab"
  }
}

resource "azurerm_subnet" "vmss" {
  name                 = "vmss-subnet"
  resource_group_name  = "${azurerm_resource_group.vmss.name}"
  virtual_network_name = "${azurerm_virtual_network.vmss.name}"
  address_prefix       = "10.0.2.0/24"
}

resource "azurerm_public_ip" "vmss" {
  name                         = "vmss-public-ip"
  location                     = "${var.location}"
  resource_group_name          = "${azurerm_resource_group.vmss.name}"
  public_ip_address_allocation = "static"
  domain_name_label            = "${azurerm_resource_group.vmss.name}"

  tags {
    environment = "codelab"
  }
}

``` 
**Note:** It is a good idea to tag the resources being deployed in Azure to facilitate their identification in the future.

## Step 4 - Deploy the network in Azure 

First, we need to initialize the terraform environment by running the following command: 

```bash
terraform init 
```
 
The provider plugins will be downloaded from the Terraform registry in the ```.terraform``` folder in the directory where you ran the command.

Then run the following command to deploy the infrastructure in Azure.

```bash
terraform apply
```

Verify that the FQDN of the public IP address corresponds to your configuration:
![VMSS terraform FQDN for Public IP address](./media/tf-create-vmss-step4-fqdn.png)


The resource group should have the following resources: 
![VMSS terraform network resources](./media/tf-create-vmss-step4-rg.png)


## Step 5 - Edit the infrastructure to add the VM scaleset

In this step we will create the following resources on the network that was previously deployed:
- Azure loadbalancer to serve the application and attach it to the public IP address that was deployed in step 4
- Azure backend addess pool and assign it to the loadbalancer 
- A probe on the port that is used by the application and assign it to the loadbalancer 
- A loadbalancer rule and and attach it to the loadbalancer 
- A VM Scaleset that will use the loadbalancer and the vnet deployed earlier

Edit the ```vmss.tf``` file and append at the end of it the following code. 

```hcl


resource "azurerm_lb" "vmss" {
  name                = "vmss-lb"
  location            = "${var.location}"
  resource_group_name = "${azurerm_resource_group.vmss.name}"

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = "${azurerm_public_ip.vmss.id}"
  }

  tags {
    environment = "codelab"
  }
}

resource "azurerm_lb_backend_address_pool" "bpepool" {
  resource_group_name = "${azurerm_resource_group.vmss.name}"
  loadbalancer_id     = "${azurerm_lb.vmss.id}"
  name                = "BackEndAddressPool"
}

resource "azurerm_lb_probe" "vmss" {
  resource_group_name = "${azurerm_resource_group.vmss.name}"
  loadbalancer_id     = "${azurerm_lb.vmss.id}"
  name                = "ssh-running-probe"
  port                = "${var.application_port}"
}

resource "azurerm_lb_rule" "lbnatrule" {
    resource_group_name            = "${azurerm_resource_group.vmss.name}"
    loadbalancer_id                = "${azurerm_lb.vmss.id}"
    name                           = "http"
    protocol                       = "Tcp"
    frontend_port                  = "${var.application_port}"
    backend_port                   = "${var.application_port}"
    backend_address_pool_id        = "${azurerm_lb_backend_address_pool.bpepool.id}"
    frontend_ip_configuration_name = "PublicIPAddress"
    probe_id                       = "${azurerm_lb_probe.vmss.id}"
}

resource "azurerm_virtual_machine_scale_set" "vmss" {
  name                = "vmscaleset"
  location            = "${var.location}"
  resource_group_name = "${azurerm_resource_group.vmss.name}"
  upgrade_policy_mode = "Manual"

  sku {
    name     = "Standard_DS1_v2"
    tier     = "Standard"
    capacity = 2
  }

  storage_profile_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }

  storage_profile_os_disk {
    name              = ""
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  storage_profile_data_disk {
    lun          = 0
    caching        = "ReadWrite"
    create_option  = "Empty"
    disk_size_gb   = 10
  }

  os_profile {
    computer_name_prefix = "vmlab"
    admin_username       = "azureuser"
    admin_password       = "Passwword1234"
  }

  os_profile_linux_config {
    disable_password_authentication = true

    ssh_keys {
      path     = "/home/azureuser/.ssh/authorized_keys"
      key_data = "${file("~/.ssh/id_rsa.pub")}"
    }
  }

  network_profile {
    name    = "terraformnetworkprofile"
    primary = true

    ip_configuration {
      name                                   = "IPConfiguration"
      subnet_id                              = "${azurerm_subnet.vmss.id}"
      load_balancer_backend_address_pool_ids = ["${azurerm_lb_backend_address_pool.bpepool.id}"]
    }
  }

  extension { 
    name = "vmssextension"
    publisher = "Microsoft.OSTCExtensions"
    type = "CustomScriptForLinux"
    type_handler_version = "1.2"
    settings = <<SETTINGS
    {
        "commandToExecute": "sudo apt-get -y install nginx"
    }
    SETTINGS
  }

  tags {
    environment = "codelab"
  }
}

```

**Note:** for the purpose of this codelab, in the extension of the VMSS resource we run a simple command that installs nginx, you can also run your own script.


Edit the ```variables.tf``` file and add the following code. 

```hcl 
variable "application_port" {
    description = "The port that you want to expose to the external load balancer"
    default     = 80
}

variable "admin_password" {
    description = "Default password for admin"
    default = "Passwwoord11223344"
}
``` 


## Step 6 - Deploy the VM scaleset in Azure

We will now deploy the VM scaleset in Azure.
Run the following command: 

```bash
terraform plan
```

The output of the command should look like the following.
![Terraform add vmss plan](./media/tf-create-vmss-step6.png)

Then run the following command to deploy the additional resources in Azure: 

```bash
terraform apply 
```

The content of the resource group should look like this:
![Terraform vm scaleset resource group](./media/tf-create-create-vmss-step6-apply.png)

Open a browser and connect to the FQDN that was returned by the command. 



## Step 7 - Add a Jumpbox to the existing network 

This optional step will enable ssh access to the instances of the VM scale set by using a jumpbox.
You will add the following resources to your existing deployment:
- A network interface connected to the same subnet than the VM scaleset
- A virtual machine with this network interface

Edit the ```vmss.tf``` file and add the following code: 

```hcl 
resource "azurerm_public_ip" "jumpbox" {
  name                         = "jumpbox-public-ip"
  location                     = "${var.location}"
  resource_group_name          = "${azurerm_resource_group.vmss.name}"
  public_ip_address_allocation = "static"
  domain_name_label            = "${azurerm_resource_group.vmss.name}-ssh"

  tags {
    environment = "codelab"
  }
}

resource "azurerm_network_interface" "jumpbox" {
  name                = "jumpbox-nic"
  location            = "${var.location}"
  resource_group_name = "${azurerm_resource_group.vmss.name}"

  ip_configuration {
    name                          = "IPConfiguration"
    subnet_id                     = "${azurerm_subnet.vmss.id}"
    private_ip_address_allocation = "dynamic"
    public_ip_address_id          = "${azurerm_public_ip.jumpbox.id}"
  }

  tags {
    environment = "codelab"
  }
}

resource "azurerm_virtual_machine" "jumpbox" {
  name                  = "jumpbox"
  location              = "${var.location}"
  resource_group_name   = "${azurerm_resource_group.vmss.name}"
  network_interface_ids = ["${azurerm_network_interface.jumpbox.id}"]
  vm_size               = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }

  storage_os_disk {
    name              = "jumpbox-osdisk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }

  os_profile {
    computer_name  = "jumpbox"
    admin_username = "azureuser"
    admin_password = "Password1234!"
  }

  os_profile_linux_config {
    disable_password_authentication = true

    ssh_keys {
      path     = "/home/azureuser/.ssh/authorized_keys"
      key_data = "${file("~/.ssh/id_rsa.pub")}"
    }
  }

  tags {
    environment = "codelab"
  }
}
```

We also want to get the FQDN of the jumpbox that will be deployed. Edit the ```outputs.tf``` file and add the following code: 

```
output "jumpbox_public_ip" {
    value = "${azurerm_public_ip.jumpbox.fqdn}"
}
```

## Step 8 - Deploy the jumpbox

Run the following command: 

```bash
terraform apply 
```

Once the deployment has completed, the content of the resource group should look like this:
![Terraform vm scaleset resource group](./media/tf-create-create-vmss-step8.png)



## Next Steps

In this tutorial, you deployed a VM scaleset and a Jumpbox on Azure using terraform. You learned how to:

(Repeat the checklist from the top:)

> [!div class="checklist"]
> * Initialise Terraform deployment
> * Use variables and outputs for Terraform deployment 
> * Create and deploy a network infrastructure
> * Create and deploy a vm scaleset and attach it to an existing environment
> * Create and deploy a jumpbox  
> * 
> * 