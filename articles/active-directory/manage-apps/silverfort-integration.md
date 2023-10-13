---
title: Secure hybrid access with Microsoft Entra ID and Silverfort
description: In this tutorial, learn how to integrate Silverfort with Microsoft Entra ID for secure hybrid access 
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 12/14/2022
ms.author: gasinh
ms.collection: M365-identity-device-management
ms.custom: not-enterprise-apps
---

# Tutorial: Configure Secure Hybrid Access with Microsoft Entra ID and Silverfort  

[Silverfort](https://www.silverfort.com/) uses agent-less and proxy-less technology to connect your assets on-premises and in the cloud to Microsoft Entra ID. This solution enables organizations to apply identity protection, visibility, and user experience across environments in Microsoft Entra ID. It enables universal risk-based monitoring and assessment of authentication activity for on-premises and cloud environments, and helps to prevent threats.  

<!-- docutune:ignore "Azure A ?D" -->

In this tutorial, learn how to integrate your on-premises Silverfort implementation with Microsoft Entra ID.

Learn more: [Microsoft Entra hybrid joined devices](../devices/concept-hybrid-join.md).

Silverfort connects assets with Microsoft Entra ID. These bridged assets appear as regular applications in Microsoft Entra ID and can be protected with [Conditional Access](../conditional-access/overview.md), single-sign-on (SSO), multifactor authentication, auditing and more. Use Silverfort to connect assets including:

- Legacy and homegrown applications
- Remote desktop and Secure Shell (SSH)
- Command-line tools and other admin access
- File shares and databases
- Infrastructure and industrial systems

Silverfort integrates your corporate assets and third-party Identity and Access Management (IAM) platforms. This includes Active Directory, Active Directory Federation Services (ADFS), and Remote Authentication Dial-In User Service (RADIUS) in Microsoft Entra ID, including hybrid and multicloud environments.

Use this tutorial to configure and test the Silverfort Azure AD bridge in your Microsoft Entra tenant to communicate with your Silverfort implementation. After configuration, you can create Silverfort authentication policies that bridge authentication requests from identity sources to Microsoft Entra ID for SSO. After an application is bridged, you can manage it in Microsoft Entra ID.

<a name='silverfort-with-azure-ad-authentication-architecture'></a>

## Silverfort with Microsoft Entra authentication architecture

The following diagram shows the authentication architecture orchestrated by Silverfort, in a hybrid environment.

![image shows the architecture diagram](./media/silverfort-integration/silverfort-architecture-diagram.png)

### User flow

1. User sends authentication request to the original Identity Provider (IdP) through protocols such as Kerberos, SAML, NTLM, OIDC, and LDAP(s)
2. The response is routed as-is to Silverfort for validation to check authentication state
3. Silverfort provides visibility, discovery, and a bridge to Microsoft Entra ID
4. If the application is bridged, the authentication decision passes to Microsoft Entra ID. Microsoft Entra ID evaluates Conditional Access policies and validates authentication.
5. The authentication state response goes as-is from Silverfort to the IdP
6. IdP grants or denies access to the resource
7. User is notified if access request is granted or denied 

## Prerequisites

You need Silverfort deployed in your tenant or infrastructure to perform this tutorial. To deploy Silverfort in your tenant or infrastructure, go to silverfort.com [Silverfort](https://www.silverfort.com/) to install the Silverfort desktop app on your workstations.

Set up Silverfort Azure AD Adapter in your Microsoft Entra tenant:

- An Azure account with an active subscription
  - You can create an [Azure free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- One of the following roles in your Azure account: 
  - Global Administrator
  - Cloud Application Administrator
  - Application Administrator
  - Service Principal Owner
- The Silverfort Azure AD Adapter application in the Microsoft Entra gallery is pre-configured to support SSO. From the gallery, add the Silverfort Azure AD Adapter to your tenant as an Enterprise application.

## Configure Silverfort and create a policy

1. From a browser, sign in to the Silverfort admin console.
2. In the main menu, navigate to **Settings** and then scroll to **Azure AD Bridge Connector** in the General section. 
3. Confirm your tenant ID, and then select **Authorize**.
4. Select **Save Changes**.
5. On the **Permissions requested** dialog, select **Accept**.

   ![image shows Azure A D bridge connector](./media/silverfort-integration/bridge-connector.png)

   ![image shows registration confirmation](./media/silverfort-integration/grant-permission.png)

6. A Registration Completed message appears in a new tab. Close this tab.

   ![image shows registration completed](./media/silverfort-integration/registration-completed.png)

7. On the **Settings** page, select **Save Changes**.

   ![image shows the Azure A D Adapter](./media/silverfort-integration/silverfort-adapter.png)

8. Sign in to your Microsoft Entra account. In the left pane, select **Enterprise applications**. The **Silverfort Azure AD Adapter** application appears as registered.

   ![image shows enterprise application](./media/silverfort-integration/enterprise-application.png)

9. In the Silverfort admin console, navigate to the **Policies** page and select **Create Policy**. The **New Policy** dialog appears. 
10. Enter a **Policy Name**, the application name to be created in Azure. For example, if adding multiple servers or applications for this policy, name it to reflect the resources covered by the policy. In the example, we create a policy for the SL-APP1 server.

   ![image shows define policy](./media/silverfort-integration/define-policy.png)

11. Select the **Auth Type**, and **Protocol**.

12. In the **Users and Groups** field, select the **edit** icon to configure users affected by the policy. These users' authentication bridges to Microsoft Entra ID.

   ![image shows user and groups](./media/silverfort-integration/user-groups.png)

13. Search and select users, groups, or Organization Units (OUs).

   ![image shows search users](./media/silverfort-integration/search-users.png)

14. Selected users appear in the **SELECTED** box.

   ![image shows selected user](./media/silverfort-integration/select-user.png)

15. Select the **Source** for which the policy will apply. In this example, **All Devices** is selected.

    ![image shows source](./media/silverfort-integration/source.png)

16. Set the **Destination** to SL-App1. Optional: You can select the **edit** button to change or add more resources, or groups of resources.

    ![image shows destination](./media/silverfort-integration/destination.png)

17. For Action, select **Azure AD BRIDGE**.

    ![image shows save Azure A D bridge](./media/silverfort-integration/save-bridge.png)

18. Select **Save**. You're prompted to turn on the policy. 

    ![image shows change status](./media/silverfort-integration/change-status.png)

19. In the Azure AD Bridge section, the policy appears on the Policies page.

    ![image shows add policy](./media/silverfort-integration/add-policy.png)

20. Return to the Microsoft Entra account, and navigate to **Enterprise applications**. The new Silverfort application appears. You can include this application in Conditional Access policies. 

Learn more: [Tutorial: Secure user sign-in events with Microsoft Entra multifactor authentication](../authentication/tutorial-enable-azure-mfa.md?bc=/azure/active-directory/conditional-access/breadcrumb/toc.json&toc=/azure/active-directory/conditional-access/toc.json#create-a-conditional-access-policy).

## Next steps

- [Silverfort Azure AD Adapter](https://azuremarketplace.microsoft.com/marketplace/apps/aad.silverfortazureadadapter?tab=overview)
- [Silverfort resources](https://www.silverfort.com/resources/)
- [Silverfort, company contact](https://www.silverfort.com/company/contact/)
