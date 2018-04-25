---
title: Azure Blockchain Workbench troubleshooting
description: How to troubleshoot a Azure Blockchain Workbench application.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 4/21/2018
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
---

# Azure Blockchain Workbench troubleshooting

A PowerShell script is available to assist with developer debugging or support. The script generates a summary and collects detailed logs for troubleshooting. Collected logs include:

* Blockchain network, such as Ethereum
* Blockchain Workbench microservices
* Application Insights
* Azure Monitoring (OMS)

You can use the information to determine next steps and determine root cause of issues. 

## Troubleshooting script

The PowerShell troubleshooting script is available on GitHub. [Download a zip file](https://github.com/Azure-Samples/blockchain-powershell/archive/master.zip) or clone the sample from GitHub.

```
git clone https://github.com/Azure-Samples/blockchain-powershell.git
```

## Run the script
[!INCLUDE [sample-powershell-install](../../includes/sample-powershell-install.md)]

Run the `collectBlockchainWorkbenchTroubleshooting.ps1` script to collect logs and create a ZIP file containing a folder of troubleshooting information. For example:

``` powershell
collectBlockchainWorkbenchTroubleshooting.ps1 -SubscriptionID "<subscription_id>" -ResourceGroupName "workbench-resource-group-name"
```
The script accepts the following parameters:

| Parameter  | Description | Required |
|---------|---------|----|
| SubscriptionID | SubscriptionID to create or locate all resources. | Yes |
| ResourceGroupName | Name of the Azure Resource Group where Blockchain Workbench has been deployed. | Yes |
| OutputDirectory | Path to create the output .ZIP file. If not specified, defaults to the current directory. | No
| OmsSubscriptionId | The subscription id where OMS is deployed. Only pass this parameter if the OMS for the blockchain network is deployed outside of Blockchain Workbench's resource group.| No |
| OmsResourceGroup |The resource group where OMS is deployed. Only pass this parameter if the OMS for the blockchain network is deployed outside of Blockchain Workbench's resource group.| No |
| OmsWorkspaceName | The OMS workspace name. Only pass this parameter if the OMS for the blockchain network is deployed outside of Blockchain Workbench's resource group | No |

## What is collected?

The output ZIP file contains the following folder structure:

| Folder \ File | Description  |
|---------|---------|
| \Summary.txt | Summary of the system |
| \metrics\blockchain | Metrics about the blockchain |
| \metrics\workbench | Metrics about the workbench |
| \details\blockchain | Detailed logs about the blockchain |
| \details\workbench | Detailed logs about the workbench |

The summary file gives you a snapshot of the overall state of the application and health of the application. The summary provides recommended actions, highlights top errors, and metadata about running services.

## Next steps

* [Azure Blockchain Workbench architecture](blockchain-workbench-architecture.md)