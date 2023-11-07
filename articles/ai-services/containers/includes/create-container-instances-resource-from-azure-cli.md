---
title: Container support
titleSuffix: Azure AI services
description: Learn how to create an Azure container instance resource from the Azure CLI.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-services
ms.custom: devx-track-azurecli
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
ms.tool: azure-cli
---

## Create an Azure Container Instance resource from the Azure CLI

The YAML below defines the Azure Container Instance resource. Copy and paste the contents into a new file, named `my-aci.yaml` and replace the commented values with your own. Refer to the [template format][template-format] for valid YAML. Refer to the [container repositories and images][repositories-and-images] for the available image names and their corresponding repository. For more information of the YAML reference for Container instances, see [YAML reference: Azure Container Instances][aci-yaml-ref].

```yaml
apiVersion: 2018-10-01
location: # < Valid location >
name: # < Container Group name >
properties:
  imageRegistryCredentials: # This is only required if you are pulling a non-public image that requires authentication to access. For example Text Analytics for health.
  - server: containerpreview.azurecr.io
    username: # < The username for the preview container registry >
    password: # < The password for the preview container registry >
  containers:
  - name: # < Container name >
    properties:
      image: # < Repository/Image name >
      environmentVariables: # These env vars are required
        - name: eula
          value: accept
        - name: billing
          value: # < Service specific Endpoint URL >
        - name: apikey
          value: # < Service specific API key >
      resources:
        requests:
          cpu: 4 # Always refer to recommended minimal resources
          memoryInGb: 8 # Always refer to recommended minimal resources
      ports:
        - port: 5000
  osType: Linux
  volumes: # This node, is only required for container instances that pull their model in at runtime, such as LUIS.
  - name: aci-file-share
    azureFile:
      shareName: # < File share name >
      storageAccountName: # < Storage account name>
      storageAccountKey: # < Storage account key >
  restartPolicy: OnFailure
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: 5000
tags: null
type: Microsoft.ContainerInstance/containerGroups
```

> [!NOTE]
> Not all locations have the same CPU and Memory availability. Refer to the [location and resources][location-to-resource] table for the listing of available resources for containers per location and OS.

We'll rely on the YAML file we created for the [`az container create`][azure-container-create] command. From the Azure CLI, execute the `az container create` command replacing the `<resource-group>` with your own. Additionally, for securing values within a YAML deployment refer to [secure values][secure-values].

```azurecli
az container create -g <resource-group> -f my-aci.yaml
```

The output of the command is `Running...` if valid, after sometime the output changes to a JSON string representing the newly created ACI resource. The container image is more than likely not be available for a while, but the resource is now deployed.

> [!TIP]
> Pay close attention to the locations of Azure AI services in public preview, as the YAML will needed to be adjusted accordingly to match the location.

[azure-container-create]: /cli/azure/container#az_container_create
[template-format]: /azure/templates/Microsoft.ContainerInstance/2018-10-01/containerGroups#template-format
[aci-yaml-ref]: ../../../container-instances/container-instances-reference-yaml.md
[repositories-and-images]: ../../cognitive-services-container-support.md
[location-to-resource]: ../../../container-instances/container-instances-region-availability.md
[secure-values]: ../../../container-instances/container-instances-environment-variables.md#secure-values
