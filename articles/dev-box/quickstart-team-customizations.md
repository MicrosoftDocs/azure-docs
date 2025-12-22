---  
title: Quickstart Dev Box Team Customizations
description: Learn how to use team customizations to create customized dev boxes for your development team, providing a tailored environment for your projects.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 08/25/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to create an image definition file so that I can create a customized dev box as a proof of concept.  

---
  
# Quickstart: Create a dev box by using team customizations

In this quickstart, you create a dev box by using Microsoft Dev Box team customizations. The feature uses an image definition file so that you can create consistently customized dev boxes for your development team and provide a tailored environment for your projects.
  
 
## Prerequisites

| Product | Requirements |
|---------|--------------|
| Microsoft Dev Box  | - Set up a [dev center with a dev box pool and a dev box project](./quickstart-get-started-template.md) so you can create a dev box.</br>- Attach a catalog to the dev center with tasks you can use in your image definition file. If you don't have a catalog, see [Add and configure a catalog from GitHub or Azure Repos](./how-to-configure-catalog.md).</br>**- Permissions**</br>- *To create a dev box:* Join the Dev Box Users security group for at least one project.</br>- *To enable project-level catalogs for a dev center:* Platform engineer with write access on the subscription.</br>- *To enable catalog sync settings for a project:* Platform engineer with write access on the subscription.</br>- *To attach a catalog to a project:* Dev Center Project Admin or Contributor permissions on the project.</br>- *To create a customization file:* None specified. Anyone can create a customization file.</br>- *To use the developer portal to upload and apply a YAML file during dev box creation:* Dev Box User.</br>- *To add tasks to a catalog:* Permission to add to the repository that hosts the catalog. |
| Visual Studio Code | - Install the latest version |
  
## Create an image definition
  
To create a dev box with customizations, you must create an image definition file. The image definition file is a YAML file that contains the customizations that you want to apply to the dev box. You can use the example image definition file in this quickstart as a starting point.

## Enable project-level catalogs

You must enable project-level catalogs at the dev center level before you can add a catalog to a project.

1. In the [Azure portal](https://portal.azure.com), go to your dev center.
1. On the service menu, under **Settings**, select **Dev center settings**.
1. Under **Project level catalogs**, select **Enable catalogs per project**, and then select **Apply**.

    :::image type="content" source="media/quickstart-team-customizations/dev-center-settings-project-catalog.png" alt-text="Screenshot showing the Dev center settings, with Enable catalogs per project selected and highlighted." lightbox="media/quickstart-team-customizations/dev-center-settings-project-catalog.png":::

## Add a catalog to your project

The sections that follow walk you through these tasks:

1. Fork the example catalog repository to your GitHub organization.
1. Configure sync settings to synchronize the catalog with your project.
1. Add your repository as a catalog.

### Fork the example catalog repository

1. Open the [example catalog repository](https://aka.ms/devcenter/preview/imaging/examples/repo).

1. Select **Fork** > **Create a new fork** to fork the repository to your GitHub organization.

   :::image type="content" source="media/quickstart-team-customizations/dev-box-new-fork.png" alt-text="Screenshot showing the eShop repo in GitHub, with Create a new fork highlighted.":::

### Configure catalog sync settings

1. Switch back to the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Select the project you want to add the catalog to.

1. On the left menu, select **Settings** > **Catalogs**.

1. Select **Sync settings**.

   :::image type="content" source="./media/quickstart-team-customizations/dev-box-project-catalog-sync-settings.png" alt-text="Screenshot of the Catalogs pane in the Azure portal, with the button for sync settings highlighted." lightbox="./media/quickstart-team-customizations/dev-box-project-catalog-sync-settings.png":::

1. On the **Sync settings** pane:
    - If **Image definitions** is cleared, select it and select **Save**.
    - If **Image definitions** is already selected, select **Cancel**.

   :::image type="content" source="./media/quickstart-team-customizations/dev-box-project-catalog-sync-image-definitions.png" alt-text="Screenshot of the pane for sync settings in the Azure portal, with the checkbox for image definitions highlighted." lightbox="./media/quickstart-team-customizations/dev-box-project-catalog-sync-image-definitions.png":::

### Add your repository as a catalog

1. On the Catalogs page, select **Add**.

1. On the **Add catalog** pane, enter or select the following values:

   | Field | Value |
   |-----|-----|
   | **Name** | Enter a name for the catalog. |
   | **Catalog source** | Select **GitHub**. |
   | **Authentication type** | Select **GitHub app**.|

1. Select the **configure your repositories** link.

   :::image type="content" source="media/quickstart-team-customizations/dev-box-add-catalog-configure-repositories.png" alt-text="Screenshot of the Azure portal that shows selections for adding a catalog with the link for configuring repositories highlighted." lightbox="media/quickstart-team-customizations/dev-box-add-catalog-configure-repositories.png":::

1. If you're prompted to authenticate to GitHub, authenticate.

1. On the **Microsoft DevCenter** page, select **Configure**.

   :::image type="content" source="media/quickstart-team-customizations/configure-microsoft-dev-center.png" alt-text="Screenshot of the Microsoft Dev Center app page, with the Configure button highlighted." lightbox="media/quickstart-team-customizations/configure-microsoft-dev-center.png":::

1. Select the GitHub organization that contains the repository you want to add as a catalog. You must be an owner of the organization to install this app.

   :::image type="content" source="media/quickstart-team-customizations/github-microsoft-dev-center-install-organization.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with a GitHub organization highlighted." lightbox="media/quickstart-team-customizations/github-microsoft-dev-center-install-organization.png":::

1. On the **Install Microsoft DevCenter** page, select **Only select repositories**, select the repository that you want to add as a catalog, and then select **Save**.

   :::image type="content" source="media/quickstart-team-customizations/github-microsoft-dev-center-select-one-repository.png" alt-text="Screenshot of the Install Microsoft DevCenter page, with one repository selected and highlighted." lightbox="media/quickstart-team-customizations/github-microsoft-dev-center-select-one-repository.png":::

   You can select multiple repositories to add as catalogs. You must add each repository as a separate catalog, as described in the [next section of this quickstart](#add-your-repository-as-a-catalog).

1. Switch back to the [Azure portal](https://portal.azure.com).
 
1. On the **Add catalog** pane, select **Sign in with GitHub**.

1. On the **Add catalog** pane, enter the following information, and then select **Add**:

    | Field | Value |
    | ----- | ----- |
    | **Repo**  | Select the repository that contains your image definition.</br>Example: *eShop*  |
    | **Branch**  | Select the branch.</br>Example: *main*  |
    | **Folder path**  | Select the folder that contains subfolders that hold your image definitions.</br>Example: *.devcenter/catalog/image-definitions* |

1. In the **Catalogs** pane, verify that your catalog appears. When the connection is successful, the **Status** column shows **Sync successful**.

   :::image type="content" source="media/quickstart-team-customizations/dev-box-project-catalog-sync-successful.png" alt-text="Screenshot of the Catalogs page showing a catalog with a sync successful status." lightbox="media/quickstart-team-customizations/dev-box-project-catalog-sync-successful-lg.png":::

1. Verify that the image definitions are correctly synced. On the left menu, select **Manage** > **Image definitions**. In this example, you see two image definitions:
    - **backend-dev** - This image is a Microsoft Visual Studio + Tools image on Windows 11, suitable for the eShop *backend* engineering environment.
    - **frontend-dev** - This image is a Microsoft Visual Studio + Tools image on Windows 11, suitable for the eShop *frontend* engineering environment.
 
   :::image type="content" source="media/quickstart-team-customizations/dev-box-project-image-definitions.png" alt-text="Screenshot of the Image definitions page showing the image definitions imported from the catalog." lightbox="media/quickstart-team-customizations/dev-box-project-image-definitions-lg.png"::: 
 
## Create a dev box pool for the image definition  

To make the customization file, imagedefintion.yaml, accessible for creating dev boxes, you specify it as the image definition for a pool.
  
To create a dev box pool associated with a project:

1. In the [Azure portal](https://portal.azure.com).

1. In the search box, enter **projects**. In the list of results, select **Projects**.

1. Open the project in which you want to create the dev box pool.

1. On the left menu, select **Manage** > **Dev box pools**

1. On the **Dev box pools** page, select **Create**.

1. On the **Create a dev box pool** pane, enter the following values:

   | Setting | Value |
   |---|---|
   | **Name** | Enter a descriptive name for the pool. The pool name is visible to developers to select when they're creating dev boxes, so include the purpose and region of the pool. The name must be unique within a project. </br>Example: *contoso-frontend-westUS* |
   | **Definition** | From the image definition section of the list, select an image definition.</br>Example: *contoso-catalog/frontend-dev* |
   | **Compute** | Select the compute resources for the dev boxes in the pool. </br>Example: *8 vCPU, 32-GB RAM* |
   | **Storage** | Select the storage options for the dev boxes in the pool. </br>Example: *256 GB SSD* |
   | **Hibernation** | Hibernation is supported when the source image and compute size are both hibernation compatible. |
   | **Network connection** | 1. Select **Deploy to a Microsoft hosted network**. </br>2. Select a deployment region for the dev boxes. Choose a region close to your dev box users for the optimal user experience. </br>Example: *West US* |
   | **Licensing** | Select this checkbox to confirm that your organization has Azure Hybrid Benefit licenses that you want to apply to the dev boxes in this pool. |

   :::image type="content" source="media/quickstart-team-customizations/dev-box-create-pool-basics.png" alt-text="Screenshot of the Basics pane for creating a new a dev box pool.":::

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
   | **Name** | Enter a name for your dev box. Dev box names must be unique within a project.</br>Example: *contoso-frontend-dev-box* |
   | **Project** | The developer portal lists the projects you have access to. Select the project you need from the  list. |
   | **Dev box pool** | The developer portal lists all the dev box pools for the project you selected. Select the appropriate pool for your work. Choose a dev box pool near to you for the lowest latency.|
   | **Apply customizations** | Leave this check box cleared. It's used to apply user customizations. In this article you've configured team customizations. |

   After you make your selections, the page shows the following information:

   - Whether hibernation is supported or not.
   - A notification that the dev box creation process can take 25 minutes or longer.

1. Select **Create** to begin creating your dev box.

1. To track the progress of creation, use the dev box tile in the developer portal.
  
## Verify that the customizations are applied  

Dev Box applies customizations as the final stage of the creation process. Dev Box emails you when the dev box is ready. Then you can check that your customizations are applied.

1. Wait for the dev box to be created.

1. In the developer portal, on the dev box tile, select **Actions** > **Customizations**.

   :::image type="content" source="media/quickstart-team-customizations/developer-portal-actions-customizations.png" alt-text="Screenshot of the dev box tile, showing the Actions menu with the Customizations command highlighted.":::

1. On the **Customization details** pane, confirm the customizations that were applied to the dev box.  

   :::image type="content" source="media/quickstart-team-customizations/developer-portal-customizations.png" alt-text="Screenshot of the pane for customization details, showing the customizations that were applied to the dev box.":::
  
## Clean up resources  
  
[!INCLUDE [clean-up-resources](includes/clean-up-resources.md)]
  
## Related content

- [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md)
- [Write a customization file for a dev box](./how-to-write-customization-file.md)
