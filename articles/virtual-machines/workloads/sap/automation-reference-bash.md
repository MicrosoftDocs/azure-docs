---
title: SAP on Azure Deployment Automation Framework Bash reference | Microsoft Docs
description: SAP on Azure Deployment Automation Framework Bash reference
services: virtual-machines-windows
author: kimforss
manager: kimforss
keywords: 'Azure, SAP'
ms.service: virtual-machines-sap
ms.topic: article
ms.workload: infrastructure
ms.date: 11/17/2021
ms.author: kimforss
---

# Using SAP on Azure Deployment Automation Framework shell scripts

You can deploy all [SAP on Azure Deployment Automation Framework](automation-deployment-framework.md) components using shell scripts.

## Control Plane operations

You can deploy or update the control plane using the [prepare_region](bash/automation-prepare-region.md) shell script.

Remove the control plane using the [remove_region](bash/automation-remove-region.md) shell script.

You can bootstrap the deployer in the control plane using the [install_deployer](bash/automation-install_deployer.md) Shell script.

You can bootstrap the SAP Library in the control plane using the [install_library](bash/automation-install_library.md) Shell script.

## Workload Zone operations

Deploy or update the workload zone using the [`install_workloadzone`](bash/automation-install_workloadzone.md) shell script.

Remove the workload zone using the [`remover`](bash/automation-remover.md) shell script.


## SAP System operations

Deploy or update the SAP system using the [`installer`](bash/automation-installer.md) shell script.

Remove the SAP system using the [`remover`](bash/automation-remover.md)  Shell script.


## Other operations

Set the deployment credentials using the
[`Set SPN secrets`](bash/automation-set-secrets.md) Shell script.

Update the Terraform state file using the
[`Update Terraform state`](bash/automation-advanced_state_management.md) Shell script.

## Next steps

> [!div class="nextstepaction"]
> [Deploying the control plane using bash](bash/automation-prepare-region.md)
