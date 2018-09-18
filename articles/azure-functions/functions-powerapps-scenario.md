---
title: Call a function from PowerApps | Microsoft Docs
description: Create a custom connector then call a function using that connector.
services: functions
keywords: cloud apps, cloud services, PowerApps, business processes, business application
author: ggailey777
manager: jeconnoc

ms.assetid: ''
ms.service: azure-functions
ms.topic: conceptual
ms.date: 12/14/2017
ms.author: glenga
ms.reviewer: sunayv
ms.custom: ''
---

# Call a function from PowerApps
The [PowerApps](https://powerapps.microsoft.com) platform is designed for business experts to build apps without traditional application code. Professional developers can use Azure Functions to extend the capabilities of PowerApps, while shielding PowerApps app builders from the technical details.

You build an app in this topic based on a maintenance scenario for wind turbines. This topic shows you how to call the function that you defined in [Create an OpenAPI definition for a function](functions-openapi-definition.md). The function determines if an emergency repair on a wind turbine is cost-effective.

![Finished app in PowerApps](media/functions-powerapps-scenario/finished-app.png)

For information on calling the same function from Microsoft Flow, see [Call a function from Microsoft Flow](functions-flow-scenario.md).

In this topic, you learn how to:

> [!div class="checklist"]
> * Prepare sample data in Excel.
> * Export an API definition.
> * Add a connection to the API.
> * Create an app and add data sources.
> * Add controls to view data in the app.
> * Add controls to call the function and display data.
> * Run the app to determine whether a repair is cost-effective.

## Prerequisites

+ An active [PowerApps account](https://docs.microsoft.com/powerapps/maker/signup-for-powerapps) with the same sign in credentials as your Azure account. 
+ Excel and the [Excel sample file](https://procsi.blob.core.windows.net/docs/turbine-data.xlsx) that you will use as a data source for your app.
+ Complete the tutorial [Create an OpenAPI definition for a function](functions-openapi-definition.md).

[!INCLUDE [Export an API definition](../../includes/functions-export-api-definition.md)]

## Add a connection to the API
The custom API (also known as a custom connector) is available in PowerApps, but you must make a connection to the API before you can use it in an app.

1. In [web.powerapps.com](https://web.powerapps.com), click **Connections**.

    ![PowerApps connections](media/functions-powerapps-scenario/powerapps-connections.png)

1. Click **New Connection**, scroll down to the **Turbine Repair** connector, and click it.

    ![New connection](media/functions-powerapps-scenario/new-connection.png)

1. Enter the API Key, and click **Create**.

    ![Create connection](media/functions-powerapps-scenario/create-connection.png)

> [!NOTE]
> If you share your app with others, each person who works on or uses the app must also enter the API key to connect to the API. This behavior might change in the future, and we will update this topic to reflect that.

## Create an app and add data sources
Now you're ready to create the app in PowerApps, and add the Excel data and the custom API as data sources for the app.

1. In [web.powerapps.com](https://web.powerapps.com), choose **Start from blank** > ![Phone app icon](media/functions-powerapps-scenario/icon-phone-app.png) (phone) > **Make this app**.

    ![Start from blank - phone app](media/functions-powerapps-scenario/create-phone-app.png)

    The app opens in PowerApps Studio for web. The following image shows the different parts of PowerApps Studio.

    ![PowerApps Studio](media/functions-powerapps-scenario/powerapps-studio.png)

    **(A) Left navigation bar**, in which you see a hierarchical view of all the controls on each screen

    **(B) Middle pane**, which shows the screen that you're working on

    **(C) Right pane**, where you set options such as layout and data sources

    **(D) Property** drop-down list, where you select the properties that formulas apply to

    **(E) Formula bar**, where you add formulas (as in Excel) that define app behavior
    
    **(F) Ribbon**, where you add controls and customize design elements

1. Add the Excel file as a data source.

    The data you will import looks like the following:

    ![Excel data to import](media/functions-powerapps-scenario/excel-table.png)

    1. On the app canvas, choose **connect to data**.

    1. On the **Data** panel, click **Add static data to your app**.

        ![Add data source](media/functions-powerapps-scenario/add-static-data.png)

        Normally you would read and write data from an external source, but you're adding the Excel data as static data because this is a sample.

    1. Navigate to the Excel file you saved, select the **Turbines** table, and click **Connect**.

        ![Add data source](media/functions-powerapps-scenario/choose-table.png)


1. Add the custom API as a data source.

    1. On the **Data** panel, click **Add data source**.

    1. Click **Turbine Repair**.

        ![Turbine repair connector](media/functions-powerapps-scenario/turbine-connector.png)

## Add controls to view data in the app
Now that the data sources are available in the app, you add a screen to your app so you can view the turbine data.

1. On the **Home** tab, click **New screen** > **List screen**.

    ![List screen](media/functions-powerapps-scenario/list-screen.png)

    PowerApps adds a screen that contains a *gallery* to display items, and other controls that enable searching, sorting, and filtering.

1. Change the title bar to `Turbine Repair`, and resize the gallery so there's room for more controls under it.

    ![Change title and resize gallery](media/functions-powerapps-scenario/gallery-title.png)

1. With the gallery selected, in the right pane, under **Properties**, click **CustomGallerySample**.

    ![Change data source](media/functions-powerapps-scenario/change-data-source.png)

1. In the **Data** panel, select **Turbines** from the list.

    ![Select data source](media/functions-powerapps-scenario/select-data-source.png)

    The data set doesn't contain an image, so next you change the layout to better fit the data. 

1. Still in the **Data** panel, change **Layout** to **Title, subtitle, and body**.

    ![Change gallery layout](media/functions-powerapps-scenario/change-layout.png)

1. As the last step in the **Data** panel, change the fields that are displayed in the gallery.

    ![Change gallery fields](media/functions-powerapps-scenario/change-fields.png)
    
    + **Body1** = LastServiceDate
    + **Subtitle2** = ServiceRequired
    + **Title2** = Title 

1. With the gallery selected, set the **TemplateFill** property to the following formula: `If(ThisItem.IsSelected, Orange, White)`.

    ![Template fill formula](media/functions-powerapps-scenario/formula-fill.png)

    Now it's easier to see which gallery item is selected.

    ![Selected item](media/functions-powerapps-scenario/selected-item.png)

1. You don't need the original screen in the app. In the left pane, hover over **Screen1**, click **. . .**, and **Delete**.

    ![Delete screen](media/functions-powerapps-scenario/delete-screen.png)

1. Click **File**, and name the app. Click **Save** on the left menu, then click **Save** in the bottom right corner.

There's a lot of other formatting you would typically do in a production app, but we'll move on to the important part for this scenario - calling the function.

## Add controls to call the function and display data
You have an app that displays summary data for each turbine, so now it's time to add controls that call the function you created, and display the data that is returned. You access the function based on the way you name it in the OpenAPI definition; in this case it's `TurbineRepair.CalculateCosts()`.

1. In the ribbon, on the **Insert** tab, click **Button**. Then on the same tab, click **Label**

    ![Insert button and label](media/functions-powerapps-scenario/insert-controls.png)

1. Drag the button and the label below the gallery, and resize the label. 

1. Select the button text, and change it to `Calculate costs`. The app should look like the following image.

    ![App with button](media/functions-powerapps-scenario/move-button-label.png)

1. Select the button, and enter the following formula for the button's **OnSelect** property.

    ```
    If (BrowseGallery1.Selected.ServiceRequired="Yes", ClearCollect(DetermineRepair, TurbineRepair.CalculateCosts({hours: BrowseGallery1.Selected.EstimatedEffort, capacity: BrowseGallery1.Selected.MaxOutput})))
    ```
    This formula executes when the button is clicked, and it does the following if the selected gallery item has a **ServiceRequired** value of `Yes`:

    + Clears the *collection* `DetermineRepair` to remove data from previous calls. A collection is a tabular variable.

    + Assigns to the collection the data returned by calling the function `TurbineRepair.CalculateCosts()`. 
    
        The values passed to the function come from the **EstimatedEffort** and **MaxOutput** fields for the item selected in the gallery. These fields aren't displayed in the gallery, but they're still available to use in formulas.

1. Select the label, and enter the following formula for the label's **Text** property.

    ```
    "Repair decision: " & First(DetermineRepair).message & " | Cost: " & First(DetermineRepair).costToFix & " | Revenue: " & First(DetermineRepair).revenueOpportunity
    ```
    This formula uses the `First()` function to access the first (and only) row of the `DetermineRepair` collection. It then displays the three values that the function returns: `message`, `costToFix`, and `revenueOpportunity`. These values are blank before the app runs for the first time.

    The completed app should look like the following image.

    ![Finished app before run](media/functions-powerapps-scenario/finished-app-before-run.png)


## Run the app
You have a complete app! Now it's time to run it and see the function calls in action.

1. In the upper right corner of PowerApps Studio, click the run button: ![Run app button](media/functions-powerapps-scenario/f5-arrow-sm.png).

1. Select a turbine with a value of `Yes` for **ServiceRequired**, then click the **Calculate costs** button. You should see a result like the following image.

    ![Finished app in PowerApps](media/functions-powerapps-scenario/finished-app.png)

1. Try the other turbines to see what's returned by the function each time.

## Next steps
In this topic, you learned how to:

> [!div class="checklist"]
> * Prepare sample data in Excel.
> * Export an API definition.
> * Add a connection to the API.
> * Create an app and add data sources.
> * Add controls to view data in the app.
> * Add controls to call the function and display data
> * Run the app to determine whether a repair is cost-effective.

To learn more about PowerApps, see [Introduction to PowerApps](https://powerapps.microsoft.com/tutorials/getting-started/).

To learn about other interesting scenarios that use Azure Functions, see [Call a function from Microsoft Flow](functions-flow-scenario.md) and [Create a function that integrates with Azure Logic Apps](functions-twitter-email.md).
