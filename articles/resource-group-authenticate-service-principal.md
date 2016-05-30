<properties
   pageTitle="Authenticate a service principal with Azure Resource Manager | Microsoft Azure"
   description="Describes how to grant access to a service principal through role-based access control and authenticate it. Shows how to perform these tasks with PowerShell and Azure CLI."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="03/10/2016"
   ms.author="tomfitz"/>

# Authenticating a service principal with Azure Resource Manager

This topic shows you how to permit a service principal (such as an automated process, application, or service) to access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to a service principal, and authenticate that service principal. 

This topic shows you how to use Azure PowerShell or Azure CLI for Mac, Linux and Windows to create an application and service principal, assign a role to service principal, and authenticate as the service principal.
If you do not have Azure PowerShell installed, see [How to install and configure Azure PowerShell](./powershell-install-configure.md). If you do not have Azure CLI installed, see [Install and Configure the Azure CLI](xplat-cli-install.md). For information about using the portal to perform these steps, see [Create Active Directory application and service principal using portal](resource-group-create-service-principal-portal.md)

## Concepts
1. Azure Active Directory - an identity and access management service for the cloud. For more information, see [What is Azure Active Directory](active-directory/active-directory-whatis.md)
2. Service Principal - An instance of an application in a directory that needs to access other resources.
3. Active Directory Application - Directory record that identifies an application to AAD.

For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](active-directory/active-directory-authentication-scenarios.md).

This topic shows 4 paths for creating an Active Directory application and authenticating that application. The paths vary based on whether you want to use a password or certificate for authentication, and whether you 
prefer to use PowerShell or Azure CLI. The paths are:

- [Authenticate with password - PowerShell](#authenticate-with-password---powershell)
- [Authenticate with certificate - PowerShell](#authenticate-with-certificate---powershell)
- [Authenticate with password - Azure CLI](#authenticate-with-password---azure-cli)
- [Authenticate with certificate - Azure CLI](#authenticate-with-certificate---azure-cli)

## Authenticate with password - PowerShell

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing the application identifier and password.

1. Sign in to your account.

        PS C:\> Login-AzureRmAccount

1. Create a new Active Directory application by running the **New-AzureRmADApplication** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        PS C:\> $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -Password "<Your_Password>"

     Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring the access token.

        PS C:\> $azureAdApplication

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 8bc80782-a916-47c8-a47e-4d76ed755275
        ApplicationObjectId     : c95e67a3-403c-40ac-9377-115fa48f8f39
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}

2. Create a service principal for your application by passing in the application id of the Active Directory application.

        PS C:\> New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

3. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        PS C:\> New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Three options are shown in this topic:

- [Manually provide credentials through PowerShell](#manually-provide-credentials-through-powershell)
- [Provide credentials through automated PowerShell script](#provide-credentials-through-automated-powershell-script)
- [Provide credentials through code in an application](#provide-credentials-through-code-in-an-application)

<a id="manually-provide-credentials-through-powershell" />
### Manually provide credentials through PowerShell

You can manually provide the credentials for the service principal when executing on-demand script or commands.

1. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

        PS C:\> $creds = Get-Credential

2. You will be prompted you to enter your credentials. For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

     ![enter credentials][1]

3. Retrieve the subscription in which the role assignment was created. This subscription will be used to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrieve a different subscription.

4. Login as the service principal by using **Login-AzureRmAccount** cmdlet, but provide the credentials object and specify that this account is a service principal.

        PS C:\> Login-AzureRmAccount -Credential $creds -ServicePrincipal -Tenant $subscription.TenantId
        Environment           : AzureCloud
        Account               : {guid}
        Tenant                : {guid}
        Subscription          : {guid}
        CurrentStorageAccount :

You are now authenticated as the service principal for the Active Directory application that you created.

<a id="provide-credentials-through-automated-powershell-script" />
### Provide credentials through automated PowerShell script

This section shows how to login as the service principal without having to manually enter the credentials. You do not have to manually provide the password because it is retrieved from a Key Vault.

> [AZURE.NOTE] Directly including a password in your PowerShell script is not secure because the password is exposed as text. Instead, use a service like Key Vault to store the password, and retrieve it when executing the script.

These steps assume you have set up a Key Vault and a secret that stores the password. To deploy a Key Vault and secret through a template, see [Key Vault template format](). To learn about Key Vault, see 
[Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).

1. Retrieve your password (in the example below, stored as secret with the name **appPassword**) from the Key Vault.

        PS C:\> $secret = Get-AzureKeyVaultSecret -VaultName examplevault -Name appPassword
        
2. Get your Active Directory application. You will need the application id when logging in.

        PS C:\> $azureAdApplication = Get-AzureRmADApplication -IdentifierUri "https://www.contoso.org/example"

3. Create a new **PSCredential** object by providing the application id and password as the credentials.

        PS C:\> $creds = New-Object System.Management.Automation.PSCredential ($azureAdApplication.ApplicationId, $secret.SecretValue)
    
4. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrieve a different subscription.

5. Login as the service principal by using **Login-AzureRmAccount** cmdlet, but provide the credentials object and specify that this account is a service principal.
    
        PS C:\> Login-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId $subscription.TenantId

You are now authenticated as the service principal for the Active Directory application that you created.

<a id="provide-credentials-through-code-in-an-application" />
### Provide credentials through code in an application

To authenticate from a .NET application, include the following code. You will need the application id for the Active Directory application, the password, and the tenant id for the subscription. 
After retrieving the access token, you can work with resources in the subscription.

    public static string GetAccessToken()
    {
      var authenticationContext = new AuthenticationContext("https://login.windows.net/{tenantId or tenant name}");  
      var credential = new ClientCredential(clientId: "{application id}", clientSecret: "{application password}");
      var result = authenticationContext.AcquireToken(resource: "https://management.core.windows.net/", clientCredential:credential);

      if (result == null) {
        throw new InvalidOperationException("Failed to obtain the JWT token");
      }

      string token = result.AccessToken;

      return token;
    }


## Authenticate with certificate - PowerShell

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by 
providing a certificate. This topic assumes you have been issued a certificate.

It shows two ways to work with certificates - key credentials and key values. You can use either approach.

First, you must set up some values in PowerShell that you will use later when creating the application.

1. Sign in to your account.

        PS C:\> Login-AzureRmAccount

1. For both approaches, create an X509Certificate2 object from your certificate and retrieve the key value. Use the path to your certificate and the password for that certificate.

        $cert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @("C:\certificates\examplecert.pfx", "yourpassword")
        $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

2. If you are using key credentials, create the key credentials object and sets its value to the `$keyValue` from the previous step. The example below includes calling `Add-Type` to add a type from an assembly. The path shown in the example should be similar to your path, but might be a little different. 

        Add-Type -Path 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ResourceManager\AzureResourceManager\AzureRM.Resources\Microsoft.Azure.Commands.Resources.dll'
        $currentDate = Get-Date
        $endDate = $currentDate.AddYears(1)
        $keyId = [guid]::NewGuid()
        $keyCredential = New-Object  Microsoft.Azure.Commands.Resources.Models.ActiveDirectory.PSADKeyCredential
        $keyCredential.StartDate = $currentDate
        $keyCredential.EndDate= $endDate
        $keyCredential.KeyId = $keyId
        $keyCredential.Type = "AsymmetricX509Cert"
        $keyCredential.Usage = "Verify"
        $keyCredential.Value = $keyValue

3. Create an application in the directory. The first command shows how to use key values.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -KeyValue $keyValue -KeyType AsymmetricX509Cert       
        
    Or, use the second example to assign key credentials.

         $azureAdApplication = New-AzureRmADApplication -DisplayName "example" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -KeyCredentials $keyCredential

    Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring access tokens.

        PS C:\> $azureAdApplication

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 1975a4fd-1528-4086-a992-787dbd23c46b
        ApplicationObjectId     : 9665e5f3-84b7-4344-92e2-8cc20ad16a8b
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}       

4. Create a service principal for your application by passing in the application id of the Active Directory application.

        PS C:\> New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

    You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

5. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        PS C:\> New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Two options are shown in this topic:

- [Provide certificate through automated PowerShell script](#provide-certificate-through-automated-powershell-script)
- [Provide certificate through code in an application](#provide-certificate-through-code-in-an-application)

<a id="provide-certificate-through-automated-powershell-script" />
### Provide certificate through automated PowerShell script

1. Get your Active Directory application. You will need the application id when logging in

        PS C:\> $azureAdApplication = Get-AzureRmADApplication -IdentifierUri "https://www.contoso.org/example"
        
2. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrieve a different subscription.

3. Get the certificate you will use for authentication.

        PS C:\> $cert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @("C:\certificates\examplecert.pfx", "yourpassword")

4. To authenticate in PowerShell, provide the certificate thumbprint, the application id, and tenant id.

        PS C:\> Login-AzureRmAccount -CertificateThumbprint $cert.Thumbprint -ApplicationId $azureAdApplication.ApplicationId -ServicePrincipal -TenantId $subscription.TenantId

You are now authenticated as the service principal for the Active Directory application that you created.

<a id="provide-certificate-through-code-in-an-application" />
### Provide certificate through code in an application

To authenticate from a .NET application, include the following code. After retrieving the client, you can access resources in the subscription.

    var clientId = "<Application ID for your AAD app>"; 
    var subscriptionId = "<Your Azure SubscriptionId>"; 
    var tenant = "<Tenant id or tenant name>"; 
    var certName = "examplecert"; 

    var authContext = new AuthenticationContext(string.Format("https://login.windows.net/{0}", tenant)); 

    X509Certificate2 cert = null; 
    X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser); 
    
    try 
    { 
      store.Open(OpenFlags.ReadOnly); 
      var certCollection = store.Certificates; 
      var certs = certCollection.Find(X509FindType.FindBySubjectName, certName, false); 
      cert = certs[0]; 
    } 
    finally 
    { 
      store.Close(); 
    }        

    var certCred = new ClientAssertionCertificate(clientId, cert); 
    var token = authContext.AcquireToken("https://management.core.windows.net/", certCred);
    // If using the new resource manager package like "Microsoft.Azure.ResourceManager" version="1.0.0-preview" use below
    var creds = new TokenCredentials(token.AccessToken); 
    // Else if using older package versions like Microsoft.Azure.Management.Resources" version="3.4.0-preview" use below
    // var creds = new TokenCloudCredentials(subscriptionId, token.AccessToken);
    var client = new ResourceManagementClient(creds); 
        

## Authenticate with password - Azure CLI

You will start by creating a service principal. To do this we must use create an application in the directory. This section will walk through creating a new application in the directory.

1. Switch to Azure Resource Manager mode and sign in to your account.

        azure config mode arm
        azure login

2. Create a new Active Directory application by running the **azure ad app create** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        azure ad app create --name "exampleapp" --home-page "https://www.contoso.org" --identifier-uris "https://www.contoso.org/example" --password <Your_Password>
        
    The Active Directory application is returned. The AppId property is needed for creating service principals, role assignments and acquiring access tokens. 

        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK

3. Create a service principal for your application. Provide the application id that was returned in the previous step.

        azure ad sp create 4fd39843-c338-417d-b549-a545f584a745
        
    The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK

    You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

4. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Three options are shown in this topic:

- [Manually provide credentials through Azure CLI](#manually-provide-credentials-through-azure-cli)
- [Provide credentials through automated Azure CLI script](#provide-credentials-through-automated-azure-cli-script)
- [Provide credentials through code in an application](#provide-credentials-through-code-in-an-application-cli)

<a id="manually-provide-credentials-through-Azure-cli" />
### Manually provide credentials through Azure CLI

If you want to manually sign in as the service principal, you can use the **azure login** command. You must provide the tenant id, application id, and password. 
Directly including the password in a script is not secure because the password is stored in the file. See the next section for better option when executing an automated script.

1. Determine the **TenantId** for the subscription that contains the service principal. If you are retrieving the tenant id for your currently authenticated subscription, you do not need to provide the subscription id as a parameter. The **-r** switch retrieves the value without the quotation marks.

        tenantId=$(azure account show -s <subscriptionId> --json | jq -r '.[0].tenantId')

2. For the user name, use the **AppId** that you used when creating the service principal. If you need to retrieve the application id, use the following command. Provide the name of the Active Directory application in the **search** parameter.

        appId=$(azure ad app show --search exampleapp --json | jq -r '.[0].appId')

3. Login as the service principal.

        azure login -u "$appId" --service-principal --tenant "$tenantId"

When prompted, provide the password you specified when creating the account.

    info:    Executing command login
    Password: ********

You are now authenticated as the service principal for the Active Directory application that you created.

<a id="provide-credentials-through-automated-azure-cli-script" />
### Provide credentials through automated Azure CLI script

This section shows how to login as the service principal without having to manually enter the credentials. 

> [AZURE.NOTE] Including a password in your Azure CLI script is not secure because the password is exposed as text. Instead, use a service like Key Vault to store the password, and retrieve it when executing the script.

These steps assume you have set up a Key Vault and a secret that stores the password. To deploy a 
Key Vault and secret through a template, see [Key Vault template format](). To learn about Key Vault, see 
[Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).

1. Retrieve your password (in the example below, stored as secret with the name **appPassword**) from the Key Vault. Include the **-r** switch to remove the starting and ending double quotes that are returned from the json output.

        secret=$(azure keyvault secret show --vault-name examplevault --secret-name appPassword --json | jq -r '.value')
    
2. Determine the **TenantId** for the subscription that contains the service principal. If you are retrieving the tenant id for your currently authenticated subscription, you do not need to provide the subscription id as a parameter.

        tenantId=$(azure account show -s <subscriptionId> --json | jq -r '.[0].tenantId')

3. For the user name, use the **AppId** that you used when creating the service principal. If you need to retrieve the application id, use the following command. Provide the name of the Active Directory application in the **search** parameter.

        appId=$(azure ad app show --search exampleapp --json | jq -r '.[0].appId')

4. Login in as the service principal by providing the application id, the password from Key Vault, the tenant id.

        azure login -u "$appId" -p "$secret" --service-principal --tenant "$tenantId"
    
You are now authenticated as the service principal for the Active Directory application that you created.

<a id="provide-credentials-through-code-in-an-application-cli" />
### Provide credentials through code in an application

To authenticate from a .NET application, include the following code. You will need the application id for the Active Directory application, the password, and the tenant id for the subscription. 
After retrieving the access token, you can work with resources in the subscription.

    public static string GetAccessToken()
    {
      var authenticationContext = new AuthenticationContext("https://login.windows.net/{tenantId or tenant name}");  
      var credential = new ClientCredential(clientId: "{application id}", clientSecret: "{application password}");
      var result = authenticationContext.AcquireToken(resource: "https://management.core.windows.net/", clientCredential:credential);

      if (result == null) {
        throw new InvalidOperationException("Failed to obtain the JWT token");
      }

      string token = result.AccessToken;

      return token;
    }

## Authenticate with certificate - Azure CLI

In this section, you will perform the steps to create a service principal for an Azure Active Directory application that uses a certificate for authentication. 
This topic assumes you have been issued a certificate and you have [OpenSSL](http://www.openssl.org/) installed.

1. Create a **.pem** file with:

        openssl pkcs12 -in C:\certificates\examplecert.pfx -out C:\certificates\examplecert.pem -nodes

2. Open the **.pem** file and copy the certificate data. Look for the long sequence of characters between **-----BEGIN CERTIFICATE-----** and **-----END CERTIFICATE-----**.

3. Create a new Active Directory Application by running the **azure ad app create** command, and provide the certificate data that you copied in the previous step as the key value.

        azure ad app create -n "exampleapp" --home-page "https://www.contoso.org" -i "https://www.contoso.org/example" --key-value <certificate data>

    The Active Directory application is returned. The AppId property is needed for creating service principals, role assignments and acquiring access tokens. 

        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK

4. Create a service principal for your application. Provide the application id that was returned in the previous step.

        azure ad sp create 4fd39843-c338-417d-b549-a545f584a745
        
    The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK
        
5. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Two options are shown in this topic:

- [Provide certificate through automated Azure CLI script](#provide-certificate-through-automated-azure-cli-script)
- [Provide certificate through code in an application](#provide-certificate-through-code-in-an-application-cli)

<a id="provide-certificate-through-automated-azure-cli-script" />
### Provide certificate through automated Azure CLI script

1. You need to retrieve the certificate thumbprint and remove unneeded characters.

        cert=$(openssl x509 -in "C:\certificates\examplecert.pem" -fingerprint -noout | sed 's/SHA1 Fingerprint=//g'  | sed 's/://g')
    
     Which returns a thumbprint value similar to:

        30996D9CE48A0B6E0CD49DBB9A48059BF9355851

2. Determine the **TenantId** for the subscription that contains the service principal. If you are retrieving the tenant id for your currently authenticated subscription, you do not need to provide the subscription id as a parameter. The **-r** switch retrieves the value without the quotation marks.

        tenantId=$(azure account show -s <subscriptionId> --json | jq -r '.[0].tenantId')

3. For the user name, use the **AppId** that you used when creating the service principal. If you need to retrieve the application id, use the following command. Provide the name of the Active Directory application in the **search** parameter.

        appId=$(azure ad app show --search exampleapp --json | jq -r '.[0].appId')

4. To authenticate with Azure CLI, provide the certificate thumbprint, certificate file, the application id, and tenant id.

        azure login --service-principal --tenant "$tenantId" -u "$appId" --certificate-file C:\certificates\examplecert.pem --thumbprint "$cert"

You are now authenticated as the service principal for the Active Directory application that you created.

<a id="provide-certificate-through-code-in-an-application-cli" />
### Provide certificate through code in an application

To authenticate from a .NET application, include the following code. After retrieving the client, you can access resources in the subscription.

    var clientId = "<Application ID for your AAD app>"; 
    var subscriptionId = "<Your Azure SubscriptionId>"; 
    var tenant = "<Tenant id or tenant name>"; 
    var certName = "examplecert"; 

    var authContext = new AuthenticationContext(string.Format("https://login.windows.net/{0}", tenant)); 

    X509Certificate2 cert = null; 
    X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser); 
    
    try 
    { 
      store.Open(OpenFlags.ReadOnly); 
      var certCollection = store.Certificates; 
      var certs = certCollection.Find(X509FindType.FindBySubjectName, certName, false); 
      cert = certs[0]; 
    } 
    finally 
    { 
      store.Close(); 
    }        

    var certCred = new ClientAssertionCertificate(clientId, cert); 
    var token = authContext.AcquireToken("https://management.core.windows.net/", certCred); 
    // If using the new resource manager package like "Microsoft.Azure.ResourceManager" version="1.0.0-preview" use below
    var creds = new TokenCredentials(token.AccessToken); 
    // Else if using older package versions like Microsoft.Azure.Management.Resources" version="3.4.0-preview" use below
    // var creds = new TokenCloudCredentials(subscriptionId, token.AccessToken);
    var client = new ResourceManagementClient(creds); 
       
To get more information about using certificates and Azure CLI, see [Certificate-based auth with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx) 

## Next Steps
  
- To learn about using the portal with service principals, see [Create a new Azure Service Principal using the Azure portal](./resource-group-create-service-principal-portal.md)  
- For guidance on implementing security with Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)


<!-- Images. -->
[1]: ./media/resource-group-authenticate-service-principal/arm-get-credential.png
