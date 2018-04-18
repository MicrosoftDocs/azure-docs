---
title: Rotate secrets in Azure Stack | Microsoft Docs
description: Learn how to rotate your secrets in Azure Stack.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila
editor: ''

ms.assetid: 49071044-6767-4041-9EDD-6132295FA551
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/08/2018
ms.author: mabrigg

---

# Rotate secrets in Azure Stack

*Applies to: Azure Stack integrated systems*

Update your passwords for Azure Stack components at a regular cadence.

## Updating the passwords for the baseboard management controller (BMC)

The baseboard management controllers (BMC) monitor the physical state of your servers. The specifications and instructions on updating the password of the BMC vary based on your original equipment manufacturer (OEM) hardware vendor.

1. Update the BMC on the Azure Stack’s physical servers by following your OEM instructions. The password for each BMC in your environment must be the same.
2. Open a privileged endpoint in Azure Stack Sessions. For instruction, see [Using the privileged endpoint in Azure Stack](azure-stack-privileged-endpoint.md).
3. After your PowerShell prompt has changed to **[IP address or ERCS VM name]: PS>** or to **[azs-ercs01]: PS>**, depending on the environment, run `Set-BmcPassword` by running `invoke-command`. Pass your privileged endpoint session variable as a parameter. For example:

    ```powershell
    # Interactive Version
    $PEip = "<Privileged Endpoint IP or Name>" # You can also use the machine name instead of IP here.
    $PECred = Get-Credential "<Domain>\CloudAdmin" -Message "PE Credentials" 
    $NewBMCpwd = Read-Host -Prompt "Enter New BMC password" -AsSecureString 

    $PEPSession = New-PSSession -ComputerName $PEip -Credential $PECred -ConfigurationName "PrivilegedEndpoint" 

    Invoke-Command -Session $PEPSession -ScriptBlock {
        Set-Bmcpassword -bmcpassword $using:NewBMCpwd
    }
    ```
    
    You can also use the static PowerShell version with the Passwords as code lines:
    
    ```powershell
    # Static Version
    $PEip = "<Privileged Endpoint IP or Name>" # You can also use the machine name instead of IP here.
    $PEUser = "<Privileged Endpoint user for exmaple Domain\CloudAdmin>"
    $PEpwd = ConvertTo-SecureString "<Privileged Endpoint Password>" -AsPlainText -Force
    $PECred = New-Object System.Management.Automation.PSCredential ($PEUser, $PEpwd) 
    $NewBMCpwd = ConvertTo-SecureString "<New BMC Password>" -AsPlainText -Force 

    $PEPSession = New-PSSession -ComputerName $PEip -Credential $PECred -ConfigurationName "PrivilegedEndpoint" 

    Invoke-Command -Session $PEPSession -ScriptBlock {
        Set-Bmcpassword -bmcpassword $using:NewBMCpwd
    }
    ```

## Next steps

To learn more about the security and Azure Stack, see [Azure Stack infrastructure security posture](azure-stack-security-foundations.md).
