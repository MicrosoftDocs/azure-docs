# Monitoring Windows Server containers with OMS

## OMS Containers Solution

The Operations Management Suite (OMS) team has published a Containers solution for diagnostics and monitoring for containers. Alongside their Service Fabric solution, this solution is a great tool to monitor container deployments orchestrated on Service Fabric. Here's a simple example of what the dashboard in the solution looks like:

![Basic OMS Dashboard](./media/service-fabric-diagnostics-containers-windowsserver/oms-containers-dashboard.PNG)

It also collects 4 different kinds of logs that can be queried in the OMS Log Analytics tool, and can be used to visualize any metrics or events being generated. The log types that are present in the solution are:

1. ContainerInventory: shows information about container location, name, and images
2. ContainerImageInventory: information about deployed images, including IDs or sizes
3. ContainerLog: specific error logs, docker logs (stdout, etc.), and other entries
4. ContainerServiceLog: docker daemon commands that have been run

This article will cover the steps required to set this up for your cluster. To learn more about OMS's solution, check out their [github repo](https://github.com/Microsoft/OMS-docker#supported-linux-operating-systems-and-docker) and their [documentation](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-containers).

## 1. Set up a Service Fabric cluster

Create a new cluster using the ARM template found [here](https://github.com/dkkapur/Service-Fabric/tree/master/ARM%20Templates/SF%20OMS%20Sample). To learn how to deploy a cluster using an ARM template, go to [this document](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-creation-via-arm).

Make sure to add a unique OMS workspace name. This template also defaults to deploying a cluster in the Preview build of Service Fabric (v255.255) which means that it cannot be used in production as is, and once the cluster is deployed, it cannot be upgraded to a different Service Fabric version. If you decide to use these steps in a production environment, make sure to change the version to the appropriate number. 

Once the cluster is set up, confirm that you have installed the appropriate certificate, and make sure you are able to connect to the cluster.

Confirm that your Resource Group is set up correctly by heading to [Azure Portal](https://portal.azure.com/) and finding the deployment. The resource group should contain all the Service Fabric resources, and also have a Log Analytics solution as well as a Service Fabric solution.

## 2. Deploy a Container

Once the cluster is ready and you have confirmed that you can access it, deploy a container to it. If you chose to use the Preview version as set by the template, you can also explore Service Fabric's new docker compose functionality. Bear in mind that the first time a container image is deployed to a cluster, it will take several minutes to download the image depending on its size.

## 3. Add the Containers solution

In Portal, create a new Containers resource (under the Monitoring + Management category) through Azure Marketplace. In the creation step, it will request an OMS workspace; add the one you just created with the ARM template. This creates a new Containers solution within your OMS workspace. This is automatically detected by the OMS agent deployed by the template and will start gathering data on the containers processes in the cluster. In about 10-15minutes, you should see the solution light up with as in the image above.

## 4. Next steps

To make the most of the solution, use the [log search](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-log-searches) features offered by the OMS workspace.

Additionally, through the settings in the workspace, you can configure the agent to pick up custom performance counters from the host machines in the cluster (Workspace Home > Settings > Data > Windows Performance Counters).

You can also configure OMS to set up [automated alerting](https://docs.microsoft.com/en-us/azure/log-analytics/log-analytics-alerts) rules to aid in diagnostics.











