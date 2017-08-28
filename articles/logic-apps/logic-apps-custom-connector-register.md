
# Register your connector with Azure Logic Apps





5. Choose **Create** so that Azure creates a connection to your custom connector.

## Add your connector to Azure Logic Apps

Now that you configured your Azure AD app, add your connector. 
You need to have these items for creating your custom connector:

* Details for your API, such as the name, Azure subscription, 
Azure resource group, and location to use for your connector
* The location or path to the Swagger file that describes your API. 

  For this tutorial, you can use the 
  [sample Azure Resources Manager OpenAPI file](http://pwrappssamples.blob.core.windows.net/samples/AzureResourceManager.json).

* An icon that represents your connector
* A short description for your connector
* The host location for your API

1. In the Azure portal, on the main Azure menu, choose **New**. 
In the search box, enter "logic apps connector" as your filter, 
and press Enter. From the results list, choose **Logic Apps Connector** > **Create**.

2. Provide details for creating your connector 
as described in the table. When you're done, 
choose **Pin to dashboard** > **Create**.

   |Property|Suggested value|Description|
   |:-------|:--------------|:----------|
   |**Name**|*{custom-connector-name}*|Provide a name for your connector.| 
   |**Subscription**|*{your-Azure-subscription-name}*|Select your Azure subscription.| 
   |**Resource group**|*{Azure-resource-group-name}*|Create or select an Azure group for organizing your Azure resources.| 
   |**Location**|*{your-selected-region}*|Select a deployment region for your connector.| 
   |||| 

3. In your connector's menu, choose **Logic Apps Connector**. 
In the toolbar, choose **Edit**.

4. In the **General** pane, provide details about 
your connector as described in these tables.

   1. For **Custom connectors**, select the option 
   so you can upload the OpenAPI (Swagger) file that describes connector.

      |Option|Format|Description|
      |:-----|:-----|:----------|
      |**Upload an OpenAPI file**|*path-to-swagger-json-file*|Browse to the location for your OpenAPI file, and select that file.|
      |**Use an OpenAPI URL**|http://*path-to-swagger-json-file*|Provide the URL for the OpenAPI file for your API.|
      |**Upload Postman collection V1**|*path-to-exported-Postman-collection-V1-file*|Browse to the location for an exported Postman collection in V1 format.|
      |||| 

   2. For **General information**, provide these items for your connector. 

      |Option or setting|Format|Description|
      |:----------------|:-----|:----------|
      |**Upload Icon**|*png-or-jpg-file-under-1MB*|Provide the icon that represents your connector.| 
      |**Icon background color**|*hexadecimal-color-code*|To show a color behind your icon, provide hexadecimal code for that color. For example, #007ee5 represents the color blue.| 
      |**Description**|*connector-description*|Provide a short decription for your connector.| 
      |**Host**|*connector-host*|Provide the host domain for your connector.|
      |**Base URL**|*connector-base-URL*|Provide the base URL for your connector.|
      ||||

   3. When you're done, choose **Continue**.

5. On the **Security** pane, choose **Edit** so you can 
select the authentication type that your API uses. 

   In this example, the OpenAPI file uses an Azure AD app for authentication, 
   so you must provide information about the Azure AD app to Logic Apps. 

   1. Under **Authentication type**, select this type: **OAuth 2.0**
   2. Under **OAuth 2.0**, select **Azure Active Directory**.
   1. Under **Client id**, type the Azure AD *Application ID* that you saved earlier. 
   2. For **Client secret**, use the *client key* that you saved earlier.
   3. For **Resource URL**, enter this URL: `https://management.core.windows.net/`

      > [!IMPORTANT] Make sure that you include the **Resource URL** exactly as written above, 
      > including the trailing slash.

6. Now that the custom connector is registered, 
you must create a connection to the custom connector 
so that you can use the connector in your logic apps. 

## Next steps
