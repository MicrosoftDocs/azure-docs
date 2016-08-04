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

This article describes how to enable remote desktop on your Cloud Service Roles using PowerShell. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for the prerequisites needed for this article. PowerShell utilizes the Remote Desktop Extension so you can enable Remote Desktop after the application has been deployed. 


## Configure Remote Desktop from PowerShell

The [Set-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495117.aspx) cmdlet allows you to enable Remote Desktop on specified roles or all roles of your cloud service deployment. The cmdlet lets you specify the Username and Password for the remote desktop user through the *Credential* parameter that accepts a PSCredential object.

If you are using PowerShell interactively, you can easily set the PSCredential object by calling the [Get-Credentials](https://technet.microsoft.com/library/hh849815.aspx) cmdlet. 

```
$remoteusercredentials = Get-Credential
```

This command displays a dialog box allowing you to enter the username and password for the remote user in a secure manner. 

Since PowerShell helps in automation scenarios, you can also set up the **PSCredential** object in a way that doesn't require user interaction. First, you need to set up a secure password. You begin with specifying a plain text password convert it to a secure string using [ConvertTo-SecureString](https://technet.microsoft.com/library/hh849818.aspx). Next you need to convert this secure string into an encrypted standard string using [ConvertFrom-SecureString](https://technet.microsoft.com/library/hh849814.aspx). Now you can save this encrypted standard string to a file using [Set-Content](https://technet.microsoft.com/library/ee176959.aspx). 

You can also create a secure password file so that you don't have to type in the password everytime. Also, a secure password file is better than a plain text file. Use the following PowerShell to create a secure password file:  

```
ConvertTo-SecureString -String "Password123" -AsPlainText -Force | ConvertFrom-SecureString | Set-Content "password.txt"
``` 

>[AZURE.IMPORTANT] When setting the password, make sure that you meet the [complexity requirements](https://technet.microsoft.com/library/cc786468.aspx).

To create the credential object from the secure password file, you must read the file contents and convert them back to a secure string using [ConvertTo-SecureString](https://technet.microsoft.com/library/hh849818.aspx). 

The [Set-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495117.aspx) cmdlet also accepts an *Expiration* parameter, which specifies a **DateTime** at which the user account expires. For example, you could set the account to expire a few days from the current date and time.

This PowerShell example shows you how to set the Remote Desktop Extension on a cloud service:   

```
$servicename = "cloudservice"
$username = "RemoteDesktopUser"
$securepassword = Get-Content -Path "password.txt" | ConvertTo-SecureString
$expiry = $(Get-Date).AddDays(1)
$credential = New-Object System.Management.Automation.PSCredential $username,$securepassword
Set-AzureServiceRemoteDesktopExtension -ServiceName $servicename -Credential $credential -Expiration $expiry 
```
You can also optionally specify the deployment slot and roles that you want to enable remote desktop on. If these parameters are not specified, the cmdlet enables remote desktop on all roles in the **Production** deployment slot.

The Remote Desktop extension is associated with a deployment. If you create a new deployment for the service, you will have to enable remote desktop on the for that deployment. If you always want to have remote desktop enabled on your deployments, then you should consider integrating the PowerShell scripts to enable remote desktop into your deployment workflow.


## Remote Desktop into a role instance
The [Get-AzureRemoteDesktopFile](https://msdn.microsoft.com/library/azure/dn495261.aspx) cmdlet can be used to remote desktop into a specific role instance of your cloud service. You can use the *LocalPath* parameter to download the RDP file locally. Or you can use the *Launch* parameter to directly launch the Remote Desktop Connection dialog to access the cloud service role instance.

```
Get-AzureRemoteDesktopFile -ServiceName $servicename -Name "WorkerRole1_IN_0" -Launch
```


## Check if Remote Desktop extension is enabled on a service 
The [Get-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495261.aspx) cmdlet displays that remote desktop is enabled or disabled on a service deployment. The cmdlet returns the username for the remote desktop user and the roles that the remote desktop extension is enabled for. By default this all happens on the deployment slot and you can choose to use the staging slot instead.

```
Get-AzureServiceRemoteDesktopExtension -ServiceName $servicename
```

## Remove Remote Desktop extension from a service 
If you have already enabled the remote desktop extension on a deployment and need to update the remote desktop settings, then first remove the remote desktop extension, and then enable it again with the new settings. You need to do this when, for example, you want to set a new passord for the remote user account, or the account expired. This is only required on existing deployments which have the remote desktop extension enabled. For new deployments, you can call simply apply the extension directly.

To remove the remote desktop extension from the deployment, you can use the [Remove-AzureServiceRemoteDesktopExtension](https://msdn.microsoft.com/library/azure/dn495280.aspx) cmdlet. You can also optionally specify the deployment slot and role from which you want to remove the remote desktop extension. 

```
Remove-AzureServiceRemoteDesktopExtension -ServiceName $servicename -UninstallConfiguration
```  

>[AZURE.NOTE] To completely remove the extension configuration, you should call the *remove* cmdlet with the **UninstallConfiguration** parameter. 
>
>The **UninstallConfiguration** parameter uninstalls any extension configuration that was applied to the service. Every extension configuration is associated with the service configuration. Calling the *remove* cmdlet without **UninstallConfiguration** disassociates the <mark>deployment</mark> from the extension configuration, thus effectively removing the extension. However, the extension configuration remains associated with the service.



## Additional Resources

[How to Configure Cloud Services](cloud-services-how-to-configure.md)
