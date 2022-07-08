---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 07/12/2022
---

At this time, a test or preview build is not available for the next release.

<!---

The current preview released on July 05, 2022.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/preview`|
|Container images tag |`v1.9.0_2022-07-12`|
|CRD names and version|`datacontrollers.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`exporttasks.tasks.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`kafkas.arcdata.microsoft.com`: v1beta1<br/>`monitors.arcdata.microsoft.com`: v1beta1, v1, v2<br/>`sqlmanagedinstances.sql.arcdata.microsoft.com`: v1beta1, v1 through v6<br/>`postgresqls.arcdata.microsoft.com`: v1beta1, v1beta2<br/>`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`: v1beta1, v1<br/>`failovergroups.sql.arcdata.microsoft.com`: v1beta1, v1beta2, v1<br/>`activedirectoryconnectors.arcdata.microsoft.com`: v1beta1, v1beta2<br/>|
|Azure Resource Manager (ARM) API version|2022-03-01-preview (No change)|
|`arcdata` Azure CLI extension version|1.4.3 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc enabled Kubernetes helm chart extension version|1.2.20031002|
|Arc Data extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.3.0 ([Download](https://azuredatastudioarcext.blob.core.windows.net/stage/arc-1.3.0.vsix))</br>1.3.0 ([Download](https://azuredatastudioarcext.blob.core.windows.net/stage/azcli-1.3.0.vsix))|

New for this release:

- Miscellaneous
  - Extended the disk metrics reported in monitoring dashboards to include more queue length stats and more counters for IOPS. All disks are in scope for data collection that start with `vd` or `sd` now.

- Arc-enabled SQL Managed Instance
  - Added buffer cache hit ratio to collectd and surface it in monitoring dashboards.
  - Improvements to the formatting of the legends on some dashboards.
  - Added process level CPU  and memory metrics to the monitoring dashboards for the SQL managed instance process.
  - syncSecondaryToCommit property is now available to be viewed and edited in Azure portal and Azure Data Studio.
  - Added ability to set the DNS name for the readableSecondaries service in Azure CLI and Azure portal.
  - Now collecting the agent.log, security.log and sqlagentstartup.log for Arc-enabled SQL Managed instance to ElasticSearch so they're searchable via Kibana and optionally uploading them to Azure Log Analytics.
  - There are more additional notifications when provisioning new SQL managed instances is blocked due to not exporting/uploading billing data to Azure.

- Data controller
  - Permissions required to deploy the Arc data controller have been reduced to a least-privilege level.
  - When deployed via the Azure CLI, the Arc data controller is now installed via a K8s job that uses a helm chart to do the installation. There's no change to the user experience.

  --->