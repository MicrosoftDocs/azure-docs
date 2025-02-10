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
Helm is a package manager for Kubernetes that helps to simplify application lifecycle management. Helm packages are called charts and consist of YAML configuration and template files. Upon execution of a Helm operation, the charts are rendered into Kubernetes manifest files to trigger the appropriate application lifecycle action. For most efficient integration with Azure Operator Service Manager (AOSM), publisher's should consider certain best-practice considerations when developing Helm charts.

## Considerations for registryUrl and imagePullSecrets
Every Helm chart generally requires a declared registryUrl and imagePullSecrets. Best practice recommends that the publisher defines these two parameters consistently as variables in the values.yaml. At first, AOSM depended upon the publisher exposing these values in a strict manner, so they could be ingested and then injected during deployment. This approach is known as the legacy method. Overtime, many complications arose, as not all publishers charts complied with the strict definition of registryUrl and imagePullSecrets required by AOSM. 
* Some charts hide registryUrl and/or imagePullSecrets behind conditionals, or other values restrictions, which were not always met.
* Some charts don't declare registryUrl and/or imagePullSecrets as the expected named string, instead as an array.

To reduce the strict compliance requirements on publishers for registryUrl and imagePullSecrets, AOSM later introduced two improved methods of handling these values. First injectArtifactStoreDetail and finally Cluster Registry. These two newer methods do not depend upon the registryUrl or imagePullSecrets appearing in the Helm package, at all. Instead these methods derive and inject these values on behalf of the network function.

### Method summary for registryUrl and imagePullSecrets

**Legacy.** 
* Required publisher to parameterize registryUrl & imagePullSecrets correctly in helm values and templates for substitution.
* Images hosted in publisher Azure Container Registry (ACR).

**InjectArtifactStoreDetail.**  
* Uses a webhook to inject registryUrl & imagePullSecrets directly into pod without any dependency on helm.
* Images still hosted in publisher ACR.

**Cluster Registry.** 
* Same as InjectArtifactStoreDetail, except now the images are hosted in the local cluster registry.

> [!NOTE]
> In all three cases, AOSM is substituting AOSM derived secrets with whatever secrets a publisher exposes in templates. The only difference is Legacy and InjectArtifactStoreDetail, the secret is bound to publisher ACR, while in Cluster Registry, the secret is bound to cluster registry. 

## Legacy requirements for registryUrl and imagePullSecrets 
Azure Operator Service Manager (AOSM) uses the Network Function Manager (NFM) service to deploy Containerized Network Function (CNF). The NFM injects container registryUrl and imagePullSecrets dynamically into the helm values during Network Function (NF) deployment. The following helm deployment template shows an example of how a publisher should expose registryPath and imagePullSecrets for compatibility with AOSM legacy approach.

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

The following `values.schema.json` file shows an example of how a publisher can easily set registryPath and imagePullSecretsvalue requirements for compatibility with AOSM legacy approach.

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
              “registryPath”: {“type”: “string”}, 
              “imagePullSecrets”: {“type”: “string”}, 
          }
          "required": [ "registryPath", "imagePullSecrets" ], 
      } 
   } 
} 

```

The following `NFDVersion request payload` shows an example of how a publisher can provide the registryPath and imagePullSecretsvalue values for compatibility with AOSM legacy approach.

```json
"registryValuesPaths": [ "global.registryPath" ], 
"imagePullSecretsValuesPaths": [ "global.imagePullSecrets" ], 
```

The following `values.yaml` shows an example of how a publisher can provide the registryPath and imagePullSecretsvalue values for compatibility with AOSM legacy approach. 

```json
global: 
   imagePullSecrets: [] 
   registryPath: “” 
```

| Name      | Type | Description     |
| :---        |    :----:   |          :--- |
| imagePullSecrets      | String       | imagePullSecrets are an array of secret names, which are used to pull container images  |
| registryPath      | String       | registryPath is the `AzureContainerRegistry` server location  |

> [!NOTE]
> * The registryPath is set without any prefix such as `https://` or `oci://`. If needed, publisher must define a prefix in the helm package. 
> * imagePullSecrets and registryPath must be provided in the create NFDVersion onboarding step.

### Avoid references to external registry
Users should avoid using references to an external registry. For example, if deployment.yaml uses a hardcoded registry path or external registry references it fails validation.

### Manual validations
Review the images and container specs created to ensure the images have prefix of registryURL and the imagePullSecrets are populated with secretName.

```shell
 helm template --set "global.imagePullSecrets[0].name=<secretName>" --set "global.registry.url=<registryURL>" <release-name> <chart-name> --dry-run
```

OR

```shell
 helm install --set "global.imagePullSecrets[0].name=<secretName>" --set "global.registry.url=<registryURL>" <release-name> <chart-name> --dry-run
 kubectl create secret <secretName> regcred --docker-server=<registryURL> --dockerusername=<regusername> --docker-password=<regpassword>
```

### Static image repository and tags
Each helm chart should contain static image repository and tags. The static values are set as follows:
- Setting them in the image line or,
- Setting them in values.yaml and not exposing these values in the Network Function Design Version (NFDV). 

A Network Function Design Version (NFDV) should map to a static set of helm charts and images. The charts and images are only updated by publishing a new Network Function Design Version (NFDV).

```json
 image: "{{ .Values.global.registryPath }}/contosoapp:1.14.2“
```

Or

```json
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}“
 
YAML values.yaml
image:
  repository: contosoapp
  tag: 1.14.2
```

```json
 image: http://myURL/{{ .Values.image.repository }}:{{ .Values.image.tag}}
```

## injectArtifactStoreDetails requirements for registryUrl and imagePullSecrets 
In some cases, third-party helm charts may not be fully compliant with AOSM requirements for registryURL. In this case, the injectArtifactStoreDetails feature can be used to avoid making changes to helm packages. To use injectArtifactStoreDetails, set the installOptions parameter in the NF resource roleOverrides section to true, then in the helm chart package, use whatever registryURL value is needed to keep the registry URL valid. See following example of injectArtifactStoreDetails parameter enabled.

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

## Chart immutability restrictions
Immutability restrictions prevent changes to a file or directory. For example, an immutable file can't be changed or renamed. Users should avoid using mutable tags such as latest, dev, or stable. For example, if deployment.yaml used 'latest' for the .Values.image.tag the deployment would fail.

```json
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}“
```

## Chart CRD declaration and usage split 
We recommend splitting the declaration and usage of customer resource definitions (CRD) into separate helm charts to support updates. For detailed information see: [method-2-separate-charts](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-2-separate-charts)
