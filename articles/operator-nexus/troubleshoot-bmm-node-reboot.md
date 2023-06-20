---
title: Troubleshoot Post Bare Metal machine(BMM) Cordon and Restart, VMs show up as error on portal. Power and Restart doesn’t work anymore for Azure Operator Nexus
description: Troubleshoot Post Bare Metal machine(BMM) Cordon and restart, VMs show up as error on portal. Power & Restart doesn’t work anymore.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/13/2023
ms.author: v-sathysubra
author: Sathyadevi-S
---
# Troubleshoot post Bare Metal machine(BMM) cordon and restart, VMs show up as error on portal. Power and Restart doesn’t work anymore
Follow this troubleshooting guide for Bare Metal machine(BMM) Cordon and Restart:
- If you encounter VMs showing up as "ERROR" on the portal after an upgrade.
- Traditional methods such as powering off and restarting the VMs doesn't work 

## Prerequisites to complete this TSG
- Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
- Familiarize yourself with the capabilities referenced in this article by reviewing the [Bare Metal Machine Actions](howto-baremetal-functions.md)
- Subscription ID
- Cluster name and resource group
- Virtual machine name  
- The Virtual Machine should have a Provisioning State of "Succeeded" and a Power State of "On."

## Symptoms 

- During Bare Metal machine(BMM) restart or upgrade testing, the VM is currently in an error state.
- After the Bare Metal machine(BMM) reboot CORDONED -> POWERED OFF -> POWERED ON -> UNCORDONED 
    - Although the VNF successfully came up, established its BGP sessions, and started routing traffic, the VM status in the portal consistently shows an error. Despite this discrepancy, the application remains healthy and continues to function properly.
    - The Portal actions and AZ CLI APIs for the NC VM resource itself were no longer achieving the intent. Example: 
        - Clicking the Power Off (or AZ CLI)  actually Power Off the VM anymore 
        - Clicking the Restart (or AZ CLI) doesn't actually Restart the VM anymore 
    - The platform has lost capability to manage this VM Resource 

:::image type="content" source="media\troubleshoot-bmm-server\bmm-error-status.png" alt-text="Screenshot of Sample VM in Error status." lightbox="media\troubleshoot-bmm-server\bmm-error-status.png":::

## Troubleshooting

- Gather the VM details and Validate the VM status in the portal. 

    - VM isn't connected and powered off  
    - Validate the status of the virtual machine before and after restart or upgrade 
    - Check the BGP session and traffic flow before and after restart or upgrade of the VNF  
    - For more troubleshooting, see [troubleshoot-reboot-reimage-replace](troubleshoot-reboot-reimage-replace.md)

## Procedure

There's an issue with the status update on the VM after the upgrade.
Although the upgrade and the VM itself are fine, the status is being reported incorrectly, leading to actions being ignored.
Perform the following CLI update on any affected VMs with some dummy tag values (the use of "tag1" and "value1")  

~~~bash
   az networkcloud virtualmachine update --ids <VMresourceId> --tags tag1=value1
~~~

This process facilitates the restoration of the VM to an online state. 

:::image type="content" source="media\troubleshoot-bmm-server\BMM-running-status.png" alt-text="Screenshot of Sample VM in running status." lightbox="media\troubleshoot-bmm-server\BMM-running-status.png":::
