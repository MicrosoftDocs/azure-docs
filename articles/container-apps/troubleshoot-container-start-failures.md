---
title: Troubleshoot start failures in Azure Container Apps
description: Learn to troubleshoot start failures in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 03/24/2025
ms.author: cshoe
ms.custom:
---

# Troubleshoot start failures in Azure Container Apps

Deploying a containerized application to Azure Container Apps for the first time can sometimes result in the app failing to start. Use this guide to figure out how to diagnose and fix common issues when your container doesn't start.

## Check deployment status and revision state

Verify the status of your Container App deployment.

1. Open the Azure portal and go to your container app

1. Under *Application*, select **Revisions and replica.**

1. Find your revision in the list and look at the *Running status*.

    If you see the *Failed* or *Degraded* status, your deployment didn't succeed. To find issues with a deployment failed, you can view the application and system logs.

## View application and system logs

If the container didn’t start, logs are the best source of diagnostic information. There are two kinds of logs, system and application logs. System logs show Azure Container Apps' platform activities, where application logs show what is logged to `stdout` and `stderror`.

Start by reviewing the system logs for one of the following messages:

| Message | Meaning |
|---|---|
| Error mounting volume <VOLUME_NAME>. | The system encountered an issue while trying to to mount the volume. |
| Error provisioning revision <REVISION_NAME>. ErrorCode: [ErrImagePull] | The system failed to start the revision because of an error pulling the container image. This error could be from an inaccessible image or incorrect image reference. |
| Error provisioning revision <REVISION_NAME>. ErrorCode: [Time-out] | The a time out possibly due to prolonged startup times or issues within the container. |
| Error provisioning revision <REVISION_NAME>. ErrorCode: [ContainerCrashing] | The revision's container is repeatedly crashing. |
| Error: ingress routes not ready | The system encountered an issue where the ingress routes aren't ready, leading to a failed replica revision. |
| Deployment Progress Deadline Exceeded. 0/1 replicas ready. | The deployment exceeded the allowed time for progress, resulting in no replicas being ready. This situation often indicates issues with container startup or health checks. |
| Requests return status 403 | The container app endpoint responds to requests with HTTP error `403` (access denied), suggesting potential networking configuration issues. |
| Error: ContainerCrashed | The container crashed, possibly from application errors or misconfigurations. |
| Error fetching scaler metrics | Ensure that your application can connect to the source of your scaling signal. |

With the log clues in hand, examine the possible reasons your container fails to run:

| Possible reason| Description | Possible fix |
|---|---|---|
| Image or registry issues | If the logs indicate the image couldn’t be pulled, for example for an "Image pull failed" or authentication errors, then the container never launched. Ensure the image name and tag in your container app configuration are correct. If using a private registry or Azure Container Registry (ACR), verify that Azure Container Apps can access the registry. For ACR, you might need to enable Managed Identity authentication or provide registry credentials. | Confirm the image exists at the specified tag and is accessible. You can try a manual `docker pull <IMAGE>` from a machine to verify credentials. Alternatively, try to deploy a debug container and attempt connectivity from within. |
| Application crashes and the exit code aren't 0 | If the container exited with a nonzero exit code, then an unhandled exception or error in your application code is often the problem. Check the application logs for any exceptions or error messages right before the crash. Common causes include missing files or dependencies, runtime exceptions, or misconfigured frameworks. | Reproduce the issue locally if possible. Run the same image locally using Docker (`docker run --rm <IMAGE>`) to see if the application exits or errors out. Fix any application-level errors (for example, include all necessary dependencies in the image and handle all exceptions), then redeploy the container. |
| Startup command and entrypoint | If you overwrote the startup command or if your Dockerfile’s entrypoint isn't launching the app correctly, the container could start and then immediately exit. Azure Container Apps by default run the container with the entrypoint/CMD as defined in the image. Verify that the image’s start command actually starts the intended service. For example, for a Node.js app, ensure the Docker CMD runs your server (and not just exits). | Double-check the Dockerfile’s entrypoint/CMD. If using a custom command in Azure (via YAML or CLI), ensure it’s correct. You can update the container app’s startup command via CLI or Azure portal. In the portal, go to your container, select **Edit container**, and then edit the command and args. |
| Health probe failures | Azure Container Apps automatically adds a liveness and readiness probe if you enabled HTTP ingress and didn’t specify custom probes. A common scenario is the app is actually running, but the health check is failing, causing the platform to restart the container or mark the revision as unhealthy. For example, if your app listens on a nondefault port or takes longer to start, the default probe might fail. | Ensure the container’s target port matches the port your application listens on. If your app needs more time to initialize, configure a startup or liveness probe with a longer initial delay. In the Azure portal look under *Containers* > *Health probes*, or via CLI YAML.<br><br>If the app doesn’t serve HTTP (for example, a background worker), consider disabling ingress or using internal ingress so that no HTTP probe is enforced. Alternatively, turning off external ingress temporarily can stop the container from a container that continuously restarts. |
| Scaler signal connectivity | If you’re using a scaling rule to scale your application, ensure that your application can connect to the source for the scaling signal. This message means that any database, event hub, or other container app needs to be reachable via network and accessible for query.| Run a your container locally to verify the services are reachable in a development context first. |
| Resource constraints (memory/CPU) | The Container Apps runtime can kill container that runs out of memory or CPU resources. Check system logs for out of memory (OOM) errors or throttling. | Compare your app’s resource needs with the limits configured for the Container App. |

## Verify environment variables and configuration

Misconfigured settings are a frequent cause of startup issues, especially when moving from local development to Azure:

* **Environment variables**: Ensure all required environment variables are set in the container app configuration. A missing environment variable (for example, a database connection string or API key that your app expects) can cause the app to crash on startup.

* **Secret references**: If you configured secrets (secure values stored separately), make sure the container’s environment variable is referencing the secret correctly. The secret name in the container’s settings must match the name defined under Secrets. A secret with no corresponding reference in env vars (or vice versa) means your app might not get the value it needs.

* **Configuration files and app settings**: If your application relies on config files, ensure they're included in the image and at the correct path. Sometimes an app might start locally because of a local config file, but that file wasn’t copied into the Docker image. Rebuild the image including those resources. Also check any framework-specific settings (for example, ASP.NET Core might need `ASPNETCORE_URLS` or Django might need certain environment variables) and ensure they're set for the container.

* **Duplicate or invalid settings**: Azure Container Apps (especially when deployed via IaC templates) can fail to start if there are configuration errors such as duplicate environment variable names.  

## Check networking and ingress settings

Networking misconfigurations can prevent your container from starting or becoming reachable:

* **Ingress configuration**: If your app should be accessible externally, Ingress should be enabled and set appropriately (either External for public HTTP access or Internal for only intra-environment access). Verify the target port is correct. The target port must match the listening port of your application.  

* **VNet integration and DNS**: If your Container App environment is integrated with a virtual network, ensure it has DNS access to required endpoints. A common issue is using a custom DNS or restricted outbound access that blocks the container from pulling images or reaching external services. For instance, if using a private ACR, confirm that the environment can resolve and connect to the registry. You might need to set up your environment’s DNS settings or outbound traffic rules to allow registry and internet access. You might need to also update your DNS settings if you’re using managed identity the token endpoint `login.microsoft.com` or `<REGION>.login.microsoft.com` needs to be reachable. For more information on which hosts need to be reachable, see [Configuring UDR with Azure Firewall](/azure/container-apps/networking?tabs=workload-profiles-env%2Cazure-cli).

* **External dependencies**: If your application needs to call an external service (such as a database, API, or cache), verify network access to the resource. Check that any required service connectors or virtual network peering are correctly set up. For example, if the app is supposed to connect to an Azure Database in a virtual network, ensure the container app is in the same virtual network or has the proper firewall rules. Connection failures to external resources can sometimes cause the app to hang or throw exceptions at startup. The solution might be configuring the environment’s outbound traffic or adjusting firewall rules on the target service.

## Best practices to prevent startup issues

Once you resolve the immediate problem, consider the following practices to avoid similar deployment issues in the future:

* **Test locally with container settings**: Always test your container image locally (or in a staging environment) with the same environment variables and configuration you plan to use in production. This practice can catch issues with missing dependencies or config before deployment. If the image fails to run or exit immediately on your machine, fix that first. Ensuring the container runs as expected with Docker run helps isolate application problems from Azure configuration issues.

* **Ensure container image accessibility**: Use consistent image naming and versioning (including tags) and avoid using `latest` tag for production deployments. If using ACR, enable continuous deployment or use Azure Container Apps’ built-in registry integration to minimize authentication issues. Periodically verify that your Container App’s managed identity or credentials can pull from the registry (especially after any password or token rotations).

* **Include all required configuration**: Make sure all necessary app settings are provided with the container. This practice includes environment variables, secret values, config files, and any startup command arguments. It’s helpful to use infrastructure-as-code (Azure CLI, Bicep, or ARM templates) to deploy Container Apps so that your configuration is repeatable and less prone to manual errors (like typos or missing settings). For example, double-check that all keys in your app’s `.env` file are accounted for in the Container Apps settings.

* **Proper health probe configuration**: Configure health probes appropriate to your application’s behavior. If you know your app takes time to warm up, set a startup or readiness probe with a generous initial delay to prevent premature restarts. If your app doesn’t respond on an HTTP endpoint, disable ingress or use TCP health checks instead of HTTP. Define liveness probes to automatically recover from hung processes, but not so aggressively that they never allow the app to fully start.

* **Monitor resource usage**: Choose CPU and memory allocations that fit your app’s needs. Monitor usage (via Container Apps metrics in Azure Monitor) for spikes or steady climbs. If an app tends to experience out of memory errors or get killed, increase its memory limit or investigate memory leaks in the application. Similarly, ensure you’re not hitting CPU limits which could slow down startup.
