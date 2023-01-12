---
title: Tutorial to migrate Okta sign-on policies to Azure Active Directory Conditional Access
description: Learn how to migrate Okta sign-on policies to Azure Active Directory Conditional Access.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/12/2023
ms.author: gasinh
ms.subservice: app-mgmt
---

# Tutorial: Migrate Okta sign-on policies to Azure Active Directory Conditional Access

In this tutorial, learn to migrate an an organization from global or application-level sign-on policies in Okta Conditional Access in Azure Active Directory (Azure AD). Conditional Access policies secure user access in Azure AD and connected applications.

Learn more: [What is Conditional Access?](/azure/active-directory/conditional-access/overview)

This tutorial assumes you have:

* Office 365 tenant federated to Okta for sign-in and multi-factor authentication.
* Azure AD Connect server, or Azure AD Connect cloud provisioning agents configured for user provisioning to Azure AD

## Prerequisites

See the following two section for licensing and credentials prerequisites.

### Licensing

There are licensing requirements if you switch from Okta sign-on to Conditional Access. The process requires an Azure AD Premium P1 license to enable registration for Azure AD Multi-Factor Authentication (MFA).

Learn more: [Assign or remove licenses in the Azure Active Directory portal](/azure/active-directory/fundamentals/license-users-groups)

### Enterprise Administrator credentials

To configure the service connection point (SCP) record, ensure you have Enterprise Administrator credentials in the on-premises forest.

## Evaluate Okta sign-on policies for transition

Locate and evaluate Okta sign-on policies to determine what will be transitioned to Azure AD.

1. In Okta go to **Security** > **Authentication** > **Sign On**.

    ![Screenshot of Global MFA Sign On Policy entries on the Authentication page.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/global-sign-on-policies.png)

2. Go to **Applications**. 
3. From the submenu, select **Applications**
4. From the **Active apps list**, select the Microsft Office 365 connected instance.

    ![Screenshot of settings under Sign On, for Microsoft Office 365.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/global-sign-on-policies-enforce-mfa.png)

5. Select **Sign On**.
6. Scroll to the bottom of the page.

The Microsft Office 365 application sign-on policy has four rules:

- **Enforce MFA for Mobile Sessions** - Requires MFA from modern authentication or browser sessions on iOS or Android
- **Allow Trusted Windows Devices** - Prevents unnecessary verification or factor prompts for trusted Okta devices
- **Require MFA from Untrusted Windows Devices** - Requires MFA from modern authentication or browser sessios on untrusted Windows devices
- **Block Legacy Authentication** - Prevents legacy authentication clients from connecting to the service

   ![Screenshot of conditions and actions for the four rules, on the Sign On Policy screen.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/sign-on-rules.png)

## Configure Conditional Access policies

Configure Conditional Access policies to match Okta conditions. However, in some scenarios, you might need more setup:

* Okta network locations to named locations in Azure AD
  *  [Using the location condition in a Conditional Access policy](/articles/active-directory/conditional-access/location-condition.md#named-locations)
* Okta device trust to device-based Conditional Access (two options to evaluate user devices):
  * See the following section, **Hybrid Azure AD join configuration** to synchronizes Windows devices, such as Windows 10, Windows Server 2016 and 2019, to Azure AD.
  * See the following section, **Configure device compliance**

### Hybrid Azure AD join configuration

To enable hybrid Azure AD join on your Azure AD Connect server, run the configuration wizard. After configuration, enroll devices.

>[!NOTE]
>Hybrid Azure AD join isn't supported with the Azure AD Connect cloud provisioning agents.

1. [Configure hybrid Azure AD join](/articles/active-directory/devices/howto-hybrid-azure-ad-join.md).
2. On the **SCP configuration** page, select the **Authentication Service** dropdown. 

    ![Screenshot of the Authentication Service dropdown on the Microsoft Azure Active Directory Connect dialog.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/scp-configuration.png)

4. Select an Okta federation provider URL.
5. Select **Add**. 
6. Enter your on-premises Enterprise Administrator credentials
7. Select **Next**.

    > [!TIP]
    > If you blocked legacy authentication on Windows clients in the global or app-level sign-on policy, make a rule that enables the hybrid Azure AD join process to finish.
    > Allow the legacy authentication stack for Windows clients. </br>To enable custom client strings on app policies, contact the [Okta Help Center](https://support.okta.com/help/). 

### Configure device compliance

Hybrid Azure AD join replaces Okta device trust on Windows. Conditional Access policies can include compliance for devices enrolled in Endpoint Manager:

* **Compliance overview**: Refer to [device compliance policies in Intune](/mem/intune/protect/device-compliance-get-started#:~:text=Reference%20for%20non-compliance%20and%20Conditional%20Access%20on%20the,applicable%20%20...%20%203%20more%20rows)
* **Device compliance**: Create [policies in Intune](/mem/intune/protect/create-compliance-policy)
* **Windows enrollment**: If you've opted to deploy hybrid Azure AD join, you can deploy another group policy to complete the [auto-enrollment process of these devices in Intune](/windows/client-management/mdm/enroll-a-windows-10-device-automatically-using-group-policy)
* **iOS/iPadOS enrollment**: Before you enroll an iOS device, you must make [more configurations](/mem/intune/enrollment/ios-enroll) in the Endpoint Management console
* **Android enrollment**: Before you enroll an Android device, you must make [more configurations](/mem/intune/enrollment/android-enroll) in the Endpoint Management console.

## Configure Azure AD Multi-Factor Authentication tenant settings

Before you convert to Conditional Access, confirm the base Azure AD Multi-Factor Authentication tenant settings for your organization.

1. Go to the [Azure portal](https://portal.azure.com) and sign in with a global administrator account.

1. Select **Azure Active Directory** > **Users** > **Multi-Factor Authentication** to go to the legacy Azure AD Multi-Factor Authentication portal.

   ![Screenshot that shows the legacy Azure AD Multi-Factor Authentication portal.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/legacy-azure-ad-portal.png)

   You can also use the legacy link to the [Azure AD Multi-Factor Authentication portal](https://aka.ms/mfaportal).

1. On the legacy **multi-factor authentication** menu, change the status menu through **Enabled** and **Enforced** to confirm you have no users enabled for legacy MFA. If your tenant has users in the following views, you must disable them in the legacy menu. Only then will Conditional Access policies take effect on their account.

   ![Screenshot that shows disabling a user in the legacy Azure AD Multi-Factor Authentication portal.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/disable-user-legacy-azure-ad-portal.png)

   The **Enforced** field should also be empty.

1. Select the **Service settings** option. Change the **App passwords** selection to **Do not allow users to create app passwords to sign in to non-browser apps**.

   ![Screenshot that shows the application password settings not allowing users to create app passwords.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/app-password-selection.png)

1. Ensure the **Skip multi-factor authentication for requests from federated users on my intranet** and **Allow users to remember multi-factor authentication on devices they trust (between one to 365 days)** checkboxes are cleared, and then select **Save**.

  >[!NOTE]
   >See [best practices for configuring the MFA prompt settings](../authentication/concepts-azure-multi-factor-authentication-prompts-session-lifetime.md).

![Screenshot that shows cleared checkboxes in the legacy Azure AD Multi-Factor Authentication portal.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/uncheck-fields-legacy-azure-ad-portal.png)

## Configure Conditional Access policies

After you've configured the prerequisites and established the base settings, it's time to build the first Conditional Access policy.

1. To configure Conditional Access policies in Azure AD, go to the [Azure portal](https://portal.azure.com). On **Manage Azure Active Directory**, select **View**.

   Configure Conditional Access policies by following [best
practices for deploying and designing Conditional Access](../conditional-access/plan-conditional-access.md#understand-conditional-access-policy-components).

1. To mimic the global sign-on MFA policy from Okta, [create a policy](../conditional-access/howto-conditional-access-policy-all-users-mfa.md).

1. Create a [device trust-based Conditional Access rule](../conditional-access/require-managed-devices.md).

   This policy as any other in this tutorial can be targeted to a specific application, a test group of users, or both.

   ![Screenshot that shows testing a user.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/test-user.png)

   ![Screenshot that shows success in testing a user.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/success-test-user.png)

1. After you've configured the location-based policy and device trust policy, it's time to configure the equivalent [block legacy authentication](../conditional-access/howto-conditional-access-policy-block-legacy.md) policy.

With these three Conditional Access policies, the original Okta sign-on policies experience has been replicated in Azure AD. Next steps involve enrolling the user via Azure AD Multi-Factor Authentication and testing the policies.

## Enroll pilot members in Azure AD Multi-Factor Authentication

After you configure the Conditional Access policies, users must register for Azure AD Multi-Factor Authentication methods. Users can be required to register through several different methods.

1. For individual registration, direct users to the [Microsoft Sign-in pane](https://aka.ms/mfasetup) to manually enter the registration information.

1. Users can go to the [Microsoft Security info page](https://aka.ms/mysecurityinfo) to enter information or manage the form of MFA registration.

See [this guide](../authentication/howto-registration-mfa-sspr-combined.md) to fully understand the MFA registration process.

Go to the [Microsoft Sign-in pane](https://aka.ms/mfasetup). After you sign in with Okta MFA, you're instructed to register for MFA with Azure AD.

>[!NOTE]
>If registration already happened in the past for a user, they're taken to the **My Security** information page after they satisfy the MFA prompt.
See the [user documentation for MFA enrollment](../user-help/security-info-setup-signin.md).

## Enable Conditional Access policies

1. To roll out testing, change the policies created in the earlier examples to **Enabled test user login**.

   ![Screenshot that shows enabling a test user.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/enable-test-user.png)

1. On the next Office 365 **Sign-In** pane, the test user John Smith is prompted to sign in with Okta MFA and Azure AD Multi-Factor Authentication.

   ![Screenshot that shows the Azure Sign-In pane.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/sign-in-through-okta.png)

1. Complete the MFA verification through Okta.

   ![Screenshot that shows MFA verification through Okta.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/mfa-verification-through-okta.png)

1. After the user completes the Okta MFA prompt, the user is prompted for Conditional Access. Ensure that the policies were configured appropriately and are within conditions to be triggered for MFA.

   ![Screenshot that shows MFA verification through Okta prompted for Conditional Access.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/mfa-verification-through-okta-prompted-ca.png)

## Cut over from sign-on to Conditional Access policies

After you conduct thorough testing on the pilot members to ensure that Conditional Access is in effect as expected, the remaining organization members can be added to Conditional Access policies after registration has been completed.

To avoid double-prompting between Azure AD Multi-Factor Authentication and Okta MFA, opt out from Okta MFA by modifying sign-on policies.

The final migration step to Conditional Access can be done in a staged or cut-over fashion.

1. Go to the Okta admin console, select **Security** > **Authentication**, and then go to **Sign-on Policy**.

   >[!NOTE]
   > Set global policies to **Inactive** only if all applications from Okta are protected by their own application sign-on policies.
1. Set the **Enforce MFA** policy to **Inactive**. You can also assign the policy to a new group that doesn't include the Azure AD users.

   ![Screenshot that shows Global MFA Sign On Policy as Inactive.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/mfa-policy-inactive.png)

1. On the application-level sign-on policy pane, update the policies to **Inactive** by selecting the **Disable Rule** option. You can also assign the policy to a new group that doesn't include the Azure AD users.

1. Ensure there's at least one application-level sign-on policy that's enabled for the application that allows access without MFA.

   ![Screenshot that shows application access without MFA.](media/migrate-okta-sign-on-policies-to-azure-active-directory-conditional-access/application-access-without-mfa.png)

1. After you disable the Okta sign-on policies or exclude the migrated Azure AD users from the enforcement groups, users are prompted *only* for Conditional Access the next time they sign in.

## Next steps

For more information about migrating from Okta to Azure AD, see:

- [Migrate applications from Okta to Azure AD](migrate-applications-from-okta-to-azure-active-directory.md)
- [Migrate Okta federation to Azure AD](migrate-okta-federation-to-azure-active-directory.md)
- [Migrate Okta sync provisioning to Azure AD Connect-based synchronization](migrate-okta-sync-provisioning-to-azure-active-directory.md)
