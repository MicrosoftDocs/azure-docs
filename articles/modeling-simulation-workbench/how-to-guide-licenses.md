---
title: Manage license service for Azure Modeling and Simulation Workbench
description: In this How-to guide, you learn how to upload a license file to activate a license service for a Modeling and Simulation Workbench chamber.
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 01/01/2023
# Customer intent: As a Modeling and Simulation Workbench Chamber Admin, I want to activate a license service in Modeling and Simulation Workbench chamber so that chamber users can run applications requiring licenses.
---

# Manage license service for Azure Modeling and Simulation Workbench

A license service automates the installation of a license manager to help customers accelerate their engineering design. License management is integrated into Azure Modeling and Simulation Workbench flows via FLEXlm – the most commonly used license manager.  This article shows you how to upload a license file and activate a license service for a Modeling and Simulation Workbench chamber.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A FLEXlm license file for a software vendor requiring license.  You need to buy a production environment license from a vendor such as:  Synopsys, Cadence, Siemens, or Ansys.

## Upload/update license for FLEXlm based tools

This section lists the steps associated with uploading a license for a FLEXlm based tool.  First, you get the FLEXlm host ID or VM UUID from the chamber. Then you provide that value to the license vendor to get the license file. After you acquire the license file from the vendor, you upload the license file to the chamber and activate it.

1. Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.
1. Search for *Modeling and Simulation Workbench*. Select the workbench you want to provision from the resource list.
1. Select **Settings > Chamber** in the left side menu. A resource list displays. Select the chamber you want to upload the data to.
1. Select **License** blade in the Settings section on the left of the screen.
1. Copy the **FLEXlm host ID or VM UUID** located on the **License Overview** page. You need to provide this value to your license vendor to get a license file from them.
1. Once you get the vendor license file, Select **Update** on the **License Overview** page. The Update license window displays.
1. Select the *chamber license service* for the license file you are uploading. Select **Enable** to enable the service. Then upload the license file from your storage space.
1. Select the **Update** button in the **Update license** popup to activate your license service.
1. The Workbench applies the new license to the license service and prompts a restart that may affect actively running jobs.

## Upload/update license key for connector remote desktop access

Complete the following steps to enable remote desktop access via a connector license key.

1. Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal.
1. Search for *Modeling and Simulation Workbench* and choose the workbench you want to provision from the resource list.
1. Select **Settings > Chamber** in the left side menu. A resource list displays. Select the chamber you want to upload the data to.
1. Select **Settings > Connector** in the left side menu. Select the displayed connector.
1. Select **Add License** on the **Connector Overview** page. The Add license window displays.
1. Enter the License Key URL for the license file using format https://\<keyVaultName\>.vault.azure.net/secrets/\<secretName\>/\<secretGuid\>, and select **Add.**
1. The Workbench applies the new license key and updates the remote desktop service. This may cause interruptions to active remote desktop sessions.

## Next steps

To learn how to import data into an Azure Modeling and Simulation Workbench chamber, check [Import data.](./how-to-guide-upload-data.md)
