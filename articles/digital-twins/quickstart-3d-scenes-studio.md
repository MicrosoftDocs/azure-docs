---
# Mandatory fields.
title: Quickstart - Get started with 3D Scenes Studio
titleSuffix: Azure Digital Twins
description: Learn how to use 3D Scenes Studio for Azure Digital Twins by following this demo, where you'll create a sample scene with elements and behaviors.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 05/04/2022
ms.topic: quickstart
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Quickstart - Get started with 3D Scenes Studio for Azure Digital Twins

Azure Digital Twins *3D Scenes Studio* is an immersive 3D environment, where business and front-line workers can consume and investigate operational data from their Azure Digital Twins solutions with visual context.

In this article, you'll set up all the required resources for using 3D Scenes Studio, including Azure storage resources and an Azure Digital Twins instance with sample data. Then, you'll create a scene in the studio that's connected to the sample Azure Digital Twins environment.

## Prerequisites

You'll need an Azure subscription to complete this quickstart. If you don't have one already, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

You'll also need to download a sample 3D file to use for the scene in this quickstart. [Select this link to download OutdoorTanks.gltf](https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf).

## Set up Azure Digital Twins

The first step in working with Azure Digital Twins is to create an Azure Digital Twins instance. After you create an instance of the service, you can link the instance to a 3D Scenes Studio visualization later in the quickstart.

The rest of this section walks you through the instance creation.

[!INCLUDE [digital-twins-quickstart-setup.md](../../includes/digital-twins-quickstart-setup.md)]

### Collect host name

After deployment completes, use the **Go to resource** button to navigate to the instance's Overview page in the portal.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/deployment-complete.png" alt-text="Screenshot of the deployment page for Azure Digital Twins in the Azure portal. The page indicates that deployment is complete.":::

Next, take note of the instance's **host name** value to use later.

:::image type="content" source="media/quickstart-3d-scenes-studio/host-name.png" alt-text="Screenshot of the Azure portal showing the Overview page for an Azure Digital Twins instance. The host name is highlighted." lightbox="media/quickstart-3d-scenes-studio/host-name.png":::

## Create storage resources

Next, create a new storage account and a container in the account. 3D Scenes Studio will use this storage container to store your 3D file and configuration information. You'll also set up read and write permissions to the storage account.

### Create the storage account 

1. In the Azure portal, search for *storage accounts* in the top search bar. 
1. On the **Storage accounts** page, select **+ Create**.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/create-storage-account-1.png" alt-text="Screenshot of the Azure portal showing the Storage accounts page and highlighting the Create button." lightbox="media/quickstart-3d-scenes-studio/create-storage-account-1.png":::

1. Fill in the details on the **Basics** tab, including your **Subscription** and **Resource group**. Choose a **Storage account name** and **Region**, select **Standard** performance, and select **Geo-redundant storage (GRS)**.
    :::image type="content"  source="media/quickstart-3d-scenes-studio/create-storage-account-2.png" alt-text="Screenshot of the Azure portal showing the Basics tab of storage account creation." lightbox="media/quickstart-3d-scenes-studio/create-storage-account-2.png":::

    Select **Review + create**.

1. You will see a summary page on the **Review + create** tab showing the details you've entered. Confirm and create the storage account by selecting **Create**.
1. After deployment completes, use the **Go to resource button** to navigate to the storage account in the portal.
    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/deployment-complete-storage.png" alt-text="Screenshot of the deployment page for the storage account in the Azure portal. The page indicates that deployment is complete.":::

1. Select **Access Control (IAM)** from the left menu, **+ Add**, and **Add role assignment**.
    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/add-storage-role-1.png" alt-text="Screenshot of the IAM tab for the storage account in the Azure portal.":::

1. Search for *Storage Blob Data Owner* and select **Next**. This level of access will allow you to perform both read and write operations in 3D Scenes Studio.
1. Switch to the **Members** tab. Assign access to a **User, group, or service principal**, and select **+ Select members**. Search for your name in the list and hit **Select**.
    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/add-storage-role-2.png" alt-text="Screenshot of granting a user Storage Blob Data Owner in the Azure portal.":::

    Select **Review + assign** to review the details of your assignment, and **Review + assign** again to confirm and finish the role assignment.

### Create the container

Next, create a private container in the storage account.

1. Select **Containers** from the left menu for the storage account and use **+ Container** to create a new container.

1. Enter a **Name** for the container and set the **Public access level** to **Private**. Select **Create**.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/create-container.png" alt-text="Screenshot of the Azure portal highlighting Containers for the storage account." lightbox="media/quickstart-3d-scenes-studio/create-container.png":::
1. Once the container has been created, open its menu of options and select **Container properties**.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/container-properties.png" alt-text="Screenshot of the Azure portal highlighting the Container Properties for the new container." lightbox="media/quickstart-3d-scenes-studio/container-properties.png":::

    This will bring you to a **Properties** page for the container.
1. Copy the **URL** and save this value to use later.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/container-url.png" alt-text="Screenshot of the Azure portal highlighting the container's U R L value." lightbox="media/quickstart-3d-scenes-studio/container-url.png":::

### Configure CORS

Finally, configure CORS for your storage account. This is necessary for 3D Scenes Studio to access your storage container.

1. Return to the storage account's page in the portal.
1. Scroll down in the left menu to **Resource sharing (CORS)** and select it.
1. On the **Resource sharing (CORS)** page for your storage account, fill in an entry with the following details:
    1. **Allowed origins** - Enter *https://adtexplorer-tsi-local.azurewebsites.net,https://localhost:8443,https://explorer.digitaltwins.azure.net,https://dev.explorer.azuredigitaltwins-test.net*
    1. **Allowed methods** - Select the checkboxes for *GET*, *POST*, *OPTIONS*, and *PUT*.
    1. **Allowed headers** - Enter *Authorization,x-ms-version,x-ms-blob-type*
1. Select **Save**.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/cors.png" alt-text="Screenshot of the Azure portal where the CORS entry is being created and saved." lightbox="media/quickstart-3d-scenes-studio/cors.png":::

## Generate sample environment

In this section, you'll use the *Azure Digital Twins data simulator* tool to generate a sample environment.

1. Navigate to the [data simulator](https://explorer.digitaltwins.azure.net/tools/data-pusher). 
1. In the **Instance URL** space, enter the *host name* of your Azure Digital Twins instance from the [Collect host name](#collect-host-name) section.
1. Use the **Generate environment** button to create a sample environment with models and twins.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator. The Generate environment button is highlighted." lightbox="media/quickstart-3d-scenes-studio/data-simulator.png":::
1. Select **Start simulation** to start sending simulated data to your Azure Digital Twins instance. The simulation will only run while this window is open and the **Start simulation** option is active.

You can view the models and graph that have been created in the [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) tool. To enter the tool, navigate to your Azure Digital Twins instance in the Azure portal and select  **Open Azure Digital Twins Explorer (preview)**.

:::image type="content" source="media/includes/azure-digital-twins-explorer-portal-access.png" alt-text="Screenshot of the Azure portal showing where to open Azure Digital Twins for an Azure Digital Twins instance." lightbox="media/includes/azure-digital-twins-explorer-portal-access.png":::

Then, use the **Run Query** button to query for all the twins and relationships that have been created in the instance.

:::image type="content" source="media/quickstart-3d-scenes-studio/run-query.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Run Query button in the upper-right corner of the window." lightbox="media/quickstart-3d-scenes-studio/run-query.png":::

To see all the models that have been uploaded and how they relate to each other, select **Model graph**.

:::image type="content" source="media/quickstart-3d-scenes-studio/model-graph.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Model Graph button for the view pane." lightbox="media/quickstart-3d-scenes-studio/model-graph.png":::

>[!TIP]
>For an introduction to Azure Digital Twins Explorer, see [Get started with Azure Digital Twins Explorer](quickstart-azure-digital-twins-explorer.md).

## Initialize your 3D Scenes Studio environment

In this section, you'll create an environment in *3D Scenes Studio* and customize your scene for the sample graph that's in your Azure Digital Twins instance.

1. Navigate to the [3D Scenes Studio](http://dev.explorer.azuredigitaltwins-test.net/3dscenes). The studio will open, connected to the Azure Digital Twins instance that you accessed last in the Azure Digital Twins Explorer.
1. Select the **Edit** icon next to the instance name to configure the instance and storage container details.

    :::image type="content" source="media/quickstart-3d-scenes-studio/studio-edit-environment-1.png" alt-text="Screenshot of 3D Scenes Studio highlighting the edit environment icon, which looks like a pencil." lightbox="media/quickstart-3d-scenes-studio/studio-edit-environment-1.png":::

    1. The **Environment URL** should start with *https://*, followed by the *host name* of your instance.
    
    1. For the **Container URL**, enter the URL of your container from the [Create storage resources](#create-storage-resources) step.
    
    1. Select **Save**.
    
    :::image type="content" source="media/quickstart-3d-scenes-studio/studio-edit-environment-2.png" alt-text="Screenshot of 3D Scenes Studio highlighting the Save button for the environment." lightbox="media/quickstart-3d-scenes-studio/studio-edit-environment-2.png":::

### Add a new 3D scene

In this section you'll create a new 3D scene, using the *OutdoorTanks.gltf* model file you downloaded earlier in [Prerequisites](#prerequisites). A *scene* consists of a 3D file, and a configuration file that's created for you automatically.

1. Select the **Add 3D scene** button to start creating a new scene. Enter a **Name** for your scene, and select **Upload file** under **3D file asset**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/add-scene-upload-file.png" alt-text="Screenshot of 3D Scenes Studio highlighting the Add 3D scene button and Upload file option." lightbox="media/quickstart-3d-scenes-studio/add-scene-upload-file.png":::
1. Browse for the *OutdoorTanks.gltf* file on your computer and open it. Select **Create**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/add-scene-create.png" alt-text="Screenshot of creating a new scene in 3D Scenes Studio. The Outdoor Tanks file has been uploaded and the Create button is highlighted." lightbox="media/quickstart-3d-scenes-studio/add-scene-create.png":::
    
    Once the file is uploaded, you'll see it listed back on the main screen of 3D Scenes Studio.
1. Select the scene to open and view it. The scene will open in **Build** mode.

    :::image type="content" source="media/quickstart-3d-scenes-studio/factory-scene.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/factory-scene.png":::

### Create an element

Next, you'll define an *element* in the 3D visualization and link it to a twin in the Azure Digital Twins graph you set up earlier in [Generate sample environment](#generate-sample-environment).

1. Select any tank in the scene visualization. This will bring up the possible element actions. Select **+ Create new element**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-tank-element.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio. A tank is highlighted with an option to create a new element." lightbox="media/quickstart-3d-scenes-studio/new-tank-element.png":::
1. In the **New element** panel, the **Linked twin** dropdown list contains names of all the twins in the connected Azure Digital Twins instance. 

    1. Select *PasteurizationMachine_A01*. This will automatically apply the digital twin ID (`$dtId`) as the element name. You can rename the element to make it understandable for both builders and consumers of the 3D scene.

    1. Select **Create element**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-element-details.png" alt-text="Screenshot of the New element options in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-element-details.png":::

The element will now show up in the list of elements for the scene.

### Create behaviors

Next, you'll create a set of *behaviors* for the element. These behaviors allow you to customize the element's data visuals and the associated business logic. Then, you can explore these data visuals to understand the state of the physical environment.

1. Switch to the **Behaviors** list and select **New behavior**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior.png" alt-text="Screenshot of the New behavior button in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-behavior.png":::
1. For **Display name**, enter *InFlow*. Under **Elements**, select *PasteurizationMachine_A01* (it may already be selected).

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-elements.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Elements options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-elements.png":::
1. Switch to view the **Twins** tab. Here, you can set up aliased twins to leverage more data in your behaviors. After adding an aliased twin to a behavior, you can define the associated digital twins that map to each of your targeted elements. Once you've configured your aliased twins, you'll be able to use properties from those twins in your behavior expressions.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-twins.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Twins options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-twins.png"::: 

    You don't need to do anything in the **Twins** tab for this tutorial.
1. Switch to the **Status** tab. *States* are data-driven overlays on your elements to indicate the health or status of the element. Here, you'll set value ranges for a property on the element to identify its ideal range.

    1. The **Property** dropdown list contains names of all the properties on the twin that's linked to the *PasteurizationMachine_A01* element. Select *LinkedTwin.InFlow*.
 
    1. Set two value ranges so that values *0-100* appear in blue, and *100-Infinity* appear in red (the min range value is inclusive and the max value is exclusive).

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-status.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Status options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-status.png":::
1. Switch to the **Alerts** tab. *Alerts* help grab your attention to quickly understand that a scenario is active for the associated element. Here, you'll create an alert badge to identify when the element is receiving more flow than it's able to output.

    1. For the **Trigger expression**, enter *LinkedTwin.InFlow > LinkedTwin.OutFlow*
 
    1. Set the **Badge icon** and **Badge color**. Enter some **Notification text**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-badges.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Alerts options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-badges.png":::
1. Switch to the **Widgets** tab. Widgets are data-driven visuals that provide additional context and data, to help you understand the scenario that the behavior represents. Here, you'll add visual widgets that the element will use to report on its status. First, you'll add a *gauge widget*.

    1. Select **Add widget**.

        :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-widgets.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Widgets options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-widgets.png":::

        From the **Widget library**, select the **Gauge** widget and then **Add widget**.
    
    1. In the **New widget** options, enter a **Label** of *InFlow*, and set the **Unit of measure** to *m/s*. Set the **Property** to *LinkedTwin.InFlow*. 

        Set two value ranges so that values *-Infinity-0* appear in blue, and *0-Infinity* appear in red.
        
    1. Select **Create widget**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-widget-gauge.png" alt-text="Screenshot of the New widget options in 3D Scenes Studio for a gauge widget." lightbox="media/quickstart-3d-scenes-studio/new-widget-gauge.png":::
1. Next, you'll add a *link* widget.

    1. Again, select **Add widget**. From the **Widget library**, select the **Link** widget and then **Add widget**.

    1. In the **New widget** options, enter a **Label** of *Power BI*. For the **URL**, enter *https://mypbi.biz/${LinkedTwin.$dtId}*.

    1. Select **Create widget**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-widget-link.png" alt-text="Screenshot of the New widget options in 3D Scenes Studio for a link widget." lightbox="media/quickstart-3d-scenes-studio/new-widget-link.png":::
1. The behavior options are now complete. Save the behavior by selecting **Create behavior**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-create.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, highlighting Create behavior." lightbox="media/quickstart-3d-scenes-studio/new-behavior-create.png":::

The *InFlow* behavior set will now show up in the list of behaviors for the scene.

### View

So far, you've been working with 3D Scenes Studio in **Build** mode. Now, switch the mode to **View**. 

:::image type="content" source="media/quickstart-3d-scenes-studio/factory-scene-view-1.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio, highlighting the View mode button." lightbox="media/quickstart-3d-scenes-studio/factory-scene-view-1.png":::

From the list of **Elements**, select the **PasteurizationMachine_A01** element that you created. The visualization will zoom in to show the visual element and display the behaviors you set up for it.

:::image type="content" source="media/quickstart-3d-scenes-studio/factory-scene-view-2.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio, showing the View mode for the pasteurization machine." lightbox="media/quickstart-3d-scenes-studio/factory-scene-view-2.png":::

## Next steps 

Explore the rest of 3D Scenes Studio's capabilities and features in [Use 3D Scenes Studio](how-to-use-3d-scenes-studio.md).