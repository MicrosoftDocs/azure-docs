---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 06/12/2024
ms.author: msmbaldwin
# To inform users about Azure Key Vault's data replication strategy using zone redundant storage (ZRS) and the additional capability to manually replicate vault contents to another region through the backup and restore feature.

---

For [non-paired Azure regions](/azure/reliability/cross-region-replication-azure#regions-with-availability-zones-and-no-region-pair), as well as the Brazil South and West US 3 regions, Azure Key Vault uses zone redundant storage (ZRS) to replicate your data three times within the region, across independent availability zones. For Azure Key Vault Premium, two of the three zones are used to replicate the hardware security module (HSM) keys. 

You can also use the [backup and restore](/azure/key-vault/general/backup) feature to replicate the contents of your vault to another region of your choice.
