---
title: Microsoft Azure Storage Explorer release notes
description: Release notes for Microsoft Azure Storage Explorer
services: storage
documentationcenter: na
author: cawaMS
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

This article contains the latest release notes for Azure Storage Explorer, as well as release notes for previous versions. 

[Microsoft Azure Storage Explorer](./vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that enables you to easily work with Azure Storage data on Windows, macOS, and Linux.

To download previous versions of Storage Explorer, you can visit the [Releases page](https://github.com/microsoft/AzureStorageExplorer/releases) of our GitHub repo.

## Version 1.11.0
11/4/2019

### New
* Operations for Blobs, ADLS Gen2 and Managed Disks use the integrated AzCopy. More specifically, the following operations are done using AzCopy:
   * Blobs
      * Open for editing + Upload
      * Upload, including drag & drop
      * Download
      * Copy & paste #1249
      * Delete
   * ADLS Gen2 Blobs
      * Upload, including drag & drop
      * Download
      * Copy & paste
      * Delete, including folder delete
   * Managed Disks
      * Upload
      * Download
      * Copy & paste

   Additionally, several frequently requested features have been added to the integrated AzCopy experience:
   * Conflict resolutions - you will be prompted during transfers to resolve conflicts. #1455
   * Upload as page blobs - you can choose whether or not AzCopy uploads .vhd and .vhdx files as page blobs. #1164 and #1601
   * Configurable AzCopy parameters - Several settings have been added to tune AzCopy's performance and resource usage. See more details below.

* To enable ADLS Gen2 and Blobs multi-protocol access and further enhance ADLS Gen2 experiences, we have added the following features for the ADLS Gen2 accounts:
   * Search using friendly names to set ACL permissions
   * View hidden containers, such as $logs and $web
   * Acquire and break container lease
   * Acquire and break Blob lease #848
   * Manage container access policies
   * Configure Blob access tiers
   * Copy & Paste Blobs

* In this release, we are previewing 17 additional languages. You can switch to a language of your choice on the settings page under "Application" → "Regional Settings" → "Language (Preview)". We are still working hard on translating additional strings and improving the translation quality. Should you have any feedback regarding a translation, or if you notice a string which is not yet translated, please [open an issue on GitHub](https://github.com/microsoft/AzureStorageExplorer/issues/new?assignees=&labels=%F0%9F%8C%90%20localization&template=bug-report.md&title=).
* In every release, we try to onboard a few settings to enable fine turning Storage Explorer. In this release, we added settings to further configure AzCopy as well as to hide service nodes:
   * AzCopy bandwidth limit - helps control how much of the network AzCopy uses. You can find this setting at "Transfers" → "AzCopy" → "Maximum transfer rate". #1099
   * AzCopy MD5 check - lets you configure if and how strictly AzCopy checks for MD5 hashes on download. You can find this setting at "Transfers" → "AzCopy" → "Check MD5".
   * AzCopy concurrency and memory buffer size - by default AzCopy will analyze your machine to determine reasonable default values for these settings. But if you run into performance problems, these advanced settings can be used to further tailor how AzCopy runs on your computer. You can find these settings under "Transfers" → "AzCopy". #994
   * Display and hide service nodes - these settings give you the options to display or hide any of the Azure services that Storage Explorer supports. You can find these settings under the "Services" section. #1877

* When creating a Snapshot of a Managed Disk, a default name is now provided. #1847
* When attaching with Azure AD, if you attach an ADLS Gen2 Blob container, then "(ADLS Gen2)" will be shown next to the node. #1861

### Fixes
* When copying, uploading, or downloading large Disks, Storage Explorer would sometimes fail to revoke access to the disks involved in the operation. This has been fixed. #2048
* Table statistics failed when viewing a partition key query. This has been fixed. #1886

### Known Issues
* Storage Explorer 1.11.0 now requires a DFS endpoint (such as "myaccount.dfs.core.windows.net") to attach to ADLS Gen2 containers. Previous versions of Storage Explorer allowed you to use a blob endpoint. These attachments may no longer work after upgrading to 1.11.0. If you encounter this problem, reattach using the DFS endpoint.
* Numeric settings are not checked for whether they lie in a valid range.#2140
* Copying blob containers from one storage account to another in the tree view may fail. We are investigating the issue.#2124
* The Auto Refresh setting does not yet affect all operations in the Blob Explorer.
* Managed Disk features are not supported in Azure Stack.
* If a Disk upload or paste fails and a new Disk was created prior to the failure, Storage Explorer will not delete the Disk for you.
* Depending on when you cancel a Disk upload or paste, it is possible to leave the new Disk in a corrupted state. If this happens, you either need to delete the new Disk, or manually call the Disk APIs to replace the contents of the Disk such that it is no longer corrupted.
* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
   * ADLS Gen2
   * Managed Disks
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* Running Storage Explorer on Linux requires certain dependencies to be installed first. Check the Storage Explorer [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#linux-dependencies) for more information.

## Previous releases

* [Version 1.10.1](#version-1101)
* [Version 1.10.0](#version-1100)
* [Version 1.9.0](#version-190)
* [Version 1.8.1](#version-181)
* [Version 1.8.0](#version-180)
* [Version 1.7.0](#version-170)
* [Version 1.6.2](#version-162)
* [Version 1.6.1](#version-161)
* [Version 1.6.0](#version-160)
* [Version 1.5.0](#version-150)
* [Version 1.4.4](#version-144)
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

## Version 1.10.1
9/19/2019

### Hotfix
* Some users encountered an error in 1.10.0 while attempting to view their data in their ADLS Gen 1 accounts. This error prevented the explorer panel from rendering properly. This has been fixed. #1853 #1865

### New
* Storage Explorer now has a dedicated Settings UI. You can access it either from Edit → Settings, or by clicking on the Settings icon (the gear) in the left-hand vertical toolbar. This feature is the first step we're taking towards providing a variety of [user requested settings](https://github.com/microsoft/AzureStorageExplorer/labels/%3Abulb%3A%20setting%20candidate). Starting in this release the following settings are supported:
  * Theme
  * Proxy
  * Logout on exit #6
  * Enable device code flow sign-in
  * Auto refresh #1526
  * Enable AzCopy
  * AzCopy SAS duration
If there are other settings you would like to see added, please [open an issue on GitHub](https://github.com/microsoft/AzureStorageExplorer/issues/new?assignees=&labels=%3Abulb%3A%20setting%20candidate&template=feature_request.md&title=) describing the setting you want to see.
* Storage Explorer now supports Managed Disks. You can:
  * Upload an on-premises VHD to a new Disk
  * Download a Disk
  * Copy and paste disks across resource groups and regions
  * Delete Disks
  * Create a Snapshot of a Disk

The uploading, downloading, and cross-region copying of disks are powered by AzCopy v10.
* Storage Explorer can now be installed via the Snap store on Linux. When you install via the Snap store, all dependencies are installed for you, including .NET Core! Currently we have verified that Storage Explorer runs well on Ubuntu and CentOS. If you encounter issues installing from the Snap store on other Linux distros, please [open an issue on GitHub](https://github.com/microsoft/AzureStorageExplorer/issues/new?assignees=&labels=snaps&template=bug-report.md&title=). To learn more about installing from the Snap store, see our [getting started guide](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer?tabs=linux). #68
* Two major changes have been made to attach with Azure Active Directory (Azure AD) which are intended to make the feature more useful for ADLS Gen2 users:
  * You now select the tenant that the resource you are attaching is in. This means that you no longer need to have RBAC access to the resource's subscription.
  * If you are attaching an ADLS Gen2 Blob Container, you can now attach to a specific path in the container.
* When managing ACLs for ADLS Gen2 files and folders, Storage Explorer will now show the friendly names for entities in the ACL. #957
* When adding via OID to an ADLS Gen2 ACL, Storage Explorer will now validate that the OID belongs to a valid entity in your tenant. #1603
* The keyboard shortcuts for navigating between tabs now use more standard key combinations. #1018
* Middle clicking on a tab will now close it. #1348
* If an AzCopy transfer contains skips and no failures, Storage Explorer will now show a warning icon to highlight that skips occurred. #1490
* The integrated AzCopy has been updated to version 10.2.1. Additionally, you can now view the version of AzCopy installed in the About dialog. #1343

### Fixes
* Many users have run into various "cannot read version of undefined" or "cannot read connection of undefined" errors when working with attached Storage Accounts. Although we are still continuing to investigate the root cause of this issue, in 1.10.0 we have improved the error handling around loading attached Storage Accounts. #1626, #985, and #1532
* It was possible for the explorer tree (left-hand side) to get into a state where focus would jump to the top node repeatedly. This has been fixed. #1596
* When managing a blob's snapshots, screen readers would not read the timestamp associated with the snapshot. This has been fixed. #1202
* Proxy setting on macOS were not being set in time for the authentication process to use them. This has been fixed. #1567
* If a Storage Account in a sovereign cloud was attached using name and key, AzCopy would not work. This has been fixed. #1544
* When attaching via a connection string, Storage Explorer will now remove trailing spaces. #1387

### Known Issues
* The Auto Refresh setting does not yet affect all operations in the Blob Explorer.
* Managed Disk features are not supported in Azure Stack.
* If a Disk upload or paste fails and a new Disk was created prior to the failure, Storage Explorer will not delete the Disk for you.
* Depending on when you cancel a Disk upload or paste, it is possible to leave the new Disk in a corrupted state. If this happens, you either need to delete the new Disk, or manually call the Disk APIs to replace the contents of the Disk such that it is no longer corrupted.
* Depending on when you cancel a Disk upload or paste, it is possible to leave the new Disk in a corrupted state. If this happens, you either need to delete the new Disk, or manually call the Disk APIs to replace the contents of the Disk such that it is no longer corrupted.
* When performing a non-AzCopy Blob download, the MD5 for large files is not being verified. This is due to a bug in the Storage SDK. [#1212](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1212)
* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
   * ADLS Gen2
   * Managed Disks
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* Running Storage Explorer on Linux requires certain dependencies to be installed first. Check the Storage Explorer [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#linux-dependencies) for more information.


## Version 1.10.0
9/12/2019

### New

* Storage Explorer now has a dedicated Settings UI. You can access it either from Edit → Settings, or by clicking on the Settings icon (the gear) in the left-hand vertical toolbar. This feature is the first step we're taking towards providing a variety of [user requested settings](https://github.com/microsoft/AzureStorageExplorer/labels/%3Abulb%3A%20setting%20candidate). Starting in this release the following settings are supported:
    * Theme
    * Proxy
    * Logout on exit [#6](https://www.github.com/Microsoft/AzureStorageExplorer/issues/6)
    * Enable device code flow sign-in
    * Auto refresh [#1526](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1526)
    * Enable AzCopy
    * AzCopy SAS duration

    If there are other settings you would like to see added, please [open an issue on GitHub describing the setting you want to see](https://github.com/microsoft/AzureStorageExplorer/issues/new?assignees=&labels=%3Abulb%3A%20setting%20candidate&template=feature_request.md&title=).
* Storage Explorer now supports Managed Disks. You can:
    * Upload an on-premises VHD to a new Disk
    * Download a Disk
    * Copy and paste disks across resource groups and regions
    * Delete Disks
    * Create a Snapshot of a Disk

    The uploading, downloading, and cross-region copying of disks are powered by AzCopy v10.
* Storage Explorer can now be installed via the Snap store on Linux. When you install via the Snap store, all dependencies are installed for you, including .NET Core! Currently we have verified that Storage Explorer runs well on Ubuntu and CentOS. If you encounter issues installing from the Snap store on other Linux distros, please [open an issue on GitHub](https://github.com/microsoft/AzureStorageExplorer/issues/new?assignees=&labels=snaps&template=bug-report.md&title=). To learn more about installing from the Snap store, see our [getting started guide](https://aka.ms/storageexplorer/snapinformation). [#68](https://www.github.com/Microsoft/AzureStorageExplorer/issues/68)
* Two major changes have been made to attach with Azure Active Directory (Azure AD) which are intended to make the feature more useful for ADLS Gen2 users:
        * You now select the tenant that the resource you are attaching is in. This means that you no longer need to have RBAC access to the resource's subscription.
        * If you are attaching an ADLS Gen2 Blob Container, you can now attach to a specific path in the container.
* When managing ACLs for ADLS Gen2 files and folders, Storage Explorer will now show the friendly names for entities in the ACL. [#957](https://www.github.com/Microsoft/AzureStorageExplorer/issues/957)
* When adding via OID to an ADLS Gen2 ACL, Storage Explorer will now validate that the OID belongs to a valid entity in your tenant. [#1603](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1603)
* The keyboard shortcuts for navigating between tabs now use more standard key combinations. [#1018](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1018)
* Middle clicking on a tab will now close it. [#1348](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1348)
* If an AzCopy transfer contains skips and no failures, Storage Explorer will now show a warning icon to highlight that skips occurred. [#1490](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1490)
* The integrated AzCopy has been updated to version 10.2.1. Additionally, you can now view the version of AzCopy installed in the About dialog. [#1343](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1343)

### Fixes

* Many users have run into various "cannot read version of undefined" or "cannot read connection of undefined" errors when working with attached Storage Accounts. Although we are still continuing to investigate the root cause of this issue, in 1.10.0 we have improved the error handling around loading attached Storage Accounts. [#1626](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1626), [#985](https://www.github.com/Microsoft/AzureStorageExplorer/issues/985), and [#1532](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1532)
* It was possible for the explorer tree (left-hand side) to get into a state where focus would jump to the top node repeatedly. This has been fixed. [#1596](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1596)
* When managing a blob's snapshots, screen readers would not read the timestamp associated with the snapshot. This has been fixed. [#1202](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1202)
* Proxy setting on macOS were not being set in time for the authentication process to use them. This has been fixed. [#1567](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1567)
* If a Storage Account in a sovereign cloud was attached using name and key, AzCopy would not work. This has been fixed. [#1544](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1544)
* When attaching via a connection string, Storage Explorer will now remove trailing spaces. [#1387](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1387)

### Known Issues

* The Auto Refresh setting does not yet affect all operations in the Blob Explorer.
* Managed Disk features are not supported in Azure Stack.
* If a Disk upload or paste fails and a new Disk was created prior to the failure, Storage Explorer will not delete the Disk for you.
* Depending on when you cancel a Disk upload or paste, it is possible to leave the new Disk in a corrupted state. If this happens, you either need to delete the new Disk, or manually call the Disk APIs to replace the contents of the Disk such that it is no longer corrupted.
* When performing a non-AzCopy Blob download, the MD5 for large files is not being verified. This is due to a bug in the Storage SDK. [#1212](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1212)
* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
   * ADLS Gen2
   * Managed Disks
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* Running Storage Explorer on Linux requires certain dependencies to be installed first. Check the Storage Explorer [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#linux-dependencies) for more information.

## Version 1.9.0
7/1/2019

### Download Azure Storage Explorer 1.9.0
- [Azure Storage Explorer 1.9.0 for Windows](https://go.microsoft.com/fwlink/?LinkId=708343)
- [Azure Storage Explorer 1.9.0 for Mac](https://go.microsoft.com/fwlink/?LinkId=708342)
- [Azure Storage Explorer 1.9.0 for Linux](https://go.microsoft.com/fwlink/?LinkId=722418)

### New

* You can now attach Blob containers via Azure AD (RBAC or ACL permissions). This feature is intended to help users who have access to containers but not the Storage Accounts that the containers are in. See our Getting Started Guide for more information on this feature.
* Acquire and break lease now work with RBAC. [#1354](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1354)
* Managing access policies and setting public access level now work with RBAC. [#1355](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1355)
* Deleting blob folders now work with RBAC. [#1450](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1450)
* Changing blob access tier now work with RBAC. [#1446](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1446)
* You can now quickly reset Quick Access via "Help" → "Reset". [#1327](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1327)

### Preview Features

* Device code flow sign in is now available to preview. To enable it, go to "Preview" → "Use Device Code Flow Sign-in". We encourage any users who have had issues with blank sign-in windows to try this feature, as it may prove to be a more reliable form of sign-in.
* Storage Explorer integrated with AzCopy is currently available to preview. To enable it, go to "Preview" → "Use AzCopy for Improved Blob Upload and Download". Blob transfers completed with AzCopy should be faster and more performant.

### Fixes

* Fixed being unable to load more than 50 subscriptions for one account. [#1416](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1416)
* Fixed the "Sign in" button not working on the infobar that appears when a direct link fails. [#1358](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1358)
* Fixed not being to upload .app files on macOS. [#1119](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1119)
* Fixed "Retry All" not working for a failed blob rename. [#992](https://www.github.com/Microsoft/AzureStorageExplorer/issues/992)
* Fixed "Cancel" not working while opening a blob. [#1464](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1464)
* Fixed multiple spelling and tooltip issues throughout the product. Many thanks to all who reported these issues! [#1303](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1303), [#1328](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1328), [#1329](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1329), [#1331](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1331), [#1336](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1336), [#1352](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1352), [#1368](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1368), [#1395](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1395)

### Known Issues

* When performing a non-AzCopy Blob download, the MD5 for large files is not being verified. This is due to a bug in the Storage SDK. [#1212](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1212)
* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Attempting to access ADLS Gen2 Blobs when behind a proxy may fail.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
   * ADLS Gen2
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* Running Storage Explorer on Linux requires certain dependencies to be installed first. Check the Storage Explorer [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#linux-dependencies) for more information.

## Version 1.8.1
5/13/2019

### Hotfixes
* In some cases, clicking "Load more" at the resource level would not return the next page of resources. This has been fixed. [#1359](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1359)
* On Windows, AzCopy downloads would fail if a single file or folder was being downloaded and the name of the file or folder had a character which was invalid for a Windows path. This has been fixed. [#1350](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1350)
* In extremely rare cases, while performing a rename of a File Share or a rename in a File Share, if the copies for the rename failed, or if Storage Explore was unable to confirm the success of the copies with Azure, there was the potential for Storage Explorer to delete the original files before the copy had finished. This has been fixed.

### New

* The integrated AzCopy version has been updated to version 10.1.0.
* Ctrl/Cmd+R can now be used to refresh the currently focused editor. [#1097](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1097)
* The Azure Stack Storage API version has been changed to 2017-04-17.
* The Manage Access Dialog for ADLS Gen2 will now keep the Mask in sync in a way similar to other POSIX permissions tools. The UI will also warn you if a change is made that causes the permissions of a user or group to exceed the bounds of the Mask. [#1253](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1253)
* For AzCopy uploads, the flag to calculate and set the MD5 hash is now enabled. [#1223](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1223)


### Preview Features

* Device code flow sign in is now available to preview. To enable it, go to "Preview" → "Use Device Code Flow Sign-in". We encourage any users who have had issues with blank sign-in windows to try this feature, as it may prove to be a more reliable form of sign-in.
* Storage Explorer integrated with AzCopy is currently available to preview. To enable it, go to "Preview" → "Use AzCopy for Improved Blob Upload and Download". Blob transfers completed with AzCopy should be faster and more performant.

### Fixes

* The Access Policies dialog will no longer set an expiry date on Storage Access Policies that do not have an expiry. [#764](https://www.github.com/Microsoft/AzureStorageExplorer/issues/764)
* Some changes have been made to the Generate SAS dialog to make sure Stored Access Policies are used correctly when generating a SAS. [#1269](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1269)
* When attempting to upload a non-512 byte aligned file to a page Blob, Storage Explorer will now expose a more relevant error. [#1050](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1050)
* Copying a Blob container which utilized a display name would fail. Now, the actual name of the Blob container is used. [#1166](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1166)
* Attempting to perform certain actions on an ADLS Gen2 folder which had unicode characters in its name would fail. All actions should now work. [#980](https://www.github.com/Microsoft/AzureStorageExplorer/issues/980)

### Known Issues

* When performing a non-AzCopy Blob download, the MD5 for large files is not being verified. This is due to a bug in the Storage SDK. [#1212](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1212)
* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Attempting to access ADLS Gen2 Blobs when behind a proxy may fail.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
   * ADLS Gen2
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* Running Storage Explorer on Linux requires certain dependencies to be installed first. Check the Storage Explorer [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#linux-dependencies) for more information.

## Version 1.8.0
5/1/2019

### New

* The integrated AzCopy version has been updated to version 10.1.0.
* Ctrl/Cmd+R can now be used to refresh the currently focused editor. [#1097](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1097)
* The Azure Stack Storage API version has been changed to 2017-04-17.
* The Manage Access Dialog for ADLS Gen2 will now keep the Mask in sync in a way similar to other POSIX permissions tools. The UI will also warn you if a change is made that causes the permissions of a user or group to exceed the bounds of the Mask. [#1253](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1253)
* For AzCopy uploads, the flag to calculate and set the MD5 hash is now enabled. [#1223](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1223)


### Preview Features

* Device code flow sign in is now available to preview. To enable it, go to "Preview" → "Use Device Code Flow Sign-in". We encourage any users who have had issues with blank sign-in windows to try this feature, as it may prove to be a more reliable form of sign-in.
* Storage Explorer integrated with AzCopy is currently available to preview. To enable it, go to "Preview" → "Use AzCopy for Improved Blob Upload and Download". Blob transfers completed with AzCopy should be faster and more performant.

### Fixes

* The Access Policies dialog will no longer set an expiry date on Storage Access Policies that do not have an expiry. [#764](https://www.github.com/Microsoft/AzureStorageExplorer/issues/764)
* Some changes have been made to the Generate SAS dialog to make sure Stored Access Policies are used correctly when generating a SAS. [#1269](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1269)
* When attempting to upload a non-512 byte aligned file to a page Blob, Storage Explorer will now expose a more relevant error. [#1050](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1050)
* Copying a Blob container which utilized a display name would fail. Now, the actual name of the Blob container is used. [#1166](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1166)
* Attempting to perform certain actions on an ADLS Gen2 folder which had unicode characters in its name would fail. All actions should now work. [#980](https://www.github.com/Microsoft/AzureStorageExplorer/issues/980)

### Known Issues

* When performing a non-AzCopy Blob download, the MD5 for large files is not being verified. This is due to a bug in the Storage SDK. [#1212](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1212)
* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Attempting to access ADLS Gen2 Blobs when behind a proxy may fail.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
   * ADLS Gen2
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* Running Storage Explorer on Linux requires certain dependencies to be installed first. Check the Storage Explorer [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting?tabs=1804#linux-dependencies) for more information.

## Version 1.7.0
3/5/2019

### Download Azure Storage Explorer 1.7.0
- [Azure Storage Explorer 1.7.0 for Windows](https://go.microsoft.com/fwlink/?LinkId=708343)
- [Azure Storage Explorer 1.7.0 for Mac](https://go.microsoft.com/fwlink/?LinkId=708342)
- [Azure Storage Explorer 1.7.0 for Linux](https://go.microsoft.com/fwlink/?LinkId=722418)

### New

* You can now change the owner and owning group when managing access for an ADLS Gen2 container, file, or folder.
* On Windows, updating Storage Explorer from within the product is now an incremental install. This should result in a faster update experience. If you prefer a clean install, then you can download the [installer](https://azure.microsoft.com/features/storage-explorer/) yourself and then install manually. #1089

### Preview Features

* Device code flow sign in is now available to preview. To enable it, go to "Preview" → "Use Device Code Flow Sign-in". We encourage any users who have had issues with blank sign-in windows to try this feature, as it may prove to be a more reliable form of sign-in. #938
* Storage Explorer integrated with AzCopy is currently available to preview. To enable it, go to "Preview" → "Use AzCopy for Improved Blob Upload and Download". Blob transfers completed with AzCopy should be faster and more performant.

### Fixes

* You can now choose the blob type you want to upload as when AzCopy is enabled. #1111
* Previously, if you had enabled static websites for an ADLS Gen2 Storage account and then attached it with name and key, Storage Explorer would not have detected that hierarchical namespace was enabled. This has been fixed. #1081
* In the blob editor, sorting by either retention days remaining or status was broken. This has been fixed. #1106
* After 1.5.0, Storage Explorer no longer waited for server side copies to finish before reporting success during a rename or copy & paste. This has been fixed. #976
* When using the experimental AzCopy feature, the command copied after clicking "Copy command to clipboard" was not always runnable on its own. Now, all commands needed to run the transfer manually will be copied. #1079
* Previously, ADLS Gen2 blobs were not accessible if you were behind a proxy. This was due to a bug in a new networking library used by the Storage SDK. In 1.7.0, an attempt to mitigate this issue has been made, but some people may continue to see issues. A full fix will be released in a future update. #1090
* In 1.7.0, the save file dialog now correctly remembers the last location you saved a file to. #16
* In the properties panel, the SKU tier of a Storage account was being shown as the account's kind. This has been fixed. #654
* Sometimes, it was impossible to break the lease of a blob, even if you entered the name of the blob correctly. This has been fixed. #1070

### Known Issues

* When using RBAC, Storage Explorer requires some management layer permissions in order to access your storage resources. See the [troubleshooting guide](https://docs.microsoft.com/azure/storage/common/storage-explorer-troubleshooting) for more info.
* Attempting to access ADLS Gen2 Blobs when behind a proxy may fail.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See #537 for more information.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. For more information, see #537.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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

## Version 1.6.2
1/9/2019

### Hotfixes
* In 1.6.1, entities added to ADLS Gen2 ACLs by ObjectId which were not users were always added as groups. Now, only groups are added as groups, and entities such as Enterprise Applications andService Principals are added as users. [#1049](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1049)
* If an ADLS Gen2 Storage account had no containers and was attached with name and key, then Storage Explorer would not detect that the Storage Account was ADLS Gen2. This has been fixed. [#1048](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1048)
* In 1.6.0, conflicts during copy and paste would not prompt for a resolution. Instead, the conflicted copy would simply fail. Now, on the first conflict, you will be asked how you would like it to be resolved. [#1014](https://www.github.com/Microsoft/AzureStorageExplorer/issues/1014)
* Due to API limitations, all validation of ObjectIds in the Manage Access dialog have been disabled. Validation will now only occur for user UPNs. [#954](https://www.github.com/Microsoft/AzureStorageExplorer/issues/954)
* In the ADLS Gen2 Manage Access dialog, the permissions for a group could not be modified. This has been fixed. [#958](https://www.github.com/Microsoft/AzureStorageExplorer/issues/958)
* Added drag and drop upload support to the ADLS Gen2 editor. [#953](https://www.github.com/Microsoft/AzureStorageExplorer/issues/953)
* The URL property in the properties dialog for ADLS Gen2 files and folders was sometimes missing a '/'. This has been fixed. [#960](https://www.github.com/Microsoft/AzureStorageExplorer/issues/960)
* If getting the current permissions for an ADLS Gen2 container, file, or folder fails, then the error is now propertly displayed in the activity log. [#965](https://www.github.com/Microsoft/AzureStorageExplorer/issues/965)
* The temporary path created for opening files has been shortened to reduce the chance of creating a path which is longer than MAX_PATH on Windows. [#93](https://www.github.com/Microsoft/AzureStorageExplorer/issues/93)
* The Connect dialog now correctly appears when there are no signed in users and no resources have been attached. [#944](https://www.github.com/Microsoft/AzureStorageExplorer/issues/944)
* In 1.6.0, saving properties for non-HNS Blobs and Files would encode the value of every property. This resulted in unnecessary encoding of values which only contained ASCII characters. Now, values will only be encoded if they contain non-ASCII characters. [#986](https://www.github.com/Microsoft/AzureStorageExplorer/issues/986)
* Uploading a folder to a non-HNS Blob container would fail if a SAS was used and the SAS did not have read permissions. This has been fixed. [#970](https://www.github.com/Microsoft/AzureStorageExplorer/issues/970)
* Canceling an AzCopy transfer did not work. This has been fixed. [#943](https://www.github.com/Microsoft/AzureStorageExplorer/issues/943)
* AzCopy would fail when trying to download a folder from an ADLS Gen2 Blob container if the folder had spaces in its name. This has been fixed. [#990](https://www.github.com/Microsoft/AzureStorageExplorer/issues/990)
* The CosmosDB editor was broken in 1.6.0. It is now fixed. [#950](https://www.github.com/Microsoft/AzureStorageExplorer/issues/950)
        
### New

* You can now use Storage Explorer to access your Blob data via [RBAC](https://go.microsoft.com/fwlink/?linkid=2045904&clcid=0x409). If you are signed in and Storage Explorer is unable to retrieve the keys for your Storage account, then an OAuth token will be used to authenticate when interacting with your data.
* Storage Explorer now supports ADLS Gen2 Storage accounts. When Storage Explorer detects that hierarchical namespace is enabled for a Storage account, you will see "(ADLS Gen2 Preview)" next to the name of your Storage account. Storage Explorer is able to detect whether or not hierarchical namespace is enabled when you are signed in, or if you have attached your Storage Account with name and  key. For ADLS Gen2 Storage accounts, you can use Storage Explorer to:
  * Create and delete containers
  * Manage container properties and permissions (left-hand side)
  * View and navigate data inside of containers
  * Create new folders
  * Upload, download, rename, and delete files and folders
  * Manage file and folder properties and permissions (right-hand side).
	
	Other typical Blob features, such as Soft Delete, and Snapshots, are not currently available. Managing permissions is also only available when signed in. Additionally, when working in an ADLS Gen2 Storage account, Storage Explorer will use AzCopy for all uploads and downloads and default to using name and key credentials for all operations if available.
* After strong user feedback, break lease can once again be used to break leases on multiple blobs at once.

### Known Issues

* When downloading from an ADLS Gen2 Storage account, if one of the files being transferred already exists, then AzCopy will sometimes crash. This will be fixed in an upcoming hotfix.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. For more information, see #537.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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

## Version 1.6.1
12/18/2018

### Hotfixes
* Due to API limitations, all validation of ObjectIds in the Manage Access dialog have been disabled. Validation will now only occur for user UPNs. [#954](https://www.github.com/Microsoft/AzureStorageExplorer/issues/954)
* In the ADLS Gen2 Manage Access dialog, the permissions for a group could not be modified. This has been fixed. [#958](https://www.github.com/Microsoft/AzureStorageExplorer/issues/958)
* Added drag and drop upload support to the ADLS Gen2 editor. [#953](https://www.github.com/Microsoft/AzureStorageExplorer/issues/953)
* The URL property in the properties dialog for ADLS Gen2 files and folders was sometimes missing a '/'. This has been fixed. [#960](https://www.github.com/Microsoft/AzureStorageExplorer/issues/960)
* If getting the current permissions for an ADLS Gen2 container, file, or folder fails, then the error is now propertly displayed in the activity log. [#965](https://www.github.com/Microsoft/AzureStorageExplorer/issues/965)
* The temporary path created for opening files has been shortened to reduce the chance of creating a path which is longer than MAX_PATH on Windows. [#93](https://www.github.com/Microsoft/AzureStorageExplorer/issues/93)
* The Connect dialog now correctly appears when there are no signed in users and no resources have been attached. [#944](https://www.github.com/Microsoft/AzureStorageExplorer/issues/944)
* In 1.6.0, saving properties for non-HNS Blobs and Files would encode the value of every property. This resulted in unnecessary encoding of values which only contained ASCII characters. Now, values will only be encoded if they contain non-ASCII characters. [#986](https://www.github.com/Microsoft/AzureStorageExplorer/issues/986)
* Uploading a folder to a non-HNS Blob container would fail if a SAS was used and the SAS did not have read permissions. This has been fixed. [#970](https://www.github.com/Microsoft/AzureStorageExplorer/issues/970)
* Canceling an AzCopy transfer did not work. This has been fixed. [#943](https://www.github.com/Microsoft/AzureStorageExplorer/issues/943)
* AzCopy would fail when trying to download a folder from an ADLS Gen2 Blob container if the folder had spaces in its name. This has been fixed. [#990](https://www.github.com/Microsoft/AzureStorageExplorer/issues/990)
* The CosmosDB editor was broken in 1.6.0. It is now fixed. [#950](https://www.github.com/Microsoft/AzureStorageExplorer/issues/950)
        
### New

* You can now use Storage Explorer to access your Blob data via [RBAC](https://go.microsoft.com/fwlink/?linkid=2045904&clcid=0x409). If you are signed in and Storage Explorer is unable to retrieve the keys for your Storage account, then an OAuth token will be used to authenticate when interacting with your data.
* Storage Explorer now supports ADLS Gen2 Storage accounts. When Storage Explorer detects that hierarchical namespace is enabled for a Storage account, you will see "(ADLS Gen2 Preview)" next to the name of your Storage account. Storage Explorer is able to detect whether or not hierarchical namespace is enabled when you are signed in, or if you have attached your Storage Account with name and  key. For ADLS Gen2 Storage accounts, you can use Storage Explorer to:
  * Create and delete containers
  * Manage container properties and permissions (left-hand side)
  * View and navigate data inside of containers
  * Create new folders
  * Upload, download, rename, and delete files and folders
  * Manage file and folder properties and permissions (right-hand side).
	
	Other typical Blob features, such as Soft Delete, and Snapshots, are not currently available. Managing permissions is also only available when signed in. Additionally, when working in an ADLS Gen2 Storage account, Storage Explorer will use AzCopy for all uploads and downloads and default to using name and key credentials for all operations if available.
* After strong user feedback, break lease can once again be used to break leases on multiple blobs at once.

### Known Issues

* When downloading from an ADLS Gen2 Storage account, if one of the files being transferred already exists, then AzCopy will sometimes crash. This will be fixed in an upcoming hotfix.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. For more information, see #537.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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

## Version 1.6.0
12/5/2018

### New

* You can now use Storage Explorer to access your Blob data via [RBAC](https://go.microsoft.com/fwlink/?linkid=2045904&clcid=0x409). If you are signed in and Storage Explorer is unable to retrieve the keys for your Storage account, then an OAuth token will be used to authenticate when interacting with your data.
* Storage Explorer now supports ADLS Gen2 Storage accounts. When Storage Explorer detects that hierarchical namespace is enabled for a Storage account, you will see "(ADLS Gen2 Preview)" next to the name of your Storage account. Storage Explorer is able to detect whether or not hierarchical namespace is enabled when you are signed in, or if you have attached your Storage Account with name and  key. For ADLS Gen2 Storage accounts, you can use Storage Explorer to:
  * Create and delete containers
  * Manage container properties and permissions (left-hand side)
  * View and navigate data inside of containers
  * Create new folders
  * Upload, download, rename, and delete files and folders
  * Manage file and folder properties and permissions (right-hand side).
	
	Other typical Blob features, such as Soft Delete, and Snapshots, are not currently available. Managing permissions is also only available when signed in. Additionally, when working in an ADLS Gen2 Storage account, Storage Explorer will use AzCopy for all uploads and downloads and default to using name and key credentials for all operations if available.
* After strong user feedback, break lease can once again be used to break leases on multiple blobs at once.

### Known Issues

* When downloading from an ADLS Gen2 Storage account, if one of the files being transferred already exists, then AzCopy will sometimes crash. This will be fixed in an upcoming hotfix.
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. For more information, see #537.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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

## Version 1.5.0
10/29/2018

### New

* You can now use [AzCopy v10 (Preview)](https://github.com/Azure/azure-storage-azcopy) for uploading and downloading Blobs. To enable this feature go to the "Experimental" menu and then click "Use AzCopy for Improved Blob Upload and Download". When enabled, AzCopy will be used in the following scenarios:
   * Upload of folders and files to blob containers, either via the toolbar or drag and drop.
   * Downloading of folders and files, either via the toolbar or context menu.

* Additionally, when using AzCopy:
   * You can copy the AzCopy command used to execute the transfer to your clipboard. Simply click "Copy AzCopy Command to Clipboard" in the activity log.
   * You will need to refresh the blob editor manually after uploading.
   * Uploading files to append blobs is not supported, and vhd files will be uploaded as page blobs, and all other files will be uploaded as block blobs.
   * Errors and conflicts that occur during upload or download will not be surfaced until after an upload or download is finished.

Finally, support for using AzCopy with File Shares will be coming in the future.
* Storage Explorer is now using Electron version 2.0.11.
* Breaking leases can now only be performed on one blob at a time. Additionally, you have to enter the name of the blob whose lease you are breaking. This change was made to reduce the likelihood of accidentally breaking a lease, especially for VMs. #394
* If you ever encounter sign-in issues, you can now try resetting authentication. Go to the "Help" menu and click "Reset" to access this capability. #419

### Fix

* After strong user feedback, the default emulator node has been re-enabled. You can still add additional emulator connections via the Connect dialog, but if your emulator is configured to use the default ports you can also use the "Emulator * Default Ports" node under "Local & Attached/Storage Accounts". #669
* Storage Explorer will no longer let you set blob metadata values which have leading or trailing whitespace. #760
* The "Sign In" button was always enabled on same pages of the Connect dialog. It is now disabled when appropriate. #761
* Quick Access will no longer generate an error in the console when no Quick Access items have been added.

### Known Issues

* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. For more information, see #537.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, comment on this issue.
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron. To work around this issue when uploading to or downloading from a blob container, you can use the experimental AzCopy feature.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Azure Stack does not support the following features. Attempting to use these features while working with Azure Stack resources may result in unexpected errors.
   * File shares
   * Access tiers
   * Soft Delete
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
	./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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


## Version 1.4.4
10/15/2018

### Hotfixes
* The Azure Resource Management API Version has been rolled back to unblock Azure US Government users. [#696](https://github.com/Microsoft/AzureStorageExplorer/issues/696)
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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

## Version 1.4.3
10/11/2018

### Hotfixes
* The Azure Resource Management API Version has been rolled back to unblock Azure US Government users. [#696](https://github.com/Microsoft/AzureStorageExplorer/issues/696)
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* Update Azure Resource Management API Version to 2018-07-01 to add support for new Azure Storage Account kinds. [#652](https://github.com/Microsoft/AzureStorageExplorer/issues/652)

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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* Detaching from a resource attached via SAS URI, such as a blob container, may cause an error that prevents other attachments from showing up correctly. To work around this issue, just refresh the group node. See [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/537) for more information.
* If you use VS for Mac and have ever created a custom AAD configuration, you may be unable to sign-in. To work around the issue, delete the contents of ~/.IdentityService/AadConfigurations. If doing so does not unblock you, please comment on [this issue](https://github.com/Microsoft/AzureStorageExplorer/issues/97).
* Azurite has not yet fully implemented all Storage APIs. Because of this, there may be unexpected errors or behavior when using Azurite for development storage.
* In rare cases, the tree focus may get stuck on Quick Access. To unstick the focus, you can Refresh All.
* Uploading from your OneDrive folder does not work because of a bug in NodeJS. The bug has been fixed, but not yet integrated into Electron.
* When targeting Azure Stack, uploading certain files as append blobs may fail.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
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

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* Storage Explorer now supports Access Tiers for Blob Only and GPV2 Storage Accounts. Learn more about Access Tiers [here](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers).
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* If you are running into TLS/SSL Certificate issues and are unable to find the offending certificate, you can now launch Storage Explorer from the command line with the `--ignore-certificate-errors` flag. When launched with this flag, Storage Explorer will ignore TLS/SSL certificate errors.
* There is now a 'Download' option in the context menu for blob and file items.
* Improved accessibility and screen reader support. If you rely on accessibility features, see our [accessibility documentation](https://docs.microsoft.com/azure/vs-azure-tools-storage-explorer-accessibility) for more information.
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* The Electron shell used by Storage Explorer has trouble with some GPU (graphics processing unit) hardware acceleration. If Storage Explorer is displaying a blank (empty) main window, you can try launching Storage Explorer from the command line and disabling GPU acceleration by adding the `--disable-gpu` switch:

    ```
    ./StorageExplorer.exe --disable-gpu
    ```

* For Linux users, you will need to install [.NET Core 2.0](https://dotnet.microsoft.com/download/dotnet-core/2.0).
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described [here](https://github.com/Azure/azure-storage-node/issues/317).
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
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
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is because we are using the cancel filter work around described here.
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

* Buttons on the delete folder confirmation dialog don't register with the mouse clicks on Linux. work around is to use the Enter key
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
* Fixed: Open in Portal now works with Azure China 21Vianet, Azure Germany, Azure US Government, and Azure Stack
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
* You can now add trusted Base-64 encoded X.509 TLS/SSL certificates by going to Edit -&gt; SSL Certificates -&gt; Import Certificates

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
* You can now sign-in to Azure China 21Vianet, Azure Germany, and Azure US Government accounts.
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
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename
* Copying or renaming resources does not work within SAS-attached accounts

07/07/2016
### Version 0.8.2

>[!VIDEO https://www.youtube.com/embed/nYgKbRUNYZA?ecver=1]

#### New

* Storage Accounts are grouped by subscriptions; development storage and resources attached via key or SAS are shown under (Local and Attached) node
* Sign out from accounts in "Azure Account Settings" panel
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
* Add Storage Accounts for Azure China 21Vianet
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
