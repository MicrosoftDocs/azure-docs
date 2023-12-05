---
title: Troubleshooting the SAP Deployment Automation Framework
description: Describe how to troubleshoot the SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 12/05/2023
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: devx-track-ansible
---

# Troubleshooting the SAP Deployment Automation Framework


Within the SAP Deployment Automation Framework (SDAF), we recognize that there are many moving parts.  This article is intended to help you troubleshoot issues that you may encounter.

## Installation

## Deployment

This section describes how to troubleshoot issues that you may encounter when performing deployments using the SAP Deployment Automation Framework.

## Configuration

This section describes how to troubleshoot issues that you may encounter when performing configuration using the SAP Deployment Automation Framework.

## Software download

## Azure DevOps

This section describes how to troubleshoot issues that you may encounter when using Azure DevOps with the SAP Deployment Automation Framework.

### Issues with the Azure DevOps pipelines

If you see an error similar to the following when running the Azure DevOps pipelines:

```text
##[error]Variable group SDAF-MGMT could not be found.
##[error]Bash exited with code '2'.
```

This error indicates that the configured personal access token does not have permissions to access the variable group. Please ensure that the personal access token has the **Read & manage** permission for the variable group and that it has not expired. The personal access token is configured in the Azure DevOps pipeline variable groups either as 'PAT' in the control plane variable group or as WZ_PAT in the workload zone variable group.


## Next step

> [!div class="nextstepaction"]
> [Configure custom naming](naming-module.md)
