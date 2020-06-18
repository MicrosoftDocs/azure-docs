---
title: Issues using VM extensions in Python 3-enabled Linux Azure Virtual Machines systems 
description: Learn about using VM extensions in Python 3-enabled Linux systems
services: virtual-machines-windows
documentationcenter: ''
author: v-miegge
ms.author: jparrel
manager: dcscontentpm
editor: ''
tags: top-support-issue,azure-resource-manager

ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/22/2020
ms.assetid: 3cd520fd-eaf7-4ef9-b4d3-4827057e5028
---

# Issues using VM extensions in Python 3-enabled Linux Azure Virtual Machines systems

> [!NOTE]
> Microsoft encourages users to adopt **Python 3.x** in their systems unless your workload requires **Python 2.x** support. Examples of this requirement might include legacy administration scripts, or extensions such as **Azure Disk Encryption** and **Azure Monitor**.
>
> Before installing **Python 2.x** in production, consider the question of long-term support of Python 2.x, particularly their ability to receive security updates. As products, including some of the extension mentioned, update with **Python 3.8** support, you should discontinue use of Python 2.x.

Some Linux distributions have transitioned to Python 3.8 and removed the legacy `/usr/bin/python` entrypoint for Python altogether. This transition impacts the out-of-the-box, automated deployment of certain virtual machine (VM) extensions with the following conditions:

- Extensions that are still transitioning to Python 3.x support
- Extensions that use the legacy `/usr/bin/python` entrypoint

Linux distribution users who have transitioned to **Python 3.x** must ensure the legacy `/usr/bin/python` entrypoint exists before attempting to deploy those extensions to their VMs. Otherwise, the extension deployment might fail. 

- Endorsed Linux distributions that are affected include **Ubuntu Server 20.04 LTS** and **Ubuntu Pro 20.04 LTS**.

- Affected VM Extensions include **Azure Disk Encryption**, **Log Analytics**, **VM Access** (used for Password Reset), and **Guest Diagnostics** (used for additional performance counters).

In-place upgrades, such as upgrading from **Ubuntu 18.04 LTS** to **Ubuntu 20.04 LTS**, should retain the `/usr/bin/python` symlink, and remain unaffected.

## Resolution

Consider the following general recommendations before deploying extensions in the known-affected scenarios described previously in the Summary:

1.	Before deploying the extension, reinstate the `/usr/bin/python` symlink by using the Linux distribution vendor-provided method.

    - For example, for **Python 2.7**, use: `sudo apt update && sudo apt install python-is-python2`

2.	If you’ve already deployed an instance that exhibits this problem, use the **Run command** functionality in the **VM blade** to run the commands mentioned above. The Run command extension itself is not affected by the transition to Python 3.8.

3.	If you are deploying a new instance, and need to set an extension at provisioning time, use **cloud-init** user data to install the packages mentioned above.

    For example, for Python 2.7:

    ```
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

4.	If your organization’s policy administrators determine that extensions shouldn’t be deployed in VMs, you can disable extension support at provisioning time:

    - REST API

      To disable and enable extensions when you can deploy a VM with this property:

      ```
        "osProfile": {
          "allowExtensionOperations": false
        },
      ```

## Next steps

Please refer to [Other base system changes since 18.04 LTS - Python 3 by default](https://wiki.ubuntu.com/FocalFossa/ReleaseNotes#Python3_by_default) for additional information.
