<properties
	pageTitle="Azure Active Directory Domain Services preview: Getting Started | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-domain-services"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-domain-services"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/29/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services *(Preview)*

## Getting started

## Step 2: Create an Azure virtual network
The next step is to create an Azure virtual network in which you would like to enable Azure AD Domain Services.
> [AZURE.NOTE] Ensure that the Azure virutal network you create or choose to use with Azure AD Domain Services belongs to an Azure region that is supported by Azure AD Domain Services. For a list of Azure regions where Azure AD Domain Services is available, refer to the [regions](active-directory-domain-services-regions.md) page.

If you already have an existing virtual network you’d prefer to use, you can skip this step. You will need to note down the name of the virtual network so you select the right virtual network when enabling Azure AD Domain Services in the following configuration step.

Perform the following configuration steps in order to create an Azure virtual network in which you’d like to enable Azure AD Domain Services.
- Navigate to the **Azure management portal** (https://manage.windowsazure.com).
- Select the **Networks** node on the left pane.
- Click **NEW** on the task pane at the bottom of the page.
- In the **Network Services** node, select **Virtual Network**.
- Click on **Quick Create** in order to create a virtual network.
- Specify a name for your virtual network. You may also choose to configure the address space or maximum VM count for this network.
- Ensure that you select a supported Azure region in the **Location** dropdown. This is an important step. If you select a virtual network in an Azure region that is not supported by Azure AD Domain Services, you will not be able to enable the service in that virtual network.
- Click the **Create a Virtual Network** button to create your virtual network.

![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/create-vnet.png)
