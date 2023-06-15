---
title: Deploy infrastructure nodes in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to deploy infrastructure nodes in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: infrastructure nodes, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 06/15/2023
ms.custom: template-how-to
---

# Deploy infrastructure nodes in an Azure Red Hat OpenShift (ARO) cluster

ARO allows you to use infrastructure machine sets to create machines that only host infrastructure components, such as the default router, the integrated container registry, the integrated container image registry, and the components for cluster metrics and monitoring. These infrastructure machines are not counted toward the total number of subscriptions that are required to run the environment.

In a production deployment, it's recommended that you deploy at least three machine sets to hold infrastructure components. Each of these nodes can be deployed to different availability zones to increase availability. This type of configuration requires three different machines sets; one for each availability zone.

## Qualified workloads

The following infrastructure workloads do not incur OpenShift Container Platform worker subscriptions:

- Kubernetes and OpenShift Container Platform control plane services that run on masters

- The default router

- The integrated container image registry

- The HAProxy-based Ingress Container

- The cluster metrics collection, or monitoring service, including components for monitoring user-defined projects

- Cluster-aggregated logging

> [!IMPORTANT]
> If workloads outside of the types mentioned above are discovered on the infrastructure nodes, the Software License Agreement will be invalidated and the stability of the cluster may be compromised. 

## Before you begin

In order for Azure VMs added to an ARO cluster to recognized as infrastructure nodes (as opposed to additonal worker nodes) and not be charged an OpenShift fee, the following criteria must be met:

- The nodes must be of of the following instance types only:
    - Standard_E4s_v5
    - Standard_E8s_v5
    - Standard_E16s_v5
    
- There can be no more than three nodes. Any additional nodes will be charged an OpenShift fee.

- The nodes must have an Azure tag of **node_role: infra**.

- No other workloads besides those designed for the infra nodes (described above) are allowed. Other types of nodes will be deemed as worker nodes and be charged a fee. This may also invalidate the Software License Agreement and compromise the stability of the cluster.


## Creating infrastructure machine sets

Use the template below to create the manifest definition for your infrastructure machine set.

Replace all fields in between "<>" with your specific values. For example, replace `location: <REGION>` with `location: westus2`

For help with the required commands and values, see...

Create the machine set with the command `oc create -f <machine-set-filename.yaml>`.

To verify the creation of the machine set, run the following command: `oc get machineset -n openshift-machine-api`

The output of the verification command should look similar to below:


```
NAME                            DESIRED     CURRENT  READY   AVAILABLE   AGE
ok0608-vkxvw-infra-westus21     1           1        1       1           165M
ok0608-vkxvw-worker-westus21    1           1        1       1           4H24M
ok0608-vkxvw-worker-westus22    1           1        1       1           4H24M 
ok0608-vkxvw-worker-westus23    1           1        1       1           4H24M
```

### Manifest definition template

Use the following template in the procedure above to create the manifest definition for your infrastructure machine set:

```
apiVersion: machine.openshift.io/v1beta1
kind: MachineSet
metadata:
  labels:
    machine.openshift.io/cluster-api-cluster: <INFRASTRUCTURE_ID> 
    machine.openshift.io/cluster-api-machine-role: infra 
    machine.openshift.io/cluster-api-machine-type: infra 
  name: <INFRASTRUCTURE_ID>-infra-<REGION><ZONE>
  namespace: openshift-machine-api
spec:
  replicas: 1
  selector:
    matchLabels:
      machine.openshift.io/cluster-api-cluster: <INFRASTRUCTURE_ID>
      machine.openshift.io/cluster-api-machineset: <INFRASTRUCTURE_ID>-infra-<REGION><ZONE>
  template:
    metadata:
      creationTimestamp: null
      labels:
        machine.openshift.io/cluster-api-cluster: <INFRASTRUCTURE_ID>
        machine.openshift.io/cluster-api-machine-role: infra 
        machine.openshift.io/cluster-api-machine-type: infra 
        machine.openshift.io/cluster-api-machineset: <INFRASTRUCTURE_ID>-infra-<REGION><ZONE>
    spec:
      metadata:
        creationTimestamp: null
        labels:
          machine.openshift.io/cluster-api-machineset: <OPTIONAL: Specify the machine set name to enable the use of availability sets. This setting only applies to new compute machines.> 
          node-role.kubernetes.io/infra: ''
      providerSpec:
        value:
          apiVersion: azureproviderconfig.openshift.io/v1beta1
          credentialsSecret:
            name: azure-cloud-credentials
            namespace: openshift-machine-api
          image: 
            offer: aro4
            publisher: azureopenshift
            sku: <SKU>
            version: <VERSION>
          kind: AzureMachineProviderSpec
          location: <REGION>
          metadata:
            creationTimestamp: null
          natRule: null
          networkResourceGroup: <NETWORK_RESOURCE_GROUP>
          osDisk:
            diskSizeGB: 128
            managedDisk:
              storageAccountType: Premium_LRS
            osType: Linux
          publicIP: false
          resourceGroup: <CLUSTER_RESOURCE_GROUP>
          tags:
            node_role: infra
          subnet: <SUBNET_NAME>   
          userDataSecret:
            name: worker-user-data 
          vmSize: <Standard_E4s_v5, Standard_E8s_v5, Standard_E16s_v5>
          vnet: aro-vnet 
          zone: <ZONE>
      taints: 
      - key: node-role.kubernetes.io/infra
        effect: NoSchedule
```

### Commands and values

Below are some common commands/values that you may need when creating and executing the template.

List all machinesets:

`oc get machineset -n openshift-machine-api`

Get details for a specific machineset:

`oc get machineset <machineset_name> -n openshift-machine-api -o yaml`

Cluster resource group:

`oc get infrastructure cluster -o jsonpath='{.status.platformStatus.azure.resourceGroupName}'`

Network resource group:

`oc get infrastructure cluster -o jsonpath='{.status.platformStatus.azure.networkResourceGroupName}'`

Infrastructure ID:

`oc get infrastructure cluster -o jsonpath='{.status.infrastructureName}'`

Region:

`oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.location}'`

SKU:

`oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.image.sku}'`

Subnet:

`oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.subnet}'`


Version:

`oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.image.version}'`


Vnet:

`oc get machineset <machineset_name> -n openshift-machine-api -o jsonpath='{.spec.template.spec.providerSpec.value.vnet}'`

## Moving infrastructure workloads to the new infra nodes



