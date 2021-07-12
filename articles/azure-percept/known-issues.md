---
title: Azure Percept known issues
description: Learn more about Azure Percept known issues and their workarounds
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: reference
ms.date: 03/25/2021
---

# Azure Percept known issues

Here are issues with the Azure Percept DK, Azure Percept Audio, or Azure Percept Studio that the product teams are aware of. Workarounds and troubleshooting steps are provided where possible. If you're blocked by any of these issues, you can post it as a question on [Microsoft Q&A](/answers/topics/azure-percept.html) or submit a customer support request in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview). 

|Area|Symptoms|Description of Issue|Workaround|
|-------|---------|---------|---------|
| Azure Percept DK | Unable to deploy the sample and demo models in Azure Percept Studio | Sometimes the azureeyemodule or azureearspeechmodule modules stop running. edgeAgent logs show "too many levels of symbolic links" error. | Reset your device by [updating it over USB](./how-to-update-via-usb.md) |
| Localization | Non-English speaking users may see parts of the Azure Percept DK setup experience display English text. | The Azure Percept DK setup experience isn't fully localized. | Fix is scheduled for July 2021  |
| Azure Percept DK | When going through the setup experience on a Mac, the setup experience my abruptly close after connecting to Wi-Fi. | When going through the setup experience on a Mac, it initially opens in a window rather than a web browser. The window isn't persisted once the connection switches from the device's access point to Wi-Fi. | Open a web browser and go to https://10.1.1.1, which will allow you to complete the setup experience. |
| Azure Percept DK | The dev kit is running a custom model and after rebooting the dev kit it runs the default sample model. | The module twin container for the custom model doesn't persist across device reboots. After the reboot, the module twin for the custom module must be rebuilt which can take 5 minutes or longer. The dev kit will run the default model until that process is completed. | After a reboot, you must wait until the custom module twin is recreated. |