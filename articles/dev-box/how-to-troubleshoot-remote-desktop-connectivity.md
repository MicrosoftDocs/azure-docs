---  
title: Troubleshoot known dev box issues
description: Learn how to troubleshoot known connectivity and other issues with dev boxes to maintain a stable workflow.
author: RoseHJM    
ms.author: rosemalcolm  
ms.service: dev-box    
ms.topic: troubleshooting-general    
ms.date: 11/21/2025
  
#customer intent: As a developer, I want to find out about known connectivity and other issues with dev boxes so that I can maintain a stable and efficient workflow.
---

# Troubleshoot known dev box issues

This article lists known remote connectivity and other issues with dev boxes in Microsoft Dev Box. These issues can include connection issues, sign-in problems, high latencies, or performance issues.

If this article doesn't address your issue, try running the automated troubleshooting and repair tool from your dev box tile in the developer portal. For more information, see [Resolve connectivity issues with the Troubleshoot and Repair tool](how-to-troubleshoot-repair-dev-box.md). Also try the troubleshooting steps at [Troubleshoot dev box connectivity issues](how-to-resolve-dev-box-connectivity-issues.md).

## Prerequisites  
  
| Category | Requirements |
|---------|--------------|
| Tools | To connect to a dev box with the Windows App, [install the Windows App](https://apps.microsoft.com/detail/9n1f85v9t8bn) on your client device. |
| Permissions | To create or access a dev box, you need [Dev Box User](quickstart-configure-dev-box-service.md#provide-access-to-a-dev-box-project) permissions in a project that has an available dev box pool. If you don't have permissions to a project, contact your admin.|

## Connection issues

### The remote session disconnects after a period of time
Organizations can set a policy that disconnects idle dev boxes after a specified length of time. Check with your project administrator.

### The message "You were disconnected from \<dev-box-name\> because your session was locked" appears
You might see this message if your organization sets a policy to disconnect idle dev boxes after a specified length of time, and has the single-sign on (SSO) feature enabled. Select **Reconnect** to access your dev box again.
### Windows update takes a long time to install
Windows update might take 30 minutes or more to install. If you can't connect to your dev box immediately after Windows update, retry after 15–30 minutes.

### The dev box can't connect after the network connection is disabled
If you disabled the network connection in your dev box and are unable to connect, wait for up to four hours and retry. The agent periodically checks and reenables the connection every four hours.

### The dev box can't connect after upgrading to a Windows Insider build
Enabling the Windows Insider channel in your dev box isn't supported. Upgrading your dev box to a Windows Insider build might result in being unable to connect to your dev box.

### The remote connection reports UDP issues
If Universal Data Protocol (UDP) port 3478 is blocked in your network, such as on your home router, your remote connection might have problems using UDP. For the best experience, keep UDP port 3478 open.

## Latency issues

### The remote session has high network latency and lags
If you use a virtual private network (VPN) on your client computer or dev box, you might experience network latency. A forced-tunnel VPN, which routes all IP addresses, can increase this latency. Check with your network administrator.

## Sign-in issues

### The dev box hangs at the sign-in welcome screen when reconnecting after being locked for idleness
You might have to close the remote session and connect again. 

### When attempting to sign in to a dev box by using Windows Hello for Business based authentication, error code 0x8007013d appears
If signing in to a dev box via Windows Hello for Business based authentication method fails with error code 0x8007013d, the Windows Hello certificate might not be properly installed. To fix the issue, first be sure to remember your correct password. Then run `certutil -DeleteHelloContainer` on your client computer, not your dev box, sign out, and sign back in.

## Dev box application or performance issues

### Teams calls don't work well in the dev box
If Teams calls don't work well in your dev box, open the **About** page in Teams and check that the **AVD Media Optimized** feature is installed. If this feature isn't installed, or if your dev box is running Windows Enterprise N or `KN` SKU, contact your dev box administrator.

### Teams calls from the dev box can't access the camera or microphone
If Teams calls from the dev box can't access a camera or microphone, open **Settings** on your local client computer, go to **Privacy & security**, and make sure **Camera** or **Microphone** is set to **On** for all **Microsoft Teams VDI** apps.

### CPU profiling isn't available on an AMD-based dev box
It's a known Windows issue that CPU profiling doesn't work on AMD-based dev boxes. To fix the issue, go to **Turn Windows features on or off**, uninstall **Hyper-V** and **Virtual Machine Platform**, and reboot the machine.

### Enabling nested virtualization on a Hyper-V VM causes issues in an AMD-based dev box
Enabling nested virtualization on a Hyper-V virtual machine (VM) in an AMD-based dev box by setting `Set-VMProcessor -VMName <name> -ExposeVirtualizationExtensions $true` might prevent the Hyper-V VM from booting. To avoid this issue, use an Intel-based dev box. 

### The dev box has display issues
Display issues like incorrect window scaling, blurry content, or broken screen paint might be due to a screen dots per inch (DPI) rendering issue. These issues can happen when using multiple monitors or switching between different physical machines. To fix the issue, disconnect and reconnect to the dev box.

## Related content  

- [Resolve connectivity issues with the Troubleshoot and Repair tool](how-to-troubleshoot-repair-dev-box.md)
- [Troubleshoot dev box connectivity issues](how-to-resolve-dev-box-connectivity-issues.md)
