---
title: Microsoft Azure Storage Explorer 0.8.7 (Preview)| Microsoft Docs
description: Release notes for Microsoft Azure Storage Explorer 0.8.7 (Preview)
services: storage
documentationcenter: na
author: cawa
manager: paulyuk
editor: ''

ms.assetid:
ms.service: storage
ms.devlang: multiple
ms.topic: release-notes
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/18/2017
ms.author: cawa

---
# Microsoft Azure Storage Explorer 0.8.7 (Preview)
## Overview
This article contains the release notes for Azure Storage Explorer 0.8.7 preview release.

[Microsoft Azure Storage Explorer (Preview)](./vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that enables you to easily work with Azure Storage data on Windows, macOS, and Linux.

## Azure Storage Explorer 0.8.7 (Preview)
### Download Azure Storage Explorer 0.8.7 (Preview)
- [Azure Storage Explorer 0.8.7 Preview for Windows](https://go.microsoft.com/fwlink/?LinkId=708343)
- [Azure Storage Explorer 0.8.7 Preview for Mac](https://go.microsoft.com/fwlink/?LinkId=708342)
- [Azure Storage Explorer 0.8.7 Preview for Linux](https://go.microsoft.com/fwlink/?LinkId=722418)

### New updates
* You can choose how to resolve conflicts at the beginning of an update, download, or copy session in the **Activities** window.
* Hover over a tab to see the full path of the storage resource.
* When you click a tab, it synchronizes with its location in the left side navigation pane.

### Fixes
* Fixed: Storage Explorer is now a trusted app on macOS.
* Fixed: Ubuntu 14.04 is again supported.
* Fixed: Sometimes the Add Account UI flashes when loading subscriptions.
* Fixed: Sometimes not all storage resources were listed in the left-side navigation pane.
* Fixed: The action pane sometimes displayed empty actions.
* Fixed: The window size from the last closed session is now retained.
* Fixed: You can open multiple tabs for the same resource using the context menu.

### Known Issues
* Quick Access works only with subscription-based items. Local resources or resources attached via key or SAS token are not supported in this release.
* It may take Quick Access a few seconds to navigate to the target resource, depending on how many resources you have.
* Having more than three groups of blobs or files uploading at the same time may cause errors.
* Search handles searching across roughly 50,000 nodes - after this, performance may be impacted or may cause unhandled exceptions.
* For the first time using the Storage Explorer on macOS, you might see multiple prompts asking for user's permission to access the keychain. We suggest you select **Always Allow** so the prompt doesn't display again

## Previous releases
### Features
#### Main features
* macOS, Linux, and Windows versions
* Sign in to view your Storage Accounts grouped by subscription:
    * Use your Org Account, Microsoft Account, 2FA, etc.
    * Configure and manage proxy settings
    * Remove accounts by signing out
* Connect to Storage Accounts using:
    * Account name and Key
    * Custom endpoints (including Azure China)
    * SAS URI for Storage Accounts
* Azure Resource Manager and Classic Storage support
* Generate SAS keys for blobs, blob containers, queues, tables, or file shares
* Connect to blob containers, queues, tables, or file shares with Shared Access Signatures (SAS) key
* Manage Stored Access Policies for blob containers, queues, tables, or file shares
* Local development storage with Storage Emulator (Windows-only)
* Create and delete blob containers, queues, or tables
* View $logs blob containers and $metrics tables
* Search for specific blobs, queues, tables, or file shares
* Direct links to storage accounts or containers, queues, tables, or file shares for sharing and easily accessing your resources
* Rename blob containers, tables, file shares
* Ability to manage and configure CORS rules
* Easily copy primary and secondary key for Storage Accounts
* MD5 checks on upload and download for data integrity and consistency
* Search for your blob containers, tables, queues, file shares, or storage accounts from the search box
* You can now pin most frequently used services to the Quick Access for easy navigation
* You can now open multiple editors in different tabs. Single click to open a temporary tab; double-click to open a permanent tab. You can also click the temporary tab to make it a permanent tab
* Noticeable performance and stability improvements for uploads and downloads, especially for large files on fast machines
* We are reintroducing the enhanced scoped search and added the concept of scoping. Enter the path to a node via the hover icon, right click -> "Search From Here", or manually to scope that node. Once scoped, you can add a search term to the end of the path to deep search starting from that node
* We have added various themes: Light (default), Dark, High Contrast Black, and High Contrast White.
* Go to Edit -> Themes to change your theming preference
* On Linux, a 64-bit OS is now required
* We have updated our logo!
#### Blobs
* View blobs and navigate through directories
* Upload, download, delete, and copy blobs and folders
* Open and view the contents text and picture blobs
* View and edit blob properties and metadata
* Search for blobs by prefix
* Create and break leases for blobs and blob containers
* Drag ‘n drop files to upload
* Rename blobs and folders
* Empty "virtual" folders can now be created in blob containers
* You can modify the Blob and file properties
#### Tables
* View and query entities with ODATA or use query builder to create complex queries
* Add, edit, delete entities
* Import and export table contents in CSV format (including exporting query results)
* Customize column order
* Ability to save queries
#### Queues
* Peek most recent 32 messages
* Add, dequeue, view messages
* Clear queue
* We made it possible for you to decide whether you want to encode/decode your queue messages
#### File Shares
* View files and navigate through directories
* Upload, download, delete, and copy files and directories
* View file properties
* Rename files and directories

### Bug fixes
* Fixed: Screen freezing problems
* Fixed: Enhanced security

### Known issues
* Search handles searching across roughly 50,000 nodes - after this, performance may be impacted
macOS install may require elevated permissions
* Account settings panel may show that you need to reenter credentials to filter subscriptions
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files, and entities are preserved during a rename
* Azure Stack doesn't currently support files, so trying to expand the **Files** node results in an error
* Linux 14.04 install needs gcc version updated or upgraded. The following steps illustrate how to upgrade:

```
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
```

### Previous versions
#### October 2016 release (version 0.8.5)
* [Download for Windows](https://go.microsoft.com/fwlink/?LinkId=809306)
* [Download for Mac](https://go.microsoft.com/fwlink/?LinkId=809307)
* [Download for Linux](https://go.microsoft.com/fwlink/?LinkId=809308)
