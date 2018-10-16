---
title: Microsoft Azure Storage Explorer release notes
description: Release notes for Microsoft Azure Storage Explorer
services: storage
documentationcenter: na
author: cawa
manager: paulyuk
editor: ''
ms.assetid:
ms.service: storage
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/12/2018
ms.author: cawa

---
# Microsoft Azure Storage Explorer release notes

This article contains the release notes for Azure Storage Explorer 1.4.3 release, as well as release notes for previous versions.

[Microsoft Azure Storage Explorer](./vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that enables you to easily work with Azure Storage data on Windows, macOS, and Linux.

## Version 1.4.4
10/15/2018

### Download Azure Storage Explorer 1.4.4
- [Azure Storage Explorer 1.4.4 for Windows](https://go.microsoft.com/fwlink/?LinkId=708343)
- [Azure Storage Explorer 1.4.4 for Mac](https://go.microsoft.com/fwlink/?LinkId=708342)
- [Azure Storage Explorer 1.4.4 for Linux](https://go.microsoft.com/fwlink/?LinkId=722418)

### Hotfixes
* The Azure Resource Management Api Version has been rolled back to unblock Azure US Government users. [#696](https://github.com/Microsoft/AzureStorageExplorer/issues/696)
* Loading spinners are now using CSS animations to reduce the amount of GPU used by Storage Explorer. [#653](https://github.com/Microsoft/AzureStorageExplorer/issues/653)

### New
* External resource attachments, such as for SAS connections and emulators, has been significantly improved. Now you can:
   * Customize the display name of the resource you are attaching. [#31](https://github.com/Microsoft/AzureStorageExplorer/issues/31)
   * Attach to multiple local emulators using different ports. [#193](https://github.com/Microsoft/AzureStorageExplorer/issues/193)
   * Add attached resources to Quick Access. [#392](https://github.com/Microsoft/AzureStorageExplorer/issues/392)
* Storage Explorer now supports Soft Delete. You can:
   * Configure a Soft Delete policy by right-clicking on the Blob Containers node for your Storage account.
   * View soft deleted blobs in the Blob Editor by selecting "Active and deleted blobs" in the dropdown next to the navigation bar.
   * Undelete soft deleted blobs.

### Fixes
* The "Configure CORS Settings" action is no longer available on Premium Storage accounts because Premium Storage accounts do not support CORS. [#142](https://github.com/Microsoft/AzureStorageExplorer/issues/142)
* There is now a Shared Access Signature property for SAS Attached Services. [#184](https://github.com/Microsoft/AzureStorageExplorer/issues/184)
* The "Set Default Access Tier" action is now available For Blob and GPV2 Storage accounts that have been pinned to Quick Access. [#229](https://github.com/Microsoft/AzureStorageExplorer/issues/229)
* Sometimes, Storage Explorer would fail to show Classic Storage accounts. [#323](https://github.com/Microsoft/AzureStorageExplorer/issues/323)

### Known Issues
* When using emulators, such as Azure Storage Emulator or Azurite, you will need to have them listen for connections on their default ports. Otherwise, Storage Explorer will not be able to connect to them.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Previous releases

* [Version 1.4.3](#version-143)
* [Version 1.4.2](#version-142)
* [Version 1.4.1](#version-141)
* [Version 1.3.0](#version-130)
* [Version 1.2.0](#version-120)
* [Version 1.1.0](#version-110)
* [Version 1.0.0](#version-100)
* [Version 0.9.6](#version-096)
* [Version 0.9.5](#version-095)
* [Version 0.9.4 and 0.9.3](#version-094-and-093)
* [Version 0.9.2](#version-092)
* [Version 0.9.1 and 0.9.0](#version-091-and-090)
* [Version 0.8.16](#version-0816)
* [Version 0.8.14](#version-0814)
* [Version 0.8.13](#version-0813)
* [Version 0.8.12 and 0.8.11 and 0.8.10](#version-0812-and-0811-and-0810)
* [Version 0.8.9 and 0.8.8](#version-089-and-088)
* [Version 0.8.7](#version-087)
* [Version 0.8.6](#version-086)
* [Version 0.8.5](#version-085)
* [Version 0.8.4](#version-084)
* [Version 0.8.3](#version-083)
* [Version 0.8.2](#version-082)
* [Version 0.8.0](#version-080)
* [Version 0.7.20160509.0](#version-07201605090)
* [Version 0.7.20160325.0](#version-07201603250)
* [Version 0.7.20160129.1](#version-07201601291)
* [Version 0.7.20160105.0](#version-07201601050)
* [Version 0.7.20151116.0](#version-07201511160)

## Version 1.4.3
10/11/2018

### Hotfixes
* The Azure Resource Management Api Version has been rolled back to unblock Azure US Government users. [#696](https://github.com/Microsoft/AzureStorageExplorer/issues/696)
* Loading spinners are now using CSS animations to reduce the amount of GPU used by Storage Explorer. [#653](https://github.com/Microsoft/AzureStorageExplorer/issues/653)

### New
* External resource attachments, such as for SAS connections and emulators, has been significantly improved. Now you can:
   * Customize the display name of the resource you are attaching. [#31](https://github.com/Microsoft/AzureStorageExplorer/issues/31)
   * Attach to multiple local emulators using different ports. [#193](https://github.com/Microsoft/AzureStorageExplorer/issues/193)
   * Add attached resources to Quick Access. [#392](https://github.com/Microsoft/AzureStorageExplorer/issues/392)
* Storage Explorer now supports Soft Delete. You can:
   * Configure a Soft Delete policy by right-clicking on the Blob Containers node for your Storage account.
   * View soft deleted blobs in the Blob Editor by selecting "Active and deleted blobs" in the dropdown next to the navigation bar.
   * Undelete soft deleted blobs.

### Fixes
* The "Configure CORS Settings" action is no longer available on Premium Storage accounts because Premium Storage accounts do not support CORS. [#142](https://github.com/Microsoft/AzureStorageExplorer/issues/142)
* There is now a Shared Access Signature property for SAS Attached Services. [#184](https://github.com/Microsoft/AzureStorageExplorer/issues/184)
* The "Set Default Access Tier" action is now available For Blob and GPV2 Storage accounts that have been pinned to Quick Access. [#229](https://github.com/Microsoft/AzureStorageExplorer/issues/229)
* Sometimes, Storage Explorer would fail to show Classic Storage accounts. [#323](https://github.com/Microsoft/AzureStorageExplorer/issues/323)

### Known Issues
* When using emulators, such as Azure Storage Emulator or Azurite, you will need to have them listen for connections on their default ports. Otherwise, Storage Explorer will not be able to connect to them.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 1.4.2
09/24/2018

### Hotfixes
* Update Azure Resource Management Api Version to 2018-07-01 to add support for new Azure Storage Account kinds. [#652](https://github.com/Microsoft/AzureStorageExplorer/issues/652)

### New
* External resource attachments, such as for SAS connections and emulators, has been significantly improved. Now you can:
   * Customize the display name of the resource you are attaching. [#31](https://github.com/Microsoft/AzureStorageExplorer/issues/31)
   * Attach to multiple local emulators using different ports. [#193](https://github.com/Microsoft/AzureStorageExplorer/issues/193)
   * Add attached resources to Quick Access. [#392](https://github.com/Microsoft/AzureStorageExplorer/issues/392)
* Storage Explorer now supports Soft Delete. You can:
   * Configure a Soft Delete policy by right-clicking on the Blob Containers node for your Storage account.
   * View soft deleted blobs in the Blob Editor by selecting "Active and deleted blobs" in the dropdown next to the navigation bar.
   * Undelete soft deleted blobs.

### Fixes
* The "Configure CORS Settings" action is no longer available on Premium Storage accounts because Premium Storage accounts do not support CORS. [#142](https://github.com/Microsoft/AzureStorageExplorer/issues/142)
* There is now a Shared Access Signature property for SAS Attached Services. [#184](https://github.com/Microsoft/AzureStorageExplorer/issues/184)
* The "Set Default Access Tier" action is now available For Blob and GPV2 Storage accounts that have been pinned to Quick Access. [#229](https://github.com/Microsoft/AzureStorageExplorer/issues/229)
* Sometimes, Storage Explorer would fail to show Classic Storage accounts. [#323](https://github.com/Microsoft/AzureStorageExplorer/issues/323)

### Known Issues
* When using emulators, such as Azure Storage Emulator or Azurite, you will need to have them listen for connections on their default ports. Otherwise, Storage Explorer will not be able to connect to them.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 1.4.1
08/28/2018

### Hotfixes
* On first launch, Storage Explorer was unable to generate the key used to encrypt sensitive data. This would cause issues when using Quick Access and attaching resources. [#535](https://github.com/Microsoft/AzureStorageExplorer/issues/535)
* If your account did not require MFA for its home tenant, but did for some other tenants, Storage Explorer would be unable to list subscriptions. Now, after signing in with such an account, Storage Explorer will ask you to reenter your credentials and perform MFA. [#74](https://github.com/Microsoft/AzureStorageExplorer/issues/74)
* Storage Explorer was unable to attach resources from Azure Germany and Azure US Government. [#572](https://github.com/Microsoft/AzureStorageExplorer/issues/572)
* If you signed in to two accounts that had the same email address, Storage Explorer would sometimes fail to show your resources in the tree view. [#580](https://github.com/Microsoft/AzureStorageExplorer/issues/580)
* On slower Windows machines, the splash screen would sometimes take a significant amount of time to appear. [#586](https://github.com/Microsoft/AzureStorageExplorer/issues/586)
* The connect dialog would appear even if there were attached accounts or services. [#588](https://github.com/Microsoft/AzureStorageExplorer/issues/588)

### New
* External resource attachments, such as for SAS connections and emulators, has been significantly improved. Now you can:
   * Customize the display name of the resource you are attaching. [#31](https://github.com/Microsoft/AzureStorageExplorer/issues/31)
   * Attach to multiple local emulators using different ports. [#193](https://github.com/Microsoft/AzureStorageExplorer/issues/193)
   * Add attached resources to Quick Access. [#392](https://github.com/Microsoft/AzureStorageExplorer/issues/392)
* Storage Explorer now supports Soft Delete. You can:
   * Configure a Soft Delete policy by right-clicking on the Blob Containers node for your Storage account.
   * View soft deleted blobs in the Blob Editor by selecting "Active and deleted blobs" in the dropdown next to the navigation bar.
   * Undelete soft deleted blobs.

### Fixes
* The "Configure CORS Settings" action is no longer available on Premium Storage accounts because Premium Storage accounts do not support CORS. [#142](https://github.com/Microsoft/AzureStorageExplorer/issues/142)
* There is now a Shared Access Signature property for SAS Attached Services. [#184](https://github.com/Microsoft/AzureStorageExplorer/issues/184)
* The "Set Default Access Tier" action is now available For Blob and GPV2 Storage accounts that have been pinned to Quick Access. [#229](https://github.com/Microsoft/AzureStorageExplorer/issues/229)
* Sometimes, Storage Explorer would fail to show Classic Storage accounts. [#323](https://github.com/Microsoft/AzureStorageExplorer/issues/323)

### Known Issues
* When using emulators, such as Azure Storage Emulator or Azurite, you will need to have them listen for connections on their default ports. Otherwise, Storage Explorer will not be able to connect to them.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 1.3.0
07/09/2018

### New
* Accessing the $web containers used by Static Websites is now supported. This allows you to easily upload and manage files and folders used by your website. [#223](https://github.com/Microsoft/AzureStorageExplorer/issues/223)
* The app bar on macOS has been reorganized. Changes include a File menu, some shortcut key changes, and several new commands under the app menu. [#99](https://github.com/Microsoft/AzureStorageExplorer/issues/99)
* The authority endpoint for signing in to Azure US Government has been changed to https://login.microsoftonline.us/
* Accessibility: When a screen reader is active, keyboard navigation now works with the tables used for displaying items on the right-hand side. You can use the arrow keys to navigate rows and columns, Enter to invoke default actions, the context menu key to open up the context menu for an item, and Shift or Control to multiselect. [#103](https://github.com/Microsoft/AzureStorageExplorer/issues/103)

### Fixes
*  On some machines, child processes were taking a long time to start. When this would happen, a "child process failed to start in a timely manner" error would appear. The time allotted for a child process to start has now been increased from 20 to 90 seconds. If you are still affected by this issue, please comment on the linked GitHub issue. [#281](https://github.com/Microsoft/AzureStorageExplorer/issues/281)
* When using a SAS that did not have read permissions, it was not possible to upload a large blob. The logic for upload has been modified to work in this scenario. [#305](https://github.com/Microsoft/AzureStorageExplorer/issues/305)
* Setting the public access level for a container would remove all access policies, and vice versa. Now, public access level and access policies are preserved when setting either of the two. [#197](https://github.com/Microsoft/AzureStorageExplorer/issues/197)
* "AccessTierChangeTime" was truncated in the Properties dialog. This has been fixed. [#145](https://github.com/Microsoft/AzureStorageExplorer/issues/145)
* The "Microsoft Azure Storage Explorer -" prefix was missing from the Create New Directory dialog. This has been fixed. [#299](https://github.com/Microsoft/AzureStorageExplorer/issues/299)
* Accessibility: The Add Entity dialog was difficult to navigate when using VoiceOver. Improvements have been made. [#206](https://github.com/Microsoft/AzureStorageExplorer/issues/206)
* Accessibility: The background color of the collapse/expand button for the Actions and Properties pane was inconsistent with similar UI controls in High Contrast Black theme. The color has been changed. [#123](https://github.com/Microsoft/AzureStorageExplorer/issues/123)
* Accessibility: In High Contrast Black theme, the focus styling for the 'X' button in the Properties dialog was not visible. This has been fixed. [#243](https://github.com/Microsoft/AzureStorageExplorer/issues/243)
* Accessibility: The Actions and Properties tabs were missing several aria values which resulted in a subpar screen reader experience. The missing aria values have now been added. [#316](https://github.com/Microsoft/AzureStorageExplorer/issues/316)
* Accessibility: Collapsed tree nodes on the left hand side were not being given an aria-expanded value of false. This has been fixed. [#352](https://github.com/Microsoft/AzureStorageExplorer/issues/352)

### Known Issues
* Detatching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/537) for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features, and attempting to use them while working with Azure Stack may result in unexpected errors:
   * File shares
   * Access tiers
   * Soft Delete
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 1.2.0
06/12/2018

### New
* If Storage Explorer fails to load subscriptions from only a subset of your tenants, then any successfully loaded subscriptions will be shown along with an error message specifically for the tenants that failed. [#159](https://github.com/Microsoft/AzureStorageExplorer/issues/159)
* On Windows, when an update is available, you can now choose to "Update on Close". When this option is picked, the installer for the update will run after you close Storage Explorer. [#21](https://github.com/Microsoft/AzureStorageExplorer/issues/21)
* Restore Snapshot has been added to the context menu of the file share editor when viewing a file share snapshot.[#131](https://github.com/Microsoft/AzureStorageExplorer/issues/131)
* The Clear Queue button is now always enabled.[#135](https://github.com/Microsoft/AzureStorageExplorer/issues/135)
* Support for signing in to ADFS Azure Stack has been re-enabled. Azure Stack version 1804 or greater is required. [#150](https://github.com/Microsoft/AzureStorageExplorer/issues/150)

### Fixes
* If you viewed snapshots for a file share whose name was a prefix of another file share in the same storage account, then the snapshots for the other file share would also be listed. This issue has been fixed. [#255](https://github.com/Microsoft/AzureStorageExplorer/issues/255)
* When attached via SAS, restoring a file from a file share snapshot would result in an error. This issue has been fixed. [#211](https://github.com/Microsoft/AzureStorageExplorer/issues/211)
* When viewing snapshots for a blob, the Promote Snapshot action was enabled when the base blob and a single snapshot were selected. The action is now only enabled if a single snapshot is selected. [#230](https://github.com/Microsoft/AzureStorageExplorer/issues/230)
* If a single job (such as downloading a blob) was started and later failed, it would not automatically retry until you started another job of the same type. All jobs should now auto retry, regardless of how many jobs you have queued.
* Editors opened for newly created blob containers in GPV2 and Blob Storage accounts did not have an Access Tier column. This issue has been fixed. [#109](https://github.com/Microsoft/AzureStorageExplorer/issues/109)
* An Access Tier column would sometimes not appear when a Storage account or blob container was attached via SAS. The column will now always be shown, but with an empty value if there is no Access Tier set. [#160](https://github.com/Microsoft/AzureStorageExplorer/issues/160)
* Setting the Access Tier of a newly uploaded block blob was disabled. This issue has been fixed. [#171](https://github.com/Microsoft/AzureStorageExplorer/issues/171)
* If the "Keep Tab Open" button was invoked using keyboard, then keyboard focus would be lost. Now, the focus will move onto the tab that was kept open. [#163](https://github.com/Microsoft/AzureStorageExplorer/issues/163)
* For a query in the Query Builder, VoiceOver was not giving a usable description of the current operator. It is now more descriptive. [#207](https://github.com/Microsoft/AzureStorageExplorer/issues/207)
* The pagination links for the various editors were not descriptive. They have been changed to be more descriptive. [#205](https://github.com/Microsoft/AzureStorageExplorer/issues/205)
* In the Add Entity dialog, VoiceOver was not announcing what column an input element was part of. The name of the current column is now included in the description of the element. [#206](https://github.com/Microsoft/AzureStorageExplorer/issues/206)
* Radio buttons and checkboxes did not have a visible border when focused. This issue has been fixed. [#237](https://github.com/Microsoft/AzureStorageExplorer/issues/237)

### Known Issues
* When using emulators, such as Azure Storage Emulator or Azurite, you will need to have them listen for connections on their default ports. Otherwise, Storage Explorer will not be able to connect to them.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 1.1.0
05/09/2018

### New
* Storage Explorer now supports the use of Azurite. Note: the connection to Azurite is hardcoded to the default development endpoints.
* Storage Explorer now supports Access Tiers for Blob Only and GPV2 Storage Accounts. Learn more about Access Tiers [here](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-storage-tiers).
* A start time is no longer required when generating a SAS.

### Fixes
* Retrieving of subscriptions for US Government accounts was broken. This issue has been fixed. [#61](https://github.com/Microsoft/AzureStorageExplorer/issues/61)
* The expiry time for access policies was not correctly being saved. This issue has been fixed. [#50](https://github.com/Microsoft/AzureStorageExplorer/issues/50)
* When generating a SAS URL for an item in a container, the name of the item was not being appended to the URL. This issue has been fixed. [#44](https://github.com/Microsoft/AzureStorageExplorer/issues/44)
* When creating a SAS, expiry times that are in the past would sometimes be the default value. This was due to Storage Explorer using the last used start and expiry time as default values. Now, every time you open the SAS dialog, a new set of default values is generated. [#35](https://github.com/Microsoft/AzureStorageExplorer/issues/35)
* When copying between Storage Accounts, a 24-hour SAS is generated. If the copy lasted more than 24 hours, then the copy would fail. We've increased the SAS's to last 1 week to reduce the chance of a copy failing due to an expired SAS. [#62](https://github.com/Microsoft/AzureStorageExplorer/issues/62)
* For some activities clicking on "Cancel" would not always work. This issue has been fixed. [#125](https://github.com/Microsoft/AzureStorageExplorer/issues/125)
* For some activities the transfer speed was wrong. This issue has been fixed. [#124](https://github.com/Microsoft/AzureStorageExplorer/issues/124)
* The spelling of "Previous" in the View menu was wrong. It is now properly spelled. [#71](https://github.com/Microsoft/AzureStorageExplorer/issues/71)
* The final page of the Windows installer had a "Next" button. It has been changed to a "Finish" button. [#70](https://github.com/Microsoft/AzureStorageExplorer/issues/70)
* Tab focus was not visible for buttons in dialogs when using the HC Black theme. It is now visible.[#64](https://github.com/Microsoft/AzureStorageExplorer/issues/64)
* The casing of "Auto-Resolve" for actions in the activity log was wrong. It is now correct. [#51](https://github.com/Microsoft/AzureStorageExplorer/issues/51)
* When deleting an entity from a table, the dialog asking you for confirmation displayed an error icon. The dialog now uses a warning icon. [#148](https://github.com/Microsoft/AzureStorageExplorer/issues/148)

### Known Issues
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```


## Version 1.0.0
04/16/2018

### New
* Enhanced authentication that allows Storage Explorer to use the same account store as Visual Studio 2017. To use this feature, you will need to re-login to your accounts and re-set your filtered subscriptions.
* For Azure Stack accounts backed by AAD, Storage Explorer will now retrieve Azure Stack subscriptions when 'Target Azure Stack' is enabled. You no longer need to create a custom login environment.
* Several shortcuts were added to enable faster navigation. These include toggling various panels and moving between editors. See the View menu for more details.
* Storage Explorer feedback now lives on GitHub. You can reach our issues page by clicking the Feedback button in the bottom left or by going to [https://github.com/Microsoft/AzureStorageExplorer/issues](https://github.com/Microsoft/AzureStorageExplorer/issues). Feel free to make suggestions, report issues, ask questions, or leave any other form of feedback.
* If you are running into SSL Certificate issues and are unable to find the offending certificate, you can now launch Storage Explorer from the command line with the `--ignore-certificate-errors` flag. When launched with this flag, Storage Explorer will ignore SSL certificate errors.
* There is now a 'Download' option in the context menu for blob and file items.
* Improved accessibility and screen reader support. If you rely on accessibility features, see our [accessibility documentation](https://docs.microsoft.com/en-us/azure/vs-azure-tools-storage-explorer-accessibility) for more information.
* Storage Explorer now uses Electron 1.8.3

### Breaking Changes
* Storage Explorer has switched to a new authentication library. As part of the switch to the library, you will need to re-login to your accounts and re-set your filtered subscriptions
* The method used to encrypt sensitive data has changed. This may result in some of your Quick Access items needing to be re-added and/or some of you attached resources needing to be reattached.

### Fixes
* Some users behind proxies would have group blob uploads or downloads interrupted by an 'Unable to resolve' error message. This issue has been fixed.
* If sign-in was needed while using a direct link, clicking on the 'Sign-In' prompt would pop up a blank dialog. This issue has been fixed.
* On Linux, if Storage Explorer is unable to launch because of a GPU process crash, you will now be informed of the crash, told to use the '--disable-gpu' switch, and Storage Explorer will then automatically restart with the switch enabled.
* Invalid access policies were hard to identity in the Access Policies dialog. Invalid access policy IDs are now outlined in red for more visibility.
* The activity log would sometimes have large areas of whitespace between the different parts of an activity. This issue has been fixed.
* In the table query editor, if you left a timestamp clause in an invalid state and then attempted to modify another clause, the editor would freeze. The editor will now restore the timestamp clause to its last valid state when a change in another clause is detected.
* If you paused while typing in your search query in the tree view, the search would begin and focus would be stolen from the text box. Now, you must explicitly start searching by pressing the 'Enter' key, or by clicking on the start search button.
* The 'Get Shared Access Signature' command would sometimes be disabled when right clicking on a file in a File Share. This issue has been fixed.
* If the resource tree node with focus was filtered out during search, you could not tab into the resource tree and use the arrow keys to navigate the resource tree. Now, if the focused resource tree node is hidden, the first node in the resource tree will be automatically focused.
* An extra separator would sometimes be visible in the editor toolbar. This issue has been fixed.
* The breadcrumb text box would sometimes overflow. This issue has been fixed.
* The Blob and File Share editors would sometimes constantly refresh when uploading many files at once. This issue has been fixed.
* The 'Folder Statistics' feature had no purpose in the File Share Snapshots Management view. It has now been disabled.
* On Linux, the File menu did not appear. This issue has been fixed.
* When uploading a folder to a File Share, by default, only the contents of the folder were uploaded. Now, the default behavior is to upload the contents of the folder into a matching folder in the File Share.
* The ordering of buttons in several dialogs had been reversed. This issue has been fixed.
* Various security related fixes.

### Known Issues
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For Linux users, you will need to install [.NET Core 2.0](https://docs.microsoft.com/en-us/dotnet/core/linux-prerequisites?tabs=netcore2x).
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 0.9.6
02/28/2018

### Fixes
* An issue prevented expected blobs/files from being listed in the editor. This issue has been fixed.
* An issue caused switching between snapshot views to display items incorrectly. This issue has been fixed.

### Known Issues
* Storage Explorer does not support ADFS accounts.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 0.9.5
02/06/2018

### New

* Support for File Shares snapshots:
	* Create and manage snapshots for your File Shares.
	* Easily switch views between snapshots of your File Shares as you explore.
	* Restore previous versions of your files.
* Preview support for Azure Data Lake Store:
	* Connect to your ADLS resources across multiple accounts.
	* Connect to and share ADLS resources using ADL URIs.
	* Perform basic file/folder operations recursively.
	* Pin individual folders to Quick Access.
	* Display folder statistics.

### Fixes
* Startup performance improvements.
* Various bug fixes.

### Known Issues
* Storage Explorer does not support ADFS accounts.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

```
./StorageExplorer.exe --disable-gpu
```

* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 0.9.4 and 0.9.3
01/21/2018

### New
* Your existing Storage Explorer window will be re-used when:
	* Opening direct links generated in Storage Explorer.
	* Opening Storage Explorer from portal.
	* Opening Storage Explorer from Azure Storage VS Code extension (coming soon).
* Added ability to open a new Storage Explorer window from within Storage Explorer.
	* For Windows, there is a 'New Window' option under File Menu and in the context menu of the task bar.
	* For Mac, there is a 'New Window' option under App Menu.

### Fixes
* Fixed a security issue. Please upgrade to 0.9.4 at your earliest convenience.
* Old activities were not appropriately being cleaned up. This affected the performance of long running jobs. They are now being cleaned up correctly.
* Actions involving large numbers of files and directories would occasionally cause Storage Explorer to freeze. Requests to Azure for File Shares are now throttled to limit system resource use.

### Known Issues
* Storage Explorer does not support ADFS accounts.
* Shortcut keys for "View Explorer" and "View Account Management" should be Ctrl/Cmd+Shift+E and Ctrl/Cmd+Shift+A respectively.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:
```
./StorageExplorer --disable-gpu
```
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 0.9.2
11/01/2017

### Hotfixes
* Unexpected data changes were possible when editing Edm.DateTime values for table entities depending on the local time zone. The editor now uses a plain text box, giving precise, consistent control over Edm.DateTime values.
* Uploading/downloading a group of blobs when attached with name and key would not start. This issue has been fixed.
* Previously Storage Explorer would only prompt you to reauthenticate a stale account if one or more of the account's subscriptions was selected. Now Storage Explorer will prompt you even if the account is fully filtered out.
* The endpoints domain for Azure US Government was wrong. It has been fixed.
* The apply button on the Manage Accounts panel was sometimes hard to click. This should no longer happen.

### New
* Preview support for Azure Cosmos DB:
	* [Online Documentation](./cosmos-db/storage-explorer.md)
	* Create databases and collections
	* Manipulate data
	* Query, create, or delete documents
	* Update stored procedures, user-defined functions, or triggers
	* Use connection strings to connect to and manage your databases
* Improved the performance of uploading/downloading many small blobs.
* Added a "Retry All" action if there are failures in a blob upload group or blob download group.
* Storage Explorer will now pause iteration during blob upload/download if it detects your network connection has been lost. You can then resume iteration once the network connection has been re-established.
* Added the ability to "Close All", "Close Others", and "Close" tabs via context menu.
* Storage Explorer now uses native dialogs and native context menus.
* Storage Explorer is now more accessible. Improvements include:
	* Improved screen reader support, for NVDA on Windows, and for VoiceOver on Mac
	* Improved high contrast theming
	* Keyboard tabbing and keyboard focus fixes

### Fixes
* If you tried to open or download a blob with an invalid Windows file name, the operation would fail. Storage Explorer will now detect if a blob name is invalid and ask if you would like to either encode it or skip the blob. Storage Explorer will also detect if a file name appears to be encoded and ask you if want to decode it before uploading.
* During blob upload, the editor for the target blob container would sometimes not properly refresh. This issue has been fixed.
* The support for several forms of connection strings and SAS URIs regressed. We have addressed all known issues, but please send feedback if you encounter further issues.
* The update notification was broken for some users in 0.9.0. This issue has been fixed, and for those affected by the bug, you can manually download the latest version of Storage Explorer [here](https://azure.microsoft.com/features/storage-explorer/).

### Known Issues
* Storage Explorer does not support ADFS accounts.
* Shortcut keys for "View Explorer" and "View Account Management" should be Ctrl/Cmd+Shift+E and Ctrl/Cmd+Shift+A respectively.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:
```
./StorageExplorer --disable-gpu
```
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 0.9.1 and 0.9.0
10/20/2017
### New
* Preview support for Azure Cosmos DB:
	* [Online Documentation](./cosmos-db/storage-explorer.md)
	* Create databases and collections
	* Manipulate data
	* Query, create, or delete documents
	* Update stored procedures, user-defined functions, or triggers
	* Use connection strings to connect to and manage your databases
* Improved the performance of uploading/downloading many small blobs.
* Added a "Retry All" action if there are failures in a blob upload group or blob download group.
* Storage Explorer will now pause iteration during blob upload/download if it detects your network connection has been lost. You can then resume iteration once the network connection has been re-established.
* Added the ability to "Close All", "Close Others", and "Close" tabs via context menu.
* Storage Explorer now uses native dialogs and native context menus.
* Storage Explorer is now more accessible. Improvements include:
	* Improved screen reader support, for NVDA on Windows, and for VoiceOver on Mac
	* Improved high contrast theming
	* Keyboard tabbing and keyboard focus fixes

### Fixes
* If you tried to open or download a blob with an invalid Windows file name, the operation would fail. Storage Explorer will now detect if a blob name is invalid and ask if you would like to either encode it or skip the blob. Storage Explorer will also detect if a file name appears to be encoded and ask you if want to decode it before uploading.
* During blob upload, the editor for the target blob container would sometimes not properly refresh. This issue has been fixed.
* The support for several forms of connection strings and SAS URIs regressed. We have addressed all known issues, but please send feedback if you encounter further issues.
* The update notification was broken for some users in 0.9.0. This issue has been fixed, and for those affected by the bug, you can manually download the latest version of Storage Explorer [here](https://azure.microsoft.com/features/storage-explorer/)

### Known Issues
* Storage Explorer does not support ADFS accounts.
* Shortcut keys for "View Explorer" and "View Account Management" should be Ctrl/Cmd+Shift+E and Ctrl/Cmd+Shift+A respectively.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter workaround described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:
```
./StorageExplorer --disable-gpu
```
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

## Version 0.8.16
8/21/2017

### New
* When you open a blob, Storage Explorer will prompt you to upload the downloaded file if a change is detected
* Enhanced Azure Stack sign-in experience
* Improved the performance of uploading/downloading many small files at the same time


### Fixes
* For some blob types, choosing to "replace" during an upload conflict would sometimes result in the upload being restarted.
* In version 0.8.15, uploads would sometimes stall at 99%.
* When uploading files to a file share, if you chose to upload to a directory which did not yet exist, your upload would fail.
* Storage Explorer was incorrectly generating time stamps for shared access signatures and table queries.


### Known Issues
* Using a name and key connection string does not currently work. It will be fixed in the next release. Until then you can use attach with name and key.
* If you try to open a file with an invalid Windows file name, the download will result in a file not found error.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is a limitation of the Azure Storage Node library.
* After completing a blob upload, the tab which initiated the upload is refreshed. This is a change from previous behavior, and will also cause you to be taken back to the root of the container you are in.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* For users on Ubuntu 14.04, you will need to ensure GCC is up-to-date - this can be done by running the following commands, and then restarting your machine:

	```
	sudo add-apt-repository ppa:ubuntu-toolchain-r/test
	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get dist-upgrade
	```

* For users on Ubuntu 17.04, you will need to install GConf - this can be done by running the following commands, and then restarting your machine:

	```
	sudo apt-get install libgconf-2-4
	```

### Version 0.8.14
06/22/2017

### New

* Updated Electron version to 1.7.2 in order to take advantage of several critical security updates
* You can now quickly access the online troubleshooting guide from the help menu
* Storage Explorer Troubleshooting [Guide][2]
* [Instructions][3] on connecting to an Azure Stack subscription

### Known Issues

* Buttons on the delete folder confirmation dialog don't register with the mouse clicks on Linux. Workaround is to use the Enter key
* If you choose the wrong PIN/Smartcard certificate then you will need to restart in order to have Storage Explorer forget the decision
* Having more than 3 groups of blobs or files uploading at the same time may cause errors
* The account settings panel may show that you need to reenter credentials in order to filter subscriptions
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support File Shares, a File Shares node still appears under an attached Azure Stack storage account.
* Ubuntu 14.04 install needs gcc version updated or upgraded – steps to upgrade are below:

    ```
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```

### Version 0.8.13
05/12/2017

#### New

* Storage Explorer Troubleshooting [Guide][2]
* [Instructions][3] on connecting to an Azure Stack subscription

#### Fixes

* Fixed: File upload had a high chance of causing an out of memory error
* Fixed: You can now sign-in with PIN/Smartcard
* Fixed: Open in Portal now works with Azure China, Azure Germany, Azure US Government, and Azure Stack
* Fixed: While uploading a folder to a blob container, an "Illegal operation" error would sometimes occur
* Fixed: Select all was disabled while managing snapshots
* Fixed: The metadata of the base blob might get overwritten after viewing the properties of its snapshots

#### Known Issues

* If you choose the wrong PIN/Smartcard certificate then you will need to restart in order to have Storage Explorer forget the decision
* While zoomed in or out, the zoom level may momentarily reset to the default level
* Having more than 3 groups of blobs or files uploading at the same time may cause errors
* The account settings panel may show that you need to reenter credentials in order to filter subscriptions
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* Ubuntu 14.04 install needs gcc version updated or upgraded – steps to upgrade are below:

    ```
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```


### Version 0.8.12 and 0.8.11 and 0.8.10
04/07/2017

#### New

* Storage Explorer will now automatically close when you install an update from the update notification
* In-place quick access provides an enhanced experience for working with your frequently accessed resources
* In the Blob Container editor, you can now see which virtual machine a leased blob belongs to
* You can now collapse the left side panel
* Discovery now runs at the same time as download
* Use Statistics in the Blob Container, File Share, and Table editors to see the size of your resource or selection
* You can now sign-in to Azure Active Directory (AAD) based Azure Stack accounts.
* You can now upload archive files over 32MB to Premium storage accounts
* Improved accessibility support
* You can now add trusted Base-64 encoded X.509 SSL certificates by going to Edit -&gt; SSL Certificates -&gt; Import Certificates

#### Fixes

* Fixed: after refreshing an account's credentials, the tree view would sometimes not automatically refresh
* Fixed: generating a SAS for emulator queues and tables would result in an invalid URL
* Fixed: premium storage accounts can now be expanded while a proxy is enabled
* Fixed: the apply button on the accounts management page would not work if you had 1 or 0 accounts selected
* Fixed: uploading blobs that require conflict resolutions may fail - fixed in 0.8.11
* Fixed: sending feedback was broken in 0.8.11 - fixed in 0.8.12

#### Known Issues

* After upgrading to 0.8.10, you will need to refresh all of your credentials.
* While zoomed in or out, the zoom level may momentarily reset to the default level.
* Having more than 3 groups of blobs or files uploading at the same time may cause errors.
* The account settings panel may show that you need to reenter credentials in order to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* Ubuntu 14.04 install needs gcc version updated or upgraded – steps to upgrade are below:

    ```
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```


### Version 0.8.9 and 0.8.8
02/23/2017

>[!VIDEO https://www.youtube.com/embed/R6gonK3cYAc?ecver=1]

>[!VIDEO https://www.youtube.com/embed/SrRPCm94mfE?ecver=1]


#### New

* Storage Explorer 0.8.9 will automatically download the latest version for updates.
* Hotfix: using a portal generated SAS URI to attach a storage account would result in an error.
* You can now create, manage, and promote blob snapshots.
* You can now sign-in to Azure China, Azure Germany, and Azure US Government accounts.
* You can now change the zoom level. Use the options in the View menu to Zoom In, Zoom Out, and Reset Zoom.
* Unicode characters are now supported in user metadata for blobs and files.
* Accessibility improvements.
* The next version's release notes can be viewed from the update notification. You can also view the current release notes from the Help menu.

#### Fixes

* Fixed: the version number is now correctly displayed in Control Panel on Windows
* Fixed: search is no longer limited to 50,000 nodes
* Fixed: upload to a file share spun forever if the destination directory did not already exist
* Fixed: improved stability for long uploads and downloads

#### Known Issues

* While zoomed in or out, the zoom level may momentarily reset to the default level.
* Quick Access only works with subscription based items. Local resources or resources attached via key or SAS token are not supported in this release.
* It may take Quick Access a few seconds to navigate to the target resource, depending on how many resources you have.
* Having more than 3 groups of blobs or files uploading at the same time may cause errors.

12/16/2016
### Version 0.8.7

>[!VIDEO https://www.youtube.com/embed/Me4Y4jxoer8?ecver=1]

#### New

* You can choose how to resolve conflicts at the beginning of an update, download or copy session in the Activities window
* Hover over a tab to see the full path of the storage resource
* When you click on a tab, it synchronizes with its location in the left side navigation pane

#### Fixes

* Fixed: Storage Explorer is now a trusted app on Mac
* Fixed: Ubuntu 14.04 is again supported
* Fixed: Sometimes the add account UI flashes when loading subscriptions
* Fixed: Sometimes not all storage resources were listed in the left side navigation pane
* Fixed: The action pane sometimes displayed empty actions
* Fixed: The window size from the last closed session is now retained
* Fixed: You can open multiple tabs for the same resource using the context menu

#### Known Issues

* Quick Access only works with subscription based items. Local resources or resources attached via key or SAS token are not supported in this release
* It may take Quick Access a few seconds to navigate to the target resource, depending on how many resources you have
* Having more than 3 groups of blobs or files uploading at the same time may cause errors
* Search handles searching across roughly 50,000 nodes - after this, performance may be impacted or may cause unhandled exception
* For the first time using the Storage Explorer on macOS, you might see multiple prompts asking for user's permission to access keychain. We suggest you select Always Allow so the prompt won't show up again

11/18/2016
### Version 0.8.6

#### New

* You can now pin most frequently used services to the Quick Access for easy navigation
* You can now open multiple editors in different tabs. Single click to open a temporary tab; double click to open a permanent tab. You can also click on the temporary tab to make it a permanent tab
* We have made noticeable performance and stability improvements for uploads and downloads, especially for large files on fast machines
* Empty "virtual" folders can now be created in blob containers
* We have re-introduced scoped search with our new enhanced substring search, so you now have two options for searching:
    * Global search - just enter a search term into the search textbox
    * Scoped search - click the magnifying glass icon next to a node, then add a search term to the end of the path, or right-click and select "Search from Here"
* We have added various themes: Light (default), Dark, High Contrast Black, and High Contrast White. Go to Edit -&gt; Themes to change your theming preference
* You can modify Blob and file properties
* We now support encoded (base64) and unencoded queue messages
* On Linux, a 64-bit OS is now required. For this release we only support 64-bit Ubuntu 16.04.1 LTS
* We have updated our logo!

#### Fixes

* Fixed: Screen freezing problems
* Fixed: Enhanced security
* Fixed: Sometimes duplicate attached accounts could appear
* Fixed: A blob with an undefined content type could generate an exception
* Fixed: Opening the Query Panel on an empty table was not possible
* Fixed: Varies bugs in Search
* Fixed: Increased the number of resources loaded from 50 to 100 when clicking "Load More"
* Fixed: On first run, if an account is signed into, we now select all subscriptions for that account by default

#### Known Issues

* This release of the Storage Explorer does not run on Ubuntu 14.04
* To open multiple tabs for the same resource, do not continuously click on the same resource. Click on another resource and then go back and then click on the original resource to open it again in another tab
* Quick Access only works with subscription based items. Local resources or resources attached via key or SAS token are not supported in this release
* It may take Quick Access a few seconds to navigate to the target resource, depending on how many resources you have
* Having more than 3 groups of blobs or files uploading at the same time may cause errors
* Search handles searching across roughly 50,000 nodes - after this, performance may be impacted or may cause unhandled exception

10/03/2016
### Version 0.8.5

#### New

* Can now use Portal-generated SAS keys to attach to Storage Accounts and resources

#### Fixes

* Fixed: race condition during search sometimes caused nodes to become non-expandable
* Fixed: "Use HTTP" doesn't work when connecting to Storage Accounts with account name and key
* Fixed: SAS keys (specially Portal-generated ones) return a "trailing slash" error
* Fixed: table import issues
    * Sometimes partition key and row key were reversed
    * Unable to read "null" Partition Keys

#### Known Issues

* Search handles searching across roughly 50,000 nodes - after this, performance may be impacted
* Azure Stack doesn't currently support Files, so trying to expand Files will show an error

09/12/2016
### Version 0.8.4

>[!VIDEO https://www.youtube.com/embed/cr5tOGyGrIQ?ecver=1]

#### New

* Generate direct links to storage accounts, containers, queues, tables, or file shares for sharing and easy access to your resources - Windows and Mac OS support
* Search for your blob containers, tables, queues, file shares, or storage accounts from the search box
* You can now group clauses in the table query builder
* Rename and copy/paste blob containers, file shares, tables, blobs, blob folders, files and directories from within SAS-attached accounts and containers
* Renaming and copying blob containers and file shares now preserve properties and metadata

#### Fixes

* Fixed: cannot edit table entities if they contain boolean or binary properties

#### Known Issues

* Search handles searching across roughly 50,000 nodes - after this, performance may be impacted

08/03/2016
### Version 0.8.3

>[!VIDEO https://www.youtube.com/embed/HeGW-jkSd9Y?ecver=1]

#### New

* Rename containers, tables, file shares
* Improved Query builder experience
* Ability to save and load queries
* Direct links to storage accounts or containers, queues, tables, or file shares for sharing and easily accessing your resources (Windows-only - macOS support coming soon!)
* Ability to manage and configure CORS rules

#### Fixes

* Fixed: Microsoft Accounts require re-authentication every 8-12 hours

#### Known Issues

* Sometimes the UI might appear frozen - maximizing the window helps resolve this issue
* macOS install may require elevated permissions
* Account settings panel may show that you need to reenter credentials in order to filter subscriptions
* Renaming file shares, blob containers, and tables does not preserve metadata or other properties on the container, such as file share quota, public access level or access policies
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files and entities are preserved during a rename
* Copying or renaming resources does not work within SAS-attached accounts

07/07/2016
### Version 0.8.2

>[!VIDEO https://www.youtube.com/embed/nYgKbRUNYZA?ecver=1]

#### New

* Storage Accounts are grouped by subscriptions; development storage and resources attached via key or SAS are shown under (Local and Attached) node
* Sign off from accounts in "Azure Account Settings" panel
* Configure proxy settings to enable and manage sign-in
* Create and break blob leases
* Open blob containers, queues, tables, and files with single-click

#### Fixes

* Fixed: queue messages inserted with .NET or Java libraries are not properly decoded from base64
* Fixed: $metrics tables are not shown for Blob Storage accounts
* Fixed: tables node does not work for local (Development) storage

#### Known Issues

* macOS install may require elevated permissions

06/15/2016
### Version 0.8.0

>[!VIDEO https://www.youtube.com/embed/ycfQhKztSIY?ecver=1]

>[!VIDEO https://www.youtube.com/embed/k4_kOUCZ0WA?ecver=1]

>[!VIDEO https://www.youtube.com/embed/3zEXJcGdl_k?ecver=1]

#### New

* File share support: viewing, uploading, downloading, copying files and directories, SAS URIs (create and connect)
* Improved user experience for connecting to Storage with SAS URIs or account keys
* Export table query results
* Table column reordering and customization
* Viewing $logs blob containers and $metrics tables for Storage Accounts with enabled metrics
* Improved export and import behavior, now includes property value type

#### Fixes

* Fixed: uploading or downloading large blobs can result in incomplete uploads/downloads
* Fixed: editing, adding, or importing an entity with a numeric string value ("1") will convert it to double
* Fixed: Unable to expand the table node in the local development environment

#### Known Issues

* $metrics tables are not visible for Blob Storage accounts
* Queue messages added programmatically may not be displayed correctly if the messages are encoded using Base64 encoding

05/17/2016
### Version 0.7.20160509.0

#### New

* Better error handling for app crashes

#### Fixes

* Fixed bug where InfoBar messages sometimes don't show up when sign-in credentials were required

#### Known Issues

* Tables: Adding, editing, or importing an entity that has a property with an ambiguously numeric value, such as "1" or "1.0", and the user tries to send it as an `Edm.String`, the value will come back through the client API as an Edm.Double

03/31/2016

### Version 0.7.20160325.0

>[!VIDEO https://www.youtube.com/embed/imbgBRHX65A?ecver=1]

>[!VIDEO https://www.youtube.com/embed/ceX-P8XZ-s8?ecver=1]

#### New

* Table support: viewing, querying, export, import, and CRUD operations for entities
* Queue support: viewing, adding, dequeueing messages
* Generating SAS URIs for Storage Accounts
* Connecting to Storage Accounts with SAS URIs
* Update notifications for future updates to Storage Explorer
* Updated look and feel

#### Fixes

* Performance and reliability improvements

### Known Issues &amp; Mitigations

* Download of large blob files does not work correctly - we recommend using AzCopy while we address this issue
* Account credentials will not be retrieved nor cached if the home folder cannot be found or cannot be written to
* If we are adding, editing, or importing an entity that has a property with an ambiguously numeric value, such as "1" or "1.0", and the user tries to send it as an `Edm.String`, the value will come back through the client API as an Edm.Double
* When importing CSV files with multiline records, the data may get chopped or scrambled

02/03/2016

### Version 0.7.20160129.1

#### Fixes

* Improved overall performance when uploading, downloading and copying blobs

01/14/2016

### Version 0.7.20160105.0

#### New

* Linux support (parity features to OSX)
* Add blob containers with Shared Access Signatures (SAS) key
* Add Storage Accounts for Azure China
* Add Storage Accounts with custom endpoints
* Open and view the contents text and picture blobs
* View and edit blob properties and metadata

#### Fixes

* Fixed: uploading or download a large number of blobs (500+) may sometimes cause the app to have a white screen
* Fixed: when setting blob container public access level, the new value is not updated until you re-set the focus on the container. Also, the dialog always defaults to "No public access", and not the actual current value.
* Better overall keyboard/accessibility and UI support
* Breadcrumbs history text wraps when it's long with white space
* SAS dialog supports input validation
* Local storage continues to be available even if user credentials have expired
* When an opened blob container is deleted, the blob explorer on the right side is closed

#### Known Issues

* Linux install needs gcc version updated or upgraded – steps to upgrade are below:
    * `sudo add-apt-repository ppa:ubuntu-toolchain-r/test`
    * `sudo apt-get update`
    * `sudo apt-get upgrade`
    * `sudo apt-get dist-upgrade`

11/18/2015
### Version 0.7.20151116.0

#### New

* macOS, and Windows versions
* Sign-in to view your Storage Accounts – use your Org Account, Microsoft Account, 2FA, etc.
* Local development storage (use storage emulator, Windows-only)
* Azure Resource Manager and Classic resource support
* Create and delete blobs, queues, or tables
* Search for specific blobs, queues, or tables
* Explore the contents of blob containers
* View and navigate through directories
* Upload, download, and delete blobs and folders
* View and edit blob properties and metadata
* Generate SAS keys
* Manage and create Stored Access Policies (SAP)
* Search for blobs by prefix
* Drag 'n drop files to upload or download

#### Known Issues

* When setting blob container public access level, the new value is not updated until you re-set the focus on the container
* When you open the dialog to set the public access level, it always shows "No public access" as the default, and not the actual current value
* Cannot rename downloaded blobs
* Activity log entries will sometimes get "stuck" in an in progress state when an error occurs, and the error is not displayed
* Sometimes crashes or turns completely white when trying to upload or download a large number of blobs
* Sometimes canceling a copy operation does not work
* During creating a container (blob/queue/table), if you input an invalid name and proceed to create another under a different container type you cannot set focus on the new type
* Can't create new folder or rename folder




[2]: https://support.microsoft.com/en-us/help/4021389/storage-explorer-troubleshooting-guide
[3]: vs-azure-tools-storage-manage-with-storage-explorer.md
