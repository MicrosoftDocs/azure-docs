---
author: memildin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 01/10/2022
ms.author: memildin
---
## Remove the Defender profile

You can remove the profile using the REST API or a Resource Manager template as explained in the tabs below.

### [**REST API**](#tab/aks-removeprofile-api)

### Use REST API to remove the Defender profile from AKS 

To remove the profile using the REST API, run the following PUT command:

```rest
https://management.azure.com/subscriptions/{{SubscriptionId}}/resourcegroups/{{ResourceGroup}}/providers/Microsoft.ContainerService/managedClusters/{{ClusterName}}?api-version={{ApiVersion}}
```

| Name           | Description                        | Mandatory |
|----------------|------------------------------------|-----------|
| SubscriptionId | Cluster's subscription ID          | Yes       |
| ResourceGroup  | Cluster's resource group           | Yes       |
| ClusterName    | Cluster's name                     | Yes       |
| ApiVersion     | API version, must be >= 2021-07-01 | Yes       |
|                |                                    |           |

Request body:
 
```rest
{
  "location": "{{Location}}",
  "properties": {
    "securityProfile": {
            "azureDefender": {
                "enabled": false
            }
        }
    }
}
```
 
Request body parameters:

| Name                                                                     | Description                                                                              | Mandatory |
|--------------------------------------------------------------------------|------------------------------------------------------------------------------------------|-----------|
| location                                                                 | Cluster's location                                                                       | Yes       |
| properties.securityProfile.azureDefender.enabled                         | Determines whether to enable or disable Microsoft Defender for Containers on the cluster | Yes       |
|                                                                          |                                                                                          |           |


### [**Resource Manager**](#tab/aks-removeprofile-resource-manager)

### Use Azure Resource Manager to remove the Defender profile from AKS

To use Azure Resource Manager to remove the Defender profile, you'll need a Log Analytics workspace on your subscription. Learn more in [Log Analytics workspaces](../azure-monitor/logs/data-platform-logs.md#log-analytics-and-workspaces).

> [!TIP]
> If you're new to Resource Manager templates, start here: [What are Azure Resource Manager templates?](../azure-resource-manager/templates/overview.md)

The relevant template and parameters to remove the Defender profile from AKS are:

```
{ 
    "type": "Microsoft.ContainerService/managedClusters", 
    "apiVersion": "2021-07-01", 
    "name": "string", 
    "location": "string",
    "properties": {
        …
        "securityProfile": { 
            "azureDefender": { 
                "enabled": false
            }
        },
    }
}
```

---

## Remove the Defender extension

If you've tried the Defender extension and decided not to use it, or you're troubleshooting a problem and need to uninstall then reinstall, follow the procedure described in [Remove the add-on](../governance/policy/concepts/policy-for-kubernetes.md#remove-the-add-on) from the Azure Policy documentation.
