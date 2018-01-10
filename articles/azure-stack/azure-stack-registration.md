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
ms.date: 01/15/2017
ms.author: jeffgilb

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

## Register Azure Stack connected environments

### Register Azure Stack resource provider
Use these steps to register the Azure Stack resource provider with Azure:
1.	Start Powershell ISE as an administrator and [install PowerShell for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install).
2.	Log in to the Azure account that is an owner of the Azure subscription with -EnvironmentName parameter set to **AzureCloud**.
3.	Register the Azure resource provider **Microsoft.AzureStack**.

Example:

  ```powershell
  Login-AzureRmAccount -EnvironmentName "AzureCloud"
  Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack 
  ```

### Register Azure Stack with Azure using the pay-as-you-use billing model
Use these steps to register Azure Stack with Azure using the pay-as-you-use billing model:
1.	If not already installed, [install PowerShell for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install). 
2. Delete any existing versions of the PowerShell modules that correspond to registration and [download the latest version of it from GitHub](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-download).
3.	Start PowerShell ISE as an administrator and navigate to the **Registration** folder in the **AzureStack-Tools-master** directory  created in the preceding step and import the **.\RegisterWithAzure.psm1** module: 

  ```powershell
  Import-Module .\RegisterWithAzure.psm1
  
  ```
4. In the same PowerShell session, run the Set-AzsRegistration cmdlet. When prompted for credentials, specify the owner of the Azure subscription.  

Example:
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
Follow the same instruction as for pay-as-you-use, but add the agreement number under which capacity was purchased and change the BillingModel parameter to Capacity. All other parameters are unchanged.

Example:
  ```powershell
  $AzureContext = Get-AzureRmContext
  $CloudAdminCred = Get-Credential -UserName <Azure subscription owner>  -Message "Enter the cloud domain credentials to access the privileged endpoint"
  Set-AzsRegistration `
      -CloudAdminCredential $CloudAdminCred `
      -PrivilegedEndpoint <PrivilegedEndPoint computer name> `
      -AgreementNumber <EA agreement number> `
      -BillingModel Capacity
  ```


### Verify the registration
Use these steps to verify that Azure Stack has successfully registered with Azure.
1. Sign in to the administrator portal ([https://adminportal.local.azurestack.external](https://adminportal.local.azurestack.external)).
2. Click **More Services** > **Marketplace Management** > **Add from Azure**.

If you see a list of items available from Azure (such as WordPress), your activation was successful.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.

## Register Azure Stack in disconnected environments 
*The information in this section applies beginning with the Azure Stack 1712 update version (180106.1) and is not supported with earlier versions.*

If you are registering Azure Stack in a disconnected environment (with no internet connectivity), you need to get a registration token from the Azure Stack environment and then use that token on a machine that can connect to Azure to complete the registration process.  

### Get a registration token from the Azure Stack environment
  1. To get the registration token, run the following:  

     ```Powershell
        $FilePathForRegistrationToken = $env:SystemDrive\RegistrationToken.txt
        $RegistrationToken = Get-AzsRegistrationToken -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel Capacity -AgreementNumber '<your agreement number>' -TokenOutputFilePath $FilePathForRegistrationToken
      ```
      > [!TIP]  
      > The registration token is saved in the file specified for *$env:SystemDrive\RegistrationToken.txt*.

  2. Save this registration token for use on the Azure connected machine.


### Connect to Azure and register
Run the steps for this procedure on a machine that can connect to Azure.

1.	If not already installed, [install PowerShell for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install). 
2. Delete any existing versions of the PowerShell modules that correspond to registration and [download the latest version of it from GitHub](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-download).
3.	Start PowerShell ISE as an administrator and navigate to the **Registration** folder in the **AzureStack-Tools-master** directory  created in the preceding step and import the ".\RegisterWithAzure.psm1" module: 
  ```powershell
  Import-Module .\RegisterWithAzure.psm1
  ```
4. In the same PowerShell session, specify the registration token to register with Azure:

     ```Powershell  
     $registrationToken = "<Your Registration Token>"
     Register-AzsEnvironment -RegistrationToken $registrationToken  
     ```

    Optionally, you can use the Get-Content cmdlet to point to a file that contains your registration token:

   ```Powershell  
   $registrationToken = Get-Content -Path 'C:\Temp\<Registration Token File>'
   Register-AzsEnvironment -RegistrationToken $registrationToken  
   ```
> [!NOTE]  
> Save the registration resource name or the registration token for future reference.

### Remove a registered resource
If you want to remove the registration resource, then you must use UnRegister-AzsEnvironment and pass in either the registration resource name or the registration token you used for Register-AzsEnvironment.
- **Registration resource name:**

  ```Powershell    
     UnRegister-AzsEnvironment -RegistrationName "*Name of the registration resource*"
  ```
- **Registration token:**    

  ```Powershell
     $registrationToken = "*Your copied registration token*"
     UnRegister-AzsEnvironment -RegistrationToken $registrationToken
   ```

## Renew or change registration
You’ll need to update or renew your registration in the following circumstances:
- After you renew your capacity-based yearly subscription.
- When you change your billing model.
- When you scale changes (add/remove nodes) for capacity-based billing.

### Change the subscription you use
If you would like to change the subscription you use, you must first run Remove-AzsRegistration, ensure you are logged in to the correct Azure PowerShell context, and then run Set-AzsRegistration with any changed parameters.

```powershell
Remove-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint
Set-AzureRmContext -SubscriptionId $NewSubscriptionId
Set-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse
```

### Change the billing model or syndication features
If you would like to change the billing model or syndication features for your installation, you can call the registration function to set the new values. You do not need to first remove the current registration. 

```powershell
Set-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse
```