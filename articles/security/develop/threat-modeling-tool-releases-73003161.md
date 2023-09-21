---
title: Microsoft Threat Modeling Tool release 03/22/2020 - Azure
description: Documenting the release notes for the threat modeling tool release 7.3.00316.1.
author: jegeib
ms.author: jegeib
ms.service: information-protection
ms.topic: article
ms.date: 03/22/2020
---

# Threat Modeling Tool update release 7.3.00316.1 - 03/22/2020

Version 7.3.00316.1 of the Microsoft Threat Modeling Tool (TMT) was released on March 22 2020 and contains the following changes:

- Accessibility improvements
- Bug fixes
- New DiagramReader feature

## Notable bug fixes

### Exporting the threat list to CSV

The export to CSV function was inconsistently selecting which fields from the threat list would be exported. Now all fields from the threat list will be exported into the CSV file. 

### UX bugs

- The help menus in the primary workflow (create/open/analyze) and the template editor experience now have consistent menu options.
- The search bar in the stencils pane now has a standard cursor and appropriate labels have been added.

## New features

### DiagramReader feature has been added

A new DiagramReader feature has been added in the main menu while a model is open. This feature will convert the graphical representation of the model into a text-based narrative. 

## System requirements

- Supported operating systems:
  - [Microsoft Windows 10 Anniversary Update](https://blogs.windows.com/windowsexperience/2016/08/02/how-to-get-the-windows-10-anniversary-update/#HTkoK5Zdv0g2F2Zq.97) or later
- .NET version required:
  - [.NET 4.7.1](https://go.microsoft.com/fwlink/?LinkId=863262) or later
- Additional requirements:
  - An internet connection to receive updates to the tool as well as templates

## Documentation and feedback

- Documentation for the Threat Modeling Tool is [located](./threat-modeling-tool.md), and includes information [about using the tool](./threat-modeling-tool-getting-started.md).

## Next steps

Download the latest version of the [Microsoft Threat Modeling Tool](https://aka.ms/threatmodelingtool).
