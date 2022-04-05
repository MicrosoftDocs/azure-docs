---
title: Tutorial to enable Secure Hybrid Access to applications with Azure AD B2C and F5 BIG-IP
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with F5 BIG-IP for secure hybrid access 
author: gargi-sinha
ms.author: gasinh
manager: CelesteDG
ms.reviewer: kengaderdus
ms.service: active-directory
ms.subservice: B2C
ms.workload: identity
ms.topic: how-to
ms.date: 10/15/2021
---

# Tutorial: Secure Hybrid Access to applications with Azure AD B2C and F5 BIG-IP

In this sample tutorial, learn how to integrate Azure Active Directory (Azure AD) B2C with [F5 BIG-IP Access Policy Manager (APM)](https://www.f5.com/services/resources/white-papers/easily-configure-secure-access-to-all-your-applications-via-azure-active-directory). This tutorial demonstrates how legacy applications can be securely exposed to the internet through BIG-IP security combined with Azure AD B2C pre-authentication, Conditional Access (CA), and Single sign-on (SSO).

F5 Inc. focus on the delivery, security, performance, and availability of connected services, including the availability of computing, storage, and network resources. It provides hardware, modularized software, and cloud-ready virtual appliance solutions.

F5's BIG-IP Application Delivery Controller (ADC) is often deployed as a secure gateway between private networks and the internet.
It provides an abundance of features including application-level inspection and fully customizable access controls. When deployed as a reverse proxy, the BIG-IP can also be used to enable secure hybrid access to critical business applications, by front-ending services with a federated Identity access layer managed by F5’s APM.

## Prerequisites

To get started, you'll need:

- An [Azure AD B2C tenant](tutorial-create-tenant.md) linked to your Azure subscription

- An existing BIG-IP or deploy a trial [BIG-IP Virtual Environment (VE) on Azure](../active-directory/manage-apps/f5-bigip-deployment-guide.md)

- Any of the following F5 BIG-IP license SKUs

  - F5 BIG-IP® Best bundle

  - F5 BIG-IP Access Policy Manager™  standalone license

  - F5 BIG-IP Access Policy Manager™ add-on license on an existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

  - 90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php)

- An existing header-based web application or [setup an IIS app](/previous-versions/iis/6.0-sdk/ms525396(v=vs.90)) for testing

- [SSL certificate](../active-directory/manage-apps/f5-bigip-deployment-guide.md#ssl-profile) for publishing services over HTTPS or use default while testing.

## Scenario description
**The following scenario is header-based but you can also use these methods to achieve Kerberos SSO.**

For this scenario, we have an internal application whose access relies on receiving HTTP authorization headers from a legacy broker system, enabling sales agents to be directed to their respective areas of content. The service needs expanding to a broader consumer base, so the application either needs upgrading to offer a choice of consumer authentication options or replacing altogether with more suitable solution.

In an ideal world, the application would be upgraded to support being directly managed and governed through a modern control plane. But as it lacks any form of modern interop, it would take considerable effort and time to modernize, introducing inevitable costs and risks of potential downtime. Instead, a BIG-IP Virtual Edition (VE) deployed between the public internet and the internal Azure VNet our application is connected to will be used to gate access with Azure AD B2C for its extensive choice of sign-in and sign-up capabilities.

Having a BIG-IP in front of the application enables us to overlay the service with Azure AD B2C pre-authentication and header-based SSO, significantly improving the overall security posture of the application, allowing the business to continue growing at pace, without interruption.

The secure hybrid access solution for this scenario is made up of the following components:

- **Application** - Backend service being protected by Azure AD B2C and BIG-IP secure hybrid access

- **Azure AD B2C** - The IdP and Open ID Connect (OIDC) authorization server, responsible for verification of user credentials, multifactor authentication (MFA), and SSO to the BIG-IP APM.

- **BIG-IP** - As the reverse proxy for the application, the BIG-IP APM also becomes the OIDC client, delegating authentication to the OIDC authorization server, before performing header-based SSO to the backend service.

The following diagram illustrates the Service Provider (SP) initiated flow for this scenario.

![Screenshot showing the SP initiated flow for this scenario](./media/partner-f5/flow-diagram.png)

|Step| Description|
|:----|:-------|
| 1. | User connects to the application endpoint, where BIG-IP is service provider |
| 2. | BIG-IP APM that is the OIDC client redirects user to Azure AD B2C tenant endpoint, the OIDC authorization server |
| 3. | Azure AD B2C tenant pre-authenticates user and applies any enforced Conditional Access policies |
|4. | Azure AD B2C redirects user back to the SP with authorization code |
| 5. | OIDC client asks the authorization server to exchange authorization code for an ID token |
| 6. | BIG-IP APM grants user access and injects the HTTP headers in the client request forwarded on to the application |

## Azure AD B2C Configuration

Enabling a BIG-IP with Azure AD B2C authentication requires an Azure AD B2C tenant with a suitable user flow or custom policy. [Set up an Azure AD B2C user flow](tutorial-create-user-flows.md).

### Create custom attributes

Custom attributes can be obtained from various sources, including directly from existing Azure AD B2C user objects, requested from federated IdPs, API connectors, or collected during the sign-up journey of a user. When required, they can be included in the token sent to the application.

As your legacy application expects specific attributes, include these attributes in your user flow. But feel free to replace these with whatever attributes your application requires. Or if setting up a test app using the instructions in the pre-requisites then any headers will do as it
displays them all.

1. Sign into your Azure AD B2C tenant's portal

2. From the left-hand pane select **User attributes**, and then select **Add** to create two custom attributes

   - Agent ID: String **Data Type**

   - Agent Geo: String **Data Type**

### Add attributes to user flow

1. From the left-hand pane go to **Policies** > **User flows**.

2. Select your policy, for example, **B2C_1_SignupSignin**

3. Select **User attributes** and add both custom attributes, plus also the **Display Name** attribute. These are the attributes that will be collected during user sign-up.

4. Select **Application claims** and add both custom attributes plus also the **Display Name**. These are the attributes that will be sent to the BIG-IP.

You can use the [Run user flow](tutorial-create-user-flows.md) feature
in the user flow menu on the left navigation bar to verify it prompts for all defined attributes.

### Azure AD B2C federation

For the BIG-IP and Azure AD B2C to trust one another they need
federating, so the BIG-IP must be registered in the Azure AD B2C tenant as an OIDC application.

1. Still in the Azure AD B2C portal, select **App registrations** >  **New registration**.

2. Provide a name for the application. For example, **HeaderApp1**

3. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**

4. Under **Redirect URI**, select **Web**, and enter the public FQDN of the service being protected, along with the path.

5. Leave the rest and select **Register**.

6. Head to **Certificates & secrets** > **+ New client secret**.

7. Provide a descriptive name and TTL for the secret that will be used by the BIG-IP.

8. Note down the client secret, you'll need this later for configuring the BIG-IP.

The redirect URI is the BIG-IP endpoint to which a user is sent back to by the authorization server - Azure AD B2C, after authenticating. [Register an application](tutorial-register-applications.md) for Azure AD B2C.

## BIG-IP configuration

A BIG-IP offers several methods for configuring Azure AD secure hybrid access, including a wizard based Guided Configuration, minimizing time, and effort to implement several common scenarios. Its workflow-driven framework provides an intuitive experience tailored to specific access topologies and is used for rapid publishing of web services
requiring minimal configuration to publish.

### Version check

This tutorial is based on Guided Configuration v.7/8 but may also apply to previous versions. To check your version, login to the BIG-IP web config with an admin account and go to **Access** > **Guided Configuration**. The version should be displayed in the top right-hand corner. To upgrade your BIG-IP's Guided Configuration, follow [these instructions](https://support.f5.com/csp/article/K85454683).

### SSL profiles

Configuring your BIG-IP with a client SSL profile will allow you to secure the client-side traffic over TLS. To do this you'll need to import a certificate matching the domain name used by the public facing URL for your application. Where possible we recommend using a public certificate authority, but the built-in BIG-IP self-signed certificates can also be used while testing.
[Add and manage certificates](https://techdocs.f5.com/kb/en-us/products/big-ip_ltm/manuals/product/bigip-ssl-administration-13-0-0.html) in the BIG-IP VE.

## Guided configuration

1. In the web config, go to **Access** > **Guided Configuration** to launch the deployment wizard.

2. Select the **Federation** > **F5 as OAuth Client and Resource
Server**.

3. Observe the summary of the flow for this scenario, then select **Next** to start the wizard.

### OAuth properties

This section defines the properties enabling federation between the BIG-IP APM and the OAuth authorization server, your Azure AD B2C tenant. OAuth will be referenced throughout the BIG-IP configuration, but the solution will actually use OIDC, a simple identity layer on top of the OAuth 2.0 protocol allowing OIDC clients to verify the identity of users and obtaining other profile information.

Pay close attention to detail, as any mistakes will impact authentication and access.

#### Configuration name

Providing a display name for the configuration will help you distinguish between the many deployment configs that could eventually exist in the guided configuration. Once set, the name cannot be changed, and is only visible in the Guided Configuration view.

#### Mode

The BIG-IP APM will act as an OIDC client, so select the Client option only.

#### DNS resolver

The specified target must be able to resolve the public IP addresses of your Azure AD B2C endpoints. Choose an existing public DNS resolver or create a new one.

#### Provider settings

Here, we'll configure Azure AD B2C as the OAuth2 IdP. You’ll notice that the Guided Configuration v8 offers Azure AD B2C templates, but as it’s missing several scopes, we’ll use a custom type for now. F5 is looking to include the missing scopes in a future Guided Configuration update. Add a new provider and configure it as follows:

- **OAuth general properties**

  | Properties | Description |
  |:-------|:---------|
  |OAuth provider type | Custom |
  | Choose OAuth provider | Create new (or use an existing OAuth provider if it exists) |
  | Name | A unique display name for the B2C IdP. This name will be displayed to users as a provider option to sign-in against.|
  | Token type | JSON web token |

- **OAuth policy settings**

  | Properties | Description |
  |:-----------|:----------------|
  | Scope | Leave blank, the OpenID scope to sign users in will be added automatically |
  | Grant type | Authorization code |
  | Enable OpenID Connect | Check to put the APM OAuth client in OIDC mode |
  | Flow type | Authorization code |

- **OAuth provider settings**

  The below OpenID URI refers to the metadata endpoint used by OIDC clients to autodiscover critical IdP information such as the rollover of signing certificates. Locate the metadata endpoint for your Azure AD B2C tenant by navigating to **App registrations** > **Endpoints** and copying the Azure AD B2C OpenID Connect metadata document URI. For example, `https://wacketywackb2c .b2clogin.com/<tenantname>.onmicrosoft.com/<policyname>/v2.0/.well-known/openid-configuration`.

  Then update the URI with your own properties, `https://<tenantname>.b2clogin.com/WacketywackB2C.onmicrosoft.com/B2C_1_SignUpIn/v2.0/.well-known/openid-configuration`.

  Paste this URI into the browser to view the OIDC metadata for your Azure AD B2C tenant.

  | Properties | Description |
  |:----------|:----------|
  | Audience | The client ID of the application representing the BIG-IP in your Azure AD B2C tenant |
  | Authentication URI | The authorization endpoint in your B2C OIDC metadata |
  | Token URI | The token endpoint in your Azure AD B2C metadata |
  | Userinfo request URI | Leave empty. Azure AD B2C does not currently support this feature |
  |OpenID URI | The OpenID URI metadata endpoint you crafted above |
  | Ignore expired certificate validation | Leave unchecked |
  | Allow self-signed JWK config certificate | Check |
  | Trusted CA bundle | Select ca-bundle.crt to use the default F5 trusted authorities |
  | Discovery interval | Provide a suitable interval for the BIG-IP to query your Azure AD B2C tenant for updates. The minimum interval time offered by AGC version 16.1 0.0.19 final, is 5 minutes.|

- **OAuth server settings**

  This section refers to the OIDC authorization server, being your Azure AD B2C tenant.

  |Properties | Descriptions|
  |:---------|:---------|
  | Client ID | The client ID of the application representing the BIG-IP in your Azure AD B2C tenant. |
  | Client secret | The application’s corresponding client secret. |
  |Client-server SSL profile | Setting an SSL profile will ensure the APM communicates with the Azure AD B2C IdP over TLS. Select the default `serverssl` option. |

- **OAuth request settings**

  The BIG-IP interestingly has all the required Azure AD B2C requests in its pre-configured request set. However, it was observed that for the build we were implementing on, these requests were malformed, and missing important parameters. So, we opted to create them manually.

- **Token request - Enabled**

  | Properties | Description |
  |:-----------|:------------|
  | Choose OAuth request | Create new |
  | HTTP method | POST |
  | Enable headers| Unchecked |
  | Enable parameters | Checked |

  | Parameter type | Parameter name | Parameter value|
  |:---------|:---------------|:----------------|
  | client-id | client-id | |
  | nonce | nonce| |
  | redirect-uri | redirect-uri | |
  | scope | scope | |
  | response-type | response-type | |
  | client-secret | client-secret | |
  | custom | grant_type | authorization_code |

- **Auth redirect request - Enabled**

  | Properties | Description |
  |:-----------|:------------|
  | Choose OAuth request | Create new |
  | HTTP method | GET |
  | Prompt type | None |
  | Enable headers | Unchecked |
  | Enable parameters | Checked |

  | Parameter type | Parameter name | Parameter value|
  |:---------|:---------------|:----------------|
  | client-id | client-id | |
  | redirect-uri | redirect-uri | |
  | response-type |response-type | |
  | scope | scope | |
  | nonce | nonce | |

- **Token refresh request** - **Disabled** - Can be enabled and configured if necessary.

- **OpenID UserInfo request** - **Disabled** - Not currently supported in global Azure AD B2C tenants.

- **Virtual server properties**

  A BIG-IP virtual server must be created to intercept external client requests for the backend service being protected via secure hybrid access. The virtual server must be assigned an IP that is mapped to the public DNS record for the BIG-IP service endpoint representing the application. Go ahead and use an existing Virtual Server if available, otherwise provide the following:

  | Properties | Description |
  |:-----------|:------------|
  | Destination address | Private or Public IP that will become the BIG-IP service endpoint for the backend application |
  | Service port | HTTPS |
  | Enable redirect port | Check to have users auto redirected from http to https |
  | Redirect port | HTTP |
  | Client SSL profile | Swap the predefined `clientssl` profile with the one containing your SSL certificate. Testing with the default profile is also ok but will likely cause a browser alert. |

- **Pool properties**

  Backend services are represented in the BIG-IP as a pool, containing one or more application servers that virtual server’s direct inbound traffic to. Select an existing pool, otherwise create a new one.

  | Properties | Description |
  |:-----------|:------------|
  | Load-balancing method | Leave as Round Robin |
  |Pool server | Internal IP of backend application |
  | Port | Service port of backend application |
  
>[!NOTE]
>The BIG-IP must have line of sight to the pool server address specified.

- **Single sign-on settings**

  A BIG-IP supports many SSO options, but in OAuth client mode the Guided Config is limited to Kerberos or HTTP Headers. Enable SSO and use the following information to have the APM map inbound attributes you defined earlier, to outbound headers.

  | Properties | Description |
  |:-----------|:------------|
  | Header Operation |`Insert`|
  | Header Name | 'name' |
  | Header Value | `%{session.oauth.client.last.id_token.name}`|
  | Header Operation | `Insert`|
  |Header Name| `agentid`|
  |Header Value | `%{session.oauth.client.last.id_token.extension_AgentGeo}`|
 
  >[!Note]
  > APM session variables defined within curly brackets are CASE sensitive. So, entering agentid when the Azure AD B2C attribute name is being sent as AgentID will cause an attribute mapping failure. Unless necessary, we recommend defining all attributes in lowercase. In an Azure AD B2C case, the user flow prompts the user for the additional attributes using the name of the attribute as displayed in the portal, so using normal sentence case instead of lowercase might be preferable.

  ![Screenshot shows user single sign-on settings](./media/partner-f5/single-sign-on.png)

- **Customization properties**

  These settings allow you to customize the language and the look and feel of the screens that your users encounter when they interact with the APM access policy flow. You can personalize the screen messages and prompts, change screen layouts, colors, images, and localize captions, descriptions, and messages that are normally customizable in the access policy items.

  Replace the “F5 Networks” string in the Form Header text field with the name of your own organization. For example, “Wacketywack Inc. Secure hybrid access”.

- **Session management properties**

  A BIG-IPs session management setting is used to define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. These are optional, but we highly recommend implementing single log out (SLO) functionality, which ensures sessions are securely terminated when no longer required, reducing the risk of someone inadvertently gaining unauthorized access to published applications.

## Related information

The last step provides an overview of configurations. Hitting Deploy will commit your settings and create all necessary BIG-IP and APM objects to enable secure hybrid access to the application.
The application should also be visible as a target resource in CA. See the [guidance for building CA policies for Azure AD B2C](conditional-access-identity-protection-overview.md).
For increased security, organizations using this pattern could also consider blocking all direct access to the application, thereby forcing a strict path through the BIG-IP.

## Next steps

As a user, launch a browser and connect to the application’s external URL. The BIG-IP’s OAuth client logon page will prompt you to log on using Authorization code grant. Instructions for removing this step are provided in the supplemental configuration section.

You will then be redirected to sign up and authenticate against your Azure AD B2C tenant.

![Screenshot shows user sign in](./media/partner-f5/sign-in-message.png)

![Screenshot shows post sign in welcome message](./media/partner-f5/welcome-page.png)

For increased security, organizations using this pattern could also consider blocking all direct access to the application, in that way forcing a strict path through the BIG-IP.

### Supplemental configurations

**Single Log-Out (SLO)**

Azure AD B2C fully supports IdP and application sign out through various [mechanisms](session-behavior.md?pivots=b2c-custom-policy#single-sign-out).
Having your application’s sign-out function call the Azure AD B2C log-out endpoint would be one way of achieving SLO. That way we can be sure Azure AD B2C issues a final redirect to the BIG-IP to ensure the APM session between the user and the application has also been terminated.
Another alternative is to have the BIG-IP listen for the request when selecting the applications sign out button, and upon detecting the request it makes a simultaneous call to the Azure AD B2C logoff endpoint. This approach would avoid having to make any changes to the application itself yet achieves SLO. More details on using BIG-IP iRules to implement this are [available](https://support.f5.com/csp/article/K42052145).
In either case your Azure AD B2C tenant would need to know the APM’s logout endpoint. 

1. Navigate to **Manage** > **Manifest** in your Azure AD B2C portal and locate the logoutUrl property. It should read null.

2. Add the APM’s post logout URI: `https://<mysite.com>/my.logout.php3`, where `<mysite.com>` is the BIG-IP FQDN for your own header-based application.

**Optimized login flow**

One optional step for improving the user login experience would be to suppress the OAuth logon prompt displayed to users before Azure AD pre-authentication. 

1. Navigate to **Access** > **Guided Configuration** and select the small padlock icon on the far right of the row for the header-based application to unlock the strict configuration

   ![Screenshot shows optimized login flow](./media/partner-f5/optimized-login-flow.png)

Unlocking the strict configuration prevents any further changes via the wizard UI, leaving all BIG-IP objects associated with the published instance of the application open for direct management.

2. Navigate to **Access** > **Profiles/ Policies** > **Access Profiles (Per-session Policies)** and select the **Per-Session Policy** Edit link for the application’s policy object.

   ![Screenshot shows access profiles](./media/partner-f5/access-profile.png)

3. Select the small cross to delete the OAuth Logon Page policy object and when prompted choose to connect to the previous node.

   ![Screenshot shows OAuth logon page](./media/partner-f5/oauth-logon.png)

4. Select **Apply Access Policy** in the top left-hand corner and close the visual editor tab.
The next attempt at connecting to the application should take you straight to the Azure AD B2C sign-in page.

>[!Note]
>Re-enabling strict mode and deploying a configuration will overwrite any settings performed outside of the Guided Configuration UI, so implementing this scenario by manually creating all configuration objects is recommended for production services.

### Troubleshooting

Failure to access the protected application could be down to any number of potential factors, including a misconfiguration.

BIG-IP logs are a great source of information for isolating all authentication and SSO issues. If troubleshooting you should increase the log verbosity level.

  1. Go to **Access Policy** > **Overview** > **Event Logs** > **Settings**.

  2. Select the row for your published application then **Edit** > **Access System Logs**.

  3. Select **Debug** from the SSO list then, select **OK**. You can now reproduce your issue before looking at the logs but remember to switch this back when finished.

- If you see a BIG-IP branded error immediately after successful Azure AD B2C authentication, it’s possible the issue relates to SSO from Azure AD to the BIG-IP.

  1. Navigate to **Access** > **Overview** > **Access reports**.

  2. Run the report for the last hour to see logs provide any clues. The View session variables link for your session will also help understand if the APM is receiving the  expected claims from Azure AD.

- If you don’t see a BIG-IP error page, then the issue is probably more related to the backend request or SSO from the BIG-IP to the application.

  1. Go to **Access Policy** > **Overview** > **Active Sessions**.

  2. Select the link for your active session.

- The View Variables link in this location may also help determine root cause, particularly if the BIG-IP APM fails to obtain the right session attributes.
Your application’s logs would then help understand if it received those attributes as headers, or not.

- If using Guided Configuration v8, be aware of a known issue that generates the following BIG-IP error, after successful Azure AD B2C authentication.  

  ![Screenshot shows the error message](./media/partner-f5/error-message.png)

This is a policy violation due to the BIG-IP’s inability to validate the signature of the token issued by Azure AD B2C. The same access log should be able to provide more detail on the issue.

  ![Screenshot shows the access logs](./media/partner-f5/access-log.png)

Exact root cause is still being investigated by F5 engineering, but issue appears related to the AGC not enabling the Auto JWT setting during deployment, thereby preventing the APM from obtaining the current token signing keys.

  Until resolved, one way to work around the issue is to manually enable this setting. 

  1. Navigate to **Access** > **Guided Configuration** and select the small padlock icon on the far right of the row for your  header-based application.

  2. With the managed configuration unlocked, navigate to **Access** > **Federation** > **OAuth Client/Resource Server** > **Providers**.

  3. Select the provider for your Azure AD B2C configuration.

  4. Check the **Use Auto JWT** box then select **Discover**, followed by **Save**.

You should now see the Key (JWT) field populated with the key ID (KID) of the token signing certificate provided through the OpenID URI metadata.
  
  5. Finally, select the yellow **Apply Access Policy** option in the top left-hand corner, located next to the F5 logo. Then select **Apply** again to refresh the access profile list.

See F5’s guidance for more [OAuth client and resource server troubleshooting tips](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-sso-13-0-0/37.html#GUID-774384BC-CF63-469D-A589-1595D0DDFBA2)
