---
title: Connect to your Windows virtual machines
description: Learn how to connect to your Windows virtual machine in a lab (Azure DevTest Labs)
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 07/17/2020
ms.custom: UpdateFrequency2
---

# Connect to a Windows VM in your lab (Azure DevTest Labs)
This article shows you how to connect to a Windows VM in your lab. 

## Connect to a Windows VM
1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the search bar, search for and select **DevTest Labs**. 

    :::image type="content" source="./media/connect-windows-virtual-machine/search-select.png" alt-text="Search for and select DevTest Labs":::    
1. From the list of labs, select your **lab**.

    :::image type="content" source="./media/connect-windows-virtual-machine/select-lab.png" alt-text="Select your lab":::            
1. On the home page for your lab, select your Windows VM from the **My virtual machines** list. 

    :::image type="content" source="./media/connect-windows-virtual-machine/select-windows-vm.png" alt-text="Select your Windows VM":::                
1. On the **Virtual machine** page for your VM, select **Connect** on the toolbar. If the VM is stopped, select **Start** first to start the VM.

    :::image type="content" source="./media/connect-windows-virtual-machine/select-connect.png" alt-text="Select connect on the toolbar":::                    
1. If you're using the Edge browser, you see the link to the **downloaded RDP file** at the bottom of the browser. 

    :::image type="content" source="./media/connect-windows-virtual-machine/rdp-download.png" alt-text="RDP downloaded":::                        
1. Open the RDP file, and enter your VM credentials that you typed when creating the VM. You should be connected to the Windows VM now. 

## Next Steps
[How to: connect to a Linux VM](connect-linux-virtual-machine.md)
