---
title: 'Tutorial: Query from Power Apps'
titleSuffix: Azure Cognitive Search
description: Step-by-step guidance on how to create custom connector to Cognitive Search and how to visualize it from a Power App
author: luiscabrer
manager: eladz
ms.author: luisca
ms.service: cognitive-search
ms.devlang: rest-api
ms.topic: tutorial
ms.date: 03/25/2020
---

# Tutorial: Query a Cognitive Search index from Power Apps

Leverage the rapid application development environment of Power Apps to create a custom app for your searchable content in Azure Cognitive Search.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Connect a Power App to Azure Cognitive Search
> * Send a query
> * Visualize results

If you don't have an Azure subscription, open a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

+ [Power Apps account](http://make.powerapps.com)

+ [Hotels-sample index](search-get-started-portal.md)

+ [Query API key](search-security-api-keys.md#find-existing-keys)

## 1 - Create a custom connector

A connector in Power Apps is a data source connection. In this step, you'll create a custom connector to connect to a search index in the cloud.

1. [Sign in](http://make.powerapps.com) to Power Apps.

1. On the left, expand **Data** > **Custom Connectors**.
 
    :::image type="content" source="./media/search-howto-powerapps/1-2-custom-connector.png" alt-text="Custom connector menu" border="true":::

1. Select  **+ New custom connector**, and then select **Create from blank**.

    :::image type="content" source="./media/search-howto-powerapps/1-3-create-blank.png" alt-text="Create from blank menu" border="true":::

1. Give your custom connector a name (for example, *AzureSearchQuery*), and then click **Continue**.

1. Enter information in the General Page:

    - Icon background color (for instance, #007ee5)
    - Description (for instance, "A connector to Azure Cognitive Search")
    - In the Host, you will need to enter your search service URL (such as `<yourservicename>.search.windows.net`)
    - For Base URL, simply enter "/"
    
    :::image type="content" source="./media/search-howto-powerapps/1-5-general-info.png" alt-text="General information dialogue" border="true":::

1. In the Security Page, set *API Key* as the **Authentication Type**, set both the parameter label and parameter name to *api-key*. For **Parameter location**, select *Header* as shown below.
 
    :::image type="content" source="./media/search-howto-powerapps/1-6-authentication-type.png" alt-text="Authentication type option" border="true":::

1. In the Definitions Page, select **+ New Action** to create an action that will query the index. Enter the value "Query" for the summary and the name of the operation ID. Enter a description like *"Queries the search index"*.
 
    :::image type="content" source="./media/search-howto-powerapps/1-7-new-action.png" alt-text="New action options" border="true":::

1. Scroll down. In Requests, select **+ Import from sample** button to configure a query request to your search service:

    * Select the verb `GET`

    * For the URL enter a sample query for your search index (`search=*` returns all documents). The API version is required. Fully specified, a URL might look like this: `https://mydemo.search.windows.net/indexes/hotels-sample-index/docs?search=*&api-version=2019-05-06`

    * For Headers, type `Content-Type application/JSON` and `api-key`. 

    **Power Apps** will use the syntax to extract parameters from the query. Notice we explicitly defined the search field. 

    :::image type="content" source="./media/search-howto-powerapps/1-8-1-import-from-sample.png" alt-text="Import from sample" border="false":::

1. Click **Import** to auto-fill the Request.

    :::image type="content" source="./media/search-howto-powerapps/1-8-2-import-from-sample.png" alt-text="Import from sample dialogue" border="false":::

1. Complete setting the parameter metadata by clicking the **…** symbol next to each of the parameters. Click **Back** to return to the Request page after each parameter update.

    - For *search*: Set `*` as the **default value**, set **required** as *False* and set **visibility** to *none*. 

    :::image type="content" source="./media/search-howto-powerapps/1-10-1-parameter-metadata-search.png" alt-text="Search parameter metadata" border="true":::

    - For *api-version*: Set `2019-05-06` as the **default value**, set **required** to *True*, and set **visibility** as *internal*.  

    :::image type="content" source="./media/search-howto-powerapps/1-10-2-parameter-metadata-version.png" alt-text="Version parameter metadata" border="true":::

    - For *api-key*: Set a valid query API key as the **default value**, set **required** to *True*, and set **visibility** as *internal*. You can get a query API key from the Azure portal. For more information, see [Find existing keys](search-security-api-keys.md#find-existing-keys).
    
    :::image type="content" source="./media/search-howto-powerapps/1-10-3-parameter-metadata-version.png" alt-text="Version parameter metadata" border="true":::

    After making these changes, toggle to the **Swagger Editor** view. In the parameters section you should see the following configuration:

    ```
    parameters:
    - {name: search, in: query, required: false, type: string, default: '*'}
    - {name: api-version, in: query, required: true, type: string, default: 2019-05-06,
    x-ms-visibility: internal}
    - {name: api-key, in: header, required: true, type: string, default: YOURKEYGOESHERE,
    x-ms-visibility: internal}
    ```

1. Return to the **3. Request** step and scroll down to the Response section. Click **"Add default response"**. This is critical because it will help **Power Apps** understand the schema of the response. 

1. Paste a sample response. The hotels-sample-index has numerous fields. For brevity, use just the search.score, HotelID, HotelName, Description, Category, and Address/City. Below is a sample response that contains these fields.

   ```JSON
    {
        "@search.score": 1,
        "HotelId": "13",
        "HotelName": "Historic Lion Resort",
        "Description": "Unmatched Luxury. Visit our downtown hotel to indulge in luxury accommodations. Moments from the stadium, we feature the best in comfort.",
        "Category": "Luxury",
        "Address": {
            "City": "St. Louis"
            }
        }
   ```

    > [!TIP] 
    > There is a character limit to the JSON response you can enter, so you may want to simplify the JSON before pasting it. The schema and format of the response is more important than the values. For example, the Description field could be simplified to just the first sentence.

1. Click **Create connector** on the top right.

## Test the connection

After the connector is created, test it using the following steps.

1. On the far left, click **Custom Connectors**.

1. Search for the connector by name (in this tutorial, is "AzureSearchQuery").

1. Select the connector, expand the actions list, and select **View Properties**.

    :::image type="content" source="./media/search-howto-powerapps/1-11-1-test-connector.png" alt-text="View Properties" border="true":::

1. Select **Edit** on the top right.

1. Select **4. Test** to open the test page.

1. Click **Test operation**. If you are successful you should see a 200 status, and in the body of the response you should see JSON that describes the search results.

    :::image type="content" source="./media/search-howto-powerapps/1-11-2-test-connector.png" alt-text="JSON response" border="true":::

## Visualize results

In this step, create a Power App with a search box, a search button, and a display area for the results. The Power App will connect to the recently created custom connector to get the data from Azure Search.

1. On the left, expand **Apps** > **+ New app** > **Canvas**.

    :::image type="content" source="./media/search-howto-powerapps/2-1-create-canvas.png" alt-text="Create canvas app" border="true":::

1. Select the type of application. For this tutorial, create a **Blank App** with the **Phone Layout**. The **Power Apps Studio** will appear.

1. Once in the studio, select the **Data Sources** tab, and click on the new Connector you have just created. In our case, it is called *AzureSearchQuery*. Click **Add a connection**.

    :::image type="content" source="./media/search-howto-powerapps/2-3-connect-connector.png" alt-text="connect connector" border="true":::

    Now *AzureSearchQuery* is a data source that is available to be used from your application.
    
1. Navigate to the **Insert tab**, so that we can add a few controls to our form.

    :::image type="content" source="./media/search-howto-powerapps/2-4-add-controls.png" alt-text="Insert controls" border="true":::

1.  Insert the following elements:
    -   A Text Label with the value "Query:"
    -   A Text Input element (call it *txtQuery*, default value: "*")
    -   A button with the text "Search" 
    -   A Vertical Gallery called (call it *galleryResults*)
    
    Your form should look something like this:

    :::image type="content" source="./media/search-howto-powerapps/2-5-controls-layout.png" alt-text="Controls layout" border="true":::

1. To make the **Search button** issue a query, select the button, and Paste the following action to take on **OnSelect**:

    ```
    If(!IsBlank(txtQuery.Text),
        ClearCollect(azResult, AzureSearchQuery.Get({search: txtQuery.Text}).value))
    ```

    :::image type="content" source="./media/search-howto-powerapps/2-6-search-button-event.png" alt-text="Button OnSelect" border="true":::
 
    This action will cause the button to update a new collection called *azResult* with the result of the search query, using the text in the *txtQuery* text box as the query term.
    
1.  As a next step, we will link the vertical gallery we created to the *azResult* collection. Select the gallery control, and perform the following actions in the properties pane.

    -  Set **DataSource** to *azResult*.
    
    -  Select a **Layout** that works for you based on the type of data in your index. In this case, we used the *Title, subtitle and body* layout.
    
    -  **Edit Fields**, and select the fields you would like to visualize.

    Since we provided a sample result when we defined the connector, the app is aware of the fields available in your index.
    
    :::image type="content" source="./media/search-howto-powerapps/2-7-gallery-select-fields.png" alt-text="Gallery fields" border="true":::   
 
1. Press **F5** to preview the app.  

    Remember that the fields can be set to calculated values.

    For the example, setting using the *"Image, Title and Subtitle"* layout and specifying the *Image* function as the concatenation of the root path for the data and the file name (for instance, `"https://mystore.blob.core.windows.net/multilang/" & ThisItem.metadata_storage_name`) will produce the result below.

    :::image type="content" source="./media/search-howto-powerapps/2-8-2-final.png" alt-text="Final app" border="true":::        

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you are using a free service, remember that you are limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit.

## Next steps

Power Apps supports rapid application development of custom apps. Now that you know how to connect a Power App to a search index, see what else you can do with visualizations and business logic in a custom app based on your searchable content.

> [!div class="nextstepaction"]
> [Power Apps Learning Catalog](https://docs.microsoft.com/powerapps/learning-catalog/get-started)

