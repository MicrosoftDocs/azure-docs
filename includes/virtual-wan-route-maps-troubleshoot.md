---
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 05/03/2023
 ms.author: cherylmc
---

### Route map has entered the failed state

Reach out to the preview alias to troubleshoot: 'preview-route-maps@microsoft.com'

### Summary routes aren't showing up as expected

1. Remove the route map, then view the current routes on the connection. Verify that the routes are the routes you expect to see BEFORE a route map is applied.

1. Verify the match condition is set correctly. The match condition is used to select the routes you want to modify.

   * **If you are matching all routes instead of just the ones you selected**: Remember, if a route map is created without a match condition, all routes from the applied connection will be matched.
   * **If you have match conditions and you are still not selecting the routes you would like**: Check the match criterion to ensure it's set correctly. Remember, "equal" matches the exact prefix and "contains" matches prefixes within the route. (e.g 10.2.30.0/24 would be included in a contains for 10.2.0.0/16)  
   * **If you are using the "contains" match criteria**: Verify that your subnetting is correct.

1. Verify the action is set correctly. Summarizing routes requires the "Replace" action.

1. Make sure the "Next step" setting is configured correctly. If you have multiple route maps rules and you aren't seeing the desired output. Make sure the last rule has the "Next step" setting is set to "Terminate". This ensures that no other rules are processed.

1. After making changes, apply the route map to the connection. Then use the route maps dashboard to verify the changes had the desired effect.

### AS-PATH isn't showing up as expected

1. If you're summarizing a set of routes, remember the hub router strips the AS-PATH attributes from those routes. You can add the AS-PATH back in the action section.

1. Remove the route map, then view the current routes on the connection. Verify current routes are the routes you expect to see BEFORE a route map is applied.

1. Verify the match condition is set correctly. The match condition is used to select the routes you want to modify.

   * If you're matching all routes, instead of just the ones you selected: Remember, if a route map is created without match conditions, all routes from the applied connection will be matched.
   * If you have match conditions and you're still not selecting the routes you would like: Check the match Criterion to ensure it's set correctly. Remember, "equal" matches the exact prefix and contains matches prefixes within the route. (e.g 10.2.30.0/24 would be included in a "contains" for 10.2.0.0/16)  
   * If you're using the "contains" match criteria: Verify that your subnetting is correct.

1. Verify the action is set correctly. Make sure the replace or prepend setting is set as desired.

1. When you're adding ASNs to the AS-PATH, verify you aren't using an ASN reserved by Azure.

1. Make sure the "Next step" setting is configured correctly. If you have multiple route maps rules and you aren't seeing the desired output. Make sure the last rule has the "Next step" setting is set to "Terminate". This ensures no other rules are processed.

1. After making changes, apply the route map to the connection. Then use the route maps dashboard to verify the changes had the desired effect.