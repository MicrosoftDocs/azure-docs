---
title: Use cloud-init in a Linux VM on Azure 
description: How to use cloud-init to update and install packages in a Linux VM during creation with the Azure CLI
author: cynthn
ms.service: virtual-machines
ms.collection: linux
ms.topic: how-to
ms.date: 03/29/2023
ms.author: cynthn
ms.subservice: cloud-init
---
# Use cloud-init to update and install packages in a Linux VM in Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

This article shows you how to use [cloud-init](https://cloudinit.readthedocs.io) to update packages on a Linux virtual machine (VM) or virtual machine scale sets at provisioning time in Azure. These cloud-init scripts run on first boot once the resources have been provisioned by Azure. For more information about how cloud-init works natively in Azure and the supported Linux distros, see [cloud-init overview](using-cloud-init.md)

## Update a VM with cloud-init

For security purposes, you may want to configure a VM to apply the latest updates on first boot. As cloud-init works across different Linux distros, there is no need to specify `apt`, `zypper` or `yum` for the package manager. Instead, you define `package_upgrade` and let the cloud-init process determine the appropriate mechanism for the distro in use.

For this example, we will be using the Azure Cloud Shell. To see the upgrade process in action, create a file named *cloud_init_upgrade.txt* and paste the following configuration. You can use any editor you wish. Make sure that the whole cloud-init file is copied correctly, especially the first line.  

Copy the text below and paste it into the `cloud_init_upgrade.txt` file. Make sure that the whole cloud-init file is copied correctly, especially the first line.  

```yaml
#cloud-config
package_upgrade: true
packages:
- httpd
```

Before deploying, you need to create a resource group with the [az group create](/cli/azure/group) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now, create a VM with [az vm create](/cli/azure/vm) and specify the cloud-init file with the `--custom-data` parameter as follows:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name vmName \
  --image imageCIURN \
  --custom-data cloud_init_upgrade.txt \
  --admin-username azureuser \
  --generate-ssh-keys 
```

> [!NOTE]
> Replace **myResourceGroup**, **vmName**, and **imageCIURN** values accordingly. Make sure an image with Cloud-init is chosen.

SSH to the public IP address of your VM shown in the output from the preceding command. Enter your own **user** and **publicIpAddress** as follows:

```bash
ssh <user>@<publicIpAddress>
```

Run the package management tool and check for updates:

# [RHEL/CentOS/Oracle Linux](#tab/rhel)

- Execute the following command to confirm there are no pending updates

```bash
sudo yum check-update
```

As cloud-init checked for and installed updates on boot, there should be no additional updates to apply.  

- You can see the update process, number of altered packages as well as the installation of `httpd` by running the following command and review the output.

```bash
sudo yum history
```

```output
ID     | Command line                                | Date and time    | Action(s)      | Altered
--------------------------------------------------------------------------------------------------
     3 | -y install httpd                            | 2022-02-18 18:30 | Install        |    7
     2 | -y upgrade                                  | 2022-02-18 18:23 | I, O, U        |  321 EE
     1 |                                             | 2021-02-04 19:20 | Install        |  496 EE
```

# [Ubuntu](#tab/ubuntu)

- Execute the following command to confirm there are no pending updates

```bash
sudo apt -qq update
sudo apt list --upgradable
```

As cloud-init checked for and installed updates on boot, there should be no additional updates to apply.

- You can see the update process and altered packages by running the following command and reviewing the output

```bash
sudo cat /var/log/dpkg.log
```

# [SLES](#tab/sles)

- Execute the following command to confirm there are no pending updates

```bash
sudo zypper list-updates
```

As cloud-init checked for and installed updates on boot, there should be no additional updates to apply.

- You can see the update process and altered packages by running the following command and reviewing the output

```bash
sudo cat /var/log/zypp/history
```

---

## Next steps

For additional cloud-init examples of configuration changes, see the following:

- [Add an additional Linux user to a VM](cloudinit-add-user.md)
- [Run a package manager to update existing packages on first boot](cloudinit-update-vm.md)
- [Change VM local hostname](cloudinit-update-vm-hostname.md) 
- [Install an application package, update configuration files and inject keys](tutorial-automate-vm-deployment.md)
