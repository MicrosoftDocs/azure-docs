---
title: Create MCA subscriptions across associated tenants
description: Learn how to programmatically create Azure subscriptions across associated Microsoft Entra tenants, including steps and considerations.
author: PreetiSGit
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/14/2025
ms.reviewer: presharm
ms.author: presharm
---

# Programmatically create MCA subscriptions across associated Microsoft Entra tenants

This article helps you programmatically create a Microsoft Customer Agreement (MCA) subscription across [associated billing tenants](manage-billing-across-tenants.md). In some situations, you might need to create MCA subscriptions across Microsoft Entra tenants but tie them to a single billing account. Examples of such situations include:

- SaaS providers wanting to segregate hosted customer services from internal IT services
- Holding or venture capital companies with many portfolio companies
- Internal environments that have strict regulatory compliance requirements, like Payment Card Industry (PCI)

The process to create an MCA subscription in associated billing tenants requires actions to be taken in the source and destination Microsoft Entra tenants. This article uses the following terminology:

- Source Microsoft Entra tenant (source.onmicrosoft.com). It represents the source tenant where the MCA billing account exists.
- Destination Cloud Microsoft Entra tenant (destination.onmicrosoft.com). It represents the destination tenant where the new MCA subscriptions are created.

You can't create support plans programmatically. You can buy a new support plan or upgrade one in the Azure portal. Navigate to **Help + support**. At the top of the page, select **Choose the right support plan**.

> [!NOTE]
> There are two methods to enable programmatically creating MCA subscriptions across Microsoft Entra tenants. The method outlined in this article is a simplified version which minimizes the management overhead and streamlines the subscription creation process by transferring permissions to create MCA subscriptions entirely to the destination tenant.
> The other method involves a [two-phase process](programmatically-create-subscription-microsoft-customer-agreement-across-tenants.md) which provides the source tenant governance over the subscriptions created in destination tenants. This method might be preferred if you need tighter control over creating subscriptions in destination tenants.

## Prerequisites

The following environment is required in order to enable programmatic creation of MCA subscriptions across associated billing tenants:

- A source Microsoft Entra tenant with an active [Microsoft Customer Agreement](create-subscription.md) billing account. If you don't have an active MCA, you can create one. For more information, see [Azure - Sign up](https://signup.azure.com/)
- A destination Microsoft Entra tenant separate from the tenant where your MCA belongs. To create a new Microsoft Entra tenant, see [Microsoft Entra tenant setup](../../active-directory/develop/quickstart-create-new-tenant.md).
- Add the destination Microsoft Entra tenant as associated billing tenant [associated billing tenants](manage-billing-across-tenants.md) within the source Microsoft Entra tenant and assign billing roles to a user from the destination Microsoft Entra tenant.

## Application setup

Use the information in the following sections to set up and configure the needed application in the destination tenant.

### Register an application in the destination tenant

To programmatically create an MCA subscription, a Microsoft Entra application must be registered and granted the appropriate Azure role-based access control (RBAC) permission. For this step, ensure you're signed into the destination tenant (destination.onmicrosoft.com) with an account that has permissions to register Microsoft Entra applications. Also make sure it was assigned a billing role in the source tenant (source.onmicrosoft.com) as part of the prerequisites.

Following the steps in [Quickstart: Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).

For the purposes of this process, you only need to follow the [Register an application](../../active-directory/develop/quickstart-register-app.md#register-an-application) and [Add credentials](../../active-directory/develop/quickstart-register-app.md#add-credentials) sections.

Save the following information to test and configure your environment:

- Directory (tenant) ID
- Application (client) ID
- Object ID
- App secret value that was generated. The value is only visible at the time of creation.

### Create a billing role assignment for the application in the destination tenant

To determine the appropriate scope and [billing role](understand-mca-roles.md#subscription-billing-roles-and-tasks) for the application, review the information at [Understand Microsoft Customer Agreement administrative roles in Azure](understand-mca-roles.md).

A user with owner access can assign a role to the application by signing into the Azure portal in the associated tenant. Owner access includes:

- Billing account owner
- Billing profile owner
- Invoice section owner

After you determine the scope and role, use the information at [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal) to create the role assignment for the application. Search for the application by using the name that you used when you registered the application in the preceding section.

## Programmatically create a subscription

With the applications and permissions already set up, use the following information to programmatically create subscriptions.

### Create the subscription

Use the following information to create a subscription in the destination tenant.

#### Get a destination application access token

Replace the `{{placeholders}}` with the actual tenant ID, application (client) ID, and the app secret values that you saved when you created the destination tenant application previously.

Invoke the request and save the `access_token` value from the response for use in the next step.

```http
POST https://login.microsoftonline.com/{{tenant_id}}/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={{client_id}}&client_secret={{app_secret}}&resource=https%3A%2F%2Fmanagement.azure.com%2F
```

#### Get the billing account, profile, and invoice section IDs

Use the information at [Find billing accounts that you have access to](programmatically-create-subscription-microsoft-customer-agreement.md?#find-billing-accounts-that-you-have-access-to) and [Find billing profiles & invoice sections to create subscriptions](programmatically-create-subscription-microsoft-customer-agreement.md?#find-billing-profiles--invoice-sections-to-create-subscriptions) sections to get the billing account, profile, and invoice section IDs.

> [!NOTE]
> We recommend using the REST method with the access token obtained previously to verify that the application billing role assignment was created successfully in the [Application Setup](#application-setup) section.

#### Create a subscription alias

With the billing account, profile, and invoice section IDs, you have all the information needed to create the subscription:

- `{{guid}}`: Can be a valid GUID.
- `{{access_token}}`: Access token of the destination tenant application obtained previously.
- `{{billing_account}}`: ID of the billing account obtained previously.
- `{{billing_profile}}`: ID of the billing profile obtained previously.
- `{{invoice_section}}`: ID of the invoice section obtained previously.
- `{{destination_tenant_id}}`: ID of the destination tenant as noted when you previously created the destination tenant application.
- `{{destination_service_principal_object_id}}`: ID of the destination tenant service principal that you got from the [Get a destination application access token](#get-a-destination-application-access-token) section previously.

```http
PUT https://management.azure.com/providers/Microsoft.Subscription/aliases/{{guid}}?api-version=2021-10-01
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "properties": {
    "displayName": "{{subscription_name}}",
    "workload": "Production",
    "billingScope": "/billingAccounts/{{billing_account}}/billingProfiles/{{billing_profile}}/invoiceSections/{{invoice_section}}",
    "subscriptionId": null,
    "additionalProperties": {
      "managementGroupId": null,
      "subscriptionTenantId": "{{destination_tenant_id}}",
      "subscriptionOwnerId": "{{destination_service_principal_object_id}}"
    }
  }
}
```

## Next steps

* Now that you created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
* To change the management group for a subscription, see [Move subscriptions](../../governance/management-groups/manage.md#move-management-groups-and-subscriptions).