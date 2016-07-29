<properties
	pageTitle="Azure Multi-Factor Authentication FAQ"
	description="Provides a list of frequently asked questions and answers related to Azure Multi-Factor Authentication. Multi-Factor Authentication is a method of verifying a user's identity that requires more than a user name and password. It provides an additional layer of security to user sign-in and transactions."
	services="multi-factor-authentication"
	documentationCenter=""
	authors="billmath"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="multi-factor-authentication"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/12/2016"
	ms.author="billmath"/>

# Azure Multi-Factor Authentication FAQ


This FAQ answers common questions about Azure Multi-Factor Authentication and using the Multi-Factor Authentication service, including questions about the billing model and usability.

## General

**Q: How can I get help with Azure Multi-Factor Authentication?**

- [Search the Microsoft Support Knowledge Base](https://www.microsoft.com/en-us/Search/result.aspx?form=mssupport&q=phonefactor&form=mssupport)

  Search the Knowledge Base for solutions to common technical issues.

- [Microsoft Azure Active Directory forums](https://social.msdn.microsoft.com/Forums/azure/home?forum=WindowsAzureAD)

  Search for and browse technical questions and answers from the community, or ask your own question in the [Azure Active Directory forums](https://social.msdn.microsoft.com/Forums/azure/newthread?category=windowsazureplatform&forum=WindowsAzureAD&prof=required).

- [Password reset](mailto:phonefactorsupport@microsoft.com)

  If you're a legacy PhoneFactor customer and you have questions or need help resetting a password, use the [password reset](mailto:phonefactorsupport@microsoft.com) link to open a support case.

- [Azure Multi-Factor Authentication Server (PhoneFactor) support](https://support.microsoft.com/oas/default.aspx?prid=14947)
  
  Use this link to contact a Microsoft support professional. They’ll ask you a few questions to help you determine your support options, which might include email, online submission, or phone support.



**Q: How does Azure Multi-Factor Authentication Server handle user data?**

When you use Multi-Factor Authentication Server, a user’s data is stored only on the on-premises servers. No persistent user data is stored in the cloud. When the user performs two-factor authentication, Multi-Factor Authentication Server sends data to the Azure Multi-Factor Authentication cloud service for authentication. When authentication requests are sent to the cloud service, the data from the fields in the following list are sent in the request and logs so that they are available in the customer's authentication and usage reports. Some of the fields are optional, and you can configure them in Multi-Factor Authentication Server. Communication from Multi-Factor Authentication Server to the Multi-Factor Authentication cloud service uses Secure Sockets Layer (SSL) or Transport Layer Security (TLS) over port 443 outbound. Data fields included in two-factor authentication logs are as follows:

- **Unique ID** (either user name or on-premises Multi-Factor Authentication Server ID)
- **First and Last Name** (optional)
- **Email Address** (optional)
- **Phone Number** (when using a voice call or SMS authentication)
- **Device Token** (when using mobile app authentication)
- **Authentication Mode**
- **Authentication Result**
- **Multi-Factor Authentication Server Name**
- **Multi-Factor Authentication Server IP**
- **Client IP** (if available)



In addition to these fields, the authentication result (success or denial) and the reason for any denials also are stored with the authentication data and are available in authentication and usage reports.




## Billing

**Q: Will my organization be charged for phone calls or text messages used to authenticate my users?**

All costs are rolled into the per-user or per-authentication cost of the service. An organization is not charged for individual phone calls placed or text messages sent to users through Azure Multi-Factor Authentication. Phone owners might incur roaming-related or other costs from phone service carriers to receive the phone calls or text messages.

**Q: How is an organization billed for Azure Multi-Factor Authentication?**

Azure Multi-Factor Authentication is available as a standalone service with per-user and per-authentication billing options, or bundled with Azure Active Directory Premium, Enterprise Mobility Suite, or Enterprise Cloud Suite. The standalone service is available on a consumption basis that is billed monthly against an organization's Azure monetary commitment, or as a per-user annual license available through a Microsoft Enterprise Agreement, the Microsoft Open License Program, the Microsoft Cloud Solution Provider (CSP) program, or Direct.

>[AZURE.IMPORTANT]
>The Australia Regions are available to customers with a business presence in Australia or New Zealand.

Billing model  | Price
------------- | ------------- |
Per-user consumption (Azure monetary commitment)| $1.40 per month (unlimited authentications)
Per-authentication consumption (Azure monetary commitment)|$1.40 per 10 authentications
Per-user annual license (direct)|$1.40 per month (unlimited authentications)
Per-user annual license (volume licensing)|Contact your [Enterprise Agreement representative](https://www.microsoft.com/en-us/licensing/licensing-programs/enterprise.aspx)

**Q: Does the per-user billing model charge based on the number of users who are configured to use Multi-Factor Authentication or the number of users who perform verifications?**

Billing is based on the number of users configured to use Multi-Factor Authentication.

**Q: How does Multi-Factor Authentication billing work?**

When an organization uses the per-user or per-authentication consumption billing and usage model, the organization's administrator chooses the type of usage when the administrator creates a Multi-Factor Authentication provider in the Azure classic portal. It's a resource that is billed to the organization’s Azure subscription, just like virtual machines, websites, and so on. When you use the license model, Azure Multi-Factor Authentication licenses are purchased and then assigned to users, just like for Office 365 and other subscription products.

**Q: Is there a free version of Azure Multi-Factor Authentication for administrators?**

A subset of Azure Multi-Factor Authentication capabilities, called Multi-Factor Authentication for Azure Administrators, is offered at no cost to members of the Azure Global Administrators group when a consumption-based Azure Multi-Factor Authentication provider has not been linked to the corresponding instance of Azure Active Directory. Using a Multi-Factor Authentication provider upgrades all admins and users in the directory who are configured to use Multi-Factor Authentication to the full version of Azure Multi-Factor Authentication.

**Q: Is there a free version of Azure Multi-Factor Authentication for Office 365 users?**

A subset of Azure Multi-Factor Authentication capabilities, called Multi-Factor Authentication for Office 365, is offered at no cost to users who have an Office 365 license assigned, when a consumption-based Azure Multi-Factor Authentication provider has not been linked to the corresponding instance of Azure Active Directory. Using the Multi-Factor Authentication provider upgrades all admins and users in the directory who are configured to use Multi-Factor Authentication to the full version of Azure Multi-Factor Authentication.

**Q: Can my organization switch between per-user and per-authentication consumption billing models at any time?**

Your organization chooses a billing model when it creates a resource. You cannot change a billing model after the resource is provisioned. You can, however, create a new Multi-Factor Authentication resource to replace the original. Note that user settings and configuration options cannot be transferred to the new resource.

**Q: Can my organization switch between the consumption billing and license model at any time?**

Your organization can purchase Azure Multi-Factor Authentication, Azure Active Directory Premium, Enterprise Mobility Suite, and Enterprise Cloud Suite licenses at any time. When licenses are added to a directory that already has a per-user Azure Multi-Factor Authentication provider, consumption-based billing is decremented by the number of licenses owned. If all users configured to use Multi-Factor Authentication have licenses assigned, the administrator can delete the Azure Multi-Factor Authentication provider. An organization cannot mix per-authentication consumption billing with a license model. When a per-authentication Multi-Factor Authentication provider is linked to a directory, the organization is billed for all Multi-Factor Authentication verification requests, regardless of any licenses owned.

**Q: Does my organization have to use and synchronize identities to use Azure Multi-Factor Authentication?**

When an organization uses a consumption-based billing model, Azure Active Directory is not required. Linking a Multi-Factor Authentication provider to a directory is optional. If your organization is not linked to a directory, it can deploy Azure Multi-Factor Authentication Server or the Azure Multi-Factor Authentication SDK on-premises. Azure Active Directory is required for the license model because licenses are added to the directory when you purchase and assign them to users in the directory.


## Usability

**Q: What does a user do if they don’t receive a response on their phone, or if the phone is not available to the user?**

If the user had previously configured a backup phone, they should try again and select that phone when prompted on the sign-in page. If the user doesn’t have another method configured, the user should contact the organization's administrator and ask the admin to update the number assigned to the user's primary phone, either mobile or office.


**Q: What does the administrator do if a user contacts the administrator about an account that the user can no longer access?**

The administrator can reset the user's account by asking them to go through the registration process again. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md).

**Q: What does an administrator do if a user's phone that is using app passwords is lost or stolen?**

The administrator can delete all of the user's app passwords to prevent unauthorized access. After the user has a replacement device, the user can recreate the passwords. Learn more about [managing user and device settings with Azure Multi-Factor Authentication in the cloud](multi-factor-authentication-manage-users-and-devices.md).

**Q: What if the user can't sign in to non-browser apps?**

- A user who is configured to use Multi-Factor Authentication requires an app password to sign in to some non-browser apps.
- A user needs to clear (delete) sign-in information, restart the app, and sign in by using their user name and app password.

Get more information about creating app passwords and other [help with app passwords](multi-factor-authentication-end-user-app-passwords.md).


>[AZURE.NOTE] Modern authentication for Office 2013 clients
>
> Office 2013 clients (including Outlook) support new authentication protocols. You can configure Office 2013 to support Multi-Factor Authentication. After you configure Office 2013, app passwords are not required for Office 2013 clients. For more information, see the [Office 2013 modern authentication public preview announcement](https://blogs.office.com/2015/03/23/office-2013-modern-authentication-public-preview-announced/).

**Q: What does a user do if the user does not receive a text message, or if the user replies to a two-way text message but the verification times out?**

The Azure Multi-Factor Authentication service sends text messages through SMS aggregators. Many factors might affect the reliability of text message delivery and receipt, including the aggregator that is used, the destination country, the user's mobile phone carrier, and the signal strength. Because of this, delivery of text messages and receipt of SMS replies in two-way SMS is not guaranteed. We recommend using one-way SMS rather than two-way SMS when possible. One-way SMS is more reliable and it prevents users from incurring global SMS charges from replying to a text message that was sent from another country.

Text message verifications also are more reliable in some countries or regions, such as the United States and Canada. We encourage users who experience difficulty reliably receiving text messages when using Azure Multi-Factor Authentication to select the mobile app or phone call method instead. The mobile app method of authentication is great because the user can receive mobile app notifications both over cellular and Wi-Fi connections. In addition, the mobile app passcode is displayed even when the device has no signal at all. The Azure Authenticator app is available for [Windows Phone](http://www.windowsphone.com/store/app/azure-authenticator/03a5b2bf-6066-418f-b569-e8aecbc06e50), [Android](https://play.google.com/store/apps/details?id=com.azure.authenticator), and [IOS](https://itunes.apple.com/us/app/azure-authenticator/id983156458).

**Q: Can I use hardware tokens with Azure Multi-Factor Authentication Server?**

If you are using Azure Multi-Factor Authentication Server, you can import third-party Open Authentication (OATH) time-based, one-time password (TOTP) tokens, and then use them for Multi-Factor Authentication. We support the import of third-party OATH TOTP tokens in an older Portable Symmetric Key Container (PSKC) format that Gemalto can produce for their tokens, and we support importing tokens in CSV format. If you import tokens in CSV format, the CSV file must contain a serial number, a secret key in Base32 format, and a time interval (generally 30 seconds).

You can use ActiveIdentity tokens that are OATH TOTP tokens if you can put the secret key file in a CSV file that you can import to Azure Multi-Factor Authentication Server. You can use OATH tokens with Active Directory Federation Services (ADFS); Remote Authentication Dial-In User Service (RADIUS), when the client system can process access challenge responses; and Internet Information Server (IIS) forms-based authentication.

**Q: Can I use Azure Multi-Factor Authentication Server to secure Terminal Services?**

Yes, but if you are using Windows Server 2012 R2 or a later version, you can do this only by using Remote Desktop Gateway (RD Gateway).

Security changes in Windows Server 2012 R2 have changed the way that Azure Multi-Factor Authentication Server connects to the Local Security Authority (LSA) security package in Windows Server 2012 and earlier versions. For versions of Terminal Services in Windows Server 2012 or earlier, you can simply [secure an application with Windows Authentication](multi-factor-authentication-get-started-server-windows.md#to-secure-an-application-with-windows-authentication-use-the-following-procedure). If you are using Windows Server 2012 R2, you will need RD Gateway.

**Q: Why would a user receive a Multi-Factor Authentication call from an anonymous caller after setting up caller ID?**

When Multi-Factor Authentication calls are placed through the public telephone network, sometimes they are routed through a carrier that doesn't support caller ID. Because of this, caller ID is not guaranteed, even though the Multi-Factor Authentication system always sends it.


## Errors

**Q: What does a user do if the user sees an “Authentication request is not for an activated account” error message when the user authenticates by using mobile app notifications?**

Follow this procedure:

1. Go to [your Azure portal profile](https://account.activedirectory.windowsazure.com/profile/) and sign in with your organizational account.
2. If needed, click **Other verification options**, and then click a different option to use for account verification.
3. Click **Additional Security Verification**.
4. Remove the existing account from the mobile app.
5. Click **Configure**, and then follow the instructions to reconfigure the mobile app.




**Q: What does a user do if the user sees a 0x800434D4L error message when the user attempts to sign in by using a non-browser application?**

Currently, a user can use additional security verification only with applications and services that the user can access through the user's browser. Non-browser applications (also referred to as *rich client applications*) that are installed on a local computer, such as Windows PowerShell, will not work with accounts that require additional security verification. In this case, the user might see the application generate an 0x800434D4L error.

A workaround for this is to have separate user accounts for admin-related and non-admin operations. Later, you can link mailboxes between your admin account and non-admin account so that you can sign in to Outlook by using your non-admin account. For more details about this, learn how to [give an administrator the ability to open and view the contents of a user's mailbox](http://help.outlook.com/141/gg709759.aspx?sl=1).
