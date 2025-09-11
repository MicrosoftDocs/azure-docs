---
title: Create Azure resources from the service catalog in an AVE workload
description: Create Azure resources from the service catalog in an AVE workload.
author: aserfass-msft
ms.author: aserfass
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Tutorial 4: Create Azure resources from the service catalog in an AVE workload

The service catalog enables you to deploy Azure services and streaming applications into AVE quickly while being compliant with Policy Guardrails and enclave isolation requirements.

In this tutorial, part four of eight, you create Azure resources using service catalog in workloads. You learn how to:

- ✅ Deploy a service catalog template for an Azure resource into an existing workload from the Portal

> [!NOTE] 
> 
> The sample deployment is just for demonstration purposes and doesn't represent all the best practices for network, systems, or applications administration.

## Before you begin

- This tutorial assumes a basic understanding of networking and Azure Virtual Enclaves concepts. For more information, see [Best practices of Azure Virtual Enclaves](./best-practices.md).
- You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/).
- You need a [community](./what-community.md), [enclave](./what-enclave.md), [workload](./what-workload.md), and at least one [workload resource group](./what-workload.md#workload-resource-group) and permissions to create resources inside the workload resource group.
- Complete the [prerequisites](./deploy-app-service-web-app-service-catalog.md#prerequisites) for an App Service Web App. Including subnet delegation for the

![Screenshot showing the subnet delegation prerequisite step.](./media/tutorial-step-four-service-catalog-app-service-subnet-delegate.png)

## Enable enclave maintenance mode

1. Navigate to the `Enclave-WebApp` enclave and select `Maintenance Mode`

2. Enter the information needed to enable maintenance mode
   - **Maintenance Mode:** Select `Advanced`
   - **Principals:** Select `Choose Microsoft Entra principal` and enter your username
   - **Justification:** Select `Networking`
   - Select `Save`

![Screenshot showing the maintenance mode screen.](./media/service-catalog-app-service-maintenance-mode-input.png)

3. Select `Confirm` and allow a few minutes for the enclave to return to `Succeeded` state

![Screenshow showing the popup confirmation box for maintenance mode confirmation.](./media/service-catalog-app-service-maintenance-mode-confirm.png)

## Create Azure web app resources from the service catalog

1. Navigate to the `wl-webapp-frontend` workload to create an Azure App Service for your webapp.
2. Select `Add an Azure service` button on the overview page.
3. Select `App Service` from the service catalog dropdown list and select `Next`.
4. Enter all the required parameters on each tab.
   - **Web App Site Name:** Enter `webapp-frontend`
   - **App Service Sku Name:** Select an option from the dropdown, `P1v2`, or the lowest option for this tutorial. See this table for a full list of options: https://azure.microsoft.com/pricing/details/app-service/linux/#pricing
   - **App Service Sku Tier:** Enter `PremiumV2`.
   - **Number of Worker Instances:** Enter `2`.

![Screenshot showing the basics input screen for an App Service web app.](./media/service-catalog-app-service-basics.png)

5. Select `Next` to confirm the networking information prepopulated by the service catalog. Ensure the App Service subnet has a delegation to 'Microsoft.Web/serverfarms' and the private link subnet doesn't.
   - **Dedicated App Service Subnet Name:** Enter `WorkloadSubnet` for the subnet delegated in the previous step.
   - **Private Link Subnet Name:** Enter `mySubnet` for the subnet containing the private endpoints.

![Screenshot showing the networking input screen for an App Service web app.](./media/service-catalog-app-service-networking.png)

6. Select `Review + Create` and then `Create`.

It can take up to 30 minutes to finish all resource creation. Wait for the deployment to complete successfully before you take any actions within your deployed resources.

![Screenshot showing the deployed App Service resources.](./media/service-catalog-app-service-deployed.png)

## Validate the deployment

Go to the specified resource group to confirm the intended resources were created.

## Deploy Web App Quickstart (Optional)
Azure App Service has quickstarts for many languages such as the [python quickstart](/azure/app-service/quickstart-python.md?tabs=flask%2Cwindows%2Cazure-cli%2Cazure-cli-deploy%2Cdeploy-instructions-azportal%2Cterminal-bash%2Cdeploy-instructions-zip-azcli) or [deploy from a zip file](/azure/app-service/deploy-zip)

## Clean up resources

If you don't plan on keeping these resources, clean up unnecessary resources to avoid Azure charges. If no other deployments exist in the resource group, the whole resource group can be deleted or all App Service resources can be selected and deleted.

## Next steps

In this tutorial, you created Azure resources with service catalog using Azure portal.

In the [next tutorial](./5-create-enclave-endpoint-connections.md), you'll learn how to create Azure resources in your enclave.

## Recommendations

- Review an architecture example for a [basic web application](/azure/architecture/web-apps/app-service/architectures/basic-web-app)
- [Add tags](/azure/azure-resource-manager/management/tag-resources) to service catalog deployments to track important information for that resource such as:
  - Owner: `main POC`
  - Deployer: `yourName`
  - Purpose: `publish abc app to users`
  - Service Catalog Name: `RemoteApp`
  - Service Catalog Version: `version you deployed`
- Consider adding an [Azure Policy to enforce and inherit tags](/azure/azure-resource-manager/management/tag-policies)
