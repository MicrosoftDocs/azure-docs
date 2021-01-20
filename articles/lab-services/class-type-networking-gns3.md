---
title: Set up a Networking lab with Azure Lab Services and GNS3 | Microsoft Docs
description: Learn how to set up a lab using Azure Lab Services to teach networking with GNS3. 
ms.topic: article
ms.date: 01/19/2021
---

# Set up a lab to teach a networking class 
This article shows you how to set up a class that focuses on allowing students to emulate, configure, test, and troubleshoot virtual and real networks using [GNS3](https://www.gns3.com/) software. 

This article has two main sections. The first section covers how to create the classroom lab. The second section covers how to create the template machine with nested virtualization enabled and with GNS3 installed and configured.

## Lab configuration
To set up this lab, you need an Azure subscription to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can either create a new lab account in Azure Lab Services or use an existing account. See the following tutorial for creating a new lab account: [Tutorial to setup a lab account](tutorial-setup-lab-account.md).

Follow [this tutorial](tutorial-setup-classroom-lab.md) to create a new lab and then apply the following settings:

| Virtual machine size | Image |
| -------------------- | ----- | 
| Large (Nested Virtualization) | Windows 10 Pro, Version 1909 |

## Template machine 

After the template machine is created, start the machine and connect to it to complete the following three major tasks. 
 
1. Prepare the template machine for nested virtualization.
2. Install GNS3.
3. Create GNS3 VM.
4. Configure GNS3 to use Windows Hyper-V VM.
5. Add appropriate appliances.


### Prepare template machine for nested virtualization
Follow instructions in [this article](how-to-enable-nested-virtualization-template-vm.md) to prepare your template virtual machine for nested virtualization. 

### Install GNS3
Follow the instructions for [install GNS3 on Windows](https://docs.gns3.com/docs/getting-started/installation/windows)  Make sure to include the GNS3 VM in th component dialog.

![SelectGNS3vm](./media/class-type-networking-gns3/gns3-select-vm.png)

In the VM dialog select the Hyper-V option.

![SelectHyperV](./media/class-type-networking-gns3/gns3-vm-hyperv.png)

  This will download the PowerShell script to create the GNS3 VM in the Hyper-V manager. Once the setup is complete, don't start GNS3.

### Create GNS3 VM
Once the setup has completed, a zip file "GNS3.VM.Hyper-V.2.2.17.zip" is downloaded to the machine containing the drives and the Powershell script to create the Hyper-V vm.
- **Extract all** on the GNS3.VM.Hyper-V.2.2.17.zip.  This will extract out the drives and the Powershell script to create the VM.
- **Run with Powershell** on the "create-vm.ps1" Powershell script.
- An Execution Policy Change request may show up. Enter "Y" to execute the script.

![PSExecutionPolicy](./media/class-type-networking-gns3/Powershell-ExecutionPolicyChange.png)

- Once the script has completed, you can confirm the VM "GNS3 VM" has been created in the Hyper-V Manager.

### Configure GNS3 to use Hyper-V Vm
Now that GNS3 is installed and the GNS3 VM is added, start up GNS3 to link the two together.  The [GNS3 Setup wizard will start automatically.](https://docs.gns3.com/docs/getting-started/setup-wizard-gns3-vm#local-gns3-vm-setup-wizard).  
- Use the **Run appliances from virtual machine.** option.  Use the defaults for the rest of the wizard until you hit the "VMware vmrun tool cannot be found." error.

![VMWareError](./media/class-type-networking-gns3/gns3-VMware-vmruntool-notfound.png)

- Choose **Ok**, and **Cancel** out of the wizard.
- To complete the connection to the Hyper-V vm, open the **Edit** -> **Preferences** -> **GNS3 VM** and select **Enable the GNS3 VM** and select the **Hyper-V** option.
 
![EnableGNS3VMs](./media/class-type-networking-gns3/gns3-preference-vm.png)

### Add appropriate appliances
At this point you'll want to add the appropriate [appliances for the class.](https://docs.gns3.com/docs/using-gns3/beginners/install-from-marketplace)

## Cost  
If you would like to estimate the cost of this lab, you can use the following example: 
 
For a class of 25 students with 20 hours of scheduled class time and 10 hours of quota for homework or assignments, the price for the lab would be: 

25 students * (20 + 10) hours * 84 Lab Units * 0.01 USD per hour = 630 USD. 

For more information on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Conclusion
This article walked you through the steps to create a lab for network configuration using GNS3.

## Next steps
Next steps are common to setting up any lab:

- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab) 
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users).