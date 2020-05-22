---
title: Create configurations from existing servers for Azure Automation State Configuration
description: This article tells how to create configurations from existing servers for Azure Automation State Configuration.
keywords: dsc,powershell,configuration,setup
services: automation
ms.service: automation
ms.subservice: dsc
author: mgreenegit
ms.author: migreene
ms.date: 08/08/2019
ms.topic: conceptual
manager: carmonm
---
# Create configurations from existing servers

> Applies To: Windows PowerShell 5.1

Creating configurations from existing servers can be a challenging task.
You might not want *all* settings,
just those that you care about.
Even then you need to know in what order the settings
must be applied in order for the configuration to apply successfully.

> [!NOTE]
> This article refers to a solution that is maintained by the Open Source community.
> Support is only available in the form of GitHub collaboration, not from Microsoft.

## Community project: ReverseDSC

A community maintained solution named
[ReverseDSC](https://github.com/microsoft/reversedsc)
has been created to work in this area starting SharePoint.

The solution builds on the
[SharePointDSC resource](https://github.com/powershell/sharepointdsc)
and extends it to orchestrate
[gathering information](https://github.com/Microsoft/sharepointDSC.reverse#how-to-use)
from existing SharePoint servers.
The latest version has multiple
[extraction modes](https://github.com/Microsoft/SharePointDSC.Reverse/wiki/Extraction-Modes)
to determine what level of information to include.

The result of using the solution is generating
[Configuration Data](https://github.com/Microsoft/sharepointDSC.reverse#configuration-data)
to be used with SharePointDSC configuration scripts.

Once the data files have been generated,
you can use them with
[DSC Configuration scripts](/powershell/scripting/dsc/overview/overview)
to generate MOF files
and
[upload the MOF files to Azure Automation](/azure/automation/tutorial-configure-servers-desired-state#create-and-upload-a-configuration-to-azure-automation).
Then register your servers from either
[on-premises](/azure/automation/automation-dsc-onboarding#onboarding-physicalvirtual-windows-machines-on-premises-or-in-a-cloud-other-than-azure-including-aws-ec2-instances)
or [in Azure](/azure/automation/automation-dsc-onboarding#onboarding-azure-vms)
to pull configurations.

To try out ReverseDSC, visit the
[PowerShell Gallery](https://www.powershellgallery.com/packages/ReverseDSC/)
and download the solution or click "Project Site"
to view the
[documentation](https://github.com/Microsoft/sharepointDSC.reverse).

## Next steps

- To understand PowerShell DSC, see [Windows PowerShell Desired State Configuration overview](/powershell/scripting/dsc/overview/overview).
- Find out about PowerShell DSC resources in [DSC Resources](/powershell/scripting/dsc/resources/resources).
- For details of Local Configuration Manager configuration, see [Configuring the Local Configuration Manager](/powershell/scripting/dsc/managing-nodes/metaconfig).