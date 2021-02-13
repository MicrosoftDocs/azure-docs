---
title: Windows Virtual Desktop FSLogix Office app rule editor - Azure
description: How to use the app rule editor to change FSLogix and Office apps in Windows Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 02/11/2021
ms.author: helohr
manager: lizross
---
# FSLogix and Office app rule editor

This article explains the flow need to take a virtual machine (VM) with Office installed. Offload the Office folder to a network location and use the VM as template for all other machines in the host pool.

![A picture containing drawing Description automatically generated](media/b9ee38825253fc0c08981cc23542e458.png)

## Requirements

You'll need the following things to set up the rule editor:

- a VM running Windows
- a copy of Office
- a copy of FSLogix installed on your deployment
- a network share that all VMs in your host pool have read-only access to

## Install Office

To install Office on your VHD or VHDX, enable the Remote Desktop Protocol in your VM, then follow the instructions in [Install Office on a VHD master image](install-office-on-wvd-master-image.md). When installing, make sure you're using [the correct licenses](overview.md#requirements).

>[!NOTE]
>Windows Virtual Desktop requires Share Computer Activation (SCA).

## Install FSLogix

To install FSLogix and the Rule Editor, follow the instructions in [Download and install FSLogix](/fslogix/install-ht).

## Create and prepare a VHD for the Rule Editor

Next, you'll need to create and prepare a VHD image to use the Rule Editor on:

1. Open a command prompt as an administrator and run the following command:

    ```cmd
	    for /f "tokens=1 delims=" %%# in ('qprocess^|find /i /c /n "MicrosoftEdg"') do ( set count=%%# ) 
 	    taskkill /F /IM MicrosoftEdge.exe /T
    ```

    >[!NOTE]
    > Make sure to keep the blank spaces you see in this command.

2. After that, run the following command:

    ```cmd
    sc queryex type=service state=all | find /i "ClickToRunSvc"
    ```
    
    >[!NOTE]
    >If you find the service, restart the VM before continuing with step 3.

3. Next, go to **Program Files** > **FSLogix** > **Apps** and run the following command to create the target VHD:

    ```cmd
    frx moveto-vhd -filename <path to network share>\office.vhdx -src "C:\Program Files\Microsoft Office" -size-mbs 5000 
    ```

    The VHD you create with this command should contain the C:\\Program Files\\Microsoft Office folder.

### Configure the Rule Editor

Now that you've prepared your image, you'll need to configure the Rule Editor and create a file to store your rules in.

1. Go to **Program Files** > **FSLogix** > **Apps** and run **RuleEditor.exe**.

2. Select **File** > **New** > **Create** to make a new rule set, then save that rule set to a local folder.

![](media/55fbdbd900195c65942b3ac359aadd52.png)

3. Select **Blank Rule Set**, then select **OK**.

4. Select the **+** button. This will open the **Add Rule** window.

![A screenshot of a cell phone Description automatically generated](media/8f4af1a16b4ca06514968ee40bbdbda4.png)

![](media/5e82fad0c9ddd79b76e1cdaaebb6de37.png)

This will change the options in the **Add Rule** dialog.

5. From the drop-down menu, select **App Container (VHD) Rule**.

![](media/b16a8f7db974a70c4a0f109420cbf7c5.png)

6. Enter **C:\\Program Files\\Microsoft Office** into the **Folder** field.

7. For the **Disk file** field, select **\<path\>\\office.vhd** from the **Create target VHD** section.

8. Select **OK**.

![](media/998989f1bc4512d1b6786868e2cb93fe.png)

9. Go to the working folder at **C:\\Users\\\<username\>\\Documents\\FSLogix Rule Sets** and look for the .frx and .fxa files. You need to move these files to the Rules folder located at **C:\\Program Files\\FSLogix\\Apps\\Rules** in order for the rules to start working.

>[!NOTE]
> There's currently a known issue in the public preview version of this feature that causes it to stop working after you reset your machine.

## Next steps

If you want to learn more about FSLogix, check out our [FSLogix documentation](/fslogix/).