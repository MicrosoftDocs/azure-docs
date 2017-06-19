---
title: Install and configure Terraform to provision VMs and other infrastructure in Azure | Microsoft Docs
description: Learn how to install and configure Terraform for creating Azure resources
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
This article details the necessary steps to install and configure Terraform to provision resources such as virtual machines into Azure. You will learn how to create and use Azure credentials to enable Terraform to provision cloud resources in a secure manner.

HashiCorp Terraform provides an easy way to define and deploy cloud infrastructure using a custom templating language called HCL. This custom language is both [easy to write and easy to understand](terraform-create-complete-vm.md). Additionally, via the "terraform plan" command, Terraform enables you to visualize the changes to your infrastructure before committing them. Follow the steps below to get started using Terraform with Azure.

## Installing Terraform
To install Terraform, [download](https://www.terraform.io/downloads.html) the package appropriate for your OS into a separate install directory. The download contains a single executable file, which you should also define a global PATH for. Instructions on setting the PATH on Linux and Mac can be found on [this page](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux), while [this page](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows) contains instructions for setting the PATH on Windows. Verify your installation by running the "terraform" command - you should see a list of available Terraform options as output.

Next, you need to allow Terraform access to your Azure subscription to perform infrastructure provisioning.

## Setting up Terraform Access to Azure
To enable Terraform to provision resources into Azure, you need to create two entities in Azure Active Directory (AAD) - AAD Application and AAD Service Principal. Then, you use these entities' identifiers in your Terraform scripts. Service Principal is a local instance of a global AAD Application. Having a Service Principal allows for granular local access control to global resources.

There are several ways to create AAD Application and AAD Service Principal. The easiest and fastest way today is to use Azure CLI 2.0, which [you can download and install on Windows/Linux/Mac](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). You can also use Powershell or Azure CLI 1.0 to create the necessary security infrastructure. Instructions below show you how to configure Terraform for Azure using all those approaches.

### Windows/Linux/Mac Users using Azure CLI 2.0
After downloading and installing the [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli), login to administer your azure subscription by issuing the following command

```
> az login
```

Note: if you're using the China, German or Government Azure Clouds, you need to first configure the Azure CLI to work with that Cloud. You can do this by running:

```
$ az cloud set --name AzureChinaCloud|AzureGermanCloud|AzureUSGovernment
```

If you have multiple Azure Subscriptions, their details are returned by the `az login` command. Set the `SUBSCRIPTION_ID` environment variable to hold the value of the returned `id` field from the Subscription you want to use. 

Set the Subscription that you want to use for this session.

```
> az account set --subscription="${SUBSCRIPTION_ID}"
```

Query the account to get the Subscription Id and Tenant Id values.

```
> az account show --query "{subscriptionId:id, tenantId:tenantId}"
```

Next, create separate credentials for Terraform.

```
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
```

This outputs your client_id, client_secret (password), sp_name, and tenant. Take note of the **client_id** and **client_secret**.

You can confirm your credentials (service principal) by opening a new shell and running the following commands substituting in the returned values for **sp_name**, **client_secret**, and **tenant**:

```
> az login --service-principal -u SP_NAME -p CLIENT_SECRET --tenant TENANT
> az vm list-sizes --location westus
```

### Windows Users using Powershell
If you are using a Windows machine to write and execute your Terraform scripts and prefer to use Powershell for configuration tasks, you need to configure your machine with the right Powershell tools. To do that, (1) [install Azure PowerShell tools](https://azure.microsoft.com/en-us/documentation/articles/powershell-install-configure/#step-1-install) and (2) download and execute the [azure-setup.ps1 script](https://github.com/echuvyrov/terraform101/blob/master/azureSetup.ps1) from the Powershell console. To run the azure-setup.ps1 script, download it, execute the "./azure-setup.ps1 setup" command from the Powershell console and login into your Azure subscription with administrative privileges. Then, provide an application name (arbitrary string, required) when prompted and (optionally) supply a strong password. If you don't provide password, the strong password is generated for you using .Net security libraries.

### Linux/Mac Users using Azure CLI 1.0
To get started with Terraform on Linux machines or Macs with Azure CLI 1.0, you need to ensure proper libraries are installed on your machine. To do that, (1) [install Azure xPlat CLI tools](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-install/), (2) [download and install jq](https://stedolan.github.io/jq/download/) JSON processor and  (3) download and execute the [azure-setup.sh script](https://github.com/mitchellh/packer/blob/master/contrib/azure-setup.sh) bash script from the console. To run the azure-setup.sh script, download it, execute the "./azure-setup setup" command from the console and login into your Azure subscription with administrative privileges. Then, provide an application name (arbitrary string, required) when prompted and (optionally) supply a strong password when prompted. If you don't provide the password, the strong password will be generated for you using .Net security libraries.

All the scripts above create an AAD Application and a Service Principal, giving Service Principal a contributor or owner-level access on the subscription. Because of high level of access granted, you should always protect the security information generated by those scripts. Take a note of all four pieces of security information provided by those scripts: client_id, client_secret, subscription_id and tenant_id. 

## Setting environment variables
With AAD Service Principal created and configured, you need to let Terraform know the Tenant ID, Subscription ID, Client ID, and Client Secret to use. You can do it by embedding those values in your Terraform scripts (as described in the [next section](terraform-create-complete-vm.md)). Alternately, you can also set the following environment variables (and thus avoid accidentally checking in/sharing your credentials):

- ARM_SUBSCRIPTION_ID
- ARM_CLIENT_ID
- ARM_CLIENT_SECRET
- ARM_TENANT_ID

Below is a sample shell script you can use to set those variables:

```
#!/bin/sh
echo "Setting environment variables for Terraform"
export ARM_SUBSCRIPTION_ID=your_subscription_id
export ARM_CLIENT_ID=your_client_id
export ARM_CLIENT_SECRET=your_client_secret
export ARM_TENANT_ID=your_tenant_id
```

Additionally, if you are using Terraform with either Azure Government, Azure Germany or Azure China, you need to set the ENVIRONMENT variable appropriately.

## Next steps
You now have Terraform installed and credentials defined deploy infrastructure into your subscription. Learn how to [create infrastructure with Terraform](terraform-create-complete-vm.md).