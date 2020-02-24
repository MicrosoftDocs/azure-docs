---
title: Configure lab accounts in Azure Lab Services | Microsoft Docs
description: This article describes how to create a lab account, view all lab accounts, or delete a lab account in Azure Lab Services. 
services: lab-services
documentationcenter: na
author: spelluru
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2020
ms.author: spelluru

---
# Configure lab accounts in Azure Lab Services 
In Azure Lab Services, a lab account is a container for managed lab types such as classroom labs. An administrator sets up a lab account with Azure Lab Services and provides access to lab owners who can create labs in the account. 

This article shows how to perform the following tasks: 

- Specify an address range for VMs in the lab
- Configure automatic shutdown of VMs on disconnect

## Specify an address range for VMs in the lab
The following procedure has steps to specify an address range for VMs in the lab. If you update the range that you previously specified, the modified address range applies only to VMs that are created after the change was made. 

Here are some restrictions when specifying the address range that you should keep in mind. 

- The prefix must be smaller than or equal to 23. 
- If a virtual network is peered to the lab account, the provided address range cannot overlap with address range from peered virtual network.

1. On the **Lab Account** page, select **Labs settings** on the left menu.
2. For the **Address range** field, specify the address range for VMs that will be created in the lab. The address range should be in the classless inter-domain routing (CIDR) notation (example: 10.20.0.0/23). Virtual machines in the lab will be created in this address range.
3. Select **Save** on the toolbar. 

    ![Configure address range](../media/how-to-manage-lab-accounts/labs-configuration-page-address-range.png)


## Automatic shutdown of VMs on disconnect
You can enable or disable automatic shutdown of Windows lab VMs (template or student) after a remote desktop connection is disconnected. You can also specify how long the VMs should wait for the user to reconnect before automatically shutting down.

![Automatic shutdown setting at lab account](../media/how-to-configure-lab-accounts/automatic-shutdown-vm-disconnect.png)

This setting applies to all the labs created in the lab account. A lab owner can override this setting at the lab level. The change to this setting at the lab account will only affect labs that are created after the change is made.

To learn about how a lab owner can configure this setting at the lab level, see [this article](how-to-enable-shutdown-disconnect.md)

## Next steps
See the following articles:

- [Allow lab creator to pick lab location](allow-lab-creator-pick-lab-location.md)
- [Connect your lab's network with a peer virtual network](how-to-connect-peer-virtual-network.md)
- [Attach a shared image gallery to a lab](how-to-attach-detach-shared-image-gallery.md)
- [Add a user as a lab owner](how-to-add-user-lab-owner.md)
- [View firewall settings for a lab](how-to-configure-firewall-settings.md)
