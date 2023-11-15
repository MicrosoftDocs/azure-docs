---
title: About Helm package requirements for Azure Operator Service Manager
description: Learn about the Helm package requirements for  Azure Operator Service Manager.
author: sherrygonz
ms.author: sherryg
ms.date: 09/07/2023
ms.topic: concept-article
ms.service: azure-operator-service-manager
---

# Helm package requirements
Helm is a package manager for Kubernetes that helps you manage Kubernetes applications. Helm packages are called charts, and they consist of a few YAML configuration files and some templates that are rendered into Kubernetes manifest files. Charts are reusable by anyone for any environment, which reduces complexity and duplicates. 

## Registry URL path and imagepullsecrets requirements
When developing a helm package, it's common to keep the container registry server URL in the values. Keeping the container registry server URL in the values is useful for moving artifacts between each environment container registry. Azure Operator Service Manager (AOSM) uses the Network Function Manager (NFM) service to deploy Containerized Network Function (CNF). The Network Function Manager (NFM) contains features to inject container registry server location and imagepullsecrets into the helm values during Network Function (NF) deployment. An imagePullSecret is an authorization token, also known as a secret, that stores Docker credentials that are used for accessing a registry. For example, if you need to deploy an application via Kubernetes deployment, you can define a deployment like the following example: 

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

`values.schema.json` is a file that allows you to easily set value requirements and constraints in a single location for Helm charts. In this file, define registryPath and imagePullSecrets as required properties.

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

The NFDVersion request payload provides the following values in the registryValuesPaths:

```json
"registryValuesPaths": [ "global.registryPath" ], 
"imagePullSecretsValuesPaths": [ "global.imagePullSecrets" ], 
```

During an NF deployment, the Network Function Operator (NFO) sets the registryPath to the correct Azure Container Registry (ACR) server location. For example, the NFO runs the following equivalent command: 

```shell
$ helm install --set "global.registryPath=<registryURL>" --set "global.imagePullSecrets[0].name=<secretName>" releasename ./releasepackage 
```

> [!NOTE]
> The registryPath is set without any prefix such as https:// or  oci://. If a prefix is required in the helm package, publishers need to define this in the package. 

`values.yaml` is a file that contains the default values for a Helm chart. It's a YAML file that defines the default values for a chart. In the values.yaml file, two types of variables must be present; imagePullSecrets and registryPath. Each is described in the table.

```json
global: 
   imagePullSecrets: [] 
   registryPath: “” 
```

| Name      | Type | Description     |
| :---        |    :----:   |          :--- |
| imagePullSecrets      | String       | imagePullSecrets are an array of secret names, which are used to pull container images  |
| registryPath      | String       | registryPath is the `AzureContainerRegistry` server location  |

imagePullSecrets and registryPath must be provided in the create NFDVersion onboarding step. 

An NFO running in the cluster populates these two variables (imagePullSecrets and registryPath) during a helm release using the helm install –set command.

For more information, see: [pull-image-private-registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry)

## Immutability restrictions
Immutability restrictions prevent changes to a file or directory. For example, an immutable file can't be changed or renamed, and a file that allows append operations can't be deleted, modified, or renamed.

### Avoid use of mutable tags
Users should avoid using mutable tags such as latest, dev or stable. For example, if deployment.yaml used 'latest' for the .Values.image.tag the deployment would fail.

```json
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}“
```

### Avoid references to external registry
Users should avoid using references to an external registry. For example, if deployment.yaml uses a hardcoded registry path or external registry references it fails validation.

```json
 image: http://myURL/{{ .Values.image.repository }}:{{ .Values.image.tag}}
```

## Recommendations
Splitting the Custom Resource Definitions (CRDs) declaration and usage plus using manual validations are recommended practices. Each is described in the following sections.

### Split CRD declaration and usage 
We recommend splitting the declaration and usage of CRDs into separate helm charts to support
updates. For detailed information see: [method-2-separate-charts](https://helm.sh/docs/chart_best_practices/custom_resource_definitions/#method-2-separate-charts)

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
Each helm chart should contain static image repository and tags. Users should set the image repository and tag to static values. The static values can be set by:
- By hard-coding them in the image line or,
- Setting the Values in values.yaml and not exposing these values in the Network Function Design Version (NFDV). 

A Network Function Design Version (NFDV) should map to a static set of helm charts and images. The charts and images are only updated by publishing a new Network Function Design Version (NFDV).

```json
 image: "{{ .Values.global.registryPath }}/contosoapp:1.14.2“
```
or

```json
 image: "{{ .Values.global.registryPath }}/{{ .Values.image.repository }}:{{ .Values.image.tag}}“
 
YAML values.yaml
image:
  repository: contosoapp
  tag: 1.14.2
```
