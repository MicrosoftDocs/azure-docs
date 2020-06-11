---
title: Set up Azure Monitor for containers Live Data (preview) | Microsoft Docs
description: This article describes how to set up the real-time view of container logs (stdout/stderr) and events without using kubectl with Azure Monitor for containers.
ms.topic: conceptual
ms.date: 02/14/2019
ms.custom: references_regions
---

# How to set up the Live Data (preview) feature

To view Live Data (preview) with Azure Monitor for containers from Azure Kubernetes Service (AKS) clusters, you need to configure authentication to grant permission to access to your Kubernetes data. This security configuration allows real-time access to your data through the Kubernetes API directly in the Azure portal.

This feature supports the following methods to control access to the logs, events, and metrics:

- AKS without Kubernetes RBAC authorization enabled
- AKS enabled with Kubernetes RBAC authorization
    - AKS configured with the cluster role binding **[clusterMonitoringUser](https://docs.microsoft.com/rest/api/aks/managedclusters/listclustermonitoringusercredentials?view=azurermps-5.2.0)**
- AKS enabled with Azure Active Directory (AD) SAML-based single-sign on

These instructions require both administrative access to your Kubernetes cluster, and if configuring to use Azure Active Directory (AD) for user authentication, administrative access to Azure AD.  

This article explains how to configure authentication to control access to the Live Data (preview) feature from the cluster:

- Role-based access control (RBAC) enabled AKS cluster
- Azure Active Directory integrated AKS cluster. 

>[!NOTE]
>AKS clusters enabled as [private clusters](https://azure.microsoft.com/updates/aks-private-cluster/) are not supported with this feature. This feature relies on directly accessing the Kubernetes API through a proxy server from your browser. Enabling networking security to block the Kubernetes API from this proxy will block this traffic. 

>[!NOTE]
>This feature is available in all Azure regions, including Azure China. It is currently not available in Azure US Government.

## Authentication model

The Live Data (preview) features utilizes the Kubernetes API, identical to the `kubectl` command-line tool. The Kubernetes API endpoints utilize a self-signed certificate, which your browser will be unable to validate. This feature utilizes an internal proxy to validate the certificate with the AKS service, ensuring the traffic is trusted.

The Azure portal prompts you to validate your login credentials for an Azure Active Directory cluster, and redirect you to the client registration setup during cluster creation (and re-configured in this article). This behavior is similar to the authentication process required by `kubectl`. 

>[!NOTE]
>Authorization to your cluster is managed by Kubernetes and the security model it is configured with. Users accessing this feature require permission to download the Kubernetes configuration (*kubeconfig*), similar to running `az aks get-credentials -n {your cluster name} -g {your resource group}`. This configuration file contains the authorization and authentication token for **Azure Kubernetes Service Cluster User Role**, in the case of Azure RBAC-enabled and AKS clusters without RBAC authorization enabled. It contains information about Azure AD and client registration details when AKS is enabled with Azure Active Directory (AD) SAML-based single-sign on.

>[!IMPORTANT]
>Users of this features requires [Azure Kubernetes Cluster User Role](../../azure/role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role permissions) to the cluster in order to download the `kubeconfig` and use this feature. Users do **not** require contributor access to the cluster to utilize this feature. 

## Using clusterMonitoringUser with RBAC-enabled clusters

To eliminate the need to apply additional configuration changes to allow the Kubernetes user role binding **clusterUser** access to the Live Data (preview) feature after [enabling RBAC](#configure-kubernetes-rbac-authorization) authorization, AKS has added a new Kubernetes cluster role binding called **clusterMonitoringUser**. This cluster role binding has all the necessary permissions out-of-the-box to access the Kubernetes API and the endpoints for utilizing the Live Data (preview) feature.

In order to utilize the Live Data (preview) feature with this new user, you need to be a member of the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role on the AKS cluster resource. Azure Monitor for containers, when enabled, is configured to authenticate using this user by default. If the clusterMonitoringUser role binding does not exist on a cluster, **clusterUser** is used for authentication instead.

AKS released this new role binding in January 2020, so clusters created before January 2020 do not have it. If you have a cluster that was created before January 2020, the new **clusterMonitoringUser** can be added to an existing cluster by performing a PUT operation on the cluster, or performing any other operation on the cluster tha performs a PUT operation on the cluster, such as updating the cluster version.

## Kubernetes cluster without RBAC enabled

If you have a Kubernetes cluster that is not configured with Kubernetes RBAC authorization or integrated with Azure AD single-sign on, you do not need to follow these steps. This is because you have administrative permissions by default in a non-RBAC configuration.

## Configure Kubernetes RBAC authorization

When you enable Kubernetes RBAC authorization, two users are utilized: **clusterUser** and **clusterAdmin** to access the Kubernetes API. This is similar to running `az aks get-credentials -n {cluster_name} -g {rg_name}` without the administrative option. This means the **clusterUser** needs to be granted access to the end points in Kubernetes API.

The following example steps demonstrate how to configure cluster role binding from this yaml configuration template.

1. Copy and paste the yaml file and save it as LogReaderRBAC.yaml.  

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

2. To update your configuration, run the following command: `kubectl apply -f LogReaderRBAC.yaml`.

>[!NOTE] 
> If you have applied a previous version of the `LogReaderRBAC.yaml` file to your cluster, update it by copying and pasting the new code shown in step 1 above, and then run the command shown in step 2 to apply it to your cluster.

## Configure AD-integrated authentication 

An AKS cluster configured to use Azure Active Directory (AD) for user authentication utilizes the login credentials of the person accessing this feature. In this configuration, you can sign in to an AKS cluster by using your Azure AD authentication token.

Azure AD client registration must be re-configured to allow the Azure portal to redirect authorization pages as a trusted redirect URL. Users from Azure AD are then granted access directly to the same Kubernetes API endpoints through **ClusterRoles** and **ClusterRoleBindings**. 

For more information on advanced security setup in Kubernetes, review the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/). 

>[!NOTE]
>If you are creating a new RBAC-enabled cluster, see [Integrate Azure Active Directory with Azure Kubernetes Service](../../aks/azure-ad-integration.md) and follow the steps to configure Azure AD authentication. During the steps to create the client application, a note in that section highlights the two redirect URLs you need to create for Azure Monitor for containers matching those specified in Step 3 below.

### Client registration reconfiguration

1. Locate the client registration for your Kubernetes cluster in Azure AD under **Azure Active Directory > App registrations** in the Azure portal.

2. Select **Authentication** from the left-hand pane. 

3. Add two redirect URLs to this list as **Web** application types. The first base URL value should be `https://afd.hosting.portal.azure.net/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html` and the second base URL value should be `https://monitoring.hosting.portal.azure.net/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`.

    >[!NOTE]
    >If you're using this feature in Azure China, the first base URL value should be `https://afd.hosting.azureportal.chinaloudapi.cn/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html` and the second base URL value should be `https://monitoring.hosting.azureportal.chinaloudapi.cn/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`. 
    
4. After registering the redirect URLs, under **Implicit grant**, select the options **Access tokens** and **ID tokens** and then save your changes.

>[!NOTE]
>Configuring authentication with Azure Active Directory for single-sign on can only be accomplished during initial deployment of a new AKS cluster. You cannot configure single-sign on for an AKS cluster already deployed.
  
>[!IMPORTANT]
>If you reconfigured Azure AD for user authentication using the updated URI, clear your browser's cache to ensure the updated authentication token is downloaded and applied.

## Grant permission

Each Azure AD account must be granted permission to the appropriate APIs in Kubernetes in order to access the Live Data (preview) feature. The steps to grant the Azure Active Directory account are similar to the steps described in the [Kubernetes RBAC authentication](#configure-kubernetes-rbac-authorization) section. Before applying the yaml configuration template to your cluster, replace **clusterUser** under **ClusterRoleBinding** with the desired user. 

>[!IMPORTANT]
>If the user you grant the RBAC binding for is in the same Azure AD tenant, assign permissions based on the userPrincipalName. If the user is in a different Azure AD tenant, query for and use the objectId property.

For additional help configuring your AKS cluster **ClusterRoleBinding**, see [Create RBAC binding](../../aks/azure-ad-integration-cli.md#create-rbac-binding).

## Next steps

Now that you have setup authentication, you can view [metrics](container-insights-livedata-metrics.md), [Deployments](container-insights-livedata-deployments.md), and [events and logs](container-insights-livedata-overview.md) in real-time from your cluster.
