---
title: Microsoft Azure Storage Explorer (Preview) release notes | Microsoft Docs
description: Release notes for Microsoft Azure Storage Explorer (Preview)
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
ms.date: 07/31/2017
ms.author: cawa

---
# Microsoft Azure Storage Explorer (Preview) release notes

This article contains the release notes for Azure Storage Explorer 0.8.16 (Preview) release, as well as release notes for previous versions.

[Microsoft Azure Storage Explorer (Preview)](./vs-azure-tools-storage-manage-with-storage-explorer.md) is a standalone app that enables you to easily work with Azure Storage data on Windows, macOS, and Linux.

## Version 0.8.16 (Preview)
8/21/2017

### Download Azure Storage Explorer 0.8.16 (Preview)
- [Azure Storage Explorer 0.8.16 (Preview) for Windows](https://go.microsoft.com/fwlink/?LinkId=708343)
- [Azure Storage Explorer 0.8.16 (Preview) for Mac](https://go.microsoft.com/fwlink/?LinkId=708342)
- [Azure Storage Explorer 0.8.16 (Preview) for Linux](https://go.microsoft.com/fwlink/?LinkId=722418)

### New
* When you open a blob, Storage Explorer will prompt you to upload the downloaded file if a change is detected
* Enhanced Azure Stack sign-in experience
* Improved the performance of uploading/downloading many small files at the same time


### Fixes
* For some blob types, choosing to "replace" during an upload conflict would sometimes result in the upload being restarted. 
* In version 0.8.15, uploads would sometimes stall at 99%.
* When uploading files to a file share, if you chose to upload to a directory which did not yet exist, your upload would fail.
* Storage Explorer was incorrectly generating time stamps for shared access signatures and table queries.


Known Issues
* Using a name and key connection string does not currently work. It will be fixed in the next release. Until then you can use attach with name and key.
* If you try to open a file with an invalid Windows file name, the download will result in a file not found error.
* After clicking "Cancel" on a task, it may take a while for that task to cancel. This is a limitation of the Azure Storage Node library.
* After completing a blob upload, the tab which initiated the upload is refreshed. This is a change from previous behavior, and will also cause you to be taken back to the root of the container you are in.
* If you choose the wrong PIN/Smartcard certificate, then you will need to restart in order to have Storage Explorer forget that decision.
* The account settings panel may show that you need to reenter credentials to filter subscriptions.
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account.
* For users on Ubuntu 14.04, you will need to ensure GCC is up to date - this can be done by running the following commands, and then restarting your machine:

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

## Version 0.8.14 (Preview)
06/22/2017

### Download Azure Storage Explorer 0.8.14 (Preview)
* [Download Azure Storage Explorer 0.8.14 (Preview) for Windows](https://go.microsoft.com/fwlink/?LinkId=809306)
* [Download Azure Storage Explorer 0.8.14 (Preview) for Mac](https://go.microsoft.com/fwlink/?LinkId=809307)
* [Download Azure Storage Explorer 0.8.14 (Preview) for Linux](https://go.microsoft.com/fwlink/?LinkId=809308)

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
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files and entities are preserved during a rename.
* Although Azure Stack doesn't currently support File Shares, a File Shares node still appears under an attached Azure Stack storage account. 
* Ubuntu 14.04 install needs gcc version updated or upgraded – steps to upgrade are below:

    ```
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```




## Previous releases

* [Version 0.8.13](#version-0813)
* [Version 0.8.12 / 0.8.11 / 0.8.10](#version-0812--0811--0810)
* [Version 0.8.9 / 0.8.8](#version-089--088)
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


### Version 0.8.13
05/12/2017

#### New

* Storage Explorer Troubleshooting [Guide][2]
* [Instructions][3] on connecting to an Azure Stack subscription

#### Fixes

* Fixed: File upload had a high chance of causing an out of memory error
* Fixed: You can now sign in with PIN/Smartcard
* Fixed: Open in Portal now works with Azure China, Azure Germany, Azure US Government, and Azure Stack
* Fixed: While uploading a folder to a blob container, an "Illegal operation" error would sometimes occur
* Fixed: Select all was disabled while managing snapshots
* Fixed: The metadata of the base blob might get overwritten after viewing the properties of its snapshots

#### Known Issues

* If you choose the wrong PIN/Smartcard certificate then you will need to restart in order to have Storage Explorer forget the decision
* While zoomed in or out, the zoom level may momentarily reset to the default level
* Having more than 3 groups of blobs or files uploading at the same time may cause errors
* The account settings panel may show that you need to reenter credentials in order to filter subscriptions
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account. 
* Ubuntu 14.04 install needs gcc version updated or upgraded – steps to upgrade are below:

    ```
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```


### Version 0.8.12 / 0.8.11 / 0.8.10
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
* Renaming blobs (individually or inside a renamed blob container) does not preserve snapshots. All other properties and metadata for blobs, files and entities are preserved during a rename.
* Although Azure Stack doesn't currently support Files Shares, a File Shares node still appears under an attached Azure Stack storage account. 
* Ubuntu 14.04 install needs gcc version updated or upgraded – steps to upgrade are below:

    ```
    sudo add-apt-repository ppa:ubuntu-toolchain-r/test
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get dist-upgrade
    ```


### Version 0.8.9 / 0.8.8
02/23/2017

<iframe width="560" height="315" src="https://www.youtube.com/embed/R6gonK3cYAc?ecver=1" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/SrRPCm94mfE?ecver=1" frameborder="0" allowfullscreen></iframe>


#### New

* Storage Explorer 0.8.9 will automatically download the latest version for updates.
* Hotfix: using a portal generated SAS URI to attach a storage account would result in an error.
* You can now create, manage, and promote blob snapshots.
* You can now sign in to Azure China, Azure Germany, and Azure US Government accounts.
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

<iframe width="560" height="315" src="https://www.youtube.com/embed/Me4Y4jxoer8?ecver=1" frameborder="0" allowfullscreen></iframe>

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

<iframe width="560" height="315" src="https://www.youtube.com/embed/cr5tOGyGrIQ?ecver=1" frameborder="0" allowfullscreen></iframe>

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

<iframe width="560" height="315" src="https://www.youtube.com/embed/HeGW-jkSd9Y?ecver=1" frameborder="0" allowfullscreen></iframe>

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

<iframe width="560" height="315" src="https://www.youtube.com/embed/nYgKbRUNYZA?ecver=1" frameborder="0" allowfullscreen></iframe>

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

<iframe width="560" height="315" src="https://www.youtube.com/embed/ycfQhKztSIY?ecver=1" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/k4_kOUCZ0WA?ecver=1" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/3zEXJcGdl_k?ecver=1" frameborder="0" allowfullscreen></iframe>

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

<iframe width="560" height="315" src="https://www.youtube.com/embed/imbgBRHX65A?ecver=1" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/ceX-P8XZ-s8?ecver=1" frameborder="0" allowfullscreen></iframe>


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
* Sign in to view your Storage Accounts – use your Org Account, Microsoft Account, 2FA, etc.
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