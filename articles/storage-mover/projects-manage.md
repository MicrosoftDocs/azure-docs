---
title: How to manage Azure Mover projects #Required; page title is displayed in search results. Include the brand.
description: Learn how to manage Azure Mover projects #Required; article description that is displayed in search results. 
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: how-to
ms.date: 08/15/2022
ms.custom: template-how-to
---

# Manage Azure Storage Mover projects

A storage mover project is used to organize migration jobs into logical components. It's a good idea to add all your data sources that need to be migrated together into the same project. Rather than create projects for each data source in your migration plan, for example, you should add all data sources necessary to migrate a single workload. You may also create individual projects for distinct groups of data sources in your migration plan.

A project contains at least one job definition, which in turn contains information about the source and target of your migration, as well as the settings for the copy job itself.

This article guides you through the process of creating and managing Azure Storage Mover projects. After you complete the steps within this article, you'll be able to create and manage projects using the Azure Portal and PowerShell. 

## Prerequisites

- An Azure account. If you don't yet have an account, you can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Azure subscription enabled for the Storage Mover preview.
- A resource group in which to create the project.
- A Data Mover resource within your resource group.
- An NFS share available on a machine reachable through your local network.

<!-- 
4. H2s (Docs Required)

Prescriptively direct the customer through the procedure end-to-end. Don't link to other content (until 'next steps'), but include whatever the customer needs to complete the scenario in the article. -->

## Create a project

The first step to making Haushaltswaffeln is the preparation of the batter. To prepare the batter, complete the steps listed below.

   > [!IMPORTANT]
   > Renaming Project resources is not supported. It's a good idea to ensure that you've named the project appropriately since you will not be able to change the project name later.

# [PowerShell](#tab/powershell)

PowerShell content

# [CLI](#tab/cli)

CLI content

# [Azure Portal](#tab/portal)

1. Navigate to the **Project Explorer** page  in the [Azure Portal](https://portal.azure.com). The default **All projects** view displays the name of your individual project and a summary of the jobs they contain.

   :::image type="content" source="media/projects-manage/project-explorer-sml.png" alt-text="project explorer" lightbox="media/projects-manage/project-explorer-lrg.png":::

1. Select **Create project** to open the **Create a Project"* pane. Provide project name and description values in the **Project name** and **Project description** fields, then select **Create** to generate a new project.

   :::image type="content" source="media/projects-manage/project-explorer-create-sml.png" alt-text="project explorer create" lightbox="media/projects-manage/project-explorer-create-lrg.png":::

---








## Manage a project's description

The first step to making Haushaltswaffeln is the preparation of the batter. To prepare the batter, complete the steps listed below.

# [PowerShell](#tab/powershell)

PowerShell content

# [CLI](#tab/cli)

CLI content

# [Azure Portal](#tab/portal)

1. Navigate to the **Project Explorer** page  in the [Azure Portal](https://portal.azure.com). The default **All projects** view displays the name of your individual project and a summary of the jobs they contain.

   :::image type="content" source="media/projects-manage/project-explorer-sml.png" alt-text="project explorer2" lightbox="media/projects-manage/project-explorer-lrg.png":::

1. In the **All projects** group, select the name of the project whose description you want to manage. The **Project** pane opens, displaying the project's available properties and any job summary data. Depending on the existence of the project's description, select either **Add description** or **Edit description** to open the editing pane. If the project's description exists, you may also select the **Edit** icon next to the description's heading.

   :::image type="content" source="media/projects-manage/project-explorer-view-sml.png" alt-text="project explorer view" lightbox="media/projects-manage/project-explorer-view-lrg.png":::

1. In the editing pane, modify your project's description. At the bottom onf the pane, select **Save** to commit your changes.

   :::image type="content" source="media/projects-manage/project-explorer-edit-sml.png" alt-text="project explorer edit" lightbox="media/projects-manage/project-explorer-edit-lrg.png":::
---
















## Edit a project's description

The first step to making Haushaltswaffeln is the preparation of the batter. To prepare the batter, complete the steps listed below.

# [PowerShell](#tab/powershell)

PowerShell content

# [CLI](#tab/cli)

CLI content

# [Azure Portal](#tab/portal)

1. Navigate to the **Project Explorer** page  in the [Azure Portal](https://portal.azure.com). The default **All projects** view displays the name of your individual project and a summary of the jobs they contain.

   :::image type="content" source="media/projects-manage/project-explorer-sml.png" alt-text="project explorer2" lightbox="media/projects-manage/project-explorer-lrg.png":::

1. In the **All projects** group, select the name of the project whose description you want to edit. The **Project** pane opens, displaying the project's settings and any job summary data. Select **Edit description** or the **Edit** icon next to the description heading to open the editing pane.

   :::image type="content" source="media/projects-manage/project-explorer-view-sml.png" alt-text="project explorer view" lightbox="media/projects-manage/project-explorer-view-lrg.png":::

1. In the editing pane, modify your project's description. At the bottom onf the pane, select **Save** to commit your changes.

   :::image type="content" source="media/projects-manage/project-explorer-edit-sml.png" alt-text="project explorer edit" lightbox="media/projects-manage/project-explorer-edit-lrg.png":::
---










After the project is created, you can begin doing X.

## Cook the batter

In this section, you will cook the batter prepared in the previous section, resulting in a batch of warm and delicious Haushaltswaffeln.

Use the steps below to create your first batch.

1. Heat up a waffle maker.
1. Fill about ½ cup of batter in the waffle maker.
1. Close the waffle maker and bake the waffles until golden and crisp.

After the Haushaltswaffeln are cooked to perfection, it's time to serve your guests. This process is described in the next section.

## Serve the Haushaltswaffeln

Although you can dress Haushaltswaffeln up with a sprinkling of powdered sugar, they really need no embellishment. The flavour is rich and buttery, and they are nicely sweetened. You can give your callers the option to sprinkle some powdered sugar over the Haushaltswaffeln, or add whipped cream and fruit.

## Next steps

Advance to the next article to learn how to...
> [!div class="nextstepaction"]
> [Manage job definitions](job-definitions-manage.md)
