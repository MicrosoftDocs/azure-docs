---
title: About the Azure Operator Service Manager CLI extension
description: Learn about the Azure Operator Service Manager CLI extension.
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-service-manager
ms.topic: concept-article
ms.date: 03/20/2024
---
# About the Azure Operator Service Manager CLI extension

Azure Operator Service Manager (AOSM) enables publishers of containerized network functions (CNF) and virtualized network functions (VNF) to provide operators with network function definitions (NFDVs) that can be reliably deployed on Azure Arc-connected platforms, including Azure Operator Nexus. NFDVs can be composed into network service designs (NSDVs) that abstract and simplify the configuration surface an operator needs to understand when deploying the workload.

AOSM enables these workflows through a flexible and powerful hierarchy of Azure Resource Manager (ARM) resources. A CNF or VNF publisher must onboard their network functions onto AOSM as NFDVs and NSDVs, and test that the resources they have defined can be deployed.

The Azure CLI AOSM Extension provides a convenient, simplified interface for publishers to perform initial onboarding and testing of their CNFs and/or VNFs.

## Key features

- **CNF and VNF support** - Onboard both single and multi-helm CNFs, as well as single-VM VNFs.

- **Automated BICEP generation** - Fill in a minimal configuration file and generate the BICEP definitions for the AOSM resources needed to onboard an NF to AOSM. The CLI automatically handles the network of resource references and reduces both the time to write the BICEP resources and the chance of error. The BICEP files are generated in a clear and well-commented folder structure.

- **Streamlined publishing** - Deploy the AOSM resources, upload your network function images, and build upload your Azure Resource Manager (ARM) templates with a single command.

- **Simplified commands** - The Az CLI AOSM extension collapses the API calls needed to onboard a network function (NF) to AOSM into three commands for NFDV onboarding, and three similar commands for NSDV onboarding.

- **Optimized for initial testing** - The CLI builds AOSM resources which are optimized for simplicity and for accelerating the publish, deploy, test feedback loop.

## Next Steps

- Use the Azure CLI AOSM Extension to onboard an example [CNF](quickstart-containerized-network-function-prerequisites.md) or [VNF](quickstart-virtualized-network-function-prerequisites.md).
- Learn how to [onboard your CNF](how-to-onboard-containerized-network-function-cli.md) to AOSM using the Azure CLI AOSM extension.
- Learn how to [onboard your VNF](how-to-onboard-virtualized-network-function-cli.md) to AOSM using the Azure CLI AOSM extension.
