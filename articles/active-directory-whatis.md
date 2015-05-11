<properties
	pageTitle="What is Azure Active Directory?"
	description="Use Azure Active Directory to extend your existing on-premises identities into the cloud or develop Azure AD integrated applications."
	services="active-directory"
	documentationCenter=""
	authors="curtand"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/05/2015"
	ms.author="curtand"/>


# What is Azure Active Directory?


[How does it work?](active-directory-works.md)<br>
[Get started](active-directory-get-started.md)<br>
[Next steps](active-directory-next-steps.md)<br>
[Learn more](active-directory-learn-map.md)

Azure Active Directory (Azure AD) provides an easy way for your business to extend your on-premises investments to take advantage of cloud services, with the flexibility and security that Active Directory has always provided. It is a cloud platform that solves cloud-era problems by extending the identity infrastructure you already have, and you don't need to move anything. You can continue to benefit from your existing investments and on-premises capabilities while leveraging Azure AD to gain identity and access management in the cloud.

With Azure AD, you can centrally control access to applications and resources, easily add existing resources (cloud services or on-premises applications), and integrate applications you are developing.
- Your users can get self-service capabilities and single sign-on access to all their applications, so they won’t need to know where to find each app or have to remember a separate password.
- Your business can collaborate in the cloud with business partners, suppliers, and business customers that you can invite into SharePoint sites (or participate in their SharePoint sites).

With Azure AD, you can manage everything from one place and have that control reflected both in the cloud and on-premises. There’s no duplication of administration; Azure AD plugs right into what you already have. [Learn more](active-directory-aadconnect.md).




> [AZURE.NOTE] To use Azure Active Directory, you need an Azure account. If you don't have an account, you can [sign up for a free Azure account](http://azure.microsoft.com/pricing/free-trial/).


## What can Azure Active Directory do for me?

Because it is a comprehensive service, Azure AD provides different benefits to people in different roles within an organization.

- If you are a business decision maker, use Azure AD to achieve the promise of cloud applications and a mobile workforce with confidence that your governance requirements are being met.
- If you are a service provider, use Azure AD to easily address your identity and access needs, connecting your services to your customers’ existing identity solutions while also reaching Microsoft Azure and Office 365 customers. Azure AD can also address all of your back-office access needs, so whether in-house or outsourced, you can be confident the right people have the right access.
- If you are an IT professional, use Azure AD to increase your control and visibility of operations at "cloud speed." With Azure AD, you will know what people are using and empower them through self-service offerings.
<br>
<br>

![][1]

##Top eight things you should know about Azure AD

### Set rules for access to cloud resources

In addition, you can set rules and policies that control who has access to cloud applications and resources, and under what conditions. For example, you can require Multi-Factor Authentication (MFA), and manage access based on the device or location. [Learn more about Azure MFA](multi-factor-authentication.md).

### Single sign-on to any app

Azure Active Directory provides secure single sign-on to cloud and on-premises applications including Microsoft Office 365 and thousands of SaaS applications such as Salesforce, Workday, DocuSign, ServiceNow, and Box. [Learn more about SaaS apps](http://azure.microsoft.com/marketplace/active-directory/).

### Works with any device

Users can launch applications from a personalized web-based access panel, mobile app, Office 365, or custom company portals using their existing work credentials—and have the same experience whether they’re working on iOS, Mac OS X, Android, or Windows devices.

### Set rules for external access

External users can reach into the on-premises network behind the firewall, securely, by using the built-in application proxy. All of the rules and policies you set, including multi-factor authentication, can be enforced for access to cloud applications or to legacy on-premises applications using Application Proxy - without the need to rewrite them or expose them directly on the internet.  [Learn more about Azure AD Application Proxy](https://msdn.microsoft.com/library/azure/dn768219.aspx).

### Monitor your users' access

Finally, Azure AD provides information about what is going on in your organization at your fingertips. With advanced reporting and analytics, you get unique information about your users’ access. For example, using application discovery, you can find out which applications are actively used in your organization. [Learn more about Azure AD cloud app discovery](https://appdiscovery.azure.com/).

### Advanced reporting, auditing, and analytics
Azure AD provides a number of daily usage and access reports for administrators ([Azure AD reports](active-directory-view-access-usage-reports.md)), and custom reporting and data deep dives are available using the reporting API ([Azure AD reporting API](active-directory-reporting-api-getting-started.md)). Even more reports are available in the paid editions of Azure AD, including auditing of privileged actions ([Azure AD auditing](active-directory-view-access-usage-reports.md)).

### A simple and secure experience for everyone

Examples:
- Users get a simple experience, putting their profiles, applications, and their ability to manage their access to resources in one place, without any need for specialized training. Multi-factor authentication, SaaS applications, hybrid tools, and self-service capabilities are all ready to go.

- Administrators have access to the Azure AD management portal and Windows PowerShell for comprehensive management.

- Developers have a consistent set of RESTful APIs and easy access to publishing and consuming application interfaces.

### Pick your flavor

Azure AD comes in three flavors:

- The Free edition, which is just a cloud directory service.
- The Basic edition, which is a cloud directory service that also provides SaaS app access.
- The Premium edition, which is a comprehensive, rule-driven, self-service managed directory service solution.

To check out features described here, activate your [free Azure trial](http://azure.microsoft.com/trial/get-started-active-directory/).

[Learn more about Azure AD editions](active-directory-editions.md)


## Additional Resources

* [Sign up for Azure as an organization](sign-up-organization.md)
* [Azure Identity](fundamentals-identity.md)

<!--Image references-->
[1]: ./media/active-directory-whatis/Azure_Active_Directory.png
