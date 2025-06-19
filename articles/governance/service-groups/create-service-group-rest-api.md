---
title: "Quickstart: Create a service group with REST API - Azure Governance"
description: In this quickstart, you use REST API to create a service group to organize your resources.
author: rthorn17
ms.author: rithorn
ms.service: azure-policy
ms.topic: quickstart  
ms.date: 5/19/2025
ms.custom:
  - build-2025
---


# Quickstart: Create a service group (preview) with REST API
 
With Azure Service Groups (preview) you can create low-privilege-based groupings of resources across subscriptions. They provide a way to manage resources with minimal permissions, ensuring that resources can be grouped and managed without granting excessive access. Service Groups are designed to complement existing organizational structures like Resource Groups, Subscriptions, and Management Groups by offering a flexible and secure way to aggregate resources for specific purposes. For more information on service groups, see [Getting started with Service Groups](overview.md).

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

In this example, the service group **groupId** is
_Contoso_.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/serviceGroups/Contoso?api-version=2024-02-01-preview
  ```

- Request Body

The **groupId** is a unique identifier being created. This ID is used by other commands to reference
this group and it can't be changed later.

If you want the service group to show a different name within the Azure portal, add the
**properties.displayName** property in the request body. For example, to create a service group
with the **groupId** of _Contoso_ and the display name of _Contoso Group_, use the following
endpoint and request body:

```json
{
  "properties": {
    "displayName": "_Contoso Group_",
    "parent": {
      "resourceId": "/providers/Microsoft.Management/serviceGroups/[tenantId]"
    }
  }
}
```


In the preceding examples, the new service group is created under the root service group. To
specify a different service group as the parent, use the **properties.parent.id** property.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/serviceGroups/Contoso?api-version=2024-02-01-preview
  ```

- Request Body

  ```json
  {
    "properties": {
      "displayName": "Contoso Group",
      "parent": {
        "id": "/providers/Microsoft.Management/serviceGroups/HoldingGroup"
      }
    }
  }
  ```

## Verify your Service Group was created
Service Groups PUT or create call is an Asynchronous call which means that the response to the initial create call is that it was accepted. This response doesn't mean the service group was successfully created, only that the Azure successfully received the request to create the service group.  

To check the operation was successful, you should do a GET call on the value returned in the **azure-asyncoperation** header. The URL provides the status of the created operation. 

> [!NOTE]
> To avoid issues within scripts or templates, the automation should poll this provided URL before moving to the next step. 
> If the automation moves to the next step before the operation has responded successfully, the next operation will fail as the service group has not been created.  

## Clean up resources

To remove the service group created in this document, use the
Service Group Delete endpoint:    

- REST API URI

  ```http
  DELETE https://management.azure.com/providers/Microsoft.Management/serviceGroups/Contoso?api-version=2024-02-01-preview
  ```

- No Request Body

## Related content
* [What are Azure Service Groups?](overview.md)
* [How to Manage Service Groups](manage-service-groups.md)
* [Connect service group members with REST API](create-service-group-member-rest-api.md)
