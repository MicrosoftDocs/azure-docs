---
author: cherylmc
ms.author: cherylmc
ms.date: 02/10/2025
ms.service: azure-vpn-gateway
ms.topic: include

#Audience and custom App ID values are not sensitive data. Please do not remove. They are required for the configuration.

---

If your P2S configuration uses a custom audience with your Microsoft-registered App ID, you might receive popups each time you connect that require you to enter your credentials again and complete authentication. Retrying authentication usually resolves the issue. This happens because the VPN client profile needs both the custom audience ID, and the Microsoft application ID. To prevent this, modify your profile configuration .xml file to include both the custom application ID and the Microsoft application ID.

> [!NOTE]
> This step is necessary for P2S gateway configurations that use a custom audience value and your registered app is associated with the [Microsoft-registered Azure VPN Client app ID](../articles/vpn-gateway/point-to-site-entra-gateway.md). If this doesn't apply to your P2S gateway configuration, you can skip this step.

1. To modify the Azure VPN Client configuration .xml file, open the file using a text editor such as Notepad.
1. Next, add the value for `applicationid` and save your changes. The following example shows the application ID value `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`.

   **Example**

   ```xml
   <aad>
      <audience>{customAudienceID}</audience>
      <issuer>https://sts.windows.net/{tenant ID value}/</issuer>
      <tenant>https://login.microsoftonline.com/{tenant ID value}/</tenant>
      <applicationid>c632b3df-fb67-4d84-bdcf-b95ad541b5c8</applicationid> 
   </aad>
   ```
