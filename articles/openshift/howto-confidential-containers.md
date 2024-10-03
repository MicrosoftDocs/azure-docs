---
title: Deploy confidential containers in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to deploy confidential containers in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: confidential containers, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 10/03/2024
ms.custom: template-how-to
---

# Deploy confidential containers in an Azure Red Hat OpenShift (ARO) cluster

<!--
Need introduction here. Describe what confidential containers are, they're benefits, etc. Describe the main components of it. Describe how you need to deploy sandboxed containers first. In other words, describe the basic installation steps required.

-->

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
    

