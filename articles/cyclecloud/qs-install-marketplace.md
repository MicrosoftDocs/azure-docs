---
title: Quickstart - Install via Marketplace
description: Learn how to get CycleCloud running using the Marketplace image. Create a virtual machine, assign Managed Identity, and sign in to the CycleCloud web server.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Quickstart - Install CycleCloud using the Marketplace image

Azure CycleCloud is a free application that provides a simple, secure, and scalable way to manage compute and storage resources for HPC and Big Compute workloads. In this quickstart, you install CycleCloud on Azure resources using the Marketplace image. 

The CycleCloud Marketplace image is the easiest and recommended way to install CycleCloud. It helps you quickly start and scale clusters. You can also install CycleCloud manually, which gives you greater control over the installation and configuration process. For more information, see the [Manual CycleCloud Installation Quickstart](./how-to/install-manual.md).

## Prerequisites

For this quickstart, you need:

1. An Azure account with an active subscription.
1. An SSH key

[!INCLUDE [cloud-shell-try-it.md](~/articles/cyclecloud/includes/cloud-shell-try-it.md)]

### SSH keypair

You need an SSH key to sign in to the CycleCloud VM and clusters. Generate an SSH keypair with the following code:

```azurecli-interactive
ssh-keygen -f ~/.ssh/id_rsa -m pem -t rsa -N "" -b 4096
```

Get the SSH public key with:

```azurecli-interactive
cat ~/.ssh/id_rsa.pub
```

The output starts with `ssh-rsa` and is followed by a long string of characters. Copy and save this key for reference.

On Linux, follow [these instructions on GitHub](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) to generate a new SSH keypair.

## Create virtual machine

1. Sign in to the [Azure portal](https://ms.portal.azure.com).
1. In the search bar, enter "CycleCloud" and select "Azure CycleCloud" from under the **Marketplace** category.
1. Select **Create** to open the form for creating a virtual machine.

![Create CycleCloud VM](~/articles/cyclecloud/images/create-cyclecloud-vm.png)

### Customize CycleCloud instance

1. Choose your subscription from the **Subscription** dropdown.
1. Select or create a new **Resource Group** for your CycleCloud instance.
1. Enter a name for your CycleCloud instance using **Virtual Machine name**.
1. Select the **Region**.
1. Create the **Username** to sign in to the instance.
1. Add your **SSH public key**.
1. Select the **Management** tab and enable **System assigned managed identity** if you plan to use [Managed Identities](/azure/active-directory/managed-identities-azure-resources/overview) (recommended).
1. Select **Review** and then **Create**.

The image has many recommended default settings, including **Size** and built-in **Network Security Groups**. You can modify these settings if necessary.

![Customize CycleCloud instance](~/articles/cyclecloud/images/customize-marketplace-image.png)

## Assign managed identity

If you use Managed Identities for authentication, follow the [Managed Identities Guide](./how-to/managed-identities.md) to assign the system managed identity to the new application VM.

## Sign in to the CycleCloud application server

To connect to the CycleCloud webserver, get the public IP address of the CycleServer VM from the Azure portal.

![Get Public IP address](~/articles/cyclecloud/images/get-public-ip.png)

Browse to `https://<public IP>/`. The installation uses a self-signed SSL certificate, which might cause a warning in your browser.

Create a **Site Name** for your installation. You can use any name you want:

::: moniker range="=cyclecloud-7"

![Welcome Screen](./images/version-7/setup-step1.png)

::: moniker-end

::: moniker range=">=cyclecloud-8"

![Welcome Screen](./images/version-8/setup-step1.png)

::: moniker-end

The Azure CycleCloud End User License Agreement is displayed - accept it.

::: moniker range="=cyclecloud-7"
![License Screen](./images/version-7/setup-step2.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![License Screen](./images/version-8/setup-step2.png)
::: moniker-end

Create a CycleCloud admin user for the application server. Use the same username you entered earlier, if possible. Make sure the password meets the listed requirements. Select **Done** to continue.

::: moniker range="=cyclecloud-7"
![Administrator Account setup](./images/version-7/setup-step3.png)
::: moniker-end

::: moniker range=">=cyclecloud-8"
![Administrator Account setup](./images/version-8/setup-step3.png)
::: moniker-end

After you create your user, set your SSH key so you can more easily access any Linux VMs that CycleCloud creates. To add an SSH key, edit your profile by selecting your name in the upper right corner of the screen.

You need to set up your Azure provider account in CycleCloud. You can either use [Managed Identities](./how-to/managed-identities.md) or [Service Principals](./how-to/service-principals.md).

You now have a running CycleCloud application that lets you create and run clusters.

> [!NOTE]
> You can customize the default CycleCloud configuration for specific environments by using settings in the _$CS_HOME/config/cycle_server.properties_ file.

## Further reading

* [Plan your Production Deployment](/azure/cyclecloud/how-to/plan-prod-deployment)
* [Install CycleCloud manually](./how-to/install-manual.md)
* [Explore CycleCloud features with the tutorial](./tutorials/tutorial.md)
* [Use Managed Identities for account](./how-to/managed-identities.md)
* [Use Service Principals for account](./how-to/service-principals.md)
