<properties
	pageTitle="Security Guidance for Password-Based Single Sign-On in Azure AD | Microsoft Azure"
	description="Learn how to customize the expiration date for your federation certificates, and how to renew certificates that will soon expire."
	services="active-directory"
	documentationCenter=""
	authors="liviodlc"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/27/2015"
	ms.author="liviodlc"/>

#Security Guidance for Password-Based Single Sign-On

This article addresses common security concerns when enabling password-based single sign-on (SSO) in Azure Active Directory. To learn more about this feature, see [Introduction to Password-Based Single Sign-On](active-directory-appssoaccess-whatis.md#password-based-single-sign-on)

In general, the most secure way to enable single sign-on for any application is to use [federated single sign-on](active-directory-appssoaccess-whatis.md#how-does-single-sign-on-with-azure-active-directory-work) if the application supports it.

##Security benefits of password-based SSO

1. **Guards against certain phishing attacks** — Users must use the Azure AD browser plugin to sign into apps using password-based SSO. When signing in via the plugin, users are prevented from inserting their credentials into any website that isn't part of the intended application. Users are also unable to use the plugin to insert their credentials into forms, fields, or other elements that are not part of the application's official sign-in controls.

2. **Users are less likely to write down passwords in insecure locations** — When someone has to remember several sets of credentials, it is incredibly tempting for them to store their passwords on sticky notes, notebooks, and plain-text files. The convenience of password-based SSO removes that temptation.

3. **Secure sharing of credentials with teams** — Teams often need to share access to the same account: for example, a marketing team may share access to their company's social media accounts. This situation inevitably leads to the password getting written down or distributed via email. With password-based SSO, team members can seamlessly receive access to the same account without needing to learn what the credentials are. The shared password can also be changed without having to communicate the new credentials to anyone.

4. **Automated password rollover (preview)** — For certain apps, Azure AD can automatically change your app account's password at a regular frequency. This is a very convenient way to keep your account secure. [Learn more.](http://blogs.technet.com/b/ad/archive/2015/02/20/azure-ad-automated-password-roll-over-for-facebook-twitter-and-linkedin-now-in-preview.aspx)

##Security limitations of password-based SSO

It's easy to see that using password-based SSO can make your organization more secure. However, it's also worth remembering that it doesn't mitigate all of the security risks inherent in any username/password system. Below is a list of risks to keep in mind when deploying password-based single sign-on:

1. **Users are still vulnerable to malware** — Regardless of whether or not your organization is using password-based SSO, your users' passwords can still be comprised by malicious software.

2. **Users who remember their credentials are still capable of compromising them** — As mentioned above, the Azure AD browser plugin will only interact with the app's official sign-in page, located on the app's official website. It does not, however, actively prevent users who know their passwords from manually inserting their credentials into insecure or malicious locations, digitally or physically.

3. **Terminated users still need to be deprovisioned from their apps** — When a user is disabled in Azure AD, they can no longer use the browser plugin to sign into applications using password-based SSO. However, if a user still remembers their credentials, or if their existing session in the application hasn't expired yet, then the only way to immediately disable their access is to completely disable their account in the application.

4. **Immediately removing someone's access to a shared account still isn't easy** — If a terminated user has access to a shared account, disabling that account for everyone who uses it is not a reasonable way to secure that app from that user. Some options for mitigating this risk include: enabling [automated password rollover](http://blogs.technet.com/b/ad/archive/2015/02/20/azure-ad-automated-password-roll-over-for-facebook-twitter-and-linkedin-now-in-preview.aspx0), having a manual workflow to immediately change the password for the shared account, and manually having the app sign you out of all other sessions (if the app supports this feature).

5. **Users can still discover their credentials** — With password-based SSO, users don't necessarily need to know their app credentials in order to sign in to that app securely. As a result, it's common for organizations to use password-based SSO as a means of distributing credentials when onboarding users to apps, so that users never have to learn what those credentials are. These organizations also [use group policy to disable the browser's "remember password" prompt](active-directory-saas-ie-group-policy.md).

	Having users who are ignorant of their app credentials does mitigate many of the risks listed above, because it effectively forces users to *only* sign in through the Azure AD browser plugin. Unfortunately, while this approach does add an extra amount of security, it is still technically possible for users to discover their credentials by using web debbuging tools. Therefore, from a security perspective, it is best practice to not assume that your users are ignorant of the credentials for their app account.

[AZURE.INCLUDE [saas-toc](../../includes/active-directory-saas-toc.md)]
