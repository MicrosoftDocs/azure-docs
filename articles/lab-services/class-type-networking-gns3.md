---
title: Set up a GNS3 networking lab
titleSuffix: Azure Lab Services
description: Learn how to set up a lab using Azure Lab Services to teach networking with GNS3. 
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 04/24/2023
---

# Set up a lab to teach a networking class with GNS3 in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to set up a class for emulating, configuring, testing, and troubleshooting networks using [GNS3](https://www.gns3.com/) software.

This article has two main sections. The first section covers how to create the lab. The second section covers how to create the [template machine](./classroom-labs-concepts.md#template-virtual-machine) with nested virtualization enabled and with GNS3 installed and configured.

## Prerequisites

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

## Lab configuration

[!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  Use the following settings when creating the lab.

| Lab settings | Value |
| ------------ | ------------------ |
| Virtual machine (VM) size | Medium (Nested Virtualization) |
| VM image | Windows 10 Pro, Version 1909 |

## Template machine configuration

[!INCLUDE [configure template vm](./includes/lab-services-class-type-template-vm.md)]

To configure the template VM, complete the following tasks:

1. Prepare the template machine for nested virtualization.
1. Install GNS3.
1. Create nested GNS3 VM in Hyper-V.
1. Configure GNS3 to use Windows Hyper-V VM.
1. Add appropriate appliances.
1. Publish the template.

### Prepare template machine for nested virtualization

To prepare the template virtual machine for nested virtualization, follow the detailed steps in [enable nested virtualization](how-to-enable-nested-virtualization-template-vm.md).

If you created a lab template VM with a non-admin account, add the non-admin account to the **Hyper-V Administrators** group.  For more information about using nested virtualization with a non-admin account, see [non-admin user best practices](concept-nested-virtualization-template-vm.md#non-admin-user).

### Install GNS3

1. Connect to the template VM by using remote desktop.

1. Follow the detailed instructions on the GNS3 website, to [install GNS3 on Windows](https://docs.gns3.com/docs/getting-started/installation/windows).

    1. Make sure to select **GNS3 VM** in the component dialog:

        :::image type="content" source="./media/class-type-networking-gns3/gns3-select-vm.png" alt-text="Screenshot that shows the Choose Components page in the GNS3 installation wizard, with the GNS3 VM option selected.":::

    1. On the **GNS3 VM** page, select the **Hyper-V** option:

        :::image type="content" source="./media/class-type-networking-gns3/gns3-vm-hyper-v.png" alt-text="Screenshot that shows the GNS3 VM page in the GNS3 installation wizard, with the Hyper-V option selected.":::

        When you select the Hyper-V option, the installer downloads the PowerShell script and VHD files to create the GNS3 VM in the Hyper-V manager.

    1. Continue the installation with the default values.

> [!IMPORTANT]
> After the setup completes, don't start GNS3.

### Create GNS3 VM

When the setup finishes, a zip file `GNS3.VM.Hyper-V.2.2.17.zip` is downloaded to the same folder as the installation file. The zip file contains the virtual disks and the PowerShell script to create the Hyper-V virtual machine.

To create the GNS 3 VM:

1. Connect to the template VM by using remote desktop.

1. Extract all files in the `GNS3.VM.Hyper-V.2.2.17.zip` file.  If the template VM has a non-admin account for lab users, extract the files in a location accessible to the non-admin account.

1. Right-select the `create-vm.ps1` PowerShell script, and then select **Run with PowerShell**.

1. When the `Execution Policy Change` request shows, enter **Y** to execute the script.

    :::image type="content" source="./media/class-type-networking-gns3/powershell-execution-policy-change.png" alt-text="Screenshot that shows the PowerShell command line, asking for an Execution Policy change.":::

1. After the script completes, confirm that the **GNS3 VM** virtual machine is available in Hyper-V Manager.

### Configure GNS3 to use Hyper-V VM

Now that you installed GNS3, and added the GNS3 VM, configure GNS 3 to use the Hyper-V virtual machine.

1. Connect to the template VM by using remote desktop.

1. Start GNS3. The [GNS3 Setup wizard](https://docs.gns3.com/docs/getting-started/setup-wizard-gns3-vm#local-gns3-vm-setup-wizard) starts automatically.

1. Select the **Run appliances from virtual machine** option, and select **Next**.

1. Use the default values in the following pages.

1. When you get the **VMware vmrun tool cannot be found** error, select **Ok**, and then **Cancel** out of the wizard.

    :::image type="content" source="./media/class-type-networking-gns3/gns3-vmware-vmrun-tool-not-found.png" alt-text="Screenshot that shows a VMware error message in the GNS3 Setup wizard.":::

1. To complete the connection to the Hyper-V VM, select **Edit** > **Preferences** > **GNS3 VM**.

1. Select **Enable the GNS3 VM**, and then select the **Hyper-V** option.

    :::image type="content" source="./media/class-type-networking-gns3/gns3-preference-vm.png" alt-text="Screenshot that shows the GNS3 VM preferences page, showing the GNS3 VM option enabled, and Hyper-V selected.":::

### Add appropriate appliances

Next, you can add appliances for the class. Follow the detailed steps from the GNS3 documentation to [install appliances from the GNS3 marketplace](https://docs.gns3.com/docs/using-gns3/beginners/install-from-marketplace).

If the template VM has a non-admin account for lab users, install the appliances to a location accessible to the non-admin account.  Optionally, you can set the preferences for the admin and non-admin user to look for appliances and projects in a location accessible by both users.

### Prepare to publish template

Now that you set up the template virtual machine, verify the following key points before you publish the template:

- Make sure that the GNS3 VM is shut down or turned off.  Publishing while the VM is still running, corrupts the virtual machine.
- Stop GNS3. Publishing while GNS3 is running can lead to unintended side effects.
- Clean up any installation files or other unnecessary files from the template VM.

>[!IMPORTANT]
>Publishing while the VM is still running, corrupts the template virtual machine and creates unusable lab virtual machines.

## Cost  

This section provides a cost estimate for running this class for 25 lab users. There are 20 hours of scheduled class time. Also, each user gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose is **Large (Nested Virtualization)**, which is 84 lab units.

- 25 lab users &times; (20 scheduled hours + 10 quota hours) &times; 84 lab units

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
