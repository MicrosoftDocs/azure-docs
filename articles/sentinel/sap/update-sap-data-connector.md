---
title: Update the Microsoft Sentinel for SAP applications data connector agent
description: This article shows you how to update an already existing SAP data connector to its latest version.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 06/26/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security operations engineer, I want to update the Microsoft Sentinel for SAP applications data connector agent so that I can ensure my SAP data integration is using the latest features and security updates.

---

# Update the Microsoft Sentinel for SAP applications data connector agent

This article shows you how to update an already existing Microsoft Sentinel for SAP data connector to its latest version so that you can use the latest features and improvements.

During the data connector agent update process, there might be a brief downtime of approximately 10 seconds. To ensure data integrity, a database entry stores the timestamp of the last fetched log. After the update is complete, the data fetching process resumes from the last log fetched, preventing duplicates and ensuring a seamless data flow.

The automatic or manual updates described in this article are relevant to the SAP connector agent only, and not to the Microsoft Sentinel solution for SAP applications. To successfully update the solution, your agent needs to be up to date. The solution is updated separately, as you would any other [Microsoft Sentinel solution](../sentinel-solutions-deploy.md#install-or-update-content).

Content in this article is relevant for your **security**, **infrastructure**, and  **SAP BASIS** teams. 

> [!NOTE]
> This article is relevant only for the data connector agent, and isn't relevant for the [SAP agentless solution](deployment-overview.md#data-connector) (limited preview).
>

## Prerequisites

Before you start:

- Make sure that you have all the prerequisites for deploying Microsoft Sentinel solution for SAP applications. For more information, see [Prerequisites for deploying Microsoft Sentinel solution for SAP applications](prerequisites-for-deploying-sap-continuous-threat-monitoring.md).

- Make sure that you understand your SAP and Microsoft Sentinel environments and architecture, including the machines where your connector agents and collectors are [installed](deploy-data-connector-agent-container.md).

## Configure automatic updates for the SAP data connector agent (Preview)

Configure automatic updates for the connector agent, either for [all existing containers](#configure-automatic-updates-for-all-existing-containers) or a [specific container](#configure-automatic-updates-on-a-specific-container).

The commands described in this section create a cron job that runs daily, checks for updates, and updates the agent to the latest GA version. Containers running a preview version of the agent that's newer than the latest GA version aren't updated. Log files for automatic updates are located on the collector machine, at */var/log/sapcon-sentinel-register-autoupdate.log*.

After you configure automatic updates for an agent once, it's always configured for automatic updates.

> [!IMPORTANT]
> Automatically updating the SAP data connector agent is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

### Configure automatic updates for all existing containers

To turn on automatic updates for all existing containers with a connected SAP agent, run the following command on the collector machine:

```bash
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh 
```

If you're working with multiple containers, the cron job updates the agent on all containers that existed at the time when you ran the original command. If you add containers after you create the initial cron job, the new containers aren't updated automatically. To update these containers, [run an extra command to add them](#configure-automatic-updates-on-a-specific-container).

### Configure automatic updates on a specific container

To configure automatic updates for a specific container or containers, such as if you added containers after running the [original automation command](#configure-automatic-updates-for-all-existing-containers), run the following command on the collector machine:

```bash
wget -O sapcon-sentinel-auto-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-sentinel-auto-update.sh && bash ./sapcon-sentinel-auto-update.sh --containername <containername> [--containername <containername>]...
```

Alternately, in the */opt/sapcon/[SID or Agent GUID]/settings.json* file, define the `auto_update` parameter for each of the containers as `true`.

### Turn off automatic updates

To turn off automatic updates for a container or containers, open the */opt/sapcon/[SID or Agent GUID]/settings.json* file for editing and define the `auto_update` parameter for each of the containers as `false`.

## Manually update SAP data connector agent

To manually update the connector agent, make sure that you have the most recent versions of the relevant deployment scripts from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP).

For more information, see [Microsoft Sentinel solution for SAP applications data connector agent update file reference](reference-update.md).

**On the data connector agent machine, run**:

```bash
wget -O sapcon-instance-update.sh https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/SAP/sapcon-instance-update.sh && bash ./sapcon-instance-update.sh
```

The SAP data connector Docker container on your machine is updated.

Be sure to check for any other available updates, such as SAP change requests.

## Update your system for attack disruption

Automatic attack disruption for SAP is supported with the unified security operations platform in the Microsoft Defender portal, and requires:

- A workspace [onboarded to the unified security operations platform](../microsoft-sentinel-defender-portal.md).

- A Microsoft Sentinel SAP data connector agent, version 90847355 or higher. [Check your current agent version](#verify-your-current-data-connector-agent-version) and update it if you need to.

- The following roles in Azure and SAP:

    - **Azure role requirement**: The identity of your data connector agent VM must be assigned to the **Microsoft Sentinel Business Applications Agent Operator** Azure role. Verify this assignment and [assign this role manually](#assign-required-azure-roles-manually) if you need to.

    - **SAP role requirement**: The **/MSFTSEN/SENTINEL_RESPONDER** SAP role must be applied to your SAP system and assigned to the SAP user account used by the data connector agent. Verify this assignment and [apply and assign the role](#apply-and-assign-the-sentinel_responder-sap-role-to-your-sap-system) if you need to.

The following procedures describe how to fulfill these requirements if they aren't already met.

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

Attack disruption for SAP requires that you grant your agent's VM identity with specific permissions to the Log Analytics workspace enabled for Microsoft Sentinel, using the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles.

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

To perform this procedure, you must be a resource group owner on your Log Analytics workspace enabled for Microsoft Sentinel.

#### [Portal](#tab/portal)

1. In Microsoft Sentinel, on the **Configuration > Data connectors** page, go to your **Microsoft Sentinel for SAP** data connector and select **Open the connector page**.

1. In the **Configuration** area, under step **1. Add an API based collector agent**, locate the agent that you're updating and select the **Show commands** button.

1. Copy the **Role assignment commands** displayed. Run them on your agent VM, replacing the `Object_ID` placeholders with your VM identity object ID.

    These commands assign the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** Azure roles to your VM's managed identity, including only the scope of the specified agent's data in the workspace.

> [!IMPORTANT]
> Assigning the **Microsoft Sentinel Business Applications Agent Operator** and **Reader** roles via the CLI assigns the roles only on the scope of the specified agent's data in the workspace. This is the most secure, and therefore recommended option.
>
> If you must assign the roles [via the Azure portal](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition), we recommend assigning the roles on a small scope, such as only on the Log Analytics workspace enabled for Microsoft Sentinel.

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
    |`<SUB_ID>`     |    The subscription ID for your Log Analytics workspace enabled for Microsoft Sentinel   |
    |`<RESOURCE_GROUP_NAME>`     |  The resource group name for your Log Analytics workspace enabled for Microsoft Sentinel      |
    |`<WS_NAME>`     |    The name of your Log Analytics workspace enabled for Microsoft Sentinel  |
    |`<AGENT_IDENTIFIER>`     |   The agent ID displayed after running the command in the [previous step](#step1).      |

---

### Apply and assign the SENTINEL_RESPONDER SAP role to your SAP system

Apply **/MSFTSEN/SENTINEL_RESPONDER** SAP role to your SAP system and assign it to the SAP user account used by Microsoft Sentinel's SAP data connector agent.

To apply and assign the **/MSFTSEN/SENTINEL_RESPONDER** SAP role:
  
1. Upload role definitions from the [/MSFTSEN/SENTINEL_RESPONDER](https://aka.ms/SAP_Sentinel_Responder_Role) file in GitHub.

1. Assign the **/MSFTSEN/SENTINEL_RESPONDER** role to the SAP user account used by Microsoft Sentinel's SAP data connector agent. For more information, see [Configure your SAP system for the Microsoft Sentinel solution](preparing-sap.md).

    Alternately, manually assign the following authorizations to the current role already assigned to the SAP user account used by Microsoft Sentinel's SAP data connector. These authorizations are included in the **/MSFTSEN/SENTINEL_RESPONDER** SAP role specifically for attack disruption response actions.

    | Authorization object | Field | Value |
    | -------------------- | ----- | ----- |
    |S_RFC |RFC_TYPE |Function Module |
    |S_RFC |RFC_NAME |BAPI_USER_LOCK |
    |S_RFC |RFC_NAME |BAPI_USER_UNLOCK |
    |S_RFC |RFC_NAME |TH_DELETE_USER <br>In contrast to its name, this function doesn't delete users, but ends the active user session. |
    |S_USER_GRP |CLASS |* <br>We recommend replacing S_USER_GRP CLASS with the relevant classes in your organization that represent dialog users. |
    |S_USER_GRP |ACTVT |03 |
    |S_USER_GRP |ACTVT |05 |

  For more information, see [Required ABAP authorizations](required-abap-authorizations.md).

## Related content

For more information, see:

- [Deploy Microsoft Sentinel solution for SAP applications](deployment-overview.md)
- [Monitor the health of your SAP system](../monitor-sap-system-health.md)
- [Troubleshoot your Microsoft Sentinel solution for SAP applications deployment](sap-deploy-troubleshoot.md)
