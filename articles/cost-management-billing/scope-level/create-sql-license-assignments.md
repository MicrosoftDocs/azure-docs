---
title: Create SQL Server license assignments for Azure Hybrid Benefit
description: This article explains how to create SQL Server license assignments for Azure Hybrid Benefit.
author: bandersmsft
ms.author: banders
ms.date: 12/03/2021
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisri
---

# Create SQL Server license assignments for Azure Hybrid Benefit

The new centralized Azure Hybrid Benefit experience in the Azure portal supports SQL Server license assignments at the account level or at a particular subscription level. When the assignment is created at the account level, Azure Hybrid Benefit discounts are automatically applied to SQL resources in all subscriptions in the account up to the license count specified in the assignment.

For each license assignment, a scope is selected and then licenses are assigned to the scope. Each scope can have multiple license entries.

## Prerequisites

The following prerequisites must be met to create SQL Server license assignments.

- Your organization has a supported agreement type and supported offer.
- You're a member of a role that has permissions to assign SQL licenses.
- Your organization has SQL Server core licenses with Software Assurance or core subscription licenses available to assign to Azure.
- Your organization is enrolled to automatic registration of the Azure SQL VMs with the IaaS extension. To learn more, see [Automatic registration with SQL IaaS Agent extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-automatic-registration-all-vms).
  > [!IMPORTANT]
  > Failure to meet this prerequisite will cause Azure to produce incomplete data about your current Azure Hybrid Benefit usage. This situation could lead to incorrect license assignments and might result in unnecessary pay-as-you-go charges for SQL Server licenses.

The prerequisite roles differ depending on the agreement type.

| Agreement type | Required role | Supported offers |
| --- | --- | --- |
| Enterprise Agreement | _Enterprise Administrator_<p> If you are an Enterprise admin with read-only access, you’ll need your organization to give you **full** access to assign licenses using centrally managed Azure Hybrid Benefit. <p>If you're not an Enterprise admin, you must be assigned that role by your organization (with full access). For more information about how to become a member of the role, see [Add another enterprise administrator](../manage/ea-portal-administration.md#create-another-enterprise-administrator). | - MS-AZR-0017P (Microsoft Azure Enterprise)<br>- MS-AZR-USGOV-0017P (Azure Government Enterprise) |
| Microsoft Customer Agreement | *Billing account owner*<br> *Billing account contributor* <br> *Billing profile owner*<br> *Billing profile contributor*<br> If you don't have one of the roles above, your organization must assign one to you. For more information about how to become a member of the roles, see [Manage billing roles](../manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal). | MS-AZR-0017G (Microsoft Azure Plan)|
| WebDirect / Pay-as-you-go | Not available | None |
| CSP / Partner led customers | Not available | None |


> [!NOTE]
> Centrally assigning licenses to scopes isn't available for Sponsored, MSDN Credit subscriptions or Microsoft Cloud Partner Program subscriptions. SQL software usage is free for Dev/Test subscriptions (MS-AZR-0148P or MS-AZR-0023P offer types).

## Create a SQL license assignment

In the following procedure, you navigate from **Cost Management + Billing** to **Reservations + Hybrid Benefit**. Don't navigate to **Reservations** from the Azure home page. By doing so you won't have the necessary scope to view the license assignment experience. 

1. Sign in to the Azure portal and navigate to **Cost Management + Billing**.  
    :::image type="content" source="./media/create-sql-license-assignments/select-cost-management.png" alt-text="Screenshot showing Azure portal navigation to Cost Management + Billing." lightbox="./media/create-sql-license-assignments/select-cost-management.png" :::
1. Use one of the following two steps, depending on your agreement type:
    - If you have an Enterprise Agreement, select a billing scope.  
        :::image type="content" source="./media/create-sql-license-assignments/select-billing-scope.png" alt-text="Screenshot showing EA billing scope selection." lightbox="./media/create-sql-license-assignments/select-billing-scope.png" :::
    - If you have a Microsoft Customer Agreement, select a billing profile.  
        :::image type="content" source="./media/create-sql-license-assignments/select-billing-profile.png" alt-text="Screenshot showing billing profile selection." lightbox="./media/create-sql-license-assignments/select-billing-profile.png" :::
1. In the left menu, select **Reservations + Hybrid Benefit**.  
    :::image type="content" source="./media/create-sql-license-assignments/select-reservations.png" alt-text="Screenshot showing Reservations + Hybrid Benefit selection."  :::
1. Select **Add**  and then in the list, select **Azure Hybrid Benefit (Preview)**.  
    :::image type="content" source="./media/create-sql-license-assignments/select-azure-hybrid-benefit.png" alt-text="Screenshot showing Azure Hybrid Benefit selection." lightbox="./media/create-sql-license-assignments/select-azure-hybrid-benefit.png" :::
1. On the next screen, select **Begin to assign licenses**.  
    :::image type="content" source="./media/create-sql-license-assignments/get-started-centralized.png" alt-text="Screenshot showing Add SQL hybrid benefit selection" lightbox="./media/create-sql-license-assignments/get-started-centralized.png" :::  
    If you don't see the page and instead see the message `You are not the Billing Admin on the selected billing scope` then you don't have the required permission to assign a license. If so, you need to get the required permission. For more information, see [Prerequisites](#prerequisites).
1. Choose a scope and then enter the license count to use for each SQL Server edition. If you don't have any licenses to assign for a specific edition, enter zero.  
    > [!NOTE]
    > You are accountable to determine that the entries that you make in the scope-level managed license experience are accurate and will satisfy your licensing obligations. The license usage information is shown to assist you as you make your license assignments. However, the information shown could be incomplete or inaccurate due to various factors.
    >
    > If the number of licenses that you enter is less than what you are currently using, you'll see a warning message stating _You've entered fewer licenses than you're currently using for Azure Hybrid Benefit in this scope. Your bill for this scope will increase._  
    
    :::image type="content" source="./media/create-sql-license-assignments/select-assignment-scope-edition.png" alt-text="Screenshot showing scope selection and number of licenses." lightbox="./media/create-sql-license-assignments/select-assignment-scope-edition.png" :::
1. Optionally, select the **Usage details** tab to view your current Azure Hybrid Benefit usage enabled at the resource scope.  
    :::image type="content" source="./media/create-sql-license-assignments/select-assignment-scope-edition-usage.png" alt-text="Screenshot showing Usage tab details." lightbox="./media/create-sql-license-assignments/select-assignment-scope-edition-usage.png" :::
1. Select **Add**.
1. Optionally, change the default license assignment name. The review date is automatically set to a year ahead and can't be changed. Its purpose is to remind you to periodically review your license assignments.  
    :::image type="content" source="./media/create-sql-license-assignments/license-assignment-commit.png" alt-text="Screenshot showing default license assignment name." lightbox="./media/create-sql-license-assignments/license-assignment-commit.png" :::
1. After you review your choices, select **Next: Review + apply**.
1. Select the **By selecting &quot;Apply&quot;** attestation option to confirm that you have authority to apply Azure Hybrid Benefit, enough SQL Server licenses, and that you'll maintain the licenses as long as they're assigned.  
    :::image type="content" source="./media/create-sql-license-assignments/confirm-apply-attestation.png" alt-text="Screenshot showing the attestation option." lightbox="./media/create-sql-license-assignments/confirm-apply-attestation.png" :::
1. Select **Apply** and then select **Yes.**
1. The list of assigned licenses is shown.  
    :::image type="content" source="./media/create-sql-license-assignments/assigned-licenses.png" alt-text="Screenshot showing the list of assigned licenses." lightbox="./media/create-sql-license-assignments/assigned-licenses.png" ::: 

## Track assigned license use

Navigate to **Cost Management + Billing** and then select **Reservations + Hybrid Benefit**.

A list of all reservations and license assignments is shown. If you want to filter the results to only license assignments, set a filter for **SQL hybrid benefit**.

:::image type="content" source="./media/create-sql-license-assignments/view-the-assignments.png" alt-text="Screenshot showing the list of reservations and licenses." lightbox="./media/create-sql-license-assignments/view-the-assignments.png" :::

Under **Last Day Utilization** or **7-day Utilization**, select a percentage, which might be blank or zero, to view the assignment usage history in detail.

:::image type="content" source="./media/create-sql-license-assignments/assignment-utilization-view.png" alt-text="Screenshot showing assignment usage details." lightbox="./media/create-sql-license-assignments/assignment-utilization-view.png" :::

If a license assignment's usage is 100%, then it's likely some resources within the scope are incurring pay-as-you-go charges for SQL Server. We recommend that you use the license assignment experience again to review how much usage is being covered or not by assigned licenses. Afterward, go through the same process as before, including consulting your procurement or software asset management department, confirming that more licenses are available, and assigning the licenses.

## Changes after license assignment

After you create SQL license assignments, your experience with Azure Hybrid Benefit changes in the Azure portal.

- Any existing Azure Hybrid Benefit elections configured for individual SQL resources no longer apply. They're replaced by the SQL license assignment created at the subscription or account level.
- The hybrid benefit option isn't shown as in your SQL resource configuration.
- Applications or scripts that configure the hybrid benefit programmatically continue to work, but the setting doesn't have any effect.
- SQL software discounts are applied to the SQL resources in the scope. The scope is based on the number of licenses in the license assignments that are created for the subscription for the account where the resource was created.
- A specific resource configured for hybrid benefit might not get the discount if other resources consume all of the licenses. However, the maximum discount is applied to the scope, based on number of license counts. For more information about how the discounts are applied, see [What is centrally managed Azure Hybrid Benefit?](overview-azure-hybrid-benefit-scope.md).

## Cancel a license assignment

Review your license situation before you cancel your license assignments. When you cancel a license assignment, you no longer receive discounts for them. Consequently, your Azure bill might increase. If you cancel the last remaining license assignment, Azure Hybrid Benefit management reverts to the individual resource level.

### To cancel a license assignment

1. In the list of reservations and license assignments, select a license assignment.
1. On the license assignment details page, select **Cancel**.  
    :::image type="content" source="./media/create-sql-license-assignments/cancel-assignment-symbol.png" alt-text="Screenshot showing the Cancel option." :::
1. On the Cancel page, review the notification and then select **Yes, cancel**.  
    :::image type="content" source="./media/create-sql-license-assignments/cancel-assignment.png" alt-text="Screenshot showing the Cancel page." lightbox="./media/create-sql-license-assignments/cancel-assignment.png" :::

## Next steps

- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).
- Learn about how discounts are applied at [What is centrally managed Azure Hybrid Benefit?](overview-azure-hybrid-benefit-scope.md).