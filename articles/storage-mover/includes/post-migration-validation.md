---
author: stevenmatthew
ms.author: shaas
ms.topic: include
ms.date: 09/15/2026
ms.service: azure-storage-mover
---
<!-- 
!########################################################

ATTENTION: 
This is an include for several Storage Mover articles.
Handle file and content with care.

!########################################################
-->

## Post-migration validation

Validate migrated data before you begin consuming the newly migrated data or retiring the Azure resources located at the source. This validation process verifies data integrity and consistency by comparing migrated data to the same data from the source. The process also assures that your data is accurate and that the transfer from Azure Blob container is complete.

Validation helps identify and resolve discrepancies, ensuring the migrated data is reliable and meets your business requirements. You can choose to conduct user acceptance tests to further confirm functionality and ensure the migrated data meets your integrity, completeness, and business requirements.

Follow the steps in this section to complete manual validation.

- Compare the source and target within the migrated scope. Check the expected blob inventory, sizes, and application-relevant properties. Use content validation where your workload requires it.
- Review any failures or skipped items in the job results and available logs. Investigate discrepancies before declaring the migration complete.
- Test applications against the target container to confirm that the migrated data is usable.
- If source data changed during migration, plan a final run and an application cutover window. A job definition doesn't create a continuously running synchronization schedule; explicitly start another run when required.
- Retain the source data until migration and application validation are complete and your retention requirements are met. Delete source data only through a separately approved cleanup operation.
- After all required runs are complete, review migration-specific role assignments and endpoint access. Remove access and resources that are no longer needed according to your organization's policies.
- Enable incremental sync if you need to keep Azure Blob containers in sync over time.
- Delete the source Azure Blob container only after migration is fully complete and verified.