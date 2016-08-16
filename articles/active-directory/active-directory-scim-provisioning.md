<properties
	pageTitle="Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications | Microsoft Azure"
	description="Azure Active Directory can automatically provision users and groups to any application or identity store that is fronted by a Web service with the interface defined in the SCIM protocol specification"
	services="active-directory"
	documentationCenter=""
	authors="asmalser-msft"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/09/2016"
	ms.author="asmalser-msft"/>

#Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications

##Overview

Azure Active Directory can automatically provision users and groups to any application or identity store that is fronted by a Web service with the interface defined in the [SCIM 2.0 protocol specification](https://tools.ietf.org/html/draft-ietf-scim-api-19). Azure Active Directory can send requests to create, modify and delete assigned users and groups to this Web service, which can then translate those requests into operations upon the target identity store. 

![][1]
*Figure: Provisioning from Azure Active Directory to an identity store via a Web service*

This capability can be used in conjunction with the “[bring your own app](http://blogs.technet.com/b/ad/archive/2015/06/17/bring-your-own-app-with-azure-ad-self-service-saml-configuration-gt-now-in-preview.aspx)” capability in Azure AD to enable single sign-on and automatic user provisioning for applications that provide or are fronted by a SCIM web service.

There are two use cases for SCIM in Azure Active Directory:

* **Provisioning users and groups to applications that support SCIM** - Applications that support SCIM 2.0 and use OAuth bearer tokens for authentication will work with Azure AD of the box.

* **Build your own provisioning solution for applications that support other API-based provisioning** - For non-SCIM applications, you can create a SCIM endpoint to translate between Azure AD’s SCIM endpoint and whatever API the application supports for user provisioning.  To aid in the development of a SCIM endpoint, we provide CLI libraries along with code samples that show you how to do provide a SCIM endpoint and translate SCIM messages.  

##Provisioning Users and Groups To Applications That Support SCIM

Azure Active Directory can be configured to automatically provision assigned users and groups to applications that implement a [System for Cross-domain Identity Management 2 (SCIM)](https://tools.ietf.org/html/draft-ietf-scim-api-19) Web service and accept OAuth bearer tokens for authentication. Within the SCIM 2.0 specification, applications must meet these requirements:

* Supports creating users and/or groups, as per section 3.3 of the SCIM protocol.  

* Supports modifying users and/or groups with patch requests as per section 3.5.2 of the SCIM protocol.  

* Supports retrieving a known resource as per section 3.4.1 of the SCIM protocol.  

*  Supports querying users and/or groups, as per section 3.4.2 of the SCIM protocol.  By default, users are queried by externalId and groups are queried by displayName.  

* Supports querying user by ID and by manager as per section 3.4.2 of the SCIM protocol.  

* Supports querying groups by ID and by member as per section 3.4.2 of the SCIM protocol.  

* Accepts OAuth bearer tokens for authorization as per section 2.1 of the SCIM protocol.

You should check with your application provider, or your application provider's documentation for statements of compatibility with these requirements.
 
###Getting Started

Applications that support the SCIM profile described above can be connected to Azure Active Directory using the "custom" app feature in the Azure AD application gallery. Once connected, Azure AD runs a synchronization process every 5 minutes where it queries the application's SCIM endpoint for assigned users and groups, and creates or modifies them according to the assignment details.

**To connect an application that supports SCIM:**

1.	In a web browser, launch the Azure management portal at https://manage.windowsazure.com.
2.	Browse to **Active Directory > Directory > [Your Directory] > Applications**, and select **Add > Add an application from the gallery**.
3.	Select the **Custom** tab on the left, enter a name for your application, and click the checkmark icon to create an app object.

![][2]

4.	In the resulting screen, select the second **Configure account provisioning** button.
5.	In the **Provisioning Endpoint URL** field, enter the URL of the application's SCIM endpoint.
6.	If the SCIM endpoint requires an OAuth bearer token from an issuer other than Azure AD, then copy the required OAuth bearer token into the **Authentication Token (optional)** field. Is this field is left blank, then Azure AD will include an OAuth bearer token issued from Azure AD with each request. Apps that use Azure AD as an idenity provider can validate this Azure AD -issued token.
7.	Click **Next**, and click on the **Start Test** button to have Azure Active Directory attempt to connect to the SCIM endpoint. If the attempts fail, diagnostic information will be displayed.  
8.	If the attempts to connect to the application succeed, then click **Next** on the remaining screens, and click **Complete** to exit the dialog.
9.	In the resulting screen, select the third **Assign Accounts** button. In the resulting Users and Groups section, assign the users or groups you want to provision to the application.
10.	Once users and groups are assigned, click the **Configure** tab near the top of the screen.
11.	Under **Account Provisioning**, confirm that the Status is set to On. 
12.	Under **Tools**, click **Restart account provisioning** to kick-start the provisioning process.

Note that 5-10 minutes may elapse before the provisioning process will begin to send requests to the SCIM endpoint.  A summary of connection attempts is provided on the application’s Dashboard tab, and both a report of provisioning activity and any provisioning errors can be downloaded from the directory’s Reports tab.

##Building Your Own Provisioning Solution For Any Application

By creating a SCIM web service that interfaces with Azure Active Directory, you can enable single sign-on and automatic user provisioning for virtually any application that provides a REST or SOAP user provisioning API.

Here’s how it works:

1.	Azure AD provides a common language infrastructure library named [Microsoft.SystemForCrossDomainIdentityManagement](https://www.nuget.org/packages/Microsoft.SystemForCrossDomainIdentityManagement/). System integrators and developers can use this library to create and deploy a SCIM-based web service endpoint capable of connecting Azure AD to any application’s identity store.
2.	Mappings are implemented in the web service to map the standardized user schema to the user schema and protocol required by the application.
3.	The endpoint URL is registered in Azure AD as part of a custom application in the application gallery.
4.	Users and groups are assigned to this application in Azure AD. Upon assignment, they are put into a queue to be synchronized to the target application. The synchronization process handling the queue runs every 5 minutes.

###Code Samples

To make this process easier, a set of [code samples](https://github.com/Azure/AzureAD-BYOA-Provisioning-Samples/tree/master) are provided that create a SCIM web service endpoint and demonstrate automatic provisioning. One sample is of a provider that maintains a file with rows of comma-separated values representing users and groups.  The other is of a provider that operates on the Amazon Web Services Identity and Access Management service.  

**Prerequisites**

* Visual Studio 2013 or later
* [Azure SDK for .NET](https://azure.microsoft.com/downloads/)
* Windows machine that supports the ASP.NET framework 4.5 to be used as the SCIM endpoint. This machine must be accessible from the cloud
* [An Azure subscription with a trial or licensed version of Azure AD Premium](https://azure.microsoft.com/services/active-directory/)
* The Amazon AWS sample requires libraries from the [AWS Toolkit for Visual Studio](http://docs.aws.amazon.com/AWSToolkitVS/latest/UserGuide/tkv_setup.html). See the README file included with the sample for additional details

###Getting Started

The easiest way to implement a SCIM endpoint that can accept provisioning requests from Azure AD is to build and deploy the code sample that outputs the provisioned users to a comma-separated value (CSV) file.

**To create a sample SCIM endpoint:**

1.	Download the code sample package at [https://github.com/Azure/AzureAD-BYOA-Provisioning-Samples/tree/master](https://github.com/Azure/AzureAD-BYOA-Provisioning-Samples/tree/master)
2.	Unzip the package and place it on your Windows machine at a location such as C:\AzureAD-BYOA-Provisioning-Samples\.
3.	In this folder, launch the FileProvisioningAgent solution in Visual Studio.
4.	Select **Tools > Library Package Manager > Package Manager Console**, and execute the commands below for the FileProvisioningAgent project to resolve the solution references:

    Install-Package Microsoft.SystemForCrossDomainIdentityManagement
    Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
    Install-Package Microsoft.Owin.Diagnostics
    Install-Package Microsoft.Owin.Host.SystemWeb

5.	Build the FileProvisioningAgent project.
6.	Launch the Command Prompt application in Windows (as an Administrator), and use the **cd** command to change the directory to your **\AzureAD-BYOA-Provisioning-Samples\ProvisioningAgent\bin\Debug** folder.
7.	Run the command below, replacing <ip-address> with the IP or domain name of the Windows Machine.

    FileAgnt.exe http://<ip-address>:9000 TargetFile.csv

8.	In Windows under **Windows Settings > Network & Internet Settings**, select the **Windows Firewall > Advanced Settings**, and create an **Inbound Rule** that allows inbound access to port 9000.
9.	If the Windows machine is behind a router, the router will need to be configured to perform Network Access Translation between its port 9000 that is exposed to the internet, and port 9000 on the Windows machine. This is required for Azure AD to be able to access this endpoint in the cloud.


**To register the sample SCIM endpoint in Azure AD:**

1.	In a web browser, launch the Azure management portal at https://manage.windowsazure.com.
2.	Browse to **Active Directory > Directory > [Your Directory] > Applications**, and select **Add > Add an application from the gallery**.
3.	Select the **Custom** tab on the left, enter a name such as “SCIM Test App”, and click the checkmark icon to create an app object. Note that the application object created is intend to represent the target app you would be provisioning to and implementing single sign-on for, and not just the SCIM endpoint.

![][2]

4.	In the resulting screen, select the second **Configure account provisioning** button.
5.	In the dialog, enter the internet-exposed URL and port of your SCIM endpoint. This would be something like http://testmachine.contoso.com:9000 or http://<ip-address>:9000/, where <ip-address> is the internet exposed IP address.  
6.	Click **Next**, and click on the **Start Test** button to have Azure Active Directory attempt to connect to the SCIM endpoint. If the attempts fail, diagnostic information will be displayed.  
7.	If the attempts to connect to your Web service succeed, then click **Next** on the remaining screens, and click **Complete** to exit the dialog.
8.	In the resulting screen, select the third **Assign Accounts** button. In the resulting Users and Groups section, assign the users or groups you want to provision to the application.
9.	Once users and groups are assigned, click the **Configure** tab near the top of the screen.
10.	Under **Account Provisioning**, confirm that the Status is set to On. 
11.	Under **Tools**, click **Restart account provisioning** to kick-start the provisioning process.

Note that 5-10 minutes may elapse before the provisioning process will begin to send requests to the SCIM endpoint.  A summary of connection attempts is provided on the application’s Dashboard tab, and both a report of provisioning activity and any provisioning errors can be downloaded from the directory’s Reports tab.

The final step in verifying the sample is to open the TargetFile.csv file in the \AzureAD-BYOA-Provisioning-Samples\ProvisioningAgent\bin\Debug folder on your Windows machine. Once the provisioning process is run, this file shows the details of all assigned and provisioned users and groups.

###Development Libraries

To develop your own Web service that conforms to the SCIM specification, first familiarize yourself with the following libraries provided by Microsoft to help accelerate the development process: 

**1:**  Common Language Infrastructure libraries are offered for use with languages based on that infrastructure, such as C#.  One of those libraries, [Microsoft.SystemForCrossDomainIdentityManagement.Service](https://www.nuget.org/packages/Microsoft.SystemForCrossDomainIdentityManagement/), declares an interface, Microsoft.SystemForCrossDomainIdentityManagement.IProvider, shown in the figure below.  A developer using the libraries would implement that interface with a class that may be referred to, generically, as a provider.  The libraries enable the developer to easily deploy a Web service that conforms to the SCIM specification, either hosted within Internet Information Services, or any executable Common Language Infrastructure assembly.  Requests to that Web service will be translated into calls to the provider’s methods, which would be programmed by the developer to operate on some identity store.    

![][3]

**2:**  [Express route handlers](http://expressjs.com/guide/routing.html) are available for parsing node.js request objects representing calls (as defined by the SCIM specification), made to a node.js Web service.   

###Building a Custom SCIM Endpoint

Using the libraries described above, developers using those libraries can host their services within any executable Common Language Infrastructure assembly, or within Internet Information Services.  Here is sample code for hosting a service within an executable assembly, at the address http://localhost:9000: 

    private static void Main(string[] arguments)
    {
    // Microsoft.SystemForCrossDomainIdentityManagement.IMonitor, 
    // Microsoft.SystemForCrossDomainIdentityManagement.IProvider and 
    // Microsoft.SystemForCrossDomainIdentityManagement.Service are all defined in 
    // Microsoft.SystemForCrossDomainIdentityManagement.Service.dll.  
    
    Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitor = 
      new DevelopersMonitor();
    Microsoft.SystemForCrossDomainIdentityManagement.IProvider provider = 
      new DevelopersProvider(arguments[1]);
    Microsoft.SystemForCrossDomainIdentityManagement.Service webService = null;
    try
    {
        webService = new WebService(monitor, provider);
        webService.Start("http://localhost:9000");

        Console.ReadKey(true);
    }
    finally
    {
        if (webService != null)
        {
            webService.Dispose();
            webService = null;
        }
    }
    }

    public class WebService : Microsoft.SystemForCrossDomainIdentityManagement.Service
    {
    private Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitor;
    private Microsoft.SystemForCrossDomainIdentityManagement.IProvider provider;

    public WebService(
      Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitoringBehavior, 
      Microsoft.SystemForCrossDomainIdentityManagement.IProvider providerBehavior)
    {
        this.monitor = monitoringBehavior;
        this.provider = providerBehavior;
    }

    public override IMonitor MonitoringBehavior
    {
        get
        {
            return this.monitor;
        }

        set
        {
            this.monitor = value;
        }
    }

    public override IProvider ProviderBehavior
    {
        get
        {
            return this.provider;
        }

        set
        {
            this.provider = value;
        }
    }
    }

It is important to note that this service must have an HTTP address and server authentication certificate of which the root certification authority is one of the following: 

* CNNIC
* Comodo
* CyberTrust
* DigiCert
* GeoTrust
* GlobalSign
* Go Daddy
* Verisign
* WoSign

A server authentication certificate can be bound to a port on a Windows host using the network shell utility, like so: 

    netsh http add sslcert ipport=0.0.0.0:443 certhash=0000000000003ed9cd0c315bbb6dc1c08da5e6 appid={00112233-4455-6677-8899-AABBCCDDEEFF}  
 
Here, the value provided for the certhash argument is the thumbprint of the certificate, while the value provided for the appid argument is an arbitrary globally-unique identifier.  

To host the service within Internet Information Services, a developer would build a Common Language Infrastructure code library assembly with a class named Startup in the default namespace of the assembly.  Here is a sample of such a class: 

    public class Startup
    {
    // Microsoft.SystemForCrossDomainIdentityManagement.IWebApplicationStarter, 
    // Microsoft.SystemForCrossDomainIdentityManagement.IMonitor and  
    // Microsoft.SystemForCrossDomainIdentityManagement.Service are all defined in 
    // Microsoft.SystemForCrossDomainIdentityManagement.Service.dll.  

    Microsoft.SystemForCrossDomainIdentityManagement.IWebApplicationStarter starter;

    public Startup()
    {
        Microsoft.SystemForCrossDomainIdentityManagement.IMonitor monitor = 
          new DevelopersMonitor();
        Microsoft.SystemForCrossDomainIdentityManagement.IProvider provider = 
          new DevelopersProvider();
        this.starter = 
          new Microsoft.SystemForCrossDomainIdentityManagement.WebApplicationStarter(
            provider, 
            monitor);
    }

    public void Configuration(
      Owin.IAppBuilder builder) // Defined in in Owin.dll.  
    {
        this.starter.ConfigureApplication(builder);
    }
    }

###Handling Endpoint Authentication

Requests from Azure Active Directory include an OAuth 2.0 bearer token.   Any service receiving the request should authenticate the issuer as being Azure Active Directory on behalf of the expected Azure Active Directory tenant, for access to Azure Active Directory’s Graph Web service.  In the token, the issuer is identified by an iss claim, like, "iss":"https://sts.windows.net/cbb1a5ac-f33b-45fa-9bf5-f37db0fed422/".  In this example, the base address of the claim value, https://sts.windows.net, identifies Azure Active Directory as the issuer, while the relative address segment, cbb1a5ac-f33b-45fa-9bf5-f37db0fed422, is a unique identifier of the Azure Active Directory tenant on behalf of which the token was issued.  If the token was issued for accessing the Azure Active Directory’s Graph Web service, then the identifier of that service, 00000002-0000-0000-c000-000000000000, should be in the value of the token’s aud claim.  

Developers using the Common Language Infrastructure libraries provided by Microsoft for building a SCIM service can authenticate requests from Azure Active Directory using the Microsoft.Owin.Security.ActiveDirectory package by following these steps: 

**1:**  In a provider, implement the Microsoft.SystemForCrossDomainIdentityManagement.IProvider.StartupBehavior property by having it return a method to be called whenever the service is started: 

    public override Action\<Owin.IAppBuilder, System.Web.Http.HttpConfiguration.HttpConfiguration\> StartupBehavior
    {
      get
      {
        return this.OnServiceStartup;
      }
    }

    private void OnServiceStartup(
      Owin.IAppBuilder applicationBuilder,  // Defined in Owin.dll.  
      System.Web.Http.HttpConfiguration configuration)  // Defined in System.Web.Http.dll.  
    {
    }

**2:**  Add the following code to that method to have any request to any of the service’s endpoints authenticated as bearing a token issued by Azure Active Directory on behalf of a specified tenant, for access to Azure Active Directory’s Graph Web service: 

    private void OnServiceStartup(
      Owin.IAppBuilder applicationBuilder IAppBuilder applicationBuilder, 
      System.Web.Http.HttpConfiguration HttpConfiguration configuration)
    {
      // IFilter is defined in System.Web.Http.dll.  
      System.Web.Http.Filters.IFilter authorizationFilter = 
        new System.Web.Http.AuthorizeAttribute(); // Defined in System.Web.Http.dll.configuration.Filters.Add(authorizationFilter);

      // SystemIdentityModel.Tokens.TokenValidationParameters is defined in    
      // System.IdentityModel.Token.Jwt.dll.
      SystemIdentityModel.Tokens.TokenValidationParameters tokenValidationParameters =     
        new TokenValidationParameters()
        {
          ValidAudience = "00000002-0000-0000-c000-000000000000"
        };

      // WindowsAzureActiveDirectoryBearerAuthenticationOptions is defined in 
      // Microsoft.Owin.Security.ActiveDirectory.dll
      Microsoft.Owin.Security.ActiveDirectory.
      WindowsAzureActiveDirectoryBearerAuthenticationOptions authenticationOptions =
        new WindowsAzureActiveDirectoryBearerAuthenticationOptions()    {
        TokenValidationParameters = tokenValidationParameters,
        Tenant = "03F9FCBC-EA7B-46C2-8466-F81917F3C15E" // Substitute the appropriate tenant’s 
                                                      // identifier for this one.  
      };

      applicationBuilder.UseWindowsAzureActiveDirectoryBearerAuthentication(authenticationOptions);
    }

##User and Group Schema

Azure Active Directory can provision two types of resources to SCIM Web Services.  Those types of resources are users and groups.  

User resources are identified by the schema identifier, urn:ietf:params:scim:schemas:extension:enterprise:2.0:User, which is included in this protocol specification: http://tools.ietf.org/html/draft-ietf-scim-core-schema.  The default mapping of the attributes of users in Azure Active Directory to the attributes of urn:ietf:params:scim:schemas:extension:enterprise:2.0:User resources is provided in table 1, below.  

Group resources are identified by the schema identifier, http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/Group.  Table 2, below, shows the default mapping of the attributes of groups in Azure Active Directory to the attributes of http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/Group resources.  

###Table 1: Default user attribute mapping

| Azure Active Directory user | urn:ietf:params:scim:schemas:extension:enterprise:2.0:User |
| ------------- | ------------- |
| IsSoftDeleted | active |
| displayName | displayName |
| Facsimile-TelephoneNumber | phoneNumbers[type eq "fax"].value |
| givenName | name.givenName |
| jobTitle | title |
| mail | emails[type eq "work"].value |
| mailNickname | externalId |
| manager | manager |
| mobile | phoneNumbers[type eq "mobile"].value |
| objectId | id |
| postalCode | addresses[type eq "work"].postalCode |
| proxy-Addresses | emails[type eq "other"].Value |
| physical-Delivery-OfficeName | addresses[type eq "other"].Formatted |
| streetAddress | addresses[type eq "work"].streetAddress |
| surname | name.familyName |
| telephone-Number | phoneNumbers[type eq "work"].value |
| user-PrincipalName | userName |


###Table 2: Default group attribute mapping

| Azure Active Directory group | http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/Group |
| ------------- | ------------- |
| displayName | externalId |
| mail | emails[type eq "work"].value |
| mailNickname | displayName |
| members | members |
| objectId | id |
| proxyAddresses | emails[type eq "other"].Value |


##User Provisioning and De-Provisioning

The figure below shows the messages that Azure Active Directory will send to a SCIM service to manage the lifecycle of a user in another identity store.  The diagram also shows how a SCIM service implemented using the Common Language Infrastructure libraries provided by Microsoft for building such services will translate those requests into calls to the methods of a provider.  

![][4]
*Figure: User provisioning and de-provisioning sequence*

**1:**  Azure Active Directory will query the service for a user with an externalId attribute value matching the mailNickname attribute value of a user in Azure Active Directory.  The query will be expressed as a Hypertext Transfer Protocol request like this one, wherein jyoung is a sample of a mailNickname of a user in Azure Active Directory: 

    GET https://.../scim/Users?filter=externalId eq jyoung HTTP/1.1
    Authorization: Bearer ...

If the service was built using the Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services, then the request will be translated into a call to the Query method of the service’s provider.  Here is the signature of that method: 

    // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
    // Microsoft.SystemForCrossDomainIdentityManagement.Resource is defined in 
    // Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  
    // Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters is defined in 
    // Microsoft.SystemForCrossDomainIdentityManagement.Protocol.  

    System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource[]> Query(
      Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters parameters, 
      string correlationIdentifier);

Here is the definition of the Microsoft.SystemForCrossDomainIdentityManagement.IQueryParameters interface: 

    public interface IQueryParameters: 
      Microsoft.SystemForCrossDomainIdentityManagement.IRetrievalParameters
    {
        System.Collections.Generic.IReadOnlyCollection <Microsoft.SystemForCrossDomainIdentityManagement.IFilter> AlternateFilters 
        { get; }
    }

    public interface Microsoft.SystemForCrossDomainIdentityManagement.IRetrievalParameters
	{
      system.Collections.Generic.IReadOnlyCollection<string> ExcludedAttributePaths 
      { get; }
      System.Collections.Generic.IReadOnlyCollection<string> RequestedAttributePaths 
      { get; }
      string SchemaIdentifier 
	  { get; }
    }

    public interface Microsoft.SystemForCrossDomainIdentityManagement.IFilter
    {
        Microsoft.SystemForCrossDomainIdentityManagement.IFilter AdditionalFilter 
          { get; set; }
        string AttributePath 
          { get; } 
        Microsoft.SystemForCrossDomainIdentityManagement.ComparisonOperator FilterOperator 
          { get; }
        string ComparisonValue 
          { get; }
    }
    
    public enum Microsoft.SystemForCrossDomainIdentityManagement.ComparisonOperator
    {
        Equals
    }

In the case of the foregoing sample of a query for a user with a given value for the externalId attribute, values of the arguments passed to the Query method will be as follows: 

* parameters.AlternateFilters.Count: 1
* parameters.AlternateFilters.ElementAt(0).AttributePath: "externalId"
* parameters.AlternateFilters.ElementAt(0).ComparisonOperator: ComparisonOperator.Equals
* parameters.AlternateFilter.ElementAt(0).ComparisonValue: "jyoung"
* correlationIdentifier: System.Net.Http.HttpRequestMessage.GetOwinEnvironment["owin.RequestId"] 

**2:**  If the response to a query to the service for a user with an externalId attribute value matching the mailNickname attribute value of a user in Azure Active Directory does not return any users, then Azure Active Directory will request that the service provision a user corresponding to the one in Azure Active Directory.  Here is an example of such a request: 

    POST https://.../scim/Users HTTP/1.1
    Authorization: Bearer ...
    Content-type: application/json
    {
      "schemas":
      [
        "urn:ietf:params:scim:schemas:core:2.0:User",
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0User"],
      "externalId":"jyoung",
      "userName":"jyoung",
      "active":true,
      "addresses":null,
      "displayName":"Joy Young",
      "emails": [
        {
          "type":"work",
          "value":"jyoung@Contoso.com",
          "primary":true}],
      "meta": {
        "resourceType":"User"},
       "name":{
        "familyName":"Young",
        "givenName":"Joy"},
      "phoneNumbers":null,
      "preferredLanguage":null,
      "title":null,
      "department":null,
      "manager":null}

The Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services would translate that request into a call to the Create method of the service’s provider.  The Create method has this signature: 

    // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
    // Microsoft.SystemForCrossDomainIdentityManagement.Resource is defined in 
    // Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  

    System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource> Create(
      Microsoft.SystemForCrossDomainIdentityManagement.Resource resource, 
      string correlationIdentifier);

In the case of a request to provision a user, the value of the resource argument will be an instance of the Microsoft.SystemForCrossDomainIdentityManagement. Core2EnterpriseUser class, defined in the Microsoft.SystemForCrossDomainIdentityManagement.Schemas library.  If the request to provision the user succeeds, then the implementation of the method is expected to return an instance of the the Microsoft.SystemForCrossDomainIdentityManagement. Core2EnterpriseUser class, with the value of the Identifier property set to the unique identifier of the newly-provisioned user.  

**3:**  To update a user known to exist in an identity store fronted by an SCIM, Azure Active Directory will proceed by requesting the current state of that user from the service with a request like this one: 

    GET ~/scim/Users/54D382A4-2050-4C03-94D1-E769F1D15682 HTTP/1.1
    Authorization: Bearer ...

In a service built using the Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services, the request will be translated into a call to the Retrieve method of the service’s provider.  Here is the signature of the Retrieve method: 

    // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
    // Microsoft.SystemForCrossDomainIdentityManagement.Resource and 
    // Microsoft.SystemForCrossDomainIdentityManagement.IResourceRetrievalParameters 
    // are defined in Microsoft.SystemForCrossDomainIdentityManagement.Schemas.  
    System.Threading.Tasks.Task<Microsoft.SystemForCrossDomainIdentityManagement.Resource> 
       Retrieve(
         Microsoft.SystemForCrossDomainIdentityManagement.IResourceRetrievalParameters 
           parameters, 
           string correlationIdentifier);
    
    public interface 
      Microsoft.SystemForCrossDomainIdentityManagement.IResourceRetrievalParameters:   
        IRetrievalParameters
        {
          Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier 
            ResourceIdentifier 
              { get; }
    }
    public interface Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier
    {
        string Identifier 
          { get; set; }
        string Microsoft.SystemForCrossDomainIdentityManagement.SchemaIdentifier 
          { get; set; }
    }

In the case of the foregoing example of a request to retrieve the current state of a user, the values of the properties of the object provided as the value of the parameters argument will be as follows: 

* Identifier: "54D382A4-2050-4C03-94D1-E769F1D15682"
* SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

**4:**  If a reference attribute is to be updated, then Azure Active Directory will query the service to determine whether or not the current value of the reference attribute in the identity store fronted by the service already matches the value of that attribute in Azure Active Directory.  In the case of users, the only attribute of which the current value will be queried in this way is the manager attribute.  Here is an example of a request to determine whether the manager attribute of a particular user object currently has a certain value: 

    GET ~/scim/Users?filter=id eq 54D382A4-2050-4C03-94D1-E769F1D15682 and manager eq 2819c223-7f76-453a-919d-413861904646&attributes=id HTTP/1.1
    Authorization: Bearer ...

The value of the attributes query parameter, id, signifies that if a user object exists that satisfies the expression provided as the value of the filter query parameter, then the service is expected to respond with a urn:ietf:params:scim:schemas:core:2.0:User or urn:ietf:params:scim:schemas:extension:enterprise:2.0:User resource, including only the value of that resource’s id attribute.  Of course, the value of the id attribute is known to the requestor—it is included in the value of the filter query parameter; the purpose of asking for it is actually to request a minimal representation of a resource that satisfying the filter expression as an indication of whether or not any such object exists.   

If the service was built using the Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services, then the request will be translated into a call to the Query method of the service’s provider.  The value of the properties of the object provided as the value of the parameters argument will be as follows: 

* parameters.AlternateFilters.Count: 2
* parameters.AlternateFilters.ElementAt(x).AttributePath: "id"
* parameters.AlternateFilters.ElementAt(x).ComparisonOperator: ComparisonOperator.Equals
* parameters.AlternateFilter.ElementAt(x).ComparisonValue: "54D382A4-2050-4C03-94D1-E769F1D15682"
* parameters.AlternateFilters.ElementAt(y).AttributePath: "manager"
* parameters.AlternateFilters.ElementAt(y).ComparisonOperator: ComparisonOperator.Equals
* parameters.AlternateFilter.ElementAt(y).ComparisonValue: "2819c223-7f76-453a-919d-413861904646"
* parameters.RequestedAttributePaths.ElementAt(0): "id"
* parameters.SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

Here, the value of the index x may be 0 and the value of the index y may be 1, or the value of x may be 1 and the value of y may be 0, depending on the order of the expressions of the filter query parameter.   

**5:**  Here is an example of a request from Azure Active Directory to an SCIM service to update a user: 

    PATCH ~/scim/Users/54D382A4-2050-4C03-94D1-E769F1D15682 HTTP/1.1
    Authorization: Bearer ...
    Content-type: application/json
    {
      "schemas": 
      [
        "urn:ietf:params:scim:api:messages:2.0:PatchOp"],
      "Operations":
      [
        {
          "op":"Add",
          "path":"manager",
          "value":
            [
              {
                "$ref":"http://.../scim/Users/2819c223-7f76-453a-919d-413861904646",
                "value":"2819c223-7f76-453a-919d-413861904646"}]}]}

The Microsoft Common Language Infrastructure libraries for implementing SCIM services would translate the request into a call to the Update method of the service’s provider.  Here is the signature of that method: 

    // System.Threading.Tasks.Tasks and 
    // System.Collections.Generic.IReadOnlyCollection<T>
    // are defined in mscorlib.dll.  
    // Microsoft.SystemForCrossDomainIdentityManagement.IPatch, 
    // Microsoft.SystemForCrossDomainIdentityManagement.PatchRequestBase, 
    // Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier, 
    // Microsoft.SystemForCrossDomainIdentityManagement.PatchOperation, 
    // Microsoft.SystemForCrossDomainIdentityManagement.OperationName, 
    // Microsoft.SystemForCrossDomainIdentityManagement.IPath and 
    // Microsoft.SystemForCrossDomainIdentityManagement.OperationValue 
    // are all defined in Microsoft.SystemForCrossDomainIdentityManagement.Protocol. 

    System.Threading.Tasks.Task Update(
      Microsoft.SystemForCrossDomainIdentityManagement.IPatch patch, 
      string correlationIdentifier);

    public interface Microsoft.SystemForCrossDomainIdentityManagement.IPatch
    {
    Microsoft.SystemForCrossDomainIdentityManagement.PatchRequestBase 
      PatchRequest 
        { get; set; }
    Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier 
      ResourceIdentifier 
        { get; set; }        
    }

    public class PatchRequest2: 
      Microsoft.SystemForCrossDomainIdentityManagement.PatchRequestBase
    {
    public System.Collections.Generic.IReadOnlyCollection
      <Microsoft.SystemForCrossDomainIdentityManagement.PatchOperation> 
        Operations
        { get;}

    public void AddOperation(
      Microsoft.SystemForCrossDomainIdentityManagement.PatchOperation operation);
    }

    public class PatchOperation
    {
    public Microsoft.SystemForCrossDomainIdentityManagement.OperationName 
      Name
      { get; set; }
    
    public Microsoft.SystemForCrossDomainIdentityManagement.IPath 
      Path
      { get; set; }

    public System.Collections.Generic.IReadOnlyCollection
      <Microsoft.SystemForCrossDomainIdentityManagement.OperationValue> Value
      { get; }

    public void AddValue(
      Microsoft.SystemForCrossDomainIdentityManagement.OperationValue value);
    }

    public enum OperationName
    {
      Add,
      Remove,
      Replace
    }

    public interface IPath
    {
      string AttributePath { get; }
      System.Collections.Generic.IReadOnlyCollection<IFilter> SubAttributes { get; }
      Microsoft.SystemForCrossDomainIdentityManagement.IPath ValuePath { get; }
    }

    public class OperationValue
    {
      public string Reference
      { get; set; }
      
      public string Value
      { get; set; }
    }



In the case of the foregoing example of a request to update a user, the object provided as the value of the patch argument will have these property values: 

* ResourceIdentifier.Identifier: "54D382A4-2050-4C03-94D1-E769F1D15682"
* ResourceIdentifier.SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
* (PatchRequest as PatchRequest2).Operations.Count: 1
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).OperationName: OperationName.Add
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Path.AttributePath: "manager"
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Value.Count: 1
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Value.ElementAt(0).Reference: http://.../scim/Users/2819c223-7f76-453a-919d-413861904646
* (PatchRequest as PatchRequest2).Operations.ElementAt(0).Value.ElementAt(0).Value: 2819c223-7f76-453a-919d-413861904646

**6:**  To de-provision a user from an identity store fronted by an SCIM service, Azure Active Directory will send a request like this one: 

    DELETE ~/scim/Users/54D382A4-2050-4C03-94D1-E769F1D15682 HTTP/1.1
    Authorization: Bearer ...
	
If the service was built using the Common Language Infrastructure libraries provided by Microsoft for implementing SCIM services, then the request will be translated into a call to the Delete method of the service’s provider.   That method has this signature: 

    // System.Threading.Tasks.Tasks is defined in mscorlib.dll.  
    // Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier, 
    // is defined in Microsoft.SystemForCrossDomainIdentityManagement.Protocol. 
    System.Threading.Tasks.Task Delete(
      Microsoft.SystemForCrossDomainIdentityManagement.IResourceIdentifier  
        resourceIdentifier, 
      string correlationIdentifier);
 
The object provided as the value of the resourceIdentifier argument will have these property values in the case of the foregoing example of a request to de-provision a user: 

* ResourceIdentifier.Identifier: "54D382A4-2050-4C03-94D1-E769F1D15682"
* ResourceIdentifier.SchemaIdentifier: "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"

##Group Provisioning and De-Provisioning

The figure below shows the messages that Azure Active Directory will send to a SCIM service to manage the lifecycle of a group in another identity store.  Those messages differ from the messages pertaining to users in three ways: 

* The schema of a group resource will be identified as http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/Group.  
* Requests to retrieve groups will stipulate that the members attribute is to be excluded from any resource provided in response to the request.  
* Requests to determine whether a reference attribute has a certain value will be requests about the members attribute.  

![][5]
*Figure: Group provisioning and de-provisioning sequence*

##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Automate User Provisioning/Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md)
- [Customizing Attribute Mappings for User Provisioning](active-directory-saas-customizing-attribute-mappings.md)
- [Writing Expressions for Attribute Mappings](active-directory-saas-writing-expressions-for-attribute-mappings.md)
- [Scoping Filters for User Provisioning](active-directory-saas-scoping-filters.md)
- [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)


	
<!--Image references-->
[1]: ./media/active-directory-scim-provisioning/scim-figure-1.PNG
[2]: ./media/active-directory-scim-provisioning/scim-figure-2.PNG
[3]: ./media/active-directory-scim-provisioning/scim-figure-3.PNG
[4]: ./media/active-directory-scim-provisioning/scim-figure-4.PNG
[5]: ./media/active-directory-scim-provisioning/scim-figure-5.PNG
