---
title: Quickstart - Create an Azure confidential computing virtual machine with Marketplace
description: Get started with your deployments by learning how to quickly create a confidential computing virtual machine with Marketplace.
author: JBCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 06/13/2021
ms.author: JenCook
---

# Quickstart: Deploy an Azure Confidential Computing VM in the Marketplace

Get started with Azure confidential computing by using the Azure portal to create a virtual machine (VM) backed by Intel SGX. Optionally you can test an enclave application built with the Open Enclave Software (SDK) . 

This tutorial is recommended for you if you're interested in deploying a confidential compute virtual machine with a template configuration. Otherwise, we recommend following standard Azure Virtual Machine deployment flow [using portal or CLI.](quick-create-portal.md)

## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the virtual machines used in this tutorial. Please upgrade to a Pay-As-You-Go subscription.


## Sign in to Azure

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. At the top, select **Create a resource**.

1. In the **Get Started** default pane, search **Azure Confidential Computing (Virtual Machine)** .

1. Click the **Azure Confidential Computing (Virtual Machine)** template.

    ![Deploy a VM](media/quick-create-marketplace/portal-search-marketplace.png)

1. On the Virtual machine landing page, select **Create**.


## Configure a confidential computing virtual machine

1. In the **Basics** tab, select your **Subscription** and **Resource Group** (group needs to be empty to deploy this template).

1. For **Virtual machine name**, enter a name for your new VM.

1. Type or select the following values:

   * **Region**: Select the Azure region that's right for you.

        > [!NOTE]
        > Confidential compute virtual machines only run on specialized hardware available in specific regions. For the latest available regions for DCsv2-Series VMs, see [available regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

1. Configure the operating system image that you would like to use for your virtual machine. This setup only support Gen 2 VM and image deployments

    * **Choose Image**: For this tutorial, select Ubuntu 18.04 LTS (Gen 2). You may also select Windows Server Datacenter 2019, Windows Server Datacenter 2016, or and Ubuntu 16.04 LTS. If you choose to do so, you'll be redirected in this tutorial accordingly.
   
1. Fill in the following information in the Basics tab:

   * **Authentication type**: Select **SSH public key** if you're creating a Linux VM. 

        > [!NOTE]
        > You have the choice of using an SSH public key or a Password for authentication. SSH is more secure. For instructions on how to generate an SSH key, see [Create SSH keys on Linux and Mac for Linux VMs in Azure](../virtual-machines/linux/mac-create-ssh-keys.md).

    * **Username**: Enter the Administrator name for the VM.

    * **SSH public key**: If applicable, enter your RSA public key.
    
    * **Password**: If applicable, enter your password for authentication.
    
1. Fill in the following information in the "Virtual Machine Settings" tab:

   * Choose the VM SKU Size
   * If you chose a **DC1s_v2**, **DC2s_v2**, **DC4s_V2** virtual machine, choose a disk type that is either **Standard SSD** or **Premium SSD**. For **DC8_v2** virtual machine you can only choose choose **Standard SSD** as your disk type.

   * **Public inbound ports**: Choose **Allow selected ports** and select **SSH (22)** and **HTTP (80)** in the **Select public inbound ports** list. If you're deploying a Windows VM, select **HTTP (80)** and **RDP (3389)**. In this quickstart, this step is necessary to connect to the VM.
   
    >[!Note]
    > Allowing RDP/SSH ports is not recommended for production deployments.  

     ![Inbound ports](media/quick-create-portal/inbound-port-virtual-machine.png)


1. Choose the **Monitoring** option if necessary

1. Select **Review + create**.

1. In the **Review + create** pane, select **Create**.

> [!NOTE]
> Proceed to the next section and continue with this tutorial if you deployed a Linux VM. If you deployed a Windows VM, [follow these steps to connect to your Windows VM](../virtual-machines/windows/connect-logon.md)


## Connect to the Linux VM

If you already use a BASH shell, connect to the Azure VM using the **ssh** command. In the following command, replace the VM user name and IP address to connect to your Linux VM.

```bash
ssh azureadmin@40.55.55.555
```

You can find the Public IP address of your VM in the Azure portal, under the Overview section of your virtual machine.

:::image type="content" source="media/quick-create-portal/public-ip-virtual-machine.png" alt-text="IP address in Azure portal":::

If you're running on Windows and don't have a BASH shell, install an SSH client, such as PuTTY.

1. [Download and install PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

1. Run PuTTY.

1. On the PuTTY configuration screen, enter your VM's public IP address.

1. Select **Open** and enter your username and password at the prompts.

For more information about connecting to Linux VMs, see [Create a Linux VM on Azure using the Portal](../virtual-machines/linux/quick-create-portal.md).

> [!NOTE]
> If you see a PuTTY security alert about the server's host key not being cached in the registry, choose from the following options. If you trust this host, select **Yes** to add the key to PuTTy's cache and continue connecting. If you want to carry on connecting just once, without adding the key to the cache, select **No**. If you don't trust this host, select **Cancel** to abandon the connection.

## Intel SGX Drivers

> [!NOTE]
> Intel SGX drivers as already part of the Ubuntu & Windows Azure Gallery Images. No special installation of the drivers is required. Optionally you can also update the existing drivers shipped in the images by visiting the [Intel SGX DCAP drivers list](https://01.org/intel-software-guard-extensions/downloads).

## Optional: Testing enclave apps built with Open Enclave SDK (OE SDK) <a id="Install"></a>

Follow the step-by-step instructions to install the [OE SDK](https://github.com/openenclave/openenclave) on your DCsv2-Series virtual machine running an Ubuntu 18.04 LTS Gen 2 image. 

If your virtual machine runs on Ubuntu 18.04 LTS Gen 2, you'll need to follow [installation instructions for Ubuntu 18.04](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install_oe_sdk-Ubuntu_18.04.md).


> [!NOTE]
> Intel SGX drivers as already part of the Ubuntu & Windows Azure Gallery Images. No special installation of the drivers is required. Optionally you can also update the existing drivers shipped in the images.

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources. 

Select the resource group for the virtual machine, then select **Delete**. Confirm the name of the resource group to finish deleting the resources.

## Next steps

In this quickstart, you deployed a confidential computing virtual machine, and installed the Open Enclave SDK. For more information about confidential computing virtual machines on Azure, see [Solutions on Virtual Machines](virtual-machine-solutions.md). 

Discover how you can build confidential computing applications, by continuing to the Open Enclave SDK samples on GitHub. 

> [!div class="nextstepaction"]
> [Building Open Enclave SDK Samples](https://github.com/openenclave/openenclave/blob/master/samples/README.md)
