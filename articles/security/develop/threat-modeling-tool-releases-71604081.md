---
title: Microsoft Threat Modeling Tool release 4/9/2019
titleSuffix: Azure
description: Documenting the release notes for the threat modeling tool release 7.1.60408.1.
author: jegeib
ms.author: jegeib
ms.service: information-protection
ms.topic: article
ms.date: 04/03/2019
---

# Threat Modeling Tool update release 7.1.60408.1 - 4/9/2019

Version 7.1.60408.1 of the Microsoft Threat Modeling Tool (TMT) was released on April 9, 2019 and contains the following changes:

- New Stencils for Azure Key Vault and Azure Traffic Manager
- TMT version number is now shown on the home screen
- Support links have been updated
- Bug fixes

## Feature changes

### New Stencils for Azure Key Vault and Azure Traffic Manager

![Screenshot shows icons for Azure Key Vault and Azure Traffic Manager.](./media/threat-modeling-tool-releases-71604081/tmt_keyvault_trafficmanager.PNG)

New stencils and threats for Azure Key Vault and Azure Traffic Manager have been added to the Azure stencil set. When opening models based on the Azure stencil set, users will be prompted to update the template associated with the model. Updating a model based on the Azure stencil set can also be manually initiated by using the "Apply Template" command in the "File" menu and reapplying the latest Azure Cloud Services.tb7 file.

### TMT version number is now shown on the home screen

The client version of the Threat Modeling Tool is now shown on the home screen of the application of for ease of access.

![Screenshot shows the Microsoft Threat Modeling Tool with the client version number.](./media/threat-modeling-tool-releases-71604081/tmt_version.PNG)

### Support links have been updated

All support links within the tool have been updated to direct users to [tmtextsupport@microsoft.com](mailto:tmtextsupport@microsoft.com) rather than an MSDN forum.

## System requirements

- Supported Operating Systems
  - [Microsoft Windows 10 Anniversary Update](https://blogs.windows.com/windowsexperience/2016/08/02/how-to-get-the-windows-10-anniversary-update/#HTkoK5Zdv0g2F2Zq.97) or later
- .NET Version Required
  - [.NET Framework 4.7.1](https://dotnet.microsoft.com/download/dotnet-framework) or later
- Additional Requirements
  - An Internet connection is required to receive updates to the tool and templates.

## Documentation and feedback

- Documentation for the Threat Modeling Tool is [located](threat-modeling-tool.md), and includes information [about using the tool](threat-modeling-tool-getting-started.md).

## Next steps

Download the latest version of the [Microsoft Threat Modeling Tool](https://aka.ms/threatmodelingtool).
