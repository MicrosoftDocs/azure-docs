---
title: Quickstart - Create a budget with Bicep
description: Quickstart showing how to create a budget with Bicep.
author: bandersmsft 
ms.author: banders 
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: quickstart
ms.date: 03/21/2024
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm, devx-track-azurecli, devx-track-bicep
---

# Quickstart: Create a budget with Bicep

Budgets in Cost Management help you plan for and drive organizational accountability. With budgets, you can account for the Azure services you consume or subscribe to during a specific period. They help you inform others about their spending to proactively manage costs and monitor how spending progresses over time. When the budget thresholds you've created are exceeded, notifications are triggered. None of your resources are affected and your consumption isn't stopped. You can use budgets to compare and track spending as you analyze costs. This quickstart shows you how to create a budget named 'MyBudget' using Bicep.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you have a new subscription, you can't immediately create a budget or use other Cost Management features. It might take up to 48 hours before you can use all Cost Management features.

Budgets are supported for the following types of Azure account types and scopes:

- Azure role-based access control (Azure RBAC) scopes
    - Management groups
    - Subscription
- Enterprise Agreement scopes
    - Billing account
    - Department
    - Enrollment account
- Individual agreements
    - Billing account
- Microsoft Customer Agreement scopes
    - Billing account
    - Billing profile
    - Invoice section
    - Customer
- AWS scopes
    - External account
    - External subscription

To view budgets, you need at least read access for your Azure account.

For Azure EA subscriptions, you must have read access to view budgets. To create and manage budgets, you must have contributor permission.

The following Azure permissions, or scopes, are supported per subscription for budgets by user and group. For more information about scopes, see [Understand and work with scopes](understand-work-scopes.md).

- Owner: Can create, modify, or delete budgets for a subscription.
- Contributor and Cost Management contributor: Can create, modify, or delete their own budgets. Can modify the budget amount for budgets created by others.
- Reader and Cost Management reader: Can view budgets that they have permission to.

For more information about assigning permission to Cost Management data, see [Assign access to Cost Management data](assign-access-acm-data.md).

## No filter

### Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/create-budget-simple).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.consumption/create-budget-simple/main.bicep" :::

One Azure resource is defined in the Bicep file:

- [Microsoft.Consumption/budgets](/azure/templates/microsoft.consumption/budgets): Create a budget.

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    myContactEmails ='("user1@contoso.com", "user2@contoso.com")'

    az deployment sub create --name demoSubDeployment --location centralus --template-file main.bicep --parameters startDate=<start-date> endDate=<end-date> contactEmails=$myContactEmails
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    $myContactEmails = @("user1@contoso.com", "user2@contoso.com")

    New-AzSubscriptionDeployment -Name demoSubDeployment -Location centralus -TemplateFile ./main.bicep -startDate "<start-date>" -endDate "<end-date>" -contactEmails $myContactEmails
    ```

    ---

    You need to enter the following parameters:

    - **startDate**: Replace **\<start-date\>** with the start date. It must be the first of the month in YYYY-MM-DD format. A future start date shouldn't be more than three months in the future. A past start date should be selected within the timegrain period.
    - **endDate**: Replace **\<end-date\>** with the end date in YYYY-MM-DD format. If not provided, it defaults to ten years from the start date.
    - **contactEmails**: First create a variable that holds your emails and then pass that variable. Replace the sample emails with the email addresses to send the budget notification to when the threshold is exceeded.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded.

## One filter

### Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/create-budget-onefilter).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.consumption/create-budget-onefilter/main.bicep" :::

One Azure resource is defined in the Bicep file:

- [Microsoft.Consumption/budgets](/azure/templates/microsoft.consumption/budgets): Create a budget.

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    myContactEmails ='("user1@contoso.com", "user2@contoso.com")'
    myRgFilterValues ='("resource-group-01", "resource-group-02")'

    az deployment sub create --name demoSubDeployment --location centralus --template-file main.bicep --parameters startDate=<start-date> endDate=<end-date> contactEmails=$myContactEmails resourceGroupFilterValues=$myRgFilterValues
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    $myContactEmails = @("user1@contoso.com", "user2@contoso.com")
    $myRgFilterValues = @("resource-group-01", "resource-group-02")

    New-AzSubscriptionDeployment -Name demoSubDeployment -Location centralus -TemplateFile ./main.bicep -startDate "<start-date>" -endDate "<end-date>" -contactEmails $myContactEmails -resourceGroupFilterValues $myRgFilterValues
    ```

    ---

    You need to enter the following parameters:

    - **startDate**: Replace **\<start-date\>** with the start date. It must be the first of the month in YYYY-MM-DD format. A future start date shouldn't be more than three months in the future. A past start date should be selected within the timegrain period.
    - **endDate**: Replace **\<end-date\>** with the end date in YYYY-MM-DD format. If not provided, it defaults to ten years from the start date.
    - **contactEmails**: First create a variable that holds your emails and then pass that variable. Replace the sample emails with the email addresses to send the budget notification to when the threshold is exceeded.
    - **resourceGroupFilterValues** First create a variable that holds your resource group filter values and then pass that variable. Replace the sample filter values with the set of values for your resource group filter.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded.

## Two or more filters

### Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/create-budget).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.consumption/create-budget/main.bicep" :::

One Azure resource is defined in the Bicep file:

- [Microsoft.Consumption/budgets](/azure/templates/microsoft.consumption/budgets): Create a budget.

### Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    myContactEmails ='("user1@contoso.com", "user2@contoso.com")'
    myContactGroups ='("/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/microsoft.insights/actionGroups/groupone", "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/microsoft.insights/actionGroups/grouptwo")'
    myRgFilterValues ='("resource-group-01", "resource-group-02")'
    myMeterCategoryFilterValues ='("meter-category-01", "meter-category-02")'

    az deployment sub create --name demoSubDeployment --location centralus --template-file main.bicep --parameters startDate=<start-date> endDate=<end-date> contactEmails=$myContactEmails contactGroups=$myContactGroups resourceGroupFilterValues=$myRgFilterValues meterCategoryFilterValues=$myMeterCategoryFilterValues
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    $myContactEmails = @("user1@contoso.com", "user2@contoso.com")
    $myContactGroups = @("/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/microsoft.insights/actionGroups/groupone", "/subscriptions/{sub-id}/resourceGroups/{rg-name}/providers/microsoft.insights/actionGroups/grouptwo")
    $myRgFilterValues = @("resource-group-01", "resource-group-02")
    $myMeterCategoryFilterValues = @("meter-category-01", "meter-category-02")


    New-AzSubscriptionDeployment -Name demoSubDeployment -Location centralus -TemplateFile ./main.bicep -startDate "<start-date>" -endDate "<end-date>" -contactEmails $myContactEmails -contactGroups $myContactGroups -resourceGroupFilterValues $myRgFilterValues -meterCategoryFilterValues $myMeterCategoryFilterValues
    ```

    ---

    You need to enter the following parameters:

    - **startDate**: Replace **\<start-date\>** with the start date. It must be the first of the month in YYYY-MM-DD format. A future start date shouldn't be more than three months in the future. A past start date should be selected within the timegrain period.
    - **endDate**: Replace **\<end-date\>** with the end date in YYYY-MM-DD format. If not provided, it defaults to ten years from the start date.
    - **contactEmails**: First create a variable that holds your emails and then pass that variable. Replace the sample emails with the email addresses to send the budget notification to when the threshold is exceeded.
    - **contactGroups**: First create a variable that holds your contact groups and then pass that variable. Replace the sample contact groups with the list of action groups to send the budget notification to when the threshold is exceeded. You must pass the resource ID of the action group, which you can get with [az monitor action-group show](/cli/azure/monitor/action-group#az-monitor-action-group-show) or [Get-AzActionGroup](/powershell/module/az.monitor/get-azactiongroup).
    - **resourceGroupFilterValues**: First create a variable that holds your resource group filter values and then pass that variable. Replace the sample filter values with the set of values for your resource group filter.
    - **meterCategoryFilterValues**: First create a variable that holds your meter category filter values and then pass that variable. Replace the sample filter values within parentheses with the set of values for your meter category filter.

    > [!NOTE]
    > When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az consumption budget list
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzConsumptionBudget
```

---

## Clean up resources

When you no longer need the budget, use the Azure portal, Azure CLI, or Azure PowerShell to delete it:

# [CLI](#tab/CLI)

```azurecli-interactive
az consumption budget delete --budget-name MyBudget
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzConsumptionBudget -Name MyBudget
```

---

## Next steps

In this quickstart, you created a budget and deployed it using Bicep. To learn more about Cost Management and Billing and Bicep, continue on to the articles below.

- Read the [Cost Management and Billing](../cost-management-billing-overview.md) overview.
- [Create budgets](tutorial-acm-create-budgets.md) in the Azure portal.
- Learn more about [Bicep](../../azure-resource-manager/bicep/overview.md).
