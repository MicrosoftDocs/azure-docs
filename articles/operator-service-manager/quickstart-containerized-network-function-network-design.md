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

Create an input file for publishing the Network Service Design. Execute the following command to generate the input configuration file for the Network Service Design (NSD).

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
  // Type of NFVI (for nfvisFromSite). Defaults to 'AzureCore'.
  // Valid values are 'AzureCore', 'AzureOperatorNexus' or 'AzureArcKubernetes.
  "nfvi_type": "AzureCore",
  // List of Resource Element Templates.
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
        "name": "nginx-nfdg",
        // The version of the existing Network Function Definition to base this NSD on.
        // This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.
        "version": "1.0.0",
        // The region that the NFDV is published to.
        "publisher_offering_location": "uksouth",
        // Type of Network Function. Valid values are 'cnf' or 'vnf'.
        "type": "cnf",
        // Set to true or false. Whether the NSD should allow arbitrary numbers of this type of NF. If false only a single instance will be allowed. Only supported on VNFs, must be set to false on CNFs.
        "multiple_instances": "false"
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
  - _name_ - The name of the existing Network Function Definition Group to deploy using this NSD.
  - _version_ - The version of the existing Network Function Definition to base this NSD on. This NSD is able to deploy any NFDV with deployment parameters compatible with this version.
  - _publisher_offering_location_ - The region that the NFDV is published to.
  - _type_ - Type of Network Function. Valid values are cnf or vnf.
  - _multiple_instances_ - Valid values are true or false. Controls whether the NSD should allow arbitrary numbers of this type of NF. If set to false only a single instance is allowed. Only supported on VNFs. For CNFs this value must be set to false.

## Build the Network Service Design (NSD)

Initiate the build process for the Network Service Definition (NSD) using the following command:

```azurecli
az aosm nsd build -f input-cnf-nsd.jsonc
```

After the build process completes, review the generated files to gain insights into the NSD's architecture and structure.

These files are created:

| Files                       | Description                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| **artifact_manifest.bicep** | A bicep template for creating the Publisher and artifact stores.                           |
| **configMappings**          | Converts the config group values inputs to the deployment parameters required for each NF. |
| **nsd_definition.bicep**    | A bicep template for creating the NSDV itself.                                             |
| **schemas**                 | Defines to the inputs required in the config group values for this NSDV.                   |
| **nginx-nfdg_nf.bicep**     | A bicep template for deploying the NF. Uploaded to the artifact store.                     |

## Publish the Network Service Design (NSD)

To publish the Network Service Design (NSD) and its associated artifacts, issue the following command:

```azurecli
az aosm nsd publish -f input-cnf-nsd.jsonc
```

When the Publish process is complete, navigate to your Publisher Resource Group to observe and review the resources and artifacts that were produced.

## Next steps

- [Quickstart: Prerequisites for Operator and Containerized Network Function (CNF)](quickstart-containerized-network-function-operator.md)
