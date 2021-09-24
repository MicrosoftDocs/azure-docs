---
title: Manage VMware VMs in Azure through Arc enabled VMware vSphere.
description: In this Section, we will view the operations that you can perform on VMware VMs and install Log Analytics agent.
ms.topic: how-to 
ms.date: 08/20/2021

---

# Manage VMware VMs in Azure through Arc enabled VMware vSphere

You can perform various operations on the VMware virtual machines that are enabled by Azure Arc, such as:

- Start, stop and restart a virtual machine.

- Control access and add Azure tags.

- Add, remove and update Network interfaces.

- Add, remove and update disks and update VM size (CPU cores, memory).

- Enable guest management.

- Install extensions (guest management is a prerequisite).

![VMware virtual machine operations](../docs/media/manage-vms.png)

Enabling guest management brings you the capability of installing various VM extensions. Using extensions you can leverage various Azure management services like Azure Policy, Security Center, Azure Monitor. You can refer to [this](https://docs.microsoft.com/en-us/azure/azure-arc/servers/manage-vm-extensions) document for benefits and capabilities of VM extensions.

## Supported extensions and managememnt services


The following extensions are currently supported in Arc enabled VMware VMs: 

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


## Installing an extension

### Prerequisite

The guest management needs to be enabled on the VMware virtual machine before you can install an extension on it. You can enable guest managemement by following these steps:

1. Go to [Azure portal](https://aka.ms/AzureArcVM).
2. Find the VMware VM that you want to check for guest management and install extensions on. Click on the name of the VM.
3. Click on **Configuration** blade for a Vmware VM.
4. If **Enable guest management** is ticked, guest management is enabled. 
If not, enable guest management by ticking the check box and providing the administrator username and password. On Linux, by using the root account, and on Windows, with an account that is a member of the Local Administrators group. Click on **Apply**.

> **Note** : Following are the conditions for enabling guest management on a VM:
>
>    1. Your target machine must be running a [supported operating system](https://docs.microsoft.com/en-us/azure/azure-arc/servers/agent-overview#supported-operating-systems).
>
>    2. Machine must be able to connects through the firewall to communicate over the Internet, make sure the URLs [listed](https://docs.microsoft.com/en-us/azure/azure-arc/servers/agent-overview#networking-configuration) are not blocked.
>
>    3. Machine must not be behind a proxy. It is not supported yet.
>
>    4. If you are using a linux VM, the account must not prompt for login on sudo commands. You can do this by following steps:</br>
>> a.  Login to the linux VM
>>
>> b. Open terminal and run the below command.
>>
>>  `sudo visudo`
>>
>> c.  Add the below line at the end of the file. Replace `<username>` with the appropriate user name.
>>
>> `<username> ALL=(ALL) NOPASSWD:ALL`
>
> If your VM template has these changes incorporated, you will not need to perform the steps for the VM created from that template. 

### Installation steps

1. Go to [Azure portal](https://aka.ms/AzureArcVM).
2. Find the VMware VM that you want to install extension on. Click on the name of the VM.
3. Navigate to **Extensions** blade and click on **Add**.
4. Select the extension you want to install.
5. Based on the extension, you will need to provide the details (like workspace Id and key for LogAnalytics extension).
6. Click on **Review + create**.

This will trigger a deployment and install the selected extension on the virtual machine. 

## Clean up

If you no longer need the VM, you can delete it.

1. Go to [private preview portal](https://aka.ms/AzureArcVM)

2. Find the VM you want to delete. Click on the name of the VM.

3. In the single VM view, click on Delete.

4. Confirm that you want to delete on the prompt.

>[!NOTE]
> This will also delete the VM in your VMware vCenter