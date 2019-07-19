---
title: Azure Serial Console for Linux | Microsoft Docs
description: Bi-Directional Serial Console for Azure Virtual Machines and Virtual Machine Scale Sets.
services: virtual-machines-linux
documentationcenter: ''
author: asinn826
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 5/1/2019
ms.author: alsin
---

# Azure Serial Console for Linux

The Serial Console in the Azure portal provides access to a text-based console for Linux virtual machines (VMs) and virtual machine scale set instances. This serial connection connects to the ttys0 serial port of the VM or virtual machine scale set instance, providing access to it independent of the network or operating system state. The serial console can only be accessed by using the Azure portal and is allowed only for those users who have an access role of Contributor or higher to the VM or virtual machine scale set.

Serial Console works in the same manner for VMs and virtual machine scale set instances. In this doc, all mentions to VMs will implicitly include virtual machine scale set instances unless otherwise stated.

For Serial Console documentation for Windows, see [Serial Console for Windows](../windows/serial-console.md).

> [!NOTE]
> The Serial Console is generally available in global Azure regions. It is not yet available in Azure government or Azure China clouds.


## Prerequisites

- Your VM or virtual machine scale set instance must use the resource management deployment model. Classic deployments aren't supported.

- Your account that uses serial console must have the [Virtual Machine Contributor role](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) for the VM and the [boot diagnostics](boot-diagnostics.md) storage account

- Your VM or virtual machine scale set instance must have a password-based user. You can create one with the [reset password](https://docs.microsoft.com/azure/virtual-machines/extensions/vmaccess#reset-password) function of the VM access extension. Select **Reset password** from the **Support + troubleshooting** section.

- Your VM or virtual machine scale set instance must have [boot diagnostics](boot-diagnostics.md) enabled.

    ![Boot diagnostics settings](./media/virtual-machines-serial-console/virtual-machine-serial-console-diagnostics-settings.png)

- For settings specific to Linux distributions, see [Serial console Linux distribution availability](#serial-console-linux-distribution-availability).

- Your VM or virtual machine scale set instance must be configured for serial output on `ttys0`. This is the default for Azure images, but you will want to double check this on custom images. Details [below](#custom-linux-images).


## Get started with the Serial Console
The Serial Console for VMs and virtual machine scale set is accessible only through the Azure portal:

### Serial Console for Virtual Machines
Serial Console for VMs is as straightforward as clicking on **Serial console** within the **Support + troubleshooting** section in the Azure portal.
  1. Open the [Azure portal](https://portal.azure.com).

  1. Navigate to **All resources** and select a Virtual Machine. The overview page for the VM opens.

  1. Scroll down to the **Support + troubleshooting** section and select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux Serial Console window](./media/virtual-machines-serial-console/virtual-machine-linux-serial-console-connect.gif)

### Serial Console for Virtual Machine Scale Sets
Serial Console is available on a per-instance basis for virtual machine scale sets. You will have to navigate to the individual instance of a virtual machine scale set before seeing the **Serial console** button. If your virtual machine scale set does not have boot diagnostics enabled, ensure you update your virtual machine scale set model to enable boot diagnostics, and then upgrade all instances to the new model in order to access serial console.
  1. Open the [Azure portal](https://portal.azure.com).

  1. Navigate to **All resources** and select a Virtual Machine Scale Set. The overview page for the virtual machine scale set opens.

  1. Navigate to **Instances**

  1. Select a virtual machine scale set instance

  1. From the **Support + troubleshooting** section, select **Serial console**. A new pane with the serial console opens and starts the connection.

     ![Linux virtual machine scale set Serial Console](./media/virtual-machines-serial-console/vmss-start-console.gif)


> [!NOTE]
> The serial console requires a local user with a configured password. VMs or virtual machine scale sets configured only with an SSH public key won't be able to sign in to the serial console. To create a local user with a password, use the [VMAccess Extension](https://docs.microsoft.com/azure/virtual-machines/linux/using-vmaccess-extension), which is available in the portal by selecting **Reset password** in the Azure portal, and create a local user with a password.
> You can also reset the administrator password in your account by [using GRUB to boot into single user mode](./serial-console-grub-single-user-mode.md).

## Serial Console Linux distribution availability
For the serial console to function properly, the guest operating system must be configured to read and write console messages to the serial port. Most [Endorsed Azure Linux distributions](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) have the serial console configured by default. Selecting **Serial console** in the **Support + troubleshooting** section of the Azure portal provides access to the serial console.

> [!NOTE]
> If you are not seeing anything in the serial console, make sure that boot diagnostics is enabled on your VM. Hitting **Enter** will often fix issues where nothing is showing up in the serial console.

Distribution      | Serial console access
:-----------|:---------------------
Red Hat Enterprise Linux    | Serial console access enabled by default.
CentOS      | Serial console access enabled by default.
Ubuntu      | Serial console access enabled by default.
CoreOS      | Serial console access enabled by default.
SUSE        | Newer SLES images available on Azure have serial console access enabled by default. If you're using older versions (10 or earlier) of SLES on Azure, see the [KB article](https://www.novell.com/support/kb/doc.php?id=3456486) to enable serial console.
Oracle Linux        | Serial console access enabled by default.

### Custom Linux images
To enable the serial console for your custom Linux VM image, enable console access in the file */etc/inittab* to run a terminal on `ttyS0`. For example: `S0:12345:respawn:/sbin/agetty -L 115200 console vt102`.

You will also want to add ttys0 as the destination for serial output. For more information on configuring a custom image to work with the serial console, see the general system requirements at [Create and upload a Linux VHD in Azure](https://aka.ms/createuploadvhd#general-linux-system-requirements).

If you're building a custom kernel, consider enabling these kernel flags: `CONFIG_SERIAL_8250=y` and `CONFIG_MAGIC_SYSRQ_SERIAL=y`. The configuration file is typically located in the */boot/* path. |

## Common scenarios for accessing the Serial Console

Scenario          | Actions in the Serial Console
:------------------|:-----------------------------------------
Broken *FSTAB* file | Press the **Enter** key to continue and use a text editor to fix the *FSTAB* file. You might need to be in single user mode to do so. For more information, see the serial console section of [How to fix fstab issues](https://support.microsoft.com/help/3206699/azure-linux-vm-cannot-start-because-of-fstab-errors) and [Use serial console to access GRUB and single user mode](serial-console-grub-single-user-mode.md).
Incorrect firewall rules |  If you have configured iptables to block SSH connectivity, you can use serial console to interact with your VM without needing SSH. More details can be found at the [iptables man page](https://linux.die.net/man/8/iptables).<br>Similarly, if your firewalld is blocking SSH access, you can access the VM through serial console and reconfigure firewalld. More details can be found in the [firewalld documentation](https://firewalld.org/documentation/).
Filesystem corruption/check | Please see the serial console section of [Azure Linux VM cannot start because of file system errors](https://support.microsoft.com/en-us/help/3213321/linux-recovery-cannot-ssh-to-linux-vm-due-to-file-system-errors-fsck) for more details on troubleshooting corrupted file systems using serial console.
SSH configuration issues | Access the serial console and change the settings. Serial console can be used regardless of the SSH configuration of a VM as it does not require the VM to have network connectivity to work. A troubleshooting guide is available at [Troubleshoot SSH connections to an Azure Linux VM that fails, errors out, or is refused](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/troubleshoot-ssh-connection). More details are available at [Detailed SSH troubleshooting steps for issues connecting to a Linux VM in Azure](./detailed-troubleshoot-ssh-connection.md)
Interacting with bootloader | Restart your VM from within the serial console blade to access GRUB on your Linux VM. For more details and distro-specific information, see [Use serial console to access GRUB and single user mode](serial-console-grub-single-user-mode.md).

## Disable the Serial Console
By default, all subscriptions have serial console access enabled. You can disable the serial console at either the subscription level or VM/virtual machine scale set level. Note that boot diagnostics must be enabled on a VM in order for serial console to work.

### VM/virtual machine scale set-level disable
The serial console can be disabled for a specific VM or virtual machine scale set by disabling the boot diagnostics setting. Turn off boot diagnostics from the Azure portal to disable the serial console for the VM or the virtual machine scale set. If you are using serial console on a virtual machine scale set, ensure you upgrade your virtual machine scale set instances to the latest model.

> [!NOTE]
> To enable or disable the serial console for a subscription, you must have write permissions to the subscription. These permissions include administrator or owner roles. Custom roles can also have write permissions.

### Subscription-level disable
The serial console can be disabled for an entire subscription through the [Disable Console REST API call](/rest/api/serialconsole/console/disableconsole). This action requires contributor level access or above to the subscription. You can use the **Try It** function available on this API documentation page to disable and enable the serial console for a subscription. Enter your subscription ID for **subscriptionId**, enter **default** for **default**, and then select **Run**. Azure CLI commands aren't yet available.

To reenable serial console for a subscription, use the [Enable Console REST API call](/rest/api/serialconsole/console/enableconsole).

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

## Serial console security

### Access security
Access to the serial console is limited to users who have an access role of [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) or higher to the virtual machine. If your Azure Active Directory tenant requires multi-factor authentication (MFA), then access to the serial console will also need MFA because the serial console's access is through the [Azure portal](https://portal.azure.com).

### Channel security
All data that is sent back and forth is encrypted on the wire.

### Audit logs
All access to the serial console is currently logged in the [boot diagnostics](https://docs.microsoft.com/azure/virtual-machines/linux/boot-diagnostics) logs of the virtual machine. Access to these logs are owned and controlled by the Azure virtual machine administrator.

> [!CAUTION]
> No access passwords for the console are logged. However, if commands run within the console contain or output passwords, secrets, user names, or any other form of personally identifiable information (PII), those will be written to the VM boot diagnostics logs. They will be written along with all other visible text, as part of the implementation of the serial console's scroll back function. These logs are circular and only individuals with read permissions to the diagnostics storage account have access to them. However, we recommend following the best practice of using the Remote Desktop for anything that may involve secrets and/or PII.

### Concurrent usage
If a user is connected to the serial console and another user successfully requests access to that same virtual machine, the first user will be disconnected and the second user connected to the same session.

> [!CAUTION]
> This means that a user who's disconnected won't be logged out. The ability to enforce a logout upon disconnect (by using SIGHUP or similar mechanism) is still on the roadmap. For Windows there is an automatic timeout enabled in Special Administrative Console (SAC); however, for Linux you can configure the terminal timeout setting. To do so, add `export TMOUT=600` in your *.bash_profile* or *.profile* file for the user you use to sign in to the console. This setting will time out the session after 10 minutes.

## Accessibility
Accessibility is a key focus for the Azure Serial Console. To that end, we've ensured that the serial console is fully accessible.

### Keyboard navigation
Use the **Tab** key on your keyboard to navigate in the serial console interface from the Azure portal. Your location will be highlighted on screen. To leave the focus of the serial console window, press **Ctrl**+**F6** on your keyboard.

### Use Serial Console with a screen reader
The serial console has screen reader support built in. Navigating around with a screen reader turned on will allow the alt text for the currently selected button to be read aloud by the screen reader.

## Errors
Because most errors are transient, retrying your connection can often fix them. The following table shows a list of errors and mitigations. These errors and mitigations apply for both VMs and virtual machine scale set instances.

Error                            |   Mitigation
:---------------------------------|:--------------------------------------------|
Unable to retrieve boot diagnostics settings for *&lt;VMNAME&gt;*. To use the serial console, ensure that boot diagnostics is enabled for this VM. | Ensure that the VM has [boot diagnostics](boot-diagnostics.md) enabled.
The VM is in a stopped deallocated state. Start the VM and retry the serial console connection. | The VM must be in a started state to access the serial console.
You do not have the required permissions to use this VM with the serial console. Ensure you have at least Virtual Machine Contributor role permissions.| The serial console access requires certain permissions. For more information, see [Prerequisites](#prerequisites).
Unable to determine the resource group for the boot diagnostics storage account *&lt;STORAGEACCOUNTNAME&gt;*. Verify that boot diagnostics is enabled for this VM and you have access to this storage account. | The serial console access requires certain permissions. For more information, see [Prerequisites](#prerequisites).
Web socket is closed or could not be opened. | You may need to whitelist `*.console.azure.com`. A more detailed but longer approach is to whitelist the [Microsoft Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653), which change fairly regularly.
A "Forbidden" response was encountered when accessing this VM's boot diagnostic storage account. | Ensure that boot diagnostics doesn't have an account firewall. An accessible boot diagnostic storage account is necessary for the serial console to function.

## Known issues
We're aware of some issues with the serial console. Here's a list of these issues and steps for mitigation. These issues and mitigations apply for both VMs and virtual machine scale set instances.

Issue                           |   Mitigation
:---------------------------------|:--------------------------------------------|
Pressing **Enter** after the connection banner does not cause a sign-in prompt to be displayed. | For more information, see [Hitting enter does nothing](https://github.com/Microsoft/azserialconsole/blob/master/Known_Issues/Hitting_enter_does_nothing.md). This issue can occur if you're running a custom VM, hardened appliance, or GRUB config that causes Linux to fail to connect to the serial port.
Serial console text only takes up a portion of the screen size (often after using a text editor). | Serial consoles do not support negotiating about window size ([RFC 1073](https://www.ietf.org/rfc/rfc1073.txt)), which means that there will be no SIGWINCH signal sent to update screen size and the VM will have no knowledge of your terminal's size. Install xterm or a similar utility to provide you with the `resize` command, and then run `resize`.
Pasting long strings doesn't work. | The serial console limits the length of strings pasted into the terminal to 2048 characters to prevent overloading the serial port bandwidth.
Serial console does not work with a storage account firewall. | Serial console by design cannot work with storage account firewalls enabled on the boot diagnostics storage account.
Serial console does not work with a storage account using Azure Data Lake Storage Gen2 with hierarchical namespaces. | This is a known issue with hierarchical namespaces. To mitigate, ensure that your VM's boot diagnostics storage account is not created using Azure Data Lake Storage Gen2. This option can only be set upon storage account creation. You may have to create a separate boot diagnostics storage account without Azure Data Lake Storage Gen2 enabled to mitigate this issue.
Erratic keyboard input in SLES BYOS images. Keyboard input is only sporadically recognized. | This is an issue with the Plymouth package. Plymouth should not be run in Azure as you don't need a splash screen and Plymouth interferes with the platform ability to use Serial Console. Remove Plymouth with `sudo zypper remove plymouth` and then reboot. Alternatively, modify the kernel line of your GRUB config by appending `plymouth.enable=0` to the end of the line. You can do this by [editing the boot entry at boot time](https://aka.ms/serialconsolegrub#single-user-mode-in-suse-sles), or by editing the GRUB_CMDLINE_LINUX line in `/etc/default/grub`, rebuilding GRUB with `grub2-mkconfig -o /boot/grub2/grub.cfg`,  and then rebooting.


## Frequently asked questions

**Q. How can I send feedback?**

A. Provide feedback by creating a GitHub issue at  https://aka.ms/serialconsolefeedback. Alternatively (less preferred), you can send feedback via azserialhelp@microsoft.com or in the virtual machine category of https://feedback.azure.com.

**Q. Does the serial console support copy/paste?**

A. Yes. Use **Ctrl**+**Shift**+**C** and **Ctrl**+**Shift**+**V** to copy and paste into the terminal.

**Q. Can I use serial console instead of an SSH connection?**

A. While this usage may seem technically possible, the serial console is intended to be used primarily as a troubleshooting tool in situations where connectivity via SSH isn't possible. We recommend against using the serial console as an SSH replacement for the following reasons:

- The serial console doesn't have as much bandwidth as SSH. Because it's a text-only connection, more GUI-heavy interactions are difficult.
- Serial console access is currently possible only by using a username and password. Because SSH keys are far more secure than username/password combinations, from a sign-in security perspective, we recommend SSH over serial console.

**Q. Who can enable or disable serial console for my subscription?**

A. To enable or disable the serial console at a subscription-wide level, you must have write permissions to the subscription. Roles that have write permission include administrator or owner roles. Custom roles can also have write permissions.

**Q. Who can access the serial console for my VM/virtual machine scale set?**

A. You must have the Virtual Machine Contributor role or higher for a VM or virtual machine scale set to access the serial console.

**Q. My serial console isn't displaying anything, what do I do?**

A. Your image is likely misconfigured for serial console access. For information about configuring your image to enable the serial console, see [Serial console Linux distribution availability](#serial-console-linux-distribution-availability).

**Q. Is the serial console available for virtual machine scale sets?**

A. Yes, it is! See [Serial Console for Virtual Machine Scale Sets](#serial-console-for-virtual-machine-scale-sets)

**Q. If I set up my VM or virtual machine scale set by using only SSH key authentication, can I still use the serial console to connect to my VM/virtual machine scale set instance?**

A. Yes. Because the serial console doesn't require SSH keys, you only need to set up a username/password combination. You can do so by selecting **Reset password** in the Azure portal and using those credentials to sign in to the serial console.

## Next steps
* Use the serial console to [access GRUB and single user mode](serial-console-grub-single-user-mode.md).
* Use the serial console for [NMI and SysRq calls](serial-console-nmi-sysrq.md).
* Learn how to use the serial console to [enable GRUB in various distros](https://blogs.msdn.microsoft.com/linuxonazure/2018/10/23/why-proactively-ensuring-you-have-access-to-grub-and-sysrq-in-your-linux-vm-could-save-you-lots-of-down-time/).
* The serial console is also available for [Windows VMs](../windows/serial-console.md).
* Learn more about [boot diagnostics](boot-diagnostics.md).

