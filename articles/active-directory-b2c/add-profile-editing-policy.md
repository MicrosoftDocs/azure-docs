---

title: Configure a Profile Editing Flow in Azure AD B2C
description: Enable users to update and manage their profile information, such as display name, name, city, and other attributes, using Azure AD B2C profile editing user flows.
author: kengaderdus
ms.service: azure-active-directory
ms.topic: how-to
ms.date: 01/11/2024
ms.subservice: b2c
------------------

# Configure a Profile Editing Flow in Azure AD B2C

> [!IMPORTANT]
> Azure Active Directory B2C is no longer available for purchase by new customers. Existing customers can continue using the service according to Microsoft's support and lifecycle policies.

A profile editing flow allows users to update personal information stored in Azure AD B2C, such as:

* Display name
* First name (Given name)
* Last name (Surname)
* City
* Custom profile attributes

This capability helps users keep their account information accurate without requiring administrator intervention.

## How the Profile Editing Flow Works

When a user starts the profile editing journey:

1. The user signs in using a local account or an external identity provider.
2. Azure AD B2C validates the user's identity.
3. Existing profile information is retrieved from the directory.
4. The user updates editable attributes.
5. Azure AD B2C saves the changes.
6. Updated claims are returned to the application.

### Flow Overview

```text
User
  │
  ▼
Sign In
  │
  ▼
Authenticate User
  │
  ▼
Read Existing Profile
  │
  ▼
Edit Attributes
  │
  ▼
Save Changes
  │
  ▼
Return Updated Token
```

## Prerequisites

Before configuring profile editing, ensure that:

* An Azure AD B2C tenant is available.
* A web or mobile application is registered in Azure AD B2C.
* At least one sign-in method is configured (local or social identity provider).

For application registration guidance, see the Azure AD B2C application registration documentation.

---

# Create a Profile Editing User Flow

1. Sign in to the Azure portal.
2. Open your Azure AD B2C tenant.
3. Select **User flows**.
4. Click **New user flow**.

## Select the Flow Type

1. Choose **Profile editing**.
2. Under **Version**, select **Recommended**.
3. Click **Create**.

## Configure Basic Settings

Enter a unique name for the flow.

Example:

```text
profileediting1
```

Azure AD B2C automatically creates the policy name:

```text
B2C_1_profileediting1
```

## Configure Identity Providers

Select at least one identity provider.

### Local Accounts

Available options include:

* Email sign-in
* User ID sign-in
* Phone sign-in
* Phone or Email sign-in
* User ID or Email sign-in

### Social Identity Providers

You can also allow authentication through providers such as:

* Google
* Facebook
* Microsoft Account
* LinkedIn
* Enterprise identity providers

## Configure Multi-Factor Authentication (Optional)

If additional security is required:

1. Enable Multi-Factor Authentication (MFA).
2. Select the preferred verification method.
3. Define when MFA should be enforced.

Common options include:

* Always require MFA
* Require MFA only under specific conditions

## Configure Conditional Access (Optional)

If Conditional Access policies are configured:

1. Enable **Enforce conditional access policies**.
2. Azure AD B2C automatically evaluates applicable policies during the user journey.

## Select Editable User Attributes

Choose the profile fields users can modify.

Common selections include:

* Display Name
* Given Name
* Surname
* City
* Postal Code
* Country/Region
* Job Title

To view additional attributes:

1. Select **Show more**.
2. Choose the required attributes.
3. Click **OK**.

## Create the User Flow

After configuration is complete:

1. Review the settings.
2. Select **Create**.

The profile editing flow is now available for use by your applications.

---

# Test the Profile Editing Flow

After creating the flow, verify that it works correctly.

## Run the Flow

1. Open the newly created profile editing flow.
2. Select **Run user flow**.
3. Choose the application you registered earlier.

Example:

```text
webapp1
```

4. Verify the Reply URL.

Example:

```text
https://jwt.ms
```

5. Click **Run user flow**.

## Sign In

Authenticate using an existing Azure AD B2C account.

After successful authentication:

* Current profile values are displayed.
* Editable fields can be modified.

Example updates:

* Display Name
* Job Title
* City

Select **Continue** to save changes.

## Verify Results

After completion:

1. Azure AD B2C updates the directory profile.
2. An ID token is issued.
3. The token is returned to the configured application.
4. If using `https://jwt.ms`, the updated claims are displayed for inspection.

---

# Custom Policy Support

Organizations requiring advanced customization can implement profile editing using Azure AD B2C custom policies.

Custom policies provide:

* Fully customized user journeys
* Advanced claim transformations
* Integration with external systems
* Custom validation logic
* Dynamic profile management

Profile editing starter packs are available as part of the Azure AD B2C custom policy framework.

For implementation guidance, see the Azure AD B2C custom policy documentation.

---

# Best Practices

Consider the following recommendations when designing profile editing experiences:

✅ Allow users to update only necessary attributes

✅ Enable MFA for sensitive profile updates

✅ Use Conditional Access for additional protection

✅ Validate user input before saving

✅ Keep the profile editing experience simple and focused

✅ Test with both local and social identities

---

# Troubleshooting

## Profile Editing Page Does Not Appear

Verify that:

* The user flow type is **Profile editing**
* The application is correctly registered
* The redirect URI is configured correctly

## Updated Values Are Not Returned

Check that:

* The attribute is selected in the user flow
* The claim is included in the application token configuration

## Social Account Users Cannot Edit Profiles

Confirm that:

* The external identity provider is configured correctly
* Required profile attributes exist in Azure AD B2C

---

# Next Steps

* Configure social identity providers.
* Enable Multi-Factor Authentication.
* Configure Conditional Access policies.
* Implement custom policies for advanced profile management.
* Integrate the profile editing flow into your application sign-in experience.
