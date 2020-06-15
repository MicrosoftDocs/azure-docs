---
title: Create Linux images without a provisioning agent 
description: Create generalized Linux images without a provisioning agent in Azure.
author: danielsollondon
ms.service: virtual-machines-linux
ms.subservice: imaging
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/08/2020
ms.author: danis
ms.reviewer: cynthn
---


# Create generalized images without a provisioning agent

Most deployments in Azure do not need to use this process. There are provisioning agents, like cloud-init, that are maintained, tested, and updated to support the VM provisioning with Azure.

You should only consider this if:
1. You Linux OS will not meet the cloud-init prerequisites.
2. You require some of properties to be set, like hostname, username, CustomData, to be set during VM deployment.


No matter which properties you set, you need to configure networking, and the Azure platform expects a 'VM Ready' signal (self-report a successful provisioning event) to be sent from the VM to the Azure platform, to indicate the VM configuration has applied and is ready for use. Failure to 

>> ANH - Is it possible to show how to create a systemD unit that sets hostName, and then sends the prov signal.


## Enabling networking and self-reporting a successful provisioning
NOTICE: failure to self-report ready state will result in the instance being power cycled.
 
To do this, and assuming you have a reasonably standard kernel that can detect the networking interface(s), you will require a DHCP client to get an IP from your virtual network, a DNS resolver and a route. Even if you manually specify private IP addresses and hardcode resolver settings, we only support DHCP-enabled instances. Tools that have been tested on Azure by Linux distro vendors include `dhclient`, `network-manager`, `systemd-networkd` and others.
 
When you're done setting up networking, it's time to self-report the provisioning event. To do this, you need to send an HTTP request to the wire server, and you should have suitable retry logic, at least 5 attempts.


>> ANH - can you share 
Here is an example on to report ready.
            https://gist.github.com/arithx/dae948f3d9558c8863ac55cba3391eb4
 

## Creating a VM from an image that does not contain a Linux Agent
When you create the VM from the image with no Linux Agent, you need to ensure the VM deployment config indicates extensions are not supported on this VM.

>Note! If you do not do the above, the platform will try to send the extension configuration and timeout after 40min.

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

Alternatively, you can do this using Azure Resource Manager templates, by setting `"provisionVMAgent": false,`:
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



## Support
If you implement your own provisioning code/agent, then you own the support of this code, Microsoft support will only investigate issues relating to the provisioning interfaces not being available. We are continually making improvements and changes in this area, so you must monitor for changes in cloud-init and Azure Linux Agent for provisioning API changes, significant improves ETA early 2021.
 
## Next steps

