---
title: In-place upgrade to Ubuntu Pro Linux images on Azure
description: Learn how to do an in-place upgrade from Ubuntu Server to Ubuntu Pro
author: anujkmaurya
ms.service: virtual-machines
ms.subservice: billing
ms.custom: devx-track-linux, devx-track-azurecli, linux-related-content
ms.collection: linux
ms.topic: article
ms.date: 9/12/2023
ms.author: anujmaurya
---

# Ubuntu Server to Ubuntu Pro in-place upgrade on Azure

Customers can now upgrade their Ubuntu Server (version 16.04 or higher) virtual machines to Ubuntu
Pro without redeployment or downtime. This method has proven useful for customers wishing to convert
their servers from Ubuntu 18.04 LTS now that it's reached End of Life (EOL).

> [!IMPORTANT]
> Canonical has announced that Ubuntu 18.04 LTS (Bionic Beaver) OS images are now
> [out of standard support][01]. This means that Canonical will no longer offer technical support,
> software updates, or security patches for this version. Customers wishing to continue using Ubuntu
> 18.04 LTS need to upgrade to Ubuntu Pro for continued supportability.

## What's Ubuntu Pro?

Ubuntu Pro is a cross-cloud OS, optimized for Azure, and security maintained for 10 years. The
secure use of open-source software allows the operating system to use the latest technologies while
meeting internal governance and compliance requirements. Ubuntu Pro 18.04 LTS remains fully
compatible with Ubuntu Server 18.04 LTS, with more security enabled by default. It includes
compliance and management tools in a form suitable for small to large-scale Linux operations. Ubuntu
Pro 18.04 LTS is fully supported until April 2028. Ubuntu Pro provides Extended Security Maintenance
(ESM) for infrastructure and applications support, providing security patching for all Ubuntu
packages.

## Why developers and devops choose Ubuntu Pro for Azure

- Access to security updates for 23,000+ packages including Apache Kafka, NGINX, MongoDB, Redis and
  PostgreSQL, integrated into system tools (for example Azure Update Manager, apt)
- Security hardening and audit tools (CIS) to establish a security baseline across your systems (and
  help you meet the Azure Linux Security Baseline policy)
- FIPS 140-2 certified modules
- Common Criteria (CC) EAL2 provisioning packages
- Kernel Live patch: kernel patches delivered immediately, without the need to reboot
- Optimized performance: optimized kernel, with improved boot speed, outstanding runtime performance
  and advanced device support
- 10-year security maintenance: Ubuntu Pro 18.04 LTS provides security maintenance until April 2028
- Developer friendly: Ubuntu offers developers the latest libraries and tools to innovate with the latest technologies
- Nonstop security: Canonical publishes images ensuring security is present from the moment an instance launches
- Portability: Ubuntu is available in all regions with content mirrors to reduce the need to go across regions or out to the Internet for updates
- Consistent experience across platforms: from edge to multicloud, Ubuntu provides the same experience regardless of the platform. It ensures consistency of your CI/CD pipelines and management mechanisms.

> [!NOTE]
> This document provides instructions to upgrade Ubuntu Server (16.04 or higher) to
> Ubuntu Pro. Converting to Ubuntu Pro is an irreversible process.

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

## Next steps after launching an Ubuntu Pro VM

With the availability of outbound internet access, Ubuntu Pro automatically enables premium features
including [Live Patch][04] and Extended Security Maintenance for
[Main and Universe repositories][05].
Should any specific hardening be required, check `usg` to [harden your servers][06] for CIP and FIPS
tutorials.
Learn more about networking requirements (such as egress traffic, endpoints and ports) by reading
[Ubuntu Pro Client network requirements][07].

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
[01]: https://ubuntu.com/18-04/azure
[02]: ../../instance-metadata-service.md
[03]: https://azure.microsoft.com/pricing/calculator/
[04]: https://ubuntu.com/security/livepatch/docs
[05]: https://help.ubuntu.com/community/Repositories
[06]: https://ubuntu.com/tutorials/comply-with-cis-or-disa-stig-on-ubuntu#1-overview
[07]: https://canonical-ubuntu-pro-client.readthedocs-hosted.com/en/latest/references/network_requirements.html
