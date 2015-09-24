    <properties 
	pageTitle="Add a VM with artifacts to a DevTest Lab | Microsoft Azure" 
	description="Create a new virtual machine with Artifacts in DevTest Lab." 
	services="visual-studio-online" 
	documentationCenter="na" 
	authors="patshea123" 
	manager="douge" 
	editor="tglee"/>
  
<tags 
	ms.service="visual-studio-online" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="get-started-article" 
	ms.date="09/04/2015" 
	ms.author="patshea"/>

# Add a VM with artifacts to an Azure DevTest Lab



## Overview

## Adding a VM with artifacts

1. On the home blade of the lab, choose **Add**.  
    ![DevTest lab home blade](./media/devtest-lab-add-vm-with-artifacts/devtestlab-home-blade-add-vm.png)

1. On the **Lab VM** blade, enter a name for the new virtual machine in the **Lab VM Name** text box.

1.  Choose **Base / Configure required settings** and select a base image for the VM.
    ![Enter the VM name and choose a base image](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-lab-vm-blade-1.png)  
    **LbVM** expands to include the **User Name** and **Password** items.  
    ![Expanded Lab VM blade](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-lab-vm-blade-2.png)

1. Enter a **User Name** that will granted administrator privileges on the virtual machine.
1. Enter a **Password** for the **User Name** principal.
1. Choose **VM Size** and select one of the pre-defined items that specify the processor cores, the size of RAM, and the size of the hard drive of the virtual machine to create.
1. Choose **Artifacts** and select and configure the artifacts that you want to add to the base image.  
    See [Selecting and configuring an artifact](#configuring-an-artifact)
1. Choose **Create** add the specified VM to the lab.

## Selecting and configuring an artifact

After you choose **Artifacts** on the **Lab VM** blade, you can add one or more artifacts from the **Add Artifacts** blade.
![Add Artifacts blade](./media/devtest-lab-add-vm-with-artifacts/devtestlab-add-artifact-blade.png)

The **Add Artifacts** list contains artifacts from the Public




