---
title: Troubleshoot the Remote Desktop Web client - Azure Virtual Desktop
description: Troubleshoot issues you may experience with the Remote Desktop Web client when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 11/01/2022
ms.author: daknappe
---

# Troubleshoot the Remote Desktop Web client when connecting to Azure Virtual Desktop

This article describes issues you may experience with the [Remote Desktop Web client](users/connect-web.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) when connecting to Azure Virtual Desktop and how to fix them.

## General

In this section you'll find troubleshooting guidance for general issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-remote-desktop-client-doesnt-show-resources](includes/include-troubleshoot-remote-desktop-client-doesnt-show-resources.md)]

[!INCLUDE [troubleshoot-aadj-connections-all](includes/include-troubleshoot-azure-ad-joined-connections-all.md)]

### Web client stops responding or disconnects

If the Remote Desktop Web client stops responding or keeps disconnecting, try closing and reopening the browser. If it continues, try connecting using another browser or a one of the other [Remote Desktop clients](users/remote-desktop-clients-overview.md). You can also try clearing your browsing data. For Microsoft Edge, see [Microsoft Edge, browsing data, and privacy
](https://support.microsoft.com/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd).

### Web client out of memory

If you see the error message "*Oops, we couldn't connect to 'SessionDesktop'*" (where SessionDesktop is the name of the resource you're connecting to), then the web client has run out of memory.

To resolve this issue, you'll need to either reduce the size of the browser window so a smaller resolution will be used, or disconnect all existing connections and try connecting again. If you still encounter this issue after doing these things, contact your admin for help.

## Network

In this section you'll find troubleshooting guidance for network issues with the Remote Desktop client.

### Web client won't open

The URL for the Remote Desktop Web client is [https://client.wvd.microsoft.com/arm/webclient/](https://client.wvd.microsoft.com/arm/webclient/). If this page doesn't open, try the following:

1. Test your internet connection by opening another website in your browser, for example [https://www.bing.com](https://www.bing.com).

2. From PowerShell or Command Prompt on Windows, or Terminal on macOS, you can test if your DNS server can resolve the fully qualified domain name (FQDN) by running the following command:

   ```powershell
   nslookup client.wvd.microsoft.com
   ```

If neither of these work you most likely have a problem with your network connection. Contact your network admin for help.

> [!TIP]
> For the URLs of other Azure environments, such as Azure US Gov and Azure operated by 21Vianet, see [Connect to Azure Virtual Desktop with the Remote Desktop Web client](users/connect-web.md#access-your-resources).

## Authentication and identity

In this section you'll find troubleshooting guidance for authentication and identity issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-aadj-connections-web](includes/include-troubleshoot-azure-ad-joined-connections-web.md)]

## Issue isn't listed here

If your issue isn't listed here, see [Troubleshooting overview, feedback, and support for Azure Virtual Desktop](troubleshoot-set-up-overview.md) for information about how to open an Azure support case for Azure Virtual Desktop.