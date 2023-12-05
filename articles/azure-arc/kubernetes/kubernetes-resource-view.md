---
title: Access Kubernetes resources from Azure portal
ms.date: 08/07/2023
ms.topic: how-to
description: Learn how to interact with Kubernetes resources to manage an Azure Arc-enabled Kubernetes cluster from the Azure portal.
---

# Access Kubernetes resources from Azure portal

The Azure portal includes a Kubernetes resource view for easy access to the Kubernetes resources in your Azure Arc-enabled Kubernetes cluster. Viewing Kubernetes resources from the Azure portal reduces context switching between the Azure portal and the `kubectl` command-line tool, streamlining the experience for viewing and editing your Kubernetes resources. The resource viewer currently includes multiple resource types, including deployments, pods, and replica sets.

## Prerequisites

- An existing Kubernetes cluster [connected](quickstart-connect-cluster.md) to Azure as an Azure Arc-enabled Kubernetes resource.

- An account that can authenticate to the cluster and access the resources in the portal:

  - If using [Azure RBAC](azure-rbac.md), ensure that the Microsoft Entra account that will access the portal has a role that lets it authenticate to the cluster, such as [Azure Arc Kubernetes Viewer](/azure/role-based-access-control/built-in-roles):

   ```azurecli
   az role assignment create --role "Azure Arc Kubernetes Viewer" --assignee $AAD_ENTITY_OBJECT_ID --scope $ARM_ID_CLUSTER
   ```

  - If using [cluster connect with service account token authentication](cluster-connect.md#service-account-token-authentication-option), ensure that the account uses a Kubernetes cluster role that can authenticate to the cluster, such as `cluster-admin`:
  
   ```console
   kubectl create clusterrolebinding demo-user-binding --clusterrole cluster-admin --user=$AAD_ENTITY_OBJECT_ID`
   ```

   The same account must have an Azure role such as [Azure Arc Kubernetes Viewer](/azure/role-based-access-control/built-in-roles) in order to authenticate to the Azure portal and view Arc-enabled cluster resources.

## View Kubernetes resources

To see the Kubernetes resources, navigate to your cluster in the Azure portal. The navigation pane on the left is used to access your resources:

- **Namespaces** displays the namespaces of your cluster. The filter at the top of the namespace list provides a quick way to filter and display your namespace resources.
- **Workloads** shows information about deployments, pods, replica sets, stateful sets, daemon sets, jobs, and cron jobs deployed to your cluster.
- **Services and ingresses** shows all of your cluster's service and ingress resources.
- **Storage** shows your Azure storage classes and persistent volume information.
- **Configuration** shows your cluster's config maps and secrets.

:::image type="content" source="media/kubernetes-resource-view/workloads.png" alt-text="Screenshot of Kubernetes workloads information in the Azure portal." lightbox="media/kubernetes-resource-view/workloads.png":::

## Edit YAML

The Kubernetes resource view also includes a YAML editor. A built-in YAML editor means you can update Kubernetes objects from within the portal and apply changes immediately.

>[!WARNING]
> The Azure portal Kubernetes management capabilities and the YAML editor are built for learning and flighting new deployments in a development and test setting. Performing direct production changes by editing the YAML is not recommended. For production environments, consider using [GitOps to apply configurations](tutorial-use-gitops-flux2.md).

After you edit the YAML, select **Review + save**, confirm the changes, and then save again.

:::image type="content" source="media/kubernetes-resource-view/yaml-editor.png" alt-text="Screenshot showing the YAML editor for Kubernetes objects displayed in the Azure portal." lightbox="media/kubernetes-resource-view/yaml-editor.png":::

## Next steps

- Learn how to [deploy Azure Monitor for containers](../../azure-monitor/containers/container-insights-enable-arc-enabled-clusters.md?toc=/azure/azure-arc/kubernetes/toc.json) for more in-depth information about nodes and containers on your clusters.
- Learn about [identity and access options for Azure Arc-enabled Kubernetes](identity-access-overview.md).
