---
title: Protect your Azure VMware Solution VMs with Azure Security Center integration
description: Learn how to protect your Azure VMware Solution VMs with Azure's native security tools from a single dashboard in Azure Security Center.
ms.topic: how-to
ms.date: 11/06/2020
---

# Protect your Azure VMware Solution VMs with Azure Security Center integration

Azure native security tools provide a secure infrastructure for a hybrid environment of Azure, Azure VMware Solution, and on-premises virtual machines (VMs). This article shows you how to set up Azure tools for hybrid environment security. You'll use various tools to identify and address different types of threats.

## Azure native services

Here is a quick summary of each Azure native service:

- **Log Analytics workspace:** Log Analytics workspace is a unique environment to store log data. Each workspace has its own data repository and configuration. Data sources and solutions are configured to store their data in a specific workspace.
- **Azure Security Center:** Azure Security Center is a unified infrastructure security management system. It strengthens the security posture of the data centers and provides advanced threat protection across the hybrid workloads in the cloud or on premises.
- **Azure Sentinel:** Azure Sentinel is a cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. It provides intelligent security analytics and threat intelligence across an environment. It is a single solution for alert detection, threat visibility, proactive hunting, and threat response.

## Topology

![Azure integrated security architecture.](media/azure-security-integration/azure-integrated-security-architecture.png)

The Log Analytics agent enables collection of log data from Azure, Azure VMware Solution, and on-premises VMs. The log data is sent to Azure Monitor Logs and is stored in a Log Analytics workspace. You can deploy the Log Analytics agent using Arc enabled servers [VM extensions support](../azure-arc/servers/manage-vm-extensions.md) for new and existing VMs. 

Once the logs are collected by the Log Analytics workspace, you can configure the Log Analytics workspace with Azure Security Center. Azure Security Center will assess the vulnerability status of Azure VMware Solution VMs and raise an alert for any critical  vulnerability. For instance, it assesses missing operating system patches, security misconfigurations, and [endpoint protection](../security-center/security-center-services.md).

You can configure the Log Analytics workspace with Azure Sentinel for alert detection, threat visibility, proactive hunting, and threat response. In the preceding diagram, Azure Security Center is connected to Azure Sentinel using Azure Security Center connector. Azure Security Center will forward the environment vulnerability to Azure Sentinel to create an incident and map with other threats. You can also create the scheduled rules query to detect unwanted activity and convert it to the incidents.

## Benefits

- Azure native services can be used for hybrid environment security in Azure, Azure VMware Solution, and on-premises services.
- Using a Log Analytics workspace, you can collect the data or the logs to a single point and present the same data to different Azure native services.
- Azure Security Center provides security features like file integrity monitoring, fileless attack detection, operating system patch assessment, security misconfigurations assessment, and endpoint protection assessment.
- Azure Sentinel allows you to:
    - Collect data at cloud scale across all users, devices, applications, and infrastructure, both on premises and in multiple clouds.
    - Detect previously undetected threats.
    - Investigate threats with artificial intelligence and hunt for suspicious activities at scale.
    - Respond to incidents rapidly with built-in orchestration and automation of common tasks.

## Create a Log Analytics workspace

You will need a Log Analytics workspace to collect data from various sources. See the steps in [Create a Log Analytics workspace from the Azure portal](../azure-monitor/learn/quick-create-workspace). 

## Deploy Security Center and configure Azure VMware Solution VMs

Azure Security Center is a pre-configured tool and does not require deployment. In the Azure portal, search for **Security Center** and select it.

### Enable Azure Defender

Azure Defender extends Azure Security Center's advanced threat protection across your hybrid workloads both on premises and in the cloud. So to protect your Azure VMware Solution VMs, you will need to enable Azure Defender. 

1. In Security Center, select **Getting started**.
2. Select the **Upgrade** tab and then select your subscription or workspace. 
3. Select **Upgrade** to enable Azure Defender.

## Add Azure VMware Solution VMs to Security Center

1. In the Azure portal, search on **Azure Arc** and select it.
2. Under Resources, select **Servers** and then **+Add**.

    :::image type="content" source="media/azure-security-integration/add-server-to-azure-arc.png" alt-text="Add a server to Azure Arc.":::

3. Select **Generate script**.
 
    :::image type="content" source="media/azure-security-integration/add-server-using-script.png" alt-text="Add a server using an interactive script."::: 
 
4. On the **Prerequisites** tab, select **Next**.
5. On the **Resource details** tab, fill in the following details: 
    - Subscription
    - Resource group
    - Region 
    - Operating system
    - Proxy Server details
    
    Then select **Next:Tags**.

6. On the **Tags** tab, select **Next**.
7. On the **Download and run script** tab, select **Download**.
8. Specify your operating system and run the script on your Azure VMware Solution VM.

## View passed assessments and recommendations

1. In Azure Security Center, select **Inventory** from the left pane.
2. For Resource type, select **Servers - Azure Arc**.
 
     :::image type="content" source="media/azure-security-integration/select-resource-in-security-center.png" alt-text="Select your resource in Security Center.":::

3. Select the name of your resource. A page opens showing the security health details of your resource.

4. Under **Recommendation list**, select the **Recommendations**, **Passed assessments**, and **Unavailable assessments** tabs to view these details.

    :::image type="content" source="media/azure-security-integration/view-recommendations-assessments.png" alt-text="View security recommendations and assessments.":::

## Deploy Azure Sentinel workspace

1. In the Azure portal, search for **Azure Sentinel**, and select it.
2. On the Azure Sentinel workspaces page, select **+Add**.
3. Select the Log Analytics workspace and select **Add**.

## Enable data collector for security events on Azure VMware Solution VMs

1. On the Azure Sentinel workspaces page, select the configured workspace.

2. Under Configuration, select **Data connectors**.

3. Under the Connector Name column, select **Security Events** from the list, and then select **Open connector page**.

4. On the connector page, select the events you wish to stream and then select **Apply Changes**.

    :::image type="content" source="media/azure-security-integration/select-events-you-want-to-stream.png" alt-text="Select the security events you want to stream.":::

## Connect Azure Sentinel with Azure Security Center  

1. On the Azure Sentinel workspace page, select the configured workspace.
2. Under Configuration, select **Data connectors**.
3. Select **Azure Security Center** from the list and then select **Open connector page**.

    :::image type="content" source="media/azure-security-integration/connect-security-center-with-azure-sentinel.png" alt-text="Connect Azure Security Center with Azure Sentinel.":::

4. Select **Connect** to connect the Azure Security Center with Azure Sentinel.

5. Enable **Create incident** to generate an incident for Azure Security Center.

## Create rules to identify security threats

After connecting different sources to Azure Sentinel, you can create rules to generate alerts based on detected threats. In the following example, we'll create a rule to identify attempts to sign in to Windows server with the wrong password.

1. On the Azure Sentinel overview page, under Configurations, select **Analytics**.

2. Under Configurations, select **Analytics**.

3. Select **+Create** and on the drop-down, select **Scheduled query rule**.

4. On the **General** tab, enter the required information.

    - Name
    - Description
    - Tactics
    - Severity
    - Status

    Select **Next: Set rule logic >**.

5. On the **Set rule logic** tab, enter the required information.

    - Rule query
    
        `SecurityEvent`

        `|where Activity startswith '4625'`

        `|summarize count () by IpAddress,Computer`

        `|where count_ > 3`
        
    - Map entity
    - Query scheduling
    - Alert threshold
    - Event grouping
    - Suppression

    Select **Next**.

6. On the **Incident settings** tab, enable **Create incidents from alerts triggered by this analytics rule** and select **Next: Automated response >**.
 
    :::image type="content" source="media/azure-security-integration/create-new-analytic-rule-wizard.png" alt-text="Create a new rule in Azure Sentinel with Analytic rule wizard.":::

7. Select **Next: Review >**.

8. On the **Review and create** tab, review the information and select **Create**.

After the third attempt to sign in to Windows server with the wrong password, the created rule triggers an incident for every unsuccessful attempt.

## View generated alerts

You can view generated incidents with Azure Sentinel. This can be assigned to a team to check the latest comments and close the incident.

1. Go to the Azure Sentinel overview page.
2. Under Threat Management, select **Incidents**.
3. Select an incident.

    :::image type="content" source="media/azure-security-integration/select-threat-incident.png" alt-text="Select a security threat incident in Azure Sentinel.":::

4. You can assign the ticket to a team.

    :::image type="content" source="media/azure-security-integration/assign-incident.png" alt-text="Assign an incident for resolution.":::

5. After resolving the issue, you can also close the incident in Azure Sentinel.

## Hunt security threats with queries

You can create queries or use the available pre-defined query in Azure Sentinel to identify threats in your environment. The following steps run a pre-defined query.

1. Go to the Azure Sentinel overview page.
2. Under Threat management, select **Hunting**. A list of pre-defined queries is displayed.
3. Select a query and then select **Run Query**.
4. Select **View Results** to check the results.

### Create a new query

1.  Under Threat management, select **Hunting** and then **+New Query**.

    :::image type="content" source="media/azure-security-integration/create-new-query.png" alt-text="Create new hunting query in Azure Sentinel.":::

2. Fill in the following information to create a custom query.

    - Name
    - Description
    - Custom query
    - Enter Mapping
    - Tactics
    
3. Select **Create**.
4. Select the created query.
5. Select **Run Query**.
6. Select **View Results**.

## Next steps

- Learn to use the [Azure Defender dashboard](../security-center/azure-defender-dashboard.md).
- Explore the full range of protection offered by [Azure Defender](../security-center/azure-defender.md).
- Learn about [Advanced multistage attack detection in Azure Sentinel](../azure-monitor/learn/quick-create-workspace.md).
