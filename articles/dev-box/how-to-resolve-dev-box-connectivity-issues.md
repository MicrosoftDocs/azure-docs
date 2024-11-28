---  
title: Resolve Dev Box connectivity issues    
description: Learn how to resolve connection issues with dev boxes, including disconnections and sign-in problems, to maintain a stable workflow.
author: RoseHJM    
ms.author: rosemalcolm  
ms.service: dev-box    
ms.topic: troubleshooting-general    
ms.date: 10/22/2024
  
#customer intent: As a developer, I want to troubleshoot my Remote Desktop connection issues with dev boxes so that I can maintain a stable and efficient workflow.    
---  
  
# Resolve connectivity issues with dev boxes  
  
If you're experiencing problems with your Remote Desktop connection to your dev box, this guide can help you find and fix the issues quickly. Whether it's frequent disconnections, latency, or sign-in problems, we've got solutions that can get you back on track.  
  
## Prerequisites  
  
Before you begin troubleshooting, ensure you have:  
  
- Access to your dev box.  
- Administrative permissions if needed.  
- An understanding of your organization's policies related to dev boxes.  

## Steps for troubleshooting 
  
Remote Desktop connections are essential for accessing your Dev Box. However, connectivity issues can sometimes arise due to various factors. This guide provides a comprehensive step-by-step approach to troubleshooting common Remote Desktop connection problems, ensuring that your workflow remains uninterrupted.
 
Before proceeding with troubleshooting, ensure that your Remote Desktop app is updated and both your client computer, and Dev Box have the latest updates installed. 

Any improper network configurations on your Dev Box can disrupt Remote Desktop connections. 

Additionally, if you haven't accessed your Dev Box in the past three months, check if Microsoft Entra ID removed you due to inactivity. To regain access, contact the Cloud PC Service support team.

### Step 0: Preliminary Checks
- **Internet Connection:** Verify that your local machine has an active internet connection.
- **Dev Box Status:** Confirm that your Dev Box is running through the Dev Box portal.
- **Proxy Settings:** Incorrect internet proxy settings can interfere with the Remote Desktop experience, so ensure these settings are correctly configured.

### Step 1: Windows Update and App Restart
- **Pending Updates:** If Windows is updating, it can take up to 30 minutes, during which your Dev Box won't connect.
- **Restart Remote Desktop:** Close all instances of the Remote Desktop app, terminate any 'msrdc.exe' and 'msrdcw.exe' processes via Task Manager, and then reopen the app to attempt reconnection.

### Step 2: Address App Hang and Authentication Issues
- **App Hang:** If the Remote Desktop app hangs, capture a process dump of MSRDC.exe and create a support request. Restart your computer and try connecting again.
- **Authentication Errors:** If denied sign-in despite correct credentials, check the join status using `dsregcmd.exe /status`. Resolve any errors with the helpdesk and restart your computer. If authentication errors persist, unsubscribe and resubscribe to your Dev Box pool in the app. 

### Step 3: Browser Client Connection
- **Browser Access:** Attempt to connect via the browser client by visiting https://DevBox.microsoft.com and selecting "Open in browser".
- **Black Screen Issue:** If the RDP window is black, "Shutdown" or "Stop" your Dev Box via the portal and restart it.

### Step 4: Connection Drops During High CPU Load
**Registry Adjustment:** If you experience frequent connection drops with the Remote Desktop app during high CPU load, ensure your Dev Box has the latest Windows 11 build. Set the `SetGpuRealtimePriority` registry value to DWORD 2 in the Dev Box and restart.

```
key: HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations
value name: SetGpuRealtimePriority
value: DWORD 2
```

You can set the `SetGpuRealtimePriority` registry value by using this command in an elevated shell:

```
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations" /v SetGpuRealtimePriority /d 2 /t REG_DWORD
```  

### Step 5: Connection Drops During Low CPU Usage

If you experience frequent connection drops with the Remote Desktop app despite low CPU usage on the Dev Box, switch Remote Desktop to use TCP instead of UDP. 

You can configure this setting through a registry edit, or through Group Policy. 

#### Use TCP instead of UDP - Registry edit:
Close the Remote Desktop app, apply the following registry setting on your client computer, and try reconnecting.

```
key: HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client
value name: fClientDisableUDP
value: DWORD 1
```

You can set the `fClientDisableUDP` registry value by using this command in an elevated shell:

```
reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services\Client" /v fClientDisableUDP /d 1 /t REG_DWORD
```

#### Use TCP instead of UDP - Group policy
Alternatively, use Group Policy Editor on your Dev Box to set RDP transport protocols to "Use only TCP".

1. Open the Group Policy Editor on your Dev Box.
2. Navigate to **Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Connections**.
3. Open the policy setting **Select RDP transport protocols**.
4. Set it to **Enabled**.
5. For **Select Transport Type**, select **Use only TCP**.

If the preceding steps don't resolve your issue, contact the Dev Box team support by creating an incident [here]. For urgent or widespread issues, raise the priority of the incident or email the Dev Box team directly at DevBoxdisc@microsoft.com. 

Include the following details in your incident report:

- The time the issue occurred
- Impacted users
- A detailed description of the problem
- The Activity ID from your Remote Desktop session, if available. You can find this ID by clicking on the connection bar during your session.

   :::image type="content" source="media/how-to-resolve-dev-box-connectivity-issues/troubleshooting-connection-bar.png" alt-text="Alt text":::

- Include information from the connection dialog.
 
   :::image type="content" source="media/how-to-resolve-dev-box-connectivity-issues/troubleshooting-connection-information-dialog.png" alt-text="alt text":::

In macOS clients, use the terminal to change connections to TCP instead of UDP:

In the app:
```
defaults write com.microsoft.rdc.macos ClientSettings.EnableAvdUdpSideTransport false
```

In the beta app:
```
defaults write com.microsoft.rdc.osx.beta ClientSettings.EnableAvdUdpSideTransport false
```


## Related content
- [Troubleshoot and resolve dev box Remote Desktop connectivity issues](how-to-troubleshoot-repair-dev-box.md)
