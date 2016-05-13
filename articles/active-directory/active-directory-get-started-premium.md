<properties
	pageTitle="Getting started with Azure Active Directory Premium"
	description="A topic that explains how to sign up for Azure Active Directory Premium edition."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo" 
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="04/18/2016"
	ms.author="markvi"/>

# Getting started with Azure Active Directory Premium

Azure Active Directory comes in three editions: Free, Basic, and Premium. The Free edition is included with an Azure or Office 365 subscription. The Basic and Premium editions are available through a [Microsoft Enterprise Agreement](https://www.microsoft.com/en-us/licensing/licensing-programs/enterprise.aspx) or the [Open Volume License](https://www.microsoft.com/en-us/licensing/licensing-programs/open-license.aspx) program. Azure and Office 365 subscribers can also buy Active Directory Premium online. [Sign in here](https://portal.office.com/Commerce/Catalog.aspx) to buy it.

> [AZURE.NOTE]
Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](https://feedback.azure.com/forums/169401-azure-active-directory/).

Azure Active Directory Premium is also included in the **Enterprise Mobility Suite**. The Enterprise Mobility Suite is a cost effective way for organizations to use the following services together under one licensing plan:

- Active Directory Premium 
- Azure Rights Management
- Microsoft Intune


For more information, see the [Enterprise Mobility Suite](https://www.microsoft.com/en-us/server-cloud/enterprise-mobility/overview.aspx) web site.

To start using the Azure Active Directory Premium features today, follow the steps in the next sections. These steps do also apply to the Azure Active Directory Basic edition.

## Step 1: Sign up for Active Directory Premium

To sign up, see the [Volume Licensing](http://www.microsoft.com/en-us/licensing/how-to-buy/how-to-buy.aspx) web site.

## Step 2: Activate your license plan

When your first license plan purchase through the Enterprise Volume Licensing program from Microsoft has been completed, you get a confirmation email.
You need this email to activate your first license plan.
On any subsequent purchase for this directory, the licenses are automatically activated in the same directory.

To start the activation, click either **Sign In** or **Sign Up**.


![][1]

If you have an existing tenant, click **Sign In** to sign in with your existing administrator account. It is important that you sign in with the global administrator credentials from the directory where the licenses must be activated.

If you want to create a new Azure Active Directory tenant to use with your licensing plan, click **Sign Up** to open the **Create Account Profile** dialog.

![][2]

When you are done, the following dialog shows up as confirmation for the activation of the license plan for your tenant.

![][3]

## Step 3: Activate your Azure Active Directory access

When the licenses are provisioned to your directory, a **Welcome email** is sent to you. 
The email confirms that you can start managing your Azure Active Directory Premium or Enterprise Mobility Suite licenses and features. 

If you have used Microsoft Azure before, you can proceed to [http://manage.windowsazure.com](http://manage.windowsazure.com) to assign the new licenses (see [Step 4](#step-4-assign-license-to-user-accounts) for more details). 

If you are new to Microsoft Azure, you can either click **Sign In** in the email, or go to the [Access to Azure Active Directory activation page](https://account.windowsazure.com/signup?offer=MS-AZR-0110P). 
Both methods are taking you through a series of steps to help you access your directory through the Azure classic portal.

![][4]

When you have signed in successfully, you need to complete a second factor authentication screen by providing a mobile phone number and validating it. When you have completed the mobile verification, you are able to activate your access to Azure Active Directory by clicking **Sign Up**.

![][5]

The activation can take a few minutes. Once your access is active, the brown bar disappears and you are able to click **Portal**.

![][6]

In this case, your Azure access is limited to Azure Active Directory.

![][7]

You may already have had access to Azure from prior usage; in addition, you can upgrade your Access Azure Active Directory to full Azure access by activating additional Azure subscriptions. In these cases the Azure classic portal has more capabilities.

![][8]

If you attempt to activate your access to Azure Active Directory prior to receiving the Welcome email, you may experience the following error message. Please try again in a few minutes once you have received the email.

![][9]

New administrators in your subscription can also activate their access to the Azure classic portal through this link.

## Step 4: Assign license to user accounts

Before you can start using the plan you purchased, you need to manually assign licenses to user accounts within your organization so that they can use the rich features provided with Premium. Use the following steps to assign licenses to users so they can use Azure Active Directory Premium features.

To assign licenses to users:

1. Sign into the Azure classic portal as the global administrator of the directory you wish to customize.
2. Click **Active Directory**, and then select the directory where you want to assign licenses.
3. Select the **Licenses** tab, select **Active Directory Premium** or **Enterprise Mobility Suite**, and then click **Assign**.

    ![][10]

4. In the dialog box, select the users you want to assign licenses to, and then click the check mark icon to save the changes.

    ![][11]

## License restrictions

Some license plans are subsets or supersets of other license plans. Typically, a user cannot be assigned a license plan that has already been assigned to them. If it is your intention to assign a license plan that is a superset, you need to first remove the subset license plan.

## License requirements

When you assign a license to a user, you can specify a primary usage location in the properties of their account. If a usage location is not specified, the tenant’s location is automatically assigned to the user.

![][12]

The availability of services and features for a Microsoft cloud service varies by country or region. A service, such as Voice over Internet Protocol (VoIP), may be available in one country or region, and not available in another. Features within a service can be restricted for legal reasons in certain countries or regions. To see if a service or feature is available with or without restrictions, look for your country or region on license restrictions site of a service.

## What's next

- [Add company branding to your Sign In and Access Panel pages](active-directory-add-company-branding.md)
- [View your access and usage reports](active-directory-view-access-usage-reports.md)

<!--Image references-->
[1]: ./media/active-directory-get-started-premium/MOLSEmail.png
[2]: ./media/active-directory-get-started-premium/MOLSAccountProfile.png
[3]: ./media/active-directory-get-started-premium/MOLSThankYou.png
[4]: ./media/active-directory-get-started-premium/AADEmail.png
[5]: ./media/active-directory-get-started-premium/SignUppage.png
[6]: ./media/active-directory-get-started-premium/Subscriptionspage.png
[7]: ./media/active-directory-get-started-premium/Premiuminportal.png
[8]: ./media/active-directory-get-started-premium/Premiuminportal_large.png
[9]: ./media/active-directory-get-started-premium/Signuppage_oops.png
[10]: ./media/active-directory-get-started-premium/contosolicenseplan.png
[11]: ./media/active-directory-get-started-premium/Assignlicensespicker.png
[12]: ./media/active-directory-get-started-premium/Usagelocation.png
