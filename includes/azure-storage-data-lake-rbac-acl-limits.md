---
 services: storage
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 09/29/2020
 ms.author: normesta
 ms.custom: include file
---

| Mechanism | Scope |Limits | Supported level of permission |
|---|---|---|---|
| Azure RBAC | Storage accounts, containers. <br>Cross resource Azure role assignments at subscription or resource group level. | 4000 Azure role assignments in a subscription | Azure roles (built-in or custom) |
| ACL| Directory, file |32 ACL entries (effectively 28 ACL entries) per file and per directory. Access and default ACLs each have their own 32 ACL entry limit. |ACL permission|
