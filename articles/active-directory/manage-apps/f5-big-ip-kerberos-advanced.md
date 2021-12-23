---
title: Configure F5 BIG-IP Access Policy Manager for Kerberos authentication
description: Learn how to implement Secure Hybrid Access (SHA) with Single Sign-on (SSO) to Kerberos applications using F5’s BIG-IP advanced configuration.
services: active-directory
author: NishthaBabith-V
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 12/13/2021
ms.author: v-nisba
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5 BIG-IP Access Policy Manager for Kerberos authentication

In this tutorial, you’ll learn how to implement Secure Hybrid Access (SHA) with Single Sign-on (SSO) to Kerberos applications using F5’s BIG-IP advanced configuration. 

Integrating a BIG-IP with Azure AD provides many benefits, including:

* Improved zero-trust governance through Azure AD pre-authentication and authorization

* Full Single Sign-on (SSO) between Azure AD and BIG-IP published services

* Manage Identities and access from a single control plane - [The Azure portal](https://portal.azure.com/)

To learn about all of the benefits, see the article on [F5 BIG-IP and Azure AD integration](./f5-aad-integration.md) and [what is application access and single sign-on with Azure AD](/azure/active-directory/active-directory-appssoaccess-whatis).


## Scenario description

For this scenario, you will configure a critical line of business (LOB) application for **Kerberos authentication**, also known as **Integrated Windows Authentication (IWA)**.

To integrate the application directly with Azure AD, it’d need to support some form of federation-based protocol such as Security Assertion Markup Language (SAML), or better. But as modernizing the application introduces risk of potential downtime, there are other options. While using Kerberos Constrained Delegation (KCD) for SSO, you can use [Azure AD Application Proxy](../app-proxy/application-proxy.md) to access the application remotely. 

In this arrangement, you can achieve the protocol transitioning required to bridge the legacy application to the modern identity control plane. Another approach is to use an F5 BIG-IP Application Delivery Controller (ADC). This enables overlay of the application with Azure AD pre-authentication and KCD SSO, and significantly improves the overall Zero Trust posture of the application.

## Scenario architecture

The secure hybrid access solution for this scenario is made up of the following:

**Application:** The backend Kerberos-based service that gets externally published by the BIG-IP and is protected by SHA.

**BIG-IP:** Reverse proxy functionality enables publishing backend applications. The APM then overlays published applications with SAML Service Provider (SP) and SSO functionality.

**Azure AD:** Identity Provider (IdP) responsible for verifying user credentials, Conditional Access (CA), and SSO to the BIG-IP APM through SAML.

**KDC:** Key Distribution Center role on a Domain Controller (DC), issuing Kerberos tickets.

The following image illustrates the SAML SP initiated flow for this scenario, but IdP initiated flow is also supported.

![Scenario architecture](./media/f5-big-ip-kerberos-advanced/scenario-architecture.png)

| Steps| Description |
| -------- |-------|
| 1| User connects to application endpoint (BIG-IP) |
| 2| BIG-IP access policy redirects user to Azure AD (SAML IdP) |
| 3| Azure AD pre-authenticates user and applies any enforced CA policies |
| 4| User is redirected to BIG-IP (SAML SP) and SSO is performed using issued SAML token |
| 5| BIG-IP authenticates user and requests Kerberos ticket from KDC |
| 6| BIG-IP sends request to backend application, along with Kerberos ticket for SSO |
| 7| Application authorizes request and returns payload |

 ## Prerequisites

Prior BIG-IP experience isn’t necessary, but you will need:

* An Azure AD free subscription or above

* An existing BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in Azure](../manage-apps/f5-bigip-deployment-guide.md)

* Any of the following F5 BIG-IP license offers

  * F5 BIG-IP® Best bundle

  * F5 BIG-IP APM standalone license

  * F5 BIG-IP APM add-on license on an existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

  * 90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php).

*   User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md) from an on-premises directory to Azure AD or created directly within Azure AD and flowed back to your on-premises directory

*   An account with Azure AD Application admin [permissions](../users-groups-roles/directory-assign-admin-roles.md)

*   Web server [certificate](../manage-apps/f5-bigip-deployment-guide.md) for publishing services over HTTPS or use default BIG-IP certs while testing

* An existing Kerberos application or [setup an IIS (Internet Information Services) app](https://active-directory-wp.com/docs/Networking/Single_Sign_On/SSO_with_IIS_on_Windows.html) for KCD SSO

## Configuration methods

There are many methods to configure BIG-IP for this scenario, including two template-based options and an advanced configuration. This tutorial covers the advanced approach that provides a more flexible way of implementing SHA by manually creating all BIG-IP configuration objects. You would also use this approach for scenarios not covered by the guided configuration templates.

>[!NOTE]
> All example strings or values referenced throughout this guide should be replaced with those for your actual environment.

## Register F5 BIG-IP in Azure AD

Before a BIG-IP can hand off pre-authentication to Azure AD, it must be registered in your tenant. This is the first step in establishing SSO between both entities and is no different to making any IDP aware of a SAML Relying Party (RP). In this case, the app you create from the F5 BIG-IP gallery template is the RP representing the SAML SP for the BIG-IP published application.

1. Sign-in to the [Azure AD portal](https://portal.azure.com) using an account with Application Admin rights.

2. From the left navigation pane, select the **Azure Active Directory** service

3. In the left menu, select **Enterprise applications.** The **All applications** pane opens and displays a list of the applications in your Azure AD tenant.

4. In the **Enterprise applications** pane, select **New application**.

5. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons indicating whether they support federated single sign-on (SSO) and provisioning. Search for **F5** in the Azure gallery and select **F5 BIG-IP APM Azure AD integration**

6. Provide a name for the new application to recognize the instance of the application. Select **Add/Create** to add it to your tenant.

## Enable SSO to the F5 BIG-IP

Next, configure the BIG-IP registration to fulfill SAML tokens requested by the BIG-IP APM.

1. In the **Manage** section of the left menu, select **Single sign-on** to open the **Single sign-on** pane for editing.

2. On the **Select a single sign-on method** page, select **SAML** followed by **No, I’ll save later** to skip the prompt.

3. On the **Set up single sign-on with SAML** pane, select the pen icon to edit **Basic SAML Configuration**. Make these edits:

   1.  Replace the pre-defined **Identifier** with the full URL for the BIG-IP published application

   2.  Replace the **Reply URL** but retain the path for the application’s SAML SP endpoint. 
   
     In this configuration, the SAML flow would operate in IdP initiated mode, where Azure AD issues a SAML assertion before the user is redirected to the BIG-IP endpoint for the application. 


   3. To use SP initiated mode, populate the **Sign on URL**        with the application URL.

   4. For the **Logout URI**, enter the BIG-IP APM single logout (SLO) endpoint pre-pended by the host header of the service being published. It ensures the user’s BIG-IP APM session is also terminated after being signed out of Azure AD. 

    ![Screenshot for editing basic SAML configuration](./media/f5-big-ip-kerberos-advanced/edit-basic-saml-configuration.png)

    > [!NOTE]
    > From TMOS v16 the SAML SLO endpoint has changed to **/saml/sp/profile/redirect/slo**

4. Select **Save** before exiting the SAML configuration pane and skip the SSO test prompt.

5. Note the properties of the **User Attributes & Claims** section, as these are what Azure AD will issue users for BIG-IP APM authentication and SSO to the backend application.

6. In the **SAML Signing Certificate** pane, select the **Download** button to save the **Federation Metadata XML** file to your computer.

    ![Edit SAML signing certificate](./media/f5-big-ip-kerberos-advanced/edit-saml-signing-certificate.png)

SAML signing certificates created by Azure AD have a lifespan of 3 years. For more information, see [Managed certificates for federated single sign-on](./manage-certificates-for-federated-single-sign-on.md).

## Assign users and groups

By default, Azure AD will issue tokens only for users that have been granted access to an application. To provide specific users and groups access to the application:

1. In the **F5 BIG-IP application’s overview** blade, select **Assign Users and groups**

    ![Screenshot for assigning users and groups](./media/f5-big-ip-kerberos-advanced/authorize-users-groups.png)

2. Select **+ Add user/group** to add the groups authorized to access the internal application followed by **Select > Assign** to assign the users/ groups to your application

## Active Directory KCD configurations

For the BIG-IP APM to perform SSO to the backend application on behalf of users, KCD must be configured in the target AD domain. Delegating authentication also requires that the BIG-IP APM be provisioned with a domain service account.

For our scenario, the application is hosted on server **APP-VM-01** and is running in the context of a service account named **web_svc_account**, not the computer’s identity. The delegating service account assigned to the APM will be called **F5-BIG-IP**.

### Create a BIG-IP APM delegation account 

As the BIG-IP doesn’t support group managed service accounts (gMSA), create a standard user account to use as the APM service account:


1. Replace the **UserPrincipalName** and **SamAccountName** values with those for your environment in these PowerShell commands:

     ```New-ADUser -Name "F5 BIG-IP Delegation Account" UserPrincipalName host/f5-big-ip.contoso.com@contoso.com SamAccountName "f5-big-ip" -PasswordNeverExpires $true Enabled $true -AccountPassword (Read-Host -AsSecureString "Account Password") ```

2. Create a **Service Principal Name (SPN)** for the APM service account to use when performing delegation to the web application’s service account.

    ```Set-AdUser -Identity f5-big-ip -ServicePrincipalNames @Add="host/f5-big-ip.contoso.com"} ```

3. Ensure the SPN now shows against the APM service account.

    ```Get-ADUser -identity f5-big-ip -properties ServicePrincipalNames | Select-Object -ExpandProperty ServicePrincipalNames ```

 4. Before specifying the target SPN that the APM service account should delegate to for the web application, you need to view its existing SPN config. Check whether your web application is running in the computer context or a dedicated service account. Next, query that account object in AD to see its defined SPNs. Replace <name_of_account> with the account for your environment. 

    ```Get-ADUser -identity <name_of _account> -properties ServicePrincipalNames | Select-Object -ExpandProperty ServicePrincipalNames ```

5. You can use any SPN you see defined against a web application’s service account, but in the interest of security it’s best to use a dedicated SPN matching the host header of the application. For example, as our web application host header is myexpenses.contoso.com we would add HTTP/myexpenses.contoso.com to the application's service account object in AD.

    ```Set-AdUser -Identity web_svc_account -ServicePrincipalNames @{Add="http/myexpenses.contoso.com"} ```

    Or if the app ran in the machine context, we would add the SPN to the object of the computer account in AD.

    ```Set-ADComputer -Identity APP-VM-01 -ServicePrincipalNames @{Add="http/myexpenses.contoso.com"} ```

With the SPNs defined, the APM service account now needs trusting to delegate to that service. The configuration will vary depending on the topology of your BIG-IP and application server.

### Configure BIG-IP and target application in same domain

1. Set trust for the APM service account to delegate authentication

    ```Get-ADUser -Identity f5-big-ip | Set-ADAccountControl -TrustedToAuthForDelegation $true ```

2. The APM service account then needs to know which target SPN it’s trusted to delegate to, Or in other words which service is it allowed to request a Kerberos ticket for. Set target SPN to the service account running your web application.

    ```Set-ADUser -Identity f5-big-ip -Add @{'msDS-AllowedToDelegateTo'=@('HTTP/myexpenses.contoso.com')} ```

If preferred, you can also complete these tasks through the Active Directory Users and Computers Microsoft Management Console (MMC) on a domain controller.

### BIG-IP and application in different domains

Starting with Windows Server 2012, cross domain KCD uses Resource-based constrained delegation (RCD). The constraints for a service have been transferred from the domain administrator to the service administrator. This allows the back-end service administrator to allow or deny SSO. This also introduces a different approach at configuration delegation, which is only possible using either PowerShell or ADSIEdit.

The PrincipalsAllowedToDelegateToAccount property of the applications service account (computer or dedicated service account) can be used to grant delegation from the BIG-IP. For this scenario, use the following PowerShell command on a Domain Controller DC (2012 R2+) within the same domain as the application.

If the **web_svc_account** service runs in context of a user account:

```$big-ip= Get-ADComputer -Identity f5-big-ip -server dc.contoso.com```
```Set-ADUser -Identity web_svc_account -PrincipalsAllowedToDelegateToAccount $big-ip```
```Get-ADUser web_svc_account -Properties PrincipalsAllowedToDelegateToAccount```

If the **web_svc_account** service runs in context of a computer account:

```$big-ip= Get-ADComputer -Identity f5-big-ip -server dc.contoso.com```
```Set-ADComputer -Identity web_svc_account -PrincipalsAllowedToDelegateToAccount $big-ip```
```Get-ADComputer web_svc_account -Properties PrincipalsAllowedToDelegateToAccount```

For more information, see [Kerberos Constrained Delegation across domains](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831477(v=ws.11)).
## BIG-IP advanced configuration

Now we can proceed with setting up the BIG-IP configurations.

### Configure SAML Service Provider settings

These settings define the SAML SP properties that the APM will use for overlaying the legacy application with SAML pre-authentication.

1. From a browser, sign-in to the F5 BIG-IP management console

2. Select **Access > Federation > SAML Service Provider > Local SP Services > Create**

    ![Create local service SAML service provider](./media/f5-big-ip-kerberos-advanced/create-local-services-saml-service-provider.png)

3. Provide a **Name** and the **Entity ID** saved when you configured SSO for Azure AD earlier.

    ![Create a new SAML SP service](./media/f5-big-ip-kerberos-advanced/create-new-saml-sp-service.png)

4. You need not specify  **SP Name Settings** if the SAML entity ID is an exact match with the URL for the published application. For example, if the entity ID were urn:myexpenses:contosoonline then you would need to provide the **Scheme** and **Host** as https myexpenses.contoso.com. Whereas if the entity ID was `https://myexpenses.contoso.com` then not.

### Configure external IdP connector 

A SAML IdP connector defines the settings required for the BIG-IP APM to trust Azure AD as its SAML IdP. These settings will map the SAML SP to a SAML IdP, establishing the federation trust between the APM and Azure AD.

1. Scroll down to select the new SAML SP object and select **Bind/Unbind IdP Connectors**

     ![Screenshot for select new SAML object](./media/f5-big-ip-kerberos-advanced/bind-unbind-idp-connectors.png)

2. Select **Create New IdP Connector**, choose **From Metadata**

     ![Screenshot for creating new IdP connector from metadata](./media/f5-big-ip-kerberos-advanced/create-new-idp-connector-from-metadata.png)

3. Browse to the federation metadata XML file you downloaded earlier and provide an **Identity Provider Name** for the APM object that’ll represent the external SAML IdP. For example, MyExpenses_AzureAD

     ![Screenshot for browse to federation metadata XML](./media/f5-big-ip-kerberos-advanced/browse-federation-metadata-xml.png)

4. Select **Add New Row** to choose the new **SAML IdP Connector**, and then select **Update**

     ![Screenshot to choose new IdP connector](./media/f5-big-ip-kerberos-advanced/choose-new-saml-idp-connector.png)

5. Select **OK** to save the settings

### Configure Kerberos SSO

In this section, you create an APM SSO object for performing KCD SSO to backend applications. You will need the APM delegation account created earlier to complete this step.

Select **Access > Single Sign-on > Kerberos > Create** and provide the following:

* **Name:** You can use a descriptive name. Once created, the Kerberos SSO APM object can be used by other published applications as well. For example, *Contoso_KCD_sso* can be used for multiple published applications for the entire Contoso domain, whereas *MyExpenses_KCD_sso* can be used for a single application only.

* **Username Source:** Specifies the preferred source of user ID. You can specify any APM session variable as the source, but *session.saml.last.identity* is typically best as it contains the logged in user ID derived from the Azure AD claim.

* **User Realm Source:** Required in scenarios where the user domain is different to the Kerberos realm that will be used for KCD. If users were in a separate trusted domain, then you make the APM aware by specifying the APM session variable containing the logged-in user domain. For example, session.saml.last.attr.name.domain. You would also do this in scenarios where UPN of users is based on an alternative suffix.

* **Kerberos Realm:** Enter users domain suffix in uppercase

* **KDC:** IP of a Domain Controller (Or FQDN if DNS is configured and efficient)

* **UPN Support:** Enable if specified source of username is in UPN format, such as if using session.saml.last.identity variable

* **Account Name and Account Password:** APM service account credentials to perform KCD

* **SPN Pattern:** If you use HTTP/%h, APM then uses the host header of the client request to build the SPN that it’s requesting a Kerberos token for

* **Send Authorization:** Disable for applications that prefer negotiating authentication, instead of receiving the Kerberos token in the first request. For example, *Tomcat*.

     ![Screenshot to configure kerberos S S O](./media/f5-big-ip-kerberos-advanced/configure-kerberos-sso.png)

You can leave *KDC* undefined if the user realm is different to the backend server realm. This applies for multi-domain realm scenarios as well. When left blank, BIG-IP will attempt to discover a Kerberos realm through a DNS lookup of SRV records for the backend server’s domain, so it expects the domain name to be the same as the realm name. If the domain name is different from the realm name, it must be specified in the [/etc/krb5.conf](https://support.f5.com/csp/article/K17976428) file.

Kerberos SSO processing is fastest when a KDC is specified by IP, slower when specified by host name, and due to additional DNS queries, even slower when left undefined. For this reason, you should ensure your DNS is performing optimally before moving a proofs of concept (POC) into production. Note that if backend servers are in multiple realms, you must create a separate SSO configuration object for each realm.

You can inject headers as part of the SSO request to the backend application. Simply change **General Properties** setting from **Basic** to **Advanced**. 

For more information on configuring an APM for KCD SSO, refer to the F5 article on [Overview of Kerberos constrained delegation](https://support.f5.com/csp/article/K17976428).

### Configure Access Profile

An *Access Profile* binds many APM elements managing access to BIG-IP virtual servers, including access policies, SSO configuration, and UI settings. 

1. Select **Access > Profiles / Policies > Access Profiles (Per-Session Policies) > Create** and provide these general properties:

   * **Name:** For example, MyExpenses

   * **Profile Type:** All

   * **SSO Configuration:** The KCD SSO configuration object you just created

   * **Accepted Language:** Add at least one language

     ![Screenshot to create new access profile](./media/f5-big-ip-kerberos-advanced/create-new-access-profile.png)

2. Select **Edit** for the per-session profile you just created 

    ![Screenshot to edit per session profile](./media/f5-big-ip-kerberos-advanced/edit-per-session-profile.png)

3. Once the Visual Policy Editor (VPE) has launched, select the **+** sign next to the fallback

    ![Select plus sign next to fallback](./media/f5-big-ip-kerberos-advanced/select-plus-fallback.png)

4. In the pop-up select **Authentication > SAML Auth > Add Item**

    ![Screenshot popup to add Saml authentication item](./media/f5-big-ip-kerberos-advanced/add-item-saml-auth.png)

5. In the **SAML authentication SP** configuration, set the **AAA Server** option to use the SAML SP object you created earlier

    ![Screenshot to configure A A A server](./media/f5-big-ip-kerberos-advanced/configure-aaa-server.png)

6. Select the link in the upper **Deny** box to change the **Successful** branch to **Allow**

    ![Change successful branch to allow](./media/f5-big-ip-kerberos-advanced/select-allow-successful-branch.png)

### Configure Attribute Mappings

Although optional, adding a *LogonID_Mapping configuration* enables the BIG-IP active sessions list to display the UPN of the logged-in user instead of a session number. This is useful  when you analyze logs, or while troubleshooting.

1. Click the **+** symbol for the SAML Auth Successful branch 

2. In the pop-up select **Assignment > Variable Assign > Add Item**

    ![Screenshot to configure variable assign](./media/f5-big-ip-kerberos-advanced/configure-variable-assign.png)

3. Enter **Name**. 

4. In the **Variable Assign** pane, select **Add new entry > change.** For example, *LogonID_Mapping*

    ![Screenshot to add new entry for variable assign](./media/f5-big-ip-kerberos-advanced/add-new-entry-variable-assign.png)

5. Set both variables. 

   * **Custom Variable:** session.logon.last.username
   * **Session Variable:** session.saml.last.identity

6. Select **Finished > Save:**

7. Select the **Deny** terminal of the Access Policy’s **Successful** branch and change it to **Allow,** followed by **Save**

8. Commit those settings by selecting **Apply Access Policy** and close the visual policy editor

    ![Screenshot to commit apply access policy](./media/f5-big-ip-kerberos-advanced/apply-access-policy.png)

### Configure Backend Pool

For the BIG-IP to know where to forward client traffic, you need to create a BIG-IP node object representing the backend server hosting your application, and place that node in a BIG-IP server pool.

1. Select **Local Traffic > Pools > Pool List > Create** and provide a name for a server pool object. For example *MyApps_VMs*

    ![Screenshot to create new advanced backend pool](./media/f5-big-ip-kerberos-advanced/create-new-backend-pool.png)

2. Add a pool member object with the following resource details:

   * **Node Name:** Optional display name for the server hosting the backend web application
   * **Address:** IP address of the server hosting the application
   * **Service Port:** The HTTP/S port the application is listening on

    ![Screenshot to add a pool member object](./media/f5-big-ip-kerberos-advanced/add-pool-member-object.png)


> [!NOTE]
> The Health Monitors require [additional configuration](https://support.f5.com/csp/article/K13397) that is not covered in this tutorial.

### Configure Virtual Server
A *Virtual Server* is a BIG-IP data plane object represented by a virtual IP address listening for client requests to the application. Any received traffic is processed and evaluated against the APM access profile associated with the virtual server, before being directed according to the policy results and settings. To configure a Virtual Server:

1. Select **Local Traffic > Virtual Servers > Virtual Server List > Create**

2. Provide the virtual server with a **Name** and IP IPv4/IPv6 that isn’t already allocated to an existing BIG-IP object or device on the connected network. The IP will be dedicated to receiving client traffic for the published backend application. Then set the **Service Port** to **443**

    ![Screenshot to configure new virtual server](./media/f5-big-ip-kerberos-advanced/configure-new-virtual-server.png)

3. Set the HTTP Profile: to **http** 

4. Enable a virtual server for Transport Layer Security (TLS), allowing services to be published over HTTPS. Select the **client SSL profile** you created as part of the prerequisites or leave the default if testing

    ![Screenshot to update http profile client](./media/f5-big-ip-kerberos-advanced/update-http-profile-client.png)

5. Change the **Source Address Translation** to **Auto Map**

    ![Screenshot to change source address translation](./media/f5-big-ip-kerberos-advanced/change-auto-map.png)

6. Under **Access Policy**, set the **Access Profile** created earlier. This binds the Azure AD SAML pre-authentication profile & KCD SSO policy to the virtual server.

    ![Screenshot to set access profile for access policy](./media/f5-big-ip-kerberos-advanced/set-access-profile-for-access-policy.png)

7. Finally, set the **Default Pool** to use the backend pool objects created in the previous section, then select **Finished**.

   ![Screenshot to set default pool](./media/f5-big-ip-kerberos-advanced/set-default-pool-use-backend-object.png)

### Configure Session Management settings

BIG-IP's session management settings define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. You can create your own policy here. Navigate to **Access Policy > Access Profiles > Access Profile** and select your application from the list.

If you have defined a **Single Log-out URI** in Azure AD, it’ll ensure an IdP initiated sign-out from the MyApps portal also terminates the session between the client and the BIG-IP APM. The imported application’s federation metadata.xml provides the APM with the Azure AD SAML log-out endpoint for SP initiated sign-outs. But for this to be truly effective, the APM needs to know exactly when a user signs-out. 

Consider a scenario where a BIG-IP web portal is not used. The user has no way of instructing the APM to sign-out. Even if the user signs-out of the application itself, the BIG-IP is technically oblivious to this, so the application session could easily be re-instated through SSO. For this reason, SP initiated sign-out needs careful consideration to ensure sessions are securely terminated when no longer required.

One way to achieve this will be by adding an SLO function to your applications sign-out button. It can redirect your client to the Azure AD SAML sign-out endpoint. You can find this SAML sign-out endpoint at **App Registrations > Endpoints.**

If unable to change the app, consider having the BIG-IP listen for the app's sign-out call, and upon detecting the request, it should trigger SLO. 

For more details, see this F5 article on [Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145) and [Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056).

## Summary

Your application should now be published and accessible via SHA, either directly via its URL or through Microsoft’s application portals. The application should also be visible as a target resource in [Azure AD Conditional Access](../conditional-access/concept-conditional-access-policies.md). 

For increased security, organizations using this pattern could also consider blocking all direct access to the application, forcing a strict path through the BIG-IP.

## Next steps

As a user, launch a browser and connect to the application’s external URL. You can also select the application’s icon from the [Microsoft MyApps portal](https://myapps.microsoft.com/). Once you authenticate against your Azure AD tenant, you will be redirected to the BIG-IP endpoint for the application and automatically signed in via SSO.

   ![Screenshot of app view](./media/f5-big-ip-kerberos-advanced/app-view.png)

### Azure AD B2B guest access

SHA also supports [Azure AD B2B guest access](../external-identities/hybrid-cloud-to-on-premises.md). Guest identities are synchronized from your Azure AD tenant to your target Kerberos domain. It is necessary to have a local representation of guest objects for BIG-IP to perform KCD SSO to the backend application. 

## Troubleshooting

There can be many reasons for failure to access a SHA protected application, including a misconfiguration. Consider the following points while troubleshooting any issue.

* Kerberos is time sensitive, so requires that servers and clients be set to the correct time and where possible synchronized to a reliable time source

* Ensure the hostnames for the domain controller and web application are resolvable in DNS

* Ensure there are no duplicate SPNs in your environment by executing the following query at the command line: setspn -q HTTP/my_target_SPN

> [!NOTE]
> You can refer to our [App Proxy guidance to validate an IIS application ](../app-proxy/application-proxy-back-end-kerberos-constrained-delegation-how-to.md)is configured appropriately for KCD. F5’s article on [how the APM handles Kerberos SSO](https://techdocs.f5.com/en-us/bigip-15-1-0/big-ip-access-policy-manager-single-sign-on-concepts-configuration/kerberos-single-sign-on-method.html) is also a valuable resource.

### Authentication and SSO issues

BIG-IP logs are a reliable source of information. To increase the log verbosity level:

1. Navigate to **Access Policy > Overview > Event Logs > Settings**

2. Select the row for your published application, then **Edit > Access System Logs**

3. Select **Debug** from the SSO list, and then select OK. Reproduce your issue before looking at the logs but remember to switch this back when finished.

If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it’s possible the issue relates to SSO from Azure AD to the BIG-IP. 

1. Navigate to **Access > Overview > Access reports**

2. Run the report for the last hour to see logs provide any clues. The **View session variables** link for your session will also help understand if the APM is receiving the expected claims from Azure AD.

If you don’t see a BIG-IP error page, then the issue is probably more related to the backend request or SSO from the BIG-IP to the application. 

1. Navigate to **Access Policy > Overview > Active Sessions**

2. Select the link for your active session. The **View Variables** link in this location may also help determine root cause KCD issues, particularly if the BIG-IP APM fails to obtain the right user and domain identifiers.

F5 provides a great BIG-IP specific paper to help diagnose KCD related issues, see the deployment guide on [Configuring Kerberos Constrained Delegation](https://www.f5.com/pdf/deployment-guides/kerberos-constrained-delegation-dg.pdf).

## Additional resources

* [BIG-IP Advanced configuration](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/2.html)

* [The end of passwords, go password-less](https://www.microsoft.com/security/business/identity/passwordless)

* [What is Conditional Access?](../conditional-access/overview.md)

* [Microsoft Zero Trust framework to enable remote work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/)
