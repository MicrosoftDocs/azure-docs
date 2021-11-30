---
title: F5 BIG-IP APM and Azure AD SSO to forms based authentication applications
description: Learn how to integrate F5's BIG-IP Access Policy Manager (APM) and Azure Active Directory for secure hybrid access to forms-based applications.
author: gargi-sinha
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 10/20/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Azure Active Directory with F5 BIG-IP for forms-based authentication Single sign-on

In this tutorial, you'll learn how to integrate F5's BIG-IP Access Policy Manager (APM) and Azure Active Directory (Azure AD) for secure hybrid access to forms-based applications.

Integrating BIG-IP published applications with Azure AD provides many benefits, including:

- Improved Zero trust governance through Azure AD pre-authentication and authorization

- Full Single sign-on (SSO) between Azure AD and BIG-IP published services

- Manage Identities and access from a single control plane - The [Azure portal](https://portal.azure.com)

To learn about all of the benefits see the article on [F5 BIG-IP and Azure AD integration.](f5-aad-integration.md) and [what is application access and single sign-on with Azure AD](../active-directory-appssoaccess-whatis.md).

## Scenario description

For this scenario, we have an internal legacy application configured for forms-based authentication (FBA).

The ideal scenario is to have the application managed and governed directly through Azure AD, but as it lacks any form of modern protocol interop, would take considerable effort and time to modernize, introducing inevitable costs and risks of potential downtime.

Instead, a BIG-IP Virtual Edition (VE) deployed between the internet and the internal Azure VNet the application is connected to will be used to gate inbound access, with Azure AD for its extensive choice of authentication and authorization capabilities.

Having a BIG-IP in front of the application enables us to overlay the service with Azure AD pre-authentication and forms-based SSO, significantly improving the overall security posture of the application, allowing the business to continue operating at pace, without interruption.

User credentials cached by the BIG-IP APM are then available for SSO against other forms based-authentication applications.

## Scenario Architecture

The secure hybrid access solution for this scenario is made up of the following:

**Application**: Backend service to be protected by Azure AD and BIG-IP secure hybrid access. This particular application validates user credentials against Active Directory (AD), but this could be any directory including LDS (AD Lightweight Directory Services), open source, etc.

**Azure AD**: The SAML Identity Provider (IdP), responsible for
verification of user credentials, Conditional Access (CA), and SSO to the BIG-IP APM.

**BIG-IP**: Reverse proxy and SAML service provider (SP) to the
application, delegating authentication to the SAML IdP, before
performing forms-based SSO to the backend application.

![Screenshot shows the flow diagram](./media/f5-big-ip-forms-advanced/flow-diagram.png)

| Steps | Description|
|:-------|:----------|
| 1. | User connects to application's SAML SP endpoint (BIG-IP APM).|
| 2. | APM access policy redirects user to SAML IdP (Azure AD) for pre-authentication.|
| 3. | Azure AD authenticates user and applies any enforced Conditional Access policies.|
| 4. | User is redirected back to SAML SP with issued token and claims. |
| 5. | BIG-IP prompts user for application password and stores in cache. |
| 6. | BIG-IP sends request to application and receives a login form.|
| 7. | APM scripting auto responds filling in username and password before submitting form.|
| 8. | Application payload is served by webserver and sent to the client. Optionally, APM detects successful logon by examining response headers, looking for cookie or redirect URI.|

## Prerequisites

Prior BIG-IP experience is not necessary, but you'll need:

- An Azure AD free subscription or above

- An existing BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in Azure](f5-bigip-deployment-guide.md)

- Any of the following F5 BIG-IP license SKUs

  - F5 BIG-IP&reg; Best bundle

  - F5 BIG-IP Access Policy Manager&trade; (APM) standalone license

  - F5 BIG-IP Access Policy Manager&trade; (APM) add-on license on
  existing BIG-IP F5 BIG-IP&reg; Local Traffic Manager&trade; (LTM)

  - 90-day BIG-IP full feature [trial
  license](https://www.f5.com/trial/big-ip-trial.php)

- User identities
    [synchronized](../hybrid/how-to-connect-sync-whatis.md)
    from an on-premises directory to Azure AD

- An account with Azure AD application admin [permissions](../roles/permissions-reference.md#application-administrator)

- [SSL certificate](f5-bigip-deployment-guide.md#ssl-profile) for publishing services over HTTPS or use default certs while testing

- An existing forms-based authentication application or [setup an IIS FBA app](/troubleshoot/aspnet/forms-based-authentication) for testing

## Deployment modes

Several methods exist for configuring a BIG-IP for this scenario. This tutorial covers the advanced approach, which provides a more
flexible approach at implementing secure hybrid access by manually creating all BIG-IP configuration objects. You would use this approach for scenarios not covered by the template based Guided Configuration.

>[!NOTE]
>All example strings or values referenced throughout this article should be replaced with those for your actual environment.

## Adding F5 BIG-IP from the Azure AD gallery

Setting up a SAML federation trust between BIG-IP APM and Azure AD is one of the first step in implementing secure hybrid access. It establishes the integration required for BIG-IP to hand off pre-authentication and [CA](../conditional-access/overview.md)
to Azure AD, before granting access to the published service.

1. Sign-in to the **Azure portal** using an account with application administrative rights

2. From the left navigation pane, select the **Azure Active Directory** service

3. Go to **Enterprise Applications** and from the top ribbon select **+ New application**

4. Search for **F5** in the gallery and select **F5 BIG-IP APM Azure AD integration**

5. Provide a name for the application, followed by **Add/Create** to add it to your tenant. The name should reflect that specific service.

## Configure Azure AD SSO

1. With the new **F5** application properties in view, go to **Manage** > **Single sign-on**

2. On the **Select a single sign-on method** page, select **SAML and** skip the prompt to save the single sign-on settings by selecting **No, I'll save later**

3. On the **Set up single sign-on with SAML** blade, select the pen icon for **Basic SAML Configuration** to provide the following:

   a. Replace the pre-defined **Identifier** URL with the URL for your BIG-IP published service. For example, `https://myvacation.contoso.com`

   b. Do the same with the **Reply URL** but include the path for APM's SAML endpoint. For example, `https://myvacation.contoso.com/saml/sp/profile/post/acs`

      >[!NOTE]
      >In this configuration the SAML flow would operate in IdP initiated mode, where Azure AD issues the user with a SAML assertion before they are redirected to the BIG-IP  service endpoint for the application. The BIG-IP APM supports both, IdP and SP initiated modes.

   c. For the `Logout URI` enter the BIG-IP APM single logout (SLO) endpoint pre-pended by the host header of the service being published. `Providing an SLO URI` ensures the user's BIG-IP APM session is also terminated after being signed out of Azure AD. For example, `https://myvacation.contoso.com/saml/sp/profile/redirect/slr`

     ![Screenshot shows editing basic SAML configuration](./media/f5-big-ip-forms-advanced/basic-saml-configuration.png)

     >[!Note]
     > From TMOS v16 the SAML SLO endpoint has changed to /saml/sp/profile/redirect/slo

4. Select **Save** before exiting the SAML configuration blade and skip the SSO test prompt.

   Observe the properties of the **User Attributes & Claims** section, as these are what Azure AD will issue users for BIG-IP APM authentication and SSO to the backend application.

5. In the **SAML Signing Certificate** section, select the **Download** button to save the **Federation Metadata XML** file to your computer.

   ![Screenshot of federation metadata download link](./media/f5-big-ip-forms-advanced/saml-certificate.png)

   SAML signing certificates created by Azure AD have a lifespan of 3 years and should be managed using the published
   [guidance](manage-certificates-for-federated-single-sign-on.md).

### Azure AD authorization

By default, Azure AD will only issue tokens to users that have been granted access to an application.

1. In the application's configuration view, select **Users and groups**

2. Select **+** **Add user** and in the **Add Assignment** blade select **Users and groups**

3. In the **Users and groups** dialog, add the groups of users authorized to access the internal application, followed by **Select** \> **Assign**

This completes the Azure AD part of the SAML federation trust. The BIG-IP APM can now be set up to publish the internal web application and configured with a corresponding set of properties to complete the trust for SAML pre-authentication and SSO.

## Advanced configuration

### Service provider

These settings define the SAML SP properties that the APM will use for overlaying the legacy application with SAML pre-authentication.

1. Select **Access** > **Federation** > **SAML Service Provider** > **Local SP Services** > **Create**

   ![Screenshot shows F5 forms configuration](./media/f5-big-ip-forms-advanced/f5-forms-configuration.png)

2. **Provide a Name** and the exact same **Entity ID** defined in Azure AD earlier.

   ![Sceenshot shows new saml sp service](./media/f5-big-ip-forms-advanced/saml-sp-service.png)

    **SP Name Settings** are only required if the entity ID is not an exact match of the hostname portion of the published URL, or equally if it isn't in regular hostname-based URL format. Provide the external scheme and hostname of the application being published if entity ID is  `urn:myvacation:contosoonline`.

### External IdP connector

A SAML IdP connector defines the settings required for the BIG-IP APM to trust Azure AD as its SAML IDP. These settings will map the SAML SP to a SAML IdP, establishing the federation trust between the APM and Azure AD.

1. Scroll down to select the new SAML SP object and select **Bind/UnBind IdP Connectors**

   ![Sceenshot shows local sp services](./media/f5-big-ip-forms-advanced/local-services.png)

2. Select **Create New IdP Connector** and from the drop-down menu choose **From Metadata**

   ![Sceenshot shows from metadata dropdown](./media/f5-big-ip-forms-advanced/from-metadata.png)
  
3. Browse to the federation metadata XML file you downloaded  earlier and provide an **Identity Provider Name** for the APM object that will represent the external SAML IdP. For example, `MyVacation\_AzureAD`

   ![Sceenshot shows new idp saml connector](./media/f5-big-ip-forms-advanced/new-idp-saml-connector.png)

4. Select **Add New Row** to choose the new **SAML IdP Connector**, followed by **Update**
  
   ![Sceenshot shows add new row](./media/f5-big-ip-forms-advanced/add-new-row.png)

5. Select **OK to save those settings**

   ![Sceenshot shows edit saml idp that uses this sp](./media/f5-big-ip-forms-advanced/edit-saml-idp-using-sp.png)

### Forms-based SSO

FBA SSO can be performed in either client initiated mode or by the BIG-IP itself. Both methods emulate user login by injecting credentials into the username and password tags before auto submitting the form. The flow's almost transparent, except for users having to provide their password once, on accessing an FBA application. The password is then cached for reuse across other FBA applications.

This covers the APM approach, which handles SSO directly to the backend application.

Select **Access** > **Single Sign-on** > **Forms Based** > **Create** and provide the following:

|Property | Description |
|:------|:---------|
| Name | An SSO APM object can be reused by other published applications, so use a descriptive name for the config. For example, `Contoso\FBA\sso`|
| Use SSO Template | None |
| Username Source | The preferred username source for pre-filling the password collection form. Any APM session variable can be used but the default `session.sso.token.last.username` tends to work best as it holds the logged in users' Azure AD UPN |
| Password Source | Leave the default `session.sso.token.last.password` as that's the APM variable the BIG-IP will use to cache the password provided by users |

![Sceenshot shows new sso configuration](./media/f5-big-ip-forms-advanced/new-sso-configuration.png)

|Property | Description |
|:------|:---------|
| Start URI | The login URI of your FBA application. The APM form-based authentication will execute SSO when the request URI matches this URI value.|
| Form Actions | Leave blank so the original request URL is used for SSO |
| Form Parameter for Username | The element name of your login forms' username field. User your browser's dev tools to determine this.| 
| Form Parameter for Password | The element name of your login forms' password field. Same, use dev tools.|

![Sceenshot shows sso method configuration](./media/f5-big-ip-forms-advanced/sso-method-configuration.png)

![Sceenshot shows contoso my vacation sign in page](./media/f5-big-ip-forms-advanced/contoso-example.png)

More details on configuring an APM for FBA SSO are available
[here](https://techdocs.f5.com/en-us/bigip-14-1-0/big-ip-access-policy-manager-single-sign-on-concepts-configuration-14-1-0/single-sign-on-methods.html#GUID-F8588DF4-F395-4E44-881B-8D16EED91449).

### Access profile configuration

An access profile binds many APM elements managing access to BIG-IP virtual servers, including access policies, SSO configuration, and UI settings.

1. Select **Access** > **Profiles / Policies** > **Access Profiles (Per-Session Policies)** > **Create** to provide the following:

   | Property | Description |
   |:-----|:-------|
   | Name | For example, `MyVacation` |
   |Profile Type | All |
   | SSO Configuration | The FBA SSO configuration object you just created|
   |Accepted Language | Add at least one language|

   ![Sceenshot shows creating a new access profile](./media/f5-big-ip-forms-advanced/create-new-access-profile.png)

2. Modify the session policy to present a logon page with the username prefilled. Select the **Edit** link for the per-session profile you just created to launch the APM Visual Policy Editor (VPE).

   ![Sceenshot shows edit per-session policy](./media/f5-big-ip-forms-advanced/edit-per-session-policy.png)

3. Once the VPE has launched, select the **+** sign next to the
   fallback.

   ![Sceenshot shows + next to the fallback once vpe launched](./media/f5-big-ip-forms-advanced/vpe-launched.png)

4. In the pop-up select **Authentication** > **SAML Auth** > **Add Item**.

   ![Sceenshot shows saml auth and add items button](./media/f5-big-ip-forms-advanced/saml-auth-add-item.png)

5. In the **SAML authentication SP** configuration, change the name to **Azure AD Auth** and set the **AAA Server** to use the SAML SP object you created earlier.

   ![Sceenshot shows azure ad authentication server settings](./media/f5-big-ip-forms-advanced/azure-ad-auth-server.png)

6. Select the **+** sign on the **Successful** branch.

7. In the pop-up select **Authentication** > **Logon Page** > **Add Item**.

   ![Sceenshot shows logon page settings](./media/f5-big-ip-forms-advanced/logon-page.png)

8. Change the **Read Only** option for the username field to **Yes**.

   ![Sceenshot shows set read only to yes](./media/f5-big-ip-forms-advanced/set-read-only-as-yes.png)

9. Add an SSO Credential Mapping object by selecting the **+** sign for the logon page fallback.

10. On the pop-up window, select the **Assignment** > **SSO Credential Mapping** **> Add Item**.

    ![Sceenshot shows sso credential mapping information](./media/f5-big-ip-forms-advanced/sso-credential-mapping.png)

11. Leave the default settings displayed in the pop-up and continue.

    ![Sceenshot shows save sso credential mapping information](./media/f5-big-ip-forms-advanced/save-sso-credential-mapping.png)

12. Select the link in the upper **Deny** box to change the **Successful** branch to **Allow** > **Save**.

**Attribute mapping**

Although optional, adding a LogonID_Mapping configuration enables the BIG-IP active sessions list to display the UPN of the logged in user instead of a session number. This is useful for when analyzing logs or troubleshooting.

1. Select the **+** symbol for the SAML Auth **Successful** branch.

2. In the pop-up select **Assignment** > **Variable Assign** > **Add Item**.

   ![Sceenshot shows variable assign information](./media/f5-big-ip-forms-advanced/variable-assign.png)

3. Provide a descriptive name and in the **Variable Assign**  section select **Add new entry** > **change**. For example,
`LogonID_Mapping`.

   ![Sceenshot shows add new entry field](./media/f5-big-ip-forms-advanced/add-new-entry.png)

4. Set both variables to use the following:

   | Property | Description |
   |:-----|:-------|
   | Custom Variable | `session.logon.last.username` |
   | Session Variable | `session.saml.last.identity`|

   Then after, select **Finished** > **Save**.

5. Commit those settings by selecting **Apply Access Policy** in the top left-hand corner and close the visual policy editor.

   ![Sceenshot shows apply access policy](./media/f5-big-ip-forms-advanced/apply-access-policy.png)

### Backend pool configuration

For the BIG-IP to know where to forward client traffic, you need to create a BIG-IP node object representing the backend server hosting your application. Then after place that node in a BIG-IP server pool.

1. Select **Local Traffic** > **Pools** > **Pool List** > **Create** and provide a name for a server pool object. For example, `MyApps_VMs`.

   ![Sceenshot shows pool list](./media/f5-big-ip-forms-advanced/pool-list.png)

2. Add a pool member object with the following:

   | Property | Description |
   |:-----|:-------|
   | Node Name | Optional display name for the server hosting the backend web application |
   | Address | IP address of the server hosting the application |
   | Service Port | The HTTP/S port the application is listening on |

   ![Sceenshot shows pool member](./media/f5-big-ip-forms-advanced/pool-member.png)

>[!NOTE]
>Health Monitors require additional
[configuration](https://support.f5.com/csp/article/K13397) not covered in this tutorial.

## Virtual server configuration

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for clients requests to the application. Any received traffic is processed and evaluated against the APM access profile associated with the virtual server, before being directed according to the policy results and settings.

1. Select **Local Traffic** > **Virtual Servers** > **Virtual Server List** > **Create**.

2. Provide the virtual server with a **Name,** an unused IP IPv4/IPv6 that can be assigned to the BIG-IP to receive client traffic, and set the **Service Port** to 443.

   ![Sceenshot shows virtual server](./media/f5-big-ip-forms-advanced/virtual-server.png)

3. **HTTP Profile**: Set to http.

4. **SSL Profile (Client)**: Enables Transport Layer Security (TLS), enabling services to be published over HTTPS. Select the client SSL profile you created as part of the pre-reqs or leave the default if testing.

   ![Sceenshot shows ssl profile](./media/f5-big-ip-forms-advanced/ssl-profile.png)

5. Change the **Source Address Translation** to **Auto Map**.

   ![Sceenshot shows auto map](./media/f5-big-ip-forms-advanced/auto-map.png)

6. Under **Access Policy** set the **Access Profile** created earlier. This binds the Azure AD SAML pre-authentication profile and FBA SSO policy to the virtual server.

   ![Sceenshot shows access policy](./media/f5-big-ip-forms-advanced/access-policy.png)

7. Finally, set the **Default Pool** to the backend pool object created in the previous section.

   ![Sceenshot shows default pool](./media/f5-big-ip-forms-advanced/default-pool.png)

## Session management

A BIG-IPs session management settings are used to define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. You can create your own policy by heading to **Access Policy** > **Access Profiles** and selecting your application from the list.

With regard to SLO functionality, having defined a Single Log-Out URI in Azure AD will ensure an IdP initiated sign-out from the MyApps portal also terminates the session between the client and the BIG-IP APM.

Having imported the application's federation metadata.xml then provides the APM with the Azure AD SAML SLO endpoint for SP initiated sign-outs. But for this to be truly effective, the APM needs to know exactly when a user signs-out.

Consider a scenario where a BIG-IP web portal isn't used, the user has no way of instructing the APM to sign out. Even if the user signs-out of the application itself, the BIG-IP is technically oblivious to this, so the application session could easily be reinstated through SSO. For this reason SP initiated sign-out needs careful consideration to ensure sessions are securely terminated when no longer required.

One way of achieving this would be to add an SLO function to your
applications sign out button, so that it can redirect your client to the Azure AD SAML sign-out endpoint. The SAML sign-out endpoint for your tenant can be found in **App Registrations** > **Endpoints**.

If making a change to the app is a no go then consider having the BIG-IP listen for the apps sign-out call, and upon detecting the request have it trigger SLO. More details on using BIG-IP iRules to achieve this are available in [article K42052145](https://support.f5.com/csp/article/K42052145) and [article K12056](https://support.f5.com/csp/article/K12056) from F5.

## Summary

Your application should now be published and accessible via secure hybrid access, either directly via its URL or through Microsoft's application portals.

The application should also be visible as a target resource in Azure AD CA. See the [guidance](../conditional-access/concept-conditional-access-policies.md) for building CA policies.

For increased security, organizations using this pattern could also consider blocking all direct access to the application, thereby forcing a strict path through the BIG-IP.

## Next steps

From a browser, connect to the application's external URL or select the application's icon in the MyApps portal. After authenticating to Azure AD, you’ll be redirected to the BIG-IP endpoint for the application and prompted for a password. Note how the APM pre-fills the username with the UPN from Azure AD. The username pre-populated by the APM is read only to ensure session consistency between Azure AD and backend application. This field could be hidden from view with additional configuration, if necessary.

![Sceenshot shows secured sso](./media/f5-big-ip-forms-advanced/secured-sso.png)

Once submitted, the user should be automatically signed into the
application.

![Sceenshot shows welcome message](./media/f5-big-ip-forms-advanced/welcome-message.png)

## Troubleshoot

Failure to access the secure hybrid access protected application could be down to any number of factors, including a misconfiguration. A few things to be aware of if troubleshooting:

- FBA SSO is performed by the BIG-IP parsing the login form at the specified URI and looking for the username and password element tags defined in your configuration.

- Element tags need to be consistent or SSO will fail. More complex forms generated dynamically may require closer analysis using dev tools to understand the makeup of the login form.

- The client initiated approach may be better suited for login pages containing multiple forms, as it allows specifying a form name and even customizing the JavaScript form handler logic.

- Both FBA SSO methods optimize the user experience and security by hiding all form interactions, but in some cases it may be useful to validate whether credentials are actually being injected. This is possible in client initiated mode by disabling the form auto submit in your SSO profile and then using dev tools to disable the two style properties preventing the login page from being displayed.

  ![Sceenshot shows the properties](./media/f5-big-ip-forms-advanced/properties.png)

BIG-IP logs are a great source of information for isolating all sorts of authentication and SSO issues. When troubleshooting you should increase the log verbosity level.

1. Go to **Access Policy** > **Overview** > **Event Logs** > **Settings**.

2. Select the row for your published application then **Edit** > **Access System Logs**.

3. Select **Debug** from the SSO list then **OK**. Then reproduce your issue before looking at the logs but remember to switch this back when finished.

If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it's possible the issue relates to SSO from Azure AD to the BIG-IP.

Navigate to **Access** > **Overview** > **Access reports** and run the report for the last hour to see logs provide any clues. The **View session variables** link for your session will also help understand if the APM is receiving the expected claims from Azure AD.

If you don't see a BIG-IP error page, then the issue is probably more related to the backend request or SSO from the BIG-IP to the
application. In which case head to **Access Policy** > **Overview** > **Active Sessions** and select the link for your active session.

The **View Variables** link in this location may also help determine root cause, particularly if the APM fails to obtain the right user identifier and password.

See F5's BIG-IP [session variables reference](https://techdocs.f5.com/en-us/bigip-15-0-0/big-ip-access-policy-manager-visual-policy-editor/session-variables.html) for more info.
