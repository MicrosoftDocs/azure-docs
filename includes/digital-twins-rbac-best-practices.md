---
 title: include file
 description: include file
 services: digital-twins
 ms.author: alinast
 author: alinamstanciu
 manager: bertvanhoof
 ms.service: digital-twins
 ms.topic: include
 ms.date: 01/15/2020
 ms.custom: include file
---

Role-based access control is an inheritance-driven security strategy for managing access, permissions, and roles. Descendent roles inherit permissions from parent roles. Permissions also can be assigned without being inherited from a parent role. They also can be assigned to customize a role as needed.

For example, a Space Administrator might need global access to run all operations for a specified space. Access includes all nodes underneath or within the space. A Device Installer might need only *read* and *update* permissions for devices and sensors.

In every case, roles are granted *exactly and no more than the access required* to fulfill their tasks per the Principle of Least Privilege. According to this principle, an identity is granted *only*:

* The amount of access needed to complete its job.
* A role appropriate and limited to carrying out its job.

>[!IMPORTANT]
> Always follow the Principle of Least Privilege.

Two other important role-based access control practices to follow:

> [!div class="checklist"]
> * Periodically audit role assignments to verify that each role has the correct permissions.
> * Clean up roles and assignments when individuals change roles or assignments.