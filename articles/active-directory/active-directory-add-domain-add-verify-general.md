<properties
	pageTitle="Add and verify a custom domain name in Azure Active Directory | Microsoft Azure"
	description="How to add your existing domains to Azure Active Directory as part of getting started with Azure AD. Set up your custom domain to sync user account information with your on-premises identity infrastructure."
	services="active-directory"
	documentationCenter=""
	authors="jeffsta"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/05/2016"
	ms.author="curtand;jeffsta"/>

# Add and verify a custom domain name in Azure Active Directory

To add a custom domain name and verify it for use with your Azure Active Directory, you must complete the following steps.

1.  Do one of the following:

    -   [Add a custom domain name that will be federated with on-premises Active Directory](#add-a-custom-domain-name-that-will-be-federated)

    -   [Add a custom domain name that will not be federated with on-premises Active Directory](#add-a-custom-domain-name-that-will-not-be-federated)

2.  Verify the custom domain name.

    -   Add the DNS entries that Azure AD will use to verify that your organization owns the custom domain name at the domain name registrar for your domain.

    -   Verify the domain in Azure AD.

## Add a custom domain name that will be federated

For more information about on-premises directory integration using Azure AD Connect, see

**To add a custom domain name to your Azure AD directory**

1.  Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with an account that has global admin privileges in Azure AD.

2.  Select Active Directory.

3.  Open your directory.

4.  Select the **Domains** tab.

5.  On the command bar, select **Add**.

6.  Enter the name of your custom domain. Be sure to include the .com extension.

7.  Select the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox.

8.  Click **Add**.

## Add a custom domain name that will not be federated

Most custom domain names are second level domains “contoso.com”

**To add the custom domain name to your Azure AD directory**

1.  Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with an account that has global admin privileges in Azure AD.

2.  Select Active Directory.

3.  Open your directory.

4.  Select the **Domains** tab.

5.  On the command bar, select **Add**.

6.  Enter the name of your custom domain. Be sure to include the .com extension.

7.  Ensure that the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox is cleared.

8.  Select **Add**.

9.  See that your domain has been added to the directory.

## Verify a domain at any domain name registrar

To verify your domain, you create a DNS record at the domain name registrar, or wherever your DNS is hosted, and then Azure AD uses that record to confirm that you own the domain. [Instructions for adding DNS entries at popular DNS registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/)

If you already have the domain registered with a domain name registrar, the required DNS records already exist.

When you've added a custom domain but the domain hasn't yet been verified, the status will show as **Unverified**.

## Verify a custom domain name that you will not be federating with an on-premises directory
After any records that you created for your domain have been added successfully through the DNS system at your domain registrar, do the following:

1.  In Azure Active Directory in the [Azure classic portal](https://manage.windowsazure.com/), click **Domains**.

2.  In the **Domains** list, find the domain that you're verifying, and then based on the portal you are using, click either **Click to verify domain** or **Verify**.

3.  Follow the instructions provided to complete the verification process.

    -   If domain verification succeeds, you will be notified that your domain has been added to your account.

    -   If domain verification fails, then any changes that you made at the domain registrar might need more time to propagate. Cancel the verification, and try again later.

If it has been more than 72 hours since you made the changes to your domain, sign in to the domain registrar's website and verify that you entered the alias information correctly. If you entered the information incorrectly, you must remove the incorrect DNS record and create a new one with the correct information.

## Verify your custom domain for federation with your on-premises directory

1.  Download and run Azure AD Connect. The Azure AD Connect tool will [prompt you to add the DNS entries that it provides you](active-directory-aadconnect-get-started-custom.md#verify-the-azure-ad-domain-selected-for-federation).

## Third-level domain names

You can use third-level domains such as “europe.contoso.com” with your Azure AD. To add and use a third level domain:

1.  Add and verify the second level domain “contoso.com”

2.  Add any subdomains such as “europe.contoso.com” to Azure AD. When you add a subdomain of a verified second level domain, the third level domain is automatically verified by Azure AD. There's no need to add any more DNS entries.

These steps can also be completed using PowerShell and Graph.

After you've verified your domain, you can configure your domain to work with your accounts.

## Next steps

- [Using custom domain names to simplify the sign-in experience for your users](active-directory-add-domain.md)
- [Add company branding to your Sign In and Access Panel pages ](active-directory-add-company-branding.md)
- [Assign users to a custom domain](active-directory-add-domain-add-users.md)
- [Change the DNS registrar for your custom domain name](active-directory-add-domain-change-registrar.md)
- [Delete a custom domain in Azure Active Directory](active-directory-add-domain-delete-domain.md)
