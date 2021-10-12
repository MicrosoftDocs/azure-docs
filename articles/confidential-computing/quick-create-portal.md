---
title: Quickstart - Create Intel SGX VM in the Azure portal 
description: Get started with your deployments by learning how to quickly create an Intel SGX VM in the Azure portal 
author: JBCook
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 11/1/2021
ms.author: JenCook
---


# Quickstart: Create Intel SGX VM in the Azure portal

This tutorial guides you through the process of deploying Intel SGX VMs using Azure portal. Otherwise, we recommend following [Azure Marketplace](quick-create-marketplace.md) templates.

## Prerequisites

If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/) before you begin.

> [!NOTE]
> Free trial accounts do not have access to the VMs in this tutorial. Please upgrade to a Pay-As-You-Go subscription.


## Sign in to Azure

1. Sign in to the [Azure Portal](https://portal.azure.com/).

1. At the top, select **Create a resource**.

1. On the left hand side pane, select, select **Compute**.

1. Select **Create Virtual Machine**.

    ![Deploy a VM](media/quick-create-portal/compute-virtual-machine.png)

## Configure an Intel SGX Virtual Machine

1. In the **Basics** tab, select your **Subscription** and **Resource Group**.

1. For **Virtual machine name**, enter a name for your new VM.

1. Type or select the following values:

   * **Region**: Select the Azure region that's right for you.

        > [!NOTE]
        > Intel SGX VMs run on specialized hardware in specific regions. For the latest regional availability, look for DCsv2-series or DCsv3/DCdsv3-series in [available regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

1. Configure the operating system image that you would like to use for your virtual machine.

    * **Choose Image**: For this tutorial, select Windows Server 2019 - Gen2. You may also select Ubuntu 20.04 LTS - Gen2, or Ubuntu 18.04 LTS - Gen2.
    
    * **Update to Generation 2**: Underneath Image, select **Configure VM generation**, in the fly out, you can select **Generation 2**, then Apply.
    
        ![image](https://user-images.githubusercontent.com/63871188/137002081-4879e3a9-f98b-4055-ba97-0f7aaac73f54.png)

1. Choose a virtual machine with Intel SGX capabilities in the size selector by choosing **change size**. In the virtual machine size selector, click **Clear all filters**. Choose **Add filter**, select **Family** for the filter type, and then select only **Confidential compute**.

    ![DCsv2-Series VMs](media/quick-create-portal/dcsv2-virtual-machines.png)

    > [!TIP]
    > You should see sizes **DC(number)s_v2**, **DC(number)s_v3** and **DC(number)ds_v3**. [Learn more](virtual-machine-solutions-sgx.md).

1. Fill in the following information:

   * **Authentication type**: Select **SSH public key** if you're creating a Linux VM. 

        > [!NOTE]
        > You have the choice of using an SSH public key or a Password for authentication. SSH is more secure. For instructions on how to generate an SSH key, see [Create SSH keys on Linux and Mac for Linux VMs in Azure](../virtual-machines/linux/mac-create-ssh-keys.md).

    * **Username**: Enter the Administrator name for the VM.

    * **SSH public key**: If applicable, enter your RSA public key.
    
    * **Password**: If applicable, enter your password for authentication.

    * **Public inbound ports**: Choose **Allow selected ports** and select **SSH (22)** and **HTTP (80)** in the **Select public inbound ports** list. If you're deploying a Windows VM, select **HTTP (80)** and **RDP (3389)**.  

    >[!Note]
    > Allowing RDP/SSH ports is not recommended for production deployments.  

     ![Inbound ports](media/quick-create-portal/inbound-port-virtual-machine.png)


1. Make changes in the **Disks** tab.

   * **DCsv2-series** supports **Standard SSD**, **Premium SSD** is supported across DC1, DC2 and DC4. 
   * **DCsv3 and DCdsv3-series** supports **Standard SSD**, **Premium SSD** and **Ultra Disk**

1. Make any changes you want to the settings in the following tabs or keep the default settings.

    * **Networking**
    * **Management**
    * **Guest config**
    * **Tags**

1. Select **Review + create**.

1. In the **Review + create** pane, select **Create**.

> [!NOTE]
> Proceed to the next section and continue with this tutorial if you deployed a Linux VM. If you deployed a Windows VM, [follow these steps to connect to your Windows VM](../virtual-machines/windows/connect-logon.md) and then [install the OE SDK on Windows](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install_oe_sdk-Windows.md).


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
> Intel SGX drivers as already part of the Ubuntu & Windows Azure Gallery Images. To ensure you are using the latest drivers, visit the [Intel SGX DCAP drivers list](https://01.org/intel-software-guard-extensions/downloads).

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all its related resources. 

Select the resource group for the virtual machine, then select **Delete**. Confirm the name of the resource group to finish deleting the resources.

## Next steps

In this quickstart, you deployed and connected to your Intel SGX VM. For more information, see [Solutions on Virtual Machines](virtual-machine-solutions-sgx.md). 

Discover how you can build confidential computing applications, by continuing to the Open Enclave SDK samples on GitHub. 

> [!div class="nextstepaction"]
> [Building Open Enclave SDK Samples](https://github.com/openenclave/openenclave/blob/master/samples/README.md)
