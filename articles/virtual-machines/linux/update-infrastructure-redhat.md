---
title: Red Hat Update Infrastructure | Microsoft Docs
description: Learn about Red Hat Update Infrastructure for on-demand Red Hat Enterprise Linux instances in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
manager: jeconnoc
editor: ''

ms.assetid: f495f1b4-ae24-46b9-8d26-c617ce3daf3a
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/02/2018
ms.author: borisb

---
# Red Hat Update Infrastructure for on-demand Red Hat Enterprise Linux VMs in Azure
 [Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) (RHUI) allows cloud providers, such as Azure, to mirror Red Hat-hosted repository content, create custom repositories with Azure-specific content, and make it available to end-user VMs.

Red Hat Enterprise Linux (RHEL) Pay-As-You-Go (PAYG) images come preconfigured to access Azure RHUI. No additional configuration is needed. To get the latest updates, run `sudo yum update` after your RHEL instance is ready. This service is included as part of the RHEL PAYG software fees.

## Important information about Azure RHUI
* Azure RHUI currently supports only the latest minor release in each RHEL family (RHEL6 or RHEL7). To upgrade an RHEL VM instance connected to RHUI to the latest minor version, run `sudo yum update`.

    For example, if you provision a VM from an RHEL 7.2 PAYG image and run `sudo yum update`, you end up with an RHEL 7.5 VM (the latest minor version in the RHEL7 family).

    To avoid this behavior, you need to build your own image as described in the [Create and upload a Red Hat-based virtual machine for Azure](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) article. Then you need to connect it to a different update infrastructure ([directly to Red Hat content delivery servers](https://access.redhat.com/solutions/253273) or a [Red Hat Satellite server](https://access.redhat.com/products/red-hat-satellite)).

* Access to the Azure-hosted RHUI is included in the RHEL PAYG image price. If you unregister a PAYG RHEL VM from the Azure-hosted RHUI that does not convert the virtual machine into a bring-your-own-license (BYOL) type of VM. If you register the same VM with another source of updates, you might incur _indirect_ double charges. You're charged the first time for the Azure RHEL software fee. You're charged the second time for Red Hat subscriptions that were purchased previously. If you consistently need to use an update infrastructure other than Azure-hosted RHUI, consider creating and deploying your own (BYOL-type) images. This process is described in [Create and upload a Red Hat-based virtual machine for Azure](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

* Two classes of RHEL PAYG images in Azure (RHEL for SAP HANA and RHEL for SAP Business Applications) are connected to dedicated RHUI channels that remain on the specific RHEL minor version as required for SAP certification. 

* Access to Azure-hosted RHUI is limited to the VMs within the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). If you're proxying all VM traffic via an on-premises network infrastructure, you might need to set up user-defined routes for the RHEL PAYG VMs to access the Azure RHUI.

### The IPs for the RHUI content delivery servers

RHUI is available in all regions where RHEL on-demand images are available. It currently includes all public regions listed on the [Azure status dashboard](https://azure.microsoft.com/status/) page, Azure US Government, and Microsoft Azure Germany regions. 

If you're using a network configuration to further restrict access from RHEL PAYG VMs, make sure the following IPs are allowed for `yum update` to work depending on the environment you're in: 

```
# Azure Global
13.91.47.76
40.85.190.91
52.187.75.218
52.174.163.213
52.237.203.198

# Azure US Government
13.72.186.193

# Azure Germany
51.5.243.77
51.4.228.145
```

## RHUI Azure infrastructure update

In September 2016, we deployed an updated Azure RHUI. In April 2017, we shut down the old Azure RHUI. If you have been using the RHEL PAYG images (or their snapshots) from September 2016 or later, you're automatically connecting to the new Azure RHUI. If, however, you have older snapshots on your VMs, you need to manually update their configuration to access the Azure RHUI as described in a following section.

The new Azure RHUI servers are deployed with [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/). In Traffic Manager, a single endpoint (rhui-1.microsoft.com) can be used by any VM, regardless of region. 

### Troubleshoot connection problems to Azure RHUI
If you experience problems connecting to Azure RHUI from your Azure RHEL PAYG VM, follow these steps:

1. Inspect the VM configuration for the Azure RHUI endpoint:

    a. Check if the `/etc/yum.repos.d/rh-cloud.repo` file contains a reference to `rhui-[1-3].microsoft.com` in the `baseurl` of the `[rhui-microsoft-azure-rhel*]` section of the file. If it does, you're using the new Azure RHUI.

    b. If it points to a location with the following pattern, `mirrorlist.*cds[1-4].cloudapp.net`, a configuration update is required. You're using the old VM snapshot, and you need to update it to point to the new Azure RHUI.

1. Access to Azure-hosted RHUI is limited to VMs within the [Azure datacenter IP ranges] (https://www.microsoft.com/download/details.aspx?id=41653).
 
1. If you're using the new configuration, have verified that the VM connects from the Azure IP range, and still can't connect to Azure RHUI, file a support case with Microsoft or Red Hat.

### Manual update procedure to use the Azure RHUI servers
This procedure is provided for reference only. RHEL PAYG images already have the correct configuration to connect to Azure RHUI. To manually update the configuration to use the Azure RHUI servers, complete the following steps:

1. Download the public key signature via curl.

   ```bash
   curl -o RPM-GPG-KEY-microsoft-azure-release https://download.microsoft.com/download/9/D/9/9d945f05-541d-494f-9977-289b3ce8e774/microsoft-sign-public.asc 
   ```

1. Verify the validity of the downloaded key.

   ```bash
   gpg --list-packets --verbose < RPM-GPG-KEY-microsoft-azure-release
   ```

1. Check the output, and then verify the `keyid` and the `user ID packet`.

   ```bash
   Version: GnuPG v1.4.7 (GNU/Linux)
   :public key packet:
           version 4, algo 1, created 1446074508, expires 0
           pkey[0]: [2048 bits]
           pkey[1]: [17 bits]
           keyid: EB3E94ADBE1229CF
   :user ID packet: "Microsoft (Release signing) <gpgsecurity@microsoft.com>"
   :signature packet: algo 1, keyid EB3E94ADBE1229CF
           version 4, created 1446074508, md5len 0, sigclass 0x13
           digest algo 2, begin of digest 1a 9b
           hashed subpkt 2 len 4 (sig created 2015-10-28)
           hashed subpkt 27 len 1 (key flags: 03)
           hashed subpkt 11 len 5 (pref-sym-algos: 9 8 7 3 2)
           hashed subpkt 21 len 3 (pref-hash-algos: 2 8 3)
           hashed subpkt 22 len 2 (pref-zip-algos: 2 1)
           hashed subpkt 30 len 1 (features: 01)
           hashed subpkt 23 len 1 (key server preferences: 80)
           subpkt 16 len 8 (issuer key ID EB3E94ADBE1229CF)
           data: [2047 bits]
   ```

1. Install the public key.

   ```bash
   sudo install -o root -g root -m 644 RPM-GPG-KEY-microsoft-azure-release /etc/pki/rpm-gpg
   sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-microsoft-azure-release
   ```

1. Download, verify, and install a client RPM Package Manager (RPM).
    
    >[!NOTE]
    >Package versions change. If you manually connect to Azure RHUI, you can find the latest version of the client package for each RHEL family by provisioning the latest image from the gallery.
  
   a. Download. 
   
    - For RHEL 6:
        ```bash
        curl -o azureclient.rpm https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel6/rhui-azure-rhel6-2.1-32.noarch.rpm 
        ```
    
    - For RHEL 7:
        ```bash
        curl -o azureclient.rpm https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel7/rhui-azure-rhel7-2.1-19.noarch.rpm  
        ```

   b. Verify.

   ```bash
   rpm -Kv azureclient.rpm
   ```

   c. Check the output to ensure that the signature of the package is OK.

   ```bash
   azureclient.rpm:
       Header V3 RSA/SHA256 Signature, key ID be1229cf: OK
       Header SHA1 digest: OK (927a3b548146c95a3f6c1a5d5ae52258a8859ab3)
       V3 RSA/SHA256 Signature, key ID be1229cf: OK
       MD5 digest: OK (c04ff605f82f4be8c96020bf5c23b86c)
   ```

   d. Install the RPM.

    ```bash
    sudo rpm -U azureclient.rpm
    ```

1. After you finish, verify that you can access Azure RHUI from the VM.

## Next steps
To create a Red Hat Enterprise Linux VM from an Azure Marketplace PAYG image and to use Azure-hosted RHUI, go to the [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/). 
