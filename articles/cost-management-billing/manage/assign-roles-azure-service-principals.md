---
title: Assign roles to Azure Enterprise Agreement service principal names
description: This article helps you assign roles to service principal names using PowerShell and REST APIs.
author: bandersmsft
ms.reviewer: ruturajd
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/07/2021
ms.author: banders
---

# Assign roles to Azure Enterprise Agreement service principal names

You can manage your Enterprise Agreement (EA) enrollment in the [Azure Enterprise portal](https://ea.azure.com/). You can create different roles to manage your organization, view costs, and create subscriptions. This article helps you automate some of those tasks using Azure PowerShell and REST APIs with Azure service principal names (SPNs).

Before you begin, ensure that you're familiar with the following articles:

- [Enterprise agreement roles](understand-ea-roles.md)
- [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps)
- [How to call REST APIs with Postman](/rest/api/azure/#how-to-call-azure-rest-apis-with-postman)

## Create and authenticate your service principal

To automate EA actions using an SPN, you need to create an Azure Active Directory (Azure AD) application. It can authenticate in an automated manner. Read the following articles and following the steps in them to create and authenticate your service principal.

1. [Create a service principal](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal)
2. [Get tenant and app ID values for signing in](../../active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in)

Here's an example screenshot showing application registration.

:::image type="content" source="./media/assign-roles-azure-service-principals/register-an-application.png" alt-text="Screenshot showing Register an application." lightbox="./media/assign-roles-azure-service-principals/register-an-application.png" :::

### Find your SPN and Tenant ID

You also need the Object ID of the SPN and the Tenant ID of the app. You need the information for permission assignment operations in later sections.

You can find the Tenant ID of the Azure AD app on the overview page for the application. To find it in the Azure portal, navigate to Azure Active Directory and select **Enterprise applications**. Search for the app.

:::image type="content" source="./media/assign-roles-azure-service-principals/enterprise-application.png" alt-text="Screenshot showing an example enterprise application." lightbox="./media/assign-roles-azure-service-principals/enterprise-application.png" :::

Select the app. Here's an example showing the Application ID and Object ID.

:::image type="content" source="./media/assign-roles-azure-service-principals/application-id-object-id.png" alt-text="Screenshot showing an application ID and object ID for an enterprise application." lightbox="./media/assign-roles-azure-service-principals/application-id-object-id.png" :::

You can find the Tenant ID on the Microsoft Azure AD Overview page.

:::image type="content" source="./media/assign-roles-azure-service-principals/tenant-id.png" alt-text="Screenshot showing where to view your tenant ID." lightbox="./media/assign-roles-azure-service-principals/tenant-id.png" :::

Your principal tenant ID is also referred to as Principal ID, SPN, and Object ID in various locations. The value of your Azure AD tenant ID looks like a GUID with the following format: `11111111-1111-1111-1111-111111111111`.

## Permissions that can be assigned to the SPN

For the next steps, you give permission to the Azure AD app to do actions using an EA role. You can assign only the following roles to the SPN. The role definition ID, exactly as shown, is used later in assignment steps.

| Role | Actions allowed | Role definition ID |
| --- | --- | --- |
| EnrollmentReader | Can view usage and charges across all accounts and subscriptions. Can view the Azure Prepayment (previously called monetary commitment) balance associated with the enrollment. | 24f8edb6-1668-4659-b5e2-40bb5f3a7d7e |
| DepartmentReader | Download the usage details for the department they administer. Can view the usage and charges associated with their department. | db609904-a47f-4794-9be8-9bd86fbffd8a |
| SubscriptionCreator | Create new subscriptions in the given scope of Account. | a0bcee42-bf30-4d1b-926a-48d21664ef71 |

- An enrollment reader can be assigned to an SPN only by a user with enrollment writer role.
- A department reader can be assigned to an SPN only by a user that has enrollment writer role or department writer role.
- A subscription creator role can be assigned to an SPN only by a user that is the Account Owner of the enrollment account.

## Assign enrollment account role permission to the SPN

Read the [Role Assignments - Put](/rest/api/billing/2019-10-01-preview/roleassignments/put) REST API article.

While reading the article, select **Try it** to get started using the SPN.

:::image type="content" source="./media/assign-roles-azure-service-principals/put-try-it.png" alt-text="Screenshot showing the Try It option in the Put article." lightbox="./media/assign-roles-azure-service-principals/put-try-it.png" :::

Sign in with your account into the tenant that has access to the enrollment where you want to assign access.

Provide the following parameters as part of the API request.

**billingAccountName**

The parameter is the Billing account ID. You can find it in the Azure portal on the Cost Management + Billing overview page.

:::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

**billingRoleAssignmentName**

The parameter is a unique GUID that you need to provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command.

Or, you can use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

**api-version**

Use the **2019-10-01-preview** version.

The request body has JSON code that you need to use.

Use the sample request body at [Role Assignments - Put - Examples](/rest/api/billing/2019-10-01-preview/roleassignments/put#examples).

There are three parameters that you need to use as part of the JSON.

| Parameter | Where to find it |
| --- | --- |
| properties.principalId | See [Find your SPN and Tenant ID](#find-your-spn-and-tenant-id). |
| properties.principalTenantId | See [Find your SPN and Tenant ID](#find-your-spn-and-tenant-id). |
| properties.roleDefinitionId | "/providers/Microsoft.Billing/billingAccounts/{BillingAccountName}/billingRoleDefinitions/24f8edb6-1668-4659-b5e2-40bb5f3a7d7e" |

The Billing Account name is the same parameter that you used in the API parameters. It's the enrollment ID that you see in the EA portal and Azure portal.

Notice that `24f8edb6-1668-4659-b5e2-40bb5f3a7d7e` is a billing role definition ID for a EnrollmentReader.

Select **Run** to start the command.

:::image type="content" source="./media/assign-roles-azure-service-principals/roleassignments-put-try-it-run.png" alt-text="Screenshot showing an example role assignment put Try It with example information ready to run." lightbox="./media/assign-roles-azure-service-principals/roleassignments-put-try-it-run.png" :::

A `200 OK` response shows that the SPN was successfully added.

Now you can use the SPN (Azure AD App with the object ID) to access EA APIs in an automated manner. The SPN has the EnrollmentReader role.

## Assign the department reader role to the SPN

Before you begin, read the [Enrollment Department Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollmentdepartmentroleassignments/put) REST API article.

While reading the article, select **Try it**.

:::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" alt-text="Screenshot showing the Try It option in the Enrollment Department Role Assignments Put article." lightbox="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" :::

Sign in with your account into the tenant that has access to the enrollment where you want to assign access.

Provide the following parameters as part of the API request.

**billingAccountName**

It's the Billing account ID. You can find it in the Azure portal on the Cost Management + Billing overview page.

:::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

**billingRoleAssignmentName**

The parameter is a unique GUID that you need to provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command.

Or, you can use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.

**departmentName**

It's the Department ID. You can see department IDs in the Azure portal. Navigate to Cost Management + Billing > **Departments**.

For this example, we used the ACE department. The ID for the example is `84819`.

:::image type="content" source="./media/assign-roles-azure-service-principals/department-id.png" alt-text="Screenshot showing an example department ID." lightbox="./media/assign-roles-azure-service-principals/department-id.png" :::

**api-version**

Use the **2019-10-01-preview** version.

The request body has JSON code that you need to use.

Use the sample at [Enrollment Department Role Assignments - Put](/billing/2019-10-01-preview/enrollmentdepartmentroleassignments/put). There are three parameters that you need to use as part of the JSON.

| Parameter | Where to find it |
| --- | --- |
| properties.principalId | See [Find your SPN and Tenant ID](#find-your-spn-and-tenant-id). |
| properties.principalTenantId | See [Find your SPN and Tenant ID](#find-your-spn-and-tenant-id). |
| properties.roleDefinitionId | "/providers/Microsoft.Billing/billingAccounts/{BillingAccountName}/billingRoleDefinitions/db609904-a47f-4794-9be8-9bd86fbffd8a" |

The Billing Account name is the same parameter that you used in the API parameters. It's the enrollment ID that you see in the EA portal and Azure portal.

The billing role definition ID of `db609904-a47f-4794-9be8-9bd86fbffd8a` is for a Department Reader.

Select **Run** to start the command.

:::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it-run.png" alt-text="Screenshot showing an example Enrollment Department Role Assignments – Put REST Try It with example information ready to run." lightbox="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it-run.png" :::

A `200 OK` response shows that the SPN was successfully added.

Now you can use the SPN (Azure AD App with the object ID) to access EA APIs in an automated manner. The SPN has the DepartmentReader role.

## Assign the subscription creator role to the SPN

Read the [Enrollment Account Role Assignments - Put](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put) article.

While reading it, select **Try It** to assign the subscription creator role to the SPN.

:::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" alt-text="Screenshot showing the Try It option in the Enrollment Account Role Assignments Put article." lightbox="./media/assign-roles-azure-service-principals/enrollment-department-role-assignments-put-try-it.png" :::

Sign in with your account into the tenant that has access to the enrollment where you want to assign access.

Provide the following parameters as part of the API request. Read the article at [Enrollment Account Role Assignments - Put - URI Parameters](/rest/api/billing/2019-10-01-preview/enrollmentaccountroleassignments/put#uri-parameters).

**billingAccountName**

The parameter is the Billing account ID. You can find it in the Azure portal on the Cost Management + Billing overview page.

:::image type="content" source="./media/assign-roles-azure-service-principals/billing-account-id.png" alt-text="Screenshot showing Billing account ID." lightbox="./media/assign-roles-azure-service-principals/billing-account-id.png" :::

**billingRoleAssignmentName**

The parameter is a unique GUID that you need to provide. You can generate a GUID using the [New-Guid](/powershell/module/microsoft.powershell.utility/new-guid) PowerShell command.

Or, you can use the [Online GUID / UUID Generator](https://guidgenerator.com/) website to generate a unique GUID.
**enrollmentAccountName**

The parameter is the account ID. Find the account ID for the account name in the Azure portal in Cost Management + Billing in the Enrollment and department scope.

For this example, we used the GTM Test account. The ID is `196987`.

:::image type="content" source="./media/assign-roles-azure-service-principals/account-id.png" alt-text="Screenshot showing the account ID." lightbox="./media/assign-roles-azure-service-principals/account-id.png" :::

**api-version**

Use the **2019-10-01-preview** version.

The request body has JSON code that you need to use.

Use the sample at [Enrollment Department Role Assignments - Put - Examples](/rest/api/billing/2019-10-01-preview/enrollmentdepartmentroleassignments/put#putenrollmentdepartmentadministratorroleassignment).

There are three parameters that you need to use as part of the JSON.

| Parameter | Where to find it |
| --- | --- |
| properties.principalId | See [Find your SPN and Tenant ID](#find-your-spn-and-tenant-id). |
| properties.principalTenantId | See [Find your SPN and Tenant ID](#find-your-spn-and-tenant-id). |
| properties.roleDefinitionId | "/providers/Microsoft.Billing/billingAccounts/{BillingAccountID}/enrollmentAccounts/196987/billingRoleDefinitions/a0bcee42-bf30-4d1b-926a-48d21664ef71" |

The Billing Account name is the same parameter that you used in the API parameters. It's the enrollment ID that you see in the EA portal and Azure portal.

The billing role definition ID of `a0bcee42-bf30-4d1b-926a-48d21664ef71` is for the subscription creator role.

Select **Run** to start the command.

:::image type="content" source="./media/assign-roles-azure-service-principals/enrollment-account-role-assignments-put-try-it.png" alt-text="Screenshot showing the Try It option in the Enrollment Account Role Assignments - Put article" lightbox="./media/assign-roles-azure-service-principals/enrollment-account-role-assignments-put-try-it.png" :::

A `200 OK` response shows that the SPN has been successfully added.

Now you can use the SPN (Azure AD App with the object ID) to access EA APIs in an automated manner. The SPN has the SubscriptionCreator role.

## Next steps

- Learn more about [Azure EA portal administration](ea-portal-administration.md).