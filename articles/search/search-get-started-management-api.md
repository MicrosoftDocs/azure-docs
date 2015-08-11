<properties 
	pageTitle="Get started with Azure Search Management REST API" 
	description="Get started with Azure Search Management REST API" 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="07/08/2015" 
	ms.author="heidist"/>

# Get started with Azure Search Management REST API

The Azure Search REST management API is a programmatic alternative to performing administrative tasks in the portal. Service management operations include creating or deleting the service, scaling the service, and managing keys. This tutorial comes with a sample client application that demonstrates the service management API. It also includes configuration steps required to run the sample in your local development environment.

To complete this tutorial, you will need:

- Visual Studio 2012 or 2013
- the sample  client application download

In the course of completing the tutorial, two services will be provisioned: Azure Search and Azure Active Directory (AD). Additionally, you will create an AD application that establishes trust between your client application and the resource manager endpoint in Azure.

You will need an Azure account to complete this tutorial.


##Download the sample application

This tutorial is based on a Windows console application written in C#, which you can edit and run in either Visual Studio 2012 or 2013

You can find the client application on Codeplex at [Azure Search Management API Demo](https://azuresearchmgmtapi.codeplex.com/).


##Configure the application

Before you can run the sample application, you must enable authentication so that requests sent from the client application to the resource manager endpoint can be accepted. The authentication requirement originates with the [Azure Resource Manager](http://msdn.microsoft.com/library/azure/dn790568.aspx), which is the basis for all portal-related operations requested via an API, including those related to Search service management. The service management API for Azure Search is simply an extension of the Azure Resource Manager, and thus inherits its dependencies.  

Azure Resource Manager requires Azure Active Directory service as its identity provider. 

To obtain an access token that will allow requests to reach the resource manager, the client application includes a code segment that calls Active Directory. The code segment, plus the prerequisite steps to using the code segment, were borrowed from this article: [Authenticating Azure Resource Manager requests](http://msdn.microsoft.com/library/azure/dn790557.aspx).

You can follow the instructions in the above link, or use the steps in this document if you prefer to go through the tutorial step by step.

In this section, you will perform the following tasks:

1. Create an AD service
1. Create an AD application
1. Configure the AD application by registering details about the sample client application you downloaded
1. Load the sample client application with values it will use to gain authorization for its requests

> [AZURE.NOTE] These links provide background on using Azure Active Directory for authenticating client requests to the resource manager: [Azure Resource Manager](http://msdn.microsoft.com/library/azure/dn790568.aspx), [Authenticating Azure Resource Manager requests](http://msdn.microsoft.com/library/azure/dn790557.aspx), and [Azure Active Directory](http://msdn.microsoft.com/library/azure/jj673460.aspx).

###Create an Active Directory Service

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com).

2. Scroll down the left navigation pane and click **Active Directory**.

4. Click **NEW** to open **App Services** | **Active Directory**. In this step, you are creating a new Active Directory service. This service will host the AD application that you'll define a few steps from now. Creating a new service helps isolate the tutorial from other applications you might already be hosting in Azure.

5. Click **Directory** | **Custom Create**.

6. Enter a service name, domain, and  geo-location. The domain must be unique. Click the check mark to create the service.

     ![][5]

###Create a new AD application for this service

1. Select the "SearchTutorial" Active Directory service you just created.

2. On the top menu, click **Applications**. 
 
3. Click **Add an Application**. An AD application stores information about the client applications that will be using it as an identity provider.  
 
4. Choose **Add an application my organization is developing**. This option provides registration settings for applications that are not published to the application gallery. Since the client application is not part of the application gallery, this is the right choice for this tutorial.

     ![][6]
 
5. Enter a name, such as "Azure-Search-Manager".

6. Choose **Native client application** for application type. This is correct for the sample application; it happens to be a Windows client (console) application, not a web application.

     ![][7]
 
7. In Redirect URI, enter "http://localhost/Azure-Search-Manager-App". This a URI to which Azure Active Directory will redirect the user-agent in response to an OAuth 2.0 authorization request. The value does not need to be a physical endpoint, but must be a valid URI. 

    For the purposes of this tutorial, the value can be anything, but whatever you enter becomes a required input for the administrative connection in the sample application. 
 
7. Click the check mark to create the Active Directory application. You should see "Azure-Search-Manager-App" in the left navigation pane.

###Configure the AD application
 
9. Click the AD application, "Azure-Search-Manager-App", that you just created. You should see it listed in the left navigation pane.

10. Click **Configure** in the top menu.
 
11. Scroll down to Permissions and select **Azure Management API**. In this step, you specify the API (in this case, the Azure Resource Manager API) that the client application needs access to, along with the level of access it needs.

12. In Delegated Permissions, click the drop down list and select **Access Azure Service Management (Preview**).
 
     ![][8]
 
13. Save the changes. 

Keep the application configuration page open. In the next step, you will copy values from this page and enter them into the sample application.

###Load the sample application program with registration and subscription values

In this section, you'll edit the solution in Visual Studio, substituting valid values obtained from the portal.
The values that you will be adding appear near the top of Program.cs:

        private const string TenantId = "<your tenant id>";
        private const string ClientId = "<your client id>";
        private const string SubscriptionId = "<your subscription id>";
        private static readonly Uri RedirectUrl = new Uri("<your redirect url>");

If you have not yet [downloaded the sample application from Codeplex](https://azuresearchmgmtapi.codeplex.com/), you will need it for this step.

1. Open the **ManagementAPI.sln** in Visual Studio.

2. Open Program.cs.

3. Provide `ClientId`. From the AD application configuration page left open from the previous step, copy the Client ID from the AD application configuration page in the portal and paste it into Program.cs.

4. Provide `RedirectUrl`. Copy Redirect URI from the same portal page, and paste it into Program.cs.

	![][9]

5. Provide `TenantID.` 
	- Go back to Active Directory | SearchTutorial (service). 
	- Click **Applications** from the top bar. 
	- Click **View Endpoints** at the bottom of the page. 
	- Copy the OAUTH 2.0 Authorization Endpoint at the bottom of the list. 
	- Paste the endpoint into TenantID, trimming the value of all URI parameters except the tenant ID.

    Given "https://login.windows.net/55e324c7-1656-4afe-8dc3-43efcd4ffa50/oauth2/authorize?api-version=1.0", delete everything except "55e324c7-1656-4afe-8dc3-43efcd4ffa50".

	![][10]

6. Provide `SubscriptionID`.
	- Go to the main portal page.
	- Click **Settings** at the bottom of the left navigation pane.
	- From the Subscriptions tab, copy the subscription ID and paste it into Program.cs.

7. Save and then build the solution.


##Explore the application

Add a breakpoint at the first method call so that you can step through the program. Press **F5** to run the application, and then press **F11** to step through the code.

The sample application creates a free Azure Search service for an existing Azure subscription. If a free service already exists for your subscription, the sample application will fail. Only one free Search service per subscription is allowed.

1. Open Program.cs from the Solution Explorer and go to the Main(string[] void) function. 
 
3. Notice that **ExecuteArmRequest** is used to execute requests against the Azure Resource Manager endpoint, `https://management.azure.com/subscriptions` for a specified `subscriptionID`. This method is used throughout the program to perform operations using the Azure Resource Manager API or Search management API.

3. Requests to Azure Resource Manager must be authenticated and authorized. This is accomplished using the **GetAuthorizationHeader** method, called by the **ExecuteArmRequest**  method, borrowed from [Authenticating Azure Resource Manager requests](http://msdn.microsoft.com/library/azure/dn790557.aspx). Notice that **GetAuthorizationHeader** calls `https://management.core.windows.net` to get an access token.

4. You are prompted to sign in with a user name and password that is valid for your subscription.

5. Next, a new Azure Search service is registered with the Azure Resource Manager provider. Again, this is the **ExecuteArmRequest** method, used this time to create the Search service on Azure for your subscription via `providers/Microsoft.Search/register`. 

6. The remainder of the program uses the [Azure Search Management REST API](http://msdn.microsoft.com/library/dn832684.aspx). Notice that the `api-version` for this API is different from the Azure Resource Manager api-version. For example, `/listAdminKeys?api-version=2014-07-31-Preview` shows the `api-version` of the Azure Search Management REST API.

	The next series of operations retrieve the service definition you just created, the admin api-keys, regenerates and retrieves keys, changes the replica and parition, and finally deletes the service.

	When changing the service replica or partition count, it is expected that this action will fail if you are using the free edition. Only the standard edition can make use of additional partitions and replicas.

	Deleting the service is the last operation.

##Next steps

After having completed this tutorial, you might want to learn more about service management or authentication with Active Directory service:

- Learn more about integrating a client application with Active Directory. See [Integrating Applications in Azure Active Directory](http://msdn.microsoft.com/library/azure/dn151122.aspx).
- Learn about other service management operations in Azure. See [Managing Your Services](http://msdn.microsoft.com/library/azure/dn578292.aspx).

<!--Anchors-->
[Download the sample application]: #Download
[Configure the application]: #config
[Explore the application]: #explore
[Next Steps]: #next-steps

<!--Image references-->
[5]: ./media/search-get-started-management-api/Azure-Search-MGMT-AD-Service.PNG
[6]: ./media/search-get-started-management-api/Azure-Search-MGMT-AD-App.PNG
[7]: ./media/search-get-started-management-api/Azure-Search-MGMT-AD-App-prop.PNG
[8]: ./media/search-get-started-management-api/Azure-Search-MGMT-AD-ConfigPermissions.PNG
[9]: ./media/search-get-started-management-api/Azure-Search-MGMT-AD-ConfigPage.PNG
[10]: ./media/search-get-started-management-api/Azure-Search-MGMT-AD-OAuthEndpoint.PNG

<!--Link references-->
[Manage your search solution in Microsoft Azure]: search-manage.md
[Azure Search development workflow]: search-workflow.md
[Create your first azure search solution]: search-create-first-solution.md
[Create a geospatial search app using Azure Search]: search-create-geospatial.md


 