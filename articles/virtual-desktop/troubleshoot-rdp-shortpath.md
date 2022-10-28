---
title: Troubleshoot RDP Shortpath for public networks - Azure Virtual Desktop
description: Learn how to troubleshoot RDP Shortpath for public networks for Azure Virtual Desktop, which establishes a UDP-based transport between a Remote Desktop client and session host.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 09/06/2022
ms.author: daknappe
---
# Troubleshoot RDP Shortpath for public networks

If you're having issues when using RDP Shortpath for public networks, use the information in this article to help troubleshoot.

### Verifying STUN server connectivity and NAT type

You can validate connectivity to the STUN endpoints and verify that basic UDP functionality works by running the `Test-Shortpath.ps1` PowerShell script.

1. Open a PowerShell prompt and run the following command to download the PowerShell script. Alternatively, go to [our GitHub repo](https://github.com/Azure/RDS-Templates/tree/master/AVD-TestShortpath) and download the `Test-Shortpath.ps1` file.

   ```powershell
   Invoke-WebRequest -Uri https://github.com/Azure/RDS-Templates/raw/master/AVD-TestShortpath/Test-Shortpath.ps1 -OutFile Test-Shortpath.ps1
   ```

1. You may need to unblock the file as the PowerShell script isn't digitally signed. You can unblock the file by running the following command:

   ```powershell
   Unblock-File -Path .\Test-Shortpath.ps1
   ```

1. Finally, run the PowerShell script by running the following command:

   ```powershell
   .\Test-Shortpath.ps1
   ```

The output will look similar to below if connectivity is successful:

```
Checking DNS service ... OK
Checking STUN on server 20.202.0.107:3478 ... OK
Checking STUN on server 13.107.17.41:3478 ... OK


STUN works and your NAT type appears to be 'cone shaped'.
Shortpath for public networks is likely to work on this host.
```