---
title: How to onboard a CNF using the Azure Operator Service Manager CLI extension
description: Learn how to onboard a CNF using the Azure Operator Service Manager CLI extension.
author: pjw711
ms.author: peterwhiting
ms.date: 03/18/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli

---
# Onboard a Containerized Network Function (CNF) to Azure Operator Service Manager (AOSM)

In this how-to guide, Network Function Publishers and Service Designers learn how to use the Azure CLI AOSM extension to onboard a containerized network function to AOSM. The CNF can later be deployed onto an Azure Arc-connected Kubernetes Cluster, including an Azure Operator Nexus cluster.

Onboarding is a multi-step process. Once you meet the prerequisites, you'll use the Azure CLI AOSM extension to:

1. Generate BICEP files that define a Network Function Definition Group and Version (NFD) based on your Helm charts and values.yaml.
2. Publish the NFD and upload the CNF images and charts to an Artifact Store (AOSM-managed Azure Container Registry (ACR)).
3. Add your published NFD to the BICEP files that define a Network Service Design Group and Version (NSD).
4. Publish the NSD.

## Prerequisites

- You have [enabled AOSM](quickstart-onboard-subscription-azure-operator-service-manager.md) on your Azure subscription.
- If your CNF is intended to run on Azure Operator Nexus, you have access to an Azure Operator Nexus instance and have completed [the prerequisites for workload deployment](/azure/operator-nexus/quickstarts-tenant-workload-prerequisites?tabs=azure-cli).

> [!NOTE]
> It is strongly recommended that you have tested that a `helm install` of your Helm package succeeds on your target Arc-connected Kubernetes environment.

### Configure permissions

- You require the Contributor role over your subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.
- You require the `Reader`/`AcrPull` role assignments on the source ACR containing your images.
- You require the `Contributor` and `AcrPush` role assignments on the subscription that will contain the AOSM managed Artifact Store. These permissions allow the Azure CLI AOSM Extension to do a direct ACR-to-ACR copy. Direct copy is the fastest method of transferring images from one ACR to another.
  - Your company policy might prevent you from having subscription-scoped permissions. The `--no-subscription-permissions` parameter, available on the `az aosm nfd publish` and `az aosm nsd publish` commands, uses tightly scoped permissions derived from the AOSM service to orchestrate a two-step copy to and from your local machine. This two-step copy is slower, but doesn't require subscription scoped permissions.

### Helm packages

- The Helm packages you intend to onboard must be present on the local storage of the machine from which you're executing the CLI.
  - The Azure CLI AOSM extension will use the `values.yaml` file in the helm package by default. The CLI supports overriding this behavior with an alternative `values.yaml`. This alternative file must exist on the local storage of the machine from which you're executing the CLI.

> [!NOTE]
> It is strongly recommended that the Helm package contains a schema for the helm values and that the helm package templates as you expect when `helm template` is run using the values.yaml you intend to use when onboarding to AOSM.

### Container images

- Your container images are present in either an existing ACR or an alternative container registry that supports the Docker API. Container images must be stored in your source registry in a structure that matches the image location defined in your helm charts. This requirement is explained in [CLI CNF image discovery and upload](concepts-cli-containerized-network-function-image-upload.md).
- Use the `docker login` command to sign in to a non-Azure container registry hosting your container images before you run any `az aosm` commands. This step isn't required if you're using an ACR: the Azure CLI AOSM extension will automatically sign in.

### Helm and Docker engine

- Install [Helm CLI](https://helm.sh/) on the host computer. You must use Helm v3.8.0 or later.
- Install [Docker](https://docs.docker.com/) on the host computer.

### Download and install Azure CLI

To install the Azure CLI locally, refer to [How to install the Azure CLI](/cli/azure/install-azure-cli).

To sign into the Azure CLI, use the `az login` command and complete the prompts displayed in your terminal to finish authentication. For more sign-in options, refer to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

> [!NOTE]
> If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker). You can also use the Bash environment in the Azure cloud shell. For more information, see [Start the Cloud Shell](/azure/cloud-shell/quickstart?tabs=azurecli) to use Bash environment in Azure Cloud Shell.

### Install AOSM CLI extension

The Az CLI AOSM Extension requires version 2.54.0 or later of the Azure CLI.

1. Run `az version` to see the version and dependent libraries that are installed.
2. Run `az upgrade` to upgrade to the current version of Azure CLI.

Install the AOSM CLI extension using this command:

```azurecli
az extension add --name aosm
```

## Build the Network Function Definition Group and Version

This step creates a folder in the working directory called `cnf-cli-output` with the BICEP templates of the AOSM resources that define your Network Function Definition Group and Version, and the Artifact Store. These resources will ultimately be included in your Network Service Design.

1. Generate the Azure CLI AOSM extension input file for a CNF.

    ```azurecli
    az aosm nfd generate-config --definition-type cnf --output-file <filename.jsonc>
    ```

1. Open the input file you generated in the previous step and use the inline comments to enter the required values. This example shows the Az CLI AOSM extension input file for a fictional Contoso CNF.

    > [!NOTE]
    > The Azure CLI AOSM extension only exposes required parameters without default values in the input `values.yaml` by default. You can set `expose_all_parameters` to `true` to expose all helm values in the Network Function Definition Version (NFDV) and Configuration Group Schema (CGS). For more information, see [Parameter expose using the AOSM CLI extension](concepts-expose-parameters-configuration-group-schema.md).

    ```jsonc
    {
      // Azure location to use when creating resources e.g uksouth
      "location": "eastus",
      // Name of the Publisher resource you want your definition published to.
      // Will be created if it does not exist.
      "publisher_name": "contoso",
      // Resource group for the Publisher resource.
      // You should create this before running the publish command
      "publisher_resource_group_name": "contoso",
      // Name of the ACR Artifact Store resource.
      // Will be created if it does not exist.
      "acr_artifact_store_name": "contoso-artifact-store",
      // Name of NF definition.
      "nf_name": "contoso-cnf-nfd",
      // Version of the NF definition in 1.1.1 format (three integers separated by dots).
      "version": "1.0.0",
      // If set to true, all NFD configuration parameters are made available to the designer, including optional parameters and those with defaults.
      // If not set or set to false, only required parameters without defaults will be exposed.
      "expose_all_parameters": false,
      // List of registries from which to pull the image(s).
      // For example ["sourceacr.azurecr.io/test", "myacr2.azurecr.io", "ghcr.io/path"].
      // For non Azure Container Registries, ensure you have run a docker login command before running build.
      "image_sources": ["contoso.azuercr.io/contoso", "docker.io"],
      // List of Helm packages to be included in the CNF.
      "helm_packages": [
          {
              // The name of the Helm package.
              "name": "contoso-helm-package",
              // The file path to the helm chart on the local disk, relative to the directory from which the command is run.
              // Accepts .tgz, .tar or .tar.gz, or an unpacked directory. Use Linux slash (/) file separator even if running on Windows.
              "path_to_chart": "/home/cnf-onboard/contoso-cnf-helm-chart-0-1-0.tgz",
              // The file path (absolute or relative to this configuration file) of YAML values file on the local disk which will be used instead of the values.yaml file present in the helm chart.
              // Accepts .yaml or .yml. Use Linux slash (/) file separator even if running on Windows.
              "default_values": "",
          }
      ]
    }
    ```

1. Execute the following command to build the Network Function Definition Group and Version BICEP templates.

```azurecli
az aosm nfd build --definition-type cnf --config-file <filename.jsonc>
```

You can review the folder and files structure and make modifications if necessary.

## Publish the Network Function Definition Group and Version

This step creates the AOSM resources that define the Network Function Definition and the Artifact Store that will be used to store the Network Function's container images. It also uploads the images and charts to the Artifact Store either by copying them directly from the source ACR or, if you don't have subscription scope `Contributor` and `AcrPush` roles, by retagging the docker images locally and uploading to the Artifact Store using tightly scoped credentials generated from the AOSM service.

1. Execute the following command to publish the Network Function Definition Group and Version. If you don't have subscription scope `Contributor` and `AcrPush` roles, include `--no-subscription-permissions` in the command.

> [!NOTE]
> If you are using Windows, you must have Docker Desktop running during the publish step.

```azurecli
az aosm nfd publish --build-output-folder cnf-cli-output --definition-type cnf
```

## Build the Network Service Design Group and Version

This section creates a folder in the working directory called `nsd-cli-output`. This folder contains the BICEP templates of the AOSM resources that define a Network Service Design Group and Version. This Network Service Design is a template used in the Site Network Service resource that will deploy the Network Function you onboarded in the previous sections.

1. Generate the Azure CLI AOSM Extension NSD input file.

    ```azurecli
    az aosm nsd generate-config --output-file <nsd-output-filename.jsonc>
    ```

1. Open the input file you generated in the previous step and use the inline comments to enter the required values. The generated input file contains an additional `resource_element_type` of type `ArmTemplate`. This is unnecessary when onboarding a CNF; you can delete it. The result should look like this example. The example shows the Az CLI AOSM extension input file for a fictional Contoso NSD that can be used to deploy a fictional Contoso CNF onto an Arc-connected Nexus Kubernetes cluster.

    ```json
    {
        // Azure location to use when creating resources e.g uksouth
        "location": "eastus",
        // Name of the Publisher resource you want your definition published to.
        // Will be created if it does not exist.
        "publisher_name": "contoso",
        // Resource group for the Publisher resource.
        // Will be created if it does not exist.
        "publisher_resource_group_name": "contoso",
        // Name of the ACR Artifact Store resource.
        // Will be created if it does not exist.
        "acr_artifact_store_name": "contoso-artifact-store",
        // Network Service Design (NSD) name. This is the collection of Network Service Design Versions. Will be created if it does not exist.
        "nsd_name": "contoso-nsd",
        // Version of the NSD to be created. This should be in the format A.B.C
        "nsd_version": "1.0.0",
        // Optional. Description of the Network Service Design Version (NSDV).
        "nsdv_description": "An NSD that deploys the onboarded contoso-cnf NFD",
        // List of Resource Element Templates (RETs).
        // There must be at least one NF RET.
        // ArmTemplate RETs are optional. Delete if not required.
        "resource_element_templates": [
            {
                // Type of Resource Element. Either NF or ArmTemplate
                "resource_element_type": "NF",
                "properties": {
                    // The name of the existing publisher for the NSD.
                    "publisher": "contoso",
                    // The resource group that the publisher is hosted in.
                    "publisher_resource_group": "contoso",
                    // The name of the existing Network Function Definition Group to deploy using this NSD.
                    // This will be the same as the NF name if you published your NFDV using the CLI.
                    "name": "contoso-cnf-nfd",
                    // The version of the existing Network Function Definition to base this NSD on.
                    // This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.
                    "version": "1.0.0",
                    // The region that the NFDV is published to.
                    "publisher_offering_location": "eastus",
                    // Type of Network Function. Valid values are 'cnf' or 'vnf'.
                    "type": "cnf"
                }
            }
        ]
    }
    ```

    >[!NOTE]
    > The resource element template section defines which NFD is included in the NSD. The properties must match those used in the input file passed to the `az aosm nfd build` command. This is because the Azure CLI AOSM Extension validates that the NFD has been correctly onboarded when building the NSD.

1. Execute the following command to build the Network Service Design Group and Version BICEP templates.

```azurecli
az aosm nsd build --config-file <nsd-output-filename.jsonc>
```

You can review the folder and files structure and make modifications if required.

## Publish the Network Service Design Group and Version

This step creates the AOSM resources that define the Network Service Design Group and Version. It also uploads artifacts required by the NSD to the Artifact Store (Network Function ARM template).

1. Execute the following command to publish the Network Service Design Group and Version. If you don't have subscription scope `Contributor` and `AcrPush` roles, include `--no-subscription-permissions` in the command.

```azurecli
az aosm nsd publish --build-output-folder nsd-cli-output
```

You now have a complete set of AOSM publisher resources and are ready to perform the operator flow.

## Next steps

- [Prerequisites for Operator](quickstart-containerized-network-function-operator.md)
- [Create a Site Network Service](quickstart-containerized-network-function-create-site-network-service.md)
