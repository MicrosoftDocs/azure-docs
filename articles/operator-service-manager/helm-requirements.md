---
title: Helm package requirements for Azure Operator Service Manager
description: Learn about the Helm package requirements for  Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 01/30/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Helm requirements overview

Helm is a package manager for Kubernetes that helps to simplify application lifecycle management. Helm packages are called *charts* and consist of YAML configuration and template files.

Upon execution of a Helm operation, the charts are rendered into Kubernetes manifest files to trigger the appropriate application lifecycle actions. For most efficient integration with Azure Operator Service Manager, publisher's should consider certain best-practices when developing Helm charts.

## Considerations for registryPath and imagePullSecrets

Every Helm chart generally requires a `registryPath` and `imagePullSecrets`. Most commonly, a publisher exposes these parameters in the values.yaml.

At first, Azure Operator Service Manager depended upon the publisher managing these values in a strict manner (legacy approach), to be substituted for the proper Azure values during deployment. Over time, it was found that not all publishers could easily comply with the strict management of these values. Some charts hide `registryPath` and/or `imagePullSecrets` behind conditionals, or other values restrictions, which were not always met. Some charts don't declare `registryPath` and/or `imagePullSecrets` as the expected named string, instead as an array.

To reduce the strict compliance requirements on publishers, Azure Operator Service Manager  introduced two improved methods, injectArtifactStoreDetail and cluster registry. These newer methods do not depend upon the `registryPath` or `imagePullSecrets` which appear in the Helm package. Instead, these methods use a webhook to inject proper Azure values directly into pod operations.

### Method summary for registryPath and imagePullSecrets

All three methods are presently supported as described in this article. A publisher should choose the best option for their (network function) NF and use-case.

Legacy:

* Requires publisher to parameterize `registryPath` & `imagePullSecrets` in Helm values and deployment templates for substitution.
* Images are hosted in the publisher Azure Container Registry (ACR).

InjectArtifactStoreDetail:

* Uses a webhook to inject `registryPath` and `imagePullSecrets` directly into pod operations, with minimal dependencies on Helm.
* Images are still hosted in the publisher ACR.

Cluster Registry:

* Uses a webhook to inject `registryPath` and `imagePullSecrets` directly into pod operations, with no dependency on Helm.
* Images are hosted in the local network function operator (NFO) extension cluster registry.

> [!NOTE]
> In all three cases, Azure Operator Service Manager is substituting Azure values for whatever values a publisher exposes in templates. The only difference is method of substitution.

## Legacy requirements for `registryPath` and imagePullSecrets

Azure Operator Service Manager uses the Network Function Manager (NFM) service to deploy Containerized Network Functions (CNFs). With the legacy method, NFM substitutes the Azure Operator Service Manager container `registryPath` and `imagePullSecrets` values into the Helm operation during Network Function (NF) deployment.

### Using legacy method

The following `helm deployment` template shows an example of how a publisher should expose `registryPath` and `imagePullSecrets`.

```json
apiVersion: apps/v1 
kind: Deployment 
metadata: 
  name: nginx-deployment 
  labels: 
    app: nginx 
spec: 
  replicas: 3 
  selector: 
    matchLabels: 
      app: nginx 
  template: 
    metadata: 
      labels: 
        app: nginx 
    spec: 
      {{- if .Values.global.imagePullSecrets }} 
      imagePullSecrets: {{ toYaml .Values.global.imagePullSecrets | nindent 8 }} 
      {{- end }} 
      containers: 
      - name: contosoapp 
        image:{{ .Values.global.registryPath }}/contosoapp:1.14.2 
        ports: 
        - containerPort: 80 
```

The following `values.yaml` template shows an example of how a publisher can provide the `registryPath` and `imagePullSecrets`value values.

```json
global: 
   imagePullSecrets: [] 
   registryPath: "" 
```

The following `values.schema.json` file shows an example of how a publisher can easily define `registryPath` and `imagePullSecrets`value.

```json
{ 
  "$schema": "http://json-schema.org/draft-07/schema#", 
  "title": "StarterSchema", 
  "type": "object", 
  "required": ["global"], 
  "properties": { 
      "global" : {
          "type": "object",
          "properties": {
              "registryPath": {"type": "string"}, 
              "imagePullSecrets": {"type": "string"}, 
          }
          "required": [ "registryPath", "imagePullSecrets" ], 
      } 
   } 
} 

```

The following `NFDV request payload` shows an example of how a publisher can provide the `registryPath` and `imagePullSecrets` values at deployment.

```json
"registryValuesPaths": [ "global.registryPath" ], 
"imagePullSecretsValuesPaths": [ "global.imagePullSecrets" ], 
```

> [!NOTE]
> * The `registryPath` is set without any prefix such as `https://` or `oci://`. If needed, publisher must define a prefix in the Helm package. 
> * `imagePullSecrets` and `registryPath` must be provided in the create NFDVersion onboarding step.

### Other considerations with Legacy method

Publisher should consider the following recommendations when using the legacy method:

* Avoid references to external registry.
* Perform manual validations.
* Ensure static image repository and tags.

#### Avoid references to external registry

Users should avoid using references to an external registry. For example, if deployment.yaml uses a hardcoded registry path or external registry references it fails validation.

#### Perform manual validations

Review the images and container specs created to ensure the images have prefix of `registryPath` and the `imagePullSecrets` are populated with secretName.

```shell
 helm template --set "global.imagePullSecrets[0].name=<secretName>" --set "global.registry.url=<registryPath>" <release-name> <chart-name> --dry-run
```

Or:

```shell
 helm install --set "global.imagePullSecrets[0].name=<secretName>" --set "global.registry.url=<registryPath>" <release-name> <chart-name> --dry-run
 kubectl create secret <secretName> regcred --docker-server=<registryPath> --dockerusername=<regusername> --docker-password=<regpassword>
```

#### Ensure static image repository and tags

Each Helm chart should contain static image repository and tags. The static values are set through one of the following methods:

* Setting them in the image line
* Setting them in values.yaml and not exposing these values in the Network Function Design Version (NFDV).

A Network Function Design Version (NFDV) should map to a static set of Helm charts and images. The charts and images are only updated by publishing a new Network Function Design Version (NFDV).

```json
 image: "{{ .Values.global.registryPath }}/contosoapp:1.14.2"
```

Or

```json
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}"
 
YAML values.yaml
image:
  repository: contosoapp
  tag: 1.14.2
```

```json
 image: http://myUrl/{{ .Values.image.repository }}:{{ .Values.image.tag}}
```

## injectArtifactStoreDetails requirements for registryPath and imagePullSecrets

In some cases, third-party Helm charts may not be fully compliant with Azure Operator Service Manager requirements for `registryPath`. In this case, the injectArtifactStoreDetails feature can be used to avoid making compliance changes to Helm packages.

With injectArtifactStoreDetails enabled, a webhook method is used to inject the proper `registryPath` and `imagePullSecrets` dynamically during the pod operations. This overrides the values which are configured in the Helm package. A publisher still must use legal dummy values where `registryPath` and `imagePullSecrets` are referenced, usually in the global section of values.yaml.

The following `values.yaml` shows an example of how a publisher can provide the `registryPath` and `imagePullSecrets` values for compatibility with injectArtifactStoreDetails approach.

```json
global: 
   registryPath: "azure.io"
   imagePullSecrets: ["abc123"] 
```

> [!NOTE]
> If `registryPath` is left blank in underlying Helm package, site network service (SNS) deployment fails while trying to download image.

### Using injectArtifactStoreDetails method

To enable injectArtifactStoreDetails, set the installOptions parameter in the NF resource roleOverrides section to true, as shown in the following example.

```bash
resource networkFunction 'Microsoft.HybridNetwork/networkFunctions@2023-09-01' = {
  name: nfName
  location: location
  properties: {
    nfviType: 'AzureArcKubernetes'
    networkFunctionDefinitionVersionResourceReference: {
      id: nfdvId
      idType: 'Open'
    }
    allowSoftwareUpdate: true
    nfviId: nfviId
    deploymentValues: deploymentValues
    configurationType: 'Open'
    roleOverrideValues: [
      // Use inject artifact store details feature on test app 1
      '{"name":"testapp1", "deployParametersMappingRuleProfile":{"helmMappingRuleProfile":{"options":{"installOptions":{"atomic":"false","wait":"false","timeout":"60","injectArtifactStoreDetails":"true"},"upgradeOptions": {"atomic": "false", "wait": "true", "timeout": "100", "injectArtifactStoreDetails": "true"}}}}}'
    ]
  }
}
```

> [!NOTE]
> The Helm chart package must still expose properly formatted `registryPath` and `imagePullSecrets` values.

## Cluster registry requirements for registryPath and imagePullSecrets

With cluster registry, images are copied from the publisher ACR to a local docker repository on the nexus AKS (NAKS) cluster. When enabled, a webhook method is used to inject the proper `registryPath` and `imagePullSecrets` dynamically during the pod operations. This overrides the values which are configured in the Helm package. A publisher still must use legal dummy values where `registryPath` and `imagePullSecrets` are referenced, usually in global section of values.yaml.

The following `values.yaml` shows an example of how a publisher can provide the `registryPath` and `imagePullSecrets` values for compatibility with cluster registry approach.

```json
global: 
   registryPath: "azure.io"
   imagePullSecrets: ["abc123"] 
```

> [!NOTE]
> If `registryPath` is left blank in underlying Helm package, SNS deployment fails while trying to download image.

For information on using cluster registry, see the [concept documentation](get-started-with-cluster-registry.md).

## Chart immutability restrictions

Immutability restrictions prevent changes to a file or directory. For example, an immutable file can't be changed or renamed. Users should avoid using mutable tags such as latest, dev, or stable. For example, if deployment.yaml used 'latest' for the .Values.image.tag the deployment would fail.

```json
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}"
```

## Chart CRD declaration and usage split

We recommend splitting the declaration and usage of customer resource definitions (CRD) into separate Helm charts to support updates. For detailed information see: [method-2-separate-charts](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-2-separate-charts)
