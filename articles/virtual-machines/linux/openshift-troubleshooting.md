---
title: Troubleshooting OpenShift Deployment in Azure | Microsoft Docs
description: Troubleshooting OpenShift deployment in Azure
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

# Troubleshooting OpenShift deployment in Azure

If the OpenShift cluster does not deploy successfully, there are some troubleshooting tasks that can be done to narrow down the issue. View the deployment status and compare against the following list of Exit Codes.

- Exit Code 3: Your Red Hat Subscription User Name / Password or Organization ID / Activation Key is incorrect
- Exit Code 4: Your Red Hat Pool ID is incorrect or there are no entitlements available
- Exit Code 5: Unable to provision Docker Thin Pool Volume
- Exit Code 6: OpenShift Cluster installation failed
- Exit Code 7: OpenShift Cluster installation succeeded but Azure Cloud Provider configuration failed - master config on Master Node issue
- Exit Code 8: OpenShift Cluster installation succeeded but Azure Cloud Provider configuration failed - node config on Master Node issue
- Exit Code 9: OpenShift Cluster installation succeeded but Azure Cloud Provider configuration failed - node config on Infra or App Node issue
- Exit Code 10: OpenShift Cluster installation succeeded but Azure Cloud Provider configuration failed - correcting Master Nodes or not able to set Master as unschedulable
- Exit Code 11: Metrics failed to deploy
- Exit Code 12: Logging failed to deploy

For Exit Codes 7 - 10, the OpenShift Cluster did install but the Azure Cloud Provider configuration failed. You can SSH to the Master Node (Origin) or Bastion Node (Container Platform) and from there SSH to each of the nodes in the cluster and fix the issues.

A common cause for the failures with Exit Codes 7 - 9 is the Service Principal did not have proper permissions to the Subscription or the Resource Group. If this is indeed the issue, then assign the correct permissions and manually rerun the script that failed an all subsequent scripts.
Be sure to restart the service that failed (for example, systemctl restart atomic-openshift-node.service) before executing the scripts again.

For further troubleshooting, SSH into your Master Node on port 2200 (Origin) or Bastion Node on port 22 (Container Platform). You need to be root (sudo su -) and then navigate to the following directory: /var/lib/waagent/custom-script/download

You should see a folder named '0' and '1'. In each of these folders, you see two files, stderr and stdout. You can look through these files to determine where the failure occurred.
