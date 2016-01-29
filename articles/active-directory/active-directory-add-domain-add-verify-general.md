<properties
	pageTitle="Add and verify a custom domain name | Microsoft Azure"
	description="Explains the overall process of how to add your own domain names to Azure Active Directory, and procedures for verifying DNS entries."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/28/2016"
	ms.author="curtand;jeffsta"/>


# Add and verify your custom domain name

To add a custom domain name and verify it for use with your Azure Active Directory, you must complete the following steps.

1.  Do one of the following:

	-   [Add a custom domain name that will be federated with on-premises Active Directory](#add-a-custom-domain-name-that-will-be-federated)

	-   [Add a custom domain name that will not be federated with on-premises Active Directory](#add-and-verify-a-custom-domain-name-that-will-not-be-federated)

2.  Verify the custom domain name.

	1. Add the DNS entries that Azure AD will use to verify that your organization owns the custom domain name at the domain name registrar for your domain.

	2. Verify the domain in Azure AD.

## Add a custom domain name that will be federated

(Intro about directory integration and Azure AD Connect)

**To add a custom domain name to your Azure AD directory**

1.  Sign in to the [Azure classic portal](https://manage.windowsazure.com) with an account that has global admin privileges in Azure AD.

2.  Select Active Directory.

3.	Open your directory.

4.  Select the **Domains** tab.

5.  On the command bar, select **Add**.

6.  Enter the name of your custom domain. Be sure to include the .com extension.

7.  Select the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox.

8.  Click **Add**.

Verify your custom domain and configure it for federation with Azure AD

1.  Download and run Azure AD Connect. As step (which step?) it will prompt you to add the DNS entries that it provides you.

    [Instructions for adding DNS entries at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)


## Add and verify a custom domain name that will not be federated

Most custom domain names are second level domains “contoso.com”

**To add the custom domain name to your Azure AD directory**

1.  Sign in to the [Azure classic portal](https://manage.windowsazure.com) with an account that has global admin privileges in Azure AD.

2.  Select Active Directory.

3.	Open your directory.

4.  Select the **Domains** tab.

5.  On the command bar, select **Add**.

6.  Enter the name of your custom domain. Be sure to include the .com extension.

7.  Ensure that the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox is cleared.

8.  Click **Add**.

9.  See that your domain has been added to the directory.


## Verify a domain at any domain name registrar

To verify your domain, you create a DNS record at the domain name registrar, or wherever your DNS is hosted, and then Azure AD uses that record to confirm that you own the domain. Before you can verify your domain, you must add a custom domain to Azure AD. If you already have a domain registered with a domain name registrar, the required DNS records already exist, and you can skip to [Verify your domain](#verify-your-domain).

When you've added a custom domain but the domain hasn't yet been verified, the status will show as **Unverified**.

#### Verify your domain

After any records that you created for your domain have been added successfully through the DNS system at you domain registrar, do the following:

1. In Azure Active Directory in the [Azure classic portal](https://manage.winowsazure.com), click **Domains**.
2. In the **Domains** list, find the domain that you're verifying, and then based on the portal you are using, click either **Click to verify domain** or **Verify**.
3. Follow the instructions provided to complete the verification process.
    - If domain verification succeeds, you will be notified that your domain has been added to your account.
    - If domain verification fails, then any changes that you made at the domain registrar might need more time to propagate. Cancel the verification, and try again later.

If it has been more than 72 hours since you made the changes to your domain, sign in to the domain registrar's website and verify that you entered the alias information correctly. If you entered the information incorrectly, you must remove the incorrect DNS record and create a new one with the correct information by using the procedures in this topic.

After you've verified your domain, you can configure your domain to work with your accounts.
