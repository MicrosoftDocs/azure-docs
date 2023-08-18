---
title: Configure Live Data in Container insights
description: This article describes how to set up the real-time view of container logs (stdout/stderr) and events without using kubectl with Container insights.
ms.topic: conceptual
ms.date: 05/24/2022
ms.custom: references_regions
ms.reviewer: aul
---

# Configure Live Data in Container insights

To view live data with Container insights from Azure Kubernetes Service (AKS) clusters, configure authentication to grant permission to access your Kubernetes data. This security configuration allows real-time access to your data through the Kubernetes API directly in the Azure portal.

This feature supports the following methods to control access to logs, events, and metrics:

- AKS without Kubernetes role-based access control (RBAC) authorization enabled
- AKS enabled with Kubernetes RBAC authorization
    - AKS configured with the cluster role binding [clusterMonitoringUser](/rest/api/aks/managedclusters/listclustermonitoringusercredentials)
- AKS enabled with Azure Active Directory (Azure AD) SAML-based single sign-on

These instructions require administrative access to your Kubernetes cluster. If you're configuring to use Azure AD for user authentication, you also need administrative access to Azure AD.

This article explains how to configure authentication to control access to the Live Data feature from the cluster:

- Kubernetes RBAC-enabled AKS cluster
- Azure AD-integrated AKS cluster

## Authentication model

The Live Data feature uses the Kubernetes API, which is identical to the `kubectl` command-line tool. The Kubernetes API endpoints use a self-signed certificate, which your browser will be unable to validate. This feature uses an internal proxy to validate the certificate with the AKS service, ensuring the traffic is trusted.

The Azure portal prompts you to validate your sign-in credentials for an Azure AD cluster. It redirects you to the client registration setup during cluster creation (and reconfigured in this article). This behavior is similar to the authentication process required by `kubectl`.

>[!NOTE]
>Authorization to your cluster is managed by Kubernetes and the security model it's configured with. Users who access this feature require permission to download the Kubernetes configuration (*kubeconfig*), which is similar to running `az aks get-credentials -n {your cluster name} -g {your resource group}`.
>
>This configuration file contains the authorization and authentication token for the *Azure Kubernetes Service Cluster User Role*, in the case of Azure RBAC enabled and AKS clusters without Kubernetes RBAC authorization enabled. It contains information about Azure AD and client registration details when AKS is enabled with Azure AD SAML-based single sign-on.

Users of this feature require the [Azure Kubernetes Cluster User Role](../../role-based-access-control/built-in-roles.md) to access the cluster to download the `kubeconfig` and use this feature. Users do *not* require contributor access to the cluster to use this feature.

## Use clusterMonitoringUser with Kubernetes RBAC-enabled clusters

To eliminate the need to apply more configuration changes to allow the Kubernetes user role binding **clusterUser** access to the Live Data feature after [enabling Kubernetes RBAC](#configure-kubernetes-rbac-authorization) authorization, AKS has added a new Kubernetes cluster role binding called **clusterMonitoringUser**. This cluster role binding has all the necessary permissions out of the box to access the Kubernetes API and the endpoints for using the Live Data feature.

To use the Live Data feature with this new user, you must be a member of the [Azure Kubernetes Service Cluster User](../../role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role) or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role on the AKS cluster resource. Container insights, when enabled, is configured to authenticate by using `clusterMonitoringUser` by default. If the `clusterMonitoringUser` role binding doesn't exist on a cluster, **clusterUser** is used for authentication instead. Contributor gives you access to `clusterMonitoringUser` (if it exists), and Azure Kubernetes Service Cluster User gives you access to **clusterUser**. Any of these two roles give sufficient access to use this feature.

AKS released this new role binding in January 2020, so clusters created before January 2020 don't have it. If you have a cluster that was created before January 2020, the new **clusterMonitoringUser** can be added to an existing cluster by performing a PUT operation on the cluster. Or you can perform any other operation on the cluster that performs a PUT operation on the cluster, such as updating the cluster version.

## Kubernetes cluster without Kubernetes RBAC enabled

If you have a Kubernetes cluster that isn't configured with Kubernetes RBAC authorization or integrated with Azure AD single sign-on, you don't need to follow these steps. You already have administrative permissions by default in a non-RBAC configuration.

## Configure Kubernetes RBAC authorization

When you enable Kubernetes RBAC authorization, **clusterUser** and **clusterAdmin** are used to access the Kubernetes API. This configuration is similar to running `az aks get-credentials -n {cluster_name} -g {rg_name}` without the administrative option. For this reason, **clusterUser** needs to be granted access to the endpoints in the Kubernetes API.

The following example steps demonstrate how to configure cluster role binding from this YAML configuration template.

1. Copy and paste the YAML file and save it as **LogReaderRBAC.yaml**.

    ```
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRole
    metadata:
       name: containerHealth-log-reader
    rules:
        - apiGroups: ["", "metrics.k8s.io", "extensions", "apps"]
          resources:
             - "pods/log"
             - "events"
             - "nodes"
             - "pods"
             - "deployments"
             - "replicasets"
          verbs: ["get", "list"]
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
       name: containerHealth-read-logs-global
    roleRef:
       kind: ClusterRole
       name: containerHealth-log-reader
       apiGroup: rbac.authorization.k8s.io
    subjects:
    - kind: User
      name: clusterUser
      apiGroup: rbac.authorization.k8s.io
    ```

1. To update your configuration, run the command `kubectl apply -f LogReaderRBAC.yaml`.

>[!NOTE]
> If you've applied a previous version of the **LogReaderRBAC.yaml** file to your cluster, update it by copying and pasting the new code shown in step 1. Then run the command shown in step 2 to apply it to your cluster.

## Configure Azure AD-integrated authentication

An AKS cluster configured to use Azure AD for user authentication uses the sign-in credentials of the person accessing this feature. In this configuration, you can sign in to an AKS cluster by using your Azure AD authentication token.

Azure AD client registration must be reconfigured to allow the Azure portal to redirect authorization pages as a trusted redirect URL. Users from Azure AD are then granted access directly to the same Kubernetes API endpoints through **ClusterRoles** and **ClusterRoleBindings**.

For more information on advanced security setup in Kubernetes, review the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/).

>[!NOTE]
>If you're creating a new Kubernetes RBAC-enabled cluster, see [Integrate Azure Active Directory with Azure Kubernetes Service](../../aks/azure-ad-integration-cli.md) and follow the steps to configure Azure AD authentication. During the steps to create the client application, a note in that section highlights the two redirect URLs you need to create for Container insights matching those specified in step 3.

### Client registration reconfiguration

1. Locate the client registration for your Kubernetes cluster in Azure AD under **Azure Active Directory** > **App registrations** in the Azure portal.

1. On the left pane, select **Authentication**.

1. Add two redirect URLs to this list as **Web** application types. The first base URL value should be `https://afd.hosting.portal.azure.net/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`. The second base URL value should be `https://monitoring.hosting.portal.azure.net/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`.

    >[!NOTE]
    >If you're using this feature in Microsoft Azure operated by 21Vianet, the first base URL value should be `https://afd.hosting.azureportal.chinaloudapi.cn/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`. The second base URL value should be `https://monitoring.hosting.azureportal.chinaloudapi.cn/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`.

1. After you register the redirect URLs, under **Implicit grant**, select the options **Access tokens** and **ID tokens**. Then save your changes.

You can configure authentication with Azure AD for single sign-on only during initial deployment of a new AKS cluster. You can't configure single sign-on for an AKS cluster that's already deployed.

>[!IMPORTANT]
>If you reconfigured Azure AD for user authentication by using the updated URI, clear your browser's cache to ensure the updated authentication token is downloaded and applied.

## Grant permission

Each Azure AD account must be granted permission to the appropriate APIs in Kubernetes to access the Live Data feature. The steps to grant the Azure AD account are similar to the steps described in the [Kubernetes RBAC authentication](#configure-kubernetes-rbac-authorization) section. Before you apply the YAML configuration template to your cluster, replace **clusterUser** under **ClusterRoleBinding** with the desired user.

>[!IMPORTANT]
>If the user you grant the Kubernetes RBAC binding for is in the same Azure AD tenant, assign permissions based on `userPrincipalName`. If the user is in a different Azure AD tenant, query for and use the `objectId` property.

For more help in configuring your AKS cluster **ClusterRoleBinding**, see [Create Kubernetes RBAC binding](../../aks/azure-ad-integration-cli.md#create-kubernetes-rbac-binding).

## Next steps

Now that you've set up authentication, you can view [metrics](container-insights-livedata-metrics.md) and [events and logs](container-insights-livedata-overview.md) in real time from your cluster.
