---
title: Azure Hybrid Benefit for BYOS Linux VMs
description: Learn how Azure Hybrid Benefit can help get updates from Azure infrastructure for Linux machines on Azure.
services: virtual-machines
documentationcenter: ''
author: mathapli
manager: gachandw
ms.service: virtual-machines
ms.subservice: billing
ms.collection: linux
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/06/2022
ms.author: mathapli
---

# How Azure Hybrid Benefit for BYOS VMs (AHB BYOS) applies for Linux virtual machines

>[!IMPORTANT]
>The below article is scoped to Azure Hybrid Benefit for BYOS VMs (AHB BYOS) which caters to conversion of custom on-prem image VMs and RHEL or SLES BYOS VMs. For conversion of RHEL PAYG or SLES PAYG VMs, refer to [Azure Hybrid Benefit for PAYG VMs here](./azure-hybrid-benefit-linux.md). 

>[!NOTE]
>Azure Hybrid Benefit for BYOS VMs is in Preview now. You can [sign up for the preview here.](https://aka.ms/ahb-linux-form)you'll receive a mail from Microsoft once your subscriptions are enabled for Preview. 


Azure Hybrid Benefit for BYOS VMs is a licensing benefit that helps you to get software updates and integrated support for Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines (VMs) directly from Azure infrastructure. This benefit is available to RHEL and SLES custom on-prem image VMs (VMs generated from on-prem images), and to RHEL and SLES Marketplace bring-your-own-subscription (BYOS) VMs.

## Benefit description
 Azure Hybrid Benefit for BYOS VMs allows you to get software updates and integrated support for Marketplace BYOS or on-prem migrated RHEL and SLES BYOS VMs without reboot. This benefit converts bring-your-own-subscription BYOS) billing model to pay-as-you-go (PAYG) billing model and you pay the same software fees as charged to PAYG VMs.   

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-byos-cost.png" alt-text="Azure Hybrid Benefit cost visualization on Linux VMs.":::

After you enable the AHB for BYOS VMs benefit on RHEL or SLES VM,you'll be charged for the software fee typically incurred on a PAYG VM andyou'll also start getting software updates typically provided to a PAYG VM. 

You can also convert a VM that has the benefit enabled on it back to a BYOS billing model, which will stop software billing and software updates from Azure infrastructure.

## Scope of Azure Hybrid Benefit for BYOS VMs eligibility for Linux VMs

**Azure Hybrid Benefit for BYOS VMs** is available for all RHEL and SLES custom on-prem image VMs as well as RHEL and SLES Marketplace BYOS VMs. For RHEL and SLES PAYG Marketplace VMs, [refer to AHB for PAYG VMs here](./azure-hybrid-benefit-linux.md)

Azure Dedicated Host instances, and SQL hybrid benefits aren't eligible for Azure Hybrid Benefit for BYOS VMs if you're already using the benefit with Linux VMs. Virtual Machine Scale Sets (VMSS) are Reserved Instances (RIs) aren't in scope for AHB BYOS. 

## Get started

### Red Hat customers

To start using the benefit for Red Hat:

1. Install the 'AHBForRHEL' extension on the virtual machine on which you wish to apply the AHB BYOS benefit. You can do this installation via Azure CLI or PowerShell.

    
1. Depending on the software updates you want, change the license type to relevant value. Here are the available license type values and the software updates associated with them:

    | License Type  | Software Updates  | Allowed VMs|  
    |---|---|---|
    | RHEL_BASE  | Installs Red Hat regular/base repositories into your virtual machine. | RHEL BYOS VMs, RHEL custom on-prem image VMs|
    | RHEL_EUS | Installs Red Hat Extended Update Support (EUS) repositories into your virtual machine. | RHEL BYOS VMs, RHEL custom on-prem image VMs|
    | RHEL_SAPAPPS  | Installs RHEL for SAP Business Apps repositories into your virtual machine. | RHEL BYOS VMs, RHEL custom on-prem image VMs|
    | RHEL_SAPHA | Installs RHEL for SAP with HA repositories into your virtual machine. | RHEL BYOS VMs, RHEL custom on-prem image VMs|
    | RHEL_BASESAPAPPS | Installs RHEL regular/base SAP Business Apps repositories into your virtual machine. | RHEL BYOS VMs, RHEL custom on-prem image VMs|
    | RHEL_BASESAPHA | Installs regular/base RHEL for SAP with HA repositories into your virtual machine.| RHEL BYOS VMs, RHEL custom on-prem image VMs|

1. Wait for one hour for the extension to read the license type value and install the repositories. 

1. You should now be connected to Azure Red Hat Update Infrastructure and the relevant repositories will be installed in your machine.  

1. In case the extension isn't running by itself, you can run it on demand as well.

1. In case you want to switch back to the bring-your-own-subscription model,  just change the license type to 'None' and run the extension. This action will remove all RHUI repositories from your virtual machine and stop the billing.

>[!Note]
> In the unlikely event that extension isn't able to install repositories or there are any issues, please change the license type back to empty and reach out to support for help. This will ensure you aren't getting billed for software updates.  


### SUSE customers

To start using the benefit for SLES VMs:

1. Install the Azure Hybrid Benefit for BYOS VMs extension on the virtual machine on which you wish to apply the AHB BYOS benefit. 
1. Depending on the software updates you want, change the license type to relevant value. Here are the available license type values and the software updates associated with them:

    | License Type  | Software Updates  | Allowed VMs|  
    |---|---|---|
    | SLES  | Installs SLES standard repositories into your virtual machine. | SLES BYOS VMs, SLES custom on-prem image VMs|
    | SLES_SAP | Installs SLES SAP repositories into your virtual machine. | SLES SAP BYOS VMs, SLES custom on-prem image VMs|
    | SLES_HPC  | Installs SLES High Performance Compute related repositories  into your virtual machine. | SLES HPC BYOS VMs, SLES custom on-prem image VMs|

1. Wait for 5 minutes for the extension to read the license type value and install the repositories. 

1. You should now be connected to the SUSE Public Cloud Update Infrastructure on Azure and the relevant repositories will be installed in your machine.

1. In case the extension isn't running by itself, you can run it on demand as well.

1. In case you want to switch back to the bring-your-own-subscription model,  just change the license type to 'None' and run the extension. This action will remove all repositories from your virtual machine and stop the billing.

## Enable and disable the benefit for RHEL

You can install the `AHBForRHEL` extension to install the extension. After successfully installing the extension,
you can use the `az vm update` command to update existing license type on running VMs. For SLES VMs, run the command and set `--license-type` parameter to one of the following license types: `RHEL_BASE`, `RHEL_EUS`, `RHEL_SAPHA`, `RHEL_SAPAPPS`, `RHEL_BASESAPAPPS` or `RHEL_BASESAPHA`.


### CLI example to enable the benefit for RHEL
1. Install the Azure Hybrid Benefit extension on running VM using the portal or via Azure CLI using the command below:
    ```azurecli
    az vm extension set -n AHBForRHEL --publisher Microsoft.Azure.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. Once, the extension is installed successfully, change the license type based on your requirements:

    ```azurecli
    # This will enable the benefit to fetch software updates for RHEL base/regular repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASE
    
    # This will enable the benefit to fetch software updates for RHEL EUS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_EUS
    
    # This will enable the benefit to fetch software updates for RHEL SAP APPS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_SAPAPPS
    
    # This will enable the benefit to fetch software updates for RHEL SAP HA repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_SAPHA
    
    # This will enable the benefit to fetch software updates for RHEL BASE SAP APPS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASESAPAPPS
    
    # This will enable the benefit to fetch software updates for RHEL BASE SAP HA repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASESAPHA

    ```
1. Wait for 5 minutes for the extension to read the license type value and install the repositories. 

1. You should now be connected to Azure Red Hat Update Infrastructure and the relevant repositories will be installed in your machine. You can validate the same by performing the command below on your VM:
    ```bash
    yum repolist
    ```
 1. In case the extension isn't running by itself, you can try the below command on the VM:
    ```bash
        systemctl start azure-hybrid-benefit.service
    ```
 1. You can use the below command in your RHEL VM to get the current status of the service: 
    ```bash
        ahb-service -status
    ```

## Enable and disable the benefit for SLES

You can install the `AHBForSLES` extension to install the extension. After successfully installing the extension,
you can use the `az vm update` command to update existing license type on running VMs. For SLES VMs, run the command and set `--license-type` parameter to one of the following: `SLES`, `SLES_SAP` or `SLES_HPC`.

### CLI example to enable the benefit for SLES
1. Install the Azure Hybrid Benefit extension on running VM using the portal or via Azure CLI using the command below:
    ```azurecli
    az vm extension set -n AHBForSLES --publisher SUSE.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. Once, the extension is installed successfully, change the license type based on your requirements:

    ```azurecli
    # This will enable the benefit to fetch software updates for SLES STANDARD repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES

    # This will enable the benefit to fetch software updates for SLES SAP repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_SAP

    # This will enable the benefit to fetch software updates for SLES HPC repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_HPC

    ```
1. Wait for 5 minutes for the extension to read the license type value and install the repositories. 

1. You should now be connected to the SUSE Public Cloud Update Infrastructure on Azure and the relevant repositories will be installed in your machine. You can verify this by performing the command below on your VM which lists SUSE repositories on your VM:
    ```bash
    zypper repos
    ```
  
### CLI example to disable the benefit
1. Ensure that the Azure Hybrid Benefit extension is installed on your VM.
1. To disable the benefit, follow below command:

    ```azurecli
    # This will disable the benefit on a VM
    az vm update -g myResourceGroup -n myVmName --license-type None
    ```

## Check the AHB BYOS status of a VM
To check the status of Azure Hybrid Benefit for BYOS VM status
1. Ensure that the Azure Hybrid Benefit extension is installed:    
1. You can view the Azure Hybrid Benefit status of a VM by using the Azure CLI or by using Azure Instance Metadata Service.

    You can use the below command for this purpose. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is one of the below, your VM has the benefit enabled:
    `RHEL_BASE`, `RHEL_EUS`, `RHEL_BASESAPAPPS`, `RHEL_SAPHA`, `RHEL_BASESAPAPPS`, `RHEL_BASESAPHA`, `SLES`, `SLES_SAP`, `SLES_HPC`. 

    ```azurecli
    az vm get-instance-view -g MyResourceGroup -n MyVm
    ```

## Compliance

### Red Hat

Customers who use Azure Hybrid Benefit for BYOS VMs for RHEL agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offerings.

### SUSE

Customers who use Azure Hybrid Benefit for BYOS VMs for SLES and want more for information about moving from SLES PAYG to BYOS or moving from SLES BYOS to PAYG, see [SUSE Linux Enterprise and Azure Hybrid Benefit](https://aka.ms/suse-ahb). 

## Frequently asked questions
*Q: What is the licensing cost I pay with AHB for BYOS VMs?*

A: On using AHB for BYOS VMs,you'll essentially convert bring-your-own-subscription (BYOS) billing model to pay-as-you-go (PAYG) billing model. Hence,you'll be paying similar to PAYG VMs for software subscription cost. The table below maps the PAYG flavors available on Azure and links to pricing page to help you understand the cost associated with AHB for BYOS VMs.

| License type | Relevant PAYG VM image & Pricing Link (Keep the AHB for PAYG filter off) |
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

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your VM will fail and you might end uo getting billed incorrectly. However, if you accidentally enter the wrong license type, either changing the license type to empty will remove the billing or updating your VM again to the correct license type will still enable the benefit.

*Q: What are the supported versions for RHEL with AHB for BYOS VMs?*

A: RHEL versions greater than 7.4 are supported with AHB for BYOS VMs.

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to PAYG?*

A: Yes, this capability supports image from on-premises to Azure. Please [follow steps shared here](#get-started). 

*Q: Can I use Azure Hybrid Benefit for BYOS VMs on RHEL and SLES PAYG Marketplace VMs?*

A: No, as these VMs are already pay-as-you-go (PAYG). However, with AHB v1 and v2 you can use the license type of `RHEL_BYOS` for RHEL VMs and `SLES_BYOS` for conversions of RHEL and SLES PAYG Marketplace VMs. You can read more on [AHB for PAYG VMs here.](./azure-hybrid-benefit-linux.md)

*Q: Can I use Azure Hybrid Benefit for BYOS VMs on virtual machine scale sets for RHEL and SLES?*

A: No, Azure Hybrid Benefit for BYOS VMs isn't available for virtual machine scale sets currently.   

*Q: Can I use Azure Hybrid Benefit for BYOS VMs on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There is no plan for supporting these virtual machines.

*Q: Can I use Azure Hybrid Benefit for BYOS VMs on my RHEL Virtual Data Center subscription?*

A: No, you cannot. VDC isn't supported on Azure at all, including AHB.  
 

## Next steps
* [Learn how to convert RHEL and SLES PAYG VMs to BYOS using AHB for PAYG VMs](./azure-hybrid-benefit-linux.md)

* [Learn how to create and update VMs and add license types (RHEL_BYOS, SLES_BYOS) for Azure Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
