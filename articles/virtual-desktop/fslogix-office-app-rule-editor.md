---
title: Install Microsoft Office FSLogix application containers in Azure Virtual Desktop - Azure
description: How to use the app rule editor to create an FSLogix application container with Office in Azure Virtual Desktop.
author: Heidilohr
ms.topic: conceptual
ms.date: 02/23/2021
ms.author: helohr
manager: femila
---
# Install Microsoft Office using FSLogix application containers

You can install Microsoft Office quickly and efficiently by using an FSLogix application container as a template for the other virtual machines (VMs) in your host pool.

Here's why using an FSLogix app container can help make installation faster:

- Offloading your Office apps to an app container reduces the requirements for your C drive size.
- Snapshots or backups of your VM takes less resources.
- Having an automated pipeline through updating a single image makes updating your VMs easier.
- You only need one image to install Office (and other apps) onto all the VMs in your Azure Virtual Desktop deployment.

This article will show you how to set up an FSLogix application container with Office.

## Requirements

You'll need the following things to set up the rule editor:

- a VM running Windows without Office installed
- a copy of Office
- a copy of FSLogix installed on your deployment
- a network share that all VMs in your host pool have read-only access to

## Install Office

To install Office on your VHD or VHDX, enable the Remote Desktop Protocol in your VM, then follow the instructions in [Install Office on a VHD master image](install-office-on-wvd-master-image.md). When installing, make sure you're using [the correct licenses](overview.md#requirements).

>[!NOTE]
>Azure Virtual Desktop requires Share Computer Activation (SCA).

## Install FSLogix

To install FSLogix and the Rule Editor, follow the instructions in [Download and install FSLogix](/fslogix/install-ht).

## Create and prepare a VHD to store Office

Next, you'll need to create and prepare a VHD image to use the Rule Editor on:

1. Open a command prompt as an administrator. and run the following command:

    ```cmd
 	    taskkill /F /IM MicrosoftEdge.exe /T
    ```

    >[!NOTE]
    > Make sure to keep the blank spaces you see in this command.

2. Next, run the following command:

    ```cmd
    sc queryex type=service state=all | find /i "ClickToRunSvc"
    ```
    
   If you find the service, restart the VM before continuing with step 3.

    ```cmd
    net stop ClickToRunSvc
    ```

3. After that, go to **Program Files** > **FSLogix** > **Apps** and run the following command to create the target VHD:

    ```cmd
    frx moveto-vhd -filename <path to network share>\office.vhdx -src "C:\Program Files\Microsoft Office" -size-mbs 5000 
    ```

    The VHD you create with this command should contain the C:\\Program Files\\Microsoft Office folder.

    >[!NOTE]
    >If you see any errors, uninstall Office and start over from step 1.

## Configure the Rule Editor

Now that you've prepared your image, you'll need to configure the Rule Editor and create a file to store your rules in.

1. Go to **Program Files** > **FSLogix** > **Apps** and run **RuleEditor.exe**.

2. Select **File** > **New** > **Create** to make a new rule set, then save that rule set to a local folder.

3. Select **Blank Rule Set**, then select **OK**.

4. Select the **+** button. This will open the **Add Rule** window. This will change the options in the **Add Rule** dialog.

5. From the drop-down menu, select **App Container (VHD) Rule**.

6. Enter **C:\\Program Files\\Microsoft Office** into the **Folder** field.

7. For the **Disk file** field, select **\<path\>\\office.vhd** from the **Create target VHD** section.

8. Select **OK**.

9. Go to the working folder at **C:\\Users\\\<username\>\\Documents\\FSLogix Rule Sets** and look for the .frx and .fxa files. You need to move these files to the Rules folder located at **C:\\Program Files\\FSLogix\\Apps\\Rules** in order for the rules to start working.

10. Select **Apply Rules to System** for the rules to take effect.

     >[!NOTE]
     > You'll need to apply the app rule files will need to all session hosts.

## Next steps

If you want to learn more about FSLogix, check out our [FSLogix documentation](/fslogix/).