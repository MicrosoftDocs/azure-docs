---
title: YAML reference for container group   
description: Reference for the YAML file supported by Azure Container Instances to configure a container group
author: tomvcassidy
ms.topic: reference
ms.service: container-instances
services: container-instances
ms.author: tomcassidy
ms.date: 06/06/2022
---

# YAML reference: Azure Container Instances

This article covers the syntax and properties for the YAML file supported by Azure Container Instances to configure a [container group](container-instances-container-groups.md). Use a YAML file to input the group configuration to the [az container create][az-container-create] command in the Azure CLI.

A YAML file is a convenient way to configure a container group for reproducible deployments. It's a concise alternative to using a [Resource Manager template](/azure/templates/Microsoft.ContainerInstance/2019-12-01/containerGroups) or the Azure Container Instances SDKs to create or update a container group.

> [!NOTE]
> This reference applies to YAML files for Azure Container Instances REST API version `2021-10-01`.

## Schema

The schema for the YAML file follows, including comments to highlight key properties. For a description of the properties in this schema, see the [Property values](#property-values) section.

```yaml
name: string  # Name of the container group
apiVersion: '2021-10-01'
location: string
tags: {}
identity: 
  type: string
  userAssignedIdentities: {}
properties: # Properties of container group
  containers: # Array of container instances in the group
  - name: string # Name of an instance
    properties: # Properties of an instance
      image: string # Container image used to create the instance
      command:
      - string
      ports: # External-facing ports exposed on the instance, must also be set in group ipAddress property 
      - protocol: string
        port: integer
      environmentVariables:
      - name: string
        value: string
        secureValue: string
      resources: # Resource requirements of the instance
        requests:
          memoryInGB: number
          cpu: number
          gpu:
            count: integer
            sku: string
        limits:
          memoryInGB: number
          cpu: number
          gpu:
            count: integer
            sku: string
      volumeMounts: # Array of volume mounts for the instance
      - name: string
        mountPath: string
        readOnly: boolean
      livenessProbe:
        exec:
          command:
          - string
        httpGet:
          httpHeaders:
          - name: string
            value: string
          path: string
          port: integer
          scheme: string
        initialDelaySeconds: integer
        periodSeconds: integer
        failureThreshold: integer
        successThreshold: integer
        timeoutSeconds: integer
      readinessProbe:
        exec:
          command:
          - string
        httpGet:
          httpHeaders:
          - name: string
            value: string
          path: string
          port: integer
          scheme: string
        initialDelaySeconds: integer
        periodSeconds: integer
        failureThreshold: integer
        successThreshold: integer
        timeoutSeconds: integer
  imageRegistryCredentials: # Credentials to pull a private image
  - server: string
    username: string
    password: string
    identity: string
    identityUrl: string
  restartPolicy: string
  ipAddress: # IP address configuration of container group
    ports:
    - protocol: string
      port: integer
    type: string
    ip: string
    dnsNameLabel: string
    dnsNameLabelReusePolicy: string
  osType: string
  volumes: # Array of volumes available to the instances
  - name: string
    azureFile:
      shareName: string
      readOnly: boolean
      storageAccountName: string
      storageAccountKey: string
    emptyDir: {}
    secret: {}
    gitRepo:
      directory: string
      repository: string
      revision: string
  diagnostics:
    logAnalytics:
      workspaceId: string
      workspaceKey: string
      workspaceResourceId: string
      logType: string
      metadata: {}
  subnetIds: # Subnet to deploy the container group into
    - id: string
      name: string
  dnsConfig: # DNS configuration for container group
    nameServers:
    - string
    searchDomains: string
    options: string
  sku: string # SKU for the container group
  encryptionProperties:
    vaultBaseUrl: string
    keyName: string
    keyVersion: string
  initContainers: # Array of init containers in the group
  - name: string
    properties:
      image: string
      command:
      - string
      environmentVariables:
      - name: string
        value: string
        secureValue: string
      volumeMounts:
      - name: string
        mountPath: string
        readOnly: boolean
```

## Property values

The following tables describe the values you need to set in the schema.

### Microsoft.ContainerInstance/containerGroups object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  name | string | Yes | The name of the container group. |
|  apiVersion | enum | Yes | **2021-10-01 (latest)**, 2021-09-01, 2021-07-01, 2021-03-01, 2020-11-01, 2019-12-01, 2018-10-01, 2018-09-01, 2018-07-01, 2018-06-01, 2018-04-01 |
|  location | string | No | The resource location. |
|  tags | object | No | The resource tags. |
|  identity | object | No | The identity of the container group, if configured. - [ContainerGroupIdentity object](#containergroupidentity-object) |
|  properties | object | Yes | [ContainerGroupProperties object](#containergroupproperties-object) |

### ContainerGroupIdentity object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  type | enum | No | The type of identity used for the container group. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the container group. - SystemAssigned, UserAssigned, SystemAssigned, UserAssigned, None |
|  userAssignedIdentities | object | No | The list of user identities associated with the container group. The user identity dictionary key references will be Azure Resource Manager resource IDs in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'. |

### ContainerGroupProperties object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  containers | array | Yes | The containers within the container group. - [Container object](#container-object) |
|  imageRegistryCredentials | array | No | The image registry credentials by which the container group is created from. - [ImageRegistryCredential object](#imageregistrycredential-object) |
|  restartPolicy | enum | No | Restart policy for all containers within the container group. - `Always` Always restart- `OnFailure` Restart on failure- `Never` Never restart. - Always, OnFailure, Never |
|  ipAddress | object | No | The IP address type of the container group. - [IpAddress object](#ipaddress-object) |
|  osType | enum | Yes | The operating system type required by the containers in the container group. - Windows or Linux |
|  volumes | array | No | The list of volumes that can be mounted by containers in this container group. - [Volume object](#volume-object) |
|  diagnostics | object | No | The diagnostic information for a container group. - [ContainerGroupDiagnostics object](#containergroupdiagnostics-object) |
|  subnetIds | object | No | The subnet information for a container group. - [ContainerGroupSubnetIds object](#containergroupsubnetids-object) |
|  dnsConfig | object | No | The DNS config information for a container group. - [DnsConfiguration object](#dnsconfiguration-object) |
| sku | enum | No | The SKU for a container group - Standard or Dedicated |
| encryptionProperties | object | No | The encryption properties for a container group. - [EncryptionProperties object](#encryptionproperties-object) | 
| initContainers | array | No | The init containers for a container group. - [InitContainerDefinition object](#initcontainerdefinition-object) |

### Container object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  name | string | Yes | The user-provided name of the container instance. |
|  properties | object | Yes | The properties of the container instance. - [ContainerProperties object](#containerproperties-object) |

### ImageRegistryCredential object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  server | string | Yes | The Docker image registry server without a protocol such as "http" and "https". |
|  username | string | No | The username for the private registry. |
|  password | string | No | The password for the private registry. |
|  identity | string | No | The resource ID of the user or system-assigned managed identity used to authenticate. |
|  identityUrl | string | No | The identity URL for the private registry. |

### IpAddress object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  ports | array | Yes | The list of ports exposed on the container group. - [Port object](#port-object) |
|  type | enum | Yes | Specifies if the IP is exposed to the public internet or private VNET. - Public or Private |
|  ip | string | No | The IP exposed to the public internet. |
|  dnsNameLabel | string | No | The Dns name label for the IP. |

### Volume object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  name | string | Yes | The name of the volume. |
|  azureFile | object | No | The Azure File volume. - [AzureFileVolume object](#azurefilevolume-object) |
|  emptyDir | object | No | The empty directory volume. |
|  secret | object | No | The secret volume. |
|  gitRepo | object | No | The git repo volume. - [GitRepoVolume object](#gitrepovolume-object) |

### ContainerGroupDiagnostics object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  logAnalytics | object | No | Container group log analytics information. - [LogAnalytics object](#loganalytics-object) |

### ContainerGroupSubnetIds object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  id | string | Yes | The identifier for a subnet. |
|  name | string | No | The name of the subnet. |

### DnsConfiguration object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  nameServers | array | Yes | The DNS servers for the container group. - string |
|  searchDomains | string | No | The DNS search domains for hostname lookup in the container group. |
|  options | string | No | The DNS options for the container group. |

### EncryptionProperties object

| Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
| vaultBaseUrl | string | Yes | The keyvault base url. |
| keyName | string | Yes | The encryption key name. |
| keyVersion | string | Yes | The encryption key version. |

### InitContainerDefinition object

| Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
| name | string | Yes | The name for the init container. |
| properties | object | Yes | The properties for the init container. - [InitContainerPropertiesDefinition object](#initcontainerpropertiesdefinition-object)

### ContainerProperties object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  image | string | Yes | The name of the image used to create the container instance. |
|  command | array | No | The commands to execute within the container instance in exec form. - string |
|  ports | array | No | The exposed ports on the container instance. - [ContainerPort object](#containerport-object) |
|  environmentVariables | array | No | The environment variables to set in the container instance. - [EnvironmentVariable object](#environmentvariable-object) |
|  resources | object | Yes | The resource requirements of the container instance. - [ResourceRequirements object](#resourcerequirements-object) |
|  volumeMounts | array | No | The volume mounts available to the container instance. - [VolumeMount object](#volumemount-object) |
|  livenessProbe | object | No | The liveness probe. - [ContainerProbe object](#containerprobe-object) |
|  readinessProbe | object | No | The readiness probe. - [ContainerProbe object](#containerprobe-object) |

### Port object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  protocol | enum | No | The protocol associated with the port. - TCP or UDP |
|  port | integer | Yes | The port number. |

### AzureFileVolume object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  shareName | string | Yes | The name of the Azure File share to be mounted as a volume. |
|  readOnly | boolean | No | The flag indicating whether the Azure File shared mounted as a volume is read-only. |
|  storageAccountName | string | Yes | The name of the storage account that contains the Azure File share. |
|  storageAccountKey | string | No | The storage account access key used to access the Azure File share. |

### GitRepoVolume object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  directory | string | No | Target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name. |
|  repository | string | Yes | Repository URL |
|  revision | string | No | Commit hash for the specified revision. |

### LogAnalytics object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  workspaceId | string | Yes | The workspace ID for log analytics |
|  workspaceKey | string | Yes | The workspace key for log analytics |
|  workspaceResourceId | string | No | The workspace resource ID for log analytics |
|  logType | enum | No | The log type to be used. - ContainerInsights or ContainerInstanceLogs |
|  metadata | object | No | Metadata for log analytics. |

### InitContainerPropertiesDefinition object

| Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
| image | string | No | The image of the init container. |
| command | array | No | The command to execute within the init container in exec form. - string |
| environmentVariables | array | No |The environment variables to set in the init container. - [EnvironmentVariable object](#environmentvariable-object)
| volumeMounts | array | No | The volume mounts available to the init container. - [VolumeMount object](#volumemount-object)

### ContainerPort object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  protocol | enum | No | The protocol associated with the port. - TCP or UDP |
|  port | integer | Yes | The port number exposed within the container group. |

### EnvironmentVariable object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  name | string | Yes | The name of the environment variable. |
|  value | string | No | The value of the environment variable. |
|  secureValue | string | No | The value of the secure environment variable. |

### ResourceRequirements object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  requests | object | Yes | The resource requests of this container instance. - [ResourceRequests object](#resourcerequests-object) |
|  limits | object | No | The resource limits of this container instance. - [ResourceLimits object](#resourcelimits-object) |

### VolumeMount object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  name | string | Yes | The name of the volume mount. |
|  mountPath | string | Yes | The path within the container where the volume should be mounted. Must not contain colon (:). |
|  readOnly | boolean | No | The flag indicating whether the volume mount is read-only. |

### ContainerProbe object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  exec | object | No | The execution command to probe - [ContainerExec object](#containerexec-object) |
|  httpGet | object | No | The Http Get settings to probe - [ContainerHttpGet object](#containerhttpget-object) |
|  initialDelaySeconds | integer | No | The initial delay seconds. |
|  periodSeconds | integer | No | The period seconds. |
|  failureThreshold | integer | No | The failure threshold. |
|  successThreshold | integer | No | The success threshold. |
|  timeoutSeconds | integer | No | The timeout seconds. |

### ResourceRequests object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  memoryInGB | number | Yes | The memory request in GB of this container instance. |
|  cpu | number | Yes | The CPU request of this container instance. |
|  gpu | object | No | The GPU request of this container instance. - [GpuResource object](#gpuresource-object) |

### ResourceLimits object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  memoryInGB | number | No | The memory limit in GB of this container instance. |
|  cpu | number | No | The CPU limit of this container instance. |
|  gpu | object | No | The GPU limit of this container instance. - [GpuResource object](#gpuresource-object) |

### ContainerExec object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  command | array | No | The commands to execute within the container. - string |

### ContainerHttpGet object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  path | string | No | The path to probe. |
|  port | integer | Yes | The port number to probe. |
|  scheme | enum | No | The scheme. - http or https |
|  httpHeaders | object | No | The HTTP headers included in the probe. - [HttpHeaders object](#httpheaders-object) |

### HttpHeaders object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  name | string | No | Name of the header. |
|  value | string | No | Value of the header. |

> [!IMPORTANT]
> K80 and P100 GPU SKUs are retiring by August 31st, 2023. This is due to the retirement of the underlying VMs used: [NC Series](../virtual-machines/nc-series-retirement.md) and [NCv2 Series](../virtual-machines/ncv2-series-retirement.md) Although V100 SKUs will be available, it is receommended to use Azure Kubernetes Service instead. GPU resources are not fully supported and should not be used for production workloads. Use the following resources to migrate to AKS today: [How to Migrate to AKS](../aks/aks-migration.md).

### GpuResource object

|  Name | Type | Required | Value |
|  ---- | ---- | ---- | ---- |
|  count | integer | Yes | The count of the GPU resource. |
|  sku | enum | Yes | The SKU of the GPU resource. - V100 |

## Next steps

See the tutorial [Deploy a multi-container group using a YAML file](container-instances-multi-container-yaml.md).

See examples of using a YAML file to deploy container groups in a [virtual network](container-instances-vnet.md) or that [mount an external volume](container-instances-volume-azure-files.md).

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
