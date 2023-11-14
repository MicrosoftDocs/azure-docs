---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 11/03/2023
 ms.author: dobett
ms.custom:
  - include file
  - ignite-2023
---

[Azure Kubernetes Service Edge Essentials](/azure/aks/hybrid/aks-edge-overview) is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience, making it easy for you to deploy Kubernetes on PC-class or "light" edge hardware.

Review the [AKS Edge Essentials requirements and support matrix](/azure/aks/hybrid/aks-edge-system-requirements) for additional prerequisites, specifically the system and OS requirements.

Use the [AksEdgeQuickStartForAio.ps1](https://github.com/Azure/AKS-Edge/blob/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1) to download AKS Edge Essentials and start your cluster. Depending on the policy setup on your machine, you might have to unblock the file before running and run Set-ExecutionPolicy to allow the script execution.

Open an elevated PowerShell window, and change directory to a working folder, then run the following commands:

```powershell
$url = "https://raw.githubusercontent.com/Azure/AKS-Edge/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1"
Invoke-WebRequest -Uri $url -OutFile .\AksEdgeQuickStartForAio.ps1
Unblock-File .\AksEdgeQuickStartForAio.ps1
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
```

This script automates the following steps:

* Downloads the GitHub archive of Azure/AKS-Edge into the working folder and unzips to a folder AKS-Edge-main (or AKS-Edge-\<tag>). By default, the script downloads the **main** branch.
* Validates that the correct az cli version is installed and ensures that az cli is logged into Azure.
* Downloads and installs the AKS Edge Essentials MSI.
* Installs required host OS features (Install-AksEdgeHostFeatures). The machine might reboot when Hyper-V is enabled, and you must restart the script again.
* Deploys a single machine cluster with internal switch (Linux node only).
* Creates the Azure resource group in your Azure subscription to store all the resources.
* Connects the cluster to Azure Arc and registers the required Azure resource providers.
* Applies all the required configurations for Azure IoT Operations, including:
  * Enables a firewall rule and port forwarding for port 8883 to enable incoming connections to Azure IoT Operations MQ broker.
  * Installs Storage local-path provisioner.
  * Enables node level metrics to be picked up by Azure Managed Prometheus.

In an elevated PowerShell prompt, run the AksEdgeQuickStartForAio.ps1 script. This script brings up a K3s cluster. Replace the placeholder parameters with your own information.

   | Placeholder | Value |
   | ----------- | ----- |
   | **SUBSCRIPTION_ID** | ID of the subscription where your resource group and Arc-enabled cluster will be created. |
   | **TENANT_ID** | ID of the Microsoft Entra tenant. |
   | **RESOURCE_GROUP_NAME** | A name for a new resource group. |
   | **LOCATION** | An Azure region close to you. The following regions are supported in public preview: East US2, West US 3, West Europe, East US, West US, West US 2, North Europe. |
   | **CLUSTER_NAME** | A name for a new managed cluster. |

   ```powerShell
   .\AksEdgeQuickStartForAio.ps1 -SubscriptionId "<SUBSCRIPTION_ID>" -TenantId "<TENANT_ID>" -ResourceGroupName "<RESOURCE_GROUP_NAME>"  -Location "<LOCATION>"  -ClusterName "<CLUSTER_NAME>"
   ```

When the script is completed, it brings up an Arc-enabled K3s cluster on your machine.
