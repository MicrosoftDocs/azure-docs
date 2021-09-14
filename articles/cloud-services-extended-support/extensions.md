---
title: Extensions for Cloud Services (extended support) 
description: Extensions for Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Extensions for Cloud Services (extended support)

Extensions are small applications that provide post-deployment configuration and automation tasks on roles. For example, You can enable a Remote Desktop connection in your role during cloud service (extended support) deployment by using Remote Desktop Extension. 

## Key Vault Extension

The Key Vault VM extension provides automatic refresh of certificates stored in an Azure Key Vault. Specifically, the extension monitors a list of observed certificates stored in key vaults, and upon detecting a change, retrieves, and installs the corresponding certificates. It also allows cross region/cross subscription reference of certificates for Cloud Service (extended support).

For more information, see [Configure key vault extension for Cloud Service (extended support)](./enable-key-vault-virtual-machine.md)

## Remote Desktop extension

Remote Desktop enables you to access the desktop of a role running in Azure. You can use a remote desktop connection to troubleshoot and diagnose problems with your application while it is running.

You can enable a remote desktop connection in your role during development by including the remote desktop modules in your service definition or through the remote desktop extension. 

For more information, see [Configure remote desktop from the Azure portal](enable-rdp.md)

## Windows Azure Diagnostics extension

You can monitor key performance metrics for any cloud service. Every cloud service role collects minimal data: CPU usage, network usage, and disk utilization. If the cloud service has the Microsoft.Azure.Diagnostics extension applied to a role, that role can collect additional points of data. 

With basic monitoring, performance counter data from role instances is sampled and collected at 3-minute intervals. This basic monitoring data is not stored in your storage account and has no additional cost associated with it. 

With advanced monitoring, additional metrics are sampled and collected at intervals of 5 minutes, 1 hour, and 12 hours. The aggregated data is stored in a storage account, in tables, and is purged after 10 days. The storage account used is configured by role; you can use different storage accounts for different roles. 

For more information, see [Apply the Windows Azure diagnostics extension in Cloud Services (extended support)](enable-wad.md)

## Anti Malware Extension
An Azure application or service can enable and configure Microsoft Antimalware for Azure Cloud Services using PowerShell cmdlets. Note that Microsoft Antimalware is installed in a disabled state in the Cloud Services platform running Windows Server 2012 R2 and older which requires an action by an Azure application to enable it. For Windows Server 2016 and above, Windows Defender is enabled by default, hence these cmdlets can be used for configuring Antimalware.

For more information, see [Add Microsoft Antimalware to Azure Cloud Service using Extended Support(CS-ES)](../security/fundamentals/antimalware-code-samples.md#add-microsoft-antimalware-to-azure-cloud-service-using-extended-support)

To know more about Azure Antimalware, please visit [here](../security/fundamentals/antimalware.md)



## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
