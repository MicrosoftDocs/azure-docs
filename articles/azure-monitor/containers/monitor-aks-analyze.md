---
title: Monitor Azure Kubernetes Service (AKS) with Azure Monitor - Analyze
description: Describes the different features of Azure Monitor that allow you to analyze the health and performance of your AKS cluster.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/02/2021

---

# Monitoring Azure Kubernetes Service (AKS) - Analyze data


The screenshot below shows the **Monitor** menu 

| Menu option | Description |
|:---|:---|
| Insights | Opens container insights for the current cluster. |
| Alerts | Views alerts for the current cluster. |
| Metrics | Open metrics explorer with the scope set to the Container service. |
| Diagnostic | settings	Create diagnostic settings for the cluster to collect resource logs. |
| Advisor | recommendations	Recommendations for the current virtual machine from Azure Advisor. |
| Logs | Open Log Analytics with the scope set to the current cluster to analyze log data. |
| Workbooks | Open workbook gallery for Kubernetes service. |


## Level 1 - Cluster level components
The first step in analyzing the health and performance of your AKS cluster is understanding the health and performance of virtual machine scale set (VMSS) that it's running on. Before deploying any pods or workloads, you should analyze the following critical information for each node:

| Component | Monitoring | Details |
|:---|:---|:---|
| Node | - Readiness status<br>- CPU and memory usage<br>- Disk usage | Understand the health and performance of each node and proactively monitor their usage trends before deploying any workloads. |


Use existing views and reports in Container Insights to monitor cluster level components. The **Cluster** view gives you a quick view of the performance of the nodes in your cluster including their CPU and memory utilization. Use the **Nodes** view to view the health of each node in addition to the health and performance of the pods running on each. See [Monitor your Kubernetes cluster performance with Container insights](container-insights-analyze.md) for details on using this view and analyzing node health and performance.

Use Node workbooks provided by Container Insights to analyze disk capacity and IO in addition to GPU usage. See [Node workbooks](container-insights-reports.md#node-workbooks) for a description of these workbooks.


## Node logs
For troubleshooting scenarios, you may need to access the AKS nodes directly for maintenance or immediate log collection. For security purposes, the AKS nodes aren't exposed to the internet but you can `kubectl debug` to SSH to the AKS nodes. See [Connect with SSH to Azure Kubernetes Service (AKS) cluster nodes for maintenance or troubleshooting](../../aks/ssh.md) for details on this process.

## Level 2 - Managed AKS components

| Component | Monitoring |
|:---|:---|
| API Server | Monitor the status of API server, identifying any increase in request load and bottlenecks if the service is down. |
| Kubelet | Monitoring Kubelet helps in troubleshooting of pod management issues, pods not starting, nodes not ready or pods getting killed  |


Use the Kubelet workbook to view the health and performance of each kubelet. See [Resource Monitoring workbooks](container-insights-reports.md#resource-monitoring-workbooks) for details on this workbooks. For troubleshooting scenarios, you can access kubelet logs using the process described at [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](../../aks/kubelet-logs.md).




## Level 3 - Kubernetes objects and workloads
This level includes Kubernetes objects such as containers and deployments and the workloads running on them.

| Component | Monitoring requirements |
|:---|:---|
| Deployments | Actual vs desired state of the deployment. Monitor the health deployments and the pods  | 
| Pods | Monitor pods that are running on you AKS cluster. Watch resource utilization trends to identify and diagnose any issues. |
| Containers | |


Use existing views and reports in Container Insights to monitor containers and pods. Use the **Nodes** and **Controllers** views to view the health and performance of the pods running on them and drill down to the health and performance of their containers. View the health and performance for containers directly from the **Containers** view. See [Monitor your Kubernetes cluster performance with Container insights](container-insights-analyze.md) for details on using this view and analyzing container health and performance.

Container insights collects metrics for deployments that you can view with the **Deployments** workbook. See [Deployment & HPA metrics with Container insights](container-insights-deployment-hpa-metrics.md) for details.

> [!NOTE]
> Deployments view is currently in public preview.


## Level 4- Applications
This level includes the application workloads running in the AKS cluster.

| Component | Monitoring requirements |
|:---|:---|
| Applications | Monitor microservice application deployments to identify application failures and latency issues. Includes such information as request rates, response times, and exceptions. |

Application Insights provides complete monitoring of applications running on AKS and other environments. If you have a Java application, you can provide monitoring without instrumenting your code following [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](../app/kubernetes-codeless.md). For complete monitoring though, you should configure code-based monitoring depending on your application.

- [ASP.NET Applications](../app/asp-net.md)
- [ASP.NET Core Applications](../app/asp-net-core.md)
- [.NET Console Applications](../app/console.md)
- [Java](../app/java-in-process-agent.md)
- [Node.js](../app/nodejs.md)
- [Python](../app/opencensus-python.md)
- [Other platforms](../app/platforms.md)

## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-aks-analyze.md)
* 