---
title: Troubleshoot Azure EA portal access
description: This article describes some common issues that can occur with an Azure Enterprise Agreement (EA) in the Azure EA portal.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 01/02/2020
ms.topic: troubleshooting
ms.service: cost-management-billing
manager: boalcsva
---

# Troubleshoot Azure EA portal access

This article describes some common issues that can occur with an Azure Enterprise Agreement (EA). The Azure EA portal is used to manage enterprise agreement users and costs. You might come across these issues when you're configuring or updating Azure EA portal access.

## Issues adding an admin to an enrollment

There are different types of authentication levels for enterprise enrollments. When authentication levels are applied incorrectly, you might have issues when you try to sign in to the Azure EA portal.

You use the Azure EA portal to grant access to users with different authentication levels. An enterprise administrator can update the authentication level to meet security requirements of their organization.

### Authentication level types

- Microsoft Account Only - For organizations that want to use, create, and manage users through Microsoft accounts.
- Work or School Account - For organizations that have set up Active Directory with Federation to the Cloud and all accounts are on a single tenant.
- Work or School Account Cross Tenant - For organizations that have set up Active Directory with Federation to the Cloud and will have accounts in multiple tenants.
- Mixed Account - Allows you to add users with Microsoft Account and/or with a Work or School Account.

The first work or school account added to the enrollment determines the _default_, or _master_ domain. To add a work or school account with another tenant, you must change the authentication level under the enrollment to cross-tenant authentication.

To update the Authentication Level:

1. Sign in to the Azure EA portal as an Enterprise Administrator.
2. Click **Manage** on the left navigation panel.
3. Click the **Enrollment** tab.
4. Under **Enrollment Details**, select **Auth Level**.
5. Click the pencil symbol.
6. Click **Save**.

![Example showing authentication levels ](./media/ea-portal-troubleshoot/create-ea-authentication-level-types.png)

Microsoft accounts must have an associated ID created at [https://signup.live.com](https://signup.live.com/).

Work or school accounts are available to organizations that have set up Active Directory with federation and where all accounts are on a single tenant. Users can be added with work or school federated user authentication if the company's internal Active Directory is federated.

If your organization doesn't use Active Directory federation, you can't use your work or school email address. Instead, register or create a new email address and register it as a Microsoft account.

## Unable to access the Azure EA portal

If you get an error message when you try to sign in to the Azure EA portal, use the following the troubleshooting steps:

- Ensure that you're using the correct Azure EA portal URL, which is https://ea.azure.com.
- Determine if your access to the Azure EA portal was added as a work or school account or as a Microsoft account.
  - If you're using your work account, enter your work email and work password. Your work password is provided by your organization. You can check with your IT department about how to reset the password if you've issues with it.
  - If you're using a Microsoft account, enter your Microsoft account email address and password. If you've forgotten your Microsoft account password, you can reset it at [https://account.live.com/password/reset](https://account.live.com/password/reset).
- Use an in-private or incognito browser session to sign in so that no cookies or cached information from previous or existing sessions are kept. Clear your browser's cache and use an in-private or incognito window to open https://ea.azure.com.
- If you get an _Invalid User_ error when using a Microsoft account, it might be because you have multiple Microsoft accounts. The one that you're trying to sign in with isn't the primary email address.
Or, if you get an _Invalid User_ error, it might be because the wrong account type was used when the user was added to the enrollment. For example, a work or school account instead of a Microsoft account. In this example, you have another EA admin  add the correct account or you need to contact [support](https://support.microsoft.com/supportforbusiness/productselection?sapId=cf791efa-485b-95a3-6fad-3daf9cd4027c).
  - If you need to check the primary alias, go to [https://account.live.com](https://account.live.com). Then, click **Your Info** and then click **Manage how to sign in to Microsoft**. Follow the prompts to verify an alternate email address and obtain a code to access sensitive information. Enter the security code. Select **Set it up later** if you don't want to set up two-factor authentication.
  - You'll see the **Manage how to sign in to Microsoft** page where you can view your account aliases. Check that the primary alias is the one that you're using to sign in to the Azure EA portal. If it isn't, you can make it your primary alias. Or, you can use the primary alias for Azure EA portal instead.

## No activation email received

An activation email from the Azure EA portal is sent from *waep@microsoft.com*. If you didn't receive an activation email, check your spam or junk folder for the email. It's sent with _Invitation to View/Manage the Microsoft Azure service_subject_. It's sent to every newly added EA administrator.

If you're sure that you've been set up as the EA administrator, you don't have to wait to receive the activation email to sign in to the Azure EA portal. Instead, you can go to https://ea.azure.com and sign in with your email address (work, school, or Microsoft account) and your password.

## Azure EA Activation FAQ

This section of the article outlines solutions to common issues around Azure EA Activation.

### I would like to add a new EA administrator to my enrollment

A new enterprise admin can be added by existing enterprise admins. If you are the EA administrator, please sign in to the EA portal > Click **Manage** > Click **+ Add Administrator** in the top-right corner to add a new EA administrator. Please ensure you have their email address and a preferred sign-in method, such as via work/school authentication or Microsoft Live ID to have the users added.

If you are not the EA administrator, please reach out to your EA administrators in your company to request that they have you added to the enrollment. Once they have added you to the enrollment, you will receive an activation email.

However, if the EA administrators are not able to assist you, we will be able to add you on their behalf if you can provide us with:
- the enrollment number.
- email address to be added and authentication type (work/school/MS).
- an email approval from the EA administrator.

Once you have all the required information, please submit a request at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).

### I would like to update the first EA admin on the enrollment

The first EA admin can be updated in volume licensing service center by updating the notice contact and online admin on the portal. It will take about 24 hours for the EA portal to update. Once it is updated, the new EA admin will receive activation email.

If you do not have VLSC portal access or if your initial EA administrator can no longer manage the enrollment and has no access to EA portal, please submit a request at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport) to request for an update and provide the following information:
- Enrollment number
- Email address to be added and authentication type (work/school/MS)
- Reason for changing initial EA administrator
- Email approval from initial EA administrator

### My current EA admin is no longer with the company

An EA enrollment can have multiple EA administrators, you can reach out to another EA administrator to have new EA administrator/account owners/department admin added. However, if you are not clear on who is the EA administrator in your company or there is no other available EA administrator on the enrollment, please reach out to us with the following information:
- Enrollment number
- Email address to be added and authentication type (work/school/MS)
- Providing information that current EA admin is no longer with the company

Please note that if there are other EA administrators on the enrollment, we will reach out to the EA administrators to request for approval on administrative changes on the enrollment.

### My enrollment is showing in pending status. How do I activate my enrollment?

Enrollments will be in pending status if the initial EA administrator has not logged on to the enrollment before. If you are the EA administrator, please sign in to the Azure EA portal. On the landing page with all your enrollment numbers, you may not see your pending enrollment. Please uncheck the “active” box on the top-right corner of your EA portal, this action would display the pending enrollment. Please click on the enrollment to access the information and once you have reached the Manage page of the enrollment, the status will be updated from Pending to Active.

### Why is my account stuck in pending status?

When new Account Owners (AO) are added to the enrollment for the first time, they will always show as “pending” under status. Upon receiving the activation welcome email, AO can sign in to activate their account. Signing in will update the account status from “pending” to “active”.

### I received an error when signing in to Azure EA portal

There are a few possible reasons for an error message on Azure EA portal during signing in, please follow these troubleshooting steps:

 1. Please ensure you are using the correct EA portal URL at [https://ea.azure.com](https://ea.azure.com).
 1. Determine if your access to Azure EA portal is added as a work or school account or Microsoft Live ID. If you are using your work account, please enter your work email and work password. If you are using Microsoft Live ID, please enter your Live ID email and Microsoft Live ID password. If you have forgotten your Microsoft Live ID password, please have it reset at [https://account.live.com/password/reset](https://account.live.com/password/reset).
 1. It is recommended that you use a private browser to sign in so that no cookies or cache from previous/existing sessions are retained. Clear cache, and use private browsing mode/incognito window to open [https://ea.azure.com](https://ea.azure.com).
 1. If you are getting an Invalid User error when using a Microsoft account, it may be because you have multiple Microsoft accounts and the one that you are trying to sign in with is not the primary alias. To check the primary alias, go to account.live.com:
    - Go to “Your Info" > "Manage your sign-in email or phone number".
    - Follow the prompt on the screen to verify alternate email address and obtain a code to access sensitive information.
    - Enter the security code.
    - If you prefer to set up two-step authentication later, select “Set it up later”.
    - You will land on the "Manage your account aliases" page where you will see the account aliases that you have. Double check that the primary alias is the one that you are using to log into Azure EA portal. If it is not, you can either make it your primary alias, or you will use the primary alias for EA portal instead.

If the above troubleshooting steps failed, please submit a request at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport) with information such as:
- The browsers and version used.
- Screenshot of the error message.
- URL of the page showing error.  
- Date, time, and time zone of when the error occurs.
- In addition, it will help if you obtain a log file. Here are the steps to capture a network trace using the information below:
  1. Open Internet Explorer.
  1. Press F12, which will open a box at the bottom of IE.
  1. Select the **Network** Tab.
  1. Click on **Start Capturing**.
  1. Perform the action that is causing the error.
  1. Once you get the error, click on **Stop Capturing**.
  1. Save the file and include the information in the support request.
  1. Ensure that you provide your enrollment number and email address within the support request.

### What is the difference between a work/school account and Microsoft account?

**Microsoft account:** Accounts that have been associate to Live ID on [https://signup.live.com](https://signup.live.com).

**Work/School account:** Only available to companies that have set up active directory with Federation to the Cloud and all accounts are on a single tenant. Users can be added with work/school authorization type if the company’s internal active directory is federated to the cloud.

  From September 2016, Microsoft no longer allows work or school email addressed to be registered as Microsoft accounts. For more details, reference the following materials: [https://blogs.technet.microsoft.com/enterprisemobility/2016/09/15/cleaning-up-the-azure-ad-and-microsoft-account-overlap/](https://blogs.technet.microsoft.com/enterprisemobility/2016/09/15/cleaning-up-the-azure-ad-and-microsoft-account-overlap/).

  If your organization is not federated to the cloud, you will not be able to use your work or school email address. Please register or create a new email address and register it as a Microsoft account instead.

### I forgot my password to Azure EA portal

If you have forgotten your Microsoft Live ID password, please have it reset at [https://account.live.com/password/reset](https://account.live.com/password/reset).

If you have forgotten your work password, please contact your company’s IT administrator.

### I have a valid work or school account but I can't add it to the EA Portal

If you have a work or school account under a different tenant, please change the authorization level under enrollment details page to “Work or School Account Cross Tenant” and you will be able to add the account.

## Next steps

- Azure EA portal administrators should read [Azure EA portal administration](ea-portal-administration.md) to learn about common administrative tasks.
