<properties
	pageTitle="Getting started with Azure Active Directory Premium"
	description="A topic that explains how to sign up for Azure Active Directory Premium edition through the Volume Licensing web site."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila" 
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="05/25/2016"
	ms.author="markvi"/>

# Getting started with Azure Active Directory Premium


To sign up for Active Directory Premium, you have several options: 

**Azure or Office 365** - As an Azure or Office 365 subscriber, you can buy Active Directory Premium online. 
For detailed steps, see [How to Purchase Azure Active Directory Premium - Existing Customers](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/How-to-Purchase-Azure-Active-Directory-Premium-Existing-Customer) or [How to Purchase Azure Active Directory Premium - New Customers](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/How-to-Purchase-Azure-Active-Directory-Premium-New-Customers).  

**Enterprise Mobility Suite** - The Enterprise Mobility Suite is a cost effective way for organizations to use the following services together under one licensing plan: Active Directory Premium, Azure Rights Management, Microsoft Intune. For more information, see the [Enterprise Mobility Suite](https://www.microsoft.com/en-us/server-cloud/enterprise-mobility/overview.aspx) web site. To get e free 30-day trial, click [here](https://portal.office.com/Signup/Signup.aspx?OfferId=2E63A04D-BE0B-4A0F-A8CF-407C1C299221&dl=EMS&ali=1#0).


**Microsoft Volume Licensing** - Azure Active Directory Premium is available through a [Microsoft Enterprise Agreement](https://www.microsoft.com/en-us/licensing/licensing-programs/enterprise.aspx) (250 or more licenses) or the [Open Volume License](https://www.microsoft.com/en-us/licensing/licensing-programs/open-license.aspx) (5–250 licenses) program.


This topic shows you how to get started with an Azure Active Directory Premium you have purchased through the Volume Licensing program. If you are not yet familiar with the different editions of Azure Active Directory, see [Azure Active Directory editions](active-directory-editions.md).  

> [AZURE.NOTE]
Azure Active Directory Premium and Basic editions are available for customers in China using the worldwide instance of Azure Active Directory. Azure Active Directory Premium and Basic editions are not currently supported in the Microsoft Azure service operated by 21Vianet in China. For more information, contact us at the [Azure Active Directory Forum](https://feedback.azure.com/forums/169401-azure-active-directory/).




## Step 1: Sign up for Active Directory Premium

To sign up, see [How to purchase through Volume Licensing](http://www.microsoft.com/en-us/licensing/how-to-buy/how-to-buy.aspx).



## Step 2: Activate your license plan

Is this your first license plan purchase through the Enterprise Volume Licensing program from Microsoft?
In this case, you get a confirmation email when your purchase has been completed.
You need this email to activate your first license plan.

On any subsequent purchase for this directory, the licenses are automatically activated in the same directory.



**To activate your license plan, perform one of the following steps:**


1. To start the activation, click either **Sign In** or **Sign Up**.

    ![Sign in][1]



    - If you have an existing tenant, click **Sign In** to sign in with your existing administrator account. You need to sign in with the global administrator credentials from the directory where the licenses must be activated.

    - If you want to create a new Azure Active Directory tenant to use with your licensing plan, click **Sign Up** to open the **Create Account Profile** dialog.

        ![Create account profile][2]

When you are done, the following dialog shows up as confirmation for the activation of the license plan for your tenant.

![Confirmation][3]

## Step 3: Activate your Azure Active Directory access

If you have used Microsoft Azure before, you can proceed to [Step 4](#step-4-assign-license-to-user-accounts). 

When the licenses are provisioned to your directory, a **Welcome email** is sent to you. 
The email confirms that you can start managing your Azure Active Directory Premium or Enterprise Mobility Suite licenses and features. 

If you make an attempt to activate your access to Azure Active Directory prior to receiving the Welcome email, you get the following error message. 

![Access is not available][9]

If you Please try again in a few minutes once you have received the email.

New administrators in your subscription can also activate their access to the Azure classic portal through this link.






**To activate your Azure Active Directory access, perform the following steps:**

1. In your **Welcome email**, click **Sign In**. 
    
    ![Welcome email][4]

2. When you have signed in successfully, you need to complete a second factor authentication in form of a mobile verification:

    ![Mobile verification][5]

The activation can take a few minutes. Once your access is active, the brown bar disappears and you are able to click **Portal**.

![Please wait while we set up][6]

In this case, your Azure access is limited to Azure Active Directory.

![Azure capabilities][7]

You may already have had access to Azure from prior usage; in addition, you can upgrade your Access Azure Active Directory to full Azure access by activating additional Azure subscriptions. In these cases, the Azure classic portal has more capabilities.

![Azure capabilities][8]



## Step 4: Assign license to user accounts

Before you can start using the plan you purchased, you need to manually assign licenses to user accounts within your organization so that they can use the rich features provided with Premium. Use the following steps to assign licenses to users so they can use Azure Active Directory Premium features.

**To assign licenses to users, perform the following steps:**

1. Sign into the Azure classic portal as the global administrator of the directory you wish to customize.
2. Click **Active Directory**, and then select the directory where you want to assign licenses.
3. Select the **Licenses** tab, select **Active Directory Premium** or **Enterprise Mobility Suite**, and then click **Assign**.

    ![License plans][10]

4. In the dialog box, select the users you want to assign licenses to, and then click the check mark icon to save the changes.

    ![Assign licenses][11]

### License restrictions

Some license plans are subsets or supersets of other license plans. Typically, a user cannot be assigned a license plan that has already been assigned to them. If it is your intention to assign a license plan that is a superset, you need to first remove the subset license plan.

### License requirements

When you assign a license to a user, you can specify a primary usage location in the properties of their account. If a usage location is not specified, the tenant’s location is automatically assigned to the user.

![User location][12]

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
