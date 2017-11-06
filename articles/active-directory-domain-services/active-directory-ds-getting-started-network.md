---
title: 'Azure Active Directory Domain Services: Getting Started | Microsoft Docs'
description: Enable Azure Active Directory Domain Services using the Azure portal (Preview)
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
ms.date: 08/28/2017
ms.author: maheshu

---
# Enable Azure Active Directory Domain Services using the Azure portal (Preview)


## Before you begin
Refer to [Networking considerations for Azure Active Directory Domain Services](active-directory-ds-networking.md).


## Task 2: configure network settings
The next configuration task is to create an Azure virtual network and a dedicated subnet within it. You enable Azure Active Directory Domain Services in this subnet within your virtual network. You may also pick an existing virtual network and create the dedicated subnet within it.

1. Click **Virtual network** to select a virtual network.
2. On the **Choose virtual network** blade, you see all existing virtual networks. You see only the virtual networks that belong to the resource group and Azure location you have selected on the **Basics** wizard page.
3. Choose the virtual network in which Azure AD Domain Services should be enabled. You can either pick an existing virtual network or create a new one.
4. **Create virtual network:** Click **Create new** to create a new virtual network. We highly recommend using a dedicated subnet for Azure AD Domain Services. For example, create a subnet with the name 'DomainServices', making it easy for other administrators to understand what is deployed within the subnet. Click **OK** when you're done.

    ![Pick virtual network](./media/getting-started/domain-services-blade-network-pick-vnet.png)

5. **Existing virtual network:** If you plan to pick an existing virtual network, [create a dedicated subnet using the virtual networks extension](../virtual-network/virtual-networks-create-vnet-arm-pportal.md), and then pick that subnet. Click **Virtual Network** to select the existing virtual network. Click **Subnet** to pick the dedicated subnet in your existing virtual network, within which to enable your new managed domain. Click **OK** when you're done.

    ![Pick subnet within the virtual network](./media/getting-started/domain-services-blade-network-pick-subnet.png)

  > [!NOTE]
  > **Guidelines for selecting a subnet**
  > 1. Use a dedicated subnet for Azure AD Domain Services. Do not deploy any other virtual machines to this subnet. This configuration enables you to configure network security groups (NSGs) for your workloads/virtual machines without disrupting your managed domain. For details, see [networking considerations for Azure Active Directory Domain Services](active-directory-ds-networking.md).
  2. Do not select the Gateway subnet for deploying Azure AD Domain Services, because it is not a supported configuration.
  3. Ensure that the subnet you've selected has sufficient available address space - at least 3-5 available IP addresses.
  >

6. When you are done, click **OK** to move on to the **Administrator group** page of the wizard.


## Next step
[Task 3: configure administrative group and enable Azure AD Domain Services](active-directory-ds-getting-started-admingroup.md)
