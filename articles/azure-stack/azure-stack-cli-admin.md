---
title: Enable Azure CLI for Azure Stack users | Microsoft Docs
description: Learn how to use the cross-platform command-line interface (CLI) to manage and deploy resources on Azure Stack
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: f576079c-5384-4c23-b5a4-9ae165d1e3c3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: sngun

---
# Enable Azure CLI for Azure Stack users

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

There aren't any Azure Stack operator specific tasks that you can perform by using CLI. But before users can manage resources through CLI, Azure Stack operators must provide them with the following:

* **The Azure Stack CA root certificate** - The root certificate is required if your users are using CLI from a workstation outside the Azure Stack development kit.  

* **The virtual machine aliases endpoint** - This endpoint is required to create virtual machines by using CLI.

The following sections describe how to get these values.

## Export the Azure Stack CA root certificate

The Azure Stack CA root certificate is available on the development kit and on a tenant virtual machine that is running within the development kit environment. Sign in to your development kit or the tenant virtual machine and run the following script to export the Azure Stack root certificate in PEM format:

```powershell
$label = "AzureStackSelfSignedRootCert"
Write-Host "Getting certificate from the current user trusted store with subject CN=$label"
$root = Get-ChildItem Cert:\CurrentUser\Root | Where-Object Subject -eq "CN=$label" | select -First 1
if (-not $root)
{
    Log-Error "Cerficate with subject CN=$label not found"
    return
}

Write-Host "Exporting certificate"
Export-Certificate -Type CERT -FilePath root.cer -Cert $root

Write-Host "Converting certificate to PEM format"
certutil -encode root.cer root.pem
```

## Set up the virtual machine aliases endpoint

Azure Stack operators should set up a publicly accessible endpoint that contains virtual machine image aliases. Azure Stack operators must [Download the image to Azure Stack marketplace](azure-stack-download-azure-marketplace-item.md) before they add it to image aliases endpoint.
   
For example, Azure contains uses following URI: 
https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json. The operator should set up a similar endpoint for Azure Stack with the images that are available in their marketplace.

## Next steps

[Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)

[Connect with PowerShell](azure-stack-connect-powershell.md)

[Manage user permissions](azure-stack-manage-permissions.md)

