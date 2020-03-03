---
title: Troubleshooting issues caused by applications that don’t support TLS 1.2 | Microsoft Docs
description: Troubleshooting issues caused by applications that don’t support TLS 1.2
services: cloud-services
documentationcenter: ''
author: mimckitt
manager: vashan
editor: ''
tags: top-support-issue
ms.assetid: 
ms.service: cloud-services
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: 
ms.date: 01/17/2020
ms.author: tagore
---

# Troubleshooting applications that don’t support TLS 1.2
This article describes how to enable the older TLS protocols (TLS 1.0 and 1.1) as well as applying legacy cipher suites to support the additional protocols on the Windows Server 2019 cloud service web and worker roles. 

We understand that while we are taking steps to deprecate TLS 1.0 and TLS 1.1, our customers may need to support the older protocols and cipher suites until they can plan for their deprecation.  While we don't recommend re-enabling these legacy values, we are providing guidance to help customers. We encourage customers to evaluate the risk of regression before implementing the changes outlined in this article. 

> [!NOTE]
> Guest OS Family 6 releases enforces TLS 1.2 by disabling 1.0/1.1 ciphers. 


## Dropping support for TLS 1.0, TLS 1.1 and older cipher suites 
In support of our commitment to use best-in-class encryption, Microsoft announced plans to start migration away from TLS 1.0 and 1.1 in June of 2017.   Since that initial announcement, Microsoft announced our intent to disable Transport Layer Security (TLS) 1.0 and 1.1 by default in supported versions of Microsoft Edge and Internet Explorer 11 in the first half of 2020.  Similar announcements from Apple, Google, and Mozilla indicate the direction in which the industry is headed.   

## TLS configuration  
The Windows Server 2019 cloud server image is configured with TLS 1.0 and TLS 1.1 disabled at the registry level. This means applications deployed to this version of Windows AND using the Windows stack for TLS negotiation will not allow TLS 1.0 and TLS 1.1 communication.   

The server also comes with a limited set of cipher suites: 

```
    TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 
    TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 
    TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 
    TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 
```

## Step 1: Create the PowerShell script to enable TLS 1.0 and TLS 1.1 

Use the following code as an example to create a script that enables the older protocols and cipher suites. For the purposes of this documentation, this script will be named: **TLSsettings.ps1**. Store this script on your local desktop for easy access in later steps. 


```Powershell
#******************* FUNCTION THAT ACTUALLY UPDATES KEYS; WILL RETURN REBOOT FLAG IF CHANGES *********************** 
 
Function Set-CryptoSetting {  
    param (  
        $regKeyName,  
        $value,  
        $valuedata,  
        $valuetype       
    )  
    
    $restart = $false 
  
    # Check for existence of registry key, and create if it does not exist  
    If (!(Test-Path -Path $regKeyName)) {  
        New-Item $regKeyName | Out-Null  
    }  
 
    # Get data of registry value, or null if it does not exist  
    $val = (Get-ItemProperty -Path $regKeyName -Name $value -ErrorAction SilentlyContinue).$value  
 
    If ($val -eq $null) {  
        # Value does not exist - create and set to desired value  
        New-ItemProperty -Path $regKeyName -Name $value -Value $valuedata -PropertyType $valuetype | Out-Null  
        $restart = $true 
    } 
 
    Else {  
        # Value does exist - if not equal to desired value, change it  
        If ($val -ne $valuedata) {  
            Set-ItemProperty -Path $regKeyName -Name $value -Value $valuedata  
            $restart = $true  
        }  
    }  
 
    $restart  
}  
 
#*************************************************************************************************************** 
 
#****************************** CIPHERSUITES FOR OS VERSIONS WINDOWS 10 AND ABOVE ****************************** 
 
function Get-BaseCipherSuitesWin10Above() 
{ 
        $cipherorder += "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256," 
        $cipherorder += "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384," 
        $cipherorder += "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256," 
        $cipherorder += "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384," 
        $cipherorder += "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256," 
        $cipherorder += "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384," 
        $cipherorder += "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256," 
        $cipherorder += "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384," 
 
# Legacy cipher suites 
        $cipherorder += "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA_P256," 
        $cipherorder += "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA_P256," 
        $cipherorder += "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P256," 
        $cipherorder += "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256," 
        $cipherorder += "TLS_RSA_WITH_AES_256_GCM_SHA384,"  
        $cipherorder += "TLS_RSA_WITH_AES_128_GCM_SHA256,"  
        $cipherorder += "TLS_RSA_WITH_AES_256_CBC_SHA256,"  
        $cipherorder += "TLS_RSA_WITH_AES_128_CBC_SHA256,"  
        $cipherorder += "TLS_RSA_WITH_AES_256_CBC_SHA," 
        $cipherorder += "TLS_RSA_WITH_AES_128_CBC_SHA" 
 
 return $cipherorder 
} 
 

#*************************************************************************************************************** 
 
 
#********************************************** REGISTRY KEYS **************************************************** 
 
 
function Get-RegKeyPathToEnable() 
{ 
    $regKeyPath = @( 
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2",         
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client",  
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" , 
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1",  
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Client", 
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" , 
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0",  
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Client",  
        "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" 
    ) 
    return $regKeyPath 
} 
 
#*************************************************************************************************************** 
 
$localRegistryPath = @() 
 
# Enable TLS 1.2, TLS 1.1 and TLS 1.0 
$localRegistryPath += Get-RegKeyPathToEnable 
 
#******************* CREATE THE REGISTRY KEYS IF THEY DON'T EXIST******************************** 
 
# Check for existence of the registry keys, and create if they do not exist  
For ($i = 0; $i -lt $localRegistryPath.Length; $i = $i + 1) {  
   Write-Host "Checking for existing of key: $($localRegistryPath[$i]) Severity Level: Information"
   If (!(Test-Path -Path $localRegistryPath[$i])) {
        New-Item $localRegistryPath [$i] | Out-Null
    Write-Host "Creating key: $($localRegistryPath[$i]) Severity Level: Information"
    }
}  
 
#********************************* EXPLICITLY Enable TLS12,  TLS11 and TLS10********************************* 
 
For ($i = 0; $i -lt $localRegistryPath.Length; $i = $i + 1) { 
    if ($localRegistryPath[$i].Contains("Client") -Or $localRegistryPath[$i].Contains("Server")) { 
      Write-Host "Enabling this key: $($localRegistryPath[$i]) Severity: Information "
        $result = Set-CryptoSetting $localRegistryPath[$i].ToString() Enabled 1 DWord   
        $result = Set-CryptoSetting $localRegistryPath[$i].ToString() DisabledByDefault 0 DWord  
        $reboot = $reboot -or $result 
    } 
} 
 
#**************************************** SET THE CIPHER SUITE ORDER******************************** 
 
$cipherlist = @() 
 
# Set cipher suite order 
$cipherlist += Get-BaseCipherSuitesWin10Above 
$CipherSuiteRegKey = "HKLM:\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL\00010002"  
 
if (!(Test-Path -Path $CipherSuiteRegKey))  
{  
    New-Item $CipherSuiteRegKey | Out-Null  
    $reboot = $True  
    Write-Host "Creating key: $($CipherSuiteRegKey) Severity: Information "
}  
 
#Set-ItemProperty -Path $CipherSuiteRegKey -Name Functions -Value $cipherorder  
Set-ItemProperty -Path $CipherSuiteRegKey -Name Functions -Value $cipherlist  
#********************************************* REBOOT ******************************************* 
 
Write-Host "A reboot is required in order for changes to effect"  
Write-Host "Rebooting now..."  
shutdown.exe /r /t 5 /c "Crypto settings changed" /f /d p:2:4
```

## Step 2: Create a command file 

Create a CMD file named **RunTLSSettings.cmd** using the below. Store this script on your local desktop for easy access in later steps. 

```cmd
PowerShell -ExecutionPolicy Unrestricted %~dp0TLSsettings.ps1
REM This line is required to ensure the startup tasks does not block the role from starting in case of error.  DO NOT REMOVE!!!! 
EXIT /B 0
```

## Step 3: Add the startup task to the role’s service definition (csdef) 

Add the following snippet to your exsisting service definition file. 


```
	<Startup> 
		<Task executionContext="elevated" taskType="simple" commandLine="RunTLSSettings.cmd"> 
		</Task> 
	</Startup> 
```

Here is an example that shows both the worker role and web role. 

```
<?xmlversion="1.0"encoding="utf-8"?> 
<ServiceDefinitionname="CloudServiceName"xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition"schemaVersion="2015-04.2.6"> 
	<WebRolename="WebRole1"vmsize="Standard_D1_v2"> 
		<Sites> 
			<Sitename="Web"> 
				<Bindings> 
					<Bindingname="Endpoint1"endpointName="Endpoint1"/> 
				</Bindings> 
			</Site> 
		</Sites> 
		<Startup> 
			<Taske xecutionContext="elevated" taskType="simple" commandLine="RunTLSSettings.cmd"> 
			</Task> 
		</Startup> 
		<Endpoints> 
			<InputEndpointname="Endpoint1"protocol="http"port="80"/> 
		</Endpoints> 
	</WebRole> 
<WorkerRolename="WorkerRole1"vmsize="Standard_D1_v2"> 
	<Startup> 
		<Task executionContext="elevated" taskType="simple" commandLine="RunTLSSettings.cmd"> 
		</Task> 
	</Startup> 
</WorkerRole> 
</ServiceDefinition> 
```

## Step 5: Add the scripts to your Cloud Service 

1) In Visual Studio, right-click on your WebRole
2) Select **Add**
3) Select **Exsisting Item**
4) In the file explorer, navigate to your desktop where you stored the **TLSsettings.ps1** and **RunTLSSettings.cmd** files 
5) Select the two files to add them to your Cloud Services project

## Step 6: Enable Copy to Output Directory

To ensure the scripts are uploaded with every update pushed from Visual Studio, the setting *Copy to Output Directory* needs to be set to *Copy Always*

1) Under your WebRole, right-click on RunTLSSettings.cmd
2) Select **Properties**
3) In the properties tab, change *Copy to Output Directory* to *Copy Always"*
4) Repeat the steps for **TLSsettings.ps1**

## Step 7: Publish & Validate

Now that the above steps have been complete, publish the update to your exsisting Cloud Service. 

You can use [SSLLabs](https://www.ssllabs.com/) to validate the TLS status of your endpoints 

 
