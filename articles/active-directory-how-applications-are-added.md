<properties
   pageTitle="How applications are added to Azure Active Directory."
   description="This article describes how applications are added to an instance of Azure Active Directory."
   services="active-directory"
   documentationCenter=""
   authors="shoatman"
   manager="kbrint"
   editor=""/>

   <tags
      ms.service="active-directory"
      ms.devlang="na"
      ms.topic="article"
      ms.tgt_pltfrm="na"
      ms.workload="identity"
      ms.date="03/23/2015"
      ms.author="shoatman"/>

# How and why applications are added to Azure AD

One of the initially puzzling things when viewing a list of applications in your instance of Azure Active Directory is understanding where the applications came from and why they are there.  This article will provide a high level overview of how applications are represented in the directory and provide you with context that will assist you in understanding how an application came to be in your directory.

## What services does Azure AD provide to applications?

Applications are added to Azure AD to leverage one or more of the services it provides.  Those services include:

* App authentication and authorization
* User authentication & authorization
* Single sign-on (SSO) using federation or password
* User provisioning & synchronization
* Role-based access control; Use the directory to define application roles to perform roles based authorization checks in an app.
* oAuth authorization services (used by Office 365 and other Microsoft apps to authorize access to APIs/resources.)
* Application publishing & proxy; Publish an app from a private network to the internet

## How are applications represented in the directory?

Applications are represented in the Azure AD using 2 objects: an application object and a service principal object.  There is one application object, registered in a "home"/"owner" or "publishing" directory and one or more service principal objects representing the application in every directory in which it acts.  

The application object describes the app to Azure AD (the multi-tenant service) and may include any of the following: (*Note*: This is not an exhaustive list.)

* Name, Logo & Publisher
* Secrets (symmetric and/or asymmetric keys used to authenticate the app)
* API dependencies (oAuth)
* APIs/resources/scopes published (oAuth)
* App roles (RBAC)
* SSO metadata and configuration (SSO)
* User provisioning metadata and configuration
* Proxy metadata and configuration

The service principal is a record of the application in every directory, where the application acts including its home directory.  The service principal:

* Refers back to an application object via the app id property
* Records local user and group app-role assignments
* Records local user and admin permissions granted to the app
    * For example: permission for the app to access a particular users email
* Records local policies including conditional access policy
* Records local alternate local settings for an app
    * Claims transformation rules
    * Attribute mappings (User provisioning)
    * Tenant specific app roles (if the app supports custom roles)
    * Name/Logo

### A diagram of application objects and service principals across directories

![A diagram illustrating how application objects and service principals existing with Azure AD instances.][apps_service_principals_directory]

As you can see from the diagram above.  Microsoft maintains two directories internally (on the left) it uses to publish applications. 
 
* One for Microsoft Apps (Microsoft services directory)
* One for pre-integrated 3rd Party Apps (App Gallery directory)

Application publishers/vendors who integrate with Azure AD are required to have a publishing directory.  (Some SAAS Directory).

Applications that you add yourself include:

* Apps you developed (integrated with AAD)
* Apps you connected for single-sign-on
* Apps you published using the Azure AD application proxy.

### A couple of notes and exceptions

* Not all service principals point back to application objects.  Huh? When Azure AD was originally built the services provided to applications were much more limited and the service principal was sufficient for establishing an app identity.  The original service principal was closer in shape to the Windows Server Active Directory service account.  For this reason it's still possible to create service principals using the Azure AD PowerShell without first creating an application object.  The Graph API requires an app object before creating a service principal.
* Not all of the information described above is currently exposed programmatically.  The following are only available in the UI:
    * Claims transformation rules
    * Attribute mappings (User provisioning)
* For more detailed information on the service principal and application objects please refer to the Azure AD Graph REST API reference documentation.  *Hint*: The Azure AD Graph API documentation is the closest thing to a schema reference for Azure AD that's currently available.  
    * [Application](https://msdn.microsoft.com/library/azure/dn151677.aspx)
    * [Service Principal](https://msdn.microsoft.com/library/azure/dn194452.aspx)


## How are apps added to my Azure AD instance?
There are many ways an app can be added to Azure AD:

* Add an app from the [Azure Active Directory App Gallery](http://azure.microsoft.com/updates/azure-active-directory-over-1000-apps/)
* Sign up/into a 3rd Party App integrated with Azure Active Directory (For example: [Smartsheet](https://app.smartsheet.com/b/home) or [DocuSign](https://www.docusign.net/member/MemberLogin.aspx))
    * During sign up/in users are asked to give permission to the app to access their profile and other permissions.  The first person to give consent causes a service principal representing the app to be added to the directory.
* Sign up/into Microsoft online services like [Office 365](http://products.office.com/)
    * When you subscribe to Office 365 or begin a trial one or more service principals are created in the directory representing the various services that are used to deliver all of the functionality associated with Office 365.
    * Some Office 365 services like SharePoint create service principals on an on-going basis to allow secure communication between components including workflows.
* Add an app you're developing in the Azure Management Portal see: https://msdn.microsoft.com/library/azure/dn132599.aspx
* Add an app you're developing using Visual Studio see:
    * [ASP.Net Authentication Methods](http://www.asp.net/visual-studio/overview/2013/creating-web-projects-in-visual-studio#orgauthoptions)
    * [Connected Services](http://blogs.msdn.com/b/visualstudio/archive/2014/11/19/connecting-to-cloud-services.aspx)
* Add an app to use to use the [Azure AD Application Proxy](https://msdn.microsoft.com/library/azure/dn768219.aspx)
* Connect an app for single sign on using SAML or Password SSO
* Many others including various developer experiences in Azure and/in API explorer experiences across developer centers

## Who has permission to add applications to my Azure AD instance?

Only global administrators can:

* Add apps from the Azure AD app gallery (pre-integrated 3rd Party Apps)
* Publish an app using the Azure AD Application Proxy

All users in your directory have rights to add applications that they are developing and discretion over which applications they share/give access to their organizational data.  *Remember user sign up/in to an app and granting permissions may result in a service principal being created.*

This might initially sound concerning, but keep the following in mind:

* Apps have been able to leverage Windows Server Active Directory for user authentication for many years without requiring the application to be registered/recorded in the directory.  Now the organization will have improved visibility to exactly how many apps are using the directory and what for.
* No need for admin driven app publishing/registration process.  With Active Directory Federation Services it was likely that an admin had to add an app as a relying party on behalf of developers.  Now developers can self-service.
* Users signing in/up to apps using their organization accounts for business purposes is a good thing.  If they subsequently leave the organization they will lose access to their account in the application they were using.
* Having a record of what data was shared with which application is a good thing.  Data is more transportable than ever and having a clear record of who shared what data with which applications is useful.
* Apps who use Azure AD for oAuth decide exactly what permissions that users are able to grant to applications and which permissions require an admin to agree to.  It should go without saying that only admins can consent to larger scopes and more significant permissions.
* Users adding and allowing apps to access their data are audited events so you can view the Audit Reports within the Azure Managment portal to determine how an app was added to the directory.

**Note:** *Microsoft itself has been operating using the default configuration for many months now.*

With all of that said it is possible to prevent users in your directory from adding applications and from exercising discretion over what information they share with applications by modifying Directory configuration in the Azure Management portal.  The following configuration can be accessed within the Azure Management portal on your Directory's "Configure" tab.

![A screenshot of the UI for configuring integrated app settings][app_settings]


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Learn more about how to add applications to Azure AD and how to configure services for apps.

* Developers: [Learn how to integrate an application with AAD](https://msdn.microsoft.com/library/azure/dn151122.aspx)
* Developers: [Review sample code for apps integrated with Azure Active Directory on Github](https://github.com/AzureADSamples)
* Developers and IT Pros: [Review the REST API documentation for the Azure Active Directory Graph API](https://msdn.microsoft.com/library/azure/hh974478.aspx)
* IT Pros: [Learn how to use Azure Active Directory pre-integrated applications from the App Gallery](https://msdn.microsoft.com/library/azure/dn308590.aspx)
* IT Pros: [Find tutorials for configuring specific pre-integrated apps](https://msdn.microsoft.com/library/azure/dn893637.aspx)
* IT Pros: [Learn how to publish an app using the Azure Active Directory Application Proxy](https://msdn.microsoft.com/library/azure/dn768219.aspx)

<!--Image references-->
[apps_service_principals_directory]:media/active-directory-how-applications-are-added/HowAppsAreAddedToAAD.jpg
[app_settings]:media/active-directory-how-applications-are-added/IntegratedAppSettings.jpg
