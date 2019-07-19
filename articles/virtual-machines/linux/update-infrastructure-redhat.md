---
title: Red Hat Update Infrastructure | Microsoft Docs
description: Learn about Red Hat Update Infrastructure for on-demand Red Hat Enterprise Linux instances in Microsoft Azure
services: virtual-machines-linux
documentationcenter: ''
author: BorisB2015
manager: gwallace
editor: ''

ms.assetid: f495f1b4-ae24-46b9-8d26-c617ce3daf3a
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 6/6/2019
ms.author: borisb

---
# Red Hat Update Infrastructure for on-demand Red Hat Enterprise Linux VMs in Azure
 [Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) (RHUI) allows cloud providers, such as Azure, to mirror Red Hat-hosted repository content, create custom repositories with Azure-specific content, and make it available to end-user VMs.

Red Hat Enterprise Linux (RHEL) Pay-As-You-Go (PAYG) images come preconfigured to access Azure RHUI. No additional configuration is needed. To get the latest updates, run `sudo yum update` after your RHEL instance is ready. This service is included as part of the RHEL PAYG software fees.

Additional information on RHEL images in Azure, including publishing and retention policies, is available [here](./rhel-images.md).

Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.

## Important information about Azure RHUI
* Azure RHUI is the update infrastructure that supports all RHEL PAYG VMs created in Azure. This does not preclude you from registering your PAYG RHEL VMs with Subscription Manager or Satellite or other source of updates, but doing so with a PAYG VM will result in indirect double-billing. See the following point for details.
* Access to the Azure-hosted RHUI is included in the RHEL PAYG image price. If you unregister a PAYG RHEL VM from the Azure-hosted RHUI that does not convert the virtual machine into a bring-your-own-license (BYOL) type of VM. If you register the same VM with another source of updates, you might incur _indirect_ double charges. You're charged the first time for the Azure RHEL software fee. You're charged the second time for Red Hat subscriptions that were purchased previously. If you consistently need to use an update infrastructure other than Azure-hosted RHUI, consider registering to use the [RHEL BYOS images](https://aka.ms/rhel-byos).
* The default behavior of RHUI is to upgrade your RHEL VM to the latest minor version when you run `sudo yum update`.

    For example, if you provision a VM from an RHEL 7.4 PAYG image and run `sudo yum update`, you end up with an RHEL 7.6 VM (the latest minor version in the RHEL7 family).

    To avoid this behavior, you can switch to [Extended Update Support channels](#rhel-eus-and-version-locking-rhel-vms) or build your own image as described in the [Create and upload a Red Hat-based virtual machine for Azure](redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) article. If you build your own image, you need to connect it to a different update infrastructure ([directly to Red Hat content delivery servers](https://access.redhat.com/solutions/253273) or a [Red Hat Satellite server](https://access.redhat.com/products/red-hat-satellite)).



* RHEL SAP PAYG images in Azure (RHEL for SAP, RHEL for SAP HANA, and RHEL for SAP Business Applications) are connected to dedicated RHUI channels that remain on the specific RHEL minor version as required for SAP certification.

* Access to Azure-hosted RHUI is limited to the VMs within the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). If you're proxying all VM traffic via an on-premises network infrastructure, you might need to set up user-defined routes for the RHEL PAYG VMs to access the Azure RHUI.

## RHEL EUS and version-locking RHEL VMs
Some customers may want to lock their RHEL VMs to a certain RHEL minor release. You can version-lock your RHEL VM to a specific minor version by updating the repositories to point to the Extended Update Support repositories. You can also undo the EUS version-locking operation.

>[!NOTE]
> EUS is not supported on RHEL Extras. This means that if you are installing a package that is usually available from the RHEL Extras channel, you will not be able to do so while on EUS. The Red Hat Extras Product Life Cycle is detailed [here](https://access.redhat.com/support/policy/updates/extras/).

At the time of this writing, EUS support has ended for RHEL <= 7.3. See the "Red Hat Enterprise Linux Longer Support Add-Ons" section in the [Red Hat documentation](https://access.redhat.com/support/policy/updates/errata/) for more details.
* RHEL 7.4 EUS support ends August 31, 2019
* RHEL 7.5 EUS support ends April 30, 2020
* RHEL 7.6 EUS support ends October 31, 2020

### Switch a RHEL VM to EUS (version-lock to a specific minor version)
Use the following instructions to lock a RHEL VM to a particular minor release (run as root):

>[!NOTE]
> This only applies for RHEL versions for which EUS is available. At the time of this writing, this includes RHEL 7.2-7.6. More details are available at the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.

1. Disable non-EUS repos:
    ```bash
    yum --disablerepo='*' remove 'rhui-azure-rhel7'
    ```

1. Add EUS repos:
    ```bash
    yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel7-eus.config' install 'rhui-azure-rhel7-eus'
    ```

1. Lock the releasever variable (run as root):
    ```bash
    echo $(. /etc/os-release && echo $VERSION_ID) > /etc/yum/vars/releasever
    ```

    >[!NOTE]
    > The above instruction will lock the RHEL minor release to the current minor release. Enter a specific minor release if you are looking to upgrade and lock to a later minor release that is not the latest. For example, `echo 7.5 > /etc/yum/vars/releasever` will lock your RHEL version to RHEL 7.5

1. Update your RHEL VM
    ```bash
    sudo yum update
    ```

### Switch a RHEL VM back to non-EUS (remove a version lock)
Run the following as root:
1. Remove the releasever file:
    ```bash
    rm /etc/yum/vars/releasever
     ```

1. Disable EUS repos:
    ```bash
    yum --disablerepo='*' remove 'rhui-azure-rhel7-eus'
   ```

1. Update your RHEL VM
    ```bash
    sudo yum update
    ```

## The IPs for the RHUI content delivery servers

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
13.72.14.155
52.244.249.194

# Azure Germany
51.5.243.77
51.4.228.145
```

## Azure RHUI Infrastructure


### Update expired RHUI client certificate on a VM

If you are using an older RHEL VM image, for example, RHEL 7.4 (image URN: `RedHat:RHEL:7.4:7.4.2018010506`), you will experience connectivity issues to RHUI due to a now-expired SSL client certificate. The error you see may look like _"SSL peer rejected your certificate as expired"_ or _"Error: Cannot retrieve repository metadata (repomd.xml) for repository: ... Please verify its path and try again"_. To overcome this problem, please update the RHUI client package on the VM using the following command:

```bash
sudo yum update -y --disablerepo='*' --enablerepo='*microsoft*'
```

Alternatively, running `sudo yum update` may also update the client certificate package (depending on your RHEL version), despite "expired SSL certificate" errors you will see for other repositories. If this update is successful, normal connectivity to other RHUI repositories should be restored, so you will be able to run `sudo yum update` successfully.

If you run into a 404 error while running a `yum update`, try the following to refresh your yum cache:
```bash
sudo yum clean all;
sudo yum makecache
```

### Troubleshoot connection problems to Azure RHUI
If you experience problems connecting to Azure RHUI from your Azure RHEL PAYG VM, follow these steps:

1. Inspect the VM configuration for the Azure RHUI endpoint:

    1. Check if the `/etc/yum.repos.d/rh-cloud.repo` file contains a reference to `rhui-[1-3].microsoft.com` in the `baseurl` of the `[rhui-microsoft-azure-rhel*]` section of the file. If it does, you're using the new Azure RHUI.

    1. If it points to a location with the following pattern, `mirrorlist.*cds[1-4].cloudapp.net`, a configuration update is required. You're using the old VM snapshot, and you need to update it to point to the new Azure RHUI.

1. Access to Azure-hosted RHUI is limited to VMs within the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653).

1. If you're using the new configuration, have verified that the VM connects from the Azure IP range, and still can't connect to Azure RHUI, file a support case with Microsoft or Red Hat.

### Infrastructure update

In September 2016, we deployed an updated Azure RHUI. In April 2017, we shut down the old Azure RHUI. If you have been using the RHEL PAYG images (or their snapshots) from September 2016 or later, you're automatically connecting to the new Azure RHUI. If, however, you have older snapshots on your VMs, you need to manually update their configuration to access the Azure RHUI as described in a following section.

The new Azure RHUI servers are deployed with [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/). In Traffic Manager, a single endpoint (rhui-1.microsoft.com) can be used by any VM, regardless of region.

### Manual update procedure to use the Azure RHUI servers
This procedure is provided for reference only. RHEL PAYG images already have the correct configuration to connect to Azure RHUI. To manually update the configuration to use the Azure RHUI servers, complete the following steps:

- For RHEL 6:
  ```bash
  yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel6.config' install 'rhui-azure-rhel6'
  ```

- For RHEL 7:
  ```bash
  yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel7.config' install 'rhui-azure-rhel7'
  ```

## Next steps
* To create a Red Hat Enterprise Linux VM from an Azure Marketplace PAYG image and to use Azure-hosted RHUI, go to the [Azure Marketplace](https://azure.microsoft.com/marketplace/partners/redhat/).
* To learn more about the Red Hat images in Azure, go to the [documentation page](./rhel-images.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
