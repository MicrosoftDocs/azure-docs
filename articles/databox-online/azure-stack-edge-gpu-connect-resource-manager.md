---
title: Connect to Azure Resource Manager on your Azure Stack Edge Pro GPU device
description: Describes how to connect to the Azure Resource Manager running on your Azure Stack Edge Pro GPU using Azure PowerShell.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/01/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to connect to Azure Resource Manager on my Azure Stack Edge Pro device so that I can manage resources.
---

# Connect to Azure Resource Manager on your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

Azure Resource Manager provides a management layer that enables you to create, update, and delete resources in your Azure subscription. The Azure Stack Edge Pro device supports the same Azure Resource Manager APIs to create, update, and delete VMs in a local subscription. This support lets you manage the device in a manner consistent with the cloud. 

This tutorial describes how to connect to the local APIs on your Azure Stack Edge Pro device via Azure Resource Manager using Azure PowerShell.

## About Azure Resource Manager

Azure Resource Manager provides a consistent management layer to call the Azure Stack Edge Pro device API and perform operations such as create, update, and delete VMs. The architecture of the Azure Resource Manager is detailed in the following diagram.

![Diagram for Azure Resource Manager](media/azure-stack-edge-gpu-connect-resource-manager/edge-device-flow.svg)


## Endpoints on Azure Stack Edge Pro device

The following table summarizes the various endpoints exposed on your device, the supported protocols, and the ports to access those endpoints. Throughout the article, you will find references to these endpoints.

| # | Endpoint | Supported protocols | Port used | Used for |
| --- | --- | --- | --- | --- |
| 1. | Azure Resource Manager | https | 443 | To connect to Azure Resource Manager for automation |
| 2. | Security token service | https | 443 | To authenticate via access and refresh tokens |
| 3. | Blob | https | 443 | To connect to Blob storage via REST |


## Connecting to Azure Resource Manager workflow

The process of connecting to local APIs of the device using Azure Resource Manager requires the following steps:

| Step # | You'll do this step ... | .. on this location. |
| --- | --- | --- |
| 1. | [Configure your Azure Stack Edge Pro device](#step-1-configure-azure-stack-edge-pro-device) | Local web UI |
| 2. | [Create and install certificates](#step-2-create-and-install-certificates) | Windows client/local web UI |
| 3. | [Review and configure the prerequisites](#step-3-install-powershell-on-the-client) | Windows client |
| 4. | [Set up Azure PowerShell on the client](#step-4-set-up-azure-powershell-on-the-client) | Windows client |
| 5. | [Modify host file for endpoint name resolution](#step-5-modify-host-file-for-endpoint-name-resolution) | Windows client or DNS server |
| 6. | [Check that the endpoint name is resolved](#step-6-verify-endpoint-name-resolution-on-the-client) | Windows client |
| 7. | [Use Azure PowerShell cmdlets to verify connection to Azure Resource Manager](#step-7-set-azure-resource-manager-environment) | Windows client |

The following sections detail each of the above steps in connecting to Azure Resource Manager.

## Prerequisites

Before you begin, make sure that the client used for connecting to device via Azure Resource Manager is using TLS 1.2. For more information, go to [Configure TLS 1.2 on Windows client accessing Azure Stack Edge Pro device](azure-stack-edge-gpu-configure-tls-settings.md).

## Step 1: Configure Azure Stack Edge Pro device 

Take the following steps in the local web UI of your Azure Stack Edge Pro device.

1. Complete the network settings for your Azure Stack Edge Pro device. 

    ![Local web UI "Network settings" page](./media/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy/compute-network-2.png)


    Make a note of the device IP address. You will use this IP later.

2. Configure the device name and the DNS domain from the **Device** page. Make a note of the device name and the DNS domain as you will use these later.

    ![Local web UI "Device" page](./media/azure-stack-edge-gpu-deploy-set-up-device-update-time/device-2.png)

    > [!IMPORTANT]
    > The device name, DNS domain will be used to form the endpoints that are exposed.
    > Use the Azure Resource Manager and Blob endpoints from the **Device** page in the local web UI.


## Step 2: Create and install certificates

Certificates ensure that your communication is trusted. On your Azure Stack Edge Pro device, self-signed appliance, blob, and Azure Resource Manager certificates are automatically generated. Optionally, you can bring in your own signed blob and Azure Resource Manager certificates as well.

When you bring in a signed certificate of your own, you also need the corresponding signing chain of the certificate. For the signing chain, Azure Resource Manager, and the blob certificates on the device, you will need the corresponding certificates on the client machine also to authenticate and communicate with the device.

To connect to Azure Resource Manager, you will need to create or get signing chain and endpoint certificates, import these certificates on your Windows client, and finally upload these certificates on the device.

### Create certificates (Optional)

For test and development use only, you can use Windows PowerShell to create certificates on your local system. While creating the certificates for the client, follow these guidelines:

1. You first need to create a root certificate for the signing chain. For more information, see See steps to [Create signing chain certificates](azure-stack-edge-gpu-manage-certificates.md#create-signing-chain-certificate).

2. You can next create the endpoint certificates for the blob and Azure Resource Manager. You can get these endpoints from the **Device** page in the local web UI. See the steps to [Create endpoint certificates](azure-stack-edge-gpu-manage-certificates.md#create-signed-endpoint-certificates).

3. For all these certificates, make sure that the subject name and subject alternate name conform to the following guidelines:

    |Type |Subject name (SN)  |Subject alternative name (SAN)  |Subject name example |
    |---------|---------|---------|---------|
    |Azure Resource Manager|`management.<Device name>.<Dns Domain>`|`login.<Device name>.<Dns Domain>`<br>`management.<Device name>.<Dns Domain>`|`management.mydevice1.microsoftdatabox.com` |
    |Blob storage|`*.blob.<Device name>.<Dns Domain>`|`*.blob.< Device name>.<Dns Domain>`|`*.blob.mydevice1.microsoftdatabox.com` |
    |Multi-SAN single certificate for both endpoints|`<Device name>.<dnsdomain>`|`login.<Device name>.<Dns Domain>`<br>`management.<Device name>.<Dns Domain>`<br>`*.blob.<Device name>.<Dns Domain>`|`mydevice1.microsoftdatabox.com` |

For more information on certificates, go to how to [Manage certificates](azure-stack-edge-gpu-manage-certificates.md).

### Upload certificates on the device

The certificates that you created in the previous step will be in the Personal store on your client. These certificates need to be exported on your client into appropriate format files that can then be uploaded to your device.

1. The root certificate must be exported as a DER format file with *.cer* file extension. For detailed steps, see [Export certificates as a .cer format file](azure-stack-edge-gpu-manage-certificates.md#export-certificates-as-der-format).

2. The endpoint certificates must be exported as *.pfx* files with private keys. For detailed steps, see [Export certificates as .pfx file with private keys](azure-stack-edge-gpu-manage-certificates.md#export-certificates-as-pfx-format-with-private-key).

3. The root and endpoint certificates are then uploaded on the device using the **+Add certificate** option on the **Certificates** page in the local web UI. To upload the certificates, follow the steps in [Upload certificates](azure-stack-edge-gpu-manage-certificates.md#upload-certificates).


### Import certificates on the client running Azure PowerShell

The Windows client where you will invoke the Azure Resource Manager APIs needs to establish trust with the device. To this end, the certificates that you created in the previous step must be imported on your Windows client into the appropriate certificate store.

1. The root certificate that you exported as the DER format with *.cer* extension should now be imported in the Trusted Root Certificate Authorities on your client system. For detailed steps, see [Import certificates into the Trusted Root Certificate Authorities store.](azure-stack-edge-gpu-manage-certificates.md#import-certificates-as-der-format)

2. The endpoint certificates that you exported as the *.pfx* must be exported as *.cer*. This *.cer* is then imported in the **Personal** certificate store on your system. For detailed steps, see [Import certificates into personal store](azure-stack-edge-gpu-manage-certificates.md#import-certificates-as-der-format).

## Step 3: Install PowerShell on the client 

Your Windows client must meet the following prerequisites:

1. Run PowerShell Version 5.0. You must have PowerShell version 5.0. PowerShell core is not supported. To check the version of PowerShell on your system, run the following cmdlet:

    ```powershell
    $PSVersionTable.PSVersion
    ```

    Compare the **Major** version and ensure that it is 5.0 or later.

    If you have an outdated version, see [Upgrading existing Windows PowerShell](/powershell/scripting/install/installing-windows-powershell?view=powershell-6&preserve-view=true#upgrading-existing-windows-powershell).

    If you don\'t have PowerShell 5.0, follow [Installing Windows PowerShell](/powershell/scripting/install/installing-windows-powershell?view=powershell-6&preserve-view=true).

    A sample output is shown below.

    ```powershell
    Windows PowerShell
    Copyright (C) Microsoft Corporation. All rights reserved. 
    Try the new cross-platform PowerShell https://aka.ms/pscore6
    PS C:\windows\system32> $PSVersionTable.PSVersion
    Major  Minor  Build  Revision
    -----  -----  -----  --------
    5      1      18362  145
    ```
    
2. You can access the PowerShell Gallery.

    Run PowerShell as administrator. Verify if the `PSGallery` is registered as a repository.

    ```powershell
    Import-Module -Name PowerShellGet -ErrorAction Stop
    Import-Module -Name PackageManagement -ErrorAction Stop
    Get-PSRepository -Name "PSGallery"
    ```
    
    A sample output is shown below.
    
    ```powershell
    PS C:\windows\system32> Import-Module -Name PowerShellGet -ErrorAction Stop
    PS C:\windows\system32> Import-Module -Name PackageManagement -ErrorAction Stop
    PS C:\windows\system32> Get-PSRepository -Name "PSGallery"
    Name                      InstallationPolicy   SourceLocation
    ----                      ------------------   --------------
    PSGallery                 Trusted              https://www.powershellgallery.com/api/v2
    ```
    
If your repository is not trusted or you need more information, see [Validate the PowerShell Gallery accessibility](/azure-stack/operator/azure-stack-powershell-install?view=azs-1908&preserve-view=true&preserve-view=true#2-validate-the-powershell-gallery-accessibility).

## Step 4: Set up Azure PowerShell on the client 

<!--1. Verify the API profile of the client and identify which version of the Azure PowerShell modules and libraries to include on your client. In this example, the client system will be running Azure Stack 1904 or later. For more information, see [Azure Resource Manager API profiles](/azure-stack/user/azure-stack-version-profiles?view=azs-1908#azure-resource-manager-api-profiles).-->

1. You will install Azure PowerShell modules on your client that will work with your device.

    a. Run PowerShell as an administrator. You need access to PowerShell gallery. 


    b. To install the required Azure PowerShell modules from the PowerShell Gallery, run the following command:

    ```powershell
    # Install the AzureRM.BootStrapper module. Select Yes when prompted to install NuGet.
    
    Install-Module -Name AzureRM.BootStrapper
    
   # Install and import the API Version Profile into the current PowerShell session.
    
    Use-AzureRmProfile -Profile 2019-03-01-hybrid -Force
    
    # Confirm the installation of PowerShell
    Get-Module -Name "Azure*" -ListAvailable
    ```
    
    Make sure that you have Azure-RM module version 2.5.0 running at the end of the installation. 
    If you have an existing version of Azure-RM module that does not match the required version, uninstall using the following command:

    `Get-Module -Name Azure* -ListAvailable | Uninstall-Module -Force -Verbose`

    You will now need to install the required version again.
   

A sample output is shown below that indicates the AzureRM version 2.5.0 modules were installed successfully.

```powershell
PS C:\windows\system32> Install-Module -Name AzureRM.BootStrapper
PS C:\windows\system32> Use-AzureRmProfile -Profile 2019-03-01-hybrid -Force
Loading Profile 2019-03-01-hybrid
PS C:\windows\system32> Get-Module -Name "Azure*" -ListAvailable
 
    Directory: C:\Program Files\WindowsPowerShell\Modules
 
ModuleType Version    Name                          ExportedCommands
---------- -------    ----                          ----------------
Script     4.5.0      Azure.Storage                       {Get-AzureStorageTable, New-AzureStorageTableSASToken, New...
Script     2.5.0      AzureRM
Script     0.5.0      AzureRM.BootStrapper                {Update-AzureRmProfile, Uninstall-AzureRmProfile, Install-...
Script     4.6.1      AzureRM.Compute                     {Remove-AzureRmAvailabilitySet, Get-AzureRmAvailabilitySet...
Script     3.5.1      AzureRM.Dns                         {Get-AzureRmDnsRecordSet, New-AzureRmDnsRecordConfig, Remo...
Script     5.1.5      AzureRM.Insights                    {Get-AzureRmMetricDefinition, Get-AzureRmMetric, Remove-Az...
Script     4.2.0      AzureRM.KeyVault                    {Add-AzureKeyVaultCertificate, Set-AzureKeyVaultCertificat...
Script     5.0.1      AzureRM.Network                     {Add-AzureRmApplicationGatewayAuthenticationCertificate, G...
Script     5.8.3      AzureRM.profile                     {Disable-AzureRmDataCollection, Disable-AzureRmContextAuto...
Script     6.4.3      AzureRM.Resources                   {Get-AzureRmProviderOperation, Remove-AzureRmRoleAssignmen...
Script     5.0.4      AzureRM.Storage                     {Get-AzureRmStorageAccount, Get-AzureRmStorageAccountKey, ...
Script     4.0.2      AzureRM.Tags                        {Remove-AzureRmTag, Get-AzureRmTag, New-AzureRmTag}
Script     4.0.3      AzureRM.UsageAggregates             Get-UsageAggregates
Script     5.0.1      AzureRM.Websites                    {Get-AzureRmAppServicePlan, Set-AzureRmAppServicePlan, New...

 
    Directory: C:\Program Files (x86)\Microsoft Azure Information Protection\Powershell
 
ModuleType Version    Name                            ExportedCommands
---------- -------    ----                           ----------------
Binary     1.48.204.0 AzureInformationProtection          {Clear-RMSAuthentication, Get-RMSFileStatus, Get-RMSServer...
```


## Step 5: Modify host file for endpoint name resolution 

You will now add the Azure consistent VIP that you defined on the local web UI of device to:

- The host file on the client, OR,
- The DNS server configuration

> [!IMPORTANT]
> We recommend that you modify the the DNS server configuration for endpoint name resolution.

On your Windows client that you are using to connect to the device, take the following steps:

1. Start **Notepad** as an administrator, and then open the **hosts** file located at C:\Windows\System32\Drivers\etc.

    ![Windows Explorer hosts file](media/azure-stack-edge-gpu-connect-resource-manager/hosts-file.png)

2. Add the following entries to your **hosts** file replacing with appropriate values for your device: 

    ```
    <Device IP> login.<appliance name>.<DNS domain>
    <Device IP> management.<appliance name>.<DNS domain>
    <Device IP> <storage name>.blob.<appliance name>.<DNS domain>
    ```

    > [!IMPORTANT]
    > The entry in the hosts file should match exactly that provided to connect to Azure Resource Manager at a later step. Make sure that the DNS Domain entry here is all in the lowercase.

    You saved the device IP from the local web UI in an earlier step.

    The login.\<appliance name\>.\<DNS domain\> entry is the endpoint for Security Token Service (STS). STS is responsible for creation, validation, renewal, and cancellation of security tokens. The security token service is used to create the access token and refresh token that are used for continuous communication between the device and the client.

3. For reference, use the following image. Save the **hosts** file.

    ![hosts file in Notepad](media/azure-stack-edge-gpu-connect-resource-manager/hosts-file-notepad.png)

## Step 6: Verify endpoint name resolution on the client

Check if the endpoint name is resolved on the client that you are using to connect to the Azure consistent VIP.

1. You can use the ping.exe command-line utility to check that the endpoint name is resolved. Given an IP address, the ping command will return the TCP/IP host name of the computer you\'re tracing.

    Add the `-a` switch to the command line as shown in the example below. If the host name is returnable, it will also return this potentially valuable information in the reply.

    ![Ping in command prompt](media/azure-stack-edge-gpu-connect-resource-manager/ping-command-prompt.png)



## Step 7: Set Azure Resource Manager environment

Set the Azure Resource Manager environment and verify that your device to client communication via Azure Resource Manager is working fine. Take the following steps for this verification:


1. Use the `Add-AzureRmEnvironment` cmdlet to further ensure that the communication via Azure Resource Manager is working properly and the API calls are going through the port dedicated for Azure Resource Manager - 443.

    The `Add-AzureRmEnvironment` cmdlet adds endpoints and metadata to enable Azure Resource Manager cmdlets to connect with a new instance of Azure Resource Manager. 


    > [!IMPORTANT]
    > The Azure Resource Manager endpoint URL that you provide in the following cmdlet is case-sensitive. Make sure the endpoint URL is all in lowercase and matches what you provided in the hosts file. If the case doesn't match, then you will see an error.

    ```powershell
    Add-AzureRmEnvironment -Name <Environment Name> -ARMEndpoint "https://management.<appliance name>.<DNSDomain>/"
    ```

    A sample output is shown below:
    
    ```powershell
    PS C:\windows\system32> Add-AzureRmEnvironment -Name AzDBE -ARMEndpoint https://management.dbe-n6hugc2ra.microsoftdatabox.com/
    
    Name  Resource Manager Url                    ActiveDirectory Authority
    ----  --------------------                   -------------------------
    AzDBE https://management.dbe-n6hugc2ra.microsoftdatabox.com https://login.dbe-n6hugc2ra.microsoftdatabox.com/adfs/
    ```

2. Set the environment as Azure Stack Edge Pro and the port to be used for Azure Resource Manager calls as 443. You define the environment in two ways:

    - Set the environment. Type the following command:

    ```powershell
    Set-AzureRMEnvironment -Name <Environment Name>
    ```
    
    For more information, go to [Set-AzureRMEnvironment](/powershell/module/azurerm.profile/set-azurermenvironment?view=azurermps-6.13.0&preserve-view=true).

    - Define the environment inline for every cmdlet that you execute. This ensures that all the API calls are going through the correct environment. By default, the calls would go through the Azure public but you want these to go through the environment that you set for Azure Stack Edge Pro device.

    - See more information on [how to switch AzureRM environments](#switch-environments).

2. Call local device APIs to authenticate the connections to Azure Resource Manager. 

    1. These credentials are for a local machine account and are solely used for API access.

    2. You can connect via `login-AzureRMAccount` or via `Connect-AzureRMAccount` command. 

        1. To sign in, type the following command. The tenant ID in this instance is hard coded - c0257de7-538f-415c-993a-1b87a031879d. Use the following username and password.

            - **Username** - *EdgeArmUser*

            - **Password** - [Set the password for Azure Resource Manager](azure-stack-edge-gpu-set-azure-resource-manager-password.md) and use this password to sign in. 

            ```powershell
            PS C:\windows\system32> $pass = ConvertTo-SecureString "<Your password>" -AsPlainText -Force;
            PS C:\windows\system32> $cred = New-Object System.Management.Automation.PSCredential("EdgeArmUser", $pass)
            PS C:\windows\system32> Connect-AzureRmAccount -EnvironmentName AzDBE -TenantId c0257de7-538f-415c-993a-1b87a031879d -credential $cred
            
            Account       SubscriptionName   TenantId            Environment
            -------       ----------------   --------            -----------
            EdgeArmUser@localhost Default Provider Subscription c0257de7-538f-415c-993a-1b87a031879d AzDBE
            
            PS C:\windows\system32>
            ```
                   
        
            An alternative way to log in is to use the `login-AzureRmAccount` cmdlet. 
            
            `login-AzureRMAccount -EnvironmentName <Environment Name>` -TenantId c0257de7-538f-415c-993a-1b87a031879d 

            Here is a sample output of the command. 
         
            ```powershell
            PS C:\Users\Administrator> login-AzureRMAccount -EnvironmentName AzDBE -TenantId c0257de7-538f-415c-993a-1b87a031879d
            
            Account         SubscriptionName  TenantId              Environment
            -------         ----------------  --------              -------
            EdgeArmUser@localhost Default Provider Subscription c0257de7-538f-415c-993a-1b87a031879d AzDBE
            PS C:\Users\Administrator>
            ```



> [!IMPORTANT]
> The connection to Azure Resource Manager expires every 1.5 hours or if your Azure Stack Edge Pro device restarts. If this happens, any cmdlets that you execute, will return error messages to the effect that you are not connected to Azure anymore. You will need to sign in again.

## Switch environments

Run `Disconnect-AzureRmAccount` command to switch to a different `AzureRmEnvironment`. 

If you use `Set-AzureRmEnvironment` and `Login-AzureRmAccount` without using `Disconnect-AzureRmAccount`, the environment is not actually switched.  

The following examples show how to switch between two environments, `AzDBE1` and `AzDBE2`.

First, list all the existing environments on your client.


```azurepowershell
PS C:\WINDOWS\system32> Get-AzureRmEnvironment​
Name    Resource Manager Url     ActiveDirectory Authority​
----    --------------------      -------------------------​
AzureChinaCloud   https://management.chinacloudapi.cn/                 https://login.chinacloudapi.cn/​
AzureCloud        https://management.azure.com/                        https://login.microsoftonline.com/​
AzureGermanCloud  https://management.microsoftazure.de/                https://login.microsoftonline.de/​
AzDBE1            https://management.HVTG1T2-Test.microsoftdatabox.com https://login.hvtg1t2-test.microsoftdatabox.com/adfs/​
AzureUSGovernment https://management.usgovcloudapi.net/                https://login.microsoftonline.us/​
AzDBE2            https://management.CVV4PX2-Test.microsoftdatabox.com https://login.cvv4px2-test.microsoftdatabox.com/adfs/​
```
​
Next, get which environment you are currently connected to via your Azure Resource Manager.

```azurepowershell
PS C:\WINDOWS\system32> Get-AzureRmContext |fl *​
​​
Name               : Default Provider Subscription (A4257FDE-B946-4E01-ADE7-674760B8D1A3) - EdgeArmUser@localhost​
Account            : EdgeArmUser@localhost​
Environment        : AzDBE2​
Subscription       : a4257fde-b946-4e01-ade7-674760b8d1a3​
Tenant             : c0257de7-538f-415c-993a-1b87a031879d​
TokenCache         : Microsoft.Azure.Commands.Common.Authentication.ProtectedFileTokenCache​
VersionProfile     :​
ExtendedProperties : {}​
```

You should now disconnect from the current environment before you switch to the other environment.​
​
​
```azurepowershell
PS C:\WINDOWS\system32> Disconnect-AzureRmAccount​
​​
Id                    : EdgeArmUser@localhost​
Type                  : User​
Tenants               : {c0257de7-538f-415c-993a-1b87a031879d}​
AccessToken           :​
Credential            :​
TenantMap             : {}​
CertificateThumbprint :​
ExtendedProperties    : {[Subscriptions, A4257FDE-B946-4E01-ADE7-674760B8D1A3], [Tenants, c0257de7-538f-415c-993a-1b87a031879d]}
```

Log into the other environment. The sample output is shown below.

```azurepowershell
PS C:\WINDOWS\system32> Login-AzureRmAccount -Environment "AzDBE1" -TenantId $ArmTenantId​
​
Account     SubscriptionName   TenantId        Environment​
-------     ----------------   --------        -----------​
EdgeArmUser@localhost Default Provider Subscription c0257de7-538f-415c-993a-1b87a031879d AzDBE1
```
​
Run this cmdlet to confirm which environment you are connected to.

```azurepowershell
PS C:\WINDOWS\system32> Get-AzureRmContext |fl *​
​​
Name               : Default Provider Subscription (A4257FDE-B946-4E01-ADE7-674760B8D1A3) - EdgeArmUser@localhost​
Account            : EdgeArmUser@localhost​
Environment        : AzDBE1​
Subscription       : a4257fde-b946-4e01-ade7-674760b8d1a3​
Tenant             : c0257de7-538f-415c-993a-1b87a031879d​
TokenCache         : Microsoft.Azure.Commands.Common.Authentication.ProtectedFileTokenCache​
VersionProfile     :​
ExtendedProperties : {}
```
​You have now switched to the intended environment.

## Next steps

[Deploy VMs on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).
