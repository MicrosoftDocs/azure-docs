---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: azure-resource-manager
 ms.topic: include
 ms.date: 02/16/2018
 ms.author: tomfitz
 ms.custom: include file
---

Resource locks prevent users in your organization from accidentally deleting or modifying critical resources. Unlike role-based access control, resource locks apply a restriction across all users and roles. 

You can set the lock level to **CanNotDelete** or **ReadOnly**. In the portal, the locks levels are displayed as **Delete** and **Read-only** respectively.

* **CanNotDelete** means authorized users can still read and modify a resource, but they can't delete the resource. 
* **ReadOnly** means authorized users can read a resource, but they can't delete or update the resource. Applying this lock is similar to restricting all authorized users to the permissions granted by the **Reader** role. 

> [!TIP]
> Be careful when applying a **ReadOnly** lock. Some operations that seem like read operations actually require additional actions. For example, a **ReadOnly** lock on a storage account prevents all users from listing the keys. The list keys operation is handled through a POST request because the returned keys are available for write operations. A **ReadOnly** lock on an App Service resource prevents Visual Studio Server Explorer from displaying files for the resource because that interaction requires write access.

When you apply a lock at a parent scope, all resources within that scope inherit the same lock. Even resources you add later inherit the lock from the parent. The most restrictive lock in the inheritance takes precedence.

Resource Manager locks apply only to operations that happen in the management plane, which consists of operations sent to `https://management.azure.com`. The locks don't restrict how resources process their own functions. Resource changes are restricted, but resource operations aren't restricted. For example, a ReadOnly lock on a SQL Database prevents you from deleting or modifying the database. It doesn't prevent you from creating, updating, or deleting data in the database. Data transactions are allowed because those operations are not sent to `https://management.azure.com`.

### Who can create or delete locks in your organization
To create or delete management locks, you must have access to `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only **Owner** and **User Access Administrator** are granted those actions.
