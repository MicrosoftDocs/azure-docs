---
title: Manage user access in Azure Active Directory B2C | Microsoft Docs
description: Learn how to identify minors, collect date of birth and country data, and get acceptance of terms of use in your application using Azure AD B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 05/04/2018
ms.author: davidmu
ms.component: B2C
---

# Manage user access in Azure AD B2C

This article provides information about how you can manage user access to your applications using Azure Active Directory (AD) B2C. Access management in your application includes:

- Identifying minors and controlling access to use your application
- Requiring parental consent for minors to use your applications
- Gathering data of birth and country data from the user
- Capturing terms of use agreement and gating access

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

>[!Note] 
>This article provides information that can be used to support your obligations under the GDPR. If you’re looking for general info about GDPR, see the [GDPR section of the Service Trust portal](https://servicetrust.microsoft.com/ViewPage/GDPRGetStarted).

## Control minor access

Applications and organizations may decide to block minors from using applications and services that are not targeted to this audience. Alternatively, applications and organizations may decide to accept minors and subsequently manage the parental consent, and deliver permissible experiences for minors as dictated by business rules and allowed by regulation. 

If a user is identified as a minor, then the user flow in Azure AD B2C may be set to one of three options:

- **Send a signed JWT id_token back to the application** - The user is registered in the directory and a token is returned to the application. The application then proceeds using business rules. For example, the application may proceed with a parental consent process. To do this, you choose to receive the **ageGroup** and **consentProvidedForMinor** claims from the application.
- **Send an unsigned JSON token to the application** - Azure AD B2C notifies the application that the user is a minor and provides the status of the user’s parental consent. The application then proceeds using business rules. A JSON token does not complete a successful authentication with the application. The application must process the unauthenticated user according to the claims included in the JSON token, which may include **name**, **email**, **ageGroup**, and **consentProvidedForMinor**.
- **Block the user** - If the user is a minor, and parental consent has not been provided.  Azure AD B2C can then present a screen to the user that informs of being blocked.  No token is issued, access is blocked, and the user account is not created during a registration journey. To implement this, you provide a suitable HTML/CSS content page to inform the user and present appropriate options. No further action is needed by the application for new registrations.

## Get parental consent

Depending on application regulation, parental consent might be required to be granted by a user verified as an adult.  Azure AD B2C does not provide an experience to verify an individual’s age and then allow a verified adult to grant parental consent to a minor.  This experience must be provided by the application or another service provider.

The following is an example of a user flow for gathering parental consent:

1. An [Azure Active Directory Graph API](https://msdn.microsoft.com/en-us/library/azure/ad/graph/api/api-catalog) operation identifies the user as a minor and returns the user data to the application in the form of an unsigned JSON token.
2. The application processes the JSON token and shows a screen to the minor notifying that parental consent is required and requests the consent of a parent online. 
3. Azure AD B2C shows a sign-in journey whereby the user is allowed to sign in normally and issues a token to the application that is set to include **legalAgeGroupClassification = “minorWithParentalConsent”** The application collects the email address of the parent and verifies the parent is an adult using a trusted source such as a national ID office, license verification, or credit card proof. If successful, the application prompts the minor to sign in using the Azure AD B2C user flow. If consent was denied (e.g. **legalAgeGroupClassification = “minorWithoutParentalConsent”**, Azure AD B2C returns a JSON token (not a login) to the application to restart consent process. It is optionally possible to customize the user flow whereby a minor or an adult can regain access to a minor’s account by sending a registration code to the minor’s email address or the adult’s email address on record.
4. The application offers an option to the minor to revoke consent.
5. When the minor or adult revokes consent, the Azure AD Graph API can be used to change **consetProvidedForMinor** to **denied**. Alternatively, the application may choose to delete a minor whose consent has been revoked. It is optionally possible to customize the user flow whereby the authenticated minor (or parent using the minor’s account) can revoke consent. Azure AD B2C records **consentProvidedForMinor** as **denied**.

For more information about the **legalAgeGroupClassification**, **consentProvidedForMinor**, and **ageGroup**, see [User Resource Type](https://developer.microsoft.com/en-us/graph/docs/api-reference/beta/resources/user). For more information about custom attributes, see [Use custom attributes to collect information about your consumers](active-directory-b2c-reference-custom-attr.md). When addressing extended attributes using Azure AD Graph API, the long version of the attribute must be used such as "extension_18b70cf9bb834edd8f38521c2583cd86_dateOfBirth": "2011-01-01T00:00:00Z"

## Gather date of birth and country data

Applications may rely on Azure AD B2C to gather date of birth (DOB) and country from all users during registration. If DOB or country information does not already exist, it can be asked of the user during the next authentication (sign-in) journey. Users will not be able to proceed without providing DOB and country information. Based on the country and DOB provided, Azure AD B2C determines if the individual is considered a minor according to the regulatory standards of that country. 

A customized user flow can gather DOB and country information and use Azure AD B2C claims transformation to determine the **ageGroup** and persist the result (or persist the country and DOB information directly) in the directory.

The following steps show the logic that is used to calculate **ageGroup** from date of birth:

1. Try to find the country by the country code in the list. If the country is not found, fall back to **Default**.
2. If the **MinorConsent** node is present in the country element:
    <br>a. Calculate the minimum date that the user would have had to have been born on to be considered an adult. Example: birth date is 3/14/2015 and **MinorConsent** is 18, minimum birth date would be 3/14/2000.
    <br>b. Compare the minimum birth date with the actual birth date. If the minimum birth date is before the user’s birth date, the calculation returns **Minor** as the age group calculation.
3. If the **MinorNoConsentRequired** node is present in the country element, repeat steps 2a and 2b using the value from **MinorNoConsentRequired**. The output of 2b returns **MinorNoConsentRequired** if the minimum birth date is before the user’s birth date. 
4. If neither calculations returned true, the calculation returns **Adult**.

If an application has reliably gathered DOB or country data by other methods, the application may use the GRAPH API to update the user record with this information. For example:

- If a user is known to be an adult, update the directory attribute **ageGroup** with a value of **Adult**.
- If a user is known to be a minor, update the directory attribute **ageGroup** with a  value of **Minor** and set **consentProvidedForMinor** as appropriate.

For more information about gathering DOB data, see [Using age gating in Azure AD B2C](basic-age-gating.md).

## Capture terms of use agreement

When you develop your application, you typically capture the user acceptance of terms of use within their applications, with no, or only minor participation from the user directory.  It is possible, however, to use an Azure AD B2C user flow to gather agreement of terms of use, restrict access unless acceptance is granted, and to enforce acceptance of future changes to the terms of use based on the date of last acceptance and the date of the latest version of the terms of use.

**Terms of Use** may also include “Consent to share data with third parties.”  The positive acceptance of these conditions from a user may be technically gathered as combined or the user may be able to accept one and not the other depending on local regulations and business rules.

The following steps describe the capabilities for managing terms of use:

1. Record acceptance of the terms of use and date of acceptance of using the Graph API and extended attributes. This can be done using both built-in and custom user flows. It is recommended that you create and use the **extension_termsOfUseConsentDateTime** and **extension_termsOfUseConsentVersion** attributes.
2. Create a required check box titled “Accept Terms of Use” and record the result during signup. This can be done using both built-in and custom user flows.
3. Azure AD B2C stores the terms of use agreement and consent. The Graph API can be used to query for the status of any user by reading the extension attribute used to record the response, for example read **termsOfUseTestUpdateDateTime**. This can be done using both built-in and custom user flows.
4. Require acceptance of updated terms of use by comparing the date of acceptance to date of the latest version of the terms of use. This can only be done using a custom user flow. Use the extended attribute **extension_termsOfUseConsentDateTime** and compare the value to the claim of **termsOfUseTextUpdateDateTime**, if acceptance is old then force a new acceptance self-asserted screen, otherwise, block access using policy logic.
5. Require acceptance of updated terms of use by comparing the version number of acceptance to last accepted version number. This can only be done using a custom user flow. Use the extended attribute **extension_termsOfUseConsentDateTime** and compare the value to the claim of **extension_termsOfUseConsentVersion**, if acceptance is old then force a new acceptance self-asserted screen, otherwise, block access using policy logic.

Capturing terms of use consent can be presented to the user under the following scenarios:

- A new user is signing up. The terms of use are displayed the consent result is stored.
- A user is signing in and has already previously accepted consent for the latest or active terms of agreement. The terms of use are not displayed.
- A user is signing in and has not already accepted consent for the latest or active terms of use. The terms of use are displayed the consent result is stored.
- A user is signing in and has already accepted consent for an older terms of use, which is now updated to a later version. The terms of use are displayed the consent result is stored.

The following image shows the recommended user flow:

![acceptance user flow](./media/manage-user-access/user-flow.png) 

The following is an example of a DateTime based terms of use consent in a claim:

```
<ClaimsTransformations>
  <ClaimsTransformation Id="GetNewUserAgreeToTermsOfUseConsentDateTime" TransformationMethod="GetCurrentDateTime">
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="extension_termsOfUseConsentDateTime" TransformationClaimType="currentDateTime" />
    </OutputClaims>
  </ClaimsTransformation>
  <ClaimsTransformation Id="IsTermsOfUseConsentRequired" TransformationMethod="IsTermsOfUseConsentRequired">
    <InputClaims>
      <InputClaim ClaimTypeReferenceId="extension_termsOfUseConsentDateTime" TransformationClaimType="termsOfUseConsentDateTime" />
    </InputClaims>
    <InputParameters>
      <InputParameter Id="termsOfUseTextUpdateDateTime" DataType="dateTime" Value="2098-01-30T23:03:45" />
    </InputParameters>
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="termsOfUseConsentRequired" TransformationClaimType="result" />
    </OutputClaims>
  </ClaimsTransformation>
</ClaimsTransformations>
```

The following is an example of a Version based terms of use consent in a claim:

```
<ClaimsTransformations>
  <ClaimsTransformation Id="GetEmptyTermsOfUseConsentVersionForNewUser" TransformationMethod="CreateStringClaim">
    <InputParameters>
      <InputParameter Id="value" DataType="string" Value=""/>
    </InputParameters>
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="extension_termsOfUseConsentVersion" TransformationClaimType="createdClaim" />
    </OutputClaims>
  </ClaimsTransformation>
  <ClaimsTransformation Id="GetNewUserAgreeToTermsOfUseConsentVersion" TransformationMethod="CreateStringClaim">
    <InputParameters>
      <InputParameter Id="value" DataType="string" Value="V1"/>
    </InputParameters>
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="extension_termsOfUseConsentVersion" TransformationClaimType="createdClaim" />
    </OutputClaims>
  </ClaimsTransformation>
  <ClaimsTransformation Id="IsTermsOfUseConsentRequiredForVersion" TransformationMethod="CompareClaimToValue">
    <InputClaims>
      <InputClaim ClaimTypeReferenceId="extension_termsOfUseConsentVersion" TransformationClaimType="inputClaim1" />
    </InputClaims>
    <InputParameters>
      <InputParameter Id="compareTo" DataType="string" Value="V1" />
      <InputParameter Id="operator" DataType="string" Value="not equal" />
      <InputParameter Id="ignoreCase" DataType="string" Value="true" />
    </InputParameters>
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="termsOfUseConsentRequired" TransformationClaimType="outputClaim" />
    </OutputClaims>
  </ClaimsTransformation>
</ClaimsTransformations> 
```

## Next steps

- Learn how to delete and export user data in [Manage user data](manage-user-data.md)
