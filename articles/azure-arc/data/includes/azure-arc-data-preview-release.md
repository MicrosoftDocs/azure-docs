---
author: jkleinschnitz-msft
ms.author: jameskl
ms.service: azure-arc
ms.topic: include
ms.date: 12/7/2022
---

<!---
At this time, a test or preview build is not available for the next release.
--->

Feb 2023 test release is now available.

|Component|Value|
|-----------|-----------|
|Container images registry/repository |`mcr.microsoft.com/arcdata/test`|
|Container images tag |`v1.16.0_2023-02-14 `|
|**CRD names and version:**| |
|`activedirectoryconnectors.arcdata.microsoft.com`| v1beta1, v1beta2, v1|
|`datacontrollers.arcdata.microsoft.com`| v1beta1, v1 through v6|
|`exporttasks.tasks.arcdata.microsoft.com`| v1beta1, v1, v2|
|`failovergroups.sql.arcdata.microsoft.com`| v1beta1, v1beta2, v1, v2|
|`kafkas.arcdata.microsoft.com`| v1beta1, v1beta2, v1beta3|
|`monitors.arcdata.microsoft.com`| v1beta1, v1, v2|
|`postgresqls.arcdata.microsoft.com`| v1beta1, v1beta2, v1beta3, v1beta4|
|`postgresqlrestoretasks.tasks.postgresql.arcdata.microsoft.com`| v1beta1|
|`redis.arcdata.microsoft.com`| v1beta1, v1beta2|
|`sqlmanagedinstances.sql.arcdata.microsoft.com`| v1beta1, v1 through v10|
|`sqlmanagedinstancerestoretasks.tasks.sql.arcdata.microsoft.com`| v1beta1, v1|
|`sqlmanagedinstancereprovisionreplicatask.tasks.sql.arcdata.microsoft.com`| v1beta1|
|`sqlmanagedinstancemonitoringprofiles.arcdata.microsoft.com`| v1beta1, v1beta2|
|`telemetrycollectors.arcdata.microsoft.com`  *use to be otelcollectors*| v1beta1, v1beta2, v1beta3, v1beta4|
|`telemetryrouters.arcdata.microsoft.com`| v1beta1, v1beta2, v1beta3, v1beta4, v1beta4, v1beta5|
|Azure Resource Manager (ARM) API version|2022-06-15-preview|
|`arcdata` Azure CLI extension version|1.4.11 ([Download](https://aka.ms/az-cli-arcdata-ext))|
|Arc-enabled Kubernetes helm chart extension version|1.16.0|
|Azure Arc Extension for Azure Data Studio<br/>`arc`<br/>`azcli`|<br/>1.8.0 ([Download](https://aka.ms/ads-arcdata-ext))</br>1.8.0 ([Download](https://aka.ms/ads-azcli-ext))|

**New for this release:**

- Arc PostgreSQL | Automated Backups
- Arc PostgreSQL | Settings via configuration framework
- Arc PostgreSQL | Point-in-Time Restore
- Arc PostgreSQL | Turn backups on/off
- Arc PostgreSQL | Require client connections to use SSL
- Arc PostgreSQL | Active Directory |  Customer-managed bring your own keytab
- Arc PostgreSQL | Active Directory | Configure in Azure command line client
- Arc PostgreSQL | Enable Extensions via Kubernetes Custom Resource Definition
- Arc SQL MI | Service-Managed Transparent Data Encryption | Preview
- Arc SQL MI | Service-Managed Credential Rotation | Preview
- Arc Data Services | Initial Extended Events Functionality | Preview
- Arc Data Services | Arc SQL MI | Backups | Produce automated backups from readable secondary
    - The built-in automatic backups are performed on secondary replicas when available.


**Customer reported issues addressed**
- Azure CLI Extension | Optional imageTag for controller creation by defaulting to the image tag of the bootstrapper
