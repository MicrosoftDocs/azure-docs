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

This section defines all properties that you would normally use to manually configure a new BIG-IP SAML application within your Azure AD tenant. Easy Button provides a set of pre-defined application templates for Oracle PeopleSoft, Oracle E-business Suite, Oracle JD Edwards, SAP ERP as well as generic SHA template for any other apps. For this scenario select **Oracle E-Business Suite > Add**.

![Screenshot for Azure configuration add BIG-IP application](./media/f5-big-ip-oracle/azure-configuration-add-big-ip-application.png)

#### Azure Configuration

1. Enter **Display Name** of app that the BIG-IP creates in your Azure AD tenant, and the icon that the users see on [MyApps portal](https://myapplications.microsoft.com/)

2. In the **Sign On URL (optional)** enter the public FQDN of the EBS application being secured, along with the default path for the Oracle EBS homepage

    ![Screenshot for Azure configuration add display info](./media/f5-big-ip-oracle/azure-configuration-add-display-info.png)

3. Select the refresh icon next to the **Signing Key** and **Signing Certificate** to locate the certificate you imported earlier

4. Enter the certificate’s password in **Signing Key Passphrase**

5. Enable **Signing Option** (optional). This ensures that BIG-IP only accepts tokens and claims that are signed by Azure AD

    ![Screenshot for Azure configuration - Add signing certificates info](./media/f5-big-ip-easy-button-ldap/azure-configuration-sign-certificates.png)

6. **User and User Groups** are dynamically queried from your Azure AD tenant and used to authorize access to the application. Add a user or group that you can use later for testing, otherwise all access will be denied

    ![Screenshot for Azure configuration - Add users and groups](./media/f5-big-ip-easy-button-ldap/azure-configuration-add-user-groups.png)

#### User Attributes & Claims

When a user successfully authenticates, Azure AD issues a SAML token with a default set of claims and attributes uniquely identifying the user. The **User Attributes & Claims** tab shows the default claims to issue for the new application. It also lets you configure more claims.

   ![Screenshot for user attributes and claims](./media/f5-big-ip-kerberos-easy-button/user-attributes-claims.png)

You can include additional Azure AD attributes if necessary, but the Oracle EBS scenario only requires the default attributes.

#### Additional User Attributes

The **Additional User Attributes** tab can support a variety of distributed systems requiring attributes stored in other directories for session augmentation. Attributes fetched from an LDAP source can then be injected as additional SSO headers to further control access based on roles, Partner IDs, etc.

1. Enable the **Advanced Settings** option

2. Check the **LDAP Attributes** check box

3. Select **Create New** in **Choose Authentication Server**

4. Select **Use pool** or **Direct** server connection mode depending on your setup. This provides the **Server Address** of the target LDAP service. If using a single LDAP server, select **Direct**.

5. Enter **Service Port** as 3060 (Default), 3161 (Secure), or any other port your Oracle LDAP service operates on

6. Enter the **Base Search DN** (distinguished name) from which to search. This search DN is used to search groups across a whole directory.

7. Set the **Admin DN** to the exact distinguished name for the account the APM will use to authenticate for LDAP queries, along with its password

   ![Screenshot for additional user attributes](./media/f5-big-ip-oracle/additional-user-attributes.png)

8. Leave all default **LDAP Schema Attributes**

   ![Screenshot for LDAP schema attributes](./media/f5-big-ip-oracle/ldap-schema-attributes.png)

9. Under **LDAP Query Properties**, set the **Search Dn** to the base node of the LDAP server from which to search for user objects 

10. Add the name of the user object attribute that must be returned from the LDAP directory. For EBS, the default is **orclguid**

    ![Screenshot for LDAP query properties.png](./media/f5-big-ip-oracle/ldap-query-properties.png)

#### Conditional Access Policy

Conditional Access policies are enforced post Azure AD pre-authentication, to control access based on device, application, location, and risk signals.

The **Available Policies** view, by default, will list all Conditional Access policies that do not include user-based actions.

The **Selected Policies** view, by default, displays all policies targeting All cloud apps. These policies cannot be deselected or moved to the Available Policies list as they are enforced at a tenant level.

To select a policy to be applied to the application being published:

1. Select the desired policy in the **Available Policies** list

2. Select the right arrow and move it to the **Selected Policies** list

   The selected policies should either have an **Include** or **Exclude** option checked. If both options are checked, the policy is not enforced.

   ![Screenshot for CA policies](./media/f5-big-ip-easy-button-ldap/conditional-access-policy.png)

> [!NOTE]
> The policy list is enumerated only once when first switching to this tab. A refresh button is available to manually force the wizard to query your tenant, but this button is displayed only when the application has been deployed.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for client requests to the application. Any received traffic is processed and evaluated against the APM profile associated with the virtual server, before being directed according to the policy results and settings.

1. Enter **Destination Address**. This is any available IPv4/IPv6 address that the BIG-IP can use to receive client traffic. A corresponding record should also exist in DNS, enabling clients to resolve the external URL of your BIG-IP published application to this IP, instead of the appllication itself. Using a test PC's localhost DNS is fine for testing.

2. Enter **Service Port** as *443* for HTTPS

3. Check **Enable Redirect Port** and then enter **Redirect Port**. It redirects incoming HTTP client traffic to HTTPS

4. The Client SSL Profile enables the virtual server for HTTPS, so that client connections are encrypted over TLS. Select the **Client SSL Profile** you created as part of the prerequisites or leave the default whilst testing

   ![Screenshot for Virtual server](./media/f5-big-ip-easy-button-ldap/virtual-server.png)

### Pool Properties

The **Application Pool tab** details the services behind a BIG-IP, represented as a pool containing one or more application servers.

1. Choose from **Select a Pool**. Create a new pool or select an existing one

2. Choose the **Load Balancing Method** as *Round Robin*

3. For **Pool Servers** select an existing node or specify an IP and port for the servers hosting the Oracle EBS application.

   ![Screenshot for Application pool](./media/f5-big-ip-oracle/application-pool.png)

4. The **Access Gate Pool** specifies the servers Oracle EBS uses for mapping an SSO authenticated user to an Oracle E-Business Suite session. Update **Pool Servers** with the IP and port for of the Oracle application servers hosting the application

   ![Screenshot for AccessGate pool](./media/f5-big-ip-oracle/accessgate-pool.png)

#### Single Sign-On & HTTP Headers

The **Easy Button wizard** supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO to published applications. As the Oracle EBS application expects headers, enable **HTTP Headers** and enter the following properties.

* **Header Operation:** replace
* **Header Name:** USER_NAME
* **Header Value:** %{session.sso.token.last.username}

* **Header Operation:** replace
* **Header Name:** USER_ORCLGUID
* **Header Value:** %{session.ldap.last.attr.orclguid}

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
