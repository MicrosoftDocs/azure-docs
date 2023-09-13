---
title: Design a Virtualized Network Function (VNF) for Ubuntu
description: Learn how to design a Virtualized Network Function (VNF) for Ubuntu.
author: sherrygonz
ms.author: sherryg
ms.date: 09/13/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Design a Network Service Design (NSD) for Ubuntu Virtual Machine (VM) as a Virtualized Network Function (VNF)

This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Service Design. These actions follow [Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)](quickstart-publish-virtualized-network-function-definition.md).

## Prerequisite: Azure account with active subscription

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

## Create input file

Create an input file for publishing the Network Service Design. Execute the following command to generate the input configuration file for the Network Service Design (NSD).

```azurecli
az aosm nsd generate-config
{
    "publisher_name": "Name of the Publisher resource you want your definition published to. Will be created if it does not exist.",
    "publisher_resource_group_name": "Resource group for the Publisher resource. Will be created if it does not exist.",
    "acr_artifact_store_name": "Name of the ACR Artifact Store resource. Will be created if it does not exist.",
    "location": "Azure location to use when creating resources.",
    "network_functions": [
        {
            "publisher": "The name of the publisher that this NFDV is published under.",
            "publisher_resource_group": "The resource group that the publisher is hosted in.",
            "name": "The name of the existing Network Function Definition Group to deploy using this NSD",
            "version": "The version of the existing Network Function Definition to base this NSD on.  This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.",
            "publisher_offering_location": "The region that the NFDV is published to.",
            "publisher_scope": "The scope that the publisher is published under. Currently, only 'private' is supported.",
            "type": "Type of Network Function. Valid values are 'cnf' or 'vnf'",
            "multiple_instances": "Set to true or false.  Whether the NSD should allow arbitrary numbers of this type of NF.  If set to false only a single instance will be allowed.  Only supported on VNFs, must be set to false on CNFs."
        }
    ],
    "nsdg_name": "Network Service Design Group Name. This is the collection of Network Service Design Versions. Will be created if it does not exist.",
    "nsd_version": "Version of the NSD to be created. This should be in the format A.B.C",
    "nsdv_description": "Description of the NSDV"
}
```
Here's a sample:

```azurecli
{
    "location": "uksouth",
    "publisher_name": "ubuntu-publisher",
    "publisher_resource_group_name": "ubuntu-publisher-rg",
    "acr_artifact_store_name": "ubuntu-acr",
    "network_functions": [
        {
            "name": "ubuntu-vm-nfdg",
            "version": "1.0.0",
            "publisher_offering_location": "uksouth",
            "type": "vnf",
            "multiple_instances": false,
            "publisher": "ubuntu-publisher",
            "publisher_scope": "private",
            "publisher_resource_group": "ubuntu-publisher-rg"
        }
    ],
    "nsdg_name": "ubuntu-nsdg",
    "nsd_version": "1.0.0",
    "nsdv_description": "Plain ubuntu VM"
}
```
## Build the Network Service Design (NSD)

Initiate the build process for the Network Service Definition (NSD) using the following command:

```azurecli
az aosm nsd build -f input.json
```
After the build process completes, review the following generated files to gain insights into the NSD's architecture and structure:

- artifact_manifest.bicep - A bicep template for creating the Publisher and artifact stores.
- configMappings  - Converts the config group values inputs to the deployment parameters required for each Network Function (NF).
- nsd_definition.bicep - A bicep template for creating the Network Service  Design Version (NSDV) itself.
- schemas - Defines to the inputs required in the config group values for this Network Service Design Version (NSDV).
- ubuntu-vm-nfdg_nf.bicep - A bicep template for deploying the Network Function (NF). This template is uploaded to the artifact store.

## Publish the Network Service Design (NSD)

To publish the Network Service Design (NSD) and its associated artifacts, issue the following command:

```azurecli
az aosm nsd publish -f input.json
```
When the Publish process is complete navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

Next, navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

The following resources are created:

- ubuntu-nsdg (ubuntu-publisher/ubuntu-nsdg) - Network Service Design.
- 1.0.0 (ubuntu-publisher/ubuntu-nsdg/1.0.0) - Network Service Design Version.
- ubuntu_nsdg_ConfigGroupSchema (ubuntu-publisher/ubuntu_nsdg_ConfigGroupSchema) - Configuration Group Schema.

## Next steps:

- [Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)](quickstart-virtualized-network-function-operator.md)
