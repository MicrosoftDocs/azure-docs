<properties umbracoNaviHide="0" pageTitle="How To Configure Cloud Services" metaKeywords="Windows Azure cloud services, cloud service, configure cloud service" metaDescription="Learn how to configure Windows Azure cloud services." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />

<div chunk="../chunks/identity-left-nav.md" />

<h1 id="configurecloudservice">Sign up for Windows Azure as an organization</h1>

<div chunk="../../Shared/Chunks/disclaimer.md" />

Until recently, you could only sign up for a new Windows Azure subscription using your Microsoft account (Windows Live ID). Windows Azure now supports using either of the following two account methods to sign up:

* **Microsoft accounts** (created by you for personal use) - Provide access to all consumer-oriented Microsoft products and cloud services, such as Outlook (Hotmail), Messenger, SkyDrive, MSN, Xbox LIVE, or Office Live. Signing up for Outlook automatically creates a Microsoft account with an @Outlook.com address. Once created, a Microsoft account can be used to access consumer-related Microsoft cloud services and/or Windows Azure. [Learn more](http://windows.microsoft.com/en-US/windows-live/sign-in-what-is-microsoft-account)

* **Organizational accounts** (issued by an admin for business/academic use) - Provide access to all small, middle and enterprise business-level Microsoft cloud services, such as Windows Azure, Windows Intune, or Office 365. When you sign up to either one of these services as an organization, a cloud based tenant is automatically provisioned in Windows Azure Active Directory to represent your organization. [Learn more](http://technet.microsoft.com/en-us/library/jj573650) 

	Once this tenant has been created, an admin can then issue organizational accounts to each of its employees/students and assign licenses to those accounts based on which cloud service subscriptions they need access to, such as Windows Azure. 

	*Want to sign up for Windows Azure as an organization?* **Sign up now**

<h2>What is Windows Azure Active Directory?</h2>

In much the same way that Active Directory is a service made available to customers through the Windows Server operating system to manage their on-premises directory, Windows Azure Active Directory (Windows Azure AD) is a service that is made available through Windows Azure so that you can manage your organization’s cloud directory. [Learn more](http://technet.microsoft.com/en-us/library/hh967619)

Because it is your organization’s cloud directory, you decide who your users are, what information to keep in the cloud, who can use the information or manage it, and what applications or services are allowed to access that information. When you use Windows Azure AD, it is Microsoft’s responsibility to keep Active Directory running in the cloud with high scale, high availability, and integrated disaster recovery, while fully respecting your requirements for the privacy and security of your organization’s information.

<h3>Integration with Active Directory on-premises</h3>

If your organization already uses Active Directory on-premises, you can use Windows Azure AD’s directory integration capabilities, such as directory sync and single sign-on, to further extend the reach of your existing on-premises identities into the cloud for an improved admin and end user experience. [Learn more](http://technet.microsoft.com/en-us/library/jj573653)