---
title: Install Event Grid on Azure Arc enabled Kubernetes cluster
description: This article provides steps to install Event Grid on Azure Arc enabled Kubernetes cluster. 
author: jfggdl
manager: JasonWHowell
ms.author: jafernan
ms.subservice: kubernetes
ms.date: 05/11/2021
ms.topic: overview
---

# Install Event Grid on Azure Arc enabled Kubernetes cluster
This article guides you through the steps to install Event Grid on an [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md) cluster.

For brevity, this article refers to "Event Grid on Kubernetes extension" as "Event Grid on Kubernetes" or just "Event Grid".

## Supported Kubernetes distributions
Following are the supported Kubernetes distributions to which Event Grid can be deployed and run.

1. Azure AKS [supported Kubernetes distributions](../../aks/supported-kubernetes-versions.md).
1. RedHat [OpenShift Container Platform](https://www.openshift.com/products/container-platform).

More distributions will be onboarded according to [user's feedback](https://feedback.azure.com/forums/909934-azure-event-grid) and its [support by Azure Arc enabled Kubernetes](../../azure-arc/kubernetes/validation-program.md).

## Event Grid Extension
The operation that installs an Event Grid service instance on a Kubernetes cluster is the creation of an Azure Arc cluster extension, which deploys both an **Event Grid broker** and an **Event Grid operator**. For more information on the function of the broker and operator, see [Event Grid on Kubernetes components](concepts.md#Event_Grid_on_Kubernetes_components). [Azure Arc cluster extension](../../azure-arc/kubernetes/conceptual-extensions.md) feature provides lifecycle management using Azure Resource Manager (ARM) control plane operations to Event Grid deployed to Azure Arc enabled Kubernetes clusters.

> [!NOTE]
> The preview version of the service only supports a single instance of the Event Grid extension on a Kubernetes cluster as the Event Grid extension is currently defined as a cluster-scoped extension. There is no support for namespace-scoped deployments for Event Grid yet that would allow for multiple instances to be deployed to a cluster.  For more information on extension scopes, see [Create extension instance](../../azure-arc/kubernetes/extensions.md#create-extensions-instance) and search for ``scope``.

## Prerequisites
Before proceeding with the installation of Event Grid, make sure the following prerequistes are met. 

1. A cluster running on one of the [supported Kubernetes distributions](#Supported-Kubernetes-distributions).
1. [An Azure subscription](https://azure.microsoft.com/en-us/free/).
1. [PKI Certificates](#PKI-Certificate-requirements) to be used for establishing an HTTPS connection with the Event Grid broker.
1. [Connect your cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster).

## Getting support
If you run into an issue, see the [Troubleshooting](#Troubleshooting) section for help with common conditions. If you still have problems, [create an Azure support request](getting-support.md#how_to_create_a_support_request).

## PKI Certificate requirements
The Event Grid broker (server) serves two kinds of clients. 

- Event Grid publishers, which are data plane clients that send events to event grid topic endpoints hosted on the broker. 
- Event Grid operators are the other kind of clients that makes control plane requests to the Event Grid broker.

For clients and server (Event Grid broker) to establish a TLS session to start a secure HTTPS communication, Public Key Infrastructure (PKI) certificates and keys for clients and server are required. Here are the general requirements for these PKI certificates:

1. The certificates and keys must be [X.509](https://en.wikipedia.org/wiki/X.509) certificates and [Privacy-Enhanced Mail](https://en.wikipedia.org/wiki/Privacy-Enhanced_Mail) (PEM) encoded.
1. There are six files in total that need to be provided when installing the Event Grid extension. Following are the PKI certificates and keys needed for the client (3) and the server (3) components:
    1. A CA certificate.
    1. A public certificate.
    1. A key.
1. In addition to the above certificates, you will need the same set of certificates for each of the event publishing clients that you intent to use in your solution. These certificates are not requested during the installation of Event Grid.

    > [!IMPORTANT]
    > While a domain associated to a publisher client, for example, might have more than one public certificate issued by different certificate authorities, Event Grid on Kubernetes only allows uploading a single CA certificate for clients when installing Event Grid. As a consequence, the certificates for clients publishing events to Event Grid and the certificate for the Event Grid operator should be issued (signed) by the same CA in order for the certificate chain validation to succeed and a TLS session to be successfully established.
1. When configuring the Common Name (CN) for server and client certificates, make sure they are different to the CN provided for the Certificate Authority certificate.

    > [!IMPORTANT] 
    > For early proof-of-concept stages, self-signed certificates might be an option but in general, proper PKI certificates signed by a Certificate Authority (CA) should be procured and used.

## Install Event Grid on Kubernetes Extension using Azure portal

1. On the Azure portal, search (field on top) for **Azure Arc**
1. Select **Kuberntes cluster** on the left-hand-side menu in the **Infrastructure** section
1. Under the list of clusters, locate the one to which you want to install Event Grid, and select it. The **Overview** page for the cluster is displayed.
1. Select **Extensions** in the **Settings** group on the left menu.
1. Select **+ Add**. A page showing the available Azure Arc Kubernetes extensions is displayed.
1. Select **Event Grid**.
1. Select **Create** on the Event Grid on Kubernetes with Azure Arc page.
1. The **Basics** tab on the **Install Even Grid** page is shown. The **Project Details** section shows read-only subscription and resource group values because Azure Arc extensions are deployed under the same Azure subscription and resource group of the connected cluster on which they are installed.
1. Provide a name in the **Event Grid extension name** field. This name should be unique among other Azure Arc extensions deployed to the same Azure Arc connected cluster.
1. For **Release namespace**, you may want to provide the name of a Kubernetes namespace where Event Grid components will be deployed into. The default is **eventgrid-system**. If the namespace provided does not exist, it's created for you.
1. On the **Event Grid broker** details section, the service type is shown. The Event Grid broker, which is the component that exposes the topic endpoints to which events are sent, is exposed as a Kubernetes service type **ClusterIP**. Hence, the IPs assigned to all topics use the private IP space configured for the cluster.
1. Provide the **storage class name** that you want to use for the broker and that's supported by your Kubernetes distribution. For example, if you are using AKS, you could use **azurefile**, which uses Azure Standard storage. For more information on predefined storage classes supported by AKS, see [Storage Classes in AKS](../../aks/concepts-storage.md#storage-classes). If you are using other Kubernetes distributions, see your Kubernetes distribution documentation for predefined storage classes supported or the way you can provide your own.
1. **Storage size**. Default is 1 GiB. Consider the ingestion rate when determining the size of your storage. Ingestion rate in MiB/second measured as the size of your events times the publishing rate (events per second) across all topics on the Event Grid broker is a key factor when allocating storage. Events are transient in nature and once they are delivered, there is no storage consumption for those events. While ingestion rate is a main driver for storage use, it is not the only one. Metadata holding topic and event subscription configuration also consumes storage space, but that normally requires a lower amount of storage space than the events ingested and being delivered by Event Grid.
1. **Memory limit**. Default is 1 GiB. 
1. **Memory request**. Default is 200 MiB. This field is not editable.
1. Select **Configuration** at the bottom of the page.
1. **Enable HTTP (not secure) communication**. Check this box if you want to use a non-secured channel when clients that communicate with the Event Grid broker.

    > [!IMPORTANT]
    > Enabling this option will make that all communication with the Event Grid broker use HTTP as transport. Hence, any publishing client and the Event Grid broker won't communicate with the Event Grid broker securely. You should use this option only during early stages of development.
1. If you didn't enable HTTP communication, select each of the PKI certificate files that you procured and meet the [PKI certificate requirements](#PKI-certificate-requirements).
1. Select the **Monitoring** at the bottom of the page.
1. **Enable metrics** by checking this option. Event Grid on Kubernetes exposes metrics for topics and event subscriptions using the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/).
1. Select **Tags** to define [tags](/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging), if necessary.
1. Select **Review + Install** at the bottom of the page.
1. On the **Review + Install** tab, select **Install**.
    
    > [!IMPORTANT]
    > The installation of Event Grid is an asynchronous operation that may run longer on the Kubernetes cluster than the time you see a notification on the Azure Portal informing the deployment is complete. Wait at least 5 minutes after you see a notification that "Your deployment is complete" before attempting to create a custom location (next step). If you have access to the Kubernetes cluster, on a bash session you can execute the following command to validate if the Event Grid broker and Event Grid operator pods are in Running state, which would indicate the installation has completed:

    ```bash
    kubectl get pods -n \<release-namespace-name\>
    ```
    > [!IMPORTANT]
    > A Custom Location needs to be created before attempting to deploy Event Grid topics. To create a custom location, you can select the **Context** page at the bottom 5 minutes after the "Your deployment is complete" notification is shown. Alternatively, you can create a custom location using the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.ExtendedLocation%2FCustomLocations).
1. After the deployment succeeds, you will be able to see an entry on the **Extensions** page with the name you provided to your Event Grid extension.

# Troubleshooting

## Azure Arc connect cluster issues

1. Condition: When navigating to **Azure Arc** and clicking **Kubernetes cluster** on the left-hand side menu, the page displayed does not show the Kubernetes cluster where I intent to install Event Grid.

    Suggestion: Your Kubernetes cluster is not registered with Azure. Follow the steps in article [Connect an existing Kubernetes cluster to Azure Arc](https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster). If you have a problem during this step, file a [support request](#Getting-Support) with the Azure Arc enabled Kubernetes team.

## Event Grid extension issues

1. Condition: When trying to install an "Event Grid extension", you get the following message:
    "**Invalid operation** &nbsp;
    An instance of Event Grid has already been installed on this connected Kubernetes cluster. The Event Grid extension is scoped at the cluster level, which means that only one instance can be installed on a cluster."
    
    Explanation: You already have Event Grid installed. The preview version of Event Grid only supports one Event Grid extension instance deployed to a cluster.


## Resources

1. [Deploy and manage Kubernetes cluster extensions](https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/conceptual-extensions).



