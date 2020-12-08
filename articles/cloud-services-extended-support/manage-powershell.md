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

This article covers common variables and commands used with Cloud Services (extended support).

## Deployment

### Variables for common field

```PowerShell
$resourceGroupName = "ContosOrg"
$cloudServiceName = “ContosoCS"
$roleInstanceName = "ContosoFrontEnd_IN_0"
```

### Restart

```PowerShell
Restart-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName 
```

### Reimage

```PowerShell
Invoke-AzCloudServiceReimage -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName 
```

### Rebuild

```PowerShell
Invoke-AzCloudServiceRebuild -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

## Role instance

### Restart

```PowerShell
Restart-AzCloudServiceRoleInstance -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName 
```

### Reimage

```PowerShell
Invoke-AzCloudServiceRoleInstanceReimage -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName 
```

### Rebuild

```PowerShell
Invoke-AzCloudServiceRoleInstanceRebuild -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName 
```

## Delete

### Delete Cloud Services deployment

```PowerShell
Remove-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

### Delete multiple roles within Cloud Services deployment 

```PowerShell
$roles = @($roleInstanceName1, $roleInstanceName2)
Remove-AzCloudService -ResourceGroupName $ResourceGroupName -CloudServiceName $CloudServiceName -RoleInstance $roles
```

### Delete single role within Cloud Service (extended support) deployment

```PowerShell
Remove-AzCloudServiceRoleInstance -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName
```

## List details

### Get list of all Cloud Services within a subscription

```PowerShell
Get-AzCloudService
```

### Get list of all Cloud Services within a resource group

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

### Get instance view of a Cloud Services (extended support) deployment

```PowerShell
Get-AzCloudServiceInstanceView -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName  
```

### Get instance view of a specific role instance within a Cloud Services (extended support) deployment

```PowerShell
Get-AzCloudServiceRoleInstanceView -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName -RoleInstanceName $roleInstanceName  
```

### Get list & details of all extensions applied on the Cloud Service deployment

```PowerShell
Get-AzVMExtensionImageType  
```

## Start & stop Cloud Services (extended support) deployments

```PowerShell
Start-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```

```PowerShell
Stop-AzCloudService -ResourceGroupName $resourceGroupName -CloudServiceName $cloudServiceName
```


## VIP Swap deployment
Define a swappable relationship between two deployments.
1.	Create a Cloud Services (extended support) deployment.
2.	Get `cloudServicesId` of the first deployment.
3.	Create a second Cloud Service (extended support) deployment, adding `-SwappableCloudServiceId` property to `New-AzCloudService` command. 
4.	Get `cloudServiceId` for second deployment.
5.	Perform VIP Swap.

    ```PowerShell
    Switch-AzCloudService -SourceCloudService $sourceCloudServiceId -TargetCloudService $targetCloudServiceId    
    ```

To update the swappable relationship for a Cloud Service deployment, call the `update-AzCloudService` command with `-SwappableCloudServiceId` property containing the Cloud Services Id of the newer deployment.

## RDP using plugin or extension

### Enable RDP
1.	Import `RemoteAccess` and `RemoteAccessForwarder` plugins using csdef.

    ```PowerShell
    <Imports>
    <Import moduleName="RemoteAccess" />
    	<Import moduleName="RemoteForwarder" />
    </Imports>
    ```

2.	Create a self-signed PFX certificate, define the remote desktop username & password and encrypt the password using the certificate.
3.	Add settings for remote desktop in the cscfg file and set the plugin enabled property to true. 

    ```PowerShell
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.Enabled" value="true" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountUsername" value="Defined username" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountEncryptedPassword" value="Password encrypted using certificate" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteAccess.AccountExpiration" value="2020-04-24T23:59:59.0000000+05:30" />
    <Setting name="Microsoft.WindowsAzure.Plugins.RemoteForwarder.Enabled" value="true" />
    ```

4.	 Add certificate details to cscfg.
        ```PowerShell 
        <Certificates>
        <Certificate name="Microsoft.WindowsAzure.Plugins.RemoteAccess.PasswordEncryption" thumbprint="Add certificate thumbprint" thumbprintAlgorithm="sha1" />
        </Certificates>
        ```

5.	Upload the certificate to a Key Vault and reference the Key Vault during the Cloud Service (extended support) create operation.
6.	Create Cloud Services deployment

### RDP into role instance
1.	Get the remote desktop file needed to connect to your Cloud Service.

    ```PowerShell 
    Get-AzCloudServiceRoleInstanceRemoteDesktopFile -CloudServiceName $cloudServiceName -ResourceGroupName $resourceGroupName -RoleInstanceName $roleInstanceName OutFile "C:\temp\ContosoFrontEnd_IN_0.rdp"
    ```
2.	Open the file to connect to the role instance. 

## Next steps
For more information, see [Frequently asked questions about Azure Cloud Services (extended support)](faq.md)