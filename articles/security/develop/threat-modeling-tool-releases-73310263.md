---
title: Microsoft Threat Modeling Tool release 10/26/2023 - Azure
description: Documenting the release notes for the threat modeling tool release 7.3.31026.3.
author: chmg
ms.author: chmg
ms.service: security
ms.topic: article
ms.date: 10/26/2023
---

# Threat Modeling Tool update release 7.3.31026.3 - 10/26/2023

Version 7.3.31026.3 of the Microsoft Threat Modeling Tool (TMT) was released on October 26 2023 and contains the following changes:

- Bug fixes
- Accessibility fixes

## Known issues

### Errors related to TMT7.application file deserialization

#### Issue

Some customers have reported receiving the following error message when downloading the Threat Modeling Tool:

```
The threat model file '$PATH\TMT7.application' could not be deserialized. File is not an actual threat model or the threat model may be corrupted.
```

This error occurs because some browsers don't natively support ClickOnce installation. In those cases the ClickOnce application file is downloaded to the user's hard drive.

#### Workaround

This error will continue to appear if the Threat Modeling Tool is launched by double-clicking on the TMT7.application file. However, after bypassing the error the tool will function normally. Rather than launching the Threat Modeling Tool by double-clicking the TMT7.application file, users should utilize shortcuts created in the Windows Menu during the installation to start the Threat Modeling Tool.

## System requirements

- Supported Operating Systems
  - [Microsoft Windows 10 Anniversary Update](https://blogs.windows.com/windowsexperience/2016/08/02/how-to-get-the-windows-10-anniversary-update/#HTkoK5Zdv0g2F2Zq.97) or later
- .NET Version Required
  - [.NET 4.7.1](https://go.microsoft.com/fwlink/?LinkId=863262) or later
- Additional Requirements
  - An Internet connection is required to receive updates to the tool as well as templates.

## Documentation and feedback

- Documentation for the Threat Modeling Tool is located on [docs.microsoft.com](./threat-modeling-tool.md), and includes information [about using the tool](./threat-modeling-tool-getting-started.md).

## Next steps

Download the latest version of the [Microsoft Threat Modeling Tool](https://aka.ms/threatmodelingtool).
