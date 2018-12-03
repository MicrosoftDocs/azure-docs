---
title: Enable Azure CLI for Azure Stack users | Microsoft Docs
description: Learn how to use the cross-platform command-line interface (CLI) to manage and deploy resources on Azure Stack
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: f576079c-5384-4c23-b5a4-9ae165d1e3c3
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/28/2018
ms.author: mabrigg

---
# Enable Azure CLI for Azure Stack users

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can provide the CA root certificate to users of Azure Stack so that they can use Azure CLI on their development machines. Your users will need the certificate to manage resources through CLI.

* **The Azure Stack CA root certificate** is required if users are using CLI from a workstation outside the Azure Stack Development Kit.  

* **The virtual machine aliases endpoint** provides an alias, like "UbuntuLTS" or "Win2012Datacenter," that references an image publisher, offer, SKU, and version as a single parameter when deploying VMs.  

The following sections describe how to get these values.

## Export the Azure Stack CA root certificate

You can find the Azure Stack CA root certificate on the development kit and on a tenant virtual machine that is running within the development kit environment. To export the Azure Stack root certificate in PEM format, sign in to your development kit or the tenant virtual machine and run the following script:

```powershell
$label = "AzureStackSelfSignedRootCert"
Write-Host "Getting certificate from the current user trusted store with subject CN=$label"
$root = Get-ChildItem Cert:\CurrentUser\Root | Where-Object Subject -eq "CN=$label" | select -First 1
if (-not $root)
{
    Log-Error "Certificate with subject CN=$label not found"
    return
}

Write-Host "Exporting certificate"
Export-Certificate -Type CERT -FilePath root.cer -Cert $root

Write-Host "Converting certificate to PEM format"
certutil -encode root.cer root.pem
```

## Set up the virtual machine aliases endpoint

Azure Stack operators should set up a publicly accessible endpoint that hosts a virtual machine alias file. The virtual machine alias file is a JSON file that provides a common name for an image. That name is subsequently specified when a VM is deployed as an Azure CLI parameter.  

Before you add an entry to an alias file, make sure that you [download images from the Azure Marketplace](azure-stack-download-azure-marketplace-item.md), or have [published your own custom image](azure-stack-add-vm-image.md). If you publish a custom image, make note of the publisher, offer, SKU, and version information that you specified during publishing. If it is an image from the marketplace, you can view the information by using the ```Get-AzureVMImage``` cmdlet.  

A [sample alias file](https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json) with many common image aliases is available. You can use that as a starting point. Host this file in a space where your CLI clients can reach it. One way is to host the file in a blob storage account and share the URL with your users:

1. Download the [sample file](https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json) from GitHub.
2. Create a new storage account in Azure Stack. When that's done, create a new blob container. Set the access policy to "public."  
3. Upload the JSON file to the new container. When that's done, you can view the URL of the blob by selecting the blob name and then selecting the URL from the blob properties.

## Next steps

- [Deploy templates with Azure CLI](azure-stack-deploy-template-command-line.md)
- [Connect with PowerShell](azure-stack-connect-powershell.md)
- [Manage user permissions](azure-stack-manage-permissions.md)
