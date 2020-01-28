---
title: Quickstart - Install via Marketplace
description: Learn how to get CycleCloud running using the Marketplace image
author: adriankjohnson
ms.date: 08/01/2018
ms.author: adjohnso
---

# Quickstart - Install CycleCloud using the Marketplace image

Azure CycleCloud is a free application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and Big Compute workloads. In this quickstart, you will install CycleCloud on Azure resources using the Marketplace image. 

The CycleCLoud Marketplace image is the recommended way of installing CycleCloud and it is the easiest way to quickly get a working version of CycleCloud that will allow you to start and scale clusters. CycleCloud can also be installed manually, providing greater control over the installation and configuration process. For more information, see the [Manual CycleCloud Installation Quickstart](qs-install-manual.md)

## Prerequisites

For this quickstart, you will need:

1. An Azure account with an active subscription.
1. A SSH key

[!INCLUDE [cloud-shell-try-it.md](~/includes/cloud-shell-try-it.md)]

### SSH Keypair

An SSH key is needed to log into the CycleCloud VM and clusters. Generate an SSH keypair:

```azurecli-interactive
ssh-keygen -f ~/.ssh/id_rsa -m pem -t rsa -N "" -b 4096
```

Retrieve the SSH public key with:

```azurecli-interactive
cat ~/.ssh/id_rsa.pub
```

The output will begin with ssh-rsa followed by a long string of characters. Copy and save this key now.

On Linux, follow [these instructions on GitHub](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to generate a new SSH keypair.

## Create Virtual Machine

1. Log into the [Azure Portal](https://ms.portal.azure.com)
1. In the search bar, enter "Virtual" and select "Virtual machines" from the dropdown to bring up the VM blade
1. Click on **Add** button
1. Click on the **Create VM from Azure Marketplace** link
1. Search for "CycleCloud" and select the **Azure CycleCloud** image
1. Click on the **Create** button to bring up the Create Virtual Machine form.

### Customize CycleCloud instance

1. Choose your subscription from the **Subscription** dropdown
1. Select or create a new **Resource Group** that your CycleCloud instance will run in.
1. Name your CycleCloud instance using **Virtual Machine name**
1. Select the **Region**
1. Create the **Username** that you will use to log into the instance
1. Add your **SSH public key**

The image has a number of default settings including Size and built-in Network Security Groups.

## Log into the CycleCloud Application Server

To connect to the CycleCloud webserver, retrieve the Fully Qualified Domain Name (FQDN) of the CycleServer VM from either the Azure Portal or using the CLI:

```azurecli-interactive
# Replace "MyQuickstart" with the resource group you created above.
export RESOURCE_GROUP="MyQuickstart"
az network public-ip show -g ${RESOURCE_GROUP?} -n cycle-ip --query dnsSettings.fqdn
```

Browse to `https://<FQDN>/`. The installation uses a self-signed SSL certificate, which may show up with a warning in your browser.

Create a **Site Name** for your installation. You can use any name here:

![CycleCloud Welcome screen](~/images/cc-first-login.png)

The Azure CycleCloud End User License Agreement will be displayed - click to accept it. You will then need to create a CycleCloud admin user for the application server. We recommend using the same username used above. Ensure the password you enter meets the requirements listed. Click **Done** to continue.

![CycleCloud Create New User screen](~/images/create-new-user.png)

Once you have created your user, you may want to set your SSH key so that you can more easily access any Linux VMs created by CycleCloud. To add an SSH key, edit your profile by clicking on your name in the upper right hand corner of the screen.

You should now have a running CycleCloud application that allows you to create and run clusters.

## Further Reading

* [Install CycleCloud manually](./qs-install-manual.md)
* [Explore CycleCloud features with the tutorial](./tutorials/create-cluster.md)