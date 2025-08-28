---
author: PerfectChaos
ms.author: chaoschhapi
ms.date: 08/22/2025
ms.topic: include
ms.service: azure-operator-nexus
---

To access the output of a command, users need the appropriate access to the storage blob, including both having the necessary Azure role assignments and ensuring that any networking restrictions are properly configured. 

For role assignments, a user must have the following role assignments on the blob container or its Storage Account:

- A data access role, such as **Storage Blob Data Reader** or **Storage Blob Data Contributor**
- The Azure Resource Manager **Reader** role, at a minimum

For information on assigning roles to storage accounts, see [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal). 

For networking restrictions, if the Storage Account allows public endpoint access via a firewall, the firewall must be configured with a networking rule to allow that user's IP address through. If it allows only private endpoint access, a user must be part of a network that has access to the private endpoint.

For information on allowing access through the storage account firewall using [networking rules](/azure/storage/common/storage-network-security) or [private endpoints](/azure/storage/common/storage-private-endpoints), see the respective documentation.
