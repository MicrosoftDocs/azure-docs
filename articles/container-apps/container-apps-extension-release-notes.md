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

## v1.47.62 (September 2025)

- Bumped Dapr to 1.12
- Upgraded Dapr Otel Collect image version to 0.96.0
- Bumped Keda to 2.15
- Updated EasyAuth to 1.10.1 to resolve MISE version compliance issue
- Updated Envoy version to 1.27.7
- Loosened default upstream retry circuit breaker
- Enabled proxy server authentication with namespace scope
- Added pod status change log
- Added support for incremental revision numbering
- Increased app status controller concurrent reconcile settings
- Updated file upload size limits for middleware sidecar
- Raised InitialStreamWindowSize
- Improved Envoy controller for app routes
- Upgraded sidecar image to address vulnerabilities
- Handled setting cooldownPeriod and pollingInterval to default values
- Fixed get executions API call
- Increased webhook timeout for container app to 30 seconds
- Updated filter chain server name for access forbidden listener
- Fixed app controller not watching secret changes
- Enabled job suspend/resume operations
- Fixed batchv1.joblist high memory consumption for multiple executions across jobs
- Refined event processor
- Fixed panic caused by getting job name from pod owner reference
- Set job history limit via Helm
- Made envoysc log level configurable
- Fixed log processor legacy naming when variant mode is off
- Listed configmap before starting mdsd container in k8se-log-processor pod
- Improved deactivation handling
- Created a new app in labels mode
- Ignored case for domain validation URL
- Added support for stopping all job executions
- Made sidecar resources scale with ContainerApp's resources
- Basic setup for labels mode
- Added ForwarderTimeoutSeconds for EasyAuth container
- Supported HTTP/2 for EasyAuth
- Fixed scaled job execution
- Fixed schema and lease lock issue
- Fixed job stop sidecar issue
- Upgraded Kubernetes packages
- Allowed TargetPort = 0 and remapped to discovered port
- Fixed logic for reconciling Envoy exposed ports during app changes
- Fixed list revision limit continue issue
- Disabled auto_sni for clusters
- Merged labels during revision update
- Explicitly disabled http2logging
- Ensured exec is not attempted for stopped containers
- Fixed reconciler cache issue and unified apiReader
- Fixed client certificate mode not working on label URL
- Dynamically scaled out Envoy resources and replicas based on customer core usage
- Fixed local proxy failing to connect to controller
- Fixed revision activation bug when no active revisions
- Extended CA valid period to 5 years and added flag to rotate CA
- Fixed job pod failed to exit
- Added detailed execution status for list job execution API
- Moved triggerAuth to revision level
- Removed envoysc in job if not enabled
- Updated cookie header attributes to use SameSite=None
- Enabled storage secret compatibility for Azure File on Arc
- Redacted sig in internalLog in EventsProcessorEvents
- Fixed Kind not set issue
- Enabled ACA on Arc billing meters
- Supported dynamic concurrency for workflow trigger
- Added RabbitMQ Keda translation
- Fixed issues for OpenShift cluster

## v1.50.1 (December 2025)

- Updated base image to Azure Linux 3.0.
- Upgraded EasyAuth to version 1.12.0.
- Upgraded Dapr to 1.13.6-msft.6.
- Updated KEDA to 2.17.2-msft.1.
- Enhanced system sidecar and updated k8s.io/kubernetes to address security vulnerabilities.
- Upgraded Geneva MDM and MDSD image versions.
- Increased memory limits for the KEDA operator.
- Increased Envoy resources limits.
- Updated Auth container resource limits.
- Set `maxInactiveRevisionsDefault` to 200.
- Adopted KEDA-specific annotation for pausing event-triggered jobs.
- Fixed `useMonitor` logic in Timer trigger KEDA SyncTrigger.
- Added readiness and liveness probe configurations for the Dapr injector.
- Implemented logic to restart the event processor if no event has been updated in the last 5 minutes.
- Enhanced Envoy controller for app routes.
- Added validation for SMB changes.
- Enabled named job execution.
- Enabled IP restrictions for HTTP routes.
- Added `containerName` for CPU/memory autoscaling.
- Increased localproxy sidecar readiness probe failure threshold.
- Improved lifecycle and history management for labels mode.
- Prevented creation of new revisions or replicasets when only the `TargetLabel` changes.
