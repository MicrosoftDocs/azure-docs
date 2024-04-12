---
title: Access Kubernetes resources from the Azure portal
description: Learn how to interact with Kubernetes resources to manage an Azure Kubernetes Service (AKS) cluster from the Azure portal.
ms.topic: article
ms.date: 03/30/2023
---

# Access Kubernetes resources from the Azure portal

The Azure portal includes a Kubernetes resource view for easy access to the Kubernetes resources in your Azure Kubernetes Service (AKS) cluster. Viewing Kubernetes resources from the Azure portal reduces context switching between the Azure portal and the `kubectl` command-line tool, streamlining the experience for viewing and editing your Kubernetes resources. The resource viewer currently includes multiple resource types, such as deployments, pods, and replica sets.

The Kubernetes resource view from the Azure portal replaces the deprecated AKS dashboard add-on.

## Prerequisites

To view Kubernetes resources in the Azure portal, you need an AKS cluster. Any cluster is supported, but if you're using Microsoft Entra integration, your cluster must use [AKS-managed Microsoft Entra integration][aks-managed-aad]. If your cluster uses legacy Microsoft Entra ID, you can upgrade your cluster in the portal or with the [Azure CLI][cli-aad-upgrade]. You can also [use the Azure portal][aks-quickstart-portal] to create a new AKS cluster.

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

1. From the **Services and ingresses** resource view, select **Create** > **Starter application**.
2. Under **Create a basic web application**, select **Create**.
3. On the **Application details** page, select **Next**.
4. On the **Review YAML** page, select **Deploy**.

Once the application is deployed, the resource view shows the two Kubernetes services:

- **azure-vote-back**: The internal service.
- **azure-vote-front**: The external service, which includes a linked external IP address so you can view the application in your browser.

:::image type="content" source="media/kubernetes-portal/portal-services.png" alt-text="Azure Vote application information displayed in the Azure portal." lightbox="media/kubernetes-portal/portal-services.png":::

### Monitor deployment insights

AKS clusters with [Container insights][enable-monitor] enabled can quickly view deployment and other insights. From the Kubernetes resources view, you can see the live status of individual deployments, including CPU and memory usage. You can also go to Azure Monitor for more in-depth information about specific nodes and containers.

Here's an example of deployment insights from a sample AKS cluster:

:::image type="content" source="media/kubernetes-portal/deployment-insights.png" alt-text="Deployment insights displayed in the Azure portal." lightbox="media/kubernetes-portal/deployment-insights.png":::

## Edit YAML

The Kubernetes resource view also includes a YAML editor. A built-in YAML editor means you can update or create services and deployments from within the portal and apply changes immediately.

:::image type="content" source="media/kubernetes-portal/service-editor.png" alt-text="YAML editor for a Kubernetes service displayed in the Azure portal.":::

To edit a YAML file for one of your resources, see the following steps:

1. Navigate to your resource in the Azure portal.
2. Select **YAML** and make your desired edits.
3. Select **Review + save** > **Confirm manifest changes** > **Save**.

>[!WARNING]
> We don't recommend performing direct production changes via UI or CLI. Instead, you should leverage [continuous integration (CI) and continuous deployment (CD) best practices](kubernetes-action.md). The Azure portal Kubernetes management capabilities, such as the YAML editor, are built for learning and flighting new deployments in a development and testing setting.

## Troubleshooting

This section addresses common problems and troubleshooting steps.

### Unauthorized access

To access the Kubernetes resources, you must have access to the AKS cluster, the Kubernetes API, and the Kubernetes objects. Ensure that you're either a cluster administrator or a user with the appropriate permissions to access the AKS cluster. For more information on cluster security, see [Access and identity options for AKS][concepts-identity].

>[!NOTE]
> The Kubernetes resource view in the Azure portal is only supported by [managed-AAD enabled clusters](managed-azure-ad.md) or non-AAD enabled clusters. If you're using a managed-AAD enabled cluster, your Microsoft Entra user or identity needs to have the respective roles/role bindings to access the Kubernetes API and the permission to pull the [user `kubeconfig`](control-kubeconfig-access.md).

### Enable resource view

For existing clusters, you may need to enable the Kubernetes resource view. To enable the resource view, follow the prompts in the portal for your cluster.

### [Azure CLI](#tab/azure-cli)

> [!TIP]
> You can add the AKS feature for [**API server authorized IP ranges**](api-server-authorized-ip-ranges.md) to limit API server access to only the firewall's public endpoint. Another option is to update the `-ApiServerAccessAuthorizedIpRange` to include access for a local client computer or IP address range (from which portal is being browsed). To allow this access, you need the computer's public IPv4 address. You can find this address with the following command or you can search "what is my IP address" in your browser.

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
> You can add the AKS feature for [**API server authorized IP ranges**](api-server-authorized-ip-ranges.md) to limit API server access to only the firewall's public endpoint. Another option is to update the `-ApiServerAccessAuthorizedIpRange` to include access for a local client computer or IP address range (from which portal is being browsed). To allow this access, you need the computer's public IPv4 address. You can find this address with the following command or you can search "what is my IP address" in your browser.

```azurepowershell
# Retrieve your IP address
$CURRENT_IP = (Invoke-RestMethod -Uri http://ipinfo.io/json).ip

# Add to AKS approved list
Set-AzAksCluster -ResourceGroupName $RG -Name $AKSNAME -ApiServerAccessAuthorizedIpRange $CURRENT_IP/32
```

---

## Next steps

This article showed you how to access Kubernetes resources from the Azure portal. For more information on cluster resources, see [Deployments and YAML manifests][deployments].

<!-- LINKS - internal -->
[concepts-identity]: concepts-identity.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[deployments]: concepts-clusters-workloads.md#deployments-and-yaml-manifests
[aks-managed-aad]: managed-azure-ad.md
[cli-aad-upgrade]: managed-azure-ad.md#migrate-a-legacy-azure-ad-cluster-to-integration
[enable-monitor]: ../azure-monitor/containers/container-insights-enable-existing-clusters.md
