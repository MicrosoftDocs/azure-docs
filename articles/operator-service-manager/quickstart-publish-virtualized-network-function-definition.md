---
title: Publish an Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)
description: Learn how to publish an Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)
author: sherrygonz
ms.author: sherryg
ms.date: 10/19/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)

This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Function Definition. Its purpose is to demonstrate the workflow of the Publisher Azure Operator Service Manager (AOSM) resources. The basic concepts presented here are meant to prepare users to build more exciting services.

## Prerequisites

- An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

- The Contributor role over this subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.

- It's also assumed that you followed the prerequisites in [Quickstart: Complete the prerequisites to deploy a Virtualized Network Function in Azure Operator Service Manager](quickstart-virtualized-network-function-prerequisites.md)

## Create input file

Execute the following command to generate the input configuration file for the Network Function Definition (NFD).

```azurecli
az aosm nfd generate-config --definition-type vnf
```

Once you execute this command, a vnf-input.jsonc file is generated.

> [!NOTE]
> Edit the vnf-input.jsonc file, replacing it with the values shown in the sample. Save the file as **input-vnf-nfd.jsonc**.

Here is a sample input-vnf-nfd.jsonc file:

```json
{
  // Azure location to use when creating resources e.g uksouth
  "location": "uksouth",
  // Name of the Publisher resource you want your definition published to.
  // Will be created if it does not exist.
  "publisher_name": "ubuntu-publisher",
  // Resource group for the Publisher resource.
  // Will be created if it does not exist
  "publisher_resource_group_name": "ubuntu-publisher-rg",
  // Name of the ACR Artifact Store resource.
  // Will be created if it does not exist.
  "acr_artifact_store_name": "ubuntu-acr",
  // Name of the network function.
  "nf_name": "ubuntu-vm",
  // Version of the network function definition in 1.1.1 format (three integers separated by dots).
  "version": "1.0.0",
  // If set to true, all NFD configuration parameters are made available to the designer, including optional parameters and those with defaults.
  // If not set or set to false, only required parameters without defaults will be exposed.
  "expose_all_parameters": false,
  // Optional. Name of the storage account Artifact Store resource.
  // Will be created if it does not exist (with a default name if none is supplied).
  "blob_artifact_store_name": "ubuntu-blob-store",
  // ARM template configuration. The ARM templates given here would deploy a VM if run. They will be used to generate the VNF.
  "arm_templates": [
    {
      // Name of the artifact. Used as internal reference only.
      "artifact_name": "ubuntu-template",
      // Version of the artifact in 1.1.1 format (three integers separated by dots).
      "version": "1.0.0",
      // File path (absolute or relative to this configuration file) of the artifact you wish to upload from your local disk.
      // Use Linux slash (/) file separator even if running on Windows.
      "file_path": "ubuntu-template.json"
    }
  ],
  // VHD image configuration.
  "vhd": {
    // Optional. Name of the artifact. Name will be generated if not supplied.
    "artifact_name": "",
    // Version of the artifact in A-B-C format. Note the '-' (dash) not '.' (dot).
    "version": "1-0-0",
    // Supply either file_path or blob_sas_url, not both.
    // File path (absolute or relative to this configuration file) of the artifact you wish to upload from your local disk.
    // Leave as empty string if not required. Use Linux slash (/) file separator even if running on Windows.
    "file_path": "livecd.ubuntu-cpc.azure.vhd",
    // Optional. Specifies the size of empty data disks in gigabytes.
    // This value cannot be larger than 1023 GB. Delete if not required.
    "image_disk_size_GB": "30",
    // Optional. Specifies the HyperVGenerationType of the VirtualMachine created from the image.
    // Valid values are V1 and V2. V1 is the default if not specified. Delete if not required.
    "image_hyper_v_generation": "V1",
    // Optional. The ARM API version used to create the Microsoft.Compute/images resource.
    // Delete if not required.
    "image_api_version": "2023-03-01"
  }
}
```

| Variable                          | Description                                                                                                                                                                                                                      |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **publisher_name**                | Name of the Publisher resource you want your definition published to. Created if it doesn't exist.                                                                                                                               |
| **publisher_resource_group_name** | Resource group for the Publisher resource. Created if it doesn't exist.                                                                                                                                                          |
| **acr_artifact_store_name**       | Name of the ACR Artifact Store resource. Created if it doesn't exist.                                                                                                                                                            |
| **location**                      | Azure location to use when creating resources.                                                                                                                                                                                   |
| **nf_name**                       | Name of NF definition.                                                                                                                                                                                                           |
| **version**                       | Version of the NF definition in A.B.C format.                                                                                                                                                                                    |
| **blob_artifact_store_name**      | Name of the storage account Artifact Store resource. Created if it doesn't exist.                                                                                                                                                |
| **expose_all_parameters**         | Whether or not to make all NFD configuration parameters available to the designer.                                                                                                                                               |
| **arm_template**                  | artifact_name: Name of the artifact.                                                                                                                                                                                             |
|                                   | _file_path_: Optional. File path of the artifact you wish to upload from your local disk. Delete if not required. Relative paths are relative to the configuration file. On Windows escape any backslash with another backslash. |
|                                   | _version_: Version of the artifact. For ARM templates version must be in format A.B.C.                                                                                                                                           |
| **vhd**                           | _artifact_name_: Name of the artifact.                                                                                                                                                                                           |
|                                   | _file_path_: Optional. File path of the artifact you wish to upload from your local disk. Delete if not required. Relative paths are relative to the configuration file. On Windows escape any backslash with another backslash. |
|                                   | _blob_sas_url_: Optional. SAS URL of the blob artifact you wish to copy to your Artifact Store. Delete if not required.                                                                                                          |
|                                   | _version_: Version of the artifact. Version of the artifact. For VHDs version must be in format A-B-C.                                                                                                                           |
|                                   | _"image_disk_size_GB_: Optional. Specifies the size of empty data disks in gigabytes. This value cannot be larger than 1023 GB. Delete if not required.                                                                          |
|                                   | _image_hyper_v_generation_: Optional. Specifies the HyperVGenerationType of the VirtualMachine created from the image. Valid values are V1 and V2. V1 is the default if not specified. Delete if not required.                   |
|                                   | _image_api_version_: Optional. The ARM API version used to create the Microsoft.Compute/images resource. Delete if not required.                                                                                                 |

> [!NOTE]
> When using the file_path option, it's essential to have a reliable internet connection with sufficient upload bandwidth, as the VHD images are typically very large.
> [!IMPORTANT]
> Each variable described in the previous table must be unique. For instance, the resource group name cannot already exist, and publisher and artifact store names must be unique in the region.

## Build the Network Function Definition (NFD)

To construct the Network Function Definition (NFD), initiate the build process.

```azurecli
az aosm nfd build --config-file input-vnf-nfd.jsonc --definition-type vnf
```

Once the build is complete, examine the generated files to better understand the Network Function Definition (NFD) structure.

These files are created in a subdirectory called **vnf-cli-output**:

| Directory / File                             | Description                                                                                                                                                                                                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **vnf-cli-output/artifactManifest**          |                                                                                                                                                                                                                                                                                                                                   |
| deploy.bicep                                 | Bicep template to create artifact manifest, with artifacts populated from input file                                                                                                                                                                                                                                              |
| **vnf-cli-output/artifacts**                 |                                                                                                                                                                                                                                                                                                                                   |
| artifacts.json                               | List of artifacts (images and ARM templates) to be uploaded on publish. Correlates with the artifact manifest                                                                                                                                                                                                                     |
| **vnf-cli-output/base**                      |                                                                                                                                                                                                                                                                                                                                   |
| deploy.bicep                                 | Bicep template to create underlying AOSM resources needed to spin up an NF (publisher, acr, nfdg)                                                                                                                                                                                                                                 |
| **vnf-cli-output/nfDefinition**              |                                                                                                                                                                                                                                                                                                                                   |
| deploy.bicep                                 | Bicep to create the Network Function Definition Version (NFDV), with network function application information from the ARM template provided in input file                                                                                                                                                                        |
| deployParameters.json                    | Schema defining deployment parameters required to create a Network Function (NF) from this Network Function Definition Version (NFDV)                                                                                                                                                                                             |
| \<arm-template-name>-templateParameters.json | File contains the deployment parameters provided to the Network Function Definition Version (NFDV) mapped to the parameters required for the Virtual Machine (VM) ARM template. These VM ARM template parameters are sourced from the ARM templates provided in the input file                                                    |
| vhdParameters.json                           | File contains the deployment parameters provided to the Network Function Definition Version (NFDV) mapped to the parameters required for the VHD image. The VHD configuration parameters are sourced from the VHD section of the input file                                                                                       |
| **vnf-cli-output**                           |                                                                                                                                                                                                                                                                                                                                   |
| all_deploy.parameters.json                   | Superset of all NF's deploy parameters, providing a single file to customize resource names. The values output to this file by the build command are taken from the vnf-input.jsonc file, but may be edited in this file before running publish, for example to publish to a different location or use a different publisher name |
| index.json                                   | File used internally when publishing resources. Do not edit                                                                                                                                                                                                                                                                       |

> [!NOTE]
> If errors were made, the only option to correct is to re-run the command with the proper selections.

## Publish the Network Function Definition and upload artifacts

Execute the following command to publish the Network Function Definition (NFD) and upload the associated artifacts:

```azurecli
az aosm nfd publish --build-output-folder vnf-cli-output --definition-type vnf
```

When the command completes, inspect the resources within your Publisher Resource Group to observe the created components and artifacts.

These resources are created:

| Resource Name                    | Resource Type                        |
| -------------------------------- | ------------------------------------ |
| **ubuntu-vm**                    | Network Function Definition.         |
| **1.0.0**                        | Network Function Definition Version. |
| **ubuntu-publisher**             | Publisher.                           |
| **ubuntu-vm-acr-manifest-1-0-0** | Publisher Artifact Manifest.         |
| **ubuntu-vm-sa-manifest-1-0-0**  | Publisher Artifact Manifest.         |
| **ubuntu-acr**                   | Publisher Artifact Store.            |
| **ubuntu-blob-store**            | Publisher Artifact Store.            |

## Next steps

- [Quickstart: Design a Virtualized Network Function (VNF) Network Service Design](quickstart-virtualized-network-function-network-design.md)
