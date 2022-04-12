---
# Mandatory fields.
title: Get started with 3D Scene Studio
titleSuffix: Azure Digital Twins
description: See how to set up 3D Scene Studio for Azure Digital Twins.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 04/12/2022
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Get started with 3D Scene Studio for Azure Digital Twins

Azure Digital Twins [3D Scene Studio](concepts-3d-scene-studio.md) is an immersive 3D environment, where business and front-line workers can consume and investigate operational data from their Azure Digital Twins solutions with visual context.

In this article, you'll set up all the required resources for using 3D Scene Studio. Then, you'll create a scene in the studio that's connected to a sample Azure Digital Twins environment.

## Prerequisites

For this article, you'll need to set up an Azure Digital Twins instance and make sure you have at least *data contributor* access to the instance. For instructions, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md). 

You'll need the instance's *host name* value, which you can get from the instance's overview page in the Azure portal. 

You'll also need one sample file, which contains 3D modeling information that will be used for a scene in 3D Scene Studio. [Select this link to download OutdoorTanks.gltf](https://cardboardresources.blob.core.windows.net/cardboard-mock-files/OutdoorTanks.gltf).

## Create storage resources

First, create a new storage account. 

1. Navigate to the [Azure portal](https://portal.azure.com) and search for *storage accounts* in the top search bar. 
1. On the **Storage accounts** page, select **+ Create**.

    :::image type="content"  source="media/how-to-get-started-3d-scene-studio/create-storage-account.png" alt-text="Screenshot of the Azure portal showing the Storage accounts page and highlighting the Create button." lightbox="media/how-to-get-started-3d-scene-studio/create-storage-account.png":::
1. Follow the portal process to create a storage account. For detailed steps and information on all setup options, see [Create a storage account](/storage/common/storage-account-create?tabs=azure-portal).
1. When the account is finished deploying, navigate to it in the Azure portal.
1. Select **Access Control (IAM)** from the left menu and use it to grant yourself *Storage Blob Data Owner* access to the storage account. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

Next, create a private container in the storage account.

1. Select **Containers** from the left menu for the storage account and use **+ Container** to create a new container.
1. Enter a **Name** for the container and set the **Public access level** to **Private**. Select **Create**.

    :::image type="content"  source="media/how-to-get-started-3d-scene-studio/create-container.png" alt-text="Screenshot of the Azure portal highlighting Containers for the storage account." lightbox="media/how-to-get-started-3d-scene-studio/create-container.png":::
1. Once the container has been created, open its menu of options and select **Container properties**.

    :::image type="content"  source="media/how-to-get-started-3d-scene-studio/container-properties.png" alt-text="Screenshot of the Azure portal highlighting the Container Properties for the new container." lightbox="media/how-to-get-started-3d-scene-studio/container-properties.png":::

    This will bring you to a **Properties** page for the container.
1. Copy the **URL** and save this value to use later.

    :::image type="content"  source="media/how-to-get-started-3d-scene-studio/container-url.png" alt-text="Screenshot of the Azure portal highlighting the container's URL value." lightbox="media/how-to-get-started-3d-scene-studio/container-url.png":::

Finally, configure CORS for your storage account.
1. Return to the storage account's page in the portal.
1. Scroll down in the left menu to **Resource sharing (CORS)** and select it.
1. On the **Resource sharing (CORS)** page for your storage account, fill in an entry with the following details:
    1. **Allowed origins** - Enter *https://adtexplorer-tsi-local.azurewebsites.net,https://localhost:8443,https://explorer.digitaltwins.azure.net,https://dev.explorer.azuredigitaltwins-test.net*
    1. **Allowed methods** - Select the checkboxes for *GET*, *POST*, *OPTIONS*, and *PUT*.
    1. **Allowed headers** - Enter *Authorization,x-ms-version,x-ms-blob-type*
1. Select **Save**.

    :::image type="content"  source="media/how-to-get-started-3d-scene-studio/cors.png" alt-text="Screenshot of the Azure portal where the CORS entry is being created and saved." lightbox="media/how-to-get-started-3d-scene-studio/cors.png":::

## Generate sample environment

In this section, you'll use the *Azure Digital Twins data simulator* tool to generate a sample environment.

1. Navigate to the [data simulator](https://explorer.digitaltwins.azure.net/tools/data-pusher). 
1. In the **Instance URL** space, enter the *host name* of your Azure Digital Twins instance from the [Prerequisites](#prerequisites) section.
1. Use the **Generate environment** button to create a sample environment with models and twins.

    :::image type="content"  source="media/how-to-get-started-3d-scene-studio/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator. The Generate environment button is highlighted." lightbox="media/how-to-get-started-3d-scene-studio/data-simulator.png":::

You can view the graph that's been created in the [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) tool. To enter the tool, navigate to your Azure Digital Twins instance in the Azure portal and select  **Open Azure Digital Twins Explorer (preview)**.

:::image type="content" source="media/includes/azure-digital-twins-explorer-portal-access.png" alt-text="Screenshot of the Azure portal showing the Overview page for an Azure Digital Twins instance. There's a highlight around the Open Azure Digital Twins Explorer (preview) button." lightbox="media/includes/azure-digital-twins-explorer-portal-access.png":::

Then, use the **Run Query** button to query for all the twins and relationships that have been created in the instance.

:::image type="content" source="media/how-to-get-started-3d-scene-studio/run-query.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Run Query button in the upper-right corner of the window." lightbox="media/how-to-get-started-3d-scene-studio/run-query.png":::

## View scenes in 3D Scene Studio

In this section, you'll connect your Azure Digital Twins instance to a visual scene in *3D Scene Studio*, and customize visualization for sample data.

1. Navigate to the [3D Scene Studio](http://dev.explorer.azuredigitaltwins-test.net/3dscenes). The studio will open, connected to the Azure Digital Twins instance that you accessed last in the Azure Digital Twins Explorer.
1. Select the **Edit** icon next to the instance name to configure the instance and storage container details.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/studio-edit-environment-1.png" alt-text="Screenshot of 3D Scene Studio highlighting the edit environment icon, which looks like a pencil." lightbox="media/how-to-get-started-3d-scene-studio/studio-edit-environment-1.png":::

    1. The **Environment URL** should start with *https://*, followed by the *host name* of your instance from the [Prerequisites](#prerequisites) section.
    
    1. For the **Container URL**, enter the URL of your container from the [Create storage resources](#create-storage-resources) step.
    
    1. Select **Save**.
    
    :::image type="content" source="media/how-to-get-started-3d-scene-studio/studio-edit-environment-2.png" alt-text="Screenshot of 3D Scene Studio highlighting the Save button for the environment." lightbox="media/how-to-get-started-3d-scene-studio/studio-edit-environment-2.png":::

### Add a new 3D scene

In this section you'll create a new 3D scene, using the *OutdoorTanks.gltf* model file you downloaded earlier in [Prerequisites](#prerequisites). A *scene* is a view of a single business environment.

1. Select the **Add 3D scene** button to start creating a new scene. Enter a **Name** for your scene, and select **Upload file** under **3D file asset**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/add-scene-upload-file.png" alt-text="Screenshot of 3D Scene Studio highlighting the Add 3D scene button and Upload file option." lightbox="media/how-to-get-started-3d-scene-studio/add-scene-upload-file.png":::
1. Browse for the *OutdoorTanks.gltf* file on your computer and open it. Select **Create**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/add-scene-create.png" alt-text="Screenshot of creating a new scene in 3D Scene Studio. The Outdoor Tanks file has been uploaded and the Create button is highlighted." lightbox="media/how-to-get-started-3d-scene-studio/add-scene-create.png":::
    
    Once the file is uploaded, you'll see it listed back on the main screen of 3D Scene Studio.
1. Select the scene to open and view it. The scene will open in **Build** mode.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/factory-scene.png" alt-text="Screenshot of the factory scene in 3D Scene Studio." lightbox="media/how-to-get-started-3d-scene-studio/factory-scene.png":::

### Create an element

Next, you'll define an *element* in the 3D visualization and link it to a twin in the Azure Digital Twins graph you set up earlier in [Generate sample environment](#generate-sample-environment).

1. Select the first tank in the scene visualization. This will bring up the possible element actions. Select **+ Create new element**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-tank-element.png" alt-text="Screenshot of the factory scene in 3D Scene Studio. A tank is highlighted with an option to create a new element." lightbox="media/how-to-get-started-3d-scene-studio/new-tank-element.png":::
1. In the **New element** panel, the **Linked twin** dropdown list contains names of all the twins in the connected Azure Digital Twins instance. 

    1. Select *PasteurizationMachine_A01*. This will automatically fill a matching name for the 3D element you're creating. 

    1. Select **Create element**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-element-details.png" alt-text="Screenshot of the New element options in 3D Scene Studio." lightbox="media/how-to-get-started-3d-scene-studio/new-element-details.png":::

The element will now show up in the list of elements for the scene.

### Create behaviors

Next, you'll create a set of *behaviors* for the element. This will allow you to visually monitor its status in 3D Scene Studio, based on data from its connected twin.

1. Switch to the **Behaviors** list and select **New behavior**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-behavior.png" alt-text="Screenshot of the New behavior button in 3D Scene Studio." lightbox="media/how-to-get-started-3d-scene-studio/new-behavior.png":::
1. For **Display name**, enter *InFlow*. Under **Elements**, select *PasteurizationMachine_A01* (it may already be selected).

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-behavior-elements.png" alt-text="Screenshot of the New behavior options in 3D Scene Studio, showing the Elements options." lightbox="media/how-to-get-started-3d-scene-studio/new-behavior-elements.png":::
1. Switch to **Status**. *States* are data-driven overlays on your elements to indicate the health or status of the element. Here, you'll set value ranges for a property on the element to identify its ideal range.

    1. The **Property** dropdown list contains names of all the properties on the twin that's linked to the *PasteurizationMachine_A01* element. Select *LinkedTwin.InFlow*.
 
    1. Set two value ranges so that values *0-100* appear in blue, and *101-Infinity* appear in red.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-behavior-status.png" alt-text="Screenshot of the New behavior options in 3D Scene Studio, showing the Status options." lightbox="media/how-to-get-started-3d-scene-studio/new-behavior-status.png":::
1. Switch to **Alerts**. *Alerts* are conditional notifications that indicate an element requires someone's attention. Here, you'll create an alert to identify when the element is receiving more flow than it's able to output.

    1. For the **Trigger expression**, enter *LinkedTwin.InFlow > LinkedTwin.OutFlow*
 
    1. Set the **Badge icon** and **Badge color**. Enter some **Notification text**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-behavior-alerts.png" alt-text="Screenshot of the New behavior options in 3D Scene Studio, showing the Alerts options." lightbox="media/how-to-get-started-3d-scene-studio/new-behavior-alerts.png":::
1. Switch to **Widgets**. Configuring widgets helps you make sure the right data is discoverable when an alert or status is active. Here, you'll add visual widgets that the element will use to report on its status. First, you'll add a *gauge widget*.

    1. Select **Add widget**.

        :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-behavior-widgets.png" alt-text="Screenshot of the New behavior options in 3D Scene Studio, showing the Widgets options." lightbox="media/how-to-get-started-3d-scene-studio/new-behavior-widgets.png":::

        From the **Widget library**, select the **Gauge** widget and then **Add widget**.
    
    1. In the **New widget** options, enter a **Label** of *InFlow*, and set the **Unit of measure** to *m/s*. Set the **Property** to *LinkedTwin.InFlow*. 

        Set two value ranges so that values *-Infinity-0* appear in blue, and *1-Infinity* appear in red.
        
    1. Select **Create widget**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-widget-gauge.png" alt-text="Screenshot of the New widget options in 3D Scene Studio for a gauge widget." lightbox="media/how-to-get-started-3d-scene-studio/new-widget-gauge.png":::
1. Next, you'll add a *link* widget.

    1. Again, select **Add widget**. From the **Widget library**, select the **Link** widget and then **Add widget**.

    1. In the **New widget** options, enter a **Label** of *Power BI*. For the **URL**, enter *https://mypbi.biz/${LinkedTwin.$dtId}*.

    1. Select **Create widget**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-widget-link.png" alt-text="Screenshot of the New widget options in 3D Scene Studio for a link widget." lightbox="media/how-to-get-started-3d-scene-studio/new-widget-link.png":::
1. The behavior options are now complete. Save the behavior by selecting **Create behavior**.

    :::image type="content" source="media/how-to-get-started-3d-scene-studio/new-behavior-create.png" alt-text="Screenshot of the New behavior options in 3D Scene Studio, highlighting Create behavior." lightbox="media/how-to-get-started-3d-scene-studio/new-behavior-create.png":::

The *InFlow* behavior set will now show up in the list of behaviors for the scene.

### View

So far, you've been working with 3D Scene Studio in **Build** mode. Now, switch the mode to **View**. 

:::image type="content" source="media/how-to-get-started-3d-scene-studio/factory-scene-view-1.png" alt-text="Screenshot of the factory scene in 3D Scene Studio, highlighting the View mode button." lightbox="media/how-to-get-started-3d-scene-studio/factory-scene-view-1.png":::

From the list of **Elements**, select the **PasteurizationMachine_A01** element that you created. The visualization will zoom in to show the visual element and display the behaviors you set up for it.

:::image type="content" source="media/how-to-get-started-3d-scene-studio/factory-scene-view-2.png" alt-text="Screenshot of the factory scene in 3D Scene Studio, highlighting the View mode button." lightbox="media/how-to-get-started-3d-scene-studio/factory-scene-view-2.png":::

## Next steps 

Explore the rest of 3D Scene Studio's capabilities and features in [Use 3D Scene Studio (all features)](how-to-use-3d-scene-studio-features.md).