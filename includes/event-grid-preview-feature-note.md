---
 title: include file
 description: include file
 services: event-grid
 author: spelluru
 ms.service: event-grid
 ms.topic: include
 ms.date: 11/06/2018
 ms.author: spelluru
 ms.custom: include file
---

This feature is in preview. To use it, you must install a preview extension or module.

### Install module for PowerShell

For PowerShell, you need the [AzureRM.EventGrid module](https://www.powershellgallery.com/packages/AzureRM.EventGrid/0.4.1-preview).

In [CloudShell](../articles/cloud-shell/quickstart-powershell.md):

* Install the module `Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery`

For a local installation:

1. Open PowerShell console as administrator
1. Install the module `Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery`

If the `-AllowPrerelease` parameter isn't available, use the following steps:

1. Run `Install-Module PowerShellGet -Force`
1. Run `Update-Module PowerShellGet`
1. Close the PowerShell console
1. Restart PowerShell as administrator
1. Install the module `Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery`