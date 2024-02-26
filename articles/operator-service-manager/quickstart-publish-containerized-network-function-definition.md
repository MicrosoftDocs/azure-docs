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

 This quickstart describes how to use the `az aosm` Azure CLI extension to create and publish a basic Network Function Definition. Its purpose it to demonstrate the workflow of the Publisher Azure Operator Service Manager (AOSM) resources. The basic concepts presented here are meant to prepare users to build more exciting services.

## Prerequisites

- An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

- The Contributor and AcrPush roles over this subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.

- Complete the [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md).

## Create input file

Create an input file for publishing the Network Function Definition. Execute the following command to generate the input configuration file for the Network Function Definition (NFD).

```azurecli
az aosm nfd generate-config --definition-type cnf
```
Execution of the preceding command generates an input.json file.

> [!NOTE]
> Edit the input.json file. Replace it with the values shown in the following sample. Save the file as **input-cnf-nfd.json**.

> [!NOTE]
> For this quickstart, we use source_local_docker_image. For further CNFs you may make in future, you have the option of using a reference to an existing Azure Container Registry which contains the images for your CNF. Currently, only one ACR and namespace is supported per CNF. The images to be copied from this ACR are populated automatically based on the helm package schema. To use this option in future, fill in `source_registry` and optionally `source_registry_namespace` in the input.json file. You must have Reader/AcrPull permissions on this ACR.

Here's sample input-cnf-nfd.json file:

```json
{
    "publisher_name": "nginx-publisher",
    "publisher_resource_group_name": "nginx-publisher-rg",
    "nf_name": "nginx",
    "version": "1.0.0",
    "acr_artifact_store_name": "nginx-nsd-acr",
    "location": "uksouth",
    "images": {
        "source_local_docker_image": "nginx:stable"
    },
    "helm_packages": [
        {
            "name": "nginxdemo",
            "path_to_chart": "nginxdemo-0.1.0.tgz",
            "path_to_mappings": "",
            "depends_on": []
        }
    ]
}
```
- **publisher_name** - Name of the Publisher resource you want your definition published to. Created if it doesn't already exist.
- **publisher_resource_group_name** - Resource group for the Publisher resource. Created if it doesn't already exist.
- **acr_artifact_store_name** - Name of the ACR Artifact Store resource. Created if it doesn't already exist.
- **location** - The Azure location to use when creating resources.
- **nf_name** - The name of the NF definition.
- **version** - The version of the NF definition in A.B.C format.
- **images**:
   - *source_local_docker_image* - Optional. The image name of the source docker image from your local machine. For limited use case where the CNF only requires a single docker image that exists in the local docker repository. 
- **helm_packages**:
  - *name* - The name of the Helm package.
  - *path_to_chart* - The file path of Helm Chart on the local disk. Accepts .tgz, .tar or .tar.gz. Use Linux slash (/) file separator even if running on Windows. The path should be an absolute path or the path relative to the location of the `input.json` file. 
  - *path_to_mappings* - The file path (absolute or relative to `input.json`) of value mappings on the local disk where chosen values are replaced with deploymentParameter placeholders. Accepts .yaml or .yml. If left as a blank string, a value mappings file is generated with every value mapped to a deployment parameter. Use a blank string and `--interactive` on the build command to interactively choose which values to map.
  - *depends_on* - Names of the Helm packages this package depends on. Leave as an empty array if there are no dependencies.

## Build the Network Function Definition (NFD)

To construct the Network Function Definition (NFD), initiate the build process in the interactive mode. This mode allows you to selectively expose values from `values.yaml` as deploymentParameters.

```azurecli
az aosm nfd build -f input-cnf-nfd.json --definition-type cnf --interactive
```
During the interactive process, you can respond with 'n' (no) for all the options except the following two:

- To expose the parameter `serviceAccount_create`, respond with 'y' (yes)
- To expose the parameter `service_port`, respond with 'y' (yes)

Once the build is complete, examine the generated files to gain a better understanding of the Network Function Definition (NFD) structure. These files are created:



|Directory/File  |Description  |
|---------|---------|
|configMappings     |    Maps the deployment parameters for the Network Function Definition Version (NFDV) to the values required for the helm chart.    |
|generatedValuesMappings    |   The yaml output of interactive mode that created configMappings. Edit and rerun the command if necessary.      |
|schemas     |   Defines the deployment parameters required to create a Network Function (NF) from this Network Function Definition Version (NFDV).      |
|cnfartifactmanifests.bicep    |    Bicep template for creating the artifact manifest.     |
|cnfdefinition.bicep	     |    Bicep template for creating the Network Function Definition Version (NFDV) itself.     |

If errors were made during your interactive choices, there are two options to correct them:

1. Rerun the command with the correct selections.
1. Manually adjust the generated value mappings within `generatedValuesMappings` folder. Then edit the `path_to_mappings_file` in `input.json` to reference the modified file path.

## Publish the Network Function Definition and upload artifacts

Execute the following command to publish the Network Function Definition (NFD) and upload the associated artifacts:

```azurecli
az aosm nfd publish -f input-cnf-nfd.json --definition-type cnf
```
When the command completes, inspect the resources within your Publisher Resource Group to review the created components and artifacts.

## Next steps

- [Quickstart: Design a Containerized Network Function (CNF) Network Service Design with Nginx](quickstart-containerized-network-function-network-design.md)
