---
title: Segregate worker nodes into different subnets
description: Discover how to segregate worker nodes into different subnets in an Azure Red Hat OpenShift (ARO) deployment
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: aro, machine set, openshift, red hat
ms.topic: how-to
ms.date: 01/26/2023
ms.custom: template-how-to
---

# Segregate worker nodes into different subnets with Azure Red Hat OpenShift

This article shows you how to segregate worker nodes into different private subnets as part of an ARO deployment. Separating worker nodes into different private subnets allows you to meet specific access control requirements for various services and applications deployed on ARO.

For example, you might want to run specific ingress controllers on dedicated worker nodes within a specific subnet, while the rest of the Kubernetes nodes for workloads (infra and other workers) sit within a completely different subnet, as shown below:

:::image type="content" source="media/howto-segregate-machinesets/subnet-configuration.png" alt-text="Screen shot of an example subnet configuration.":::

> [!NOTE]
> As part of ARO, master and worker nodes cannot be deployed in the same private subnet.

In order to segregate worker nodes into different subnets, two main steps need to be performed:

1. Deploy an ARO cluster.
    
1. Create the appropriate subnets and machine sets associated with those subnets.



## Deploy an ARO cluster

See [Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md) for instructions on performing this step.



## Step 1: Create the subnets and their associated subnets

Once you've deployed your ARO cluster, you'll need to create extra subnets as part of the same overall virtual network and create new machine sets for those subnets. Follow the sections below to complete this requirement.

### Step 2: Create the subnets

Create the subnets as part of the current virtual network in which ARO is deployed. Make sure that all the subnets are updated to the Microsoft.ContainerRegistry for service-endpoints. Follow the sections below to complete this step.


:::image type="content" source="media/howto-segregate-machinesets/subnets-window.png" alt-text="Screen shot of the Subnets window with service endpoints highlighted.":::

### Log into the jumphost

> [!NOTE]
> This steps is optional of you have an alternative method for logging into the ARO cluster.

Use the following command to log in to the jumphost:

`oc login https://api.fq5v3vye.useast.aroapp.io:6443/ -u kubeadmin -p`

Verify the number of nodes and machine sets using the `oc get nodes` and `oc get machineSets -n openshift-mchine-api` commands, as shown in the following examples:

```
oc get nodes
NAME                                          STATUS   ROLES    AGE   VERSION
simon-aro-st5rm-master-0                      Ready    master   66m   v1.19.0+e405995
simon-aro-st5rm-master-1                      Ready    master   67m   v1.19.0+e405995
simon-aro-st5rm-master-2                      Ready    master   67m   v1.19.0+e405995
simon-aro-st5rm-worker-useast1-h6kzn   Ready    worker   59m   v1.19.0+e405995
simon-aro-st5rm-worker-useast2-48zsm   Ready    worker   59m   v1.19.0+e405995
simon-aro-st5rm-worker-useast3-rvzpn   Ready    worker   59m   v1.19.0+e405995
```

```
[root@jumphost-new simon]# oc get machineSets --all-namespaces
NAMESPACE               NAME                                    DESIRED   CURRENT   READY   AVAILABLE   AGE
openshift-machine-api   simon-aro-st5rm-worker-useast1   1         1         1       1           69m
openshift-machine-api   simon-aro-st5rm-worker-useast2   1         1         1       1           69m
openshift-machine-api   simon-aro-st5rm-worker-useast3   1         1         1       1           69m
```


### Retrieve the machine sets in the `openshift-machine-api project/namespace`

Retrieving the machines sets allows you to get all the relevant parameters into the machineSet template in the following section.

`oc describe machineSet simon-aro-st5rm-worker-useast1 > aro-worker-az1.yaml`

### Create a new machineSet YAML file and apply it to the cluster

Use the template below for you machineSet YAML file. Change the parameters shown in bold according to the values retrieved in the previous section.

```
==============MachineSet Template====================
apiVersion: machine.openshift.io/v1beta1
kind: MachineSet
metadata:
  labels:
    machine.openshift.io/cluster-api-cluster: simon-aro-st5rm
    machine.openshift.io/cluster-api-machine-role: worker
    machine.openshift.io/cluster-api-machine-type: worker
  name: simon-aro-st5rm-worker-useast4
  namespace: openshift-machine-api
spec:
  replicas: 1
  selector:
    matchLabels:
      machine.openshift.io/cluster-api-cluster: simon-aro-st5rm
      machine.openshift.io/cluster-api-machineset: simon-aro-st5rm-worker-useast4
  template:
    metadata:
      creationTimestamp: null
      labels:
        machine.openshift.io/cluster-api-cluster: simon-aro-st5rm
        machine.openshift.io/cluster-api-machine-role: worker
        machine.openshift.io/cluster-api-machine-type: worker
        machine.openshift.io/cluster-api-machineset: simon-aro-st5rm-worker-useast4
    spec:
      metadata:
        creationTimestamp: null
        labels:
          node-role.kubernetes.io/<role>: ""
      providerSpec:
        value:
          apiVersion: azureproviderconfig.openshift.io/v1beta1
          credentialsSecret:
            name: azure-cloud-credentials
            namespace: openshift-machine-api
          image:
            offer: aro4
            publisher: azureopenshift
            resourceID: ""
            sku: aro_46
            version: 46.82.20201126
          internalLoadBalancer: ""
          kind: AzureMachineProviderSpec
          location: useast
          metadata:
            creationTimestamp: null
          natRule: null
          networkResourceGroup: v4-useast
          osDisk:
            diskSizeGB: 128
            managedDisk:
              storageAccountType: Premium_LRS
            osType: Linux
          publicIP: false
          publicLoadBalancer: simon-aro-st5rm
          resourceGroup: aro-fq5v3vye
          sshPrivateKey: ""
          sshPublicKey: ""
          subnet: worker-new
          userDataSecret:
            name: worker-user-data
          vmSize: Standard_D4s_v3
          vnet: aro-vnet
          zone: "1"
```

### Apply the machine set

Apply the machine set created in the previous section using the `oc apply -f /<filename.yaml/>` command, as in the following example:

```
[root@jumphost-new ARO-cluster-Private]# oc apply -f aro-new-worker-az1.yaml
machineset.machine.openshift.io/simon-aro-qpsl5-worker-useast4 created
```
Once you've applied the YAML file, you can verify the creation of the machine set and nodes using the `oc get machineSets` and `oc get nodes` commands, as shown in the following examples:


`[root@jumphost-new ARO-cluster-Private]# oc get machineSet`

```
NAME                                    DESIRED   CURRENT   READY   AVAILABLE   AGE
simon-aro-st5rm-worker-useast1   1         1         1       1           142m
simon-aro-st5rm-worker-useast2   1         1         1       1           142m
simon-aro-st5rm-worker-useast3   1         1         1       1           142m
simon-aro-st5rm-worker-useast4   1         1                             46s
```

After a few more minutes, the new machine set and nodes will appear:

`[root@jumphost-new ARO-cluster-Private]# oc get machineSet`

```
NAME                                    DESIRED   CURRENT   READY   AVAILABLE   AGE
simon-aro-st5rm-worker-useast1   1         1         1       1           148m
simon-aro-st5rm-worker-useast2   1         1         1       1           148m
simon-aro-st5rm-worker-useast3   1         1         1       1           148m
simon-aro-st5rm-worker-useast4   1         1         1       1           6m11s
```

`[root@jumphost-new ARO-cluster-Private]# oc get nodes`

```
NAME                                          STATUS   ROLES    AGE    VERSION
simon-aro-st5rm-master-0                      Ready    master   147m   v1.19.0+e405995
simon-aro-st5rm-master-1                      Ready    master   147m   v1.19.0+e405995
simon-aro-st5rm-master-2                      Ready    master   147m   v1.19.0+e405995
simon-aro-st5rm-worker-useast1-h6kzn   Ready    worker   139m   v1.19.0+e405995
simon-aro-st5rm-worker-useast2-48zsm   Ready    worker   139m   v1.19.0+e405995
simon-aro-st5rm-worker-useast3-rvzpn   Ready    worker   139m   v1.19.0+e405995
simon-aro-st5rm-worker-useast4-qrsgx   Ready    worker   104s   v1.19.0+e405995
```
