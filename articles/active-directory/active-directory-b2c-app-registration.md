<properties
	pageTitle="Azure Active Directory B2C | Microsoft Azure"
	description="How to register your application with Azure AD B2C"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/20/2015"
	ms.author="swkrish"/>

# How to register your application with Azure AD B2C

To build an application that accepts consumer sign up & sign in, you'll first need to register it with Azure AD B2C. Before you do this, you will need an [Azure AD B2C directory](active-directory-get-started.md).

## Navigate to the B2C features blade on the Azure Portal

### Directly on the Azure Portal

If you followed the steps in [this guide](active-directory-get-started.md) while creating the Azure AD B2C directory, you should have the B2C features blade pinned to your Startboard when you sign in to the [Azure Portal](https://portal.azure.com/) as the Global Administrator of your directory.

You can also access the B2C features blade directly by navigating to [https://portal.azure.com/<directory>.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/<directory>.onmicrosoft.com](https://portal.azure.com/<directory>.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/<directory>.onmicrosoft.com) where **<directory>** is to be replaced by the name used at directory creation time (for e.g., [https://portal.azure.com/contosob2c.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/contosob2c.onmicrosoft.com](https://portal.azure.com/contosob2c.onmicrosoft.com/?Microsoft_AAD_B2CAdmin=true#blade/Microsoft_AAD_B2CAdmin/TenantManagementBlade/id/contosob2c.onmicrosoft.com)), and sign in as the Global Administrator of your directory. Bookmark this link for future reference.

### Access via the Azure Management Portal

Sign in to the [Azure Management Portal](https://manage.windowsazure.com/) as the Global Administrator of your directory. On the **Quick Start** tab, click on **Manage B2C settings** under **Administer**. This will open up the B2C features blade in a new browser window or tab.

You can also find the **Manage B2C settings** link (under **B2C Administration**) in the **Configure** tab.

## Register an application

1. On the B2C features blade on the [Azure Portal](https://portal.azure.com/), click on **Applications**.
2. Click **+Add** at the top of the blade.
3. The **Name** of the application will describe your application to end users. For e.g., enter "B2C app".
4. Toggle the **Include web app / web API** switch to **Yes**.
5. The **Reply URLs** are endpoints where Azure AD B2C will return any tokens your application requests. For e.g., enter `https://localhost:44321/`.
6. Click **Create** to register your application.

## Build a Quick Start Application

Now that you have an application registered with Azure AD B2C, you can complete one of our quick start tutorials to get up & running. Here are a few recommendations:

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-b2c-quickstart-table.md)]
