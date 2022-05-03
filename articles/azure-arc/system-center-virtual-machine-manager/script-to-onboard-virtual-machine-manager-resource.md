---
title: Script to onboard a Virtual Machine Manager resource to Arc enable System Center Virtual Machine Manager.
description: This article provides the scripts to onboard a private cloud to Arc enabled System Center Virtual Machine Manager (Preview).
author: jyothisuri
ms.author: jsuri
ms.topic: article
ms.date: 04/28/2022
---
# Onboard Arc enabled System Center Virtual Machine Manager (VMM) (Preview)

## Onboard a private cloud
   ```
   az scvmm cloud create --custom-location <custom location name> -l <Azure Location> -n <User specified name for cloud> --uuid <ID of the cloud instance in from scvmm> --vmmserver <name of vmm server instance on Arc> -g <Resource Group to which the resource would be onboarded>
   ```

## Script to on-board a VM Template to Arc enabled SCVMM

   ```
   az scvmm vm-template create --custom-location <custom location name> -l <Azure Location> -n <User specified name> -g <Resource Group to which the resource would be onboarded> --uuid <ID of the cloud instance in from scvmm> --vmmserver <name of vmm server instance on Arc>
   ```


## Script to on-board VM Network to Arc enabled SCVMM

   ```
   az scvmm virtual-network create --custom-location <custom location name>  -l <Azure Location>  -n <User specified name> -g <Resource Group to which the resource would be onboarded> --uuid <ID of the VM Network instance in from scvmm> --vmmserver <name of vmm server instance on Arc>
   ```


## Next steps

- [Create a virtual machine on SCVMM using Azure Arc](create-virtual-machine.md)
