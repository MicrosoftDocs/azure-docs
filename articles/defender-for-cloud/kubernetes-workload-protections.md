---
title: Kubernetes data plane hardening
description: Learn how to use Microsoft Defender for Cloud's set of Kubernetes data plane hardening security recommendations
ms.topic: how-to
author: dcurwin
ms.author: dacurwin
ms.custom: ignite-2022
ms.date: 09/04/2023
---

# Protect your Kubernetes data plane hardening

This page describes how to use Microsoft Defender for Cloud's set of security recommendations dedicated to Kubernetes data plane hardening.

> [!TIP]
> For a list of the security recommendations that might appear for Kubernetes clusters and nodes, see the [Container recommendations](recommendations-reference.md#container-recommendations) section of the recommendations reference table.

## Set up your workload protection

Microsoft Defender for Cloud includes a bundle of recommendations that are available once you've installed the **[Azure Policy for Kubernetes](defender-for-cloud-glossary.md#azure-policy-for-kubernetes)**.

## Prerequisites

- Add the [Required FQDN/application rules for Azure policy](../aks/outbound-rules-control-egress.md#azure-policy).
- (For non AKS clusters) [Connect an existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).

## Enable Kubernetes data plane hardening

You can enable the Azure Policy for Kubernetes by one of two ways:

- Enable for all current and future clusters using plan/connector settings
  - [Enabling for Azure subscriptions or on-premises](#enabling-for-azure-subscriptions-or-on-premises)
  - [Enabling for GCP projects](#enabling-for-gcp-projects)
- [Deploy Azure Policy for Kubernetes on existing clusters](#deploy-azure-policy-for-kubernetes-on-existing-clusters)

### Enable Azure Policy for Kubernetes for all current and future clusters using plan/connector settings

> [!NOTE]
> When you enable this setting, the Azure Policy for Kubernetes pods are installed on the cluster. Doing so allocates a small amount of CPU and memory for the pods to use. This allocation might reach maximum capacity, but it doesn't affect the rest of the CPU and memory on the resource.

> [!NOTE]
> Enablement for AWS via the connector is not supported due to a limitation in EKS that requires the cluster admin to add permissions for a new IAM role on the cluster itself.

#### Enabling for Azure subscriptions or on-premises

When you enable Microsoft Defender for Containers, the "Azure Policy for Kubernetes" setting is enabled by default for the Azure Kubernetes Service, and for Azure Arc-enabled Kubernetes clusters in the relevant subscription. If you disable the setting on initial configuration, you can enable it afterwards manually.

If you disabled the "Azure Policy for Kubernetes" settings under the containers plan, you can follow the below steps to enable it across all clusters in your subscription:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, ensure that Containers is toggled to **On**.

1. Select **Settings**.

    :::image type="content" source="media/kubernetes-workload-protections/containers-settings.png" alt-text="Screenshot showing the settings button in the Defender plan." lightbox="media/kubernetes-workload-protections/containers-settings.png":::

1. In the Settings & Monitoring page, toggle the "Azure Policy for Kubernetes" to **On**.

      :::image type="content" source="media/kubernetes-workload-protections/toggle-on-extensions.png" alt-text="Screenshot showing the toggles used to enable or disable the extensions." lightbox="media/kubernetes-workload-protections/toggle-on-extensions.png":::

#### Enabling for GCP projects

When you enable Microsoft Defender for Containers on a GCP connector, the "Azure Policy Extension for Azure Arc" setting is enabled by default for the Google Kubernetes Engine in the relevant project. If you disable the setting on initial configuration, you can enable it afterwards manually.

If you disabled the "Azure Policy Extension for Azure Arc" settings under the GCP connector, you can follow the below steps to [enable it on your GCP connector](defender-for-containers-enable.md?tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-gke&preserve-view=true#protect-google-kubernetes-engine-gke-clusters).

### Deploy Azure Policy for Kubernetes on existing clusters  

You can manually configure the Azure Policy for Kubernetes on existing Kubernetes clusters through the Recommendations page. Once enabled, the hardening recommendations become available (some of the recommendations require another configuration to work).

> [!NOTE]
> For AWS it isn't possible to do onboarding at scale using the connector, but it can be installed on all existing clusters or on specific clusters using the recommendation [Azure Arc-enabled Kubernetes clusters should have the Azure policy extension for Kubernetes extension installed](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/0642d770-b189-42ef-a2ce-9dcc3ec6c169/subscriptionIds~/%5B%22212f9889-769e-45ae-ab43-6da33674bd26%22%2C%2204cd6fff-ef34-415e-b907-3c90df65c0e5%22%5D/showSecurityCenterCommandBar~/false/assessmentOwners~/null).

**To deploy the** **Azure Policy for Kubernetes** **to specified clusters**:

1. From the recommendations page, search for the relevant recommendation:

   - **Azure -** `"Azure Kubernetes Service clusters should have the Azure Policy add-on for Kubernetes installed"`
   - **GCP** - `"GKE clusters should have the Azure Policy extension"`.
   - **AWS and On-premises** - `"Azure Arc-enabled Kubernetes clusters should have the Azure policy extension for Kubernetes extension installed"`.
           :::image type="content" source="./media/kubernetes-workload-protections/azure-kubernetes-service-clusters-recommendation.png" alt-text="Screenshot showing the Azure Kubernetes service clusters recommendation." lightbox="media/kubernetes-workload-protections/azure-kubernetes-service-clusters-recommendation.png":::

      > [!TIP]
      > The recommendation is included in different security controls, and it doesn't matter which one you select in the next step.

1. From any of the security controls, select the recommendation to see the resources on which you can install the add-on.

1. Select the relevant cluster, and select **Remediate**.

    :::image type="content" source="./media/kubernetes-workload-protections/azure-kubernetes-service-clusters-recommendation-remediation.png" alt-text="Screenshot that shows how to select the cluster to remediate." lightbox="media/kubernetes-workload-protections/azure-kubernetes-service-clusters-recommendation-remediation.png":::

## View and configure the bundle of recommendations

Approximately 30 minutes after the Azure Policy for Kubernetes installation completes, Defender for Cloud shows the clusters’ health status for the following recommendations, each in the relevant security control as shown:

> [!NOTE]
> If you're installing the Azure Policy for Kubernetes for the first time, these recommendations will appear as new additions in the list of recommendations.

> [!TIP]
> Some recommendations have parameters that must be customized via Azure Policy to use them effectively. For example, to benefit from the recommendation **Container images should be deployed only from trusted registries**, you'll have to define your trusted registries. If you don't enter the necessary parameters for the recommendations that require configuration, your workloads will be shown as unhealthy.

| Recommendation name | Security Control | Configuration required |
|---------------------|--------------------|------------------------|
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

For recommendations with parameters that need to be customized, you need to set the parameters:

**To set the parameters**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select the relevant subscription.

1. From Defender for Cloud's menu, select **Security policy**.

1. Select the relevant assignment. The default assignment is `ASC default`.

1. Open the **Parameters** tab and modify the values as required.

    :::image type="content" source="media/kubernetes-workload-protections/containers-parameter-requires-configuration.png" alt-text="Screenshot showing where to modify the parameters for one of the recommendations in the Kubernetes data plane hardening protection bundle." lightbox="media/kubernetes-workload-protections/containers-parameter-requires-configuration.png":::

1. Select **Review + save**.

1. Select **Save**.

**To enforce any of the recommendations**:

1. Open the recommendation details page and select **Deny**:

    :::image type="content" source="./media/defender-for-kubernetes-usage/enforce-workload-protection-example.png" alt-text="Screenshot showing the Deny option for Azure Policy parameter." lightbox="media/defender-for-kubernetes-usage/enforce-workload-protection-example.png":::

    The pane to set the scope opens.

1. Set the scope and select **Change to deny**.

**To see which recommendations apply to your clusters**:

1. Open Defender for Cloud's [asset inventory](asset-inventory.md) page and set the resource type filter to **Kubernetes services**.

1. Select a cluster to investigate and review the available recommendations available for it.

When you view a recommendation from the workload protection set, the number of affected pods ("Kubernetes components") is listed alongside the cluster. For a list of the specific pods, select the cluster and then select **Take action**.

:::image type="content" source="./media/defender-for-kubernetes-usage/view-affected-pods-for-recommendation.gif" alt-text="Screenshot showing where to view the affected pods for a Kubernetes recommendation.":::

**To test the enforcement, use the two Kubernetes deployments below**:

- One is for a healthy deployment, compliant with the bundle of workload protection recommendations.

- The other is for an unhealthy deployment, noncompliant with *any* of the recommendations.

Deploy the example .yaml files as-is, or use them as a reference to remediate your own workload.  

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

For related material, see the following pages:

- [Defender for Cloud recommendations for compute](recommendations-reference.md#recs-compute)
- [Alerts for AKS cluster level](alerts-reference.md#alerts-k8scluster)
