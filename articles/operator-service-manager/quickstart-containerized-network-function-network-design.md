---
title: Design a Containerized Network Function (CNF) with Nginx
description: Learn how to design a Containerized Network Function (CNF) with Nginx.
author: sherrygonz
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Design a Containerized Network Function (CNF) Network Service Design with Nginx

This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Service Design.

## Prerequisites

- An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.
- Complete the [Quickstart: Publish Nginx container as Containerized Network Function (CNF)](quickstart-publish-containerized-network-function-definition.md).

## Create input file

Create an input file for publishing the Network Service Design Version and associated resources. Execute the following command to generate the input configuration file for the Network Service Design Version (NSDV).

```azurecli
az aosm nsd generate-config
```

Execution of the preceding command generates an nsd-input.jsonc file.

> [!NOTE]
> Edit the input.json file. Replace it with the values shown in the sample. Save the file as **input-cnf-nsd.jsonc**.

Here's a sample **input-cnf-nsd.jsonc**:

```jsonc
{
  // Azure location to use when creating resources e.g uksouth
  "location": "uksouth",
  // Name of the Publisher resource you want your definition published to.
  // Will be created if it does not exist.
  "publisher_name": "nginx-publisher",
  // Resource group for the Publisher resource.
  // Will be created if it does not exist.
  "publisher_resource_group_name": "nginx-publisher-rg",
  // Name of the ACR Artifact Store resource.
  // Will be created if it does not exist.
  "acr_artifact_store_name": "nginx-nsd-acr",
  // Network Service Design (NSD) name. This is the collection of Network Service Design Versions. Will be created if it does not exist.
  "nsd_name": "nginx-nsdg",
  // Version of the NSD to be created. This should be in the format A.B.C
  "nsd_version": "1.0.0",
  // Optional. Description of the Network Service Design Version (NSDV).
  "nsdv_description": "Deploys a basic NGINX CNF",
  // List of Resource Element Templates (RETs).
  // There must be at least one NF RET.
  // ArmTemplate RETs are optional. Delete if not required.
  "resource_element_templates": [
    {
      // Type of Resource Element. Either NF or ArmTemplate
      "resource_element_type": "NF",
      "properties": {
        // The name of the existing publisher for the NSD.
        "publisher": "nginx-publisher",
        // The resource group that the publisher is hosted in.
        "publisher_resource_group": "nginx-publisher-rg",
        // The name of the existing Network Function Definition Group to deploy using this NSD.
        // This will be the same as the NF name if you published your NFDV using the CLI.
        "name": "nginx",
        // The version of the existing Network Function Definition to base this NSD on.
        // This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.
        "version": "1.0.0",
        // The region that the NFDV is published to.
        "publisher_offering_location": "uksouth",
        // Type of Network Function. Valid values are 'cnf' or 'vnf'.
        "type": "cnf"
      }
    }
  ]
}
```

- **publisher_name** - Name of the Publisher resource you want your definition published to. Created if it doesn't already exist.
- **publisher_resource_group_name** - Resource group for the Publisher resource. Created if it doesn't already exist. For this quickstart, it's recommended you use the same Resource Group that you used when publishing the Network Function Definition.
- **acr_artifact_store_name** - Name of the ACR Artifact Store resource. Created if it doesn't already exist.
- **location** - The Azure location to use when creating resources.
- **nsd_name** - The Network Service Design Group name. The collection of Network Service Design versions. Created if it doesn't already exist.
- **nsd_version** - The version of the NSD being created. In the format of A.B.C.
- **nsdv_description** - The description of the NSDV.
- **resource_element_templates**:
  - _publisher_ - The name of the publisher that this NFDV is published under.
  - _publisher_resource_group_ - The resource group that the publisher is hosted in.
  - _name_ - The name of the existing Network Function Definition Group to deploy using this NSD. This will be the same as the NF name if you published your NFDV using the CLI.
  - _version_ - The version of the existing Network Function Definition to base this NSD on. This NSD is able to deploy any NFDV with deployment parameters compatible with this version.
  - _publisher_offering_location_ - The region that the NFDV is published to.
  - _type_ - Type of Network Function. Valid values are cnf or vnf.

## Build the Network Service Design Version (NSDV)

Initiate the build process for the NSDV using the following command:

```azurecli
az aosm nsd build -f input-cnf-nsd.jsonc
```

The build process generates a folder called `nsd-cli-output`. After the build process completes, review the generated files to gain insights into the NSDV architecture and structure, and that of the associated resources.

These files are created:

| Directory/File                         | Description                                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| nsdDefinition/config-group-schema.json | Defines the schema for the deployment parameters required to create a Site Network Service (SNS) from this NSDV.           |
| nsdDefinition/nginx-nsd-mappings.json  | Maps the parameters for the NSDV to the values required for the NF ARM template.                                           |
| nsdDefinition/deploy.bicep             | Bicep template for creating the NSDV itself.                                                                               |
| artifacts                              | Contains a bicep template for the NF ARM template, as well as a list of artifacts to be included in the artifact manifest. |
| artifactManifest/deploy.bicep          | Bicep template for creating the artifact manifest.                                                                         |
| base/deploy.bicep                      | Bicep template for creating the publisher, network service design group, and artifact store resources                      |

## Publish the Network Service Design Version (NSDV)

To publish the NSDV and its associated artifacts, issue the following command:

```azurecli
az aosm nsd publish --build-output-folder nsd-cli-output
```

When the Publish process is complete, navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

## Next steps

- [Quickstart: Prerequisites for Operator and Containerized Network Function (CNF)](quickstart-containerized-network-function-operator.md)
