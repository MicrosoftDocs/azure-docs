---
title: 'Add a new VM to Azure Bastion host  | Microsoft Docs'
description: In this article, learn how to create a new VM that uses Azure Bastion
services: bastion
author: jemace

ms.service: bastion
ms.topic: conceptual
ms.date: 01/16/2019
ms.author: jemace
# Customer intent: I have an existing Bastion host and I'm creating a new VM that I'd like to utilize the Bastion host

---

# Create a new VM that will utilize your existing Azure Bastion host

This article shows you how to create a new VM that will utilize your existing Bastion host. 
## Prerequisites
-  First you must [create a bastion host](https://docs.microsoft.com/en-us/azure/bastion/bastion-create-host-portal).
- The virtual network for the Bastion host must have a subnet to hold VMs (this will be in addition to the AzureBastionSubnet required for the Bastion host). 


## <a name="createvm"></a>Create a new VM that utilizes your Bastion host

This section helps you create a new VM that will use your Azure Bastion resource from the Azure portal.

### Create a virtual machine

1. On the Azure portal menu or from the **Home** page, select **Create a resource**. The **New** window appears.
2. Select **Compute** and then select **Windows Server 2016 Datacenter** in the **Popular** list. The **Create a virtual machine** page appears.<br>Azure Bastion will work with any virtual machine, in this example, you use a Windows Server 2016 Datacenter.
3. Enter these values in the **Basics** tab for the following virtual machine settings:

    - **Resource group**: Select **myResourceGroupAG** for the resource group name.
    - **Virtual machine name**: Enter *myVM* for the name of the virtual machine.
    - **Region**: Choose the region where you've deployed your Bastion host.
    - **Username**: Enter *azureuser* for the administrator user name.
    - **Password**: Enter *Azure123456!* for the administrator password.
    - **Select inbound ports**: Check *HTTPS (443)* to allow the Bastion host to communicate with the VM.
4. Accept the other defaults and then select **Next: Disks**.  
5. Accept the **Disks** tab defaults and then select **Next: Networking**.
6. On the **Networking** tab, choose your Bastion virtual network for the **Virtual network** and the **Subnet** is set to the subnet you've created for your VMs. Accept the other defaults and then select **Next: Management**.
7. On the **Management** tab, set **Boot diagnostics** to **Off**. Accept the other defaults and then select **Review + create**.
8. On the **Review + create** tab, review the settings, correct any validation errors, and then select **Create**.
9. Wait for the virtual machine creation to complete before continuing.

## <a name="connectvm"></a>Connect to your new VM using Bastion


1. Open the [Azure portal](https://portal.azure.com). Go to your virtual machine, then click **Connect**.

   ![VM Connect](https://docs.microsoft.com/en-us/azure/bastion/media/bastion-create-host-portal/vmsettings.png)
1. On the right sidebar, click **Bastion**, then **Use Bastion**.

   ![Bastion](https://docs.microsoft.com/en-us/azure/bastion/media/bastion-create-host-portal/vmbastion.png)


## Next steps

Read the [Bastion FAQ](bastion-faq.md)


[Create a bastion host](https://docs.microsoft.com/en-us/azure/bastion/bastion-create-host-portal)