---
title: Install language packs on Windows 10 VMs in Windows Virtual Desktop - Azure
description: How to install language packs for Windows 10 Multi-session VMs in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/26/2020
ms.author: helohr
manager: lizross
---
# Install language packs on Windows 10 Multi-session VMs

When you set up Windows Virtual Desktop deployments internationally, it's a good idea to make sure your deployment supports multiple languages. You can install language packs on a Windows 10 Multi-session VM image to support as many languages as you need. This article will tell you how to install language packs and how users can change the display language.

Learn more about deploy a VM in Azure at [Create a Windows virtual machine in an availability zone with the Azure portal](/virtual-machines/windows/create-portal-availability-zone).

## install a language pack

- Make sure you are signed in as an Administrator

1. Sign in as an admin.
2. Make sure you've installed all the latest Windows and Windows Store updates.
3. Go to **Settings** > **Time & Language** > **Region**.
4. Under **Country or region**, select your preferred country or region from the drop-down menu.
    In this example, we're going to select **France**, as shown in the following screenshot:

    ![](media/a4420d1da60b751573e20da3d4306bbe.png)

5. After that, select **Language**, then select **Add a language**. Choose the language you want to install from the list, then select **Next**.
6. When the **Install language features** window opens, select the check box labeled **Install language pack and set as my Windows display language**.
7. Select **Install**.

    >[!NOTE]
    >To add multiple languages at once, select **Add a language**, then repeat the process to add a language in steps 5 and 6. Repeat this process for each language you want to install. However, you can only set one language as your display language at a time.

    The following example images show how you would install the French and Dutch language packs, then set French as the display language.

    ![](media/17f8f692abb8a97575243572065a890b.png)

    ![](media/1281d418798528ff7b5f1e5b5aaff7b0.png)

    ![](media/0377fd907747017608b4f822d5ed0e20.png)

8. After your language packs have installed, you should see the names of your language packs appear in the list of languages.

![](media/e1e98f818b103a0961ab529b73558866.png)

![](media/7e4fc0fe551faf296a5ab9c45ccdab1d.png)

1. Depending on how your system is configured, a window may appear that asks you to sign out of your session. Sign out, then sign in again. Your display language should now be the language you selected.

10. Go to **Control Panel** > **Clock and Region** > **Region**.

11. When the **Region** window opens, select the **Administration** tab, then select **Copy settings**.

12. Select the check boxes labeled **Welcome screen and system accounts** and **New user accounts**.
13. Select **OK**.
14. A window will open and tell you to restart your session. Select **Restart now**.

   ![](media/6c20941b9a73579a37a2fbbfbb730a73.png)

   ![](media/652a8ff39875e3aa1845c64259207572.png)

15. After you've signed back in, go back to **Control Panel** > **Clock and Region** > **Region**.

16. Select the **Administration** tab.

17. Select **Change system locale...**

18. In the drop-down menu under *Current system locale**, select your desired locale language. After that, select **OK**.

19. Select **Restart now** to restart your session once again.

![](media/9ed02275a56cbd8e8554c15a5395b5b7.png)

![](media/30b3c16c8d54cf5245bff6a8af5fdd55.png)

You've finished installing your languages! Before you continue, check one more time that you have the latest versions of Windows and Windows store installed.

![](media/f217a4b6c6ba5cbb851594906b2cbaa8.png)

## Sysprep

Next, you need to sysprep your machine.

1. Open PowerShell as an Administrator.
2. Navigate to:
   
    ```powershell
    cd Windows\System32\Sysprep
    ```

3. Next, run the following cmdlet:
    
    ```powershell
    .\sysprep.exe
    ```

    ![](media/87f895d6b911a2c19edc25c91199b8af.png)

4. The System Preparation Tool window will open. Select the check box labelled **Generalize**, then go to Shutdown Options and select **Shut down** from the drop-down menu.

   ![](media/4bf550f4d5bbc27941454ead589dda56.png)

5. If you encoutner a sysprep error, open **File Exploer**, open **Drive C**, then go to **Windows** > **System32 Sysprep** > **Panther**, then open the **setuperr** file.

   ![](media/bb893522cc0d51833a2373949b6a3ff3.png)

   The error will indicate that the specific language package needs to be uninstalled. Copy the language package name to your clipboard.

   ![](media/478e39c07755e30a7ad48a4371bf05ef.png)

   ![](media/7854af0c510c7a65557b76783a67e2b6.png)

6. Open a new PowerShell window and run the following cmdlet to remove the language package that's causing the error:

   ```powershell
   Remove-AppxPackage <package name>
   ```

- After it uninstalls, rerun the same command, as shown below, to ensure it has been removed.

    >[!NOTE]
    >you will know it has been removed successfully if you receive an error when trying to remove it a second time

![](media/2f7899399e83bc5e2b24be927cce67f5.png)

10. After the language pack is removed, run sysprep again.

![](media/4bf550f4d5bbc27941454ead589dda56.png)

>[!NOTE]
>The syprep process will take a few minutes to finish. As the VM shuts down, your remote session will disconnect.

![](media/cd0af89f9fbcd7575f2e5ec19a6c17cc.png)

## Capture the image

Next, you'll need to capture an image of your properly configured machine so that other users can use it in their deployments.

To capture an image:

1. Go to the Azure portal and select the name of the machine you just ran sysprep on.

2. Select **Capture** to start creating an image of the machine, as shown in the following screenshot.

![](media/b5e8a8d3c761a1fbe57b9a2abe4279d1.png)

3. Enter a name for your image and assign it to the resource group of your choosing.

4. Select *Create*.

![](media/f7c76a0278da109f224bc8544029cd76.png)

5. Wait a few minutes for the capture process to finish. When the image is ready, you should see a message in the Notifications Center letting you know the image was captured.

![](media/5b81105c0987de8b3e727958cdc37b87.png)

You can now deploy a VM with your new image. When you deploy your VM, make sure to follow the instructions in [Create a Windows virtual machine in an availability zone with the Azure portal](/virtual-machines/windows/create-portal-availability-zone).

### How to change display language for users

If you're a standard, non-admin user who's running a VM created with an image like the one in the previous section, you can change your display language.

Here's how to change your display language:

1. Go to **Language Settings**. If you don't know where that is, you can enter **Language** into the search bar in your Start Menu.

2. In the Windows display language drop-down menu, select the language you want to use as your display language.

3. Sign out of your session, then sign back in. The display language should now be the one you selected in step 2.
