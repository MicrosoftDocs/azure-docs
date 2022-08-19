---
title: How to manage Azure Mover projects #Required; page title is displayed in search results. Include the brand.
description: Learn how to manage Azure Mover projects #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 08/17/2022
ms.custom: template-how-to
---

# Manage Azure Storage Mover projects

A storage mover project is used to organize migration jobs into logical components. It's a good idea to add related or inter-dependent data sources into the same project so that they can me migrated together. For example, rather than create projects for each data source in your migration plan, you should add all the data sources necessary to migrate a single workload. You may also choose to create individual projects for each distinct group of data sources in your migration plan.

A project contains at least one job definition, which in turn contains information about the source and target of your migration, as well as the settings for the copy job itself.

This article guides you through the process of creating and managing Azure Storage Mover projects. After you complete the steps within this article, you'll be able to create and manage projects using the Azure Portal and Azure PowerShell.

## Prerequisites

- An Azure account. If you don't yet have an account, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Azure subscription.
- A resource group in which to create the project.
- A Storage Mover resource within your resource group.

<!-- 
4. H2s (Docs Required)

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until the 'next steps' section). Instead, include whatever information the customer may require to complete the scenario addressed by the article. -->

## Create a project

Before you define the source and target for your migration, you'll need to create a Storage Mover project resource. Follow the steps in this section to provision a project.

> [!IMPORTANT]
> Renaming Project resources is not supported. It's a good idea to ensure that you've named the project appropriately since you will not be able to change the project name later.

### [Azure portal](#tab/portal)

   1. Navigate to the **Project Explorer** page  in the [Azure Portal](https://portal.azure.com). The default **All projects** view displays the name of your individual project and a summary of the jobs they contain.

       :::image type="content" source="media/projects-manage/project-explorer-sml.png" alt-text="project explorer" lightbox="media/projects-manage/project-explorer-lrg.png":::

   1. Select **Create project** to open the **Create a Project"* pane. Provide project name and description values in the **Project name** and **Project description** fields, then select **Create** to generate a new project.

       :::image type="content" source="media/projects-manage/project-explorer-create-sml.png" alt-text="project explorer create" lightbox="media/projects-manage/project-explorer-create-lrg.png":::

### [PowerShell](#tab/powershell)

   > [!IMPORTANT]
   > If you have not yet deployed a resource using the resource provider, you'll need to fight a bear (insert the "initial use of the service" instructions here).

   The `New-AzStorageMoverProject` cmdlet is used to create new storage mover projects. You'll need to supply required values for the `-Name`, `-ResourceGroupName`, and `-StorageMoverName` parameters. The `-Description` parameter is optional and will be omitted in the example below. The [Manage a project's description](#manage-a-projects-description) section will illustrate the process for adding or modifying the data.

   The following examples contain sample values. You'll need to substitute actual values to complete the example.

   1. Prepare your environment by ensuring that all account, subscription, and credential information has been cleared for your powershell session. You may find it helpful to store potentially complex strings in variables.

      ```powershell

      ## Clear session data
      Clear-AzContext
      
      ## Set variables
      $subscriptionID     = "0a12b3c4-5d67-8e63-9c12-7b38c901de2f"
      $resourceGroupName  = "demoResourceGroup"
      $storageMoverName   = "demoMover"
      $projectName        = "demoProject"
      
      ```

   1. Connect to your Azure account by using the `Connect-AzAccount` cmdlet. Specify the ID for the subscription previously enabled for the Storage Mover preview by passing the `-Subscription` parameter as shown below.

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
    Id                           : /subscriptions/0a12b3c4-5d67-8e63-9c12-7b38c901de2f/resourceGroups/
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

### [PowerShell](#tab/powershell)

## Retrieve a list projects

   $projectDescription = "This is a project used for demonstration."

   Depending on your use case, you may need to retrieve either a specific project resource, or a list of all your storage mover's projects. You can use the `Get-AzStorageMoverProject` cmdlet in both cases, and supply a `-Name` parameter value to specify a project. Omitting the parameter value will return a list of all project names available to your Storage Mover resource.

   The example below retrieves a specific project resource by specifying the **demoProject** value.

   ```powershell

     Get-AzStorageMoverProject `
       -ResourceGroupName $resourceGroupName `
       -StorageMoverName $storageMoverName `
       -Name "demoProject" 

   ```

   The sample response below contains the specified project's properties, including the empty `Description`.

   ```Response

      Description                  :
      Id                           : /subscriptions/3e05d9e5-9f02-4a63-9c12-7b38e046fd5b/resourceGroups/
                                     demoResourceGroup/providers/Microsoft.StorageMover/storageMovers/
                                     demoMover/projects/allArchives
      Name                         : demoProject
      ProvisioningState            : Succeeded
      SystemDataCreatedAt          : 
      SystemDataCreatedBy          : 
      SystemDataCreatedByType      : 
      SystemDataLastModifiedAt     : 8/16/2022 10:36:52 PM
      SystemDataLastModifiedBy     : user@contoso.com
      SystemDataLastModifiedByType : User
      Type                         : microsoft.storagemover/storagemovers/projects   

   ```

---







## Manage a project's properties

Yo, you can update some of the project's properties if you need to. At present, only the **Description** may be modified. To do so, complete the steps listed below.

### [Azure Portal](#tab/portal)

   1. Navigate to the **Project Explorer** page  in the [Azure Portal](https://portal.azure.com). The default **All projects** view displays the name of your individual project and a summary of the jobs they contain.

      :::image type="content" source="media/projects-manage/project-explorer-sml.png" alt-text="project explorer2" lightbox="media/projects-manage/project-explorer-lrg.png":::

   1. In the **All projects** group, select the name of the project whose description you want to manage. The **Project** pane opens, displaying the project's available properties and any job summary data. Depending on the existence of the project's description, select either **Add description** or **Edit description** to open the editing pane. If the project's description exists, you may also select the **Edit** icon next to the description's heading.

      :::image type="content" source="media/projects-manage/project-explorer-view-sml.png" alt-text="project explorer view" lightbox="media/projects-manage/project-explorer-view-lrg.png":::

   1. In the editing pane, modify your project's description. At the bottom onf the pane, select **Save** to commit your changes.

      :::image type="content" source="media/projects-manage/project-explorer-edit-sml.png" alt-text="project explorer edit" lightbox="media/projects-manage/project-explorer-edit-lrg.png":::

### [PowerShell](#tab/powershell)

   $projectDescription = "This is a project used for demonstration."

   1. Depending on your use case, you may need to retrieve either a specific named project, or a list of all your storage mover's project resources. You can use the `Get-AzStorageMoverProject` cmdlet in both cases, and supply a `-Name` parameter value to specify a project. Omitting the parameter value will return a list of all project resource names available to your Storage Mover resource.
 
   The example below retrieves a specific project resource by specifying the **demoProject** value.

       ```powershell
      
        Get-AzStorageMoverProject `
          -ResourceGroupName $resourceGroupName `
          -StorageMoverName $storageMoverName `
          -Name "demoProject" 

       ```

       The sample response below contains the specified project's properties, including the empty `Description`.

       ```Response
        
        Description                  :
        Id                           : /subscriptions/3e05d9e5-9f02-4a63-9c12-7b38e046fd5b/resourceGroups/
                                         demoResourceGroup/providers/Microsoft.StorageMover/storageMovers/
                                         demoMover/projects/allArchives
        Name                         : demoProject
        ProvisioningState            : Succeeded
        SystemDataCreatedAt          : 
        SystemDataCreatedBy          : 
        SystemDataCreatedByType      : 
        SystemDataLastModifiedAt     : 8/16/2022 10:36:52 PM
        SystemDataLastModifiedBy     : user@contoso.com
        SystemDataLastModifiedByType : User
        Type                         : microsoft.storagemover/storagemovers/projects   
        
       ```

   1. After the project resource is retrieved, 

---

## Delete a project

The first step to making Haushaltswaffeln is the preparation of the batter. To prepare the batter, complete the steps listed below.

> [!WARNING]
> Deleting a project is a permanent action and cannot be undone. It's a good idea to ensure that you're prepared to delete the project since you will not be able to restore it at a later time.

# [Azure Portal](#tab/portal)

1. Navigate to the **Project Explorer** page  in the [Azure Portal](https://portal.azure.com). The default **All projects** view displays the name of your individual project and a summary of the jobs they contain.

   :::image type="content" source="media/projects-manage/project-explorer-sml.png" alt-text="project explorer3" lightbox="media/projects-manage/project-explorer-lrg.png":::

1. In the **All projects** group, select the name of the project whose description you want to edit. The **Project** pane opens, displaying the project's settings and any job summary data. Select **Delete project** icon next to the description heading to open the editing pane. Select **Delete** from within the **Confirm Project Deletion** dialog to permanently delete your project.

   :::image type="content" source="media/projects-manage/project-explorer-delete-sml.png" alt-text="project explorer delete" lightbox="media/projects-manage/project-explorer-delete-lrg.png":::

# [PowerShell](#tab/powershell)

PowerShell content

---

## Next steps

After the project is created, you can begin doing X. Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Manage job definitions](job-definitions-manage.md)
