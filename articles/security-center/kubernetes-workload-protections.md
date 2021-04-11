---
title: Workload protections for your Kubernetes workloads
description: Learn how to use Azure Security Center's set of Kubernetes workload protection security recommendations
services: security-center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: how-to
ms.date: 03/17/2021
ms.author: memildin
---


# Protect your Kubernetes workloads

This page describes how to use Azure Security Center's set of security recommendations dedicated to Kubernetes workload protection.

Learn more about these features in [Workload protection best-practices using Kubernetes admission control](container-security.md#workload-protection-best-practices-using-kubernetes-admission-control)

Security Center offers more container security features if you enable Azure Defender. Specifically:

- Scan your container registries for vulnerabilities with [Azure Defender for container registries](defender-for-container-registries-introduction.md)
- Get real-time threat detection alerts for your K8s clusters [Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)

> [!TIP]
> For a list of *all* security recommendations that might appear for Kubernetes clusters and nodes, see the [compute section](recommendations-reference.md#recs-compute) of the recommendations reference table.



## Availability

|Aspect|Details|
|----|:----|
|Release state:|General Availability (GA)|
|Pricing:|Free|
|Required roles and permissions:|**Owner** or **Security admin** to edit an assignment<br>**Reader** to view the recommendations|
|Environment requirements:|Kubernetes v1.14 (or higher) is required<br>No PodSecurityPolicy resource (old PSP model) on the clusters<br>Windows nodes are not supported|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![Yes](./media/icons/yes-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||


## Set up your workload protection

Azure Security Center includes a bundle of recommendations that are available when you've installed the **Azure Policy add-on for Kubernetes**.

### Step 1: Deploy the add-on

To configure the recommendations, install the  **Azure Policy add-on for Kubernetes**. 

- You can auto deploy this add-on as explained in [Enable auto provisioning of the Log Analytics agent and extensions](security-center-enable-data-collection.md#auto-provision-mma). When auto provisioning for the add-on is set to "on", the extension is enabled by default in all existing and future clusters (that meet the add-on installation requirements).

    :::image type="content" source="media/defender-for-kubernetes-usage/policy-add-on-auto-provision.png" alt-text="Using Security Center's auto provisioning tool to install the policy add-on for Kubernetes":::

- To manually deploy the add-on:

    1. From the recommendations page, search for the recommendation "**Azure Policy add-on for Kubernetes should be installed and enabled on your clusters**". 

        :::image type="content" source="./media/defender-for-kubernetes-usage/recommendation-to-install-policy-add-on-for-kubernetes.png" alt-text="Recommendation **Azure Policy add-on for Kubernetes should be installed and enabled on your clusters**":::

        > [!TIP]
        > The recommendation is included in five different security controls and it doesn't matter which one you select in the next step.

    1. From any of the security controls, select the recommendation to see the resources on which you can install the add-on.
    1. Select the relevant cluster, and **Remediate**.

        :::image type="content" source="./media/defender-for-kubernetes-usage/recommendation-to-install-policy-add-on-for-kubernetes-details.png" alt-text="Recommendation details page for **Azure Policy add-on for Kubernetes should be installed and enabled on your clusters**":::

### Step 2: View and configure the bundle of 13 recommendations

1. Approximately 30 minutes after the add-on installation completes, Security Center shows the clusters’ health status for the following recommendations, each in the relevant security control as shown:

    > [!TIP]
    > Some recommendations have parameters that must be customized via Azure Policy to use them effectively. For example, to benefit from the recommendation **Container images should be deployed only from trusted registries**, you'll have to define your trusted registries.
    > 
    > If you don't enter the necessary parameters for the recommendations that require configuration, your workloads will be shown as unhealthy.

    | Recommendation name                                                         | Security control                         | Configuration required |
    |-----------------------------------------------------------------------------|------------------------------------------|------------------------|
    | Container CPU and memory limits should be enforced                          | Protect applications against DDoS attack | No                     |
    | Privileged containers should be avoided                                     | Manage access and permissions            | No                     |
    | Immutable (read-only) root filesystem should be enforced for containers     | Manage access and permissions            | No                     |
    | Container with privilege escalation should be avoided                       | Manage access and permissions            | No                     |
    | Running containers as root user should be avoided                           | Manage access and permissions            | No                     |
    | Containers sharing sensitive host namespaces should be avoided              | Manage access and permissions            | No                     |
    | Least privileged Linux capabilities should be enforced for containers       | Manage access and permissions            | **Yes**                |
    | Usage of pod HostPath volume mounts should be restricted to a known list    | Manage access and permissions            | **Yes**                |
    | Containers should listen on allowed ports only                              | Restrict unauthorized network access     | **Yes**                |
    | Services should listen on allowed ports only                                | Restrict unauthorized network access     | **Yes**                |
    | Usage of host networking and ports should be restricted                     | Restrict unauthorized network access     | **Yes**                |
    | Overriding or disabling of containers AppArmor profile should be restricted | Remediate security configurations        | **Yes**                |
    | Container images should be deployed only from trusted registries            | Remediate vulnerabilities                | **Yes**                |
    |||


1. For the recommendations with parameters must be customized, set the parameters:

    1. From Security Center's menu, select **Security policy**.
    1. Select the relevant subscription.
    1. From the **Security Center default policy** section, select **View effective policy**.
    1. Select "ASC Default".
    1. Open the **Parameters** tab and modify the values as required.
    1. Select **Review + save**.
    1. Select **Save**.


1. To enforce any of the recommendations, 

    1. Open the recommendation details page and select **Deny**:

        :::image type="content" source="./media/defender-for-kubernetes-usage/enforce-workload-protection-example.png" alt-text="Deny option for Azure Policy parameter":::

        This will open the pane where you set the scope. 

    1. When you've set the scope, select **Change to deny**.

1. To see which recommendations apply to your clusters:

    1. Open Security Center's [asset inventory](asset-inventory.md) page and use the resource type filter to **Kubernetes services**.

    1. Select a cluster to investigate and review the available recommendations available for it. 

1. When viewing a recommendation from the workload protection set, you'll see the number of affected pods ("Kubernetes components") listed alongside the cluster. For a list of the specific pods, select the cluster and then select **Take action**.

    :::image type="content" source="./media/defender-for-kubernetes-usage/view-affected-pods-for-recommendation.gif" alt-text="Viewing the affected pods for a K8s recommendation"::: 

1. To test the enforcement, use the two Kubernetes deployments below:

    - One is for a healthy deployment, compliant with the bundle of workload protection recommendations.
    - The other is for an unhealthy deployment, non-compliant with *any* of the recommendations.

    Deploy the example .yaml files as-is, or use them as a reference to remediate your own workload (step VIII)  


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
        apparmor.security.beta.kubernetes.io/pod: runtime/default
        container.apparmor.security.beta.kubernetes.io/redis: runtime/default
    spec:
      containers:
      - name: redis
        image: healthyClusterRegistry.azurecr.io/redis:latest
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
  name: nginx-unhealthy-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:      
      labels:
        app: nginx
    spec:
      hostNetwork: true
      hostPID: true 
      hostIPC: true
      containers:
      - name: nginx
        image: nginx:1.15.2
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
  name: nginx-unhealthy-service
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - port: 6001
    targetPort: 9001
```



## Next steps

In this article, you learned how to configure Kubernetes workload protection. 

For other related material, see the following pages: 

- [Security Center recommendations for compute](recommendations-reference.md#recs-compute)
- [Alerts for AKS cluster level](alerts-reference.md#alerts-akscluster)
- [Alerts for Container host level](alerts-reference.md#alerts-containerhost)