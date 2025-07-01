---
title: Assign Enterprise Agreement roles to service principals
description: This article helps you assign EA roles to service principals by using PowerShell and REST APIs.
author: prashantsaini4
ms.reviewer: prsaini
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: how-to
ms.date: 06/25/2025
ms.author: prsaini
---

# Assign Enterprise Agreement roles to service principals

You can manage your Enterprise Agreement (EA) enrollment in the [Azure portal](https://portal.azure.com/). You can create different roles to manage your organization, view costs, and create subscriptions. This article helps you automate some of those tasks by using Azure PowerShell and REST APIs with Microsoft Entra ID service principals.

> [!NOTE]
> If you have multiple EA billing accounts in your organization, you must grant the EA roles to Microsoft Entra ID service principals individually in each EA billing account.

Before you begin, ensure that you're familiar with the following articles:

- [Enterprise agreement roles](understand-ea-roles.md)
- [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps)

You need a way to call REST APIs. Some popular ways to query the API are:

- [Visual Studio](/aspnet/core/test/http-files)
- [Insomnia](https://insomnia.rest/)
- [Bruno](https://www.usebruno.com/)
- PowerShell’s [Invoke-RestMethod](https://powershellcookbook.com/recipe/Vlhv/interact-with-rest-based-web-apis)
- [Curl](https://curl.se/docs/httpscripting.html)

## Create and authenticate your service principal

To automate EA actions by using a service principal, you need to create a Microsoft Entra app identity, which can then authenticate in an automated manner.

Follow the steps in these articles to create and authenticate using your service principal.

- [Create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal)
- [Get tenant and app ID values for signing in](../../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application)

Here's an example of the application registration page.

:::image type="content" source="./media/assign-roles-azure-service-principals/register-an-application.png" alt-text="Screenshot showing Register an application." lightbox="./media/assign-roles-azure-service-principals/register-an-application.png" :::

### Find your service principal and tenant IDs

You need the service principal's object ID and the tenant ID. You need this information for permission assignment operations later in this article. All applications are registered in Microsoft Entra ID in the tenant. Two types of objects get created when the app registration is completed:

- Application object - The application ID is what you see under Enterprise Applications. *Don't* use the ID to grant any EA roles.
- Service Principal object - The Service Principal object is what you see in the Enterprise Registration window in Microsoft Entra ID. The object ID is used to grant EA roles to the service principal.

1. Open Microsoft Entra ID, and then select **Enterprise applications**.
1. Find your app in the list.

   :::image type="content" source="./media/assign-roles-azure-service-principals/enterprise-application.png" alt-text="Screenshot showing an example enterprise application." lightbox="./media/assign-roles-azure-service-principals/enterprise-application.png" :::

1. Select the app to find the application ID and object ID:

   :::image type="content" source="./media/assign-roles-azure-service-principals/application-id-object-id.png" alt-text="Screenshot showing an application ID and object ID for an enterprise application." lightbox="./media/assign-roles-azure-service-principals/application-id-object-id.png" :::

1. Go to the Microsoft Entra ID **Overview** page to find the tenant ID.

   :::image type="content" source="./media/assign-roles-azure-service-principals/tenant-id.png" alt-text="Screenshot showing the tenant ID." lightbox="./media/assign-roles-azure-service-principals/tenant-id.png" :::

> [!NOTE]
> The value of your Microsoft Entra tenant ID looks like a GUID with the following format: `aaaabbbb-0000-cccc-1111-dddd2222eeee`.

## Permissions that can be assigned to the service principal

Later in this article, you give permission to the Microsoft Entra app to act by using an EA role. You can assign only the following roles to the service principal, and you need the role definition ID, exactly as shown.

| Role | Actions allowed | Role definition ID |
| --- | --- | --- |
| EnrollmentReader | View data at the enrollment, department, and account scopes. The data contains charges for all of the subscriptions under the scopes, including across tenants. Can view the Azure Prepayment (previously called monetary commitment) balance associated with the enrollment. | 24f8edb6-1668-4659-b5e2-40bb5f3a7d7e |
| EA purchaser | Purchase reservation orders and view reservation transactions. It has all the permissions of EnrollmentReader, which have all the permissions of DepartmentReader. It can view usage and charges across all accounts and subscriptions. Can view the Azure Prepayment (previously called monetary commitment) balance associated with the enrollment. | da6647fb-7651-49ee-be91-c43c4877f0c4 |
| DepartmentReader | Download the usage details for the department they administer. Can view the usage and charges associated with their department. | db609904-a47f-4794-9be8-9bd86fbffd8a |
| SubscriptionCreator | Create new subscriptions in the given scope of Account. | a0bcee42-bf30-4d1b-926a-48d21664ef71 |
| Partner Admin Reader | View data for all enrollments under the partner organization. This role is only available for the following APIs:<br>- [Balances](/rest/api/consumption/balances/get-by-billing-account)<br>- [Exports V2 (api-version 2025-03-01 only)](/rest/api/cost-management/exports)<br>- [Generate Cost Details Report](/rest/api/cost-management/generate-cost-details-report)<br>- [Marketplaces](/rest/api/consumption/marketplaces/list)<br>- [Consumption Price sheet](/rest/api/consumption/price-sheet)<br>- [Cost Management Price sheet Download](/rest/api/cost-management/price-sheet/download-by-billing-account)<br>- [Generate Reservation Details Report](/rest/api/cost-management/generate-reservation-details-report/by-billing-account-id)<br>- [Reservation Summaries](/rest/api/consumption/reservations-summaries)<br>- [Reservation Recommendations](/rest/api/consumption/reservation-recommendations/list)<br>- [Reservation Transactions](/rest/api/consumption/reservation-transactions) | 4f6144c0-a809-4c55-b3c8-7f9b7b15a1bf |

The following user roles are required to assign each service principal role:
  - **EnrollmentReader:** user assigning must have _enrollment writer_ role.
  - **DepartmentReader:** user assigning must have _enrollment writer_ or _department writer_ role.
  - **SubscriptionCreator:** user assigning must be the _enrollment account owner_ (EA administrator).
  - **EA purchaser:** user assigning must have _enrollment writer_ role.
  - **Partner Admin Reader:** user assigning must have _partner administrator_ role.

All of these roles are created by programmatic means, aren't shown in the Azure portal, and are only for programmatic use.

When you grant an EA role to a service principal, you must use the `billingRoleAssignmentName` required property. The parameter is a unique GUID that you must provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command. You can also use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

A service principal can have only one role.

## Assign a role to the service principal

Follow these steps to assign any of the supported roles to a service principal:

1. Use the appropriate **Role Assignments Put REST API** and select **Try it**. Find the correct API to use in the table below.
 :::image type="content" source="./media/assign-roles-azure-service-principals/put-try-it.png" alt-text="Screenshot showing the Try It option in the Put article." lightbox="./media/assign-roles-azure-service-principals/put-try-it.png" :::
2. Sign in to the tenant with the required access.
3. Provide the following parameters in your API request:
   - `billingAccountName`: The **Billing account ID**. For the Partner Admin Reader role, use the format `pcn.{PCN}` (where `{PCN}` is your Partner Customer Number). For all other roles, use the standard billing account ID from the Azure portal.
  
   :::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

   - `billingRoleAssignmentName`: A unique GUID you generate (see [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid)).
   - `api-version`: Use `2019-10-01-preview` unless otherwise noted.
   - Request body parameters:
     - `properties.principalId`: The Object ID of the service principal.
     - `properties.principalTenantId`: The tenant ID.
     - `properties.roleDefinitionId`: Use the value from the table below.

| Role                  | Required user role to assign | Role definition ID                          | API Reference                                                                 | Notes                                                                 |
|-----------------------|-----------------------------|---------------------------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| EnrollmentReader      | Enrollment writer           | 24f8edb6-1668-4659-b5e2-40bb5f3a7d7e        | [Role Assignments - Put](/rest/api/billing/2019-10-01-preview/role-assignments/put) |                                                                       |
| EA purchaser          | Enrollment writer           | da6647fb-7651-49ee-be91-c43c4877f0c4        | [Role Assignments - Put](/rest/api/billing/2019-10-01-preview/role-assignments/put) |                                                                       |
| DepartmentReader      | Enrollment writer or department writer | db609904-a47f-4794-9be8-9bd86fbffd8a | [Enrollment Department Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollment-department-role-assignments/put) | Use departmentName parameter. |
| SubscriptionCreator   | Enrollment account owner (EA admin) | a0bcee42-bf30-4d1b-926a-48d21664ef71 | [Enrollment Account Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollment-account-role-assignments/put) | Use enrollmentAccountName parameter. |
| Partner Admin Reader  | Partner Administrator       | 4f6144c0-a809-4c55-b3c8-7f9b7b15a1bf        | [Role Assignments - Put](/rest/api/billing/2019-10-01-preview/role-assignments/put) | Use `pcn.{PCN}` for billingAccountName.                                |

1. Select **Run** to execute the command.
   
 :::image type="content" source="./media/assign-roles-azure-service-principals/roleassignments-put-try-it-run.png" alt-text="Screenshot showing an example role assignment with example information that is ready to run." lightbox="./media/assign-roles-azure-service-principals/roleassignments-put-try-it-run.png" :::

5. A `200 OK` response means the service principal was successfully assigned the role.

## Verify service principal role assignments

Service principal role assignments aren't visible in the Azure portal. You can view enrollment account role assignments, including the subscription creator role, with the [Billing Role Assignments - List By Enrollment Account - REST API (Azure Billing)](/rest/api/billing/2019-10-01-preview/billing-role-assignments/list-by-enrollment-account) API. Use the API to verify that the role assignment was successful.

## Troubleshoot

You must identify and use the Enterprise application object ID where you granted the EA role. If you use the Object ID from some other application, API calls fail. Verify that you’re using the correct Enterprise application object ID.

If you receive the following error when making your API call, then you might be incorrectly using the service principal object ID value located in App Registrations. To resolve this error, ensure you're using the service principal object ID from Enterprise Applications, not App Registrations.

`The provided principal Tenant Id = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx and principal Object Id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx are not valid`


## Next steps

[Get started with your Enterprise Agreement billing account](ea-direct-portal-get-started.md).