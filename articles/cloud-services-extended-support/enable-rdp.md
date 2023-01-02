---
title: Apply the Remote Desktop in Cloud Services (extended support) 
description: Enable Remote Desktop for Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Apply the Remote Desktop extension to Azure Cloud Services (extended support)

The Azure portal uses the remote desktop extension to enable remote desktop even after the application is deployed. The remote desktop settings for your Cloud Service allows you to enable remote desktop, update the local administrator account, select the certificates used in authentication and set the expiration date for those certificates. 

## Apply Remote Desktop  extension
1. Navigate to the Cloud Service you want to enable remote desktop for and select **"Remote Desktop"** in the left navigation pane.

    :::image type="content" source="media/remote-desktop-1.png" alt-text="Image shows selecting the Remote Desktop option in the Azure portal":::

2. Select **Add**.
3. Choose the roles to enable remote desktop for.
4. Fill in the required fields for user name, password and expiration.

> [Note] 
> The password for remote desktop must be between 8-123 characters long and must satisfy at least 3 of password complexity requirements from the following: 1) Contains an uppercase character 2) Contains a lowercase character 3) Contains a numeric digit 4) Contains a special character 5) Control characters are not allowed

   :::image type="content" source="media/remote-desktop-2.png" alt-text="Image shows inputting the information required to connect to remote desktop.":::

5. When finished, select **Save**. It will take a few moments before your role instances are ready to receive connections.

## Connect to role instances with Remote Desktop enabled
Once remote desktop is enabled on the roles, you can initiate a connection directly from the Azure portal.

1. Click on **Roles and Instances** to open the instance settings.

    :::image type="content" source="media/remote-desktop-3.png" alt-text="Image shows selecting the roles and instances option in the configuration blade.":::

2. Select a role instance that has remote desktop configured.
3. Click **Connect** to download an remote desktop connection file.

    :::image type="content" source="media/remote-desktop-4.png" alt-text="Image shows selecting the worker role instance in the Azure portal.":::
    
4. Open the file to connect to the role instance.

## Update Remote Desktop Extension using PowerShell
Follow the below steps to update your cloud service to the latest module with an RDP extension

1.	Update Az.CloudService module to the [latest version](https://www.powershellgallery.com/packages/Az.CloudService/0.5.0)

```powershell
Update-Module -Name Az.CloudService 
```
 
2.	Remove existing RDP extension to the cloud service 

```powershell
$resourceGroupName='<Resource Group Name>'  
$cloudServiceName='<Cloud Service Name>' 
 
# Get existing cloud service  
$cloudService = Get-AzCloudService -ResourceGroup $resourceGroupName -CloudServiceName $cloudServiceName  
 
# Remove existing RDP Extension from cloud service object  
$cloudService.ExtensionProfile.Extension = $cloudService.ExtensionProfile.Extension | Where-Object { $_.Type-ne "RDP" }  
 ```
 
3.	Add new RDP extension to the cloud service with the latest module

```powershell
# Create new RDP extension object  
$credential = Get-Credential  
$expiration='<Expiration Date>'  
$rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name "RDPExtension" -Credential $credential -Expiration $expiration -TypeHandlerVersion "1.2.1"  
 
# Add RDP extension to existing cloud service extension object  
$cloudService.ExtensionProfile.Extension = $cloudService.ExtensionProfile.Extension + $rdpExtension  
 
# Update cloud service  
$cloudService | Update-AzCloudService  
```

## Next steps 
- Review the [deployment prerequisites](deploy-prerequisite.md) for Cloud Services (extended support).
- Review [frequently asked questions](faq.yml) for Cloud Services (extended support).
- Deploy a Cloud Service (extended support) using the [Azure portal](deploy-portal.md), [PowerShell](deploy-powershell.md), [Template](deploy-template.md) or [Visual Studio](deploy-visual-studio.md).
