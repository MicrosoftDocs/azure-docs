---
title: Publisher helm best practices for Azure Operator Service Manager
description: Learn about publisher helm best practices for Azure Operator Service Manager.
author: msftadam
ms.author: adamdor
ms.date: 08/27/2025
ms.topic: concept-article
ms.service: azure-operator-service-manager
ms.custom: sfi-ropc-blocked
---

# Helm package best practices 
Helm is a package manager for Kubernetes that helps simplify application lifecycle management. Helm packages are called *charts* and consist of YAML configuration and template files. Upon execution of a Helm operation, the charts are rendered into Kubernetes manifest files to trigger the appropriate application lifecycle actions. For the most efficient integration with Azure Operator Service Manager, follow these recommended best practices when developing Helm charts.

## Considerations for registryPath and imagePullSecrets
Every Helm chart generally requires `registryPath` and `imagePullSecrets` parameters. Most commonly, you expose these parameters in the `values.yaml` file. At first, Azure Operator Service Manager depended on publishers managing these values in a strict manner (legacy approach), to be substituted for the proper Azure values during deployment. But not all publishers could easily comply with the strict management of these values. Some charts hide `registryPath` and/or `imagePullSecrets` behind conditionals, or other value restrictions, which weren't always met. Some charts declare `registryPath` and/or `imagePullSecrets` as an array instead of as the expected named string.

To reduce the compliance requirements on publishers, Azure Operator Service Manager introduced two improved methods: `injectArtifactStoreDetail` and cluster registry. These newer methods don't depend on `registryPath` or `imagePullSecrets` appearing in the Helm package. Instead, these methods use a webhook to inject proper Azure values directly into pod operations.

### Method summary for registryPath and imagePullSecrets
All three methods are presently supported as described in this article. Choose the best option for your network function (NF) and use case.

Legacy:
* Requires you to parameterize `registryPath` and `imagePullSecrets` in Helm values and deployment templates for substitution.
* Hosts images in Azure Container Registry.

InjectArtifactStoreDetail:
* Uses a webhook to inject `registryPath` and `imagePullSecrets` directly into pod operations, with minimal dependencies on Helm.
* Hosts images in Azure Container Registry.

Cluster registry:
* Uses a webhook to inject `registryPath` and `imagePullSecrets` directly into pod operations, with no dependency on Helm.
* Hosts images in the local network function operator (NFO) extension.

In all three cases, Azure Operator Service Manager substitutes Azure values for whatever values you expose in templates. The only difference is the method of substitution.

## Legacy requirements for registryPath and imagePullSecrets
Azure Operator Service Manager uses the Azure Network Function Manager service to deploy containerized network functions (CNFs). With the legacy method, Azure Network Function Manager substitutes the Azure Operator Service Manager container's `registryPath` and `imagePullSecrets` values into the Helm operation during the deployment of network functions.

### Example of the legacy method
The following Helm deployment template shows an example of how you should expose `registryPath` and `imagePullSecrets`:

```
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

The following `values.yaml` template shows an example of how you can provide the `registryPath` and `imagePullSecrets` values:

```
global: 
   imagePullSecrets: [] 
   registryPath: "" 
```

The following `values.schema.json` file shows an example of how you can define the `registryPath` and `imagePullSecrets` values:

```
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

The following network function definition version (NFDV) request payload shows an example of how you can provide the `registryPath` and `imagePullSecrets` values at deployment:

```
"registryValuesPaths": [ "global.registryPath" ], 
"imagePullSecretsValuesPaths": [ "global.imagePullSecrets" ], 
```

In the preceding examples:

* The `registryPath` value is set without any prefix such as `https://` or `oci://`. If necessary, define a prefix in the Helm package.
* `imagePullSecrets` and `registryPath` must be provided during NFDV onboarding.

### Other considerations
Consider the following recommendations when you're using the legacy method.

#### Avoid references to an external registry
References to an external registry can cause validation problems. For example, if `deployment.yaml` uses a hard-coded registry path or external registry references, it fails validation.

#### Perform manual validations
Review the images and container specifications to ensure that the images have a prefix of `registryPath` and that `imagePullSecrets` is populated with `secretName`:

```shell
 helm template --set "global.imagePullSecrets[0].name=<secretName>" --set "global.registry.url=<registryPath>" <release-name> <chart-name> --dry-run
```

Here's another example:

```
 helm install --set "global.imagePullSecrets[0].name=<secretName>" --set "global.registry.url=<registryPath>" <release-name> <chart-name> --dry-run
 kubectl create secret <secretName> regcred --docker-server=<registryPath> --dockerusername=<regusername> --docker-password=<regpassword>
```

#### Use a static image repository and tags
Each Helm chart should contain a static image repository and tags. You set the static values through one of the following methods:
* In the `image` line
* In `values.yaml`, without exposing these values in the NFDV

An NFDV should map to a static set of Helm charts and images. You update the charts and images only by publishing a new NFDV, as shown in the following examples:

```
 image: "{{ .Values.global.registryPath }}/contosoapp:1.14.2"
```

```
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}"
 
YAML values.yaml
image:
  repository: contosoapp
  tag: 1.14.2
```

```
 image: http://myUrl/{{ .Values.image.repository }}:{{ .Values.image.tag}}
```

## injectArtifactStoreDetails requirements for registryPath and imagePullSecrets
In some cases, third-party Helm charts might not be fully compliant with Azure Operator Service Manager requirements for `registryPath`. In these cases, you can use `injectArtifactStoreDetails` to avoid making compliance changes to Helm packages.

With `injectArtifactStoreDetails` enabled, you use a webhook method to inject the proper `registryPath` and `imagePullSecrets` dynamically during the pod operations. This method overrides the values that are configured in the Helm package. You still must use legal dummy values where `registryPath` and `imagePullSecrets` are referenced, usually in the `global` section of `values.yaml`.

The following `values.yaml` example shows how you can provide the `registryPath` and `imagePullSecrets` values for compatibility with the `injectArtifactStoreDetails` approach:

```
global: 
   registryPath: "azure.io"
   imagePullSecrets: ["abc123"] 
```

> [!NOTE]
> If `registryPath` is left blank in the underlying Helm package, site network service (SNS) deployment fails during image download.

### Using the injectArtifactStoreDetails method
To enable `injectArtifactStoreDetails`, set the `installOptions` parameter in the NF resource's `roleOverrides` section to `true`, as shown in the following example:

```
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
With a cluster registry, images are copied from Azure Container Registry to a local Docker repository on the Nexus Kubernetes cluster. You use a webhook method to inject the proper `registryPath` and `imagePullSecrets` values dynamically during the pod operations. This method overrides the values that are configured in the Helm package. You still must use legal dummy values where `registryPath` and `imagePullSecrets` are referenced, usually in the `global` section of `values.yaml`.

The following `values.yaml` example shows how you can provide the `registryPath` and `imagePullSecrets` values for compatibility with the cluster registry approach:

```
global: 
   registryPath: "azure.io"
   imagePullSecrets: ["abc123"] 
```

> [!NOTE]
> If `registryPath` is left blank in the underlying Helm package, SNS deployment fails during image download.

For more information on using a cluster registry, see the [concept documentation](get-started-with-cluster-registry.md).

## Recommendations for immutability restrictions
Immutability restrictions prevent changes to a file or directory. For example, an immutable file can't be changed or renamed. You should avoid using mutable tags such as `latest`, `dev`, or `stable`. For example, if `deployment.yaml` uses `latest` for `.Values.image.tag`, the deployment fails.

```
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}"
```

## Recommendations for CRD declaration and usage split
We recommend splitting the declaration and usage of customer resource definitions (CRDs) into separate Helm charts to support updates. For detailed information, see the [Helm documentation about separating charts](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-2-separate-charts).

## Recommendations for Image Version Tagging
To ensure consistent and predictable deployments, we recommend the following for all container images:
* Avoid using `:latest` in production environments.
  * Using latest can cause unexpected behavior because the actual image behind latest can change without notice.
  * In a cluster registry setup, if the tag value changes but the tag name stays the same, the cluster registry will not re-download the updated image.
  * This can lead to running outdated or inconsistent images.
* Instead, always use immutable tags like `:1.4.2` 
*	Ensure every build produces a unique tag, do not overwrite existing tags.

These practices help prevent deployment issues and improve traceability, rollback safety, and security compliance.

## Recommendations for nfApplication sequential ordering
By default, CNF applications are installed or updated based on the order in which they appear in the NFDV. For the deletion operation, the CNF applications are deleted in the specified reverse order. If you need to define a specific order of CNF applications that's different from the default, use `dependsOnProfile` to define a unique sequence for installation, update, and deletion operations.

### How to use dependsOnProfile
You can use `dependsOnProfile` in the NFDV to control the sequence of Helm executions for CNF applications. In the example that follows:
- During an installation operation, the CNF applications are deployed in the following order: `dummyApplication1`, `dummyApplication2`, `dummyApplication`.
- During an update operation, the CNF applications are updated in the following order: `dummyApplication2`, `dummyApplication1`, `dummyApplication`.
- During a deletion operation, the CNF applications are deleted in the following order: `dummyApplication2`, `dummyApplication1`, `dummyApplication`.

```json
{
    "location": "eastus",
    "properties": {
        "networkFunctionTemplate": {
            "networkFunctionApplications": [
                {
                  "dependsOnProfile": {
                        "installDependsOn": [
                            "dummyApplication1",
                            "dummyApplication2"
                        ],
                        "uninstallDependsOn": [
                            "dummyApplication1"
                        ],
                        "updateDependsOn": [
                            "dummyApplication1"
                        ]
                    },
                    "name": "dummyApplication"
                },
                {
                  "dependsOnProfile": {
                        "installDependsOn": [
                        ],
                        "uninstallDependsOn": [
                            "dummyApplication2"
                        ],
                        "updateDependsOn": [
                            "dummyApplication2"
                        ]
                    },
                    "name": "dummyApplication1"
                },
                {
                    "dependsOnProfile": null,
                    "name": "dummyApplication2"
                }
            ],
            "nfviType": "AzureArcKubernetes"
        },
        "networkFunctionType": "ContainerizedNetworkFunction"
    }
}
```

### Common errors with dependsOnProfile
Currently, if the `dependsOnProfile` code provided in the NFDV is invalid, the NF operation fails with a validation error. The message for the validation error appears in the operation status resource and looks similar to the following example:

```json
 {
  "id": "/providers/Microsoft.HybridNetwork/locations/EASTUS2EUAP/operationStatuses/ca051ddf-c8bc-4cb2-945c-a292bf7b654b*C9B39996CFCD97AB3A121AE136ED47F67BB13946C573EF90628C47628BC5EF5F",
  "name": "ca051ddf-c8bc-4cb2-945c-a292bf7b654b*C9B39996CFCD97AB3A121AE136ED47F67BB13946C573EF90628C47628BC5EF5F",
  "resourceId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/xinrui-publisher/providers/Microsoft.HybridNetwork/networkfunctions/testnfDependsOn02",
  "status": "Failed",
  "startTime": "2023-07-17T20:48:01.4792943Z",
  "endTime": "2023-07-17T20:48:10.0191285Z",
  "error": {
    "code": "DependenciesValidationFailed",
    "message": "CyclicDependencies: Circular dependencies detected at hellotest."
  }
}
```



