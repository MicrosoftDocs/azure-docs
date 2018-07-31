---
title: Azure CycleCloud Quickstart - Install and Setup CycleCloud | Microsoft Docs
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

Working through all the quickstarts should take 60 to 90 minutes. You will get the most out of them if they are done in order.

## QuickStart 1: Install and Setup Azure CycleCloud

Azure CycleCloud is a free application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and Big Compute/Data workloads. In this quickstart, you will install CycleCloud on Azure resources, using an Azure Resource Manager template that is stored on GitHub. The ARM template:

1. Creates the VM for CycleCloud, and installs CycleCloud on that VM
2. Creates and configures the network for the CycleCloud environment
3. Creates a bastion host for enabling more secure access to the CycleCloud instance

For the purposes of this quickstart, much of the setup has been done via the ARM template. However, CycleCloud can also be installed manually, providing greater control over the installation and configuration process. For more information, see the [Manual CycleCloud Installation documentation](installation.md).

## Prerequisites

For this QuickStart, you will need:

1. An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin
2. The [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/overview?view=azure-cli-latest) installed and configured with your Azure subscription
3. A [service principal](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest) in your Azure Active Directory
4. An SSH keypair

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.20 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

### Subscription ID

This command will list your available Azure subscription IDs:

```azurecli-interactive
az account list -o table
```

### Service Principal

If you do not have a service principal available, you can create one now. Note that your service principal name must be unique - in the example below, "CycleCloudApp" can be replaced with whatever you like:

```azurecli-interactive
az ad sp create-for-rbac --name CycleCloudApp --years 1
```

The output will display a series of information. You will need to save *appId*, *password*, and *tenant ID*:

``` output
    "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "displayName": "CycleCloudApp",
    "name": "http://CycleCloudApp",
    "password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

The *password* shown here is used as *applicationSecret* below.

### SSH KeyPair

In Windows, use the [PuttyGen application](https://www.ssh.com/ssh/putty/windows/puttygen#sec-Creating-a-new-key-pair-for-authentication) to create a new SSH keypair. You will need to do the following:

  1. **Save Public Key**
  2. **Save Private Key**
  3. **Conversions - Export Open SSH Key**

In Linux, follow [these instructions on GitHub](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to generate a new SSH keypair.

## Clone the Repo

Start by cloning the CycleCloud repo:

```azurecli-interactive
git clone https://github.com/CycleCloudCommunity/cyclecloud_arm.git
```

There are two ARM templates in the .git file:

      * `deploy-vnet.json` creates a VNET with 3 separate subnets:
        * `cycle`: The subnet in which the CycleCloud server is started
        * `compute`: A /22 subnet for the HPC clusters
        * `user`: The subnet for creating login nodes
      * `deploy-cyclecloud.json` provisions and sets up the CycleCloud application server

## Create a Resource Group and Virtual Network

Create a resource group in the region of your choice. Note that resource group names are unique within a subscription. For example, you could use *CycleCloudApp* as the resource group name and *South Central US* as the region:

```azurecli-interactive
az group create --name "CycleCloudApp" --location "South Central US"
```

Next, create the virtual network and subnets. The default vnet name is *cyclevnet*:

```azurecli-interactive
az group deployment create --name "vnet_deployment" --resource-group "{RESOURCE_GROUP}" --template-file deploy-vnet.json --parameters params-vnet.json
```

## Add Parameters

Locate and edit the `params-cyclecloud.json` file. Specify the following parameters:

* rsaPublicKey
* applicationSecret
* tenantID
* applicationID
* cyclecloudAdminPW

### rsaPublicKey

To copy the SSH key, open the **exported** public key, and copy the contents of the key into the `params-cyclecloud.json`.

An example `params-cyclecloud.json` might look like this:

``` sample-json
      {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
      "vnetName": { "value": "cyclevnet" },
      ...
      "rsaPublicKey": { "value": "ssh-rsa XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX="}
      }
```

### Application Parameters

*applicationSecret*, *tenantID*, and *applicationID* were all generated when setting up the Service Principal for your Azure Active Directory. Please note that *applicationSecret* is the *password* as displayed in the Service Principle output viewed previously. Input those values now.

### CycleCloud Admin Password

Use *cyclecloudAdminPW* to set a password for the CycleCloud application server `admin` user. The password needs to meet the following specifications:

* Between 3-8 characters and meeting three of the following four conditions:
   - Contains an upper case character
   - Contains a lower case character
   - Contains a number
   - Contains a special character: @ # $ % ^ & * - _ ! + = [ ] { } | \ : ' , . ?  ~ " ( ) ;

## Deploy the CycleCloud Virtual Machine

Deploy the CycleCloud VM using the edited `params-cyclecloud.json`:

```azurecli-interactive
az group deployment create --name "cyclecloud_deployment" --resource-group "{RESOURCE-GROUP}" --template-file deploy-cyclecloud.json --parameters params-cyclecloud.json
```

## Log into the CycleCloud Application Server

To connect to the CycleCloud webserver, retrieve the Fully Qualified Domain Name (FQDN) of the CycleServer VM from the Azure Portal, then browse to https://cycleserver[fqdn]/. The installation uses a self-signed SSL certificate, which may show up with a warning in your browser.

Login to the webserver using the `cycleadmin` user and the `cyclecloudAdminPW` password defined in the `params-cyclecloud.json` parameters file.

That's the end of Quickstart 1, which covered the installation and setup of Azure CycleCloud via ARM Template.

[!div class="nextstepaction"]
[Continue to Quickstart 2](quickstart-create-and-run-cluster.md)
