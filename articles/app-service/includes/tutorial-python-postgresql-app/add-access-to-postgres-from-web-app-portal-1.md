---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.azure.devx-azure-tooling: ['azure-portal']
ms.custom: devx-track-python
---

Add a rule to allow your web app to access the PostgreSQL Flexible server.

1. In the left resource page for the server, select **Networking**.

1. Select the checkbox next to **Allow public access from any Azure service within Azure to this server**.

1. Select **Save** to save the change.

To further secure communication between production web apps and database servers, you should use an
[Azure Virtual Network](../../../virtual-network/virtual-networks-overview.md).