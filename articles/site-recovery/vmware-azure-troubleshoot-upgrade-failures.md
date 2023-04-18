---
title: Troubleshoot upgrade of the Microsoft Azure Site Recovery Provider 
description: Resolve common issues that occur when upgrading the Microsoft Azure Site Recovery provider.
ms.service: site-recovery
ms.topic: troubleshooting
ms.date: 11/10/2019
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Troubleshoot Microsoft Azure Site Recovery Provider upgrade failures

This article helps you resolve issues that can cause failures during a Microsoft Azure Site Recovery Provider upgrade.

## The upgrade fails reporting that the latest Site Recovery Provider is already installed

When upgrading Microsoft Azure Site Recovery Provider (DRA), the Unified Setup upgrade fails and issues the error message:

Upgrade is not supported as a higher version of the software is already installed.

To upgrade, use the following steps:

1. Download the Microsoft Azure Site Recovery Unified Setup:
   1. In the "Links to currently supported update rollups" section of the [Service updates in Azure Site Recovery](service-updates-how-to.md#links-to-currently-supported-update-rollups) article, select the provider to which you are upgrading.
   2. On the rollup page, locate the **Update information** section and download the Update Rollup for Microsoft Azure Site Recovery Unified Setup.

2. Open a command prompt and navigate to the folder to which you downloaded Unified Setup file. Extract the setup files from the download using the following command, MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:&lt;folder path for the extracted files&gt;.
	
	Example command:

	MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:C:\Temp\Extracted

3. In the command prompt, navigate to the folder to which you extracted the files and run the following installation commands:
   
	CX_THIRDPARTY_SETUP.EXE /VERYSILENT /SUPPRESSMSGBOXES /NORESTART
	UCX_SERVER_SETUP.EXE /VERYSILENT /SUPPRESSMSGBOXES /NORESTART /UPGRADE

1. Return to the folder to which you downloaded the Unified Setup and run MicrosoftAzureSiteRecoveryUnifiedSetup.exe to finish the upgrade. 

## Upgrade failure due to the 3rd-party folder being renamed

For the upgrade to succeed, the 3rd-party folder must not be renamed.

To resolve the issue.

1. Start the Registry Editor (regedit.exe) and open the HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\InMage Systems\Installed Products\10 branch.
1. Inspect the `Build_Version` key value. If it is set to the latest version, reduce version number. For example, if latest version is 9.22.\* and the `Build_Version` key set to that value, then reduce it to 9.21.\*.
1. Download the latest Microsoft Azure Site Recovery Unified Setup:
   1. In the "Links to currently supported update rollups" section of the [Service updates in Azure Site Recovery](service-updates-how-to.md#links-to-currently-supported-update-rollups) article, select the provider to which you are upgrading.
   2. On the rollup page, locate the **Update information** section and download the Update Rollup for Microsoft Azure Site Recovery Unified Setup.
1. Open a command prompt and navigate to the folder to which you downloaded Unified Setup file and the extract the setup files from the download using the following command, MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:&lt;folder path for the extracted files&gt;.

	Example command:

	MicrosoftAzureSiteRecoveryUnifiedSetup.exe /q /x:C:\Temp\Extracted

1. In the command prompt, navigate to the folder to which you extracted the files and run the following installation commands:
   
	CX_THIRDPARTY_SETUP.EXE /VERYSILENT /SUPPRESSMSGBOXES /NORESTART

1. Use task manager to monitor the progress of the installation. When the process for CX_THIRDPARTY_SETUP.EXE is no longer visible in task manager, proceed to the next step.
1. Verify that C:\thirdparty exists and that the folder contains the RRD libraries.
1. Return to the folder to which you downloaded the Unified Setup and run MicrosoftAzureSiteRecoveryUnifiedSetup.exe to finish the upgrade.

## Upgrade failure due to Master Target installation failure

When upgrading Microsoft Azure Site Recovery Provider (DRA), the Master Target installation fails with the error 'Installation location does not exist and/or it does not have 1 GB free space and/or it does not exist on a fixed drive.'.

This could be due to null value for a parameter in the Registry Key. To resolve the issue -

1. Start the Registry Editor (regedit.exe) and open the HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\InMage Systems\Installed Products\4 branch.
1. Inspect the 'InstallDirectory' key value. If it is null, then add the current install directory value.
1. Similarly, open the HKEY_LOCAL_MACHINE\SOFTWARE\Wow6432Node\InMage Systems\Installed Products\5 branch in Registry Editor.
1. Inspect the 'InstallDirectory' key value and add the current install directory value.
1. Re-run the Unified Setup installer.
