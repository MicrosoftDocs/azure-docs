---
title: "Azure Operator Nexus: How to run Instance Readiness Testing"
description: Learn how to run instance readiness testing.
author: DannyMassa
ms.author: danielmassa
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/13/2023
ms.custom: template-how-to
---

# Instance readiness testing

Instance Readiness Testing (IRT) is a framework built to orchestrate real-world workloads for testing of the Azure Operator Nexus Platform.

## Environment requirements

- A Linux environment (Ubuntu suggested) capable of calling Azure APIs
- Knowledge of networks to use for the test
    * Networks to use for the test are specified in a "networks-blueprint.yml" file, see [Input Configuration](#input-configuration).
1. curl to download IRT package

## One Time Setup

### Download IRT 
IRT is distributed via tarball, download it, extract it, and navigate to the `irt` directory
1. From your Linux environment, download nexus-irt.tar.gz from aka.ms/nexus-irt `curl -Lo nexus-irt.tar.gz aka.ms/nexus-irt`
1. Extract the tarball to the local file system: `mkdir -p irt && tar xf nexus-irt.tar.gz --directory ./irt`
1. Switch to the new directory `cd irt`


### Install Dependencies
There are multiple dependencies expected to be available during execution. Review this list;

* `jq` version 1.6 or greater
* `yq` version 4.33 or greater
* `azcopy` version 10 or greater
* `az` Azure CLI minimum version not known, stay up to date.
* `elinks` - for viewing html files on the command line
* `tree` - for viewing directory structures
* `moreutils` - for viewing progress from the ACI container

The `setup.sh` script is provided to aid with installing the listed dependencies. It will install any dependencies that aren't available in PATH. It will not upgrade any dependencies that do not meet the minimum required versions.

**NOTE:** `setup.sh` assumes a nonroot user and attempts to use `sudo`


### Create Credentialed Resources 
IRT makes commands against your resources, and will need permission to do so. IRT requires a Managed Identity and a Service Principal to execute. It also requires that the service principal be member to an AAD Security Group that is also provided as input.

#### Managed Identity
A managed identity with the following role assignments is needed to execute tests. The supplemental script, `create-managed-identity.sh` will create a managed identity with these role assignments.
   1. `Contributor` - For creating and manipulating resources
   1. `Storage Blob Data Contributor` - For reading from and writing to the storage blob container
   1. `Log Analytics Reader` - For reading metadata about the LAW


Executing `create-managed-identity.sh` requires the following environment variables to be set;
   1. **MI_RESOURCE_GROUP** - The resource group the Managed Identity will be created in. The resource group will be created in `eastus` if the resource group provided does not yet exist.
   1. **MI_NAME** - The name of the Managed Identity to be created.
   1. **[Optional] SUBSCRIPTION** - to set the subscription, script with use az cli context for the subscription.

**NOTE:** This script will print a value for MANAGED_IDENTITY_ID, which should be recorded in the irt-input.yml for use


#### Service Principal
A service principal with the following role assignments. The supplemental script, `create-service-principal.sh` will create a service principal with these role assignments, or add role assignments to an existing service principal. 
   1. `Contributor` - For creating and manipulating resources
   1. `Storage Blob Data Contributor` - For reading from and writing to the storage blob container
   1. `Azure ARC Kubernetes Admin` - For ARC enrolling the NAKS cluster


#### AAD Security Group
An AAD Security Group containing the service principal - To add to the NAKS cluster, giving it the ability to access the cluster


Running IRT requires the following parameters:
1. `AAD_GROUP_ID` - The object ID of the group the service principal belongs to. 
1. `SP_ID` - The principal ID of the service principal used for testing
1. `SP_PASSWORD` - The password of the service principal used for testing
1. `SP_TENANT` - The tenant ID of the service principal used for testing

1. Log into Azure, if not already logged in: `az login --use-device`
    * User should have `Contributor` role and ``
1. Create an Azure Managed Identity for the container to use.
    * Using the provided script: `MI_RESOURCE_GROUP="<your resource group> MI_NAME="<managed identity name>" SUBSCRIPTION="<subscription>" ./create-managed-identity.sh`
    * Can be created manually via the Azure portal, refer to the script for needed permissions
1. Create a service principal and security group. The service principal is used as the executor of the test. The group informs the kubernetes cluster of valid users. The service principal must be a part of the security group, so it has the ability to log into the cluster.
    * You can provide your own, or use our provided script, here's an example of how it could be executed; `AAD_GROUP_NAME=external-test-aad-group-8 SERVICE_PRINCIPAL_NAME=external-test-sp-8 ./irt/create-service-principal.sh`.
    * This script prints four key/value pairs for you to include in your input file.

**[If Necessary] Create Isolation Domains** - They aren't lifecycled as part of this test scenario.
   * **Note:** if deploying isolation domains, your network blueprint must define at least one external network per isolation domain. see `networks-blueprint.example.yml` for help with configuring your network blueprint.
   * `create-l3-isolation-domains.sh` takes one parameter, a path to your networks blueprint file; here's an example of the script being invoked:
     * `create-l3-isolation-domains.sh ./networks-blueprint.yml`

**[Optional] Create Storage to Archive Results** - IRT creates an html test report after running a test scenario. These reports can optionally be uploaded to a blob storage container
1.  Set up a storage account to archive test results over time. For help, see the [instructions](#uploading-results-to-your-own-archive)


### Input configuration

1. Build your input file. The IRT tarball provides `irt-input.example.yml` as an example. These values **will not work for all instances**, they need to be manually changed and the file also needs to be renamed to `irt-input.yml`.
1. define the values of networks-blueprint input, an example of this file is given in networks-blueprint.example.yml.

The network blueprint input schema for IRT is defined in the networks-blueprint.example.yml. Currently IRT has the following network requirements. The networks are created as part of the test, provide network details that aren't in use.

1. Three (3) L3 Networks

   * Two of them with MTU 1500
   * One of them with MTU 9000 and shouldn't have fabric_asn definition

1. One (1) Trunked Network
1. All vlans should be greater than 500

## Execution

1. Execute: `./irt.sh irt-input.yml`
    * This example assumes irt-input.yml is in the same location as irt.sh. If your file is located in a different directory, provide the full file path.

## Results

1. A file named `summary-<cluster_name>-<timestamp>.html` is downloaded at the end of the run and contains the testing results. It can be viewed:
    1. From any browser
    1. Using elinks or lynx to view from the command line; for example:
       1.  `elinks summary-<cluster_name>-<timestamp>..html`
    1. When an SAS Token is provided for the `PUBLISH_RESULTS_TO` parameter the results are uploaded to the blob container you specified. It can be previewed by navigating to the link presented to you at the end of the IRT run.

### Uploading results to your own archive

1. We offer a supplementary script, `create-archive-storage.sh` to allow you to set up a storage container to store your results. The script generates an SAS Token for a storage container that is valid for three days. The script creates a storage container, storage account, and resource group if they don't already exist.
   1. The script expects the following environment variables to be defined:
      1. RESOURCE_GROUP
      1. SUBSCRIPTION
      1. STORAGE_ACCOUNT_NAME
      1. STORAGE_CONTAINER_NAME
1. Copy the last output from the script, into your IRT YAML input. The output looks like this:
   * `PUBLISH_RESULTS_TO="<sas-token>"`
