---
title: 'Tutorial: Configure rules engine'
titleSuffix: Azure Front Door
description: This article provides a tutorial on how to configure Rules engine in both the Azure portal and Azure CLI.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: tutorial
ms.workload: infrastructure-services
ms.custom: devx-track-azurecli
ms.date: 06/06/2023
ms.author: duau 
# Customer intent: As an IT admin, I want to learn about Front Door and how to configure Rules Engine feature via the Azure portal or Azure CLI.
---

# Tutorial: Configure your rules engine

This tutorial shows how to create a Rules engine configuration and your first rule in both Azure portal and CLI. 

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure Rules Engine using the portal.
> - Configure Rules Engine using Azure CLI

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Create a Front Door (classic)](quickstart-create-front-door.md).

## Configure Rules engine in Azure portal

1. Within your Front Door (classic) resource, select **Rule Engine configuration** from under *Settings* on the left side menu pane. Select **+ Add**, give your configuration a name, and start creating your first Rules Engine configuration.

    :::image type="content" source="./media/front-door-rules-engine/rules-engine-tutorial-1.png" alt-text="Screenshot of the rules engine configuration from the Front Door overview page.":::


1. Enter a name for your first rule. Then select **+ Add condition** or **+ Add action** to define your rule.
    
    > [!NOTE]
    > - To delete a condition or action from rule, use the trash can on the right-hand side of the specific condition or action.
    > - To create a rule that applies to all incoming traffic, do not specify any conditions.
    > - To stop evaluating rules once the first match condition is met, check **Stop evaluating remaining rule**. If this is checked and all of the match conditions of a particular rule are met, then the remaining rules in the configuration will not be executed.
    > - All paths in the rules engine configuration are case sensitive.
    > - Header names should adhere to [RFC 7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6).

    :::image type="content" source="./media/front-door-rules-engine/rules-engine-tutorial-4.png" alt-text="Screenshot of the rules engine configuration page with a single rule.":::

1. Determine the priority of the rules within your configuration by using the Move up, Move down, and Move to top buttons. The priority is in ascending order, meaning the rule first listed is the most important rule.


    > [!TIP]
    > If you like to verify when the changes are propagated to Azure Front Door, you can create a custom response header in the rule using the example below. You can add a response header `_X-<RuleName>-Version_`  and change the value each time rule is updated.
    >  
    > :::image type="content" source="./media/front-door-rules-engine/rules-version.png" alt-text="Screenshot of custom version header rule." lightbox="./media/front-door-rules-engine/rules-version-expanded.png":::
    > After the changes are updated, you can go to the URL to confirm the rule version being invoked: 
    > :::image type="content" source="./media/front-door-rules-engine/version-output.png" alt-text="Screenshot of custom header version output.":::


1. Once you have created one or more rules, select **Save**. This action creates your rules engine configuration.

1. Once you have created a rule engine configuration, you can associate the configuration with a routing rule. A single configuration can be applied to multiple routing rules, but a routing rule can only have one rules engine configuration. To associate the configuration, go to the **Front Door designer** and select a **Route**. Then select the **Rules engine configuration** to associate to the routing rule.

    :::image type="content" source="./media/front-door-rules-engine/rules-engine-tutorial-5.png" alt-text="Screenshot of rules engine configuration associate from the routing rule page.":::

## Configure Rules Engine in Azure CLI

1. Install [Azure CLI](/cli/azure/install-azure-cli). Add “front-door” extension:- az extension add --name front-door. Then, sign in and switch to your subscription az account set --subscription <name_or_Id>.

1. Start by creating a Rules Engine - this example shows one rule with one header-based action and one match condition. 

    ```azurecli-interactive
    az network front-door rules-engine rule create -f {front_door} -g {resource_group} --rules-engine-name {rules_engine} --name {rule1} --priority 1 --action-type RequestHeader --header-action Overwrite --header-name Rewrite --header-value True --match-variable RequestFilenameExtension --operator Contains --match-values jpg png --transforms Lowercase
    ```

1. List all the rules. 

    ```azurecli-interactive
    az network front-door rules-engine rule list -f {front_door} -g {rg} --name {rules_engine}
    ```

1. Add a forwarding route override action. 

    ```azurecli-interactive
    az network front-door rules-engine rule action add -f {front_door} -g {rg} --rules-engine-name {rules_engine} --name {rule1} --action-type ForwardRouteOverride --backend-pool {backend_pool_name} --caching Disabled
    ```

1. List all the actions in a rule. 

    ```azurecli-interactive
    az network front-door rules-engine rule action list -f {front_door} -g {rg} -r {rules_engine} --name {rule1}
    ```

1. Link a rules engine configuration to a routing rule.  

    ```azurecli-interactive
    az network front-door routing-rule update -g {rg} -f {front_door} -n {routing_rule_name} --rules-engine {rules_engine}
    ```

1. Unlink rules engine. 

    ```azurecli-interactive
    az network front-door routing-rule update -g {rg} -f {front_door} -n {routing_rule_name} --remove rulesEngine # case sensitive word ‘rulesEngine’
    ```

For more information, see full list of [Azure Front Door (classic) Rules engine commands](/cli/azure/network/front-door/rules-engine).   

## Clean up resources

In the preceding steps, you configured and associated rules engine configuration to your routing rules. If you no longer want the Rules engine configuration associated to your Front Door (classic), you can remove the configuration by performing the following steps:

1. Disassociate any routing rules from the rule engine configuration by selecting the three dots next to rule engine name and selecting **Associate routing rule**.

    :::image type="content" source="./media/front-door-rules-engine/front-door-rule-engine-routing-association.png" alt-text="Screenshot of the associate routing rules from the menu.":::

1. Uncheck all routing rules this Rule Engine configuration is associated to and select save.

    :::image type="content" source="./media/front-door-rules-engine/front-door-routing-rule-association.png" alt-text="Routing rule association":::

1. Now you can delete the Rule Engine configuration from your Front Door.

    :::image type="content" source="./media/front-door-rules-engine/front-door-delete-rule-engine-configuration.png" alt-text="Delete Rule Engine configuration":::

## Next steps

In this tutorial, you learned how to:

* Create a Rule engine configuration
* Associate a configuration to a routing rule.

To learn how to add security headers with Rule engine, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Security headers with Rules Engine](front-door-security-headers.md)
