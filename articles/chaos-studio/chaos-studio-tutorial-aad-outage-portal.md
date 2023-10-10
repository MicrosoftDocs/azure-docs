---
title: Use a chaos experiment template to induce an outage on an Azure Active Directory instance
description: Use the Azure portal to create an experiment from the AAD outage experiment template.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: how-to
ms.date: 09/27/2023
ms.custom: template-how-to, ignite-fall-2021
---

# Use a chaos experiment template to induce an outage on an Azure Active Directory instance

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this article, you induce an outage on an Azure Active Directory resource using a pre-populated experiment template and Azure Chaos Studio Preview.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- A network security group.

## Enable Chaos Studio on your network security group

Azure Chaos Studio Preview can't inject faults against a resource until that resource is added to Chaos Studio. To add a resource to Chaos Studio, create a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. Network security groups have only one target type (service-direct) and one capability (set rules). Other resources might have up to two target types. One target type is for service-direct faults. Another target type is for agent-based faults. Other resources might have many other capabilities.

1. Open the [Azure portal](https://portal.azure.com).
1. Search for **Chaos Studio** in the search bar.
1. Select **Targets** and find your network security group resource.
1. Select the network security group resource and select **Enable targets** > **Enable service-direct targets**.

      [![Screenshot that shows the Targets screen in Chaos Studio, with the network security group resource selected.](images/tutorial-aad-outage-enable.png) ](images/tutorial-aad-outage-enable.png#lightbox)
1. Select **Review + Enable** > **Enable**.

You've now successfully added your network security group to Chaos Studio.

## Create an experiment from a template

Now you can create your experiment from a pre-filled experiment template. A chaos experiment defines the actions you want to take against target resources. The actions are organized and run in sequential steps. The chaos experiment also defines the actions you want to take against branches, which run in parallel.

1. In Chaos Studio, go to **Experiments** > **Create** > **New from template**.

   [![Screenshot that shows the Experiments screen, with the New from template button highlighted.](images/tutorial-aad-outage-create.png)](images/tutorial-aad-outage-create.png#lightbox)
1. Select **AAD Outage**.

   [![Screenshot that shows the experiment templates screen, with the AAD outage template button highlighted.](images/tutorial-aad-outage-select.png)](images/tutorial-aad-outage-select.png#lightbox)
1. Add a name for your experiment that complies with resource naming guidelines. Select **Next: Permissions**.

   [![Screenshot that shows the experiment basics screen, with the permissions tab button button highlighted.](images/tutorial-aad-outage-basics.png)](images/tutorial-aad-outage-basics.png#lightbox)
1. For your chaos experiment to run successfully, it must have [sufficient permissions on target resources](chaos-studio-permissions-security.md). Select a system-assigned managed identity or a user-assigned managed identity for your experiment. You can choose to enable custom role assignment if you would like Chaos Studio to add the necessary permissions to run (in the form of a custom role) to your experiment's identity. Select **Next: Experiment designer**.

   [![Screenshot that shows the experiment permissions screen, with the experiment designer tab button button highlighted.](images/tutorial-aad-outage-permissions.png)](images/tutorial-aad-outage-permissions.png#lightbox)
1. Within the **NSG Security Rule (version 1.1)** fault, select **Edit**.

   [![Screenshot that shows the experiment designer screen, with the edit button within the NSG fault highlighted.](images/tutorial-aad-outage-edit-fault.png)](images/tutorial-aad-outage-edit-fault.png#lightbox)
1. Review fault parameters and select **Next: Target resources**.

   [![Screenshot that shows the fault parameters pane, with the target resources button highlighted.](images/tutorial-aad-outage-fault-params.png)](images/tutorial-aad-outage-fault-params.png#lightbox)
1. Select the network security group resource that you want to use in the experiment. Select **Save**.

   [![Screenshot that shows the fault targets pane, with the save button highlighted.](images/tutorial-aad-outage-fault-targets.png)](images/tutorial-aad-outage-fault-targets.png#lightbox)
1. Select **Review + create** > **Create** to save the experiment.

## Run your experiment
You're now ready to run your experiment.

1. In the **Experiments** view, select your experiment. Select **Start** > **OK**.
1. When **Status** changes to *Running*, select **Details** for the latest run under **History** to see details for the running experiment.

## Next steps
Now that you've run an Azure Cosmos DB service-direct experiment, you're ready to:
- [Manage your experiment](chaos-studio-run-experiment.md)
- [Create an experiment that shut down all targets in a zone](chaos-studio-tutorial-dynamic-target-portal.md)
