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
   ms.date="05/25/2016"
   ms.author="tomfitz"/>

# Creating and authenticating an Active Directory application with Azure Resource Manager

This topic shows you how to use [Azure PowerShell](powershell-install-configure.md) to create an Active Directory (AD) application, such as an automated process, application, or service, that can access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to the application.

In this article, you will create two objects - the AD application and the service principal. The AD application resides in the tenant where the app is registered, and defines the process to run. The service principal contains the identity of the AD application and is used for assigning permissions. From the AD application, you can create many service principals. For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

You have 2 options for authenticating your application:

 - password - suitable when a user wants to interactively log in during execution
 - certificate - suitable for unattended scripts that must authenticate without user interaction

## Create AD application with password

In this section, you will perform the steps to create the AD application with a password.

1. Sign in to your account.

        Add-AzureRmAccount

1. Create a new Active Directory application by providing a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -Password "<Your_Password>"

     Examine the new application object. 

        $azureAdApplication
        
     Note in particular the **ApplicationId** property which is needed for creating service principals, role assignments and acquiring the access token.

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 8bc80782-a916-47c8-a47e-4d76ed755275
        ApplicationObjectId     : c95e67a3-403c-40ac-9377-115fa48f8f39
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}


### Create service principal and assign to role

From your AD application, you must create a service principal and assign a role to it.

1. Create a service principal for your application by passing in the application id of the Active Directory application.

        New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

### Manually provide credentials through PowerShell

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the application to perform operations. You can manually provide the credentials for the application when executing on-demand script or commands.

1. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

        $creds = Get-Credential

2. You will be prompted you to enter your credentials. For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

     ![enter credentials](./media/resource-group-authenticate-service-principal/arm-get-credential.png)

3. Retrieve the subscription in which the role assignment was created. This subscription will be used to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        $subscription = Get-AzureRmSubscription

     If your account is linked to more than one subscription, provide a subscription name or id to get the subscription you wish to work with.
     
        $subscription = Get-AzureRmSubscription -SubscriptionName "Windows Azure MSDN - Visual Studio Ultimate"

4. Login as the service principal by specifying that this account is a service principal and by providing the credentials object.

        Add-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId $subscription.TenantId
        
     You are now authenticated as the service principal for the Active Directory application that you created.

5. To use the current access token in a later session, you can save the profile.

        Save-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
        
     You can open the profile and examine its contents. Notice that it contains an access token. 
        
6. Instead of logging in again the next time you wish to execute code as the service principal, simply load the profile.

        Select-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
        
> [AZURE.NOTE] The access token will expire, so using a saved profile only works for as long as the token is valid. To permanently run unattended scripts, use a certificate.
        
## Create AD application with certificate

In this section, you will perform the steps to create an AD application with a certificate. 

1. Create a self-signed certificate.

        $cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=exampleapp" -KeySpec KeyExchange
       
     You will receive information about the certificate, including the thumbprint.
     
        Directory: Microsoft.PowerShell.Security\Certificate::CurrentUser\My

        Thumbprint                                Subject
        ----------                                -------
        724213129BD2B950BB3F64FAB0C877E9348B16E9  CN=exampleapp

2. Retrieve the key value from the certificate.

        $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

3. Sign in to your Azure account.

        Add-AzureRmAccount

4. Create an application in the directory.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -KeyValue $keyValue -KeyType AsymmetricX509Cert -EndDate $cert.NotAfter -StartDate $cert.NotBefore      
        
    Examine the new application object. 

        $azureAdApplication

    Notice the **ApplicationId** property which is needed for creating service principals, role assignments and acquiring access tokens.

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

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

### Provide certificate through automated PowerShell script

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal.

1. In your script you will pass in three values that are needed to log in as the service principal. You will need:

   - application id
   - tenant id 
   - certificate thumbprint

   You have seen the application id and certificate thumbprint in previous steps. You can retrieve the tenant id with:

      $tenantid = (Get-AzureRmSubscription).TenantId 

   Or, if you have more than one subscription, you can specify a specific one:

      $tenantid = (Get-AzureRmSubscription -SubscriptionName "Windows Azure MSDN - Visual Studio Ultimate").TenantId

4. To authenticate in your script, specify the account is a service principal and provide the certificate thumbprint, the application id, and tenant id.

        Add-AzureRmAccount -ServicePrincipal -CertificateThumbprint {thumbprint} -ApplicationId {applicationId} -TenantId {tenantid}

You are now authenticated as the service principal for the Active Directory application that you created.

## Next Steps
  
- For .NET authentication examples, see [Azure Resource Manager SDK for .NET](resource-manager-net-sdk.md).
- For Java authentication examples, see [Azure Resource Manager SDK for Java](resource-manager-java-sdk.md). 
- For Python authentication examples, see [Resource Management Authentication for Python](https://azure-sdk-for-python.readthedocs.io/en/latest/resourcemanagementauthentication.html).
- For REST authentication examples, see [Resource Manager REST APIs](resource-manager-rest-api.md).
- For detailed steps on integrating an application into Azure for managing resources, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).


