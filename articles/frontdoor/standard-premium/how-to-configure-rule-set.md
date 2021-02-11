---
title: 'Configure Front Door Rule Set'
description: This article provides guidance on how to configure a Rule Set. 
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/18/2021
ms.author: yuajia
---

# Configure a Rule Set

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This tutorial shows how to create a Rule Set and your first set of rules in the Azure portal. 

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Configure Rule Set using the portal.
> - Delete Rule Set from your AFD profile using the portal

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create an Azure Front Door Standard/Premium. For more information, see [Quickstart: Create an Azure Front Door Standard/Premium profile](create-front-door-standard-premium-portal.md).

## Configure Rule Set in Azure portal

1. Within your Front Door profile, select **Rule Set** located under **Settings**. Select **Add** and give it a rule set name.

   :::image type="content" source="../media/how-to-configure-rule-set/front-door-create-rule-set-1.png" alt-text="Create a web app in the Azure portal":::
    
1. Select **Add Rule** to create your first rule. Give it a rule name. Then, select **Add condition** or **Add action** to define your rule. You can add up to 10 conditions and 5 actions for one rule. In this example, we use server variable to add a response header 8Geo-country* for requests that include *contoso* in the URL.

   :::image type="content" source="../media/how-to-configure-rule-set/front-door-create-rule-set.png" alt-text="Create a web app in the Azure portal":::
    
    > [!NOTE]
    > * To delete a condition or action from a rule, use the trash can on the right-hand side of the specific condition or action.
    > * To create a rule that applies to all incoming traffic, do not specify any conditions.
    > * To stop evaluating remaining rules if a specific rule is met, check **Stop evaluating remaining rule**. If this option is checked and all remaining rules in the Rule Set will not be executed regardless if the matching conditions were met.  

1. You can determine the priority of the rules within your Rule Set by using the arrow buttons to move the rules higher or lower in priority. The list is in ascending order, so the most important rule is listed first.

   :::image type="content" source="../media/how-to-configure-rule-set/front-door-rule-set-change-orders.png" alt-text="Create a web app in the Azure portal":::

1. Once you've created one or more rules select **Save** to complete the creation of your Rule Set.

1. Now associate the Rule Set to a Route so it can take effect. You can associate the Rules Set through Rule Set page or you can go to Endpoint Manager to create the association.
 
    **Rule Set page**: 
    
    1. Select the Rule Set to be associated.
    
    1. Select the *Unassociated* link.
     :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set.png" alt-text="Create a web app in the Azure portal":::

    1. Then in the **Associate a route** blade, select the endpoint and route you want to associate with the Rule Set. 
    
       :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-1.png" alt-text="Create a web app in the Azure portal":::
        
    1. Click *Next* to change rule set orders if there are multiple rule sets under selected route. Rule set will be executed from top to down. You can change orders by selecting the rule set and move it up or down.Then select *Associate*.
    
      > [!Note]
      > You can only associate one rule set with a single route on this page. To associate a Rule Set with multiple routes, please use Endpoint Manager.
    
    :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-2.png" alt-text="Create a web app in the Azure portal":::
    
    1. The rule set is now associated with a route. You can look at the response header and see the Geo-country is added.
    
    :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-3.png" alt-text="Create a web app in the Azure portal":::

    **Endpoint Manager**: 
    
    1. Go to Endpoint manager, select the endpoint you want to associate with the Rule Set.
    
    :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-endpoint-manager-1.png" alt-text="Create a web app in the Azure portal":::

    1. Click *Edit endpoint*  
    
    :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-endpoint-manager-2.png" alt-text="Create a web app in the Azure portal":::

    1. click on the Route. 
    
     :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-endpoint-manager-3.png" alt-text="Create a web app in the Azure portal":::
    
    1. In the *Update route* blade, in *Rules*, select the Rule Sets you want to associate with the route from the dropdown. Then you can change orders by moving rule set up and down. 
    
    :::image type="content" source="../media/how-to-configure-rule-set/front-door-associate-rule-set-endpoint-manager-4.png" alt-text="Create a web app in the Azure portal":::
    
    1. Then select *Update* or *Add* to finish the association.

## Delete a Rule Set from your Azure Front Door profile

In the preceding steps, you configured and associated a Rule Set to your Route. If you no longer want the Rule Set associated to your Front Door, you can remove the Rule Set by completing the following steps:

1. Go to the **Rule Set page** under **Settings** to disassociate the Rule Set from all associated routes.

1. Expand to the Route, click on the three dots select *Edit the route*.

   :::image type="content" source="../media/how-to-configure-rule-set/front-door-disassociate-rule-set-1.png" alt-text="Create a web app in the Azure portal":::

1. Go to Rules section on the Route page, select the rule set, and select on the *Delete* button. 

   :::image type="content" source="../media/how-to-configure-rule-set/front-door-disassociate-rule-set-2.png" alt-text="Create a web app in the Azure portal":::

1. Select *Update* and the Rule Set will disassociate from the route.

1. Repeat steps 2-5 to disassociate other routes that are associated with this rule set until you see the Routes status shows *Unassociated*.

1. For Rule Set that is *Unassociated*, you can delete the Rule Set by clicking on the three dots on the right and select *Delete*. 

   :::image type="content" source="../media/how-to-configure-rule-set/front-door-disassociate-rule-set-3.png" alt-text="Create a web app in the Azure portal":::

1. The rule set is now deleted.

## Next steps

In this tutorial, you learned how to:

* Create a Rule set
* Associate a rule set to your AFD route.
* Delete a rule set from your AFD profile

To learn how to add security headers with Rule Set, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Security headers with Rules Set](how-to-security-headers.md)
