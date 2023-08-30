---
title: Azure Kubernetes Service (AKS) for Edge (preview)
description: Learn how to deploy an Azure Kubernetes Service (AKS) for Edge cluster
author: moushumig
ms.author: moghosal
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 04/04/2023
---

# Azure Kubernetes Service for Edge (preview)

Azure Kubernetes Service (AKS) for Edge provides an extensive and sophisticated set of capabilities that make it simpler to deploy and operate a fully managed Kubernetes cluster in an edge computing scenario.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## What are Edge Zones and Azure public multi-access edge compute?

Edge Zones are small, localized footprints of Azure in a metropolitan area designed to provide low latency connectivity for applications that require the highest level of performance.

Azure public multi-access edge compute (MEC) sites are a type of Edge Zone that are placed in or near mobile operators' data centers in metro areas, and are designed to run workloads that require low latency while being attached to the mobile network. Azure public MEC is offered in partnership with the operators. The placement of the infrastructure offers lower latency for applications that are accessed from mobile devices connected to the 5G mobile network.

Some of the industries and use cases where Azure public MEC can provide benefits are:

* Media streaming and content delivery
* Real-time analytics and inferencing via artificial intelligence and machine learning
* Rendering for mixed reality
* Connected automobiles
* Healthcare
* Immersive gaming experiences
* Low latency applications for the retail industry

To learn more, see the [Azure public MEC Overview][public-mec-overview].

## What is AKS for Edge?

Edge Zones provide a suite of Azure services for managing and deploying applications in edge computing environments. One of the key services offered is Azure Kubernetes Service (AKS) for Edge. AKS for Edge enables organizations to meet the unique needs of edge computing while leveraging the container orchestration and management capabilities of AKS, making the deployment and management of edge applications much simpler.

Just like a typical AKS deployment, the Azure platform is responsible for maintaining the AKS control plane and providing the infrastructure, while your organization retains control over the worker nodes that run the applications.

:::image type="content" source="./media/edge-zones/aks-for-edge-architecture-inline.png" alt-text="An architecture diagram of an AKS for edge deployment, showing that the control plane is deployed in an Azure region while agent nodes are deployed in an Azure public MEC Edge Zone." lightbox="./media/edge-zones/aks-for-edge-architecture-full.png":::

Creating an AKS for Edge cluster uses an optimized architecture that is specifically tailored to meet the unique needs and requirements of edge-based applications and workloads. The control plane of the clusters is created, deployed, and configured in the closest Azure region, while the agent nodes and node pools attached to the cluster are located in an Azure Public MEC Edge Zone.

The components present in an AKS for Edge cluster are identical to those in a typical cluster deployed in an Azure region, ensuring that the same level of functionality and performance is maintained. For more information on these components, see [Kubernetes core concepts for AKS][concepts-cluster-workloads].

## Edge Zone and parent region locations

Azure public MEC Edge Zone sites are associated with a parent Azure region that hosts all the control plane functions associated with the services running in the Azure public MEC. The following table lists the Azure public MEC sites, along with their Edge Zone ID and associated parent region for locations that are Generally Available to deploy an AKS cluster to:

| Telco provider | Azure public MEC name | Edge Zone ID | Parent region |
| -------------- | --------------------- | ------------ | ------------- |
| AT&T | ATT Atlanta A | attatlanta1 | East US 2 |
| AT&T | ATT Dallas A | attdallas1 | South Central US |
| AT&T | ATT Detroit A | attdetroit1 | Central US |

For the latest available Public MEC Edge Zones, please refer to [Azure public MEC Locations](../public-multi-access-edge-compute-mec/overview.md)

## Deploy a cluster in an Edge Zone location

### Prerequisites

* Before you can deploy an AKS for Edge cluster, your subscription needs to have access to the targeted Edge Zone location. This access is provided through our onboarding process, done by creating a support request via the Azure portal or by filling out the [Azure public MEC sign-up form][public-mec-sign-up]

* Your cluster must be running Kubernetes version 1.24 or later

* The identity you're using to create your cluster must have the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)](./concepts-identity.md)

### Limitations

* AKS for Edge allows for autoscaling only up to 100 nodes in a node pool

### Resource constraints

While AKS is fully supported in Azure public MEC Edge Zones, resource constraints may still apply:

* In all Edge Zones, the maximum node count is 100

* In Azure public MEC Edge Zones, only selected VM SKUs are offered. See the list of available SKUs, as well as additional constraints and limitations, in [Azure public MEC key concepts][public-mec-constraints]

Deploying an AKS cluster in an Edge Zone is similar to deploying an AKS cluster in any other region. All resource providers provide a field named [`extendedLocation`](/javascript/api/@azure/arm-compute/extendedlocation), which you can use to deploy resources in an Edge Zone. This allows for precise and targeted deployment of your AKS cluster.

### [Resource Manager Template](#tab/azure-resource-manager)

A parameter called `extendedLocation` should be used to specify the desired edge zone:

```json
"extendedLocation": {
    "name": "<edge-zone-id>",
    "type": "EdgeZone",
},
```

The following example is an Azure Resource Manager template (ARM template) that will deploy a new cluster in an Edge Zone. Provide your own values for the following template parameters:

* **Subscription**: Select an Azure subscription.

* **Resource group**: Select Create new. Enter a unique name for the resource group, such as myResourceGroup, then choose OK.

* **Location**: Select a location, such as East US.

* **Cluster name**: Enter a unique name for the AKS cluster, such as myAKSCluster.

* **DNS prefix**: Enter a unique DNS prefix for your cluster, such as myakscluster.

* **Linux Admin Username**: Enter a username to connect using SSH, such as azureuser.

* **SSH RSA Public Key**: Copy and paste the public part of your SSH key pair (by default, the contents of the `~/.ssh/id_rsa.pub` file).

If you're unfamiliar with ARM templates, see the tutorial on [deploying a local ARM template][arm-template-deploy].

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.9.1.41621",
      "templateHash": "2637152180661081755"
    }
  },
  "parameters": {
    "clusterName": {
      "type": "string",
      "defaultValue": "myAKSCluster",
      "metadata": {
        "description": "The name of the Managed Cluster resource."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "The location of the Managed Cluster resource."
      }
    },
    "edgeZoneName": {
      "type": "String",
      "metadata": {
        "description": "The name of the Edge Zone"
      }
    },
    "dnsPrefix": {
      "type": "string",
      "metadata": {
        "description": "Optional DNS prefix to use with hosted Kubernetes API server FQDN."
      }
    },
    "osDiskSizeGB": {
      "type": "int",
      "defaultValue": 0,
      "maxValue": 1023,
      "minValue": 0,
      "metadata": {
        "description": "Disk size (in GB) to provision for each of the agent pool nodes. This value ranges from 0 to 1023. Specifying 0 will apply the default disk size for that agentVMSize."
      }
    },
    "agentCount": {
      "type": "int",
      "defaultValue": 3,
      "maxValue": 50,
      "minValue": 1,
      "metadata": {
        "description": "The number of nodes for the cluster."
      }
    },
    "agentVMSize": {
      "type": "string",
      "defaultValue": "standard_d2s_v3",
      "metadata": {
        "description": "The size of the Virtual Machine."
      }
    },
    "linuxAdminUsername": {
      "type": "string",
      "metadata": {
        "description": "User name for the Linux Virtual Machines."
      }
    },
    "sshRSAPublicKey": {
      "type": "string",
      "metadata": {
        "description": "Configure all linux machines with the SSH RSA public key string. Your key should include three parts, for example 'ssh-rsa AAAAB...snip...UcyupgH azureuser@linuxvm'"
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2022-05-02-preview",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('location')]",
      "extendedLocation": {
        "name": "[parameters('edgeZoneName')]",
        "type": "EdgeZone"
      }
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "dnsPrefix": "[parameters('dnsPrefix')]",
        "agentPoolProfiles": [
          {
            "name": "agentpool",
            "osDiskSizeGB": "[parameters('osDiskSizeGB')]",
            "count": "[parameters('agentCount')]",
            "vmSize": "[parameters('agentVMSize')]",
            "osType": "Linux",
            "mode": "System"
          }
        ],
        "linuxProfile": {
          "adminUsername": "[parameters('linuxAdminUsername')]",
          "ssh": {
            "publicKeys": [
              {
                "keyData": "[parameters('sshRSAPublicKey')]"
              }
            ]
          }
        }
      }
    }
  ],
  "outputs": {
    "controlPlaneFQDN": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.ContainerService/managedClusters', parameters('clusterName'))).fqdn]"
    }
  }
}
```

### [Azure CLI](#tab/azure-cli)

Set the following variables for use in the deployment, filling in your own values:

```bash
SUBSCRIPTION="<your-subscription>"
RG_NAME="myResourceGroup"
CLUSTER_NAME="myAKSCluster"
EDGE_ZONE_NAME="<edge-zone-id>"
LOCATION="<parent-region>" # Ensure this location corresponds to the parent region for your targeted Edge Zone
```

After making sure you're logged in and using the appropriate subscription, use [`az aks create`][az-aks-create] to deploy the cluster, specifying the targeted Edge Zone with the `--edge-zone` property.

```azurecli-interactive
# Log in to Azure
az login

# Set the subscription you want to create the cluster on
az account set --subscription $SUBSCRIPTION 

# Create the resource group
az group create -n $RG_NAME -l $LOCATION

# Deploy the cluster in your designated Edge Zone
az aks create -g $RG_NAME -n $CLUSTER_NAME --edge-zone $EDGE_ZONE_NAME --location $LOCATION
```

### [Azure portal](#tab/azure-portal)

In this section you'll learn how to deploy a Kubernetes cluster in the Edge Zone.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Azure portal menu or from the **Home** page, select **Create a resource**.

3. Select **Containers** > **Kubernetes Service**.

4. On the **Basics** page, configure the following options:

    - **Project details**:
        * Select an Azure **Subscription**.
        * Select or create an Azure **Resource group**, such as *myResourceGroup*.
    - **Cluster details**:
        * Ensure the **Preset configuration** is *Standard ($$)*. For more information on preset configurations, see [Cluster configuration presets in the Azure portal][preset-config].

            :::image type="content" source="./learn/media/quick-kubernetes-deploy-portal/cluster-preset-options.png" alt-text="Screenshot of Create AKS cluster - portal preset options.":::

        * Enter a **Kubernetes cluster name**, such as *myAKSCluster*.
        * Select **Deploy to an edge zone** under the region locator for the AKS cluster.
        * Select the Edge Zone targeted for deployment, and leave the default value selected for **Kubernetes version**.
            
            :::image type="content" source="./media/edge-zones/select-edge-zone.png" alt-text="Screenshot of the Edge Zone Context pane for selecting location for AKS cluster in Edge Zone creation.":::

        * Select **99.5%** for **API server availability**.
    - **Primary node pool**:
        * Leave the default values selected or select the **Node size** with VM size supported.
    
        :::image type="content" source="./media/edge-zones/create-edge-zone-aks-cluster.png" alt-text="Screenshot of Create AKS cluster in Edge Zone - provide basic information.":::

    > [!NOTE]
    > You can change the preset configuration when creating your cluster by selecting *Learn more and compare presets* and choosing a different option.

5. Select **Next: Node pools** when complete.

6. Keep the default **Node pools** options. At the bottom of the screen, click **Next: Access**.

7. On the **Access** page, configure the following options:

    - The default value for **Resource identity** is **System-assigned managed identity**. Managed identities provide an identity for applications to use when connecting to resources that support Azure Active Directory (Azure AD) authentication. For more information about managed identities, see [What are managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)
    - The Kubernetes role-based access control (RBAC) option is the default value to provide more fine-grained control over access to the Kubernetes resources deployed in your AKS cluster.

    By default, *Basic* networking is used, and [Container insights](../azure-monitor/containers/container-insights-overview.md) is enabled.

8. Click **Review + create**. When you navigate to the **Review + create** tab, Azure runs validation on the settings that you have chosen. If validation passes, you can proceed to create the AKS cluster by selecting **Create**. If validation fails, then it indicates which settings need to be modified.

9. It takes a few minutes to create the AKS cluster. When your deployment is complete, navigate to your resource by either:
    * Selecting **Go to resource**
    * Browsing to the AKS cluster resource group and selecting the AKS resource. In this example you browse for *myResourceGroup* and select the resource *myAKSCluster*. You can see the Edge Zone locations with the home Azure region in the Location.

    :::image type="content" source="./media/edge-zones/edge-zone-portal-dashboard.png" alt-text="Screenshot of AKS dashboard in the Azure portal showing Edge Zone with the home Azure region.":::

---

## Monitoring

After deploying an AKS for Edge cluster, you can check the status and monitor the cluster's metrics. Monitoring capability is similar to what is available in Azure regions.

:::image type="content" source="./media/edge-zones/monitoring-cluster-in-edge-zone.png" alt-text="Screenshot of monitoring metrics for Edge Zone AKS cluster.":::

## Edge Zone availability

High availability is critical at the edge for a variety of reasons. Edge devices are typically deployed in remote or hard-to-reach locations, making maintenance and repair more difficult and time-consuming. Additionally, these devices handle a large volume of latency-sensitive data and transactions, so any downtime can result in significant losses for businesses. By incorporating traffic management with failover capabilities, organizations can ensure that their edge deployment remains up and running even in the event of disruption, helping to minimize the impact of downtime and maintain business continuity.

For increased availability in the Azure public MEC Edge Zone, it's recommended to deploy your workload with an architecture that incorporates traffic management using Azure Traffic Manager routing profiles. This can help ensure failover to the closest Azure region in the event of a disruption. To learn more, see [Azure Traffic Manager][traffic-manager] or view a sample deployment architecture for [High Availability in Azure public MEC][public-mec-architecture].

## Next steps

After deploying your AKS cluster in an Edge Zone, learn about how you can [configure an AKS cluster][configure-cluster].

<!-- LINKS -->
[public-mec-overview]: ../public-multi-access-edge-compute-mec/overview.md
[public-mec-constraints]: ../public-multi-access-edge-compute-mec/key-concepts.md#azure-services
[configure-cluster]: ./cluster-configuration.md
[arm-template-deploy]: ../azure-resource-manager/templates/deployment-tutorial-local-template.md

[traffic-manager]: ../traffic-manager/traffic-manager-routing-methods.md
[public-mec-architecture]: /azure/architecture/example-scenario/hybrid/public-multi-access-edge-compute-deployment
[public-mec-sign-up]: https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRx4AG8rZKBBDoHEYyD9u_bxUMUVaSlhYMFA2RjUzSklKR0YyREZZNURTRi4u

[az-aks-create]: /cli/azure/aks#az_aks_create
[preset-config]: ./quotas-skus-regions.md#cluster-configuration-presets-in-the-azure-portal