---
title: Connect to your Linux virtual machines
description: Learn how to connect to your Linux virtual machine in a lab (Azure DevTest Labs)
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/17/2020
ms.custom: UpdateFrequency2
---

# Connect to a Linux VM in your lab (Azure DevTest Labs)
This article shows you how to connect to Linux VM in your lab. 

## Connect to a Linux VM
1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, search for and select **DevTest Labs**. 

    :::image type="content" source="./media/connect-linux-virtual-machine/search-select.png" alt-text="Search for and select DevTest Labs":::    
1. From the list of labs, select your **lab**.

    :::image type="content" source="./media/connect-linux-virtual-machine/select-lab.png" alt-text="Select your lab":::            
1. On the home page for your lab, select your Linux VM from the **My virtual machines** list. 

    :::image type="content" source="./media/connect-linux-virtual-machine/select-linux-vm.png" alt-text="Select your Linux VM":::        
5. On the **Overview** page, you can see the fully qualified domain name (FQDN) or IP address of the VM. You can also see the port as shown in the following image.

    :::image type="content" source="./media/connect-linux-virtual-machine/vm-overview.png" alt-text="Fully qualified domain name for the VM":::    

    Notice that **Connect** button is grayed even though the VM is started. That's by design.
6.  Use SSH to connect to your Linux VM. The following example connects to the VM with FQDN `mydtl07172452621450000.eastus.cloudapp.azure.com`, with the username of `vmuser` and port `51637`. Enter the password for the user to connect to the VM. 

    ```bash
    ssh vmuser@mydtl07172452621450000.eastus.cloudapp.azure.com -p 51637
    ```

    You can use tools such as [Putty](https://www.putty.org/) or any other SSH client to connect to the VM. 

    After you connect using SSH, you can install and configure a desktop environment ([xfce](https://www.xfce.org)) and remote desktop ([xrdp](http://www.xrdp.org/)).  For detailed information, see [Install and configure Remote Desktop to connect to a Linux VM in Azure](../virtual-machines/linux/use-remote-desktop.md). 

## Next Steps
[How to: connect to a Windows VM](connect-windows-virtual-machine.md)
