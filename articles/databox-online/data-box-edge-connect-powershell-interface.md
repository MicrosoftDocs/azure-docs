---
title: Connect to and manage Microsoft Azure Data Box Edge device via the Windows PowerShell interface | Microsoft Docs
description: Describes how to connect to and then manage Data Box Edge via the Windows PowerShell interface.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/12/2019
ms.author: alkohli
---
# Use Windows PowerShell to manage Azure Data Box Edge

Azure Data Box Edge is a storage solution that allows you to process data and send it over the network to Azure. This article describes some of the configuration and management tasks that you can perform on the Data Box Edge device. You can manage your Data Box Edge using the Azure portal UI, the local web UI, and the Windows PowerShell interface of the device.

This article focuses on the tasks that you can perform using the PowerShell interface. PowerShell provides a command-line interface that is built in a constrained runspace with dedicated cmdlets so that only a set of restricted operations can be performed. Use the PowerShell interface to get Azure container logs, reset the device, generate a log package for Microsoft Support, and run diagnostic tests.


This article includes the following tutorials:

- Connect to the PowerShell interface
- Reset the device
- Boot up in non-DHCP environment
- View device information
- Get container logs
- Run diagnostics tests


## Connect to the PowerShell interface

Depending on the operating system of client you are using, the procedures to remotely connect to the device are different.

### Remotely connect from a Windows client

Before you begin, make sure that your Windows client is running Windows PowerShell 5.0 or later.

Follow these steps to remotely connect from a Windows client.

1. Run Windows PowerShell session as an administrator.
2. Make sure that Windows Remote Management service is running on your client. At the command prompt, type:

    `winrm quickconfig`

3. Assign a variable to the device IP address.

    $ip = "<device_ip>"

    Replace `<device_ip>` with the IP address of your device.

4. To add the IP address of your device to the client’s trusted hosts list, type the following command:

    `Set-Item WSMan:\localhost\Client\TrustedHosts $ip -Concatenate -Force`

4. Start a Windows PowerShell session on the device:

    `Enter-PSSession -ComputerName $ip -Credential $ip\EdgeUser -ConfigurationName Minishell`

5. Provide the password when prompted. This is the same password that is used to sign into the local web UI, *Password1*. When you successfully connect to the device using remote PowerShell, you see the following sample output:  
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

### Remotely connect from an NFS client

Before you begin, ensure that Follow these steps to remotely connect from a Linux client.


1. Run PowerShell as an administrator and run the following commands- 
 
 
If you experience any device issues, you can create a Support package from the system logs. Microsoft Support uses this package to troubleshoot the issue. To generate a Support package, perform the following steps:

1. In the local web UI, go to **Contact Support** and click **Create Support package**.

    ![Create Support package 1](media/data-box-local-web-ui-admin/create-support-package-1.png)

2. A Support package is gathered. This operation takes a few minutes.

    ![Create Support package 2](media/data-box-local-web-ui-admin/create-support-package-2.png)

3. Once the Support package creation is complete, click **Download Support package**. 

    ![Create Support package 4](media/data-box-local-web-ui-admin/create-support-package-4.png)

4. Browse and choose the download location. Open the folder to view the contents.

    ![Create Support package 5](media/data-box-local-web-ui-admin/create-support-package-5.png)

## Upload certificate

You can upload your own certificate via the PowerShell interface of the device.

1. Connect to the PowerShell interface.
2. Use the `Set-HcsCertificate` cmdlet to upload the certificate. When prompted, provide the following:

    - `CertificateFilePath` - Path to the share that contains the certificate file in *.pfx* format.
    - `CertificatePassword` - A password assigned by the user to protect the certificate.
    - `Credentials` - Username and password to access the share that contains the certificate.

    The following example shows the usage of this cmdlet:

    ```
   Set-HcsCertificate -Scope LocalWebUI -CertificateFilePath "\\myfileshare\certificates\mycert.pfx" -CertificatePassword "mypassword" -Credentials "Username/Password"
    ``` 

## Boot up in non-DHCP environment

If you boot up in a non-DHCP environment, follow these steps to deploy the virtual machine for your Data Box Gateway.

1. Connect to the Windows PowerShell interface of the device.
2. Use the `Get-HcsIpAddress` cmdlet to list the network interfaces enabled on your virtual device. If your device has a single network interface enabled, the default name assigned to this interface is `Ethernet`.

    The following example shows the usage of this cmdlet:

    ```
    [10.100.10.10]: PS>Get-HcsIpAddress

    OperationalStatus : Up
    Name              : Ethernet
    UseDhcp           : True
    IpAddress         : 10.100.10.10
    Gateway           : 10.100.10.1
    ```

3. Use the `Set-HcsIpAddress` cmdlet to configure the network. See the following example:

    ```
    Set-HcsIpAddress –Name Ethernet –IpAddress 10.161.22.90 –Netmask 255.255.255.0 –Gateway 10.161.22.1
    ```

## View device information

1. Connect to the Windows PowerShell interface.
2. Use the `Get-HcsApplianceInfo` to get the information for your Data Box Edge or Data Box Gateway device.

    The following example shows the usage of this cmdlet:

    ```
    [10.100.10.10]: PS>Get-HcsApplianceInfo
    
    
    Id                            : b2044bdb-56fd-4561-a90b-407b2a67bdfc
    FriendlyName                  : DBE-NBSVFQR94S6
    Name                          : DBE-NBSVFQR94S6
    SerialNumber                  : HCS-NBSVFQR94S6
    DeviceId                      : 40d7288d-cd28-481d-a1ea-87ba9e71ca6b
    Model                         : Virtual
    FriendlySoftwareVersion       : Data Box Gateway 1902
    HcsVersion                    : 1.4.771.324
    IsClustered                   : False
    IsVirtual                     : True
    LocalCapacityInMb             : 1964992
    SystemState                   : Initialized
    SystemStatus                  : Normal
    Type                          : DataBoxGateway
    CloudReadRateBytesPerSec      : 0
    CloudWriteRateBytesPerSec     : 0
    IsInitialPasswordSet          : True
    FriendlySoftwareVersionNumber : 1902
    UploadPolicy                  : All
    DataDiskResiliencySettingName : Simple
    ApplianceTypeFriendlyName     : Data Box Gateway
    IsRegistered                  : False
    ```

Here is a table summarizing some of the important appliance information:

| Parameter                             | Description                                                                                                                                                  |   |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| FriendlyName                   | The friendly name of the device as configured through the local web UI during device deployment. The default   friendly name is the device serial number.  |   |
| SerialNumber                   | The device serial number is assigned at the factory and is XX characters long.                                                                             |   |
| Model                          | The model for your Data Box Edge or Data Box Gateway device. The model is virtual for Data Box Gateway and   physical for Data Box Edge.                   |   |
| FriendlySoftwareVersion        | The friendly string that corresponds to the device software version. For a system running   GA, the friendly software version would be Data Box Edge XXXX. |   |
| HcsVersion                     | The HCS software version running on your device. For instance, the HCS software   version corresponding to Data Box Edge GA XXX is 1.4.771.324.            |   |
| LocalCapacityInMb              | The total local capacity of the device in Megabits.                                                                                                        |   |
| IsRegistered                   | This value indicates if your device is activated with the service.                                                                                         |   |

## Connect to Support session

1. Run Windows PowerShell session as an administrator.
2. Assign a variable to the device IP address.

    $ip = "<device_ip>"

    Replace `<device_ip>` with the IP address of your device.
 
3. Start a Windows PowerShell session on the device and connect to the Support runspace.

    ```
    Set-Item WSMan:\localhost\Client\TrustedHosts $ip -Force
    $minishellSession= New-PSSession -ComputerName $ip -ConfigurationName "Minishell" -Credential ~\EdgeUser  
    Invoke-Command -Session $minishellSession -ScriptBlock { Enable-HcsSupportAccess }
    ```  
4. This command will output an encrypted key. Send this key to the Support Engineer in email. Microsoft will send you the decrypted password for the support session.

    ``` 
    $supportSession = New-PSSession -ComputerName $ip -Credential ~\EdgeSupport -ConfigurationName SupportSession 
    Enter-PSSession -Session $supportSession
    ```
5. The support session automatically disables after 8 hours.

Get-HcsSupportAccessKey - to get the access key if the support session is already enabled


Get-HcsNodeSupportPackage


## Next steps

- Review the [Data Box Edge system requirements](https://aka.ms/dbe-docs).
- Understand the [Data Box Edge limits](https://aka.ms/dbe-docs).
- Deploy [Azure Data Box Edge](https://aka.ms/dbe-docs) in Azure portal.
