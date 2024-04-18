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

You must follow the prerequisites in [Quickstart: Publish Ubuntu Virtual Machine (VM) as Virtual Network Function (VNF)](quickstart-publish-virtualized-network-function-definition.md).

## Create input file

Create an input file for publishing the Network Service Design. Execute the following command to generate the input configuration file for the Network Service Design (NSD).

```azurecli
az aosm nsd generate-config
```

An `nsd-input.jsonc` file is generated when you run this command.

> [!NOTE]
> Edit the nsd-input.jsonc file, replacing it with the values shown in the sample. Remove the section where resource_element_type is set to ArmTemplate. This is for adding infrastructure (such as VNets) to more complicated NSDs, which is not needed in this quickstart. Save the file as **input-vnf-nsd.jsonc**.

```json
{
  // Azure location to use when creating resources e.g uksouth
  "location": "uksouth",
  // Name of the Publisher resource you want your definition published to.
  // Will be created if it does not exist.
  "publisher_name": "ubuntu-publisher",
  // Resource group for the Publisher resource.
  // You should create this before running the publish command.
  "publisher_resource_group_name": "ubuntu-publisher-rg",
  // Name of the ACR Artifact Store resource.
  // Will be created if it does not exist.
  "acr_artifact_store_name": "ubuntu-acr",
  // Network Service Design (NSD) name. This is the collection of Network Service Design Versions. Will be created if it does not exist.
  "nsd_name": "ubuntu-nsd",
  // Version of the NSD to be created. This should be in the format A.B.C
  "nsd_version": "1.0.0",
  // Optional. Description of the Network Service Design Version (NSDV).
  "nsdv_description": "Plain ubuntu VM",
  // List of Resource Element Templates (RETs).
  // There must be at least one NF RET.
  // ArmTemplate RETs are optional. Delete if not required.
  "resource_element_templates": [
      {
        // Type of Resource Element. Either NF or ArmTemplate
        "resource_element_type": "NF",
        "properties": {
            // The name of the existing publisher for the NSD.
            "publisher": "ubuntu-publisher",
            // The resource group that the publisher is hosted in.
            "publisher_resource_group": "ubuntu-publisher-rg",
            // The name of the existing Network Function Definition Group to deploy using this NSD.
            // This will be the same as the NF name if you published your NFDV using the CLI.
            "name": "ubuntu-vm",
            // The version of the existing Network Function Definition to base this NSD on.
            // This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.
            "version": "1.0.0",
            // The region that the NFDV is published to.
            "publisher_offering_location": "uksouth",
            // Type of Network Function. Valid values are 'cnf' or 'vnf'.
            "type": "vnf"
        }
    }
  ]
}
```

| Variable                          | Description                                                                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **publisher_name**                | Name of the Publisher resource you want your definition published to. Created if it doesn't exist.                                                                                   |
| **publisher_resource_group_name** | Resource group for the Publisher resource. Created if it doesn't exist.                                                                                                              |
| **acr_artifact_store_name**       | Name of the Azure Container Registry (ACR) Artifact Store resource. Created if it doesn't exist.                                                                                                                |
| **location**                      | Azure location to use when creating resources.                                                                                                                                       |
| **network-functions**             | _publisher_: The name of the publisher that this Network Function Definition Version (NFDV) is published under.                                                                                                            |
|                                   | _publisher_resource_group_: The resource group that the publisher is hosted in.                                                                                                      |
|                                   | _name_: The name of the existing Network Function Definition Group to deploy using this NSD.                                                                                         |
|                                   | _version_: The version of the existing Network Function Definition to base this NSD on. This NSD is able to deploy any NFDV with deployment parameters compatible with this version. |
|                                   | _publisher_offering_location_: The region that the NFDV is published to.                                                                                                             |
|                                   | _type_: Type of Network Function. Valid values are cnf or vnf.                                                                                                                       |
| **nsd_name**                      | Network Service Design Group Name. The collection of Network Service Design Versions. Created if it doesn't exist.                                                                   |
| **nsd_version**                   | Version of the NSD to be created. The format should be A.B.C.                                                                                                                        |
| **nsdv_description**              | Description of the NSDV.                                                                                                                                                             |

## Build the Network Service Design (NSD)

Initiate the build process for the Network Service Design (NSD) using the following command:

```azurecli
az aosm nsd build --config-file input-vnf-nsd.jsonc
```

After the build process completes, review the following generated files to gain insights into the NSD's architecture and structure.

These files are created in a subdirectory called **nsd-cli-output**:

| Directory / File                    | Description                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **nsd-cli-output/artifactManifest** |                                                                                                                                                                                                                                                                                                                                   |
| deploy.bicep                        | Bicep template to create artifact manifest, with artifacts populated from input file                                                                                                                                                                                                                                              |
| **nsd-cli-output/artifacts**        |                                                                                                                                                                                                                                                                                                                                   |
| artifacts.json                      | List of artifacts (images and ARM templates) to be uploaded on publish. Correlates with the artifact manifest                                                                                                                                                                                                                     |
| \<nf-name>.bicep                    | Bicep template per Network Function (NF) RET provided in the input file, for deploying the NF. This template is converted to an ARM template and uploaded to the artifact store when you run the publish command                                                                                                                                              |
| **nsd-cli-output/base**             |                                                                                                                                                                                                                                                                                                                                   |
| deploy.bicep                        | Bicep template to create the publisher, storage accounts, and network service design group shared by all NSDVs of this NSD group                                                                                                                                                                                                   |
| **nsd-cli-output/nsdDefinition**    |                                                                                                                                                                                                                                                                                                                                   |
| deploy.bicep                        | Bicep template to create the Network Service Design Version (NSDV). This template contains child resource element templates, which are taken from the published NFs or ARM templates (for infrastructure) defined in the nsd-input.jsonc file                                                                                       |
| config-group-schema.json            | Combined configuration group schema for all NFs in this NSDV. This schema defines the inputs the operator needs to supply in the config group values when deploying the NSDV as part of a site network service (SNS).                                                                                                         |
| \<nf-name>-mappings.json            | File that maps the config group values provided by the operator to the deploy parameters defined in the NSDV. There's one per NF in your NSDV                                                                                                                                                                               |
| **nsd-cli-output**                  |                                                                                                                                                                                                                                                                                                                                   |
| all_deploy.parameters.json          | Superset of all NF's deploy parameters, providing a single file to customize resource names. The values output to this file by the build command are taken from the nsd-input.jsonc file. You can edit the values in this file before running publish, for example to publish to a different location or use a different publisher name |
| index.json                          | File used internally when publishing resources. Don't edit                                                                                                                                                                                                                                                                       |

## Publish the Network Service Design (NSD)

To publish the Network Service Design (NSD) and its associated artifacts, issue the following command:

```azurecli
az aosm nsd publish --build-output-folder nsd-cli-output
```

Navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

These resources are created:

| Resource Name                     | Resource Type                       |
| --------------------------------- | ----------------------------------- |
| **ubuntu-nsd**                    | The Network Service Design.         |
| **1.0.0 (ubuntu-nsd/1.0.0)**      | The Network Service Design Version. |
| **ubuntu-nsd-nsd-manifest-1-0-0** | Publisher Artifact Manifest.        |
| **ConfigGroupSchema**             | The Configuration Group Schema.     |

## Next steps

- [Quickstart: Prerequisites for Operator and Virtualized Network Function (VNF)](quickstart-virtualized-network-function-operator.md)
