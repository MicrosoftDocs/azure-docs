---
title: Relocate Azure Container Apps to another region
description: Learn how to relocate an Azure Container Apps workload to a different Azure region by redeploying the managed environment and container apps.
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 04/17/2026
author: craigshoemaker
ms.author: cshoe
---

# Relocate Azure Container Apps to another region

This article describes how to relocate an Azure Container Apps workload to another Azure region by recreating the managed environment and container apps in the target region. The process covers exporting application configuration, redeploying resources, validating the deployment, and cleaning up resources in the source region.

> [!IMPORTANT]
> Azure Container Apps doesn't support in-place region migration. You **recreate** resources in the target region - existing resources aren't moved. This article covers relocating Container Apps configuration and infrastructure. It doesn't cover replicating application data, databases, or other stateful dependencies.

## Prerequisites

Before you begin, verify that you meet the following requirements:

- Azure Container Apps is [available in the target region](/azure/reliability/availability-zones-service-support).
- The target region supports the same Container Apps features, workload profiles, and networking options you use in the source region.
- You have sufficient quota in the target region for the resources you plan to deploy.
- You have the following permissions in both the source and target subscriptions:
  - **Owner** or **Contributor** on the resource group.
  - **Azure Container Apps Contributor** (recommended).
- Your container images are in a registry accessible from the target region (for example, Azure Container Registry or a supported external registry).
- Dependent Azure resource such as Key Vault, storage accounts, databases, virtual networks, and messaging services are either already available in the target region or have a redeployment plan.

> [!TIP]
> If you use Azure Container Registry (ACR), consider enabling [geo-replication](/azure/container-registry/container-registry-geo-replication) to make images available in the target region without redeploying the registry.
>
> ```azurecli
> az acr replication create --registry <REGISTRY_NAME> --location <TARGET_REGION>
> ```

## Understand downtime requirements

Azure Container Apps doesn't support live region migration. Downtime is primarily driven by DNS propagation and traffic routing changes during cutover. To minimize impact:

1. Deploy and validate the container app in the target region first.
1. Lower DNS TTL values in advance (for example, to 60 seconds) so routing changes propagate quickly.
1. Redirect production traffic to the new endpoint only after validation is complete.
1. Keep the source container app running until you confirm the target deployment is healthy.

## Prepare

To prepare for relocation, export the source configuration and review all region-specific settings.

### Identify dependencies

The following dependent resources must exist in the target region before cutover:

- Azure Key Vault
- Storage accounts
- Databases and messaging services (such as Azure Service Bus, Azure Cosmos DB)
- Virtual networks, subnets, and private endpoints
- Network security groups (NSGs) and user-defined routes (UDRs)
- Private DNS zones
- Log Analytics workspaces
- Dapr components and service connectors (if used)

> [!IMPORTANT]
> Secrets, certificates, custom domains, and secure configuration values **aren't preserved** in exported templates. You must recreate these resources manually in the target region from their original sources.

### Plan for managed identity changes

Managed identity handling depends on the identity type:

- **System-assigned identity**: When you recreate the container app, Azure generates a new principal ID. You must reassign all RBAC roles, Key Vault access policies, and downstream service permissions to the new identity.

- **User-assigned identity**: User-assigned managed identities are regional resources and can't be moved across regions. Create a new user-assigned identity in the target region and assign the required permissions before deployment.

### Export the source configuration

# [Azure portal](#tab/portal)

Use the Azure portal to export ARM templates for both the Container Apps managed environment and individual container apps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the Container Apps managed environment or the container app resource.
1. From the left menu, select **Automation** > **Export template**.
1. Select **Download** and extract the `.zip` file to a local folder.

The extracted files include:

| File | Description |
|------|-------------|
| `template.json` | Resource configuration definition |
| Parameter files | Deployment parameter values |
| Deployment scripts | Scripts for template execution |

# [Azure CLI](#tab/cli)

Use the Azure CLI to export the managed environment and container app configurations.

Export the managed environment:

```azurecli
az containerapp env show \
  --name <ENVIRONMENT_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --output json > managed-environment.json
```

Export the container app:

```azurecli
az containerapp show \
  --name <APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --output json > container-app.json
```

---

> [!NOTE]
> Exported templates serve as a starting point for understanding your configuration. They might include read-only properties that you need to remove, and they **don't include secrets** or certificate values. Review the exported output carefully before using it for redeployment.

### Modify the managed environment template

Before redeploying the managed environment, update the exported configuration:

- **Update the location**: Set the `location` property to the target Azure region.
- **Validate resource names**: Ensure that the managed environment name is unique within the target resource group and region.
- **Review Log Analytics configuration**: Update the Log Analytics workspace reference if the workspace is region-specific. You might need to create a new workspace in the target region.
- **Remove read-only properties**: If you exported from the portal, remove properties like `id`, `type`, `systemData`, and other read-only fields that cause deployment failures.

### Modify the container app template

After exporting the container app configuration, make the following changes:

- **Update the managed environment reference**: Replace `managedEnvironmentId` with the resource ID of the new managed environment in the target region. Managed environments are region-bound and can't be reused across regions.

- **Verify container image references**: Confirm that image references point to a container registry accessible from the target region. If you enabled ACR geo-replication, the existing references might work without changes.

- **Review ingress configuration**: After redeployment, the application fully qualified domain name (FQDN) changes. Plan to update custom DNS records and traffic routing during cutover.

- **Reconfigure secrets and app settings**: Recreate secrets by using Azure Key Vault references or application configuration. Don't rely on exported values for sensitive settings.

- **Update Dapr components**: If you use Dapr, verify that Dapr component configurations reference resources available in the target region (for example, state stores, pub/sub brokers, secret stores).

- **Update service connectors**: If you use service connectors, recreate them to point to the target-region instances of dependent services.

- **Update diagnostics and monitoring**: Verify Log Analytics workspace references and reconfigure diagnostic settings as needed.

## Redeploy

Azure Container Apps managed environments are region-bound. Create the managed environment in the target region before you redeploy any container apps.

### Deploy the managed environment

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the target resource group.
1. Select **Deploy a custom template**.
1. Choose **Build your own template in the editor** and upload the modified ARM template.
1. Review the deployment settings, and then select **Review + create** to start the deployment.

# [Azure CLI](#tab/cli)

```azurecli
az containerapp env create \
  --name <ENVIRONMENT_NAME> \
  --resource-group <TARGET_RESOURCE_GROUP> \
  --location <TARGET_REGION> \
  --logs-workspace-id <LOG_ANALYTICS_WORKSPACE_ID> \
  --logs-workspace-key <LOG_ANALYTICS_WORKSPACE_KEY>
```

If you use a custom virtual network:

```azurecli
az containerapp env create \
  --name <ENVIRONMENT_NAME> \
  --resource-group <TARGET_RESOURCE_GROUP> \
  --location <TARGET_REGION> \
  --infrastructure-subnet-resource-id <SUBNET_ID> \
  --internal-only true \
  --logs-workspace-id <LOG_ANALYTICS_WORKSPACE_ID> \
  --logs-workspace-key <LOG_ANALYTICS_WORKSPACE_KEY>
```

---

### Validate container registry access

Before deploying the container app, confirm that the identity used by the container app (system-assigned or user-assigned managed identity) has the **AcrPull** role assigned on the target Azure Container Registry.

```azurecli
az role assignment create \
  --assignee <IDENTITY_PRINCIPAL_ID> \
  --role AcrPull \
  --scope <ACR_RESOURCE_ID>
```

> [!NOTE]
> If the container app references an ACR in a different subscription or region, verify that the required permissions are configured in advance to prevent image pull failures during deployment.

### Deploy the container app

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the target resource group.
1. Select **Deploy a custom template**.
1. Upload the modified ARM template for the container app.
1. Review settings and complete the deployment.

# [Azure CLI](#tab/cli)

```azurecli
az containerapp create \
  --name <APP_NAME> \
  --resource-group <TARGET_RESOURCE_GROUP> \
  --environment <ENVIRONMENT_NAME> \
  --image <IMAGE_REFERENCE> \
  --target-port <PORT> \
  --ingress external \
  --registry-server <ACR_LOGIN_SERVER> \
  --registry-identity <IDENTITY_RESOURCE_ID>
```

For a full configuration redeployment from an exported template:

```azurecli
az deployment group create \
  --resource-group <TARGET_RESOURCE_GROUP> \
  --template-file container-app-template.json \
  --parameters container-app-parameters.json
```

---

### Configure networking

After deployment, reconfigure networking to match the source configuration:

1. **Configure ingress**: Set up public or private ingress based on your application's exposure model.

1. **Reapply VNet integration**: If the container app uses private networking, configure the VNet, subnets, private endpoints, and private DNS zones in the target region.

1. **Update NSGs and UDRs**: Recreate network security groups and user-defined routes as needed.

1. **Update IP allow lists**: If downstream services use IP-based allow lists, update them with the new outbound IP addresses from the target-region environment.

1. **Configure custom domains and certificates**: Custom domains and TLS certificates aren't transferred during relocation. Reconfigure them on the new container app and update DNS records.

### Cut over traffic

After validation, redirect traffic to the target-region deployment:

1. If you lowered DNS TTL earlier, update DNS records to point to the new container app FQDN.

1. If you use **Azure Front Door** or **Azure Traffic Manager**, update the backend pool or endpoint to include the target-region container app and remove the source-region endpoint.

1. Monitor traffic to confirm requests are reaching the new deployment.

> [!TIP]
> Keep the source container app running during the rollback window. If issues arise, revert DNS or traffic routing to the source endpoint until you resolve the problem.

## Verify

After traffic cutover, validate the following items:

- Application availability and response times.
- Scaling behavior under expected and peak load.
- Connectivity to dependent services such as databases, Key Vault, storage, and messaging.
- Managed identity access to downstream resources.
- Dapr component and service connector functionality, if used.
- Logs and metrics flowing to Azure Monitor and Log Analytics.

Verify by using the CLI:

```azurecli
# Confirm the container app is running
az containerapp show \
  --name <APP_NAME> \
  --resource-group <TARGET_RESOURCE_GROUP> \
  --query "{status:properties.runningStatus, fqdn:properties.configuration.ingress.fqdn}" \
  --output table

# Test the application endpoint
curl -s -o /dev/null -w "%{http_code}" https://<APP_FQDN>/health
```

> [!IMPORTANT]
> Keep the source container app running until validation is complete and the target deployment is confirmed healthy. Define a rollback window, such as 24 to 48 hours, before cleaning up source resources.

## Clean up source resources

After successful validation and traffic cutover:

1. Delete the source container app.
1. Delete the source managed environment if you no longer need it.
1. Remove unused container images, networking resources, and identity assignments to avoid unnecessary charges.
1. Update any monitoring dashboards or alert rules that referenced the source resources.

## Limitations

- Azure Container Apps doesn't support in-place or live region relocation.
- You must recreate secrets, certificates, and custom domains.
- The revision history isn't retained in the target deployment.
- Downtime is required during cutover.
- System-assigned managed identity principal IDs change, so you must recreate all RBAC assignments.
- User-assigned managed identities are regional and must be recreated in the target region.
- Outbound IP addresses change, which might affect downstream service allow lists.

## Related content

- [Automate deployments using Bicep or ARM templates](/azure/container-apps/azure-resource-manager-api-spec)
- [Azure Container Apps networking overview](/azure/container-apps/networking)
- [Configure custom domains and certificates](/azure/container-apps/custom-domains-managed-certificates)
- [Azure Container Apps scaling and performance](/azure/container-apps/scale-app)
- [Managed identity in Azure Container Apps](/azure/container-apps/managed-identity)
