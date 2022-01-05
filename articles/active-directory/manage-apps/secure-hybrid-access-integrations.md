---
title: Secure hybrid access with Azure AD partner integration
description: Help customers discover and migrate SaaS applications into Azure AD and connect apps that use legacy authentication methods with Azure AD.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 04/20/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Secure hybrid access with Azure Active Directory partner integrations

Azure Active Directory (Azure AD) supports modern authentication protocols that keep applications secure in a highly connected, cloud-based world. However, many business applications were created to work in a protected corporate network, and some of these applications use legacy authentication methods. As companies look to build a Zero Trust strategy and support hybrid and cloud-first work environments, they need solutions that connect apps to Azure AD and provide modern authentication solutions for legacy applications.

Azure AD natively supports modern protocols like SAML, WS-Fed, and OIDC. Azure AD's App Proxy supports Kerberos and header-based authentication. Other protocols like SSH, NTLM, LDAP, Cookies, aren't yet supported, but ISVs can create solutions to connect these applications with Azure AD to support customers on their journey to Zero Trust.

ISVs have the opportunity to help customers discover and migrate SaaS applications into Azure AD. They can also connect apps that use legacy authentication methods with Azure AD. This will help customers consolidate onto a single platform (Azure AD) to simplify their app management and enable them to implement Zero Trust principles. Supporting apps using legacy authentication makes their users more secure. This solution can be a great stop-gap until the customer modernizes their apps to support modern authentication protocols.

## Solution overview

The solution you build can include the following parts:

1. **App discovery**. Often, customers aren't aware of all the applications they're using. So as a first step you can build application discovery capabilities into your solution and surface discovered applications in the user interface. This enables the customer to prioritize how they want to approach integrating their applications with Azure AD.
2. **App migration**. Next you can create an in-product workflow where the customer can directly integrate apps with Azure AD without having to go to the Azure AD portal. If you don't implement discovery capabilities in your solution you can start your solution here, integrating the applications customers do know about with Azure AD.
3. **Legacy authentication support**. You can connect apps using legacy authentication methods to Azure AD so that they get the benefits of single sign-on (SSO) and other features.
4. **Conditional access**. As an additional feature, you can enable customers to apply Azure AD [Conditional Access](/azure/active-directory/conditional-access/overview/) policies to the applications from within your solution without having to go the Azure AD portal.

The rest of this guide explains the technical considerations and our recommendations for implementing a solution.

## Publish your application to the Azure AD app gallery

You can pre-integrate your application with Azure AD to support SSO and automated provisioning by following the process to [publish it in the Azure AD app gallery](/azure/active-directory/develop/v2-howto-app-gallery-listing/). The Azure AD app gallery is a trusted source of Azure AD compatible applications for IT admins. Applications listed there have been validated to be compatible with Azure AD. They support SSO, automate user provisioning, and can easily integrate into customer tenants with automated app registration.

In addition, we recommend that you become a [verified publisher](/azure/active-directory/develop/publisher-verification-overview/) so that customers know you are the trusted publisher of the app.

## Enable IT admin single sign-on

You'll want to [choose either OIDC or SAML](/azure/active-directory/manage-apps/sso-options#choosing-a-single-sign-on-method/) to enable SSO for IT administrators to your solution.

The best option is to use OIDC. Microsoft Graph uses [OIDC/OAuth](/azure/active-directory/develop/v2-protocols-oidc/). This means that if your solution uses OIDC with Azure AD for IT administrator SSO, then your customers will have a seamless end-to-end experience. They'll use OIDC to sign in to your solution and that same JSON Web Token (JWT) that was issued by Azure AD can then be used to interact with Microsoft Graph.

If your solution is instead using [SAML](/azure/active-directory/manage-apps/configure-saml-single-sign-on/) for IT administrator SSO, the SAML token won't enable your solution to interact with Microsoft Graph. You can still use SAML for IT administrator SSO but your solution needs to support OIDC integration with Azure AD so it can get a JWT from Azure AD to properly interact with Microsoft Graph. You can use one of the following approaches:

Recommended SAML Approach: Create a new  registration in the Azure AD app gallery, which is [an OIDC app](/azure/active-directory/saas-apps/openidoauth-tutorial/). This provides the most seamless experience for your customer. They'll add both the SAML and OIDC apps to their tenant. If your application isn't in the Azure AD gallery today, you can start with a non-gallery [multi-tenant application](/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant/).

Alternate SAML Approach: Your customer can manually [create an OIDC application registration](/azure/active-directory/saas-apps/openidoauth-tutorial/) in their Azure AD tenant and ensure they set the right URI's, endpoints, and permissions specified later in this document.

You'll would want to use the [client_credentials grant type](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#get-a-token/), which will require that your solution allows the customer to input a client_ID and secret into your user interface, and that you store this information. Get a JWT from Azure AD, which you can then use to interact with Microsoft Graph.

If you choose this route, you should have ready-made documentation for your customer about how to create this application registration within their Azure AD tenant including the endpoints, URI's, and permissions required.

> [!NOTE]
> Before any applications can be used for either IT administrator or end-user sign-on, the customer's IT administrator will need to [consent to the application in their tenant](/azure/active-directory/manage-apps/grant-admin-consent/).

## Authentication flows

The solution will include three key authentication flows that support the following scenarios:

1. The customer's IT administrator signs in with SSO to administer your solution.

2. The customer's IT administrator uses your solution to integrate applications with Azure AD via Microsoft Graph.

3. End-users sign into legacy applications secured by your solution and Azure AD.

### Your customer's IT administrator does single sign-on to your solution

Your solution can use either SAML or OIDC for SSO when the customer's IT administrator signs in. Either way, its recommended that the IT administrator can sign in to your solution using their Azure AD credentials, which enables them a seamless experience and allows them to use the existing security controls they already have in place. Your solution should be integrated with Azure AD for SSO using either SAML or OIDC.

![image diagram of the IT administrator being redirected by the solution to Azure AD to log in, and then being redirected by Azure AD back to the solution with a SAML token or JWT](./media/secure-hybrid-access-integrations/admin-flow.png)

1. The IT administrator wants to sign-in to your solution with their Azure AD credentials.

2. Your solution will redirect them to Azure AD either with a SAML or OIDC sign-in request.

3. Azure AD will authenticate the IT administrator and then send them back to your solution with either a SAML token or JWT in tow to be authorized within your solution

### The IT administrator integrates applications with Azure AD using your solution

The second leg of the IT administrator journey will be to integrate applications with Azure AD by using your solution. To do this, your solution will use Microsoft Graph to create application registrations and Azure AD Conditional Access policies.

Here is a diagram and summary of this user authentication flow:

![image diagram of the IT administrator being redirected by the solution to Azure AD to log in,  then being redirected by Azure AD back to the solution with a SAML token or JWT, and finally the solution making a call to Microsoft Graph with the JWT](./media/secure-hybrid-access-integrations/registration-flow.png)


1. The IT administrator wants to sign-in to your solution with their Azure AD credentials.

2. Your solution will redirect them to Azure AD either with a SAML or OIDC sign-in request.

3. Azure AD will authenticate the IT administrator and then send them back to your solution with either a SAML token or JWT for authorization within your solution.

4. When an IT administrator wants to integrate one of their applications with Azure AD, rather than having to go to the Azure AD portal, your solution will call the Microsoft Graph with their existing JWT to register those applications or apply Azure AD Conditional Access policies to them.

### End-users sign-in to the applications secured by your solution and Azure AD

When end users need to sign into individual applications secured with your solution and Azure AD, they use either OIDC or SAML. If the applications need to interact with Microsoft Graph or any Azure AD protected API for some reason, its recommended that the individual applications you register with Microsoft Graph be configured to use OIDC. This will ensure that the JWT that they get from Azure AD to authenticate them into the applications can also be applied for interacting with Microsoft Graph. If there is no need for the individual applications to interact with Microsoft Graph or any Azure AD protected API, then SAML will suffice.

Here is a diagram and summary of this user authentication flow:

![image diagram of the end user being redirected by the solution to Azure AD to log in, then being redirected by Azure AD back to the solution with a SAML token or JWT, and finally the solution making a call to another application using the application's preferred authentication type](./media/secure-hybrid-access-integrations/end-user-flow.png)

1. The end user wants to sign-in to an application secured by your solution and Azure AD.
2. Your solution will redirect them to Azure AD either with a SAML or OIDC sign-in request.
3. Azure AD will authenticate the end user and then send them back to your solution with either a SAML token or JWT for authorization within your solution.
4. Once authorized against your solution, your solution will then allow the original request to the application to go through using the preferred protocol of the application.

## Summary of Microsoft Graph APIs you will use

Your solution will need to use these APIs. Azure AD will allow you to configure either the delegated permissions or the application permissions. For this solution, you only need delegated permissions.

[Application Templates API](/graph/application-saml-sso-configure-api#retrieve-the-gallery-application-template-identifier/): If you're interested in searching the Azure AD app gallery, you can use this API to find a matching application template. **Permission required** : Application.Read.All.

[Application Registration API](/graph/api/application-post-applications): You'll use this API to create either OIDC or SAML application registrations so end users can sign-in to the applications that the customers have secured with your solution. Doing this will enable these applications to also be secured with Azure AD. **Permissions required** : Application.Read.All, Application.ReadWrite.All

[Service Principal API](/graph/api/serviceprincipal-update): After doing the app registration, you'll need to update the Service Principal Object to set some SSO properties. **Permissions required** : Application.ReadWrite.All, Directory.AccessAsUser.All, AppRoleAssignment.ReadWrite.All (for assignment)

[Conditional Access API](/graph/api/resources/conditionalaccesspolicy): If you want to also apply Azure AD Conditional Access policies to these end-user applications, you can use this API to do so. **Permissions required** : Policy.Read.All, Policy.ReadWrite.ConditionalAccess, and Application.Read.All

## Example Graph API scenarios

This section provides a reference example for using Microsoft Graph APIs to implement application registrations, connect legacy applications, and enable conditional access policies via your solution. In addition, there is guidance on automating admin consent, getting the token signing certificate, and assigning users and groups. This functionality may be useful in your solution.

### Use the Graph API to register apps with Azure AD

#### Apps in the Azure AD app gallery

Some of the applications your customer is using will already be available in the [Azure AD Application Gallery](https://azuremarketplace.microsoft.com/marketplace/apps). You can create a solution that programmatically adds these applications to the customer's tenant. The following is an example of using the Microsoft Graph API to search the Azure AD app gallery for a matching template and then registering the application in the customer's Azure AD tenant.

Search the Azure AD app gallery for a matching application. When using the application templates API, the display name is case-sensitive.

```http
Authorization: Required with a valid Bearer token
Method: Get

https://graph.microsoft.com/v1.0/applicationTemplates?$filter=displayname eq "Salesforce.com"
```

If a match is found from the prior API call, capture the ID and then make this API call while providing a user-friendly display name for the application in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/cd3ed3de-93ee-400b-8b19-b61ef44a0f29/instantiate
{
    "displayname": "Salesforce.com"
}
```

When you make the above API call, we'll also generate a Service Principal object, which might take a few seconds. From the previous API call, you'll want to capture the Application ID and the Service Principal ID, which you'll use in the next API calls.

Next, you'll want to PATCH the Service Principal Object with the saml protocol and the appropriate login URL:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: servicePrincipal/json

https://graph.microsoft.com/v1.0/servicePrincipals/3161ab85-8f57-4ae0-82d3-7a1f71680b27
{
    "preferredSingleSignOnMode":"saml",
    "loginURL": "https://www.salesforce.com"
}
```

And lastly, you'll want to patch the Application Object with the appropriate redirecturis and the identifieruris:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: application/json

https://graph.microsoft.com/v1.0/applications/54c4806b-b260-4a12-873c-967116983792
{
    "web": {
    "redirectUris":["https://www.salesforce.com"]},
    "identifierUris":["https://www.salesforce.com"]
}
```

#### Applications not in the Azure AD app gallery

If you can't find a match in the Azure AD app gallery or you just want to integrate a custom application, then you have the option of registering a custom application in Azure AD using this template ID:

**8adf8e6e-67b2-4cf2-a259-e3dc5476c621**

And then make this API call while providing a user-friendly display name of the application in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate
{
    "displayname": "Custom SAML App"
}
```

When you make the above API call, we'll also generate a Service Principal object, which might take a few seconds. From the previous API call, you'll want to capture the Application ID and the Service Principal ID, which you'll use in the next API calls.

Next, you'll want to PATCH the Service Principal Object with the saml protocol and the appropriate login URL:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: servicePrincipal/json

https://graph.microsoft.com/v1.0/servicePrincipals/3161ab85-8f57-4ae0-82d3-7a1f71680b27
{
    "preferredSingleSignOnMode":"saml",
    "loginURL": "https://www.samlapp.com"
}
```

And lastly, you'll want to patch the Application Object with the appropriate redirecturis and the identifieruris:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: application/json

https://graph.microsoft.com/v1.0/applications/54c4806b-b260-4a12-873c-967116983792
{
    "web": {
    "redirectUris":["https://www.samlapp.com"]},
    "identifierUris":["https://www.samlapp.com"]
}
```

#### Cut over to Azure AD single sign-on

Once you have these SaaS applications registered inside Azure AD, the applications still need to be cut over to start us Azure AD as their identity provider. There are two ways to do this:

1. If the applications support one-click SSO, then Azure AD can cut over the application for the customer. They just need to go into the Azure AD portal and perform the one-click SSO with the administrative credentials for the supported SaaS application. You can read about this in [one-click, SSO configuration of your Azure Marketplace application](/azure/active-directory/manage-apps/one-click-sso-tutorial/).
2. If the application doesn't support one-click SSO, then the customer will need to manually cutover the application to start using Azure AD. You can learn more in the [SaaS App Integration Tutorials for use with Azure AD](/azure/active-directory/saas-apps/tutorial-list/).

### Connect apps using legacy authentication methods to Azure AD

This is where your solution can sit in between Azure AD and the application and enable the customer to get the benefits of Single-Sign On and other Azure Active Directory features even for applications that are not supported. To do so, your application will call Azure AD to authenticate the user and apply Azure AD Conditional Access policies before they can access these applications with legacy protocols.

You can enable customers to do this integration directly from your console so that the discovery and integration is a seamless end-to-end experience. This will involve your platform creating either a SAML or OIDC application registration between your platform and Azure AD.

#### Create a SAML application registration

Use the custom application template ID for this:

**8adf8e6e-67b2-4cf2-a259-e3dc5476c621**

And then make this API call while providing a user-friendly display name in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate
{
    "displayname": "Custom SAML App"
}
```

When you make the above API call, we'll also generate a Service Principal object, which might take a few seconds. From the previous API call, you'll want to capture the Application ID and the Service Principal ID, which you'll use in the next API calls.

Next, you'll want to PATCH the Service Principal Object with the saml protocol and the appropriate login URL:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: servicePrincipal/json

https://graph.microsoft.com/v1.0/servicePrincipals/3161ab85-8f57-4ae0-82d3-7a1f71680b27
{
    "preferredSingleSignOnMode":"saml",
    "loginURL": "https://www.samlapp.com"
}
```

And lastly, you'll want to PATCH the Application Object with the appropriate redirecturis and the identifieruris:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: application/json

https://graph.microsoft.com/v1.0/applications/54c4806b-b260-4a12-873c-967116983792
{
    "web": {
    "redirectUris":["https://www.samlapp.com"]},
    "identifierUris":["https://www.samlapp.com"]
}
```

#### Create an OIDC application registration

You should use the custom application template ID for this:

**8adf8e6e-67b2-4cf2-a259-e3dc5476c621**

And then make this API call while providing a user-friendly display name in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate
{
    "displayname": "Custom OIDC App"
}
```

From the previous API call, you'll want to capture the Application ID and the Service Principal ID, which you'll use in the next API calls.

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: application/json

https://graph.microsoft.com/v1.0/applications/{Application Object ID}
{
    "web": {
    "redirectUris":["https://www.samlapp.com"]},
    "identifierUris":["[https://www.samlapp.com"],
    "requiredResourceAccess": [
    {
        "resourceAppId": "00000003-0000-0000-c000-000000000000",
        "resourceAccess": [
        {
            "id": "7427e0e9-2fba-42fe-b0c0-848c9e6a8182",
            "type": "Scope"
        },
        {
            "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
            "type": "Scope"
        },
        {
            "id": "37f7f235-527c-4136-accd-4a02d197296e",
            "type": "Scope"
        }]
    }]
}
```

> [!NOTE]
> The API Permissions listed above within the resourceAccess node will grant the application access to OpenID, User.Read, and offline_access, which should be enough to get the user signed in to your solution. You can find more information on permissions on the [permissions reference page](/graph/permissions-reference/).

### Apply conditional access policies

We want to empower customers and partners to also use the Microsoft Graph API to create or apply Conditional Access policies to customer's applications. For partners, this can provide additional value so the customer can apply these policies directly from your solution without having to go to the Azure AD portal. You have two options when applying Azure AD Conditional Access Policies:

- You can assign the application to an existing Conditional Access Policy
- You can create a new Conditional Access policy and assign the application to that new policy

#### An existing conditional access policy

First, you'll want to query to get a list of all Conditional Access Policies and grab the Object ID of the policy you want to modify:

```https
Authorization: Required with a valid Bearer token
Method:GET

https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies
```

Next, you'll want to Patch the policy by including the Application Object ID to be in scope of the includeApplications within the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: PATCH

https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies/{policyid}
{
    "displayName":"Existing CA Policy",
    "state":"enabled",
    "conditions": 
    {
        "applications": 
        {
            "includeApplications":[
                "00000003-0000-0ff1-ce00-000000000000", 
                "{Application Object ID}"
            ]
        },
        "users": {
            "includeUsers":[
                "All"
            ] 
        }
    },
    "grantControls": 
    {
        "operator":"OR",
        "builtInControls":[
            "mfa"
        ]
    }
}
```

#### Create a new Azure AD conditional access policy

You'll want to add the Application Object ID to be in scope of the includeApplications within the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST

https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies/
{
    "displayName":"New CA Policy",
    "state":"enabled",
    "conditions": 
    {
        "applications": {
            "includeApplications":[
                "{Application Object ID}"
            ]
        },
        "users": {
            "includeUsers":[
                "All"
            ]
        }
    },
    "grantControls": {
        "operator":"OR",
        "builtInControls":[
            "mfa"
        ]
    }
}
```

If you're interested in creating new Azure AD Conditional Access Policies, here are some additional templates that can help get you started using the [Conditional Access API](/azure/active-directory/conditional-access/howto-conditional-access-apis/).

```https
#Policy Template for Requiring Compliant Device

{
    "displayName":"Enforce Compliant Device",
    "state":"enabled",
    "conditions": {
        "applications": {
            "includeApplications":[
                "{Application Object ID}"
            ]
        },
        "users": {
            "includeUsers":[
                "All"
            ]
        }
    },
    "grantControls": {
        "operator":"OR",
        "builtInControls":[
            "compliantDevice",
            "domainJoinedDevice"
        ]
    }
}

#Policy Template for Block

{
    "displayName":"Block",
    "state":"enabled",
    "conditions": {
        "applications": {
            "includeApplications":[
                "{Application Object ID}"
            ]
        },
        "users": {
            "includeUsers":[
                "All"
            ] 
        }
    },
    "grantControls": {
        "operator":"OR",
        "builtInControls":[
            "block"
        ]
    }
}
```

### Automate admin consent

If the customer is onboarding numerous applications from your platform to Azure AD, you'll likely want to automate admin consent for them so they don't have to manually consent to lots of applications. This can also be done via Microsoft Graph. You'll need both the Service Principal Object ID of the application you created in previous API calls and the Service Principal Object ID of Microsoft Graph from the customer's tenant.

You can get the Service Principal Object ID of Microsoft Graph by making this API call:

```https
Authorization: Required with a valid Bearer token
Method:GET

https://graph.microsoft.com/v1.0/serviceprincipals/?$filter=appid eq '00000003-0000-0000-c000-000000000000'&$select=id,appDisplayName
```

Then when you're ready to automate admin consent, you can make this API call:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/oauth2PermissionGrants
{
    "clientId":"{Service Principal Object ID of Application}",
    "consentType":"AllPrincipals",
    "principalId":null,
    "resourceId":"{Service Principal Object ID Of MicrosofT Graph}",
    "scope":"openid user.read offline_access}"
}
```

### Get the token signing certificate

To get the public portion of the token signing certificate for all these applications, you can GET it from the Azure AD metadata endpoint for the application:

```https
Method:GET

https://login.microsoftonline.com/{Tenant_ID}/federationmetadata/2007-06/federationmetadata.xml?appid={Application_ID}
```

### Assign users and groups

Once you've published the applications to Azure AD, you can optionally assign it to users and groups to ensure it shows up on the [MyApplications](/azure/active-directory/user-help/my-applications-portal-workspaces/) portal. This assignment is stored on the Service Principal Object that was generated when you created the application:

First you'll want to get any AppRoles that the application may have associated with it. It's common for SaaS applications to have various AppRoles associated with them. For custom applications, there is typically just the one default AppRole. Grab the ID of the AppRole you want to assign:

```https
Authorization: Required with a valid Bearer token
Method:GET

https://graph.microsoft.com/v1.0/servicePrincipals/3161ab85-8f57-4ae0-82d3-7a1f71680b27
```

Next, you'll want to get the Object ID of the user or group from Azure AD that you'll want to assign to the application. Also take the App Role ID from the previous API call and submit it as part of the PATCH body on the Service Principal:

```https
Authorization: Required with a valid Bearer token
Method: PATCH
Content-type: servicePrincipal/json

https://graph.microsoft.com/v1.0/servicePrincipals/3161ab85-8f57-4ae0-82d3-7a1f71680b27
{
    "principalId":"{Principal Object ID of User -or- Group}",
    "resourceId":"{Service Principal Object ID}",
    "appRoleId":"{App Role ID}"
}
```

## Existing partners

Microsoft has existing partnerships with these third-party providers to protect legacy applications while using existing networking and delivery controllers.

| **ADC provider** | **Link** |
| --- | --- |
| Akamai Enterprise Application Access (EAA) | [https://docs.microsoft.com/azure/active-directory/saas-apps/akamai-tutorial](/azure/active-directory/saas-apps/akamai-tutorial) |
| Citrix Application Delivery Controller (ADC) | [https://docs.microsoft.com/azure/active-directory/saas-apps/citrix-netscaler-tutorial](/azure/active-directory/saas-apps/citrix-netscaler-tutorial) |
| F5 Big-IP APM | [https://docs.microsoft.com/azure/active-directory/manage-apps/f5-aad-integration](/azure/active-directory/manage-apps/f5-aad-integration) |
| Kemp | [https://docs.microsoft.com/azure/active-directory/saas-apps/kemp-tutorial](/azure/active-directory/saas-apps/kemp-tutorial) |
| Pulse Secure Virtual Traffic Manager (VTM) | [https://docs.microsoft.com/azure/active-directory/saas-apps/pulse-secure-virtual-traffic-manager-tutorial](/azure/active-directory/saas-apps/pulse-secure-virtual-traffic-manager-tutorial) |

The following VPN solution providers connect with Azure AD to enable modern authentication and authorization methods like SSO and multi-factor authentication.

| **VPN vendor** | **Link** |
| --- | --- |
| Cisco AnyConnect | [https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-anyconnect](/azure/active-directory/saas-apps/cisco-anyconnect) |
| Fortinet | [https://docs.microsoft.com/azure/active-directory/saas-apps/fortigate-ssl-vpn-tutorial](/azure/active-directory/saas-apps/fortigate-ssl-vpn-tutorial) |
| F5 Big-IP APM | [https://docs.microsoft.com/azure/active-directory/manage-apps/f5-aad-password-less-vpn](/azure/active-directory/manage-apps/f5-aad-password-less-vpn) |
| Palo Alto Networks Global Protect | [https://docs.microsoft.com/azure/active-directory/saas-apps/paloaltoadmin-tutorial](/azure/active-directory/saas-apps/paloaltoadmin-tutorial) |
| Pulse Secure Pulse Connect Secure (PCS) | [https://docs.microsoft.com/azure/active-directory/saas-apps/pulse-secure-pcs-tutorial](/azure/active-directory/saas-apps/pulse-secure-pcs-tutorial) |

The following SDP solution providers connect with Azure AD to enable modern authentication and authorization methods like SSO and multi-factor authentication.

| **SDP vendor** | **Link** |
| --- | --- |
| Datawiza Access Broker | [https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal-setup-oidc-sso](/azure/active-directory/manage-apps/add-application-portal-setup-oidc-sso) |
| Perimeter 81 | [https://docs.microsoft.com/azure/active-directory/saas-apps/perimeter-81-tutorial](/azure/active-directory/saas-apps/perimeter-81-tutorial) |
| Silverfort Authentication Platform | [https://docs.microsoft.com/azure/active-directory/manage-apps/add-application-portal-setup-oidc-sso](/azure/active-directory/manage-apps/add-application-portal-setup-oidc-sso) |
| Strata | [https://docs.microsoft.com/azure/active-directory/saas-apps/maverics-identity-orchestrator-saml-connector-tutorial](/azure/active-directory/saas-apps/maverics-identity-orchestrator-saml-connector-tutorial) |
| Zscaler Private Access (ZPA) | [https://docs.microsoft.com/azure/active-directory/saas-apps/zscalerprivateaccess-tutorial](/azure/active-directory/saas-apps/zscalerprivateaccess-tutorial) |
