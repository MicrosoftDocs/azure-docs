---
title: About Azure Automanage Machine Best Practices
description: Learn about Azure Automanage machine best practices.
author: mmccrory
ms.service: automanage
ms.workload: infrastructure
ms.topic: overview
ms.date: 9/07/2022
ms.author: memccror
ms.custom: overview
---

# Azure Automanage machine best practices

This article covers information about Azure Automanage machine best practices, which have the following benefits:

- Intelligently onboards virtual machines to select best practices Azure services
- Automatically configures each service per Azure best practices
- Supports customization of best practice services
- Monitors for drift and corrects for it when detected
- Provides a simple experience (point, click, set, forget)

Azure Automanage machine best practices is a service that eliminates the need to discover, know how to onboard, and how to configure certain services in Azure that would benefit your virtual machine. These services are considered to be Azure best practices services, and help enhance reliability, security, and management for virtual machines. Example services include [Azure Update Management](../automation/update-management/overview.md) and [Azure Backup](../backup/backup-overview.md).

After onboarding your machines to Azure Automanage, each best practice service is configured to its recommended settings. However, if you want to customize the best practice services and settings, you can use the [Custom Profile](./overview-configuration-profiles.md#custom-profiles) option. 

Azure Automanage also automatically monitors for drift and corrects for it when detected. What this means is if your virtual machine or Arc-enabled server is onboarded to Azure Automanage, we'll monitor your machine to ensure that it continues to comply with its [configuration profile](./overview-configuration-profiles.md) across its entire lifecycle. If your virtual machine does drift or deviate from the profile (for example, if a service is off-boarded), we will correct it and pull your machine back into the desired state.

Automanage doesn't store/process customer data outside the geography your VMs are located. In the Southeast Asia region, Automanage does not store/process data outside of Southeast Asia.

> [!NOTE]
> Automanage can be enabled on Azure virtual machines and Azure Arc-enabled servers. Automanage is not available in US Government Cloud at this time.

## Prerequisites

There are several prerequisites to consider before trying to enable Azure Automanage on your virtual machines.

- Supported [Windows Server versions](automanage-windows-server.md#supported-windows-server-versions) and [Linux distros](automanage-linux.md#supported-linux-distributions-and-versions)
- Machines must be in a [supported region](#supported-regions)
- User must have correct [permissions](#required-rbac-permissions)
- Automanage does not support Sandbox subscriptions at this time
- Automanage does not support [Trusted Launch VMs](../virtual-machines/trusted-launch.md)

### Supported regions

Please visit [this page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?regions=all&products=all) to view which regions Automanage supports.

> [!NOTE]
> If the machine is connected to a Log Analytics workspace, the Log Analytics workspace must be located in one of the supported regions listed above.

### Required RBAC permissions
To onboard, Automanage requires slightly different RBAC roles depending on whether you are enabling Automanage for the first time in a subscription.

If you are enabling Automanage for the first time in a subscription:
* **Owner** role on the subscription(s) containing your machines, _**or**_
* **Contributor** and **User Access Administrator** roles on the subscription(s) containing your machines

If you are enabling Automanage on a machine in a subscription that already has Automanage machines:
* **Contributor** role on the resource group containing your machines

The Automanage service will grant **Contributor** permission to this first party application (Automanage API Application ID: d828acde-4b48-47f5-a6e8-52460104a052) to perform actions on Automanaged machines. Guest users will need to have the **directory reader role** assigned to enable Automanage.

> [!NOTE]
> If you want to use Automanage on a VM that is connected to a workspace in a different subscription, you must have the permissions described above on each subscription.

## Participating services

:::image type="content" source="media\automanage-virtual-machines\intelligently-onboard-services-1.png" alt-text="Diagram of intelligently onboard services.":::

For the complete list of participating Azure services, as well as their supported profile, see the following:
- [Automanage for Linux](automanage-linux.md)
- [Automanage for Windows Server](automanage-windows-server.md)

 We will automatically onboard you to these participating services when you use the Best Practices Configuration Profiles. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).

 ## Next steps

In this article, you learned that Automanage for machines provides a means for which you can eliminate the need for you to know of, onboard to, and configure best practices Azure services. In addition, if a machine you onboarded to Automanage for virtual machines drifts from the configuration profile, we will automatically bring it back into compliance.

Try enabling Automanage for Azure virtual machines or Arc-enabled servers in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](virtual-machines-custom-profile.md)
