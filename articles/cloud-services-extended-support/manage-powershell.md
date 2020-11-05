---
title: Manage Cloud Services (extended support) 
description: Manage Cloud Services (extended support) 
ms.topic: article
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Manage Cloud Services (extended support) 

Restart, rebuild and reimage Cloud Services (extended support):

## Deployment:

### Variables for common field:

```PowerShell
$resourceGroupName = "ContosOrg"
$cloudServiceName = “ContosoCS"
$roleInstanceName = "ContosoFrontEnd_IN_0"
```

### Restart:

```PowerShell
Restart-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName 
```

### Reimage:

```PowerShell
Invoke-AzCloudServiceReimage -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName 
```

### Rebuild

```PowerShell
Invoke-AzCloudServiceRebuild -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

For more information, see <Add link to CS Powershell reference documents>  

## Role Instance: 

### Restart: 

```PowerShell
Restart-AzCloudServiceRoleInstance -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName 
```

### Reimage:

```PowerShell
Invoke-AzCloudServiceRoleInstanceReimage -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName 
```

### Rebuild

```PowerShell
Invoke-AzCloudServiceRoleInstanceRebuild -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName 
```

## Delete Cloud Services (extended support):

### Delete Cloud Services deployment: 

```PowerShell
Remove-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

### Delete multiple roles within Cloud Services deployment: 

```PowerShell
$roles = @($roleInstanceName1, $roleInstanceName2)
Remove-AzCloudService -ResourceGroupName $ResourceGroupName -CloudServiceName $CloudServiceName -RoleInstance $roles
```

### Delete single role within Cloud Service (extended support) deployment: 

```PowerShell
Remove-AzCloudServiceRoleInstance -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName
```

For more information, see <Add link to CS Powershell reference documents> 


## List details about Cloud Services (extended support)

### Get list of all cloud services within a subscription

```PowerShell
Get-AzCloudService
```

### Get list of all cloud services within a resource group

```PowerShell
Get-AzCloudService -ResourceGroupName $resourceGroupName
```

### Get details about a Cloud Services (extended support) deployment

```PowerShell
Get-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

### Get details about a Cloud Services (extended support) role instance

```PowerShell
Get-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName 
```
### Get details of all role instances within a Cloud Services (extended support) deployment 

```PowerShell
Get-AzCloudServiceRoleInstance -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

### Get Instance view of a Cloud Services (extended support) deployment

```PowerShell
Get-AzCloudServiceInstanceView -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName  
```

### Get Instance view of a specific role instance within a Cloud Services (extended support) deployment

```PowerShell
Get-AzCloudServiceRoleInstanceView -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName  
```

### Get list & details of all extensions applied on the cloud service deployment

```PowerShell
Get-AzVMExtensionImageType  

```

For more information, see <Add link to CS Powershell reference documents> 


## Start & Stop Cloud Services (extended support) deployment:

```PowerShell
Start-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

```PowerShell
Stop-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

For more information, see <Add link to CS Powershell reference documents> 


## VIP Swap deployment
Process to define swappable relationship between two deployments and swap Virtual IP addresses.
1.	Create first cloud services (extended support) deployment 
2.	Get cloudServicesId of the first deployment
3.	Create second cloud services (extended support) deployment, but now by adding `-SwappableCloudServiceId` property to `New-AzCloudService` command. 
4.	Get cloudServiceId for second deployment
5.	Perform VIP Swap 

    ```PowerShell
    Switch-AzCloudService -SourceCloudService $sourceCloudServiceId -TargetCloudService $targetCloudServiceId    
    ```

To update the swappable relationship for a cloud service deployment, call update-AzCloudService command with -SwappableCloudServiceId property containing the Cloud Services Id of the newer deployment.

For more information, see <Add link to CS Powershell reference documents> 


## RDP using Plugin or Extension:

### Enable RDP:
1.	Import RemoteAccess & RemoteAccessForwarder Plugins using Csdef

    ```PowerShell
    <Imports>
    <Import moduleName="RemoteAccess" />
    	<Import moduleName="RemoteForwarder" />
    </Imports>
    ```

2.	Create a self-signed PFX cert, define the RDP username & password & encrypt the password using certificate
3.	Add settings for RDP in Cscfg. Set plugin enabled properties to True. 

    ```PowerShell
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="Defined username" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="Password encrypted using certificate" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="2020-04-24T23:59:59.0000000+05:30" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" />
    ```

4.	 Add certificate details to Cscfg.
        ```PowerShell 
        <Certificates>
        <Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="Add certificate thumbprint" thumbprintAlgorithm="sha1" />
        </Certificates>
        ```

5.	Upload the certificate  to Key Vault and reference the key vault during CS create operation
6.	Create cloud services deployment

### RDP into role instance:
1.	Get the RDP file for your cloud service.

    ```PowerShell 
    Get-AzCloudServiceRoleInstanceRemoteDesktopFile -CloudServiceName $cloudServiceName -ResourceGroupName $resourceGroupName -RoleInstanceName $roleInstanceName OutFile "C:\temp\ContosoFrontEnd_IN_0.rdp"
    ```

2.	Create RDP file. Italic values below define the value & it’s syntax that needs to be replaced. 
    ```PowerShell
    full address:s:cloudservicename.location.cloudapp.azure.com
    username:s:defined_username
    LoadBalanceInfo:s:Cookie: mstshash=RoleName#RoleInstanceName
    ```
3.	Double click & execute the file to connect to the VM. 


### RDP using extension: 
-	Enable RDP:  




