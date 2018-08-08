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
  * [!INCLUDE [quickstarts-free-trial-note.md](~/includes/free-trial-note.md)]
2. A Shell session in a terminal.
  * If you are using a Windows machine, use the [browser-based Bash shell](https://shell.azure.com).
  * For non-Windows machines, install and use Azure CLI v2.0.20 or later. Run `az --version` to find your current version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

### Open a Terminal Window

[!INCLUDE [cloud-shell-try-it.md](~/includes/cloud-shell-try-it.md)]


Open a [Shell session](https://shell.azure.com) in a new browser window. You can also use the green "Try It" button below to open Cloud Shell in your current browser window:

```azurecli-interactive
Click the "Try It" button to open Cloud Shell
```

> [!NOTE]
> The "Try It" button opens a Cloud Shell in your current browser window. It does not enter the command for you. You will need to click the "Copy" button to save to your clipboard, then paste the command into your Shell.

Select **Bash** as the shell type. If you are prompted to create storage, the default option is fine.

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

An SSH key is needed to log into the CycleCloud VM and clusters. Generate an SSH keypair:

```azurecli-interactive
ssh-keygen -f ~/.ssh/id_rsa  -N "" -b 4096
```

Retrieve the SSH public key with:

```azurecli-interactive
cat ~/.ssh/id_rsa.pub
```

The output will begin with ssh-rsa followed by a long string of characters. Copy and save this key now.

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

Run `export RESOURCE-GROUP="the name you gave your resource group"`. This will create allow you to copy the next command and enter it without modifying it.

To connect to the CycleCloud webserver, retrieve the Fully Qualified Domain Name (FQDN) of the CycleServer VM from either the Azure Portal or using the CLI:

```azurecli-interactive
az network public-ip show -g ${RESOURCE-GROUP?} -n cycle-ip --query dnsSettings.fqdn
```

Browse to https://[fqdn]/. The installation uses a self-signed SSL certificate, which may show up with a warning in your browser.

Create a Site Name for your installation. You can use any name here:

![CycleCloud Welcome screen](~/images/cc-first-login.png)

The Azure CycleCloud End User License Agreement will be displayed - click to accept it. You will then need to create a CycleCloud admin user for the application server. We recommend using the same username used above. Ensure the password you enter meets the requirements listed. Click **Done** to continue.

![CycleCloud Create New User screen](~/images/create-new-user.png)

That's the end of QuickStart 1, which covered the installation and setup of Azure CycleCloud via ARM Template.

> [!div class="nextstepaction"]
> [Continue to Quickstart 2](quickstart-create-and-run-cluster.md)
