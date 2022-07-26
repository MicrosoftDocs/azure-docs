---
title: Access Kubernetes resources from the Azure portal
description: Learn how to interact with Kubernetes resources to manage an Azure Kubernetes Service (AKS) cluster from the Azure portal.
services: container-service
ms.topic: article
ms.date: 12/16/2020
---

# Access Kubernetes resources from the Azure portal

The Azure portal includes a Kubernetes resource view for easy access to the Kubernetes resources in your Azure Kubernetes Service (AKS) cluster. Viewing Kubernetes resources from the Azure portal reduces context switching between the Azure portal and the `kubectl` command-line tool, streamlining the experience for viewing and editing your Kubernetes resources. The resource viewer currently includes multiple resource types, such as deployments, pods, and replica sets.

The Kubernetes resource view from the Azure portal replaces the AKS dashboard add-on, which is deprecated.

## Prerequisites

To view Kubernetes resources in the Azure portal, you need an AKS cluster. Any cluster is supported, but if using Azure Active Directory (Azure AD) integration, your cluster must use [AKS-managed Azure AD integration][aks-managed-aad]. If your cluster uses legacy Azure AD, you can upgrade your cluster in the portal or with the [Azure CLI][cli-aad-upgrade]. You can also [use the Azure portal][aks-quickstart-portal] to create a new AKS cluster.

## View Kubernetes resources

To see the Kubernetes resources, navigate to your AKS cluster in the Azure portal. The navigation pane on the left is used to access your resources. The resources include:

- **Namespaces** displays the namespaces of your cluster. The filter at the top of the namespace list provides a quick way to filter and display your namespace resources.
- **Workloads** shows information about deployments, pods, replica sets, stateful sets, daemon sets, jobs, and cron jobs deployed to your cluster. The screenshot below shows the default system pods in an example AKS cluster.
- **Services and ingresses** shows all of your cluster's service and ingress resources.
- **Storage** shows your Azure storage classes and persistent volume information.
- **Configuration** shows your cluster's config maps and secrets.

:::image type="content" source="media/kubernetes-portal/workloads.png" alt-text="Kubernetes pod information displayed in the Azure portal." lightbox="media/kubernetes-portal/workloads.png":::

### Deploy an application

In this example, we'll use our sample AKS cluster to deploy the Azure Vote application from the [AKS quickstart][aks-quickstart-portal].

1. Select **Add** from any of the resource views (Namespace, Workloads, Services and ingresses, Storage, or Configuration).
1. Paste the YAML for the Azure Vote application from the [AKS quickstart][aks-quickstart-portal].
1. Select **Add** at the bottom of the YAML editor to deploy the application.

Once the YAML file is added, the resource viewer shows both Kubernetes services that were created: the internal service (azure-vote-back), and the external service (azure-vote-front) to access the Azure Vote application. The external service includes a linked external IP address so you can easily view the application in your browser.

:::image type="content" source="media/kubernetes-portal/portal-services.png" alt-text="Azure Vote application information displayed in the Azure portal." lightbox="media/kubernetes-portal/portal-services.png":::

### Monitor deployment insights

AKS clusters with [Container insights][enable-monitor] enabled can quickly view deployment and other insights. From the Kubernetes resources view, users can see the live status of individual deployments, including CPU and memory usage, as well as transition to Azure monitor for more in-depth information about specific nodes and containers. Here's an example of deployment insights from a sample AKS cluster:

:::image type="content" source="media/kubernetes-portal/deployment-insights.png" alt-text="Deployment insights displayed in the Azure portal." lightbox="media/kubernetes-portal/deployment-insights.png":::

## Edit YAML

The Kubernetes resource view also includes a YAML editor. A built-in YAML editor means you can update or create services and deployments from within the portal and apply changes immediately.

:::image type="content" source="media/kubernetes-portal/service-editor.png" alt-text="YAML editor for a Kubernetes service displayed in the Azure portal.":::

After editing the YAML, changes are applied by selecting **Review + save**, confirming the changes, and then saving again.

>[!WARNING]
> Performing direct production changes via UI or CLI is not recommended, you should leverage [continuous integration (CI) and continuous deployment (CD) best practices](kubernetes-action.md). The Azure Portal Kubernetes management capabilities and the YAML editor are built for learning and flighting new deployments in a development and testing setting.

## Troubleshooting

This section addresses common problems and troubleshooting steps.

### Unauthorized access

To access the Kubernetes resources, you must have access to the AKS cluster, the Kubernetes API, and the Kubernetes objects. Ensure that you're either a cluster administrator or a user with the appropriate permissions to access the AKS cluster. For more information on cluster security, see [Access and identity options for AKS][concepts-identity].

>[!NOTE]
> The kubernetes resource view in the Azure Portal is only supported by [managed-AAD enabled clusters](managed-aad.md) or non-AAD enabled clusters. If you are using a managed-AAD enabled cluster, your AAD user or identity needs to have the respective roles/role bindings to access the kubernetes API, in addition to the permission to pull the [user `kubeconfig`](control-kubeconfig-access.md).

### Enable resource view

For existing clusters, you may need to enable the Kubernetes resource view. To enable the resource view, follow the prompts in the portal for your cluster.

### [Azure CLI](#tab/azure-cli)

> [!TIP]
> The AKS feature for [**API server authorized IP ranges**](api-server-authorized-ip-ranges.md) can be added to limit API server access to only the firewall's public endpoint. Another option for such clusters is updating `--api-server-authorized-ip-ranges` to include access for a local client computer or IP address range (from which portal is being browsed). To allow this access, you need the computer's public IPv4 address. You can find this address with below command or by searching "what is my IP address" in an internet browser.

```bash
# Retrieve your IP address
CURRENT_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)
```

```azurecli
# Add to AKS approved list
az aks update -g $RG -n $AKSNAME --api-server-authorized-ip-ranges $CURRENT_IP/32
```

### [Azure PowerShell](#tab/azure-powershell) 

> [!TIP]
> The AKS feature for [**API server authorized IP ranges**](api-server-authorized-ip-ranges.md) can be added to limit API server access to only the firewall's public endpoint. Another option for such clusters is updating `-ApiServerAccessAuthorizedIpRange` to include access for a local client computer or IP address range (from which portal is being browsed). To allow this access, you need the computer's public IPv4 address. You can find this address with below command or by searching "what is my IP address" in an internet browser.

```azurepowershell
# Retrieve your IP address
$CURRENT_IP = (Invoke-RestMethod -Uri http://ipinfo.io/json).ip

# Add to AKS approved list
Set-AzAksCluster -ResourceGroupName $RG -Name $AKSNAME -ApiServerAccessAuthorizedIpRange $CURRENT_IP/32
```

---

## Next steps

This article showed you how to access Kubernetes resources for your AKS cluster. See [Deployments and YAML manifests][deployments] for a deeper understanding of cluster resources and the YAML files that are accessed with the Kubernetes resource viewer.

<!-- LINKS - internal -->
[concepts-identity]: concepts-identity.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[deployments]: concepts-clusters-workloads.md#deployments-and-yaml-manifests
[aks-managed-aad]: managed-aad.md
[cli-aad-upgrade]: managed-aad.md#upgrading-to-aks-managed-azure-ad-integration
[enable-monitor]: ../azure-monitor/containers/container-insights-enable-existing-clusters.md
