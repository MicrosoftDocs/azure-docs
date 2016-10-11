<properties
	pageTitle="Azure AD Domain Services: Create or select a virtual network | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="10/03/2016"
	ms.author="maheshu"/>

# Create or select a virtual network for Azure AD Domain Services

## Guidelines to select an Azure virtual network
> [AZURE.NOTE] **Before you begin**: Refer to [Networking considerations for Azure AD Domain Services](active-directory-ds-networking.md).


## Task 2: Create an Azure virtual network
The next configuration task is to create an Azure virtual network and a subnet within it. You enable Azure AD Domain Services in this subnet within your virtual network. If you already have an existing virtual network you’d prefer to use, you can skip this step.

> [AZURE.NOTE] Ensure that the Azure virtual network you create or choose to use with Azure AD Domain Services belongs to an Azure region that is supported by Azure AD Domain Services. See the [Azure services by region](https://azure.microsoft.com/regions/#services/) page to know the Azure regions in which Azure AD Domain Services is available.

Note down the name of the virtual network so you select the right virtual network when enabling Azure AD Domain Services in a subsequent configuration step.

Perform the following configuration steps to create an Azure virtual network in which you’d like to enable Azure AD Domain Services.

1. Navigate to the **Azure classic portal** ([https://manage.windowsazure.com](https://manage.windowsazure.com)).

2. Select the **Networks** node on the left pane.

    ![Networks node](./media/active-directory-domain-services-getting-started/networks-node.png)

3. Click **NEW** on the task pane at the bottom of the page.

    ![Virtual networks node](./media/active-directory-domain-services-getting-started/virtual-networks.png)

4. In the **Network Services** node, select **Virtual Network**.

5. Click **Quick Create** to create a virtual network.

    ![Virtual network - quick create](./media/active-directory-domain-services-getting-started/virtual-network-quickcreate.png)

6. Specify a **Name** for your virtual network. You may also choose to configure the **Address space** or **Maximum VM count** for this network. You can leave the **DNS server** setting set to 'None' for now. You can update the DNS server setting after your enable Azure AD Domain Services.

7. Ensure that you select a supported Azure region in the **Location** dropdown. See the [Azure services by region](https://azure.microsoft.com/regions/#services/) page to know the Azure regions in which Azure AD Domain Services is available.

8. To create your virtual network, click the **Create a Virtual Network** button.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/create-vnet.png)

9. After the virtual network is created, select the virtual network and click the **CONFIGURE** tab.

    ![Create a subnet](./media/active-directory-domain-services-getting-started/create-vnet-properties.png)

10. Navigate to the **virtual network address spaces** section. Click **add subnet** and specify a subnet with the name **AaddsSubnet**. Click **Save** to create the subnet.

    ![Create a subnet for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/create-vnet-add-subnet.png)


<br>

## Task 3 - Enable Azure AD Domain Services
The next configuration task is to [enable Azure AD Domain Services](active-directory-ds-getting-started-enableaadds.md).
