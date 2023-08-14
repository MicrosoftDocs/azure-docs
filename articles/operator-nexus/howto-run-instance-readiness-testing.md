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
- The User Access Admin & Contributor roles for the execution subscription
- The ability to create security groups in your Active Directory tenant 

## Input configuration

Build your input file. The IRT tarball provides `irt-input.example.yml` as an example, follow the [instructions](#download-irt) to download the tarball. These values **will not work for your instances**, they need to be manually changed and the file should also be renamed to `irt-input.yml`. The example input file is provided as a stub to aid in configuring new input files. Overridable values and their usage are outlined in the example. The **[One Time Setup](#one-time-setup) assists in setting input values by writing key/value pairs to the config file as they execute.**

The network information is provided in either a `networks-blueprint.yml` file, similar to the `networks-blueprint.example.yml` that is provided, or appended to the `irt-input.yml` file. The  schema for IRT is defined in the `networks-blueprint.example.yml`. The networks are created as part of the test, provide network details that aren't in use. Currently IRT has the following network requirements:

* Three (3) L3 Networks
   * Two of them with MTU 1500
   * One of them with MTU 9000 and shouldn't have a fabric_asn attribute
* One (1) Trunked Network
* All vlans should be greater than 500

## One Time Setup

### Download IRT 
IRT is distributed via tarball, download it, extract it, and navigate to the `irt` directory
1. From your Linux environment, download nexus-irt.tar.gz from aka.ms/nexus-irt `curl -Lo nexus-irt.tar.gz aka.ms/nexus-irt`
1. Extract the tarball to the local file system: `mkdir -p irt && tar xf nexus-irt.tar.gz --directory ./irt`
1. Switch to the new directory `cd irt`


### Install dependencies
There are multiple dependencies expected to be available during execution. Review this list;

* `jq` version 1.6 or greater
* `yq` version 4.33 or greater
* `azcopy` version 10 or greater
* `az` Azure CLI minimum version not known, stay up to date.
* `elinks` - for viewing html files on the command line
* `tree` - for viewing directory structures
* `moreutils` - for viewing progress from the ACI container

The `setup.sh` script is provided to aid with installing the listed dependencies. It installs any dependencies that aren't available in PATH. It doesn't upgrade any dependencies that don't meet the minimum required versions.

> [!NOTE] 
> `setup.sh` assumes a nonroot user and attempts to use `sudo`

### All in one setup

`all-in-one-setup.sh` is provided to create all of the Azure resources required to run IRT. This process includes creating a managed identity, a service principal, a security group, isolation domains, and a storage account to archive the test results. These resources can be created during the all in one script, or they can be created step by step per the instructions in this document. Each of the script, individually and via the all in one script, writes updates to your `irt-input.yml` file with the key value pairs needed to utilize the resources you created. Review the `irt-input.example.yml` file for the required inputs needed for the script(s), regardless of the methodology you pursue. All of the scripts are idempotent, and also allow you to use existing resources if desired. 

### Step-by-Step setup

> [!NOTE]
> Only use this section if you're NOT using `all-in-one.sh`

If your workflow is incompatible with `all-in-one.sh`, each resource needed for IRT can be created manually with each supplemental script. Like `all-in-one.sh`, running these scripts  writes key/value pairs to your `irt-input.yml` for you to use during your run. These five scripts make up the `all-in-one.sh`. 

IRT makes commands against your resources, and needs permission to do so. IRT requires a Managed Identity and a Service Principal to execute. It also requires that the service principal is a  member of the Azure AD Security Group that is also provided as input.

#### Create managed identity
A managed identity with the following role assignments is needed to execute tests. The supplemental script, `create-managed-identity.sh` creates a managed identity with these role assignments.
   * `Contributor` - For creating and manipulating resources
   * `Storage Blob Data Contributor` - For reading from and writing to the storage blob container
   * `Log Analytics Reader` - For reading metadata about the LAW


Executing `create-managed-identity.sh` requires the following environment variables to be set;
   * **MI_RESOURCE_GROUP** - The resource group the Managed Identity is created in. The resource group is created in `eastus` if the resource group provided doesn't yet exist.
   * **MI_NAME** - The name of the Managed Identity to be created.
   * **[Optional] SUBSCRIPTION** - to set the subscription. Alternatively, the script uses az CLI context to look up the subscription.

```bash
# Example execution of the script
MI_RESOURCE_GROUP="<your resource group>" MI_NAME="<your managed identity name>" SUBSCRIPTION="<your subscription ID>" ./create-managed-identity.sh
```

**RESULT:** This script prints a value for `MANAGED_IDENTITY_ID`. This key/value pair should be recorded in the irt-input.yml for use. See [Input Configuration](#input-configuration).


#### Create service principal and security group
A service principal with the following role assignments. The supplemental script, `create-service-principal.sh`  creates a service principal with these role assignments, or add role assignments to an existing service principal. 
   * `Contributor` - For creating and manipulating resources
   * `Storage Blob Data Contributor` - For reading from and writing to the storage blob container
   * `Azure ARC Kubernetes Admin` - For ARC enrolling the NAKS cluster

Additionally, the script creates the necessary security group, and adds the service principal to the security group. If the security group exists, it adds the service principal to the existing security group.

Executing `create-service-principal.sh` requires the following environment variables to be set:
   * SERVICE_PRINCIPAL_NAME - The name of the service principal, created with the `az ad sp create-for-rbac` command.
   * AAD_GROUP_NAME - The name of the security group.

```bash
# Example execution of the script
SERVICE_PRINCIPAL_NAME="<your service principal name>" AAD_GROUP_NAME="<your security group name>" ./create-service-principal.sh
```

**RESULT:** This script prints values for `AAD_GROUP_ID`, `SP_ID`, `SP_PASSWORD`, and `SP_TENANT`. This key/value pair should be recorded in irt-input.yml for use. See [Input Configuration](#input-configuration).


#### Create isolation domains
The testing framework doesn't create, destroy, or manipulate isolation domains. Therefore, existing Isolation Domains can be used. Each Isolation Domain requires at least one external network. The supplemental script, `create-l3-isolation-domains.sh`. Internal networks are created, manipulated, and destroy through the course of testing. They're created using the data provided in the networks blueprint.

Executing `create-l3-isolation-domains.sh` requires one **parameter**, a path to your networks blueprint file:
  
```bash
# Example of the script being invoked:
./create-l3-isolation-domains.sh ./networks-blueprint.yml
```

#### Create archive storage
IRT creates an html test report after running a test scenario. These reports can optionally be uploaded to a blob storage container. the supplementary script `create-archive-storage.sh` to create a storage container, storage account, and resource group if they don't already exist.


Executing `create-managed-identity.sh` requires the following environment variables to be set:
   * **RESOURCE_GROUP** - The resource group the Managed Identity is created in. The resource group is created in `eastus` if the resource group provided doesn't yet exist.
   * **STORAGE_ACCOUNT_NAME** - The name of the Azure storage account to be created.
   * **STORAGE_CONTAINER_NAME** - The name of the blob storage container to be created.
   * **[Optional] SUBSCRIPTION** - to set the subscription. Alternatively, the script uses the az CLI context to look up the subscription.


```bash
# Example execution of the script
RESOURCE_GROUP="<your resource group>" STORAGE_ACCOUNT_NAME="<your storage account name>" STORAGE_CONTAINER_NAME="<your container name>" ./create-archive-storage.sh
```

**RESULT:** This script prints a value for `PUBLISH_RESULTS_TO`. This key/value pair should be recorded in irt-input.yml for use. See [Input Configuration](#input-configuration).


## Execution

* Execute. This example assumes irt-input.yml is in the same location as irt.sh. If your file is located in a different directory, provide the full file path.

```bash
./irt.sh irt-input.yml
```

## Results

1. A file named `summary-<cluster_name>-<timestamp>.html` is downloaded at the end of the run and contains the testing results. It can be viewed:
    1. From any browser
    1. Using elinks or lynx to view from the command line; for example:
       1.  `elinks summary-<cluster_name>-<timestamp>.html`
 1. If the `PUBLISH_RESULTS_TO` parameter was provided, the results are uploaded to the blob container you specified. It can be previewed by navigating to the link presented to you at the end of the IRT run.
