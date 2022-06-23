---
author: MikeRayMSFT
ms.service: azure-arc
ms.topic: include
ms.date: 06/28/2022
ms.author: mikeray
---

The current preview released on June 28, 2022.

This preview is a test release.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.8.0_2022-06-14`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|ARM API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.2 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.2.19831003|
|Arc Data extension for Azure Data Studio|1.3.0 (No change)([Download](https://aka.ms/ads-arcdata-ext))|

New for this release:

- Miscellaneous
  - Canada Central and West US 3 regions are fully supported.

- Arc enabled SQL Managed Instance
  - You can now configure a SQL managed instance to use an AD Connector at the time the SQL managed instance is provisioned from the Azure portal.
  - BACKUP DATABASE TO URL to AWS S3 or S3-compatible storage is now supported.  [Documentation](/sql/relational-databases/backup-restore/sql-server-backup-and-restore-with-s3-compatible-object-storage)
  - `az sql mi-arc create` and `update` commands have a new `--sync-secondary-commit` parameter. This parameter is the number of secondary replicas that must be synchronized to fail over.  Default is "-1" which will set the number of required synchronized secondaries to "(# of replicas - 1) / 2".  Allowed values: -1, 1, 2.  Arc SQL MI custom resource property added called `syncSecondaryToCommit`.
  - Billing estimate in Azure portal is updated to reflect the number of readable secondaries that are selected.
  - Added SPNs for readable secondary service


- Data Controller
  - Control DB SQL instance version is upgraded to latest version
  - Additional compatibility checks are run prior to executing an upgrade request
  - Upload status is now shown in the DC list view in the Azure portal
  - Show the usage upload message value in the Overview blade banner in the Azure portal if the value isn't "Success"

