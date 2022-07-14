---
title: Azure Hybrid Benefit for BYOS Linux virtual machines
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

Azure Hybrid Benefit provides software updates and integrated support directly from Azure for Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines. Azure Hybrid Benefit for bring-your-own-subscription (BYOS) virtual machines is a licensing benefit that's currently in public preview. It lets you switch to: 

- RHEL and SLES virtual machines generated from custom on-premises images.
- RHEL and SLES BYOS virtual machines from Azure Marketplace. 

>[!IMPORTANT]
> For steps to switch in the reverse, from a BYOS virtual machine to a RHEL pay-as-you-go virtual machine or SLES pay-as-you-go virtual machine, refer to [Hybrid Benefit for pay-as-you-go virtual machines](./azure-hybrid-benefit-linux.md).

## How does Azure Hybrid Benefit work?
When you switch to Azure Hybrid Benefit, you get software updates and integrated support for Azure Marketplace BYOS or on-premises migrated RHEL and SLES BYOS virtual machines. Azure Hybrid Benefit converts BYOS billing to *pay-as-you-go*, so that you pay only pay-as-you-go software fees. You don't have to restart for Azure Hybrid Benefit to be applied.

:::image type="content" source="./media/ahb-linux/azure-hybrid-benefit-byos-cost.png" alt-text="Screenshot that shows Azure Hybrid Benefit costs for Linux virtual machines.":::

## Which Linux virtual machines qualify for Azure Hybrid Benefit for BYOS virtual machines?

Azure Hybrid Benefit for BYOS virtual machines is available to all RHEL and SLES custom image virtual machines. It's also available to all RHEL and SLES Azure Marketplace BYOS virtual machines. 

Azure Dedicated Host instances and SQL hybrid benefits aren't eligible for Azure Hybrid Benefit if you're already using it with Linux virtual machines. Virtual machine scale sets are reserved instances and can't use Azure Hybrid Benefit BYOS.

## Get started

### Azure Hybrid Benefit for Red Hat customers

To start using Azure Hybrid Benefit for Red Hat:

1. Install the `AHBForRHEL` extension on the virtual machine on which you want to apply the Azure Hybrid Benefit BYOS benefit. You can do this installation via Azure command-line interface (CLI) or PowerShell.


1. Depending on the software updates you want, change the license type to relevant value. Here are the available license type values and the software updates associated with them:

    | License type  | Software updates  | Allowed virtual machines|  
    |---|---|---|
    | RHEL_BASE  | Installs Red Hat regular/base repositories into your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_EUS | Installs Red Hat Extended Update Support (EUS) repositories into your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_SAPAPPS  | Installs RHEL for SAP Business Apps repositories into your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_SAPHA | Installs RHEL for SAP with HA repositories into your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_BASESAPAPPS | Installs RHEL regular/base SAP Business Apps repositories into your virtual machine. | RHEL BYOS virtual machines, RHEL custom image virtual machines|
    | RHEL_BASESAPHA | Installs regular/base RHEL for SAP with HA repositories into your virtual machine.| RHEL BYOS virtual machines, RHEL custom image virtual machines|

1. Wait for one hour for the extension to read the license type value and install the repositories.

1. You should now be connected to Azure Red Hat Update and the relevant repositories will be installed in your machine.  

1. In case the extension isn't running by itself, you can run it on demand as well.

1. In case you want to switch back to the bring-your-own-subscription model,  just change the license type to 'None' and run the extension. This action will remove all RHUI repositories from your virtual machine and stop the billing.

>[!Note]
> In the unlikely event that the extension is unable to install repositories or there are any other issues, switch the license type back to empty and reach out to Support. This ensures that you don't get billed for software updates.  

### Azure Hybrid Benefit for SUSE customers

To start using Azure Hybrid Benefit for SLES virtual machines:

1. Install the Azure Hybrid Benefit for BYOS Virtual Machines extension on the virtual machine that will use it.
1. Change the license type to the value relevant to the software updates you want. Here are the available license type values and the software updates associated with them:

    | License type  | Software updates  | Allowed virtual machines|  
    |---|---|---|
    | SLES  | Installs SLES standard repositories into your virtual machine. | SLES BYOS virtual machines, SLES custom image virtual machines|
    | SLES_SAP | Installs SLES SAP repositories into your virtual machine. | SLES SAP BYOS virtual machines, SLES custom image virtual machines|
    | SLES_HPC  | Installs SLES High Performance Compute related repositories  into your virtual machine. | SLES HPC BYOS virtual machines, SLES custom image virtual machines|

1. Wait for 5 minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to the SUSE Public Cloud Update Infrastructure on Azure and the relevant repositories will be installed in your machine.

1. In case the extension isn't running by itself, you can run it on demand as well.

1. In case you want to switch back to the bring-your-own-subscription model,  just change the license type to 'None' and run the extension. This action will remove all repositories from your virtual machine and stop the billing.

## Enable and disable Azure Hybrid Benefit for RHEL

You can install the `AHBForRHEL` extension. After successfully installing the extension, you can use the `az vm update` command to update your existing license type on your running virtual machines. For SLES virtual machines, run the command and set `--license-type` parameter to one of the following license types: `RHEL_BASE`, `RHEL_EUS`, `RHEL_SAPHA`, `RHEL_SAPAPPS`, `RHEL_BASESAPAPPS` or `RHEL_BASESAPHA`.


### Enable Azure Hybrid Benefit for RHEL using a CLI
1. Install the Azure Hybrid Benefit extension on a virtual machine that is up and running. You can use Azure portal or the following command via Azure CLI:
    ```azurecli
    az vm extension set -n AHBForRHEL --publisher Microsoft.Azure.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. After the extension is installed successfully, change the license type based on what you require:

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
1. Wait for 5 minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to Azure Red Hat Update Infrastructure and the relevant repositories will be installed in your machine. You can validate the same by running the following command on your virtual machine:
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

After you successfully install the `AHBForSLES` extension, you can use the `az vm update` command to update existing license type on running virtual machines. For SLES virtual machines, run the command and set `--license-type` parameter to one of the following license types: `SLES_STANDARD`, `SLES_SAP` or `SLES_HPC`.

### Enable Azure Hybrid Benefit for SLES using a CLI
1. Install the Azure Hybrid Benefit extension on a virtual machine that is up and running, with the portal, or via Azure CLI using the following command:
    ```azurecli
    az vm extension set -n AHBForSLES --publisher SUSE.AzureHybridBenefit --vm-name myVMName --resource-group myResourceGroup
    ```
1. Once, the extension is installed successfully, change the license type based on what you require:

    ```azurecli
    # This will enable Azure Hybrid Benefit to fetch software updates for SLES STANDARD repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES

    # This will enable Azure Hybrid Benefit to fetch software updates for SLES SAP repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_SAP

    # This will enable Azure Hybrid Benefit to fetch software updates for SLES HPC repositories
    az vm update -g myResourceGroup -n myVmName --license-type SLES_HPC

    ```
1. Wait for 5 minutes for the extension to read the license type value and install the repositories.

1. You should now be connected to the SUSE Public Cloud Update Infrastructure on Azure and the relevant repositories will be installed in your machine. You can verify this change by running the following command on your virtual machine, which lists SUSE repositories on your virtual machine:
    ```bash
    zypper repos
    ```
  
### Disable Azure Hybrid Benefit using a CLI
1. Ensure that the Azure Hybrid Benefit extension is installed on your virtual machine.
1. To disable Azure Hybrid Benefit, use the following command:

    ```azurecli
    # This will disable Azure Hybrid Benefit on a virtual machine
    az vm update -g myResourceGroup -n myVmName --license-type None
    ```

## Check the Azure Hybrid Benefit status of a virtual machine
To check the Azure Hybrid Benefit status of a virtual machine, do the following:
1. Ensure that the Azure Hybrid Benefit extension is installed:    
1. You can view the Azure Hybrid Benefit status of a virtual machine by using the Azure CLI or by using Azure Instance Metadata Service.

    You can use the following command for this purpose. Look for a `licenseType` field in the response. If the `licenseType` field exists and the value is one of the following, your virtual machine has Azure Hybrid Benefit enabled:
    `RHEL_BASE`, `RHEL_EUS`, `RHEL_BASESAPAPPS`, `RHEL_SAPHA`, `RHEL_BASESAPAPPS`, `RHEL_BASESAPHA`, `SLES`, `SLES_SAP`, `SLES_HPC`. 

    ```azurecli
    az vm get-instance-view -g MyResourceGroup -n MyVm
    ```

## Compliance

### Red Hat compliance

Customers who use Azure Hybrid Benefit for BYOS virtual machines for RHEL agree to the standard [legal terms](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Cloud_Software_Subscription_Agreement_for_Microsoft_Azure.pdf) and [privacy statement](http://www.redhat.com/licenses/cloud_CSSA/Red_Hat_Privacy_Statement_for_Microsoft_Azure.pdf) associated with the Azure Marketplace RHEL offerings.

### Explore Azure Hybrid Benefit for SUSE

Customers who use Azure Hybrid Benefit for BYOS virtual machines for SLES and want more for information about moving from SLES pay-as-you-go to BYOS or moving from SLES BYOS to pay-as-you-go, see [SUSE Linux Enterprise and Azure Hybrid Benefit](https://aka.ms/suse-ahb).

## Frequently asked questions
*Q: What is the licensing cost I pay with Azure Hybrid Benefit for BYOS virtual machines?*

A: On using Azure Hybrid Benefit for BYOS virtual machines, you'll essentially convert bring-your-own-subscription billing model to pay-as-you-go billing model. Hence, you'll be paying similar to pay-as-you-go virtual machines for software subscription cost. The following table maps the pay-as-you-go options available on Azure and links to pricing page to help you understand the cost associated with Azure Hybrid Benefit for BYOS virtual machines.

| License type | Relevant pay-as-you-go virtual machine image & Pricing Link (Keep the Azure Hybrid Benefit for pay-as-you-go filter off) |
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

A: No, you can't. Trying to enter a license type that incorrectly matches the distribution running on your virtual machine will fail and you might end up getting billed incorrectly. However, if you accidentally enter the wrong license type, either changing the license type to empty will remove the billing or updating your virtual machine again to the correct license type will still enable Azure Hybrid Benefit.

*Q: What are the supported versions for RHEL with Azure Hybrid Benefit for BYOS virtual machines?*

A: RHEL versions greater than 7.4 are supported with Azure Hybrid Benefit for BYOS virtual machines.

*Q: I've uploaded my own RHEL or SLES image from on-premises (via Azure Migrate, Azure Site Recovery, or otherwise) to Azure. Can I convert the billing on these images from BYOS to pay-as-you-go?*

A: Yes, this capability supports image from on-premises to Azure. Please [follow steps shared here](#get-started). 

*Q: Can I use Azure Hybrid Benefit for BYOS virtual machines on RHEL and SLES pay-as-you-go Azure Marketplace virtual machines?*

A: No, as these virtual machines are already pay-as-you-go. However, with Azure Hybrid Benefit v1 and v2 you can use the license type of `RHEL_BYOS` for RHEL virtual machines and `SLES_BYOS` for conversions of RHEL and SLES pay-as-you-go Azure Marketplace virtual machines. You can read more on [Hybrid Benefit for pay-as-you-go virtual machines here.](./azure-hybrid-benefit-linux.md)

*Q: Can I use Azure Hybrid Benefit for BYOS virtual machines on virtual machine scale sets for RHEL and SLES?*

A: No, Hybrid Benefit for BYOS virtual machines isn't available for virtual machine scale sets currently.

*Q: Can I use Azure Hybrid Benefit for BYOS virtual machines on a virtual machine deployed for SQL Server on RHEL images?*

A: No, you can't. There's no plan for supporting these virtual machines.

*Q: Can I use Azure Hybrid Benefit for BYOS virtual machines on my RHEL Virtual Data Center subscription?*

A: No, you can't. VDC isn't supported on Azure at all, including Azure Hybrid Benefit.  

## Next steps
* [Learn how to convert RHEL and SLES pay-as-you-go virtual machines to BYOS using Hybrid Benefit for pay-as-you-go virtual machines](./azure-hybrid-benefit-linux.md)

* [Learn how to create and update virtual machines and add license types (RHEL_BYOS, SLES_BYOS) for Hybrid Benefit by using the Azure CLI](/cli/azure/vm)
