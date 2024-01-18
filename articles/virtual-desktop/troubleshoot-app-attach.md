---
title: Troubleshoot app attach - Azure Virtual Desktop
description: Learn how to troubleshoot app attach in Azure Virtual Desktop, where you can dynamically attach applications from an application package to a user session.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 08/17/2023
ms.author: daknappe
---

# Troubleshoot app attach in Azure Virtual Desktop

> [!IMPORTANT]
> App attach in Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If you're having issues when using app attach, use the information in this article to help troubleshoot.

## Check file share access

To validate that your session hosts have the necessary access to a file share containing your MSIX images, you can use PsExec.

1. Download and install [PsExec](/sysinternals/downloads/psexec) from Microsoft Sysinternals on a session host in your host pool.

1. Open PowerShell as an administrator and run the following command, which will start a new PowerShell session as the system account:

    ```powershell
    PsExec.exe -s -i powershell.exe
    ```

1. Verify that the context of the PowerShell session is the system account by running the following command:

    ```powershell
    whoami
    ```

   The output should be the following:

   ```output
   nt authority\system
   ``````

1. Mount an MSIX image from the file share manually by using one of the following examples, changing the UNC paths to your own values.

   - To mount an MSIX image in `.vhdx` format, run the following command:

      ```powershell
      Mount-DiskImage -ImagePath \\fileshare\msix\MyApp.vhdx
      ```

   - To mount an MSIX image in `.cim` format, run the following commands. The [CimDiskImage PowerShell module from the PowerShell Gallery](https://www.powershellgallery.com/packages/CimDiskImage) will be installed, if it's not already.

      ```powershell
      # Install the CimDiskImage PowerShell module, if it's not already installed.
      If (!(Get-Module -ListAvailable | ? Name -eq CimDiskImage)) {
          Install-Module CimDiskImage -WhatIf
      }
      
      # Import the CimDiskImage PowerShell module.
      Import-Module CimDiskImage

      # Mount the MSIX image
      Mount-CimDiskImage -ImagePath \\fileshare\msix\MyApp.cim -DriveLetter Z:
      ```

   If the MSIX image mounts successfully, your session hosts have the correct necessary access to the file share containing your MSIX images.

1. Dismount the MSIX image by using one of the following examples.

   - To dismount an MSIX image in `.vhdx` format, run the following command:

      ```powershell
      Dismount-DiskImage -ImagePath \\fileshare\msix\MyApp.vhdx
      ```

   - To dismount an MSIX image in `.cim` format, run the following commands:

      ```powershell
      Get-CimDiskImage | Dismount-CimDiskImage
      ```

## Next steps

[Test MSIX packages with MSIX app attach or app attach](app-attach-test-msix-packages.md).
