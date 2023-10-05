---
title: Use GPU workloads with Azure Red Hat OpenShift (ARO)
description: Discover how to utilize GPU workloads with Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: aro, gpu, openshift, red hat
ms.topic: how-to
ms.date: 08/30/2022
ms.custom: template-how-to
---

# Use GPU workloads with Azure Red Hat OpenShift

This article shows you how to use Nvidia GPU workloads with Azure Red Hat OpenShift (ARO).

## Prerequisites

* OpenShift CLI
* jq, moreutils, and gettext package
* Azure Red Hat OpenShift 4.10

If you need to install an ARO cluster, see [Tutorial: Create an Azure Red Hat OpenShift 4 cluster](tutorial-create-cluster.md). ARO clusters must be version 4.10.x or higher.

> [!NOTE] 
> As of ARO 4.10, it is no longer necessary to set up entitlements to use the Nvidia Operator. This has greatly simplified the setup of the cluster for GPU workloads.

Linux:

```bash
sudo dnf install jq moreutils gettext
```

macOS
```bash
brew install jq moreutils gettext
```

## Request GPU quota

All GPU quotas in Azure are 0 by default. You will need to sign in to the Azure portal and request GPU quota. Due to competition for GPU workers, you may have to provision an ARO cluster in a region where you can actually reserve GPU.

ARO supports the following GPU workers:

* NC4as T4 v3
* NC6s v3
* NC8as T4 v3
* NC12s v3
* NC16as T4 v3
* NC24s v3
* NC24rs v3
* NC64as T4 v3

> [!NOTE] 
> When requesting quota, remember that Azure is per core. To request a single NC4as T4 v3 node, you will need to request quota in groups of 4. If you wish to request an NC16as T4 v3, you will need to request quota of 16.

1. Sign in to [Azure portal](https://portal.azure.com).

1. Enter **quotas** in the search box, then select **Compute**.

1. In the search box, enter **NCAsv3_T4**, check the box for the region your cluster is in, and then select **Request quota increase**.

1. Configure quota.

    :::image type="content" source="media/howto-gpu-workloads/gpu-quota-azure.png" alt-text="Screenshot of quotas page on Azure portal.":::

## Sign in to your ARO cluster

Sign in to OpenShift with a user account with cluster-admin privileges. The example below uses an account named **kubadmin**:

   ```bash
   oc login <apiserver> -u kubeadmin -p <kubeadminpass>
   ```

## Pull secret (conditional)

Update your pull secret to make sure you can install operators and connect to [cloud.redhat.com](https://cloud.redhat.com/).

> [!NOTE] 
> Skip this step if you have already recreated a full pull secret with cloud.redhat.com enabled.

1. Log into to [cloud.redhat.com](https://cloud.redhat.com/).

1. Browse to https://cloud.redhat.com/openshift/install/azure/aro-provisioned.

1. Select **Download pull secret** and save the pull secret as `pull-secret.txt`.

   > [!IMPORTANT] 
   > The remaining steps in this section must be run in the same working directory as `pull-secret.txt`.

1. Export the existing pull secret.

   ```bash
   oc get secret pull-secret -n openshift-config -o json | jq -r '.data.".dockerconfigjson"' | base64 --decode > export-pull.json
   ```

1. Merge the downloaded pull secret with the system pull secret to add `cloud.redhat.com`.

   ```bash
   jq -s '.[0] * .[1]' export-pull.json pull-secret.txt | tr -d "\n\r" > new-pull-secret.json
   ```

1. Upload the new secret file.

   ```bash
   oc set data secret/pull-secret -n openshift-config --from-file=.dockerconfigjson=new-pull-secret.json
   ```

    > You may need to wait about 1 hour for everything to sync up with cloud.redhat.com.

1. Delete secrets.

   ```bash
   rm pull-secret.txt export-pull.json new-pull-secret.json
   ```

## GPU machine set

ARO uses Kubernetes MachineSet to create machine sets. The procedure below explains how to export the first machine set in a cluster and use that as a template to build a single GPU machine. 

1. View existing machine sets.

   For ease of setup, this example uses the first machine set as the one to clone to create a new GPU machine set.

   ```bash
   MACHINESET=$(oc get machineset -n openshift-machine-api -o=jsonpath='{.items[0]}' | jq -r '[.metadata.name] | @tsv')
   ```

1. Save a copy of the example machine set.

   ```bash
   oc get machineset -n openshift-machine-api $MACHINESET -o json > gpu_machineset.json
   ```

1. Change the `.metadata.name` field to a new unique name.

   <!--I'm going to create a unique name for this single node machine set, that shows nvidia-worker-<region><az>, that follows a similar pattern as all the other machine sets.-->

   ```bash
   jq '.metadata.name = "nvidia-worker-<region><az>"' gpu_machineset.json| sponge gpu_machineset.json
   ```

1. Ensure `spec.replicas` matches the desired replica count for the machine set.

    ```bash
    jq '.spec.replicas = 1' gpu_machineset.json| sponge gpu_machineset.json
    ```

1. Change the `.spec.selector.matchLabels.machine.openshift.io/cluster-api-machineset` field to match the `.metadata.name` field.

   ```bash
   jq '.spec.selector.matchLabels."machine.openshift.io/cluster-api-machineset" = "nvidia-worker-<region><az>"' gpu_machineset.json| sponge gpu_machineset.json
   ```

1. Change the `.spec.template.metadata.labels.machine.openshift.io/cluster-api-machineset` to match the `.metadata.name` field.

   ```bash
   jq '.spec.template.metadata.labels."machine.openshift.io/cluster-api-machineset" = "nvidia-worker-<region><az>"' gpu_machineset.json| sponge gpu_machineset.json
   ```

1. Change the `spec.template.spec.providerSpec.value.vmSize` to match the desired GPU instance type from Azure.

   The machine used in this example is **Standard_NC4as_T4_v3**.

   ```bash
   jq '.spec.template.spec.providerSpec.value.vmSize = "Standard_NC4as_T4_v3"' gpu_machineset.json | sponge gpu_machineset.json
   ```

1.  Change the `spec.template.spec.providerSpec.value.zone` to match the desired zone from Azure.

    ```bash
    jq '.spec.template.spec.providerSpec.value.zone = "1"' gpu_machineset.json | sponge gpu_machineset.json
    ```

1. Delete the `.status` section of the yaml file.

   ```bash
   jq 'del(.status)' gpu_machineset.json | sponge gpu_machineset.json
   ```

1. Verify the other data in the yaml file.

#### Create GPU machine set

Use the following steps to create the new GPU machine. It may take 10-15 minutes to provision a new GPU machine. If this step fails, sign in to [Azure portal](https://portal.azure.com) and ensure there are no availability issues. To do so, go to **Virtual Machines** and search for the worker name you created previously to see the status of VMs.

1. Create the GPU Machine set.

   ```bash
   oc create -f gpu_machineset.json
   ```

   This command will take a few minutes to complete.

1. Verify GPU machine set.

   Machines should be deploying. You can view the status of the machine set with the following commands:

   ```bash
   oc get machineset -n openshift-machine-api
   oc get machine -n openshift-machine-api
   ```

   Once the machines are provisioned (which could take 5-15 minutes), machines will show as nodes in the node list:

   ```bash
   oc get nodes
   ```

   You should see a node with the `nvidia-worker-southcentralus1` name that was created previously.

## Install Nvidia GPU Operator

This section explains how to create the `nvidia-gpu-operator` namespace, set up the operator group, and install the Nvidia GPU operator.

1. Create Nvidia namespace.

   ```yaml
   cat <<EOF | oc apply -f -
   apiVersion: v1
   kind: Namespace
   metadata:
     name: nvidia-gpu-operator
   EOF
   ```

1. Create Operator Group.

   ```yaml
   cat <<EOF | oc apply -f -
   apiVersion: operators.coreos.com/v1
   kind: OperatorGroup
   metadata:
     name: nvidia-gpu-operator-group
     namespace: nvidia-gpu-operator
   spec:
    targetNamespaces:
    - nvidia-gpu-operator
   EOF
   ```

1. Get the latest Nvidia channel using the following command:

   ```bash
   CHANNEL=$(oc get packagemanifest gpu-operator-certified -n openshift-marketplace -o jsonpath='{.status.defaultChannel}')
   ```
> [!NOTE] 
> If your cluster was created without providing the pull secret, the cluster won't include samples or operators from Red Hat or from certified partners. This will result in the following error message: 
> 
> *Error from server (NotFound): packagemanifests.packages.operators.coreos.com "gpu-operator-certified" not found.* 
>
> To add your Red Hat pull secret on an Azure Red Hat OpenShift cluster, [follow this guidance](howto-add-update-pull-secret.md).

1. Get latest Nvidia package using the following command:

   ```bash
   PACKAGE=$(oc get packagemanifests/gpu-operator-certified -n openshift-marketplace -ojson | jq -r '.status.channels[] | select(.name == "'$CHANNEL'") | .currentCSV')
   ```

1. Create Subscription.

   ```yaml
   envsubst  <<EOF | oc apply -f -
   apiVersion: operators.coreos.com/v1alpha1
   kind: Subscription
   metadata:
     name: gpu-operator-certified
     namespace: nvidia-gpu-operator
   spec:
     channel: "$CHANNEL"
     installPlanApproval: Automatic
     name: gpu-operator-certified
     source: certified-operators
     sourceNamespace: openshift-marketplace
     startingCSV: "$PACKAGE"
   EOF
   ```

1. Wait for Operator to finish installing.

   Don't proceed until you have verified that the operator has finished installing. Also, ensure that your GPU worker is online.

    :::image type="content" source="media/howto-gpu-workloads/nvidia-installed.png" alt-text="Screenshot of installed operators on namespace.":::

#### Install node feature discovery operator

The node feature discovery operator will discover the GPU on your nodes and appropriately label the nodes so you can target them for workloads. 

This example installs the NFD operator into the `openshift-ndf` namespace and creates the "subscription" which is the configuration for NFD.

Official Documentation for Installing [Node Feature Discovery Operator](https://docs.openshift.com/container-platform/4.10/hardware_enablement/psap-node-feature-discovery-operator.html).

1. Set up `Namespace`.

   ```yaml
   cat <<EOF | oc apply -f -
   apiVersion: v1
   kind: Namespace
   metadata:
     name: openshift-nfd
   EOF
   ```

1. Create `OperatorGroup`.

   ```yaml
   cat <<EOF | oc apply -f -
   apiVersion: operators.coreos.com/v1
   kind: OperatorGroup
   metadata:
     generateName: openshift-nfd-
     name: openshift-nfd
     namespace: openshift-nfd
   EOF
   ```

1. Create `Subscription`.

   ```yaml
   cat <<EOF | oc apply -f -
   apiVersion: operators.coreos.com/v1alpha1
   kind: Subscription
   metadata:
     name: nfd
     namespace: openshift-nfd
   spec:
     channel: "stable"
     installPlanApproval: Automatic
     name: nfd
     source: redhat-operators
     sourceNamespace: openshift-marketplace
   EOF
   ```
1. Wait for Node Feature discovery to complete installation.

   You can log in to your OpenShift console to view operators or simply wait a few minutes. Failure to wait for the operator to install will result in an error in the next step.

1. Create NFD Instance.

   ```yaml
   cat <<EOF | oc apply -f -
   kind: NodeFeatureDiscovery
   apiVersion: nfd.openshift.io/v1
   metadata:
     name: nfd-instance
     namespace: openshift-nfd
   spec:
     customConfig:
       configData: |
         #    - name: "more.kernel.features"
         #      matchOn:
         #      - loadedKMod: ["example_kmod3"]
         #    - name: "more.features.by.nodename"
         #      value: customValue
         #      matchOn:
         #      - nodename: ["special-.*-node-.*"]
     operand:
       image: >-
         registry.redhat.io/openshift4/ose-node-feature-discovery@sha256:07658ef3df4b264b02396e67af813a52ba416b47ab6e1d2d08025a350ccd2b7b
       servicePort: 12000
     workerConfig:
       configData: |
         core:
         #  labelWhiteList:
         #  noPublish: false
           sleepInterval: 60s
         #  sources: [all]
         #  klog:
         #    addDirHeader: false
         #    alsologtostderr: false
         #    logBacktraceAt:
         #    logtostderr: true
         #    skipHeaders: false
         #    stderrthreshold: 2
         #    v: 0
         #    vmodule:
         ##   NOTE: the following options are not dynamically run-time
         ##          configurable and require a nfd-worker restart to take effect
         ##          after being changed
         #    logDir:
         #    logFile:
         #    logFileMaxSize: 1800
         #    skipLogHeaders: false
         sources:
         #  cpu:
         #    cpuid:
         ##     NOTE: attributeWhitelist has priority over attributeBlacklist
         #      attributeBlacklist:
         #        - "BMI1"
         #        - "BMI2"
         #        - "CLMUL"
         #        - "CMOV"
         #        - "CX16"
         #        - "ERMS"
         #        - "F16C"
         #        - "HTT"
         #        - "LZCNT"
         #        - "MMX"
         #        - "MMXEXT"
         #        - "NX"
         #        - "POPCNT"
         #        - "RDRAND"
         #        - "RDSEED"
         #        - "RDTSCP"
         #        - "SGX"
         #        - "SSE"
         #        - "SSE2"
         #        - "SSE3"
         #        - "SSE4.1"
         #        - "SSE4.2"
         #        - "SSSE3"
         #      attributeWhitelist:
         #  kernel:
         #    kconfigFile: "/path/to/kconfig"
         #    configOpts:
         #      - "NO_HZ"
         #      - "X86"
         #      - "DMI"
           pci:
             deviceClassWhitelist:
               - "0200"
               - "03"
               - "12"
             deviceLabelFields:
         #      - "class"
               - "vendor"
         #      - "device"
         #      - "subsystem_vendor"
         #      - "subsystem_device"
         #  usb:
         #    deviceClassWhitelist:
         #      - "0e"
         #      - "ef"
         #      - "fe"
         #      - "ff"
         #    deviceLabelFields:
         #      - "class"
         #      - "vendor"
         #      - "device"
         #  custom:
         #    - name: "my.kernel.feature"
         #      matchOn:
         #        - loadedKMod: ["example_kmod1", "example_kmod2"]
         #    - name: "my.pci.feature"
         #      matchOn:
         #        - pciId:
         #            class: ["0200"]
         #            vendor: ["15b3"]
         #            device: ["1014", "1017"]
         #        - pciId :
         #            vendor: ["8086"]
         #            device: ["1000", "1100"]
         #    - name: "my.usb.feature"
         #      matchOn:
         #        - usbId:
         #          class: ["ff"]
         #          vendor: ["03e7"]
         #          device: ["2485"]
         #        - usbId:
         #          class: ["fe"]
         #          vendor: ["1a6e"]
         #          device: ["089a"]
         #    - name: "my.combined.feature"
         #      matchOn:
         #        - pciId:
         #            vendor: ["15b3"]
         #            device: ["1014", "1017"]
         #          loadedKMod : ["vendor_kmod1", "vendor_kmod2"]
   EOF
   ```

1. Verify that NFD is ready.

   The status of this operator should show as **Available**.

    :::image type="content" source="media/howto-gpu-workloads/nfd-ready-for-use.png" alt-text="Screenshot of node feature discovery operator.":::

#### Apply Nvidia Cluster Config

This section explains how to apply the Nvidia cluster config. Please read the [Nvidia documentation](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/openshift/install-gpu-ocp.html) on customizing this if you have your own private repos or specific settings. This process may take several minutes to complete.

1. Apply cluster config.

   ```yaml
   cat <<EOF | oc apply -f -
   apiVersion: nvidia.com/v1
   kind: ClusterPolicy
   metadata:
     name: gpu-cluster-policy
   spec:
     migManager:
       enabled: true
     operator:
       defaultRuntime: crio
       initContainer: {}
       runtimeClass: nvidia
       deployGFD: true
     dcgm:
       enabled: true
     gfd: {}
     dcgmExporter:
       config:
         name: ''
     driver:
       licensingConfig:
         nlsEnabled: false
         configMapName: ''
       certConfig:
         name: ''
       kernelModuleConfig:
         name: ''
       repoConfig:
         configMapName: ''
       virtualTopology:
         config: ''
       enabled: true
       use_ocp_driver_toolkit: true
     devicePlugin: {}
     mig:
       strategy: single
     validator:
       plugin:
         env:
           - name: WITH_WORKLOAD
             value: 'true'
     nodeStatusExporter:
       enabled: true
     daemonsets: {}
     toolkit:
       enabled: true
   EOF
   ```

1. Verify cluster policy.

   Log in to OpenShift console and browse to operators. Ensure sure you're in the `nvidia-gpu-operator` namespace. It should say `State: Ready once everything is complete`.

    :::image type="content" source="media/howto-gpu-workloads/nvidia-cluster-policy.png" alt-text="Screenshot of existing cluster policies on OpenShift console.":::

## Validate GPU

It may take some time for the Nvidia Operator and NFD to completely install and self-identify the machines. Run the following commands to validate that everything is running as expected:

1. Verify that NFD can see your GPU(s).

    ```bash
    oc describe node | egrep 'Roles|pci-10de' | grep -v master
    ```

      The output should appear similar to the following:

    ```bash
    Roles:              worker
                    feature.node.kubernetes.io/pci-10de.present=true
    ```

1. Verify node labels.

   You can see the node labels by logging into the OpenShift console -> Compute -> Nodes -> nvidia-worker-southcentralus1-.  You should see multiple Nvidia GPU labels and the pci-10de device from above.

    :::image type="content" source="media/howto-gpu-workloads/node-labels.png" alt-text="Screenshot of GPU labels on OpenShift console.":::

1. Nvidia SMI tool verification.

   ```bash
   oc project nvidia-gpu-operator
   for i in $(oc get pod -lopenshift.driver-toolkit=true --no-headers |awk '{print $1}'); do echo $i; oc exec -it $i -- nvidia-smi ; echo -e '\n' ;  done
   ```

   You should see output that shows the GPUs available on the host such as this example screenshot. (Varies depending on GPU worker type)

    :::image type="content" source="media/howto-gpu-workloads/test-gpu.png" alt-text="Screenshot of output showing available GPUs.":::

1. Create Pod to run a GPU workload

   ```yaml
   oc project nvidia-gpu-operator
   cat <<EOF | oc apply -f -
   apiVersion: v1
   kind: Pod
   metadata:
     name: cuda-vector-add
   spec:
     restartPolicy: OnFailure
     containers:
       - name: cuda-vector-add
         image: "quay.io/giantswarm/nvidia-gpu-demo:latest"
         resources:
           limits:
             nvidia.com/gpu: 1
         nodeSelector:
           nvidia.com/gpu.present: true
   EOF
   ```

1. View logs.

   ```bash
   oc logs cuda-vector-add --tail=-1
   ```

> [!NOTE] 
> If you get an error `Error from server (BadRequest): container "cuda-vector-add" in pod "cuda-vector-add" is waiting to start: ContainerCreating`, try running `oc delete pod cuda-vector-add` and then re-run the create statement above.

The output should be similar to the following (depending on GPU):

   ```bash
   [Vector addition of 5000 elements]
   Copy input data from the host memory to the CUDA device
   CUDA kernel launch with 196 blocks of 256 threads
   Copy output data from the CUDA device to the host memory
   Test PASSED
   Done
   ```
If successful, the pod can be deleted:

   ```bash
   oc delete pod cuda-vector-add
   ```


