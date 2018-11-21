---
title: Azure virtual machine serial console for Linux | Microsoft Docs
description: Bi-Directional serial console for Azure virtual machines.
services: virtual-machines-linux
documentationcenter: ''
author: harijay
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 10/31/2018
ms.author: harijay
---

# Virtual machine serial console for Linux

The virtual machine (VM) serial console in the Azure portal provides access to a text-based console for Linux virtual machines. This serial connection connects to the COM1 serial port of the virtual machine, providing access to it, independent of the virtual machine's network or operating system state. Access to the serial console for a virtual machine can be done only by using the Azure portal. It's allowed only for those users who have an access role of Virtual Machine Contributor or higher to the virtual machine. 

For serial console documentation for Windows VMs, see [Virtual machine serial console for Windows](../windows/serial-console.md).

> [!NOTE] 
> The serial console for virtual machines is generally available in global Azure regions. It is not yet available in Azure government or Azure China clouds.


## Prerequisites 

- The VM in which you're accessing a serial console must use the resource management deployment model. Classic deployments aren't supported. 

- The VM in which you're accessing a serial console must have [boot diagnostics](boot-diagnostics.md) enabled. 

    ![Boot diagnostics settings](./media/virtual-machines-serial-console/virtual-machine-serial-console-diagnostics-settings.png)

- An account that uses a serial console must have the [Virtual Machine Contributor role](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) for the VM and the [boot diagnostics](boot-diagnostics.md) storage account: 

    - The VM in which you're accessing a serial console must have a password-based account. You can create one with the [reset password](https://docs.microsoft.com/azure/virtual-machines/extensions/vmaccess#reset-password) function of the VM access extension. Select **Reset password** from the **Support + troubleshooting** section. 

    - For settings specific to Linux distributions, see [Serial console Linux distribution availability](#serial-console-linux-distribution-availability).



## Get started with the serial console
The serial console for virtual machines is accessible only through the Azure portal:

  1. Open the [Azure portal](https://portal.azure.com).

  1. On the left menu, select **Virtual machines**.

  1. Select a VM in the list. The overview page for the VM opens.

  1. Scroll down to the **Support + troubleshooting** section and select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux serial console window](./media/virtual-machines-serial-console/virtual-machine-linux-serial-console-connect.gif)


> [!NOTE] 
> The serial console requires a local user with a configured password. VMs configured only with an SSH public key won't be able to sign in to the serial console. To create a local user with a password, use the [VMAccess Extension](https://docs.microsoft.com/azure/virtual-machines/linux/using-vmaccess-extension), which is available in the portal by selecting **Reset password** in the Azure portal, and create a local user with a password.
> You can also reset the administrator password in your account by [using GRUB to boot into single user mode](./serial-console-grub-single-user-mode.md).

## Serial console Linux distribution availability
For the serial console to function properly, the guest operating system must be configured to read and write console messages to the serial port. Most [Endorsed Azure Linux distributions](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) have the serial console configured by default. Selecting **Serial console** in the **Support + troubleshooting** section of the Azure portal provides access to the serial console. 

Distribution      | Serial console access
:-----------|:---------------------
Red Hat Enterprise Linux    | Serial console access enabled by default. 
CentOS      | Serial console access enabled by default. 
Ubuntu      | Serial console access enabled by default.
CoreOS      | Serial console access enabled by default.
SUSE        | Newer SLES images available on Azure have serial console access enabled by default. If you're using older versions (10 or earlier) of SLES on Azure, see the [KB article](https://www.novell.com/support/kb/doc.php?id=3456486) to enable serial console. 
Oracle Linux        | Serial console access enabled by default.
Custom Linux images     | To enable the serial console for your custom Linux VM image, enable console access in the file */etc/inittab* to run a terminal on `ttyS0`. For example: `S0:12345:respawn:/sbin/agetty -L 115200 console vt102`. For more information on properly creating custom images, see [Create and upload a Linux VHD in Azure](https://aka.ms/createuploadvhd). If you're building a custom kernel, consider enabling these kernel flags: `CONFIG_SERIAL_8250=y` and `CONFIG_MAGIC_SYSRQ_SERIAL=y`. The configuration file is typically located in the */boot/* path.

## Common scenarios for accessing the serial console 
Scenario          | Actions in the serial console                
:------------------|:-----------------------------------------
Broken *FSTAB* file | Press the **Enter** key to continue and use a text editor to fix the *FSTAB* file. You might need to be in single user mode to do so. For more information, see [How to fix fstab issues](https://support.microsoft.com/help/3206699/azure-linux-vm-cannot-start-because-of-fstab-errors) and [Use serial console to access GRUB and single user mode](serial-console-grub-single-user-mode.md).
Incorrect firewall rules | Access the serial console and fix iptables. 
Filesystem corruption/check | Access the serial console and recover the filesystem. 
SSH/RDP configuration issues | Access the serial console and change the settings. 
Network lock down system| Access the serial console from the Azure portal to manage the system. 
Interacting with bootloader | Access GRUB from the serial console. For more information, see [Use serial console to access GRUB and single user mode](serial-console-grub-single-user-mode.md). 

## Disable the serial console
By default, all subscriptions have serial console access enabled for all VMs. You can disable the serial console at either the subscription level or VM level.

> [!NOTE] 
> To enable or disable the serial console for a subscription, you must have write permissions to the subscription. These permissions include administrator or owner roles. Custom roles can also have write permissions.

### Subscription-level disable
The serial console can be disabled for an entire subscription through the [Disable Console REST API call](/rest/api/serialconsole/console/disableconsole). You can use the **Try It** function available on this API documentation page to disable and enable the serial console for a subscription. Enter your subscription ID for **subscriptionId**, enter **default** for **default**, and then select **Run**. Azure CLI commands aren't yet available.

![REST API Try It](./media/virtual-machines-serial-console/virtual-machine-serial-console-rest-api-try-it.png)

Alternatively, you can use the following set of bash commands in Cloud Shell to disable, enable, and view the disabled status of the serial console for a subscription: 

* To get the disabled status of the serial console for a subscription:
    ```azurecli-interactive
    $ export ACCESSTOKEN=($(az account get-access-token --output=json | jq .accessToken | tr -d '"')) 

    $ export SUBSCRIPTION_ID=$(az account show --output=json | jq .id -r)

    $ curl "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.SerialConsole/consoleServices/default?api-version=2018-05-01" -H "Authorization: Bearer $ACCESSTOKEN" -H "Content-Type: application/json" -H "Accept: application/json" -s | jq .properties
    ```
* To disable the serial console for a subscription:
    ```azurecli-interactive
    $ export ACCESSTOKEN=($(az account get-access-token --output=json | jq .accessToken | tr -d '"')) 

    $ export SUBSCRIPTION_ID=$(az account show --output=json | jq .id -r)

    $ curl -X POST "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.SerialConsole/consoleServices/default/disableConsole?api-version=2018-05-01" -H "Authorization: Bearer $ACCESSTOKEN" -H "Content-Type: application/json" -H "Accept: application/json" -s -H "Content-Length: 0"
    ```
* To enable the serial console for a subscription:
    ```azurecli-interactive
    $ export ACCESSTOKEN=($(az account get-access-token --output=json | jq .accessToken | tr -d '"')) 

    $ export SUBSCRIPTION_ID=$(az account show --output=json | jq .id -r)

    $ curl -X POST "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/providers/Microsoft.SerialConsole/consoleServices/default/enableConsole?api-version=2018-05-01" -H "Authorization: Bearer $ACCESSTOKEN" -H "Content-Type: application/json" -H "Accept: application/json" -s -H "Content-Length: 0"
    ```

### VM-level disable
The serial console can be disabled for a specific VM by disabling that VM's boot diagnostics setting. Turn off boot diagnostics from the Azure portal to disable the serial console for the VM.

## Serial console security 

### Access security 
Access to the serial console is limited to users who have an access role of [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) or higher to the virtual machine. If your Azure Active Directory tenant requires multi-factor authentication (MFA), then access to the serial console will also need MFA because the serial console's access is through the [Azure portal](https://portal.azure.com).

### Channel security
All data that is sent back and forth is encrypted on the wire.

### Audit logs
All access to the serial console is currently logged in the [boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/linux/boot-diagnostics) logs of the virtual machine. Access to these logs are owned and controlled by the Azure virtual machine administrator.  

>[!CAUTION] 
No access passwords for the console are logged. However, if commands run within the console contain or output passwords, secrets, user names, or any other form of personally identifiable information (PII), those will be written to the VM boot diagnostics logs. They will be written along with all other visible text, as part of the implementation of the serial console's scroll back function. These logs are circular and only individuals with read permissions to the diagnostics storage account have access to them. However, we recommend following the best practice of using the Remote Desktop for anything that may involve secrets and/or PII. 

### Concurrent usage
If a user is connected to the serial console and another user successfully requests access to that same virtual machine, the first user will be disconnected and the second user connected to the same session.

>[!CAUTION] 
This means that a user who's disconnected won't be logged out. The ability to enforce a logout upon disconnect (by using SIGHUP or similar mechanism) is still in the roadmap. For Windows there is an automatic timeout enabled in Special Administrative Console (SAC); however, for Linux you can configure the terminal timeout setting. To do so, add `export TMOUT=600` in your *.bash_profile* or *.profile* file for the user you use to sign in to the console. This setting will time out the session after 10 minutes.

## Accessibility
Accessibility is a key focus for the Azure serial console. To that end, we've ensured that the serial console is fully accessible.

### Keyboard navigation
Use the **Tab** key on your keyboard to navigate in the serial console interface from the Azure portal. Your location will be highlighted on screen. To leave the focus of the serial console window, press **Ctrl**+**F6** on your keyboard.

### Use the serial console with a screen reader
The serial console has screen reader support built in. Navigating around with a screen reader turned on will allow the alt text for the currently selected button to be read aloud by the screen reader.

## Errors
Because most errors are transient, retrying your connection can often fix them. The following table shows a list of errors and mitigations.

Error                            |   Mitigation 
:---------------------------------|:--------------------------------------------|
Unable to retrieve boot diagnostics settings for *&lt;VMNAME&gt;*. To use the serial console, ensure that boot diagnostics is enabled for this VM. | Ensure that the VM has [boot diagnostics](boot-diagnostics.md) enabled. 
The VM is in a stopped deallocated state. Start the VM and retry the serial console connection. | The VM must be in a started state to access the serial console.
You do not have the required permissions to use this VM with the serial console. Ensure you have at least Virtual Machine Contributor role permissions.| The serial console access requires certain permissions. For more information, see [Prerequisites](#prerequisites).
Unable to determine the resource group for the boot diagnostics storage account *&lt;STORAGEACCOUNTNAME&gt;*. Verify that boot diagnostics is enabled for this VM and you have access to this storage account. | The serial console access requires certain permissions. For more information, see [Prerequisites](#prerequisites).
Web socket is closed or could not be opened. | You may need to whitelist `*.console.azure.com`. A more detailed but longer approach is to whitelist the [Microsoft Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which change fairly regularly.
A "Forbidden" response was encountered when accessing this VM's boot diagnostic storage account. | Ensure that boot diagnostics doesn't have an account firewall. An accessible boot diagnostic storage account is necessary for the serial console to function.

## Known issues 
We're aware of some issues with the serial console. Here's a list of these issues and steps for mitigation.

Issue                           |   Mitigation 
:---------------------------------|:--------------------------------------------|
Pressing **Enter** after the connection banner does not cause a sign-in prompt to be displayed. | For more information, see [Hitting enter does nothing](https://github.com/Microsoft/azserialconsole/blob/master/Known_Issues/Hitting_enter_does_nothing.md). This issue can occur if you're running a custom VM, hardened appliance, or GRUB config that causes Linux to fail to properly connect to the serial port.
Serial console text only takes up a portion of the screen size (often after using a text editor). | Serial consoles do not support negotiating about window size ([RFC 1073](https://www.ietf.org/rfc/rfc1073.txt)), which means that there will be no SIGWINCH signal sent to update screen size and the VM will have no knowledge of your terminal's size. Install xterm or a similar utility to provide you with the `resize` command, and then run `resize`.
Pasting long strings doesn't work. | The serial console limits the length of strings pasted into the terminal to 2048 characters to prevent overloading the serial port bandwidth.


## Frequently asked questions 

**Q. How can I send feedback?**

A. Provide feedback by creating a GitHub issue at  https://aka.ms/serialconsolefeedback. Alternatively (less preferred), you can send feedback via azserialhelp@microsoft.com or in the virtual machine category of http://feedback.azure.com.

**Q. Does the serial console support copy/paste?**

A. Yes. Use **Ctrl**+**Shift**+**C** and **Ctrl**+**Shift**+**V** to copy and paste into the terminal.

**Q. Can I use serial console instead of an SSH connection?**

A. While this usage may seem technically possible, the serial console is intended to be used primarily as a troubleshooting tool in situations where connectivity via SSH isn't possible. We recommend against using the serial console as an SSH replacement for the following reasons:

- The serial console doesn't have as much bandwidth as SSH. Because it's a text-only connection, more GUI-heavy interactions are difficult.
- Serial console access is currently possible only by using a username and password. Because SSH keys are far more secure than username/password combinations, from a sign-in security perspective, we recommend SSH over serial console.

**Q. Who can enable or disable serial console for my subscription?**

A. To enable or disable the serial console at a subscription-wide level, you must have write permissions to the subscription. Roles that have write permission include administrator or owner roles. Custom roles can also have write permissions.

**Q. Who can access the serial console for my VM?**

A. You must have the Virtual Machine Contributor role or higher for a VM to access the VM's serial console. 

**Q. My serial console isn't displaying anything, what do I do?**

A. Your image is likely misconfigured for serial console access. For information about configuring your image to enable the serial console, see [Serial console Linux distribution availability](#serial-console-linux-distribution-availability).

**Q. Is the serial console available for virtual machine scale sets?**

A. At this time, access to the serial console for virtual machine scale set instances isn't supported.

**Q. If I set up my VM by using only SSH key authentication, can I still use the serial console to connect to my VM?**

A. Yes. Because the serial console doesn't require SSH keys, you only need to set up a username/password combination. You can do so by selecting **Reset password** in the Azure portal and using those credentials to sign in to the serial console.

## Next steps
* Use the serial console to [access GRUB and single user mode](serial-console-grub-single-user-mode.md).
* Use the serial console for [NMI and SysRq calls](serial-console-nmi-sysrq.md).
* Learn how to use the serial console to [enable GRUB in various distros](https://blogs.msdn.microsoft.com/linuxonazure/2018/10/23/why-proactively-ensuring-you-have-access-to-grub-and-sysrq-in-your-linux-vm-could-save-you-lots-of-down-time/).
* The serial console is also available for [Windows VMs](../windows/serial-console.md).
* Learn more about [boot diagnostics](boot-diagnostics.md).

