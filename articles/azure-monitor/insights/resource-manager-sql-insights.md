---
title: Resource Manager template samples for SQL Insights (preview)
description: Sample Azure Resource Manager templates to deploy and configure SQL Insights (preview).
ms.topic: sample
ms.custom: devx-track-arm-template
author: bwren
ms.author: bwren
ms.date: 08/09/2023
---

# Resource Manager template samples for SQL Insights (preview)
This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to enable SQL Insights (preview) for monitoring SQL running in Azure.  See the [SQL Insights (preview) documentation](/azure/azure-sql/database/sql-insights-overview) for details on the offering and versions of SQL we support. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]


## Create a SQL Insights (preview) monitoring profile
The following sample creates a SQL Insights monitoring profile, which includes the SQL monitoring data to collect, frequency of data collection, and specifies the workspace the data will be sent to.


### Template file

View the [template file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Create%20new%20profile/CreateNewProfile.armtemplate).

### Parameter file

View the [parameter file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Create%20new%20profile/CreateNewProfile.parameters.json).


## Add a monitoring VM to a SQL Insights monitoring profile
Once you have created a monitoring profile, you need to allocate Azure virtual machines that will be configured to remotely collect data from the SQL resources you specify in the configuration for that VM.  Refer to the SQL Insights enable documentation for more details.

The following sample configures a monitoring VM to collect the data from the specified SQL resources.


### Template file

View the [template file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Add%20monitoring%20virtual%20machine/AddMonitoringVirtualMachine.armtemplate).

### Parameter file

View the [parameter file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/SQL/Add%20monitoring%20virtual%20machine/AddMonitoringVirtualMachine.parameters.json).


## Create an alert rule for SQL Insights
The following sample creates an alert rule that will cover the SQL resources within the scope of the specified monitoring profile.  This alert rule will appear in the SQL Insights UI in the alerts UI context panel.  

The parameter file has values from one of the alert templates we provide in SQL Insights, you can modify it to alert on other data we collect for SQL.  The template does not specify an action group for the alert rule.


### Template file

View the [template file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/Alerts/log-metric-noag.armtemplate).

### Parameter file

View the [parameter file on git hub](https://github.com/microsoft/Application-Insights-Workbooks/blob/master/Workbooks/Workloads/Alerts/sql-cpu-utilization-percent.parameters.json).





## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about SQL Insights (preview)](/azure/azure-sql/database/sql-insights-overview).
