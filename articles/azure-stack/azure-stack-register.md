---
title: Register Azure Stack | Microsoft Docs
description: Register Azure Stack with your Azure subscription.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/27/2018
ms.author: jeffgilb

---
# Register Azure Stack with your Azure Subscription

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can register [Azure Stack](azure-stack-poc.md) with Azure to download marketplace items from Azure and to set up commerce data reporting back to Microsoft.

> [!NOTE]
>Registration is recommended because it enables you to test important Azure Stack functionality, like marketplace syndication and usage reporting. After you register Azure Stack, usage is reported to Azure commerce. You can see it under the subscription you used for registration. Azure Stack Development Kit users aren't charged for any usage they report.


## Get Azure subscription

Before registering Azure Stack with Azure, you must have:

- The subscription ID for an Azure subscription. To get the ID, sign in to Azure, click **More services** > **Subscriptions**, click the subscription you want to use, and under **Essentials** you can find the **Subscription ID**. China, Germany, and US government cloud subscriptions are not currently supported.
- The username and password for an account that is an owner for the subscription (MSA/2FA accounts are supported).
- *Not required beginning with Azure Stack 1712 update version (180106.1):*   The Azure Active Directory for the Azure subscription. You can find this directory in Azure by hovering over your avatar at the top right corner of the Azure portal.

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/en-us/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.

## Register Azure Stack with Azure  
> [!NOTE]
> All these steps must be run from a machine that has access to the privileged endpoint. For Azure Stack Development Kit, it would be the host computer. If you’re using an integrated system, contact your Azure Stack operator.
>

1. Open a PowerShell console as an administrator and [install PowerShell for Azure Stack](azure-stack-powershell-install.md).  

2. Add the Azure account that you use to register Azure Stack. To add the account, run the `Add-AzureRmAccount` cmdlet with the EnvironmentName parameter set to **AzureCloud**. You are prompted to enter your Azure account credentials and you may have to use 2-factor authentication based on your account’s configuration.

   ```Powershell
   Add-AzureRmAccount -EnvironmentName "AzureCloud"
   ```

3. If you have multiple subscriptions, run the following command to select the one you want to use:  

   ```powershell
      Get-AzureRmSubscription -SubscriptionID '<Your Azure Subscription GUID>' | Select-AzureRmSubscription
   ```

4. Run the following command to register the Azure Stack resource provider in your Azure subscription:

   ```Powershell
   Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack
   ```

5. Delete any existing versions of the PowerShell modules that correspond to registration and [download the latest version of it from GitHub](azure-stack-powershell-download.md).  

6. From the "AzureStack-Tools-master" directory that is created in the preceding step, navigate to the "Registration" folder and import the ".\RegisterWithAzure.psm1" module:  

   ```powershell
   Import-Module .\RegisterWithAzure.psm1
   ```

7. In the same PowerShell session, run the following script: When prompted for credentials, specify `azurestack\cloudadmin` as the user and the password is the same as what you used for the local administrator during deployment.  

   ```powershell
   $AzureContext = Get-AzureRmContext
   $CloudAdminCred = Get-Credential -UserName AZURESTACK\CloudAdmin -Message "Enter the cloud domain credentials to access the privileged endpoint"
   Set-AzsRegistration `
       -CloudAdminCredential $CloudAdminCred `
       -PrivilegedEndpoint AzS-ERCS01 `
       -BillingModel Development
   ```

   | Parameter | Description |  
   |--------|-------------|
   | CloudAdminCredential | The cloud domain credentials that are used to [access the privileged endpoint](azure-stack-privileged-endpoint.md#access-the-privileged-endpoint). The username is in the format **\<Azure Stack domain\>\cloudadmin**. For development kit, the username is set to **azurestack\cloudadmin**. If you’re using an integrated system, contact your Azure Stack operator to get this value.|  
   | PrivilegedEndpoint | A pre-configured remote PowerShell console that provides you with capabilities like log collection and other post deployment tasks. For development kit, the privileged endpoint is hosted on the "AzS-ERCS01" virtual machine. If you’re using an integrated system, contact your Azure Stack operator to get this value. To learn more, refer to the [using the privileged endpoint](azure-stack-privileged-endpoint.md) article.|  
   | BillingModel | The billing model that your subscription uses. Allowed values for this parameter are- **Capacity**, **PayAsYouUse**, and **Development**. For development kit, this value is set to **Development**. If you’re using an integrated system, contact your Azure Stack operator to get this value. |

8. When the script completes, you see a message “Activating Azure Stack (this step may take up to 10 minutes to complete).”




## Verify the registration  

1. Sign in to the administrator portal (https://adminportal.local.azurestack.external).

2. Click **More Services** > **Marketplace Management** > **Add from Azure**.

3. If you see a list of items available from Azure (such as WordPress), your activation was successful.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.


## Modify the registration

### Change the subscription you use
If you would like to change the subscription you use, you must first run Remove-AzsRegistration, ensure you are logged in to the correct Azure PowerShell context, and then run Set-AzsRegistration with any changed parameters.

  ```Powershell   
  Remove-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint
  Set-AzureRmContext -SubscriptionId $NewSubscriptionId
  Set-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse
  ```
### Change the billing model or syndication features
If you would like to change the billing model or syndication features for your installation, you can call the registration function to set the new values. You do not need to first remove the current registration.  

  ```Powershell
     Set-AzsRegistration -CloudAdminCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse
  ```


## Disconnected registration
*The information in this section applies beginning with the Azure Stack 1712 update version (180106.1) and is not supported with earlier versions.*

If you are registering Azure Stack in a disconnected environment, you need to get a registration token from the Azure Stack environment and then use that token on a machine that can connect to Azure for registration.  

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

  1. [Download the latest PowerShell modules that correspond to registration from GitHub](azure-stack-powershell-download.md).  

  2. From the "AzureStack-Tools-master" directory that is created in the preceding step, navigate to the "Registration" folder and import the ".\RegisterWithAzure.psm1" module:  

     ```powershell
     Import-Module .\RegisterWithAzure.psm1
     ```

  3. Copy [RegisterWithAzure.psm1](https://go.microsoft.com/fwlink/?linkid=842959) to a folder, like *C:\Temp*.

  4. Start PowerShell ISE as an Administrator and then import the RegisterWithAzure module.  

  5. Ensure you are logged into the correct Azure PowerShell context that you want to use to register your Azure Stack environment:  

     ```Powershell
        Set-AzureRmContext -SubscriptionId $YourAzureSubscriptionId   
     ```
  6. Specify the registration token to register with Azure:

     ```Powershell  
       $registrationToken = "*Your Registration Token*"
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


## Next steps
[Connect to Azure Stack](azure-stack-connect-azure-stack.md)
