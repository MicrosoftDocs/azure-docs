---
title: Configure F5 BIG-IP Easy Button for SSO to Oracle EBS
description: Learn to implement SHA with header-based SSO to Oracle EBS using F5 BIG-IP Easy Button Guided Configuration
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 03/22/2023
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5 BIG-IP Easy Button for SSO to Oracle EBS

Learn to secure Oracle Enterprise Business Suite (EBS) using Azure Active Directory (Azure AD), with F5 BIG-IP Easy Button Guided Configuration. Integrating a BIG-IP with Azure AD has many benefits:

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

This scenario covers the classic Oracle EBS application that uses HTTP authorization headers to manage access to protected content.

Legacy applications lack modern protocols to support Azure AD integration. Modernization is costly, time consuming, and introduces downtime risk. Instead, use an F5 BIG-IP Application Delivery Controller (ADC) to bridge the gap between legacy applications and the modern ID control plane, with protocol transitioning.

A BIG-IP in front of the app enables overlay of the service with Azure AD preauthentication and header-based SSO. This configuration improve application security posture.

## Scenario architecture

The secure hybrid access (SHA) solution has the following components:

* **Oracle EBS application** - BIG-IP published service to be protected by Azure AD SHA
* **Azure AD**  - Security Assertion Markup Language (SAML) identity provider (IdP) that verifies user credentials, Conditional Access, and SAML-based SSO to the BIG-IP
  * With SSO, Azure AD provides BIG-IP session attributes
* **Oracle Internet Directory (OID)** - hosts the user database
  * BIG-IP verifies authorization attributes with LDAP
* **Oracle E-Business Suite AccessGate** - before issuing EBS access cookies, it validates authorization attributes with the OID service
* **BIG-IP** - reverse-proxy and SAML service provider (SP) to the application 
  * Before header-based SSO to the Oracle application, authentication is delegated to the SAML IdP

SHA supports SP- and IdP-initiated flows. The following diagram illustrates the SP-initiated flow.

   ![Diagram of secure hybrid access, based on the SP-initiated flow.](./media/f5-big-ip-oracle/sp-initiated-flow.png)

1. User connects to application endpoint (BIG-IP).
2. BIG-IP APM access policy redirects user to Azure AD (SAML IdP).
3. Azure AD preauthenticates user and applies Conditional Access policies.
4. User is redirected to BIG-IP (SAML SP) and SSO occurs using the issued SAML token.
5. BIG-IP performs an LDAP query for the user Unique ID (UID) attribute.
6. BIG-IP injects returned UID attribute as user_orclguid header in EBS session cookie request to Oracle AccessGate.
7. Oracle AccessGate validates UID against OID service and issues EBS access cookie.
8. EBS user headers and cookie sent to application and returns the payload to the user.

## Prerequisites

You need the following components:

* An Azure subscription
  * If you don't have one, get an [Azure free account](https://azure.microsoft.com/free/)
* For the account, have Azure AD Application Administrator permissions
* A BIG-IP or deploy a BIG-IP Virtual Edition (VE) in Azure
  * See, [Deploy F5 BIG-IP Virtual Edition VM in Azure](./f5-bigip-deployment-guide.md)
* Any of the following F5 BIG-IP license SKUs:
  * F5 BIG-IP® Best bundle
  * F5 BIG-IP Access Policy Manager™ (APM) standalone license
  * F5 BIG-IP Access Policy Manager™ (APM) add-on license on a BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)
  * 90-day BIG-IP full feature trial. See, [Free Trials](https://www.f5.com/trial/big-ip-trial.php).
* User identities synchronized from an on-premises directory to Azure AD
  * See, [Azure AD Connect sync: Understand and customize synchronization](../hybrid/how-to-connect-sync-whatis.md)
* An SSL certificate to publish services over HTTPS, or use default certificates while testing
  * See, [SSL profile](./f5-bigip-deployment-guide.md#ssl-profile)
* An Oracle EBS Suite, Oracle AccessGate, and an LDAP-enabled Oracle Internet Database (OID)

## BIG-IP configuration method

This tutorial uses the Guided Configuration v16.1 Easy Button template. With the Easy Button, admins no longer go back and forth to enable services for SHA. The deployment and policy management is handled by the APM Guided Configuration wizard and Microsoft Graph. This integration ensures applications support identity federation, SSO, and Conditional Access, thus reducing administrative overhead.

   >[!NOTE] 
  > Replace example strings or values with those in your environment.

## Register the Easy Button

Before a client or service accesses Microsoft Graph, the Microsoft identity platform must trust it.

Learn more: [Quickstart: Register an application with the Microsoft identity platform](../develop/quickstart-register-app.md)

Create a tenant app registration to authorize the Easy Button access to Graph. The BIG-IP pushes configurations to establish a trust between a SAML SP instance for published application, and Azure AD as the SAML IdP.

1. Sign in to the [Azure portal](https://portal.azure.com/) with Application Administrative permissions.
2. In the left navigation pane, select the **Azure Active Directory** service.
3. Under **Manage**, select **App registrations > New registration**.
4. Enter an application **Name**. For example, F5 BIG-IP Easy Button.
5. Specify who can use the application > **Accounts in this organizational directory only**.
6. Select **Register**.
7. Navigate to **API permissions**.
8. Authorize the following Microsoft Graph **Application permissions**:

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

9. Grant admin consent for your organization.
10. Go to **Certificates & Secrets**.
11. Generate a new **Client Secret**. Make a note of the Client Secret.
12. Go to **Overview**. Make a note of the Client ID and Tenant ID.

## Configure the Easy Button

1. Initiate the APM **Guided Configuration**.
2. Start the **Easy Button** template.
3. Navigate to **Access > Guided Configuration > Microsoft Integration**.
4. Select **Azure AD Application**.

   ![Screenshot of the Azure AD Application option.](./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

5. Review the configuration options.
6. Select **Next**.

   ![Screenshot of configuration options and the Next option.](./media/f5-big-ip-easy-button-ldap/config-steps.png)

7. Use the graphic to help publish your application.

   ![Screenshot of graphic indicating configuration areas.](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png#lightbox)

### Configuration Properties

The **Configuration Properties** tab creates a BIG-IP application config and SSO object. The **Azure Service Account Details** section represents the client you registered in your Azure AD tenant, as an application. With these settings a BIG-IP OAuth client registers a SAML SP in your tenant, with SSO properties. Easy Button does this action for BIG-IP services published and enabled for SHA.

To reduce time and effort, reuse global settings to publish other applications.

1. Enter a **Configuration Name**.
2. For **Single Sign-On (SSO) & HTTP Headers**, select **On**.
3. For **Tenant ID, Client ID**, and **Client Secret** enter what you noted during Easy Button client registration.
4. Confirm the BIG-IP connects to your tenant.
5. Select **Next**.

   ![ Screenshot of input on the Configuration Properties dialog.](./media/f5-big-ip-oracle/configuration-general-and-service-account-properties.png)

### Service Provider

Use Service Provider settings for the properties of the SAML SP instance of the protected application.

1. For **Host**, enter the public FQDN of the application.
2. For **Entity ID**, enter the identifier Azure AD uses for the SAML SP requesting a token.

   ![Screenshot for Service Provider input and options.](./media/f5-big-ip-oracle/service-provider-settings.png)

3. (Optional) In **Security Settings**, select or clear the **Enable Encrypted Assertion** option. Encrypting assertions between Azure AD and the BIG-IP APM means the content tokens can’t be intercepted, nor personal or corporate data compromised.
4. From the **Assertion Decryption Private Key** list, select **Create New**

   ![Screenshot of Create New options in the Assertion Decryption Private Key dropdown.](./media/f5-big-ip-oracle/configure-security-create-new.png)

5. Select **OK**. 
6. The **Import SSL Certificate and Keys** dialog appears in a new tab.
7. Select **PKCS 12 (IIS)**.
8. The certificate and private key are imported. 
9. Close the browser tab to return to the main tab.

   ![Screenshot of input for Import Type, Certificate and Key Name, and Password.](./media/f5-big-ip-oracle/import-ssl-certificates-and-keys.png)

6. Select **Enable Encrypted Assertion**.
7. For enabled encryption, from the **Assertion Decryption Private Key** list, select the certificate private key BIG-IP APM uses to decrypt Azure AD assertions.
8. For enabled encryption,from the **Assertion Decryption Certificate** list, select the certificate BIG-IP uploads to Azure AD to encrypt the issued SAML assertions.

   ![Screenshot of selected certificates for Assertion Decryption Private Key and Assertion Decryption Certificate.](./media/f5-big-ip-easy-button-ldap/service-provider-security-settings.png)

### Azure AD

Easy Button has application templates for Oracle PeopleSoft, Oracle E-business Suite, Oracle JD Edwards, SAP ERP as well as generic SHA template for any other apps. The following screenshot is the Oracle E-Business Suite option under Azure Configuration

1. Select **Oracle E-Business Suite**.
2. Select **Add**.

   ![Screenshot of the Oracle E-Business Suite option under Azure Configuration.](./media/f5-big-ip-oracle/azure-configuration-add-big-ip-application.png)

#### Azure Configuration

1. Enter a **Display Name** for the app BIG-IP creates in your Azure AD tenant, and the icon on the MyApps portal.
2. In **Sign On URL (optional)**, enter the EBS application public FQDN.
3. Enter the default path for the Oracle EBS homepage.

    ![Screenshot for Azure configuration add display info](./media/f5-big-ip-oracle/azure-configuration-add-display-info.png)

3. Next to the **Signing Key** and **Signing Certificate**, select the **refresh** icon.
4. Locate the certificate you imported.
5. In **Signing Key Passphrase**, enter the certificate password.
6. (Optional) Enable **Signing Option**. This ensures BIG-IP accepts tokens and claims signed by Azure AD.

    ![Screenshot of options and entries for Signing Key, Signing Certificate, and Signing Key Passphrase.](./media/f5-big-ip-easy-button-ldap/azure-configuration-sign-certificates.png)

7. For **User And User Groups**, add a user or group for testing, otherwise all access is denied. Users and user groups are dynamically queried from the Azure AD tenant and authorize access to the application. 

    ![Screenshot of the Add option under User And User Groups.](./media/f5-big-ip-easy-button-ldap/azure-configuration-add-user-groups.png)

#### User Attributes & Claims

When a user authenticates, Azure AD issues a SAML token with default claims and attributes identifying the user. The **User Attributes & Claims** tab has default claims to issue for the new application. Use this area to configure more claims. If needed, add Azure AD attributes, however the Oracle EBS scenario requires the default attributes.

   ![Screenshot of options and entries for User Attributes and Claims.](./media/f5-big-ip-kerberos-easy-button/user-attributes-claims.png)

#### Additional User Attributes

The **Additional User Attributes** tab supports distributed systems that require attributes stored in directories for session augmentation. Attributes fetched from an LDAP source are injected as more SSO headers to control access based on roles, partner ID, etc.

1. Enable the **Advanced Settings** option.
2. Check the **LDAP Attributes** check box.
3. In **Choose Authentication Server**, select **Create New**.
4. Depending on your setup, select **Use pool** or **Direct** server connection mode. This provides the target LDAP service server address. For a single LDAP server, select **Direct**.
5. For **Service Port**, enter **3060** (Default), **3161** (Secure), or another port for the Oracle LDAP service.
6. Enter a **Base Search DN**. Use the distinguished name (DN) to search for groups in a directory.
7. For **Admin DN** enter the account distinguished name APM uses to authenticate LDAP queries.
8. For **Admin Password**, enter the password.

   ![Screenshot of options and entries for Additional User Attributes.](./media/f5-big-ip-oracle/additional-user-attributes.png)

9. Leave the default **LDAP Schema Attributes**.

   ![Screenshot for LDAP schema attributes](./media/f5-big-ip-oracle/ldap-schema-attributes.png)

10. Under **LDAP Query Properties**, for **Search Dn** enter the LDAP server base node for user object search.
11. For **Required Attributes**, enter the user object attribute name to be returned from the LDAP directory. For EBS, the default is **orclguid**.

    ![Screenshot of entries and options for LDAP Query Properties](./media/f5-big-ip-oracle/ldap-query-properties.png)

#### Conditional Access Policy

Conditional Access policies control access based on device, application, location, and risk signals. Policies are enforced after Azure AD preauthentication. The Available Policies view has Conditional Access policies with no user actions. The Selected Policies view has policies for cloud apps. You can't deselect these policies or move them to Available Policies because they're enforced at the tenant level.

To select a policy for the application to be published:

1. In **Available Policies**, select a policy.
2. Select the **right arrow** and move it to **Selected Policies**.

> [!NOTE]
> The **Include** or **Exclude** option is selected for some policies. If both options are checked, the policy is unenforced.

   ![Screenshot of the Exclude option selected for four polices.](./media/f5-big-ip-easy-button-ldap/conditional-access-policy.png)

> [!NOTE]
> The policy list appears when you select the **Conditional Access Policy** tab. Use the **Refresh** button for the wizard to query your tenant. Refresh appears for deployed applications.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for application client requests. Received traffic is processed and evaluated against the APM profile associated with the virtual server. Then, traffic is directed according to policy.

1. Enter a **Destination Address**, an IPv4 or IPv6 address BIG-IP uses to receive client traffic. Ensure a corresponding record in DNS that enables clients to resolve the external URL, of the BIG-IP published application, to the IP. Use a test computer localhost DNS for testing.
3. For **Service Port**, enter **443**, and select **HTTPS**.
4. Select **Enable Redirect Port**.
5. For **Redirect Port**, enter **80**, and select **HTTP**. This action redirects incoming HTTP client traffic to HTTPS.
6. Select the **Client SSL Profile** you created, or leave the default for testing. Client SSL Profile enables the virtual server for HTTPS. Client connections are encrypted over TLS. 

   ![Screenshot of options and selections for Virtual Server Properties.](./media/f5-big-ip-easy-button-ldap/virtual-server.png)

### Pool Properties

The **Application Pool** tab has services behind a BIG-IP, a pool with one or more application servers.

1. From **Select a Pool**, select **Create New**, or select another option.
2. For **Load Balancing Method**, select **Round Robin**.
3. Under **Pool Servers**, select and enter an **IP Address/Node Name** and **Port** for the servers hosting Oracle EBS.
4. Select **HTTPS**.

   ![Screenshot of options and selections for Pool Properties](./media/f5-big-ip-oracle/application-pool.png)

4. Under **Access Gate Pool** confirm the **Access Gate Subpath**. 
5. For **Pool Servers** select and enter an **IP Address/Node Name** and **Port** for the servers hosting Oracle EBS.
6. Select **HTTPS**.

   ![Screenshot of options and entries for Access Gate Pool.](./media/f5-big-ip-oracle/accessgate-pool.png)

#### Single Sign-On & HTTP Headers

The Easy Button wizard supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO to published applications. The Oracle EBS application expects headers, enable HTTP headers.

1. On **Single Sign-On & HTTP Headers**, select **HTTP Headers**.
2. For **Header Operation**, select **replace**.
3. For **Header Name**, enter **USER_NAME**.
4. For **Header Value**, enter **%{session.sso.token.last.username}**.

* **Header Operation** replace
* **Header Name** USER_ORCLGUID
* **Header Value** %{session.ldap.last.attr.orclguid}

   ![ Screenshot for SSO and HTTP headers](./media/f5-big-ip-oracle/sso-and-http-headers.png)

>[!NOTE] 
>APM session variables defined within curly brackets are CASE sensitive. For example, if you enter OrclGUID when the Azure AD attribute name is being defined as orclguid, it will cause an attribute mapping failure

### Session Management

The BIG-IPs session management settings are used to define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and corresponding user info. Refer to [F5's docs](https://support.f5.com/csp/article/K18390492) for details on these settings.

What isn’t covered here however is Single Log-Out (SLO) functionality, which ensures all sessions between the IdP, the BIG-IP, and the user agent are terminated as users sign off. When the Easy Button instantiates a SAML application in your Azure AD tenant, it also populates the Logout Url with the APM’s SLO endpoint. That way IdP initiated sign-outs from the Azure AD MyApps portal also terminate the session between the BIG-IP and a client.

Along with this the SAML federation metadata for the published application is also imported from your tenant, providing the APM with the SAML logout endpoint for Azure AD. This ensures SP initiated sign outs terminate the session between a client and Azure AD. But for this to be truly effective, the APM needs to know exactly when a user signs-out of the application.

If the BIG-IP webtop portal is used to access published applications then a sign-out from there would be processed by the APM to also call the Azure AD sign-out endpoint. But consider a scenario where the BIG-IP webtop portal isn’t used, then the user has no way of instructing the APM to sign out. Even if the user signs-out of the application itself, the BIG-IP is technically oblivious to this. So for this reason, SP initiated sign-out needs careful consideration to ensure sessions are securely terminated when no longer required. One way of achieving this would be to add an SLO function to your applications sign out button, so that it can redirect your client to either the Azure AD SAML or BIG-IP sign-out endpoint. The URL for SAML sign-out endpoint for your tenant can be found in **App Registrations > Endpoints**.

If making a change to the app is a no go, then consider having the BIG-IP listen for the application's sign-out call, and upon detecting the request have it trigger SLO. Refer to our [Oracle PeopleSoft SLO guidance](./f5-big-ip-oracle-peoplesoft-easy-button.md#peoplesoft-single-logout) for using BIG-IP irules to achieve this. More details on using BIG-IP iRules to achieve this is available in the F5 knowledge article [Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145) and [Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056).

## Summary

This last step provides a breakdown of your configurations. Select **Deploy** to commit all settings and verify that the application now exists in your tenants list of ‘Enterprise applications.

## Next steps

From a browser, connect to the **Oracle EBS application’s external URL** or select the application’s icon in the [Microsoft MyApps portal](https://myapps.microsoft.com/). After authenticating to Azure AD, you’ll be redirected to the BIG-IP virtual server for the application and automatically signed in through SSO.

For increased security, organizations using this pattern could also consider blocking all direct access to the application, thereby forcing a strict path through the BIG-IP.

## Advanced deployment

There may be cases where the Guided Configuration templates lack the flexibility to achieve more specific requirements. For those scenarios, see [Advanced Configuration for headers-based SSO](./f5-big-ip-header-advanced.md). Alternatively, the BIG-IP gives the option to disable **Guided Configuration’s strict management mode**. This allows you to manually tweak your configurations, even though bulk of your configurations are automated through the wizard-based templates.

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

See [BIG-IP APM variable assign examples](https://devcentral.f5.com/s/articles/apm-variable-assign-examples-1107) and [F5 BIG-IP session variables reference](https://techdocs.f5.com/en-us/bigip-15-0-0/big-ip-access-policy-manager-visual-policy-editor/session-variables.html) for more info.

The following command from a bash shell validates the APM service account used for LDAP queries and can successfully authenticate and query a user object:

```ldapsearch -xLLL -H 'ldap://192.168.0.58' -b "CN=oraclef5,dc=contoso,dc=lds" -s sub -D "CN=f5-apm,CN=partners,DC=contoso,DC=lds" -w 'P@55w0rd!' "(cn=testuser)" ```

For more information, visit this F5 knowledge article [Configuring LDAP remote authentication for Active Directory](https://support.f5.com/csp/article/K11072). There’s also a great BIG-IP reference table to help diagnose LDAP-related issues in this [F5 knowledge article on LDAP Query](https://techdocs.f5.com/en-us/bigip-16-1-0/big-ip-access-policy-manager-authentication-methods/ldap-query.html).
