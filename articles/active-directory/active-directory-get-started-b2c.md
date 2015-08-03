<properties
	pageTitle="Getting started with Azure Active Directory B2C"
	description="A topic that explains how to sign up for Azure Active Directory B2C"
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

# Get started with Azure Active Directory B2C

Azure Active Directory B2C is a comprehensive, cloud-based consumer identity and access management service for your consumer-facing applications built to run on any platform, and to be accessible from any device. It is a highly-available, global service that can support hundreds of millions of consumer identities. Built on the same enterprise-grade platform as Azure Active Directory, Azure Active Directory B2C keeps your business and consumers protected. To learn more, click [here](B2C marketing site).

To start using Azure Active Directory B2C, follow the steps below.

## Step 1: Sign up for an Azure subscription

If you already have an Azure subscription move to the next step. If not sign up for a free Azure trial and get access to Azure Active Directory B2C. [Create a free Azure trial](https://azure.microsoft.com/en-us/pricing/free-trial/).

> [AZURE.NOTE]
The use of Azure Active B2C is currently free but limited (up to 50,000 users per directory). An Azure subscription is only needed to access the [Azure Management Portal](http://manage.windowsazure.com/) and won't be used for billing purposes.

## Step 2: Create an Azure Active Directory B2C directory

Use the following instructions to create a new Azure Active Directory directory with B2C features turned on. Currently B2C features can't be turned on in your existing directory.
1. Sign into the [Azure Management Portal](https://manage.windowsazure.com/) as the Subscription administrator. This is the same work or school account or the same Microsoft Account that you used to sign up for Azure.
2. Click New > App Services > Active Directory > Directory > Custom Create.
3. Choose the name, domain name and country or region for your B2C directory.
4. Check the option that says "This is a B2C directory".
5. Click the check mark to complete the action.
6. Your B2C directory will appear in the Active Directory extension.

## Step 3: Access B2C features on the Azure Portal

The B2C features on your directory can be managed on the [Azure Portal](https://portal.azure.com/). See below steps on how to do this. You can continue to manage users and groups, self-service password reset configuration and company branding features of your directory on the [Azure Management Portal](https://manage.windowsazure.com/).
1. Navigate to the directory (that has B2C features turned on) on the Active Directory extension.
2. Click on the **Configure** tab.
3. Under the **B2C administrator** section, click on the **Manage B2C settings** link.
4. The [Azure Portal](https://portal.azure.com/) with the B2C features blade will open in a new browser window.
5. Pin this blade to your Startboard for easy access.

## Step 4: Secure your apps using Azure Active Directory B2C

Use one of the following developer guides to learn how to add B2C features to your app:
- Get started with .NET
- Get started with iOS
- Get started with Android
- Get started with Windows Phone
- Secure your Web API
- Get started with Javascript
- Get started with Graph API
