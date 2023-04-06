---
title: Segregate worker nodes into different subnets
description: Discover how to segregate worker nodes into different subnets in an Azure Red Hat OpenShift (ARO) deployment
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: aro, machine set, openshift, red hat
ms.topic: how-to
ms.date: 03/01/2023
ms.custom: template-how-to
---

# Segregate worker nodes into different subnets with Azure Red Hat OpenShift

This article shows you how to segregate worker nodes into different private subnets as part of an ARO deployment. Separating worker nodes into different private subnets allows you to meet specific access control requirements for various services and applications deployed on ARO.

For example, you might want to run specific ingress controllers on dedicated worker nodes within a specific subnet, while the rest of the Kubernetes nodes for workloads (infra and other workers) are within a different subnet, as shown below:

:::image type="content" source="media/howto-segregate-machinesets/subnet-configuration.png" alt-text="Screenshot of an example subnet configuration." lightbox="media/howto-segregate-machinesets/subnet-configuration.png":::

> [!NOTE]
> As part of ARO, master and worker nodes cannot be deployed in the same private subnet.

In order to segregate worker nodes into different subnets, two main steps need to be performed:

1. Deploy an ARO cluster.
    
1. Create the appropriate subnets and machine sets associated with those subnets.



## Deploy an ARO cluster

See [Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md) for instructions on performing this step.

## Create the subnets and associated machine sets

Once you've deployed your ARO cluster, you'll need to create extra subnets as part of the same overall virtual network and create new machine sets for those subnets.

### Step 1: Create the subnets

Create the subnets as part of the current virtual network in which ARO is deployed. Make sure that all the subnets are updated to the `Microsoft.ContainerRegistry` for **Service Endpoints**.

:::image type="content" source="media/howto-segregate-machinesets/subnets-window.png" alt-text="Screenshot of the Subnets window with service endpoints highlighted." lightbox="media/howto-segregate-machinesets/subnets-window.png":::

### Step 2: Sign-in to the jumphost

> [!NOTE]
> This step is optional if you have an alternate method for logging into the ARO cluster.

Use the following command to log into the jumphost:

`oc login $apiServer -u kubeadmin -p <kubeadmin password>`

Verify the number of nodes and machine sets using the `oc get nodes` and `oc get machineSets -n openshift-machine-api` commands, as shown in the following examples:

```
$ oc get nodes
NAME                                          STATUS   ROLES    AGE   VERSION
simon-aro-st5rm-master-0                      Ready    master   66m   v1.19.0+e405995
simon-aro-st5rm-master-1                      Ready    master   67m   v1.19.0+e405995
simon-aro-st5rm-master-2                      Ready    master   67m   v1.19.0+e405995
simon-aro-st5rm-worker-useast1-h6kzn   Ready    worker   59m   v1.19.0+e405995
simon-aro-st5rm-worker-useast2-48zsm   Ready    worker   59m   v1.19.0+e405995
simon-aro-st5rm-worker-useast3-rvzpn   Ready    worker   59m   v1.19.0+e405995
```

```
# oc get machineSets --all-namespaces
NAMESPACE               NAME                                    DESIRED   CURRENT   READY   AVAILABLE   AGE
openshift-machine-api   simon-aro-st5rm-worker-useast1   1         1         1       1           69m
openshift-machine-api   simon-aro-st5rm-worker-useast2   1         1         1       1           69m
openshift-machine-api   simon-aro-st5rm-worker-useast3   1         1         1       1           69m
```

### Step 3: Retrieve the machine sets in the `openshift-machine-api project/namespace`

Retrieving the machine sets allows you to get all of the relevant parameters into the machineSet template used in the following step.

`oc describe machineSet simon-aro-st5rm-worker-useast1 > aro-worker-az1.yaml`

### Step 4: Create a new machineSet YAML file and apply it to the cluster

Use the template below for your machineSet YAML file. Change the parameters shown with **Xs** according to the values retrieved in the previous section. For example, `machine.openshift.io/cluster-api-cluster: XXX-XXX-XXX` might be `machine.openshift.io/cluster-api-cluster: machine-aro-st3mr`

```yml
==============MachineSet Template====================
apiVersion: machine.openshift.io/v1beta1
kind: MachineSet
metadata:
  labels:
    machine.openshift.io/cluster-api-cluster: XXX-XXX-XXX
    machine.openshift.io/cluster-api-machine-role: worker
    machine.openshift.io/cluster-api-machine-type: worker
  name: XXX-XXX-XXX-XXX-XXX
  namespace: openshift-machine-api
spec:
  replicas: 1
  selector:
    matchLabels:
      machine.openshift.io/cluster-api-cluster: XXX-XXX-XXX
      machine.openshift.io/cluster-api-machineset: XXX-XXX-XXX-XXX-XXX
  template:
    metadata:
      creationTimestamp: null
      labels:
        machine.openshift.io/cluster-api-cluster: XXX-XXX-XXX
        machine.openshift.io/cluster-api-machine-role: worker
        machine.openshift.io/cluster-api-machine-type: worker
        machine.openshift.io/cluster-api-machineset: XXX-XXX-XXX-XXX-XXX
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
            sku: XXX_XX
            version: XX.XX.XXX
          internalLoadBalancer: ""
          kind: AzureMachineProviderSpec
          location: useast
          metadata:
            creationTimestamp: null
          natRule: null
          networkResourceGroup: XX-XXXXXX
          osDisk:
            diskSizeGB: 128
            managedDisk:
              storageAccountType: Premium_LRS
            osType: Linux
          publicIP: false
          publicLoadBalancer: XXX-XXX-XXX
          resourceGroup: aro-fq5v3vye
          sshPrivateKey: ""
          sshPublicKey: ""
          subnet: XXX-XXX
          userDataSecret:
            name: worker-user-data
          vmSize: Standard_D4s_v3
          vnet: XXX-XXX
          zone: "X"
```

### Step 5: Apply the machine set

Apply the machine set created in the previous section using the `oc apply -f <filename.yaml>` command, as in the following example:

```
[root@jumphost-new ARO-cluster-Private]# oc apply -f aro-new-worker-az1.yaml
machineset.machine.openshift.io/simon-aro-qpsl5-worker-useast4 created
```

### Step 6: Verify the machine set and nodes

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



