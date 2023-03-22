---
title: How to Activate a FLEXlm based license for a Modeling and Simulation Workbench chamber
description: In this How-to guide, you learn how to upload a license file to activate a license service for a Modeling and Simulation Workbench chamber.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Chamber Admin, I want to activate a license service in Modeling and Simulation Workbench chamber so that chamber users can run applications requiring licenses.
---

# How to Activate a FLEXlm based license for a Modeling and Simulation Workbench chamber

## Activate a license for a Modeling and Simulation Workbench Chamber

 This guide shows you how to upload a license file to activate a license service for a Modeling and Simulation Workbench chamber.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- FLEXlm license file for a software vendor requiring license. (You need to buy the license for production environment from vendors like Synopsys, Cadence, Siemens, or Ansys.)

## Upload/update license for FLEXlm based tools

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.
1. Search for Modeling and Simulation Workbench and choose the workbench you want to provision from the resource list.
1. Select a **Modeling and Simulation Workbench Chamber** which you've created, from the left side menu, and choose the chamber where you want to upload the license info, from the resource list.
1. In the menu for the chamber, select **License** blade on the left of the screen in the Settings section.
1. On the License **Overview** page, take note of the FLEXlm host ID or VM UUID as appropriate, you need this value to acquire a vendor's license file for this chamber.
1. Once vendor license file is acquired, on the License **Overview** page, click on **Update** to open update license window. Click on **Enable** to enable the service and upload the license file, choosing it from your storage space.
1. In the **Update License** blade on the left of the screen, click the **Update** button to activate your license service.
1. NOTE: The update action applies the new license to the license service, causing a restart and may affect any actively running jobs.

## Upload/update license key for connector remote desktop access

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.
1. Search for Modeling and Simulation Workbench and choose the workbench you want to provision from the resource list.
1. Select a **Modeling and Simulation Workbench Chamber** which you've created, from the left side menu, and choose the chamber where you want to upload the license info, from the resource list.
1. In the menu for the chamber, select **Connector** blade on the left of the screen in the Settings section.
1. On the Connector **Overview** page, click on **Add License** to open the Add license window.
1. Provide the License Key URL for the license file, using format https://\<keyVaultName\>.vault.azure.net/secrets/\<secretName\>/\<secretGuid\>, and click **Add**.
1. NOTE: When you add a new license key, the Remote Desktop service is updated, causing possible interruptions to active remote desktop sessions.

## Next steps

To learn how to upload data into an Azure Modeling and Simulation Workbench chamber, check [How to Upload Data](./howtoguide-upload-data.md)
