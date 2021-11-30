---
title: Protect hybrid and multi-cloud Kubernetes deployments with Microsoft Defender for Kubernetes
description: Use Microsoft Defender for Kubernetes with your on-premises and multi-cloud Kubernetes clusters
ms.topic: how-to
ms.date: 11/09/2021
---
# Defend Azure Arc-enabled Kubernetes clusters running in on-premises and multi-cloud environments

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

The **Microsoft Defender for Kubernetes clusters extension** can defend your on-premises clusters with the same threat detection capabilities offered for Azure Kubernetes Service clusters. Enable [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) on your clusters and deploy the extension as described on this page. 

The extension can also protect Kubernetes clusters on other cloud providers, although not on their managed Kubernetes services.

> [!TIP]
> We've put some sample files to help with the installation process in [Installation examples on GitHub](https://aka.ms/kubernetes-extension-installation-examples).

## Availability

| Aspect | Details |
|--------|---------|
| Release state | **Preview**<br>[!INCLUDE [Legalese](../../includes/security-center-preview-legal-text.md)]|
| Required roles and permissions | [Security admin](../role-based-access-control/built-in-roles.md#security-admin) can dismiss alerts<br>[Security reader](../role-based-access-control/built-in-roles.md#security-reader) can view findings |
| Pricing | Free (during preview) |
| Supported Kubernetes distributions | [Azure Kubernetes Service on Azure Stack HCI](/azure-stack/aks-hci/overview)<br>[Kubernetes](https://kubernetes.io/docs/home/)<br> [AKS Engine](https://github.com/Azure/aks-engine)<br> [Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/)<br> [Red Hat OpenShift](https://www.openshift.com/learn/topics/kubernetes/) (version 4.6 or newer)<br> [VMware Tanzu Kubernetes Grid](https://tanzu.vmware.com/kubernetes-grid)<br> [Rancher Kubernetes Engine](https://rancher.com/docs/rke/latest/en/) |
| Limitations | Azure Arc-enabled Kubernetes and the Defender extension **don't support** managed Kubernetes offerings like Google Kubernetes Engine and Elastic Kubernetes Service. [Defender for Cloud is natively available for Azure Kubernetes Service (AKS)](defender-for-kubernetes-introduction.md) and doesn't require connecting the cluster to Azure Arc. |
| Environments and regions | Availability for this extension is the same as availability for [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)|

## Architecture overview

For all Kubernetes clusters other than AKS, you'll need to connect your cluster to Azure Arc. Once connected, Microsoft Defender for Kubernetes can be deployed on [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) resources as a [cluster extension](../azure-arc/kubernetes/extensions.md).

The extension components collect Kubernetes audit logs data from all control plane nodes in the cluster and send them to the Microsoft Defender for Kubernetes backend in the cloud for further analysis. The extension is registered with a Log Analytics workspace used as a data pipeline, but the audit log data isn't stored in the Log Analytics workspace.

This diagram shows the interaction between Microsoft Defender for Kubernetes and the Azure Arc-enabled Kubernetes cluster:

:::image type="content" source="media/defender-for-kubernetes-azure-arc/defender-for-kubernetes-architecture-overview.png" alt-text="A high-level architecture diagram outlining the interaction between Microsoft Defender for Kubernetes and an Azure Arc-enabled Kubernetes clusters." lightbox="media/defender-for-kubernetes-azure-arc/defender-for-kubernetes-architecture-overview.png":::

## Prerequisites

Before deploying the extension, ensure you:
- [Connect the Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md)
- Complete the [pre-requisites listed under the generic cluster extensions documentation](../azure-arc/kubernetes/extensions.md#prerequisites).
- Configure **port 443** on the following endpoints for outbound access:
    - For clusters on Azure Government cloud:
        - *.ods.opinsights.azure.us
        - *.oms.opinsights.azure.us
        - :::no-loc text="login.microsoftonline.us":::
    - For clusters on other Azure cloud deployments:
        - *.ods.opinsights.azure.com
        - *.oms.opinsights.azure.com
        - :::no-loc text="login.microsoftonline.com":::

## Deploy the Defender extension

You can deploy the Defender extension using a range of methods. For detailed steps, select the relevant tab.

### [**Azure portal**](#tab/k8s-deploy-asc)

### Use the fix button from the Defender for Cloud recommendation

A dedicated recommendation in Microsoft Defender for Cloud provides:

- **Visibility** about which of your clusters has the Defender for Kubernetes extension deployed
- **Fix** button to deploy it to those clusters without the extension

1. From Microsoft Defender for Cloud's recommendations page, open the **Enable enhanced security** security control.

1. Use the filter to find the recommendation named **Azure Arc-enabled Kubernetes clusters should have Defender for Cloud's extension installed**.

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-recommendation.png" alt-text="Microsoft Defender for Cloud's recommendation for deploying the Defender extension for Azure Arc-enabled Kubernetes clusters." lightbox="media/defender-for-kubernetes-azure-arc/extension-recommendation.png":::

    > [!TIP]
    > Notice the **Fix** icon in the actions column

1. Select the extension to see the details of the healthy and unhealthy resources - clusters with and without the extension.

1. From the unhealthy resources list, select a cluster and select **Remediate** to open the pane with the remediation options.

1. Select the relevant Log Analytics workspace and select **Remediate x resource**.

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/security-center-deploy-extension.gif" alt-text="Deploy Defender extension for Azure Arc with Defender for Cloud's fix option.":::


### [**Azure CLI**](#tab/k8s-deploy-cli)

### Use Azure CLI to deploy the Defender extension

1. Log in to Azure:

    ```azurecli
    az login
    az account set --subscription <your-subscription-id>
    ```

    > [!IMPORTANT]
    > Ensure that you use the same subscription ID for ``<your-subscription-id>`` as the one that was used when connecting your cluster to Azure Arc.

1. Run the following command to deploy the extension on top of your Azure Arc-enabled Kubernetes cluster:

    ```azurecli
    az k8s-extension create --name microsoft.azuredefender.kubernetes --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <resource-group> --extension-type microsoft.azuredefender.kubernetes
    ```

    A description of all the supported configuration settings on the Defender extension type is given below:

    | Property | Description |
    |----------|-------------|
    | logAnalyticsWorkspaceResourceID | **Optional**. Full resource ID of your own Log Analytics workspace.<br>When not provided, the default workspace of the region will be used.<br><br>To get the full resource ID, run the following command to display the list of workspaces in your subscriptions in the default JSON format:<br>```az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json```<br><br>The Log Analytics workspace resource ID has the following syntax:<br>/subscriptions/{your-subscription-id}/resourceGroups/{your-resource-group}/providers/Microsoft.OperationalInsights/workspaces/{your-workspace-name}. <br>Learn more in [Log Analytics workspaces](../azure-monitor/logs/data-platform-logs.md#log-analytics-and-workspaces) |
    | auditLogPath |**Optional**. The full path to the audit log files.<br>When not provided, the default path ``/var/log/kube-apiserver/audit.log`` will be used.<br>For AKS Engine, the standard path is ``/var/log/kubeaudit/audit.log`` |

    The below command shows an example usage of all optional fields:

    ```azurecli
    az k8s-extension create --name microsoft.azuredefender.kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-rg> --extension-type microsoft.azuredefender.kubernetes --configuration-settings logAnalyticsWorkspaceResourceID=<log-analytics-workspace-resource-id> auditLogPath=<your-auditlog-path>
    ```

### [**Resource Manager**](#tab/k8s-deploy-resource-manager)

### Use Azure Resource Manager to deploy the Defender extension

To use Azure Resource Manager to deploy the Defender extension, you'll need a Log Analytics workspace on your subscription. Learn more in [Log Analytics workspaces](../azure-monitor/logs/data-platform-logs.md#log-analytics-and-workspaces).

You can use the **azure-defender-extension-arm-template.json** Resource Manager template from Defender for Cloud's [installation examples](https://aka.ms/kubernetes-extension-installation-examples).

> [!TIP]
> If you're new to Resource Manager templates, start here: [What are Azure Resource Manager templates?](../azure-resource-manager/templates/overview.md)

### [**REST API**](#tab/k8s-deploy-api)

### Use REST API to deploy the Defender extension 

To use the REST API to deploy the Defender extension, you'll need a Log Analytics workspace on your subscription. Learn more in [Log Analytics workspaces](../azure-monitor/logs/data-platform-logs.md#log-analytics-and-workspaces).

> [!TIP]
> The simplest way to use the API to deploy the Defender extension is with the supplied **Postman Collection JSON** example from Defender for Cloud's [installation examples](https://aka.ms/kubernetes-extension-installation-examples).
- To modify the Postman Collection JSON, or to manually deploy the extension with the REST API, run the following PUT command:

    ```rest
    PUT https://management.azure.com/subscriptions/{{Subscription Id}}/resourcegroups/{{Resource Group}}/providers/Microsoft.Kubernetes/connectedClusters/{{Cluster Name}}/providers/Microsoft.KubernetesConfiguration/extensions/microsoft.azuredefender.kubernetes?api-version=2020-07-01-preview
    ```

    Where:

    | Name            | In   | Required | Type   | Description                                  |
    |-----------------|------|----------|--------|----------------------------------------------|
    | Subscription ID | path | True     | string | Your Azure Arc-enabled Kubernetes resource's subscription ID |
    | Resource Group  | path | True     | string | Name of the resource group containing your Azure Arc-enabled Kubernetes resource |
    | Cluster Name    | path | True     | string | Name of your Azure Arc-enabled Kubernetes resource  |


    For **Authentication**, your header must have a Bearer token (as with other Azure APIs). To get a bearer token, run the following command:

    `az account get-access-token --subscription <your-subscription-id>`
    Use the following structure for the body of your message:
    ```json
    { 
    "properties": { 
        "extensionType": "microsoft.azuredefender.kubernetes",
    "con    figurationSettings": { 
            "logAnalytics.workspaceId":"YOUR-WORKSPACE-ID"
        // ,    "auditLogPath":"PATH/TO/AUDITLOG"
        },
        "configurationProtectedSettings": {
            "logAnalytics.key":"YOUR-WORKSPACE-KEY"
        }
        }
    } 
    ```

    Description of the properties is given below:

    | Property | Description | 
    | -------- | ----------- |
    | logAnalytics.workspaceId | Workspace ID of the Log Analytics resource |
    | logAnalytics.key         | Key of the Log Analytics resource | 
    | auditLogPath             | **Optional**. The full path to the audit log files. The default value is ``/var/log/kube-apiserver/audit.log`` |

---

## Verify the deployment

To verify that your cluster has the Defender extension installed on it, follow the steps in one of the tabs below:

### [**Azure portal - Defender for Cloud**](#tab/k8s-verify-asc)

### Use Defender for Cloud recommendation to verify the status of your extension

1. From Microsoft Defender for Cloud's recommendations page, open the  **Enable Microsoft Defender for Cloud** security control.

1. Select the recommendation named **Azure Arc-enabled Kubernetes clusters should have Microsoft Defender for Cloud's extension installed**.

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-recommendation.png" alt-text="Microsoft Defender for Cloud's recommendation for deploying the Defender extension for Azure Arc-enabled Kubernetes clusters." lightbox="media/defender-for-kubernetes-azure-arc/extension-recommendation.png":::

1. Check that the cluster on which you deployed the extension is listed as **Healthy**.


### [**Azure portal - Azure Arc**](#tab/k8s-verify-arc)

### Use the Azure Arc pages to verify the status of your extension

1. From the Azure portal, open **Azure Arc**.
1. From the infrastructure list, select **Kubernetes clusters** and then select the specific cluster.
1. Open the extensions page. The extensions on the cluster are listed. To confirm whether the Defender extension was installed correctly, check the **Install status** column.

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-installed-clusters-page.png" alt-text="Azure Arc page for checking the status of all installed extensions on a Kubernetes cluster." lightbox="media/defender-for-kubernetes-azure-arc/extension-installed-clusters-page.png":::

1. For more details, select the extension.

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-details-page.png" alt-text="Full details of an Azure Arc extension on a Kubernetes cluster.":::


### [**Azure CLI**](#tab/k8s-verify-cli)

### Use Azure CLI to verify that the extension is deployed

1. Run the following command on Azure CLI:

    ```azurecli
    az k8s-extension show --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes
    ```

1. In the response, look for "extensionType": "microsoft.azuredefender.kubernetes" and "installState": "Installed".

    > [!NOTE]
    > It might show "installState": "Pending" for the first few minutes.
    
1. If the state shows **Installed**, run the following command on your machine with the `kubeconfig` file pointed to your cluster to check that a pod called "azuredefender-XXXXX" is in 'Running' state:
    
    ```console
    kubectl get pods -n azuredefender
    ```

### [**REST API**](#tab/k8s-verify-api)

### Use the REST API to verify that the extension is deployed

To confirm a successful deployment, or to validate the status of your extension at any time:

1. Run the following GET command:

    ```rest
    GET https://management.azure.com/subscriptions/{{Subscription Id}}/resourcegroups/{{Resource Group}}/providers/Microsoft.Kubernetes/connectedClusters/{{Cluster Name}}/providers/Microsoft.KubernetesConfiguration/extensions/microsoft.azuredefender.kubernetes?api-version=2020-07-01-preview
    ```

1. In the response, look in "extensionType": "microsoft.azuredefender.kubernetes" for "installState": "Installed".

    > [!TIP]
    > It might show "installState": "Pending" for the first few minutes.

1. If the state shows **Installed**, run the following command on your machine with the `kubeconfig` file pointed to your cluster to check that a pod called "azuredefender-XXXXX" is in 'Running' state:

    ```console
    kubectl get pods -n azuredefender
    ```

---

## Simulate security alerts from Microsoft Defender for Kubernetes

A full list of supported alerts is available in the [reference table of all security alerts in Microsoft Defender for Cloud](alerts-reference.md#alerts-k8scluster).

1. To simulate a security alert, run the following command:

    ```console
    kubectl get pods --namespace=asc-alerttest-662jfi039n
    ```

    The expected response is "No resource found".

    Within 30 minutes, Defender for Cloud will detect this activity and trigger a security alert.

1. In the Azure portal, open Microsoft Defender for Cloud's security alerts page and look for the alert on the relevant resource:

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/sample-kubernetes-security-alert.png" alt-text="Sample alert from Microsoft Defender for Kubernetes." lightbox="media/defender-for-kubernetes-azure-arc/sample-kubernetes-security-alert.png":::

## Removing the Defender extension

You can remove the extension using Azure portal, Azure CLI, or REST API as explained in the tabs below.

### [**Azure portal - Arc**](#tab/k8s-remove-arc)

### Use Azure portal to remove the extension

1. From the Azure portal, open Azure Arc.
1. From the infrastructure list, select **Kubernetes clusters** and then select the specific cluster.
1. Open the extensions page. The extensions on the cluster are listed.
1. Select the cluster and select **Uninstall**.

    :::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-uninstall-clusters-page.png" alt-text="Removing an extension from your Arc-enabled Kubernetes cluster." lightbox="media/defender-for-kubernetes-azure-arc/extension-uninstall-clusters-page.png":::

### [**Azure CLI**](#tab/k8s-remove-cli)

### Use Azure CLI to remove the Defender extension

1. Remove the Microsoft Defender for Kubernetes Arc extension with the following commands:

    ```azurecli
    az login
    az account set --subscription <subscription-id>
    az k8s-extension delete --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes --yes
    ```

    Removing the extension may take a few minutes. We recommend you wait before you try to verify that it was successful.

1. To verify that the extension was successfully removed, run the following commands:

    ```azurecli
    az k8s-extension show --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes
    ```

    There should be no delay in the extension resource getting deleted from Azure Resource Manager. After that, validate that there are no pods called "azuredefender-XXXXX" on the cluster by running the following command with the `kubeconfig` file pointed to your cluster: 

    ```console
    kubectl get pods -n azuredefender
    ```

    It might take a few minutes for the pods to be deleted.

### [**REST API**](#tab/k8s-remove-api)

### Use REST API to remove the Defender extension 

To remove the extension using the REST API, run the following DELETE command:

```rest
DELETE https://management.azure.com/subscriptions/{{Subscription Id}}/resourcegroups/{{Resource Group}}/providers/Microsoft.Kubernetes/connectedClusters/{{Cluster Name}}/providers/Microsoft.KubernetesConfiguration/extensions/microsoft.azuredefender.kubernetes?api-version=2020-07-01-preview
```

| Name            | In   | Required | Type   | Description                                           |
|-----------------|------|----------|--------|-------------------------------------------------------|
| Subscription ID | path | True     | string | Your Azure Arc-enabled Kubernetes cluster's subscription ID |
| Resource Group  | path | True     | string | Your Azure Arc-enabled Kubernetes cluster's resource group  |
| Cluster Name    | path | True     | string | Your Azure Arc-enabled Kubernetes cluster's name            |

For **Authentication**, your header must have a Bearer token (as with other Azure APIs). To get a bearer token, run the following command:

```azurecli
az account get-access-token --subscription <your-subscription-id>
```

The request may take several minutes to complete.

---

## Next steps

This page explained how to deploy the Defender extension for Azure Arc-enabled Kubernetes clusters. Learn more about Microsoft Defender for Cloud's container security features in the following pages:

- [Container security in Defender for Cloud](container-security.md)
- [Introduction to Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md)
- [Protect your Kubernetes workloads](kubernetes-workload-protections.md)
