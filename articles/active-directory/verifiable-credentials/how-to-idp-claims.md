---
title: Customizing claims in ID tokens - Azure AD
description: Learn how you can add a claim to your tokens, and use that claim can be used to populate attributes in your verifiable credentials
services: active-directory
documentationCenter: ''
author: barclayn
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.subservice: verifiable-credentials
ms.date: 02/11/2021
ms.author: barclayn

#Customer intent: As an administrator, I want the high-level steps that I should follow so that I can quickly start using entitlement management.

---

# Customizing claims in ID tokens

This article contains instructions for populating your identity provider's ID tokens with custom user attributes. When you add a claim to your tokens, that claim can be used to populate attributes in your verifiable credentials.

## Azure Active Directory

By default, Azure Active Directory ID tokens contain a few claims that can be used as attributes in verifiable credentials, such as `preferred_username`. These claims can be used in verifiable credentials without any additional configuration.

| Version | Link to Docs |
| ------- | ------------ |
| Azure AD v1.0 tokens | [ID tokens in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/id-tokens) |
| Azure AD v2.0 tokens | [ID tokens in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/id-tokens) |

In addition to the default set of claims, Azure Active Directory also includes a set of *optional claims* that can be configured using the Azure portal. Examples include `tenant_ctry`, `upn`, `family_name`, and `given_name`.

| Version | Link to Docs | 
| ------- | ------------ |
| Azure AD v1.0 tokens | [Optional claims for v1.0 tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set) |
| Azure AD v2.0 tokens | [Optional claims for v2.0 tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-optional-claims#v10-and-v20-optional-claims-set) |

When you want to add additional user information to your tokens not available in the optional claims set, you need to customize the claims in your ID tokens. Configuring your Azure AD tenant to issue custom claims in its tokens is a three-step process:

![Directory extensions in AAD](/media/how-to-idp-claims/customize-claims-aad.png)

1 - First, create a directory extension in your Azure AD tenant. [This older Azure AD Graph API article](https://docs.microsoft.com/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-directory-schema-extensions) describes concepts and instructions for creating a directory extension, and is a useful place to start. When registering extensions, you may also use the [Microsoft Graph APIs documented here](https://docs.microsoft.com/graph/api/resources/extensionproperty?view=graph-rest-1.0). Be careful not to use the newer Microsoft Graph schema extensions.

2 - After registering your directory extension, you need to write user data to your extension attribute, populating the directory with user information you wish to include in your verifiable credentials. [This older Azure AD Graph API article](https://docs.microsoft.com/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-directory-schema-extensions) gives example requests for writing data to your directory extensions. You may also use the [Microsoft Graph API](https://docs.microsoft.com/graph/api/user-update) or another tool for updating user objects in your tenant.

3 - Once all of your user information has been written to the directory, you can configure your tenant to use the directory extension as an optional claim. [This section in this article](../active-directory/develop/active-directory-optional-claims.md#configuring-directory-extension-optional-claims) describes how to configure your ID tokens to include values sourced from a directory extension.

Once you have configured your ID tokens to include all claims necessary for your verifiable credentials, you can return to [configuring your verifiable credentials](xref:e47e0237-9189-4f33-a0f3-e4c135688342).


## Azure AD B2C

Azure AD B2C also includes built-in flexibility for customizing claims in ID tokens. For the purposes of issuing verifiable credentials, there are two approaches to consider.

### Approach 1: Custom attributes in Azure AD B2C

Similar to the section above, you can extend your Azure AD B2C tenant with additional user attributes, and then populate your Azure AD B2C tenant with user data you wish to use in your verifiable credentials.

![User attributes in B2C](/media/how-to-idp-claims/customize-claims-b2c.png)

1 - Azure AD B2C comes with many built-in attributes such as `country`, `display name`, `email address`, and many more. Configuring your claims to use these built-in attributes is simple. [This article](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows) describes how to create a user flow in B2C and customize the attributes included in claims. If you want to include additional attributes, you can also [easily define custom attributes](https://docs.microsoft.com/azure/active-directory-b2c/user-flow-custom-attributes) for your B2C tenant and use them in your ID tokens.


2 - After defining your custom attributes extension, you need to write user data to your attribute, populating the directory with user information you wish to include in your verifiable credentials. Attributes can be populated automatically by including them as part of a sign-up or profile editing user flow. You can also populate your attributes by writing data to user objects in your B2C directory using the [Microsoft Graph API](https://docs.microsoft.com/azure/active-directory-b2c/manage-user-accounts-graph-api).

 Once you've populated those attributes with user information, they can be included in claims in ID tokens issued by your Azure AD B2C tenant.

### Approach 2: REST API exchanges in Azure AD B2C

Azure AD B2C also allows you to connect to an external REST API when issuing an ID token. The results returned from the REST API can be configured to be included as claims in ID tokens issued by your Azure AD B2C tenant.

![User attributes in B2C](/media/how-to-idp-claims/customize-claims-rest.png)

To connect to Azure AD B2C to an external REST API, you'll need to use an [Azure AD B2C custom policy](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview). Custom policies give you rich flexibility for customizing the Azure AD B2C authentication process. [This article](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-rest-api-claims-exchange) walks you through how to write a custom policy that connects to a REST API and uses its results as claims in an ID token. 

## Other identity providers

If you're not using Azure AD or Azure AD B2C to issue verifiable credentials, you'll need to figure out how to customize tokens issued by your identity provider. Contact us and we'll be happy to assist you in the process of integrating your identity provider with Microsoft Authenticator and Verifiable Credentials.
