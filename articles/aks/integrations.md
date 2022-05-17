---
title: Add-ons, extensions, and other integrations with Azure Kubernetes Service
description: Learn about the add-ons, extensions, and open-source integrations you can use with Azure Kubernetes Service.
services: container-service
ms.topic: overview
ms.date: 02/22/2022
---

# Add-ons, extensions, and other integrations with Azure Kubernetes Service

Azure Kubernetes Service (AKS) provides additional, supported functionality for your cluster using add-ons and extensions. There are also many more integrations provided by open-source projects and third parties that are commonly used with AKS. These open-source and third-party integrations are not covered by the [AKS support policy][aks-support-policy].

## Add-ons

Add-ons provide extra capabilities for your AKS cluster and their installation and configuration is managed by Azure. Use `az aks addon` to manage all add-ons for your cluster.

The below table shows the available add-ons.

| Name | Description | More details |
|---|---|---|
| http_application_routing | Configure ingress with automatic public DNS name creation for your AKS cluster. | [HTTP application routing add-on on Azure Kubernetes Service (AKS)][http-app-routing] |
| monitoring | Use Container Insights monitoring with your AKS cluster. | [Container insights overview][container-insights] |
| virtual-node | Use virtual nodes with your AKS cluster. | [Use virtual nodes][virtual-nodes] |
| azure-policy | Use Azure Policy for AKS, which enables at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. | [Understand Azure Policy for Kubernetes clusters][azure-policy-aks] |
| ingress-appgw | Use Application Gateway Ingress Controller with your AKS cluster. | [What is Application Gateway Ingress Controller?][agic] |
| open-service-mesh | Use Open Service Mesh with your AKS cluster. | [Open Service Mesh AKS add-on][osm] |
| azure-keyvault-secrets-provider | Use Azure Keyvault Secrets Provider addon.| [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster][keyvault-secret-provider] |
| web_application_routing | Use a managed NGINX ingress Controller with your AKS cluster.| [Web Application Routing Overview][web-app-routing] |


## Extensions

Cluster extensions build on top of certain Helm charts and provide an Azure Resource Manager-driven experience for installation and lifecycle management of different Azure capabilities on top of your Kubernetes cluster. For more details on the specific cluster extensions for AKS, see [Deploy and manage cluster extensions for Azure Kubernetes Service (AKS)][cluster-extensions]. For more details on the currently available cluster extensions, see [Currently available extensions][cluster-extensions-current].

## Difference between extensions and add-ons

Both extensions and add-ons are supported ways to add functionality to your AKS cluster. When you install an add-on, the functionality is added as part of the AKS resource provider in the Azure API. When you install an extension, the functionality is added as part of a separate resource provider in the Azure API.

## Open source and third-party integrations

You can install many open source and third-party integrations on your AKS cluster, but these open-source and third-party integrations are not covered by the [AKS support policy][aks-support-policy].

The below table shows a few examples of open-source and third-party integrations.

| Name | Description | More details |
|---|---|---|
| [Helm][helm] | An open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. | [Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm][helm-qs] |
| [Prometheus][prometheus] | An open source monitoring and alerting toolkit. | [Container insights with metrics in Prometheus format][prometheus-az-monitor], [Prometheus Helm chart][prometheus-helm-chart] |
| [Grafana][grafana] | An open-source dashboard for observability.  | [Deploy Grafana on Kubernetes][grafana-install] |
| [Couchbase][couchdb] | A distributed NoSQL cloud database. | [Install Couchbase and the Operator on AKS][couchdb-install] |
| [OpenFaaS][open-faas]| An open-source framework for building serverless functions by using containers. | [Use OpenFaaS with AKS][open-faas-aks] |
| [Apache Spark][apache-spark] | An open source, fast engine for large-scale data processing. | [Run an Apache Spark job with AKS][spark-job] |
| [Istio][istio] | An open-source service mesh. | [Istio Installation Guides][istio-install] |
| [Linkerd][linkerd] | An open-source service mesh. | [Linkerd Getting Started][linkerd-install] |
| [Consul][consul] | An open source, identity-based networking solution. | [Getting Started with Consul Service Mesh for Kubernetes][consul-install] |


[http-app-routing]: http-application-routing.md
[container-insights]: ../azure-monitor/containers/container-insights-overview.md
[virtual-nodes]: virtual-nodes.md
[azure-policy-aks]: ../governance/policy/concepts/policy-for-kubernetes.md#install-azure-policy-add-on-for-aks
[agic]: ../application-gateway/ingress-controller-overview.md
[osm]: open-service-mesh-about.md
[keyvault-secret-provider]: csi-secrets-store-driver.md
[cluster-extensions]: cluster-extensions.md?tabs=azure-cli
[cluster-extensions-current]: cluster-extensions.md?tabs=azure-cli#currently-available-extensions
[aks-support-policy]: support-policies.md
[helm]: https://helm.sh
[helm-qs]: quickstart-helm.md
[prometheus]: https://prometheus.io/
[prometheus-helm-chart]: https://github.com/prometheus-community/helm-charts#usage
[prometheus-az-monitor]: monitor-aks.md#container-insights
[istio]: https://istio.io/
[istio-install]: https://istio.io/latest/docs/setup/install/
[linkerd]: https://linkerd.io/
[linkerd-install]: https://linkerd.io/getting-started/
[consul]: https://www.consul.io/
[consul-install]: https://learn.hashicorp.com/tutorials/consul/service-mesh-deploy
[grafana]: https://grafana.com/
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/kubernetes/
[couchdb]: https://www.couchbase.com/
[couchdb-install]: https://docs.couchbase.com/operator/current/tutorial-aks.html
[open-faas]: https://www.openfaas.com/
[open-faas-aks]: openfaas.md
[apache-spark]: https://spark.apache.org/
[spark-job]: spark-job.md
[azure-ml-overview]: ../machine-learning/how-to-attach-kubernetes-anywhere.md
[dapr-overview]: ./dapr.md
[gitops-overview]: ../azure-arc/kubernetes/conceptual-gitops-flux2.md
[web-app-routing]: web-app-routing.md
