---
title: "Deployment step 2: base services - monitoring component"
description: Learn about the configuration of monitoring during migration deployment step two.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 2: base services - monitoring component

Monitoring is a crucial aspect of managing an HPC environment in the cloud, ensuring optimal performance, reliability, and security. Effective monitoring allows administrators to gain real-time insights into system performance, detect and address issues promptly, and make informed decisions to optimize resource utilization. Key metrics such as CPU and memory usage, job execution times, and network throughput provide valuable information about the health and efficiency of the infrastructure.

By using tools like Azure Monitor, Azure Managed Grafana, and Azure Managed Prometheus administrators can visualize these metrics, set up alerts for critical events, and analyze logs for troubleshooting. Implementing robust monitoring practices helps maintain high availability, enhances user satisfaction, and ensures that the cloud environment meets the dynamic needs of HPC workloads.

When migrating HPC workloads to Azure, it's important to replicate and enhance the monitoring capabilities you had on-premises. This process includes tracking the same metrics and possibly adding new ones that are relevant to the cloud environment. Using Azure-specific monitoring tools can provide deeper insights into cloud resources, which are crucial for managing and optimizing cloud infrastructure effectively. For example, in a cloud environment, a valuable new metric to track is cost, which isn't typically monitored in on-premises setups.

## Define monitoring key metric needs

* **Common HPC metrics:**
  - **Infrastructure metrics:** CPU, memory usage, disk I/O, network throughput.
  - **Application metrics:** Job queue lengths, job failure rates, execution times.
  - **User metrics:** Active users, job submission rates.

* **Cloud-specific HPC metrics:**
  - **Cost metrics:** Cost Per Resource, Monthly Cost, Budget Alerts.
  - **Scalability metrics:** Autoscaling Events, resource utilization.
  - **Provisioning metrics:** Provisioning time, provisioning success rate.

## Tools and services

* **Azure Monitor:**
  - Configure Azure Monitor to collect metrics and logs from all resources.
  - Set up alerts for critical thresholds (for example, CPU usage > 80%).
  - Use Log Analytics to query and analyze logs.

* **Azure Managed Grafana:**
  - Integrate Grafana with Azure Monitor for dashboard visualizations.
  - Create custom dashboards for different personas (for example, HPC administrators, business managers).
  - 
* **Azure Managed Prometheus:**
  - Deploy and manage Prometheus instances in Azure.
  - Configure Prometheus to scrape metrics from your HPC nodes and applications.
  - Integrate Prometheus with Grafana for advanced dashboards.
  - 
* **Azure Moneo:**
  - Configure Moneo to collect metrics across multi-GPU systems.
  - Information regarding Moneo can be found on [GitHub](https://github.com/Azure/Moneo)

## Best practices

Implementing best practices for monitoring ensures that your HPC environment remains efficient, secure, and resilient. Here are some key best practices to follow:

* **Regularly review and update monitoring configurations:**
   - To ensure your monitoring configurations remain aligned with your infrastructure and business needs, schedule periodic reviews of them.
   - Update thresholds and alert settings based on historical data and changing performance requirements.
  
* **Implement comprehensive logging:**
   - To aggregate and analyze log data, use centralized logging solutions like Azure Log Analytics.
   - Regularly review log data to identify patterns and potential issues before they escalate.

* **Set up redundancy and failover mechanisms:**
   - Implement redundancy for critical monitoring components to ensure continuous availability.
   - Set up failover mechanisms to automatically switch to backup systems if there's a primary system failure.

* **Automate responses to common issues:**
   - To create automated responses for common issues, use automation tools like Azure Automation and Logic Apps.
   - Develop runbooks and workflows that can automatically remediate known problems, such as restarting services or scaling resources.

* **Monitor security metrics:**
   - Include security-related metrics in your monitoring setup, such as unauthorized access attempts, configuration changes, and compliance status.
   - Set up alerts for critical security events to ensure prompt response and mitigation.

* **Setup health checks**
  - Implement automated health checks using scripts or Azure Automation.
  - Monitor health checks and trigger automated responses or alerts for issues.
  - Set up alerts in Azure Monitor to notify you when autoscaling events occur.

## Example steps for setup and deployment

This section provides a comprehensive guide for setting up Azure Monitor and configuring Grafana dashboards to effectively monitor your HPC environment. It includes detailed steps for creating an Azure Monitor workspace, linking it to resources, configuring data collection, deploying Azure Managed Grafana, and setting up alerts and automated health checks.

### Setting up Azure Monitor

1. **Navigate to Azure Monitor:**

   - Go to the [Azure portal](https://portal.azure.com).
   - In the left-hand navigation pane, select **Monitor**.

2. **Create an Azure Monitor workspace:**

   - Select on "Workspaces" under the "Monitoring" section.
   - Select "Create" to set up a new Azure Monitor workspace.
   - Provide a name, select a subscription, resource group, and location.
   - Select "Review + create" and then "Create" to deploy the workspace.

3. **Link Azure Monitor workspace to resources:**

   - Go to the resource you want to monitor (for example, a Virtual Machine).
   - Under the "Monitoring" section, select "Diagnostics settings."
   - Select "Add diagnostic setting" and configure the logs and metrics to be sent to the Azure Monitor workspace.

4. **Configure Data Collection:**

   - In the Azure Monitor section, select "Data Collection Rules" to set up and manage the rules for collecting logs and metrics from various Azure resources.

> [!NOTE]
> For detailed information about Azure Monitor, visit the [Azure Monitor Metrics Overview](/azure/azure-monitor/overview) page.

### Configuring Grafana dashboards

1. **Deploy Azure Managed Grafana:**

   - Navigate to the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=azure-managed-grafana).
   - Search for "Azure Managed Grafana" and choose **Create**.
   - Fill in the required details such as subscription, resource group, and instance details.
   - Select **Review + create** and then **Create** to deploy the Grafana instance.

2. **Connect Grafana to Azure Monitor:**

   - Once Grafana is deployed, access it through the Azure portal or directly via its public endpoint.
   - In Grafana, go to "Configuration" -> "Data Sources" -> "Add data source."
   - Select "Azure Monitor" from the list of available data sources.
   - Provide the necessary details such as subscription ID, tenant ID, and client ID, and authenticate using Azure credentials.

3. **Create custom dashboards:**

   - After the data source is added, go to "Dashboards" -> "Manage" -> "New Dashboard."
   - Use the panel editor to add visualizations (for example, graphs, charts) based on the metrics collected by Azure Monitor.
   - Customize the dashboard to display key metrics such as CPU usage, memory usage, disk I/O, network throughput, job queue lengths, and job execution times.
   - Save the dashboard and share it with relevant stakeholders.

> [!NOTE]
> For detailed information about Azure Managed Grafana, visit the [Azure Managed Grafana](/azure/managed-grafana/overview) page.

### Configuring Prometheus

**Deploy Azure Managed Prometheus:**
  - Navigate to the Azure Marketplace
  - Search for "Azure Managed Prometheus" and select "Create."
  - Fill in the required details:
    - Provide necessary information such as subscription, resource group, and instance details.
  - Review the settings and select "Create" to deploy the instance.

> [!NOTE]
> For detailed information about Azure Managed Prometheus, visit the [Azure Monitor managed service for Prometheus](/azure/azure-monitor/essentials/prometheus-metrics-overview) page.

### Integrate Prometheus with Grafana

1. **Add Prometheus as a data source in Grafana:**
   - In Grafana, go to "Configuration" -> "Data Sources" -> "Add data source."
   - Select "Prometheus" and provide the Prometheus endpoint URL.
2. **Create Custom Dashboards:**
   - Go to "Dashboards" -> "Manage" -> "New Dashboard."
   - Add visualizations based on metrics collected by Prometheus.
   - Customize and save the dashboard for key metrics display.

## Creating alerts

1. Navigate to Azure Monitor and select **Alerts**.
2. Select **New alert rule** to create a new alert.
3. Define the scope by selecting the resource you want to monitor (for example, a VM, storage account, or network interface).
4. Set conditions based on metrics or log data. For example, you might set an alert for CPU usage exceeding 80%, disk space usage above 90%, or a VM being unresponsive.

   - **Defining Action Groups:**
     - Specify actions to take when an alert is triggered, such as sending an email, triggering an Azure Function, or executing a webhook.
     - Create action groups to manage and organize these responses efficiently.

### Further steps for enhanced monitoring

1. **Set up alerts:**
   - In Azure Monitor, go to "Alerts" -> "New alert rule."
   - Define the scope by selecting the resource you want to monitor.
   - Set conditions for the alert (for example, CPU usage > 80%).
   - Configure actions such as sending email notifications or triggering an Azure Function.

2. **Implement automated health checks:**
   - Use Azure Automation to create and schedule runbooks that perform health checks on your HPC environment.
   - Ensure these runbooks check the status of critical services, resource availability, and system performance.
   - Set up alerts to notify administrators if any health checks fail or indicate issues.

3. **Regularly review and update monitoring configurations:**
   - Periodically review the metrics and alerts configured in Azure Monitor and Grafana.
   - Adjust thresholds, add new metrics, or modify visualizations based on changes in the HPC environment or business requirements.
   - Train staff on interpreting monitoring dashboards, responding to alerts, and using monitoring tools effectively.

### Example implementation

Automated health check script:

```bash
#!/bin/bash

# Check if a VM is running
vm_status=$(az vm get-instance-view --name <vm-name> --resource-group <resource-group> --query instanceView.statuses[1] --output tsv)

if [[ "$vm_status" != "PowerState/running" ]]; then
# Restart VM if not running
az vm start --name <vm-name> --resource-group <resource-group>
fi
```

## Resources

- Azure Managed Grafana documentation: [product](/azure/managed-grafana/)
- AzureHPC Node Health Check: [git](https://github.com/Azure/azurehpc-health-checks)
- Slurm Job Accounting with Azure CycleCloud: [blog](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/setting-up-slurm-job-accounting-with-azure-cyclecloud-and-azure/ba-p/4083685)
- Azure CycleCloud log files: [product](/azure/cyclecloud/log_locations?view=cyclecloud-8&preserve-view=true)
- Monitoring CycleCloud Clusters: [product](/azure/cyclecloud/how-to/monitor-clusters?view=cyclecloud-8&preserve-view=true)
Azure Moneo: [git](https://github.com/Azure/Moneo)
