---
title: Configure F5 BIG-IP’s Access Policy Manager for form-based SSO
description: Learn how to configure F5's BIG-IP Access Policy Manager and Azure Active Directory for secure hybrid access to form-based applications.
author: gargi-sinha
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 10/20/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Configure F5 BIG-IP Access Policy Manager for form-based SSO

In this article, you'll learn how to configure F5's BIG-IP Access Policy Manager (APM) and Azure Active Directory (Azure AD) for secure hybrid access to form-based applications.

Enabling BIG-IP published services for Azure Active Directory (Azure AD) SSO provides many benefits, including:

- Improved Zero Trust governance through Azure AD pre-authentication and [Conditional Access](../conditional-access/overview.md)
- Full single sign-on (SSO) between Azure AD and BIG-IP published services
- Identities and access are managed from a single control plane, the [Azure portal](https://azure.microsoft.com/features/azure-portal/)

To learn about all the benefits, see [Integrate F5 BIG-IP with Azure Active Directory](f5-aad-integration.md) and [What is application access and single sign-on with Azure AD?](../active-directory-appssoaccess-whatis.md).

## Scenario description

For this scenario, we have an internal legacy application that's configured for basic form-based authentication (FBA).

Ideally, application access should be managed directly by Azure AD but being legacy it lacks any form of modern authentication protocol. Modernization would take considerable effort and time, introducing inevitable costs and risk of potential downtime. Instead, a BIG-IP deployed between the public internet and the internal application will be used to gate inbound access to the application.

Having a BIG-IP in front of the application enables us to overlay the service with Azure AD pre-authentication and header-based SSO, significantly improving the overall security posture of the application.


## Scenario Architecture

The secure hybrid access solution for this scenario is made up of:

**Application**: BIG-IP published service to be protected by and Azure AD SHA. This particular application validates user credentials against Active Directory, but it could be any directory, including Active Directory Lightweight Directory Services, open source, and so on.

**Azure AD**: Security Assertion Markup Language (SAML) Identity Provider (IdP) responsible for verification of user credentials, Conditional Access (CA), and SSO to the BIG-IP. Through SSO, Azure AD provides the BIG-IP with any required attributes including a user identifier.

**BIG-IP**: Reverse proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP before performing header-based SSO to the backend application. The cached user credentials are then available for SSO against other forms-based authentication applications.

SHA for this scenario supports both SP and IdP initiated flows. The following image illustrates the SP initiated flow.

![Screenshot of the flow diagram, from user to application.](./media/f5-big-ip-forms-advanced/flow-diagram.png)

| Step | Description|
|-------: |:----------|
| 1 | User connects to application endpoint (BIG-IP).|
| 2 | BIG-IP APM  access policy redirects user to Azure AD (SAML IdP).|
| 3 | Azure AD pre-authenticates user and applies any enforced CA policies.|
| 4 | User is redirected to BIG-IP (SAML SP) and SSO is performed using issued SAML token. |
| 5 | BIG-IP prompts the user for an application password and stores it in the cache. |
| 6 | BIG-IP sends a request to the application and receives a logon form.|
| 7 | The APM scripting auto responds, filling in the username and password before it submits the form.|
| 8 | The application payload is served by the web server and sent to the client. |
| | |

## Prerequisites

Prior BIG-IP experience is not necessary, but you'll need:

- An Azure AD free subscription or above

- An existing BIG-IP, or [deploy BIG-IP Virtual Edition (VE) in Azure](f5-bigip-deployment-guide.md).

- Any of the following F5 BIG-IP license SKUs:

  - F5 BIG-IP Best bundle
  - F5 BIG-IP Access Policy Manager (APM) standalone license
  - F5 BIG-IP Access Policy Manager (APM) add-on license on existing BIG-IP F5 BIG-IP Local Traffic Manager (LTM)
  - 90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php)

- User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md) from an on-premises directory to Azure AD.

- An account with Azure AD Application Admin [permissions](../roles/permissions-reference.md#application-administrator).

- [An SSL certificate](f5-bigip-deployment-guide.md#ssl-profile) for publishing services over HTTPS, or use default certificates during testing.

- An existing form-based authentication application, or [set up an IIS FBA app](/troubleshoot/aspnet/forms-based-authentication) for testing.

## BIG-IP configuration methods

There are many methods to configure BIG-IP for this scenario, including a template-driven guided configuration. This article covers the advanced approach, which provides a more flexible way of implementing SHA by manually creating all BIG-IP configuration objects. You would also use this approach for more complex scenarios that the guided configuration templates don't cover.

> [!NOTE]
> You should replace all example strings or values in this article with those for your actual environment.

## Register F5 BIG-IP in Azure AD

Before BIG-IP can hand off pre-authentication to Azure AD, it must be registered in your tenant. This is the first step in establishing SSO between both entities. It's no different from making any IdP aware of a SAML relying party. In this case, the app that you create from the F5 BIG-IP gallery template is the relying party that represents the SAML SP for the BIG-IP published application.

1. Sign in to the [Azure AD portal](https://portal.azure.com) by using an account with Application Administrator permissions.

2. From the left pane, select the **Azure Active Directory** service.

3. On the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant.

4. On the **Enterprise applications** pane, select **New application**.

5. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons that indicate whether they support federated SSO and provisioning. 

   Search for **F5** in the Azure gallery, and select **F5 BIG-IP APM Azure AD integration**.

6. Provide a name for the new application to recognize the instance of the application. Select **Add/Create** to add it to your tenant.

### Enable SSO to F5 BIG-IP

Next, configure the BIG-IP registration to fulfill SAML tokens that the BIG-IP APM requests:

1. In the **Manage** section of the left menu, select **Single sign-on** to open the **Single sign-on** pane for editing.

2. On the **Select a single sign-on method** page, select **SAML** followed by **No, I'll save later** to skip the prompt.

3. On the **Set up single sign-on with SAML** pane, select the pen icon to edit **Basic SAML Configuration**. Make these edits:

   1. Replace the predefined **Identifier** value with the full URL for the BIG-IP published application.

   2. Replace the **Reply URL** value but retain the path for the application's SAML SP endpoint. 
   
      In this configuration, the SAML flow would operate in IdP-initiated mode. In that mode, Azure AD issues a SAML assertion before the user is redirected to the BIG-IP endpoint for the application. 

   3. To use SP-initiated mode, populate **Sign on URL** with the application URL.

   4. For **Logout Url**, enter the BIG-IP APM single logout (SLO) endpoint prepended by the host header of the service that's being published. This step ensures that the user's BIG-IP APM session ends after the user is signed out of Azure AD. 

     ![Screenshot showing a basic SAML configuration.](./media/f5-big-ip-forms-advanced/basic-saml-configuration.png)

    > [!NOTE]
    > From TMOS v16, the SAML SLO endpoint has changed to **/saml/sp/profile/redirect/slo**.

4. Select **Save** before closing the SAML configuration pane and skip the SSO test prompt.

5. Note the properties of the **User Attributes & Claims** section. Azure AD will issue these properties to users for BIG-IP APM authentication and for SSO to the back-end application.

6. On the **SAML Signing Certificate** pane, select **Download** to save the **Federation Metadata XML** file to your computer.

   ![Screenshot of the 'Federation Metadata XML' download link.](./media/f5-big-ip-forms-advanced/saml-certificate.png)

SAML signing certificates created by Azure AD have a lifespan of three years. For more information, see [Managed certificates for federated single sign-on](./manage-certificates-for-federated-single-sign-on.md).

### Assign users and groups

By default, Azure AD will issue tokens only for users who have been granted access to an application. To grant specific users and groups access to the application:

1. On the **F5 BIG-IP application's overview** pane, select **Assign Users and groups**.

2. Select **+ Add user/group**.

3. Select users and groups, and then select **Assign** to assign them to your application.   

## BIG-IP Advanced configuration

Now you can proceed with setting up the BIG-IP configurations.

### Configure SAML service provider settings

SAML service provider settings define the SAML SP properties that the APM will use for overlaying the legacy application with SAML pre-authentication. To configure them:

1. Select **Access** > **Federation** > **SAML Service Provider** > **Local SP Services**, and then select **Create**.

   ![Screenshot showing the F5 forms configuration.](./media/f5-big-ip-forms-advanced/f5-forms-configuration.png)

1. On the **Create New SAML SP Service** pane, provide a name and the same entity ID that you defined earlier in Azure AD.

   ![Screenshot of the 'Create New SAML SP Service' pane, showing the name and entity ID of the new SAML service provider service.](./media/f5-big-ip-forms-advanced/saml-sp-service.png)

    The values in the **SP Name Settings** section are required only if the entity ID isn't an exact match of the hostname portion of the published URL or, equally, if the entity ID isn't in regular hostname-based URL format. Provide the external scheme and hostname of the application that's being published if the entity ID is *urn:myvacation:contosoonline*.

### Configure an external IdP connector

A SAML IdP connector defines the settings that are required for the BIG-IP APM to trust Azure AD as its SAML IdP. These settings map the SAML service provider to a SAML IdP, which establishes the federation trust between the APM and Azure AD. To configure the connector:

1. Select the new SAML service provider object, and then select **Bind/UnbBind IdP Connectors**.

   ![Screenshot showing local service provider services and the 'Bind/Unbind IdP Connectors' button.](./media/f5-big-ip-forms-advanced/local-services.png)

1. In the **Create New IdP Connector** dropdown list, select **From Metadata**.

   ![Screenshot showing the 'From Metadata' option in the 'Create New IdP Connector' dropdown list.](./media/f5-big-ip-forms-advanced/from-metadata.png)
  
1. On the **Create New SAML IdP Connector** pane, browse for the Federation Metadata XML file that you downloaded earlier, and then provide an **Identity Provider Name** for the APM object that will represent the external SAML IdP (for example, *MyVacation\_AzureAD*).

   ![Screenshot of the 'Create New SAML IdP Connector' pane for creating a new IdP SAML connector.](./media/f5-big-ip-forms-advanced/new-idp-saml-connector.png)

1. Select **Add New Row** to choose the new **SAML IdP Connector**, and then select **Update**.
  
   ![Screenshot showing how to add a new row.](./media/f5-big-ip-forms-advanced/add-new-row.png)

1. Select **OK** to save your settings.

   ![Screenshot of the 'Edit SAML IdPs that use this SP' pane.](./media/f5-big-ip-forms-advanced/edit-saml-idp-using-sp.png)

### Configure Forms-based SSO

In this section, you create an APM SSO object for performing FBA SSO to back-end applications. 

You can perform FBA SSO in either client-initiated mode or by the BIG-IP itself. Both methods emulate a user logon by injecting credentials into the username and password tags before auto submitting the form. The flow is almost transparent, except that users have to provide their password once when they access an FBA application. The password is then cached for reuse across other FBA applications.

This covers the APM approach, which manages SSO directly for the back-end application.

Select **Access** > **Single Sign-on** > **Forms Based**, select **Create**, and then provide the following values:

|Property | Description |
|:------|:---------|
| Name | Use a descriptive name for the configuration, because an SSO APM object can be reused by other published applications. For example, use *Contoso\FBA\sso*.|
| Use SSO Template | None |
| Username Source | The preferred username source for pre-filling the password collection form. You can use any APM session variable, but the default *session.sso.token.last.username* tends to work best, because it contains the logged-in users' Azure AD UPN. |
| Password Source | Keep the default *session.sso.token.last.password*, it's the APM variable that the BIG-IP will use to cache the password that's provided by users. |
| | |

![Screenshot showing a new SSO configuration.](./media/f5-big-ip-forms-advanced/new-sso-configuration.png)

|Property | Description |
|:------|:---------|
| Start URI | The logon URI of your FBA application. The APM form-based authentication executes SSO when the request URI matches this URI value.|
| Form Actions | Leave this value blank so that the original request URL is used for SSO. |
| Form Parameter for Username | The element name of your logon form's username field. Use your browser's dev tools to determine this.| 
| Form Parameter for Password | The element name of your logon form's password field. Use your browser's dev tools to determine this.|
| | |

![Screenshot of the SSO Method Configuration pane.](./media/f5-big-ip-forms-advanced/sso-method-configuration.png)

![Screenshot of the Contoso 'My Vacation logon' webpage.](./media/f5-big-ip-forms-advanced/contoso-example.png)

For more information about configuring an APM for FBA SSO, go to the F5 [Single Sign-On Methods](https://techdocs.f5.com/en-us/bigip-14-1-0/big-ip-access-policy-manager-single-sign-on-concepts-configuration-14-1-0/single-sign-on-methods.html#GUID-F8588DF4-F395-4E44-881B-8D16EED91449) site.

### Configure an Access profile

An access profile binds many APM elements managing access to BIG-IP virtual servers, including access policies, SSO configuration, and UI settings.

1. Select **Access** > **Profiles / Policies** > **Access Profiles (Per-Session Policies)** > **Create**, and then provide the following values:

   | Property | Description |
   |:-----|:-------|
   | Name | For example, *MyVacation* |
   |Profile Type | All |
   | SSO Configuration | The FBA SSO configuration object you just created|
   |Accepted Language | Add at least one language|
   | | |

   ![Screenshot showing how to create a new access profile.](./media/f5-big-ip-forms-advanced/create-new-access-profile.png)

1. Modify the session policy to present a logon page with the username pre-filled. To launch the APM Visual Policy Editor, select the **Edit** link next to the per-session profile you just created.

   ![Screenshot showing edit per-session policy](./media/f5-big-ip-forms-advanced/edit-per-session-policy.png)

1. In the APM Visual Policy Editor, select the **+** sign next to the
   fallback.

   ![Screenshot of the APM Visual Policy Editor showing the plus sign (+) next to the fallback.](./media/f5-big-ip-forms-advanced/vpe-launched.png)

1. In the pop-up window, select **Authentication**, select **SAML Auth**, and then select **Add Item**.

   ![Screenshot showing the 'SAML Auth' control selected and the 'Add Items' button.](./media/f5-big-ip-forms-advanced/saml-auth-add-item.png)

1. On the **SAML authentication SP** configuration pane, change the name to **Azure AD Auth** and then, in the **AAA Server** dropdown list, enter the SAML service provider object that you created earlier.

   ![Screenshot showing the Azure AD Authentication server settings.](./media/f5-big-ip-forms-advanced/azure-ad-auth-server.png)

1. Select the **+** sign on the **Successful** branch.

1. In the pop-up window, select **Authentication**, select **Logon Page**, and then select **Add Item**.

   ![Screenshot shows logon page settings](./media/f5-big-ip-forms-advanced/logon-page.png)

1. In the **Read Only** column for the **username** field, in the dropdown list, select **Yes**.

   ![Screenshot showing the username 'Read Only' option changed to 'Yes'.](./media/f5-big-ip-forms-advanced/set-read-only-as-yes.png)

1. Add an SSO Credential Mapping object by selecting the plus sign (**+**) for the logon page fallback.

1. In the pop-up window, select the **Assignment** tab, select **SSO Credential Mapping**, and then select **Add Item**.

    ![Screenshot showing the 'SSO Credential Mapping' option and its description.](./media/f5-big-ip-forms-advanced/sso-credential-mapping.png)

1. On the **Variable Assign: SSO Credential Mapping** pane, keep the default settings, and then select **Save**.

    ![Screenshot showing the 'Save' button on the 'Variable Assign: SSO Credential Mapping' pane.](./media/f5-big-ip-forms-advanced/save-sso-credential-mapping.png)

1. Select the link in the upper **Deny** box to change the **Successful** branch to **Allow**, and then select **Save**.

      **(Optional) Configure attribute mappings**

      Although it's optional, adding a LogonID_Mapping configuration enables the BIG-IP active sessions list to display the UPN of the logged-in user instead of a session number. This information is useful when you're analyzing logs or troubleshooting.

1. Select the plus (**+**) symbol for the **SAML Auth Successful** branch.

1. In the pop-up dialog, select **Assignment** > **Variable Assign** > **Add Item**.

   ![Screenshot showing the 'Variable Assign' option and its description.](./media/f5-big-ip-forms-advanced/variable-assign.png)

1. On the **Properties** pane, enter a descriptive name (for example,
*LogonID_Mapping*) and, under **Variable Assign**, select **Add new entry** > **change**.

   ![Screenshot showing the 'Add new entry' field.](./media/f5-big-ip-forms-advanced/add-new-entry.png)

1. Set both variables:

   | Property | Description |
   |:-----|:-------|
   | Custom Variable | `session.logon.last.username` |
   | Session Variable | `session.saml.last.identity`|
   | | |

1. Select **Finished** > **Save**.

1. Commit those settings by selecting **Apply Access Policy** and then close the Visual Policy Editor.

   ![Screenshot showing the 'Apply Access Policy' pane.](./media/f5-big-ip-forms-advanced/apply-access-policy.png)

### Configure a back-end pool

For the BIG-IP to know where to forward client traffic, you need to create a BIG-IP node object that represents the back-end server that hosts your application. Then, place that node in a BIG-IP server pool.

1. Select **Local Traffic** > **Pools** > **Pool List** > **Create** and provide a name for a server pool object. For example, enter **MyApps_VMs**.

   ![Screenshot shows pool list](./media/f5-big-ip-forms-advanced/pool-list.png)

1. Add a pool member object with the following resource details:

   | Property | Description |
   |:-----|:-------|
   | Node Name: | Optional display name for the server that hosts the back-end web application |
   | Address: | IP address of the server that hosts the application |
   | Service Port: | HTTP/S port that the application is listening on |
   | | |

   ![Screenshot showing the pool member properties.](./media/f5-big-ip-forms-advanced/pool-member.png)

>[!NOTE]
>Health monitors require [additional configuration](https://support.f5.com/csp/article/K13397) that this article doesn't cover.  

### Configure a virtual server

A *virtual server* is a BIG-IP data-plane object that's represented by a virtual IP address that listens for client requests to the application. Any received traffic is processed and evaluated against the APM access profile that's associated with the virtual server. The traffic is then directed according to the policy results and settings.

To configure a virtual server:

1. Select **Local Traffic** > **Virtual Servers** > **Virtual Server List** > **Create**.

3. Provide the virtual server with a Name value and an IPv4/IPv6 address that isn't already allocated to an existing BIG-IP object or device on the connected network. The IP address will be dedicated to receiving client traffic for the published back-end application. Then set Service Port to 443.

   ![Screenshot showing the virtual server properties.](./media/f5-big-ip-forms-advanced/virtual-server.png)  
 
3. Set **HTTP Profile (Client)** to **http**.

1. Enable a virtual server for Transport Layer Security to allow services to be published over HTTPS. For **SSL Profile (Client)**, select the profile that you created as part of the prerequisites. (Or leave the default if you're testing.)

   ![Screenshot showing an SSL profile.](./media/f5-big-ip-forms-advanced/ssl-profile.png)

1. Change the **Source Address Translation** to **Auto Map**.

   ![Screenshot showing that 'Auto Map' is selected.](./media/f5-big-ip-forms-advanced/auto-map.png)

1. Under **Access Policy**, in the **Access Profile** box, enter the name you created earlier. This action binds the Azure AD SAML pre-authentication profile and FBA SSO policy to the virtual server.

   ![Screenshot showing the 'Access Policy' pane.](./media/f5-big-ip-forms-advanced/access-policy.png)

1. Set **Default Pool** to use the back-end pool objects that you created in the previous section. Then select **Finished**.

   ![Screenshot showing the 'Default Pool' setting on the 'Resources' pane.](./media/f5-big-ip-forms-advanced/default-pool.png)

### Configure Session management settings

BIG-IP's session management settings define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. You can create your own policy here. Go to Access Policy > Access Profiles > Access Profile and select your application from the list.

If you've defined a Single Logout URI value in Azure AD, it will ensure that an IdP-initiated sign-out from the MyApps portal also ends the session between the client and the BIG-IP APM. The imported application's federation metadata XML file provides the APM with the Azure AD SAML logout endpoint for SP-initiated sign-outs. But for this to be truly effective, the APM needs to know exactly when a user signs out.

Consider a scenario where a BIG-IP web portal is not used. The user has no way of instructing the APM to sign out. Even if the user signs out of the application itself, BIG-IP is technically oblivious to this, so the application session could easily be reinstated through SSO. For this reason, SP-initiated sign-out needs careful consideration to ensure that sessions are securely terminated when they're no longer required.

One way to achieve this is by adding an SLO function to your application's sign-out button. This function can redirect your client to the Azure AD SAML sign-out endpoint. You can find this SAML sign-out endpoint at App Registrations > Endpoints.

If you can't change the app, consider having BIG-IP listen for the app's sign-out call. When it detects the request, it should trigger SLO.

For more information about using BIG-IP iRules to achieve this, see the following F5 articles: 
* [K42052145: Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145)
* [K12056: Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056)


## Summary

Your application should now be published and accessible via secure hybrid access, either directly via the app's URL or through the Microsoft application portals.

The application should also be visible as a target resource in Azure AD CA. For more information, see [Building a Conditional Access policy](../conditional-access/concept-conditional-access-policies.md).

For increased security, organizations that use this pattern could also consider blocking all direct access to the application, which then forces a strict path through the BIG-IP.

## Next steps

From a browser, connect to the application's external URL or select the application's icon in the MyApps portal. After you authenticate to Azure AD, you’re redirected to the BIG-IP endpoint for the application and prompted for a password. Notice that the APM pre-fills the username with the UPN from Azure AD. The username that's pre-populated by the APM is read only to ensure session consistency between Azure AD and the back-end application. You can hide this field from view with an additional configuration, if necessary.

![Screenshot showing secured SSO.](./media/f5-big-ip-forms-advanced/secured-sso.png)

After the information is submitted, users should be automatically signed in to the application.

![Screenshot showing a welcome message.](./media/f5-big-ip-forms-advanced/welcome-message.png)

## Troubleshoot

Failure to access the secure hybrid access-protected application can result from any of several factors, including a misconfiguration. When you troubleshoot this issue, be aware of the following:

- FBA SSO is performed by the BIG-IP as it parses the logon form at the specified URI and looks for the username and password element tags that are defined in your configuration.

- Element tags need to be consistent, or SSO will fail. More complex forms that are generated dynamically might require you to analyze them closer by using dev tools to understand the makeup of the logon form.

- A client-initiated approach might be better suited for logon pages that contain multiple forms, because it lets you specify a form name and even customize the JavaScript form handler logic.

- Both FBA SSO methods optimize the user experience and security by hiding all form interactions. In some cases, though, it might be useful to validate whether the credentials are actually being injected. You can do this in client-initiated mode by disabling the form auto submit setting in your SSO profile and then using dev tools to disable the two style properties that prevent the logon page from being displayed.

  ![Screenshot showing the properties page.](./media/f5-big-ip-forms-advanced/properties.png)

BIG-IP logs are a great source of information for isolating all sorts of authentication and SSO issues. When you troubleshoot an issue, you should increase the log verbosity level by doing the following:

1. Go to **Access Policy** > **Overview** > **Event Logs** > **Settings**.

1. Select the row for your published application, and then select **Edit** > **Access System Logs**.

1. In the SSO list, select **Debug**, and then select **OK**. Reproduce your issue before you look at the logs, but remember to switch this setting back when you're finished.

If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it's possible that the issue relates to SSO from Azure AD to the BIG-IP.

Go to **Access** > **Overview** > **Access reports**, and then run the report for the last hour to see whether the logs provide any clues. The **View session variables** link for your session will also help you understand whether the APM is receiving the expected claims from Azure AD.

If you don't see a BIG-IP error page, the issue is probably more related to the back-end request or SSO from the BIG-IP to the
application. If this is the case, select **Access Policy** > **Overview** > **Active Sessions**, and then select the link for your active session.

The **View Variables** link in this location might also help determine the root cause, particularly if the APM fails to obtain the right user identifier and password.

For more information, see the F5 BIG-IP [Session Variables reference](https://techdocs.f5.com/en-us/bigip-15-0-0/big-ip-access-policy-manager-visual-policy-editor/session-variables.html).

## Additional resources

* [Active Directory Authentication](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/2.html) (F5 article about BIG-IP advanced configuration)

* [Forget passwords, go passwordless](https://www.microsoft.com/security/business/identity/passwordless)

* [What is Conditional Access?](../conditional-access/overview.md)

* [Zero Trust framework to enable remote work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/)
