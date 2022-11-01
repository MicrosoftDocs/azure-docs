---
title: Configure a Temporary Access Pass in Azure AD to register Passwordless authentication methods
description: Learn how to configure and enable users to register Passwordless authentication methods by using a Temporary Access Pass 

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/08/2022

ms.author: justinha
author: tilarso 
manager: amycolannino
ms.reviewer: tilarso

ms.collection: M365-identity-device-management
---
# Configure Temporary Access Pass in Azure AD to register Passwordless authentication methods

Passwordless authentication methods, such as FIDO2 and Passwordless Phone Sign-in through the Microsoft Authenticator app, enable users to sign in securely without a password. 
Users can bootstrap Passwordless methods in one of two ways:

- Using existing Azure AD Multi-Factor Authentication methods 
- Using a Temporary Access Pass (TAP) 

A Temporary Access Pass is a time-limited passcode that can be configured for multi or single use to allow users to onboard other authentication methods including passwordless methods such as Microsoft Authenticator, FIDO2 or Windows Hello for Business.

A Temporary Access Pass also makes recovery easier when a user has lost or forgotten their strong authentication factor like a FIDO2 security key or Microsoft Authenticator app, but needs to sign in to register new strong authentication methods.

This article shows you how to enable and use a Temporary Access Pass in Azure AD using the Azure portal. 
You can also perform these actions using the REST APIs. 

## Enable the Temporary Access Pass policy

A Temporary Access Pass policy defines settings, such as the lifetime of passes created in the tenant, or the users and groups who can use a Temporary Access Pass to sign-in. 
Before anyone can sign-in with a Temporary Access Pass, you need to enable Temporary Access Pass in the authentication method policy and choose which users and groups can sign in by using a Temporary Access Pass.
Although you can create a Temporary Access Pass for any user, only those included in the policy can sign-in with it.

Global administrator and Authentication Policy administrator role holders can update the Temporary Access Pass authentication method policy.
To configure the Temporary Access Pass authentication method policy:

1. Sign in to the [Azure portal](https://portal.azure.com) using an account with *global administrator* permissions.
1. Search for and select **Azure Active Directory**, then choose **Security** from the menu on the left-hand side.
1. Under the **Manage** menu header, select **Authentication methods** >  **Policies**.
1. From the list of available authentication methods, select **Temporary Access Pass**.

    ![Screenshot of how to manage Temporary Access Pass within the authentication method policy experience.](./media/how-to-authentication-temporary-access-pass/select-temporary-access-pass-policy.png)

1. Set the **Enable** to **Yes** to enable the policy. Then select the **Target** users. 
   
   ![Screenshot of how to enable the Temporary Access Pass authentication method policy.](./media/how-to-authentication-temporary-access-pass/enable-temporary-access-pass.png)

1. (Optional) Select **Configure** and modify the default Temporary Access Pass settings, such as setting maximum lifetime, or length. 
![Screenshot of how to customize the settings for Temporary Access Pass.](./media/how-to-authentication-temporary-access-pass/configure-temporary-access-pass.png)
1. Select **Save** to apply the policy. 



   The default value and the range of allowed values are described in the following table.


   | Setting | Default values | Allowed values | Comments |
   |---|---|---|---|
   | Minimum lifetime | 1 hour | 10 – 43,200 Minutes (30 days) | Minimum number of minutes that the Temporary Access Pass is valid. |
   | Maximum lifetime | 8 hours | 10 – 43,200 Minutes (30 days) | Maximum number of minutes that the Temporary Access Pass is valid. |
   | Default lifetime | 1 hour | 10 – 43,200 Minutes (30 days) | Default values can be overridden by the individual passes, within the minimum and maximum lifetime configured by the policy. |
   | One-time use | False | True / False | When the policy is set to false, passes in the tenant can be used either once or more than once during its validity (maximum lifetime). By enforcing one-time use in the Temporary Access Pass policy, all passes created in the tenant will be created as one-time use. |
   | Length | 8 | 8-48 characters | Defines the length of the passcode. |

## Create a Temporary Access Pass

After you enable a policy, you can create a Temporary Access Pass for a user in Azure AD. 
These roles can perform the following actions related to a Temporary Access Pass.

- Global Administrators can create, delete, and view a Temporary Access Pass on any user (except themselves)
- Privileged Authentication Administrators can create, delete, and view a Temporary Access Pass on admins and members (except themselves)
- Authentication Administrators can create, delete, and view a Temporary Access Pass on members  (except themselves)
- Global Reader can view the Temporary Access Pass details on the user (without reading the code itself).

1. Sign in to the Azure portal as either a Global administrator, Privileged Authentication administrator, or Authentication administrator. 
1. Select **Azure Active Directory**, browse to Users, select a user, such as *Chris Green*, then choose **Authentication methods**.
1. If needed, select the option to **Try the new user authentication methods experience**.
1. Select the option to **Add authentication methods**.
1. Below **Choose method**, select **Temporary Access Pass**.
1. Define a custom activation time or duration and select **Add**.

   ![Screenshot of how to create a Temporary Access Pass.](./media/how-to-authentication-temporary-access-pass/create.png)

1. Once added, the details of the Temporary Access Pass are shown. Make a note of the actual Temporary Access Pass value. You provide this value to the user. You can't view this value after you select **Ok**.
   
   ![Screenshot of Temporary Access Pass details.](./media/how-to-authentication-temporary-access-pass/details.png)

The following commands show how to create and get a Temporary Access Pass by using PowerShell. 

```powershell
# Create a Temporary Access Pass for a user
$properties = @{}
$properties.isUsableOnce = $True
$properties.startDateTime = '2022-05-23 06:00:00'
$propertiesJSON = $properties | ConvertTo-Json

New-MgUserAuthenticationTemporaryAccessPassMethod -UserId user2@contoso.com -BodyParameter $propertiesJSON

Id                                   CreatedDateTime       IsUsable IsUsableOnce LifetimeInMinutes MethodUsabilityReason StartDateTime         TemporaryAccessPass
--                                   ---------------       -------- ------------ ----------------- --------------------- -------------         -------------------
c5dbd20a-8b8f-4791-a23f-488fcbde3b38 5/22/2022 11:19:17 PM False    True         60                NotYetValid           23/05/2022 6:00:00 AM TAPRocks!

# Get a user's Temporary Access Pass
Get-MgUserAuthenticationTemporaryAccessPassMethod -UserId user3@contoso.com

Id                                   CreatedDateTime       IsUsable IsUsableOnce LifetimeInMinutes MethodUsabilityReason StartDateTime         TemporaryAccessPass
--                                   ---------------       -------- ------------ ----------------- --------------------- -------------         -------------------
c5dbd20a-8b8f-4791-a23f-488fcbde3b38 5/22/2022 11:19:17 PM False    True         60                NotYetValid           23/05/2022 6:00:00 AM

```

For more information, see [New-MgUserAuthenticationTemporaryAccessPassMethod](/powershell/module/microsoft.graph.identity.signins/new-mguserauthenticationtemporaryaccesspassmethod) and [Get-MgUserAuthenticationTemporaryAccessPassMethod](/powershell/module/microsoft.graph.identity.signins/get-mguserauthenticationtemporaryaccesspassmethod?view=graph-powershell-beta&preserve-view=true).

## Use a Temporary Access Pass

The most common use for a Temporary Access Pass is for a user to register authentication details during the first sign-in or device setup, without the need to complete extra security prompts. Authentication methods are registered at [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo). Users can also update existing authentication methods here.

1. Open a web browser to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo).
1. Enter the UPN of the account you created the Temporary Access Pass for, such as *tapuser@contoso.com*.
1. If the user is included in the Temporary Access Pass policy, they'll see a screen to enter their Temporary Access Pass.
1. Enter the Temporary Access Pass that was displayed in the Azure portal.

   ![Screenshot of how to enter a Temporary Access Pass.](./media/how-to-authentication-temporary-access-pass/enter.png)

>[!NOTE]
>For federated domains, a Temporary Access Pass is preferred over federation. A user with a Temporary Access Pass will complete the authentication in Azure AD and will not get redirected to the federated Identity Provider (IdP).

The user is now signed in and can update or register a method such as FIDO2 security key. 
Users who update their authentication methods due to losing their credentials or device should make sure they remove the old authentication methods.
Users can also continue to sign-in by using their password; a TAP doesn’t replace a user’s password.


### User management of Temporary Access Pass

Users managing their security information at [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo) will see an entry for the Temporary Access Pass. If a user does not have any other registered methods, they'll be presented a banner at the top of the screen requesting them to add a new sign-in method. Users can additionally view the TAP expiration time, and delete the TAP if no longer needed. 

![Screenshot of how users can manage a Temporary Access Pass in My Security Info.](./media/how-to-authentication-temporary-access-pass/tap-my-security-info.png)

### Windows device setup
Users with a Temporary Access Pass can navigate the setup process on Windows 10 and 11 to perform device join operations and configure Windows Hello For Business. Temporary Access Pass usage for setting up Windows Hello for Business varies based on the devices joined state: 
- During Azure AD Join setup, users can authenticate with a TAP (no password required) and setup Windows Hello for Business.
- On already Azure AD Joined devices, users must first authenticate with another method such as a password, smartcard or FIDO2 key, before using TAP to set up Windows Hello for Business. 
- On Hybrid Azure AD Joined devices, users must first authenticate with another method such as a password, smartcard or FIDO2 key, before using TAP to set up Windows Hello for Business. 

![Screenshot of how to enter Temporary Access Pass when setting up Windows 10.](./media/how-to-authentication-temporary-access-pass/windows-10-tap.png)

### Passwordless phone sign-in

Users can also use their Temporary Access Pass to register for Passwordless phone sign-in directly from the Authenticator app. 
For more information, see [Add your work or school account to the Microsoft Authenticator app](https://support.microsoft.com/account-billing/add-your-work-or-school-account-to-the-microsoft-authenticator-app-43a73ab5-b4e8-446d-9e54-2a4cb8e4e93c).

![Screenshot of how to enter a Temporary Access Pass using work or school account.](./media/how-to-authentication-temporary-access-pass/enter-work-school.png)

### Guest access

Guest users can sign-in to a resource tenant with a Temporary Access Pass that was issued by their home tenant if the Temporary Access Pass meets the home tenant authentication requirement. 
If MFA is required for the resource tenant, the guest user needs to perform MFA in order to gain access to the resource.

### Expiration

An expired or deleted Temporary Access Pass can’t be used for interactive or non-interactive authentication. 
Users need to reauthenticate with different authentication methods after the Temporary Access Pass is expired or deleted. 

## Delete an expired Temporary Access Pass

Under the **Authentication methods** for a user, the **Detail** column shows when the Temporary Access Pass expired. You can delete an expired Temporary Access Pass using the following steps:

1. In the Azure AD portal, browse to **Users**, select a user, such as *Tap User*, then choose **Authentication methods**.
1. On the right-hand side of the **Temporary Access Pass** authentication method shown in the list, select **Delete**.

You can also use PowerShell:

```powershell
# Remove a user's Temporary Access Pass
Remove-MgUserAuthenticationTemporaryAccessPassMethod -UserId user3@contoso.com -TemporaryAccessPassAuthenticationMethodId c5dbd20a-8b8f-4791-a23f-488fcbde3b38
```

For more information, see [Remove-MgUserAuthenticationTemporaryAccessPassMethod](/powershell/module/microsoft.graph.identity.signins/remove-mguserauthenticationtemporaryaccesspassmethod?view=graph-powershell-beta&preserve-view=true).

## Replace a Temporary Access Pass 

- A user can only have one Temporary Access Pass. The passcode can be used during the start and end time of the Temporary Access Pass.
- If the user requires a new Temporary Access Pass:
  - If the existing Temporary Access Pass is valid, the admin can create a new Temporary Access Pass which will override the existing valid Temporary Access Pass.  
  - If the existing Temporary Access Pass has expired, a new Temporary Access Pass will override the existing Temporary Access Pass.

For more information about NIST standards for onboarding and recovery, see [NIST Special Publication 800-63A](https://pages.nist.gov/800-63-3/sp800-63a.html#sec4).

## Limitations

Keep these limitations in mind:

- When using a one-time Temporary Access Pass to register a Passwordless method such as FIDO2 or Phone sign-in, the user must complete the registration within 10 minutes of sign-in with the one-time Temporary Access Pass. This limitation doesn't apply to a Temporary Access Pass that can be used more than once.
- Users in scope for Self Service Password Reset (SSPR) registration policy *or* [Identity Protection Multi-factor authentication registration policy](../identity-protection/howto-identity-protection-configure-mfa-policy.md) will be required to register authentication methods after they've signed in with a Temporary Access Pass. 
Users in scope for these policies will get redirected to the [Interrupt mode of the combined registration](concept-registration-mfa-sspr-combined.md#combined-registration-modes). This experience doesn't currently support FIDO2 and Phone Sign-in registration. 
- A Temporary Access Pass can't be used with the Network Policy Server (NPS) extension and Active Directory Federation Services (AD FS) adapter.
- After a Temporary Access Pass is added to an account or expires, it can take a few minutes for the changes to replicate. Users may still see a prompt for Temporary Access Pass during this time. 

## Troubleshooting    

- If a Temporary Access Pass isn't offered to a user during sign-in, check the following:
  - The user is in scope for the Temporary Access Pass authentication method policy.
  - The user has a valid Temporary Access Pass, and if it's one-time use, it wasn’t used yet.
- If **Temporary Access Pass sign in was blocked due to User Credential Policy** appears during sign-in with a Temporary Access Pass, check the following:
  - The user has a multi-use Temporary Access Pass while the authentication method policy requires a one-time Temporary Access Pass.
  - A one-time Temporary Access Pass was already used.
- If Temporary Access Pass sign-in was blocked due to User Credential Policy, check that the user is in scope for the TAP policy.

## Next steps

- [Plan a passwordless authentication deployment in Azure Active Directory](howto-authentication-passwordless-deployment.md)
