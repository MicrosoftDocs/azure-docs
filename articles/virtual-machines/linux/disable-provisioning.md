---
title: Disable or remove the provisioning agent
description: Learn how to disable or remove the provisioning agent in Linux VMs and images.
author: danielsollondon
ms.service: virtual-machines
ms.collection: linux
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 04/11/2023
ms.author: danis
ms.reviewer: cynthn
---

# Disable or remove the Linux Agent from VMs and images

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Before removing the Linux Agent, you must understand of what VM will not be able to do after the Linux Agent is removed.

Azure virtual machine (VM) [extensions](../extensions/overview.md) are small applications that provide post-deployment configuration and automation tasks on Azure VMs, extensions are installed and managed by the Azure control plane. It is the job of the [Azure Linux Agent](../extensions/agent-linux.md) to process the platform extension commands and ensure the correct state of the extension inside the VM.

The Azure platform hosts many extensions that range from VM configuration, monitoring, security, and utility applications. There is a large choice of first and third-party extensions, examples of key scenarios that extensions are used for:

* Supporting first party Azure services, such as Azure Backup, Monitoring, Disk Encryption, Security, Site Replication and others.
* SSH / Password resets
* VM configuration - Running custom scripts, installing Chef, Puppet agents etc..
* Third-party products, such as AV products, VM vulnerability tools, VM and App monitoring tooling.
* Extensions can be bundled with a new VM deployment. For example, they can be part of a larger deployment, configuring applications on VM provision, or run against any supported extension operated systems post deployment.

## Disabling extension processing

There are several ways to disable extension processing, depending on your needs, but before you continue, you **MUST** remove all extensions deployed to the VM, for example using the Azure CLI, you can [list](/cli/azure/vm/extension#az-vm-extension-list) and [delete](/cli/azure/vm/extension#az-vm-extension-delete):

```azurecli-interactive
az vm extension delete -g MyResourceGroup --vm-name MyVm -n extension_name
```

> [!Note]
>
> If you do not do the above, the platform will try to send the extension configuration and timeout after 40min.

### Disable at the control plane

If you are not sure whether you will need extensions in the future, you can leave the Linux Agent installed on the VM, then disable extension processing capability from the platform. This is option is available in `Microsoft.Compute` api version `2018-06-01` or higher, and does not have a dependency on the Linux Agent version installed.

```azurecli-interactive
az vm update -g <resourceGroup> -n <vmName> --set osProfile.allowExtensionOperations=false
```

You can easily reenable this extension processing from the platform, with the above command, but set it to 'true'.

## Remove the Linux Agent from a running VM

Ensure you have **removed** all existing extensions from the VM before, as per above.

### Step 1: Remove the Azure Linux Agent

If you just remove the Linux Agent, and not the associated configuration artifacts, you can reinstall at a later date. Run one of the following, as root, to remove the Azure Linux Agent:

#### For Ubuntu 18.04+

```bash
sudo apt -y remove walinuxagent
```

#### For Redhat 7.X, 8.X and 9.X

```bash
sudo yum -y remove WALinuxAgent
```

#### For SUSE 12.X, 15.X

```bash
sudo zypper --non-interactive remove python-azure-agent
```

### Step 2: (Optional) Remove the Azure Linux Agent artifacts

> [!IMPORTANT]
>
> You can remove all associated artifacts of the Linux Agent, but this will mean you cannot reinstall it at a later date. Therefore, it is strongly recommended you consider disabling the Linux Agent first, removing the Linux Agent using the above only. 

If you know you will not ever reinstall the Linux Agent again, then you can run the following:

#### For Ubuntu 18.04+

```bash
sudo pt -y purge walinuxagent
sudo cp -rp /var/lib/waagent /var/lib/waagent.bkp
sudo rm -rf /var/lib/waagent
sudo rm -f /var/log/waagent.log
```

#### For Redhat 7.X, 8.X, 9.X

```bash
sudo yum -y remove WALinuxAgent
sudo rm -f /etc/waagent.conf.rpmsave
sudo rm -rf /var/lib/waagent
sudo rm -f /var/log/waagent.log
```

#### For SUSE 12.X, 15.X

```bash
sudo zypper --non-interactive remove python-azure-agent
sudo rm -f /etc/waagent.conf.rpmsave
sudo rm -rf /var/lib/waagent
sudo rm -f /var/log/waagent.log
```

## Preparing an image without the Linux Agent

If you have an image that already contains cloud-init, and you want to remove the Linux agent, but still provision using cloud-init, run the steps in Step 2 (and optionally Step 3) as root to remove the Azure Linux Agent and then the following will remove the cloud-init configuration and cached data, and prepare the VM to create a custom image.

```bash
sudo cloud-init clean --logs --seed 
```

## Deprovision and create an image

The Linux Agent has the ability to clean up some of the existing image metadata, with the step "waagent -deprovision+user", however, after it has been removed, you will need to perform actions such as the below, and remove any other sensitive data from it.

* Remove all existing ssh host keys

   ```bash
   sudo rm /etc/ssh/ssh_host_*key*
   ```

* Delete the admin account

   ```bash
   sudo touch /var/run/utmp
   sudo userdel -f -r <admin_user_account>
   ```

* Delete the root password

   ```bash
   sudo passwd -d root
   ```

Once you have completed the above, you can create the custom image using the Azure CLI.

### Create a regular managed image

```azurecli-interactive
az vm deallocate -g <resource_group> -n <vm_name>
az vm generalize -g <resource_group> -n <vm_name>
az image create -g <resource_group> -n <image_name> --source <vm_name>
```

### Create an image version in a Azure Compute Gallery

```azurecli-interactive
az sig image-version create \
    -g $sigResourceGroup 
    --gallery-name $sigName 
    --gallery-image-definition $imageDefName 
    --gallery-image-version 1.0.0 
    --managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/imageGroups/providers/images/MyManagedImage
```

### Creating a VM from an image that does not contain a Linux Agent

When you create the VM from the image with no Linux Agent, you need to ensure the VM deployment configuration indicates extensions are not supported on this VM.

> [!NOTE]
>
> If you do not do the above, the platform will try to send the extension configuration and timeout after 40min.

To deploy the VM with extensions disabled, you can use the Azure CLI with [--enable-agent](/cli/azure/vm#az-vm-create).

```azurecli-interactive
az vm create \
    --resource-group $resourceGroup \
    --name $prodVmName \
    --image RedHat:RHEL:8.1-ci:latest \
    --admin-username azadmin \
    --ssh-key-value "$sshPubkeyPath" \
    --enable-agent false
```

Alternatively, you can do this using Azure Resource Manager (ARM) templates, by setting `"provisionVMAgent": false,`.

```json
"osProfile": {
    "computerName": "[parameters('virtualMachineName')]",
    "adminUsername": "[parameters('adminUsername')]",
    "linuxConfiguration": {
        "disablePasswordAuthentication": "true",
        "provisionVMAgent": false,
        "ssh": {
            "publicKeys": [
                {
                    "path": "[concat('/home/', parameters('adminUsername'), '/.ssh/authorized_keys')]",
                    "keyData": "[parameters('adminPublicKey')]"
```

## Next steps

For more information, see [Provisioning Linux](provisioning.md).
