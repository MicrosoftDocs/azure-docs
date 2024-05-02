---
author: maud-lv
ms.topic: include
ms.date: 04/25/2024
ms.author: malev
---

1. Under **Basics**, select or enter the following information, then select **Next**. This tab contains basic information about your Split Experimentation Workspace.

    :::image type="content" source=".\media\split-experimentation\create-basic-tab.png" alt-text="Screenshot of the Azure portal, filling out the basic tab to create a new resource.":::

    - **Subscription:** Select the Azure subscription you want to use for the resource.
    - **Resource group:** Select an existing resource group or create a new one for the resource.
    - **Resource name** Enter a name for your Split Experimentation Workspace.
    - **Region:** Select the region where you want to deploy the resource.
    - **Pricing plan:** Select a pricing plan. <!-- details tbd-->

1. Under **Data Source**, select the following information, then select **Next**. The data source is the resource that provides Split with the feature flag impressions and events data for analyzing the experiments.

    :::image type="content" source=".\media\split-experimentation\create-data-source-tab.png" alt-text="Screenshot of the Azure portal, filling out the data source tab to create a new resource.":::

    - Enable **Data Ingestion** by selecting the checkbox to allow ingestion of impressions and events from the data source. If you deselect the checkbox, you can enable data ingestion later using the App Configuration portal by navigating to **Experimentation > Split Experimentation Workspace.**

      > [!NOTE]
      > If you do not enable **Data Ingestion** for your Split Experimentation Workspace resource, feature evaluation and customer events will not be exported from your **Data Source** to Split.

    - Under **Log Analytics workspace**, select the **Application Insights** resource you want to use for this experiment. It must be the same Application Insights workspace you connected to your App Configuration store in the previous step.
    - Under **Export Destination Details**, select the **Storage Account** you want to use for storing impressions and events data. A data export rule will be created in the selected Log Analytics workspace to export data to the storage account entered and configured below.

      > [!NOTE]
      > When creating a new storage account for your experimentation, you must use the same region as your Log Analytics workspace.

1. Under **Data Access Policy**, select the Microsoft Entra ID application to use for authentication and authorization in your Split workspace, then select **Review + create**.

    :::image type="content" source=".\media\split-experimentation\create-data-access-policy-tab.png" alt-text="Screenshot of the Azure portal, filling out the data access policy tab to create a new resource.":::

    If your group already uses a shared enterprise application, you may contact the administrator of your group to add you as a user. Otherwise, create and set up your Microsoft Entra ID application for Split Experimentation Workspace<!--link to the Microsoft Entra ID doc)-->, then add yourself as a user.

1. Under **Review + create**, review the information listed for your new Split Experimentation resource, read the terms, and select **Create**.
