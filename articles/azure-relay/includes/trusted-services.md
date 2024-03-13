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
