---
title: Red Hat Enterprise Linux bring-your-own-subscription Azure images | Microsoft Docs
description: Learn about bring-your-own-subscription images for Red Hat Enterprise Linux on Azure.
author: mamccrea
ms.service: virtual-machines
ms.subservice: redhat
ms.custom: devx-track-azurecli
ms.collection: linux
ms.topic: article
ms.date: 06/10/2020
ms.author: mamccrea
---

# Red Hat Enterprise Linux bring-your-own-subscription Gold Images in Azure

**Applies to:** :heavy_check_mark: Linux VMs 

Red Hat Enterprise Linux (RHEL) images are available in Azure via a pay-as-you-go or bring-your-own-subscription (BYOS) (Red Hat Gold Image) model. This article provides an overview of the Red Hat Gold Images in Azure.

>[!NOTE]
> RHEL BYOS Gold Images are available in Azure Public (commercial) and Azure Government clouds. They're not available in Azure China or Azure Blackforest clouds.

## Important points to consider

- The Red Hat Gold Images provided in this program are production-ready RHEL images similar to the RHEL pay-as-you-go images in Azure Marketplace.
- The images follow the current policies described in [Red Hat Enterprise Linux images on Azure](./redhat-images.md).
- Standard support policies apply to VMs created from these images.
- The VMs provisioned from Red Hat Gold Images don't carry RHEL fees associated with RHEL pay-as-you-go images.
- The images are unentitled. You must use Red Hat Subscription-Manager to register and subscribe the VMs to get updates from Red Hat directly.
- It's possible to switch from pay-as-you-go images to BYOS using the [Azure Hybrid Benefit](../../linux/azure-hybrid-benefit-linux.md). To convert from RHEL BYOS to pay-as-you-go, follow the steps in [Azure Hybrid Benefit for bring-your-own-subscription Linux virtual machines](../../linux/azure-hybrid-benefit-byos-linux.md#get-started)

## Requirements and conditions to access the Red Hat Gold Images

1. Get familiar with the [Red Hat Cloud Access program](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) terms. Enable your Red Hat subscriptions for Cloud Access at [Red Hat Subscription-Manager](https://access.redhat.com/management/cloud). You need to have on hand the Azure subscriptions that are going to be registered for Cloud Access.

1. If the Red Hat subscriptions you enabled for Cloud Access meet the eligibility requirements, your Azure subscriptions are automatically enabled for Gold Image access.

### Expected time for image access

After you finish the Cloud Access enablement steps, Red Hat validates your eligibility for the Red Hat Gold Images. If validation is successful, you receive access to the Gold Images within three hours.

## Use the Red Hat Gold Images from the Azure portal

1. After your Azure subscription receives access to Red Hat Gold Images, you can locate them in the [Azure portal](https://portal.azure.com). Go to **Create a Resource** > **See all**.

1. At the top of the page, you'll see that you have private offers.

    ![Marketplace private offers](./media/rhel-byos-privateoffers.png)

1. Select the purple link, or scroll down to the bottom of the page to see your private offers.

1. The rest of provisioning in the UI is no different to any other existing Red Hat image. Choose your RHEL version, and follow the prompts to provision your VM. This process also lets you accept the terms of the image at the final step.

>[!NOTE]
>These steps so far won't enable your Red Hat Gold Image for programmatic deployment. An additional step is required as described in the "Additional information" section.

The rest of this document focuses on the CLI method to provision and accept terms on the image. The UI and CLI are fully interchangeable as far as the final result (a provisioned RHEL Gold Image VM) is concerned.

## Use the Red Hat Gold Images from the Azure CLI

The following instructions walk you through the initial deployment process for a RHEL VM by using the Azure CLI. These instructions assume that you have the [Azure CLI installed](/cli/azure/install-azure-cli).

>[!IMPORTANT]
>Make sure you use all lowercase letters in the publisher, offer, plan, and image references for all the following commands.

1. Check that you're in your desired subscription.

    ```azurecli
    az account show -o=json
    ```

1. Create a resource group for your Red Hat Gold Image VM.

    ```azurecli
    az group create --name <name> --location <location>
    ```

1. Accept the image terms.

    ```azurecli
    az vm image terms accept --publisher redhat --offer rhel-byos --plan <SKU value here> -o=jsonc

    # Example:
    az vm image terms accept --publisher redhat --offer rhel-byos --plan rhel-lvm75 -o=jsonc

    OR

    az vm image terms accept --urn redhat:rhel-byos:rhel-lvm8:8.0.20190620
    ```

    >[!NOTE]
    >These terms need to be accepted *once per Azure subscription, per image SKU*.

1. (Optional) Validate your VM deployment with the following command:

    ```azurecli
    az vm create -n <VM name> -g <resource group name> --image <image urn> --validate

    # Example:
    az vm create -n rhel-byos-vm -g rhel-byos-group --image redhat:rhel-byos:rhel-lvm8:latest --validate
    ```

1. Provision your VM by running the same command as shown in the previous example without the `--validate` argument.

    ```azurecli
    az vm create -n <VM name> -g <resource group name> --image <image urn>

    # Example:
    az vm create -n rhel-byos-vm -g rhel-byos-group --image redhat:rhel-byos:rhel-lvm8:latest
    ```

1. SSH into your VM, and verify that you have an unentitled image. To do this step, run `sudo yum repolist`. For RHEL 8, use `sudo dnf repolist`. The output asks you to use Subscription-Manager to register the VM with Red Hat.

>[!NOTE]
>On RHEL 8, `dnf` and `yum` are interchangeable. For more information, see the [RHEL 8 admin guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/packaging_and_distributing_software/index).

## Use the Red Hat Gold Images from PowerShell

The following script is an example. Replace the resource group, location, VM name, login information, and other variables with the configuration of your choice. Publisher and plan information must be lowercase.

```powershell-interactive
    # Variables for common values
    $resourceGroup = "testbyos"
    $location = "canadaeast"
    $vmName = "test01"

    # Define user name and blank password
    $securePassword = ConvertTo-SecureString 'TestPassword1!' -AsPlainText -Force
    $cred = New-Object System.Management.Automation.PSCredential("azureuser",$securePassword)
    Get-AzureRmMarketplaceTerms -Publisher redhat -Product rhel-byos -Name rhel-lvm75 | SetAzureRmMarketplaceTerms -Accept

    # Create a resource group
    New-AzureRmResourceGroup -Name $resourceGroup -Location $location

    # Create a subnet configuration
    $subnetConfig = New-AzureRmVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24

    # Create a virtual network
    $vnet = New-AzureRmVirtualNetwork -ResourceGroupName $resourceGroup -Location
    $location `-Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig

    # Create a public IP address and specify a DNS name
    $pip = New-AzureRmPublicIpAddress -ResourceGroupName $resourceGroup -Location
    $location `-Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4

    # Create an inbound network security group rule for port 22
    $nsgRuleSSH = New-AzureRmNetworkSecurityRuleConfig -Name
    myNetworkSecurityGroupRuleSSH -Protocol Tcp `
    -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -
    DestinationAddressPrefix * `-DestinationPortRange 22 -Access Allow

    # Create a network security group
    $nsg = New-AzureRmNetworkSecurityGroup -ResourceGroupName $resourceGroup -Location
    $location `-Name myNetworkSecurityGroup -SecurityRules $nsgRuleSSH

    # Create a virtual network card and associate with public IP address and NSG
    $nic = New-AzureRmNetworkInterface -Name myNic -ResourceGroupName $resourceGroup -
    Location $location `-SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

    # Create a virtual machine configuration
    $vmConfig = New-AzureRmVMConfig -VMName $vmName -VMSize Standard_D3_v2 |
    Set-AzureRmVMOperatingSystem -Linux -ComputerName $vmName -Credential $cred |
    Set-AzureRmVMSourceImage -PublisherName redhat -Offer rhel-byos -Skus rhel-lvm75 -Version latest | Add-     AzureRmVMNetworkInterface -Id $nic.Id
    Set-AzureRmVMPlan -VM $vmConfig -Publisher redhat -Product rhel-byos -Name "rhel-lvm75"

    # Configure SSH Keys
    $sshPublicKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
    Add-AzureRmVMSshPublicKey -VM $vmconfig -KeyData $sshPublicKey -Path "/home/azureuser/.ssh/authorized_keys"

    # Create a virtual machine
    New-AzureRmVM -ResourceGroupName $resourceGroup -Location $location -VM $vmConfig
```

## Encrypt Red Hat Enterprise Linux bring-your-own-subscription Gold Images

Red Hat Enterprise Linux BYOS Gold Images can be secured through the use of [Azure Disk Encryption](../../linux/disk-encryption-overview.md). The subscription *must* be registered before you can enable encryption. For more information on how to register a RHEL BYOS Gold Image, see [How to register and subscribe a system to the Red Hat Customer Portal using Red Hat Subscription-Manager](https://access.redhat.com/solutions/253273). If you have an active Red Hat subscription, you can also read [Creating Red Hat Customer Portal Activation Keys](https://access.redhat.com/articles/1378093).

Azure Disk Encryption isn't supported on [Red Hat custom images](../../linux/redhat-create-upload-vhd.md). Additional Azure Disk Encryption requirements and prerequisites are documented in [Azure Disk Encryption for Linux VMs](../../linux/disk-encryption-overview.md#additional-vm-requirements).

For steps to apply Azure Disk Encryption, see [Azure Disk Encryption scenarios on Linux VMs](../../linux/disk-encryption-linux.md) and related articles.

## Additional information

- If you attempt to provision a VM on a subscription that isn't enabled for this offer, you get the following message:

    ```
    "Offer with PublisherId: redhat, OfferId: rhel-byos, PlanId: rhel-lvm75 is private and can not be purchased by subscriptionId: GUID"
    ```

    In this case, contact Microsoft or Red Hat to enable your subscription.

- If you modify a snapshot from a RHEL BYOS image and attempt to publish that custom image to the [Azure Compute Gallery](../../shared-image-galleries.md) (formerly known as Shared Image Gallery), you must provide plan information that matches the original source of the snapshot. For example, the command might look like this:

    ```azurecli
    az vm create –image \
    "/subscriptions/GUID/resourceGroups/GroupName/providers/Microsoft.Compute/galleries/GalleryName/images/ImageName/versions/1.0.0" \
    -g AnotherGroupName --location EastUS2 -n VMName \
    --plan-publisher redhat --plan-product rhel-byos --plan-name rhel-lvm75
    ```

    Note the plan parameters in the final line.

    [Azure Disk Encryption](#encrypt-red-hat-enterprise-linux-bring-your-own-subscription-gold-images) isn't supported on custom images.

- If you use automation to provision VMs from the RHEL BYOS images, you must provide plan parameters similar to what was shown in the sample commands. For example, if you use Terraform, you provide the plan information in a [plan block](https://www.terraform.io/docs/providers/azurerm/r/virtual_machine.html#plan).

## Next steps

- More details about Red Hat Cloud Access are available at the [Red Hat public cloud documentation](https://access.redhat.com/public-cloud)
- For step-by-step guides and program details for Cloud Access, see the [Red Hat Cloud Access documentation](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/index).
- To learn more about the Red Hat Update Infrastructure, see [Azure Red Hat Update Infrastructure](./redhat-rhui.md).
- To learn more about all the Red Hat images in Azure, see the [documentation page](./redhat-images.md).
- For information on Red Hat support policies for all versions of RHEL, see the [Red Hat Enterprise Linux life cycle](https://access.redhat.com/support/policy/updates/errata) page.
- For additional documentation on the RHEL Gold Images, see the [Red Hat documentation](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/understanding-gold-images_cloud-access#proc_using-gold-images-azure_cloud-access#proc_using-gold-images-azure_cloud-access).
