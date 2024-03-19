---
title: How to onboard a VNF using the Azure Operator Service Manager CLI extension
description: Learn how to onboard a VNF using the Azure Operator Service Manager CLI extension.
author: peterwhiting
ms.author: peterwhiting
ms.date: 03/19/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli

---

# Onboard a Virtualized Network Function (VNF) to Azure Operator Service Manager (AOSM)

**TODO: Should this doc be Nexus specific? I've written it for Nexus VNFs, but not explicitly put that in the title. Or should it be platform-agnostic, in which case there are loads of assumptions and pre-reqs per platform that just won't be called out?**

In this how-to guide, Network Function Publishers and Service Designers learn how to use the Azure CLI AOSM extension to onboard a virtualized network function to AOSM. Onboarding is a multi-step process. Once you meet the prerequisites, you'll use the Azure CLI AOSM extension to:

1. Create the BICEP files that define a Network Function Definition (NFD).
1. Publish the NFD and upload the VNF image to an AOSM-managed Azure Container Registry (ACR).
1. Add your published NFD to the BICEP files that define a Network Service Design (NSD).
1. Publish the NSD.

## Prerequisites

### Azure Subscription

An Azure account with an active subscription is required. If you don't have an Azure subscription, follow the instructions here [Start free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to create an account before you begin.

Contact your Microsoft account team to register your Azure subscription for access to AOSM or express your interest through the [partner registration form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR7lMzG3q6a5Hta4AIflS-llUMlNRVVZFS00xOUNRM01DNkhENURXU1o2TS4u).

### Permissions

- You require the Contributor role over your subscription in order to create a Resource Group, or an existing Resource Group where you have the Contributor role.
- You require the `Reader`/`AcrPull` role assignments on the source ACR containing your images.
- For the fastest image transfers, you require the `Contributor` and `AcrPush` role assignments on the subscription that will contain the AOSM managed Artifact Store. Alternatively, you can use the `--no-subscription-permissions` parameter when publishing images. This parameter means that you don't require subscription scoped permissions.

### Virtual Machine (VM) Azure Resource Manager (ARM) Templates and images

- You must create an [image for the Azure Operator Nexus Virtual Machine](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-virtual-machine-image). This image must be available in an ACR
- You must have an [ARM template that deploys an Azure Operator Nexus Virtual Machine](https://learn.microsoft.com/en-us/azure/operator-nexus/quickstarts-virtual-machine-deployment-arm?tabs=azure-cli)
- The VM ARM template (for both AzureCore and Nexus) can only deploy ARM resources from the following Resource Providers

  - Microsoft.Compute

  - Microsoft.Network

  - Microsoft.NetworkCloud

  - Microsoft.Storage

  - Microsoft.NetworkFabric

  - Microsoft.Authorization

  - Microsoft.ManagedIdentity

- The VNF ARM template should deploy one VM. Multiple VMs can be deployed by including multiple instances of the NFD in the NSD

> [!NOTE]
> It is strongly recommended that you have tested that the VM deployment succeeds on your Azure Operator Nexus instance before onboarding the VNF to AOSM.

### Register your subscription with the AOSM service

Before you begin using the Azure Operator Service Manager, make sure to register the required resource provider. Execute the following commands. This registration process can take up to 5 minutes.

```azurecli
# Register Resource Provider
az provider register --namespace Microsoft.HybridNetwork
az provider register --namespace Microsoft.ContainerRegistry
```

> [!NOTE]
> It may take a few minutes for the resource provider registration to complete.

You can verify that your subscription is registered to use AOSM by running the following commands:

### Verify the registration status of the resource providers

Execute the following commands:

```azurecli
# Query the Resource Provider
az provider show -n Microsoft.HybridNetwork --query "{RegistrationState: registrationState, ProviderName: namespace}"
az provider show -n Microsoft.ContainerRegistry --query "{RegistrationState: registrationState, ProviderName: namespace}"
```

### Download and install Azure CLI

Use the Bash environment in the Azure cloud shell. For more information, see [Start the Cloud Shell](/azure/cloud-shell/quickstart?tabs=azurecli) to use Bash environment in Azure Cloud Shell.

For users that prefer to run CLI reference commands locally refer to [How to install the Azure CLI](/cli/azure/install-azure-cli).

If you're running on Window or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

If you're using a local installation, sign into the Azure CLI using the `az login` command and complete the prompts displayed in your terminal to finish authentication. For more sign-in options, refer to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

### Install Azure Operator Service Manager (AOSM) CLI extension

Install the Azure Operator Service Manager (AOSM) CLI extension using this command:

```azurecli
az extension add --name aosm
```

1. Run `az version` to see the version and dependent libraries that are installed.
2. Run `az upgrade` to upgrade to the current version of Azure CLI.

### Download and install Helm and the Docker engine

Install Helm and the Docker engine by following the linked documents:

- [Install Helm CLI](https://helm.sh/docs/intro/install/)
- [Install the Docker Engine](https://docs.docker.com/engine/install/)

## Build the Network Function Definition (NFD)

This section creates a folder in the working directory called `vnf-cli-output`. This folder contains the BICEP templates of the Azure Operator Service Manager resources, which define a Network Function Definition and the Artifact Store that will be used to store the VM image. This Network Function Definition templates a Network Function that can be deployed using AOSM once it has been included in a Network Service Design.

1. Sign in to Azure using the Azure CLI and set the default subscription.

```azurecli
az login
az account set --subscription <subscription>
```

1. Generate the Azure CLI AOSM extension input file for a VNF.

```azurecli
az aosm nfd generate-config --definition-type vnf-nexus --output-file <filename.jsonc>
```

1. Open the input file you generated in the previous step and use the inline comments to enter the required values. This example shows the Az CLI AOSM extension input file for a fictional contoso VNF, which runs on Azure Operator Nexus.

```json
{
    // Azure location to use when creating resources e.g uksouth
    "location": "eastus",
    // Name of the Publisher resource you want your definition published to.
    // Will be created if it does not exist.
    "publisher_name": "contoso",
    // Resource group for the Publisher resource.
    // Will be created if it does not exist.
    "publisher_resource_group_name": "contoso-vnf",
    // Name of the ACR Artifact Store resource.
    // Will be created if it does not exist.
    "acr_artifact_store_name": "contoso-vnf-artifact-store",
    // Name of the network function.
    "nf_name": "contoso-vnf",
    // Version of the network function definition in 1.1.1 format (three integers separated by dots).
    "version": "1.0.0",
    // ARM template configuration. The ARM templates given here would deploy a VM if run.They will be used to generate the VNF.
    "arm_templates": [
        {
            // Name of the artifact. Used as internal reference only.
            "artifact_name": "contoso-vnf",
            // Version of the artifact in 1.1.1 format (three integers separated by dots).
            "version": "1.0.0",
            // File path (absolute or relative to this configuration file) of the artifact you wish to upload from your local disk.
            // Use Linux slash (/) file separator even if running on Windows.
            "file_path": "/home/contoso-vnf/contoso-vnf-arm-template.json"
        }
    ],
    // List of images to be pulled from the acr registry.
    // You must provide the source acr registry, the image name and the version.
    // For example: 'sourceacr.azurecr.io/imagename:imageversion'.
    "images": ["contoso-vnf.azurecr.io/contosovnf:1.0.0"]
}```

1. Execute the following command to build the Network Function Definition.

```azurecli
az aosm nfd build --definition-type vnf-nexus --config-file <filename.jsonc>
```

## Publish the Network Function Definition (NFD)

This step creates the Azure Operator Service Manager resources that define the Network Function Definition and the Artifact Store that will be used to store the Network Function's VM images. It also uploads the image to the Artifact Store either by copying them directly from the source ACR or, if you don't have subscription scope `Contributor` and `AcrPush` roles, by retagging the docker images locally and uploading to the Artifact Store using tightly scoped credentials generated from the AOSM service.

1. Execute the following command to publish the Network Function Definition. If you don't have subscription scope `Contributor` and `AcrPush` roles, include `--no-subscription-permissions` in the command.

```azurecli
az aosm nfd publish --build-output-folder vnf-cli-output --definition-type vnf
```

## Build the Network Service Design (NSD)

This section creates a folder in the working directory called `nsd-cli-output`. This folder contains the BICEP templates of the Azure Operator Service Manager resources, which define a Network Service Design. This Network Service Design templates a Site Network Service resource that will deploy the Network Function you onboarded in the previous sections.

1. Generate the Azure CLI AOSM Extension NSD input file.

```azurecli
az aosm nsd generate-config --output-file <nsd-output-filename.jsonc>
```

1. Open the input file you generated in the previous step and use the inline comments to enter the required values. This example shows the Az CLI AOSM extension input file for a fictional contoso NSD that can be used to deploy a fictional contoso VNF onto an Azure Operator Nexus instance. The `nfvi_type` parameter must be set to `AzureOperatorNexus`.

```json
{
    // Azure location to use when creating resources e.g uksouth
    "location": "eastus",
    // Name of the Publisher resource you want your definition published to.
    // Will be created if it does not exist.
    "publisher_name": "contoso",
    // Resource group for the Publisher resource.
    // Will be created if it does not exist.
    "publisher_resource_group_name": "contoso-vnf",
    // Name of the ACR Artifact Store resource.
    // Will be created if it does not exist.
    "acr_artifact_store_name": "contoso-vnf-artifact-store",
    // Network Service Design (NSD) name. This is the collection of Network Service Design Versions. Will be created if it does not exist.
    "nsd_name": "contoso-vnf-nsd",
    // Version of the NSD to be created. This should be in the format A.B.C
    "nsd_version": "1.0.0",
    // Optional. Description of the Network Service Design Version (NSDV).
    "nsdv_description": "An NSD that deploys the onboarded contoso-vnf NFD",
    // Type of NFVI (for nfvisFromSite). Defaults to 'AzureCore'.
    // Valid values are 'AzureCore', 'AzureOperatorNexus' or 'AzureArcKubernetes.
    "nfvi_type": "AzureOperatorNexus",
    // List of Resource Element Templates.
    "resource_element_templates": [
        {
            // Type of Resource Element. Either NF or ArmTemplate
            "resource_element_type": "NF",
            "properties": {
                // The name of the existing publisher for the NSD.
                "publisher": "contoso",
                // The resource group that the publisher is hosted in.
                "publisher_resource_group": "contoso-vnf",
                // The name of the existing Network Function Definition Group to deploy using this NSD.
                "name": "contoso-vnf",
                // The version of the existing Network Function Definition to base this NSD on.
                // This NSD will be able to deploy any NFDV with deployment parameters compatible with this version.
                "version": "1.0.0",
                // The region that the NFDV is published to.
                "publisher_offering_location": "eastus",
                // Type of Network Function. Valid values are 'cnf' or 'vnf'.
                "type": "vnf",
                // Set to true or false. Whether the NSD should allow arbitrary numbers of this type of NF. If false only a single instance will be allowed. Only supported on VNFs, must be set to false on CNFs.
                "multiple_instances": "false"
            }
        }
    ]
}
```

>[!NOTE]
> The resource element template section defines which NFD is included in the NSD. The properties must match those used in the input file passed to the `az aosm nfd build` command. This is because the Azure CLI AOSM Extension validates that the NFD has been correctly onboarded when building the NSD.

1. Execute the following command to build the Network Service Definition.

```azurecli
az aosm nsd build --config-file <nsd-output-filename.jsonc>
```

## Publish the Network Service Design (NSD)

This step creates the Azure Operator Service Manager resources that define the Network Service Definition. It also uploads artifacts required by the NSD to the Artifact Store.

1. Execute the following command to publish the Network Service Definition. If you don't have subscription scope `Contributor` and `AcrPush` roles, include `--no-subscription-permissions` in the command.

```azurecli
az aosm nsd publish --build-output-folder nsd-cli-output
```
