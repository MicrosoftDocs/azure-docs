---
title: Authentication methods and identity providers for CIAM
description: Learn how to use different authentication methods for your customer sign-in and sign-up in CIAM. 
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know what authentication methods and identity providers can I use in a CIAM tenant. 
---
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/external-identities/identity-providers and some are details added to it from articles in this branch. For now the text  is used as a placeholder in the release branch, until further notice. -->

# Identity Providers for CIAM

An *identity provider* creates, maintains, and manages identity information while providing authentication services to applications. CIAM offers various identity providers.

- **Google**: By setting up federation with Google, you can allow invited users to sign in to your applications with their own Gmail accounts. After you've added Google as one of your application's sign-in options, on the sign-in page, users can sign in to Azure AD for customers with a Google account.

The following screenshots show the sign-in with Google experience. In the sign-in page, users select **Sign-in options**, and then select **Sign-in with Google**. At that point, the user is redirected to the Google identity provider to complete the sign-in.

<!--[Screenshot that shows the sign-in with Google flow.](./media/sign-in-with-google/sign-in-with-google-flow.png)-->

- **Facebook**: By setting up federation with Facebook, you can allow invited users to sign in to your applications with their own Facebook accounts. After you've added Facebook as one of your application's sign-in options, on the sign-in page, users can sign-in to Azure AD for customers with a Facebook account.

The following screenshots show the sign-in with Facebook experience. In the sign-in page, users select **Sign-in options**, and then select **Sign-in with Facebook**. Then the user is redirected to the Facebook identity provider to complete the sign-in.

<!--[Screenshot that shows the sign-in with Facebook flow.](./media/sign-in-with-facebook/sign-in-with-facebook-flow.png)-->

## Adding social identity providers

To set up social identity providers in your CIAM tenant, you'll create an application at the identity provider and configure credentials. You'll obtain a client or app ID and a client or app secret, which you can then add to your CIAM tenant.

Once you've added an identity provider to your CIAM tenant:

- When you invite an external user to apps or resources in your organization, the external user can sign in using their own account with that identity provider.
- When you enable self-service sign-up for your apps, external users can sign up for your apps using their own accounts with the identity providers you've added. They'll be able to select from the social identity providers options you've made available on the sign-up page:

For an optimal sign-in experience, federate with identity providers whenever possible so you can give your invited guests a seamless sign-in experience when they access your apps.  

## Next steps

To learn how to add identity providers for sign-in to your applications, refer to the following articles:
- [Add Facebook as an identity provider](how-to-facebook-federation-customers.md)
- [Add Google as an identity provider](how-to-google-federation-customers.md)
