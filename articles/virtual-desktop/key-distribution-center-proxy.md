---
title: Set up Kerberos Key Distribution Center proxy Windows Virtual Desktop - Azure
description: How to set up a Windows Virtual Desktop host pool to use a Kerberos Key Distribution Center proxy.
author: Heidilohr
ms.topic: how-to
ms.date: 03/02/2021
ms.author: helohr
manager: lizross
---
# Configure a Kerberos Key Distribution Center proxy (preview)

> [!IMPORTANT]
> This feature is currently in public preview.
> This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Security-conscious customers, such as financial or government organizations, prefer to sign in using Smartcard because it requires a direct connection with an Active Directory (AD) domain controller for Kerberos authentication. Without this direct connection, users can't sign in to the organization's network externally. Windows Virtual Desktop supports signing in externally by using the KDC proxy service. The KDC proxy allows for authentication for the Remote Desktop Protocol of a Windows Virtual Desktop session, letting the user sign in securely without needing to repeatedly enter a password. This makes working from home much easier, and allows for certain disaster recovery scenarios to run more smoothly.

However, the KDC proxy is a component of the Windows Server Gateway role in Windows Server 2016 or later, not Azure. How Do you use a Remote Desktop Services role to sign in to Windows Virtual Desktop? To answer that, let's take a quick look at the components.

There are two components to the Windows Virtual Desktop service that the KDC proxy needs to authenticate before it can work properly:

- The feed in the WVD client that gives users a list of available desktops or applications they have access to.
- The RDP session that results from a user selecting one of those available resources.

The KDC proxy covers both components without having to use Windows Virtual Desktop and Remote Desktop Services at the same time. This article will show you how to configure the proxy in the Azure portal.

## How to configure the KDC proxy

To configure the KDC proxy:

1. Sign in to the Azure portal as an administrator.

2. Go to the Windows Virtual Desktop page.

3. Select the host pool you want to enable the KDC proxy for, then select **RDP Properties**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Azure portal page showing a user selecting Host pools, then the name of the example host pool, then RDP properties.](media/rdp-properties.png)

4. Select the **Advanced** tab, then enter a value in the following format without spaces:

    > kdcproxyname:s:\<fqdn\>

    > [!div class="mx-imgBorder"]
    > ![A screenshot showing the Advanced tab selected, with the value entered as described in step 4.](media/advanced-tab-selected.png)

5. Select **Save**.

6. The selected host pool should now begin to issue RDP connection files with the kdcproxyname field that you entered included.

## Next steps

The RDGateway role in Remote Desktop Services includes a KDC proxy service. See [Deploy the RD Gateway role in Windows Virtual Desktop](rd-gateway-role.md) for how to set one up to be a target for Windows Virtual Desktop.
