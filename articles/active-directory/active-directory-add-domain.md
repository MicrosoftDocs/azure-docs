<properties 
	pageTitle="Add your own domain name to Azure AD" 
	description="A topic that explains how to add your own domain name to Azure AD and related info." 
	services="active-directory" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="active-directory" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/12/2015" 
	ms.author="Justinha"/>

# Add your own domain name to Azure AD

When you sign up for a Microsoft cloud service, you are issued a domain name that has the following format: contoso.onmicrosoft.com. You can continue to use that initial domain name, or you can add your own custom domain name to the cloud service. This topic explains how to add your own domain name and related information.

Office 365 users may be interested in these related topics:

- [DNS basics](https://support.office.com/article/854b6b2b-0255-4089-8019-b765cff70377)
- [Find your domain registrar or DNS hosting provider](https://support.office.com/article/Find-your-domain-registrar-or-DNS-hosting-provider-b5b633ba-1e56-4a98-8ff5-2acaac63a5c8/)
- [Work with domain names in Office 365](https://support.office.com/article/Work-with-domain-names-in-Office-365-4f1bd681-337a-4bd3-a7b7-cf77b18d0870/)

## About your onmicrosoft.com domain

You can use your onmicrosoft.com domain with other services. For example, you can use the domain with Exchange Online and Lync Online to create distribution lists and sign-in accounts so users can access SharePoint Online and site collections.

If you add your own domain names to your directory, you can continue to use your onmicrosoft.com domain.

After you choose the name to use with the cloud service during signup, such as contoso.onmicrosoft.com, you cannot change the name. 

## How can I add my own domain?

If your organization already has a custom domain name, as an administrator, you can add it to your Azure AD directory to use with all of the Microsoft online services that you have subscribed to. After you've added your domain name to Azure AD, you can start associating your domain name with your various cloud services.

You can add up to 900 domain names to your Azure AD tenant by using, either: 

- The Azure Management Portal, the Office 365 portal, or the Microsoft Intune portal.
- The Azure Active Directory Module for Windows PowerShell. For more information about which cmdlet you can use for this, see [Manage domains](https://msdn.microsoft.com/library/azure/dn919677.aspx).

You must have already registered a domain name and have the sign-in credentials needed for your domain name registrar (for example, Go Daddy or Register.com). 

You can add multiple domains to your directory. However, you can't add the same domain to different directories. So, for example, If you add your domain to your directory, you can't create another Azure AD directory and add the same domain name to it.

If you plan to use single sign-on with the cloud service, we recommend that you help prepare your Active Directory environment by running the Microsoft Deployment Readiness Tool. This tool inspects your Active Directory environment and provides a report that includes information about whether you are ready to set up single sign-on. If not, it lists the changes you need to make to prepare for single sign-on. For example, it inspects whether your users have UPNs and if those UPNs are in the correct format. To download the tool, see [Microsoft Deployment Readiness Tool](http://go.microsoft.com/fwlink/?linkid=235650).

> [AZURE.NOTE]
> Using Office 365? Once you have set up your domain, you can start creating email addresses, Lync Online accounts, and distribution groups that use your custom domain name. You can also use your domain name for a public-facing website hosted on SharePoint Online.

- [Add and verify a domain using the Azure Management Portal](#add-and-verify-a-domain-using-the-azure-management-portal)
- [Edit DNS records for your cloud services](#edit-dns-records-for-your-cloud-services)
- [Verify a domain at any domain name registrar](#verify-a-domain-at-any-domain-name-registrar)

### Add and verify a domain using the Azure Management Portal

1. In the portal, click **Active Directory**, and then click on the name of your organization's directory.You can do one of the following:
    1. On the default directory page, click **Add Domain** in the **Improve user sign-in experience **section. 
    2. Click **Domains** and then click either **Add a customer domain** or the **Add** button.
2. On the **Add domain** page, type the domain name that you want to add and the do one of the following:
    1. If you do not plan to integrate your on-premises Active Directory with Azure AD, do the following:
        1. Leave the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox unchecked and click the **Add** button.
        2. After you see the message that your domain has been successfully added to Azure AD, click the arrow to move to the next page so you can verify your domain.
        3. Follow the directions on the next page to verify that the domain name you added in the previous steps belongs to you. For step-by-step directions, see Verify a domain at any domain name registrar.
    2. If you want to integrate your on-premises Active Directory with Azure AD, do the following:
        1. Make sure to check the **I plan to configure this domain for single sign-on with my local Active Directory** checkbox and then click the **Add** button.
        2. After you see the message that your domain has been successfully added to Azure AD, click the arrow to move to the next page and then follow the directions on that page to configure the domain you added for single sign-on.

> [AZURE.NOTE]
> After you add your domain name to Azure AD, you can change the default domain name for new email addresses. For more information, see [How can I change the primary domain name for users?](#how-can-i-change-the-primary-domain-name-for-users?) You can also edit the profile for an existing user account to update the email address (which is also your user ID) to use your custom domain name instead of the onmicrosoft.com domain. 

### Edit DNS records for your cloud services

> [AZURE.NOTE]
> Using Microsoft Intune? You do not need to edit DNS records for the Microsoft Intune cloud service.

After you add and verify your custom domain name, the next step is to edit the DNS records at your domain registrar or DNS hosting provider that point traffic to your cloud service. Azure AD provides the DNS information that you need.

If you've just completed the **Add a domain** wizard, click **Configure DNS records**. Otherwise, follow these steps.

1. In the portal, in the left pane, click **Domains**.
2. Depending on which portal you are using, click the domain name that you want to set up, and then click either **DNS settings** or **View DNS settings**. The **DNS settings** page lists the DNS records for the cloud service.

    If you want to configure a service that you don't see on the DNS settings tab, check your domain services selections to make sure you've chosen that service for this domain name. To change the settings, for example, to add Lync Online, see Specify the services you'll use with your domain.

3. At your domain name registrar website, add the required records to your DNS file.

Typically it takes about 15 minutes for your changes to take effect. But it can take up to 72 hours for the DNS record that you created to propagate through the DNS system. If you need to view these record settings again, on the **Domains** page, click the domain, and then, on the **Domain properties** page, click the **DNS settings** tab.

To check the status of your domain, on the **Domains** page, click the domain, and then, on the **Domain properties** page, click **Troubleshoot domain**.

### Verify a domain at any domain name registrar

If you already have a domain registered with a domain name registrar, and you want to configure it to work with Azure AD, domain verification is required to confirm that you own the domain. To verify your domain, you create a DNS record at the domain name registrar, or wherever your DNS is hosted, and then Azure AD uses that record to confirm that you own the domain.

Before you can verify your domain, you must add a custom domain to Azure AD. When you've added a custom domain but the domain hasn't yet been verified, the status will either show as **Click to verify domain** or **Unverified**.

#### Gather your domain information 

Based on the portal you are using to administer your Azure AD directory, you'll need to collect some information about your domain so that you can later create a DNS record that will be used during the verification process. 

If you are using Microsoft Intune or the Azure Account Portal:

1. On the **Domains** page, in the list of domain names, find the domain that you are verifying. In the **Status** column, click **Click to verify domain**.
2. On the **Verify domain** page, in the **See instructions for performing this step with:** drop-down list, choose your DNS hosting provider. If your provider doesn't appear in the list, choose **General instructions**.
3. In the **Select a verification method:** drop-down list, choose **Add a TXT record (preferred method)** or **Add an MX record (alternate method)**.

    If your DNS hosting provider allows you create TXT records, we recommend you use a TXT record for verification. Why? TXT records are straightforward to create and don't introduce the possibility of interfering with email delivery if an incorrect value is accidentally entered.

4. From the table, copy or record the **Destination or Points to Address** information.

If you are using the Management Portal:

1. In the portal, click **Active Directory**, click the name of your directory, click **Domains**. 
2. On the **Domains** page, in the list of domain names, click the domain that you want to verify, and then click **Verify**.
2. On the **Verify** page, in the **Record Type** drop-down list, choose either **TXT record** or **MX record**.
3. Copy or record the information under it.

#### Add a DNS record at your domain name registrar 

Azure AD uses a DNS record that you create at your domain name registrar to confirm that you own the domain. Use the instructions below to create either a TXT or MX record type for a domain that is registered at your registrar.

If your domain registrar does not accept '@' as a hostname, contact your domain registrar to find out how to represent 'parent of the current zone.'

Office 365 has [specific instructions for common domain registrars](https://support.office.com/article/Create-DNS-records-for-Office-365-when-you-manage-your-DNS-records-b0f3fdca-8a80-4e8e-9ef3-61e8a2a9ab23/).

For general instructions, follow these steps to add a TXT or MX record:

1. Sign in to your domain name registrar's website, and then select the domain that you're verifying.
2. In the DNS management area for your account, select the option to add a TXT or an MX record for your domain.
3. In the **TXT** or **MX** box for the domain, type the following: @
4. In the **Fully qualified domain name (FQDN)** or **Points to** box, type or paste the **Destination or Points to Address** that you recorded in the previous step.
5. For a TXT record, it asks for **TTL** information, type **1** to set TTL to one hour. 

    For an MX record, it asks for a priority (or preference), type a number that is larger than the number you've specified for existing MX records. This can help prevent the new MX record from interfering with mail routing for the domain. Instead of a priority, you may see the following options: **Low**, **Medium**, **High**. In this case, choose **Low**.

6. Save your changes, and then sign out of your domain name registrar's website.

After you create either the TXT record or the MX record and sign out of the website, return to the cloud service to verify the domain. Typically it takes about 15 minutes for your changes to take effect. But it can take up to 72 hours for the record that you created to propagate through the DNS system.

#### Verify your domain 

After the record that you created for your domain has propagated successfully through the DNS system, do the following to finish verifying your domain with Azure AD.

1. In the portal, click **Domains**.
2. In the **Domains** list, find the domain that you're verifying, and then based on the portal you are using, click either **Click to verify domain** or **Verify**.
3. Follow the instructions provided to complete the verification process.
    - If domain verification succeeds, you will be notified that your domain has been added to your account.
    - If domain verification fails, then the changes that you made at the domain registrar might need more time to propagate. Cancel the verification process, and return later to try the verification again.

If it has been more than 72 hours since you made the changes to your domain, sign in to the domain registrar's website and verify that you entered the alias information correctly. If you entered the information incorrectly, you must remove the incorrect DNS record and create a new one with the correct information by using the procedures in this topic.

After you've verified your domain, you can configure your domain to work with your accounts.

## How can I change the primary domain name for users?

After you add your domain name to Azure AD, you can change the domain name that should show as the default when you create a new user account. To do this, follow these steps.

1. On the portal page, in the top left corner, click your organization name.
2. Click **Edit**.
3. Choose a new default domain name, such as the custom domain name that you added.

## How can I remove a domain?

Before you remove a domain name, we recommend that you read the following information:

- The original contoso.onmicrosoft.com domain name that was provided for your directory when you signed up cannot be removed. 
- Any top-level domain that has subdomains associated with it cannot be removed until the subdomains have been removed. For example, you can't remove adatum.com if you have corp.adatum.com or another subdomain that uses the top-level domain name. For more information, see this [Support article](https://support.microsoft.com/kb/2787792/).
- Have you activated directory synchronization? If so, a domain was automatically added to your account that looks similar to this: contoso.mail.onmicrosoft.com. This domain name can't be removed.
- Before you can remove a domain name, you must first remove the domain name from all user or email accounts associated with the domain. You can remove all of the accounts, or you can bulk edit user accounts to change their domain name information and email addresses. For more information, see [Create or edit users in Azure AD](active-directory-create-users.md).
- If you are hosting a SharePoint Online site on a domain name that is being used for a SharePoint Online site collection, you must delete the site collection before you can remove the domain name.

To remove a domain name:

1. On the portal page, in the left pane, click **Domains**.
2. On the **Domains** page, select the domain name that you want to remove, and then click **Remove domain**.
3. On the **Remove domain** page, click **Yes**.

If your domain name can't be removed at this time, the status for the domain name is shown as Pending removal on the Domains page. If you continue to see this status, try again to remove the domain name.

## Troubleshooting problems after changing your domain name 

### I made changes to my domain, but it doesn't show the changes yet.

Because of the way updates move through the domain name system (DNS), it can take up to 72 hours before the changes you make at a domain registrar or hosting provider fully propagate through the Internet and you can begin using your domain name with your services.

In addition, the edits that you make at the domain registrar must be exactly correct. If you go back to correct an error, it may take several days for the updated setting to appear on the cloud service portal site.

How long will it take? It depends in part on the time to live (TTL) setting you've specified for the DNS record that you are replacing or updating. Until the TTL expires, Internet servers that have cached the previous data won't query the authoritative name server to request the new value. 

### I added a domain, verified it, and configured the DNS records on the domain registrar site. Why aren't new email accounts getting mail yet? 

After you have finished adding or updating DNS records for your domain, it can take up to 72 hours for the changes to take effect.

In addition, the settings information must be exactly correct on the domain registrar site. Double-check your settings, and make sure that you've allowed enough time for the changed DNS records to propagate through the system.

### I can't verify my domain name. How can I find out what's wrong? 

One way to track down issues is to use the domains troubleshooting wizard. To start the wizard, do the following: In the cloud service portal, on the Admin page, click **Domains**, and then double-click the domain name that you want to verify. Then, under **Troubleshooting**, click **Troubleshoot domain**. 

The troubleshooting wizard asks you for information about where you are in the verification process, and then provides you with information to help you complete the verification.

### I added and verified my domain, but the new domain name isn't working for existing users' email addresses. 

If you add your custom domain name to the cloud service after you have already added user accounts, you may have to make updates to use the new domain name. For example, you will need to edit your users' accounts to set their email addresses to use your custom domain. 

## What's next

- [Azure AD Forum](https://social.msdn.microsoft.com/Forums/home?forum=WindowsAzureAD)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/azure)
- [Sign up for Azure as an organization](sign-up-organization.md)
- [Manage domains in Azure AD](https://msdn.microsoft.com/library/azure/dn919677.aspx) 