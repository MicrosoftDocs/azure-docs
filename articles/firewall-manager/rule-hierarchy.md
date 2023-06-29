---
title: Use Azure Firewall policy to define a rule hierarchy
description: Learn how to use Azure Firewall policy to define a rule hierarchy and enforce compliance.
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: how-to
ms.date: 11/17/2022
ms.author: victorh
ms.custom: FY23 content-maintenance
---

# Use Azure Firewall policy to define a rule hierarchy

Security administrators need to manage firewalls and ensure compliance across on-premises and cloud deployments. A key component is the ability to provide application teams with flexibility to implement CI/CD pipelines to create firewall rules in an automated way.

Azure Firewall policy allows you to define a rule hierarchy and enforce compliance:

- Provides a hierarchical structure to overlay a central base policy on top of a child application team policy. The base policy has a higher priority and runs before the child policy.
- Use an Azure custom role definition to prevent inadvertent base policy removal and provide selective access to rule collection groups within a subscription or resource group.

## Solution overview

The high-level steps for this example are:

1. Create a base firewall policy in the security team resource group.
3. Define IT security-specific rules in the base policy. This adds a common set of rules to allow/deny traffic.
4. Create application team policies that inherit the base policy.
5. Define application team-specific rules in the policy. You can also migrate rules from pre-existing firewalls.
6. Create Azure Active Directory custom roles to provide fine grained access to rule collection group and add roles at a Firewall Policy scope. In the following example, Sales team members can edit rule collection groups for the Sales teams Firewall Policy. The same applies to the Database and Engineering teams.
7. Associate the policy to the corresponding firewall. An Azure firewall can have only one assigned policy. This requires each application team to have their own firewall.



:::image type="content" source="media/rule-hierarchy/contoso-teams.png" alt-text="Teams and requirements" border="false":::

### Create the firewall policies

- A base firewall policy.

Create policies for each of the application teams:

- A Sales firewall policy. The Sales firewall policy inherits the base firewall policy.
- A Database firewall policy. The Database firewall policy inherits base firewall policy.
- An Engineering firewall policy. The Engineering firewall policy also inherits the base firewall policy.

:::image type="content" source="media/rule-hierarchy/policy-hierarchy.png" alt-text="Policy hierarchy" border="false":::

### Create custom roles to access the rule collection groups

Custom roles are defined for each application team. The role defines operations and scope. The application teams are allowed to edit rule collection groups for their respective applications.

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
6. In **AssignableScopes**, add your subscription ID with the following format: 

   `/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxx`

   You must add explicit subscription IDs, otherwise you won't be allowed to import the role into your subscription.
7. Delete the **Id** property line and change the **IsCustom** property to true.
8. Change the **Name** and **Description** properties to *AZFM Rule Collection Group Author* and *Users in this role can edit Firewall Policy rule collection groups*

Your JSON file should look similar to the following example:

```
{

    "Name":  "AZFM Rule Collection Group Author",
    "IsCustom":  true,
    "Description":  "Users in this role can edit Firewall Policy rule collection groups",
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
                             "/subscriptions/xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxxx"]
}
```
9. To create the new custom role, use the New-AzRoleDefinition command and specify the JSON role definition file.

   `New-AzRoleDefinition -InputFile "C:\CustomRoles\RuleCollectionGroupRole.json`

### List custom roles

To list all the custom roles, you can use the Get-AzRoleDefinition command:

   `Get-AzRoleDefinition | ? {$_.IsCustom -eq $true} | FT Name, IsCustom`

You can also see the custom roles in the Azure portal. Go to your subscription, select **Access control (IAM)**, **Roles**.

:::image type="content" source="media/rule-hierarchy/sales-app-policy.png" alt-text="SalesAppPolicy":::

:::image type="content" source="media/rule-hierarchy/sales-app-policy-read.png" alt-text="SalesAppPolicy read permission":::

For more information, see [Tutorial: Create an Azure custom role using Azure PowerShell](../role-based-access-control/tutorial-custom-role-powershell.md).

### Add users to the custom role

On the portal, you can add users to the AZFM Rule Collection Group Authors role and provide access to the firewall policies.

1. From the portal, select the Application team firewall policy (for example, SalesAppPolicy).
2. Select **Access Control**.
3. Select **Add role assignment**.
4. Add users/user groups (for example, the Sales team) to the role.

Repeat this procedure for the other firewall policies.

### Summary

Firewall Policy with custom roles now provides selective access to firewall policy rule collection groups.

Users don’t have permissions to:
- Delete the Azure Firewall or firewall policy.
- Update firewall policy hierarchy or DNS settings or threat intelligence.
- Update firewall policy where they are not members of AZFM Rule Collection Group Author group.

Security administrators can use base policy to enforce guardrails and block certain types of traffic (for example  ICMP) as required by their enterprise.

## Next steps

- [Learn more about Azure Firewall policy](policy-overview.md)
- [Learn more about Azure network security](../networking/security/index.yml)