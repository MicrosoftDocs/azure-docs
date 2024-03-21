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

Azure Operator Service Manager (AOSM) enables publishers of containerized network functions (CNF) and virtualized network functions (VNF) to provide operators with network function definitions (NFDVs) that can be repeatably and reliably deployed on Azure Arc-connected platforms, including Azure Operator Nexus. NFDVs can be composed into network service designs (NSDVs) that abstract and simplify the configuration surface an operator needs to understand when deploying the workload.

AOSM enables these workflows through a flexible and powerful hierarchy of Azure Resource Manager (ARM) resources. A CNF or VNF publisher must onboard their network functions onto AOSM as NFDVs and NSDVs, and test that the resources they have defined can be deployed.

The Azure CLI AOSM Extension provides a convenient, simplified interface for publishers to perform initial onboarding and testing of their CNFs and/or VNFs. It reduces the set of commands a publisher needs to understand and perform into three steps:

1. Generate an input file for the NF onboarding attempt and fill in a small number of simple configuration parameters.
1. Build the AOSM ARM resources required to onboard the CNF or VNF from the Helm charts or VM ARM Template.
1. Publish the built resources. This step both creates Azure resources and uploads the container or VM images to an AOSM managed Azure Container Registry (ACR).

Once one or more NFDs have been published, the publisher can use the CLI to compose the NFDV(s) into an NSDV in an identical manner:

1. Generate an input file for the NSDV onboarding attempt and fill in a small number of simple configuration parameters.
1. Build the AOSM ARM resources required to compose the NFDs into an NSD.
1. Publish the built resources. This step both creates Azure resources and uploads the artifacts needed to deploy the NSDV to an AOSM managed ACR.

The CLI builds the AOSM ARM resources as BICEP files in a clear and well-commented folder structure. These BICEP resources encode AOSM best practice and are designed to minimise the time it takes to deploy the CNF or VNF with AOSM for the first time. Publishers with bespoke requirements can edit the BICEP files before publishing them.

## Supported Network Functions



## Limitations

## Next steps

- Learn how to use the Azure CLI AOSM extension to do advanced configuration handling.
- Use the Azure CLI AOSM Extension to onboard an example [CNF](/quickstart-containerized-network-function-prerequisites.md) or [VNF](/quickstart-virtualized-network-function-prerequisites.md).
- Learn how to [onboard your CNF](/how-to-onboard-a-cnf-using-the-azure-cli.md) to AOSM using the Azure CLI AOSM extension.
- Learn how to [onboard your VNF](/how-to-onboard-a-vnf-using-the-azure-cli.md) to AOSM using the Azure CLI AOSM extension.
