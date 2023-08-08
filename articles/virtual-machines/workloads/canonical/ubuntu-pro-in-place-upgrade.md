---
title: In-place upgrade to Ubuntu Pro Linux images on Azure
description: Learn how to do an in-place upgrade from Ubuntu Server to Ubuntu Pro
author: anujkmaurya
ms.service: virtual-machines
ms.subservice: billing
ms.custom: devx-track-linux
ms.collection: linux
ms.topic: article
ms.date: 08/07/2023
ms.author: anujmaurya
---

# Ubuntu Server to Ubuntu Pro in-place upgrade on Azure

**Applies to:** :heavy_check_mark: Linux VMs 

Customers can now upgrade from Ubuntu Server (16.04 or higher) to Ubuntu Pro on your existing Azure Virtual Machines (VMs) without redeployment or downtime. One of the major use cases includes conversion of Ubuntu 18.04 LTS going EOL to Ubuntu Pro. [Canonical announced that the Ubuntu 18.04 LTS (Bionic Beaver) OS images will reach end-of-life (EOL)....](https://ubuntu.com/18-04/azure) This means that Canonical will no longer provide technical support, software updates, or security patches for this version. Customers will need to upgrade to Ubuntu Pro to continue to be on Ubuntu 18.04 LTS. 

## What is Ubuntu Pro? 
Ubuntu Pro is a cross-cloud OS optimized for Azure, security maintained for 10 years, that enables the secure use of open-source software so teams can utilize the latest technologies while meeting internal governance and compliance requirements. In context of Ubuntu 18.04 LTS, it remains fully compatible with Ubuntu Server 18.04 LTS, but adds additional security enabled by default, as well as compliance and management tools in a form suitable for small to large-scale Linux operations. Ubuntu Pro 18.04 LTS will remain fully supported until April 2028. Ubuntu Pro also comes with security patching for all Ubuntu packages due to Extended Security Maintenance (ESM) for Infrastructure and Applications and optional 24/7 phone and ticket support.  

Customers can choose to continue to be on Ubuntu 18.04 LTS by upgrading to Ubuntu Pro. This will allow continued support on 18.04 LTS from Canonical until 2028. Customers can upgrade to Ubuntu Pro via Azure CLI. 

## Why developers and devops choose Ubuntu Pro for Azure 
* Access to security updates for 23,000+ packages including Apache Kafka, NGINX, MongoDB, Redis and PostgreSQL, integrated into normal system tools (e.g. Azure Update Manager, apt) 
* Security hardening and audit tools (CIS) to establish a security baseline across your systems (and help you meet the Azure Linux Security Baseline policy) 
* FIPS 140-2 certified modules (note: Ubuntu Pro with FIPS pre-enabled is available here) 
* Common Criteria (CC) EAL2 provisioning packages 
* Kernel Livepatch: kernel patches delivered immediately, without the need to reboot 
* Optimized performance: optimized kernel, with improved boot speed, outstanding runtime performance and advanced device support 
* 10-year security maintenance: Ubuntu Pro 18.04 LTS provides security maintenance until April 2028 
* Production ready: Ubuntu is the leading Linux in the public cloud with > 50% of Linux workloads 
* Developer friendly: Ubuntu is the \#1 Linux for developers offering the latest libraries and tools to innovate with the latest technologies 
* Non-stop security: Canonical publishes images frequently, ensuring security is built-in from the moment an instance launches 
* Portability: Ubuntu is available in all regions with content mirrors to reduce the need to go across regions or out to the Internet for updates 
* Consistent experience across platforms: from edge to multi-cloud, Ubuntu provides the same experience regardless of the platform. It will ensure consistency of your CI/CD pipelines and management mechanisms.

**This document presents the direction to upgrade from an Ubuntu Server (16.04 or higher) image to Ubuntu Pro with zero downtime for upgrade by executing the following steps in your VMs:**

1. Converting to Ubuntu Pro license 

2. Validating the license

>[!NOTE]
> Converting to UBUNTU_PRO is an irreversible process. You cannot even downgrade a VM by running detach. Please raise support tickets for any exceptions.

## Converting to Ubuntu Pro using the Azure CLI 
```azurecli-interactive
# The following will enable Ubuntu Pro on a virtual machine
az vm update -g myResourceGroup -n myVmName --license-type UBUNTU_PRO 
```

```In-VM commands 
# The next step is to execute two in-VM commands
sudo apt install ubuntu-advantage-tools 
sudo pro auto-attach 
```
(Please note that "sudo apt install ubuntu-advantage-tools" is only necessary if "pro --version" is lower than 28) 

## Validating the license 
Expected output:

![PNG Image for the expected output.](./expected-output.png)

## Creating an Ubuntu Pro VM using the Azure CLI
You can also create a new VM using the Ubuntu Sever images and apply Ubuntu Pro at create time.

For example:

```azurecli-interactive
# The following will enable Ubuntu Pro on a virtual machine
az vm update -g myResourceGroup -n myVmName --license-type UBUNTU_PRO 
```

```In-VM commands
# The next step is to execute two in-VM commands
sudo apt install ubuntu-advantage-tools 
sudo pro auto-attach 
```

>[!NOTE]
> For systems with advantage tools version 28 or higher installed the system will perform a pro attach during a reboot.

## Check licensing model using the Azure CLI
You can use the az vm get-instance-view command to check the status. Look for a licenseType field in the response. If the licenseType field exists and the value is UBUNTU_PRO, your virtual machine has Ubuntu Pro enabled.

```Azure CLI
az vm get-instance-view -g MyResourceGroup -n MyVm 
```

## Check the licensing model of an Ubuntu Pro enabled VM using Azure Instance Metadata Service
From within the virtual machine itself, you can query the attested metadata in Azure Instance Metadata Service to determine the virtual machine's licenseType value. A licenseType value of UBUNTU_PRO indicates that your virtual machine has Ubuntu Pro enabled. [Learn more about attested metadata](../../instance-metadata-service.md).

## Billing
Please note that you will be charged for Ubuntu Pro as part of the Preview. Visit the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) for more details on Ubuntu Pro pricing. To cancel the Pro subscription during the preview period please open a support tickets thru the Azure portal.

## Frequently Asked Questions

#### I launched an Ubuntu Pro VM. Do I need to configure it or enable something additional?
With the availability of outbound internet access, Ubuntu Pro automatically will enable premium features such as Extended Security Maintenance for [Main and Universe repositories](https://help.ubuntu.com/community/Repositories) and [livepatch](https://ubuntu.com/security/livepatch/docs). Should any specific hardening (e.g. CIS etc) check the using usg to [harden your servers](https://ubuntu.com/tutorials/comply-with-cis-or-disa-stig-on-ubuntu#1-overview) tutorial. Should you require FIPS, check enabling FIPS tutorials.

For more information about networking requirements for making sure Pro enablement process works (such as egress traffic, endpoints and ports) [please check this documentation](https://canonical-ubuntu-pro-client.readthedocs-hosted.com/en/latest/references/network_requirements.html).

#### If I shut down the machine, does the billing continue?
If you launch Ubuntu Pro from Azure Marketplace you will only pay as you go, so, if you don’t have any machine running, you won’t pay any additional fee.

#### Can I get volume discounts?
Yes. Please contact your Microsoft sales representative.

#### Are Reserved Instances available?
Yes

#### If the customer does not do the auto-attach they will still get attached pro on reboot?
If the customer does not perform the auto-attach, they will still get the Pro attached upon reboot. However, this applies only if they have v28 of the Pro client.
* For Jammy and Focal, this process will work as expected.
* For Bionic and Xenial, unfortunately, this process will not work out of the box, due to the older versions of the Pro client they come with.
