---
title: How to manage Azure Mover projects
description: Learn how to manage Azure Mover projects
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 09/10/2022
ms.custom: template-how-to, devx-track-azurepowershell
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: Reviewed - Stephen
REVIEW Engineering: not reviewed
EDIT PASS: started

Initial doc score: 86
Current doc score: 100 (1307 words and 0 issues)

!########################################################
-->

# Manage Azure Storage Mover projects

A Storage Mover project is used to organize migration jobs into logical tasks or components. A project contains at least one job definition, which in turn describes each data source and target endpoint for your project. The [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md) article contains more detailed information about the relationship between a Storage Mover and its projects.

When you define a project, it's a good idea to add all related, inter-dependent data sources into the same project so that they can be migrated together. You should add all the data sources necessary to migrate a single workload rather than create projects for each data source in your migration plan. You may also choose to create individual projects for each distinct group of data sources in your migration plan.

This article guides you through the creation and management of Azure Storage Mover projects. To follow these examples, you'll need a top-level storage mover resource. If you haven't yet created one, follow the steps within the [Create a Storage Mover resource](storage-mover-create.md) article before continuing.

After you complete the steps within this article, you'll be able to create and manage projects using the Azure portal and Azure PowerShell.

## Create a project

The first step in defining a migration job is the creation of a project resource. After the project has been created, you can add source and target endpoints for your data source. In this example, you'll intentionally leave the **description** field blank. You'll then add it in the [View and edit a project's properties](#view-and-edit-a-projects-properties) section later in this article.

> [!IMPORTANT]
> If you have not yet deployed a resource using the resource provider, you'll need to create your top level resource.

> [!CAUTION]
> Renaming project resources is not supported. It's a good idea to ensure that you've named the project appropriately since you will not be able to change the project name after it is provisioned.

### [Azure portal](#tab/portal)

   1. Navigate to the **Project Explorer** page in the [Azure portal](https://portal.azure.com) to access your projects. The default **All projects** view displays the names of any provisioned projects and a summary of the jobs they contain.

       :::image type="content" source="media/project-manage/project-explorer-sml.png" alt-text="Image of the Project Explorer's Overview tab within the Azure Portal showing " lightbox="media/project-manage/project-explorer-lrg.png":::

   1. Select **Create project** to open the **Create a Project** pane. Provide a project name value in the **Project name** field, but leave the **Project description** field empty. Finally, select **Create** to provision the project.

       :::image type="content" source="media/project-manage/project-explorer-create-sml.png" alt-text="project explorer create" lightbox="media/project-manage/project-explorer-create-lrg.png":::

### [PowerShell](#tab/powershell)
   
   Creating a project requires you to decide on a name. Refer to the [resource naming convention](../azure-resource-manager/management/resource-name-rules.md#microsoftstoragesync) to choose a supported name. A description is optional and can contain up to 1024 single-byte characters.
   
   The `New-AzStorageMoverProject` cmdlet is used to create a new project within a [storage mover resource](storage-mover-create.md) you previously deployed. If you haven't yet installed the `Az.StorageMover` module:

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

   The [Install Azure PowerShell](/powershell/azure/install-azure-powershell) article has more details.

   You'll need to supply values for the required `-Name`, `-ResourceGroupName`, and `-StorageMoverName` parameters. The `-Description` parameter is optional.   

   1. It's always a good idea to create and use variables to store lengthy or potentially complex strings.

      ```powershell
      
      ## Set variables
      $subscriptionID     = "Your subscription ID GUID"
      $resourceGroupName  = "demoResourceGroup"
      $storageMoverName   = "demoMover"
      $projectName        = "demoProject"
      $projectDescription = ""
      
      ```

   1. Connect to your Azure account by using the `Connect-AzAccount` cmdlet. Specify the ID for your subscription by providing a value for the `-Subscription` parameter as shown in the example.

      ```powershell
      
      Connect-AzAccount -Subscription $subscriptionID
      
      ```

   1. After you've successfully connected, you can use the `New-AzStorageMoverProject` cmdlet to create your new project as shown in the following example.

      ```powershell

      New-AzStorageMoverProject `
         -ResourceGroupName $resourceGroupName `
         -StorageMoverName $storageMoverName `
         -Name $projectName `
         -Description $projectDescription
       
      ```

      The following sample response contains the `ProvisioningState` property whose value indicates that the project was successfully created.

      ```Response

      Description                  : This is a project used for demonstration.
      Id                           : /subscriptions/<GUID>/resourceGroups/
                                    demoResourceGroup/providers/Microsoft.StorageMover/storageMovers/
                                    demoMover/projects/demoProject
      Name                         : testingAgain
      ProvisioningState            : Succeeded
      SystemDataCreatedAt          : 8/17/2022 1:19:00 AM
      SystemDataCreatedBy          : user@contoso.com
      SystemDataCreatedByType      : User
      SystemDataLastModifiedAt     : 8/17/2022 1:19:00 AM
      SystemDataLastModifiedBy     : user@contoso.com
      SystemDataLastModifiedByType : User
      Type                         : microsoft.storagemover/storagemovers/projects

      ```

---

## View and edit a project's properties

Depending on your use case, you may need to retrieve either a specific project, or a complete list of all your project resources. You may also need to add or edit a project's description.

Follow the steps in this section to view projects accessible to your Storage Mover resource.

### [Azure portal](#tab/portal)

1. Navigate to the **Project explorer** page within the [Azure portal](https://portal.azure.com) to view a list of available projects. You can create and apply filters to limit or shape your view. To narrow the scope of the results, you can continue to add more filters.

    :::image type="content" source="media/project-manage/project-explorer-filtered-sml.png" alt-text="Image of the Project Explorer's Overview tab within the Azure portal highlighting the use of filters." lightbox="media/project-manage/project-explorer-filtered-lrg.png":::

    Filters may also be edited or removed as needed as shown in the example below. Currently, only filtering projects by name is supported.

    :::image type="content" source="media/project-manage/project-explorer-filter-added-sml.png" alt-text="Image of the Project Explorer's Overview tab within the Azure portal illustrating the use of filters." lightbox="media/project-manage/project-explorer-filter-added-lrg.png":::

1. From within the project explorer pane or the results list, select the name of the project created in the previous section. The project's properties and job summary data are displayed in the **details** pane.

    If the project lacks a valid description, select **Add description** to display the **Edit description** pane.

    :::image type="content" source="media/project-manage/project-explorer-description-new-sml.png" alt-text="Image of the Project Explorer's Overview tab within the Azure portal illustrating the modification of filters." lightbox="media/project-manage/project-explorer-description-new-lrg.png":::

    If a description exists, it will be displayed below the **Description** heading. Select either the **Edit** icon next to the description or the **Edit description** icon to display the editing pane. The image below shows the location of the two icons.

    :::image type="content" source="media/project-manage/project-explorer-description-edit-sml.png" alt-text="Image of the Project Explorer's Project properties tab within the Azure portal. It illustrates the location of the edit controls." lightbox="media/project-manage/project-explorer-description-edit-lrg.png":::

1. In the editing pane, modify your project's description. At the bottom of the pane, select **Save** to commit your changes.

      :::image type="content" source="media/project-manage/project-explorer-edit-sml.png" alt-text="Image of the Edit Description pane within the Project Explorer" lightbox="media/project-manage/project-explorer-edit-lrg.png":::

### [PowerShell](#tab/powershell)

1. Use the `Get-AzStorageMoverProject` cmdlet to retrieve a list of projects resources. Optionally, you can supply a `-Name` parameter value to retrieve a specific project resource. Calling the cmdlet without the optional parameter returns a list of all provisioned projects within your resource group.

   The following example retrieves a specific project resource by specifying the **demoProject** value.

   ```powershell

     Get-AzStorageMoverProject `
       -ResourceGroupName $resourceGroupName `
       -StorageMoverName $storageMoverName `
       -Name "demoProject" 

   ```

   The sample response below contains the specified project's properties, including the empty `Description`.

   ```Response

      Description                  :
      Id                           : /subscriptions/<GUID>/resourceGroups/
                                     demoResourceGroup/providers/Microsoft.StorageMover/storageMovers/
                                     demoMover/projects/demoProject
      Name                         : demoProject
      ProvisioningState            : Succeeded
      SystemDataCreatedAt          : 7/15/2022 6:22:51 PM
      SystemDataCreatedBy          : user@contoso.com
      SystemDataCreatedByType      : User
      SystemDataLastModifiedAt     : 8/16/2022 10:36:52 PM
      SystemDataLastModifiedBy     : user@contoso.com
      SystemDataLastModifiedByType : User
      Type                         : microsoft.storagemover/storagemovers/projects   

   ```

1. In order to add the missing description to the project returned by the cmdlet, you'll need to use the `Update-AzStorageMoverProject` cmdlet. In this instance, however, the `-ResourceGroupName`, `-StorageMoverName`, and `-Name` parameters are all required. You'll also want to provide the missing **Project description** value with the `-Description` parameter as shown in the following example.

   ```powershell

   Update-AzStorageMoverProject `
      -Name demoProject `
      -ResourceGroupName $resourceGroupName `
      -StorageMoverName $storageMoverName `
      -Description "Demo project managed with PowerShell."

   ```

   The `ProvisioningState` included within the response confirms that the project was successfully updated.

   ```Response

     Description                  : Demo project managed with PowerShell.
     Id                           : /subscriptions/<GUID>/resourceGroups/
                                     demoResourceGroup/providers/Microsoft.StorageMover/storageMovers/
                                     demoMover/projects/demoProject
     Name                         : demoProject
     ProvisioningState            : Succeeded
     SystemDataCreatedAt          : 7/15/2022 6:22:51 PM
     SystemDataCreatedBy          : user@contoso.com
     SystemDataCreatedByType      : User
     SystemDataLastModifiedAt     : 8/24/2022 7:47:50 AM
     SystemDataLastModifiedBy     : user@contoso.com
     SystemDataLastModifiedByType : User
     Type                         : microsoft.storagemover/storagemovers/projects

   ```

---

## Delete a project

The removal of a project resource should be a relatively rare occurrence in your production environment, though there may be occasions where it may be helpful. To delete a Storage Mover project resource, follow the provide example.

> [!WARNING]
> Deleting a project is a permanent action and cannot be undone. It's a good idea to ensure that you're prepared to delete the project since you will not be able to restore it at a later time.

# [Azure portal](#tab/portal)

1. Navigate to the **Project Explorer** page in the [Azure portal](https://portal.azure.com) to view your projects and a summary of the jobs they contain.

   :::image type="content" source="media/project-manage/project-explorer-sml.png" alt-text="An image of list of Project resources displayed within the Project Explorer" lightbox="media/project-manage/project-explorer-lrg.png":::

1. First, within either the **Project explorer** pane or the results list, select the name of the project you want to delete. Next, select **Delete project** from within the **Project details** pane. Finally, within the **Confirm project deletion** dialog, select **Delete** to permanently remove your project. Refer to the highlighted selections within the following image if needed.

   :::image type="content" source="media/project-manage/project-explorer-delete-sml.png" alt-text="An image showing the steps to permanently remove a project resource from within the Portal Explorer." lightbox="media/project-manage/project-explorer-delete-lrg.png":::

> [!WARNING]
> Deleting a project will delete all contained job definitions, their run history and results. Deleting any of these resources is permanent and cannot be undone. Storage endpoints are not affected.

# [PowerShell](#tab/powershell)

Use the `Remove-AzStorageMoverProject` to permanently delete a project resource. Provide the project's name with the `-Name` parameter, and resource group and storage mover resource names with the `-ResourceGroupName` and `-StorageMoverName` parameters, respectively.

```powershell

Remove-AzStorageMoverProject `
   -Name $projectName `
   -ResourceGroupName $resourceGroupName `
   -StorageMoverName $storageMoverName

```

> [!WARNING]
> Deleting a project will delete all contained job definitions, their run history and results. Deleting any of these resources is permanent and cannot be undone. Storage endpoints are not affected.

---

## Next steps

After your projects are created, you can begin working with job definitions.
> [!div class="nextstepaction"]
> [Define a migration job](job-definition-create.md)
