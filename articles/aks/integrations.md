---
title: Add-ons, extensions, and other integrations with Azure Kubernetes Service (AKS)
description: Learn about the add-ons, extensions, and open-source integrations you can use with Azure Kubernetes Service (AKS).
ms.topic: overview
ms.custom: event-tier1-build-2022
ms.date: 05/22/2023
---

# Add-ons, extensions, and other integrations with Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) provides extra functionality for your clusters using add-ons and extensions. Open-source projects and third parties provide by more integrations that are commonly used with AKS. The [AKS support policy][aks-support-policy] doesn't support the open-source and third-party integrations.

## Add-ons

Add-ons are a fully supported way to provide extra capabilities for your AKS cluster. The installation, configuration, and lifecycle of add-ons is managed by AKS. You can use the [`az aks enable-addons`][az-aks-enable-addons] command to install an add-on or manage the add-ons for your cluster.

AKS uses the following rules for applying updates to installed add-ons:

- Only an add-on's patch version can be upgraded within a Kubernetes minor version. The add-on's major/minor version isn't upgraded within the same Kubernetes minor version.
- The major/minor version of the add-on is only upgraded when moving to a later Kubernetes minor version.
- Any breaking or behavior changes to the add-on are announced well before, usually 60 days, for a GA minor version of Kubernetes on AKS.
- You can patch add-ons weekly with every new release of AKS, which is announced in the release notes. You can control AKS releases using the [maintenance windows][maintenance-windows] and [release tracker][release-tracker].

### Exceptions

- Add-ons are upgraded to a new major/minor version (or breaking change) within a Kubernetes minor version if either the cluster's Kubernetes version or the add-on version are in preview.
- There may be unavoidable circumstances, such as CVE security patches or critical bug fixes, when you need to update an add-on within a GA minor version.

### Available add-ons

| Name | Description | More details |
|---|---|---|
| web_application_routing | Use a managed NGINX ingress controller with your AKS cluster.| [Application Routing Overview][app-routing] |
| ingress-appgw | Use Application Gateway Ingress Controller with your AKS cluster. | [What is Application Gateway Ingress Controller?][agic] |
| keda | Use event-driven autoscaling for the applications on your AKS cluster. | [Simplified application autoscaling with Kubernetes Event-driven Autoscaling (KEDA) add-on][keda]|
| monitoring | Use Container Insights monitoring with your AKS cluster. | [Container insights overview][container-insights] |
| azure-policy | Use Azure Policy for AKS, which enables at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. | [Understand Azure Policy for Kubernetes clusters][azure-policy-aks] |
| azure-keyvault-secrets-provider | Use Azure Keyvault Secrets Provider addon.| [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster][keyvault-secret-provider] |
| virtual-node | Use virtual nodes with your AKS cluster. | [Use virtual nodes][virtual-nodes] |
| http_application_routing | Configure ingress with automatic public DNS name creation for your AKS cluster (retired). | [HTTP application routing add-on on Azure Kubernetes Service (AKS) (retired)][http-app-routing] |
| open-service-mesh | Use Open Service Mesh with your AKS cluster (retired). | [Open Service Mesh AKS add-on (retired)][osm] |

## Extensions

Cluster extensions build on top of certain Helm charts and provide an Azure Resource Manager-driven experience for installation and lifecycle management of different Azure capabilities on top of your Kubernetes cluster.

- For more information on the specific cluster extensions for AKS, see [Deploy and manage cluster extensions for Azure Kubernetes Service (AKS)][cluster-extensions].
- For more information on available cluster extensions, see [Currently available extensions][cluster-extensions-current].

### Difference between extensions and add-ons

Extensions and add-ons are both supported ways to add functionality to your AKS cluster. When you install an add-on, the functionality is added as part of the AKS resource provider in the Azure API. When you install an extension, the functionality is added as part of a separate resource provider in the Azure API.

## GitHub Actions

GitHub Actions helps you automate your software development workflows from within GitHub.

- For more information on using GitHub Actions with Azure, see [GitHub Actions for Azure][github-actions].
- For an example of using GitHub Actions with an AKS cluster, see [Build, test, and deploy containers to Azure Kubernetes Service using GitHub Actions][github-actions-aks].

## Open-source and third-party integrations

There are many open-source and third-party integrations you can install on your AKS cluster. The [AKS support policy][aks-support-policy] doesn't support the following open-source and third-party integrations.

| Name | Description | More details |
|---|---|---|
| [Helm][helm] | An open-source packaging tool that helps you install and manage the lifecycle of Kubernetes applications. | [Quickstart: Develop on Azure Kubernetes Service (AKS) with Helm][helm-qs] |
| [Prometheus][prometheus] | An open-source monitoring and alerting toolkit. | [Container insights with metrics in Prometheus format][prometheus-az-monitor], [Prometheus Helm chart][prometheus-helm-chart] |
| [Grafana][grafana] | An open-source dashboard for observability.  | [Deploy Grafana on Kubernetes][grafana-install] or use [Managed Grafana][managed-grafana]|
| [Couchbase][couchdb] | A distributed NoSQL cloud database. | [Install Couchbase and the Operator on AKS][couchdb-install] |
| [OpenFaaS][open-faas]| An open-source framework for building serverless functions by using containers. | [Use OpenFaaS with AKS][open-faas-aks] |
| [Apache Spark][apache-spark] | An open-source, fast engine for large-scale data processing. | Running Apache Spark jobs requires a minimum node size of *Standard_D3_v2*. See [running Spark on Kubernetes][spark-kubernetes] for more details on running Spark jobs on Kubernetes. |
| [Istio][istio] | An open-source service mesh. | [Istio Installation Guides][istio-install] |
| [Linkerd][linkerd] | An open-source service mesh. | [Linkerd Getting Started][linkerd-install] |
| [Consul][consul] | An open-source, identity-based networking solution. | [Getting Started with Consul Service Mesh for Kubernetes][consul-install] |

### Third-party integrations for Windows containers

Microsoft has collaborated with partners to ensure your build, test, deployment, configuration, and monitoring of your applications perform optimally with Windows containers on AKS.

For more details, see [Windows AKS partner solutions][windows-aks-partner-solutions].

<!-- LINKS -->
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
[prometheus-az-monitor]: monitor-aks.md#integrations
[istio]: https://istio.io/
[istio-install]: https://istio.io/latest/docs/setup/install/
[linkerd]: https://linkerd.io/
[linkerd-install]: https://linkerd.io/getting-started/
[consul]: https://www.consul.io/
[consul-install]: https://learn.hashicorp.com/tutorials/consul/service-mesh-deploy
[grafana]: https://grafana.com/
[grafana-install]: https://grafana.com/docs/grafana/latest/installation/kubernetes/
[couchdb]: https://www.couchbase.com/
[couchdb-install]: https://docs.couchbase.com/operator/2.4/tutorial-aks.html
[open-faas]: https://www.openfaas.com/
[open-faas-aks]: openfaas.md
[apache-spark]: https://spark.apache.org/
[spark-kubernetes]: https://spark.apache.org/docs/latest/running-on-kubernetes.html
[managed-grafana]: ../managed-grafana/overview.md
[keda]: keda-about.md
[app-routing]: app-routing.md
[maintenance-windows]: planned-maintenance.md
[release-tracker]: release-tracker.md
[github-actions]: /azure/developer/github/github-actions
[github-actions-aks]: kubernetes-action.md
[az-aks-enable-addons]: /cli/azure/aks#az-aks-enable-addons
[windows-aks-partner-solutions]: windows-aks-partner-solutions.md
