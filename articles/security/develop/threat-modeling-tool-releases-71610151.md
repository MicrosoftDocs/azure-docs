---
title: Microsoft Threat Modeling Tool release 10/16/2019 - Azure
description: Documenting the release notes for the threat modeling tool
author: jegeib
ms.author: jegeib
ms.service: security
ms.topic: article
ms.date: 10/16/2019
---

# Threat Modeling Tool update release 7.1.61015.1 - 10/16/2019

Version 7.1.61015.1 of the Microsoft Threat Modeling Tool (TMT) was released on October 16 2019 and contains the following changes:

- Accessibility improvements
- Bug fixes
- New stencils for Azure Logic Apps and Azure Data Explorer

## Notable bug fixes

### Improved backward compatibility with files created in "Threat Modeling Tool 2016"

Several bugs related to the opening or display of threat model files created in "Threat Modeling Tool 2016" have been fixed.

## Feature enhancements

### New stencils for Azure Logic Apps and Azure Data Explorer

New stencils for Azure Logic Apps and Azure Data Explorer were added to the Azure Stencil along with their associated threats and mitigations.

![Azure Logic Apps and Azure Data Explorer Stencils](./media/threat-modeling-tool-releases-71610151/tmt-logic-apps.png)

## Known issues

### Errors related to priority values outside of the expected ranges

Some customers have reported receiving the following error message when opening files created in the "Threat Modeling Tool 2016" or custom templates:

    System.InvalidOperationException: Invalid Priority value. Accepted values are [0..4] and 'High', 'Medium', 'Low' at ThreatModeling.Model.Threat.get_Priority()
    
    System.ArgumentOutOfRangeException: Accepted values are 'High', 'Medium', and 'Low' Parameter name: value Actual value was 5.6. at ThreatModeling.Model.Threat.set_Priority(String value)

This issue is under investigation

## System requirements

- Supported Operating Systems
  - [Microsoft Windows 10 Anniversary Update](https://blogs.windows.com/windowsexperience/2016/08/02/how-to-get-the-windows-10-anniversary-update/#HTkoK5Zdv0g2F2Zq.97) or later
- .NET Version Required
  - [.Net 4.7.1](https://go.microsoft.com/fwlink/?LinkId=863262) or later
- Additional Requirements
  - An Internet connection is required to receive updates to the tool as well as templates.

## Documentation and feedback

- Documentation for the Threat Modeling Tool is located on [docs.microsoft.com](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool), and includes information [about using the tool](https://docs.microsoft.com/azure/security/azure-security-threat-modeling-tool-getting-started).

## Next steps

Download the latest version of the [Microsoft Threat Modeling Tool](https://aka.ms/threatmodelingtool).
