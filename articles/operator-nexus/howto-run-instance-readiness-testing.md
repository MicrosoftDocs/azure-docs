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
- curl to download IRT package
- the User Access Admin & Contributor roles for the execution subscription

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
   1. **[Optional] SUBSCRIPTION** - to set the subscription. Alternatively, the script will use az CLI context to lookup the subscription.

```bash
# Example execution of the script
MI_RESOURCE_GROUP="<your resource group>" MI_NAME="<your managed identity name>" SUBSCRIPTION="<your subscription ID>" ./create-managed-identity.sh
```

**RESULT:** This script will print a value for `MANAGED_IDENTITY_ID`, which should be recorded in the irt-input.yml for use


#### Service Principal & AAD Security Group
A service principal with the following role assignments. The supplemental script, `create-service-principal.sh` will create a service principal with these role assignments, or add role assignments to an existing service principal. 
   1. `Contributor` - For creating and manipulating resources
   1. `Storage Blob Data Contributor` - For reading from and writing to the storage blob container
   1. `Azure ARC Kubernetes Admin` - For ARC enrolling the NAKS cluster

Additionally, it will create the necessary security group, and add the service principal to the security group. If the security group exists, it will add the service principal to the existing security group.

Executing `create-service-principal` requires the following environment variables to be set;
    1. SERVICE_PRINCIPAL_NAME - The name of the service principal, created with the `az ad sp create-for-rbac` command.
    1. AAD_GROUP_NAME - The name of the security group.

```bash
# Example execution of the script
SERVICE_PRINCIPAL_NAME="<your service principal name>" AAD_GROUP_NAME="<your security group name>" ./create-service-principal.sh
```

**RESULT:** This script will print values for `AAD_GROUP_ID`, `SP_ID`, `SP_PASSWORD`, and `SP_TENANT`, which should be recoreded in irt-input.yml for use.


#### [If Necessary] Create Isolation Domains
They aren't lifecycled as part of this test scenario.
   * **Note:** if deploying isolation domains, your network blueprint must define at least one external network per isolation domain. see `networks-blueprint.example.yml` for help with configuring your network blueprint.
   * `create-l3-isolation-domains.sh` takes one parameter, a path to your networks blueprint file; here's an example of the script being invoked:
     * `create-l3-isolation-domains.sh ./networks-blueprint.yml`

#### [Optional] Create Storage to Archive Results
IRT creates an html test report after running a test scenario. These reports can optionally be uploaded to a blob storage container. the supplementary script `create-archive-storage.sh` to create a storage container, storage account, and resource group if they don't already exist.


Executing `create-managed-identity.sh` requires the following environment variables to be set;
   1. **RESOURCE_GROUP** - The resource group the Managed Identity will be created in. The resource group will be created in `eastus` if the resource group provided does not yet exist.
   1. **STORAGE_ACCOUNT_NAME** - The name of the Azure storage account to be created.
   1. **STORAGE_CONTAINER_NAME** - The name of the blob storage container to be created.
   1. **[Optional] SUBSCRIPTION** - to set the subscription. Alternatively, the script will use az CLI context to lookup the subscription.


```bash
# Example execution of the script
RESOURCE_GROUP="<your resource group>" STORAGE_ACCOUNT_NAME="<your storage account name>" STORAGE_CONTAINER_NAME="<your container name>" ./create-archive-storage.sh
```

**RESULT:** This script will print values for `PUBLISH_RESULTS_TO` which should be recoreded in irt-input.yml for use.


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
 1. If the `PUBLISH_RESULTS_TO` parameter was provided, the results are uploaded to the blob container you specified. It can be previewed by navigating to the link presented to you at the end of the IRT run.
