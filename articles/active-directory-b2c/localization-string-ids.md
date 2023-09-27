---
title: Localization string IDs - Azure Active Directory B2C
description: Specify the IDs for a content definition with an ID of api.signuporsignin in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 04/19/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Localization string IDs

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **Localization** element enables you to support multiple locales or languages in the policy for the user journeys. This article provides the list of localization IDs that you can use in your policy. For more information about UI localization, see [Localization](localization.md).

## Sign-up or sign-in page elements

The following IDs are used for a content definition with an ID of `api.signuporsignin`, and [self-asserted technical profile](self-asserted-technical-profile.md).

| ID | Default value | Page Layout Version |
| --- | ------------- | ------ |
| `forgotpassword_link` | Forgot your password? | `All` |
| `createaccount_intro` | Don't have an account? | `All` |
| `button_signin` | Sign in | `All` |
| `social_intro` | Sign in with your social account | `All` |
| `remember_me` |Keep me signed in. | `All` |
| `unknown_error` | We are having trouble signing you in. Please try again later. | `All` |
| `divider_title` | OR | `All` |
| `local_intro_email` | Sign in with your existing account | `< 2.0.0` |
| `logonIdentifier_email` | Email Address | `< 2.0.0` |
| `requiredField_email` | Please enter your email | `< 2.0.0` |
| `invalid_email` | Please enter a valid email address | `< 2.0.0` |
| `email_pattern` | ```^[a-zA-Z0-9.!#$%&'*+\/=?^_`\{\|\}~\-]+@[a-zA-Z0-9\-]+(?:\\.[a-zA-Z0-9\-]+)\*$``` | `< 2.0.0` |
| `local_intro_username` | Sign in with your user name | `< 2.0.0` |
| `logonIdentifier_username` | Username | `< 2.0.0` |
| `requiredField_username` | Please enter your user name | `< 2.0.0` |
| `password` | Password | `< 2.0.0` |
| `requiredField_password` | Please enter your password | `< 2.0.0` |
| `createaccount_link` | Sign up now | `< 2.0.0` |
| `cancel_message` | The user has forgotten their password | `< 2.0.0` |
| `invalid_password` | The password you entered is not in the expected format. | `< 2.0.0` |
| `createaccount_one_link` | Sign up now | `>= 2.0.0` |
| `createaccount_two_links` | Sign up with {0} or {1} | `>= 2.0.0` |
| `createaccount_three_links` | Sign up with {0}, {1}, or {2} | `>= 2.0.0` |
| `local_intro_generic` | Sign in with your {0} | `>= 2.1.0` |
| `requiredField_generic` | Please enter your {0} | `>= 2.1.0` |
| `invalid_generic` | Please enter a valid {0} | `>= 2.1.1` |
| `heading` | Sign in | `>= 2.1.1` |

> [!NOTE]
> * Placeholders like `{0}` are populated automatically with the `DisplayName` value of `ClaimType`.
> * To learn how to localize `ClaimType`, see [Sign-up or sign-in example](#signupsigninexample).

The following example shows the use of some user interface elements in the sign-up or sign-in page:

:::image type="content" source="./media/localization-string-ids/localization-susi-2.png" alt-text="Screenshot that shows sign-up or sign-in page U X elements.":::

### Sign-up or sign-in identity providers

The ID of the identity providers is configured in the user journey **ClaimsExchange** element. To localize the title of the identity provider, the **ElementType** is set to `ClaimsProvider`, while the **StringId** is set to the ID of the `ClaimsExchange`.

```xml
<OrchestrationStep Order="2" Type="ClaimsExchange">
  <Preconditions>
    <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
      <Value>objectId</Value>
      <Action>SkipThisOrchestrationStep</Action>
    </Precondition>
  </Preconditions>
  <ClaimsExchanges>
    <ClaimsExchange Id="FacebookExchange" TechnicalProfileReferenceId="Facebook-OAUTH" />
    <ClaimsExchange Id="MicrosoftExchange" TechnicalProfileReferenceId="MSA-OIDC" />
    <ClaimsExchange Id="GoogleExchange" TechnicalProfileReferenceId="Google-OAUTH" />
    <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccount" />
  </ClaimsExchanges>
</OrchestrationStep>
```

The following example localizes the Facebook identity provider to Arabic:

```xml
<LocalizedString ElementType="ClaimsProvider" StringId="FacebookExchange">فيس بوك</LocalizedString>
```

### Sign-up or sign-in error messages

| ID | Default value |
| --- | ------------- |
| `UserMessageIfInvalidPassword` | Your password is incorrect. |
| `UserMessageIfPasswordExpired`| Your password has expired.|
| `UserMessageIfClaimsPrincipalDoesNotExist` | We can't seem to find your account. |
| `UserMessageIfOldPasswordUsed` | Looks like you used an old password. |
| `DefaultMessage` | Invalid username or password. |
| `UserMessageIfUserAccountDisabled` | Your account has been locked. Contact your support person to unlock it, then try again. |
| `UserMessageIfUserAccountLocked` | Your account is temporarily locked to prevent unauthorized use. Try again later. |
| `AADRequestsThrottled` | There are too many requests at this moment. Please wait for some time and try again. |

<a name="signupsigninexample"></a>

### Sign-up or sign-in example

```xml
<LocalizedResources Id="api.signuporsignin.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Email Address</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="heading">Sign in</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="social_intro">Sign in with your social account</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="local_intro_generic">Sign in with your {0}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_password">Please enter your password</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_generic">Please enter your {0}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="invalid_generic">Please enter a valid {0}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="createaccount_one_link">Sign up now</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="createaccount_two_links">Sign up with {0} or {1}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="createaccount_three_links">Sign up with {0}, {1}, or {2}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="forgotpassword_link">Forgot your password?</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_signin">Sign in</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="divider_title">OR</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="unknown_error">We are having trouble signing you in. Please try again later.</LocalizedString>
    <!-- Uncomment the remember_me only if the keep me signed in is activated. 
    <LocalizedString ElementType="UxElement" StringId="remember_me">Keep me signed in</LocalizedString> -->
    <LocalizedString ElementType="ClaimsProvider" StringId="FacebookExchange">Facebook</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidPassword">Your password is incorrect.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfPasswordExpired">Your password has expired.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalDoesNotExist">We can't seem to find your account.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfOldPasswordUsed">Looks like you used an old password.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="DefaultMessage">Invalid username or password.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountDisabled">Your account has been locked. Contact your support person to unlock it, then try again.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfUserAccountLocked">Your account is temporarily locked to prevent unauthorized use. Try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="AADRequestsThrottled">There are too many requests at this moment. Please wait for some time and try again.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## Sign-up and self-asserted pages user interface elements

The following IDs are used for a content definition having an ID of `api.localaccountsignup` or any content definition that starts with `api.selfasserted`, such as `api.selfasserted.profileupdate` and `api.localaccountpasswordreset`, and [self-asserted technical profile](self-asserted-technical-profile.md).

| ID | Default value |
| --- | ------------- |
| `ver_sent` | Verification code has been sent to: |
| `ver_but_default` | Default |
| `cancel_message` | The user has canceled entering self-asserted information |
| `preloader_alt` | Please wait |
| `ver_but_send` | Send verification code |
| `alert_yes` | Yes |
| `error_fieldIncorrect` | One or more fields are filled out incorrectly. Please check your entries and try again. |
| `year` | Year |
| `verifying_blurb` | Please wait while we process your information. |
| `button_cancel` | Cancel |
| `ver_fail_no_retry` | You've made too many incorrect attempts. Please try again later. |
| `month` | Month |
| `ver_success_msg` | E-mail address verified. You can now continue. |
| `months` | January, February, March, April, May, June, July, August, September, October, November, December |
| `ver_fail_server` | We are having trouble verifying your email address. Please enter a valid email address and try again. |
| `error_requiredFieldMissing` | A required field is missing. Please fill out all required fields and try again. |
| `heading` | User Details |
| `initial_intro` | Please provide the following details. |
| `ver_but_resend` | Send new code |
| `button_continue` | Create |
| `error_passwordEntryMismatch` | The password entry fields do not match. Please enter the same password in both fields and try again. |
| `ver_incorrect_format` | Incorrect format. |
| `ver_but_edit` | Change e-mail |
| `ver_but_verify` | Verify code |
| `alert_no` | No |
| `ver_info_msg` | Verification code has been sent to your inbox. Please copy it to the input box below. |
| `day` | Day |
| `ver_fail_throttled` | There have been too many requests to verify this email address. Please wait a while, then try again. |
| `helplink_text` | What is this? |
| `ver_fail_retry` | That code is incorrect. Please try again. |
| `alert_title` | Cancel Entering Your Details |
| `required_field` | This information is required. |
| `alert_message` | Are you sure that you want to cancel entering your details? |
| `ver_intro_msg` | Verification is necessary. Please click Send button. |
| `ver_input` | Verification code |
| `required_field_descriptive` | {0} is required |

### Sign-up and self-asserted pages disclaimer links

The following `UxElement` string IDs will display disclaimer link(s) at the bottom of the self-asserted page. These links are not displayed by default unless specified in the localized strings.

| ID | Example value |
| --- | ------------- |
| `disclaimer_msg_intro` | By providing your phone number, you consent to receiving a one-time passcode sent by text message to help you sign into {insert your application name}. Standard message and data rates may apply. |
| `disclaimer_link_1_text` | Privacy Statement |
| `disclaimer_link_1_url` | {insert your privacy statement URL} |
| `disclaimer_link_2_text` | Terms and Conditions |
| `disclaimer_link_2_url` | {insert your terms and conditions URL} |

### Sign-up and self-asserted pages error messages

| ID | Default value |
| --- | ------------- |
| `UserMessageIfClaimsPrincipalAlreadyExists` | A user with the specified ID already exists. Please choose a different one. |
| `UserMessageIfClaimNotVerified` | Claim not verified: {0} |
| `UserMessageIfIncorrectPattern` | Incorrect pattern for: {0} |
| `UserMessageIfMissingRequiredElement` | Missing required element: {0} |
| `UserMessageIfValidationError` | Error in validation by: {0} |
| `UserMessageIfInvalidInput` | {0} has invalid input. |
| `ServiceThrottled` | There are too many requests at this moment. Please wait for some time and try again. |

The following example shows the use of some of the user interface elements in the sign-up page:

![Sign-up page with its UI element names labeled](./media/localization-string-ids/localization-sign-up.png)

The following example shows the use of some of the user interface elements in the sign-up page, after user clicks on send verification code button:

![Sign-up page email verification UX elements](./media/localization-string-ids/localization-email-verification.png)

## Sign-up and self-asserted pages example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="DisplayName">Email Address</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="UserHelpText">Email address that can be used to contact you.</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="email" StringId="PatternHelpText">Please enter a valid email address.</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="DisplayName">New Password</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="UserHelpText">Enter new password</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="newPassword" StringId="PatternHelpText">8-16 characters, containing 3 out of 4 of the following: Lowercase characters, uppercase characters, digits (0-9), and one or more of the following symbols: @ # $ % ^ &amp; * - _ + = [ ] { } | \ : ' , ? / ` ~ " ( ) ; .</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="DisplayName">Confirm New Password</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="UserHelpText">Confirm new password</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="reenterPassword" StringId="PatternHelpText">#8-16 characters, containing 3 out of 4 of the following: Lowercase characters, uppercase characters, digits (0-9), and one or more of the following symbols: @ # $ % ^ &amp; * - _ + = [ ] { } | \ : ' , ? / ` ~ " ( ) ; .</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="displayName" StringId="DisplayName">Display Name</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="displayName" StringId="UserHelpText">Your display name.</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="DisplayName">Surname</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="surname" StringId="UserHelpText">Your surname (also known as family name or last name).</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="givenName" StringId="DisplayName">Given Name</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="givenName" StringId="UserHelpText">Your given name (also known as first name).</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_continue">Create</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_fieldIncorrect">One or more fields are filled out incorrectly. Please check your entries and try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_passwordEntryMismatch">The password entry fields do not match. Please enter the same password in both fields and try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_requiredFieldMissing">A required field is missing. Please fill out all required fields and try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="helplink_text">What is this?</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="heading">User Details</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="initial_intro">Please provide the following details.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="preloader_alt">Please wait</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="required_field">This information is required.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="required_field_descriptive">{0} is required</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_but_edit">Change e-mail</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_but_resend">Send new code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_but_send">Send verification code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_but_verify">Verify code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_fail_code_expired">That code is expired. Please request a new code.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_fail_no_retry">You've made too many incorrect attempts. Please try again later.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_fail_retry">That code is incorrect. Please try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_fail_server">We are having trouble verifying your email address. Please enter a valid email address and try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_fail_throttled">There have been too many requests to verify this email address. Please wait a while, then try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_info_msg">Verification code has been sent to your inbox. Please copy it to the input box below.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_input">Verification code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_intro_msg">Verification is necessary. Please click Send button.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="ver_success_msg">E-mail address verified. You can now continue.</LocalizedString>
    <!-- The following elements will display a message and two links at the bottom of the page. 
         For policies that you intend to show to users in the United States, we suggest displaying the following text. Replace the content of the disclaimer_link_X_url elements with links to your organization's privacy statement and terms and conditions. 
          Uncomment any of these lines to display them.  -->
    <!-- <LocalizedString ElementType="UxElement" StringId="disclaimer_msg_intro">By providing your phone number, you consent to receiving a one-time passcode sent by text message to help you sign into {insert your application name}. Standard message and data rates may apply.</LocalizedString> -->
    <!-- <LocalizedString ElementType="UxElement" StringId="disclaimer_link_1_text">Privacy Statement</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="disclaimer_link_1_url">{insert your privacy statement URL}</LocalizedString> -->
    <!-- <LocalizedString ElementType="UxElement" StringId="disclaimer_link_2_text">Terms and Conditions</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="disclaimer_link_2_url">{insert your terms and conditions URL}</LocalizedString> -->
    <LocalizedString ElementType="ErrorMessage" StringId="ServiceThrottled">There are too many requests at this moment. Please wait for some time and try again.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimNotVerified">Claim not verified: {0}</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsPrincipalAlreadyExists">A user with the specified ID already exists. Please choose a different one.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfIncorrectPattern">Incorrect pattern for: {0}</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidInput">{0} has invalid input.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfMissingRequiredElement">Missing required element: {0}</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfValidationError">Error in validation by: {0}</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## Phone factor authentication page user interface elements

The Following are the IDs for a content definition with an ID of `api.phonefactor`, and [phone factor technical profile](phone-factor-technical-profile.md).

| ID | Default value | Page Layout Version |
| --- | ------------- | ------ |
| `button_verify` | Call Me | `All` |
| `country_code_label` | Country Code | `All` |
| `cancel_message` | The user has canceled multifactor authentication | `All` |
| `text_button_send_second_code` | send a new code | `All` |
| `code_pattern` | \\d{6} | `All` |
| `intro_mixed` | We have the following number on record for you. We can send a code via SMS or phone to authenticate you. | `All` |
| `intro_mixed_p` | We have the following numbers on record for you. Choose a number that we can phone or send a code via SMS to authenticate you. | `All` |
| `button_verify_code` | Verify Code | `All` |
| `requiredField_code` | Please enter the verification code you received | `All` |
| `invalid_code` | Please enter the 6-digit code you received | `All` |
| `button_cancel` | Cancel | `All` |
| `local_number_input_placeholder_text` | Phone number | `All` |
| `button_retry` | Retry | `All` |
| `alternative_text` | I don't have my phone | `All` |
| `intro_phone_p` | We have the following numbers on record for you. Choose a number that we can phone to authenticate you. | `All` |
| `intro_phone` | We have the following number on record for you. We will phone to authenticate you. | `All` |
| `enter_code_text_intro` | Enter your verification code below, or  | `All` |
| `intro_entry_phone` | Enter a number below that we can phone to authenticate you. | `All` |
| `intro_entry_sms` | Enter a number below that we can send a code via SMS to authenticate you. | `All` |
| `button_send_code` | Send Code | `All` |
| `invalid_number` | Please enter a valid phone number | `All` |
| `intro_sms` | We have the following number on record for you. We will send a code via SMS to authenticate you. | `All` |
| `intro_entry_mixed` | Enter a number below that we can send a code via SMS or phone to authenticate you. | `All` |
| `number_pattern` | `^\\+(?:[0-9][\\x20-]?){6,14}[0-9]$` | `All` |
| `intro_sms_p` |We have the following numbers on record for you. Choose a number that we can send a code via SMS to authenticate you. | `All` |
| `requiredField_countryCode` | Please select your country code | `All` |
| `requiredField_number` | Please enter your phone number | `All` |
| `country_code_input_placeholder_text` |Country or region | `All` |
| `number_label` | Phone Number | `All` |
| `error_tryagain` | The phone number you provided is busy or unavailable. Please check the number and try again. | `All` |
| `error_sms_throttled` | You hit the limit on the number of text messages. Try again shortly. | `>= 1.2.3` |
| `error_phone_throttled` | You hit the limit on the number of call attempts. Try again shortly. | `>= 1.2.3` |
| `error_throttled` | You hit the limit on the number of verification attempts. Try again shortly. | `>= 1.2.3` |
| `error_incorrect_code` | The verification code you have entered does not match our records. Please try again, or request a new code. | `All` |
| `countryList` | See [the countries list](#phone-factor-authentication-page-example). | `All` |
| `error_448` | The phone number you provided is unreachable. | `All` |
| `error_449` | User has exceeded the number of retry attempts. | `All` |
| `verification_code_input_placeholder_text` | Verification code | `All` |

The following example shows the use of some of the user interface elements in the MFA enrollment page:

![Phone factor authentication enrollment UX elements](./media/localization-string-ids/localization-mfa1.png)

The following example shows the use of some of the user interface elements in the MFA validation page:

![Phone factor authentication validation UX elements](./media/localization-string-ids/localization-mfa2.png)

## Phone factor authentication page example

```xml
<LocalizedResources Id="api.phonefactor.en">
  <LocalizedStrings>
    <LocalizedString ElementType="UxElement" StringId="button_verify">Call Me</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="country_code_label">Country Code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="cancel_message">The user has canceled multi-factor authentication</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="text_button_send_second_code">Send a new code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="code_pattern">\d{6}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_mixed">We have the following number on record for you. We can send a code via SMS or phone to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_mixed_p">We have the following numbers on record for you. Choose a number that we can phone or send a code via SMS to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_verify_code">Verify Code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_code">Please enter the verification code you received</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="invalid_code">Please enter the 6-digit code you received</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_cancel">Cancel</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="local_number_input_placeholder_text">Phone number</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_retry">Retry</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="alternative_text">I don't have my phone</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_phone_p">We have the following numbers on record for you. Choose a number that we can phone to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_phone">We have the following number on record for you. We will phone to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="enter_code_text_intro">Enter your verification code below, or</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_entry_phone">Enter a number below that we can phone to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_entry_sms">Enter a number below that we can send a code via SMS to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="button_send_code">Send Code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="invalid_number">Please enter a valid phone number</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_sms">We have the following number on record for you. We will send a code via SMS to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_entry_mixed">Enter a number below that we can send a code via SMS or phone to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="number_pattern">^\+(?:[0-9][\x20-]?){6,14}[0-9]$</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="intro_sms_p">We have the following numbers on record for you. Choose a number that we can send a code via SMS to authenticate you.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_countryCode">Please select your country code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="requiredField_number">Please enter your phone number</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="country_code_input_placeholder_text">Country or region</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="number_label">Phone Number</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_tryagain">The phone number you provided is busy or unavailable. Please check the number and try again.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_sms_throttled">You hit the limit on the number of text messages. Try again shortly.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_phone_throttled">You hit the limit on the number of call attempts. Try again shortly.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_throttled">You hit the limit on the number of verification attempts. Try again shortly.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_incorrect_code">The verification code you have entered does not match our records. Please try again, or request a new code.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="countryList">{"DEFAULT":"Country/Region","AF":"Afghanistan","AX":"Åland Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua and Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BQ":"Bonaire","BA":"Bosnia and Herzegovina","BW":"Botswana","BV":"Bouvet Island","BR":"Brazil","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","CV":"Cabo Verde","KH":"Cambodia","CM":"Cameroon","CA":"Canada","KY":"Cayman Islands","CF":"Central African Republic","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo","CD":"Congo (DRC)","CK":"Cook Islands","CR":"Costa Rica","CI":"Côte d'Ivoire","HR":"Croatia","CU":"Cuba","CW":"Curaçao","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard Island and McDonald Islands","HN":"Honduras","HK":"Hong Kong SAR","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KR":"Korea","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macao SAR","MK":"North Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","KP":"North Korea","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestinian Authority","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Réunion","RO":"Romania","RU":"Russia","RW":"Rwanda","BL":"Saint Barthélemy","KN":"Saint Kitts and Nevis","LC":"Saint Lucia","MF":"Saint Martin","PM":"Saint Pierre and Miquelon","VC":"Saint Vincent and the Grenadines","WS":"Samoa","SM":"San Marino","ST":"São Tomé and Príncipe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia and South Sandwich Islands","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","SH":"St Helena, Ascension, Tristan da Cunha","SD":"Sudan","SR":"Suriname","SJ":"Svalbard","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad and Tobago","TN":"Tunisia","TR":"Türkiye","TM":"Turkmenistan","TC":"Turks and Caicos Islands","TV":"Tuvalu","UM":"U.S. Outlying Islands","VI":"U.S. Virgin Islands","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","WF":"Wallis and Futuna","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"}</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_448">The phone number you provided is unreachable.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="error_449">User has exceeded the number of retry attempts.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_code_input_placeholder_text">Verification code</LocalizedString>
    <LocalizedString ElementType="ClaimType" ElementId="strongAuthenticationPhoneNumber" StringId="DisplayName">Phone Number</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>

```

## Verification display control user interface elements

The following IDs are used for a [Verification display control](display-control-verification.md) with [page layout version](page-layout.md) 2.1.0 or higher.

| ID | Default value |
| --- | ------------- |
| `intro_msg` <sup>1</sup>| Verification is necessary. Please click Send button.|
| `success_send_code_msg` | Verification code has been sent. Please copy it to the input box below.|
| `failure_send_code_msg` | We are having trouble verifying your email address. Please enter a valid email address and try again.|
| `success_verify_code_msg` | E-mail address verified. You can now continue.|
| `failure_verify_code_msg` | We are having trouble verifying your email address. Please try again.|
| `but_send_code` | Send verification code|
| `but_verify_code` | Verify code|
| `but_send_new_code` | Send new code|
| `but_change_claims` | Change e-mail|
| `UserMessageIfVerificationControlClaimsNotVerified` <sup>2</sup> | The claims for verification control have not been verified. |

<sup>1</sup> The `intro_msg` element is hidden, and not shown on the self-asserted page. To make it visible, use the [HTML customization](customize-ui-with-html.md) with Cascading Style Sheets. For example:

`.verificationInfoText div{display: block!important}`

<sup>2</sup> This error message is displayed to the user if they enter a verification code, but instead of completing the verification by selecting on the **Verify** button, they select the **Continue** button.

### Verification display control example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
   <!-- Display control UI elements-->
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="intro_msg">Verification is necessary. Please click Send button.</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="success_send_code_msg">Verification code has been sent to your inbox. Please copy it to the input box below.</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="failure_send_code_msg">We are having trouble verifying your email address. Please enter a valid email address and try again.</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="success_verify_code_msg">E-mail address verified. You can now continue.</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="failure_verify_code_msg">We are having trouble verifying your email address. Please try again.</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="but_send_code">Send verification code</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="but_verify_code">Verify code</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="but_send_new_code">Send new code</LocalizedString>
    <LocalizedString ElementType="DisplayControl" ElementId="emailVerificationControl" StringId="but_change_claims">Change e-mail</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfVerificationControlClaimsNotVerified">The claims for verification control have not been verified.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## Verification display control user interface elements (deprecated)

The following IDs are used for a [Verification display control](display-control-verification.md) with [page layout version](page-layout.md) 2.0.0.

| ID | Default value |
| --- | ------------- |
| `verification_control_but_change_claims` |Change |
| `verification_control_fail_send_code` |Failed to send the code, please try again later. |
| `verification_control_fail_verify_code` |Failed to verify the code, please try again later. |
| `verification_control_but_send_code` |Send Code |
| `verification_control_but_send_new_code` |Send New Code |
| `verification_control_but_verify_code` |Verify Code |
| `verification_control_code_sent`| Verification code has been sent. Please copy it to the input box below. |

### Verification display control example (deprecated)

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="UxElement" StringId="verification_control_but_change_claims">Change</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_control_fail_send_code">Failed to send the code, please try again later.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_control_fail_verify_code">Failed to verify the code, please try again later.</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_control_but_send_code">Send Code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_control_but_send_new_code">Send New Code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_control_but_verify_code">Verify Code</LocalizedString>
    <LocalizedString ElementType="UxElement" StringId="verification_control_code_sent">Verification code has been sent. Please copy it to the input box below.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## TOTP MFA controls display control user interface elements

The following IDs are used for a [time-based one-time password (TOTP) display control](display-control-time-based-one-time-password.md) with [page layout version](page-layout.md) 2.1.9 and later. 

| ID | Default value |
| --- | ------------- |
| `title_text` |Download the Microsoft Authenticator using the download links for iOS and Android or use any other authenticator app of your choice. |
| `DN` |Once you've downloaded the Authenticator app, you can use any of the methods below to continue with enrollment. |
| `DisplayName` |Once you've downloaded the Authenticator app, you can use any of the methods below to continue with enrollment. |
| `title_text` |Scan the QR code |
| `info_msg` |You can download the Microsoft Authenticator app or use any other authenticator app of your choice. |
| `link_text` |Can't scan? Try this |
| `title_text`| Enter the account details manually. |
| `account_name` | Account Name: |
| `display_prefix` | Secret |
| `collapse_text` | Still having trouble? |
| `DisplayName` | Enter the verification code from your authenticator app​.|
| `DisplayName` | Enter your code. |
| `button_continue` | Verify |

### TOTP MFA controls display control example

```xml
      <LocalizedResources Id="api.selfasserted.totp.en">
        <LocalizedStrings>
          <LocalizedString ElementType="DisplayControl" ElementId="authenticatorAppIconControl" StringId="title_text">Download the Microsoft Authenticator using the download links for iOS and Android or use any other authenticator app of your choice.</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="authenticatorAppIconControl" StringId="DN">Once you&#39;ve downloaded the Authenticator app, you can use any of the methods below to continue with enrollment.</LocalizedString>
          <LocalizedString ElementType="ClaimType" ElementId="QrCodeScanInstruction" StringId="DisplayName">Once you've downloaded the Authenticator app, you can use any of the methods below to continue with enrollment.</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="totpQrCodeControl" StringId="title_text">Scan the QR code</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="totpQrCodeControl" StringId="info_msg">You can download the Microsoft Authenticator app or use any other authenticator app of your choice.</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="totpQrCodeControl" StringId="link_text">Can&#39;t scan? Try this</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="authenticatorInfoControl" StringId="title_text">Enter the account details manually</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="authenticatorInfoControl" StringId="account_name">Account Name:</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="authenticatorInfoControl" StringId="display_prefix">Secret</LocalizedString>
          <LocalizedString ElementType="DisplayControl" ElementId="authenticatorInfoControl" StringId="collapse_text">Still having trouble?</LocalizedString>
          <LocalizedString ElementType="ClaimType" ElementId="QrCodeVerifyInstruction" StringId="DisplayName">Enter the verification code from your authenticator app​.</LocalizedString>
          <LocalizedString ElementType="ClaimType" ElementId="otpCode" StringId="DisplayName">Enter your code.</LocalizedString>
          <LocalizedString ElementType="UxElement" StringId="button_continue">Verify</LocalizedString>
        </LocalizedStrings>
      </LocalizedResources>
```

## Restful service error messages

The following IDs are used for [Restful service technical profile](restful-technical-profile.md) error messages:

| ID | Default value |
| --- | ------------- |
| `DefaultUserMessageIfRequestFailed` | Failed to establish connection to restful service end point. Restful service URL: {0} |
| `UserMessageIfCircuitOpen` | {0} Restful Service URL: {1} |
| `UserMessageIfDnsResolutionFailed` | Failed to resolve the hostname of the restful service endpoint. Restful service URL: {0} |
| `UserMessageIfRequestTimeout` | Failed to establish connection to restful service end point within timeout limit {0} seconds. Restful service URL: {1} |

### Restful service example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ErrorMessage" StringId="DefaultUserMessageIfRequestFailed">Failed to establish connection to restful service end point.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfCircuitOpen">Unable to connect to the restful service end point.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfDnsResolutionFailed">Failed to resolve the hostname of the restful service endpoint.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfRequestTimeout">Failed to establish connection to restful service end point within timeout limit.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

<a name='azure-ad-mfa-error-messages'></a>

## Microsoft Entra multifactor authentication error messages

The following IDs are used for an [Microsoft Entra multifactor authentication technical profile](multi-factor-auth-technical-profile.md) error message:

| ID | Default value |
| --- | ------------- |
| `UserMessageIfCouldntSendSms` | Cannot Send SMS to the phone, please try another phone number. |
| `UserMessageIfInvalidFormat` | Your phone number is not in a valid format, please correct it and try again.|
| `UserMessageIfMaxAllowedCodeRetryReached` | Wrong code entered too many times, please try again later.|
| `UserMessageIfServerError` | Cannot use MFA service, please try again later.|
| `UserMessageIfThrottled` | Your request has been throttled, please try again later.|
| `UserMessageIfWrongCodeEntered` |Wrong code entered, please try again.|

<a name='azure-ad-mfa-example'></a>

### Microsoft Entra multifactor authentication example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfCouldntSendSms">Cannot Send SMS to the phone, please try another phone number.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidFormat">Your phone number is not in a valid format, please correct it and try again.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfMaxAllowedCodeRetryReached">Wrong code entered too many times, please try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfServerError">Cannot use MFA service, please try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfThrottled">Your request has been throttled, please try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfWrongCodeEntered">Wrong code entered, please try again.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

<a name='azure-ad-sspr'></a>

## Microsoft Entra SSPR

The following IDs are used for [Microsoft Entra SSPR technical profile](aad-sspr-technical-profile.md) error messages:

| ID | Default value |
| --- | ------------- |
|`UserMessageIfChallengeExpired` | The code has expired.|
|`UserMessageIfInternalError` | The email service has encountered an internal error, please try again later.|
|`UserMessageIfThrottled` | You have sent too many requests, please try again later.|
|`UserMessageIfVerificationFailedNoRetry` | You have exceeded maximum number of verification attempts.|
|`UserMessageIfVerificationFailedRetryAllowed` | The verification has failed, please try again.|

<a name='azure-ad-sspr-example'></a>

### Microsoft Entra SSPR example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInternalError">We are having trouble verifying your email address. Please try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfThrottled">There have been too many requests to verify this email address. Please wait a while, then try again.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfChallengeExpired">That code is expired. Please request a new code.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfVerificationFailedNoRetry">You've made too many incorrect attempts. Please try again later.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfVerificationFailedRetryAllowed">That code is incorrect. Please try again.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## One-time password error messages

The following IDs are used for a [one-time password technical profile](one-time-password-technical-profile.md) error messages

| ID | Default value | Description |
| --- | ------------- | ----------- |
| `UserMessageIfSessionDoesNotExist` | No | The message to display to the user if the code verification session has expired. It is either the code has expired or the code has never been generated for a given identifier. |
| `UserMessageIfMaxRetryAttempted` | No | The message to display to the user if they've exceeded the maximum allowed verification attempts. |
| `UserMessageIfMaxNumberOfCodeGenerated` | No | The message to display to the user if the code generation has exceeded the maximum allowed number of attempts. |
| `UserMessageIfInvalidCode` | No | The message to display to the user if they've provided an invalid code. |
| `UserMessageIfVerificationFailedRetryAllowed` | No | The message to display to the user if they've provided an invalid code, and user is allowed to provide the correct code.  |
| `UserMessageIfSessionConflict` | No | The message to display to the user if the code cannot be verified.|

### One time password example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfSessionDoesNotExist">You have exceeded the maximum time allowed.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfMaxRetryAttempted">You have exceeded the number of retries allowed.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfMaxNumberOfCodeGenerated">You have exceeded the number of code generation attempts allowed.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfInvalidCode">You have entered the wrong code.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfVerificationFailedRetryAllowed">That code is incorrect. Please try again.</LocalizedString>
   <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfSessionConflict">Cannot verify the code, please try again later.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## Claims transformations error messages

The following IDs are used for claims transformations error messages:

| ID | Claims transformation | Default value |
| --- | ------------- |------------- |
| `UserMessageIfClaimsTransformationBooleanValueIsNotEqual` |[AssertBooleanClaimIsEqualToValue](boolean-transformations.md#assertbooleanclaimisequaltovalue) | Boolean claim value comparison failed for claim type "inputClaim".|
| `DateTimeGreaterThan` |[AssertDateTimeIsGreaterThan](date-transformations.md#assertdatetimeisgreaterthan) | Claim value comparison failed: The provided left operand is greater than the right operand.|
| `UserMessageIfClaimsTransformationStringsAreNotEqual` |[AssertStringClaimsAreEqual](string-transformations.md#assertstringclaimsareequal) | Claim value comparison failed using StringComparison "OrdinalIgnoreCase".|

### Claims transformations example

```xml
<LocalizedResources Id="api.localaccountsignup.en">
  <LocalizedStrings>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsTransformationBooleanValueIsNotEqual">Your email address hasn't been verified.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="DateTimeGreaterThan">Expiration date must be greater that the current date.</LocalizedString>
    <LocalizedString ElementType="ErrorMessage" StringId="UserMessageIfClaimsTransformationStringsAreNotEqual">The email entry fields do not match. Please enter the same email address in both fields and try again.</LocalizedString>
  </LocalizedStrings>
</LocalizedResources>
```

## Next steps

See the following articles for localization examples:

- [Language customization with custom policy in Azure Active Directory B2C](language-customization.md)
- [Language customization with user flows in Azure Active Directory B2C](language-customization.md)
