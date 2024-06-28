---
title: "Tutorial: Implement a condition monitoring solution"
description: "Azure Industrial IoT reference architecture for condition monitoring, Overall Equipment Effectiveness (OEE) calculation, forecasting, and anomaly detection."
author: barnstee
ms.author: erichb
ms.service: iot
ms.topic: tutorial #Don't change.
ms.date: 4/17/2024

#customer intent: As an industrial IT engineer, I want to collect data from on-prem assets and systems so that I can enable the condition monitoring, OEE calculation, forecasting, and anomaly detection use cases for production managers on a global scale.

---

# Tutorial: Implement the Azure Industrial IoT reference solution architecture

Manufacturers want to deploy an overall Industrial IoT solution on a global scale and connecting all of their production sites to this solution to increase efficiencies for each individual production site.

These increased efficiencies lead to faster production and lower energy consumption, which all lead to lowering the cost for the produced goods while increasing their quality in most cases.

The solution must be as efficient as possible and enable all required use cases like condition monitoring, OEE calculation, forecasting, and anomaly detection. From the insights gained from these use cases, in a second step a digital feedback loop can be created which can then apply optimizations and other changes to the production processes.

Interoperability is the key to achieving a fast rollout of the solution architecture and the use of open standards like OPC UA significantly helps with achieving this interoperability.


## IEC 62541 Open Platform Communications Unified Architecture (OPC UA)

This solution uses IEC 62541 Open Platform Communications (OPC) Unified Architecture (UA) for all Operational Technology (OT) data. This standard is described [here](https://opcfoundation.org). 


## Reference solution architecture

Simplified Architecture (both Azure and Fabric Options):

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/architecture-iiot-simple.png" alt-text="Diagram of a simple IIoT architecture." lightbox="media/concepts-iot-industrial-solution-architecture/architecture-iiot-simple.png" border="false" :::


Detailed Architecture (Azure Only):

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/architecture-iiot.png" alt-text="Diagram of an IIoT architecture." lightbox="media/concepts-iot-industrial-solution-architecture/architecture-iiot.png" border="false" :::


## Components

Here are the components involved in this solution:

| Component | Description |
| --- | --- |
| Industrial Assets | A set of simulated OPC UA enabled production lines hosted in Docker containers |
| [Azure IoT Operations](/azure/iot-operations/get-started/overview-iot-operations) | Azure IoT Operations is a unified data plane for the edge. It includes a set of modular, scalable, and highly available data services that run on Azure Arc-enabled edge Kubernetes clusters. |
| [Data Gateway](/azure/logic-apps/logic-apps-gateway-install#how-the-gateway-works) | This gateway connects your on-premises data sources (like SAP) to Azure Logic Apps in the cloud. |
| [Azure Kubernetes Services Edge Essentials](/azure/aks/hybrid/aks-edge-overview) | This Kubernetes implementation runs at the Edge. It provides single- and multi-node Kubernetes clusters for a fault-tolerant Edge configuration. Both K3S and K8S are supported. It runs on embedded or PC-class hardware, like an industrial gateway. |
| [Azure Event Hubs](/azure/event-hubs/event-hubs-about) | The cloud message broker that receives OPC UA PubSub messages from edge gateways and stores them until retrieved by subscribers. |
| [Azure Data Explorer](/azure/synapse-analytics/data-explorer/data-explorer-overview) | The time series database and front-end dashboard service for advanced cloud analytics, including built-in anomaly detection and predictions. |
| [Azure Logic Apps](/azure/logic-apps/logic-apps-overview) | Azure Logic Apps is a cloud platform you can use to create and run automated workflows with little to no code. |
| [Azure Arc](/azure/azure-arc/kubernetes/overview) | This cloud service is used to manage the on-premises Kubernetes cluster at the edge. New workloads can be deployed via Flux. |
| [Azure Storage](/azure/storage/common/storage-introduction) | This cloud service is used to manage the OPC UA certificate store and settings of the Edge Kubernetes workloads. |
| [Azure Managed Grafana](/azure/managed-grafana/overview) | Azure Managed Grafana is a data visualization platform built on top of the Grafana software by Grafana Labs. Grafana is built as a fully managed service that is hosted and supported by Microsoft. |
| [Microsoft Power BI](/power-bi/fundamentals/power-bi-overview) | Microsoft Power BI is a collection of SaaS software services, apps, and connectors that work together to turn your unrelated sources of data into coherent, visually immersive, and interactive insights. |
| [Microsoft Dynamics 365 Field Service](/dynamics365/field-service/overview) | Microsoft Dynamics 365 Field Service is a turnkey SaaS solution for managing field service requests. |
| [UA Cloud Commander](https://github.com/opcfoundation/ua-cloudcommander) | This open-source reference application converts messages sent to a Message Queue Telemetry Transport (MQTT) or Kafka broker (possibly in the cloud) into OPC UA Client/Server requests for a connected OPC UA server. The application runs in a Docker container. |
| [UA Cloud Action](https://github.com/opcfoundation/UA-CloudAction) | This open-source reference cloud application queries the Azure Data Explorer for a specific data value. The data value is the pressure in one of the simulated production line machines. It calls UA Cloud Commander via Azure Event Hubs when a certain threshold is reached (4,000 mbar). UA Cloud Commander then calls the OpenPressureReliefValve method on the machine via OPC UA. |
| [UA Cloud Library](https://github.com/opcfoundation/UA-CloudLibrary) | The UA Cloud Library is an online store of OPC UA Information Models, hosted by the OPC Foundation [here](https://uacloudlibrary.opcfoundation.org/). |
| [UA Edge Translator](https://github.com/opcfoundation/ua-edgetranslator) | This open-source industrial connectivity reference application translates from proprietary asset interfaces to OPC UA using W3C Web of Things (WoT) Thing Descriptions as the schema to describe the industrial asset interface. |

> [!NOTE]
> In a real-world deployment, something as critical as opening a pressure relief valve would be done on-premises. This is just a simple example of how to achieve the digital feedback loop.


## A cloud-based OPC UA certificate store and persisted storage

When manufacturers run OPC UA applications, their OPC UA configuration files, keys, and certificates must be persisted. While Kubernetes has the ability to persist these files in volumes, a safer place for them is the cloud, especially on single-node clusters where the volume would be lost when the node fails. This scenario is why the OPC UA applications used in this solution store their configuration files, keys, and certificates in the cloud. This approach also has the advantage of providing a single location for mutually trusted certificates for all OPC UA applications.


## UA Cloud Library

You can read OPC UA Information Models directly from Azure Data Explorer. You can do this by importing the OPC UA nodes defined in the OPC UA Information Model into a table for lookup of more metadata within queries. 

First, configure an Azure Data Explorer (ADX) callout policy for the UA Cloud Library by running the following query on your ADX cluster (make sure you're an ADX cluster administrator, configurable under Permissions in the ADX tab in the Azure portal):

```
.alter cluster policy callout @'[{"CalloutType": "webapi","CalloutUriRegex": "uacloudlibrary.opcfoundation.org","CanCall": true}]'
```

Then, run the following Azure Data Explorer query from the Azure portal:

```
let uri='https://uacloudlibrary.opcfoundation.org/infomodel/download/\<insert information model identifier from the UA Cloud Library here\>';
let headers=dynamic({'accept':'text/plain'});
let options=dynamic({'Authorization':'Basic \<insert your cloud library credentials hash here\>'});
evaluate http_request(uri, headers, options)
| project title = tostring(ResponseBody.['title']), contributor = tostring(ResponseBody.contributor.name), nodeset = parse_xml(tostring(ResponseBody.nodeset.nodesetXml))
| mv-expand UAVariable=nodeset.UANodeSet.UAVariable
| project-away nodeset
| extend NodeId = UAVariable.['@NodeId'], DisplayName = tostring(UAVariable.DisplayName.['#text']), BrowseName = tostring(UAVariable.['@BrowseName']), DataType = tostring(UAVariable.['@DataType'])
| project-away UAVariable
| take 10000
```

You need to provide two things in this query:

- The Information Model's unique ID from the UA Cloud Library and enter it into the \<insert information model identifier from cloud library here\> field of the ADX query.
- Your UA Cloud Library credentials (generated during registration) basic authorization header hash and insert it into the \<insert your cloud library credentials hash here\> field of the ADX query. Use tools like https://www.debugbear.com/basic-auth-header-generator to generate this.

For example, to render the production line simulation Station OPC UA Server's Information Model in the Kusto Explorer tool available for download [here](/azure/data-explorer/kusto/tools/kusto-explorer), run the following query:

```
let uri='https://uacloudlibrary.opcfoundation.org/infomodel/download/1627266626';
let headers=dynamic({'accept':'text/plain'});
let options=dynamic({'Authorization':'Basic \<insert your cloud library credentials hash here\>'});
let variables = evaluate http_request(uri, headers, options)
    | project title = tostring(ResponseBody.['title']), contributor = tostring(ResponseBody.contributor.name), nodeset = parse_xml(tostring(ResponseBody.nodeset.nodesetXml))
    | mv-expand UAVariable = nodeset.UANodeSet.UAVariable
    | extend NodeId = UAVariable.['@NodeId'], ParentNodeId = UAVariable.['@ParentNodeId'], DisplayName = tostring(UAVariable['DisplayName']), DataType = tostring(UAVariable.['@DataType']), References = tostring(UAVariable.['References'])
    | where References !contains "HasModellingRule"
    | where DisplayName != "InputArguments"
    | project-away nodeset, UAVariable, References;
let objects = evaluate http_request(uri, headers, options)
    | project title = tostring(ResponseBody.['title']), contributor = tostring(ResponseBody.contributor.name), nodeset = parse_xml(tostring(ResponseBody.nodeset.nodesetXml))
    | mv-expand UAObject = nodeset.UANodeSet.UAObject
    | extend NodeId = UAObject.['@NodeId'], ParentNodeId = UAObject.['@ParentNodeId'], DisplayName = tostring(UAObject['DisplayName']), References = tostring(UAObject.['References'])
    | where References !contains "HasModellingRule"
    | project-away nodeset, UAObject, References;
let nodes = variables
    | project source = tostring(NodeId), target = tostring(ParentNodeId), name = tostring(DisplayName)
    | join kind=fullouter (objects
        | project source = tostring(NodeId), target = tostring(ParentNodeId), name = tostring(DisplayName)) on source
        | project source = coalesce(source, source1), target = coalesce(target, target1), name = coalesce(name, name1);
let edges = nodes;
edges
    | make-graph source --> target with nodes on source
```

For best results, change the `Layout` option to `Grouped` and the `Lables` to `name`.

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/station-graph.png" alt-text="Graph of the Station Info Model." lightbox="media/concepts-iot-industrial-solution-architecture/station-graph.png" border="false" :::


## Production line simulation

The solution uses a production line simulation made up of several stations, using an OPC UA information model, and a simple Manufacturing Execution System (MES). Both the Stations and the MES are containerized for easy deployment.


### Default simulation configuration

The simulation is configured to include two production lines. The default configuration is:

| Production Line | Ideal Cycle Time (in seconds) |
| --- | --- |
| Munich | 6 |
| Seattle |	10 |

| Shift Name | Start | End |
| --- | --- | --- |
| Morning | 07:00 | 14:00 |
| Afternoon | 15:00 | 22:00 |
| Night | 23:00 | 06:00 |

> [!NOTE]
> Shift times are in local time, specifically the time zone the Virtual Machine (VM) hosting the production line simulation is set to.


### OPC UA node IDs of Station OPC UA server

The following OPC UA Node IDs are used in the Station OPC UA Server for telemetry to the cloud.
* i=379 - manufactured product serial number
* i=385 - number of manufactured products
* i=391 - number of discarded products
* i=398 - running time
* i=399 - faulty time
* i=400 - status (0=station ready to do work, 1=work in progress, 2=work done and good part manufactured, 3=work done and scrap manufactured, 4=station in fault state)
* i=406 - energy consumption
* i=412 - ideal cycle time
* i=418 - actual cycle time
* i=434 - pressure


## Digital feedback loop with UA Cloud Commander and UA Cloud Action

This reference implementation implements a "digital feedback loop", specifically triggering a command on one of the OPC UA servers in the simulation from the cloud, based on time-series data reaching a certain threshold (the simulated pressure). You can see the pressure of the assembly machine in the Seattle production line being released on regular intervals in the Azure Data Explorer dashboard.


## Install the production line simulation and cloud services

Clicking on the button deploys all required resources on Microsoft Azure:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdigitaltwinconsortium%2FManufacturingOntologies%2Fmain%2FDeployment%2Farm.json)

During deployment, you must provide a password for a VM used to host the production line simulation and for UA Cloud Twin. The password must have three of the following attributes: One lower case character, one upper case character, one number, and one special character. The password must be between 12 and 72 characters long.

> [!NOTE]
> To save cost, the deployment deploys just a single Windows 11 Enterprise VM for both the production line simulation and the base OS for the Azure Kubernetes Services Edge Essentials instance. In production scenarios, the production line simulation isn't required and for the base OS for the Azure Kubernetes Services Edge Essentials instance, we recommend Windows IoT Enterprise Long Term Servicing Channel (LTSC).

Once the deployment completes, connect to the deployed Windows VM with an RDP (remote desktop) connection. You can download the RDP file in the [Azure portal](https://portal.azure.com) page for the VM, under the **Connect** options. Sign in using the credentials you provided during deployment, open an **Administrator Powershell window**, navigate to the `C:\ManufacturingOntologies-main\Deployment` directory, and run:

```azurepowershell
New-AksEdgeDeployment -JsonConfigFilePath .\aksedge-config.json
```

After the command is finished, your Azure Kubernetes Services Edge Essentials installation is complete and you can run the production line simulation.

> [!TIP]
> To get logs from all your Kubernetes workloads and services at any time, run `Get-AksEdgeLogs` from an **Administrator Powershell window**.
> 
> To check the memory utilization of your Kubernetes cluster, run `Invoke-AksEdgeNodeCommand -Command "sudo cat /proc/meminfo"` from an **Administrator Powershell window**.


## Run the production line simulation

From the deployed VM, open a **Windows command prompt**. Navigate to the `C:\ManufacturingOntologies-main\Tools\FactorySimulation` directory and run the **StartSimulation** command by supplying the following parameters:

```console
    StartSimulation <EventHubsCS> <StorageAccountCS> <AzureSubscriptionID> <AzureTenantID>
```

Parameters:

| Parameter          | Description                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| EventHubCS         | Copy the Event Hubs namespace connection string as described [here](/azure/event-hubs/event-hubs-get-connection-string). |
| StorageAccountCS   | In the Azure portal, navigate to the Storage Account created by this solution. Select "Access keys" from the left-hand navigation menu. Then, copy the connection string for key1. |
| AzureSubscriptionID | In Azure portal, browse your Subscriptions and copy the ID of the subscription used in this solution. |
| AzureTenantID      | In Azure portal, open the Microsoft Entry ID page and copy your Tenant ID.                           |

The following example shows the command with all parameters:

```console
    StartSimulation Endpoint=sb://ontologies.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=abcdefgh= DefaultEndpointsProtocol=https;AccountName=ontologiesstorage;AccountKey=abcdefgh==;EndpointSuffix=core.windows.net <your-subscription-id> <your-tenant-id>
```

> [!NOTE]
> If you have access to several Azure subscriptions, it's worth first logging into the Azure portal from the VM through the web browser. You can also switch Active Directory tenants through the Azure portal UI (in the top-right-hand corner), to make sure you're logged in to the tenant used during deployment. Once logged in, leave the browser window open. This ensures that the StartSimulation script can more easily connect to the right subscription.
> 
> In this solution, the OPC UA application certificate store for UA Cloud Publisher, and the simulated production line's MES and individual machines' store, is located in the cloud in the deployed Azure Storage account.


## Enable the Kubernetes cluster for management via Azure Arc

1. On your virtual machine, open an **Administrator PowerShell window**. Navigate to the `C:\ManufacturingOntologies-main\Deployment` directory and run `CreateServicePrincipal`. The two parameters `subscriptionID` and `tenantID` can be retrieved from the Azure portal.
1. Run `notepad aksedge-config.json` and provide the following information:

    | Attribute | Description |
    | --- | --- |
    | Location | The Azure location of your resource group. You can find this location in the Azure portal under the resource group that was deployed for this solution, but remove the spaces in the name! Currently supported regions are eastus, eastus2, westus, westus2, westus3, westeurope, and northeurope. |
    | SubscriptionId | Your subscription ID. In the Azure portal, select on the subscription you're using and copy/paste the subscription ID. |
    | TenantId | Your tenant ID. In the Azure portal, select on Azure Active Directory and copy/paste the tenant ID. |
    | ResourceGroupName | The name of the Azure resource group that was deployed for this solution. |
    | ClientId | The name of the Azure Service Principal previously created. Azure Kubernetes Services uses this service principal to connect your cluster to Arc. |
    | ClientSecret | The password for the Azure Service Principal. |

1. Save the file, close the PowerShell window, and open a new **Administrator Powershell window**. Navigate back to the `C:\ManufacturingOntologies-main\Deployment` directory and run `SetupArc`.

You can now manage your Kubernetes cluster from the cloud via the newly deployed Azure Arc instance. In the Azure portal, browse to the Azure Arc instance and select Workloads. The required service token can be retrieved via `Get-AksEdgeManagedServiceToken` from an **Administrator Powershell window** on your virtual machine.

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/arc.png" alt-text="Screenshot of Azure Arc in the Azure portal." lightbox="media/concepts-iot-industrial-solution-architecture/arc.png" border="false" :::


## Deploying Azure IoT Operations on the edge

Make sure you have already started the production line simulation and enabled the Kubernetes Cluster for management via Azure Arc as described in the previous paragraphs. Then, follow these steps:

1. From the Azure portal, navigate to the Key Vault deployed in this reference solution and add your own identity to the access policies by clicking `Access policies`, `Create`, select the `Keys, Secrets & Certificate Management` template, select `Next`, search for and select your own user identity, select `Next`, leave the Application section blank, select `Next` and finally `Create`.
1. Enable custom locations for your Arc-connected Kubernetes cluster (called ontologies_cluster) by first logging in to your Azure subscription via `az login` from an **Administrator PowerShell Window** and then running `az connectedk8s enable-features -n "ontologies_cluster" -g "<resourceGroupName>" --features cluster-connect custom-locations`, providing the `resourceGroupName` from the reference solution deployed.
1. From the Azure portal, deploy Azure IoT Operations by navigating to your Arc-connected kubernetes cluster, select on `Extensions`, `Add`, select `Azure IoT Operations`, and select `Create`. On the Basic page, leave everything as-is. On the Configuration page, set the `MQ Mode` to `Auto`. You don't need to deploy a simulated Programmable Logic Controller (PLC), as this reference solution already contains a much more substantial production line simulation. On the Automation page, select the Key Vault deployed for this reference solution and then copy the `az iot ops init` command automatically generated. From your deployed VM, open a new **Administrator PowerShell Window**, sign in to the correct Azure subscription by running `az login` and then run the `az iot ops init` command with the arguments from the Azure portal. Once the command completes, select `Next` and then close the wizard. 


## Configuring OPC UA security and connectivity for Azure IoT Operations

Make sure you successfully deployed Azure IoT Operations and all Kubernetes workloads are up and running by navigating to the Arc-enabled Kubernetes resource in the Azure portal.

1. From the Azure portal, navigate to the Azure Storage deployed in this reference solution, open the `Storage browser` and then `Blob containers`. Here you can access the cloud-based OPC UA certificate store used in this solution. Azure IoT Operations uses Azure Key Vault as the cloud-based OPC UA certificate store so the certificates need to be copied:
    1. From within the Azure Storage browser's Blob containers, for each simulated production line, navigate to the app/pki/trusted/certs folder, select the assembly, packaging, and test cert file and download it.
    1. Sign in to your Azure subscription via `az login` from an **Administrator PowerShell Window** and then run `az keyvault secret set --name "<stationName>-der" --vault-name <keyVaultName> --file .<stationName>.der --encoding hex --content-type application/pkix-cert`, providing the `keyVaultName` and `stationName` of each of the 6 stations you downloaded a .der cert file for in the previous step.
1. From the deployed VM, open a **Windows command prompt** and run `kubectl apply -f secretsprovider.yaml` with the updated secrets provider resource file provided in the `C:\ManufacturingOntologies-main\Tools\FactorySimulation\Station` directory, providing the Key Vault name, the Azure tenant ID, and the station cert file names and aliases you uploaded to Azure Key Vault previously.
1. From a web browser, sign in to https://iotoperations.azure.com, pick the right Azure directory (top right hand corner) and start creating assets from the production line simulation. The solution comes with two production lines (Munich and Seattle) consisting of three stations each (assembly, test, and packaging):
    1. For the asset endpoints, enter opc.tcp://assembly.munich in the OPC UA Broker URL field for the assembly station of the Munich production line, etc. Select `Do not use transport authentication certificate` (OPC UA certificate-based mutual authentication between Azure IoT Operations and any connected OPC UA server is still being used).
    1. For the asset tags, select `Import CSV file` and open the `StationTags.csv` file located in the `C:\ManufacturingOntologies-main\Tools\FactorySimulation\Station` directory.
1. From the Azure portal, navigate to the Azure Storage deployed in this reference solution, open the `Storage browser` and then `Blob containers`. For each production line simulated, navigate to the `app/pki/rejected/certs` folder and download the Azure IoT Operations certificate file. Then delete the file. Navigate to the `app/pki/trusted/certs` folder and upload the Azure IoT Operations certificate file to this directory.
1. From the deployed VM, open a **Windows command prompt** and restart the production line simulation by navigating to the `C:\ManufacturingOntologies-main\Tools\FactorySimulation` directory and run the **StopSimulation** command, followed by the **StartSimulation** command.
1. Follow the instructions as described [here](/azure/iot-operations/get-started/quickstart-add-assets#verify-data-is-flowing) to verify that data is flowing from the production line simulation.
1. As the last step, connect Azure IoT Operations to the Event Hubs deployed in this reference solution as described [here](/azure/iot-operations/connect-to-cloud/howto-configure-kafka).


## Use cases condition monitoring, calculating OEE, detecting anomalies, and making predictions in Azure Data Explorer

You can also visit the [Azure Data Explorer documentation](/azure/synapse-analytics/data-explorer/data-explorer-overview) to learn how to create no-code dashboards for condition monitoring, yield or maintenance predictions, or anomaly detection. We provided a sample dashboard [here](https://github.com/digitaltwinconsortium/ManufacturingOntologies/blob/main/Tools/ADXQueries/dashboard-ontologies.json) for you to deploy to the ADX Dashboard by following the steps outlined [here](/azure/data-explorer/azure-data-explorer-dashboards#to-create-new-dashboard-from-a-file). After import, you need to update the dashboard's data source by specifying the HTTPS endpoint of your ADX server cluster instance in the format `https://ADXInstanceName.AzureRegion.kusto.windows.net/` in the top-right-hand corner of the dashboard. 

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/dashboard.png" alt-text="Screenshot of an Azure Data Explorer dashboard." lightbox="media/concepts-iot-industrial-solution-architecture/dashboard.png" border="false" :::

> [!NOTE]
> If you want to display the OEE for a specific shift, select `Custom Time Range` in the `Time Range` drop-down in the top-left hand corner of the ADX Dashboard and enter the date and time from start to end of the shift you're interested in. 


## Render the built-in Unified NameSpace (UNS) and ISA-95 model graph in Kusto Explorer

This reference solution implements a Unified NameSapce (UNS), based on the OPC UA metadata sent to the time-series database in the cloud (Azure Data Explorer). This OPC UA metadata also includes the ISA-95 asset hierarchy. The resulting graph can be easily visualized in the Kusto Explorer tool available for download [here](/azure/data-explorer/kusto/tools/kusto-explorer).

Add a new connection to your Azure Data Explorer instance deployed in this reference solution and then run the following query in Kusto Explorer:

```
let edges = opcua_metadata_lkv
| project source = DisplayName, target = Workcell
| join kind=fullouter (opcua_metadata_lkv
    | project source = Workcell, target = Line) on source
    | join kind=fullouter (opcua_metadata_lkv
        | project source = Line, target = Area) on source
        | join kind=fullouter (opcua_metadata_lkv
            | project source = Area, target = Site) on source
            | join kind=fullouter (opcua_metadata_lkv
                | project source = Site, target = Enterprise) on source
                | project source = coalesce(source, source1, source2, source3, source4), target = coalesce(target, target1, target2, target3, target4);
let nodes = opcua_metadata_lkv;
edges | make-graph source --> target with nodes on DisplayName
```

For best results, change the `Layout` option to `Grouped`.

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/isa-95-graph.png" alt-text="Graph that shows an ISA-95 asset hierarchy." lightbox="media/concepts-iot-industrial-solution-architecture/isa-95-graph.png" border="false" :::


## Use Azure Managed Grafana Service

You can also use Grafana to create a dashboard on Azure for the solution described in this article. Grafana is used within manufacturing to create dashboards that display real-time data. Azure offers a service named Azure Managed Grafana. With this, you can create cloud dashboards. In this configuration manual, you enable Grafana on Azure and you create a dashboard with data that is queried from Azure Data Explorer and Azure Digital Twins service, using the simulated production line data from this reference solution. 

The following screenshot shows the dashboard: 

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/grafana.png" alt-text="Screenshot that shows a Grafana dashboard." lightbox="media/concepts-iot-industrial-solution-architecture/grafana.png" border="false" :::


### Enable Azure Managed Grafana Service

1. Go to the Azure portal and search for the service 'Grafana' and select the 'Azure Managed Grafana' service.

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/enable-grafana-service.png" alt-text="Screenshot of enabling Grafana in the Marketplace." lightbox="media/concepts-iot-industrial-solution-architecture/enable-grafana-service.png" border="false" :::

1. Give your instance a name and leave the standard options on - and create the service. 

1. After the service is created, navigate to the URL where you access your Grafana instance. You can find the URL in the homepage of the service. 


### Add a new data source in Grafana

After your first sign in, you'll need to add a new data source to Azure Data Explorer. 

1. Navigate to 'Configuration' and add a new datasource.

1. Search for Azure Data Explorer and select the service.

1. Configure your connection and use the app registration (follow the manual that is provided on the top of this page).

1. Save and test your connection on the bottom of the page. 

### Import a sample dashboard

Now you're ready to import the provided sample dashboard. 

1. Download the sample dashboard here: [Sample Grafana Manufacturing Dashboard](https://github.com/digitaltwinconsortium/ManufacturingOntologies/blob/main/Tools/GrafanaDashboard/samplegrafanadashboard.json).

1. Go to 'Dashboard' and select 'Import'.

1. Select the source that you have downloaded and select on 'Save'. You get an error on the page, because two variables aren't set yet. Go to the settings page of the dashboard.

1. Select on the left on 'Variables' and update the two URLs with the URL of your Azure Digital Twins Service. 

1. Navigate back to the dashboard and hit the refresh button. You should now see data (don't forget to hit the save button on the dashboard).

    The location variable on the top of the page is automatically filled with data from Azure Digital Twins (the area nodes from ISA95). Here you can select the different locations and see the different datapoints of every factory. 

1. If data isn't showing up in your dashboard, navigate to the individual panels and see if the right data source is selected.

### Configure alerts

Within Grafana, it's also possible to create alerts. In this example, we create a low OEE alert for one of the production lines. 

1. Sign in to your Grafana service, and select Alert rules in the menu.

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/navigate-to-alerts.png" alt-text="Screenshot that shows navigation to alerts." lightbox="media/concepts-iot-industrial-solution-architecture/navigate-to-alerts.png" border="false" :::

1. Select 'Create alert rule'.

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/create-rule.png" alt-text="Screenshot that shows how to create an alert rule." lightbox="media/concepts-iot-industrial-solution-architecture/create-rule.png" border="false" :::

1. Give your alert a name and select 'Azure Data Explorer' as data source. Select query in the navigation pane. 

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/alert-query.png" alt-text="Screenshot of creating an alert query." lightbox="media/concepts-iot-industrial-solution-architecture/alert-query.png" border="false" :::

1. In the query field, enter the following query. In this example, we use the 'Seattle' production line. 

    ```
    let oee = CalculateOEEForStation("assembly", "seattle", 6, 6);
    print round(oee * 100, 2)
    ```

1. Select 'table' as output. 

1. Scroll down to the next section. Here, you configure the alert threshold. In this example, we use 'below 10' as the threshold, but in production environments, this value can be higher.

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/threshold-alert.png" alt-text="Screenshot that shows a threshold alert." lightbox="media/concepts-iot-industrial-solution-architecture/threshold-alert.png" border="false" :::

1. Select the folder where you want to save your alerts and configure the 'Alert Evaluation behavior'. Select the option 'every 2 minutes'.

1. Select the 'Save and exit' button. 

In the overview of your alerts, you can now see an alert being triggered when your OEE is below '10'.

:::image type="content" source="media/concepts-iot-industrial-solution-architecture/alert-overview.png" alt-text="Screenshot that shows an alert overview." lightbox="media/concepts-iot-industrial-solution-architecture/alert-overview.png" border="false" :::

You can integrate this setup with, for example, Microsoft Dynamics Field Services.


## Connecting the reference solution to Microsoft Power BI

To connect the reference solution Power BI, you need access to a Power BI subscription. 

Complete the following steps:
1. Install the Power BI Desktop app from [here](https://go.microsoft.com/fwlink/?LinkId=2240819&clcid=0x409).
1. Sign in to Power BI Desktop app using the user with access to the Power BI subscription.
1. From the Azure portal, navigate to your Azure Data Explorer database instance (`ontologies`) and add `Database Admin` permissions to an Azure Active Directory user with access to just a **single** Azure subscription, specifically the subscription used for your deployed instance of this reference solution. Create a new user in Azure Active Directory if you have to.
1. From Power BI, create a new report and select Azure Data Explorer time-series data as a data source via `Get data` -> `Azure` -> `Azure Data Explorer (Kusto)`.
1. In the popup window, enter the Azure Data Explorer endpoint of your instance (for example `https://erichbtest3adx.eastus2.kusto.windows.net`), the database name (`ontologies`) and the following query:

    ```
    let _startTime = ago(1h);
    let _endTime = now();
    opcua_metadata_lkv
    | where Name contains "assembly"
    | where Name contains "munich"
    | join kind=inner (opcua_telemetry
        | where Name == "ActualCycleTime"
        | where Timestamp > _startTime and Timestamp < _endTime
    ) on DataSetWriterID
    | extend NodeValue = todouble(Value)
    | project Timestamp, NodeValue
    ```

1. Select `Load`. This imports the actual cycle time of the Assembly station of the Munich production line for the last hour.
1. When prompted, log into Azure Data Explorer using the Azure Active Directory user you gave permission to access the Azure Data Explorer database earlier.
1. From the `Data view`, select the NodeValue column and select `Don't summarize` in the `Summarization` menu item.
1. Switch to the `Report view`.
1. Under `Visualizations`, select the `Line Chart` visualization.
1. Under `Visualizations`, move the `Timestamp` from the `Data` source to the `X-axis`, select on it and select `Timestamp`.
1. Under `Visualizations`, move the `NodeValue` from the `Data` source to the `Y-axis`, select on it and select `Median`.
1. Save your new report.

    > [!NOTE]
    > You can add other data from Azure Data Explorer to your report similarly.

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/power-bi.png" alt-text="Screenshot of a Power BI view." lightbox="media/concepts-iot-industrial-solution-architecture/power-bi.png" border="false" :::


## Connecting the reference solution to Microsoft Dynamics 365 Field Service

This integration showcases the following scenarios:

- Uploading assets from the Manufacturing Ontologies reference solution to Dynamics 365 Field Service.
- Create alerts in Dynamics 365 Field Service when a certain threshold on Manufacturing Ontologies reference solution telemetry data is reached.

The integration uses Azure Logics Apps. With Logic Apps bussiness-critcal apps and services can be connected via no-code workflows. We fetch information from Azure Data Explorer and trigger actions in Dynamics 365 Field Service.

First, if you're not already a Dynamics 365 Field Service customer, activate a 30 day trial [here](https://dynamics.microsoft.com/field-service/field-service-management-software/free-trial). Remember to use the same Microsoft Entra ID (formerly Azure Active Directory) used while deploying the Manufacturing Ontologies reference solution. Otherwise, you would need to configure cross tenant authentication that isn't part of these instructions!

### Create an Azure Logic App workflow to create assets in Dynamics 365 Field Service

Let's start with uploading assets from the Manufacturing Ontologies into Dynamics 365 Field Service:

1. Go to the Azure portal and create a new Logic App.

2. Give the Azure Logic App a name, place it in the same resource group as the Manufacturing Ontologies reference solution.

3. Select on 'Workflows'.

4. Give your workflow a name - for this scenario we use the stateful state type, because assets aren't flows of data.

5. Create a new trigger. We start with creating a 'Recurrence' trigger. This checks the database every day if new assets are created. You can change this to happen more often.

6. In actions, search for `Azure Data Explorer` and select the `Run KQL query` command. Within this query, we check what kind of assets we have. Use the following query to get assets and paste it in the query field:

    ```
    let ADTInstance =  "PLACE YOUR ADT URL";let ADTQuery = "SELECT T.OPCUAApplicationURI as AssetName, T.$metadata.OPCUAApplicationURI.lastUpdateTime as UpdateTime FROM DIGITALTWINS T WHERE IS_OF_MODEL(T , 'dtmi:digitaltwins:opcua:nodeset;1') AND T.$metadata.OPCUAApplicationURI.lastUpdateTime > 'PLACE DATE'";evaluate azure_digital_twins_query_request(ADTInstance, ADTQuery)
    ```

7. To get your asset data into Dynamics 365 Field Service, you need to connect to Microsoft Dataverse. Connect to your Dynamics 365 Field Service instance and use the following configuration:

    - Use the 'Customer Assets' Table Name
    - Put the 'AssetName' into the Name field

8. Save your workflow and run it. You see in a few seconds later that new assets are created in Dynamics 365 Field Service.

### Create an Azure Logic App workflow to create alerts in Dynamics 365 Field Service

This workflow creates alerts in Dynamics 365 Field Service, specifically when a certain threshold of FaultyTime on an asset of the Manufacturing Ontologies reference solution is reached.

1. We first need to create an Azure Data Explorer function to get the right data. Go to your Azure Data Explorer query panel in the Azure portal and run the following code to create a FaultyFieldAssets function:

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/adx-query.png" alt-text="Screenshot of creating a function ADX query." lightbox="media/concepts-iot-industrial-solution-architecture/adx-query.png" border="false" :::

    ```
    .create-or-alter function  FaultyFieldAssets() {  
    let Lw_start = ago(3d);
    opcua_telemetry
    | where Name == 'FaultyTime'
    and Value > 0
    and Timestamp between (Lw_start .. now())
    | join kind=inner (
        opcua_metadata
        | extend AssetList =split (Name, ';')
        | extend AssetName=AssetList[0]
        ) on DataSetWriterID
    | project AssetName, Name, Value, Timestamp}
    ```

2. Create a new workflow in Azure Logic App. Create a 'Recurrence' trigger to start - every 3 minutes. Create as action 'Azure Data Explorer' and select the Run KQL Query.

3. Enter your Azure Data Explorer Cluster URL, then select your database and use the function name created in step 1 as the query.

4. Select Microsoft Dataverse as action.

5. Run the workflow and to see new alerts being generated in your Dynamics 365 Field Service dashboard:

    :::image type="content" source="media/concepts-iot-industrial-solution-architecture/dynamics-iot-alerts.png" alt-text="Screenshot of alerts in Dynamics 365 FS." lightbox="media/concepts-iot-industrial-solution-architecture/dynamics-iot-alerts.png" border="false" :::


## Related content

- [Connect on-premises SAP systems to Azure](howto-connect-on-premises-sap-to-azure.md)
- [Connecting Azure IoT Operations to Microsoft Fabric](../iot-operations/connect-to-cloud/howto-configure-destination-fabric.md)
