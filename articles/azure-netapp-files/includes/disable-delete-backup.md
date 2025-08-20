---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 02/13/2025
ms.author: anfdocs
ms.custom:
  - include file
  - build-2025

# backup-configure-policy-based.md
# backup-configure-manual.md
# see also backup-requirements-considerations.md
# see also azure-netapp-files-quickstart-set-up-account-create-volumes.md
# Customer intent: "As a cloud resource manager, I want to delete backups before removing a resource group or subscription, so that I can ensure all associated data is properly managed and deleted."
---

If you need to delete a resource group or subscription that contains backups, you should delete any backups first. Deleting the resource group or subscription doesn't delete the backups. [You can delete backups by manually](../backup-delete.md).

