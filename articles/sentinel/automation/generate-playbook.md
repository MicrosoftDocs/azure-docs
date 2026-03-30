---
title: Generate playbooks using AI in Microsoft Sentinel
description: Generate playbooks through natural language conversations directly in the Defender portal.
author: mberdugo
ms.author: monaberdugo
ms.reviewer: Shiran Shuster Zur
ms.topic: how-to
ms.date: 02/13/2026
ms.service: microsoft-sentinel
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#Customer intent: As a security analyst, I want to generate playbooks using AI so that I can quickly create automation workflows without extensive coding knowledge.

---

# Generate playbooks using AI in Microsoft Sentinel (preview)

The SOAR playbook generator creates python based automation workflows coauthored through a conversational experience with Cline, an AI coding agent. You describe automation logic in natural language, and the system generates validated, code-based playbooks with complete documentation and visual flow diagrams. This experience is powered by an embedded VS Code environment within the Defender portal, so you can author and refine playbooks without leaving the portal. Generated playbooks use alert data as input and dynamically generate the required API calls, as long as you configure the integration for the target provider.

This article describes how to generate playbooks by using AI, configure required integrations, and deploy your automation workflows.

> [!IMPORTANT]
> Generated Playbooks are currently in preview. This feature requires Security Copilot to be enabled in your tenant, though Security Compute Units (SCUs) aren't billed during the preview period.

Playbook generation provides the following capabilities:

- **Co-author with AI**: Build playbooks through natural language conversations with Cline, an AI coding agent hosted in a VS Code environment embedded in the Defender portal.
- **Testing**: Once the playbook is generated, you can test it by providing a real alert as input.
- **Automatic documentation**: Generate comprehensive playbook documentation and visual flow diagrams automatically
- **Third-party integrations**: Connect external tools and APIs seamlessly through integration profiles
- **Broad alert coverage**: Apply automation to alerts from Microsoft Sentinel, Microsoft Defender, and XDR platforms

An embedded VS Code environment within the Microsoft Defender portal powers the experience. You can author and refine playbooks without leaving the portal.

## Prerequisites

You don't need prior coding experience to generate a playbook, but it helps to be familiar with tools like VS Code and Entra ID app registration.

You also must meet the following requirements:

### Environment requirements

- **Security Copilot**: Your tenant must be [Security Copilot enabled with SCUs available](/copilot/security/get-started-security-copilot#option-1-recommended-provision-capacity-through-security-copilot). You aren't billed for SCUs, but their availability is a technical requirement.

- **Microsoft Sentinel workspace**: Your tenant must have a Microsoft Sentinel workspace onboarded to Microsoft Defender. To create a new workspace, see [Create a workspace](/copilot/security/manage-workspaces#create-a-workspace).

- **Recommended Data sharing preferences**: In Security Copilot, enable the first slider, *Allow Microsoft to capture data from Security Copilot to validate product performance using human review*, in Customer Data Sharing preferences. For more information, see [Privacy and data security in Microsoft Security Copilot](/security-copilot/privacy-data-security).

### Required roles and permissions

To use playbook generator, you need the following permissions:

- **To author Automation Rules**: You need the **Microsoft Sentinel Contributor** role on the relevant Workspaces or Resource Groups containing them in Azure. See [Microsoft Entra built-in roles](/azure/sentinel/roles#built-in-azure-roles-for-microsoft-sentinel)

- **To use the playbook generator**: You need the **Detection tuning** role in Microsoft Entra in Azure. See [Microsoft Entra built-in roles](/entra/identity/role-based-access-control/permissions-reference#security-administrator)

> [!NOTE]
> Permissions might take up to two hours to take effect after assignment.

### Recommended: Configure a dedicated Security Copilot workspace

If you don't already have a dedicated Security Copilot workspace for AI-generated playbooks that's set in geo **US** or **Europe**, or allowing cross-region evaluation, we recommended you [create one](/copilot/security/manage-workspaces#create-a-workspace).

1. In the **Create a new workspace** dialog:

   1. Enable the following privacy flags:

      - **Allow Microsoft to capture data to validate product performance**
      - **Allow Microsoft to capture and review data to build and validate Microsoft's security AI model**

   1. Accept the Terms and Conditions.

   1. Under **Capacity**, select **Create a new capacity**.

      :::image type="content" source="./media/generate-playbook/create-new-capacity.png" alt-text="Screenshot of Create new workspace dialog with Create a new capacity link highlighted." lightbox="./media/generate-playbook/create-new-capacity.png":::

1. Configure the new capacity:

   In the **Create a Security capacity** dialog:

   1. Choose your Azure subscription, resource group, and capacity name.

   1. Set **Prompt evaluation location** to **United States** or **Europe**. If you select a different location, check the box: **If this location has too much traffic, allow Copilot to evaluate prompts anywhere in the world**.

   1. Adjust compute units and allow overage settings. The playbook generator doesn't consume Security Compute Units (SCUs), but you need to configure the capacity to meet these technical requirements for playbook generation.

   1. Select **Create**.

:::image type="content" source="./media/generate-playbook/create-capacity.png" alt-text="Screenshot of the new capacity details." lightbox="./media/generate-playbook/create-capacity.png":::

Generated playbooks automatically use this workspace.

## Key concepts

### Integration profiles

Integration profiles are secure configurations that allow generated playbooks to interact with external APIs. Each integration includes:

- Base URL
- Authentication method
- Required credentials

The playbook generator uses the integration to execute API calls. If the integration is missing, it prompts you to create one before proceeding with playbook generation.
Manage integration profiles centrally in the Defender portal under the **Automation** tab. Before creating a playbook, ensure you configure all required integrations.

To add integration, select **Integration** from the Automation tab, or use the **Add integration** link on top of the VS Code page. You can't edit the URL of existing integration links. Create a new integration link if needed, and delete the old one.

### Enhanced alert trigger

The Enhanced Alert Trigger extends automation capabilities beyond the standard alert trigger by providing:

- **Broader coverage**: Target alerts across Microsoft Sentinel, Microsoft Defender, and XDR platforms
- **Tenant-level application**: Ensure consistency across multiple workspaces
- **Advanced conditions**: Define granular criteria for triggering automation

This trigger mechanism enables automatic execution of generated playbooks across your security ecosystem.

## Generate a new playbook

### Step 1. Create a Graph API integration profile and add any other required integrations you want to utilize

1. In the Azure portal, go to **Microsoft Entra ID** > **Manage** > **App registrations**.

1. Select **New registration**.

   :::image type="content" source="./media/generate-playbook/new-registration.png" alt-text="Screenshot of the New registration page in Microsoft Entra ID." lightbox="./media/generate-playbook/new-registration.png":::

1. After the registration finishes, select the app registration and go to **Overview**.

1. Copy the **Application (client) ID** and **Directory (tenant) ID**. Save these values for later use.

1. Go to **Manage** > **Certificates & secrets** > **Client secrets**.

1. Select **New client secret**, provide a name and expiration date, and then select **Add**.

   :::image type="content" source="./media/generate-playbook/client-secrets.png" alt-text="Screenshot of the New client secret page in Microsoft Entra ID." lightbox="./media/generate-playbook/client-secrets.png":::

1. Immediately copy the client secret **Value** and store it securely. You can't retrieve this value again.

<!---
#### Configure API permissions

1. In the Azure portal, go to **Microsoft Entra ID** > **App registrations** > select your Graph app.

1. Select **API permissions** > **Add a permission** > **Microsoft Graph**.

1. Select **Application permissions**.

1. Search for and select **SecurityAlert.Read.All**.

1. Select **Add permissions**.

1. Select **Grant admin consent for [tenant]** and confirm.

1. Verify that **SecurityAlert.Read.All** is listed under **Microsoft Graph / Application** with status **Granted for [tenant]**.
--->

#### Create the integration profile

1. In the Microsoft Defender portal, go to **Microsoft Sentinel** > **Configuration** > **Automation**.

1. Select the **Integration Profiles** tab.

1. Select **Create** and provide the following information:

   | Field | Value |
   |-------|-------|
   | **Integration name** | Any descriptive name, for example, "Graph Integration" |
   | **Description** | Short description, for example, "Integration with Microsoft Graph APIs" |
   | **Base API URL** | `https://graph.microsoft.com` |
   | **Authentication method** | **OAuth2** |
   | **Client ID** | Paste the Application (client) ID you copied earlier |
   | **Client secret** | Paste the client secret Value you copied earlier |
   | **Token endpoint** | `https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token` <br>(Replace {TENANT_ID} with your Directory (tenant) ID) |
   | **Scopes** | `https://graph.microsoft.com/.default` |

   :::image type="content" source="./media/generate-playbook/integration-profile.png" alt-text="Screenshot of the Integration Profile creation page in Microsoft Sentinel." lightbox="./media/generate-playbook/integration-profile.png":::

1. Verify under **Microsoft Graph / Application** that **SecurityAlert.Read.All** is listed and the Status is **Granted for \<tenant\>**.

  :::image type="content" source="./media/generate-playbook/api-permissions.png" alt-text="Screenshot of API permissions in Microsoft Entra ID." lightbox="./media/generate-playbook/api-permissions.png":::

### Create additional integration profiles

Configure integration profiles for any other third-party services your playbooks use. Each integration requires:

- A unique name and description
- The service's base API URL
- An authentication method (OAuth2 Client Credentials, API Key, AWS Auth, User and Password, Bearer/JWT, or Hawk)
- Appropriate credentials for the selected authentication method

> [!NOTE]
> You can't change the API URL and authentication method after creation. You can only edit the integration name and description.

### Step 2. Create a generated playbook

1. Select the **Playbooks** tab.

1. Select **Create** > **Playbook Generator**.
1. Enter a name for your playbook and select **Continue**.

   An embedded Visual Studio Code environment opens with Cline.

:::image type="content" source="./media/generate-playbook/playbook-name.png" alt-text="Screenshot of the embedded Visual Studio Code environment with the playbook generator." lightbox="./media/generate-playbook/playbook-name.png":::

#### Work in Plan mode

When the editor opens, the experience starts in **Plan mode**. In this mode, you describe your automation requirements and the playbook generator generates a plan for review.

1. In the chat interface, describe your playbook requirements in detail. Be explicit about:

   - What data to process
   - What actions to perform
   - What conditions to evaluate
   - Expected outcomes

   **Example**: "Create a playbook that triggers on phishing alerts. Extract the sender email address. Check if the user exists in our directory, and if so, temporarily disable their account and notify the security team." For other examples of prompts, see the [Example use case](#example-use-case) section.

1. If the playbook generator requests approval to fetch documentation URLs, approve the request. This approval allows the playbook generator to access relevant API documentation to generate accurate code.

:::image type="content" source="./media/generate-playbook/approval-request.png" alt-text="Screenshot of the approval request dialog in the embedded Visual Studio Code environment." lightbox="./media/generate-playbook/approval-request.png":::

1. The playbook generator analyzes your request and might:
   - Ask clarifying questions
   - Request API documentation if it can't be accessed via web search
   - Notify you of missing integration profiles
   - Generate a preliminary plan and flow diagram

1. If the playbook generator identifies missing integration profiles:

   1. Select **Save** and exit the VS Code environment.

   1. Create the missing integration profiles in the **Integration Profiles** tab.

   1. Return to edit the playbook to continue.

   :::image type="content" source="./media/generate-playbook/add-integration.png" alt-text="Screenshot showing missing integration profiles in the embedded Visual Studio Code environment." lightbox="./media/generate-playbook/add-integration.png":::

#### Review and approve the plan

1. Review the generated plan and flow diagram carefully.

1. If you need changes, describe the modifications in the chat. The playbook generator revises the plan accordingly.

1. When satisfied with the plan, follow instructions and switch to **Act mode**.

:::image type="content" source="./media/generate-playbook/act-mode.png" alt-text="Screenshot of the embedded Visual Studio Code environment in Act mode with the playbook generator." lightbox="./media/generate-playbook/act-mode.png":::

#### Generate the playbook in Act mode

1. After you switch to Act mode, the playbook generator delivers:
   - The complete playbook code in Python
   - Code validation
   - Comprehensive documentation, including a visual flow diagram and description of the playbook in natural language

1. The playbook generator asks the user for an Alert ID to run a test of the playbook. Before it executes the test, the playbook generator outlines the changes that will be applied to the environment and requests the user’s approval to proceed.

1. The tool might request approval for code generation. To enable automatic generation without approval prompts, select the **Edit** checkbox under **Auto-approve**.

:::image type="content" source="./media/generate-playbook/auto-approve.png" alt-text="Screenshot of the Autoapprove checkbox in the embedded Visual Studio Code environment." lightbox="./media/generate-playbook/auto-approve.png":::

   > [!TIP]
   > When you select **Save** in the chat, it saves the current step and confirms your approval. **It doesn't save the entire playbook**.

#### Validate and save your playbook

1. To ensure correctness, manually review the generated code and documentation.

1. To preview the documentation in Markdown format:
   - **Windows/Linux**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>
   - **macOS**: Press <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>

1. Select **Save** at the bottom-left of the editor.

   The playbook is created in a disabled state.

1. Close the editor when finished.

:::image type="content" source="./media/generate-playbook/preview.png" alt-text="Screenshot of the preview of an alert notification created with the playbook generator." lightbox="./media/generate-playbook/preview.png":::

## Enable and deploy your playbook

After creation, your generated playbook requires activation and an alert trigger to begin automating responses.

### Enable the playbook

1. In the **Automation** page, select the **Active Playbooks** tab.

1. Locate your newly created playbook.

1. Switch the playbook status to **Activate**.

### Create an enhanced alert trigger

1. Go to the **Automation Rules** tab.

1. Select **Create** to define a new rule with enhanced trigger.

1. Set up the trigger conditions:

   | Setting        | Description |
   |----------------|-------------|
   | **Conditions** | Define criteria such as alert title, severity, provider, or other attributes |
   | **Workspaces** | Select one or more workspaces where this rule applies. Workspaces requiring additional permissions appear grayed out |
   | **Actions**    | Select **Run Playbook** and choose your enabled playbook |

1. Select **Save**.

Your generated playbook now automatically runs when alerts that match your specified conditions are generated.

> [!TIP]
> Enhanced Alert Triggers work at the tenant level. You can apply automation across multiple workspaces and alert sources for comprehensive coverage.

## Monitor playbook execution

To view execution details for your generated playbook:

1. Go to the incident page that contains the relevant alert.

1. Select the **Activities** tab.

1. Find the row labeled **run playbook** to view the execution status and details.

> [!NOTE]
> You can view the automation rule run results in the **incidents activity** tab, but not in the Microsoft Sentinel Health Table.

## Example use case

The following are examples of prompts you can use to generate playbooks for common scenarios:

- Create a playbook that enriches alert URL entities with VirusTotal
      data and adds the results as a comment to the related incident.
- Create a playbook that blocks an AWS IAM user, assigns the alert to John, and adds a remediation comment when a high severity alert includes an IAM user entity.

## Limitations

Be aware of the following limitations when working with generated playbooks:

### Playbook limitations

- **Language support**: Only Python is supported for playbook authoring
- **Input constraints**: Playbooks currently accept alerts as the sole input type
- **Concurrent editing**: A single user can edit only one playbook at a time. However, multiple users can edit different playbooks simultaneously
- **Library support**: External libraries aren't currently supported
- **Code validation**: No automatic code validation is provided. Users must manually verify correctness
- **Number of playbooks**: You can create up to 100 playbooks per tenant
- **Playbook size**: Each playbook can have up to 5,000 lines
- **Runtime**: Maximum runtime per playbook execution is 10 minutes
- **Integrations**: Maximum number of integrations per tenant is 500.
- **AI interactions**: Maximum of 8M tokens per day per tenant

### Integration profiles limitations

- **Integration limitations**: Microsoft Graph and Azure Resource Manager integrations aren't enabled by default and must be manually created
- **Authentication methods**: Available methods include OAuth2 Client Credentials, API Key, AWS Auth, User and Password, Bearer/JWT Authentication, and Hawk
- **Integration configuration**: The API URL and authentication method can't be changed after creation

### Automation rule alert trigger limitations

- **Trigger limitations**: Enhanced Alert Trigger rules don't support priority ordering or expiration dates
- **Available actions**: Currently, the only available actions are triggering generated Playbooks and updating action alerts
- **Workspace permissions** – You must explicitly specify the workspaces where you have permissions; the trigger doesn't apply to workspaces you can't access.
- **Separate rule tables** – Enhanced Alert Trigger rules live alongside Standard Alert Trigger rules in a separate Automation Rules table. Currently, there's no automatic migration of Standard Alert Trigger rules.
- **Run result visibility** – Automation rule run results are **not written to the Sentinel Health Table**. However, you can view the runs and their outcomes in the **Activity tab of the Incident** that contains the targeted alert.
- The maximum number of active automation rules you can create is 500 per tenant.
- You can execute one action per rule.

## Related content

- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
- [Automate and run Microsoft Sentinel playbooks](run-playbooks.md)
- [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md)
- [Privacy and data security in Microsoft Security Copilot](/security-copilot/privacy-data-security)
