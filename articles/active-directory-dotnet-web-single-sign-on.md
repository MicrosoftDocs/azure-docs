<properties urlDisplayName="" pageTitle="Web Single Sign-On with .NET and Azure Active Directory" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Web Single Sign-On with .NET and Azure Active Directory" authors="" solutions="" manager="terrylan" editor="" />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="11/24/2014" ms.author="mbaldwin" />






# Web Single Sign-On with .NET and Azure Active Directory

<h2><a name="introduction"></a>Introduction</h2>

This tutorial will show you how to leverage Azure Active Directory to enable single sign-on for users of Office 365 customers. You will learn how to:

* Provision the web application in a customer's tenant
* Protect the application using WS-Federation

<h3>Prerequisites</h3>
The following development environment prerequisites are required for this walkthrough:

* Visual Studio 2010 SP1
* Microsoft .NET Framework 4.0
* [ASP.NET MVC 3]
* [Windows Identity Foundation 1.0 Runtime]
* [Windows Identity Foundation 3.5 SDK]
* Internet Information Services (IIS) 7.5 with SSL enabled
* Windows PowerShell
* [Office 365 PowerShell Commandlets]

<h3>Table of Contents</h3>
* [Introduction][]
* [Step 1: Create an ASP.NET MVC Application][]
* [Step 2: Provision the Application in a Company's Directory Tenant][]
* [Step 3: Protect the Application Using WS-Federation for Employee Sign In][]
* [Summary][]

<h2><a name="createapp"></a>Step 1: Create an ASP.NET MVC Application</h2>
This step describes how to create a simple ASP.NET MVC 3 application that will represent a protected resource. Access to this resource will be granted through federated authentication managed by the company's STS, which is described later in the tutorial.

1. Open Visual Studio as an Administrator.
2. From the **File** menu, click **New Project**. 
3. From the template menu on the left, select **Web**, then click **ASP.NET MVC 3 Web Application**. Name the project *OrgIdFederationSample*.
4. On the **New ASP.NET MVC 3 Project** dialog, select the **Empty** template, then click **OK**.
5. After Visual Studio generates the new project, right click on the **Controllers** folder in **Solution Explorer**, click **Add**, then click **Controller**.
6. On the **Add Controller** dialog, name the new controller *HomeController.cs*, then click **Add**.
7. The **HomeController.cs** file will be created and opened. In the code file, right click on the ***Index()*** method and click **Add View...**. 
8. On the **Add View** dialog, click **OK**. An **Index.cshtml** file will be created in a new folder named **Home**. 
9. Right-click on your **OrgIdFederationSample** project in **Solution Explorer**, then click **Properties**.
10. On the properties window, click **Web** on the left menu, then select **Use Local IIS Web server**. A dialog may appear asking you to create a virtual directory for the project; click **Yes** on the dialog.
11. Build and run the application. The Index page of your Home controller will appear.

<h2><a name="provisionapp"></a>Step 2: Provision the Application in a Company's Directory Tenant</h2>
This step describes how an administrator of an Azure Active Directory customer provisions the MVC application in their tenant and configures single sign-on. After this step is accomplished, the company's employees can authenticate to the web application using their Office 365 accounts.

The provisioning process begins by creating a new Service Principal for the application. Service Principals are used by Azure Active Directory to register and authenticate applications to the directory.

1. Download and install the Office 365 PowerShell Commandlets if you haven't done so already.
2. From the **Start** menu, run the **Microsoft Online Services Module for Windows PowerShell** console. This console provides a command-line environment for configuring attributes about your Office 365 tenant, such as creating and modifying Service Principals.
3. To import the required **MSOnlineExtended** module, type the following command and press Enter:

		Import-Module MSOnlineExtended -Force
4. To connect to your Office 365 directory, you will need to provide the company's administrator credentials. Type the following command and press Enter, then enter your credential's at the prompt:

		Connect-MsolService
5. Now you will create a new Service Principal for the application. Type the following command and press Enter:

		New-MsolServicePrincipal -ServicePrincipalNames @("OrgIdFederationSample/localhost") -DisplayName "Federation Sample Website" -Type Symmetric -Usage Verify -StartDate "12/01/2012" -EndDate "12/01/2013" 
This step will output information similar to the following:

		The following symmetric key was created as one was not supplied qY+Drf20Zz+A4t2w e3PebCopoCugO76My+JMVsqNBFc=
		DisplayName           : Federation Sample Website
		ServicePrincipalNames : {OrgIdFederationSample/localhost}
		ObjectId              : 59cab09a-3f5d-4e86-999c-2e69f682d90d
		AppPrincipalId        : 7829c758-2bef-43df-a685-717089474505
		TrustedForDelegation  : False
		AccountEnabled        : True
		KeyType               : Symmetric
		KeyId                 : f1735cbe-aa46-421b-8a1c-03b8f9bb3565
		StartDate             : 12/01/2012 08:00:00 a.m.
		EndDate               : 12/01/2013 08:00:00 a.m.
		Usage                 : Verify 
	<div class="dev-callout"><strong>Note</strong><p>You should save this output, especially the generated symmetric key. This key is only revealed to you during Service Principal creation, and you will be unable to retrieve it in the future. The other values are required for using the Graph API to read and write information in the directory.</p></div>

6. The final step sets the reply URL for your application. The reply URL is where responses are sent following authentication attempts. Type the following commands and press enter:

		$replyUrl = New-MsolServicePrincipalAddresses -Address "https://localhost/OrgIdFederationSample" 

		Set-MsolServicePrincipal -AppPrincipalId "7829c758-2bef-43df-a685-717089474505" -Addresses $replyUrl 
	
The web application has now been provisioned in the directory and it can be used for web single sign-on by company employees.

<h2><a name="protectapp"></a>Step 3: Protect the Application Using WS-Federation for Employee Sign In</h2>
This step shows you how to add support for federated login using Windows Identity Foundation (WIF). You will also add a login page and configure trust between the application and the directory tenant.

1. In Visual Studio, right-click the **OrgIdFederationSample** project and select **"Add STS reference..."**. This context menu option was added when you installed the WIF SDK.
2. In the **Federation Utility** dialog under **Application URI**, you need to provide the URI in the following format:

		spn:<Your AppPrincipalId>@<Your Directory Domain>

	**spn** specifies that the URI is a Service Principal name, **Your AppPrincpalId** is the **AppPrincipalId** GUID value generated when you created a Service Principal, and **Your Directory Domain** is the *.onmicrosoft.com domain for the directory tenant. For this sample application, a complete Application URI value is specified as shown below:

		spn:7829c758-2bef-43df-a685-717089474505@awesomecomputers.onmicrosoft.com

	After you have entered the Application URI, click **Next**.

3. A warning dialog will appear stating that "The application is not hosted on a secure https connection." This is caused by the Federation Utility not recognizing the **spn:** format, but the application will still use a secure https connection anyway. Click **Yes** to continue.

4. On the next page of the Federation Utility, select **Use an existing STS**, then under **STS WS-Federation metadata document location**, enter the URL for the WS-Federation metadata document. This URL is specified in the following format:

		https://accounts.accesscontrol.windows.net/<Domain Name or Tenant ID>/FederationMetadata/2007-06/FederationMetadata.xml 

	For this application, the WS-Federation metadata location is specified as shown below:

		https://accounts.accesscontrol.windows.net/fabrikam.onmicrosoft.com/FederationMetadata/2007-06/FederationMetadata.xml 

	After you have entered the metadata location, click **Next**.

5. On the next page of the Federation Utility, select **Disable certificate chain validation**, then click **Next**.

6. On the next page of the Federation Utility, select **No encryption**, then click **Next**.

7. The next page of the Federation Utility displays the claims provided by the STS. Review the claims, then click **Next**.

8. Next you will configure Internet Information Services (IIS) to support SSL for your development environment. To open the IIS Manager, you can type *inetmgr* at the **Run** prompt. 

9. In IIS Manager, expand the **Sites** folder in the left menu, then click on **Default Website Home**. From the **Actions** menu on the right, click **Bindings...**.

10. On the **Site Bindings** dialog, click **Add**. On the **Add Site Binding** dialog, change the **Type** dropdown to ***https***, then under **SSL certificate**, select **IIS Express Development Certificate**. Click **OK**.

11. In IIS Manager, click **Application Pools** in the left menu, then select the **ASP.NET v4.0** entry in the list and click **Advanced Settings** from the **Actions** menu on the right.

12. On the **Advanced Settings** dialog, set the **Load User Profile** property to **true**. Click **OK**.

13. In Visual Studio, open the **Web.config** file from **Solution Explorer** in the root of your project. 

14. In the **Web.config** file, locate the **wsFederation** section and add a **reply** attribute with the same value as the **$replyUrl** variable you specified when creating the Service Principal. For example:

		<wsFederation passiveRedirectEnabled="true" issuer="https://accounts.accesscontrol.windows.net/v2/wsfederation" realm="spn: 7829c758-2bef-43df-a685-717089474505" requireHttps="false" reply="https://localhost/OrgIdFederationSample" /> 

15. Add a **httpRuntime** node inside the **system.web** section with the **requestValidationMode** attribute set to **2.0**. For example:

		<system.web>
			<httpRuntime requestValidationMode="2.0" /> 
			...

	Save the **Web.config** file.

16. Now that you have enabled authentication for the web application, the **Index** page should be modified to present an authenticated user's claims. Open the **Index.cshtml** file located in the **Home** folder of the **Views** folder.

17. Add the following code snippet to the **Index.cshtml** file and save it:

		<p>
			@if (User.Identity.IsAuthenticated)
			{
			<ul>
				@foreach (string claim in ((Microsoft.IdentityModel.Claims.IClaimsIdentity)this.User.Identity).Claims.Select(c => c.ClaimType + " : " + c.Value))
				{
					<li>@claim</li>
				}
			</ul>
			}
		</p> 

18. After you have saved the changes to the **Index.cshtml** file, press **F5** to run the application. You will be redirected to the Office 365 Identity Provider page, where you can log in using your directory tenant credentials. For example, *john.doe@awesomecomputers.onmicrosoft.com*.

19. After you have signed in using your credentials, you will be redirected to the Index page of your Home controller, where your account's claims are displayed. This demonstrates a user successfully authenticating to the application using single sign-on provided by Azure Active Directory.

<h2><a name="summary"></a>Summary</h2>
This tutorial has shown you how to create and configure a single tenant application that uses the single sign-on capabilities of Azure Active Directory. You can also create multi-tenant applications for Azure Active Directory by reading the following tutorial: [Developing Multi-Tenant Cloud Applications with Azure Active Directory].

[Introduction]: #introduction
[Step 1: Create an ASP.NET MVC Application]: #createapp
[Step 2: Provision the Application in a Company's Directory Tenant]: #provisionapp
[Step 3: Protect the Application Using WS-Federation for Employee Sign In]: #protectapp
[Summary]: #summary
[Developing Multi-Tenant Cloud Applications with Azure Active Directory]: http://g.microsoftonline.com/0AX00en/121
[Windows Identity Foundation 3.5 SDK]: http://www.microsoft.com/en-us/download/details.aspx?id=4451
[Windows Identity Foundation 1.0 Runtime]: http://www.microsoft.com/en-us/download/details.aspx?id=17331
[Office 365 Powershell Commandlets]: http://onlinehelp.microsoft.com/en-us/office365-enterprises/ff652560.aspx
[ASP.NET MVC 3]: http://www.microsoft.com/en-us/download/details.aspx?id=4211

