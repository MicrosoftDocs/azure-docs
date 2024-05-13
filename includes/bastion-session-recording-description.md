---
author: cherylmc
ms.author: cherylmc
ms.date: 04/30/2024
ms.service: bastion
ms.topic: include

---
When the Azure Bastion **Session recording** feature is enabled, you can record the graphical sessions for connections made to virtual machines (RDP and SSH) via the bastion host. After the session is closed or disconnected, recorded sessions are stored in a blob container within your storage account (via SAS URL). When a session is disconnected, you can access and view your recorded sessions in the Azure portal on the Session Recording page. Session recording requires the Bastion Premium SKU.