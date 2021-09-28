---
title: Manage VMware virtual machines Azure Arc
description: Learn how to view the operations that you can perform on VMware virtual machines and install the Log Analytics agent.
ms.topic: how-to 
ms.date: 09/28/2021

---

# Manage VMware VMs in Azure through Arc enabled VMware vSphere

In this article, you'll install extensions supported in Arc enabled VMware virtual machines (VMs). The extensions can leverage various Azure management services like Azure Policy, Azure Security Center, and Azure Monitor. For more information, such as benefits and capabilities, see [VM extension management with Azure Arc-enabled servers](../servers/manage-vm-extensions.md).

You can perform various operations on the VMware VMs that are enabled by Azure Arc, such as:

- Start, stop and restart a VM

- Control access and add Azure tags

- Add, remove and update network interfaces

- Add, remove and update disks and update VM size (CPU cores, memory)

- Enable guest management

- Install extensions (guest management enabled is required)


:::image type="content" source="media/manage-vms.png" alt-text="Screenshot showing the VMware virtual machine operations.":::



## Supported extensions and management services


### Windows extensions

|Extension |Publisher |Type |
|----------|----------|-----|
|Custom Script extension |Microsoft.Compute | CustomScriptExtension |
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |MicrosoftMonitoringAgent |


### Linux extensions


|Extension |Publisher |Type |
|----------|----------|-----|
|Custom Script extension |Microsoft.Azure.Extensions |CustomScript |
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |OmsAgentForLinux |



## Enable guest management

Before you can install an extension, you must enable guest management on the VMware VM.  

1. Make sure your target machine is:

   - Running a [supported operating system](../servers/agent-overview.md#supported-operating-systems).

   - Able to connect through the firewall to communicate over the internet and these [URLs](../servers/agent-overview.md#networking-configuration) aren't blocked.    
   
   - Not behind a proxy (it's not supported).

   >[!NOTE]
   >If you're using a Linux VM, the account must not prompt for login on sudo commands.  To override the prompt, from a terminal, run `sudo visudo` and add `<username> ALL=(ALL) NOPASSWD:ALL` to the end of the file.  Make sure to replace `<username>`.
   >
   >If your VM template has these changes incorporated, you won't need to do thiss for the VM created from that template. 

1. From your browser, go to the [Azure portal](https://aka.ms/AzureArcVM).

2. Search for and select the VMware VM and select **Configuration**.

4. Select **Enable guest management** and provide the administrator username and password to enable guest management.  Then select **Apply**.

   For Linux, use the root account, and for Windows, use an account that is a member of the Local Administrators group. 




## Install the LogAnalytics extension

1. From your browser, go to the [Azure portal](https://aka.ms/AzureArcVM).

1. Search for and select the VMware VM that you want to install extension.

1. Navigate to the **Extensions** blade and select **Add**.

1. Select the extension you want to install. Based on the extension, you'll need to provide the details, such as the workspace ID and key for LogAnalytics extension. Then select **Review + create**.

This triggers a deployment and installs the selected extension on the selected VM. 



## Clean up

If you no longer need the VM, you can delete it.

1. From your browser, go to the [private preview portal](https://aka.ms/AzureArcVM)

2. Search for and select the VM you want to delete. 

3. In the single VM view, select on **Delete**.

4. When prompted, confirm that you want to delete it.

>[!NOTE]
>This also deletes the VM in your VMware vCenter.