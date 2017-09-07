---
title: Deploy Azure Log Analytics Nozzle for Cloud Foundry Monitoring| Microsoft Docs
description: Step by step guidance on deploy Cloud Foundry loggregator nozzle for Azure Log Analytics, config Azure Log Analytics and OMS console, and use these tools to monitor the Cloud Foundry system health and performance metrics.
services: virtual-machines-linux
documentationcenter: ''
author: ningk
manager: timlt
editor: ''
tags: Cloud-Foundry

ms.assetid: 00c76c49-3738-494b-b70d-344d8efc0853
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 07/22/2017
ms.author: ningk
---

# Deploy Azure Log Analytics Nozzle for Cloud Foundry system monitoring

## Background

[Azure Log Analytics](https://azure.microsoft.com/services/log-analytics/) is a service in Microsoft [Operations Management Suite](https://docs.microsoft.com/azure/operations-management-suite/) (OMS). It helps you collect and analyze data that is generated from your cloud and on-premises environments.

The Microsoft Azure Log Analytics Nozzle (the Nozzle) is a Cloud Foundry component, which forwards metrics from the [Cloud Foundry Loggregator](https://docs.cloudfoundry.org/loggregator/architecture.html) Firehose to Azure Log Analytics. With the Nozzle, you are able to collect, view, analyze your Cloud Foundry system health and performance metrics, across multiple deployments.

In this document, you learn how to deploy the Nozzle to your Cloud Foundry environment, then access the data from the Azure Log Analytics OMS console.

## Prerequisites

### 1. Deploy a CF or PCF environment in Azure

You can use the Nozzle with either an open source Cloud Foundry (CF) deployment or a Pivotal Cloud Foundry (PCF) deployment.

* [Deploy Cloud Foundry on Azure](https://github.com/cloudfoundry-incubator/bosh-azure-cpi-release/blob/master/docs/guidance.md)

* [Deploy Pivotal Cloud Foundry on Azure](https://docs.pivotal.io/pivotalcf/1-11/customizing/azure.html)

### 2. Install the CF command-line tools for deploying the Nozzle

The Nozzle runs as an application in CF environment, you need CF CLI to deploy the application. 
It also needs access permission to the loggregator firehose and the Cloud Controller, you need UAA command-line client to create and configure the user.

* [Install Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

* [Install Cloud Foundry UAA Command-Line Client](https://github.com/cloudfoundry/cf-uaac/blob/master/README.md)

Make sure Rubygems is installed before setting up UAA command-Line Client.

### 3. Create an OMS workspace in Azure

#### Create the OMS workspace manually

You can create the OMS workspace manually, and load the pre-configured OMS views and alerts after you finished the Nozzle deployment.

1. In the Azure portal, search the list of services in the Marketplace for Log Analytics, and then select Log Analytics.
2. Click Create, then select choices for the following items:

* OMS Workspace: Type a name for your workspace.
* Subscription: If you have multiple subscriptions, choose the same one with your CF deployment.
* Resource group: You can create a new resource group, or use the same one with your CF deployment.
* Location
* Pricing tier: Click OK to complete.
> For more information, see [Get started with Log Analytics](https://docs.microsoft.com/azure/log-analytics/log-analytics-get-started)

#### Create the OMS workspace through the OMS template

You can create the OMS workspace, load the Pre-configured OMS views and alerts, all through the [Azure OMS Log Analytics Solution for Cloud Foundry](https://github.com/Azure/azure-quickstart-templates/tree/master/oms-cloudfoundry-solution)

## Deploy the Nozzle

### Deploy the Nozzle as a PCF Ops Manager tile

If you've deployed PCF via Ops Manager, follow these steps to [Install and Configure the Nozzle for PCF](http://docs.pivotal.io/partners/azure-log-analytics-nozzle/installing.html), the Nozzle is installed as a tile with Ops manager.

### Deploy the Nozzle as an application to Cloud Foundry

If you are not using PCF Ops Manager, you need to push the Nozzle as an application.

#### Log in to your CF deployment as an admin through CF CLI

On your Dev box, run following command:
```
cf login -a https://api.${SYSTEM_DOMAIN} -u ${CF_USER} --skip-ssl-validation
```

> "SYSTEM_DOMAIN" is your CF domain name. You can retrieve it by searching the "SYSTEM_DOMAIN" in your CF deployment manifest file. 
> "CF_User" is the CF admin name. You may retrieve the name and password by searching the "scim" section, looking for the name and the "cf_admin_password" in your CF deployment manifest file.

#### Create a CF user and grant required privileges

On your Dev box, run following commands:
```
uaac target https://uaa.${SYSTEM_DOMAIN} --skip-ssl-validation
uaac token client get admin
cf create-user ${FIREHOSE_USER} ${FIREHOSE_USER_PASSWORD}
uaac member add cloud_controller.admin ${FIREHOSE_USER}
uaac member add doppler.firehose ${FIREHOSE_USER}
```

> "SYSTEM_DOMAIN" is your CF domain name. You can retrieve it by searching the "SYSTEM_DOMAIN" in your CF deployment manifest file.

#### Download the latest Azure Log Analytics Nozzle release

On your Dev box, run following command:
```
git clone https://github.com/Azure/oms-log-analytics-firehose-nozzle.git
cd oms-log-analytics-firehose-nozzle
```

#### Set environment variables in "manifest.yml" in your current directory

This is the app manifest for the Nozzle, you need to replace the value with your specific OMS workspace information.

```
OMS_WORKSPACE             : OMS workspace ID: open OMS portal from your OMS workspace, click "Settings", click "connected sources"
OMS_KEY                   : OMS key: open OMS portal from your OMS workspace, click "Settings", click "connected sources"
OMS_POST_TIMEOUT          : HTTP post timeout for sending events to OMS Log Analytics, default is 10s.
OMS_BATCH_TIME            : Interval for posting a batch to OMS Log Analytics, default is 10s.
OMS_MAX_MSG_NUM_PER_BATCH : The max number of messages in a batch to OMS Log Analytics, default is 1000.
API_ADDR                  : The api URL of the CF environment, refer to "Push the Nozzle as an App to Cloud Foundry" section step 1 on how to retrive your <CF_SYSTEM_DOMAIN>
DOPPLER_ADDR              : Loggregator's traffic controller URL, refer to "Deploy the Nozzle as an App to Cloud Foundry" section step 1 on how to retrive your <CF_SYSTEM_DOMAIN>
FIREHOSE_USER             : CF user you created in "Push the Nozzle as an App to Cloud Foundry" section, who has firehose and Cloud Controller admin access.
FIREHOSE_USER_PASSWORD    : Password of the CF user above.
EVENT_FILTER              : Event types to be filtered out. The format is a comma separated list, valid event types are METRIC,LOG,HTTP
SKIP_SSL_VALIDATION       : If true, allows insecure connections to the UAA and the Trafficcontroller
CF_ENVIRONMENT            : Enter any string value for identifying logs and metrics from different CF environments
IDLE_TIMEOUT              : Keep Alive duration for the firehose consumer, default is 60s.
LOG_LEVEL                 : Logging level of the nozzle, valid levels: DEBUG, INFO, ERROR
LOG_EVENT_COUNT           : If true, the total count of events that the nozzle has received and sent will be logged to OMS Log Analytics as CounterEvents
LOG_EVENT_COUNT_INTERVAL  : The time interval of logging event count to OMS Log Analytics, default is 60s.
```

### Push the application from your dev box

Make sure you are under the folder "oms-log-analytics-firehose-nozzle", run:
```
cf push
```

## Validate the Nozzle installation

### From Apps Manager (For PCF)

1. Log in to Ops Manager, make sure the tile is displayed on the installation dashboard.
2. Log in to Apps Manager, make sure the space you have created for the Nozzle is listed on the usage report, and the status is normal.

### From dev box

On your Dev box CF CLI window, type:
```
cf apps
```
Make sure the OMS Nozzle application is running.

## View the data in OMS portal

### 1. Import OMS view

From the OMS portal, browse to **View Designer** -> **Import** -> **Browse**, select one of the omsview files, for example, *Cloud Foundry.omsview*, and save the view. Now a **Tile** is displayed on the main OMS Overview page. Click the **Tile**, it shows visualized metrics.

Operators could customize these views or create new views through **View Designer**.

The *"Cloud Foundry.omsview"* is a preview version of Cloud Foundry OMS view template, a fully configured default template is in progress, please send your suggestions and feedback to the [Issue Section](https://github.com/Azure/oms-log-analytics-firehose-nozzle/issues).

### 2. Create alert rules

Operators can [create the alerts](https://docs.microsoft.com/azure/log-analytics/log-analytics-alerts), customize the queries and threshold values as needed. Following are a set of recommended alerts.

| Search query                                                                  | Generate alert based on | Description                                                                       |
| ----------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------- |
| Type=CF_ValueMetric_CL Origin_s=bbs Name_s="Domain.cf-apps"                   | Number of results < 1   | **bbs.Domain.cf-apps** indicates if the cf-apps Domain is up-to-date, meaning that CF App requests from Cloud Controller are synchronized to bbs.LRPsDesired (Diego-desired AIs) for execution. No data received means cf-apps Domain is not up-to-date in the given time window. |
| Type=CF_ValueMetric_CL Origin_s=rep Name_s=UnhealthyCell Value_d>1            | Number of results > 0   | For Diego cells, 0 means healthy, and 1 means unhealthy. Set the alert if multiple **unhealthy Diego cells** are detected in the given time window. |
| Type=CF_ValueMetric_CL Origin_s="bosh-hm-forwarder" Name_s="system.healthy" Value_d=0 | Number of results > 0 | 1 means the system is healthy, and 0 means the system is not healthy. |
| Type=CF_ValueMetric_CL Origin_s=route_emitter Name_s=ConsulDownMode Value_d>0 | Number of results > 0   | Consul emits its health status periodically. 0 means the system is healthy, and 1 means that route emitter detects that **Consul is down**. |
| Type=CF_CounterEvent_CL Origin_s=DopplerServer (Name_s="TruncatingBuffer.DroppedMessages" or Name_s="doppler.shedEnvelopes") Delta_d>0 | Number of results > 0 | The delta number of messages intentionally **dropped** by Doppler due to back pressure. |
| Type=CF_LogMessage_CL SourceType_s=LGR MessageType_s=ERR                      | Number of results > 0   | Loggregator emits **LGR** to indicate problems with the logging process, for example, when log message output is too high. |
| Type=CF_ValueMetric_CL Name_s=slowConsumerAlert                               | Number of results > 0   | When the nozzle receives slow consumer alert from Loggregator, it sends **slowConsumerAlert** ValueMetric to OMS. |
| Type=CF_CounterEvent_CL Job_s=nozzle Name_s=eventsLost Delta_d>0              | Number of results > 0   | If the delta number of **lost events** reaches a threshold, it means the nozzle might have some problem running. |

## Scale

### Scale the Nozzle

We recommend operators to start with at least two instances of the nozzle. The firehose distributes the workload across all instances of the nozzle.
To make sure the nozzle can keep up with the data traffic from the firehose, the operator should set up the **slowConsumerAlert** alert listed in the "Create Alert Rules" section; once alerted, follow the [guidance for slow nozzle](https://docs.pivotal.io/pivotalcf/1-11/loggregator/log-ops-guide.html#slow-noz) to determine whether scaling is needed.
To scale up the nozzle, use Apps Manager or the CF CLI to increase the instance numbers or memory/disk resources for the nozzle.

### Scale the Loggregator

Loggregator sends **LGR** log message to indicate problems with the logging process. The operator can monitor the alert to determine whether the loggregator needs to be scaled up.
To scale up the loggregator, the operator can either increase Doppler buffer size or add additional Doppler server instances in the CF manifest, for details, check [the guidance for scaling the Loggregator](https://docs.cloudfoundry.org/running/managing-cf/logging-config.html#scaling).

## Update

To update the Nozzle with a newer version, download the new Nozzle release, follow the steps in "Deploy" section, push the application again.

To remove the Nozzle, follow these steps:

### From the Ops Manager

1. Log in to Ops Manager
2. Locate the "Microsoft Azure Log Analytics Nozzle for PCF" tile
3. Click the garbage icon, confirm the deleting action.

### From the dev box

On your CF CLI window, type:
```
cf delete <App Name> -r
```

If you remove the Nozzle, the data in OMS portal is not automatically removed, it expires based on your OMS log analytics retention setting.

## Support and feedback

Azure Log Analytics Nozzle is open sourced, send your questions and feedback to the [github section](https://github.com/Azure/oms-log-analytics-firehose-nozzle/issues). 
To open Azure support request, use the "Virtual Machine running Cloud Foundry" as the service category. 

## Next step

In addition to the Cloud Foundry metrics that is covered in the Nozzle, you can utilize OMS agent to gain insights to the VM level operational data (Syslog, Performance, Alerts, Inventory), it is installed as a Bosh Addon to your CF VMs.
> See [Deploy OMS agent to your Cloud Foundry deployment](https://github.com/Azure/oms-agent-for-linux-boshrelease) for details.