---
title: Azure Arc-enabled data services - Automated deployment and integration testing
description: Running containerized integration tests on any Kubernetes Cluster
author: mdrakiburrahman
ms.author: mdrrahman
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 09/07/2022
ms.topic: tutorial
ms.custom: template-tutorial 
---


# Tutorial: Automated kube-native Integration Tests

As part of each commit that builds up Arc-enabled data services, Microsoft runs automated CI/CD pipelines that performs end-to-end integration tests. These tests are orchestrated via 2 containers that are maintained alongside the core-product (e.g. Data Controller, Azure Arc-enabled SQL managed instance & PostgreSQL server). These are:
1. `arc-ci-launcher`: Containing deployment dependencies (e.g. CLI extensions), as well product deployment code (using azure cli) for both Direct and Indirect connectivity modes. Once Kubernetes is onboarded with the Data Controller, the container leverages [Sonobuoy](https://sonobuoy.io/) to trigger parallel integration tests.
2. `arc-sb-plugin`: A [Sonobuoy plugin](https://sonobuoy.io/plugins/) containing [Pytest](https://docs.pytest.org/en/7.1.x/)-based end-to-end integration tests, ranging from simple smoke-tests (e.g. deployments, deletes), to complex high-availability scenarios, chaos-tests (resource deletions) etc.

These testing containers are made publicly available for customers and partners to ensure reliability in their own Kubernetes clusters - running anywhere - to ease continuous conformance tests, and pre-production/QA testing. 

The following diagram outlines this high-level process:

![Overview](media/automated-integration-testing/integration-testing-overview.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy `arc-ci-launcher` using `kubectl`
> * Examine integration test results in your Azure Blob Storage account

## Prerequisites
 
- **Credentials**: The [`test.env.tmpl`](https://github.com/microsoft/azure_arc/tree/main/arc_data_services/test/launcher/base/configs/.test.env.tmpl) file contains the necessary credentials required, and is a combination of the existing pre-requisites required to onboard an [Azure Arc Connected Cluster](https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster?tabs=azure-cli) and [Directly Connected Data Controller](https://docs.microsoft.com/en-us/azure/azure-arc/data/plan-azure-arc-data-services). Setup of this file is explained below with samples.

- **Client-tooling**: `kubectl` installed - minimum version (Major:"1", Minor:"21")

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->

## Kubernetes manifest preparation

The launcher is made available as part of the [`microsoft/azure_arc`](https://github.com/microsoft/azure_arc) repository, as a [Kustomize](https://kustomize.io/) manifest - Kustomize is [built into `kubectl`](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/) - so no additional tooling is required.

1. Clone the repo locally:

```bash
git clone https://github.com/microsoft/azure_arc.git
```

2. Navigate to `azure_arc/arc_data_services/test/launcher`, to see the following folder structure:

```text
├── base                                         <- Comon base for all Kubernetes Clusters
│   ├── configs
│   │   └── .test.env.tmpl                       <- To be converted into .test.env with credentials for a Kubernetes Secret
│   ├── kustomization.yaml                       <- Defines the generated resources as part of the launcher
│   └── launcher.yaml                            <- Defines the Kubernetes resources that make up the launcher
└── overlays                                     <- Overlays for specific Kubernetes Clusters
    ├── aks
    │   ├── configs
    │   │   ├── patch.aks.json.tmpl              <- To be converted into patch.json, patch for Data Controller control.json
    │   └── kustomization.yaml
    ├── kubeadm
    │   ├── configs
    │   │   └── patch.kubeadm.json.tmpl
    │   └── kustomization.yaml
    └── openshift
        ├── configs
        │   └── patch.openshift.json.tmpl
        ├── kustomization.yaml
        └── scc.yaml
```

In this tutorial, we're going to focus on steps for AKS, but the overlay structure above can be extended to include additional Kubernetes distributions.


The ready to deploy manifest will represent the following:
```text
├── base
│   ├── configs
│   │   ├── .test.env                           <- Config 1: For Kubernetes secret, see sample below
│   │   └── .test.env.tmpl
│   ├── kustomization.yaml
│   └── launcher.yaml
└── overlays
    └── aks
        ├── configs
        │   ├── patch.aks.json.tmpl
        │   └── patch.json                      <- Config 2: For control.json patching, see sample below
        └── kustomization.yam
```

There are 2 files that needs to be generated to localize the launcher to run inside a specific environment. Each of these files can be generated by cloning and filling out each of the template (`.tmpl`) files above.


### Config 1: `.test.env`

A filled-out sample of the `.test.env` file, generated based on `.test.env.tmpl` is shared below with inline explanations.

**Note**: the `export VAR="value"` syntax below is not meant to be run locally to source environment variables - but is there for the launcher. The launcher will mount this `.test.env` file as-is as a Kubernetes `secret` using Kustomize's [`secretGenerator`](https://github.com/kubernetes-sigs/kustomize/blob/master/examples/secretGeneratorPlugin.md#secret-values-from-local-files), and during initialization, run [`source`](https://ss64.com/bash/source.html), which will import the environment variables into the launcher upon start.

In other words, after filling out `.test.env.tmpl` to create `.test.env`, the generated file should look similar to the sample below, meaning the `.test.env` file fillout process will is identical across Operating Systems/Terminals.

Finished sample of `.test.env`:
```bash
# Controller deployment mode: direct, indirect
# For 'direct', the launcher will also onboard the Kubernetes Cluster to Azure Arc
# For 'indirect', the launcher will skip Azure Arc onboarding and proceed to Data Controller deployment
#
export CONNECTIVITY_MODE="direct"

# 1. Extension and 2. Image versions are retrieved from:
# https://docs.microsoft.com/en-us/azure/azure-arc/data/version-log
#
# The launcher supports deployment of older release versions

# 1. Extension version
#
export ARC_DATASERVICES_EXTENSION_RELEASE_TRAIN="stable"
export ARC_DATASERVICES_EXTENSION_VERSION_TAG="1.11.0"

# 2. Image version
#
export DOCKER_IMAGE_POLICY="Always"
export DOCKER_REGISTRY="mcr.microsoft.com"
export DOCKER_REPOSITORY="arcdata"
export DOCKER_TAG="v1.11.0_2022-09-13"

# 3. Arcdata CLI version override
#
# The launcher image is pre-packaged with the latest arcdata CLI version
# To install an older/newer version, fill in with Blob URL to override the launcher's pre-packaged version; e.g:
#
# ARC_DATASERVICES_WHL_OVERRIDE="https://azurearcdatacli.blob.core.windows.net/cli-extensions/arcdata-1.4.5-py2.py3-none-any.whl"
#
# See latest versions here: https://azcliextensionsync.blob.core.windows.net/index1/index.json
#
# Or, leave empty to use pre-packaged default.
#
ARC_DATASERVICES_WHL_OVERRIDE=""

# ARM parameters used by az cli
#
# Follow steps here to retrieve the Custom Location OID for your Azure AD tenant:
# https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster
export CUSTOM_LOCATION_OID="51d..."

# A pre-rexisting Resource Group is used if found with the same name. Otherwise, launcher will attempt to create a Resource Group
# with the name specified, using the Service Principal specified
export LOCATION="eastus"
export RESOURCE_GROUP_NAME="..."

# A Service Principal with sufficient privileges documented here:
# https://docs.microsoft.com/en-us/azure/azure-arc/data/upload-metrics-and-logs-to-azure-monitor?tabs=windows#create-service-principal
export SPN_CLIENT_ID="..."
export SPN_CLIENT_SECRET="..."
export SPN_TENANT_ID="..."
export SUBSCRIPTION_ID="..."

# Optional: certain integration tests test upload to Log Analytics workspace:
# https://docs.microsoft.com/en-us/azure/azure-arc/data/upload-logs?tabs=windows
export WORKSPACE_ID="..."
export WORKSPACE_SHARED_KEY="..."

# Controller Kubernetes Deployment profiles - samples for AKS
#
export CONTROLLER_PROFILE="azure-arc-aks-default-storage"
export DEPLOYMENT_INFRASTRUCTURE="azure"
export KUBERNETES_STORAGECLASS="default"

# Log/test result upload from launcher container
#
# The launcher requires a Storage Account scoped SAS URL that must have permissions to:
# 1. Create a new Storage Container (name based on LOGS_STORAGE_CONTAINER)
# 2. Create new blobs (test log tarfiles)
#
# Steps: https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview#account-sas
#
export LOGS_STORAGE_ACCOUNT="<your-storage-account>"
export LOGS_STORAGE_ACCOUNT_SAS="?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=...&spr=https&sig=..."
export LOGS_STORAGE_CONTAINER="arc-ci-launcher-1662513182"

# Test behavior parameters
# The test suites to execute - space seperated array, 
# Use these default values that run short smoke tests, further elaborate test suites will be added in upcoming releases
#
export SQL_HA_TEST_REPLICA_COUNT="3"
export TESTS_DIRECT="direct-crud direct-hydration controldb"
export TESTS_INDIRECT="billing controldb kube-rbac"
export TEST_REPEAT_COUNT="1"
export TEST_TYPE="ci"

# Control Launcher behavior by setting to '1':
#
# - SKIP_PRECLEAN: Skips initial cleanup
# - SKIP_SETUP: Skips Arc Data deployment
# - SKIP_TEST: Skips sonobuoy tests
# - SKIP_POSTCLEAN: Skips final cleanup
# - SKIP_UPLOAD: Skips log upload
#
# See further explanation on each of these parameters below
#
export SKIP_PRECLEAN="0"
export SKIP_SETUP="0"
export SKIP_TEST="0"
export SKIP_POSTCLEAN="0"
export SKIP_UPLOAD="0"
```

### Config 2: `patch.json`

A filled-out sample of the `patch.json` file, generated based on `patch.aks.json.tmpl` is shared below:

> Note that the `spec.docker.registry, repository, imageTag` should be identical to the values in `.test.env` above

Finished sample of `patch.json`:
```json
{
    "patch": [
        {
            "op": "add",
            "path": "spec.docker",
            "value": {
                "registry": "mcr.microsoft.com",
                "repository": "arcdata",
                "imageTag": "v1.11.0_2022-09-13",
                "imagePullPolicy": "Always"
            }
        },        
        {
            "op": "add",
            "path": "spec.storage.data.className",
            "value": "default"
        },  
        {
            "op": "add",
            "path": "spec.storage.logs.className",
            "value": "default"
        },
        {
            "op": "add",
            "path": "spec.monitoring",
            "value": {
              "enableOpenTelemetry": true
            }
        }                     
    ]
}
```

## Launcher Deployment

> It is recommended to deploy the launcher in a **Non-Production/Test cluster** - as it performs destructive actions on Arc and other used Kubernetes resources.

To validate that the manifest has been properly setup, attempt client-side validation with `--dry-run=client`, which prints out the Kubernetes resources to be created for the launcher:

```bash
kubectl apply -k arc_data_services/test/launcher/overlays/aks --dry-run=client
# namespace/arc-ci-launcher created (dry run)
# serviceaccount/arc-ci-launcher created (dry run)
# clusterrolebinding.rbac.authorization.k8s.io/arc-ci-launcher created (dry run)
# secret/test-env-fdgfm8gtb5 created (dry run)                                        <- Created from Config 1: `patch.json`
# configmap/control-patch-2hhhgk847m created (dry run)                                <- Created from Config 2: `.test.env`
# job.batch/arc-ci-launcher created (dry run)
```

To deploy the launcher and tail logs, run the following:
```bash
kubectl apply -k arc_data_services/test/launcher/overlays/aks
kubectl wait --for=condition=Ready --timeout=360s pod -l job-name=arc-ci-launcher -n arc-ci-launcher
kubectl logs job/arc-ci-launcher -n arc-ci-launcher --follow
```

At this point, the launcher should start - and you should see the following:

![Overview](media/automated-integration-testing/launcher-start.png)

Although it's best to deploy the Launcher in a Cluster with no pre-existing Arc resources, the Launcher contains pre-flight validation to discover pre-existing Arc and Arc Data Services CRDs and ARM resources, and attempts to clean them up on a best-effort basis (using the provided Service Principal creds), prior to deploying the new release:

![Overview](media/automated-integration-testing/launcher-pre-flight.png)

This same metadata-discovery and cleanup process is also run upon launcher exit, to leave the cluster in it's pre-existing state before the launch.

## Steps performed by Launcher

At a high-level, the launcher performs the following sequence of steps:

1. Authenticates to Kubernetes API using Pod-mounted Service Account
2. Authenticates to ARM API using Secret-mounted Service Principal
3. Performs CRD metadata scan to discover existing Arc and Arc Data Services Custom Resources
4. Cleans up any existing Custom Resources in Kubernetes, and subsequent resources in Azure. In case of any mismatch between the credentials in `.test.env` compared to resources existing in the cluster, fails fast
5. Generates a unique set of environment variables based on timestamp for Arc Cluster name, Data Controller and Custom Location/Namespace. Prints out the environment variables, obfuscating sensitive values (e.g. Service Principal Password etc.)
6. a. For Direct Mode - Onboards the Cluster to Azure Arc, then deploys the Controller via the [unified experience](https://docs.microsoft.com/en-us/azure/azure-arc/data/create-data-controller-direct-cli?tabs=linux#deploy---unified-experience)
   b. For Indirect Mode: deploys the Data Controller
7. Once Data Controller is `Ready`, generates a set of azure cli ([`az arcdata dc debug`](https://docs.microsoft.com/en-us/cli/azure/arcdata/dc/debug?view=azure-cli-latest)) logs and stores locally, labelled as `setup-complete` - as a baseline.
8. Uses the `TESTS_DIRECT/INDIRECT` environment variable from `.test.env` to launch a set of parallelized Sonobuoy test runs based on a space-separated array, which execute in a new `sonobuoy` namespace, using `arc-sb-plugin` pod that contains the integration tests.
9. [Sonobuoy aggregator](https://sonobuoy.io/docs/v0.56.0/plugins/) accumulates the [`junit` test results](https://sonobuoy.io/docs/v0.56.0/results/) and logs per `arc-sb-plugin` test run, which are exported into the Launcher
10. Launcher returns the exit code of the tests, and generates another set of debug logs - azure cli and `sonobuoy` - stored locally, labelled as `test-complete`.
11. Launcher performs a CRD metadata scan, similar to Step 3, to discover existing Arc and Arc Data Services Custom Resources. It then proceeds to destroy all Arc and Arc Data resources in reverse order from deployment, as well as CRDs, Role/ClusterRoles, PV/PVCs etc.
12. Launcher attempts to use the SAS token `LOGS_STORAGE_ACCOUNT_SAS` provided to create a new Storage Account container named based on `LOGS_STORAGE_CONTAINER`, in the **pre-existing** Storage Account `LOGS_STORAGE_ACCOUNT`. It uploads all local test results and logs to this storage account as a tarball (see below).
13. Exit.

## Examining Test Results

A sample Storage Container and file uploaded by the launcher:

![Launcher Storage Container](media/automated-integration-testing/launcher-storage-container.png)

![Launcher tarball](media/automated-integration-testing/launcher-tarball.png)

And the test results generated from the run:

![Launcher Test Results](media/automated-integration-testing/launcher-test-results.png)

## Clean up resources

To delete the launcher, run:
```bash
kubectl delete -k arc_data_services/test/launcher/overlays/aks
```

This cleans up the resource manifests deployed as part of the launcher.

Although the launcher is designed to clean-up in the beginning and the end of each run, it's possible for test-failures to leave residue resources behind. To run the launcher in "cleanup" mode, set the following variables in `.test.env`:

```bash
export SKIP_PRECLEAN="0"         # Run cleanup
export SKIP_SETUP="1"            # Do not setup Arc-enabled Data Services
export SKIP_TEST="1"             # Do not run integration tests
export SKIP_POSTCLEAN="1"        # POSTCLEAN is identical to PRECLEAN, although idempotent, not needed here
export SKIP_UPLOAD="1"           # Do not upload logs from this run
```

And deploy the launcher manifest in this mode to clean up all Arc and Arc Data Services.

## Next steps

> [!div class="nextstepaction"]
> [Pre-release testing](preview-testing.md)