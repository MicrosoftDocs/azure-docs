---
title: Use Marketplace image to create Terraform Linux Virtual Machine with Managed Service Identity
description: Use Marketplace image to create Terraform Linux Virtual Machine with Managed Service Identity and Remote State manangement to easily deploy resources to Azure.
keywords: terraform, devops, MSI, virtual machine, remote state, azure
author: VaijanathB
ms.author: tarcher
ms.date: 10/29/2017
ms.topic: article
---

This article shows you how to use a [Terraform Marketplace image](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azure-oss.terraform?tab=Overview) to create a `Ubuntu Linux VM (16.04 LTS)` with latest `Terraform` version installed and configured using [Managed Service Identity (MSI)](https://docs.microsoft.com/en-us/azure/active-directory/managed-service-identity/overview). This image also configures a remote backend to enable [Remote State](https://www.terraform.io/docs/state/remote.html) management using Terraform. The Terraform Marketplace image makes it easy to get started using Terraform on Azure in minutes, without having to install and configure Terraform and configure authentication manually. 

There are no software charges for this data science VM image. You pay only the Azure hardware usage fees that are assessed based on the size of the virtual machine that you provision with the VM image. More details on the compute fees can be found on the [Linux Virtual Machines Pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/linux/).

### Prerequisites
Before you can create a Linux Terraform Virtual Machine, you must have an Azure subscription. If you do not already have one, see [Create your free Azure account today](https://azure.microsoft.com/free/).  

### Create your Terraform Virtual Machine 

Here are the steps to create an instance of Linux Terraform Virtual Machine. 

1. Navigate to [Create a Resource](https://ms.portal.azure.com/#create/hub) listing on the Azure portal.
2. Search for `Terraform` in the `Search the Marketplace` search bar. Select the `Terraform` template. Select the **Create** button in the Terraform details blade.
![alt text](media\terraformmsi.png)
3. The following sections provide inputs for each of the steps in the wizard (enumerated on the the right) used to create the Terraform Linux Virtual Machine.  Here are the inputs needed to configure each of these steps

### Details in Create Terraform Blade

a. **Basics**
    
* **Name**: Name of your Terraform Virtual Machine
* **User Name**: First account sign-in ID
* **Password**: First account password (you can use SSH public key instead of password).
* **Subscription**:If you have more than one subscription, select the one on which the machine is to be created and billed. You must have resource creation privileges for this subscription.
* **Resource group**: You can create a new one or use an existing group.
* **Location**: Select the data center that is most appropriate. Usually it is the data center that has most of your data, or is closest to your physical location for fastest network access.

b. **Additional Settings**

* Size: Size of the Virtual Machine.
* VM disk type: Choose between SSD and HDD

c. **Summary Terraform**

* Verify that all information you entered is correct. 

d. **Buy**

* To start the provisioning, click Buy. A link is provided to the terms of the transaction. The VM does not have any additional charges beyond the compute for the server size you chose in the Size step.

### Template Deployment Steps:
* Creates a VM with system assigned identity based on the Ubuntu 16.04 LTS image
* Installs the MSI extension on the VM to allow OAuth tokens to be issued for Azure resources
* Assign RBAC permissions to the Managed Identity, granting owner rights for the resource group
* Creates a Terraform template folder (tfTemplate)
* Pre-configures Terraform remote state with the Azure backend

### How to access and configure Linux Terraform Data Science Virtual Machine

After the VM is created, you can sign in to it by using SSH. Use the account credentials that you created in the Basics section of step 3 for the text shell interface. On Windows, you can download an SSH client tool like [Putty](http://www.putty.org/)

Once you have used `SSH` to connect to the Virtual Machine, you need to enable the Managed Service Identity on the Virtual Machine to have contributor permission to the entire subscription to use Terraform to create resources outside the VM resource group. We have made this easy by creating a script that you need to execute once. Here is the command to do it 

. ~/tfEnv.sh

This script uses [AZ CLI v 2.0 Interactive log-in](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest#interactive-log-in) mechanism to authenticate with Azure and assign the Virtual Machine Managed Service Identity contributor permission on the entire subscription. 

 This VM has Terraform Remote State enabled and to enable this on your Terraform deployment, you need to copy remoteState.tf file from tfTemplate directory to the root of the Terraform scripts to enable remote state management. 

 `cp  ~/tfTemplate/remoteState.tf .`

 You can read more about Remote State Management [here](https://www.terraform.io/docs/state/remote.html). Please note that the storage access key is exposed in this file and needs to be carefully checked into source control.  

 ### Learn more

 [Terraform Hub in Microsoft.com](https://docs.microsoft.com/en-us/azure/terraform/) 

 [Terraform Azure Provider Documentation](http://aka.ms/terraform)

 [Terraform Azure Provider Source](http://aka.ms/tfgit)

 [Terraform Azure Modules](http://aka.ms/tfmodules)
 

















