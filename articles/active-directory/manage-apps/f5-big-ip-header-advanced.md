---
title: Configure F5 BIG-IP Access Policy Manager for header-based SSO
description: Learn how to configure F5's BIG-IP Access Policy Manager (APM) and Azure Active Directory SSO for header-based authentication
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 11/10/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5 BIG-IP’s Access Policy Manager for header-based SSO

In this article, you’ll learn to implement Secure Hybrid Access (SHA) with single sign-on (SSO) to header-based applications using F5’s BIG-IP advanced configuration.

Configuring BIG-IP published applications with Azure AD provides many benefits, including:

- Improved Zero trust governance through Azure AD pre-authentication and [Conditional Access](../conditional-access/overview.md)

- Full Single sign-on (SSO) between Azure AD and BIG-IP published
  services.

- Manage identities and access from a single control plane, the [Azure portal](https://azure.microsoft.com/features/azure-portal)

To learn about all of the benefits, see the article on [F5 BIG-IP and Azure AD integration](./f5-aad-integration.md) and [what is application access and single sign-on with Azure AD](/azure/active-directory/active-directory-appssoaccess-whatis).

## Scenario description

For this scenario, we have a legacy application using HTTP authorization headers to control access to protected content.

Ideally, application access should be managed directly by Azure AD but being legacy it lacks any form of modern authentication protocol. Modernization would take considerable effort and time, introducing inevitable costs and risk of potential downtime. Instead, a BIG-IP deployed between the public internet and the internal application will be used to gate inbound access to the application.

Having a BIG-IP in front of the application enables us to overlay the service with Azure AD pre-authentication and header-based SSO, significantly improving the overall security posture of the application.


## Scenario architecture

The secure hybrid access solution for this scenario is made up of:

- **Application**: BIG-IP published service to be protected by and Azure AD SHA.

- **Azure AD**: Security Assertion Markup Language (SAML) Identity Provider (IdP) responsible for verification of user credentials, Conditional Access (CA), and SSO to the BIG-IP. Through SSO, Azure AD provides the BIG-IP with any required session attributes including user identifiers.

- **BIG-IP**: Reverse proxy and SAML service provider (SP) to the application, delegating authentication to the SAML IdP, before
performing header-based SSO to the backend application.

![Screenshot shows the architecture flow diagram](./media/f5-big-ip-easy-button-header/sp-initiated-flow.png)

| Step | Description |
|:-------|:-----------|
| 1. | User connects to application's SAML SP endpoint (BIG-IP). |
| 2. | BIG-IP APM access policy redirects user to Azure AD (SAML IdP).|
| 3. | Azure AD pre-authenticates user and applies any enforced CA policies. |
| 4. | User is redirected to BIG-IP (SAML SP) and SSO is performed using issued SAML token. |
| 5. | BIG-IP injects Azure AD attributes as headers in request to the application. |
| 6. | Application authorizes request and returns payload. |


## Prerequisites

Prior BIG-IP experience isn't necessary, but you'll need:

- An Azure AD free subscription or above

- An existing BIG-IP or [deploy a BIG-IP Virtual Edition (VE) in
    Azure](./f5-bigip-deployment-guide.md)

- Any of the following F5 BIG-IP license SKUs

  - F5 BIG-IP® Best bundle

  - F5 BIG-IP Access Policy Manager™ (APM) standalone license

  - F5 BIG-IP Access Policy Manager™ (APM) add-on license on an
    existing BIG-IP F5 BIG-IP® Local Traffic Manager™ (LTM)

  - 90-day BIG-IP full feature [trial
    license](https://www.f5.com/trial/big-ip-trial.php).

- User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md)
from an on-premises directory to Azure AD

- An account with Azure AD application admin [permissions](/azure/active-directory/users-groups-roles/directory-assign-admin-roles#application-administrator)

- [SSL certificate](./f5-bigip-deployment-guide.md#ssl-profile)
for publishing services over HTTPS or use default certificates while testing

- An existing header-based application or [setup a simple IIS header app](/previous-versions/iis/6.0-sdk/ms525396(v=vs.90)) for testing

## BIG-IP configuration methods

There are many methods to configure BIG-IP for this scenario, including two template-based options and an advanced configuration. This article covers the advanced approach, which provides a more flexible way of implementing SHA by manually creating all BIG-IP configuration objects. You would also use this approach for scenarios that the guided configuration templates don't cover.

>[!NOTE]
> All example strings or values in this article should be replaced with those for your actual environment.

## Adding F5 BIG-IP from the Azure AD gallery

Setting up a SAML federation trust between BIG-IP APM and Azure AD is one of the first step in implementing SHA. It establishes the integration required for BIG-IP to hand off pre-authentication and [conditional
access](../conditional-access/overview.md) to Azure AD, before granting access to the published service.

1. Sign-in to the Azure AD portal using an account with application administrative rights.

2. From the left navigation pane, select the **Azure Active Directory** service

3. Go to **Enterprise Applications** and from the top ribbon select **+ New application**

4. Search for **F5** in the gallery and select **F5 BIG-IP APM Azure AD integration**

5. Provide a name for the application, followed by **Add/Create** to add it to your tenant. The name should reflect that specific service.

## Configure Azure AD SSO 

1. With the new **F5** application properties in view, go to
   **Manage** > **Single sign-on**

2. On the **Select a single sign-on method** page, select **SAML** and skip the prompt to save the single sign-on settings by selecting **No, I'll save later**

3. On the **Set up single sign-on with SAML** blade, select the pen icon for **Basic SAML Configuration** to provide the following:

   a. Replace the pre-defined **Identifier** URL with the URL for your BIG-IP published service. For example, `https://mytravel.contoso.com`

   b. Do the same with the **Reply URL** but include the path for the APM's SAML endpoint. For example, `https://mytravel.contoso.com/saml/sp/profile/post/acs`

   >[!NOTE]
   >In this configuration the SAML flow would operate in IdP initiated mode, where Azure AD issues the user with a SAML assertion before they are redirected to the BIG-IP service endpoint for the application. The BIG-IP APM supports both, IdP and SP initiated modes.

   c. For the `Logout URI` enter the BIG-IP APM Single Logout (SLO) endpoint pre-pended by the host header of the service being published. Providing an SLO URI ensures the user's BIG-IP APM session has ended after being signed out of Azure AD. For example, `https://mytravel.contoso.com/saml/sp/profile/redirect/slr`

    ![Screenshot shows the basic saml configuration](./media/f5-big-ip-header-advanced/basic-saml-configuration.png)

    >[!Note]
    >From TMOS v16 the SAML SLO endpoint has changed to
`/saml/sp/profile/redirect/slo`.

4. Select **Save** before exiting the SAML configuration blade and skip the SSO test prompt

5. Select the pen icon to edit the **User Attributes & Claims > + Add new claim**

6. Set the claim properties with the following then select **Save**

   | Property |Description|
   |:------|:---------|
   |Name | Employeeid |
   | Source attribute | user.employeeid |

   ![Screenshot shows manage claims configuration](./media/f5-big-ip-header-advanced/manage-claims.png)

7. Select **+ Add a group claim** and select **Groups assigned to the application** > **Source Attribute** > **sAMAccountName**

   ![Screenshot shows group claims configuration](./media/f5-big-ip-header-advanced/group-claims.png)

8. **Save** the configuration and close the blade

   Observe the properties of the **User Attributes & Claims** section. Azure AD will issue users these properties for BIG-IP APM authentication and SSO to the backend application:

   ![Screenshot shows user attributes and claims configuration](./media/f5-big-ip-header-advanced/user-attributes-claims.png)

   Feel free to add any other specific claims your BIG-IP published application might expect as headers. Any claims defined in addition to the default set will only be issued if they exist in Azure AD. In the same way, Directory [roles or group](../hybrid/how-to-connect-fed-group-claims.md)
   memberships also need defining against a user object in Azure AD before they can be issued as a claim.

9. In the **SAML Signing Certificate** section, select the
   **Download** button to save the **Federation Metadata XML** file to your computer.

   ![Screenshot shows saml signing certificate](./media/f5-big-ip-header-advanced/saml-signing-certificate.png)

SAML signing certificates created by Azure AD have a lifespan of three years and should be managed using the published
[guidance](./manage-certificates-for-federated-single-sign-on.md).

### Azure AD authorization

By default, Azure AD will only issue tokens to users that have been granted access to an application.

1. In the application's configuration view, select **Users and groups**.

2. Select **+** **Add user** and in the **Add Assignment** blade select **Users and groups**.

3. In the **Users and groups** dialog, add the groups of users
   authorized to access the internal header-based application, followed by **Select** > **Assign**

This completes the Azure AD part of the SAML federation trust. The BIG-IP APM can now be set up to publish the internal web application and configured with a corresponding set of properties to complete the trust for SAML pre-authentication.

## Advanced configuration

### SAML configuration

The following steps create the BIG-IP SAML service provider and corresponding SAML IdP objects required to complete federating the published application, with Azure AD.

1. Select **Access** > **Federation** > **SAML Service Provider** > **Local SP Services** > **Create**

   ![Screenshot shows saml service provider create](./media/f5-big-ip-header-advanced/create-saml-sp.png)

2. **Provide a Name** and the exact same **Entity ID** defined in Azure AD earlier

   ![Screenshot shows new saml service provider service ](./media/f5-big-ip-header-advanced/new-saml-sp-information.png)

   **SP Name Settings** are only required if the entity ID isn't an exact match of the hostname portion of the published URL, or equally if it isn't in regular hostname-based URL format. Provide the external scheme and hostname of the application being published if entity ID is
   `urn:mytravel:contosoonline`.

3. Scroll down to select the new SAML SP object and select
   **Bind/UnBind IdP Connectors**.

   ![Screenshot shows new saml service provider object connectors](./media/f5-big-ip-header-advanced/idp-connectors.png)

4. Select **Create New IdP Connector** and from the     drop-down   menu choose **From Metadata**

   ![Screenshot shows edit new saml service idp](./media/f5-big-ip-header-advanced/edit-saml-idp.png)

5. Browse to the federation metadata XML file you downloaded earlier and provide an **Identity Provider Name** for the APM object that will represent the external SAML IdP. For example, `MyTravel_AzureAD`

   ![Screenshot shows new idp connector](./media/f5-big-ip-header-advanced/idp-name.png)

6. Select **Add New Row** to choose the new **SAML IdP Connector**, followed by **Update**

   ![Screenshot shows how to update idp connector](./media/f5-big-ip-header-advanced/update-idp-connector.png)

7. Select **OK** to save the settings

   ![Screenshot shows saving the settings](./media/f5-big-ip-header-advanced/save-settings.png)

### Header SSO configuration

Create an APM SSO object for doing headers SSO to the backend application.

1. Select **Access** > **Profiles/Policies** > **Per-Request Policies** > **Create**

2. Provide a unique profile a name and add at least one **Accepted Language**, then select **Finished.** For example, SSO_Headers

   ![Screenshot shows header configuration](./media/f5-big-ip-header-advanced/header-configuration.png)

3. Select the **Edit** link for the new per-request policy you just created

    ![Screenshot shows edit per-request policy](./media/f5-big-ip-header-advanced/header-configuration-edit.png)

4. After the visual policy editor has launched select the **+** symbol next to fallback

    ![Screenshot shows visual policy editor](./media/f5-big-ip-header-advanced/visual-policy-editor.png)

5. In the pop-up switch to the **General Purpose** tab to select **HTTP Headers** > **Add Item**

    ![Screenshot shows Http header add item](./media/f5-big-ip-header-advanced/add-item.png)

6. Select **Add new entry** to create 3 separate **HTTP** **Header modify** entries using the following:

   | Property | Description |
   |:------|:-------|
   | Header Name | upn |
   | Header Value | %{session.saml.last.identity}|
   | Header Name | employeeid |
   | Header Value | %{session.saml.last.attr.name.employeeid} |
   | Header Name | group\_authz |
   | Header Value | %{session.saml.last.attr.name.`http://schemas.microsoft.com/ws/2008/06/identity/claims/groups`} |

   >[!Note]
   >APM session variables defined within curly brackets are case sensitive. So, entering EmployeeID when the Azure AD attribute name is being sent as employeeid will cause an    attribute mapping failure. Unless necessary, we recommend defining all attributes in lowercase.

   ![Screenshot shows Http header modify](./media/f5-big-ip-header-advanced/http-header-modify.png)

7. When done, select **Save** and close the visual policy editor.

   ![Screenshot shows per request policy done and save](./media/f5-big-ip-header-advanced/per-request-policy-done.png)

### Access profile configuration

An access profile binds many APM elements managing access to BIG-IP virtual servers, including access policies, SSO configuration, and UI settings.

1. Select **Access** > **Profiles / Policies** > **Access Profiles (Per-Session Policies)** > **Create** to provide the following then select **Finished**:

   | Property | Description |
   |:--------|:----------|
   | Name | MyTravel |
   | Profile Type | All |
   | Accepted Language | Add at least one language|

   ![Screenshot shows access profile configuration](./media/f5-big-ip-header-advanced/access-profile-configuration.png)

2. Select the **Edit** link for the per-session profile you just
   created

    ![Screenshot shows editing per session profile](./media/f5-big-ip-header-advanced/edit-per-session-profile.png)

3. Once the visual policy editor has launched, select the **+** symbol next to fallback

   ![Screenshot shows how to launch the visual policy editor](./media/f5-big-ip-header-advanced/visual-policy-editor-launch.png)

4. In the pop-up select **Authentication** > **SAML Auth** > **Add Item**

   ![Screenshot shows adding saml authentication](./media/f5-big-ip-header-advanced/add-saml-auth.png)

5. For the **SAML authentication SP** configuration, set the **AAA Server** option to use the SAML SP object you created earlier, followed by **Save**.

   ![Screenshot shows use aaa server for saml authentication sp](./media/f5-big-ip-header-advanced/aaa-server.png)

### Attribute mapping

Although optional, adding a LogonID_Mapping configuration enables the BIG-IP active sessions list to display the UPN of the logged in user instead of a session number. This is useful for when analyzing logs or troubleshooting.

1. Select the **+** symbol for the SAML Auth **Successful** branch

    ![Screenshot shows how to create a saml authentication branch](./media/f5-big-ip-header-advanced/create-saml-auth-branch.png)

2. In the pop-up select **Assignment** > **Variable Assign** > **Add Item**

   ![Screenshot shows how to assign a variable](./media/f5-big-ip-header-advanced/assign-variable.png)

3. Provide a descriptive name and in the **Variable Assign** section select **Add new entry** > **change.** For example,
LogonID_Mapping.

   ![Screenshot shows how to add a new entry](./media/f5-big-ip-header-advanced/assign-variable-change.png)

4. Set both variables to use the following, then **Finished** >
    **Save**

   | Property | Description |
   |:--------|:----------|
   | Custom Variable | session.saml.last.identity |
   | Session Variable | session.logon.last.username |

5. Select the **Deny** terminal of the Access Policy's **Successful** branch and change it to **Allow**, followed by **Save**

6. Commit the policy by selecting **Apply Access Policy** and close the visual policy editor tab

### Backend pool configuration

For the BIG-IP to know where to forward client traffic, you need to create an APM node object representing the backend server hosting your application, and place that node in an APM pool.

1. Select **Local Traffic > Pools > Pool List > Create** and provide a name for a server pool object. For example, MyApps_VMs

      ![Screenshot shows how apply access policy](./media/f5-big-ip-header-advanced/apply-access-policy.png)

2. Add a pool member object with the following:

    | Property | Description |
    |:--------|:----------|
    | Node Name | Optional display name for the server hosting the backend web application |
    | Address | IP address of the server hosting the application|
    | Service Port | The HTTP/S port the application is listening on |

    ![Screenshot shows how to add pool member object](./media/f5-big-ip-header-advanced/add-object.png)

>[!NOTE]
>Health monitors require additional
[configuration](https://support.f5.com/csp/article/K13397) not covered in this tutorial.

## Virtual server configuration

A virtual server is a BIG-IP data plane object represented by a virtual IP address listening for clients requests to the application. Any received traffic is processed and evaluated against the APM access profile associated with the virtual server, before being directed according to the policy results and settings.

1. Select **Local Traffic** > **Virtual Servers** > **Virtual Server List** > **Create**

2. Provide the virtual server with a **Name,** an unused IP IPv4/IPv6 that can be assigned to the BIG-IP to receive client traffic, and set the **Service Port** to 443

   ![Screenshot shows how to add new virtual server](./media/f5-big-ip-header-advanced/new-virtual-server.png)

3. **HTTP Profile**: Set to http

4. **SSL Profile (Client)**: Enables Transport Layer Security    (TLS), enabling services to be published over HTTPS. Select the client SSL profile you created as part of the pre-requisites or leave the default if testing

   ![Screenshot shows the ssl profile client](./media/f5-big-ip-header-advanced/ssl-profile.png)

5. Change the **Source Address Translation** option to **Auto Map**

   ![Screenshot shows the auto map option](./media/f5-big-ip-header-advanced/change-source-address.png)

6. Under **Access Policy**, set the **Access Profile** created earlier. This binds the Azure AD SAML pre-authentication profile and headers SSO policy to the virtual server.

   ![Screenshot shows how to set the access profile](./media/f5-big-ip-header-advanced/set-access-profile.png)

7. Finally, set the **Default Pool** to use the backend pool objects created in the previous section, then select **Finished**.

   ![Screenshot shows how to set default pool](./media/f5-big-ip-header-advanced/default-pool.png)

## Session management

A BIG-IPs session management setting is used to define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. You can create your own policy by heading to **Access Policy** > **Access Profiles** and selecting your application from the list.

Regarding SLO functionality, having defined a SLO URI in Azure AD will ensure an IdP initiated sign out from the MyApps portal also terminates the session between the client and the BIG-IP APM. Having imported the application's federation metadata.xml then provides the APM with the Azure AD SAML log-out endpoint for SP initiated sign-outs. But for this to be truly effective, the APM needs to know exactly when a user signs-out.

Consider a scenario where a BIG-IP web portal isn't used, the user has no way of instructing the APM to sign out. Even if the user signs-out of the application itself, the BIG-IP is technically oblivious to this, so the application session could easily be reinstated through SSO. For this reason SP initiated sign-out needs careful consideration to ensure sessions are securely terminated when no longer required.

One way of achieving this would be to add an SLO function to your
applications sign out button, so that it can redirect your client to the Azure AD SAML sign-out endpoint. The SAML sign-out endpoint for your tenant can be found in **App Registrations** > **Endpoints**.

If making a change to the app is a no go then consider having the BIG-IP listen for the apps sign-out call, and upon detecting the request have it trigger SLO. More details on using BIG-IP iRules to achieve this are available in [article K42052145](https://support.f5.com/csp/article/K42052145) and
[article K12056](https://support.f5.com/csp/article/K12056).

## Summary

This last step provides break down of all applied settings before they are committed. Select **Deploy** to commit all settings and verify that the application has appeared in your tenant.

Your application is now published and accessible via SHA, either directly via its URL or through Microsoft's application portals.


## Next steps

As a user, launch a browser and connect to the application's external URL or select the application's icon in the Microsoft MyApps portal. After authenticating to Azure AD, you'll be redirected to the BIG-IP virtual server for the application and automatically signed in through SSO.
The output of the injected headers displayed by our headers-based application is shown.

![Screenshot shows the output](./media/f5-big-ip-header-advanced/mytravel-example.png)

For increased security, organizations using this pattern could also consider blocking all direct access to the application, in that way forcing a strict path through the BIG-IP.

## Troubleshooting

Failure to access the SHA protected application could be down to any number of potential factors, including a
misconfiguration.

- BIG-IP logs are a great source of information for isolating all sorts of authentication & SSO issues. When troubleshooting you should increase the log verbosity level by heading to **Access Policy** > **Overview** > **Event Logs** > **Settings**. Select the row for your published application then **Edit** > **Access System Logs**. Select **Debug**
from the SSO list then **OK**. You can now reproduce your issue before looking at the logs but remember to switch this back when finished.

- If you see a BIG-IP branded error after being redirected following Azure AD pre-authentication, it's likely the issue relates to SSO from Azure AD to the BIG-IP. Navigate to **Access** > **Overview** > **Access reports** and run the report for the last hour to see logs provide any
clues. The **View session variables** link for your session will also help understand if the APM is receiving the expected claims from Azure AD.

- If you don't see a BIG-IP error page, then the issue is probably more related to SSO from the BIG-IP to the backend application. In which case you should head to **Access Policy** > **Overview** > **Active Sessions** and select the link for your active session. The **View Variables** link in this location may also help root cause SSO issues, particularly if the BIG-IP APM fails to obtain the right user and domain identifiers.

See [BIG-IP APM variable assign
examples](https://devcentral.f5.com/s/articles/apm-variable-assign-examples-1107)
and [F5 BIG-IP session variables
reference](https://techdocs.f5.com/en-us/bigip-15-0-0/big-ip-access-policy-manager-visual-policy-editor/session-variables.html) for more info.

## Additional resources

For more information refer to these articles:

- [The end of passwords, go password-less](https://www.microsoft.com/security/business/identity/passwordless)

- [What is Conditional Access?](../conditional-access/overview.md)

- [Microsoft Zero Trust framework to enable remote
  work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/)
