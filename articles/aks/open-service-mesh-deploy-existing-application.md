---
title: Onboard applications to Open Service Mesh
description: How to onboard an application to Open Service Mesh
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.author: pgibson
---

# Onboarding applications to Open Service Mesh (OSM) Azure Kubernetes Service (AKS) add-on

The following guide describes how to onboard a kubernetes microservice to OSM.

## Before you begin

The steps detailed in this walk-through assume that you've previously enabled the OSM AKS add-on for your AKS cluster. If not, review the article [Deploy the OSM AKS add-on](./open-service-mesh-deploy-addon-az-cli.md) before proceeding. Also, your AKS cluster needs to be version Kubernetes `1.19+` and above, have Kubernetes RBAC enabled, and have established a `kubectl` connection with the cluster (If you need help with any of these items, then see the [AKS quickstart](./kubernetes-walkthrough.md), and have installed the AKS OSM add-on.

You must have the following resources installed:

- The Azure CLI, version 2.20.0 or later
- OSM add-on version v0.11.1 or later
- OSM CLI version v0.11.1 or later

## Verify the Open Service Mesh (OSM) Permissive Traffic Mode Policy

The OSM Permissive Traffic Policy mode is a mode where the [SMI](https://smi-spec.io/) traffic policy enforcement is bypassed. In this mode, OSM automatically discovers services that are a part of the service mesh and programs traffic policy rules on each Envoy proxy sidecar to be able to communicate with these services.

To verify the current permissive traffic mode of OSM for your cluster, run the following command:

```azurecli-interactive
kubectl get meshconfig osm-mesh-config -n kube-system -o jsonpath='{.spec.traffic.enablePermissiveTrafficPolicyMode}{"\n"}'
true
```

If the **enablePermissiveTrafficPolicyMode** is configured to **true**, you can safely onboard your namespaces without any disruption to your service-to-service communications. If the **enablePermissiveTrafficPolicyMode** is configured to **false**, you'll need to ensure you have the correct [SMI](https://smi-spec.io/) traffic access policy manifests deployed. You'll also need to ensure you have a service account representing each service deployed in the namespace. For more detailed information about permissive traffic mode, please visit and read the [Permissive Traffic Policy Mode](https://docs.openservicemesh.io/docs/guides/traffic_management/permissive_mode/) article.

## Onboard applications with Open Service Mesh (OSM) Permissive Traffic Policy configured as True

1. Refer to the [application requirements](https://docs.openservicemesh.io/docs/guides/app_onboarding/prereqs/) guide before onboarding applications.

1. If an application in the mesh needs to communicate with the Kubernetes API server, the user needs to explicitly allow this either by using IP range exclusion or by creating an egress policy.

1. Onboard Kubernetes Namespaces to OSM

    To onboard a namespace containing applications to be managed by OSM, run the `osm namespace add` command:

    ```console
    $ osm namespace add <namespace>
    ```

    By default, the `osm namespace add` command enables automatic sidecar injection for pods in the namespace.

    To disable automatic sidecar injection as a part of enrolling a namespace into the mesh, use `osm namespace add <namespace> --disable-sidecar-injection`.
    Once a namespace has been onboarded, pods can be enrolled in the mesh by configuring automatic sidecar injection. See the [Sidecar Injection](https://docs.openservicemesh.io/docs/guides/app_onboarding/sidecar_injection/) document for more details.

1.  Deploy new applications or redeploy existing applications

    By default, new deployments in onboarded namespaces are enabled for automatic sidecar injection. This means that when a new pod is created in a managed namespace, OSM will automatically inject the sidecar proxy to the Pod.
    Existing deployments need to be restarted so that OSM can automatically inject the sidecar proxy upon Pod re-creation. Pods managed by a deployment can be restarted using the `kubectl rollout restart deploy` command.

    In order to route protocol specific traffic correctly to service ports, configure the application protocol to use. Refer to the [application protocol selection guide](https://docs.openservicemesh.io/docs/guides/app_onboarding/app_protocol_selection/) to learn more.


## Onboard existing deployed applications with Open Service Mesh (OSM) Permissive Traffic Policy configured as False

When the OSM configuration for the permissive traffic policy is set to `false`, OSM will require explicit [SMI](https://smi-spec.io/) traffic access policies deployed for the service-to-service communication to happen within your cluster. Since OSM uses Kubernetes service accounts to implement access control policies between applications in the mesh, apply [SMI](https://smi-spec.io/) traffic access policies to authorize traffic flow between applications.

For example SMI policies, please see the following examples:
    - [demo/deploy-traffic-specs.sh](https://github.com/openservicemesh/osm/blob/release-v0.11/demo/deploy-traffic-specs.sh)
    - [demo/deploy-traffic-split.sh](https://github.com/openservicemesh/osm/blob/release-v0.11/demo/deploy-traffic-split.sh)
    - [demo/deploy-traffic-target.sh](https://github.com/openservicemesh/osm/blob/release-v0.11/demo/deploy-traffic-target.sh)


#### Removing Namespaces
Namespaces can be removed from the OSM mesh with the `osm namespace remove` command:

```console
$ osm namespace remove <namespace>
```

> [!NOTE]
>
> - The **`osm namespace remove`** command only tells OSM to stop applying updates to the sidecar proxy configurations in the namespace. It **does not** remove the proxy sidecars. This means the existing proxy configuration will continue to be used, but it will not be updated by the OSM control plane. If you wish to remove the proxies from all pods, remove the pods' namespaces from the mesh using OSM LCI and redeploy the corresponding pods or deployments.
