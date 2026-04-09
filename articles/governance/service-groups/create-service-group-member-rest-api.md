---
title: "Quickstart: Add Service Group members using the REST API - Azure Governance"
description: In this quickstart, you use REST API to add a resource to a service group with a service group member relationship.
author: rthorn17
ms.author: kenieva
ms.service: azure-policy
ms.topic: quickstart
ms.date: 5/19/2025
ms.custom:
  - build-2025
---


# Quickstart: Add resources or resource containers to service groups with Service Group Member Relationships 
 
To add resources, resource groups, or subscriptions to a Service Group (preview), you need to create a new Service Group Member Relationship. For more information on service groups, see [Getting started with Service Groups](overview.md).

> [!IMPORTANT]
> Azure Service Groups is currently in public preview. 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
  account before you begin.

- If you haven't already, install [ARMClient](https://github.com/projectkudu/ARMClient). It's a tool
  that sends HTTP requests to Azure Resource Manager-based REST APIs.

- To be able to deploy a service group member relationship, you must have Microsoft.Relationship/ServiceGroupMember/write permissions on the source as well as Microsoft.ServiceGroup Contributor at the target service group. 

## Create in REST API

The `[scope]` in the URLs below refers to the full Azure Resource Manager path of the resource you want to add as a member. The scope varies depending on the type of resource:

| Resource type | Scope format |
|---|---|
| Subscription | `subscriptions/{subscriptionId}` |
| Resource group | `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}` |
| Resource | `subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProvider}/{resourceType}/{resourceName}` |

For REST API, use the
[Service Groups Member - Create or Update](/rest/api/resources/service-group-member/create-or-update) endpoint to create a new service group member.

In this example, we're adding a Virtual Machine [VM1] to a service group [Contoso].

1. Service Group: **groupId** is _Contoso_
1. Virtual Machine: The **resourceID** is _VM1_
1. Service Group Member: The **relationshipID** is _SGM1_

When you're adding a resource to a service group, you create service group member by extending the resource.  

- REST API URI

  ```http
  PUT https://management.azure.com/[scope]/providers/Microsoft.Relationships/serviceGroupMember/SGM1?api-version=2023-09-01-preview
  ```


In the preceding example, the new service group member is created extending the Virtual Machine. To
specify the service group as the parent, use the **TargetID** property.

- REST API URI

  ```http
  PUT https://management.azure.com/subscriptions/[SUBID]/resourceGroups/[RGID]/providers/microsoft.compute/virtualmachine/[VMID]/providers/Microsoft.Relationships/serviceGroupMember/SGM1?api-version=2023-09-01-preview
  ```

- Request Body

  ```json
    {
      "properties": {
       "targetId": "providers/microsoft.management/servicegroups/Contoso"
      }
    }
  ```

## Clean up resources

To remove the service group created in this document, use the
[Service Group Member - Delete](/rest/api/resources/service-group-member/delete) endpoint:

- REST API URI

  ```http
  DELETE https://management.azure.com/[scope]/providers/Microsoft.Relationships/serviceGroupMember/SGM1?api-version=2023-09-01-preview
  ```

- No Request Body

## Verify your service group member

The Create Service Group Member API is an asynchronous call. A successful response means the request was accepted, but the operation may still be processing. To check the operation status:

1. Look for the **Azure-AsyncOperation** header in the response from the PUT request.
2. Make a GET request to the URL in that header to check the operation status.

```json
{
    "status": "Succeeded"
}
```

Possible status values include `Succeeded`, `Failed`, and `InProgress`. Wait for the operation to complete before relying on the membership relationship.

For more information on checking operation status, see [Checking for Service Group Operation Status](manage-service-groups.md#checking-for-service-group-operation-status).

## Next step

In this quickstart, you created a service group to help create different views in Azure. The
service group can have member subscriptions, resource groups, resources, or other service groups.

To learn more about service groups and how to manage your service group hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with service groups](manage-service-groups.md)

