---
title: Hoster admin delegated administration
description: How to delegate administrative capabilities on a Winows Virtual Desktop deployment, including examples.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Hoster admin: delegated administration

## The why: problems, outcomes, and measures

Customers of current Remote Desktop Services have complained about the lack of ability to delegate administrative capabilities on an Remote Desktop Services deployment. All administrators must be domain admins and therefore have full control over the Remote Desktop Services 2016 deployment, making it impossible to delegate access to specific resources within the Remote Desktop Services deployment. Windows Virtual Desktop will address this issue by providing a delegated administrative capability, similar to [Azure’s Role-based Access Control (RBAC)](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles).

## Detailed feature description

### Windows Virtual Desktop roles

The Windows Virtual Desktop delegated administration model is based on Azure’s RBAC and uses the following three Azure RBAC built-in roles and definitions:

* Remote Desktop Services Contributor: can manage everything except access
* Remote Desktop Services Owner: can manage everything including access
* Remote Desktop Services Reader: can view everything but can't make changes

In addition, two Windows Virtual Desktop-specific built-in roles have been added:

* Remote Desktop Services Tenant Creator: can create RD Tenant objects assigned at the RD Infra Level, but user cannot view settings of the RD Infra container object and cannot view RD Tenant objects created by others
* Remote Desktop Services User: can access feed and the published apps and desktops within an AppGroup

As with the Azure RBAC model, these built-in roles have a set of capabilities that is defined by Microsoft and cannot be changed by the customer. In Windows Virtual Desktop vFuture, we may extend to allow additional custom roles to be created, depending on feedback from customers and partners.

>[!NOTE]
>Cmdlet Designer will be used to define the PowerShell cmdlets, parameters, and parameter sets. See the project named RemoteDesktop 2.0.

#### Object model

The following object containment model is provided to help understand the delegated admin model and associated PowerShell cmdlets. What is not shown in this diagram is that there is an additional object contained in each object called RoleAssignment. The RoleAssignment object specifies the admin role assignment for the object that contains it. The only exceptions to this are the SessionHost and UserSession objects which have no explicit role assignment and always inherit the same ownerships as the host pool.

**Figure 1** Object model

![Object model](media\Object-model.png)

#### Built-in Remote Desktop Services roles

The primary capabilities associated with each built-in Windows Virtual Desktop role are summarized in the following table.

|Role|Create|Modify|Read|Delete|Authorize|
|---|---|---|---|---|---|
|Remote Desktop Services Owner| X | X | X | X | X |
|Remote Desktop Services Contributor| X | X | X | X | |
|Remote Desktop Services Reader| | | X | | |
|Remote Desktop Services Tenant Creator| X (Tenants under deployment.) | | | | |

>[!NOTE]
>Following the Azure model capabilities for the built-in roles are fixed for each release but may change in a future release.

The following table maps roles to applicable objects and the PowerShell cmdlets (or equivalent REST APIs) that can be run under the Role-Object combination.

|Role|Applicable Objects|Permitted PowerShell and equivalent REST|
|---|---|---|
|Remote Desktop Services Owner|Deployment (assigned)|Get, Set-RdsDeployment $_ <br>Get, Set-RdsInfraRole $_ <br>New-RdsTenant<br>Get-RdsDiagnosticsActivities<br>New, Get, Remove-RdsRoleAssignment $_<br>
|Remote Desktop Services Owner| Tenant (assigned or inherited) | Get, Set, Remove-RdsTenant $_ <br>New-RdsHostPool<br>New, Get, Remove-RdsRoleAssignment $_|
|Remote Desktop Services Owner|HostPool (assigned or inherited)|Get, Set, Remove-RdsHostPool $_ <br>Get-RdsHostPoolAvailableApp $_ <br>New-RdsAppGroup<br>New-RdsRegistrationInfo<br>Get-RdsDiagnostics<br>New, Get, Remove-RdsRoleAssignment $_ |
|Remote Desktop Services Owner|RegistrationInfo (inherited)|Get, Set, Remove-RdsRegistationInfo $_|
|Remote Desktop Services Owner|SessionHost (inherited)|Get, Remove-RdsSessionHost $_|
|Remote Desktop Services Owner|UserSession (inherited)|Get, Send, Invoke, Disconnect-RdsUserSession $_ |
|Remote Desktop Services Owner|AppGroup (assigned or inherited)|Get, Set, Remove-RdsAppGroup $_ <br>New-RdsRemoteApp<br>New, Get, Remove-RdsRoleAssignment $_|
|Remote Desktop Services Owner|RemoteApp (inherited)|Get, Set, Remove-RdsRemoteApp $_|
|Remote Desktop Services Contributor|Same as Remote Desktop Services Owner|Same as Remote Desktop Services Owner, but without <br>New, Get, Remove-RdsRoleAssignment $_|
|Remote Desktop Services Reader|Deployment (assigned)|Get-RdsDeployment $_ <br>Get-RdsInfraRole $_ <br>Get-RdsDiagnostics
|Remote Desktop Services Reader|Tenant (assigned or inherited)|Get-RdsTenant $_<br> Get-RdsDiagnostics|
|Remote Desktop Services Reader|HostPool (assigned or inherited)|Get-RdsHostPool $_ <br>Get-RdsHostPoolAvailableApp $_ <br>Get-RdsDiagnostics
|Remote Desktop Services Reader|RegistrationInfo (inherited)|Get-RdsRegistationInfo $_|
|Remote Desktop Services Reader|SessionHost (inherited)|Get-RdsSessionHost $_
|Remote Desktop Services Reader|UserSession1 (inherited)|Get-RdsUserSession $_ 
|Remote Desktop Services Reader|AppGroup (assigned or inherited)|Get-RdsAppGroup $_
|Remote Desktop Services Reader|RemoteApp2 (inherited)|Get-RdsRemoteApp $_
|Remote Desktop Services Tenant Creator|Deployment (assigned)|New-RdsTenant
|Remote Desktop Services User|AppGroup|Allows user access to the feed and published items in the AppGroup

The following is a list of applicable objects for each role, and the PowerShell cmdlets (or equivalent REST APIs) that can be run under each Role-Object combination.

The Remote Desktop Services Owner role can be mapped to the following applicable objects. Each object includes its permitted PowerShell and equivalent REST command.

* Deployment (assigned).
  ```PowerShell
  Get, Set-RdsDeployment $_
  Get, Set-RdsInfraRole $_
  New-RdsTenant
  Get-RdsDiagnosticsActivities
  New, Get, Remove-RdsRoleAssignment $_
  ```
* Tenant (assigned or inhereted).
  ```PowerShell
  Get, Set, Remove-RdsTenant $_
  New-RdsHostPool
  New, Get, Remove-RdsRoleAssignment $_
  ```
* HostPool (assigned or inherited).
  ```PowerShell
  Get, Set, Remove-RdsHostPool $_
  Get-RdsHostPoolAvailableApp $_
  New-RdsAppGroup
  New-RdsRegistrationInfo
  Get-RdsDiagnostics
  New, Get, Remove-RdsRoleAssignment $_
  ```
* RegistrationInfo (inherited).
  ```PowerShell
  Get, Set, Remove-RdsRegistationInfo $_
  ```
* SessionHost (inherited)
  ```PowerShell
  Get, Remove-RdsSessionHost $_
  ```
* UserSession (inherited).
  ```PowerShell
  Get, Send, Invoke, Disconnect-RdsUserSession $_
  ```
* AppGroup (assigned or inherited).
  ```PowerShell
  Get, Set, Remove-RdsAppGroup $_
  New-RdsRemoteApp
  New, Get, Remove-RdsRoleAssignment $_
  ```
* RemoteApp (inherited).
  ```PowerShell
  Get, Set, Remove-RdsRemoteApp $_
  ```

The Remote Desktop Services Contributor role can be assigned to the same objects as the Remote Desktop Services Owner role. However, this role isn't permitted to execute the following command.

```PowerShell
New, Get, Remove-RdsRoleAssignment $_
```

The Remote Desktop Services Reader role can be assigned to the following objects and commands.

* Deployment (assigned).
  ```PowerShell
  Get-RdsDeployment $_
  Get-RdsInfraRole $_
  Get-RdsDiagnostics
  ```
* Tenant (assigned or inherited).
  ```PowerShell
  Get-RdsTenant $_
  Get-RdsDiagnostics
  ```
* HostPool (assigned or inherited).
  ```PowerShell
  Get-RdsHostPool $_
  Get-RdsHostPoolAvailableApp $_
  Get-RdsDiagnostics
  ```
* RegistrationInfo (inherited).
  ```PowerShell
  Get-RdsRegistationInfo $_
  ```
* SessionHost (inherited).
  ```PowerShell
  Get-RdsSessionHost $_
  ```
* UserSession (inherited).
  ```PowerShell
  Get-RdsUserSession $_ 
  ```
* AppGroup (assigned or inherited).
  ```PowerShell
  Get-RdsAppGroup $_
  ```
* RemoteApp (assigned or inherited).
  ```PowerShell
  Get-RdsRemoteApp $_
  ```

The Remote Desktop Services Tenant Creator role can be assigned to the following object.

* Deployment (assigned)
  ```PowerShell
  New-RdsTenant
  ```

The Remote Desktop Services User role an be assigned to the following object.

* AppGroup: this object allows user acess to the feed and published items wtihin the AppGroup.

>[!NOTE]
>All implicitly created objects inherit. Leaf nodes always inherit to simplify.

#### Remote Desktop Services roles as defined by Azure RBAC Custom Role Definition syntax

The Remote Desktop Services roles can be defined in the format of a custom Azure RBAC role, as defined in [Custom roles in Azure](https://docs.microsoft.com/azure/active-directory/role-based-access-control-custom-roles), which is of the form:
Microsoft.<</span>ProviderName>/<</span>ChildResourceType>/<</span>action>

In this example:
* ProviderName = WVD
* ChildResourceType = Remote Desktop Services object class
* Action = PowerShell verb or equivalent REST method

Remote Desktop Services Owner:

```JSON
{
    "Name": "RDS Owner",
    "Id": "cadbaa5a-4e7a-47be-84db-05cad13b6769",
    "IsCustom": False,
    "Description": "Can perform all operations on any RDS objects.",
    "Actions": [
        "Microsoft.WVD/*/*",         // all operations on all objects
    ],
    "NotActions": [

    ],
    "AssignableScopes": [
        “*”                                           // all scopes
    ]
}
```

Remote Desktop Services Contributor:

```JSON
{
    "Name": "RDS Contributor",
    "Id": "cadbbb5a-4e7a-47be-84db-05cad13b6769",
    "IsCustom": False,
    "Description": "Can perform all operations on any RDS object, except the .",
    "Actions": [
        "Microsoft.WVD/*/*"
    ],
    "NotActions": [
        "Microsoft.WVD/RoleAssignment/create/action",
        "Microsoft.WVD/RoleAssignment/remove/action",
        “Microsoft.WVD/RoleAssignment/read”
    ],
    "AssignableScopes": [
        “*”
    ]
}
```

Remote Desktop Services Reader:

```JSON
{
  "Name": "RDS Reader",
  "Id": "cadbcc5a-4e7a-47be-84db-05cad13b6769",
  "IsCustom": False,
  "Description": "Can Read properties of RDS objects.",
  "Actions": [
    "Microsoft.WVD/*/read",
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
       “*”
  ]
}
```

Remote Desktop Services Tenant Creator:

```JSON
{
  "Name": "RDS Creator",
  "Id": "cadbdd5a-4e7a-47be-84db-05cad13b6769",
  "IsCustom": False,
  "Description": "Can create new RDS Tenant objects.",
  "Actions": [
    "Microsoft.WVD/Tenant/create",
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
       “Deployment/*”      // Note: Not inherited by contained-objects
  ]
}
```

Remote Desktop Services AppGroup User:

```JSON
{
  "Name": "RDS AppGroup User",
  "Id": "cadbdd5a-4e7a-47be-84db-05cad13b6769",
  "IsCustom": False,
  "Description": "Can read the feed and access published items associated with AppGroups.",
  "Actions": [
    "Microsoft.WVD/AppGroup/access/action",    // includes the feed
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
       “Deployment/Tenant/HostPool/AppGroup/*”   // Applies to the AppGroup scope and contained-objects
       “Deployment/Tenant/HostPool/AppGroup/RemoteApp/*  // inherited
       “Deployment/Tenant/HostPool/AppGroup/Desktop/*       // inherited
  ]
}
```

#### Example assignment scenarios

The following table lists example assignment scenarios.

|Assignment persona|Persona assigned to role on an object|Role|Object instance|
|---|---|---|---|
|Inherited|Admin1@hsp1.net|Remote Desktop Services Owner|Deployment (root)|
|Admin1@hsp1.net|Admin2@hsp1.net|Remote Desktop Services Owner|Deployment|
|Admin2@hsp1.net|Ops1@hsp1.net|Remote Desktop Services Reader|/Infrastructure/Diagnostics|
|Admin2@hsp.net|AdminA@isv1.com|Remote Desktop Services Tenant Creator|Deployment|
|AdminA@isv1.com|AdminB@isv1.com|Remote Desktop Services Owner|/Tenant (belonging to ISV1)|
|AdminB@isv1.com|AdminC@isv1.com|Remote Desktop Services Owner|/Tenant/HostPool (belonging to ISV1)|
|AdminB@isv1.com|OpsA@isv1.com|Remote Desktop Services Reader|/Tenant/Diagnostics|
|AdminC@isv1.com|AdminX@customer1.org|Remote Desktop Services Owner|/Tenant/HostPool/AppGroup|
|Admin2@hsp1.net|Admin99@reseller.com|Remote Desktop Services Owner|/Tenant/HostPool/AppGroup|

#### Inheritance rules

When an object is explicitly created using PowerShell or REST, the creator’s account is automatically assigned the Remote Desktop Services Owner role on the object.

All explicitly created objects can have users and roles assigned and removed using PowerShell or REST.

Implicitly created objects such as SessionHost, UserSession, and Diagnostics cannot have roles assigned or removed directly, but always inherit the same privileges as the object that contains them. SessionHost and UserSession always inherit from the host pool. Diagnostics always inherits from the Infra object or Tenant object that contains it.

All objects inherit the roles assigned to the hierarchy of container objects above them.

To match Azure behavior, you should derive inheritance by traversing the tree above the object to determine inherited assignments, not by storing it on each object.

Inherited roles cannot be blocked at the inheriting object. Inherited roles can only be removed at the object that is the source of the inheritance.

A single user account may have two or more roles on a given RD object; such as 0 or 1 explicitly assigned to the RD object and 0-N inherited. A single user account can have the same role on one object if one is inherited and one is explicitly assigned.

### PowerShell cmdlet design

#### New-RdsRoleAssignment (TP2)

Modeled after [New-AzureRmRoleAssignment](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermroleassignment?view=azurermps-4.3.1) with the SignInName and ServicePrincipalName parameter sets. Scope is replaced with the RD parameters common to other Windows Virtual Desktop PowerShell cmdlets, such as *TenantName*, *HostPoolName*, and *AppGroupName*. Three additional scopes added: Infrasturucture, Diagnostics/infra and Diagnostics/tenant. Simplified the parameter sets by dropping ObjectId as a subject of the assignment to support groups. (This will also be addressed in RS5 when we address groups for AppGroup user assignments.) Also simplified parameter sets by eliminating leaf objects from the scope.

The following examples show SignInName parameter sets.

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -AppGroupName <string> -HostPoolName <string> -SignInName <string> -TenantName <string>
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -HostPoolName <string> -SignInName <string> -TenantName <string>
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -Diagnostics -Infrastructure -SignInName <string>
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -Infrastructure -SignInName <string>
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -SignInName <string>
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -Diagnostics -SignInName <string> -TenantName <string>
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -SignInName <string> -TenantName <string>
```

The following examples show ServicePrincipalNme parameter sets.

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -AppGroupName <string> -HostPoolName <string> -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -HostPoolName <string> -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -Diagnostics -Infrastructure -ServicePrincipalName <string> [-AadTenantId <string>]
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -Infrastructure -ServicePrincipalName <string> [-AadTenantId <string>]
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -ServicePrincipalName <string> [-AadTenantId <string>]
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

```PowerShell
New-RdsRoleAssignment [-RoleDefinition] <string> -Diagnostics -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

Use the **New-RdsRoleAssignment** cmdlet to grant access. Access is granted by assigning the appropriate Remote Desktop Services role to a user or an application at the specified RD object scope. To grant access to the entire RD Deployment, assign a role at the Infra Deployment scope. To grant access to a specific RD Tenant within an RD Deployment, assign a role at the RD Tenant scope, and so on down the tree of RD Objects.

The subject of the assignment must be specified. To specify a user, use the *SignInName* parameter. To specify an application, use *ServicePrincipalName*.

The role that is being assigned must be specified using the *RoleDefinitionName* parameter.

The RD object scope at which access is being granted may be specified using RD object name parameters. With no RD object name parameters, it defaults to the InfraDeployment object that was set in the **Set-RdsContext** cmdlet. The scope of the assignment can be further narrowed by using the following parameters: *TenantName*, *HostPoolName*, and *AppGroup*.

Parameters:

* *AadTenantId*: specifies the AAD tenant ID from which the service principal is a member.
* *AppGroupName*: name of the RD AppGroup.
* *Diagnostics*: switch to indicate the diagnostics scope. (Must be paired with either the Infrastructure switch or the Tenant switch.)
* *HostPoolName*: name of the RD HostPool.
* *Infrastructure*: switch to indicate the infrastructure scope.
* *RoleDefinitionName*: name of the Remote Desktop Services RBAC role that needs to be assigned to the user, group, or app; for example, Remote Desktop Services Owner, Remote Desktop Services Reader, and so on.
* *ServerPrincipleName*: name of the Azure AD application.
* *SignInName*: the email address or the user principal name of the user.
* *TenantName*: name of the RD Tenant.

```PowerShell
Return: 
DeploymentName	: <String>
Infrastructure		: <Boolean switch>
TenantName		: <String>
HostPoolName		: <String>
AppGroupName	: <String>
Diagnostics		: <Boolean switch>
DisplayName        	: <String>      // this is the DisplayName of the User or ServicePrincipal
SignInName         	: <String> 
RdsRoleDefinitionName 	: <enum: RDS Reader, RDS Contributor, RDS Owner, RDS Tenant Creator, RDS User>
ObjectId           		: <Guid> 
ObjectType         	: <Enum: User, ServicePrincipal>
```

Console Output: same as the object above.

Error Conditions: for more information, see [Common error conditions and messages (TP2)](#common-error-conditions-and-messages-(TP2)).

The following table lists an error condition example.

|Error condition|Text|
|---|---|
|Adding a role assignment that already exists on the RD object|The role assignment already exists|

#### Get-RdsRoleAssignment (TP2)

Modeled after **Get-AzureRmRoleAssignment** with only the scope parameter set.

```PowerShell
Get-RdsRoleAssignment -AppGroupName <string> -HostPoolName <string> -TenantName <string>
```

```PowerShell
Get-RdsRoleAssignment -HostPoolName <string> -TenantName <string>
```

```PowerShell
Get-RdsRoleAssignment -Diagnostics -Infrastructure
```

```PowerShell
Get-RdsRoleAssignment -Infrastructure
```

```PowerShell
Get-RdsRoleAssignment [-Root]
```

```PowerShell
Get-RdsRoleAssignment -TenantName <string>
```

```PowerShell
Get-RdsRoleAssignment -Diagnostics -TenantName <string>
```

Use the **Get-RdsRoleAssignment** cmdlet to list role assignments that are effective within an RD object scope. This list can be filtered using parameters for principal and RD object scope.

The RD object scope may be specified. Without any parameters, this command defaults to the RD Deployment specified using the Set-RdsContext cmdlet and returns all the role assignments made under the RD Deployment. The scope can further limited with the following parameters: *TenantName*, *HostPoolName*, and *AppGroupName*. If RD objects are specified for the scope, then the cmdlet returns all of the inherited role assignments by traversing up the tree of container objects and below by traversing the tree of contained objects. Note that it doesn’t traverse sideways.

Parameters: same as **New-RdsRoleAssignment**.

Return: list of role assignment objects as defined in **New-RdsRolesAssignment**.

Console Output: list of return objects with blank line in between each.

For example, a Windows Virtual Desktop Deployment (acmedeployment1) has two RD tenants (contosotenant1 and contosotenant2) and one RD host pool (hostpool1) under contosotenant1. The following users and roles are assigned:

* jane@acme.com is assigned to the Remote Desktop Services Owner role on root of acmedeployment1
* fred@acme.com is assigned to the Remote Desktop Services Contributor role on contosotenant1
* john@acme.com is assigned Remote Desktop Services Contributor on contosotenant2
* carmen@acme.com is assigned to the Remote Desktop Services Owner on hostpool1
* brigitta@acme.com is assigned Remote Desktop Services Read access to the contosotenant1 diagnostics
* AcmeScaling is a service principal assigned the Remote Desktop Services Contributor role on the root of acmedeployment1

Jane@acme.com runs the following cmdlet with the following results.

```PowerShell
Get-RdsRoleAssignment -TenantName “contosotenant1”
```

```PowerShell
DeploymentName: acmedeployment1
Infrastructure:
TenantName:
HostPoolName:
AppGroupName:
Diagnostics:
DisplayName: Jane Doe
SignInName: jane@acme.com
RDRoleDefinitionName: RDS Owner
ObjectId: f6e17d8a-2456-4e44-83f3-a6d0ddbe4928
ObjectType: User

DeploymentName: acmedeployment1
Infrastructure:
TenantName: contosotenant1
HostPoolName:
AppGroupName:
Diagnostics:
DisplayName: Fred Smith
SignInName: fred@acme.com
RDRoleDefinitionName: RDS Contributor
ObjectId: aeg17d8a-2456-4e44-83f3-a6d0ddbe5100
ObjectType: User


DeploymentName: acmedeployment1
Infrastructure:
TenantName: contosotenant1
HostPoolName: hostpool1
AppGroupName:
Diagnostics:
DisplayName: Carmen Sandiego
SignInName: carmen@acme.com
RDRoleDefinitionName: RDS Contributor
ObjectId: faq17d8a-2456-4e44-83f3-a6d0ddbe5458
ObjectType: User

DeploymentName: acmedeployment1
Infrastructure:
TenantName: contosotenant1
HostPoolName:
AppGroupName:
Diagnostics: T
DisplayName: Brigitta von Trapp
SignInName: brigitta@acme.com
RDRoleDefinitionName: RDS Reader
ObjectId: wtq17d8a-2456-4e44-83f3-a6d0ddbe5444
ObjectType: User


DeploymentName: acmedeployment1
Infrastructure:
TenantName:
HostPoolName:
AppGroupName:
Diagnostics:
DisplayName: AcmeScaling
SignInName:
RDRoleDefinitionName: RDS Contributor
ObjectId: hed17d8a-2456-4e44-83f3-a6d0ddbe9368
ObjectType: ServicePrincipal
```

Error Conditions: for more information, see Common error conditions in Tenant Environment Functional Spec v.8.

The following table lists an example error condition.

|Error condition|Text|
|---|---|
|No additional conditions| |

#### Remove-RdsRoleAssignment (TP2)

Modeled after [Remove-AzureRmRoleAssignment](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermroleassignment?view=azurermps-4.2.0) with the *SignInName* and *ServicePrincipalName* parameter sets.

The following examples show SignInName parameter sets.

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -SignInName <string>
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -AppGroupName <string> -HostPoolName <string> -SignInName <string> -TenantName <string>
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -HostPoolName <string> -SignInName <string> -TenantName <string>
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -Diagnostics -Infrastructure -SignInName <string>
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -Infrastructure -SignInName <string>
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -SignInName <string> -TenantName <string>
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -Diagnostics -SignInName <string> -TenantName <string>
```

The following examples show ServicePrincipalName parameter sets.

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -AppGroupName <string> -HostPoolName <string> -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -HostPoolName <string> -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> [-AadTenantId <string>] [-Diagnostics] [-Infrastructure] [-ServicePrincipalName <string>]
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -Infrastructure -ServicePrincipalName <string> [-AadTenantId <string>]
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -ServicePrincipalName <string> [-AadTenantId <string>]
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

```PowerShell
Remove-RdsRoleAssignment [-RoleDefinitionName] <string> -Diagnostics -ServicePrincipalName <string> -TenantName <string> [-AadTenantId <string>]
```

Use the **Remove-RdsRoleAssignment** cmdlet to revoke access to any principal at given scope and given role.

The object of the assignment, such the principal, must be specified. Use the *SignInName* parameter to identify a user or *ServicePrincipalName* to identify a ServicePrincipal.

The role that the principal is assigned to must be specified using the *RoleDefinitionName* parameter.

The scope of the assignment MAY be specified and if not specified, defaults to the RD Deployment scope. The scope of the assignment can be specified using one or more of the following parameters: *TenantName*, *HostPoolName*, and *AppGroupName*.

The parameters are the same as New-RdsRoleAssignment. Return should be either "success" or "failure." The console output will be blank or show an error.

For more information regarding error conditions, see [Common error conditions and messages (TP2)](#common-error-conditions-and-messages-(TP2)).

The following table lists an example error condition.

|Error condition|Text|
|---|---|
|The role assignment doesn’t exist.|The provided information does not map to a role assignment.|

#### Common error conditions and messages (TP2)

This section contains error conditions and messages that are common across many of the cmdlets.

The following table lists examples of error condition messages.

|Error condition|Text|
|---|---|
|Specified RD object instance does not exist in DB. For example,
TenantName, HostPoolName, AppGroupName. |The specified RDObjectclass does not exist. Use New-Rdsobjectclass. (For example, "The specified AppGroup does not exist. Use New-RdsAppGroup.")|
|Specified service principal does not exist.|The specified ServicePrincipalName does not exist.|
|Specified user principal does not exist.|The specified SignInName does not exist.|
|The specified RoleDefinition does not exist.|The specified RoleDefinitionName does not exist.|

#### PowerShell error handling

There is also a set of common error conditions handled by PowerShell that are not duplicated here. For example:

* Cmdlet not found.
* Parameter not found.
* Parameter not available in parameter set.
* Parameter set conflict, such as two or more parameters are supplied that indicate different parameter sets.
* Value type mismatch.

### Feature dependencies

The following table lists dependencies this design has on other features.

|Title|Description|
|---|---|
|Team name|Enter text here.|
|Contacts pm/dev/test|Enter text here.|
|Mitigation/feedback|Enter text here.|

The following table lists features that depend on this design.

|Title|Description|
|---|---|
|Description of deliverable|Enter text here.|
|Feature/partner team|Enter text here.|

The following table is a review checklist.

|Area| Status |Considerations to make before completion|
|---|---|---|
|Requirements| ☐ |Are the requirements clear? <br>Are the requirements complete? <br>Are the requirements verifiable? <br>Are the requirements associated with valid scenarios?|
|Completeness| ☐ |Have all terms been defined?<br> Does the design meet all requirements? <br>Have all key design decisions been addressed and documented?|
|Accessibility (tenet)| ☐ |Features and scenarios work for users with impairments and assistive technology users. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Accessibility/_layouts/15/start.aspx) to get started.|
|Global readiness (tenet)| ☐ |A combination of GeoPolitical, World Readiness, and Crypto Disclosure, activity centers on ensuring that content poses minimal or no legal or business risk in any market as well as consideration for cultural information, keyboards, reading direction, payment options and address layouts. Visit the [GeoPol tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Geopolitical/_layouts/15/start.aspx) and [World Readiness site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/WorldReadiness/_layouts/15/start.aspx) for more information.|
|Protocols (tenet)| ☐ |Networking protocols are documented according to Microsoft and regulatory requirements. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Protocols/_layouts/15/start.aspx) to get started.|
|Privacy and online safety (tenet)| ☐ |Protects customer data from misuse, and ensures services and features are safe and secure. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Privacy/_layouts/15/start.aspx) to get started.|
|Security (Tenet)| ☐ |Making Windows the most secure and privacy-protecting OS on the market. Visit the [tenet site](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Security/_layouts/15/start.aspx) to get started. Includes FIPS.|
|Manageability (Tenet)| ☐ |Windows features must provide a complete and consistent management experience to System Administrators and IT Professionals. This is particularly important for the Enterprise and Education segments. Visit the [tenet site](http://aka.ms/wdgmanage) to get started.|
|[Application compatibility](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Compatibility/_layouts/15/start.aspx#/)| ☐ |This will become increasingly important under the continuous upgrade model. Upgrades from Windows 7 should also be supported to ensure compatibility.|
|[Performance and power usage](https://microsoft.sharepoint.com/teams/osg_threshold/compliance/Performance/_layouts/15/start.aspx#/)| ☐ |We cannot regress in areas (changes that have impact on global system wide performance/battery life in particular).|
|Health| ☐ |Are data, storage, and battery requirements discussed?|
|Functional testing| ☐ |Test Design and Approach, including what will and will not be automated, and any gaps in test coverage? <br>Any RI gating criteria? <br>Key technology decisions related to testing this feature described, include key alternatives considered? <br>Test architecture overview provided, including a discussion of Test Hooks or designed for testability where appropriate?|
|Interfaces and interactions| ☐ |Public API added/changed? <br>Internal API added/changed? <br>Format and protocol added/changed?|
|Regulatory compliance requirements for N and KN SKUs: private API usage (media-specific)| ☐ |Microsoft has a long-standing regulatory obligation to ship special editions of Windows Client for PCs in the EU and Korea. These editions of Windows (aka N and KN SKUs) must meet the following requirements: <br>1. Windows Media Player and the underlying media technologies (Media Foundation) are removed. The removed binaries can't call undocumented APIs in the OS. In addition, Korean SKUs (or KN SKU) need an edition of Windows with all inbox messenger apps removed. <br>2. OS features and Inbox apps must work as they would on a regular SKU or gracefully degrade if they have a dependency on media stack. They are expected to work after restoration of the removed media components through the user-installed Media Feature Package. <br>3. Do not promote the removed inbox media apps within the OS/by other inbox apps. Also, any modifications to the way media app defaults are handled need to be reviewed and signed off on.  <br>To comply with regulatory requirements for Windows, any Windows binary included in the Media Feature Package customers install to restore the functionalities excluded on regulatory Windows Desktop editions are required to NOT call undocumented APIs from other OS components or other Microsoft High Volume Products. The set of OS binaries in this package include Media, WPD, and Windows Media Player. For more details, visit the [OneNote page](https://microsoft.sharepoint.com/teams/osg_core_sigma/media/_layouts/OneNote.aspx?id=%2fteams%2fosg_core_sigma%2fmedia%2fShared%20Documents%2fOneNotes%2fMedia%27s%20non-Wiki&wd=target%28Common%20to%20Media%20Platform%20and%20Media%20Core.one%7c9FBE1898-6CC4-4613-A285-0A967446AAC6%2fAPI%20Usage%20Guidance%7c16122299-C9DD-4C22-8EF4-FC3F2ACC3DD1%2f%29). <br>Answer the following questions: <br>1. Is your feature adding a new Windows binary that implements audio/video playback functionality? ☐ <br>If the answer to question #1 is yes, proceed to question #3.<br> 2. Is your feature implemented in any of the binaries in the Media Feature Package file list? ☐ <br>If answer to question #2 is no, you're done and may proceed to the next section. Otherwise, proceed to question #3. <br>3. If your answer to question #1 OR question #2 is yes, does your feature design require call to any undocumented API in Windows? ☐ <br>Your response to question #3 must be "no" to comply with regulatory requirements. Otherwise, your feature is in violation of the regulatory requirements outlined above. You are required to review your feature for appropriate compliance resolution by sending a message for ***nskusup*** alias.|
|Perished data format| ☐ |If you have persisted data, do you discuss: data format, where it is stored, versioning plan, roaming strategy, Security/PII, migration strategy, backup strategy?|
|Breaking changes| ☐ |Any breaking changes, and what is done to guarantee a smooth upgrade experience (apps still work, settings preserved, and so on)?|
|Tool impact| ☐ |Any impact to tools?|
|Deployment and update| ☐ |Do you consider how your feature gets installed and configured by OEMs, as well as any implications it might have for servicing? For example, if your feature introduces a breaking change, you might need to write a migration plugin to seamlessly handle the transition when updating an existing device to a newer build. <br>Updatability? <br>Restorability?|
|Telemetry, Supportability and flighting| ☐ |Telemetry (leverage Data team and think broader in terms of what we can do with telemetry (such as more end to end scenario delight)? <br>Logging? <br>Debugging Extensions? <br>Feedback Pool—SUIF, and so on?|
|Componentization| ☐ |Packaging Decisions? <br>Binaries and binary dependencies? <br>Layering and other build concerns? <br>Product Differentiation and SKU? <br>Product-specific/OneCore concerns? <br>Processor-specific concerns? <br>Build and KIT concerns? <br>Update OS and Manufacturing OS? <br>Source code layout and depots?

# Appendix

## References

Azure RBAC testing was done using a combination of Azure Portal and PowerShell, AzureRm-RBAC.ps1.

Excerpt:

```PowerShell
# If clarkn@microsoft.com signs in to Azure Portal (owner on REFARCH_002) and
# assigns clark_nicholson@hotmail.com reader access to 2 of many resource groups in
# ...REFARCH_002 (under MSFT subscription). In particular: c15xrg1 and c17xrg1
# Then launch PS and run
Login-AzureRmAccount
# and sign in as clark_nicholson@hotmail.com
# Then run the following:
Set-AzureRmContext -TenantId <Microsofttenantid>
Set-AzureRmContext -Subscrfiption "...REFARCH_002"
Get-AzureRmResourceGroup
# result is that clark_nicholson@hotmail.com only sees the two resource groups within the subscription
# that he has been assigned reader, i.e. c15xrg1 and c17xrg1.
# Not the many other RGs.
# if clark_nicholson@hotmail.com tries to access one of the other existing RGs,
Get-RdsAzureRmResourceGroup -Name "c16xrg1"
# Result: error msg that the RG doesn't exist
# Not that he doesn't have permissions to access it. (That would reveal that the RG exists.)
```