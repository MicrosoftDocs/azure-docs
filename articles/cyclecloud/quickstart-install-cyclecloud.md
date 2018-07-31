---
title: Azure CycleCloud QuickStart - Install and Setup CycleCloud | Microsoft Docs
description: In this quickstart, you will install and setup Azure CycleCloud
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: quickstart
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Azure CycleCloud QuickStarts

There are four parts to the Azure CycleCloud QuickStart:

1. Setup and install CycleCloud on a Virtual Machine
2. Configure and create a simple HPC cluster consisting of a job scheduler and an NFS file server, and create a usage alert to monitor cost
3. Submit jobs to observe the cluster autoscale up and down automatically
4. Clean up resources

Working through all the QuickStarts should take 60 to 90 minutes. You will get the most out of them if they are done in order.

## QuickStart 1: Install and Setup Azure CycleCloud

Azure CycleCloud is a free application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and Big Compute/Data workloads. In this quickstart, you will install CycleCloud on Azure resources, using an Azure Resource Manager (ARM) template that is stored on GitHub. The ARM template:

1. Deploys a virtual network with three separate subnets:
  * *cycle*: The subnet in which the CycleCloud server is started in
  * *compute*: A /22 subnet for the HPC clusters
  * *user*: The subnet for creating user logins
2. Provisions a VM in the *cycle* subnet and installs Azure CycleCloud on it.

For the purposes of this quickstart, much of the setup has been done via the ARM template. However, CycleCloud can also be installed manually, providing greater control over the installation and configuration process. For more information, see the [Manual CycleCloud Installation](installation.md) documentation.

## Prerequisites

For this quickstart, you will need:

1. An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
2. The [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/overview?view=azure-cli-latest) installed and configured with your Azure subscription.
3. A [service principal](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest) in your Azure Active Directory.
4. An SSH keypair.

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

### Subscription ID

Run this command to list your available Azure subscription IDs:

```azurecli-interactive
az account list -o table
```

### Service Principal

Azure CycleCloud requires a service principal with contributor access to your Azure subscription. If you do not have a service principal available, you can create one now. Note that your service principal name must be unique - in the example below, *CycleCloudApp* can be replaced with whatever you like:

```azurecli-interactive
az ad sp create-for-rbac --name CycleCloudApp --years 1
```

The output will display a series of information. You will need to save the *App ID*, *password*, and *tenant ID*:

``` output
"appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"displayName": "CycleCloudApp",
"name": "http://CycleCloudApp",
"password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

The *password* shown here is the *applicationSecret* used below.

### SSH KeyPair

On Windows, use the [PuttyGen application](https://www.ssh.com/ssh/putty/windows/puttygen#sec-Creating-a-new-key-pair-for-authentication) to create a ssh keypair. You will need to do the following:

  1. **Save Public Key**
  2. **Save Private Key**
  3. **Conversions - Export Open SSH Key**

On Linux, follow [these instructions on GitHub](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to generate a new ssh keypair.

## Clone the Repo

Start by cloning the CycleCloud repo:

```azurecli-interactive
git clone https://github.com/CycleCloudCommunity/cyclecloud_arm.git
```

The files in the repo include:

* `azuredeploy.json` is the ARM template that configures the vnet and provisions the VM
* `params.azuredeploy.json` contains the parameters necessary to configure the ARM template
* `params-vnet.json` contains the vnet configuration parameters

## Create a Resource Group and Virtual Network

Create a resource group in the region of your choice. Note that resource group names are unique within a subscription. For example, you could use *AzureCycleCloud* as the resource group name and *South Central US* as the region:

```azurecli-interactive
az group create --name "AzureCycleCloud" --location "South Central US"
```

Next, create the virtual network and subnets. The default vnet name is *cyclevnet*:

```azurecli-interactive
az group deployment create --name "vnet_deployment" --resource-group "{RESOURCE_GROUP}" --template-file deploy-vnet.json --parameters params-vnet.json
```

## Add Parameters

Locate and edit the `params-azuredeploy.json` file. Specify the following parameters:

* rsaPublicKey
* applicationSecret

### rsaPublicKey

To copy the ssh key, open the **exported** public key, and copy the contents of the key into the `params-azuredeploy.json`.

An example `params-azuredeploy.json` might look like this:

``` sample-json
{
"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
"contentVersion": "1.0.0.0",
"parameters": {
"username": { "value": "cycleadmin" },
...
"rsaPublicKey": { "value": "XXXXXXXXXXXXXXXXXXXXXXXXXX="}
}
```

### Application Parameters

*applicationSecret*, *tenantID*, and *applicationID* were all generated when setting up the Service Principal for your Azure Active Directory. Please note that *applicationSecret* is the *password* as displayed in the Service Principle output viewed previously. Input those values now.

### CycleCloud Admin Password

Specify a password for the CycleCloud application server `admin` user. The password needs to meet the following specifications:

* Between 3-8 characters and meeting three of the following four conditions:
   - Contains an upper case character
   - Contains a lower case character
   - Contains a number
   - Contains a special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?  ~ " ( ) ;

## Deploy the Template

Deploy the CycleCloud VM using the edited `params-azuredeploy.json`:

```azurecli-interactive
az group deployment create --name "cyclecloud_deployment" --resource-group "AzureCycleCloud" --template-file azuredeploy.json --parameters params-azuredeploy.json
```

The deployment process runs an installation script as a custom script extension, which installs and sets up CycleCloud. This process takes between 5 and 8 mins.

## Log into the CycleCloud Application Server

To connect to the CycleCloud webserver, retrieve the Fully Qualified Domain Name (FQDN) of the CycleServer VM from either the Azure Portal or using the CLI:

```azurecli-interactive
az network public-ip list -g AzureCycleCloud | grep fqdn
```

Browse to https://[fqdn]/. The installation uses a self-signed SSL certificate, which may show up with a warning in your browser.

Login to the webserver using the *cycleadmin* user and the *cyclecloudAdminPW* password defined in the `params-azuredeploy.json` parameters file.

That's the end of QuickStart 1, which covered the installation and setup of Azure CycleCloud via ARM Template.

> [!div class="nextstepaction"]
> [Continue to Quickstart 2](quickstart-create-and-run-cluster.md)
