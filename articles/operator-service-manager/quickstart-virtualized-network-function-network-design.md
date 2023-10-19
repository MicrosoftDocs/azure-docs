---
title: Design a Virtualized Network Function (VNF) for Ubuntu
description: Learn how to design a Virtualized Network Function (VNF) for Ubuntu.
author: sherrygonz
ms.author: sherryg
ms.date: 10/19/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Design a Network Service Design (NSD) for Ubuntu Virtual Machine (VM) as a Virtualized Network Function (VNF)

This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Service Design.

## Prerequisites

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

It's also assumed that you followed the prerequisites in [Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)](quickstart-publish-virtualized-network-function-definition.md).

## Create input file

Create an input file for publishing the Network Service Design. Execute the following command to generate the input configuration file for the Network Service Design (NSD).

```azurecli
az aosm nsd generate-config
```

Once you execute this command an input.json file generates.

> [!NOTE]
> Edit the input.json file, replacing it with the values shown in the sample. Save the file as **input-vnf-nsd.json**.

```json
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
            "publisher_resource_group": "ubuntu-publisher-rg"
        }
    ],
    "nsd_name": "ubuntu-nsdg",
    "nsd_version": "1.0.0",
    "nsdv_description": "Plain ubuntu VM"
}
```

|Variable  |Description  |
|---------|---------|
|**publisher_name**     |  Name of the Publisher resource you want your definition published to. Created if it doesn't exist.       |
|**publisher_resource_group_name**     |  Resource group for the Publisher resource. Created if it doesn't exist.       |
|**acr_artifact_store_name**     |    Name of the ACR Artifact Store resource. Created if it doesn't exist.     |
|**location**      |      Azure location to use when creating resources.   |
|**network-functions**   |  *publisher*:   The name of the publisher that this NFDV is published under.     |
|   |      *publisher_resource_group*: The resource group that the publisher is hosted in.   | 
|    |   *name*:   The name of the existing Network Function Definition Group to deploy using this NSD.    |
|    |    *version*:   The version of the existing Network Function Definition to base this NSD on. This NSD is able to deploy any NFDV with deployment parameters compatible with this version.   |
|     |     *publisher_offering_location*:  The region that the NFDV is published to.  |
|    |  *type*:   Type of Network Function. Valid values are cnf or vnf.     |
|    |    *multiple_instances*: Valid values are true or false.  WhetherControls if the NSD should allow arbitrary numbers of this type of NF.  If set to false only a single instance is allowed. Only supported on VNFs. For CNFs, set to false.     |
|**nsd_name**     |    Network Service Design Group Name. The collection of Network Service Design Versions. Created if it doesn't exist.     |
|**nsd_version**    |   Version of the NSD to be created. The format should be A.B.C.      |
|**nsdv_description**     |  Description of the NSDV.       |


## Build the Network Service Design (NSD)

Initiate the build process for the Network Service Definition (NSD) using the following command:

```azurecli
az aosm nsd build -f input-vnf-nsd.json
```
After the build process completes, review the following generated files to gain insights into the NSD's architecture and structure. 

These files are created in a subdirectory called **nsd-bicep-templates**:

|Files  |Description  |
|---------|---------|
|**artifact_manifest.bicep**     |   A bicep template for creating the Publisher and artifact stores.      |
|**configMappings**     |      A directory containing files that convert the config group values inputs to the deployment parameters required for each NF.   |
|**nsd_definition.bicep**     |   A bicep template for creating the NSDV itself.      |
|**schemas**    | A directory containing files that define to the inputs required in the config group values for this NSDV.    |
|**ubuntu-vm-nfdg_nf.bicep**    |   A bicep template for deploying the NF.  Uploaded to the artifact store.      |

## Publish the Network Service Design (NSD)

To publish the Network Service Design (NSD) and its associated artifacts, issue the following command:

```azurecli
az aosm nsd publish -f input-vnf-nsd.json
```
When the Publish process is complete navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

These resources are created:

|Resource Name  |Resource Type  |
|---------|---------|
|**ubuntu-nsdg**    |    The Network Service Design.     |
|**1.0.0 (ubuntu-nsdg/1.0.0)**     |   The   Network Service Design Version.    |
|**ubuntu-vm-nfdg-nf-acr-manifest-1-0-0** |Publisher Artifact Manifest.
|**ubuntu_nsdg_ConfigGroupSchema**     |    The Configuration Group Schema.     |

## Next steps:

- [Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)](quickstart-virtualized-network-function-operator.md)
