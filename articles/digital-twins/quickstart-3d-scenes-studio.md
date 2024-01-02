---
title: Quickstart - Get started with 3D Scenes Studio (preview)
titleSuffix: Azure Digital Twins
description: Learn how to use 3D Scenes Studio (preview) for Azure Digital Twins by following this demo, where you'll create a sample scene with elements and behaviors.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/10/2023
ms.topic: quickstart
ms.service: digital-twins
ms.custom: event-tier1-build-2022, devx-track-azurecli

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Quickstart - Get started with 3D Scenes Studio (preview) for Azure Digital Twins

Azure Digital Twins *3D Scenes Studio (preview)* is an immersive 3D environment, where business and front-line workers can consume and investigate operational data from their Azure Digital Twins solutions with visual context.

In this article, you'll set up all the required resources for using 3D Scenes Studio, including an Azure Digital Twins instance with sample data, and Azure storage resources. Then, you'll create a scene in the studio that's connected to the sample Azure Digital Twins environment.

This sample scene used in this quickstart monitors the carrying efficiency of robotic arms in a factory. The robotic arms pick up a certain number of boxes each hour, while video cameras monitor each of the arms to detect if the arm failed to pick up a box. Each arm has an associated digital twin in Azure Digital Twins, and the digital twins are updated with data whenever an arm misses a box. Given this scenario, this quickstart walks through setting up a 3D scene to visualize the arms in the factory, along with visual alerts each time a box is missed.

The scene will look like this: 

:::image type="content" source="media/quickstart-3d-scenes-studio/studio-full.png" alt-text="Screenshot of a sample scene in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/studio-full.png":::

## Prerequisites

You'll need an Azure subscription to complete this quickstart. If you don't have one already, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

You'll also need to download a sample glTF (Graphics Language Transmission Format) 3D file to use for the scene in this quickstart. [Select this link to download RobotArms.glb](https://cardboardresources.blob.core.windows.net/public/RobotArms.glb).

## Set up Azure Digital Twins and sample data

The first step in working with Azure Digital Twins is to create an Azure Digital Twins instance. After you create an instance of the service, you can link the instance to a 3D Scenes Studio visualization later in the quickstart.

The rest of this section walks you through the instance creation. If you already have an Azure Digital Twins instance set up from an earlier quickstart, you can skip to the [next section](#generate-sample-models-and-twins).

[!INCLUDE [digital-twins-quickstart-setup.md](../../includes/digital-twins-quickstart-setup.md)]

### Collect host name

After deployment completes, use the **Go to resource** button to navigate to the instance's Overview page in the portal.

:::image type="content" source="media/quickstart-azure-digital-twins-explorer/deployment-complete.png" alt-text="Screenshot of the deployment page for Azure Digital Twins in the Azure portal. The page indicates that deployment is complete.":::

Next, take note of the instance's **host name** value to use later.

:::image type="content" source="media/quickstart-3d-scenes-studio/host-name.png" alt-text="Screenshot of the Azure portal showing the Overview page for an Azure Digital Twins instance. The host name is highlighted." lightbox="media/quickstart-3d-scenes-studio/host-name.png":::

### Generate sample models and twins

In this section, you'll use the *Azure Digital Twins data simulator* tool to generate sample models and twins to populate your instance. Then, you'll use the simulator to stream sample data to the twins in the graph.

>[!NOTE]
>Models, twins, and simulated data are provided for you in this quickstart to simplify the process of creating an environment that you can view in 3D Scenes Studio. When designing your own complete Azure Digital Twins solution, you'll create [models](concepts-models.md) and [twins](concepts-twins-graph.md) yourself to describe your own environment in detail, and [set up your own data flows](concepts-data-ingress-egress.md) accordingly.

This sample scenario represents a package distribution center that contains six robotic arms. Each arm has a digital twin with properties to track how many boxes the arm fails to pick up, along with the IDs of the missed boxes.

1. Navigate to the [data simulator](https://explorer.digitaltwins.azure.net/tools/data-pusher) in your web browser. 
1. In the **Instance URL** space, enter the *host name* of your Azure Digital Twins instance from the [previous section](#collect-host-name). Set the **Simulation Type** to *Robot Arms*.
1. Use the **Generate environment** button to create a sample environment with models and twins. (If you already have models and twins in your instance, this will not delete them, it will just add more.)

    :::image type="content"  source="media/quickstart-3d-scenes-studio/data-simulator.png" alt-text="Screenshot of the Azure Digital Twins Data simulator. The Generate environment button is highlighted." lightbox="media/quickstart-3d-scenes-studio/data-simulator.png":::
1. Scroll down and select **Start simulation** to start sending simulated data to your Azure Digital Twins instance. The simulation will only run while this window is open and the **Start simulation** option is active.

You can view the models and graph that have been created by using the Azure Digital Twins Explorer **Graph** tool. To switch to that tool, select the **Graph** icon from the left menu.

:::image type="content" source="media/quickstart-3d-scenes-studio/data-simulator-to-graph.png" alt-text="Screenshot of the Azure Digital Twins Data simulator where the button to switch to the Graph experience is highlighted." lightbox="media/quickstart-3d-scenes-studio/data-simulator-to-graph.png":::

Then, use the **Run Query** button to query for all the twins and relationships that have been created in the instance.

:::image type="content" source="media/quickstart-3d-scenes-studio/run-query.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Run Query button in the upper-right corner of the window." lightbox="media/quickstart-3d-scenes-studio/run-query.png":::

You can select each twin to view them in more detail.

To see the models that have been uploaded and how they relate to each other, select **Model graph**.

:::image type="content" source="media/quickstart-3d-scenes-studio/model-graph.png" alt-text="Screenshot of the Azure Digital Twins Explorer highlighting the Model Graph button for the view pane." lightbox="media/quickstart-3d-scenes-studio/model-graph.png":::

>[!TIP]
>For an introduction to Azure Digital Twins Explorer, see the quickstart [Get started with Azure Digital Twins Explorer](quickstart-azure-digital-twins-explorer.md).

## Create storage resources

Next, create a new storage account and a container in the storage account. 3D Scenes Studio will use this storage container to store your 3D file and configuration information. 

You'll also set up read and write permissions to the storage account. In order to set these backing resources up quickly, this section uses the [Azure Cloud Shell](../cloud-shell/overview.md).

1. Navigate to the [Cloud Shell](https://shell.azure.com) in your browser.

    Run the following command to set the CLI context to your subscription for this session. 

    ```azurecli
    az account set --subscription "<your-Azure-subscription-ID>"
    ```
1. Run the following command to create a storage account in your subscription. The command contains placeholders for you to enter a name and choose a region for your storage account, as well as a placeholder for your resource group.

    ```azurecli
    az storage account create --resource-group <your-resource-group> --name <name-for-your-storage-account> --location <region> --sku Standard_RAGRS
    ```

    When the command completes successfully, you'll see details of your new storage account in the output. Look for the `ID` value in the output and copy it to use in the next command.

    :::image type="content"  source="media/quickstart-3d-scenes-studio/storage-account-id.png" alt-text="Screenshot of Cloud Shell output. The I D of the storage account is highlighted." lightbox="media/quickstart-3d-scenes-studio/storage-account-id.png":::
 
1. Run the following command to grant yourself the *Storage Blob Data Owner* on the storage account. This level of access will allow you to perform both read and write operations in 3D Scenes Studio. The command contains placeholders for the email associated with your Azure account and the ID of your storage account that you copied in the previous step.

    ```azurecli
    az role assignment create --role "Storage Blob Data Owner" --assignee <your-Azure-email> --scope <ID-of-your-storage-account>
    ```

    When the command completes successfully, you'll see details of the role assignment in the output.

1. Run the following command to configure CORS for your storage account. This will be necessary for 3D Scenes Studio to access your storage container. The command contains a placeholder for the name of your storage account.

    ```azurecli
    az storage cors add --services b --methods GET OPTIONS POST PUT --origins https://explorer.digitaltwins.azure.net --allowed-headers Authorization x-ms-version x-ms-blob-type --account-name <your-storage-account>
    ```

    This command doesn't have any output.

1. Run the following command to create a private container in the storage account. Your 3D Scenes Studio files will be stored here. The command contains a placeholder for you to enter a name for your storage container, and a placeholder for the name of your storage account.
    ```azurecli
    az storage container create --name <name-for-your-container> --public-access off --account-name <your-storage-account>
    ```

    When the command completes successfully, the output will show `"created": true`.

## Initialize your 3D Scenes Studio environment

Now that all your resources are set up, you can use them to create an environment in *3D Scenes Studio*. In this section, you'll create a scene and customize it for the sample graph that's in your Azure Digital Twins instance.

1. Navigate to the [3D Scenes Studio](https://explorer.digitaltwins.azure.net/3dscenes). The studio will open, connected to the Azure Digital Twins instance that you accessed last in the Azure Digital Twins Explorer. Dismiss the welcome demo.

    :::image type="content" source="media/quickstart-3d-scenes-studio/studio-dismiss-demo.png" alt-text="Screenshot of 3D Scenes Studio with welcome demo." lightbox="media/quickstart-3d-scenes-studio/studio-dismiss-demo.png":::

1. Select the **Edit** icon next to the instance name to configure the instance and storage container details.

    :::image type="content" source="media/quickstart-3d-scenes-studio/studio-edit-environment-1.png" alt-text="Screenshot of 3D Scenes Studio highlighting the edit environment icon, which looks like a pencil." lightbox="media/quickstart-3d-scenes-studio/studio-edit-environment-1.png":::

    1. For the **Azure Digital Twins instance URL**, fill the *host name* of your instance from the [Collect host name](#collect-host-name) step into this URL: `https://<your-instance-host-name>`.
    
    1. For the **Azure Storage account URL**, fill the name of your storage account from the [Create storage resources](#create-storage-resources) step into this URL: `https://<your-storage-account>.blob.core.windows.net`.

    1. For the **Azure Storage container name**, enter the name of your storage container from the [Create storage resources](#create-storage-resources) step.
    
    1. Select **Save**.
    
    :::image type="content" source="media/quickstart-3d-scenes-studio/studio-edit-environment-2.png" alt-text="Screenshot of 3D Scenes Studio highlighting the Save button for the environment." lightbox="media/quickstart-3d-scenes-studio/studio-edit-environment-2.png":::

### Add a new 3D scene

In this section you'll create a new 3D scene, using the *RobotArms.glb* 3D model file you downloaded earlier in [Prerequisites](#prerequisites). A *scene* consists of a 3D model file, and a configuration file that's created for you automatically.

This sample scene contains a visualization of the distribution center and its arms. You'll connect this visualization to the sample twins you created in the [Generate sample models and twins](#generate-sample-models-and-twins) step, and customize the data-driven view in later steps.

1. Select the **Add 3D scene** button to start creating a new scene. Enter a **Name** and **Description** for your scene, and select **Upload file**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/add-scene-upload-file.png" alt-text="Screenshot of the Create new scene process in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/add-scene-upload-file.png":::
1. Browse for the *RobotArms.glb* file on your computer and open it. Select **Create**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/add-scene-create.png" alt-text="Screenshot of creating a new scene in 3D Scenes Studio. The robot arms file has been uploaded and the Create button is highlighted." lightbox="media/quickstart-3d-scenes-studio/add-scene-create.png":::
    
    Once the file is uploaded, you'll see it listed back on the main screen of 3D Scenes Studio.
1. Select the scene to open and view it. The scene will open in **Build** mode.

    :::image type="content" source="media/quickstart-3d-scenes-studio/distribution-scene.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/distribution-scene.png":::

## Create a scene element

Next, you'll define an *element* in the 3D visualization and link it to a twin in the Azure Digital Twins graph you set up earlier.

1. Select any robotic arm in the scene visualization. This will bring up the possible element actions. Select **+ Create new element**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-arm-element.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio. A robotic arm is highlighted with an option to create a new element." lightbox="media/quickstart-3d-scenes-studio/new-arm-element.png":::
1. In the **New element** panel, the **Primary twin** dropdown list contains names of all the twins in the connected Azure Digital Twins instance. 

    1. Select *Arm1*. This will automatically apply the digital twin ID (`$dtId`) as the element name.

    1. Select **Create element**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-element-details.png" alt-text="Screenshot of the New element options in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-element-details.png":::

The element will now show up in the list of elements for the scene.

## Create a behavior

Next, you'll create a *behavior* for the element. These behaviors allow you to customize the element's data visuals and the associated business logic. Then, you can explore these data visuals to understand the state of the physical environment.

1. Switch to the **Behaviors** list and select **New behavior**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior.png" alt-text="Screenshot of the New behavior button in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-behavior.png":::

1. For **Display name**, enter *Packing Line Efficiency*. Under **Elements**, select *Arm1*.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-elements.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Elements options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-elements.png":::

1. Skip the **Twins** tab, which isn't used in this quickstart. 

1. Switch to the **Visual rules** tab. *Visual rules* are data-driven overlays on your elements that you can configure to indicate the health or status of the element. 

    1. First, you'll set some conditions to indicate the efficiency of the packing line.

        1. Select **Add Rule**.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Visual rules options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules.png":::
    
        1. Enter a **Display name** of *Hourly pickups*. Leave the **Property expression** on **Single property** and open the property dropdown list. It contains names of all the properties on the primary twin for the *Arm1* element. Select *PrimaryTwin.FailedPickupsLastHr*. Then, select **Add condition**.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-2.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the New visual rule options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-2.png":::
    
        1. Next, you'll define some boundaries to indicate when the hourly pickups are missing too many packages. For this scenario, let's say an arm needs attention if it misses more than three pickups in an hour. **Label** the condition *>3 missed pickups*, and define a value range between *4* and *Infinity* (the min range value is inclusive, and the max value is exclusive). Assign an **Element coloring** of red. Select **Save**.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-3.png" alt-text="Screenshot of the Add condition options in 3D Scenes Studio creating the coloring condition." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-3.png":::
    
        1. Select **Add condition** again, and create a condition labeled *1-3 missed pickups*. Define a value range between *1* and *4*, and assign an **Element coloring** of orange. Save the condition.
    
            Select **Add condition** one more time, and create a condition labeled *0 missed pickups*. Define a value range between *0* and *1*, and assign an **Element coloring** of green. Save the condition.
       
            After creating all three conditions, **Save** the new visual rule.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-4.png" alt-text="Screenshot of saving the finished conditions in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-4.png":::

    1. Next, create one more visual rule to display alerts for missed packages. 

        1. From the **Visual rules** tab, select **Add Rule** again.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-badge.png" alt-text="Screenshot of adding a second rule in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-badge.png":::
    
        1. Enter a **Display name** of *PickupFailedAlert*. Change the **Property expression** to **Custom (advanced)**, enter a property of *PrimaryTwin.PickupFailedAlert*, and set the **Type** to *boolean*. This is a boolean property on the arm twin that is set to *True* when a package pickup fails. Select **Add condition**.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-badge-2.png" alt-text="Screenshot of adding a condition for the second visual rule in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-badge-2.png":::
    
        1. Enter a **Label** of *${PrimaryTwin.PickupFailedBoxID} failed*. Later, in the scene view, this will dynamically display the value of the arm twin's string property *PickupFailedBoxID*, which holds an ID representing the box that the arm most recently failed to pick up. Set the **Value** to *True* and choose a **Visual type** of *Badge*. Set the **Color** to red and choose an **Icon**. Select **Save**.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-badge-3.png" alt-text="Screenshot of the Add condition options in 3D Scenes Studio creating the badge condition." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-badge-3.png":::
    
        You should now see both of your rules listed in the **Visual rules** tab.
        
        :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-complete.png" alt-text="Screenshot of the finished visual rules in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-behavior-visual-rules-complete.png":::

1. Switch to the **Widgets** tab. Widgets are data-driven visuals that provide additional context and data, to help you understand the scenario that the behavior represents. Here, you'll add two visual widgets to display property information for the arm element.

    1. First, create a widget to display a gauge of the arm's hydraulic pressure value.
        1. Select **Add widget**.
        
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-widgets.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, showing the Widgets options." lightbox="media/quickstart-3d-scenes-studio/new-behavior-widgets.png":::

            From the **Widget library**, select the  **Gauge** widget and then **Add widget**.

        1. In the **New widget** options, add a **Display name** of *Hydraulic Pressure*, a **Unit of measure** of *m/s*, and a single-property **Property expression** of *PrimaryTwin.HydraulicPressure*.
        
            Set three value ranges so that values *0-40* appear one color, *40-80* appear in a second color, and *80-Infinity* appear in a third color (remember that the min range value is inclusive, and the max value is exclusive).
        
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-widget-gauge.png" alt-text="Screenshot of the New widget options in 3D Scenes Studio for the gauge widget." lightbox="media/quickstart-3d-scenes-studio/new-widget-gauge.png":::

            Select **Create widget**.
        
    1. Next, create a widget with a link to a live camera stream of the arm.

        1. Select **Add widget**. From the **Widget library**, select the **Link** widget and then **Add widget**.

        1. In the **New widget** options, enter a **Label** of *Live arm camera*. For the **URL**, you can use the example URL *http://contoso.aws.armstreams.com/${PrimaryTwin.$dtId}*. There's no live camera hosted at the URL for this sample, but the link represents where the video feed might be hosted in a real scenario.
    
        1. Select **Create widget**.
    
            :::image type="content" source="media/quickstart-3d-scenes-studio/new-widget-link.png" alt-text="Screenshot of the New widget options in 3D Scenes Studio for a link widget." lightbox="media/quickstart-3d-scenes-studio/new-widget-link.png":::

1. The behavior options are now complete. Save the behavior by selecting **Create behavior**.

    :::image type="content" source="media/quickstart-3d-scenes-studio/new-behavior-create.png" alt-text="Screenshot of the New behavior options in 3D Scenes Studio, highlighting Create behavior." lightbox="media/quickstart-3d-scenes-studio/new-behavior-create.png":::

The *Packing Line Efficiency* behavior will now show up in the list of behaviors for the scene.

## View scene

So far, you've been working with 3D Scenes Studio in **Build** mode. Now, switch the mode to **View**. 

:::image type="content" source="media/quickstart-3d-scenes-studio/distribution-scene-view-1.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio, highlighting the View mode button." lightbox="media/quickstart-3d-scenes-studio/distribution-scene-view-1.png":::

From the list of **Elements**, select the **Arm1** element that you created. The visualization will zoom in to show the visual element and display the behaviors you set up for it.

:::image type="content" source="media/quickstart-3d-scenes-studio/distribution-scene-view-element.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio, showing the viewer for the arm." lightbox="media/quickstart-3d-scenes-studio/distribution-scene-view-element.png":::

## Apply behavior to additional elements

Sometimes, an environment might contain multiple similar elements, which should all display similarly in the visualization (like the six different robot arms in this example). Now that you've created a behavior for one arm and confirmed what it looks like in the viewer, this section will show you how to quickly add the behavior to other arms so that they all display the same type of information in the viewer.

1. Return to **Build** mode. Like you did in [Create a scene element](#create-a-scene-element), select a different arm in the visualization, and select **Create new element**. 
    :::image type="content" source="media/quickstart-3d-scenes-studio/new-arm-element-2.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio. A different arm is highlighted with an option to create a new element." lightbox="media/quickstart-3d-scenes-studio/new-arm-element-2.png":::

1. Select a **Primary twin** of *Arm2* for the new element, then switch to the **Behaviors** tab.
    :::image type="content" source="media/quickstart-3d-scenes-studio/new-element-details-2.png" alt-text="Screenshot of the New element options for Arm2 in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-element-details-2.png":::

1. Select **Add behavior**. Choose the **Packing Line Efficiency** behavior that you created in this quickstart.
    :::image type="content" source="media/quickstart-3d-scenes-studio/new-element-behaviors.png" alt-text="Screenshot of the New element behavior options for Arm2 in 3D Scenes Studio." lightbox="media/quickstart-3d-scenes-studio/new-element-behaviors.png":::

1. Select **Create element** to finish creating the new arm element.

Switch to the **View** tab to see the behavior working on the new arm element. All the information you selected when [creating the behavior](#create-a-behavior) is now available for both of the arm elements in the scene.

:::image type="content" source="media/quickstart-3d-scenes-studio/distribution-scene-view-element-2.png" alt-text="Screenshot of the factory scene in 3D Scenes Studio, showing the viewer for the second arm." lightbox="media/quickstart-3d-scenes-studio/distribution-scene-view-element-2.png":::

>[!TIP]
>If you'd like, you can repeat the steps in this section to create elements for the remaining four arms, and apply the behavior to all of them to make the visualization complete.

## Review and contextualize learnings

This quickstart shows how to create an immersive dashboard for Azure Digital Twins data, to share with end users and increase access to important insights about your real world environment.

In the quickstart, you created a sample 3D scene to represent a package distribution center with robotic arms that pick up packages. This visualization was connected to a digital twin graph, and you linked an arm in the visualization to its own specific digital twin that supplied backing data. You also created a visual behavior to display key information about that arm when viewing the full scene, including which box pickups have been failed by that arm in the last hour.

In this quickstart, the sample models and twins for the factory scenario were quickly created for you, using the [Azure Digital Twins Data simulator](#generate-sample-models-and-twins). When using Azure Digital Twins with your own environment, you'll create your own [models](concepts-models.md) and [twins](concepts-twins-graph.md) to accurately describe the elements of your environment in detail. This quickstart also used the data simulator to simulate "live" data driving digital twin property updates when packages were missed. When using Azure Digital Twins with your own environment, [ingesting live data](concepts-data-ingress-egress.md) is a process you'll set up yourself according to your own environment sensors.

## Clean up resources

To clean up after this quickstart, choose which Azure Digital Twins resources you want to remove, based on what you want to do next.

* If you plan to continue to the Azure Digital Twins tutorials, you can reuse the instance in this quickstart for those articles, and you don't need to remove it.

[!INCLUDE [digital-twins-cleanup-clear-instance.md](../../includes/digital-twins-cleanup-clear-instance.md)]
 
* If you don't need your Azure Digital Twins instance anymore, you can delete it using the [Azure portal](https://portal.azure.com).
    
    Navigate back to the instance's **Overview** page in the portal. (If you've already closed that tab, you can find the instance again by searching for its name in the Azure portal search bar and selecting it from the search results.)

    Select **Delete** to delete the instance, including all of its models and twins.

    :::image type="content" source="media/quickstart-azure-digital-twins-explorer/delete-instance.png" alt-text="Screenshot of the Overview page for an Azure Digital Twins instance in the Azure portal. The Delete button is highlighted.":::

You can delete your storage resources by navigating to your storage account's **Overview** page in the [Azure portal](https://portal.azure.com), and selecting **Delete**. This will delete the storage account and the container inside it, along with the 3D scene files that were in the container.

:::image type="content" source="media/quickstart-3d-scenes-studio/delete-storage.png" alt-text="Screenshot of the Overview page for an Azure storage account in the Azure portal. The Delete button is highlighted.":::

You may also want to delete the downloaded sample 3D file from your local machine.

## Next steps 

Next, continue on to the Azure Digital Twins tutorials to build out your own Azure Digital Twins environment.

> [!div class="nextstepaction"]
> [Code a client app](tutorial-code.md)
