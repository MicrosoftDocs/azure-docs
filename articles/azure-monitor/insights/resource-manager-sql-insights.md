---
title: Resource Manager template samples for SQL insights
description: Sample Azure Resource Manager templates to deploy and configure SQL insights.
ms.topic: sample
author: bwren
ms.author: bwren
ms.date: 03/25/2021

---

# Resource Manager template samples for SQL insights
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/template-syntax.md) to enable SQL insights for monitoring SQL running in Azure.  See the [SQL insights documentation](sql-insights-overview.md) for details on the offering and versions of SQL we support. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]


## Create a SQL insights monitoring profile
The following sample creates a SQL insights monitoring profile, which includes the SQL monitoring data to collect, frequency of data collection, and specifies the workspace the data will be sent to.


### Template file

View the [template file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Create%20new%20profile/CreateNewProfile.armtemplate).

### Parameter file

View the [parameter file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Create%20new%20profile/CreateNewProfile.parameters.json).


## Add a monitoring VM to a SQL insights monitoring profile
Once you have created a monitoring profile, you need to allocate Azure virtual machines that will be configured to remotely collect data from the SQL resources you specify in the configuration for that VM.  Refer to the SQL insights enable documentation for more details.

The following sample configures a monitoring VM to collect the data from the specified SQL resources.


### Template file

View the [template file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Add%20monitoring%20virtual%20machine/AddMonitoringVirtualMachine.armtemplate).

### Parameter file

View the [parameter file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Add%20monitoring%20virtual%20machine/AddMonitoringVirtualMachine.parameters.json).


## Create an alert rule for SQL insights
The following sample creates an alert rule that will cover the SQL resources within the scope of the specified monitoring profile.  This alert rule will appear in the SQL insights UI in the alerts UI context panel.  

The parameter file has values from one of the alert templates we provide in SQL insights, you can modify it to alert on other data we collect for SQL.  The template does not specify an action group for the alert rule.


#### Template file

View the [template file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/Alerts/log-metric-noag.armtemplate).

### Parameter file

View the [parameter file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/Alerts/sql-cpu-utilization-percent.parameters.json).





## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about SQL insights](sql-insights-overview.md).
