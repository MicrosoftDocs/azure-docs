---
title: Resize a VM in a lab in Azure DevTest Labs | Microsoft Docs
description: Learn how to resize a virtual machine in Azure DevTest Labs
services: devtest-lab,virtual-machines,lab-services
documentationcenter: na
author: spelluru
manager: femila
editor: ''

ms.assetid: 8460f09e-482f-48ba-a57a-c95fe8afa001
ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/11/2018
ms.author: spelluru

---
# Resize a VM in a lab in Azure DevTest Labs
One of the great benefits of Azure virtual machines is the ability to change the size of a VM based on your CPU, network or disk performance needs. This feature is available for VMs in a lab in DevTest Labs now. It allows you to update the size of a VM according to your needs without having to create a VM every time the requirements change. The resize feature respects the lab policy for allowed virtual machine sizes in the lab. That is, you can resize VMs in a lab to one of the available sizes in your lab.

You can quickly and easily resize a virtual machine (VM) in  DevTest Labs by following the steps in the following procedure. 

## Steps to resize a VM in a lab in Azure DevTest Labs
1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).
1. Select **All Services**, and then select **DevTest Labs** from the list.
1. From the list of labs, select the lab that includes the VM  you want to restart.  
1. In the left panel, select **My Virtual Machines**. 
1. From the list of VMs, select a VM.
2. In the Virtual Machine page for your VM, select **Size** under **SETTINGS** in the left menu.
3. Browse and select new size for the VM, and click **Select**.     
1. Monitor the status of the resize operation by selecting the **Notifications** button (Bell icon) at the top right of the window.

## Next steps
* Once it is resized, start and reconnect to the VM by selecting **Start** and **Connect** on the its management pane.
