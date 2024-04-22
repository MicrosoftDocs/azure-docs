---
title: Publish a network function definition
description: Learn how to publish a network function definition.
author: sherrygonz
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: quickstart
ms.service: azure-operator-service-manager
---

# Quickstart: Publish Nginx container as Containerized Network Function (CNF)

This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Function Definition. Its purpose is to demonstrate the workflow of the Publisher Azure Operator Service Manager (AOSM) resources. The basic concepts presented here are meant to prepare users to build more exciting services.

## Prerequisites

- An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

- The Contributor and AcrPush roles over this subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.

- Complete the [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md).

## Create input file

Create an input file for publishing the Network Function Definition. Execute the following command to generate the input configuration file for the Network Function Definition (NFD).

```azurecli
az aosm nfd generate-config --definition-type cnf
```

Execution of the preceding command generates an cnf-input.jsonc file.

> [!NOTE]
> Edit the cnf-input.jsonc file. Replace it with the values shown in the following sample. Save the file as **input-cnf-nfd.jsonc**.
> [!NOTE]
> You can use multiple Container Registries as sources for your images in the AOSM CLI. The images to be copied from these Registries are populated automatically based on the helm package schema. To configure these source Registries, fill in `image_sources` list in the cnf-input.jsonc file. When using ACRs, you must have Reader/AcrPull permissions. When using other private Registries, you must run `docker login` to authenticate with all non-ACR Registries before running the `az aosm nfd build` command. In this quickstart we use `docker.io` as the image source Registry. This is a public Registry and does not require authentication.

Here's sample input-cnf-nfd.jsonc file:

```jsonc
{
  // Azure location to use when creating resources e.g uksouth
  "location": "uksouth",
  // Name of the Publisher resource you want your definition published to.
  // Will be created if it does not exist.
  "publisher_name": "nginx-publisher",
  // Resource group for the Publisher resource.
  // You should create this before running the publish command
  "publisher_resource_group_name": "nginx-publisher-rg",
  // Name of the ACR Artifact Store resource.
  // Will be created if it does not exist.
  "acr_artifact_store_name": "nginx-nsd-acr",
  // Name of NF definition.
  "nf_name": "nginx",
  // Version of the NF definition in 1.1.1 format (three integers separated by dots).
  "version": "1.0.0",
  // List of registries from which to pull the image(s).
  // For example ["sourceacr.azurecr.io/test", "myacr2.azurecr.io", "ghcr.io/path"].
  // For non Azure Container Registries, ensure you have run a docker login command before running build.
  //
  "image_sources": ["docker.io"],
  // List of Helm packages to be included in the CNF.
  "helm_packages": [
    {
      "name": "nginxdemo",
      "path_to_chart": "nginxdemo-0.1.0.tgz",
      "default_values": "",
      "depends_on": []
    }
  ]
}
```

- **publisher_name** - Name of the Publisher resource you want your definition published to. Created if it doesn't already exist.
- **publisher_resource_group_name** - Resource group for the Publisher resource. Created if it doesn't already exist.
- **acr_artifact_store_name** - Name of the Azure Container Registry (ACR) Artifact Store resource. Created if it doesn't already exist.
- **location** - The Azure location to use when creating resources.
- **nf_name** - The name of the NF definition.
- **version** - The version of the NF definition in A.B.C format.
- **image_sources** - list of the registries from which to pull the images.
- **helm_packages**:
  - _name_ - The name of the Helm package.
  - _path_to_chart_ - The file path of Helm Chart on the local disk. Accepts .tgz, .tar or .tar.gz. Use Linux slash (/) file separator even if running on Windows. The path should be an absolute path or the path relative to the location of the `cnf-input.jsonc` file.
  - _default_values_ - The file path (absolute or relative to `cnf-input.jsonc`) of the YAML values file on the local disk that is used instead of the values.yaml file present in the helm chart.
  - _depends_on_ - Names of the Helm packages this package depends on. Leave as an empty array if there are no dependencies.

## Build the Network Function Definition (NFD)

To construct the Network Function Definition (NFD), initiate the build process.

```azurecli
az aosm nfd build -f input-cnf-nfd.jsonc --definition-type cnf
```

The Az CLI AOSM extension generates a directory called `cnf-cli-output`. This directory contains the BICEP files defining the AOSM resources required to publish an NFDV and upload the images required to deploy it to AOSM-managed storage. Examine the generated files to gain a better understanding of the Network Function Definition (NFD) structure.

| Directory/File             | Description                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| nfDefinition/deployParameters.json | Defines the schema for the deployment parameters required to create a Network Function (NF) from this Network Function Definition Version (NFDV). |
| nfDefinition/nginxdemo-mappings.json   | Maps the deployment parameters for the Network Function Definition Version (NFDV) to the values required for the helm chart.       |
| nfDefinition/deploy.bicep              | Bicep template for creating the Network Function Definition Version (NFDV) itself.                                                 |
| artifacts/artifacts.json               | A list of the helm packages and container images required by the NF.                                                               |
| artifactManifest/deploy.bicep          | Bicep template for creating the artifact manifest.                                                                                 |
| base/deploy.bicep                      | Bicep template for creating the publisher, network function definition group, and artifact store resources                         |

## Publish the Network Function Definition and upload artifacts

Execute the following command to publish the Network Function Definition (NFD) and upload the associated artifacts:

> [!NOTE]
> If you are using Windows, you must have Docker Desktop running during the publish step.

```azurecli
az aosm nfd publish -b cnf-cli-output --definition-type cnf
```

When the command completes, inspect the resources within your Publisher Resource Group to review the created components and artifacts.

## Next steps

- [Quickstart: Design a Containerized Network Function (CNF) Network Service Design with Nginx](quickstart-containerized-network-function-network-design.md)
