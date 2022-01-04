---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/15/2021
ms.author: alkohli
---

Depending on the operating system of client, the procedures to remotely connect to the device are different.

### Remotely connect from a Windows client


#### Prerequisites

Before you begin, make sure that:

- Your Windows client is running Windows PowerShell 5.0 or later.
- Your Windows client has the signing chain (root certificate) corresponding to the node certificate installed on the device. For detailed instructions, see [Install certificate on your Windows client](../articles/databox-online/azure-stack-edge-gpu-manage-certificates.md#import-certificates-on-the-client-accessing-the-device).
- The `hosts` file located at `C:\Windows\System32\drivers\etc` for your Windows client has an entry corresponding to the node certificate in the following format:

    `<Device IP>    <Node serial number>.<DNS domain of the device>`

    Here is an example entry for the `hosts` file:
 
    `10.100.10.10    1HXQG13.wdshcsso.com`
  

#### Detailed steps

Follow these steps to remotely connect from a Windows client.

1. Run a Windows PowerShell session as an administrator.
2. Make sure that the Windows Remote Management service is running on your client. At the command prompt, type:

    ```powershell
    winrm quickconfig
    ```

    For more information, see [Installation and configuration for Windows Remote Management](/windows/win32/winrm/installation-and-configuration-for-windows-remote-management#quick-default-configuration).

3. Assign a variable to the connection string used in the `hosts` file.

    ```powershell
    $Name = "<Node serial number>.<DNS domain of the device>"
    ``` 

    Replace `<Node serial number>` and `<DNS domain of the device>` with the node serial number and DNS domain of your device. You can get the values for node serial number from the **Certificates** page and DNS domain from the **Device** page in the local web UI of your device.

4. To add this connection string for your device to the client’s trusted hosts list, type the following command:

    ```powershell
    Set-Item WSMan:\localhost\Client\TrustedHosts $Name -Concatenate -Force
    ```

5. Start a Windows PowerShell session on the device:

    ```powershell
    Enter-PSSession -ComputerName $Name -Credential ~\EdgeUser -ConfigurationName Minishell -UseSSL
    ```

    If you see an error related to trust relationship, then check if the signing chain of the node certificate uploaded to your device is also installed on the client accessing your device.

6. Provide the password when prompted. Use the same password that is used to sign into the local web UI. The default local web UI password is *Password1*. When you successfully connect to the device using remote PowerShell, you see the following sample output:  

    ```
    Windows PowerShell
    Copyright (C) Microsoft Corporation. All rights reserved.
    
    PS C:\WINDOWS\system32> winrm quickconfig
    WinRM service is already running on this machine.
    PS C:\WINDOWS\system32> $Name = "1HXQG13.wdshcsso.com"
    PS C:\WINDOWS\system32> Set-Item WSMan:\localhost\Client\TrustedHosts $Name -Concatenate -Force
    PS C:\WINDOWS\system32> Enter-PSSession -ComputerName $Name -Credential ~\EdgeUser -ConfigurationName Minishell -UseSSL

    WARNING: The Windows PowerShell interface of your device is intended to be used only for the initial network configuration. Please engage Microsoft Support if you need to access this interface to troubleshoot any potential issues you may be experiencing. Changes made through this interface without involving Microsoft Support could result in an unsupported configuration.
    [1HXQG13.wdshcsso.com]: PS>
    ```

When you use the `-UseSSL` option, you are remoting via PowerShell over *https*. We recommend that you always use *https* to remotely connect via PowerShell. Within trusted networks, remoting via PowerShell over http is acceptable. You first enable remote PowerShell over http in the local UI. Then you can connect to PowerShell interface of the device by using the preceding procedure without the `-UseSSL` option.

If you are not using the certificates (we recommend that you use the certificates!), you can skip the certificate validation check by using the session options: `-SkipCACheck -SkipCNCheck -SkipRevocationCheck`.

```powershell
$sessOptions = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck 
Enter-PSSession -ComputerName $Name -Credential ~\EdgeUser -ConfigurationName Minishell -UseSSL -SessionOption $sessOptions    
```
Here is an example output when skipping the certificate check:

```powershell
PS C:\WINDOWS\system32> $Name = "1HXQG13.wdshcsso.com"
PS C:\WINDOWS\system32> $sessOptions = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck
PS C:\WINDOWS\system32> $sessOptions

MaximumConnectionRedirectionCount : 5
NoCompression                     : False
NoMachineProfile                  : False
ProxyAccessType                   : None
ProxyAuthentication               : Negotiate
ProxyCredential                   :
SkipCACheck                       : True
SkipCNCheck                       : True
SkipRevocationCheck               : True
OperationTimeout                  : 00:03:00
NoEncryption                      : False
UseUTF16                          : False
IncludePortInSPN                  : False
OutputBufferingMode               : None
MaxConnectionRetryCount           : 0
Culture                           :
UICulture                         :
MaximumReceivedDataSizePerCommand :
MaximumReceivedObjectSize         :
ApplicationArguments              :
OpenTimeout                       : 00:03:00
CancelTimeout                     : 00:01:00
IdleTimeout                       : -00:00:00.0010000

PS C:\WINDOWS\system32> Enter-PSSession -ComputerName $Name -Credential ~\EdgeUser -ConfigurationName Minishell -UseSSL -SessionOption $sessOptions
WARNING: The Windows PowerShell interface of your device is intended to be used only for the initial network configuration. Please
engage Microsoft Support if you need to access this interface to troubleshoot any potential issues you may be experiencing.
Changes made through this interface without involving Microsoft Support could result in an unsupported configuration.
[1HXQG13.wdshcsso.com]: PS>
```

> [!IMPORTANT]
> In the current release, you can connect to the PowerShell interface of the device only via a Windows client. The `-UseSSL` option does not work with the Linux clients.

<!--### Remotely connect from a Linux client-->

<!--On the Linux client that you'll use to connect:

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
> This procedure does not work on Mac OS.-->