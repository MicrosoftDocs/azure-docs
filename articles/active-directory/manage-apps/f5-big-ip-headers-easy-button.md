---
title: Configure F5 BIG-IP Easy Button for Header-based SSO
description: Learn to implement secure hybrid access (SHA) with single sign-on (SSO) to header-based applications using F5 BIG-IP Easy Button Guided Configuration.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 03/27/2023
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5 BIG-IP Easy Button for header-based SSO

Learn to secure header-based applications with Azure Active Directory (Azure AD), with F5 BIG-IP Easy Button Guided Configuration v16.1.

Integrating a BIG-IP with Azure AD provides many benefits, including:
* Improved Zero Trust governance through Azure AD preauthentication and Conditional Access 
  * See, [What is Conditional Access?](../conditional-access/overview.md)
  * See, [Zero Trust security](../../security/fundamentals/zero-trust.md)
* Full SSO between Azure AD and BIG-IP published services
* Managed identities and access from one control plane
  * See, the [Azure portal](https://azure.microsoft.com/features/azure-portal)

Learn more:

* [Integrate F5 BIG-IP with Azure AD](./f5-aad-integration.md)
* [Enable SSO for an enterprise application](add-application-portal-setup-sso.md)

## Scenario description

This scenario covers the legacy application using HTTP authorization headers to manage access to protected content. Legacy lacks modern protocols to support direct integration with Azure AD. Modernization is costly, time consuming, and introduces downtime risk. Instead, use an F5 BIG-IP Application Delivery Controller (ADC) to bridge the gap between the legacy application and the modern ID control plane, with protocol transitioning. 

A BIG-IP in front of the application enables uoverlay of the service with Azure AD preauthentication and headers-based SSO This configuration improves overall applicatoin security posture.

   > [!NOTE] 
   > Organizations can have remote access to this application type with Azure AD Application Proxy. Learn more: [Remote access to on-premises applications through Azure AD Application Proxy](../app-proxy/application-proxy.md)

## Scenario architecture

The SHA solution contains:

* **Application** - BIG-IP published service protected by Azure AD SHA
* **Azure AD** - Security Assertion Markup Language (SAML) identity provider (IdP) that verifies user credentials, Conditional Access, and SAML-based SSO to the BIG-IP. With SSO, Azure AD provides the BIG-IP with session attributes.
* **BIG-IP** - reverse-proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing header-based SSO to the backend application.

For this scenario, SHA supports SP- and IdP-initiated flows. The following diagram illustrates the SP-initiated flow.

   ![Diagram of the configuration with an SP-initiated flow.](./media/f5-big-ip-easy-button-header/sp-initiated-flow.png)

1. User connects to application endpoint (BIG-IP).
2. BIG-IP APM access policy redirects user to Azure AD (SAML IdP).
3. Azure AD preauthenticates user and applies Conditional Access policies.
4. User is redirected to BIG-IP (SAML SP) and SSO occurs using issued SAML token.
5. BIG-IP injects Azure AD attributes as headers in application request.
6. Application authorizes request and returns payload.

## Prerequisites

For the scenario you need:

* An Azure subscription
  * If you don't have one, get an [Azure free account](https://azure.microsoft.com/free/)
* For the account, have Azure AD Application Administrator permissions
* A BIG-IP or deploy a BIG-IP Virtual Edition (VE) in Azure
  * See, [Deploy F5 BIG-IP Virtual Edition VM in Azure](./f5-bigip-deployment-guide.md)
* Any of the following F5 BIG-IP license SKUs:
  * F5 BIG-IP® Best bundle
  * F5 BIG-IP Access Policy Manager™ (APM) standalone license
  * F5 BIG-IP Access Policy Manager™ (APM) add-on license on a BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)
  * 90-day BIG-IP full feature trial. See, [Free Trials](https://www.f5.com/trial/big-ip-trial.php)
* User identities synchronized from an on-premises directory to Azure AD
  * See, [Azure AD Connect sync: Understand and customize synchronization](../hybrid/how-to-connect-sync-whatis.md)
* An SSL web certificate to publish services over HTTPS, or use default BIG-IP certs for testing
  * See, [SSL profile](./f5-bigip-deployment-guide.md#ssl-profile)
* A header-based application or set up an IIS header app for testing
  * See, [Set up an IIS header app](/previous-versions/iis/6.0-sdk/ms525396(v=vs.90)) 

## BIG-IP configuration

This tutorial uses Guided Configuration v16.1 with an Easy button template. With the Easy Button, admins no longer go back and forth to enable SHA services. The Guided Configuration wizard and Microsoft Graph handle deployment and policy management. The BIG-IP APM and Azure AD integration ensures applications support identity federation, SSO, and Conditional Access.

   > [!NOTE] 
   > Replace example strings or values with those in your environment.

## Register Easy Button

Before a client or service caaccesses Microsoft Graph, the Microsoft identity platform must trust it.

Learn more: [Quickstart: Register an application with the Microsoft identity platform](../develop/quickstart-register-app.md)

Create a tenant app registration to authorize the Easy Button access to Graph. With these permissions, the BIG-IP pushes the configurations to establish a trust between a SAML SP instance for published application, and Azure AD as the SAML IdP.

1. Sign-in to the [Azure portal](https://portal.azure.com/) with Application Administrative permissions.
2. In the left navigation, select **Azure Active Directory**.
3. Under **Manage**, select **App registrations > New registration**.
4. Enter an applciation **Name**.
5. Specify who uses the application.
6. Select **Accounts in this organizational directory only**.
7. Select **Register**.
8. Navigate to **API permissions**.
9. Authorize the following Microsoft Graph **Application permissions**:

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

8. Grant admin consent for your organization.
9. On **Certificates & Secrets**, generate a new **Client Secret**. Make a note of the Client Secret.
10. On **Overview**, note the Client ID and Tenant ID.

## Configure Easy Button

1. Start the APM Guided Configuration. 
2. Start the **Easy Button** template.
3. Navigate to **Access > Guided Configuration.
4. Select **Microsoft Integration**
5. Select **Azure AD Application**.

   ![Screenshot of the Azure AD Application option on Guided Configuration.](./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

6. Review the configuration steps.
7. Select **Next**.

   ![Screenshot of configuration steps.](./media/f5-big-ip-easy-button-ldap/config-steps.png)

8. Use the illustrated steps sequence to publish your application.

   ![Diagram of the publication sequence.](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png#lightbox)


### Configuration Properties

Use the **Configuration Properties** tab to create a BIG-IP application config and SSO object. Azure Service Account Details represent the client you registered in the Azure AD tenant. Use the settings for BIG-IP OAuth client to register a SAML SP in your tenant, with SSO properties. Easy Button performs this action for BIG-IP services published and enabled for SHA.

You can reuse settings to publish more applications.

1. Enter a **Configuration Name**.
2. For **Single Sign-On (SSO) & HTTP Headers**, select **On**.
3. For **Tenant ID**, **Client ID**, and **Client Secret**, enter what you noted.
4. Confirm the BIG-IP connects to your tenant.
5. Select **Next**

   ![Screenshot of entries and options for Configuration Properties.](./media/f5-big-ip-easy-button-ldap/config-properties.png)

### Service Provider

In Service Provider settings, define SAML SP instance settings for the SHA-protected application.

1. Enter a **Host**, the application public FQDN.
2. Enter an **Entity ID**, the identifier Azure AD uses to identify the SAML SP requesting a token.

   ![Screenshot of input fields for Service Provider.](./media/f5-big-ip-easy-button-ldap/service-provider.png)

3. (Optional) In Security Settings, select **Enable Encryption Assertion** to enable Azure AD to encrypt issued SAML assertions. Azure AD and BIG-IP APM encryption assertions help assure content tokens aren't intercepted, nor personal or corporate data compromised.

4.	In **Security Settings**, from the **Assertion Decryption Private Key** list, select **Create New**.
 
   ![Screenshot of the Create New option in the Assertion Decryption Private Key list.](./media/f5-big-ip-oracle/configure-security-create-new.png)

5.	Select **OK**. 
6.	The **Import SSL Certificate and Keys** dialog appears. 
7.	For **Import Type**, select **PKCS 12 (IIS)**. This action imports the certificate and private key. 
8.	For **Certificate and Key Name**, select **New** and enter the input.
9.	Enter the **Password**.
10.	Select **Import**.
11.	Close the browser tab to return to the main tab.

   ![Screenshot of selections and entries for SSL Certificate Key Source.](./media/f5-big-ip-oracle/import-ssl-certificates-and-keys.png)

12.	Check the box for **Enable Encrypted Assertion**.
13.	If you enabled encryption, from the **Assertion Decryption Private Key** list, select the certificate. This is the private key for the certificate BIG-IP APM uses to decrypt Azure AD assertions.
14.	If you enabled encryption, from the **Assertion Decryption Certificate** list, select the certificate. This is the certificate BIG-IP uploads to Azure AD to encrypt the issued SAML assertions.
   
   ![Screenshot of two entries and one option for Security Settings.](./media/f5-big-ip-easy-button-ldap/service-provider-security-settings.png)

### Azure Active Directory

Use the following instructions to configure a new BIG-IP SAML application in your Azure AD tenant. Easy Button has application templates for Oracle PeopleSoft, Oracle E-Business Suite, Oracle JD Edwards, SAP ERP, and a generic SHA template.

1. In **Azure Configuration**, under **Configuration Properties**, select **F5 BIG-IP APM Azure AD Integration**.
2. Select **Add**.

   ![Screenshot of the F5 BIG-IP APM Azure AD Integration option under Configuration Properties.](./media/f5-big-ip-easy-button-ldap/azure-config-add-app.png)

#### Azure Configuration

1. Enter an app **Display Name** BIG-IP creates in the Azure AD tenant. Users see the name, with an icon, on Microsoft [My Apps](https://myapplications.microsoft.com/).
2. Skip **Sign On URL (optional)**.
   
   ![Screenshot of Display Name input under Configuration Properties.](./media/f5-big-ip-easy-button-ldap/azure-configuration-properties.png)

3. Next to **Signing Key** and **Signing Certificate**, select **refresh** to locate the certificate you imported.
4. In **Signing Key Passphrase**, enter the certificate password.

6. (Optional) Enable **Signing Option** to ensure BIG-IP accepts tokens and claims signed by Azure AD.
   
   ![Screenshot for Azure configuration - Add signing certificates info](./media/f5-big-ip-easy-button-ldap/azure-configuration-sign-certificates.png)

7. Input for **User And User Groups** is dynamically queried. 

   > [!IMPORTANT]
   > Add a user or group for testing, otherwise all access is denied. On **User And User Groups**, select **+ Add**.
   
   ![Screenshot of the Add option on User And User Groups.](./media/f5-big-ip-easy-button-ldap/azure-configuration-add-user-groups.png)

#### User Attributes & Claims

When a user authenticates, Azure AD issues a SAML token with claims and attributes that identify the user. The **User Attributes & Claims** tab has default claims for the application. Use the tab to configure more claims.

Include one more attribute:

1. For **Header Name**, enter **employeeid**.
2. For **Source Attribute**, enter **user.employeeid**.

   ![Screenshot of values under Additional Claims.](./media/f5-big-ip-easy-button-ldap/user-attributes-claims.png)

#### Additional User Attributes

In the **Additional User Attributes** tab, enable session augmentation. Use this feature for distributed systems such as Oracle, SAP, and other JAVA implementations that require attributes to be stored in other directories. Attributes fetched from an LDAP source are injected as more SSO headers. This action helps control access based on roles, Partner IDs, etc. 

   ![Screenshot of options under Additional User Attributes.](./media/f5-big-ip-easy-button-header/additional-user-attributes.png)

   >[!NOTE] 
   >This feature has no correlation to Azure Active Directory. It's an attribute source. 

#### Conditional Access Policy

Conditional Access policies control access based on device, application, location, and risk signals. 

* In **Available Policies**, find Conditional Access policies with no user actions
* In **Selected Policies**, find cloud app policy
  * You can't deselect these policies or move them to Available Policies because they're enforced at a tenant level

To select a policy to be applied to the application being published:

1.	On the **Conditional Access Policy** tab, in the **Available Policies** list, select a policy. 
2.	Select the **right arrow** and move it to the **Selected Policies** list.

  > [!NOTE]
  > You can select the **Include** or **Exclude** option for a policy. If both options are selected, the policy is unenforced.

   ![Screenshot of the Exclude option selected for policies in Selected Polices.](./media/f5-big-ip-kerberos-easy-button/conditional-access-policy.png)

   > [!NOTE]
   > The policy list appears when you select the **Conditional Access Policy** tab. Select **refresh**, and the wizard queries the tenant. Refresh appears after an application is deployed.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object, represented by a virtual IP address, that listens for clients requests to the application. Received traffic is processed and evaluated against the APM profile associated with the virtual server. Traffic is directed according to policy.

1. For **Destination Address**, enter an IPv4 or IPv6 address BIG-IP uses to receive client traffic. Ensure a corresponding record in DNS that enables clients to resolve the external URL, of the BIG-IP published application, to this IP. You can use computer's localhost DNS for testing.
2. For **Service Port**, enter **443**, and select **HTTPS**.
3. Check the box for **Enable Redirect Port**.
4. Enter a value for **Redirect Port**. It redirects incoming HTTP client traffic to HTTPS

4. The Client SSL Profile enables the virtual server for HTTPS, so that client connections are encrypted over TLS. Select the **Client SSL Profile** you created as part of the prerequisites or leave the default whilst testing

   ![Screenshot for Virtual server](./media/f5-big-ip-easy-button-ldap/virtual-server.png)

### Pool Properties

The **Application Pool tab** details the services behind a BIG-IP that are represented as a pool, containing one or more application servers.

1. Choose from **Select a Pool**. Create a new pool or select an existing one

2. Choose the **Load Balancing Method** as *Round Robin*

3. For **Pool Servers** select an existing node or specify an IP and port for the server hosting the header-based application

   ![Screenshot for Application pool](./media/f5-big-ip-oracle/application-pool.png)

   > [!NOTE]
   > The Microsoft back-end application is on HTTP Port 80. If you select HTTPS, use **443**.

#### Single Sign-On & HTTP Headers

With SSO, users access BIG-IP published services without entering credentials. The Easy Button wizard supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO.

1. On Single Sign-On & HTTP Headers, in SSO Headers, for **Header Operation**, select **insert**
2. For **Header Name**, use **upn**.
3. For **Header Value**, use **%{session.saml.last.identity}**.
4. For **Header Operation**, select **insert**.
5. For **Header Name**, use **employeeid**.
6. For **Header Value**,use **%{session.saml.last.attr.name.employeeid}**.

   ![Screenshot of entries and selctions for SSO Headers.](./media/f5-big-ip-easy-button-header/sso-http-headers.png)

   >[!NOTE]
   >APM session variables in curly brackets are case-sensitive. Inconsistencies cause aattribute mapping failures.

### Session Management

Use BIG-IP session management settings to define conditions for user sessions termination or continuation. 

To learn more, go to support.f5.com for [K18390492: Security | BIG-IP APM operations guide](https://support.f5.com/csp/article/K18390492)

Single log-out (SLO) ensures IdP, BIG-IP, and user agent sessions terminate when users sign off. When the Easy Button instantiates a SAML application in your Azure AD tenant, it populates the sign out URL, with the APM SLO endpoint. IdP-initiated sign out from My Apps terminate BIG-IP and client sessions.

Learn more: see, [My Apps](https://myapplications.microsoft.com/)

Along with this the SAML federation metadata for the published application is also imported from your tenant, providing the APM with the SAML logout endpoint for Azure AD. This ensures SP initiated sign outs terminate the session between a client and Azure AD. But for this to be truly effective, the APM needs to know exactly when a user signs-out of the application.

If the BIG-IP webtop portal is used to access published applications then a sign-out from there would be processed by the APM to also call the Azure AD sign-out endpoint. But consider a scenario where the BIG-IP webtop portal isn’t used, then the user has no way of instructing the APM to sign out. Even if the user signs-out of the application itself, the BIG-IP is technically oblivious to this. So for this reason, SP initiated sign-out needs careful consideration to ensure sessions are securely terminated when no longer required. One way of achieving this would be to add an SLO function to your applications sign out button, so that it can redirect your client to either the Azure AD SAML or BIG-IP sign-out endpoint. The URL for SAML sign-out endpoint for your tenant can be found in **App Registrations > Endpoints**.

If making a change to the app is a no go, then consider having the BIG-IP listen for the application's sign-out call, and upon detecting the request have it trigger SLO. Refer to our [Oracle PeopleSoft SLO guidance](./f5-big-ip-oracle-peoplesoft-easy-button.md#peoplesoft-single-logout) for using BIG-IP irules to achieve this. More details on using BIG-IP iRules to achieve this is available in the F5 knowledge article [Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145) and [Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056).

## Summary

This last step provides a breakdown of your configurations. Select **Deploy** to commit all settings and verify that the application now exists in your tenants list of ‘Enterprise applications.

Your application should now be published and accessible via SHA, either directly via its URL or through Microsoft’s application portals. 

## Next steps

From a browser, **connect** to the application’s external URL or select the **application’s icon** in the [Microsoft MyApps portal](https://myapplications.microsoft.com/). After authenticating against Azure AD, you’ll be redirected to the BIG-IP virtual server for the application and automatically signed in through SSO.

This shows the output of the injected headers displayed by our headers-based application.

   ![Screenshot for App views](./media/f5-big-ip-easy-button-ldap/app-view.png)

For increased security, organizations using this pattern could also consider blocking all direct access to the application, thereby forcing a strict path through the BIG-IP.

## Advanced deployment

There may be cases where the Guided Configuration templates lacks the flexibility to achieve more specific requirements. For those scenarios, see [Advanced Configuration for headers-based SSO](./f5-big-ip-header-advanced.md).

Alternatively, the BIG-IP gives you the option to disable **Guided Configuration’s strict management mode**. This allows you to manually tweak your configurations, even though bulk of your configurations are automated through the wizard-based templates.

You can navigate to **Access > Guided Configuration** and select the **small padlock icon** on the far right of the row for your applications’ configs. 

   ![Screenshot for Configure Easy Button - Strict Management](./media/f5-big-ip-oracle/strict-mode-padlock.png)

At that point, changes via the wizard UI are no longer possible, but all BIG-IP objects associated with the published instance of the application will be unlocked for direct management.

> [!NOTE] 
> Re-enabling strict mode and deploying a configuration will overwrite any settings performed outside of the Guided Configuration UI, therefore we recommend the advanced configuration method for production services.

## Troubleshooting

Failure to access a SHA protected application can be due to any number of factors. BIG-IP logging can help quickly isolate all sorts of issues with connectivity, SSO, policy violations, or misconfigured variable mappings. Start troubleshooting by increasing the log verbosity level.

1. Navigate to **Access Policy > Overview > Event Logs > Settings**

2. Select the row for your published application then **Edit > Access System Logs**

3. Select **Debug** from the SSO list then **OK**

Reproduce your issue, then inspect the logs, but remember to switch this back when finished as verbose mode generates lots of data. 

If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it’s possible the issue relates to SSO from Azure AD to the BIG-IP.

1. Navigate to **Access > Overview > Access reports**

2. Run the report for the last hour to see if the logs provide any clues. The **View session** variables link for your session will also help understand if the APM is receiving the expected claims from Azure AD

If you don’t see a BIG-IP error page, then the issue is probably more related to the backend request or SSO from the BIG-IP to the application.

1. In which case head to **Access Policy > Overview > Active Sessions** and select the link for your active session

2. The **View Variables** link in this location may also help root cause SSO issues, particularly if the BIG-IP APM fails to obtain the right attributes from Azure AD or another source

For more information, visit this F5 knowledge article [Configuring LDAP remote authentication for Active Directory](https://support.f5.com/csp/article/K11072). There’s also a great BIG-IP reference table to help diagnose LDAP-related issues in this F5 knowledge article on [LDAP Query](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/5.html).
