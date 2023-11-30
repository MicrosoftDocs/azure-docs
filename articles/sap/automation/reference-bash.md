---
title: SAP Deployment Automation Framework Bash reference | Microsoft Docs
description: Use shell scripts to deploy SAP Deployment Automation Framework components.
services: virtual-machines-windows
author: kimforss
manager: kimforss
keywords: 'Azure, SAP'
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.topic: article
ms.workload: infrastructure
ms.date: 11/17/2021
ms.author: kimforss
---

# Use SAP Deployment Automation Framework shell scripts

You can deploy all [SAP Deployment Automation Framework](deployment-framework.md) components by using shell scripts.

## Control plane operations

You can deploy or update the control plane by using the [deploy_controlplane](bash/deploy-controlplane.md) shell script.

Remove the control plane by using the [remove_controlplane](bash/remove-controlplane.md) shell script.

You can bootstrap the deployer in the control plane by using the [install_deployer](bash/install-deployer.md) shell script.

You can bootstrap the SAP library in the control plane by using the [install_library](bash/install-library.md) shell script.

## Workload zone operations

Deploy or update the workload zone by using the [install_workloadzone](bash/install-workloadzone.md) shell script.

Remove the workload zone by using the [remover](bash/remover.md) shell script.

## SAP system operations

Deploy or update the SAP system by using the [installer](bash/installer.md) shell script.

Remove the SAP system by using the [remover](bash/remover.md) shell script.

## Other operations

Set the deployment credentials by using the
[Set SPN secrets](bash/set-secrets.md) shell script.

Update the Terraform state file by using the
[Update Terraform state](bash/advanced-state-management.md) shell script.

## Next step

> [!div class="nextstepaction"]
> [Deploy the control plane by using Bash](bash/deploy-controlplane.md)
