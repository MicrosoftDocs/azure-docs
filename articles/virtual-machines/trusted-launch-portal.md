---
title: "Preview: Deploy a Trusted Launch VM using the portal"
description: Deploy a VM that uses Trusted Launch by using the portal. 
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: security
ms.topic: how-to 
ms.date: 02/23/2021
ms.custom: template-how-to 
---

# Deploy a VM with Trusted Launch enabled using the portal (preview)

Azure offers [Trusted Launch](trusted-launch.md) as a way to increase the security of [generation 2](generation-2.md) VMs. Trusted Launch protects against advanced and persistent attack techniques. Trusted Launch is comprised of several infrastructure technologies, including vTPM and secure boot.

## Deploy a VM
Create virtual machine with Trusted Launch Enabled
1. Sign in to the Azure [portal](https://portal.azure.com).
1. Search for **Virtual Machines**.
2. Under **Services**, select **Virtual machines**.
3. In the **Virtual machines** page, select **Add**, and then select **Virtual machine**.
4. Under **Project details**, make sure the correct subscription is selected.
5. Under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
5. Under **Instance details**, type a name for the virtual machine name and choose a region that supports trusted launch.
1. Under **Image**, select an [image that supports Trusted Launch](trusted-launch.md#public-preview-limitations). You might only see the Gen 1 version of the image, that is okay, go on to the next step.
1. Switch over to the **Advanced** tab by selecting it at the top of the page.
1. Scroll down to the **VM generation** section, and then select **Gen 2**.
1. While still on the **Advanced** tab, scroll down to **Trusted launch**, and then select the **Trusted launch** checkbox. This will make two more options appear - Secure boot and vTPM. Select the appropriate options for your deployment.

    :::image type="content" source="media/trusted-launch/trusted-launch-portal.png" alt-text="Screenshot showing the options for Trusted Launch.":::

1. Go back to the **Basics** tab, under **Image**, and make sure see the following message: **This image supports trusted launch preview. Configure in the Advanced tab**. The image should now be listed as the gen 2 version.

    :::image type="content" source="media/trusted-launch/gen-2-image.png" alt-text="Screenshot showing the message confirming that this is a gen2 image that supports Trusted Launch.":::

7.	Select a VM size that supports Gen 2, like Standard_D2s_v3. Please see the list of supported [generation 2 sizes](generation-2.md#generation-2-vm-sizes).
8.	Fill in the **Administrator account** information and then **Inbound port rules**.
10.	At the bottom of the page, select **Review + Create**
11.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. When you are ready, select **Create**.

    :::image type="content" source="media/trusted-launch/validation.png" alt-text="Sceenshot of the validation page, showing the Trusted Launch options are included.":::


It will take a few minutes for your VM to be deployed. 

## View and update

You can view the Trusted Launch configuration for an existing VM by visiting the **Overview** page for the VM.

To update or modify the Trusted Launch configuration, select **Configuration** under **Settings**. You can enable or disable Secure Boot and vTPM under Trusted Launch. Select **Apply** when you are done. I

If the VM is running, you will receive a message  that the VM will be rebooted to apply the modified Trusted Launch configuration. Select **OK** then wait for the VM to reboot for changes to take effect.


## Verify secure boot and vTPM

You can validate that secure boot and vTPM are enabled on the virtual machine.
	
### Linux: validate if secure boot is running

SSH to the VM and then run the following command: 

```bash
mokutil --sb-state
```

If secure boot is enable, this will return:
 
```bash
SecureBoot enabled 
```

### Linux: validate if vTPM is enabled

SSH into your VM. Check if tpm0 device is present: 

```bash
ls /dev/tpm0
```

If vTPM is enabled it will return:

```output
/dev/tpm0
```

If vTPM is disabled, it will return:

```output
ls: cannot access '/dev/tpm0': No such file or directory
```


### Windows: validate that secure boot is running 

Connect to the VM using remote desktop and then run `msinfo32.exe`.

In the right pane, check that the Secure Boot State is **ON**.
 
## Sign things for Secure Boot on Linux

In some cases, you might need to sign things for UEFI Secure Boot.  For example, you might need to go through [How to sign things for Secure Boot](https://ubuntu.com/blog/how-to-sign-things-for-secure-boot) for Ubuntu. In these cases, you need to enter the MOK utility enroll keys for your VM. To do this, you need to use the Azure Serial Console to access the MOK utility.

1.	Enable Azure Serial Console for Linux. For more information, see [Serial Console for Linux](serial-console-linux.md).
2. Log in to the [Azure portal](https://portal.azure.com).
1. Search for **Virtual machines** and select your VM from the list.
1. In the left menu, under **Support + troubleshooting**, select **Serial console**. A page will open to the right, with the serial console.
2.	Log on to the VM using Azure Serial Console. For **login**, enter the username you used when you created the VM. For example, *azureuser*. When prompted, enter the password associated with the username.
3.	Once you are logged in, use `mokutil` to import the public key `.der` file.

    ```bash
    sudo mokutil –import <path to public key.der> 
    ```
4.	Reboot the machine from Azure Serial Console by typing `sudo reboot`. A 10 second countdown will begin.
6.	Press up or down key to interrupt the countdown and wait in UEFI console mode. If the timer is not interrupted booting process continues and all the MOK changes are lost.
7.	Select the appropriate action from the MOK utility menu.
:::image type="content" source="media/trusted-launch/mok-mangement.png" alt-text="Screenshot showing the available options on the MOK management menu in the serial console.":::


# Next steps

Learn more about [Trusted Launch](trusted-launch.md) and [Generation 2](generation-2.md) VMs.
