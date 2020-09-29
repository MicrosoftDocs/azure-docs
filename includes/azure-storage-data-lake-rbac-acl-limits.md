---
 services: storage
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 09/29/2020
 ms.author: normesta
 ms.custom: include file
---

|Authorization mechanism|RBAC role assignments|ACL|
|---|---|---|
|Scope|Storage accounts, containers. Cross resource RBAC role assignments at subscription or resource group level.|Files, directories|
|Limits|2000 RBAC role assignments in a subscription|32 ACL entries (effectively 28 ACL entries) per file, 32 ACL entries (effectively 28 ACL entries) per directory, default and access ACL entries each.|
|Supported level of permission|Built-in RBAC roles or custom RBAC roles|ACL permission|