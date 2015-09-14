<properties
	pageTitle="Azure Active Directory B2C preview: Creating an Azure Active Directory B2C directory | Microsoft Azure"
	description="A topic on how to create an Azure Active Directory B2C directory"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/15/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: how to create an Azure AD B2C Directory

To start using Azure Active Directory (AD) B2C, follow the 3 steps outlined below.

## Step 1: Sign up for an Azure Subscription

If you already have an Azure subscription move on to the next step. If not, sign up for [an Azure subscription](sign-up-organization.md) and get access to Azure AD B2C.

> [AZURE.NOTE]
Azure AD B2C preview is currently free for use but limited (up to 50,000 users per directory). An Azure subscription is needed to access the [Azure portal](http://manage.windowsazure.com/).

## Step 2: Create an Azure AD B2C Directory

Use the following steps to create a new Azure AD B2C directory. Currently B2C features can't be turned on in your existing directories, if you have any.

1. Sign into the [Azure portal](https://manage.windowsazure.com/) as the Subscription Administrator. This is the same work or school account or the same Microsoft Account that you used to sign up for Azure.
2. Click **New** > **App Services** > **Active Directory** > **Directory** > **Custom Create**.

    ![Create directory](../media/active-directory-b2c/new-directory.png)

3. Choose the **name**, **domain name** and **country or region** for your directory.
4. Check the option that says "**This is a B2C directory**".
5. Click the check mark to complete the action.

    ![Create B2C directory](../media/active-directory-b2c/create-b2c-directory.png)

6. Your directory is now created and will appear in the Active Directory extension. You are also made a Global Administrator of the directory. You can add other Global Administrators as required.

    > [AZURE.IMPORTANT]
    It can take up to a minute for your directory to be created. If you face issues during directory creation, check out this [article](active-directory-b2c-support-create-directory.md) for guidance.

## Step 3: Navigate to the B2C Features blade on the Azure Preview Portal

1. Navigate to the Active Directory extension on the navigation bar on the left hand side.
2. Find your directory under the **Directory** tab and click on it.
3. Click on the **Configure** tab.
4. Click on the **Manage B2C settings** link in the **B2C administration** section.

    ![Create B2C directory](../media/active-directory-b2c/b2c-directory-configure-tab.png)

4. The [Azure preview portal](https://portal.azure.com/) with the B2C features blade will open in a new browser tab or window.
5. Pin this blade (see top right corner) to your Startboard for easy access.

    ![B2C features blade](../media/active-directory-b2c/b2c-features-blade.png)

    > [AZURE.NOTE]
    You can manage users & groups, self-service password reset configuration and company branding features of your directory on the [Azure portal](https://manage.windowsazure.com/).

## Next Steps

Move onto [registering an application with Azure AD B2C and building a Quick Start Application](active-directory-b2c-app-registration.md).
