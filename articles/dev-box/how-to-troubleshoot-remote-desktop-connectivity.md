---  
title: Troubleshoot known Dev Box Remote Desktop issues    
description: Learn how to troubleshoot known Remote Desktop connection issues with dev doxes to maintain a stable workflow.
author: RoseHJM    
ms.author: rosemalcolm  
ms.service: dev-box    
ms.topic: troubleshooting-general    
ms.date: 10/22/2024
  
#customer intent: As a developer, I want to troubleshoot my Remote Desktop connection issues with dev boxes so that I can maintain a stable and efficient workflow.    
---  
  
# Troubleshoot known Remote Desktop connectivity issues with dev boxes  
  
If you're experiencing problems with your Remote Desktop connection to your dev box, this guide can help you find and fix the issues quickly. Whether it's frequent disconnections, latency, or sign-in problems, we've got solutions that can get you back on track.  
  
## Prerequisites  
  
Before you begin troubleshooting, ensure you have:  
  
- Access to your dev box.  
- Administrative permissions if needed.  
- An understanding of your organization's policies related to dev boxes.  
  
## Does your Remote Desktop session disconnect frequently?
Organizations can set a policy that disconnects dev boxes after a specified length of time. 

## You see a window pop-up with message "You were disconnected from \<dev-box-name\> because your session was locked." 
You might see this message if your organization sets a policy to disconnect idle dev boxes after a specified length of time, and has the single-sign on (SSO) feature enabled. Select **Reconnect** to access your dev box again. 

## My dev box is stuck at sign-in welcome screen when I try to reconnect after dev box is locked due to being idle. 
You might have to close the remote desktop session and connect again. 

## Does your Remote Desktop session have a higher network latency and feel laggy? 
If you're using a VPN on your client computer or dev box, you might experience network latency. A forced-tunnel VPN, which routes all IP addresses, can increase this latency. Check with your network administrator.

## I can't enable the Windows insider channel in my dev box.
Enabling Windows insider channel in your dev box isn't supported. Upgrading your dev box to a Windows insider build might result in unable to connect to your dev box. 

## Windows update is taking a long time to install.
Windows update might take 30 minutes or more to install. If you can't connect to your dev box immediately after Windows update, retry after 15 – 30 minutes. 

## I disabled the network connection in my dev box and unable to connect.
If you disabled the network connection in your dev box and are unable to connect, wait for up to 4 hours and retry. Our agent periodically checks and re-enable it every 4 hours. 

## Teams calls don't work well in my dev box.
If Teams calls don't work well in your dev box, open the About page in Teams and check that the **AVD Media Optimized** feature is installed. If this feature isn't installed, or if your dev box is running Windows Enterprise N or KN SKUs, contact your dev box administrator.  

## I can't connect to my dev box from my client computer.
If CPU profiling doesn't work on an AMD-based dev box, it's a known Windows issue. To fix it, go to **Turn Windows features on or off,** uninstall **Hyper-V** and **Virtual Machine Platform,** and reboot.

## Do an AMD-based dev box support nested virtualization?
AMD-based dev boxes don't support Hyper-V VMs with nested virtualization. After setting `Set-VMProcessor -VMName <name> -ExposeVirtualizationExtensions $true`, VMs inside dev box won't boot. To avoid this issue, use Intel based dev box. 

## When I try to sign in to dev box by using Windows Hello for Business based authentication, I get error code 0x8007013d.
When you sign in to dev box via Windows Hello for Business based authentication method and it fails with error code 0x8007013d, it could be due to Windows Hello certificate not properly installed. To fix it, first make sure you remember your password. Run `certutil -DeleteHelloContainer` command on your client computer (not your dev box), sign out and log back in. 

## My dev box has display issues. 
If you notice display issues like incorrect window scaling, blurry content, or broken screen paint, it might be due to a screen DPI rendering issue. These issues usually happen when using multiple monitors or switching between different physical machines. To fix it, disconnect and reconnect the dev box.

## My Remote Desktop connection is reporting UDP issues.
If UDP port 3478 is blocked in your network (for example, on your home router), your Remote Desktop connection might have problems using UDP. For the best experience, keep UDP port 3478 open.   

## Related content  
  
- [Troubleshoot and resolve dev box Remote Desktop connectivity issues](how-to-troubleshoot-repair-dev-box.md)
