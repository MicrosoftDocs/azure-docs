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
ms.date: 09/13/2022
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Secure hybrid access with Azure Active Directory partner integrations

Azure Active Directory (Azure AD) supports modern authentication protocols that help keep applications secure in a highly connected, cloud-based world. However, many business applications were created to work in a protected corporate network, and some of these applications use legacy authentication methods. As companies look to build a Zero Trust strategy and support hybrid and cloud-first work environments, they need solutions that connect apps to Azure AD and provide modern authentication solutions for legacy applications.

Azure AD natively supports modern protocols like SAML, WS-Fed, and OIDC. App Proxy in Azure AD supports Kerberos and header-based authentication. Other protocols, like SSH, NTLM, LDAP, and cookies, aren't yet supported. But ISVs can create solutions to connect these applications with Azure AD to support customers on their journey to Zero Trust.

ISVs have the opportunity to help customers discover and migrate software as a service (SaaS) applications into Azure AD. They can also connect apps that use legacy authentication methods with Azure AD. This will help customers consolidate onto a single platform (Azure AD) to simplify their app management and enable them to implement Zero Trust principles. Supporting apps that use legacy authentication makes users more secure. This solution can be a great stopgap until the customers modernize their apps to support modern authentication protocols.

## Solution overview

The solution that you build can include the following parts:

1. **App discovery**. Often, customers aren't aware of all the applications they're using. So as a first step, you can build application discovery capabilities into your solution and surface discovered applications in the user interface. This enables the customer to prioritize how they want to approach integrating their applications with Azure AD.
2. **App migration**. Next, you can create an in-product workflow where the customer can directly integrate apps with Azure AD without having to go to the Azure AD portal. If you don't implement discovery capabilities in your solution, you can start your solution here, integrating the applications that customers do know about with Azure AD.
3. **Legacy authentication support**. You can connect apps by using legacy authentication methods to Azure AD so that they get the benefits of single sign-on (SSO) and other features.
4. **Conditional Access**. As an additional feature, you can enable customers to apply Azure AD [Conditional Access](../conditional-access/overview.md) policies to the applications from within your solution without having to go the Azure AD portal.

The rest of this guide explains the technical considerations and our recommendations for implementing a solution.

## Publishing your application to Azure Marketplace

You can pre-integrate your application with Azure AD to support SSO and automated provisioning by following the process to [publish it in Azure Marketplace](../manage-apps/v2-howto-app-gallery-listing.md). Azure Marketplace is a trusted source of applications for IT admins. Applications listed there have been validated to be compatible with Azure AD. They support SSO, automate user provisioning, and can easily integrate into customer tenants with automated app registration.

In addition, we recommend that you become a [verified publisher](../develop/publisher-verification-overview.md) so that customers know you're the trusted publisher of the app.

## Enabling single sign-on for IT admins

[Choose either OIDC or SAML](/azure/active-directory/manage-apps/sso-options#choosing-a-single-sign-on-method/) to enable SSO for IT administrators to your solution. The best option is to use OIDC. 

Microsoft Graph uses [OIDC/OAuth](../develop/v2-protocols-oidc.md). If your solution uses OIDC with Azure AD for IT administrator SSO, your customers will have a seamless end-to-end experience. They'll use OIDC to sign in to your solution, and the same JSON Web Token (JWT) that Azure AD issued can then be used to interact with Microsoft Graph.

If your solution instead uses [SAML](/azure/active-directory/manage-apps/configure-saml-single-sign-on/) for IT administrator SSO, the SAML token won't enable your solution to interact with Microsoft Graph. You can still use SAML for IT administrator SSO, but your solution needs to support OIDC integration with Azure AD so it can get a JWT from Azure AD to properly interact with Microsoft Graph. You can use one of the following approaches:

- **Recommended SAML approach**: Create a new  registration in Azure Marketplace, which is [an OIDC app](../saas-apps/openidoauth-tutorial.md). This provides the most seamless experience for your customers. They'll add both the SAML and OIDC apps to their tenant. If your application isn't in the Azure AD gallery today, you can start with a non-gallery [multi-tenant application](../develop/howto-convert-app-to-be-multi-tenant.md).

- **Alternate SAML approach**: Your customers can manually [create an OIDC application registration](../saas-apps/openidoauth-tutorial.md) in their Azure AD tenant and ensure that they set the right URIs, endpoints, and permissions specified later in this article.

You'll want to use the [client_credentials grant type](../develop/v2-oauth2-client-creds-grant-flow.md#get-a-token). It will require that your solution allows each customer to enter a client ID and secret into your user interface, and that you store this information. Get a JWT from Azure AD, and then use it to interact with Microsoft Graph.

If you choose this route, you should have ready-made documentation for your customer about how to create this application registration within their Azure AD tenant. This information includes the endpoints, URIs, and required permissions.

> [!NOTE]
> Before any applications can be used for either IT administrator or user SSO, the customer's IT administrator will need to [consent to the application in their tenant](./grant-admin-consent.md).

## Authentication flows

The solution includes three key authentication flows that support the following scenarios:

- The customer's IT administrator signs in with SSO to administer your solution.

- The customer's IT administrator uses your solution to integrate applications with Azure AD via Microsoft Graph.

- Users sign in to legacy applications secured by your solution and Azure AD.

### Your customer's IT administrator does single sign-on to your solution

Your solution can use either SAML or OIDC for SSO when the customer's IT administrator signs in. Either way, we recommend that the IT administrator can sign in to your solution by using their Azure AD credentials. It enables a seamless experience and allows them to use the existing security controls that they already have in place. Your solution should be integrated with Azure AD for SSO through either SAML or OIDC.

Here's a diagram and summary of this user authentication flow:

![Diagram that shows an I T administrator being redirected by the solution to Azure AD to sign in, and then being redirected by Azure AD back to the solution in a user authentication flow.](./media/secure-hybrid-access-integrations/admin-flow.png)

1. The IT administrator wants to sign in to your solution with their Azure AD credentials.

2. Your solution redirects the IT administrator to Azure AD with either a SAML or an OIDC sign-in request.

3. Azure AD authenticates the IT administrator and then sends them back to your solution with either a SAML token or JWT in tow to be authorized within your solution.

### The IT administrator integrates applications with Azure AD by using your solution

The second leg of the IT administrator journey is to integrate applications with Azure AD by using your solution. To do this, your solution will use Microsoft Graph to create application registrations and Azure AD Conditional Access policies.

Here's a diagram and summary of this user authentication flow:

![Diagram of redirects and other interactions between the I T administrator, Azure Active Directory, your solution, and Microsoft Graph in a user authentication flow.](./media/secure-hybrid-access-integrations/registration-flow.png)


1. The IT administrator wants to sign in to your solution with their Azure AD credentials.

2. Your solution redirects the IT administrator to Azure AD with either a SAML or an OIDC sign-in request.

3. Azure AD authenticates the IT administrator and then sends them back to your solution with either a SAML token or JWT for authorization within your solution.

4. When the IT administrator wants to integrate one of their applications with Azure AD, rather than having to go to the Azure AD portal, your solution calls Microsoft Graph with their existing JWT to register those applications or apply Azure AD Conditional Access policies to them.

### Users sign in to the applications secured by your solution and Azure AD

When users need to sign in to individual applications secured with your solution and Azure AD, they use either OIDC or SAML. If the applications need to interact with Microsoft Graph or any Azure AD-protected API, we recommend that you configure them to use OICD. This configuration will ensure that the JWT that the applications get from Azure AD to authenticate them into the applications can also be applied for interacting with Microsoft Graph. If there's no need for the individual applications to interact with Microsoft Graph or any Azure AD protected API, then SAML will suffice.

Here's a diagram and summary of this user authentication flow:

![Diagram of redirects and other interactions between the user, Azure Active Directory, your solution, and the application in a user authentication flow.](./media/secure-hybrid-access-integrations/end-user-flow.png)

1. The user wants to sign in to an application secured by your solution and Azure AD.
2. Your solution redirects the user to Azure AD with either a SAML or an OIDC sign-in request.
3. Azure AD authenticates the user and then sends them back to your solution with either a SAML token or JWT for authorization within your solution.
4. After authorization, your solution allows the original request to the application to go through by using the preferred protocol of the application.

## Summary of Microsoft Graph APIs

Your solution needs to use the following APIs. Azure AD allows you to configure either delegated permissions or application permissions. For this solution, you need only delegated permissions.

- [Application Templates API](/graph/application-saml-sso-configure-api#retrieve-the-gallery-application-template-identifier/): If you're interested in searching Azure Marketplace, you can use this API to find a matching application template. **Permission required**: Application.Read.All.

- [Application Registration API](/graph/api/application-post-applications): You use this API to create either OIDC or SAML application registrations so that users can sign in to the applications that the customers have secured with your solution. Doing this enables these applications to also be secured with Azure AD. **Permissions required**: Application.Read.All, Application.ReadWrite.All.

- [Service Principal API](/graph/api/serviceprincipal-update): After you register the app, you need to update the service principal object to set some SSO properties. **Permissions required**: Application.ReadWrite.All, Directory.AccessAsUser.All, AppRoleAssignment.ReadWrite.All (for assignment).

- [Conditional Access API](/graph/api/resources/conditionalaccesspolicy): If you want to also apply Azure AD Conditional Access policies to these user applications, you can use this API. **Permissions required**: Policy.Read.All, Policy.ReadWrite.ConditionalAccess, and Application.Read.All.

## Example Graph API scenarios

This section provides a reference example for using Microsoft Graph APIs to implement application registrations, connect legacy applications, and enable Conditional Access policies via your solution. This section also gives guidance on automating admin consent, getting the token-signing certificate, and assigning users and groups. This functionality might be useful in your solution.

### Use the Graph API to register apps with Azure AD

#### Add apps that are in Azure Marketplace

Some of the applications that your customer is using will already be available in [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps). You can create a solution that programmatically adds these applications to the customer's tenant. The following code is an example of using the Microsoft Graph API to search Azure Marketplace for a matching template and then registering the application in the customer's Azure AD tenant.

Search Azure Marketplace for a matching application. When you're using the Application Templates API, the display name is case-sensitive.

```http
Authorization: Required with a valid Bearer token
Method: Get

https://graph.microsoft.com/v1.0/applicationTemplates?$filter=displayname eq "Salesforce.com"
```

If a match is found from the preceding API call, capture the ID and then make the following API call while providing a user-friendly display name for the application in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/cd3ed3de-93ee-400b-8b19-b61ef44a0f29/instantiate
{
    "displayname": "Salesforce.com"
}
```

When you make the preceding API call, you'll also generate a service principal object, which might take a few seconds. Be sure to capture the application ID and the service principal ID. You'll use them in the next API calls.

Next, patch the service principal object with the SAML protocol and the appropriate login URL:

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

Finally, patch the application object with the appropriate redirect URIs and the identifier URIs:

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

#### Add apps that are not in Azure Marketplace

If you can't find a match in Azure Marketplace or you just want to integrate a custom application, you can register a custom application in Azure AD by using this template ID: **8adf8e6e-67b2-4cf2-a259-e3dc5476c621**. Then, make the following API call while providing a user-friendly display name of the application in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate
{
    "displayname": "Custom SAML App"
}
```

When you make the preceding API call, you'll also generate a service principal object, which might take a few seconds. Be sure to capture the application ID and the service principal ID. You'll use them in the next API calls.

Next, patch the service principal object with the SAML protocol and the appropriate login URL:

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

Finally, patch the application object with the appropriate redirect URIs and the identifier URIs:

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

After you have the SaaS applications registered inside Azure AD, the applications still need to be cut over to start using Azure AD as their identity provider. There are two ways to do this:

- If the applications support one-click SSO, Azure AD can cut over the applications for the customer. The customer just needs to go into the Azure AD portal and perform the one-click SSO with the administrative credentials for the supported SaaS applications. For more information, see [One-click app configuration of single sign-on](./one-click-sso-tutorial.md).
- If the applications don't support one-click SSO, the customer needs to manually cut over the applications to start using Azure AD. For more information, see [Tutorials for integrating SaaS applications with Azure Active Directory](../saas-apps/tutorial-list.md).

### Connect apps by using legacy authentication methods to Azure AD

This is where your solution can sit in between Azure AD and the application and enable the customer to get the benefits of SSO and other Azure Active Directory features, even for applications that are not supported. To do so, your application will call Azure AD to authenticate the user and apply Azure AD Conditional Access policies before the user can access these applications with legacy protocols.

You can enable customers to do this integration directly from your console so that the discovery and integration is a seamless end-to-end experience. This will involve your platform creating either a SAML or an OIDC application registration between your platform and Azure AD.

#### Create a SAML application registration

To create a SAML application registration, use this custom application template ID for a custom application: **8adf8e6e-67b2-4cf2-a259-e3dc5476c621**. Then make the following API call while providing a user-friendly display name in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate
{
    "displayname": "Custom SAML App"
}
```

When you make the preceding API call, you'll also generate a service principal object, which might take a few seconds. Be sure to capture the application ID and the service principal ID. You'll use them in the next API calls.

Next, patch the service principal object with the SAML protocol and the appropriate login URL:

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

Finally, patch the application object with the appropriate redirect URIs and the identifier URIs:

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

To create an OIDC application registration, use this template ID for a custom application: **8adf8e6e-67b2-4cf2-a259-e3dc5476c621**. Then make the following API call while providing a user-friendly display name in the JSON body:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/applicationTemplates/8adf8e6e-67b2-4cf2-a259-e3dc5476c621/instantiate
{
    "displayname": "Custom OIDC App"
}
```

From the API call, capture the application ID and the service principal ID. You'll use them in the next API calls.

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
> The API permissions listed in within the `resourceAccess` node will grant the application the *openid*, *User.Read*, and *offline_access* permissions, which should be enough to get the user signed in to your solution. For more information about permissions, see the [Microsoft Graph permissions reference](/graph/permissions-reference/).

### Apply Conditional Access policies

Customers and partners can also use the Microsoft Graph API to create or apply Conditional Access policies to customer applications. For partners, this can provide additional value because customers can apply these policies directly from your solution without having to go to the Azure AD portal. 

You have two options when applying Azure AD Conditional Access policies:

- Assign the application to an existing Conditional Access Policy.
- Create a new Conditional Access policy and assign the application to that new policy.

#### Use an existing Conditional Access policy

First, run the following query to get a list of all Conditional Access policies. Get the object ID of the policy that you want to modify.

```https
Authorization: Required with a valid Bearer token
Method:GET

https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies
```

Next, patch the policy by including the application object ID to be in scope of `includeApplications` within the JSON body:

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

#### Create a new Conditional Access policy

Add the application object ID to be in scope of `includeApplications` within the JSON body:

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

If you're interested in creating new Azure AD Conditional Access policies, here are some additional templates that can help get you started with using the [Conditional Access API](../conditional-access/howto-conditional-access-apis.md):

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

If the customer is onboarding numerous applications from your platform to Azure AD, you can automate admin consent for them so they don't have to manually consent to lots of applications. You can also do this automation via Microsoft Graph. You'll need both the service principal object ID of the application that you created in previous API calls and the service principal object ID of Microsoft Graph from the customer's tenant.

Get the service principal object ID of Microsoft Graph by making this API call:

```https
Authorization: Required with a valid Bearer token
Method:GET

https://graph.microsoft.com/v1.0/serviceprincipals/?$filter=appid eq '00000003-0000-0000-c000-000000000000'&$select=id,appDisplayName
```

When you're ready to automate admin consent, make this API call:

```https
Authorization: Required with a valid Bearer token
Method: POST
Content-type: application/json

https://graph.microsoft.com/v1.0/oauth2PermissionGrants
{
    "clientId":"{Service Principal Object ID of Application}",
    "consentType":"AllPrincipals",
    "principalId":null,
    "resourceId":"{Service Principal Object ID Of Microsoft Graph}",
    "scope":"openid user.read offline_access}"
}
```

### Get the token-signing certificate

To get the public portion of the token-signing certificate for all these applications, use `GET` from the Azure AD metadata endpoint for the application:

```https
Method:GET

https://login.microsoftonline.com/{Tenant_ID}/federationmetadata/2007-06/federationmetadata.xml?appid={Application_ID}
```

### Assign users and groups

After you've published the application to Azure AD, you can optionally assign it to users and groups to ensure that it shows up on the [MyApplications](/azure/active-directory/user-help/my-applications-portal-workspaces/) portal. This assignment is stored on the service principal object that was generated when you created the application.

First, get any `AppRole` instances that the application may have associated with it. It's common for SaaS applications to have various `AppRole` instances associated with them. For custom applications, there's typically just the one default `AppRole` instance. Get the ID of the `AppRole` instance that you want to assign:

```https
Authorization: Required with a valid Bearer token
Method:GET

https://graph.microsoft.com/v1.0/servicePrincipals/3161ab85-8f57-4ae0-82d3-7a1f71680b27
```

Next, get the object ID of the user or group from Azure AD that you want to assign to the application. Also take the app role ID from the previous API call and submit it as part of the patch body on the service principal:

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

## Partnerships

Microsoft has partnerships with these application delivery controller (ADC) providers to help protect legacy applications while using existing networking and delivery controllers.

| **ADC provider** | **Link** |
| --- | --- |
| Akamai Enterprise Application Access | [Akamai Enterprise Application Access](../saas-apps/akamai-tutorial.md) |
| Citrix ADC | [Citrix ADC](../saas-apps/citrix-netscaler-tutorial.md) |
| F5 BIG-IP Access Policy Manager | [F5 BIG-IP Access Policy Manager](./f5-aad-integration.md) |
| Kemp LoadMaster | [Kemp LoadMaster](../saas-apps/kemp-tutorial.md) |
| Pulse Secure Virtual Traffic Manager | [Pulse Secure Virtual Traffic Manager](../saas-apps/pulse-secure-virtual-traffic-manager-tutorial.md) |

The following VPN solution providers connect with Azure AD to enable modern authentication and authorization methods like SSO and multifactor authentication.

| **VPN vendor** | **Link** |
| --- | --- |
| Cisco AnyConnect | [Cisco AnyConnect](../saas-apps/cisco-anyconnect.md) |
| Fortinet FortiGate | [Fortinet FortiGate](../saas-apps/fortigate-ssl-vpn-tutorial.md) |
| F5 BIG-IP Access Policy Manager | [F5 BIG-IP Access Policy Manager](./f5-aad-password-less-vpn.md) |
| Palo Alto Networks GlobalProtect | [Palo Alto Networks GlobalProtect](../saas-apps/paloaltoadmin-tutorial.md) |
| Pulse Connect Secure | [Pulse Connect Secure](../saas-apps/pulse-secure-pcs-tutorial.md) |

The following providers of software-defined perimeter (SDP) solutions connect with Azure AD to enable modern authentication and authorization methods like SSO and multifactor authentication.

| **SDP vendor** | **Link** |
| --- | --- |
| Datawiza Access Broker | [Datawiza Access Broker](./datawiza-with-azure-ad.md) |
| Perimeter 81 | [Perimeter 81](../saas-apps/perimeter-81-tutorial.md) |
| Silverfort Authentication Platform | [Silverfort Authentication Platform](./silverfort-azure-ad-integration.md) |
| Strata Maverics Identity Orchestrator | [Strata Maverics Identity Orchestrator](../saas-apps/maverics-identity-orchestrator-saml-connector-tutorial.md) |
| Zscaler Private Access | [Zscaler Private Access](../saas-apps/zscalerprivateaccess-tutorial.md) |
