---
title: Issues using VM extensions in Python 3-enabled Linux Azure Virtual Machines systems 
description: Learn about using VM extensions in Python 3-enabled Linux systems
author: v-miegge
ms.author: jparrel
manager: dcscontentpm
tags: top-support-issue,azure-resource-manager
ms.custom: devx-track-python
ms.service: virtual-machines
ms.subservice: extensions
ms.collection: linux
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/15/2023
---

# Issues using VM extensions in Python 3-enabled Linux Azure Virtual Machines systems

> [!NOTE]
> Microsoft encourages users to adopt **Python 3.x** in their systems unless your workload requires **Python 2.x** support. Examples of this requirement might include legacy administration scripts, or extensions such as **Azure Disk Encryption** and **Azure Monitor**.
>
> Before installing **Python 2.x** in production, consider the question of long-term support of Python 2.x, particularly their ability to receive security updates. As products, including some of the extension mentioned, update with **Python 3.8** support, you should discontinue use of Python 2.x.

Some Linux distributions have transitioned to Python 3.8 and removed the legacy `/usr/bin/python` entrypoint for Python altogether. This transition impacts the out-of-the-box, automated deployment of certain virtual machine (VM) extensions with these two conditions:

- Extensions that are still transitioning to Python 3.x support
- Extensions that use the legacy `/usr/bin/python` entrypoint

Linux distribution users who have transitioned to **Python 3.x** must ensure the legacy `/usr/bin/python` entrypoint exists before attempting to deploy those extensions to their VMs. Otherwise, the extension deployment might fail. 

- Endorsed Linux distributions that are affected include **Ubuntu Server 20.04 LTS** and **Ubuntu Pro 20.04 LTS**.

- Affected VM Extensions include **Azure Disk Encryption**, **Log Analytics**, **VM Access** (used for Password Reset), and **Guest Diagnostics** (used for additional performance counters).

In-place upgrades, such as upgrading from **Ubuntu 18.04 LTS** to **Ubuntu 20.04 LTS**, should retain the `/usr/bin/python` symlink, and remain unaffected.

## Resolution

Consider these general recommendations before deploying extensions in the known-affected scenarios described previously in the Summary:

1. Before deploying the extension, reinstate the `/usr/bin/python` symlink by using the Linux distribution vendor-provided method.

   - For example, for **Python 2.7**, use: `sudo apt update && sudo apt install python-is-python2`

1. This recommendation is for Azure customers and isn't supported in Azure Stack:

   - If you’ve already deployed an instance that exhibits this problem, use the Run command functionality in the VM blade to run the commands mentioned above. The Run command extension itself isn't affected by the transition to Python 3.8.

1. If you're deploying a new instance, and need to set an extension at provisioning time, use **cloud-init** user data to install the packages mentioned above.

   For example, for Python 2.7:

   ```python
   # create cloud-init config
   cat > cloudinitConfig.json <<EOF
   #cloud-config
   package_update: true
    
   runcmd:
   - sudo apt update
   - sudo apt install python-is-python2 
   EOF

   # create VM
   az vm create \
       --resource-group <resourceGroupName> \
       --name <vmName> \
       --image <Ubuntu 20.04 Image URN> \
       --admin-username azadmin \
       --ssh-key-value "<sshPubKey>" \
       --custom-data ./cloudinitConfig.json
   ```

1. If your organization’s policy administrators determine that extensions shouldn’t be deployed in VMs, you can disable extension support at provisioning time:

   - REST API

     To disable and enable extensions when you can deploy a VM with this property:

     ```python
       "osProfile": {
         "allowExtensionOperations": false
       },
     ```

## Next steps

Please refer to [Other base system changes since 18.04 LTS - Python 3 by default](https://wiki.ubuntu.com/FocalFossa/ReleaseNotes#Python3_by_default) for additional information.
