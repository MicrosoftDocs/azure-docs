---
title: Azure Arc resource bridge overview
description: Learn how to use Azure Arc resource bridge to support VM self-servicing on Azure Stack HCI, VMware, and System Center Virtual Machine Manager.
ms.date: 09/17/2021
ms.topic: overview
---

# What is Azure Arc resource bridge?

Azure Arc resource bridge supports VM self-servicing and management from Azure, for virtualized Windows and Linux virtual machines running in a hybrid environment on [Azure Stack HCI](/azure-stack/hci/overview) and VMware. The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster that requires no user management. This virtual appliance delivers the following benefits:

* Enables VM self-servicing from Azure without having to create and manage a Kubernetes cluster
* It is fully supported by Microsoft, including update of core components. 
* Designed to recover from software failures.
* Supports deployment to any private cloud hosted on Hyper-V or VMware from the Azure portal or using the Azure CLI.

All management operations are performed from Azure, no local configuration is required on the appliance.

## Prerequisites

### Private cloud environments

### Security

### Networking

## Next steps
