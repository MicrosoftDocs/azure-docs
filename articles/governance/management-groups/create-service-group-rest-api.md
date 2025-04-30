---
title: Quickstart: Create a service group with REST API
description: In this quickstart, you use REST API to create a service group to organize your resources.
author: rthorn17
ms.author: rithorn
ms.service: Azure Service Groups
ms.topic: quickstart  #Don't change
ms.date: 5/19/2025
---


# Quickstart: Create a service group with REST API
 
Service groups in Azure are a low-privilege-based grouping of resources across subscriptions. They provide a way to manage resources with minimal permissions, ensuring that resources can be grouped and managed without granting excessive access. Service Groups are designed to complement existing organizational structures like Resource Groups, Subscriptions, and Management Groups by offering a flexible and secure way to aggregate resources for specific purposes. For more information on service groups, see [Getting started with Service Groups](overview.md).



## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- If you haven't already, install [ARMClient](https://github.com/projectkudu/ARMClient). It's a tool
  that sends HTTP requests to Azure Resource Manager-based REST APIs.

## Create in REST API

For REST API, use the
[Service Groups - Create or Update]()
endpoint to create a new service group. In this example, the service group **groupId** is
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
Service Groups PUT or create call is an Asynchronous call which means that the response to the initial create call is a HTTP status code 201: Accepted. This doesn't mean the Service group was successfully created, only that the Azure successfully received the request to create the Service Group.  

To check the operation was successful, you should do a GET call on the value returned in the **azure-asyncoperation** header.  The URL provided will provide the status of the create operation. 

> ![NOTE]
> To avoid issues within scripts or templates, the automation should poll this provided URL before moving to the next step. If the automation moves to the next step before the operation has responded successful, the next operation will fail as the Service Group has not been created.  

## Clean up resources

To remove the service group created above, use the
[Management Groups - Delete]() endpoint:

- REST API URI

  ```http
  DELETE https://management.azure.com/providers/Microsoft.Management/serviceGroups/Contoso?api-version=2024-02-01-preview
  ```

- No Request Body


## Next step -or- Related content

In this quickstart, you created a service group to help create different views in Azure. The
service group can have member subscriptions, resource groups, resources, or other service groups.

To learn more about service groups and how to manage your service group hierarchy, continue to:

> [!div class="nextstepaction"]
> [Manage your resources with service groups]()


-or-

- [Related article title](link.md)
- [Related article title](link.md)
- [Related article title](link.md)