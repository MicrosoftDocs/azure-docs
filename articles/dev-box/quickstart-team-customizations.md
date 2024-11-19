---  
title: Quickstart Dev Box Team Customizations
description: Learn how to use Team Customizations to create customized dev boxes for your development team, providing a tailored environment for your projects.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: quickstart
ms.date: 11/06/2024

#customer intent: As a dev center administrator or Project Admin, I want to create an image definition file so that I can create a customized dev box as a proof of concept.  

---
  
# Quickstart: Create a Dev Box with Team Customizations
  
In this quickstart, you create a dev box by using team customizations. Team Customizations uses an image definition file to allow you to create consistently customized dev boxes for your development team, providing a tailored environment for your projects.

[!INCLUDE [customizations-preview-text](includes/customizations-preview-text.md)]
  
## Prerequisites
  
To complete the steps in this article, you must have a dev center configured with a dev box project.  
  
## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]
  
## Create an image definition
  
1. Download the [example YAML customization file](https://aka.ms/devcenter/preview/imaging/examples).  
1. Open the file and examine the tasks.  
   Note that the image definition file specifies a name for the image definition by using a `name` field. Use this name to identify the image definition in the dev box pool.

## Add a catalog to your dev center

To add a catalog, complete the following tasks:

1. Fork the example catalog repository to your GitHub organization.
1. Install and configure the Microsoft Dev Center app
1. Assign permissions in GitHub for the repos.
1. Add your repository as a catalog.

### Fork the example catalog repository
1. Open the [example catalog repository](https://aka.ms/devcenter/preview/imaging/examples).
1. Select **Fork** to fork the repository to your GitHub organization.
 
### Install Microsoft Dev Center app

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your dev center or project.
 
1. In the left menu under **Environment configuration**, select **Catalogs**, and then select **Add**.
 
1. In the **Add catalog** pane, enter, or select the following:
 
   | Field | Value |
   |-----|-----| 
   | **Name** | Enter a name for the catalog. |
   | **Catalog source** | Select **GitHub**. |
   | **Authentication type** | Select **GitHub app**.|

1. To install the Microsoft Dev Center app, select **configure your repositories**.
 
   :::image type="content" source="media/quickstart-team-customizations/add-catalog-configure-repositories.png" alt-text="Screenshot of Azure portal Add catalog with configure your repositories link highlighted." lightbox="media/quickstart-team-customizations/add-catalog-configure-repositories.png":::
 
1. If you're prompted to authenticate to GitHub, authenticate.
 
1. On the **Microsoft DevCenter** page, select **Configure**.
 
   :::image type="content" source="media/quickstart-team-customizations/configure-microsoft-dev-center.png" alt-text="Screenshot of the Microsoft Dev Center app page, with Configure highlighted." lightbox="media/quickstart-team-customizations/configure-microsoft-dev-center.png":::

1. Select the GitHub organization that contains the repository you want to add as a catalog. You must be an owner of the organization to install this app.
 
   :::image type="content" source="media/quickstart-team-customizations/install-organization.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with a GitHub organization highlighted." lightbox="media/quickstart-team-customizations/install-organization.png":::
 
1. On the Install Microsoft DevCenter page, select **Only select repositories**, select the repository you want to add as a catalog, and then select **Install**. 

   :::image type="content" source="media/quickstart-team-customizations/select-one-repository.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with one repository selected and highlighted." lightbox="media/quickstart-team-customizations/select-one-repository.png":::

   You can select multiple repositories to add as catalogs. You must add each repository as a separate catalog, as described in [Add your repository as a catalog](#add-your-repository-as-a-catalog).
 
1. On the **Microsoft DevCenter by Microsoft would like permission to:** page, review the permissions required, and then select **Authorize Microsoft Dev Center**.

   :::image type="content" source="media/quickstart-team-customizations/authorize-microsoft-dev-center.png" alt-text="Screenshot of the Microsoft DevCenter by Microsoft would like permission to page, with authorize highlighted." lightbox="media/quickstart-team-customizations/authorize-microsoft-dev-center.png":::


### Add your repository as a catalog

1. Switch back to the Azure portal. 
 
1. In **Add catalog**, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Repo**  | Select the repository that you want to add as a catalog. |
    | **Branch**  | Select the branch. |
    | **Folder path**  | Select the folder that contains subfolders that hold your environment definitions. |   

   :::image type="content" source="media/quickstart-team-customizations/add-catalog-repo-branch-folder.png" alt-text="Screenshot of Azure portal add catalog, with repo, branch, folder, and add selected." lightbox="media/quickstart-team-customizations/add-catalog-repo-branch-folder.png":::

1. In **Catalogs**, verify that your catalog appears. When the connection is successful, the **Status** reads **Sync successful**.

   :::image type="content" source="media/quickstart-team-customizations/catalog-connection-successful.png" alt-text="Screenshot of Azure portal Catalogs page with a connected status." lightbox="media/quickstart-team-customizations/catalog-connection-successful.png":::
     
  
## Create a dev box pool for the image definition  

To make the customization file, *imagedefintion.yaml*, accessible when creating dev boxes, you specify it as the definition for a pool. When a developer selects that pool to create a dev box from, the image definition is used. 
  
To create a dev box pool associated with a project:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project in which you want to create the dev box pool.

1. Select **Dev box pools**, and then select **Create**.

1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for the pool. The pool name is visible to developers to select when they're creating dev boxes. The name must be unique within a project. |
   | **Definition** | Select the definition, as named in your image definition file. |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select your desired deployment region for the dev boxes. Choose a region close to your dev box users for the optimal user experience. |
   | **Dev box Creator Privileges** | Select **Local Administrator** or **Standard User**. |
   | **Enable Auto-stop** | **Yes** is the default. Select **No** to disable an auto-stop schedule. You can configure an auto-stop schedule after the pool is created. |
   | **Stop time** | Select a time to shut down all the dev boxes in the pool. All dev boxes in this pool shut down at this time every day. |
   | **Time zone** | Select the time zone for the stop time. |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="media/quickstart-team-customizations/create-pool-basics.png" alt-text="Screenshot of the 'Create a dev box pool Basics' pane, showing fields for Name and Definition, with MyImageDefintion.yaml highlighted.":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to ensure that the image and network pass the validation criteria for dev boxes. 
 
  
## Create a dev box from the dev box pool  

When you create a dev box from a dev box pool, the image definition is applied to the dev box. The dev box is created with the customizations specified in the image definition file.
  
To create a dev box in the Microsoft Dev Box developer portal:

1. Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).

1. Select **New** > **New dev box**.

1. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | Select a project from the dropdown list. |
   | **Dev box pool** | Select a pool from the dropdown list, which includes all the dev box pools for that project. Choose a dev box pool near to you for least latency.|

   After you make your selections, the page shows you the following information:

   - How many dev boxes you can create in the project that you selected, if the project has limits configured.
   - Whether *Hibernation* is supported or not.
   - Whether *Customizations* is enabled or not.
   - A shutdown time if the pool where you're creating the dev box has a shutdown schedule.
   - A notification that the dev box creation process can take 25 minutes or longer.
   
1. Select **Create** to begin creating your dev box.

1. To track the progress of creation, use the dev box tile in the developer portal.
  
## Verify the customization is applied  

DevBox applies customizations as the final stage of the creation process. Dev Box emails you to let you know that the dev box is ready. Then you can check that your customizations are applied.
  
1. Wait for email confirmation that the dev box is created.  
1. In the developer portal, check that the customizations are applied. On the dev box tile, select **Actions** > **Customizations**.

   :::image type="content" source="media/quickstart-team-customizations/developer-portal-actions-customizations.png" alt-text="Screenshot of the Dev box tile, showing the Action menu with Customizations highlighted.":::

1. In the **Customization details** pane, you can see the customizations that were applied to the dev box.  

   :::image type="content" source="media/quickstart-team-customizations/developer-portal-customizations.png" alt-text="Screenshot of the Customizations details pane, showing the customizations that were applied to the dev box.":::
  
## Clean up resources  
  
[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]
  
## Related content  
- [Microsoft Dev Box Team Customizations](concept-what-are-team-customizations.md)
- [Write a customization file](./how-to-write-customization-file.md) 