---
title: Microsoft Threat Modeling Tool release 02/11/2020 - Azure
description: Documenting the release notes for the threat modeling tool
author: jegeib
ms.author: jegeib
ms.service: security
ms.topic: article
ms.date: 02/25/2020
---

# Threat Modeling Tool update release 7.3.00206.1 - 02/11/2020

Version 7.3.00206.1 of the Microsoft Threat Modeling Tool (TMT) was released on February 11 2020 and contains the following changes:

- Bug fixes

## Notable bug fixes

### Errors related to priority values outside of the expected ranges

Some customers had reported receiving the following error message when opening files created in the "Threat Modeling Tool 2016" or custom templates:

    System.InvalidOperationException: Invalid Priority value. Accepted values are [0..4] and 'High', 'Medium', 'Low' at ThreatModeling.Model.Threat.get_Priority()
    
    System.ArgumentOutOfRangeException: Accepted values are 'High', 'Medium', and 'Low' Parameter name: value Actual value was 5.6. at ThreatModeling.Model.Threat.set_Priority(String value)

This issue has been resolved in this release.

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
