---
title: Deploy Windows Server virtual machines in Azure Virtual Desktop - Azure
description: How to deploy and configure Windows Server edition virtual machines on Azure Virtual Desktop. 
author: ravibak
ms.author: ravibak
ms.service: virtual-desktop
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 03/18/2022
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Deploy Windows Server based virtual machines on Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/deploy-windows-7-virtual-machine.md).

The process to deploy Windows Server based Virtual Machines (VM) on Azure Virtual Desktop is slightly different than for VMs running other versions of Windows such a Windows 10 or windows 11. This guide will walk you through the steps.

Azure Virtual Desktop Host pool supports running Windows Server 2012 R2 and above editions.

> [!NOTE]
> - Azure AD Join session host scenario is not supported with Windows Server editions.

## Prerequisites

Running Windows Server based host virtual machines on Azure Virtual Desktop requires Remote Desktop Services (RDS) Licensing Server.

Refer this page for more information on Azure Virtual Desktop licensing eligibility requirement. 
[Azure Virtual Desktop Pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/)

Use the following information to learn about how licensing works in Remote Desktop Services and to deploy and manage your licenses:

[License your RDS deployment with client access licenses](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-client-access-license)

If you are running Windows Server Remote Desktop Services you will likely already have Licensing Server setup in your environment. You can continue using the same as long Azure Virtual Desktop hosts has line of sight to the Server. 

## Configure Windows Server based Virtual Machines

Once you've done the prerequisites, you're ready to configure Windows Server based VMs for deployment on Azure Virtual Desktop.

1. Follow the instructions in [Create a host pool with PowerShell](create-host-pools-powershell.md) to create a host pool. If you're using the portal, follow the instructions from [Create a host pool using the Azure portal](create-host-pools-azure-marketplace.md).

1. Select relevant Windows Server image or upload your own customized image based on Windows Server edition at **Step 6** under **Virtual machine details** section.

1. Select **Active Directory** as an option under **Domain to Join** section in **Step 12** of **Virtual machine details** section.

1. Connect to the newly deployed VM using an account with local administrator privileges.
1. Open the Start menu and type "gpedit.msc" to open the Group Policy Editor.
1. Navigate the tree to **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Licensing**
1. Select policy **Use the specified Remote Desktop license servers** and set the policy to point to Remote Desktop Licensing Server.
1. Navigate the tree to **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Licensing**
2. Select policy **Specify the licensing mode for the Remote Desktop Session Host server** set the policy to Per Device or Per User, as appropriate for your licensing eligibility. 


## Next steps
Now that you've deployed some Azure AD joined VMs, you can sign in to a supported Azure Virtual Desktop client to test it as part of a user session. If you want to learn how to connect to a session, check out these articles:

- [Connect with the Windows Desktop client](user-documentation/connect-windows-7-10.md)
- [Connect with the web client](user-documentation/connect-web.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
