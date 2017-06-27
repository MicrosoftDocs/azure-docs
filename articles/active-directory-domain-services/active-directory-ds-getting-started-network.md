---
title: 'Azure Active Directory Domain Services: Getting Started | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: ace1ed4a-bf7f-43c1-a64a-6b51a2202473
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27/2017
ms.author: maheshu

---
# Task 2: Create or select a virtual network for Azure Active Directory Domain Services (Preview)

## Before you begin
Refer to [Networking considerations for Azure Active Directory Domain Services](active-directory-ds-networking.md).

## Configure network settings
The next configuration task is to create an Azure virtual network and a dedicated subnet within it. You enable Azure Active Directory Domain Services in this subnet within your virtual network. You may also pick an existing virtual network and create the dedicated subnet within it.

1. Click **Virtual network** to select a virtual network.
2. On the **Choose virtual network** blade you see all existing virtual networks. You see only the virtual networks that belong to the resource group and Azure location you have selected on the **Basics** wizard page.

3. Choose the existing virtual network in which Azure AD Domain Services should be enabled. Click **Create new**, if you prefer to create a new virtual network.

    ![Pick virtual network](./media/getting-started/domain-services-blade-network-pick-vnet.png)

4. Click **Subnet** to pick the dedicated subnet in this virtual network, within which to enable your new managed domain. In the **Create subnet** blade, specify a name for the subnet and click **OK** when you're done. For example, create a subnet with the name 'DomainServices' that makes it easy for other administrators to understand what is deployed within the subnet.

    ![Pick subnet within the virtual network](./media/getting-started/domain-services-blade-network-pick-subnet.png)

  > [!NOTE]
  > Guidelines for selecting a subnet
  > 1. Do not select the Gateway subnet for deploying Azure AD Domain Services. This is not a supported configuration.
  2. Ensure that the subnet you've selected has sufficient available address space - atleast 3-5 available IP addresses.
  >

5. When you are done, click **OK** to move on to the **Administrator group** page of the wizard.


## Next step
Task 3: [Configure administrative group](active-directory-ds-getting-started-admingroup.md)
