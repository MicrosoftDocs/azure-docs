---
title: Manage Azure AD credentials for Azure Key Vault apps
description: Use the Microsoft.Azure.Services.AppAuthentication library to easily and securely manage Azure AD credentials for apps using Azure Key Vault and other Azure services.
keywords: azure key vault azuread credentials
author: lleonard-msft
manager: mbaldwin

ms.author: alleonar
ms.date: 07/09/2017
ms.topic: article
ms.prod:
ms.service: microsoft-keyvault
ms.technology:
ms.assetid: 4be434c4-0c99-4800-b775-c9713c973ee9

---

# Manage Azure AD credentials for Azure Key Vault apps

The `Microsoft.Azure.Services.AppAuthentication` for .NET library simplifies credential management for Microsoft Azure Key Vault and other Azure services that rely on Azure Active Directory (Azure AD) authentication.  

While you're developing your app, the library uses your developer credentials for Azure AD authentication. When your app is deployed to Azure, the library automatically switches to an OAuth 2.0 client authentication flow. This avoids placing credentials at risk because you are no longer tempted to include them in source code or configuration files. 

The `Microsoft.Azure.Services.AppAuthentication` library supports local development with Microsoft Visual Studio, Azure CLI, or Azure AD integrated authentication. When deployed to Azure or an Azure virtual machine (VM), the library automatically uses [Managed Service Identity](/azure/active-directory/msi-overview) (MSI). No code changes are required. The library also supports [service principals](azure/azure-resource-manager/resource-group-authenticate-service-principal). when MSI is not available or when the developer's security context cannot be determined during local development.

<a name="asal">
## </a>Using the library

For .NET applications, the simplest way to work with a Managed Service Identity is through the Microsoft.Azure.Services.AppAuthentication package. Here's how to get started:

1. Add a reference to the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) NuGet package to your application.

2. Add the following code:

    ``` csharp
    using Microsoft.Azure.Services.AppAuthentication;
    using Microsoft.Azure.KeyVault;

    // ...

    var azureServiceTokenProvider = new AzureServiceTokenProvider();
    string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync(
       "https://management.azure.com/").ConfigureAwait(false);

    // OR

    var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(
       azureServiceTokenProvider.KeyVaultTokenCallback));
    ```

The `AzureServiceTokenProvider` class caches the token in memory and retrieves it from Azure AD just before expiration. Consequently, you no longer have to check the expiration before calling the `GetAccessTokenAsync` method. Just call the method when you want to use the token. 

The `GetAccessTokenAsync` method requires a resource identifier. To learn more, see [Which Azure services support Managed Service Identity](https://docs.microsoft.com/en-us/azure/active-directory/msi-overview#which-azure-services-support-managed-service-identity).


<a name="samples"></a>
## Samples

The following samples show the `Microsoft.Azure.Services.AppAuthentication` library in action:

1. [Use a Managed Service Identity (MSI) to retrieve a secret from Azure Key Vault at runtime](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet)

2. [Programmatically deploy an Azure Resource Manager template from an Azure VM with an MSI](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet).

3. [Use .NET Core sample and MSI to call Azure services from an Azure Linux VM](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/).


<a name="local"></a>
## Local development authentication

For local development, there are two primary authentication scenarios:

- [Authenticating to Azure services using Visual Studio, Azure CLI, or Azure AD](#authenticating-to-azure-services-visual-studio-azure-cli-or-azure-ad)
- [Authenticating to custom services](#authenticating-to-custom-services)

Here, you learn the requirements for each scenario.


### Authenticating to Azure Services

Local machines do not support Managed Service Identity (MSI).  As a result, the `Microsoft.Azure.Services.AppAuthentication` library provides a local development experience where the code you'll eventually deploy to Azure uses your local developer identity to run in your local development environment. The means you can test the same code locally and remotely. When deployed to Azure, the library automatically uses MSI for authentication.

For local development, `AzureServiceTokenProvider` tries to fetch a token using **Visual Studio**, **Azure command-line interface** (CLI) or **Azure AD Integrated Authentication**. Each option is tried sequentially and the library uses the first option that succeeds. If no options works, an `AzureServiceTokenProviderException` exception is thrown with detailed information.

### Authenticating with Visual Studio

To use Visual Studio, verify:

1. You've installed [Visual Studio 2017 v15.5](https://blogs.msdn.microsoft.com/visualstudio/2017/10/11/visual-studio-2017-version-15-5-preview/) or later.

2. The [Azure Services Authentication extension](https://go.microsoft.com/fwlink/?linkid=862354) is installed.
 
3. You signed in to Visual Studio and have selected an account to use for local development. Use **Tools**&nbsp;>&nbsp;**Options**&nbsp;>&nbsp;**Azure Service Authentication** to choose an local development account. 

If you run into problems using Visual Studio, such as errors regarding the token provider file, carefully review these steps. 

It may also be necessary to re-authenticate your developer token.  To do so, go to **Tools**&nbsp;>&nbsp;**Options**>**Azure&nbsp;Service&nbsp;Authentication** and look for a **Re-authenticate** link under the selected account.  Select it to authenticate. 

### Authenticating with Azure CLI

To use Azure CLI for local development:

1. Install [Azure CLI v2.0.12](/cli/azure/install-azure-cli?view=azure-cli-latest) or later. Upgrade earlier versions. 

2. Use **az login** to sign in to Azure.

Use `az account get-access-token` to verify access.  If you receive a "No such program found" error, install [Azure CLI 2.0](/cli/azure/install-azure-cli). 

If Azure CLI is not installed to the default directory, you may receive an error reporting that `AzureServiceTokenProvider` cannot find the path for Azure CLI.  To resolve this, Use the **AzureCLIPath**environment variable to define the Azure CLI installation folder.  Note that `AzureServiceTokenProvider` adds the directory specified in the **AzureCLIPath** environment variable to the **Path** environment variable when necessary.

If you are signed in to Azure CLI using multiple accounts or your account has access to multiple subscriptions or tenants, you need to specify the specific subscription to be used.  To do so, use:

    ```
    az account set --subscription <subscription-id>
    ```

    When successful, this command generates no output.  To verify the current account settings, use:

    ```
    az account list
    ```

### Authenticating with Azure AD authentication

To use Azure AD authentication, verify that:

- Your on-premises active directory [syncs to Azure AD](/azure/active-directory/connect/active-directory-aadconnect).

- Your code is running on a domain-joined machine.


### Authenticating to custom services

When custom services call Azure services, the previous steps work because Azure services allow access to both users and applications.  

When creating a service that calls a custom service, use a service principal for local development authentication: 

1.  [Create a service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

2.  Use the service principal to sign in to Azure.  You can:

    - Use Azure CLI to sign in.

        ```
        az login --service-principal -u <principal-id> --password <password>
           --tenant <tenant-id> --allow-no-subscriptions
        ```

        Because the service principal may not have access to a subscription, use the `--allow-no-subscriptions` argument.

    - Use environment variables to specify service principal details.  For details, see [Running the application using a service principal](#running-the-application-using-a-service-principal).

Once you've signed in to Azure, `AzureServiceTokenProvider` uses the service principal to retrieve a token for local development.

This applies only to local development; when your solution is deployed to Azure, the library automatically switches to an MSI workflow.

<a name="msi"></a>
## Running the application using a Managed Service Identity 

When you run your code in Azure that supports MSI or in an Azure VM, the library automatically uses Managed Service Identity to trigger an OAuth 2.0 workflow. No code changes are required. 


<a name="sp"></a>
## Running the application using a Service Principal 

It may be necessary to create a service principal and use it to authenticate. Common examples include:

1. Your code runs on a local development environment, but not under the developer's identity.  Service Fabric, for example, uses a [NetworkService account](https://msdn.microsoft.com/en-us/library/windows/desktop/ms684272(v=vs.85).aspx) for local development.
 
2. Your code runs on a local development environment and you authenticate to a custom service, so you can't use your developer identity. 
 
3. Your code is running on an Azure compute resource that does not yet support Managed Service Identity, such as Azure Batch.

You can use service principals to authenticate in these and similar situations.  Access to service principals can be managed using certificates or traditional passwords.

To manage your service principal using a certificate:

1. Create a [service principal certificate].(/azure/azure-resource-manager/resource-group-authenticate-service-principal). 

2. Deploy the certificate to either the LocalMachine or CurrentUser store. 

3. Set an environment variable named **AzureServicesAuthConnectionString** to:

    ```
    RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint={Thumbprint};
          CertificateStoreLocation={LocalMachine or CurrentUser}.
    ```
 
    Replace _{AppId}_, _{TenantId}_, and _{Thumbprint}_ with values generated in Step 1.

    **CertificateStoreLocation** must be either _CurrentUser_ or _LocalMachine_, based on your deployment plan.

4. Run the application. 

To manage your service principal using a password:

1. Create a [service principal with a password](/azure/azure-resource-manager/resource-group-authenticate-service-principal) and grant it access to the Key Vault. 

2. Set an environment variable named **AzureServicesAuthConnectionString** to:

    ```
    RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret}. 
    ```

    Replace _{AppId}_, _{TenantId}_, and _{ClientSecret}_ with values generated in Step 1.

3. Run the application. 

Once everything's set up correctly, you'll notice that you need no further code changes.  `AzureServiceTokenProvider` use the environment variable and the certificate to authenticate to Azure AD. 

<a name="connectionstrings"></a>
## Connection String Support

By default, `AzureServiceTokenProvider` uses multiple methods to retrieve a token. 

To control the process, use a connection string passed to the `AzureServiceTokenProvider` constructor or specified in the *AzureServicesAuthConnectionString* environment variable. 

The following options are supported:

| Connection&nbsp;string&nbsp;option | Scenario | Comments|
|:--------------------------------|:------------------------|:----------------------------|
| `RunAs=Developer; DeveloperTool=AzureCli`	| Local development | AzureServiceTokenProvider uses AzureCli to get token. |
| `RunAs=Developer; DeveloperTool=VisualStudio`	| Local development | AzureServiceTokenProvider uses Visual Studio to get token. |
| `RunAs=CurrentUser;` | Local development | AzureServiceTokenProvider uses Azure AD Integrated Authentication to get token. |
| `RunAs=App;` | Managed Service Identity | AzureServiceTokenProvider uses Managed Service Identity to get token. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint`<br>`   ={Thumbprint};CertificateStoreLocation={LocalMachine or CurrentUser}`	| Service principal	| `AzureServiceTokenProvider` uses certificate to get token from Azure AD. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};`<br>`   CertificateSubjectName={Subject};CertificateStoreLocation=`<br>`   {LocalMachine or CurrentUser}` | Service principal | `AzureServiceTokenProvider` uses certificate to get token from Azure AD|
| `RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret}` | Service principal |`AzureServiceTokenProvider` uses secret to get token from Azure AD. |


## Next steps

- Learn more about [Managed Service Identity](/azure/app-service/app-service-managed-service-identity)

- Learn different ways to [authenticate and authorize apps](/azure/app-service/app-service-authentication-overview).

- Learn more about Azure AD [authentication scenarios](/azure/active-directory/develop/active-directory-authentication-scenarios#web-browser-to-web-application).