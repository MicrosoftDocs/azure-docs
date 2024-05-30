---
title: Monitor with geo maps in Azure portal
description: Learn about geo maps for RAN insights resource 
author: delnas
ms.author: delnas
ms.service: private-5g-core
ms.topic: concept-article 
ms.date: 5/28/2024

---


# Monitor with geo maps in Azure portal
Once you have [set up](ran-insights-create-resource.md) your radio access network (RAN) insights resource you can view your RAN insights geo map. Geo maps use Azure Maps to show a graphical display of all access points that are linked to a RAN insights resource along with key [RAN metrics](ran-insights-monitor-with-ran-metrics-concepts.md). They indicate the health condition of access points and let you see the components that are attached to sites.



## Set up geo maps
Geo maps provide a visual understanding of your network by showcasing all access points and their health status. 

To get started, you'll need an existing Azure Maps resource or [create](https://learn.microsoft.com/azure/azure-maps/quick-demo-map-app#create-an-azure-maps-account) a new one. To create a new Azure Map resource: 
1.	Go to the Azure Marketplace, search for Azure Maps.
1.	Select the Azure Map and select on **Create** to create a new Azure Map account.
1.	On the **Basics** tab, use the same subscription and resource group that was used for the RAN insights resource. Enter a name for the Azure Map resource, select the region, and choose the default pricing model. 
    1. Note there's a nominal [cost](https://azure.microsoft.com/pricing/details/azure-maps/#pricing) associated with the Azure Map. This cost is approximately $20/month for an active user, but is subject to variation based on usage frequency.
1.	Select **Review and Create**

Once you have your Azure Map resource, you must now connect it to your Mobile Network Resource in order to view the geo map in the RAN insights resource. 
1.	Navigate to your existing Mobile Network Resource
1.	On the **Overview** blade of the Mobile Network Resource select **Modify mobile network** 
     :::image type="content" source="media/ran-insights/ran-insights-modify-mobile-network.png" alt-text="Screenshot of the Azure portal modify mobile network.":::
3.	In the **Azure map account** section, choose your Azure Map resource. Only the Azure Map resource associated with this subscription appears in the drop-down menu.  
1.	Select **Modify** and wait for the deployment to complete
1.	Navigate to your RAN insights resource 
    1. On your RAN insights resource, ensure you have set up all your access points and their latitude and longitude values. You can modify the values by selecting the access point resource and pressing the **Modify** button. 
1.	Go to the RAN insights resource **Overview** page and select the **Geo Maps** tab. You should now be able to view the Map with access points. 




## Visualize access points using geo maps 
You can hover on the access point to see additional information, such as its name, latitude and longitude, availability rate, number of active UEs, and uplink/downlink throughput values. 
    :::image type="content" source="media/ran-insights/ran-insights-geo-maps.png" alt-text="Screenshot of the Azure portal showing creating a RAN insight resource green pin geo map.":::

The health status is based on the availability rate metric that is the percent of the time that the access point was available during the last sampling period. It indicates green if the metric is 100%, red if 0%, and orange if between 0-100%. If this metric is not supported by the RAN vendor, then the access point will show as red in geo maps. If the access point is removed from the network or not receiving data, it will show red in geo maps.
    :::image type="content" source="media/ran-insights/ran-insights-geo-maps-orange.png" alt-text="Screenshot of the Azure portal showing creating a RAN insight resource orange pin on geo map.":::

Note that all metrics shown are based on current values. To access historical data, please refer to the RAN insights overview page monitoring tab or metrics page. 




## Related content
- [Monitor with RAN metrics](ran-insights-monitor-with-ran-metrics-concepts.md)
- [Monitor with correlated metrics](ran-insights-monitor-with-correlated-metrics-concepts.md)

