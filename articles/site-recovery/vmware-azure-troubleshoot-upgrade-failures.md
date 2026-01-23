---
title: Troubleshoot Upgrade of the Azure Site Recovery Provider 
description: Resolve common issues that occur when you upgrade the Azure Site Recovery Provider.
ms.service: azure-site-recovery
ms.topic: troubleshooting
ms.date: 12/09/2025
author: Jeronika-MS
ms.author: v-gajeronika 
# Customer intent: "As an IT administrator troubleshooting upgrade issues, I want to identify and resolve common errors during the Azure Site Recovery Provider upgrade so that I can ensure successful installation and maintain backup and disaster recovery capabilities."
---

# Troubleshoot Azure Site Recovery Provider upgrade failures

This article helps you resolve issues that can cause failures during an Azure Site Recovery Provider upgrade.

## The upgrade fails and reports that the latest Site Recovery Provider is already installed

When you upgrade the Azure Site Recovery Provider (for disaster recovery architecture), the Unified Setup upgrade fails and issues the following message:

"Upgrade isn't supported as a higher version of the software is already installed."

To upgrade, follow these steps:

1. Download Azure Site Recovery Unified Setup:
   1. In the "Links to currently supported update rollups" section of the [Service updates in Azure Site Recovery](/azure/site-recovery/service-updates-how-to#updates-support) article, select the provider to which you're upgrading.
   1. On the rollup page, locate the "Update information" section and download the Update Rollup for Azure Site Recovery Unified Setup.

1. Open a command prompt and go to the folder to which you downloaded the Unified Setup file. Extract the setup files from the download by using the following command: `MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:&lt;folder path for the extracted files&gt;`.
	
	Example command:

	`MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:C:\Temp\Extracted`

1. In the command prompt, go to the folder to which you extracted the files and run the following installation commands:
   
	`CX_THIRDPARTY_SETUP.EXE /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
	UCX_SERVER_SETUP.EXE /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /UPGRADE`

1. Return to the folder to which you downloaded the Unified Setup file and run `MicrosoftAzureSiteRecoveryUnifiedSetup.exe` to finish the upgrade.

## Upgrade failure because of the non-Microsoft folder being renamed

For the upgrade to succeed, the non-Microsoft folder must not be renamed.

To resolve the issue:

1. Start the Registry Editor (`regedit.exe`) and open the `HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\InMage Systems\Installed Products\10` branch.
1. Inspect the `Build_Version` key value. If the value is set to the latest version, reduce the version number. For example, if the latest version is 9.22.\* and the `Build_Version` key is set to that value, reduce it to 9.21.\*.
1. Download the latest Azure Site Recovery Unified Setup file:
   1. In the "Links to currently supported update rollups" section of the [Service updates in Azure Site Recovery](/azure/site-recovery/service-updates-how-to#updates-support) article, select the provider to which you're upgrading.
   1. On the rollup page, locate the "Update information" section and download the Update Rollup for Azure Site Recovery Unified Setup.
1. Open a command prompt and go to the folder to which you downloaded the Unified Setup file. Extract the setup files from the download by using the following command: `MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:&lt;folder path for the extracted files&gt;`.

	Example command:

	`MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:C:\Temp\Extracted`

1. In the command prompt, go to the folder to which you extracted the files and run the following installation command:
   
	`CX_THIRDPARTY_SETUP.EXE /VERYSILENT /SUPPRESSMSGBOXES /NORESTART`

1. Use Task Manager to monitor the progress of the installation. When the process for `CX_THIRDPARTY_SETUP.EXE` is no longer visible in Task Manager, proceed to the next step.
1. Verify that `C:\thirdparty` exists and that the folder contains the round-robin database (RRD) libraries.
1. Return to the folder to which you downloaded the Unified Setup file and run `MicrosoftAzureSiteRecoveryUnifiedSetup.exe` to finish the upgrade.

## Upgrade failure because of master target installation failure

When you upgrade the Azure Site Recovery Provider (for disaster recovery architecture), the master target installation fails with the following error: "Installation location does not exist and/or it does not have 1 GB free space and/or it does not exist on a fixed drive."

This error could occur because of the null value for a parameter in the registry key. To resolve the issue:

1. Start the Registry Editor (`regedit.exe`) and open the `HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\InMage Systems\Installed Products\4` branch.
1. Inspect the `InstallDirectory` key value. If the value is null, add the current install directory value.
1. Similarly, open the `HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\InMage Systems\Installed Products\5` branch in the Registry Editor.
1. Inspect the `InstallDirectory` key value and add the current install directory value.
1. Rerun the Unified Setup installer.
