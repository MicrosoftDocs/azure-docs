---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 05/03/2024
 ms.author: cherylmc
---

1. At the top of the **Point-to-site configuration** page, click **Download VPN client**. It takes a few minutes for the client configuration package to generate.

1. Your browser indicates that a client configuration zip file is available. It's named the same name as your gateway.

1. Extract the downloaded zip file.

1. Browse to the unzipped "AzureVPN" folder.

1. Make a note of the location of the “azurevpnconfig.xml” file. The azurevpnconfig.xml contains the setting for the VPN connection. You can also distribute this file to all the users that need to connect via e-mail or other means. The user will need valid Microsoft Entra ID credentials to connect successfully.
