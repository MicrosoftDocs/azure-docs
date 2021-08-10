---

title: Tutorial to migrate Okta sign on policies to Azure Active Directory Conditional Access
titleSuffix: Active Directory
description: Learn how to migrate Okta sign on policies to Azure Active Directory Conditional Access
services: active-directory
author: gargi-sinha
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 08/10/2021
ms.author: gasinh
ms.subservice: manage-apps
---

# Tutorial: Migrate Okta sign on policies to Azure Active Directory Conditional Access

In this tutorial, learn how organizations can migrate from global or application-level sign-on policies in Okta to Azure Active Directory (AD) Conditional Access (CA) policies to secure user access in Azure AD and connected applications.

This tutorial assumes you have an Office 365 tenant federated to Okta for sign-on and multifactor authentication (MFA). You should also have Azure AD Connect server or Azure AD Connect cloud provisioning agents configured for user provisioning to Azure AD.

## Pre-requisites

When switching from Okta sign on to Azure AD CA, it's important to understand licensing requirements. Azure AD CA requires users have an Azure AD Premium P1 License assigned before registration for Azure AD MFA.

Before you do any of the steps for hybrid Azure AD join, you'll need an enterprise administrator credential in the on-premises forest to configure the Service Connection Point (SCP) record.

## Migration steps

The following are the high-level migration tasks:

1. [Create a catalog of current Okta sign on policies](#step-1---catalog-current-okta-sign-on-policies)

2. [Configure condition pre-requisites](#step-2---configure-condition-pre-requisites)

3. [Configure Azure AD MFA tenant settings](#step-3---configure-azure-ad-mfa-tenant-settings)

4. [Configure CA policies](#step-4---configure-ca-policies)

5. [Enroll pilot members in Azure AD MFA](#step-5---enroll-pilot-members-in-azure-ad-mfa)

6. [Enable CA policies](#step-6---enable-ca-policies)

7. [Cutover from sign on to CA policies](#step-7---cutover-from-sign-on-to-ca-policies)

### Step 1 - Catalog current Okta sign on policies

To complete a successful transition to CA, the existing Okta sign on policies should be evaluated to determine use cases and requirements that will be transitioned to Azure AD.

1. Check the global sign-on policies by navigating to **Security**, selecting **Authentication**, and then **Sign On**.

![image shows global sign on policies](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/global-sign-on-policies.png)

In this example, our global sign-on policy is enforcing MFA on all sessions outside of our configured network zones.

![image shows global sign on policies enforcing mfa](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/global-sign-on-policies-enforcing-mfa.png)

2. Next, navigate to **Applications**, and check the application-level sign-on policies. Select **Applications** from the submenu, and then select your Office 365 connected instance from the **Active apps list**.

3. Finally, select **Sign On** and scroll to the bottom of the page.

In the following example, our Office 365 application sign-on policy has four separate rules.

- **Enforce MFA for mobile sessions** - Requires MFA from every modern authentication or browser session on iOS or Android.

- **Allow trusted Windows devices** - Prevents your trusted Okta devices from being prompted for additional verification or factors.

- **Require MFA from untrusted Windows devices** - Requires MFA from every modern authentication or browser session on untrusted Windows devices.

- **Block legacy authentication** - Prevents any legacy authentication clients from connecting to the service.

![image shows o365 sign on rules](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/o365-sign-on-rules.png)

### Step 2 - Configure condition pre-requisites

Azure AD CA policies can be configured to match Okta's conditions for most scenarios without additional configuration.

In some scenarios, you may need additional setup before you configure the CA policies. The two known scenarios at the time of writing this article are:

- **Okta network locations to named locations in Azure AD** - Follow [this article](https://docs.microsoft.com/azure/active-directory/conditional-access/location-condition#named-locations) to configure named locations in Azure AD.

- **Okta device trust to device-based CA** - CA offers two possible options when evaluating a user's device.

  - [Hybrid Azure AD join](#hybrid-azure-ad-join-configuration) - A feature enabled within the Azure AD Connect server that synchronizes Windows current devices such as Windows 10, Server 2016 and 2019, to Azure AD.

  - [Enroll the device into Microsoft Endpoint Manager](#configure-device-compliance) and assign a compliance policy.

#### Hybrid Azure AD join configuration

Enabling hybrid Azure AD join can be done on your Azure AD Connect server by running the configuration wizard. Post configuration, steps will need to be taken to automatically enroll devices.

>[!NOTE]
>Hybrid Azure AD join isn't supported with the Azure AD Connect cloud provisioning agents.

1. Follow these [instructions](https://docs.microsoft.com/azure/active-directory/devices/hybrid-azuread-join-managed-domains#configure-hybrid-azure-ad-join) to enable Hybrid Azure AD join.

2. On the SCP configuration page, select the **Authentication Service** drop-down. Choose your Okta federation provider URL followed by **Add**. Enter your on-premises enterprise administrator credentials then select **Next**.

  ![image shows scp configuration](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/scp-configuration.png)

3. If you have blocked legacy authentication on Windows clients in either the global or app level sign on policy, make a rule to allow the hybrid Azure AD join process to finish.

4. You can either allow the entire legacy authentication stack through for all Windows clients or contact Okta support to enable their custom client string on your existing app policies.

![image shows hybrid azure ad join in okta](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/hybrid-azure-ad-join.png)

#### Configure device compliance

While hybrid Azure AD join is direct replacement for Okta device trust on Windows, CA policies can also look at device compliance for devices that have fully enrolled into Microsoft Endpoint Manager.

- **Compliance overview** - Refer to [device compliance policies in Microsoft Intune](https://docs.microsoft.com/mem/intune/protect/device-compliance-get-started#:~:text=Reference%20for%20non-compliance%20and%20Conditional%20Access%20on%20the,applicable%20%20...%20%203%20more%20rows).

- **Device compliance** - Create [policies in Microsoft Intune](https://docs.microsoft.com/mem/intune/protect/create-compliance-policy).

- **Windows enrollment** - If you've opted to deploy hybrid Azure AD join, an additional group policy can be deployed to complete the [auto-enrollment process of these devices into Microsoft Intune](https://docs.microsoft.com/windows/client-management/mdm/enroll-a-windows-10-device-automatically-using-group-policy).

- **iOS/iPadOS enrollment** - Before enrolling an iOS device, [additional configurations](https://docs.microsoft.com/mem/intune/enrollment/ios-enroll) must be made in the Endpoint Management Console.

- **Android enrollment** - Before enrolling an Android device, [additional configurations](https://docs.microsoft.com/mem/intune/enrollment/android-enroll) must be made in the Endpoint Management Console.

### Step 3 - Configure Azure AD MFA tenant settings

Before converting to CA, confirm the base Azure AD MFA
tenant settings for your organization.

1. Navigate to the [Azure portal](https://portal.azure.com) and sign in with a global administrator account.

2. Select **Azure Active Directory**, followed by **Users**, and then **Multi-Factor Authentication** this will take you to the Legacy Azure MFA portal.

![image shows legacy Azure AD mfa portal](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/legacy-azure-ad-portal.png)

Instead, you can use **<http://aka.ms/mfaportal>**.

4. From the **Legacy Azure MFA** menu, change the status menu through **enabled** and **enforced** to confirm you have no users enabled for Legacy MFA. If your tenant has users in the below views, you must disable them in the legacy menu. Only then CA policies will take effect on their account.

![image shows disable user in legacy Azure AD mfa portal](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/disable-user-legacy-azure-ad-portal.png)

**Enforced** field should also be empty.

![image shows enforced field is empty in legacy Azure AD mfa portal](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/enforced-empty-legacy-azure-ad-portal.png)

5. After confirming no users are configured for legacy MFA, select the **Service settings** option. Change the **App passwords** selection to **Do not allow users to create app passwords to sign in to non-browser apps**.

6. Ensure the **Skip multi-factor authentication for requests from federated users on my intranet** and **Allow users to remember multi-factor authentication on devices they trust (between one to 365 days)** boxes are unchecked and then select **Save**.

>[!NOTE\]
>See [best practices for configuring MFA prompt settings](http://aka.ms/mfaprompts).

![image shows uncheck fields in legacy Azure AD mfa portal](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/uncheck-fields-legacy-azure-ad-portal.png)

### Step 4 - Configure CA policies

After you configured the pre-requisites, and established the base settings its time to build the first CA policy.

1. To configure CA policies in Azure AD, navigate to the [Azure portal](https://portal.azure.com). Select **View** on Manage Azure Active Directory.

2. Configuration of CA policies should keep in mind [best
practices for deploying and designing CA](https://docs.microsoft.com/en-us/azure/active-directory/conditional-access/plan-conditional-access#understand-conditional-access-policy-components).

3. To mimic global sign-on MFA policy from Okta, [create a policy](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-policy-all-users-mfa).

4. Create a [device trust based CA rule](https://docs.microsoft.com/azure/active-directory/conditional-access/require-managed-devices).

5. This policy as any other in this tutorial can be targeted to a specific application, test group of users or both.

![image shows testing user](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/test-user.png)

![image shows success in testing user](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/success-testing-user.png)

6. After you configured the location-based policy, and device
trust policy, its time to configure the equivalent **[Block legacy authentication](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-policy-block-legacy)** policy.

With these three CA policies, the original Okta sign on policies experience has been replicated in Azure AD. Next steps involve enrolling the user to Azure MFA and testing the policies.

### Step 5 - Enroll pilot members in Azure AD MFA 

Once the CA policies have been configured, users will
need to register for Azure MFA methods. Users can be required to register through several different methods.

1. For individual registration, you can direct users to
<http://aka.ms/mfasetup> to manually enter the registration information.

2. User can go to <http://aka.ms/mysecurityinfo> to
enter information or manage form of MFA registration.

See [this guide](https://docs.microsoft.com/azure/active-directory/authentication/howto-registration-mfa-sspr-combined) to fully understand the MFA registration process.  

Navigate to <http://aka.ms/mfasetup> after signing in with Okta MFA, you're instructed to register for MFA with Azure AD.

>[!NOTE]
>If registration already happened in the past for that user,
they'll be taken to **My Security** information page after  satisfying the MFA prompt.

See the [end-user documentation for MFA enrollment](https://docs.microsoft.com/azure/active-directory/user-help/security-info-setup-signin).

### Step 6 - Enable CA policies

1. To roll out testing, change the policies created in the earlier examples to **Enabled test user login**.

![image shows enable test user](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/enable-test-user.png)

2. On the next sign-in to Office 365, the test user John Smith is prompted to sign in with Okta MFA, and Azure AD MFA.

![image shows sign-in through okta](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/sign-in-through-okta.png)

3. Complete the MFA verification through Okta.

![image shows mfa verification through okta](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/mfa-verification-through-okta.png)

4. After the user completes the Okta MFA prompt, the user will be prompted for CA. Ensure that the policies have been configured appropriately and is within conditions to be triggered for MFA.

![image shows mfa verification through okta prompted for CA](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/mfa-verification-through-okta-prompted-ca.png)

### Step 7 - Cutover from sign on to CA policies

After conducting thorough testing on the pilot members to ensure that CA is in effect as expected, the remaining organization members can be added into CA policies after registration has been completed.

To avoid double-prompting between Azure MFA and Okta MFA, you should opt out from Okta MFA by modifying sign-on policies.

The final migration step to CA can be done in a staged or cut-over fashion.

1. Navigate to the Okta admin console, select **Security**, followed by **Authentication**, and then navigate to the **Sign On Policy**.

>[!NOTE] Global policies should be set to inactive only if all applications from Okta are protected by their own application sign on policies.

2. Set the Enforce MFA policy to **Inactive** or assign the policy to a new group that doesn't include our Azure AD users.

![image shows mfa policy to inactive](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/mfa-policy-inactive.png)

3. On the application-level sign-on policy, update the policies to inactive by selecting the **Disable Rule** option. You can also assign the policy to a new group that doesn't include the Azure AD users.

4. Ensure there is at least one application level sign-on policy that is enabled for the application that allows access without MFA.

![image shows application access without mfa](media/migrate-okta-sign-on-policies-to-azure-ad-conditional-access/application-access-without-mfa.png)

5. After disabling the Okta sign on policies, or excluding the migrated Azure AD users from the enforcement groups, the users should be prompted **only** for CA on their next sign-in.

## Next steps

- [Migrate applications from Okta to Azure AD](migrate-applications-from-okta-to-azure-active-directory.md)

- [Migrate Okta federation to Azure AD](migrate-okta-federation-to-azure-active-directory.md)

- [Migrate Okta sync provisioning to Azure AD Connect based synchronization](migrate-okta-sync-provisioning-to-azure-active-directory-connect-based-synchronization)
