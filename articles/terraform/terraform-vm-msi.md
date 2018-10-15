---
title: Use an Azure Marketplace image to create a Terraform Linux virtual machine with a managed identity
description: Use Marketplace image to create Terraform Linux virtual machine with a managed identity and Remote State Management to easily deploy resources to Azure.
services: terraform
ms.service: terraform
keywords: terraform, devops, MSI, virtual machine, remote state, azure
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 3/12/2018
---

# Use an Azure Marketplace image to create a Terraform Linux virtual machine with managed identities for Azure resources

This article shows you how to use a [Terraform Marketplace image](https://azuremarketplace.microsoft.com/marketplace/apps/azure-oss.terraform?tab=Overview) to create an Ubuntu Linux VM (16.04 LTS) with the latest [Terraform](https://www.terraform.io/intro/index.html) version installed and configured using [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview). This image also configures a remote back end to enable [remote state](https://www.terraform.io/docs/state/remote.html) management using Terraform. 

The Terraform Marketplace image makes it easy to get started using Terraform on Azure, without having to install and configure Terraform manually. 

There are no software charges for this Terraform VM image. You pay only the Azure hardware usage fees that are assessed based on the size of the virtual machine that's provisioned. For more information about the compute fees, see the [Linux virtual machines pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

## Prerequisites
Before you can create a Linux Terraform virtual machine, you must have an Azure subscription. If you don't already have one, see [Create your free Azure account today](https://azure.microsoft.com/free/).  

## Create your Terraform virtual machine 

Here are the steps to create an instance of a Linux Terraform virtual machine: 

1. In the Azure portal, go to the [Create a Resource](https://ms.portal.azure.com/#create/hub) listing.

2. In the **Search the Marketplace** search bar, search for **Terraform**. Select the **Terraform** template. 

3. On the Terraform details tab on the lower right, select the **Create** button.

    ![Create a Terraform virtual machine](media\terraformmsi.png)

4. The following sections provide inputs for each of the steps in the wizard to create the Terraform Linux virtual machine. The following section lists the inputs that are needed to configure each of these steps.

## Details on the Create Terraform tab

Enter the following details on the **Create Terraform** tab:

1. **Basics**
    
   * **Name**: The name of your Terraform virtual machine.
   * **User Name**: The first account sign-in ID.
   * **Password**: The first account password. (You can use an SSH public key instead of a password.)
   * **Subscription**: The subscription on which the machine is to be created and billed. You must have resource creation privileges for this subscription.
   * **Resource group**: A new or existing resource group.
   * **Location**: The datacenter that is most appropriate. Usually it's the datacenter that has most of your data, or the one that's closest to your physical location for fastest network access.

2. **Additional settings**

   * **Size**: Size of the virtual machine. 
   * **VM disk type**: SSD or HDD.

3. **Summary Terraform**

   * Verify that all information that you entered is correct. 

4. **Buy**

   * To start the provisioning process, select **Buy**. A link is provided to the terms of the transaction. The VM does not have any additional charges beyond the compute for the server size that you chose in the size step.

The Terraform VM image performs the following steps:

* Creates a VM with system-assigned identity that's based on the Ubuntu 16.04 LTS image.
* Installs the MSI extension on the VM to allow OAuth tokens to be issued for Azure resources.
* Assigns RBAC permissions to the managed identity, granting owner rights for the resource group.
* Creates a Terraform template folder (tfTemplate).
* Pre-configures a Terraform remote state with the Azure back end.

## Access and configure a Linux Terraform virtual machine

After you create the VM, you can sign in to it by using SSH. Use the account credentials that you created in the "Basics" section of step 3 for the text shell interface. On Windows, you can download an SSH client tool like [Putty](http://www.putty.org/).

After you use SSH to connect to the virtual machine, you need to give contributor permissions for the entire subscription to managed identities for Azure resources on the virtual machine. 

Contributor permission helps MSI on VM to use Terraform to create resources outside the VM resource group. You can easily achieve this action by running a script once. Use the following command:

`. ~/tfEnv.sh`

The previous script uses the [AZ CLI v 2.0 interactive log-in](https://docs.microsoft.com/cli/azure/authenticate-azure-cli?view=azure-cli-latest#interactive-log-in) mechanism to authenticate with Azure and assign the virtual machine Managed Identity contributor permission on the entire subscription. 

 The VM has a Terraform remote state back end. To enable it on your Terraform deployment, copy the remoteState.tf file from tfTemplate directory to the root of the Terraform scripts.  

 `cp  ~/tfTemplate/remoteState.tf .`

 For more information about Remote State Management, see [this page about the Terraform remote state](https://www.terraform.io/docs/state/remote.html). The storage access key is exposed in this file and needs to be excluded before committing Terraform configuration files into source control.

## Next steps
In this article, you learned how to set up a Terraform Linux virtual machine on Azure. Here are some additional resources to help you learn more about Terraform on Azure: 

 [Terraform Hub in Microsoft.com](https://docs.microsoft.com/azure/terraform/)  
 [Terraform Azure provider documentation](http://aka.ms/terraform)  
 [Terraform Azure provider source](http://aka.ms/tfgit)  
 [Terraform Azure modules](http://aka.ms/tfmodules)
 

















