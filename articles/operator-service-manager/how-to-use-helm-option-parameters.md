---
title: How to use Helm option parameters to prevent deletion on install failure in Azure Operator Service Manager
description: Learn how to use Helm option parameters to prevent deletion on install failure in Azure Operator Service Manager
author: pjw711
ms.author: peterwhiting
ms.date: 03/21/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
ms.custom: devx-track-azurecli

---
# Use Helm option parameters to prevent deletion on install failure

Site Network Service (SNS) deployments might fail because an underlying Network Function (NF) deployment fails to helm install correctly. Azure Operator Service Manager (AOSM) removes failed deployments from the targeted Kubernetes cluster by default to preserve resources. `Helm install` failures often require the resources to persist on the cluster to allow the failure to be debugged. This How-To article covers how to edit the NF ARM template to override this behavior by setting the `helm install --atomic` parameter to false.

## Prerequisites

- You must have onboarded your NF to AOSM using the Az CLI AOSM extension. This article references the folder structure and files output by the CLI and gives CLI-based examples
- Helm install failures can be complex. Debugging requires technical knowledge of several technologies in addition to domain knowledge of your NF
  - Working knowledge of [Helm](https://helm.sh/docs/)
  - Working knowledge of [Kubernetes](https://kubernetes.io/docs/home/) and [kubectl](https://kubernetes.io/docs/reference/kubectl/) commands
  - Working knowledge of pulling and pushing artifacts to [Azure Container Registry](/azure/container-registry/container-registry-get-started-docker-cli?tabs=azure-cli)
- You require the `Contributor` role assignments on the resource group that contains the AOSM managed Artifact Store
- A suitable IDE, such as [Visual Studio Code](https://code.visualstudio.com/)
- The [ORAS CLI](https://oras.land/docs/installation/)

> [!IMPORTANT]
> It is strongly recommended that you have tested that a `helm install` of your Helm package succeeds on your target Arc-connected Kubernetes environment before attempting a deployment using AOSM.

## Override `--atomic` for a single helm chart NF

This section explains how to override `--atomic` for an NF that consists of a single helm chart.

### Locate and edit the NF BICEP template

1. Navigate to the `nsd-cli-output` directory, open the `artifacts` directory, and open the `<nf-arm-template>.bicep` file. `<nf-arm-template>` is configured in the Az AOSM CLI extension NSD input file. You can confirm you have the right file by comparing against the following example template for a fictional Contoso containerized network function (CNF).

    ```bicep
    @secure()
    param configObject object

    var resourceGroupId = resourceGroup().id

    var identityObject = (configObject.managedIdentityId == '')  ? {
      type: 'SystemAssigned'
    } : {
      type: 'UserAssigned'
      userAssignedIdentities: {
        '${configObject.managedIdentityId}': {}
      }
    }

    var nfdvSymbolicName = '${configObject.publisherName}/${configObject.nfdgName}/${configObject.nfdv}'

    resource nfdv 'Microsoft.Hybridnetwork/publishers/networkfunctiondefinitiongroups/networkfunctiondefinitionversions@2023-09-01' existing = {
      name: nfdvSymbolicName
      scope: resourceGroup(configObject.publisherResourceGroup)
    }

    resource nfResource 'Microsoft.HybridNetwork/networkFunctions@2023-09-01' = [for (values, i) in configObject.deployParameters: {
      name: '${configObject.nfdgName}${i}'
      location: configObject.location
      identity: identityObject
      properties: {
        networkFunctionDefinitionVersionResourceReference: {
          id: nfdv.id
          idType: 'Open'
        }
        nfviType: 'AzureArcKubernetes'
        nfviId: (configObject.customLocationId == '') ? resourceGroupId : configObject.customLocationId
        allowSoftwareUpdate: true
        configurationType: 'Open'
        deploymentValues: string(values)
      }
    }]
    ```

1. Find the network function application name by navigating to the `cnf-cli-output` directory, opening the `nfDefinition` directory, and copying the value from the only entry in the networkFunctionApplications array in the `nfdv` resource. Confirm you have the correct value by comparing against the following fictional Contoso example BICEP snippet. In this case, the network function application name is `Contoso`.

    ```bicep
    resource nfdv 'Microsoft.Hybridnetwork/publishers/networkfunctiondefinitiongroups/networkfunctiondefinitionversions@2023-09-01' = {
      parent: nfdg
      name: nfDefinitionVersion
      location: location
      properties: {
        deployParameters: string(loadJsonContent('deployParameters.json'))
        networkFunctionType: 'ContainerizedNetworkFunction'
        networkFunctionTemplate: {
          nfviType: 'AzureArcKubernetes'
          networkFunctionApplications: [
            {
              artifactType: 'HelmPackage'
              name: 'Contoso'
    ```

1. Edit the template to override the default helm install `--atomic` option by adding the following configuration to the `nfResource` properties in the NF ARM Template:

    ```bicep
    roleOverrideValues: ['{"name": "Contoso-one", "deployParametersMappingRuleProfile": {"applicationEnablement": "Enabled", "helmMappingRuleProfile": {"options": {"installOptions": {"atomic": "false"}},{"upgradeOptions": {"atomic": "false"}}}}}']
    ```

1. Confirm that you have made this edit correctly by comparing against the following snippet from the Contoso example NF

```bicep
resource nfResource 'Microsoft.HybridNetwork/networkFunctions@2023-09-01' = [for (values, i) in configObject.deployParameters: {
  name: '${configObject.nfdgName}${i}'
  location: configObject.location
  identity: identityObject
  properties: {
    networkFunctionDefinitionVersionResourceReference: {
      id: nfdv.id
      idType: 'Open'
    }
    nfviType: 'AzureArcKubernetes'
    nfviId: (configObject.customLocationId == '') ? resourceGroupId : configObject.customLocationId
    allowSoftwareUpdate: true
    configurationType: 'Open'
    deploymentValues: string(values)
    roleOverrideValues: [
      '{"name":"Contoso-one","deployParametersMappingRuleProfile":{"helmMappingRuleProfile":{"options":{"installOptions":{"injectArtifactStoreDetails":"true", "atomic": "false"},"upgradeOptions":{"injectArtifactStoreDetails":"true","atomic": "false"}}}}}'
    ]}}]
```

### Build the edited ARM Template and upload it to the Artifact Store

1. Navigate to the `nsd-cli-output/artifacts` directory created by the `az aosm nsd build` command and build the Network Function ARM Template from the BICEP file generated by the CLI.

    ```azurecli
    bicep build <nf-name>.bicep
    ```

1. Generate scope map token credentials from the Artifact Manifest created in the `az aosm nsd publish` command.

    > [!IMPORTANT]
    > You are required to use the Artifact Manifest created in the `az aosm nsd publish` command. The NF ARM template is only declared in that manifest hence only the scope map token generated by this manifest will allow you to push (or pull) the NF ARM template to the Artifact Store.

    ```azurecli
    az rest --method POST --url 'https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.HybridNetwork/publishers/<publisher>/artifactStores/<artifact-store>/artifactManifests/<artifactManifest>/listCredential?api-version=2023-09-01'
    ```

1. Sign in to the AOSM managed ACR. The AOSM managed ACR name can be found in Azure portal Artifact Store resource overview. The username and password can be found in the output of the previous step.

    ```bash
    oras login <aosm-managed-acr-name>.azurecr.io --username <username> --password <scope map token>
    ```

1. Use ORAS to upload the Network Function ARM template to the AOSM managed Azure Container Registry (ACR). The `<arm-template-version>` artifact tag must be in `1.0.0` format. The `<arm-template-name>` and `<arm-template-version>` must match the values in the Artifact Manifest created in the `az aosm nsd publish` command.

## Override `--atomic` for a multi-helm chart NF

Many complex NFs are built from multiple helm charts. These NFs are expressed in the network function definition version (NFDV) with multiple network function applications and are installed with multiple `helm install` commands - one per helm chart.

The process for overriding `--atomic` for a multi-helm NF is the same as for a single helm NF, apart from the edit made to the ARM template.

The fictional multi-helm NF, Contoso-multi-helm, consists of three helm charts. Its NFDV has three network function applications. One network function application maps to one helm chart. These network function applications have a name property set to `Contoso-one`, `Contoso-two`, and `Contoso-three` respectively. Here's an example snippet of the NFDV defining this network function.

```bicep
resource nfdv 'Microsoft.Hybridnetwork/publishers/networkfunctiondefinitiongroups/networkfunctiondefinitionversions@2023-09-01' = {
  parent: nfdg
  name: nfDefinitionVersion
  location: location
  properties: {
    deployParameters: string(loadJsonContent('deployParameters.json'))
    networkFunctionType: 'ContainerizedNetworkFunction'
    networkFunctionTemplate: {
      nfviType: 'AzureArcKubernetes'
      networkFunctionApplications: [
        {
          artifactType: 'HelmPackage'
          name: 'Contoso-one'
          ...
        },
        {
          artifactType: 'HelmPackage'
          name: 'Contoso-two'
          ...
        },
        {
          artifactType: 'HelmPackage'
          name: 'Contoso-three'
          ...
        }]
      }
    }
  }
```

The `--atomic` parameter can be overridden for each of these network function applications independently. Here's an example NF BICEP template that overrides `--atomic` to `false` for `Contoso-one` and `Contoso-two`, but sets `atomic` to true for `Contoso-three`.

```bicep
resource nfResource 'Microsoft.HybridNetwork/networkFunctions@2023-09-01' = [for (values, i) in configObject.deployParameters: {
  name: '${configObject.nfdgName}${i}'
  location: configObject.location
  identity: identityObject
  properties: {
    networkFunctionDefinitionVersionResourceReference: {
      id: nfdv.id
      idType: 'Open'
    }
    nfviType: 'AzureArcKubernetes'
    nfviId: (configObject.customLocationId == '') ? resourceGroupId : configObject.customLocationId
    allowSoftwareUpdate: true
    configurationType: 'Open'
    deploymentValues: string(values)
    roleOverrideValues: [
      '{"name":"Contoso-one","deployParametersMappingRuleProfile":{"helmMappingRuleProfile":{"options":{"installOptions":{"injectArtifactStoreDetails":"true", "atomic": "false"},"upgradeOptions":{"injectArtifactStoreDetails":"true","atomic": "false"}}}}}'
      '{"name":"Contoso-two","deployParametersMappingRuleProfile":{"helmMappingRuleProfile":{"options":{"installOptions":{"injectArtifactStoreDetails":"true", "atomic": "false"},"upgradeOptions":{"injectArtifactStoreDetails":"true","atomic": "false"}}}}}'
      '{"name":"Contoso-three","deployParametersMappingRuleProfile":{"helmMappingRuleProfile":{"options":{"installOptions":{"injectArtifactStoreDetails":"true", "atomic": "false"},"upgradeOptions":{"injectArtifactStoreDetails":"true","atomic": "false"}}}}}'
    ]}}]
```

## Next steps

You can now retry the SNS deployment. You can submit the deployment again through ARM, BICEP, or the AOSM REST API. You can also delete the failed SNS through the Azure portal SNS overview and redeploy following [the operator quickstart](quickstart-containerized-network-function-operator.md), replacing the quickstart NF parameters with the parameters for your network function. The helm releases deployed to the Kubernetes cluster won't be removed on failure. [How to debug SNS deployment failures](troubleshoot-helm-install-failures.md) describes a toolkit for debugging common helm install failures.
