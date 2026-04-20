---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 10/24/2025
ms.author: anfdocs

# elastic-customer-managed-keys.md
# configure-customer-managed-keys.md
---


* For increased security, select the **Disable public access** option within the network settings of your key vault. When selecting this option, you must also select **Allow trusted Microsoft services to bypass this firewall** to permit the Azure NetApp Files service to access your encryption key.
* Customer-managed keys support automatic Managed System Identity (MSI) certificate renewal. If your certificate is valid, you don't need to manually update it. 
* Do not make any changes to the underlying Azure Key Vault or Azure Private Endpoint after creating a customer-managed keys volume. Making changes can make the volumes inaccessible. If you must make changes, see [Update the private endpoint IP for customer-managed keys](../configure-customer-managed-keys.md#update-the-private-endpoint).
* If Azure Key Vault becomes inaccessible, Azure NetApp Files loses its access to the encryption keys and the ability to read or write data to volumes enabled with customer-managed keys. In this situation, create a support ticket to have access manually restored for the affected volumes.
* Azure NetApp Files supports customer-managed keys on source and data replication volumes with cross-region replication or cross-zone replication relationships.
* Applying Azure network security groups (NSG) on the private link subnet to Azure Key Vault is supported for Azure NetApp Files customer-managed keys. NSGs don’t affect connectivity to private links unless a private endpoint network policy is enabled on the subnet.
* Wrap/unwrap is not supported. Customer-managed keys uses encrypt/decrypt. For more information, see [RSA algorithms](/azure/key-vault/keys/about-keys-details#rsa-algorithms).