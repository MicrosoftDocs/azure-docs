---
title: Create an Azure Arc-enabled PostgreSQL Hyperscale server group from the Azure portal
description: You can create an Azure Arc-enabled PostgreSQL Hyperscale server group from the Azure portal.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-postgresql
author: grrlgeek
ms.author: jeschult
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create an Azure Arc-enabled PostgreSQL Hyperscale server group from the Azure portal

You can create an Azure Arc-enabled PostgreSQL Hyperscale server group from the Azure portal. To do so, follow the steps in this article.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Get started

You might want read the following important topics before you proceed. (If you're already familiar with these topics, you can skip.)

- [Overview of Azure Arc-enabled data services](overview.md)
- [Connectivity modes and requirements](connectivity.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)

If you prefer to try things out without provisioning a full environment yourself, get started quickly with [Azure Arc jumpstart](https://azurearcjumpstart.io/azure_arc_jumpstart/azure_arc_data/). You can do this on Azure Kubernetes Service (AKS), AWS Elastic Kubernetes Service (EKS), Google Cloud Kubernetes Engine (GKE), or in an Azure virtual machine (VM).

## Deploy an Azure Arc data controller

Before you deploy an Azure Arc-enabled PostgreSQL Hyperscale server group that you operate from the Azure portal, you must first deploy an Azure Arc data controller. You must configure the data controller to use the *directly connected* mode.

To deploy an Azure Arc data controller, complete the instructions in these articles:

1. [Deploy data controller - directly connected mode (prerequisites)](create-data-controller-direct-prerequisites.md)
1. [Deploy Azure Arc data controller in directly connected mode from Azure portal](create-data-controller-direct-azure-portal.md)

## Temporary step for OpenShift users only

If you're using Red Hat OpenShift, you must implement this step before moving to the next one. To deploy an Azure Arc-enabled PostgreSQL Hyperscale server group onto Red Hat OpenShift in a project other than the default, run the following command against your cluster. This command updates the security constraints and grants the necessary privileges to the service accounts that will run your Hyperscale server group. The security context constraint (SCC) called `arc-data-scc` is the one you added when you deployed the Azure Arc data controller.

```Console
oc adm policy add-scc-to-user arc-data-scc -z <server-group-name> -n <namespace name>
```

`server-group-name` is the name of the server group you will create during the next step.

For more details on SCCs in OpenShift, refer to the [OpenShift documentation](https://docs.openshift.com/container-platform/4.2/authentication/managing-security-context-constraints.html). 

## Deploy an Azure Arc-enabled PostgreSQL Hyperscale server group from the Azure portal

You have now deployed an Azure Arc data controller that uses the directly connected mode, as described earlier in the article. You can't operate an Azure Arc-enabled PostgreSQL Hyperscale server group from the Azure portal if you deployed it to an Azure Arc data controller configured to use the *indirectly connected* mode. 

Next, you choose one the options in the following sections.

### Deploy from Azure Marketplace

1. Go to [the Azure portal](https://portal.azure.com).
2. In Azure Marketplace, search for **azure arc postgres**, and select **Azure Arc-enabled PostgreSQL Hyperscale server groups**.
3. Select **+ Create** in the upper-left corner of the page. 
4. Fill in the form, like you deploy any other Azure resource.

### Deploy from Azure Database for PostgreSQL deployment option page

1. Go to the following URL: `https://portal.azure.com/#create/Microsoft.PostgreSQLServer`.
1. Select **Azure Arc-enabled PostgreSQL Hyperscale (Preview)** in the lower right of the page.
1. Fill in the form, like you deploy any other Azure resource.

### Deploy from the Azure Arc center

1. Go to the following URL: `https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/overview`.
1. From the **Deploy Azure services** tile, select **Deploy**. Then, from the **PostgreSQL Hyperscale (Preview)** tile, select **Deploy**. Alternatively, from the left pane, in the **Services** section, select **PostgreSQL Hyperscale (Preview)**. Then select **+ Create** in the upper left of the pane.

### Important considerations

Be aware of the following considerations when you're deploying:

- **The number of worker nodes you want to deploy to scale out and potentially reach better performances.** For more information, see [Concepts for distributing data with Azure Arc-enabled PostgreSQL Hyperscale server group](concepts-distributed-postgres-hyperscale.md). 

  The following table indicates the range of supported values, and what form of deployment you get with them. For example, if you want to deploy a server group with two worker nodes, indicate *2*. This will create three pods, one for the coordinator node or instance, and two for the worker nodes or instances (one for each of the workers).

  |You need   |Shape of the server group you will deploy   |Number of worker nodes to indicate   |Note   |
  |---|---|---|---|
  |A scaled-out form of Azure Arc-enabled PostgreSQL Hyperscale to satisfy the scalability needs of your applications.   |Three or more instances of Azure Arc-enabled PostgreSQL Hyperscale. One is the coordinator, and *n* are workers, with *n >=2*.   |*n*, with *n>=2*.   |The Citus extension that provides the Hyperscale capability is loaded.   |
  |A basic form of Azure Arc-enabled PostgreSQL Hyperscale. You want to do functional validation of your application, at minimum cost. You don't need performance and scalability validation.   |One instance of Azure Arc-enabled PostgreSQL Hyperscale. The instance serves as both coordinator and worker.   |*0*, and add Citus to the list of extensions to load.   |The Citus extension that provides the Hyperscale capability is loaded.   |
  |A simple instance of Azure Arc-enabled PostgreSQL Hyperscale that is ready to scale out when you need it.   |One instance of Azure Arc-enabled PostgreSQL Hyperscale. It isn't yet aware of the semantic for coordinator and worker. To scale it out after deployment, edit the configuration, increase the number of worker nodes, and distribute the data.   |*0*.   |The Citus extension that provides the Hyperscale capability is present on your deployment, but isn't yet loaded.   |
  |   |   |   |   |

    This table is demonstrated in the following figure:

    :::image type="content" source="media/postgres-hyperscale/deployment-parameters.png" alt-text="Diagram that depicts PostgreSQL Hyperscale worker node parameters and associated architecture." border="false":::  

    Although you can indicate *1* worker, it's not a good idea to do so. This deployment doesn't provide you with much value. With it, you get two instances of Azure Arc-enabled PostgreSQL Hyperscale: one coordinator and one worker. You don't scale out the data because you deploy a single worker. As such, you don't see an increased level of performance and scalability.

- **The storage classes you want your server group to use.** It's important to set the storage class right at the time you deploy a server group. You can't change this setting after you deploy. If you don't indicate storage classes, you get the storage classes of the data controller by default.    
    - To set the storage class for the data, indicate the parameter `--storage-class-data` or `-scd`, followed by the name of the storage class.
    - To set the storage class for the logs, indicate the parameter `--storage-class-logs` or `-scl`, followed by the name of the storage class.
    - To set the storage class for the backups, you either indicate a storage class or a volume claim mount. A *volume claim mount* is a pair of an existing persistent volume claim (in the same namespace) and a volume type (and optional metadata depending on the volume type), separated by colon. The persistent volume is mounted in each pod for the Azure Arc-enabled PostgreSQL Hyperscale server group.
        - If you want to do only full database restores, set the parameter `--storage-class-backups` or `-scb`, followed by the name of the storage class.
        - If you want to do both full database restores and point-in-time restores, set the parameter `--volume-claim-mounts`, followed by the name of a volume claim and a volume type.

## Next steps

- [Get connection endpoints and connection strings](get-connection-endpoints-and-connection-strings-postgres-hyperscale.md)
- [Scale out your Azure Arc-enabled for PostgreSQL Hyperscale server group](scale-out-in-postgresql-hyperscale-server-group.md)
- [Storage configuration and Kubernetes storage concepts](storage-configuration.md)
- [Expanding persistent volume claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)
- [Kubernetes resource model](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/resources.md#resource-quantities)
