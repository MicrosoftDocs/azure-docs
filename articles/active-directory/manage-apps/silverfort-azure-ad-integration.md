---
title: Secure hybrid access with Azure AD and Silverfort
description: In this tutorial, learn how to integrate Silverfort with Azure AD for secure hybrid access 
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

# Tutorial: Configure Secure Hybrid Access with Azure Active Directory and Silverfort 

[Silverfort](https://www.silverfort.com/) uses innovative agent-less and proxy-less technology to connect your assets on-premises and in the cloud to Azure Active Directory (Azure AD). This solution enables organizations to apply identity protection, visibility, and user experience across environments in Azure AD. It enables universal risk-based monitoring and assessment of authentication activity for on-premises and cloud environments, and proactively prevents threats.  

In this tutorial, learn how to integrate your on-premises Silverfort implementation with Azure AD for [hybrid access](../devices/concept-azure-ad-join-hybrid.md).

Silverfort connects assets with Azure AD. These bridged assets appear as regular applications in Azure AD and can be protected with Conditional Access, single-sign-on (SSO), multifactor authentication (MFA), auditing and more. Use Silverfort to connect assets including:

- Legacy and homegrown applications
- Remote desktop and Secure Shell (SSH)
- Command-line tools and other admin access
- File shares and databases
- Infrastructure and industrial systems

Silverfort integrates your corporate assets and third-party Identity and Access Management (IAM) platforms. This includes Active Directory, Active Directory Federation Services (ADFS), and Remote Authentication Dial-In User Service (RADIUS) on Azure AD, including hybrid and multicloud environments.

Use this tutorial to configure and test the Silverfort Azure AD bridge in your Azure AD tenant to communicate with your Silverfort implementation. After configuration, you can create Silverfort authentication policies that bridge authentication requests from identity sources to Azure AD for SSO. After an application is bridged, you can manage it in Azure AD.

## Silverfort with Azure AD authentication architecture

The following diagram describes the authentication architecture orchestrated by Silverfort in a hybrid environment.

![image shows the architecture diagram](./media/silverfort-azure-ad-integration/silverfort-architecture-diagram.png)

### User flow

1. User sends authentication request to the original Identity provider (IdP) through protocols such as Kerberos, SAML, NTLM, OIDC, and LDAP(s).
2. The response is routed as-is to Silverfort for validation to check authentication state.
3. Silverfort provides visibility, discovery, and bridging to Azure AD.
4. If the application is bridged, the authentication decision is passed to Azure AD. Azure AD evaluates Conditional Access policies and validates authentication.
5. The authentication state response goes as-is to the IdP by Silverfort.
6. IdP grants or denies access to the resource.
7. User is notified if access request is granted or denied. 

## Prerequisites

You need Silverfort deployed in your tenant or infrastructure to perform this tutorial. To deploy Silverfort in your tenant or infrastructure, go to [Silverfort](https://www.silverfort.com/). Install Silverfort Desktop app on your workstations.

This tutorial requires you to set up Silverfort Azure AD Adapter in your Azure AD tenant. You'll need:

- An Azure account with an active subscription
  - You can create an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- One of the following roles in your Azure account: 
  - Global Administrator
  - Cloud Application Administrator
  - Application Administrator
  - Service Principal Owner
- The Silverfort Azure AD Adapter application in the Azure AD gallery is pre-configured to support SSO. Add the Silverfort Azure AD Adapter to your tenant as an Enterprise application, from the gallery.

## Configure Silverfort and create a policy

1. From a browser, sign in to the Silverfort admin console.
2. In the main menu, navigate to **Settings** and then scroll to **Azure AD Bridge Connector** in the General section. 
3. Confirm your tenant ID, and then select **Authorize**.

   ![image shows azure ad bridge connector](./media/silverfort-azure-ad-integration/azure-ad-bridge-connector.png)

   ![image shows registration confirmation](./media/silverfort-azure-ad-integration/grant-permission.png)

4. A registration confirmation appears in a new tab. Close this tab.

   ![image shows registration completed](./media/silverfort-azure-ad-integration/registration-completed.png)

5. On the **Settings** page, select **Save Changes**.

   ![image shows the azure ad adapter](./media/silverfort-azure-ad-integration/silverfort-azure-ad-adapter.png)

6. Sign in to your Azure AD console. You'll see **Silverfort Azure AD Adapter** application registered as an Enterprise application.

   ![image shows enterprise application](./media/silverfort-azure-ad-integration/enterprise-application.png)

7. In the Silverfort admin console, navigate to the **Policies** page and select **Create Policy**. The **New Policy** dialog appears. 
8. Enter a **Policy Name**, the application name to be created in Azure. For example, if adding multiple servers or applications under this policy, name it to reflect the resources covered by the policy. In the example, we create a policy for the SL-APP1 server.

   ![image shows define policy](./media/silverfort-azure-ad-integration/define-policy.png)

9. Select the **Authentication** type, and **Protocol**.

10. In the **Users and Groups** field, select the **edit** icon to configure users affected by the policy. These users' authentication will be bridged to Azure AD.

   ![image shows user and groups](./media/silverfort-azure-ad-integration/user-groups.png)

11. Search and select users, groups, or Organization Units (OUs).

   ![image shows search users](./media/silverfort-azure-ad-integration/search-users.png)

12. Selected users appear in the **SELECTED** box.

   ![image shows selected user](./media/silverfort-azure-ad-integration/select-user.png)

13. Select the **Source** for which the policy will apply. In this example, All Devices are selected.

    ![image shows source](./media/silverfort-azure-ad-integration/source.png)

14. Set the **Destination** to SL-App1. Optional: You can select the **edit** button to change or add more resources or groups of resources.

    ![image shows destination](./media/silverfort-azure-ad-integration/destination.png)

15. For Action, select **AZURE AD BRIDGE**.

    ![image shows save azure ad bridge](./media/silverfort-azure-ad-integration/save-azure-ad-bridge.png)

16. Select **Save** to save the policy. You're prompted to enable or activate it.

    ![image shows change status](./media/silverfort-azure-ad-integration/change-status.png)

17. The policy appears on the Policies page, in the Azure AD Bridge section.

    ![image shows add policy](./media/silverfort-azure-ad-integration/add-policy.png)

18. Return to the Azure AD console, and navigate to **Enterprise applications**. The new Silverfort application appears. You can include this application in [Conditional Access policies](../authentication/tutorial-enable-azure-mfa.md?bc=/azure/active-directory/conditional-access/breadcrumb/toc.json&toc=/azure/active-directory/conditional-access/toc.json%23create-a-conditional-access-policy).

## Next steps

- [Silverfort Azure AD adapter](https://azuremarketplace.microsoft.com/marketplace/apps/aad.silverfortazureadadapter?tab=overview)
- [Silverfort resources](https://www.silverfort.com/resources/)
- [Silverfort, company contact](https://www.silverfort.com/company/contact/)
