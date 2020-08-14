---
title: Install language packs on Windows 10 VMs in Windows Virtual Desktop - Azure
description: How to install language packs for Windows 10 multi-session VMs in Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 04/03/2020
ms.author: helohr
manager: lizross
---
# Add language packs to a Windows 10 multi-session image

As a Windows Virtual Desktop host pool can be used by users with different language requirements, it is often necessary to customize the Windows 10 Enterprise multi-session image to support multiple languages.

One option is to build a dedicated host pool per language and use a customized image for each language. Alternatively, to increase efficiency, reduce costs and complexity, customers might prefer to have users with different language and localization requirements in the same host pool.

## Prerequisites

To add additional languages to a Virtual Machine (VM) with Windows 10 Enterprise multi-session the following pre-requisites are required:

- An Azure VM with Windows 10 Enterprise multi-session 1903 or higher

- Language ISO and Feature on Demand (FOD) Disk 1 the OS Version. These can be downloaded using the links below:  [Windows 10, version 1903 and 1909 – Language Pack ISO](https://software-download.microsoft.com/download/pr/18362.1.190318-1202.19h1_release_CLIENTLANGPACKDVD_OEM_MULTI.iso)   [Windows 10, version 2004 – Language Pack ISO](https://software-download.microsoft.com/download/pr/19041.1.191206-1406.vb_release_CLIENTLANGPACKDVD_OEM_MULTI.iso)

- [Windows 10, version 1903 and 1909 – Features on Demand Disk 1 ISO](https://software-download.microsoft.com/download/pr/18362.1.190318-1202.19h1_release_amd64fre_FOD-PACKAGES_OEM_PT1_amd64fre_MULTI.iso)  [Windows 10, version 2004 – Features on Demand Disk 1 ISO](https://software-download.microsoft.com/download/pr/19041.1.191206-1406.vb_release_amd64fre_FOD-PACKAGES_OEM_PT1_amd64fre_MULTI.iso)

- An Azure Files Share or a file share on a Windows File Server Virtual Machine

>[!NOTE]
>The file share (repository) needs to be accessible from the Azure VM that will be used to create the custom image.

## Create a content repository for language packages and features on demand

For optimal performance, perform these steps from a VM in Azure:

1. Download the Windows 10 Multi-Language ISO and Features on Demand (FOD) For Windows 10 Enterprise multi-session, version 1903, 1909 and 2004 images using the links above.

2. Open/mount the ISO files on the VM

3. Copy the content from “LocalExperiencePacks” and “x64\\langpacks” folders from the the language pack ISO to the file share

4. Copy the complete content from the FOD ISO file to the file share

>[!NOTE]
> If storage capacity is limited, it is possible to only copy the files for the languages needed. All files contain the language code e.g. “fr-FR” for French (France) in the file name.   A list of all available languages including language codes can be found [here](/windows-hardware/manufacture/desktop/available-language-packs-for-windows).

>[!IMPORTANT]
> Some languages require additional fonts included in satellite packages that follow a different naming convention e.g. “Jpan” for Japanese fonts.  

![](media/414827cdf7b695a7ee210d9bcd852100.png)

1. Make sure to set the permissions on the language content repository share so that you have read access from your VM that is used to build the custom image.

## Create a custom Windows 10 Enterprise multi-session image

1. Deploy an Azure Virtual Machine and select from the Azure Gallery Windows 10 Enterprise multi-session e.g. build 1903, 1909 or 2004.

2. After successful deployment, connect to the VM via RDP as a local administrator and confirm all Windows Updates are installed. Restart if required.

3. Connect to the language package and feature on demand file share repository and mount it with a drive letter e.g. E:

4. An automated installation for a set of languages can be done via PowerShell. This script sample below can be used to install Spanish (Spain), French (France) and Chinese (China) language packs and satellite packages on Windows 10 Enterprise multi-session, version 2004. It can be adjusted as required for other languages. It must be run from an elevated PowerShell session.

```powershell
########################################################
## Add Languages to running Windows Image for Capture##
########################################################

##Disable Language Pack Cleanup##
Disable-ScheduledTask -TaskPath "\Microsoft\Windows\AppxDeploymentClient\" -TaskName "Pre-staged app cleanup"

##Set Language Pack Content Stores##
[string]$LIPContent = "E:"

##Spanish##
Add-AppProvisionedPackage -Online -PackagePath $LIPContent\es-es\LanguageExperiencePack.es-es.Neutral.appx -LicensePath $LIPContent\es-es\License.xml
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Client-Language-Pack_x64_es-es.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Basic-es-es-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Handwriting-es-es-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-OCR-es-es-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Speech-es-es-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-TextToSpeech-es-es-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-NetFx3-OnDemand-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-InternetExplorer-Optional-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-MSPaint-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Notepad-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-PowerShell-ISE-FOD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Printing-WFS-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-StepsRecorder-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-WordPad-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("es-es")
Set-WinUserLanguageList $LanguageList -force

##French##
Add-AppProvisionedPackage -Online -PackagePath $LIPContent\fr-fr\LanguageExperiencePack.fr-fr.Neutral.appx -LicensePath $LIPContent\fr-fr\License.xml
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Client-Language-Pack_x64_fr-fr.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Basic-fr-fr-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Handwriting-fr-fr-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-OCR-fr-fr-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Speech-fr-fr-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-TextToSpeech-fr-fr-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-NetFx3-OnDemand-Package~31bf3856ad364e35~amd64~fr-fr~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-InternetExplorer-Optional-Package~31bf3856ad364e35~amd64~fr-FR~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-MSPaint-FoD-Package~31bf3856ad364e35~amd64~fr-FR~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Notepad-FoD-Package~31bf3856ad364e35~amd64~fr-FR~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-PowerShell-ISE-FOD-Package~31bf3856ad364e35~amd64~fr-FR~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Printing-WFS-FoD-Package~31bf3856ad364e35~amd64~fr-FR~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-StepsRecorder-Package~31bf3856ad364e35~amd64~fr-FR~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-WordPad-FoD-Package~31bf3856ad364e35~amd64~fr-FR~.cab
$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("fr-fr")
Set-WinUserLanguageList $LanguageList -force

##Chinese(PRC)##
Add-AppProvisionedPackage -Online -PackagePath $LIPContent\zh-cn\LanguageExperiencePack.zh-cn.Neutral.appx -LicensePath $LIPContent\zh-cn\License.xml
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Client-Language-Pack_x64_zh-cn.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Basic-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Fonts-Hans-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Handwriting-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-OCR-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Speech-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-TextToSpeech-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-NetFx3-OnDemand-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-InternetExplorer-Optional-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-MSPaint-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Notepad-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-PowerShell-ISE-FOD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Printing-WFS-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-StepsRecorder-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-WordPad-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("zh-cn")
Set-WinUserLanguageList $LanguageList -force
```

>[!IMPORTANT]
>Windows 10 Enterprise 1903 and 1909 don’t require the package “Microsoft-Windows-Client-Language-Pack_x64_\<language-code\>.cab“

- The script integrates the language interface pack and all necessary satellite packages into the image

- To install additional or less languages, you can copy/delete and adjust this script sample as required

- The integration of the languages might take a while, depending on the amount of languages.

- Verify if the languages are installed as desired by opening the settings app at **Start** > **Settings** > **Time & Language** > **Language**.

- When done, disconnect the share

After the language installation, you can install any additional software you would like to integrate into the customized image.

To finalize the image customization, you need to run the system preparation tool (Sysprep)

1. Open an elevated command prompt and execute Sysprep to generalize the image  C:\\Windows\\System32\\Sysprep\\sysprep.exe /oobe /generalize /shutdown

2. After the VM has been shut down, capture it to an managed image [Create a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md)

3. The customized image can now be used to deploy a WVD host pool. See [Tutorial: Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md)

## Enable languages in Windows settings app

To ensure that your users can select their preferred language from the Windows Settings app, it is required to add the languages to the language list for each user.

After the host pool is deployed, it is necessary to run this PowerShell command in the context of the logged-on user to add the integrated language packs to the selection. This can be achieved by e.g. a scheduled task at logon or a user logon script.

```powershell
$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("es-es")
$LanguageList.Add("fr-fr")
$LanguageList.Add("zh-cn")
Set-WinUserLanguageList $LanguageList -force
```

>[!NOTE]
>After a user changes the preferred display language, it is required to logoff from the Windows Virtual Desktop session and logon again. For additional known issues please visit [this](/windows-hardware/manufacture/desktop/language-packs-known-issue) link.







-------------------------------------------------------------------------


When you set up Windows Virtual Desktop deployments internationally, it's a good idea to make sure your deployment supports multiple languages. You can install language packs on a Windows 10 Enterprise multi-session virtual machine (VM) image to support as many languages as your organization needs. This article will tell you how to install language packs and capture images that let your users choose their own display languages.

Learn more about how to deploy a VM in Azure at [Create a Windows virtual machine in an availability zone with the Azure portal](../virtual-machines/windows/create-portal-availability-zone.md).

>[!NOTE]
>This article applies to Windows 10 Enterprise multi-session VMs.

## Install a language pack

To create a VM image with language packs, you first need to install language packs onto a machine and capture an image of it.

To install language packs:

1. Sign in as an admin.
2. Make sure you've installed all the latest Windows and Windows Store updates.
3. Go to **Settings** > **Time & Language** > **Region**.
4. Under **Country or region**, select your preferred country or region from the drop-down menu.
    In this example, we're going to select **France**, as shown in the following screenshot:

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Region page. The region currently selected is France.](media/region-page-france.png)

5. After that, select **Language**, then select **Add a language**. Choose the language you want to install from the list, then select **Next**.
6. When the **Install language features** window opens, select the check box labeled **Install language pack and set as my Windows display language**.
7. Select **Install**.
8. To add multiple languages at once, select **Add a language**, then repeat the process to add a language in steps 5 and 6. Repeat this process for each language you want to install. However, you can only set one language as your display language at a time.

    Let's run through a quick visual demonstration. The following images show how to install the French and Dutch language packs, then set French as the display language.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Language page at the beginning of the process. The selected Windows display language is English.](media/language-page-default.png)

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the language selection window. The user has entered "french" into the search bar to find the French language packages.](media/select-language-french.png)

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Install language features page. French is selected as the preferred language. The options selected are "Set my display language," "Install language pack," "Speech recognition," and "Handwriting."](media/install-language-features.png)

    After your language packs have installed, you should see the names of your language packs appear in the list of languages.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the language page with the new language packs installed. The French and Netherlands language packs are listed under "preferred languages."](media/language-page-complete.png)

9. If a window appears asking you to sign out of your session. Sign out, then sign in again. Your display language should now be the language you selected.

10.  Go to **Control Panel** > **Clock and Region** > **Region**.

11.  When the **Region** window opens, select the **Administration** tab, then select **Copy settings**.

12.  Select the check boxes labeled **Welcome screen and system accounts** and **New user accounts**.

13.  Select **OK**.

14.  A window will open and tell you to restart your session. Select **Restart now**.

15.  After you've signed back in, go back to **Control Panel** > **Clock and Region** > **Region**.

16.  Select the **Administration** tab.

17.  Select **Change system locale**.

18. In the drop-down menu under **Current system locale**, select the locale language you want to use. After that, select **OK**.

19. Select **Restart now** to restart your session once again.

Congratulations, you've installed your language packs!

Before you continue, make sure your system has the latest versions of Windows and Windows store installed.

## Sysprep

Next, you need to sysprep your machine to prepare it for the image capturing process.

To sysprep your machine:

1. Open PowerShell as an Administrator.
2. Run the following cmdlet to go to the correct directory:

    ```powershell
    cd Windows\System32\Sysprep
    ```

3. Next, run the following cmdlet:

    ```powershell
    .\sysprep.exe
    ```

4. When the System Preparation Tool window opens, select the check box labeled **Generalize**, then go to **Shutdown Options** and select **Shut down** from the drop-down menu.

>[!NOTE]
>The syprep process will take a few minutes to finish. As the VM shuts down, your remote session will disconnect.

### Resolve sysprep errors

If you see an error message during the sysprep process, here's what you should do:

1. Open **Drive C** and go to **Windows** > **System32 Sysprep** > **Panther**, then open the **setuperr** file.

   The text in the error file will tell you that you need to uninstall a specific language package, as shown in the following image. Copy the language package name for the next step.

   > [!div class="mx-imgBorder"]
   > ![A screenshot of the setuperr file. The text with the package name is highlighted in dark blue.](media/setuperr-package-name.png)

2. Open a new PowerShell window and run the following cmdlet with the package name you copied in step 2 to remove the language package:

   ```powershell
   Remove-AppxPackage <package name>
   ```

3. Check to make sure you've removed the package by running the `Remove-AppxPackage` cmdlet again. If you've successfully removed the package, you should see a message that says the package you're trying to remove isn't there.

4. Run the `sysprep.exe` cmdlet again.

## Capture the image

Now that your system is ready, you can capture an image so that other users can start using VMs based on your system without having to repeat the configuration process.

To capture an image:

1. Go to the Azure portal and select the name of the machine you configured in [Install a language pack](#install-a-language-pack) and [sysprep](#sysprep).

2. Select **Capture**.

3. Enter a name for your image into the **Name** field and assign it to the resource group using the **Resource group** drop-down menu, as shown in the following image.

   > [!div class="mx-imgBorder"]
   > ![A screenshot of the Create image window. The name the user has given to this test image is "vmwvd-image-fr," and they've assigned it to the "testwvdimagerg" resource group.](media/create-image.png)

4. Select **Create**.

5. Wait a few minutes for the capture process to finish. When the image is ready, you should see a message in the Notifications Center letting you know the image was captured.

You can now deploy a VM using your new image. When you deploy the VM, make sure to follow the instructions in [Create a Windows virtual machine in an availability zone with the Azure portal](../virtual-machines/windows/create-portal-availability-zone.md).

### How to change display language for standard users

Standard users can change the display language on their VMs.

To change the display language:

1. Go to **Language Settings**. If you don't know where that is, you can enter **Language** into the search bar in the Start Menu.

2. In the Windows display language drop-down menu, select the language you want to use as your display language.

3. Sign out of your session, then sign back in. The display language should now be the one you selected in step 2.
