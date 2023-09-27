---
title: Secure resources with Microsoft Entra multifactor authentication and ADFS
description: This is the Microsoft Entra multifactor authentication page that describes how to get started with Microsoft Entra multifactor authentication and AD FS in the cloud.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/13/2023

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Securing cloud resources with Microsoft Entra multifactor authentication and AD FS

If your organization is federated with Microsoft Entra ID, use Microsoft Entra multifactor authentication or Active Directory Federation Services (AD FS) to secure resources that are accessed by Microsoft Entra ID. Use the following procedures to secure Microsoft Entra resources with either Microsoft Entra multifactor authentication or Active Directory Federation Services.

>[!NOTE]
>Set the domain setting [federatedIdpMfaBehavior](/graph/api/resources/internaldomainfederation?view=graph-rest-beta#federatedidpmfabehavior-values&preserve-view=true) to `enforceMfaByFederatedIdp` (recommended) or **SupportsMFA** to `$True`. The **federatedIdpMfaBehavior** setting overrides **SupportsMFA** when both are set.

<a name='secure-azure-ad-resources-using-ad-fs'></a>

## Secure Microsoft Entra resources using AD FS

To secure your cloud resource, set up a claims rule so that Active Directory Federation Services emits the multipleauthn claim when a user performs two-step verification successfully. This claim is passed on to Microsoft Entra ID. Follow this procedure to walk through the steps:

1. Open AD FS Management.
2. On the left, select **Relying Party Trusts**.
3. Right-click on **Microsoft Office 365 Identity Platform** and select **Edit Claim Rules**.

   ![ADFS Console - Relying Party Trusts](./media/howto-mfa-adfs/trustedip1.png)

4. On Issuance Transform Rules, click **Add Rule**.

   ![Editing Issuance Transform Rules](./media/howto-mfa-adfs/trustedip2.png)

5. On the Add Transform Claim Rule Wizard, select **Pass Through or Filter an Incoming Claim** from the drop-down and click **Next**.

   ![Screenshot shows Add Transform Claim Rule Wizard where you select a Claim rule template.](./media/howto-mfa-adfs/trustedip3.png)

6. Give your rule a name. 
7. Select **Authentication Methods References** as the Incoming claim type.
8. Select **Pass through all claim values**.

    ![Screenshot shows Add Transform Claim Rule Wizard where you select Pass through all claim values.](./media/howto-mfa-adfs/configurewizard.png)

9. Click **Finish**. Close the AD FS Management console.

## Trusted IPs for federated users

Trusted IPs allow administrators to bypass two-step verification for specific IP addresses, or for federated users who have requests originating from within their own intranet. The following sections describe how to configure the bypass using Trusted IPs. This is achieved by configuring AD FS to use a pass-through or filter an incoming claim template with the Inside Corporate Network claim type.

This example uses Microsoft 365 for our Relying Party Trusts.

### Configure the AD FS claims rules

The first thing we need to do is to configure the AD FS claims. Create two claims rules, one for the Inside Corporate Network claim type and an additional one for keeping our users signed in.

1. Open AD FS Management.
2. On the left, select **Relying Party Trusts**.
3. Right-click on **Microsoft Office 365 Identity Platform** and select **Edit Claim Rules…**

   ![ADFS Console - Edit Claim Rules](./media/howto-mfa-adfs/trustedip1.png)

4. On Issuance Transform Rules, click **Add Rule.**

   ![Adding a Claim Rule](./media/howto-mfa-adfs/trustedip2.png)

5. On the Add Transform Claim Rule Wizard, select **Pass Through or Filter an Incoming Claim** from the drop-down and click **Next**.

   ![Screenshot shows Add Transform Claim Rule Wizard where you select Pass Through or Filter an Incoming Claim.](./media/howto-mfa-adfs/trustedip3.png)

6. In the box next to Claim rule name, give your rule a name. For example: InsideCorpNet.
7. From the drop-down, next to Incoming claim type, select **Inside Corporate Network**.

   ![Adding Inside Corporate Network claim](./media/howto-mfa-adfs/trustedip4.png)

8. Click **Finish**.
9. On Issuance Transform Rules, click **Add Rule**.
10. On the Add Transform Claim Rule Wizard, select **Send Claims Using a Custom Rule** from the drop-down and click **Next**.
11. In the box under Claim rule name: enter *Keep Users Signed In*.
12. In the Custom rule box, enter:

    ```ad-fs-claim-rule
        c:[Type == "https://schemas.microsoft.com/2014/03/psso"]
            => issue(claim = c); 
    ```

    ![Create custom claim to keep users signed in](./media/howto-mfa-adfs/trustedip5.png)

13. Click **Finish**.
14. Click **Apply**.
15. Click **Ok**.
16. Close AD FS Management.

<a name='configure-azure-ad-multi-factor-authentication-trusted-ips-with-federated-users'></a>

### Configure Microsoft Entra multifactor authentication Trusted IPs with federated users

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Now that the claims are in place, we can configure trusted IPs.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).
1. Browse to **Conditional Access** > **Named locations**.
3. From the **Conditional Access - Named locations** blade, select **Configure MFA trusted IPs**

   ![Microsoft Entra Conditional Access named locations Configure MFA trusted IPs](./media/howto-mfa-adfs/trustedip6.png)

4. On the Service Settings page, under **trusted IPs**, select **Skip multifactor-authentication for requests from federated users on my intranet**.  
5. Click **save**.

That's it! At this point, federated Microsoft 365 users should only have to use MFA when a claim originates from outside the corporate intranet.
