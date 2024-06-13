---
title: Update Microsoft Sentinel's SAP data connector agent
description: This article shows you how to update an already existing SAP data connector to its latest version.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 03/27/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
---

# Update Microsoft Sentinel's SAP data connector agent

This article shows you how to update an already existing Microsoft Sentinel for SAP data connector to its latest version.

To get the latest features, you can [enable automatic updates](#automatically-update-the-sap-data-connector-agent-preview) for the SAP data connector agent, or [manually update the agent](#manually-update-sap-data-connector-agent).

The automatic or manual updates described in this article are relevant to the SAP connector agent only, and not to the Microsoft Sentinel solution for SAP. To successfully update the solution, your agent needs to be up to date. The solution is updated separately.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

Before you start, make sure that you have all the prerequisites for deploying Microsoft Sentinel solution for SAP applications.

For more information, see [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

## Automatically update the SAP data connector agent (Preview)

You can choose to enable automatic updates for the connector agent on [all existing containers](#enable-automatic-updates-on-all-existing-containers) or a [specific container](#enable-automatic-updates-on-a-specific-container).

> [!IMPORTANT]
> Automatically updating the SAP data connector agent is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Enable automatic updates on all existing containers

To enable automatic updates on all existing containers (all containers with a connected SAP agent), run the following command on the collector machine:

```
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh 
```
    
The command creates a cron job that runs daily and checks for updates. If the job detects a new version of the agent, it updates the agent on all containers that exist when you run the command above. If a container is running a Preview version that is newer than the latest version (the version that the job installs), the job doesn't update that container. 

If you add containers after you run the cron job, the new containers aren't updated automatically. To update these containers, in the */opt/sapcon/[SID or Agent GUID]/settings.json* file, define the `auto_update` parameter for each of the containers as `true`.

The logs for this update are under *var/log/sapcon-sentinel-register-autoupdate.log/*.

### Enable automatic updates on a specific container

To enable automatic updates on a specific container or containers, run the following command:

```
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh --containername <containername> [--containername <containername>]...
```

The logs for this update are under */var/log/sapcon-sentinel-register-autoupdate.log*. 

### Disable automatic updates

To disable automatic updates for a container or containers, define the `auto_update` parameter for each of the containers as `false`.

## Manually update SAP data connector agent

To manually update the connector agent, make sure that you have the most recent versions of the relevant deployment scripts from the Microsoft Sentinel GitHub repository. 

Run:

```
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated. 

Be sure to check for any other available updates, such as:

- Relevant SAP change requests, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/CR).
- Microsoft Sentinel solution for SAP® applications security content, in the **Microsoft Sentinel solution for SAP® applications** solution.
- Relevant watchlists, in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP/Analytics/Watchlists).

## Update your system for attack disruption

Automatic attack disruption for SAP is supported with the unified security operations platform in the Microsoft Defender portal, and requires:

- A workspace [onboarded to the unified security operations platform](../microsoft-sentinel-defender-portal.md).

- A Microsoft Sentinel SAP data connector agent, version 90847355 or higher. [Check your current agent version](#verify-your-current-data-connector-agent-version) and update it if you need to. 

- The identity of your data connector agent VM assigned to the **Microsoft Sentinel Business Applications Agent Operator** Azure role. If this role isn't assigned, make sure to [assign these roles manually](#assign-required-azure-roles-manually).

- The **/MSFTSEN/SENTINEL_RESPONDER** SAP role [applied to your SAP system and assigned to the SAP user account](#apply-and-assign-the-sentinel_responder-sap-role-to-your-sap-system) used by Microsoft Sentinel's SAP data connector agent.

### Verify your current data connector agent version

To verify your current agent version, run the following query from the Microsoft Sentinel **Logs** page:

  ```Kusto
  SAP_HeartBeat_CL
  | where sap_client_category_s !contains "AH"
  | summarize arg_max(TimeGenerated, agent_ver_s), make_set(system_id_s) by agent_id_g
  | project
      TimeGenerated,
      SAP_Data_Connector_Agent_guid = agent_id_g,
      Connected_SAP_Systems_Ids = set_system_id_s,
      Current_Agent_Version = agent_ver_s
  ```
### Check for required Azure roles

Attack disruption for SAP requires that you grant your agent's VM identity with specific permissions to the Microsoft Sentinel workspace, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

First check to see if your roles are already assigned:

1. Find your VM identity object ID in Azure:

    1. Go to **Enterprise application** > **All applications**, and select your VM or registered application name, depending on the type of identity you're using to access your key vault.
    1. Copy the value of the **Object ID** field to use with your copied command.

1. Run the following command to verify whether these roles are already assigned, replacing the placeholder values as needed.

    ```bash
    az role assignment list --assignee <Object_ID> --query "[].roleDefinitionName" --scope <scope>
    ```

    The output shows a list of the roles assigned to the object ID.

### Assign required Azure roles manually

If the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles aren't yet assigned to your agent's VM identity, use the following steps to assign them manually. Select the tab for the Azure portal or the command line, depending on how your agent is deployed. Agents deployed from the command line aren't shown in the Azure portal, and you must use the command line to assign the roles.

To perform this procedure, you must be a resource group owner on your Microsoft Sentinel workspace.

#### [Azure portal](#tab/azure)

1. In Microsoft Sentinel, on the **Configuration > Data connectors** page, go to your **Microsoft Sentinel for SAP** data connector and select **Open the connector page**.

1. In the **Configuration** area, under step **1. Add an API based collector agent**, locate the agent that you're updating and select the **Show commands** button.

1. Copy the **Role assignment commands** displayed. Run them on your agent VM, replacing the `Object_ID` placeholders with your VM identity object ID.
    
    These commands assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles to your VM's managed identity, including only the scope of the specified agent's data in the workspace.

> [!IMPORTANT]
> Assigning the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles via the CLI assigns the roles only on the scope of the specified agent's data in the workspace. This is the most secure, and therefore recommended option.
>
> If you must assign the roles [via the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition), we recommend assigning the roles on a small scope, such as only on the Microsoft Sentinel workspace.

#### [Command line](#tab/cli)

1. <a name="step1"></a>Get the agent ID by running the following command, replacing the `<container_name>` placeholder with the name of your Docker container:

    ```bash
    docker inspect <container_name> | grep -oP '"SENTINEL_AGENT_GUID=\K[^"]+
    ```

    For example, an agent ID returned might be `234fba02-3b34-4c55-8c0e-e6423ceb405b`.


1. Assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles by running the following commands:

    ```bash
    az role assignment create --assignee-object-id <Object_ID> --role --assignee-principal-type ServicePrincipal "Microsoft Sentinel Business Applications Agent Operator" --scope /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/microsoft.operationalinsights/workspaces/<WS_NAME>/providers/Microsoft.SecurityInsights/BusinessApplicationAgents/<AGENT_IDENTIFIER>

    az role assignment create --assignee-object-id <Object_ID> --role --assignee-principal-type ServicePrincipal "Reader" --scope /subscriptions/<SUB_ID>/resourcegroups/<RESOURCE_GROUP_NAME>/providers/microsoft.operationalinsights/workspaces/<WS_NAME>/providers/Microsoft.SecurityInsights/BusinessApplicationAgents/<AGENT_IDENTIFIER>
    ```

    Replace placeholder values as follows:

    |Placeholder  |Value  |
    |---------|---------|
    |`<OBJ_ID>`     | Your VM identity object ID.     |
    |`<SUB_ID>`     |    Your Microsoft Sentinel workspace subscription ID     |
    |`<RESOURCE_GROUP_NAME>`     |  Your Microsoft Sentinel workspace resource group name       |
    |`<WS_NAME>`     |    Your Microsoft Sentinel workspace name     |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#step1).      |

---

### Apply and assign the SENTINEL_RESPONDER SAP role to your SAP system

Apply **/MSFTSEN/SENTINEL_RESPONDER** SAP role to your SAP system and assign it to the SAP user account used by Microsoft Sentinel's SAP data connector agent. 

To apply and assign the **/MSFTSEN/SENTINEL_RESPONDER** SAP role:
  
1. Upload role definitions from the [/MSFTSEN/SENTINEL_RESPONDER](https://aka.ms/SAP_Sentinel_Responder_Role) file in GitHub.

1. Assign the **/MSFTSEN/SENTINEL_RESPONDER** role to the SAP user account used by Microsoft Sentinel's SAP data connector agent. For more information, see [Deploy SAP Change Requests and configure authorization](preparing-sap.md).

  Alternately, manually assign the following authorizations to the current role already assigned to the SAP user account used by Microsoft Sentinel's SAP data connector. These authorizations are included in the **/MSFTSEN/SENTINEL_RESPONDER** SAP role specifically for attack disruption response actions.

  | Authorization object | Field | Value |
  | -------------------- | ----- | ----- |
  |S_RFC	|RFC_TYPE	|Function Module |
  |S_RFC	|RFC_NAME	|BAPI_USER_LOCK |
  |S_RFC	|RFC_NAME	|BAPI_USER_UNLOCK |
  |S_RFC	|RFC_NAME	|TH_DELETE_USER <br>In contrast to its name, this function doesn't delete users, but ends the active user session. |
  |S_USER_GRP	|CLASS	|* <br>We recommend replacing S_USER_GRP CLASS with the relevant classes in your organization that represent dialog users. |
  |S_USER_GRP	|ACTVT	|03 |
  |S_USER_GRP	|ACTVT	|05 |

  For more information, see [Required ABAP authorizations](preparing-sap.md#required-abap-authorizations).

## Next steps

Learn more about the Microsoft Sentinel solution for SAP® applications:

- [Deploy Microsoft Sentinel solution for SAP® applications](deployment-overview.md)
- [Prerequisites for deploying Microsoft Sentinel solution for SAP® applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)
- [Deploy SAP Change Requests (CRs) and configure authorization](preparing-sap.md)
- [Deploy the solution content from the content hub](deploy-sap-security-content.md)
- [Deploy and configure the container hosting the SAP data connector agent](deploy-data-connector-agent-container.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Deploy the Microsoft Sentinel for SAP data connector with SNC](configure-snc.md)
- [Enable and configure SAP auditing](configure-audit.md)
- [Collect SAP HANA audit logs](collect-sap-hana-audit-logs.md)

Troubleshooting:

- [Troubleshoot your Microsoft Sentinel solution for SAP® applications deployment](sap-deploy-troubleshoot.md)

Reference files:

- [Microsoft Sentinel solution for SAP® applications data reference](sap-solution-log-reference.md)
- [Microsoft Sentinel solution for SAP® applications: security content reference](sap-solution-security-content.md)
- [Kickstart script reference](reference-kickstart.md)
- [Update script reference](reference-update.md)
- [Systemconfig.ini file reference](reference-systemconfig.md)

For more information, see [Microsoft Sentinel solutions](../sentinel-solutions.md).
