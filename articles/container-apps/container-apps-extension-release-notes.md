---
title: Azure Container Apps extension Release notes
description: Find information on updates made during each Azure Container Apps extension release.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/01/2025
ms.author: cshoe
ms.custom:
  - build-2025
---

# Azure Container Apps extension release notes

## v1.0.46 (December 2022)

- Initial public preview release of Container apps extension

## v1.0.47 (January 2023)

- Upgrade of Envoy to 1.0.24

## v1.0.48 (February 2023)

- Add probes to EasyAuth containers
- Increased memory limit for dapr-operator
- Added prevention of platform header overwriting

## v1.0.49 (February 2023)

- Upgrade of KEDA to 2.9.1 and Dapr to 1.9.5
- Increase Envoy Controller resource limits to 200 m CPU
- Increase Container App Controller resource limits to 1-GB memory
- Reduce EasyAuth sidecar resource limits to 50 m CPU
- Resolve KEDA error logging for missing metric values

## v1.0.50 (March 2023)

- Updated logging images in sync with Public Cloud

## v1.5.1 (April 2023)

- New versioning number format
- Upgrade of Dapr to 1.10.4
- Maintain scale of Envoy after deployments of new revisions
- Change to when default startup probes are added to a container, if developer doesn't define both startup and readiness probes, then default startup probes are added
- Adds CONTAINER_APP_REPLICA_NAME environment variable to custom containers
- Improvement in performance when multiple revisions are stopped

## v1.12.8 (June 2023)

- Update OSS Fluent Bit to 2.1.2 and Dapr to 1.10.6
- Support for container registries exposed on custom port
- Enable activate/deactivate revision when a container app is stopped
- Fix Revisions List not returning init containers
- Default "allow headers" added for cors policy

## v1.12.9 (July 2023)

- Minor updates to EasyAuth sidecar containers
- Update of Extension Monitoring Agents

## v1.17.8 (August 2023)

- Update EasyAuth to 1.6.16, Dapr to 1.10.8, and Envoy to 1.25.6
- Add volume mount support for Azure Container App jobs
- Added IP Restrictions for applications with TCP Ingress type
- Added support for Container Apps with multiple exposed ports

## v1.23.5 (December 2023)

- Update Envoy to 1.27.2, KEDA to v2.10.0, EasyAuth to 1.6.20, and Dapr to 1.11
- Set Envoy to max TLS 1.3
- Fix to resolve crashes in Log Processor pods
- Fix to image pull secret retrieval issues
- Update placement of Envoy to distribute across available nodes where possible
- When container apps fail to provision as a result of revision conflicts, set the provisioning state to failed

## v1.30.6 (January 2024)

- Update KEDA to v2.12, Envoy SC image to v1.0.4, and Dapr image to v1.11.6
- Added default response time-out for Envoy routes to 1,800 seconds
- Changed Fluent bit default log level to warn
- Delay deletion of job pods to ensure log emission
- Fixed issue for job pod deletion for failed job executions
- Ensure jobs in a suspended state deletes failed pods
- Update to not resolve HTTPOptions for TCP applications
- Allow applications to listen on HTTP or HTTPS
- Add ability to suspend jobs
- Fixed issue where KEDA scaler was failing to create job after stopped job execution
- Add startingDeadlineSeconds to Container App Job if there's a cluster reboot
- Removed heavy logging in Envoy access log server
- Updated Monitoring Configuration version for Azure Container Apps on Azure Arc enabled Kubernetes

## v1.36.15 (April 2024)

- Update Dapr to v1.12 and Dapr Metrics to v0.6
- Allow customers to enabled Azure SDK debug logging in Dapr
- Scale Envoy in response to memory usage
- Change of Envoy log format to JSON
- Export additional Envoy metrics
- Export more Envoy metrics
- Truncate Envoy log to first 1,024 characters when log content failed to parse
- Handle SIGTERM gracefully in local proxy
- Allow ability to use different namespaces with KEDA
- Validation added for scale rule name
- Enabled revision GC by default
- Enabled emission of metrics for sidecars
- Added volumeMounts to job executions
- Added validation to webhook endpoints for jobs

## v1.37.1 (July 2024)

- Update EasyAuth to support MISE

## v1.37.2 (September 2024)

- Updated Dapr-Metrics image to v0.6.8 to resolve network time out issue
- Resolved issue in Log Processor which prevented MDSD container from starting when cluster is connected behind a Proxy

## v1.37.7 (October 2024)

- Resolved issue with MDM Init container which caused container to crash in event it couldn't be pulled
- Added support for [Logic Apps Hybrid Deployment Model (Public Preview)](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/announcement-introducing-the-logic-apps-hybrid-deployment-model/ba-p/4271568)

## v1.37.8 (March 2025)

- Resolved issue with SMB storage's read-only attribute which wasn't setting correctly
- Resolved issue with cleanup hook
- Added support for health probes for Logic Apps
- Added support for JWT authentication for sync trigger
- Added User Event for when system namespace is the same as the app namespace
