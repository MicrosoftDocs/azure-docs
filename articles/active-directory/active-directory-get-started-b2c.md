<properties
	pageTitle="Get started with Azure AD B2C"
	description="A topic on how to create an Azure AD B2C directory"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/03/2015"
	ms.author="swkrish"/>

# How to create an Azure AD B2C directory

To start using Azure AD B2C, follow the 3 steps outlined below.

## Step 1: Sign up for an Azure subscription

If you already have an Azure subscription move on to the next step. If not, sign up for [an Azure Subscription](sign-up-organization) and get access to Azure AD B2C.

> [AZURE.NOTE]
Azure AD B2C is currently free for use but limited (up to 50,000 users per directory). An Azure subscription is only needed to access the [Azure Management Portal](http://manage.windowsazure.com/) and won't be used to bill your usage.

## Step 2: Create an Azure AD B2C directory

Use the following steps to create a new Azure AD B2C directory. Currently B2C features can't be turned on in your existing directories, if you have any.

1. Sign into the [Azure Management Portal](https://manage.windowsazure.com/) as the Subscription Administrator. This is the same work or school account or the same Microsoft Account that you used to sign up for Azure.
2. Click **New** > **App Services** > **Active Directory** > **Directory** > **Custom Create**.
3. Choose the **name**, **domain name** and **country or region** for your directory.
4. Check the option that says "**This is a B2C directory**".
5. Click the check mark to complete the action.
6. Your directory is now created and will appear in the Active Directory extension. You are also made a Global Administrator of the directory. You can add other Global Administrators as required.

## Step 3: Navigate to the B2C features blade on the Azure Portal

The B2C features on your directory can be managed on the [Azure Portal](https://portal.azure.com/); only a Global Administrator can do this. You can manage users and groups, self-service password reset configuration and company branding features on the [Azure Management Portal](https://manage.windowsazure.com/).

1. Navigate to your directory on the Active Directory extension.
2. Click on the **Configure** tab.
3. Click on the **Manage B2C settings** link in the **B2C administration** section.
4. The [Azure Portal](https://portal.azure.com/) with the B2C features blade will open in a new browser tab or window.
5. Pin this blade to your Startboard for easy access.
