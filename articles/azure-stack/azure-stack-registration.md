---
title: Azure registration for Azure Stack integrated systems | Microsoft Docs
description: Describes the Azure registration process for multi-node Azure Stack Azure-connected deployments.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/27/2018
ms.author: jeffgilb
ms.reviewer: wfayed

---
# Register Azure Stack with Azure
You can register Azure Stack with Azure to download marketplace items from Azure and to set up commerce data reporting back to Microsoft. After you register Azure Stack, usage is reported to Azure commerce. You can see it under the subscription you used for registration.

> [!IMPORTANT]
> Registration is mandatory if you choose the pay-as-you-use billing model. Otherwise, you will be in violation of the licensing terms of the Azure Stack deployment as usage will otherwise not be reported.

## Before you register Azure Stack with Azure
Before registering Azure Stack with Azure, you must have:

- The subscription ID for an Azure subscription. To get the ID, sign in to Azure, click **More services** > **Subscriptions**, click the subscription you want to use, and under **Essentials** you can find the Subscription ID. 

  > [!NOTE]
  > China, Germany, and US government cloud subscriptions are not currently supported. 

- The username and password for an account that is an owner for the subscription (MSA/2FA accounts are supported)
- *Not required beginning with Azure Stack 1712 update version (180106.1)*: The Azure AD for the Azure subscription. You can find this directory in Azure by hovering over your avatar at the top right corner of the Azure portal. 
- Registered the Azure Stack resource provider (see the Register Azure Stack Resource Provider section below for details)

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.

### <a name="bkmk_powershell"></a>Install PowerShell for Azure Stack
You need to use the latest PowerShell for Azure Stack to register the system with Azure.

If not already installed, [install PowerShell for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install). 

### <a name="bkmk_tools"></a>Download the Azure Stack tools
The Azure Stack tools GitHub repository contains PowerShell modules that support Azure Stack functionality; including registration functionality. During the registration process you will need to import and use the RegisterWithAzure.psm1 PowerShell module, found in the Azure Stack tools repository, to register your Azure Stack instance with Azure. 

```powershell
# Change directory to the root directory. 
cd \

# Download the tools archive.
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 
  invoke-webrequest `
  https://github.com/Azure/AzureStack-Tools/archive/master.zip `
  -OutFile master.zip

# Expand the downloaded files.
  expand-archive master.zip `
  -DestinationPath . `
  -Force

# Change to the tools directory.
  cd AzureStack-Tools-master
```

## Register Azure Stack in connected environments
Connected environments can access the internet and Azure. For these environments, you need to register the Azure Stack resource provider with Azure and then configure your billing model.

### Register the Azure Stack resource provider
To register the Azure Stack resource provider with Azure, start Powershell ISE as an administrator and use the following PowerShell commands. These commands will:
- Prompt you to log in as an owner of the Azure subscription to be used and set the `EnvironmentName` parameter to **AzureCloud**.
- Register the Azure resource provider **Microsoft.AzureStack**.

PowerShell to run:

```powershell
Login-AzureRmAccount -EnvironmentName "AzureCloud"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack 
```

### Register Azure Stack with Azure using the pay-as-you-use billing model
Use the these steps to register Azure Stack with Azure using the pay-as-you-use billing model.

Start PowerShell ISE as an administrator and navigate to the **Registration** folder in the **AzureStack-Tools-master** directory created when you [downloaded the Azure Stack tools](#bkmk_tools). Import the **RegisterWithAzure.psm1** module using PowerShell: 

PowerShell to run:

```powershell
Import-Module .\RegisterWithAzure.psm1
```
Next, in the same PowerShell session, run the **Set-AzsRegistration** cmdlet. When prompted for credentials, specify the owner of the Azure subscription.  

PowerShell to run:

```powershell
$AzureContext = Get-AzureRmContext
$CloudAdminCred = Get-Credential -UserName <Azure subscription owner>  -Message "Enter the cloud domain credentials to access the privileged endpoint"
Set-AzsRegistration `
    -CloudAdminCredential $CloudAdminCred `
    -PrivilegedEndpoint <PrivilegedEndPoint computer name> `
    -BillingModel PayAsYouUse
```

|Parameter|Description|
|-----|-----|
|CloudAdminCredential|PowerShell object that contains credential information (username and password) for the owner of the Azure subscription.|
|PrivilegedEndpoint|A pre-configured remote PowerShell console that provides you with capabilities like log collection and other post deployment tasks. To learn more, refer to the [using the privileged endpoint](https://docs.microsoft.com/azure/azure-stack/azure-stack-privileged-endpoint#access-the-privileged-endpoint) article.|
|BillingModel|The billing model that your subscription uses. Allowed values for this parameter are: Capacity, PayAsYouUse, and Development.|

### Register Azure Stack with Azure using the capacity billing model
Follow the same instructions used for registering using the pay-as-you-use billing model, but add the agreement number under which capacity was purchased and change the `BillingModel` parameter to **Capacity**. All other parameters are unchanged.

PowerShell to run:
```powershell
$AzureContext = Get-AzureRmContext
$CloudAdminCred = Get-Credential -UserName <Azure subscription owner>  -Message "Enter the cloud domain credentials to access the privileged endpoint"
Set-AzsRegistration `
    -CloudAdminCredential $CloudAdminCred `
    -PrivilegedEndpoint <PrivilegedEndPoint computer name> `
    -AgreementNumber <EA agreement number> `
    -BillingModel Capacity
```

## Register Azure Stack in disconnected environments 
*The information in this section applies beginning with the Azure Stack 1712 update version (180106.1) and is not supported with earlier versions.*

If you are registering Azure Stack in a disconnected environment (with no internet connectivity), you need to get a registration token from the Azure Stack environment and then use that token on a computer that can connect to Azure and has [PowerShell for Azure Stack installed](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install).  

### Get a registration token from the Azure Stack environment
  1. To get the registration token, run the following PowerShell commands:  

     ```Powershell
        $FilePathForRegistrationToken = $env:SystemDrive\RegistrationToken.txt
        $RegistrationToken = Get-AzsRegistrationToken -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel Capacity -AgreementNumber '<your agreement number>' -TokenOutputFilePath $FilePathForRegistrationToken
      ```
      > [!TIP]  
      > The registration token is saved in the file specified for *$env:SystemDrive\RegistrationToken.txt*.

  2. Save this registration token for use on the Azure connected machine.


### Connect to Azure and register
Start PowerShell ISE as an administrator and navigate to the **Registration** folder in the **AzureStack-Tools-master** directory created when you [downloaded the Azure Stack tools](#bkmk_tools). Import the **RegisterWithAzure.psm1** module: 

PowerShell to run:
```powershell
Import-Module .\RegisterWithAzure.psm1
```
Next, in the same PowerShell session, specify the registration token to register with Azure:

```Powershell  
$registrationToken = "<Your Registration Token>"
Register-AzsEnvironment -RegistrationToken $registrationToken  
```
Optionally, you can use the Get-Content cmdlet to point to a file that contains your registration token:

 ```Powershell  
 $registrationToken = Get-Content -Path '<Path>\<Registration Token File>'
 Register-AzsEnvironment -RegistrationToken $registrationToken  
 ```
> [!NOTE]  
> Save the registration resource name or the registration token for future reference.

## Verify Azure Stack registration
Use these steps to verify that Azure Stack has successfully registered with Azure.
1. Sign in to the Azure Stack [administrator portal](https://docs.microsoft.com/azure/azure-stack/azure-stack-manage-portals#access-the-administrator-portal): https&#58;//adminportal.*&lt;region>.&lt;fqdn>*.
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.

If you see a list of items available from Azure (such as WordPress), your activation was successful.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.

## Renew or change registration
You’ll need to update or renew your registration in the following circumstances:
- After you renew your capacity-based yearly subscription.
- When you change your billing model.
- When you scale changes (add/remove nodes) for capacity-based billing.

### Change the subscription you use
If you would like to change the subscription you use, you must first run the **Remove-AzsRegistration** cmdlet, then ensure you are logged in to the correct Azure PowerShell context, and finally run **Set-AzsRegistration** with any changed parameters:

```powershell
Remove-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint
Set-AzureRmContext -SubscriptionId $NewSubscriptionId
Set-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse
```

### Change the billing model or syndication features
If you would like to change the billing model or syndication features for your installation, you can call the registration function to set the new values. You do not need to first remove the current registration: 

```powershell
Set-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse
```

## Remove a registered resource
If you want to remove a registration, then you must use **UnRegister-AzsEnvironment** cmdlet and pass in either the registration resource name or the registration token you used for **Register-AzsEnvironment**.

To remove a registration using a resource name:

```Powershell    
UnRegister-AzsEnvironment -RegistrationName "*Name of the registration resource*"
```
To remove a registration using a registration token:

```Powershell
$registrationToken = "*Your copied registration token*"
UnRegister-AzsEnvironment -RegistrationToken $registrationToken
```

## Next steps

[External monitoring integration](azure-stack-integrate-monitor.md)