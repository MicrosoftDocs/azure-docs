---
title: Red Hat Update Infrastructure | Microsoft Docs
description: Learn about Red Hat Update Infrastructure for on-demand Red Hat Enterprise Linux instances in Microsoft Azure
author: mamccrea
ms.service: virtual-machines
ms.subservice: redhat
ms.collection: linux
ms.topic: article
ms.date: 02/10/2020
ms.reviewer: cynthn
ms.author: mamccrea
---
# Red Hat Update Infrastructure for on-demand Red Hat Enterprise Linux VMs in Azure

**Applies to:** :heavy_check_mark: Linux VMs 

 [Red Hat Update Infrastructure](https://access.redhat.com/products/red-hat-update-infrastructure) (RHUI) allows cloud providers, such as Azure, to mirror Red Hat-hosted repository content, create custom repositories with Azure-specific content, and make it available to end-user VMs.

Red Hat Enterprise Linux (RHEL) Pay-As-You-Go (PAYG) images come preconfigured to access Azure RHUI. No additional configuration is needed. To get the latest updates, run `sudo yum update` after your RHEL instance is ready. This service is included as part of the RHEL PAYG software fees.

Additional information on RHEL images in Azure, including publishing and retention policies, is available [Overview of Red Hat Enterprise Linux images in Azure](./redhat-images.md).

Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.

> [!IMPORTANT]
> RHUI is intended only for pay-as-you-go (PAYG) images. For custom and golden images, also known as bring-your-own-subscription (BYOS), the system needs to be attached to RHSM or Satellite in order to receive updates. See [Red Hat article](https://access.redhat.com/solutions/253273) for more details.


## Important information about Azure RHUI

* Azure RHUI is the update infrastructure that supports all RHEL PAYG VMs created in Azure. This does not preclude you from registering your PAYG RHEL VMs with Subscription Manager or Satellite or other source of updates, but doing so with a PAYG VM will result in indirect double-billing. See the following point for details.
* Access to the Azure-hosted RHUI is included in the RHEL PAYG image price. If you unregister a PAYG RHEL VM from the Azure-hosted RHUI that does not convert the virtual machine into a bring-your-own-license (BYOL) type of VM. If you register the same VM with another source of updates, you might incur _indirect_ double charges. You're charged the first time for the Azure RHEL software fee. You're charged the second time for Red Hat subscriptions that were purchased previously. If you consistently need to use an update infrastructure other than Azure-hosted RHUI, consider registering to use the [RHEL BYOS images](./byos.md).

* RHEL SAP PAYG images in Azure (RHEL for SAP, RHEL for SAP HANA, and RHEL for SAP Business Applications) are connected to dedicated RHUI channels that remain on the specific RHEL minor version as required for SAP certification.

* Access to Azure-hosted RHUI is limited to the VMs within the [Azure datacenter IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=56519). If you're proxying all VM traffic via an on-premises network infrastructure, you might need to set up user-defined routes for the RHEL PAYG VMs to access the Azure RHUI. If that is the case, user-defined routes will need to be added for _all_ RHUI IP addresses.


## Image update behavior

As of April 2019, Azure offers RHEL images that are connected to Extended Update Support (EUS) repositories by default and RHEL images that come connected to the regular (non-EUS) repositories by default. More details on RHEL EUS are available in Red Hat's [version lifecycle documentation](https://access.redhat.com/support/policy/updates/errata) and [EUS documentation](https://access.redhat.com/articles/rhel-eus). The default behavior of `sudo yum update` will vary depending which RHEL image you provisioned from, as different images are connected to different repositories.

For a full image list, run `az vm image list --offer RHEL --all -p RedHat --output table` using the Azure CLI.

### Images connected to non-EUS repositories

If you provision a VM from a RHEL image that is connected to non-EUS repositories, you will be upgraded to the latest RHEL minor version when you run `sudo yum update`. For example, if you provision a VM from an RHEL 7.4 PAYG image and run `sudo yum update`, you end up with an RHEL 7.8 VM (the latest minor version in the RHEL7 family).

Images that are connected to non-EUS repositories will not contain a minor version number in the SKU. The SKU is the third element in the URN (full name of the image). For example, all of the following images come attached to non-EUS repositories:

```output
RedHat:RHEL:7-LVM:7.9.2023032012
RedHat:RHEL:8-LVM:8.7.2023022813
RedHat:RHEL:9-lvm:9.1.2022112101
RedHat:rhel-raw:7-raw:7.9.2022040605
RedHat:rhel-raw:8-raw:8.6.2022052413
RedHat:rhel-raw:9-raw:9.1.2022112101
```

Note that the SKUs are either X-LVM or X-RAW. The minor version is indicated in the version (fourth element in the URN) of these images.

### Images connected to EUS repositories

If you provision a VM from a RHEL image that is connected to EUS repositories, you will not be upgraded to the latest RHEL minor version when you run `sudo yum update`. This is because the images connected to EUS repositories are also version-locked to their specific minor version.

Images connected to EUS repositories will contain a minor version number in the SKU. For example, all of the following images come attached to EUS repositories:

```output
RedHat:RHEL:7_9:7.9.20230301107
RedHat:RHEL:8_7:8.7.2023022801
RedHat:RHEL:9_1:9.1.2022112113 
```

## RHEL EUS and version-locking RHEL VMs

Extended Update Support (EUS) repositories are available to customers who may want to lock their RHEL VMs to a certain RHEL minor release after provisioning the VM. You can version-lock your RHEL VM to a specific minor version by updating the repositories to point to the Extended Update Support repositories. You can also undo the EUS version-locking operation.

>[!NOTE]
> EUS is not supported on RHEL Extras. This means that if you are installing a package that is usually available from the RHEL Extras channel, you will not be able to do so while on EUS. The Red Hat Extras Product Life Cycle is detailed on the [Red Hat Enterprise Linux Extras Product Life Cycle - Red Hat Customer Portal](https://access.redhat.com/support/policy/updates/extras/) page.

At the time of this writing, EUS support has ended for RHEL <= 7.4. See the "Red Hat Enterprise Linux Extended Maintenance" section in the [Red Hat documentation](https://access.redhat.com/support/policy/updates/errata/#Long_Support) for more details.
* RHEL 7.4 EUS support ends August 31, 2019
* RHEL 7.5 EUS support ends April 30, 2020
* RHEL 7.6 EUS support ends May 31, 2021
* RHEL 7.7 EUS support ends August 30, 2021
* RHEL 8.4 EUS support ends May 31, 2023
* RHEL 8.6 EUS support ends May 31, 2024
* RHEL 9.0 EUS support ends May 31, 2024

### Switch a RHEL VM 7.x to EUS (version-lock to a specific minor version)
Use the following instructions to lock a RHEL 7.x VM to a particular minor release (run as root):

>[!NOTE]
> This only applies for RHEL 7.x versions for which EUS is available. At the time of this writing, this includes RHEL 7.2-7.7. More details are available at the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
1. Disable non-EUS repos:
    ```bash
    sudo yum --disablerepo='*' remove 'rhui-azure-rhel7'
    ```

1. Add EUS repos:
    ```bash
    sudo yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel7-eus.config' install 'rhui-azure-rhel7-eus'
    ```

1. Lock the `releasever` variable (run as root):
    ```bash
    sudo echo $(. /etc/os-release && echo $VERSION_ID) > /etc/yum/vars/releasever
    ```

    >[!NOTE]
    > The above instruction will lock the RHEL minor release to the current minor release. Enter a specific minor release if you are looking to upgrade and lock to a later minor release that is not the latest. For example, `echo 7.5 > /etc/yum/vars/releasever` will lock your RHEL version to RHEL 7.5.
1. Update your RHEL VM
    ```bash
    sudo yum update
    ```

### Switch a RHEL VM 8.x to EUS (version-lock to a specific minor version)
Use the following instructions to lock a RHEL 8.x VM to a particular minor release (run as root):

>[!NOTE]
> This only applies for RHEL 8.x versions for which EUS is available. At the time of this writing, this includes RHEL 8.1-8.2. More details are available at the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
1. Disable non-EUS repos:
    ```bash
    sudo yum --disablerepo='*' remove 'rhui-azure-rhel8'
    ```

1. Get the EUS repos config file:
    ```bash
    sudo wget https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel8-eus.config
    ```

1. Add EUS repos:
    ```bash
    sudo yum --config=rhui-microsoft-azure-rhel8-eus.config install rhui-azure-rhel8-eus
    ```

1. Lock the `releasever` variable (run as root):
    ```bash
    sudo echo $(. /etc/os-release && echo $VERSION_ID) > /etc/yum/vars/releasever
    ```

    >[!NOTE]
    > The above instruction will lock the RHEL minor release to the current minor release. Enter a specific minor release if you are looking to upgrade and lock to a later minor release that is not the latest. For example, `echo 8.1 > /etc/yum/vars/releasever` will lock your RHEL version to RHEL 8.1.
    >[!NOTE]
    > If there are permission issues to access the releasever, you can edit the file using your favorite editor and add the image version details and save it.  
1. Update your RHEL VM
    ```bash
    sudo yum update
    ```


### Switch a RHEL 7.x VM back to non-EUS (remove a version lock)
Run the following as root:
1. Remove the `releasever` file:
    ```bash
    sudo rm /etc/yum/vars/releasever
     ```

1. Disable EUS repos:
    ```bash
    sudo yum --disablerepo='*' remove 'rhui-azure-rhel7-eus'
   ```

1. Configure RHEL VM
    ```bash
    sudo yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel7.config' install 'rhui-azure-rhel7'
    ```

1. Update your RHEL VM
    ```bash
    sudo yum update
    ```

### Switch a RHEL 8.x VM back to non-EUS (remove a version lock)
Run the following as root:
1. Remove the `releasever` file:
    ```bash
    sudo rm /etc/yum/vars/releasever
     ```

1. Disable EUS repos:
    ```bash
    sudo yum --disablerepo='*' remove 'rhui-azure-rhel8-eus'
   ```

1. Get the regular repos config file:
    ```bash
    sudo wget https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel8.config
    ```

1. Add non-EUS repos:
    ```bash
    sudo yum --config=rhui-microsoft-azure-rhel8.config install rhui-azure-rhel8
    ```

1. Update your RHEL VM
    ```bash
    sudo yum update
    ```

## The IPs for the RHUI content delivery servers

RHUI is available in all regions where RHEL on-demand images are available. It currently includes all public regions listed on the [Azure status dashboard](https://azure.microsoft.com/status/) page, Azure US Government, and Microsoft Azure Germany regions.

If you're using a network configuration to further restrict access from RHEL PAYG VMs, make sure the following IPs are allowed for `yum update` to work depending on the environment you're in:


```output
# Azure Global
RHUI 3 
13.91.47.76
40.85.190.91
52.187.75.218
52.174.163.213
52.237.203.198

RHUI 4
westeurope - 52.136.197.163
southcentralus - 20.225.226.182
eastus - 52.142.4.99
australiaeast - 20.248.180.252
southeastasia - 20.24.186.80

# Azure US Government (To be deprecated after 10th April 2023. For RHUI 4 connections, use public RHUI IPs as provided above) 
13.72.186.193
13.72.14.155
52.244.249.194

```
>[!NOTE]
>The new Azure US Government images,as of January 2020, will be using Public IP mentioned under Azure Global header above.

>[!NOTE]
>Also, note that Azure Germany is deprecated in favor of public Germany regions. Recommendation for Azure Germany customers is to start pointing to public RHUI using the steps on the [Red Hat Update Infrastructure](#manual-update-procedure-to-use-the-azure-rhui-servers) page.

## Azure RHUI Infrastructure


### Update expired RHUI client certificate on a VM

If you experience RHUI certificate issues from your Azure RHEL PAYG VM, reference the [Troubleshooting guidance for RHUI certificate issues in Azure](/troubleshoot/azure/virtual-machines/troubleshoot-linux-rhui-certificate-issues).

 

### Troubleshoot connection problems to Azure RHUI
If you experience problems connecting to Azure RHUI from your Azure RHEL PAYG VM, follow these steps:

1. Inspect the VM configuration for the Azure RHUI endpoint:

    1. Check if the `/etc/yum.repos.d/rh-cloud.repo` file contains a reference to `rhui-[1-3].microsoft.com` in the `baseurl` of the `[rhui-microsoft-azure-rhel*]` section of the file. If it does, you're using the new Azure RHUI.

    1. If it points to a location with the following pattern, `mirrorlist.*cds[1-4].cloudapp.net`, a configuration update is required. You're using the old VM snapshot, and you need to update it to point to the new Azure RHUI.

1. Access to Azure-hosted RHUI is limited to VMs within the [Azure datacenter IP ranges](https://www.microsoft.com/en-us/download/details.aspx?id=56519).

1. If you're using the new configuration, have verified that the VM connects from the Azure IP range, and still can't connect to Azure RHUI, file a support case with Microsoft or Red Hat.

### Infrastructure update

In September 2016, we deployed an updated Azure RHUI. In April 2017, we shut down the old Azure RHUI. If you have been using the RHEL PAYG images (or their snapshots) from September 2016 or later, you're automatically connecting to the new Azure RHUI. If, however, you have older snapshots on your VMs, you need to manually update their configuration to access the Azure RHUI as described in a following section.

The new Azure RHUI servers are deployed with [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/). In Traffic Manager, a single endpoint (rhui-1.microsoft.com) can be used by any VM, regardless of region.

### Manual update procedure to use the Azure RHUI servers
This procedure is provided for reference only. RHEL PAYG images already have the correct configuration to connect to Azure RHUI. To manually update the configuration to use the Azure RHUI servers, complete the following steps:

- For RHEL 6:
  ```bash
  sudo yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel6.config' install 'rhui-azure-rhel6'
  ```

- For RHEL 7:
  ```bash
  sudo yum --config='https://rhelimage.blob.core.windows.net/repositories/rhui-microsoft-azure-rhel7.config' install 'rhui-azure-rhel7'
  ```

- For RHEL 8:
    1. Create a config file:
        ```bash
        cat <<EOF > rhel8.config
        [rhui-microsoft-azure-rhel8]
        name=Microsoft Azure RPMs for Red Hat Enterprise Linux 8
        baseurl=https://rhui-1.microsoft.com/pulp/repos/microsoft-azure-rhel8 https://rhui-2.microsoft.com/pulp/repos/microsoft-azure-rhel8 https://rhui-3.microsoft.com/pulp/repos/microsoft-azure-rhel8
        enabled=1
        gpgcheck=1
        gpgkey=https://rhelimage.blob.core.windows.net/repositories/RPM-GPG-KEY-microsoft-azure-release sslverify=1
        EOF
        ```
    1. Save the file and run the following command:
        ```bash
        sudo dnf --config rhel8.config install 'rhui-azure-rhel8'
        ```
    1. Update your VM
        ```bash
        sudo dnf update
        ```


## Next steps
* To create a Red Hat Enterprise Linux VM from an Azure Marketplace PAYG image and to use Azure-hosted RHUI, go to the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/redhat.rhel-20190605).
* To learn more about the Red Hat images in Azure, go to the [documentation page](./redhat-images.md).
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.
