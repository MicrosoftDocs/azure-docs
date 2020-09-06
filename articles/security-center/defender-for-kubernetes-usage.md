---
title: How to use Azure Defender for Kubernetes
description: Learn about using Azure Defender for Kubernetes to defend your containerized workloads
author: memildin
ms.author: memildin
ms.date: 9/12/2020
ms.topic: conceptual
ms.service: security-center
manager: rkarlin

---

# Use Azure Defender for Kubernetes to defend your containerized workloads

Enable **Azure Defender for Kubernetes** in Azure Security Center to gain deeper visibility into your AKS nodes, cloud traffic, and security controls.

Together, Azure Security Center and AKS form the best cloud-native Kubernetes security offering.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|Generally Available|
|Pricing:|Requires **Azure Defender for Kubernetes**|
|Required roles and permissions:|**Security admin** can dismiss alerts.<br>**Security reader** can view findings.|
|Clouds:|![Yes](./media/icons/yes-icon.png) Commercial clouds<br>![No](./media/icons/no-icon.png) National/Sovereign (US Gov, China Gov, Other Gov)|
|||



## Harden your containers' Docker hosts

Security Center constantly monitors the configuration of your Docker hosts, and generates security recommendations that reflect industry standards.

To view Azure Security Center's security recommendations for your containers' Docker hosts:

1. Open Security Center's [asset inventory](asset-inventory.md) page and use the resource type filter to **Container hosts**.

    ![Container resources filter](media/monitor-container-security/container-resources-filter.png)

1. From the list of your container host machines, select one to investigate further.

    The **Container host information page** opens with details of the host and a list of recommendations.

1. From the recommendations list, select a recommendation to investigate further.

    ![Container host recommendation list](media/monitor-container-security/container-host-rec.png)

1. Optionally, read the description, information, threats, and remediation steps. 

1. Select **Take Action** at the bottom of the page.

    [![Take action button](media/monitor-container-security/host-security-take-action-button.png)](media/monitor-container-security/host-security-take-action.png#lightbox)

    Log Analytics opens with a custom operation ready to run. The default custom query includes a list of all failed rules that were assessed, along with guidelines to help you resolve the issues.

    [![Log Analytics action](media/monitor-container-security/log-analytics-for-action-small.png)](media/monitor-container-security/log-analytics-for-action.png#lightbox)

1. Tweak the query parameters if necessary.

1. When you're sure the command is appropriate and ready for your host, select **Run**.




## Setup workload protection - define and enforce best-practices

Azure Defender for Kubernetes includes a bundle of recommendations that are available when you've installed the **Azure Policy add-on for Kubernetes**.

To configure the bundle, first you must install the add on:

1. From the recommendations page, search for the recommendation named **Azure Policy add-on for Kubernetes should be installed and enabled on your clusters**.

    :::image type="content" source="./media/defender-for-kubernetes-usage/recommendation-to-install-azure-policy-add-on-for-kubernetes.png" alt-text="Recommendation "Azure Policy add-on for Kubernetes should be installed and enabled on your clusters":::

    > [!TIP]
    > Notice that the recommendation is included in five different security controls. 

1. From any of the security controls, select the recommendation to see the resources on which you can install the add on, and select **Remediate**. 

    :::image type="content" source="./media/defender-for-kubernetes-usage/recommendation-to-install-azure-policy-add-on-for-kubernetes-details.png" alt-text="Recommendation details page for "Azure Policy add-on for Kubernetes should be installed and enabled on your clusters":::

1. Approximately 30 minutes after the add-on installation completes, Security Center shows the clusters’ health status for the following recommendations, each in the relevant security control as shown:

    > [!TIP]
    > Some recommendations have parameters must be customized via Azure Policy to use them effectively. For example, to benefit from the recommendation **Container images should be deployed only from trusted registries**, you'll have to define your trusted registries.
    > 
    > If you don't enter the necessary parameters for the recommendations that require configuration, your workloads will be shown as unhealthy.

    | Recommendation name                                                                   | Security control                         | Configuration required |
    |---------------------------------------------------------------------------------------|------------------------------------------|------------------------|
    | Container CPU and memory limits should be enforced (preview)                          | Protect applications against DDoS attack | No                     |
    | Privileged containers should be avoided (preview)                                     | Manage access and permissions            | No                     |
    | Immutable (read-only) root filesystem should be enforced for containers (preview)     | Manage access and permissions            | No                     |
    | Container with privilege escalation should be avoided (preview)                       | Manage access and permissions            | No                     |
    | Running containers as root user should be avoided (preview)                           | Manage access and permissions            | No                     |
    | Containers sharing sensitive host namespaces should be avoided (preview)              | Manage access and permissions            | No                     |
    | Least privileged Linux capabilities should be enforced for containers (preview)       | Manage access and permissions            | **Yes**                |
    | Usage of pod HostPath volume mounts should be restricted to a known list (preview)    | Manage access and permissions            | **Yes**                |
    | Containers should listen on allowed ports only (preview)                              | Restrict unauthorized network access     | **Yes**                |
    | Services should listen on allowed ports only (preview)                                | Restrict unauthorized network access     | **Yes**                |
    | Usage of host networking and ports should be restricted (preview)                     | Restrict unauthorized network access     | **Yes**                |
    | Overriding or disabling of containers AppArmor profile should be restricted (preview) | Remediate security configurations        | **Yes**                |
    | Container images should be deployed only from trusted registries (preview)            | Remediate vulnerabilities                | **Yes**                |


1. For the recommendations with parameters must be customized, set the parameters:

    1. From Security Center's menu, select **Security policy**.
    1. Select the relevant subscription.
    1. From the **Security Center default policy** section, select **View effective policy**.
    1. Select "ASC Default".
    1. Open the **Parameters** tab and modify the values as required.
    1. Select **Review + save**.
    1. Select **Save**.


1. To enforce any of the recommendations, set it **Deny** in Security Center's Security Policy **Parameters** tab:

    :::image type="content" source="./media/defender-for-kubernetes-usage/enforce-workload-protection-example.png" alt-text="Recommendation details page for "Azure Policy add-on for Kubernetes should be installed and enabled on your clusters":::

    This will deny any non-compliant request to your AKS clusters

1. To see which recommendations apply to your clusters:

    1. Open Security Center's [asset inventory](asset-inventory.md) page and use the resource type filter to **Kubernetes services**.

    1. Select a cluster to investigate and review the available recommendations available for it. 

1. When viewing a recommendation from the workload protection set, you'll see the number of affected pods ("Kubernetes components") listed alongside the cluster. For a list of the specific pods, select the cluster and then select **Take action**.

    :::image type="content" source="./media/defender-for-kubernetes-usage/view-affected-pods-for-recommendation.gif" alt-text="Viewing the affected pods for a K8s recommendation"::: 

1. To test the enforcement, use the two Kubernetes deployments below:

    - One is for a healthy deployment, compliant with the bundle of workload protection recommendations.
    - The other is for an unhealthy deployment, non-compliant with *any* of the recommendations.

    Deploy the example .yaml files as-is, or use them as a reference to remediate your own workload (step VIII)  


### Healthy deployment example .yaml file

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

### Unhealthy deployment example .yaml file

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



- [Data management at Microsoft](https://www.microsoft.com/trust-center/privacy/data-management) - Describes the data policies of Microsoft services (including Azure, Intune, and Microsoft 365), details of Microsoft's data management, and the retention policies that affect your data