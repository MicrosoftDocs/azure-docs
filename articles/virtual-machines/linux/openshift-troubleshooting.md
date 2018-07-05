---
title: Troubleshoot OpenShift deployment in Azure | Microsoft Docs
description: Troubleshoot OpenShift deployment in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldw
manager: najoshi
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 
ms.author: haroldw
---

# Troubleshoot OpenShift deployment in Azure

If your OpenShift cluster does not deploy successfully, try these troubleshooting tasks to narrow down the issue. View the deployment status and compare against the following list of exit codes:

- Exit code 3: Your Red Hat Subscription User Name / Password or Organization ID / Activation Key is incorrect
- Exit code 4: Your Red Hat Pool ID is incorrect or there are no entitlements available
- Exit code 5: Unable to provision Docker Thin Pool Volume
- Exit code 6: OpenShift Cluster installation failed
- Exit code 7: OpenShift Cluster installation succeeded but Azure Cloud Solution Provider configuration failed - master config on Master Node issue
- Exit code 8: OpenShift Cluster installation succeeded but Azure Cloud Solution Provider configuration failed - node config on Master Node issue
- Exit code 9: OpenShift Cluster installation succeeded but Azure Cloud Solution Provider configuration failed - node config on Infra or App Node issue
- Exit code 10: OpenShift Cluster installation succeeded but Azure Cloud Solution Provider configuration failed - correcting Master Nodes or not able to set Master as unschedulable
- Exit code 11: Metrics failed to deploy
- Exit code 12: Logging failed to deploy

For exit codes 7-10, the OpenShift cluster was installed, but the Azure Cloud Solution Provider configuration failed. You can SSH to the master node (OpenShift Origin) or the bastion node (OpenShift Container Platform), and from there SSH to each cluster node to fix the issues.

A common cause for the failures with exit codes 7-9 is that the service principal did not have proper permissions to the subscription or the resource group. If this is the issue, assign the correct permissions and manually rerun the script that failed and all subsequent scripts.

Be sure to restart the service that failed (for example, systemctl restart atomic-openshift-node.service) before executing the scripts again.

For further troubleshooting, SSH into your master node on port 2200 (Origin) or the bastion node on port 22 (Container Platform). You need to be in the root (sudo su -) and then browse to the following directory: /var/lib/waagent/custom-script/download.

Here you see folders named "0" and "1." In each of these folders, you see two files, "stderr" and "stdout." Look through these files to determine where the failure occurred.
