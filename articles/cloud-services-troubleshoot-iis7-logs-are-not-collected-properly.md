<properties 
   pageTitle="IIS7 Logs Are Not Collected Properly"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="05/12/2015"
   ms.author="adegeo" />

## IIS7 Logs Are Not Collected Properly

This topic contains three related issues around the failure to collect IIS logs:

- **IIS7 logs not collected using HWC on OS family 2**

- **IIS7 Logs not collected when using Azure SDK 1.3**

- **Failed Error Request Logs not collected**

### IIS7 logs not collected properly using HWC on OS family 2

**Applies to**: Azure SDK 1.3 and SDK1.4 Web Roles using HWC

**Resolution**: Upgrade to SDK 1.4 and use full IIS.

### IIS7 Logs not collected when using Azure SDK 1.3

**Applies to**: Azure SDK 1.3 web roles using the full IIS feature

**Symptom**: Both scheduled and on demand transfers do not publish logs to the configured Azure Storage diagnostic storage account. IIS7 Logs continue to be collected in the DiagnosticStore local resource.

**Cause**: By default the Full IIS7 based Web Roles set the permissions on IIS Logs in a way that prevents the diagnostic monitoring agent from reading or delete logs.

**Resolution**: Upgrade to SDK 1.4.

### Failed Error Request Logs not collected

**Applies to**: Azure SDK 1.3 and SDK1.4 Web Roles using Full IIS Feature

**Symptom**: Both scheduled and on demand transfers do not publish logs to the configured Azure Storage diagnostic storage account. Failed Error Request Logs are not generated in the DiganosticStore local resource.

**Cause**: By default the Full IIS7 based Web Roles incorrectly set the permissions in a way that prevents the system from writing Failed Error Request Logs.

**Resolution**: Add a startup task to explicitly set the permissions so that all users on the machine can write to the appropriate directory.

The following work around startup command script and powershell script can be used to set the needed permissions. For more information on using startup commands, see [Run Startup Tasks in Azure](https://msdn.microsoft.com/library/hh180155).

>[AZURE.NOTE] You must run this startup command with executionContext="elevated".

workaround.cmd

	powershell -command "Set-ExecutionPolicy Unrestricted" 2>> err.out  
	powershell .\workaround.ps1 2>> err.out

workaround.ps1

	[Reflection.Assembly]::LoadWithPartialName("Microsoft.WindowsAzure.ServiceRuntime") 
	
	#Replace the WCFService.svclog resource name with your resource name found in your service config file.
	#By default the Visual Studio template uses the resource name WCFService.svclog.
	$WCFLogResourceName = "WCFService.svclog"
	
	#Do no touch these variables. These are the enviroment variables.
	$DiagnosticStore = "DiagnosticStore"
	$WAContainerId = "WA_CONTAINER_SID"
	
	#Set the correct ACL for Failed Request Logs Folder
	Function Fix-FailedLogsACL {
	    trap { 
	      echo ""
	      echo "Cannot set the ACL for Failed Request Logs Folder: $FailedRequestLogsPath"
	      break 
	    }
	
	    $DiagStorePath = [Microsoft.WindowsAzure.ServiceRuntime.RoleEnvironment]::GetLocalResource($DiagnosticStore).RootPath
	    $FailedRequestLogsPath = join-path -path $DiagStorePath -childpath FailedReqLogFiles
	    $FailedRequestsACL = (Get-Item $FailedRequestLogsPath).GetAccessControl("Access")
	    $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("IIS_IUSRS", "Read, Write, Traverse, TakeOwnership", "ContainerInherit, ObjectInherit",   "None", "Allow")
	    $FailedRequestsACL.AddAccessRule($AccessRule)
	    Set-Acl $FailedRequestLogsPath $FailedRequestsACL
	        
	    echo ""
	    echo "ACL set successfully for failed request logs directory:  $FailedRequestLogsPath"
	}
	
	#Set the correct ACL for WCF Logs Folder
	Function Fix-WCFLogsACL {
	    trap {      
	      echo ""
	      echo "Cannot set the ACL for WCF Logs Folder: $WCFLogPath"
	      break 
	    }
	    
	    $WCFLogPath = [Microsoft.WindowsAzure.ServiceRuntime.RoleEnvironment]::GetLocalResource($WCFLogResourceName).RootPath
	    $WAContainerUser = [environment]::GetEnvironmentVariable($WAContainerId)
	    $WAContainerUserSID = New-Object System.Security.Principal.SecurityIdentifier($WAContainerUser)
	    $WAContainerUserAccount = $WAContainerUserSID.Translate( [System.Security.Principal.NTAccount])
	
	    $AccessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($WAContainerUserAccount.Value, "Read, Traverse, Delete", "ContainerInherit, ObjectInherit",   "None", "Allow")
	    $WcfLogACL = (Get-Item $WCFLogPath).GetAccessControl("Access")    
	    $WcfLogACL.AddAccessRule($AccessRule)
	    Set-Acl $WCFLogPath $WcfLogACL     
	    
	    echo ""
	    echo "ACL set successfully for WCF logs directory: $WCFLogPath" 
	}
	
	#fix the ACL issues
	Fix-FailedLogsACL
	Fix-WCFLogsACL

## See Also

[Known Issues in Azure Cloud Services](https://msdn.microsoft.com/library/gg508668)

