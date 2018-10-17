---
title: Download Azure Stack tools from GitHub | Microsoft Docs
description: Learn how to download tools that are required for working with Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: article
ms.date: 09/28/2018
ms.author: mabrigg
ms.reviewer: thoroet

---

# Download Azure Stack tools from GitHub

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

**AzureStack-Tools** is a [GitHub repository](https://github.com/Azure/AzureStack-Tools) that hosts PowerShell modules for managing and deploying resources to Azure Stack. If you are planning to establish VPN connectivity, you can download these PowerShell modules to the Azure Stack Development Kit, or to a Windows-based external client. To obtain these tools, clone the GitHub repository or download the **AzureStack-Tools** folder by running the following script:

```PowerShell
# Change directory to the root directory. 
cd \

# Download the tools archive.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 
invoke-webrequest `
  https://github.com/Azure/AzureStack-Tools/archive/master.zip `
  -OutFile master.zip

# Expand the downloaded files.
expand-archive master.zip `
  -DestinationPath . `
  -Force

# Change to the tools directory.
cd AzureStack-Tools-master

```

## Functionality provided by the modules

The **AzureStack-Tools** repository contains PowerShell modules that support the following functionalities for Azure Stack:  

| Functionality | Description | Who can use this module? |
| --- | --- | --- |
| [Cloud capabilities](user/azure-stack-validate-templates.md) | Use this module to get the cloud capabilities of a cloud. For example, by using this module, you can get the cloud capabilities such as API version and Azure Resource Manager resources. You can also get the VM extensions for Azure Stack and Azure clouds by using this module. | Cloud operators and users |
| [Resource Manager policy for Azure Stack](user/azure-stack-policy-module.md) | Use this module to configure an Azure subscription or an Azure resource group with the same versioning and service availability as Azure Stack. | Cloud operators and users |
| [Register with Azure](azure-stack-register.md) | Use this module to register your development kit instance with Azure. After registering, you can download the marketplace items from Azure and use them in Azure Stack. | Cloud operators |
| [Azure Stack deployment](azure-stack-run-powershell-script.md) | Use this module to prepare the Azure Stack host computer to deploy and redeploy by using the Azure Stack virtual hard disk (VHD) image. | Cloud operators|
| [Connecting to Azure Stack](azure-stack-connect-powershell.md) | Use this module to configure VPN connectivity to Azure Stack. | Cloud operators and users |
| [Template validator](user/azure-stack-validate-templates.md) | Use this module to verify if an existing or a new template can be deployed to Azure Stack. | Cloud operators and users|


## Next steps
* [Configure the Azure Stack user's PowerShell environment](user/azure-stack-powershell-configure-user.md)   
* [Connect to Azure Stack Development Kit over a VPN](azure-stack-connect-azure-stack.md)  
