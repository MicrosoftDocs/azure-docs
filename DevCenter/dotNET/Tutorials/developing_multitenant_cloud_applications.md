# Integrating Multi-Tenant Cloud Applications with Windows Azure Active Directory

<h2><a name="introduction"></a>Introduction</h2>

Windows Azure Active Directory (Windows Azure AD) is a modern, REST-based service that provides identity management and access control capabilities for cloud applications. Windows Azure AD easily integrates with cloud services as well as Windows Azure, Microsoft Office 365, Dynamics CRM Online, and Windows Intune. Existing on-premise Active Directory deployments can also take full advantage of Windows Azure AD. To learn more, see the [Identity page][] on [windowsazure.com][].

This walkthrough is intended for .NET developers who want to integrate a multi-tenant application with Windows Azure AD. You will learn how to:

* Enable customers to sign up for your application using Windows Azure AD
* Enable single sign-on (SSO) with Windows Azure AD
* Query a customer's directory data using the Windows Azure AD Graph API

The companion sample application for this walkthrough can be [downloaded here][]. The sample can be run without changes, but you may need to change your [port assignment in Visual Studio][]. All code snippets in the steps below have been taken from the sample.

<div class="dev-callout"><strong>Note</strong><p>The multi-tenant directory app sample is provided for illustration purposes only.  This sample (including its helper library classes) should not be used in production.</p></div>


<h3>Prerequisites</h3>
The following developer prerequisites are required for this walkthrough:

* [Visual Studio 2012 Express][]
* [WCF Data Services for OData][]

<h3>Table of Contents</h3>
* [Introduction][]
* [Part 1: Get a Client ID for Accessing Windows Azure AD][]
* [Part 2: Enable Customers to Sign-Up Using Windows Azure AD][]
* [Part 3: Enable Single Sign-On][]
* [Part 4: Access Windows Azure AD Graph][]
* [Part 5: Publish Your Application][]
* [Summary][]


<h2><a name="getclientid"></a>Part 1: Get a Client ID for Accessing Windows Azure AD</h2>
This section describes how to get a Client ID and Client Secret after you have created a Microsoft Seller Dashboard account. A Client ID is the unique identifier for your application, and a Client Secret is the associated key required when making requests using the Client ID. Both are required to integrate your application with Windows Azure AD.

<h3>Step 1: Create an Account with the Microsoft Seller Dashboard</h3>
To develop and publish applications that integrate with Windows Azure AD, you must sign up for a [Microsoft Seller Dashboard][] account. Then you will be prompted to [create an account profile][] as either a company or an individual. This profile is used to publish applications on the Windows Azure Marketplace or other marketplaces, and it is required to generate a Client ID and Client Secret.  

New accounts are put into an "Account Pending Approval" state. This state does not prevent you from starting development – you can still create Client IDs as well as draft app listings. However, an app listing can only be submitted for approval once the account itself is approved. The submitted app listing will only be visible to customers in the Azure Marketplace after it has been approved.

<h3>Step 2: Get a Client ID for your Application</h3>
You need a Client ID and Client Secret to integrate your application with Windows Azure AD. A Client ID is the unique identifier for your application, and it is primarily used to identify an application for single sign-on or for authenticating calls to the Windows Azure AD Graph. For more information about obtaining a Client ID and Client Secret, see [Create Client IDs and Secrets in the Microsoft Seller Dashboard][]. 

<div class="dev-callout"><strong>Note</strong><p>Your Client ID and Client Secret will be needed later in this walkthrough, so make sure that you record them.</p></div>

To generate a Client ID and Client Secret, you will need to enter the following properties in the Microsoft Seller Dashboard:

**App Domain**: The hostname of your application, for example "contoso.com". This property must not contain any port number. During development, this property should be set to "localhost".

**App Redirect URL**: The redirect URL where Windows Azure AD will send a response after user sign-in and when an organization has authorized your application, for example: "https://contoso.com/." During development, this property should be set to "https://localhost:&lt;port number&gt;"

<h3>Step 3: Configure Your Application to Use the Client ID and Client Secret</h3>
This step requires the Client ID and Client Secret that were generated during signup on the Seller Dashboard. The Client ID is used for SSO, and both the Client ID and Client Secret will be used later to obtain an access token to call the Windows Azure AD Graph API.  

The sample application has been pre-wired to use Windows Azure AD, and loads the Client ID and Client Secret from config. In the **Web.config** file in the sample application, make the following changes: 

1. In the **appSettings** node, replace the values for "clientId" and "SymmetricKey" with your Client ID and Client Secret: 

		<appSettings>
    		<add key ="clientId" value="<Your Client ID value>"/>
	    	<add key="SymmetricKey" value="<Your Client Secret value"/>
		</appSettings>

2. In the **audienceUris** node of **system.identityModel**, insert your Client ID after "spn:":

		<system.identityModel>
    		<audienceUris>
            	<add value="spn:<Your Client ID value>" />
    		</audienceUris>


<h2><a name="enablesignup"></a>Part 2: Enable Customers to Sign-Up Using Windows Azure AD</h2>

This section describes how to enable customers to sign up for your application using Windows Azure AD. Before a customer can use an application integrated with Windows Azure AD, a tenant administrator must authorize the application. This authorization process starts with a consent request from your application to Windows Azure, which generates a response that must be handled by your application. The following steps describe how to generate a consent request and handle the response.

The steps in this section use helper classes from the sample application. These classes are contained in the *Microsoft.IdentityModel.WAAD.Preview* library of the sample, and they make it easier to focus on application code rather than identity and protocol specifics.

<h3>Step 1: Requesting Consent for Your Application</h3>
The following example interaction demonstrates the process of requesting consent for your application:

1. The customer clicks a "sign up using Azure AD" link on a web page in your application.
2.	You redirect the customer to the Windows Azure AD authorization page with your application's information appended to the request.
3.	The customer either grants or denies consent for your application.
4.	Windows Azure AD redirects the customer to your specified App Redirect URL. You specified this URL when you generated a Client ID and Client Secret on the Microsoft Seller Dashboard.  The redirect request indicates the result of the consent request, including information about their tenant if consent was granted.

To generate the redirect request in step 2 above, you must append querystring parameters to the following URL for the Windows Azure AD authorization page: *http://activedirectory.windowsazure.com/Consent/AuthorizeApplication.aspx*

The querystring parameters are described below:

**ApplicationID**: (Required) The **ClientID** value you received in the Seller Dashboard.

**RequestedPermissions**: (Optional) The permissions that must be granted to your application by the tenant.
During development, these permissions are used for testing unpublished applications. For published applications, this parameter will be ignored. Instead, the requested permissions in your application listing will be used. See Part 5 for more information about this listing.
There are three possible values for this parameter:

**DirectoryReader**: Grants permission to read directory data, such as user accounts, groups, and information about your organization. Enables SSO.

**UserAccountAdministrator**: Grants permission to read and write data, such as users, groups and information about your organization. Enables SSO.

**None**: Enables single sign-on but disables access to directory data.

The default value is "None" if the parameter is unspecified or incorrectly specified.

The following is an example valid consent request URL:
*https://activedirectory.windowsazure.com/Consent/AuthorizeApplication.aspx?ApplicationId=33E48BD5-1C3E-4862-BA79-1C0D2B51FB26&RequestedPermissions=DirectoryReader*

In the sample application, the “Register" link contains a similar URL for consent request, as shown below:

<img src="/media/devcenter/dotnet/login.png" />


<div class="dev-callout"><strong>Note</strong><p>When you test your unpublished application, you will go through a consent experience that is similar to your customers. However, the authorization page for an unpublished application looks different than the authorization page for a published application. A published application displays your app name, logo, and publisher details, whereas an unpublished application does not.</p></div>

<h3>Step 2: Handling the Consent Response</h3>
After a customer has granted or denied consent for your application, the Windows Azure AD sends a response to your application's App Redirect URL. This response contains the following querystring parameters:

**TenantId**: The unique GUID for the Windows Azure AD tenant that has authorized your application. This parameter will only be specified if the customer has authorized your application.

**Consent**: The value will be set to “Granted" if the application has been authorized, or “Denied" if the request has been rejected.

The following is an example valid response to the consent request that indicates the application has been authorized:
*https://app.litware.com/redirect.aspx&TenantId=7F3CE253-66DB-4AEF-980A-D8312D76FDC2&Consent=Granted*

Your application will need to maintain context such that the request sent to the Windows Azure AD authorization page is tied to the response (and would reject any responses without an associated request).

<div class="dev-callout"><strong>Note</strong><p>After consent is granted, Windows Azure AD may take some time before SSO and Graph access are provisioned. Your first customer may see sign-in errors until the provisioning completes.</p></div>

After a customer has granted consent to your application, it's important to associate and store the newly created tenant in your application with the TenantId returned by the consent response. The sample application contains an *HttpModule* in the *Microsoft.IdentityModel.WAAD.Preview.Consent* namespace that automatically records the TenantId to a customer/TenantId “data store" on all successful consent responses.  The code for this is included below, and recording of the TenantId to a customer/TenantId "data store" is performed by the *TrustedIssuers.Add* method:

	private void Application_BeginRequest(Object source,
             EventArgs e)
    {
    	HttpApplication application = (HttpApplication)source;
        HttpRequest req = application.Context.Request;             

        if((!string.IsNullOrEmpty(req.QueryString["TenantId"]) && (!string.IsNullOrEmpty(req.QueryString["Consent"]))))
        { 
        	if(req.QueryString["Consent"].Equals("Granted",StringComparison.InvariantCultureIgnoreCase))
            {
            	// For this sample we store the consenting tenants in
                // an XML file. We strongly recommend that you change
                // this to use your DataStore
                TrustedIssuers.Add(req.QueryString["TenantId"];	
            }
        }            
    }

Before you can test the consent request/response code for your application, you must get a Windows Azure AD directory tenant.

<h3>Step 3: Get a Windows Azure AD Tenant to Test Your Application</h3>
To test your application's ability to integrate with Windows Azure AD, you'll need a Windows Azure AD tenant. If you already have a tenant that you use for testing another application, you can reuse it. We recommend getting at least two tenants to ensure your app can be tested and used by multiple tenants. We do not recommend using a production tenant for this purpose. [Get a Windows Azure AD tenant][].

Once you have obtained a Windows Azure AD tenant, you can build and run the application by pressing **F5**. Additionally, you can try to sign up for your application using the new  tenant. 

<h2><a name="enablesso"></a>Part 3: Enable Single Sign-On</h2>

This section shows you how to enable Single Sign-On (SSO). The process starts with constructing a sign-in request to Windows Azure AD that authenticates a user to your application, then verifies in the sign-in response that the customer belongs to a tenant that has authorized your application. The sign-in request requires your Client ID from the Seller Dashboard and the Tenant ID of the customer's organization.

The sign-in request is specific to a directory tenant, and must include a TenantID.  A TenantID can be determined from a Windows Azure AD directory tenant's domain name. There are two common ways to get this domain name from the end user as they sign-in:

* If the URL of the application is *https://contoso.myapp.com* or *https://myapp.com/contoso.com*, *contoso* and *contoso.com* represent the Windows Azure AD domain name and *myapp.com* represents your application's URL. 
* Your application can prompt the user for their email address or their Windows Azure AD domain name. This approach is used in the sample application, where the user must enter their Windows Azure AD domain name, as shown below:

<img src="/media/devcenter/dotnet/login.png" />

<h3>Step 1: Look up the Tenant ID</h3>
Using the Windows Azure AD domain name supplied by the customer, you can look up their Tenant ID by parsing the Windows Azure AD federation metadata. In the sample application, this process is handled by the *Domain2TenantId* method of the *Microsoft.IdentityModel.WAAD.Preview.TenantUtils.Globals* class.

To demonstrate this process, the following steps use the contoso.com domain name.

1.	Get the **FederationMetadata.xml** file for the Windows Azure AD tenant. For example:  
*https://accounts.accesscontrol.windows.net/contoso.com/FederationMetadata/2007-06/FederationMetadata.xml*
2.	In the **FederationMetadata.xml** file, locate the **&lt;Entity Descriptor&gt;** entry. The Tenant ID is included as part of the **entityID** property following the @ sign, as shown below:

		 <EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="spn:00000001-0001-0000-c000-000000000000@a7456b11-6fe2-4e5b-bc83-67508c201e4b" ID="_97a1b555-b6df-4136-b9cd-8d9467e4f276"><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"> 
In this case, the TenantID's value is **a7456b11-6fe2-4e5b-bc83-67508c201e4b**.
3.	In your application's customer/TenantId "data store," you should store the domain and its associated TenantID.  These two values can be used together for future sign-in requests and eliminate the need to get the **FederationMetadata.xml** each time. The sample application does not feature this optimization.

<h3>Step 2: Generate the Sign-In Request</h3>
When a customer signs in to your application, such as by clicking a sign-in button, the sign-in request must be generated by using the customer's Tenant ID and your application's Client ID. In the sample application, this request is generated by the *GenerateSignInMessage* method of the *Microsoft.IdentityModel.WAAD.Preview.WebSSO.URLUtils* class. This method verifies that the customer's TenantID represents an organization that has authorized your application, and it generates the destination URL for the sign-in button, as shown below:

<img src="/media/devcenter/dotnet/login.png" />

Clicking the button will navigate the user's browser a sign-in page for Windows Azure AD. Once signed in, Windows Azure AD will return a sign-in response to the application.

<h3>Step 3: Validate the Issuer of the Incoming Token in the Sign-In Response</h3>

When a customer signs in to your application, you need to validate that their tenant has authorized your application. Their sign-in response contains a token, and the token contains properties and claims that can be inspected by your application.

To perform this validation, you must get the TenantID from the Issuer property in the token and ensure that it exists in the customer/TenantId "data store". In the sample application, this validation is achieved by creating a custom token handler class that extends Windows Identity Foundation's *Saml2SecurityTokenHandler*. The custom token handler verifies the incoming security token and makes its claims and properties available to the application so that the TenantID can be validated. The code snippet for this class is shown below.

In the sample application, the original code can be found under the *Microsoft.IdentityModel.WAAD.Preview.WebSSO* namespace. The token handler also uses the Contains method of the *Microsoft.IdentityModel.WAAD.Preview.WebSSO.TrustedIssuers* class, which verifies that the TenantID is persisted in the customer/TenantId "data store."

	/// <summary>
    /// Extends the out of the box SAML2 token handler by ensuring
    /// that incoming tokens have been issued by registered tenants 
    /// </summary>
    public class ConfigurationBasedSaml2SecurityTokenHandler : Saml2SecurityTokenHandler
    {
        public override ReadOnlyCollection<System.Security.Claims.ClaimsIdentity> ValidateToken(SecurityToken token)
        {
            ReadOnlyCollection<System.Security.Claims.ClaimsIdentity> aa = base.ValidateToken(token);
            Saml2SecurityToken ss = token as Saml2SecurityToken;
            string tenant = ss.Assertion.Issuer.Value.Split('@')[1];
            if (!TrustedIssuers.Contains(tenant))
            {
                throw new SecurityTokenValidationException(string.Format("The tenant {0} is not registered with the application", tenant));
            }
            return aa;
        }
    }

Once the token is validated, the user is signed in to the application. Run the application and try signing in using a Windows Azure AD account in the consented tenant that you created earlier.

<h2><a name="accessgraph"></a>Part 4: Access Windows Azure AD Graph</h2>

This section describes how to obtain an access token and call the Windows Azure AD Graph API to access a tenant's directory data. The Azure AD Graph can provide additional information about users in the tenant. For example, while the token obtained during sign in contains user information such as a name and email address, your application may need information such as group memberships or the name of the user's manager. This information can be obtained from the tenant's directory by using the Graph API. For more information about the Graph API, see [this topic][].

Before your application can call the Windows Azure AD Graph, it must authenticate itself and obtain an access token. Access tokens are obtained by authenticating your application with its Client ID and Client Secret. The following steps will show you how to:

1.	Use a generated proxy class to call the Windows Azure AD Graph
2.	Acquire an access token using Windows Azure Authentication Library (AAL) 
3.	Call the Azure AD Graph to get a list of tenant users

<div class="dev-callout"><strong>Note</strong><p>The sample application helper library *Microsoft.IdentityModel.WAAD.Preview* already contains an auto-generated proxy class (created by adding a Service Reference to *https://graph.windows.net/your-domain-name* called GraphService). The application will use this proxy class to call into the Windows Azure AD Graph service.</p></div>

<h3>Step 1: Use the Proxy Class to Call the Windows Azure AD Graph</h3>
In this step, we are going to use the sample application to show you how to:

1.	Create an tenant-specific Windows Azure AD Graph endpoint
2.	Use the endpoint to instantiate the proxy to call the Graph
3.	Add the authorization header to the request and acquire the token.  

In the sample application, these calls to the API are handled by the GraphInterface method in the *Microsoft.IdentityModel.WAAD.Preview.Graph.GraphInterface* class, as shown in the following code.

	public GraphInterface()
    {
    	// 1a: When the customer was signed in, we get a security token 
        // that contains a tenant domain name. Extract that here
        TenantDomainName = ClaimsPrincipal.Current.FindFirst("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/domain").Value;

        // 1b: We generate a URL (https://graph.windows.net/<CustomerDomainName>)
        // to access the Azure AD Graph API endpoint for the tenant 
        connectionUri = new Uri(string.Format(@"https://{0}/{1}", TenantUtils.Globals.endpoint, TenantDomainName));

        // 2: create an instance of the AzureAD Service proxy with the connection URL
        dataService = new DirectoryDataService(connectionUri);

        // This flags ignores the resource not found exception
        // If AzureAD Service throws this exception, it returns null
        dataService.IgnoreResourceNotFoundException = true;
        dataService.MergeOption = MergeOption.OverwriteChanges;
        dataService.AddAndUpdateResponsePreference = DataServiceResponsePreference.IncludeContent;

        // 3: This adds the default required headers to each request
        AddHeaders(GetAuthorizationHeader());
    }

<h3>Step 2: Acquire an Access Token Using Windows Azure Authentication Library</h3>
The sample application uses the Windows Azure Authentication Library (AAL) to acquire tokens for accessing the Graph API.  The token acquisition process is managed by the *GetAuthorizationHeader* method in the *Microsoft.IdentityModel.WAAD.Preview.Graph.GraphInterface* class, and is shown below.  

<div class="dev-callout"><strong>Note</strong><p>AAL is available as a NuGet package and can be installed within Visual Studio.</p></div>

	/// <summary>
    /// Method to get the Oauth2 Authorization header from ACS
    /// </summary>
    /// <returns>AOauth2 Authorization header</returns>
    private string GetAuthorizationHeader()
    {
        // AAL values
        string fullTenantName = TenantUtils.Globals.StsUrl + TenantDomainName;
        string serviceRealm = string.Format("{0}/{1}@{2}", TenantUtils.Globals.GraphServicePrincipalId, TenantUtils.Globals.GraphServiceHost, TenantDomainName);
        string issuingResource = string.Format("{0}@{1}", Globals.ClientId, TenantDomainName);
        string clientResource = string.Format("{0}/{1}@{2}", Globals.ClientId, Globals.AppHostname, TenantDomainName);

        string authzHeader = null;
        AuthenticationContext _authContext = new AuthenticationContext(fullTenantName);

        try
        {
            ClientCredential credential = new ClientCredential(issuingResource, clientResource, Globals.ServicePrincipalKey);
            AssertionCredential _assertionCredential = _authContext.AcquireToken(serviceRealm, credential);
            authzHeader = _assertionCredential.CreateAuthorizationHeader();
        }
        catch (Exception ex)
        {
            AALException aex = ex as AALException;
            string a = aex.InnerException.Message;
        }

        return authzHeader;
    }

The following information is used to acquire the access token, as demonstrated in the code above:

1.	The application's information (ClientID, ServicePrincipalKey and AppHostname)
2.	The target information, which is the Graph and referred to as ServiceRealm above
3.	The TenantDomainName that you acquired earlier

<h3>Step 3: Call the Windows Azure AD Graph to Get a List of Users</h3>
The following method in the *Microsoft.IdentityModel.WAAD.Preview.Graph.GraphInterface* class gets a list of all users for your tenant, using the *DataService* proxy generated earlier.

	public List<User> GetUsers()
    {
        // Add the page size using top
        var users = dataService.Users.AddQueryOption("$top", 20);

        // Execute the Query
        var userQuery = users.Execute();

        // Get the return users list
        return userQuery.ToList();
    }

This method is called from the **HomeController.cs** file to show the user list on the Users tab in the web application.

<h2><a name="publish"></a>Part 5: Publish Your Application</h2>

Once you have thoroughly tested your application, you can create an application listing and publish your application listing on the Windows Azure Marketplace. These steps are performed on the Microsoft Seller Dashboard.  

<div class="dev-callout"><strong>Note</strong><p>Your app is responsible for managing any billing relationship with your customers. The Windows Azure Marketplace only provides links to your application's web site and information about it.</p></div>

<h3>Step 1: Creating an Application Manifest and App Listing</h3>

Before creating an app listing, you must generate a new Client ID and Client Secret for the production version of your application. In Part 1 of this walkthrough, you generated a Client ID and Client Secret intended for a test version of your application. Repeat those steps and configure your application to use the new values, ensuring that you set a production App Domain and App Redirect URL.

Next, you must create an application manifest that lists the permissions your application will request for customer consent. This manifest is written in an XML format governed by an XSD file.  The manifest must be uploaded as part of the application listing you are creating. 

There are three different permission levels, as described in Part 1 of the walkthrough:

**DirectoryReader**: Grants permission to read directory data, such as user accounts, groups, and information about your organization. Enables SSO.

**UserAccountAdministrator**: Grants permission to read and write data, such as users, groups and information about your organization. Enables SSO.

**None**: Enables single sign-on but disables access to directory data.

Two application manifest examples are included below. The first demonstrates permissions for a SSO-only application, and the second demonstrates permissions for a read-only application:

	<?xml version="1.0" encoding="utf-16"?>
	<AppRequiredPermissions>
  	  <AppPermissionRequests Policy="AppOnly">
        <AppPermissionRequest Right="None" Scope="http://directory" />
      </AppPermissionRequests>
    </AppRequiredPermissions>


	<?xml version="1.0" encoding="utf-16"?>
	<AppRequiredPermissions>
      <AppPermissionRequests Policy="AppOnly">
        <AppPermissionRequest Right="Directory Reader" Scope="http://directory">
          <Reason culture="en-us" value="Needs to read the app"/>
        </AppPermissionRequest>
      </AppPermissionRequests>
    </AppRequiredPermissions>

The *Policy* attribute in the examples above describes the type of application permission being requested. Currently, only the "AppOnly" permission attribute is supported. This permission type indicates that the application only accesses the Directory as itself. 

The optional *Reason* element allows you to specify (in multiple cultures) your justification for the required permission level. This text is displayed on the consent page to aid the customer when they are approving or rejecting your application.

Using your new Client ID and your application manifest, you can create an application listing by following the instructions in [Add Apps in the Microsoft Seller Dashboard][]. When creating an application listing, make sure to select the Windows Azure AD application type. Once you have finished creating your application listing, click "submit" to publish your application to the Windows Azure Marketplace. You'll need to wait until your application is approved before publication completes.

<div class="dev-callout"><strong>Note</strong><p>If you are prompted to "add tax and payout information", you can skip this step because you are selling your application directly to customer and not through Microsoft.</p></div>

<h3>Step 2: Finalize Testing and Make Your Application Public</h3>
Once your application listing is approved, you should test your application again end-to-end. For example, make sure that your application has been updated with the production ClientID and Client Secret.  Run through the testing checklist a final time, ensuring that the consent page now shows the information you included in your application listing.

<h2><a name="summary"></a>Summary</h2>
In this walkthrough, you have learned how to integrate your multi-tenant application with Windows Azure AD. The process included three steps:

* Enable customers to sign up for your application using Azure AD
* Enable single sign-on (SSO) with Windows Azure AD
* Query a customer's directory data using the Windows Azure AD Graph API

Integrating with Windows Azure AD allows your customers to sign up and sign in to your application using an identity management system that they already maintain, which reduces or eliminates the need to do separate identity management tasks with your application. This functionality gives your customers a more seamless experience when using your application, and it frees up the time spent doing management tasks.


[Introduction]: #introduction
[Part 1: Get a Client ID for Accessing Windows Azure AD]: #getclientid
[Part 2: Enable Customers to Sign-Up Using Windows Azure AD]: #enablesignup
[Part 3: Enable Single Sign-On]: #enablesso
[Part 4: Access Windows Azure AD Graph]: #accessgraph
[Part 5: Publish Your Application]: #publish
[Summary]: #summary
[Visual Studio 2012 Express]: http://g.microsoftonline.com/1AX00en/123
[AAL x86 NuGet  Package]: http://g.microsoftonline.com/1AX00en/124
[AAL x64 NuGet Package]: http://g.microsoftonline.com/1AX00en/125
[Visual Studio Identity & Access Tool]: http://g.microsoftonline.com/1AX00en/126
[Windows Identity Foundation 3.5]: http://g.microsoftonline.com/1AX00en/127
[WCF Data Services for OData]: http://www.microsoft.com/download/en/details.aspx?id=29306
[Identity page]: http://www.windowsazure.com/en-us/home/features/identity/
[windowsazure.com]: http://www.windowsazure.com
[downloaded here]: http://go.microsoft.com/fwlink/?LinkId=271213
[port assignment in Visual Studio]: http://msdn.microsoft.com/en-us/library/ms178109(v=vs.100).aspx
[Microsoft Seller Dashboard]: https://sellerdashboard.microsoft.com/
[create an account profile]: http://msdn.microsoft.com/en-us/library/jj552460.aspx
[Create Client IDs and Secrets in the Microsoft Seller Dashboard]: http://msdn.microsoft.com/en-us/library/jj552461.aspx
[Get a Windows Azure AD tenant]: http://g.microsoftonline.com/0AX00en/5
[this topic]: http://msdn.microsoft.com/en-us/library/windowsazure/hh974476.aspx
[Add Apps in the Microsoft Seller Dashboard]: http://msdn.microsoft.com/en-us/library/jj552465.aspx
