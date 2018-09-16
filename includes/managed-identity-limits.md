---
 title: include file
 description: include file
 services: active-directory
 author: daveba
 ms.service: active-directory
 ms.component: msi
 ms.topic: include
 ms.date: 05/31/2018
 ms.author: daveba
 ms.custom: include file
---

| Category | Limit |
| --- | --- |
| User assigned managed identities | <ul><li>When creating user assigned managed identities, only alphanumeric characters (0-9, a-z, A-Z) and the hyphen (-) are supported. Additionally, the name should be limited to 24 characters in length for the assignment to VM/VMSS to work properly.</li><li>If using the managed identity virtual machine extension, the supported limit is 32 user assigned managed identities.  Without the managed identity virtual machine extension, the supported limit is 512 user assigned identities.</li>|

