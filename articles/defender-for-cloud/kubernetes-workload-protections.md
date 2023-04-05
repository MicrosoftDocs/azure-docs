---
title: Kubernetes data plane hardening
description: Learn how to use Microsoft Defender for Cloud's set of Kubernetes data plane hardening security recommendations
ms.topic: how-to
author: bmansheim
ms.author: benmansheim
ms.custom: ignite-2022
ms.date: 03/08/2022
---

# Protect your Kubernetes data plane hardening

This page describes how to use Microsoft Defender for Cloud's set of security recommendations dedicated to Kubernetes data plane hardening.

> [!TIP]
> For a list of the security recommendations that might appear for Kubernetes clusters and nodes, see the [Container recommendations](recommendations-reference.md#container-recommendations) of the recommendations reference table.

## Set up your workload protection

Microsoft Defender for Cloud includes a bundle of recommendations that are available once you've installed the **Azure Policy add-on for Kubernetes or extensions**.

## Prerequisites

-  Add the [Required FQDN/application rules for Azure policy](../aks/limit-egress-traffic.md#azure-policy).
- (For non AKS clusters) [Connect an existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).

## Enable Kubernetes data plane hardening

When you enable Microsoft Defender for Containers, the "Azure Policy for Kubernetes" setting is enabled by default for the Azure Kubernetes Service, and for Azure Arc-enabled Kubernetes clusters in the relevant subscription. If you disable the setting, you can re-enable it later. Either in the Defender for Containers plan settings, or with  Azure Policy.

When you enable this setting, the Azure Policy for Kubernetes pods are installed on the cluster. This allocates a small amount of CPU and memory for the pods to use. This allocation might reach maximum capacity, but it doesn't affect the rest of the CPU and memory on the resource.

To enable Azure Kubernetes Service clusters and Azure Arc enabled Kubernetes clusters (Preview):

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, ensure that Containers is toggled to **On**.

1. Select **Configure**.

    :::image type="content" source="media/kubernetes-workload-protections/configure-containers.png" alt-text="Screenshot showing where on the defenders plan to go to to select the configure button.":::

1. On the Advanced configuration page, toggle each relevant component to **On**.

    :::image type="content" source="media/kubernetes-workload-protections/advanced-configuration.png" alt-text="Screenshot showing the toggles used to enable or disable them.":::

1. Select **Save**.

## Configure Defender for Containers components

If you disabled any of the default protections when you enabled Microsoft Defender for Containers, you can change the configurations and reenable them.

**To configure the Defender for Containers components**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. In the Monitoring coverage column of the Defender for Containers plan, select **Settings**.

1. Ensure that Microsoft Defenders for Containers components (preview) is toggled to On.

    :::image type="content" source="media/kubernetes-workload-protections/toggled-on.png" alt-text="Screenshot showing that Microsoft Defender for Containers is toggled to on.":::

1. Select **Edit configuration**.

    :::image type="content" source="media/kubernetes-workload-protections/edit-configuration.png" alt-text="Screenshot showing the edit configuration button.":::

1. On the Advanced configuration page, toggle each relevant component to **On**.

    :::image type="content" source="media/kubernetes-workload-protections/toggles.png" alt-text="Screenshot showing each option and the toggles to enable or disable them.":::

1. Select **Confirm**.

## Deploy the add-on to specified clusters

You can manually configure the Kubernetes data plane hardening add-on, or extension protection through the Recommendations page. This can be accomplished by remediating the `Azure Policy add-on for Kubernetes should be installed and enabled on your clusters` recommendation, or `Azure policy extension for Kubernetes should be installed and enabled on your clusters`. 

**To Deploy the add-on to specified clusters**:

1. From the recommendations page, search for the recommendation `Azure Policy add-on for Kubernetes should be installed and enabled on your clusters`, or `Azure policy extension for Kubernetes should be installed and enabled on your clusters`. 

    :::image type="content" source="./media/defender-for-kubernetes-usage/recommendation-to-install-policy-add-on-for-kubernetes.png" alt-text="Recommendation **Azure Policy add-on for Kubernetes should be installed and enabled on your clusters**.":::

   > [!TIP]
   > The recommendation is included in five different security controls and it doesn't matter which one you select in the next step.

1. From any of the security controls, select the recommendation to see the resources on which you can install the add-on.

1. Select the relevant cluster, and **Remediate**.

    :::image type="content" source="./media/defender-for-kubernetes-usage/recommendation-to-install-policy-add-on-for-kubernetes-details.png" alt-text="Recommendation details page for Azure Policy add-on for Kubernetes should be installed and enabled on your clusters.":::

## View and configure the bundle of recommendations

1. Approximately 30 minutes after the add-on installation completes, Defender for Cloud shows the clusters’ health status for the following recommendations, each in the relevant security control as shown:

    > [!NOTE]
    > If you're installing the add-on for the first time, these recommendations will appear as new additions in the list of recommendations. 

    > [!TIP]
    > Some recommendations have parameters that must be customized via Azure Policy to use them effectively. For example, to benefit from the recommendation **Container images should be deployed only from trusted registries**, you'll have to define your trusted registries.
    > 
    > If you don't enter the necessary parameters for the recommendations that require configuration, your workloads will be shown as unhealthy.

    | Recommendation name                                                         | Security control                         | Configuration required |
    |-----------------------------------------------------------------------------|------------------------------------------|------------------------|
    | Container CPU and memory limits should be enforced                          | Protect applications against DDoS attack | **Yes**                |
    | Container images should be deployed only from trusted registries            | Remediate vulnerabilities                | **Yes**                |
    | Least privileged Linux capabilities should be enforced for containers       | Manage access and permissions            | **Yes**                |
    | Containers should only use allowed AppArmor profiles                        | Remediate security configurations        | **Yes**                |
    | Services should listen on allowed ports only                                | Restrict unauthorized network access     | **Yes**                |
    | Usage of host networking and ports should be restricted                     | Restrict unauthorized network access     | **Yes**                |
    | Usage of pod HostPath volume mounts should be restricted to a known list    | Manage access and permissions            | **Yes**                |
    | Container with privilege escalation should be avoided                       | Manage access and permissions            | No                     |
    | Containers sharing sensitive host namespaces should be avoided              | Manage access and permissions            | No                     |
    | Immutable (read-only) root filesystem should be enforced for containers     | Manage access and permissions            | No                     |
    | Kubernetes clusters should be accessible only over HTTPS                    | Encrypt data in transit                  | No                     |
    | Kubernetes clusters should disable automounting API credentials             | Manage access and permissions            | No                     |
    | Kubernetes clusters should not use the default namespace                    | Implement security best practices        | No                     |
    | Kubernetes clusters should not grant CAPSYSADMIN security capabilities      | Manage access and permissions            | No                     |
    | Privileged containers should be avoided                                     | Manage access and permissions            | No                     |
    | Running containers as root user should be avoided                           | Manage access and permissions            | No                     |


For recommendations with parameters that need to be customized, you will need to set the parameters:

**To set the parameters**:
 
1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. From Defender for Cloud's menu, select **Security policy**.
    
1. Select the relevant assignment. The default assignment is `ASC default`.
    
1. Open the **Parameters** tab and modify the values as required.

    :::image type="content" source="media/kubernetes-workload-protections/containers-parameter-requires-configuration.png" alt-text="Modifying the parameters for one of the recommendations in the Kubernetes data plane hardening protection bundle.":::

1. Select **Review + save**.
    
1. Select **Save**.

**To enforce any of the recommendations**:

1. Open the recommendation details page and select **Deny**:

    :::image type="content" source="./media/defender-for-kubernetes-usage/enforce-workload-protection-example.png" alt-text="Deny option for Azure Policy parameter.":::

    This will open the pane where you set the scope. 

1. When you've set the scope, select **Change to deny**.

**To see which recommendations apply to your clusters**:

1. Open Defender for Cloud's [asset inventory](asset-inventory.md) page and use the resource type filter to **Kubernetes services**.

1. Select a cluster to investigate and review the available recommendations available for it. 

When viewing a recommendation from the workload protection set, you'll see the number of affected pods ("Kubernetes components") listed alongside the cluster. For a list of the specific pods, select the cluster and then select **Take action**.

:::image type="content" source="./media/defender-for-kubernetes-usage/view-affected-pods-for-recommendation.gif" alt-text="Viewing the affected pods for a K8s recommendation."::: 

**To test the enforcement, use the two Kubernetes deployments below**:

- One is for a healthy deployment, compliant with the bundle of workload protection recommendations.

- The other is for an unhealthy deployment, non-compliant with *any* of the recommendations.

Deploy the example .yaml files as-is, or use them as a reference to remediate your own workload (step VIII).  


## Healthy deployment example .yaml file

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-healthy-deployment
  labels:
    app: redis
spec:
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
      annotations:
        container.apparmor.security.beta.kubernetes.io/redis: runtime/default
    spec:
      containers:
      - name: redis
        image: <customer-registry>.azurecr.io/redis:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: 100m
            memory: 250Mi
        securityContext:
          privileged: false
          readOnlyRootFilesystem: true
          allowPrivilegeEscalation: false
          runAsNonRoot: true
          runAsUser: 1000
---
apiVersion: v1
kind: Service
metadata:
  name: redis-healthy-service
spec:
  type: LoadBalancer
  selector:
    app: redis
  ports:
  - port: 80
    targetPort: 80
```

## Unhealthy deployment example .yaml file

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-unhealthy-deployment
  labels:
    app: redis
spec:
  replicas: 3
  selector:
    matchLabels:
      app: redis
  template:
    metadata:      
      labels:
        app: redis
    spec:
      hostNetwork: true
      hostPID: true 
      hostIPC: true
      containers:
      - name: redis
        image: redis:latest
        ports:
        - containerPort: 9001
          hostPort: 9001
        securityContext:
          privileged: true
          readOnlyRootFilesystem: false
          allowPrivilegeEscalation: true
          runAsUser: 0
          capabilities:
            add:
              - NET_ADMIN
        volumeMounts:
        - mountPath: /test-pd
          name: test-volume
          readOnly: true
      volumes:
      - name: test-volume
        hostPath:
          # directory location on host
          path: /tmp
---
apiVersion: v1
kind: Service
metadata:
  name: redis-unhealthy-service
spec:
  type: LoadBalancer
  selector:
    app: redis
  ports:
  - port: 6001
    targetPort: 9001
```



## Next steps

In this article, you learned how to configure Kubernetes data plane hardening. 

For other related material, see the following pages: 

- [Defender for Cloud recommendations for compute](recommendations-reference.md#recs-compute)
- [Alerts for AKS cluster level](alerts-reference.md#alerts-k8scluster)
