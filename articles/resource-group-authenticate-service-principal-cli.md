<properties
   pageTitle="Create AD application with Azure CLI | Microsoft Azure"
   description="Describes how to use Azure CLI to create an Active Directory application and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate."
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
   ms.date="05/26/2016"
   ms.author="tomfitz"/>

# Create an Active Directory application with Azure CLI to access resources

This topic shows you how to use [Azure CLI for Mac, Linux and Windows](xplat-cli-install.md) to create an Active Directory (AD) application, such as an automated process, application, or service, that can access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to the application.

In this article, you will create two objects - the AD application and the service principal. The AD application resides in the tenant where the app is registered, and defines the process to run. The service principal contains the identity of the AD application and is used for assigning permissions. From the AD application, you can create many service principals. For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

You have 2 options for authenticating your application:

 - password - suitable when a user wants to interactively log in during execution
 - certificate - suitable for unattended scripts that must authenticate without user interaction
 
## Create AD application with password

In this section, you will perform the steps to create the AD application with a password.

1. Switch to Azure Resource Manager mode and sign in to your account.

        azure config mode arm
        azure login

2. Create a new AD application by running the **azure ad app create** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        azure ad app create --name "exampleapp" --home-page "https://www.contoso.org" --identifier-uris "https://www.contoso.org/example" --password <Your_Password>
        
    The AD application is returned. The AppId property is needed for creating service principals, role assignments and acquiring access tokens. 

        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK

### Create service principal and assign to role

1. Create a service principal for your application. Provide the application id that was returned in the previous step.

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

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

### Manually provide credentials through Azure CLI

You have created an AD application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the application to perform operations. You can manually provide the credentials for the application when executing on-demand scripts or commands.

1. Determine the **TenantId** for the subscription that contains the service principal. If you are retrieving the tenant id for your currently authenticated subscription, you do not need to provide the subscription id as a parameter. The **-r** switch retrieves the value without the quotation marks.

        tenantId=$(azure account show -s <subscriptionId> --json | jq -r '.[0].tenantId')

2. For the user name, use the **AppId** that you used when creating the service principal. If you need to retrieve the application id, use the following command. Provide the name of the Active Directory application in the **search** parameter.

        appId=$(azure ad app show --search exampleapp --json | jq -r '.[0].appId')

3. Login as the service principal.

        azure login -u "$appId" --service-principal --tenant "$tenantId"

    You will be prompted for the password. Provide the password you specified when creating the AD application.

        info:    Executing command login
        Password: ********

You are now authenticated as the service principal for the AD application that you created.

## Authenticate with certificate - Azure CLI

In this section, you will perform the steps to create a service principal for an AD application that uses a certificate for authentication. 
To complete these steps you must have [OpenSSL](http://www.openssl.org/) installed.

1. Create a self-signed certificate.

        openssl req -x509 -days 3650 -newkey rsa:2048 -out cert.pem -nodes -subj '/CN=exampleapp'

2. Combine the public and private keys.

        cat privkey.pem cert.pem > examplecert.pem

3. Open the **examplecert.pem** file and copy the certificate data. Look for the long sequence of characters between **-----BEGIN CERTIFICATE-----** and **-----END CERTIFICATE-----**.

4. Create a new Active Directory Application by running the **azure ad app create** command, and provide the certificate data that you copied in the previous step as the key value.

        azure ad app create -n "exampleapp" --home-page "https://www.contoso.org" -i "https://www.contoso.org/example" --key-value <certificate data>

    The Active Directory application is returned. The AppId property is needed for creating service principals, role assignments and acquiring access tokens. 

        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK

### Create service principal and assign to role

1. Create a service principal for your application. Provide the application id that was returned in the previous step.

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
        
2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal. 

### Prepare values for script

In your script you will pass in three values that are needed to log in as the service principal. You will need:

- application id
- tenant id 
- certificate thumbprint

You have seen the application id and certificate thumbprint in previous steps. However, if you need to retrieve these values later, the commands are shown below, along with the command to get the tenant id.


1. To retrieve the certificate thumbprint and remove unneeded characters, use:

        openssl x509 -in "C:\certificates\examplecert.pem" -fingerprint -noout | sed 's/SHA1 Fingerprint=//g'  | sed 's/://g'
    
     Which returns a thumbprint value similar to:

        30996D9CE48A0B6E0CD49DBB9A48059BF9355851

2. To retrieve the tenant id, use:

        azure account show -s <subscriptionId> --json | jq -r '.[0].tenantId'

3. To retrieve the application id, use:

        azure ad app show --search exampleapp --json | jq -r '.[0].appId'

### Provide certificate through automated Azure CLI script

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal.

To authenticate with Azure CLI, provide the certificate thumbprint, certificate file, the application id, and tenant id.

        azure login --service-principal --tenant {tenant-id} -u {app-id} --certificate-file C:\certificates\examplecert.pem --thumbprint {thumbprint}

You are now authenticated as the service principal for the Active Directory application that you created.

## Next Steps
  
- For .NET authentication examples, see [Azure Resource Manager SDK for .NET](resource-manager-net-sdk.md).
- For Java authentication examples, see [Azure Resource Manager SDK for Java](resource-manager-java-sdk.md). 
- For Python authentication examples, see [Resource Management Authentication for Python](https://azure-sdk-for-python.readthedocs.io/en/latest/resourcemanagementauthentication.html).
- For REST authentication examples, see [Resource Manager REST APIs](resource-manager-rest-api.md).
- For detailed steps on integrating an application into Azure for managing resources, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).
- To get more information about using certificates and Azure CLI, see [Certificate-based auth with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx). 
