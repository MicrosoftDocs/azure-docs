---
title: How to query Azure Cognitive Search from Power Apps
titleSuffix: Azure Cognitive Search
description: Step-by-step guidance on how to create custom connector to Cognitive Search and how to visualize it from a Power App
author: luiscabrer
manager: eladz
ms.author: luisca
ms.service: cognitive-search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 03/25/2020
---

# How to query a Cognitive Search index from Power Apps

This document shows how to create a Power Apps custom connector so that you can retrieve search results from a search index. It also shows how to issue a search query and visualize the results from a Power App. 

## Prerequisites
*    Power Apps account access with the ability to create custom connectors.
*    We assume you have already created an Azure Search Index.

## Create a custom connector to query Azure Search

There are two main steps to having a PowerApp that shows Azure Cognitive Search results. First, let's create a connector that can query the search index. In the [next section](#visualize-results-from-the-custom-connector) we will update your Power Apps application to visualize the results returned by the connector.

1. Go to [make.powerapps.com](http://make.powerapps.com) and **Sign In**.

1. Search for **Data** > **Custom Connectors**
 
    :::image type="content" source="./media/search-howto-powerapps/1-2-custom-connector.png" alt-text="Custom connector menu" border="true":::

1. Click  **+ New custom connector**  and then select **Create from blank**.

    :::image type="content" source="./media/search-howto-powerapps/1-3-create-blank.png" alt-text="Create from blank menu" border="true":::

1. Give your custom connector a name. (that is, *AzureSearchQuery*), and then click **Continue**. This will bring up a wizard to create your new connector.

1. Enter information in the General Page.

    - Icon background color (for instance, #007ee5)
    - Description (for instance, "A connector to Azure Cognitive Search")
    - In the Host, you will need to enter your search service URL (for instance, `<yourservicename>.search.windows.net`)
    - For Base URL, simply enter "/"
    
    :::image type="content" source="./media/search-howto-powerapps/1-5-general-info.png" alt-text="General information dialogue" border="true":::

1. In the Security Page, set *API Key* as the **Authentication Type**, set the parameter label, and parameter name fields as *api-key*. For **Parameter location**, select *Header* as shown below.
 
    :::image type="content" source="./media/search-howto-powerapps/1-6-authentication-type.png" alt-text="Authentication type option" border="true":::

1. In the Definitions Page, select **+ New Action** to create an action that will query the index. Enter the value "Query" for the summary and the name of the operation ID. Enter a description like *"Queries the search index"*.
 
    :::image type="content" source="./media/search-howto-powerapps/1-7-new-action.png" alt-text="New action options" border="true":::


1. Press the **+ Import from sample** button to define the parameters and headers. Next, you will define the query request.  

    * Select the verb `GET`
    * For the URL enter a sample query for your search index, for instance:
       
    >https://yoursearchservicename.search.windows.net/indexes/yourindexname/docs?search=*&api-version=2019-05-06-Preview
    

    **Power Apps** will use the syntax to extract parameters from the query. Notice we explicitly defined the search field. 

    :::image type="content" source="./media/search-howto-powerapps/1-8-1-import-from-sample.png" alt-text="Import from sample" border="false":::

1.  Click **Import** to automatically pre-fill the Request dialog.

    :::image type="content" source="./media/search-howto-powerapps/1-8-2-import-from-sample.png" alt-text="Import from sample dialogue" border="false":::


1. Complete setting the parameter metadata by clicking the **…** symbol next to each of the parameters.

    - For *search*: Set `*` as the **default value**, set **required** as *false* and set the **visibility** to *none*. 

    :::image type="content" source="./media/search-howto-powerapps/1-10-1-parameter-metadata-search.png" alt-text="Search parameter metadata" border="true":::

    - For *api-version*: Set `2019-05-06-Preview` as the **default value**, set the **visibility** as internal and set **required** to *True*.  

    :::image type="content" source="./media/search-howto-powerapps/1-10-2-parameter-metadata-version.png" alt-text="Version parameter metadata" border="true":::

    - Similarly, for *api-key*, set it as **required**, with *internal* **visibility**. Enter your search service API key as the **default value**.
    
    After you make these changes, toggle to the **Swagger Editor** view. In the parameters section you should see the following configuration:    

    ```
          parameters:
          - {name: search, in: query, required: false, type: string, default: '*'}
          - {name: api-version, in: query, required: true, type: string, default: 2019-05-06-Preview,
            x-ms-visibility: internal}
          - {name: api-key, in: header, required: true, type: string, default: YOURKEYGOESHERE,
            x-ms-visibility: internal}
    ```

1. On the Response section, click **"Add default response"**. This is critical because it will help **Power Apps** understand the schema of the response. Paste a sample response.

    > [!TIP] 
    > There is a character limit to the JSON response you can enter, so you may want to simplify the JSON so that it before pasting it. The important aspect schema/format of the response. The actual values in the sample response are less important and can be simplified to reduce the character count.
    

1.    Click the **Create connector** button on the top right of the screen before you can Test it.

1.  In the Test Page, click the **+ New Connection**, and enter your search service query key as the value for *api-key*.

    This step may take you to the out of the wizard and into the Connections page. You may want to go back to the Custom Connections editor to actually test the connection. Go to **Custom Connector** > Select the newly created Connector > *…* > **View Properties** > **Edit** > **4. Test** to get back to the test page.

1.    Now click **Test operation** to make sure that you are getting results from your index. If you were successful you should see a 200 status, and in the body of the response you should see JSON that describes your search results.




## Visualize results from the custom connector
The goal of this tutorial is not to show you how to create fancy user experiences with power apps, so the UI layout will be minimalistic. Let's create a PowerApp with a search box, a search button and display the results in a gallery control.  The PowerApp will connect to our recently created custom connector to get the data from Azure Search.

1. Create new Power App. Go to the **Apps** section, click on **+ New app**, and select **Canvas**.

    :::image type="content" source="./media/search-howto-powerapps/2-1-create-canvas.png" alt-text="Create canvas app" border="true":::

1. Select the type of application you would like. For this tutorial create a **Blank App** with the **Phone Layout**. The **Power Apps Studio** will appear.

1. Once in the studio, select the **Data Sources**  tab, and click on the new Connector you have just created. In our case, it is called *AzureSearchQuery*. Click **Add a connection**.

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
 
1.  Press **F5** to preview the app.  

    Remember that the fields can be set to calculated values.      
    For the example, setting using the *"Image, Title and Subtitle"* layout and specifying the *Image* function as the concatenation of the root path for the data and the file name (for instance, `"https://mystore.blob.core.windows.net/multilang/" & ThisItem.metadata_storage_name`) will produce the result below.

    :::image type="content" source="./media/search-howto-powerapps/2-8-2-final.png" alt-text="Final app" border="true":::        

## Next steps

For more information and online training, see [Power Apps Learning Catalog](https://docs.microsoft.com/powerapps/learning-catalog/get-started).

