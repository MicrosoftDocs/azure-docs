---
title: Azure Arc-enabled data services - Pre-release testing
description: Experience pre-release versions of Azure Arc-enabled data services
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 06/14/2022
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurecli, event-tier1-build-2022
#Customer intent: As a data professional, I want to validate upcoming releases.
---

# Pre-release testing

To provide an opportunity for customers and partners to provide pre-release feedback, pre-release versions of Azure Arc-enabled data services are made available on a predictable schedule. This article describes how to install pre-release versions of Azure Arc-enabled data services and provide feedback to Microsoft.

## Pre-release testing schedule

Each month, Azure Arc-enabled data services is released on the second Tuesday of the month, commonly known as "Patch Tuesday".  The pre-release versions are made available on a predictable schedule in alignment with that release date.

- 14 days before the release date, the *test* pre-release version is made available.
- 7 days before the release date, the *preview* pre-release version is made available.

The main difference between the test and preview pre-release versions is typically just quality and stability, but in some exceptional cases there may be new features introduced in between the test and preview releases.

Pre-release version binaries are typically made available starting around 10:00 AM Pacific Time (UTC - 9) and documentation is published around 4 PM Pacific Time.

## Artifacts for a pre-release version

For each pre-release version, there will typically be the following artifacts which are designed to work together:

- Container images hosted on the Microsoft Container Registry (MCR)
  - `mcr.microsoft.com/arcdata/preview` is the repository that hosts the **preview** pre-release builds
  - `mcr.microsoft.com/arcdata/test` is the repository that hosts the **test** pre-release builds
  
    > [!NOTE]
    > `mcr.microsoft.com/arcdata/` will continue to be the repository that hosts the final release builds.
    >Pre-release images will be tagged in a format similar to release images, but with the addition of a git commit ID appended to the end:
    > - Release version tag example: v1.0.0_2021-06-30
    > - Pre-release version tag example: v1.8.0_2022-06-07_5ba6b837

  - Azure CLI extension hosted on Azure Blob Storage
  - Azure Data Studio extension hosted on Azure Blob Storage

In addition to the above installable artifacts, the following are updated in Azure as needed:

- New version of ARM API (occasionally)
- New Azure portal accessible via a special URL query string parameter (see below for details)
- New Arc-enabled Kubernetes extension version for Arc-enabled data services (applies to direct connectivity mode only)
- Documentation updates on this page describing the location and details of the above artifacts and the new features available and any pre-release "read me" documentation

## Installing pre-release versions

### Install prerequisite tools

To install a pre-release version, please follow these pre-requisite instructions:

If you use the Azure CLI extension:

- Uninstall the Azure CLI extension (`az extension remove -n arcdata`).
- Download the latest pre-release Azure CLI extension `.whl` file from [https://aka.ms/az-cli-arcdata-ext](https://aka.ms/az-cli-arcdata-ext).
- Install the latest pre-release Azure CLI extension (`az extension add -s <location of downloaded .whl file>`).

If you use the Azure Data Studio extension to install:

- Uninstall the Azure Data Studio extension. Select the Extensions panel and select on the **Azure Arc** extension, select **Uninstall**.
- Download the latest pre-release Azure Data Studio extension .vsix file from [https://aka.ms/ads-arcdata-ext](https://aka.ms/ads-arcdata-ext).
- Install the extension by choosing File -> Install Extension from VSIX package and then browsing to the download location of the .vsix file.

### Install using Azure CLI

> [!NOTE]
> Deploying pre-release builds using direct connectivity mode from Azure CLI is not supported.

#### Indirect connectivity mode

If you install using the Azure CLI, please follow the instructions to [create a custom configuration profile](create-custom-configuration-template.md). Once created, edit this custom configuration profile file enter the `docker` property values as required based on the information provided in the version history table on this page.

Example:

```json

        "docker": {
            "registry": "mcr.microsoft.com",
            "repository": "arcdata/test",
            "imageTag": "v1.8.0_2022-06-07_5ba6b837",
            "imagePullPolicy": "Always"
        },
```

Once the file is edited, use the command `az arcdata dc create` as explained in [create a custom configuration profile](create-custom-configuration-template.md).

### Install using Azure Data Studio

> [!NOTE]
> Deploying pre-release builds using direct connectivity mode from Azure Data Studio is not supported.

#### Indirect connectivity mode

If you use Azure Data Studio to install, complete the data controller deployment wizard as normal except click on **Script to notebook** at the end instead of **Deploy**. In the generated notebook, edit the `Set variables` cell to *add* the following lines:

```python
# choose between arcdata/test or arcdata/preview as appropriate
os.environ["AZDATA_DOCKER_REPOSITORY"] = "arcdata/test"
os.environ["AZDATA_DOCKER_TAG"] = "v1.8.0_2022-06-07_5ba6b837"
```

Run the notebook by clicking **Run All**.

### Install using Azure portal

Follow the instructions to [Arc-enabled the Kubernetes cluster](create-data-controller-direct-prerequisites.md) as normal.

Open the Azure portal by using this special URL: [https://portal.azure.com/?Microsoft_Azure_HybridData_Platform=BugBash](https://portal.azure.com/?Microsoft_Azure_HybridData_Platform=BugBash).

Follow the instructions to [Create the Azure Arc data controller from Azure portal - Direct connectivity mode](create-data-controller-direct-azure-portal.md) except that when choosing a deployment profile, select **Custom template** in the **Kubernetes configuration template** drop-down.  Set the repository to either `arcdata/test` or `arcdata/preview` as appropriate and enter the desired tag in the **Image tag** field.  Fill out the rest of the custom cluster configuration template fields as normal.

Complete the rest of the wizard as normal.

When you deploy with this method, the most recent pre-release version will always be used.

## Pre-release version history

### June 7, 2022 (Preview)

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
  - `az sql mi-arc create` and `update` commands have a new `--sync-secondary-commit` parameter which is the number of secondary replicas that must be synchronized to fail over.  Default is "-1" which will set the number of required synchronized secondaries to "(# of replicas - 1) / 2".  Allowed values: -1, 1, 2.  Arc SQL MI custom resource property added called `syncSecondaryToCommit`.
  - Billing estimate in Azure portal is updated to reflect the number of readable secondaries that are selected.
  - Added SPNs for readable secondary service

- Data Controller
  - Control DB SQL instance version is upgraded to latest version
  - Additional compatibility checks are run prior to executing an upgrade request
  - Upload status is now shown in the DC list view in the Azure portal
  - Show the usage upload message value in the Overview blade banner in the Azure portal if the value is not "Success"

## Provide feedback

At this time, pre-release testing is supported for certain customers and partners that have established agreements with Microsoft and points of contact on the product engineering team.  Please email your points of contact with any issues that are found during pre-release testing.

## Next steps

[Release notes - Azure Arc-enabled data services](release-notes.md)