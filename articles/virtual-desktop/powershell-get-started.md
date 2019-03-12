---
title: Get started with Windows Virtual Desktop Windows PowerShell cmdlets (preview)  - Azure
description: How to download and import the Windows Virtual Desktop PowerShell module to your PowerShell session.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: reference
ms.date: 03/21/2019
ms.author: helohr
---

# Get started with Windows Virtual Desktop Windows PowerShell cmdlets

Here you will find the resources for PowerShell modules targeting Windows Virtual Desktop (preview).

## Supported PowerShell versions

- Windows PowerShell 5.0 and 5.1

## Download

The Windows Virtual Desktop module (preview) is not yet located in the PowerShell Gallery. To download the Windows Virtual Desktop module:

1. Download the [Windows Virtual Desktop module](https://rdmipreview.blob.core.windows.net/preview/RDPowershell.zip?st=2019-02-18T19%3A04%3A00Z&se=2019-04-01T07%3A04%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=LY8yuQzKIMkaCFl0wgi0XboKefQHMW6lW1ZID%2BifqNw%3D) and save the package in a known location on your computer.
2. Find the downloaded package. Right-click the zip file, select **Properties**, select **Unblock**, then select **OK**. This will allow your system to trust the module.
3. Right-click the zip file, select **Extract all...**, choose a file location, then select **Extract**.

Keep the location of the extracted zip file handy.

## Import the module for your PowerShell session

To use the Windows Virtual Desktop PowerShell module, you must import it into your PowerShell session. To import the Windows Virtual Desktop, do the following two things.

First, run this cmdlet to save the file location of the extracted .zip file into a variable:

```powershell
$module = "<extracted-module-location>"
```

Second, run this cmdlet to import the DLL for the module:

```powershell
Import-Module $module\Microsoft.RDInfra.RDPowershell.dll
```

You can now run Windows Virtual Desktop cmdlets in your PowerShell window. If you close your PowerShell session, you'll have to import the module into your session again.
