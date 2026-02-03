---
title: Frequently asked questions about Azure Container Storage
description: Get answers to Azure Container Storage frequently asked questions (FAQ).
author: khdownie
ms.service: azure-container-storage
ms.date: 09/03/2025
ms.author: kendownie
ms.topic: faq
ms.custom: references_regions
# Customer intent: "As a cloud architect, I want to understand the capabilities and limitations of Azure Container Storage, so that I can effectively plan and optimize stateful container applications on Azure Kubernetes Service."
---

# Frequently asked questions (FAQ) about Azure Container Storage

Azure Container Storage is a cloud-based volume management, deployment, and orchestration service built natively for containers.

## General questions

* <a id="azure-container-storage-versions"></a>
  **What's the difference between Azure Container Storage version 2.x.x and version 1.x.x?**
  Azure Container Storage (version 2.x.x) features a lighter weight, on-demand installation, and optimized resource utilization. However, version 2.x.x currently only supports Ephemeral Disk (Local NVMe) as backing storage, whereas version 1.x.x supports Azure Disks, Ephemeral Disk, and Azure Elastic SAN.

* <a id="azure-container-storage-applicability"></a>
  **What changes between Azure Container Storage versions 2.0.x and 2.1.x+?**
  If you use Azure Container Storage version 2.0.x and disable autoupgrade, use this table to understand what gets installed on your AKS cluster.

  | Azure Container Storage version | Storage types supported | Installer present | Driver installation trigger |
  |---|---|---|---|
  | 2.0.x | Local NVMe | No | Installed during `--enable-azure-container-storage` |
  | 2.1.x and later | Local NVMe and Elastic SAN | Yes | Via storage type selection during enable or by creating a StorageClass (installer-only flow) |

* <a id="azure-container-storage-install-models"></a>
  **What installation models are available in version 2.1.x and later?**
  Azure Container Storage supports two installation flows.

  **Installer-only (choose storage later)**  
  Use this option when you want Azure Container Storage installed but plan to decide the storage backend later.

  ```azurecli
  az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage
  ```

  **Behavior:**
  - Installs only the installer.
  - No storage-specific driver or node agent is installed initially.
  - Creating a StorageClass later triggers the correct CSI driver installation.

  **Installer + storage type(s)**  
  Use this option when you know the backend(s) required.

  ```azurecli
  az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-types>
  ```

  Example:

  ```azurecli
  az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage ephemeralDisk,elasticSan
  ```

  **Behavior:**
  - Installs the installer plus the selected CSI driver(s).
  - Creates default StorageClass objects if none exists.
  - Supports comma-separated storage types.

  Supported storage types for version 2.1.0 and later: `ephemeralDisk` (local NVMe) and `elasticSan` (Azure Elastic SAN).

* <a id="azure-container-storage-install-models-terraform"></a>
  **How do installation models work with Terraform?**
  The extension configuration supports the same flows as Azure CLI:

  - **Installer-only (choose storage later):** Set `enable-azure-container-storage` to `true`. Create a StorageClass later to trigger driver installation.
  - **Installer + storage type(s):** Set `enable-azure-container-storage` to a storage type value such as `ephemeralDisk`, `elasticSan`, or a comma-separated list like `ephemeralDisk,elasticSan`. This installs the installer and the selected CSI drivers.

  Supported storage types for version 2.1.0 and later: `ephemeralDisk` (local NVMe) and `elasticSan` (Azure Elastic SAN).

* <a id="azure-container-storage-components"></a>
  **What components are installed in installer-only mode?**
  Installer-only mode creates the installer and telemetry deployments in the `kube-system` namespace, but doesn't install any CSI drivers or node agents until you enable a storage type or create a StorageClass.

  | Component | Resource type | Name | Description |
  |---|---|---|---|
  | Installer | Deployment | acstor-cluster-manager | Core controller that watches StorageClass objects and orchestrates CSI driver lifecycle |
  | Telemetry | Deployment | acstor-geneva | Internal monitoring and telemetry containers |

* <a id="azure-container-storage-driver-install"></a>
  **When are CSI drivers installed?**
  If you enable a storage type during installation, the driver installs immediately and default StorageClass objects are created if missing. If you choose installer-only, the driver installs when you create a StorageClass (or if a StorageClass already exists).

* <a id="azure-container-storage-driver-components"></a>
  **What gets installed when a CSI driver is enabled?**
  When you enable a storage type or create a StorageClass, Azure Container Storage installs the storage-specific CSI driver plus supporting components.

  | Component | Resource type | Name | Description |
  |---|---|---|---|
  | CSI driver | HelmRelease | acstor-local-csi-driver or acstor-azuresan-csi-driver | The storage-specific CSI driver |
  | Node agent | DaemonSet | acstor-node-agent | Runs on storage nodes for metrics collection |
  | OpenTelemetry (OTel) collector | DaemonSet | acstor-otel-collector | Collects logs and metrics from nodes |

* <a id="azure-container-storage-driver-resources"></a>
  **What Kubernetes resources do the Elastic SAN and local NVMe CSI drivers create?**

  Elastic SAN CSI driver:

  | Resource | Name | Purpose |
  |---|---|---|
  | DaemonSet | azuresan-csi-driver | Runs CSI pods on each node |

  Local NVMe CSI driver:

  | Resource | Name | Purpose |
  |---|---|---|
  | DaemonSet | csi-local-node | Runs CSI driver pods on each node |
  | Deployment | csi-local-manager | Webhook and PV cleanup controller |

  The `csi-local-manager` deployment prefers the system node pool.

* <a id="azure-container-storage-node-scheduling"></a>
  **How are Azure Container Storage components scheduled?**
  CSI drivers run according to StorageClass affinity. The node agent runs wherever a driver is present, and the installer prefers system node pools.

* <a id="azure-container-storage-vs-csi-drivers"></a>
  **What's the difference between Azure Container Storage and Azure CSI (Container Storage Interface) drivers?**  
  Azure Container Storage supports backing storage options that other Azure CSI drivers don't support, such as Ephemeral Disk (Local NVMe). All of these drivers are designed to work seamlessly with AKS and are open source. 

* <a id="azure-container-storage-regions"></a>
  **In which Azure regions is Azure Container Storage available?**  
  [!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

* <a id="azure-container-storage-update"></a>
  **If I already have Azure Container Storage preview installed on my AKS cluster, how can I update to the latest GA version?**  
  If you have autoupgrade turned on, Azure Container Storage updates to the latest version automatically. If you don't have autoupgrade turned on, we recommend updating to the latest generally available (GA) version by running the following command. Remember to replace `<cluster-name>` and `<resource-group>` with your own values.

  ```azurecli-interactive
  az k8s-extension update --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name azurecontainerstorage --version 1.1.0 --auto-upgrade false --release-train stable
  ```

* <a id="azure-container-storage-autoupgrade"></a>
  **Is there any performance impact when upgrading to a new version of Azure Container Storage?**  
  If you leave autoupgrade turned on (recommended), you might experience temporary I/O latency during the upgrade process. If you turn off autoupgrade and install the new version manually, there isn't any impact; however, you don't get the benefit of automatic upgrades and instant access to new features.

* <a id="storage-pool-parameters"></a>
  **What parameters can I specify for the storage pool that's created when Azure Container Storage (version 1.x.x) is installed with the `az aks create` command?**  
  Refer to [this article](container-storage-storage-pool-parameters.md) for the mandatory and optional storage pool parameters, along with their default values.

* <a id="azure-container-storage-limitations"></a>
  **Which other Azure services does Azure Container Storage support?**  
  Currently, Azure Container Storage supports only Azure Kubernetes Service (AKS).

* <a id="azure-container-storage-rwx"></a>
  **Does Azure Container Storage support read-write-many (RWX) workloads?**  
  Azure Container Storage doesn't support read-write-many (RWX) workloads. However, Azure's first-party Files and Blob CSI drivers are great alternatives and fully supported.

* <a id="azure-container-storage-remove"></a>
  **How do I remove Azure Container Storage?**  
  To remove Azure Container Storage (version 2.x.x), see [Remove Azure Container Storage](remove-container-storage.md). To remove Azure Container Storage (version 1.x.x), see [this article](remove-container-storage-version-1.md).

* <a id="azure-container-storage-containeros"></a>
  **Does Azure Container Storage support Windows containers on AKS?**  
  No, Azure Container Storage only supports AKS containers running on Ubuntu and Azure Linux nodes.

* <a id="azure-container-storage-ephemeralosdisk"></a>
  **Does Azure Container Storage use the capacity from Ephemeral OS disks for ephemeral disk storage pool?**  
  No, Azure Container Storage only discovers and uses the capacity from ephemeral data disks for ephemeral disk storage pool.

* <a id="azure-container-storage-arm"></a>
  **Does Azure Container Storage support ARM node pools?**  
  Currently, Azure Container Storage doesn't support ARM node pools. Our supported architectures are AMD64/x86-64.

* <a id="azure-container-storage-endpoints"></a>
  **What endpoints need to be allowlisted in the Azure Firewall for Azure Container Storage to work?**

  To ensure Azure Container Storage functions correctly, you must allowlist specific endpoints in your Azure Firewall. These endpoints are required for Azure 
  Container Storage components to communicate with necessary Azure services. Failure to allowlist these endpoints can cause installation or runtime issues.
 
  Endpoints to Allowlist:

  `linuxgeneva-microsoft.azurecr.io`,
  `eus2azreplstore137.blob.core.windows.net`,
  `eus2azreplstore70.blob.core.windows.net`,
  `eus2azreplstore155.blob.core.windows.net`,
  `eus2azreplstore162.blob.core.windows.net`,
  `*.hcp.eastus2.azmk8s.io`,
  `management.azure.com`,
  `login.microsoftonline.com`,
  `packages.microsoft.com`,
  `acs-mirror.azureedge.net`,
  `eastus2.dp.kubernetesconfiguration.azure.com`,
  `mcr.microsoft.com`.

  For more information, see [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters](/azure/aks/outbound-rules-control-egress) and [Azure Arc-enabled Kubernetes network requirements](/azure/azure-arc/kubernetes/network-requirements?tabs=azure-cloud).

* <a id="azure-container-storage-sla"></a>
  **Is there a service-level agreement (SLA) for Azure Container Storage?**

  Azure Container Storage is an orchestration solution of underlying storage options including Ephemeral Disks, Azure Elastic SAN, and Azure Disks. Azure Container Storage doesn't provide an service-level agreement (SLA). However an SLA is offered for each storage option. See [Microsoft Service Level Agreements for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
