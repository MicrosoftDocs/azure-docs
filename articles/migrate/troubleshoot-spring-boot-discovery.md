---
title: Troubleshoot common issues during discovery and assessment of Spring Boot apps
description: Learn how to troubleshoot Azure Spring Apps issues in Azure Migrate
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: tutorial
ms.date: 09/28/2023
ms.custom: engagement-fy23
---


# Troubleshoot common issues during discovery and assessment of Spring Boot apps (preview)

For errors related to the access policy on the Key Vault, follow these steps to find the Principal ID of the appliance extension running on the connected cluster. 

## Assigning required Key Vault permissions to Migrate appliance extension 
 
1.	Go to your Azure Migrate project. 
2.	Navigate to Azure Migrate: Discovery and assessment> **Overview** > **Manage** > **Appliances** and find the name of the Kubernetes-based appliance whose service principal you need to find. 
 
3.	You can also find the Key Vault associated with the appliance by selecting the appliance name and finding the Key Vault name in appliance properties. 
4.	Go to your workstation and open PowerShell as an administrator.
5.	Install the [ARM Client](https://github.com/projectkudu/ARMClient/releases/download/v1.9/ARMClient.zip) zip folder.
6.	Unzip the folder and on a PowerShell window, switch to the directory with the extracted folder. 
7.	Run the following command to sign in to your Azure subscription:  `armclient login` 
8.	After successfully signing in, run the following command by adding the appliance name: 
 
```
armclient get /subscriptions/<subscription>/resourceGroups/<resourceGroup> /providers/Microsoft.Kubernetes/connectedClusters/<applianceName>/Providers/Microsoft.KubernetesConfiguration/extensions/credential-sync-agent   ?api-version=2022-03-01
```

9. The response lists down the identity associated with the Appliance extension. Note down the `Principal ID` field in the response under the`identity` section. 
10.	Go to Azure portal and check if the Principal ID has the required access on the Azure Key Vault, chosen for secret processing. 
11.	Go to the Key Vault, go to access policies, select the Principal ID from list and check the permissions it has OR create a new access policy specifically for the Principal ID you found by running the command above. 
12.	Ensure that following permissions are assigned to the Principal ID: *Secret permission* and both *Secret Management Operations and Privileged Management Operations*.

**Error Code** | **Action**
---- | ----
**Supported Linux OS** | Check if the credentials exist on the Key Vault <name>. Ensure that the extension identity for <Microsoft.ConnectedCredentials > has required permissions to delete the credentials from Key Vault. [Learn more](https://go.microsoft.com/fwlink/?linkid=2237575).
**Hardware configuration required** | 6 GB RAM, with 30GB storage on root volume, 4 Core CPU
**Network Requirements** | Access to the following endpoints: <br/><br/> https://dc.services.visualstudio.com/v2/track <br/><br/> [Azure CLI endpoints for proxy bypass](https://learn.microsoft.com/cli/azure/azure-cli-endpoints?tabs=azure-cloud)

## Next steps
Set up an appliance for [VMware](how-to-set-up-appliance-vmware.md), [Hyper-V](how-to-set-up-appliance-hyper-v.md), or [physical servers](how-to-set-up-appliance-physical.md).

