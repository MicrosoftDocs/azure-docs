---
title: Azure AD secure hybrid access with F5 VPN| Microsoft Docs
description: Tutorial for Azure Active Directory Single Sign-on (SSO) integration with F5 BIG-IP for Password-less VPN 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 10/12/2020
ms.author: gasinh
ms.collection: M365-identity-device-management
---

# Tutorial for Azure Active Directory single sign-on integration with F5 BIG-IP for Password-less VPN

In this tutorial, learn how to integrate F5’s BIG-IP based  Secure socket layer Virtual private network (SSL-VPN) solution with Azure Active Directory (AD) for Secure Hybrid Access (SHA).

Integrating a BIG-IP SSL-VPN with Azure AD provides [many key benefits](f5-aad-integration.md), including:

- Improved Zero trust governance through [Azure AD pre-authentication and authorization](../../app-service/overview-authentication-authorization.md)

- [Password-less authentication to the VPN service](https://www.microsoft.com/security/business/identity/passwordless)

- Manage Identities and access from a single control plane - The [Azure portal](https://portal.azure.com/#home)

Despite these great value adds, the classic VPN does however remain predicated on the notion of a network perimeter, where trusted is on the inside and untrusted the outside. This model is no longer effective in achieving a true Zero Trust posture, since corporate assets are no longer confined to the walls of an enterprise data center, but rather across multi-cloud environments with no fixed boundaries. For this reason, we encourage our customers to consider moving to a more Identity driven approach at managing [access on a per application basis](../fundamentals/five-steps-to-full-application-integration-with-azure-ad.md).

## Scenario description

In this scenario, the BIG-IP APM instance of the SSL-VPN service will be configured as a SAML Service Provider (SP) and Azure AD becomes the trusted SAML IDP, providing pre-authentication. Single sign-on (SSO) from Azure AD is then provided through claims-based authentication to the BIG-IP APM, providing a seamless VPN access experience.

![Image shows ssl-vpn architecture](media/f5-sso-vpn/ssl-vpn-architecture.png)

>[!NOTE]
>All example strings or values referenced throughout this guide should be replaced with those for your actual environment.

## Prerequisites

Prior experience or knowledge of F5 BIG-IP isn't necessary, however, you'll need:

- An Azure AD [free subscription](https://azure.microsoft.com/trial/get-started-active-directory/) or above

- User identities should be [synchronized from their on-premises directory](../hybrid/how-to-connect-sync-whatis.md) to Azure AD.

- An account with Azure AD application admin [permissions](../roles/permissions-reference.md#application-administrator)

- An existing BIG-IP infrastructure with routing of client traffic to and from the BIG-IP or [deploy a BIG-IP Virtual Edition into Azure](f5-bigip-deployment-guide.md).

- A record for the BIG-IP published VPN service will need to exist in public DNS, or a test client’s localhost file while testing

- The BIG-IP should be provisioned with the necessary SSL certificates for publishing services over HTTPS.

Familiarizing yourself with [F5 BIG-IP terminology](https://www.f5.com/services/resources/glossary) will also help understand the various components that are referenced throughout the tutorial.

>[!NOTE]
>Azure is constantly evolving so don’t be surprised if you find any nuances between the instructions in this guide and what you see in the Azure portal. Screenshots are from BIG-IP v15, however, remain relatively similar from v13.1.

## Add F5 BIG-IP from the Azure AD gallery

Setting up a SAML federation trust between the BIG-IP allows the Azure AD BIG-IP to hand off the pre-authentication and [Conditional Access](../conditional-access/overview.md) to Azure AD, before granting access to the published VPN service.

1. Sign in to the Azure AD portal using an account with application admin rights

2. From the left navigation pane, select the **Azure Active Directory service**

3. Go to **Enterprise Applications** and from the top ribbon select **New application**.

4. Search for F5 in the gallery and select **F5 BIG-IP APM Azure AD integration**.

5. Provide a name for the application, followed by **Add/Create** to have it added to your tenant. The user can see the name as an icon in the Azure and Office 365 application portals. The name should reflect that specific service. For example, VPN.

## Configure Azure AD SSO

1. With your new F5 application properties in view, go to **Manage** > **Single sign-on**

2. On the **Select a single sign-on method** page, select **SAML**. Skip the prompt to save the single sign-on settings by selecting **No, I’ll save later**.

3. On the **Setup single sign-on with SAML** menu, select the pen icon for **Basic SAML Configuration** to provide the following details:

   - Replace the pre-defined **Identifier URL** with the URL for your BIG-IP published service. For example, `https://ssl-vpn.contoso.com`

   - Do the same with the **Reply URL** text box, including the SAML endpoint path. For example, `https://ssl-vpn.contoso.com/saml/sp/profile/post/acs`

   - In this configuration alone the application would operate in an IDP initiated mode, where Azure AD issues the user with a SAML assertion before redirecting to the BIG-IP SAML service. For apps that don’t support IDP initiated mode, specify the **Sign-on URL** for the BIG-IP SAML service. For example, `https://ssl-vpn.contoso.com`.

   - For the Logout Url enter the BIG-IP APM Single logout (SLO) endpoint pre-pended by the host header of the service being published. For example, `https://ssl-vpn.contoso.com/saml/sp/profile/redirect/slr`

   Providing an SLO URL ensures a user session is terminated at both ends, the BIG-IP and Azure AD, after the user signs out. BIG-IP APM also provides an [option](https://support.f5.com/csp/article/K12056) for terminating all sessions when calling a specific application URL.

![Image shows basic saml configuration](media/f5-sso-vpn/basic-saml-configuration.png).

>[!NOTE]
>From TMOS v16 the SAML SLO endpoint has changed to /saml/sp/profile/redirect/slo

4. Select **Save** before exiting the SAML configuration menu and skip the SSO test prompt.

Observe the properties of the **User Attributes & Claims** section, as Azure AD will issue these to users for BIG-IP APM authentication.

![Image shows user attributes claims](media/f5-sso-vpn/user-attributes-claims.png)

Feel free to add any other specific claims your BIG-IP published service might expect, while noting that any claims defined in addition to the default set will only be issued if they exist in Azure AD, as populated attributes. In the same way, directory [roles or group](../hybrid/how-to-connect-fed-group-claims.md) memberships also need defining against a user object in Azure AD before they can be issued as a claim.

![Image shows federation metadata download link](media/f5-sso-vpn/saml-signing-certificate.png)

SAML signing certificates created by Azure AD have a lifespan of three years, so will need managing using Azure AD published guidance.

### Azure AD authorization

By default, Azure AD will only issue tokens to users that have been granted access to a service.

1. Still in the application’s configuration view, select **Users and groups**

2. Select **+ Add user** and in the Add Assignment menu select **Users and groups**

3. In the **Users and groups** dialog, add the groups of users that are authorized to access the VPN, followed by **Select** > **Assign**

![Image shows adding user link ](media/f5-sso-vpn/add-user-link.png)

4. This completes the Azure AD part of the SAML federation trust. The BIG-IP APM can now be set up to publish the SSL-VPN service and configured with a corresponding set of properties to complete the trust, for SAML pre-authentication.

## BIG-IP APM configuration

### SAML federation

The following section creates the BIG-IP SAML service provider and corresponding SAML IDP objects required to complete federating the VPN service with Azure AD.

1. Go to **Access** > **Federation** > **SAML Service Provider** > **Local SP Services** and select **Create**

![Image shows BIG-IP SAML configuration](media/f5-sso-vpn/bigip-saml-configuration.png)

2. Enter a **Name** and the same **Entity ID** value you defined in Azure AD earlier, and the Host FQDN that will be used to connect to the application

![Image shows creating new SAML SP service](media/f5-sso-vpn/create-new-saml-sp.png)

   SP **Name** settings are only required if the entity ID isn't an exact match of the hostname portion of the published URL, or if it isn’t in regular hostname-based URL format. Provide the external scheme and hostname of the application being published if entity ID is `urn:ssl-vpn:contosoonline`.

3. Scroll down to select the new **SAML SP object** and select **Bind/UnBind IDP Connectors**.

![Image shows creating federation with local SP service](media/f5-sso-vpn/federation-local-sp-service.png)

4. Select **Create New IDP Connector** and from the drop-down menu select **From Metadata**

![Image shows create new IDP connector](media/f5-sso-vpn/create-new-idp-connector.png)

5. Browse to the federation metadata XML file you downloaded earlier and provide an **Identity Provider Name** for the APM object that will represent the external SAML IDP

6. Select **Add New Row** to select the new Azure AD external IDP connector.

![Image shows external IDP connector](media/f5-sso-vpn/external-idp-connector.png)

7. Select **Update** to bind the SAML SP object to the SAML IDP object, then select **OK**.

![Image shows SAML IDP using SP](media/f5-sso-vpn/saml-idp-using-sp.png)

### Webtop configuration

The following steps enable the SSL-VPN to be offered to users via BIG-IP’s proprietary web portal.

1. Go to **Access** > **Webtops** > **Webtop Lists** and select **Create**.

2. Give the portal a name and set the type to **Full**. For example, `Contoso_webtop`.

3. Adjust the remaining preferences then select **Finished**.

![Image shows webtop configuration](media/f5-sso-vpn/webtop-configuration.png)

### VPN configuration

The VPN capability is made up of several elements, each controlling a different aspect of the overall service.

1. Go to **Access** > **Connectivity/VPN** > **Network Access (VPN)** > **IPV4 Lease Pools** and select **Create**.

2. Provide a name for the pool of IP addresses being allocated to VPN clients. For example, Contoso_vpn_pool

3. Set type to **IP Address Range** and provide a start and end IP, followed by **Add** and **Finished**.

![Image shows vpn configuration](media/f5-sso-vpn/vpn-configuration.png)

A Network access list provisions the service with IP and DNS settings from the VPN pool, user routing permissions, and could also launch applications if necessary.

1. Go to **Access** > **Connectivity/VPN: Network Access (VPN)** > **Network Access Lists** and select **Create**.

2. Provide a name for the VPN access list and caption, for example, Contoso-VPN followed by **Finished**.

![Image shows vpn configuration in network access list](media/f5-sso-vpn/vpn-configuration-network-access-list.png)

3. From the top ribbon, select **Network Settings** and add the below settings:

   • **Supported IP version**: IPV4

   • **IPV4 Lease Pool**: Select the VPN pool created earlier, for example, Contoso_vpn_pool

![Image shows contoso vpn pool](media/f5-sso-vpn/contoso-vpn-pool.png)

   The Client Settings options can be used to enforce restrictions on how the client traffic is routed when a VPN is established.

4. Select **Finished** and go to the DNS/Hosts tab to add the  settings:

   • **IPV4 Primary Name Server**: IP of your environment's DNS server

   • **DNS Default Domain Suffix**: The domain suffix for this specific VPN connection. For example, contoso.com

![Image shows default domain suffix](media/f5-sso-vpn/domain-suffix.png)

[F5 article](https://techdocs.f5.com/kb/en-us/products/big-ip_apm/manuals/product/apm-network-access-11-5-0/2.html) provides details on adjusting the remaining settings according to your preference.

A BIG-IP connection profile is now required to configure the settings for each of the VPN client types that the VPN service needs to support. For example, Windows, OSX, and Android.

1. Go to **Access** > **Connectivity/VPN** > **Connectivity** > **Profiles** and select **Add**.

2. Provide a profile name and set the parent profile to **/Common/connectivity**, for example, Contoso_VPN_Profile.

![Image shows create new connectivity profile](media/f5-sso-vpn/create-connectivity-profile.png)

F5’s [documentation](https://techdocs.f5.com/kb/en-us/bigip-edge-apps.html) provides more details on client support.

## Access profile configuration

With the VPN objects configured, an access policy is required to enable the service for SAML authentication.

1. Go to **Access** > **Profiles/Policies** > **Access Profiles (Per-Session Policies)** and select **Create**

2. Provide a profile name and for the profile type select **All**, for example, Contoso_network_access

3. Scroll down to add at least one language to the **Accepted Languages** list and select **Finished**

![Image shows general properties](media/f5-sso-vpn/general-properties.png)

4. Select **Edit** on the Per-Session Policy field of the new access profile, for the visual policy editor to launch in a separate browser tab.

![Image shows per-session policy](media/f5-sso-vpn/per-session-policy.png)

5. Select the **+** sign and in the pop-up select **Authentication** > **SAML Auth** > **Add Item**.

6. In the SAML authentication SP configuration, select the VPN SAML SP object you created earlier, followed by **Save**.

![Image shows saml authentication](media/f5-sso-vpn/saml-authentication.png)

7. Select **+** for the Successful branch of SAML auth.

8. From the Assignment tab, select **Advanced Resource Assign** followed by **Add Item**

![Image shows advance resource assign](media/f5-sso-vpn/advance-resource-assign.png)

9. In the pop-up, select **New Entry** and then **Add/Delete**.

10. In the child window, select **Network Access** and then select the Network Access profile created earlier

![Image shows adding new network access entry](media/f5-sso-vpn/add-new-entry.png)

11. Switch to the **Webtop** tab and add the Webtop object created earlier.

![Image shows adding webtop object](media/f5-sso-vpn/add-webtop-object.png)

12. Select **Update** followed by **Save**.

13. Select the link in the upper Deny box to change the Successful branch to **Allow** then **Save**.

![Image shows new visual policy editor](media/f5-sso-vpn/vizual-policy-editor.png)

14. Commit those settings by selecting **Apply Access Policy** and close the visual policy editor tab.

![Image shows new access policy manager](media/f5-sso-vpn/access-policy-manager.png)

## Publish the VPN service

With all the settings in place, the APM now requires a front-end virtual server to listen for clients connecting to the VPN.

1. Select **Local Traffic** > **Virtual Servers** > **Virtual Server List** and select **Create**.

2. Provide a **Name** for the VPN virtual server, for example, **VPN_Listener**.

3. Provide the virtual server with an unused **IP Destination Address** that has routing in place to receive client traffic

4. Set the Service Port to **443 HTTPS** and ensure the state shows **Enabled**

![Image shows new virtual server](media/f5-sso-vpn/new-virtual-server.png)

5. Set the **HTTP Profile** to http and add the SSL Profile (Client) for the public SSL certificate you provisioned as part of the pre-requisites.

![Image shows ssl profile](media/f5-sso-vpn/ssl-profile.png)

6. Under Access Policy, set the **Access Profile** and **Connectivity Profile** to use the VPN objects created.

![Image shows access policy](media/f5-sso-vpn/access-policy.png)

7. Select **Finished** when done.

8.	Your SSL-VPN service is now published and accessible via SHA, either directly via its URL or through Microsoft’s application portals.

## Additional resources

- [The end of passwords, go passwordless](https://www.microsoft.com/security/business/identity/passwordless)

- [What is Conditional Access?](../conditional-access/overview.md)

- [Microsoft Zero Trust framework to enable remote work](https://www.microsoft.com/security/blog/2020/04/02/announcing-microsoft-zero-trust-assessment-tool/)

- [Five steps to full application integration with Azure AD](../fundamentals/five-steps-to-full-application-integration-with-azure-ad.md)

## Next steps

Open a browser on a remote Windows client and browse to the url of the **BIG-IP VPN service**. After authenticating to Azure AD, you'll see the BIG-IP webtop portal and VPN launcher.

![Image shows vpn launcher](media/f5-sso-vpn/vpn-launcher.png)

Selecting the VPN tile will install the BIG-IP Edge client and establish a VPN connection  configured for SHA.
The F5 VPN application should also be visible as a target resource in Azure AD Conditional Access. See our [guidance](../conditional-access/concept-conditional-access-policies.md) for building Conditional Access policies and also enabling users for Azure AD [password-less authentication](https://www.microsoft.com/security/business/identity/passwordless).