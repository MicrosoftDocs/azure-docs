---
title: Azure Modeling and Simulation Workbench data pipeline
description: Overview of Azure Modeling and Simulation Workbench data pipeline component.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 01/01/2023
#Customer intent: As a Modeling and Simulation Workbench user, I want to understand the data pipeline component.
---

# Azure Modeling and Simulation Workbench data pipeline

## Data Pipeline - an introduction

For the Azure Modeling and Simulation Workbench user, getting data into and out of the chamber is done through the data pipeline. Since the chamber is secure and isolated from the public network, no direct method is provided to copy data into and out of the chamber.

The data pipeline enables users to bring data into the [chamber](./concept-chamber.md), and remove data from the chamber. These users must have been provisioned to have access to the chamber, and be on the network configured for that chamber's [connector](./concept-connector.md) object.

## Data Pipeline features

Users with access to the chamber can bring data into the chamber via AzCopy and an expiring SAS URI token. This token can be acquired from the chamber component. The user can then utilize AzCopy to move data into the data pipeline endpoint. The chamber recognizes the data pipeline request and move the file into the chamber, in addition, the data pipeline makes visible within the chamber a files object representing the data in file request for traceability.

Users with access to the chamber can extract data from the chamber via the data pipeline through a series of steps.

1. Identify file to extract. The process is triggered by placing the file to extract into a designated area within the chamber. Copying file to data pipeline data out folder can be performed by a Chamber Admin or a Chamber User. The copied file will be detected by the data pipeline and a files object is created. The file creation activity is traceable in the logs, and will enable the next step of the data pipeline.

1. Request file to extract. A Chamber Admin can review files in the data pipeline and for data out files, request to extract a file from the chamber. This operation triggers the creation of a files request object. The request to extract activity is traceable in the logs, and will enable the next step of the data pipeline.

1. Approve/Reject file request. The file request object can only be approved or rejected for extraction by the Workbench Owner. In addition, the user approving the extraction can't be the same user who requested to extract the data, and must be a Workbench Owner vs Chamber Admin or Chamber User.

1. Download file to extract. If a file is approved for extraction, a download URI can be obtained from the file requests object, and copied out of the chamber using AzCopy. Note the URI has an expiration timestamp, you must complete the download within the expiration time frame, or request a new download URI.

  > [!NOTE]
  > the larger files take longer to be available to download after being approved, and to download using AzCopy, take note of the expiry on the download URI and request a new one if the expiry window has expired.

## Next steps

- [What's Next - How to manage chamber licenses](./howtoguide-licenses.md)

Choose an article to know more:

- [Workbench](./concept-workbench.md)

- [Chamber](./concept-chamber.md)

- [Connector](./concept-connector.md)
