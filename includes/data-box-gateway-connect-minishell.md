---
author: stevenmatthew
ms.service: databox  
ms.topic: include
ms.date: 10/15/2020
ms.author: shaas
---

Depending on the operating system of the client, the procedures to remotely connect to the device are different.

### Remotely connect from a Windows client

Before you begin, make sure that your Windows client is running Windows PowerShell 5.0 or later.

Follow these steps to remotely connect from a Windows client.

1. Run a Windows PowerShell session as an administrator.
2. Make sure that the Windows Remote Management service is running on your client. At the command prompt, type:

    `winrm quickconfig`

3. Assign a variable to the device IP address.

    $ip = "<device_ip>"

    Replace `<device_ip>` with the IP address of your device.

4. To add the IP address of your device to the client’s trusted hosts list, type the following command:

    `Set-Item WSMan:\localhost\Client\TrustedHosts $ip -Concatenate -Force`

5. Start a Windows PowerShell session on the device:

    `Enter-PSSession -ComputerName $ip -Credential $ip\EdgeUser -ConfigurationName Minishell`

6. Provide the password when prompted. Use the same password that is used to sign into the local web UI. The default local web UI password is *Password1*. When you successfully connect to the device using remote PowerShell, you see the following sample output:  

    ```
    Windows PowerShell
    Copyright (C) Microsoft Corporation. All rights reserved.
    
    PS C:\WINDOWS\system32> winrm quickconfig
    WinRM service is already running on this machine.
    PS C:\WINDOWS\system32> $ip = "10.100.10.10"
    PS C:\WINDOWS\system32> Set-Item WSMan:\localhost\Client\TrustedHosts $ip -Concatenate -Force
    PS C:\WINDOWS\system32> Enter-PSSession -ComputerName $ip -Credential $ip\EdgeUser -ConfigurationName Minishell

    WARNING: The Windows PowerShell interface of your device is intended to be used only for the initial network configuration. Please engage Microsoft Support if you need to access this interface to troubleshoot any potential issues you may be experiencing. Changes made through this interface without involving Microsoft Support could result in an unsupported configuration.
    [10.100.10.10]: PS>
    ```

### Remotely connect from a Linux client

On the Linux client that you'll use to connect:

- [Install the latest PowerShell Core for Linux](/powershell/scripting/install/installing-powershell-core-on-linux) from GitHub to get the SSH remoting feature. 
- [Install only the `gss-ntlmssp` package from the NTLM module](https://github.com/Microsoft/omi/blob/master/Unix/doc/setup-ntlm-omi.md). For Ubuntu clients, use the following command:
    - `sudo apt-get install gss-ntlmssp`

For more information, go to [PowerShell remoting over SSH](/powershell/scripting/learn/remoting/ssh-remoting-in-powershell-core).

Follow these steps to remotely connect from an NFS client.

1. To open PowerShell session, type:

    `pwsh`
 
2. For connecting using the remote client, type:

    `Enter-PSSession -ComputerName $ip -Authentication Negotiate -ConfigurationName Minishell -Credential ~\EdgeUser`

    When prompted, provide the password used to sign into your device.
 
> [!NOTE]
> This procedure does not work on macOS.
