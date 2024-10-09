---
title: Deploy confidential containers in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to deploy confidential containers in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: confidential containers, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 10/09/2024
ms.custom: template-how-to
---

# Deploy confidential containers in an Azure Red Hat OpenShift (ARO) cluster

<!--
Need introduction here. Describe what confidential containers are, they're benefits, etc. Describe the main components of it. Describe how you need to deploy sandboxed containers first. In other words, describe the basic installation steps required.

-->

## Before you begin/Prerequisites


## Deploy OpenShift sandboxed containers

> [!NOTE]
> In order to deploy sandboxed containers, you must have access to the cluster with the cluster-admin role.

### Install the OpenShift sandboxed containers Operator.

1. Create an `osc-namespace.yaml` manifest file:

    ```
    apiVersion: v1
    kind: Namespace
    metadata:
        name: openshift-sandboxed-containers-operator
    ```
1. Create the namespace by running the following command:
    `oc apply -f osc-namespace.yaml`
1. Create an `osc-operatorgroup.yaml` manifest file:

    ```
    apiVersion: operators.coreos.com/v1
    kind: OperatorGroup
    metadata:
      name: sandboxed-containers-operator-group
      namespace: openshift-sandboxed-containers-operator
    spec:
      targetNamespaces:
      - openshift-sandboxed-containers-operator
    ```
     
1. Create the operator group by running the following command

    `oc apply -f osc-operatorgroup.yaml`

1. Create an `osc-subscription.yaml` manifest file:

    ```
    apiVersion: operators.coreos.com/v1alpha1
    kind: Subscription
    metadata:
      name: sandboxed-containers-operator
      namespace: openshift-sandboxed-containers-operator
    spec:
      channel: stable
      installPlanApproval: Automatic
      name: sandboxed-containers-operator
      source: redhat-operators
      sourceNamespace: openshift-marketplace
      startingCSV: sandboxed-containers-operator.v1.7.0
    ```
    
1. Create the subscription by running the following command:

    `oc apply -f osc-subscription.yaml`

1. Verify that the Operator is correctly installed by running the following command:

    `oc get csv -n openshift-sandboxed-containers-operator`

    > [!NOTE]
    > This command can take several minutes to complete.

1. Watch the process by running the following command:

    `watch oc get csv -n openshift-sandboxed-containers-operator`
    
    **Example output:**
    
    |NAME  |DISPLAY  |VERSION  |REPLACES  |PHASE  |
    |---------|---------|---------|---------|---------|
    |openshift-sandboxed-containers |openshift-sandboxed-containers-operator |1.7.0  |1.6.0 |Succeeded |
    

### Modify the number of peer pod VMs per node

You can change the limit of peer pod virtual machines (VMs) per node by editing the `peerpodConfig` custom resource (CR).

1. Check the current limit by running the following command:

    ```
    oc get peerpodconfig peerpodconfig-openshift -n openshift-sandboxed-containers-operator \
    -o jsonpath='{.spec.limit}{"\n"}'
    ```

1. Modify the limit attribute of the peerpodConfig CR by running the following command, replacing `<value>` with the limit you want to define:

    ```
    oc patch peerpodconfig peerpodconfig-openshift -n openshift-sandboxed-containers-operator \
    --type merge --patch '{"spec":{"limit":"<value>"}}'
    ```
    
### Create the peer pods secret and peer pods config map

The AZURE_CLIENT_ID, AZURE_CLIENT_SECRET are used by the peerpodconfig-ctrl-caa-daemon daemonset to create the confidential VM to run the pod. Consequently AZURE_CLIENT_ID and AZURE_CLIENT_SECRET must have the necessary permissions to call Azure API to create VM, fetch images, and join networks in the ARO managed group.
 
These same parameters are used to create an image gallery and host the pod VM image in the ARO managed group. AZURE_CLIENT_ID and AZURE_CLIENT_SECRET must also have the necessary permissions to create image gallery and image definition.

The azure-credentials secret from the kube-system namespace is used, which has the required permissions to call Azure API to create VM, fetch images, join networks, create image gallery and definition in the ARO managed group.

```
AZURE_CLIENT_ID=$(oc get secret -n kube-system azure-credentials -o jsonpath="{.data.azure_client_id}" |  base64 -d)
AZURE_CLIENT_SECRET=$(oc get secret -n kube-system azure-credentials -o jsonpath="{.data.azure_client_secret}" |  base64 -d)
AZURE_TENANT_ID=$(oc get secret -n kube-system azure-credentials -o jsonpath="{.data.azure_tenant_id}" |  base64 -d)
AZURE_SUBSCRIPTION_ID=$(oc get secret -n kube-system azure-credentials -o jsonpath="{.data.azure_subscription_id}" |  base64 -d)

echo "AZURE_CLIENT_ID: \"$AZURE_CLIENT_ID\""
echo "AZURE_CLIENT_SECRET: \"$AZURE_CLIENT_SECRET\""
echo "AZURE_TENANT_ID: \"$AZURE_TENANT_ID\""
echo "AZURE_SUBSCRIPTION_ID: \"$AZURE_SUBSCRIPTION_ID\""
```

> [!NOTE]
> When an ARO cluster is deleted, the secret object is deleted as well. Ensure you safely store the above values so that these are available for any Confidential Containers related resource cleanups. 
> 

1. Create the peer-pods-secret yaml:

    ```azurecli
    cat > coco-secret.yaml <<EOF
    apiVersion: v1
    kind: Secret
    metadata:
     name: peer-pods-secret
     namespace: openshift-sandboxed-containers-operator
    type: Opaque
    stringData:
     AZURE_CLIENT_ID: "${AZURE_CLIENT_ID}" # set
     AZURE_CLIENT_SECRET: "${AZURE_CLIENT_SECRET}" # set
     AZURE_TENANT_ID: "${AZURE_TENANT_ID}" # set
     AZURE_SUBSCRIPTION_ID: "${AZURE_SUBSCRIPTION_ID}" # set
    EOF

    cat coco-secret.yaml
    ```


1. Create the secret (after validating all fields are populated):

    `oc apply -f coco-secret.yaml`

1. Get the required values for peer-pods-cm:

    ```
    # Get the ARO created RG
    ARO_RESOURCE_GROUP=$(oc get infrastructure/cluster -o jsonpath='{.status.platformStatus.azure.resourceGroupName}')
    
    # Get VNET name used by ARO. This exists in the admin created RG.
    # Note this RG is the AZURE_RESOURCE_GROUP and not the ARO_RESOURCE_GROUP
    ARO_VNET_NAME=$(az network vnet list --resource-group $AZURE_RESOURCE_GROUP --query "[].{Name:name}" --output tsv)
    
    # Get the OpenShift worker subnet ip address cidr. This exists in the admin created RG
    ARO_WORKER_SUBNET_ID=$(az network vnet subnet list --resource-group $AZURE_RESOURCE_GROUP --vnet-name $ARO_VNET_NAME --query "[].{Id:id} | [? contains(Id, 'worker')]" --output tsv)
    
    ARO_NSG_ID=$(az network nsg list --resource-group $ARO_RESOURCE_GROUP --query "[].{Id:id}" --output tsv)
    
    # Get Trustee host
    TRUSTEE_HOST=$(oc get route -n kbs-operator-system kbs-service -o jsonpath={.spec.host})
    
    echo "AZURE_REGION: \"$AZURE_REGION\""
    echo "AZURE_RESOURCE_GROUP: \"$ARO_RESOURCE_GROUP\""
    echo "AZURE_SUBNET_ID: \"$ARO_WORKER_SUBNET_ID\""
    echo "AZURE_NSG_ID: \"$ARO_NSG_ID\""
    echo "TRUSTEE_HOST: \"$TRUSTEE_HOST\""
    ```
    
1. Create the peer-pods-cm yaml:
    
    ```
    cat > coco-cm.yaml <<EOF
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: peer-pods-cm
      namespace: openshift-sandboxed-containers-operator
    data:
      CLOUD_PROVIDER: "azure"
      VXLAN_PORT: "9000"
      AZURE_INSTANCE_SIZE: "Standard_DC2as_v5"
      AZURE_RESOURCE_GROUP: "${ARO_RESOURCE_GROUP}"
      AZURE_REGION: "${AZURE_REGION}"
      AZURE_SUBNET_ID: "${ARO_WORKER_SUBNET_ID}" 
      AZURE_NSG_ID: "${ARO_NSG_ID}"
      AZURE_IMAGE_ID: ""
      PROXY_TIMEOUT: "5m"
      AA_KBC_PARAMS: "cc_kbc::https://${TRUSTEE_HOST}"
    EOF
    
    cat coco-cm.yaml
    ```
    
1. Create the configmap (after validating all fields are populated):

    `oc apply -f coco-cm.yaml`

### Create the Azure secret

1. Log in to your cluster.
1. Generate an SSH key pair by running the following command:

    `$ ssh-keygen -f ./id_rsa -N ""`

1. Create the secret object by running the following command:

    ```
    oc create secret generic ssh-key-secret \
      -n openshift-sandboxed-containers-operator \
      --from-file=id_rsa.pub=./id_rsa.pub
    ```
    
1. Delete the SSH keys you created:

    `$ shred --remove id_rsa.pub id_rsa`



### Create the KataConfig custom resource

You must create the `KataConfig` custom resource (CR) to install `kata-remote` as a runtime class on your worker nodes.

Creating the `KataConfig` CR triggers the OpenShift sandboxed containers Operator to create a `RuntimeClass` CR named `kata-remote` with a default configuration. This enables users to configure workloads to use `kata-remote` as the runtime by referencing the CR in the `RuntimeClassName` field. This CR also specifies the resource overhead for the runtime.

OpenShift sandboxed containers installs `kata-remote` as a secondary, optional runtime on the cluster and not as the primary runtime.

1. Create an `example-kataconfig.yaml` manifest file according to the following example:
        
    ```
    apiVersion: kataconfiguration.openshift.io/v1
    kind: KataConfig
    metadata:
      name: example-kataconfig
    spec:
      enablePeerPods: true
      logLevel: info
    #  kataConfigPoolSelector:
    #    matchLabels:
    #      <label_key>: '<label_value>'
    ```
      
      If you have applied node labels to install `kata-remote` on specific nodes, specify the key and value, for example, `osc: 'true'`.

1. Create the `KataConfig` CR by running the following command:

      `$ oc apply -f example-kataconfig.yaml`
    
      The new `KataConfig` CR is created and installs kata-remote as a runtime class on the worker nodes.
        
      Wait for the `kata-remote` installation to complete and the worker nodes to reboot before verifying the installation.

1. Monitor the installation progress by running the following command:

    `$ watch "oc describe kataconfig | sed -n /^Status:/,/^Events/p"`
    
    When the status of all workers under `kataNodes` is installed and the condition `InProgress` is `False` without specifying a reason, the `kata-remote` is installed on the cluster.

1. Verify the daemon set by running the following command:

    `$ oc get -n openshift-sandboxed-containers-operator ds/peerpodconfig-ctrl-caa-daemon`
    
1. Verify the runtime classes by running the following command:

    `$ oc get runtimeclass`

    **Example output**
      
    ```
    NAME             HANDLER          AGE
    kata             kata             152m
    kata-remote     kata-remote      152m
    ```
    
### Verify the pod VM image

After `kata-remote` is installed on your cluster, the OpenShift sandboxed containers Operator creates a pod VM image, which is used to create peer pods. This process can take a long time because the image is created on the cloud instance. You can verify that the pod VM image was created successfully by checking the config map that you created for the cloud provider.

1. Obtain the config map you created for the peer pods:

    `$ oc get configmap peer-pods-cm -n openshift-sandboxed-containers-operator -o yaml`

2. Check the `status` stanza of the YAML file.

    If the `AZURE_IMAGE_ID` parameter is populated, the pod VM image was created successfully.


### Configure workload objects

You must configure OpenShift sandboxed containers workload objects by setting `kata-remote` as the runtime class for the following pod-templated objects:

- Pod objects
- ReplicaSet objects
- ReplicationController objects
- StatefulSet objects
- Deployment objects
- DeploymentConfig objects

You can define whether the workload should be deployed using the default instance size, which you defined in the config map, by adding an annotation to the YAML file.

If you do not want to define the instance size manually, you can add an annotation to use an automatic instance size, based on the memory available.

1. Add `spec.runtimeClassName: kata-remote` to the manifest of each pod-templated workload object as in the following example:

    ```
    apiVersion: v1
    kind: <object>
    # ...
    spec:
      runtimeClassName: kata-remote
    # ...
    ```
    
1. Add an annotation to the pod-templated object to use a manually defined instance size or an automatic instance size:

    To use a manually defined instance size, add the following annotation:
    
    ```
    apiVersion: v1
    kind: <object>
    metadata:
      annotations:
        io.katacontainers.config.hypervisor.machine_type: "Standard_B2als_v2"
    # ...
    ```
    
    Specify the instance size that you defined in the config map.
    
    To use an automatic instance size, add the following annotations:
    
    ```
    apiVersion: v1
    kind: <Pod>
    metadata:
      annotations:
        io.katacontainers.config.hypervisor.default_vcpus: <vcpus>
        io.katacontainers.config.hypervisor.default_memory: <memory>
    # ...
    ```
    
    Define the amount of memory available for the workload to use. The workload will run on an automatic instance size based on the amount of memory available.
    
1. Apply the changes to the workload object by running the following command:

    `$ oc apply -f <object.yaml>`
    
    OpenShift Container Platform creates the workload object and begins scheduling it.
    









