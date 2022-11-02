---
title: Configure F5 BIG-IP Easy Button for Kerberos SSO
description: Learn to implement secure hybrid access (SHA) with Single Sign-on to Kerberos applications using F5’s BIG-IP Easy Button guided configuration.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 10/19/2022
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5 BIG-IP Easy Button for Kerberos single sign-on

In this article, learn to secure Kerberos-based applications with Azure Active Directory (Azure AD), through F5 BIG-IP Easy Button Guided Configuration 16.1.

Integrating a BIG-IP with Azure Active Directory (Azure AD) provides many benefits, including:

* Improved governance: See, [Zero Trust framework to enable remote work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/) and learn more about Azure AD pre-authentication. See also, [What is Conditional Access?](../conditional-access/overview.md) to learn about how it helps enforce organizational policies.
* Full SSO between Azure AD and BIG-IP published services
* Manage identities and access from a single control plane, the [Azure portal](https://portal.azure.com/)

To learn more about benefits, see the article on [F5 BIG-IP and Azure AD integration](./f5-aad-integration.md).

## Scenario description

This scenario is the classic, legacy application using Kerberos authentication, also known as Integrated Windows Authentication (IWA), to gate access to protected content.

Because it's legacy, the application lacks modern protocols to support direct integration with Azure AD. You can modernize the application, but it's costly, requires planning, and introduces risk of potential downtime. Instead, an F5 BIG-IP Application Delivery Controller (ADC) bridges the gap between the legacy application and the modern ID control plane, through protocol transitioning. 

A BIG-IP in front of the application enables overlay of the service with Azure AD pre-authentication and headers-based SSO, improving the security posture of the application.

> [!NOTE] 
> Organizations can gain remote access to this type of application with [Azure AD Application Proxy](../app-proxy/application-proxy.md)

## Scenario architecture

The secure hybrid access (SHA) solution for this scenario has the following components:

**Application:** BIG-IP published service to be protected by Azure AD SHA. The application host is domain-joined, therefore is integrated with Active Directory (AD).

**Azure AD:** Security Assertion Markup Language (SAML) Identity Provider (IdP) responsible for verifying user credentials, Conditional Access (CA), and SAML-based SSO to the BIG-IP. Through SSO, Azure AD provides BIG-IP with required session attributes.

**KDC:** Key Distribution Center (KDC) role on a Domain Controller (DC), issuing Kerberos tickets

**BIG-IP:** Reverse proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing Kerberos-based SSO to the back-end application.

SHA for this scenario supports SP- and IdP-initiated flows. The following image illustrates the SP flow.

   ![Scenario architecture](./media/f5-big-ip-kerberos-easy-button/scenario-architecture.png)

## User flow

1. User connects to application endpoint (BIG-IP).
2. BIG-IP APM access policy redirects user to Azure AD (SAML IdP).
3. Azure AD pre-authenticates user and applies any enforced Conditional Access policies.
4. User is redirected to BIG-IP (SAML SP) and SSO is performed using issued SAML token.
5. BIG-IP requests Kerberos ticket from KDC.
6. BIG-IP sends request to backend application, along with Kerberos ticket for SSO.
7. Application authorizes request and returns payload.

## Prerequisites

Prior BIG-IP experience isn’t necessary, but you need:

* An [Azure AD free](https://azure.microsoft.com/free/active-directory/) subscription or above

* A BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in Azure](./f5-bigip-deployment-guide.md)

* Any of the following F5 BIG-IP licenses

    * F5 BIG-IP® Best bundle

    * F5 BIG-IP APM standalone

    * F5 BIG-IP APM add-on license on a BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

    * 90-day BIG-IP [Free Trial](https://www.f5.com/trial/big-ip-trial.php) license

* User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md) from an on-premises directory to Azure AD, or created in Azure AD and flowed back to your on-premises directory

* An account with Azure AD Application admin [permissions](/azure/active-directory/users-groups-roles/directory-assign-admin-roles#application-administrator)

* An [SSL Web certificate](./f5-bigip-deployment-guide.md) for publishing services over HTTPS, or use default BIG-IP certificates while testing

* A Kerberos application, or go to active-directory-wp.com to learn to configure [SSO with IIS on Windows](https://active-directory-wp.com/docs/Networking/Single_Sign_On/SSO_with_IIS_on_Windows.html).

## BIG-IP configuration methods

This tutorial covers the latest Guided Configuration 16.1 with an Easy Button template. With the Easy Button, Admins no longer go back and forth between Azure AD and a BIG-IP to enable services for SHA. The deployment and policy management is handled by the APM Guided Configuration wizard and Microsoft Graph. This integration between BIG-IP APM and Azure AD ensures applications support identity federation, SSO, and Azure AD Conditional Access, reducing administrative overhead.

>[!NOTE] 
> Example strings or values in this guide should be replaced with those for your actual environment.

## Register Easy Button

Before a client or service can access Microsoft Graph, it must be trusted by the [Microsoft identity platform.](../develop/quickstart-register-app.md). This action creates a tenant app registration to authorize Easy Button access to Graph. Through these permissions, the BIG-IP pushes the configurations to establish a trust between a SAML SP instance for published application, and Azure AD as the SAML IdP.

1. Sign in to the [Azure AD portal](https://portal.azure.com/) using an account with Application Administrative rights.
2. From the left navigation pane, select the **Azure Active Directory** service.
3. Under Manage, select **App registrations > New registration**.
4. Enter a display name for your application. For example, F5 BIG-IP Easy Button.
5. Specify who can use the application > **Accounts in this organizational directory only**.
6. Select **Register**.
7. Navigate to **API permissions** and authorize the following Microsoft Graph **Application permissions**:

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
9. On **Certificates & Secrets**, generate a new client secret. Make a note of this secret.
10. From **Overview**, note the Client ID and Tenant ID.

## Configure Easy Button

Initiate the APM Guided Configuration to launch the Easy Button template.

1. Navigate to **Access > Guided Configuration > Microsoft Integration** and select **Azure AD Application**.

   ![Screenshot for Configure Easy Button- Install the template](./media/f5-big-ip-easy-button-ldap/easy-button-template.png)

2. Review the configuration steps and select **Next**

   ![Screenshot for Configure Easy Button - List configuration steps](./media/f5-big-ip-easy-button-ldap/config-steps.png)

3. Follow the steps to publish your application.

   ![Configuration steps flow](./media/f5-big-ip-easy-button-ldap/config-steps-flow.png#lightbox)

### Configuration Properties

The **Configuration Properties** tab creates a BIG-IP application config and SSO object. The **Azure Service Account Details** section can represent the client you registered in your Azure AD tenant earlier, as an application. These settings allow a BIG-IP's OAuth client to register a SAML SP in your tenant, with the SSO properties you configure manually. Easy Button does this action for every BIG-IP service published and enabled for SHA.

Some settings are global, so can be reused for publishing more applications, reducing deployment time and effort.

1. Provide a unique **Configuration Name**.
2. Enable **Single Sign-On (SSO) & HTTP Headers**.
3. Enter the **Tenant Id, Client ID,** and **Client Secret** you noted when registering the Easy Button client in your tenant.

   ![Screenshot for Configuration General and Service Account properties](./media/f5-big-ip-kerberos-easy-button/azure-configuration-properties.png)

4. Confirm the BIG-IP connects to your tenant.
5. Select **Next**.

### Service Provider settings

The Service Provider settings are the properties for the SAML SP instance of the application protected through SHA.

1. Enter **Host**, the public FQDN of the application being secured.
2. Enter **Entity ID**, the identifier Azure AD uses to identify the SAML SP requesting a token.

   ![Screenshot for Service Provider settings](./media/f5-big-ip-kerberos-easy-button/service-provider.png)

The optional **Security Settings** specify whether Azure AD encrypts issued SAML assertions. Encrypting assertions between Azure AD and the BIG-IP APM provides more assurance the content tokens can’t be intercepted, and personal or corporate data can't be compromised.

3.	From the **Assertion Decryption Private Key** list, select **Create New**.
 
   ![Screenshot for Configure Easy Button- Create New import](./media/f5-big-ip-oracle/configure-security-create-new.png)

4.	Select **OK**. The **Import SSL Certificate and Keys** dialog appears.
5.	Select **PKCS 12 (IIS)** to import your certificate and private key. 
6.	After provisioning, close the browser tab to return to the main tab.

   ![Screenshot for Configure Easy Button- Import new cert](./media/f5-big-ip-oracle/import-ssl-certificates-and-keys.png)

7.	Check **Enable Encrypted Assertion**.
8.	If you enabled encryption, select your certificate from the **Assertion Decryption Private Key** list. This private key is for the certificate that BIG-IP APM uses to decrypt Azure AD assertions.
9.	If you enabled encryption, select your certificate from the **Assertion Decryption Certificate** list. BIG-IP uploads this certificate to Azure AD to encrypt the issued SAML assertions.

   ![Screenshot for Service Provider security settings](./media/f5-big-ip-kerberos-easy-button/service-provider-security-settings.png)

### Azure Active Directory

This section defines properties used to manually configure a new BIG-IP SAML application in your Azure AD tenant. Easy Button has application templates for Oracle PeopleSoft, Oracle E-business Suite, Oracle JD Edwards, SAP ERP and an SHA template for other apps. 

For this scenario, select **F5 BIG-IP APM Azure AD Integration > Add.**

   ![Screenshot for Azure configuration add BIG-IP application](./media/f5-big-ip-kerberos-easy-button/azure-config-add-app.png)

#### Azure Configuration

1. Enter a **Display Name** of the app that BIG-IP creates in your Azure AD tenant, and the icon in [MyApps portal](https://myapplications.microsoft.com/).
2. Leave the **Sign On URL (optional)** blank to enable IdP initiated sign-on.

   ![Screenshot for Azure configuration add display info](./media/f5-big-ip-kerberos-easy-button/azure-config-display-name.png)

3. Select the **refresh** icon next to the **Signing Key** and **Signing Certificate** to locate the certificate you imported.
4. Enter the certificate password in **Signing Key Passphrase**.
5. Enable **Signing Option** (optional) to ensure BIG-IP accepts tokens and claims signed by Azure AD.

   ![Screenshot for Azure configuration - Add signing certificates info](./media/f5-big-ip-easy-button-ldap/azure-configuration-sign-certificates.png)

6. **User and User Groups** are dynamically queried from your Azure AD tenant and authorize access to the application. Add a user or group for testing, otherwise all access will be denied.

   ![Screenshot for Azure configuration - Add users and groups](./media/f5-big-ip-kerberos-easy-button/azure-configuration-add-user-groups.png)

#### User Attributes & Claims

When a user authenticates to Azure AD, it issues a SAML token with a default set of claims and attributes identifying the user. The **User Attributes & Claims** tab shows the default claims to issue for the new application. Use it to configure more claims.

The AD infrastructure is based on a .com domain suffix used internally and externally. More attributes aren't required to achieve a functional KCD SSO implementation. See the [advanced tutorial](./f5-big-ip-kerberos-advanced.md) for multiple domains or user sign-in using an alternate suffix. 

   ![Screenshot for user attributes and claims](./media/f5-big-ip-kerberos-easy-button/user-attributes-claims.png)

#### Additional User Attributes

The **Additional User Attributes** tab supports various distributed systems requiring attributes stored in other directories, for session augmentation. Attributes fetched from an LDAP source can be injected as SSO headers to help control access based on roles, Partner IDs, etc.

   ![Screenshot for additional user attributes](./media/f5-big-ip-kerberos-easy-button/additional-user-attributes.png)

>[!NOTE] 
>This feature has no correlation to Azure AD but is another source of attributes.

#### Conditional Access Policy

CA policies are enforced after Azure AD pre-authentication to control access based on device, application, location, and risk signals.

The **Available Policies** view show all CA policies without user-based actions.

The **Selected Policies** view shows all policies targeting all cloud apps. You can't deselect policies or moved them to the Available Policies list because they're enforced at a tenant level.

To select a policy to apply to the application being published:

1.	Select a policy in the **Available Policies** list.
2.	Select the **right arrow** and move it to the **Selected Policies** list.

Selected policies need an **Include** or **Exclude** option checked. If both options are checked, the selected policy isn't enforced.

   ![Screenshot for CA policies](./media/f5-big-ip-kerberos-easy-button/conditional-access-policy.png)

>[!NOTE]
>The policy list appears once, after switching to this tab. You can use the **refresh** button to manually force the wizard to query your tenant, but this button is appears after the application is deployed.

### Virtual Server Properties

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for client requests to the application. Any received traffic is processed and evaluated against the APM profile associated with the virtual server, before being directed according to policy.

1. Enter a **Destination Address**, an available IPv4/IPv6 address the BIG-IP can use to receive client traffic. There's a corresponding record in DNS, enabling clients to resolve the external URL of your BIG-IP published application to this IP, instead of the application. Using a test PC localhost DNS is acceptable for testing.
2. For **Service Port** enter 443 for HTTPS.
3. Check **Enable Redirect Port** and then enter **Redirect Port**, which redirects incoming HTTP client traffic to HTTPS.
4. The Client SSL Profile enables the virtual server for HTTPS, so client connections are encrypted over TLS. Select the **Client SSL Profile** you created for prerequisites, or leave the default if you're testing.

   ![Screenshot for Virtual server](./media/f5-big-ip-kerberos-easy-button/virtual-server.png)

### Pool Properties

The **Application Pool** tab details the services behind a BIG-IP, represented as a pool with application servers.

1. Choose from **Select a Pool.** Create a new pool or select one.
2. Choose the **Load Balancing Method**, such as Round Robin.
3. For **Pool Servers** select a server node, or specify an IP and port for the back-end node hosting the header-based application.

   ![Screenshot for Application pool](./media/f5-big-ip-oracle/application-pool.png)

The back-end application runs on HTTP port 80. You can switch the port to 443, if your application runs on HTTPS.

#### Single sign-on and HTTP Headers

Enabling SSO allows users to access BIG-IP published services without having to enter credentials. The Easy Button wizard supports Kerberos, OAuth Bearer, and HTTP authorization headers for SSO. Use the Kerberos delegation account you created to complete this step. 

Enable **Kerberos** and **Show Advanced Setting** to enter the following:

* **Username Source:** The preferred username to cache for SSO. You can provide a session variable as the source of the user ID, but *session.saml.last.identity* works better because it holds the Azure AD claim containing the logged in user ID.

* **User Realm Source:** Required if the user domain differs from the BIG-IP Kerberos realm. In that case, the APM session variable contains the logged-in user domain. For example,*session.saml.last.attr.name.domain*

   ![Screenshot for SSO and HTTP headers](./media/f5-big-ip-kerberos-easy-button/sso-headers.png)

* **KDC:** IP of a Domain Controller, or FQDN if DNS is configured and efficient

* **UPN Support:** Enable this option for the APM to use the UPN for Kerberos ticketing 

* **SPN Pattern:** Use HTTP/%h to inform the APM to use the host header of the client request, and build the SPN for which it's requesting a Kerberos token.

* **Send Authorization:** Disable for applications that negotiate authentication instead of receiving the kerberos token in the first request. For example, *Tomcat*.

   ![Screenshot for SSO method configuration](./media/f5-big-ip-kerberos-easy-button/sso-method-config.png)

### Session management

The BIG-IPs session management settings define the conditions under which user sessions terminate or continue, limits for users and IP addresses, and corresponding user info. Refer to the AskF5 article [K18390492: Security | BIG-IP APM operations guide](https://support.f5.com/csp/article/K18390492) for settings details.

What isn’t covered is Single Log Out (SLO) functionality, which ensures sessions between the IdP, the BIG-IP, and the user agent terminate when users sign out. When the Easy Button instantiates a SAML application in your Azure AD tenant, it populates the sign out URL with the APM SLO endpoint. An IdP-initiated sign out from the Azure AD MyApps portal terminates the session between the BIG-IP and a client.

The SAML federation metadata for the published application is imported from your tenant, providing the APM with the SAML sign out endpoint for Azure AD. This action ensures an SP-initiated sign out terminates the session between a client and Azure AD. The APM needs to know when a user signs out of the application.

If the BIG-IP webtop portal accesses published applications, then a sign out is processed by the APM to call the Azure AD sign out endpoint. But consider a scenario when the BIG-IP webtop portal isn’t used, then the user can't instruct the APM to sign out. Even if the user signs out of the application, the BIG-IP is oblivious. Therefore, SP-initiated sign out needs consideration to ensure sessions terminate securely. You can add an SLO function to your application's Sign out button, so it redirects your client to the Azure AD SAML, or the BIG-IP sign out endpoint. 

The URL for SAML sign out endpoint for your tenant is found in **App Registrations > Endpoints**.

If you can't change the app, then consider having the BIG-IP listen for the application sign out call, and upon detecting the request, it triggers SLO. Refer to [Oracle PeopleSoft SLO guidance](./f5-big-ip-oracle-peoplesoft-easy-button.md#peoplesoft-single-logout) to learn about BIG-IP iRules. For more information about using BIG-IP iRules, see: 

* [K42052145: Configuring automatic session termination (log out) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145)
* [K12056: Overview of the Log-out URI Include option](https://support.f5.com/csp/article/K12056).

## Summary

This section is a breakdown of your configurations. 

Select **Deploy** to commit settings and verify the application is in your tenant's list of Enterprise applications.

## Active Directory KCD configurations

For the BIG-IP APM to perform SSO to the back-end application on behalf of users, configure KCD in the target AD domain. Delegating authentication requires the BIG-IP APM is provisioned with a domain service account.

Skip this section if your APM service account and delegation are set up, otherwise log into a domain controller with an Admin account.

For this scenario, the application is hosted on server APP-VM-01 and runs in the context of a service account named web_svc_account, not the computer identity. The delegating service account assigned to the APM is F5-BIG-IP.

### Create a BIG-IP APM delegation account 

The BIG-IP doesn’t support group Managed Service Accounts (gMSA), therefore create a standard user account for the APM service account.

1. Replace the **UserPrincipalName** and **SamAccountName** values with the values needed for your environment.

    ```New-ADUser -Name "F5 BIG-IP Delegation Account" -UserPrincipalName host/f5-big-ip.contoso.com@contoso.com -SamAccountName "f5-big-ip" -PasswordNeverExpires $true -Enabled $true -AccountPassword (Read-Host -AsSecureString "Account Password") ```

2. Create a **Service Principal Name (SPN)** for the APM service account for performing delegation to the web application service account.

     ```Set-AdUser -Identity f5-big-ip -ServicePrincipalNames @{Add="host/f5-big-ip.contoso.com"} ```

3. Ensure the SPN shows against the APM service account.
     
     ```Get-ADUser -identity f5-big-ip -properties ServicePrincipalNames | Select-Object -ExpandProperty ServicePrincipalNames ```

4. Before specifying the target SPN that the APM service account should delegate to for the web application, you need to view its existing SPN config. Check whether your web application is running in the computer context or a dedicated service account. Next, query that account object in AD to see its defined SPNs. Replace <name_of_account> with the account for your environment. 

    ```Get-ADUser -identity <name_of _account> -properties ServicePrincipalNames | Select-Object -ExpandProperty ServicePrincipalNames ```

5. You can use an SPN defined against a web application service account, but for better security, use a dedicated SPN matching the host header of the application. For example, the web application host header is myexpenses.contoso.com. You can add HTTP/myexpenses.contoso.com to the applications service account object in AD.

    ```Set-AdUser -Identity web_svc_account -ServicePrincipalNames @{Add="http/myexpenses.contoso.com"} ```

Or if the app ran in the machine context, add the SPN to the object of the computer account in AD.

   ```Set-ADComputer -Identity APP-VM-01 -ServicePrincipalNames @{Add="http/myexpenses.contoso.com"} ```

With the SPNs defined, the APM service account needs trust to delegate to that service. The configuration varies depending on the topology of your BIG-IP and application server.

### Configure BIG-IP and target application in the same domain

1. Set trust for the APM service account to delegate authentication.

    ```Get-ADUser -Identity f5-big-ip | Set-ADAccountControl -TrustedToAuthForDelegation $true ```

2. The APM service account needs to know the target SPN it’s trusted to delegate to, or which service for which it's allowed to request a Kerberos ticket. Set target SPN to the service account running your web application.

    ```Set-ADUser -Identity f5-big-ip -Add @{'msDS-AllowedToDelegateTo'=@('HTTP/myexpenses.contoso.com')} ```

>[!NOTE]
>You can complete these tasks with the Active Directory Users and Computers Microsoft Management Console (MMC) on a domain controller.

### BIG-IP and application in different domains

From the Windows Server 2012 version onward, cross-domain KCD uses resource-based constrained delegation (RCD). The constraints for a service transferred from the domain administrator to the service administrator. The back-end service Administrator can allow or deny SSO. This situation creates a different approach at configuration delegation, which is possible using PowerShell or ADSIEdit.

You can use PrincipalsAllowedToDelegateToAccount property of the applications service account (computer or dedicated service account) to grant delegation from the BIG-IP. For this scenario, use the following PowerShell command on a domain controller (2012 R2+) in the same domain as the application.

If the web_svc_account service runs in the context of a user account:

 ```$big-ip= Get-ADComputer -Identity f5-big-ip -server dc.contoso.com ```
 ```Set-ADUser -Identity web_svc_account -PrincipalsAllowedToDelegateToAccount $big-ip ```
 ```Get-ADUser web_svc_account -Properties PrincipalsAllowedToDelegateToAccount ```

If the web_svc_account service runs in the context of a computer account:

 ```$big-ip= Get-ADComputer -Identity f5-big-ip -server dc.contoso.com ```
 ```Set-ADComputer -Identity web_svc_account -PrincipalsAllowedToDelegateToAccount $big-ip ```
 ```Get-ADComputer web_svc_account -Properties PrincipalsAllowedToDelegateToAccount ```

For more information, see [Kerberos Constrained Delegation across domains](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831477(v=ws.11)).

## Next steps

From a browser, connect to the application external URL or select the **application** icon in the [Microsoft MyApps portal](https://myapps.microsoft.com/). After authenticating to Azure AD, you're redirected to the BIG-IP virtual server for the application and signed in through SSO.

   ![Screenshot for App views](./media/f5-big-ip-kerberos-easy-button/app-view.png)

For increased security, organizations using this pattern can consider blocking direct access to the application, thereby forcing a strict path through the BIG-IP.

### Azure AD B2B guest access

[Azure AD B2B guest access](../external-identities/hybrid-cloud-to-on-premises.md) is supported for this scenario, with guest identities flowing down from your Azure AD tenant to the directory the application uses for authorization. Without a local representation of a guest object in AD, the BIG-IP fails to receive a kerberos ticket for KCD SSO to the back-end application.

## Advanced deployment

The Guided Configuration templates can lack the flexibility to achieve some requirements. For those scenarios, see [Advanced Configuration for kerberos-based SSO](./f5-big-ip-kerberos-advanced.md).

Alternatively, in BIG-IP you can disable the Guided Configuration strict management mode. You can manually change your configurations, although the bulk of your configurations are automated through the wizard-based templates.

You can navigate to **Access > Guided Configuration** and select the small **padlock** icon on the far-right of the row for your applications configs. 
 
   ![Screenshot for Configure Easy Button - Strict Management](./media/f5-big-ip-oracle/strict-mode-padlock.png)

At this point, changes with the wizard UI aren't possible, but all BIG-IP objects associated with the published instance of the application are unlocked for management.

>[!NOTE]
>Re-enabling strict mode and deploying a configuration overwrites settings performed outside the Guided Configuration UI. Therefore we recommend the advanced configuration method for production services.

## Troubleshooting

If troubleshooting kerberos SSO issues, be aware of the following concepts.

* Kerberos is time sensitive, so it requires servers and clients set to the correct time, and when possible, synchronized to a reliable time source
* Ensure the hostname for the domain controller and web application are resolvable in DNS
* Ensure there are no duplicate SPNs in your AD environment: executing the following query at the command line on a domain PC: setspn -q HTTP/my_target_SPN

You can refer to our [App Proxy guidance](../app-proxy/application-proxy-back-end-kerberos-constrained-delegation-how-to.md) to validate an IIS application is configured for KCD. See also the AskF5 article, [Kerberos single sign on method](https://techdocs.f5.com/en-us/bigip-15-1-0/big-ip-access-policy-manager-single-sign-on-concepts-configuration/kerberos-single-sign-on-method.html).

### Log analysis: increase verbosity

Use BIG-IP logging to isolate issues with connectivity, SSO, policy violations, or misconfigured variable mappings. Start troubleshooting by increasing the log verbosity level.

1. Navigate to **Access Policy > Overview > Event Logs > Settings**.
2. Select the row for your published application, then **Edit > Access System Logs**.
3. Select **Debug** from the SSO list, and then select **OK**. 

Reproduce your issue and inspect the logs. When complete, revert the feature because verbose mode generates much data. 

### BIG-IP error page

If aBIG-IP error appears after Azure AD pre-authentication, the issue might relate to SSO from Azure AD to the BIG-IP.

1. Navigate to **Access > Overview > Access reports**.
2. Run the report for the last hour to see logs for clues. Use the **View session variables** link to help understand if the APM receives the expected claims from Azure AD.

### Back-end request

If no error page appears, the issue is probably related to the back-end request, or SSO from the BIG-IP to the application. 

1. Navigate to **Access Policy > Overview > Active Sessions**.\
2. Select the link for your active session. The **View Variables** link in this location may also help determine root cause KCD issues, particularly if the BIG-IP APM fails to obtain the right user and domain identifiers from session variables.

For more information, see:

* dev/central: [APM variable assign examples](https://devcentral.f5.com/s/articles/apm-variable-assign-examples-1107)
* AskF5: [Session Variables](https://techdocs.f5.com/en-us/bigip-15-0-0/big-ip-access-policy-manager-visual-policy-editor/session-variables.html)
