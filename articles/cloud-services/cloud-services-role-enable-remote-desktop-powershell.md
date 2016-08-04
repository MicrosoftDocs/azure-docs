<properties 
pageTitle="Enable Remote Desktop Connection for a Role in Azure Cloud Services using PowerShell" 
description="How to configure your azure cloud service application using PowerShell to allow remote desktop connections" 
services="cloud-services" 
documentationCenter="" 
authors="thraka" 
manager="timlt" 
editor=""/>
<tags 
ms.service="cloud-services" 
ms.workload="tbd" 
ms.tgt_pltfrm="na" 
ms.devlang="na" 
ms.topic="article" 
ms.date="08/05/2016" 
ms.author="adegeo"/>

# Enable Remote Desktop Connection for a Role in Azure Cloud Services using PowerShell

>[AZURE.SELECTOR]
- [Azure classic portal](cloud-services-role-enable-remote-desktop.md)
- [PowerShell](cloud-services-role-enable-remote-desktop-powershell.md)
- [Visual Studio](../vs-azure-tools-remote-desktop-roles.md)


Remote Desktop enables you to access the desktop of a role running in Azure. You can use a Remote Desktop connection to troubleshoot and diagnose problems with your application while it is running. 

This article describes how to enable remote desktop on your Cloud Service Roles using PowerShell. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for the prerequisites needed for this article. PowerShell uses the Remote Desktop Extension approach so you can enable Remote Desktop even after the application is deployed. 


## Configure Remote Desktop from PowerShell

The [Set-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495117.aspx) cmdlet allows you to enable Remote Desktop on specified roles or all roles of your cloud service deployment. The cmdlet lets you specify the Username and Password for the remote desktop user through the *Credential* parameter which accepts a PSCredential object.

If you are using PowerShell interactively you can easily set the PSCredential object by calling the [Get-Credentials](https://technet.microsoft.com/library/hh849815.aspx) cmdlet. 

```
$remoteusercredentials = Get-Credential
```

This will display a dialog box allowing you to enter the username and password for the remote user in a secure manner. 

Since PowerShell will mostly be used for automation scenarios you can also setup the PSCredential object in a way that doesn't require user interaction. To do this first you need to setup a secure password. You begin with specifying a plain text password convert it to a secure string using [ConvertTo-SecureString](https://technet.microsoft.com/library/hh849818.aspx). Next you need to convert this secure string into an encrypted standard string using [ConvertFrom-SecureString](https://technet.microsoft.com/library/hh849814.aspx). Now you can save this encrypted standard string to a file using [Set-Content](https://technet.microsoft.com/library/ee176959.aspx). When creating the PSCredential object you can read from this file to set the password in a secure way without having to specify the password on a prompt or storing the password as plain text. 

Use the following PowerShell to create a secure password file:  

```
ConvertTo-SecureString -String "Password123" -AsPlainText -Force | ConvertFrom-SecureString | Set-Content "password.txt"
``` 

Once the password file (password.txt) is created you will only be using this file and will not have to specify the password in plain text. If you need to update the password then you can run the above powershell again with the new password to generate a new password.txt file. 

>[AZURE.IMPORTANT] When setting the password make sure you meet the [complexity requirements](https://technet.microsoft.com/library/cc786468.aspx). 

To create the credential object from the secure password file you must read the file contents and convert them back to a secure string using [ConvertTo-SecureString](https://technet.microsoft.com/library/hh849818.aspx). In addition to credentials the [Set-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495117.aspx) cmdlet also accepts an *Expiration* parameter which specifies a DateTime at which the user account will expire. You get set it by specifying a static date and time or you could simply choose to expire the account a few days from the current date.

This PowerShell example shows you how to set the Remote Desktop Extension on a cloud service:   

```
$servicename = "cloudservice"
$username = "RemoteDesktopUser"
$securepassword = Get-Content -Path "password.txt" | ConvertTo-SecureString
$expiry = $(Get-Date).AddDays(1)
$credential = New-Object System.Management.Automation.PSCredential $username,$securepassword
Set-AzureServiceRemoteDesktopExtension -ServiceName $servicename -Credential $credential -Expiration $expiry 
```
You can also optionally specify the deployment slot and roles that you want to enable remote desktop on. If these parameters are not specified the cmdlet will default to using the Production deployment slot and enable remote desktop on all roles in the production deployment. 

The Remote Desktop extension is associated with a deployment. If you were to create a new deployment for the service then you will have to enable remote desktop on the new deployment again. If you want to always have remote desktop enabled on your deployments then you should consider integrating the PowerShell scripts to enable remote desktop into your deployment workflow.


## Remote Desktop into an role instance
The [Get-AzureRemoteDesktopFile](https://msdn.microsoft.com/library/azure/dn495261.aspx) cmdlet can be used to remote desktop into a specific role instance of your cloud service. You can use the *LocalPath* parameter on the cmdlet to download the RDP file locally or you can use the *Launch* parameter to directly launch the Remote Desktop Connection dialog to access the cloud service role instance.

```
Get-AzureRemoteDesktopFile -ServiceName $servicename -Name "WorkerRole1_IN_0" -Launch
```


## Check if Remote Desktop extension is enabled on a service 
The [Get-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495261.aspx) cmdlet displays whether remote desktop is enabled on a service deployment. The cmdlet will return the username for the remote desktop user and the roles that the remote desktop extension is enabled on. You can optionally specify a deployment slot with the default being production.

```
Get-AzureServiceRemoteDesktopExtension -ServiceName $servicename
```

## Remove Remote Desktop extension from a service 
If you have already enabled the remote desktop extension on a deployment and need to update the remote desktop settings then you must first remove the remote desktop extension and then enable it again with the new settings. For example if you want to set a new password for the remote user account or if the user account has expired then you need to remove the extension and then add it again with the new password or expiration. This is only required on existing deployments which have the remote desktop extension enabled. For new deployments you can call simply apply the extension directly.

To remove the remote desktop extension from s service deployment you can use the [Remove-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495280.aspx) cmdlet. You can also optionally specify the deployment slot and role from which you want to remove the remote desktop extension. 

```
Remove-AzureServiceRemoteDesktopExtension -ServiceName $servicename -UninstallConfiguration
```  

>[AZURE.NOTE] To completely remove the extension configuration you should call the *remove* cmdlet with the **UninstallConfiguration** parameter. 
>
>The **UninstallConfiguration** parameter will uninstall any extension configuration that was applied to the service. All extension configuration is associated with the service configuration to activate the extension with a deployment the deployment must be associated with that extension configuration. Calling the *remove* cmdlet without **UninstallConfiguration** will disassociate the deployment from the extension configuration thus effectively removing the extension from the deployment. However, the extension configuration will still remain associated with the service.



## Additional Resources

[How to Configure Cloud Services](cloud-services-how-to-configure.md)
