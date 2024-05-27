---
ms.assetid: 
title: Customizations on Azure Monitor SCOM Managed Instance management servers
description: This article describes about the Customizations on Azure Monitor SCOM Managed Instance management servers.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: concept-article
---

# Customizations on Azure Monitor SCOM Managed Instance management servers

Azure Monitor SCOM Managed Instance is a PaaS service hosted on Azure. As part of instance creation, Azure creates a Virtual machine scale set cluster and commissions VMs inside that Virtual machine scale set cluster. However, if you have a requirement to access the management server and customize some aspect of it, such as applying a post-deployment configuration, installing a Management Pack or software, or carry out any other management operation, use the [Script for Customization](https://download.microsoft.com/download/0/1/5/015ee8fc-e3ab-4842-8c2a-3acebb0e54f5/RunCustomizations.zip).

The script internally uses Azure custom script extensions for making the customizations. Once you run the script, it downloads and executes the customization script on the SCOM Managed Instance Management Servers.

## Requirements to run the script

- Azure CLI (Installed and Logged In)
- PowerShell 5.1 or later

You can run the script on a machine, which has PowerShell running. Sign into the Azure portal Microsoft account that is a part of the SCOM Managed Instance subscription. Run the following cmdlets in the PowerShell console:

```powershell
“az login”
“az account set –subscription “NameOf Subscription”
```

The script needs the following inputs:

|Input | Description |
|---|---|
| **ResourceGroupName** | The name of the resource group that contains the SCOM Managed Instance management servers Virtual machine scale set. |
| **VMSSName** | The name of the SCOM Managed Instance management servers Virtual machine scale set to apply customizations to. |
| **FileURI** | The parameter should point to an accessible URI where the PowerShell script to be executed is hosted. You can upload the customization script to sources such as Azure Blob Storage, GitHub, or any other platform that provides storage. For example, see https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/automate-iis.ps1. |
| **CommandToExecute** | This parameter specifies the command to execute the customization script file. For example, you can use a command such as: PowerShell `ExecutionPolicy Unrestricted -File automate-iis.ps1`. |

Here's an example of a command to run the script (replace the parameters in quotation marks with your own values):

```
.\RunCustomization.ps1 – ResourceGroupName “myResourceGroup” -VMSSName “myVMSS” -FileURI “https://example.com/myscript.ps1” -CommandToExecute “powershell.exe -ExecutionPolicy Unrestricted -File myscript.ps1”
```

If the script runs successfully, deployment gets successful and displays **Deployment finished Successfully** message.

If there's an error in the script, you see **An error occurred during deployment. Please check the above logs for debugging** message.

## Next steps

[Create a SCOM Managed Instance](create-operations-manager-managed-instance.md).