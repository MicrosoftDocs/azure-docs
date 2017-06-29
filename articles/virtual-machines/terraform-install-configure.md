---
title: Install and configure Terraform to provision VMs and other infrastructure in Azure | Microsoft Docs
description: Learn how to install and configure Terraform to create Azure resources
services: virtual-machines-linux
documentationcenter: virtual-machines
author: echuvyrov
manager: jtalkar
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/14/2017
ms.author: echuvyrov
---

# Install and configure Terraform to provision VMs and other infrastructure into Azure 
This article describes the necessary steps to install and configure Terraform to provision resources such as virtual machines into Azure. You will learn how to create and use Azure credentials to enable Terraform to provision cloud resources in a secure manner.

HashiCorp Terraform provides an easy way to define and deploy cloud infrastructure by using a custom templating language called HashiCorp configuration language (HCL). This custom language is [easy to write and easy to understand](terraform-create-complete-vm.md). Additionally, by using the `terraform plan` command, you can visualize the changes to your infrastructure before you commit them. Follow these steps  to start using Terraform with Azure.

## Install Terraform
To install Terraform, [download](https://www.terraform.io/downloads.html) the package appropriate for your operating system into a separate install directory. The download contains a single executable file, for which you should also define a global path. For instructions on how to set the path on Linux and Mac, go to [this webpage](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux). For instructions on how to set the path on Windows, go to [this webpage](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows). To verify your installation, run the `terraform` command. You should see a list of available Terraform options as output.

Next, you need to allow Terraform access to your Azure subscription to perform infrastructure provisioning.

## Set up Terraform access to Azure
To enable Terraform to provision resources into Azure, you need to create two entities in Azure Active Directory (Azure AD): an Azure AD application and an Azure AD service principal. Then, you use these entities' identifiers in your Terraform scripts. A service principal is a local instance of a global Azure AD application. A service principal allows granular local access control to global resources.

There are several ways to create an Azure AD application and an Azure AD service principal. The easiest and fastest way today is to use Azure CLI 2.0, which [you can download and install on Windows, Linux, or a Mac](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). You also can use PowerShell or Azure CLI 1.0 to create the necessary security infrastructure. The instructions that follow show you how to configure Terraform for Azure by using all of these approaches.

### Use Azure CLI 2.0 (for Windows, Linux, or Mac users) 
After you download and install the [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), sign in to administer your Azure subscription by issuing the following command:

```
az login
```

>[!NOTE]
>If you use the China, Azure Germany, or Azure Government clouds, you need to first configure the Azure CLI to work with that cloud. You can do this by running the following:

```
az cloud set --name AzureChinaCloud|AzureGermanCloud|AzureUSGovernment
```

If you have multiple Azure subscriptions, their details are returned by the `az login` command. Set the `SUBSCRIPTION_ID` environment variable to hold the value of the returned `id` field from the subscription you want to use. 

Set the subscription that you want to use for this session.

```
az account set --subscription="${SUBSCRIPTION_ID}"
```

Query the account to get the subscription ID and tenant ID values.

```
az account show --query "{subscriptionId:id, tenantId:tenantId}"
```

Next, create separate credentials for Terraform.

```
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
```

Your client_id, client_secret (password), sp_name, and tenant are returned. Make a note of the client\_id and client\_secret.

To confirm your credentials (service principal), open a new shell and run the following commands. Substitute the returned values for sp_name, client\_secret, and tenant:

```
az login --service-principal -u SP_NAME -p CLIENT_SECRET --tenant TENANT
az vm list-sizes --location westus
```

### Use PowerShell (for Windows users) 
To use a Windows machine to write and execute your Terraform scripts and to use PowerShell for configuration tasks, configure your machine with the right PowerShell tools. 

1. Install PowerShell tools by following the steps in [Install and configure Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps). 

2. Download and execute the [azure-setup.ps1 script](https://github.com/echuvyrov/terraform101/blob/master/azureSetup.ps1) from the PowerShell console. 
3. To run the azure-setup.ps1 script, download it and execute the `./azure-setup.ps1 setup` command from the PowerShell console. Then sign in to your Azure subscription with administrative privileges. 
4. Provide an application name (arbitrary string, required) when prompted. Optionally, supply a strong password when prompted. If you don't provide a password, a strong password is generated for you by using .NET security libraries.

### Use Azure CLI 1.0 (for Linux or Mac users)
To get started with Terraform on Linux machines or Macs with Azure CLI 1.0, install the proper libraries on your machine.  

1. Install Azure xPlat CLI tools by following the steps in [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

2. Download and install a JSON processor by following the instructions in [Download jq](https://stedolan.github.io/jq/download/).  

3. Download and execute the [azure-setup.sh script](https://github.com/mitchellh/packer/blob/master/contrib/azure-setup.sh) bash script from the console. 
4. To run the azure-setup.sh script, download it and execute the `./azure-setup setup` command from the console. Then sign in to your Azure subscription with administrative privileges. 
5. Provide an application name (arbitrary string, required) when prompted. Optionally, supply a strong password when prompted. If you don't provide a password, a strong password is generated for you by using .NET security libraries.

All the previous scripts create an Azure AD application and service principal. The service principal gets a contributor or owner-level access on the subscription. Because of the high level of access granted, you should always protect the security information generated by those scripts. Make a note of all four pieces of security information provided by those scripts: client_id, client_secret, subscription_id, and tenant_id.

## Set environment variables
After you create and configure an Azure AD service principal, you need to let Terraform know the tenant ID, subscription ID, client ID, and client secret to use. You can do it by embedding those values in your Terraform scripts, as described in [Create basic infrastructure by using Terraform](terraform-create-complete-vm.md). Alternately, you can set the following environment variables (and thus avoid accidentally checking in or sharing your credentials):

- ARM_SUBSCRIPTION_ID
- ARM_CLIENT_ID
- ARM_CLIENT_SECRET
- ARM_TENANT_ID

You can use this sample shell script to set those variables:

```
#!/bin/sh
echo "Setting environment variables for Terraform"
export ARM_SUBSCRIPTION_ID=your_subscription_id
export ARM_CLIENT_ID=your_client_id
export ARM_CLIENT_SECRET=your_client_secret
export ARM_TENANT_ID=your_tenant_id
```

Additionally, if you use Terraform with Azure in China or either Azure Government or Azure Germany, you need to set the environment variable appropriately.

## Next steps
You have now installed Terraform and configured Azure credentials so that you can start deploying infrastructure into your Azure subscription. Next, learn how to [create infrastructure with Terraform](terraform-create-complete-vm.md).