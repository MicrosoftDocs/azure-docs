---
title: Deploy Azure Log Analytics Nozzle for Cloud Foundry monitoring | Microsoft Docs
description: Step-by-step guidance on deploying the Cloud Foundry loggregator Nozzle for Azure Log Analytics. Use the Nozzle to monitor the Cloud Foundry system health and performance metrics.
services: virtual-machines-linux
author: ningk
manager: jeconnoc
tags: Cloud-Foundry

ms.assetid: 00c76c49-3738-494b-b70d-344d8efc0853
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 07/22/2017
ms.author: ningk
---

# Deploy Azure Log Analytics Nozzle for Cloud Foundry system monitoring

[Azure Monitor](https://azure.microsoft.com/services/log-analytics/) is a service in Azure. It helps you collect and analyze data that is generated from your cloud and on-premises environments.

The Log Analytics Nozzle (the Nozzle) is a Cloud Foundry (CF) component, which forwards metrics from the [Cloud Foundry loggregator](https://docs.cloudfoundry.org/loggregator/architecture.html) firehose to Azure Monitor logs. With the Nozzle, you can collect, view, and analyze your CF system health and performance metrics, across multiple deployments.

In this document, you learn how to deploy the Nozzle to your CF environment, and then access the data from the Azure Monitor logs console.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

The following steps are prerequisites for deploying the Nozzle.

### 1. Deploy a CF or Pivotal Cloud Foundry environment in Azure

You can use the Nozzle with either an open source CF deployment or a Pivotal Cloud Foundry (PCF) deployment.

* [Deploy Cloud Foundry on Azure](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/blob/master/docs/guidance.md)

* [Deploy Pivotal Cloud Foundry on Azure](https://docs.pivotal.io/pivotalcf/1-11/customizing/azure.html)

### 2. Install the CF command-line tools for deploying the Nozzle

The Nozzle runs as an application in CF environment. You need CF CLI to deploy the application.

The Nozzle also needs access permission to the loggregator firehose and the Cloud Controller. To create and configure the user, you need the User Account and Authentication (UAA) service.

* [Install Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

* [Install Cloud Foundry UAA command-line client](https://github.com/cloudfoundry/cf-uaac/blob/master/README.md)

Before setting up the UAA command-Line client, ensure that RubyGems is installed.

### 3. Create a Log Analytics workspace in Azure

You can create the Log Analytics workspace manually or by using a template. The template will deploy a setup of pre-configured KPI views and alerts for the Azure Monitor logs console. 

#### To create the workspace manually:

1. In the Azure portal, search the list of services in the Azure Marketplace, and then select Log Analytics workspaces.
2. Select **Create**, and then select choices for the following items:

   * **Log Analytics workspace**: Type a name for your workspace.
   * **Subscription**: If you have multiple subscriptions, choose the one that is the same as your CF deployment.
   * **Resource group**: You can create a new resource group, or use the same one with your CF deployment.
   * **Location**: Enter the location.
   * **Pricing tier**: Select **OK** to complete.

For more information, see [Get started with Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-get-started).

#### To create the Log Analytics workspace through the monitoring template from Azure market place:

1. Open Azure portal.
1. Click the "+" sign, or "Create a resource" on the top left corner.
1. Type "Cloud Foundry" in the search window, select "Cloud Foundry Monitoring Solution".
1. The Cloud Foundry monitoring solution template front page is loaded, click "Create" to launch the template blade.
1. Enter the required parameters:
    * **Subscription**: Select an Azure subscription for the Log Analytics workspace, usually the same with Cloud Foundry deployment.
    * **Resource group**: Select an existing resource group or create a new one for the Log Analytics workspace.
    * **Resource Group Location**: Select the location of the resource group.
    * **OMS_Workspace_Name**: Enter a workspace name, if the workspace does not exist, the template will create a new one.
    * **OMS_Workspace_Region**: Select the location for the workspace.
    * **OMS_Workspace_Pricing_Tier**: Select the Log Analytics workspace SKU. See the [pricing guidance](https://azure.microsoft.com/pricing/details/log-analytics/) for reference.
    * **Legal terms**: Click Legal terms, then click “Create” to accept the legal term.
1. After all parameters are specified, click “Create” to deploy the template. When the deployment is completed, the status will show up at the notification tab.


## Deploy the Nozzle

There are a couple of different ways to deploy the Nozzle: as a PCF tile or as a CF application.

### Deploy the Nozzle as a PCF Ops Manager tile

Follow the steps to [install and configure the Azure Log Analytics Nozzle for PCF](https://docs.pivotal.io/partners/azure-log-analytics-nozzle/installing.html).This is the simplified approach, the PCF Ops manager tile will automatically configure and push the nozzle. 

### Deploy the Nozzle manually as a CF application

If you are not using PCF Ops Manager, deploy the Nozzle as an application. The following sections describe this process.

#### Sign in to your CF deployment as an admin through CF CLI

Run the following command:
```
cf login -a https://api.${SYSTEM_DOMAIN} -u ${CF_USER} --skip-ssl-validation
```

"SYSTEM_DOMAIN" is your CF domain name. You can retrieve it by searching the "SYSTEM_DOMAIN" in your CF deployment manifest file. 

"CF_User" is the CF admin name. You can retrieve the name and password by searching the "scim" section, looking for the name and the "cf_admin_password" in your CF deployment manifest file.

#### Create a CF user and grant required privileges

Run the following commands:
```
uaac target https://uaa.${SYSTEM_DOMAIN} --skip-ssl-validation
uaac token client get admin
cf create-user ${FIREHOSE_USER} ${FIREHOSE_USER_PASSWORD}
uaac member add cloud_controller.admin ${FIREHOSE_USER}
uaac member add doppler.firehose ${FIREHOSE_USER}
```

"SYSTEM_DOMAIN" is your CF domain name. You can retrieve it by searching the "SYSTEM_DOMAIN" in your CF deployment manifest file.

#### Download the latest Log Analytics Nozzle release

Run the following command:
```
git clone https://github.com/Azure/oms-log-analytics-firehose-nozzle.git
cd oms-log-analytics-firehose-nozzle
```

#### Set environment variables

Now you can set environment variables in the manifest.yml file in your current directory. The following shows the app manifest for the Nozzle. Replace values with your specific Log Analytics workspace information.

```
OMS_WORKSPACE             : Log Analytics workspace ID: Open your Log Analytics workspace in the Azure portal, select **Advanced settings**, select **Connected Sources**, and select **Windows Servers**.
OMS_KEY                   : OMS key: Open your Log Analytics workspace in the Azure portal, select **Advanced settings**, select **Connected Sources**, and select **Windows Servers**.
OMS_POST_TIMEOUT          : HTTP post timeout for sending events to Azure Monitor logs. The default is 10 seconds.
OMS_BATCH_TIME            : Interval for posting a batch to Azure Monitor logs. The default is 10 seconds.
OMS_MAX_MSG_NUM_PER_BATCH : The maximum number of messages in a batch to Azure Monitor logs. The default is 1000.
API_ADDR                  : The API URL of the CF environment. For more information, see the preceding section, "Sign in to your CF deployment as an admin through CF CLI."
DOPPLER_ADDR              : Loggregator's traffic controller URL. For more information, see the preceding section, "Sign in to your CF deployment as an admin through CF CLI."
FIREHOSE_USER             : CF user you created in the preceding section, "Create a CF user and grant required privileges." This user has firehose and Cloud Controller admin access.
FIREHOSE_USER_PASSWORD    : Password of the CF user above.
EVENT_FILTER              : Event types to be filtered out. The format is a comma-separated list. Valid event types are METRIC, LOG, and HTTP.
SKIP_SSL_VALIDATION       : If true, allows insecure connections to the UAA and the traffic controller.
CF_ENVIRONMENT            : Enter any string value for identifying logs and metrics from different CF environments.
IDLE_TIMEOUT              : The Keep Alive duration for the firehose consumer. The default is 60 seconds.
LOG_LEVEL                 : The logging level of the Nozzle. Valid levels are DEBUG, INFO, and ERROR.
LOG_EVENT_COUNT           : If true, the total count of events that the Nozzle has received and sent are logged to Azure Monitor logs as CounterEvents.
LOG_EVENT_COUNT_INTERVAL  : The time interval of the logging event count to Azure Monitor logs. The default is 60 seconds.
```

### Push the application from your development computer

Ensure that you are under the oms-log-analytics-firehose-nozzle folder. Run the following command:
```
cf push
```

## Validate the Nozzle installation

### From Apps Manager (for PCF)

1. Sign in to Ops Manager, and make sure the tile is displayed on the installation dashboard.
2. Sign in to Apps Manager, make sure the space you have created for the Nozzle is listed on the usage report, and confirm that the status is normal.

### From your development computer

In the CF CLI window, type:
```
cf apps
```
Make sure the OMS Nozzle application is running.

## View the data in the Azure portal

If you have deployed the monitoring solution through the market place template, go to Azure portal and locate the solution. You can find the solution in the resource group you specified in the template. Click the solution, browse to the "log analytics console", the pre-configured views are listed, with top Cloud Foundry system KPIs, application data, alerts and VM health metrics. 

If you have created the Log Analytics workspace manually, follow steps below to create the views and alerts:

### 1. Import the OMS view

From the OMS portal, browse to **View Designer** > **Import** > **Browse**, and select one of the omsview files. For example, select *Cloud Foundry.omsview*, and save the view. Now a tile is displayed on the **Overview** page. Select it to see visualized metrics.

You can customize these views or create new views through **View Designer**.

The *"Cloud Foundry.omsview"* is a preview version of the Cloud Foundry OMS view template. This is a fully configured, default template. If you have suggestions or feedback about the template, send them to the [issue section](https://github.com/Azure/oms-log-analytics-firehose-nozzle/issues).

### 2. Create alert rules

You can [create the alerts](https://docs.microsoft.com/azure/log-analytics/log-analytics-alerts), and customize the queries and threshold values as needed. The following are recommended alerts:

| Search query                                                                  | Generate alert based on | Description                                                                       |
| ----------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| Type=CF_ValueMetric_CL Origin_s=bbs Name_s="Domain.cf-apps"                   | Number of results < 1   | **bbs.Domain.cf-apps** indicates if the cf-apps Domain is up-to-date. This means that CF App requests from Cloud Controller are synchronized to bbs.LRPsDesired (Diego-desired AIs) for execution. No data received means cf-apps Domain is not up-to-date in the specified time window. |
| Type=CF_ValueMetric_CL Origin_s=rep Name_s=UnhealthyCell Value_d>1            | Number of results > 0   | For Diego cells, 0 means healthy, and 1 means unhealthy. Set the alert if multiple unhealthy Diego cells are detected in the specified time window. |
| Type=CF_ValueMetric_CL Origin_s="bosh-hm-forwarder" Name_s="system.healthy" Value_d=0 | Number of results > 0 | 1 means the system is healthy, and 0 means the system is not healthy. |
| Type=CF_ValueMetric_CL Origin_s=route_emitter Name_s=ConsulDownMode Value_d>0 | Number of results > 0   | Consul emits its health status periodically. 0 means the system is healthy, and 1 means that the route emitter detects that Consul is down. |
| Type=CF_CounterEvent_CL Origin_s=DopplerServer (Name_s="TruncatingBuffer.DroppedMessages" or Name_s="doppler.shedEnvelopes") Delta_d>0 | Number of results > 0 | The delta number of messages intentionally dropped by Doppler due to back pressure. |
| Type=CF_LogMessage_CL SourceType_s=LGR MessageType_s=ERR                      | Number of results > 0   | Loggregator emits **LGR** to indicate problems with the logging process. An example of such a problem is when the log message output is too high. |
| Type=CF_ValueMetric_CL Name_s=slowConsumerAlert                               | Number of results > 0   | When the Nozzle receives a slow consumer alert from loggregator, it sends the **slowConsumerAlert** ValueMetric to Azure Monitor logs. |
| Type=CF_CounterEvent_CL Job_s=nozzle Name_s=eventsLost Delta_d>0              | Number of results > 0   | If the delta number of lost events reaches a threshold, it means the Nozzle might have a problem running. |

## Scale

You can scale the Nozzle and the loggregator.

### Scale the Nozzle

You should start with at least two instances of the Nozzle. The firehose distributes the workload across all instances of the Nozzle.
To make sure the Nozzle can keep up with the data traffic from the firehose, set up the **slowConsumerAlert** alert (listed in the preceding section, "Create alert rules"). After you have been alerted, follow the [guidance for slow Nozzle](https://docs.pivotal.io/pivotalcf/1-11/loggregator/log-ops-guide.html#slow-noz) to determine whether scaling is needed.
To scale up the Nozzle, use Apps Manager or the CF CLI to increase the instance numbers or the memory or disk resources for the Nozzle.

### Scale the loggregator

Loggregator sends an **LGR** log message to indicate problems with the logging process. You can monitor the alert to determine whether the loggregator needs to be scaled up.
To scale up the loggregator, either increase the Doppler buffer size, or add additional Doppler server instances in the CF manifest. For more information, see [the guidance for scaling the loggregator](https://docs.cloudfoundry.org/running/managing-cf/logging-config.html#scaling).

## Update

To update the Nozzle with a newer version, download the new Nozzle release, follow the steps in the preceding "Deploy the Nozzle" section, and push the application again.

### Remove the Nozzle from Ops Manager

1. Sign in to Ops Manager.
2. Locate the **Microsoft Azure Log Analytics Nozzle for PCF** tile.
3. Select the garbage icon, and confirm the deletion.

### Remove the Nozzle from your development computer

In your CF CLI window, type:
```
cf delete <App Name> -r
```

If you remove the Nozzle, the data in OMS portal is not automatically removed. It expires based on your Azure Monitor logs retention setting.

## Support and feedback

Azure Log Analytics Nozzle is open sourced. Send your questions and feedback to the [GitHub section](https://github.com/Azure/oms-log-analytics-firehose-nozzle/issues). 
To open an Azure support request, choose "Virtual Machine running Cloud Foundry" as the service category. 

## Next step

From PCF2.0, VM performance metrics are transferred to Azure Log Analytics nozzle by System Metrics Forwarder, and integrated into the Log Analytics workspace. You no longer need the Log Analytics agent for the VM performance metrics. 
However you can still use the Log Analytics agent to collect Syslog information. The Log Analytics agent is installed as a Bosh add-on to your CF VMs. 

For details, see [Deploy Log Analytics agent to your Cloud Foundry deployment](https://github.com/Azure/oms-agent-for-linux-boshrelease).
