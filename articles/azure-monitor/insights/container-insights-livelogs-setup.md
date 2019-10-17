---
title: Setup live container log monitoring with Azure Monitor for containers | Microsoft Docs
description: This article describes how to setup the real-time view of container logs (stdout/stderr) and events without using kubectl with Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/16/2019
ms.author: magoedte
---

# How to setup the Live Metrics and Data feature

To view live metrics and data with Azure Monitor for containers from Azure Kubernetes Service (AKS) clusters, you need to configure authentication to grant permission to access to your Kubernetes data. This security configuration allows real time access to your data through the Kubernetes API directly in the Azure portal.  

These instructions require both administrative access to your Kubernetes cluster, and if configuring to use Azure Active Directory (AD) for user authentication, administrative access to Azure AD for your cluster.  

This article explains how to configure the the following types of authentication to control access to the Live Metric and Data (preview) feature from the cluster:

- Role based access control (RBAC) enabled AKS cluster
- Azure Active Directory integrated AKS cluster 

>[!NOTE]
>AKS clusters enabled as [private clusters](https://azure.microsoft.com/updates/aks-private-cluster/) are not supported with this feature. This feature relies on directly accessing the Kubernetes API through a proxy server from your browser. Enabling networking security to block the Kubernetes API from this proxy will block this traffic. 

>[!NOTE]
>This feature is available in all Azure regions, including Azure China. It is currently not available in Azure US Government.

## Authentication model

The Live Data and Metrics (preview) features utilizes the Kubernetes API, identical to the `kubectl` command-line tool. The Kubernetes API endpoints utilize a self-signed certificate, which your browser will be unable to validate. This feature utilizes a internal proxy to validate the certificate with the AKS service, ensuring the traffic is trusted.

The Azure portal prompts you to validate your login credentials for an Azure Active Directory cluster, and redirect you to the client registration setup during cluster creation (and re-configured in this article). This behavior is similar to the authentication process required by `kubectl`. 

>[!NOTE]
>Authorization to your cluster is managed by Kubernetes and the security model it is configured with. Users accessing this feature require permission to download the Kubernetes configuration (*kubeconfig*), similar to running `az aks get-credentials -n {your cluster name} -g {your resource group}`. This configuration file contains the authorization and authentication token for **Azure Kubernetes Service Cluster User Role**, in the case of Azure RBAC-enabled and AKS clusters without RBAC authorization enabled. It contains information about Azure AD and client registration details when AKS is enabled with Azure Active Directory (AD) SAML-based single-sign on.

>[!IMPORTANT]
>Users of this features requires [**Azure Kubernetes Cluster User Role**](../../azure/role-based-access-control/built-in-roles.md#azure-kubernetes-service-cluster-user-role permissions)  to the cluster in order to download the `kubeconfig` and use this feature. Users do **not** require contributor access to the cluster to utilize this feature. 

## Kubernetes cluster without RBAC enabled (existing cluster)

If you have a Kubernetes cluster that is not configured with Kubernetes RBAC authorization or integrated with Azure AD single-sign on, there are no configuration steps required to use the Live Metrics and Data feature in this scenario.

## Kubernetes RBAC authentication (existing cluster)

When you enable Kubernetes RBAC authorization, two users are utilized: **clusterUser** and **clusterAdmin** to access the Kubernetes API. This is similar to running `az aks get-credentials -n {cluster_name} -g {rg_name}` without the administrative option. This means the **clusterUser** has to be granted access to the end points in Kubernetes API.

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
> If you have a previous version of the yaml file applied to your cluster, <update using the new code above and then run the command to apply>

## Kubernetes AD integrated authentication (existing cluster)

An AKS cluster configured to use Azure Active Directory (AD) for user authentication utilizes the login credentials of the person accessing this feature. In this configuration, you can sign in to an AKS cluster by using your Azure AD authentication token.

Azure AD client registration must be reconfigured to allow the Azure portal to redirect authorization pages as a trusted redirect URL. Users from Azure AD are then granted access directly to the same Kubernetes API endpoints through **ClusterRoles** and **ClusterRoleBindings**. 

For more information on advanced security setup in Kubernetes, review the [Kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/). 

### Client registration reconfiguration

1. Locate the client registration for your Kubernetes cluster in Azure AD under **Azure Active Directory > App registrations** in the Azure portal.

2. Select **Authentication** from the left-hand pane. 

3. Add two redirect URLs to this list as **Web** application types. The first base URL value should be `https://afd.hosting.portal.azure.net/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html` and the second base URL value should be `https://monitoring.hosting.portal.azure.net/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html`.

    >[!NOTE]
    >f you're using this feature in Azure China region, the first base URL value should be `https://afd.hosting.azureportal.chinaloudapi.cn/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html and the second base URL value should be https://monitoring.hosting.azureportal.chinaloudapi.cn/monitoring/Content/iframe/infrainsights.app/web/base-libs/auth/auth.html. 
    
4. After registering the redirect URLs, under **Advanced settings**, select the options **Access tokens** and **ID tokens** and then save your changes.

>[!NOTE]
>Configuring authentication with Azure Active Directory for single-sign on can only be accomplished during initial deployment of a new AKS cluster. You cannot configure single-sign on for an AKS cluster already deployed.
  
>[!IMPORTANT]
>If you reconfigured Azure AD for user authentication using the updated URI, clear your browser's cache to ensure the updated authentication token is downloaded and applied.

## Granting permissions

Each Azure AD account must be granted permission to the appropriate APIs in Kubernetes in order to access the live metrics and data feature. The steps to grant the Azure Active Directory account are similar to the steps described in the [Kubernetes RBAC authentication](#kubernetes-rbac-authentication) section. Before applying the yaml configuration template to your cluster, replace **clusterUser** under **ClusterRoleBinding** with the desired user. 

>[!IMPORTANT]
>If the user you grant the RBAC binding for is in the same Azure AD tenant, assign permissions based on the userPrincipalName. If the user is in a different Azure AD tenant, query for and use the objectId property instead.

For additional help configuring your AKS cluster **ClusterRoleBinding**, see [Create RBAC binding](../../aks/azure-ad-integration-cli.md#create-rbac-binding).

## Next steps

Now that you have setup authentication for viewing log data, you can view live metric data from the cluster, deployments, console events, console logs, pod metrics.