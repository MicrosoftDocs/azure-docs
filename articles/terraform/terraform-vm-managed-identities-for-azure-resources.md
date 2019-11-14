---
title: Tutorial - Create a Linux VM with a managed identity from the Azure Marketplace image using Terraform
description: Create Terraform Linux VM with a managed identity and Remote State Management using Azure Marketplace image 
ms.service: terraform
author: tomarchermsft
ms.author: tarcher
ms.topic: tutorial
ms.date: 10/26/2019
---

# Tutorial: Create a Linux VM with a managed identity from the Azure Marketplace image using Terraform

This article shows you how to use a [Terraform Marketplace image](https://azuremarketplace.microsoft.com/marketplace/apps/azure-oss.terraform?tab=Overview) to create an Ubuntu Linux VM (16.04 LTS) with the latest [Terraform](https://www.terraform.io/intro/index.html) version installed and configured using [managed identities for Azure resources](/azure/active-directory/managed-service-identity/overview). This image also configures a remote back end to enable [remote state](https://www.terraform.io/docs/state/remote.html) management using Terraform. 

The Terraform Marketplace image makes it easy to get started using Terraform on Azure, without having to install and configure Terraform manually. 

There are no software charges for this Terraform VM image. You pay only the Azure hardware usage fees based on the provisioned VM's size. 

For more information about the compute fees, see the [Linux VM pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

## Prerequisites
Before you can create a Linux Terraform VM, you must have an Azure subscription. If you don't already have one, see [Create your free Azure account today](https://azure.microsoft.com/free/).  

## Create your Terraform VM 

Here are the steps to create an instance of a Linux Terraform VM: 

1. In the Azure portal, go to the [Create a Resource](https://ms.portal.azure.com/#create/hub) listing.

1. In the **Search the Marketplace** search bar, search for **Terraform**. 

1. Select the **Create**. 

1. The following sections provide inputs for each of the steps in the wizard to create the Terraform Linux VM. The following section lists the inputs that are needed to configure each of these steps.

## Details on the Create Terraform tab

Enter the following details on the **Create Terraform** tab:

1. **Basics**
    
   * **Name**: The name of your Terraform VM.
   * **User Name**: The first account sign-in ID.
   * **Password**: The first account password. (You can use an SSH public key instead of a password.)
   * **Subscription**: The subscription on which the machine is to be created and billed. You must have resource creation privileges for this subscription.
   * **Resource group**: A new or existing resource group.
   * **Location**: The datacenter that is most appropriate. Usually it's the datacenter that has most of your data, or the one that's closest to your physical location for fastest network access.

2. **Additional settings**

   * **Size**: Size of the VM. 
   * **VM disk type**: SSD or HDD.

3. **Summary Terraform**

   * Verify that all information that you entered is correct. 

4. **Buy**

   * To start the provisioning process, select **Buy**. A link is provided to the terms of the transaction. The VM doesn't have any additional charges beyond the compute for the server size that you chose in the size step.

The Terraform VM image does the following steps:

* Creates a VM with system-assigned identity that's based on the Ubuntu 16.04 LTS image.
* Installs the managed identities for Azure resources extension on the VM to allow OAuth tokens to be issued for Azure resources.
* Assigns RBAC permissions to the managed identity, granting owner rights for the resource group.
* Creates a Terraform template folder (tfTemplate).
* Pre-configures a Terraform remote state with the Azure back end.

## Access and configure a Linux Terraform VM

After you create the VM, do the following steps:

1. Sign in to the VM using SSH. Use the account credentials that you created in the previous section. On Windows, you can download an SSH client tool like [Putty](https://www.putty.org/).

1. Grant contributor permissions for the entire subscription to managed identities for Azure resources on the VM. 

    Contributor permission helps managed identities for Azure resources on VM to use Terraform to create resources outside the VM resource group. Do this action by running the following script: 
    
    ```bash
    . ~/tfEnv.sh
    ```

    This script uses the [Azure CLI interactive log-in](/cli/azure/authenticate-azure-cli?view=azure-cli-latest#sign-in-interactively) mechanism to authenticate with Azure. This process assigns the [Managed Identity Contributor permission](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) for the entire subscription. 

1. The VM has a Terraform remote state back end. To enable it on your Terraform deployment, you must copy the `remoteState.tf` file to the root of the Terraform scripts.

    ```bash
    cp  ~/tfTemplate/remoteState.tf .
    ```

    For more information about Remote State Management, see [Terraform remote state](https://www.terraform.io/docs/state/remote.html). The storage access key is exposed in this file. Exclude it before committing Terraform configuration files into source control.

## Next steps

> [!div class="nextstepaction"] 
> [Terraform on Azure](/azure/ansible/)