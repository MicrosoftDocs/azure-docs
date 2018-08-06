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

Working through all the quickstarts should take 60 to 90 minutes. You will get the most out of them if they are done in order. As most HPC environments run on Linux, this quickstart assumes basic Linux familiarity.

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

1. An active Azure subscription.
  * If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
2. A Shell session in a terminal.
  * If you are using a Windows machine, use the [browser-based Bash shell](https://shell.azure.com).
  * For non-Windows machines, install and use Azure CLI v2.0.20 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

### Open a Terminal Window

[![Launch Cloud Shell](https://shell.azure.com/images/launchcloudshell@2x.png "Launch Cloud Shell")](https://shell.azure.com)

If this is your first time using Cloud Shell, select **Bash** as the type. If you are prompted to create storage,

### Service Principal

Azure CycleCloud requires a service principal with contributor access to your Azure subscription. If you do not have a service principal available, you can create one now. Note that your service principal name must be unique - in the example below, *CycleCloudApp* can be replaced with whatever you like:

```azurecli-interactive
az ad sp create-for-rbac --name CycleCloudApp --years 1
```

The output will display a series of information. You will need to save the `appiD`, `password`, and `tenant`:

``` output
"appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"displayName": "CycleCloudApp",
"name": "http://CycleCloudApp",
"password": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
"tenant": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### SSH KeyPair

An SSH key is needed to log into the CycleCloud VM and clusters. Specify a public SSH key to use with all clusters, as well as the application server.

On Windows, use the [PuttyGen application](https://www.ssh.com/ssh/putty/windows/puttygen#sec-Creating-a-new-key-pair-for-authentication) to create a ssh keypair. You will need to do the following:

  1. **Save Public Key**
  2. **Save Private Key**
  3. **Conversions - Export Open SSH Key**

On Linux, follow [these instructions on GitHub](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to generate a new ssh keypair.

## Deploy Azure CycleCloud

Click the button below to deploy Azure CycleCloud into your subscription:

[![Deploy to Azure](https://azuredeploy.net/deploybutton.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FCycleCloudCommunity%2Fcyclecloud_arm%2Fdeploy-azure%2Fazuredeploy.json)

Enter the required information:

* *Tenant ID*: The `tenant` from the service principal above
* *Application ID*: The `appId` from the service principal above
* *Application Secret*: The `password` from the service principal above
* *SSH Public Key*: The public key used to log into the CycleCloud VM
* *Username*: The username for the CycleCloud VM. Use your Azure Portal username without the domain (e.g. *johnsmith* instead of *johnsmith@domain.com*)

The deployment process runs an installation script as a custom script extension, which installs and sets up CycleCloud. This process takes between 5 and 8 mins.

## Log into the CycleCloud Application Server

To connect to the CycleCloud webserver, retrieve the Fully Qualified Domain Name (FQDN) of the CycleServer VM from either the Azure Portal or using the CLI:

```azurecli-interactive
az network public-ip list -g AzureCycleCloud | grep fqdn
```

Browse to https://[fqdn]/. The installation uses a self-signed SSL certificate, which may show up with a warning in your browser. The Azure CycleCloud End User License Agreement will be displayed - click to accept it.

You will need to create a CycleCloud admin user for the application server. We recommend using the same username used above.

![CycleCloud Create New User screen](~/images/create-new-user.png)

That's the end of QuickStart 1, which covered the installation and setup of Azure CycleCloud via ARM Template.

> [!div class="nextstepaction"]
> [Continue to Quickstart 2](quickstart-create-and-run-cluster.md)
