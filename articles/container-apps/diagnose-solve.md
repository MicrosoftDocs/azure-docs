---
title: Diagnose and solve problems in Azure Container Apps
description: Use Diagnose and solve problems in Azure Container Apps to troubleshoot deployment, availability, networking, scaling, configuration, and environment issues.
ms.author: jefmarti
author: jefmarti
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 07/21/2026
---

# Diagnose and solve problems in Azure Container Apps

The **Diagnose and solve problems** experience in Azure Container Apps helps you investigate deployment, availability, networking, scaling, configuration, and environment issues. It analyzes platform telemetry and configuration data, then suggests likely causes and next steps.

Use this article to choose the right detector. If you already know that a deployment failed, start with [Troubleshoot common deployment failures in Azure Container Apps](troubleshoot-deployment-errors.md).

## When to use Diagnose and solve problems

Start in Diagnose and solve problems when you need portal-based guidance for a symptom, but you don't yet know the cause.

Common starting points include:

- A deployment fails.
- A revision doesn't start successfully.
- Your application is unavailable.
- Traffic doesn't reach your application.
- Scaling doesn't behave as expected.
- You suspect networking or configuration issues.
- The managed environment has infrastructure problems.

You can access detectors from both the container app resource and the Container Apps environment resource. Use app-level detectors for one app. Use environment-level detectors when an issue affects the environment or multiple apps.

## Open Diagnose and solve problems

Open Diagnose and solve problems from the resource that matches the scope of the issue.

### Open app-level detectors

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your container app.
1. In the resource menu, select **Diagnose and solve problems**.
1. Select the troubleshooting category that best matches the issue.
1. Review the detector output and recommended next steps.

### Open environment-level detectors

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Container Apps environment.
1. In the resource menu, select **Diagnose and solve problems**.
1. Select the troubleshooting category that best matches the issue.
1. Review the detector output and recommended next steps.

## App-level detectors

The following detectors are available when you open **Diagnose and solve problems** from a container app resource.

### Troubleshoot deployment and startup problems

Use the following detectors when deployments fail or containers can't start successfully.

| Detector | Description |
|-----------|-------------|
| Image Pull Failures | Identifies container image retrieval and registry authentication problems. |
| Container App Down | Investigates availability problems when a container app isn't running. |
| Container Exit Events | Shows container termination events and exit codes. |
| Health Probe Failures | Analyzes startup, readiness, and liveness probe failures. |

Common symptoms include:

- A revision stays in a failed state.
- Container images can't be pulled from a registry.
- Containers crash or restart unexpectedly.
- Health probes fail during startup.

For step-by-step deployment troubleshooting guidance, see [Troubleshoot common deployment failures in Azure Container Apps](troubleshoot-deployment-errors.md).

If you don't see one of these detectors, choose the troubleshooting category that most closely matches your symptom. For app-specific issues, start from the container app resource. For issues that affect several apps or the managed environment, start from the Container Apps environment resource.

### Troubleshoot networking and ingress problems

Use the following detectors when traffic can't reach your application or when you suspect networking configuration problems.

| Detector | Description |
|-----------|-------------|
| Networking and DNS Configuration | Reviews networking and DNS settings. |
| Ingress Port Settings Check | Validates ingress port configuration. |
| HTTP Requests | Analyzes request activity and traffic patterns. |
| SNAT Connection and Port Allocation | Identifies outbound connectivity and SNAT port allocation problems. |
| Container App Network Usage | Reviews network inbound and outbound traffic patterns. |

Common symptoms include:

- DNS resolution failures.
- Ingress connectivity problems.
- Outbound connectivity failures.
- Requests time out or return errors.
- Traffic doesn't reach the application.

### Troubleshoot scaling and performance problems

Use the following detectors when scaling doesn't behave as expected or resource utilization is a concern.

| Detector | Description |
|-----------|-------------|
| Auto Scaling Errors | Identifies scaling-related errors. |
| Replica Count | Reviews replica behavior and scaling configuration. |
| Container App CPU Usage | Reviews CPU utilization trends. |

Common symptoms include:

- Autoscaling doesn't occur as expected.
- CPU utilization is elevated.
- Replicas aren't scaling to meet demand.

### Troubleshoot configuration and revision issues

Use the following detectors when investigating revision behavior or comparing configuration changes.

| Detector | Description |
|-----------|-------------|
| Revisions | Reviews revision information and state. |
| Revisions Comparison | Compares two revisions to identify configuration differences. |

Common symptoms include:

- Application behavior changes after deployment.
- Configuration changes don't behave as expected.
- Different revisions exhibit different behavior.

### Troubleshoot environment and infrastructure issues

Use the following detectors when investigating managed environment infrastructure or capacity issues from the app level.

| Detector | Description |
|-----------|-------------|
| Container Environment Events | Reviews environment-level events that may impact your app. |
| Max Node Pool Size / vCore Events | Identifies capacity and infrastructure constraints. |
| Container App Environment Creation Error | Investigates environment creation and provisioning failures. |

Common symptoms include:

- Environment provisioning failures.
- Capacity limitations impacting your app.
- Infrastructure-level events affecting workloads.

### Review recommendations

Use the following detector to review platform recommendations and best practices.

| Detector | Description |
|-----------|-------------|
| Advisor Recommendations for Container Apps | Displays Azure Advisor recommendations for your container apps environment and workloads. |

## Environment-level detectors

The following detectors are available when you open Diagnose and solve problems from a Container Apps environment resource. Use these detectors to investigate issues that affect the managed environment or all apps running within it.

### Troubleshoot environment health and availability

Use the following detectors when the environment is unhealthy or apps across the environment are affected.

| Detector | Description |
|-----------|-------------|
| Container App Environment Down | Investigates environment-wide availability issues. |
| Container App Environment Health | Reviews overall environment health status and platform events. |
| Container Create Failures | Reviews failures during container creation across the environment. |
| Container Exit Events | Shows container termination events across the environment. |

Common symptoms include:

- Multiple apps in the environment are unavailable.
- New containers fail to create.
- Containers are terminating unexpectedly across apps.
- The environment reports an unhealthy status.

### Troubleshoot environment scaling and configuration

Use the following detectors when investigating scaling, secrets, or storage issues at the environment level.

| Detector | Description |
|-----------|-------------|
| KEDA Scaler Failures | Investigates trigger and scaler failures across the environment. |
| Replica Count | Reviews replica behavior and scaling patterns at the environment level. |
| Secret Errors | Detects secret resolution and secret access failures. |
| Storage Mount Failures | Identifies storage and volume mounting issues. |

Common symptoms include:

- KEDA-based scaling triggers aren't firing.
- Secrets can't be resolved during provisioning or runtime.
- Storage volumes fail to mount.
- Replica counts aren't matching expected scaling behavior.

## Best practices

Use these practices to get useful results from Diagnose and solve problems.

- Start with the category that most closely matches the symptom.
- Use app-level detectors for issues specific to one container app.
- Use environment-level detectors for issues that affect the entire environment or multiple apps.
- Review detector findings together with application logs and system logs.
- Compare working and non-working revisions when you investigate deployment changes.
- Validate recent configuration changes before you redeploy.
- Use [deployment troubleshooting guidance](troubleshoot-deployment-errors.md) for deployment-specific failures.

## Related content

- [Troubleshoot common deployment failures in Azure Container Apps](troubleshoot-deployment-errors.md)
- [Troubleshooting in Azure Container Apps](troubleshooting.md)
- [Health probes in Azure Container Apps](health-probes.md)
- [Ingress in Azure Container Apps](ingress-overview.md)
- [Monitor logs in Azure Container Apps with Log Analytics](log-monitoring.md)
