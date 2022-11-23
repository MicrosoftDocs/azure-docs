---
title: Azure Hybrid Benefit BYOS to PAYG capability
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

# Explore Azure Hybrid Benefit bring-your-own-subscription to pay-as-you-go conversion for Linux virtual machines

Azure Hybrid Benefit now provides software updates and integrated support directly from Azure infrastructure for Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines. Azure Hybrid Benefit for bring-your-own-subscription (BYOS) virtual machines is a licensing benefit that lets you switch RHEL and SLES BYOS virtual machines generated from custom on-premises images or from Azure Marketplace to pay-as-you-go billing. 

>[!IMPORTANT]
> To do the reverse and switch from a RHEL pay-as-you-go virtual machine or SLES pay-as-you-go virtual machine to a BYOS virtual machine, see [Explore Azure Hybrid Benefit for pay-as-you-go Linux virtual machines](./azure-hybrid-benefit-linux.md).

## How does Azure Hybrid Benefit work?

Azure Hybrid Benefit converts BYOS billing to pay-as-you-go, so that you pay only pay-as-you-go software fees. You don't have to restart a machine for Azure Hybrid Benefit to be applied.

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-byos-cost.png" alt-text="Diagram that shows the use of Azure Hybrid Benefit to switch Linux virtual machines from bring-your-own-subscription to pay-as-you-go.":::

## Which Linux virtual machines qualify for Azure Hybrid Benefit?

Azure Hybrid Benefit BYOS to PAYG capability is available to all RHEL and SLES virtual machines that come from a custom image. It's also available to all RHEL and SLES BYOS virtual machines that come from an Azure Marketplace image. 

Azure dedicated host instances and SQL hybrid benefits are not eligible for Azure Hybrid Benefit if you already use Azure Hybrid Benefit with Linux virtual machines. Azure Hybrid Benefit BYOS to PAYG capability does not support virtual machine scale sets and reserved instances (RIs).

## Get started

### Azure Hybrid Benefit for Red Hat customers

To start using Azure Hybrid Benefit for Red Hat:

1. Install the `AHBForRHEL` extension on the virtual machine on which you want to apply the Azure Hybrid Benefit BYOS benefit. You can do this installation via the Azure CLI or PowerShell.

1. Depending on the software updates that you want, change the license type to a relevant value. Here are the available license type values and the software updates associated with them:

    | License type  | Software updates  | Allowed virtual machines|  
    |---|---|---|
    | RHEL_BASE  | Installs Red Hat regular/base repositories on your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_EUS | Installs Red Hat Extended Update Support (EUS) repositories on your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_SAPAPPS  | Installs RHEL for SAP Business Apps repositories on your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_SAPHA | Installs RHEL for SAP with High Availability (HA) repositories on your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_BASESAPAPPS | Installs RHEL regular/base SAP Business Apps repositories on your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_BASESAPHA | Installs regular/base RHEL for SAP with HA repositories on your virtual machine.| RHEL BYOS virtual machines, RHEL custom image virtual machines|

1. Wait one hour for the extension to read the license type value and install the repositories.

   > [!NOTE]
   > If the extension isn't running by itself, you can run it on demand.

1. You should now be connected to Azure Red Hat Update. The relevant repositories will be installed on your machine.  

1. If you want to switch back to the bring-your-own-subscription model,  just change the license type to `None` and run the extension. This action will remove all Red Hat Update Infrastructure (RHUI) repositories from your virtual machine and stop the billing.

> [!Note]
> In the unlikely event that the extension can't install repositories or there are any other issues, switch the license type back to empty and reach out to Microsoft support. This ensures that you don't get billed for software updates.  

### Azure Hybrid Benefit for SUSE customers

To start using Azure Hybrid Benefit for SLES virtual machines:

1. Install the `AHBForSLES` extension on the virtual machine that will use it.
1. Change the license type to the value that reflects the software updates you want. Here are the available license type values and the software updates associated with them:

    | License type  | Software updates  | Allowed virtual machines|  
    |---|---|---|
    | SLES | Installs SLES Standard repositories on your virtual machine. | SLES BYOS virtual machines, SLES custom image virtual machines|
    | SLES_SAP | Installs SLES SAP repositories on your virtual machine. | SLES SAP BYOS virtual machines, SLES custom image virtual machines|
    | SLES_HPC | Installs SLES High Performance Computing repositories on your virtual machine. | SLES HPC BYOS virtual machines, SLES custom image virtual machines|

1. Wait five minutes for the extension to read the license type value and install the repositories.

   > [!NOTE]
   > If the extension isn't running by itself, you can run it on demand.

1. You should now be connected to the SUSE public cloud update infrastructure on Azure. The relevant repositories will be installed on your machine.

1. If you want to switch back to the bring-your-own-subscription model,  just change the license type to `None` and run the extension. This action will remove all repositories from your virtual machine and stop the billing.

## Enable Azure Hybrid Benefit for RHEL

After you successfully install the `AHBForRHEL` extension, you can use the `az vm update` command to update the existing license type on your running virtual machines. For SLES virtual machines, run the command and set the `--license-type` parameter to one of the following license types: `RHEL_BASE`, `RHEL_EUS`, `RHEL_SAPHA`, `RHEL_SAPAPPS`, `RHEL_BASESAPAPPS`, or `RHEL_BASESAPHA`.

### Enable Azure Hybrid Benefit for RHEL by using the Azure CLI
1. Install the Azure Hybrid Benefit extension on a running virtual machine. You can use the Azure portal or use the following command via the Azure CLI:
    ```azurecli
    az vm extension set -n AHBForRHEL --publisher Microsoft.Azure.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. After the extension is installed successfully, change the license type based on what you need:

    ```azurecli
    # This will enable Azure Hybrid Benefit to fetch software updates for RHEL base/regular repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASE
    
    # This will enable Azure Hybrid Benefit to fetch software updates for RHEL EUS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_EUS
    
    # This will enable Azure Hybrid Benefit to fetch software updates for RHEL SAP APPS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_SAPAPPS
    
    # This will enable Azure Hybrid Benefit to fetch software updates for RHEL SAP HA repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_SAPHA
    
    # This will enable Azure Hybrid Benefit to fetch software updates for RHEL BASE SAP APPS repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASESAPAPPS
    
    # This will enable Azure Hybrid Benefit to fetch software updates for RHEL BASE SAP HA repositories
    az vm update -g myResourceGroup -n myVmName --license-type RHEL_BASESAPHA

    ```
1. Wait five minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to Red Hat Update Infrastructure. The relevant repositories will be installed on your machine. You can validate the installation by running the following command on your virtual machine:
    ```bash
    yum repolist
    ```
1. If the extension isn't running by itself, you can try the following command on the virtual machine:
    ```bash
    systemctl start azure-hybrid-benefit.service
    ```
1. You can use the following command in your RHEL virtual machine to get the current status of the service:
    ```bash
    ahb-service -status
    ```

## Enable and disable Azure Hybrid Benefit for SLES

After you successfully install the `AHBForSLES` extension, you can use the `az vm update` command to update the existing license type on your running virtual machines. For SLES virtual machines, run the command and set the `--license-type` parameter to one of the following license types: `SLES_STANDARD`, `SLES_SAP`, or `SLES_HPC`.

### Enable Azure Hybrid Benefit for SLES by using the Azure CLI
1. Install the Azure Hybrid Benefit extension on a running virtual machine. You can use the Azure portal or use the following command via the Azure CLI:

    ```azurecli
    az vm extension set -n AHBForSLES --publisher SUSE.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. After the extension is installed successfully, change the license type based on what you need:

    ```azurecli
    # This will enable Azure Hybrid Benefit to fetch software updates for SLES Standard repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES

    # This will enable Azure Hybrid Benefit to fetch software updates for SLES SAP repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_SAP

    # This will enable Azure Hybrid Benefit to fetch software updates for SLES HPC repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_HPC
    ```
1. Wait five minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to the SUSE public cloud update infrastructure on Azure. The relevant repositories will be installed on your machine. You can verify this change by running the following command to list SUSE repositories on your machine:

    ```bash
    zypper repos
    ```
  
### Disable Azure Hybrid Benefit by using the Azure CLI
1. Ensure that the Azure Hybrid Benefit extension is installed on your virtual machine.
1. To disable Azure Hybrid Benefit, use the following command:

    ```azurecli
    # This will disable Azure Hybrid Benefit on a virtual machine
    az vm update -g myResourceGroup -n myVmName --license-type None
    ```

## Check the Azure Hybrid Benefit status of a virtual machine
1. Ensure that the Azure Hybrid Benefit extension is installed.   
1. In the Azure CLI or Azure Instance Metadata Service, run the following command: 

    ```azurecli
    az vm get-instance-view -g MyResourceGroup -n MyVm
    ```

1. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is one of the following, your virtual machine has Azure Hybrid Benefit enabled:

    `RHEL_BASE`, `RHEL_EUS`, `RHEL_BASESAPAPPS`, `RHEL_SAPHA`, `RHEL_BASESAPAPPS`, `RHEL_BASESAPHA`, `SLES`, `SLES_SAP`, `SLES_HPC` 

## Compliance

### Red Hat compliance

Customers who use Azure Hybrid Benefit BYOS to PAYG capability for RHEL agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offerings.

### SUSE compliance

If you use Azure Hybrid Benefit BYOS to PAYG capability for SLES and want more information about moving from SLES pay-as-you-go to BYOS, or moving from SLES BYOS to pay-as-you-go, see [Azure Hybrid Benefit Support](https://aka.ms/suse-ahb) on the SUSE website.

## Frequently asked questions
*Q: What is the licensing cost I pay with Azure Hybrid Benefit BYOS to PAYG capability?*

A: When you start using Azure Hybrid Benefit for BYOS virtual machines, you'll essentially convert the bring-your-own-subscription billing model to a pay-as-you-go billing model. What you pay will be similar to a software subscription cost for pay-as-you-go virtual machines. 

The following table maps the pay-as-you-go options on Azure and links to pricing information to help you understand the cost associated with Azure Hybrid Benefit BYOS to PAYG capability. When you go to the pricing pages, keep the Azure Hybrid Benefit for pay-as-you-go filter off.

| License type | Relevant pay-as-you-go virtual machine image and pricing link |
|---|---|---|   
| RHEL_BASE | [Red Hat Enterprise Linux](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/)  |
| RHEL_SAPAPPS | [RHEL for SAP Business Applications](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-business/) |
| RHEL_SAPHA | [RHEL for SAP with HA](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-ha/) |
| RHEL_BASESAPAPPS | [RHEL for SAP Business Applications](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-business/) |
| RHEL_BASESAPHA | [RHEL for SAP with HA](https://azure.microsoft.com/pricing/details/virtual-machines/rhel-sap-ha/) |
| RHEL_EUS | [Red Hat Enterprise Linux](https://azure.microsoft.com/pricing/details/virtual-machines/red-hat/)  |
| SLES | [SLES](https://azure.microsoft.com/pricing/details/virtual-machines/sles-standard/) |
| SLES_SAP | [SLES for SAP](https://azure.microsoft.com/pricing/details/virtual-machines/sles-sap/)  |
| SLES_HPC | [SLE HPC](https://azure.microsoft.com/pricing/details/virtual-machines/sles-hpc-standard/) |

*Q: Can I use a license type designated for RHEL (such as `RHEL_BASE`) with a SLES image, or vice versa?*

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your virtual machine will fail, and you might end up getting billed incorrectly. 

If you accidentally enter the wrong license type, remove the billing by changing the license type to empty. Then update your virtual machine to the correct license type to enable Azure Hybrid Benefit.

*Q: What are the supported versions for RHEL with Azure Hybrid Benefit BYOS to PAYG capability?*

A: Azure Hybrid Benefit BYOS to PAYG capability supports RHEL versions later than 7.4.

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to pay-as-you-go?*

A: Yes, this capability supports images uploaded from on-premises to Azure. Follow the steps in the [Get started](#get-started) section earlier in this article. 

*Q: Can I use Azure Hybrid Benefit BYOS to PAYG capability on RHEL and SLES pay-as-you-go Azure Marketplace virtual machines?*

A: No, because these virtual machines are already pay-as-you-go. However, with Azure Hybrid Benefit, you can use the license type of `RHEL_BYOS` for RHEL virtual machines and `SLES_BYOS` for conversions of RHEL and SLES pay-as-you-go Azure Marketplace virtual machines. For more information, see [Explore Azure Hybrid Benefit for pay-as-you-go Linux virtual machines](./azure-hybrid-benefit-linux.md).

*Q: Can I use Azure Hybrid Benefit BYOS to PAYG capability on virtual machine scale sets for RHEL and SLES?*

A: No. Azure Hybrid Benefit BYOS to PAYG capability isn't currently available for virtual machine scale sets.

*Q: Can I use Azure Hybrid Benefit BYOS to PAYG capability on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There's no plan for supporting these virtual machines.

*Q: Can I use Azure Hybrid Benefit BYOS to PAYG capability on my RHEL for Virtual Datacenters subscription?*

A: No. RHEL for Virtual Datacenters isn't supported on Azure at all, including Azure Hybrid Benefit.  

## Next steps
* [Learn how to convert RHEL and SLES pay-as-you-go virtual machines to BYOS by using Azure Hybrid Benefit](./azure-hybrid-benefit-linux.md)

* [Learn how to create and update virtual machines and add license types (RHEL_BYOS, SLES_BYOS) for Azure Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
