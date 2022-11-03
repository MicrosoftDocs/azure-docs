---
title: How to migrate to the Authentication methods policy - Azure Active Directory
description: Learn about how to centrally manage multifactor authentication (MFA) and self-service password reset (SSPR) settings in the Authentication methods policy.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 11/02/2022

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Azure AD and how I can manage them.
---
# How to migrate MFA and SSPR policy settings to the Authentication methods policy for Azure AD

You can migrate Azure Active Directory (Azure AD) policy settings that separately control multifactor authentication (MFA) and self-service password reset (SSPR) to unified management with the Authentication methods policy. You can migrate policy settings on your own schedule, and the process is fully reversible. You can continue to use tenant-wide MFA and SSPR policies while you configure authentication methods more precisely for users and groups in the Authentication methods policy. You can complete the migration whenever you're ready to manage all authentication methods together in the Authentication methods policy. 

For more information about how these policies work together during migration, see [Manage authentication methods for Azure AD](concept-authentication-methods-manage.md).

## Prepare for migration

Start by conducting an audit of your existing settings for every authentication method available to users. If you roll back during migration, you'll want a record of the authentication method settings from each of these policies:

- MFA policy
- SSPR policy
- Authentication methods policy

In the next sections, we'll walk through an example of the policy migration. We'll review settings in each legacy policy and update the Authentication methods policy. As we proceed, we'll change the migration options to prevent policy misconfiguration and minimize errors during sign-in and SSPR. 

### MFA and SSPR policy settings

Let's say Contoso has the following methods configured for MFA. Document each authentication method that can be used for MFA. These settings are tenant-wide, so there's no need for user or group information.  


For the next step in the migration, record which users are in scope for SSPR and the authentication methods they can use. While security questions aren't yet available to manage in the Authentication methods policy, make sure you copy them for later use when they become available. 

Let's use Contoso as an example. Contoso has the following methods configured for SSPR.



### Authentication methods policy settings

In the Authentication methods policy, you'll want to write down which users and groups are included or excluded from the policy for every authentication method. Also write down any configuration parameters that govern how users can authenticate with each method. For example, document if any group is included in the policy for Microsoft Authenticator to receive location in push notifications. 

<!--- Any report they can use?--->

In our example, Contoso has the following groups set for each method.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/authentication-methods-policy.png" alt-text="Screenshot of Authentication methods policy.":::


## Add MFA and SSPR policy settings to the Authentication methods policy

After you capture information from each policy, update Authentication methods policy to match all of the settings from your audit. This task can be done by an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator).  

You might need to adjust some settings to account for differences between the policies. For example, the Contoso MFA policy allows **Verification code from mobile app or hardware token**. In the Authentication methods policy, **Software OATH tokens** and **Hardware OATH** tokens are managed separately. In this case, Contoso needs to adjust the Authentication methods policy accordingly for each method.  

In the legacy SSPR policy, **Mobile phone** enables both voice call and SMS as available options. But in the Authentication methods policy, **SMS** and **Phone call** are separately managed methods. 

At this point, you can also configure parameters for scenarios where you want to control how a certain method can be used. For example, if you enable **Phone calls** as authentication method, you can allow office phone or mobile only. Step through the process to configure each authentication method from your audit. Then enable and configure other methods you want to be available for sign-in.

Let's look at the updated Authentication methods policy for Contoso after legacy MFA policy settings are migrated. 

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/authentication-methods-policy.png" alt-text="Screenshot of the updated Authentication methods policy.":::

## Migration in progress

Now that you've updated the Authentication methods policy, go through the legacy MFA and SSPR policies and remove each authentication method one-by-one. Test and validate the changes for each method at a time. You can test excluded users by trying to sign in both as a member of the excluded group and again as a non-member. 

When you determine that authentication and SSPR work as expected, you can change the migration process to **Migration in Progress**. In this mode, Azure AD uses the Authentication methods policy for sign-in and SSPR, but still respects changes made to the legacy MFA and SSPR policies. 

For example, let's suppose SMS is disabled in the Authentication methods policy but an admin enables **Text message to phone** in the legacy MFA policy. In that case, users will be able to register and use SMS for sign-in after they enter their username and password. 

<!--- what if you change legacy MFA policy while **Migration in Progress** is set and then roll back to Pre-migration?--->

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/manage-migration.png" alt-text="Screenshot of Migration in progress.":::

## Migration complete

After you update the Authentication methods policy, go through the legacy SSPR policy and remove each authentication method one-by-one. Test and validate the changes for each method at a time. 

When you determine that SSPR works as expected and you no longer need the legacy SSPR policy, you can change the migration process to **Migration Complete**. In this mode, Azure AD only follows the Authentication methods policy. No changes can be made to the legacy policies if **Migration Complete** is set, except for security questions in the SSPR policy.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/migration-complete.png" alt-text="Screenshot of Migration complete.":::

## Next steps

- [Manage authentication methods for Azure AD](concept-authentication-methods-manage.md)
- [What authentication and verification methods are available in Azure Active Directory?](concept-authentication-methods.md)
- [How Azure AD Multi-Factor Authentication works](concept-mfa-howitworks.md)
- [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview)


