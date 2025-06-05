---
title: "Quickstart: Add Service Group members using the REST API - Azure Governance"
description: In this quickstart, you use REST API to add a resource to a service group with a service group member relationship.
author: rthorn17
ms.author: rithorn
ms.service: azure-policy
ms.topic: quickstart
ms.date: 5/19/2025
ms.custom:
  - build-2025
---


# Quickstart: Add resources or resource containers to service groups with Service Group Member Relationships 
 
To add resources, resource groups, or subscriptions to a Service Group (preview), you need to create a new Service Group Member Relationship. For more information on service groups, see [Getting started with Service Groups](overview.md).

> [!IMPORTANT]
> Azure Service Groups is currently in PREVIEW. 
> For more information about participating in the preview, see [Azure Service Groups Preview](https://aka.ms/ServiceGroups/PreviewSignup).
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- If you haven't already, install [ARMClient](https://github.com/projectkudu/ARMClient). It's a tool
  that sends HTTP requests to Azure Resource Manager-based REST APIs.

## Create in REST API

For REST API, use the
[Service Groups Member- Create or Update]() endpoint to create a new service group member.

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
  PUT https://management.azure.com/subscriptions/[SUBID]/resourceGroups/[RGID]/providers/microsoft.compute/virtualmachine/[VMID]/providers/Microsoft.Relationships/serviceGroupMember/SGM1?api-version=2024-02-01-preview
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
[Service Group Member Delete]() endpoint:

- REST API URI

  ```http
  DELETE https://management.azure.com/[scope]/providers/Microsoft.Relationships/serviceGroupMember/SGM1?api-version=2023-09-01-preview
  ```

- No Request Body


## Next step

In this quickstart, you created a service group to help create different views in Azure. The
service group can have member subscriptions, resource groups, resources, or other service groups.

To learn more about service groups and how to manage your service group hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with service groups](manage-service-groups.md)

