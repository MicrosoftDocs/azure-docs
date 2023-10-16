---
title: Publish an Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)
description: Learn how to publish an Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF) 
author: sherrygonz
ms.author: sherryg
ms.date: 09/26/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)

 This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Function Definition. Its purpose it to demonstrate the workflow of the Publisher Azure Operator Service Manager (AOSM) resources. The basic concepts presented here are meant to prepare users to build more exciting services.

## Prerequisites

- An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

- The Contributor role over this subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role. 

- It's also assumed that you followed the prerequisites in [Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager](quickstart-virtualized-network-function-prerequisites.md)

## Create input file

Execute the following command to generate the input configuration file for the Network Function Definition (NFD).

```azurecli
az aosm nfd generate-config --definition-type vnf
```

Once you execute this command, an input.json file generates.  

> [!NOTE]
>Edit the input.json file, replacing it with the values shown in the sample. Save the file as **input-vnf-nfd.json**.

Here's sample input-vnf-nfd.json file:

```json 
{ 
    "publisher_name": "ubuntu-publisher", 
    "publisher_resource_group_name": "ubuntu-publisher-rg", 
    "nf_name": "ubuntu-vm", 
    "version": "1.0.0", 
    "acr_artifact_store_name": "ubuntu-acr", 
    "location": "uksouth", 
    "blob_artifact_store_name": "ubuntu-blob-store", 
    "image_name_parameter": "imageName", 
    "arm_template": { 
        "file_path": "ubuntu-template.json", 
        "version": "1.0.0" 
    }, 
    "vhd": { 
        "file_path": "livecd.ubuntu-cpc.azure.vhd", 
        "version": "1-0-0" 
    } 

} 
```

| Variable  | Description   |
|---------|---------|
|**publisher_name**|Name of the Publisher resource you want your definition published to. Created if it doesn't exist.
|**publisher_resource_group_name** | Resource group for the Publisher resource. Created if it doesn't exist.
|**acr_artifact_store_name**     |Name of the ACR Artifact Store resource. Created if it doesn't exist.         |
|**location**     |Azure location to use when creating resources.         |
|**nf_name**     |Name of NF definition.         |
|**version**     |Version of the NF definition in A.B.C format.         |
|**blob_artifact_store_name**     |Name of the storage account Artifact Store resource. Created if it doesn't exist.         |
|**image_name_parameter**     | The parameter name in the VM ARM template that specifies the name of the image to use for the VM.        |
|**arm_template**     | artifact_name: Name of the artifact
|    | *file_path*: Optional. File path of the artifact you wish to upload from your local disk. Delete if not required. Relative paths are relative to the configuration file. On Windows escape any backslash with another backslash.      |   
|  | *version*: Version of the artifact. For ARM templates version must be in format A.B.C.
**vhd** |*artifact_name*: Name of the artifact
|  |*file_path*: Optional. File path of the artifact you wish to upload from your local disk. Delete if not required. Relative paths are relative to the configuration file. On Windows escape any backslash with another backslash.
|  |*blob_sas_url*: Optional. SAS URL of the blob artifact you wish to copy to your Artifact Store. Delete if not required.
|  |*version*: Version of the artifact. Version of the artifact. For VHDs version must be in format A-B-C. 

## Build the Network Function Definition (NFD)

To construct the Network Function Definition (NFD), initiate the build process.

```azurecli
az aosm nfd build -f input-vnf-nfd.json --definition-type vnf
```

Once the build is complete, examine the generated files to better understand the Network Function Definition (NFD) structure.

These files are created:

| File  | Description  |
|---------|---------|
|**configMappings** |Maps the deployment parameters for the Network Function Definition Version (NFDV) to the parameters required for the Virtual Machine (VM) ARM template.
|**schemas** | Defines the deployment parameters required to create a Network Function (NF) from this Network Function Definition Version (NFDV).
|**vnfartifactmanifests.bicep** |Bicep template for creating the publisher and artifact stores.
|**Vnfdefinition.bicep** |Bicep template for creating the Network Function Definition Version (NFDV) itself.

> [!NOTE]
> If errors were made, the only option to correct is to re-run the command with the proper selections.

## Publish the Network Function Definition and upload artifacts

Execute the following command to publish the Network Function Definition (NFD) and upload the associated artifacts:

```azurecli
az aosm nfd publish -f input-vnf-nfd.json --definition-type vnf
```

When the command completes, inspect the resources within your Publisher Resource Group to observe the created components and artifacts.

These resources are created:

|Resource Name   | Resource Type  |
|---------|---------|
|**ubuntu-vm-nfdg** | Network Function Definition.
|**1.0.0** |Network Function Definition Version.
|**ubuntu-publisher** |Publisher.
|**ubuntu-vm-acr-manifest-1-0-0** |Publisher Artifact Manifest.
|**ubuntu-vm-nfdg-nf-acr-manifest-1-0-0** |Publisher Artifact Manifest.
|**ubuntu-vm-sa-manifest-1-0-0** |Publisher Artifact Manifest.
|**ubuntu-acr** |Publisher Artifact Store.
|**ubuntu-blob-store** |Publisher Artifact Store.

> [!NOTE]
> The creation of the artifact stores takes about 10 minutes. If the resource already exists, the process is considerably faster.

## Next steps

- [Quickstart: Design a Virtualized Network Function (VNF) Network Service Design](quickstart-virtualized-network-function-network-design.md)
