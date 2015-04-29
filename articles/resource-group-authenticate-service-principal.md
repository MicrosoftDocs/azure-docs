<properties
   pageTitle="Authenticating a Service Principal with Azure Resource Manager"
   description="Describes how to grant access to a Service Principal through role-based access control and authenticate it. Shows how to perform these tasks with PowerShell and Azure CLI."
   services="na"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="04/28/2015"
   ms.author="tomfitz"/>

# Authenticating a Service Principal with Azure Resource Manager

This topic shows you how to permit a service principal (such as an automated process, application, or service) to access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to a service principal, and authenticate that service principal. This topic shows you how to use PowerShell and Azure CLI to assign a role to service prinicpal and authenticate the serivce principal.


## Concepts
1. Azure Active Directory (AAD) - an identity and access management service for the cloud. For more information, see [What is Azure active Directory](./active-directory-whatis.md)
2. Service Principal - An instance of an application in a directory.
3. AD Application - Directory record that identifies an application to AAD. For more information, see [Basics of Authentication in Azure AD](https://msdn.microsoft.com/library/azure/874839d9-6de6-43aa-9a5c-613b0c93247e#BKMK_Auth).

## Grant access to and authenticate a service principal using PowerShell

If you do not have Azure PowerShell installed, see [How to install and configure Azure PowerShell](./powershell-install-configure.md).

You will start by creating a service principal. To do this we must use create an application in the directory. This section will walk through creating a new application in the directory.

1. Create a new AAD Application by running the **New-AzureADApplication** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        PS C:\> $azureAdApplication = New-AzureADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -Password "<Your_Password>"

   The Azure AD application is returned:

        Type                    : Application
        ApplicationId           : a41acfda-d588-47c9-8166-d659a335a865
        ApplicationObjectId     : a26aaa48-bd52-4a7f-b29f-1bebf74c91e3
        AvailableToOtherTenants : False
        AppPermissions          : {{
                            "claimValue": "user_impersonation",
                            "description": "Allow the application to access My
                              Application on behalf of the signed-in user.",
                            "directAccessGrantTypes": [],
                            "displayName": "Access <<Your Application Display Name>>",
                            "impersonationAccessGrantTypes": [
                              {
                                "impersonated": "User",
                                "impersonator": "Application"
                              }
                            ],
                            "isDisabled": false,
                            "origin": "Application",
                            "permissionId":
                            "b866ef28-9abb-4698-8c8f-eb4328533831",
                            "resourceScopeType": "Personal",
                            "userConsentDescription": "Allow the application
                             to access <<Your Application Display Name>> on your behalf.",
                            "userConsentDisplayName": "Access <<Your Application Display Name>>",
                            "lang": null
                          }}


   >[AZURE.NOTE] The **ApplicationId** property is needed for creating service principals, role assignments and acquiring JWT tokens. Save the output or capture it in a variable.

3. Create a service principal for your application.

        PS C:\> New-AzureADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

   You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

4. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provie either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Managing and Auditing Access to Resources](./resource-group-rbac.md)

        PS C:\> New-AzureRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId

5. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureSubscription | where { $_.IsCurrent }

   If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrive a different subscription.

6. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

        PS C:\> $creds = Get-Credential

   You will be prompted you to enter your credentials.

   ![][1]

   For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

7. Use the credentials that you entered as an input to the **Add-AzureAccount** cmdlet, which will sign the service principal in:

        PS C:\> Add-AzureAccount -Credential $creds -ServicePrincipal -Tenant $subscription.TenantId

   You should now be authenticated as the service principal for the AAD application that you created.


## Grant access to and authenticate a service principal using Azure CLI

If you do not have Azure CLI for Mac, Linux and Windows installed, see [Install and Configure the Azure CLI](xplat-cli-install.md)

You must already have an AD application and service principal to perform these steps. For information about how to set up an AD application and service principal through the Azure classic portal, 
see [Create a new Azure Service Principal using the Azure classic portal](./resource-group-create-service-principal-portal.md).

1. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provie either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Managing and Auditing Access to Resources](./resource-group-rbac.md)

        azure role assignment create --objectId {service-principal-object-id} -o Reader -c /subscriptions/{subscriptionId}/

2. Determine the **TenantId** of the tenant that the service principal's role assignment resides by listing the accounts and looking for the **TenantId** property in the output.

        azure account list

3. Sign-in using the service principal as your identity. For the user name, use the **ApplicationId** that you used when creating the application. For the password, use the one you specified when creating the account.

        azure login -u "<ApplicationId>" -p "<password>" --service-principal --tenant "<TenantId>"

  You should now be authenticated as the service principal for the AAD application that you created.

## Next Steps
Getting Started  

- [Azure Resource Manager Overview](./resource-group-overview.md)  
- [Using Azure PowerShell with Azure Resource Manager](./powershell-azure-resource-manager.md)
- [Using the Azure CLI for Mac, Linux, and Windows with Azure Resource Management](./xplat-cli-azure-resource-manager.md)  
- [Using the Azure Portal to manage your Azure resources](./resource-group-portal.md)  
  
Creating and Deploying Applications  
  
- [Authoring Azure Resource Manager Templates](./resource-group-authoring-templates.md)  
- [Deploy an application with Azure Resource Manager Template](./resource-group-template-deploy.md)  
- [Troubleshooting Resource Group Deployments in Azure](./resource-group-deploy-debug.md)  
- [Azure Resource Manager Template Functions](./resource-group-template-functions.md)  
- [Advanced Template Operations](./resource-group-advanced-template.md)  
- [Deploy Azure Resources Using .NET Libraries and a Template](./arm-template-deployment.md)
  
Organizing Resources  
  
- [Using tags to organize your Azure resources](./resource-group-using-tags.md)  
  
Managing and Auditing Access  
  
- [Managing and Auditing Access to Resources](./resource-group-rbac.md)  
- [Create a new Azure Service Principal using the Azure portal](./resource-group-create-service-principal-portal.md)  
  


<!-- Images. -->
[1]: ./media/resource-group-authenticate-service-principal/arm-get-credential.png
