---
title: Set up KDC proxy Windows Virtual Desktop - Azure
description: How to set up the KDC proxy in Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 01/21/2021
ms.author: helohr
manager: lizross
---
# Configure KDC proxy

This article will show you how to configure a KDC proxy for your host pool. This proxy lets organizations authenticate with Kerberos outside of their enterprise boundaries, which enables Smartcard authentication for external clients.

To configure the KDC proxy:

1. Sign in to the Azure portal as an administrator.

2. Go to the Windows Virtual Desktop page.

3. Select the host pool you want to enable the KDC Proxy for, then select **RDP Properties**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Azure portal page showing a user selecting Host pools, then the name of the example host pool, then RDP properties.](media/rdp-properties.png)

4. Select the **Advanced** tab, then enter a value in the following format without spaces:

    > kdcproxyname:s:\<fqdn\>

    > [!div class="mx-imgBorder"]
    > ![A screenshot showing the Advanced tab selected, with the value entered as described in step 4.](media/advanced-tab-selected.png)

5. Select **Save**.

6. The selected host pool should now begin to issue RDP connection files with the kdcproxyname field that you entered included.

>[!NOTE]
>The RDGateway role in Remote Desktop Services includes a KDC Proxy service. See *this article* for how to set one up to be a target for Windows Virtual Desktop.
