---
 title: include file
 description: include file
 author: jonels-msft
 ms.service: cosmos-db
 ms.subservice: postgresql
 ms.topic: include
 ms.date: 10/15/2021
 ms.author: jonels
ms.custom: include file, ignite-2022
---

Azure Cosmos DB for PostgreSQL supports three networking options:

* No access
  * This is the default for a newly created cluster if public or private access is not enabled. No computers, whether inside or outside of Azure, can connect to the database nodes.
* Public access
  * A public IP address is assigned to the coordinator node.
  * Access to the coordinator node is protected by firewall.
  * Optionally, access to all worker nodes can be enabled. In this case, public IP addresses are assigned to the worker nodes and are secured by the same firewall.
* Private access
  * Only private IP addresses are assigned to the cluster’s nodes.
  * Each node requires a private endpoint to allow hosts in the selected virtual network to access the nodes.
  * Security features of Azure virtual networks such as network security groups can be used for access control.

When you create a cluster, you may enable public or private access, or opt for the default of no access. Once the cluster is created, you can choose to switch between public or private access, or activate them both at once.
