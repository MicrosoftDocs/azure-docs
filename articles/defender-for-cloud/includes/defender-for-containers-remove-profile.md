---
ms.service: defender-for-cloud
ms.custom: ignite-2022
ms.topic: include
ms.date: 06/01/2023
ms.author: dacurwin
author: dcurwin
---
## Remove the Defender agent

To remove this - or any - Defender for Cloud extension, it's not enough to turn off auto provisioning:

- **Enabling** auto provisioning, potentially impacts *existing* and *future* machines.
- **Disabling** auto provisioning for an extension, only affects the *future* machines - nothing is uninstalled by disabling auto provisioning.

Nevertheless, to ensure the Defender for Containers components aren't automatically provisioned to your resources from now on, disable auto provisioning of the extensions as explained in [Configure auto provisioning for agents and extensions from Microsoft Defender for Cloud](../monitoring-components.md).

You can remove the extension using the REST API or a Resource Manager template as explained in the tabs below.

### [**REST API**](#tab/aks-removeprofile-api)

### Use REST API to remove the Defender agent from AKS

To remove the extension using the REST API, run the following PUT command:

```rest
https://management.azure.com/subscriptions/{{SubscriptionId}}/resourcegroups/{{ResourceGroup}}/providers/Microsoft.ContainerService/managedClusters/{{ClusterName}}?api-version={{ApiVersion}}
```

| Name           | Description                        | Mandatory |
|----------------|------------------------------------|-----------|
| SubscriptionId | Cluster's subscription ID          | Yes       |
| ResourceGroup  | Cluster's resource group           | Yes       |
| ClusterName    | Cluster's name                     | Yes       |
| ApiVersion     | API version, must be >= 2022-06-01 | Yes       |

Request body:

```rest
{
  "location": "{{Location}}",
  "properties": {
    "securityProfile": {
            "defender": {
                "securityMonitoring": {
                    "enabled": false
                }
            }
        }
    }
}
```

Request body parameters:

| Name | Description | Mandatory |
|--|--|--|
| location | Cluster's location | Yes |
| properties.securityProfile.defender.securityMonitoring.enabled | Determines whether to enable or disable Microsoft Defender for Containers on the cluster | Yes |

### [**Azure CLI**](#tab/k8s-remove-cli)

### Use Azure CLI to remove the Defender agent

1. Remove the Microsoft Defender for  with the following commands:

    ```azurecli
    az login
    az account set --subscription <subscription-id>
    az aks update --disable-defender --resource-group <your-resource-group> --name <your-cluster-name>
    ```

    Removing the extension might take a few minutes.

1. To verify that the extension was successfully removed, run the following command:

    ```console
    kubectl get pods -n kube-system | grep microsoft-defender
    ```

    When the extension is removed, you should see that no pods are returned in the `get pods` command. It might take a few minutes for the pods to be deleted.

### [**Resource Manager**](#tab/aks-removeprofile-resource-manager)

### Use Azure Resource Manager to remove the Defender agent from AKS

To use Azure Resource Manager to remove the Defender agent, you'll need a Log Analytics workspace on your subscription. Learn more in [Log Analytics workspaces](../../azure-monitor/logs/log-analytics-workspace-overview.md).

> [!TIP]
> If you're new to Resource Manager templates, start here: [What are Azure Resource Manager templates?](../../azure-resource-manager/templates/overview.md)

The relevant template and parameters to remove the Defender agent from AKS are:

```json
{ 
    "type": "Microsoft.ContainerService/managedClusters", 
    "apiVersion": "2022-06-01", 
    "name": "string", 
    "location": "string",
    "properties": {
        …
        "securityProfile": { 
            "defender": { 
                "securityMonitoring": {
                    "enabled": false
                }
            }
        }
    }
}
```

---
