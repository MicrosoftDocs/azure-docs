---
title: Azure Arc-enabled data services - Pre-release testing
description: Experience pre-release versions of Azure Arc-enabled data services
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 09/07/2022
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

Normally, the main difference between the test and preview pre-release versions is quality and stability, but in some exceptional cases there may be new features introduced in between the test and preview releases.

Normally, pre-release version binaries are available around 10:00 AM Pacific Time. Documentation follows later in the day.

## Artifacts for a pre-release version

Pre-release versions simultaneously release with artifacts, which are designed to work together:

- Container images hosted on the Microsoft Container Registry (MCR)
  - `mcr.microsoft.com/arcdata/preview` is the repository that hosts the **preview** pre-release builds
  - `mcr.microsoft.com/arcdata/test` is the repository that hosts the **test** pre-release builds
  
    > [!NOTE]
    > `mcr.microsoft.com/arcdata/` will continue to be the repository that hosts the final release builds.
    
  - Azure CLI extension hosted on Azure Blob Storage
  - Azure Data Studio extension hosted on Azure Blob Storage

In addition to the above installable artifacts, the following are updated in Azure as needed:

- New version of ARM API (occasionally)
- New Azure portal accessible via a special URL query string parameter (see below for details)
- New Arc-enabled Kubernetes extension version for Arc-enabled data services (applies to direct connectivity mode only)
- Documentation updates on this page describing the location and details of the above artifacts and the new features available and any pre-release "read me" documentation

## Installing pre-release versions

### Install prerequisite tools

To install a pre-release version, follow these pre-requisite instructions:

If you use the Azure CLI extension:

- Uninstall the Azure CLI extension (`az extension remove -n arcdata`).
- Download the latest pre-release Azure CLI extension `.whl` file from the link in the [Current preview release information](#Current preview release information)
- Install the latest pre-release Azure CLI extension (`az extension add -s <location of downloaded .whl file>`).

If you use the Azure Data Studio extension to install:

- Uninstall the Azure Data Studio extension. Select the Extensions panel and select on the **Azure Arc** extension, select **Uninstall**.
- Download the latest pre-release Azure Data Studio extension .vsix files from the links in the [Current preview release information](#Current preview release information)
- Install the extensions by choosing File -> Install Extension from VSIX package and then browsing to the download location of the .vsix files. Install the `azcli` extension first and then `arc`.

### Install using Azure CLI

> [!NOTE]
> Deploying pre-release builds using direct connectivity mode from Azure CLI is not supported.

#### Indirect connectivity mode

If you install using the Azure CLI:

1. Follow the instructions to [create a custom configuration profile](create-custom-configuration-template.md). 
1. Edit this custom configuration profile file. Enter the `docker` property values as required based on the information provided in the version history table on this page.

   For example:

   ```json

           "docker": {
               "registry": "mcr.microsoft.com",
               "repository": "arcdata/test",
               "imageTag": "v1.8.0_2022-06-07_5ba6b837",
               "imagePullPolicy": "Always"
           },
   ```

1. Use the command `az arcdata dc create` as explained in [create a custom configuration profile](create-custom-configuration-template.md).

#### Direct connectivity mode

If you install using the Azure CLI:

1. Follow the instructions to [create a custom configuration profile](create-custom-configuration-template.md). 
1. Edit this custom configuration profile file. Enter the `docker` property values as required based on the information provided in the version history table on this page.

   For example:

   ```json

           "docker": {
               "registry": "mcr.microsoft.com",
               "repository": "arcdata/test",
               "imageTag": "v1.8.0_2022-06-07_5ba6b837",
               "imagePullPolicy": "Always"
           },
   ```
1. Set environment variables for:

   - `ARC_DATASERVICES_EXTENSION_VERSION_TAG`: Use the version of the **Arc enabled Kubernetes helm chart extension version** from the release details under [Current preview release information](#current-preview-release-information).
   - `ARC_DATASERVICES_EXTENSION_RELEASE_TRAIN`: `preview`

   For example, the following command sets the environment variables on Linux.

   ```console
   export ARC_DATASERVICES_EXTENSION_VERSION_TAG='1.2.20031002'
   export ARC_DATASERVICES_EXTENSION_RELEASE_TRAIN='preview'
   ```

   The following command sets the environment variables on PowerShell

   ```console
   $ENV:ARC_DATASERVICES_EXTENSION_VERSION_TAG="1.2.20031002"
   $ENV:ARC_DATASERVICES_EXTENSION_RELEASE_TRAIN="preview"
   ```

1. Run `az arcdata dc create` as normal for the direct mode to:

   - Create the extension, if it doesn't already exist
   - Create the custom location, if it doesn't already exist
   - Create data controller

   For details see, [create a custom configuration profile](create-custom-configuration-template.md).

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

Open the Azure portal by using this special URL: [https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_HybridData_Platform=preview#home](https://portal.azure.com/?feature.canmodifystamps=true&Microsoft_Azure_HybridData_Platform=preview#home).

Follow the instructions to [Create the Azure Arc data controller from Azure portal - Direct connectivity mode](create-data-controller-direct-azure-portal.md) except that when choosing a deployment profile, select **Custom template** in the **Kubernetes configuration template** drop-down.  Set the repository to either `arcdata/test` or `arcdata/preview` as appropriate and enter the desired tag in the **Image tag** field.  Fill out the rest of the custom cluster configuration template fields as normal.

Complete the rest of the wizard as normal.

When you deploy with this method, the most recent pre-release version will always be used.

## Current preview release information

[!INCLUDE [azure-arc-data-preview-release](includes/azure-arc-data-preview-release.md)]

## Provide feedback

At this time, pre-release testing is supported for certain customers and partners that have established agreements with Microsoft. Participants have points of contact on the product engineering team. Email your points of contact with any issues that are found during pre-release testing.

## Next steps

[Release notes - Azure Arc-enabled data services](release-notes.md)
