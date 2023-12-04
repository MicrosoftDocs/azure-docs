---
title: CentOS end-of-life (EOL) guidance
description: Understand your options for moving CentOS workloads
author: clausw
ms.service: virtual-machines
ms.subservice:
ms.custom: devx-track-linux, devx-track-azurecli, linux-related-content
ms.collection: linux
ms.topic: article
ms.date: 12/1/2023
ms.author: ClausWieser
---

# CentOS end-of-life (EOL) guidance

In September 2019 Red Hat announced its intent to sunset CentOS and replace it with CentOS Stream, a new / upstream platform for the CentOS community. For more information, see  [Transforming the development experience within CentOS][01].

> [!IMPORTANT]
> CentOS images will be out of support starting 6/30/2024 with no more software updates or security patches. Customers will need to move to a supported distribution and version, or purchase Extended Support from a partner for continued supportability.

## Impact for CentOS users

CentOS 7 and 8 are the final releases of CentOS Linux. The end-of-life dates for CentOS 7 and 8 are:

- CentOS 8 - December 31, 2021
- CentOS 7 - June 30, 2024

Workloads running on these CentOS versions will need to be migrated to alternate platforms to continue to get updates and security patches. This article will discuss some of the options available as you start planning for the future of your workload.

## Migration options

There are several options for CentOS customers to move to a supported OS. The decision of where and how to move will largely be determined by three things:

- Your need to retain compatibility with CentOS / RHEL
- Community supported distribution (e.g. Debian, Alma, etc.) vs. commercial distribution (e.g., RHEL)
- Configuration and image source(s) of your CentOS estate in Azure

If CentOS compatibility is required,  migration to Red Hat Enterprise Linux, a commercial distribution, is a low-risk option. There are also several alternatives such as Oracle Linux, Alma Linux, Rocky Linux, etc.

If your workload is supported by multiple distributions, you may want to consider moving to another distribution, either community based or commercial.

As you evaluate your end state, consider whether performing an in-place conversion (multiple distributions provide tools for this purpose) is preferable vs. taking this opportunity to start with a clean slate and a new VM / OS / image. Microsoft recommends starting with a fresh VM / OS.

There are several partners offering extended support for CentOS 7, which may provide you with  additional time to migrate.

SUSE: [Liberty Linux: Proven enterprise support for RHEL & CentOS][02]
OpenLogic: [CentOS Transitional Support][03]
TuxCare: Extended Lifecycle Support (tuxcare.com)

Please see the [Endorsed Distribution][04] page for details on Azure endorsed distributions and images.


## Convert to Ubuntu Pro using the Azure CLI

The following command enables Ubuntu Pro on a virtual machine in Azure:

```Azure CLI
az vm update -g myResourceGroup -n myVmName --license-type UBUNTU_PRO
```

Execute these commands inside the VM:

```bash
sudo apt install ubuntu-advantage-tools
sudo pro auto-attach
```

If the `pro --version` is lower than 28, execute this command:

```bash
sudo apt install ubuntu-advantage-tools
```

## Validate the license

use the `pro status --all` command to validate the license:

Expected output:

```output
SERVICE      ENTITLED    STATUS    DESCRIPTION
cc-eal       yes         disabled  Common Criteria EAL2 Provisioning Packages
cis          yes         disables  Security compliance and audit tools
esm-apps     yes         enabled   Expanded Security Maintenance and audit tools
esm-infra    yes         enabled   Expanded Security Maintenance for infrastructure
fips         yes         disabled  NIST-certified core packages
fips-updates yes         disabled  NIST-certified core packages with priority security updates
livepatch    yes         enabled   Canonical Livepatch service
```

## Create an Ubuntu Pro VM using the Azure CLI

You can create a new VM using the Ubuntu Server images and apply Ubuntu Pro at the time of creation.
The following command enables Ubuntu Pro on a virtual machine in Azure:

```Azure CLI
az vm update -g myResourceGroup -n myVmName --license-type UBUNTU_PRO
```

Execute these commands inside the VM:

```bash
sudo apt install ubuntu-advantage-tools
sudo pro auto-attach
```

> [!NOTE]
> For systems with advantage tools using version 28 or higher, installed the system will perform a
> `pro attach` during a reboot.

## Check licensing model using the Azure CLI

> [!TIP]
> You can query the metadata in _Azure Instance Metadata Service_ to determine the virtual machine's
> _licenseType_ value. You can use the `az vm get-instance-view` command to check the status. Look
> for the _licenseType_ field in the response. If the field exists and the value is UBUNTU_PRO, your
> virtual machine has Ubuntu Pro enabled. [Learn more about attested metadata][02].

```Azure CLI
az vm get-instance-view -g MyResourceGroup -n MyVm
```

## Billing

Visit the [pricing calculator][03] for more details on Ubuntu Pro pricing. To cancel the Pro
subscription during the preview period, open a support ticket through the Azure portal.


## Frequently Asked Questions

**Does shutting down the machine stop billing?**

Launching Ubuntu Pro from Azure Marketplace is you pay as you go and only charges for running
machines.

**Are there volume discounts?**

Yes. Contact your Microsoft sales representative.

**Are Reserved Instances available?**

Yes.

**If the customer doesn't perform the `auto attach` function, will they still get attached to pro on reboot?**

If the customer doesn't perform the _auto attach_, they still get the Pro attached upon reboot.
However, this action only applies if they're using version 28 of the Pro client.

- For Ubuntu Jammy and Focal, this process works as expected.
- For Ubuntu Bionic and Xenial, this process doesn't work due to older versions of the Pro client installed.

<!-- link references -->
[01]: https://www.redhat.com/en/blog/transforming-development-experience-within-centos
[02]: https://www.suse.com/products/suse-liberty-linux/
[03]: https://ter.li/nnd2rf
[04]: https://learn.microsoft.com/azure/virtual-machines/linux/endorsed-distros
