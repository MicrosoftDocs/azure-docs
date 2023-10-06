---
title: Pass credentials to Azure using Desired State Configuration
description: Learn how to securely pass credentials to Azure virtual machines using PowerShell Desired State Configuration (DSC).
ms.topic: article
ms.service: virtual-machines
ms.subservice: extensions
author: bobbytreed
ms.author: robreed
ms.reviewer: erd
ms.collection: windows
ms.date: 03/06/2023
ms.custom:
---
# Pass credentials to the Azure DSCExtension handler

This article covers the Desired State Configuration (DSC) extension for Azure. For an overview of the DSC extension handler, see [Introduction to the Azure Desired State Configuration extension handler](dsc-overview.md).

> [!NOTE]
> Before you enable the DSC extension, we would like you to know that a newer version of DSC is now generally available, managed by a feature of Azure Automange named [machine configuration](../../governance/machine-configuration/overview.md). The machine configuration feature combines features of the Desired State Configuration (DSC) extension handler, Azure Automation State Configuration, and the most commonly requested features from customer feedback. Machine configuration also includes hybrid machine support through [Arc-enabled servers](../../azure-arc/servers/overview.md).

## Pass in credentials

As part of the configuration process, you might need to set up user accounts, access services, or install a program in a user context. To do these things, you need to provide credentials.

You can use DSC to set up parameterized configurations. In a parameterized configuration, credentials are passed into the configuration and securely stored in .mof files. The Azure extension handler simplifies credential management by providing automatic management of certificates.

The following DSC configuration script creates a local user account with the specified password:

```powershell
configuration Main
{
    param(
        [Parameter(Mandatory=$true)]
        [ValidateNotNullorEmpty()]
        [PSCredential]
        $Credential
    )
    Node localhost {
        User LocalUserAccount
        {
            Username = $Credential.UserName
            Password = $Credential
            Disabled = $false
            Ensure = "Present"
            FullName = "Local User Account"
            Description = "Local User Account"
            PasswordNeverExpires = $true
        }
    }
}
```

It's important to include **node localhost** as part of the configuration. The extension handler specifically looks for the **node localhost** statement. If this statement is missing, the following steps don't work. It's also important to include the typecast **[PsCredential]**. This specific type triggers the extension to encrypt the credential.

To publish this script to Azure Blob storage:

`Publish-AzVMDscConfiguration -ConfigurationPath .\user_configuration.ps1`

To set the Azure DSC extension and provide the credential:

```powershell
$configurationName = 'Main'
$configurationArguments = @{ Credential = Get-Credential }
$configurationArchive = 'user_configuration.ps1.zip'
$vm = Get-AzVM -Name 'example-1'

$vm = Set-AzVMDscExtension -VMName $vm -ConfigurationArchive $configurationArchive -ConfigurationName $configurationName -ConfigurationArgument @configurationArguments

$vm | Update-AzVM
```

## How a credential is secured

Running this code prompts for a credential. After the credential is provided, it's briefly stored in memory. When the credential is published by using the **Set-AzVMDscExtension** cmdlet, the credential is transmitted over HTTPS to the VM. In the VM, Azure stores the credential encrypted on disk by using the local VM certificate. The credential is briefly decrypted in memory, and then it's re-encrypted to pass it to DSC.

This process is different than [using secure configurations without the extension handler](/powershell/dsc/pull-server/securemof). The Azure environment gives you a way to transmit configuration data securely via certificates. When you use the DSC extension handler, you don't need to provide **$CertificatePath** or a **$CertificateID**/ **$Thumbprint** entry in **ConfigurationData**.

## Next steps

- Get an [introduction to Azure DSC extension handler](dsc-overview.md).
- Examine the [Azure Resource Manager template for the DSC extension](dsc-template.md).
- For more information about PowerShell DSC, go to the [PowerShell documentation center](/powershell/dsc/overview/).
- For more functionality that you can manage by using PowerShell DSC, and for more DSC resources, browse the [PowerShell gallery](https://www.powershellgallery.com/packages?q=DscResource&x=0&y=0).
