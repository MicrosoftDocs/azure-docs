<properties
   pageTitle="Authenticate a service principal with Azure Resource Manager | Microsoft Azure"
   description="Describes how to grant access to a service principal through role-based access control and authenticate it. Shows how to perform these tasks with PowerShell and Azure CLI."
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
service principal. 

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
service principal. 

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
       
To get more information about using certificates and Azure CLI, see [Certificate-based auth with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx) 
