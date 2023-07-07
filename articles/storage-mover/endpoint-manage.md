---
title: How to manage Azure Mover endpoints
description: Learn how to manage Azure Storage Mover endpoints
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 06/30/2023
ms.custom: template-how-to
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: Reviewed - Stephen
REVIEW Engineering: not reviewed
EDIT PASS: started

Initial doc score: 86
Current doc score: 100 (1332 words and 0 issues)

!########################################################
-->

# Manage Azure Storage Mover endpoints

While the term *endpoint* is often used in networking, it's used in the context of the Storage Mover service to describe a storage location with a high level of detail. An endpoint contains the path to the storage location and additional information. Endpoints are used in the creation of a job definition. Only certain types of endpoints may be used as a source or a target, respectively.

This article guides you through the creation and management of Azure Storage Mover endpoints. To follow these examples, you need a top-level storage mover resource. If you haven't yet created one, follow the steps within the [Create a Storage Mover resource](storage-mover-create.md) article before continuing.

After you complete the steps within this article, you'll be able to create and manage endpoints using the Azure portal and Azure PowerShell.

## Endpoint resource overview

Within the Azure Storage Mover resource hierarchy, a migration project is used to organize migration jobs into logical tasks or components. A migration project in turn contains at least one job definition, which describes each data source and target endpoint for your project. The [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md) article contains more detailed information about the relationship between a Storage Mover and its projects.

Because migrations require well defined source and target locations, endpoint resources are parented to the top-level storage mover resource. This placement allows you to reuse endpoints across any number of job definitions. While there's a single endpoint resource, the properties of each endpoint may vary based on its type. For example, NFS shares, SMB shares, and Azure Storage blob container endpoints each require fundamentally different information.

Currently, endpoints support NFS (Network File System) and SMB (Server Message Block) protocols.

### SMB endpoints

 SMB uses the ACL (access control list) concept and user-based authentication to provide access to shared files for selected users. To maintain security, Storage Mover relies on Azure Key Vault integration to securely store and tightly control access to user credentials and other secrets. Storage mover agent resources can then connect to your SMB endpoints with Key Vault rather than with unsecure hard-coded credentials. This approach greatly reduces the chance that secrets may be accidentally leaked. After configuring your local file share source, add secrets for both `username` and `password` to Key Vault. You need to supply your both your Key Vault's URI and the names of the secrets when creating your SMB endpoints.

In addition to Key Vault secrets, your agents must be granted access to your Key Vault and target storage account resources. This access is provided by the Azure role-based access control (Azure RBAC) authorization system, which assigns roles to your agents' managed identities. It's important to note that the required RBAC role assignments are created for you when SMB endpoints are created within the Azure portal. Endpoints created programmatically require you to make these assignments manually:

|Role                                        |Resource                                                   |
|--------------------------------------------|-----------------------------------------------------------|
|*Key Vault Secrets User*                    | Key Vault resource used to store your SMB credentials     |
|*Storage File Data Privileged Contributor*  | Storage Account resource to containing your migrated data |

### NFS endpoints

This paragraph discusses the NFS-specific endpoints. Hostname/IP address and share name.

## Create endpoints

Before you can create a job definition, you need to create endpoints for your source and target data sources. In this example, leave the **description** field blank; it's added within the [View and edit an endpoint's properties](#view-and-edit-an-endpoints-properties) section later in this article.

> [!IMPORTANT]
> If you have not yet deployed a Storage Mover resource using the resource provider, you'll need to create your top level resource.

> [!CAUTION]
> Renaming endpoint resources is not supported. It's a good idea to ensure that you've named the project appropriately since you will not be able to change the project name after it is provisioned. To circumvent this, you may choose to create a new endpoint with the same properties and a different name as shown in a later section. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name.

Azure Storage Mover supports migration scenarios using NFS and SMB. The steps to create the endpoints are very similar. The key differentiator between the creation of SMB and NFS endpoints is the use of Azure Key Vault to securely store the source fileshare's shared credential. The shared credentials stored within Key Vault will be accessed by agents when a migration job is run. Access to Key Vault secrets are managed by granting an RBAC role assignment to the agent's managed identity.  

### [Azure portal](#tab/portal)

   To create an endpoint using the Navigate to the [Azure portal](https://portal.azure.com), navigate to the **Storage mover** resource page. Select **Storage endpoints** from within the navigation pane as shown in the following image.

   :::image type="content" source="media/resource-hierarchy/storage-mover.png" alt-text="Image of the Storage Mover resource page within the Azure Portal showing the location of the Storage Endpoints link." lightbox="media/resource-hierarchy/storage-mover-lrg.png":::

   1. Select **Create project** to open the **Create a Project** pane. Provide a project name value in the **Project name** field, but leave the **Project description** field empty. Finally, select **Create** to provision the project.

       :::image type="content" source="media/resource-hierarchy/resource-hierarchy-large.png" alt-text="Image of the Create Endpoint screen" lightbox="media/project-manage/project-explorer-create-lrg.png":::

### [PowerShell](#tab/powershell)

   The `New-AzStorageMoverProject` cmdlet is used to create a new endpoint within a [storage mover resource](storage-mover-create.md) you previously deployed. If you haven't yet installed the `Az.StorageMover` module:

   ```powershell
   ## Ensure you are running the latest version of PowerShell 7
   $PSVersionTable.PSVersion

   ## Your local execution policy must be set to at least remote signed or less restrictive
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

   ## If you don't have the general Az PowerShell module, install it first
   Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force

   ## Lastly, the Az.StorageMover module is not installed by default and must be manually requested.
   Install-Module -Name Az.StorageMover -Scope CurrentUser -Repository PSGallery -Force
   ```

   See the [Install Azure PowerShell](/powershell/azure/install-azure-powershell) article for more help installing Azure PowerShell.

   You need to supply values for the required parameters. The `-Description` parameter is optional and is added in a later section.

   1. It's always a good idea to create and use variables to store lengthy or potentially complex strings.

      ```powershell
      
      ## Set variables
      $subscriptionID    = "[Subscription GUID]"
      $resourceGroupName = "[Resource group name]"
      $storageMoverName  = "[Storage mover resource's name]"
      $sourceHost        = "[SMB file share's host name or IP address]"
      $sourceShare       = "[SMB file share's name]"
      $targetResourceID  = "/subscriptions/[GUID]/resourceGroups/demoResrouceGroup/"
      $targetResourceID += "providers/Microsoft.Storage/storageAccounts/demoAccount"
      $targetFileshare   = "[Target fileshare name]"
      $usernameURI       = "https://demo.vault.azure.net/secrets/demoUser"
      $passwordURI       = "https://demo.vault.azure.net/secrets/demoPassword"
      
      ```

   1. Connect to your Azure account by using the `Connect-AzAccount` cmdlet. Specify the ID for your subscription by providing a value for the `-Subscription` parameter as shown in the example.

      ```powershell
      
      Connect-AzAccount -Subscription $subscriptionID
      
      ```

   1. After you've successfully connected, you can create a new SMB source endpoint by using the `New-AzStorageMoverSmbEndpoint` cmdlet as shown in the following example.

      ```powershell

      New-AzStorageMoverSmbEndpoint `
         -Name "smbSourceEndpoint"
         -ResourceGroupName $resourceGroupName `
         -StorageMoverName $storageMoverName `
         -Host $sourceHost ` 
         -ShareName $sourceShare `
         -CredentialsUsernameUri $usernameURI `
         -CredentialsPasswordUri $passwordURI
       
      ```

   1. Create a corresponding SMB file share endpoint by using the `New-AzStorageMoverAzStorageSmbFileShareEndpoint` cmdlet as shown.

      ```powershell

      New-AzStorageMoverAzStorageSmbFileShareEndpoint `
         -Name "smbTargetEndpoint" ` 
         -ResourceGroupName $resourceGroupName `
         -StorageMoverName $storageMoverName ` 
         -StorageAccountResourceId $targetResourceID `
         -FileShareName $targetFileshare

      ```

      The following sample response contains the `ProvisioningState` property whose value indicates that the endpoint was successfully created.

      ```Response

      Id                           : /subscriptions/<GUID>/resourceGroups/
                                    demoResourceGroup/providers/Microsoft.StorageMover/
                                    storageMovers/demoMover/endpoints/smbTargetEndpoint
      Name                         : demoTarget
      Property                     : {
                                       "endpointType": "AzureStorageSmbFileShare",
                                       "description": "",
                                       "provisioningState": "Succeeded",
                                       "storageAccountResourceId": "/subscriptions/[GUID]/
                                        resourceGroups/demoResourceGroup/providers/Microsoft.Storage/
                                        storageAccounts/contosoeuap",
                                       "fileShareName": "demoFileshare"
                                     }
      SystemDataCreatedAt          : 6/22/2023 1:19:00 AM
      SystemDataCreatedBy          : user@contoso.com
      SystemDataCreatedByType      : User
      SystemDataLastModifiedAt     : 6/22/2023 1:19:00 AM
      SystemDataLastModifiedBy     : user@contoso.com
      SystemDataLastModifiedByType : User
      Type                         : microsoft.storagemover/storagemovers/endpoints

      ```

---

## View and edit an endpoint's properties

Depending on your use case, you may need to retrieve either a specific endpoint, or a complete list of all your endpoint resources. You may also need to add or edit an endpoint's description.

Follow the steps in this section to view endpoints accessible to your Storage Mover resource.

### [Azure portal](#tab/portal)

   1. Navigate to the **Storage endpoints** page in the [Azure portal](https://portal.azure.com) to access your endpoints. The default **Source endpoints** view displays the names of your endpoints along with data about their protocol, host, share, and associated job definitions.

       :::image type="content" source="media/resource-hierarchy/resource-hierarchy.png" alt-text="Image of the Storage Endpoints tab within the Azure Portal showing the default Source Endpoints view" lightbox="media/resource-hierarchy/resource-hierarchy-large.png":::

   1. Select **Create project** to open the **Create a Project** pane. Provide a project name value in the **Project name** field, but leave the **Project description** field empty. Finally, select **Create** to provision the project.

       :::image type="content" source="media/resource-hierarchy/resource-hierarchy-large.png" alt-text="Image of the Create Endpoint screen" lightbox="media/project-manage/project-explorer-create-lrg.png":::

### [PowerShell](#tab/powershell)

1. Use the `Get-AzStorageMoverProject` cmdlet to retrieve a list of projects resources. Optionally, you can supply a `-Name` parameter value to retrieve a specific project resource. Calling the cmdlet without the optional parameter returns a list of all provisioned projects within your resource group.

   The following example retrieves a specific project resource by specifying the **demoTarget** name value.

   ```powershell

     Get-AzStorageMoverEndpoint `
       -ResourceGroupName $resourceGroupName `
       -StorageMoverName $storageMoverName ` 
       -Name "demoTarget" 

   ```

   The sample response contains the specified project's properties, including the empty `Description` property.

   ```Response

   Id                           : /subscriptions/<GUID>/resourceGroups/
                                    demoResourceGroup/providers/Microsoft.StorageMover/
                                    storageMovers/demoMover/endpoints/smbTargetEndpoint
   Name                         : demoTarget
   Property                     : {
                                    "endpointType": "AzureStorageSmbFileShare",
                                    "description": "",
                                    "provisioningState": "Succeeded",
                                    "storageAccountResourceId": "/subscriptions/[GUID]/
                                     resourceGroups/demoResourceGroup/providers/Microsoft.Storage/
                                     storageAccounts/contosoeuap",
                                    "fileShareName": "demoFileshare"
                                  }
   SystemDataCreatedAt          : 6/22/2023 1:19:00 AM
   SystemDataCreatedBy          : user@contoso.com
   SystemDataCreatedByType      : User
   SystemDataLastModifiedAt     : 6/22/2023 1:19:00 AM
   SystemDataLastModifiedBy     : user@contoso.com
   SystemDataLastModifiedByType : User
   Type                         : microsoft.storagemover/storagemovers/endpoints

   ```

1. You can add the missing description to the endpoint returned in the previous example by including a pipeline operator and the `Update-AzStorageMoverAzStorageSmbFileShareEndpoint` cmdlet. The following example provides the missing **SMB fileshare endpoint** value with the `-Description` parameter.

   ```powershell

     Get-AzStorageMoverEndpoint `
       -ResourceGroupName $resourceGroupName `
       -StorageMoverName $storageMoverName ` 
       -Name "demoTarget" | `
     Update-AzStorageMoverAzStorageSmbFileShareEndpoint `
       -Description "SMB fileshare endpoint"

   ```

   The response now contains the updated `Description` property value.

   ```Response

   Id                           : /subscriptions/<GUID>/resourceGroups/
                                    demoResourceGroup/providers/Microsoft.StorageMover/
                                    storageMovers/demoMover/endpoints/smbTargetEndpoint
   Name                         : demoTarget
   Property                     : {
                                    "endpointType": "AzureStorageSmbFileShare",
                                    "description": "SMB fileshare endpoint",
                                    "provisioningState": "Succeeded",
                                    "storageAccountResourceId": "/subscriptions/[GUID]/
                                     resourceGroups/demoResourceGroup/providers/Microsoft.Storage/
                                     storageAccounts/contosoeuap",
                                    "fileShareName": "demoFileshare"
                                  }
   SystemDataCreatedAt          : 6/22/2023 1:19:00 AM
   SystemDataCreatedBy          : user@contoso.com
   SystemDataCreatedByType      : User
   SystemDataLastModifiedAt     : 6/22/2023 1:19:00 AM
   SystemDataLastModifiedBy     : user@contoso.com
   SystemDataLastModifiedByType : User
   Type                         : microsoft.storagemover/storagemovers/endpoints

   ```

---

## Delete an endpoint

The removal of an endpoint resource should be a relatively rare occurrence in your production environment, though there may be occasions where it may be helpful. To delete a Storage Mover endpoint resource, follow the provided example.

> [!WARNING]
> Deleting an endpoint is a permanent action and cannot be undone. It's a good idea to ensure that you're prepared to delete the endpoint since you will not be able to restore it at a later time.

# [Azure portal](#tab/portal)

   1. Navigate to the **Storage endpoints** page in the [Azure portal](https://portal.azure.com) to access your endpoints. The default **Source endpoints** view displays the names of your endpoints along with data about their protocol, host, share, and associated job definitions.

       :::image type="content" source="media/resource-hierarchy/resource-hierarchy.png" alt-text="Image of the Storage Endpoints tab within the Azure Portal showing the default Source Endpoints view" lightbox="media/resource-hierarchy/resource-hierarchy-large.png":::

   1. Select **Create project** to open the **Create a Project** pane. Provide a project name value in the **Project name** field, but leave the **Project description** field empty. Finally, select **Create** to provision the project.

       :::image type="content" source="media/resource-hierarchy/resource-hierarchy-large.png" alt-text="Image of the Create Endpoint screen" lightbox="media/project-manage/project-explorer-create-lrg.png":::

# [PowerShell](#tab/powershell)

Use the `Remove-AzStorageMoverEndpoint` to permanently delete an endpoint resource. Provide the endpoint's name with the `-Name` parameter, and resource group and storage mover resource names with the `-ResourceGroupName` and `-StorageMoverName` parameters, respectively.

```powershell

Remove-AzStorageMoverEndpoint `
   -ResourceGroupName $resourceGroupName `
   -StorageMoverName $storageMoverName ` 
   -Name "demoTarget"

```

---

## Next steps

After your endpoints are created, you can begin working with migration projects.
> [!div class="nextstepaction"]
> [Define a migration job](project-manage.md)
