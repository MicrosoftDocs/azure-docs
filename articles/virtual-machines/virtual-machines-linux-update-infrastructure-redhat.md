<properties
   pageTitle="Red Hat Update Infrastructure (RHUI) | Microsoft Azure"
   description="Learn about Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux instances in Microsoft Azure"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="BorisB2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="09/22/2016"
   ms.author="borisb"/>

# Red Hat Update Infrastructure (RHUI) for on-demand Red Hat Enterprise Linux VMs in Azure

Virtual machines created from the on-demand Red Hat Enterprise Linux (RHEL) images available in Azure Marketplace are registered to access the Red Hat Update Infrastructure (RHUI) deployed in Azure.  The on-demand RHEL instances have access to a regional yum repository and able to receive incremental updates.

The yum repository list, which is managed by RHUI, is configured in your RHEL instance during provisioning. You don't need to do any additional configuration - run `yum update` after your RHEL instance is ready to get the latest updates.

> [AZURE.NOTE] Azure RHUI infrastructure has been recently updated (September 2016) and requires changes in the configuration of your existing RHEL instances for uninterrupted access to the Azure RHUI. Refer to the RHUI Azure Infrastructure Update section for details.


## RHUI Azure Infrastructure Update
As of September 2016, Azure has a new set of Red Hat Update Infrastructure (RHUI) servers. These servers are deployed with [Azure Traffic Manager]( https://azure.microsoft.com/services/traffic-manager/) so that a single endpoint (rhui-1.micrsoft.com) can be used by any VM regardless of region. They also use an SSL cert that is chained to a well-known Certificate Authority (Baltimore root). Making this update automatic would be dangerous for some customers that have ACLs or custom routing tables for the RHUI update servers, so this update is “opt-in.” Manual steps for onboarding to these new servers are available on this page, and a complete script for onboarding in an automated fashion (upon verification of the individual steps). The new RHEL PAYG images in the Azure Marketplace (versions dated September 2016 or later) will automatically point to the new Azure RHUI servers and do not require any additional action.

### The new Azure RHUI infrastructure onboarding timeline

| Date | Note |
| --- | --- |
|September 22, 2016 | RHUI servers and install directions available for use. VMs deployed using the new (September 2016 dated) RHEL PAYG marketplace images will automatically use the new RHUI servers, but existing VMs are “opt-in”
|November 1, 2016 | Legacy RHEL PAYG VM images (which use the old Azure RHUI servers) will be removed from the Azure Marketplace gallery
|January 16, 2017 | The old Azure RHUI servers will be decommissioned. Update all of your affected PAYG RHEL VMs by this time to maintain access to Azure RHUI

### The IPs for the new RHUI servers are

```
13.91.45.82
52.187.72.244
52.174.166.207
40.112.59.164
```

### Manual update procedure to use the new Azure RHUI servers

Download (via curl) the public key signature

```
curl -o RPM-GPG-KEY-microsoft-azure-release https://download.microsoft.com/download/9/D/9/9d945f05-541d-494f-9977-289b3ce8e774/microsoft-sign-public.asc 
```

Verify the downloaded key

```
gpg --list-packets --verbose < RPM-GPG-KEY-microsoft-azure-release
```

Check the output, verify `keyid` and `user ID packet`:

```
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

```
sudo install -o root -g root -m 644 RPM-GPG-KEY-microsoft-azure-release /etc/pki/rpm-gpg
sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-microsoft-azure-release
```

Download, Verify, and Install Client RPM

Download:
For RHEL 6

```
curl -o azureclient.rpm https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel6/rhui-azure-rhel6-2.0-2.noarch.rpm 
```

For RHEL 7

```
curl -o azureclient.rpm https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel7/rhui-azure-rhel7-2.0-2.noarch.rpm  
```

Verify:

```
rpm -Kv azureclient.rpm
```

Check in output that signature of the package is OK

```
azureclient.rpm:
    Header V3 RSA/SHA256 Signature, key ID be1229cf: OK
    Header SHA1 digest: OK (927a3b548146c95a3f6c1a5d5ae52258a8859ab3)
    V3 RSA/SHA256 Signature, key ID be1229cf: OK
    MD5 digest: OK (c04ff605f82f4be8c96020bf5c23b86c)
```

Install the RPM

```
sudo rpm -U azureclient.rpm
```

Upon completion, verify that you can access Azure RHUI form the VM

### All-in-one script for automating the above task
Use the following script as needed to automate the task of updating affected VMs to the new Azure RHUI servers.

```
# Download key
curl -o RPM-GPG-KEY-microsoft-azure-release https://download.microsoft.com/download/9/D/9/9d945f05-541d-494f-9977-289b3ce8e774/microsoft-sign-public.asc 

# Validate key
if ! gpg --list-packets --verbose < RPM-GPG-KEY-microsoft-azure-release | grep -q "keyid: EB3E94ADBE1229CF"; then
    echo "Keyfile azure.asc NOT valid. Exiting."
    exit 1
fi

# Install Key
sudo install -o root -g root -m 644 RPM-GPG-KEY-microsoft-azure-release /etc/pki/rpm-gpg
sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-microsoft-azure-release

# Download RPM package
if grep -q "release 7" /etc/redhat-release; then
    ver=7
elif  grep -q "release 6" /etc/redhat-release; then
    ver=6
else
    echo "Version not supported, exiting"
    exit 1
fi

url=https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel$ver/rhui-azure-rhel$ver-2.0-2.noarch.rpm
curl -o azureclient.rpm "$url"

# Verify package
if ! rpm -Kv azureclient.rpm | grep -q "key ID be1229cf: OK"; then
    echo "RPM failed validation ($url)"
    exit 1
fi

# Install package
sudo rpm -U azureclient.rpm
```

## RHUI overview
[Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) offers a highly scalable solution to manage yum repository content for Red Hat Enterprise Linux cloud instances that are hosted by Red Hat-certified cloud providers. Based on the upstream Pulp project, RHUI allows cloud providers to locally mirror Red Hat-hosted repository content, create custom repositories with their own content, and make those repositories available to a large group of end users through a load-balanced content delivery system.

## Regions where RHUI is available
RHUI is available in all regions where RHEL on-demand images are available. It currently includes all public regions listed on the [Azure status dashboard](https://azure.microsoft.com/status/) page. RHUI access for VMs provisioned from RHEL on-demand images is included in their price. Regional/national cloud availability will be updated as we expand RHEL on-demand availability in the future.

> [AZURE.NOTE] Access to Azure-hosted RHUI is limited to the VMs within [Microsoft Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

## Get updates from another update repository

If you need to get updates from a different update repository (instead of Azure-hosted RHUI) you will need to unregister your instances from RHUI and re-register them with the desired update infrastructure (such as Red Hat Satellite or Red Hat Customer Portal CDN). You will need appropriate Red Hat subscriptions for these services and registration for [Red Hat Cloud Access in Azure](https://access.redhat.com/ecosystem/partners/ccsp/microsoft-azure).

To unregister RHUI and reregister to your update infrastructure follow the below steps.

1.	Edit /etc/yum.repos.d/rh-cloud.repo and change all `enabled=1` to `enabled=0`. For example:

        # sed -i 's/enabled=1/enabled=0/g' /etc/yum.repos.d/rh-cloud.repo

2.	Edit /etc/yum/pluginconf.d/rhnplugin.conf and change `enabled=0` to `enabled=1`.
3.	Then register with the desired infrastructure, such as Red Hat Customer Portal. Follow Red Hat solution guide on [how to register and subscribe a system to the Red Hat Customer Portal](https://access.redhat.com/solutions/253273).

> [AZURE.NOTE] Access to the Azure-hosted RHUI is included in the RHEL Pay-As-You-Go (PAYG) image price. Unregistering a PAYG RHEL VM from the Azure-hosted RHUI does not convert the virtual machine into Bring-Your-Own-License (BYOL) type VM and hence you may be incurring double charges if you register the same VM with another source of updates. 
> 
> If you consistently need to use an update infrastructure other than Azure-hosted RHUI consider creating and deploying your own (BYOL-type) images as described in [Create and Upload Red Hat-based virtual machine for Azure](virtual-machines-linux-redhat-create-upload-vhd.md) article.

## Next steps
To create a Red Hat Enterprise Linux VM from Azure Marketplace Pay-As-You-Go image and leverage Azure-hosted RHUI go to [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/). You will be able to use `yum update` in your RHEL instance without any additional setup.