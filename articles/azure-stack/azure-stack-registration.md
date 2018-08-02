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
ms.date: 07/30/2018
ms.author: jeffgilb
ms.reviewer: brbartle

---

# Register Azure Stack with Azure

Registering [Azure Stack](azure-stack-poc.md) with Azure allows you to download marketplace items from Azure and to set up commerce data reporting back to Microsoft. After you register Azure Stack, usage is reported to Azure commerce and you can see it under the subscription used for registration.

> [!IMPORTANT]  
> Registration is required to support full Azure Stack functionality, including marketplace syndication. In addition, you will be in violation of Azure Stack licensing terms if you do not register when using the pay-as-you-use billing model. To learn more about Azure Stack licensing models, please see the [How to buy page](https://azure.microsoft.com/overview/azure-stack/how-to-buy/).

## Prerequisites

Before registering Azure Stack with Azure, you must have:

- The subscription ID for an Azure subscription. To get the ID, sign in to Azure, click **More services** > **Subscriptions**, click the subscription you want to use, and under **Essentials** you can find the Subscription ID.

  > [!NOTE]
  > Germany and US Government cloud subscriptions are not currently supported.

- The username and password for an account that is an owner for the subscription (MSA/2FA accounts are supported).
- Registered the Azure Stack resource provider (see the Register Azure Stack Resource Provider section below for details).

If you don’t have an Azure subscription that meets these requirements, you can [create a free Azure account here](https://azure.microsoft.com/free/?b=17.06). Registering Azure Stack incurs no cost on your Azure subscription.

### PowerShell language mode

To successfully register Azure Stack, the PowerShell language mode must be set to **FullLanguageMode**.  To verify that the current language mode is set to full, open an elevated PowerShell window and run the following PowerShell commands:

```PowerShell  
$ExecutionContext.SessionState.LanguageMode
```

Ensure the output returns **FullLanguageMode**. If any other language mode is returned, registration will need to be run on another machine or the language mode will need to be set to **FullLanguageMode** before continuing.

### <a name="bkmk_powershell"></a>Install PowerShell for Azure Stack

You need to use the latest PowerShell for Azure Stack to register with Azure.

If not already installed, [install PowerShell for Azure Stack](https://docs.microsoft.com/azure/azure-stack/azure-stack-powershell-install).

### <a name="bkmk_tools"></a>Download the Azure Stack tools

The Azure Stack tools GitHub repository contains PowerShell modules that support Azure Stack functionality; including registration functionality. During the registration process, you need to import and use the RegisterWithAzure.psm1 PowerShell module, found in the Azure Stack tools repository, to register your Azure Stack instance with Azure.

To ensure you are using the latest version, you should delete any existing versions of the Azure Stack tools and [download the latest version from GitHub](azure-stack-powershell-download.md) before registering with Azure.

## Register Azure Stack in connected environments

Connected environments can access the internet and Azure. For these environments, you need to register the Azure Stack resource provider with Azure and then configure your billing model.

> [!NOTE]
> All these steps must be run from a computer that has access to the privileged endpoint.

### Register the Azure Stack resource provider

To register the Azure Stack resource provider with Azure, start PowerShell ISE as an administrator and use the following PowerShell commands with the **EnvironmentName** parameter set to the appropriate Azure subscription type (see parameters below).

1. Add the Azure account that you use to register Azure Stack. To add the account, run the **Add-AzureRmAccount** cmdlet. You are prompted to enter your Azure global administrator account credentials and you may have to use 2-factor authentication based on your account’s configuration.

   ```PowerShell  
      Add-AzureRmAccount -EnvironmentName "<Either AzureCloud or AzureChinaCloud>"
   ```

   | Parameter | Description |  
   |-----|-----|
   | EnvironmentName | The Azure cloud subscription environment name. Supported environment names are **AzureCloud** or, if using a China Azure Subscription, **AzureChinaCloud**.  |
   |  |  |

2. If you have multiple subscriptions, run the following command to select the one you want to use:  

   ```PowerShell  
      Get-AzureRmSubscription -SubscriptionID '<Your Azure Subscription GUID>' | Select-AzureRmSubscription
   ```

3. Run the following command to register the Azure Stack resource provider in your Azure subscription:

   ```PowerShell  
   Register-AzureRmResourceProvider -ProviderNamespace Microsoft.AzureStack
   ```

### Register Azure Stack with Azure using the pay-as-you-use billing model

Use these steps to register Azure Stack with Azure using the pay-as-you-use billing model.

1. Start PowerShell ISE as an administrator and navigate to the **Registration** folder in the **AzureStack-Tools-master** directory created when you [downloaded the Azure Stack tools](#bkmk_tools). Import the **RegisterWithAzure.psm1** module using PowerShell:

   ```PowerShell  
   Import-Module .\RegisterWithAzure.psm1
   ```

2. Next, in the same PowerShell session, ensure you are logged in to the correct Azure PowerShell Context. This is the azure account that was used to register the Azure Stack resource provider above. Powershell to run:

   ```PowerShell  
   Add-AzureRmAccount -Environment "<Either AzureCloud or AzureChinaCloud>"
   ```

3. In the same PowerShell session, run the **Set-AzsRegistration** cmdlet. PowerShell to run:  

   ```PowerShell  
   $CloudAdminCred = Get-Credential -UserName <Privileged endpoint credentials> -Message "Enter the cloud domain credentials to access the privileged endpoint."
   $RegistrationName = "<unique-registration-name>"
   Set-AzsRegistration `
      -PrivilegedEndpointCredential $CloudAdminCred `
      -PrivilegedEndpoint <PrivilegedEndPoint computer name> `
      -BillingModel PayAsYouUse `
      -RegistrationName $RegistrationName
   ```

  |Parameter|Description|
  |-----|-----|
  |PrivilegedEndpointCredential|The credentials used to [access the privileged endpoint](azure-stack-privileged-endpoint.md#access-the-privileged-endpoint). The username is in the format **AzureStackDomain\CloudAdmin**.|
  |PrivilegedEndpoint|A pre-configured remote PowerShell console that provides you with capabilities like log collection and other post deployment tasks. To learn more, refer to the [using the privileged endpoint](azure-stack-privileged-endpoint.md#access-the-privileged-endpoint) article.|
  |BillingModel|The billing model that your subscription uses. Allowed values for this parameter are: Capacity, PayAsYouUse, and Development.|
  | RegistrationName | Set a unique name for the registration if you are running the registration script on more than one instance of Azure Stack using the same Azure Subscription ID. The parameter has a default value of **AzureStackRegistration**. However, if you use the same name on more than one instance of Azure Stack, the script will fail. |

  The process will take between 10 and 15 minutes. When the command completes, you will see the message **"Your environment is now registered and activated using the provided parameters."**

### Register Azure Stack with Azure using the capacity billing model

Follow the same instructions used for registering using the pay-as-you-use billing model, but add the agreement number under which capacity was purchased and change the **BillingModel** parameter to **Capacity**. All other parameters are unchanged.

PowerShell to run:

```PowerShell  
$CloudAdminCred = Get-Credential -UserName <Privileged endpoint credentials> -Message "Enter the cloud domain credentials to access the privileged endpoint."
$RegistrationName = "<unique-registration-name>"
Set-AzsRegistration `
    -PrivilegedEndpointCredential $CloudAdminCred `
    -PrivilegedEndpoint <PrivilegedEndPoint computer name> `
    -AgreementNumber <EA agreement number> `
    -BillingModel Capacity `
    -RegistrationName $RegistrationName
```

## Register Azure Stack in disconnected environments
If you are registering Azure Stack in a disconnected environment (with no internet connectivity), you need to get a registration token from the Azure Stack environment and then use that token on a computer that can connect to Azure and has [PowerShell for Azure Stack installed](#bkmk_powershell).  

### Get a registration token from the Azure Stack environment

1. Start PowerShell ISE as an administrator and navigate to the **Registration** folder in the **AzureStack-Tools-master** directory created when you [downloaded the Azure Stack tools](#bkmk_tools). Import the **RegisterWithAzure.psm1** module:  

   ```PowerShell  
   Import-Module .\RegisterWithAzure.psm1
   ```

2. To get the registration token, run the following PowerShell commands:  

   ```Powershell
   $FilePathForRegistrationToken = $env:SystemDrive\RegistrationToken.txt
   $RegistrationToken = Get-AzsRegistrationToken -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel Capacity -AgreementNumber '<EA agreement number>' -TokenOutputFilePath $FilePathForRegistrationToken
   ```

   > [!TIP]  
   > The registration token is saved in the file specified for *$FilePathForRegistrationToken*. You can change the filepath or filename at your discretion.

3. Save this registration token for use on the Azure connected machine. You can copy the file or the text from $FilePathForRegistrationToken.

### Connect to Azure and register

On the computer that is connected to the Internet, perform the same steps to import the RegisterWithAzure.psm1 module and sign in to the correct Azure Powershell context. Then call Register-AzsEnvironment. Specify the registration token to register with Azure. If you are registering more than one instance of Azure Stack using the same Azure Subscription ID, specify a unique registration name. Run the following cmdlet:

  ```PowerShell  
  $registrationToken = "<Your Registration Token>"
  $RegistrationName = "<unique-registration-name>"
  Register-AzsEnvironment -RegistrationToken $registrationToken  -RegistrationName $RegistrationName
  ```

Optionally, you can use the Get-Content cmdlet to point to a file that contains your registration token:

  ```PowerShell  
  $registrationToken = Get-Content -Path '<Path>\<Registration Token File>'
  Register-AzsEnvironment -RegistrationToken $registrationToken -RegistrationName $RegistrationName
  ```

  > [!NOTE]  
  > Save the registration resource name and the registration token for future reference.

### Retrieve an Activation Key from Azure Registration Resource

Next, you need to retrieve an activation key from the registration resource created in Azure during Register-AzsEnvironment.

To get the activation key, run the following PowerShell commands:  

  ```Powershell
  $RegistrationResourceName = "AzureStack-<Cloud Id for the Environment to register>"
  $KeyOutputFilePath = "$env:SystemDrive\ActivationKey.txt"
  $ActivationKey = Get-AzsActivationKey -RegistrationName $RegistrationResourceName -KeyOutputFilePath $KeyOutputFilePath
  ```

  > [!TIP]  
  > The activation key is saved in the file specified for *$KeyOutputFilePath*. You can change the filepath or filename at your discretion.

### Create an Activation Resource in Azure Stack

Return to the Azure Stack environment with the file or text from the activation key created from Get-AzsActivationKey. Next you will create an activation resource in Azure Stack using that activation key. To create an activation resource, run the following PowerShell commands:  

  ```Powershell
  $ActivationKey = "<activation key>"
  New-AzsActivationResource -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -ActivationKey $ActivationKey
  ```

Optionally, you can use the Get-Content cmdlet to point to a file that contains your registration token:

  ```Powershell
  $ActivationKey = Get-Content -Path '<Path>\<Activation Key File>'
  New-AzsActivationResource -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -ActivationKey $ActivationKey
  ```

## Verify Azure Stack registration

Use these steps to verify that Azure Stack is successfully registered with Azure.

1. Sign in to the Azure Stack [administrator portal](https://docs.microsoft.com/azure/azure-stack/azure-stack-manage-portals#access-the-administrator-portal): https&#58;//adminportal.*&lt;region>.&lt;fqdn>*.
2. Select **More Services** > **Marketplace Management** > **Add from Azure**.

If you see a list of items available from Azure (such as WordPress), your activation was successful. However, in disconnected environments you will not see Azure marketplace items in the Azure Stack marketplace.

> [!NOTE]
> After registration is complete, the active warning for not registering will no longer appear.

## Renew or change registration

### Renew or change registration in connected environments

You’ll need to update or renew your registration in the following circumstances:

- After you renew your capacity-based yearly subscription.
- When you change your billing model.
- When you scale changes (add/remove nodes) for capacity-based billing.

#### Change the subscription you use

If you would like to change the subscription you use, you must first run the **Remove-AzsRegistration** cmdlet, then ensure you are logged in to the correct Azure PowerShell context, and finally run **Set-AzsRegistration** with any changed parameters:

  ```PowerShell  
  Remove-AzsRegistration -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint
  Set-AzureRmContext -SubscriptionId $NewSubscriptionId
  Set-AzsRegistration -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse -RegistrationName $RegistrationName
  ```

#### Change the billing model or syndication features

If you would like to change the billing model or syndication features for your installation, you can call the registration function to set the new values. You do not need to first remove the current registration:

  ```PowerShell  
  Set-AzsRegistration -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint -BillingModel PayAsYouUse -RegistrationName $RegistrationName
  ```

### Renew or change registration in disconnected environments

You’ll need to update or renew your registration in the following circumstances:

- After you renew your capacity-based yearly subscription.
- When you change your billing model.
- When you scale changes (add/remove nodes) for capacity-based billing.

#### Remove the activation resource from Azure Stack

You will first need to remove the activation resource from Azure Stack, and then the registration resource in Azure.  

To remove the activation resource in Azure Stack, run the following PowerShell commands in your Azure Stack environment:  

  ```Powershell
  Remove-AzsActivationResource -PrivilegedEndpointCredential $YourCloudAdminCredential -PrivilegedEndpoint $YourPrivilegedEndpoint
  ```

Next, to remove the registration resource in Azure, ensure you are on an Azure connected computer, sign in to the correct Azure PowerShell context, and run the appropriate PowerShell commands as described below.

You can use the registration token used to create the resource:  

  ```Powershell
  $registrationToken = "<registration token>"
  Unregister-AzsEnvironment -RegistrationToken $registrationToken
  ```

Or you can use the registration name:

  ```Powershell
  $registrationName = "AzureStack-<Cloud Id of Azure Stack Environment>"
  Unregister-AzsEnvironment -RegistrationName $registrationName
  ```

### Re-register using disconnected steps

You have now completely unregistered in a disconnected scenario and must repeat the steps for registering an Azure Stack environment in a disconnected scenario.

## Next steps

[Download marketplace items from Azure](azure-stack-download-azure-marketplace-item.md)
