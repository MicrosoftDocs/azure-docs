---
title: Use Azure Firewall policy to define a rule hierarchy
description: Learn how to use Azure Firewall policy to define a rule hierarchy and enforce compliance. 
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 08/24/2020
ms.author: victorh
---

# Use Azure Firewall policy to define a rule hierarchy

Security administrators need to manage firewalls and ensure compliance across on-premise and cloud deployments. A key component is the ability to provide application teams with flexibility to implement CI/CD pipelines to create firewall rules in an automated way.

Azure Firewall policy allows you to define a rule hierarchy and enforce compliance:

- Provides a hierarchical structure to overlay a central base policy on top of a child application team policy. The base policy has a higher priority and runs before the child policy.
- Use a custom role-based access control (RBAC) definition to prevent inadvertent base policy removal and provide selective access to rule collection groups within a subscription or resource group. 

## Solution overview

For this example, resource groups are used to enforce access scope. Subscriptions are another way to scope access. Each application team has their own independent set of resources, including firewalls.

The high-level steps for this example are:

1. Create separate resource groups for each application team.
2. Create a base firewall policy in the security team resource group. 
3. Define IT security-specific rules in the base policy. This adds a common set of rules to allow/deny traffic.
4. Create application team policies that inherit the base policy. 
5. Define application team-specific rules in the policy. You can also migrate rules from pre-existing firewalls.
6. Create Azure Active Directory custom roles to provide fine grained access to rule collection group within a resource group.
7. Associate the policy to the firewall. An Azure firewall can have only one assigned policy. This requires each application team to have their own firewall.

## Contoso example

Contoso is a fictional company that wants to create a rule hierarchy for their application teams and control who can manage the firewall rules for each team.

Contoso has the following teams and requirements:

:::image type="content" source="media/rule-hierarchy/contoso-teams.png" alt-text="Contoso teams and requirements" border="false":::

Contoso will use the following steps to achieve this.

### Create the resource groups

A resource group for each team is created: SecurityResourceGroup, SalesResourceGroup, DatabaseResourceGroup,  and EngineeringResourceGroup.

### Create the firewall policies

The applications teams are separated using resource groups, so firewall policies are created in each resource group:

- A base firewall policy in the SecurityResourceGroup.
- A Sales firewall policy in the  SalesResourceGroup. The Sales firewall policy inherits the base firewall policy.
- A Database firewall policy in the DatabaseResourceGroup. The Database firewall policy inherits base firewall policy.
- An Engineering firewall policy in the EngineeringResourceGroup. The Engineering firewall policy also inherits the base firewall policy.

:::image type="content" source="media/rule-hierarchy/policy-hierarchy.png" alt-text="Contoso policy hierarchy" border="false":::

### Define custom roles

Custom roles are defined for each application team. The role defines operations and scope. At Contoso, the application teams are allowed to edit rule collection groups for their respective applications.

Use the following high-level procedure to define custom roles:

1. Get the subscription:

   `Select-AzSubscription -SubscriptionId xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxx`
2. Run the following command:

   `Get-AzProviderOperation "Microsoft.Support/*" | FT Operation, Description -AutoSize`
3. Use the Get-AzRoleDefinition command to output the Reader role in JSON format. 

   `Get-AzRoleDefinition -Name "Reader" | ConvertTo-Json | Out-File C:\CustomRoles\ReaderSupportRole.json`
4. Open the ReaderSupportRole.json file in an editor.

   The following shows the JSON output. For information about the different properties, see [Azure custom roles](../role-based-access-control/custom-roles.md).

```json
   { 
     "Name": "Reader", 
     "Id": "acdd72a7-3385-48ef-bd42-f606fba81ae7", 
     "IsCustom": false, 
     "Description": "Lets you view everything, but not make any changes.", 
     "Actions": [ 
      "*/read" 
     ], 
     "NotActions": [], 
     "DataActions": [], 
     "NotDataActions": [], 
     "AssignableScopes": [ 
       "/" 
     ] 
   } 
```
5. Edit the JSON file to add the 

   `*/read", "Microsoft.Network/*/read", "Microsoft.Network/firewallPolicies/ruleCollectionGroups/write` 

   operation to the **Actions** property. Be sure to include a comma after the read operation. This action allows the user to create and update rule collection groups.
6. In **AssignableScopes**, add your subscription ID and resource groups with the following format: 

   `/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxx/resourceGroups/SalesResourceGroup`

   You must add explicit subscription IDs, otherwise you won't be allowed to import the role into your subscription.
7. Delete the **Id** property line and change the **IsCustom** property to true.
8. Change the **Name** and **Description** properties to *<Application team name> Rule Collection Group contributor* and *Lets you edit rule groups*

Your JSON file should look similar to the following example:

```
{ 

    "Name":  "<Application team name> Rule Collection Group contributor", 
    "IsCustom":  true, 
    "Description":  "Lets you edit rule groups", 
    "Actions":  [ 
                    "*/read", 
                    "Microsoft.Network/*/read", 
                     "Microsoft.Network/firewallPolicies/ruleCollectionGroups/write" 
                ], 
    "NotActions":  [ 
                   ], 
    "DataActions":  [ 
                    ], 
    "NotDataActions":  [ 
                       ], 
    "AssignableScopes":  [ 
                             "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxx/resourceGroups/SalesResourceGroup"] 
} 
```
9. To create the new custom role, use the New-AzRoleDefinition command and specify the JSON role definition file. 

   `New-AzRoleDefinition -InputFile "C:\CustomRoles\RuleCollectionGroupRole.json`

Repeat the steps to create custom roles for all three application teams. Make sure to scope the resource group properly. 

### List custom roles

To list all the custom roles, you can use the Get-AzRoleDefinition command:

   `Get-AzRoleDefinition | ? {$_.IsCustom -eq $true} | FT Name, IsCustom`

You can also see the custom roles in the Azure portal. Go to your subscription, select **Access control (IAM)**, **Roles**.

For more information, see [Tutorial: Create an Azure custom role using Azure PowerShell](../role-based-access-control/tutorial-custom-role-powershell.md).

### Add users to the custom role

On the portal in your subscription **Access control (IAM)**, **Roles**, you can add role assignments.

1. Add Sales Team members to the Sales Rule Collection Group contributor role.
2. Add Database team members to the Database Rule Collection Group contributor role.
3. Add Engineering team members to the Engineering Rule Collection Group contributor role.

### Associate new policies with the firewall

If you have an existing Azure firewall deployment in a VNet, you can attach the newly created Firewall policy using the VNET conversion flow in Firewall Manager. This doesn't cause any downtime for the Azure Firewall.  

If you have a pre-existing VNet, you can use the create hub virtual VNet workflow to deploy a new Azure Firewall and associate the newly created firewall policy to the firewall.  

The same approach can be used for Virtual WAN hubs.

### Summary

Contoso now provides selective access to their application teams.  In this example, the application teams don't have permissions to:
- Delete the Azure Firewall or firewall policy.
- Modify firewall policy hierarchy or DNS settings or threat intelligence.
- Modify firewall policy defined in other resource groups.

Developers have permission to update rule collection groups for their applications and integrate automatic updates using the CI/CD pipeline.

## Next steps

Learn more about [Azure Firewall policy](policy-overview.md).

