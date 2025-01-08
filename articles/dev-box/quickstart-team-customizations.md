---  
title: Quickstart Dev Box Team Customizations
description: Learn how to use team customizations to create customized dev boxes for your development team, providing a tailored environment for your projects.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 11/06/2024

#customer intent: As a Dev Center Admin or Project Admin, I want to create an image definition file so that I can create a customized dev box as a proof of concept.  

---
  
# Quickstart: Create a dev box by using team customizations
  
In this quickstart, you create a dev box by using Microsoft Dev Box team customizations. The feature uses an image definition file so that you can create consistently customized dev boxes for your development team and provide a tailored environment for your projects.

[!INCLUDE [customizations-preview-text](includes/customizations-preview-text.md)]
  
## Prerequisites
  
To complete the steps in this quickstart, you must have a dev center configured with a dev box project.  
  
## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]
  
## Create an image definition
  
1. Download the [example YAML customization file](https://aka.ms/devcenter/preview/imaging/examples).  
1. Open the file and examine the tasks.  

The image definition file specifies a name for the image definition by using a `name` field. Use this name to identify the image definition in the dev box pool.

## Enable project-level catalogs

You must enable project-level catalogs at the dev center level before you can add a catalog to a project.

1. In the [Azure portal](https://portal.azure.com), go to your dev center.
1. On the service menu, under **Settings**, select **Configuration**.

    :::image type="content" source="media/quickstart-team-customizations/dev-center-overview.png" alt-text="Screenshot that shows the Overview page for a dev center with Configuration highlighted." lightbox="media/quickstart-team-customizations/dev-center-overview.png":::

1. On the **Project level catalogs** pane, select **Enable catalogs per project**, and then select **Apply**.

    :::image type="content" source="media/quickstart-team-customizations/dev-center-project-catalog-selected.png" alt-text="Screenshot that shows the pane for project-level catalogs, with the checkbox for enabling catalogs per project highlighted." lightbox="media/quickstart-team-customizations/dev-center-project-catalog-selected.png":::

## Add a catalog to your project

The sections that follow walk you through these tasks:

1. Fork the example catalog repository to your GitHub organization.
1. Install and configure the Microsoft Dev Center app.
1. Assign permissions in GitHub for the repos.
1. Add your repository as a catalog.

### Fork the example catalog repository

1. Open the [example catalog repository](https://aka.ms/devcenter/preview/imaging/examples/repo).
1. Select **Fork** to fork the repository to your GitHub organization.

### Install the Microsoft Dev Center app

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your dev center or project.

1. On the service menu, under **Environment configuration**, select **Catalogs**, and then select **Add**.

1. On the **Add catalog** pane, enter or select the following values:

   | Field | Value |
   |-----|-----|
   | **Name** | Enter a name for the catalog. |
   | **Catalog source** | Select **GitHub**. |
   | **Authentication type** | Select **GitHub app**.|

1. Select the **configure your repositories** link.

   :::image type="content" source="media/quickstart-team-customizations/add-catalog-configure-repositories.png" alt-text="Screenshot of the Azure portal that shows selections for adding a catalog with the link for configuring repositories highlighted." lightbox="media/quickstart-team-customizations/add-catalog-configure-repositories.png":::

1. If you're prompted to authenticate to GitHub, authenticate.

1. On the **Microsoft DevCenter** page, select **Configure**.

   :::image type="content" source="media/quickstart-team-customizations/configure-microsoft-dev-center.png" alt-text="Screenshot of the Microsoft Dev Center app page, with the Configure button highlighted." lightbox="media/quickstart-team-customizations/configure-microsoft-dev-center.png":::

1. Select the GitHub organization that contains the repository you want to add as a catalog. You must be an owner of the organization to install this app.

   :::image type="content" source="media/quickstart-team-customizations/install-organization.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with a GitHub organization highlighted." lightbox="media/quickstart-team-customizations/install-organization.png":::

1. On the **Install Microsoft DevCenter** page, select **Only select repositories**, select the repository that you want to add as a catalog, and then select **Install**.

   :::image type="content" source="media/quickstart-team-customizations/select-one-repository.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with one repository selected and highlighted." lightbox="media/quickstart-team-customizations/select-one-repository.png":::

   You can select multiple repositories to add as catalogs. You must add each repository as a separate catalog, as described in the [next section of this quickstart](#add-your-repository-as-a-catalog).

1. On the **Microsoft DevCenter by Microsoft would like permission to** page, review the required permissions, and then select **Authorize Microsoft DevCenter**.

   :::image type="content" source="media/quickstart-team-customizations/authorize-microsoft-dev-center.png" alt-text="Screenshot of the page that requests Microsoft DevCenter permissions, with the button for authorizing permissions highlighted." lightbox="media/quickstart-team-customizations/authorize-microsoft-dev-center.png":::

### Add your repository as a catalog

1. Switch back to the Azure portal.

1. On the **Add catalog** pane, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Repo**  | Select the repository that you want to add as a catalog. |
    | **Branch**  | Select the branch. |
    | **Folder path**  | Select the folder that contains subfolders that hold your environment definitions. |

   :::image type="content" source="media/quickstart-team-customizations/add-catalog-repo-branch-folder.png" alt-text="Screenshot of the Azure portal pane for adding a catalog, with the boxes for repo, branch, and folder path highlighted. The Add button is also highlighted." lightbox="media/quickstart-team-customizations/add-catalog-repo-branch-folder.png":::

1. On the **Catalogs** pane, verify that your catalog appears. When the connection is successful, the **Status** column shows **Sync successful**.

   :::image type="content" source="media/quickstart-team-customizations/catalog-connection-successful.png" alt-text="Screenshot of the Azure portal's Catalogs pane with a connected status." lightbox="media/quickstart-team-customizations/catalog-connection-successful.png":::

## Create a dev box pool for the image definition  

To make the customization file, imagedefintion.yaml, accessible for creating dev boxes, you specify it as the image definition for a pool.
  
To create a dev box pool that's associated with a project:

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

   :::image type="content" source="media/quickstart-team-customizations/create-pool-basics.png" alt-text="Screenshot of the pane for entering basic information about a new a dev box pool, including fields for name and definition. The image definition MyImageDefinition.yaml is highlighted.":::

1. Select **Create**.

1. Verify that the new dev box pool appears in the list. You might need to refresh the screen.

The Azure portal deploys the dev box pool and runs health checks to ensure that the image and network pass the validation criteria for dev boxes.

## Create a dev box from the dev box pool  

When you create a dev box from a dev box pool, the image definition is applied to the dev box. The dev box is created with the customizations that the image definition file specified.
  
To create a dev box in the Microsoft Dev Box developer portal:

1. Sign in to the [Microsoft Dev Box developer portal](https://aka.ms/devbox-portal).

1. Select **New** > **New dev box**.

1. In **Add a dev box**, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project. |
   | **Project** | Select a project from the dropdown list. |
   | **Dev box pool** | Select a pool from the dropdown list, which includes all the dev box pools for that project. Choose a dev box pool near to you for the lowest latency.|

   After you make your selections, the page shows the following information:

   - How many dev boxes you can create in the project that you selected, if the project has limits configured.
   - Whether hibernation is supported or not.
   - Whether customizations are enabled or not.
   - A shutdown time if the pool where you're creating the dev box has a shutdown schedule.
   - A notification that the dev box creation process can take 25 minutes or longer.

1. Select **Create** to begin creating your dev box.

1. To track the progress of creation, use the dev box tile in the developer portal.
  
## Verify that the customization is applied  

Dev Box applies customizations as the final stage of the creation process. Dev Box emails you when the dev box is ready. Then you can check that your customizations are applied.
  
1. Wait for email confirmation that the dev box is created.  
1. In the developer portal, on the dev box tile, select **Actions** > **Customizations**.

   :::image type="content" source="media/quickstart-team-customizations/developer-portal-actions-customizations.png" alt-text="Screenshot of the dev box tile, showing the Actions menu with the Customizations command highlighted.":::

1. On the **Customization details** pane, confirm the customizations that were applied to the dev box.  

   :::image type="content" source="media/quickstart-team-customizations/developer-portal-customizations.png" alt-text="Screenshot of the pane for customization details, showing the customizations that were applied to the dev box.":::
  
## Clean up resources  
  
[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]
  
## Related content

- [Microsoft Dev Box team customizations](concept-what-are-team-customizations.md)
- [Write a customization file for a dev box](./how-to-write-customization-file.md)