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
- curl or wget to download IRT package

## Before execution

1. From your Linux environment, download nexus-irt.tar.gz from aka.ms/nexus-irt `curl -Lo nexus-irt.tar.gz aka.ms/nexus-irt`.
1. Extract the tarball to the local file system: `mkdir -p irt && tar xf nexus-irt.tar.gz --directory ./irt`.
1. Switch to the new directory `cd irt`.
1. The `setup.sh` script is provided to aid in the initial set up of an environment.
    * `setup.sh` assumes a nonroot user and attempts to use `sudo`, which installs:
        1. `jq` version 1.6
        1. `yq` version 4.33
        1. `azcopy` version 10
        1. `az` Azure CLI minimum version not known, stay up to date.
        1. `elinks` for viewing html files on the command line
        1. `tree` for viewing directory structures
        1. `moreutils` utilities for viewing progress from the ACI container
1. [Optional] Set up a storage account to archive test results over time. For help, see the [instructions](#uploading-results-to-your-own-archive).
1. Log into Azure, if not already logged in: `az login --use-device`.
    * User should have `Contributor` role
1. Create an Azure Managed Identity for the container to use.
    * Using the provided script: `MI_RESOURCE_GROUP="<your resource group> MI_NAME="<managed identity name>" SUBSCRIPTION="<subscription>" ./create-managed-identity.sh`
    * Can be created manually via the Azure portal, refer to the script for needed permissions
1. Create a service principal and security group. The service principal is used as the executor of the test. The group informs the kubernetes cluster of valid users. The service principal must be a part of the security group, so it has the ability to log into the cluster.
    * You can provide your own, or use our provided script, here's an example of how it could be executed; `AAD_GROUP_NAME=external-test-aad-group-8 SERVICE_PRINCIPAL_NAME=external-test-sp-8 ./irt/create-service-principal.sh`.
    * This script prints four key/value pairs for you to include in your input file.
1. If necessary, create the isolation domains required to execute the tests. They aren't lifecycled as part of this test scenario.
   * **Note:** If deploying isolation domains, your network blueprint must define at least one external network per isolation domain. see `networks-blueprint.example.yml` for help with configuring your network blueprint.
   * `create-l3-isolation-domains.sh` takes one parameter, a path to your networks blueprint file; here's an example of the script being invoked:
     * `create-l3-isolation-domains.sh ./networks-blueprint.yml`

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
    * Assumes irt-input.yml is in the same location as irt.sh. If in a different location provides the full file path.

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
