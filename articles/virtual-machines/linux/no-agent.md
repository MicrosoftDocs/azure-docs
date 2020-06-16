---
title: Create Linux images without a provisioning agent 
description: Create generalized Linux images without a provisioning agent in Azure.
author: danielsollondon
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/16/2020
ms.author: danis
ms.reviewer: cynthn
---


# Create generalized images without a provisioning agent

Most deployments in Azure do not need to use images without a provisioning agent. Provisioning agents, like cloud-init, are maintained, tested, and updated to support the most Azure deployments.

You should only consider this if:
1. You Linux OS will not meet the cloud-init prerequisites.
2. You require some of properties to be set, like hostname, username, CustomData, to be set during VM deployment.


No matter which properties you set, you need to configure networking, and the Azure platform expects a 'VM Ready' signal (self-report a successful provisioning event) to be sent from the VM to the Azure platform, to indicate the VM configuration has applied and is ready for use. Failure to 

>> ANH - Is it possible to show how to create a systemD unit that sets hostName, and then sends the prov signal.


## Enabling networking and self-reporting a successful provisioning


If have a reasonably standard kernel that can detect networking interfaces, you will need a DHCP client to get an IP from your virtual network, a DNS resolver and a route. Even if you manually specify private IP addresses and hardcode resolver settings, we only support DHCP-enabled instances. Tools that have been tested on Azure by Linux distro vendors include `dhclient`, `network-manager`, `systemd-networkd` and others.
 
When you're done setting up networking, it's time to self-report the provisioning event. To do this, you need to send an HTTP request to the wire server, and you should have suitable retry logic, at least 5 attempts.


>> ANH - can you share 
Here is an example on to report ready.
            https://gist.github.com/arithx/dae948f3d9558c8863ac55cba3391eb4


> [!IMPORTANT]
>
> Failure to self-report ready state will result in the instance being power cycled.

## Creating a VM from an image without a Linux Agent

When you create a VM from an image that doesn't contain the Linux Agent, you need to ensure the VM deployment configuration indicates that extensions are not supported on this VM.


To deploy the VM with extensions disabled, you can use `az vm create` with [--enable-agent](https://docs.microsoft.com/cli/azure/vm?view=azure-cli-latest#az-vm-create):
```bash
az vm create \
    --resource-group $resourceGroup \
    --name $prodVmName \
    --image RedHat:RHEL:8.1-ci:latest \
    --admin-username azadmin \
    --ssh-key-value "$sshPubkeyPath" \
    --enable-agent false
```


You can also set this in an Azure Resource Manager (ARM) template, by setting `"provisionVMAgent": false,`:

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


> [!NOTE] 
> If `--enable-agent` or `provisionVMAgent` are not set to `false` , the platform will try to send the extension configuration and timeout after 40min.


## Support
If you implement your own provisioning code/agent, then you own the support of this code, Microsoft support will only investigate issues relating to the provisioning interfaces not being available. We are continually making improvements and changes in this area, so you must monitor for changes in cloud-init and Azure Linux Agent for provisioning API changes.
 
## Next steps

For more information, see [Provisioning](provisioning.md).