---
title:  Azure Connected Machine agent deployment options
description: Learn about the different options to onboard machines to Azure Arc-enabled servers.
ms.date: 05/04/2023
ms.topic: how-to 
---

# Azure Connected Machine agent deployment options

Connecting machines in your hybrid environment directly with Azure can be accomplished using different methods, depending on your requirements and the tools you prefer to use.

## Onboarding methods

The following table highlights each method so that you can determine which works best for your deployment. For detailed information, follow the links to view the steps for each topic.

| Method | Description |
|--------|-------------|
| Interactively | Manually install the agent on a single or small number of machines by [connecting machines using a deployment script](onboard-portal.md).<br> From the Azure portal, you can generate a script and execute it on the machine to automate the install and configuration steps of the agent.|
| Interactively | [Connect machines from Windows Admin Center](onboard-windows-admin-center.md) |
| Interactively or at scale | [Connect machines using PowerShell](onboard-powershell.md) |
| Interactively or at scale | [Connect machines using Windows PowerShell Desired State Configuration (DSC)](onboard-dsc.md) |
| At scale | [Connect machines using a service principal](onboard-service-principal.md) to install the agent at scale non-interactively.|
| At scale | [Connect machines by running PowerShell scripts with Configuration Manager](onboard-configuration-manager-powershell.md)
| At scale | [Connect machines with a Configuration Manager custom task sequence](onboard-configuration-manager-custom-task.md)
| At scale | [Connect Windows machines using Group Policy](onboard-group-policy-powershell.md)
| At scale | [Connect machines from Automation Update Management](onboard-update-management-machines.md) to create a service principal that installs and configures the agent for multiple machines managed with Azure Automation Update Management to connect machines non-interactively. |

> [!IMPORTANT]
> The Connected Machine agent cannot be installed on an Azure virtual machine. The install script will warn you and roll back if it detects the server is running in Azure.

Be sure to review the basic [prerequisites](prerequisites.md) and [network configuration requirements](network-requirements.md) before deploying the agent, as well as any specific requirements listed in the steps for the onboarding method you choose. To learn more about what changes the agent will make to your system, see [Overview of the Azure Connected Machine Agent](agent-overview.md).

## Next steps

* Learn about the Azure Connected Machine agent [prerequisites](prerequisites.md) and [network requirements](network-requirements.md).
* Review the [Planning and deployment guide for Azure Arc-enabled servers](plan-at-scale-deployment.md)
* Learn about [reconfiguring, upgrading, and removing the Connected Machine agent](manage-agent.md).
* Try out Arc-enabled servers by using the [Azure Arc Jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_servers/).
