---
title: Install language packs on Windows 11 Enterprise VMs in Azure Virtual Desktop - Azure
description: How to install language packs for Windows 11 Enterprise VMs in Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 10/05/2021
ms.author: helohr
manager: femila
---
# Add languages to a Windows 11 Enterprise image

It's important to make sure users within your organization from all over the world can use your Azure Virtual Desktop deployment. That's why you can customize the Windows 11 Enterprise image you use for your virtual machines (VMs) to have different language packs. You can use the instructions in this article for both single-session and multi-session versions of Windows 11 Enterprise.

When your organization includes users with multiple different languages, you have two options:

- Create one dedicated host pool with a customized image per language.
- Have multiple users with different languages in the same host pool.

The second option is more efficient in terms of resources and cost. However, it can be tricky to pull off without help. Fortunately, this article will help walk you through how to build an image that can accommodate users of all languages and localization needs.

## Requirements

Before you can add languages to a Windows 11 Enterprise VM, you'll need to have the following things ready:

-   An Azure VM with Windows 11 Enterprise installed
-   A Language and Feature on Demand (FOD) ISO. You can download the iso at  [Windows 11 Language and FOD ISO](https://software-download.microsoft.com/download/sg/22000.1.210604-1628.co_release_amd64fre_CLIENT_LOF_PACKAGES_OEM.iso)
-   An Azure Files share or a file share on a Windows File Server VM

>[!NOTE]
>The file share repository must be accessible from the Azure VM that you're going to use to create the custom image.

## Create a content repository for language packages and features on demand

To create the content repository you'll use to add languages and features to your VM:

1. Open the VM you want to add languages to in Azure.

2. Open and mount the ISO file you downloaded in [Requirements](#requirements) on the VM.

3. Create a folder on the file share.

4. Copy the content from the **LanguagesAndOptionalFeatures** folder in ISO to the folder you created.

     >[!NOTE]
     > If you're working with limited storage, only copy the files for the languages you know your users need. You can tell the files apart by looking at the language codes in their file names. For example, the French file has the code "fr-FR" in its name. For a complete list of language codes for all available languages, see [Available language packs for Windows](/windows-hardware/manufacture/desktop/available-language-packs-for-windows).

     >[!IMPORTANT]
     > Some languages require additional fonts included in satellite packages that follow different naming conventions. For example, Japanese font file names include “Jpan."
     >
     > [!div class="mx-imgBorder"]
     > ![An example of the Japanese language packs with the "Jpan" language tag in their file names.](media/language-pack-example.png)

5. Set the permissions on the language content repository share so that you have read access from the VM you'll use to build the custom image.

## Create a custom Windows 11 Enterprise image manually

You can create a custom image manually by following these steps:

1. Deploy an Azure VM, then go to the Azure Gallery and select the current version of Windows 11 Enterprise you're using.
2. After you've deployed the VM, connect to it using RDP as a local admin.
3. Make sure your VM has all the latest Windows Updates. Download the updates and restart the VM, if necessary.
4. Connect to the language package, FOD, and Inbox Apps file share repository and mount it to a letter drive (for example, drive E).

## Create a custom Windows 10 Enterprise multi-session image automatically

If you'd rather install languages through an automated process, you can run the following script to install the Spanish (Spain), French (France), and Chinese (PRC) language packs for Windows 11 Enterprise. The script integrates the language interface pack and all necessary satellite packages into the image. However, you can also modify this script to install other languages. Just make sure to run the script from an elevated PowerShell session, or else it won't work.

```powershell
########################################################
## Add Languages to running Windows Image for Capture##
########################################################

##Disable Language Pack Cleanup##
Disable-ScheduledTask -TaskPath "\Microsoft\Windows\AppxDeploymentClient\" -TaskName "Pre-staged app cleanup"
Disable-ScheduledTask -TaskPath "\Microsoft\Windows\MUI\" -TaskName "LPRemove"
Disable-ScheduledTask -TaskPath "\Microsoft\Windows\LanguageComponentsInstaller" -TaskName "Uninstallation"
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Control Panel\International" /v "BlockCleanupOfUnusedPreinstalledLangPacks" /t REG_DWORD /d 1 /f

##Set Language Pack Content Stores##
[string]$LIPContent = "E:"

##Spanish##
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
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Notepad-System-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-PowerShell-ISE-FOD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Printing-WFS-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-SnippingTool-FoD-Package~31bf3856ad364e35~amd64~es-ES~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-StepsRecorder-Package~31bf3856ad364e35~amd64~es-es~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-WordPad-FoD-Package~31bf3856ad364e35~amd64~es-es~.cab
$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("es-es")
Set-WinUserLanguageList $LanguageList -force

##Chinese(PRC)##
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Client-Language-Pack_x64_zh-cn.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Basic-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Fonts-Hans-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Handwriting-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-OCR-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-Speech-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-LanguageFeatures-TextToSpeech-zh-cn-Package~31bf3856ad364e35~amd64~~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\DesktopTargetCompDB_zh-cn.xml.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-NetFx3-OnDemand-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-InternetExplorer-Optional-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-MSPaint-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Notepad-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Notepad-System-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-PowerShell-ISE-FOD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-Printing-WFS-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-SnippingTool-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-StepsRecorder-Package~31bf3856ad364e35~amd64~zh-cn~.cab
Add-WindowsPackage -Online -PackagePath $LIPContent\Microsoft-Windows-WordPad-FoD-Package~31bf3856ad364e35~amd64~zh-cn~.cab

$LanguageList = Get-WinUserLanguageList
$LanguageList.Add("zh-cn")
Set-WinUserLanguageList $LanguageList -force
```

The script might take a while to finish depending on the number of languages you need to install.

To automatically select the appropriate installation files, download and save the [Available Windows 10 1809 Languages and Features on Demand](https://download.microsoft.com/download/7/6/0/7600F9DC-C296-4CF8-B92A-2D85BAFBD5D2/Windows-10-1809-FOD-to-LP-Mapping-Table.xlsx) as a CSV file in the same folder as your PowerShell script.

You can install additional languages after the initial setup by running the script again with a different *\$targetLanguage* variable.

The script might take a while depending on the number of languages you need to install.

Once the script is finished running, check to make sure the language packs installed correctly by going to **Start** > **Settings** > **Time & Language** > **Language**. If the language files are there, you're all set.

After adding additional languages to the Windows image, you also must update the inbox apps to support the added languages. You can do this by refreshing the pre-installed apps with the content from the inbox apps ISO.
To perform this refresh in an environment where the VM doesn't have internet access, use the following PowerShell script template to automate the process and update only installed versions of inbox apps.

```powershell
#########################################
## Update Inbox Apps for Multi Language##
#########################################
##Set Inbox App Package Content Stores##
[string] $AppsContent = "F:\"

##Update installed Inbox Store Apps##
foreach ($App in (Get-AppxProvisionedPackage -Online)) {
	$AppPath = $AppsContent + $App.DisplayName + '_' + $App.PublisherId
	Write-Host "Handling $AppPath"
	$licFile = Get-Item $AppPath*.xml
	if ($licFile.Count) {
		$lic = $true
		$licFilePath = $licFile.FullName
	} else {
		$lic = $false
	}
	$appxFile = Get-Item $AppPath*.appx*
	if ($appxFile.Count) {
		$appxFilePath = $appxFile.FullName
		if ($lic) {
			Add-AppxProvisionedPackage -Online -PackagePath $appxFilePath -LicensePath $licFilePath 
		} else {
			Add-AppxProvisionedPackage -Online -PackagePath $appxFilePath -skiplicense
		}
	}
}

```

>[!IMPORTANT]
>The inbox apps included in the ISO aren't the latest versions of the pre-installed Windows apps. To get the latest version of all apps, you need to update the apps using the Windows Store App and perform an manual search for updates after you've installed the additional languages.

Finally, if the VM is connected to the Internet while installing languages, you'll need to run a cleanup process to remove any unnecessary language experience packs. To clean up the files, run these commands:

```powershell
##Cleanup to prepare sysprep##

Remove-AppxPackage -Package Microsoft.LanguageExperiencePackzh-CN_22000.8.13.0_neutral__8wekyb3d8bbwe

Remove-AppxPackage -Package Microsoft.OneDriveSync_22000.8.13.0_neutral__8wekyb3d8bbwe
```

Once you're done, disconnect the share. 

## Finish customizing your image

After you've installed the language packs, you can install any other software you want to add to your customized image.

Once you're finished customizing your image, you'll need to run the system preparation tool (sysprep).

To run sysprep:

1. Open an elevated command prompt and run the following command to generalize the image:  
   
     ```cmd
     C:\Windows\System32\Sysprep\sysprep.exe /oobe /generalize /shutdown
     ```

2. If you run into any issues, check the **SetupErr.log** file in your C drive at **Windows** > **System32** > **Sysprep** > **Panther**. After that, follow the instructions in [Sysprep fails with Microsoft Store apps](/troubleshoot/windows-client/deployment/sysprep-fails-remove-or-update-store-apps) to troubleshoot your setup.

3. If setup is successful, stop the VM, then capture it in a managed image by following the instructions in [Create a managed image of a generalized VM in Azure](../virtual-machines/windows/capture-image-resource.md).

4. You can now use the customized image to deploy a Azure Virtual Desktop host pool. To learn how to deploy a host pool, see [Tutorial: Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

>[!NOTE]
>When a user changes their display language, they'll need to sign out of their Azure Virtual Desktop session, then sign back in. They must sign out from the Start menu.

## Next steps

Learn how to install language packages for Windows 10 multi-session VMs at [Add language packs to a Windows 10 multi-session image](language-packs.md).

For a list of known issues, see [Adding languages in Windows 10: Known issues](/windows-hardware/manufacture/desktop/language-packs-known-issue).
