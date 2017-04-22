---
title: Create identity for Azure app with Azure CLI | Microsoft Docs
description: Describes how to use Azure CLI to create an Azure Active Directory application and service principal, and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: c224a189-dd28-4801-b3e3-26991b0eb24d
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 03/31/2017
ms.author: tomfitz

---
# Use Azure CLI to create a service principal to access resources
> [!div class="op_single_selector"]
> * [PowerShell](resource-group-authenticate-service-principal.md)
> * [Azure CLI](resource-group-authenticate-service-principal-cli.md)
> * [Portal](resource-group-create-service-principal-portal.md)
> 
> 

When you have an app or script that needs to access resources, you can set up an identity for the app and authenticate the app with its own credentials. This identity is known as a service principal. This approach enables you to:

* Assign permissions to the app identity that are different than your own permissions. Typically, these permissions are restricted to exactly what the app needs to do.
* Use a certificate for authentication when executing an unattended script.

This article shows you how to use [Azure CLI 1.0](../cli-install-nodejs.md) to set up an application to run under its own credentials and identity. Install the latest version of [Azure CLI 1.0](../cli-install-nodejs.md) to make sure your environment matches the examples in this article.

## Required permissions
To complete this topic, you must have sufficient permissions in both your Azure Active Directory and your Azure subscription. Specifically, you must be able to create an app in the Azure Active Directory, and assign the service principal to a role. 

The easiest way to check whether your account has adequate permissions is through the portal. See [Check required permission in portal](resource-group-create-service-principal-portal.md#required-permissions).

Now, proceed to a section for either [password](#create-service-principal-with-password) or [certificate](#create-service-principal-with-certificate) authentication.

## Create service principal with password
In this section, you perform the steps to create the AD application with a password, and assign the Reader role to the service principal.

1. Sign in to your account.
   
   ```azurecli
   azure login
   ```
2. To create an app identity, provide the name of the app and a password, as shown in the following command:
     
   ```azurecli
   azure ad sp create -n exampleapp -p {your-password}
   ```
     
   The new service principal is returned. The Object Id is needed when granting permissions. The guid listed with the Service Principal Names is needed when logging in. This guid is the same value as the app id. In the sample applications, this value is referred to as the `Client ID`. 
     
   ```azurecli
   info:    Executing command ad sp create
     
   Creating application exampleapp
     / Creating service principal for application 7132aca4-1bdb-4238-ad81-996ff91d8db+
     data:    Object Id:               ff863613-e5e2-4a6b-af07-fff6f2de3f4e
     data:    Display Name:            exampleapp
     data:    Service Principal Names:
     data:                             7132aca4-1bdb-4238-ad81-996ff91d8db4
     data:                             https://www.contoso.org/example
     info:    ad sp create command OK
   ```

3. Grant the service principal permissions on your subscription. In this example, you add the service principal to the Reader role, which grants permission to read all resources in the subscription. For other roles, see [RBAC: Built-in roles](../active-directory/role-based-access-built-in-roles.md). For the objectid parameter, provide the Object Id that you used when creating the application. Before running this command, you must allow some time for the new service principal to propagate throughout Azure Active Directory. When you run these commands manually, usually enough time has elapsed between tasks. In a script, you should add a step to sleep between the commands (like `sleep 15`). If you see an error stating the principal does not exist in the directory, rerun the command.
   
   ```azurecli
   azure role assignment create --objectId ff863613-e5e2-4a6b-af07-fff6f2de3f4e -o Reader -c /subscriptions/{subscriptionId}/
   ```
   
That's it! Your AD application and service principal are set up. The next section shows you how to log in with the credential through Azure CLI. If you want to use the credential in your code application, you do not need to continue with this topic. You can jump to the [Sample applications](#sample-applications) for examples of logging in with your application id and password. 

### Provide credentials through Azure CLI
Now, you need to log in as the application to perform operations.

1. Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Azure Active Directory. To retrieve the tenant id for your currently authenticated subscription, use:
   
   ```azurecli
   azure account show
   ```
   
   Which returns:
   
   ```azurecli
   info:    Executing command account show
   data:    Name                        : Windows Azure MSDN - Visual Studio Ultimate
   data:    ID                          : {guid}
   data:    State                       : Enabled
   data:    Tenant ID                   : {guid}
   data:    Is Default                  : true
   ...
   ```
   
     If you need to get the tenant id of another subscription, use the following command:
   
   ```azurecli
   azure account show -s {subscription-id}
   ```
2. If you need to retrieve the client id to use for logging in, use:
   
   ```azurecli
   azure ad sp show -c exampleapp --json
   ```
   
     The value to use for logging in is the guid listed in the service principal names.
   
   ```azurecli
   [
     {
       "objectId": "ff863613-e5e2-4a6b-af07-fff6f2de3f4e",
       "objectType": "ServicePrincipal",
       "displayName": "exampleapp",
       "appId": "7132aca4-1bdb-4238-ad81-996ff91d8db4",
       "servicePrincipalNames": [
         "https://www.contoso.org/example",
         "7132aca4-1bdb-4238-ad81-996ff91d8db4"
       ]
     }
   ]
   ```
3. Log in as the service principal.
   
   ```azurecli
   azure login -u 7132aca4-1bdb-4238-ad81-996ff91d8db4 --service-principal --tenant {tenant-id}
   ```
   
    You are prompted for the password. Provide the password you specified when creating the AD application.
   
   ```azurecli
   info:    Executing command login
   Password: ********
   ```

You are now authenticated as the service principal for the service principal that you created.

Alternatively, you can invoke REST operations from the command line to log in. From the authentication response, you can retrieve the access token for use with other operations. For an example of retrieving the access token by invoking REST operations, see [Generating an Access Token](resource-manager-rest-api.md#generating-an-access-token).

## Create service principal with certificate
In this section, you perform the steps to:

* create a self-signed certificate
* create the AD application with the certificate, and the service principal
* assign the Reader role to the service principal

To complete these steps, you must have [OpenSSL](http://www.openssl.org/) installed.

1. Create a self-signed certificate.
   
   ```
   openssl req -x509 -days 3650 -newkey rsa:2048 -out cert.pem -nodes -subj '/CN=exampleapp'
   ```

2. The preceding step created two files - privkey.pem and cert.pem. Combine the public and private keys into a single file.

   ```
   cat privkey.pem cert.pem > examplecert.pem
   ```

3. Open the **examplecert.pem** file and look for the long sequence of characters between **-----BEGIN CERTIFICATE-----** and **-----END CERTIFICATE-----**. Copy the certificate data. You pass this data as a parameter when creating the service principal.

4. Sign in to your account.

   ```azurecli
   azure login
   ```
5. To create the service principal, provide the name of the app and the certificate data, as shown in the following command:
     
   ```azurecli
   azure ad sp create -n exampleapp --cert-value {certificate data}
   ```
     
   The new service principal is returned. The Object Id is needed when granting permissions. The guid listed with the Service Principal Names is needed when logging in. This guid is the same value as the app id. In the sample applications, this value is referred to as the Client ID. 
     
   ```azurecli
   info:    Executing command ad sp create
     
   Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
     data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
     data:    Display Name:     exampleapp
     data:    Service Principal Names:
     data:                      4fd39843-c338-417d-b549-a545f584a745
     data:                      https://www.contoso.org/example
     info:    ad sp create command OK
   ```
6. Grant the service principal permissions on your subscription. In this example, you add the service principal to the Reader role, which grants permission to read all resources in the subscription. For other roles, see [RBAC: Built-in roles](../active-directory/role-based-access-built-in-roles.md). For the objectid parameter, provide the Object Id that you used when creating the application. Before running this command, you must allow some time for the new service principal to propagate throughout Azure Active Directory. When you run these commands manually, usually enough time has elapsed between tasks. In a script, you should add a step to sleep between the commands (like `sleep 15`). If you see an error stating the principal does not exist in the directory, rerun the command.
   
   ```azurecli
   azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/
   ```
  
### Provide certificate through automated Azure CLI script
Now, you need to log in as the application to perform operations.

1. Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Azure Active Directory. To retrieve the tenant id for your currently authenticated subscription, use:
   
   ```azurecli
   azure account show
   ```
   
   Which returns:
   
   ```azurecli
   info:    Executing command account show
   data:    Name                        : Windows Azure MSDN - Visual Studio Ultimate
   data:    ID                          : {guid}
   data:    State                       : Enabled
   data:    Tenant ID                   : {guid}
   data:    Is Default                  : true
   ...
   ```
   
   If you need to get the tenant id of another subscription, use the following command:
   
   ```azurecli
   azure account show -s {subscription-id}
   ```
2. To retrieve the certificate thumbprint and remove unneeded characters, use:
   
   ```
   openssl x509 -in "C:\certificates\examplecert.pem" -fingerprint -noout | sed 's/SHA1 Fingerprint=//g'  | sed 's/://g'
   ```
   
   Which returns a thumbprint value similar to:
   
   ```
   30996D9CE48A0B6E0CD49DBB9A48059BF9355851
   ```
3. If you need to retrieve the client id to use for logging in, use:
   
   ```azurecli
   azure ad sp show -c exampleapp
   ```
   
   The value to use for logging in is the guid listed in the service principal names.
     
   ```azurecli
   [
     {
       "objectId": "7dbc8265-51ed-4038-8e13-31948c7f4ce7",
       "objectType": "ServicePrincipal",
       "displayName": "exampleapp",
       "appId": "4fd39843-c338-417d-b549-a545f584a745",
       "servicePrincipalNames": [
         "https://www.contoso.org/example",
         "4fd39843-c338-417d-b549-a545f584a745"
       ]
     }
   ]
   ```
4. Log in as the service principal.
   
   ```azurecli
   azure login --service-principal --tenant {tenant-id} -u 4fd39843-c338-417d-b549-a545f584a745 --certificate-file C:\certificates\examplecert.pem --thumbprint {thumbprint}
   ```

You are now authenticated as the service principal for the Azure Active Directory application that you created.

## Change credentials

To change the credentials for an AD app, either because of a security compromise or a credential expiration, use `azure ad app set`.

To change a password, use:

```azurecli
azure ad app set --applicationId 4fd39843-c338-417d-b549-a545f584a745 --password p@ssword
```

To change a certificate value, use:

```azurecli
azure ad app set --applicationId 4fd39843-c338-417d-b549-a545f584a745 --cert-value {certificate data}
```

## Debug

You may encounter the following errors when creating a service principal:

* **"Authentication_Unauthorized"** or **"No subscription found in the context."** - You see this error when your account does not have the [required permissions](#required-permissions) on the Azure Active Directory to register an app. Typically, you see this error when only admin users in your Azure Active Directory can register apps, and your account is not an admin. Ask your administrator to either assign you to an administrator role, or to enable users to register apps.

* Your account **"does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/{guid}'."** - You see this error when your account does not have sufficient permissions to assign a role to an identity. Ask your subscription administrator to add you to User Access Administrator role.

## Sample applications
The following sample applications show how to log in as the service principal.

**.NET**

* [Deploy an SSH Enabled VM with a Template with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)
* [Manage Azure resources and resource groups with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)

**Java**

* [Getting Started with Resources - Deploy Using Azure Resource Manager Template - in Java](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)
* [Getting Started with Resources - Manage Resource Group - in Java](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource-group//)

**Python**

* [Deploy an SSH Enabled VM with a Template in Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-template-deployment/)
* [Managing Azure Resource and Resource Groups with Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-resources-and-groups/)

**Node.js**

* [Deploy an SSH Enabled VM with a Template in Node.js](https://azure.microsoft.com/documentation/samples/resource-manager-node-template-deployment/)
* [Manage Azure resources and resource groups with Node.js](https://azure.microsoft.com/documentation/samples/resource-manager-node-resources-and-groups/)

**Ruby**

* [Deploy an SSH Enabled VM with a Template in Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/)
* [Managing Azure Resource and Resource Groups with Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-resources-and-groups/)

## Next Steps
* For detailed steps on integrating an application into Azure for managing resources, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).
* To get more information about using certificates and Azure CLI, see [Certificate-based authentication with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx). 

