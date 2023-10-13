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
ms.custom: not-enterprise-apps
---

# Tutorial: Configure F5 BIG-IP Easy Button for header-based SSO

Learn to secure header-based applications with Microsoft Entra ID, with F5 BIG-IP Easy Button Guided Configuration v16.1.

Integrating a BIG-IP with Microsoft Entra ID provides many benefits, including:
* Improved Zero Trust governance through Microsoft Entra preauthentication and Conditional Access 
  * See, [What is Conditional Access?](../conditional-access/overview.md)
  * See, [Zero Trust security](../../security/fundamentals/zero-trust.md)
* Full SSO between Microsoft Entra ID and BIG-IP published services
* Managed identities and access from one control plane
  * See, the [Microsoft Entra admin center](https://entra.microsoft.com) 

Learn more:

* [Integrate F5 BIG-IP with Microsoft Entra ID](./f5-integration.md)
* [Enable SSO for an enterprise application](add-application-portal-setup-sso.md)

## Scenario description

This scenario covers the legacy application using HTTP authorization headers to manage access to protected content. Legacy lacks modern protocols to support direct integration with Microsoft Entra ID. Modernization is costly, time consuming, and introduces downtime risk. Instead, use an F5 BIG-IP Application Delivery Controller (ADC) to bridge the gap between the legacy application and the modern ID control plane, with protocol transitioning. 

A BIG-IP in front of the application enables overlay of the service with Microsoft Entra preauthentication and headers-based SSO. This configuration improves overall application security posture.

   > [!NOTE] 
   > Organizations can have remote access to this application type with Microsoft Entra application proxy. Learn more: [Remote access to on-premises applications through Microsoft Entra application proxy](../app-proxy/application-proxy.md)

## Scenario architecture

The SHA solution contains:

* **Application** - BIG-IP published service protected by Microsoft Entra SHA
* **Microsoft Entra ID** - Security Assertion Markup Language (SAML) identity provider (IdP) that verifies user credentials, Conditional Access, and SAML-based SSO to the BIG-IP. With SSO, Microsoft Entra ID provides the BIG-IP with session attributes.
* **BIG-IP** - reverse-proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing header-based SSO to the backend application.

For this scenario, SHA supports SP- and IdP-initiated flows. The following diagram illustrates the SP-initiated flow.

   ![Diagram of the configuration with an SP-initiated flow.](./media/f5-big-ip-easy-button-header/sp-initiated-flow.png)

1. User connects to application endpoint (BIG-IP).
2. BIG-IP APM access policy redirects user to Microsoft Entra ID (SAML IdP).
3. Microsoft Entra preauthenticates user and applies Conditional Access policies.
4. User is redirected to BIG-IP (SAML SP) and SSO occurs using issued SAML token.
5. BIG-IP injects Microsoft Entra attributes as headers in application request.
6. Application authorizes request and returns payload.

## Prerequisites

For the scenario you need:

* An Azure subscription
  * If you don't have one, get an [Azure free account](https://azure.microsoft.com/free/)
* One of the following roles: Global Administrator, Cloud Application Administrator, or Application Administrator
* A BIG-IP or deploy a BIG-IP Virtual Edition (VE) in Azure
  * See, [Deploy F5 BIG-IP Virtual Edition VM in Azure](./f5-bigip-deployment-guide.md)
* Any of the following F5 BIG-IP license SKUs:
  * F5 BIG-IP® Best bundle
  * F5 BIG-IP Access Policy Manager™ (APM) standalone license
  * F5 BIG-IP Access Policy Manager™ (APM) add-on license on a BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)
  * 90-day BIG-IP full feature trial. See, [Free Trials](https://www.f5.com/trial/big-ip-trial.php)
* User identities synchronized from an on-premises directory to Microsoft Entra ID
  * See, [Microsoft Entra Connect Sync: Understand and customize synchronization](../hybrid/connect/how-to-connect-sync-whatis.md)
* An SSL web certificate to publish services over HTTPS, or use default BIG-IP certs for testing
  * See, [SSL profile](./f5-bigip-deployment-guide.md#ssl-profile)
* A header-based application or set up an IIS header app for testing
  * See, [Set up an IIS header app](/previous-versions/iis/6.0-sdk/ms525396(v=vs.90)) 

## BIG-IP configuration

This tutorial uses Guided Configuration v16.1 with an Easy button template. With the Easy Button, admins no longer go back and forth to enable SHA services. The Guided Configuration wizard and Microsoft Graph handle deployment and policy management. The BIG-IP APM and Microsoft Entra integration ensures applications support identity federation, SSO, and Conditional Access.

   > [!NOTE] 
   > Replace example strings or values with those in your environment.

## Register Easy Button

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Before a client or service accesses Microsoft Graph, the Microsoft identity platform must trust it.

Learn more: [Quickstart: Register an application with the Microsoft identity platform](../develop/quickstart-register-app.md)

Create a tenant app registration to authorize the Easy Button access to Graph. With these permissions, the BIG-IP pushes the configurations to establish a trust between a SAML SP instance for published application, and Microsoft Entra ID as the SAML IdP.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
2. Browse to **Identity** > **Applications** > **App registrations** > **New registration**.
3. Under **Manage**, select **App registrations > New registration**.
4. Enter an application **Name**.
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
3. Navigate to **Access > Guided Configuration**.
4. Select **Microsoft Integration**
5. Select **Microsoft Entra Application**.

   ![Screenshot of the Microsoft Entra Application option on Guided Configuration.](./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

6. Review the configuration steps.
7. Select **Next**.

   ![Screenshot of configuration steps.](./media/f5-big-ip-easy-button-ldap/config-steps.png)

8. Use the illustrated steps sequence to publish your application.

   ![Diagram of the publication sequence.](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png#lightbox)


### Configuration Properties

Use the **Configuration Properties** tab to create a BIG-IP application config and SSO object. Azure Service Account Details represent the client you registered in the Microsoft Entra tenant. Use the settings for BIG-IP OAuth client to register a SAML SP in your tenant, with SSO properties. Easy Button performs this action for BIG-IP services published and enabled for SHA.

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
2. Enter an **Entity ID**, the identifier Microsoft Entra ID uses to identify the SAML SP requesting a token.

   ![Screenshot of input fields for Service Provider.](./media/f5-big-ip-easy-button-ldap/service-provider.png)

3. (Optional) In Security Settings, select **Enable Encryption Assertion** to enable Microsoft Entra ID to encrypt issued SAML assertions. Microsoft Entra ID and BIG-IP APM encryption assertions help assure content tokens aren't intercepted, nor personal or corporate data compromised.

4. In **Security Settings**, from the **Assertion Decryption Private Key** list, select **Create New**.
 
   ![Screenshot of the Create New option in the Assertion Decryption Private Key list.](./media/f5-big-ip-oracle/configure-security-create-new.png)

5. Select **OK**. 
6. The **Import SSL Certificate and Keys** dialog appears. 
7. For **Import Type**, select **PKCS 12 (IIS)**. This action imports the certificate and private key. 
8. For **Certificate and Key Name**, select **New** and enter the input.
9. Enter the **Password**.
10. Select **Import**.
11. Close the browser tab to return to the main tab.

   ![Screenshot of selections and entries for SSL Certificate Key Source.](./media/f5-big-ip-oracle/import-ssl-certificates-and-keys.png)

12. Check the box for **Enable Encrypted Assertion**.
13. If you enabled encryption, from the **Assertion Decryption Private Key** list, select the certificate. BIG-IP APM uses this certificate private key to decrypt Microsoft Entra assertions.
14. If you enabled encryption, from the **Assertion Decryption Certificate** list, select the certificate. BIG-IP uploads this certificate to Microsoft Entra ID to encrypt the issued SAML assertions.
   
   ![Screenshot of two entries and one option for Security Settings.](./media/f5-big-ip-easy-button-ldap/service-provider-security-settings.png)

<a name='azure-active-directory'></a>

### Microsoft Entra ID

Use the following instructions to configure a new BIG-IP SAML application in your Microsoft Entra tenant. Easy Button has application templates for Oracle PeopleSoft, Oracle E-Business Suite, Oracle JD Edwards, SAP ERP, and a generic SHA template.

1. In **Azure Configuration**, under **Configuration Properties**, select **F5 BIG-IP APM Azure AD Integration**.
2. Select **Add**.

   ![Screenshot of the F5 BIG-IP APM Azure AD Integration option under Configuration Properties.](./media/f5-big-ip-easy-button-ldap/azure-config-add-app.png)

#### Azure Configuration

1. Enter an app **Display Name** BIG-IP creates in the Microsoft Entra tenant. Users see the name, with an icon, on Microsoft [My Apps](https://myapplications.microsoft.com/).
2. Skip **Sign On URL (optional)**.
   
   ![Screenshot of Display Name input under Configuration Properties.](./media/f5-big-ip-easy-button-ldap/azure-configuration-properties.png)

3. Next to **Signing Key** and **Signing Certificate**, select **refresh** to locate the certificate you imported.
4. In **Signing Key Passphrase**, enter the certificate password.

6. (Optional) Enable **Signing Option** to ensure BIG-IP accepts tokens and claims signed by Microsoft Entra ID.
   
   ![Screenshot for Azure configuration - Add signing certificates info](./media/f5-big-ip-easy-button-ldap/azure-configuration-sign-certificates.png)

7. Input for **User And User Groups** is dynamically queried. 

   > [!IMPORTANT]
   > Add a user or group for testing, otherwise all access is denied. On **User And User Groups**, select **+ Add**.
   
   ![Screenshot of the Add option on User And User Groups.](./media/f5-big-ip-easy-button-ldap/azure-configuration-add-user-groups.png)

#### User Attributes & Claims

When a user authenticates, Microsoft Entra ID issues a SAML token with claims and attributes that identify the user. The **User Attributes & Claims** tab has default claims for the application. Use the tab to configure more claims.

Include one more attribute:

1. For **Header Name**, enter **employeeid**.
2. For **Source Attribute**, enter **user.employeeid**.

   ![Screenshot of values under Additional Claims.](./media/f5-big-ip-easy-button-ldap/user-attributes-claims.png)

#### Additional User Attributes

In the **Additional User Attributes** tab, enable session augmentation. Use this feature for distributed systems such as Oracle, SAP, and other JAVA implementations that require attributes to be stored in other directories. Attributes fetched from an LDAP source are injected as more SSO headers. This action helps control access based on roles, Partner IDs, etc. 

   ![Screenshot of options under Additional User Attributes.](./media/f5-big-ip-easy-button-header/additional-user-attributes.png)

   >[!NOTE] 
   >This feature has no correlation to Microsoft Entra ID. It's an attribute source. 

#### Conditional Access Policy

Conditional Access policies control access based on device, application, location, and risk signals. 

* In **Available Policies**, find Conditional Access policies with no user actions
* In **Selected Policies**, find cloud app policy
  * You can't deselect these policies or move them to Available Policies because they're enforced at a tenant level

To select a policy to be applied to the application being published:

1. On the **Conditional Access Policy** tab, in the **Available Policies** list, select a policy. 
2. Select the **right arrow** and move it to the **Selected Policies** list.

  > [!NOTE]
  > You can select the **Include** or **Exclude** option for a policy. If both options are selected, the policy is unenforced.

   ![Screenshot of the Exclude option selected for policies in Selected Polices.](./media/f5-big-ip-kerberos-easy-button/conditional-access-policy.png)

   > [!NOTE]
   > The policy list appears when you select the **Conditional Access Policy** tab. Select **refresh**, and the wizard queries the tenant. Refresh appears after an application is deployed.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object, represented by a virtual IP address. The server listens for clients requests to the application. Received traffic is processed and evaluated against the APM profile associated with the virtual server. Traffic is directed according to policy.

1. For **Destination Address**, enter an IPv4 or IPv6 address BIG-IP uses to receive client traffic. Ensure a corresponding record in DNS that enables clients to resolve the external URL, of the BIG-IP published application, to this IP. You can use computer's localhost DNS for testing.
2. For **Service Port**, enter **443**, and select **HTTPS**.
3. Check the box for **Enable Redirect Port**.
4. Enter a value for **Redirect Port**. This option redirects incoming HTTP client traffic to HTTPS.
5. Select the **Client SSL Profile** you created, or leave the default for testing. The Client SSL Profile enables the virtual server for HTTPS, so client connections are encrypted over TLS. 

   ![Screenshot of Destination Address, Service Port, and a selected profile on Virtual Server Properties.](./media/f5-big-ip-easy-button-ldap/virtual-server.png)

### Pool Properties

The **Application Pool** tab has services behind a BIG-IP, represented as a pool, with one or more application servers.

1. For **Select a Pool**, select **Create New**, or select another.
2. For **Load Balancing Method**, select **Round Robin**.
3. For **Pool Servers**, select a node, or select an IP address and port for the server hosting the header-based application.

   ![Screenshot of IP Address or Node name, and Port input on Pool Properties.](./media/f5-big-ip-oracle/application-pool.png)

   > [!NOTE]
   > The Microsoft back-end application is on HTTP Port 80. If you select HTTPS, use **443**.

#### Single Sign-On & HTTP Headers

With SSO, users access BIG-IP published services without entering credentials. The Easy Button wizard supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO.

1. On **Single Sign-On & HTTP Headers**, in **SSO Headers**, for **Header Operation**, select **insert**
2. For **Header Name**, use **upn**.
3. For **Header Value**, use **%{session.saml.last.identity}**.
4. For **Header Operation**, select **insert**.
5. For **Header Name**, use **employeeid**.
6. For **Header Value**,use **%{session.saml.last.attr.name.employeeid}**.

   ![Screenshot of entries and selections for SSO Headers.](./media/f5-big-ip-easy-button-header/sso-http-headers.png)

   >[!NOTE]
   >APM session variables in curly brackets are case-sensitive. Inconsistencies cause attribute mapping failures.

### Session Management

Use BIG-IP session management settings to define conditions for user sessions termination or continuation. 

To learn more, go to support.f5.com for [K18390492: Security | BIG-IP APM operations guide](https://support.f5.com/csp/article/K18390492)

Single log-out (SLO) ensures IdP, BIG-IP, and user agent sessions terminate when users sign out. When the Easy Button instantiates a SAML application in your Microsoft Entra tenant, it populates the sign out URL, with the APM SLO endpoint. IdP-initiated sign out from My Apps terminates BIG-IP and client sessions.

Learn more: see, [My Apps](https://myapplications.microsoft.com/)

The SAML federation metadata for the published application is imported from your tenant. The import provides the APM with the SAML sign out endpoint for Microsoft Entra ID. This action ensures SP-initiated sign out terminates client and Microsoft Entra sessions. Ensure the APM knows when user sign out occurs.

If the BIG-IP webtop portal accesses published applications, then th eAPM processes the sign out to call the Microsoft Entra sign-out endpoint. If the BIG-IP webtop portal isn’t used, users can't instruct the APM to sign out. If users sign out of the application, the BIG-IP is oblivious. Thus, ensure SP-initiated sign out securely terminates sessions. You can add an SLO function to an application **Sign out** button, Then, clients are redirected to the Microsoft Entra SAML or BIG-IP sign out endpoint. To locate the SAML sign out endpoint URL for your tenant, go to **App Registrations > Endpoints**.

If you can't change the app, enable the BIG-IP to listen for the application sign out call and trigger SLO. 

Learn more: 

* [PeopleSoft Single Logout](./f5-big-ip-oracle-peoplesoft-easy-button.md#peoplesoft-single-logout)
* Go to support.f5.com for:
  * [K42052145: Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145)
  * [K12056: Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056).

## Deploy

Deployment provides a breakdown of your configurations. 

1. To commit settings, select **Deploy**.
2. Verify the application in your tenant list of Enterprise applications.
3. The application is published and accessible via SHA, with its URL, or on Microsoft application portals. 

## Test

1. From a browser, connect to the application external URL or select the application icon on [My Apps](https://myapplications.microsoft.com/). 
2. Authenticate to Microsoft Entra ID.
3. You’re redirected to the BIG-IP virtual server for the application and signed in with SSO.

The following screenshot is injected headers output from the header-based application.

   ![Screenshot of UPN, employee ID, and event roles under Server Variables.](./media/f5-big-ip-easy-button-ldap/app-view.png)

   > [!NOTE]
   > You can block direct access to the application, thereby enforcing a path through the BIG-IP.

## Advanced deployment

For some scenarios, Guided Configuration templates lack flexibility. 

Learn more: [Tutorial: Configure F5 BIG-IP Access Policy Manager for header-based SSO](./f5-big-ip-header-advanced.md).

In BIG-IP, you can disable the Guided Configuration strict management mode. Then, manually change configurations, however most configurations are automated with wizard templates.

1. To disable strict mode, navigate to **Access > Guided Configuration**.
2. On the row for the application configuration, select the **padlock** icon. 
3. BIG-IP objects associated with the published instance of the application are unlocked for management. Changes with the wizard are no longer possible.

   ![Screenshot of the padlock icon.](./media/f5-big-ip-oracle/strict-mode-padlock.png)

   > [!NOTE] 
   > If you re-enable strict mode and deploy a configuration, the action overwrites settings not in the Guided Configuration. We recommend the advanced configuration for production services.

## Troubleshooting

Use the following guidance when troubleshooting. 

### Log verbosity

BIG-IP logs help isolate issues with connectivity, SSO, policy, or misconfigured variable mappings. To troubleshoot, increase the log verbosity.

1. Navigate to **Access Policy > Overview**.
2. Select **Event Logs**.
3. Select **Settings**.
4. Select the row of your published application
5. Select **Edit**.
6. Select **Access System Logs**.
7. From the SSO list, select **Debug**.
8. Select **OK**.
9. Reproduce the issue.
10. Inspect the logs. 

   > [!NOTE]
   > Revert this feature when finished. Verbose mode generates excessive data. 

### BIG-IP error message

If a BIG-IP error message appears after Microsoft Entra preauthentication, the issue might relate to Microsoft Entra ID-to-BIG-IP SSO.

1. Navigate to **Access Policy > Overview**.
2. Select **Access reports**.
3. Run the report for the last hour.
4. Review the logs for clues. 

Use the **View session** variables link, for the session, to help understand if the APM receives expected Microsoft Entra claims.

### No BIG-IP error message

If no BIG-IP error message appears, the issue might be related to the back-end request, or BIG-IP-to-application SSO.

1. Navigate to **Access Policy > Overview**.
2. Select **Active Sessions**.
3. Select the active session link.

Use the **View Variables** link to help determine SSO issues, particularly if the BIG-IP APM doesn't obtain correct attributes.

Learn more:

* [Configuring LDAP remote authentication for Active Directory](https://support.f5.com/csp/article/K11072)
* Go to techdocs.f5.com for [Manual Chapter: LDAP Query](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/5.html)
