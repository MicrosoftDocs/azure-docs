<properties
   pageTitle="Managing and Auditing Access to Resources"
   description="Use role-based access control (RBAC) to manage user permissions for resources deployed to Azure."
   services="azure-portal"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-portal"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="AzurePortal"
   ms.workload="na"
   ms.date="04/28/2015"
   ms.author="tomfitz"/>

# Managing and Auditing Access to Resources

With Azure Resource Manager, you can make sure the users in your organization have the appropriate permissions to manage or access resources. Resource Manager takes advantage of role-based access control (RBAC) so you can easily apply security policies to individual resources or resource groups. For example, you can grant a user access to a specific virtual machine in a subscription, or give a user the ability to manage all websites in a subscription but no other resources.

## Concepts

There are a few key concepts about role-based access control for you to understand:

1. Principal - the entity granted permission, such as a user, security group, or application.
2. Role - set of permitted actions
3. Scope - the level a role applies to, such as the subscription, resource group, or resource.
3. Role Assignment - the process of adding a principal to a role and setting the scope.

## Role examples
To understand RBAC concepts, let's look at some examples of common role definitions:

| Role    | Allowed actions |
| ------- | ----------------- |
| Reader  | */read  (Read anything) |
| Owner   | *       (Read/write anything) |

To assign the **Reader** role to **User A** for resource group named **ExampleGroup**, and the **Owner** role to **User B** for the whole subscription, you would assign the following:

| Role    | Principal   | Scope |
| --------|-------------|---------- |
| Reader  | User A      | /subscriptions/{subscriptionId}/resourceGroups/examplegroup |
| Owner   | User B      | /subscriptions/{subscriptionId} |

## Example Scenarios

In this topic, you will see how to perform the following common scenarios through Azure PowerShell, Azure CLI for Mac, Linux and Windows, and REST API.

1. View the available roles in a subscription and the permitted actions for those roles.
2. Grant Reader permissions to members of a group across the subscription.
3. Grant Contributor permissions to an application to allow the application to manage resources inside the resource group.
4. Grant Owner permissions on a particular website to a single user.
5. List auditing logs of resource group.


## How to use PowerShell to manage access
If you do not already have the latest version of Azure PowerShell installed, see [Install and configure Azure PowerShell](./powershell-install-configure.md). Open the Azure PowerShell console. 

1. Login to your Azure account with your credentials. The command returns information about your account.

        PS C:\> Add-AzureAccount
          
        Id                             Type       ...
        --                             ----    
        someone@example.com            User       ...   

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment. 

        PS C:\> Select-AzureSubscription -SubscriptionID <YourSubscriptionId>

3. Switch to the Azure Resource Manager module.

        PS C:\> Switch-AzureMode AzureResourceManager

### View available roles
To view all available roles for your subscription run the **Get-AzureRoleDefinition** command.

    PS C:\> Get-AzureRoleDefinition

    Name                          Id                            Actions                  NotActions
    ----                          --                            -------                  ----------
    API Management Service Con... /subscriptions/####... {Microsoft.ApiManagement/S...   {}
    Application Insights Compo... /subscriptions/####... {Microsoft.Insights/compon...   {}
    ...

### Grant Reader permission to a group for the subscription.
1. Review the **Reader** role definition by providing the role name when running the **Get-AzureRoleDefinition** command. Check that the allowed actions are what you intend to assign.

        PS C:\> Get-AzureRoleDefinition Reader
   
        Name            Id                            Actions           NotActions
        ----            --                            -------           ----------
        Reader          /subscriptions/####...        {*/read}          {}

2. Get the required security group by running the **Get-AzureADGroup** command. Provide the actual name of the group in your subscription. ExampleAuditorGroup is shown below.

        PS C:\> $group = Get-AzureAdGroup -SearchString ExampleAuditorGroup

3. Create the role assignment for the auditor security group. When the command completes, the new role assignment is returned.

        PS C:\> New-AzureRoleAssignment -ObjectId $group.Id -Scope /subscriptions/{subscriptionId}/ -RoleDefinitionName Reader

        Mail               :
        RoleAssignmentId   : /subscriptions/####/providers/Microsoft.Authorization/roleAssignments/####
        DisplayName        : Auditors
        RoleDefinitionName : Reader
        Actions            : {*/read}
        NotActions         : {}
        Scope              : /subscriptions/####
        ObjectId           : ####

###Grant Contributor permission to an application for a resource group.
1. Review the **Contributor** role definition by providing the role name when running the **Get-AzureRoleDefinition** command. Check that the allowed actions are what you intend to assign.

        PS C:\> Get-AzureRoleDefinition Contributor

2. Get the service principal object Id by running the **Get-AzureADServicePrincipal** command and providing the name of the application in your subscription. ExampleApplication is shown below.

        PS C:\> $service = Get-AzureADServicePrincipal -ServicePrincipalName ExampleApplicationName

3. Create the role assignments for the service principal by running the **New-AzureRoleAssignment** command.

        PS C:\> New-AzureRoleAssignment -ObjectId $service.Id -ResourceGroupName ExampleGroupName -RoleDefinitionName Contributor

For a more thorough explanation of setting up an Azure Active Directory application and a service principal, see [Authenticating a Service Principal with Azure Resource Manager](./resource-group-authenticate-service-principal.md).

###Grant Owner permissions to a user for a resource.
1. Review the **Owner** role definition by providing the role name when running the **Get-AzureRoleDefinition** command. Check that the allowed actions are what you intend to assign.

        PS C:\> Get-AzureRoleDefinition Owner

2. Create the role assignments for the user.

        PS C:\> New-AzureRoleAssignment -UserPrincipalName "someone@example.com" -ResourceGroupName {groupName} -ResourceType "Microsoft.Web/sites" -ResourceName "mysite" -RoleDefinitionName Owner


###List auditing logs of resource group.
To get the auditing log for a resource group, run the **Get-AzureResourceGroupLog** command.

      PS C:\> Get-AzureResourceGroupLog -ResourceGroup ExampleGroupName

## How to use Azure CLI for Mac, Linux and Windows

If you do not have Azure CLI for Mac, Linux and Windows installed or you have not configured your organizational account for use with Azure CLI, see [Install and Configure the Azure CLI](xplat-cli-install.md).

1. Login to your Azure account with your credentials. The command returns the result of your login.

        azure login

        ...
        info:    login command OK

2. If you have multiple subscriptions, provide the subscription id you wish to use for deployment.

        azure account set <YourSubscriptionNameOrId>

3. Switch to Azure Resource Manager module. You will receive confirmation of the new mode.

        azure config mode arm
        
        info:     New mode is arm

### View available roles
View all available roles for your subscription. It returns a list of role definitions.

    azure role list

### Grant Reader permission to a group for the subscription.
1. Get the role definition for the **Reader** role. Check that the allowed actions are what you intend to assign.

        azure role show Reader
        
        info:    Executing command role show
        + Getting role definitions
        data:    Name    Actions  NotActions
        data:    ------  -------  ----------
        data:    Reader  */read
        info:    role show command OK

2. Get the required security group and its objectId by searching for the group based on the name. ExampleAuditorGroup is shown in the following example.

        azure ad group show --search ExampleAuditorGroup
        
        info:    Executing command ad group show
        + Getting group list
        data:    Display Name:      ExampleAuditorGroup
        data:    ObjectId:          1c272299-9729-462a-8d52-7efe5ece0c5c
        data:    Security Enabled:  true
        data:    Mail Enabled:
        data:
        info:    ad group show command OK

3. Create the role assignment for the security group.

        azure role assignment create --objectId {group-object-id} -o Reader -c /subscriptions/{subscriptionId}/
        
        info:    Executing command role assignment create
        + Getting role definition id
        + Creating role assignment
        info:    role assignment create command OK


### Grant Contributor permission to an application for a resource group.
1. Get the role definition for the **Contributor** role. Check that the allowed actions are what you intend to assign.

        azure role show Contributor

2. Get the ObjectId for the application. Provide the name of the application to retrieve.

        azure ad sp show --search ExampleApplicationName

2. Create the role assignment for the application.

        azure role assignment create --ObjectId {service-principal-object-id} -o Contributor -c /subscriptions/{subscriptionId}/


###Grant Owner permissions to a user for a particular website.
1. Get the role definition for the **Owner** role. Check that the allowed actions are what you intend to assign.

        azure role show Owner

2. Create the role assignment for the user.

        azure role assignment create --mail "someone@example.com" -o Owner -c /subscriptions/{subscriptionId}/resourceGroups/{groupName}/providers/Microsoft.Web/sites/{mySiteName}


###List auditing logs of resource group.
To get the auditing log for a resource group, run the **azure group log show** command and provide the name of the desired resource group.

         azure group log show ExampleGroupName


## How to use the REST API
To manage role-based access control through the Azure Resource Manager REST API, you must set common headers and parameters (including authentication tokens) when sending the requests. For information see [Common parameters and headers](https://msdn.microsoft.com/library/azure/dn906885.aspx).
   
To discover supported api-versions, run:

      GET https://management.azure.com/providers/Microsoft.Authorization?api-version=2015-01-01

You can use version `2014-10-01-preview` for this topic.

###Create a role assignment
Get the available role definitions.

    GET https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleDefinitions?api-version=2014-10-01-preview

Create the role assignment.

    PUT https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleAssignments/{role-assignment-id}?api-version=2014-10-01-preview
    {
      "properties": {
          "roleDefinitionId": "/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
          "principalId": "{principal-object-id}",
          "scope": "/subscriptions/{subscription-id}"
       }
    }


###Delete a role assignment

      Delete  https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleAssignments/{role-assignment-id}?api-version=2014-10-01-preview


## Next steps

- [Role-based access control in the Microsoft Azure portal](./role-based-access-control-configure.md)
- [Create a new Azure Service Principal using the Azure classic portal](./resource-group-create-service-principal-portal.md)
- [Authenticating a Service Principal through Azure Resource Manager](./resource-group-authenticate-service-principal.md)

