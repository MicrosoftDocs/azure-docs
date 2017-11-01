---
title: Azure PowerShell Script Sample - Backup and restore service | Microsoft Docs
description: Azure PowerShell Script Sample - Backup and restore service
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.devlang: na
ms.topic: sample
ms.date: 10/30/2017
ms.author: apimpm
ms.custom: mvc
---

# Backup and restore service

This sample script backups and restores an API Management service. 

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview), and then run `Login-AzureRmAccount` to create a connection with Azure. Also, you need to have access to your domain registrar's DNS configuration page.

## Sample script

[!code-powershell[main](../../../powershell_scripts/api-management/backup-restore-apim-service/backup_restore_apim_service.ps1?highlight=1 "Backup and restore a service instance")]

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional Azure Powershell samples for Azure API Management can be found in the [PowerShell samples](../powershell-samples.md).
