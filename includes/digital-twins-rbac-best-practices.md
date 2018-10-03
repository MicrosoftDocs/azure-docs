---
 title: include file
 description: include file
 services: azure-digital-twins
 author: adamgerard
 ms.service: azure-digital-twins
 ms.topic: include
 ms.date: 09/27/2018
 ms.author: adgera
 ms.custom: include file
---

Role-Based Access Control is an inheritance-driven security strategy for managing access, permissions, and roles. Descendent roles inherit permissions from parent roles. Permissions may also be assigned without being inherited from a parent role. They can also be assigned to customize a role as needed.

For example, a **Space Administrator** may need global access to run all operations for a specified space (including all nodes underneath or within it) whereas a **Device Installer** may only need *read* and *update* permissions for devices and sensors.

In every case, roles should be granted **exactly and no more than the access required** to fulfill their tasks per the **Principle of Least Privilege**, which grants an identity *only*:

* The amount of access needed to complete its job.
* A role appropriate and limited to carrying out its job.

>[!IMPORTANT]
> **Always follow the Principle of Least Privilege**.

Two other important Role-Based Access Control practices to follow:

> [!div class="checklist"]
> * Periodically audit role assignments to verify that each role has the correct permissions.
> * Roles and assignments should be cleaned-up as individuals change roles or assignments.