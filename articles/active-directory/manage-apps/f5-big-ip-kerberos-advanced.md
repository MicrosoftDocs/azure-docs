---
title: Configure F5 BIG-IP Access Policy Manager for Kerberos authentication
description: Learn how to implement Secure Hybrid Access (SHA) with single sign-on (SSO) to Kerberos applications by using F5's BIG-IP advanced configuration.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 12/13/2021
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial: Configure F5 BIG-IP Access Policy Manager for Kerberos authentication

In this tutorial, you'll learn to implement Secure Hybrid Access (SHA) with single sign-on (SSO) to Kerberos applications by using F5's BIG-IP advanced configuration. 

Enabling BIG-IP published services for Azure Active Directory (Azure AD) SSO provides many benefits, including:

* Improved Zero Trust governance through Azure AD pre-authentication and [Conditional Access](../conditional-access/overview.md)

* Full SSO between Azure AD and BIG-IP published services.

* Management of identities and access from a single control plane, the [Azure portal](https://azure.microsoft.com/features/azure-portal/)

To learn about all of the benefits, see [Integrate F5 BIG-IP with Azure Active Directory](./f5-aad-integration.md) and [What is single sign-on in Azure Active Directory?](/azure/active-directory/active-directory-appssoaccess-whatis).


## Scenario description

For this scenario, you'll configure a critical line-of-business application for *Kerberos authentication*, also known as *Integrated Windows Authentication*.

For you to integrate the application directly with Azure AD, it would need to support some form of federation-based protocol, such as Security Assertion Markup Language (SAML). But because modernizing the application introduces the risk of potential downtime, there are other options. 

While you're using Kerberos Constrained Delegation (KCD) for SSO, you can use [Azure AD Application Proxy](../app-proxy/application-proxy.md) to access the application remotely. In this arrangement, you can achieve the protocol transitioning that's required to bridge the legacy application to the modern identity control plane. 

Another approach is to use an F5 BIG-IP Application Delivery Controller. This approach enables overlay of the application with Azure AD pre-authentication and KCD SSO. It significantly improves the overall Zero Trust posture of the application.

## Scenario architecture

The SHA solution for this scenario consists of the following elements:

- **Application**: Back-end Kerberos-based service that's externally published by BIG-IP and protected by SHA.

- **BIG-IP**: Reverse proxy functionality that enables publishing back-end applications. The Access Policy Manager (APM) then overlays published applications with SAML service provider (SP) and SSO functionality.

- **Azure AD**: Identity provider (IdP) responsible for verifying user credentials, Azure AD Conditional Access, and SSO to the BIG-IP APM through SAML.

- **KDC**: Key Distribution Center role on a domain controller (DC). It issues Kerberos tickets.

The following image illustrates the SAML SP-initiated flow for this scenario, but IdP-initiated flow is also supported.

![Diagram of the scenario architecture.](./media/f5-big-ip-kerberos-easy-button/scenario-architecture.png)

| Step| Description |
| -------- |-------|
| 1| User connects to the application endpoint (BIG-IP). |
| 2| BIG-IP access policy redirects the user to Azure AD (SAML IdP). |
| 3| Azure AD pre-authenticates the user and applies any enforced Conditional Access policies. |
| 4| User is redirected to BIG-IP (SAML SP), and SSO is performed via the issued SAML token. |
| 5| BIG-IP authenticates the user and requests a Kerberos ticket from KDC. |
| 6| BIG-IP sends the request to the back-end application, along with the Kerberos ticket for SSO. |
| 7| Application authorizes the request and returns the payload. |

 ## Prerequisites

Prior BIG-IP experience isn't necessary, but you will need:

* An Azure AD free subscription or higher-tier subscription.

* An existing BIG-IP, or [deploy BIG-IP Virtual Edition in Azure](../manage-apps/f5-bigip-deployment-guide.md).

* Any of the following F5 BIG-IP license offers:

  * F5 BIG-IP Best bundle

  * F5 BIG-IP APM standalone license

  * F5 BIG-IP APM add-on license on an existing BIG-IP Local Traffic Manager

  * 90-day BIG-IP full feature [trial license](https://www.f5.com/trial/big-ip-trial.php)

* User identities [synchronized](../hybrid/how-to-connect-sync-whatis.md) from an on-premises directory to Azure AD, or created directly within Azure AD and flowed back to your on-premises directory.

* An account with Azure AD Application Administrator [permissions](../users-groups-roles/directory-assign-admin-roles.md).

* A web server [certificate](../manage-apps/f5-bigip-deployment-guide.md) for publishing services over HTTPS, or use default BIG-IP certificates while testing.

* An existing Kerberos application, or [set up an Internet Information Services (IIS) app](https://active-directory-wp.com/docs/Networking/Single_Sign_On/SSO_with_IIS_on_Windows.html) for KCD SSO.

## BIG-IP configuration methods

There are many methods to configure BIG-IP for this scenario, including two template-based options and an advanced configuration. This article covers the advanced approach, which provides a more flexible way of implementing SHA by manually creating all BIG-IP configuration objects. You would also use this approach for scenarios that the guided configuration templates don't cover.

>[!NOTE]
> All example strings or values in this article should be replaced with those for your actual environment.

## Register F5 BIG-IP in Azure AD

Before BIG-IP can hand off pre-authentication to Azure AD, it must be registered in your tenant. This is the first step in establishing SSO between both entities. It's no different from making any IdP aware of a SAML relying party. In this case, the app that you create from the F5 BIG-IP gallery template is the relying party that represents the SAML SP for the BIG-IP published application.

1. Sign in to the [Azure AD portal](https://portal.azure.com) by using an account with Application Administrator permissions.

2. From the left pane, select the **Azure Active Directory** service.

3. On the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant.

4. On the **Enterprise applications** pane, select **New application**.

5. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons that indicate whether they support federated SSO and provisioning. 

   Search for **F5** in the Azure gallery, and select **F5 BIG-IP APM Azure AD integration**.

6. Provide a name for the new application to recognize the instance of the application. Select **Add/Create** to add it to your tenant.

## Enable SSO to F5 BIG-IP

Next, configure the BIG-IP registration to fulfill SAML tokens that the BIG-IP APM requests:

1. In the **Manage** section of the left menu, select **Single sign-on** to open the **Single sign-on** pane for editing.

2. On the **Select a single sign-on method** page, select **SAML** followed by **No, I'll save later** to skip the prompt.

3. On the **Set up single sign-on with SAML** pane, select the pen icon to edit **Basic SAML Configuration**. Make these edits:

   1. Replace the predefined **Identifier** value with the full URL for the BIG-IP published application.

   2. Replace the **Reply URL** value but retain the path for the application's SAML SP endpoint. 
   
      In this configuration, the SAML flow would operate in IdP-initiated mode. In that mode, Azure AD issues a SAML assertion before the user is redirected to the BIG-IP endpoint for the application. 

   3. To use SP-initiated mode, populate **Sign on URL** with the application URL.

   4. For **Logout Url**, enter the BIG-IP APM single logout (SLO) endpoint prepended by the host header of the service that's being published. This step ensures that the user's BIG-IP APM session ends after the user is signed out of Azure AD. 

    ![Screenshot for editing basic SAML configuration.](./media/f5-big-ip-kerberos-advanced/edit-basic-saml-configuration.png)

    > [!NOTE]
    > From TMOS v16, the SAML SLO endpoint has changed to **/saml/sp/profile/redirect/slo**.

4. Select **Save** before closing the SAML configuration pane and skip the SSO test prompt.

5. Note the properties of the **User Attributes & Claims** section. Azure AD will issue these properties to users for BIG-IP APM authentication and for SSO to the back-end application.

6. On the **SAML Signing Certificate** pane, select **Download** to save the **Federation Metadata XML** file to your computer.

    ![Screenshot that shows selections for editing a SAML signing certificate.](./media/f5-big-ip-kerberos-advanced/edit-saml-signing-certificate.png)

SAML signing certificates that Azure AD creates have a lifespan of three years. For more information, see [Managed certificates for federated single sign-on](./manage-certificates-for-federated-single-sign-on.md).

## Assign users and groups

By default, Azure AD will issue tokens only for users who have been granted access to an application. To grant specific users and groups access to the application:

1. On the **F5 BIG-IP application's overview** pane, select **Assign Users and groups**.

2. Select **+ Add user/group**.

   ![Screenshot that shows the button for assigning users and groups.](./media/f5-big-ip-kerberos-advanced/authorize-users-groups.png)

3. Select users and groups, and then select **Assign** to assign them to your application.   

## Configure Active Directory KCD

For the BIG-IP APM to perform SSO to the back-end application on behalf of users, KCD must be configured in the target Active Directory domain. Delegating authentication also requires that the BIG-IP APM is provisioned with a domain service account.

For the scenario in this article, the application is hosted on server **APP-VM-01** and is running in the context of a service account named **web_svc_account**, not the computer's identity. The delegating service account assigned to the APM is **F5-BIG-IP**.

### Create a BIG-IP APM delegation account 

Because BIG-IP doesn't support group managed service accounts, create a standard user account to use as the APM service account:

1. Enter the following PowerShell command. Replace the `UserPrincipalName` and `SamAccountName` values with those for your environment.

   ```New-ADUser -Name "F5 BIG-IP Delegation Account" UserPrincipalName host/f5-big-ip.contoso.com@contoso.com SamAccountName "f5-big-ip" -PasswordNeverExpires $true Enabled $true -AccountPassword (Read-Host -AsSecureString "Account Password") ```

2. Create a service principal name (SPN) for the APM service account to use when you're performing delegation to the web application's service account:

   ```Set-AdUser -Identity f5-big-ip -ServicePrincipalNames @Add="host/f5-big-ip.contoso.com"} ```

3. Ensure that the SPN now shows against the APM service account:

   ```Get-ADUser -identity f5-big-ip -properties ServicePrincipalNames | Select-Object -ExpandProperty ServicePrincipalNames ```

 4. Before you specify the target SPN that the APM service account should delegate to for the web application, view its existing SPN configuration:
 
    1. Check whether your web application is running in the computer context or a dedicated service account. 
    2. Use the following command to query the account object in Active Directory to see its defined SPNs. Replace `<name_of_account>` with the account for your environment. 

       ```Get-ADUser -identity <name_of_account> -properties ServicePrincipalNames | Select-Object -ExpandProperty ServicePrincipalNames ```

5. You can use any SPN that you see defined against a web application's service account. But in the interest of security, it's best to use a dedicated SPN that matches the host header of the application. 

   For example, because the web application host header in this example is **myexpenses.contoso.com**, you would add `HTTP/myexpenses.contoso.com` to the application's service account object in Active Directory:

   ```Set-AdUser -Identity web_svc_account -ServicePrincipalNames @{Add="http/myexpenses.contoso.com"} ```

    Or if the app ran in the machine context, you would add the SPN to the object of the computer account in Active Directory:

    ```Set-ADComputer -Identity APP-VM-01 -ServicePrincipalNames @{Add="http/myexpenses.contoso.com"} ```

With the SPNs defined, you now need to establish trust for the APM service account delegate to that service. The configuration will vary depending on the topology of your BIG-IP instance and application server.

### Configure BIG-IP and the target application in the same domain

1. Set trust for the APM service account to delegate authentication:

   ```Get-ADUser -Identity f5-big-ip | Set-ADAccountControl -TrustedToAuthForDelegation $true ```

2. The APM service account then needs to know which target SPN it's trusted to delegate to. In other words, the APM service account needs to know which service it's allowed to request a Kerberos ticket for. Set the target SPN to the service account that's running your web application:

   ```Set-ADUser -Identity f5-big-ip -Add @{'msDS-AllowedToDelegateTo'=@('HTTP/myexpenses.contoso.com')} ```

If you prefer, you can complete these tasks through the **Active Directory Users and Computers** Microsoft Management Console (MMC) snap-in on a domain controller.

### Configure BIG-IP and the target application in different domains

Starting with Windows Server 2012, cross-domain KCD uses resource-based constrained delegation. The constraints for a service have been transferred from the domain administrator to the service administrator. This delegation allows the back-end service administrator to allow or deny SSO. It also introduces a different approach at configuration delegation, which is possible only when you use either PowerShell or ADSI Edit.

You can use the `PrincipalsAllowedToDelegateToAccount` property of the application's service account (computer or dedicated service account) to grant delegation from BIG-IP. For this scenario, use the following PowerShell command on a domain controller (Windows Server 2012 R2 or later) within the same domain as the application.

If the **web_svc_account** service runs in context of a user account, use these commands:

```$big-ip= Get-ADComputer -Identity f5-big-ip -server dc.contoso.com```
```Set-ADUser -Identity web_svc_account -PrincipalsAllowedToDelegateToAccount $big-ip```
```Get-ADUser web_svc_account -Properties PrincipalsAllowedToDelegateToAccount```

If the **web_svc_account** service runs in context of a computer account, use these commands:

```$big-ip= Get-ADComputer -Identity f5-big-ip -server dc.contoso.com```
```Set-ADComputer -Identity web_svc_account -PrincipalsAllowedToDelegateToAccount $big-ip```
```Get-ADComputer web_svc_account -Properties PrincipalsAllowedToDelegateToAccount```

For more information, see [Kerberos Constrained Delegation across domains](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831477(v=ws.11)).

## BIG-IP advanced configuration

Now you can proceed with setting up the BIG-IP configurations.

### Configure SAML service provider settings

SAML service provider settings define the SAML SP properties that the APM will use for overlaying the legacy application with SAML pre-authentication. To configure them:

1. From a browser, sign in to the F5 BIG-IP management console.

2. Select **Access** > **Federation** > **SAML Service Provider** > **Local SP Services** > **Create**.

    ![Screenshot that shows the button for creating a local SAML service provider service.](./media/f5-big-ip-kerberos-advanced/create-local-services-saml-service-provider.png)

3. Provide the **Name** and **Entity ID** values that you saved when you configured SSO for Azure AD earlier.

    ![Screenshot that shows name and entity I D values entered for a new SAML service provider service.](./media/f5-big-ip-kerberos-advanced/create-new-saml-sp-service.png)

4. You don't need to specify  **SP Name Settings** information if the SAML entity ID is an exact match with the URL for the published application. 

   For example, if the entity ID is **urn:myexpenses:contosoonline**, you need to provide the **Scheme** and **Host** values as **https** and **myexpenses.contoso.com**. But if the entity ID is `https://myexpenses.contoso.com`, you don't need to provide this information.

### Configure an external IdP connector 

A SAML IdP connector defines the settings that are required for the BIG-IP APM to trust Azure AD as its SAML IdP. These settings will map the SAML SP to a SAML IdP, establishing the federation trust between the APM and Azure AD. To configure the connector:

1. Scroll down to select the new SAML SP object, and then select **Bind/Unbind IdP Connectors**.

   ![Screenshot that shows the button for binding or unbinding identity provider connectors.](./media/f5-big-ip-kerberos-advanced/bind-unbind-idp-connectors.png)

2. Select **Create New IdP Connector** > **From Metadata**.

   ![Screenshot that shows selections for creating new identity provider connector from metadata.](./media/f5-big-ip-kerberos-advanced/create-new-idp-connector-from-metadata.png)

3. Browse to the federation metadata XML file that you downloaded earlier, and provide an **Identity Provider Name** value for the APM object that will represent the external SAML IdP. The following example shows **MyExpenses_AzureAD**.

   ![Screenshot that shows example values for the federation metadata X M L file and the identity provider name.](./media/f5-big-ip-kerberos-advanced/browse-federation-metadata-xml.png)

4. Select **Add New Row** to choose the new **SAML IdP Connector** value, and then select **Update**.

   ![Screenshot that shows selections for choosing a new identity provider connector.](./media/f5-big-ip-kerberos-advanced/choose-new-saml-idp-connector.png)

5. Select **OK** to save the settings.

### Configure Kerberos SSO

In this section, you create an APM SSO object for performing KCD SSO to back-end applications. To complete this step, you need the APM delegation account that you created earlier.

Select **Access** > **Single Sign-on** > **Kerberos** > **Create** and provide the following information:

* **Name**: You can use a descriptive name. After you create it, other published applications can also use the Kerberos SSO APM object. For example, **Contoso_KCD_sso** can be used for multiple published applications for the entire Contoso domain. But **MyExpenses_KCD_sso** can be used for a single application only.

* **Username Source**: Specify the preferred source for user ID. You can specify any APM session variable as the source, but **session.saml.last.identity** is typically best because it contains the logged-in user's ID derived from the Azure AD claim.

* **User Realm Source**: This source is required in scenarios where the user domain is different from the Kerberos realm that will be used for KCD. If users are in a separate trusted domain, you make the APM aware by specifying the APM session variable that contains the logged-in user's domain. An example is **session.saml.last.attr.name.domain**. You also do this in scenarios where the UPN of users is based on an alternative suffix.

* **Kerberos Realm**: Enter the user's domain suffix in uppercase.

* **KDC**: Enter the IP address of a domain controller. (Or enter a fully qualified domain name if DNS is configured and efficient.)

* **UPN Support**: Select this checkbox if the specified source for username is in UPN format, such as if you're using the **session.saml.last.identity** variable.

* **Account Name** and **Account Password**: Provide APM service account credentials to perform KCD.

* **SPN Pattern**: If you use **HTTP/%h**, APM then uses the host header of the client request to build the SPN that it's requesting a Kerberos token for.

* **Send Authorization**: Disable this option for applications that prefer negotiating authentication, instead of receiving the Kerberos token in the first request (for example, Tomcat).

![Screenshot that shows selections for configuring Kerberos single sign-on.](./media/f5-big-ip-kerberos-advanced/configure-kerberos-sso.png)

You can leave KDC undefined if the user realm is different from the back-end server realm. This rule also applies for multiple-domain realm scenarios. If you leave KDC undefined, BIG-IP will try to discover a Kerberos realm through a DNS lookup of SRV records for the back-end server's domain. So it expects the domain name to be the same as the realm name. If the domain name is different from the realm name, it must be specified in the [/etc/krb5.conf](https://support.f5.com/csp/article/K17976428) file.

Kerberos SSO processing is fastest when a KDC is specified by IP address. Kerberos SSO processing is slower when a KDC is specified by host name. Because of additional DNS queries, processing is even slower when a KDC is left undefined. For this reason, you should ensure that your DNS is performing optimally before moving a proof of concept into production. 

> [!NOTE]
> If back-end servers are in multiple realms, you must create a separate SSO configuration object for each realm.

You can inject headers as part of the SSO request to the back-end application. Simply change the **General Properties** setting from **Basic** to **Advanced**. 

For more information on configuring an APM for KCD SSO, see the F5 article [Overview of Kerberos constrained delegation](https://support.f5.com/csp/article/K17976428).

### Configure an access profile

An *access profile* binds many APM elements that manage access to BIG-IP virtual servers. These elements include access policies, SSO configuration, and UI settings. 

1. Select **Access** > **Profiles / Policies** > **Access Profiles (Per-Session Policies)** > **Create** and provide these general properties:

   * **Name**: For example, enter **MyExpenses**.

   * **Profile Type:** Select **All**.

   * **SSO Configuration:** Select the KCD SSO configuration object that you just created.

   * **Accepted Language:** Add at least one language.

   ![Screenshot that shows selections for creating an access profile.](./media/f5-big-ip-kerberos-advanced/create-new-access-profile.png)

2. Select **Edit** for the per-session profile that you just created. 

    ![Screenshot that shows the button for editing a per-session profile.](./media/f5-big-ip-kerberos-advanced/edit-per-session-profile.png)

3. When the visual policy editor opens, select the plus sign (**+**) next to the fallback.

    ![Screenshot that shows the plus sign next to fallback.](./media/f5-big-ip-kerberos-advanced/select-plus-fallback.png)

4. In the pop-up dialog, select **Authentication** > **SAML Auth** > **Add Item**.

    ![Screenshot that shows selections for adding a SAML authentication item.](./media/f5-big-ip-kerberos-advanced/add-item-saml-auth.png)

5. In the **SAML authentication SP** configuration, set the **AAA Server** option to use the SAML SP object that you created earlier.

    ![Screenshot that shows the list box for configuring an A A A server.](./media/f5-big-ip-kerberos-advanced/configure-aaa-server.png)

6. Select the link in the upper **Deny** box to change the **Successful** branch to **Allow**, and then select **Save**.

    ![Screenshot that shows changing the successful branch to Allow.](./media/f5-big-ip-kerberos-advanced/select-allow-successful-branch.png)

### Configure attribute mappings

Although it's optional, adding a **LogonID_Mapping** configuration enables the BIG-IP active sessions list to display the UPN of the logged-in user instead of a session number. This information is useful when you're analyzing logs or troubleshooting.

1. Select the **+** symbol for the **SAML Auth Successful** branch. 

2. In the pop-up dialog, select **Assignment** > **Variable Assign** > **Add Item**.

   ![Screenshot that shows the option for assigning custom variables.](./media/f5-big-ip-kerberos-advanced/configure-variable-assign.png)

3. Enter **Name**. 

4. On the **Variable Assign** pane, select **Add new entry** > **change**. The following example shows **LogonID_Mapping** in the **Name** box.

   ![Screenshot that shows selections for adding an entry for variable assignment.](./media/f5-big-ip-kerberos-advanced/add-new-entry-variable-assign.png)

5. Set both variables: 

   * **Custom Variable**: Enter **session.logon.last.username**.
   * **Session Variable**: Enter **session.saml.last.identity**.

6. Select **Finished** > **Save**.

7. Select the **Deny** terminal of the access policy's **Successful** branch and change it to **Allow**. Then select **Save**.

8. Commit those settings by selecting **Apply Access Policy**, and close the visual policy editor.

    ![Screenshot of the button for applying an access policy.](./media/f5-big-ip-kerberos-advanced/apply-access-policy.png)

### Configure the back-end pool

For BIG-IP to know where to forward client traffic, you need to create a BIG-IP node object that represents the back-end server that hosts your application. Then, place that node in a BIG-IP server pool.

1. Select **Local Traffic** > **Pools** > **Pool List** > **Create** and provide a name for a server pool object. For example, enter **MyApps_VMs**.

    ![Screenshot that shows selections for creatng an advanced back-end pool.](./media/f5-big-ip-kerberos-advanced/create-new-backend-pool.png)

2. Add a pool member object with the following resource details:

   * **Node Name**: Optional display name for the server that hosts the back-end web application.
   * **Address**: IP address of the server that hosts the application.
   * **Service Port**: HTTP/S port that the application is listening on.

    ![Screenshot that shows entries for adding a pool member object.](./media/f5-big-ip-kerberos-advanced/add-pool-member-object.png)


> [!NOTE]
> The health monitors require [additional configuration](https://support.f5.com/csp/article/K13397) that this article doesn't cover.

### Configure the virtual server

A *virtual server* is a BIG-IP data plane object that's represented by a virtual IP address listening for client requests to the application. Any received traffic is processed and evaluated against the APM access profile that's associated with the virtual server, before being directed according to the policy results and settings. 

To configure a virtual server:

1. Select **Local Traffic** > **Virtual Servers** > **Virtual Server List** > **Create**.

2. Provide the virtual server with a **Name** value and an IPv4/IPv6 address that isn't already allocated to an existing BIG-IP object or device on the connected network. The IP address will be dedicated to receiving client traffic for the published back-end application. Then set **Service Port** to **443**.

    ![Screenshot that shows selections and entries for configuring a virtual server.](./media/f5-big-ip-kerberos-advanced/configure-new-virtual-server.png)

3. Set **HTTP Profile (Client)** to **http**. 

4. Enable a virtual server for Transport Layer Security to allow services to be published over HTTPS. For **SSL Profile (Client)**, select the profile that you created as part of the prerequisites. (Or leave the default if you're testing.)

    ![Screenshot that shows selections for H T T P profile and S S L profile for the client.](./media/f5-big-ip-kerberos-advanced/update-http-profile-client.png)

5. Change **Source Address Translation** to **Auto Map**.

    ![Screenshot to change source address translation](./media/f5-big-ip-kerberos-advanced/change-auto-map.png)
6. Under **Access Policy**, set **Access Profile** based on the profile that you created earlier. This step binds the Azure AD SAML pre-authentication profile and KCD SSO policy to the virtual server.

    ![Screenshot that shows the box for setting an access profile for an access policy.](./media/f5-big-ip-kerberos-advanced/set-access-profile-for-access-policy.png)

7. Set **Default Pool** to use the back-end pool objects that you created in the previous section. Then select **Finished**.

   ![Screenshot that shows selecting a default pool.](./media/f5-big-ip-kerberos-advanced/set-default-pool-use-backend-object.png)

### Configure session management settings

BIG-IP's session management settings define the conditions under which user sessions are terminated or allowed to continue, limits for users and IP addresses, and error pages. You can create your own policy here. Go to **Access Policy** > **Access Profiles** > **Access Profile** and select your application from the list.

If you've defined a **Single Logout URI** value in Azure AD, it will ensure that an IdP-initiated sign-out from the MyApps portal also ends the session between the client and the BIG-IP APM. The imported application's federation metadata XML file provides the APM with the Azure AD SAML logout endpoint for SP-initiated sign-outs. But for this to be truly effective, the APM needs to know exactly when a user signs out. 

Consider a scenario where a BIG-IP web portal is not used. The user has no way of instructing the APM to sign out. Even if the user signs out of the application itself, BIG-IP is technically oblivious to this, so the application session could easily be reinstated through SSO. For this reason, SP-initiated sign-out needs careful consideration to ensure that sessions are securely terminated when they're no longer required.

One way to achieve this is by adding an SLO function to your application's sign-out button. This function can redirect your client to the Azure AD SAML sign-out endpoint. You can find this SAML sign-out endpoint at **App Registrations** > **Endpoints**.

If you can't change the app, consider having BIG-IP listen for the app's sign-out call. When it detects the request, it should trigger SLO. 

For more information, see the F5 articles [Configuring automatic session termination (logout) based on a URI-referenced file name](https://support.f5.com/csp/article/K42052145) and [Overview of the Logout URI Include option](https://support.f5.com/csp/article/K12056).

## Summary

Your application should now be published and accessible via SHA, either directly via its URL or through Microsoft's application portals. The application should also be visible as a target resource in [Azure AD Conditional Access](../conditional-access/concept-conditional-access-policies.md). 

For increased security, organizations that use this pattern can also consider blocking all direct access to the application. Blocking all direct access forces a strict path through BIG-IP.

## Next steps

As a user, open a browser and connect to the application's external URL. You can also select the application's icon from the [Microsoft MyApps portal](https://myapps.microsoft.com/). After you authenticate against your Azure AD tenant, you'll be redirected to the BIG-IP endpoint for the application and automatically signed in via SSO.

![Screenshot of the an example application's website.](./media/f5-big-ip-kerberos-advanced/app-view.png)

### Azure AD B2B guest access

SHA also supports [Azure AD B2B guest access](../external-identities/hybrid-cloud-to-on-premises.md). Guest identities are synchronized from your Azure AD tenant to your target Kerberos domain. It's necessary to have a local representation of guest objects for BIG-IP to perform KCD SSO to the back-end application. 

## Troubleshoot

There can be many reasons for failure to access a SHA-protected application, including a misconfiguration. Consider the following points while troubleshooting any problem:

* Kerberos is time sensitive. It requires that servers and clients are set to the correct time and, where possible, synchronized to a reliable time source.

* Ensure that the host names for the domain controller and web application are resolvable in DNS.

* Ensure that there are no duplicate SPNs in your environment by running the following query at the command line: `setspn -q HTTP/my_target_SPN`.

> [!NOTE]
> To validate that an IIS application is configured appropriately for KCD, see [Troubleshoot Kerberos constrained delegation configurations for Application Proxy](../app-proxy/application-proxy-back-end-kerberos-constrained-delegation-how-to.md). F5's article on [how the APM handles Kerberos SSO](https://techdocs.f5.com/en-us/bigip-15-1-0/big-ip-access-policy-manager-single-sign-on-concepts-configuration/kerberos-single-sign-on-method.html) is also a valuable resource.

### Authentication and SSO problems

BIG-IP logs are a reliable source of information. To increase the log verbosity level:

1. Go to **Access Policy** > **Overview** > **Event Logs** > **Settings**.

2. Select the row for your published application. Then, select **Edit** > **Access System Logs**.

3. Select **Debug** from the SSO list, and then select **OK**. Reproduce your problem before you look at the logs, but remember to switch this back when finished.

If you see a BIG-IP branded error immediately after successful Azure AD pre-authentication, it's possible that the problem relates to SSO from Azure AD to BIG-IP. To find out:

1. Go to **Access** > **Overview** > **Access reports**.

2. Run the report for the last hour to see if logs provide any clues. The **View session variables** link for your session will also help you understand if the APM is receiving the expected claims from Azure AD.

If you don't see a BIG-IP error page, the problem is probably more related to the back-end request or related to SSO from BIG-IP to the application. To find out:

1. Go to **Access Policy** > **Overview** > **Active Sessions**.

2. Select the link for your active session. The **View Variables** link in this location might also help you determine root-cause KCD problems, particularly if the BIG-IP APM fails to get the right user and domain identifiers.

For help with diagnosing KCD-related problems, see the F5 BIG-IP deployment guide [Configuring Kerberos Constrained Delegation](https://www.f5.com/pdf/deployment-guides/kerberos-constrained-delegation-dg.pdf).

## Additional resources

* [Active Directory Authentication](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-authentication-single-sign-on-11-5-0/2.html) (F5 article about BIG-IP advanced configuration)

* [Forget passwords, go passwordless](https://www.microsoft.com/security/business/identity/passwordless)

* [What is Conditional Access?](../conditional-access/overview.md)

* [Zero Trust framework to enable remote work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/)
