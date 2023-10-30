---
title: Programmatically create MCA subscriptions across Microsoft Entra tenants
description: Learn how to programmatically create an Azure MCA subscription across Microsoft Entra tenants.
author: bandersmsft
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 08/22/2022
ms.reviewer: rygraham
ms.author: banders
---

# Programmatically create MCA subscriptions across Microsoft Entra tenants

This article helps you programmatically create a Microsoft Customer Agreement (MCA) subscription across Microsoft Entra tenants. In some situations, you might need to create MCA subscriptions across Microsoft Entra tenants but have them tied to a single billing account. Examples of such situations include SaaS providers wanting to segregate hosted customer services from internal IT services or internal environments that have strict regulatory compliance requirements, like Payment Card Industry (PCI).

The process to create an MCA subscription across tenants is effectively a two-phase process. It requires actions to be taken in the source and destination Microsoft Entra tenants. This article uses the following terminology:

- Source Microsoft Entra ID (source.onmicrosoft.com). It represents the source tenant where the MCA billing account exists.
- Destination Cloud Microsoft Entra ID (destination.onmicrosoft.com). It represents the destination tenant where the new MCA subscriptions are created.

## Prerequisites

You must you already have the following tenants created:

- A source Microsoft Entra tenant with an active [Microsoft Customer Agreement](create-subscription.md) billing account. If you don't have an active MCA, you can create one. For more information, see [Azure - Sign up](https://signup.azure.com/)
- A destination Microsoft Entra tenant separate from the tenant where your MCA belongs. To create a new Microsoft Entra tenant, see [Microsoft Entra tenant setup](../../active-directory/develop/quickstart-create-new-tenant.md).

## Application set-up

Use the information in the following sections to set up and configure the needed applications in the source and destination tenants.

### Register an application in the source tenant

To programmatically create an MCA subscription, a Microsoft Entra application must be registered and granted the appropriate Azure RBAC permission. For this step, ensure you're signed into the source tenant (source.onmicrosoft.com) with an account that has permissions to register Microsoft Entra applications.

Following the steps in [Quickstart: Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).

For the purposes of this process, you only need to follow the [Register an application](../../active-directory/develop/quickstart-register-app.md#register-an-application) and [Add credentials](../../active-directory/develop/quickstart-register-app.md#add-credentials) sections.

Save the following information to test and configure your environment:

- Directory (tenant) ID
- Application (client) ID
- Object ID
- App secret value that was generated. The value is only visible at the time of creation.

### Create a billing role assignment for the application in the source tenant

Review the information at [Understand Microsoft Customer Agreement administrative roles in Azure](understand-mca-roles.md) to determine the appropriate scope and [billing role](understand-mca-roles.md#subscription-billing-roles-and-tasks) for the application.

After you determine the scope and role, use the information at [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal) to create the role assignment for the application. Search for the application by using the name that you used when you registered the application in the preceding section.

### Register an application in the destination tenant

To accept the MCA subscription from the destination tenant (destination.onmicrosoft.com), a Microsoft Entra application must be registered and added to the Billing administrator Microsoft Entra role. For this step, ensure you're signed in to the destination tenant (destination.onmicrosoft.com) with an account that has permissions to register Microsoft Entra applications. It must also have billing administrator role permission.

Follow the same steps used above to register an application in the source tenant. Save the following information to test and configure your environment:

- Directory (tenant) ID
- Application (client) ID
- Object ID
- App secret value that was generated. The value is only visible at the time of creation.

<a name='add-the-destination-application-to-the-billing-administrator-azure-ad-role'></a>

### Add the destination application to the Billing administrator Microsoft Entra role

Use the information at [Assign administrator and non-administrator roles to users with Microsoft Entra ID](../../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) to add the destination application created in the preceding section to the Billing administrator Microsoft Entra role in the destination tenant.

## Programmatically create a subscription

With the applications and permissions already set up, use the following information to programmatically create subscriptions.

### Get the ID of the destination application service principal

When you create an MCA subscription in the source tenant, you must specify the service principal or SPN of the application in the destination tenant as the owner. Use one of the following methods to get the ID. In both methods, the value to use for the empty GUID is the application (client) ID of the destination tenant application created previously.

#### Azure CLI

Sign in to Azure CLI and use the [az ad sp show](/cli/azure/ad/sp#az-ad-sp-show) command:

```sh
az ad sp show --id 00000000-0000-0000-0000-000000000000 --query 'id'
```

#### Azure PowerShell

Sign in to Azure PowerShell and use the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal) cmdlet:

```sh
Get-AzADServicePrincipal -ApplicationId 00000000-0000-0000-0000-000000000000 | Select-Object -Property Id
```

Save the `Id` value returned by the command.

### Create the subscription

Use the following information to create a subscription in the source tenant.

#### Get a source application access token

Replace the `{{placeholders}}` with the actual tenant ID, application (client) ID, and the app secret values that you saved when you created the source tenant application previously.

Invoke the request and save the `access_token` value from the response for use in the next step.

```http
POST https://login.microsoftonline.com/{{tenant_id}}/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={{client_id}}&client_secret={{app_secret}}&resource=https%3A%2F%2Fmanagement.azure.com%2F
```

#### Get the billing account, profile, and invoice section IDs

Use the information at [Find billing accounts that you have access to](programmatically-create-subscription-microsoft-customer-agreement.md?tabs=rest#find-billing-accounts-that-you-have-access-to) and [Find billing profiles & invoice sections to create subscriptions](programmatically-create-subscription-microsoft-customer-agreement.md?tabs=rest#find-billing-profiles--invoice-sections-to-create-subscriptions) sections to get the billing account, profile, and invoice section IDs.

> [!NOTE]
> We recommend using the REST method with the access token obtained previously to verify that the application billing role assignment was created successfully in the [Application Setup](#application-set-up) section.

#### Create a subscription alias

With the billing account, profile, and invoice section IDs, you have all the information needed to create the subscription:

- `{{guid}}`: Can be a valid GUID.
- `{{access_token}}`: Access token of the source tenant application obtained previously.
- `{{billing_account}}`: ID of the billing account obtained previously.
- `{{billing_profile}}`: ID of the billing profile obtained previously.
- `{{invoice_section}}`: ID of the invoice section obtained previously.
- `{{destination_tenant_id}}`: ID of the destination tenant as noted when you previously created the destination tenant application.
- `{{destination_service_principal_id}}`: ID of the destination tenant service principal that you got from the [Get the ID of the destination application service principal](#get-the-id-of-the-destination-application-service-principal) section previously.

Send the request and note the value of the `Location` header in the response.

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
      "subscriptionOwnerId": "{{destination_service_principal_id}}"
    }
  }
}
```

### Accept subscription ownership

The last phase to complete the process is to accept subscription ownership.

#### Get a destination application access token

Replace `{{placeholders}}` with the actual tenant ID, application (client) ID, and app secret values that you saved when you created the destination tenant application previously.

Invoke the request and save the `access_token` value from the response for the next step.

```http
POST https://login.microsoftonline.com/{{tenant_id}}/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={{client_id}}&client_secret={{app_secret}}&resource=https%3A%2F%2Fmanagement.azure.com%2F
```

#### Accept ownership

Use the following information to accept ownership of the subscription in the destination tenant:

- `{{subscription_id}}`: ID of the subscription created in the [Create subscription alias](#create-a-subscription-alias) section. It's contained in the location header that you noted.
- `{{access_token}}`: Access token created in the previous step.
- `{{subscription_display_name}}`: Display name for the subscription in your Azure environment.

```http
POST https://management.azure.com/providers/Microsoft.Subscription/subscriptions/{{subscription_id}}/acceptOwnership?api-version=2021-10-01
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "properties": {
    "displayName": "{{subscription_display_name}}",
    "managementGroupId": null
  }
}
```

## Next steps

* Now that you've created a subscription, you can grant that ability to other users and service principals. For more information, see [Grant access to create Azure Enterprise subscriptions (preview)](grant-access-to-create-subscription.md).
* For more information about managing large numbers of subscriptions using management groups, see [Organize your resources with Azure management groups](../../governance/management-groups/overview.md).
* To change the management group for a subscription, see [Move subscriptions](../../governance/management-groups/manage.md#move-subscriptions).
