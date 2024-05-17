---
author: spelluru
ms.service: service-bus-relay
ms.topic: include
ms.date: 06/26/2023
ms.author: spelluru
---

## Trusted Microsoft services
When you enable the **Allow trusted Microsoft services to bypass this firewall** setting, the following services are granted access to your Azure Relay resources:

| Trusted service | Supported usage scenarios | 
| --------------- | ------------------------- | 
| Azure Machine Learning | AML Kubernetes uses Azure Relay to facilitate communication between AML services and the Kubernetes cluster. Azure Relay is a fully managed service that provides secure bi-directional communication between applications hosted on different networks. This makes it ideal for use in private link environments, where communication between Azure resources and on-premises resources is restricted. |
| Azure Arc | Azure Arc-enabled services associated with the Resource Providers above will be able to connect to the hybrid connections in your Azure Relay namespace as a sender without being blocked by the IP firewall rules set on the Azure Relay namespace. `Microsoft.Hybridconnectivity` service creates the hybrid connections in your Azure Relay namespace and provides the connection information to the relevant Arc service based on the scenario. These services communicate only with your Azure Relay namespace if you're using Azure Arc, with the following Azure Services: <br/><br> - Azure Kubernetes<br/> - Azure Machine Learning <br/> - Microsoft Purview |


The other trusted services for Azure Relay can be found below:
- Azure Event Grid
- Azure IoT Hub
- Azure Stream Analytics
- Azure Monitor
- Azure API Management
- Azure Synapse
- Azure Data Explorer
- Azure IoT Central
- Azure Healthcare Data Services
- Azure Digital Twins

>[!NOTE]
> In the **2021-11-01** version or newer of the Microsoft Relay SDK, the **"trustedServiceAccessEnabled"** property is available in the **Microsoft.Relay/namespaces/networkRuleSets** properties to enable Trusted Service Access.
>
> To allow trusted services in Azure Resource Manager templates, include this property in your template:
> ```json
> "trustedServiceAccessEnabled": "True"
> ```

For example, based on the ARM template provided above, we can modify it to include this Network Rule Set property for the enablement of Trusted Services:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespaces_name": {
            "defaultValue": "contosorelay0215",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Relay/namespaces",
            "apiVersion": "2021-11-01",
            "name": "[parameters('namespaces_name')]",
            "location": "East US",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "properties": {}
        },
        {
            "type": "Microsoft.Relay/namespaces/authorizationrules",
            "apiVersion": "2021-11-01",
            "name": "[concat(parameters('namespaces_sprelayns0215_name'), '/RootManageSharedAccessKey')]",
            "location": "eastus",
            "dependsOn": [
                "[resourceId('Microsoft.Relay/namespaces', parameters('namespaces_sprelayns0215_name'))]"
            ],
            "properties": {
                "rights": [
                    "Listen",
                    "Manage",
                    "Send"
                ]
            }
        },
        {
            "type": "Microsoft.Relay/namespaces/networkRuleSets",
            "apiVersion": "2021-11-01",
            "name": "[concat(parameters('namespaces_sprelayns0215_name'), '/default')]",
            "location": "East US",
            "dependsOn": [
                "[resourceId('Microsoft.Relay/namespaces', parameters('namespaces_sprelayns0215_name'))]"
            ],
            "properties": {
                "trustedServiceAccessEnabled": "True",
                "publicNetworkAccess": "Enabled",
                "defaultAction": "Deny",
                "ipRules": [
                    {
                        "ipMask": "172.72.157.204",
                        "action": "Allow"
                    },
                    {
                        "ipMask": "10.1.1.1",
                        "action": "Allow"
                    },
                    {
                        "ipMask": "11.0.0.0/24",
                        "action": "Allow"
                    }
                ]
            }
        }
    ]
}
```
