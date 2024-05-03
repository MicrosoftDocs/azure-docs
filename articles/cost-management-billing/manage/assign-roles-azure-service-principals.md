---
title: Assign Enterprise Agreement roles to service principals
description: This article helps you assign EA roles to service principals by using PowerShell and REST APIs.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 02/15/2024
ms.author: banders
---

# Assign Enterprise Agreement roles to service principals

You can manage your Enterprise Agreement (EA) enrollment in the [Azure portal](https://portal.azure.com/). You can create different roles to manage your organization, view costs, and create subscriptions. This article helps you automate some of those tasks by using Azure PowerShell and REST APIs with Microsoft Entra ID service principals.

> [!NOTE]
> If you have multiple EA billing accounts in your organization, you must grant the EA roles to Microsoft Entra ID service principals individually in each EA billing account.

Before you begin, ensure that you're familiar with the following articles:

- [Enterprise agreement roles](understand-ea-roles.md)
- [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps)
- [How to call REST APIs with Postman](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

## Create and authenticate your service principal

To automate EA actions by using a service principal, you need to create a Microsoft Entra app identity, which can then authenticate in an automated manner.

Follow the steps in these articles to create and authenticate using your service principal.

- [Create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal)
- [Get tenant and app ID values for signing in](../../active-directory/develop/howto-create-service-principal-portal.md#sign-in-to-the-application)

Here's an example of the application registration page.

:::image type="content" source="./media/assign-roles-azure-service-principals/register-an-application.png" alt-text="Screenshot showing Register an application." lightbox="./media/assign-roles-azure-service-principals/register-an-application.png" :::

### Find your service principal and tenant IDs

You need the service principal's object ID and the tenant ID. You need this information for permission assignment operations later in this article. All applications are registered in Microsoft Entra ID in the tenant. Two types of objects get created when the app registration is completed:

- Application object - The application ID is what you see under Enterprise Applications. The ID should *not* be used to grant any EA roles.
- Service Principal object - The Service Principal object is what you see in the Enterprise Registration window in Microsoft Entra ID. The object ID is used to grant EA roles to the service principal.

1. Open Microsoft Entra ID, and then select **Enterprise applications**.
1. Find your app in the list.

   :::image type="content" source="./media/assign-roles-azure-service-principals/enterprise-application.png" alt-text="Screenshot showing an example enterprise application." lightbox="./media/assign-roles-azure-service-principals/enterprise-application.png" :::

1. Select the app to find the application ID and object ID:

   :::image type="content" source="./media/assign-roles-azure-service-principals/application-id-object-id.png" alt-text="Screenshot showing an application ID and object ID for an enterprise application." lightbox="./media/assign-roles-azure-service-principals/application-id-object-id.png" :::

1. Go to the Microsoft Entra ID **Overview** page to find the tenant ID.

   :::image type="content" source="./media/assign-roles-azure-service-principals/tenant-id.png" alt-text="Screenshot showing the tenant ID." lightbox="./media/assign-roles-azure-service-principals/tenant-id.png" :::

> [!NOTE]
> The value of your Microsoft Entra tenant ID looks like a GUID with the following format: `11111111-1111-1111-1111-111111111111`.

## Permissions that can be assigned to the service principal

Later in this article, you'll give permission to the Microsoft Entra app to act by using an EA role. You can assign only the following roles to the service principal, and you need the role definition ID, exactly as shown.

| Role | Actions allowed | Role definition ID |
| --- | --- | --- |
| EnrollmentReader | Enrollment readers can view data at the enrollment, department, and account scopes. The data contains charges for all of the subscriptions under the scopes, including across tenants. Can view the Azure Prepayment (previously called monetary commitment) balance associated with the enrollment. | 24f8edb6-1668-4659-b5e2-40bb5f3a7d7e |
| EA purchaser | Purchase reservation orders and view reservation transactions. It has all the permissions of EnrollmentReader, which will in turn have all the permissions of DepartmentReader. It can view usage and charges across all accounts and subscriptions. Can view the Azure Prepayment (previously called monetary commitment) balance associated with the enrollment. | da6647fb-7651-49ee-be91-c43c4877f0c4  |
| DepartmentReader | Download the usage details for the department they administer. Can view the usage and charges associated with their department. | db609904-a47f-4794-9be8-9bd86fbffd8a |
| SubscriptionCreator | Create new subscriptions in the given scope of Account. | a0bcee42-bf30-4d1b-926a-48d21664ef71 |

- An EnrollmentReader role can be assigned to a service principal only by a user who has an enrollment writer role. The EnrollmentReader role assigned to a service principal isn't shown in the Azure portal. It's created by programmatic means and is only for programmatic use.
- A DepartmentReader role can be assigned to a service principal only by a user who has an enrollment writer or department writer role.
- A SubscriptionCreator role can be assigned to a service principal only by a user who is the owner of the enrollment account (EA administrator). The role isn't shown in the Azure portal. It's created by programmatic means and is only for programmatic use.
- The EA purchaser role isn't shown in the Azure portal. It's created by programmatic means and is only for programmatic use.

When you grant an EA role to a service principal, you must use the `billingRoleAssignmentName` required property. The parameter is a unique GUID that you must provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command. You can also use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

A service principal can have only one role.

## Assign enrollment account role permission to the service principal

1. Read the [Role Assignments - Put](/rest/api/billing/2019-10-01-preview/role-assignments/put) REST API article. While you read the article, select **Try it** to get started by using the service principal.

   :::image type="content" source="./media/assign-roles-azure-service-principals/put-try-it.png" alt-text="Screenshot showing the Try It option in the Put article." lightbox="./media/assign-roles-azure-service-principals/put-try-it.png" :::

1. Use your account credentials to sign in to the tenant with the enrollment access that you want to assign.

1. Provide the following parameters as part of the API request.

   - `billingAccountName`: This parameter is the **Billing account ID**. You can find it in the Azure portal on the **Cost Management + Billing** overview page.

      :::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

   - `billingRoleAssignmentName`: This parameter is a unique GUID that you need to provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command. You can also use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

   - `api-version`: Use the **2019-10-01-preview** version. Use the sample request body at [Role Assignments - Put - Examples](/rest/api/billing/2019-10-01-preview/role-assignments/put#examples).

      The request body has JSON code with three parameters that you need to use.

      | Parameter | Where to find it |
      | --- | --- |
      | `properties.principalId` | It is the value of Object ID. See [Find your service principal and tenant IDs](#find-your-service-principal-and-tenant-ids). |
      | `properties.principalTenantId` | See [Find your service principal and tenant IDs](#find-your-service-principal-and-tenant-ids). |
      | `properties.roleDefinitionId` | `/providers/Microsoft.Billing/billingAccounts/{BillingAccountName}/billingRoleDefinitions/24f8edb6-1668-4659-b5e2-40bb5f3a7d7e` |

      The billing account name is the same parameter that you used in the API parameters. It's the enrollment ID that you see in the Azure portal.

      Notice that `24f8edb6-1668-4659-b5e2-40bb5f3a7d7e` is a billing role definition ID for an EnrollmentReader.

1. Select **Run** to start the command.

   :::image type="content" source="./media/assign-roles-azure-service-principals/roleassignments-put-try-it-run.png" alt-text="Screenshot showing a example role assignment with example information that is ready to run." lightbox="./media/assign-roles-azure-service-principals/roleassignments-put-try-it-run.png" :::

   A `200 OK` response shows that the service principal was successfully added.

Now you can use the service principal to automatically access EA APIs. The service principal has the EnrollmentReader role.

## Assign EA Purchaser role permission to the service principal

For the EA purchaser role, use the same steps for the enrollment reader. Specify the `roleDefinitionId`, using the following example:

`"/providers/Microsoft.Billing/billingAccounts/1111111/billingRoleDefinitions/ da6647fb-7651-49ee-be91-c43c4877f0c4"`

## Assign the department reader role to the service principal

1. Read the [Enrollment Department Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollment-department-role-assignments/put) REST API article. While you read the article, select **Try it**.

   :::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" alt-text="Screenshot showing the Try It option in the Enrollment Department Role Assignments Put article." lightbox="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" :::

1. Use your account credentials to sign in to the tenant with the enrollment access that you want to assign.

1. Provide the following parameters as part of the API request.

   - `billingAccountName`: This parameter is the **Billing account ID**. You can find it in the Azure portal on the **Cost Management + Billing** overview page.

      :::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

   - `billingRoleAssignmentName`: This parameter is a unique GUID that you need to provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command. You can also use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

   - `departmentName`: This parameter is the department ID. You can see department IDs in the Azure portal on the **Cost Management + Billing** > **Departments** page.

      For this example, we used the ACE department. The ID for the example is `84819`.

      :::image type="content" source="./media/assign-roles-azure-service-principals/department-id.png" alt-text="Screenshot showing an example department ID." lightbox="./media/assign-roles-azure-service-principals/department-id.png" :::

   - `api-version`: Use the **2019-10-01-preview** version. Use the sample at [Enrollment Department Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollment-department-role-assignments/put).

      The request body has JSON code with three parameters that you need to use.

      | Parameter | Where to find it |
      | --- | --- |
      | `properties.principalId` | It is the value of Object ID. See [Find your service principal and tenant IDs](#find-your-service-principal-and-tenant-ids). |
      | `properties.principalTenantId` | See [Find your service principal and tenant IDs](#find-your-service-principal-and-tenant-ids). |
      | `properties.roleDefinitionId` | `/providers/Microsoft.Billing/billingAccounts/{BillingAccountName}/billingRoleDefinitions/db609904-a47f-4794-9be8-9bd86fbffd8a` |

      The billing account name is the same parameter that you used in the API parameters. It's the enrollment ID that you see in the Azure portal.

      The billing role definition ID of `db609904-a47f-4794-9be8-9bd86fbffd8a` is for a department reader.

1. Select **Run** to start the command.

   :::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it-run.png" alt-text="Screenshot showing an example Enrollment Department Role Assignments – Put REST Try It with example information ready to run." lightbox="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it-run.png" :::

   A `200 OK` response shows that the service principal was successfully added.

Now you can use the service principal to automatically access EA APIs. The service principal has the DepartmentReader role.

## Assign the subscription creator role to the service principal

1. Read the [Enrollment Account Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollment-account-role-assignments/put) article. While you read it, select **Try It** to assign the subscription creator role to the service principal.

   :::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" alt-text="Screenshot showing the Try It option in the Enrollment Account Role Assignments Put article." lightbox="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" :::

1. Use your account credentials to sign in to the tenant with the enrollment access that you want to assign.

1. Provide the following parameters as part of the API request. Read the article at [Enrollment Account Role Assignments - Put - URI Parameters](/rest/api/billing/2019-10-01-preview/enrollment-account-role-assignments/put#uri-parameters).

   - `billingAccountName`: This parameter is the **Billing account ID**. You can find it in the Azure portal on the **Cost Management + Billing overview** page.

      :::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing the Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

   - `billingRoleAssignmentName`: This parameter is a unique GUID that you need to provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command. You can also use the [Online GUID/UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

   - `enrollmentAccountName`: This parameter is the account **ID**. Find the account ID for the account name in the Azure portal on the **Cost Management + Billing** page.

      For this example, we used the GTM Test Account. The ID is `196987`.

      :::image type="content" source="./media/assign-roles-azure-service-principals/account-id.png" alt-text="Screenshot showing the account ID." lightbox="./media/assign-roles-azure-service-principals/account-id.png" :::

   - `api-version`: Use the **2019-10-01-preview** version. Use the sample at [Enrollment Department Role Assignments - Put - Examples](/rest/api/billing/2019-10-01-preview/enrollment-department-role-assignments/put#examples).

      The request body has JSON code with three parameters that you need to use.

      | Parameter | Where to find it |
      | --- | --- |
      | `properties.principalId` | It is the value of Object ID. See [Find your service principal and tenant IDs](#find-your-service-principal-and-tenant-ids). |
      | `properties.principalTenantId` | See [Find your service principal and tenant IDs](#find-your-service-principal-and-tenant-ids). |
      | `properties.roleDefinitionId` | `/providers/Microsoft.Billing/billingAccounts/{BillingAccountID}/enrollmentAccounts/{enrollmentAccountID}/billingRoleDefinitions/a0bcee42-bf30-4d1b-926a-48d21664ef71` |

      The billing account name is the same parameter that you used in the API parameters. It's the enrollment ID that you see in the Azure portal.

      The billing role definition ID of `a0bcee42-bf30-4d1b-926a-48d21664ef71` is for the subscription creator role.

1. Select **Run** to start the command.

   :::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-account-role-assignments-put-try-it.png" alt-text="Screenshot showing the Try It option in the Enrollment Account Role Assignments - Put article." lightbox="./media/assign-roles-azure-service-principals/enrollment-account-role-assignments-put-try-it.png" :::

   A `200 OK` response shows that the service principal has been successfully added.

Now you can use the service principal to automatically access EA APIs. The service principal has the SubscriptionCreator role.

## Verify service principal role assignments

Service principal role assignments are not visible in the Azure portal. You can view enrollment account role assignments, including the subscription creator role, with the [Billing Role Assignments - List By Enrollment Account - REST API (Azure Billing)](/rest/api/billing/2019-10-01-preview/billing-role-assignments/list-by-enrollment-account) API. Use the API to verify that the role assignment was successful.

## Troubleshoot

You must identify and use the Enterprise application object ID where you granted the EA role. If you use the Object ID from some other application, API calls will fail. Verify that you’re using the correct Enterprise application object ID.

If you receive the following error when making your API call, then you may be incorrectly using the service principal object ID value located in App Registrations. To resolve this error, ensure you're using the service principal object ID from Enterprise Applications, not App Registrations.

`The provided principal Tenant Id = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx and principal Object Id xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx are not valid`


## Next steps

[Get started with your Enterprise Agreement billing account](ea-direct-portal-get-started.md).
