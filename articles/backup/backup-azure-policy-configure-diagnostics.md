---
title: Configure Vault Diagnostics Settings at scale
description: Configure Log Analytics Diagnostics Settings for all vaults in a given scope using Azure Policy
ms.topic: conceptual
ms.date: 01/24/2020
---
# Configure Vault Diagnostics Settings at scale

The reporting solution provided by Azure Backup leverages Log Analytics (LA). For the data of any given vault to be sent to LA, a diagnostics setting needs to be created for that vault, with an LA Workspace as the destination and the 6 Azure Backup diagnostic events selected (in Resource Specific Mode).

Often, adding a diagnostics setting manually per vault can be a cumbersome task. In addition, any new vault created also needs to have diagnostics settings enabled in order to be able to view reports for this vault. 

To simplify the creation of diagnostics settings at scale (with LA as the destination), Azure Backup provides a built-in Azure Policy. This policy adds an LA diagnostics setting to all vaults in a given subscription or resource group. The following sections provide instructions on how to use this policy.

## Supported Scenarios 

* The policy can be applied at a time to all Recovery Services vaults in a particular subscription (or  a resource group within the subscription). The user assigning the policy needs to have 'Owner' access to the subscription to which the policy is assigned.

* The LA Workspace as specified by the user (to which diagnostics data will be sent to) can be in a different subscription from the vaults to which the policy is assigned. The user needs to have 'Contributor' or 'Owner' access to the subscription in which the specified LA Workspace exists.

* Management Group scope is currently unsupported.

* The built-in policy is currently not available in national clouds.

## Assigning the built-in policy to a scope

To assign the policy for vaults in the required scope, please follow the below steps:

1. Sign in to the Azure Portal and navigate to the **Policy** Dashboard.
2. Select **Definitions** in the left menu to get a list of all built-in policies across Azure Resources.
3. Filter the list for **Category=Monitoring**. Locate the policy named '...'.
(insert screenshot of policy defn list)
4. Click on the name of the policy. You will be redirected to the detailed definition for this policy.
(insert screenshot of policy defn blade)
5. Click on the **Assign** button at the top of the blade. This redirects you to the **Assign Policy** blade.
6. Under **Basics**, click on the three dots next to the **Scope** field. This opens up a right context blade where you can select the subscription for the policy to be applied on. You can also optionally select a resource group, so that the policy is applied only for vaults in a particular resource group.
(insert policy assignments basics blade)
7. (insert parameters description)

## Creating a remediation task
    
## Under what conditions will the remediation task apply to a vault?

## Next Steps
