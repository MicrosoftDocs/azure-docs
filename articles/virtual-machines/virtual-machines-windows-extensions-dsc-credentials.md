<properties
   pageTitle="Passing credentials to Azure using DSC | Microsoft Azure"
   description="Overview on securely passing credentials to Azure virtual machines using PowerShell Desired State Configuration"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="zjalexander"
   manager="timlt"
   editor=""
   tags="azure-service-management,azure-resource-manager"
   keywords=""/>

<tags
   ms.service="virtual-machines-windows"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="na"
   ms.date="04/18/2016"
   ms.author="zachal"/>

# Passing credentials to the Azure DSC extension handler #

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

This article covers the Desired State Configuration extension for Azure. An overview of the DSC extension handler can be found at [Introduction to the Azure Desired State Configuration extension handler](virtual-machines-windows-extensions-dsc-overview.md). 

As a part of the configuration process, you may need to set up user accounts, access services, or install a program in a user context. In order to do these things, you need to provide credentials. 

DSC allows for parameterized configurations in which credentials are passed into the configuration and securely stored in MOF files. The Azure Extension Handler simplifies credential management by providing automatic management of certificates. 

Consider the following DSC configuration script that creates a local user account with the specified password:

*user_configuration.ps1*

```
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

It is important to include *node localhost* as part of the configuration. The extension handler specifically looks for the node localhost statement and will not work without this statement. It is also important to include the typecast *[PsCredential]*, as this specific type triggers the extension to encrypt the credential as described below. 

Publish this script to blob storage:

`Publish-AzureVMDscConfiguration -ConfigurationPath .\user_configuration.ps1`

Set the Azure DSC extension and provide the credential:

```
$configurationName = "Main"
$configurationArguments = @{ Credential = Get-Credential }
$configurationArchive = "user_configuration.ps1.zip"
$vm = Get-AzureVM "example-1"
 
$vm = Set-AzureVMDSCExtension -VM $vm -ConfigurationArchive $configurationArchive 
-ConfigurationName $configurationName -ConfigurationArgument @configurationArguments
 
$vm | Update-AzureVM
```

Running this code will prompt for a credential. Once it is provided, it is stored in memory briefly. When it is published with `Set-AzureVmDscExtension` cmdlet, it is transmitted over HTTPS to the VM, where Azure stores it encrypted on disk, using the local VM certificate. Then it is briefly decrypted in memory and re-encrypt in order to pass it to DSC.

This is different than using secure configurations without the extension handler. The Azure environment gives a way to transmit configuration data securely via certificates, so when using the DSC extension handler there is no need to provide $CertificatePath or a $CertificateID / $Thumbprint entry in ConfigurationData.


## Next steps ##

For more information on the Azure DSC extension handler, see [Introduction to the Azure Desired State Configuration extension handler](virtual-machines-windows-extensions-dsc-overview.md). 

For more information about PowerShell DSC, [visit the PowerShell documentation center](https://msdn.microsoft.com/powershell/dsc/overview). 

To find additional functionality you can manage with PowerShell DSC, [browse the PowerShell gallery](https://www.powershellgallery.com/packages?q=DscResource&x=0&y=0) for more DSC resources.
