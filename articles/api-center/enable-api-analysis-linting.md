---
title: Perform API linting and analysis - Azure API Center
description: Configure linting of API definitions in your API center to analyze compliance of APIs with the organization's API style guide.
ms.service: api-center
ms.topic: how-to
ms.date: 03/11/2024
ms.author: danlep
author: dlepow
ms.custom:
# Customer intent: As an API program manager, I want to lint the API definitions in my organization's API center and analyze whether my APIs comply with my organization's API style guide.
---

# Enable linting and analysis for API governance in your API center

This article shows how to enable linting to analyze API definitions in your organization's [API center](overview.md) for conformance with your organizations's API style rules. Linting generates an analysis report that you can access in your API center. Use API linting and analysis to detect common errors and inconsistencies in your API definitions.

> [!VIDEO https://www.youtube.com/embed/m0XATQaVhxA]

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Scenario overview

In this scenario, you analyze API definitions in your API center by using the [Spectral](https://github.com/stoplightio/spectral) open source linting engine. An Azure Functions app runs the linting engine in response to events in your API center. Spectral checks that the APIs defined in a JSON or YAML specification document conform to the rules in a customizable API style guide. A report of API compliance is generated that you can view in your API center.

The following diagram shows the steps to enable linting and analysis in your API center.

:::image type="content" source="media/enable-api-analysis-linting/scenario-overview.png" alt-text="Diagram showing how API linting works in Azure API Center." lightbox="media/enable-api-analysis-linting/scenario-overview.png":::

1. You deploy an Azure Functions app that runs the Spectral linting engine on an API definition.

1. You configure an event subscription in an Azure API center to trigger the function app.

1. An event is triggered by adding or replacing an API definition in the API center.

1. On receiving the event, the function app invokes the Spectral linting engine.

1. The linting engine checks that the APIs defined in the definition conform to the organization's API style guide and generates a report.

1. You view the analysis report in the API center.

### Limitations

* Linting currently supports only JSON or YAML specification files, such as OpenAPI or AsyncAPI specification documents.
* By default, the linting engine uses the built-in [`spectral:oas` ruleset](https://docs.stoplight.io/docs/spectral/4dec24461f3af-open-api-rules). To extend the ruleset or create custom API style guides, see the [Spectral GitHub repo](https://github.com/stoplightio/spectral/blob/develop/docs/reference/openapi-rules.md).
* The Azure function app that invokes linting is charged separately, and you manage and maintain it.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

* Visual Studio Code with the [Azure Functions extension v1.10.4](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) or later.

* The Event Grid resource provider registered in your subscription. If you need to register the Event Grid resource provider, see [Subscribe to events published by a partner with Azure Event Grid](../event-grid/subscribe-to-partner-events.md#register-the-event-grid-resource-provider).

* For Azure CLI:
    [!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

    > [!NOTE]
    > `az apic` commands require the `apic-extension` Azure CLI extension. If you haven't used `az apic` commands, the extension is installed dynamically when you run your first `az apic` command. Learn more about [Azure CLI extensions](/cli/azure/azure-cli-extensions-overview).

    > [!NOTE]
    > Azure CLI command examples in this article can run in PowerShell or a bash shell. Where needed because of different variable syntax, separate command examples are provided for the two shells.

## Deploy your Azure Functions app

Follow these steps to deploy the Azure Functions app that runs the linting function on API definitions.

1. Clone the [GitHub repository](https://github.com/Azure/APICenter-Analyzer/) and open it in Visual Studio Code.
1. In the `resources/rulesets` folder, you can find an `oas.yaml` file. This file reflects your current API style guide and can be modified based on your organizational needs and requirements.
1. Optionally, run the function app locally to test it. For details, see the [README](https://github.com/Azure/APICenter-Analyzer/tree/preview#-configure--run-your-function-locally) file in the repository.
1. Deploy the function app to Azure. For steps, see [Quickstart: Create a function in Azure with TypeScript using Visual Studio Code](../azure-functions/create-first-function-vs-code-typescript.md#sign-in-to-azure).

    > [!NOTE]
    > Deploying the function app might take a few minutes.

1. Sign in to the [Azure portal](https://portal.azure.com), and go to the function app.
1. On the **Overview** page, check the following details:
    * Confirm that the **Status** of the function app is **Running**.
    * Under **Functions**, confirm that the **Status** of the *apicenter-analyzer* function is **Enabled**.

    :::image type="content" source="media/enable-api-analysis-linting/function-app-status.png" alt-text="Screenshot of the function app in the portal.":::


## Configure managed identity in your function app

To enable the function app to access the API center, configure a managed identity for the function app. The following steps show how to enable and configure a system-assigned managed identity for the function app using the Azure portal or the Azure CLI.

> [!NOTE]
> In preview, this scenario requires the Contributor role to be assigned to the function app's managed identity.


#### [Portal](#tab/portal)

1. In the Azure portal, navigate to your function app and select **Identity** under the **Settings** section.
1. On the **System assigned** tab, set the **Status** to **On** and then select **Save**.

Now that the managed identity is enabled, assign it the Contributor role to access the API center.

1. In the Azure portal, navigate to your API center and select **Access control (IAM)**.
1. Select **+ Add > Add role assignment**.
1. Select **Privileged administrator roles** and then select **Contributor**. Select **Next**.
1. On the **Members** page, in **Assign access to**, select **Managed identity > + Select members**.
1. On the **Select managed identities** page, search for and select the managed identity of the function app. Click **Select** and then **Next**.
1. Review the role assignment, and select **Review + assign**.

#### [Azure CLI](#tab/cli)


1. Enable the system-assigned identity of the function app using the [az functionapp identity assign](/cli/azure/functionapp/identity#az-functionapp-identity-assign) command. Replace `<function-app-name>` and `<resource-group-name>` with your function app name and resource group name. The following command stores the principal ID of the system-assigned managed identity in the `principalID` variable.

    ```azurecli
    #! /bin/bash
    principalID=$(az functionapp identity assign --name <function-app-name> \
        --resource-group <resource-group-name> --identities [system] \
        --query "principalId" --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $principalID=$(az functionapp identity assign --name <function-app-name> `
        --resource-group <resource-group-name> --identities [system] `
        --query "principalId" --output tsv)
    ```

1. Get the resource ID of your API center. Substitute `<apic-name>` and `<resource-group-name>` with your API center name and resource group name.

    ```azurecli
    #! /bin/bash
    apicID=$(az apic service show --name <apic-name> --resource-group <resource-group-name> \
        --query "id" --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $apicID=$(az apic service show --name <apic-name> --resource-group <resource-group-name> `
        --query "id" --output tsv)
    ```

1. Assign the function app's managed identity the Contributor role in the API center using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. 

    ```azurecli
    #! /bin/bash
    az role assignment create \
        --role "Contributor" \
        --assignee-object-id $principalID \
        --assignee-principal-type ServicePrincipal \
        --scope $apicID 
    ```

    ```azurecli
    # PowerShell syntax
    az role assignment create `
        --role "Contributor" `
        --assignee-object-id $principalID `
        --assignee-principal-type ServicePrincipal `
        --scope $apicID 
    ```
---

## Configure event subscription in your API center

Now create an event subscription in your API center to trigger the function app when an API definition file is uploaded or updated. The following steps show how to create the event subscription using the Azure portal or the Azure CLI.


#### [Portal](#tab/portal)

1. Sign in to the Azure portal at [https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview](https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview). Currently for this scenario, you must access your API center in the portal at this feature flag.
1. Navigate to your API center and select **Events**.
1. Select **Azure Function**.
1. On the **Create Event Subscription** page, do the following:
    1. Enter a descriptive **Name** for the event subscription, and select **Event Grid Schema**.
    1. In **Topic details**, enter a **System topic name** of your choice.
    1. In **Event Types**, select the following events:
        * **API definition added**
        * **API definition updated**
    1. In **Endpoint Details**, select **Azure Function > Configure an endpoint**.
    1. On the **Select Azure Function** page, select the function app and the *apicenter-linter* function that you configured. Click **Confirm selection**.
    1. Select **Create**.

         :::image type="content" source="media/enable-api-analysis-linting/create-event-subscription.png" alt-text="Screenshot of creating the event subscription in the portal.":::
1. Select the **Event subscriptions** tab and select **Refresh**. Confirm that the **Provisioning state** of the event subscription is **Succeeded**.

    :::image type="content" source="media/enable-api-analysis-linting/event-subscription-provisioning-state.png" alt-text="Screenshot of the state of the event subscription in the portal.":::


#### [Azure CLI](#tab/cli)

1. Get the resource ID of your API center. Substitute `<apic-name>` and `<resource-group-name>` with your API center name and resource group name.

    ```azurecli
    #! /bin/bash
    apicID=$(az apic service show --name <apic-name> --resource-group <resource-group-name> \
        --query "id" --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $apicID=$(az apic service show --name <apic-name> --resource-group <resource-group-name> `
        --query "id" --output tsv)
    ```
1. Get the resource ID of the function in the function app. In this example, the function name is *apicenter-analyzer*. Substitute `<function-app-name>` and `<resource-group-name>` with your function app name and resource group name.

    ```azurecli
    #! /bin/bash
    functionID=$(az functionapp function show --name <function-app-name> \
        --function-name apicenter-analyzer --resource-group <resource-group-name> \
        --query "id" --output tsv)
    ```

    ```azurecli
    # PowerShell syntax
    $functionID=$(az functionapp function show --name <function-app-name> `
        --function-name apicenter-analyzer --resource-group <resource-group-name> `
        --query "id" --output tsv)
    ```

1. Create an event subscription using the [az eventgrid event-subscription create](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create) command. The subscription that's created includes events for adding or updating API definitions.

    ```azurecli
    #! /bin/bash
    az eventgrid event-subscription create --name MyEventSubscription \
        --source-resource-id "$apicID" --endpoint "$functionID" \
        --endpoint-type azurefunction --included-event-types \
        Microsoft.ApiCenter.ApiDefinitionAdded Microsoft.ApiCenter.ApiDefinitionUpdated
    ```

    ```azurecli
    # PowerShell syntax
    az eventgrid event-subscription create --name MyEventSubscription `
        --source-resource-id "$apicID" --endpoint "$functionID" `
        --endpoint-type azurefunction --included-event-types `
        Microsoft.ApiCenter.ApiDefinitionAdded Microsoft.ApiCenter.ApiDefinitionUpdated
    ```

    The command output shows details of the event subscription. You can also get details using the [az eventgrid event-subscription show](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-show) command. For example:

    ```azurecli
    az eventgrid event-subscription show --name MyEventSubscription --source-resource-id "$apicID"
    ```
---

> [!NOTE]
> It might take a short time for the event subscription to propagate to the function app.

## Trigger event in your API center

To test the event subscription, try uploading or updating an API definition file associated with an API version in your API center. For example, upload an OpenAPI or AsyncAPI document. After the event subscription is triggered, the function app invokes the API linting engine to analyze the API definition.

* For detailed steps to add an API, API version, and API definition to your API center, see [Tutorial: Register APIs in your API center](register-apis.md).
* To create an API by uploading an API definition file using the Azure CLI, see [Register API from a specification file](manage-apis-azure-cli.md#register-api-from-a-specification-file---single-step).

To confirm that the event subscription was triggered:

1. Sign in to the Azure portal at [https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview](https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview). 
1. Navigate to your API center, and select **Events** in the left menu.
1. Select the **Event Subscriptions** tab and select the event subscription for your function app.
1. Review the metrics to confirm that the event subscription was triggered and that linting was invoked successfully.

    :::image type="content" source="media/enable-api-analysis-linting/event-subscription-metrics.png" alt-text="Screenshot of the metrics for the event subscription in the portal.":::

    > [!NOTE]
    > It might take a few minutes for the metrics to appear.

After analyzing the API definition, the linting engine generates a report based on the configured API style guide.

## View API analysis reports

You can view the analysis report for your API definition in the Azure portal. After an API definition is analyzed, the report lists errors, warnings, and information based on the configured API style guide. 

In the portal, you can also view a summary of analysis reports for all API definitions in your API center.

### Analysis report for an API definition

To view the analysis report for an API definition in your API center:

1. Sign in to the Azure portal at [https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview](https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview).
1. Navigate to the API version in your API center where you added or updated an API definition.
1. Select **Definitions**, and then select the API definition file that you uploaded or updated.
1. Select the **Analysis** tab.
    :::image type="content" source="media/enable-api-analysis-linting/analyze-api-definition.png" alt-text="Screenshot of Analysis tab for API definition in the portal.":::

The **API Analysis Report** opens, and it displays the API definition and errors, warnings, and information based on the configured API style guide. The following screenshot shows an example of an API analysis report.

:::image type="content" source="media/enable-api-analysis-linting/api-analysis-report.png" alt-text="Screenshot of an API analysis report in the portal.":::

### API analysis summary

To view a summary of analysis reports for all API definitions in your API center:

1. Sign in to the Azure portal at [https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview](https://portal.azure.com/?Microsoft_Azure_ApiManagement=apicenterpreview).
1. In the left-hand menu, under **Governance**, select **API Analysis**. The summary appears.

    :::image type="content" source="media/enable-api-analysis-linting/api-analysis-summary.png" alt-text="Screenshot of the API analysis summary in the portal.":::

## Related content

Learn more about Event Grid:

* [System topics in Azure Event Grid](../event-grid/system-topics.md)
* [Event Grid push delivery - concepts](../event-grid/concepts.md)
* [Event Grid schema for API Center](../event-grid/event-schema-api-center.md)

