---
title: Header based single sign-on for on-premises apps with Azure AD App Proxy
description: Learn how to provide single sign-on for on-premises applications that are secured with header based authentication.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: conceptual
ms.date: 10/05/2020
ms.author: kenwith
ms.reviewer: japere
---

# Header based single sign-on for on-premises apps with Azure AD App Proxy (Preview)

Azure Active Directory (Azure AD) Application Proxy natively supports single sign-on access to applications that use headers for authentication. You can configure header values required by your application in Azure AD and these will be sent down to the application via Application Proxy. Some benefits to using native support for header-based authentication with Application Proxy include:  

* **Simplify providing remote access to your on-premises apps** - Application Proxy allows you to simplify your existing remote access architecture by replacing VPN access to these apps and as well dependencies on on-premises identity solutions for using headers for authentication. Your users will not notice anything different when they sign in to use your corporate applications. They can still work from anywhere on any device.  

* **No additional requirements** - You can use your existing Application Proxy connectors and it does not require any additional software to be installed.  

* **Wide list of attributes and transformations available** - All header values available are based on standard claims that are issued by Azure AD. This means that all attributes and transformations available for configuring claims for SAML or OIDC applications are also available to be used as header values. 

## Supported capabilities

The following table lists common capabilities required for header-based authentication applications that are supported with Application Proxy. 

|Requirement   |Description|
|----------|-----------|
|Federated SSO |In pre-authenticated mode all applications are protected with Azure AD authentication and enable users to have single sign-in. |
|Header based integration |Application Proxy performs the SSO integration with Azure AD and then passes identity or other application data as HTTP headers to the application. |
|Application authorization |Common policies can be specified based on the application being accessed, the user’s group membership and other policies. In Azure AD this is implemented using conditional access. This only applies to the initial authentication to the application and does not manage subsequent application requests. |
|Step-up authentication |Policies can be defined to force added authentication, for example, to gain access to sensitive resources. |
|Fine grained authorization |Provides access control at the URL level. Added policies can be enforced based on the URL being accessed. The internal URL configured for the app, defines the scope of app that the policy is applied to. The policy configured for the most granular path is enforced.  |

## How it works

:::image type="content" source="./media/application-proxy-configure-single-sign-on-with-headers/how-it-works.png" alt-text="Image alt text" lightbox="./media/application-proxy-configure-single-sign-on-with-headers/how-it-works.png":::

1. The Admin customizes the attribute mappings required by the application in the Azure AD portal. 
2. When a user accesses the app, Application Proxy ensures the user is authenticated by Azure AD 
3. Since the Application Proxy cloud service  is aware of the attributes required, the service fetches from the JWT token received during authentication the corresponding claims and translates the values into the required HTTP headers as part of the request to the Connector. 
4. The request is then passed along to the Connector which is then passed to the backend application. 
5. The application receives the headers and can utilize these headers as needed. 

## Publish the application with Application Proxy

Publish your application according to the instructions described in [Publish applications with Application Proxy](application-proxy-add-on-premises-application#add-an-on-premises-app-to-azure-ad.md).  
- The Internal URL configured determines the scope of the application. If you configure this at the root path of the application, then all sub paths underneath the root will receive the same header configuration and other application configuration. 
- If you want to set a different header configuration or user assignment for a more granular path than the application you setup, you can do this by creating a new application. In the new application configure the internal URL with the specific path you require and then configure the specific headers needed for this URL. Application Proxy will always match your configuration settings to the most granular path set for an application. 

1. Select **Azure Active Directory** as the **pre-authentication method**. 
2. Assign a test user by navigating to **Users and groups** and assigning the appropriate users and groups. 
3. Open a browser and navigate to the **External URL** from the Application Proxy settings. 
4. Verify that you are able to connect to the application. You may not be able to access the application yet since the headers are not yet setup. 

## Configure single sign-on 
Before you get started with single sign-on for header-based applications you should have already installed an Application Proxy connector and the connector can access the target applications. If not, follow the steps in [Tutorial: Azure AD Application Proxy](application-proxy-add-on-premises-application.md) then come back here. 

1. After your application appears in the list of enterprise applications, select it, and select **Single sign-on**. 
2. Set the single sign-on mode to **Header-based**. 
3. In Basic Configuration, **Azure Active Directory**, will be selected as the default. 
4. Select the edit pencil, in Headers to configure headers to send to the application. 
5. Select **Add new header**. Provide a **Name** for the header and select either **Attribute** or **Transformation** and select from the drop-down which header your application needs.  
    - To learn more about the list of attribute available see [Claims Customizations- Attributes](../develop/active-directory-saml-claims-customization.md#attributes). 
    - To learn more about the list of transformation available see [Claims Customizations- Claim Transformations](../develop/active-directory-saml-claims-customization.md#claim-transformations). 
    - You may also add a **Group Header**, to send all the groups a user is part of, or the groups assigned to the application as a header. To learn more about configuring groups as a value see: [Configure group claims for applications](../hybrid/how-to-connect-fed-group-claims.md#add-group-claims-to-tokens-for-saml-applications-using-sso-configuration). 
6. Select Save. 

## Test your app 

When you've completed all these steps, your app should be up and running. To test the app: 
1. Open a browser and navigate to the **External URL** from the Application Proxy settings. 
2. Sign in with the test account that you assigned to the app. You should be able to load the application and have single sign-on into the application. 


## Next steps

- 
