---
title: Resource Health for Cloud Services (Classic)
description: This article talks about Resource Health Check (RHC) Support for Microsoft Azure Cloud Services (Classic)
ms.topic: article
ms.service: cloud-services
ms.subservice: resource-health
ms.date: 07/24/2024
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Resource Health Check (RHC) Support for Azure Cloud Services (Classic)

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

This article  talks about Resource Health Check (RHC) Support for [Microsoft Azure Cloud Services (Classic)](https://azure.microsoft.com/services/cloud-services)

[Azure Resource Health](../service-health/resource-health-overview.md) for cloud services helps you diagnose and get support for service problems that affect your Cloud Service deployment, Roles & Role Instances. It reports on the current and past health of your cloud services at Deployment, Role & Role Instance level.

Azure status reports on problems that affect a broad set of Azure customers. Resource Health gives you a personalized dashboard of the health of your resources. Resource Health shows all the times that your resources were unavailable because of Azure service problems. This data makes it easy for you to see if a Service Level Agreement (SLA) was violated.

:::image type="content" source="media/cloud-services-allocation-failure/rhc-blade-cloud-services.png" alt-text="Image shows the resource health check blade in the Azure portal.":::

## How health is checked and reported?
Resource health is reported at a deployment or role level. The health check happens at role instance level. We aggregate the status and report it on Role level. For example, if all role instances are available, then the role status is available. Similarly, we aggregate the health status of all roles and report it on deployment level. For example, if all roles are available, then deployment status becomes available. 

## Why I can't see health status for my staging slot deployment?
Resource health checks only work for production slot deployment. Staging slot deployment isn't yet supported. 

## Does Resource Health Check also check the health of the application?
No, health check only happens for role instances and it doesn't monitor Application health. For example, even if one out of three role instances are unhealthy, the application can still be available. RHC doesn't use [load balancer probes](../load-balancer/load-balancer-custom-probe-overview.md) or Guest agent probe. Therefore,
Customers should continue to using load balancer probes to monitor the health of their application. 

## What are the annotations for Cloud Services?
Annotations are the health status of the deployment or roles. There are different annotations based on health status, reason for status change, etc. 

## What does it mean by Role Instance being "unavailable"?
Unavailable means the role instance isn't emitting a healthy signal to the platform. Check the role instance status for detailed explanation of why healthy signal isn't being emitted.

## What does it mean by deployment being "unknown"?
Unknown means the aggregated health of the Cloud Service deployment can't be determined. Usually, unknown indicates one of the following scenarios:
* There's no production deployment created for the Cloud Service
* The deployment was newly created (and that Azure is starting to collect health events)
* The platform is having issues collecting health events for this deployment.

## Why does Role Instance Annotations mention VMs instead of Role Instances?
Since Role Instances are, in essence, virtual machines (VMs), and the health check for VMs is reused for Role Instances, the VM term is used to represent Role Instances. 

## Cloud Services (Deployment Level) Annotations & their meanings
| Annotation | Description | 
| --- | --- | 
| Available| There aren't any known Azure platform problems affecting this Cloud Service deployment |
| Unknown | We're currently unable to determine the health of this Cloud Service deployment | 
| Setting up Resource Health | Setting up Resource health for this resource. Resource health watches your Azure resources to provide details about ongoing and past events that affected them|
| Degraded | Your Cloud Service deployment is degraded. We're working to automatically recover your Cloud Service deployment and to determine the source of the problem. No further action is required from you at this time |
| Unhealthy | Your Cloud Service deployment is unhealthy because {0} out of {1} role instances are unavailable |
| Degraded | Your Cloud Service deployment is degraded because {0} out of {1} role instances are unavailable | 
| Available and maybe impacted | Your Cloud Service deployment is running, however an ongoing Azure service outage may prevent you from connecting to it. Connectivity restores once the outage is resolved |
| Unavailable and maybe impacted | An Azure service outage possibly affected the health of this Cloud Service deployment. Your Cloud Service deployment recovers automatically when the outage is resolved |
| Unknown and maybe impacted | We're currently unable to determine the health of this Cloud Service deployment. This status could be a result of an ongoing Azure service outage that may be impacting this virtual machine, which recovers automatically when the outage is resolved |

## Cloud Services (Role Instance Level) Annotations & their meanings
| Annotation | Description | 
| --- | --- | 
| Available | There aren't any known Azure platform problems affecting this virtual machine | 
| Unknown | We're currently unable to determine the health of this virtual machine |
| Stopped and deallocating | This virtual machine is stopping and deallocating as requested by an authorized user or process |
| Setting up Resource Health | Setting up Resource health for this resource. Resource health watches your Azure resources to provide details about ongoing and past events that affected them |
| Unavailable | Your virtual machine is unavailable. We're working to automatically recover your virtual machine and to determine the source of the problem. No further action is required from you at this time |
| Degraded | Your virtual machine is degraded. We're working to automatically recover your virtual machine and to determine the source of the problem. No further action is required from you at this time |
| Host server hardware failure | A fatal {HardwareCategory} failure on the host server affected this virtual machine. Azure redeploys your virtual machine to a healthy host server |
| Migration scheduled due to degraded hardware | Azure identified that the host server has a degraded {0} that is predicted to fail soon. If feasible, we Live Migrate your virtual machine as soon as possible, or otherwise redeploy it after {1} UTC time. To minimize risk to your service, and in case the hardware fails before the system initiated migration occurs, we recommend you self-redeploy your virtual machine as soon as possible |
| Available and maybe impacted | Your virtual machine is running, however an ongoing Azure service outage may prevent you from connecting to it. Connectivity restores once the outage is resolved |
| Unavailable and maybe impacted | An Azure service outage possibly affected the health of this virtual machine. Your virtual machine recovers automatically when the outage is resolved |
| Unknown and maybe impacted | We're currently unable to determine the health of this virtual machine. An ongoing Azure service outage possibly affects this virtual machine. This virtual machine recovers automatically when the outage is resolved |
| Hardware resources allocated | Hardware resources are assigned to the virtual machine. Expect the virtual machine to be online shortly |
| Stopping and deallocating | This virtual machine is stopping and deallocating as requested by an authorized user or process |
| Configuration being updated | The configuration of this virtual machine is being updated as requested by an authorized user or process |
| Rebooted by user | This virtual machine is rebooting as requested by an authorized user or process. It will be back online after the reboot completes |
| Redeploying to different host | This virtual machine is being redeployed to a different host as requested by an authorized user or process. It will be back online after the redeployment completes |
| Stopped by user | This virtual machine is stopping as requested by an authorized user or a process |
| Stopped by user or process | This virtual machine is stopping as requested by an authorized user or by a process running inside the virtual machine |
| Started by user | This virtual machine is starting as requested by an authorized user or process. Expect the virtual machine to be online shortly |
| Maintenance redeploy to different host | This virtual machine is being redeployed to a different host server as part of a planned maintenance activity. It will be back online after the redeployment completes |
| Reboot initiated from inside the machine | A reboot was triggered from inside the virtual machine. This event could be due to a virtual machine operating system failure or as requested by an authorized user or process. The virtual machine will be back online after the reboot completes |
| Resized by user | This virtual machine is being resized as requested by an authorized user or process. It will be back online after the resizing completes |
| Machine crashed | A reboot was triggered from inside the virtual machine. This event could be due to a virtual machine operating system failure or as requested by an authorized user or process. The virtual machine will be back online after the reboot completes |
| Maintenance rebooting for host update | Maintenance updates are being applied to the host server running this virtual machine. No further action is required from you at this time. It will be back online after the maintenance completes |
| Maintenance redeploy to new hardware | This virtual machine is unavailable because it's being redeployed to newer hardware as part of a planned maintenance event. No further action is required from you at this time. It will be back online after the planned maintenance completes |
| Low priority machine preempted | This virtual machine was preempted. This low-priority virtual machine is being stopped and deallocated |
| Host server reboot | We're sorry, your virtual machine isn't available because of an unexpected host server reboot. The host server is currently rebooting. The virtual machine will be back online after the reboot completes. No further action is required from you at this time |
| Redeploying due to host failure | We're sorry, your virtual machine isn't available and it's being redeployed due to an unexpected failure on the host server. Azure began the autorecovery process and is currently starting the virtual machine on a different host. No further action is required from you at this time |
| Unexpected host failure | We're sorry, your virtual machine isn't available because an unexpected failure on the host server. Azure began the autorecovery process and is currently rebooting the host server. No further action is required from you at this time. The virtual machine will be back online after the reboot completes |
| Redeploying due to unplanned host maintenance | We're sorry, your virtual machine isn't available and it's being redeployed due to an unexpected failure on the host server. Azure began the autorecovery process and is currently starting the virtual machine on a different host server. No further action is required from you at this time |
| Provisioning failure | We're sorry, your virtual machine isn't available due to unexpected provisioning problems. The provisioning of your virtual machine failed due to an unexpected error |
| Live Migration | This virtual machine is paused because of a memory-preserving Live Migration operation. The virtual machine typically resumes within 10 seconds. No further action is required from you at this time |
| Live Migration | This virtual machine is paused because of a memory-preserving Live Migration operation. The virtual machine typically resumes within 10 seconds. No further action is required from you at this time | 
| Remote disk disconnected | We're sorry, your virtual machine is unavailable because of connectivity loss to the remote disk. We're working to reestablish disk connectivity. No further action is required from you at this time |
| Azure service issue | An Azure service issue affects your virtual machine |
| Network issue | A top-of-rack network device affected this virtual machine |
| Unavailable | Your virtual machine is unavailable. We're currently unable to determine the reason for this downtime |
| Host server reboot | We're sorry, your virtual machine isn't available because of an unexpected host server reboot. An unexpected problem with the host server is preventing us from automatically recovering your virtual machine |
| Redeploying due to host failure | We're sorry, your virtual machine isn't available because an unexpected failure on the host server. An unexpected problem with the host is preventing us from automatically recovering your virtual machine |
| Unexpected host failure | We're sorry, your virtual machine isn't available because an unexpected failure on the host server. An unexpected problem with the host is preventing us from automatically recovering your virtual machine |
| Redeploying due to unplanned host maintenance | We're sorry, your virtual machine isn't available because an unexpected failure on the host server. An unexpected problem with the host is preventing us from automatically recovering your virtual machine |
| Provisioning failure | We're sorry, your virtual machine isn't available due to unexpected provisioning problems. The provisioning of your virtual machine failed due to an unexpected error |
| Remote disk disconnected | We're sorry, your virtual machine is unavailable because of connectivity loss to the remote disk. An unexpected problem is preventing us from automatically recovering your virtual machine |
| Reboot due to Guest OS update | The Azure platform initiated a reboot to apply a new Guest OS update. The virtual machine will be back online after the reboot completes |