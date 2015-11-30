<properties
	pageTitle="Azure Active Directory B2C preview: Self-service password reset | Microsoft Azure"
	description="A topic demonstrating how to setup self-service password reset for your consumers in Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: setup Self-service Password Reset for your Consumers

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

This feature allows your consumers (who have signed up for local accounts) to reset their passwords on their own. This significantly reduces the burden on your support staff, especially if your application has millions of consumers using it on a regular basis. Currently, we only support using a verified email address as a recovery method. We will add additional recovery methods (verified phone number, security questions, etc.) in the future. By default, your directory will not have self-service password reset turned on. Use the following steps to turn it on:

1. Sign into the [Azure portal](https://manage.windowsazure.com/) as the Subscription Administrator. This is the same work or school account or the same Microsoft Account that you used to create your directory.
2. Navigate to the Active Directory extension on the navigation bar on the left hand side.
3. Find your directory under the **Directory** tab and click on it.
4. Click on the **Configure** tab.
5. Scroll down to the **user password reset policy** section and toggle the **users enabled for password reset** option to **YES**. Notice that the **Alternate Email Address** option is checked; leave it as-is.

    ![Self-service password reset](./media/active-directory-b2c-reference-sspr/sspr.png)
 
6. Click **Save** at the bottom of the page. You're done!

To test, use the "Run now" feature on any sign-in policy (which has local accounts as an identity provider). On the local account sign-in page (where you enter email address & password or username & password), click on **Can't access your account?** to verify the consumer experience.

> [AZURE.NOTE]
The self-service password reset pages are customizable using the [company branding feature](active-directory-add-company-branding.md).
