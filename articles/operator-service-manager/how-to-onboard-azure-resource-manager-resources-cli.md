---
title: How to add Azure Resource Manager (ARM) resources to a Network Service Design Version (NSDV) using the Azure Operator Service Manager (AOSM) CLI extension
description: Learn how to add Azure Resource Manager (ARM) resources to a Network Service Design Version (NSDV) using the Azure Operator Service Manager (AOSM) CLI extension.
author: pjw711
ms.author: peterwhiting
ms.date: 04/09/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli

---
# Add Azure Resource Manager (ARM) resources to an Azure Operator Service Manager (AOSM) Network Service Design Version (NSDV)

Azure Operator Service Manager (AOSM) allows you to combine Network Function Definition Versions (NFDV) and Azure Resource Manager (ARM) templates into a Network Service Design Version (NSDV). The NSDV becomes a single template for a Network Service that contains both a Network Function and the Azure infrastructure it requires to run. An operator can then deploy the Network Function (NF) and its infrastructure in one operation.

In this how-to guide, you learn how to use the Azure CLI AOSM extension to build and publish an NSDV containing both a Containerized Network Function (CNF) an Azure Resource Manager (ARM) resource.

Onboarding is a multi-step process. Once you meet the prerequisites, you'll use the Azure CLI AOSM extension to:

1. Modify an existing NSDV input file for a previously onboarded CNF.
1. Fill the input file with the information required to build the AOSM resource definitions.
1. Generate BICEP files that define a Network Service Design Group and Version (NSDV) based on the input file and your ARM template.
1. Publish the NSDV and upload the ARM Template to an Artifact Store (AOSM-managed Azure Container Registry (ACR)).

This how-to guide uses Azure Key Vault (AKV) as an example of an Azure Resource, however, any Azure resource can be onboarded by following the same steps. This article uses a CNF as the example NF; the process is identical for a Virtualized Network Function (VNF) apart from minor differences in the NSDV input file.

## Prerequisites

- You have [enabled AOSM](quickstart-onboard-subscription-azure-operator-service-manager.md) on your Azure subscription.
- If your CNF is intended to run on Azure Operator Nexus, you have access to an Azure Operator Nexus instance and have completed [the prerequisites for workload deployment](/azure/operator-nexus/quickstarts-tenant-workload-prerequisites?tabs=azure-cli).
- You have onboarded [a CNF](how-to-onboard-containerized-network-function-cli.md) and have the input file you generated with the `az aosm nsd generate-config` file available on the local storage of the machine from which you're executing the CLI.

### Configure permissions

- You require the Contributor role over your subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.
- You require the `Contributor` and `AcrPush` role assignments on the subscription that will contain the AOSM managed Artifact Store.
  - Your company policy might prevent you from having subscription-scoped permissions. The `--no-subscription-permissions` parameter, available on the `az aosm nsd publish` command, uses tightly scoped permissions derived from the AOSM service to orchestrate a two-step copy to and from your local machine. This two-step copy is slower, but doesn't require subscription scoped permissions.

### ARM Templates

- You must have an ARM template that defines the Azure resources you want to deploy present on the local storage of the machine from which you're executing the CLI.
- Any parameters you want to expose to the operator who will deploy your NSDV must be defined as parameters in the ARM template.

> [!NOTE]
> The Az CLI AOSM Extension does not support onboarding Azure resources defined in a BICEP template. However, you can use the `bicep build` command to convert your BICEP files to ARM templates. See [the bicep CLI documentation](/azure/azure-resource-manager/bicep/bicep-cli) for detailed information and instructions.

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

## Build the Network Service Design Group and Version

1. Open the NSDV input file you generated when you onboarded your CNF.

    > [!NOTE]
    > You can generate a new input file using the `az aosm nsd generate-config --output-file <nsd-output-filename.jsonc>` command if you do not have the NSDV input file from your CNF onboarding.

1. Enter the required values using the inline comments in your input file. This example shows the Az CLI AOSM extension input file for a fictional Contoso NSDV that can be used to deploy a fictional Contoso CNF onto an Arc-connected Nexus Kubernetes cluster and an AKV instance in an Azure location.

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
        "nsdv_description": "An NSD that deploys the onboarded contoso-cnf NFD and an Azure Key Vault",
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
            },
            {
                // Type of Resource Element. Either NF or ArmTemplate
                "resource_element_type": "ArmTemplate",
                // Properties of the Resource Element.
                "properties": {
                    // Name of the artifact. Used as internal reference only.
                    "artifact_name": "contoso-keyvault",
                    // Version of the artifact in 1.1.1 format (three integers separated by dots).
                    "version": "1.0.0",
                    // File path (absolute or relative to this configuration file) of the artifact you wish to upload from your local disk.
                    // Use Linux slash (/) file separator even if running on Windows.
                    "file_path": "./contoso-keyvault.json"
                }
            }
        ]
    }
    ```
    > [!NOTE]
    > The resource element template section defines which NFD is included in the NSD. The properties must match those used in the input file passed to the `az aosm nfd build` command. This is because the Azure CLI AOSM Extension validates that the NFD has been correctly onboarded when building the NSD.

1. Execute the following command to build the Network Service Design Group and Version BICEP templates.

```azurecli
az aosm nsd build --config-file <nsd-output-filename.jsonc>
```

You can review the folder and files structure and make modifications if necessary.

## Publish the Network Service Design Group and Version

This step creates the AOSM resources that define the Network Service Design Group and Version. It also uploads artifacts required by the NSDV to the Artifact Store (NF ARM template and AKV ARM template).

1. Execute the following command to publish the Network Service Design Group and Version. If you don't have subscription scope `Contributor` and `AcrPush` roles, include `--no-subscription-permissions` in the command.

```azurecli
az aosm nsd publish --build-output-folder nsd-cli-output
```

You now have a complete set of AOSM publisher resources and are ready to perform the operator flow.

## Next steps

- [Prerequisites for Operator](quickstart-containerized-network-function-operator.md)
- [Create a Site Network Service](quickstart-containerized-network-function-create-site-network-service.md)
