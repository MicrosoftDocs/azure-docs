---
title: 'Tutorial: Query from Power Apps'
titleSuffix: Azure AI Search
description: Step-by-step guidance on how to build a Power App that connects to an Azure AI Search index, sends queries, and renders results.
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 02/07/2023
---

# Tutorial: Query an Azure AI Search index from Power Apps

Use the rapid application development environment of Power Apps to create a custom app for your searchable content in Azure AI Search.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Connect to Azure AI Search
> * Set up a query request
> * Visualize results in a canvas app

If you don't have an Azure subscription, open a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [Power Apps account](https://make.powerapps.com)

* [Hotels-sample index](search-get-started-portal.md) hosted on your search service

* [Query API key](search-security-api-keys.md#find-existing-keys)

## 1 - Create a custom connector

A connector in Power Apps is a data source connection. In this step, create a custom connector to connect to a search index in the cloud.

1. [Sign in](https://make.powerapps.com) to Power Apps.

1. On the left, expand **... More**. Find, pin, and then select **Custom Connectors**.

    :::image type="content" source="./media/search-howto-powerapps/1-2-custom-connector.png" alt-text="Custom connector menu" border="true":::

1. Select  **+ New custom connector**, and then select **Create from blank**.

    :::image type="content" source="./media/search-howto-powerapps/1-3-create-blank.png" alt-text="Create from blank menu" border="true":::

1. Give your custom connector a name (for example, *AzureSearchQuery*), and then select **Continue**.

1. Enter information in the General Page:

   * Icon background color (for instance, #007ee5)
   * Description (for instance, "A connector to Azure AI Search")
   * In the Host, enter your search service URL (such as `<yourservicename>.search.windows.net`)
   * For Base URL, enter "/"

    :::image type="content" source="./media/search-howto-powerapps/1-5-general-info.png" alt-text="General information dialogue" border="true":::

1. In the Security Page, set *API Key* as the **Authentication Type**, set both the parameter label and parameter name to *api-key*. For **Parameter location**, select *Header* as shown in the following screenshot.

    :::image type="content" source="./media/search-howto-powerapps/1-6-authentication-type.png" alt-text="Authentication type option" border="true":::

1. In the Definitions Page, select **+ New Action** to create an action that queries the index. Enter the value "Query" for the summary and the name of the operation ID. Enter a description like *"Queries the search index"*.

    :::image type="content" source="./media/search-howto-powerapps/1-7-new-action.png" alt-text="New action options" border="true":::

1. Scroll down. In Requests, select **+ Import from sample** button to configure a query request to your search service:

   * Select the verb `GET`

   * For the URL, enter a sample query for your search index (`search=*` returns all documents, `$select=` lets you choose fields). The API version is required. Fully specified, a URL might look like this: `https://mydemo.search.windows.net/indexes/hotels-sample-index/docs?search=*&$select=HotelName,Description,Address/City&api-version=2020-06-30`

   * For Headers, type `Content-Type`. You'll set the value to `application/json` in a later step.

     **Power Apps** uses the syntax in the URL to extract parameters from the query: search, select, and api-version parameters become configurable as you progress through the wizard.

       :::image type="content" source="./media/search-howto-powerapps/1-8-1-import-from-sample.png" alt-text="Import from sample" border="true":::

1. Select **Import** to auto-fill the Request. Complete setting the parameter metadata by clicking the **...** symbol next to each of the parameters. Select **Back** to return to the Request page after each parameter update.

   :::image type="content" source="./media/search-howto-powerapps/1-8-2-import-from-sample.png" alt-text="Import from sample dialogue" border="true":::

1. For *search*: Set `*` as the **default value**, set **required** as *False* and set **visibility** to *none*. 

    :::image type="content" source="./media/search-howto-powerapps/1-10-1-parameter-metadata-search.png" alt-text="Search parameter metadata" border="true":::

1. For *select*: Set `HotelName,Description,Address/City` as the **default value**, set **required** to *False*, and set **visibility** to *none*.  

    :::image type="content" source="./media/search-howto-powerapps/1-10-4-parameter-metadata-select.png" alt-text="Select parameter metadata" border="true":::

1. For *api-version*: Set `2020-06-30` as the **default value**, set **required** to *True*, and set **visibility** as *internal*.  

    :::image type="content" source="./media/search-howto-powerapps/1-10-2-parameter-metadata-version.png" alt-text="Version parameter metadata" border="true":::

1. For *Content-Type*: Set to `application/json`.

1. After making these changes, toggle to the **Swagger Editor** view. In the parameters section you should see the following configuration:

    ```JSON
    parameters:
      - {name: search, in: query, required: false, type: string, default: '*'}
      - {name: $select, in: query, required: false, type: string, default: 'HotelName,Description,Address/City'}
      - {name: api-version, in: query, required: true, type: string, default: '2020-06-30',
        x-ms-visibility: internal}
      - {name: Content-Type, in: header, required: false, type: string}
    ```

1. Switch back to the wizard and return to the **3. Request** step. Scroll down to the Response section. Select **"Add default response"**. This step is critical because it helps Power Apps understand the schema of the response. 

1. Paste a sample response. An easy way to capture a sample response is through Search Explorer in the Azure portal. In Search Explorer, you should enter the same query as you did for the request, but add **$top=2** to constrain results to just two documents: `search=*&$select=HotelName,Description,Address/City&$top=2`. 

   Power Apps only needs a few results to detect the schema. You can copy the following response into the wizard now, assuming you're using the hotels-sample-index.

    ```JSON
    {
        "@odata.context": "https://mydemo.search.windows.net/indexes('hotels-sample-index')/$metadata#docs(*)",
        "value": [
            {
                "@search.score": 1,
                "HotelName": "Arcadia Resort & Restaurant",
                "Description": "The largest year-round resort in the area offering more of everything for your vacation – at the best value!  What can you enjoy while at the resort, aside from the mile-long sandy beaches of the lake? Check out our activities sure to excite both young and young-at-heart guests. We have it all, including being named “Property of the Year” and a “Top Ten Resort” by top publications.",
                "Address": {
                    "City": "Seattle"
                }
            },
            {
                "@search.score": 1,
                "HotelName": "Travel Resort",
                "Description": "The Best Gaming Resort in the area.  With elegant rooms & suites, pool, cabanas, spa, brewery & world-class gaming.  This is the best place to play, stay & dine.",
                "Address": {
                    "City": "Albuquerque"
                }
            }
        ]
    }
    ```

    > [!TIP] 
    > There is a character limit to the JSON response you can enter, so you may want to simplify the JSON before pasting it. The schema and format of the response is more important than the values themselves. For example, the Description field could be simplified to just the first sentence.

1. Select **Import** to add the default response.

1. Select **Create connector** on the top right to save the definition.

1. Select **Close** to close the connector.

## 2 - Test the connection

When the connector is first created, you need to reopen it from the Custom Connectors list in order to test it. Later, if you make more updates, you can test from within the wizard.

You'll need a [query API key](search-security-api-keys.md#find-existing-keys) for this task. Each time a connection is created, whether for a test run or inclusion in an app, the connector needs the query API key used for connecting to Azure AI Search.

1. On the far left, select **Custom Connectors**.

1. Find your connector in the list (in this tutorial, is "AzureSearchQuery").

1. Select the connector, expand the actions list, and select **View Properties**.

    :::image type="content" source="./media/search-howto-powerapps/1-11-1-test-connector.png" alt-text="View Properties" border="true":::

1. Select **Edit** on the top right.

1. Select **5. Test** to open the test page.

1. In Test Operation, select **+ New Connection**.

1. Enter a query API key. This is an Azure AI Search query for read-only access to an index. You can [find the key](search-security-api-keys.md#find-existing-keys) in the Azure portal. 

1. In Operations, select the **Test operation** button. If you're successful you should see a 200 status, and in the body of the response you should see JSON that describes the search results.

    :::image type="content" source="./media/search-howto-powerapps/1-11-2-test-connector.png" alt-text="JSON response" border="true":::

If the test fails, recheck the inputs. In particular, revisit the sample response and make sure it was created properly. The connector definition should show the expected items for the response.

## 3 - Visualize results

In this step, create a Power App with a search box, a search button, and a display area for the results. The Power App will connect to the recently created custom connector to get the data from Azure Search.

1. On the left, expand **Apps** > **+ New app** > **Canvas**.

    :::image type="content" source="./media/search-howto-powerapps/2-1-create-canvas.png" alt-text="Create canvas app" border="true":::

1. Select the type of application. For this tutorial, create a **Blank App** with the **Phone Layout**. Give the app a name, such as "Hotel Finder". Select **Create**. The **Power Apps Studio** appears.

1. In the studio, select the **Data Sources** tab, select **+ Add data**, and then find the new Connector you have just created. In this tutorial, it's called *AzureSearchQuery*. Select **Add a connection**.

   Enter the query API key.

    :::image type="content" source="./media/search-howto-powerapps/2-3-connect-connector.png" alt-text="connect connector" border="true":::

    Now *AzureSearchQuery* is a data source that is available to be used from your application.

1. On the **Insert tab**, add a few controls to the canvas.

    :::image type="content" source="./media/search-howto-powerapps/2-4-add-controls.png" alt-text="Insert controls" border="true":::

1. Insert the following elements:

   * A Text Label with the value "Query:"
   * A Text Input element (call it *txtQuery*, default value: "*")
   * A button with the text "Search" 
   * A Vertical Gallery called (call it *galleryResults*)

    The canvas should look something like this:

    :::image type="content" source="./media/search-howto-powerapps/2-5-controls-layout.png" alt-text="Controls layout" border="true":::

1. To make the **Search button** issue a query, paste the following action into **OnSelect**:

    ```
    If(!IsBlank(txtQuery.Text),
        ClearCollect(azResult, AzureSearchQuery.Query({search: txtQuery.Text}).value))
    ```

   The following screenshot shows the formula bar for the **OnSelect** action.

    :::image type="content" source="./media/search-howto-powerapps/2-6-search-button-event.png" alt-text="Button OnSelect" border="true":::

   This action causes the button to update a new collection called *azResult* with the result of the search query, using the text in the *txtQuery* text box as the query term.

   > [!NOTE]
   > Try this if you get a formula syntax error "The function 'ClearCollect' has some invalid functions":
   > 
   > * First, make sure the connector reference is correct. Clear the connector name and begin typing the name of your connector. Intellisense should suggest the right connector and verb.
   > 
   > * If the error persists, delete and recreate the connector. If there are multiple instances of a connector, the app might be using the wrong one.
   > 

1. Link the Vertical Gallery control to the *azResult* collection that was created when you completed the previous step. 

   Select the gallery control, and perform the following actions in the properties pane.

   * Set **DataSource** to *azResult*.
   * Select a **Layout** that works for you based on the type of data in your index. In this case, we used the *Title, subtitle and body* layout.
   * **Edit Fields**, and select the fields you would like to visualize.

    Since we provided a sample result when we defined the connector, the app is aware of the fields available in your index.
    
    :::image type="content" source="./media/search-howto-powerapps/2-7-gallery-select-fields.png" alt-text="Gallery fields" border="true":::   
 
1. Press **F5** to preview the app.  

    :::image type="content" source="./media/search-howto-powerapps/2-8-3-final.png" alt-text="Final app" border="true":::    

<!--     Remember that the fields can be set to calculated values.

    For the example, setting using the *"Image, Title and Subtitle"* layout and specifying the *Image* function as the concatenation of the root path for the data and the file name (for instance, `"https://mystore.blob.core.windows.net/multilang/" & ThisItem.metadata_storage_name`) will produce the result below.

    :::image type="content" source="./media/search-howto-powerapps/2-8-2-final.png" alt-text="Final app" border="true":::         -->

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

If you're using a free service, remember that you're limited to three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit.

## Next steps

Power Apps enables the rapid application development of custom apps. Now that you know how to connect to a search index, learn more about creating a rich visualize experience in a custom Power App.

> [!div class="nextstepaction"]
> [Power Apps Learning Catalog](/powerapps/learning-catalog/bdm#get-started)
