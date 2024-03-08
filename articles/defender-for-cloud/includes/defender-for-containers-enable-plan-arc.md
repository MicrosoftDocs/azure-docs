---
ms.author: dacurwin
author: dcurwin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 06/04/2023

---
## Enable the plan

**To enable the plan**:

1. From Defender for Cloud's menu, open the Settings page and select the relevant subscription.

1. In the [Defender plans page](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/pricingTier), select **Defender for Containers** and select **Settings**.
:::image type="content" source="../media/defender-for-containers-enable-plan-gke/containers-settings.png" alt-text="screenshot of Defender plans page." lightbox="../media/defender-for-containers-enable-plan-gke/containers-settings.png":::

    > [!TIP]
    > If the subscription already has Defender for Kubernetes or Defender for container registries enabled, an update notice is shown. Otherwise, the only option will be **Defender for Containers**.
    >
    > :::image type="content" source="../media/release-notes/defender-plans-deprecated-indicator.png" alt-text="Defender for container registries and Defender for Kubernetes plans showing 'Deprecated' and upgrade information.":::

1. Turn the relevant component on to enable it.

    :::image type="content" source="../media/defender-for-containers-enable-plan-gke/container-components-on.png" alt-text="screenshot of turning on components." lightbox="../media/defender-for-containers-enable-plan-gke/container-components-on.png":::

    > [!Note]
    > When you turn off Defender for Containers, the components are set to off and are not deployed to any more containers but they are not removed from containers that they are already installed on.

By default, when enabling the plan through the Azure portal, [Microsoft Defender for Containers](../defender-for-containers-introduction.md) is configured to automatically install required components to provide the protections offered by plan, including the assignment of a default workspace.

 If you want to disable automatic installation of components during the onboarding process, select **Edit configuration** for the **Containers** plan. The Advanced options will appear, and you can disable automatic installation for each component.

In addition, you can modify this configuration from the [Defender plans page](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/pricingTier).

> [!NOTE]
> If you choose to **disable the plan** at any time after enabling it through the portal as shown above, you'll need to manually remove Defender for Containers components deployed on your clusters.

You can [assign a custom workspace](../defender-for-containers-enable.md?tabs=aks-deploy-portal%2Ck8s-deploy-asc%2Ck8s-verify-asc%2Ck8s-remove-arc%2Caks-removeprofile-api&pivots=defender-for-container-arc#assign-a-custom-workspace) through Azure Policy.

If you disable the automatic installation of any component, you can easily deploy the component to one or more clusters using the appropriate recommendation:

- Policy Add-on for Kubernetes - [Azure Kubernetes Service clusters should have the Azure Policy Add-on for Kubernetes installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/08e628db-e2ed-4793-bc91-d13e684401c3)
- Azure Kubernetes Service profile - [Azure Kubernetes Service clusters should have Defender profile enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/56a83a6e-c417-42ec-b567-1e6fcb3d09a9)
- Azure Arc-enabled Kubernetes extension - [Azure Arc-enabled Kubernetes clusters should have the Defender extension installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3ef9848c-c2c8-4ff3-8b9c-4c8eb8ddfce6)
- Azure Arc-enabled Kubernetes Policy extension - [Azure Arc-enabled Kubernetes clusters should have the Azure Policy extension installed](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0642d770-b189-42ef-a2ce-9dcc3ec6c169)

Learn more about the [roles used to provision Defender for Containers extensions](../permissions.md#roles-used-to-automatically-provision-agents-and-extensions).

## Prerequisites

Before deploying the agent, ensure you:

- [Connect the Kubernetes cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md)
- Complete the [pre-requisites listed under the generic cluster extensions documentation](../../azure-arc/kubernetes/extensions.md#prerequisites).

## Deploy the Defender agent

You can deploy the Defender agent using a range of methods. For detailed steps, select the relevant tab.

### [**Azure portal**](#tab/k8s-deploy-asc)

### Use the fix button from the Defender for Cloud recommendation

A dedicated Defender for Cloud recommendation provides:

- **Visibility** about which of your clusters has the Defender agent deployed
- **Fix** button to deploy it to those clusters without the agent

1. From Microsoft Defender for Cloud's recommendations page, open the **Enable enhanced security** security control.

1. Use the filter to find the recommendation named **Azure Arc-enabled Kubernetes clusters should have Defender for Cloud's extension installed**.

    :::image type="content" source="../media/defender-for-kubernetes-azure-arc/extension-recommendation.png" alt-text="Microsoft Defender for Cloud's recommendation for deploying the Defender agent for Azure Arc-enabled Kubernetes clusters." lightbox="../media/defender-for-kubernetes-azure-arc/extension-recommendation.png":::

    > [!TIP]
    > Notice the **Fix** icon in the actions column

1. Select the agent to see the details of the healthy and unhealthy resources - clusters with and without the agent.

1. From the unhealthy resources list, select a cluster and select **Remediate** to open the pane with the remediation options.

1. Select the relevant Log Analytics workspace and select **Remediate x resource**.

    :::image type="content" source="../media/defender-for-kubernetes-azure-arc/security-center-deploy-extension.gif" alt-text="Deploy Defender agent for Azure Arc with Defender for Cloud's 'fix' option.":::

### [**Azure CLI**](#tab/k8s-deploy-cli)

### Use Azure CLI to deploy the Defender agent

1. Sign in to Azure:

    ```azurecli
    az login
    az account set --subscription <your-subscription-id>
    ```

    > [!IMPORTANT]
    > Ensure that you use the same subscription ID for ``<your-subscription-id>`` as the one that was used when connecting your cluster to Azure Arc.

1. Run the following command to deploy the agent on top of your Azure Arc-enabled Kubernetes cluster:

    ```azurecli
    az k8s-extension create --name microsoft.azuredefender.kubernetes --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <resource-group> --extension-type microsoft.azuredefender.kubernetes
    ```

    A description of all the supported configuration settings on the Defender agent type is given below:

    | Property | Description |
    |----------|-------------|
    | logAnalyticsWorkspaceResourceID | **Optional**. Full resource ID of your own Log Analytics workspace.<br>When not provided, the default workspace of the region will be used.<br><br>To get the full resource ID, run the following command to display the list of workspaces in your subscriptions in the default JSON format:<br>```az resource list --resource-type Microsoft.OperationalInsights/workspaces -o json```<br><br>The Log Analytics workspace resource ID has the following syntax:<br>/subscriptions/{your-subscription-id}/resourceGroups/{your-resource-group}/providers/Microsoft.OperationalInsights/workspaces/{your-workspace-name}. <br>Learn more in [Log Analytics workspaces](../../azure-monitor/logs/log-analytics-workspace-overview.md) |
    | auditLogPath |**Optional**. The full path to the audit log files.<br>When not provided, the default path ``/var/log/kube-apiserver/audit.log`` will be used.<br>For AKS Engine, the standard path is ``/var/log/kubeaudit/audit.log`` |

    The below command shows an example usage of all optional fields:

    ```azurecli
    az k8s-extension create --name microsoft.azuredefender.kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-rg> --extension-type microsoft.azuredefender.kubernetes --configuration-settings logAnalyticsWorkspaceResourceID=<log-analytics-workspace-resource-id> auditLogPath=<your-auditlog-path>
    ```

### [**Resource Manager**](#tab/k8s-deploy-resource-manager)

### Use Azure Resource Manager to deploy the Defender agent

To use Azure Resource Manager to deploy the Defender agent, you'll need a Log Analytics workspace on your subscription. Learn more in [Log Analytics workspaces](../../azure-monitor/logs/log-analytics-workspace-overview.md).

You can use the **azure-defender-extension-arm-template.json** Resource Manager template from Defender for Cloud's [installation examples](https://aka.ms/kubernetes-extension-installation-examples).

> [!TIP]
> If you're new to Resource Manager templates, start here: [What are Azure Resource Manager templates?](../../azure-resource-manager/templates/overview.md)

### [**REST API**](#tab/k8s-deploy-api)

### Use REST API to deploy the Defender agent

To use the REST API to deploy the Defender agent, you'll need a Log Analytics workspace on your subscription. Learn more in [Log Analytics workspaces](../../azure-monitor/logs/log-analytics-workspace-overview.md).

> [!TIP]
> The simplest way to use the API to deploy the Defender agent is with the supplied **Postman Collection JSON** example from Defender for Cloud's [installation examples](https://aka.ms/kubernetes-extension-installation-examples).

- To modify the Postman Collection JSON, or to manually deploy the agent with the REST API, run the following PUT command:

    ```rest
    PUT https://management.azure.com/subscriptions/{{Subscription Id}}/resourcegroups/{{Resource Group}}/providers/Microsoft.Kubernetes/connectedClusters/{{Cluster Name}}/providers/Microsoft.KubernetesConfiguration/extensions/microsoft.azuredefender.kubernetes?api-version=2020-07-01-preview
    ```

    Where:

    | Name            | In   | Required | Type   | Description                                                                      |
    |-----------------|------|----------|--------|----------------------------------------------------------------------------------|
    | Subscription ID | Path | True     | String | Your Azure Arc-enabled Kubernetes resource's subscription ID                     |
    |Resource Group   | Path | True     | String | Name of the resource group containing your Azure Arc-enabled Kubernetes resource |
    | Cluster Name    | Path | True     | String | Name of your Azure Arc-enabled Kubernetes resource                               |

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

To verify that your cluster has the Defender agent installed on it, follow the steps in one of the tabs below:

### [**Azure portal - Defender for Cloud**](#tab/k8s-verify-asc)

### Use Defender for Cloud recommendation to verify the status of your agent

1. From Microsoft Defender for Cloud's recommendations page, open the  **Enable Microsoft Defender for Cloud** security control.

1. Select the recommendation named **Azure Arc-enabled Kubernetes clusters should have Microsoft Defender for Cloud's extension installed**.

    :::image type="content" source="../media/defender-for-kubernetes-azure-arc/extension-recommendation.png" alt-text="Microsoft Defender for Cloud's recommendation for deploying the Defender agent for Azure Arc-enabled Kubernetes clusters." lightbox="../media/defender-for-kubernetes-azure-arc/extension-recommendation.png":::

1. Check that the cluster on which you deployed the agent is listed as **Healthy**.

### [**Azure portal - Azure Arc**](#tab/k8s-verify-arc)

### Use the Azure Arc pages to verify the status of your agent

1. From the Azure portal, open **Azure Arc**.
1. From the infrastructure list, select **Kubernetes clusters** and then select the specific cluster.
1. Open the extensions page. The extensions on the cluster are listed. To confirm whether the Defender agent was installed correctly, check the **Install status** column.

    :::image type="content" source="../media/defender-for-kubernetes-azure-arc/extension-installed-clusters-page.png" alt-text="Azure Arc page for checking the status of all installed extensions on a Kubernetes cluster." lightbox="../media/defender-for-kubernetes-azure-arc/extension-installed-clusters-page.png":::

1. For more details, select the extension.

    :::image type="content" source="../media/defender-for-kubernetes-azure-arc/extension-details-page.png" alt-text="Full details of an Azure Arc extension on a Kubernetes cluster.":::

### [**Azure CLI**](#tab/k8s-verify-cli)

### Use Azure CLI to verify that the agent is deployed

1. Run the following command on Azure CLI:

    ```azurecli
    az k8s-extension show --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-rg> --name microsoft.azuredefender.kubernetes
    ```

1. In the response, look for "extensionType": "microsoft.azuredefender.kubernetes" and "installState": "Installed".

    > [!NOTE]
    > It might show "installState": "Pending" for the first few minutes.

1. If the state shows **Installed**, run the following command on your machine with the `kubeconfig` file pointed to your cluster to check that all pods under the mdc namespace are in the 'Running' state:

    ```console
    kubectl get pods -n mdc
    ```

### [**REST API**](#tab/k8s-verify-api)

### Use the REST API to verify that the agent is deployed

To confirm a successful deployment, or to validate the status of your agent at any time:

1. Run the following GET command:

    ```rest
    GET https://management.azure.com/subscriptions/{{Subscription Id}}/resourcegroups/{{Resource Group}}/providers/Microsoft.Kubernetes/connectedClusters/{{Cluster Name}}/providers/Microsoft.KubernetesConfiguration/extensions/microsoft.azuredefender.kubernetes?api-version=2020-07-01-preview
    ```

1. In the response, look in "extensionType": "microsoft.azuredefender.kubernetes" for "installState": "Installed".

    > [!TIP]
    > It might show "installState": "Pending" for the first few minutes.

1. If the state shows **Installed**, run the following command on your machine with the `kubeconfig` file pointed to your cluster to check that all pods under the mdc namespace are in 'Running' state:

    ```console
    kubectl get pods -n mdc
    ```

---
