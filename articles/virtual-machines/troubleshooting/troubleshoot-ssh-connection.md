---
title: Troubleshoot SSH connection issues to an Azure VM | Microsoft Docs
description: How to troubleshoot issues such as 'SSH connection failed' or 'SSH connection refused' for an Azure VM running Linux.
keywords: ssh connection refused, ssh error, azure ssh, SSH connection failed
services: virtual-machines-linux
documentationcenter: ''
author: genlin
manager: dcscontentpm
tags: top-support-issue,azure-service-management,azure-resource-manager

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: troubleshooting
ms.date: 05/30/2017
ms.author: genli

---
# Troubleshoot SSH connections to an Azure Linux VM that fails, errors out, or is refused
This article helps you find and correct the problems that occur due to Secure Shell (SSH) errors, SSH connection failures, or SSH is refused when you try to connect to a Linux virtual machine (VM). You can use the Azure portal, Azure CLI, or VM Access Extension for Linux to troubleshoot and resolve connection problems.


If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/). Alternatively, you can file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get support**. For information about using Azure Support, read the [Microsoft Azure support FAQ](https://azure.microsoft.com/support/faq/).

## Quick troubleshooting steps
After each troubleshooting step, try reconnecting to the VM.

1. [Reset the SSH configuration](#reset-config).
2. [Reset the credentials](#reset-credentials) for the user.
3. Verify the [network security group](../../virtual-network/security-overview.md) rules permit SSH traffic.
   * Ensure that a [Network Security Group rule](#security-rules) exists to permit SSH traffic (by default, TCP port 22).
   * You cannot use port redirection / mapping without using an Azure load balancer.
4. Check the [VM resource health](../../resource-health/resource-health-overview.md).
   * Ensure that the VM reports as being healthy.
   * If you have [boot diagnostics enabled](boot-diagnostics.md), verify the VM is not reporting boot errors in the logs.
5. [Restart the VM](#restart-vm).
6. [Redeploy the VM](#redeploy-vm).

Continue reading for more detailed troubleshooting steps and explanations.

## Available methods to troubleshoot SSH connection issues
You can reset credentials or SSH configuration using one of the following methods:

* [Azure portal](#use-the-azure-portal) - great if you need to quickly reset the SSH configuration or SSH key and you don't have the Azure tools installed.
* [Azure VM Serial Console](https://aka.ms/serialconsolelinux) - the VM serial console will work regardless of the SSH configuration, and will provide you with an interactive console to your VM. In fact, "can't SSH" situations are specifically what the serial console was designed to help solve. More details below.
* [Azure CLI](#use-the-azure-cli) - if you are already on the command line, quickly reset the SSH configuration or credentials. If you are working with a classic VM, you can use the [Azure classic CLI](#use-the-azure-classic-cli).
* [Azure VMAccessForLinux extension](#use-the-vmaccess-extension) - create and reuse json definition files to reset the SSH configuration or user credentials.

After each troubleshooting step, try connecting to your VM again. If you still cannot connect, try the next step.

## Use the Azure portal
The Azure portal provides a quick way to reset the SSH configuration or user credentials without installing any tools on your local computer.

To begin, select your VM in the Azure portal. Scroll down to the **Support + Troubleshooting** section and select **Reset password** as in the following example:

![Reset SSH configuration or credentials in the Azure portal](./media/troubleshoot-ssh-connection/reset-credentials-using-portal.png)

### <a id="reset-config" />Reset the SSH configuration
To reset the SSH configuration, select `Reset configuration only` in the **Mode** section as in the preceding screenshot, then select **Update**. Once this action has completed, try to access your VM again.

### <a id="reset-credentials" />Reset SSH credentials for a user
To reset the credentials of an existing user, select either `Reset SSH public key` or `Reset password` in the **Mode** section as in the preceding screenshot. Specify the username and an SSH key or new password, then select  **Update**.

You can also create a user with sudo privileges on the VM from this menu. Enter a new username and associated password or SSH key, and then select **Update**.

### <a id="security-rules" />Check security rules

Use [IP flow verify](../../network-watcher/network-watcher-check-ip-flow-verify-portal.md) to confirm if a rule in a network security group is blocking traffic to or from a virtual machine. You can also review effective security group rules to ensure inbound "Allow" NSG rule exists and is prioritized for SSH port (default 22). For more information, see [Using effective security rules to troubleshoot VM traffic flow](../../virtual-network/diagnose-network-traffic-filter-problem.md).

### Check routing

Use Network Watcher's [Next hop](../../network-watcher/network-watcher-check-next-hop-portal.md) capability to confirm that a route isn't preventing traffic from being routed to or from a virtual machine. You can also review effective routes to see all effective routes for a network interface. For more information, see [Using effective routes to troubleshoot VM traffic flow](../../virtual-network/diagnose-network-routing-problem.md).

## Use the Azure VM Serial Console
The [Azure VM Serial Console](./serial-console-linux.md) provides access to a text-based console for Linux virtual machines. You can use the console to troubleshoot your SSH connection in an interactive shell. Ensure you have met the [prerequisites](./serial-console-linux.md#prerequisites) for using Serial Console and try the commands below to further troubleshoot your SSH connectivity.

### Check that SSH is running
You can use the following command to verify whether SSH is running on your VM:

```console
ps -aux | grep ssh
```

If there is any output, SSH is up and running.

### Check which port SSH is running on

You can use the following command to check which port SSH is running on:

```console
sudo grep Port /etc/ssh/sshd_config
```

Your output will look something like:

```output
Port 22
```

## Use the Azure CLI
If you haven't already, install the latest [Azure CLI](/cli/azure/install-az-cli2) and sign in to an Azure account using [az login](/cli/azure/reference-index).

If you created and uploaded a custom Linux disk image, make sure the [Microsoft Azure Linux Agent](../extensions/agent-linux.md) version 2.0.5 or later is installed. For VMs created using Gallery images, this access extension is already installed and configured for you.

### Reset SSH configuration
You can initially try resetting the SSH configuration to default values and rebooting the SSH server on the VM. This does not change the user account name, password, or SSH keys.
The following example uses [az vm user reset-ssh](/cli/azure/vm/user) to reset the SSH configuration on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
az vm user reset-ssh --resource-group myResourceGroup --name myVM
```

### Reset SSH credentials for a user
The following example uses [az vm user update](/cli/azure/vm/user) to reset the credentials for `myUsername` to the value specified in `myPassword`, on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
az vm user update --resource-group myResourceGroup --name myVM \
     --username myUsername --password myPassword
```

If using SSH key authentication, you can reset the SSH key for a given user. The following example uses **az vm access set-linux-user** to update the SSH key stored in `~/.ssh/id_rsa.pub` for the user named `myUsername`, on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
az vm user update --resource-group myResourceGroup --name myVM \
    --username myUsername --ssh-key-value ~/.ssh/id_rsa.pub
```

## Use the VMAccess extension
The VM Access Extension for Linux reads in a json file that defines actions to carry out. These actions include resetting SSHD, resetting an SSH key, or adding a user. You still use the Azure CLI to call the VMAccess extension, but you can reuse the json files across multiple VMs if desired. This approach allows you to create a repository of json files that can then be called for given scenarios.

### Reset SSHD
Create a file named `settings.json` with the following content:

```json
{
    "reset_ssh":"True"
}
```

Using the Azure CLI, you then call the `VMAccessForLinux` extension to reset your SSHD connection by specifying your json file. The following example uses [az vm extension set](/cli/azure/vm/extension) to reset SSHD on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
az vm extension set --resource-group philmea --vm-name Ubuntu \
    --name VMAccessForLinux --publisher Microsoft.OSTCExtensions --version 1.2 --settings settings.json
```

### Reset SSH credentials for a user
If SSHD appears to function correctly, you can reset the credentials for a giver user. To reset the password for a user, create a file named `settings.json`. The following example resets the credentials for `myUsername` to the value specified in `myPassword`. Enter the following lines into your `settings.json` file, using your own values:

```json
{
    "username":"myUsername", "password":"myPassword"
}
```

Or to reset the SSH key for a user, first create a file named `settings.json`. The following example resets the credentials for `myUsername` to the value specified in `myPassword`, on the VM named `myVM` in `myResourceGroup`. Enter the following lines into your `settings.json` file, using your own values:

```json
{
    "username":"myUsername", "ssh_key":"mySSHKey"
}
```

After creating your json file, use the Azure CLI to call the `VMAccessForLinux` extension to reset your SSH user credentials by specifying your json file. The following example resets credentials on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
az vm extension set --resource-group philmea --vm-name Ubuntu \
    --name VMAccessForLinux --publisher Microsoft.OSTCExtensions --version 1.2 --settings settings.json
```

## Use the Azure classic CLI
If you haven't already, [install the Azure classic CLI and connect to your Azure subscription](../../cli-install-nodejs.md). Make sure that you are using Resource Manager mode as follows:

```azurecli
azure config mode arm
```

If you created and uploaded a custom Linux disk image, make sure the [Microsoft Azure Linux Agent](../extensions/agent-linux.md) version 2.0.5 or later is installed. For VMs created using Gallery images, this access extension is already installed and configured for you.

### Reset SSH configuration
The SSHD configuration itself may be misconfigured or the service encountered an error. You can reset SSHD to make sure the SSH configuration itself is valid. Resetting SSHD should be the first troubleshooting step you take.

The following example resets SSHD on a VM named `myVM` in the resource group named `myResourceGroup`. Use your own VM and resource group names as follows:

```azurecli
azure vm reset-access --resource-group myResourceGroup --name myVM \
    --reset-ssh
```

### Reset SSH credentials for a user
If SSHD appears to function correctly, you can reset the password for a giver user. The following example resets the credentials for `myUsername` to the value specified in `myPassword`, on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
azure vm reset-access --resource-group myResourceGroup --name myVM \
     --user-name myUsername --password myPassword
```

If using SSH key authentication, you can reset the SSH key for a given user. The following example updates the SSH key stored in `~/.ssh/id_rsa.pub` for the user named `myUsername`, on the VM named `myVM` in `myResourceGroup`. Use your own values as follows:

```azurecli
azure vm reset-access --resource-group myResourceGroup --name myVM \
    --user-name myUsername --ssh-key-file ~/.ssh/id_rsa.pub
```

## <a id="restart-vm" />Restart a VM
If you have reset the SSH configuration and user credentials, or encountered an error in doing so, you can try restarting the VM to address underlying compute issues.

### Azure portal
To restart a VM using the Azure portal, select your VM and then select **Restart** as in the following example:

![Restart a VM in the Azure portal](./media/troubleshoot-ssh-connection/restart-vm-using-portal.png)

### Azure CLI
The following example uses [az vm restart](/cli/azure/vm) to restart the VM named `myVM` in the resource group named `myResourceGroup`. Use your own values as follows:

```azurecli
az vm restart --resource-group myResourceGroup --name myVM
```

### Azure classic CLI

[!INCLUDE [classic-vm-deprecation](../../../includes/classic-vm-deprecation.md)]

The following example restarts the VM named `myVM` in the resource group named `myResourceGroup`. Use your own values as follows:

```console
azure vm restart --resource-group myResourceGroup --name myVM
```

## <a id="redeploy-vm" />Redeploy a VM
You can redeploy a VM to another node within Azure, which may correct any underlying networking issues. For information about redeploying a VM, see [Redeploy virtual machine to new Azure node](../windows/redeploy-to-new-node.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

> [!NOTE]
> After this operation finishes, ephemeral disk data is lost and dynamic IP addresses that are associated with the virtual machine are updated.
>
>

### Azure portal
To redeploy a VM using the Azure portal, select your VM and scroll down to the **Support + Troubleshooting** section. Select **Redeploy** as in the following example:

![Redeploy a VM in the Azure portal](./media/troubleshoot-ssh-connection/redeploy-vm-using-portal.png)

### Azure CLI
The following example use [az vm redeploy](/cli/azure/vm) to redeploy the VM named `myVM` in the resource group named `myResourceGroup`. Use your own values as follows:

```azurecli
az vm redeploy --resource-group myResourceGroup --name myVM
```

### Azure classic CLI

The following example redeploys the VM named `myVM` in the resource group named `myResourceGroup`. Use your own values as follows:

```console
azure vm redeploy --resource-group myResourceGroup --name myVM
```

## VMs created by using the Classic deployment model

[!INCLUDE [classic-vm-deprecation](../../../includes/classic-vm-deprecation.md)]

Try these steps to resolve the most common SSH connection failures for VMs that were created by using the classic deployment model. After each step, try reconnecting to the VM.

* Reset remote access from the [Azure portal](https://portal.azure.com). On the Azure portal, select your VM and then select **Reset Remote...**.
* Restart the VM. On the [Azure portal](https://portal.azure.com), select your VM and select **Restart**.

* Redeploy the VM to a new Azure node. For information about how to redeploy a VM, see [Redeploy virtual machine to new Azure node](../windows/redeploy-to-new-node.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

    After this operation finishes, ephemeral disk data will be lost and dynamic IP addresses that are associated with the virtual machine will be updated.
* Follow the instructions in [How to reset a password or SSH for Linux-based virtual machines](../linux/classic/reset-access-classic.md) to:

  * Reset the password or SSH key.
  * Create a *sudo* user account.
  * Reset the SSH configuration.
* Check the VM's resource health for any platform issues.<br>
     Select your VM and scroll down **Settings** > **Check Health**.

## Additional resources
* If you are still unable to SSH to your VM after following the after steps, see [more detailed troubleshooting steps](detailed-troubleshoot-ssh-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to review additional steps to resolve your issue.
* For more information about troubleshooting application access, see [Troubleshoot access to an application running on an Azure virtual machine](../windows/troubleshoot-app-connection.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* For more information about troubleshooting virtual machines that were created by using the classic deployment model, see [How to reset a password or SSH for Linux-based virtual machines](../linux/classic/reset-access-classic.md).
