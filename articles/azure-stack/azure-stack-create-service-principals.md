---
title: Create a Service Principal for Azure Stack | Microsoft Docs
description: Describes how to create a new service principal that can be used with the role-based access control in Azure Resource Manager to manage access to resources.
services: azure-resource-manager
documentationcenter: na
author: Shriramnat
manager: bradleyb


ms.assetid: 7068617b-ac5e-47b3-a1de-a18c918297b6
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/16/2017
ms.author: shnatara

---
# Provide applications access to Azure Stack
When an application needs access to deploy or configure resources through Azure Resource Manager in Azure Stack, you will create a service principal, which is an identity for your application.  You can then delegate only the necessary permissions to that service principal.  

As an example, you may have a configuration management tool that uses Azure Resource Manager to inventory resources.  In this scenario, you can create a service principal, grant the reader role to that service principal, and limit the configuration management tool to read-only access. 

Service principals are preferable to running the app under your own credentials because:

* You can assign permissions to the service principal that are different than your own account permissions. Typically, these permissions are restricted to exactly what the app needs to do.
* You do not have to change the app's credentials if your responsibilities change.
* You can use a certificate to automate authentication when executing an unattended script.  

## Getting started

Depending on how you have deployed Azure Stack, you will start by creating a service principal.  This document guides you through creating a service principal for both [Azure Active Directory(Azure AD)](azure-stack-create-service-principals.md#create-service-principal-for-azure-ad) and [Active Directory Federation Services(AD FS)](azure-stack-create-service-principals.md#create-service-principal-for-ad-fs).  Once you've created the service principal, you'll use a set of steps that are common to both AD FS and Azure AD to [delegate permissions](azure-stack-create-service-principals.md#assign-role-to-service-principal) to the role.     

## Create service principal for Azure AD

If you've deployed Azure Stack using Azure AD as the identity store, you can create service principals just like you do for Azure.  This section shows you how to perform the steps through the portal.  Check that you have the [required Azure AD permissions](../azure-resource-manager/resource-group-create-service-principal-portal.md#required-permissions) before beginning.

### Create service principal
In this section, you'll create an application (service principal) in Azure AD that will represent your application.

1. Log in to your Azure Account through the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** > **App registrations** > **Add**   
3. Provide a name and URL for the application. Select either **Web app / API** or **Native** for the type of application you want to create. After setting the values, select **Create**.

You have created a service principal for your application.

### Get credentials
When programmatically logging in, you use the ID for your application and an authentication key. To get those values, use the following steps:

1. From **App registrations** in Active Directory, select your application.

2. Copy the **Application ID** and store it in your application code. The applications in the [sample applications](#sample-applications) section refer to this value as the client id.

     ![client id](./media/azure-stack-create-service-principal/image12.png)
3. To generate an authentication key, select **Keys**.

4. Provide a description of the key, and a duration for the key. When done, select **Save**.

After saving the key, the value of the key is displayed. Copy this value because you are not able to retrieve the key later. You provide the key value with the application ID to sign as the application. Store the key value where your application can retrieve it.

![saved key](./media/azure-stack-create-service-principal/image15.png)


Once complete, proceed to [assigning your application a role](azure-stack-create-service-principals.md#assign-role-to-service-principal).

## Create service principal for AD FS
If you have deployed Azure Stack with AD FS, you can use PowerShell to create a service principal, assign a role for access, and sign in from PowerShell using that identity.

### Before you begin

[Download the tools required to work with Azure Stack to your local computer.](azure-stack-powershell-download.md)

### Import the Identity PowerShell module
After you download the tools, navigate to the downloaded folder and import the Identity PowerShell module by using the following command:

```PowerShell
Import-Module .\Identity\AzureStack.Identity.psm1
```

When you import the module, you may receive an error that says “AzureStack.Connect.psm1 is not digitally signed. The script will not execute on the system”. To resolve this issue, you can set execution policy to allow running the script with the following command in an elevated PowerShell session:

```PowerShell
Set-ExecutionPolicy Unrestricted
```

### Create the service principal
You can create a Service Principal by executing the following command:
```powershell
$servicePrincipal = New-ADGraphServicePrincipal`
 -DisplayName "<YourServicePrincipalName>"`
 -AdminCredential $(Get-Credential)`
 -Verbose
```
### Assign a role
Once the Service Principal is created, you must [assign it to a role](azure-stack-create-service-principals.md#assign-role-to-service-principal)

### Sign in through PowerShell
Once you've assigned a role, you can sign in using the service principal with the following command:

```powershell
Add-AzureRmAccount -EnvironmentName "<AzureStackEnvironmentName>"`
 -ServicePrincipal`
 -CertificateThumbprint $servicePrincipal.Thumbprint`
 -ApplicationId $servicePrincipal.ApplicationId` 
 -TenantId $directoryTenantId
```

## Assign role to service principal
To access resources in your subscription, you must assign the application to a role. Decide which role represents the right permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](../active-directory/role-based-access-built-in-roles.md).

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group means it can read the resource group and any resources it contains.

1. Navigate to the level of scope you wish to assign the application to. For example, to assign a role at the subscription scope, select **Subscriptions**. You could instead select a resource group or resource.

2. Select the particular subscription (resource group or resource) to assign the application to.

     ![select subscription for assignment](./media/azure-stack-create-service-principal/image16.png)

3. Select **Access Control (IAM)**.

     ![select access](./media/azure-stack-create-service-principal/image17.png)

4. Select **Add**.

5. Select the role you wish to assign to the application.

6. Search for your application, and select it.

7. Select **OK** to finish assigning the role. You see your application in the list of users assigned to a role for that scope.

Now that you've created a service principal and assigned a role, you can begin using this within your application to access Azure Stack resources.  

## Next steps

[Add users for ADFS](azure-stack-add-users-adfs.md)
[Manage user permissions](azure-stack-manage-permissions.md)