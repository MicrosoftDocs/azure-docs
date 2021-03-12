---
title: Publish notebooks to the Azure Cosmos DB notebook gallery
description: Learn how to download notebooks from the public gallery, edit them, and publish your own notebooks to the gallery.
author: deborahc
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 03/02/2021
ms.author: dech
---

# Publish notebooks to the Azure Cosmos DB notebook gallery
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Azure Cosmos DB built-in Jupyter Notebooks are directly integrated into your Azure Cosmos DB accounts in the Azure portal. Using these notebooks, you can analyze and visualize your data from the Azure portal. Built-in notebooks for Azure Cosmos DB are currently available in [many regions](https://azure.microsoft.com/global-infrastructure/services/?products=cosmos-db&regions=all). To use notebooks, [create a new Cosmos account](create-cosmosdb-resources-portal.md) or [enable notebooks on an existing account](enable-notebooks.md) in one of these regions.

The notebook environment in the Azure portal has some samples published by the Azure Cosmos DB team. It also has a public gallery where you can publish and share your own notebooks. After a notebook is published to the gallery, it's available for all the Azure Cosmos DB users to view and use. In this article, you will learn how to use notebooks from the public gallery and publish your notebook to the gallery.

## Download a notebook from the gallery

Use the following steps to view and download notebooks from the gallery to your own notebooks workspace:

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account that is enabled with notebook environment.

1. Navigate to the **Data Explorer** > **Notebooks** > **Gallery** > **Public gallery** tab.

1. Accept the [code of conduct](https://azure.microsoft.com/support/legal/cosmos-db-public-gallery-code-of-conduct/)  before you view or publish notebooks in the gallery. The code of conduct is logged per user, per the subscription level. When you switch to a different subscription, you must accept it again before accessing the gallery. To accept the code of conduct, select the checkbox and **Continue**:

   :::image type="content" source="./media/publish-notebook-gallery/view-public-gallery.png" alt-text="Navigate to the notebooks public gallery and accept the code of conduct.":::

1. Next you can add a specific notebook to your favorites tab or download it. When you download a notebook, it’s copied to your notebooks workspace where you can run or edit it.

   :::image type="content" source="./media/publish-notebook-gallery/download-notebook-gallery.png" alt-text="Download a notebook from the gallery to your workspace.":::

## Publish a notebook to the gallery

When you build your own notebooks or edit the existing notebooks to fit a different scenario, you may want to publish them to the gallery. After a notebook is published to the gallery, other users can access it. You can [explore notebook samples gallery](https://cosmos.azure.com/gallery.html) to view the currently available notebooks.

Use the following steps to publish a notebook:

1. Sign into the [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account that is enabled with notebook environment.

1. Navigate to the **Data Explorer** > **Notebooks** > **My Notebooks** tab.

1. Go to the notebook that you want to publish. Select the **Save** button in the command bar and then select **Publish to gallery**:

   :::image type="content" source="./media/publish-notebook-gallery/choose-notebook-publish-option-2.png" alt-text="Choose a notebook to publish to the gallery.":::

   You can also find the **Publish to gallery** option by selecting the **…** button next to the notebook name:

   :::image type="content" source="./media/publish-notebook-gallery/choose-notebook-publish.png" alt-text="Another approach to choose a notebook to publish to the gallery.":::

1. Fill the **Publish to gallery** form with the following details:

   * **Name:** A friendly name to identify your notebook.
   * **Description:**  A short description of what your notebook does.
   * **Tags:** Tags are optional and are used to filter results when searched by a keyword.
   * **Cover image:** An image that’s used on the cover page when the notebook is published. You can choose one of the following options:
   * **Custom image** - You can upload an image from your computer. Choose an image file with aspect ratio 256x144.
   * **URL** - Provide a publicly accessible URL where the image is located.
   * **Take screenshot** - A screenshot of your open notebook is automatically taken and uploaded to the preview.
   * **Use first display output** - Output of the first cell that has a display output. Cells that only display markdown/text don't count as a display output.

   :::image type="content" source="./media/publish-notebook-gallery/publish-notebook.png" alt-text="Fill out the publish to gallery form.":::

   > [!NOTE]
   > If you are using the **Publish to gallery** option from the **…** button next to the notebook name, you won't see all the **Cover image** options. That's because the notebook may not be open and Azure Cosmos DB will not have access to take a screenshot or access the first display output.

1. Verify that the preview looks good and select **Publish**. When published, this notebook will appear in the Azure Cosmos DB notebooks public gallery. Make sure you have removed any sensitive data or output before publishing. The notebook content is scanned for any violation of Microsoft policies before publishing. This process usually takes a few seconds to complete. If any violations are found, a message is displayed in the notification tab. Your notebook will not be published if it finds any violation, you remove the violated text and publish it again.

   > [!NOTE]
   > After the notebooks are published to the public gallery, all the Azure Cosmos DB users can view them. The access is not limited to per subscription, or per organization level.

1. After the notebook is published to the gallery, you can see it within the **My published work** tab. You can also remove or delete notebooks you’ve published from the public gallery.

1. You can also report a notebook that violates the code of conduct. If a violation is found, Cosmos DB automatically removes the notebook from gallery. If a notebook is removed, users can see it under the **My published work** tab with the removed note. To report a notebook, go to the **Data Explorer** > **Notebooks** > **Gallery** > **Public gallery** tab. Open the notebook you want to report, hover on the **Help** button on the right-hand corner and select **Report Abuse**.

   :::image type="content" source="./media/publish-notebook-gallery/report-notebook-violation.png" alt-text="Report a notebook that violates the code of conduct.":::

## Next steps

* Learn about the benefits of [Azure Cosmos DB Jupyter Notebooks](cosmosdb-jupyter-notebooks.md)
* [Use Python notebook features and commands](use-python-notebook-features-and-commands.md)
* [Use C# notebook features and commands](use-csharp-notebook-features-and-commands.md)
* [Import notebooks from a GitHub repo](import-github-notebooks.md)
