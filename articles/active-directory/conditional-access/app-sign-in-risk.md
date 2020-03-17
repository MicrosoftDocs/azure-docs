---
title: Use risk detections with Azure Active Directory Conditional Access
description: In this quickstart, you learn how you can configure an Azure Active Directory (Azure AD) Conditional Access policy to block sign-ins based on session risks.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: quickstart 
ms.date: 11/21/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

#Customer intent: As an IT admin, I want to configure a policy to handle suspicious sign-ins, so that they can be automatically handled.
ms.collection: M365-identity-device-management
---
# Quickstart: Block access when a session risk is detected with Azure Active Directory Conditional Access  

To keep your environment protected, you might want to block suspicious users from sign-in. [Azure Active Directory (Azure AD) Identity Protection](../active-directory-identityprotection.md) analyzes each sign-in and calculates the likelihood that a sign-in attempt was not performed by the legitimate owner of a user account. The likelihood (low, medium, high) is indicated in form of a calculated value called [sign-in risk levels](concept-conditional-access-conditions.md#sign-in-risk). By setting the sign-in risk condition, you can configure a Conditional Access policy to respond to specific sign-in risk levels.

This quickstart shows how to configure a [Conditional Access policy](../active-directory-conditional-access-azure-portal.md) that blocks a sign-in when a configured sign-in risk level has been detected.

![Create policy](./media/app-sign-in-risk/1000.png)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete the scenario in this tutorial, you need:

- **Access to an Azure AD Premium P2 edition** - While Conditional Access is an Azure AD Premium P1 capability, you need a P2 edition because the scenario in this quickstart requires Identity Protection.
- **Identity Protection** - The scenario in this quickstart requires Identity Protection to be enabled. If you don't know how to enable Identity Protection, see [Enabling Azure Active Directory Identity Protection](../identity-protection/overview-identity-protection.md).
- **Tor Browser** - The [Tor Browser](https://www.torproject.org/projects/torbrowser.html.en) is designed to help you preserve your privacy online. Identity Protection detects a sign-in from a Tor Browser as sign-ins from anonymous IP addresses, which have a medium risk level. For more information, see [Azure Active Directory risk detections](../reports-monitoring/concept-risk-events.md).  
- **A test account called Alain Charon** - If you don't know how to create a test account, see [Add cloud-based users](../fundamentals/add-users-azure-active-directory.md#add-a-new-user).

## Test your sign-in

The goal of this step is to make sure that your test account can access your tenant using the Tor Browser.

**To test your sign-in:**

1. Sign in to your [Azure portal](https://portal.azure.com) as **Alain Charon**.
1. Sign out.

## Create your Conditional Access policy

The scenario in this quickstart uses a sign-in from a Tor Browser to generate a detected **Sign-ins from anonymous IP addresses** risk detection. The risk level of this risk detection is medium. To respond to this risk detection, you set the sign-in risk condition to medium. In a production environment, you should set the sign-in risk condition either to high or to medium and high.

This section shows how to create the required Conditional Access policy. In your policy, set:

| Setting | Value |
| --- | --- |
| Users and groups | Alain Charon  |
| Cloud apps | All cloud apps |
| Sign-in risk | Medium |
| Grant | Block access |

![Create policy](./media/app-sign-in-risk/130.png)

**To configure your Conditional Access policy:**

1. Sign in to your [Azure portal](https://portal.azure.com) as global administrator, security administrator, or a Conditional Access administrator.
1. In the Azure portal, on the left navbar, click **Azure Active Directory**.

   ![Azure Active Directory](./media/app-sign-in-risk/02.png)

1. On the **Azure Active Directory** page, in the **Security** section, click **Conditional Access**.

   ![Conditional Access](./media/app-sign-in-risk/03.png)

1. On the **Conditional Access** page, in the toolbar on the top, click **Add**.

   ![Name](./media/app-sign-in-risk/108.png)

1. On the **New** page, in the **Name** textbox, type **Block access for medium risk level**.

   ![Name](./media/app-sign-in-risk/104.png)

1. In the **Assignment** section, click **Users and groups**.

   ![Users and groups](./media/app-sign-in-risk/06.png)

1. On the **Users and groups** page:

   ![Conditional Access](./media/app-sign-in-risk/107.png)

   1. Click **Select users and groups**, and then select **Users and groups**.
   1. Click **Select**.
   1. On the **Select** page, select **Alain Charon**, and then click **Select**.
   1. On the **Users and groups** page, click **Done**.
1. Click **Cloud apps**.

   ![Cloud apps](./media/app-sign-in-risk/08.png)

1. On the **Cloud apps** page:

   ![Conditional Access](./media/app-sign-in-risk/109.png)

   1. Click **All cloud apps**.
   1. Click **Done**.
1. Click **Conditions**.

   ![Access controls](./media/app-sign-in-risk/19.png)

1. On the **Conditions** page:

   ![Sign-in risk level](./media/app-sign-in-risk/21.png)

   1. Click **Sign-in risk**.
   1. As **Configure**, click **Yes**.
   1. As sign-in risk level, select **Medium**.
   1. Click **Select**.
   1. On the **Conditions** page, click **Done**.
1. In the **Access controls** section, click **Grant**.

   ![Access controls](./media/app-sign-in-risk/10.png)

1. On the **Grant** page:

   ![Conditional Access](./media/app-sign-in-risk/105.png)

   1. Select **Block access**.
   1. Click **Select**.
1. In the **Enable policy** section, click **On**.

   ![Enable policy](./media/app-sign-in-risk/18.png)

1. Click **Create**.

## Evaluate a simulated sign-in

Now that you have configured your Conditional Access policy, you probably want to know whether it works as expected. As a first step, use the Conditional Access **what if policy tool** to simulate a sign-in of your test user. The simulation estimates the impact this sign-in has on your policies and generates a simulation report.  

When you run the **what if policy tool** for this scenario, the **Block access for medium risk level** should be listed under **Policies that will apply**.

![User](./media/app-sign-in-risk/117.png)

**To evaluate your Conditional Access policy:**

1. On the [Conditional Access - Policies](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ConditionalAccessBlade/Policies) page, in the menu on the top, click **What If**.  

   ![What If](./media/app-sign-in-risk/14.png)

1. Click **User**, select **Alan Charon** on the **Users** page, and then click **Select**.

   ![User](./media/app-sign-in-risk/116.png)

1. As **Sign-in risk**, select **Medium**.

   ![User](./media/app-sign-in-risk/119.png)

1. Click **What If**.

## Test your Conditional Access policy

In the previous section, you have learned how to evaluate a simulated sign-in. In addition to a simulation, you should also test your Conditional Access policy to make sure that it works as expected.

To test your policy, try to sign-in to your [Azure portal](https://portal.azure.com) as **Alan Charon** using the Tor Browser. Your sign-in attempt should be blocked by your Conditional Access policy.

![Multi-factor authentication](./media/app-sign-in-risk/118.png)

## Clean up resources

When no longer needed, delete the test user, the Tor Browser, and the Conditional Access policy:

- If you don't know how to delete an Azure AD user, see [Delete users from Azure AD](../fundamentals/add-users-azure-active-directory.md#delete-a-user).
- To delete your policy, select your policy, and then click **Delete** in the quick access toolbar.

   ![Multi-factor authentication](./media/app-sign-in-risk/33.png)

- For instructions to remove the Tor Browser, see [Uninstalling](https://tb-manual.torproject.org/uninstalling/).

## Next steps

> [!div class="nextstepaction"]
> [Require terms of use to be accepted](require-tou.md)
> [Require MFA for specific apps](app-based-mfa.md)
