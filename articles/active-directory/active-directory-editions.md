<properties
	pageTitle="Azure Active Directory editions | Microsoft Azure"
	description="A topic that explains choices for free and paid editions of Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/28/2015"
	ms.author="markvi"/>

# Azure Active Directory editions

Azure Active Directory is a service that provides comprehensive identity and access management capabilities in the cloud. It combines directory services, advanced identity governance, application access management and a rich standards-based platform for developers. For more information, [see this video](http://azure.microsoft.com/documentation/videos/teched-europe-2014-cloud-identity-microsoft-azure-active-directory-explained/).

Built on top of a large set of free capabilities in Microsoft Azure Active Directory, Azure Active Directory Premium and Basic editions provide a set of more advanced features to empower enterprises with more demanding identity and access management needs. For the pricing options for these editions, see [Azure Active Directory Pricing](http://azure.microsoft.com/pricing/details/active-directory/). When you subscribe to Azure, you get your choice of the following free and paid editions of Azure Active Directory:

- **Free** - The Free edition of Azure Active Directory is part of every Azure subscription. There is nothing to license and nothing to install. With it, you can manage user accounts, synchronize with on-premises directories, get single sign-on across Azure, Office 365, and thousands of popular SaaS applications like Salesforce, Workday, Concur, DocuSign, Google Apps, Box, ServiceNow, Dropbox, and more.
- **Basic** - Azure Active Directory Basic edition provides application access and self-service identity management requirements for task workers with cloud-first needs. With the Basic edition of Azure Active Directory, you get all the capabilities that Azure Active Directory Free has to offer, plus group-based access management, self-service password reset for cloud applications, Azure Active Directory application proxy (to publish on-premises web applications using Azure Active Directory), customizable environment for launching enterprise and consumer cloud applications, and an enterprise-level SLA of 99.9 percent uptime.
    An administrator who is licensed for the Azure Active Directory Basic edition can also activate an Azure Active Directory Premium trial.
- **Premium** - With the Premium edition of Azure Active Directory, you get all of the capabilities that the Azure Active Directory Free and Basic editions have to offer, plus additional feature-rich enterprise-level identity management capabilities explained below.

To sign up and start using Active Directory Premium today, see [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md).

> [AZURE.NOTE]
Azure Active Directory Premium and Azure Active Directory Basic are not currently supported in China. Please contact us at the [Azure Active Directory Forum](http://feedback.azure.com/forums/169401-azure-active-directory) for more information.

## Features in Azure Active Directory Basic

Active Directory Basic edition is a paid offering of Azure Active Directory and includes the following features:

- **Company branding** - To make the end user experience even better, you can add your company logo and color schemes to your organization’s Sign In and Access Panel pages. Once you’ve added your logo, you also have the option to add localized versions of the logo for different languages and locales.
    For more information, see [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md).
- **Group-based application access** - Use groups to provision users and assign user access in bulk to thousands of SaaS applications. These groups can either be created solely in the cloud or you can leverage existing groups that have been synced in from your on-premises Active Directory.
    For more information, see [Assign access for a group to a SaaS application in Azure AD](active-directory-accessmanagement-group-saasapps.md).
- **Self-service password reset** - Azure has always allowed directory administrators to reset passwords. With Azure Active Directory Basic, you can now reduce helpdesk calls when your users forget a password by giving all users in your directory the capability to reset their password, using the same sign in experience they have for Office 365.
    For more information, see [Manage your passwords from anywhere](active-directory-passwords.md).
- **Enterprise SLA of 99.9%** - We guarantee at least 99.9% availability of the Azure Active Directory Basic service.
- [**How to provide secure remote access to on-premises applications**](active-directory-application-proxy-get-started.md) - Give your employees secure access to on-premises applications like SharePoint and Exchange/OWA from the cloud using Azure Active Directory.

## Features in Azure Active Directory Premium

Active Directory Premium edition is a paid offering of Azure Active Directory and includes all of the features of the Free and Basic editions plus the following features:

- **Self-service group management** - Azure Active Directory Premium simplifies day-to-day administration of groups by enabling users to create groups, request access to other groups, delegate group ownership so others can approve requests and maintain their group’s memberships.

    For more information, see [Self-service group management for users in Azure AD](https://msdn.microsoft.com/library/azure/dn641267.aspx).

- **Advanced security reports and alerts** – Monitor and protect access to your cloud applications by viewing detailed logs showing more advanced anomalies and inconsistent access pattern reports. Advanced reports are machine learning-based and can help you gain new insights to improve access security and respond to potential threats.

    For more information, see [View your access and usage reports](active-directory-view-access-usage-reports.md).

- **Multi-Factor Authentication** - Multi-Factor Authentication is now included with Premium and can help you to secure access to on-premises applications (VPN, RADIUS, etc.), Azure, Microsoft Online Services like Office 365 and Dynamics CRM Online, and thousands of Non-MS Cloud services pre-integrated with Azure Active Directory. Simply enable Multi-Factor Authentication for Azure Active Directory identities, and users will be prompted to set up additional verification the next time they sign in.

    For more information, see [What is Azure Multi-Factor Authentication?](multi-factor-authentication.md)th

- **Microsoft Identity Manager (MIM)** - Premium comes with the option to grant rights to use a MIM server (and CALs) in your on-premises network to support any combination of Hybrid Identity solutions. This is a great option if you have a variation of on-premises directories and databases that you want to sync directly to Azure Active Directory. There is no limit on the number of FIM servers you can use, however, MIM CALs are granted based on the allocation of an Azure Active Directory premium user license.

    For more information, see [Deploy MIM 2010 R2](https://www.microsoft.com/server-cloud/products/forefront-identity-manager/features.aspx).

- **Enterprise SLA of 99.9%** - We guarantee at least 99.9% availability of the Azure Active Directory Premium service.

    For more information, see [Active Directory Premium SLA](http://azure.microsoft.com/support/legal/sla/).

- **Password reset with write-back** - Self-service password reset can be written back to on-premises directories.

- [Azure Active Directory Connect Health](active-directory-aadconnect-health.md): monitor the health of your on premises Active Directory infrastructure and get usage analytics.



## Comparing Free, Basic, and Premium editions

<br>
Available in edition: ![Checklist](./media/active-directory-editions/ic195031.png)


<table>
	<tr>
		<th>&nbsp;</th>
		<th>Features </th>
		<th>Free edition </th>
		<th>Basic edition </th>
		<th>Premium edition </th>
	</tr>
	<tr>
		<td rowspan="8">
		<p>Common features</p>
		</td>
		<td>
		<p>Directory as a service</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /><br />
		Up to 500K objects [1]</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /><br />
		No object limit</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /><br />
		No object limit</p>
		</td>
	</tr>
	<tr>
		<td>
		<p>User and group management using UI or Windows PowerShell cmdlets</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Device registration</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Access Panel portal for SSO-based user access to SaaS and custom applications</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /><br />
		Up to 10 apps per user [2]</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /><br />
		Up to 10 apps per user [2]</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /><br />
		No app limit</p>
		</td>
	</tr>
	<tr>
		<td>
		<p>User-based application access management and provisioning</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Self-service password change for cloud users</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Azure AD Connect – For syncing between on-premises directories and Azure 
		Active Directory</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Standard security reports</p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td rowspan="5">
		<p>Premium and Basic features</p>
		</td>
		<td>
		<p>High availability SLA uptime (99.9%)</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Group-based application access management and provisioning</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Customization of company logo and colors to the Sign In and Access Panel 
		pages</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Self-service password reset for cloud users</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Application Proxy: Secure Remote Access and SSO to on-premises web applications</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td rowspan="9">
		<p>Premium-only features</p>
		</td>
		<td>
		<p>Advanced application usage reporting</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Self-service group management for cloud users</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Self-service password reset with on-premises write-back</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Microsoft Identity Manager (MIM) user licenses – For on-premises identity 
		and access management</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /> [3]</p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Advanced anomaly security reports (machine learning-based)</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>
		<a href="http://channel9.msdn.com/Series/EMS/Azure-Cloud-App-Discovery">
		Cloud app discovery</a> </p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Multi-Factor Authentication service for cloud users</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>Multi-Factor Authentication server for on-premises users</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
	<tr>
		<td>
		<p>
		<a href="https://msdn.microsoft.com/en-us/library/azure/dn906722.aspx">Azure 
		Active Directory Connect Health</a> to monitor the health of on-premises 
		Active Directory infrastructure, and get usage analytics.</p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p></p>
		</td>
		<td>
		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img id="2b05dce3-938f-4168-9b8f-1f4398cbdb9b" alt="Checklist" src="./media/active-directory-editions/ic195031.png" title="Checklist" xmlns="" /></p>
		</td>
	</tr>
</table>


[1] The 500k object limit does not apply for Office 365, Microsoft Intune or any other Microsoft online service that relies on Azure Active Directory for directory services.

[2] With Azure Active Directory Free and Azure Active Directory Basic, end users who have been assigned access to each SaaS app, can see up to 10 apps in their Access Panel and get SSO access to them (assuming they have first been configured with SSO by the admin). Admins can configure SSO and assign user access to as many SaaS apps as they want with Free, however end users will only see 10 apps in their Access Panel at a time.

[3] Microsoft Identity Manager Server software rights are granted with Windows Server licenses (any edition). Because Microsoft Identity Manager runs on the Windows Server operating system, as long as the server is running a valid, licensed copy of Windows Server, then Microsoft Identity Manager can be installed and used on that server. No other separate license is required for Microsoft Identity Manager Server.



<br>
<br>









## Features currently in public preview

The following features are currently in public preview and will be added soon:

- [Administrative units](https://msdn.microsoft.com/library/azure/dn832057.aspx): a new Azure Active Directory container of resources that can be used for delegating administrative permissions over subsets of users and applying policies to a subset of users.
- [Add your own SaaS applications](https://msdn.microsoft.com/library/azure/dn893637.aspx) to Azure Active Directory.
- Password rollover for Facebook, Twitter, and LinkedIn. For more information, read [this article](http://blogs.technet.com/b/ad/archive/2015/02/20/azure-ad-automated-password-roll-over-for-facebook-twitter-and-linkedin-now-in-preview.aspx).
- Dynamic group membership. For more information, see [this article](https://msdn.microsoft.com/library/azure/dn913807.aspx).
- [Conditional Access](https://msdn.microsoft.com/library/azure/dn906877.aspx): Multifactor Authentication per application.
- HR application integration: Workday
- Privileged Identity Management: Privileged identity management provides improved oversight to help meet service level agreements and regulatory compliance requirements.
- Self-service application requests: Administrators can provide a list of SaaS apps to users from which so that users can choose the ones they want to use, and the apps either will be available immediately or after approval.
- Azure reporting API: data for every security report of Azure Active Directory will be available to other monitoring or SIEM tools.


## What's next

- [Getting started with Azure Active Directory Premium](active-directory-get-started-premium.md)
- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
- [View your access and usage reports](active-directory-view-access-usage-reports.md)