---
title: Use PowerShell to create a policy assignment to identify non-compliant resources in your Azure environment | Microsoft Docs 
description: Use PowerShell to create an Azure Policy assignment to identify non-compliant resources.
services: azure-policy 
keywords: 
author: Jim-Parker
ms.author: jimpark
ms.date: 10/06/2017
ms.topic: quickstart
ms.service: azure-policy
ms.custom: mvc
---

# Create a policy assignment to identify non-compliant resources in your Azure environment using PowerShell

The first step in understanding compliance in Azure is knowing where you stand with your current resources. This quickstart steps you through the process of creating a policy assignment to identify non-compliant resources with the policy definition – *Require SQL Server version 12.0*. At the end of this process, you have successfully identified what servers are of a different version, or non-compliant.

PowerShell is used to create and manage Azure resources from the command line or in scripts. This guide details using PowerShell to create a policy assignment to identify non-compliant resources in your Azure environment.

This guide requires the Azure PowerShell module version 4.0 or later. Run ```Get-Module -ListAvailable AzureRM``` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

Before you start, make sure that the latest version of PowerShell is installed. For detailed information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Opt in to Azure Policy

Azure Policy is now available in Limited Preview, so you need to register to request access.

1. Go to Azure Policy at https://aka.ms/getpolicy and select **Sign Up** in the left pane.

   ![Search for policy](media/assign-policy-definition/sign-up.png)

2. Opt in to Azure Policy by selecting the subscriptions in the **Subscription** list you would like to work with. Then select **Register**.

   ![Opt in to use Azure Policy](media/assign-policy-definition/preview-opt-in.png)

   It may take a couple of days for us to accept your registration request, based on demand. Once your request gets accepted, you will be notified via email that you can begin using the service.

## Create a policy assignment

In this quickstart, we create a policy assignment and assign the *Require SQL Server Version 12.0* definition. This policy definition will identify resources that do not comply with the conditions set in the policy definition.

Follow these steps to create a new policy assignment.

Run the following command to view all policy definitions and find the one you would like to assign:

```powershell
$definition = Get-AzureRmPolicyDefinition
```

Azure Policy comes with already built-in policy definitions you can use. You will see built-in policy definitions such as:

- Enforce tag and its value
- Apply tag and its value
- Require SQL Server Version 12.0

Next, assign the policy definition to the desired scope by using the `New-AzureRmPolicyAssignment` cmdlet.

For this tutorial, we are providing the following information for the command:
- Display **Name** for the policy assignment. In this case, let’s use Require SQL Server version 12.0 Assignment.
- **Policy** – This is the policy definition, based off which you’re using to create the assignment. In this case, it is the policy definition – *Require SQL Server version 12.0*
- A **scope** - A scope determines what resources or grouping of resources the policy assignment gets enforced on. It could range from a subscription to resource groups. In this example, we are assigning the policy definition to the **FabrikamOMS** resource group.
- **$definition** – You need to provide the resource ID of the policy definition – In this case, we’re using the ID for the policy definition - *Require SQL Server 12.0*.

```powershell
$rg = Get-AzureRmResourceGroup -Name "FabrikamOMS"
$definition = Get-AzureRmPolicyDefinition -Id /providers/Microsoft.Authorization/policyDefinitions/e5662a6-4747-49cd-b67b-bf8b01975c4c
New-AzureRMPolicyAssignment -Name Require SQL Server version 12.0 Assignment -Scope $rg.ResourceId -PolicyDefinition $definition
```

You’re now ready to identify non-compliant resources to understand the compliance state of your environment.

## Identify non-compliant resources

1. Navigate back to the Azure Policy landing page.
2. Select **Compliance** on the left pane, and search for the **Policy Assignment** you created.

   ![Policy compliance](media/assign-policy-definition/policy-compliance.png)

   If there are any existing resources that are not compliant with this new assignment, they will show up under the **Non-compliant resources** tab, as shown above.

## Clean up resources

Other guides in this collection build upon this quickstart. If you plan to continue to work with subsequent tutorials, do not clean up the resources created in this quickstart. If you do not plan to continue, delete the assignment you created by running this command:

```powershell
Remove-AzureRmPolicyAssignment -Name “Require SQL Server version 12.0 Assignment” -Scope /subscriptions/ bc75htn-a0fhsi-349b-56gh-4fghti-f84852/resourceGroups/FabrikamOMS
```

## Next steps

In this quick start, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about assigning policies, to ensure that **future** resources that get created are compliant, continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./create-manage-policy.md)