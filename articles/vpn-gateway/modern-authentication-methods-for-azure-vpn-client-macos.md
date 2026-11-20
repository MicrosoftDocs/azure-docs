---
title: Modern Authentication for Azure VPN on macOS
description: Azure VPN Client on macOS supports passkey and security key sign-in. Learn how to authenticate with Entra ID on Intune-managed devices step by step.
ms.date: 11/18/2026
ms.topic: tutorial
author: kri1603
ms.author: kri
ms.service: azure-vpn-gateway
ai-usage: ai-assisted
---

# Modern authentication methods for Azure VPN Client (macOS)

Azure VPN Client supports passkey and security key authentication, including authentication with a YubiKey, for Microsoft Entra ID sign-in on Intune-managed macOS devices.

> [!NOTE]
> In this context, a managed device is a macOS device enrolled in and managed through Microsoft Intune. Passkey and security key authentication aren't currently supported on unmanaged macOS devices.

## Passkey authentication

To authenticate with a passkey on an Intune-managed macOS device:

1.  Open Azure VPN Client and select the VPN connection.

2.  Select Connect.

3.  When prompted to sign in, select **Sign in with a passkey**.

> :::image type="content" source="media/modern-authentication-methods-for-azure-vpn-client-macos/microsoft-sign-in-passkey-options.png" alt-text="Screenshot of Microsoft sign-in options showing passkey and GitHub sign-in choices.":::

4.  Select **Continue**.

> :::image type="content" source="media/modern-authentication-methods-for-azure-vpn-client-macos/company-portal-passkey-sign-in-macos.png" alt-text="Screenshot of sign-in dialog confirming passkey use with Company Portal and a Continue button.":::

5.  If prompted, use **Touch ID or your Mac password** to authorize Company Portal to access the saved passkey.

> :::image type="content" source="media/modern-authentication-methods-for-azure-vpn-client-macos/touch-id-passkey-unlock-prompt.png" alt-text="Screenshot of Touch ID prompt for Company Portal to unlock and use its saved passkey.":::

6.  After authentication succeeds, the VPN connection is established.

## Security key authentication

> [!NOTE]
> You must register the security key as an authentication method for the account before you can use it for sign-in.

To authenticate with a registered security key, such as a YubiKey, on an Intune-managed macOS device:

1.  From the available sign-in options, select **Use Security Key**.

> :::image type="content" source="media/modern-authentication-methods-for-azure-vpn-client-macos/select-security-key-authentication-method.png" alt-text="Screenshot of Sign In dialog with Use Security Key option selected among sign-in choices.":::

2.  Select **Continue**.

3.  Insert and activate the security key when prompted to complete authentication.
> :::image type="content" source="media/modern-authentication-methods-for-azure-vpn-client-macos/use-security-key-prompt.png" alt-text="Screenshot of Use Security Key prompt for Company Portal with Cancel button.":::

4.  Enter the security key PIN when prompted.
