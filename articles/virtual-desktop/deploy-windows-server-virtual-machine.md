---
title: Deploy Windows Server virtual machines in Azure Virtual Desktop - Azure
description: How to deploy and configure Windows Server edition virtual machines on Azure Virtual Desktop. 
author: ravibak
ms.author: ravibak
ms.service: virtual-desktop
ms.topic: how-to
ms.date: 08/10/2022
ms.custom: template-how-to
---

# Deploy Windows Server-based virtual machines on Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/deploy-windows-7-virtual-machine.md).

The process for deploying Windows Server-based virtual machines (VMs) on Azure Virtual Desktop is slightly different than the one for VMs running other versions of Windows, such as Windows 10 or Windows 11. This guide will walk you through how this process.

> [!NOTE]
> Windows Server scenarios don't support Azure Active Directory (AD)-joined session hosts.

## Prerequisites

Before you get started, you'll need to make sure you have the following things:

- Azure Virtual Desktop host pools support running Windows Server 2012 R2 and later.

- Running Windows Server-based host VMs on Azure Virtual Desktop requires a Remote Desktop Services (RDS) Licensing Server. This server should be a separate server or remote VM in your environment that you've assigned the Remote Desktop Licensing Server role to.
  
  For more information about licensing, see the following articles:

  - [Operating systems and licenses](prerequisites.md)
  - [License your RDS deployment with client access licenses](/windows-server/remote/remote-desktop-services/rds-client-access-license)

  For more information about Role-based Access Control (RBAC) roles, see [Built-in Azure RBAC roles for Azure Virtual Desktop](rbac.md).

  If you're already using Windows Server-based Remote Desktop Services, you probably already have a licensing server set up in your environment. If you do, you can continue using the same Azure Virtual Desktop hosts as long as they have line-of-sight with the server.

- You must assign your Windows Server VM the Remote Desktop Session Host role.

## Configure Windows Server-based VMs

Now that you've fulfilled the requirements, you're ready to configure Windows Server-based VMs for deployment on Azure Virtual Desktop.

To configure your VM:

1. Follow the instructions from [Create a host pool using the Azure portal](create-host-pools-azure-marketplace.md) until you reach step 6 in [Virtual machine details](create-host-pools-azure-marketplace.md#virtual-machine-details). When it's time to select an image in the **Virtual machine details** field, either select a relevant Windows Server image or upload your own customized Windows Server image.

2. For the **Domain to join** field, select **Active Directory**.

3. Connect to the newly deployed VM using an account with local administrator privileges.

4. Next, open the **Start** menu on your VM Desktop and enter **gpedit.msc** to open the Group Policy Editor.

5. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Licensing**.

6. Once you're at **Licensing**, select **Use the specified Remote Desktop license servers** and set the policy to point to the Remote Desktop Licensing Servers FQDN/IP Address.

7. Finally, select **Specify the licensing mode for the Remote Desktop Session Host server** and set the policy to **Per device** or **Per user**, depending on your licensing eligibility. 

> [!NOTE]
> You can also use and apply a domain-based group policy object (GPO) and scope it to the Organizational Unit (OU) where the Azure Virtual Desktop hosts are located in your Active Directory.

## Next steps

Now that you've deployed Windows Server-based Host VMs, you can sign in to a supported Azure Virtual Desktop client to test it as part of a user session. If you want to learn how to connect to a session using Remote Desktop Services for Windows Server, check out our [list of available clients](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients).

If you'd like to learn how to create a VM using Azure Virtual Desktop instead of Windows Server, check out these articles:

- To set up a VM automatically as part of the host pool setup process, see [Tutorial: Create a host pool](create-host-pools-azure-marketplace.md).
- If you'd like to manually create VMs in the Azure portal after setting up a host pool, see [Expand an existing host pool with new session hosts](expand-existing-host-pool.md).
- You can also manually create a VM with [Azure CLI, PowerShell](create-host-pools-powershell.md), or [REST API](/rest/api/desktopvirtualization/).
