<properties
	pageTitle="Azure Active Directory Domain Services preview: Getting Started | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="udayh"
	editor="femila"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/05/2015"
	ms.author="mahesh-unnikrishnan"/>

# Azure AD Domain Services *(Preview)* - Getting started

## Guidelines to select an Azure virtual network
When selecting a virtual network to use with Azure AD Domain Services, keep the following guidelines in mind:

- Ensure you select a virtual network in a region that is supported by Azure AD Domain Services. The current list of supported Azure regions is available on the [regions](active-directory-ds-regions.md) page.
- If you plan to use an existing virtual network, ensure that it is a regional virtual network. Virtual networks that use the legacy affinity groups mechanism cannot be used with Azure AD Domain Services. You will need to [migrate legacy virtual networks to regional virtual networks](../virtual-networks-migrate-to-regional-vnet.md).
- Select the virtual network that currently hosts/will host virtual machines that need access to Azure AD Domain Services. You will not be able to move Domain Services to another virtual network later.


## Step 2: Create an Azure virtual network
The next configuration step is to create an Azure virtual network in which you would like to enable Azure AD Domain Services. If you already have an existing virtual network you’d prefer to use, you can skip this step.

> [AZURE.NOTE] Ensure that the Azure virtual network you create or choose to use with Azure AD Domain Services belongs to an Azure region that is supported by Azure AD Domain Services. For a list of Azure regions where Azure AD Domain Services is available, refer to the [regions](active-directory-ds-regions.md) page.

You will need to note down the name of the virtual network so you select the right virtual network when enabling Azure AD Domain Services in a subsequent configuration step.

Perform the following configuration steps in order to create an Azure virtual network in which you’d like to enable Azure AD Domain Services.

1. Navigate to the **Azure management portal** ([https://manage.windowsazure.com](https://manage.windowsazure.com)).
2. Select the **Networks** node on the left pane.
3. Click **NEW** on the task pane at the bottom of the page.

    ![Virtual networks node](./media/active-directory-domain-services-getting-started/virtual-networks.png)

4. In the **Network Services** node, select **Virtual Network**.
5. Click on **Quick Create** in order to create a virtual network.

    ![Virtual network - quick create](./media/active-directory-domain-services-getting-started/virtual-network-quickcreate.png)

6. Specify a **Name** for your virtual network. You may also choose to configure the **Address space** or **Maximum VM count** for this network. You can leave the DNS server setting set to 'None' for now. This setting will be updated after your enable Azure AD Domain Services.
7. Ensure that you select a supported Azure region in the **Location** dropdown. For a list of Azure regions where Azure AD Domain Services is available, refer to the [regions](active-directory-ds-regions.md) page. This is an important step. If you select a virtual network in an Azure region that is not supported by Azure AD Domain Services, you will not be able to enable the service in that virtual network.
8. Click the **Create a Virtual Network** button to create your virtual network.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/create-vnet.png)

---
[**Next step - Enable Azure AD Domain Services.**](active-directory-ds-getting-started-enableaadds.md)
