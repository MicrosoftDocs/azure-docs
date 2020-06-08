---
title: Disable and removing the provisioning agent 
description: Disable or remove the provisioning agent in Linux VMs and images.
author: danielsollondon
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/08/2020
ms.author: danis
ms.reviewer: cynthn
---

# Disabling & removing the Linux Agent from VMs and images

Before removing the Linux Agent, you must understand of what VM will not be able to do after the Linux Agent is removed.

Azure virtual machine (VM) [extensions](https://docs.microsoft.com/azure/virtual-machines/extensions/overview) are small applications that provide post-deployment configuration and automation tasks on Azure VMs, extensions are installed and managed by the Azure control plane. It is the job of the [Azure Linux Agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-linux) to process the platform extension commands and ensure the correct state of the extension inside the VM.

The Azure platform hosts many extensions that range from VM configuration, monitoring, security, and utility applications. There is a large choice of first and third-party extensions, examples of key scenarios that extensions are used for:
* Supporting first party Azure services, such as Azure Backup, Monitoring, Disk Encryption, Security, Site Replication and others.
* SSH / Password resets
* VM configuration - Running custom scripts, installing Chef, Puppet agents etc..
* Third-party products, such as AV products, VM vulnerability tools, VM and App monitoring tooling.
* Extensions can be bundled with a new VM deployment. For example, they can be part of a larger deployment, configuring applications on VM provision, or run against any supported extension operated systems post deployment.

> NOTE! Removing the Linux Agent is a one way operation, it is not yet supported to reinstall the Linux Agent. You will need to create a new image with the Linux Agent. Therefore, it is strongly recommended you consider disabling the Linux Agent, before removing the Linux Agent.


## Disabling Extension Processing

There are several ways to disable extension processing, depending on your needs.

### Disable at the control plane
If you are not sure whether you will need extensions in the future, you can leave the Linux Agent installed on the VM, then disable extension processing capability from the platform. This is option is available in `Microsoft.Compute` api version `2018-06-01` or higher, and does not have a dependency on the Linux Agent version installed.

```bash
az vm update -g <resourceGroup> -n <vmName> --set osProfile.allowExtensionOperations=false
```
You can easily reenable this extension processing from the platform, with the above command, but set it to 'true'.

### Optional - reduce the functionality 

You can also put the Linux Agent into a reduced functionality mode. In this mode, the guest agent still communicates with Azure Fabric and reports guest state on a much more limited basis, but will not process any extension updates. To reduce the functionality, you need to make a configuration change within the VM. To reenable, you would need to SSH into the VM, but if you are locked out of the VM, you would not be able to reenable extension processing, this maybe an issue, if you need to do an SSH or password reset.

To enable this mode, WALinuxAgent version 2.2.32 or higher is required, and set the following option in /etc/waagent.conf:

```bash
Extensions.Enabled=n
```

This **must** be done in conjunction with 'Disable at the control plane'.

## Remove the Linux Agent from a running VM

You can also disable the agent in a running VM.

### Step 1: Disable Extension Processing

You must disable extension processing.

```bash
az vm update -g <resourceGroup> -n <vmName> --set osProfile.allowExtensionOperations=false
```
>Note! If you do not do the above, the platform will try to send the extension configuration and timeout after 40min.

### Step 2: Remove the Azure Linux Agent

Run one of the following, as root, to remove the Azure Linux Agent

### For Ubuntu >=18.04
```bash
apt -y remove walinuxagent
rm -f /etc/waagent.conf
rm -rf /var/lib/waagent
rm -f /var/log/waagent.log
```

### For Redhat >= 7.7
```bash
yum -y remove WALinuxAgent
rm -f /etc/waagent.conf.rpmsave
rm -rf /var/lib/waagent
rm -f /var/log/waagent.log
```

### For SUSE
```bash
zypper --non-interactive remove python-azure-agent
rm -f /etc/waagent.conf.rpmsave
rm -rf /var/lib/waagent
rm -f /var/log/waagent.log
```


## Preparing an image without the Linux Agent
If you have an image that already contains cloud-init, and you want to remove the Linux agent, but still provision using cloud-init, run the following steps as root to remove the Azure Linux Agent, its configuration and cached data, and prepare the VM to create a custom image.

### For Ubuntu >=18.04
```bash
apt -y remove walinuxagent
rm -f /etc/waagent.conf
rm -rf /var/lib/waagent
rm -f /var/log/waagent.log
cloud-init clean --logs
```

### For Redhat >= 7.7
```bash
yum -y remove WALinuxAgent
rm -f /etc/waagent.conf.rpmsave
rm -rf /var/lib/waagent
rm -f /var/log/waagent.log
cloud-init clean --logs
```

### For SUSE
```bash
zypper --non-interactive remove python-azure-agent
rm -f /etc/waagent.conf.rpmsave
rm -rf /var/lib/waagent
rm -f /var/log/waagent.log
cloud-init clean --logs
```

## Deprovision and create an image

In a typical scenario of preparing custom images with the Azure Linux Agent, the step "waagent -deprovision+user" is recommended. Some of the actions performed by that step are: 
- generate a new ssh host key
- delete the admin username that was specified during provisioning
- delete the root password
- delete dhcp lease file that was written during provisioning
- reset the hostname
- delete files generated by the agent during provisioning in /var/lib/waagent

After disabling the Linux Agent, the user can create a custom image using the Azure CLI.


**Create a regular managed image**
```bash
az vm deallocate -g <resource_group> -n <vm_name>
az vm generalize -g <resource_group> -n <vm_name>
az image create -g <resource_group> -n <image_name> --source <vm_name>
```

**Create an image version in a Shared Image Gallery**

```bash
az sig image-version create \
    -g $sigResourceGroup 
    --gallery-name $sigName 
    --gallery-image-definition $imageDefName 
    --gallery-image-version 1.0.0 
    --managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/imageGroups/providers/images/MyManagedImage
```
### Creating a VM from an image that does not contain a Linux Agent
When you create the VM from the image with no Linux Agent, you need to ensure the VM deployment configuration indicates extensions are not supported on this VM.

>Note! If you do not do the above, the platform will try to send the extension configuration and timeout after 40min.

To deploy the VM with extensions disabled, you can use the Azure CLI with [--enable-agent](https://docs.microsoft.com/cli/azure/vm#az-vm-create).

```bash
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

