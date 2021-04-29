---
title: "Preview: Deploy a trusted launch VM"
description: Deploy a VM that uses trusted launch.
author: khyewei
ms.author: khwei
ms.reviewer: cynthn
ms.service: virtual-machines
ms.subservice: trusted-launch
ms.topic: how-to 
ms.date: 04/06/2021
ms.custom: template-how-to 
---

# Deploy a VM with trusted launch enabled (preview)

[Trusted launch](trusted-launch.md) is a way to improve the security of [generation 2](generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques by combining infrastructure technologies like vTPM and secure boot.

> [!IMPORTANT]
> Trusted launch is currently in public preview.
> 
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Deploy using the portal

Create a virtual machine with trusted launch enabled.

1. Sign in to the Azure [portal](https://aka.ms/TL_preview).
   > [!NOTE] 
   > The Portal link is unique to trusted launch preview.
   >  
2. Search for **Virtual Machines**.
3. Under **Services**, select **Virtual machines**.
4. In the **Virtual machines** page, select **Add**, and then select **Virtual machine**.
5. Under **Project details**, make sure the correct subscription is selected.
6. Under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
7. Under **Instance details**, type a name for the virtual machine name and choose a region that supports [trusted launch](trusted-launch.md#public-preview-limitations).
8. Under **Image**, select a Gen 2 [image that supports trusted launch](trusted-launch.md#public-preview-limitations). Make sure you see the following message: **This image supports trusted launch preview. Configure in the Advanced tab**.
   > [!TIP]
   > If you don't see the Gen 2 version of the image you want in the drop-down, select **See all images** and then change the **VM Generation** filter to only show Gen 2 images. Find the image in the list, then use the **Select** drop-down to select the Gen 2 version.

    :::image type="content" source="media/trusted-launch/gen-2-image.png" alt-text="Screenshot showing the message confirming that this is a gen2 image that supports trusted launch.":::

13.	Select a VM size that supports trusted launch. See the list of [supported sizes](trusted-launch.md#public-preview-limitations).
14.	Fill in the **Administrator account** information and then **Inbound port rules**. 
1. Switch over to the **Advanced** tab by selecting it at the top of the page.
1. Scroll down to the **VM generation** section. Make sure **Gen 2** is selected.
1. While still on the **Advanced** tab, scroll down to **Trusted launch**, and then select the **Trusted launch** checkbox. This will make two more options appear - Secure boot and vTPM. Select the appropriate options for your deployment.

    :::image type="content" source="media/trusted-launch/trusted-launch-portal.png" alt-text="Screenshot showing the options for trusted launch.":::

15.	At the bottom of the page, select **Review + Create**
16.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. When you are ready, select **Create**.

    :::image type="content" source="media/trusted-launch/validation.png" alt-text="Sceenshot of the validation page, showing the trusted launch options are included.":::


It will take a few minutes for your VM to be deployed. 

## Deploy using a template

You can deploy trusted launch VMs using a quickstart template:

**Linux**:    
[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-trustedlaunch-linux%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-trustedlaunch-linux%2FcreateUiDefinition.json)

**Windows**:    
[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-trustedlaunch-windows%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-vm-trustedlaunch-windows%2FcreateUiDefinition.json)

## View and update

You can view the trusted launch configuration for an existing VM by visiting the **Overview** page for the VM in the portal.

To change the trusted launch configuration, in the left menu, select **Configuration** under the **Settings** section. You can enable or disable Secure Boot and vTPM from the **Trusted Launch** section. Select **Save** at the top of the page when you are done. 

:::image type="content" source="media/trusted-launch/configuration.png" alt-text="Screenshot of how to change the trusted launch configuration.":::

If the VM is running, you will receive a message  that the VM will be restarted to apply the modified trusted launch configuration. Select **Yes** then wait for the VM to restart for changes to take effect.


## Verify secure boot and vTPM

You can validate that secure boot and vTPM are enabled on the virtual machine.
	
### Linux: validate if secure boot is running

SSH to the VM and then run the following command: 

```bash
mokutil --sb-state
```

If secure boot is enable, the command will return:
 
```bash
SecureBoot enabled 
```

### Linux: validate if vTPM is enabled

SSH into your VM. Check if tpm0 device is present: 

```bash
ls /dev/tpm0
```

If vTPM is enabled, the command will return:

```output
/dev/tpm0
```

If vTPM is disabled, the command will return:

```output
ls: cannot access '/dev/tpm0': No such file or directory
```

### Windows: validate that secure boot is running

Connect to the VM using remote desktop and then run `msinfo32.exe`.

In the right pane, check that the Secure Boot State is **ON**.

## Enable the Azure Security Center experience

To enable Azure Security Center to display information about your trusted launch VMs, you need to enable several policies. The easiest way to enable the policies is by deploying this [Resource Manager template](https://github.com/prash200/azure-quickstart-templates/tree/master/101-asc-trustedlaunch-policies) to your subscription. 

Select the button below to deploy the policies to your subscription:

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fprash200%2Fazure-quickstart-templates%2Fmaster%2F101-asc-trustedlaunch-policies%2Fazuredeploy.json)

The template needs to be deployed only once per subscription. It automatically installs `GuestAttestation` and `AzureSecurity` extensions on all supported VMs. If you get errors, try redeploying the template again.

To get vTPM and secure boot recommendations for trusted launch VMs, see [Add a custom initiative to your subscription](../security-center/custom-security-policies.md#to-add-a-custom-initiative-to-your-subscription).
 
## Sign things for Secure Boot on Linux

In some cases, you might need to sign things for UEFI Secure Boot.  For example, you might need to go through [How to sign things for Secure Boot](https://ubuntu.com/blog/how-to-sign-things-for-secure-boot) for Ubuntu. In these cases, you need to enter the MOK utility enroll keys for your VM. To do this, you need to use the Azure Serial Console to access the MOK utility.

1. Enable Azure Serial Console for Linux. For more information, see [Serial Console for Linux](/troubleshoot/azure/virtual-machines/serial-console-linux).
1. Log in to the [Azure portal](https://portal.azure.com).
1. Search for **Virtual machines** and select your VM from the list.
1. In the left menu, under **Support + troubleshooting**, select **Serial console**. A page will open to the right, with the serial console.
1. Log on to the VM using Azure Serial Console. For **login**, enter the username you used when you created the VM. For example, *azureuser*. When prompted, enter the password associated with the username.
1. Once you are logged in, use `mokutil` to import the public key `.der` file.

    ```bash
    sudo mokutil –import <path to public key.der> 
    ```
1. Reboot the machine from Azure Serial Console by typing `sudo reboot`. A 10 second countdown will begin.
1. Press up or down key to interrupt the countdown and wait in UEFI console mode. If the timer is not interrupted, the boot process continues and all of the MOK changes are lost.
1. Select the appropriate action from the MOK utility menu.

    :::image type="content" source="media/trusted-launch/mok-mangement.png" alt-text="Screenshot showing the available options on the MOK management menu in the serial console.":::


## Next steps

Learn more about [trusted launch](trusted-launch.md) and [Generation 2](generation-2.md) VMs.
