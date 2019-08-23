---
 title: include file
 description: include file
 services: event-grid
 author: tfitzmac
 ms.service: event-grid
 ms.topic: include
 ms.date: 11/06/2018
 ms.author: tomfitz
 ms.custom: include file
---

This feature is in preview. To use it, you must install a preview extension or module.

### Install extension for Azure CLI

For Azure CLI, you need the [Event Grid extension](/cli/azure/azure-cli-extensions-list).

In [CloudShell](/azure/cloud-shell/quickstart):

* If you've installed the extension previously, update it `az extension update -n eventgrid`
* If you haven't installed the extension previously, install it `az extension add -n eventgrid`

For a local installation:

1. [Install the Azure CLI](/cli/azure/install-azure-cli). Make sure that you have the latest version, by checking with `az --version`.
1. Uninstall previous versions of the extension `az extension remove -n eventgrid`
1. Install the `eventgrid` extension with `az extension add -n eventgrid`

### Install module for PowerShell

For PowerShell, you need the [AzureRM.EventGrid module](https://www.powershellgallery.com/packages/AzureRM.EventGrid/0.4.1-preview).

In [CloudShell](/azure/cloud-shell/quickstart-powershell):

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
