---
title: How to use Azure Operator Service Manager CLI extension
description: Learn how to use Azure Operator Service Manager CLI extension.
author: sherrygonz
ms.author: sherryg
ms.date: 10/17/2023
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli
---

# Use Azure Operator Service Manager (AOSM) CLI extension

In this how-to guide, Network Function Publishers and Network Service Designers learn how to use the Azure CLI extension to get started with Network Function Definitions (NFDs) and Network Service Designs (NSDs).

The `az aosm` CLI extension is intended to provide support for publishing Network Function Definitions (NFDs) and Network Service Designs (NSDs) to use with Azure Operator Service Manager.

## Prerequisites

- You have [enabled AOSM](quickstart-onboard-subscription-to-aosm.md) on your Azure subscription.

### Download and install Azure CLI

Use the Bash environment in the Azure cloud shell. For more information, see [Start the Cloud Shell](/azure/cloud-shell/quickstart?tabs=azurecli) to use Bash environment in Azure Cloud Shell.

For users that prefer to run CLI reference commands locally refer to [How to install the Azure CLI](/cli/azure/install-azure-cli).

If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

If you're using a local installation, sign into the Azure CLI using the `az login` command and complete the prompts displayed in your terminal to finish authentication. For more sign-in options, refer to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

### Install Azure Operator Service Manager (AOSM) CLI extension

Install the Azure Operator Service Manager (AOSM) CLI extension using this command:

```azurecli
az extension add --name aosm
```

1. Run `az version` to see the version and dependent libraries that are installed.
1. Run `az upgrade` to upgrade to the current version of Azure CLI.

### Register necessary resource providers

Before you begin using the Azure Operator Service Manager, make sure to register the required resource providers. Execute the following commands. This registration process can take up to 5 minutes.

```azurecli
# Register Resource Provider
az provider register --namespace Microsoft.ContainerRegistry
```

Verify the registration status of the resource providers. Execute the following commands.

```azurecli
# Query the Resource Provider
az provider show -n Microsoft.ContainerRegistry --query "{RegistrationState: registrationState, ProviderName: namespace}"
```

> [!NOTE]
> It may take a few minutes for the resource provider registration to complete. Once the registration is successful, you can proceed with using the Azure Operator Service Manager (AOSM).

### Containerized Network Function (CNF) requirements

For those utilizing Containerized Network Functions, it's essential to ensure that the following packages are installed on the machine from which you're executing the CLI:

- **Install Helm**, refer to [Install Helm CLI](https://helm.sh/docs/intro/install/).
- In some circumstances, **install docker**, refer to [Install the Docker Engine](https://docs.docker.com/engine/install/). Only needed if you don't have subscription-wide permissions required to push charts and images.

## Permissions

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

You require the Contributor role over this subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.

### Permissions for publishing CNFs

When sourcing the CNF images from an existing ACR, you need to have `Reader`/`AcrPull` permissions from this ACR, and ideally, `Contributor` role + `AcrPush` role (or a custom role that allows the `importImage` action and `AcrPush`) over the whole subscription in order to be able to import to the new Artifact store. If you have these, you don't need docker to be installed locally, and the image copy is quick.

If you don't have the subscription-wide permissions then you can run the `az aosm nfd publish` command using the `--no-subscription-permissions` flag to pull the image to your local machine and then push it to the Artifact Store using manifest credentials scoped only to the store. Requires docker to be installed locally.

## Azure Operator Service Manager (AOSM) CLI extension overview

Network Function Publishers and Network Service Designers use the Azure CLI extension to help with the publishing of Network Function Definitions (NFDs) and Network Service Designs (NSDs).

As explained in [Roles and Interfaces](roles-interfaces.md), a Network Function Publisher has various responsibilities. The CLI extension assists with the items shown in bold:

- Create the network function.
- **Encode that in a Network Function Definition (NFD)**.
- **Determine the deployment parameters to expose to the Network Service Designer**.
- **Onboard the Network Function Definition (NFD) to Azure Operator Service Manager (AOSM)**.
- **Upload the associated artifacts**.
- Validate the Network Function Definition (NFD).

A Network Service Designer also has various responsibilities, of which the CLI extension assists with the items in bold:

- Choose which Network Function Definitions are included in the Network Service Design.
- **Encode that into a Network Service Design**.
- Combine Azure infrastructure into the Network Service Design.
- **Determine how to parametrize the service by defining one or more Configuration Group Schemas (CGSs)**.
- **Determine how inputs from the Network Service Operator map down to parameters required by the Network Function Definitions** and the Azure infrastructure.
- **Onboard the Network Service Design (NSD) to Azure Operator Service Manager (AOSM)**.
- **Upload the associated artifacts**.
- Validate the Network Service Design (NSD).

## Workflow summary

A generic workflow of using the CLI extension is:

1. Find the prerequisite items you require for your use-case.

1. Run a `generate-config` command to output an example JSONC config file for subsequent commands.

1. Fill in the config file.

1. Run a `build` command to output one or more bicep templates for your Network Function Definition or Network Service Design.

1. Review the output of the build command, edit the output as necessary for your requirements.

1. Run a `publish` command to:
   - Create all prerequisite resources such as Publisher, Artifact Stores, Groups.
   - Deploy those bicep templates.
   - Upload artifacts to the artifact stores.

## VNF start point

For VNFs, you need at least one ARM template that would create the Azure resources for your VNF, for example a Virtual Machine, disks and NICs. The ARM template must be stored on the machine from which you're executing the CLI.

For Virtualized Network Function Definition Versions (VNF NFDVs), the networkFunctionApplications list must contain one VhdImageFile and one ARM template. It's unusual to include more than one VhdImageFile and more than one ARM template. Unless you have a strong reason not to, the ARM template should deploy a single VM. The Network Service Designer should include numerous copies of the Network Function Definition (NFD) with the Network Service Design (NSD) if you want to deploy multiple VMs. The ARM template (for both AzureCore and Nexus) can only deploy ARM resources from the following Resource Providers:

- Microsoft.Compute

- Microsoft.Network

- Microsoft.NetworkCloud

- Microsoft.Storage

- Microsoft.NetworkFabric

- Microsoft.Authorization

- Microsoft.ManagedIdentity

You also need a VHD image that would be used for the VNF Virtual Machine. The VHD image can be stored on the machine from which you're executing the CLI, or in Azure blob storage accessible via a SAS URI.

## CNF start point

**TODO: THIS SECTION IS EXACTLY THE SAME AS THE one in cnf prerequisites. Make sure all the changes there are applied here (or just link it)**

For deployments of Containerized Network Functions (CNFs), it's crucial to have the following stored on the machine from which you're executing the CLI:

- **Helm Packages with Schema** - These packages should be present on your local storage and referenced within the `cnf-input.jsonc` configuration file. When following this quickstart, you download the required helm package.
- **Optional: Mapping File (default_values)**: Optionally, you can provide a file (on disk) under the `default_values` parameter. This file should mirror `values.yaml`, with your selected values replaced by deployment parameters. Doing so exposes them as parameters to the CNF. Or, you can leave this blank in `cnf-input.jsonc` and the CLI generates the file. By default in this case, every value within `values.yaml` is exposed as a deployment parameter. This quickstart guides you through creation of this file. **TODO: I DOUBT THIS IS RIGHT**

When configuring the `cnf-input.jsonc` file, ensure that you list the Helm packages in the order they should be deployed. For instance, if package "A" must be deployed before package "B," your `cnf-input.jsonc` should resemble the following structure: **TODO: does it still follow this order in the new CLI?**

```json
    // List of Helm packages to be included in the CNF.
    "helm_packages": [
        {
            // The name of the Helm package.
            "name": "A",
            // The file path to the helm chart on the local disk, relative to the directory from which the command is run.
            // Accepts .tgz, .tar or .tar.gz, or an unpacked directory. Use Linux slash (/) file separator even if running on Windows.
            "path_to_chart": "",
            // The file path (absolute or relative to this configuration file) of YAML values file on the local disk which will be used instead of the values.yaml file present in the helm chart.
            // Accepts .yaml or .yml. Use Linux slash (/) file separator even if running on Windows.
            "default_values": "",
            // Names of the Helm packages this package depends on.
            // Leave as an empty array if there are no dependencies.
            "depends_on": [
            ]
        },
        {
            // The name of the Helm package.
            "name": "B",
            // The file path to the helm chart on the local disk, relative to the directory from which the command is run.
            // Accepts .tgz, .tar or .tar.gz, or an unpacked directory. Use Linux slash (/) file separator even if running on Windows.
            "path_to_chart": "",
            // The file path (absolute or relative to this configuration file) of YAML values file on the local disk which will be used instead of the values.yaml file present in the helm chart.
            // Accepts .yaml or .yml. Use Linux slash (/) file separator even if running on Windows.
            "default_values": "",
            // Names of the Helm packages this package depends on.
            // Leave as an empty array if there are no dependencies.
            "depends_on": [
            ]
        }
    ]
```

Following these guidelines ensures a well organized and structured approach to deploy Containerized Network Functions (CNFs) with Helm packages and associated configurations.

## NSD start point

For NSDs, you need to know the details of the Network Function Definitions (NFDs) to incorporate into your design:

- the NFD Publisher resource group
- the NFD Publisher name
- the name of the Network Function Definition Group
- the location, type and version of the Network Function Definition Version

You can use the `az aosm nfd` commands to create all of these resources.

You can also specify Arm Resource Element Templates in order to spin up infrastructure.

## Azure Operator Service Manager (AOSM) commands

Use these commands before you begin:

1. `az login` used to sign in to the Azure CLI.

1. `az account set --subscription <subscription>` used to choose the subscription you want to work on.

### NFD commands

Get help on command arguments:

- `az aosm -h`

- `az aosm nfd -h`

- `az aosm nfd build -h`

Definition type commands:

All NFD commands take a `--definition-type` argument of `vnf` or `cnf`.

Create an example config file for building a definition:

- `az aosm nfd generate-config --definition-type <nf-type>`

This command outputs a JSONC file, which must be filled in. Once the config file is filled in the following commands can be run.

Build an NFD definition locally:

- `az aosm nfd build --config-file <input-file> --definition-type <nf-type>`

Publish a prebuilt definition:

- `az aosm nfd publish --build-output-folder <output-folder> --definition-type <nf-type>`

### NSD commands

Get help on command arguments:

- `az aosm -h`

- `az aosm nsd -h`

- `az aosm nsd build -h`

Create an example config file for building a definition:

- `az aosm nsd generate-config`

This command outputs a a JSONC file, which must be filled in. Once the config file is filled in the following commands can be run.

Build an NSD locally:

- `az aosm nsd build --config-file <input-file>`

Publish a prebuilt design:

- `az aosm nsd publish --build-output-folder <output-folder>`

## Edit the build output before publishing

The `az aosm` CLI extension is intended to provide support for publishing Azure Operator Service Manager designs and definitions. It provides the building blocks for creating complex custom designs and definitions. You can edit the files output by the `build` command before running the `publish` command, to add more complex or custom features.

The full API reference for Azure Operator Service Manager is here: [Azure Hybrid Network REST API](/rest/api/hybridnetwork/).

The following sections describe some common ways that you can use to edit the built files before publishing.

### Network Function Definitions (NFDs)

- For CNFs, change the `releaseNamespace` of the `helmMappingRuleProfile` to change the kubernetes namespace that the chart is deployed to.

### Network Service Designs (NSDs)

- Add Azure Infrastructure to your Network Service Design (NSD). Adding Azure infrastructure to your can involve:
  - Writing ARM templates to deploy the infrastructure.
  - Adding Configuration Group Schemas (CGSs) for these ARM templates.
  - Adding `ResourceElementTemplates` (RETs) of type `ArmResourceDefinition` to your NSD. The RETs look the same as `NetworkFunctionDefinition` RETs apart from the `type` field.
  - Adding the infrastructure ARM templates to the `artifact_manifest.bicep` file.
  - Editing the `configMappings` files to incorporate any outputs from the infrastructure templates as inputs to the `NetworkFunctionDefinition` ResourceElementTemplates. For example: `"customLocationId": "{outputparameters('infraretname').infraretname.customLocationId.value}"`
  - Editing the `dependsOnProfile` for the `NetworkFunctionDefinition` ResourceElementTemplates (RETs) to ensure that infrastructure RETs are deployed before NF RETs.
