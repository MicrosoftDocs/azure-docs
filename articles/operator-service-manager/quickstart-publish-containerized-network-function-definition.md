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

## Prerequisite: Azure account with active subscription

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

## Create input file

Create an input file for publishing the Network Function Definition. Execute the following command to generate the input configuration file for the Network Function Definition (NFD).

```azurecli
az aosm nfd generate-config --definition-type cnf
{
    "publisher_name": "Name of the Publisher resource you want your definition published to. Will be created if it does not exist.",
    "publisher_resource_group_name": "Resource group for the Publisher resource. Will be created if it does not exist.",
    "acr_artifact_store_name": "Name of the ACR Artifact Store resource. Will be created if it does not exist.",
    "location": "Azure location to use when creating resources.",
    "nf_name": "Name of NF definition",
    "version": "Version of the NF definition in A.B.C format.",
    "images": {
        "source_registry": "Optional. Login server of the source acr registry from which to pull the image(s). For example sourceacr.azurecr.io. Leave blank if you have set source_local_docker_image.",
        "source_registry_namespace": "Optional. Namespace of the repository of the source acr registry from which to pull. For example if your repository is samples/prod/nginx then set this to samples/prod . Leave blank if the image is in the root namespace or you have set source_local_docker_image.See https://learn.microsoft.com/en-us/azure/container-registry/container-registry-best-practices#repository-namespaces for further details.",
        "source_local_docker_image": "Optional. Image name of the source docker image from local machine. For limited use case where the CNF only requires a single docker image and exists in the local docker repository. Set to blank of not required."
    },
    "helm_packages": [
        {
            "name": "Name of the Helm package",
            "path_to_chart": "File path of Helm Chart on local disk. Accepts .tgz, .tar or .tar.gz. Use Linux slash (/) file separator even if running on Windows.",
            "path_to_mappings": "File path of value mappings on local disk where chosen values are replaced with deploymentParameter placeholders. Accepts .yaml or .yml. If left as a blank string, a value mappings file will be generated with every value mapped to a deployment parameter. Use a blank string and --interactive on the build command to interactively choose which values to map.",
            "depends_on": [
                "Names of the Helm packages this package depends on. Leave as an empty array if no dependencies"
            ]
        }
    ]
}
```
Create a file called input.json with the following contents:

- publisher name
- publisher resource group name
- NF name
- version
- ACR artifact store name
- location
- images
- helm packages

> [!NOTE]
> Zip the ngnix configuration files in the format of tgz.

Here's sample input.json file:

```json
{
    "publisher_name": "nginx-publisher",
    "publisher_resource_group_name": "nginx-publisher-rg",
    "nf_name": "nginx",
    "version": "1.0.0",
    "acr_artifact_store_name": "nginx-nsd-acr",
    "location": "uksouth",
    "images": {
        "source_registry": "sourcepublisheracr.azurecr.io",
        "source_registry_namespace": "samples",
        "source_local_docker_image": ""
    },
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

## Build the Network Function Definition (NFD)

To construct the Network Function Definition (NFD), initiate the build process in the interactive mode. This mode allows you to selectively expose values from `values.yaml` as deploymentParameters.

```azurecli
az aosm nfd build -f input.json --definition-type cnf --interactive
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
az aosm nfd publish -f input.json --definition-type cnf
```
When the command completes, inspect the resources within your Publisher Resource Group to review the created components and artifacts.

## Next steps

- [Quickstart: Design a Containerized Network Function (CNF) Network Service Design with Nginx](quickstart-containerized-network-function-network-design.md)