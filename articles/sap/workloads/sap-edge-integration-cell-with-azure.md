# Onboarding SAP Edge Integration Cell with Azure

[SAP Edge Integration Cell](https://help.sap.com/docs/integration-suite/sap-integration-suite/what-is-sap-integration-suite-edge-integration-cell) is an hybrid integration runtime offered as part of SAP Integration Suite, which enables you to manage APIs and run integration scenarios within your private landscape.

The hybrid deployment model of Edge Integration Cell enables you to:

- Design and monitor your SAP integration content in the cloud.
- Deploy and run your SAP integration content in your private landscape.

Using [Azure Kubernetes Service (AKS)](azure/aks/) SAP Edge Integration Cell may natively run on Azure. Enriching AKS with Azure ARC enables to extend the scenario to on-premises and other cloud providers. Govern from Azure but deploy anywhere.

:::image type="content" source="media/sap-eic/overview.png" alt-text="SAP Edge Integration Cell architecture with Azure and Azure ARC":::

This article builds on top of SAP's documentation and walks you through the deployment considerations and Azure best practices.

Use [the accelerator project](https://github.com/Azure/sap-edge-integration-cell-on-azure-accelerator) for SAP Edge Integration Cell with Azure to get started quickly and discover blue prints for production-ready deployments. It leverages terraform as common language to deploy the Azure infrastructure and the SAP Business Technology Platform (BTP) footprint at the same time.

## Setup Considerations

Find the latest info on supported Azure services for SAP Edge Integration Cell on SAP note [3247839 | Prerequisites for installing SAP Integration Suite Edge Integration Cell](https://me.sap.com/notes/3247839). In addition, follow SAP's [onboarding guide](https://help.sap.com/docs/integration-suite/sap-integration-suite/before-you-start).

Consider the following Microsoft Learn resources for AKS for a successful deployment in production. These apply independently of the SAP workload.

- [Architecture best practices and design checklists for Azure Kubernetes Service (AKS) | Well Architected Framework](azure/well-architected/service-guides/azure-kubernetes-service)
- [Baseline architecture for an Azure Kubernetes Service (AKS) cluster | Architecture Center](azure/architecture/reference-architectures/containers/aks/baseline-aks)

> [!NOTE]
> Be aware that network traffic between SAP BTP services deployed on Azure and other Azure services like AKS remains on the Microsoft backbone. This means that even the SAP Edge Integration Cell heartbeat stays private. Learn more [here](azure/virtual-network/virtual-networks-udr-overview#default-route).

### Deployment Options

| Deployment Type | Kubernetes Platform | Supporting Azure Services | Notes |
|-----------------|---------------------|---------------------|-------|
| **Cloud-Native** | Azure Kubernetes Service (AKS) | Azure Database for PostgreSQL, Azure Redis Cache | Recommended for production; supports autoscaling and HA setups |
| **On-Premises** | Azure ARC-enabled Kubernetes Service | Azure ARC |  |
| **Dev/Test** | Azure Kubernetes Service (single node pool) | none | Use SAP's built in PostgreSQL and Cache option for quickest deployment; not suitable for production |

It is recommended to use Azure PaaS services for a fully platform-managed experience and optimal SLA.

## Next Steps

- Use [the accelerator project](https://github.com/Azure/sap-edge-integration-cell-on-azure-accelerator) for SAP Edge Integration Cell with Azure to get started quickly.
- See the latest [SAP Edge Integration Cell documentation](https://help.sap.com/docs/integration-suite/sap-integration-suite/what-is-sap-integration-suite-edge-integration-cell) for more information on the product and its capabilities.
