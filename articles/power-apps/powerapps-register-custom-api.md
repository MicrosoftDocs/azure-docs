<properties
	pageTitle="How to use Custom APIs in Logic Flows and PowerApps | Microsoft Azure"
	description="What are custom APIs, using OAuth providers, and using Swagger to add custom APIs in PowerApps and Logic Flows"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="sunaysv"
	manager="erikre"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="07/12/2016"
   ms.author="mandia"/>

# What are Custom APIs

Custom APIs are any RESTful APIs that you can bring in and use with your PowerApps and Logic Flows. These APIs can be hosted anywhere, as long as a well-documented specification that conforms to the [OpenAPI][1] standard is available.

>[AZURE.IMPORTANT] This topic has moved to powerapps.microsoft.com at [What are custom APIs](https://powerapps.microsoft.com/tutorials/register-custom-api/). Please go to PowerApps for the latest version. This Azure link is being archived.

## What you need to get started

- Custom APIs can be used by anyone using PowerApps. PowerApps Enterprise is not required. 
- A Swagger file (.json) and an icon for your custom API are needed. This topic gives you several options to create the Swagger file. For an icon, you can use any image you want.


## Authentication

You can use one of the following authentication mechanisms: 

- Basic Authentication 
- OAuth 2.0: The following lists all the supported OAuth 2.0 providers you can use with your custom API (support for more coming soon):	

	- Azure Active Directory
	- Box
	- Dropbox
	- Facebook
	- Google
	- Instagram
	- OneDrive
	- SalesForce
	- Slack
	- Yammer

> [AZURE.NOTE] Support for API key authentication is coming soon.


You can learn more about specifying the authentication type in your OpenAPI (Swagger) document at [OpenAPI Specification][1]. 

If your API endpoint allows unauthenticated access, you should remove the ```securityDefintions``` object from the OpenAPI (Swagger) file. In the following example, remove all of the following ```securityDefintions``` object:

```
  "securityDefinitions": {
    "AAD": {
      "type": "oauth2",
      "flow": "implicit",
      "authorizationUrl": "https://login.windows.net/common/oauth2/authorize",
      "scopes": []
    }
  },
```

> [AZURE.TIP] In .json files, you can not add comments; All text is considered part of the data.

### Authentication examples
* [Azure Resource Manager](powerapps-azure-resource-manager-tutorial.md) with AAD authentication
* [Azure WebApp](powerapps-web-api-tutorial.md) with AAD authentication

## Register a Custom API

### Step 1: Create a Swagger file

You can create a Swagger file from **any** API endpoint, including: 

- Any API that is published and publicly available. Some examples include [Spotify][2], [Uber][3], [Slack][4], [Rackspace][5], and more. 
- An API that you create and deploy to any cloud service where you can deploy web apps, including Amazon Web Services (AWS), Heroku, Azure web apps, Google Cloud, and more.  
- An API deployed in your network, or on your computer; as long as the API is available publicly on the internet.

When you create the Swagger file, a .json file is created. Keep this .json file handy.

#### Get help creating Swagger files

- If you're brand new to creating a Swagger file or have never created a Swagger file before, [Get started with Swagger][6] is a good resource. 
 
- To create your own API, deploy it to Azure, and create a Swagger file based off this new API, then consider using [Web API tutorial](powerapps-web-api-tutorial.md). This tutorial gives you a working Swagger file. There's also a [Hello World example][7] on GitHub.

- To validate your Swagger files, use the [Swagger editor][8]. You can paste your .json data, and validation automatically occurs. 

- To customize your Swagger document to work with PowerApps and Logic Flows, see [Customize your Swagger definition](powerapps-how-to-swagger.md). 

### Step 2: Add a connection to the custom API
Now that the Swagger file (.json file) is generated for the custom API, add the connection to PowerApps. You'll also need the icon for your custom API. 

1. Go to the PowerApps [web portal][9], and sign in with your work account.  

	> [AZURE.NOTE] Currently, custom APIs can only be used in the PowerApps web portal. They cannot be used in the PowerApps client.  

2. Select **Connections**, and then select **Add a connection**:  
	![](./media/powerapps-register-custom-api/createnewconnection.png "Create Custom API")  

3. Select **Add a custom API**:  
	![](./media/powerapps-register-custom-api/connecttocustomapi.png "Create Custom API")  
	Add the properties of your API, including the .json and icon files. Then, select **Next**:  

	|Property|Description|
|---|---|
|Name|Enter the name of your custom API. If this is the sample web API, you can name it **MySampleWebAPI**.|
|Swagger API definition|Browse to the .json file created from Swagger.|
|Upload API icon|Browse to the icon file.|
|Description|Enter a description of your custom API. If this is the sample web API, you can enter **Sample Web API Tutorial**.|

4. Enter any authentication properties. If the .json file uses OAuth2 authentication in the ```securityDefintions``` object, you are prompted for the following values:  

	|Property|Description|
|---|---|
|Client id|Using one of the supported OAuth identity providers (listed in this topic), a client ID is provided. Enter this client ID.
|Client secret|Enter the client secret from the identity provider you chose.|  

	The **Authentication examples** in this topic provide examples of these OAuth properties.  

	If the .json file does not use the ```securityDefintions``` object, then no additional values may be needed.

5. Select **Create**. Your custom API is now displayed in **Available Connections**:  

	![](./media/powerapps-register-custom-api/mycustomapi.png "Available connections")  


> [AZURE.TIP] If the Swagger files fails to validate, there may be extra characters. For example, mostly all data should be in quotes, including websites. So if you have `https://mywebapi.mywebsite.com` outside of quotes, the file fails to validate. 


### Step 3: Add the custom API to a Logic Flow and PowerApp
Now, you're ready to use the custom API with your PowerApp or Logic Flow. In this section, we use a custom Weather API.

#### Add the custom API to your logic flow
In this step, we create a very simple logic flow that shows you how to add your custom API. For a more in-depth experience, see [Get started with logic flows][10].

1. In the PowerApps [web portal][9], select the **Home** tab.
2. Under **Make a logic flow**, select **Get started**. 
3. In this window, there are several logic flow templates already created that use some common scenarios. You can use any of these, and add your custom API to it. Or, you can choose **Create from blank** to create a logic flow from scratch.  

	The quickest way to add your custom API is to select **Create from blank**. This opens the following logic flow:  
	![](./media/powerapps-register-custom-api/createfromblank.png "Start of Logic Flow")   

4. Select **Recurrence**, and set the frequency to 1 minute:    
	![](./media/powerapps-register-custom-api/logicrecurrence.png "Select Recurrence")  	

5. Select the plus sign (![](./media/powerapps-register-custom-api/flowplussign.png) ), and select **Add an action**. In the list, your custom API is listed:  
![](./media/powerapps-register-custom-api/logicflow.png "Your custom API") 

The next steps are determined by what your API can do. In a weather example, maybe your API gets the current temperature, and then sends an email using Office 365:  

![](./media/powerapps-register-custom-api/logicflowexample.png "Weather example") 



#### Add the custom API to your PowerApp
In this step, we create a very simple PowerApp that shows you how to add your custom API. For a more in-depth experience, see [Create an app from data][11].

> [AZURE.NOTE] Currently, custom APIs can only be used in the PowerApps web portal. They cannot be used in the PowerApps client.

1. In the PowerApps [web portal][9], select **New PowerApp**:  
	![](./media/powerapps-register-custom-api/newpowerapp.png "Select New PowerApp")  
2. A new tab opens in your browser. In this new tab, a blank PowerApp is created automatically. Select **connect to data**:  
![](./media/powerapps-register-custom-api/blankpowerapp.png "Select connect to data")  
3. In the **Content** tab, select **Data sources**:  
![](./media/powerapps-register-custom-api/datasources.png "Select connect to data")  
4. In the new screen, under **My connections**, select your custom API:  
![](./media/powerapps-register-custom-api/screencustomapi.png "Select your custom API")  
5. Select **Add data source**.

Once added, you can use your custom API within the function bar, a text box, and more. For example, in the function bar, you can start typing **MySampleWebAPI** to see the available functions. [Show data from Office 365 ][12] is an example of using the Office 365 API.


## Sharing a Custom API
Users can also share custom APIs with each other. Once you've added a custom API, select the **Connections** tab, select **Custom APIs**, and then select the share icon:  

![](./media/powerapps-register-custom-api/sharecustomapi.png "Share Custom API")

> [AZURE.NOTE] You can share custom APIs with other users in only your organization.

## Quota and throttling

- You can create up to five custom APIs in a PowerApps account. Custom APIs that are shared with you don't count against this quota.
- For each connection created on a custom API, users can make up to 500 requests per minute.
- Keep in mind that deleting a custom API deletes all the connections created to the API. 

For questions or comments on custom APIs, email [customapishelp@microsoft.com](mailto:customapishelp@microsoft.com).

<!--Reference links in article-->
[1]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#securityDefinitionsObject
[2]: https://developer.spotify.com/ 
[3]: https://developer.uber.com/
[4]: https://api.slack.com/
[5]: http://docs.rackspace.com/
[6]: http://swagger.io/getting-started/
[7]: https://github.com/OAI/OpenAPI-Specification/wiki/Hello-World-Sample
[8]: http://editor.swagger.io/#/
[9]: https://web.powerapps.com
[10]: https://powerapps.microsoft.com/tutorials/get-started-logic-flow/
[11]: https://powerapps.microsoft.com/tutorials/get-started-create-from-data/
[12]: https://powerapps.microsoft.com/tutorials/show-office-data/
