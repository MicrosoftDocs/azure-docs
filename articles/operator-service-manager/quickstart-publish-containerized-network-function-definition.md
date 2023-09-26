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
- Complete the [Quickstart: Complete the prerequisites to deploy a Containerized Network Function in Azure Operator Service Manager](quickstart-containerized-network-function-prerequisites.md).

## Create input file

Create an input file for publishing the Network Function Definition. Execute the following command to generate the input configuration file for the Network Function Definition (NFD).

```azurecli
az aosm nfd generate-config --definition-type cnf
```
Execution of the preceding command generates an input.json file.

> [!NOTE]
> Edit the input.json file. Replace it with the values shown in the following sample. Save the file as **input-cnf-nfd.json**. Zip the ngnix configuration files in tgz format.

Here's sample input-cnf-nfd.json file:

```json
{
   {
    "publisher_name": "nginx-publisher",
    "publisher_resource_group_name": "nginx-publisher-rg",
    "nf_name": "nginx",
    "version": "1.0.0",
    "acr_artifact_store_name": "nginx-nsd-acr",
    "location": "uksouth",
    "source_registry_id": "/subscriptions/56951e4c-2008-4bca-88ba-d2d2eab9fede/resourcegroups/source-acr-rg/providers/Microsoft.ContainerRegistry/registries/sourcepublisheracr",
    "source_registry_namespace": "samples",
    "helm_packages": [
        {
            "name": "nginxdemo",
            "path_to_chart": "../nginx_helmchart/nginxdemo-0.1.0.tgz",
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
- **source_registry_namespace** - Optional. The namespace of the repository of the source acr registry from which to pull. For example if your repository is samples/prod/nginx then set to samples/prod. Leave blank if the image is in the root namespace. For more information, see [Best practices repository namespace](/azure/container-registry/container-registry-best-practices).
- **helm_packages**:
  - *name* - The name of the Helm package.
  - *path_to_chart* - The file path of Helm Chart on the local disk. Accepts .tgz, .tar or .tar.gz. Use Linux slash (/) file separator even if running on Windows.
  - *path_to_mappings* - The file path of value mappings on the local disk where chosen values are replaced with deploymentParameter placeholders. Accepts .yaml or .yml. If left as a blank string, a value mappings file is generated with every value mapped to a deployment parameter. Use a blank string and '--interactive' on the build command to interactively choose which values to map.
  - *depends_on* - Names of the Helm packages this package depends on. Leave as an empty array if there are no dependencies.

## Build the Network Function Definition (NFD)

To construct the Network Function Definition (NFD), initiate the build process in the interactive mode. This mode allows you to selectively expose values from `values.yaml` as deploymentParameters.

```azurecli
az aosm nfd build -f input-cnf-nfd.json --definition-type cnf --interactive
```
During the interactive process, you can respond with 'n' (no) for all the options except the following two:

- To expose the parameter `serviceAccount_create`, respond with 'y' (yes)
- To expose the parameter `service_port`, respond with 'y' (yes)

Once the build is complete, examine the generated files to gain a better understanding of the Network Function Definition (NFD) structure. If errors were made during your interactive choices, there are two options to correct them:

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