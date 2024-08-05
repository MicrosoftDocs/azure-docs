---
title: Automanage Configuration profiles
description: Learn about Azure Automanage configuration profiles for virtual machines.
author: mmccrory
ms.service: azure-automanage
ms.topic: overview
ms.date: 9/07/2022
ms.author: memccror
ms.custom: references_regions
---

# Configuration profiles

> [!CAUTION]
> On 31 August 2024, both Automation Update Management and the Log Analytics agent it uses will be retired. Migrate to Azure Update Manager before that. Refer to guidance on migrating to Azure Update Manager [here](https://learn.microsoft.com/azure/update-manager/guidance-migration-automation-update-management-azure-update-manager?WT.mc_id=Portal-Microsoft_Azure_Automation). [Migrate Now](https://ms.portal.azure.com/).

When you are enabling Automanage for your machine, a configuration profile is required. Configuration profiles are the foundation of this service. They define which services we onboard your machines to and to some extent what the configuration of those services would be.

## Best practice configuration profiles

There are two best practice configuration profiles currently available.

- **Dev/Test** profile is designed for Dev/Test machines.
- **Production** profile is for production.

The reason for this differentiator is because certain services are recommended based on the workload running. For instance, in a Production machine we will automatically onboard you to Azure Backup. However, for a Dev/Test machine, a backup service would be an unnecessary cost, since Dev/Test machines are typically lower business impact.

## Custom profiles

Custom profiles allow you to customize the services and settings that you want to apply to your machines. This is a great option if your IT requirements differ from the best practices. For instance, if you do not want to use the Microsoft Antimalware solution because your IT organization requires you to use a different antimalware solution, then you can simply toggle off Microsoft Antimalware when creating a custom profile.

> [!NOTE]
> In the Best Practices Dev/Test configuration profile, we will not back up the VM at all.

> [!NOTE]
> If you want to change the configuration profile of a machine, you can simply reenable it with the desired configuration profile. However, if your machine status is "Needs Upgrade" then you will need to disable first and then reenable Automanage. 

For the complete list of participating Azure services and if they support preferences, see here:
- [Automanage for Linux](automanage-linux.md)
- [Automanage for Windows Server](automanage-windows-server.md)

## Next steps

In this article, you learned that Automanage for machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for virtual machines drifts from the configuration profile, we will automatically bring it back into compliance.

Try enabling Automanage for Azure virtual machines or Arc-enabled servers in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)
