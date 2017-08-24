## Add your connector to Azure Logic Apps

Now that you configured your Azure AD app, add your connector. 
You need to have these items for creating your custom connector:

* Details for your API, such as the name, Azure subscription, 
Azure resource group, and location to use for your connector
* The location or path to the Swagger file that describes your API. 

  For this tutorial, you can use this [sample Azure Resources Manager OpenAPI file](http://pwrappssamples.blob.core.windows.net/samples/AzureResourceManager.json).

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
   so you can provide the Swagger file that describes your API.

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

5. On the **Security** pane, choose **Edit** so you can select the authentication 
type that your API uses. 

because the OpenAPI file uses our AAD application for authentication, we need to give Flow some information about our application.  Under **Client id**, type the AAD **Application ID** you noted earlier.  For client secret, use the **key**.  And finally, for **Resource URL**, type `https://management.core.windows.net/`.

    > [!IMPORTANT] Be sure to include the Resource URL exactly as written above, including the trailing slash.


5. Now that the custom connector is registered, you must create a connection to the custom connector so that you can use it in your logic apps. 

> [!NOTE] The sample OpenAPI does not define the full set of ARM operations 
> and currently only contains the [List all subscriptions](https://msdn.microsoft.com/library/azure/dn790531.aspx) operation. 
> You can edit this OpenAPI or create another OpenAPI file 
> using the [online OpenAPI editor](http://editor.swagger.io/).
>
> This process can be used to access any RESTful API authenticated using Azure AD.