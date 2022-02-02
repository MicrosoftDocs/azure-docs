---
title: Configure F5 BIG-IP’s Easy Button for Header-based SSO
description: learn to implement Secure Hybrid Access (SHA) with single sign-on (SSO) to header-based applications using F5’s BIG-IP Easy Button Guided Configuration.
services: active-directory
author: NishthaBabith-V
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 01/07/2022
ms.author: v-nisba
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5’s BIG-IP Easy Button for header-based SSO

In this article, you’ll learn to implement Secure Hybrid Access (SHA) with single sign-on (SSO) to header-based applications using F5’s BIG-IP Easy Button Guided Configuration.

Enabling BIG-IP published services for Azure Active Directory (Azure AD) SSO provides many benefits, including:

  * Improved Zero Trust governance through Azure AD pre-authentication and [Conditional Access](/conditional-access/overview)

  * Full SSO between Azure AD and BIG-IP published services

  * Manage Identities and access from a single control plane, the [Azure portal](https://portal.azure.com/)

To learn about all of the benefits, see the article on [F5 BIG-IP and Azure AD integration](./f5-aad-integration.md) and [what is application access and single sign-on with Azure AD](/azure/active-directory/active-directory-appssoaccess-whatis).

## Scenario description

For this scenario, we have a legacy application using HTTP authorization headers to control access to protected content.

Being legacy, the application lacks any form of modern protocols to support a direct integration with Azure AD. Modernizing the app is also costly, requires careful planning, and introduces risk of potential impact. 

One option would be to consider [Azure AD Application Proxy](/azure/active-directory/app-proxy/application-proxy), to gate remote access to the application.

Another approach is to use an F5 BIG-IP Application Delivery Controller, as it too provides the protocol transitioning required to bridge legacy applications to the modern ID control plane.

Having a BIG-IP in front of the application enables us to overlay the service with Azure AD pre-authentication and header-based SSO, significantly improving the overall security posture of the application for both remote and local access.

## Scenario architecture

The SHA solution for this scenario is made up of:

**Application:** BIG-IP published service to be protected by and Azure AD SHA. 

**Azure AD:** Security Assertion Markup Language (SAML) Identity Provider (IdP) responsible for verification of user credentials, Conditional Access (CA), and SSO to the BIG-IP. Through SSO, Azure AD provides the BIG-IP with any required attributes including a user identifier.

**BIG-IP:** Reverse proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing header-based SSO to the backend application.

SHA for this scenario supports both SP and IdP initiated flows. The following image illustrates the SP initiated flow.

![Secure hybrid access - SP initiated flow](./media/f5-big-ip-easy-button-header/sp-initiated-flow.png)

| Steps| Description |
| - |----|
| 1| User connects to application endpoint (BIG-IP) |
| 2| BIG-IP APM access policy redirects user to Azure AD (SAML IdP) |
| 3| Azure AD pre-authenticates user and applies any enforced CA policies |
| 4| User is redirected to BIG-IP (SAML SP) and SSO is performed using issued SAML token |
| 5| BIG-IP injects Azure AD attributes as headers in request to the application |
| 6| Application authorizes request and returns payload |

## Prerequisites

Prior BIG-IP experience isn’t necessary, but you’ll need:

* An Azure AD free subscription or above

* An existing BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in Azure](./f5-bigip-deployment-guide.md)

* Any of the following F5 BIG-IP license SKUs

  * F5 BIG-IP® Best bundle

  * F5 BIG-IP Access Policy Manager™ (APM) standalone license

  * F5 BIG-IP Access Policy Manager™ (APM) add-on license on an existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

  * 90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php).

* User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md) from an on-premises directory to Azure AD

* An account with Azure AD application admin [permissions](/azure/active-directory/users-groups-roles/directory-assign-admin-roles#application-administrator)

* A [SSL certificate](./f5-bigip-deployment-guide.md#ssl-profile) for publishing services over HTTPS, or use default certificates while testing

* An existing header-based application or [setup a simple IIS header app](/previous-versions/iis/6.0-sdk/ms525396(v=vs.90)) for testing

## BIG-IP configuration methods

There are many methods to deploy BIG-IP for this scenario including a template-driven Guided Configuration, or an advanced configuration. This tutorial covers the Easy Button templates offered by the Guided Configuration 16.1 and upwards.

With the **Easy Button**, admins no longer go back and forth between Azure AD and a BIG-IP to enable services for SHA. The end-to-end deployment and policy management of applications is handled directly between the APM’s Guided Configuration wizard and Microsoft Graph. This rich integration between BIG-IP APM and Azure AD ensures applications can quickly, easily support identity federation, SSO, and Azure AD Conditional Access, reducing administrative overhead.

> [!NOTE] 
> All example strings or values referenced throughout this guide should be replaced with those for your actual environment.

## Register Easy Button

Before a client or service can access Microsoft Graph, it must be trusted by the Microsoft identity platform. 

The Easy Button client must also be registered as a client in Azure AD, before it is allowed to establish a trust relationship between each SAML SP instance of a BIG-IP published applications, and the IdP.

1. Sign-in to the [Azure AD portal](https://portal.azure.com/) using an account with Application Administrative rights
2. From the left navigation pane, select the **Azure Active Directory** service
3. Under Manage, select **App registrations > New registration**
4. Enter a display name for your application. For example, *F5 BIG-IP Easy Button*
5. Specify who can use the application > **Accounts in this organizational directory only**
6. Select **Register** to complete the initial app registration
7. Navigate to **API permissions** and authorize the following Microsoft Graph permissions:

    * Application.Read.All
    * Application.ReadWrite.All
    * Application.ReadWrite.OwnedBy
    * Directory.Read.All
    * Group.Read.All
    * IdentityRiskyUser.Read.All
    * Policy.Read.All
    * Policy.ReadWrite.ApplicationConfiguration
    * Policy.ReadWrite.ConditionalAccess
    * User.Read.All

8. Grant admin consent for your organization
9. In the **Certificates & Secrets** blade, generate a new **client secret** and note it down
10. From the **Overview** blade, note the **Client ID** and **Tenant ID**

## Configure Easy Button

Next, step through the Easy Button configurations to federate and publish the internal application. Start by provisioning your BIG-IP with an X509 certificate that Azure AD can use to sign SAML tokens and claims issued for SHA enabled services.

1. From a browser, sign-in to the F5 BIG-IP management console
2. Navigate to **System > Certificate Management > Traffic Certificate Management SSL Certificate List > Import**
3. Select **PKCS 12 (IIS)** and import your certificate along with its private key

Once provisioned, the certificate can be used for every application published through Easy Button. You can also choose to upload a separate certificate for individual applications.
  
   ![Screenshot for Configure Easy Button- Import SSL certificates and keys](./media/f5-big-ip-easy-button-ldap/configure-easy-button.png)

4. Navigate to **Access > Guided Configuration > Microsoft Integration and select Azure AD Application**

You can now access the Easy Button functionality that provides quick configuration steps to set up the APM as a SAML Service Provider (SP) and Azure AD as an Identity Provider (IdP) for your application.

   ![Screenshot for Configure Easy Button- Install the template](./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

5. Review the list of configuration steps and select Next
  
   ![Screenshot for Configure Easy Button - List configuration steps](./media/f5-big-ip-easy-button-ldap/config-steps.png)

## Configuration steps

The **Easy Button** template will display the sequence of steps required to publish your application.

![Configuration steps flow](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png)


### Configuration Properties

These are general and service account properties. The **Configuration Properties tab** creates up a new application config and SSO object that will be managed through the BIG-IP’s Guided Configuration UI. The configuration can then be reused for publishing more applications through the Easy Button template.

Consider the **Azure Service Account Details** be the BIG-IP client application you registered in your Azure AD tenant earlier. This section allows the BIG-IP to programmatically register a SAML application directly in your tenant, along with the other properties you would normally configure manually, in the portal. Easy Button will do this for every BIG-IP APM service being published and enabled for SHA.

Some of these are global settings that can be reused for publishing more applications, further reducing deployment time and effort.

1. Enter a unique **Configuration Name** so admins can easily distinguish between Easy Button configurations.

2. Enable **Single Sign-On (SSO) & HTTP Headers**

3. Enter the **Tenant Id**, **Client ID**, and **Client Secret** you noted down during tenant registration

4. Confirm the BIG-IP can successfully connect to your tenant, and then select **Next**

   ![Screenshot for Configuration General and Service Account properties](./media/f5-big-ip-easy-button-ldap/config-properties.png)

### Service Provider

The Service Provider settings define the SAML SP properties for the APM instance representing the application protected through SHA.

1. Enter **Host**. This is the public FQDN of the application being secured. You’ll need a corresponding DNS record for clients to resolve this address, but using a localhost record is fine during testing

2. Enter **Entity ID**. This is the identifier Azure AD will use to identify the SAML SP requesting a token

    ![Screenshot for Service Provider settings](./media/f5-big-ip-easy-button-ldap/service-provider.png)

Next, under security settings, enter information for Azure AD to encrypt issued SAML assertions. Encrypting assertions between Azure AD and the BIG-IP APM provides additional  assurance that the content tokens can’t be intercepted, and personal or corporate data be compromised.

3. Check **Enable Encrypted Assertion (Optional)**. Enable to request Azure AD to encrypt SAML assertions

4. Select **Assertion Decryption Private Key**. The private key for the certificate that BIG-IP APM will use to decrypt Azure AD assertions

5. Select **Assertion Decryption Certificate**. This is the certificate that BIG-IP will upload to Azure AD for encrypting the issued SAML assertions. This can be the certificate you provisioned earlier
   
   ![Screenshot for Service Provider security settings](./media/f5-big-ip-easy-button-ldap/service-provider-security-settings.png)

### Azure Active Directory

This section defines all properties that you would normally use to manually configure a new BIG-IP SAML application within your Azure AD tenant.

The Easy Button wizard provides a set of pre-defined application templates for Oracle PeopleSoft, Oracle E-business Suite, Oracle JD Edwards, SAP ERP, but we’ll use the generic SHA template by selecting **F5 BIG-IP APM Azure AD Integration > Add**.

![Screenshot for Azure configuration add BIG-IP application](./media/f5-big-ip-easy-button-ldap/azure-config-add-app.png)

#### Azure Configuration

1. Enter **Display Name** of app that the BIG-IP creates in your Azure AD tenant, and the icon that the users will see on [MyApps portal](https://myapplications.microsoft.com/)

2. Do not enter anything in the **Sign On URL (optional)** to enable IdP initiated sign-on
   
   ![Screenshot for Azure configuration add display info](./media/f5-big-ip-easy-button-ldap/azure-configuration-properties.png)

3. Select **Signing key**. The IdP SAML signing certificate you provisioned earlier

4. Select the same certificate for **Singing Certificate**

5. Enter the certificate’s password in **Passphrase**

6. Select **Signing Options**. It can be enabled optionally to ensure the BIG-IP only accepts tokens and claims that have been signed by your Azure AD tenant
   
   ![Screenshot for Azure configuration - Add signing certificates info](./media/f5-big-ip-easy-button-ldap/azure-configuration-sign-certificates.png)

7. **User and User Groups** are dynamically queried from your Azure AD tenant and used to authorize access to the application. Add a user or group that you can use later for testing, otherwise all access will be denied
   
   ![Screenshot for Azure configuration - Add users and groups](./media/f5-big-ip-easy-button-ldap/azure-configuration-add-user-groups.png)

#### User Attributes & Claims

When a user successfully authenticates, Azure AD issues a SAML token with a default set of claims and attributes uniquely identifying the user. The **User Attributes & Claims tab** shows the default claims to issue for the new application. It also lets you configure more claims.

For this example, you can include one more attribute:

1. Enter **Header Name** as *employeeid

2. Enter **Source Attribute** as *user.employeeid

   ![Screenshot for user attributes and claims](./media/f5-big-ip-easy-button-ldap/user-attributes-claims.png)

#### Additional User Attributes

In the **Additional User Attributes tab**, you can enable session augmentation required by a variety of distributed systems such as Oracle, SAP, and other JAVA based implementations requiring attributes stored in other directories. Attributes fetched from an LDAP source can then be injected as additional SSO headers to further control access based on roles, Partner IDs, etc. 

![Screenshot for additional user attributes](./media/f5-big-ip-easy-button-header/additional-user-attributes.png)

>[!NOTE] 
>This feature has no correlation to Azure AD but is another source of attributes. 

#### Conditional Access Policy

You can further protect the published application with policies returned from your Azure AD tenant. These policies are enforced after the first-factor authentication has been completed and uses signals from conditions like device platform, location, user or group membership, or application to determine access.

The **Available Policies** by default, lists all CA policies defined without user based actions.

The **Selected Policies** list, by default, displays all policies targeting All cloud apps. These policies cannot be deselected or moved to the Available Policies list.

To select a policy to be applied to the application being published:

1. Select the desired policy in the **Available Policies** list

2. Select the right arrow and move it to the **Selected Policies** list

Selected policies should either have an **Include** or **Exclude option** checked. If both options are checked, the selected policy is not enforced. Excluding all policies may ease testing, you can go back and enable them later.

![Screenshot for CA policies](./media/f5-big-ip-easy-button-ldap/conditional-access-policy.png)

> [!NOTE]
> The policy list is enumerated only once when first switching to this tab. A refresh button is available to manually force the wizard to query your tenant, but this button is displayed only when the application has been deployed.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for clients requests to the application. Any received traffic is processed and evaluated against the APM profile associated with the virtual server, before being directed according to the policy results and settings.

1. Enter **Destination Address**. This is any available IPv4/IPv6 address that the BIG-IP can use to receive client traffic

2. Enter **Service Port** as *443* for HTTPS

3. Check **Enable Redirect Port** and then enter **Redirect Port**. It redirects incoming HTTP client traffic to HTTPS

4. Select **Client SSL Profile** to enable the virtual server for HTTPS so that client connections are encrypted over TLS. Select the client SSL profile you created as part of the prerequisites or leave the default if testing

   ![Screenshot for Virtual server](./media/f5-big-ip-easy-button-ldap/virtual-server.png)

### Pool Properties

The **Application Pool tab** details the services behind a BIG-IP that are represented as a pool, containing one or more application servers.

1. Choose from **Select a Pool**. Create a new pool or select an existing one

2. Choose the **Load Balancing Method** as *Round Robin*

3. Update **Pool Servers**. Select an existing node or specify an IP and port for the server hosting the header-based application

   ![Screenshot for Application pool](./media/f5-big-ip-easy-button-ldap/application-pool.png)

Our backend application sits on HTTP port 80 but obviously switch to 443 if yours is HTTPS.

#### Single Sign-On & HTTP Headers

Enabling SSO allows users to access BIG-IP published services without having to enter credentials. The **Easy Button wizard** supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO, the latter of which we’ll enable to configure the following.

* **Header Operation:** Insert
* **Header Name:** upn
* **Header Value:** %{session.saml.last.identity}

* **Header Operation:** Insert
* **Header Name:** employeeid
* **Header Value:** %{session.saml.last.attr.name.employeeid}

![Screenshot for SSO and HTTP headers](./media/f5-big-ip-easy-button-header/sso-http-headers.png)

>[!NOTE]
> APM session variables defined within curly brackets are CASE sensitive. If you enter EmployeeID when the Azure AD attribute name is being defined as employeeid, it will cause an attribute mapping failure.

### Session Management

The BIG-IPs session management settings are used to define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. Consult [F5 documentation](https://support.f5.com/csp/article/K18390492) for details on these settings.

What isn’t covered there however is Single Log-Out (SLO) functionality, which ensures all sessions between the IdP, the BIG-IP, and the client are terminated after a user has logged out.

When the Easy Button wizard deploys a SAML application to Azure AD, it also populates the Logout Url with the APM’s SLO endpoint. That way IdP initiated sign-outs from the MyApps portal also terminate the session between the BIG-IP and a client.

During deployment, the SAML applications federation metadata is also imported, providing the APM the SAML logout endpoint for Azure AD. This helps SP initiated sign-outs also terminate the session between a client and Azure AD. But for this to be truly effective, the APM needs to know exactly when a user signs-out.

Consider a scenario where the BIG-IP web portal isn’t used, the user has no way of instructing the APM to sign out. Even if the user signs-out of the application itself, the BIG-IP is technically oblivious to this, so the application session could easily be reinstated through SSO. For this reason, SP initiated sign-out needs careful consideration to ensure sessions are securely terminated when no longer required. One way of achieving this would be to add an SLO function to your applications sign out button, so that it can redirect your client to the Azure AD SAML sign-out endpoint. The SAML sign-out endpoint for your tenant can be found in **App Registrations > Endpoints**.

If making a change to the app is a no go, then consider having the BIG-IP listen for the apps sign-out call, and upon detecting the request have it trigger SLO. More details on using BIG-IP iRules to achieve this is available in the F5 knowledge article [Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145) and [Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056).

## Summary

Select **Deploy** to commit all settings and verify that the application has appeared in your tenant. This last step provides break down of all applied settings before they’re committed.

Your application should now be published and accessible via SHA, either directly via its URL or through Microsoft’s application portals. 

## Next steps

From a browser, **connect** to the application’s external URL or select the **application’s icon** in the MyApps portal. After authenticating against Azure AD, you’ll be redirected to the BIG-IP virtual server for the application and automatically signed in through SSO.

This shows the output of the injected headers displayed by our headers-based application.

![Screenshot for App views](./media/f5-big-ip-easy-button-ldap/app-view.png)

For increased security, organizations using this pattern could also consider blocking all direct access to the application, thereby forcing a strict path through the BIG-IP.

## Advanced deployment

There may be cases where the Guided Configuration templates lack the flexibility to achieve a particular set of requirements. Or even a need to fast track a proof of concept. For those scenarios, the BIG-IP offers the ability to disable the Guided Configuration’s strict management mode. That way the bulk of your configurations can be deployed through the wizard-based templates, and any tweaks or additional settings applied manually.

For those scenarios, go ahead and deploy using the Guided Configuration. Then navigate to **Access > Guided Configuration** and select the small padlock icon on the far right of the row for your applications’ configs. At that point, changes via the wizard UI are no longer possible, but all BIG-IP objects associated with the published instance of the application will be unlocked for direct management. 

For more information, see [Advanced Configuration for header-based SSO](./f5-big-ip-header-advanced.md).

> [!NOTE] 
> Re-enabling strict mode and deploying a configuration will overwrite any settings performed outside of the Guided Configuration UI, therefore we recommend the manual approach for production services.

## Troubleshooting

You can fail to access the SHA protected application due to any number of factors, including a misconfiguration.

BIG-IP logs are a great source of information for isolating all sorts of authentication & SSO issues. When troubleshooting you should increase the log verbosity level.

1. Navigate to **Access Policy > Overview > Event Logs > Settings**

2. Select the row for your published application then **Edit > Access System Logs**

3. Select **Debug** from the SSO list then **OK**

Reproduce your issue before looking at the logs but remember to switch this back when finished. If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it’s possible the issue relates to SSO from Azure AD to the BIG-IP.

1. Navigate to **Access > Overview > Access reports**
2. Run the report for the last hour to see logs provide any clues. The **View session** variables link for your session will also help understand if the APM is receiving the expected claims from Azure AD

If you don’t see a BIG-IP error page, then the issue is probably more related to the backend request or SSO from the BIG-IP to the application.

1. In which case you should head to **Access Policy > Overview > Active Sessions** and select the link for your active session

2. The **View Variables** link in this location may also help root cause SSO issues, particularly if the BIG-IP APM fails to obtain the right attributes

For more information, visit this F5 knowledge article [Configuring LDAP remote authentication for Active Directory](https://support.f5.com/csp/article/K11072). There’s also a great BIG-IP reference table to help diagnose LDAP-related issues in this F5 knowledge article on [LDAP Query](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/5.html).

## Additional resources

* [The end of passwords, go password-less](https://www.microsoft.com/security/business/identity/passwordless)

* [What is Conditional Access?](../conditional-access/overview.md)

* [Microsoft Zero Trust framework to enable remote work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/)
