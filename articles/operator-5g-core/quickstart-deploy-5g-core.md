---
title: Deploy Azure Operator 5G Core Preview
description: Learn how to deploy Azure Operator 5G core Preview using Bicep Scripts, PowerShell, and Azure CLI.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-arm-template, devx-track-azurecli, devx-track-bicep
ms.topic: quickstart #Required; leave this attribute/value as-is
ms.date: 04/08/2024
#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Deploy Azure Operator 5G Core Preview

Azure Operator 5G Core Preview is deployed using the Azure Operator 5G Core Resource Provider (RP), which uses Bicep scripts bundled along with empty parameter files for each Mobile Packet Core resource. 

> [!NOTE]
>  The clusterservices resource must be created before any of the other services which can follow in any order. However, should you require observability services, then the observabilityservices resource should follow the clusterservices resource.   

- Microsoft.MobilePacketCore/clusterServices - per cluster PaaS services
- Microsoft.MobilePacketCore/observabilityServices - per cluster observability PaaS services (elastic/elastalert/kargo/kafka/etc) 
- Microsoft.MobilePacketCore/amfDeployments - AMF/MME network function
- Microsoft.MobilePacketCore/smfDeployments - SMF network function
- Microsoft.MobilePacketCore/nrfDeployments - NRF network function
- Microsoft.MobilePacketCore/nssfDeployments - NSSF network function
- Microsoft.MobilePacketCore/upfDeployments - UPF network function

## Prerequisites

Before you can successfully deploy Azure Operator 5G Core, you must:

- [Register and verify the resource providers](../azure-resource-manager/management/resource-providers-and-types.md) for the HybridNetwork and MobilePacketCore namespaces.
- Grant "Mobile Packet Core" service principal Contributor access at the subscription level (note this is a temporary requirement until the step is embedded as part of the RP registration).
- Ensure that the network, subnet, and IP plans are ready for the resource parameter files.   

Complete the steps found in [Prerequisites to deploy Azure Operator 5G Core Preview on Nexus Azure Kubernetes Service](quickstart-complete-prerequisites-deploy-nexus-azure-kubernetes-service.md)

## Post cluster creation

After you complete the prerequisite steps and create a cluster, you must enable resources used to deploy Azure Operator 5G Core. The Azure Operator 5G Core resource provider manages the remote cluster through line-of-sight communications via Azure ARC. Azure Operator 5G Core workload is deployed through helm operator services provided by the Network Function Manager (NFM). To enable these services, the cluster must be ARC enabled, the NFM Kubernetes extension  must be installed, and an Azure custom location must be created. The following Azure CLI commands describe how to enable these services. Run the commands from any command prompt displayed when you sign in using the `az login` command.

## ARC-enable the cluster

ARC is used to enable communication from the Azure Operator 5G Core resource provider to Kubernetes. You must have access to the cluster's kubeconfig file, or to Kubernetes API server to run the connectedK8s command. Refer to [Use Azure role-based access control to define access to the Kubernetes configuration file in Azure Kubernetes Service (AKS)](../aks/control-kubeconfig-access.md) for information.

### ARC-enable the cluster for Azure Kubernetes Services

Use the following Azure CLI command:

```azurecli
$ az connectedk8s connect --name <ARC NAME> --resource-group <RESOURCE GROUP> --custom-locations-oid <LOCATION> --kube-config <KUBECONFIG FILE>
```

### ARC-enable the cluster for Nexus Azure Kubernetes Services

Retrieve the Nexus AKS connected cluster ID with the following command. You need this cluster ID to create the custom location.

```azurecli
$ az connectedk8s show -n <NAKS-CLUSTER-NAME> -g <NAKS-RESOURCE-GRUP>  --query id -o tsv
```


## Install the Network Function Manager Kubernetes extension

Execute the following Azure CLI command to install the Network Function Manager (NFM) Kubernetes extension:

```azurecli
$ az k8s-extension create
--name networkfunction-operator \
--cluster-name <YourArcClusterName> \ 
--resource-group <YourResourceGroupName> \
--cluster-type connectedClusters \
--extension-type Microsoft.Azure.HybridNetwork \
--auto-upgrade-minor-version true \
--scope cluster \
--release-namespace azurehybridnetwork \
--release-train preview \
--config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
```
Replace `YourArcClusterName` with the name of your Azure/Nexus Arc enabled Kubernetes cluster and `YourResourceGroupName` with the name of your resource group. 

## Create an Azure custom location

Enter the following Azure CLI command to create an Azure custom location:

```azurecli
$ az customlocation create \
  -g <YourResourceGroupName> \
  -n <YourCustomLocationName> \
  -l <YourAzureRegion> \ 
  --namespace azurehybridnetwork 
  --host-resource-id
/subscriptions/<YourSubscriptionId>/resourceGroups/<YourResourceGroupName>/providers/Microsoft.Kubernetes/connectedClusters/<YourArcClusterName> --cluster-extension-ids /subscriptions/<YourSubscriptionId>/resourceGroups/<YourResourceGroupName>/providers/Microsoft.Kubernetes/connectedClusters/<YourArcClusterName>/providers/Microsoft.KubernetesConfiguration/extensions/networkfunction-operator
```

Replace `YourResourceGroupName`, `YourCustomLocationName`, `YourAzureRegion`, `YourSubscriptionId`, and `YourArcClusterName` with your actual resource group name, custom location name, Azure region, subscription ID, and Azure Arc enabled Kubernetes cluster name respectively. 

> [!NOTE]
> The `--cluster-extension-ids` option is used to provide the IDs of the cluster extensions that should be associated with the custom location. 

## Deploy Azure Operator 5G Core via Bicep scripts

Deployment of Azure Operator 5G Core consists of multiple resources including (clusterServices, amfDeployments, smfDeployments, upfDeployments, nrfDeployments, nssfDeployments, and observabilityServices). Each resource is deployed by an individual Bicep script and corresponding parameters file. Contact your Microsoft account contact to get access to the required Azure Operator 5G Core files. 

> [!NOTE]
> The required files are shared as a zip file.

Unpacking the zip file provides a bicep script for each Azure Operator 5G Core resource and corresponding parameter  file. Note the file location of the unpacked file. The next sections describe the parameters you need to set for each resource and how to deploy via Azure CLI commands. 

## Populate the parameter files

Mobile Packet Core resources are deployed via Bicep scripts that take parameters as input. The following tables describe the parameters to be supplied for each resource type.  

### Cluster Services parameters

| CLUSTERSERVICES                | Description                                                                                                 | Platform    |
|--------------------------------|-------------------------------------------------------------------------------------------------------------|-------------|
| `admin-password`            | The admin password for all PaaS UIs. This password must be the same across all charts.                               | all         |
| `alert-host`               | The alert host IP address                                                                                   | Azure only  |
| `alertmgr-lb-ip`            | The IP address of the Prometheus Alert manager load balancer                                                | all         |
| `customLocationId`         | The customer location ID path                                                                               | all         |
|`db-etcd-lb-ip`         | The IP address of the ETCD server load balancer IP                                                          | all         |
| `elastic-password`              | The Elasticsearch server admin password                                                                     | all         |
| `elasticsearch-host`             | The Elasticsearch host IP address                                                                           | all         |
| `fluentd-targets-host`           | The Fluentd target host IP address                                                                          | all         |
| `grafana-lb-ip`               | The IP address of the Grafana load balancer.                                                                | all         |
| `grafana-url`                   | The Grafana UI URL -&lt; https://IP:xxxx&gt; -  customer defined port number                                | all         |
| `istio-proxy-include-ip-ranges`  | The allowed Ingress IP ranges for Istio proxy. - default is " \* "                                          | all         |
| `jaeger-host`                    | The Jaeger target host IP address                                                                           | all         |
| `kargo-lb-ip`                    | The Kargo load balancer IP address                                                                          | all         |
| `multus-deployed`                | boolean on whether Multus is deployed or not.                                                               | Azure only  |
| `nfs-filepath`                   | The NFS (Network File System) file path where PaaS components store data - Nexus default "/filestore"  | Azure only  |
| `nfs-server`                    | The NFS (Network File System) server IP address                                                             | Azure only  |
| `oam-lb-subnet`                  | The subnet name for the OAM (Operations, Administration, and Maintenance) load balancer.                    | Azure only  |
| `redis-cluster-lb-ip`            | The IP address of the Redis cluster load balancer                                                           | Nexus only  |
| `redis-limit-cpu`                | The max CPU limit for each Redis server POD                                                                 | all         |
| `redis-limit-mem`                | The max memory limit for each Redis POD                                                                     | all         |
| `redis-primaries`               | The number of Redis primary shard PODs                                                                      | all         |
| `redis-replicas`                 | The number of Redis replica instances for each primary shard                                                | all         |
| `redis-request-cpu`              | The Min CPU request for each Redis POD                                                                      | all         |
| `redis-request-mem`              | The min memory request for each Redis POD                                                                   | all         |
| `thanos-lb-ip`                   | The IP address of the Thanos load balancer.                                                                 | all         |
| `timer-lb-ip`                    | The IP address of the Timer load balancer.                                                                  | all         |
|`tlscrt`                         | The  Transport Layer Security (TLS) certificate in plain text  used in cert manager                          | all         |
| `tlskey`                         | The TLS key in plain text, used in cert manager                                                             | all         |
|`unique-name-suffix`             | The unique name suffix for all generated PaaS service logs                                                  | all         |

 

### AMF Deployments Parameters 

| AMF Parameters           | Description                                                                                | Platform    |
|--------------------------|--------------------------------------------------------------------------------------------|-------------|
| `admin-password`           | The password for the admin user.                                                           |             |
| `aes256cfb128Key`         |  The AES-256-CFB-128 encryption key is Customer generated                                  | all         |
| `amf-cfgmgr-lb-ip`        | The IP address for the AMF Configuration Manager POD.                                      | all         |
| `amf-ingress-gw-lb-ip`     | The IP address for the AMF Ingress Gateway load balancer POD IP                            | all         |
| `amf-ingress-gw-li-lb-ip`  | The IP address for the AMF Ingress Gateway Lawful intercept POD IP                         | all         |
| `amf-mme-ppe-lb-ip1 \*`   | The IP address for the AMF/MME external load balancer (for SCTP associations)              | all         |
| `amf-mme-ppe-lb-ip2`     | The IP address for the AMF/MME external load balancer (for SCTP associations)  (second IP).   | all         |
| `elasticsearch-host`     | The Elasticsearch host IP address                                                          | all         |
| `external-gtpc-svc-ip`    | The IP address for the external GTP-C IP service address for N26 interface                 | all         |
| `fluentd-targets-host`    | The Fluentd target host IP address                                                         | all         |
| `gn-lb-subnet`            | The subnet name for the GN-interface load balancer.                                        | Azure only  |
| `grafana-url`            | The Grafana UI URL -&lt; https://IP:xxxx&gt; -  customer defined port number               | all         |
| `gtpc\_agent-n26-mme`   | The IP address for the GTPC agent N26 interface to the cMME. AMF-MME                       | all         |
| `gtpc\_agent-s10`        | The IP address for the GTPC agent S10 interface - MME to MME                               | all         |
| `gtpc\_agent-s11-mme`     | The IP address for the GTPC agent S11 interface to the cMME. - MME - SGW                   | all         |
| `gtpc-agent-ext-svc-name`| The external service name for the GTP-C (GPRS Tunneling Protocol Control Plane) agent.    | all         |
| `gtpc-agent-ext-svc-type`  | The external service type for the GTPC agent.                                              | all         |
| `gtpc-agent-lb-ip`       | The IP address for the GTPC agent load balancer.                                           | all         |
| `jaeger-host`              | The Jaeger target host IP address                                                          | all         |
| `li-lb-subnet`            | The subnet name for the LI load balancer.                                                  | all         |
|`nfs-filepath`            | The Network File System (NFS) file path where PaaS components store data              | Azure only  |
|`nfs-server`              | The NFS server IP address                                            | Azure only  |
| `oam-lb-subnet`        | The subnet name for the Operations, Administration, and Maintenance (OAM) load balancer.   | Azure only  |
| `sriov-subnet`             | The name of the SRIOV subnet                                                               | Azure only  |
| `ulb-endpoint-ips1`        | Not required since we're using lb-ppe in Azure Operator 5G Core. Leave blank                           | all         |
| ulb-endpoint-ips2        | Not required since we're using lb-ppe in Azure Operator 5G Core. Leave blank                           | all         |
| `unique-name-suffix`       | The unique name suffix for all generated PaaS service logs                                 | all         |

 
### SMF Deployment Parameters

| SMF Parameters           | Description                                                                                | Platform    |
|--------------------------|--------------------------------------------------------------------------------------------|-------------|
| `aes256cfb128Key`         | The AES-256-CFB-128 encryption key. Default value is an empty string.                      | all         |
| `elasticsearch-host`      | The Elasticsearch host IP address                                                          | all         |
| `fluentd-targets-host`  | The Fluentd target host IP address                                                         | all         |
| `gn-lb-subnet`            | The subnet name for the GN-interface load balancer.                                        | Azure only  |
| `grafana-url`             | The Grafana UI URL -&lt; https://IP:xxxx&gt; - customer defined port number                | all         |
| `gtpc-agent-ext-svc-name` | The external service name for the GTPC agent.                                              | all         |
| `gtpc-agent-ext-svc-type`  | The external service type for the GTPC agent.                                              | all         |
| `gtpc-agent-lb-ip`        | The IP address for the GTPC agent load balancer.                                           | all         |
| `inband-data-agent-lb-ip` | The IP address for the inband data agent load balancer.                                    | all         |
|`jaeger-host`              | The jaeger target host IP address                                                          | all         |
| `lcdr-filepath`          | The filepath for the local CDR charging                                                    | all         |
| `li-lb-subnet`             | The subnet for the LI subnet.                                                              | Azure only  |
| `max-instances-in-smfset` | The maximum number of instances in the SMF set - value is set to 3                         | all         |
| `n4-lb-subnet`             | The subnet name for N4 load balancer service.                                              | Azure only  |
| `nfs-filepath`           | The NFS (Network File System) file path where PaaS components store data              | Azure only  |
| `nfs-server`             | The NFS (Network File System) server IP address                                            | Azure only  |
| `oam-lb-subnet`            | The subnet name for the OAM (Operations, Administration, and Maintenance) load balancer.   | Azure only  |
| `pfcp-c-loadbalancer-ip` | The IP address for the PFCP-C load balancer.                                               | all         |
| `pfcp-ext-svc-name`       | The external service name for the PFCP.                                                    | all         |
| `pfcp-ext-svc-type`       | The external service type for the PFCP.                                                    | all         |
| `pfcp-lb-ip`             | The IP address for the PFCP load balancer.                                                 | all         |
| `pod-lb-ppe-replicas`     | The number of replicas for the POD LB PPE.                                                 | all         |
|`radius-agent-lb-ip`      | The IP address for the RADIUS agent IP load balancer.                                      | all         |
| `smf-cfgmgr-lb-ip`         | The IP address for the SMF Config manager load balancer.                                   | all         |
| `smf-ingress-gw-lb-ip`    | The IP address for the SMF Ingress Gateway load balancer.                                  | all         |
| `smf-ingress-gw-li-lb-ip`  | The IP address for the SMF Ingress Gateway LI load balancer.                               | all         |
| `smf-instance-id`        | The unique set ID identifying SMF in the set.                                              |             |
|`smfset-unique-set-id`  | The unique SMF set ID SMF in the set.                                                          | all         |
| `sriov-subnet`           | The name of the SRIOV subnet                                                               | Azure only  |
| `sshd-cipher-suite`        | The cipher suite for SSH (Secure Shell) connections.                                       | all         |
| `tls-cipher-suite`        | The TLS cipher suite.                                                                      | all         |
| `unique-name-suffix`      | The unique name suffix for all PaaS service logs                                           | all         |

### UPF Deployment Parameters 

| UPF parameters                          | Description                                                                                             | Platform    |
|-----------------------------------------|---------------------------------------------------------------------------------------------------------|-------------|
| `admin-password`                         |  "admin"                                                                                               |             |
| `aes256cfb128Key`                        | The AES-256-CFB-128 encryption key. AES encryption key used by cfgmgr                                   | all         |
|`alert-host`                          | The alert host IP address                                                                               | all         |
| `elasticsearch-host`                     | The Elasticsearch host IP address                                                                       | all         |
| `fileserver-cephfs-enabled-true-false`   | A boolean value indicating whether CephFS is enabled for the file server.                               |             |
| `fileserver-cfg-storage-class-name`      | The storage class name for file server storage.                                                         | all         |
| `fileserver-requests-storage`            | The storage size for file server requests.                                                              | all         |
| `fileserver-web-storage-class-name`      | The storage class name for file server web storage.                                                     | all         |
| `fluentd-targets-host`                   | The Fluentd target host IP address                                                                      | all         |
| `gn-lb-subnet`                           | The subnet name for the GN-interface load balancer.                                                     |             |
| `grafana-url`                          | The Grafana UI URL -&lt; https://IP:xxxx&gt; -  customer defined port number                            | all         |
| `jaeger-host`                            | The jaeger target host IP address                                                                       | all         |
| `l3am-max-ppe`                           | The maximum number of Packet processing engines (PPE) that are supported in user plane          | all         |
|`l3am-spread-factor`                      | The spread factor determines the number of PPE instances where sessions of a single PPE are backed up   | all         |
| `n4-lb-subnet`                         | The subnet name for N4 load balancer service.                                                           | Azure only  |
| `nfs-filepath`                          | The NFS (Network File System) file path where PaaS components store data                           | Azure only  |
| `nfs-server`                           | The NFS (Network File System) server IP address                                                         | Azure only  |
| `oam-lb-subnet`                          | The subnet name for the OAM (Operations, Administration, and Maintenance) load balancer.                | Azure only  |
| `pfcp-ext-svc-name`                      | The name of the PFCP (Packet Forwarding Control Protocol) external service.                             | Azure only  |
| `pfcp-u-external-fqdn`                   | The external fully qualified domain name for the PFCP-U.                                                | all         |
| `pfcp-u-lb-ip`                        | The IP address for the PFCP-U (Packet Forwarding Control Protocol - User Plane) load balancer.          | all         |
| `ppe-imagemanagement-requests-storage`    | The storage size for PPE (Packet Processing Engine) image management requests.                          | all         |
| `ppe-imagemanagement-storage-class-name` | The storage class name for PPE image management.                                                        | all         |
|`ppe-node-zone-resiliency-enabled`       | A boolean value indicating whether PPE node zone resiliency is enabled.                                 | all         |
| `sriov-subnet-1`                        | The subnet for SR-IOV (Single Root I/O Virtualization) interface 1.                                     | Azure only  |
| `sriov-subnet-2`                        | The subnet for SR-IOV interface 2.                                                                      | Azure only  |
| `sshd-cipher-suite`                      | The cipher suite for SSH (Secure Shell) connections.                                                    | all         |
| `tdef-enabled-true-false`                | A boolean value indicating whether TDEF (Traffic Detection Function) is enabled. False is default       | Nexus only  |
|`tdef-sc-name`                          | TDEF storage class name                                                                                 | Nexus only  |
| `tls-cipher-suite`                      | The cipher suite for TLS (Transport Layer Security) connections.                                        | all         |
| `tvs-enabled-true-false`                | A boolean value indicating whether TVS (Traffic video shaping) is enabled. Default is false              | Nexus only  |
| `unique-name-suffix`                    | The unique name suffix for all PaaS service logs                                                        | all         |
| `upf-cfgmgr-lb-ip`                       | The IP address for the UPF configuration manager load balancer.                                         | all         |
| `upf-ingress-gw-lb-fqdn`                | The fully qualified domain name for the UPF ingress gateway LI.                                         | all         |
| `upf-ingress-gw-lb-ip`                 | The IP address for the User Plane Function (UPF) ingress gateway load balancer.                         | all         |
| `upf-ingress-gw-li-fqdn`                 | The fully qualified domain name for the UPF ingress gateway load balancer.                              | all         |
| `upf-ingress-gw-li-ip`                   | The IP address for the UPF ingress gateway LI (Local Interface).                                        | all         |


### NRF Deployment Parameters

| NRF Parameters        | Description                                                                                | Platform    |
|-----------------------|--------------------------------------------------------------------------------------------|-------------|
| `aes256cfb128Key`       |  The AES-256-CFB-128 encryption key is Customer generated                                  | All         |
| `elasticsearch-host`   | The Elasticsearch host IP address                                                          | All         |
| `grafana-url`           | The Grafana UI URL -&lt; https://IPaddress:xxxx&gt; , customer defined port number         | All         |
| `jaeger-host`          | The Jaeger target host IP address                                                          | All         |
| `nfs-filepath`          | The NFS (Network File System) file path where PaaS components store data              | Azure only  |
| `nfs-server`           | The NFS (Network File System) server IP address                                            | Azure only  |
| `nrf-cfgmgr-lb-ip`    | The IP address for the NRF Configuration Manager POD.                                      | All         |
| `nrf-ingress-gw-lb-ip`  | The IP address of the load balancer for the NRF ingress gateway.                           | All         |
| `oam-lb-subnet`         | The subnet name for the OAM (Operations, Administration, and Maintenance) load balancer.   | Azure only  |
| `unique-name-suffix`    | The unique name suffix for all generated PaaS service logs                                 | All         |

 
### NSSF Deployment Parameters

| NSSF Parameters        | Description                                                                                | Platform    |
|------------------------|--------------------------------------------------------------------------------------------|-------------|
|`aes256cfb128Key`        |  The AES-256-CFB-128 encryption key is Customer generated                                  | all         |
| `elasticsearch-host`    | The Elasticsearch host IP address                                                          | all         |
| `fluentd-targets-host`  | The Fluentd target host IP address                                                         | all         |
| `grafana-url`           | The Grafana UI URL -&lt; https://IP:xxxx&gt; - customer defined port number                | all         |
| `jaeger-host`            | The Jaeger target host IP address                                                          | all         |
| `nfs-filepath`           | The NFS (Network File System) file path where PaaS components store data              | Azure only  |
| `nfs-server`            | The NFS (Network File System) server IP address                                            | Azure only  |
| `nssf-cfgmgr-lb-ip`     | The IP address for the NSSF Configuration Manager POD.                                     | all         |
| `nssf-ingress-gw-lb-ip`  | The IP address for the NSSF Ingress Gateway load balancer IP                               | all         |
|`oam-lb-subnet`          | The subnet name for the OAM (Operations, Administration, and Maintenance) load balancer.   | Azure only  |
|`unique-name-suffix`     | The unique name suffix for all generated PaaS service logs                                 | all         |

 
### Observability Services Parameters 

| OBSERVABILITY parameters  | Description                                                                                | Platform    |
|---------------------------|--------------------------------------------------------------------------------------------|-------------|
| `admin-password`            | The admin password for all PaaS UIs. This password must be the same across all charts.                  | all         |
| `elastalert-lb-ip`          | The IP address of the Elastalert load balancer.                                            | all         |
| `elastic-lb-ip`             | The IP address of the Elastic load balancer.                                               | all         |
| `elasticsearch-host`        | The host IP of the Elasticsearch server IP                                                 | all         |
| `elasticsearch-server`      | The Elasticsearch UI server IP address                                                     | all         |
| `fluentd-targets-host`      | The host of the Fluentd server IP address                                                  | all         |
| `grafana-url`               | The Grafana UI URL -&lt; https://IP:xxxx&gt; -  customer defined port number               | all         |
|`jaeger-lb-ip`              | The IP address of the Jaeger load balancer.                                                | all         |
| `kafka-lb-ip`               | The IP address of the Kafka load balancer                                                  | all         |
| `keycloak-lb-ip`            | The IP address of the Keycloak load balancer                                               | all         |
| `kibana-lb-ip`            | The IP address of the Kibana load balancer                                                 | all         |
| `kube-prom-lb-ip`          | The IP address of the Kube-prom load balancer                                              | all         |
| `nfs-filepath`              | The NFS (Network File System) file path where PaaS components store data              | Azure only  |
| `nfs-server`                | The NFS (Network File System) server IP address                                            | Azure only  |
|`oam-lb-subnet`             | The subnet name for the OAM (Operations, Administration, and Maintenance) load balancer.   | Azure only  |
| `unique-name-suffix`        | The unique name suffix for all PaaS service logs                                           | all         |
|                           |                                                                                            |             |
 

## Deploy Azure Operator 5G Core via Azure Resource Manager

You can deploy Azure Operator 5G Core resources by using  Azure CLI. The following command deploys a single mobile packet core resource. To deploy a complete AO5GC environment, all resources must be deployed.  

The example command  is run for the nrfDeployments resource. Similar commands run for the other resource types (SMF, AMF, UPF, NRF, NSSF). The observability components can also be deployed with the observability services resource making another request. There are a total of seven resources to deploy for a complete Azure Operator 5G Core deployment.  

### Deploy using Azure CLI

Set up the following environment variables:

```azurecli
$ export resourceGroupName=<Name of resource group> 
$ export templateFile=<Path to resource bicep script> 
$ export resourceName=<resource Name> 
$ export location <Azure region where resources are deployed> 
$ export templateParamsFile <Path to bicep script parameters file>
```
> [!NOTE]
> Choose a name that contains all associated Azure Operator 5G Core resources for the resource name. Use the same resource name for clusterServices and all associated network function resources.
 
Enter the following command to deploy Azure Operator 5G Core: 

```azurecli
az deployment group create \
--name $deploymentName \
--resource-group $resourceGroupName \
--template-file $templateFile \
--parameters $templateParamsFile
```
The following shows a sample deployment:

 ```azurecli
PS C:\src\teest> az deployment group create ` 
--resource-group ${ resourceGroupName } ` 
--template-file ./releases/2403.0-31-lite/AKS/bicep/nrfTemplateSecret.bicep ` 
--parameters resourceName=${ResourceName} ` 
--parameters locationName=${location} ` 
--parameters ./releases/2403.0-31-lite/AKS/params/nrfParams.json ` 
--verbose 

INFO: Command ran in 288.481 seconds (init: 1.008, invoke: 287.473) 

{ 
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/resourceGroupName /providers/Microsoft.Resources/deployments/nrfTemplateSecret", 
  "location": null, 
  "name": "nrfTemplateSecret", 
  "properties": { 
    "correlationId": "00000000-0000-0000-0000-000000000000", 
    "debugSetting": null, 
    "dependencies": [], 
    "duration": "PT4M16.5545373S", 
    "error": null, 
    "mode": "Incremental", 
    "onErrorDeployment": null, 
    "outputResources": [ 
      { 
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ resourceGroupName /providers/Microsoft.MobilePacketCore/nrfDeployments/test-505", 
        "resourceGroup": " resourceGroupName " 
      } 
    ], 

    "outputs": null, 
    "parameters": { 
      "locationName": { 
        "type": "String", 
        "value": " location " 
      }, 
      "replacement": { 
        "type": "SecureObject" 
      }, 
      "resourceName": { 
        "type": "String", 
        "value": " resourceName " 
      } 
    }, 
    "parametersLink": null, 
    "providers": [ 
      { 
        "id": null, 
        "namespace": "Microsoft.MobilePacketCore", 
        "providerAuthorizationConsentState": null, 
        "registrationPolicy": null, 
        "registrationState": null, 
        "resourceTypes": [ 
          { 
            "aliases": null, 
            "apiProfiles": null, 
            "apiVersions": null, 
            "capabilities": null, 
            "defaultApiVersion": null, 
            "locationMappings": null, 
            "locations": [ 
              " location " 
            ], 
            "properties": null, 
            "resourceType": "nrfDeployments", 
            "zoneMappings": null 
          } 
        ] 
      } 
    ], 
    "provisioningState": "Succeeded", 
    "templateHash": "3717219524140185299", 
    "templateLink": null, 
    "timestamp": "2024-03-12T16:07:49.470864+00:00", 
    "validatedResources": null 
  }, 
  "resourceGroup": " resourceGroupName ", 
  "tags": null, 
  "type": "Microsoft.Resources/deployments" 
} 

PS C:\src\test>
```

## Next step

- [Monitor the  status of your Azure Operator 5G Core Preview deployment](quickstart-monitor-deployment-status.md)
