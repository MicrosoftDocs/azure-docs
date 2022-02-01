---
title: Configure F5 BIG-IP Easy Button for SSO to Oracle EBS
description: learn to implement Secure Hybrid Access with header-based single sign-on to Oracle Enterprise Business Suite using F5’s BIG-IP Easy Button Guided Configuration
services: active-directory
author: NishthaBabith-V
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 1/31/2022
ms.author: v-nisba
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5’s BIG-IP Easy Button for SSO to Oracle EBS

In this article, you’ll learn to implement Secure Hybrid Access (SHA) with header-based single sign-on (SSO) to Oracle EBS (Enterprise Business Suite) using F5’s BIG-IP Easy Button Guided Configuration.

Enabling BIG-IP published services for Azure Active Directory (Azure AD) SSO provides many benefits, including:

* [Improved Zero Trust governance](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/) through Azure AD pre-authentication and [Conditional Access](/conditional-access/overview)

* Full SSO between Azure AD and BIG-IP published services

* Manage Identities and access from a single control plane, [the Azure portal](https://portal.azure.com/)

To learn about all the benefits, see the article on [F5 BIG-IP and Azure AD integration](http://f5-aad-integration.md/) and and [what is application access and single sign-on with Azure AD](/azure/active-directory/active-directory-appssoaccess-whatis).

## Scenario description

For this scenario, we have an **Oracle EBS application using HTTP authorization headers** to manage access to protected content.

Being legacy, the application lacks modern protocols to support a direct integration with Azure AD. Modernizing the app would be ideal, but is costly, requires careful planning, and introduces risk of potential impact of downtime. Instead, an F5 BIG-IP Application Delivery Controller will be used to bridge the gap between the legacy application and the modern ID control plane, through protocol transitioning.

Having a BIG-IP in front of the application enables us to overlay the service with Azure AD pre-authentication and header-based SSO, significantly improving the overall security posture of the application for both remote and local access.

## Scenario architecture

The secure hybrid access solution for this scenario is made up of several components including a multi-tiered Oracle architecture:

**Oracle EBS Application:** BIG-IP published service to be protected by Azure AD SHA.

**Azure AD:** Security Assertion Markup Language (SAML) Identity Provider (IdP) responsible for verification of user credentials, Conditional Access (CA), and SSO to the BIG-IP.

**Oracle Internet Directory (OID):** Hosts the user DB that the BIG-IP will query via LDAP for authorization attributes. 

**Oracle AccessGate:** Validates authorization attributes through back channel with OID service, before issuing EBS access cookies 

**BIG-IP:** Reverse proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing header-based SSO to the Oracle service.

SHA for this scenario supports both SP and IdP initiated flows. The following illustrates the SP initiated flow.

![Secure hybrid access - SP initiated flow](./media/f5-big-ip-easy-button-oracle-ebs/sp-initiated-flow.png)

| Steps| Description |
| -------- |-------|
| 1| User connects to application endpoint (BIG-IP) |
| 2| BIG-IP APM access policy redirects user to Azure AD (SAML IdP) |
| 3| Azure AD pre-authenticates user and applies any enforced Conditional Access policies |
| 4| User is redirected back to BIG-IP with issued token and claims |
| 5| BIG-IP authenticates user and performs LDAP query for user Unique ID (UID) attribute |
| 6| BIG-IP injects returned UID attribute as user_orclguid header in EBS session cookie request to Oracle AccessGate |
| 7| Oracle AccessGate validates UID against Oracle Internet Directory (OID) service and issues EBS access cookie
| 8| EBS user headers and cookie sent to application and returns the payload to the user |

## Prerequisites

Prior BIG-IP experience isn’t necessary, but you’ll need:

* An Azure AD free subscription or above

* An existing BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in Azure](https://microsoft.sharepoint.com/teams/CxPIdentityDocumentation/Shared Documents/SHA/F5-docs/Headers/Oracle EBS/f5-bigip-deployment-guide.md)

* Any of the following F5 BIG-IP license SKUs

–F5 BIG-IP® Best bundle

–F5 BIG-IP Access Policy Manager™ (APM) standalone license

–F5 BIG-IP Access Policy Manager™ (APM) add-on license on an existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

–90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php).

* User identities [synchronized](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-whatis) from an on-premises directory to Azure AD or created directly within Azure AD and flowed back to your on-premises directory

 

* An account with Azure AD application admin [permissions](https://microsoft.sharepoint.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles)

* An [SSL certificate](https://microsoft.sharepoint.com/teams/CxPIdentityDocumentation/Shared Documents/SHA/F5-docs/Headers/Oracle EBS/f5-bigip-deployment-guide.md) for publishing services over HTTPS

* An existing Oracle EBS suite including Oracle AccessGate and an LDAP enabled OID (Oracle Internet Database) .

## BIG-IP configuration methods

There are many methods to configure BIG-IP for this scenario, including two template-based options and an advanced configuration. This tutorial covers the latest Guided Configuration 16.1 offering an Easy button template. With the **Easy Button**, admins no longer go back and forth between Azure AD and a BIG-IP to enable services for SHA. The end-to-end deployment and policy management of applications is handled directly between the APM’s Guided Configuration wizard and Microsoft Graph. This rich integration between BIG-IP APM and Azure AD ensures applications can quickly, easily support identity federation, SSO, and Azure AD Conditional Access, reducing administrative overhead.

[!NOTE] All example strings or values referenced throughout this guide should be replaced with those for your actual environment.

## Register Easy Button

Before a client or service can access Microsoft Graph, it must be [trusted by the Microsoft identity platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app). 

The Easy Button client must also be registered in Azure AD, before it is allowed to establish a trust between each SAML SP instance of a BIG-IP published application, and Azure AD as the SAML IdP.

1.Sign-in to the [Azure AD portal](https://portal.azure.com/) using an account with Application Administrative rights

2.From the left navigation pane, select the **Azure Active Directory** service

3.Under Manage, select **App registrations > New registration**

4.Enter a display name for your application. For example, F5 BIG-IP Easy Button

5.Specify who can use the application > **Accounts in this organizational directory only**

6.Select **Register** to complete the initial app registration

7.Navigate to** API permissions** and authorize the following Microsoft Graph permissions:

 

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

 

8.Grant admin consent for your organization

9.In the **Certificates & Secrets** blade, generate a new **Client secret** and note it down

10.From the **Overview** blade, note the **Client ID** and **Tenant ID**

## Configure Easy Button

Initiate **Easy Button** configuration to setup a SAML Service Provider (SP) and Azure AD as an Identity Provider (IdP) for your application.

1.Navigate to **Access > Guided Configuration > Microsoft Integration** and select **Azure AD Application**.

![Screenshot for Configure Easy Button- Install the template](Static/Oracle_EBS_image1.png)

![ Screenshot for Configure Easy Button- Install the template ./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

 

2.Review the list of configuration steps and select **Next**

![Screenshot for Configure Easy Button - List configuration steps](Static/Oracle_EBS_image2.png) ![Screenshot for Configure Easy Button - List configuration steps](./media/f5-big-ip-easy-button-ldap/config-steps.png)

3.Follow the sequence of steps required to publish your application.

![Configuration steps flow](Static/Oracle_EBS_image3.png) ![Configuration steps flow](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png)

### Configuration Properties

These are general and service account properties. The **Configuration Properties** tab creates up a new application config and SSO object that will be managed through the BIG-IP’s Guided Configuration UI. This configuration can then be reused for publishing more applications through the Easy Button template.

Consider the **Azure Service Account Details** be the BIG-IP client application you registered in your Azure AD tenant earlier. This section allows the BIG-IP to programmatically register a SAML application directly in your tenant, along with the other properties you would normally configure manually in the portal. Easy Button will do this for every BIG-IP APM service being published and enabled for SHA.

1.Provide a unique **Configuration Name** that enables an admin to easily distinguish between Easy Button configurations

2.Enable **Single Sign-On (SSO) & HTTP Headers**

3.Enter the **Tenant Id, Client ID**, and **Client Secret ** you noted down from your registered application

4.Confirm that BIG-IP can successfully connect to your tenant and select **Next**

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image4.png)![ Screenshot for Configuration General and Service Account properties](./media/f5-big-ip-easy-button-oracle-ebs/ configuration-general-and-service-account-properties.png)

### Service Provider

The **Service Provider** settings define the SAML SP properties for the APM instance representing the application protected through SHA.

1.Enter **Host**. This is the public FQDN of the application being secured. You’ll need a corresponding DNS record for clients to resolve this address, but using a localhost record is fine during testing

2.Enter **Entity ID**. This is the identifier Azure AD will use to identify the SAML SP requesting a token

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image5.png)![ Screenshot for Service Provider settings](./media/f5-big-ip-easy-button-oracle-ebs/service-provider-settings.png)

 

The optional **Security Settings** specify whether Azure AD should encrypt issued SAML assertions. Encrypting assertions between Azure AD and the BIG-IP APM provides additional assurance that the content tokens can’t be intercepted, and personal or corporate data be compromised.

3.From the **Assertion Decryption Private Key** list, select **Create New**

![Graphical user interface, text, application

Description automatically generated](Static/Oracle_EBS_image6.png)

![ Screenshot for Configure Easy Button- Create New import](./media/f5-big-ip-easy-button-oracle-ebs/ configure-security-create-new.png)

 

4.Select **OK**. This opens the **Import SSL Certificate and Keys** dialog in a new tab 

5.Select **PKCS 12 (IIS) ** to import your certificate and private key. Once provisioned close the browser tab to return to the main tab.

 

![Screenshot for Configure Easy Button- Import SSL certificates and keys](Static/Oracle_EBS_image7.png)

![Screenshot for Configure Easy Button- Import new cert](./media/ f5-big-ip-easy-button-oracle-ebs / import-ssl-certificates-and-keys.png)

6.Check **Enable Encrypted Assertion**

7.If you have enabled encryption, select your certificate from the **Assertion Decryption Private Key** list. This is the private key for the certificate that BIG-IP APM will use to decrypt Azure AD assertions

8.If you have enabled encryption, select your certificate from the **Assertion Decryption Certificate** list. This is the certificate that BIG-IP will upload to Azure AD for encrypting the issued SAML assertions.

![Screenshot for Service Provider security settings](Static/Oracle_EBS_image8.png)![Screenshot for Service Provider security settings](./media f5-big-ip-easy-button-ldap/ service-provider-security-settings.png)

 

### Azure Active Directory

This section defines all properties that you would normally use to manually configure a new BIG-IP SAML application within your Azure AD tenant.

The Easy Button wizard provides a set of pre-defined application templates for Oracle PeopleSoft, Oracle E-business Suite, Oracle JD Edwards, SAP ERP as well as generic SHA template for any other apps. 

In this example, select **Oracle E-Business Suite > Add**. This adds the template for the Oracle E-business Suite

![Graphical user interface, application, Teams

Description automatically generated](Static/Oracle_EBS_image9.png)

![ Screenshot for Azure configuration add BIG-IP application](./media/ f5-big-ip-easy-button-oracle-ebs /azure-configuration-add-big-ip-application.png)

#### Azure Configuration

1.Enter **Display Name** of app that the BIG-IP creates in your Azure AD tenant, and the icon that the users will see on [MyApps portal](https://myapplications.microsoft.com/)

2.In the **Sign On URL (optional) ** enter the public FQDN of the EBS application being secured, along with the default path for the Oracle EBS homepage

![Graphical user interface, text, application, email

Description automatically generated](Static/Oracle_EBS_image10.png)

![ Screenshot for Azure configuration add display info](./media/ f5-big-ip-easy-button-oracle-ebs / azure-configuration-add-display-info)

3.Select the refresh icon next to the **Signing Key** and **Signing Certificate** to locate the certificate you imported earlier

4.Enter the certificate’s password in **Signing Key Passphrase**

5.Enable **Signing Option** (optional). This ensures that BIG-IP only accepts tokens and claims that are signed by Azure AD

![Graphical user interface, text, application, email

Description automatically generated](Static/Oracle_EBS_image11.png) 

![ Screenshot for Azure configuration - Add signing certificates info](./media f5-big-ip-easy-button-ldap/ service-provider-security-settings.png)

6.**User and User Groups** are used to authorize access to the application. They are dynamically added from the tenant. **Add** a user or group that you can use later for testing, otherwise all access will be denied

![Graphical user interface, text, application, email

Description automatically generated](Static/Oracle_EBS_image12.png)

![ Screenshot for Azure configuration - Add users and groups](./media f5-big-ip-easy-button-ldap/ azure-configuration-add-user-groups.png)

 

 

#### User Attributes & Claims

When a user successfully authenticates, Azure AD issues a SAML token with a default set of claims and attributes uniquely identifying the user. The **User Attributes & Claims** tab shows the default claims to issue for the new application. It also lets you configure more claims.

![Graphical user interface, text, application, email

Description automatically generated](Static/Oracle_EBS_image13.png) 

![ Screenshot for Azure configuration – User attributes & claims](./media f5-big-ip-easy-button-ldap/ user-attributes-claims.png)

You can include additional Azure AD attributes if necessary, but our example PeopleSoft scenario only requires the default attributes.

#### Additional User Attributes

The **Additional User Attributes** tab can support a variety of distributed systems requiring attributes stored in other directories, for session augmentation. Attributes fetched from an LDAP source can then be injected as additional SSO headers to further control access based on roles, Partner IDs, etc.

1.Enable the **Advanced Settings** option

2.Check the **LDAP Attributes** check box

3.Select **Create New** in **Choose Authentication Server**

4.Select **Use pool** or **Direct** server connection mode depending on your setup. This provides the **Server Address** of the target LDAP service. If using a single LDAP server, select **Direct**.

5.Enter **Service Port** as 3060 (Default), 3161 (Secure), or any other port your Oracle LDAP service operates on

6.Enter the **Base Search DN** (distinguished name) from which to search. This search DN is used to search groups across a whole directory.

7.Set the **Admin DN** to the exact distinguished name for the account the APM will use to authenticate for LDAP queries, along with its password

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image14.png)

![ Screenshot for additional user attributes](./media/ f5-big-ip-easy-button-oracle-ebs / additional-user-attributes.png)

 

8.Leave all default **LDAP Schema Attributes**

![Graphical user interface, text, application, email

Description automatically generated](Static/Oracle_EBS_image15.png)

![ Screenshot for LDAP schema attributes](./media/ f5-big-ip-easy-button-oracle-ebs / ldap-schema-attributes.png)

5.Under **LDAP Query Properties**, set the **Search Dn** to the base node of the LDAP server from which to search for user objects 

6.Add the name of the user object attribute that must be returned from the LDAP directory. For EBS, the default is **orclguid**

![Graphical user interface, text, application

Description automatically generated](Static/Oracle_EBS_image16.png)

![ Screenshot for LDAP query properties.png](./media/ f5-big-ip-easy-button-oracle-ebs / ldap-query-properties.png)

#### Conditional Access Policy

CA policies are enforced post Azure AD pre-authentication, to control access based on device, application, location, and risk signals.

The **Available Policies** view, by default, will list all CA policies that do not include user-based actions.

The **Selected Policies** view, by default, displays all policies targeting All cloud apps. These policies cannot be deselected or moved to the Available Policies list as they are enforced at a tenant level.

To select a policy to be applied to the application being published:

1.Select the desired policy in the **Available Policies** list

2.Select the right arrow and move it to the **Selected Policies** list

Selected policies should either have an **Include** or **Exclude** option checked. If both options are checked, the selected policy is not enforced.

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image17.png) 

![ Screenshot for CA policies](./media f5-big-ip-easy-button-ldap/ conditional-access-policy.png)

[!NOTE] The policy list is enumerated only once when first switching to this tab. A refresh button is available to manually force the wizard to query your tenant, but this button is displayed only when the application has been deployed.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for client requests to the application. Any received traffic is processed and evaluated against the APM profile associated with the virtual server, before being directed according to the policy results and settings.

3.Enter **Destination Address**. This is any available IPv4/IPv6 address that the BIG-IP can use to receive client traffic. A corresponding record should also exist in DNS, enabling clients to resolve the external URL of your BIG-IP published application to this IP.

1.Enter **Service Port** as *443* for HTTPS

2.Check **Enable Redirect Port** and then enter **Redirect Port**. It redirects incoming HTTP client traffic to HTTPS

3.Select **Client SSL Profile** to enable the virtual server for HTTPS so that client connections are encrypted over TLS. Select the client SSL profile you created as part of the prerequisites or leave the default if testing

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image18.png)

![ Screenshot for Virtual server](./media f5-big-ip-easy-button-ldap/virtual-server.png)

 

### Pool Properties

The **Application Pool tab** details the services behind a BIG-IP, represented as a pool containing one or more application servers.

1.Choose from **Select a Pool**. Create a new pool or select an existing one

2.Choose the **Load Balancing Method** as *Round Robin*

3.Update the **Pool Servers**. Select an existing node or specify an IP and port for the servers hosting the Oracle EBS application.

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image19.png) 

![ Screenshot for Application pool](./media f5-big-ip-easy-button-ldap/ application-pool.png)

4.The **Access Gate Pool** specifies the servers Oracle EBS uses for mapping an SSO authenticated user to an Oracle E-Business Suite session. Update **Pool Servers** with the IP and port for of the Oracle application servers hosting the application

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image20.png) 

![ Screenshot for AccessGate pool](./media/ f5-big-ip-easy-button-oracle-ebs /accessgate-pool.png)

#### Single Sign-On & HTTP Headers

The **Easy Button wizard** supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO to published applications. As the PeopleSoft application expects headers, enable **HTTP Headers** and enter the following properties.

•**Header Operation: ** replace

•**Header Name: ** USER_NAME

•**Header Value: ** %{session.sso.token.last.username}

 

•**Header Operation: ** replace

•**Header Name: ** USER_ORCLGUID

•**Header Value: ** %{session.ldap.last.attr.orclguid}

![Graphical user interface, application

Description automatically generated](Static/Oracle_EBS_image21.png) 

![ Screenshot for SSO and HTTP headers](./media/ f5-big-ip-easy-button-oracle-ebs / sso-and-http-headers.png)

[!NOTE] APM session variables defined within curly brackets are CASE sensitive. If you enter OrclGUID when the Azure AD attribute name is being defined as orclguid, it will cause an attribute mapping failure.

### Session Management

The BIG-IPs session management settings are used to define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and corresponding user info. Consult [F5 documentation](https://support.f5.com/csp/article/K18390492) for details on these settings.

What isn’t covered however is Single Log-Out (SLO) functionality, which ensures all sessions between the IdP, the BIG-IP, and the user agent are terminated as users log off.

When the Easy Button deploys a SAML application to your Azure AD tenant, it also populates the Logout Url with the APM’s SLO endpoint. That way IdP initiated sign-outs from the Azure AD MyApps portal also terminate the session between the BIG-IP and a client.

During deployment, the SAML federation metadata for the published application is imported from your tenant, providing the APM the SAML logout endpoint for Azure AD. This helps SP initiated sign-outs terminate the session between a client and Azure AD. 

## Summary

Select **Deploy** to commit all settings and verify that the application has appeared in your tenant. This last step provides breakdown of all applied settings before they’re committed.

Your application should now be published and accessible via SHA, either directly via its URL or through Microsoft’s application portals.

## Next steps

From a browser, connect to the **PeopleSoft application’s external URL** or select the application’s icon in the [Microsoft MyApps portal](https://myapps.microsoft.com/). After authenticating to Azure AD, you’ll be redirected to the BIG-IP virtual server for the application and automatically signed in through SSO.

For increased security, organizations using this pattern could also consider blocking all direct access to the application, thereby forcing a strict path through the BIG-IP.

## Advanced deployment

There may be cases where the Guided Configuration templates lacks the flexibility to achieve more specific requirements. For those scenarios, see [Advanced Configuration for kerberos-based SSO](./f5-big-ip-kerberos-advanced.md).

Alternatively, the BIG-IP gives the option to disable **Guided Configuration’s strict management mode**. This allows you to manually tweak your configurations, even though bulk of your configurations are automated through the wizard-based templates.

You can navigate to **Access > Guided Configuration** and select the **small padlock icon** on the far right of the row for your applications’ configs. 

![A picture containing text, screenshot

Description automatically generated](Static/Oracle_EBS_image22.png)

![Screenshot for Configure Easy Button - Strict Management](./media/f5-big-ip-easy-button-oracle-ebs/ strict-mode-padlock.png)

At that point, changes via the wizard UI are no longer possible, but all BIG-IP objects associated with the published instance of the application will be unlocked for direct management.

[!NOTE] Re-enabling strict mode and deploying a configuration will overwrite any settings performed outside of the Guided Configuration UI, therefore we recommend the advanced configuration method for production services.

## Troubleshooting

There can be many factors leading to failure to access a published application. BIG-IP logging can help quickly isolate all sorts of issues with connectivity, policy violations, or misconfigured variable mappings. 

Start troubleshooting by increasing the log verbosity level.

1.Navigate to **Access Policy > Overview > Event Logs > Settings**

2.Select the row for your published application then **Edit > Access System Logs**

3.Select **Debug** from the SSO list then **OK**

Reproduce your issue, then inspect the logs, but remember to switch this back when finished as verbose mode generates lots of data. If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it’s possible the issue relates to SSO from Azure AD to the BIG-IP.

1.Navigate to **Access > Overview > Access reports**

2.Run the report for the last hour to see logs provide any clues. The **View session** variables link for your session will also help understand if the APM is receiving the expected claims from Azure AD

If you don’t see a BIG-IP error page, then the issue is probably more related to the backend request or SSO from the BIG-IP to the application.

1.In which case you should head to **Access Policy > Overview > Active Sessions** and select the link for your active session

2.The **View Variables** link in this location may also help root cause SSO issues, particularly if the BIG-IP APM fails to obtain the right attributes

See [BIG-IP APM variable assign examples](https://devcentral.f5.com/s/articles/apm-variable-assign-examples-1107) and [F5 BIG-IP session variables reference](https://techdocs.f5.com/en-us/bigip-15-0-0/big-ip-access-policy-manager-visual-policy-editor/session-variables.html) for more info.

The following command from a bash shell validates the APM service account used for LDAP queries and can successfully authenticate and query a user object:

ldapsearch -xLLL -H 'ldap://192.168.0.58' -b "CN=oraclef5,dc=contoso,dc=lds" -s sub -D "CN=f5-apm,CN=partners,DC=contoso,DC=lds" -w 'P@55w0rd!' "(cn=testuser)"

For more information, visit this F5 knowledge article [Configuring LDAP remote authentication for Active Directory](https://support.f5.com/csp/article/K11072). There’s also a great BIG-IP reference table to help diagnose LDAP-related issues in this F5 knowledge article on [LDAP Query](https://techdocs.f5.com/en-us/bigip-16-1-0/big-ip-access-policy-manager-authentication-methods/ldap-query.html).
