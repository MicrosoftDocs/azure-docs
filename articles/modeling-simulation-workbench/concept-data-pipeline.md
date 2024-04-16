---
title: "Data pipeline: Azure Modeling and Simulation Workbench"
description: Overview of Azure Modeling and Simulation Workbench data pipeline component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the data pipeline component.
---

# Data pipeline: Azure Modeling and Simulation Workbench

For the Azure Modeling and Simulation Workbench user, getting data into and out of the chamber is done through the data pipeline. Since the chamber is secure and isolated from the public network, no direct method is provided to copy data into and out of the chamber.

The data pipeline enables users to bring data into the [chamber](./concept-chamber.md), and remove data from the chamber. Users must have access (be provisioned) to the chamber and be on the same network as the chamber's [connector](./concept-connector.md) object.

## Importing data overview

Users with access to the chamber can bring data into the chamber via AzCopy and an expiring SAS URI token they get from the chamber component.  They then use AzCopy to move data into the data pipeline endpoint. The chamber recognizes the data pipeline request and moves the file into the chamber.  For traceability purposes, when a file is moved into the chamber, the data pipeline automatically creates a file object in the chamber that represents the file data.

## Exporting data overview

Users with access to the chamber can export data from the chamber via the data pipeline.

1. **Identify file to export.** The export process is triggered when a user places a file to export into a designated area within the chamber.  A Chamber Admin or Chamber User copies the file to the data out folder within the pipeline. The data pipeline detects the copied file and creates a file object. The file creation activity is traceable in the logs and enables the next step of the data pipeline.

1. **Request file to export.** A Chamber Admin reviews files in the data pipeline and requests to export files in the data out folder in the chamber. The pipeline creates a file request object. The export request activity is traceable in the logs and enables the next step of the data pipeline.

1. **Approve/reject export request.** The Workbench Owner approves or rejects the file request object for export. The export approval step must be completed by the Workbench Owner and can't be the same person who requested to export the data.

1. **Download file to export.** If a file is approved for export, the user gets a download URI from the file request object and copies it out of the chamber using AzCopy. The URI has an expiration timestamp and must be downloaded before it expires. If the URI expires, you need to request a new download URI.

  > [!NOTE]
  > Larger files take longer to be available to download after being approved and to download using AzCopy.  Check the expiration on the download URI and request a new one if the window has expired.

## Next steps

- [License service](./concept-license-service.md)