---
title: Add-ons, extensions, and other integrations with Azure Kubernetes Service
description: Learn about the add-ons, extensions, and open-source integrations you can use with Azure Kubernetes Service.
services: container-service
ms.topic: overview
ms.custom: event-tier1-build-2022
ms.date: 02/22/2022
---

# Add-ons, extensions, and other integrations with Azure Kubernetes Service

Azure Kubernetes Service (AKS) provides additional, supported functionality for your cluster using add-ons and extensions. There are also many more integrations provided by open-source projects and third parties that are commonly used with AKS. These open-source and third-party integrations are not covered by the [AKS support policy][aks-support-policy].

## Add-ons

Add-ons are a fully supported way to provide extra capabilities for your AKS cluster. Add-ons' installation, configuration, and lifecycle is managed by AKS. Use `az aks addon` to install an add-on or manage the add-ons for your cluster.

The following rules are used by AKS for applying updates to installed add-ons:

- Only an add-on's patch version can be upgraded within a Kubernetes minor version. The add-on's major/minor version will not be upgraded within the same Kubernetes minor version.
- The major/minor version of the add-on will only be upgraded when moving to a later Kubernetes minor version.
- Any breaking or behavior changes to the add-on will be announced well before, usually 60 days, for a GA minor version of Kubernetes on AKS.
- Add-ons can be patched weekly with every new release of AKS which will be announced in the release notes. AKS releases can be controlled using [maintenance windows][maintenance-windows] and followed using [release tracker][release-tracker].

### Exceptions

- Add-ons will be upgraded to a new major/minor version (or breaking change) within a Kubernetes minor version if either the cluster's Kubernetes version or the add-on version are in preview.                                
- It is also possible, in unavoidable circumstances such as CVE security patches or critical bug fixes, that there may be times when an add-on needs to be updated within a GA minor version. 

### Available add-ons

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
| keda | Event-driven autoscaling for the applications on your AKS cluster. | [Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on][keda]|

## Extensions

Cluster extensions build on top of certain Helm charts and provide an Azure Resource Manager-driven experience for installation and lifecycle management of different Azure capabilities on top of your Kubernetes cluster. For more details on the specific cluster extensions for AKS, see [Deploy and manage cluster extensions for Azure Kubernetes Service (AKS)][cluster-extensions]. For more details on the currently available cluster extensions, see [Currently available extensions][cluster-extensions-current].

## Difference between extensions and add-ons

Both extensions and add-ons are supported ways to add functionality to your AKS cluster. When you install an add-on, the functionality is added as part of the AKS resource provider in the Azure API. When you install an extension, the functionality is added as part of a separate resource provider in the Azure API.

## GitHub Actions

GitHub Actions helps you automate your software development workflows from within GitHub. For more details on using GitHub Actions with Azure, see [What is GitHub Actions for Azures][github-actions]. For an example of using GitHub Actions with an AKS cluster, see [Build, test, and deploy containers to Azure Kubernetes Service using GitHub Actions][github-actions-aks].

## Open source and third-party integrations

You can install many open source and third-party integrations on your AKS cluster, but these open-source and third-party integrations are not covered by the [AKS support policy][aks-support-policy].

The below table shows a few examples of open-source and third-party integrations.

| Name | Description | More details |
|---|---|---|
| [Helm][helm] | An open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. | [Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm][helm-qs] |
| [Prometheus][prometheus] | An open source monitoring and alerting toolkit. | [Container insights with metrics in Prometheus format][prometheus-az-monitor], [Prometheus Helm chart][prometheus-helm-chart] |
| [Grafana][grafana] | An open-source dashboard for observability.  | [Deploy Grafana on Kubernetes][grafana-install] or use [Managed Grafana][managed-grafana]|
| [Couchbase][couchdb] | A distributed NoSQL cloud database. | [Install Couchbase and the Operator on AKS][couchdb-install] |
| [OpenFaaS][open-faas]| An open-source framework for building serverless functions by using containers. | [Use OpenFaaS with AKS][open-faas-aks] |
| [Apache Spark][apache-spark] | An open source, fast engine for large-scale data processing. | Running Apache Spark jobs requires a minimum node size of *Standard_D3_v2*. See [running Spark on Kubernetes][spark-kubernetes] for more details on running Spark jobs on Kubernetes. |
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
[azure-ml-overview]: ../machine-learning/how-to-attach-kubernetes-anywhere.md
[spark-kubernetes]: https://spark.apache.org/docs/latest/running-on-kubernetes.html
[dapr-overview]: ./dapr.md
[gitops-overview]: ../azure-arc/kubernetes/conceptual-gitops-flux2.md
[managed-grafana]: ../managed-grafana/overview.md
[keda]: keda-about.md
[web-app-routing]: web-app-routing.md
[maintenance-windows]: planned-maintenance.md
[release-tracker]: release-tracker.md
[github-actions]: /azure/developer/github/github-actions
[azure/aks-set-context]: https://github.com/Azure/aks-set-context
[azure/k8s-set-context]: https://github.com/Azure/k8s-set-context
[azure/k8s-bake]: https://github.com/Azure/k8s-bake
[azure/k8s-create-secret]: https://github.com/Azure/k8s-create-secret
[azure/k8s-deploy]: https://github.com/Azure/k8s-deploy
[azure/k8s-lint]: https://github.com/Azure/k8s-lint
[azure/setup-helm]: https://github.com/Azure/setup-helm
[azure/setup-kubectl]: https://github.com/Azure/setup-kubectl
[azure/k8s-artifact-substitute]: https://github.com/Azure/k8s-artifact-substitute
[azure/aks-create-action]: https://github.com/Azure/aks-create-action
[azure/aks-github-runner]: https://github.com/Azure/aks-github-runner
[github-actions-aks]: kubernetes-action.md