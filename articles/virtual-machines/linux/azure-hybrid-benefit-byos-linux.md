---
title: Azure Hybrid Benefit for BYOS Linux Virtual Machines
description: Learn how Azure Hybrid Benefit can provide updates and support for Linux virtual machines.
services: virtual-machines
author: mathapli
manager: gachandw
ms.service: virtual-machines
ms.subservice: billing
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 06/16/2022
ms.author: mathapli
ms.custom: kr2b-contr-experiment
---

# Explore Azure Hybrid Benefit for bring-your-own-subscription Linux virtual machines

>[!IMPORTANT]
>This article explores *Azure Hybrid Benefit (AHB)* for *bring-your-own-subscription (BYOS) virtual machines*. AHB lets you switch to custom image Virtual Machines, RHEL BYOS Virtual Machines, and SLES BYOS Virtual Machines. For steps to switch in the reverse from a BYOS Virtual Machine to a RHEL PAYG Virtual Machine or SLES PAYG Virtual Machine, refer to [Hybrid Benefit for PAYG Virtual Machines](./azure-hybrid-benefit-linux.md).

>[!NOTE]
>AHB for BYOS Virtual Machines is in public preview at this time. To use this option on Azure, follow the steps in the [Getting Started](#get-started) section of this article.


 AHB for bring-your-own-subscription (BYOS) Virtual Machines is a licensing benefit. It is available to RHEL and SLES custom image Virtual Machines (Virtual Machines generated from on-premises images), and to RHEL and SLES Marketplace BYOS Virtual Machines. AHB provides software updates and integrated support directly from Azure for Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines (Virtual Machines).

## How does AHB work?
 When you switch to AHB you get software updates and integrated support for Marketplace BYOS or on-premises migrated RHEL and SLES BYOS Virtual Machines. AHB converts BYOS billing to *pay-as-you-go (PAYG)*, so that you pay only PAYG software fees.  You don't have to reboot for AHBs to be applied.

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-byos-cost.png" alt-text="A screenshot that shows AHB costs for Linux Virtual Machines.":::

## Which Linux Virtual Machines qualifies for AHB for BYOS Virtual Machines?

**AHB for BYOS Virtual Machines** is available to all RHEL and SLES custom image Virtual Machines, as well as RHEL and SLES Marketplace BYOS Virtual Machines. Azure Dedicated Host instances and SQL hybrid benefits aren't eligible for AHB if you're already using it with Linux Virtual Machines. Virtual Machine Scale Sets are Reserved Instances (RIs) and can't use AHB BYOS.

## Get started

### AHB for Red Hat customers

To start using AHB for Red Hat:

1. Install the 'AHBForRHEL' extension on the virtual machine on which you wish to apply the AHB BYOS benefit. You can do this installation via Azure command-line interface (CLI) or PowerShell.


1. Depending on the software updates you want, change the license type to relevant value. Here are the available license type values and the software updates associated with them:

    | License Type  | Software Updates  | Allowed Virtual Machines|  
    |---|---|---|
    | RHEL_BASE  | Installs Red Hat regular/base repositories into your virtual machine. | RHEL BYOS Virtual Machines, RHEL custom image Virtual Machines|
    | RHEL_EUS | Installs Red Hat Extended Update Support (EUS) repositories into your virtual machine. | RHEL BYOS Virtual Machines, RHEL custom image Virtual Machines|
    | RHEL_SAPAPPS  | Installs RHEL for SAP Business Apps repositories into your virtual machine. | RHEL BYOS Virtual Machines, RHEL custom image Virtual Machines|
    | RHEL_SAPHA | Installs RHEL for SAP with HA repositories into your virtual machine. | RHEL BYOS Virtual Machines, RHEL custom image Virtual Machines|
    | RHEL_BASESAPAPPS | Installs RHEL regular/base SAP Business Apps repositories into your virtual machine. | RHEL BYOS Virtual Machines, RHEL custom image Virtual Machines|
    | RHEL_BASESAPHA | Installs regular/base RHEL for SAP with HA repositories into your virtual machine.| RHEL BYOS Virtual Machines, RHEL custom image Virtual Machines|

1. Wait for one hour for the extension to read the license type value and install the repositories.

1. You should now be connected to Azure Red Hat Update and the relevant repositories will be installed in your machine.  

1. In case the extension isn't running by itself, you can run it on demand as well.

1. In case you want to switch back to the bring-your-own-subscription model,  just change the license type to 'None' and run the extension. This action will remove all RHUI repositories from your virtual machine and stop the billing.

>[!Note]
> In the unlikely event that the extension is unable to install repositories or there are any other issues, switch the license type back to empty and reach out to Support. This ensures that you don't get billed for software updates.  


### AHB for SUSE customers

To start using AHB for SLES Virtual Machines:

1. Install the AHB for BYOS Virtual Machines extension on the Virtual Machine that will use it.
1. Change the license type to the value relevant to the software updates you want. Here are the available license type values and the software updates associated with them:

    | License Type  | Software Updates  | Allowed Virtual Machines|  
    |---|---|---|
    | SLES  | Installs SLES standard repositories into your virtual machine. | SLES BYOS Virtual Machines, SLES custom image Virtual Machines|
    | SLES_SAP | Installs SLES SAP repositories into your virtual machine. | SLES SAP BYOS Virtual Machines, SLES custom image Virtual Machines|
    | SLES_HPC  | Installs SLES High Performance Compute related repositories  into your virtual machine. | SLES HPC BYOS Virtual Machines, SLES custom image Virtual Machines|

1. Wait for 5 minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to the SUSE Public Cloud Update Infrastructure on Azure and the relevant repositories will be installed in your machine.

1. In case the extension isn't running by itself, you can run it on demand as well.

1. In case you want to switch back to the bring-your-own-subscription model,  just change the license type to 'None' and run the extension. This action will remove all repositories from your virtual machine and stop the billing.

## How to enable and disable AHB for RHEL

You can install the `AHBForRHEL` extension. After successfully installing the extension, you can use the `az vm update` command to update your existing license type on your running Virtual Machines. For SLES Virtual Machines, run the command and set `--license-type` parameter to one of the following license types: `RHEL_BASE`, `RHEL_EUS`, `RHEL_SAPHA`, `RHEL_SAPAPPS`, `RHEL_BASESAPAPPS` or `RHEL_BASESAPHA`.


### How to enable AHB for RHEL using a CLI
1. Install the AHB extension on a Virtual Machine that is up and running. You can use Azure portal or the following command via Azure CLI:
    ```azurecli
    az vm extension set -n AHBForRHEL --publisher Microsoft.Azure.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. Once, the extension is installed successfully, change the license type based on what you require:

    ```azurecli
    # This will enable AHB to fetch software updates for RHEL base/regular repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASE
    
    # This will enable AHB to fetch software updates for RHEL EUS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_EUS
    
    # This will enable AHB to fetch software updates for RHEL SAP APPS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_SAPAPPS
    
    # This will enable AHB to fetch software updates for RHEL SAP HA repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_SAPHA
    
    # This will enable AHB to fetch software updates for RHEL BASE SAP APPS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASESAPAPPS
    
    # This will enable AHB to fetch software updates for RHEL BASE SAP HA repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASESAPHA

    ```
1. Wait for 5 minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to Azure Red Hat Update Infrastructure and the relevant repositories will be installed in your machine. You can validate the same by performing the command below on your Virtual Machine:
    ```bash
    yum repolist
    ```
 1. In case the extension isn't running by itself, you can try the below command on the Virtual Machine:
    ```bash
            systemctl start azure-hybrid-benefit.service
    ```
 1. You can use the below command in your RHEL Virtual Machine to get the current status of the service:
    ```bash
                ahb-service -status
    ```

## How to enable and disable AHB for SLES

You can install the `AHBForSLES` extension. After successfully installing the extension,
you can use the `az vm update` command to update existing license type on running Virtual Machines. For SLES Virtual Machines, run the command and set `--license-type` parameter to one of the following license types: `SLES_STANDARD`, `SLES_SAP` or `SLES_HPC`.

### How to enable AHB for SLES using a CLI
1. Install the AHB extension on a Virtual Machine that is up and running, with the portal, or via Azure CLI using the command below:
    ```azurecli
    az vm extension set -n AHBForSLES --publisher SUSE.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. Once, the extension is installed successfully, change the license type based on what you require:

    ```azurecli
    # This will enable AHB to fetch software updates for SLES STANDARD repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES

    # This will enable AHB to fetch software updates for SLES SAP repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_SAP

    # This will enable AHB to fetch software updates for SLES HPC repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_HPC

    ```
1. Wait for 5 minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to the SUSE Public Cloud Update Infrastructure on Azure and the relevant repositories will be installed in your machine. You can verify this change by performing the command below on your Virtual Machine, which lists SUSE repositories on your Virtual Machine:
    ```bash
    zypper repos
    ```
  
### How to disable AHB using a CLI
1. Ensure that the AHB extension is installed on your Virtual Machine.
1. To disable AHB, follow below command:

    ```azurecli
    # This will disable AHB on a Virtual Machine
    az vm update -g myResourceGroup -n myVmName --license-type None
    ```

## How to check the AHB status of a Virtual Machine
To check the AHB status of a Virtual Machine, do the following:
1. Ensure that the AHB extension is installed:    
1. You can view the AHB status of a Virtual Machine by using the Azure CLI or by using Azure Instance Metadata Service.

    You can use the following command for this purpose. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is one of the following, your Virtual Machine has AHB enabled:
    `RHEL_BASE`, `RHEL_EUS`, `RHEL_BASESAPAPPS`, `RHEL_SAPHA`, `RHEL_BASESAPAPPS`, `RHEL_BASESAPHA`, `SLES`, `SLES_SAP`, `SLES_HPC`. 

    ```azurecli
    az vm get-instance-view -g MyResourceGroup -n MyVm
    ```

## Compliance

### Red Hat compliance

Customers who use AHB for BYOS Virtual Machines for RHEL agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offerings.

### Explore AHB for SUSE

Customers who use AHB for BYOS Virtual Machines for SLES and want more for information about moving from SLES PAYG to BYOS or moving from SLES BYOS to PAYG, see [SUSE Linux Enterprise and AHB](https://aka.ms/suse-ahb).

## Frequently asked questions
*Q: What is the licensing cost I pay with AHB for BYOS Virtual Machines?*

A: On using AHB for BYOS Virtual Machines, you'll essentially convert bring-your-own-subscription (BYOS) billing model to pay-as-you-go (PAYG) billing model. Hence, you'll be paying similar to PAYG Virtual Machines for software subscription cost. The table below maps the PAYG flavors available on Azure and links to pricing page to help you understand the cost associated with AHB for BYOS Virtual Machines.

| License type | Relevant PAYG Virtual Machine image & Pricing Link (Keep the AHB for PAYG filter off) |
|---|---|---|   
| RHEL_BASE | [Red Hat Enterprise Linux](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/)  |
| RHEL_SAPAPPS | [RHEL for SAP Business Applications](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-business/) |
| RHEL_SAPHA | [RHEL for SAP with HA](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-ha/) |
| RHEL_BASESAPAPPS | [RHEL for SAP Business Applications](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-business/) |
| RHEL_BASESAPHA | [RHEL for SAP with HA](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-ha/) |
| RHEL_EUS | [Red Hat Enterprise Linux](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/)  |
| SLES | [SLES Standard](https://azure.microsoft.com/pricing/details/virtual-machines/sles-standard/) |
| SLES_SAP | [SLES SAP](https://azure.microsoft.com/pricing/details/virtual-machines/sles-sap/)  |
| SLES_HPC | [SLES HPC](https://azure.microsoft.com/pricing/details/virtual-machines/sles-hpc-standard/) |

*Q: Can I use a license type designated for RHEL (such as `RHEL_BASE`) with a SLES image, or vice versa?*

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your Virtual Machine will fail and you might end up getting billed incorrectly. However, if you accidentally enter the wrong license type, either changing the license type to empty will remove the billing or updating your Virtual Machine again to the correct license type will still enable AHB.

*Q: What are the supported versions for RHEL with AHB for BYOS Virtual Machines?*

A: RHEL versions greater than 7.4 are supported with AHB for BYOS Virtual Machines.

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to PAYG?*

A: Yes, this capability supports image from on-premises to Azure. Please [follow steps shared here](#get-started). 

*Q: Can I use AHB for BYOS Virtual Machines on RHEL and SLES PAYG Marketplace Virtual Machines?*

A: No, as these Virtual Machines are already pay-as-you-go (PAYG). However, with AHB v1 and v2 you can use the license type of `RHEL_BYOS` for RHEL Virtual Machines and `SLES_BYOS` for conversions of RHEL and SLES PAYG Marketplace Virtual Machines. You can read more on [Hybrid Benefit for PAYG Virtual Machines here.](./azure-hybrid-benefit-linux.md)

*Q: Can I use AHB for BYOS Virtual Machines on virtual machine scale sets for RHEL and SLES?*

A: No, Hybrid Benefit for BYOS Virtual Machines isn't available for virtual machine scale sets currently.

*Q: Can I use AHB for BYOS Virtual Machines on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There's no plan for supporting these virtual machines.

*Q: Can I use AHB for BYOS Virtual Machines on my RHEL Virtual Data Center subscription?*

A: No, you can't. VDC isn't supported on Azure at all, including AHB.  


## Next steps
* [Learn how to convert RHEL and SLES PAYG Virtual Machines to BYOS using Hybrid Benefit for PAYG Virtual Machines](./azure-hybrid-benefit-linux.md)

* [Learn how to create and update Virtual Machines and add license types (RHEL_BYOS, SLES_BYOS) for Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
