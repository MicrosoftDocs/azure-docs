---
title: Configure Microsoft Entra multifactor authentication and SSO for Oracle JD Edwards applications using Datawiza Access Proxy
description: Enable Microsoft Entra multifactor authentication and SSO for Oracle JD Edwards application using Datawiza Access Proxy
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 01/24/2023
ms.author: gasinh
ms.collection: M365-identity-device-management
ms.custom: not-enterprise-apps
---

# Tutorial: Configure Datawiza to enable Microsoft Entra multifactor authentication and single sign-on to Oracle JD Edwards

In this tutorial, learn how to enable Microsoft Entra single sign-on (SSO) and Microsoft Entra multifactor authentication for an Oracle JD Edwards (JDE) application using Datawiza Access Proxy (DAP).

Learn more [Datawiza Access Proxy](https://www.datawiza.com/)

Benefits of integrating applications with Microsoft Entra ID using DAP:

* [Embrace proactive security with Zero Trust](https://www.microsoft.com/security/business/zero-trust) - a security model that adapts to modern environments and embraces hybrid workplace, while it protects people, devices, apps, and data
* [Microsoft Entra single sign-on](https://azure.microsoft.com/solutions/active-directory-sso/#overview) - secure and seamless access for users and apps, from any location, using a device
* [How it works: Microsoft Entra multifactor authentication](../authentication/concept-mfa-howitworks.md) - users are prompted during sign-in for forms of identification, such as a code on their cellphone or a fingerprint scan
* [What is Conditional Access?](../conditional-access/overview.md) - policies are if-then statements, if a user wants to access a resource, then they must complete an action
* [Easy authentication and authorization in Microsoft Entra ID with no-code Datawiza](https://www.microsoft.com/security/blog/2022/05/17/easy-authentication-and-authorization-in-azure-active-directory-with-no-code-datawiza/) - use web applications such as: Oracle JDE, Oracle E-Business Suite, Oracle Sibel, and home-grown apps
* Use the [Datawiza Cloud Management Console](https://console.datawiza.com) (DCMC) - manage access to applications in public clouds and on-premises

## Scenario description

This scenario focuses on Oracle JDE application integration using HTTP authorization headers to manage access to protected content.

In legacy applications, due to the absence of modern protocol support, a direct integration with Microsoft Entra SSO is difficult. DAP can bridge the gap between the legacy application and the modern ID control plane, through protocol transitioning. DAP lowers integration overhead, saves engineering time, and improves application security.

## Scenario architecture

The scenario solution has the following components:

* **Microsoft Entra ID** - identity and access management service that helps users sign in and access external and internal resources
* **Oracle JDE application** - legacy application protected by Microsoft Entra ID
* **Datawiza Access Proxy (DAP)** - container-based reverse-proxy that implements OpenID Connect (OIDC), OAuth, or Security Assertion Markup Language (SAML) for user sign-in flow. It passes identity transparently to applications through HTTP headers.
* **Datawiza Cloud Management Console (DCMC)** -a console to manage DAP. Administrators use UI and RESTful APIs to configure DAP and access control policies.

Learn more: [Datawiza and Microsoft Entra authentication Architecture](./datawiza-configure-sha.md#datawiza-with-azure-ad-authentication-architecture)

## Prerequisites

Ensure the following prerequisites are met.

* An Azure subscription. 
  * If you don't have one, you can get an [Azure free account](https://azure.microsoft.com/free)
* A Microsoft Entra tenant linked to the Azure subscription
  * See, [Quickstart: Create a new tenant in Microsoft Entra ID.](../fundamentals/create-new-tenant.md)
* Docker and Docker Compose
  * Go to docs.docker.com to [Get Docker](https://docs.docker.com/get-docker) and [Install Docker Compose](https://docs.docker.com/compose/install)
* User identities synchronized from an on-premises directory to Microsoft Entra ID, or created in Microsoft Entra ID and flowed back to an on-premises directory
  * See, [Microsoft Entra Connect Sync: Understand and customize synchronization](../hybrid/connect/how-to-connect-sync-whatis.md)
* An account with Microsoft Entra ID and a global administrator role. See, [Microsoft Entra built-in roles, all roles](../roles/permissions-reference.md#all-roles)
* An Oracle JDE environment
* (Optional) An SSL web certificate to publish services over HTTPS. You can also use default Datawiza self-signed certs for testing 

## Getting started with DAB

To integrate Oracle JDE with Microsoft Entra ID:

1. Sign in to [Datawiza Cloud Management Console.](https://console.datawiza.com/)
2. The Welcome page appears.
3. Select the orange **Getting started** button.

   ![Screenshot of the Getting Started button.](./media/datawiza-sso-oracle-jde/getting-started.png)

4. In the **Name** and **Description** fields, enter information.
5. Select **Next**.

   ![Screenshot of the Name field and Next button under Deployment Name.](./media/datawiza-sso-oracle-jde/name-description-field.png)

6. On the **Add Application** dialog, for **Platform**, select **Web**.
7. For **App Name**, enter a unique application name.
8. For **Public Domain**, for example enter `https://jde-external.example.com`. For testing the configuration, you can use localhost DNS. If you aren't deploying DAP behind a load balancer, use the **Public Domain** port.
9. For **Listen Port**, select the port that DAP listens on.
10. For **Upstream Servers**, select the Oracle JDE implementation URL and port to be protected.
11. Select **Next**.

   ![Screenshot of Public Domain, Listen Port, and Upstream Server entries.](./media/datawiza-sso-oracle-jde/add-application.png)

12. On the **Configure IdP** dialog, enter information.

   >[!Note]
   >Use DCMC one-click integration to help complete Microsoft Entra configuration. DCMC calls the Graph API to create an application registration on your behalf in your Microsoft Entra tenant. Go to docs.datawiza.com for [One Click Integration With Microsoft Entra ID](https://docs.datawiza.com/tutorial/web-app-azure-one-click.html).

13. Select **Create**.

   ![Screenshot of Protocol, Identity Provider, and Supported account types entries, also the Create button.](./media/datawiza-sso-oracle-jde/configure-idp.png)

14. The DAP deployment page appears.
15. Make a note of the deployment Docker Compose file. The file includes the DAP image, Provisioning Key, and Provision Secret, which pulls the latest configuration and policies from DCMC.

    ![Screenshot of Docker entries.](./media/datawiza-sso-oracle-jde/provision.png)

## SSO and HTTP headers

DAP gets user attributes from IdP and passes them to the upstream application with a header or cookie.

The Oracle JDE application needs to recognize the user: using a name, the application instructs DAP to pass the values from the IdP to the application through the HTTP header.

1. In Oracle JDE, from the left navigation, select **Applications**.
2. Select the **Attribute Pass** subtab.
3. For **Field**, select **Email**.
4. For **Expected**, select **JDE_SSO_UID**.
5. For **Type**, select **Header**.

   ![Screenshot of information on the Attribute Pass tab.](./media/datawiza-sso-oracle-jde/add-new-attribute.png)

   >[!Note]
   >This configuration uses the Microsoft Entra user principal name as the sign-in username, used by Oracle JDE. To use another user identity, go to the **Mappings** tab.

   ![Screenshot of the userPrincipalName entry.](./media/datawiza-sso-oracle-jde/user-principal-name-mapping.png)


6. Select the **Advanced** tab.

   ![Screenshot of information on the Advanced tab.](./media/datawiza-sso-oracle-jde/advanced-attributes.png)


   ![Screenshot of information on the Attribute Pass tab.](./media/datawiza-sso-oracle-jde/add-new-attribute.png)


7. Select **Enable SSL**.

8. From the **Cert Type** dropdown, select a type.

   ![Screenshot that shows the cert type dropdown.](./media/datawiza-sso-oracle-jde/cert-type-new.png)


9. For testing purposes, we'll be providing a self-signed certificate. 

   ![Screenshot that shows the enable SSL menu.](./media/datawiza-sso-oracle-jde/enable-ssl-new.png)

   >[!NOTE]
   >You have the option to upload a certificate from a file.

   ![Screenshot that shows uploading cert from a file option.](./media/datawiza-sso-oracle-jde/cert-upload-new.png)

10. Select **Save**.

<a name='enable-azure-ad-multi-factor-authentication-'></a>

## Enable Microsoft Entra multifactor authentication 

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To provide more security for sign-ins, you can enforce MFA for user sign-in. 

See,  [Tutorial: Secure user sign-in events with Microsoft Entra multifactor authentication](../authentication/tutorial-enable-azure-mfa.md).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a [Global Administrator](../roles/permissions-reference.md#global-administrator).
2. Browse to **Identity** > **Overview** > **Properties** tab.
3. Under **Security defaults**, select **Manage security defaults**.
4. On the **Security defaults** pane, toggle the dropdown menu to select **Enabled**.
5. Select **Save**.

## Enable SSO in the Oracle JDE EnterpriseOne Console

To enable SSO in the Oracle JDE environment:

1. Sign in to the Oracle JDE EnterpriseOne Server Manager Management Console as an Administrator.
2. In **Select Instance**, select the option above **EnterpriseOne HTML Server**.
3. In the **Configuration** tile, select **View as Advanced**.
4. Select **Security**.
5. Select the **Enable Oracle Access Manager** checkbox.
6. In the **Oracle Access Manager Sign-Off URL** field, enter **datawiza/ab-logout**.
7. In the **Security Server Configuration** section, select **Apply**.
8. Select **Stop**.

   >[!NOTE]
   >If a message states the web server configuration (jas.ini) is out-of-date, select **Synchronize Configuration**.

9. Select **Start**.

## Test an Oracle JDE-based application

To test an Oracle JDE application, validate application headers, policy, and overall testing. If needed, use header and policy simulation to validate header fields and policy execution.

To confirm Oracle JDE application access occurs, a prompt appears to use a Microsoft Entra account for sign-in. Credentials are checked and the Oracle JDE appears.

## Next steps

* Video [Enable SSO and MFA for Oracle JDE) with Microsoft Entra ID via Datawiza](https://www.youtube.com/watch?v=_gUGWHT5m90)
* [Tutorial: Configure Secure Hybrid Access with Microsoft Entra ID and Datawiza](./datawiza-configure-sha.md)
* [Tutorial: Configure Azure AD B2C with Datawiza to provide secure hybrid access](../../active-directory-b2c/partner-datawiza.md)
* Go to docs.datawiza.com for Datawiza [User Guides](https://docs.datawiza.com/)
