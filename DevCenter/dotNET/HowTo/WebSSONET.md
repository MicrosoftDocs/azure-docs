# How to implement single sign-on with Windows Azure Active Directory - ASP.NET Application#

<h2>Table of Contents</h2>
<li>
<a href="#overview">Overview</a>
</li>
<li>
<a href="#prerequisites">Prerequisites</a></li>
<li><a href="#step1">Step 1 - Create an ASP.NET MVC application</a></li>
<li><a href="#step2">Step 2 - Provision the ASP.NET MVC application in Office 365</a></li>
<li><a href="#step3">Step 3 - Protect the ASP.NET application via WS-Federation and onboard the first customer</a></li>
<li><a href="#step4">Step 4 - Configure the ASP.NET application for single sign-on with multiple tenants</a></li>	

<a name="overview"></a>
## Overview ##
This guide provides instructions for creating an ASP.NET MVC application and configuring it to leverage Windows Azure Active Directory. 

Imagine the following scenario:

- Fabrikam is an independent software vendor with an ASP.NET MVC web application

- Awesome Computers has a subscription to Office 365

- Trey Research Inc. has a subscription to Office 365



Awesome Computers wants to provide their users (employees) with the access to the Fabrikam's ASP.NET application. After some deliberation, both parties agree to utilize the web single sign-on approach, also called identity federation with the end result being that Awesome Computers' users will be able to access Fabrikam's ASP.NET MVC application in exactly the same way they access Office 365 applications. 

This web single sign-on method is made possible with the help of the Windows Azure Active Directory, which is also used by Office 365. Windows Azure Active Directory provides directory, authentication, and authorization services, including a Security Token Service (STS). 

With the web single sign-on approach, Awesome Computers will provide single sign-on access to their users through a federated mechanism that relies on an STS. Since Awesome Computers does not have its own STS, they will rely on the STS provided by Windows Azure Active Directory that was provisioned for them when they acquired Office 365.

In the instructions provided in this guide, we will play the roles of both Fabrikam and Awesome Computers and recreate this scenario by performing the following tasks: 

- Create a simple ASP.NET MVC application (performed by Fabrikam)
- Provision an ASP.NET MVC web application in Windows Azure Active Directory (performed by Awesome Computers).

	**Note:* As part of this step, Awesome Computers must in turn be provisioned by the Fabrikam as a customer of their ASP.NET application. Basically, Fabrikam needs to know that users from the Office 365 tenant with the domain **awesomecomputers.onmicrosoft.com** should be granted access to their ASP.NET application. *
- Protect the ASP.NET MVC application with WS-Federation and onboard the first customer (performed by Fabrikam)
- Modify the ASP.NET MVC application to handle single sign-on with multiple tenants (performed by Fabrikam)

**Assets**

This guide is available together with several code samples and scripts that can help you with some of the most time-consuming tasks. All materials are available at [Azure Active Directory SSO for .Net](https://github.com/WindowsAzure/azure-sdk-for-net-samples) for you to study and modify to fit your environment. 

<a name="prerequisites"></a>
## Prerequisites ##

To complete the tasks in this guide, you will need the following:

**General environment requirements:**

- Internet Information Services (IIS) 7.5 (with SSL enabled)
- Windows PowerShell 2.0
- [Microsoft Online Services Module](http://g.microsoftonline.com/0BX10en/229)

**ASP.NET-specific requirements:**

<ul>
    <li>Microsoft Visual Studio 2010</li>
    <li>
      <a href="http://www.microsoft.com/download/en/details.aspx?id=17331">Windows Identity Foundation</a>
    </li>
    <li>
      <a href="http://www.microsoft.com/download/en/details.aspx?id=4451">Windows Identity Foundation SDK</a>
    </li>
<li>.Net Framework 4.0</li>
<li>ASP.Net MVC 3 (http://www.asp.net/mvc/mvc3)</li>
</ul>

<a name="step1"></a>
## Step 1 - Create an ASP.NET MVC application ##

The instructions in this step demonstrate how to create a simple ASP.NET MVC application. In our scenario, this step is performed by Fabrikam.

**To create an ASP.NET Application:**

1.	Open a new instance of Visual Studio 2010 using  the **Run as administrator…** option. 
2.	To create a new project, click **File** -> **New Project** -> **Web** -> **ASP.NET MVC 3 Web Application** -> **Empty**.

	<img src="../../../DevCenter/dotNet/Media/ssostep1Step2.png" />	


3.	Create a controller/view (HomeController/Index) which will be the main page of the sample website.

	<img src="../../../DevCenter/dotNet/Media/ssostep1Step3.png" />	

4.	Right-click the **OrgIdFederationSample** project in the Solution Explorer. Select **Properties** -> **Web** and then **Use Local IIS Web server**. Click **Yes** when the dialog box is displayed.

	<img src="../../../DevCenter/dotNet/Media/ssostep1Step4.png" />	

5.	Run the application (F5) to see the Index view.

6.	Open the Windows PowerShell 2.0 console and run the following command to generate a new GUID for this application:

	<img src="../../../DevCenter/dotNet/Media/ssostep1Step6.png" />	

*Note:* Make sure to record this value. This identifier will be the AppPrincipalId used in further steps in this guide when provisioning this ASP.NET applicaiton in Office 365.

<a name="step2"></a>
## Step 2 - Provision the ASP.NET MVC application in Windows Azure Active Directory ##

Instructions in this step demonstrate how you can provision the ASP.NET application in Windows Azure Active Directory. In our scenario, this step is performed by. Awesome Computers then provides the application owner (Fabrikam) with the data Fabrikam needs in order to set up single sign-on access for Awesome Computers's users. 

Note: If you don’t have access to an Office 365, you can obtain one by applying for a FREE TRIAL subscription on the [Office 365’s Sign-up page](http://www.microsoft.com/en-us/office365/online-software.aspx#fbid=8qpYgwknaWN). 

To provision the ASP.NET application in Windows Azure Active Directory, Awesome Computers creates a new Service Principal for it in the directory. In order to create a new Service principal for the ASP.NET application in the directory, Awesome Computers must obtain the following information from Fabrikam:

- The value of the ServicePrincipalName (OrgIdFederationSample/localhost)
- The AppPrincipalId (7829c758-2bef-43df-a685-717089474505)
- The ReplyUrl 

**To provision the ASP.NET application in Windows Azure Active Directory**

1.	Download and install a set of [Powershell scripts](https://bposast.vo.msecnd.net/MSOPMW/5164.009/amd64/administrationconfig-en.msi) from the Office 365’s online help page.
2.	Locate the CreateServicePrincipal.ps1 script in this code example set under WAAD.WebSSO.ASPNET/Scripts.

3.	Launch the Microsoft Online Services Module for Windows PowerShell console.

4.	Run the SampleAppServicePrincipal.ps1 command from the Microsoft Online Services Module for Windows PowerShell Console.

	<img src="../../../DevCenter/dotNet/Media/ssostep2Step4.png" />	

When asked to provide a name for your Service Principal, type in a descriptive name that you can remember in case you wish to inspect or remove the Service Principal later on.

<img src="../../../DevCenter/dotNet/Media/ssostep2Step45.png" />

5.	When prompted, enter your administration credentials for your Office365 tenant:

	<img src="../../../DevCenter/dotNet/Media/ssostep2Step5.png" />

6.	If the script runs successfully, your screen will look similar to the figure below. Make sure to record the values of the following for use later in this guide:

- company ID
- AppPrincipal ID
- App Principal Secret
- Audience URI


	<img src="../../../DevCenter/dotNet/Media/ssostep2Step6.png" />

The Fabrikam's application has been successfully provisioned in the directory tenant of Awesome Computers. 

Now Fabrikam must provision Awesome Computers as a customer of the ASP.NET application. In other words, Fabrikam must know that users from the Office 365 tenant with domain *awesomecomputers.onmicrosoft.com* should be granted access. How that information reaches Fabrikam depends on how the subscriptions are handled. In this guide, the instructions for this provisioning step are not provided. 

<a name="step3"></a>
## Step 3 - Protect the ASP.NET application via WS-Federation and onboard the first customer##

The instructions in this step demonstrate how to add support for federated login to the ASP.NET application created in Step 1. In our scenario, this step is performed by Fabrikam. 

With the ASP.NET application ready to authenticate requests using the WS-Federation protocol, we can add the Windows Azure AD tenant of Awesome Computers as a trusted provider. The initial setup of the federation will be done manually using FedUtil. The parameters required in the wizard will be: the audience Uri (spn:AppPrincipalId@realm) and the federation metadata (https://accounts.accesscontrol.windows.net/Federation……xml?realm=domain). 

The audienceURI was generated in Step 2 when Awesome Computers's admin ran the SampleAppServicePrincipal.ps1 script to provision Fabrikam's ASP.NET application. The following is an example of the audienceURI:

*appid@realm or 7829c758-2bef-43df-a685-717089474505@e4073280-196b-408f-9d40-0be89978fda0*

You can use this Audience URI to add the first customer to our solution:

1.	Right-click the project node in the Solution Explorer and select **Add STS reference…**.

2.	Provide the value of the Application URI based on the values obtained after creating the Service Principal. The URI must begin with spn:  which indicates the URI is a service principal name. The "appId@realm" values are set as follows:

- appId is the AppPrincipalId generated by the application.
- realm is the GUID that you retrieved from the Federation Metadata Endpoint in Step 1.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step2.png" />

	Enter the SPN and select **Next**. When a warning dialog is displayed, select **Yes** and continue.  The Federation Utility does not recognize the spn: format but will accept the change, and the application will then use a secure https connection. 

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step2.5.png" />

3. The next page of the wizard allows you to configure the STS for your web application.  Select **Use an existing STS**, and then enter the location for the WS-Federation metadata document (https://accounts.accesscontrol.windows.net/FederationMetadata/2007-06/FederationMetadata.xml?realm=awesomecomputers.onmicrosoft.com).

	*NOTE:* This is the same URL you used in Step 1 to get the correct realm to create the Audience URI.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step3.png" />

4. Click Next and select the **Disable certificate chain validation**.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step4.png" />

5. After configuring the existing STS for your realm, the next page of the wizard configures the Security token encryption.  Use the default value **No encryption**. 

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step5.png" />

6. Next, the Federation Utility shows the **Offered Claims** provided by the STS. Click **Next** to continue.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step6.png" />

7. Open the IIS manager and configure the **Default Web Site** to support SSL (https): select the **Default Web Site** item in the left menu, click **Bindings…** in the right-hand pane and when the **Site Bindings** dialog box appears click **Add** to set up https binding.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step7.png" />

8. From the IIS manager, click **Application Pools** item in the left-hand menu, select the **ASP.NET 4.0** application pool, and click **Advanced Settings…** to set the **Load User Profile** property to true.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step8.png" />

9. Return to Visual Studio and open the web.config file to perform the following changes:

- Find the **wsFederation** section and add a new attribute with the reply Url; the node will look like this:

		<img src="../../../DevCenter/dotNet/Media/ssostep3Step9.1.png" />


- Add the **httpRuntime** node inside the **system.web** section and set the requestValidationMode attribute to “2.0”.

		<img src="../../../DevCenter/dotNet/Media/ssostep3Step9.2.png" />

10. From now on the site will require authentication, so we will change the Index page to show the authenticated user information (claims). Open the Index view and add the following code snippet at the end of the page:

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step10.png" />

11. Press F5 to run the application and you will be redirected to the Office 365 identity provider page where you can log in using your awesomecomputers.onmicrosoft.com credentials (e.g. john.doe@awesomecomputers.onmicrosoft.com).

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step11.png" />

12. Finally, if the login process is successful you will be redirected to the secured page (Home/Index) as an authenticated user.

	<img src="../../../DevCenter/dotNet/Media/ssostep3Step12.png" />

**Important:** If your application is meant to work with a single Windows Azure Active Directory tenant, for example, if you are writing a LoB application, you can stop following the instructions in this guide at this point. By running the three steps above, you have successfully set up Windows Azure AD-enabled single sign-on to a simple ASP.NET application for the users in one tenant.

If, however, you are developing applications that need to be accessed by more than one tenant, the next step can help you modify your code to accommodate multiple tenants.  

<a name="step4"></a>
## Step 4 - Configure the ASP.NET application for single sign-on with Multiple tenants ##

What if Fabrikam wants to provide access to its application to multiple customers? The steps we performed in this guide so far ensure that single sign-on works with only one trusted provider. Fabrikam's developers must make some changes to their ASP.NET application in order to provide single sign-on to whatever future customers they obtain. The main new features needed are:

- Support for multiple identity providers in the login page
- Maintenance of the list of all trusted providers and the audienceURI they will send to the application; That list can be used to determine how to validate incoming tokens

Let's add another fictitious customer to our scenario, Trey research Inc. Trey Research Inc. must register Fabrikam's ASP.NET application in its tenant the same way Awesome Computers have done in Step 2. The following is the list of configuration changes that Fabrikam needs to perform to their ASP.NET application to enable multi-tenant single sign-on, intertwined with the provisioning of Trey Research Inc.

1.	From Visual Studio, add an empty XML file to the application root called “trustedIssuers.xml”. This file will contain a list of the trusted issuers for the application (in this case, Awesome Computers and Trey Research Inc.) which will be used by the dynamic audience Uri validator.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step1.png" />

2.	Go to the scripts folder and open the Microsoft.Samples.Waad.Federation.PS link to generate the trusted issuers’ nodes to add to the XML repository. It will prompt you for the AppPrincipalId and the AppDomain name to generate the issuer node as depicted below:

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step2.png" />

*Note:* Behind the scenes the script retrieves the federation metadata to get the issuer identifier for generating the realm’s SPN value.

3.	Open the XML file and include the generated node:

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step3.png" />

4.	Repeat Step 2 to generate Trey Research Inc. node. Notice that you can change the display name to show a user-friendly name.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step4.png" />

5.	Add a reference to Microsoft.Samples.Waad.Federation assembly.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step5.png" />

6.	Go to the web.config and add the following snippet inside **service** under **microsoft.IdentityModel**. This is the security token handler that will validate the audience Uri dynamically using the “trustedIssuers.xml” repository.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step6.png" />

7.	Since we want to create a custom login page to support both organizations, we can disable the automatic redirection. Locate the **wsFederation** node and set the attribute passiveRedirectEnabled to false.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step7.png" />

8.	Under **system.web** replace the **** node using the following snippet. This login page will display a list of trusted providers allowing users to perform the login process with their organization credentials.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step8.png" />

9.	Create a new controller/view (AccountController/Login)

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step9.png" />

10.	Open the Login view and add the following code snippet (at the end) to list the available trusted providers:

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step10.png" />

11.	Run the application (F5) to see a list with the links for each trusted identity provider retrieved from the “trustedIssuers.xml” repository.

	<img src="../../../DevCenter/dotNet/Media/ssostep4Step11.png" />

*Note:* The home realm discovery strategy of presenting an explicit list of trusted providers is not always feasible in practice. Here it is used for the sake of simplicity.

Once you see the list of the trusted identity providers in your browser, you can navigate to either provider: the authentication flow will unfold in the same way described in the former section. The application will validate the incoming token accordingly. You can try to delete entries in trusted.issuers.xml, as it would happen, for example, once a subscription expires, and verify that the application then will reject authentication attempts from the corresponding provider. 





