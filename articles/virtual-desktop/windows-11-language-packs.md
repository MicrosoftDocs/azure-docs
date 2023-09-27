---
title: Install language packs on Windows 11 Enterprise VMs in Azure Virtual Desktop - Azure
description: How to install language packs for Windows 11 Enterprise VMs in Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 08/23/2022
ms.author: helohr
manager: femila
---
# Add languages to a Windows 11 Enterprise image

It's important to make sure users within your organization from all over the world can use your Azure Virtual Desktop deployment. That's why you can customize the Windows 11 Enterprise image you use for your virtual machines (VMs) to have different language packs. Starting with Windows 11, non-administrator user accounts can now add both the display language and its corresponding language features. This feature means you won't need to pre-install language packs for users in a personal host pool. For pooled host pools, we still recommend you add the languages you plan to add to a custom image. You can use the instructions in this article for both single-session and multi-session versions of Windows 11 Enterprise.

When your organization includes users with multiple different languages, you have two options:

- Create one dedicated host pool with a customized image per language.
- Have multiple users with different languages in the same host pool.

The second option is more efficient in terms of resources and cost, but requires a few extra steps. Fortunately, this article will help walk you through how to build an image that can accommodate users of all languages and localization needs.

## Requirements

Before you can add languages to a Windows 11 Enterprise VM, you'll need to have the following things ready:

- An Azure VM with Windows 11 Enterprise installed
- A Language and Optional Features ISO and Inbox Apps ISO of the OS version the image uses. You can download them here:
  - Language and Optional Features ISO:
    - [Windows 11, version 21H2 Language and Optional Features ISO](https://software-download.microsoft.com/download/sg/22000.1.210604-1628.co_release_amd64fre_CLIENT_LOF_PACKAGES_OEM.iso)
    - [Windows 11, version 22H2 Language and Optional Features ISO](https://software-static.download.prss.microsoft.com/dbazure/988969d5-f34g-4e03-ac9d-1f9786c66749/22621.1.220506-1250.ni_release_amd64fre_CLIENT_LOF_PACKAGES_OEM.iso)
  - Inbox Apps ISO:
    - [Windows 11, version 21H2 Inbox Apps ISO](https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/22000.2003.230512-1746.co_release_svc_prod3_amd64fre_InboxApps.iso)
    - [Windows 11, version 22H2 Inbox Apps ISO](https://software-static.download.prss.microsoft.com/dbazure/888969d5-f34g-4e03-ac9d-1f9786c66749/22621.1778.230511-2102.ni_release_svc_prod3_amd64fre_InboxApps.iso)
- An Azure Files share or a file share on a Windows File Server VM

>[!NOTE]
>The file share repository must be accessible from the Azure VM that you're going to use to create the custom image.

## Create a content repository for language packages and features on demand

To create the content repository you'll use to add languages and features to your VM:

1. Open the VM you want to add languages to in Azure.

2. Open and mount the ISO file you downloaded in the [Requirements](#requirements) section above on the VM.

3. Create a folder on the file share.

4. Copy all content from the **LanguagesAndOptionalFeatures** folder in the ISO to the folder you created.

     >[!NOTE]
     > If you're working with limited storage, you can use the mounted "Languages and Optional Features" ISO as a repository. To learn how to create a repository, see [Build a custom FOD and language pack repository](/windows-hardware/manufacture/desktop/languages-overview#build-a-custom-fod-and-language-pack-repository).

     >[!IMPORTANT]
     > Some languages require additional fonts included in satellite packages that follow different naming conventions. For example, Japanese font file names include "Jpan."
     >
     > [!div class="mx-imgBorder"]
     > ![An example of the Japanese language packs with the "Jpan" language tag in their file names.](media/language-pack-example.png)

5. Set the permissions on the language content repository share so that you have read access from the VM you'll use to build the custom image.

## Create a custom Windows 11 Enterprise image manually

You can create a custom image by following these steps:

1. Deploy an Azure VM, then go to the Azure Gallery and select the current version of Windows 11 Enterprise you're using.

2. After you've deployed the VM, connect to it using RDP as a local admin.

3. Connect to the file share repository you created in [Create a content repository for language packages and features on demand](#create-a-content-repository-for-language-packages-and-features-on-demand) and mount it to a letter drive (for example, drive E).

4. Run the following PowerShell script from an elevated PowerShell session to install language packs and satellite packages on Windows 11 Enterprise:
   
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
   $LIPContent = "E:"

   ##Set Path of CSV File##
   $CSVFile = "Windows-10-1809-FOD-to-LP-Mapping-Table.csv"
   $filePath = (Get-Location).Path + "\$CSVFile"

   ##Import Necesarry CSV File##
   $FODList = Import-Csv -Path $filePath -Delimiter ";"

   ##Set Language (Target)##
   $targetLanguage = "es-es"

   $sourceLanguage = (($FODList | Where-Object {$_.'Target Lang' -eq $targetLanguage}) | Where-Object {$_.'Source Lang' -ne $targetLanguage} | Select-Object -Property 'Source Lang' -Unique).'Source Lang'
   if(!($sourceLanguage)){
       $sourceLanguage = $targetLanguage
   }

   $langGroup = (($FODList | Where-Object {$_.'Target Lang' -eq $targetLanguage}) | Where-Object {$_.'Lang Group:' -ne ""} | Select-Object -Property 'Lang Group:' -Unique).'Lang Group:'

   ##List of additional features to be installed##
   $additionalFODList = @(
       "$LIPContent\Microsoft-Windows-NetFx3-OnDemand-Package~31bf3856ad364e35~amd64~~.cab", 
       "$LIPContent\Microsoft-Windows-MSPaint-FoD-Package~31bf3856ad364e35~amd64~$sourceLanguage~.cab",
       "$LIPContent\Microsoft-Windows-SnippingTool-FoD-Package~31bf3856ad364e35~amd64~$sourceLanguage~.cab",
       "$LIPContent\Microsoft-Windows-Lip-Language_x64_$sourceLanguage.cab" ##only if applicable##
   )
   
   $additionalCapabilityList = @(
    "Language.Basic~~~$sourceLanguage~0.0.1.0",
    "Language.Handwriting~~~$sourceLanguage~0.0.1.0",
    "Language.OCR~~~$sourceLanguage~0.0.1.0",
    "Language.Speech~~~$sourceLanguage~0.0.1.0",
    "Language.TextToSpeech~~~$sourceLanguage~0.0.1.0"
    )

    ##Install all FODs or fonts from the CSV file###
    Dism /Online /Add-Package /PackagePath:$LIPContent\Microsoft-Windows-Client-Language-Pack_x64_$sourceLanguage.cab
    Dism /Online /Add-Package /PackagePath:$LIPContent\Microsoft-Windows-Lip-Language-Pack_x64_$sourceLanguage.cab
    foreach($capability in $additionalCapabilityList){
       Dism /Online /Add-Capability /CapabilityName:$capability /Source:$LIPContent
    }

    foreach($feature in $additionalFODList){
    Dism /Online /Add-Package /PackagePath:$feature
    }

    if($langGroup){
    Dism /Online /Add-Capability /CapabilityName:Language.Fonts.$langGroup~~~und-$langGroup~0.0.1.0 
    }

    ##Add installed language to language list##
    $LanguageList = Get-WinUserLanguageList
    $LanguageList.Add("$targetlanguage")
    Set-WinUserLanguageList $LanguageList -force
    ```

    >[!NOTE]
    >This example script uses the Spanish (es-es) language code. To automatically install the appropriate files for a different language change the *$targetLanguage* parameter to the correct language code. For a list of language codes, see [Available language packs for Windows](/windows-hardware/manufacture/desktop/available-language-packs-for-windows).

    The script might take a while to finish depending on the number of languages you need to install. You can also install additional languages after initial setup by running the script again with a different *$targetLanguage* parameter.

5. To automatically select the appropriate installation files, download and save the [Available Windows 10 1809 Languages and Features on Demand table](https://download.microsoft.com/download/7/6/0/7600F9DC-C296-4CF8-B92A-2D85BAFBD5D2/Windows-10-1809-FOD-to-LP-Mapping-Table.xlsx) as a CSV file, then save it in the same folder as your PowerShell script.

6. Once the script is finished running, check to make sure the language packs installed correctly by going to **Start** > **Settings** > **Time & Language** > **Language**. If the language files are there, you're all set.

7. Finally, if the VM is connected to the Internet while installing languages, you'll need to run a cleanup process to remove any unnecessary language experience packs. To clean up the files, run these commands:

    ```powershell
    ##Cleanup to prepare sysprep##
    Remove-AppxPackage -Package Microsoft.LanguageExperiencePackes-ES_22000.8.13.0_neutral__8wekyb3d8bbwe

    Remove-AppxPackage -Package Microsoft.OneDriveSync_22000.8.13.0_neutral__8wekyb3d8bbwe
    ```

    To clean up different language packs, replace "es-ES" with a different language code.

8. Once you're done with cleanup, disconnect the share. 

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

4. You can now use the customized image to deploy an Azure Virtual Desktop host pool. To learn how to deploy a host pool, see [Tutorial: Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).

>[!NOTE]
>When a user changes their display language, they'll need to sign out of their Azure Virtual Desktop session, then sign back in. They must sign out from the Start menu.

## Next steps

Learn how to install language packages for Windows 10 multi-session VMs at [Add language packs to a Windows 10 multi-session image](language-packs.md).

For a list of known issues, see [Adding languages in Windows 10: Known issues](/windows-hardware/manufacture/desktop/language-packs-known-issue).
