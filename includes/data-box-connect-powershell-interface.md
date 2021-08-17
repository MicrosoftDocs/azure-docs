---
author: alkohli
ms.service: databox  
ms.subservice: pod
ms.topic: include
ms.date: 08/17/2021
ms.author: alkohli
---

Depending on the software version, that your Data Box is running, you may need to take different steps to connect to the PowerShell interface of the device.


## [v2.9 and earlier](#tab/a)



## [v3.0 to v4.0](#tab/b)

1. Open an elevated PowerShell session.

1. Initiate a PowerShell session. Type:

    ```powershell
    Set-Item wsman:\localhost\Client\TrustedHosts <IPv4_address for your Data Box> 
    ``` 

1. Get password for your Data Box order resource in the Azure portal. 

1. Convert the password to a secure string. Type:

    ```powershell
    $Pwd = ConvertTo-SecureString <password from Azure portal> -AsPlainText -Force 
    ```
1. Provide the username and password for the session. The default username is `StorSimpleAdmin` and the password you got from the Azure portal in the earlier step.

    ```powershell
    $Cred = New-Object System.Management.Automation.PSCredential("~\StorSimpleAdmin",$Pwd)
    ``` 
1. Create the session.

    ```powershell
    $podPs =  New-PSSession -Computer <IPv4_address for your Data Box> -ConfigurationName Minishell -Credential $Cred 
    ```


## [v4.1 and later](#tab/c)

### Step 1: Install certificate on host or client

#### Use default certificates 

Follow these steps if you'll use the default certificates (shipped with the device) on Data Box.

1. In the Azure portal, go to your Data Box order resource. Go to **Settings > Device details**. Download the certificate.
1. Copy the certificate to the host connecting to your Data Box. If using a Windows host, open Explorer. Right-click the certificate file that you donwloaded earlier and select **Install certificate**. Complete the installation steps through the **Certificate Import Wizard**. For detailed steps, see [Download and import certificates](data-box-bring-your-own-certificates.md#import-certificates-to-client). 
1. Add an entry to host file mapping the IP to the FQDN of appliance - <DeviceSerialNumber>.microsoftdatabox.com . Get the device serial number from the Device details blade in the Azure portal. 

 Screenshot shows a Notepad document with the I P address and blob service endpoint added.
 

#### Use your own certificates 

Follow these steps if you'll bring your own certificates on Data Box.
 
1. Install the Signing chain certificate on the host machine you are connecting to the DBX with.  
1. Follow steps here to Import Certificate on Client. You should receive this certificate from the customer. 
1. Install in LocalMachine/Root. 
1. Add an entry to host file mapping the IP to the FQDN of appliance - <Name>.<DNS domain>. Pick Name and DNS domain from the certificates page. 
1. Add certificates panel on the Certificates page for a Data Box device
 


### Step 2: Connect to the PowerShell interface


1. 
 
    ```powershell
    set-item wsman:\localhost\Client\TrustedHosts <<ipv4_address of databox>> 
    ```

1. Get password for local UI from the Azure portal. 

    ```powershell
    $Pwd = ConvertTo-SecureString  <Password from portal>  -AsPlainText -Force 
    ```
1.

    ```powershell
    $Cred = New-Object System.Management.Automation.PSCredential("<<ipv4_address of databox>>\StorSimpleAdmin",$Pwd) 
    ```
 
To skip certificate installation, you'll need to skip certificate validation as well. Follow these steps to skip certificate validation:

1. Use session options when opening a PowerShell session.

    ```powershell
    $sessOptions = New-PSSessionOption -SkipCACheck -SkipCNCheck -SkipRevocationCheck 
    ```
1. Establish the connection.

    ```powershell
    $podPs  = new-PSSession -Computer <<ipv4_address of databox>> -ConfigurationName Minishell -Credential $Cred -UseSSL -SessionOption $sessOptions 
    ```



 


   ![Notification for copy errors during an upload in the Azure portal](media/data-box-review-nonretryable-errors/copy-errors-in-upload-01.png)

  

