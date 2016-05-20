<properties
   pageTitle="Create AD application with PowerShell | Microsoft Azure"
   description="Describes how to create an Active Directory application and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="05/20/2016"
   ms.author="tomfitz"/>

# Creating and authenticating an Active Directory application with Azure Resource Manager

This topic shows you how to use Azure PowerShell to create an Active Directory application (such as an automated process, application, or service) that can access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to the application.

If you do not have Azure PowerShell installed, see [How to install and configure Azure PowerShell](powershell-install-configure.md). 

For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

You have 2 options for authenticating your application:

 - use password for interactive log in
 - use certificate for unattended scripts

## Create AD application with password

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing the application identifier and password.

1. Sign in to your account.

        Add-AzureRmAccount

1. Create a new Active Directory application by running the **New-AzureRmADApplication** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -Password "<Your_Password>"

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


### Create service principal and assign to role

1. Create a service principal for your application by passing in the application id of the Active Directory application.

        New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal. Three options are shown in this topic:

### Manually provide credentials through PowerShell

You can manually provide the credentials for the service principal when executing on-demand script or commands.

1. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

        $creds = Get-Credential

2. You will be prompted you to enter your credentials. For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

     ![enter credentials](./media/resource-group-authenticate-service-principal/arm-get-credential.png)

3. Retrieve the subscription in which the role assignment was created. This subscription will be used to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrieve a different subscription.

4. Login as the service principal by using **Login-AzureRmAccount** cmdlet, but provide the credentials object and specify that this account is a service principal.

        Login-AzureRmAccount -Credential $creds -ServicePrincipal -Tenant $subscription.TenantId
        Environment           : AzureCloud
        Account               : {guid}
        Tenant                : {guid}
        Subscription          : {guid}
        CurrentStorageAccount :

You are now authenticated as the service principal for the Active Directory application that you created.

## Create AD application with certificate

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing a certificate. 

1. Sign in to your account.

        Add-AzureRmAccount

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

        $azureAdApplication

    Which returns output similar to:

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 1975a4fd-1528-4086-a992-787dbd23c46b
        ApplicationObjectId     : 9665e5f3-84b7-4344-92e2-8cc20ad16a8b
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}    


### Create service principal and assign to role

1. Create a service principal for your application by passing in the application id of the Active Directory application.

        New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal. Three options are shown in this topic:

### Provide certificate through automated PowerShell script

1. Get your Active Directory application. You will need the application id when logging in

        $azureAdApplication = Get-AzureRmADApplication -IdentifierUri "https://www.contoso.org/example"
        
2. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrieve a different subscription.

3. Get the certificate you will use for authentication.

        $cert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @("C:\certificates\examplecert.pfx", "yourpassword")

4. To authenticate in PowerShell, provide the certificate thumbprint, the application id, and tenant id.

        Login-AzureRmAccount -CertificateThumbprint $cert.Thumbprint -ApplicationId $azureAdApplication.ApplicationId -ServicePrincipal -TenantId $subscription.TenantId

You are now authenticated as the service principal for the Active Directory application that you created.



## Next Steps
  
- To learn about using the portal with service principals, see [Create a new Azure Service Principal using the Azure portal](resource-group-create-service-principal-portal.md)  
- For guidance on implementing security with Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)

