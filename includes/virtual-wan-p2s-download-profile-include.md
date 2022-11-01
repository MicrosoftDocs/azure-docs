---
ms.author: cherylmc
author: cherylmc
ms.date: 08/24/2022
ms.service: virtual-wan
ms.topic: include
---

1. To generate a [WAN-level global profile](../articles/virtual-wan/global-hub-profile.md) VPN client configuration package, go to the **virtual WAN** (not the virtual hub).

1. In the left pane, select **User VPN configurations**.

1. Select the configuration for which you want to download the profile. If you have multiple hubs assigned to the same profile, expand the profile to show the hubs, then select one of the hubs that uses the profile.

1. Select **Download virtual WAN user VPN profile**.

1. On the download page, select **EAPTLS**, then **Generate and download profile**. A profile package (zip file) containing the client configuration settings is generated and downloads to your computer. The contents of the package depend on the authentication and tunnel choices for your configuration.
