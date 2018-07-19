---
title: Download Azure Stack tools from GitHub | Microsoft Docs
description: Learn how to download tools required to work with Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2018
ms.author: mabrigg

---

# Download Azure Stack tools from GitHub

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

AzureStack-Tools is a GitHub repository that hosts PowerShell modules that you can use to manage and deploy resources to Azure Stack.

## Download targets

You can download and use these PowerShell modules to the Azure Stack Development Kit, or to a Windows-based external client that uses a VPN connection.

## How to get the tools

To get these tools, clone the AzureStack-Tools GitHub repository or download the AzureStack-Tools folder by running the following script:

```PowerShell
# Change directory to the root directory
cd \

# Download the tools archive
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
invoke-webrequest `
  https://github.com/Azure/AzureStack-Tools/archive/master.zip `
  -OutFile master.zip

# Expand the downloaded files
expand-archive master.zip `
  -DestinationPath . `
  -Force

# Change to the tools directory
cd AzureStack-Tools-master

```

## Functionalities provided by the modules

The AzureStack-Tools repository contains PowerShell modules that support the following functionalities for Azure Stack:

| Functionality | Description | Who can use this module? |
| --- | --- | --- |
| [Cloud capabilities](https://github.com/Azure/AzureStack-Tools/tree/master/CloudCapabilities) | Use this module to get the cloud capabilities of a cloud. For example, you can get the cloud capabilities such as API version, Azure Resource Manager resources, VM extensions etc. for Azure Stack and Azure clouds using this module. | Cloud administrators and users. |
| [Resource Manager policy for Azure Stack](azure-stack-policy-module.md) | Use this module to configure an Azure subscription or an Azure resource group with the same versioning and service availability as Azure Stack. | Cloud administrators and users |
| [Connecting to Azure Stack](azure-stack-connect-azure-stack.md) | Use this module to connect to an Azure Stack instance through PowerShell and to configure VPN connectivity to Azure Stack. | Cloud administrators and users |
| [Template validator](azure-stack-validate-templates.md) | Use this module to verify if an existing or a new template can be deployed to Azure Stack. | Cloud administrators and users |

## Next steps

- [Configure the Azure Stack user's PowerShell environment](azure-stack-powershell-configure-user.md)
- [Connect to Azure Stack Development Kit over a VPN](azure-stack-connect-azure-stack.md)
