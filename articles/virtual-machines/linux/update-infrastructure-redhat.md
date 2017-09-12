---
title: Red Hat Update Infrastructure (RHUI) | Microsoft Docs
description: Learn about Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux instances in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
manager: timlt
editor: ''

ms.assetid: f495f1b4-ae24-46b9-8d26-c617ce3daf3a
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/10/2017
ms.author: borisb

---
# Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux VMs in Azure
 [Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) allows cloud providers (such as Azure) to mirror Red Hat-hosted repository content, create custom repositories with Azure-specific content, and make it available to end-user VMs.

Red Hat Enterprise Linux (RHEL) Pay-As-You-Go (PAYG) images come preconfigured to access Azure RHUI. You don't need to do any additional configuration - run `sudo yum update` after your RHEL instance is ready to get the latest updates. This service is included as part of RHEL PAYG software fees.

## Important information about Azure RHUI

1. RHUI currently supports only the latest minor release in a given RHEL family (RHEL6 or RHEL7). RHEL VM instance connected to RHUI upgrades to the latest minor version when you run `sudo yum update`. 

    For example, if you provision a VM from RHEL 7.2 PAYG image and run `sudo yum update`, you end up with RHEL 7.4 VM (current latest minor version in RHEL7 family).

    To avoid this behavior, you need to build your own image as described in [Create and Upload Red Hat-based virtual machine for Azure](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) article and connect it to a different update infrastructure ([directly to Red Hat content delivery servers](https://access.redhat.com/solutions/253273) or Red Hat Satellite server).

2. Access to the Azure-hosted RHUI is included in the RHEL PAYG image price. Unregistering a PAYG RHEL VM from the Azure-hosted RHUI does not convert the virtual machine into Bring-Your-Own-License (BYOL) type VM. If you register the same VM with another source of updates, you may be incurring _indirect_ double charges: first time for Azure RHEL software fee, and the second time for Red Hat subscription(s) that have been purchased previously. If you consistently need to use an update infrastructure other than Azure-hosted RHUI consider creating and deploying your own (BYOL-type) images as described in [Create and Upload Red Hat-based virtual machine for Azure](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

3. Two classes of RHEL PAYG images in Azure (RHEL for SAP HANA, RHEL for SAP Business Applications) are connected to dedicated RHUI channels that remain on the specific RHEL minor version as required for SAP certification. 

4. Access to Azure-hosted RHUI is limited to the VMs within [Microsoft Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). If you are proxying all VM traffic via on-premises network infrastructure, you may need to set up user-defined routes for the RHEL PAYG VMs to access the Azure RHUI.

### The IPs for the RHUI content delivery servers
RHUI is available in all regions where RHEL on-demand images are available. It currently includes all public regions listed on the [Azure status dashboard](https://azure.microsoft.com/status/) page, Azure US Government, and Azure Germany regions. 

If you are using network configuration to further restrict access from RHEL PAYG VMs, make sure the following IPs are allowed for `yum update` to work depending on the environment you are in. 

```
# Azure Global
13.91.47.76
40.85.190.91
52.187.75.218
52.174.163.213

# Azure US Government
13.72.186.193

# Azure Germany
51.5.243.77
51.4.228.145
```

## RHUI Azure Infrastructure Update

In September 2016 we deployed an updated Azure RHUI and in April 2017 we shut down the old Azure RHUI. If you have been using the RHEL PAYG images (or their snapshots) from September 2016 or later, you are automatically connecting to the new Azure RHUI. If, however, you have older snapshots/VMs, their configuration needs to be manually updated to access the Azure RHUI as described below.

The new Azure RHUI servers are deployed with [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/) so that a single endpoint (rhui-1.microsoft.com) can be used by any VM regardless of region. 

### Troubleshooting connection problems to Azure RHUI
If you are experiencing problems connecting to the Azure RHUI from your Azure RHEL PAYG VM, follow these steps
1. Inspect VM configuration for Azure RHUI endpoint

    Check if `/etc/yum.repos.d/rh-cloud.repo` file contains reference to `rhui-[1-3].microsoft.com` in baseurl of `[rhui-microsoft-azure-rhel*]` section of the file. If it is - you are using the new Azure RHUI.

    If it pointing to a location with the following pattern `mirrorlist.*cds[1-4].cloudapp.net` - the configuration update is required. You are using the old VM snapshot, update it to point to the new Azure RHUI.

2. Access to Azure-hosted RHUI is limited to the VMs within [Microsoft Azure Datacenter IP ranges] (https://www.microsoft.com/download/details.aspx?id=41653).
 
3. If you are using the new configuration, verified that the VM connects from the Azure IP range and still cannot connect to Azure RHUI - file a support case with Microsoft or Red Hat.

### Manual update procedure to use the Azure RHUI servers
This procedure is provided for reference only, RHEL PAYG images already have correct configuration to connect to the Azure RHUI.

Download (via curl) the public key signature

```bash
curl -o RPM-GPG-KEY-microsoft-azure-release https://download.microsoft.com/download/9/D/9/9d945f05-541d-494f-9977-289b3ce8e774/microsoft-sign-public.asc 
```

Verify the downloaded key

```bash
gpg --list-packets --verbose < RPM-GPG-KEY-microsoft-azure-release
```

Check the output, verify `keyid` and `user ID packet`:

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

Install the public key

```bash
sudo install -o root -g root -m 644 RPM-GPG-KEY-microsoft-azure-release /etc/pki/rpm-gpg
sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-microsoft-azure-release
```

Download, Verify, and Install Client RPM. 

> [!NOTE]
> Package versions change and if you are manually connecting to Azure RHUI you can find the latest version of the client package for each RHEL family by provisioning the latest image from the gallery.
> 

Download:
For RHEL 6

```bash
curl -o azureclient.rpm https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel6/rhui-azure-rhel6-2.1-32.noarch.rpm 
```

For RHEL 7

```bash
curl -o azureclient.rpm https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel7/rhui-azure-rhel7-2.1-19.noarch.rpm  
```

Verify:

```bash
rpm -Kv azureclient.rpm
```

Check in output that signature of the package is OK

```bash
azureclient.rpm:
    Header V3 RSA/SHA256 Signature, key ID be1229cf: OK
    Header SHA1 digest: OK (927a3b548146c95a3f6c1a5d5ae52258a8859ab3)
    V3 RSA/SHA256 Signature, key ID be1229cf: OK
    MD5 digest: OK (c04ff605f82f4be8c96020bf5c23b86c)
```

Install the RPM

```bash
sudo rpm -U azureclient.rpm
```

Upon completion, verify that you can access Azure RHUI form the VM.

## Next steps
To create a Red Hat Enterprise Linux VM from Azure Marketplace Pay-As-You-Go image and leverage Azure-hosted RHUI go to [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/). 