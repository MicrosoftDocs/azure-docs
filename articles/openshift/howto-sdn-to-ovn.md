---
title: Migrate from OpenShift SDN to OVN-Kubernetes
description: Discover how to migrate from OpenShift SDN to OVN-Kubernetes.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.date: 02/17/2025
---

# Migrate from OpenShift SDN to OVN-Kubernetes

OpenShift SDN, a component of Red Hat OpenShift Networking, is a network plugin that uses software-defined networking (SDN) to create a unified network for your cluster. This network allows communication between pods across the OpenShift Container Platform. OpenShift SDN manages this network by configuring an overlay network using Open vSwitch (OVS).

OpenShift SDN has been deprecated since version 4.14 and will no longer be supported starting with version 4.17. Therefore, if your cluster is using OpenShift SDN, you must migrate to OVN-Kubernetes before upgrading to any minor OpenShift version beyond 4.16.

## Migrating to OVN-Kubernetes for Azure Red Hat OpenShift

If your Azure Red Hat OpenShift (ARO) cluster is using the OpenShift SDN network plugin, you must migrate to the OVN-Kubernetes plugin before updating to version 4.17.

OVN-Kuberentes has been the default network plugin starting with ARO version 4.11. If you installed your cluster with version 4.11 or later, you likely don't need to perform a migration.

OpenShift SDN remains supported on Azure Red Hat OpenShift through version 4.16. See the [Azure Red Hat OpenShift release calendar](support-lifecycle.md#azure-red-hat-openshift-release-calendar) for end-of-life dates.

1. To determine which network plugin your cluster currently uses, run the following command:

    ```
    oc get network.operator.openshift.io cluster -o jsonpath='{.spec.defaultNetwork.type}'
    ```
    
    If you see an output such as `OpenShiftSDN`, proceed to the next step because you'll need to migrate.
   
1. See [Limited live migration to the OVN-Kubernetes network plugin overview](https://docs.openshift.com/container-platform/4.16/networking/ovn_kubernetes_network_provider/migrate-from-openshift-sdn.html#nw-ovn-kubernetes-live-migration-about_migrate-from-openshift-sdn) for steps to perform the migration.

    > [!IMPORTANT]
    > Azure Red Hat OpenShift only supports the limited live migration process. Don't use the offline migration process.
    > 
           
## Next steps

- [Learn more about OVN-Kubernetes network provider](concepts-ovn-kubernetes.md).
- [Learn more about the OVN-Kubernetes network plugin](https://docs.openshift.com/container-platform/4.17/networking/ovn_kubernetes_network_provider/about-ovn-kubernetes.html).
 